import { describe, expect, test } from "bun:test";
import { FilenameEncoding, Format, Platform } from "../../domain/config.js";
import { type Conversation, MessageRole } from "../../domain/entities.js";
import { Logger } from "../logging/logger.js";
import { ConversationFilter } from "./conversation-filter.js";

describe("ConversationFilter", () => {
  const logger = new Logger({ quiet: true });
  const filter = new ConversationFilter(logger);

  const createConversation = (
    date: string,
    title: string,
    messages: Array<{
      role: MessageRole;
      content: string;
    }> = [],
  ): Conversation => ({
    id: `conv-${date}`,
    title,
    date: new Date(date),
    messages: messages.map((msg) => ({
      ...msg,
      timestamp: new Date(date),
    })),
  });

  describe("filterByDate", () => {
    const conversations: Conversation[] = [
      createConversation("2024-01-01", "New Year Chat"),
      createConversation("2024-02-14", "Valentine Chat"),
      createConversation("2024-03-15", "Mid March Chat"),
      createConversation("2024-12-25", "Christmas Chat"),
    ];

    test("filters conversations by since date", () => {
      const result = filter.filterConversations(conversations, {
        since: "2024-03-01",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Mid March Chat");
      expect(result[1]?.title).toBe("Christmas Chat");
    });

    test("filters conversations by until date", () => {
      const result = filter.filterConversations(conversations, {
        until: "2024-02-28",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("New Year Chat");
      expect(result[1]?.title).toBe("Valentine Chat");
    });

    test("filters conversations by date range", () => {
      const result = filter.filterConversations(conversations, {
        since: "2024-02-01",
        until: "2024-03-31",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Valentine Chat");
      expect(result[1]?.title).toBe("Mid March Chat");
    });

    test("includes conversations on boundary dates", () => {
      const result = filter.filterConversations(conversations, {
        since: "2024-02-14",
        until: "2024-02-14",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Valentine Chat");
    });

    test("returns all conversations when no date filters", () => {
      const result = filter.filterConversations(conversations, {
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(4);
    });
  });

  describe("filterBySearch", () => {
    const conversations: Conversation[] = [
      createConversation("2024-01-01", "JavaScript Tutorial", [
        { role: MessageRole.User, content: "Tell me about JavaScript" },
        {
          role: MessageRole.Assistant,
          content: "JavaScript is a programming language",
        },
      ]),
      createConversation("2024-02-01", "Python Guide", [
        { role: MessageRole.User, content: "Explain Python basics" },
        { role: MessageRole.Assistant, content: "Python is easy to learn" },
      ]),
      createConversation("2024-03-01", "TypeScript Introduction", [
        { role: MessageRole.User, content: "What is TypeScript?" },
        {
          role: MessageRole.Assistant,
          content: "TypeScript is JavaScript with types",
        },
      ]),
    ];

    test("filters by keyword in title", () => {
      const result = filter.filterConversations(conversations, {
        search: "Tutorial",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("JavaScript Tutorial");
    });

    test("filters by keyword in messages", () => {
      const result = filter.filterConversations(conversations, {
        search: "programming",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("JavaScript Tutorial");
    });

    test("search is case-insensitive", () => {
      const result = filter.filterConversations(conversations, {
        search: "PYTHON",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe("Python Guide");
    });

    test("searches across both title and content", () => {
      const result = filter.filterConversations(conversations, {
        search: "JavaScript",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(2); // Found in both conversations
    });

    test("returns all conversations when no search keyword", () => {
      const result = filter.filterConversations(conversations, {
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(3);
    });
  });

  describe("combined filters", () => {
    const conversations: Conversation[] = [
      createConversation("2024-01-01", "Early JavaScript", [
        { role: MessageRole.User, content: "JavaScript basics" },
      ]),
      createConversation("2024-06-01", "Advanced JavaScript", [
        { role: MessageRole.User, content: "JavaScript advanced topics" },
      ]),
      createConversation("2024-03-01", "Python Tutorial", [
        { role: MessageRole.User, content: "Python programming" },
      ]),
      createConversation("2024-08-01", "TypeScript Guide", [
        { role: MessageRole.User, content: "TypeScript with JavaScript" },
      ]),
    ];

    test("applies both date and search filters", () => {
      const result = filter.filterConversations(conversations, {
        since: "2024-05-01",
        search: "JavaScript",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Advanced JavaScript");
      expect(result[1]?.title).toBe("TypeScript Guide");
    });

    test("returns empty array when no matches", () => {
      const result = filter.filterConversations(conversations, {
        since: "2024-12-01",
        search: "Rust",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    test("handles empty conversations array", () => {
      const result = filter.filterConversations([], {
        since: "2024-01-01",
        search: "test",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(0);
    });

    test("handles conversations with empty messages", () => {
      const conversations = [
        createConversation("2024-01-01", "Empty Chat", []),
      ];

      const result = filter.filterConversations(conversations, {
        search: "nothing",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(0);
    });

    test("handles special characters in search", () => {
      const conversations = [
        createConversation("2024-01-01", "C++ Tutorial", [
          { role: MessageRole.User, content: "Learn C++ programming" },
        ]),
      ];

      const result = filter.filterConversations(conversations, {
        search: "C++",
        input: "",
        platform: Platform.ChatGPT,
        format: Format.Markdown,
        split: true,
        quiet: false,
        dryRun: false,
        filenameEncoding: FilenameEncoding.Standard,
      });

      expect(result).toHaveLength(1);
    });
  });
});
