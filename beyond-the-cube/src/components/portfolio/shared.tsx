import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const CUBE_BG = ["bg-cube-w", "bg-cube-y", "bg-cube-r", "bg-cube-o", "bg-cube-b", "bg-cube-g"] as const;

export function useReducedMotion() {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRm(mq.matches);
    const h = () => setRm(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return rm;
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" };
export function Btn({ variant = "primary", className, ...p }: BtnProps) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]",
        variant === "primary" && "bg-primary text-primary-foreground hover:shadow-glow hover:-translate-y-0.5",
        variant === "outline" && "border border-foreground/20 text-foreground hover:border-accent hover:text-accent",
        variant === "ghost" && "px-3 py-2 text-muted-foreground hover:text-foreground",
        className,
      )}
    />
  );
}

export function SectionHead({ index, label, title, sub }: { index: string; label: string; title: ReactNode; sub?: string }) {
  return (
    <header className="mb-12 max-w-3xl">
      <p className="label-mono mb-4"><span className="text-primary">{index}</span> // {label}</p>
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground md:text-lg">{sub}</p>}
    </header>
  );
}

/** Lightweight CSS 3D cube — used as decoration and as WebGL fallback. */
export function CssCube({ size = 120, className }: { size?: number; className?: string }) {
  const faces = [
    { c: "bg-cube-g", t: `translateZ(${size / 2}px)` },
    { c: "bg-cube-b", t: `rotateY(180deg) translateZ(${size / 2}px)` },
    { c: "bg-cube-r", t: `rotateY(90deg) translateZ(${size / 2}px)` },
    { c: "bg-cube-o", t: `rotateY(-90deg) translateZ(${size / 2}px)` },
    { c: "bg-cube-w", t: `rotateX(90deg) translateZ(${size / 2}px)` },
    { c: "bg-cube-y", t: `rotateX(-90deg) translateZ(${size / 2}px)` },
  ];
  return (
    <div className={className} style={{ perspective: size * 6, width: size, height: size }} aria-hidden>
      <div className="animate-spin3d relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {faces.map((f, i) => (
          <div key={i} className="absolute inset-0 grid grid-cols-3 gap-[4%] rounded-md bg-background p-[4%]" style={{ transform: f.t }}>
            {Array.from({ length: 9 }).map((_, j) => <span key={j} className={cn("rounded-[3px]", f.c)} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
