import type { OutputFormatter } from "../core/output-formatter.js";
import type { Conversation } from "../types.js";
import { convertMultipleToMarkdown, convertToMarkdown } from "./markdown.js";

/**
 * Markdown output formatter
 *
 * Formats conversations as Markdown for human-readable
 * documentation and easy sharing.
 */
export class MarkdownConverter implements OutputFormatter {
  readonly extension = ".md";

  convertSingle(conversation: Conversation): string {
    return convertToMarkdown(conversation);
  }

  convertMultiple(conversations: Conversation[]): string {
    return convertMultipleToMarkdown(conversations);
  }

  getDefaultFilename(): string {
    return "all-conversations.md";
  }
}
