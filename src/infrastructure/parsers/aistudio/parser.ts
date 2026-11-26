import { MessageRole } from "../../../domain/entities.js";
import type { ParsedConversation } from "../../../domain/interfaces/platform-parser.js";
import { BasePlatformParser } from "../base-platform-parser.js";
import { type AIStudioFile, aiStudioFileSchema } from "./schema.js";

/**
 * Google AI Studio parser.
 *
 * AI Studio exports are a directory of JSON files, one per conversation.
 * The FileLoader wraps each file into {filename, mtime, content} before
 * handing it to this parser.
 */
export class AIStudioParser extends BasePlatformParser<AIStudioFile[]> {
  readonly schema = aiStudioFileSchema.array();
  override readonly inputKind = "directory" as const;

  parseConversations(data: AIStudioFile[]): ParsedConversation[] {
    // Silently skip non-chat exports (e.g. Imagen prompts, applet history)
    // which share the AI Studio directory but don't contain chunkedPrompt.
    const chats = data.filter((entry) => {
      const content = entry.content as { chunkedPrompt?: unknown } | undefined;
      if (!content?.chunkedPrompt) {
        this.logger.debug(
          `Skipping non-chat AI Studio file: ${entry.filename}`,
        );
        return false;
      }
      return true;
    });

    return chats.map((entry) => ({
      data: entry,
      schema: aiStudioFileSchema,
      transform: (validatedData: unknown) => {
        const parsed = validatedData as AIStudioFile;
        const title = parsed.filename || "Untitled Conversation";
        const messages = parsed.content.chunkedPrompt.chunks
          .filter((c) => !c.isThought && c.text && c.text.length > 0)
          .map((c) => ({
            role: c.role === "user" ? MessageRole.User : MessageRole.Assistant,
            content: c.text ?? "",
          }));

        return {
          id: parsed.filename,
          title,
          date: parsed.mtime,
          messages,
        };
      },
    }));
  }
}
