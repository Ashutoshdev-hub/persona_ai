# Persona AI — Hitesh Choudhary / Piyush Garg

An AI chat interface that simulates two tech educators — Hitesh Choudhary and Piyush
Garg — switchable mid-session, backed by either OpenAI or Gemini.

Built for the GenAI with JS 2026 assignment. See `/docs` for the required
documentation (persona research methodology, prompt engineering strategy, context
management approach, sample conversations).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · `openai` SDK v6 · `@google/genai` v2

## Models used

| Provider | Default model         | Why                                                                 |
|----------|------------------------|----------------------------------------------------------------------|
| OpenAI   | `gpt-5.4-mini`          | Current cost/latency-optimized tier — GPT-4o and GPT-4o-mini are retired from the API's recommended path as of 2026. |
| Gemini   | `gemini-3.1-flash-lite` | Current cost-efficient GA model — Gemini 1.5 is fully shut down (404s) and 2.0/2.5 Flash are deprecated. |

Both are overridable via `OPENAI_MODEL` / `GEMINI_MODEL` in `.env.local` without touching
code — see `lib/providers/openai.ts` and `lib/providers/gemini.ts`. If you want higher
quality over lower cost, swap in `gpt-5.5` and `gemini-flash-latest` respectively.

**Note on the Gemini SDK specifically:** this project uses `@google/genai`, not the older
`@google/generative-ai` package. The older package hasn't been published since April 2025
and is functionally abandoned — worth checking directly with `npm view <package> time.modified`
before trusting any tutorial's import statements, including this README's, since model and
SDK names in this space go stale within months.

## Status / honesty note

The persona prompts here are built from public bio and course-description material, not
yet from direct YouTube transcript analysis — see `docs/PERSONA_RESEARCH.md` for exactly
what's solid, what's a lower-confidence placeholder (Piyush's voice profile especially),
and the concrete steps to close that gap before submission. Don't submit this without
doing that pass — the persona-accuracy section of the rubric is 30 of the marks.

## Setup

```bash
git clone <your-repo-url>
cd persona-ai
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.4-mini

GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.1-flash-lite
```

Get an OpenAI key from https://platform.openai.com/api-keys and a Gemini key from
https://aistudio.google.com/apikey. You only strictly need one to run the app — the
other provider's toggle will just error until its key is added, which is expected.

## Run locally

```bash
npm run dev
```

Open http://localhost:3000 — this is the landing page, with a card for each persona that
deep-links into `/chat?persona=hitesh` or `/chat?persona=piyush`. Inside the chat, use
the `PERSONA=` toggle to switch between Hitesh and Piyush, and the `MODEL=` toggle to
switch between OpenAI and Gemini. Each persona keeps its own conversation thread; the
model toggle only changes which backend answers within the current thread. Switching
persona cross-fades the message thread instead of snapping instantly.

## Build check

```bash
npm run build
```

## Project structure

```
app/
  page.tsx                # landing page: hero, persona cards, disclaimer
  chat/page.tsx            # chat route, reads ?persona= to set initial persona
  api/chat/route.ts        # unified endpoint: persona + provider + context management
  layout.tsx
components/
  ChatShell.tsx             # state: threads per persona, active provider, fade transition
  TerminalPreview.tsx        # landing page hero animation
  PersonaSwitch.tsx, ModelSwitch.tsx, MessageBubble.tsx, Composer.tsx
lib/
  personas/               # persona definitions (system prompt, voice, provider notes)
  providers/               # OpenAI + Gemini implementations behind a shared interface
  context-manager.ts       # sliding window + rolling summary
docs/
  PERSONA_RESEARCH.md, PROMPT_ENGINEERING.md, CONTEXT_MANAGEMENT.md,
  SAMPLE_CONVERSATIONS.md
```

## Deployment (Vercel)

1. Push this repo to GitHub (public, per submission requirements).
2. Import the repo at https://vercel.com/new.
3. Add `OPENAI_API_KEY`, `OPENAI_MODEL`, `GEMINI_API_KEY`, `GEMINI_MODEL` as environment
   variables in the Vercel project settings (same values as `.env.local`).
4. Deploy. No other config needed — this is a standard Next.js App Router project.

## Known gaps to close before submission

- [ ] Replace bio-derived persona prompts with transcript-derived ones (see
      `docs/PERSONA_RESEARCH.md` for the exact procedure).
- [ ] Regenerate `docs/SAMPLE_CONVERSATIONS.md` from real API calls once keys are added —
      the current file is illustrative, written to spec, not a live capture.
- [ ] Decide if you want persistent chat history (currently in-memory / lost on refresh)
      — not required by the brief, but worth a line in your submission if you skip it.
