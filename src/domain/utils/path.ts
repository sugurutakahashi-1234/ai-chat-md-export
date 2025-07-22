import path from "node:path";

/**
 * Get relative path from current working directory
 * Falls back to basename if path is outside cwd
 *
 * This is a pure utility function that belongs in the domain layer
 * as it performs simple path manipulation without any infrastructure concerns
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
