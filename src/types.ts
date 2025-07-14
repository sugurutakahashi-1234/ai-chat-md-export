export interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

export interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp?: Date;
}
