import { describe, expect, it } from "bun:test";
import { Logger } from "../logging/logger.js";
import { Spinner } from "./spinner.js";

describe("Spinner", () => {
  const logger = new Logger({ quiet: true });

  describe("Spinner behavior", () => {
    it("should not throw in quiet mode", () => {
      const spinner = new Spinner(logger, { quiet: true });

      expect(() => {
        spinner.start("Processing");
        spinner.update("Updated");
        spinner.succeed("Done");
        spinner.fail("Failed");
        spinner.stop();
      }).not.toThrow();
    });
  });
});
