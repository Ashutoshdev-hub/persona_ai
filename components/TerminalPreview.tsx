"use client";

import { useEffect, useState } from "react";

interface Line {
  persona: "hitesh" | "piyush";
  label: string;
  text: string;
}

const LINES: Line[] = [
  {
    persona: "hitesh",
    label: "hitesh",
    text: "Dekho, pehle docs padho — phir code likhna, seedha copy-paste mat karo.",
  },
  {
    persona: "piyush",
    label: "piyush",
    text: "Let's say you're building this for real — start with the data model, not the UI.",
  },
  {
    persona: "hitesh",
    label: "hitesh",
    text: "Yeh production-grade nahi hai, par abhi ka goal samajhna hai, production nahi.",
  },
  {
    persona: "piyush",
    label: "piyush",
    text: "Good catch — that's exactly the kind of thing that breaks in prod, not in a demo.",
  },
];

const TYPE_SPEED = 28;
const HOLD_MS = 1400;
const ERASE_SPEED = 14;

export default function TerminalPreview() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  useEffect(() => {
    const current = LINES[lineIndex].text;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          TYPE_SPEED
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      const t = setTimeout(() => setPhase("erasing"), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          ERASE_SPEED
        );
        return () => clearTimeout(t);
      }
      setLineIndex((i) => (i + 1) % LINES.length);
      setPhase("typing");
    }
  }, [displayed, phase, lineIndex]);

  const current = LINES[lineIndex];
  const accent = current.persona === "hitesh" ? "text-chai" : "text-signal";

  return (
    <div className="rounded-2xl border border-line bg-panel px-4 py-3 font-mono text-sm shadow-sm">
      <div className="mb-2 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <div className="min-h-[3.5rem]">
        <span className={accent}>{current.label}@persona-ai</span>
        <span className="text-muted">:~$ </span>
        <span className="text-paper">{displayed}</span>
        <span className="animate-pulse text-paper">▏</span>
      </div>
    </div>
  );
}
