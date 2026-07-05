import OpenAI from "openai";
import { ChatProvider, GenerateArgs } from "./types";

// Lazily constructed so a missing key only breaks requests to this provider,
// not the whole app (e.g. build time, or while only testing Gemini).
function client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local to use the OpenAI provider."
    );
  }
  return new OpenAI({ apiKey });
}

export const openaiProvider: ChatProvider = {
  id: "openai",

  async generateReply({ systemPrompt, messages, temperature }: GenerateArgs) {
    const res = await client().chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    return res.choices[0]?.message?.content?.trim() ?? "";
  },

  async summarize(text: string) {
    const res = await client().chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Summarize this conversation excerpt into 4-6 compact bullet points capturing facts, decisions, and the user's stated preferences. No preamble.",
        },
        { role: "user", content: text },
      ],
    });
    return res.choices[0]?.message?.content?.trim() ?? "";
  },
};
