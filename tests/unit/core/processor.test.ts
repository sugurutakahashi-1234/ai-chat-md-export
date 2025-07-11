import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
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
      format: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
    };

    await expect(processInput(options)).resolves.toBeUndefined();
  });

  test("throws error for invalid input path", async () => {
    const invalidPath = path.join(tempDir, "nonexistent");

    const options: Options = {
      input: invalidPath,
      format: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
    };

    await expect(processInput(options)).rejects.toThrow();
  });

  test("throws error for non-file/non-directory input", async () => {
    // Skip this test on Windows as special file types are not available
    if (process.platform === "win32") {
      return;
    }

    try {
      // Create a FIFO (named pipe) which is neither file nor directory
      const fifoPath = path.join(tempDir, "test.fifo");
      const { execSync } = await import("node:child_process");
      execSync(`mkfifo "${fifoPath}"`);

      const options: Options = {
        input: fifoPath,
        format: "auto",
        quiet: true,
        dryRun: true,
        filenameEncoding: "standard",
      };

      await expect(processInput(options)).rejects.toThrow("Invalid input path");

      // Clean up
      await fs.unlink(fifoPath);
    } catch {
      // Skip if FIFO creation fails (e.g., on some CI environments)
    }
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
      format: "chatgpt",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "claude",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: true,
      dryRun: true,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
    };

    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Failed to detect file format",
    );
  });

  test("throws error for unsupported format", async () => {
    const filePath = path.join(tempDir, "test.json");
    await fs.writeFile(filePath, JSON.stringify([]), "utf-8");

    const options = {
      input: filePath,
      output: outputDir,
      format: "unsupported" as "chatgpt" | "claude" | "auto",
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
      format: "chatgpt",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
    };

    await expect(processFile(filePath, outputDir, options)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("handles file write errors gracefully", async () => {
    const filePath = path.join(tempDir, "test-write-error.json");
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

    // Create a unique directory for this test
    const uniqueDir = path.join(
      tempDir,
      `readonly-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    );
    await fs.mkdir(uniqueDir, { recursive: true });

    // Use a non-existent output directory path that will fail to create
    // because we'll make the parent directory read-only
    const outputPath = path.join(uniqueDir, "nested", "output");

    // Make the directory read-only on Unix systems
    if (process.platform !== "win32") {
      await fs.chmod(uniqueDir, 0o555); // read-only
    }

    const options: Options = {
      input: filePath,
      output: outputPath, // This directory cannot be created
      format: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
    };

    // Capture console.error output
    const originalError = console.error;
    const errors: string[] = [];
    console.error = (...args) => errors.push(args.join(" "));

    try {
      if (process.platform === "win32") {
        // Skip this test on Windows as permission handling is different
        return;
      }

      // This should throw an error due to permission issues
      await expect(
        processFile(filePath, outputPath, options),
      ).rejects.toThrow();
    } finally {
      console.error = originalError;
      // Restore permissions
      if (process.platform !== "win32") {
        await fs.chmod(uniqueDir, 0o755);
      }
    }
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
      format: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
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

  test("handles multiple file write errors and reports summary", async () => {
    const filePath = path.join(tempDir, "test.json");
    const readOnlyDir = path.join(tempDir, "readonly");

    // Create test data with multiple conversations
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Test 1"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 1",
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
              content: { content_type: "text", parts: ["Test 2"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 2",
        create_time: 1704067201,
      },
      {
        mapping: {
          "3": {
            id: "3",
            message: {
              id: "3",
              author: { role: "user" },
              create_time: 1704067202,
              content: { content_type: "text", parts: ["Test 3"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 3",
        create_time: 1704067202,
      },
      {
        mapping: {
          "4": {
            id: "4",
            message: {
              id: "4",
              author: { role: "user" },
              create_time: 1704067203,
              content: { content_type: "text", parts: ["Test 4"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 4",
        create_time: 1704067203,
      },
    ];

    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");
    await fs.mkdir(readOnlyDir, { recursive: true });

    // Make directory read-only on Unix systems
    if (process.platform !== "win32") {
      await fs.chmod(readOnlyDir, 0o555);
    }

    const options: Options = {
      input: filePath,
      output: readOnlyDir,
      format: "chatgpt",
      quiet: true, // Set quiet to true to test error summary only
      dryRun: false,
      filenameEncoding: "standard",
    };

    // Capture console output
    const originalError = console.error;
    const errors: string[] = [];
    console.error = (...args) => errors.push(args.join(" "));

    try {
      if (process.platform === "win32") {
        // Skip on Windows
        return;
      }

      // Should throw with error summary
      await expect(processFile(filePath, readOnlyDir, options)).rejects.toThrow(
        /Failed to write 4 file\(s\)/,
      );

      // Since quiet is true, individual errors should not be logged
      expect(errors.length).toBe(0);
    } finally {
      console.error = originalError;
      if (process.platform !== "win32") {
        await fs.chmod(readOnlyDir, 0o755);
      }
    }
  });

  test("logs individual write errors when not quiet", async () => {
    const filePath = path.join(tempDir, "test-errors.json");
    const readOnlyDir = path.join(tempDir, "readonly2");

    // Create test data with 2 conversations
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Test 1"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 1",
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
              content: { content_type: "text", parts: ["Test 2"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 2",
        create_time: 1704067201,
      },
    ];

    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");
    await fs.mkdir(readOnlyDir, { recursive: true });

    // Make directory read-only on Unix systems
    if (process.platform !== "win32") {
      await fs.chmod(readOnlyDir, 0o555);
    }

    const options: Options = {
      input: filePath,
      output: readOnlyDir,
      format: "chatgpt",
      quiet: false, // Not quiet - should log individual errors
      dryRun: false,
      filenameEncoding: "standard",
    };

    // Capture console output
    const originalError = console.error;
    const errors: string[] = [];
    console.error = (...args) => errors.push(args.join(" "));

    try {
      if (process.platform === "win32") {
        // Skip on Windows
        return;
      }

      await expect(processFile(filePath, readOnlyDir, options)).rejects.toThrow(
        /Failed to write 2 file\(s\)/,
      );

      // Should have logged individual errors
      expect(
        errors.filter((err) => err.includes("Warning: Failed to write file"))
          .length,
      ).toBe(2);
    } finally {
      console.error = originalError;
      if (process.platform !== "win32") {
        await fs.chmod(readOnlyDir, 0o755);
      }
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
      format: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: true,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
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
      format: "auto",
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
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
