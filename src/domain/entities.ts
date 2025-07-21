export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

interface Message {
  role: MessageRole;
  content: string;
  timestamp?: Date;
}
