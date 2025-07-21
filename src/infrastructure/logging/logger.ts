import pc from "picocolors";
import type { ILogger } from "../../domain/interfaces/logger.js";

enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Success = "success",
  Debug = "debug",
}

interface LoggerOptions {
  quiet?: boolean;
}

export class Logger implements ILogger {
  constructor(private options: LoggerOptions = {}) {}

  private shouldLog(level: LogLevel): boolean {
    if (this.options.quiet && level !== LogLevel.Error) return false;
    return true;
  }

  private format(level: LogLevel, message: string): string {
    // Check NO_COLOR environment variable (industry standard)
    // biome-ignore lint/complexity/useLiteralKeys: TypeScript's noUncheckedIndexedAccess requires bracket notation
    const noColorEnv = process.env["NO_COLOR"];
    const hasNoColor = noColorEnv !== undefined && noColorEnv !== "";

    // NO_COLOR takes precedence
    if (hasNoColor) return message;

    // Otherwise check TTY
    const useColor = process.stdout.isTTY;
    if (!useColor) return message;

    const formatters: Record<LogLevel, (s: string) => string> = {
      [LogLevel.Error]: (s) => pc.red(pc.bold(s)),
      [LogLevel.Warn]: (s) => pc.yellow(s),
      [LogLevel.Info]: (s) => s, // no color for info
      [LogLevel.Success]: (s) => pc.green(s),
      [LogLevel.Debug]: (s) => pc.gray(s),
    };

    return formatters[level](message);
  }

  log(level: LogLevel, message: string): void {
    if (!this.shouldLog(level)) return;

    const formatted = this.format(level, message);

    // error goes to stderr, others to stdout
    if (level === LogLevel.Error) {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }

  // Simple method wrappers
  error(message: string): void {
    this.log(LogLevel.Error, `✗ ${message}`);
  }

  warn(message: string): void {
    this.log(LogLevel.Warn, `⚠ ${message}`);
  }

  info(message: string): void {
    this.log(LogLevel.Info, message);
  }

  success(message: string): void {
    this.log(LogLevel.Success, `✓ ${message}`);
  }

  section(title: string): void {
    this.log(LogLevel.Info, `\n${pc.bold(pc.blue(title))}`);
  }

  // Progress display (special handling)
  progress(current: number, total: number, item: string): void {
    this.log(LogLevel.Info, `${pc.gray(`[${current}/${total}]`)} ${item}`);
  }

  // File output path (with indent)
  output(path: string, dryRun = false): void {
    const prefix = dryRun ? pc.yellow("[DRY RUN] ") : "";
    this.log(LogLevel.Info, `  → ${prefix}${pc.cyan(path)}`);
  }

  // Statistics (key: value format)
  stat(key: string, value: string | number): void {
    this.log(LogLevel.Info, `  ${pc.gray(`${key}:`)} ${value}`);
  }
}
