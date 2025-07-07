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
      console.warn(formatValidationReport(result));
    }

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
        // contentがある場合はその中のtextを結合
        let content: string;
        if (typeof msg.content === "string") {
          content = msg.content;
        } else if (Array.isArray(msg.content)) {
          const texts = msg.content
            .map((c) => c.text)
            .filter((t): t is string => t !== undefined);
          content = texts.length > 0 ? texts.join("\n") : "";
        } else {
          content = "";
        }

        return {
          role: msg.role,
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

  return conversations;
}
