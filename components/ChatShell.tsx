"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChatMessage, PersonaId, ProviderId } from "@/lib/personas/types";
import { personas } from "@/lib/personas";
import PersonaSwitch from "./PersonaSwitch";
import ModelSwitch from "./ModelSwitch";
import MessageBubble from "./MessageBubble";
import Composer from "./Composer";
import Logo from "./Logo";
import PersonaAvatar from "./PersonaAvatar";
import ThemeToggle from "./ThemeToggle";

const STARTERS: Record<PersonaId, string[]> = {
  hitesh: [
    "What should I actually learn first?",
    "Explain this bug like I’m five",
    "Roast my project idea without being rude",
  ],
  piyush: [
    "Show me a production-grade architecture for this feature",
    "Help me debug this like a senior engineer",
    "What should I build to get job-ready fast?",
  ],
};

const PROVIDER_HINTS: Record<ProviderId, string> = {
  openai: "OpenAI mode keeps the reply crisp and direct.",
  gemini: "Gemini mode leans a bit more structured and analytical.",
};

interface Thread {
  messages: ChatMessage[];
  summary: string | null;
}

function emptyThread(): Thread {
  return { messages: [], summary: null };
}

interface Props {
  initialPersona?: PersonaId;
}

function TypingIndicator({ personaId }: { personaId: PersonaId }) {
  const persona = personas[personaId];
  const isChai = persona.accent === "chai";
  return (
    <div className="mt-3 flex items-end gap-2">
      <PersonaAvatar personaId={personaId} size={28} />
      <div
        className={[
          "animate-bubble-in flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm",
          isChai ? "bg-chai-soft" : "bg-signal-soft",
        ].join(" ")}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={["h-1.5 w-1.5 animate-dot-bounce rounded-full", isChai ? "bg-chai" : "bg-signal"].join(" ")}
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatShell({ initialPersona = "hitesh" }: Props) {
  const [personaId, setPersonaId] = useState<PersonaId>(initialPersona);
  const [providerId, setProviderId] = useState<ProviderId>("openai");
  const [threads, setThreads] = useState<Record<PersonaId, Thread>>({
    hitesh: emptyThread(),
    piyush: emptyThread(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const thread = threads[personaId];
  const persona = personas[personaId];
  const starters = useMemo(() => STARTERS[personaId], [personaId]);
  const providerHint = PROVIDER_HINTS[providerId];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.messages, loading]);

  async function handleSend(text: string) {
    setError(null);
    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...thread.messages, userMessage];

    setThreads((prev) => ({
      ...prev,
      [personaId]: { ...prev[personaId], messages: nextMessages },
    }));
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId,
          providerId,
          messages: nextMessages,
          existingSummary: thread.summary,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed.");

      const assistantMessage: ChatMessage = { role: "assistant", content: data.reply };
      setThreads((prev) => ({
        ...prev,
        [personaId]: {
          messages: [...nextMessages, assistantMessage],
          summary: data.summary ?? prev[personaId].summary,
        },
      }));
    } catch (e: any) {
      setError(e.message || "Something went wrong talking to the model provider.");
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = thread.messages.length === 0;

  return (
    <div className="ambient-wash flex h-screen flex-col transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 py-4">
        <div className="mb-3 font-mono text-xs">
          <Link href="/" className="inline-flex items-center gap-1 text-muted transition-colors hover:text-paper">
            ← back
          </Link>
        </div>

        <header className="sticky top-0 z-10 mb-4 rounded-2xl border border-line bg-panel/80 px-4 py-3 shadow-sm backdrop-blur transition-colors duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div key={personaId} className="persona-fade flex items-center gap-3">
              <PersonaAvatar personaId={personaId} size={40} showStatus />
              <div>
                <div className="text-sm font-medium text-paper">{persona.displayName}</div>
                <div className="text-xs text-muted">{persona.tagline}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {providerId} • {thread.messages.length} messages
              </div>
              <PersonaSwitch value={personaId} onChange={setPersonaId} />
              <ModelSwitch value={providerId} onChange={setProviderId} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {isEmpty ? (
          <div key={personaId} className="persona-fade flex flex-1 flex-col items-center justify-center px-2 text-center">
            <Logo size={52} glow className="mb-6" />
            <h2 className="mb-2 text-2xl font-semibold leading-tight text-paper sm:text-[26px]">
              Good to see you.
              <br />
              <span className="text-muted">What&apos;s on your mind?</span>
            </h2>
            <p className="mb-6 max-w-[42ch] text-sm leading-relaxed text-muted">
              You&apos;re talking to {persona.displayName} — {persona.tagline.toLowerCase()}
            </p>
            <div className="mb-4 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
              {providerHint}
            </div>

            <div className="mb-8 w-full max-w-xl">
              <Composer
                disabled={loading}
                onSend={handleSend}
                hint={`replying as ${persona.displayName.split(" ")[0]}`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-muted hover:text-paper"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 pb-4">
              <div key={personaId} className="persona-fade">
                {thread.messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    message={m}
                    personaId={personaId}
                    grouped={i > 0 && thread.messages[i - 1].role === m.role}
                  />
                ))}
              </div>
              {loading && <TypingIndicator personaId={personaId} />}
              {error && (
                <div className="mt-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}
            </div>

            <Composer disabled={loading} onSend={handleSend} />
          </>
        )}
      </div>
    </div>
  );
}
