import path from "node:path";
import type { Options } from "../shared/config/options.js";
import { getRelativePath } from "../shared/errors/formatter.js";
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
   * Process input file and convert to specified output format
   *
   * Pipeline steps:
   * 1. Load JSON data from input file
   * 2. Parse conversations using the parser
   * 3. Apply filters (date range, keyword search)
   * 4. Write filtered conversations to output
   */
  async processInput(options: Options): Promise<void> {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output || process.cwd());

    this.deps.logger.info(`Processing: ${getRelativePath(inputPath)}`);

    const data = await this.deps.fileLoader.loadJsonFile(inputPath);
    const conversations = await this.deps.parser.load(data, {
      quiet: options.quiet,
    });
    const filteredConversations = this.deps.filter.apply(
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
