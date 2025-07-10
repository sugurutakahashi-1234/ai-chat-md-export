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

  test("validates format enum", () => {
    const invalidFormat = {
      input: "/path/to/file.json",
      format: "invalid",
    };

    const result = optionsSchema.safeParse(invalidFormat);
    expect(result.success).toBe(false);
  });

  test("validates date format for since", () => {
    const invalidSince = {
      input: "/path/to/file.json",
      since: "01-01-2024", // Wrong format
    };

    const result = optionsSchema.safeParse(invalidSince);
    expect(result.success).toBe(false);
  });

  test("validates date format for until", () => {
    const invalidUntil = {
      input: "/path/to/file.json",
      until: "2024/12/31", // Wrong format
    };

    const result = optionsSchema.safeParse(invalidUntil);
    expect(result.success).toBe(false);
  });

  test("validates filenameEncoding enum", () => {
    const invalidEncoding = {
      input: "/path/to/file.json",
      filenameEncoding: "utf8",
    };

    const result = optionsSchema.safeParse(invalidEncoding);
    expect(result.success).toBe(false);
  });

  test("accepts valid date formats", () => {
    const validDates = {
      input: "/path/to/file.json",
      since: "2024-01-01",
      until: "2024-12-31",
    };

    const result = optionsSchema.safeParse(validDates);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.since).toBe("2024-01-01");
      expect(result.data.until).toBe("2024-12-31");
    }
  });

  test("accepts all valid format options", () => {
    const formats = ["chatgpt", "claude", "auto"];
    for (const format of formats) {
      const options = {
        input: "/path/to/file.json",
        format,
      };
      const result = optionsSchema.safeParse(options);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.format).toBe(format);
      }
    }
  });

  test("accepts all valid filenameEncoding options", () => {
    const encodings = ["standard", "preserve"];
    for (const encoding of encodings) {
      const options = {
        input: "/path/to/file.json",
        filenameEncoding: encoding,
      };
      const result = optionsSchema.safeParse(options);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filenameEncoding).toBe(encoding);
      }
    }
  });
});
