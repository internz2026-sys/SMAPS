// Assembles a single self-contained review.html for publishing as a Claude Artifact.
// - inlines css/styles.css and js/form.js
// - base64-embeds the 4 SVG mockups (Artifact CSP blocks external/relative image loads)
// - embeds Google Fonts (Source Serif 4 + Public Sans, latin woff2) as @font-face data URIs,
//   since the Artifact sandbox blocks external font requests. Falls back gracefully if offline.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import https from 'node:https';

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location, headers));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks), type: res.headers['content-type'] }));
    }).on('error', reject);
  });
}

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function buildFontFaces() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Public+Sans:wght@400;500;600;700&display=swap';
  const cssRes = await get(cssUrl, { 'User-Agent': CHROME_UA });
  const css = cssRes.buf.toString('utf8');
  // Grab only the `/* latin */` @font-face blocks (skip latin-ext/cyrillic/etc.)
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
  let m, out = [];
  while ((m = re.exec(css)) !== null) {
    if (m[1] !== 'latin') continue;
    const block = m[2];
    const urlM = block.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/);
    if (!urlM) continue;
    const fontRes = await get(urlM[1], { 'User-Agent': CHROME_UA });
    const b64 = fontRes.buf.toString('base64');
    const rebuilt = block.replace(/src:\s*url\([^)]+\)\s*format\('woff2'\)/,
      `src: url(data:font/woff2;base64,${b64}) format('woff2')`);
    out.push(rebuilt);
  }
  return out.join('\n');
}

function svgDataUri(relPath) {
  const svg = read(relPath);
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
}

let html = read('index.html');
const css = read('css/styles.css');
const js = read('js/form.js');

// Inline the 4 SVG mockups.
for (const name of ['mod-enrollment', 'mod-academics', 'mod-finance', 'families']) {
  html = html.replace(`assets/img/${name}.svg`, svgDataUri(`assets/img/${name}.svg`));
}

let fontFaces = '';
try {
  fontFaces = await buildFontFaces();
  console.log('Embedded font faces:', (fontFaces.match(/@font-face/g) || []).length);
} catch (e) {
  console.warn('Font embed skipped (offline?):', e.message);
}

// Remove external stylesheet + Google Fonts links; inline everything.
html = html
  .replace(/<link rel="stylesheet" href="css\/styles\.css">/, '')
  .replace(/<link rel="preconnect"[^>]*>\s*/g, '')
  .replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/, '')
  .replace('<script src="js/form.js"></script>', `<script>\n${js}\n</script>`);

const styleBlock = `<style>\n${fontFaces}\n${css}\n</style>`;
html = html.replace('</head>', `${styleBlock}\n</head>`);

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'review.html'), html, 'utf8');
console.log('Wrote dist/review.html —', (html.length / 1024).toFixed(0), 'KB');
