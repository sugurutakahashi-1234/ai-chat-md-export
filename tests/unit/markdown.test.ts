import { describe, expect, test } from "bun:test";
import { convertToMarkdown } from "../../src/markdown.js";
import type { Conversation } from "../../src/types.js";

describe("convertToMarkdown", () => {
  test("converts basic conversation", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test Conversation",
      date: "2024-01-01",
      messages: [
        {
          role: "user",
          content: "Hello, world!",
          timestamp: "2024-01-01T00:00:00Z",
        },
        {
          role: "assistant",
          content: "Hello! How can I help you?",
          timestamp: "2024-01-01T00:00:10Z",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("# Test Conversation");
    expect(markdown).toContain("Date: 2024-01-01");
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
      date: "2024-01-01",
      messages: [
        {
          role: "user",
          content: "Test",
          timestamp: testDate.toISOString(),
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    // Should format in local time with ISO 8601 format
    const year = testDate.getFullYear();
    const month = String(testDate.getMonth() + 1).padStart(2, "0");
    const day = String(testDate.getDate()).padStart(2, "0");
    const hours = String(testDate.getHours()).padStart(2, "0");
    const minutes = String(testDate.getMinutes()).padStart(2, "0");
    const seconds = String(testDate.getSeconds()).padStart(2, "0");
    const expectedFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    expect(markdown).toContain(`*${expectedFormat}*`);
  });

  test("handles different role types", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: "2024-01-01",
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
      date: "2024-01-01",
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
      date: "2024-01-01",
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
      date: "2024-01-01",
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
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: "2024-01-01",
      messages: [
        {
          role: "assistant",
          content:
            "Some text\n```\nThis block is not supported by the current environment.\n```\nMore text",
        },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    expect(markdown).toContain("*[Tool Use: Unsupported Block]*");
    expect(markdown).not.toContain("This block is not supported");
  });

  test("fixes escaped markdown characters", () => {
    const conversation: Conversation = {
      id: "test-123",
      title: "Test",
      date: "2024-01-01",
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
      date: "2024-01-01",
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
      date: "2024-01-01",
      messages: [
        { role: "user", content: "Message 1" },
        { role: "assistant", content: "Message 2" },
      ],
    };

    const markdown = convertToMarkdown(conversation);

    const hrCount = (markdown.match(/^---$/gm) || []).length;
    expect(hrCount).toBeGreaterThan(2); // At least one after header and one between messages
  });
});
