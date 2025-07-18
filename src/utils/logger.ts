import pc from "picocolors";

type LogLevel = "error" | "warn" | "info" | "success" | "debug";

interface LoggerOptions {
  quiet?: boolean;
}

class Logger {
  constructor(private options: LoggerOptions = {}) {}

  private shouldLog(level: LogLevel): boolean {
    if (this.options.quiet && level !== "error") return false;
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
      error: (s) => pc.red(pc.bold(s)),
      warn: (s) => pc.yellow(s),
      info: (s) => s, // no color for info
      success: (s) => pc.green(s),
      debug: (s) => pc.gray(s),
    };

    return formatters[level](message);
  }

  log(level: LogLevel, message: string): void {
    if (!this.shouldLog(level)) return;

    const formatted = this.format(level, message);

    // error goes to stderr, others to stdout
    if (level === "error") {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }

  // Simple method wrappers
  error(message: string): void {
    this.log("error", `✗ ${message}`);
  }

  warn(message: string): void {
    this.log("warn", `⚠ ${message}`);
  }

  info(message: string): void {
    this.log("info", message);
  }

  success(message: string): void {
    this.log("success", `✓ ${message}`);
  }

  section(title: string): void {
    this.log("info", `\n${pc.bold(pc.blue(title))}`);
  }

  // Progress display (special handling)
  progress(current: number, total: number, item: string): void {
    this.log("info", `${pc.gray(`[${current}/${total}]`)} ${item}`);
  }

  // File output path (with indent)
  output(path: string, dryRun = false): void {
    const prefix = dryRun ? pc.yellow("[DRY RUN] ") : "";
    this.log("info", `  → ${prefix}${pc.cyan(path)}`);
  }

  // Statistics (key: value format)
  stat(key: string, value: string | number): void {
    this.log("info", `  ${pc.gray(`${key}:`)} ${value}`);
  }
}

// Create logger instance with factory function
export const createLogger = (options: LoggerOptions = {}) =>
  new Logger(options);
export const logger = createLogger();
