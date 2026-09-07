const fs = require('fs'), path = require('path');
// set of converted webp public-relative paths (images/xxx.webp)
const webps = new Set();
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.webp')) webps.add(p.split(path.sep).join('/').replace(/^public\//, ''));
  }
}
walk('public/images');

let count = 0;
function walkSrc(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walkSrc(p); continue; }
    if (!/\.(tsx|ts|css)$/.test(e.name)) continue;
    let s = fs.readFileSync(p, 'utf8');
    const before = s;
    for (const w of webps) {
      const png = w.replace(/\.webp$/, '.png');
      s = s.split('/' + png).join('/' + w);
    }
    if (s !== before) { fs.writeFileSync(p, s); count++; console.log('updated', p); }
  }
}
walkSrc('src');
console.log('files updated:', count);
