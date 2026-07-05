"use client";

import { KeyboardEvent, useRef, useState } from "react";

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
  hint?: string;
}

const MAX_HEIGHT = 160;

export default function Composer({ disabled, onSend, hint }: Props) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }

    if ((e.key === "Enter" && (e.ctrlKey || e.metaKey)) || (e.key === "Enter" && e.shiftKey)) {
      e.preventDefault();
      submit();
    }
  }

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div>
      {hint && (
        <div className="mb-2 flex items-center justify-between px-3 font-mono text-[11px] text-muted">
          <span>{hint}</span>
          <span className="flex items-center gap-1.5">
            <span className={["h-1.5 w-1.5 rounded-full", canSend ? "bg-signal animate-pulse" : "bg-line"].join(" ")} />
            {canSend ? "ready to send" : isFocused ? "press enter to send" : "thread active"}
          </span>
        </div>
      )}
      <div className="flex items-end gap-1 rounded-3xl border border-line bg-panel px-2 py-2 shadow-sm transition-colors focus-within:border-muted">
        <button
          type="button"
          aria-label="Attach"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-line/60 hover:text-paper"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            resize(e.target);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything…"
          rows={1}
          autoFocus
          className="max-h-40 flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-relaxed text-paper placeholder:text-muted focus:outline-none"
        />

        <button
          type="button"
          aria-label="Voice input"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-line/60 hover:text-paper"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal",
            canSend ? "bg-paper text-ink hover:scale-105 active:scale-95" : "cursor-not-allowed bg-line text-muted",
          ].join(" ")}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="translate-x-[-1px]">
            <path
              d="M4 12L20 4L13 20L11 13L4 12Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
