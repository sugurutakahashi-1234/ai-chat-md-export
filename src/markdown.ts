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
      lines.push(`*${formatTimestamp(message.timestamp)}*`);
    }
    lines.push("");

    const content = message.content.trim();
    lines.push(processContent(content));

    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

function processContent(text: string): string {
  // "This block is not supported" メッセージの処理
  if (text.includes("This block is not supported")) {
    return text.replace(
      /```\s*This block is not supported.*?```/gs,
      "*[ツール使用: 対応していないブロック]*"
    );
  }

  // コードブロックを保護
  const codeBlocks: string[] = [];
  let processedText = text.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${index}__`;
  });

  // インラインコードを保護
  const inlineCodes: string[] = [];
  processedText = processedText.replace(/`[^`]+`/g, (match) => {
    const index = inlineCodes.length;
    inlineCodes.push(match);
    return `__INLINE_CODE_${index}__`;
  });

  // エスケープ処理
  processedText = escapeMarkdown(processedText);

  // 保護したコードを復元
  processedText = processedText.replace(/__INLINE_CODE_(\d+)__/g, (_, index) => {
    return inlineCodes[Number(index)] || "";
  });

  processedText = processedText.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
    return codeBlocks[Number(index)] || "";
  });

  return processedText;
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

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  // 日本時間（JST）で表示
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
    hour12: false,
  };
  
  return new Intl.DateTimeFormat("ja-JP", options).format(date);
}
