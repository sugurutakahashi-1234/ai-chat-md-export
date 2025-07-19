import path from "node:path";
import { JsonConverter } from "../converters/json-converter.js";
import { MarkdownConverter } from "../converters/markdown-converter.js";
import { ChatGPTHandler } from "../handlers/chatgpt-handler.js";
import { ClaudeHandler } from "../handlers/claude-handler.js";
import type { Conversation } from "../types.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../utils/error-formatter.js";
import { createLogger } from "../utils/logger.js";
import type { Options } from "../utils/options.js";
import { ConverterRegistry } from "./converter-registry.js";
import { FileLoader } from "./file-loader.js";
import { FileWriter } from "./file-writer.js";
import { applyFilters } from "./filter.js";
import { FormatDetector } from "./format-detector.js";
import { HandlerRegistry } from "./handler-registry.js";

/**
 * Processor configuration
 */
export interface ProcessorConfig {
  handlerRegistry?: HandlerRegistry;
  converterRegistry?: ConverterRegistry;
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
  private readonly handlerRegistry: HandlerRegistry;
  private readonly converterRegistry: ConverterRegistry;

  constructor(config: ProcessorConfig = {}) {
    // Use provided instances or create defaults
    this.handlerRegistry = config.handlerRegistry || new HandlerRegistry();
    this.converterRegistry =
      config.converterRegistry || new ConverterRegistry();
    this.fileLoader = config.fileLoader || new FileLoader();
    this.fileWriter =
      config.fileWriter || new FileWriter(this.converterRegistry);
    this.formatDetector =
      config.formatDetector || new FormatDetector(this.handlerRegistry);

    // Register default handlers if using default registry
    if (!config.handlerRegistry) {
      this.handlerRegistry.register(new ChatGPTHandler());
      this.handlerRegistry.register(new ClaudeHandler());
    }

    // Register default converters if using default registry
    if (!config.converterRegistry) {
      this.converterRegistry.register(new JsonConverter());
      this.converterRegistry.register(new MarkdownConverter());
    }
  }

  async processInput(options: Options): Promise<void> {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output || process.cwd());

    const isFile = await this.fileLoader.isFile(inputPath);

    if (isFile) {
      await this.processFile(inputPath, outputDir, options);
    } else {
      await this.processDirectory(inputPath, outputDir, options);
    }
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

  private async processDirectory(
    dirPath: string,
    outputDir: string,
    options: Options,
  ): Promise<void> {
    const jsonFiles = await this.fileLoader.listJsonFiles(dirPath);

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
      await this.processFile(filePath, outputDir, options);
    }

    logger.success(`Completed processing ${jsonFiles.length} file(s)`);
    logger.info(""); // Add empty line
  }
}

// Note: Use new Processor().processInput() for processing files
