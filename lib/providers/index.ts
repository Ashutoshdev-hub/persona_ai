import { openaiProvider } from "./openai";
import { geminiProvider } from "./gemini";
import { ChatProvider } from "./types";
import { ProviderId } from "../personas/types";

export const providers: Record<ProviderId, ChatProvider> = {
  openai: openaiProvider,
  gemini: geminiProvider,
};

export function getProvider(id: ProviderId): ChatProvider {
  const provider = providers[id];
  if (!provider) throw new Error(`Unknown provider: ${id}`);
  return provider;
}

export * from "./types";
