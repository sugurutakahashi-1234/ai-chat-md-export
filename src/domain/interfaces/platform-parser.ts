import type { ZodType } from "zod";
import type { ParsingOptions } from "../config.js";
import type { Conversation } from "../entities.js";
import type { ParseResult } from "./results/parse-result.js";

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
   * @returns Parse result containing conversations and metadata
   */
  parseAndValidateConversations(
    data: T,
    options?: ParsingOptions,
  ): Promise<ParseResult>;

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

export type { ParseResult };

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
