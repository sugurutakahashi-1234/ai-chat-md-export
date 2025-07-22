import { describe, expect, it } from "bun:test";
import { Logger } from "./logger.js";

describe("Logger", () => {
  describe("Quiet mode", () => {
    it("should not throw in quiet mode", () => {
      const logger = new Logger({ quiet: true });

      // quietモードでもロガーは正常に動作することを確認
      expect(() => {
        logger.fatal("test");
        logger.error("test");
        logger.warn("test");
        logger.log("test");
        logger.info("test");
        logger.success("test");
        logger.fail("test");
        logger.box("test");
        logger.start("test");
        logger.ready("test");
        logger.debug("test");
        logger.trace("test");
        logger.verbose("test");
      }).not.toThrow();
    });
  });

  describe("Logger creation", () => {
    it("should create logger with default options", () => {
      const logger = new Logger();
      expect(logger).toBeDefined();
    });

    it("should create logger with options", () => {
      const logger = new Logger({ quiet: false });
      expect(logger).toBeDefined();
    });
  });
});
