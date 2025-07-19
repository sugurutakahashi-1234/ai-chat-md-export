import { FormatError } from "../errors/custom-errors.js";
import { ChatGPTHandler } from "../handlers/chatgpt-handler.js";
import { ClaudeHandler } from "../handlers/claude-handler.js";
import type { Options } from "../utils/options.js";
import type { PlatformParser } from "./platform-parser.js";

/**
 * Platform detector for AI chat export data
 *
 * Automatically detects whether the input data is from ChatGPT or Claude,
 * or validates the explicitly specified platform.
 */
export class PlatformDetector {
  private readonly parsers: Record<string, PlatformParser>;

  constructor() {
    // Direct implementation instead of registry pattern
    this.parsers = {
      chatgpt: new ChatGPTHandler(),
      claude: new ClaudeHandler(),
    };
  }

  /**
   * Detect platform or get parser based on options
   *
   * @param data - Raw input data from JSON file
   * @param options - Processing options including platform hint
   * @param filePath - Path to the input file for error reporting
   * @returns Platform-specific parser instance
   */
  detectPlatform(
    data: unknown,
    options: Options,
    filePath: string,
  ): PlatformParser {
    if (options.platform === "auto") {
      // Try each parser's detect method
      for (const parser of Object.values(this.parsers)) {
        if (parser.detect(data)) {
          return parser;
        }
      }
      throw new FormatError("Cannot detect file format", "auto", {
        file: filePath,
        reason: "The file does not match any known format (ChatGPT or Claude)",
      });
    }

    const selectedParser = this.parsers[options.platform];
    if (!selectedParser) {
      throw new FormatError(
        `Unsupported format: ${options.platform}`,
        options.platform,
        {
          file: filePath,
          reason: "Supported formats are: chatgpt, claude, auto",
        },
      );
    }
    return selectedParser;
  }
}
