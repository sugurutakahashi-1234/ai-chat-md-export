import type { ZodType } from "zod";
import { ValidationError } from "../../domain/errors/errors.js";
import type {
  LoadOptions,
  ParsedConversation,
  PlatformParser,
} from "../../domain/interfaces/platform-parser.js";
import type { Conversation } from "../../domain/models/types.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../../shared/utils/validator.js";
import type { Logger } from "../logging/logger.js";

/**
 * Abstract base class for platform-specific parsers
 *
 * Provides common functionality for parsing and validating
 * platform-specific data formats (ChatGPT, Claude, etc.)
 */
export abstract class AbstractPlatformParser<T = unknown>
  implements PlatformParser<T>
{
  constructor(protected readonly logger: Logger) {}
  abstract readonly schema: ZodType<T>;

  /**
   * Parse platform-specific data into a common intermediate format
   *
   * This method must be implemented by each platform parser to handle
   * the specific data structure of that platform (ChatGPT, Claude, etc.)
   *
   * @param data The validated platform-specific data
   * @returns Array of parsed conversations ready for validation and transformation
   */
  abstract parseConversations(data: T): ParsedConversation<unknown>[];

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
      this.logger.success(`Successfully loaded ${successCount} conversations`);
    }

    return conversations;
  }
}
