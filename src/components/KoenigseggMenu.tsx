import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface KoenigseggMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToWinf?: () => void;
  onNavigateToAeroCore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToInvisible?: () => void;
  onNavigateToMiniblindVenetian?: () => void;
  onNavigateToDualReflect?: () => void;
  onNavigateToBlackPro?: () => void;
  onNavigateToSecurityBlind?: () => void;
  onNavigateToShop?: () => void;
  onNavigateToPartners?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToHome?: () => void;
  onOpenContact?: (subject?: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const KoenigseggMenu: React.FC<KoenigseggMenuProps> = ({
  isOpen,
  onClose,
  onNavigateToWinf,
  onNavigateToAeroCore,
  onNavigateToNeoskin,
  onNavigateToCeramic,
  onNavigateToInvisible,
  onNavigateToMiniblindVenetian,
  onNavigateToDualReflect,
  onNavigateToBlackPro,
  onNavigateToSecurityBlind,
  onNavigateToShop,
  onNavigateToPartners,
  onNavigateToBlog,
  onNavigateToHome,
  onOpenContact,
  onScrollToSection
}) => {
  const handleScrollOrNav = (sectionId: string, fallbackNav?: () => void) => {
    onClose();
    const el = document.getElementById(sectionId);
    if (el) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (fallbackNav) {
      fallbackNav();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 bg-[#121214] pointer-events-auto flex flex-col justify-between p-8 sm:p-14 md:p-20 z-50 overflow-y-auto"
        >
          {/* Top Right Close Button (Square with border and thin 'x') */}
          <div className="w-full flex justify-end">
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 border border-white/15 bg-transparent hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer rounded-none group"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="w-full max-w-7xl mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            
            {/* Left Side: Giant Bold Navigation Words */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-1 sm:space-y-2 select-none">
              
              {/* WINF SELECT (HOME) */}
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
                onClick={() => {
                  onClose();
                  if (onNavigateToHome) onNavigateToHome();
                  else handleScrollOrNav('linhas');
                }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(3rem,4.9vw,5rem)] font-sans font-black tracking-tight uppercase text-white hover:text-zinc-400 transition-colors cursor-pointer text-left leading-[0.95] min-w-0"
              >
                WINF SELECT™
              </motion.button>

              {/* AEROCORE */}
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                onClick={() => {
                  onClose();
                  if (onNavigateToAeroCore) onNavigateToAeroCore();
                  else handleScrollOrNav('c4-horizontal-tabs-4');
                }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(3rem,4.9vw,5rem)] font-sans font-black tracking-tight uppercase text-white hover:text-zinc-400 transition-colors cursor-pointer text-left leading-[0.95] min-w-0"
              >
                AEROCORE™
              </motion.button>

              {/* ABOUT US (seção sobre da WINF SELECT) */}
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                onClick={() => {
                  onClose();
                  const goAbout = () => {
                    const el = document.getElementById('manifesto');
                    if (el) {
                      if ((window as any).lenis) (window as any).lenis.scrollTo(el, { duration: 1.2 });
                      else el.scrollIntoView({ behavior: 'smooth' });
                    }
                  };
                  if (window.location.pathname === '/') {
                    goAbout();
                  } else if (onNavigateToWinf) {
                    onNavigateToWinf();
                    setTimeout(goAbout, 150);
                  } else {
                    handleScrollOrNav('manifesto');
                  }
                }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(3rem,4.9vw,5rem)] font-sans font-black tracking-tight uppercase text-white hover:text-zinc-400 transition-colors cursor-pointer text-left leading-[0.95] min-w-0"
              >
                ABOUT US
              </motion.button>

              {/* PPF */}
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                onClick={() => {
                  onClose();
                  if (onNavigateToNeoskin) onNavigateToNeoskin();
                  else handleScrollOrNav('c6-feature-block-16');
                }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(3rem,4.9vw,5rem)] font-sans font-black tracking-tight uppercase text-white hover:text-zinc-400 transition-colors cursor-pointer text-left leading-[0.95] min-w-0"
              >
                PPF
              </motion.button>

            </div>

            {/* Right Side: Secondary Links & Architectural Lines */}
            <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-3 gap-8 text-base sm:text-lg font-normal text-zinc-300 font-sans">
              
              {/* Column 1: Specific Lines */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2">
                  // WINF SELECT™
                </span>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToInvisible) onNavigateToInvisible();
                    else handleScrollOrNav('invisible');
                  }}
                  className="block text-left text-zinc-300 hover:text-cyan-300 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  Invisible™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToMiniblindVenetian) onNavigateToMiniblindVenetian();
                    else handleScrollOrNav('miniblind-venetian');
                  }}
                  className="block text-left text-zinc-300 hover:text-teal-300 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  Miniblind & Venetian™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToDualReflect) onNavigateToDualReflect();
                    else handleScrollOrNav('dual_reflect');
                  }}
                  className="block text-left text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  Dual-Reflect™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToBlackPro) onNavigateToBlackPro();
                    else handleScrollOrNav('blackpro');
                  }}
                  className="block text-left text-zinc-300 hover:text-indigo-300 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  BlackPro™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToSecurityBlind) onNavigateToSecurityBlind();
                    else handleScrollOrNav('securityblind');
                  }}
                  className="block text-left text-zinc-300 hover:text-red-400 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  SecurityBlinder™
                </button>
              </div>

              {/* Column 2: AeroCore™ Lines */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2">
                  // AEROCORE™
                </span>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToAeroCore) onNavigateToAeroCore();
                  }}
                  className="block text-left text-zinc-300 hover:text-sky-300 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  AeroCore™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToNeoskin) onNavigateToNeoskin();
                  }}
                  className="block text-left text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  NeoSkin™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToCeramic) onNavigateToCeramic();
                  }}
                  className="block text-left text-zinc-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base font-mono"
                >
                  Ceramic Armoring™
                </button>
              </div>

              {/* Column 3: Direct Services & Concierge */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-2">
                  // SERVICES
                </span>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenContact) onOpenContact('Dealer Locator');
                    else window.open('https://wa.me/5513997815375?text=Olá,%20gostaria%20de%20localizar%20um%20Licenciado%20WINF.', '_blank');
                  }}
                  className="block text-left text-zinc-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Dealer Locator
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToShop) onNavigateToShop();
                  }}
                  className="block text-left text-zinc-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base font-mono font-bold tracking-wider"
                >
                  BlackShop™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToBlog) onNavigateToBlog();
                  }}
                  className="block text-left text-zinc-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Journal
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToPartners) onNavigateToPartners();
                  }}
                  className="block text-left text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer text-sm sm:text-base font-mono font-bold"
                >
                  Partners™
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenContact) onOpenContact('Contact');
                    else window.open('https://wa.me/5513997815375?text=Olá,%20gostaria%20de%20atendimento%20oficial%20WINF.', '_blank');
                  }}
                  className="block text-left text-zinc-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Contact
                </button>
              </div>

            </div>

          </div>

          {/* Bottom empty spacing or subtle note */}
          <div className="w-full flex justify-between items-center text-xs font-mono text-zinc-400 pt-4">
            <span>WINF SELECT™ & AEROCORE™ // ECOSYSTEM</span>
            <button 
              onClick={() => { onClose(); if (onNavigateToHome) onNavigateToHome(); }}
              className="text-zinc-400 hover:text-zinc-300 transition-colors uppercase text-[10px] hidden sm:inline"
            >
              PORTAL GLOBAL WINF-HOME →
            </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KoenigseggMenu;
