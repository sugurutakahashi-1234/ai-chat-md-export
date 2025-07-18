import { describe, expect, test } from "bun:test";
import { detectFormat } from "../../../src/utils/format-detector.js";

describe("detectFormat", () => {
  test("detects ChatGPT format", () => {
    const chatgptData = [{ mapping: {}, title: "Test" }];
    const format = detectFormat(chatgptData);
    expect(format).toBe("chatgpt");
  });

  test("detects Claude format", () => {
    const claudeData = [{ chat_messages: [], uuid: "test-uuid" }];
    const format = detectFormat(claudeData);
    expect(format).toBe("claude");
  });

  test("throws error for unknown format", () => {
    const unknownData = [{ someField: "value" }];
    expect(() => detectFormat(unknownData)).toThrow(
      "Cannot detect file format",
    );
  });

  test("throws error for invalid JSON", () => {
    const invalidData = "not an array";
    expect(() => detectFormat(invalidData)).toThrow(
      "Cannot detect file format",
    );
  });
});
