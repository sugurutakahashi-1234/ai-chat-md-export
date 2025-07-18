import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";
import {
  processDirectory,
  processFile,
  processInput,
} from "../../../src/core/processor.js";
import type { Options } from "../../../src/utils/options.js";

describe("processInput", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/processor-input");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await $`rm -rf ${tempDir}`.quiet();
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
    await expect(processInput(options)).resolves.toBeUndefined();
  });

  test("processes directory input", async () => {
    const dirPath = path.join(tempDir, "testdir");
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, "test.json");
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
      input: dirPath,
      platform: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await expect(processInput(options)).resolves.toBeUndefined();
  });

  test("throws error for invalid input path", async () => {
    const invalidPath = path.join(tempDir, "nonexistent");

    const options: Options = {
      input: invalidPath,
      platform: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await expect(processInput(options)).rejects.toThrow();
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
    await $`rm -rf ${tempDir}`.quiet();
  });

  test("processes ChatGPT file successfully", async () => {
    const filePath = path.join(tempDir, "chatgpt.json");
    const chatgptData = [
      {
        mapping: {
          "msg-1": {
            id: "msg-1",
            message: {
              id: "msg-1",
              author: { role: "assistant" },
              create_time: 1704067200,
              content: {
                content_type: "text",
                parts: ["Hello, how can I help you?"],
              },
            },
            parent: null,
            children: ["msg-2"],
          },
          "msg-2": {
            id: "msg-2",
            message: {
              id: "msg-2",
              author: { role: "user" },
              create_time: 1704067201,
              content: {
                content_type: "text",
                parts: ["I need help with Python"],
              },
            },
            parent: "msg-1",
            children: [],
          },
        },
        title: "Python Help",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "chatgpt",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await processFile(filePath, outputDir, options);

    // Verify the file was created
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles.length).toBeGreaterThan(0);
    expect(outputFiles[0]).toMatch(/\.md$/);
  });

  test("processes Claude file successfully", async () => {
    const filePath = path.join(tempDir, "claude.json");
    const claudeData = [
      {
        chat_messages: [
          {
            uuid: "msg-1",
            sender: "human",
            text: "Hello Claude",
            created_at: "2024-01-01T00:00:00.000Z",
          },
          {
            uuid: "msg-2",
            sender: "assistant",
            text: "Hello! How can I help you today?",
            created_at: "2024-01-01T00:00:01.000Z",
          },
        ],
        uuid: "conv-1",
        name: "Claude Test",
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(claudeData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "claude",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles.length).toBeGreaterThan(0);
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
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await processFile(filePath, outputDir, options);

    // Verify no file was created
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(0);
  });

  test("filters by date range", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1701388800, // 2023-12-01
              content: { content_type: "text", parts: ["Old"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Old Conversation",
        create_time: 1701388800,
      },
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1705795200, // 2024-01-21
              content: { content_type: "text", parts: ["In Range"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "In Range Conversation",
        create_time: 1705795200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
      since: "2024-01-01",
      until: "2024-01-31",
    };

    await processFile(filePath, outputDir, options);

    // Verify only conversations within date range are processed
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
  });

  test("filters by search keyword", async () => {
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
              content: { content_type: "text", parts: ["Teach me Python"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Python Tutorial",
        create_time: 1704067200,
      },
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1704067201,
              content: { content_type: "text", parts: ["JavaScript basics"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "JavaScript Guide",
        create_time: 1704067201,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
      search: "python",
    };

    await processFile(filePath, outputDir, options);

    // Verify only conversations containing "python" are processed
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
  });

  test("throws error when auto-detect format fails", async () => {
    const filePath = path.join(tempDir, "invalid.json");
    await fs.writeFile(
      filePath,
      JSON.stringify([{ invalid: "data" }]),
      "utf-8",
    );

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Cannot detect file format",
    );
  });

  test("throws error for unsupported format", async () => {
    const filePath = path.join(tempDir, "test.json");
    await fs.writeFile(filePath, JSON.stringify([]), "utf-8");

    const options = {
      input: filePath,
      output: outputDir,
      platform: "unsupported" as "chatgpt" | "claude" | "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard" as const,
    } as unknown as Options;

    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Unsupported format",
    );
  });

  test("rethrows schema validation errors", async () => {
    const filePath = path.join(tempDir, "invalid-schema.json");
    // Create data that will fail schema validation
    const invalidData = [
      {
        // Missing required fields for ChatGPT format
        mapping: {
          "1": {
            id: "1",
            // Missing message field
          },
        },
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(invalidData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "chatgpt",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("shows progress messages when not quiet", async () => {
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
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args) => logs.push(args.join(" "));

    try {
      await processFile(filePath, outputDir, options);
      expect(logs.some((log) => log.includes("Processing:"))).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });
  test("shows filter stats when filters are applied", async () => {
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
              content: { content_type: "text", parts: ["Python"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Python",
        create_time: 1704067200,
      },
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1704067201,
              content: { content_type: "text", parts: ["JavaScript"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "JavaScript",
        create_time: 1704067201,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      platform: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
      search: "python",
      since: "2024-01-01",
      until: "2024-12-31",
    };

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args) => logs.push(args.join(" "));

    try {
      await processFile(filePath, outputDir, options);
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
    await $`rm -rf ${tempDir}`.quiet();
  });

  test("processes all JSON files in directory", async () => {
    // Create multiple JSON files
    const file1 = path.join(tempDir, "file1.json");
    const file2 = path.join(tempDir, "file2.json");
    const nonJsonFile = path.join(tempDir, "readme.txt");

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
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(file1, JSON.stringify(chatgptData), "utf-8");

    // Create different data for file2
    const chatgptData2 = [
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1704153600, // 異なる時刻
              content: { content_type: "text", parts: ["Test 2"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 2",
        create_time: 1704153600,
      },
    ];
    await fs.writeFile(file2, JSON.stringify(chatgptData2), "utf-8");
    await fs.writeFile(nonJsonFile, "This is not JSON", "utf-8");

    const options: Options = {
      input: tempDir,
      output: outputDir,
      platform: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    await processDirectory(tempDir, outputDir, options);

    // Verify two JSON files were processed
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles.length).toBe(2);
  });

  test("handles empty directory gracefully", async () => {
    const emptyDir = path.join(tempDir, "empty");
    await fs.mkdir(emptyDir, { recursive: true });

    const options: Options = {
      input: emptyDir,
      output: outputDir,
      platform: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    // Verify it runs without error
    await expect(
      processDirectory(emptyDir, outputDir, options),
    ).resolves.toBeUndefined();
  });

  test("shows no JSON files message when not quiet", async () => {
    const emptyDir = path.join(tempDir, "empty2");
    await fs.mkdir(emptyDir, { recursive: true });

    const options: Options = {
      input: emptyDir,
      output: outputDir,
      platform: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args) => logs.push(args.join(" "));

    try {
      await processDirectory(emptyDir, outputDir, options);
      expect(logs.some((log) => log.includes("No JSON files found"))).toBe(
        true,
      );
    } finally {
      console.log = originalLog;
    }
  });

  test("shows progress messages when processing multiple files", async () => {
    const file1 = path.join(tempDir, "file1.json");
    const file2 = path.join(tempDir, "file2.json");

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
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(file1, JSON.stringify(chatgptData), "utf-8");
    await fs.writeFile(file2, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: tempDir,
      output: outputDir,
      platform: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    };

    // Capture console output
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args) => logs.push(args.join(" "));

    try {
      await processDirectory(tempDir, outputDir, options);
      expect(logs.some((log) => log.includes("Found 2 JSON file(s)"))).toBe(
        true,
      );
      expect(logs.some((log) => log.includes("[1/2]"))).toBe(true);
      expect(logs.some((log) => log.includes("[2/2]"))).toBe(true);
      expect(logs.some((log) => log.includes("Completed processing"))).toBe(
        true,
      );
    } finally {
      console.log = originalLog;
    }
  });
});
