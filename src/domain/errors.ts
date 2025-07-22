/**
 * File operation types
 */
export enum FileOperation {
  Read = "read",
  Write = "write",
}

/**
 * Base error class for all custom errors in the application
 */
export abstract class BaseError extends Error {
  readonly context: Record<string, unknown> | undefined;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends BaseError {
  readonly validationErrors?: unknown;

  constructor(
    message: string,
    context?: Record<string, unknown>,
    validationErrors?: unknown,
  ) {
    super(message, context);
    this.validationErrors = validationErrors;
  }
}

/**
 * Error thrown when file operations fail
 */
export class FileError extends BaseError {
  readonly filePath: string;
  readonly operation: FileOperation;

  constructor(
    message: string,
    filePath: string,
    operation: FileOperation,
    context?: Record<string, unknown>,
  ) {
    super(message, { ...context, filePath, operation });
    this.filePath = filePath;
    this.operation = operation;
  }
}

/**
 * Type guard to check if an error is a BaseError
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}
