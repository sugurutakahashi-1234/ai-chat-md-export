import { describe, expect, test } from "bun:test";
import type { Conversation } from "../../../src/domain/models/types.js";
import { ConversationFilter } from "../../../src/infrastructure/filters/conversation-filter.js";
import type { Options } from "../../../src/shared/config/options.js";

describe("ConversationFilter", () => {
  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Old Python Tutorial",
      date: new Date("2023-12-01"),
      messages: [
        { role: "user", content: "Teach me Python programming" },
        { role: "assistant", content: "Let's start with basics" },
      ],
    },
    {
      id: "2",
      title: "Recent JavaScript Guide",
      date: new Date("2024-01-15"),
      messages: [
        { role: "user", content: "How to use JavaScript?" },
        { role: "assistant", content: "JavaScript is a versatile language" },
      ],
    },
    {
      id: "3",
      title: "Future Python Workshop",
      date: new Date("2024-02-01"),
      messages: [
        { role: "user", content: "Advanced Python topics" },
        { role: "assistant", content: "Hi! I can help with Python too" },
      ],
    },
  ];

  const baseOptions: Options = {
    input: "",
    platform: "chatgpt",
    format: "markdown",
    quiet: false,
    dryRun: false,
    filenameEncoding: "standard",
    split: true,
  };

  // Create filter instance
  const filter = new ConversationFilter();

  describe("Date filtering", () => {
    test("filters conversations after since date", () => {
      const options = { ...baseOptions, since: "2024-01-01" };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Recent JavaScript Guide");
      expect(result[1]?.title).toBe("Future Python Workshop");
    });

    test("filters conversations before until date", () => {
      const options = { ...baseOptions, until: "2024-01-20" };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Old Python Tutorial");
      expect(result[1]?.title).toBe("Recent JavaScript Guide");
    });

    test("filters conversations between since and until dates", () => {
      const options = {
        ...baseOptions,
        since: "2024-01-01",
        until: "2024-01-31",
      };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Recent JavaScript Guide");
    });

    test("returns all conversations when no dates specified", () => {
      const result = filter.apply(conversations, baseOptions);
      expect(result).toHaveLength(3);
    });

    test("includes conversations on exact date boundaries", () => {
      const options = {
        ...baseOptions,
        since: "2024-01-15",
        until: "2024-01-15",
      };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Recent JavaScript Guide");
    });
  });

  describe("Search filtering", () => {
    test("filters by keyword in title", () => {
      const options = { ...baseOptions, search: "python" };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Old Python Tutorial");
      expect(result[1]?.title).toBe("Future Python Workshop");
    });

    test("filters by keyword in messages", () => {
      const options = { ...baseOptions, search: "javascript" };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Recent JavaScript Guide");
    });

    test("search is case-insensitive", () => {
      const options = { ...baseOptions, search: "PYTHON" };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Old Python Tutorial");
      expect(result[1]?.title).toBe("Future Python Workshop");
    });

    test("returns all conversations when no keyword specified", () => {
      const result = filter.apply(conversations, baseOptions);
      expect(result).toHaveLength(3);
    });

    test("handles partial matches", () => {
      const options = { ...baseOptions, search: "Script" };
      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Recent JavaScript Guide");
    });
  });

  describe("Combined filtering", () => {
    test("applies date and search filters together", () => {
      const options = {
        ...baseOptions,
        since: "2024-01-01",
        search: "python",
      };

      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Future Python Workshop");
    });

    test("returns empty when no matches for combined filters", () => {
      const options = {
        ...baseOptions,
        since: "2024-01-01",
        until: "2024-01-31",
        search: "python",
      };

      const result = filter.apply(conversations, options);
      expect(result).toHaveLength(0);
    });

    test("returns all conversations with no filters", () => {
      const result = filter.apply(conversations, baseOptions);
      expect(result).toHaveLength(3);
    });
  });
});
