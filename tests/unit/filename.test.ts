import { describe, expect, it } from "bun:test";
import {
  generateFileName,
  sanitizeFileName,
  sanitizeFileNameSimple,
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
    expect(sanitizeFileName("Hello World")).toBe(
      "Hello_World",
    );
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

describe("generateFileName", () => {
  it("generates filename in URL-safe mode", () => {
    expect(generateFileName("2025-01-01", "Hello World")).toBe(
      "2025-01-01_Hello_World.md",
    );
    expect(generateFileName("2025-01-01", "Test File")).toBe(
      "2025-01-01_Test_File.md",
    );
  });

  it("generates filename in simple mode", () => {
    expect(generateFileName("2025-01-01", "Hello World", false)).toBe(
      "2025-01-01_Hello_World.md",
    );
    expect(generateFileName("2025-01-01", "Test File", false)).toBe(
      "2025-01-01_Test_File.md",
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
});
