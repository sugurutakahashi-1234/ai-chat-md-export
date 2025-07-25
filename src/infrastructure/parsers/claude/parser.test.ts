import { describe, expect, test } from "bun:test";
import { MessageRole } from "../../../domain/entities.js";
import { Logger } from "../../logging/logger.js";
import { Spinner } from "../../progress/spinner.js";
import { SchemaValidator } from "../../validation/schema-validator.js";
import { ClaudeParser } from "./parser.js";
import type { ClaudeConversation } from "./schema.js";

describe("Claude Parser", () => {
  const logger = new Logger({ quiet: true });
  const schemaValidator = new SchemaValidator();
  const spinner = new Spinner(logger, { quiet: true });
  const parser = new ClaudeParser(logger, schemaValidator, spinner);

  const createSampleData = (): ClaudeConversation => ({
    uuid: "conv-123",
    name: "Test Conversation",
    created_at: "2024-01-01T12:00:00Z",
    chat_messages: [
      {
        uuid: "msg-1",
        text: "Hello, Claude!",
        sender: "human",
        created_at: "2024-01-01T12:00:00Z",
      },
      {
        uuid: "msg-2",
        text: "Hello! How can I help you today?",
        sender: "assistant",
        created_at: "2024-01-01T12:00:10Z",
      },
    ],
  });

  describe("parseAndValidateConversations", () => {
    test("parses valid Claude data", async () => {
      const data = [createSampleData()];
      const result = await parser.parseAndValidateConversations(data, {
        quiet: true,
      });

      expect(result.conversations).toHaveLength(1);
      expect(result.conversations[0]!.id).toBe("conv-123");
      expect(result.conversations[0]!.title).toBe("Test Conversation");
      expect(result.conversations[0]!.date).toEqual(
        new Date("2024-01-01T12:00:00Z"),
      );
      expect(result.conversations[0]!.messages).toHaveLength(2);
      expect(result.successCount).toBe(1);
      expect(result.skippedFields).toEqual([]);
      expect(result.validationErrors).toEqual([]);
    });

    test("transforms messages correctly", async () => {
      const data = [createSampleData()];
      const result = await parser.parseAndValidateConversations(data, {
        quiet: true,
      });

      const messages = result.conversations[0]!.messages;
      expect(messages[0]!.role).toBe(MessageRole.User);
      expect(messages[0]!.content).toBe("Hello, Claude!");
      expect(messages[0]!.timestamp).toEqual(new Date("2024-01-01T12:00:00Z"));

      expect(messages[1]!.role).toBe(MessageRole.Assistant);
      expect(messages[1]!.content).toBe("Hello! How can I help you today?");
      expect(messages[1]!.timestamp).toEqual(new Date("2024-01-01T12:00:10Z"));
    });

    test("handles old format with role field", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-456",
        name: "Old Format Conversation",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            role: "human",
            content: "Old format message",
            created_at: "2024-01-01T12:00:00Z",
          },
          {
            role: "assistant",
            content: "Old format response",
            created_at: "2024-01-01T12:00:10Z",
          },
        ],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });
      const messages = result.conversations[0]!.messages;

      expect(messages[0]!.role).toBe(MessageRole.User); // human -> user
      expect(messages[0]!.content).toBe("Old format message");
      expect(messages[1]!.role).toBe(MessageRole.Assistant);
      expect(messages[1]!.content).toBe("Old format response");
    });

    test("handles content array format", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-789",
        name: "Content Array Conversation",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            sender: "human",
            content: [
              { type: "text", text: "First part" },
              { type: "text", text: "Second part" },
            ],
            created_at: "2024-01-01T12:00:00Z",
          },
          {
            sender: "assistant",
            content: [
              { type: "thinking", thinking: "Let me think..." },
              { type: "text", text: "Here's my response" },
            ],
            created_at: "2024-01-01T12:00:10Z",
          },
        ],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });
      const messages = result.conversations[0]!.messages;

      expect(messages[0]!.content).toBe("First part\nSecond part");
      // Thinking content should be filtered out
      expect(messages[1]!.content).toBe("Here's my response");
    });

    test("handles empty content array", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-empty",
        name: "Empty Content",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            sender: "human",
            content: [],
            created_at: "2024-01-01T12:00:00Z",
          },
        ],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });
      expect(result.conversations[0]!.messages[0]!.content).toBe("");
    });

    test("handles missing name", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-no-name",
        name: "",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });
      expect(result.conversations[0]!.title).toBe("Untitled Conversation");
    });

    test("handles messages without created_at", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-no-timestamp",
        name: "No Timestamp",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            sender: "human",
            text: "Message without timestamp",
            // created_at is optional in schema, so we can omit it
          },
        ],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      // Should use current date as fallback
      const messageTimestamp = result.conversations[0]!.messages[0]!.timestamp;
      expect(messageTimestamp).toBeInstanceOf(Date);
      // Check that it's recent (within last minute)
      const now = new Date();
      if (messageTimestamp) {
        const diff = now.getTime() - messageTimestamp.getTime();
        expect(diff).toBeLessThan(60000); // Less than 1 minute
      }
    });

    test("handles messages without role or sender", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-no-role",
        name: "No Role",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            content: "Message without role",
            created_at: "2024-01-01T12:00:00Z",
          } as any, // Force type to test edge case
        ],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      // Should default to "user" role
      expect(result.conversations[0]!.messages[0]!.role).toBe(MessageRole.User);
    });

    test("handles different content structures", async () => {
      const data: ClaudeConversation = {
        uuid: "conv-mixed",
        name: "Mixed Content",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            sender: "human",
            content: "String content",
            created_at: "2024-01-01T12:00:00Z",
          },
          {
            sender: "assistant",
            // Test with text field instead of invalid content
            text: "Text field content",
            created_at: "2024-01-01T12:00:10Z",
          },
        ],
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      expect(result.conversations[0]!.messages[0]!.content).toBe(
        "String content",
      );
      expect(result.conversations[0]!.messages[1]!.content).toBe(
        "Text field content",
      );
    });

    test("handles invalid data gracefully", async () => {
      const invalidData = { not: "valid" };

      const result = await parser.parseAndValidateConversations(
        [invalidData as any],
        {
          quiet: true,
        },
      );

      expect(result.conversations).toHaveLength(0);
      expect(result.successCount).toBe(0);
      expect(result.validationErrors.length).toBeGreaterThan(0);
    });

    test("preserves multiple conversations", async () => {
      const data: ClaudeConversation[] = [
        createSampleData(),
        {
          uuid: "conv-456",
          name: "Second Conversation",
          created_at: "2024-01-02T12:00:00Z",
          chat_messages: [
            {
              sender: "human",
              text: "Another conversation",
              created_at: "2024-01-02T12:00:00Z",
            },
          ],
        },
      ];

      const result = await parser.parseAndValidateConversations(data, {
        quiet: true,
      });

      expect(result.conversations).toHaveLength(2);
      expect(result.conversations[0]!.id).toBe("conv-123");
      expect(result.conversations[1]!.id).toBe("conv-456");
      expect(result.conversations[1]!.title).toBe("Second Conversation");
      expect(result.successCount).toBe(2);
    });
  });
});
