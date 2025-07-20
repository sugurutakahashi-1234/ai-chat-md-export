import type { Conversation } from "../../types.js";
import type { Logger } from "../../utils/logger.js";
import type { Options } from "../../utils/options.js";
import type {
  Filter,
  FilterResult,
  FilterStats,
} from "../interfaces/filter.js";

/**
 * Concrete implementation of the Filter interface for conversations
 */
export class ConversationFilter implements Filter {
  constructor(private readonly logger: Logger) {}

  /**
   * Apply all configured filters to the conversations
   */
  apply(conversations: Conversation[], options: Options): FilterResult {
    let filteredConversations = conversations;
    const originalCount = conversations.length;

    // Apply date filter
    filteredConversations = this.filterByDate(
      filteredConversations,
      options.since,
      options.until,
    );

    // Apply search filter
    filteredConversations = this.filterBySearch(
      filteredConversations,
      options.search,
    );

    return {
      filteredConversations,
      stats: {
        originalCount,
        filteredCount: filteredConversations.length,
      },
    };
  }

  /**
   * Log filter statistics to the logger
   */
  logStats(stats: FilterStats, options: Options): void {
    if (options.since || options.until || options.search) {
      this.logger.stat(
        "Filtered",
        `${stats.filteredCount} of ${stats.originalCount} conversations`,
      );
      const filters = [];
      if (options.since || options.until) {
        const dateRange = [];
        if (options.since) dateRange.push(`from ${options.since}`);
        if (options.until) dateRange.push(`to ${options.until}`);
        filters.push(`date ${dateRange.join(" ")}`);
      }
      if (options.search) {
        filters.push(`keyword "${options.search}"`);
      }
      if (filters.length > 0) {
        this.logger.stat("Filters", filters.join(", "));
      }
    }
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
