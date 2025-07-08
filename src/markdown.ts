import type { Conversation } from "./types.js";

export function convertToMarkdown(conversation: Conversation): string {
  const lines: string[] = [];

  lines.push(`# ${conversation.title}`);
  lines.push("");
  lines.push(`日付: ${conversation.date}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const message of conversation.messages) {
    const roleLabel =
      message.role === "user"
        ? "👤 ユーザー"
        : message.role === "assistant"
          ? "🤖 アシスタント"
          : message.role === "system"
            ? "⚙️ システム"
            : "🔧 ツール";

    lines.push(`## ${roleLabel}`);
    if (message.timestamp) {
      lines.push(`*${new Date(message.timestamp).toLocaleString("ja-JP")}*`);
    }
    lines.push("");

    const content = message.content.trim();
    if (content.includes("```")) {
      lines.push(content);
    } else {
      lines.push(escapeMarkdown(content));
    }

    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

function escapeMarkdown(text: string): string {
  // HTMLタグのみエスケープし、マークダウン記法は保持
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // 既にエスケープされた文字を修正
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]");
}
