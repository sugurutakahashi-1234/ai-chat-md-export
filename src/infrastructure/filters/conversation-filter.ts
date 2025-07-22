import type { Options } from "../../domain/config.js";
import type { Conversation } from "../../domain/entities.js";
import type { IConversationFilter } from "../../domain/interfaces/conversation-filter.js";
import type { ILogger } from "../../domain/interfaces/logger.js";

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
    options: Options,
  ): Conversation[] {
    let filteredConversations = conversations;

    // Apply date filter
    if (options.since || options.until) {
      const before = filteredConversations.length;
      filteredConversations = this.filterByDate(
        filteredConversations,
        options.since,
        options.until,
      );
      const after = filteredConversations.length;
      this.logger.info(
        `Date filter (${options.since || "∞"} to ${options.until || "∞"}): ${before} → ${after} conversations`,
      );
    }

    // Apply search filter
    if (options.search) {
      const before = filteredConversations.length;
      filteredConversations = this.filterBySearch(
        filteredConversations,
        options.search,
      );
      const after = filteredConversations.length;
      this.logger.info(
        `Search filter "${options.search}": ${before} → ${after} conversations`,
      );
    }

    return filteredConversations;
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
