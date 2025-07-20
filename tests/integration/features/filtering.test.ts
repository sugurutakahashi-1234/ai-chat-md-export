/**
 * Filtering Features Integration Tests
 *
 * Tests the date and search filtering functionality through CLI execution.
 * Focuses on user-facing behavior and output messages.
 *
 * IMPORTANT: This tests filtering from the USER'S PERSPECTIVE only.
 * DO NOT test internal filter logic here - that's covered in unit/core/filter.test.ts
 *
 * FOCUS ON:
 * - CLI arguments for filtering work correctly
 * - Filter statistics in output messages
 * - Correct files are created/skipped
 * - Combined filter behavior
 *
 * Detailed filter logic belongs in unit tests.
 */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "bun";

describe("Filtering Features", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const cliPath = path.join(process.cwd(), "bin/ai-chat-md-export.js");
  let testFile: string;

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });

    // Create test data with searchable content and different dates
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
              content: {
                parts: ["Tell me about neural networks and deep learning."],
              },
              create_time: 1703980801,
            },
            children: ["ccc"],
          },
          ccc: {
            id: "ccc",
            message: {
              id: "msg-ccc",
              author: { role: "assistant" },
              content: {
                parts: [
                  "Neural networks are computational models inspired by biological neurons...",
                ],
              },
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
              content: {
                parts: [
                  "To create a REST API, you need to understand HTTP methods...",
                ],
              },
              create_time: 1704067201,
            },
            children: [],
          },
        },
      },
      {
        id: "conv3",
        title: "Data Science Project",
        create_time: 1719792000, // 2024-07-01
        mapping: {
          fff: {
            id: "fff",
            message: {
              id: "msg-fff",
              author: { role: "user" },
              content: {
                parts: [
                  "I need help with machine learning for my data science project",
                ],
              },
              create_time: 1719792000,
            },
            children: ["ggg"],
          },
          ggg: {
            id: "ggg",
            message: {
              id: "msg-ggg",
              author: { role: "assistant" },
              content: {
                parts: [
                  "I'd be happy to help with your data science project! Machine learning is a key component...",
                ],
              },
              create_time: 1719792001,
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

  describe("Date Filtering", () => {
    test("filters conversations with --since", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --since 2024-01-01`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 2 of 3 conversations");

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(2);
      expect(files.some((f) => f.includes("2023-12-31"))).toBe(false);
      expect(files.some((f) => f.includes("2024-01-01"))).toBe(true);
      expect(files.some((f) => f.includes("2024-07-01"))).toBe(true);
    });

    test("filters conversations with --until", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --until 2024-06-30`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 2 of 3 conversations");

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(2);
      expect(files.some((f) => f.includes("2023-12-31"))).toBe(true);
      expect(files.some((f) => f.includes("2024-01-01"))).toBe(true);
      expect(files.some((f) => f.includes("2024-07-01"))).toBe(false);
    });

    test("filters conversations with both --since and --until", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --since 2024-01-01 --until 2024-06-30`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 3 conversations");

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("2024-01-01");
    });

    test("validates date format", async () => {
      try {
        await $`bun ${cliPath} -i ${testFile} -p chatgpt --since "2024/01/01"`.quiet();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        const stderr =
          (error as { stderr?: { toString(): string } }).stderr?.toString() ||
          "";
        expect(stderr).toContain("✗");
        expect(stderr).toContain("Date must be in YYYY-MM-DD format");
      }
    });
  });

  describe("Search Filtering", () => {
    test("filters conversations by keyword in title", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --search "Machine"`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 2 of 3 conversations"); // Matches both "Machine Learning" and "machine learning" in Data Science content
      expect(output).toContain('keyword "Machine"');

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(2);
      expect(files.some((f) => f.includes("Machine_Learning"))).toBe(true);
      expect(files.some((f) => f.includes("Data_Science"))).toBe(true);
    });

    test("filters conversations by keyword in content", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --search "neural"`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 3 conversations");

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("Machine_Learning");
    });

    test("search is case-insensitive", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --search "REST"`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 3 conversations");

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("API");
    });

    test("searches across multiple conversations", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --search "machine learning"`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 2 of 3 conversations");

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(2);
      // Should find both "Machine Learning Discussion" and "Data Science Project"
    });

    test("handles no search matches", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --search "nonexistent"`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 0 of 3 conversations");

      // Directory shouldn't be created when no files to write
      const dirExists = await fs.stat(outputDir).catch(() => null);
      expect(dirExists).toBeNull();
    });
  });

  describe("Combined Filters", () => {
    test("search and date filter together", async () => {
      const outputDir = path.join(tempDir, "output");
      const result =
        await $`bun ${cliPath} -i ${testFile} -o ${outputDir} -p chatgpt --since 2024-01-01 --search "machine"`.quiet();

      expect(result.exitCode).toBe(0);
      const output = result.stdout.toString();
      expect(output).toContain("Filtered: 1 of 3 conversations");
      expect(output).toContain("date from 2024-01-01");
      expect(output).toContain('keyword "machine"');

      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain("Data_Science"); // Only the July conversation matches both filters
    });
  });
});
