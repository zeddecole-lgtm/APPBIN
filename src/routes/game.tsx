import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Dodo — Snake Game" },
      { name: "description", content: "A simple worm game. Eat, grow, don't bite yourself." },
      { property: "og:title", content: "Dodo — Snake Game" },
      { property: "og:description", content: "A simple worm game. Eat, grow, don't bite yourself." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Game,
});

const N = 16;
type P = { x: number; y: number };
const rnd = (): P => ({ x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) });

function Game() {
  const [snake, setSnake] = useState<P[]>([{ x: 8, y: 8 }]);
  const [food, setFood] = useState<P>(rnd);
  const [over, setOver] = useState(false);
  const dir = useRef<P>({ x: 1, y: 0 });
  const turn = useCallback((d: P) => { if (d.x !== -dir.current.x || d.y !== -dir.current.y) dir.current = d; }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const m: Record<string, P> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const d = m[e.key]; if (d) { e.preventDefault(); turn(d); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [turn]);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setSnake((s) => {
        const head = s[0]!; const h = { x: (head.x + dir.current.x + N) % N, y: (head.y + dir.current.y + N) % N };
        if (s.some((p) => p.x === h.x && p.y === h.y)) { setOver(true); return s; }
        const ate = h.x === food.x && h.y === food.y;
        if (ate) setFood(rnd());
        return [h, ...(ate ? s : s.slice(0, -1))];
      });
    }, 140);
    return () => clearInterval(t);
  }, [food, over]);

  const restart = () => { setSnake([{ x: 8, y: 8 }]); dir.current = { x: 1, y: 0 }; setOver(false); setFood(rnd()); };
  const btn = "surface grid size-14 place-items-center";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 pt-8">
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground">← Back</Link>
        <p className="font-display text-lg font-bold">Score {snake.length - 1}</p>
      </div>
      <div className="surface relative mt-5 grid aspect-square w-full p-1" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
        {Array.from({ length: N * N }, (_, i) => {
          const x = i % N, y = Math.floor(i / N);
          const s = snake.findIndex((p) => p.x === x && p.y === y);
          const f = food.x === x && food.y === y;
          return <div key={i} className={`m-px rounded-sm ${s === 0 ? "bg-primary" : s > 0 ? "bg-primary/60" : f ? "bg-success rounded-full" : ""}`} />;
        })}
        {over && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-background/80">
            <div className="text-center">
              <p className="text-2xl font-semibold">Game over</p>
              <button onClick={restart} className="bg-gold mt-4 rounded-xl px-6 py-3 font-bold text-primary-foreground">Play again</button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <span /><button aria-label="Up" className={btn} onClick={() => turn({ x: 0, y: -1 })}><ArrowUp /></button><span />
        <button aria-label="Left" className={btn} onClick={() => turn({ x: -1, y: 0 })}><ArrowLeft /></button>
        <button aria-label="Down" className={btn} onClick={() => turn({ x: 0, y: 1 })}><ArrowDown /></button>
        <button aria-label="Right" className={btn} onClick={() => turn({ x: 1, y: 0 })}><ArrowRight /></button>
      </div>
    </main>
  );
}
