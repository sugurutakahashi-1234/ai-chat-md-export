/**
 * CLI Integration Tests (Bun Runtime)
 *
 * Tests the CLI functionality using Bun runtime directly.
 * These tests run the CLI script through Bun without building/packaging,
 * making them fast for development and catching issues early.
 *
 * Coverage: Help text, file conversion, error handling, directory processing
 *
 * IMPORTANT TEST DESIGN PRINCIPLES:
 *
 * This file tests END-TO-END CLI behavior only. DO NOT test:
 * - Schema validation details (covered in unit/schemas/)
 * - Format detection logic (covered in unit/utils/format-detector.test.ts)
 * - Filename sanitization (covered in unit/filename.test.ts)
 * - Filter logic details (covered in unit/core/processor.test.ts)
 * - Markdown generation (covered in unit/markdown.test.ts)
 *
 * FOCUS ON:
 * - Actual CLI execution and exit codes
 * - File system interactions (reading input, writing output)
 * - User-facing output messages and progress
 * - Multi-file processing scenarios
 * - Error messages shown to users
 * - Integration between components
 *
 * If you need to test specific logic, add it to the appropriate unit test file.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

// Test data creation helpers
function createChatGPTConversation(overrides: any = {}) {
  return {
    title: "E2E CLI Test Conversation",
    create_time: 1703980800,
    id: "e2e-cli-test",
    mapping: {
      "node-1": {
        id: "node-1",
        message: {
          id: "msg-1",
          author: { role: "system" },
          content: {
            parts: ["You are a helpful assistant for E2E testing."],
          },
          create_time: 1703980800,
        },
        children: ["node-2"],
      },
      "node-2": {
        id: "node-2",
        message: {
          id: "msg-2",
          author: { role: "user" },
          content: {
            parts: ["Hello, this is an E2E test!"],
          },
          create_time: 1703980810,
        },
        children: ["node-3"],
      },
      "node-3": {
        id: "node-3",
        message: {
          id: "msg-3",
          author: { role: "assistant" },
          content: {
            parts: ["Hello! I'm here to help with E2E testing."],
          },
          create_time: 1703980820,
        },
        children: [],
      },
    },
    ...overrides,
  };
}

function createClaudeConversation(overrides: any = {}) {
  return {
    uuid: "conv-123",
    name: "Test Claude Conversation",
    created_at: "2024-01-01T12:00:00Z",
    updated_at: "2024-01-01T12:30:00Z",
    chat_messages: [
      {
        uuid: "msg-1",
        text: "Hello, Claude!",
        sender: "human",
        created_at: "2024-01-01T12:00:00Z",
      },
      {
        uuid: "msg-2",
        text: "Hello! How can I help you today?",
        sender: "assistant",
        created_at: "2024-01-01T12:00:10Z",
      },
    ],
    ...overrides,
  };
}

describe("CLI Integration Tests", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const cliPath = path.join(process.cwd(), "bin/ai-chat-md-export.js");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("shows help with -h flag", async () => {
    const result = await $`bun ${cliPath} -h`.quiet();
    const output = result.text();

    expect(output).toContain("ai-chat-md-export");
    expect(output).toContain(
      "Convert ChatGPT and Claude export data to Markdown",
    );
    expect(output).toContain("-i, --input");
    expect(output).toContain("-o, --output");
    expect(output).toContain("-f, --format");
  });

  test("requires input argument", async () => {
    try {
      await $`bun ${cliPath}`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("✗ Required options missing:");
      const stdout =
        (error as { stdout?: { toString(): string } }).stdout?.toString() || "";
      expect(stdout).toContain(
        "Try 'ai-chat-md-export --help' for usage information.",
      );
    }
  });

  test("converts ChatGPT file", async () => {
    // Create test data
    const testData = [createChatGPTConversation()];
    const inputFile = path.join(tempDir, "chatgpt-test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toMatch(/^2023-12-31_.*\.md$/);

    const content = await fs.readFile(
      path.join(outputDir, outputFiles[0] || ""),
      "utf-8",
    );
    expect(content).toContain("# E2E CLI Test Conversation");
    expect(content).toContain("You are a helpful assistant for E2E testing.");
    expect(content).toContain("Hello, this is an E2E test!");
  });

  test("converts Claude file", async () => {
    // Create test data
    const testData = [createClaudeConversation()];
    const inputFile = path.join(tempDir, "claude-test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p claude`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toMatch(/^2024-01-01_.*\.md$/);

    const content = await fs.readFile(
      path.join(outputDir, outputFiles[0] || ""),
      "utf-8",
    );
    expect(content).toContain("# Test Claude Conversation");
    expect(content).toContain("Hello, Claude!");
  });

  test("filters file with date and search options", async () => {
    const inputFile = path.join(tempDir, "conversations.json");

    // Create test file with multiple conversations
    const conversations = [
      {
        title: "Old Python Discussion",
        create_time: 1672531200, // 2023-01-01
        mapping: {
          aaa: {
            id: "aaa",
            message: {
              id: "aaa",
              author: { role: "user" },
              content: { parts: ["Python basics"] },
              create_time: 1672531200,
            },
            children: [],
          },
        },
      },
      {
        title: "Recent JavaScript Tutorial",
        create_time: 1703980800, // 2023-12-31
        mapping: {
          bbb: {
            id: "bbb",
            message: {
              id: "bbb",
              author: { role: "user" },
              content: { parts: ["JavaScript advanced topics"] },
              create_time: 1703980800,
            },
            children: [],
          },
        },
      },
    ];

    await fs.writeFile(inputFile, JSON.stringify(conversations), "utf-8");

    const outputDir = path.join(tempDir, "output");

    // Test with date filter - should only get recent conversation
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt --since 2023-06-01`;

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toContain("JavaScript");
  });

  test("handles non-existent file", async () => {
    const inputFile = path.join(tempDir, "non-existent.json");
    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("✗");
      expect(stderr).toContain("ENOENT");
    }
  });

  test("handles unsupported format", async () => {
    // Create a dummy file for testing
    const testData = [createChatGPTConversation()];
    const inputFile = path.join(tempDir, "test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f unsupported`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      // The error now comes from commander validation
      expect(stderr).toContain("✗");
      expect(stderr).toContain("Required options missing: platform");
    }
  });

  test("shows version with --version flag", async () => {
    const result = await $`bun ${cliPath} --version`.quiet();
    const output = result.text().trim();

    expect(result.exitCode).toBe(0);
    expect(output).toMatch(/^\d+\.\d+\.\d+$/); // Matches version format
  });

  test("operates in dry-run mode", async () => {
    // Create test data
    const testData = [createChatGPTConversation()];
    const inputFile = path.join(tempDir, "dry-run-test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt --dry-run`.quiet();

    expect(result.exitCode).toBe(0);

    // Output directory should not be created in dry-run mode
    let dirExists = true;
    try {
      await fs.readdir(outputDir);
    } catch {
      dirExists = false;
    }
    expect(dirExists).toBe(false);
  });

  test("operates in quiet mode", async () => {
    // Create test data
    const testData = [createChatGPTConversation()];
    const inputFile = path.join(tempDir, "quiet-test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");

    // Capture stdout to verify quiet mode
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt --quiet`;

    expect(result.exitCode).toBe(0);
    // In quiet mode, there should be no output
    expect(result.stdout.toString()).toBe("");
  });

  test("filters with --until date", async () => {
    const inputFile = path.join(tempDir, "multi-dates.json");
    const conversations = [
      createChatGPTConversation({
        title: "Early conversation",
        create_time: 1672531200, // 2023-01-01
      }),
      createChatGPTConversation({
        title: "Later conversation",
        create_time: 1703980800, // 2023-12-31
      }),
    ];
    await fs.writeFile(inputFile, JSON.stringify(conversations), "utf-8");

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt --until 2023-06-01`.quiet();

    expect(result.exitCode).toBe(0);
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toContain("2023-01-01");
  });

  test("handles no matches with filters gracefully", async () => {
    const inputFile = path.join(tempDir, "no-match.json");
    const conversations = [createChatGPTConversation()];
    await fs.writeFile(inputFile, JSON.stringify(conversations), "utf-8");

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt --search "nonexistent"`.quiet();

    expect(result.exitCode).toBe(0);
    // Directory shouldn't be created when no files to write
    const dirExists = await fs.stat(outputDir).catch(() => null);
    expect(dirExists).toBeNull();
  });

  test("validates date format", async () => {
    const inputFile = path.join(tempDir, "date-test.json");
    const conversations = [createChatGPTConversation()];
    await fs.writeFile(inputFile, JSON.stringify(conversations), "utf-8");

    try {
      await $`bun ${cliPath} -i ${inputFile} -p chatgpt --since "2024/01/01"`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("✗");
      expect(stderr).toContain("Date must be in YYYY-MM-DD format");
    }
  });
});
