import path from "node:path";
import { isBaseError } from "../../domain/errors.js";

/**
 * Get relative path from current working directory
 * Falls back to basename if path is outside cwd
 */
export function formatRelativePathFromCwd(filePath: string): string {
  const cwd = process.cwd();
  const relative = path.relative(cwd, filePath);

  // If the path goes outside cwd (starts with ..), just use filename
  if (relative.startsWith("..")) {
    return path.basename(filePath);
  }

  return relative;
}

/**
 * Format error message with consistent structure
 */
export function formatErrorMessage(
  message: string,
  details?: { file?: string; format?: string; reason?: string },
): string {
  const lines = [message];

  if (details?.file) {
    lines.push(`File: ${formatRelativePathFromCwd(details.file)}`);
  }

  if (details?.format) {
    lines.push(`Format: ${details.format}`);
  }

  if (details?.reason) {
    lines.push(`Reason: ${details.reason}`);
  }

  return lines.join("\n");
}

/**
 * Extract error message from unknown error
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
