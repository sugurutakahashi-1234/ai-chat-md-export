import { FormatError } from "../errors/custom-errors.js";
import type { Options } from "../utils/options.js";
import type { FormatHandler } from "./format-handler.js";
import type { HandlerRegistry } from "./handler-registry.js";

export class FormatDetector {
  private readonly handlerRegistry: HandlerRegistry;

  constructor(handlerRegistry: HandlerRegistry) {
    this.handlerRegistry = handlerRegistry;
  }
  /**
   * Detect or get format handler based on options
   */
  detectHandler(
    data: unknown,
    options: Options,
    filePath: string,
  ): FormatHandler {
    if (options.platform === "auto") {
      const detectedHandler = this.handlerRegistry.detectFormat(data);
      if (!detectedHandler) {
        throw new FormatError("Cannot detect file format", "auto", {
          file: filePath,
          reason:
            "The file does not match any known format (ChatGPT or Claude)",
        });
      }
      return detectedHandler;
    }

    const selectedHandler = this.handlerRegistry.getById(options.platform);
    if (!selectedHandler) {
      throw new FormatError(
        `Unsupported format: ${options.platform}`,
        options.platform,
        {
          file: filePath,
          reason: "Supported formats are: chatgpt, claude, auto",
        },
      );
    }
    return selectedHandler;
  }
}
