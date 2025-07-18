import { describe, expect, it } from "bun:test";
import {
  BaseError,
  FileError,
  FormatError,
  isBaseError,
  ValidationError,
} from "../../../src/errors/custom-errors.js";

describe("custom-errors", () => {
  describe("BaseError", () => {
    class TestError extends BaseError {}

    it("creates error with message", () => {
      const error = new TestError("Test error");
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("TestError");
      expect(error.context).toBeUndefined();
    });

    it("creates error with context", () => {
      const context = { key: "value", number: 42 };
      const error = new TestError("Test error", context);
      expect(error.context).toEqual(context);
    });

    it("is instanceof Error", () => {
      const error = new TestError("Test error");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BaseError);
    });
  });

  describe("ValidationError", () => {
    it("creates error with validation errors", () => {
      const validationErrors = { field: "Invalid value" };
      const error = new ValidationError(
        "Validation failed",
        { input: "test" },
        validationErrors,
      );

      expect(error.message).toBe("Validation failed");
      expect(error.name).toBe("ValidationError");
      expect(error.context).toEqual({ input: "test" });
      expect(error.validationErrors).toEqual(validationErrors);
    });
  });

  describe("FormatError", () => {
    it("creates error with format", () => {
      const error = new FormatError("Invalid format", "json", {
        file: "test.json",
      });

      expect(error.message).toBe("Invalid format");
      expect(error.name).toBe("FormatError");
      expect(error.format).toBe("json");
      expect(error.context).toEqual({ file: "test.json", format: "json" });
    });
  });

  describe("FileError", () => {
    it("creates error with file details", () => {
      const error = new FileError(
        "File not found",
        "/path/to/file.json",
        "read",
        { errno: -2 },
      );

      expect(error.message).toBe("File not found");
      expect(error.name).toBe("FileError");
      expect(error.filePath).toBe("/path/to/file.json");
      expect(error.operation).toBe("read");
      expect(error.context).toEqual({
        errno: -2,
        filePath: "/path/to/file.json",
        operation: "read",
      });
    });
  });

  describe("type guards", () => {
    it("isBaseError identifies BaseError instances", () => {
      class CustomError extends BaseError {}
      const baseError = new CustomError("test");
      const normalError = new Error("test");

      expect(isBaseError(baseError)).toBe(true);
      expect(isBaseError(normalError)).toBe(false);
      expect(isBaseError("string")).toBe(false);
      expect(isBaseError(null)).toBe(false);
    });
  });
});
