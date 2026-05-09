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

This app is configured for deployment to `purrfectmatch.staging.maximisedai.com/purrfectmatch/`.

The Vite config sets `base: '/purrfectmatch/'` to support subpath hosting.

### Build & Deploy

```bash
npm run build
# Deploy contents of dist/ to purrfectmatch.staging.maximisedai.com/purrfectmatch/
```

### Quick Preview

Open `preview.html` directly in a browser for a standalone demo (no build required).

## License

MIT
