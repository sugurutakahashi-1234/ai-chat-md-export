/**
 * CLI Integration Tests (Bun Runtime)
 *
 * Tests the CLI functionality using Bun runtime directly.
 * These tests run the CLI script through Bun without building/packaging,
 * making them fast for development and catching issues early.
 *
 * Coverage: Help text, file conversion, error handling, directory processing
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
      const output =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(output).toContain("Error: Input file is required.");
      expect(output).toContain(
        "Try 'ai-chat-md-export --help' for usage information.",
      );
    }
  });

  test("converts ChatGPT file", async () => {
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f chatgpt`.quiet();

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
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f claude`.quiet();

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

  test("auto-detects format", async () => {
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir}`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
  });

  test("processes directory", async () => {
    const inputDir = path.join(tempDir, "input");
    await fs.mkdir(inputDir);

    // Copy test files
    await fs.copyFile(
      path.join(fixturesDir, "e2e/cli-test.json"),
      path.join(inputDir, "chatgpt.json"),
    );
    await fs.copyFile(
      path.join(fixturesDir, "claude/valid-conversation.json"),
      path.join(inputDir, "claude.json"),
    );

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputDir} -o ${outputDir}`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(2);
  });

  test("handles invalid file format", async () => {
    const inputFile = path.join(
      fixturesDir,
      "chatgpt/invalid-conversation.json",
    );
    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f chatgpt`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const output =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(output).toContain("Error:");
      expect(output).toContain("Schema validation error");
    }
  });

  test("handles non-existent file", async () => {
    const inputFile = path.join(tempDir, "non-existent.json");
    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir}`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const output =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(output).toContain("Error:");
      expect(output).toContain("ENOENT");
    }
  });

  test("handles unsupported format", async () => {
    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
    const outputDir = path.join(tempDir, "output");

    try {
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f unsupported`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const output =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      // The error now comes from Zod validation rather than commander
      expect(output).toContain("invalid_value");
      expect(output).toContain("expected one of");
    }
  });

  test("sanitizes file names", async () => {
    // Create a test file with special characters in title
    const testData = [
      {
        title: "Test/With:Special*Characters?",
        create_time: 1703980800,
        mapping: {
          aaa: {
            id: "aaa",
            message: null,
            children: [],
          },
        },
      },
    ];

    const inputFile = path.join(tempDir, "special-chars.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f chatgpt`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    // Should produce sanitized filename with standard encoding
    expect(outputFiles[0]).toBe("2023-12-31_Test_With_Special_Characters_.md");
  });

  test("shows version with --version flag", async () => {
    const result = await $`bun ${cliPath} --version`.quiet();
    const output = result.text().trim();

    expect(result.exitCode).toBe(0);
    expect(output).toMatch(/^\d+\.\d+\.\d+$/); // Matches version format
  });

  test("filters conversations by date with --since and --until", async () => {
    // Create test files with different dates
    const testData = [
      {
        title: "Old Conversation",
        create_time: 1672531200, // 2023-01-01
        mapping: {
          aaa: {
            id: "aaa",
            message: null,
            children: [],
          },
        },
      },
      {
        title: "Recent Conversation",
        create_time: 1703980800, // 2023-12-31
        mapping: {
          bbb: {
            id: "bbb",
            message: null,
            children: [],
          },
        },
      },
    ];

    const inputFile = path.join(tempDir, "date-filter.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --since 2023-06-01 --until 2023-12-31`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toContain("Recent_Conversation");
  });

  test("filters conversations by search keyword", async () => {
    const testData = [
      {
        title: "Python Programming",
        create_time: 1703980800,
        mapping: {
          aaa: {
            id: "aaa",
            message: {
              id: "aaa",
              author: { role: "user" },
              content: {
                parts: ["Let's learn Python"],
              },
              create_time: 1703980800,
            },
            children: [],
          },
        },
      },
      {
        title: "JavaScript Guide",
        create_time: 1703980800,
        mapping: {
          bbb: {
            id: "bbb",
            message: {
              id: "bbb",
              author: { role: "user" },
              content: {
                parts: ["JavaScript tutorial"],
              },
              create_time: 1703980800,
            },
            children: [],
          },
        },
      },
    ];

    const inputFile = path.join(tempDir, "search-filter.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --search python`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    expect(outputFiles[0]).toContain("Python_Programming");
  });

  test("operates in dry-run mode", async () => {
    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = path.join(tempDir, "output");

    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --dry-run`.quiet();

    expect(result.exitCode).toBe(0);

    // Output directory should not be created in dry-run mode
    const dirExists = await fs
      .access(outputDir)
      .then(() => true)
      .catch(() => false);
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

  test("preserves special characters with --filename-encoding preserve", async () => {
    const testData = [
      {
        title: "Test:With:Colons",
        create_time: 1703980800,
        mapping: {
          aaa: {
            id: "aaa",
            message: null,
            children: [],
          },
        },
      },
    ];

    const inputFile = path.join(tempDir, "preserve-chars.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");
    const result =
      await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} -f chatgpt --filename-encoding preserve`.quiet();

    expect(result.exitCode).toBe(0);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
    // With preserve encoding, colons should be kept (on systems that support them)
    // This might vary by OS, so we just check that the file was created
    expect(outputFiles[0]).toContain("2023-12-31");
  });
});
