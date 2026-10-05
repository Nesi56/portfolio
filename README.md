# Nesithekoolkod

Static multi-page portfolio. Black background, #690000 primary red, and a shared navigation with an 800ms decoding effect on load and pointer exit.

## Local preview

Run `python3 -m http.server 8080 --bind 127.0.0.1` from this folder.

- `/` — introduction and about information; the logo returns here and highlights on this page.
- `/projects/` — public GitHub repositories, language filters, search, details dialogs, and source links.
- `/skills/` — interactive language cluster diagram with a repository-creation-year filter.
- `/contact/` — GitHub contact link.

Pages share `styles.css` and `script.js`. Public repositories load from Nesi56 through the GitHub API. The Skills cluster uses each repository’s GitHub language breakdown, with primary language as a fallback if that endpoint is unavailable. Years use repository creation dates. Project technology tags also include libraries explicitly named in repository descriptions. No API key is needed. If GitHub is unavailable or rate limited, Retry is available.

Project covers use repository names until project screenshots are added. Static directory routes work with the local Python server and static hosting with directory index support. Relative page and asset links support both local hosting and GitHub Pages project subpaths such as /portfolio/.
