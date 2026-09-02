import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KoenigseggMenu from "./KoenigseggMenu";
import WinfFooter from "./WinfFooter";
import {
  Shield,
  Zap,
  Droplets,
  Sparkles,
  Thermometer,
  AlertTriangle,
  Flame,
  ArrowRight,
  X,
  Send,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Box,
  Layers,
  Crosshair,
  ShieldCheck,
  Award,
  Sun,
  Eye,
  Activity,
  Check
} from "lucide-react";

interface LandingAeroCoreProps {
  onBack?: () => void;
  onNavigateToWinf?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToCatalog?: () => void;
  onNavigateToGhost?: () => void;
  onNavigateToPhantom?: () => void;
  onNavigateToSpectre?: () => void;
  onNavigateToWraith?: () => void;
  onOpenMenu?: () => void;
}

interface SpecRow {
  parameter: string;
  icon: any;
  ghost: string;
  phantom: string;
  spectre: string;
  wraith: string;
}

const AERO_SPEC_ROWS: SpecRow[] = [
  {
    parameter: "Categoria de Defesa",
    icon: Shield,
    ghost: "Performance Tingida",
    phantom: "Carbono Estrutural",
    spectre: "Nano-Cerâmica",
    wraith: "Sputtering Iônico",
  },
  {
    parameter: "Transmissão (VLT)",
    icon: Eye,
    ghost: "05%, 15%, 35%",
    phantom: "05%, 15%, 35%",
    spectre: "05%, 15%, 35%",
    wraith: "70% (Invisível)",
  },
  {
    parameter: "Bloqueio IR",
    icon: Zap,
    ghost: "58% Rejeição",
    phantom: "73% Rejeição",
    spectre: "95% Bloqueio",
    wraith: "98% Bloqueio",
  },
  {
    parameter: "Redução UV",
    icon: Sun,
    ghost: "92% Barreira",
    phantom: "99% Barreira",
    spectre: "99% Absoluto",
    wraith: "99% Absoluto",
  },
  {
    parameter: "Tecnologia Primária",
    icon: Layers,
    ghost: "Termo-Absorção Clássica",
    phantom: "Matriz Não-Metálica",
    spectre: "Nanopartículas Cerâmicas",
    wraith: "Sputtering Multicamada",
  },
  {
    parameter: "Estabilidade de Cor",
    icon: Sparkles,
    ghost: "Alta",
    phantom: "Muito Alta",
    spectre: "Absoluta",
    wraith: "Absoluta",
  },
  {
    parameter: "Garantia Homologada",
    icon: Check,
    ghost: "3 Anos",
    phantom: "10 Anos",
    spectre: "10 Anos",
    wraith: "10 Anos",
  },
];

const AERO_FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Como o AeroCore protege meus ativos contra radiação térmica?",
    answer: "A tecnologia AeroCore utiliza matrizes moleculares de nano-cerâmica de alta densidade e sputtering iônico para refletir e absorver comprimentos de onda infravermelhos (IR) e ultravioleta (UV), reduzindo drasticamente a carga térmica antes que ela atravesse o vidro.",
  },
  {
    id: "faq-2",
    question: "A clareza óptica é comprometida?",
    answer: "Absolutamente não. As películas AeroCore são formuladas sem pigmentação instável e com tecnologia não-reflexiva interna, garantindo transmissão de luz nítida, zero distorção visual e sem interferência em sinais de GPS, 5G ou tags eletrônicas.",
  },
  {
    id: "faq-3",
    question: "Qual é a durabilidade esperada para este investimento?",
    answer: "Desenvolvida com materiais nobres e carbono estrutural estéril, as linhas AeroCore possuem estabilidade fotométrica que não desbota, não descasca e mantém a retenção de calor inalterada por até 10 anos sob garantia homologada de fábrica.",
  },
];

export const LandingAeroCore: React.FC<LandingAeroCoreProps> = ({
onBack,
  onNavigateToWinf,
  onNavigateToNeoskin,
  onNavigateToCeramic,
  onNavigateToCatalog,
  onNavigateToGhost,
  onNavigateToPhantom,
  onNavigateToSpectre,
  onNavigateToWraith,
  onOpenMenu,
}) => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("Orçamento AeroCore™ Window Film");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInterest, setFormInterest] = useState("WINDOWFILM");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // menu handled globally
        setIsContactModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenContact = (subject?: string) => {
    if (subject) setContactSubject(subject);
    setIsContactModalOpen(true);
  };

  const handleDirectWhatsApp = (customMsg?: string) => {
    const msg = customMsg || `Olá! Gostaria de mais informações sobre as soluções AeroCore™.\nNome: ${formName || 'Cliente'}\nInteresse: ${formInterest}`;
    window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleInlineContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const text = `*PROTOCOLO DE CONTATO // CANAL SEGURO AEROCORE™*\n\n` +
      `*Identificação:* ${formName}\n` +
      `*E-mail / Contato:* ${formEmail || 'N/A'}\n` +
      `*Escopo / Interesse:* ${formInterest}`;
    
    setTimeout(() => {
      window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(text)}`, "_blank");
    }, 500);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Staggered reveal animations
  const fadeInUp = {
    initial: { opacity: 0, y: 35, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <div className="relative bg-black text-white font-sans selection:bg-[#3B82F6]/40 selection:text-white overflow-x-hidden min-h-screen">
      
      {/* 01 — HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden">
        {/* Background Video / Hero White Porsche */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/aerocore-hero.png"
            src="/videos/1.mp4"
            className="w-full h-full object-cover object-center brightness-90 contrast-110 scale-105"
          />
          {/* Subtle Vignettes & Tactical Tech Grid Lines */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70" />
          
          {/* Tactical Crosshairs & Ambient telemetry */}
          <div className="absolute top-24 left-8 text-[9px] font-mono tracking-widest text-zinc-500 uppercase hidden md:block">
            CORE_LATENCY_0.003ms // GRID_STABILITY_100%
          </div>
          <div className="absolute bottom-24 right-8 text-[9px] font-mono tracking-widest text-zinc-500 uppercase hidden md:block">
            NEURAL_DEFENSE_ACTIVE // SPECTRAL_LOCK
          </div>
        </div>

        {/* Top Header */}
        <header className="w-full flex items-center justify-between z-30 relative">
          <div
            onClick={onBack}
            className={`flex items-center ${onBack ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          >
            <img 
              src="/winf-logo.svg" 
              alt="WINF™" 
              className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Two-Bar Menu Toggle */}
          <button
            onClick={() => onOpenMenu?.()}
            className="group flex flex-col items-end justify-center gap-2 p-2.5 focus:outline-none cursor-pointer z-50 relative hover:opacity-80 transition-opacity"
            aria-label="Abrir Menu"
          >
            <span
              className={`block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-7 group-hover:w-8`}
            />
            <span
              className={`block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-5 group-hover:w-8`}
            />
          </button>
        </header>

        {/* Center Hero Title */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto px-4 z-20 text-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase leading-none font-sans flex items-baseline justify-center drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] whitespace-nowrap">
              <span>A E R O C O R E</span>
              <span className="text-xs sm:text-base md:text-xl font-light text-zinc-300 ml-2 sm:ml-4 -translate-y-4 sm:-translate-y-8">
                TM
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-zinc-300 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed"
            >
              REDEFINING ABSOLUTE THERMAL PROTECTION
            </motion.p>
          </motion.div>
        </div>

        {/* Full-Width 100% Infinite Marquee Strip (Positioned 24px higher) */}
        <div className="w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] md:w-[calc(100%+7rem)] -mx-6 sm:-mx-10 md:-mx-14 py-4 sm:py-5 md:py-6 bg-black/15 backdrop-blur-xl border-y border-white/[0.08] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-20 -translate-y-6 mb-4 sm:mb-6">
          <div className="animate-infinite-ticker flex items-center whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.45em] text-zinc-200 uppercase shrink-0">
                <span>NEXT GENERATION OPTICS</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>AEROCORE TECHNOLOGIES</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>BEYOND WHAT YOU SEE</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>THERMAL INTELLIGENCE 99% UV</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Hero CTA */}
        <div className="w-full z-20 flex flex-col items-center gap-6">
          <div className="flex items-center justify-center pt-1">
            <button
              onClick={() => {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo("#arsenal", { duration: 1.4 });
                } else {
                  document.getElementById("arsenal")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-8 sm:px-12 py-3.5 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl"
            >
              ANALISAR ARSENAL
            </button>
          </div>
        </div>
      </section>

      {/* 02 — ENGENHARIA TÉRMICA */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div
              {...fadeInUp}
              className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-[#3B82F6] mb-6 font-semibold"
            >
              ENGENHARIA TÉRMICA
            </motion.div>

            {/* Headline */}
            <motion.h2
              {...fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight uppercase mb-6 max-w-4xl text-center"
            >
              <span>PROTEÇÃO ABSOLUTA CONTRA </span>
              <span className="text-[#3B82F6] font-bold">RADIAÇÃO TÉRMICA.</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-base sm:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl text-center"
            >
              A tecnologia AeroCore utiliza nanopartículas cerâmicas avançadas para bloquear comprimentos de onda infravermelhos sem sacrificar a clareza.
            </motion.p>
          </div>

          {/* 4 Columns with Vertical Divider Lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/15">
            {/* 01 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:px-8 first:pl-0"
            >
              <div className="flex items-center gap-2 text-[#3B82F6] mb-4">
                <Sun className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#3B82F6] uppercase tracking-wide mb-3">
                BLOQUEIO UV 99%
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                PROTEÇÃO TOTAL CONTRA DESBOTAMENTO E DANOS À PELE.
              </p>
            </motion.div>

            {/* 02 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:px-8"
            >
              <div className="flex items-center gap-2 text-[#3B82F6] mb-4">
                <Zap className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#3B82F6] uppercase tracking-wide mb-3">
                INFRAVERMELHO REJEITADO
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                CONFORTO TÉRMICO INIGUALÁVEL EM QUALQUER ALTITUDE.
              </p>
            </motion.div>

            {/* 03 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:px-8"
            >
              <div className="flex items-center gap-2 text-[#3B82F6] mb-4">
                <Eye className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#3B82F6] uppercase tracking-wide mb-3">
                CLAREZA ÓPTICA
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                VISIBILIDADE IMPECÁVEL PARA SEGURANÇA TOTAL.
              </p>
            </motion.div>

            {/* 04 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:px-8 last:pr-0"
            >
              <div className="flex items-center gap-2 text-[#3B82F6] mb-4">
                <Droplets className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#3B82F6] uppercase tracking-wide mb-3">
                HIDROFOBICIDADE
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                EFEITO LÓTUS QUE REPELE ÁGUA E CONTAMINANTES.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 03 — ARSENAL.AEROCORE() // SOLUÇÕES DE PELÍCULAS */}
      <section id="arsenal" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-7xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div
              {...fadeInUp}
              className="text-xs font-mono uppercase tracking-[0.35em] text-[#3B82F6] mb-4 font-semibold text-center"
            >
              ARSENAL.AEROCORE()
            </motion.div>
            <motion.h2
              {...fadeInUp}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none text-center"
            >
              <span className="text-[#3B82F6]">SOLUÇÕES DE </span>
              <span className="text-white">PELÍCULAS.</span>
            </motion.h2>
          </div>

          {/* 4 Tactical Cards matching NeoSkin structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 01 GHOST */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-[#2563EB] border border-white/15 hover:border-[#2563EB] backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">
                    HP SERIES
                  </span>
                  <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">
                  GHOST
                </h3>
                <span className="text-xs font-mono text-[#60A5FA] group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">
                  PERFORMANCE ESSENCIAL
                </span>
                <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">
                  PELÍCULA ESSENCIAL DE ENTRADA SUPERIOR AO MERCADO. PROTEÇÃO SOLAR EQUILIBRADA COM CLAREZA ÓPTICA IMPECÁVEL, SEM O USO DE PIGMENTAÇÃO.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-zinc-400 group-hover:text-black/90 uppercase tracking-wider font-bold transition-colors">
                  <span>IR 58%</span>
                  <span>UV 99%</span>
                  <span>3 ANOS</span>
                </div>
                <button
                  onClick={() => onNavigateToGhost?.()}
                  className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-black bg-transparent text-white group-hover:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ANALISAR</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* 02 PHANTOM */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-[#2563EB] border border-white/15 hover:border-[#2563EB] backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">
                    TTA SERIES
                  </span>
                  <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">
                  PHANTOM
                </h3>
                <span className="text-xs font-mono text-[#60A5FA] group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">
                  CARBONO ESTRUTURAL
                </span>
                <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">
                  FUSÃO DE CARBONO ESTRUTURAL PARA REJEIÇÃO TÉRMICA AVANÇADA E ESTÉTICA MATTE PROFUNDA COM ALTA PRIVACIDADE.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-zinc-400 group-hover:text-black/90 uppercase tracking-wider font-bold transition-colors">
                  <span>IR 73%</span>
                  <span>UV 99%</span>
                  <span>10 ANOS</span>
                </div>
                <button
                  onClick={() => onNavigateToPhantom?.()}
                  className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-black bg-transparent text-white group-hover:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ANALISAR</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* 03 SPECTRE */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-[#2563EB] border border-white/15 hover:border-[#2563EB] backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">
                    HT SERIES
                  </span>
                  <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">
                  SPECTRE
                </h3>
                <span className="text-xs font-mono text-[#60A5FA] group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">
                  NANO-CERÂMICA
                </span>
                <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">
                  O ÁPICE DA TECNOLOGIA NANO-CERÂMICA. BLOQUEIO INFRAVERMELHO DE 95% PARA O MÁXIMO CONFORTO TÉRMICO E NITIDEZ VISUAL.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-zinc-400 group-hover:text-black/90 uppercase tracking-wider font-bold transition-colors">
                  <span>IR 95%</span>
                  <span>UV 99%</span>
                  <span>10 ANOS</span>
                </div>
                <button
                  onClick={() => onNavigateToSpectre?.()}
                  className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-black bg-transparent text-white group-hover:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ANALISAR</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* 04 WRAITH */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-[#2563EB] border border-white/15 hover:border-[#2563EB] backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">
                    TOP SERIES
                  </span>
                  <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">
                  WRAITH
                </h3>
                <span className="text-xs font-mono text-[#60A5FA] group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">
                  SPUTTERING IÔNICO
                </span>
                <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">
                  BLINDAGEM TÉRMICA INVISÍVEL DE 70% VLT. MÁXIMA PROTEÇÃO E CONFORTO SEM ALTERAR A TRANSPARÊNCIA ORIGINAL DO VIDRO.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-zinc-400 group-hover:text-black/90 uppercase tracking-wider font-bold transition-colors">
                  <span>IR 98%</span>
                  <span>UV 99%</span>
                  <span>10 ANOS</span>
                </div>
                <button
                  onClick={() => onNavigateToWraith?.()}
                  className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-black bg-transparent text-white group-hover:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ANALISAR</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 04 — DATASHEET.WINDOWFILM() // ESPECIFICAÇÕES TÉCNICAS DETALHADAS */}
      <section id="datasheet" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Header & Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <motion.div
                {...fadeInUp}
                className="text-xs font-mono uppercase tracking-[0.35em] text-[#3B82F6] mb-4 font-semibold"
              >
                DATASHEET.WINDOWFILM()
              </motion.div>
              <motion.h2
                {...fadeInUp}
                className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase leading-[0.9]"
              >
                <span className="text-white block">ESPECIFICAÇÕES</span>
                <span className="text-zinc-400 block">TÉCNICAS</span>
                <span className="text-zinc-500 block">DETALHADAS</span>
              </motion.h2>
            </div>

            {/* Filter Tabs Box */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="p-2 border border-white/15 rounded-none bg-black/60 flex flex-wrap gap-1.5 self-start lg:self-end backdrop-blur-md"
            >
              {[
                { id: "all", label: "MATRIZ COMPLETA" },
                { id: "ghost", label: "GHOST" },
                { id: "phantom", label: "PHANTOM" },
                { id: "spectre", label: "SPECTRE" },
                { id: "wraith", label: "WRAITH 70" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-none text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-black font-bold shadow-lg"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Technical Specifications Table */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="rounded-none border border-white/15 bg-black/70 backdrop-blur-md overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 bg-zinc-950/80">
                    <th className="py-5 px-6 font-semibold">PARÂMETRO</th>
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'ghost' ? 'text-[#3B82F6] bg-white/5' : ''}`}>
                      ▪ HP-SERIES GHOST
                    </th>
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'phantom' ? 'text-[#3B82F6] bg-white/5' : ''}`}>
                      ▪ TTA-SERIES PHANTOM
                    </th>
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'spectre' ? 'text-[#3B82F6] bg-white/5' : ''}`}>
                      ▪ HT-SERIES SPECTRE
                    </th>
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'wraith' ? 'text-[#3B82F6] bg-white/5' : ''}`}>
                      ▪ TOP-SERIES WRAITH 70
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm font-mono">
                  {AERO_SPEC_ROWS.map((row) => {
                    const IconComponent = row.icon;
                    return (
                      <tr key={row.parameter} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-5 px-6 font-medium text-zinc-300 flex items-center gap-3">
                          <IconComponent className="w-4 h-4 text-[#3B82F6]" />
                          <span>{row.parameter}</span>
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'ghost' ? 'text-[#3B82F6] font-bold bg-white/[0.04]' : ''}`}>
                          {row.ghost}
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'phantom' ? 'text-[#3B82F6] font-bold bg-white/[0.04]' : ''}`}>
                          {row.phantom}
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'spectre' ? 'text-[#3B82F6] font-bold bg-white/[0.04]' : ''}`}>
                          {row.spectre}
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'wraith' ? 'text-[#3B82F6] font-bold bg-white/[0.04]' : ''}`}>
                          {row.wraith}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                <span>* TODOS OS TESTES HOMOLOGADOS EM CONFORMIDADE COM AS DIRETIVAS ASTM & ISO.</span>
              </div>
              <div>ID: AERO-SPEC-REV2026</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 05 — DÚVIDAS TÁTICAS (FAQ) */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-light tracking-[0.3em] uppercase text-zinc-200">
              D Ú V I D A S   T Á T I C A S
            </h2>
          </motion.div>

          {/* Accordion List */}
          <div className="space-y-4">
            {AERO_FAQ_ITEMS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  {...fadeInUp}
                  className="border-b border-white/15 pb-4"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-4 flex items-center justify-between text-left text-sm sm:text-base font-light text-zinc-200 hover:text-white transition-colors cursor-pointer group"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#3B82F6]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm font-light text-zinc-400 leading-relaxed pt-2 pb-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06 — CINEMATIC CAR SCENE BANNER */}
      <section className="relative h-[60vh] sm:h-[75vh] w-full overflow-hidden border-t border-white/10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/aerocore-hero.png"
          src="/videos/1.mp4"
          className="w-full h-full object-cover object-center brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
      </section>

      {/* 07 — PROTOCOLO DE CONTATO // CANAL SEGURO */}
      <section id="contato" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.35em] text-[#3B82F6] block mb-3 font-semibold">
              PROTOCOLO DE CONTATO // CANAL SEGURO
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase text-white">
              FALE CONOSCO.
            </h2>
          </motion.div>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-none bg-zinc-950 border border-[#3B82F6]/40 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-[#3B82F6] mx-auto mb-4" />
              <h3 className="text-2xl font-light text-white mb-2">Protocolo Transmitido</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto mb-6">
                Um especialista técnico da divisão AeroCore entrará em contato via WhatsApp de forma segura e imediata.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-mono uppercase tracking-widest text-[#3B82F6] hover:underline"
              >
                Enviar nova mensagem
              </button>
            </motion.div>
          ) : (
            <motion.form
              {...fadeInUp}
              onSubmit={handleInlineContactSubmit}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                    IDENTIFICAÇÃO
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="NOME COMPLETO"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-[#3B82F6] outline-none transition-colors rounded-none"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                    SINAL PROFISSIONAL
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="E-MAIL OU WHATSAPP"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-[#3B82F6] outline-none transition-colors rounded-none"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                  ESCOPO DO PROJETO
                </span>
                <select
                  value={formInterest}
                  onChange={(e) => setFormInterest(e.target.value)}
                  className="w-full pb-3 bg-black border-b border-white/20 text-white text-xs font-mono uppercase tracking-wider focus:border-[#3B82F6] outline-none cursor-pointer rounded-none"
                >
                  <option value="WINDOWFILM">WINDOWFILM</option>
                  <option value="PPF">PPF</option>
                  <option value="SER UM AUTORIZADO">SER UM AUTORIZADO</option>
                  <option value="INVESTIR NO UNIVERSO DARK">INVESTIR NO UNIVERSO DARK</option>
                </select>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-12 py-4 rounded-none border border-white/30 bg-black hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>ENVIAR</span>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectWhatsApp()}
                  className="w-full sm:w-auto px-12 py-4 rounded-none border border-[#3B82F6] bg-[#1E3A8A]/30 hover:bg-[#2563EB] text-[#60A5FA] hover:text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>WHATSAPP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

{/* Interactive Contact / Quote Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-none p-6 sm:p-10 shadow-2xl relative"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3B82F6] block mb-2">
                AEROCORE™ // CONSULTORIA TÁTICA
              </span>
              <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-6">
                {contactSubject}
              </h3>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-[#3B82F6] mx-auto mb-4" />
                  <h4 className="text-lg text-white font-medium mb-2">Solicitação Preparada</h4>
                  <p className="text-xs text-zinc-400">Você será redirecionado para o WhatsApp de atendimento oficial.</p>
                </div>
              ) : (
                <form onSubmit={handleInlineContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-[#3B82F6] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">E-mail ou Telefone *</label>
                    <input
                      type="text"
                      required
                      placeholder="seu@email.com / WhatsApp"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-[#3B82F6] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">Interesse *</label>
                    <select
                      value={formInterest}
                      onChange={(e) => setFormInterest(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-xs text-white focus:border-[#3B82F6] outline-none"
                    >
                      <option value="WINDOWFILM">WINDOWFILM</option>
                      <option value="PPF">PPF</option>
                      <option value="SER UM AUTORIZADO">SER UM AUTORIZADO</option>
                      <option value="INVESTIR NO UNIVERSO DARK">INVESTIR NO UNIVERSO DARK</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 rounded-none bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>ENVIAR SOLICITAÇÃO</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <WinfFooter brandName="AEROCORE" />

</div>
  );
};

export default LandingAeroCore;
