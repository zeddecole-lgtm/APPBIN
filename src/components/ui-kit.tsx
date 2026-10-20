import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { getLaunch, iconFor, subscribeLaunch } from "@/lib/links";

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between pb-6 pt-3">
      <h1 className="text-[1.75rem] font-semibold">{title}</h1>
      {right}
    </header>
  );
}

/**
 * Secret text box that password managers ignore: it is a plain text field
 * drawn as dots, outside any <form>, so Chrome/Google never offers to save it.
 */
export function SecretInput({ value, onChange, onEnter, placeholder, className, id, autoFocus }: {
  value: string; onChange: (v: string) => void; onEnter?: () => void; placeholder?: string; className?: string; id?: string; autoFocus?: boolean;
}) {
  const [name] = useState(() => "x" + Math.random().toString(36).slice(2));
  return (
    <input id={id} name={name} type="text" value={value} autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter?.(); } }}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} inputMode="text" enterKeyHint="go"
      data-lpignore="true" data-1p-ignore="true" data-form-type="other" data-bwignore="true"
      placeholder={placeholder} className={`secret ${className ?? ""}`} />
  );
}

/** One icon style for every app: the site's own icon on a white rounded tile. */
export function AppIcon({ url, name, size = "4.25rem" }: { url: string; name: string; size?: string }) {
  const [failed, setFailed] = useState(false);
  const letters = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
  return (
    <span className="grid shrink-0 place-items-center overflow-hidden rounded-[28%] bg-white shadow-[0_6px_16px_-8px_rgb(0_0_0/0.6)]" style={{ width: size, height: size }}>
      {failed ? (
        <span className="font-display text-[1.15rem] font-bold text-[#131418]">{letters}</span>
      ) : (
        <img src={iconFor(url)} alt="" className="size-[58%] object-contain" onError={() => setFailed(true)}
          onLoad={(e) => { if ((e.target as HTMLImageElement).naturalWidth < 8) setFailed(true); }} />
      )}
    </span>
  );
}

/** Full-screen "opening" moment so leaving for the site feels like part of the app. */
export function LaunchOverlay() {
  const l = useSyncExternalStore(subscribeLaunch, getLaunch, () => null);
  const [shown, setShown] = useState(false);
  useEffect(() => { if (l) requestAnimationFrame(() => setShown(true)); }, [l]);
  // Coming back with the browser's back button restores this page from cache; clear the overlay.
  useEffect(() => {
    const f = (e: PageTransitionEvent) => { if (e.persisted) window.location.reload(); };
    window.addEventListener("pageshow", f);
    return () => window.removeEventListener("pageshow", f);
  }, []);
  if (!l) return null;
  return (
    <div className={`fixed inset-0 z-[70] grid place-items-center bg-background transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}>
      <div className="flex flex-col items-center gap-5">
        <div className="launch-pop"><AppIcon url={l.url} name={l.name} size="5.5rem" /></div>
        <p className="text-lg font-semibold">Opening {l.name}</p>
        <span className="h-1 w-28 overflow-hidden rounded-full bg-muted"><span className="loading-bar block h-full w-1/3 rounded-full bg-primary" /></span>
      </div>
    </div>
  );
}

/** Dodo the earthworm — same drawing as the app icon. The body ripples; the eye blinks. */
const BODY_A = "M96 352 C 130 250, 210 250, 240 320 S 330 390, 362 250";
const BODY_B = "M96 344 C 136 270, 206 232, 244 306 S 326 376, 362 250";
export function Worm({ className, still = false }: { className?: string; still?: boolean }) {
  const anim = (from: string, to: string) =>
    still ? null : <animate attributeName="d" dur="1.8s" repeatCount="indefinite" values={`${from};${to};${from}`} calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />;
  return (
    <svg className={className} viewBox="40 120 440 330" aria-hidden="true">
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
