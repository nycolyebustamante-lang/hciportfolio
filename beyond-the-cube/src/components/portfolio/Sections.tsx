import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box, Gamepad2, Dumbbell, Guitar, Code2, X, Plus, Brain, Repeat, Cpu, Sparkles, Database, Globe, MousePointer2, Puzzle,
  Terminal, Trophy, Medal, Users, ChevronDown, QrCode,
} from "lucide-react";
import { Btn, CssCube, SectionHead, CUBE_BG } from "./shared";
import { cn } from "@/lib/utils";

/* ---------------- ABOUT / MODES ---------------- */
const MODES = [
  { id: "cube", icon: Box, name: "CUBE MODE", tag: "Speedcubing", color: "text-primary",
    text: "I enjoy solving Rubik's Cubes, learning algorithms, improving recognition, and exploring speedcubes such as the Tornado V4 and GAN or YJ cubes.",
    points: ["Algorithms & recognition", "Hardware exploration", "Steady practice"] },
  { id: "game", icon: Gamepad2, name: "GAMING MODE", tag: "Mobile Legends", color: "text-accent",
    text: "I enjoy competitive MLBB, strategy, teamwork, and tournament experiences.",
    points: ["Draft & strategy", "Team communication", "Tournament play"] },
  { id: "gym", icon: Dumbbell, name: "GYM MODE", tag: "Fitness", color: "text-violet",
    text: "I enjoy training, progressive overload, and the continuous process of getting stronger.",
    points: ["Progressive overload", "Consistency", "Discipline"] },
  { id: "music", icon: Guitar, name: "MUSIC MODE", tag: "Guitar", color: "text-primary",
    text: "I enjoy playing guitar, jamming, and discovering music that matches my mood.",
    points: ["Jamming", "Learning songs", "Music discovery"] },
  { id: "dev", icon: Code2, name: "DEVELOPER MODE", tag: "BSIT", color: "text-accent",
    text: "I am interested in programming, database systems, web development, and creating practical software solutions.",
    points: ["Programming", "Database systems", "Web development"] },
];

export function About() {
  const [open, setOpen] = useState<string | null>(null);
  const active = MODES.find((m) => m.id === open);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHead index="02" label="ABOUT" title="ONE PERSON. MULTIPLE MODES." sub="Select a mode to see what drives it." />
        <figure className="mb-12 flex items-center gap-4">
          <div className="grid h-20 w-20 grid-cols-3 gap-1 rounded-2xl bg-card p-2 ring-1 ring-border" aria-hidden>
            {[4, 0, 5, 2, 0, 3, 1, 4, 5].map((c, i) => <span key={i} className={cn("rounded-[3px]", CUBE_BG[c], i === 4 && "bg-primary")} />)}
          </div>
          <figcaption className="font-mono text-xs text-muted-foreground">Abstract avatar<br />(placeholder for a real photo)</figcaption>
        </figure>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setOpen(open === m.id ? null : m.id)}
            aria-expanded={open === m.id}
            aria-controls="mode-panel"
            className={cn(
              "card-surface group flex flex-col items-start gap-6 p-6 text-left transition-all hover:-translate-y-1 hover:border-primary/50",
              open === m.id && "border-primary shadow-glow",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <m.icon className={cn("h-7 w-7", m.color)} strokeWidth={1.5} />
              <Plus className={cn("h-4 w-4 text-muted-foreground transition-transform", open === m.id && "rotate-45 text-primary")} />
            </div>
            <div>
              <p className="font-display text-sm font-bold">{m.name}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{m.tag}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            id="mode-panel"
            role="region"
            aria-label={`${active.name} details`}
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="card-surface mt-4 grid gap-6 p-8 md:grid-cols-[auto_1fr_auto]">
              <active.icon className={cn("h-12 w-12", active.color)} strokeWidth={1.25} />
              <div>
                <p className="font-display text-xl font-bold">{active.name} <span className="font-mono text-sm font-normal text-muted-foreground">/ {active.tag}</span></p>
                <p className="mt-3 max-w-2xl text-muted-foreground">{active.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {active.points.map((p) => <li key={p} className="rounded-full border border-border px-3 py-1 font-mono text-xs">{p}</li>)}
                </ul>
              </div>
              <Btn variant="ghost" onClick={() => setOpen(null)} aria-label="Close details" className="self-start"><X className="h-4 w-4" /> Close</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- CUBING ---------------- */
const ART = [
  { icon: Brain, title: "Algorithms & Recognition", text: "Spotting cases fast and recalling the right sequence of turns." },
  { icon: Repeat, title: "Practice & Consistency", text: "Small daily sessions that make every solve a little smoother." },
  { icon: Cpu, title: "Hardware", text: "Exploring the Tornado V4, GAN cubes, and YJ cubes like the MGC Meta series." },
  { icon: Sparkles, title: "The Satisfaction", text: "That final turn when chaos snaps into six clean faces." },
];
const FACE_ORDER = [0, 2, 5, 3, 4, 1];

function randomFaces() {
  return FACE_ORDER.map(() => Array.from({ length: 9 }, () => Math.floor(Math.random() * 6)));
}

export function Cubing() {
  const [faces, setFaces] = useState<number[][]>(() => FACE_ORDER.map((f) => Array(9).fill(f)));
  const [solved, setSolved] = useState(false);
  useEffect(() => setFaces(randomFaces()), []);

  const toggle = () => {
    if (solved) { setFaces(randomFaces()); setSolved(false); }
    else { setFaces(FACE_ORDER.map((f) => Array(9).fill(f))); setSolved(true); }
  };

  return (
    <section id="cubing" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead index="03" label="CUBING" title="THE ART OF THE SOLVE." sub="43 quintillion possible states. One goal." />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="card-surface flex flex-col items-center gap-8 p-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-label={solved ? "Faces arranged into solid colors" : "Scrambled color faces"} role="img">
            {faces.map((face, fi) => (
              <div key={fi} className="grid grid-cols-3 gap-1 rounded-lg bg-background p-1.5 ring-1 ring-border">
                {face.map((c, ti) => (
                  <span
                    key={ti}
                    className={cn("h-6 w-6 rounded-[4px] transition-colors duration-500 sm:h-8 sm:w-8", CUBE_BG[c])}
                    style={{ transitionDelay: `${(fi * 9 + ti) * 12}ms` }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            <Btn onClick={toggle}>{solved ? "Scramble again" : "Reveal the pattern"}</Btn>
            <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
              {solved ? "State: ordered — six solid faces." : "State: scrambled."} <span className="opacity-60">(Visual effect, not a solve simulation.)</span>
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ART.map((a, i) => (
            <article key={a.title} className="card-surface relative overflow-hidden p-6 transition-colors hover:border-accent/40">
              <span className={cn("absolute right-0 top-0 h-1 w-16", CUBE_BG[i + 2])} aria-hidden />
              <a.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-base font-bold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
            </article>
          ))}
          <div className="card-surface col-span-full flex items-center gap-6 p-6">
            <CssCube size={56} />
            <p className="font-mono text-xs text-muted-foreground">R U R' U' — repeat until it clicks.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SKILLS ---------------- */
const SKILLS = [
  { icon: Terminal, name: "Programming" },
  { icon: Database, name: "SQL & Database Design" },
  { icon: Globe, name: "Web Development" },
  { icon: MousePointer2, name: "UI/UX & HCI" },
  { icon: Puzzle, name: "Problem-Solving" },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead index="04" label="DEVELOPER" title={<>FROM SOLVING PUZZLES <span className="text-gradient">TO SOLVING PROBLEMS.</span></>} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SKILLS.map((s) => (
          <li key={s.name} className="card-surface flex items-center gap-3 p-5">
            <s.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-semibold">{s.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- PROJECT ---------------- */
export function Projects() {
  const [open, setOpen] = useState(false);
  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-12">
      <p className="label-mono mb-6"><span className="text-primary">05</span> // FEATURED PROJECT</p>
      <article className={cn("card-surface overflow-hidden transition-colors", open && "border-accent/50")}>
        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="project-detail" className="grid w-full gap-6 p-8 text-left md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-accent/10 ring-1 ring-accent/30"><QrCode className="h-8 w-8 text-accent" strokeWidth={1.5} /></div>
          <div>
            <span className="rounded-full bg-violet/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-violet">Academic project · In development</span>
            <h3 className="mt-3 font-display text-lg font-bold md:text-2xl">QR-Based Cashless Fare Payment System for LATRANSCO Jeepneys in Cebu City</h3>
            <p className="mt-2 text-muted-foreground">Explores QR-based fare payment, ticket validation, route-based fare computation, and verification logs.</p>
          </div>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            {open ? "Less" : "Details"} <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div id="project-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="grid gap-6 border-t border-border p-8 md:grid-cols-3">
                {[
                  ["The problem", ["Cash-only fares slow down boarding", "Manual change handling causes errors", "Little record of fares collected"]],
                  ["Key features", ["QR-based fare payment", "Ticket validation", "Route-based fare computation", "Verification logs"]],
                  ["Intended benefits", ["Faster, contactless boarding", "Accurate fares per route", "Transparent records for operators"]],
                ].map(([t, items]) => (
                  <div key={t as string}>
                    <h4 className="label-mono mb-3 text-primary">{t}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(items as string[]).map((i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 bg-accent" />{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </section>
  );
}

/* ---------------- ACHIEVEMENTS ---------------- */
const WINS = [
  { icon: Trophy, title: "School MLBB Championship", text: "Championship experience in a school Mobile Legends tournament." },
  { icon: Medal, title: "Online MLBB Tournament", text: "Championship experience in an online tournament involving university players." },
  { icon: Users, title: "Community Youth Tournaments", text: "Achievements and active participation in community youth events." },
];

export function Achievements() {
  return (
    <section id="achievements" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHead index="06" label="ACHIEVEMENTS" title="PROGRESS IS BUILT, NOT GIVEN." />
      <div className="grid gap-4 md:grid-cols-3">
        {WINS.map((w) => (
          <article key={w.title} className="card-surface p-8">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/30"><w.icon className="h-6 w-6 text-primary" strokeWidth={1.5} /></div>
            <h3 className="mt-6 font-display text-base font-bold">{w.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
