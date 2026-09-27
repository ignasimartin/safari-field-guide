# Safari Field Guide · Botswana & Zimbabwe

**[Live site](https://ignasimartin.github.io/safari-field-guide/)**

A mobile-friendly field guide to the mammals, reptiles, birds, and trees of Botswana and Zimbabwe. Built as a single-page web app — no server required.

## Features

- **91 species** — 54 mammals & reptiles, 32 birds, 5 trees
- **Search & filter** — find species by name or browse by group (Big Five, Cats, Antelope, Raptors, etc.)
- **Sighting checklist** — mark species as "Seen" with a progress tracker
- **Your photos** — attach your own photos to any species card (stored locally in IndexedDB)
- **Dark mode** — respects system preference, with manual toggle
- **Offline-ready** — all photos embedded, works without internet once loaded
- **Responsive** — designed for phones in the field, scales up to desktop

## Usage

Open `index.html` in any modern browser. No build step, no dependencies, no server.

Your checklist and photos are saved locally in your browser — private and never sent anywhere.

## Project structure

```
index.html       — species cards with embedded photos (~15 MB)
css/style.css    — all styles, light/dark themes
js/app.js        — search, filters, checklist, photo upload
```

## License

[MIT](LICENSE)
