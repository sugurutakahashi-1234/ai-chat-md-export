import type { Options } from "../config.js";
import type { Conversation } from "../entities.js";
import type { WriteResult } from "./file-writer.js";

/**
 * Interface for batch writing conversations
 *
 * Handles writing conversations in batches to manage memory usage
 * and provide progress feedback for large datasets.
 */
export interface IConversationBatchWriter {
  /**
   * Write conversations in batches based on options
   *
   * @param conversations - Array of conversations to write
   * @param outputDir - Directory to write files to
   * @param options - Options controlling batch size and output format
   * @returns Combined result of all batch operations
   */
  writeInBatches(
    conversations: Conversation[],
    outputDir: string,
    options: Options,
  ): Promise<WriteResult>;
}
