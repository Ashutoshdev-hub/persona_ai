# Prompt Engineering Strategy

## Structure of each persona prompt

Each persona (`lib/personas/*.ts`) is built in three layers, in this order, because
order affects what the model treats as load-bearing:

1. **Teaching philosophy first.** What drives the person's answers — what they
   prioritize, what they push back on, how they sequence an explanation. This is placed
   before voice/vocabulary on purpose: a model given vocabulary first tends to produce a
   caricature that sounds right for one message and drifts immediately after; philosophy
   constrains *content*, which is more stable across a whole conversation than tone is.
2. **Voice**, with explicit good/bad contrast examples rather than adjectives alone.
   "Speak in Hinglish" underspecifies the actual ratio and rhythm; showing one caricature
   example and one natural example gives the model a concrete boundary to calibrate
   against instead of guessing.
3. **Boundaries** — explicit instructions not to fabricate specific personal claims
   (dates, private details) and to stay identifiable as an AI simulation if asked
   directly. This is a factual-accuracy and honesty guardrail, not a style choice.

## Provider calibration layer

The two target models (GPT via OpenAI, Gemini) have different default voices — GPT
tends toward hedged, symmetric paragraphs; Gemini defaults to markdown-heavy structure
even in casual conversation. Rather than writing one prompt and hoping it lands the same
on both, each persona carries a `providerNotes` field (see `lib/personas/types.ts`) that
is appended to the base prompt per-provider at request time (`app/api/chat/route.ts`).
Temperature is also tuned per provider (`persona.temperature`), since the same numeric
value doesn't produce equivalent "energy" across providers.

This is the direct answer to "make Gemini's responses as good as ChatGPT's": you don't
patch the model, you calibrate the prompt and parameters per-provider so both converge
on the same target persona. Chasing literal output parity between two different models
is not an achievable or sane target — the goal is consistent quality and persona-fit,
not identical wording.

## Few-shot vs. instruction-based approach

This implementation is instruction-based (philosophy + voice rules) rather than
few-shot (pasting example Q&A pairs into the prompt). Reasoning: few-shot examples are
easy to overfit to — the model reproduces the sampled topics well and drifts on anything
else, which is exactly the "collapses off-script" failure mode described in
`PERSONA_RESEARCH.md`. If you do add few-shot examples after transcript research, keep
them to 2–3 short exchanges per persona, covering different question *types* (a
technical explanation, an opinion question, a "I'm stuck" moment) rather than more
examples of the same type.

## Where to iterate

If responses feel off after transcript research is folded in, change the persona files
in this order: (1) Teaching Philosophy first — wrong content-shaping beats wrong tone
every time in terms of "does this feel like them," (2) Voice examples second, (3)
temperature last, since it affects variance, not correctness.
