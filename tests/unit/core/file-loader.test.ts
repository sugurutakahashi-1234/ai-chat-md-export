import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { FileLoader } from "../../../src/core/io/file-loader.js";
import { FileError } from "../../../src/utils/errors/errors.js";

describe("FileLoader", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/file-loader");
  const fileLoader = new FileLoader();

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe("basic functionality", () => {
    test("loads valid JSON file", async () => {
      const filePath = path.join(tempDir, "valid.json");
      const testData = { test: "data", number: 123 };
      await fs.writeFile(filePath, JSON.stringify(testData), "utf-8");

      const result = await fileLoader.loadJsonFile(filePath);
      expect(result).toEqual(testData);
    });

    test("throws FileError when file doesn't exist", async () => {
      const filePath = path.join(tempDir, "nonexistent.json");

      await expect(fileLoader.loadJsonFile(filePath)).rejects.toThrow(
        FileError,
      );
    });

    test("throws FileError when JSON is invalid", async () => {
      const filePath = path.join(tempDir, "invalid.json");
      await fs.writeFile(filePath, "{ invalid json", "utf-8");

      await expect(fileLoader.loadJsonFile(filePath)).rejects.toThrow(
        FileError,
      );
    });
  });
});
