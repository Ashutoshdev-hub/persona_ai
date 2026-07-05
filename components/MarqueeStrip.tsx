import PersonaAvatar from "./PersonaAvatar";
import { personas } from "@/lib/personas";
import { PersonaId } from "@/lib/personas/types";

interface Snippet {
  personaId: PersonaId;
  text: string;
}

const SNIPPETS: Snippet[] = [
  { personaId: "hitesh", text: "Chai leke baitho, phir samjhte hain closures." },
  { personaId: "piyush", text: "Design the schema before you touch the frontend." },
  { personaId: "hitesh", text: "Tutorial hell se bahar niklo — project banao, seekhoge." },
  { personaId: "piyush", text: "Ship the boring version first. Iterate after it's live." },
  { personaId: "hitesh", text: "Docs padhna seekho, Stack Overflow copy baad mein." },
  { personaId: "piyush", text: "Your bottleneck is rarely the framework — it's the data model." },
  { personaId: "hitesh", text: "Consistency > motivation. Roz thoda thoda karo." },
  { personaId: "piyush", text: "If you can't explain the architecture in two lines, simplify it." },
];

function Card({ personaId, text }: Snippet) {
  const persona = personas[personaId];
  const isChai = persona.accent === "chai";
  return (
    <div
      className={[
        "flex w-[19rem] shrink-0 items-start gap-3 rounded-2xl border border-line px-4 py-3.5 shadow-sm",
        isChai ? "bg-chai-soft" : "bg-signal-soft",
      ].join(" ")}
    >
      <PersonaAvatar personaId={personaId} size={32} />
      <div>
        <div
          className={[
            "mb-0.5 font-mono text-[10px] font-medium uppercase tracking-wide",
            isChai ? "text-chai" : "text-signal",
          ].join(" ")}
        >
          {persona.displayName}
        </div>
        <p className="text-sm leading-snug text-paper">{text}</p>
      </div>
    </div>
  );
}

export default function MarqueeStrip() {
  const loop = [...SNIPPETS, ...SNIPPETS];
  return (
    <div className="marquee-fade marquee-track overflow-hidden">
      <div className="flex w-max gap-3 animate-marquee">
        {loop.map((s, i) => (
          <Card key={i} personaId={s.personaId} text={s.text} />
        ))}
      </div>
    </div>
  );
}
