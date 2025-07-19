import { describe, expect, test } from "bun:test";
import {
  convertSingleConversationToJson,
  convertToJson,
} from "../../../src/converters/json.js";
import type { Conversation } from "../../../src/types.js";

describe("JSON converters", () => {
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

  describe("convertSingleConversationToJson", () => {
    test("converts a single conversation to JSON", () => {
      const json = convertSingleConversationToJson(sampleConversation);
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

      const json = convertSingleConversationToJson(conversation);
      const parsed = JSON.parse(json);

      expect(parsed.messages[0].timestamp).toBeUndefined();
    });
  });

  describe("convertToJson", () => {
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

      const json = convertToJson(conversations);
      const parsed = JSON.parse(json);

      expect(parsed.conversations).toHaveLength(2);
      expect(parsed.conversations[0].id).toBe("test-123");
      expect(parsed.conversations[1].id).toBe("test-456");
      expect(parsed.conversations[1].messages[0].role).toBe("system");
    });

    test("handles empty conversations array", () => {
      const json = convertToJson([]);
      const parsed = JSON.parse(json);

      expect(parsed.conversations).toHaveLength(0);
    });
  });

  test("JSON output is properly formatted", () => {
    const json = convertSingleConversationToJson(sampleConversation);

    // Check that it's indented (contains newlines and spaces)
    expect(json).toContain("\n");
    expect(json).toContain("  ");
  });
});
