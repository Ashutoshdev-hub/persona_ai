import { PersonaId } from "@/lib/personas/types";
import { personas } from "@/lib/personas";

interface Props {
  personaId: PersonaId;
  size?: number;
  showStatus?: boolean;
  className?: string;
}

const SIZE_TEXT: Record<number, string> = {
  28: "text-[10px]",
  36: "text-[11px]",
  40: "text-xs",
  44: "text-xs",
};

/** Consistent persona identity chip: initials on a gradient wash, ringed in
 *  the persona's accent, with an optional "online" status dot. Used anywhere
 *  a persona needs to be visually represented without a real photo. */
export default function PersonaAvatar({ personaId, size = 40, showStatus, className = "" }: Props) {
  const persona = personas[personaId];
  const isChai = persona.accent === "chai";
  const initials = persona.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={["relative shrink-0", className].join(" ")} style={{ width: size, height: size }}>
      <div
        className={[
          "flex h-full w-full items-center justify-center rounded-full font-mono font-semibold ring-1 ring-inset",
          SIZE_TEXT[size] ?? "text-xs",
          isChai
            ? "bg-gradient-to-br from-chai/30 to-chai/10 text-chai ring-chai/40"
            : "bg-gradient-to-br from-signal/30 to-signal/10 text-signal ring-signal/40",
        ].join(" ")}
      >
        {initials}
      </div>
      {showStatus && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel bg-emerald-400" />
      )}
    </div>
  );
}
