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

describe("loadClaude", () => {
  const fixturesDir = path.join(process.cwd(), "tests/fixtures/claude");

  test("loads valid Claude conversation", async () => {
    const filePath = path.join(fixturesDir, "valid-conversation.json");
    const conversations = await loadClaude(filePath);

    expect(conversations).toHaveLength(1);
    const conv = conversations[0];
    expect(conv).toBeDefined();
    expect(conv).toHaveProperty("id", "test-uuid-123");
    expect(conv).toHaveProperty("title", "Test Claude Conversation");
    expect(conv).toHaveProperty("date", "2024-01-01");
    expect(conv?.messages).toHaveLength(2);
  });

  test("extracts messages with correct roles", async () => {
    const filePath = path.join(fixturesDir, "valid-conversation.json");
    const conversations = await loadClaude(filePath);
    const messages = conversations[0]?.messages || [];

    expect(messages[0]?.role).toBe("user");
    expect(messages[0]?.content).toBe("Hello, Claude!");

    expect(messages[1]?.role).toBe("assistant");
    expect(messages[1]?.content).toBe("Hello! How can I assist you today?");
  });

  test("handles missing file", async () => {
    const filePath = path.join(fixturesDir, "non-existent.json");

    await expect(loadClaude(filePath)).rejects.toThrow();
  });

  test("handles invalid JSON", async () => {
    const tempFile = path.join(fixturesDir, "temp-invalid.json");
    await fs.writeFile(tempFile, "{ invalid json", "utf-8");

    try {
      await expect(loadClaude(tempFile)).rejects.toThrow();
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles non-array data", async () => {
    const tempFile = path.join(fixturesDir, "temp-not-array.json");
    await fs.writeFile(tempFile, '{"not": "an array"}', "utf-8");

    try {
      await expect(loadClaude(tempFile)).rejects.toThrow(
        "Claude export data must be an array",
      );
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles schema validation errors", async () => {
    const filePath = path.join(fixturesDir, "invalid-conversation.json");

    await expect(loadClaude(filePath)).rejects.toThrow(
      "Schema validation error",
    );
  });

  test("logs success message with count", async () => {
    const filePath = path.join(fixturesDir, "valid-conversation.json");
    await loadClaude(filePath);

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
        uuid: "test-123",
        name: null, // name is required but can be null
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [],
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      const conversations = await loadClaude(tempFile);
      expect(conversations[0]?.title).toBe("Untitled Conversation");
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles old format with role field", async () => {
    const tempFile = path.join(fixturesDir, "temp-old-format.json");
    const data = [
      {
        uuid: "test-123",
        name: "Test",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [
          {
            role: "user",
            content: "Hello",
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      const conversations = await loadClaude(tempFile);
      expect(conversations[0]?.messages[0]?.role).toBe("user");
      expect(conversations[0]?.messages[0]?.content).toBe("Hello");
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles content array format", async () => {
    const tempFile = path.join(fixturesDir, "temp-content-array.json");
    const data = [
      {
        uuid: "test-123",
        name: "Test",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [
          {
            sender: "assistant",
            content: [
              { type: "text", text: "Part 1" },
              { type: "text", text: "Part 2" },
            ],
            created_at: "2024-01-01T00:00:00Z",
          },
        ],
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      const conversations = await loadClaude(tempFile);
      const content = conversations[0]?.messages[0]?.content || "";
      expect(content).toBe("Part 1\nPart 2");
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("handles invalid date gracefully", async () => {
    const tempFile = path.join(fixturesDir, "temp-invalid-date.json");
    const data = [
      {
        uuid: "test-123",
        name: "Test",
        created_at: "invalid-date",
        chat_messages: [],
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      const conversations = await loadClaude(tempFile);
      // Should use current date as fallback
      expect(conversations[0]?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    } finally {
      await fs.unlink(tempFile);
    }
  });

  test("reports skipped fields", async () => {
    const tempFile = path.join(fixturesDir, "temp-extra-fields.json");
    const data = [
      {
        uuid: "test-123",
        name: "Test",
        created_at: "2024-01-01T00:00:00Z",
        chat_messages: [],
        extra_field_1: "value1",
        extra_field_2: "value2",
      },
    ];
    await fs.writeFile(tempFile, JSON.stringify(data), "utf-8");

    try {
      await loadClaude(tempFile);
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
