import { describe, expect, test } from "bun:test";
import type { Conversation } from "../../../../src/domain/models/types.js";
import { JsonFormatter } from "../../../../src/infrastructure/formatters/json-formatter.js";

describe("JSON converters", () => {
  const formatter = new JsonFormatter();
  const sampleConversation: Conversation = {
    id: "test-123",
    title: "Test Conversation",
    date: new Date("2024-01-01T12:00:00Z"),
    messages: [
      {
        role: "user",
        content: "Hello, world!",
        timestamp: new Date("2024-01-01T12:00:00Z"),
      },
      {
        role: "assistant",
        content: "Hello! How can I help you?",
        timestamp: new Date("2024-01-01T12:00:10Z"),
      },
    ],
  };

  describe("formatSingle", () => {
    test("converts a single conversation to JSON", () => {
      const json = formatter.formatSingle(sampleConversation);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe("test-123");
      expect(parsed.title).toBe("Test Conversation");
      expect(parsed.date).toBe("2024-01-01T12:00:00.000Z");
      expect(parsed.messages).toHaveLength(2);
      expect(parsed.messages[0].role).toBe("user");
      expect(parsed.messages[0].content).toBe("Hello, world!");
      expect(parsed.messages[0].timestamp).toBe("2024-01-01T12:00:00.000Z");
      expect(parsed.messages[1].role).toBe("assistant");
      expect(parsed.messages[1].content).toBe("Hello! How can I help you?");
      expect(parsed.messages[1].timestamp).toBe("2024-01-01T12:00:10.000Z");
    });

    test("handles messages without timestamps", () => {
      const conversation: Conversation = {
        ...sampleConversation,
        messages: [
          {
            role: "user",
            content: "No timestamp",
          },
        ],
      };

      const json = formatter.formatSingle(conversation);
      const parsed = JSON.parse(json);

      expect(parsed.messages[0].timestamp).toBeUndefined();
    });
  });

  describe("formatMultiple", () => {
    test("converts multiple conversations to JSON", () => {
      const conversations: Conversation[] = [
        sampleConversation,
        {
          id: "test-456",
          title: "Another Conversation",
          date: new Date("2024-01-02T12:00:00Z"),
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
          ],
        },
      ];

      const json = formatter.formatMultiple(conversations);
      const parsed = JSON.parse(json);

      expect(parsed.conversations).toHaveLength(2);
      expect(parsed.conversations[0].id).toBe("test-123");
      expect(parsed.conversations[1].id).toBe("test-456");
      expect(parsed.conversations[1].messages[0].role).toBe("system");
    });
  });
});
