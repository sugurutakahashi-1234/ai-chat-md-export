import { promises as fs } from "node:fs";
import { z } from "zod";
import type { Conversation } from "../types.js";

const chatGPTMessageSchema = z.object({
	id: z.string(),
	author: z.object({
		role: z.enum(["user", "assistant", "system"]),
	}),
	content: z
		.object({
			parts: z.array(z.string()).optional(),
		})
		.nullable(),
	create_time: z.number().nullable(),
});

const chatGPTNodeSchema = z.object({
	id: z.string(),
	message: chatGPTMessageSchema.nullable(),
	children: z.array(z.string()).optional(),
});

const chatGPTConversationSchema = z.object({
	title: z.string(),
	create_time: z.number().nullable(),
	mapping: z.record(chatGPTNodeSchema),
});

export async function loadChatGPT(filePath: string): Promise<Conversation[]> {
	const content = await fs.readFile(filePath, "utf-8");
	const data = JSON.parse(content);

	if (!Array.isArray(data)) {
		throw new Error("ChatGPTのエクスポートデータは配列である必要があります");
	}

	return data.map((conv) => {
		const parsed = chatGPTConversationSchema.parse(conv);
		const messages = extractMessages(parsed.mapping);

		const date = parsed.create_time
			? new Date(parsed.create_time * 1000).toISOString().split("T")[0]
			: new Date().toISOString().split("T")[0];

		return {
			id: Object.keys(parsed.mapping)[0] || "unknown",
			title: parsed.title || "無題の会話",
			date: date as string,
			messages,
		};
	});
}

function extractMessages(
	mapping: Record<string, any>,
): Conversation["messages"] {
	const messages: Conversation["messages"] = [];
	const rootNodes = Object.values(mapping).filter(
		(node) =>
			!Object.values(mapping).some((n) => n.children?.includes(node.id)),
	);

	for (const root of rootNodes) {
		traverseNode(root.id, mapping, messages);
	}

	return messages.filter((m) => m.content);
}

function traverseNode(
	nodeId: string,
	mapping: Record<string, any>,
	messages: Conversation["messages"],
) {
	const node = mapping[nodeId];
	if (!node) return;

	if (node.message && node.message.content?.parts?.length > 0) {
		messages.push({
			role: node.message.author.role,
			content: node.message.content.parts.join("\n"),
			timestamp: node.message.create_time
				? new Date(node.message.create_time * 1000).toISOString()
				: undefined,
		});
	}

	if (node.children && node.children.length > 0) {
		traverseNode(node.children[0], mapping, messages);
	}
}
