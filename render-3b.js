const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('file:///Users/keremayna/fethiye-pilavcisi/post-3b-yapmadiklarimiz.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.addStyleTag({ content: 'body{padding:0 !important;background:#FBF5E4 !important;}' });
  await page.screenshot({
    path: '/Users/keremayna/fethiye-pilavcisi/post-3b-yapmadiklarimiz.png',
    omitBackground: false,
    clip: { x: 0, y: 0, width: 1080, height: 1080 },
  });
  await browser.close();
  console.log('Done');
})();
