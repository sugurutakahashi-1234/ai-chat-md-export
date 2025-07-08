import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

describe("CLI Integration Tests", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const fixturesDir = path.join(process.cwd(), "tests/fixtures");
  const cliPath = path.join(process.cwd(), "src/cli.ts");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("shows help with -h flag", async () => {
    const result = await $`bun ${cliPath} -h`.quiet();
    const output = result.text();

    expect(output).toContain("chat-history-conv");
    expect(output).toContain(
      "Convert ChatGPT and Claude export data to Markdown",
    );
    expect(output).toContain("-i, --input");
    expect(output).toContain("-o, --output");
    expect(output).toContain("-f, --format");
    expect(output).toContain("--copy-raw");
  });

  test("requires input argument", async () => {
    try {
      await $`bun ${cliPath}`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const output =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(output).toContain("required option");
      expect(output).toContain("-i, --input");
    }
  });

  test("converts ChatGPT file", async () => {
    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
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
    expect(content).toContain("# Test Conversation");
    expect(content).toContain("You are a helpful assistant.");
    expect(content).toContain("Hello, how are you?");
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
    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
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
      path.join(fixturesDir, "chatgpt/valid-conversation.json"),
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

  test("copies raw files with --copy-raw", async () => {
    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
    const outputDir = path.join(tempDir, "output");

    // Change working directory temporarily
    const originalCwd = process.cwd();
    process.chdir(tempDir);

    try {
      const result =
        await $`bun ${cliPath} -i ${inputFile} -o ${outputDir} --copy-raw`.quiet();

      expect(result.exitCode).toBe(0);

      const rawFiles = await fs.readdir("data/raw/chatgpt");
      expect(rawFiles).toHaveLength(1);
      expect(rawFiles[0]).toMatch(
        /^\d{4}-\d{2}-\d{2}_valid-conversation\.json$/,
      );
    } finally {
      process.chdir(originalCwd);
    }
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
      expect(output).toContain("Invalid enum value");
      expect(output).toContain("Expected 'chatgpt' | 'claude' | 'auto'");
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
    // Should replace special characters with underscores
    expect(outputFiles[0]).toMatch(
      /^2023-12-31_Test_With_Special_Characters_\.md$/,
    );
  });
});
