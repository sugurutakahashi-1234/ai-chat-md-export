import type { Conversation } from "../types.js";

export interface JsonOutput {
  conversations: JsonConversation[];
}

export interface JsonConversation {
  id: string;
  title: string;
  date: string;
  messages: JsonMessage[];
}

export interface JsonMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp?: string;
}

export function convertToJson(conversations: Conversation[]): string {
  const jsonOutput: JsonOutput = {
    conversations: conversations.map(convertConversationToJson),
  };
  return JSON.stringify(jsonOutput, null, 2);
}

export function convertSingleConversationToJson(
  conversation: Conversation,
): string {
  const jsonConversation = convertConversationToJson(conversation);
  return JSON.stringify(jsonConversation, null, 2);
}

function convertConversationToJson(
  conversation: Conversation,
): JsonConversation {
  return {
    id: conversation.id,
    title: conversation.title,
    date: conversation.date.toISOString(),
    messages: conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
      ...(message.timestamp && { timestamp: message.timestamp.toISOString() }),
    })),
  };
}
