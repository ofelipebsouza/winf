const fs = require('fs');
const files = ['LandingAeroCore','LandingNeoskin','LandingCeramicArmoring','LandingDualReflect','LandingBlackPro','LandingMiniblindVenetian','LandingWinfHome'];
for (const f of files) {
  const p = 'src/components/' + f + '.tsx';
  let s = fs.readFileSync(p, 'utf8');
  const re = /<video autoPlay loop muted playsInline preload="auto" (poster="[^"]*" src="[^"]*")/g;
  let first = true, count = 0;
  s = s.replace(re, (m, rest) => {
    if (first) { first = false; return m; } // keep the hero (above the fold) eager
    count++;
    return '<LazyVideo ' + rest;
  });
  if (count > 0 && !s.includes("from './LazyVideo'") && !s.includes('from "../components/LazyVideo"')) {
    // add import after the framer-motion import
    s = s.replace(/import \{ motion[^}]*\} from ['"]framer-motion['"];/, (m) => m + "\nimport LazyVideo from './LazyVideo';");
  }
  fs.writeFileSync(p + '.tmp', s);
  fs.renameSync(p + '.tmp', p);
  console.log(f, '->', count, 'videos lazyfied');
}
