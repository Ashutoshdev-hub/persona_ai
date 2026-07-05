"use client";

import { ProviderId } from "@/lib/personas/types";

const PROVIDERS: { id: ProviderId; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "gemini", label: "Gemini" },
];

interface Props {
  value: ProviderId;
  onChange: (id: ProviderId) => void;
}

export default function ModelSwitch({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
        Model
      </span>
      <div className="flex rounded-full border border-line bg-ink/40 p-0.5">
        {PROVIDERS.map(({ id, label }) => {
          const active = id === value;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal",
                active ? "bg-paper text-ink shadow-sm" : "text-muted hover:text-paper",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
