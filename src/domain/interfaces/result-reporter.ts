import type { Options } from "../config.js";
import type { FilterResult } from "./results/filter-result.js";
import type { ParseResult } from "./results/parse-result.js";
import type { WriteResult } from "./results/write-result.js";

/**
 * Interface for reporting operation results
 *
 * Defines the contract for displaying detailed results of parsing and file writing operations
 * to the user in a clear and informative way.
 */
export interface IResultReporter {
  /**
   * Report the results of a file writing operation
   *
   * @param result - The write operation result containing success/error details
   */
  reportWriteResult(result: WriteResult): void;

  /**
   * Report the results of a parsing operation
   *
   * @param result - The parse operation result containing skipped fields and validation errors
   */
  reportParseResult(result: ParseResult): void;

  /**
   * Report the results of a filtering operation
   *
   * @param result - The filter operation result containing applied filters
   */
  reportFilterResult(result: FilterResult): void;

  /**
   * Report the final summary of the entire conversion process
   *
   * @param parseResult - Results from parsing
   * @param filterResult - Results from filtering
   * @param writeResult - Results from writing files
   * @param options - Options used for the conversion
   */
  reportFinalSummary(
    parseResult: ParseResult,
    filterResult: FilterResult,
    writeResult: WriteResult,
    options: Options,
  ): void;
}
