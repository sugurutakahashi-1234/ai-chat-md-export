/**
 * Convert string to a safe filename
 * Unicode-aware implementation for global compatibility
 */
export function sanitizeFileName(fileName: string): string {
  // Option 1: URL encoding approach (safest)
  // Encodes non-ASCII characters for filesystem compatibility

  // Encode the entire string first to properly handle emojis and other complex characters
  const encoded = encodeURIComponent(fileName);

  // Selectively decode safe characters
  return encoded
    .replace(/%20/g, "_") // Replace spaces with underscores
    .replace(/%2D/g, "-") // Keep hyphens
    .replace(/%2E/g, ".") // Keep dots
    .replace(/%5F/g, "_"); // Keep underscores
}

/**
 * Convert string to a safe filename (simple version)
 * Produces more readable filenames but may have compatibility issues on some systems
 */
export function sanitizeFileNameSimple(fileName: string): string {
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
 * Generate a filename
 * @param date - Date string in YYYY-MM-DD format
 * @param title - Title of the conversation
 * @param useUrlSafe - Whether to use URL-safe encoding (default: true)
 */
export function generateFileName(
  date: string,
  title: string,
  useUrlSafe = true,
): string {
  const sanitizedTitle = useUrlSafe
    ? sanitizeFileName(title)
    : sanitizeFileNameSimple(title);

  // Truncate if filename is too long
  // Consider: date(10) + "_"(1) + ".md"(3) = 14 characters
  const maxTitleLength = 196; // 210 - 14 = 196
  const truncatedTitle =
    sanitizedTitle.length > maxTitleLength
      ? sanitizedTitle.substring(0, maxTitleLength)
      : sanitizedTitle;

  return `${date}_${truncatedTitle}.md`;
}
