import type { ProcessorDependencies } from "../../application/dependencies.js";
import type { Options } from "../../domain/config.js";
import { ValidationError } from "../../domain/errors.js";
import type { IOutputFormatter } from "../../domain/interfaces/output-formatter.js";
import type { IPlatformParser } from "../../domain/interfaces/platform-parser.js";
import { ConversationFilter } from "../filters/conversation-filter.js";
import { JsonFormatter } from "../formatters/json-formatter.js";
import { MarkdownFormatter } from "../formatters/markdown-formatter.js";
import { FileLoader } from "../io/file-loader.js";
import { FileWriter } from "../io/file-writer.js";
import { Logger } from "../logging/logger.js";
import { ChatGPTParser } from "../parsers/chatgpt/parser.js";
import { ClaudeParser } from "../parsers/claude/parser.js";
import { formatErrorMessage } from "../utils/error-formatter.js";
import { SchemaValidator } from "../validation/schema-validator.js";

/**
 * Create processor dependencies based on options
 *
 * This factory provides the standard implementations
 * for all processor dependencies.
 *
 * Design principle: This is the central place where all concrete
 * implementations are instantiated and wired together. Following
 * the Dependency Inversion Principle, the application layer depends
 * only on interfaces, while this factory handles the concrete classes.
 */
export function createProcessorDependencies(
  options: Options,
): ProcessorDependencies {
  const logger = new Logger({ quiet: options.quiet });
  const schemaValidator = new SchemaValidator();

  // Create platform-specific parser
  let parser: IPlatformParser;
  switch (options.platform) {
    case "chatgpt":
      parser = new ChatGPTParser(logger, schemaValidator);
      break;
    case "claude":
      parser = new ClaudeParser(logger, schemaValidator);
      break;
    default:
      throw new Error(`Unknown platform: ${options.platform}`);
  }

  // Create output formatter based on format option
  let formatter: IOutputFormatter;
  switch (options.format) {
    case "json":
      formatter = new JsonFormatter();
      break;
    case "markdown":
      formatter = new MarkdownFormatter();
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
    schemaValidator,
  };
}
