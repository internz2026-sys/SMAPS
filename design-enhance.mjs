// Enhances the staged Claude Design bundle so it shows the REAL product mockups
// (not flat placeholders): injects base64 SVGs into modules.html and rebuilds
// pages/landing.html from the real index.html (Google Fonts kept — the Design
// pane allows them, so no need to embed fonts here).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const write = (p, c) => writeFileSync(join(ROOT, p), c, 'utf8');

const b64 = {};
for (const name of ['mod-enrollment', 'mod-academics', 'mod-finance', 'families']) {
  b64[name] = `data:image/svg+xml;base64,${Buffer.from(read(`assets/img/${name}.svg`), 'utf8').toString('base64')}`;
}

// ---- 1. modules.html : real mockups, framed ----
let mods = read('design-system/sections/modules.html');
mods = mods.replace(
  '.card-media { height: 300px; position: relative; overflow: hidden; }',
  '.card-media { height: 300px; position: relative; overflow: hidden; background:#EDF2FA; border:1px solid #E5E9F0; }\n' +
  '    .media-img { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; display:block; }'
);
mods = mods
  .replace('<div class="img-ph">Enrollment &amp; records</div>', `<img class="media-img" src="${b64['mod-enrollment']}" alt="SMAPS enrollment and student directory screen">`)
  .replace('<div class="img-ph">Teaching &amp; grading</div>', `<img class="media-img" src="${b64['mod-academics']}" alt="SMAPS electronic class record and grading screen">`)
  .replace('<div class="img-ph">Billing &amp; cash</div>', `<img class="media-img" src="${b64['mod-finance']}" alt="SMAPS student ledger and cash management screen">`);
write('design-system/sections/modules.html', mods);
console.log('modules.html: injected', 3, 'mockups');

// ---- 2. pages/landing.html : full real page, mockups inlined, fonts via CDN ----
let html = read('index.html');
const css = read('css/styles.css');
const js = read('js/form.js');
for (const name of ['mod-enrollment', 'mod-academics', 'mod-finance', 'families']) {
  html = html.replace(`assets/img/${name}.svg`, b64[name]);
}
html = html
  .replace(/<link rel="stylesheet" href="css\/styles\.css">/, `<style>\n${css}\n</style>`)
  .replace('<script src="js/form.js"></script>', `<script>\n${js}\n</script>`);
html = `<!-- @dsCard group="Pages" -->\n<!-- Full SMAPS landing page. Source of truth: smaps-landing/index.html -->\n` + html;
write('design-system/pages/landing.html', html);
console.log('landing.html: rebuilt from real index.html —', (html.length / 1024).toFixed(0), 'KB');
