import { promises as fs } from "node:fs";
import {
  type ClaudeNDJSONConversation,
  claudeNDJSONSchema,
} from "../schemas/claude.js";
import type { Conversation } from "../types.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/schema-validator.js";

export async function loadClaude(filePath: string): Promise<Conversation[]> {
  const content = await fs.readFile(filePath, "utf-8");

  const lines = content.trim().split("\n");
  const conversations: Conversation[] = [];
  const validationErrors: string[] = [];
  const skippedFields = new Set<string>();
  let successCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;

    try {
      const data = JSON.parse(line);
      const result = validateWithDetails(claudeNDJSONSchema, data, {
        name: `行 #${i + 1}`,
      });

      if (!result.success) {
        const report = formatValidationReport(result);
        validationErrors.push(`行 #${i + 1}:\n${report}`);
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

      const parsed = result.data as ClaudeNDJSONConversation;

      const date = parsed.created_at
        ? new Date(parsed.created_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      conversations.push({
        id: parsed.uuid,
        title: parsed.name || "無題の会話",
        date: date as string,
        messages: parsed.chat_messages.map((msg) => ({
          role: msg.sender === "human" ? "user" : "assistant",
          content: msg.text,
          timestamp: msg.created_at,
        })),
      });
    } catch (error) {
      validationErrors.push(
        `行 #${i + 1}: JSONパースエラー - ${error instanceof Error ? error.message : "不明なエラー"}`,
      );
    }
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
