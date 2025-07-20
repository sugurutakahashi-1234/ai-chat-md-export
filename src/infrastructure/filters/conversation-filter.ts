import type { Options } from "../../domain/config/options.js";
import type { Conversation } from "../../domain/models/types.js";

/**
 * Conversation filter for date range and keyword search
 *
 * Pure domain logic for filtering conversations by date and keyword.
 * This class contains no infrastructure dependencies.
 */
export class ConversationFilter {
  /**
   * Apply all configured filters to the conversations
   *
   * Returns filtered conversations without side effects.
   * Logging should be handled by the caller.
   */
  apply(conversations: Conversation[], options: Options): Conversation[] {
    let filteredConversations = conversations;

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
