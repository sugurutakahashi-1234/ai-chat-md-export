/**
 * Node.js Compatibility Tests
 *
 * Tests the compiled JavaScript (lib/) with Node.js runtime.
 * Essential because most NPM users will run this with Node.js, not Bun.
 *
 * Verifies: Node.js compatibility, module resolution, CLI functionality
 * Requires: `bun run build:npm` to generate lib/ directory
 *
 * IMPORTANT TEST DESIGN PRINCIPLES:
 *
 * This file tests CROSS-RUNTIME COMPATIBILITY only. It ensures that:
 * - The compiled JavaScript runs correctly in Node.js
 * - Basic CLI functionality works across runtimes
 * - No Bun-specific APIs are accidentally used
 *
 * DO NOT add detailed functional tests here. Those belong in:
 * - bin.test.ts for comprehensive CLI integration tests
 * - Unit tests for specific component logic
 *
 * KEEP THESE TESTS MINIMAL - just enough to verify Node.js compatibility.
 * If a test passes in bin.test.ts but fails here, it's likely a runtime issue.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { $ } from "bun";

// Test data creation helper (minimal for Node.js compatibility testing)
function createChatGPTTestData() {
  return [
    {
      title: "Node.js Test Conversation",
      create_time: 1703980800,
      id: "nodejs-test",
      mapping: {
        "node-1": {
          id: "node-1",
          message: {
            id: "msg-1",
            author: { role: "user" },
            content: {
              parts: ["Hello from Node.js test!"],
            },
            create_time: 1703980800,
          },
          children: [],
        },
      },
    },
  ];
}

describe("Node.js Execution Tests", () => {
  let tempDir: string;
  const cliPath = path.join(process.cwd(), "bin/ai-chat-md-export.js");
  const libDir = path.join(process.cwd(), "lib");

  beforeEach(async () => {
    // Create a unique temporary directory for each test
    tempDir = mkdtempSync(path.join(tmpdir(), "ai-chat-md-export-test-"));
  });

  afterEach(async () => {
    // Clean up the temporary directory
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {
        // Ignore errors during cleanup
      });
    }
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

    // Create test data file
    const testData = createChatGPTTestData();
    const inputFile = path.join(tempDir, "nodejs-test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const outputDir = path.join(tempDir, "output");

    const result =
      await $`node ${cliPath} -i ${inputFile} -o ${outputDir} -p chatgpt`.quiet();

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
      await $`node ${cliPath} -i /nonexistent/file.json -p chatgpt`.quiet();
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      const stderr =
        (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
      expect(stderr).toContain("✗");
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

    // Create test data file
    const testData = createChatGPTTestData();
    const inputFile = path.join(tempDir, "nodejs-dryrun-test.json");
    await fs.writeFile(inputFile, JSON.stringify(testData), "utf-8");

    const result =
      await $`node ${cliPath} -i ${inputFile} --dry-run -p chatgpt`.quiet();

    expect(result.exitCode).toBe(0);
    const output = result.stdout.toString();
    expect(output).toContain("[DRY RUN]");
  });
});
