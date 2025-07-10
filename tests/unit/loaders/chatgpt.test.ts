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
    const testFile = path.join(tempDir, "test-chatgpt.json");
    await fs.writeFile(
      testFile,
      JSON.stringify(createValidChatGPTData()),
      "utf-8",
    );

    const conversations = await loadChatGPT(testFile);

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
    const testFile = path.join(tempDir, "test-chatgpt-order.json");
    await fs.writeFile(
      testFile,
      JSON.stringify(createValidChatGPTData()),
      "utf-8",
    );

    const conversations = await loadChatGPT(testFile);
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

    await expect(loadChatGPT(filePath)).rejects.toThrow();
  });

  test("handles invalid JSON", async () => {
    const tempFile = path.join(tempDir, "invalid.json");
    await fs.writeFile(tempFile, "{ invalid json", "utf-8");

    await expect(loadChatGPT(tempFile)).rejects.toThrow();
  });

  test("handles non-array data", async () => {
    const tempFile = path.join(tempDir, "not-array.json");
    await fs.writeFile(tempFile, '{"not": "an array"}', "utf-8");

    await expect(loadChatGPT(tempFile)).rejects.toThrow(
      "ChatGPT export data must be an array",
    );
  });

  test("handles schema validation errors", async () => {
    const filePath = path.join(fixturesDir, "invalid-conversation.json");

    await expect(loadChatGPT(filePath)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("logs success message with count", async () => {
    const testFile = path.join(tempDir, "test-chatgpt-log.json");
    await fs.writeFile(
      testFile,
      JSON.stringify(createValidChatGPTData()),
      "utf-8",
    );

    await loadChatGPT(testFile);

    expect(
      consoleOutput.some((line) =>
        line.includes("✅ Successfully loaded 1 conversations"),
      ),
    ).toBe(true);
  });

  test("handles conversations without title", async () => {
    const testFile = path.join(tempDir, "no-title.json");
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
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    const conversations = await loadChatGPT(testFile);
    expect(conversations[0]?.title).toBe("Untitled Conversation");
  });

  test("handles messages with object content parts", async () => {
    const testFile = path.join(tempDir, "object-parts.json");
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
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    const conversations = await loadChatGPT(testFile);
    const messages = conversations[0]?.messages || [];
    expect(messages[0]?.content).toBe(
      `Part 1\nPart 2\n${JSON.stringify({ other: "data" }, null, 2)}`,
    );
  });

  test("reports skipped fields", async () => {
    const testFile = path.join(tempDir, "extra-fields.json");
    const data = [
      {
        title: "Test",
        create_time: 1703980800,
        extra_field: "should be skipped",
        mapping: {
          aaa: {
            id: "aaa",
            message: null,
            children: [],
          },
        },
      },
    ];
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    await loadChatGPT(testFile);

    expect(consoleOutput.some((line) => line.includes("Skipped fields"))).toBe(
      true,
    );
    expect(consoleOutput.some((line) => line.includes("extra_field"))).toBe(
      true,
    );
  });
});
