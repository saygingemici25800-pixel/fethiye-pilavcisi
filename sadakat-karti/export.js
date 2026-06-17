// Sadakat kartı PNG export — SYSTEM Google Chrome headless (no playwright/puppeteer).
// Card canvas = 1004x650px = 85x55mm @ 300dpi (trim). DSF 1 → çıktı tam 1004x650.
// ?print param trim guide'ları (dashed cyan) gizler → temiz print-ready PNG.
// Fontlar (Fraunces + DM Sans) Google Fonts CDN'den (internet gerekir).
const { execFileSync } = require('child_process');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const inDir = '/Users/keremayna/fethiye-pilavcisi/sadakat-karti';
const outDir = inDir + '/output';
const faces = ['on-yuz', 'arka-yuz'];

fs.mkdirSync(outDir, { recursive: true });

const only = process.argv[2]; // optional: just one face, e.g. `node export.js arka-yuz`
const targets = only ? faces.filter((f) => f === only) : faces;

for (const face of targets) {
  const out = `${outDir}/${face}.png`;
  const url = `file://${inDir}/${face}.html?print`;
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',   // 1004x650 IS 300dpi for 85x55mm
    '--window-size=1004,650',
    '--virtual-time-budget=10000',     // let CDN fonts load + render settle
    `--screenshot=${out}`,
    url,
  ], { stdio: 'inherit' });
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`✓ ${face.padEnd(8)} → ${out}  (${kb} KB)`);
}

console.log(`\nDone — ${targets.length} PNG(s) in ${outDir}`);
