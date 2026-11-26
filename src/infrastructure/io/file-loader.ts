import { promises as fs } from "node:fs";
import path from "node:path";
import { FileError, FileOperation } from "../../domain/errors.js";
import type {
  IFileLoader,
  JsonDirEntry,
} from "../../domain/interfaces/file-loader.js";
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

  /**
   * Read and parse every JSON file in a directory (non-recursive).
   * Entries that fail to parse as JSON are skipped (e.g. attachments).
   */
  async readJsonDir(dirPath: string): Promise<JsonDirEntry[]> {
    let entries: string[];
    try {
      this.logger.debug(`Reading directory: ${dirPath}`);
      entries = await fs.readdir(dirPath);
    } catch (error) {
      throw new FileError(
        "Failed to read directory",
        dirPath,
        FileOperation.Read,
        { originalError: extractErrorMessage(error) },
      );
    }

    const results: JsonDirEntry[] = [];
    let skipped = 0;

    for (const entry of entries) {
      const filePath = path.join(dirPath, entry);
      let stat: Awaited<ReturnType<typeof fs.stat>>;
      try {
        stat = await fs.stat(filePath);
      } catch (error) {
        this.logger.debug(
          `Skipping unreadable entry ${entry}: ${extractErrorMessage(error)}`,
        );
        skipped++;
        continue;
      }
      if (!stat.isFile()) {
        skipped++;
        continue;
      }

      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const content = JSON.parse(raw);
        results.push({ filename: entry, mtime: stat.mtime, content });
      } catch (error) {
        this.logger.debug(
          `Skipping non-JSON entry ${entry}: ${extractErrorMessage(error)}`,
        );
        skipped++;
      }
    }

    this.logger.debug(
      `Loaded ${results.length} JSON files from ${dirPath} (${skipped} skipped)`,
    );
    return results;
  }
}
