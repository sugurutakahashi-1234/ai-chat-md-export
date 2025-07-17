import { promises as fs } from "node:fs";
import { createLogger } from "./logger.js";

/**
 * Read and parse JSON file
 * @param filePath - Path to JSON file
 * @returns Parsed JSON data
 * @throws Error if file cannot be read or JSON is invalid
 */
export async function readJSONFile(filePath: string): Promise<unknown> {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

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
