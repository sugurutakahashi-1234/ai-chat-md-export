import type { FormatHandler, LoadOptions } from "../core/format-handler.js";
import {
  type ChatGPTConversation,
  type ChatGPTNode,
  chatGPTConversationSchema,
} from "../schemas/chatgpt.js";
import type { Conversation } from "../types.js";
import { logLoadingSummary } from "../utils/loader-logger.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/schema-validator.js";

export class ChatGPTHandler implements FormatHandler<ChatGPTConversation[]> {
  readonly id = "chatgpt";
  readonly name = "ChatGPT";
  readonly schema = chatGPTConversationSchema.array();

  detect(data: unknown): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    // Check if first element has ChatGPT-specific fields
    const firstItem = data[0];
    return (
      typeof firstItem === "object" &&
      firstItem !== null &&
      "mapping" in firstItem
    );
  }

  async load(
    data: ChatGPTConversation[],
    options: LoadOptions = {},
  ): Promise<Conversation[]> {
    const conversations: Conversation[] = [];
    const validationErrors: string[] = [];
    const skippedFields = new Set<string>();
    let successCount = 0;

    for (let i = 0; i < data.length; i++) {
      const result = validateWithDetails(chatGPTConversationSchema, data[i], {
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

      const parsed = result.data as ChatGPTConversation;
      const messages = this.extractMessages(
        parsed.mapping as Record<string, ChatGPTNode>,
      );

      const date = parsed.create_time
        ? new Date(parsed.create_time * 1000)
        : new Date();

      conversations.push({
        id: parsed.id || Object.keys(parsed.mapping)[0] || "unknown",
        title: parsed.title || "Untitled Conversation",
        date,
        messages,
      });
    }

    if (validationErrors.length > 0) {
      throw new Error(
        `Schema validation error:\n${validationErrors.join("\n\n")}`,
      );
    }

    // Display summary information
    logLoadingSummary({
      successCount,
      exportType: this.name,
      skippedFields,
      quiet: options.quiet ?? false,
    });

    return conversations;
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
