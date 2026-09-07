const fs = require('fs');
let s = fs.readFileSync('src/App.tsx', 'utf8');
const names = ['LandingWinfHome','LandingWinfSelect','LandingAeroCore','LandingNeoskin','LandingCeramicArmoring','LandingInvisible','LandingMiniblindVenetian','LandingDualReflect','LandingBlackPro','LandingSecurityBlind','AeroCoreCatalog','NeoSkinCatalog','LandingShop','LandingBlog'];
let n = 0;
for (const name of names) {
  const re = new RegExp("import " + name + " from '(\\./components/[\\w-]+)';");
  if (re.test(s)) {
    s = s.replace(re, "const " + name + " = React.lazy(() => import('$1'));");
    n++;
  } else console.log('NO MATCH', name);
}
fs.writeFileSync('src/App.tsx', s);
console.log('converted', n);
