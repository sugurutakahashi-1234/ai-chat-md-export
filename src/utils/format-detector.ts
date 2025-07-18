export function detectFormat(data: unknown): "chatgpt" | "claude" {
  if (Array.isArray(data) && data.length > 0) {
    if (data[0]?.mapping) {
      return "chatgpt";
    } else if (data[0]?.chat_messages && data[0]?.uuid) {
      return "claude";
    }
  }

  throw new Error(
    `Cannot detect file format. The file should be either:\n` +
      `- ChatGPT export: JSON array with 'mapping' field\n` +
      `- Claude export: JSON array with 'chat_messages' and 'uuid' fields`,
  );
}
