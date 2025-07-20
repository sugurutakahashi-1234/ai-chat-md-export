import { describe, expect, test } from "bun:test";
import {
  chatGPTContentPartSchema,
  chatGPTConversationSchema,
  chatGPTMessageSchema,
  chatGPTNodeSchema,
} from "../../../src/handlers/schemas/chatgpt.js";

describe("ChatGPT Schemas", () => {
  describe("chatGPTContentPartSchema", () => {
    test("accepts string content", () => {
      const result = chatGPTContentPartSchema.safeParse("Hello, world!");
      expect(result.success).toBe(true);
      expect(result.data).toBe("Hello, world!");
    });

    test("accepts object with text field", () => {
      const content = { content_type: "text", text: "Hello" };
      const result = chatGPTContentPartSchema.safeParse(content);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(content);
    });

    test("accepts object with additional fields (passthrough)", () => {
      const content = { content_type: "text", text: "Hello", extra: "field" };
      const result = chatGPTContentPartSchema.safeParse(content);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(content);
    });
  });

  describe("chatGPTMessageSchema", () => {
    test("accepts valid message", () => {
      const message = {
        id: "msg-123",
        author: { role: "user" },
        content: {
          content_type: "text",
          parts: ["Hello"],
        },
        create_time: 1234567890,
        update_time: null,
      };
      const result = chatGPTMessageSchema.safeParse(message);
      expect(result.success).toBe(true);
    });

    test("validates role enum", () => {
      const message = {
        id: "msg-123",
        author: { role: "invalid_role" },
        content: null,
        create_time: null,
        update_time: null,
      };
      const result = chatGPTMessageSchema.safeParse(message);
      expect(result.success).toBe(false);
    });

    test("accepts null content", () => {
      const message = {
        id: "msg-123",
        author: { role: "system" },
        content: null,
        create_time: null,
        update_time: null,
      };
      const result = chatGPTMessageSchema.safeParse(message);
      expect(result.success).toBe(true);
    });
  });

  describe("chatGPTNodeSchema", () => {
    test("accepts valid node", () => {
      const node = {
        id: "node-123",
        message: null,
        parent: "node-parent",
        children: ["node-child-1", "node-child-2"],
      };
      const result = chatGPTNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
    });

    test("accepts node with message", () => {
      const node = {
        id: "node-123",
        message: {
          id: "msg-123",
          author: { role: "user" },
          content: null,
          create_time: null,
          update_time: null,
        },
        children: [],
      };
      const result = chatGPTNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
    });
  });

  describe("chatGPTConversationSchema", () => {
    test("accepts valid conversation", () => {
      const conversation = {
        title: "Test Conversation",
        create_time: 1234567890,
        mapping: {
          "node-1": {
            id: "node-1",
            message: null,
            children: ["node-2"],
          },
          "node-2": {
            id: "node-2",
            message: {
              id: "msg-1",
              author: { role: "user" },
              content: { parts: ["Hello"] },
              create_time: 1234567890,
              update_time: null,
            },
            parent: "node-1",
            children: [],
          },
        },
      };
      const result = chatGPTConversationSchema.safeParse(conversation);
      expect(result.success).toBe(true);
    });

    test("requires title and mapping", () => {
      const conversation = {};
      const result = chatGPTConversationSchema.safeParse(conversation);
      expect(result.success).toBe(false);
    });

    test("accepts additional fields (passthrough)", () => {
      const conversation = {
        title: "Test",
        create_time: null,
        mapping: {},
        custom_field: "value",
      };
      const result = chatGPTConversationSchema.safeParse(conversation);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("custom_field", "value");
    });
  });
});
