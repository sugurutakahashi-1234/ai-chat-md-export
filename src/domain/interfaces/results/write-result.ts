import type { Format } from "../../config.js";

/**
 * Information about a successfully written file
 */
export interface WrittenFile {
  path: string;
  conversationTitle: string;
  date: Date;
}

/**
 * Result of file writing operations
 */
export interface WriteResult {
  successCount: number;
  writtenFiles: WrittenFile[];
  outputFormat: Format;
  splitMode: boolean;
  outputDir: string;
  dryRun: boolean;
  errors: Array<{ file: string; error: string }>;
}
