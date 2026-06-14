import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Globe, ShieldCheck } from 'lucide-react';

interface LandingBriefingProps {
  onEnter: () => void;
  onNavigateUniversoDark?: () => void;
  onNavigatePublicPortal?: () => void;
  onNavigateSynthwave?: () => void;
}

const LandingBriefing: React.FC<LandingBriefingProps> = ({ onEnter, onNavigateUniversoDark, onNavigatePublicPortal, onNavigateSynthwave }) => {
  return (
    <div className="min-h-screen text-black font-sans selection:bg-[#131314]/10 flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #fcfcfd 0%, #f6f6f9 50%, #eff0f4 100%)',
      }}
    >
      {/* Subtle Apple-style private equity layout assets (blur grid, tactile glass dots) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#131314 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* High-end decorative ambient light orb behind content area to highlight Liquid Glass translucency */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-300/20 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <header className="p-6 md:p-10 w-full relative z-10">
        <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-black">
          WINF™ PARTNERS
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-6 md:px-10 max-w-6xl mx-auto w-full pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="text-xs md:text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-black/40 mb-6">
            A C E S S O   E X C L U S I V O   P A R A   L Í D E R E S
          </div>
          
          <h2 className="text-5xl md:text-[7rem] font-heading font-black tracking-tighter uppercase leading-[0.9] mb-8">
            <span className="text-black block">CONSTRUÍMOS</span>
            <span className="text-zinc-400 italic block mt-2">O PADRÃO.</span>
          </h2>

          <p className="text-lg md:text-2xl font-light text-black/60 mb-12 max-w-2xl leading-relaxed">
            O acesso ao ecossistema WINF™ não é uma questão de escolha, mas de qualificação. Você não nos encontra, você é selecionado.
          </p>

          <div className="flex flex-col gap-4 max-w-lg">
            {/* CTA Option 1 - Obsidian Dark Liquid Glass */}
            <button 
              onClick={onEnter}
              className="w-full text-white flex items-center justify-between px-8 py-6 rounded-[4px] transition-all duration-300 ease-out group hover:-translate-y-[1px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(23, 23, 26, 0.98) 0%, rgba(13, 13, 15, 0.99) 50%, rgba(5, 5, 6, 1) 100%)',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.9), 0 8px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Subtle gloss sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.04] to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <Globe size={24} className="opacity-60 text-white" />
                <span className="font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-left">
                  Ativar Território
                  <span className="block text-[9px] text-white/50 tracking-widest mt-1 font-mono">Acesso WINF OS™</span>
                </span>
              </div>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform shrink-0 text-white relative z-10" />
            </button>
            
            {/* CTA Option 2 - Clear Translucent Liquid Glass */}
            {onNavigateUniversoDark && (
              <button 
                onClick={onNavigateUniversoDark}
                className="w-full text-zinc-900 flex items-center justify-between px-8 py-6 rounded-[4px] transition-all duration-300 ease-out backdrop-blur-md group hover:-translate-y-[1px] relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.15) 100%)',
                  boxShadow: 'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.1] via-white/[0.2] to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <Shield size={24} className="opacity-60 text-zinc-800" />
                  <span className="font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-left">
                    Universo Dark
                    <span className="block text-[9px] text-zinc-500 tracking-widest mt-1 font-mono">Terminal de Private Equity</span>
                  </span>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform shrink-0 text-zinc-805 relative z-10" />
              </button>
            )}

            {/* CTA Option 3 - Clear Translucent Liquid Glass */}
            {onNavigatePublicPortal && (
              <button 
                onClick={onNavigatePublicPortal}
                className="w-full text-zinc-900 flex items-center justify-between px-8 py-6 rounded-[4px] transition-all duration-300 ease-out backdrop-blur-md group hover:-translate-y-[1px] relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.15) 100%)',
                  boxShadow: 'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.1] via-white/[0.2] to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <ShieldCheck size={24} className="opacity-60 text-zinc-800" />
                  <span className="font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-left">
                    Portal do Cliente & Arquitetos
                    <span className="block text-[9px] text-zinc-500 tracking-widest mt-1 font-mono">Blockchain & Validação</span>
                  </span>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform shrink-0 text-zinc-805 relative z-10" />
              </button>
            )}

            {/* CTA Option 4 - Synthwave Split Mechanical Button */}
            {onNavigateSynthwave && (
              <div 
                className="w-full max-w-lg mx-auto mt-12 flex items-stretch h-[68px] cursor-pointer relative group transition-all duration-350 ease-out hover:-translate-y-[1px]"
                onClick={onNavigateSynthwave}
              >
                {/* Left Area: Obsidian Black Liquid Glass Ecosystem Engine */}
                <div 
                  className="w-[100px] relative transition-all duration-300 ease-out flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(23, 23, 26, 0.98) 0%, rgba(13, 13, 15, 0.99) 50%, rgba(5, 5, 6, 1) 100%)',
                    boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.9), 0 8px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)',
                    borderRadius: '4px 0 0 4px',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.05] to-transparent pointer-events-none" />
                  
                  {/* Premium animated soundwave engine */}
                  <div className="flex items-end gap-[3px] h-6 overflow-hidden z-10 mr-1.5 pt-1">
                    <motion.div
                      className="w-[2px] bg-white rounded-[0.5px]"
                      animate={{ height: ["40%", "95%", "40%"] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    />
                    <motion.div
                      className="w-[2px] bg-white rounded-[0.5px]"
                      animate={{ height: ["80%", "30%", "80%"] }}
                      transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.div
                      className="w-[2px] bg-white rounded-[0.5px]"
                      animate={{ height: ["30%", "85%", "30%"] }}
                      transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                    <motion.div
                      className="w-[2px] bg-white rounded-[0.5px]"
                      animate={{ height: ["65%", "20%", "65%"] }}
                      transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Right Area: Clear Transparent Liquid Glass with precise machined gap */}
                <div 
                  className="flex-1 ml-[-14px] px-8 py-5 flex items-center justify-between transition-all duration-300 ease-out"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                    clipPath: 'polygon(15.5px 0%, 100% 0%, 100% 100%, 1.5px 100%)',
                    borderRadius: '0 4px 4px 0',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-white/[0.12] to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col text-left pl-3.5 z-10">
                    <span className="font-extrabold text-lg md:text-xl text-black italic tracking-tighter uppercase leading-none">
                      Synthwave.fm™
                    </span>
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5 font-mono leading-none">
                      Rádio de Alta Performance WINF
                    </span>
                  </div>
                  
                  <div className="flex items-center z-10">
                    <ArrowRight size={20} className="text-zinc-800 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingBriefing;
