# PetFilth

> **Tagline:** Let your pet get some ass
>
> **Hook:** Sick of your pet sniffing ass at the mall? PetFilth — even your pet gets some ass too.

A Tinder-style pet-to-pet dating webapp. Swipe to match, swipe to pass.

## Live

Intended deployment: <https://staging.maximisedai.com/petfilth>

## What's in here

- `index.html` — the entire app, single-file, zero build step. Drop it on any static host (or behind a WordPress redirect) and it works.

## Stack

- Vanilla HTML/CSS/JS, no framework, no build.
- Google Fonts (Bricolage Grotesque + Inter) loaded via CDN.
- Pet photos via Unsplash CDN URLs (replace with real uploads when you have them).
- Touch + mouse drag with momentum, like/pass/super-sniff/rewind/boost actions, match modal, in-memory stats.

## Local preview

```bash
# Any static server works:
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy notes

- **GitHub Pages**: enable Pages on `main` / root → site serves at `https://captjreacher.github.io/petfilth/`.
- **staging.maximisedai.com/petfilth**: copy `index.html` into whatever directory the staging site serves from for the `/petfilth` path (depends on your WP / static host setup).

## License

MIT.
