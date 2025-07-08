import { promises as fs } from "node:fs";
import {
  type ClaudeJSONConversation,
  claudeJSONConversationSchema,
} from "../schemas/claude.js";
import type { Conversation } from "../types.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/schema-validator.js";

export async function loadClaudeJSON(
  filePath: string,
): Promise<Conversation[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(content);

  if (!Array.isArray(data)) {
    throw new Error("Claudeのエクスポートデータは配列である必要があります");
  }

  const conversations: Conversation[] = [];
  const validationErrors: string[] = [];
  const skippedFields = new Set<string>();
  let successCount = 0;

  for (let i = 0; i < data.length; i++) {
    const result = validateWithDetails(claudeJSONConversationSchema, data[i], {
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

    const parsed = result.data as ClaudeJSONConversation;

    // 日付の処理を安全に行う
    let date: string;
    try {
      const parsedDate = new Date(parsed.created_at);
      if (!Number.isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split("T")[0] as string;
      } else {
        date = new Date().toISOString().split("T")[0] as string;
      }
    } catch {
      date = new Date().toISOString().split("T")[0] as string;
    }

    conversations.push({
      id: parsed.uuid,
      title: parsed.name || "無題の会話",
      date,
      messages: parsed.chat_messages.map((msg) => {
        // textフィールドから内容を取得
        let content: string = "";

        // 直接textフィールドがある場合
        if ("text" in msg && typeof msg.text === "string") {
          content = msg.text;
        }
        // contentフィールドがある場合（配列形式）
        else if ("content" in msg && Array.isArray(msg.content)) {
          const texts = msg.content
            .map((c) => {
              if (typeof c === "object" && c !== null && "text" in c) {
                return c.text;
              }
              return undefined;
            })
            .filter((t): t is string => typeof t === "string");
          content = texts.length > 0 ? texts.join("\n") : "";
        }
        // roleがある場合（旧形式）
        else if ("role" in msg && "content" in msg) {
          content = typeof msg.content === "string" ? msg.content : "";
        }

        // senderフィールドからroleを判定
        let role: "user" | "assistant";
        if ("sender" in msg) {
          role = msg.sender === "human" ? "user" : "assistant";
        } else if ("role" in msg && msg.role) {
          role = msg.role;
        } else {
          // デフォルト値
          role = "user";
        }

        return {
          role,
          content,
          timestamp: msg.created_at || new Date().toISOString(),
        };
      }),
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
