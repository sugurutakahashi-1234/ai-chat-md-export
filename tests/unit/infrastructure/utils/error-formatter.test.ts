import { describe, expect, it } from "bun:test";
import {
  FileError,
  ValidationError,
} from "../../../../src/domain/errors/errors.js";
import {
  extractErrorMessage,
  formatErrorMessage,
  formatErrorWithContext,
  formatRelativePathFromCwd,
} from "../../../../src/infrastructure/utils/error-formatter.js";

describe("formatRelativePathFromCwd", () => {
  it("returns relative path for files in cwd", () => {
    const cwd = process.cwd();
    const filePath = `${cwd}/src/test.ts`;
    expect(formatRelativePathFromCwd(filePath)).toBe("src/test.ts");
  });

  it("returns basename for files outside cwd", () => {
    const filePath = "/some/external/path/file.json";
    expect(formatRelativePathFromCwd(filePath)).toBe("file.json");
  });

  it("handles same directory", () => {
    const cwd = process.cwd();
    const filePath = `${cwd}/file.json`;
    expect(formatRelativePathFromCwd(filePath)).toBe("file.json");
  });
});

describe("extractErrorMessage", () => {
  it("extracts message from Error objects", () => {
    const error = new Error("Test error message");
    expect(extractErrorMessage(error)).toBe("Test error message");
  });

  it("returns string values as-is", () => {
    expect(extractErrorMessage("string error")).toBe("string error");
  });

  it("extracts message property from objects", () => {
    expect(extractErrorMessage({ message: "Object error" })).toBe(
      "Object error",
    );
  });

  it("formats objects with content", () => {
    const result = extractErrorMessage({
      code: "E001",
      details: "Something failed",
    });
    expect(result).toBe(`Unexpected error object: {
  "code": "E001",
  "details": "Something failed"
}`);
  });

  it("converts primitives to string", () => {
    expect(extractErrorMessage(123)).toBe("123");
    expect(extractErrorMessage(true)).toBe("true");
    expect(extractErrorMessage(null)).toBe("null");
    expect(extractErrorMessage(undefined)).toBe("undefined");
  });

  it("handles empty objects", () => {
    expect(extractErrorMessage({})).toBe("[object Object]");
  });

  it("handles circular references gracefully", () => {
    const circular: Record<string, unknown> = { prop: "value" };
    circular.self = circular;
    expect(extractErrorMessage(circular)).toBe("[object Object]");
  });
});

describe("formatErrorMessage", () => {
  it("formats basic message", () => {
    const result = formatErrorMessage("Something went wrong");
    expect(result).toBe("Something went wrong");
  });

  it("includes file path as relative", () => {
    const cwd = process.cwd();
    const result = formatErrorMessage("Error occurred", {
      file: `${cwd}/test/file.json`,
    });
    expect(result).toBe("Error occurred\nFile: test/file.json");
  });

  it("includes format when provided", () => {
    const result = formatErrorMessage("Format error", {
      format: "chatgpt",
    });
    expect(result).toBe("Format error\nFormat: chatgpt");
  });

  it("includes reason when provided", () => {
    const result = formatErrorMessage("Operation failed", {
      reason: "Permission denied",
    });
    expect(result).toBe("Operation failed\nReason: Permission denied");
  });

  it("includes all details when provided", () => {
    const cwd = process.cwd();
    const result = formatErrorMessage("Complete error", {
      file: `${cwd}/data.json`,
      format: "claude",
      reason: "Invalid JSON structure",
    });
    expect(result).toBe(
      "Complete error\nFile: data.json\nFormat: claude\nReason: Invalid JSON structure",
    );
  });

  it("handles external file paths", () => {
    const result = formatErrorMessage("File error", {
      file: "/external/path/to/file.json",
    });
    expect(result).toBe("File error\nFile: file.json");
  });
});

describe("formatErrorWithContext", () => {
  it("formats BaseError with context", () => {
    const error = new FileError(
      "Failed to read file",
      "/path/to/file.json",
      "read",
      { errno: -2, code: "ENOENT" },
    );

    const result = formatErrorWithContext(error);
    expect(result).toContain("Failed to read file");
    expect(result).toContain("FilePath: /path/to/file.json");
    expect(result).toContain("Operation: read");
    expect(result).toContain("Errno: -2");
    expect(result).toContain("Code: ENOENT");
  });

  it("formats ValidationError without context", () => {
    const error = new ValidationError("Invalid data");

    const result = formatErrorWithContext(error);
    expect(result).toBe("Invalid data");
  });

  it("formats regular Error", () => {
    const error = new Error("Regular error");

    const result = formatErrorWithContext(error);
    expect(result).toBe("Regular error");
  });

  it("formats non-Error values", () => {
    expect(formatErrorWithContext("string error")).toBe("string error");
    expect(formatErrorWithContext(123)).toBe("123");
    expect(formatErrorWithContext(null)).toBe("null");
    expect(
      formatErrorWithContext({ code: "TEST" }),
    ).toBe(`Unexpected error object: {
  "code": "TEST"
}`);
  });

  it("ignores null and undefined context values", () => {
    const error = new FileError("File error", "/path", "read", {
      value: null,
      undefinedValue: undefined,
      validValue: "test",
    });

    const result = formatErrorWithContext(error);
    expect(result).toContain("ValidValue: test");
    expect(result).not.toContain("Value: null");
    expect(result).not.toContain("UndefinedValue");
  });
});
