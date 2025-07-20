import type { ProcessorDependencies } from "../../application/dependencies.js";
import type { OutputFormatter } from "../../domain/interfaces/output-formatter.js";
import type { PlatformParser } from "../../domain/interfaces/platform-parser.js";
import type { Options } from "../../shared/config/options.js";
import { ValidationError } from "../../shared/errors/errors.js";
import { formatErrorMessage } from "../../shared/errors/formatter.js";
import { ConversationFilter } from "../filters/conversation-filter.js";
import { JsonConverter } from "../formatters/json.js";
import { MarkdownConverter } from "../formatters/markdown.js";
import { FileLoader } from "../io/file-loader.js";
import { FileWriter } from "../io/file-writer.js";
import { Logger } from "../logging/logger.js";
import { ChatGPTParser } from "../parsers/chatgpt/parser.js";
import { ClaudeParser } from "../parsers/claude/parser.js";

/**
 * Create default dependencies for the Processor
 *
 * This factory provides the standard implementations
 * for all processor dependencies.
 */
export function createDefaultDependencies(
  options: Options,
): ProcessorDependencies {
  const logger = new Logger({ quiet: options.quiet });

  // Create platform-specific parser
  let parser: PlatformParser;
  switch (options.platform) {
    case "chatgpt":
      parser = new ChatGPTParser(logger);
      break;
    case "claude":
      parser = new ClaudeParser(logger);
      break;
    default:
      throw new Error(`Unknown platform: ${options.platform}`);
  }

  // Create output formatter based on format option
  let formatter: OutputFormatter;
  switch (options.format) {
    case "json":
      formatter = new JsonConverter();
      break;
    case "markdown":
      formatter = new MarkdownConverter();
      break;
    default:
      throw new ValidationError(
        formatErrorMessage(`Unsupported output format: ${options.format}`, {
          reason: "Supported formats are: json, markdown",
        }),
        { format: options.format },
      );
  }

  return {
    fileLoader: new FileLoader(),
    fileWriter: new FileWriter(logger, formatter),
    parser,
    formatter,
    filter: new ConversationFilter(),
    logger,
  };
}

/**
 * Create dependencies with partial overrides
 *
 * Useful for testing or custom configurations where
 * only specific dependencies need to be replaced.
 *
 * @param overrides Partial dependencies to override defaults
 * @returns Complete processor dependencies
 */
export function createDefaultDependenciesWithOverrides(
  options: Options,
  overrides?: Partial<ProcessorDependencies>,
): ProcessorDependencies {
  const defaults = createDefaultDependencies(options);
  return {
    ...defaults,
    ...overrides,
  };
}
