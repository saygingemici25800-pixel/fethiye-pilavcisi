// PNG export via SYSTEM Google Chrome headless — no playwright/puppeteer/node_modules.
// gstatic is unreachable offline, so we strip the CDN <link>s and inject local
// @font-face (fonts/) into a temp copy of each slide. Source HTMLs stay untouched.
const { execFileSync } = require('child_process');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const inDir = '/Users/keremayna/fethiye-pilavcisi/bayram-carousel';
const outDir = inDir + '/output';
const fontsDir = inDir + '/fonts';
const slides = ['slide-1-kanca', 'slide-2-tavuklu', 'slide-3-ataturk', 'slide-4-cta'];

const fontCSS = `<style>
@font-face{font-family:'Fraunces';font-style:normal;font-weight:100 900;src:url('file://${fontsDir}/fraunces.ttf');}
@font-face{font-family:'Fraunces';font-style:italic;font-weight:100 900;src:url('file://${fontsDir}/fraunces-italic.ttf');}
@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;src:url('file://${fontsDir}/dmsans.ttf');}
@font-face{font-family:'DM Sans';font-style:italic;font-weight:100 1000;src:url('file://${fontsDir}/dmsans-italic.ttf');}
</style>`;

fs.mkdirSync(outDir, { recursive: true });

const only = process.argv[2]; // optional: regenerate only matching slide(s)
const targets = only ? slides.filter((s) => s.includes(only)) : slides;
for (const slide of targets) {
  let html = fs.readFileSync(`${inDir}/${slide}.html`, 'utf8');
  // drop CDN font links/preconnects (unreachable offline), inject local fonts
  html = html.replace(/[ \t]*<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\n?/g, '');
  html = html.replace('</head>', fontCSS + '\n</head>');
  // temp file must live in inDir so relative photos/ paths resolve
  const tmp = `${inDir}/.tmp-${slide}.html`;
  fs.writeFileSync(tmp, html);

  const out = `${outDir}/${slide.replace(/^slide-(\d).*/, 'slide-$1')}.png`;
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',     // retina → 2160x2160
    '--window-size=1080,1080',
    '--virtual-time-budget=3000',         // let local fonts + image settle
    `--screenshot=${out}`,
    `file://${tmp}`,
  ], { stdio: 'ignore' });

  fs.unlinkSync(tmp);
  console.log('saved', out);
}
console.log('Done.');
