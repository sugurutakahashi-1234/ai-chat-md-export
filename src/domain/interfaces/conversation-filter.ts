import type { FilterOptions } from "../config.js";
import type { Conversation } from "../entities.js";

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
   * @returns Filtered array of conversations
   */
  filterConversations(
    conversations: Conversation[],
    options: FilterOptions,
  ): Conversation[];
}
