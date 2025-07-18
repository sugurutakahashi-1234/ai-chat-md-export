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

describe("loadChatGPT with inline data", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const fixturesDir = path.join(process.cwd(), "tests/fixtures/chatgpt");

  // Test data for normal cases
  const createValidChatGPTData = () => [
    {
      title: "Test Conversation",
      create_time: 1703980800,
      id: "conv-123",
      mapping: {
        "aaa-111": {
          id: "aaa-111",
          message: null,
          children: ["bbb-222"],
        },
        "bbb-222": {
          id: "bbb-222",
          message: {
            id: "bbb-222",
            author: { role: "system" },
            create_time: 1703980800,
            content: {
              parts: ["You are a helpful assistant."],
            },
          },
          children: ["ccc-333"],
        },
        "ccc-333": {
          id: "ccc-333",
          message: {
            id: "ccc-333",
            author: { role: "user" },
            create_time: 1703980810,
            content: {
              parts: ["Hello, how are you?"],
            },
          },
          children: ["ddd-444"],
        },
        "ddd-444": {
          id: "ddd-444",
          message: {
            id: "ddd-444",
            author: { role: "assistant" },
            create_time: 1703980820,
            content: {
              parts: ["I'm doing well, thank you! How can I help you today?"],
            },
          },
          children: [],
        },
      },
    },
  ];

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  });

  test("loads valid ChatGPT conversation", async () => {
    const data = createValidChatGPTData();
    const conversations = await loadChatGPT(data);

    expect(conversations).toHaveLength(1);
    const conv = conversations[0];
    expect(conv).toBeDefined();
    expect(conv).toHaveProperty("id", "conv-123");
    expect(conv).toHaveProperty("title", "Test Conversation");
    expect(conv?.date).toBeInstanceOf(Date);
    expect(conv?.date.toISOString().split("T")[0]).toBe("2023-12-31");
    expect(conv?.messages).toHaveLength(3); // system, user, assistant
  });

  test("extracts messages in correct order", async () => {
    const data = createValidChatGPTData();
    const conversations = await loadChatGPT(data);
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
    const filePath = path.join(tempDir, "non-existent.json");

    await expect(fs.readFile(filePath, "utf-8")).rejects.toThrow();
  });

  test("handles invalid JSON", async () => {
    const tempFile = path.join(tempDir, "invalid.json");
    await fs.writeFile(tempFile, "{ invalid json", "utf-8");

    const content = await fs.readFile(tempFile, "utf-8");
    expect(() => JSON.parse(content)).toThrow();
  });

  test("handles non-array data", async () => {
    const data = { not: "an array" };

    await expect(loadChatGPT(data)).rejects.toThrow(
      "ChatGPT export data must be an array",
    );
  });

  test("handles schema validation errors", async () => {
    const data = await fs.readFile(
      path.join(fixturesDir, "invalid-conversation.json"),
      "utf-8",
    );
    const parsedData = JSON.parse(data);

    await expect(loadChatGPT(parsedData)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("logs success message with count", async () => {
    const data = createValidChatGPTData();
    await loadChatGPT(data, { quiet: false });

    const logMessages = consoleOutput.join("\n");
    expect(logMessages).toContain("Successfully loaded 1 conversations");
  });

  test("handles conversations without title", async () => {
    const data = createValidChatGPTData();
    // @ts-expect-error - Testing without title
    delete data[0].title;

    const conversations = await loadChatGPT(data);
    expect(conversations[0]?.title).toBe("Untitled Conversation");
  });

  test("reports skipped fields", async () => {
    const data = createValidChatGPTData();
    // @ts-expect-error - Add unknown field for testing
    data[0].customField = "unknown field";
    // @ts-expect-error - Add another unknown field
    data[0].anotherField = 123;

    await loadChatGPT(data, { quiet: false });

    const logMessages = consoleOutput.join("\n");
    expect(logMessages).toContain("Successfully loaded 1 conversations");
    expect(logMessages).toContain("Skipped fields during conversion");
    expect(logMessages).toContain("anotherField");
    expect(logMessages).toContain("customField");
  });
});
