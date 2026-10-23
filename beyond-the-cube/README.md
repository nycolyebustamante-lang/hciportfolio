# Nycolye // Beyond the Cube

An interactive one-page portfolio: a draggable 3D Rubik's Cube, a pattern
mini-game, and sections for about, cubing, skills, projects and achievements.

Built with TanStack Start (React 19 + Vite), TypeScript, Tailwind CSS v4,
Three.js / react-three-fiber, and Framer Motion.

## Run it in VS Code

1. Unzip the folder, then open it in VS Code (**File → Open Folder**).
2. Install [Node.js 20 or newer](https://nodejs.org).
3. In the VS Code terminal (`` Ctrl+` ``):

   ```sh
   npm install
   npm run dev
   ```

4. Open the address it prints (usually `http://localhost:8080`).

Prefer [Bun](https://bun.sh)? `bun install && bun dev` works too — `bun.lock`
is included.

### Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the live dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run test` | Run the tests |
| `npm run lint` | Check code style |
| `npm run format` | Auto-format with Prettier |

## Put it on GitHub

Create an empty repository on GitHub (no README, no .gitignore), then:

```sh
git init
git add .
git commit -m "Beyond the Cube portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

`node_modules`, `dist`, and build output are already listed in `.gitignore`,
so only source gets committed.

## Where things live

| Path | Contents |
| --- | --- |
| `src/routes/index.tsx` | The page and its section order |
| `src/routes/__root.tsx` | App shell, fonts, page metadata |
| `src/components/portfolio/Cube3D.tsx` | The draggable 3D cube |
| `src/components/portfolio/Hero.tsx` | Opening screen |
| `src/components/portfolio/PatternGame.tsx` | Pattern mini-game |
| `src/components/portfolio/Sections.tsx` | About, Cubing, Skills, Projects |
| `src/components/portfolio/Chrome.tsx` | Navigation bar and footer |
| `src/components/ui/` | shadcn/ui primitives |
| `src/styles.css` | Colours, fonts, spacing (Tailwind v4 theme) |
| `src/test/` | Tests |

## Notes

- The avatar in the About section is a placeholder pattern — swap in a real
  photo when you have one.
- `.vscode/` ships with recommended extensions and format-on-save settings.
- `AGENTS.md` holds a note from Lovable, the tool this was built with; you can
  delete it once the code is yours.
