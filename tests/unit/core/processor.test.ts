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

async function processDirectory(
  dirPath: string,
  outputDir: string,
  options: Options,
): Promise<void> {
  const inputPath = path.resolve(dirPath);
  const resolvedOutputDir = path.resolve(outputDir);
  const dirOptions = {
    ...options,
    input: inputPath,
    output: resolvedOutputDir,
  };
  return testProcessor.processInput(dirOptions);
}

describe("processInput", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/processor-input");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("processes file input", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Hello"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test Conversation",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      platform: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    // processInput calls processFile internally, verify it runs without error
    await expect(testProcessor.processInput(options)).resolves.toBeUndefined();
  });

  test("processes directory input", async () => {
    const dirPath = path.join(tempDir, "input-dir");
    await fs.mkdir(dirPath, { recursive: true });

    const chatgptData = [
      {
        mapping: {},
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(
      path.join(dirPath, "test.json"),
      JSON.stringify(chatgptData),
      "utf-8",
    );

    const options: Options = {
      input: dirPath,
      platform: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await expect(testProcessor.processInput(options)).resolves.toBeUndefined();
  });

  test("throws error for invalid input path", async () => {
    const options: Options = {
      input: "/path/that/does/not/exist",
      platform: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await expect(testProcessor.processInput(options)).rejects.toThrow(
      "Failed to read",
    );
  });
});

describe("processFile", () => {
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

  test("processes ChatGPT file successfully", async () => {
    const filePath = path.join(tempDir, "chatgpt.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Hello ChatGPT"] },
            },
            parent: null,
            children: ["2"],
          },
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "assistant" },
              create_time: 1704067201,
              content: { content_type: "text", parts: ["Hello! How are you?"] },
            },
            parent: "1",
            children: [],
          },
        },
        title: "ChatGPT Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options = createOptions();
    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toMatch(/^2024-01-01_ChatGPT_Test\.md$/);
  });

  test("processes Claude file successfully", async () => {
    const filePath = path.join(tempDir, "claude.json");
    const claudeData = [
      {
        uuid: "test-uuid",
        name: "Claude Test",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [
          {
            sender: "human",
            text: "Hello Claude",
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            sender: "assistant",
            text: "Hello! How can I help?",
            created_at: "2024-01-01T00:00:01Z",
          },
        ],
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(claudeData), "utf-8");

    const options = createOptions();
    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toMatch(/^2024-01-01_Claude_Test\.md$/);
  });

  test("respects dry-run option", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Test"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Dry Run Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options = createOptions({ dryRun: true });
    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(0);
  });

  test("filters by date range", async () => {
    const filePath = path.join(tempDir, "filter.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200, // 2024-01-01
              content: { content_type: "text", parts: ["Filtered"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Filtered Conversation",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options = createOptions({
      since: "2024-01-02", // Filter out the conversation
      until: "2024-12-31",
    });
    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(0);
  });

  test("filters by search keyword", async () => {
    const filePath = path.join(tempDir, "search.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Hello world"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Search Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options = createOptions({
      search: "world", // Should match
    });
    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);

    // Test no match
    const options2 = createOptions({
      search: "notfound",
    });
    await processFile(filePath, outputDir, options2);
    // Since we didn't clear the output dir, it should still have 1 file
    expect(outputFiles).toHaveLength(1);
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

  test("shows progress messages when not quiet", async () => {
    const filePath = path.join(tempDir, "progress.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Progress Test"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Progress Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args: any[]) => logs.push(args.join(" "));

    try {
      const options = createOptions({ quiet: false });
      await processFile(filePath, outputDir, options);

      // Check that progress messages were shown
      expect(logs.some((log) => log.includes("Processing:"))).toBe(true);
      expect(logs.some((log) => log.includes("Successfully loaded"))).toBe(
        true,
      );
    } finally {
      console.log = originalLog;
    }
  });

  test("shows filter stats when filters are applied", async () => {
    const filePath = path.join(tempDir, "filter-stats.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Hello"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Filter Stats Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args: any[]) => logs.push(args.join(" "));

    try {
      const options = createOptions({
        quiet: false,
        since: "2024-01-01",
        search: "Hello",
      });
      await processFile(filePath, outputDir, options);

      // Check that filter stats were shown
      expect(logs.some((log) => log.includes("Filtered:"))).toBe(true);
      expect(logs.some((log) => log.includes("Filters:"))).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });
});

describe("processDirectory", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/processor-dir");
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

  test("processes all JSON files in directory", async () => {
    // Create test files
    const chatgptData = [
      {
        mapping: {},
        title: "ChatGPT File",
        create_time: 1704067200,
      },
    ];
    const claudeData = [
      {
        uuid: "test",
        name: "Claude File",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [],
      },
    ];

    await fs.writeFile(
      path.join(tempDir, "file1.json"),
      JSON.stringify(chatgptData),
      "utf-8",
    );
    await fs.writeFile(
      path.join(tempDir, "file2.json"),
      JSON.stringify(claudeData),
      "utf-8",
    );
    await fs.writeFile(path.join(tempDir, "not-json.txt"), "test", "utf-8");

    const options = createOptions();
    await processDirectory(tempDir, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(2);
  });

  test("handles empty directory gracefully", async () => {
    const emptyDir = path.join(tempDir, "empty");
    await fs.mkdir(emptyDir, { recursive: true });

    const options = createOptions();
    await expect(
      processDirectory(emptyDir, outputDir, options),
    ).resolves.toBeUndefined();
  });

  test("shows no JSON files message when not quiet", async () => {
    const emptyDir = path.join(tempDir, "empty-verbose");
    await fs.mkdir(emptyDir, { recursive: true });

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args: any[]) => logs.push(args.join(" "));

    try {
      const options = createOptions({ quiet: false });
      await processDirectory(emptyDir, outputDir, options);

      expect(logs.some((log) => log.includes("No JSON files found"))).toBe(
        true,
      );
    } finally {
      console.log = originalLog;
    }
  });

  test("shows progress messages when processing multiple files", async () => {
    // Create test files
    const data = [{ mapping: {}, title: "Test", create_time: 1704067200 }];
    for (let i = 1; i <= 3; i++) {
      await fs.writeFile(
        path.join(tempDir, `file${i}.json`),
        JSON.stringify(data),
        "utf-8",
      );
    }

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args: any[]) => logs.push(args.join(" "));

    try {
      const options = createOptions({ quiet: false });
      await processDirectory(tempDir, outputDir, options);

      // Check progress messages
      expect(logs.some((log) => log.includes("Found 3 JSON file(s)"))).toBe(
        true,
      );
      expect(logs.some((log) => log.includes("[1/3]"))).toBe(true);
      expect(logs.some((log) => log.includes("[2/3]"))).toBe(true);
      expect(logs.some((log) => log.includes("[3/3]"))).toBe(true);
      expect(logs.some((log) => log.includes("Completed processing"))).toBe(
        true,
      );
    } finally {
      console.log = originalLog;
    }
  });
});
