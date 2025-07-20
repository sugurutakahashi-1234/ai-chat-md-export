import type { Logger } from "../utils/logger.js";
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
   * Factory function to create platform-specific parsers
   * @param platform The platform type (chatgpt, claude)
   * @returns A parser instance for the specified platform
   */
  parserFactory: (platform: string) => PlatformParser;

  /**
   * Factory function to create loggers
   * @param options Logger configuration options
   * @returns A configured logger instance
   */
  loggerFactory: (options: { quiet?: boolean }) => Logger;
}
