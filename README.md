# PetFilth

> **Tagline:** Let your pet get some ass
>
> **Hook:** Sick of your pet sniffing ass at the mall? PetFilth — even your pet gets some ass too.

A Tinder-style pet-to-pet dating webapp. Swipe to match, swipe to pass.

## Live

Served at the apex of a custom domain via GitHub Pages (see `CNAME`).

## Layout

```
index.html   ← the entire app, single-file, zero build step
CNAME        ← GitHub Pages custom-domain pointer
README.md
LICENSE
```

## Stack

- Vanilla HTML/CSS/JS, no framework, no build.
- Google Fonts (Bricolage Grotesque + Inter) loaded via CDN.
- Pet photos via Unsplash CDN URLs (replace with real uploads when you have them).
- Touch + mouse drag, like/pass/super-sniff/rewind/boost actions, match modal,
  in-memory stats. Mobile-first responsive layout.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy via GitHub Pages (apex domain)

### 1. Repo settings

GitHub repo → **Settings → Pages**

- **Source:** Deploy from a branch → `main` → `/ (root)` → Save
- **Custom domain:** enter the apex domain → Save
- Tick **Enforce HTTPS** once the cert provisions (5–30 min after DNS resolves)

### 2. DNS at the registrar (apex `@` host)

Four A records pointing at GitHub Pages' apex IPs:

```
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

Optional (recommended) IPv6:

```
@  AAAA  2606:50c0:8000::153
@  AAAA  2606:50c0:8001::153
@  AAAA  2606:50c0:8002::153
@  AAAA  2606:50c0:8003::153
```

**Do not** put a `CNAME` *DNS record* at `@` — RFC forbids it (conflicts with SOA/NS).
The `CNAME` *file* in this repo is a different thing entirely: it's a GitHub Pages
convention telling Pages which custom domain to bind.

### 3. (Optional) Add `www` subdomain

If you also want `www.<domain>` to redirect to apex:

```
www  CNAME  captjreacher.github.io.
```

GitHub Pages will auto-redirect `www.<domain>` → `<domain>` once both are configured.

## License

MIT.
