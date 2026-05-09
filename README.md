# purrfectMatch

> *"Let your pet get some"*

A Tinder-style dating app for pets. Swipe right to like, swipe left to pass. Match with other pets and let the magic happen.

## Features

- **Swipe Interface**: Touch-friendly card swiping with gesture support
- **Match Animation**: Celebratory match modal with floating hearts
- **Pet Profiles**: Name, age, breed, bio, and personality traits
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **Vite** + **React** + **TypeScript**
- Pure CSS animations (no animation libraries)
- Touch and mouse gesture handling

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deployment

This app is deployed to `https://purrfectmatch.staging.maximisedai.com/` via GitHub Pages with a verified custom domain. Pages source is "GitHub Actions" so the Vite build in `.github/workflows/deploy-to-staging.yml` is what gets served.

The Vite config uses `base: '/'` since the custom subdomain serves the site at its root.

### Build & Deploy

```bash
npm run build
# CI deploys dist/ to https://purrfectmatch.staging.maximisedai.com/ on every push to main
```

### Quick Preview

Open `preview.html` directly in a browser for a standalone demo (no build required).

## License

MIT
