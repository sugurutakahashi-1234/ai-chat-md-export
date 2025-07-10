import { promises as fs } from "node:fs";
import path from "node:path";
import { loadChatGPT } from "../loaders/chatgpt.js";
import { loadClaude } from "../loaders/claude.js";
import { convertToMarkdown } from "../markdown.js";
import type { Conversation } from "../types.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../utils/error-formatter.js";
import type { FilenameEncoding } from "../utils/filename.js";
import { generateFileName } from "../utils/filename.js";
import { detectFormat } from "../utils/format-detector.js";
import type { Options } from "../utils/options.js";
import { applyFilters } from "./filter.js";

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
  if (!options.quiet) {
    console.log(`Processing: ${getRelativePath(filePath)}`);
  }

  let format: string;
  try {
    format =
      options.format === "auto" ? await detectFormat(filePath) : options.format;
  } catch (error) {
    throw new Error(
      formatErrorMessage("Failed to detect file format", {
        file: filePath,
        reason: getErrorMessage(error),
      }),
    );
  }

  let conversations: Conversation[];
  try {
    if (format === "chatgpt") {
      conversations = await loadChatGPT(filePath, { quiet: options.quiet });
    } else if (format === "claude") {
      conversations = await loadClaude(filePath, { quiet: options.quiet });
    } else {
      throw new Error(
        formatErrorMessage(`Unsupported format: ${format}`, {
          reason: "Supported formats are: chatgpt, claude, auto",
        }),
      );
    }
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
        format: format,
        reason: getErrorMessage(error),
      }),
    );
  }

  // Apply filters and get stats
  const { filteredConversations, stats } = applyFilters(conversations, options);

  // Log filter stats if not quiet
  if ((options.since || options.until || options.search) && !options.quiet) {
    console.log(
      `  Filtered: ${stats.filteredCount} of ${stats.originalCount} conversations`,
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
      console.log(`  Filters: ${filters.join(", ")}`);
    }
  }

  // Only create output directory if we have files to write
  if (!options.dryRun && filteredConversations.length > 0) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  for (const conv of filteredConversations) {
    const markdown = convertToMarkdown(conv);
    const fileName = generateFileName(
      conv.date,
      conv.title,
      options.filenameEncoding as FilenameEncoding,
    );
    const outputPath = path.join(outputDir, fileName);

    try {
      if (!options.dryRun) {
        await fs.writeFile(outputPath, markdown, "utf-8");
      }
      if (!options.quiet) {
        console.log(
          `  → ${options.dryRun ? "[DRY RUN] Would write:" : ""} ${getRelativePath(outputPath)}`,
        );
      }
    } catch (error) {
      console.error(
        formatErrorMessage("Warning: Failed to write file", {
          file: outputPath,
          reason: getErrorMessage(error),
        }),
      );
    }
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
    if (!options.quiet) {
      console.log(
        `No JSON files found in directory: ${getRelativePath(dirPath)}`,
      );
    }
    return;
  }

  if (!options.quiet) {
    console.log(`Found ${jsonFiles.length} JSON file(s) to process\n`);
  }

  for (let i = 0; i < jsonFiles.length; i++) {
    const file = jsonFiles[i];
    if (!file) continue;
    const filePath = path.join(dirPath, file);
    if (!options.quiet) {
      console.log(`[${i + 1}/${jsonFiles.length}] Processing ${file}...`);
    }
    await processFile(filePath, outputDir, options);
  }

  if (!options.quiet) {
    console.log(`\nCompleted processing ${jsonFiles.length} file(s)`);
  }
}
