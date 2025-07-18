import { promises as fs } from "node:fs";
import path from "node:path";
import {
  convertSingleConversationToJson,
  convertToJson,
} from "../converters/json.js";
import {
  convertMultipleToMarkdown,
  convertToMarkdown,
} from "../converters/markdown.js";
import { registerDefaultHandlers } from "../handlers/index.js";
import type { Conversation } from "../types.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../utils/error-formatter.js";
import type { FilenameEncoding } from "../utils/filename.js";
import { generateFileName } from "../utils/filename.js";
import { createLogger } from "../utils/logger.js";
import type { Options } from "../utils/options.js";
import { applyFilters } from "./filter.js";
import type { FormatHandler } from "./format-handler.js";
import { defaultRegistry } from "./handler-registry.js";

// Initialize default handlers on module load
registerDefaultHandlers();

export async function processInput(options: Options): Promise<void> {
  const inputPath = path.resolve(options.input);
  const outputDir = path.resolve(options.output || process.cwd());

  const stat = await fs.stat(inputPath);

  if (stat.isFile()) {
    await processFile(inputPath, outputDir, options);
  } else if (stat.isDirectory()) {
    await processDirectory(inputPath, outputDir, options);
  } else {
    throw new Error(
      formatErrorMessage("Invalid input path", {
        file: inputPath,
        reason:
          "The path must be either:\n" +
          "- A valid JSON file (e.g., conversations.json)\n" +
          "- A directory containing JSON files",
      }),
    );
  }
}

export async function processFile(
  filePath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const logger = createLogger({ quiet: options.quiet });
  logger.info(`Processing: ${getRelativePath(filePath)}`);

  // Read file content once
  let fileContent: string;
  let data: unknown;
  try {
    fileContent = await fs.readFile(filePath, "utf-8");
    data = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      formatErrorMessage("Failed to read or parse file", {
        file: filePath,
        reason: getErrorMessage(error),
      }),
    );
  }

  // Detect format handler
  let handler: FormatHandler | undefined;
  try {
    if (options.platform === "auto") {
      handler = defaultRegistry.detectFormat(data);
      if (!handler) {
        throw new Error(
          "Cannot detect file format. The file does not match any known format (ChatGPT or Claude).",
        );
      }
    } else {
      handler = defaultRegistry.getById(options.platform);
      if (!handler) {
        throw new Error(
          formatErrorMessage(`Unsupported format: ${options.platform}`, {
            reason: "Supported formats are: chatgpt, claude, auto",
          }),
        );
      }
    }
  } catch (error) {
    throw new Error(
      formatErrorMessage("Failed to detect file format", {
        file: filePath,
        reason: getErrorMessage(error),
      }),
    );
  }

  // Load conversations using the handler
  let conversations: Conversation[];
  try {
    if (!handler) {
      throw new Error("Handler not found");
    }
    conversations = await handler.load(data, { quiet: options.quiet });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Schema validation error")
    ) {
      throw error;
    }
    throw new Error(
      formatErrorMessage("Failed to load file", {
        file: filePath,
        format: handler?.name || "unknown",
        reason: getErrorMessage(error),
      }),
    );
  }

  // Apply filters and get stats
  const { filteredConversations, stats } = applyFilters(conversations, options);

  // Log filter stats if not quiet
  if (options.since || options.until || options.search) {
    logger.stat(
      "Filtered",
      `${stats.filteredCount} of ${stats.originalCount} conversations`,
    );
    const filters = [];
    if (options.since || options.until) {
      const dateRange = [];
      if (options.since) dateRange.push(`from ${options.since}`);
      if (options.until) dateRange.push(`to ${options.until}`);
      filters.push(`date ${dateRange.join(" ")}`);
    }
    if (options.search) {
      filters.push(`keyword "${options.search}"`);
    }
    if (filters.length > 0) {
      logger.stat("Filters", filters.join(", "));
    }
  }

  // Only create output directory if we have files to write
  if (!options.dryRun && filteredConversations.length > 0) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  // Track write errors to report at the end
  const writeErrors: Array<{ file: string; error: string }> = [];

  if (options.split) {
    // Split mode: Write each conversation to a separate file
    for (const conv of filteredConversations) {
      const content =
        options.format === "json"
          ? convertSingleConversationToJson(conv)
          : convertToMarkdown(conv);
      const extension = options.format === "json" ? ".json" : ".md";
      const fileName = generateFileName(
        conv.date,
        conv.title,
        options.filenameEncoding as FilenameEncoding,
      ).replace(/\.md$/, extension);
      const outputPath = path.join(outputDir, fileName);

      try {
        if (!options.dryRun) {
          await fs.writeFile(outputPath, content, "utf-8");
        }
        logger.output(getRelativePath(outputPath), options.dryRun);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        writeErrors.push({ file: outputPath, error: errorMessage });

        // Still log individual error if not quiet
        logger.warn(
          formatErrorMessage("Failed to write file", {
            file: outputPath,
            reason: errorMessage,
          }),
        );
      }
    }
  } else {
    // No-split mode: Write all conversations to a single file
    const content =
      options.format === "json"
        ? convertToJson(filteredConversations)
        : convertMultipleToMarkdown(filteredConversations);
    const fileName =
      options.format === "json"
        ? "all-conversations.json"
        : "all-conversations.md";
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!options.dryRun) {
        await fs.writeFile(outputPath, content, "utf-8");
      }
      logger.output(getRelativePath(outputPath), options.dryRun);
      logger.stat(
        "Combined",
        `${filteredConversations.length} conversations into one file`,
      );
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

  // Report summary of write errors at the end
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

export async function processDirectory(
  dirPath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    const logger = createLogger({ quiet: options.quiet });
    logger.info(
      `No JSON files found in directory: ${getRelativePath(dirPath)}`,
    );
    return;
  }

  const logger = createLogger({ quiet: options.quiet });
  logger.section(`Found ${jsonFiles.length} JSON file(s) to process`);

  for (let i = 0; i < jsonFiles.length; i++) {
    const file = jsonFiles[i];
    if (!file) continue;
    const filePath = path.join(dirPath, file);
    logger.progress(i + 1, jsonFiles.length, `Processing ${file}...`);
    await processFile(filePath, outputDir, options);
  }

  logger.success(`Completed processing ${jsonFiles.length} file(s)`);
  logger.info(""); // Add empty line
}
