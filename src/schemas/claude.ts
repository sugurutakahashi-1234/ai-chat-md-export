import { z } from "zod";

// Claudeのメッセージコンテンツスキーマ
export const claudeMessageContentSchema = z
  .object({
    type: z.string(), // "text", "thinking" など複数のタイプをサポート
    text: z.string().optional(),
    thinking: z.string().optional(),
    // その他のフィールドも許可
  })
  .passthrough() satisfies z.ZodSchema;

export const claudeMessageSchema = z
  .object({
    // 新形式（sender使用）と旧形式（role使用）の両方をサポート
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
    name: z.string(),
    summary: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    chat_messages: z.array(claudeMessageSchema),
    project_uuid: z.string().nullable().optional(),
    conversation_type: z.string().optional(),
    current_leaf_message_uuid: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema;

// 型定義のエクスポート
export type ClaudeConversation = z.infer<typeof claudeConversationSchema>;
export type ClaudeMessage = z.infer<typeof claudeMessageSchema>;
