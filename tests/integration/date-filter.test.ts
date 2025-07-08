import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";

describe("Date Filtering", () => {
  const testDir = path.join(import.meta.dir, "test-date-filter");
  const inputFile = path.join(testDir, "conversations.json");
  const outputDir = path.join(testDir, "output");

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });

    // Create test data with different dates
    const testData = [
      {
        id: "1",
        title: "Early Conversation",
        create_time: 1704067200, // 2024-01-01
        mapping: {
          a: {
            id: "a",
            message: {
              id: "msg-a",
              author: { role: "user" },
              content: { parts: ["Hello from January"] },
              create_time: 1704067200,
            },
            children: ["b"],
          },
          b: {
            id: "b",
            message: {
              id: "msg-b",
              author: { role: "assistant" },
              content: { parts: ["Hi there!"] },
              create_time: 1704067201,
            },
            children: [],
          },
        },
      },
      {
        id: "2",
        title: "Mid Year Conversation",
        create_time: 1719792000, // 2024-07-01
        mapping: {
          c: {
            id: "c",
            message: {
              id: "msg-c",
              author: { role: "user" },
              content: { parts: ["Hello from July"] },
              create_time: 1719792000,
            },
            children: ["d"],
          },
          d: {
            id: "d",
            message: {
              id: "msg-d",
              author: { role: "assistant" },
              content: { parts: ["Summer greetings!"] },
              create_time: 1719792001,
            },
            children: [],
          },
        },
      },
      {
        id: "3",
        title: "Late Conversation",
        create_time: 1735603200, // 2024-12-31
        mapping: {
          e: {
            id: "e",
            message: {
              id: "msg-e",
              author: { role: "user" },
              content: { parts: ["Hello from December"] },
              create_time: 1735603200,
            },
            children: ["f"],
          },
          f: {
            id: "f",
            message: {
              id: "msg-f",
              author: { role: "assistant" },
              content: { parts: ["Happy New Year!"] },
              create_time: 1735603201,
            },
            children: [],
          },
        },
      },
    ];

    await fs.writeFile(inputFile, JSON.stringify(testData, null, 2));
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test("filters conversations with --since", async () => {
    const proc = Bun.spawn(
      [
        "bun",
        "run",
        path.join(import.meta.dir, "../../src/cli.ts"),
        "-i",
        inputFile,
        "-o",
        outputDir,
        "--since",
        "2024-06-01",
      ],
      {
        cwd: import.meta.dir,
      },
    );

    await proc.exited;
    expect(proc.exitCode).toBe(0);

    const files = await fs.readdir(outputDir);
    expect(files).toHaveLength(2); // July and December conversations
    expect(files.some((f) => f.includes("Mid_Year_Conversation"))).toBe(true);
    expect(files.some((f) => f.includes("Late_Conversation"))).toBe(true);
    expect(files.some((f) => f.includes("Early_Conversation"))).toBe(false);
  });

  test("filters conversations with --until", async () => {
    const proc = Bun.spawn(
      [
        "bun",
        "run",
        path.join(import.meta.dir, "../../src/cli.ts"),
        "-i",
        inputFile,
        "-o",
        outputDir,
        "--until",
        "2024-06-30",
      ],
      {
        cwd: import.meta.dir,
      },
    );

    await proc.exited;
    expect(proc.exitCode).toBe(0);

    const files = await fs.readdir(outputDir);
    expect(files).toHaveLength(1); // Only January conversation
    expect(files.some((f) => f.includes("Early_Conversation"))).toBe(true);
    expect(files.some((f) => f.includes("Mid_Year_Conversation"))).toBe(false);
    expect(files.some((f) => f.includes("Late_Conversation"))).toBe(false);
  });

  test("filters conversations with both --since and --until", async () => {
    const proc = Bun.spawn(
      [
        "bun",
        "run",
        path.join(import.meta.dir, "../../src/cli.ts"),
        "-i",
        inputFile,
        "-o",
        outputDir,
        "--since",
        "2024-06-01",
        "--until",
        "2024-08-31",
      ],
      {
        cwd: import.meta.dir,
      },
    );

    await proc.exited;
    expect(proc.exitCode).toBe(0);

    const files = await fs.readdir(outputDir);
    expect(files).toHaveLength(1); // Only July conversation
    expect(files.some((f) => f.includes("Mid_Year_Conversation"))).toBe(true);
    expect(files.some((f) => f.includes("Early_Conversation"))).toBe(false);
    expect(files.some((f) => f.includes("Late_Conversation"))).toBe(false);
  });

  test("validates date format", async () => {
    const proc = Bun.spawn(
      [
        "bun",
        "run",
        path.join(import.meta.dir, "../../src/cli.ts"),
        "-i",
        inputFile,
        "-o",
        outputDir,
        "--since",
        "2024/01/01", // Invalid format
      ],
      {
        cwd: import.meta.dir,
        stderr: "pipe",
        stdout: "pipe",
      },
    );

    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    await proc.exited;
    expect(proc.exitCode).toBe(1);
    const combinedOutput = stdout + stderr;
    expect(combinedOutput).toContain("Date must be in YYYY-MM-DD format");
  });

  test("handles empty result after filtering", async () => {
    const proc = Bun.spawn(
      [
        "bun",
        "run",
        path.join(import.meta.dir, "../../src/cli.ts"),
        "-i",
        inputFile,
        "-o",
        outputDir,
        "--since",
        "2025-01-01", // Future date
      ],
      {
        cwd: import.meta.dir,
      },
    );

    const output = await new Response(proc.stdout).text();
    await proc.exited;
    expect(proc.exitCode).toBe(0);
    expect(output).toContain("Filtered: 0 of 3 conversations");
  });
});
