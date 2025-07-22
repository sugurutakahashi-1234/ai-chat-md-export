import { describe, expect, test } from "bun:test";
import type { Conversation } from "../../domain/entities.js";
import { MessageRole } from "../../domain/entities.js";
import { MarkdownFormatter } from "./markdown-formatter.js";

describe("Markdown Formatter", () => {
  const formatter = new MarkdownFormatter();
  const sampleConversation: Conversation = {
    id: "test-123",
    title: "Test Conversation",
    date: new Date("2024-01-01T12:00:00Z"),
    messages: [
      {
        role: MessageRole.User,
        content: "Hello, world!",
        timestamp: new Date("2024-01-01T12:00:00Z"),
      },
      {
        role: MessageRole.Assistant,
        content: "Hello! How can I help you?",
        timestamp: new Date("2024-01-01T12:00:10Z"),
      },
    ],
  };

  describe("formatSingle", () => {
    test("formats a single conversation to Markdown", () => {
      const markdown = formatter.formatSingle(sampleConversation);

      expect(markdown).toContain("# Test Conversation");
      expect(markdown).toContain("Date: 2024-01-01 12:00:00");
      expect(markdown).toContain("## 👤 User");
      expect(markdown).toContain("Hello, world!");
      expect(markdown).toContain("## 🤖 Assistant");
      expect(markdown).toContain("Hello! How can I help you?");
      expect(markdown).toContain("---");
    });

    test("handles messages without timestamps", () => {
      const conversation: Conversation = {
        ...sampleConversation,
        messages: [
          {
            role: MessageRole.User,
            content: "No timestamp",
          },
        ],
      };

      const markdown = formatter.formatSingle(conversation);

      expect(markdown).toContain("## 👤 User");
      expect(markdown).toContain("No timestamp");
      // Should not contain timestamp line for the message
      expect(
        markdown.split("\n").filter((line: string) => line.startsWith("Date:"))
          .length,
      ).toBe(1); // Only conversation date
    });

    test("handles different message roles correctly", () => {
      const conversation: Conversation = {
        ...sampleConversation,
        messages: [
          { role: MessageRole.System, content: "System message" },
          { role: MessageRole.User, content: "User message" },
          { role: MessageRole.Assistant, content: "Assistant message" },
          { role: MessageRole.Tool, content: "Tool message" },
        ],
      };

      const markdown = formatter.formatSingle(conversation);

      expect(markdown).toContain("## ⚙️ System");
      expect(markdown).toContain("## 👤 User");
      expect(markdown).toContain("## 🤖 Assistant");
      expect(markdown).toContain("## 🔧 Tool");
    });

    test("escapes HTML while preserving Markdown", () => {
      const conversation: Conversation = {
        ...sampleConversation,
        messages: [
          {
            role: MessageRole.User,
            content:
              "Test <script>alert('XSS')</script> with **bold** and _italic_",
          },
          {
            role: MessageRole.Assistant,
            content: "Here's some `inline code` and <div>HTML</div>",
          },
        ],
      };

      const markdown = formatter.formatSingle(conversation);

      // HTML should be escaped
      expect(markdown).toContain("&lt;script&gt;alert('XSS')&lt;/script&gt;");
      expect(markdown).toContain("&lt;div&gt;HTML&lt;/div&gt;");

      // Markdown should be preserved
      expect(markdown).toContain("**bold**");
      expect(markdown).toContain("_italic_");
      expect(markdown).toContain("`inline code`");
    });

    test("preserves code blocks and escapes HTML inside them", () => {
      const conversation: Conversation = {
        ...sampleConversation,
        messages: [
          {
            role: MessageRole.User,
            content:
              "Here's code:\n```javascript\nconst html = '<div>test</div>';\nconsole.log(html);\n```",
          },
        ],
      };

      const markdown = formatter.formatSingle(conversation);

      // Code block should be preserved with original HTML
      expect(markdown).toContain("```javascript");
      expect(markdown).toContain("const html = '<div>test</div>';");
      expect(markdown).not.toContain("&lt;div&gt;test&lt;/div&gt;");
    });

    test("handles 'This block is not supported' messages", () => {
      const conversation: Conversation = {
        ...sampleConversation,
        messages: [
          {
            role: MessageRole.Assistant,
            content: "```\nThis block is not supported by Claude\n```",
          },
        ],
      };

      const markdown = formatter.formatSingle(conversation);

      // Should show the message without code block formatting
      expect(markdown).toContain("This block is not supported by Claude");
      expect(markdown).not.toContain("```\nThis block is not supported");
    });

    test("formats date with timezone correctly", () => {
      // Test with different timezone by creating a date in local time
      const localDate = new Date(2024, 0, 1, 15, 30, 45); // Jan 1, 2024, 3:30:45 PM local time
      const conversation: Conversation = {
        ...sampleConversation,
        date: localDate,
        messages: [],
      };

      const markdown = formatter.formatSingle(conversation);

      // Should contain formatted date with timezone offset
      expect(markdown).toMatch(/Date: 2024-01-01 15:30:45 [+-]\d{2}:\d{2}/);
    });
  });

  describe("formatMultiple", () => {
    test("formats multiple conversations with separators", () => {
      const conversations: Conversation[] = [
        sampleConversation,
        {
          id: "test-456",
          title: "Another Conversation",
          date: new Date("2024-01-02T12:00:00Z"),
          messages: [
            {
              role: MessageRole.System,
              content: "You are a helpful assistant.",
            },
          ],
        },
      ];

      const markdown = formatter.formatMultiple(conversations);

      expect(markdown).toContain("# Test Conversation");
      expect(markdown).toContain("# Another Conversation");
      expect(markdown).toContain("\n\n---\n\n"); // Triple separator between conversations
      expect(markdown).toContain("## ⚙️ System");
    });

    test("handles single conversation", () => {
      const markdown = formatter.formatMultiple([sampleConversation]);

      // Should be same as formatSingle
      expect(markdown).toBe(formatter.formatSingle(sampleConversation));
    });
  });
});
