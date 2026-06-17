// Story PNG export via SYSTEM Google Chrome headless — no playwright/puppeteer/node_modules.
// Source: hikayeler-gallery.html (one React/Babel file holding all 6 stories).
// We load it with ?only=<id> so it renders ONE story full-bleed at 1080x1920,
// then screenshot at device-scale-factor 2 → 2160x3840 retina PNG.
// Fonts (Bebas Neue / Inter) load from Google Fonts CDN — requires network.
const { execFileSync } = require('child_process');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const inDir = '/Users/keremayna/fethiye-pilavcisi/stories';
const outDir = inDir + '/output';
const src = inDir + '/hikayeler-gallery.html';

// id → output filename stem (matches the in-page download convention fethiye-hikaye-<id>.png)
const stories = ['davet', 'soz', 'yorum', 'mutfak', 'sadakat', 'menu'];

fs.mkdirSync(outDir, { recursive: true });

const only = process.argv[2]; // optional: regenerate just one story, e.g. `node export.js mutfak`
const targets = only ? stories.filter((s) => s === only) : stories;

if (!targets.length) {
  console.error(`No story matches "${only}". Valid: ${stories.join(', ')}`);
  process.exit(1);
}

for (const id of targets) {
  const out = `${outDir}/fethiye-hikaye-${id}.png`;
  // file:// URL + query param; Chrome serves the same file, App reads ?only and renders one story.
  const url = `file://${src}?only=${id}`;
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',   // retina → 2160x3840
    '--window-size=1080,1920',
    '--default-background-color=00000000',
    '--virtual-time-budget=10000',     // let CDN react/babel/fonts load + render settle
    `--screenshot=${out}`,
    url,
  ], { stdio: 'inherit' });
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`✓ ${id.padEnd(8)} → ${out}  (${kb} KB)`);
}

console.log(`\nDone — ${targets.length} PNG(s) in ${outDir}`);
