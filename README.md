# PetFilth

> **Tagline:** Let your pet get some ass
>
> **Hook:** Sick of your pet sniffing ass at the mall? PetFilth — even your pet gets some ass too.

A Tinder-style pet-to-pet dating webapp. Swipe to match, swipe to pass.

## Live

Intended deployment: <https://staging.maximisedai.com/petfilth>

## Layout

```
petfilth/
  index.html     ← the entire app, single-file, zero build step
```

The `petfilth/` directory + `index.html` pattern is intentional — it serves cleanly
at `<host>/petfilth` from any webserver (Apache, Nginx, WordPress, GH Pages,
Vercel, Netlify) without rewrite rules or special config.

## Stack

- Vanilla HTML/CSS/JS, no framework, no build.
- Google Fonts (Bricolage Grotesque + Inter) loaded via CDN.
- Pet photos via Unsplash CDN URLs (replace with real uploads when you have them).
- Touch + mouse drag, like/pass/super-sniff/rewind/boost actions, match modal,
  in-memory stats. Mobile-first responsive layout.

## Local preview

```bash
# From the repo root, any static server works:
python3 -m http.server 8000
# then open http://localhost:8000/petfilth/
```

## Deploy

- **GitHub Pages** → enable Pages on `main` / root → serves at
  `https://captjreacher.github.io/petfilth/petfilth/`. (To serve at
  `/petfilth/` instead of `/petfilth/petfilth/`, move `petfilth/index.html`
  to root — or just live with the nested URL while the source layout
  stays portable.)
- **staging.maximisedai.com/petfilth** → copy the `petfilth/` directory
  into the staging site's web root. The directory + `index.html` will
  serve at `<host>/petfilth` natively on any of the major webservers,
  including under WordPress (since the literal directory + file path
  bypasses WP's `index.php` routing).

## License

MIT.
