export type PersonaId = "hitesh" | "piyush";
export type ProviderId = "openai" | "gemini";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Persona {
  id: PersonaId;
  displayName: string;
  tagline: string;
  accent: "chai" | "signal";
  /** Base system prompt, provider-agnostic. */
  systemPrompt: string;
  /**
   * Per-provider calibration layer. Each provider has its own default
   * voice — this compensates for that so both land on the same target
   * persona instead of two different-sounding bots wearing the same name.
   */
  providerNotes: Record<ProviderId, string>;
  /** Temperature tuned per provider — same persona can need different values
   *  on different providers to hit the same perceived "energy". */
  temperature: Record<ProviderId, number>;
}
