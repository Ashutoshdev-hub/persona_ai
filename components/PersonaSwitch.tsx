"use client";

import { PersonaId } from "@/lib/personas/types";
import { personas } from "@/lib/personas";

interface Props {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
}

export default function PersonaSwitch({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
        Persona
      </span>
      <div className="flex rounded-full border border-line bg-ink/40 p-0.5">
        {(Object.keys(personas) as PersonaId[]).map((id) => {
          const active = id === value;
          const persona = personas[id];
          const isChai = persona.accent === "chai";
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={active}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal",
                active
                  ? isChai
                    ? "bg-chai text-ink shadow-sm"
                    : "bg-signal text-ink shadow-sm"
                  : "text-muted hover:text-paper",
              ].join(" ")}
            >
              {persona.displayName.split(" ")[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
