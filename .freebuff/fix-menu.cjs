const fs = require('fs');

// =====================================================
// 1. Fix AeroCore - remove inline nav drawer + KoenigseggMenu wrapper
// =====================================================
function fixAeroCore() {
  let c = fs.readFileSync('src/components/LandingAeroCore.tsx', 'utf8');
  
  // Remove the Escape key handler referencing setIsMenuOpen
  c = c.replace(/const h = \(e: KeyboardEvent\) => \{ if \(e\.key === "Escape"\) \{ setIsMenuOpen\(false\); setIsContactModalOpen\(false\); \} \};\n\s*window\.addEventListener\("keydown", h\);\n\s*return \(\) => window\.removeEventListener\("keydown", h\);\n\s*\}, \[\]\);/g, 
    'useEffect(() => {\n    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setIsContactModalOpen(false); } };\n    window.addEventListener("keydown", h);\n    return () => window.removeEventListener("keydown", h);\n  }, []);');
  
  // Remove the hamburger button's isMenuOpen references (the animation state)
  // The hamburger button should just call onOpenMenu
  c = c.replace(/onClick=\{setIsMenuOpen\(!isMenuOpen\)\}/g, 'onClick={() => onOpenMenu?.()}');
  c = c.replace(/\$\{isMenuOpen \? "w-6 rotate-45 translate-y-\[4\.75px\]" : "w-7 group-hover:w-8"\}/g, '"w-7 group-hover:w-8"');
  c = c.replace(/\$\{isMenuOpen \? "w-6 -rotate-45 -translate-y-\[4\.75px\]" : "w-5 group-hover:w-8"\}/g, '"w-5 group-hover:w-8"');
  
  // Remove {isMenuOpen && ( <KoenigseggMenu ... /> )} block
  // This is a big block - find from {isMenuOpen && ( to matching )}
  const menuBlockRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}/;
  if (menuBlockRegex.test(c)) {
    c = c.replace(menuBlockRegex, '\n');
  }
  
  // Remove any remaining inline nav drawer (the numbered menu items block)
  // Find the big nav drawer block
  const inlineNavRegex = /\s*\{\/\* NAVIGATION DRAWER \*\/\}[\s\S]*?<\/AnimatePresence>/;
  if (inlineNavRegex.test(c)) {
    c = c.replace(inlineNavRegex, '\n');
  }
  
  // Remove the nav items array (setIsMenuOpen references in action callbacks)
  // These are in the inline drawer which should already be removed
  
  // Remove any remaining setIsMenuOpen(false) calls in onClick handlers
  c = c.replace(/setIsMenuOpen\(false\);/g, '// menu handled globally');
  
  fs.writeFileSync('src/components/LandingAeroCore.tsx', c);
  console.log('Fixed AeroCore');
}

// =====================================================
// 2. Fix Neoskin - same pattern
// =====================================================
function fixNeoskin() {
  let c = fs.readFileSync('src/components/LandingNeoskin.tsx', 'utf8');
  
  c = c.replace(/const h = \(e: KeyboardEvent\) => \{ if \(e\.key === "Escape"\) \{ setIsMenuOpen\(false\); setIsContactModalOpen\(false\); \} \};\n\s*window\.addEventListener\("keydown", h\);\n\s*return \(\) => window\.removeEventListener\("keydown", h\);\n\s*\}, \[\]\);/g,
    'useEffect(() => {\n    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setIsContactModalOpen(false); } };\n    window.addEventListener("keydown", h);\n    return () => window.removeEventListener("keydown", h);\n  }, []);');
  
  c = c.replace(/onClick=\{setIsMenuOpen\(!isMenuOpen\)\}/g, 'onClick={() => onOpenMenu?.()}');
  c = c.replace(/\$\{isMenuOpen \? "w-6 rotate-45 translate-y-\[4\.75px\]" : "w-7 group-hover:w-8"\}/g, '"w-7 group-hover:w-8"');
  c = c.replace(/\$\{isMenuOpen \? "w-6 -rotate-45 -translate-y-\[4\.75px\]" : "w-5 group-hover:w-8"\}/g, '"w-5 group-hover:w-8"');
  
  const menuBlockRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}/;
  if (menuBlockRegex.test(c)) {
    c = c.replace(menuBlockRegex, '\n');
  }
  
  const inlineNavRegex = /\s*\{\/\* NAVIGATION DRAWER \*\/\}[\s\S]*?<\/AnimatePresence>/;
  if (inlineNavRegex.test(c)) {
    c = c.replace(inlineNavRegex, '\n');
  }
  
  c = c.replace(/setIsMenuOpen\(false\);/g, '// menu handled globally');
  
  fs.writeFileSync('src/components/LandingNeoskin.tsx', c);
  console.log('Fixed Neoskin');
}

// =====================================================
// 3. Fix CeramicArmoring
// =====================================================
function fixCeramic() {
  let c = fs.readFileSync('src/components/LandingCeramicArmoring.tsx', 'utf8');
  
  c = c.replace(/const h = \(e: KeyboardEvent\) => \{ if \(e\.key === "Escape"\) \{ setIsMenuOpen\(false\); setIsContactModalOpen\(false\); \} \};\n\s*window\.addEventListener\("keydown", h\);\n\s*return \(\) => window\.removeEventListener\("keydown", h\);\n\s*\}, \[\]\);/g,
    'useEffect(() => {\n    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setIsContactModalOpen(false); } };\n    window.addEventListener("keydown", h);\n    return () => window.removeEventListener("keydown", h);\n  }, []);');
  
  c = c.replace(/onClick=\{setIsMenuOpen\(!isMenuOpen\)\}/g, 'onClick={() => onOpenMenu?.()}');
  c = c.replace(/\$\{isMenuOpen \? "w-6 rotate-45 translate-y-\[4\.75px\]" : "w-7 group-hover:w-8"\}/g, '"w-7 group-hover:w-8"');
  c = c.replace(/\$\{isMenuOpen \? "w-6 -rotate-45 -translate-y-\[4\.75px\]" : "w-5 group-hover:w-8"\}/g, '"w-5 group-hover:w-8"');
  
  const menuBlockRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}/;
  if (menuBlockRegex.test(c)) {
    c = c.replace(menuBlockRegex, '\n');
  }
  
  const inlineNavRegex = /\s*\{\/\* NAVIGATION DRAWER \*\/\}[\s\S]*?<\/AnimatePresence>/;
  if (inlineNavRegex.test(c)) {
    c = c.replace(inlineNavRegex, '\n');
  }
  
  c = c.replace(/setIsMenuOpen\(false\);/g, '// menu handled globally');
  
  fs.writeFileSync('src/components/LandingCeramicArmoring.tsx', c);
  console.log('Fixed Ceramic');
}

// =====================================================
// 4. Fix WinfSelect (has its own inline drawer + KoenigseggMenu)
// =====================================================
function fixWinfSelect() {
  let c = fs.readFileSync('src/components/LandingWinfSelect.tsx', 'utf8');
  
  // Fix Escape handler
  c = c.replace(/if \(e\.key === 'Escape'\) setIsMenuOpen\(false\);/g, '// menu handled globally');
  
  // Fix hamburger button
  c = c.replace(/onClick=\{\(\) => setIsMenuOpen\(!isMenuOpen\)\}/g, 'onClick={() => onOpenMenu?.()}');
  c = c.replace(/aria-label=\{isMenuOpen \? "Fechar Menu" : "Abrir Menu de Navegação"\}/g, 'aria-label="Abrir Menu de Navegação"');
  c = c.replace(/\$\{isMenuOpen\s*\n?\s*\? "w-6 rotate-45 translate-y-\[4\.75px\]" : "w-7 group-hover:w-8"\}/g, '"w-7 group-hover:w-8"');
  c = c.replace(/\$\{isMenuOpen\s*\n?\s*\? "w-6 -rotate-45 -translate-y-\[4\.75px\]" : "w-5 group-hover:w-8"\}/g, '"w-5 group-hover:w-8"');
  
  // Remove KoenigseggMenu render
  const menuBlockRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}/;
  if (menuBlockRegex.test(c)) {
    c = c.replace(menuBlockRegex, '\n');
  }
  
  // Remove inline nav drawer
  const inlineNavRegex = /\s*\{\/\* NAVIGATION DRAWER \*\/\}[\s\S]*?<\/AnimatePresence>/;
  if (inlineNavRegex.test(c)) {
    c = c.replace(inlineNavRegex, '\n');
  }
  
  // Remove nav items array that references setIsMenuOpen
  c = c.replace(/setIsMenuOpen\(false\);/g, '// menu handled globally');
  
  // Remove KoenigseggMenu import if no longer used
  c = c.replace(/import \{ KoenigseggMenu[^}]*\} from '.*';\n?/g, '');
  
  fs.writeFileSync('src/components/LandingWinfSelect.tsx', c);
  console.log('Fixed WinfSelect');
}

// =====================================================
// 5. Fix WinfHome
// =====================================================
function fixWinfHome() {
  let c = fs.readFileSync('src/components/LandingWinfHome.tsx', 'utf8');
  
  c = c.replace(/onClick=\{setIsMenuOpen\(!isMenuOpen\)\}/g, 'onClick={() => onOpenMenu?.()}');
  c = c.replace(/\$\{isMenuOpen \? 'w-6 rotate-45 translate-y-\[7\.5px\]' : 'w-8 group-hover:w-8'\}/g, "'w-8 group-hover:w-8'");
  c = c.replace(/\$\{isMenuOpen \? 'w-6 -rotate-45 -translate-y-\[7\.5px\]' : 'w-5 group-hover:w-8'\}/g, "'w-5 group-hover:w-8'");
  c = c.replace(/aria-label=\{isMenuOpen \? "Close menu" : "Open menu"\}/g, 'aria-label="Open menu"');
  
  // Remove KoenigseggMenu render
  const menuBlockRegex = /\s*\{isMenuOpen && \(\s*<KoenigseggMenu[\s\S]*?\/>\s*\)\}/;
  if (menuBlockRegex.test(c)) {
    c = c.replace(menuBlockRegex, '\n');
  }
  
  c = c.replace(/setIsMenuOpen\(false\);/g, '// menu handled globally');
  c = c.replace(/import \{ KoenigseggMenu[^}]*\} from '.*';\n?/g, '');
  
  fs.writeFileSync('src/components/LandingWinfHome.tsx', c);
  console.log('Fixed WinfHome');
}

// =====================================================
// 6. Fix remaining product pages (Invisible, DualReflect, BlackPro, SecurityBlind)
// =====================================================
function fixProductPages() {
  const pages = ['LandingInvisible', 'LandingDualReflect', 'LandingBlackPro', 'LandingSecurityBlind'];
  
  for (const name of pages) {
    let c = fs.readFileSync(`src/components/${name}.tsx`, 'utf8');
    
    // Fix Escape handler - remove setIsMenuOpen from it
    c = c.replace(/setIsMenuOpen\(false\); setIsContactModalOpen\(false\);/g, 'setIsContactModalOpen(false);');
    
    // Fix hamburger button animation states
    c = c.replace(/\$\{isMenuOpen \? "w-6 rotate-45 translate-y-\[4\.75px\]" : "w-7 group-hover:w-8"\}/g, '"w-7 group-hover:w-8"');
    c = c.replace(/\$\{isMenuOpen \? "w-6 -rotate-45 -translate-y-\[4\.75px\]" : "w-5 group-hover:w-8"\}/g, '"w-5 group-hover:w-8"');
    
    // Remove any remaining setIsMenuOpen references
    c = c.replace(/setIsMenuOpen\(false\);/g, '// menu handled globally');
    
    // Remove KoenigseggMenu import if present
    c = c.replace(/import \{ KoenigseggMenu[^}]*\} from '.*';\n?/g, '');
    
    // Remove KoenigseggMenu render
    c = c.replace(/<KoenigseggMenu[\s\S]*?\/>/g, '');
    
    fs.writeFileSync(`src/components/${name}.tsx`, c);
    console.log(`Fixed ${name}`);
  }
}

// Run all fixes
fixAeroCore();
fixNeoskin();
fixCeramic();
fixWinfSelect();
fixWinfHome();
fixProductPages();

console.log('\nAll pages fixed!');
