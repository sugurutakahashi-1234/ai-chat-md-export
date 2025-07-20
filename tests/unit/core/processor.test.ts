import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Processor } from "../../../src/core/processing/processor.js";
import { createDefaultDependenciesWithOverrides } from "../../../src/core/processor-factories.js";
import type { Options } from "../../../src/utils/options.js";

// Create test-specific processor instance with dependency injection
const testProcessor = new Processor(createDefaultDependenciesWithOverrides());

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
    platform: "chatgpt",
    quiet: true,
    dryRun: false,
    filenameEncoding: "standard",
    format: "markdown",
    split: true,
    ...overrides,
  });

  test("validates platform option", async () => {
    const filePath = path.join(tempDir, "test.json");
    const data = [{ title: "Test" }];
    await fs.writeFile(filePath, JSON.stringify(data), "utf-8");

    const options = createOptions({ platform: "unknown" as any });
    await expect(processFile(filePath, outputDir, options)).rejects.toThrow();
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

describe("Processor with dependency injection", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/processor-di");
  const outputDir = path.join(tempDir, "output");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("uses injected fileLoader", async () => {
    let loadJsonFileCalled = false;
    const mockFileLoader = {
      loadJsonFile: async () => {
        loadJsonFileCalled = true;
        return [];
      },
    };

    const processor = new Processor(
      createDefaultDependenciesWithOverrides({
        fileLoader: mockFileLoader as any,
      }),
    );

    const options: Options = {
      input: path.join(tempDir, "test.json"),
      output: outputDir,
      platform: "chatgpt",
      format: "markdown",
      split: true,
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
    };

    await processor.processInput(options);
    expect(loadJsonFileCalled).toBe(true);
  });

  test("uses injected parserFactory", async () => {
    const filePath = path.join(tempDir, "test.json");
    await fs.writeFile(filePath, "[]", "utf-8");

    let parserFactoryCalled = false;
    let platformReceived = "";

    const mockParser = {
      schema: {} as any,
      load: async () => [],
    };

    const mockParserFactory = (platform: string) => {
      parserFactoryCalled = true;
      platformReceived = platform;
      return mockParser;
    };

    const processor = new Processor(
      createDefaultDependenciesWithOverrides({
        parserFactory: mockParserFactory,
      }),
    );

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "claude",
      format: "markdown",
      split: true,
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
    };

    await processor.processInput(options);
    expect(parserFactoryCalled).toBe(true);
    expect(platformReceived).toBe("claude");
  });

  test("uses injected loggerFactory", async () => {
    const filePath = path.join(tempDir, "test.json");
    await fs.writeFile(filePath, "[]", "utf-8");

    let loggerFactoryCalled = false;
    let quietOptionReceived: boolean | undefined;

    const mockLogger = {
      info: () => {},
      stat: () => {},
      error: () => {},
      warn: () => {},
      success: () => {},
      section: () => {},
      progress: () => {},
      output: () => {},
    };

    const mockLoggerFactory = (options: { quiet?: boolean }) => {
      loggerFactoryCalled = true;
      quietOptionReceived = options.quiet;
      return mockLogger;
    };

    const processor = new Processor(
      createDefaultDependenciesWithOverrides({
        loggerFactory: mockLoggerFactory as any,
      }),
    );

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "chatgpt",
      format: "markdown",
      split: true,
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
    };

    await processor.processInput(options);
    expect(loggerFactoryCalled).toBe(true);
    expect(quietOptionReceived).toBe(true);
  });
});
