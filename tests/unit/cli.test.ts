import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import { main } from "../../src/cli.js";
import * as processor from "../../src/core/processor.js";

describe("CLI main function", () => {
  let originalArgv: string[];
  let originalExit: typeof process.exit;
  let consoleErrorSpy: ReturnType<typeof spyOn>;
  let processInputSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Save original values
    originalArgv = process.argv;
    originalExit = process.exit;

    // Mock process.exit to prevent test runner from exiting
    process.exit = mock(() => {}) as never;

    // Spy on console.error
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});

    // Spy on processInput
    processInputSpy = spyOn(processor, "processInput").mockResolvedValue();
  });

  afterEach(() => {
    // Restore original values
    process.argv = originalArgv;
    process.exit = originalExit;
    consoleErrorSpy.mockRestore();
    processInputSpy.mockRestore();
  });

  test("main function exists and is a function", () => {
    expect(main).toBeDefined();
    expect(typeof main).toBe("function");
  });

  test("processes valid input arguments", async () => {
    process.argv = [
      "node",
      "cli.js",
      "-i",
      "test.json",
      "-o",
      "output",
      "-f",
      "chatgpt",
    ];

    await main();

    expect(processInputSpy).toHaveBeenCalledWith({
      input: "test.json",
      output: "output",
      format: "chatgpt",
      since: undefined,
      until: undefined,
      search: undefined,
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
    });
  });

  test("uses default values when optional arguments are not provided", async () => {
    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    expect(processInputSpy).toHaveBeenCalledWith({
      input: "test.json",
      output: undefined,
      format: "auto",
      since: undefined,
      until: undefined,
      search: undefined,
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
    });
  });

  test("handles all CLI options", async () => {
    process.argv = [
      "node",
      "cli.js",
      "-i",
      "test.json",
      "-o",
      "output",
      "-f",
      "claude",
      "--since",
      "2024-01-01",
      "--until",
      "2024-12-31",
      "--search",
      "test keyword",
      "--quiet",
      "--dry-run",
      "--filename-encoding",
      "preserve",
    ];

    await main();

    expect(processInputSpy).toHaveBeenCalledWith({
      input: "test.json",
      output: "output",
      format: "claude",
      since: "2024-01-01",
      until: "2024-12-31",
      search: "test keyword",
      quiet: true,
      dryRun: true,
      filenameEncoding: "preserve",
    });
  });

  test("handles processInput errors gracefully", async () => {
    const testError = new Error("Test error message");
    processInputSpy.mockRejectedValueOnce(testError);

    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error:",
      "Test error message",
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test("handles non-Error exceptions", async () => {
    processInputSpy.mockRejectedValueOnce("String error");

    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", "String error");
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test("handles unknown error types", async () => {
    processInputSpy.mockRejectedValueOnce({ unknown: "error" });

    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error:",
      "An unknown error occurred",
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
