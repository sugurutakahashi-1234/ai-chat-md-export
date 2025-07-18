import { defaultRegistry } from "../core/handler-registry.js";
import { ChatGPTHandler } from "./chatgpt-handler.js";
import { ClaudeHandler } from "./claude-handler.js";

// Register default handlers
let handlersRegistered = false;
export function registerDefaultHandlers(): void {
  if (handlersRegistered) return;

  defaultRegistry.register(new ChatGPTHandler());
  defaultRegistry.register(new ClaudeHandler());
  handlersRegistered = true;
}

// Export handler classes for testing and extension
export { ChatGPTHandler } from "./chatgpt-handler.js";
export { ClaudeHandler } from "./claude-handler.js";
