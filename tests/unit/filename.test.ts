import { describe, expect, it } from "bun:test";
import {
  generateFileName,
  sanitizeFileName,
  sanitizeFileNameSimple,
  sanitizeFileNameUnicode,
} from "../../src/utils/filename";

describe("sanitizeFileName", () => {
  it("keeps alphanumeric characters as-is", () => {
    expect(sanitizeFileName("test123")).toBe("test123");
    expect(sanitizeFileName("ABC_xyz-789")).toBe("ABC_xyz-789");
  });

  it("replaces spaces with underscores", () => {
    expect(sanitizeFileName("hello world")).toBe("hello_world");
  });

  it("URL encodes non-ASCII characters", () => {
    expect(sanitizeFileName("Hello World")).toBe("Hello_World");
    expect(sanitizeFileName("Test-File")).toBe("Test-File");
  });

  it("URL encodes unsafe characters", () => {
    expect(sanitizeFileName("Hello?World")).toBe("Hello%3FWorld");
  });

  it("URL encodes special characters", () => {
    expect(sanitizeFileName("file/name")).toBe("file%2Fname");
    expect(sanitizeFileName("test:file")).toBe("test%3Afile");
  });
});

describe("sanitizeFileNameSimple", () => {
  it("keeps alphanumeric and safe characters as-is", () => {
    expect(sanitizeFileNameSimple("test123")).toBe("test123");
    expect(sanitizeFileNameSimple("ABC_xyz-789")).toBe("ABC_xyz-789");
  });

  it("preserves special characters", () => {
    expect(sanitizeFileNameSimple("Hello-World")).toBe("Hello-World");
    expect(sanitizeFileNameSimple("Test_File")).toBe("Test_File");
    expect(sanitizeFileNameSimple("File.Name")).toBe("File.Name");
  });

  it("replaces spaces with underscores", () => {
    expect(sanitizeFileNameSimple("Hello World")).toBe("Hello_World");
  });

  it("replaces dangerous characters", () => {
    expect(sanitizeFileNameSimple("file/name")).toBe("file_name");
    expect(sanitizeFileNameSimple("test:file")).toBe("test_file");
    expect(sanitizeFileNameSimple('test"file')).toBe("test_file");
    expect(sanitizeFileNameSimple("test|file")).toBe("test_file");
  });

  it("removes leading and trailing dots", () => {
    expect(sanitizeFileNameSimple(".hidden")).toBe("hidden");
    expect(sanitizeFileNameSimple("file.")).toBe("file");
    expect(sanitizeFileNameSimple("...file...")).toBe("file");
  });

  it("replaces consecutive spaces with single underscore", () => {
    expect(sanitizeFileNameSimple("hello   world")).toBe("hello_world");
  });
});

describe("sanitizeFileNameUnicode", () => {
  it("preserves Japanese characters", () => {
    expect(sanitizeFileNameUnicode("日本語のテスト")).toBe("日本語のテスト");
    expect(sanitizeFileNameUnicode("こんにちは世界")).toBe("こんにちは世界");
    expect(sanitizeFileNameUnicode("カタカナテスト")).toBe("カタカナテスト");
  });

  it("preserves other Unicode characters", () => {
    expect(sanitizeFileNameUnicode("Hello 世界")).toBe("Hello_世界");
    expect(sanitizeFileNameUnicode("Test 文件 File")).toBe("Test_文件_File");
    expect(sanitizeFileNameUnicode("🎌 日本")).toBe("🎌_日本");
  });

  it("encodes dangerous characters", () => {
    expect(sanitizeFileNameUnicode("file/name")).toBe("file%2Fname");
    expect(sanitizeFileNameUnicode("test:file")).toBe("test%3Afile");
    expect(sanitizeFileNameUnicode('test"file')).toBe("test%22file");
    expect(sanitizeFileNameUnicode("明日の天気は？")).toBe("明日の天気は%EF%BC%9F");
  });

  it("handles mixed content", () => {
    expect(sanitizeFileNameUnicode("SwiftUI:ナビゲーション")).toBe(
      "SwiftUI%3Aナビゲーション",
    );
    expect(sanitizeFileNameUnicode("React/Vue比較")).toBe("React%2FVue比較");
  });
});

describe("generateFileName", () => {
  it("generates filename in URL-safe mode", () => {
    expect(generateFileName("2025-01-01", "Hello World", "url-safe")).toBe(
      "2025-01-01_Hello_World.md",
    );
    expect(generateFileName("2025-01-01", "Test File", "url-safe")).toBe(
      "2025-01-01_Test_File.md",
    );
  });

  it("generates filename in simple mode", () => {
    expect(generateFileName("2025-01-01", "Hello World", "simple")).toBe(
      "2025-01-01_Hello_World.md",
    );
    expect(generateFileName("2025-01-01", "Test File", "simple")).toBe(
      "2025-01-01_Test_File.md",
    );
  });

  it("generates filename in unicode mode with Japanese", () => {
    expect(generateFileName("2025-01-01", "日本語のテスト", "unicode")).toBe(
      "2025-01-01_日本語のテスト.md",
    );
    expect(generateFileName("2025-01-01", "こんにちは世界", "unicode")).toBe(
      "2025-01-01_こんにちは世界.md",
    );
    expect(generateFileName("2025-01-01", "明日の天気は？", "unicode")).toBe(
      "2025-01-01_明日の天気は%EF%BC%9F.md",
    );
  });

  it("truncates long titles", () => {
    const longTitle = "a".repeat(250);
    const result = generateFileName("2025-01-01", longTitle);
    expect(result.length).toBeLessThanOrEqual(210); // date + _ + 200 chars + .md
  });

  it("safely handles titles with special characters", () => {
    expect(generateFileName("2025-01-01", "test/file:name|test")).toBe(
      "2025-01-01_test%2Ffile%3Aname%7Ctest.md",
    );
  });

  it("defaults to unicode encoding", () => {
    expect(generateFileName("2025-01-01", "日本語")).toBe(
      "2025-01-01_日本語.md",
    );
  });
});
