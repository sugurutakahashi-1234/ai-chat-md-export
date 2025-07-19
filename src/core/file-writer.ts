import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { Conversation } from "../types.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../utils/error-formatter.js";
import { generateFileName } from "../utils/filename.js";
import { createLogger } from "../utils/logger.js";
import type { Options } from "../utils/options.js";
import { createTypeGuard } from "../utils/type-guards.js";
import { ConversationConverter } from "./conversation-converter.js";

export interface WriteResult {
  successCount: number;
  errors: Array<{ file: string; error: string }>;
}

const filenameEncodingSchema = z.enum(["standard", "preserve"]);
const isFilenameEncoding = createTypeGuard(filenameEncodingSchema);

export class FileWriter {
  private readonly converter: ConversationConverter;

  constructor() {
    this.converter = new ConversationConverter();
  }

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
    const logger = createLogger({ quiet: options.quiet });
    const writeErrors: Array<{ file: string; error: string }> = [];
    let successCount = 0;

    for (const conv of conversations) {
      const content = this.converter.convertSingle(conv, options);
      const extension = this.converter.getExtension(options);
      const filenameEncoding = isFilenameEncoding(options.filenameEncoding)
        ? options.filenameEncoding
        : "standard";
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
        logger.output(getRelativePath(outputPath), options.dryRun);
        successCount++;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        writeErrors.push({ file: outputPath, error: errorMessage });

        logger.warn(
          formatErrorMessage("Failed to write file", {
            file: outputPath,
            reason: errorMessage,
          }),
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
    const logger = createLogger({ quiet: options.quiet });
    const writeErrors: Array<{ file: string; error: string }> = [];

    const content = this.converter.convertMultiple(conversations, options);
    const fileName = this.converter.getDefaultFilename(options);
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!options.dryRun) {
        await fs.writeFile(outputPath, content, "utf-8");
      }
      logger.output(getRelativePath(outputPath), options.dryRun);
      logger.stat(
        "Combined",
        `${conversations.length} conversations into one file`,
      );
      return { successCount: conversations.length, errors: [] };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      writeErrors.push({ file: outputPath, error: errorMessage });

      logger.warn(
        formatErrorMessage("Failed to write file", {
          file: outputPath,
          reason: errorMessage,
        }),
      );

      this.reportErrors(writeErrors);
      return { successCount: 0, errors: writeErrors };
    }
  }

  private reportErrors(
    writeErrors: Array<{ file: string; error: string }>,
  ): void {
    if (writeErrors.length > 0) {
      const errorSummary = formatErrorMessage(
        `Failed to write ${writeErrors.length} file(s)`,
        {
          reason:
            writeErrors.length <= 3
              ? writeErrors
                  .map((e) => `${getRelativePath(e.file)}: ${e.error}`)
                  .join("\n")
              : `First 3 errors:\n${writeErrors
                  .slice(0, 3)
                  .map((e) => `${getRelativePath(e.file)}: ${e.error}`)
                  .join("\n")}\n...and ${writeErrors.length - 3} more`,
        },
      );

      throw new Error(errorSummary);
    }
  }
}
