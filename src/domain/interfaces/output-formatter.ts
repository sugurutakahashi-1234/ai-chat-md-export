import type { Format } from "../config.js";
import type { Conversation } from "../entities.js";

/**
 * Interface for output format formatters
 *
 * Handles conversion from the common conversation format
 * to various output formats (Markdown, JSON, etc.)
 */
export interface IOutputFormatter {
  /**
   * The format type this formatter handles
   */
  readonly format: Format;

  /**
   * Format a single conversation to the output format
   */
  formatSingle(conversation: Conversation): string;

  /**
   * Format multiple conversations to the output format
   */
  formatMultiple(conversations: Conversation[]): string;

  /**
   * Get default filename for combined output
   */
  getDefaultFilename(): string;
}
