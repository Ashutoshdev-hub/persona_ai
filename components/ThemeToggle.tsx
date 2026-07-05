"use client";

import { useEffect, useState } from "react";

/** A small sliding switch, styled like an iOS toggle, that flips the whole
 *  site between the dark theme (default) and a light theme by adding/removing
 *  `.light` on <html>. The actual color values live in globals.css as CSS
 *  variables, so this component only ever touches one class name. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      // localStorage can be unavailable (private browsing etc.) — toggle still works for the session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      aria-pressed={isLight}
      className={[
        "relative flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border border-line bg-ink/40 px-1 transition-colors duration-300",
        mounted ? "opacity-100" : "opacity-0",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full bg-paper text-ink shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]",
          isLight ? "translate-x-[1.125rem]" : "translate-x-0",
        ].join(" ")}
      >
        {isLight ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2.5v2" />
              <path d="M12 19.5v2" />
              <path d="M4.2 4.2l1.4 1.4" />
              <path d="M18.4 18.4l1.4 1.4" />
              <path d="M2.5 12h2" />
              <path d="M19.5 12h2" />
              <path d="M4.2 19.8l1.4-1.4" />
              <path d="M18.4 5.6l1.4-1.4" />
            </g>
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
