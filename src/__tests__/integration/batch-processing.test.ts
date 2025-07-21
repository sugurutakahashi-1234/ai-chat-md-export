import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { main } from "../../presentation/cli.js";

describe("Batch processing integration", () => {
  const testDataDir = path.join(process.cwd(), "test-data");
  const outputDir = path.join(process.cwd(), "test-output");

  beforeEach(async () => {
    // Clean up and create test directories
    await fs.rm(testDataDir, { recursive: true, force: true });
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(testDataDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up
    await fs.rm(testDataDir, { recursive: true, force: true });
    await fs.rm(outputDir, { recursive: true, force: true });
  });

  it("should process conversations in batches when batch-size is specified", async () => {
    // Create test data with 30 conversations
    const testData = Array.from({ length: 30 }, (_, i) => ({
      id: `conv-${i + 1}`,
      title: `Test Conversation ${i + 1}`,
      create_time: Math.floor(Date.now() / 1000) - i * 3600,
      mapping: {
        [`msg-${i}-1`]: {
          id: `msg-${i}-1`,
          message: {
            id: `msg-${i}-1`,
            author: { role: "user" },
            content: { parts: [`Test message ${i + 1}`] },
            create_time: Math.floor(Date.now() / 1000) - i * 3600,
          },
          children: [`msg-${i}-2`],
        },
        [`msg-${i}-2`]: {
          id: `msg-${i}-2`,
          message: {
            id: `msg-${i}-2`,
            author: { role: "assistant" },
            content: { parts: [`Response to message ${i + 1}`] },
            create_time: Math.floor(Date.now() / 1000) - i * 3600 + 60,
          },
          parent: `msg-${i}-1`,
          children: [],
        },
      },
    }));

    const inputFile = path.join(testDataDir, "test-conversations.json");
    await fs.writeFile(inputFile, JSON.stringify(testData, null, 2));

    // Capture console output to verify progress messages
    const consoleOutput: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      consoleOutput.push(args.join(" "));
      originalLog(...args);
    };

    try {
      // Run with batch size of 10
      process.argv = [
        "node",
        "ai-chat-md-export",
        "-i",
        inputFile,
        "-o",
        outputDir,
        "-p",
        "chatgpt",
        "--batch-size",
        "10",
      ];

      await main();

      // Verify all 30 files were created
      const files = await fs.readdir(outputDir);
      const mdFiles = files.filter((f) => f.endsWith(".md"));
      expect(mdFiles).toHaveLength(30);

      // Verify progress messages were shown (3 batches)
      const progressMessages = consoleOutput.filter((msg) =>
        msg.includes("Processed"),
      );
      expect(progressMessages).toHaveLength(3);
      expect(progressMessages[0]).toContain("Processed 10 / 30");
      expect(progressMessages[1]).toContain("Processed 20 / 30");
      expect(progressMessages[2]).toContain("Processed 30 / 30");

      // Verify file content is correct
      const firstFile = mdFiles.find((f) => f.includes("Test_Conversation_1"));
      expect(firstFile).toBeDefined();
      const content = await fs.readFile(
        path.join(outputDir, firstFile!),
        "utf-8",
      );
      expect(content).toContain("# Test Conversation 1");
      expect(content).toContain("Test message 1");
      expect(content).toContain("Response to message 1");
    } finally {
      // Restore console.log
      console.log = originalLog;
    }
  });

  it("should process all conversations at once when batch-size is not specified", async () => {
    // Create test data with 15 conversations
    const testData = Array.from({ length: 15 }, (_, i) => ({
      id: `conv-${i + 1}`,
      title: `Test Conversation ${i + 1}`,
      create_time: Math.floor(Date.now() / 1000) - i * 3600,
      mapping: {
        [`msg-${i}-1`]: {
          id: `msg-${i}-1`,
          message: {
            id: `msg-${i}-1`,
            author: { role: "user" },
            content: { parts: [`Test message ${i + 1}`] },
            create_time: Math.floor(Date.now() / 1000) - i * 3600,
          },
          children: [],
        },
      },
    }));

    const inputFile = path.join(testDataDir, "test-conversations.json");
    await fs.writeFile(inputFile, JSON.stringify(testData, null, 2));

    // Capture console output
    const consoleOutput: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      consoleOutput.push(args.join(" "));
      originalLog(...args);
    };

    try {
      // Run without batch size
      process.argv = [
        "node",
        "ai-chat-md-export",
        "-i",
        inputFile,
        "-o",
        outputDir,
        "-p",
        "chatgpt",
      ];

      await main();

      // Verify all 15 files were created
      const files = await fs.readdir(outputDir);
      const mdFiles = files.filter((f) => f.endsWith(".md"));
      expect(mdFiles).toHaveLength(15);

      // Verify no progress messages were shown (single batch)
      const progressMessages = consoleOutput.filter((msg) =>
        msg.includes("Processed"),
      );
      expect(progressMessages).toHaveLength(0);
    } finally {
      // Restore console.log
      console.log = originalLog;
    }
  });
});
