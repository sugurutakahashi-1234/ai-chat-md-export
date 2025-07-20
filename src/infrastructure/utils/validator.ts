import type { z as zType } from "zod";
import { ZodError, z } from "zod";
import { ValidationError } from "../../domain/errors/errors.js";

// Type guard functions
/**
 * Creates a type guard function from a Zod schema
 * @param schema - Zod schema to create type guard from
 * @returns Type guard function
 */
export function createTypeGuard<T>(
  schema: zType.ZodSchema<T>,
): (value: unknown) => value is T {
  return (value: unknown): value is T => {
    const result = schema.safeParse(value);
    return result.success;
  };
}

/**
 * Asserts that a value matches a Zod schema, throwing a detailed error if not
 * @param schema - Zod schema to validate against
 * @param value - Value to validate
 * @param context - Optional context for error message
 * @returns The validated value
 */
export function assertType<T>(
  schema: zType.ZodSchema<T>,
  value: unknown,
  context?: string,
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const errorMessage = context
      ? `Type assertion failed in ${context}: ${result.error.message}`
      : `Type assertion failed: ${result.error.message}`;
    throw new ValidationError(errorMessage, { context }, result.error);
  }
  return result.data;
}

// Schema validation types and functions
export interface ValidationResult<T> {
  success: boolean;
  data?: T | undefined;
  errors?: ValidationErrorDetail[] | undefined;
  warnings?: ValidationWarning[] | undefined;
}

interface ValidationErrorDetail {
  path: string;
  message: string;
  expected?: string | undefined;
  received?: string | undefined;
}

interface ValidationWarning {
  message: string;
  unknownFields?: string[] | undefined;
}

export function validateWithDetails<T>(
  schema: zType.ZodSchema<T>,
  data: unknown,
  options: { name: string } = { name: "Data" },
): ValidationResult<T> {
  try {
    const result = schema.parse(data);

    // Detect unknown fields when using passthrough
    const warnings: ValidationWarning[] = [];
    if (typeof data === "object" && data !== null) {
      const unknownFields = detectUnknownFields(schema, data);
      if (unknownFields.length > 0) {
        warnings.push({
          message: `${options.name} contains unknown fields`,
          unknownFields,
        });
      }
    }

    return {
      success: true,
      data: result,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationErrorDetail[] = error.issues.map((e) => {
        const baseError: ValidationErrorDetail = {
          path: e.path.join("."),
          message: e.message,
        };

        // expected and received may not exist depending on ZodIssue type
        if ("expected" in e && e.expected !== undefined) {
          baseError.expected = String(e.expected);
        }
        if ("received" in e && e.received !== undefined) {
          baseError.received = String(e.received);
        }

        return baseError;
      });

      return {
        success: false,
        errors,
      };
    }

    throw error;
  }
}

function detectUnknownFields(schema: zType.ZodSchema, data: unknown): string[] {
  // This implementation is simplified. A more complex implementation is needed in practice
  const unknownFields: string[] = [];

  // Check only if schema is an object
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const knownKeys = Object.keys(shape);

    if (typeof data === "object" && data !== null) {
      for (const key of Object.keys(data as Record<string, unknown>)) {
        if (!knownKeys.includes(key)) {
          unknownFields.push(key);
        }
      }
    }
  }

  return unknownFields;
}

export function formatValidationReport(
  result: ValidationResult<unknown>,
): string {
  const lines: string[] = [];

  if (result.success) {
    lines.push("✅ Schema validation successful");

    if (result.warnings && result.warnings.length > 0) {
      lines.push("\n📋 Skipped fields during conversion:");
      for (const warning of result.warnings) {
        if (warning.unknownFields) {
          lines.push(`  - ${warning.unknownFields.join(", ")}`);
          lines.push(
            `    * These fields are not included in the converted Markdown`,
          );
        }
      }
    }
  } else {
    lines.push("❌ Schema validation failed");

    if (result.errors && result.errors.length > 0) {
      lines.push("\nErrors:");
      for (const error of result.errors) {
        lines.push(`  - Path: ${error.path || "root"}`);
        lines.push(`    ${error.message}`);
        if (error.expected) {
          lines.push(`    Expected: ${error.expected}`);
        }
        if (error.received) {
          lines.push(`    Received: ${error.received}`);
        }
      }
    }
  }

  return lines.join("\n");
}
