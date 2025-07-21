import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { SchemaValidator } from "./schema-validator.js";

describe("SchemaValidator", () => {
  const validator = new SchemaValidator();

  describe("validateWithDetails", () => {
    test("validates valid data successfully", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const result = validator.validateWithDetails(schema, {
        name: "John",
        age: 30,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: "John", age: 30 });
      expect(result.errors).toBeUndefined();
      expect(result.warnings).toBeUndefined();
    });

    test("reports validation errors with details", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().min(0).max(120),
      });

      const result = validator.validateWithDetails(
        schema,
        {
          name: 123,
          age: -5,
        },
        { name: "Person" },
      );

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toHaveLength(2);
      expect(result.errors?.[0]?.path).toBe("name");
      expect(result.errors?.[0]?.message).toContain(
        "expected string, received number",
      );
      expect(result.errors?.[1]?.path).toBe("age");
      expect(result.errors?.[1]?.message).toContain("Too small");
    });

    test("warns about unknown fields", () => {
      const schema = z.object({
        name: z.string(),
      });

      const result = validator.validateWithDetails(schema, {
        name: "John",
        unknownField: "value",
        anotherUnknown: 123,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: "John" });
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings?.[0]?.message).toContain("unknown fields");
      expect(result.warnings?.[0]?.unknownFields).toEqual([
        "unknownField",
        "anotherUnknown",
      ]);
    });

    test("handles nested object validation", () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      });

      const result = validator.validateWithDetails(schema, {
        user: {
          name: "John",
          email: "invalid-email",
        },
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.path).toBe("user.email");
      expect(result.errors?.[0]?.message).toContain("Invalid email");
    });

    test("handles array validation", () => {
      const schema = z.object({
        items: z.array(z.string()).min(1),
      });

      const result = validator.validateWithDetails(schema, {
        items: [],
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.path).toBe("items");
      expect(result.errors?.[0]?.message).toContain("Too small");
    });

    test("handles non-object input gracefully", () => {
      const schema = z.object({
        name: z.string(),
      });

      const result = validator.validateWithDetails(schema, "not an object");

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.path).toBe("");
      expect(result.errors?.[0]?.message).toContain(
        "expected object, received string",
      );
    });
  });

  describe("formatValidationReport", () => {
    test("formats successful validation report", () => {
      const result = {
        success: true,
        data: { name: "John" },
      };

      const report = validator.formatValidationReport(result);
      expect(report).toContain("successful");
    });

    test("formats error report", () => {
      const result = {
        success: false,
        errors: [
          {
            path: "name",
            message: "Expected string, received number",
            expected: "string",
            received: "number",
          },
        ],
      };

      const report = validator.formatValidationReport(result);
      expect(report).toContain("validation failed");
      expect(report).toContain("name");
      expect(report).toContain("Expected string, received number");
    });

    test("formats warnings", () => {
      const result = {
        success: true,
        data: { name: "John" },
        warnings: [
          {
            message: "Unknown fields detected",
            unknownFields: ["extra1", "extra2"],
          },
        ],
      };

      const report = validator.formatValidationReport(result);
      expect(report).toContain("successful");
      expect(report).toContain("Skipped fields");
      expect(report).toContain("extra1, extra2");
    });

    test("formats complex error paths", () => {
      const result = {
        success: false,
        errors: [
          {
            path: "users[0].profile.email",
            message: "Invalid email",
            expected: undefined,
            received: undefined,
          },
        ],
      };

      const report = validator.formatValidationReport(result);
      expect(report).toContain("users[0].profile.email");
      expect(report).toContain("Invalid email");
    });

    test("handles empty path in errors", () => {
      const result = {
        success: false,
        errors: [
          {
            path: "",
            message: "Invalid input",
            expected: undefined,
            received: undefined,
          },
        ],
      };

      const report = validator.formatValidationReport(result);
      expect(report).toContain("Invalid input");
    });
  });

  describe("edge cases", () => {
    test("handles circular references gracefully", () => {
      const schema = z.object({
        name: z.string(),
      });

      const circular: any = { name: "test" };
      circular.self = circular;

      const result = validator.validateWithDetails(schema, circular);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: "test" });
    });

    test("handles null and undefined inputs", () => {
      const schema = z.object({
        name: z.string(),
      });

      const nullResult = validator.validateWithDetails(schema, null);
      expect(nullResult.success).toBe(false);
      expect(nullResult.errors?.[0]?.message).toContain("Invalid input");

      const undefinedResult = validator.validateWithDetails(schema, undefined);
      expect(undefinedResult.success).toBe(false);
      expect(undefinedResult.errors?.[0]?.message).toContain(
        "expected object, received undefined",
      );
    });

    test("preserves original error messages from complex validations", () => {
      const schema = z
        .string()
        .refine((val) => val.startsWith("test"), "Must start with 'test'");

      const result = validator.validateWithDetails(schema, "hello");

      expect(result.success).toBe(false);
      expect(result.errors?.[0]?.message).toBe("Must start with 'test'");
    });
  });
});
