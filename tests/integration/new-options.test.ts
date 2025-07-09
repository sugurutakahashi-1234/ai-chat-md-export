import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

describe("New CLI Options", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const cliPath = path.join(process.cwd(), "src/cli.ts");
  let testFile: string;

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    
    // Create test data with searchable content
    const testData = [
      {
        id: "conv1",
        title: "Machine Learning Discussion",
        create_time: 1703980800, // 2023-12-31
        mapping: {
          aaa: {
            id: "aaa",
            message: {
              id: "msg-aaa",
              author: { role: "system" },
              content: { parts: ["You are a helpful assistant."] },
              create_time: 1703980800,
            },
            children: ["bbb"],
          },
          bbb: {
            id: "bbb",
            message: {
              id: "msg-bbb",
              author: { role: "user" },
              content: { parts: ["Tell me about neural networks and deep learning."] },
              create_time: 1703980801,
            },
            children: ["ccc"],
          },
          ccc: {
            id: "ccc",
            message: {
              id: "msg-ccc",
              author: { role: "assistant" },
              content: { parts: ["Neural networks are computational models inspired by biological neurons..."] },
              create_time: 1703980802,
            },
            children: [],
          },
        },
      },
      {
        id: "conv2",
        title: "API Development",
        create_time: 1704067200, // 2024-01-01
        mapping: {
          ddd: {
            id: "ddd",
            message: {
              id: "msg-ddd",
              author: { role: "user" },
              content: { parts: ["How do I create a REST API?"] },
              create_time: 1704067200,
            },
            children: ["eee"],
          },
          eee: {
            id: "eee",
            message: {
              id: "msg-eee",
              author: { role: "assistant" },
              content: { parts: ["To create a REST API, you need to understand HTTP methods..."] },
              create_time: 1704067201,
            },
            children: [],
          },
        },
      },
    ];
    
    testFile = path.join(tempDir, "test-conversations.json");
    await fs.writeFile(testFile, JSON.stringify(testData), "utf-8");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe("--quiet option", () => {
    test("suppresses progress messages", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --quiet`.quiet();
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");
      
      // Check files were actually created
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(2);
    });

    test("still shows errors when quiet", async () => {
      try {
        await $`bun ${cliPath} -i /nonexistent/file.json --quiet`.quiet();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        const stderr = (error as { stderr?: { toString(): string } }).stderr?.toString() || "";
        expect(stderr).toContain("Error:");
        expect(stderr).toContain("ENOENT");
      }
    });
  });

  describe("--dry-run option", () => {
    test("shows what would be done without writing files", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --dry-run`.quiet();
      
      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("[DRY RUN] Would write:");
      expect(output).toContain("2023-12-31_Machine_Learning_Discussion.md");
      expect(output).toContain("2024-01-01_API_Development.md");
      
      // Check no files were created
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });

    test("dry-run with quiet shows nothing", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --dry-run --quiet`.quiet();
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");
      
      // Check no files were created
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });
  });

  describe("--search option", () => {
    test("filters conversations by keyword in title", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --search "Machine"`.quiet();
      
      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 2 conversations");
      expect(output).toContain('keyword "Machine"');
      
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("Machine");
    });

    test("filters conversations by keyword in content", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --search "neural"`.quiet();
      
      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 2 conversations");
      
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("Machine"); // The conversation about neural networks
    });

    test("search is case-insensitive", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --search "REST"`.quiet();
      
      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 2 conversations");
      
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("API");
    });

    test("search with no matches", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --search "nonexistent"`.quiet();
      
      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 0 of 2 conversations");
      
      // Check directory wasn't created since no files to write
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });
  });

  describe("combined options", () => {
    test("search and date filter together", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --since 2024-01-01 --search "API"`.quiet();
      
      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 2 conversations");
      expect(output).toContain("date from 2024-01-01");
      expect(output).toContain('keyword "API"');
      
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("API");
    });

    test("all options together", async () => {
      const outputDir = path.join(tempDir, "output");
      const result = await $`bun ${cliPath} -i ${testFile} -o ${outputDir} --search "learning" --dry-run --quiet`.quiet();
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout.toString()).toBe("");
      
      // Check no files were created
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });
  });
});