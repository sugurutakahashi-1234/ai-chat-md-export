import { FILE_EXTENSIONS, FilenameEncoding, Format } from "../config.js";

/**
 * Convert string to a safe filename (standard version)
 * Replaces dangerous characters with underscores for maximum readability
 */
export function sanitizeFileNameStandard(fileName: string): string {
  // Option 2: Remove only dangerous characters
  // Replaces only characters that cause filesystem issues
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Control characters are intentionally excluded
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/g;

  return fileName
    .replace(dangerousChars, "_") // Replace dangerous characters with underscore
    .replace(/\s+/g, "_") // Replace consecutive spaces with underscore
    .replace(/^\.+/, "") // Remove leading dots
    .replace(/\.+$/, "") // Remove trailing dots
    .trim();
}

/**
 * Convert string to a safe filename preserving character information
 * Encodes dangerous characters while preserving their information
 * Useful when you need to preserve the original character intent
 */
export function sanitizeFileNamePreserve(fileName: string): string {
  // Characters that are problematic on most filesystems
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Control characters are intentionally excluded
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/g;

  // Replace dangerous characters with their URL-encoded equivalents
  let result = fileName;

  // Replace each dangerous character with its encoded form
  result = result.replace(dangerousChars, (char) => {
    return encodeURIComponent(char);
  });

  // Replace spaces with underscores for better readability
  result = result.replace(/\s+/g, "_");

  // Remove leading and trailing dots (problematic on some systems)
  result = result.replace(/^\.+/, "").replace(/\.+$/, "");

  // Trim whitespace
  result = result.trim();

  return result;
}

/**
 * Generate a filename
 * @param date - Date object
 * @param title - Title of the conversation
 * @param encoding - Encoding type: "standard" (default) or "preserve"
 */
export function generateFileName(
  date: Date,
  title: string,
  encoding: FilenameEncoding = FilenameEncoding.Standard,
): string {
  let sanitizedTitle: string;

  switch (encoding) {
    case FilenameEncoding.Standard:
      sanitizedTitle = sanitizeFileNameStandard(title);
      break;
    case FilenameEncoding.Preserve:
      sanitizedTitle = sanitizeFileNamePreserve(title);
      break;
  }

  // Truncate if filename is too long
  // Consider: date(10) + "_"(1) + extension(3) = 14 characters
  const maxTitleLength = 196; // 210 - 14 = 196
  const truncatedTitle =
    sanitizedTitle.length > maxTitleLength
      ? sanitizedTitle.substring(0, maxTitleLength)
      : sanitizedTitle;

  // Extract date part in YYYY-MM-DD format
  const dateString = date.toISOString().split("T")[0];

  return `${dateString}_${truncatedTitle}${FILE_EXTENSIONS[Format.Markdown]}`;
}
