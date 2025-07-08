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
  // Process "This block is not supported" messages
  if (text.includes("This block is not supported")) {
    return text.replace(
      /```\s*This block is not supported.*?```/gs,
      "*[Tool Use: Unsupported Block]*",
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
    return codeBlocks[Number(index)] || "";
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

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  // Display in Japan time (JST)
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

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
