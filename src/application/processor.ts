import path from "node:path";
import type { Options } from "../domain/config/options.js";
import { formatRelativePathFromCwd } from "../infrastructure/utils/error-formatter.js";
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

    const data = await this.deps.fileLoader.readJsonFile(inputPath);
    const conversations = await this.deps.parser.parseAndValidateConversations(
      data,
      {
        quiet: options.quiet,
      },
    );
    const filteredConversations = this.deps.filter.filterConversations(
      conversations,
      options,
    );

    await this.deps.fileWriter.writeConversations(
      filteredConversations,
      outputDir,
      options,
    );
  }
}
