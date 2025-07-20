import type { ConversationFilter } from "../domain/interfaces/conversation-filter.js";
import type { FileLoader } from "../domain/interfaces/file-loader.js";
import type { FileWriter } from "../domain/interfaces/file-writer.js";
import type { Logger } from "../domain/interfaces/logger.js";
import type { OutputFormatter } from "../domain/interfaces/output-formatter.js";
import type { PlatformParser } from "../domain/interfaces/platform-parser.js";

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
