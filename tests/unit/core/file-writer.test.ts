import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { FileWriter } from "../../../src/core/io/file-writer.js";
import { JsonConverter } from "../../../src/core/io/formatters/json.js";
import { MarkdownConverter } from "../../../src/core/io/formatters/markdown.js";
import type { Conversation } from "../../../src/types.js";
import { Logger } from "../../../src/utils/logger.js";
import type { Options } from "../../../src/utils/options.js";

describe("FileWriter", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/file-writer");
  const logger = new Logger({ quiet: true });
  const markdownFormatter = new MarkdownConverter();
  const jsonFormatter = new JsonConverter();
  const fileWriter = new FileWriter(logger, markdownFormatter);
  const jsonFileWriter = new FileWriter(logger, jsonFormatter);

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  const createConversation = (title: string): Conversation => ({
    id: "test-id",
    title,
    date: new Date("2024-01-01"),
    messages: [
      {
        role: "user",
        content: "Test message",
        timestamp: new Date("2024-01-01T00:00:00Z"),
      },
    ],
  });

  const createOptions = (overrides?: Partial<Options>): Options => ({
    input: "",
    platform: "chatgpt",
    quiet: true,
    dryRun: false,
    filenameEncoding: "standard",
    format: "markdown",
    split: true,
    ...overrides,
  });

  describe("basic functionality", () => {
    test("writes single conversation to file", async () => {
      const conversations = [createConversation("Test Conversation")];
      const options = createOptions();

      const result = await fileWriter.writeConversations(
        conversations,
        tempDir,
        options,
      );

      expect(result.successCount).toBe(1);
      expect(result.errors).toHaveLength(0);

      const files = await fs.readdir(tempDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toMatch(/^2024-01-01_Test_Conversation\.md$/);
    });

    test("writes combined file when split is false", async () => {
      const conversations = [
        createConversation("First"),
        createConversation("Second"),
      ];
      const options = createOptions({ split: false });

      const result = await fileWriter.writeConversations(
        conversations,
        tempDir,
        options,
      );

      expect(result.successCount).toBe(2);
      expect(result.errors).toHaveLength(0);

      const files = await fs.readdir(tempDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe("all-conversations.md");
    });

    test("respects JSON format option", async () => {
      const conversations = [createConversation("JSON Test")];
      const options = createOptions({ format: "json" });

      await jsonFileWriter.writeConversations(conversations, tempDir, options);

      const files = await fs.readdir(tempDir);
      expect(files[0]).toMatch(/\.json$/);
    });
  });
});
