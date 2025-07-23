import type { FilterOptions } from "../config.js";
import type { Conversation } from "../entities.js";
import type { FilterResult } from "./results/filter-result.js";

/**
 * Interface for conversation filtering
 *
 * Defines the contract for filtering conversations by various criteria
 * such as date range and keyword search.
 */
export interface IConversationFilter {
  /**
   * Apply all configured filters to the conversations
   *
   * @param conversations - Array of conversations to filter
   * @param options - Options containing filter criteria
   * @returns Filter result containing filtered conversations and metadata
   */
  filterConversations(
    conversations: Conversation[],
    options: FilterOptions,
  ): FilterResult;
}
