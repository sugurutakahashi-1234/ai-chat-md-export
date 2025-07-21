import type { z as zType } from "zod";

/**
 * Interface for schema validation
 *
 * Provides methods for validating data against schemas
 * with detailed error reporting and unknown field detection
 */
export interface SchemaValidator {
  /**
   * Validate data against a schema with detailed reporting
   *
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @param options - Validation options including name for error messages
   * @returns Detailed validation result with data, errors, and warnings
   */
  validateWithDetails<T>(
    schema: zType.ZodSchema<T>,
    data: unknown,
    options?: { name: string },
  ): ValidationResult<T>;

  /**
   * Format validation result into a human-readable report
   *
   * @param result - Validation result to format
   * @returns Formatted report string
   */
  formatValidationReport(result: ValidationResult<unknown>): string;
}

/**
 * Result of schema validation
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T | undefined;
  errors?: ValidationErrorDetail[] | undefined;
  warnings?: ValidationWarning[] | undefined;
}

/**
 * Detailed validation error information
 */
export interface ValidationErrorDetail {
  path: string;
  message: string;
  expected?: string | undefined;
  received?: string | undefined;
}

/**
 * Validation warning information
 */
export interface ValidationWarning {
  message: string;
  unknownFields?: string[] | undefined;
}
