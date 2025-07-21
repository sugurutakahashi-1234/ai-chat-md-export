import type { ProcessorDependencies } from "../application/dependencies.js";
import { Format, type Options, Platform } from "../domain/config.js";
import { ValidationError } from "../domain/errors.js";
import type { IOutputFormatter } from "../domain/interfaces/output-formatter.js";
import type { IPlatformParser } from "../domain/interfaces/platform-parser.js";
import { ConversationFilter } from "../infrastructure/filters/conversation-filter.js";
import { JsonFormatter } from "../infrastructure/formatters/json-formatter.js";
import { MarkdownFormatter } from "../infrastructure/formatters/markdown-formatter.js";
import { FileLoader } from "../infrastructure/io/file-loader.js";
import { FileWriter } from "../infrastructure/io/file-writer.js";
import { Logger } from "../infrastructure/logging/logger.js";
import { ChatGPTParser } from "../infrastructure/parsers/chatgpt/parser.js";
import { ClaudeParser } from "../infrastructure/parsers/claude/parser.js";
import { SchemaValidator } from "../infrastructure/validation/schema-validator.js";

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
    case Platform.ChatGPT:
      parser = new ChatGPTParser(logger, schemaValidator);
      break;
    case Platform.Claude:
      parser = new ClaudeParser(logger, schemaValidator);
      break;
    default:
      throw new Error(`Unknown platform: ${options.platform}`);
  }

  // Create output formatter based on format option
  let formatter: IOutputFormatter;
  switch (options.format) {
    case Format.Json:
      formatter = new JsonFormatter();
      break;
    case Format.Markdown:
      formatter = new MarkdownFormatter();
      break;
    default:
      throw new ValidationError(
        `Unsupported output format: ${options.format}\nReason: Supported formats are: json, markdown`,
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
