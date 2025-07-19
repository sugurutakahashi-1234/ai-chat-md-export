import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import pc from "picocolors";
import { main } from "../../src/cli.js";
import { Processor } from "../../src/core/processor.js";

describe("CLI main function", () => {
  let originalArgv: string[];
  let originalExit: typeof process.exit;
  let consoleErrorSpy: ReturnType<typeof spyOn>;
  let consoleLogSpy: ReturnType<typeof spyOn>;
  let processInputSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Save original values
    originalArgv = process.argv;
    originalExit = process.exit;

    // Mock process.exit to prevent test runner from exiting
    process.exit = mock(() => {}) as never;

    // Spy on console.error and console.log
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = spyOn(console, "log").mockImplementation(() => {});

    // Spy on Processor.prototype.processInput
    processInputSpy = spyOn(
      Processor.prototype,
      "processInput",
    ).mockResolvedValue();
  });

  afterEach(() => {
    // Restore original values
    process.argv = originalArgv;
    process.exit = originalExit;
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    processInputSpy.mockRestore();
  });

  test("processes valid input arguments", async () => {
    process.argv = [
      "node",
      "cli.js",
      "-i",
      "test.json",
      "-o",
      "output",
      "-p",
      "chatgpt",
    ];

    await main();

    expect(processInputSpy).toHaveBeenCalledWith({
      input: "test.json",
      output: "output",
      platform: "chatgpt",
      since: undefined,
      until: undefined,
      search: undefined,
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
    });
  });

  test("uses default values when optional arguments are not provided", async () => {
    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    expect(processInputSpy).toHaveBeenCalledWith({
      input: "test.json",
      output: undefined,
      platform: "auto",
      since: undefined,
      until: undefined,
      search: undefined,
      quiet: false,
      dryRun: false,
      filenameEncoding: "standard",
      format: "markdown",
      split: true,
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
      "json",
      "--no-split",
      "--since",
      "2023-01-01",
      "--until",
      "2023-12-31",
      "--search",
      "test",
      "-p",
      "claude",
      "-q",
      "--dry-run",
      "--filename-encoding",
      "preserve",
    ];

    await main();

    expect(processInputSpy).toHaveBeenCalledWith({
      input: "test.json",
      output: "output",
      format: "json",
      split: false,
      since: "2023-01-01",
      until: "2023-12-31",
      search: "test",
      platform: "claude",
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
      pc.red(pc.bold("✗ Test error message")),
    );
  });

  test("handles non-Error exceptions", async () => {
    processInputSpy.mockRejectedValueOnce("String error");

    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      pc.red(pc.bold("✗ String error")),
    );
  });

  test("handles unknown error types", async () => {
    processInputSpy.mockRejectedValueOnce({ unknown: "error" });

    process.argv = ["node", "cli.js", "-i", "test.json"];

    await main();

    // The error formatter adds "Unexpected error object: " prefix for objects
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      pc.red(pc.bold('✗ Unexpected error object: {\n  "unknown": "error"\n}')),
    );
  });

  test("shows friendly error when input is missing", async () => {
    process.argv = ["node", "cli.js"];

    // CommanderError is thrown despite exitOverride, so we need to catch it
    try {
      await main();
    } catch {
      // Expected to throw CommanderError
    }

    // Check that the exit mock was called with the correct code
    expect(process.exit).toHaveBeenCalledWith(1);

    // The error message is handled by logger.error in cli.ts
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      pc.red(pc.bold("✗ Input file is required.")),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "\nTry 'ai-chat-md-export --help' for usage information.\n",
    );
  });
});
