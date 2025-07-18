import type { ZodType } from "zod";
import type { Conversation } from "../types.js";

export interface FormatHandler<T = unknown> {
  /**
   * Unique identifier for this format
   */
  readonly id: string;

  /**
   * Human-readable name for this format
   */
  readonly name: string;

  /**
   * Zod schema for validating the format data
   */
  readonly schema: ZodType<T>;

  /**
   * Detect if the given data matches this format
   * @param data Unknown data to check
   * @returns true if data matches this format
   */
  detect(data: unknown): boolean;

  /**
   * Load conversations from the validated data
   * @param data Validated data matching the schema
   * @param options Loading options
   * @returns Array of conversations
   */
  load(data: T, options?: LoadOptions): Promise<Conversation[]>;
}

export interface LoadOptions {
  /**
   * Whether to suppress loading summary output
   */
  quiet?: boolean;
}

interface ValidationError {
  path: string;
  message: string;
}

interface LoadResult {
  conversations: Conversation[];
  warnings?: string[];
  skippedFields?: Set<string>;
}
