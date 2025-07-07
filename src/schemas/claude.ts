import { z } from "zod";

// Claude NDJSON形式のスキーマ
export const claudeMessageSchema = z
  .object({
    uuid: z.string(),
    text: z.string(),
    sender: z.enum(["human", "assistant"]),
    created_at: z.string(),
    updated_at: z.string().optional(),
    edited_at: z.string().nullable().optional(),
    attachments: z.array(z.unknown()).optional(),
    files: z.array(z.unknown()).optional(),
  })
  .passthrough() satisfies z.ZodSchema;

export const claudeNDJSONSchema = z
  .object({
    uuid: z.string(),
    name: z.string(),
    summary: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    type: z.literal("chat"),
    chat_messages: z.array(claudeMessageSchema),
    conversation_id: z.string().optional(),
    project_uuid: z.string().nullable().optional(),
    organization_uuid: z.string().optional(),
    conversation_type: z.string().optional(),
    current_leaf_message_uuid: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema;

// Claude JSON配列形式のスキーマ
export const claudeJSONMessageContentSchema = z
  .object({
    type: z.string(), // "text", "thinking" など複数のタイプをサポート
    text: z.string().optional(),
    thinking: z.string().optional(),
    // その他のフィールドも許可
  })
  .passthrough() satisfies z.ZodSchema;

export const claudeJSONMessageSchema = z
  .object({
    // 新形式（sender使用）と旧形式（role使用）の両方をサポート
    role: z.enum(["user", "assistant"]).optional(),
    sender: z.enum(["human", "assistant"]).optional(),
    content: z.union([z.string(), z.array(claudeJSONMessageContentSchema)]).optional(),
    text: z.string().optional(),
    uuid: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    attachments: z.array(z.unknown()).optional(),
    files: z.array(z.unknown()).optional(),
  })
  .passthrough() satisfies z.ZodSchema;

export const claudeJSONConversationSchema = z
  .object({
    uuid: z.string(),
    name: z.string(),
    summary: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    chat_messages: z.array(claudeJSONMessageSchema),
    project_uuid: z.string().nullable().optional(),
    conversation_type: z.string().optional(),
    current_leaf_message_uuid: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema;

// 型定義のエクスポート
export type ClaudeNDJSONConversation = z.infer<typeof claudeNDJSONSchema>;
export type ClaudeJSONConversation = z.infer<
  typeof claudeJSONConversationSchema
>;
export type ClaudeMessage = z.infer<typeof claudeMessageSchema>;
export type ClaudeJSONMessage = z.infer<typeof claudeJSONMessageSchema>;
