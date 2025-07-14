import { z } from "zod";

// Claude message content schema
export const claudeMessageContentSchema = z
  .object({
    type: z.string(), // Supports multiple types like "text", "thinking"
    text: z.string().optional(),
    thinking: z.string().optional(),
    // Allow other fields
  })
  .passthrough() satisfies z.ZodSchema;

export const claudeMessageSchema = z
  .object({
    // Support both new format (using sender) and old format (using role)
    role: z.enum(["user", "assistant"]).optional(),
    sender: z.enum(["human", "assistant"]).optional(),
    content: z
      .union([z.string(), z.array(claudeMessageContentSchema)])
      .optional(),
    text: z.string().optional(),
    uuid: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    attachments: z.array(z.unknown()).optional(),
    files: z.array(z.unknown()).optional(),
  })
  .passthrough() satisfies z.ZodSchema;

export const claudeConversationSchema = z
  .object({
    uuid: z.string(),
    name: z.string().nullable().optional(),
    summary: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    chat_messages: z.array(claudeMessageSchema),
    project_uuid: z.string().nullable().optional(),
    conversation_type: z.string().optional(),
    current_leaf_message_uuid: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema;

// Export type definitions
export type ClaudeConversation = z.infer<typeof claudeConversationSchema>;
