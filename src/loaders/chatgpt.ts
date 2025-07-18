import { defaultRegistry } from "../core/handler-registry.js";
import { ChatGPTHandler } from "../handlers/chatgpt-handler.js";
import type { Conversation } from "../types.js";

// Register handler if not already registered
if (!defaultRegistry.hasHandler("chatgpt")) {
  defaultRegistry.register(new ChatGPTHandler());
}

async function loadChatGPT(
  data: unknown,
  options: { quiet?: boolean } = {},
): Promise<Conversation[]> {
  // Backward compatibility check
  if (!Array.isArray(data)) {
    throw new Error("ChatGPT export data must be an array");
  }

  const handler = defaultRegistry.getById("chatgpt");
  if (!handler) {
    throw new Error("ChatGPT handler not found");
  }
  return handler.load(data, options);
}
