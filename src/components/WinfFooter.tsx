import React from "react";

interface WinfFooterProps {
  brandName?: string;
  onNavigateToHome?: () => void;
  onNavigateToAeroCore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToWinfSelect?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToInvisible?: () => void;
  onNavigateToDualReflect?: () => void;
  onNavigateToBlackPro?: () => void;
}

export const WinfFooter: React.FC<WinfFooterProps> = ({
  brandName = "AEROCORE",
  onNavigateToHome,
  onNavigateToAeroCore,
  onNavigateToNeoskin,
  onNavigateToWinfSelect,
  onNavigateToCeramic,
  onNavigateToInvisible,
  onNavigateToDualReflect,
  onNavigateToBlackPro,
}) => {
  return (
    <footer className="relative z-10 w-full bg-black border-t border-white/10 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-20 space-y-14">

        {/* Brand Name (large spaced letters) */}
        <div className="text-center">
          <button
            onClick={() => {
              if (onNavigateToHome) onNavigateToHome();
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-3xl sm:text-4xl md:text-5xl font-sans font-light tracking-[0.5em] text-white uppercase hover:text-zinc-300 transition-colors cursor-pointer"
          >
            {brandName}
          </button>
        </div>

        {/* Ecosystem Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
          <button onClick={onNavigateToNeoskin} className="hover:text-white transition-colors cursor-pointer">NEOSKIN™</button>
          <span className="text-zinc-600">•</span>
          <button onClick={onNavigateToAeroCore} className="hover:text-white transition-colors cursor-pointer">AEROCORE™</button>
          <span className="text-zinc-600">•</span>
          <button onClick={onNavigateToWinfSelect} className="hover:text-white transition-colors cursor-pointer">WINF SELECT™ (ARQUITETURA)</button>
          <span className="text-zinc-600">•</span>
          <button onClick={onNavigateToWinfSelect} className="hover:text-white transition-colors cursor-pointer">WINF™ PREMIUM QUALITY WINDOWFILM</button>
          <span className="text-zinc-600">•</span>
          <button onClick={onNavigateToHome} className="hover:text-white transition-colors cursor-pointer">WINF™ PARTNERS</button>
          <span className="text-zinc-600">•</span>
          <button onClick={onNavigateToCeramic} className="hover:text-white transition-colors cursor-pointer">UNIVERSO DARK™</button>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-600">SYNTHWAVE FM™</span>
        </div>

        {/* Language Selectors */}
        <div className="flex items-center justify-center gap-5 text-[11px] font-mono uppercase tracking-widest">
          <button className="flex items-center gap-1.5 text-white cursor-pointer hover:opacity-80 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            BR
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 cursor-pointer hover:text-white transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            US
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 cursor-pointer hover:text-white transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            CN
          </button>
        </div>

        {/* Secondary Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">CERTIFICAÇÕES</a>
          <a href="#" className="hover:text-white transition-colors">LICENCIAMENTO</a>
          <a href="#" className="hover:text-white transition-colors">P&D</a>
          <a href="#" className="hover:text-white transition-colors">JURÍDICO</a>
          <a href="#" className="hover:text-white transition-colors">PRIVACIDADE</a>
        </div>

        {/* Divider */}
        <div className="w-24 h-[1px] bg-white/10 mx-auto" />

        {/* Tagline */}
        <div className="text-center">
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.4em] text-zinc-500">
            ENGENHARIA INVISÍVEL. &nbsp; PERFORMANCE INABALÁVEL.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-700">
            © 2026 {brandName}. INTEGRANTE DO ECOSISTEMA WINF™. TODOS OS DIREITOS RESERVADOS.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default WinfFooter;
