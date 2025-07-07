export interface Conversation {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}