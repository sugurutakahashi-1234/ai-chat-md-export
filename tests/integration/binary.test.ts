import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

describe("Binary Integration Tests", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const fixturesDir = path.join(process.cwd(), "tests/fixtures");
  const binaryPath = path.join(process.cwd(), "bin/ai-chat-md-export");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    
    // Check if binary exists
    try {
      await fs.access(binaryPath);
    } catch {
      console.warn(`Binary not found at ${binaryPath}. Run 'bun run build' first.`);
    }
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("binary shows help", async () => {
    try {
      await fs.access(binaryPath);
    } catch {
      console.log("Skipping binary test - binary not built");
      return;
    }

    const result = await $`${binaryPath} -h`.quiet();
    const output = result.text();

    expect(output).toContain("ai-chat-md-export");
    expect(output).toContain("Convert ChatGPT and Claude export data to Markdown");
    expect(output).toContain("-i, --input");
    expect(output).toContain("-o, --output");
    expect(output).toContain("-f, --format");
  });

  test("binary converts file with --dry-run", async () => {
    try {
      await fs.access(binaryPath);
    } catch {
      console.log("Skipping binary test - binary not built");
      return;
    }

    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
    const result = await $`${binaryPath} -i ${inputFile} --dry-run`.quiet();

    expect(result.exitCode).toBe(0);
    const output = result.stdout.toString();
    expect(output).toContain("[DRY RUN] Would write:");
    expect(output).toContain("2023-12-31_Test_Conversation.md");
  });

  test("binary handles all new options", async () => {
    try {
      await fs.access(binaryPath);
    } catch {
      console.log("Skipping binary test - binary not built");
      return;
    }

    const inputFile = path.join(fixturesDir, "chatgpt/valid-conversation.json");
    
    // Test --quiet --dry-run
    const quietResult = await $`${binaryPath} -i ${inputFile} --quiet --dry-run`.quiet();
    expect(quietResult.exitCode).toBe(0);
    expect(quietResult.stdout.toString()).toBe("");

    // Test --search
    const searchResult = await $`${binaryPath} -i ${inputFile} --search "hello" --dry-run`.quiet();
    expect(searchResult.exitCode).toBe(0);
    expect(searchResult.stdout.toString()).toContain("Filtered: 1 of 1 conversations");
  });

  test("binary handles errors correctly", async () => {
    try {
      await fs.access(binaryPath);
    } catch {
      console.log("Skipping binary test - binary not built");
      return;
    }

    try {
      await $`${binaryPath} -i /nonexistent/file.json`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr = (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("Error:");
      expect(stderr).toContain("ENOENT");
    }
  });
});