import { describe, expect, test } from "bun:test";
import { z } from "zod";
import {
  formatValidationReport,
  type ValidationResult,
  validateWithDetails,
} from "../../../src/utils/schema-validator.js";

describe("validateWithDetails", () => {
  const simpleSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

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
      expect(result.errors[0].message).toContain("Expected number");
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
