// Main export file
// This file serves as the entry point when used as a package

export {
  detectFormat,
  main,
  type Options,
  optionsSchema,
  processDirectory,
  processFile,
  processInput,
} from "./cli.js";
export { loadChatGPT } from "./loaders/chatgpt.js";
export { loadClaude } from "./loaders/claude.js";
export { convertToMarkdown } from "./markdown.js";
export type { Conversation, Message } from "./types.js";
export type { FilenameEncoding } from "./utils/filename.js";
export {
  generateFileName,
  sanitizeFileName,
  sanitizeFileNameSimple,
  sanitizeFileNameUnicode,
} from "./utils/filename.js";
