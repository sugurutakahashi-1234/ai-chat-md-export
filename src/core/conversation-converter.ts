import { JsonConverter } from "../converters/json-converter.js";
import { MarkdownConverter } from "../converters/markdown-converter.js";
import type { Conversation } from "../types.js";
import { formatErrorMessage } from "../utils/error-formatter.js";
import type { Options } from "../utils/options.js";
import type { OutputConverter } from "./output-converter.js";

export class ConversationConverter {
  private readonly converters: Record<string, OutputConverter>;

  constructor() {
    // Direct implementation instead of registry pattern
    this.converters = {
      json: new JsonConverter(),
      markdown: new MarkdownConverter(),
    };
  }

  private getConverter(options: Options): OutputConverter {
    const converter = this.converters[options.format];
    if (!converter) {
      throw new Error(
        formatErrorMessage(`Unsupported output format: ${options.format}`, {
          reason: "Supported formats are: json, markdown",
        }),
      );
    }
    return converter;
  }

  /**
   * Convert conversations based on output format
   */
  convertSingle(conversation: Conversation, options: Options): string {
    const converter = this.getConverter(options);
    return converter.convertSingle(conversation);
  }

  /**
   * Convert multiple conversations based on output format
   */
  convertMultiple(conversations: Conversation[], options: Options): string {
    const converter = this.getConverter(options);
    return converter.convertMultiple(conversations);
  }

  /**
   * Get file extension based on format
   */
  getExtension(options: Options): string {
    const converter = this.getConverter(options);
    return converter.extension;
  }

  /**
   * Get default filename for combined output
   */
  getDefaultFilename(options: Options): string {
    const converter = this.getConverter(options);
    return converter.getDefaultFilename();
  }
}
