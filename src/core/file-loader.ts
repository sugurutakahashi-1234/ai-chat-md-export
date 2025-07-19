import { promises as fs } from "node:fs";
import { FileError } from "../errors/custom-errors.js";
import { getErrorMessage } from "../utils/error-formatter.js";

export class FileLoader {
  /**
   * Read and parse JSON file
   */
  async loadJsonFile(filePath: string): Promise<unknown> {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      return JSON.parse(fileContent);
    } catch (error) {
      throw new FileError("Failed to read or parse file", filePath, "read", {
        originalError: getErrorMessage(error),
      });
    }
  }

  /**
   * Check if path is file or directory
   */
  async isFile(path: string): Promise<boolean> {
    try {
      const stat = await fs.stat(path);
      return stat.isFile();
    } catch (error) {
      throw new FileError("Failed to read file or directory", path, "read", {
        originalError: getErrorMessage(error),
      });
    }
  }

  /**
   * List JSON files in directory
   */
  async listJsonFiles(dirPath: string): Promise<string[]> {
    const files = await fs.readdir(dirPath);
    return files.filter((f) => f.endsWith(".json"));
  }
}
