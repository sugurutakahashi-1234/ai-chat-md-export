import type { ZodType } from "zod";
import type { Conversation } from "../entities.js";

/**
 * Interface for platform-specific data parsers
 *
 * Each platform (ChatGPT, Claude) implements this interface
 * to handle its specific data format and convert it to the common format.
 */
export interface IPlatformParser<T = unknown> {
  /**
   * Zod schema for validating the platform data
   */
  readonly schema: ZodType<T>;

  /**
   * Parse conversations from the validated platform data
   * @param data Validated data matching the schema
   * @param options Parsing options
   * @returns Array of conversations in common format
   */
  parseAndValidateConversations(
    data: T,
    options?: LoadOptions,
  ): Promise<Conversation[]>;

  /**
   * Parse platform-specific data into a common intermediate format
   *
   * This method handles the specific data structure of each platform
   * (ChatGPT, Claude, etc.) and prepares it for validation
   *
   * @param data The validated platform-specific data
   * @returns Array of parsed conversations ready for validation and transformation
   */
  parseConversations(data: T): ParsedConversation<unknown>[];
}

/**
 * Intermediate representation of a conversation during parsing
 *
 * Contains the raw data, validation schema, and transformation function
 * to convert platform-specific data into the common Conversation format
 */
export interface ParsedConversation<T = unknown> {
  data: T;
  schema: ZodType<T>;
  transform: (validatedData: T) => Conversation;
}

export interface LoadOptions {
  /**
   * Whether to suppress loading summary output
   */
  quiet?: boolean;
}
