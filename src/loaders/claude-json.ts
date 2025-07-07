import { promises as fs } from "node:fs";
import { z } from "zod";
import type { Conversation } from "../types.js";

const claudeContentSchema = z.object({
	text: z.string().optional(),
	type: z.string(),
});

const claudeMessageSchema = z.object({
	uuid: z.string(),
	text: z.string(),
	content: z.array(claudeContentSchema).optional(),
	sender: z.enum(["human", "assistant"]),
	created_at: z.string(),
});

const claudeConversationSchema = z.object({
	uuid: z.string(),
	name: z.string(),
	created_at: z.string(),
	chat_messages: z.array(claudeMessageSchema),
});

export async function loadClaudeJSON(filePath: string): Promise<Conversation[]> {
	const content = await fs.readFile(filePath, "utf-8");
	const data = JSON.parse(content);
	
	if (!Array.isArray(data)) {
		throw new Error("Claudeのエクスポートデータは配列である必要があります");
	}
	
	return data.map((conv) => {
		const parsed = claudeConversationSchema.parse(conv);
		
		return {
			id: parsed.uuid,
			title: parsed.name || "無題の会話",
			date: new Date(parsed.created_at).toISOString().split("T")[0],
			messages: parsed.chat_messages.map(msg => {
				// contentがある場合はその中のtextを結合、なければmsg.textを使用
				let content = msg.text;
				if (msg.content && msg.content.length > 0) {
					const texts = msg.content
						.map(c => c.text)
						.filter((t): t is string => t !== undefined);
					if (texts.length > 0) {
						content = texts.join("\n");
					}
				}
				
				return {
					role: msg.sender === "human" ? "user" : "assistant",
					content,
					timestamp: msg.created_at,
				};
			}),
		};
	});
}