import type { OutputFormatter } from "../domain/interfaces/output-formatter.js";
import type { PlatformParser } from "../domain/interfaces/platform-parser.js";
import type { ConversationFilter } from "../infrastructure/filters/conversation-filter.js";
import type { FileLoader } from "../infrastructure/io/file-loader.js";
import type { FileWriter } from "../infrastructure/io/file-writer.js";
import type { Logger } from "../infrastructure/logging/logger.js";

/**
 * Dependencies required by the Processor class
 *
 * This interface makes all dependencies explicit and allows
 * for easy mocking and testing.
 */
export interface ProcessorDependencies {
  /**
   * File loader for reading input files
   */
  fileLoader: FileLoader;

  /**
   * File writer for writing output files
   */
  fileWriter: FileWriter;

  /**
   * Platform-specific parser instance
   */
  parser: PlatformParser;

  /**
   * Output format formatter
   */
  formatter: OutputFormatter;

  /**
   * Filter for conversation filtering
   */
  filter: ConversationFilter;

  /**
   * Logger instance
   */
  logger: Logger;
}
