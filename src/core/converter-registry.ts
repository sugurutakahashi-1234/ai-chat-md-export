import type { OutputConverter } from "./output-converter.js";

export class ConverterRegistry {
  private readonly converters = new Map<string, OutputConverter>();

  /**
   * Register an output converter
   */
  register(converter: OutputConverter): void {
    if (this.converters.has(converter.id)) {
      throw new Error(
        `Converter with id "${converter.id}" is already registered`,
      );
    }
    this.converters.set(converter.id, converter);
  }

  /**
   * Get a converter by ID
   */
  getById(id: string): OutputConverter | undefined {
    return this.converters.get(id);
  }

  /**
   * Check if a converter is registered
   */
  hasConverter(id: string): boolean {
    return this.converters.has(id);
  }
}

// Singleton instance
export const defaultConverterRegistry = new ConverterRegistry();
