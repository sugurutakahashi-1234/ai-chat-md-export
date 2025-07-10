import path from "node:path";

/**
 * Get relative path from current working directory
 * Falls back to basename if path is outside cwd
 */
export function getRelativePath(filePath: string): string {
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
    lines.push(`File: ${getRelativePath(details.file)}`);
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
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
