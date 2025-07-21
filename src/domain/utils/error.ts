import { isBaseError } from "../errors.js";

/**
 * Extract error message from unknown error
 *
 * This is a pure utility function that extracts meaningful error messages
 * from various error types without any infrastructure concerns
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    // Try to extract meaningful information from the object
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    // For objects, try to stringify them in a meaningful way
    try {
      const jsonString = JSON.stringify(error, null, 2);
      // If the object has actual content, return it formatted
      if (jsonString !== "{}") {
        return `Unexpected error object: ${jsonString}`;
      }
    } catch {
      // If JSON.stringify fails, fall back to toString
    }
  }

  // Last resort for primitives and other types
  return String(error);
}

/**
 * Format error with context information
 *
 * Handles BaseError instances with their context information
 */
export function formatErrorWithContext(error: unknown): string {
  if (isBaseError(error)) {
    const lines = [error.message];

    if (error.context) {
      Object.entries(error.context).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          lines.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
        }
      });
    }

    return lines.join("\n");
  }

  return extractErrorMessage(error);
}
