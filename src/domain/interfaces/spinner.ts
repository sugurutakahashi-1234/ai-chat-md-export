/**
 * Interface for spinner/progress display operations
 *
 * Defines the contract for showing progress indicators during long-running operations.
 */
export interface ISpinner {
  /**
   * Start a spinner with optional text
   * @param text - Initial text to display with the spinner
   */
  start(text?: string): void;

  /**
   * Update the spinner text
   * @param text - New text to display
   */
  update(text: string): void;

  /**
   * Stop the spinner and mark as successful
   * @param text - Optional success message
   */
  succeed(text?: string): void;

  /**
   * Stop the spinner and mark as failed
   * @param text - Optional failure message
   */
  fail(text?: string): void;

  /**
   * Stop the spinner without any status
   */
  stop(): void;
}
