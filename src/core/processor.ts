import path from "node:path";
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

/**
 * Processor configuration
 */
export interface ProcessorConfig {
  fileLoader?: FileLoader;
  fileWriter?: FileWriter;
  formatDetector?: FormatDetector;
}

/**
 * Main processor class with dependency injection
 */
export class Processor {
  private readonly fileLoader: FileLoader;
  private readonly formatDetector: FormatDetector;
  private readonly fileWriter: FileWriter;

  constructor(config: ProcessorConfig = {}) {
    // Use provided instances or create defaults
    this.fileLoader = config.fileLoader || new FileLoader();
    this.fileWriter = config.fileWriter || new FileWriter();
    this.formatDetector = config.formatDetector || new FormatDetector();
  }

  async processInput(options: Options): Promise<void> {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output || process.cwd());

    await this.processFile(inputPath, outputDir, options);
  }

  private async processFile(
    filePath: string,
    outputDir: string,
    options: Options,
  ): Promise<void> {
    const logger = createLogger({ quiet: options.quiet });
    logger.info(`Processing: ${getRelativePath(filePath)}`);

    // Read file content
    const data = await this.fileLoader.loadJsonFile(filePath);

    // Detect format handler
    const handler = this.formatDetector.detectHandler(data, options, filePath);

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
    const { filteredConversations, stats } = applyFilters(
      conversations,
      options,
    );

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
    await this.fileWriter.writeConversations(
      filteredConversations,
      outputDir,
      options,
    );
  }
}

// Note: Use new Processor().processInput() for processing files
