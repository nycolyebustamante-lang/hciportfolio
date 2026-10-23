import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  ["home", "Home"], ["about", "About"], ["cubing", "Cubing"], ["skills", "Skills"], ["projects", "Projects"],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent")}>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#home" className="font-display text-lg font-black tracking-tight">NYC<span className="text-primary">//</span></a>
        <ul className="flex gap-1 overflow-x-auto">
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn("relative rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors", active === id ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              >
                {label}
                {active === id && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-primary" />}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

const CLICKS = 5;
export function Footer() {
  const [clicks, setClicks] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [spin, setSpin] = useState(0);

  const tap = () => {
    setSpin((s) => s + 90);
    const n = clicks + 1;
    if (n >= CLICKS) { setUnlocked(true); setClicks(0); } else setClicks(n);
  };

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <p className="font-mono text-xs text-muted-foreground">© 2026 Nycolye J. Bustamante · Every scramble has a solution.</p>
        <div className="flex items-center gap-3">
          <span className="flex gap-1" aria-hidden>
            {Array.from({ length: CLICKS }).map((_, i) => <span key={i} className={cn("h-1 w-1 rounded-full", i < clicks ? "bg-primary" : "bg-muted")} />)}
          </span>
          <button onClick={tap} aria-label="Tiny cube — what's in the hidden layer?" title="Tap me a few times…" className="rounded-md p-2 text-muted-foreground transition-colors hover:text-primary">
            <Box className="h-5 w-5 transition-transform duration-500" style={{ transform: `rotate(${spin}deg)` }} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {unlocked && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 flex w-[min(92vw,440px)] -translate-x-1/2 items-center gap-4 rounded-xl border border-primary/50 bg-card p-4 shadow-glow"
          >
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.8 }}><Box className="h-6 w-6 text-primary" /></motion.div>
            <p className="flex-1 font-mono text-xs"><span className="text-primary">SECRET UNLOCKED:</span> You found the hidden layer. +100 XP.</p>
            <button onClick={() => setUnlocked(false)} aria-label="Dismiss" className="rounded p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
