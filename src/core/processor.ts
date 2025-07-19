import path from "node:path";
import { registerDefaultHandlers } from "../handlers/index.js";
import type { Conversation } from "../types.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../utils/error-formatter.js";
import { createLogger } from "../utils/logger.js";
import type { Options } from "../utils/options.js";
import { FileLoader } from "./file-loader.js";
import { FileWriter } from "./file-writer.js";
import { applyFilters } from "./filter.js";
import { FormatDetector } from "./format-detector.js";

// Module-level instances (will be removed in future versions)
const fileLoader = new FileLoader();
const formatDetector = new FormatDetector();
const fileWriter = new FileWriter();

// Track initialization state
let isInitialized = false;

/**
 * Initialize the processor with default handlers and converters
 * This method should be called before using processInput
 */
export function initializeProcessor(): void {
  if (!isInitialized) {
    registerDefaultHandlers();
    // Note: registerDefaultConverters is called within FileWriter initialization
    isInitialized = true;
  }
}

// Temporary backward compatibility - initialize on module load
// @deprecated This automatic initialization will be removed in a future version
initializeProcessor();

export async function processInput(options: Options): Promise<void> {
  // Ensure processor is initialized
  initializeProcessor();

  const inputPath = path.resolve(options.input);
  const outputDir = path.resolve(options.output || process.cwd());

  const isFile = await fileLoader.isFile(inputPath);

  if (isFile) {
    await processFile(inputPath, outputDir, options);
  } else {
    await processDirectory(inputPath, outputDir, options);
  }
}

export async function processFile(
  filePath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const logger = createLogger({ quiet: options.quiet });
  logger.info(`Processing: ${getRelativePath(filePath)}`);

  // Read file content
  const data = await fileLoader.loadJsonFile(filePath);

  // Detect format handler
  const handler = formatDetector.detectHandler(data, options, filePath);

  // Load conversations using the handler
  let conversations: Conversation[];
  try {
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
        format: handler.name,
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

  // Write filtered conversations
  await fileWriter.writeConversations(
    filteredConversations,
    outputDir,
    options,
  );
}

export async function processDirectory(
  dirPath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const jsonFiles = await fileLoader.listJsonFiles(dirPath);

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
