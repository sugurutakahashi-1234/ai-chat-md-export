import path from "node:path";
import type { Options } from "../domain/config.js";
import { formatRelativePathFromCwd } from "../domain/utils/path.js";
import type { ProcessorDependencies } from "./dependencies.js";

/**
 * Main processor class with dependency injection
 *
 * Orchestrates the entire conversion process from input file
 * to output files, coordinating all the components.
 */
export class Processor {
  constructor(private readonly deps: ProcessorDependencies) {}

  /**
   * Convert conversations from input file to specified output format
   *
   * Pipeline steps:
   * 1. Load JSON data from input file
   * 2. Parse conversations using the parser
   * 3. Apply filters (date range, keyword search)
   * 4. Write filtered conversations to output
   */
  async executeConversionPipeline(options: Options): Promise<void> {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output || process.cwd());

    this.deps.logger.info(
      `Processing: ${formatRelativePathFromCwd(inputPath)}`,
    );

    // Step 1: Load input file
    this.deps.logger.start("Loading input file...");
    const data = await this.deps.fileLoader.readJsonFile(inputPath);
    this.deps.logger.success("Input file loaded successfully");

    // Step 2: Parse and validate conversations
    const conversations = await this.deps.parser.parseAndValidateConversations(
      data,
      { quiet: options.quiet },
    );

    // Step 3: Apply filters
    if (options.since || options.until || options.search) {
      this.deps.logger.start("Filtering conversations...");
      const filteredConversations = this.deps.filter.filterConversations(
        conversations,
        options,
      );
      this.deps.logger.success(
        `Filtered: ${filteredConversations.length}/${conversations.length} conversations`,
      );

      // Step 4: Write output files
      await this.deps.fileWriter.writeConversations(
        filteredConversations,
        outputDir,
        options,
      );
    } else {
      // No filters applied, write all conversations
      await this.deps.fileWriter.writeConversations(
        conversations,
        outputDir,
        options,
      );
    }
  }
}
