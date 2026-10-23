import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, X, Check } from "lucide-react";
import { Btn, CUBE_BG } from "./shared";
import { cn } from "@/lib/utils";

type Phase = "idle" | "memorize" | "recall" | "won" | "lost";
const SIZE = 9;
const MEMO_MS = 3000;

export function pickPattern(count: number, rand = Math.random): Map<number, number> {
  const idx = Array.from({ length: SIZE }, (_, i) => i).sort(() => rand() - 0.5).slice(0, count);
  return new Map(idx.map((i) => [i, Math.floor(rand() * 6)]));
}

export function PatternGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [pattern, setPattern] = useState<Map<number, number>>(new Map());
  const [found, setFound] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const [left, setLeft] = useState(MEMO_MS);
  const [recallStart, setRecallStart] = useState(0);
  const [lastGain, setLastGain] = useState(0);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => setBest(Number(localStorage.getItem("nb-best") || 0)), []);

  const count = Math.min(2 + level, 7);

  const start = (lvl = level) => {
    setLevel(lvl);
    setPattern(pickPattern(Math.min(2 + lvl, 7)));
    setFound(new Set());
    setWrong(null);
    setLeft(MEMO_MS);
    setPhase("memorize");
  };

  useEffect(() => {
    if (phase !== "memorize") return;
    const t0 = performance.now();
    const id = setInterval(() => {
      const remaining = MEMO_MS - (performance.now() - t0);
      if (remaining <= 0) {
        clearInterval(id);
        setLeft(0);
        setPhase("recall");
        setRecallStart(performance.now());
        setTimeout(() => tiles.current[0]?.focus(), 30);
      } else setLeft(remaining);
    }, 50);
    return () => clearInterval(id);
  }, [phase]);

  const pick = (i: number) => {
    if (phase !== "recall" || found.has(i)) return;
    if (!pattern.has(i)) {
      setWrong(i);
      setPhase("lost");
      return;
    }
    const next = new Set(found).add(i);
    setFound(next);
    if (next.size === pattern.size) {
      const secs = (performance.now() - recallStart) / 1000;
      const gain = level * 100 + Math.max(0, Math.round((10 - secs) * 10));
      const total = score + gain;
      setLastGain(gain);
      setScore(total);
      if (total > best) { setBest(total); localStorage.setItem("nb-best", String(total)); }
      setPhase("won");
    }
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 };
    if (map[e.key] !== undefined) {
      e.preventDefault();
      const n = i + map[e.key]!;
      if (n >= 0 && n < SIZE) tiles.current[n]?.focus();
    }
  };

  const reset = () => { setPhase("idle"); setLevel(1); setScore(0); setFound(new Set()); setWrong(null); };

  const statusText: Record<Phase, string> = {
    idle: "Ready when you are.",
    memorize: `Memorize ${count} tiles… ${(left / 1000).toFixed(1)}s`,
    recall: `Find them: ${found.size} / ${pattern.size}`,
    won: `Solved! +${lastGain} points. Level ${level + 1} adds a tile.`,
    lost: `Missed one. You found ${found.size} / ${pattern.size}.`,
  };

  return (
    <section id="challenge" aria-labelledby="game-title" className="mx-auto max-w-7xl px-6 py-24">
      <div className="card-surface grid gap-10 p-6 md:grid-cols-[1fr_auto] md:p-12">
        <div className="flex flex-col justify-center">
          <p className="label-mono mb-4"><span className="text-primary">01</span> // MINI-GAME · OPTIONAL</p>
          <h2 id="game-title" className="font-display text-3xl font-bold md:text-5xl">CAN YOU SOLVE IT?</h2>
          <p className="mt-3 font-mono text-sm text-accent">Think fast. Recognize the pattern. Make your move.</p>
          <p className="mt-6 max-w-md text-muted-foreground">
            <strong className="text-foreground">How to play:</strong> memorize the colored tiles for 3 seconds, then tap every tile that was lit — one wrong tap ends the round.
          </p>
          <dl className="mt-8 grid max-w-sm grid-cols-3 gap-3 font-mono">
            {[["Level", level], ["Score", score], ["Best", best]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border p-3">
                <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
                <dd className="text-xl font-bold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            {phase === "idle" && <Btn onClick={() => start(1)}><Play className="h-4 w-4" /> Start challenge</Btn>}
            {phase === "won" && <Btn onClick={() => start(level + 1)}><Check className="h-4 w-4" /> Next level</Btn>}
            {phase === "lost" && <Btn onClick={() => { setScore(0); start(1); }}><RotateCcw className="h-4 w-4" /> Try again</Btn>}
            {phase !== "idle" && <Btn variant="outline" onClick={reset}><X className="h-4 w-4" /> Quit</Btn>}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[340px]">
          <div className="mb-3 flex items-center justify-between font-mono text-xs" aria-live="polite">
            <span className={cn(phase === "won" && "text-primary", phase === "lost" && "text-destructive", phase === "recall" && "text-accent")}>
              {statusText[phase]}
            </span>
          </div>
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div
              className={cn("h-full transition-[width] duration-100", phase === "memorize" ? "bg-accent" : "bg-primary")}
              style={{ width: phase === "memorize" ? `${(left / MEMO_MS) * 100}%` : phase === "recall" || phase === "won" ? `${(found.size / Math.max(1, pattern.size)) * 100}%` : "0%" }}
            />
          </div>
          <div role="grid" aria-label="Pattern grid" className={cn("grid grid-cols-3 gap-2.5 rounded-2xl bg-background p-3 ring-1 ring-border", phase === "lost" && "animate-shake")}>
            {Array.from({ length: SIZE }).map((_, i) => {
              const color = pattern.get(i);
              const show = phase === "memorize" || phase === "won" || phase === "lost" ? color !== undefined : found.has(i);
              const isWrong = wrong === i;
              return (
                <button
                  key={i}
                  ref={(r) => { tiles.current[i] = r; }}
                  disabled={phase !== "recall"}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  aria-label={`Tile ${i + 1}${found.has(i) ? ", found" : ""}`}
                  className={cn(
                    "aspect-square rounded-lg transition-all duration-200",
                    show && color !== undefined ? CUBE_BG[color] : "bg-tile-off",
                    phase === "recall" && !found.has(i) && "cursor-pointer hover:ring-2 hover:ring-accent",
                    phase === "lost" && color !== undefined && !found.has(i) && "opacity-40",
                    isWrong && "bg-destructive ring-2 ring-destructive",
                    found.has(i) && "scale-95",
                  )}
                />
              );
            })}
          </div>
          <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">Mouse, touch or arrow keys + Enter</p>
        </div>
      </div>
    </section>
  );
}
