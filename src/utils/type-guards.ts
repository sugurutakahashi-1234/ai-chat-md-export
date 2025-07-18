import type { z } from "zod";

/**
 * Creates a type guard function from a Zod schema
 * @param schema - Zod schema to create type guard from
 * @returns Type guard function
 */
export function createTypeGuard<T>(
  schema: z.ZodSchema<T>,
): (value: unknown) => value is T {
  return (value: unknown): value is T => {
    const result = schema.safeParse(value);
    return result.success;
  };
}

/**
 * Safely parses a value with a Zod schema and returns the parsed value or undefined
 * @param schema - Zod schema to parse with
 * @param value - Value to parse
 * @returns Parsed value or undefined if parsing fails
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
): T | undefined {
  const result = schema.safeParse(value);
  return result.success ? result.data : undefined;
}

/**
 * Asserts that a value matches a Zod schema, throwing a detailed error if not
 * @param schema - Zod schema to validate against
 * @param value - Value to validate
 * @param context - Optional context for error message
 * @returns The validated value
 */
export function assertType<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  context?: string,
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const errorMessage = context
      ? `Type assertion failed in ${context}: ${result.error.message}`
      : `Type assertion failed: ${result.error.message}`;
    throw new Error(errorMessage);
  }
  return result.data;
}
