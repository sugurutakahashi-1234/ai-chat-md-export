import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Processor } from "../../../src/core/processor.js";
import type { Options } from "../../../src/utils/options.js";

// Create test-specific processor instance
const testProcessor = new Processor();

// Helper functions for backward compatibility with tests
async function processFile(
  filePath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const inputPath = path.resolve(filePath);
  const resolvedOutputDir = path.resolve(outputDir);
  const fileOptions = {
    ...options,
    input: inputPath,
    output: resolvedOutputDir,
  };
  return testProcessor.processInput(fileOptions);
}

describe("processFile edge cases", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/processor-file");
  const outputDir = path.join(tempDir, "output");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  const createOptions = (overrides?: Partial<Options>): Options => ({
    input: "",
    platform: "auto",
    quiet: true,
    dryRun: false,
    filenameEncoding: "standard",
    format: "markdown",
    split: true,
    ...overrides,
  });

  test("throws error when auto-detect format fails", async () => {
    const filePath = path.join(tempDir, "unknown.json");
    const unknownData = {
      unknown: "format",
    };
    await fs.writeFile(filePath, JSON.stringify(unknownData), "utf-8");

    const options = createOptions({ platform: "auto" });
    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Cannot detect file format",
    );
  });

  test("throws error for unsupported format", async () => {
    const filePath = path.join(tempDir, "test.json");
    const data = [{ title: "Test" }];
    await fs.writeFile(filePath, JSON.stringify(data), "utf-8");

    const options = createOptions({ platform: "unknown" as any });
    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Unsupported format: unknown",
    );
  });

  test("rethrows schema validation errors", async () => {
    const filePath = path.join(tempDir, "invalid.json");
    const invalidData = [
      {
        // Missing required 'mapping' field
        title: "Invalid",
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(invalidData), "utf-8");

    const options = createOptions({ platform: "chatgpt" });
    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Schema validation error",
    );
  });
});
