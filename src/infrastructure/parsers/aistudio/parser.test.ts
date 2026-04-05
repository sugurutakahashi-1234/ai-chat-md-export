import { describe, expect, test } from "bun:test";
import { MessageRole } from "../../../domain/entities.js";
import { Logger } from "../../logging/logger.js";
import { Spinner } from "../../progress/spinner.js";
import { SchemaValidator } from "../../validation/schema-validator.js";
import { AIStudioParser } from "./parser.js";
import type { AIStudioFile } from "./schema.js";

describe("AI Studio Parser", () => {
  const logger = new Logger({ quiet: true });
  const schemaValidator = new SchemaValidator();
  const spinner = new Spinner(logger, { quiet: true });
  const parser = new AIStudioParser(logger, schemaValidator, spinner);

  const createSample = (
    overrides: Partial<AIStudioFile> = {},
  ): AIStudioFile => ({
    filename: "My Conversation",
    mtime: new Date("2025-02-21T15:54:00Z"),
    content: {
      runSettings: { model: "models/gemini-flash-latest" },
      chunkedPrompt: {
        chunks: [
          { role: "user", text: "Hi", tokenCount: 2 },
          { role: "model", text: "Hello!", tokenCount: 3 },
        ],
      },
    },
    ...overrides,
  });

  test("declares directory input kind", () => {
    expect(parser.inputKind).toBe("directory");
  });

  test("parses a conversation", async () => {
    const result = await parser.parseAndValidateConversations(
      [createSample()],
      {
        quiet: true,
      },
    );

    expect(result.successCount).toBe(1);
    expect(result.validationErrors).toEqual([]);
    const conv = result.conversations[0]!;
    expect(conv.id).toBe("My Conversation");
    expect(conv.title).toBe("My Conversation");
    expect(conv.date).toEqual(new Date("2025-02-21T15:54:00Z"));
    expect(conv.messages).toHaveLength(2);
    expect(conv.messages[0]!.role).toBe(MessageRole.User);
    expect(conv.messages[0]!.content).toBe("Hi");
    expect(conv.messages[1]!.role).toBe(MessageRole.Assistant);
    expect(conv.messages[1]!.content).toBe("Hello!");
  });

  test("filters out thought chunks and empty text", async () => {
    const sample = createSample({
      content: {
        chunkedPrompt: {
          chunks: [
            { role: "user", text: "question" },
            { role: "model", text: "let me think", isThought: true },
            { role: "model", text: "" },
            { role: "model", text: "answer" },
          ],
        },
      },
    });

    const result = await parser.parseAndValidateConversations([sample], {
      quiet: true,
    });

    const messages = result.conversations[0]!.messages;
    expect(messages).toHaveLength(2);
    expect(messages[0]!.content).toBe("question");
    expect(messages[1]!.content).toBe("answer");
    expect(messages[1]!.role).toBe(MessageRole.Assistant);
  });

  test("uses mtime as the conversation date", async () => {
    const mtime = new Date("2024-06-15T10:00:00Z");
    const result = await parser.parseAndValidateConversations(
      [createSample({ mtime })],
      { quiet: true },
    );
    expect(result.conversations[0]!.date).toEqual(mtime);
  });

  test("falls back to Untitled for empty filename", async () => {
    const result = await parser.parseAndValidateConversations(
      [createSample({ filename: "" })],
      { quiet: true },
    );
    expect(result.conversations[0]!.title).toBe("Untitled Conversation");
  });

  test("silently skips non-chat files (no chunkedPrompt)", async () => {
    // AI Studio dirs also contain Imagen prompts and metadata files
    // which share the directory but don't have chunkedPrompt.
    const imagenLike = {
      filename: "Some Image Prompt",
      mtime: new Date("2025-01-01"),
      content: { runSettings: { model: "imagen" }, imagenPrompt: {} },
    } as unknown as AIStudioFile;

    const result = await parser.parseAndValidateConversations([imagenLike], {
      quiet: true,
    });
    expect(result.conversations).toHaveLength(0);
    expect(result.validationErrors).toEqual([]);
    expect(result.successCount).toBe(0);
  });

  test("preserves multiple conversations", async () => {
    const result = await parser.parseAndValidateConversations(
      [createSample({ filename: "A" }), createSample({ filename: "B" })],
      { quiet: true },
    );
    expect(result.successCount).toBe(2);
    expect(result.conversations.map((c) => c.id)).toEqual(["A", "B"]);
  });
});
