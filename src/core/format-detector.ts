import { FormatError } from "../errors/custom-errors.js";
import { ChatGPTHandler } from "../handlers/chatgpt-handler.js";
import { ClaudeHandler } from "../handlers/claude-handler.js";
import type { Options } from "../utils/options.js";
import type { FormatHandler } from "./format-handler.js";

export class FormatDetector {
  private readonly handlers: Record<string, FormatHandler>;

  constructor() {
    // Direct implementation instead of registry pattern
    this.handlers = {
      chatgpt: new ChatGPTHandler(),
      claude: new ClaudeHandler(),
    };
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
      // Try each handler's detect method
      for (const handler of Object.values(this.handlers)) {
        if (handler.detect(data)) {
          return handler;
        }
      }
      throw new FormatError("Cannot detect file format", "auto", {
        file: filePath,
        reason: "The file does not match any known format (ChatGPT or Claude)",
      });
    }

    const selectedHandler = this.handlers[options.platform];
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
