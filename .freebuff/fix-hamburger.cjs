const fs = require('fs');

const files = [
  'src/components/LandingBlackPro.tsx',
  'src/components/LandingDualReflect.tsx',
  'src/components/LandingInvisible.tsx',
  'src/components/LandingSecurityBlind.tsx',
  'src/components/LandingAeroCore.tsx',
  'src/components/LandingCeramicArmoring.tsx',
  'src/components/LandingNeoskin.tsx',
  'src/components/LandingWinfSelect.tsx',
  'src/components/LandingWinfHome.tsx',
];

for (const path of files) {
  let c = fs.readFileSync(path, 'utf8');
  let changed = false;

  // Fix: "w-7 group-hover:w-8" → w-7 group-hover:w-8 (remove inner quotes in template literals)
  if (c.includes('"w-7 group-hover:w-8"')) {
    c = c.replace(/"w-7 group-hover:w-8"/g, 'w-7 group-hover:w-8');
    changed = true;
  }
  if (c.includes('"w-5 group-hover:w-8"')) {
    c = c.replace(/"w-5 group-hover:w-8"/g, 'w-5 group-hover:w-8');
    changed = true;
  }

  // Also fix the AeroCore/Neoskin/Ceramic multiline pattern
  if (c.includes('${"w-7 group-hover:w-8"')) {
    c = c.replace(/\$\{"w-7 group-hover:w-8"\n\s*\}/g, 'w-7 group-hover:w-8');
    changed = true;
  }
  if (c.includes('${"w-5 group-hover:w-8"')) {
    c = c.replace(/\$\{"w-5 group-hover:w-8"\n\s*\}/g, 'w-5 group-hover:w-8');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(path, c);
    console.log('Fixed: ' + path);
  } else {
    console.log('No changes: ' + path);
  }
}
console.log('Done!');
