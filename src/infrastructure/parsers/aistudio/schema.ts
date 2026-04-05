import { z } from "zod";

/**
 * A single turn in a Google AI Studio conversation.
 *
 * AI Studio stores conversations as a list of "chunks", one per message
 * (user prompt or model reply). Model reasoning chunks are flagged with
 * `isThought: true` and should be filtered out when rendering.
 */
const aiStudioChunkSchema = z
  .object({
    role: z.enum(["user", "model"]),
    text: z.string().optional(),
    isThought: z.boolean().optional(),
    tokenCount: z.number().optional(),
    finishReason: z.string().optional(),
  })
  .passthrough() satisfies z.ZodSchema;

/**
 * Raw body of a single AI Studio conversation file.
 */
const aiStudioContentSchema = z
  .object({
    runSettings: z
      .object({
        model: z.string().optional(),
      })
      .passthrough()
      .optional(),
    systemInstruction: z.unknown().optional(),
    chunkedPrompt: z
      .object({
        chunks: z.array(aiStudioChunkSchema),
      })
      .passthrough(),
  })
  .passthrough() satisfies z.ZodSchema;

/**
 * One conversation file on disk: the parsed JSON content plus
 * file-level metadata (name and mtime), which AI Studio doesn't
 * embed inside the JSON itself.
 */
export const aiStudioFileSchema = z.object({
  filename: z.string(),
  mtime: z.date(),
  content: aiStudioContentSchema,
});

export type AIStudioFile = z.infer<typeof aiStudioFileSchema>;
