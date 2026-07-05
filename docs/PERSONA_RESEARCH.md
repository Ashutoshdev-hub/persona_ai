# Persona Research

## What this repo's personas are currently built on

The system prompts in `lib/personas/hitesh.ts` and `lib/personas/piyush.ts` were built
from public secondary material: official bios, course descriptions, and independent
write-ups describing each person's known teaching approach and background. This is
enough to encode **teaching philosophy** (how they approach a question, what they
prioritize, what they push back on) with reasonable confidence.

It is **not** enough to encode exact speech patterns with high confidence, and the
persona files say so explicitly — see the `NOTE ON CONFIDENCE` block in `piyush.ts` in
particular. Claiming otherwise in a submission is the kind of thing an evaluator checks
first and loses trust immediately if it doesn't hold up.

## Why transcript analysis is the required next step, not optional polish

Verbal tics, sentence rhythm, how someone actually opens an explanation, how much Hindi
they mix in and where — that only shows up in transcripts of real, extended speech.
Bios and tweets don't contain it. Before submitting, replace the confidence gap by:

1. **Pull transcripts, not clips.** Use `youtube-transcript-api` (Python) or `yt-dlp
   --write-auto-sub` against 5–8 long-form videos per person — prioritize tutorials
   where they're explaining a concept start to finish, plus one podcast/interview
   appearance each if available (interviews surface unscripted reasoning and opinions,
   which tutorial delivery doesn't).
2. **Extract patterns, not quotes.** Don't paste transcripts into the system prompt
   verbatim — that's a copyright and bloat problem, and it doesn't generalize. Instead,
   read for: how they open an explanation, how they handle "I don't understand," their
   actual Hindi/English ratio and where the switch happens, recurring phrases used
   *sparingly* rather than every sentence, how they close out a topic.
3. **Update the `systemPrompt` and `providerNotes` fields** in the two persona files
   with what you find. Keep the structure (Teaching Philosophy / Voice / Boundaries) —
   just correct the specifics against real evidence.
4. **Sanity-check against a control question.** Ask each persona something *outside*
   any sampled video (e.g. an opinion question, or a debugging scenario you invented).
   If it collapses into generic-assistant tone the moment it's off-script, the prompt is
   encoding phrases, not a personality — go back to step 2.

## Why social media alone was rejected as the primary source

Twitter/Instagram content is short-form personal-brand material — it's where surface
tics live, not teaching approach, and "teaching approach" is graded separately from
"vocabulary" in the brief. Building a persona primarily from tweets produces a bot that
name-drops chai and says "haanji" but can't actually explain a concept the way the real
person does. It's a documented failure mode in public write-ups of near-identical past
projects — worth avoiding on the record, not just avoiding.
