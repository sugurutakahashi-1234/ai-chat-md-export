import { type Conversation, MessageRole } from "../../../domain/entities.js";
import type { ParsedConversation } from "../../../domain/interfaces/platform-parser.js";
import { BasePlatformParser } from "../base-platform-parser.js";
import { type ClaudeConversation, claudeConversationSchema } from "./schema.js";

/**
 * Claude platform parser
 *
 * Handles parsing and converting Claude export data
 * to the common conversation format.
 */
export class ClaudeParser extends BasePlatformParser<ClaudeConversation[]> {
  readonly schema = claudeConversationSchema.array();

  parseConversations(data: ClaudeConversation[]): ParsedConversation[] {
    return data.map((item) => ({
      data: item,
      schema: claudeConversationSchema,
      transform: (validatedData: unknown) => {
        // Data has already been validated by base class
        const parsed = validatedData as ClaudeConversation;
        const date = new Date(parsed.created_at);

        return {
          id: parsed.uuid,
          title: parsed.name || "Untitled Conversation",
          date,
          messages: this.transformMessages(parsed.chat_messages),
        };
      },
    }));
  }

  private transformMessages(
    messages: ClaudeConversation["chat_messages"],
  ): Conversation["messages"] {
    return messages.map((msg) => {
      // Get content from message
      let content = "";
      if ("text" in msg && typeof msg.text === "string") {
        content = msg.text;
      } else if ("content" in msg) {
        if (typeof msg.content === "string") {
          content = msg.content;
        } else if (Array.isArray(msg.content)) {
          // Extract text from content array, filtering out "thinking" type
          content = msg.content
            .filter(
              (c) =>
                typeof c === "object" &&
                c !== null &&
                "type" in c &&
                c.type === "text" &&
                "text" in c,
            )
            .map((c) => {
              // Type is already checked in filter above
              const textContent = c as { type: string; text: string };
              return textContent.text;
            })
            .join("\n");
        }
      }

      // Determine role from sender field
      let role: MessageRole;
      if ("sender" in msg) {
        role =
          msg.sender === "human" ? MessageRole.User : MessageRole.Assistant;
      } else if ("role" in msg && msg.role) {
        // Convert old format role field (human -> user)
        role = msg.role === "human" ? MessageRole.User : MessageRole.Assistant;
      } else {
        // Default value
        role = MessageRole.User;
      }

      return {
        role,
        content,
        timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
      };
    });
  }
}
