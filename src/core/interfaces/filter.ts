import type { Conversation } from "../../types.js";
import type { Options } from "../../utils/options.js";

/**
 * Filter statistics containing counts before and after filtering
 */
export interface FilterStats {
  originalCount: number;
  filteredCount: number;
}

/**
 * Result of applying filters to conversations
 */
export interface FilterResult {
  filteredConversations: Conversation[];
  stats: FilterStats;
}

/**
 * Interface for filtering conversations based on various criteria
 */
export interface Filter {
  /**
   * Apply all configured filters to the conversations
   * @param conversations - The conversations to filter
   * @param options - Filter options (date range, search keywords, etc.)
   * @returns Filtered conversations with statistics
   */
  apply(conversations: Conversation[], options: Options): FilterResult;

  /**
   * Log filter statistics to the logger
   * @param stats - The filter statistics to log
   * @param options - Options to determine which filters were applied
   */
  logStats(stats: FilterStats, options: Options): void;
}
