const fs = require('fs');
const files = ['LandingAeroCore','LandingNeoskin','LandingCeramicArmoring','LandingWinfHome'];
for (const f of files) {
  const p = 'src/components/' + f + '.tsx';
  let s = fs.readFileSync(p, 'utf8');
  let idx = 0, count = 0;
  let out = s.replace(/<video\b[\s\S]*?\/>/g, (block) => {
    idx++;
    if (idx === 1) return block; // hero stays eager
    if (!/autoPlay/.test(block)) return block;
    const poster = (block.match(/poster="([^"]*)"/) || [])[1];
    const src = (block.match(/src="([^"]*)"/) || [])[1];
    const className = (block.match(/className="([^"]*)"/) || [])[1];
    if (!poster || !src) return block;
    count++;
    return '<LazyVideo poster="' + poster + '" src="' + src + '"' + (className ? ' className="' + className + '"' : '') + ' />';
  });
  if (count > 0 && !out.includes("from './LazyVideo'")) {
    out = out.replace(/^(import .*?;\r?\n)/, '$1import LazyVideo from \'./LazyVideo\';\n');
  }
  if (count > 0) { fs.writeFileSync(p + '.tmp', out); fs.renameSync(p + '.tmp', p); }
  console.log(f, '->', count, 'lazyfied');
}
