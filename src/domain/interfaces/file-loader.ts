/**
 * Interface for file loading operations
 *
 * Defines the contract for reading and parsing files from the file system.
 */

/**
 * Entry returned when reading a directory of JSON conversations.
 */
export interface JsonDirEntry {
  filename: string;
  mtime: Date;
  content: unknown;
}

export interface IFileLoader {
  /**
   * Read and parse JSON file
   *
   * @param filePath - Path to the JSON file to read
   * @returns Parsed JSON data as unknown type
   * @throws FileError if file cannot be read or parsed
   */
  readJsonFile(filePath: string): Promise<unknown>;

  /**
   * Read and parse every JSON file in a directory (non-recursive).
   * Non-JSON files (e.g. attachments) are silently skipped.
   *
   * @param dirPath - Path to the directory to read
   * @returns Array of entries for each successfully parsed JSON file
   * @throws FileError if the directory itself cannot be read
   */
  readJsonDir(dirPath: string): Promise<JsonDirEntry[]>;
}
