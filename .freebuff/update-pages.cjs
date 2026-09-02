const fs = require('fs');

const files = [
  // Product pages with inline nav drawers
  { path: 'src/components/LandingInvisible.tsx', interfaceName: 'LandingInvisibleProps' },
  { path: 'src/components/LandingDualReflect.tsx', interfaceName: 'LandingDualReflectProps' },
  { path: 'src/components/LandingBlackPro.tsx', interfaceName: 'LandingBlackProProps' },
  { path: 'src/components/LandingSecurityBlind.tsx', interfaceName: 'LandingSecurityBlindProps' },
  // Pages that use KoenigseggMenu
  { path: 'src/components/LandingAeroCore.tsx', interfaceName: 'LandingAeroCoreProps' },
  { path: 'src/components/LandingNeoskin.tsx', interfaceName: 'LandingNeoskinProps' },
  { path: 'src/components/LandingCeramicArmoring.tsx', interfaceName: 'LandingCeramicArmoringProps' },
  { path: 'src/components/LandingWinfSelect.tsx', interfaceName: 'LandingWinfSelectProps' },
  { path: 'src/components/LandingWinfHome.tsx', interfaceName: 'LandingWinfHomeProps' },
];

for (const file of files) {
  let content = fs.readFileSync(file.path, 'utf8');
  let changed = false;

  // 1. Add onOpenMenu to interface (before the closing })
  if (!content.includes('onOpenMenu')) {
    // Find interface closing brace
    const interfaceRegex = new RegExp(`(interface ${file.interfaceName} \\{[\\s\\S]*?)(^\\})`, 'm');
    const match = content.match(interfaceRegex);
    if (match) {
      // Add onOpenMenu before the closing brace
      content = content.replace(
        interfaceRegex,
        `$1  onOpenMenu?: () => void;\n$2`
      );
      changed = true;
    }
  }

  // 2. Add onOpenMenu to destructuring
  // Find the component's destructuring pattern
  const exportRegex = new RegExp(`(export const \\w+: React.FC<\\w+Props> = \\{[\\s\\S]*?)(\\) =>)`);
  const exportMatch = content.match(exportRegex);
  if (exportMatch && !content.includes('onOpenMenu,')) {
    // Add onOpenMenu before the closing ) =>
    const lastCommaBeforeClose = exportMatch[1].trimEnd().endsWith(',')
      ? ''
      : ',';
    content = content.replace(
      exportRegex,
      `$1${lastCommaBeforeClose}\n  onOpenMenu,$2`
    );
    changed = true;
  }

  // 3. Remove isMenuOpen state line
  const menuStateRegex = /const \[isMenuOpen, setIsMenuOpen\] = useState\(false\);\n?/;
  if (menuStateRegex.test(content)) {
    content = content.replace(menuStateRegex, '');
    changed = true;
  }

  // 4. Remove inline navigation drawer sections
  // Pattern: {/* NAVIGATION DRAWER */} through the closing </AnimatePresence>
  // These use different patterns depending on the page
  
  // For product pages: NAVIGATION DRAWER block
  const navDrawerRegex = /\s*\{\/\* NAVIGATION DRAWER \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>\s*\n?/;
  if (navDrawerRegex.test(content)) {
    content = content.replace(navDrawerRegex, '\n');
    changed = true;
  }

  // For pages using KoenigseggMenu: remove the <KoenigseggMenu ... /> component render
  // Pattern varies but usually: <KoenigseggMenu\n  isOpen={isMenuOpen}...\n/>
  const koenigseggRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}\s*/;
  if (koenigseggRegex.test(content)) {
    content = content.replace(koenigseggRegex, '\n');
    changed = true;
  }

  // Also try removing standalone <KoenigseggMenu ... /> if present
  const koenigseggStandaloneRegex = /\s*<KoenigseggMenu\n\s*isOpen=\{isMenuOpen\}[\s\S]*?\/>\s*/;
  if (koenigseggStandaloneRegex.test(content)) {
    content = content.replace(koenigseggStandaloneRegex, '\n');
    changed = true;
  }

  // 5. Update hamburger button to use onOpenMenu
  // Replace onClick={() => setIsMenuOpen(!isMenuOpen)} with onClick={() => onOpenMenu?.()}
  if (content.includes('setIsMenuOpen(!isMenuOpen)')) {
    content = content.replace(/onClick=\{(\(\) => )?setIsMenuOpen\(!isMenuOpen\)\}/g, 'onClick={() => onOpenMenu?.()}');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file.path, content);
    console.log(`Updated: ${file.path}`);
  } else {
    console.log(`No changes needed: ${file.path}`);
  }
}

console.log('Done!');
