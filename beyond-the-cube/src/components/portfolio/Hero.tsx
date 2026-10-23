import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Shuffle, Sparkles, ArrowDown } from "lucide-react";
import { Btn, CssCube, useReducedMotion } from "./shared";
import type { CubeCommand } from "./Cube3D";

const Cube3D = lazy(() => import("./Cube3D"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const rm = useReducedMotion();
  const [cmd, setCmd] = useState<CubeCommand | null>(null);
  const [busy, setBusy] = useState(false);
  const [scrambled, setScrambled] = useState(false);
  const [gl, setGl] = useState(true);
  const [status, setStatus] = useState("Idle — drag the cube to rotate it.");
  useEffect(() => setGl(hasWebGL()), []);

  const onBusy = useCallback((b: boolean, s: boolean) => {
    setBusy(b);
    setScrambled(s);
    setStatus(b ? "Turning layers…" : s ? "Scrambled. Hit SOLVE to reverse every move." : "Solved. Every scramble has a solution.");
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="bg-hero pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      {[["left-[8%] top-[22%]", "bg-primary"], ["left-[45%] top-[78%]", "bg-accent"], ["right-[6%] top-[15%]", "bg-violet"]].map(([pos, c], i) => (
        <span key={i} aria-hidden className={`animate-floaty pointer-events-none absolute h-2 w-2 rounded-[2px] opacity-60 ${pos} ${c}`} style={{ animationDelay: `${i * 2}s` }} />
      ))}

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-6 lg:grid-cols-2">
        <div>
          <p className="label-mono mb-6">BSIT STUDENT / SPEEDCUBER / GAMER</p>
          <h1 className="font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
            LIFE IS A SCRAMBLE.<br />
            <span className="text-gradient">FIND YOUR SOLUTION.</span>
          </h1>
          <p className="mt-8 font-mono text-sm tracking-[0.2em] text-foreground">NYCOLYE J. BUSTAMANTE</p>
          <p className="mt-3 max-w-md text-lg text-muted-foreground">
            I solve puzzles, build systems, chase progress, and keep leveling up.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn onClick={() => document.getElementById("about")?.scrollIntoView()}>
              Explore my world <ArrowDown className="h-4 w-4" />
            </Btn>
            {scrambled && !busy ? (
              <Btn variant="outline" onClick={() => setCmd({ kind: "solve", id: Date.now() })}>
                <Sparkles className="h-4 w-4" /> Solve it
              </Btn>
            ) : (
              <Btn variant="outline" disabled={busy || !gl} onClick={() => setCmd({ kind: "scramble", id: Date.now() })}>
                <Shuffle className="h-4 w-4" /> Scramble my cube
              </Btn>
            )}
          </div>
          <p className="mt-6 font-mono text-xs text-muted-foreground" aria-live="polite">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${busy ? "bg-accent" : "bg-primary"}`} />
            {gl ? status : "3D not supported on this device — showing a lightweight cube."}
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px] cursor-grab active:cursor-grabbing">
          <div className="absolute inset-[18%] rounded-full bg-primary/20 blur-[90px]" aria-hidden />
          <ClientOnly fallback={<div className="grid h-full place-items-center"><CssCube size={160} /></div>}>
            {gl ? (
              <Suspense fallback={<div className="grid h-full place-items-center"><CssCube size={160} /></div>}>
                <Cube3D command={cmd} onBusyChange={onBusy} reducedMotion={rm} />
              </Suspense>
            ) : (
              <div className="grid h-full place-items-center"><CssCube size={160} /></div>
            )}
          </ClientOnly>
        </div>
      </div>
    </section>
  );
}
