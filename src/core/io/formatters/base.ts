import type { Conversation } from "../../../types.js";

/**
 * Interface for output format formatters
 *
 * Handles conversion from the common conversation format
 * to various output formats (Markdown, JSON, etc.)
 */
export interface OutputFormatter {
  /**
   * File extension for this format
   */
  readonly extension: string;

  /**
   * Format a single conversation to the output format
   */
  convertSingle(conversation: Conversation): string;

  /**
   * Format multiple conversations to the output format
   */
  convertMultiple(conversations: Conversation[]): string;

  /**
   * Get default filename for combined output
   */
  getDefaultFilename(): string;
}
