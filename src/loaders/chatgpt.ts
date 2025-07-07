import { promises as fs } from "node:fs";
import {
  type ChatGPTConversation,
  type ChatGPTNode,
  chatGPTConversationSchema,
} from "../schemas/chatgpt.js";
import type { Conversation } from "../types.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/schema-validator.js";

export async function loadChatGPT(filePath: string): Promise<Conversation[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(content);

  if (!Array.isArray(data)) {
    throw new Error("ChatGPTのエクスポートデータは配列である必要があります");
  }

  const conversations: Conversation[] = [];
  const validationErrors: string[] = [];
  const skippedFields = new Set<string>();
  let successCount = 0;

  for (let i = 0; i < data.length; i++) {
    const result = validateWithDetails(chatGPTConversationSchema, data[i], {
      name: `会話 #${i + 1}`,
    });

    if (!result.success) {
      const report = formatValidationReport(result);
      validationErrors.push(`会話 #${i + 1}:\n${report}`);
      continue;
    }

    if (result.warnings) {
      // 未知のフィールドを収集
      for (const warning of result.warnings) {
        if (warning.unknownFields) {
          warning.unknownFields.forEach((field) => skippedFields.add(field));
        }
      }
    }
    successCount++;

    const parsed = result.data as ChatGPTConversation;
    const messages = extractMessages(parsed.mapping);

    const date = parsed.create_time
      ? new Date(parsed.create_time * 1000).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    conversations.push({
      id: parsed.id || Object.keys(parsed.mapping)[0] || "unknown",
      title: parsed.title || "無題の会話",
      date: date as string,
      messages,
    });
  }

  if (validationErrors.length > 0) {
    throw new Error(
      `スキーマ検証エラーが発生しました:\n${validationErrors.join("\n\n")}`,
    );
  }

  // サマリー情報を表示
  console.log(`\n✅ ${successCount}件の会話を正常に読み込みました`);

  if (skippedFields.size > 0) {
    console.log(`\n📋 変換時にスキップされたフィールド:`);
    console.log(`  - ${Array.from(skippedFields).sort().join(", ")}`);
    console.log(`    ※ これらのフィールドは変換後のMarkdownには含まれません`);
  }

  return conversations;
}

function extractMessages(
  mapping: Record<string, ChatGPTNode>,
): Conversation["messages"] {
  const messages: Conversation["messages"] = [];
  const rootNodes = Object.values(mapping).filter(
    (node) =>
      !Object.values(mapping).some((n) => n.children?.includes(node.id)),
  );

  for (const root of rootNodes) {
    traverseNode(root.id, mapping, messages);
  }

  return messages.filter((m) => m.content);
}

function traverseNode(
  nodeId: string,
  mapping: Record<string, ChatGPTNode>,
  messages: Conversation["messages"],
) {
  const node = mapping[nodeId];
  if (!node) return;

  if (node.message?.content?.parts && node.message.content.parts.length > 0) {
    const contentParts = node.message.content.parts
      .map((part) => {
        if (typeof part === "string") {
          return part;
        } else if (part && typeof part === "object") {
          // content_typeとtextフィールドを持つオブジェクトの場合
          if ("text" in part && typeof part.text === "string") {
            return part.text;
          }
          // その他のオブジェクトの場合は文字列化
          return JSON.stringify(part, null, 2);
        }
        return "";
      })
      .filter((part) => part !== "");

    if (contentParts.length > 0) {
      const message: Conversation["messages"][number] = {
        role: node.message.author.role,
        content: contentParts.join("\n"),
      };

      // timestampがある場合のみ追加
      if (node.message.create_time) {
        message.timestamp = new Date(
          node.message.create_time * 1000,
        ).toISOString();
      }

      messages.push(message);
    }
  }

  if (node.children && node.children.length > 0 && node.children[0]) {
    traverseNode(node.children[0], mapping, messages);
  }
}
