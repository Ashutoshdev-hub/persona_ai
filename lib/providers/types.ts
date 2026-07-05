import { ChatMessage } from "../personas/types";

export interface GenerateArgs {
  systemPrompt: string;
  messages: ChatMessage[];
  temperature: number;
}

export interface ChatProvider {
  id: "openai" | "gemini";
  generateReply(args: GenerateArgs): Promise<string>;
  summarize(text: string): Promise<string>;
}
