import type { Conversation } from "../types.js";
import { assertType } from "../utils/validator.js";
import {
  AbstractPlatformParser,
  type ParsedConversation,
} from "./abstract-platform-parser.js";
import {
  type ChatGPTConversation,
  type ChatGPTNode,
  chatGPTConversationSchema,
} from "./schemas/chatgpt.js";

/**
 * ChatGPT platform parser
 *
 * Handles parsing and converting ChatGPT export data
 * to the common conversation format.
 */
export class ChatGPTParser extends AbstractPlatformParser<
  ChatGPTConversation[]
> {
  readonly schema = chatGPTConversationSchema.array();

  protected parseConversations(
    data: ChatGPTConversation[],
  ): ParsedConversation[] {
    return data.map((item) => ({
      data: item,
      schema: chatGPTConversationSchema,
      transform: (validatedData: unknown) => {
        const parsed = assertType(
          chatGPTConversationSchema,
          validatedData,
          "ChatGPT conversation transform",
        );
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
          role: node.message.author.role,
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
}
