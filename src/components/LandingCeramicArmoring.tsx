import React, { useState, useEffect } from "react";
import WinfFooter from './WinfFooter';
import { motion, AnimatePresence } from "framer-motion";
import KoenigseggMenu from "./KoenigseggMenu";
import {
  Shield,
  Zap,
  Droplets,
  Sparkles,
  Thermometer,
  AlertTriangle,
  ArrowRight,
  X,
  Send,
  ChevronDown,
  CheckCircle2,
  Box,
  Layers,
  Crosshair,
  ShieldCheck,
  Sun,
  Eye,
  Activity,
  Check
} from "lucide-react";

interface LandingCeramicArmoringProps {
  onBack?: () => void;
  onNavigateToWinf?: () => void;
  onNavigateToAerocore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCatalog?: () => void;
  onOpenMenu?: () => void;
}

const PERFORMANCE_CARDS = [
  {
    id: "perf-1",
    icon: Shield,
    title: "DUREZA 9H SUPERIOR",
    desc: "Estrutura vitrificada de altíssima densidade contra riscos e abrasão.",
  },
  {
    id: "perf-2",
    icon: Droplets,
    title: "HIDROFOBIA TÁTICA",
    desc: "Ângulo de contato extremo que oblitera água, lama e contaminantes.",
  },
  {
    id: "perf-3",
    icon: Sun,
    title: "BLINDAGEM UV",
    desc: "Bloqueio permanente contra oxidação e degradação por radiação solar.",
  },
  {
    id: "perf-4",
    icon: Layers,
    title: "RESISTÊNCIA QUÍMICA",
    desc: "Imunidade contra ácidos, solventes e detritos químicos corrosivos.",
  },
  {
    id: "perf-5",
    icon: Sparkles,
    title: "BRILHO ESTRUTURAL",
    desc: "Profundidade de cor e espelhamento (wet look) de alto nível.",
  },
  {
    id: "perf-6",
    icon: Zap,
    title: "AUTO-LIMPEZA",
    desc: "Superfície energeticamente carregada que repele poeira e sujidade.",
  },
];

const ARSENAL_CARDS = [
  {
    id: "ght-liq",
    tag: "GHT-LIQ",
    title: "GHOST LIQUID",
    subtitle: "NANO-COAT",
    desc: "BARREIRA NANO-INVISÍVEL CONTRA OS DANOS CRÔNICOS DO SAL MARINHO. O CASCO DESLIZA PERFEITAMENTE SOB AS ÁGUAS.",
  },
  {
    id: "tit-pls",
    tag: "TIT-PLS",
    title: "TITANIUM PULSE",
    subtitle: "9H DUREZA",
    desc: "BLINDAGEM DE BASE SUPER RÍGIDA. A FUNDAÇÃO DE DUREZA PARA QUALQUER SUPERFÍCIE.",
  },
  {
    id: "mir-vel",
    tag: "MIR-VEL",
    title: "MIRROR VELOCITY",
    subtitle: "ALTO BRILHO",
    desc: "ACABAMENTO DE ALTO BRILHO PARA MÁXIMA REPELÊNCIA E PROFUNDIDADE VISUAL.",
  },
];

const CERAMIC_FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "O que é a Blindagem Molecular?",
    answer: "É uma matriz líquida de dióxido de silício (SiO2) e partículas de titânio que se ancora quimicamente aos microporos do verniz original, criando uma camada vítrea permanente, ultra-hidrofóbica e de alta densidade.",
  },
  {
    id: "faq-2",
    question: "Qual a durabilidade?",
    answer: "Nossos tratamentos possuem durabilidade certificada de 3 a 5 anos, resistindo a centenas de lavagens, variações térmicas extremas (-30°C a +120°C) e agentes químicos agressivos sem perder a repelência e o brilho espelhado.",
  },
  {
    id: "faq-3",
    question: "Como funciona a proteção?",
    answer: "A camada vitrificada cria uma barreira impermeável de dureza 9H com tensão superficial ultra-baixa, impedindo que sujeiras, seiva de árvores, fezes de aves, poluição e água adiram à superfície do verniz.",
  },
  {
    id: "faq-4",
    question: "Preciso de cuidados extras?",
    answer: "A manutenção torna-se muito mais simples e rápida devido à propriedade de auto-limpeza (efeito lótus). Recomenda-se lavagens periódicas com shampoo automotivo de pH neutro e secagem com microfibra macia.",
  },
];

export const LandingCeramicArmoring: React.FC<LandingCeramicArmoringProps> = ({
onBack,
  onNavigateToWinf,
  onNavigateToAerocore,
  onNavigateToNeoskin,
  onNavigateToCatalog,
  onOpenMenu,
}) => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("Orçamento Ceramic Armoring™ 9H");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInterest, setFormInterest] = useState("CERAMIC ARMORING // 9H TITANIUM");
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
    const msg = customMsg || `Olá! Gostaria de mais informações sobre Ceramic Armoring™.\nNome: ${formName || 'Cliente'}\nInteresse: ${formInterest}`;
    window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleInlineContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const text = `*PROTOCOLO DE CONTATO // CANAL SEGURO CERAMIC ARMORING™*\n\n` +
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
    <div className="relative bg-black text-white font-sans selection:bg-white/20 selection:text-white overflow-x-hidden min-h-screen">
      
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
            poster="/images/ceramic-hero.png"
            src="/videos/1.mp4"
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
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase leading-none font-sans flex flex-col items-center justify-center drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]">
              <span>C E R A M I C</span>
              <span className="mt-2 sm:mt-4">A R M O R I N G</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-zinc-300 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed"
            >
              A BLINDAGEM MOLECULAR ABSOLUTA.
            </motion.p>
          </motion.div>
        </div>

        {/* Full-Width 100% Infinite Marquee Strip (Positioned 24px higher) */}
        <div className="w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] md:w-[calc(100%+7rem)] -mx-6 sm:-mx-10 md:-mx-14 py-4 sm:py-5 md:py-6 bg-black/15 backdrop-blur-xl border-y border-white/[0.08] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-20 -translate-y-6 mb-4 sm:mb-6">
          <div className="animate-infinite-ticker flex items-center whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.45em] text-zinc-200 uppercase shrink-0">
                <span>CERAMIC ARMORING™</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>BLINDAGEM MOLECULAR ABSOLUTA</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>DUREZA 9H SUPERIOR</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>REPELÊNCIA HIDROFÓBICA</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>BRILHO ESTRUTURAL PERMANENTE</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
                <span>AUTO-LIMPEZA TÁTICA</span>
                <span className="mx-6 sm:mx-8 text-[#3B82F6] text-xs">●</span>
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
                  (window as any).lenis.scrollTo("#performance", { duration: 1.4 });
                } else {
                  document.getElementById("performance")?.scrollIntoView({ behavior: "smooth" });
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

      {/* 02 — PERFORMANCE TÁTICA */}
      <section id="performance" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Centered Section Title */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.h2
              {...fadeInUp}
              className="text-2xl sm:text-4xl font-light tracking-[0.3em] uppercase text-zinc-200"
            >
              P E R F O R M A N C E   T Á T I C A
            </motion.h2>
          </div>

          {/* 6 Dark Glass Cards (3 cols x 2 rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERFORMANCE_CARDS.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.id}
                  {...fadeInUp}
                  transition={{ duration: 0.8, delay: idx * 0.08 }}
                  className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-white/40 transition-all flex flex-col justify-between shadow-xl group cursor-default"
                >
                  <div>
                    <IconComp className="w-7 h-7 text-white mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider mb-3">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03 — ARSENAL TÁTICO */}
      <section id="arsenal" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#070809]">
        <div className="max-w-6xl mx-auto">
          {/* Centered Section Title */}
          <div className="text-center flex flex-col items-center mb-16">
            <motion.h2
              {...fadeInUp}
              className="text-2xl sm:text-4xl font-light tracking-[0.3em] uppercase text-zinc-200"
            >
              A R S E N A L   T Á T I C O
            </motion.h2>
          </div>

          {/* 3 Tactical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARSENAL_CARDS.map((card, idx) => (
              <motion.div
                key={card.id}
                {...fadeInUp}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-zinc-900 border border-white/15 hover:border-white/40 backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                      {card.tag}
                    </span>
                    <span className="w-6 h-[1.5px] bg-white/30 group-hover:bg-white transition-colors" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
                    {card.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-6 font-bold">
                    {card.subtitle}
                  </span>
                  <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 leading-relaxed mb-8">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 group-hover:border-white/30 transition-colors">
                  <button
                    onClick={() => handleOpenContact(`Orçamento ${card.title} Ceramic Armoring`)}
                    className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-white bg-transparent text-white text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ANALISAR</span>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — DÚVIDAS TÁTICAS (FAQ) */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-light tracking-[0.3em] uppercase text-zinc-200">
              D Ú V I D A S   T Á T I C A S
            </h2>
          </motion.div>

          {/* Accordion List */}
          <div className="space-y-4">
            {CERAMIC_FAQ_ITEMS.map((faq) => {
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
                        isOpen ? "rotate-180 text-white" : ""
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

      {/* 05 — PROTOCOLO DE CONTATO // CANAL SEGURO */}
      <section id="contato" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#070809]">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.35em] text-zinc-400 block mb-3 font-semibold">
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
              className="p-10 rounded-none bg-zinc-950 border border-white/20 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-light text-white mb-2">Protocolo Transmitido</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto mb-6">
                Um especialista técnico da divisão Ceramic Armoring entrará em contato via WhatsApp de forma segura e imediata.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-mono uppercase tracking-widest text-white hover:underline"
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
                    className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-white outline-none transition-colors rounded-none"
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
                    className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-white outline-none transition-colors rounded-none"
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
                  className="w-full pb-3 bg-black border-b border-white/20 text-white text-xs font-mono uppercase tracking-wider focus:border-white outline-none cursor-pointer rounded-none"
                >
                  <option value="CERAMIC ARMORING // 9H TITANIUM">CERAMIC ARMORING // 9H TITANIUM</option>
                  <option value="GHOST LIQUID // NANO-COAT MARINHO">GHOST LIQUID // NANO-COAT MARINHO</option>
                  <option value="TITANIUM PULSE // 9H DUREZA">TITANIUM PULSE // 9H DUREZA</option>
                  <option value="MIRROR VELOCITY // ALTO BRILHO">MIRROR VELOCITY // ALTO BRILHO</option>
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
                  className="w-full sm:w-auto px-12 py-4 rounded-none border border-white/40 bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>WHATSAPP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* 06 — FOOTER // AEROCORE ASSET ECOSYSTEM */}
      <WinfFooter brandName="AEROCORE" />
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

              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                CERAMIC ARMORING™ // CONSULTORIA TÁTICA
              </span>
              <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-6">
                {contactSubject}
              </h3>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" />
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
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none"
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
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">Interesse *</label>
                    <select
                      value={formInterest}
                      onChange={(e) => setFormInterest(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-xs text-white focus:border-white outline-none"
                    >
                      <option value="CERAMIC ARMORING // 9H TITANIUM">CERAMIC ARMORING // 9H TITANIUM</option>
                      <option value="GHOST LIQUID // NANO-COAT MARINHO">GHOST LIQUID // NANO-COAT MARINHO</option>
                      <option value="TITANIUM PULSE // 9H DUREZA">TITANIUM PULSE // 9H DUREZA</option>
                      <option value="MIRROR VELOCITY // ALTO BRILHO">MIRROR VELOCITY // ALTO BRILHO</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
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
</div>
  );
};

export default LandingCeramicArmoring;
