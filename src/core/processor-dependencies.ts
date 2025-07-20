import type { Logger } from "../utils/logger.js";
import type { Filter } from "./interfaces/filter.js";
import type { PlatformParser } from "./interfaces/platform-parser.js";
import type { FileLoader } from "./io/file-loader.js";
import type { FileWriter } from "./io/file-writer.js";

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
   * Filter for conversation filtering
   */
  filter: Filter;

  /**
   * Logger instance
   */
  logger: Logger;
}
