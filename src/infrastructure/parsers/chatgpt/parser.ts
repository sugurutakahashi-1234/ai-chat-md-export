import type { Conversation } from "../../../domain/entities.js";
import { MessageRole } from "../../../domain/entities.js";
import type { ParsedConversation } from "../../../domain/interfaces/platform-parser.js";
import { BasePlatformParser } from "../base-platform-parser.js";
import {
  type ChatGPTConversation,
  type ChatGPTNode,
  chatGPTConversationSchema,
} from "./schema.js";

/**
 * ChatGPT platform parser
 *
 * Handles parsing and converting ChatGPT export data
 * to the common conversation format.
 */
export class ChatGPTParser extends BasePlatformParser<ChatGPTConversation[]> {
  readonly schema = chatGPTConversationSchema.array();

  // Ensure all enum values are covered at compile time
  private readonly roleMap = {
    user: MessageRole.User,
    assistant: MessageRole.Assistant,
    system: MessageRole.System,
    tool: MessageRole.Tool,
  } as const satisfies Record<MessageRole, MessageRole>;

  parseConversations(data: ChatGPTConversation[]): ParsedConversation[] {
    return data.map((item) => ({
      data: item,
      schema: chatGPTConversationSchema,
      transform: (validatedData: unknown) => {
        // Data has already been validated by base class
        const parsed = validatedData as ChatGPTConversation;
        const messages = this.extractMessages(parsed.mapping);

        const date = parsed.create_time
          ? new Date(parsed.create_time * 1000)
          : new Date();

        return {
          id: parsed.id || Object.keys(parsed.mapping)[0] || "unknown",
          title: parsed.title || "Untitled Conversation",
          date,
          messages,
        };
      },
    }));
  }

  private extractMessages(
    mapping: Record<string, ChatGPTNode>,
  ): Conversation["messages"] {
    const messages: Conversation["messages"] = [];
    const rootNodes = Object.values(mapping).filter(
      (node) =>
        !Object.values(mapping).some((n) => n.children?.includes(node.id)),
    );

    for (const root of rootNodes) {
      this.traverseNode(root.id, mapping, messages);
    }

    return messages.filter((m) => m.content);
  }

  private traverseNode(
    nodeId: string,
    mapping: Record<string, ChatGPTNode>,
    messages: Conversation["messages"],
  ): void {
    const node = mapping[nodeId];
    if (!node) return;

    if (node.message?.content?.parts && node.message.content.parts.length > 0) {
      const contentParts = node.message.content.parts
        .map((part) => {
          if (typeof part === "string") {
            return part;
          } else if (part && typeof part === "object") {
            // For objects with content_type and text fields
            if ("text" in part && typeof part.text === "string") {
              return part.text;
            }
            // Stringify other objects
            return JSON.stringify(part, null, 2);
          }
          return "";
        })
        .filter((part) => part !== "");

      if (contentParts.length > 0) {
        const message: Conversation["messages"][number] = {
          role: this.mapRole(node.message.author.role),
          content: contentParts.join("\n"),
        };

        // Add timestamp only if it exists
        if (node.message.create_time) {
          message.timestamp = new Date(node.message.create_time * 1000);
        }

        messages.push(message);
      }
    }

    if (node.children && node.children.length > 0 && node.children[0]) {
      this.traverseNode(node.children[0], mapping, messages);
    }
  }

  /**
   * Map string role to MessageRole enum with type safety
   */
  private mapRole(role: string): MessageRole {
    return this.roleMap[role as keyof typeof this.roleMap] ?? MessageRole.User;
  }
}
