import type { ZodType } from "zod";
import type { Options } from "../../domain/config.js";
import type { Conversation } from "../../domain/entities.js";
import { ValidationError } from "../../domain/errors.js";
import type { ILogger } from "../../domain/interfaces/logger.js";
import type {
  IPlatformParser,
  ParsedConversation,
} from "../../domain/interfaces/platform-parser.js";
import type { ISchemaValidator } from "../../domain/interfaces/schema-validator.js";
import type { ISpinner } from "../../domain/interfaces/spinner.js";

/**
 * Base class for platform-specific parsers
 *
 * Provides common functionality for parsing and validating
 * platform-specific data formats (ChatGPT, Claude, etc.)
 */
export abstract class BasePlatformParser<T = unknown>
  implements IPlatformParser<T>
{
  constructor(
    protected readonly logger: ILogger,
    private readonly schemaValidator: ISchemaValidator,
    private readonly spinner: ISpinner,
  ) {}
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

  async parseAndValidateConversations(
    data: T,
    options?: Partial<Options>,
  ): Promise<Conversation[]> {
    const conversations: Conversation[] = [];
    const validationErrors: string[] = [];
    const skippedFields = new Set<string>();
    let successCount = 0;

    const items = this.parseConversations(data);
    this.logger.debug(`Parsing ${items.length} items from platform data`);

    // Start spinner
    if (items.length > 0) {
      this.spinner.start(`Parsing conversations (0/${items.length})`);
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;

      // Update spinner text with progress
      if (items.length > 0) {
        this.spinner.update(`Parsing conversations (${i + 1}/${items.length})`);
      }

      const result = this.schemaValidator.validateWithDetails(
        item.schema,
        item.data,
        {
          name: `Conversation #${i + 1}`,
        },
      );

      if (!result.success) {
        const report = this.schemaValidator.formatValidationReport(result);
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

    // Stop spinner
    if (items.length > 0) {
      if (validationErrors.length === 0) {
        this.spinner.succeed(
          `Parsed ${successCount} conversations successfully`,
        );
      } else {
        this.spinner.fail(`Failed to parse some conversations`);
      }
    }

    if (validationErrors.length > 0) {
      throw new ValidationError(
        `Schema validation error:\n${validationErrors.join("\n\n")}`,
        { errorCount: validationErrors.length },
        validationErrors,
      );
    }

    // Log skipped fields if any
    if (skippedFields.size > 0) {
      this.logger.warn(
        `Skipped unknown fields: ${Array.from(skippedFields).join(", ")}`,
      );
    }

    // Display summary information
    if (!options?.quiet) {
      this.logger.success(`Successfully loaded ${successCount} conversations`);
    }

    return conversations;
  }
}
