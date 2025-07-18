import { beforeEach, describe, expect, it } from "bun:test";
import { ConversationConverter } from "../../../src/core/conversation-converter.js";
import type { Conversation } from "../../../src/types.js";

describe("ConversationConverter", () => {
  let converter: ConversationConverter;
  const mockConversation: Conversation = {
    id: "1",
    title: "Test Conversation",
    date: new Date("2024-01-01"),
    messages: [
      { role: "user" as const, content: "Hello" },
      { role: "assistant" as const, content: "Hi there!" },
    ],
  };

  beforeEach(() => {
    converter = new ConversationConverter();
  });

  describe("error handling", () => {
    it("throws error for unsupported format in convertSingle", () => {
      expect(() =>
        converter.convertSingle(mockConversation, {
          format: "unsupported" as any,
        } as any),
      ).toThrow("Unsupported output format: unsupported");
    });

    it("throws error for unsupported format in convertMultiple", () => {
      expect(() =>
        converter.convertMultiple([mockConversation], {
          format: "unsupported" as any,
        } as any),
      ).toThrow("Unsupported output format: unsupported");
    });

    it("throws error for unsupported format in getExtension", () => {
      expect(() =>
        converter.getExtension({
          format: "xml" as any,
        } as any),
      ).toThrow("Unsupported output format: xml");
    });

    it("throws error for unsupported format in getDefaultFilename", () => {
      expect(() =>
        converter.getDefaultFilename({
          format: "csv" as any,
        } as any),
      ).toThrow("Unsupported output format: csv");
    });

    it("includes supported formats in error message", () => {
      try {
        converter.convertSingle(mockConversation, {
          format: "invalid" as any,
        } as any);
      } catch (error) {
        expect((error as Error).message).toContain(
          "Supported formats are: json, markdown",
        );
      }
    });
  });

  describe("convertMultiple", () => {
    it("converts multiple conversations to markdown", () => {
      const conversations = [
        mockConversation,
        {
          id: "2",
          title: "Second Conversation",
          date: new Date("2024-01-02"),
          messages: [
            { role: "user" as const, content: "Test" },
            { role: "assistant" as const, content: "Response" },
          ],
        },
      ];

      const result = converter.convertMultiple(conversations, {
        format: "markdown",
      } as any);

      expect(result).toContain("Test Conversation");
      expect(result).toContain("Second Conversation");
      expect(result).toContain("---"); // Separator between conversations
    });

    it("converts multiple conversations to JSON", () => {
      const conversations = [mockConversation];
      const result = converter.convertMultiple(conversations, {
        format: "json",
      } as any);

      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty("conversations");
      expect(parsed.conversations).toBeArray();
      expect(parsed.conversations).toHaveLength(1);
      expect(parsed.conversations[0].title).toBe("Test Conversation");
    });
  });

  describe("getDefaultFilename", () => {
    it("returns markdown filename for markdown format", () => {
      const filename = converter.getDefaultFilename({
        format: "markdown",
      } as any);
      expect(filename).toBe("all-conversations.md");
    });

    it("returns json filename for json format", () => {
      const filename = converter.getDefaultFilename({
        format: "json",
      } as any);
      expect(filename).toBe("all-conversations.json");
    });
  });
});
