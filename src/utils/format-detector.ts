import { defaultRegistry } from "../core/handler-registry.js";
import { registerDefaultHandlers } from "../handlers/index.js";

// Ensure handlers are registered
registerDefaultHandlers();

function detectFormat(data: unknown): "chatgpt" | "claude" {
  const handler = defaultRegistry.detectFormat(data);
  if (!handler) {
    throw new Error(
      `Cannot detect file format. The file should be either:\n` +
        `- ChatGPT export: JSON array with 'mapping' field\n` +
        `- Claude export: JSON array with 'chat_messages' and 'uuid' fields`,
    );
  }
  return handler.id as "chatgpt" | "claude";
}
