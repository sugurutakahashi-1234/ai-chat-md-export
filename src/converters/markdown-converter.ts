import type { OutputConverter } from "../core/output-converter.js";
import type { Conversation } from "../types.js";
import { convertMultipleToMarkdown, convertToMarkdown } from "./markdown.js";

export class MarkdownConverter implements OutputConverter {
  readonly id = "markdown";
  readonly name = "Markdown";
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
