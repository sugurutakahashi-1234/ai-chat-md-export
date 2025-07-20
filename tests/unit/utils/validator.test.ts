import { describe, expect, it, test } from "bun:test";
import { z } from "zod";
import {
  assertType,
  createTypeGuard,
  formatValidationReport,
  type ValidationResult,
  validateWithDetails,
} from "../../../src/shared/utils/validator.js";

describe("validator - type guards", () => {
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  describe("createTypeGuard", () => {
    it("returns true for valid data", () => {
      const isTestType = createTypeGuard(testSchema);
      const validData = { name: "John", age: 30 };

      expect(isTestType(validData)).toBe(true);
    });

    it("returns false for invalid data", () => {
      const isTestType = createTypeGuard(testSchema);
      const invalidData = { name: "John", age: "thirty" };

      expect(isTestType(invalidData)).toBe(false);
    });

    it("returns false for null", () => {
      const isTestType = createTypeGuard(testSchema);

      expect(isTestType(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      const isTestType = createTypeGuard(testSchema);

      expect(isTestType(undefined)).toBe(false);
    });

    it("works with complex schemas", () => {
      const complexSchema = z.object({
        users: z.array(
          z.object({
            id: z.string(),
            roles: z.array(z.enum(["admin", "user"])),
          }),
        ),
      });
      const isComplexType = createTypeGuard(complexSchema);

      const validData = {
        users: [
          { id: "1", roles: ["admin", "user"] },
          { id: "2", roles: ["user"] },
        ],
      };

      expect(isComplexType(validData)).toBe(true);
      expect(isComplexType({ users: [] })).toBe(true);
      expect(isComplexType({ users: "not an array" })).toBe(false);
    });
  });

  describe("assertType", () => {
    it("returns validated data for valid input", () => {
      const validData = { name: "John", age: 30 };
      const result = assertType(testSchema, validData);

      expect(result).toEqual(validData);
    });

    it("throws error for invalid input", () => {
      const invalidData = { name: "John", age: "thirty" };

      expect(() => assertType(testSchema, invalidData)).toThrow(
        "Type assertion failed:",
      );
    });

    it("throws error with context when provided", () => {
      const invalidData = { name: "John", age: "thirty" };

      expect(() =>
        assertType(testSchema, invalidData, "user validation"),
      ).toThrow("Type assertion failed in user validation:");
    });

    it("throws error for missing required fields", () => {
      const partialData = { name: "John" };

      expect(() => assertType(testSchema, partialData)).toThrow();
    });

    it("works with union types", () => {
      const unionSchema = z.union([
        z.object({ type: z.literal("a"), value: z.string() }),
        z.object({ type: z.literal("b"), value: z.number() }),
      ]);

      const validA = { type: "a" as const, value: "test" };
      const validB = { type: "b" as const, value: 42 };
      const invalid = { type: "c", value: "test" };

      expect(assertType(unionSchema, validA)).toEqual(validA);
      expect(assertType(unionSchema, validB)).toEqual(validB);
      expect(() => assertType(unionSchema, invalid)).toThrow();
    });

    it("provides detailed error messages", () => {
      const nestedSchema = z.object({
        user: z.object({
          name: z.string().min(3),
          email: z.string().email(),
        }),
      });

      const invalidData = {
        user: {
          name: "Jo",
          email: "not-an-email",
        },
      };

      expect(() => assertType(nestedSchema, invalidData)).toThrow(
        "Type assertion failed:",
      );
    });
  });
});

describe("validator - schema validation", () => {
  const simpleSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  describe("validateWithDetails", () => {
    test("validates correct data successfully", () => {
      const data = { name: "John", age: 30 };
      const result = validateWithDetails(simpleSchema, data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.errors).toBeUndefined();
    });

    test("captures validation errors", () => {
      const data = { name: "John", age: "thirty" };
      const result = validateWithDetails(simpleSchema, data);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(1);
      if (result.errors?.[0]) {
        expect(result.errors[0].path).toBe("age");
        expect(result.errors[0].message).toContain("expected number");
      }
    });

    test("detects unknown fields with passthrough schema", () => {
      const passthroughSchema = z
        .object({
          name: z.string(),
        })
        .passthrough();

      const data = { name: "John", extra: "field", another: "value" };
      const result = validateWithDetails(passthroughSchema, data);

      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      if (result.warnings?.[0]) {
        expect(result.warnings[0].unknownFields).toEqual(["extra", "another"]);
      }
    });

    test("includes custom name in warnings", () => {
      const passthroughSchema = z
        .object({
          name: z.string(),
        })
        .passthrough();

      const data = { name: "John", extra: "field" };
      const result = validateWithDetails(passthroughSchema, data, {
        name: "Test Object",
      });

      if (result.warnings?.[0]) {
        expect(result.warnings[0].message).toContain(
          "Test Object contains unknown fields",
        );
      }
    });

    test("handles nested path errors", () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            age: z.number(),
          }),
        }),
      });

      const data = { user: { profile: { age: "invalid" } } };
      const result = validateWithDetails(nestedSchema, data);

      expect(result.success).toBe(false);
      if (result.errors?.[0]) {
        expect(result.errors[0].path).toBe("user.profile.age");
      }
    });

    test("handles array validation errors", () => {
      const arraySchema = z.object({
        items: z.array(z.number()),
      });

      const data = { items: [1, "two", 3] };
      const result = validateWithDetails(arraySchema, data);

      expect(result.success).toBe(false);
      if (result.errors?.[0]) {
        expect(result.errors[0].path).toBe("items.1");
      }
    });

    test("handles non-ZodError exceptions", () => {
      // Create a mock schema that throws a non-ZodError
      const mockSchema = {
        parse: () => {
          throw new Error("Generic validation error");
        },
      };

      // The validateWithDetails function should re-throw non-ZodErrors
      expect(() =>
        validateWithDetails(mockSchema as unknown as z.ZodType<unknown>, {
          value: 123,
        }),
      ).toThrow("Generic validation error");
    });
  });

  describe("formatValidationReport", () => {
    test("formats successful validation", () => {
      const result: ValidationResult<unknown> = {
        success: true,
        data: { test: "data" },
      };

      const report = formatValidationReport(result);

      expect(report).toContain("✅ Schema validation successful");
    });

    test("formats successful validation with warnings", () => {
      const result: ValidationResult<unknown> = {
        success: true,
        data: { test: "data" },
        warnings: [
          {
            message: "Unknown fields",
            unknownFields: ["field1", "field2"],
          },
        ],
      };

      const report = formatValidationReport(result);

      expect(report).toContain("✅ Schema validation successful");
      expect(report).toContain("📋 Skipped fields during conversion");
      expect(report).toContain("field1, field2");
      expect(report).toContain(
        "* These fields are not included in the converted Markdown",
      );
    });

    test("formats validation errors", () => {
      const result: ValidationResult<unknown> = {
        success: false,
        errors: [
          {
            path: "user.age",
            message: "Expected number, received string",
            expected: "number",
            received: "string",
          },
        ],
      };

      const report = formatValidationReport(result);

      expect(report).toContain("❌ Schema validation failed");
      expect(report).toContain("Errors:");
      expect(report).toContain("Path: user.age");
      expect(report).toContain("Expected number, received string");
      expect(report).toContain("Expected: number");
      expect(report).toContain("Received: string");
    });

    test("formats root path errors", () => {
      const result: ValidationResult<unknown> = {
        success: false,
        errors: [
          {
            path: "",
            message: "Invalid input",
          },
        ],
      };

      const report = formatValidationReport(result);

      expect(report).toContain("Path: root");
    });

    test("formats multiple errors", () => {
      const result: ValidationResult<unknown> = {
        success: false,
        errors: [
          {
            path: "field1",
            message: "Error 1",
          },
          {
            path: "field2",
            message: "Error 2",
          },
        ],
      };

      const report = formatValidationReport(result);

      expect(report).toContain("Path: field1");
      expect(report).toContain("Error 1");
      expect(report).toContain("Path: field2");
      expect(report).toContain("Error 2");
    });

    test("handles errors without expected/received", () => {
      const result: ValidationResult<unknown> = {
        success: false,
        errors: [
          {
            path: "field",
            message: "Custom validation error",
          },
        ],
      };

      const report = formatValidationReport(result);

      expect(report).toContain("Custom validation error");
      expect(report).not.toContain("Expected:");
      expect(report).not.toContain("Received:");
    });
  });
});
