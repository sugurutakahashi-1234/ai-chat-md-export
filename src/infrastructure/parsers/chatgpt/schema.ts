import { z } from "zod";
import type { MessageRole } from "../../../domain/entities.js";

// Detailed ChatGPT schema definitions
const chatGPTContentPartSchema = z.union([
  z.string(),
  z
    .object({
      content_type: z.string().optional(),
      text: z.string().optional(),
      // Support for future extensions
    })
    .passthrough(),
]) satisfies z.ZodSchema;

const chatGPTMessageSchema = z
  .object({
    id: z.string(),
    author: z.object({
      role: z.enum([
        "user",
        "assistant",
        "system",
        "tool",
      ] as const satisfies readonly MessageRole[]),
      name: z.string().nullable().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
    content: z
      .object({
        content_type: z.string().optional(),
        parts: z.array(chatGPTContentPartSchema).optional(),
        text: z.string().optional(),
      })
      .nullable(),
    create_time: z.number().nullable(),
    update_time: z.number().nullable().optional(),
    status: z.string().optional(),
    end_turn: z.boolean().nullable().optional(),
    weight: z.number().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    recipient: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema; // Allow unknown fields

const chatGPTNodeSchema = z
  .object({
    id: z.string(),
    message: chatGPTMessageSchema.nullable(),
    parent: z.string().nullable().optional(),
    children: z.array(z.string()).optional(),
  })
  .passthrough() satisfies z.ZodSchema;

export const chatGPTConversationSchema = z
  .object({
    title: z.string().nullable().optional(),
    create_time: z.number().nullable(),
    update_time: z.number().optional(),
    mapping: z.record(z.string(), chatGPTNodeSchema),
    moderation_results: z.array(z.unknown()).optional(),
    current_node: z.string().optional(),
    conversation_id: z.string().optional(),
    plugin_ids: z.array(z.string()).nullable().optional(),
    conversation_template_id: z.string().nullable().optional(),
    id: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema;

// Export type definitions
export type ChatGPTConversation = z.infer<typeof chatGPTConversationSchema>;
export type ChatGPTNode = z.infer<typeof chatGPTNodeSchema>;
