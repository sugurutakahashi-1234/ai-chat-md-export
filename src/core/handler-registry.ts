import type { FormatHandler } from "./format-handler.js";

export class HandlerRegistry {
  private readonly handlers = new Map<string, FormatHandler>();

  /**
   * Register a format handler
   */
  register(handler: FormatHandler): void {
    if (this.handlers.has(handler.id)) {
      throw new Error(`Handler with id "${handler.id}" is already registered`);
    }
    this.handlers.set(handler.id, handler);
  }

  /**
   * Get a handler by ID
   */
  getById(id: string): FormatHandler | undefined {
    return this.handlers.get(id);
  }

  /**
   * Detect format and return appropriate handler
   */
  detectFormat(data: unknown): FormatHandler | undefined {
    for (const handler of this.handlers.values()) {
      if (handler.detect(data)) {
        return handler;
      }
    }
    return undefined;
  }

  /**
   * Get all registered handlers
   */
  getAllHandlers(): FormatHandler[] {
    return Array.from(this.handlers.values());
  }

  /**
   * Check if a handler is registered
   */
  hasHandler(id: string): boolean {
    return this.handlers.has(id);
  }
}

// Singleton instance
export const defaultRegistry = new HandlerRegistry();
