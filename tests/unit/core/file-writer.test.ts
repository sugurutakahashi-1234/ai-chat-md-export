import { beforeEach, describe, expect, it, mock } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { FileWriter } from "../../../src/core/file-writer.js";
import type { Conversation } from "../../../src/types.js";

// Mock fs module
mock.module("node:fs", () => ({
  promises: {
    mkdir: mock(() => Promise.resolve()),
    writeFile: mock(() => Promise.resolve()),
  },
}));

// Mock logger
mock.module("../../../src/utils/logger.js", () => ({
  createLogger: () => ({
    output: mock(() => {}),
    warn: mock(() => {}),
    stat: mock(() => {}),
  }),
}));

describe("FileWriter", () => {
  let fileWriter: FileWriter;
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

  beforeEach(() => {
    fileWriter = new FileWriter();
    // Reset mocks
    (fs.mkdir as any).mockClear();
    (fs.writeFile as any).mockClear();
  });

  describe("writeCombinedFile error handling", () => {
    it("handles writeFile errors gracefully", async () => {
      const writeError = new Error("ENOSPC: no space left on device");
      (fs.writeFile as any).mockRejectedValueOnce(writeError);

      await expect(
        fileWriter.writeConversations(mockConversations, "/test/output", {
          split: false,
          dryRun: false,
          quiet: false,
          format: "markdown",
        } as any),
      ).rejects.toThrow("Failed to write 1 file(s)");
    });

    it("handles permission errors", async () => {
      const permissionError = new Error("EACCES: permission denied");
      (fs.writeFile as any).mockRejectedValueOnce(permissionError);

      await expect(
        fileWriter.writeConversations(mockConversations, "/test/output", {
          split: false,
          dryRun: false,
          quiet: false,
          format: "markdown",
        } as any),
      ).rejects.toThrow("Failed to write 1 file(s)");
    });

    it("does not write file in dry-run mode", async () => {
      const result = await fileWriter.writeConversations(
        mockConversations,
        "/test/output",
        {
          split: false,
          dryRun: true,
          quiet: false,
          format: "markdown",
        } as any,
      );

      expect(fs.writeFile).not.toHaveBeenCalled();
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

      const result = await fileWriter.writeConversations(
        multipleConversations,
        "/test/output",
        {
          split: false,
          dryRun: false,
          quiet: false,
          format: "markdown",
        } as any,
      );

      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(result.successCount).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it("handles JSON format combined file", async () => {
      const result = await fileWriter.writeConversations(
        mockConversations,
        "/test/output",
        {
          split: false,
          dryRun: false,
          quiet: false,
          format: "json",
        } as any,
      );

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join("/test/output", "all-conversations.json"),
        expect.any(String),
        "utf-8",
      );
      expect(result.successCount).toBe(1);
    });
  });
});
