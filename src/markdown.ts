import type { Conversation } from "./types.js";

export function convertToMarkdown(conversation: Conversation): string {
  const lines: string[] = [];

  lines.push(`# ${conversation.title}`);
  lines.push("");
  lines.push(`Date: ${conversation.date}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const message of conversation.messages) {
    const roleLabel =
      message.role === "user"
        ? "👤 User"
        : message.role === "assistant"
          ? "🤖 Assistant"
          : message.role === "system"
            ? "⚙️ System"
            : "🔧 Tool";

    lines.push(`## ${roleLabel}`);
    if (message.timestamp) {
      lines.push(`Date: ${formatTimestamp(message.timestamp)}`);
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
  // Process "This block is not supported" messages - keep it simple and generic
  if (text.includes("This block is not supported")) {
    return text.replace(
      /```\s*(This block is not supported[^`]*?)```/gs,
      (_, content) => `*[Unsupported: ${content.trim()}]*`,
    );
  }

  // Protect code blocks
  const codeBlocks: string[] = [];
  let processedText = text.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${index}__`;
  });

  // Protect inline code
  const inlineCodes: string[] = [];
  processedText = processedText.replace(/`[^`]+`/g, (match) => {
    const index = inlineCodes.length;
    inlineCodes.push(match);
    return `__INLINE_CODE_${index}__`;
  });

  // Escape processing
  processedText = escapeMarkdown(processedText);

  // Restore protected code
  processedText = processedText.replace(
    /__INLINE_CODE_(\d+)__/g,
    (_, index) => {
      return inlineCodes[Number(index)] || "";
    },
  );

  processedText = processedText.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
    const codeBlock = codeBlocks[Number(index)] || "";
    // Unescape HTML entities in code blocks
    return codeBlock
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  });

  return processedText;
}

function escapeMarkdown(text: string): string {
  // Escape only HTML tags, preserve markdown syntax
  return (
    text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Fix already escaped characters
      .replace(/\\\*/g, "*")
      .replace(/\\_/g, "_")
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]")
  );
}

function formatTimestamp(timestamp: Date): string {
  const date = timestamp;
  // Format with timezone offset only
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Get timezone offset
  const tzOffset = -date.getTimezoneOffset();
  const tzHours = Math.floor(Math.abs(tzOffset) / 60);
  const tzMinutes = Math.abs(tzOffset) % 60;
  const tzSign = tzOffset >= 0 ? "+" : "-";
  const tzString = `${tzSign}${String(tzHours).padStart(2, "0")}:${String(tzMinutes).padStart(2, "0")}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${tzString}`;
}
