const fs = require('fs');

const files = [
  'src/components/LandingAeroCore.tsx',
  'src/components/LandingNeoskin.tsx',
  'src/components/LandingCeramicArmoring.tsx',
];

for (const path of files) {
  let c = fs.readFileSync(path, 'utf8');
  
  // Remove entire nav drawer block: from any comment containing "Navigation Drawer" 
  // through the closing </AnimatePresence>
  // Pattern: find {isMenuOpen && ( and remove everything until </AnimatePresence>
  
  // More aggressive: find ANY <AnimatePresence> block that wraps {isMenuOpen && (
  // and remove it entirely
  let changed = false;
  
  // Find all AnimatePresence blocks with isMenuOpen
  const regex = /<AnimatePresence>\s*\{isMenuOpen && \([\s\S]*?<\/AnimatePresence>/g;
  if (regex.test(c)) {
    c = c.replace(regex, '\n');
    changed = true;
  }
  
  // Also remove standalone {isMenuOpen && ( <KoenigseggMenu ... /> )} blocks
  const koenigRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}/;
  if (koenigRegex.test(c)) {
    c = c.replace(koenigRegex, '\n');
    changed = true;
  }
  
  // Remove any comment blocks about navigation drawer that were left behind
  const commentRegex = /\s*\{\/\* Full-Screen[^*]*\*\/\}\s*\n?/g;
  if (commentRegex.test(c)) {
    c = c.replace(commentRegex, '\n');
    changed = true;
  }
  
  // Fix broken "// menu handled globally" in arrow functions
  // Pattern: () => { // menu handled globally someCode }
  // Should be: () => { someCode }
  c = c.replace(/\(\) => \{ \/\/ menu handled globally /g, '() => { ');
  c = c.replace(/action: \(\) => \{ \/\/ menu handled globally /g, 'action: () => { ');
  
  if (changed) {
    fs.writeFileSync(path, c);
    console.log(`Fixed nav drawers in: ${path}`);
  } else {
    console.log(`No nav drawer changes needed: ${path}`);
  }
}

// Also fix the WinfSelect inline nav drawer (it has its own pattern)
let winf = fs.readFileSync('src/components/LandingWinfSelect.tsx', 'utf8');

// Remove any AnimatePresence blocks wrapping isMenuOpen
const winfRegex = /<AnimatePresence>\s*\{isMenuOpen && \([\s\S]*?<\/AnimatePresence>/g;
if (winfRegex.test(winf)) {
  winf = winf.replace(winfRegex, '\n');
}

// Remove the inline nav items array that references setIsMenuOpen
const navItemsRegex = /\s*const navItems = \[[\s\S]*?\];\n?/g;
if (navItemsRegex.test(winf)) {
  winf = winf.replace(navItemsRegex, '\n');
}

// Fix broken "// menu handled globally" in arrow functions
winf = winf.replace(/\(\) => \{ \/\/ menu handled globally /g, '() => { ');
winf = winf.replace(/action: \(\) => \{ \/\/ menu handled globally /g, 'action: () => { ');

// Remove KoenigseggMenu import if present
winf = winf.replace(/import \{ KoenigseggMenu[^}]*\} from '.*';\n?/g, '');

fs.writeFileSync('src/components/LandingWinfSelect.tsx', winf);
console.log('Fixed WinfSelect');

console.log('\nDone!');
