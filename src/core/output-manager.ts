import { JsonConverter } from "../converters/json.js";
import { MarkdownConverter } from "../converters/markdown.js";
import type { Conversation } from "../types.js";
import { formatErrorMessage } from "../utils/error-formatter.js";
import type { Options } from "../utils/options.js";
import type { OutputFormatter } from "./interfaces/output-formatter.js";

/**
 * Output manager for conversation data
 *
 * Manages the conversion of conversations from the common format
 * to various output formats (Markdown, JSON). Acts as a factory
 * and coordinator for output formatters.
 */
export class OutputManager {
  private readonly formatters: Record<string, OutputFormatter>;

  constructor() {
    // Direct implementation instead of registry pattern
    this.formatters = {
      json: new JsonConverter(),
      markdown: new MarkdownConverter(),
    };
  }

  private getFormatter(options: Options): OutputFormatter {
    const formatter = this.formatters[options.format];
    if (!formatter) {
      throw new Error(
        formatErrorMessage(`Unsupported output format: ${options.format}`, {
          reason: "Supported formats are: json, markdown",
        }),
      );
    }
    return formatter;
  }

  /**
   * Format a single conversation based on output format
   *
   * @param conversation - Conversation to format
   * @param options - Options including output format
   * @returns Formatted string representation
   */
  convertSingle(conversation: Conversation, options: Options): string {
    const formatter = this.getFormatter(options);
    return formatter.convertSingle(conversation);
  }

  /**
   * Format multiple conversations based on output format
   *
   * @param conversations - Array of conversations to format
   * @param options - Options including output format
   * @returns Formatted string representation
   */
  convertMultiple(conversations: Conversation[], options: Options): string {
    const formatter = this.getFormatter(options);
    return formatter.convertMultiple(conversations);
  }

  /**
   * Get file extension based on format
   *
   * @param options - Options including output format
   * @returns File extension (e.g., ".md", ".json")
   */
  getExtension(options: Options): string {
    const formatter = this.getFormatter(options);
    return formatter.extension;
  }

  /**
   * Get default filename for combined output
   *
   * @param options - Options including output format
   * @returns Default filename (e.g., "all-conversations.md")
   */
  getDefaultFilename(options: Options): string {
    const formatter = this.getFormatter(options);
    return formatter.getDefaultFilename();
  }
}
