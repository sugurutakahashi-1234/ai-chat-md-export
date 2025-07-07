import { promises as fs } from "fs";
import { z } from "zod";
import type { Conversation } from "../types.js";

const claudeMessageSchema = z.object({
  text: z.string(),
  sender: z.enum(["human", "assistant"]),
  created_at: z.string(),
});

const claudeConversationSchema = z.object({
  uuid: z.string(),
  name: z.string().optional(),
  type: z.literal("chat"),
  chat_messages: z.array(claudeMessageSchema),
  created_at: z.string().optional(),
});

export async function loadClaude(filePath: string): Promise<Conversation[]> {
  const content = await fs.readFile(filePath, "utf-8");
  
  const lines = content.trim().split("\n");
  const conversations: Conversation[] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const data = JSON.parse(line);
      const parsed = claudeConversationSchema.parse(data);
      
      const date = parsed.created_at 
        ? new Date(parsed.created_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      
      conversations.push({
        id: parsed.uuid,
        title: parsed.name || "無題の会話",
        date: date as string,
        messages: parsed.chat_messages.map(msg => ({
          role: msg.sender === "human" ? "user" : "assistant",
          content: msg.text,
          timestamp: msg.created_at,
        })),
      });
    } catch (error) {
      console.warn(`行の解析をスキップ: ${error instanceof Error ? error.message : error}`);
    }
  }
  
  return conversations;
}