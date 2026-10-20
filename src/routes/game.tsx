import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/game")({
  head: () => ({ meta: [{ title: "Dodo — Play" }, { name: "description", content: "Eat leaves, grow long, don't bite yourself." }] }),
  component: Game,
});

const N = 15;
type P = { x: number; y: number };
const rnd = (avoid: P[] = []): P => {
  for (;;) {
    const p = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    if (!avoid.some((a) => a.x === p.x && a.y === p.y)) return p;
  }
};
const START: P[] = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
const BEST = "dodo-best";

function Game() {
  const [snake, setSnake] = useState<P[]>(START);
  const [food, setFood] = useState<P>({ x: 10, y: 7 });
  const [state, setState] = useState<"ready" | "play" | "over">("ready");
  const [best, setBest] = useState(0);
  const dir = useRef<P>({ x: 1, y: 0 });
  const queued = useRef<P | null>(null);
  const touch = useRef<P | null>(null);
  const score = snake.length - START.length;

  useEffect(() => { try { setBest(Number(localStorage.getItem(BEST)) || 0); } catch { /* ignore */ } }, []);

  const turn = useCallback((d: P) => {
    const cur = queued.current ?? dir.current;
    if (d.x === -cur.x && d.y === -cur.y) return;
    queued.current = d;
    setState((s) => (s === "ready" ? "play" : s));
  }, []);

  useEffect(() => {
    const m: Record<string, P> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
    const k = (e: KeyboardEvent) => { const d = m[e.key]; if (d) { e.preventDefault(); turn(d); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [turn]);

  useEffect(() => {
    if (state !== "play") return;
    const speed = Math.max(85, 165 - score * 4);
    const t = setInterval(() => {
      if (queued.current) { dir.current = queued.current; queued.current = null; }
      setSnake((s) => {
        const head = s[0]!;
        const h = { x: (head.x + dir.current.x + N) % N, y: (head.y + dir.current.y + N) % N };
        if (s.slice(0, -1).some((p) => p.x === h.x && p.y === h.y)) { setState("over"); return s; }
        const ate = h.x === food.x && h.y === food.y;
        const next = [h, ...(ate ? s : s.slice(0, -1))];
        if (ate) setFood(rnd(next));
        return next;
      });
    }, speed);
    return () => clearInterval(t);
  }, [food, state, score]);

  useEffect(() => {
    if (state === "over" && score > best) { setBest(score); try { localStorage.setItem(BEST, String(score)); } catch { /* ignore */ } }
  }, [state, score, best]);

  const restart = () => { setSnake(START); dir.current = { x: 1, y: 0 }; queued.current = null; setFood({ x: 10, y: 7 }); setState("ready"); };

  const onStart = (e: React.TouchEvent) => { const t = e.touches[0]!; touch.current = { x: t.clientX, y: t.clientY }; };
  const onEnd = (e: React.TouchEvent) => {
    const s = touch.current; if (!s) return;
    const t = e.changedTouches[0]!; const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  };

  const cell = 100 / N;
  const key = "dodo-key grid h-16 place-items-center";

  return (
    <main className="dodo min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-[30rem] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Back" className="dodo-key grid size-12 place-items-center"><ChevronLeft className="size-6" /></Link>
          <div className="flex gap-2 text-center">
            <div className="dodo-card px-4 py-1.5"><p className="text-xs font-bold opacity-50">Score</p><p className="text-2xl font-extrabold leading-tight">{score}</p></div>
            <div className="dodo-card px-4 py-1.5"><p className="text-xs font-bold opacity-50">Best</p><p className="text-2xl font-extrabold leading-tight">{best}</p></div>
          </div>
        </div>

        <div onTouchStart={onStart} onTouchEnd={onEnd}
          className="relative mt-5 aspect-square w-full touch-none overflow-hidden rounded-[28px] bg-[#5B4A6E] shadow-[0_4px_0_#3F3250]"
          style={{ backgroundImage: "radial-gradient(circle, rgb(255 255 255 / 9%) 1.5px, transparent 1.6px)", backgroundSize: `${cell}% ${cell}%`, backgroundPosition: `${cell / 2}% ${cell / 2}%` }}>
          <svg viewBox={`0 0 ${N} ${N}`} className="absolute inset-0 size-full">
            <g transform={`translate(${food.x + 0.5} ${food.y + 0.5})`}>
              <path d="M0 -0.38 C0.32 -0.3 0.36 0.14 0 0.38 C-0.36 0.14 -0.32 -0.3 0 -0.38Z" fill="#5FD39A" />
              <path d="M0 -0.25 V0.3" stroke="#2FA873" strokeWidth="0.06" />
            </g>
            {snake.slice(1).map((p, i) => {
              const q = snake[i]!;
              if (Math.abs(p.x - q.x) + Math.abs(p.y - q.y) !== 1) return null;
              return <line key={`l${i}`} x1={q.x + 0.5} y1={q.y + 0.5} x2={p.x + 0.5} y2={p.y + 0.5} stroke="#FF6F91" strokeWidth="0.8" strokeLinecap="round" />;
            })}
            {snake.map((p, i) => (
              <circle key={i} cx={p.x + 0.5} cy={p.y + 0.5} r={i === 0 ? 0.5 : 0.44 - Math.min(i, 12) * 0.006} fill={i === 0 ? "#FF6F91" : i % 2 ? "#FF7E9C" : "#FF6F91"} />
            ))}
            <circle cx={snake[0]!.x + 0.5 + dir.current.x * 0.15} cy={snake[0]!.y + 0.5 + dir.current.y * 0.15 - 0.1} r="0.16" fill="#fff" />
            <circle cx={snake[0]!.x + 0.5 + dir.current.x * 0.2} cy={snake[0]!.y + 0.5 + dir.current.y * 0.2 - 0.1} r="0.08" fill="#2A2346" />
          </svg>
          {state !== "play" && (
            <div className={`absolute inset-0 grid place-items-center text-center text-white ${state === "over" ? "bg-[#2A2346]/55" : "place-items-end pb-6"}`}>
              {state === "ready" ? (
                <p className="mx-auto rounded-full bg-[#2A2346]/70 px-5 py-2 text-lg font-bold">Swipe or tap an arrow to start</p>
              ) : (
                <div className="rise">
                  <p className="text-4xl font-extrabold">Ouch!</p>
                  <p className="mt-1 text-lg font-semibold opacity-80">{score} {score === 1 ? "leaf" : "leaves"} eaten</p>
                  <button onClick={restart} className="dodo-btn mt-5 px-8 py-3.5 text-xl">Play again</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto mt-6 grid w-full max-w-[17rem] grid-cols-3 gap-2.5">
          <span /><button aria-label="Up" className={key} onClick={() => turn({ x: 0, y: -1 })}><ArrowUp className="size-7" /></button><span />
          <button aria-label="Left" className={key} onClick={() => turn({ x: -1, y: 0 })}><ArrowLeft className="size-7" /></button>
          <button aria-label="Down" className={key} onClick={() => turn({ x: 0, y: 1 })}><ArrowDown className="size-7" /></button>
          <button aria-label="Right" className={key} onClick={() => turn({ x: 1, y: 0 })}><ArrowRight className="size-7" /></button>
        </div>
      </div>
    </main>
  );
}
