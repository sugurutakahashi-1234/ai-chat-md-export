import { describe, expect, test } from "bun:test";
import {
  convertMultipleToMarkdown,
  convertToMarkdown,
} from "../../src/core/formatters/markdown.js";
import type { Conversation } from "../../src/types.js";

describe("convertToMarkdown", () => {
  test("converts basic conversation", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test Conversation",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "user",
          content: "Hello, world!",
          timestamp: new Date("2024-01-01T00:00:00Z"),
        },
        {
          role: "assistant",
          content: "Hello! How can I help you?",
          timestamp: new Date("2024-01-01T00:00:10Z"),
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("# Test Conversation");
    // Check that the date is formatted with time and timezone
    expect(markdown).toMatch(
      /Date: 2024-01-01 \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}/,
    );
    expect(markdown).toContain("## 👤 User");
    expect(markdown).toContain("Hello, world!");
    expect(markdown).toContain("## 🤖 Assistant");
    expect(markdown).toContain("Hello! How can I help you?");
  });

  test("formats timestamps correctly", () => {
    const testDate = new Date("2024-01-01T12:34:56Z");
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "user",
          content: "Test",
          timestamp: testDate,
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    // Should format in local time with timezone info

    // Check for Date: prefix and timezone offset
    expect(markdown).toMatch(
      /Date: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{2}:\d{2}/,
    );
    // The exact format will depend on the test runner's timezone
  });

  test("handles different role types", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        { role: "user", content: "User message" },
        { role: "assistant", content: "Assistant message" },
        { role: "system", content: "System message" },
        { role: "tool", content: "Tool message" },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("## 👤 User");
    expect(markdown).toContain("## 🤖 Assistant");
    expect(markdown).toContain("## ⚙️ System");
    expect(markdown).toContain("## 🔧 Tool");
  });

  test("escapes HTML tags", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "user",
          content: "This is <script>alert('xss')</script> content",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("&lt;script&gt;alert('xss')&lt;/script&gt;");
    expect(markdown).not.toContain("<script>");
  });

  test("preserves code blocks", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "assistant",
          content: "Here's some code:\n```python\nprint('Hello, world!')\n```",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("```python");
    expect(markdown).toContain("print('Hello, world!')");
    expect(markdown).toContain("```");
  });

  test("preserves inline code", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "assistant",
          content: "Use `console.log()` to debug",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("`console.log()`");
  });

  test("handles 'This block is not supported' messages", () => {
    const testCases = [
      {
        content:
          "```\nThis block is not supported by the current environment.\n```",
        expected: "This block is not supported by the current environment.",
      },
      {
        content: "```\nThis block is not supported: Image Generation\n```",
        expected: "This block is not supported: Image Generation",
      },
      {
        content: "```\nThis block is not supported for DALL-E\n```",
        expected: "This block is not supported for DALL-E",
      },
      {
        content: "```\nThis block is not supported with Code Interpreter.\n```",
        expected: "This block is not supported with Code Interpreter.",
      },
      {
        content: "```\nThis block is not supported\n```",
        expected: "This block is not supported",
      },
      {
        content:
          "```\nThis block is not supported on your current device yet.\n```",
        expected: "This block is not supported on your current device yet.",
      },
    ];

    for (const testCase of testCases) {
      const conversation: Conversation = {
        id: "test-123",
        title: "Test",
        date: new Date("2024-01-01"),
        messages: [
          {
            role: "assistant",
            content: testCase.content,
          },
        ],
      };

      const markdown = convertToMarkdown(conversation);
      expect(markdown).toContain(testCase.expected);
      expect(markdown).not.toContain("```");
    }
  });

  test("fixes escaped markdown characters", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "user",
          content:
            "This has \\*escaped\\* asterisks and \\_underscores\\_ and \\[brackets\\]",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("This has *escaped* asterisks");
    expect(markdown).toContain("and _underscores_");
    expect(markdown).toContain("and [brackets]");
    expect(markdown).not.toContain("\\*");
    expect(markdown).not.toContain("\\_");
    expect(markdown).not.toContain("\\[");
  });

  test("trims message content", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "user",
          content: "  \n\n  Trimmed content  \n\n  ",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    const lines = markdown.split("\n");
    const contentIndex = lines.findIndex((line) => line === "Trimmed content");
    expect(contentIndex).toBeGreaterThan(-1);

    // Check that there are no extra blank lines around the content
    const prevLine = lines[contentIndex - 1];
    expect(prevLine).toBe("");
  });

  test("separates messages with horizontal rules", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        { role: "user", content: "Message 1" },
        { role: "assistant", content: "Message 2" },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    const hrCount = (markdown.match(/^---$/gm) || []).length;
    expect(hrCount).toBeGreaterThan(2); // At least one after header and one between messages
  });

  test("unescapes HTML entities in code blocks", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "assistant",
          content:
            "Here's some code:\n```typescript\nif (value &lt; 10 &amp;&amp; value &gt; 0) {\n  console.log(&quot;Value is between 0 and 10&quot;);\n}\n```",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    // Should unescape HTML entities in code blocks
    expect(markdown).toContain("if (value < 10 && value > 0)");
    expect(markdown).toContain('console.log("Value is between 0 and 10")');
    expect(markdown).not.toContain("&lt;");
    expect(markdown).not.toContain("&gt;");
    expect(markdown).not.toContain("&amp;");
    expect(markdown).not.toContain("&quot;");
  });
});

describe("convertMultipleToMarkdown", () => {
  test("combines multiple conversations with separators", () => {
    const conversations: Conversation[] = [
      {
        id: "test-1",
        title: "First Conversation",
        date: new Date("2024-01-01"),
        messages: [
          {
            role: "user",
            content: "First message",
          },
        ],
      },
      {
        id: "test-2",
        title: "Second Conversation",
        date: new Date("2024-01-02"),
        messages: [
          {
            role: "assistant",
            content: "Second message",
          },
        ],
      },
    ];

    const markdown = convertMultipleToMarkdown(conversations);

    // Check both conversations are included
    expect(markdown).toContain("# First Conversation");
    expect(markdown).toContain("# Second Conversation");
    expect(markdown).toContain("First message");
    expect(markdown).toContain("Second message");

    // Check that conversations are separated by the specific separator
    // between two complete conversations
    const firstConvEnd = markdown.indexOf("# Second Conversation");
    const betweenConversations = markdown.substring(0, firstConvEnd);
    expect(betweenConversations).toContain("\n\n---\n\n");
  });

  test("handles empty conversations array", () => {
    const markdown = convertMultipleToMarkdown([]);
    expect(markdown).toBe("");
  });

  test("handles single conversation", () => {
    const conversation: Conversation = {
      id: "test-1",
      title: "Single Conversation",
      date: new Date("2024-01-01"),
      messages: [
        {
          role: "user",
          content: "Only message",
        },
      ],
    };

    const markdown = convertMultipleToMarkdown([conversation]);

    // Should have the conversation content
    expect(markdown).toContain("# Single Conversation");
    expect(markdown).toContain("Only message");

    // With a single conversation, there won't be the specific triple-dash
    // separator that appears BETWEEN conversations, but there will still be
    // the normal markdown separators within the conversation
  });
});
