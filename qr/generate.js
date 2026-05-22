const qr = require('qrcode');
const fs = require('fs');
const path = require('path');

const URL = 'https://fethiye-pilavcisi.vercel.app';
const OUT_PNG = path.join(__dirname, 'qr-simple.png');
const OUT_SVG = path.join(__dirname, 'qr-sticker-inline.svg');

(async () => {
  await qr.toFile(OUT_PNG, URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 1000,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });
  console.log('PNG written:', OUT_PNG);

  const svgString = await qr.toString(URL, {
    errorCorrectionLevel: 'H',
    type: 'svg',
    margin: 0,
    color: { dark: '#1A1A1A', light: '#FAF8F3' },
  });
  fs.writeFileSync(OUT_SVG, svgString);
  console.log('SVG written:', OUT_SVG, '(' + svgString.length + ' bytes)');
})();
