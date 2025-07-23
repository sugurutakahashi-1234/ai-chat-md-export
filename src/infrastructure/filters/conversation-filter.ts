import type { FilterOptions } from "../../domain/config.js";
import type { Conversation } from "../../domain/entities.js";
import type { IConversationFilter } from "../../domain/interfaces/conversation-filter.js";
import type { ILogger } from "../../domain/interfaces/logger.js";
import type { FilterResult } from "../../domain/interfaces/results/filter-result.js";

/**
 * Conversation filter for date range and keyword search
 *
 * Filters conversations by date and keyword with detailed logging.
 */
export class ConversationFilter implements IConversationFilter {
  constructor(private readonly logger: ILogger) {}
  /**
   * Apply all configured filters to the conversations
   *
   * Returns filtered conversations without side effects.
   * Logging should be handled by the caller.
   */
  filterConversations(
    conversations: Conversation[],
    options: FilterOptions,
  ): FilterResult {
    const originalCount = conversations.length;
    const result: FilterResult = {
      conversations: conversations,
      originalCount,
      filteredCount: originalCount,
      appliedFilters: {},
    };

    // Return original array if no filters are specified
    if (!options.since && !options.until && !options.search) {
      return result;
    }

    let filteredConversations = conversations;
    const appliedFilters: string[] = [];

    // Apply date filter
    if (options.since || options.until) {
      const before = filteredConversations.length;
      filteredConversations = this.filterByDate(
        filteredConversations,
        options.since,
        options.until,
      );
      const after = filteredConversations.length;
      const removed = before - after;

      if (removed > 0) {
        result.appliedFilters.dateRange = {
          removed,
        };
        if (options.since) {
          result.appliedFilters.dateRange.since = options.since;
        }
        if (options.until) {
          result.appliedFilters.dateRange.until = options.until;
        }
        appliedFilters.push(
          `date (${options.since || "∞"} to ${options.until || "∞"}): ${before} → ${after}`,
        );
      }
    }

    // Apply search filter
    if (options.search) {
      const before = filteredConversations.length;
      filteredConversations = this.filterBySearch(
        filteredConversations,
        options.search,
      );
      const after = filteredConversations.length;
      const removed = before - after;

      if (removed > 0) {
        result.appliedFilters.search = {
          keyword: options.search,
          removed,
        };
        appliedFilters.push(`search "${options.search}": ${before} → ${after}`);
      }
    }

    // Update result
    result.conversations = filteredConversations;
    result.filteredCount = filteredConversations.length;

    // Log filter results only if filtering actually happened
    if (filteredConversations.length !== originalCount) {
      appliedFilters.forEach((filter) => {
        this.logger.info(`Applied ${filter}`);
      });
      this.logger.success(
        `Filtered: ${filteredConversations.length}/${originalCount} conversations`,
      );
    }

    return result;
  }

  /**
   * Filter conversations by date range
   */
  private filterByDate(
    conversations: Conversation[],
    since?: string,
    until?: string,
  ): Conversation[] {
    if (!since && !until) return conversations;

    return conversations.filter((conv) => {
      // ISO date string always contains 'T', so split will always return at least one element
      const isoDateParts = conv.date.toISOString().split("T");
      const convDateStr = isoDateParts[0] ?? "";
      if (since && convDateStr < since) return false;
      if (until && convDateStr > until) return false;
      return true;
    });
  }

  /**
   * Filter conversations by search keyword
   */
  private filterBySearch(
    conversations: Conversation[],
    keyword?: string,
  ): Conversation[] {
    if (!keyword) return conversations;

    const searchLower = keyword.toLowerCase();
    return conversations.filter((conv) => {
      // Search in title
      if (conv.title.toLowerCase().includes(searchLower)) return true;
      // Search in messages
      return conv.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchLower),
      );
    });
  }
}
