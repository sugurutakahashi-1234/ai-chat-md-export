import { describe, expect, test } from "bun:test";
import {
  claudeConversationSchema,
  claudeMessageContentSchema,
  claudeMessageSchema,
} from "../../../src/parsers/schemas/claude.js";

describe("Claude Schemas", () => {
  describe("claudeMessageContentSchema", () => {
    test("accepts text content", () => {
      const content = { type: "text", text: "Hello, Claude!" };
      const result = claudeMessageContentSchema.safeParse(content);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(content);
    });

    test("accepts thinking content", () => {
      const content = { type: "thinking", thinking: "Processing..." };
      const result = claudeMessageContentSchema.safeParse(content);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(content);
    });

    test("accepts additional fields (passthrough)", () => {
      const content = { type: "custom", text: "Hello", extra: "field" };
      const result = claudeMessageContentSchema.safeParse(content);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(content);
    });
  });

  describe("claudeMessageSchema", () => {
    test("accepts new format with sender", () => {
      const message = {
        uuid: "msg-123",
        text: "Hello!",
        sender: "human",
        created_at: "2024-01-01T00:00:00Z",
      };
      const result = claudeMessageSchema.safeParse(message);
      expect(result.success).toBe(true);
    });

    test("accepts old format with role", () => {
      const message = {
        role: "user",
        content: "Hello!",
        created_at: "2024-01-01T00:00:00Z",
      };
      const result = claudeMessageSchema.safeParse(message);
      expect(result.success).toBe(true);
    });

    test("accepts content as array", () => {
      const message = {
        sender: "assistant",
        content: [
          { type: "text", text: "Hello" },
          { type: "thinking", thinking: "Thinking..." },
        ],
        created_at: "2024-01-01T00:00:00Z",
      };
      const result = claudeMessageSchema.safeParse(message);
      expect(result.success).toBe(true);
    });

    test("validates sender enum", () => {
      const message = {
        sender: "invalid_sender",
        text: "Hello",
      };
      const result = claudeMessageSchema.safeParse(message);
      expect(result.success).toBe(false);
    });

    test("validates role enum", () => {
      const message = {
        role: "invalid_role",
        content: "Hello",
      };
      const result = claudeMessageSchema.safeParse(message);
      expect(result.success).toBe(false);
    });
  });

  describe("claudeConversationSchema", () => {
    test("accepts valid conversation", () => {
      const conversation = {
        uuid: "conv-123",
        name: "Test Conversation",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [
          {
            uuid: "msg-1",
            text: "Hello",
            sender: "human",
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            uuid: "msg-2",
            text: "Hi there!",
            sender: "assistant",
            created_at: "2024-01-01T00:00:10Z",
          },
        ],
      };
      const result = claudeConversationSchema.safeParse(conversation);
      expect(result.success).toBe(true);
    });

    test("requires uuid, name, created_at, and chat_messages", () => {
      const conversation = {
        name: "Test",
        chat_messages: [],
      };
      const result = claudeConversationSchema.safeParse(conversation);
      expect(result.success).toBe(false);
    });

    test("accepts optional fields", () => {
      const conversation = {
        uuid: "conv-123",
        name: "Test",
        summary: "A test conversation",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T01:00:00Z",
        chat_messages: [],
        project_uuid: null,
        conversation_type: "chat",
        current_leaf_message_uuid: "msg-123",
      };
      const result = claudeConversationSchema.safeParse(conversation);
      expect(result.success).toBe(true);
    });

    test("accepts additional fields (passthrough)", () => {
      const conversation = {
        uuid: "conv-123",
        name: "Test",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [],
        custom_field: "value",
      };
      const result = claudeConversationSchema.safeParse(conversation);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("custom_field", "value");
    });
  });
});
