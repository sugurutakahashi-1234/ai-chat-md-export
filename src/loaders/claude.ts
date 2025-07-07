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
        console.warn(formatValidationReport(result));
      }

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

  return conversations;
}
