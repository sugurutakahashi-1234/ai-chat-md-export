import type { Options } from "../../domain/config.js";
import type { Conversation } from "../../domain/entities.js";
import type { IConversationBatchWriter } from "../../domain/interfaces/conversation-batch-writer.js";
import type { IConversationFilter } from "../../domain/interfaces/conversation-filter.js";
import type {
  IFileWriter,
  WriteResult,
} from "../../domain/interfaces/file-writer.js";
import type { ILogger } from "../../domain/interfaces/logger.js";

/**
 * Batch writer for conversations
 *
 * Processes conversations in batches to manage memory usage
 * and provide progress feedback for large datasets.
 */
export class ConversationBatchWriter implements IConversationBatchWriter {
  constructor(
    private readonly filter: IConversationFilter,
    private readonly fileWriter: IFileWriter,
    private readonly logger: ILogger,
  ) {}

  async writeInBatches(
    conversations: Conversation[],
    outputDir: string,
    options: Options,
  ): Promise<WriteResult> {
    // If no batch size specified, process all at once
    const batchSize = options.batchSize || conversations.length;
    const totalResult: WriteResult = { successCount: 0, errors: [] };

    // Process conversations in batches
    for (let i = 0; i < conversations.length; i += batchSize) {
      const batch = conversations.slice(i, i + batchSize);

      // Apply filters to the batch
      const filtered = this.filter.filterConversations(batch, options);

      // Write the filtered batch
      const result = await this.fileWriter.writeConversations(
        filtered,
        outputDir,
        options,
      );

      // Merge results
      totalResult.successCount += result.successCount;
      totalResult.errors.push(...result.errors);

      // Show progress for batch processing
      if (!options.quiet && batchSize < conversations.length) {
        const processed = Math.min(i + batchSize, conversations.length);
        this.logger.info(
          `Processed ${processed} / ${conversations.length} conversations`,
        );
      }

      // Hint for garbage collection after each batch
      if (global.gc && batchSize < conversations.length) {
        global.gc();
      }
    }

    return totalResult;
  }
}
