import { createPlatformParser } from "../parsers/parser-factory.js";
import { createLogger } from "../utils/logger.js";
import type { PlatformParser } from "./interfaces/platform-parser.js";
import { FileLoader } from "./io/file-loader.js";
import { FileWriter } from "./io/file-writer.js";
import type { ProcessorDependencies } from "./processor-dependencies.js";

/**
 * Create default dependencies for the Processor
 *
 * This factory provides the standard implementations
 * for all processor dependencies.
 */
export function createDefaultDependencies(): ProcessorDependencies {
  return {
    fileLoader: new FileLoader(),
    fileWriter: new FileWriter(),
    parserFactory: createPlatformParser as (platform: string) => PlatformParser,
    loggerFactory: createLogger,
  };
}

/**
 * Create dependencies with partial overrides
 *
 * Useful for testing or custom configurations where
 * only specific dependencies need to be replaced.
 *
 * @param overrides Partial dependencies to override defaults
 * @returns Complete processor dependencies
 */
export function createDefaultDependenciesWithOverrides(
  overrides?: Partial<ProcessorDependencies>,
): ProcessorDependencies {
  const defaults = createDefaultDependencies();
  return {
    ...defaults,
    ...overrides,
  };
}
