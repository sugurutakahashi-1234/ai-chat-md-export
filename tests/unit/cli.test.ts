import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  detectFormat,
  type Options,
  processDirectory,
  processFile,
  processInput,
} from "../../src/cli.js";

describe("detectFormat", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/cli-main");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("detects ChatGPT format", async () => {
    const filePath = path.join(tempDir, "chatgpt.json");
    const chatgptData = [{ mapping: {}, title: "Test" }];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const format = await detectFormat(filePath);
    expect(format).toBe("chatgpt");
  });

  test("detects Claude format", async () => {
    const filePath = path.join(tempDir, "claude.json");
    const claudeData = [{ chat_messages: [], uuid: "test-uuid" }];
    await fs.writeFile(filePath, JSON.stringify(claudeData), "utf-8");

    const format = await detectFormat(filePath);
    expect(format).toBe("claude");
  });

  test("throws error for unknown format", async () => {
    const filePath = path.join(tempDir, "unknown.json");
    const unknownData = [{ someField: "value" }];
    await fs.writeFile(filePath, JSON.stringify(unknownData), "utf-8");

    await expect(detectFormat(filePath)).rejects.toThrow(
      "Cannot detect file format",
    );
  });

  test("throws error for invalid JSON", async () => {
    const filePath = path.join(tempDir, "invalid.json");
    await fs.writeFile(filePath, "not valid json", "utf-8");

    await expect(detectFormat(filePath)).rejects.toThrow(
      "Cannot detect file format",
    );
  });
});

describe("processInput", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/cli-main-input");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("processes file input", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Hello"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test Conversation",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      format: "auto",
      quiet: true,
      dryRun: true,
    };

    // processInputは内部でprocessFileを呼び出すので、エラーなく実行されることを確認
    await expect(processInput(options)).resolves.toBeUndefined();
  });

  test("processes directory input", async () => {
    const dirPath = path.join(tempDir, "testdir");
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Hello"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test Conversation",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: dirPath,
      format: "auto",
      quiet: true,
      dryRun: true,
    };

    await expect(processInput(options)).resolves.toBeUndefined();
  });

  test("throws error for invalid input path", async () => {
    const invalidPath = path.join(tempDir, "nonexistent");

    const options: Options = {
      input: invalidPath,
      format: "auto",
      quiet: true,
      dryRun: true,
    };

    await expect(processInput(options)).rejects.toThrow();
  });
});

describe("processFile", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/cli-main-process");
  const outputDir = path.join(tempDir, "output");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("processes ChatGPT file successfully", async () => {
    const filePath = path.join(tempDir, "chatgpt.json");
    const chatgptData = [
      {
        mapping: {
          "msg-1": {
            id: "msg-1",
            message: {
              id: "msg-1",
              author: { role: "assistant" },
              create_time: 1704067200,
              content: {
                content_type: "text",
                parts: ["Hello, how can I help you?"],
              },
            },
            parent: null,
            children: ["msg-2"],
          },
          "msg-2": {
            id: "msg-2",
            message: {
              id: "msg-2",
              author: { role: "user" },
              create_time: 1704067201,
              content: {
                content_type: "text",
                parts: ["I need help with Python"],
              },
            },
            parent: "msg-1",
            children: [],
          },
        },
        title: "Python Help",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      format: "chatgpt",
      quiet: true,
      dryRun: false,
    };

    await processFile(filePath, outputDir, options);

    // ファイルが作成されたことを確認
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles.length).toBeGreaterThan(0);
    expect(outputFiles[0]).toMatch(/\.md$/);
  });

  test("processes Claude file successfully", async () => {
    const filePath = path.join(tempDir, "claude.json");
    const claudeData = [
      {
        chat_messages: [
          {
            uuid: "msg-1",
            sender: "human",
            text: "Hello Claude",
            created_at: "2024-01-01T00:00:00.000Z",
          },
          {
            uuid: "msg-2",
            sender: "assistant",
            text: "Hello! How can I help you today?",
            created_at: "2024-01-01T00:00:01.000Z",
          },
        ],
        uuid: "conv-1",
        name: "Claude Test",
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(claudeData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      format: "claude",
      quiet: true,
      dryRun: false,
    };

    await processFile(filePath, outputDir, options);

    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles.length).toBeGreaterThan(0);
  });

  test("respects dry-run option", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Test"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      format: "auto",
      quiet: true,
      dryRun: true,
    };

    await processFile(filePath, outputDir, options);

    // ファイルが作成されていないことを確認
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(0);
  });

  test("filters by date range", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1701388800, // 2023-12-01
              content: { content_type: "text", parts: ["Old"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Old Conversation",
        create_time: 1701388800,
      },
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1705795200, // 2024-01-21
              content: { content_type: "text", parts: ["In Range"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "In Range Conversation",
        create_time: 1705795200,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      format: "auto",
      quiet: true,
      dryRun: false,
      since: "2024-01-01",
      until: "2024-01-31",
    };

    await processFile(filePath, outputDir, options);

    // 日付範囲内の会話のみが処理されることを確認
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
  });

  test("filters by search keyword", async () => {
    const filePath = path.join(tempDir, "test.json");
    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Teach me Python"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Python Tutorial",
        create_time: 1704067200,
      },
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1704067201,
              content: { content_type: "text", parts: ["JavaScript basics"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "JavaScript Guide",
        create_time: 1704067201,
      },
    ];
    await fs.writeFile(filePath, JSON.stringify(chatgptData), "utf-8");

    const options: Options = {
      input: filePath,
      output: outputDir,
      format: "auto",
      quiet: true,
      dryRun: false,
      search: "python",
    };

    await processFile(filePath, outputDir, options);

    // "python"を含む会話のみが処理されることを確認
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles).toHaveLength(1);
  });
});

describe("processDirectory", () => {
  const tempDir = path.join(process.cwd(), "tests/temp/cli-main-dir");
  const outputDir = path.join(tempDir, "output");

  beforeEach(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("processes all JSON files in directory", async () => {
    // 複数のJSONファイルを作成
    const file1 = path.join(tempDir, "file1.json");
    const file2 = path.join(tempDir, "file2.json");
    const nonJsonFile = path.join(tempDir, "readme.txt");

    const chatgptData = [
      {
        mapping: {
          "1": {
            id: "1",
            message: {
              id: "1",
              author: { role: "user" },
              create_time: 1704067200,
              content: { content_type: "text", parts: ["Test"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test",
        create_time: 1704067200,
      },
    ];
    await fs.writeFile(file1, JSON.stringify(chatgptData), "utf-8");

    // file2用に異なるデータを作成
    const chatgptData2 = [
      {
        mapping: {
          "2": {
            id: "2",
            message: {
              id: "2",
              author: { role: "user" },
              create_time: 1704153600, // 異なる時刻
              content: { content_type: "text", parts: ["Test 2"] },
            },
            parent: null,
            children: [],
          },
        },
        title: "Test 2",
        create_time: 1704153600,
      },
    ];
    await fs.writeFile(file2, JSON.stringify(chatgptData2), "utf-8");
    await fs.writeFile(nonJsonFile, "This is not JSON", "utf-8");

    const options: Options = {
      input: tempDir,
      output: outputDir,
      format: "auto",
      quiet: true,
      dryRun: false,
    };

    await processDirectory(tempDir, outputDir, options);

    // 2つのJSONファイルが処理されたことを確認
    const outputFiles = await fs.readdir(outputDir);
    expect(outputFiles.length).toBe(2);
  });

  test("handles empty directory gracefully", async () => {
    const emptyDir = path.join(tempDir, "empty");
    await fs.mkdir(emptyDir, { recursive: true });

    const options: Options = {
      input: emptyDir,
      output: outputDir,
      format: "auto",
      quiet: true,
      dryRun: false,
    };

    // エラーなく実行されることを確認
    await expect(
      processDirectory(emptyDir, outputDir, options),
    ).resolves.toBeUndefined();
  });
});
