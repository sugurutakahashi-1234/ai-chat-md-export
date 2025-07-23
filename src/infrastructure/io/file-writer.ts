import { promises as fs } from "node:fs";
import path from "node:path";
import {
  FILE_EXTENSIONS,
  FilenameEncoding,
  type WriteOptions,
} from "../../domain/config.js";
import type { Conversation } from "../../domain/entities.js";
import type {
  IFileWriter,
  WriteResult,
  WrittenFile,
} from "../../domain/interfaces/file-writer.js";
import type { IOutputFormatter } from "../../domain/interfaces/output-formatter.js";
import type { ISpinner } from "../../domain/interfaces/spinner.js";
import { extractErrorMessage } from "../../domain/utils/error.js";
import { generateFileName } from "../../domain/utils/filename.js";

/**
 * File writer for conversation data
 *
 * Handles writing converted conversations to the file system,
 * including directory creation, file naming, and error handling.
 */
export class FileWriter implements IFileWriter {
  constructor(
    private readonly formatter: IOutputFormatter,
    private readonly spinner?: ISpinner,
  ) {}
  /**
   * Write conversations to files based on options
   */
  async writeConversations(
    conversations: Conversation[],
    outputDir: string,
    options: WriteOptions,
  ): Promise<WriteResult> {
    // Only create output directory if we have files to write
    if (!options.dryRun && conversations.length > 0) {
      await fs.mkdir(outputDir, { recursive: true });
    }

    if (options.split) {
      return this.writeSplitFiles(conversations, outputDir, options);
    }
    return this.writeCombinedFile(conversations, outputDir, options);
  }

  private async writeSplitFiles(
    conversations: Conversation[],
    outputDir: string,
    options: WriteOptions,
  ): Promise<WriteResult> {
    const writeErrors: Array<{ file: string; error: string }> = [];
    const writtenFiles: WrittenFile[] = [];
    let successCount = 0;

    // Start spinner if provided
    if (this.spinner && conversations.length > 0) {
      this.spinner.start(`Writing files (0/${conversations.length})`);
    }

    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i];
      if (!conv) continue;

      // Update spinner text with progress
      if (this.spinner && conversations.length > 0) {
        this.spinner.update(`Writing files (${i + 1}/${conversations.length})`);
      }
      const content = this.formatter.formatSingle(conv);
      const extension = FILE_EXTENSIONS[this.formatter.format];
      const filenameEncoding =
        options.filenameEncoding ?? FilenameEncoding.Standard;
      const fileName = generateFileName(
        conv.date,
        conv.title,
        filenameEncoding,
      ).replace(/\.md$/, extension);
      const outputPath = path.join(outputDir, fileName);

      try {
        if (!options.dryRun) {
          await fs.writeFile(outputPath, content, "utf-8");
        }
        // Collect success information
        writtenFiles.push({
          path: outputPath,
          conversationTitle: conv.title,
          date: conv.date,
        });
        successCount++;
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        writeErrors.push({ file: outputPath, error: errorMessage });

        // Collect errors without logging to avoid spinner conflicts
      }
    }

    // Don't stop spinner here - let ResultReporter handle it

    return {
      successCount,
      errors: writeErrors,
      writtenFiles,
      outputFormat: this.formatter.format,
      splitMode: true,
      outputDir,
      dryRun: options.dryRun ?? false,
    };
  }

  private async writeCombinedFile(
    conversations: Conversation[],
    outputDir: string,
    options: WriteOptions,
  ): Promise<WriteResult> {
    const writeErrors: Array<{ file: string; error: string }> = [];
    const writtenFiles: WrittenFile[] = [];

    const content = this.formatter.formatMultiple(conversations);
    const fileName = this.formatter.getDefaultFilename();
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!options.dryRun) {
        await fs.writeFile(outputPath, content, "utf-8");
      }
      // Collect success information for combined file
      writtenFiles.push({
        path: outputPath,
        conversationTitle: `Combined ${conversations.length} conversations`,
        date: new Date(),
      });

      return {
        successCount: conversations.length,
        errors: [],
        writtenFiles,
        outputFormat: this.formatter.format,
        splitMode: false,
        outputDir,
        dryRun: options.dryRun ?? false,
      };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      writeErrors.push({ file: outputPath, error: errorMessage });

      // Collect errors without logging to avoid spinner conflicts

      return {
        successCount: 0,
        errors: writeErrors,
        writtenFiles: [],
        outputFormat: this.formatter.format,
        splitMode: false,
        outputDir,
        dryRun: options.dryRun ?? false,
      };
    }
  }
}
