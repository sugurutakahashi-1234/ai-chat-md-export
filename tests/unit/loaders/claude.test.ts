import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { loadClaude } from "../../../src/loaders/claude.js";

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

describe("loadClaude with inline data", () => {
  const tempDir = path.join(process.cwd(), "tests/temp");
  const fixturesDir = path.join(process.cwd(), "tests/fixtures/claude");

  // Test data for normal cases
  const createValidClaudeData = () => [
    {
      uuid: "conv-456",
      name: "Test Claude Conversation",
      created_at: "2024-01-01T12:00:00Z",
      chat_messages: [
        {
          uuid: "msg-1",
          text: "Hello, Claude!",
          sender: "human",
          created_at: "2024-01-01T12:00:00Z",
        },
        {
          uuid: "msg-2",
          text: "Hello! How can I help you today?",
          sender: "assistant",
          created_at: "2024-01-01T12:00:10Z",
        },
      ],
    },
  ];

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  });

  test("loads valid Claude conversation", async () => {
    const testFile = path.join(tempDir, "test-claude.json");
    await fs.writeFile(
      testFile,
      JSON.stringify(createValidClaudeData()),
      "utf-8",
    );

    const conversations = await loadClaude(testFile);

    expect(conversations).toHaveLength(1);
    const conv = conversations[0];
    expect(conv).toBeDefined();
    expect(conv).toHaveProperty("id", "conv-456");
    expect(conv).toHaveProperty("title", "Test Claude Conversation");
    expect(conv).toHaveProperty("date", "2024-01-01");
    expect(conv?.messages).toHaveLength(2);
  });

  test("extracts messages with correct roles", async () => {
    const testFile = path.join(tempDir, "test-claude-roles.json");
    await fs.writeFile(
      testFile,
      JSON.stringify(createValidClaudeData()),
      "utf-8",
    );

    const conversations = await loadClaude(testFile);
    const messages = conversations[0]?.messages || [];

    expect(messages[0]?.role).toBe("user");
    expect(messages[0]?.content).toBe("Hello, Claude!");

    expect(messages[1]?.role).toBe("assistant");
    expect(messages[1]?.content).toBe("Hello! How can I help you today?");
  });

  test("handles missing file", async () => {
    const filePath = path.join(tempDir, "non-existent.json");

    await expect(loadClaude(filePath)).rejects.toThrow();
  });

  test("handles invalid JSON", async () => {
    const tempFile = path.join(tempDir, "invalid.json");
    await fs.writeFile(tempFile, "{ invalid json", "utf-8");

    await expect(loadClaude(tempFile)).rejects.toThrow();
  });

  test("handles non-array data", async () => {
    const tempFile = path.join(tempDir, "not-array.json");
    await fs.writeFile(tempFile, '{"not": "an array"}', "utf-8");

    await expect(loadClaude(tempFile)).rejects.toThrow(
      "Claude export data must be an array",
    );
  });

  test("handles schema validation errors", async () => {
    const filePath = path.join(fixturesDir, "invalid-conversation.json");

    await expect(loadClaude(filePath)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("logs success message with count", async () => {
    const testFile = path.join(tempDir, "test-claude-log.json");
    await fs.writeFile(
      testFile,
      JSON.stringify(createValidClaudeData()),
      "utf-8",
    );

    await loadClaude(testFile);

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
        uuid: "conv-789",
        name: null,
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [],
      },
    ];
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    const conversations = await loadClaude(testFile);
    expect(conversations[0]?.title).toBe("Untitled Conversation");
  });

  test("handles old format with role field", async () => {
    const testFile = path.join(tempDir, "old-format.json");
    const data = [
      {
        uuid: "conv-old",
        name: "Old Format",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            uuid: "msg-old",
            role: "user",
            content: "Old format message",
            created_at: "2024-01-01T12:00:00Z",
          },
        ],
      },
    ];
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    const conversations = await loadClaude(testFile);
    const messages = conversations[0]?.messages || [];
    expect(messages[0]?.role).toBe("user");
    expect(messages[0]?.content).toBe("Old format message");
  });

  test("handles content array format", async () => {
    const testFile = path.join(tempDir, "content-array.json");
    const data = [
      {
        uuid: "conv-array",
        name: "Array Content",
        created_at: "2024-01-01T12:00:00Z",
        chat_messages: [
          {
            uuid: "msg-array",
            sender: "human",
            // Use only content field (not text field) for array format
            content: [
              { type: "text", text: "Part 1" },
              { type: "text", text: "Part 2" },
              { type: "other", other: "ignored" },
            ],
            created_at: "2024-01-01T12:00:00Z",
          },
        ],
      },
    ];
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    const conversations = await loadClaude(testFile);
    const messages = conversations[0]?.messages || [];
    expect(messages[0]?.content).toBe("Part 1\nPart 2");
  });

  test("handles invalid date gracefully", async () => {
    const testFile = path.join(tempDir, "invalid-date.json");
    const data = [
      {
        uuid: "conv-bad-date",
        name: "Bad Date",
        created_at: "invalid-date",
        chat_messages: [],
      },
    ];
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    const conversations = await loadClaude(testFile);
    expect(conversations[0]?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("reports skipped fields", async () => {
    const testFile = path.join(tempDir, "extra-fields.json");
    const data = [
      {
        uuid: "conv-extra",
        name: "Test",
        created_at: "2024-01-01T12:00:00Z",
        extra_field: "should be skipped",
        chat_messages: [],
      },
    ];
    await fs.writeFile(testFile, JSON.stringify(data), "utf-8");

    await loadClaude(testFile);

    expect(consoleOutput.some((line) => line.includes("Skipped fields"))).toBe(
      true,
    );
    expect(consoleOutput.some((line) => line.includes("extra_field"))).toBe(
      true,
    );
  });
});
