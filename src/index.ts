// Main export file
// This file serves as the entry point when used as a package

// CLI entry point
export { main } from "./cli.js";
export { convertToJson } from "./converters/json.js";
// Converters
export {
  convertMultipleToMarkdown,
  convertToMarkdown,
} from "./converters/markdown.js";
export type { ParsedConversation } from "./core/base-handler.js";
export { BaseFormatHandler } from "./core/base-handler.js";
export type { FormatHandler, LoadOptions } from "./core/format-handler.js";
export { defaultRegistry, HandlerRegistry } from "./core/handler-registry.js";
// Core functionality
export { processInput } from "./core/processor.js";
// Handlers
export { ChatGPTHandler, ClaudeHandler } from "./handlers/index.js";
// Types
export type { Conversation, Message } from "./types.js";
export type { FilenameEncoding } from "./utils/filename.js";
export { generateFileName } from "./utils/filename.js";
// Utilities
export { type Options, optionsSchema } from "./utils/options.js";
