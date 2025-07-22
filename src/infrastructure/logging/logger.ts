import { type ConsolaInstance, createConsola } from "consola";
import type { Options } from "../../domain/config.js";
import type { ILogger } from "../../domain/interfaces/logger.js";

/**
 * Logger implementation using consola
 *
 * ## Consola Log Levels:
 * - -999: Silent (no output)
 * - 0: Fatal and Error
 * - 1: Warnings
 * - 2: Normal logs
 * - 3: Informational logs, Success, Fail (default)
 * - 4: Debug logs
 * - 5: Trace logs
 * - 999: Verbose
 *
 * ## Environment Variables:
 * - `CONSOLA_LEVEL`: Set log level (e.g., `CONSOLA_LEVEL=5` for debug/trace)
 *
 * ## Output Format:
 * - TTY environment: Colorful output with icons (ℹ, ✔, ⚙, etc.)
 * - Non-TTY/CI environment: Plain text format ([info], [error], etc.)
 *
 * ## CI Environment Behavior:
 * Consola automatically detects CI environments (GitHub Actions, Jenkins, etc.)
 * using the `std-env` library and switches to a basic reporter without colors.
 * You don't need to set `NO_COLOR=1` in CI - it's handled automatically.
 * Detection is based on environment variables like `CI=true`, `GITHUB_ACTIONS=true`, etc.
 *
 * ## Testing Policy:
 * This logger does NOT test log output content. Reasons:
 * - Log output is a side effect that depends on environment settings
 * - Testing log output is fragile and often fails in CI environments
 * - We trust consola to work correctly (no need to test external libraries)
 * - Focus on testing business logic, not logging side effects
 * - Output format varies between TTY/non-TTY/CI environments
 * - Even in test environments, consola may suppress or alter output
 *
 * Tests only verify that logger methods don't throw errors.
 * DO NOT write tests that check log output content - they will be unreliable.
 *
 * @example
 * // Normal execution
 * const logger = new Logger();
 *
 * // Silent mode
 * const logger = new Logger({ quiet: true });
 *
 * // Debug mode (via environment variable)
 * // CONSOLA_LEVEL=5 bun run your-script.js
 */
export class Logger implements ILogger {
  private consola: ConsolaInstance;

  constructor(options?: Partial<Options>) {
    const consolaOptions: Parameters<typeof createConsola>[0] = {};
    if (options?.quiet) {
      consolaOptions.level = -999; // Silent level
    }
    // Note: When CONSOLA_LEVEL env var is set, it overrides the default level
    this.consola = createConsola(consolaOptions);
  }

  // Level 0 - Fatal/Error
  fatal(message: string): void {
    this.consola.fatal(message);
  }

  error(message: string): void {
    this.consola.error(message);
  }

  // Level 1 - Warning
  warn(message: string): void {
    this.consola.warn(message);
  }

  // Level 2 - Log
  log(message: string): void {
    this.consola.log(message);
  }

  // Level 3 - Info/Success/Fail/Box/Start/Ready
  info(message: string): void {
    this.consola.info(message);
  }

  success(message: string): void {
    this.consola.success(message);
  }

  fail(message: string): void {
    this.consola.fail(message);
  }

  box(message: string): void {
    this.consola.box(message);
  }

  start(message: string): void {
    this.consola.start(message);
  }

  ready(message: string): void {
    this.consola.ready(message);
  }

  // Level 4 - Debug
  debug(message: string): void {
    this.consola.debug(message);
  }

  // Level 5 - Trace
  trace(message: string): void {
    this.consola.trace(message);
  }

  // Level Infinity - Verbose
  verbose(message: string): void {
    this.consola.verbose(message);
  }
}
