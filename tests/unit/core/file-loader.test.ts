import { beforeEach, describe, expect, it, mock } from "bun:test";
import { promises as fs } from "node:fs";
import { FileLoader } from "../../../src/core/file-loader.js";
import { FileError } from "../../../src/errors/custom-errors.js";

// Mock fs module
mock.module("node:fs", () => ({
  promises: {
    readFile: mock(() => Promise.resolve("{}")),
  },
}));

describe("FileLoader", () => {
  const fileLoader = new FileLoader();

  beforeEach(() => {
    (fs.readFile as any).mockClear();
  });

  describe("load error handling", () => {
    it("throws FileError when file cannot be read", async () => {
      const readError = new Error("ENOENT: no such file or directory");
      (fs.readFile as any).mockRejectedValueOnce(readError);

      await expect(
        fileLoader.loadJsonFile("/nonexistent/file.json"),
      ).rejects.toThrow(FileError);

      try {
        await fileLoader.loadJsonFile("/nonexistent/file.json");
      } catch (error) {
        expect(error).toBeInstanceOf(FileError);
        expect((error as FileError).filePath).toBe("/nonexistent/file.json");
        expect((error as FileError).operation).toBe("read");
        expect((error as FileError).context?.originalError).toBe(
          "ENOENT: no such file or directory",
        );
      }
    });

    it("throws FileError when JSON parsing fails", async () => {
      (fs.readFile as any).mockResolvedValueOnce("invalid json");

      await expect(
        fileLoader.loadJsonFile("/invalid/file.json"),
      ).rejects.toThrow(FileError);

      try {
        await fileLoader.loadJsonFile("/invalid/file.json");
      } catch (error) {
        expect(error).toBeInstanceOf(FileError);
        expect((error as FileError).message).toContain(
          "Failed to read or parse file",
        );
      }
    });

    it("throws FileError with proper context for permission errors", async () => {
      const permissionError = new Error("EACCES: permission denied");
      (fs.readFile as any).mockRejectedValueOnce(permissionError);

      try {
        await fileLoader.loadJsonFile("/protected/file.json");
      } catch (error) {
        expect(error).toBeInstanceOf(FileError);
        expect((error as FileError).context?.originalError).toBe(
          "EACCES: permission denied",
        );
      }
    });

    it("successfully loads valid JSON file", async () => {
      const testData = { test: "data", nested: { value: 123 } };
      (fs.readFile as any).mockResolvedValueOnce(JSON.stringify(testData));

      const result = await fileLoader.loadJsonFile("/valid/file.json");

      expect(result).toEqual(testData);
      expect(fs.readFile).toHaveBeenCalledWith("/valid/file.json", "utf-8");
    });
  });
});
