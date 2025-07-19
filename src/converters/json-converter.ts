import type { OutputFormatter } from "../core/output-formatter.js";
import type { Conversation } from "../types.js";
import { convertSingleConversationToJson, convertToJson } from "./json.js";

/**
 * JSON output formatter
 *
 * Formats conversations as JSON for data exchange
 * and programmatic processing.
 */
export class JsonConverter implements OutputFormatter {
  readonly extension = ".json";

  convertSingle(conversation: Conversation): string {
    return convertSingleConversationToJson(conversation);
  }

  convertMultiple(conversations: Conversation[]): string {
    return convertToJson(conversations);
  }

  getDefaultFilename(): string {
    return "all-conversations.json";
  }
}
