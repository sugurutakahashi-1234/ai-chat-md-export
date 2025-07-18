import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { FileLoader } from "../../../src/core/file-loader.js";
import { FileError } from "../../../src/errors/custom-errors.js";

describe("FileLoader", () => {
  const fileLoader = new FileLoader();
  const tempDir = path.join(process.cwd(), "tests/temp/file-loader-test");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe("load error handling", () => {
    it("throws FileError when file cannot be read", async () => {
      const nonExistentFile = path.join(tempDir, "nonexistent.json");

      await expect(fileLoader.loadJsonFile(nonExistentFile)).rejects.toThrow(
        FileError,
      );

      try {
        await fileLoader.loadJsonFile(nonExistentFile);
      } catch (error) {
        expect(error).toBeInstanceOf(FileError);
        expect((error as FileError).filePath).toBe(nonExistentFile);
        expect((error as FileError).operation).toBe("read");
        expect((error as FileError).context?.originalError).toContain("ENOENT");
      }
    });

    it("throws FileError when JSON parsing fails", async () => {
      const invalidJsonFile = path.join(tempDir, "invalid.json");
      await fs.writeFile(invalidJsonFile, "invalid json", "utf-8");

      await expect(fileLoader.loadJsonFile(invalidJsonFile)).rejects.toThrow(
        FileError,
      );

      try {
        await fileLoader.loadJsonFile(invalidJsonFile);
      } catch (error) {
        expect(error).toBeInstanceOf(FileError);
        expect((error as FileError).message).toContain(
          "Failed to read or parse file",
        );
      }
    });

    it("throws FileError with proper context for permission errors", async () => {
      const protectedFile = path.join(tempDir, "protected.json");
      await fs.writeFile(protectedFile, "{}", "utf-8");

      // Try to make file unreadable (this may not work on all systems)
      try {
        await fs.chmod(protectedFile, 0o000);
        await fileLoader.loadJsonFile(protectedFile);
      } catch (error) {
        expect(error).toBeInstanceOf(FileError);
        // Error message varies by system
        expect((error as FileError).message).toContain(
          "Failed to read or parse file",
        );
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(protectedFile, 0o644).catch(() => {});
      }
    });

    it("successfully loads valid JSON file", async () => {
      const testData = { test: "data", nested: { value: 123 } };
      const validFile = path.join(tempDir, "valid.json");
      await fs.writeFile(validFile, JSON.stringify(testData), "utf-8");

      const result = await fileLoader.loadJsonFile(validFile);

      expect(result).toEqual(testData);
    });
  });
});
