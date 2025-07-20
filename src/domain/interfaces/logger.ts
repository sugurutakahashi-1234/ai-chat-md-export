/**
 * Interface for logging operations
 *
 * Defines the contract for logging messages with different severity levels
 * and formatting options.
 */
export interface Logger {
  /**
   * Log an error message
   * @param message - Error message to log
   */
  error(message: string): void;

  /**
   * Log a warning message
   * @param message - Warning message to log
   */
  warn(message: string): void;

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
   * Log a section header
   * @param title - Section title to display
   */
  section(title: string): void;

  /**
   * Log progress information
   * @param current - Current item number
   * @param total - Total number of items
   * @param item - Description of current item
   */
  progress(current: number, total: number, item: string): void;

  /**
   * Log a file output path
   * @param path - File path being written
   * @param dryRun - Whether this is a dry run
   */
  output(path: string, dryRun?: boolean): void;

  /**
   * Log a statistic
   * @param key - Statistic name
   * @param value - Statistic value
   */
  stat(key: string, value: string | number): void;
}
