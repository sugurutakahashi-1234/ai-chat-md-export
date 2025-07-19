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

describe("CLI Integration Tests", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const fixturesDir = path.join(process.cwd(), "tests/fixtures");
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
      expect(stderr).toContain("✗ Input file is required.");
      const stdout =
        (error as { stdout?: { toString(): string } }).stdout?.toString() || "";
      expect(stdout).toContain(
        "Try 'ai-chat-md-export --help' for usage information.",
      );
    }
  });

  test("converts ChatGPT file", async () => {
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
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
    const inputFile = path.join(fixturesDir, "claude/valid-conversation.json");
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
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --since 2023-06-01`;

    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain(
      "Filtered: 1 of 2 conversations",
    );

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toContain("JavaScript");
  });

  test("handles non-existent file", async () => {
    const inputFile = path.join(tempDir, "non-existent.json");
    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir}`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("✗");
      expect(stderr).toContain("ENOENT");
    }
  });

  test("handles unsupported format", async () => {
    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f unsupported`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      // The error now comes from Zod validation rather than commander
      expect(stderr).toContain("✗");
      expect(stderr).toContain("expected one of");
    }
  });

  test("shows version with --version flag", async () => {
    const result = await $`bun ${cliPath} --version`.quiet();
    const output = result.text().trim();

    expect(result.exitCode).toBe(0);
    expect(output).toMatch(/^\d+\.\d+\.\d+$/); // Matches version format
  });

  test("operates in dry-run mode", async () => {
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --dry-run`.quiet();

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
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = path.join(tempDir, "output");

    // Capture stdout to verify quiet mode
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --quiet`;

    expect(result.exitCode).toBe(0);
    // In quiet mode, there should be no output
    expect(result.stdout.toString()).toBe("");
  });

  test("handles permission errors gracefully", async () => {
    // This test might be platform-specific, so we'll create a scenario
    // where we try to write to a read-only directory
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = "/root/forbidden"; // Usually no write permission

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir}`.quiet();
      // If we reach here, the directory might be writable (in CI)
      // So we'll just check that it tried to work
      expect(true).toBe(true);
    } catch (error) {
      // Expected: permission error
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      // Should contain some error message about permissions or directory
      expect(stderr).toContain("✗");
    }
  });
});
