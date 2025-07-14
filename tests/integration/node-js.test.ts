/**
 * Node.js Compatibility Integration Tests
 *
 * This test suite ensures that the TypeScript-compiled JavaScript works correctly
 * in standard Node.js environments. This is critical because:
 *
 * 1. The package is distributed via npm for Node.js users
 * 2. Not all users have Bun installed
 * 3. The compiled JavaScript in lib/ must work with Node.js module resolution
 *
 * These tests verify:
 * - The bin/ai-chat-md-export.js CLI entry point works with Node.js
 * - All CLI features function correctly in Node.js runtime
 * - Error handling works as expected
 *
 * Note: Tests skip if lib/ directory doesn't exist (not built yet)
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

describe("Node.js Execution Tests", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const fixturesDir = path.join(process.cwd(), "tests/fixtures");
  const cliPath = path.join(process.cwd(), "bin/ai-chat-md-export.js");
  const libDir = path.join(process.cwd(), "lib");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("Node.js can execute compiled JavaScript", async () => {
    // Check if lib directory exists (TypeScript compiled)
    try {
      await fs.access(libDir);
    } catch {
      console.log("Skipping Node.js test - lib directory not built");
      return;
    }

    // Test with Node.js directly
    const result = await $`node ${cliPath} -h`.quiet();
    const output = result.text();

    expect(output).toContain("ai-chat-md-export");
    expect(output).toContain(
      "Convert ChatGPT and Claude export data to Markdown",
    );
    expect(output).toContain("-i, --input");
    expect(output).toContain("-o, --output");
    expect(output).toContain("-f, --format");
  });

  test("Node.js can convert ChatGPT file", async () => {
    // Check if lib directory exists
    try {
      await fs.access(libDir);
    } catch {
      console.log("Skipping Node.js test - lib directory not built");
      return;
    }

    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const outputDir = path.join(tempDir, "output");

    const result =
      await $`node ${cliPath} -i ${inputFile} -o ${outputDir} -f chatgpt`.quiet();

    expect(result.exitCode).toBe(0);

    // Check output file was created
    const files = await fs.readdir(outputDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files[0]).toEndWith(".md");
  });

  test("Node.js handles errors correctly", async () => {
    // Check if lib directory exists
    try {
      await fs.access(libDir);
    } catch {
      console.log("Skipping Node.js test - lib directory not built");
      return;
    }

    try {
      await $`node ${cliPath} -i /nonexistent/file.json`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("Error:");
      expect(stderr).toContain("ENOENT");
    }
  });

  test("Node.js dry-run mode works", async () => {
    // Check if lib directory exists
    try {
      await fs.access(libDir);
    } catch {
      console.log("Skipping Node.js test - lib directory not built");
      return;
    }

    const inputFile = path.join(fixturesDir, "e2e/cli-test.json");
    const result = await $`node ${cliPath} -i ${inputFile} --dry-run`.quiet();

    expect(result.exitCode).toBe(0);
    const output = result.stdout.toString();
    expect(output).toContain("[DRY RUN] Would write:");
  });
});
