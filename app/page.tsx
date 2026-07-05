"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import PersonaAvatar from "@/components/PersonaAvatar";
import TerminalPreview from "@/components/TerminalPreview";
import MarqueeStrip from "@/components/MarqueeStrip";
import ThemeToggle from "@/components/ThemeToggle";
import { personas } from "@/lib/personas";

const STEPS = [
  {
    n: "01",
    title: "Pick a persona",
    body: "Hitesh brings practical, build-it-yourself energy. Piyush brings structured, systems-first thinking.",
  },
  {
    n: "02",
    title: "Ask a real question",
    body: "Architecture, career, a bug, or a rant about your stack — it replies in that persona's voice.",
  },
  {
    n: "03",
    title: "Switch anytime",
    body: "Change persona or model mid-flow and see the other angle without losing the thread.",
  },
];

const FEATURES = [
  {
    title: "Available 24/7",
    body: "No scheduling, no waiting for office hours — ask whenever the question (or the bug) shows up.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Two perspectives",
    body: "Same question, two mentors. Compare practical build-it-yourself advice against structured, systems-first thinking.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M7 8l-3.5 3.5L7 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 8l3.5 3.5L17 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 5l-4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Real conversation",
    body: "Not a FAQ bot — it keeps context across the thread, so follow-ups actually build on what came before.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const PROMPTS_BY_PERSONA = {
  hitesh: [
    "Explain this bug like I’m five",
    "What should I learn first in backend development?",
    "Roast my app idea without being cruel",
  ],
  piyush: [
    "Show me a production-grade architecture for this feature",
    "What should I build to get job-ready fast?",
    "Help me debug this like a senior engineer",
  ],
};

export default function LandingPage() {
  const personaIds = Object.keys(personas) as Array<keyof typeof personas>;
  const [activePersonaId, setActivePersonaId] = useState<keyof typeof personas>("hitesh");
  const activePersona = personas[activePersonaId];
  const activePrompts = PROMPTS_BY_PERSONA[activePersonaId];

  return (
    <div className="ambient-wash min-h-screen transition-colors duration-300">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-10 flex items-center justify-between sm:mb-16">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="text-[15px] font-semibold tracking-tight text-paper">Persona AI</span>
          </div>
          <nav className="hidden items-center gap-6 font-mono text-xs text-muted sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-paper">
              How it works
            </a>
            <a href="#personas" className="transition-colors hover:text-paper">
              Personas
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/chat"
              className="rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Start chatting
            </Link>
          </div>
        </div>

        <div className="fade-up mb-12 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="glass-card rounded-[30px] border border-line bg-panel/90 p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">
                  live persona switcher
                </div>
                <div className="mt-1 text-lg font-semibold text-paper">Choose the voice that fits your mood</div>
              </div>
              <div className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
                2 voices • 2 models
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {personaIds.map((id) => {
                const persona = personas[id];
                const isActive = id === activePersonaId;
                const isChai = persona.accent === "chai";
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActivePersonaId(id)}
                    className={[
                      "rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? isChai
                          ? "bg-chai text-ink shadow-sm"
                          : "bg-signal text-ink shadow-sm"
                        : "bg-ink/40 text-muted hover:text-paper",
                    ].join(" ")}
                  >
                    {persona.displayName.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            <h1 className="mb-4 text-[30px] font-semibold leading-[1.12] tracking-tight text-paper sm:text-[40px]">
              Two educators.
              <br />
              <span className="text-muted">One very different take on the same challenge.</span>
            </h1>
            <p className="max-w-[54ch] text-[15px] leading-relaxed text-muted sm:text-base">
              An AI simulation of Hitesh Choudhary and Piyush Garg — pick who you want to talk to,
              ask a real question, and switch mindsets mid-conversation whenever you want.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/chat?persona=${activePersonaId}`}
                className="rounded-full bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                Start with {activePersona.displayName.split(" ")[0]}
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-line px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-muted hover:text-paper"
              >
                How it works
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {activePrompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={`/chat?persona=${activePersonaId}`}
                  className="rounded-full border border-line bg-ink/30 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-muted hover:text-paper"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[30px] border border-line bg-panel/80 p-6 shadow-sm sm:p-8">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-dim">
              persona preview
            </div>
            <div className="rounded-[24px] border border-line bg-ink/30 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PersonaAvatar personaId={activePersonaId} size={42} />
                  <div>
                    <div className="text-sm font-semibold text-paper">{activePersona.displayName}</div>
                    <div className="text-xs text-muted">{activePersona.tagline}</div>
                  </div>
                </div>
                <div className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  live
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-panel/70 p-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  sample question
                </div>
                <div className="text-sm leading-relaxed text-paper">“{activePrompts[0]}”</div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ink/20 p-4">
                <div className="mb-1 text-sm font-semibold text-paper">Context aware</div>
                <div className="text-sm leading-relaxed text-muted">Follow-up questions stay in the same thread so the conversation compounds.</div>
              </div>
              <div className="rounded-2xl border border-line bg-ink/20 p-4">
                <div className="mb-1 text-sm font-semibold text-paper">Switch styles</div>
                <div className="text-sm leading-relaxed text-muted">Move from practical teaching to systems-first advice with one tap.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="fade-up mb-16 -mx-4" style={{ animationDelay: "140ms" }}>
          <MarqueeStrip />
        </div>

        <div className="fade-up mb-16" style={{ animationDelay: "160ms" }}>
          <TerminalPreview />
        </div>

        <div className="fade-up mb-16" style={{ animationDelay: "180ms" }}>
          <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wide text-dim">
            why persona ai
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-line bg-panel px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-signal-soft text-signal transition-transform duration-200 group-hover:scale-110">
                  {f.icon}
                </div>
                <div className="mb-2 text-[15px] font-medium text-paper">{f.title}</div>
                <div className="text-sm leading-relaxed text-muted">{f.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="how-it-works" className="fade-up mb-16 scroll-mt-8" style={{ animationDelay: "200ms" }}>
          <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-wide text-dim">
            how it works
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-line bg-panel px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="mb-3 font-mono text-xs text-dim">{s.n}</div>
                <div className="mb-2 text-[15px] font-medium text-paper">{s.title}</div>
                <div className="text-sm leading-relaxed text-muted">{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="personas"
          className="fade-up mb-16 grid scroll-mt-8 gap-4 sm:grid-cols-2"
          style={{ animationDelay: "220ms" }}
        >
          {personaIds.map((id) => {
            const persona = personas[id];
            return (
              <Link
                key={id}
                href={`/chat?persona=${id}`}
                className="group rounded-2xl border border-line bg-panel px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-muted hover:shadow-md"
              >
                <PersonaAvatar personaId={id} size={44} className="mb-4" />
                <div className="font-mono text-[11px] uppercase tracking-wide text-dim">
                  talk to
                </div>
                <div className="mb-2 text-lg text-paper">{persona.displayName}</div>
                <div className="mb-5 text-sm leading-relaxed text-muted">{persona.tagline}</div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-paper opacity-70 transition-all duration-200 group-hover:gap-2.5 group-hover:opacity-100">
                  start chat <span aria-hidden>→</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-line pt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo size={22} />
              <span className="text-sm font-medium text-paper">Persona AI</span>
            </div>
            <div className="flex items-center gap-5 font-mono text-xs text-muted">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
                GitHub
              </a>
              <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
                Built with Next.js
              </a>
              <Link href="/chat" className="transition-colors hover:text-paper">
                Start chatting
              </Link>
            </div>
          </div>
          <p className="font-mono text-xs leading-relaxed text-dim">
            This is an unofficial AI simulation built for an educational assignment — it is not
            affiliated with, endorsed by, or a real statement from Hitesh Choudhary or Piyush Garg.
            Responses are generated by an LLM matched to a researched persona profile, not the real people.
          </p>
        </div>
      </div>
    </div>
  );
}
