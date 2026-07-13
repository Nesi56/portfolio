# nesi56.exe

A framework-free GitHub portfolio built with plain HTML, CSS, and JavaScript.

## Features

- Windows 98-inspired draggable desktop window
- Natsuki-themed unofficial fan presentation
- Responsive mobile layout
- Live public repository loading from the GitHub API
- Offline project fallbacks
- Interactive terminal
- Start menu, tabs, minimize, maximize, close, and poem modal
- No private personal information

## Run locally

No build step is required. Open `index.html`, or use a small local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Create a repository, for example `nesi56.github.io`.
2. Upload these files to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, then select `main` and `/ (root)`.

## Customize

- Main writing and page structure: `index.html`
- Colors and layout: `styles.css`
- Projects, terminal commands, and interactions: `script.js`
- Character art: `assets/natsuki.svg`

The project list automatically requests public repositories from `github.com/nesi56`.

## Fan disclaimer

This is an unofficial fan-made design. Natsuki and Doki Doki Literature Club are associated with Team Salvato. This project is not affiliated with or endorsed by them.
