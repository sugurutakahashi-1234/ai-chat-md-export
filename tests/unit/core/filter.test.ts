import { describe, expect, test } from "bun:test";
import {
  applyFilters,
  filterByDate,
  filterBySearch,
} from "../../../src/core/processing/filter.js";
import type { Conversation } from "../../../src/types.js";

describe("filterByDate", () => {
  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Old Conversation",
      date: new Date("2023-12-01"),
      messages: [],
    },
    {
      id: "2",
      title: "Recent Conversation",
      date: new Date("2024-01-15"),
      messages: [],
    },
    {
      id: "3",
      title: "Future Conversation",
      date: new Date("2024-02-01"),
      messages: [],
    },
  ];

  test("filters conversations after since date", () => {
    const result = filterByDate(conversations, "2024-01-01");
    expect(result).toHaveLength(2);
    expect(result[0]?.title).toBe("Recent Conversation");
    expect(result[1]?.title).toBe("Future Conversation");
  });

  test("filters conversations before until date", () => {
    const result = filterByDate(conversations, undefined, "2024-01-20");
    expect(result).toHaveLength(2);
    expect(result[0]?.title).toBe("Old Conversation");
    expect(result[1]?.title).toBe("Recent Conversation");
  });

  test("filters conversations between since and until dates", () => {
    const result = filterByDate(conversations, "2024-01-01", "2024-01-31");
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Recent Conversation");
  });

  test("returns all conversations when no dates specified", () => {
    const result = filterByDate(conversations);
    expect(result).toHaveLength(3);
  });

  test("includes conversations on exact date boundaries", () => {
    const result = filterByDate(conversations, "2024-01-15", "2024-01-15");
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Recent Conversation");
  });
});

describe("filterBySearch", () => {
  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Python Tutorial",
      date: new Date(),
      messages: [
        { role: "user", content: "Teach me Python programming" },
        { role: "assistant", content: "Let's start with basics" },
      ],
    },
    {
      id: "2",
      title: "JavaScript Guide",
      date: new Date(),
      messages: [
        { role: "user", content: "How to use JavaScript?" },
        { role: "assistant", content: "JavaScript is a versatile language" },
      ],
    },
    {
      id: "3",
      title: "General Chat",
      date: new Date(),
      messages: [
        { role: "user", content: "Hello there" },
        { role: "assistant", content: "Hi! I can help with Python too" },
      ],
    },
  ];

  test("filters by keyword in title", () => {
    const result = filterBySearch(conversations, "python");
    expect(result).toHaveLength(2); // Title "Python Tutorial" and message with "Python too"
    expect(result[0]?.title).toBe("Python Tutorial");
    expect(result[1]?.title).toBe("General Chat");
  });

  test("filters by keyword in messages", () => {
    const result = filterBySearch(conversations, "javascript");
    expect(result).toHaveLength(1); // Only in title and message of "JavaScript Guide"
    expect(result[0]?.title).toBe("JavaScript Guide");
  });

  test("search is case-insensitive", () => {
    const result = filterBySearch(conversations, "PYTHON");
    expect(result).toHaveLength(2); // One in title, one in message
    expect(result[0]?.title).toBe("Python Tutorial");
    expect(result[1]?.title).toBe("General Chat");
  });

  test("returns all conversations when no keyword specified", () => {
    const result = filterBySearch(conversations);
    expect(result).toHaveLength(3);
  });

  test("handles partial matches", () => {
    const result = filterBySearch(conversations, "Script");
    expect(result).toHaveLength(1); // Only JavaScript contains "Script"
    expect(result[0]?.title).toBe("JavaScript Guide");
  });
});

describe("applyFilters", () => {
  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Old Python Tutorial",
      date: new Date("2023-12-01"),
      messages: [{ role: "user", content: "Teach me Python" }],
    },
    {
      id: "2",
      title: "Recent JavaScript Guide",
      date: new Date("2024-01-15"),
      messages: [{ role: "user", content: "JavaScript basics" }],
    },
    {
      id: "3",
      title: "Future Python Workshop",
      date: new Date("2024-02-01"),
      messages: [{ role: "user", content: "Advanced Python topics" }],
    },
  ];

  test("applies date and search filters together", () => {
    const options = {
      input: "",
      platform: "chatgpt" as const,
      format: "markdown" as const,
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard" as const,
      split: true,
      since: "2024-01-01",
      search: "python",
    };

    const result = applyFilters(conversations, options);
    expect(result.filteredConversations).toHaveLength(1);
    expect(result.filteredConversations[0]?.title).toBe(
      "Future Python Workshop",
    );
    expect(result.stats.originalCount).toBe(3);
    expect(result.stats.filteredCount).toBe(1);
  });

  test("returns stats with no filters", () => {
    const options = {
      input: "",
      platform: "chatgpt" as const,
      format: "markdown" as const,
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard" as const,
      split: true,
    };

    const result = applyFilters(conversations, options);
    expect(result.filteredConversations).toHaveLength(3);
    expect(result.stats.originalCount).toBe(3);
    expect(result.stats.filteredCount).toBe(3);
  });
});
