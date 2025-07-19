import {
  BasePlatformParser,
  type ParsedConversation,
} from "../core/base-handler.js";
import {
  type ClaudeConversation,
  claudeConversationSchema,
} from "../schemas/claude.js";
import type { Conversation } from "../types.js";
import { assertType } from "../utils/type-guards.js";

/**
 * Claude platform parser
 *
 * Handles parsing and converting Claude export data
 * to the common conversation format.
 */
export class ClaudeHandler extends BasePlatformParser<ClaudeConversation[]> {
  readonly schema = claudeConversationSchema.array();

  detect(data: unknown): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    // Check if first element has Claude-specific fields
    const firstItem = data[0];
    return (
      typeof firstItem === "object" &&
      firstItem !== null &&
      "chat_messages" in firstItem &&
      "uuid" in firstItem
    );
  }

  protected parseConversations(
    data: ClaudeConversation[],
  ): ParsedConversation[] {
    return data.map((item) => ({
      data: item,
      schema: claudeConversationSchema,
      transform: (validatedData: unknown) => {
        const parsed = assertType(
          claudeConversationSchema,
          validatedData,
          "Claude conversation transform",
        );
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
      let role: "user" | "assistant";
      if ("sender" in msg) {
        role = msg.sender === "human" ? "user" : "assistant";
      } else if ("role" in msg && msg.role) {
        // Convert old format role field (human -> user)
        role = msg.role === "human" ? "user" : "assistant";
      } else {
        // Default value
        role = "user";
      }

      return {
        role,
        content,
        timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
      };
    });
  }
}
