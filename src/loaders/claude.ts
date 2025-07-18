import { defaultRegistry } from "../core/handler-registry.js";
import { ClaudeHandler } from "../handlers/claude-handler.js";
import type { Conversation } from "../types.js";

// Register handler if not already registered
if (!defaultRegistry.hasHandler("claude")) {
  defaultRegistry.register(new ClaudeHandler());
}

async function loadClaude(
  data: unknown,
  options: { quiet?: boolean } = {},
): Promise<Conversation[]> {
  // Backward compatibility check
  if (!Array.isArray(data)) {
    throw new Error("Claude export data must be an array");
  }

  const handler = defaultRegistry.getById("claude");
  if (!handler) {
    throw new Error("Claude handler not found");
  }
  return handler.load(data, options);
}
