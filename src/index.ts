// Main export file
// This file serves as the entry point when used as a package

// CLI entry point
export { main } from "./cli.js";
export {
  convertSingleConversationToJson,
  convertToJson,
} from "./converters/json.js";
// Converters
export {
  convertMultipleToMarkdown,
  convertToMarkdown,
} from "./converters/markdown.js";
// Core functionality
export {
  processDirectory,
  processFile,
  processInput,
} from "./core/processor.js";
// Loaders
export { loadChatGPT } from "./loaders/chatgpt.js";
export { loadClaude } from "./loaders/claude.js";
// Types
export type { Conversation, Message } from "./types.js";
export type { FilenameEncoding } from "./utils/filename.js";
export { generateFileName } from "./utils/filename.js";
// Utilities
export { detectFormat } from "./utils/format-detector.js";
export { type Options, optionsSchema } from "./utils/options.js";
