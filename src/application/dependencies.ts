import type { IConversationFilter } from "../domain/interfaces/conversation-filter.js";
import type { IFileLoader } from "../domain/interfaces/file-loader.js";
import type { IFileWriter } from "../domain/interfaces/file-writer.js";
import type { ILogger } from "../domain/interfaces/logger.js";
import type { IOutputFormatter } from "../domain/interfaces/output-formatter.js";
import type { IPlatformParser } from "../domain/interfaces/platform-parser.js";
import type { ISchemaValidator } from "../domain/interfaces/schema-validator.js";
import type { ISpinner } from "../domain/interfaces/spinner.js";

/**
 * Dependencies required by the Processor class
 *
 * This interface makes all dependencies explicit and allows
 * for easy mocking and testing.
 *
 * Design principle: All class dependencies are declared here following
 * the Dependency Inversion Principle (DIP). Concrete implementations
 * are created in the infrastructure layer (processor-factory.ts).
 */
export interface ProcessorDependencies {
  /**
   * File loader for reading input files
   */
  fileLoader: IFileLoader;

  /**
   * File writer for writing output files
   */
  fileWriter: IFileWriter;

  /**
   * Platform-specific parser instance
   */
  parser: IPlatformParser;

  /**
   * Output format formatter
   */
  formatter: IOutputFormatter;

  /**
   * Filter for conversation filtering
   */
  filter: IConversationFilter;

  /**
   * Logger instance
   */
  logger: ILogger;

  /**
   * Schema validator for data validation
   */
  schemaValidator: ISchemaValidator;

  /**
   * Spinner for progress display
   */
  spinner: ISpinner;
}
