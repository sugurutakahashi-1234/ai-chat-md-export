import type { Conversation } from "../../entities.js";
import type { BaseResult } from "./base-result.js";

/**
 * Result of filtering operations
 *
 * Contains information about which filters were applied
 * and how many conversations were affected.
 */
export interface FilterResult extends BaseResult {
  /**
   * Filtered conversations
   */
  conversations: Conversation[];

  /**
   * Number of conversations before filtering
   */
  originalCount: number;

  /**
   * Number of conversations after filtering
   */
  filteredCount: number;

  /**
   * Details about applied filters
   */
  appliedFilters: {
    /**
     * Date range filter information
     */
    dateRange?: {
      since?: string;
      until?: string;
      removed: number;
    };

    /**
     * Search filter information
     */
    search?: {
      keyword: string;
      removed: number;
    };
  };
}
