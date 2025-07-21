/**
 * Interface for file loading operations
 *
 * Defines the contract for reading and parsing files from the file system.
 */
export interface IFileLoader {
  /**
   * Read and parse JSON file
   *
   * @param filePath - Path to the JSON file to read
   * @returns Parsed JSON data as unknown type
   * @throws FileError if file cannot be read or parsed
   */
  readJsonFile(filePath: string): Promise<unknown>;
}
