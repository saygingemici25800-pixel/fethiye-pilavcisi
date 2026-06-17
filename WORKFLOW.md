# WORKFLOW — Fethiye Pilavcısı

## Render kuralı (ÖNEMLİ)
PNG export'ta **sistem Google Chrome headless** kullan. **Playwright / Puppeteer / node_modules / chromium indirme YOK.**
Chrome yolu: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

Temel komut deseni:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=<W>,<H> \
  --virtual-time-budget=10000 \
  --screenshot=<out.png> "file://<path>.html"
```
`--force-device-scale-factor=2` → retina (çıktı = W·2 × H·2 px).

## Story seti (Instagram Hikayeleri) — 1080×1920, @2x → 2160×3840
- Kaynak: `stories/hikayeler-gallery.html` — TEK React/Babel dosyası, 6 story'yi (`Story1`–`Story6`) içerir.
  - id → bileşen: `davet`=Story1, `soz`=Story2, `yorum`=Story3, `mutfak`=Story4, `sadakat`=Story5, `menu`=Story6
  - `?only=<id>` query'si ile tek story tam ekran (1080×1920) render edilir; query yoksa interaktif galeri.
  - Fontlar: Bebas Neue + Inter, Google Fonts CDN'den (export sırasında internet gerekir).
- Export: `node stories/export.js` (hepsi) veya `node stories/export.js mutfak` (tek).
- Çıktı: `stories/output/fethiye-hikaye-<id>.png`

## Carousel seti (Bayram) — 1080×1080, @2x → 2160×2160
- Kaynak: `bayram-carousel/slide-*.html`
- Export: `node bayram-carousel/export.js` → `bayram-carousel/output/slide-N.png`
- Bu set offline çalışır: CDN font `<link>`'leri çıkarılıp `bayram-carousel/fonts/` yerel `@font-face` enjekte edilir.
