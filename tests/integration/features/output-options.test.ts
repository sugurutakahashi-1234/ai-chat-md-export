/**
 * Output Options Integration Tests
 *
 * Tests CLI output options like --quiet and --dry-run through actual execution.
 * Verifies user-visible behavior and output control.
 *
 * IMPORTANT: This tests OUTPUT BEHAVIOR from the user's perspective only.
 * DO NOT test internal implementation details here.
 *
 * FOCUS ON:
 * - --quiet suppresses expected output
 * - --dry-run prevents file creation
 * - Error messages still appear in quiet mode
 * - Combination of output options
 *
 * Internal logic for these options is tested in unit/core/processor.test.ts
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

describe("Output Options", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const cliPath = path.join(process.cwd(), "bin/ai-chat-md-export.js");
  let testFile: string;

  // Minimal test data for output options testing
  const createTestData = () => [
    {
      id: "test-conv",
      title: "Test Conversation",
      create_time: 1703980800, // 2023-12-31
      mapping: {
        "node-1": {
          id: "node-1",
          message: {
            id: "msg-1",
            author: { role: "user" },
            content: { parts: ["Hello, world!"] },
            create_time: 1703980800,
          },
          children: [],
        },
      },
    },
  ];

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    testFile = path.join(tempDir, "test-output-options.json");
    await fs.writeFile(testFile, JSON.stringify(createTestData()), "utf-8");
  });

  afterEach(async () => {
    await $`rm -rf ${tempDir}`.quiet();
  });

  describe("--quiet option", () => {
    test("suppresses progress messages", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --quiet`.quiet();

      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");

      // Verify files were actually created
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
    });

    test("still shows errors when quiet", async () => {
      try {
        await $`bun ${cliPath} -i /nonexistent/file.json --quiet`.quiet();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        const stderr =
          (error as { stderr?: { toString(): string } }).stderr?.toString() ||
          "";
        expect(stderr).toContain("✗");
        expect(stderr).toContain("ENOENT");
      }
    });
  });

  describe("--dry-run option", () => {
    test("shows what would be done without writing files", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --dry-run`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("[DRY RUN]");
      expect(output).toContain("2023-12-31_Test_Conversation.md");

      // Verify no files were created
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });

    test("dry-run with quiet shows nothing", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --dry-run --quiet`.quiet();

      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");

      // Verify no files were created
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });
  });

  describe("Combined output options", () => {
    test("all options together", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --search "hello" --dry-run --quiet`.quiet();

      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");

      // Verify no files were created
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });
  });
});
