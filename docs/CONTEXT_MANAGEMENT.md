# Context Management Approach

## The naive baseline, and why it's rejected

The common approach — send the full message array on every request — works fine for
short chats and quietly degrades on long ones: token cost grows without bound, and in
practice models pay less consistent attention to any single message as the transcript
grows, which shows up as persona drift or the model losing track of something said
20 turns ago. "Maintains persona across long conversations" is graded directly, so this
matters more than it looks like it should.

## What this repo does instead

See `lib/context-manager.ts`. Two mechanisms working together:

- **Sliding window.** The most recent `RECENT_TURN_WINDOW` (12) messages are always sent
  verbatim — recent exchanges need exact wording, not a summary of themselves.
- **Rolling summary.** Once history exceeds `SUMMARIZE_THRESHOLD` (16) messages, the
  turns that have aged out of the window are folded into a compact bullet-point summary
  via `provider.summarize()`, and that summary is re-sent as a lightweight synthetic
  message alongside the recent window on every subsequent request. The summary is only
  regenerated when new material ages out — not recomputed on every single call.

This keeps the token cost roughly constant regardless of how long the conversation gets,
while preserving facts and stated preferences from earlier in the conversation (name,
what they're building, prior answers given) that would otherwise fall out of a fixed
window entirely.

## Per-persona threads

State is kept as one thread per persona (`components/ChatShell.tsx`), not one global
thread. Switching PERSONA is switching who you're talking to — their memory of the
conversation shouldn't bleed into the other persona's thread. Switching MODEL, by
contrast, changes only which backend answers within the *current* thread — you're still
talking to the same simulated person, just routed through a different provider.

## Known limitation to disclose, not hide

Summarization itself is a model call, which means it inherits the same imperfection as
any other LLM output — it can occasionally drop a detail. The route handles
summarization failure by falling back to the previous summary rather than failing the
whole request (`app/api/chat/route.ts`), but it does not currently verify summary
quality. If you want to harden this further before submitting: log summaries during
testing and spot-check that key facts survive 2–3 summarization cycles in a row.
