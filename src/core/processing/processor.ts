import path from "node:path";
import { ChatGPTHandler } from "../../handlers/chatgpt-handler.js";
import { ClaudeHandler } from "../../handlers/claude-handler.js";
import type { Conversation } from "../../types.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../../utils/errors/formatter.js";
import { createLogger } from "../../utils/logger.js";
import type { Options } from "../../utils/options.js";
import { PlatformDetector } from "../detection/platform-detector.js";
import type { PlatformParser } from "../interfaces/platform-parser.js";
import { FileLoader } from "../io/file-loader.js";
import { FileWriter } from "../io/file-writer.js";
import { applyFilters } from "./filter.js";
import { OutputManager } from "./output-manager.js";

/**
 * Processor configuration
 */
export interface ProcessorConfig {
  fileLoader?: FileLoader;
  fileWriter?: FileWriter;
  platformDetector?: PlatformDetector;
  parsers?: Record<string, PlatformParser>;
}

/**
 * Main processor class with dependency injection
 *
 * Orchestrates the entire conversion process from input file
 * to output files, coordinating all the components.
 */
export class Processor {
  private readonly fileLoader: FileLoader;
  private readonly platformDetector: PlatformDetector;
  private readonly fileWriter: FileWriter;

  constructor(config: ProcessorConfig = {}) {
    // Use provided instances or create defaults
    this.fileLoader = config.fileLoader || new FileLoader();

    // Use provided parsers or create default PlatformDetector
    if (config.parsers) {
      this.platformDetector =
        config.platformDetector || new PlatformDetector(config.parsers);
    } else if (config.platformDetector) {
      this.platformDetector = config.platformDetector;
    } else {
      throw new Error(
        "Either 'parsers' or 'platformDetector' must be provided in ProcessorConfig",
      );
    }

    // Create OutputManager and inject it into FileWriter
    const outputManager = new OutputManager();
    this.fileWriter = config.fileWriter || new FileWriter(outputManager);
  }

  /**
   * Factory method to create a Processor with default configuration
   * This encapsulates the creation of platform-specific handlers
   */
  static create(config?: Omit<ProcessorConfig, "parsers">): Processor {
    // Create default parsers internally
    const defaultParsers = {
      chatgpt: new ChatGPTHandler(),
      claude: new ClaudeHandler(),
    };

    return new Processor({
      ...config,
      parsers: defaultParsers,
    });
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
    const data = await this.step1_loadData(filePath);

    // ========== STEP 2: Detect Platform ==========
    const parser = this.step2_detectPlatform(data, options, filePath);

    // ========== STEP 3: Parse Conversations ==========
    const conversations = await this.step3_parseConversations(
      data,
      parser,
      filePath,
      options,
    );

    // ========== STEP 4: Filter Conversations ==========
    const { filteredConversations, stats } = this.step4_filterConversations(
      conversations,
      options,
    );

    // Log filter statistics
    this.logFilterStats(stats, options, logger);

    // ========== STEP 5: Write Output ==========
    await this.step5_writeOutput(filteredConversations, outputDir, options);
  }

  /**
   * Step 1: Load data from input file
   */
  private async step1_loadData(filePath: string): Promise<unknown> {
    return await this.fileLoader.loadJsonFile(filePath);
  }

  /**
   * Step 2: Detect platform and get appropriate parser
   */
  private step2_detectPlatform(
    data: unknown,
    options: Options,
    filePath: string,
  ) {
    return this.platformDetector.detectPlatform(data, options, filePath);
  }

  /**
   * Step 3: Parse platform-specific data into common format
   */
  private async step3_parseConversations(
    data: unknown,
    parser: PlatformParser,
    filePath: string,
    options: Options,
  ): Promise<Conversation[]> {
    try {
      return await parser.load(data, { quiet: options.quiet });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Schema validation error")
      ) {
        throw error;
      }
      throw new Error(
        formatErrorMessage("Failed to parse file", {
          file: filePath,
          reason: getErrorMessage(error),
        }),
      );
    }
  }

  /**
   * Step 4: Apply filters to conversations
   */
  private step4_filterConversations(
    conversations: Conversation[],
    options: Options,
  ) {
    return applyFilters(conversations, options);
  }

  /**
   * Step 5: Write conversations to output files
   */
  private async step5_writeOutput(
    conversations: Conversation[],
    outputDir: string,
    options: Options,
  ): Promise<void> {
    await this.fileWriter.writeConversations(conversations, outputDir, options);
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
