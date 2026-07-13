# nesi56.exe

A calm retro-computer portfolio with visual-novel energy, Windows 98-style chrome, an Arch-inspired systems aesthetic, and a small React terminal mounted inside a SvelteKit app.

## Stack

- SvelteKit for the portfolio shell and UI
- React for the interactive terminal island
- TypeScript
- Static adapter for GitHub Pages
- Original SVG mascot included in `static/mascot.svg`

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verify

```bash
npm run check
npm run build
```

## Customize

Edit these main files:

- `src/routes/+page.svelte` — text, tabs, project cards, links, and styling
- `src/lib/react/TerminalWidget.tsx` — React terminal commands
- `static/mascot.svg` — original mascot illustration
- `static/favicon.svg` — browser icon

Search for `connect your repository URL here` and replace the sample project buttons with real links.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. The included workflow builds and deploys automatically.

The workflow supports both:

- `nesi56.github.io` user-site repositories
- normal project repositories such as `portfolio`
