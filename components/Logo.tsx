interface Props {
  size?: number;
  glow?: boolean;
  className?: string;
}

/** The Persona AI mark: two interlocking arcs, echoing "two personas, one
 *  conversation." Renders inside a soft rounded square, optionally with an
 *  ambient glow behind it for hero placements. */
export default function Logo({ size = 44, glow = false, className = "" }: Props) {
  return (
    <div
      className={["relative inline-flex shrink-0", glow ? "glow-orb" : "", className].join(" ")}
      style={{ width: size, height: size }}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-2xl border border-line bg-gradient-to-br from-[#22261C] to-[#14150F] shadow-sm"
      >
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5c3.5 0 5.5 2.2 5.5 5s-2 5-5.5 5"
            stroke="#4FA6A0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 20.5c-3.5 0-5.5-2.2-5.5-5s2-5 5.5-5"
            stroke="#C88A3D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="17.5" cy="8.5" r="1.4" fill="#4FA6A0" />
          <circle cx="6.5" cy="15.5" r="1.4" fill="#C88A3D" />
        </svg>
      </div>
    </div>
  );
}
