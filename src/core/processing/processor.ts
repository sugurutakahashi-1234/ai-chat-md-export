import path from "node:path";
import type { Conversation } from "../../types.js";
import { ValidationError } from "../../utils/errors/errors.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../../utils/errors/formatter.js";
import { createLogger } from "../../utils/logger.js";
import type { Options } from "../../utils/options.js";
import { createPlatformParser } from "../factories/platform-parser-factory.js";
import { FileLoader } from "../io/file-loader.js";
import { FileWriter } from "../io/file-writer.js";
import { applyFilters } from "./filter.js";

/**
 * Processor configuration
 */
export interface ProcessorConfig {
  fileLoader?: FileLoader;
  fileWriter?: FileWriter;
}

/**
 * Main processor class with dependency injection
 *
 * Orchestrates the entire conversion process from input file
 * to output files, coordinating all the components.
 */
export class Processor {
  private readonly fileLoader: FileLoader;
  private readonly fileWriter: FileWriter;

  constructor(config: ProcessorConfig = {}) {
    // Use provided instances or create defaults
    this.fileLoader = config.fileLoader || new FileLoader();

    this.fileWriter = config.fileWriter || new FileWriter();
  }

  /**
   * Factory method to create a Processor with default configuration
   */
  static create(config?: ProcessorConfig): Processor {
    return new Processor(config);
  }

  async processInput(options: Options): Promise<void> {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output || process.cwd());

    // Execute the conversion pipeline
    await this.executePipeline(inputPath, outputDir, options);
  }

  /**
   * Execute the conversion pipeline with clear steps
   */
  private async executePipeline(
    filePath: string,
    outputDir: string,
    options: Options,
  ): Promise<void> {
    const logger = createLogger({ quiet: options.quiet });
    logger.info(`Processing: ${getRelativePath(filePath)}`);

    // ========== STEP 1: Load Data ==========
    const data = await this.fileLoader.loadJsonFile(filePath);

    // ========== STEP 2: Create Parser ==========
    const parser = createPlatformParser(options.platform);

    // ========== STEP 3: Parse Conversations ==========
    let conversations: Conversation[];
    try {
      conversations = await parser.load(data, { quiet: options.quiet });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Schema validation error")
      ) {
        throw error;
      }
      throw new ValidationError(
        formatErrorMessage("Failed to parse file", {
          file: filePath,
          reason: getErrorMessage(error),
        }),
        { file: filePath },
        error,
      );
    }

    // ========== STEP 4: Filter Conversations ==========
    const { filteredConversations, stats } = applyFilters(
      conversations,
      options,
    );

    // Log filter statistics
    this.logFilterStats(stats, options, logger);

    // ========== STEP 5: Write Output ==========
    await this.fileWriter.writeConversations(
      filteredConversations,
      outputDir,
      options,
    );
  }

  /**
   * Log filter statistics if filters were applied
   */
  private logFilterStats(
    stats: { originalCount: number; filteredCount: number },
    options: Options,
    logger: ReturnType<typeof createLogger>,
  ): void {
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
  }
}
