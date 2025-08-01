import { describe, expect, test } from "bun:test";
import { MessageRole } from "../../../domain/entities.js";
import { Logger } from "../../logging/logger.js";
import { Spinner } from "../../progress/spinner.js";
import { SchemaValidator } from "../../validation/schema-validator.js";
import { ChatGPTParser } from "./parser.js";
import type { ChatGPTConversation } from "./schema.js";

describe("ChatGPT Parser", () => {
  const logger = new Logger({ quiet: true });
  const schemaValidator = new SchemaValidator();
  const spinner = new Spinner(logger, { quiet: true });
  const parser = new ChatGPTParser(logger, schemaValidator, spinner);

  const createSampleData = (): ChatGPTConversation => ({
    id: "test-123",
    title: "Test Conversation",
    create_time: 1704110400, // 2024-01-01T12:00:00Z
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
          author: { role: MessageRole.User },
          content: {
            content_type: "text",
            parts: ["Hello, world!"],
          },
          create_time: 1704110400,
          update_time: null,
        },
        parent: "node-1",
        children: ["node-3"],
      },
      "node-3": {
        id: "node-3",
        message: {
          id: "msg-2",
          author: { role: MessageRole.Assistant },
          content: {
            content_type: "text",
            parts: ["Hello! How can I help you?"],
          },
          create_time: 1704110410,
          update_time: null,
        },
        parent: "node-2",
        children: [],
      },
    },
  });

  describe("parseAndValidateConversations", () => {
    test("parses valid ChatGPT data", async () => {
      const data = [createSampleData()];
      const result = await parser.parseAndValidateConversations(data, {
        quiet: true,
      });

      expect(result.conversations).toHaveLength(1);
      expect(result.conversations[0]!.id).toBe("test-123");
      expect(result.conversations[0]!.title).toBe("Test Conversation");
      expect(result.conversations[0]!.date).toEqual(
        new Date("2024-01-01T12:00:00Z"),
      );
      expect(result.conversations[0]!.messages).toHaveLength(2);
      expect(result.successCount).toBe(1);
      expect(result.skippedFields).toEqual([]);
      expect(result.validationErrors).toEqual([]);
    });

    test("extracts messages in correct order", async () => {
      const data = [createSampleData()];
      const result = await parser.parseAndValidateConversations(data, {
        quiet: true,
      });

      const messages = result.conversations[0]!.messages;
      expect(messages[0]!.role).toBe(MessageRole.User);
      expect(messages[0]!.content).toBe("Hello, world!");
      expect(messages[1]!.role).toBe(MessageRole.Assistant);
      expect(messages[1]!.content).toBe("Hello! How can I help you?");
    });

    test("handles nested node structure correctly", async () => {
      const data: ChatGPTConversation = {
        title: "Nested Conversation",
        create_time: 1704110400,
        mapping: {
          root: {
            id: "root",
            message: null,
            children: ["child1", "child2"], // Branching conversation
          },
          child1: {
            id: "child1",
            message: {
              id: "msg-1",
              author: { role: MessageRole.User },
              content: { parts: ["First branch"] },
              create_time: 1704110400,
              update_time: null,
            },
            parent: "root",
            children: ["response1"],
          },
          child2: {
            id: "child2",
            message: {
              id: "msg-2",
              author: { role: MessageRole.User },
              content: { parts: ["Second branch"] },
              create_time: 1704110400,
              update_time: null,
            },
            parent: "root",
            children: [],
          },
          response1: {
            id: "response1",
            message: {
              id: "msg-3",
              author: { role: MessageRole.Assistant },
              content: { parts: ["Response to first branch"] },
              create_time: 1704110410,
              update_time: null,
            },
            parent: "child1",
            children: [],
          },
        },
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      // Should only follow the first child in branches
      const messages = result.conversations[0]!.messages;
      expect(messages).toHaveLength(2);
      expect(messages[0]!.content).toBe("First branch");
      expect(messages[1]!.content).toBe("Response to first branch");
    });

    test("handles different message roles", async () => {
      const data: ChatGPTConversation = {
        title: "Multi-role Conversation",
        create_time: 1704110400,
        mapping: {
          n1: {
            id: "n1",
            message: null,
            children: ["n2"],
          },
          n2: {
            id: "n2",
            message: {
              id: "m1",
              author: { role: MessageRole.System },
              content: { parts: ["System prompt"] },
              create_time: null,
              update_time: null,
            },
            children: ["n3"],
          },
          n3: {
            id: "n3",
            message: {
              id: "m2",
              author: { role: MessageRole.Tool },
              content: { parts: ["Tool output"] },
              create_time: null,
              update_time: null,
            },
            children: [],
          },
        },
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });
      const messages = result.conversations[0]!.messages;

      expect(messages[0]!.role).toBe(MessageRole.System);
      expect(messages[1]!.role).toBe(MessageRole.Tool);
    });

    test("handles messages with timestamps", async () => {
      const data = [createSampleData()];
      const result = await parser.parseAndValidateConversations(data, {
        quiet: true,
      });

      expect(result.conversations[0]!.messages[0]!.timestamp).toEqual(
        new Date("2024-01-01T12:00:00Z"),
      );
      expect(result.conversations[0]!.messages[1]!.timestamp).toEqual(
        new Date("2024-01-01T12:00:10Z"),
      );
    });

    test("handles messages without timestamps", async () => {
      const data: ChatGPTConversation = {
        title: "No timestamps",
        create_time: null,
        mapping: {
          n1: {
            id: "n1",
            message: {
              id: "m1",
              author: { role: MessageRole.User },
              content: { parts: ["Message"] },
              create_time: null,
              update_time: null,
            },
            children: [],
          },
        },
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      expect(result.conversations[0]!.messages[0]!.timestamp).toBeUndefined();
    });

    test("handles complex content parts", async () => {
      const data: ChatGPTConversation = {
        title: "Complex content",
        create_time: 1704110400,
        mapping: {
          n1: {
            id: "n1",
            message: {
              id: "m1",
              author: { role: MessageRole.User },
              content: {
                parts: [
                  "Text part",
                  { content_type: "text", text: "Object with text" },
                  {
                    content_type: "image",
                    url: "http://example.com/image.png",
                  },
                ],
              },
              create_time: null,
              update_time: null,
            },
            children: [],
          },
        },
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });
      const content = result.conversations[0]!.messages[0]!.content;

      expect(content).toContain("Text part");
      expect(content).toContain("Object with text");
      expect(content).toContain('"content_type": "image"'); // Objects are stringified
    });

    test("filters out empty messages", async () => {
      const data: ChatGPTConversation = {
        title: "With empty messages",
        create_time: 1704110400,
        mapping: {
          n1: {
            id: "n1",
            message: {
              id: "m1",
              author: { role: MessageRole.User },
              content: { parts: [] }, // Empty parts
              create_time: null,
              update_time: null,
            },
            children: ["n2"],
          },
          n2: {
            id: "n2",
            message: {
              id: "m2",
              author: { role: MessageRole.Assistant },
              content: { parts: ["Valid message"] },
              create_time: null,
              update_time: null,
            },
            children: [],
          },
        },
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      expect(result.conversations[0]!.messages).toHaveLength(1);
      expect(result.conversations[0]!.messages[0]!.content).toBe(
        "Valid message",
      );
    });

    test("handles missing id and title", async () => {
      const data: ChatGPTConversation = {
        title: "",
        create_time: 1704110400,
        mapping: {
          "node-1": {
            id: "node-1",
            message: null,
            children: [],
          },
        },
      };

      const result = await parser.parseAndValidateConversations([data], {
        quiet: true,
      });

      expect(result.conversations[0]!.id).toBe("node-1"); // Uses first mapping key
      expect(result.conversations[0]!.title).toBe("Untitled Conversation");
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
  });
});
