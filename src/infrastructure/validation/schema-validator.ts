import type { z as zType } from "zod";
import { ZodError, z } from "zod";
import type {
  SchemaValidator as ISchemaValidator,
  ValidationErrorDetail,
  ValidationResult,
  ValidationWarning,
} from "../../domain/interfaces/schema-validator.js";

/**
 * Schema validator for handling complex validation logic
 *
 * Provides detailed validation with error reporting
 * and unknown field detection capabilities
 */
export class SchemaValidator implements ISchemaValidator {
  /**
   * Validate data against a schema with detailed reporting
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @param options - Validation options including name for error messages
   * @returns Detailed validation result with data, errors, and warnings
   */
  validateWithDetails<T>(
    schema: zType.ZodSchema<T>,
    data: unknown,
    options: { name: string } = { name: "Data" },
  ): ValidationResult<T> {
    try {
      const result = schema.parse(data);

      // Detect unknown fields when using passthrough
      const warnings: ValidationWarning[] = [];
      if (typeof data === "object" && data !== null) {
        const unknownFields = this.detectUnknownFields(schema, data);
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

  /**
   * Format validation result into a human-readable report
   * @param result - Validation result to format
   * @returns Formatted report string
   */
  formatValidationReport(result: ValidationResult<unknown>): string {
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

  /**
   * Detect unknown fields in data compared to schema
   * @param schema - Zod schema to check against
   * @param data - Data to check for unknown fields
   * @returns Array of unknown field names
   */
  private detectUnknownFields(
    schema: zType.ZodSchema,
    data: unknown,
  ): string[] {
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
}
