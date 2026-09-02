const fs = require('fs');

const files = [
  'src/components/LandingAeroCore.tsx',
  'src/components/LandingNeoskin.tsx',
  'src/components/LandingCeramicArmoring.tsx',
  'src/components/LandingInvisible.tsx',
  'src/components/LandingDualReflect.tsx',
  'src/components/LandingBlackPro.tsx',
  'src/components/LandingSecurityBlind.tsx',
  'src/components/LandingWinfSelect.tsx',
  'src/components/LandingWinfHome.tsx',
];

for (const path of files) {
  let c = fs.readFileSync(path, 'utf8');
  let changed = false;

  // 1. Add onOpenMenu to destructuring if not present
  if (c.includes('onOpenMenu?:') && !c.match(/onOpenMenu,\s*\n/)) {
    // Find the destructuring pattern and add onOpenMenu
    // Pattern: ({\n  onBack,\n  ...}) => {
    // Add onOpenMenu after the last prop before }) =>
    c = c.replace(
      /(\)\s*=>\s*\{)/,
      (match) => {
        // Check if onOpenMenu is already in destructuring
        return match;
      }
    );
    
    // Better approach: find last prop before }) => and add onOpenMenu after it
    // Match the closing of destructuring
    const destructMatch = c.match(/export const \w+: React\.FC<\w+Props> = \(\{([\s\S]*?)\}\) =>/);
    if (destructMatch && !destructMatch[1].includes('onOpenMenu')) {
      // Find the last prop line
      const props = destructMatch[1].trim().split('\n');
      const lastProp = props[props.length - 1].trim();
      // Add onOpenMenu after last prop
      const newProps = props.slice(0, -1).join('\n') + '\n  ' + lastProp + (lastProp.endsWith(',') ? '' : ',') + '\n  onOpenMenu,';
      
      c = c.replace(
        /export const (\w+): React\.FC<\w+Props> = \(\{[\s\S]*?\}\) =>/,
        (match) => {
          return match.replace(destructMatch[1], '\n' + newProps + '\n');
        }
      );
      changed = true;
    }
  }

  // 2. Fix hamburger button: replace isMenuOpen ternaries with static values
  // Pattern: ${isMenuOpen ? "w-6 rotate-45 translate-y-[4.75px]" : "w-7 group-hover:w-8"}
  const ternaryRegex = /\$\{isMenuOpen\s*\?\s*"[^"]*"\s*:\s*"([^"]*)"\}/g;
  if (ternaryRegex.test(c)) {
    c = c.replace(ternaryRegex, '"$1"');
    changed = true;
  }

  // Single quotes version
  const ternaryRegex2 = /\$\{isMenuOpen\s*\?\s*'[^']*'\s*:\s*'([^']*)'\}/g;
  if (ternaryRegex2.test(c)) {
    c = c.replace(ternaryRegex2, "'$1'");
    changed = true;
  }

  // 3. Remove any remaining isMenuOpen state declaration
  const stateRegex = /const \[isMenuOpen, setIsMenuOpen\] = useState\(false\);\n?/;
  if (stateRegex.test(c)) {
    c = c.replace(stateRegex, '');
    changed = true;
  }

  // 4. Remove any remaining setIsMenuOpen references  
  if (c.includes('setIsMenuOpen')) {
    // In arrow functions: () => { setIsMenuOpen(false); ... }  → () => { ... }
    c = c.replace(/\{ setIsMenuOpen\(false\); /g, '{ ');
    // Standalone: setIsMenuOpen(false);
    c = c.replace(/setIsMenuOpen\(false\);?\n?/g, '');
    changed = true;
  }

  // 5. Remove KoenigseggMenu import if present and not used
  if (c.includes("import { KoenigseggMenu") && !c.includes('<KoenigseggMenu')) {
    c = c.replace(/import \{ KoenigseggMenu[^}]*\} from ['"].*['"];\n?/g, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(path, c);
    console.log(`Fixed: ${path}`);
  } else {
    console.log(`No changes: ${path}`);
  }
}

console.log('\nDone!');
