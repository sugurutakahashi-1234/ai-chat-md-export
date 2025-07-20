import { promises as fs } from "node:fs";
import { FileError } from "../../domain/errors/errors.js";
import { extractErrorMessage } from "../../shared/errors/formatter.js";

export class FileLoader {
  /**
   * Read and parse JSON file
   */
  async readJsonFile(filePath: string): Promise<unknown> {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      return JSON.parse(fileContent);
    } catch (error) {
      throw new FileError("Failed to read or parse file", filePath, "read", {
        originalError: extractErrorMessage(error),
      });
    }
  }
}
