import { promises as fs } from "node:fs";

export async function detectFormat(
  filePath: string,
): Promise<"chatgpt" | "claude"> {
  const content = await fs.readFile(filePath, "utf-8");

  // Try parsing as JSON first
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      if (data[0]?.mapping) {
        return "chatgpt";
      } else if (data[0]?.chat_messages && data[0]?.uuid) {
        return "claude";
      }
    }
  } catch {
    // Not a valid JSON
  }

  throw new Error(
    `Cannot detect file format. The file should be either:\n` +
      `- ChatGPT export: JSON array with 'mapping' field\n` +
      `- Claude export: JSON array with 'chat_messages' and 'uuid' fields`,
  );
}
