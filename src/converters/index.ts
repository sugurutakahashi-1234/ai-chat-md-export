import { defaultConverterRegistry } from "../core/converter-registry.js";
import { JsonConverter } from "./json-converter.js";
import { MarkdownConverter } from "./markdown-converter.js";

export { JsonConverter } from "./json-converter.js";
export { MarkdownConverter } from "./markdown-converter.js";

let convertersRegistered = false;

/**
 * Register default converters
 */
export function registerDefaultConverters(): void {
  if (convertersRegistered) {
    return;
  }

  defaultConverterRegistry.register(new JsonConverter());
  defaultConverterRegistry.register(new MarkdownConverter());

  convertersRegistered = true;
}
