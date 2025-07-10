import { describe, expect, test } from "bun:test";
import { main } from "../../src/cli.js";

describe("CLI main function", () => {
  test("main function exists and is a function", () => {
    expect(main).toBeDefined();
    expect(typeof main).toBe("function");
  });

  // Note: More comprehensive CLI tests are in the integration tests
  // The main function is primarily tested through integration tests
  // since it involves command-line argument parsing and file system operations
});
