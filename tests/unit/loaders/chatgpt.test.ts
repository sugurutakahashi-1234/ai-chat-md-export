import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { loadChatGPT } from "../../../src/loaders/chatgpt.js";

// Mock console.log to capture output
const originalConsoleLog = console.log;
let consoleOutput: string[] = [];

beforeEach(() => {
  consoleOutput = [];
  console.log = mock((...args: unknown[]) => {
    consoleOutput.push(args.map((arg) => String(arg)).join(" "));
  });
});

// Restore console.log after tests
afterEach(() => {
  console.log = originalConsoleLog;
});

describe("loadChatGPT", () => {
  const fixturesDir = path.join(process.cwd(), "tests/fixtures/chatgpt");

  test("loads valid ChatGPT conversation", async () => {
    const filePath = path.join(fixturesDir, "valid-conversation.json");
    const conversations = await loadChatGPT(filePath);

    expect(conversations).toHaveLength(1);
    const conv = conversations[0];
    expect(conv).toBeDefined();
    expect(conv).toHaveProperty("id", "conv-123");
    expect(conv).toHaveProperty("title", "Test Conversation");
    expect(conv).toHaveProperty("date", "2023-12-31");
    expect(conv?.messages).toHaveLength(3); // system, user, assistant
  });

  test("extracts messages in correct order", async () => {
    const filePath = path.join(fixturesDir, "valid-conversation.json");
    const conversations = await loadChatGPT(filePath);
    const messages = conversations[0]?.messages || [];

    expect(messages[0]?.role).toBe("system");
    expect(messages[0]?.content).toBe("You are a helpful assistant.");

    expect(messages[1]?.role).toBe("user");
    expect(messages[1]?.content).toBe("Hello, how are you?");

    expect(messages[2]?.role).toBe("assistant");
    expect(messages[2]?.content).toBe(
      "I'm doing well, thank you! How can I help you today?",
    );
  });

  test("handles missing file", async () => {
    const filePath = path.join(fixturesDir, "non-existent.json");

    await expect(loadChatGPT(filePath)).rejects.toThrow();
  });

  test("handles invalid JSON", async () => {
    const tempFile = path.join(fixturesDir, "temp-invalid.json");
    await fs.writeFile(tempFile, "{ invalid json", "utf-8");

    try {
      await expect(loadChatGPT(tempFile)).rejects.toThrow();
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles non-array data", async () => {
    const tempFile = path.join(fixturesDir, "temp-not-array.json");
    await fs.writeFile(tempFile, '{"not": "an array"}', "utf-8");

    try {
      await expect(loadChatGPT(tempFile)).rejects.toThrow(
        "ChatGPT export data must be an array",
      );
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles schema validation errors", async () => {
    const filePath = path.join(fixturesDir, "invalid-conversation.json");

    await expect(loadChatGPT(filePath)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("logs success message with count", async () => {
    const filePath = path.join(fixturesDir, "valid-conversation.json");
    await loadChatGPT(filePath);

    expect(
      consoleOutput.some((line) =>
        line.includes("✅ Successfully loaded 1 conversations"),
      ),
    ).toBe(true);
  });

  test("handles conversations without title", async () => {
    const tempFile = path.join(fixturesDir, "temp-no-title.json");
    const data = [
      {
        title: null, // title is required but we test null handling
        create_time: 1703980800,
        mapping: {
          aaa: {
            id: "aaa",
            message: null,
            children: [],
          },
        },
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      const conversations = await loadChatGPT(tempFile);
      expect(conversations[0]?.title).toBe("Untitled Conversation");
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles messages with object content parts", async () => {
    const tempFile = path.join(fixturesDir, "temp-object-parts.json");
    const data = [
      {
        title: "Test",
        create_time: 1703980800,
        mapping: {
          aaa: {
            id: "aaa",
            message: {
              id: "aaa",
              author: { role: "user" },
              content: {
                parts: [
                  { content_type: "text", text: "Part 1" },
                  "Part 2",
                  { other: "data" },
                ],
              },
              create_time: 1703980800,
            },
            children: [],
          },
        },
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      const conversations = await loadChatGPT(tempFile);
      const content = conversations[0]?.messages[0]?.content || "";
      expect(content).toContain("Part 1");
      expect(content).toContain("Part 2");
      expect(content).toContain("{"); // JSON stringified object
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("reports skipped fields", async () => {
    const tempFile = path.join(fixturesDir, "temp-extra-fields.json");
    const data = [
      {
        title: "Test",
        create_time: 1703980800,
        mapping: {
          aaa: {
            id: "aaa",
            message: null,
            children: [],
          },
        },
        extra_field_1: "value1",
        extra_field_2: "value2",
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      await loadChatGPT(tempFile);
      expect(
        consoleOutput.some((line) =>
          line.includes("📋 Skipped fields during conversion"),
        ),
      ).toBe(true);
      expect(
        consoleOutput.some(
          (line) =>
            line.includes("extra_field_1") && line.includes("extra_field_2"),
        ),
      ).toBe(true);
    } finally {
      await fs.unlink(tempFile);
    }
  });
});
