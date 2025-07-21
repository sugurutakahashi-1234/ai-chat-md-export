import { promises as fs } from "node:fs";
import path from "node:path";
import {
  FILE_EXTENSIONS,
  FilenameEncoding,
  type Options,
} from "../../domain/config.js";
import type { Conversation } from "../../domain/entities.js";
import { FileError, FileOperation } from "../../domain/errors.js";
import type {
  IFileWriter,
  WriteResult,
} from "../../domain/interfaces/file-writer.js";
import type { ILogger } from "../../domain/interfaces/logger.js";
import type { IOutputFormatter } from "../../domain/interfaces/output-formatter.js";
import { extractErrorMessage } from "../../domain/utils/error.js";
import { generateFileName } from "../../domain/utils/filename.js";
import { formatRelativePathFromCwd } from "../../domain/utils/path.js";

/**
 * File writer for conversation data
 *
 * Handles writing converted conversations to the file system,
 * including directory creation, file naming, and error handling.
 */
export class FileWriter implements IFileWriter {
  constructor(
    private readonly logger: ILogger,
    private readonly formatter: IOutputFormatter,
  ) {}
  /**
   * Write conversations to files based on options
   */
  async writeConversations(
    conversations: Conversation[],
    outputDir: string,
    options: Options,
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
    options: Options,
  ): Promise<WriteResult> {
    const writeErrors: Array<{ file: string; error: string }> = [];
    let successCount = 0;

    for (const conv of conversations) {
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
        this.logger.output(
          formatRelativePathFromCwd(outputPath),
          options.dryRun,
        );
        successCount++;
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        writeErrors.push({ file: outputPath, error: errorMessage });

        this.logger.warn(
          `Failed to write file: ${formatRelativePathFromCwd(outputPath)}\nReason: ${errorMessage}`,
        );
      }
    }

    this.reportErrors(writeErrors);
    return { successCount, errors: writeErrors };
  }

  private async writeCombinedFile(
    conversations: Conversation[],
    outputDir: string,
    options: Options,
  ): Promise<WriteResult> {
    const writeErrors: Array<{ file: string; error: string }> = [];

    const content = this.formatter.formatMultiple(conversations);
    const fileName = this.formatter.getDefaultFilename();
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!options.dryRun) {
        await fs.writeFile(outputPath, content, "utf-8");
      }
      this.logger.output(formatRelativePathFromCwd(outputPath), options.dryRun);
      this.logger.stat(
        "Combined",
        `${conversations.length} conversations into one file`,
      );
      return { successCount: conversations.length, errors: [] };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      writeErrors.push({ file: outputPath, error: errorMessage });

      this.logger.warn(
        `Failed to write file: ${formatRelativePathFromCwd(outputPath)}\nReason: ${errorMessage}`,
      );

      this.reportErrors(writeErrors);
      return { successCount: 0, errors: writeErrors };
    }
  }

  private reportErrors(
    writeErrors: Array<{ file: string; error: string }>,
  ): void {
    if (writeErrors.length > 0) {
      const errorDetails =
        writeErrors.length <= 3
          ? writeErrors
              .map((e) => `${formatRelativePathFromCwd(e.file)}: ${e.error}`)
              .join("\n")
          : `First 3 errors:\n${writeErrors
              .slice(0, 3)
              .map((e) => `${formatRelativePathFromCwd(e.file)}: ${e.error}`)
              .join("\n")}\n...and ${writeErrors.length - 3} more`;

      const errorSummary = `Failed to write ${writeErrors.length} file(s)\nReason: ${errorDetails}`;

      throw new FileError(
        errorSummary,
        writeErrors[0]?.file || "multiple",
        FileOperation.Write,
        {
          totalErrors: writeErrors.length,
          errors: writeErrors.slice(0, 3),
        },
      );
    }
  }
}
