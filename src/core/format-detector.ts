import { formatErrorMessage } from "../utils/error-formatter.js";
import type { Options } from "../utils/options.js";
import type { FormatHandler } from "./format-handler.js";
import { defaultRegistry } from "./handler-registry.js";

export class FormatDetector {
  /**
   * Detect or get format handler based on options
   */
  detectHandler(
    data: unknown,
    options: Options,
    filePath: string,
  ): FormatHandler {
    if (options.platform === "auto") {
      const detectedHandler = defaultRegistry.detectFormat(data);
      if (!detectedHandler) {
        throw new Error(
          formatErrorMessage("Cannot detect file format", {
            file: filePath,
            reason:
              "The file does not match any known format (ChatGPT or Claude)",
          }),
        );
      }
      return detectedHandler;
    }

    const selectedHandler = defaultRegistry.getById(options.platform);
    if (!selectedHandler) {
      throw new Error(
        formatErrorMessage(`Unsupported format: ${options.platform}`, {
          file: filePath,
          reason: "Supported formats are: chatgpt, claude, auto",
        }),
      );
    }
    return selectedHandler;
  }
}
