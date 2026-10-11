# Diligence AI

The website for Diligence AI Technologies Ltd, the company behind DARA. It is served at wearediligence.com.

It is built with Next.js and exported as static files, which Cloudflare serves as Worker static assets.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # writes the static site to out/
```

## Deploy (Cloudflare Workers)

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`wrangler.jsonc` serves `out/` as static assets, and `out/404.html` is used for unknown paths.

## Generated media

The halftone images in `public/media` and the video loop are rendered by `scripts/render-media.mjs` from the same sphere renderer the site uses (`src/components/art/halftone-core.js`). To regenerate them, run:

```bash
node scripts/render-media.mjs
```

This needs Playwright's Chromium and ffmpeg.
