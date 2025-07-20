import { ChatGPTParser } from "../../parsers/chatgpt-parser.js";
import { ClaudeParser } from "../../parsers/claude-parser.js";
import type { Options } from "../../utils/options.js";
import type { PlatformParser } from "../interfaces/platform-parser.js";

/**
 * Create a parser instance based on the platform type
 *
 * Centralizes the creation of parsers to remove direct dependencies
 * from the Processor class to concrete handler implementations.
 */
export function createPlatformParser(
  platform: Options["platform"],
): PlatformParser {
  switch (platform) {
    case "chatgpt":
      return new ChatGPTParser();
    case "claude":
      return new ClaudeParser();
    // No default case needed - TypeScript ensures exhaustiveness
  }
}
