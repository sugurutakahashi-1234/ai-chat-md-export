import type { OutputConverter } from "../core/output-converter.js";
import type { Conversation } from "../types.js";
import { convertSingleConversationToJson, convertToJson } from "./json.js";

export class JsonConverter implements OutputConverter {
  readonly id = "json";
  readonly name = "JSON";
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
