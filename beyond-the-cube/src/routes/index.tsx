import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";
import { PatternGame } from "@/components/portfolio/PatternGame";
import { About, Cubing, Skills, Projects, Achievements } from "@/components/portfolio/Sections";
import { Nav, Footer } from "@/components/portfolio/Chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nycolye J. Bustamante — Beyond the Cube" },
      { name: "description", content: "Interactive portfolio of Nycolye J. Bustamante: BSIT student, speedcuber, MLBB player, gym enthusiast and guitarist." },
      { property: "og:title", content: "Nycolye J. Bustamante — Beyond the Cube" },
      { property: "og:description", content: "Every scramble has a solution. Explore the cube, play the pattern challenge, and meet the developer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <PatternGame />
        <About />
        <Cubing />
        <Skills />
        <Projects />
        <Achievements />
      </main>
      <Footer />
    </>
  );
}
