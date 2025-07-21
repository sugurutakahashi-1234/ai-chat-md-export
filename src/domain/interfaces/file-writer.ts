import type { Options } from "../config.js";
import type { Conversation } from "../entities.js";

/**
 * Result of file writing operations
 */
export interface WriteResult {
  successCount: number;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Interface for file writing operations
 *
 * Defines the contract for writing conversation data to the file system.
 */
export interface IFileWriter {
  /**
   * Write conversations to files based on options
   *
   * @param conversations - Array of conversations to write
   * @param outputDir - Directory to write files to
   * @param options - Options controlling how files are written
   * @returns Result containing success count and any errors
   * @throws FileError if critical write errors occur
   */
  writeConversations(
    conversations: Conversation[],
    outputDir: string,
    options: Options,
  ): Promise<WriteResult>;
}
