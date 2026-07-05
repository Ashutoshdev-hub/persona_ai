import { ChatMessage, PersonaId } from "@/lib/personas/types";
import { personas } from "@/lib/personas";
import PersonaAvatar from "./PersonaAvatar";

interface Props {
  message: ChatMessage;
  personaId: PersonaId;
  /** True when the previous message in the thread was from the same sender —
   *  used to collapse spacing/avatars the way real messengers group runs. */
  grouped?: boolean;
}

/** Very small formatter: turns **bold** and `code` into styled spans without
 *  pulling in a markdown dependency. Anything else renders as plain text. */
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md bg-black/20 px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function MessageBubble({ message, personaId, grouped }: Props) {
  const isUser = message.role === "user";
  const persona = personas[personaId];
  const isChai = persona.accent === "chai";

  return (
    <div
      className={[
        "flex items-end gap-2",
        isUser ? "justify-end" : "justify-start",
        grouped ? "mt-1" : "mt-3",
      ].join(" ")}
    >
      {!isUser && (
        <div className={grouped ? "opacity-0" : "opacity-100"} aria-hidden={grouped}>
          <PersonaAvatar personaId={personaId} size={28} />
        </div>
      )}

      <div
        className={[
          "animate-bubble-in max-w-[78%] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm sm:max-w-[65%]",
          isUser
            ? "rounded-2xl rounded-br-md bg-paper text-ink"
            : isChai
              ? "rounded-2xl rounded-bl-md bg-chai-soft text-paper"
              : "rounded-2xl rounded-bl-md bg-signal-soft text-paper",
        ].join(" ")}
      >
        {!isUser && !grouped && (
          <div
            className={[
              "mb-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
              isChai ? "text-chai" : "text-signal",
            ].join(" ")}
          >
            {persona.displayName}
          </div>
        )}
        {renderContent(message.content)}
      </div>
    </div>
  );
}
