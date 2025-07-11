import { describe, expect, test } from "bun:test";
import { optionsSchema } from "../../../src/utils/options.js";

describe("optionsSchema", () => {
  test("validates valid options", () => {
    const validOptions = {
      input: "/path/to/file.json",
      output: "/path/to/output",
      format: "chatgpt",
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
      expect(result.data.format).toBe("chatgpt");
    }
  });

  test("requires input field", () => {
    const invalidOptions = {
      format: "auto",
    };

    const result = optionsSchema.safeParse(invalidOptions);
    expect(result.success).toBe(false);
  });

  test("applies default values", () => {
    const minimalOptions = {
      input: "/path/to/file.json",
    };

    const result = optionsSchema.safeParse(minimalOptions);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.format).toBe("auto");
      expect(result.data.quiet).toBe(false);
      expect(result.data.dryRun).toBe(false);
      expect(result.data.filenameEncoding).toBe("standard");
    }
  });
});
