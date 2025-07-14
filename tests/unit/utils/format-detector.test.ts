import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { detectFormat } from "../../../src/utils/format-detector.js";

describe("detectFormat", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/format-detector");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("detects ChatGPT format", async () => {
    const filePath = path.join(tempDir, "chatgpt.json");
    const chatgptData = [{ mapping: {}, title: "Test" }];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const format = await detectFormat(filePath);
    expect(format).toBe("chatgpt");
  });

  test("detects Claude format", async () => {
    const filePath = path.join(tempDir, "claude.json");
    const claudeData = [{ chat_messages: [], uuid: "test-uuid" }];
    await fs.writeFile(filePath, JSON.stringify(claudeData), "utf-8");

    const format = await detectFormat(filePath);
    expect(format).toBe("claude");
  });

  test("throws error for unknown format", async () => {
    const filePath = path.join(tempDir, "unknown.json");
    const unknownData = [{ someField: "value" }];
    await fs.writeFile(filePath, JSON.stringify(unknownData), "utf-8");

    await expect(detectFormat(filePath)).rejects.toThrow(
      "Cannot detect file format",
    );
  });

  test("throws error for invalid JSON", async () => {
    const filePath = path.join(tempDir, "invalid.json");
    await fs.writeFile(filePath, "{ invalid json", "utf-8");

    await expect(detectFormat(filePath)).rejects.toThrow(
      "Cannot detect file format",
    );
  });
});
