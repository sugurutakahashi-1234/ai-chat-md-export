import type { Conversation } from "../types.js";

/**
 * Interface for output format converters
 */
export interface OutputConverter {
  /**
   * Unique identifier for the converter
   */
  readonly id: string;

  /**
   * Display name for the converter
   */
  readonly name: string;

  /**
   * File extension for this format
   */
  readonly extension: string;

  /**
   * Convert a single conversation to the output format
   */
  convertSingle(conversation: Conversation): string;

  /**
   * Convert multiple conversations to the output format
   */
  convertMultiple(conversations: Conversation[]): string;

  /**
   * Get default filename for combined output
   */
  getDefaultFilename(): string;
}
