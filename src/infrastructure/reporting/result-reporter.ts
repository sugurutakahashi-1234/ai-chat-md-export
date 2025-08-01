import type { Options } from "../../domain/config.js";
import type { ILogger } from "../../domain/interfaces/logger.js";
import type { IResultReporter } from "../../domain/interfaces/result-reporter.js";
import type { FilterResult } from "../../domain/interfaces/results/filter-result.js";
import type { ParseResult } from "../../domain/interfaces/results/parse-result.js";
import type { WriteResult } from "../../domain/interfaces/results/write-result.js";
import type { ISpinner } from "../../domain/interfaces/spinner.js";
import { formatRelativePathFromCwd } from "../../domain/utils/path.js";

/**
 * Result reporter implementation
 *
 * Handles the display of file writing operation results,
 * providing detailed information about successful operations
 * and clear error reporting.
 */
export class ResultReporter implements IResultReporter {
  constructor(
    private readonly logger: ILogger,
    private readonly spinner: ISpinner,
  ) {}

  /**
   * Common method to report errors with a limit
   */
  private reportErrors(
    errors: Array<{ message: string; details?: unknown }>,
    formatter: (error: { message: string; details?: unknown }) => string,
    maxDisplay: number = 3,
  ): void {
    if (errors.length === 0) return;

    errors.slice(0, maxDisplay).forEach((err) => {
      this.logger.error(`  × ${formatter(err)}`);
    });

    if (errors.length > maxDisplay) {
      this.logger.error(`  ...and ${errors.length - maxDisplay} more errors`);
    }
  }

  reportWriteResult(result: WriteResult): void {
    const {
      successCount,
      errors,
      writtenFiles,
      outputFormat,
      splitMode,
      outputDir,
      dryRun,
    } = result;

    // Stop spinner with appropriate status
    if (errors.length > 0) {
      this.spinner.fail(`Failed to write some files`);
    } else if (successCount > 0) {
      if (dryRun) {
        const fileWord = splitMode ? "files" : "combined file";
        this.spinner.succeed(`Would write ${successCount} ${fileWord}`);
      } else {
        const fileWord = splitMode ? "files" : "combined file";
        this.spinner.succeed(
          `Written ${successCount} ${fileWord} successfully`,
        );
      }
    }

    // Report successful operations
    if (successCount > 0) {
      const mode = splitMode ? "individual files" : "combined file";
      const action = dryRun ? "Would write" : "Written";
      this.logger.success(
        `${action} ${successCount} ${outputFormat} ${mode} to ${formatRelativePathFromCwd(outputDir)}`,
      );

      // Show file list for split mode (up to 5 files)
      if (splitMode && writtenFiles.length > 0) {
        this.logger.info("Created files:");
        writtenFiles.slice(0, 5).forEach((file) => {
          this.logger.info(`  → ${formatRelativePathFromCwd(file.path)}`);
        });

        if (writtenFiles.length > 5) {
          this.logger.info(`  ...and ${writtenFiles.length - 5} more files`);
        }
      }
    }

    // Report errors with details
    if (errors.length > 0) {
      this.logger.error(`Failed to write ${errors.length} file(s):`);
      this.reportErrors(
        errors.map((e) => ({
          message: `${formatRelativePathFromCwd(e.file)}: ${e.error}`,
        })),
        (err) => err.message,
      );
    }
  }

  reportParseResult(result: ParseResult): void {
    const { successCount, skippedFields, validationErrors } = result;

    // Stop spinner with appropriate status
    if (validationErrors.length > 0) {
      this.spinner.fail(`Failed to parse some conversations`);
    } else if (successCount > 0) {
      this.spinner.succeed(
        `Parsed ${successCount} conversation(s) successfully`,
      );
    }

    // Report skipped fields as information (not warnings)
    if (skippedFields.length > 0) {
      this.logger.info(
        `Skipped unknown fields during parsing: ${skippedFields.join(", ")}`,
      );
    }

    // Report validation errors
    if (validationErrors.length > 0) {
      this.logger.error(`Validation errors found:`);
      this.reportErrors(
        validationErrors.map((e) => ({ message: e })),
        (err) => err.message,
        5,
      );
    }
  }

  reportFilterResult(_result: FilterResult): void {
    // Filter results are already logged in ConversationFilter
    // This method exists for consistency and future extensions
  }

  reportFinalSummary(
    parseResult: ParseResult,
    filterResult: FilterResult,
    writeResult: WriteResult,
    options: Options,
  ): void {
    const lines: string[] = [];

    // Title
    lines.push("=== Conversion Summary ===");
    lines.push("");

    // Command-line options
    lines.push("Options:");
    lines.push(`  - Input:    ${formatRelativePathFromCwd(options.input)}`);
    lines.push(`  - Platform: ${options.platform || "auto-detected"}`);
    lines.push(`  - Format:   ${options.format}`);

    if (options.output) {
      lines.push(`  - Output:   ${formatRelativePathFromCwd(options.output)}`);
    }
    if (options.split !== undefined) {
      lines.push(`  - Split:    ${options.split ? "yes" : "no"}`);
    }
    if (options.since || options.until || options.search) {
      lines.push("  - Filters:");
      if (options.since) lines.push(`      Since: ${options.since}`);
      if (options.until) lines.push(`      Until: ${options.until}`);
      if (options.search) lines.push(`      Search: "${options.search}"`);
    }
    if (options.quiet) {
      lines.push(`  - Quiet:    yes`);
    }
    if (options.dryRun) {
      lines.push(`  - Dry-run:  yes`);
    }
    lines.push("");

    // Parsing results
    const parseErrors = parseResult.validationErrors.length;
    lines.push(
      `Parsing:  ${parseResult.conversations.length} found, ${parseResult.successCount} parsed`,
    );

    if (parseResult.skippedFields.length > 0) {
      lines.push(`  - Skipped fields: ${parseResult.skippedFields.join(", ")}`);
    }

    if (parseErrors > 0) {
      lines.push(`  - Validation errors: ${parseErrors}`);
    }

    // Filtering results (if applied)
    if (filterResult.originalCount !== filterResult.filteredCount) {
      lines.push("");
      lines.push(
        `Filtering: ${filterResult.originalCount} → ${filterResult.filteredCount} conversations`,
      );

      if (filterResult.appliedFilters.dateRange) {
        const { since, until, removed } = filterResult.appliedFilters.dateRange;
        lines.push(
          `  - Date: ${since || "any"} to ${until || "any"} (removed ${removed})`,
        );
      }

      if (filterResult.appliedFilters.search) {
        const { keyword, removed } = filterResult.appliedFilters.search;
        lines.push(`  - Search: "${keyword}" (removed ${removed})`);
      }
    }

    // Output results
    const writeErrors = writeResult.errors.length;
    const fileWord = writeResult.splitMode ? "files" : "file";
    const action = writeResult.dryRun ? "would write" : "written";

    lines.push("");
    lines.push(`Output:   ${writeResult.successCount} ${fileWord} ${action}`);

    // Add details about split mode and dry-run
    if (!writeResult.splitMode || writeResult.dryRun) {
      const details: string[] = [];
      if (!writeResult.splitMode) details.push("no-split");
      if (writeResult.dryRun) details.push("dry-run");
      lines.push(`  - Mode: ${details.join(", ")}`);
    }

    if (writeErrors > 0) {
      lines.push(`  - Errors: ${writeErrors} files failed`);
    }

    // Final status
    const hasErrors = parseErrors > 0 || writeErrors > 0;
    lines.push("");
    if (hasErrors) {
      lines.push("✗ Conversion completed with errors");
    } else {
      lines.push("✔ Conversion completed successfully");
    }

    // Display as box
    const summaryContent = lines.join("\n");
    this.logger.box(summaryContent);
  }
}
