import { describe, expect, it } from "bun:test";
import {
  generateFileName,
  sanitizeFileNamePreserve,
  sanitizeFileNameStandard,
} from "../../src/utils/filename";

describe("sanitizeFileNameStandard", () => {
  it("keeps alphanumeric and safe characters as-is", () => {
    expect(sanitizeFileNameStandard("test123")).toBe("test123");
    expect(sanitizeFileNameStandard("ABC_xyz-789")).toBe("ABC_xyz-789");
  });

  it("preserves special characters", () => {
    expect(sanitizeFileNameStandard("Hello-World")).toBe("Hello-World");
    expect(sanitizeFileNameStandard("Test_File")).toBe("Test_File");
    expect(sanitizeFileNameStandard("File.Name")).toBe("File.Name");
  });

  it("replaces spaces with underscores", () => {
    expect(sanitizeFileNameStandard("Hello World")).toBe("Hello_World");
  });

  it("replaces dangerous characters", () => {
    expect(sanitizeFileNameStandard("file/name")).toBe("file_name");
    expect(sanitizeFileNameStandard("test:file")).toBe("test_file");
    expect(sanitizeFileNameStandard('test"file')).toBe("test_file");
    expect(sanitizeFileNameStandard("test|file")).toBe("test_file");
  });

  it("removes leading and trailing dots", () => {
    expect(sanitizeFileNameStandard(".hidden")).toBe("hidden");
    expect(sanitizeFileNameStandard("file.")).toBe("file");
    expect(sanitizeFileNameStandard("...file...")).toBe("file");
  });

  it("replaces consecutive spaces with single underscore", () => {
    expect(sanitizeFileNameStandard("hello   world")).toBe("hello_world");
  });
});

describe("sanitizeFileNamePreserve", () => {
  it("preserves Japanese characters", () => {
    expect(sanitizeFileNamePreserve("日本語のテスト")).toBe("日本語のテスト");
    expect(sanitizeFileNamePreserve("こんにちは世界")).toBe("こんにちは世界");
    expect(sanitizeFileNamePreserve("カタカナテスト")).toBe("カタカナテスト");
  });

  it("preserves other Unicode characters", () => {
    expect(sanitizeFileNamePreserve("Hello 世界")).toBe("Hello_世界");
    expect(sanitizeFileNamePreserve("Test 文件 File")).toBe("Test_文件_File");
    expect(sanitizeFileNamePreserve("🎌 日本")).toBe("🎌_日本");
  });

  it("encodes dangerous characters", () => {
    expect(sanitizeFileNamePreserve("file/name")).toBe("file%2Fname");
    expect(sanitizeFileNamePreserve("test:file")).toBe("test%3Afile");
    expect(sanitizeFileNamePreserve('test"file')).toBe("test%22file");
    expect(sanitizeFileNamePreserve("明日の天気は？")).toBe("明日の天気は？");
  });

  it("handles mixed content", () => {
    expect(sanitizeFileNamePreserve("SwiftUI:ナビゲーション")).toBe(
      "SwiftUI%3Aナビゲーション",
    );
    expect(sanitizeFileNamePreserve("React/Vue比較")).toBe("React%2FVue比較");
  });
});

describe("generateFileName", () => {
  it("generates filename in standard mode", () => {
    expect(
      generateFileName(new Date("2025-01-01"), "Hello World", "standard"),
    ).toBe("2025-01-01_Hello_World.md");
    expect(
      generateFileName(new Date("2025-01-01"), "Test File", "standard"),
    ).toBe("2025-01-01_Test_File.md");
    expect(generateFileName(new Date("2025-01-01"), "test/file")).toBe(
      "2025-01-01_test_file.md",
    );
  });

  it("generates filename in preserve mode with Japanese", () => {
    expect(
      generateFileName(new Date("2025-01-01"), "日本語のテスト", "preserve"),
    ).toBe("2025-01-01_日本語のテスト.md");
    expect(
      generateFileName(new Date("2025-01-01"), "こんにちは世界", "preserve"),
    ).toBe("2025-01-01_こんにちは世界.md");
    expect(
      generateFileName(new Date("2025-01-01"), "明日の天気は？", "preserve"),
    ).toBe("2025-01-01_明日の天気は？.md");
  });

  it("truncates long titles", () => {
    const longTitle = "a".repeat(250);
    const result = generateFileName(new Date("2025-01-01"), longTitle);
    expect(result.length).toBeLessThanOrEqual(210); // date + _ + 200 chars + .md
  });

  it("safely handles titles with special characters", () => {
    expect(
      generateFileName(new Date("2025-01-01"), "test/file:name|test"),
    ).toBe("2025-01-01_test_file_name_test.md");
  });

  it("defaults to standard encoding", () => {
    expect(generateFileName(new Date("2025-01-01"), "test/file")).toBe(
      "2025-01-01_test_file.md",
    );
  });
});
