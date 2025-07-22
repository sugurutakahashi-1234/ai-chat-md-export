import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { Logger } from "./logger.js";

describe("Logger", () => {
  let originalIsTTY: boolean | undefined;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    originalIsTTY = process.stdout.isTTY;
    // Mock console methods to prevent actual output during tests
    consoleLogSpy = spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.stdout.isTTY = originalIsTTY as boolean;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("Spinner Methods", () => {
    it("should not create spinner in quiet mode", () => {
      const logger = new Logger({ quiet: true });
      logger.startSpinner("Processing");

      // In quiet mode, nothing should happen
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should log text when not TTY", () => {
      process.stdout.isTTY = false;
      const logger = new Logger();

      logger.startSpinner("Processing files");

      // Should fallback to regular logging
      expect(consoleLogSpy).toHaveBeenCalledWith("Processing files");
    });

    it("should log updates when not TTY", () => {
      process.stdout.isTTY = false;
      const logger = new Logger();

      logger.updateSpinner("Updated text");

      expect(consoleLogSpy).toHaveBeenCalledWith("Updated text");
    });

    it("should use success method when spinner succeeds in non-TTY", () => {
      process.stdout.isTTY = false;
      const logger = new Logger();

      logger.succeedSpinner("Task completed");

      expect(consoleLogSpy).toHaveBeenCalledWith("✓ Task completed");
    });

    it("should use error method when spinner fails in non-TTY", () => {
      process.stdout.isTTY = false;
      const logger = new Logger();

      logger.failSpinner("Task failed");

      expect(consoleErrorSpy).toHaveBeenCalledWith("✗ Task failed");
    });
  });

  describe("Interface implementation", () => {
    it("should implement all ILogger spinner methods", () => {
      const logger = new Logger();

      // Check all required spinner methods exist
      expect(typeof logger.startSpinner).toBe("function");
      expect(typeof logger.updateSpinner).toBe("function");
      expect(typeof logger.succeedSpinner).toBe("function");
      expect(typeof logger.failSpinner).toBe("function");
      expect(typeof logger.stopSpinner).toBe("function");
    });
  });
});
