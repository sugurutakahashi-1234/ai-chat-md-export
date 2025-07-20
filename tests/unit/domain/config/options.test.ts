import { describe, expect, test } from "bun:test";
import { optionsSchema } from "../../../../src/domain/config/options.js";

describe("optionsSchema", () => {
  test("validates valid options", () => {
    const validOptions = {
      input: "/path/to/file.json",
      output: "/path/to/output",
      platform: "chatgpt",
      since: "2024-01-01",
      until: "2024-12-31",
      quiet: true,
      dryRun: true,
      search: "keyword",
      filenameEncoding: "preserve",
    };

    const result = optionsSchema.safeParse(validOptions);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.input).toBe("/path/to/file.json");
      expect(result.data.platform).toBe("chatgpt");
    }
  });

  test("requires input field", () => {
    const invalidOptions = {
      format: "auto",
    };

    const result = optionsSchema.safeParse(invalidOptions);
    expect(result.success).toBe(false);
  });

  test("requires platform field", () => {
    const minimalOptions = {
      input: "/path/to/file.json",
    };

    const result = optionsSchema.safeParse(minimalOptions);
    expect(result.success).toBe(false);
  });

  test("applies default values for optional fields", () => {
    const minimalOptions = {
      input: "/path/to/file.json",
      platform: "chatgpt",
    };

    const result = optionsSchema.safeParse(minimalOptions);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.platform).toBe("chatgpt");
      expect(result.data.quiet).toBe(false);
      expect(result.data.dryRun).toBe(false);
      expect(result.data.filenameEncoding).toBe("standard");
      expect(result.data.format).toBe("markdown");
      expect(result.data.split).toBe(true);
    }
  });

  test("validates format options", () => {
    const markdownOptions = {
      input: "/path/to/file.json",
      platform: "chatgpt",
      format: "markdown",
    };

    const jsonOptions = {
      input: "/path/to/file.json",
      platform: "claude",
      format: "json",
    };

    const markdownResult = optionsSchema.safeParse(markdownOptions);
    const jsonResult = optionsSchema.safeParse(jsonOptions);

    expect(markdownResult.success).toBe(true);
    expect(jsonResult.success).toBe(true);
    if (markdownResult.success) {
      expect(markdownResult.data.format).toBe("markdown");
    }
    if (jsonResult.success) {
      expect(jsonResult.data.format).toBe("json");
    }
  });

  test("validates split option", () => {
    const splitTrue = {
      input: "/path/to/file.json",
      platform: "chatgpt",
      split: true,
    };

    const splitFalse = {
      input: "/path/to/file.json",
      platform: "claude",
      split: false,
    };

    const splitTrueResult = optionsSchema.safeParse(splitTrue);
    const splitFalseResult = optionsSchema.safeParse(splitFalse);

    expect(splitTrueResult.success).toBe(true);
    expect(splitFalseResult.success).toBe(true);
    if (splitTrueResult.success) {
      expect(splitTrueResult.data.split).toBe(true);
    }
    if (splitFalseResult.success) {
      expect(splitFalseResult.data.split).toBe(false);
    }
  });
});
