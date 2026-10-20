import type { ReactNode } from "react";

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between pb-6 pt-3">
      <h1 className="text-[1.65rem] font-semibold">{title}</h1>
      {right}
    </header>
  );
}

/** Dodo the earthworm — same drawing as the app icon. The body ripples; the eye blinks. */
const BODY_A = "M96 352 C 130 250, 210 250, 240 320 S 330 390, 362 250";
const BODY_B = "M96 344 C 136 270, 206 232, 244 306 S 326 376, 362 250";
export function Worm({ size = 220, still = false }: { size?: number; still?: boolean }) {
  const anim = (from: string, to: string) =>
    still ? null : <animate attributeName="d" dur="1.8s" repeatCount="indefinite" values={`${from};${to};${from}`} calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />;
  return (
    <svg width={size} height={size * 0.72} viewBox="40 120 440 330" aria-hidden="true">
      <ellipse cx="250" cy="404" rx="160" ry="14" fill="#2A2346" opacity=".08" />
      <path d={BODY_A} fill="none" stroke="#FF6F91" strokeWidth="92" strokeLinecap="round">{anim(BODY_A, BODY_B)}</path>
      <path d={BODY_A} fill="none" stroke="#E85A80" strokeWidth="92" strokeDasharray="6 46" opacity=".45">{anim(BODY_A, BODY_B)}</path>
      <g className={still ? "" : "seg"}>
        <circle cx="364" cy="214" r="78" fill="#FF6F91" />
        <circle cx="398" cy="246" r="13" fill="#FF9DB4" />
        <g className="eye"><circle cx="378" cy="190" r="23" fill="#fff" /><circle cx="384" cy="194" r="12" fill="#2A2346" /></g>
        <path d="M342 248 q24 20 48 0" stroke="#2A2346" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Small square app mark, same worm. */
export function WormMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="28" fill="#ECE8FF" />
      <path d="M22 62 Q34 40 48 58 T72 54" fill="none" stroke="#FF6F91" strokeWidth="13" strokeLinecap="round" />
      <circle cx="74" cy="48" r="12" fill="#FF6F91" />
      <circle cx="77" cy="45" r="3.5" fill="#2A2346" />
    </svg>
  );
}
