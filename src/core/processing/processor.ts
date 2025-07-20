import path from "node:path";
import type { Conversation } from "../../types.js";
import { ValidationError } from "../../utils/errors/errors.js";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../../utils/errors/formatter.js";
import type { Options } from "../../utils/options.js";
import type { ProcessorDependencies } from "../processor-dependencies.js";

/**
 * Main processor class with dependency injection
 *
 * Orchestrates the entire conversion process from input file
 * to output files, coordinating all the components.
 */
export class Processor {
  constructor(private readonly deps: ProcessorDependencies) {}

  /**
   * Process input file and convert to specified output format
   *
   * Pipeline steps:
   * 1. Load JSON data from input file
   * 2. Create platform-specific parser
   * 3. Parse conversations using the parser
   * 4. Apply filters (date range, keyword search)
   * 5. Write filtered conversations to output
   */
  async processInput(options: Options): Promise<void> {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output || process.cwd());

    this.deps.logger.info(`Processing: ${getRelativePath(inputPath)}`);

    // ========== STEP 1: Load Data ==========
    const data = await this.deps.fileLoader.loadJsonFile(inputPath);

    // ========== STEP 2: Use Parser ==========
    const parser = this.deps.parser;

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
          file: inputPath,
          reason: getErrorMessage(error),
        }),
        { file: inputPath },
        error,
      );
    }

    // ========== STEP 4: Filter Conversations ==========
    const filterResult = this.deps.filter.apply(conversations, options);

    // Log filter statistics
    this.deps.filter.logStats(filterResult.stats, options);

    // ========== STEP 5: Write Output ==========
    await this.deps.fileWriter.writeConversations(
      filterResult.filteredConversations,
      outputDir,
      options,
    );
  }
}
