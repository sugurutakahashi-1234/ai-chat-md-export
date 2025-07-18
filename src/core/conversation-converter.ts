import { registerDefaultConverters } from "../converters/index.js";
import type { Conversation } from "../types.js";
import type { Options } from "../utils/options.js";
import { defaultConverterRegistry } from "./converter-registry.js";
import type { OutputConverter } from "./output-converter.js";

// Initialize default converters on module load
registerDefaultConverters();

export class ConversationConverter {
  private getConverter(options: Options): OutputConverter {
    const converter = defaultConverterRegistry.getById(options.format);
    if (!converter) {
      throw new Error(`Unsupported output format: ${options.format}`);
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
