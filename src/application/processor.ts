import path from "node:path";
import type { Options } from "../domain/config.js";
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

    // Step 1: Load input file
    const data = await this.deps.fileLoader.readJsonFile(inputPath);

    // Step 2: Parse and validate conversations
    const parseResult = await this.deps.parser.parseAndValidateConversations(
      data,
      { quiet: options.quiet },
    );

    // Report parse results
    this.deps.resultReporter.reportParseResult(parseResult);

    // Step 3: Apply filters (always run, returns original array if no filters)
    const filterResult = this.deps.filter.filterConversations(
      parseResult.conversations,
      options,
    );

    // Step 4: Write output files
    const writeResult = await this.deps.fileWriter.writeConversations(
      filterResult.conversations,
      outputDir,
      options,
    );

    // Report detailed results
    this.deps.resultReporter.reportWriteResult(writeResult);

    // Report final summary
    this.deps.resultReporter.reportFinalSummary(
      parseResult,
      filterResult,
      writeResult,
      options,
    );
  }
}
