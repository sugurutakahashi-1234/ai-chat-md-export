import type { ZodType } from "zod";
import type { Conversation } from "../types.js";
import { createLogger } from "../utils/logger.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/schema-validator.js";
import type { FormatHandler, LoadOptions } from "./format-handler.js";

export abstract class BaseFormatHandler<T = unknown>
  implements FormatHandler<T>
{
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly schema: ZodType<T>;

  abstract detect(data: unknown): boolean;

  protected abstract parseConversations(data: T): ParsedConversation[];

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
      throw new Error(
        `Schema validation error:\n${validationErrors.join("\n\n")}`,
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

export interface ParsedConversation {
  data: unknown;
  schema: ZodType;
  transform: (validatedData: unknown) => Conversation;
}
