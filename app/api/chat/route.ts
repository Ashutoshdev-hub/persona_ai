import { NextRequest, NextResponse } from "next/server";
import { getPersona } from "@/lib/personas";
import { PersonaId, ProviderId, ChatMessage } from "@/lib/personas/types";
import { getProvider } from "@/lib/providers";
import {
  buildContextWindow,
  getMessagesToSummarize,
  shouldRefreshSummary,
} from "@/lib/context-manager";

interface ChatRequestBody {
  personaId: PersonaId;
  providerId: ProviderId;
  messages: ChatMessage[]; // full history, including the latest user message
  existingSummary?: string | null;
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { personaId, providerId, messages, existingSummary } = body;

  if (!personaId || !providerId || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "personaId, providerId, and a non-empty messages array are required." },
      { status: 400 }
    );
  }

  let persona;
  let provider;
  try {
    persona = getPersona(personaId);
    provider = getProvider(providerId);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  // Layer the provider-specific calibration notes on top of the base persona
  // prompt, so the same target persona lands consistently on both providers.
  const systemPrompt = `${persona.systemPrompt}\n\nPROVIDER-SPECIFIC NOTE (internal, do not mention this to the user):\n${persona.providerNotes[providerId]}`;
  const temperature = persona.temperature[providerId];

  // Context management: fold anything outside the recent window into a
  // rolling summary instead of sending unbounded history on every call.
  let updatedSummary = existingSummary ?? null;
  if (shouldRefreshSummary(messages)) {
    const toSummarize = getMessagesToSummarize(messages);
    const excerptText = toSummarize.map((m) => `${m.role}: ${m.content}`).join("\n");
    try {
      updatedSummary = await provider.summarize(
        existingSummary ? `${existingSummary}\n\n(new material)\n${excerptText}` : excerptText
      );
    } catch {
      // Summarization is a best-effort optimization — if it fails, fall back
      // to the existing summary (or none) rather than failing the request.
    }
  }

  const { summaryMessage, recentMessages } = buildContextWindow(messages, updatedSummary);
  const providerMessages = summaryMessage ? [summaryMessage, ...recentMessages] : recentMessages;

  try {
    const reply = await provider.generateReply({
      systemPrompt,
      messages: providerMessages,
      temperature,
    });
    return NextResponse.json({ reply, summary: updatedSummary });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "The model provider request failed." },
      { status: 502 }
    );
  }
}
