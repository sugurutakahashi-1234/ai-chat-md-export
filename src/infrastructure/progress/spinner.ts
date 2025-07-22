import ora, { type Ora } from "ora";
import type { Options } from "../../domain/config.js";
import type { ILogger } from "../../domain/interfaces/logger.js";
import type { ISpinner } from "../../domain/interfaces/spinner.js";

/**
 * Spinner implementation using ora
 *
 * ## TTY Detection:
 * - `process.stdout.isTTY` checks if the output is an interactive terminal
 * - TTY = true: Interactive terminal (human is using it directly)
 * - TTY = false/undefined: Non-interactive (pipes, redirects, CI environments)
 *
 * ## Why TTY check is necessary:
 * - Spinners use terminal cursor control for animation
 * - In non-TTY environments, cursor control doesn't work
 * - Without TTY check, output becomes garbled text in CI/pipes
 * - We fallback to logger for clean output in non-TTY environments
 *
 * ## Note:
 * Although ora library also checks TTY internally, we check explicitly to:
 * - Control fallback behavior (use logger instead)
 * - Make the code's intent clear
 * - Ensure clean output in all environments
 */
export class Spinner implements ISpinner {
  private ora: Ora | null = null;

  constructor(
    private readonly logger: ILogger,
    private readonly options?: Partial<Options>,
  ) {}

  start(text?: string): void {
    if (this.options?.quiet) return;

    // Stop any existing spinner
    if (this.ora) {
      this.ora.stop();
    }

    // Create new spinner
    this.ora = ora({
      text: text || "Processing...",
      spinner: "dots",
      color: "cyan",
      stream: process.stdout,
    });

    if (process.stdout.isTTY) {
      this.ora.start();
    } else {
      // In non-TTY environment, fallback to logger if available
      if (text) {
        this.logger.info(text);
      }
    }
  }

  update(text: string): void {
    if (this.ora && process.stdout.isTTY) {
      this.ora.text = text;
    }
    // In non-TTY environment, do not output updates to avoid spam
  }

  succeed(text?: string): void {
    if (this.ora && process.stdout.isTTY) {
      this.ora.succeed(text);
      this.ora = null;
    } else if (!this.options?.quiet && text) {
      this.logger.success(text);
    }
  }

  fail(text?: string): void {
    if (this.ora && process.stdout.isTTY) {
      this.ora.fail(text);
      this.ora = null;
    } else if (!this.options?.quiet && text) {
      this.logger.error(text);
    }
  }

  stop(): void {
    if (this.ora) {
      this.ora.stop();
      this.ora = null;
    }
  }
}
