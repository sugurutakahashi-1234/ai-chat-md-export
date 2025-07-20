import type { ZodType } from "zod";
import type { Conversation } from "../types.js";
import { ValidationError } from "../utils/errors/errors.js";
import { createLogger } from "../utils/logger.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/validator.js";
import type {
  LoadOptions,
  PlatformParser,
} from "./platform-parser-interface.js";

/**
 * Base class for platform-specific parsers
 *
 * Provides common functionality for parsing and validating
 * platform-specific data formats (ChatGPT, Claude, etc.)
 */
export abstract class BasePlatformParser<T = unknown>
  implements PlatformParser<T>
{
  abstract readonly schema: ZodType<T>;

  protected abstract parseConversations(data: T): ParsedConversation<unknown>[];

  async load(data: T, options: LoadOptions = {}): Promise<Conversation[]> {
    const conversations: Conversation[] = [];
    const validationErrors: string[] = [];
    const skippedFields = new Set<string>();
    let successCount = 0;

    const items = this.parseConversations(data);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;

      const result = validateWithDetails(item.schema, item.data, {
        name: `Conversation #${i + 1}`,
      });

      if (!result.success) {
        const report = formatValidationReport(result);
        validationErrors.push(`Conversation #${i + 1}:\n${report}`);
        continue;
      }

      if (result.warnings) {
        // Collect unknown fields
        for (const warning of result.warnings) {
          if (warning.unknownFields) {
            warning.unknownFields.forEach((field) => skippedFields.add(field));
          }
        }
      }
      successCount++;

      const conversation = item.transform(result.data);
      conversations.push(conversation);
    }

    if (validationErrors.length > 0) {
      throw new ValidationError(
        `Schema validation error:\n${validationErrors.join("\n\n")}`,
        { errorCount: validationErrors.length },
        validationErrors,
      );
    }

    // Display summary information
    if (!options.quiet) {
      const logger = createLogger({ quiet: false });
      logger.success(`Successfully loaded ${successCount} conversations`);
    }

    return conversations;
  }
}

export interface ParsedConversation<T = unknown> {
  data: T;
  schema: ZodType<T>;
  transform: (validatedData: T) => Conversation;
}
