import type { Conversation } from "../types.js";
import type { Options } from "../utils/options.js";

export interface FilterStats {
  originalCount: number;
  filteredCount: number;
}

export function filterByDate(
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

export function filterBySearch(
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

export function applyFilters(
  conversations: Conversation[],
  options: Options,
): { filteredConversations: Conversation[]; stats: FilterStats } {
  let filteredConversations = conversations;
  const originalCount = conversations.length;

  // Apply date filter
  filteredConversations = filterByDate(
    filteredConversations,
    options.since,
    options.until,
  );

  // Apply search filter
  filteredConversations = filterBySearch(filteredConversations, options.search);

  return {
    filteredConversations,
    stats: {
      originalCount,
      filteredCount: filteredConversations.length,
    },
  };
}
