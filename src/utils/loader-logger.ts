import { createLogger } from "./logger.js";

/**
 * Format summary stats for console output
 */
export interface LoadingSummaryOptions {
  successCount: number;
  exportType: string;
  skippedFields?: Set<string>;
  quiet?: boolean;
}

export function logLoadingSummary(options: LoadingSummaryOptions): void {
  const logger = createLogger({ quiet: options.quiet ?? false });

  logger.success(`Successfully loaded ${options.successCount} conversations`);

  if (options.skippedFields && options.skippedFields.size > 0) {
    logger.section("📋 Skipped fields during conversion");
    logger.info(`  - ${Array.from(options.skippedFields).sort().join(", ")}`);
    logger.info(
      `    * These fields are not included in the converted Markdown`,
    );
  }
}
