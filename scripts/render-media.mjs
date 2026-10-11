/**
 * Renders the site's generated media from the same halftone renderer the live
 * site uses (src/components/art/halftone-core.js):
 *
 *   public/media/orb-1..5.png      small planets for the context row
 *   public/media/icon.png          site icon (512) and apple-icon.png (180)
 *   public/media/og.png            social sharing image (1200x630)
 *   public/media/orbit-loop.mp4    seamless background loop (H.264)
 *   public/media/orbit-loop.webm   the same loop (VP9)
 *   public/media/orbit-poster.jpg  the loop's first frame
 *
 * Usage: node scripts/render-media.mjs   (needs ffmpeg and a Chromium; set
 * CHROMIUM_PATH if Playwright's default browser cache is elsewhere).
 */
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'public', 'media');
fs.mkdirSync(out, { recursive: true });

const core = fs
  .readFileSync(path.join(root, 'src/components/art/halftone-core.js'), 'utf8')
  .replace(/export function/g, 'function');

const executablePath =
  process.env.CHROMIUM_PATH ||
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500&family=Inter:wght@400&display=block" rel="stylesheet">
</head><body style="margin:0"><canvas id="c"></canvas><script>${core}</script></body></html>`);
await page.evaluate(async () => {
  await Promise.all([document.fonts.load('500 78px "Inter Tight"'), document.fonts.load('400 22px Inter')]);
});

/** Renders one image in the page and returns it as a Buffer. */
async function render(width, height, script, type = 'image/png') {
  const dataUrl = await page.evaluate(
    ({ width, height, script, type }) => {
      const canvas = document.getElementById('c');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      new Function('ctx', 'width', 'height', 'drawHalftoneSphere', script)(ctx, width, height, drawHalftoneSphere);
      return canvas.toDataURL(type, 0.92);
    },
    { width, height, script, type },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

// Five small planets: each its own phase and surface.
const orbs = [
  { theta: 1.95, spin: 0.3 },
  { theta: 0.55, spin: 2.1 },
  { theta: -1.2, spin: 4.0 },
  { theta: 1.25, spin: 5.6 },
  { theta: -0.2, spin: 1.2 },
];
for (const [i, orb] of orbs.entries()) {
  const png = await render(
    192,
    192,
    `drawHalftoneSphere(ctx, { width, height, cx: 96, cy: 96, radius: 72, spacing: 6.2, theta: ${orb.theta}, spin: ${orb.spin}, halo: 1.28 });`,
  );
  fs.writeFileSync(path.join(out, `orb-${i + 1}.png`), png);
}

// Site icon: the crescent mark on paper.
for (const [name, size] of [['icon.png', 512], ['apple-icon.png', 180]]) {
  const png = await render(
    size,
    size,
    `ctx.fillStyle = '#f3f3f1'; ctx.fillRect(0, 0, width, height);
     drawHalftoneSphere(ctx, { width, height, cx: width / 2, cy: height / 2, radius: width * 0.36, spacing: width / 30, theta: 1.95, spin: 0.4, halo: 1.18, ambient: 0.05, clear: false });`,
  );
  fs.writeFileSync(path.join(out, name), png);
}

// Social sharing image.
fs.writeFileSync(
  path.join(out, 'og.png'),
  await render(
    1200,
    630,
    `ctx.fillStyle = '#f3f3f1'; ctx.fillRect(0, 0, width, height);
     drawHalftoneSphere(ctx, { width, height, cx: 905, cy: 315, radius: 250, spacing: 7.5, theta: 1.82, spin: 0.6, clear: false });
     ctx.fillStyle = '#0d0d0d';
     ctx.font = '500 30px "Inter Tight"'; ctx.fillText('Diligence', 72, 96);
     ctx.font = '500 78px "Inter Tight"'; ctx.letterSpacing = '-3px';
     ctx.fillText('AI for work', 72, 400); ctx.fillText('that matters.', 72, 480);
     ctx.letterSpacing = '0px'; ctx.fillStyle = '#6b6b67'; ctx.font = '400 22px Inter';
     ctx.fillText('The company behind DARA', 72, 548);`,
  ),
);

// Background loop: the light swings from one crescent through the full face
// to the other and back (never dark) while the surface turns once.
const frames = path.join(os.tmpdir(), `diligence-frames-${Date.now()}`);
fs.mkdirSync(frames, { recursive: true });
const FPS = 24;
const SECONDS = 24;
const total = FPS * SECONDS;
for (let f = 0; f < total; f++) {
  const t = f / total;
  const jpg = await render(
    1280,
    720,
    `ctx.fillStyle = '#f3f3f1'; ctx.fillRect(0, 0, width, height);
     drawHalftoneSphere(ctx, { width, height, cx: 850, cy: 360, radius: 265, spacing: 7,
       theta: ${(1.9 * Math.cos(Math.PI * 2 * t)).toFixed(5)}, spin: ${(Math.PI * 2 * t).toFixed(5)}, clear: false });`,
    'image/jpeg',
  );
  fs.writeFileSync(path.join(frames, `f${String(f).padStart(4, '0')}.jpg`), jpg);
  if (f === 0) fs.writeFileSync(path.join(out, 'orbit-poster.jpg'), jpg);
}
await browser.close();

const input = ['-y', '-framerate', String(FPS), '-i', path.join(frames, 'f%04d.jpg')];
execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', '-an', path.join(out, 'orbit-loop.mp4')], { stdio: 'ignore' });
execFileSync('ffmpeg', [...input, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '44', '-row-mt', '1', '-an', path.join(out, 'orbit-loop.webm')], { stdio: 'ignore' });
fs.rmSync(frames, { recursive: true, force: true });

for (const file of fs.readdirSync(out)) console.log(file.padEnd(20), (fs.statSync(path.join(out, file)).size / 1024).toFixed(0), 'KB');
