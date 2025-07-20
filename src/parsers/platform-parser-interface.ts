import type { ZodType } from "zod";
import type { Conversation } from "../types.js";

/**
 * Interface for platform-specific data parsers
 *
 * Each platform (ChatGPT, Claude) implements this interface
 * to handle its specific data format and convert it to the common format.
 */
export interface PlatformParser<T = unknown> {
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
  load(data: T, options?: LoadOptions): Promise<Conversation[]>;
}

export interface LoadOptions {
  /**
   * Whether to suppress loading summary output
   */
  quiet?: boolean;
}
