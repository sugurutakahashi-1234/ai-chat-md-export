import { promises as fs } from "node:fs";
import { FileError, FileOperation } from "../../domain/errors.js";
import type { IFileLoader } from "../../domain/interfaces/file-loader.js";
import type { ILogger } from "../../domain/interfaces/logger.js";
import { extractErrorMessage } from "../../domain/utils/error.js";

export class FileLoader implements IFileLoader {
  constructor(private readonly logger: ILogger) {}
  /**
   * Read and parse JSON file
   */
  async readJsonFile(filePath: string): Promise<unknown> {
    try {
      this.logger.debug(`Reading file: ${filePath}`);
      const fileContent = await fs.readFile(filePath, "utf-8");
      this.logger.debug(`File size: ${fileContent.length} bytes`);
      return JSON.parse(fileContent);
    } catch (error) {
      throw new FileError(
        "Failed to read or parse file",
        filePath,
        FileOperation.Read,
        {
          originalError: extractErrorMessage(error),
        },
      );
    }
  }
}
