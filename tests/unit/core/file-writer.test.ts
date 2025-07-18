import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { FileWriter } from "../../../src/core/file-writer.js";
import type { Conversation } from "../../../src/types.js";

// Mock logger only
mock.module("../../../src/utils/logger.js", () => ({
  createLogger: () => ({
    output: mock(() => {}),
    warn: mock(() => {}),
    stat: mock(() => {}),
  }),
}));

describe("FileWriter", () => {
  let fileWriter: FileWriter;
  const tempDir = path.join(process.cwd(), "tests/temp/file-writer-test");
  const mockConversations: Conversation[] = [
    {
      id: "1",
      title: "Test Conversation",
      date: new Date("2024-01-01"),
      messages: [
        { role: "user" as const, content: "Hello" },
        { role: "assistant" as const, content: "Hi there!" },
      ],
    },
  ];

  beforeEach(async () => {
    fileWriter = new FileWriter();
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe("writeCombinedFile error handling", () => {
    it("handles writeFile errors gracefully", async () => {
      // Create a read-only directory to simulate write error
      const readOnlyDir = path.join(tempDir, "readonly");
      await fs.mkdir(readOnlyDir, { recursive: true });

      try {
        // Make directory read-only
        await fs.chmod(readOnlyDir, 0o444);

        await expect(
          fileWriter.writeConversations(mockConversations, readOnlyDir, {
            split: false,
            dryRun: false,
            quiet: true,
            format: "markdown",
          } as any),
        ).rejects.toThrow("Failed to write 1 file(s)");
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(readOnlyDir, 0o755).catch(() => {});
      }
    });

    it.skip("handles permission errors", async () => {
      // This test is similar to the write error test
      // Skipped as it's redundant with the write error test
    });

    it("does not write file in dry-run mode", async () => {
      const outputDir = path.join(tempDir, "dry-run-output");

      const result = await fileWriter.writeConversations(
        mockConversations,
        outputDir,
        {
          split: false,
          dryRun: true,
          quiet: true,
          format: "markdown",
        } as any,
      );

      // Check that output directory was not created
      await expect(fs.access(outputDir)).rejects.toThrow();

      expect(result.successCount).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it("handles multiple conversation combined file", async () => {
      const multipleConversations = [
        ...mockConversations,
        {
          id: "2",
          title: "Second Conversation",
          date: new Date("2024-01-02"),
          messages: [
            { role: "user" as const, content: "Test" },
            { role: "assistant" as const, content: "Response" },
          ],
        },
      ];

      const outputDir = path.join(tempDir, "combined-output");

      const result = await fileWriter.writeConversations(
        multipleConversations,
        outputDir,
        {
          split: false,
          dryRun: false,
          quiet: true,
          format: "markdown",
        } as any,
      );

      // Check that the combined file was created
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe("all-conversations.md");

      expect(result.successCount).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it("handles JSON format combined file", async () => {
      const outputDir = path.join(tempDir, "json-output");

      const result = await fileWriter.writeConversations(
        mockConversations,
        outputDir,
        {
          split: false,
          dryRun: false,
          quiet: true,
          format: "json",
        } as any,
      );

      // Check that the JSON file was created
      const files = await fs.readdir(outputDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe("all-conversations.json");

      // Verify JSON content
      const content = await fs.readFile(
        path.join(outputDir, files[0]),
        "utf-8",
      );
      const parsed = JSON.parse(content);
      expect(parsed.conversations).toHaveLength(1);

      expect(result.successCount).toBe(1);
    });
  });
});
