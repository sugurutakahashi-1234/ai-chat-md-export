import {
  type ClaudeConversation,
  claudeConversationSchema,
} from "../schemas/claude.js";
import type { Conversation } from "../types.js";
import { logLoadingSummary } from "../utils/loader-logger.js";
import {
  formatValidationReport,
  validateWithDetails,
} from "../utils/schema-validator.js";

export async function loadClaude(
  data: unknown,
  options: { quiet?: boolean } = {},
): Promise<Conversation[]> {
  if (!Array.isArray(data)) {
    throw new Error("Claude export data must be an array");
  }

  const conversations: Conversation[] = [];
  const validationErrors: string[] = [];
  const skippedFields = new Set<string>();
  let successCount = 0;

  for (let i = 0; i < data.length; i++) {
    const result = validateWithDetails(claudeConversationSchema, data[i], {
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

    const parsed = result.data as ClaudeConversation;

    // Safely process date
    const parsedDate = new Date(parsed.created_at);
    const date = parsedDate;

    conversations.push({
      id: parsed.uuid,
      title: parsed.name || "Untitled Conversation",
      date,
      messages: parsed.chat_messages.map((msg) => {
        // Get content from text field
        let content: string = "";

        // Direct text field exists
        if ("text" in msg && typeof msg.text === "string") {
          content = msg.text;
        }
        // Content field exists (array format)
        else if ("content" in msg && Array.isArray(msg.content)) {
          const texts = msg.content
            .filter((c) => {
              // Only include "text" type content, exclude "thinking" type
              return (
                typeof c === "object" &&
                c !== null &&
                "type" in c &&
                c.type === "text"
              );
            })
            .map((c) => {
              if (typeof c === "object" && c !== null && "text" in c) {
                return c.text;
              }
              return undefined;
            })
            .filter((t): t is string => typeof t === "string");
          content = texts.length > 0 ? texts.join("\n") : "";
        }
        // Role exists (old format)
        else if ("role" in msg && "content" in msg) {
          content = typeof msg.content === "string" ? msg.content : "";
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
      }),
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
    exportType: "Claude",
    skippedFields,
    quiet: options.quiet ?? false,
  });

  return conversations;
}
