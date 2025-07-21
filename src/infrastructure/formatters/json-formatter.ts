import type { Conversation, MessageRole } from "../../domain/entities.js";
import type { IOutputFormatter } from "../../domain/interfaces/output-formatter.js";

interface JsonOutput {
  conversations: JsonConversation[];
}

/**
 * JSON representation of a conversation (DTO)
 *
 * This is a Data Transfer Object for JSON serialization.
 * Unlike the domain model (Conversation), this uses string types
 * for dates to ensure proper JSON serialization.
 */
interface JsonConversation {
  id: string;
  title: string;
  date: string;
  messages: JsonMessage[];
}

/**
 * JSON representation of a message (DTO)
 *
 * This is a Data Transfer Object for JSON serialization.
 * Unlike the domain model (Message), this uses string type
 * for the timestamp to ensure proper JSON serialization.
 */
interface JsonMessage {
  role: MessageRole;
  content: string;
  timestamp?: string;
}

/**
 * JSON output formatter
 *
 * Formats conversations as JSON for data exchange
 * and programmatic processing.
 */
export class JsonFormatter implements IOutputFormatter {
  readonly extension = ".json";

  formatSingle(conversation: Conversation): string {
    const jsonConversation = this.convertConversationToJson(conversation);
    return JSON.stringify(jsonConversation, null, 2);
  }

  formatMultiple(conversations: Conversation[]): string {
    const jsonOutput: JsonOutput = {
      conversations: conversations.map((conv) =>
        this.convertConversationToJson(conv),
      ),
    };
    return JSON.stringify(jsonOutput, null, 2);
  }

  getDefaultFilename(): string {
    return "all-conversations.json";
  }

  private convertConversationToJson(
    conversation: Conversation,
  ): JsonConversation {
    return {
      id: conversation.id,
      title: conversation.title,
      date: conversation.date.toISOString(),
      messages: conversation.messages.map((message) => ({
        role: message.role,
        content: message.content,
        ...(message.timestamp && {
          timestamp: message.timestamp.toISOString(),
        }),
      })),
    };
  }
}
