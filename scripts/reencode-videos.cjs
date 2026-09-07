// Re-encode mp4s > 8MB: H.264 CRF 27, no audio (all site videos are muted loops), veryfast
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const root = 'public/videos';
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.toLowerCase().endsWith('.mp4') && fs.statSync(p).size > 8 * 1024 * 1024) files.push(p);
  }
}
walk(root);
console.log('re-encoding', files.length, 'videos');
let freed = 0, done = 0;
for (const f of files) {
  const before = fs.statSync(f).size;
  const tmp = f + '.tmp.mp4';
  try {
    execSync(`ffmpeg -y -hide_banner -loglevel error -i "${f}" -c:v libx264 -crf 27 -preset veryfast -an -movflags +faststart "${tmp}"`);
    const after = fs.statSync(tmp).size;
    if (after < before * 0.85) {
      fs.unlinkSync(f);
      fs.renameSync(tmp, f);
      freed += before - after;
      done++;
      console.log('ok', f.split(/[\\/]/).pop(), (before / 1048576).toFixed(1) + 'MB ->', (after / 1048576).toFixed(1) + 'MB');
    } else {
      fs.unlinkSync(tmp);
      console.log('skip (no gain)', f.split(/[\\/]/).pop());
    }
  } catch (e) {
    console.error('FAIL', f);
    try { fs.existsSync(tmp) && fs.unlinkSync(tmp); } catch {}
  }
}
console.log('DONE', done, 'videos, freed', (freed / 1048576).toFixed(0) + 'MB');
