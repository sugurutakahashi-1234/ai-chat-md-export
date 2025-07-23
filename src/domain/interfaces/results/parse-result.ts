import type { Conversation } from "../../entities.js";
import type { BaseResult } from "./base-result.js";

/**
 * Result of parsing and validation operations
 */
export interface ParseResult extends BaseResult {
  conversations: Conversation[];
  skippedFields: string[];
  validationErrors: string[];
  successCount: number;
}
