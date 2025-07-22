/**
 * Interface for logging operations
 *
 * Defines the contract for logging messages with different severity levels
 * and additional formatting options. Methods are ordered by log level.
 *
 * Based on consola's log levels:
 * @see https://github.com/unjs/consola/blob/main/src/constants.ts
 */
export interface ILogger {
  // Level 0 - Fatal/Error
  /**
   * Log a fatal error message
   * @param message - Fatal error message to log
   */
  fatal(message: string): void;

  /**
   * Log an error message
   * @param message - Error message to log
   */
  error(message: string): void;

  // Level 1 - Warning
  /**
   * Log a warning message
   * @param message - Warning message to log
   */
  warn(message: string): void;

  // Level 2 - Log
  /**
   * Log a general message
   * @param message - General message to log
   */
  log(message: string): void;

  // Level 3 - Info/Success/Fail/Box/Start/Ready
  /**
   * Log an informational message
   * @param message - Info message to log
   */
  info(message: string): void;

  /**
   * Log a success message
   * @param message - Success message to log
   */
  success(message: string): void;

  /**
   * Log a failure message
   * @param message - Failure message to log
   */
  fail(message: string): void;

  /**
   * Display a message in a box
   * @param message - Message to display in a box
   */
  box(message: string): void;

  /**
   * Start a new log task/section
   * @param message - Task message to display
   */
  start(message: string): void;

  /**
   * Mark a task as ready/done
   * @param message - Ready message to display
   */
  ready(message: string): void;

  // Level 4 - Debug
  /**
   * Log a debug message
   * @param message - Debug message to log
   */
  debug(message: string): void;

  // Level 5 - Trace
  /**
   * Log a trace message
   * @param message - Trace message to log
   */
  trace(message: string): void;

  // Level Infinity - Verbose
  /**
   * Log a verbose message
   * @param message - Verbose message to log
   */
  verbose(message: string): void;
}
