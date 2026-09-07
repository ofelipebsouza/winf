import { PAGE_META, faqJsonLd } from '../data/siteMeta';
import LazyVideo from './LazyVideo';
import { usePageMeta } from '../hooks/usePageMeta';
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
  Activity,
  Check,
  Plus,
  Minus
} from "lucide-react";

interface LandingNeoskinProps {
  onBack?: () => void;
  onNavigateToWinf?: () => void;
  onNavigateToAerocore?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToCatalog?: () => void;
  onNavigateToBunker?: () => void;
  onNavigateToApocalypse?: () => void;
  onOpenMenu?: () => void;
}

interface SpecRow {
  parameter: string;
  icon: any;
  bkr150: string;
  apx190: string;
  ghtLiq: string;
}

const SPEC_ROWS: SpecRow[] = [
  {
    parameter: "Categoria de Defesa",
    icon: Shield,
    bkr150: "TPU Elastomérico Premium",
    apx190: "TPU Blindado Militar",
    ghtLiq: "Nano-Cerâmico Vitrificador",
  },
  {
    parameter: "Espessura Nominal",
    icon: Layers,
    bkr150: "150 Microns (6.0 mil)",
    apx190: "190 Microns (7.5 mil)",
    ghtLiq: "Camada Nano (10-15 nm)",
  },
  {
    parameter: "Tecnologia Primária",
    icon: Zap,
    bkr150: "Auto-Cura Estrutural Térmica",
    apx190: "Auto-Cura Instantânea por Calor",
    ghtLiq: "Cristalização Sílica 9H",
  },
  {
    parameter: "Alongamento Máximo",
    icon: Crosshair,
    bkr150: "400%",
    apx190: "450%",
    ghtLiq: "N/A (Ligação Molecular)",
  },
  {
    parameter: "Resistência Química",
    icon: Droplets,
    bkr150: "Alta (Ácidos Leves, Sal)",
    apx190: "Absoluta (Solventes, Combustíveis)",
    ghtLiq: "Ultra-Hidrofóbica (Anti-Corrosiva)",
  },
  {
    parameter: "Estabilidade UV",
    icon: Sun,
    bkr150: "99% de Bloqueio Ativo",
    apx190: "99.9% Barreira Espectral",
    ghtLiq: "Estabilizador Térmico Ativo",
  },
  {
    parameter: "Garantia Homologada",
    icon: Check,
    bkr150: "8 Anos",
    apx190: "Vitalícia (Lifetime)",
    ghtLiq: "3 Anos",
  },
];

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Como funciona a tecnologia de auto-cura?",
    answer: "Sob incidência solar, água morna ou calor moderado, a malha elastomérica de TPU cicatriza micro-riscos, marcas de lavagem e arranhões superficiais instantaneamente, restaurando o brilho espelhado original sem necessidade de polimento.",
  },
  {
    id: "faq-2",
    question: "A blindagem NeoSkin é resistente a impactos de alta energia?",
    answer: "Sim. As variantes Bunker 150 e Apocalypse 190 possuem densidade molecular calibrada para absorver e dissipar a energia cinética de cascalhos, pedras de estrada e abrasão severa em alta velocidade, mantendo a pintura original 100% preservada.",
  },
  {
    id: "faq-3",
    question: "Este revestimento altera a aparência original do ativo?",
    answer: "Não. A formulação ótica da NeoSkin possui índice de refração idêntico ao verniz automotivo de fábrica, proporcionando transparência cristalina pura com profundidade de brilho, ou acabamento Satin/Matte stealth sob encomenda.",
  },
];

export const LandingNeoskin: React.FC<LandingNeoskinProps> = ({
onBack,
  onNavigateToWinf,
  onNavigateToAerocore,
  onNavigateToCeramic,
  onNavigateToCatalog,
  onNavigateToBunker,
  onNavigateToApocalypse,
  onOpenMenu,
}) => {
  usePageMeta({ ...PAGE_META.neoskin, jsonLd: [...(PAGE_META.neoskin.jsonLd ?? []), faqJsonLd(FAQ_ITEMS)] });

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("Orçamento Tático NeoSkin™ PPF");
  const [activeTab, setActiveTab] = useState<string>("bunker");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formVehicle, setFormVehicle] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formInterest, setFormInterest] = useState("BUNKER 150 // PPF ELITE");
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
    const msg = customMsg || `Olá! Gostaria de solicitar um orçamento para aplicação de NeoSkin™ PPF.`;
    window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleInlineContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const text = `*PROTOCOLO DE CONTATO // CANAL SEGURO NEOSKIN™*\n\n` +
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
    <div className="relative bg-black text-white font-sans selection:bg-[#5C743D]/40 selection:text-white overflow-x-hidden min-h-screen">
      
      {/* 01 — HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden">
        {/* Background Video / Hero Porsche */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/neoskin-hero.webp"
            src="/videos/2.mp4"
            className="w-full h-full object-cover object-center brightness-90 contrast-110 scale-105"
          />
          {/* Subtle Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70" />
        </div>

        {/* Top Header */}
        <header className="w-full flex items-center justify-between z-30 relative">
          <div
            onClick={onBack}
            className={`flex items-center ${onBack ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          >
            <img 
              src="/winf-logo.svg" width={128} height={32} 
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
              <span>N E O S K I N</span>
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
              REDEFINING ABSOLUTE PROTECTION FOR A NEW GENERATION
            </motion.p>
          </motion.div>
        </div>

        {/* Full-Width 100% Infinite Marquee Strip (Positioned 24px higher) */}
        <div className="w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] md:w-[calc(100%+7rem)] -mx-6 sm:-mx-10 md:-mx-14 py-4 sm:py-5 md:py-6 bg-black/15 backdrop-blur-xl border-y border-white/[0.08] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-20 -translate-y-6 mb-4 sm:mb-6">
          <div className="animate-infinite-ticker flex items-center whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.45em] text-zinc-200 uppercase shrink-0">
                <span>BARREIRA BALÍSTICA E ESTÉTICA</span>
                <span className="mx-6 sm:mx-8 text-[#7A9856] text-xs">●</span>
                <span>NEOSKIN™ DEFENSE</span>
                <span className="mx-6 sm:mx-8 text-[#7A9856] text-xs">●</span>
                <span>MILITARY SPECIFICATIONS</span>
                <span className="mx-6 sm:mx-8 text-[#7A9856] text-xs">●</span>
                <span>AUTO-CURA IMEDIATA</span>
                <span className="mx-6 sm:mx-8 text-[#7A9856] text-xs">●</span>
                <span>190 MICRONS HYDROPHOBIC</span>
                <span className="mx-6 sm:mx-8 text-[#7A9856] text-xs">●</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Hero CTAs */}
        <div className="w-full z-20 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <button
              onClick={() => {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo("#arsenal", { duration: 1.4 });
                } else {
                  document.getElementById("arsenal")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 sm:px-8 py-3 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl"
            >
              ANALISAR ARSENAL
            </button>
            <button
              onClick={onBack}
              className="px-6 sm:px-8 py-3 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl"
            >
              VOLTAR AEROCORE
            </button>
          </div>
        </div>
      </section>

      {/* 02 — ENGENHARIA SOBREVIVENCIAL */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div
              {...fadeInUp}
              className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-[#647C4A] mb-6 font-semibold"
            >
              ENGENHARIA SOBREVIVENCIAL
            </motion.div>

            {/* Headline */}
            <motion.h2
              {...fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight uppercase mb-6 max-w-4xl text-center"
            >
              <span className="text-[#647C4A] font-medium">ENQUANTO O MUNDO DESMORONA, </span>
              <span className="text-white font-bold">A NEOSKIN PERMANECE INTACTA.</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-base sm:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl text-center"
            >
              Uma barreira de sacrifício hiper-resistente para enfrentar o impiedoso. Projetada para durar além das fronteiras do comum.
            </motion.p>
          </div>

          {/* 4 Columns with Vertical Divider Lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/15">
            {/* CRIT_01 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:px-8 first:pl-0"
            >
              <div className="flex items-center gap-2 text-[#7A9856] mb-4">
                <Box className="w-5 h-5 text-[#7A9856]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#7A9856] font-bold">CRIT_01</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#7A9856] uppercase tracking-wide mb-3">
                RESISTÊNCIA EXTREMA
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                ABRASÃO DE GALHOS, PEDRAS E DETRITOS OFF-ROAD.
              </p>
            </motion.div>

            {/* CRIT_02 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:px-8"
            >
              <div className="flex items-center gap-2 text-[#7A9856] mb-4">
                <Zap className="w-5 h-5 text-[#7A9856]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#7A9856] font-bold">CRIT_02</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#7A9856] uppercase tracking-wide mb-3">
                AUTO-CURA BRUTAL
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                ARRANHÕES SEVEROS CURAM COM CALOR INTENSO.
              </p>
            </motion.div>

            {/* CRIT_03 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:px-8"
            >
              <div className="flex items-center gap-2 text-[#7A9856] mb-4">
                <Droplets className="w-5 h-5 text-[#7A9856]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#7A9856] font-bold">CRIT_03</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#7A9856] uppercase tracking-wide mb-3">
                BARREIRA QUÍMICA
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                INTRANSPONÍVEL PARA FLUIDOS CORROSIVOS.
              </p>
            </motion.div>

            {/* CRIT_04 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:px-8 last:pr-0"
            >
              <div className="flex items-center gap-2 text-[#7A9856] mb-4">
                <Shield className="w-5 h-5 text-[#7A9856]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#7A9856] font-bold">CRIT_04</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#7A9856] uppercase tracking-wide mb-3">
                CAMUFLAGEM UV
              </h3>
              <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">
                ESTABILIZADORES REATIVOS IMPEDEM A DEGRADAÇÃO.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 02.5 — ARMAS DE DEFESA (BUNKER 150 & APOCALYPSE 190) */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 overflow-hidden">
        {/* Background Video / Jungle Porsche */}
        <div className="absolute inset-0 z-0">
          <LazyVideo poster="/images/neoskin-hero.webp" src="/videos/3.mp4" className="w-full h-full object-cover object-center brightness-50 contrast-125 scale-105" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.div
                {...fadeInUp}
                className="text-xs font-mono uppercase tracking-[0.35em] text-[#647C4A] mb-4 font-semibold"
              >
                ARSENAL.NEOSKIN()
              </motion.div>
              <motion.h2
                {...fadeInUp}
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none"
              >
                <span className="text-[#647C4A]">ARMAS DE </span>
                <span className="text-white">DEFESA.</span>
              </motion.h2>
            </div>

            <motion.div
              {...fadeInUp}
              className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 text-right md:text-right"
            >
              AUTHORIZED ACCESS ONLY<br />
              <span className="text-zinc-300">MILITECH DIVISION // SECURITY LEVEL 4</span>
            </motion.div>
          </div>

          {/* 2 Floating Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Bunker 150 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-[#546A36] border border-white/15 hover:border-[#546A36] backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">
                    BKR-150
                  </span>
                  <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">
                  BUNKER 150
                </h3>
                <span className="text-xs font-mono text-[#7A9856] group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">
                  150 MICRONS
                </span>
                <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">
                  A BARREIRA HIDROFÓBICA E TÁTICA QUE OBLITERA A OXIDAÇÃO EM CRUZADORES E LANCHAS ÁGEIS.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                <button
                  onClick={() => onNavigateToBunker?.()}
                  className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-black bg-transparent text-white group-hover:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ANALISAR</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Apocalypse 190 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-[#546A36] border border-white/15 hover:border-[#546A36] backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">
                    APX-190
                  </span>
                  <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">
                  APOCALYPSE 190
                </h3>
                <span className="text-xs font-mono text-[#7A9856] group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">
                  190 MICRONS
                </span>
                <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">
                  PROTEÇÃO FÍSICA OCEÂNICA INTRANSPONÍVEL CONTRA CORAIS AFIADOS E IMPACTOS DE ALTA ENERGIA NO CAIS.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                <button
                  onClick={() => onNavigateToApocalypse?.()}
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

      {/* 03 — ARSENAL INDUSTRIAL // PROTEÇÃO MULTIFUNCIONAL */}
      <section id="arsenal" className="cv-auto relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#070806]">
        <div className="max-w-6xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div
              {...fadeInUp}
              className="text-xs font-mono uppercase tracking-[0.35em] text-[#647C4A] mb-6 font-semibold"
            >
              ARSENAL INDUSTRIAL // NEOSKIN
            </motion.div>

            {/* Headline */}
            <motion.h2
              {...fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl font-light italic tracking-tight text-white uppercase mb-6 max-w-4xl text-center"
            >
              PROTEÇÃO MULTIFUNCIONAL DE NÍVEL TÁTICO.
            </motion.h2>

            {/* Subtext */}
            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-3xl text-center"
            >
              A mesma precisão molecular aplicada à proteção de ativos estratégicos, estruturas militares e maquinário pesado. Um investimento sólido para operações onde a falha não é uma opção.
            </motion.p>
          </div>

          {/* 4 Dark Tactical Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Card 1 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Shield className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">
                  DUREZA &gt; 9H
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Resistência extrema contra abrasão e riscos, validada em testes industriais.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Thermometer className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">
                  ESTABILIDADE TÉRMICA
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Proteção contra temperaturas de -50°C até ambientes críticos de alta caloria.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Zap className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">
                  BARREIRA QUÍMICA
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  100% resistente a solventes, ácidos e contaminantes ambientais agressivos.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <AlertTriangle className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">
                  DEFESA UV & CORROSÃO
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Previne envelhecimento prematuro, oxidação e degradação estrutural.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Two-Column Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Left: Aplicações Estratégicas */}
            <motion.div
              {...fadeInUp}
              className="p-8 sm:p-10 rounded-none bg-black/40 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-light italic text-[#7A9856] uppercase tracking-wider mb-8">
                  APLICAÇÕES ESTRATÉGICAS
                </h3>
                <ul className="space-y-4 text-xs sm:text-sm font-mono uppercase text-zinc-300">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#7A9856]" />
                    <span>FACHADAS E VIDROS INDUSTRIAIS</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#7A9856]" />
                    <span>ESTRUTURAS TÁTICAS E MILITARES</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#7A9856]" />
                    <span>AVIAÇÃO E TRANSPORTE DE CARGA</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#7A9856]" />
                    <span>EQUIPAMENTOS DE MINERAÇÃO E LOGÍSTICA</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#7A9856]" />
                    <span>SUPERFÍCIES EM MÁRMORE, VIDRO, MADEIRAS E FIBRAS</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right: Solicite um Orçamento Tático */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 sm:p-10 rounded-none bg-black/40 border border-white/10 flex flex-col justify-center text-center items-center"
            >
              <h3 className="text-xl font-bold italic text-[#7A9856] uppercase tracking-wider mb-4">
                SOLICITE UM ORÇAMENTO TÁTICO
              </h3>
              <p className="text-sm text-zinc-300 font-light mb-8 max-w-sm">
                Proteja seus ativos com a tecnologia de defesa da NeoSkin.
              </p>
              <button
                onClick={() => handleOpenContact("Orçamento Tático NeoSkin Industrial")}
                className="w-full max-w-xs py-4 rounded-none bg-[#4E6232] hover:bg-[#5C743D] text-white font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl"
              >
                ORÇAMENTO GRATUITO
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 04 — NEOSKIN // PELÍCULA DE PROTEÇÃO */}
      <section className="cv-auto relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div
              {...fadeInUp}
              className="text-xs font-mono uppercase tracking-[0.35em] text-[#647C4A] mb-6 font-semibold"
            >
              NEOSKIN // PELÍCULA DE PROTEÇÃO
            </motion.div>

            {/* Headline */}
            <motion.h2
              {...fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl font-light italic tracking-tight text-white uppercase mb-6 max-w-4xl text-center"
            >
              O AUGE DA PROTEÇÃO DE PINTURA.
            </motion.h2>

            {/* Subtext */}
            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-3xl text-center"
            >
              A escolha definitiva para quem exige o melhor. Nossa película de última geração utiliza a mesma tecnologia nano-cerâmica que nos tornou líderes, garantindo um acabamento impecável e durabilidade excepcional.
            </motion.p>
          </div>

          {/* 4 Protection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Droplets className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  EXTREMAMENTE HIDROFÓBICO
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Repele água sem esforço, mantendo acabamento limpo e brilhante com manutenção mínima.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Sparkles className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  TECNOLOGIA DE AUTOCURA INSANA
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Arranhou? Ele se auto regenera magicamente com calor! Tecnologia que mantém sua superfície sempre perfeita.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Shield className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  RESISTÊNCIA SUPERIOR
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Defesa avançada contra detritos, excrementos de pássaros e contaminantes ambientais.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-[#647C4A]/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <Zap className="w-7 h-7 text-[#7A9856] mb-6" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  INFUSÃO DE CERÂMICA
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Combina película durável com tecnologia cerâmica para brilho incomparável.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 05 — DEFESA PERSONALIZADA */}
      <section className="cv-auto relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#070806]">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 sm:p-14 rounded-none bg-black/70 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-2xl">
            {/* Left Content */}
            <motion.div {...fadeInUp} className="space-y-6">
              <h3 className="text-2xl sm:text-4xl font-light italic text-[#7A9856] uppercase tracking-wider">
                DEFESA PERSONALIZADA
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                Com uma variedade de opções, personalize a proteção exata onde seu veículo mais precisa. Instalação meticulosa feita por especialistas autorizados.
              </p>
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold pt-2">
                GARANTIA LÍDER DO SETOR PARA SUA TRANQUILIDADE.
              </div>
              <div className="pt-4">
                <button
                  onClick={() => handleOpenContact("Orçamento Personalizado NeoSkin PPF")}
                  className="px-8 py-4 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center gap-2"
                >
                  <span>SOLICITAR ORÇAMENTO</span>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </motion.div>

            {/* Right Visual Frame with Live Video */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-video sm:aspect-square lg:aspect-video rounded-none bg-zinc-950 border border-white/15 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl"
            >
              <LazyVideo poster="/images/neoskin-hero.webp" src="/videos/3.mp4" className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <ShieldCheck className="w-10 h-10 text-[#7A9856] group-hover:scale-110 transition-transform duration-500 drop-shadow" />
                <span className="text-xs sm:text-sm font-mono italic tracking-[0.3em] text-white uppercase drop-shadow font-bold">
                  // NEOSKIN_PPF_ULTRA
                </span>
                <span className="text-[10px] font-mono text-zinc-300 tracking-wider drop-shadow bg-black/60 px-3 py-1 rounded-none border border-white/10">
                  HIGH-DENSITY MOLECULAR ARMOR
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 06 — DATASHEET.NEOSKIN() // ESPECIFICAÇÕES TÉCNICAS DETALHADAS */}
      <section id="datasheet" className="cv-auto relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Header & Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <motion.div
                {...fadeInUp}
                className="text-xs font-mono uppercase tracking-[0.35em] text-[#647C4A] mb-4 font-semibold"
              >
                DATASHEET.NEOSKIN()
              </motion.div>
              <motion.h2
                {...fadeInUp}
                className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase leading-[0.9]"
              >
                <span className="text-[#647C4A] block">ESPECIFICAÇÕES</span>
                <span className="text-zinc-300 block">TÉCNICAS</span>
                <span className="text-zinc-400 block">DETALHADAS</span>
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
                { id: "bunker", label: "BUNKER 150" },
                { id: "apocalypse", label: "APOCALYPSE 190" },
                { id: "ghost", label: "GHOST LIQUID" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${
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
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'bunker' ? 'text-[#7A9856] bg-white/5' : ''}`}>
                      ▪ BKR-150 BUNKER
                    </th>
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'apocalypse' ? 'text-[#7A9856] bg-white/5' : ''}`}>
                      ▪ APX-190 APOCALYPSE
                    </th>
                    <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'ghost' ? 'text-[#7A9856] bg-white/5' : ''}`}>
                      ▪ GHT-LIQ GHOST LIQUID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm font-mono">
                  {SPEC_ROWS.map((row, idx) => {
                    const IconComponent = row.icon;
                    return (
                      <tr key={row.parameter} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-5 px-6 font-medium text-zinc-300 flex items-center gap-3">
                          <IconComponent className="w-4 h-4 text-[#7A9856]" />
                          <span>{row.parameter}</span>
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'bunker' ? 'text-[#7A9856] font-bold bg-white/[0.04]' : ''}`}>
                          {row.bkr150}
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'apocalypse' ? 'text-[#7A9856] font-bold bg-white/[0.04]' : ''}`}>
                          {row.apx190}
                        </td>
                        <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'ghost' ? 'text-[#7A9856] font-bold bg-white/[0.04]' : ''}`}>
                          {row.ghtLiq}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7A9856] animate-pulse" />
                <span>TODOS OS TESTES HOMOLOGADOS EM CONFORMIDADE COM AS DIRETIVAS MILITARES ASTM & ISO.</span>
              </div>
              <div>ID: NS-SPEC-REV2026</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 07 — DÚVIDAS TÁTICAS (FAQ) */}
      <section className="cv-auto relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#070806]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-light tracking-[0.3em] uppercase text-zinc-200">
              D Ú V I D A S   T Á T I C A S
            </h2>
          </motion.div>

          {/* Accordion List */}
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  {...fadeInUp}
                  className="border-b border-white/15 pb-4"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full py-4 flex items-center justify-between text-left text-sm sm:text-base font-light text-zinc-200 hover:text-white transition-colors cursor-pointer group"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#7A9856]" : ""
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

      {/* 08 — CINEMATIC CAR SCENE BANNER */}
      <section className="cv-auto relative h-[60vh] sm:h-[75vh] w-full overflow-hidden border-t border-white/10">
        <LazyVideo poster="/images/neoskin-hero.webp" src="/videos/2.mp4" className="w-full h-full object-cover object-center brightness-75 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
      </section>

      {/* 09 — PROTOCOLO DE CONTATO // CANAL SEGURO */}
      <section id="contato" className="cv-auto relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.35em] text-[#647C4A] block mb-3 font-semibold">
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
              className="p-10 rounded-none bg-zinc-950 border border-[#7A9856]/40 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-[#7A9856] mx-auto mb-4" />
              <h3 className="text-2xl font-light text-white mb-2">Protocolo Transmitido</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto mb-6">
                Um especialista técnico da divisão NeoSkin entrará em contato via WhatsApp de forma segura e imediata.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-mono uppercase tracking-widest text-[#7A9856] hover:underline"
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
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                    IDENTIFICAÇÃO
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="NOME COMPLETO"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-[#7A9856] outline-none transition-colors rounded-none"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                    SINAL PROFISSIONAL
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="E-MAIL OU WHATSAPP"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-[#7A9856] outline-none transition-colors rounded-none"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                  ESCOPO DO PROJETO
                </span>
                <select aria-label="Área de interesse"
                  value={formInterest}
                  onChange={(e) => setFormInterest(e.target.value)}
                  className="w-full pb-3 bg-black border-b border-white/20 text-white text-xs font-mono uppercase tracking-wider focus:border-[#7A9856] outline-none cursor-pointer rounded-none"
                >
                  <option value="BUNKER 150 // PPF ELITE">BUNKER 150 // PPF ELITE</option>
                  <option value="APOCALYPSE 190 // PPF MILITAR">APOCALYPSE 190 // PPF MILITAR</option>
                  <option value="GHOST LIQUID // NANO CERÂMICA">GHOST LIQUID // NANO CERÂMICA</option>
                  <option value="PROJETO ESPECIAL // INDUSTRIAL & TÁTICO">PROJETO ESPECIAL // INDUSTRIAL & TÁTICO</option>
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
                  className="w-full sm:w-auto px-12 py-4 rounded-none border border-[#4E6232] bg-[#4E6232]/20 hover:bg-[#4E6232] text-[#88A85C] hover:text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
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

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A9856] block mb-2">
                NEOSKIN™ // ORÇAMENTO TÁTICO
              </span>
              <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-6">
                {contactSubject}
              </h3>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-[#7A9856] mx-auto mb-4" />
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
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-[#7A9856] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">Veículo ou Ativo a ser protegido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Porsche 911 / Vidros Industriais"
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-[#7A9856] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-zinc-300 block mb-1">WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(00) 00000-0000"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-[#7A9856] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-300 block mb-1">Interesse *</label>
                      <select aria-label="Área de interesse"
                        value={formInterest}
                        onChange={(e) => setFormInterest(e.target.value)}
                        className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-xs text-white focus:border-[#7A9856] outline-none"
                      >
                        <option value="BUNKER 150 // PPF ELITE">BUNKER 150</option>
                        <option value="APOCALYPSE 190 // PPF MILITAR">APOCALYPSE 190</option>
                        <option value="GHOST LIQUID // NANO CERÂMICA">GHOST LIQUID</option>
                        <option value="PROJETO ESPECIAL">PROJETO ESPECIAL</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 rounded-none bg-[#4E6232] hover:bg-[#5C743D] text-white font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>ENVIAR SOLICITAÇÃO</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}      </AnimatePresence>

      {/* ── FOOTER ── */}
      <WinfFooter brandName="NEOSKIN" />

</div>
  );
};


export default LandingNeoskin;
