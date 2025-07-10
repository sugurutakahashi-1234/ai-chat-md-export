import { describe, expect, it } from "bun:test";
import {
  formatErrorMessage,
  getErrorMessage,
  getRelativePath,
} from "../../../src/utils/error-formatter.js";

describe("getRelativePath", () => {
  it("returns relative path for files in cwd", () => {
    const cwd = process.cwd();
    const filePath = `${cwd}/src/test.ts`;
    expect(getRelativePath(filePath)).toBe("src/test.ts");
  });

  it("returns basename for files outside cwd", () => {
    const filePath = "/some/external/path/file.json";
    expect(getRelativePath(filePath)).toBe("file.json");
  });

  it("handles same directory", () => {
    const cwd = process.cwd();
    const filePath = `${cwd}/file.json`;
    expect(getRelativePath(filePath)).toBe("file.json");
  });
});

describe("getErrorMessage", () => {
  it("extracts message from Error objects", () => {
    const error = new Error("Test error message");
    expect(getErrorMessage(error)).toBe("Test error message");
  });

  it("converts non-Error values to string", () => {
    expect(getErrorMessage("string error")).toBe("string error");
    expect(getErrorMessage(123)).toBe("123");
    expect(getErrorMessage(null)).toBe("null");
    expect(getErrorMessage(undefined)).toBe("undefined");
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
