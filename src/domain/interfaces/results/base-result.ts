/**
 * Base interface for error handling in operation results
 */
export interface BaseResult {
  /**
   * Errors that occurred during the operation
   */
  errors?: Array<{
    message: string;
    details?: unknown;
  }>;
}
