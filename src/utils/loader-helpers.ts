import { promises as fs } from "node:fs";

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
  if (options.quiet) {
    return;
  }

  console.log(`\n✅ Successfully loaded ${options.successCount} conversations`);

  if (options.skippedFields && options.skippedFields.size > 0) {
    console.log(`\n📋 Skipped fields during conversion:`);
    console.log(`  - ${Array.from(options.skippedFields).sort().join(", ")}`);
    console.log(
      `    * These fields are not included in the converted Markdown`,
    );
  }
}
