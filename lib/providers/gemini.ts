import { GoogleGenAI } from "@google/genai";
import { ChatProvider, GenerateArgs } from "./types";
import { ChatMessage } from "../personas/types";

function client() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local to use the Gemini provider."
    );
  }
  return new GoogleGenAI({ apiKey });
}

// Gemini uses "model" instead of "assistant" for its own turns.
function toGeminiHistory(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export const geminiProvider: ChatProvider = {
  id: "gemini",

  async generateReply({ systemPrompt, messages, temperature }: GenerateArgs) {
    const ai = client();
    const history = toGeminiHistory(messages.slice(0, -1));
    const last = messages[messages.length - 1];

    const chat = ai.chats.create({
      model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
      config: { systemInstruction: systemPrompt, temperature },
      history,
    });

    const response = await chat.sendMessage({ message: last.content });
    return (response.text ?? "").trim();
  },

  async summarize(text: string) {
    const ai = client();
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
      contents: text,
      config: {
        systemInstruction:
          "Summarize this conversation excerpt into 4-6 compact bullet points capturing facts, decisions, and the user's stated preferences. No preamble.",
        temperature: 0.2,
      },
    });
    return (response.text ?? "").trim();
  },
};
