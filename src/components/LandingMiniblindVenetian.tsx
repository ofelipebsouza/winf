import { PAGE_META, faqJsonLd } from '../data/siteMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import React, { useState, useEffect } from "react";
import WinfFooter from './WinfFooter';
import { motion, AnimatePresence } from "framer-motion";
import LazyVideo from './LazyVideo';
import {
  Eye, Zap, Sun, Sparkles, Shield, Thermometer, Activity,
  ArrowRight, X, Send, ChevronDown, CheckCircle2, Check,
  Blinds, Ruler, Grid3x3, Lock
} from "lucide-react";

interface LandingMiniblindVenetianProps {
  onBack?: () => void;
  onNavigateToWinf?: () => void;
  onNavigateToInvisible?: () => void;
  onNavigateToDualReflect?: () => void;
  onNavigateToBlackPro?: () => void;
  onNavigateToAeroCore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToSecurityBlind?: () => void;
  onOpenMenu?: () => void;
}

interface SpecRow { parameter: string; icon: any; mini: string; venetian: string; }

const SPEC_ROWS: SpecRow[] = [
  { parameter: "Largura da Listra", icon: Ruler, mini: "1,0 cm", venetian: "0,5 cm" },
  { parameter: "Acabamento", icon: Sparkles, mini: "Jateada + Transparente", venetian: "Jateada + Transparente" },
  { parameter: "Orientação das Listras", icon: Grid3x3, mini: "Horizontal", venetian: "Horizontal" },
  { parameter: "Privacidade", icon: Lock, mini: "Alta (Controle Visual)", venetian: "Alta (Controle Visual)" },
  { parameter: "Controle de Luz Visível", icon: Eye, mini: "Moderado", venetian: "Moderado" },
  { parameter: "Bloqueio Ultravioleta (UV)", icon: Sun, mini: "99% Barreira UV", venetian: "99% Barreira UV" },
  { parameter: "Estética", icon: Blinds, mini: "Listras Brancas 1,0 cm", venetian: "Listras Brancas 0,5 cm" },
  { parameter: "Garantia Homologada WINF", icon: Check, mini: "10 Anos", venetian: "10 Anos" },
];

const FAQ_ITEMS = [
  { id: "faq-1", question: "Essa película escurece o ambiente?", answer: "Não. O Miniblind & Venetian™ controla a luz visível de forma moderada, criando o visual de persiana sem bloquear totalmente a iluminação natural. A combinação de listras jateadas e transparentes mantém o ambiente claro e sofisticado." },
  { id: "faq-2", question: "Preciso instalar persianas ou cortinas por baixo?", answer: "Não. O efeito de persiana já está aplicado na película. É a estética das persianas horizontais com a praticidade de uma película sobre o vidro — sem manutenção, sem cordas e sem ocupar espaço interno." },
  { id: "faq-3", question: "Qual a diferença entre Miniblind e Venetian?", answer: "A largura das listras. A linha Miniblind™ utiliza listras brancas de 1,0 cm, criando um padrão mais marcante. A linha Venetian™ utiliza listras de 0,5 cm, com um acabamento mais delicado e discreto." },
  { id: "faq-4", question: "Onde pode ser aplicada?", answer: "Em vidros de janelas, portas, divisórias, vitrines e fachadas — ambientes residenciais e comerciais que buscam privacidade com elegância." },
];

export const LandingMiniblindVenetian: React.FC<LandingMiniblindVenetianProps> = ({
onBack, onNavigateToWinf, onNavigateToInvisible, onNavigateToDualReflect, onNavigateToBlackPro,
  onNavigateToAeroCore, onNavigateToNeoskin, onNavigateToCeramic, onNavigateToSecurityBlind,
  onOpenMenu,
}) => {
  usePageMeta({ ...PAGE_META['miniblind-venetian'], jsonLd: [...(PAGE_META['miniblind-venetian'].jsonLd ?? []), faqJsonLd(FAQ_ITEMS)] });

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("Especificação WINF MINIBLIND & VENETIAN™");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInterest, setFormInterest] = useState("MINIBLIND 1.0");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setIsContactModalOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleOpenContact = (s?: string) => { if (s) setContactSubject(s); setIsContactModalOpen(true); };
  const handleDirectWhatsApp = (m?: string) => {
    window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(m || "Olá! Gostaria de mais informações sobre WINF MINIBLIND & VENETIAN™.")}`, "_blank");
  };
  const handleInlineContactSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormSubmitted(true);
    const t = `*PROTOCOLO DE CONTATO // MINIBLIND & VENETIAN™*\n\n*Identificação:* ${formName}\n*E-mail:* ${formEmail || 'N/A'}\n*Interesse:* ${formInterest}`;
    setTimeout(() => { window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(t)}`, "_blank"); }, 500);
  };
  const toggleFaq = (id: string) => { setOpenFaq(openFaq === id ? null : id); };
  const fadeInUp = { initial: { opacity: 0, y: 35, filter: "blur(6px)" }, whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: false, amount: 0.2 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <div className="relative bg-black text-white font-sans selection:bg-white/20 selection:text-white overflow-x-hidden min-h-screen">

      {/* 01 — HERO */}
      <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline preload="auto" poster="/images/miniblind-venetian/scene-01.webp" src="/videos/mbv-figures.mp4" className="w-full h-full object-cover object-center brightness-[0.65] contrast-110 saturate-[0.75] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/15 to-black/35" />
        </div>
        <header className="w-full flex items-center justify-between z-30 relative">
          <div onClick={onBack} className={`flex items-center ${onBack ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
            <img src="/winf-logo.svg" width={128} height={32} alt="WINF™" className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" />
          </div>
          <button onClick={() => onOpenMenu?.()} className="group flex flex-col items-end justify-center gap-2 p-2.5 focus:outline-none cursor-pointer z-50 relative hover:opacity-80 transition-opacity" aria-label="Abrir Menu">
            <span className={`block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-7 group-hover:w-8`} />
            <span className={`block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-5 group-hover:w-8`} />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center my-auto px-4 z-20 text-center w-full">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center">
            <img src="/images/miniblind-venetian/minibrind-venetian-logo.svg" width={160} height={48} alt="MINIBLIND & VENETIAN™" className="w-64 sm:w-80 md:w-[480px] lg:w-[560px] h-auto drop-shadow-[0_4px_40px_rgba(255,255,255,0.15)]" />
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-zinc-300 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed">
              APARÊNCIA SOFISTICADA DE PERSIANA. DIRETO NO VIDRO.
            </motion.p>
          </motion.div>
        </div>
        <div className="w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] md:w-[calc(100%+7rem)] -mx-6 sm:-mx-10 md:-mx-14 py-4 sm:py-5 md:py-6 bg-black/15 backdrop-blur-xl border-y border-white/[0.08] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-20 -translate-y-6 mb-4 sm:mb-6">
          <div className="animate-infinite-ticker flex items-center whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.45em] text-zinc-200 uppercase shrink-0">
                <span>PRIVACIDADE SOFISTICADA</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
                <span>LISTRAS HORIZONTAIS</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
                <span>99% BLOQUEIO UV</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
                <span>10 YEARS WARRANTY</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full z-20 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <button onClick={() => document.getElementById("arsenal-miniblind")?.scrollIntoView({ behavior: "smooth" })} className="px-6 sm:px-8 py-3 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl">ANALISAR ARSENAL</button>
            <button onClick={onBack} className="px-6 sm:px-8 py-3 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl">VOLTAR WINF SELECT</button>
          </div>
        </div>
      </section>

      {/* 02 — PRODUCT INFO + PROGRESS BARS */}
      <section className="relative z-10 px-6 sm:px-10 md:px-16 py-20 bg-black border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">Linha <span className="text-white">Miniblind & Venetian®</span></h2>
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-white mb-6">DECORATIVA HORIZONTAL</p>
            <p className="text-base text-zinc-300 leading-relaxed mb-10">Película decorativa com aparência sofisticada de persiana. Listras brancas jateadas e transparentes, horizontais — privacidade, controle de UV e moderação da luz visível, sem instalar persianas.</p>
          </motion.div>
          <motion.div {...fadeInUp} className="space-y-8 mb-10">
            <div>
              <div className="flex justify-between mb-3"><span className="text-sm text-zinc-300">Bloqueio <strong className="text-white">UV</strong> (Ultra Violeta)</span><span className="text-sm font-bold text-white">99%</span></div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "99%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-white rounded-full" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-3"><span className="text-sm text-zinc-300">Privacidade / <strong className="text-white">Controle Visual</strong></span><span className="text-sm font-bold text-white">80%</span></div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-white rounded-full" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-3"><span className="text-sm text-zinc-300">Transmissão de <strong className="text-white">Luz Visível</strong></span><span className="text-sm font-bold text-white">Moderada</span></div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "55%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-white rounded-full" /></div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800"><Check className="w-4 h-4 text-white" /><span className="text-sm text-zinc-300">Privacidade: <strong className="text-white">Alta</strong></span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800"><Check className="w-4 h-4 text-white" /><span className="text-sm text-zinc-300">Garantia: <strong className="text-white">10 anos</strong></span></div>
          </motion.div>
          <motion.div {...fadeInUp} className="flex flex-wrap gap-3">
            {[{ icon: Lock, label: "Privacidade" }, { icon: Sun, label: "Bloqueio UV" }, { icon: Blinds, label: "Estética de Persiana" }, { icon: Eye, label: "Luz Moderada" }, { icon: Thermometer, label: "Conforto" }, { icon: Activity, label: "Ambientes Elegantes" }].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-transparent rounded-full border border-zinc-700 hover:border-white transition-colors cursor-default"><item.icon className="w-4 h-4 text-zinc-400" /><span className="text-xs text-zinc-300">{item.label}</span></div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 03 — ENGENHARIA DE PRIVACIDADE */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-white mb-6 font-semibold">ENGENHARIA DE PRIVACIDADE</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight uppercase mb-6 max-w-4xl text-center">
              <span className="text-zinc-400 font-medium">O VISUAL DAS PERSIANAS, </span><span className="text-white font-bold">SEM INSTALAR NADA.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/15">
            {[
              { icon: Lock, crit: "CRIT_01", title: "PRIVACIDADE ALTA", desc: "CONTROLE VISUAL SOFISTICADO COM LISTRAS JATEADAS." },
              { icon: Sun, crit: "CRIT_02", title: "BLOQUEIO UV 99%", desc: "PROTEÇÃO CONTRA DESBOTAMENTO E RADIAÇÃO SOLAR." },
              { icon: Eye, crit: "CRIT_03", title: "LUZ MODERADA", desc: "LUMINOSIDADE NATURAL CONTROLADA SEM ESCURECER." },
              { icon: Blinds, crit: "CRIT_04", title: "ESTÉTICA HORIZONTAL", desc: "LISTRAS BRANCAS DE 1,0CM E 0,5CM. TRANSPARENTES E JATEADAS." },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="lg:px-8">
                <div className="flex items-center gap-2 text-white mb-4"><item.icon className="w-5 h-5 text-white" /><span className="text-xs font-mono uppercase tracking-widest text-white font-bold">{item.crit}</span></div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mb-3">{item.title}</h3>
                <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — ARSENAL.MINIBLIND() */}
      <section id="arsenal-miniblind" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyVideo poster="/images/miniblind-venetian/scene-02.webp" src="/videos/mbv-professionals.mp4" className="w-full h-full object-cover object-center brightness-[0.28] contrast-125 saturate-[0.75] scale-105" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-white mb-4 font-semibold">ARSENAL.MINIBLIND()</motion.div>
              <motion.h2 {...fadeInUp} className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none">
                <span className="text-white">SOLUÇÕES DE </span><span className="text-zinc-300">PELÍCULAS.</span>
              </motion.h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {[
              { code: "MB-1.0", name: "MINIBLIND", sub: "LISTRA 1,0 CM", desc: "PELÍCULA DECORATIVA HORIZONTAL. LISTRAS BRANCAS JATEADAS E TRANSPARENTES DE 1,0CM.", subject: "Orçamento Miniblind 1.0" },
              { code: "VB-0.5", name: "VENETIAN", sub: "LISTRA 0,5 CM", desc: "PELÍCULA DECORATIVA HORIZONTAL. LISTRAS BRANCAS JATEADAS E TRANSPARENTES DE 0,5CM.", subject: "Orçamento Venetian 0.5" },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-white border border-white/15 hover:border-white backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">{item.code}</span>
                    <span className="w-6 h-[1.5px] bg-white/40 group-hover:bg-black transition-colors" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-black uppercase tracking-tight mb-1 transition-colors">{item.name}</h3>
                  <span className="text-xs font-mono text-zinc-400 group-hover:text-black/90 uppercase tracking-widest block mb-6 font-bold transition-colors">{item.sub}</span>
                  <p className="text-xs sm:text-sm font-mono uppercase text-zinc-300 group-hover:text-black/90 leading-relaxed mb-8 transition-colors">{item.desc}</p>
                </div>
                <div className="pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors">
                  <button onClick={() => handleOpenContact(item.subject)} className="w-full py-3.5 rounded-none border border-white/30 group-hover:border-black bg-transparent text-white group-hover:text-black text-xs font-mono uppercase tracking-[0.25em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span>ANALISAR</span><ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — ARSENAL INDUSTRIAL */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-white mb-6 font-semibold">ARSENAL INDUSTRIAL // MINIBLIND & VENETIAN</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light italic tracking-tight text-white uppercase mb-6 max-w-4xl text-center">PRIVACIDADE MULTIFUNCIONAL COM ELEGÂNCIA.</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Lock, title: "PRIVACIDADE ALTA", desc: "Controle visual sofisticado com padrão de persiana horizontal." },
              { icon: Sun, title: "BLOQUEIO UV 99%", desc: "Proteção contra radiação solar e desbotamento de interiores." },
              { icon: Eye, title: "LUZ MODERADA", desc: "Luminosidade natural controlada sem escurecer o ambiente." },
              { icon: Sparkles, title: "ESTÉTICA DECORATIVA", desc: "Listras brancas jateadas e transparentes com acabamento premium." },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between shadow-xl">
                <div><item.icon className="w-7 h-7 text-white mb-6" /><h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{item.title}</h3><p className="text-xs text-zinc-400 font-light leading-relaxed">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <motion.div {...fadeInUp} className="p-8 sm:p-10 rounded-none bg-black/40 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-light italic text-white uppercase tracking-wider mb-8">APLICAÇÕES ESTRATÉGICAS</h3>
                <ul className="space-y-4 text-xs sm:text-sm font-mono uppercase text-zinc-300">
                  {["JANELAS RESIDENCIAIS", "SALAS DE REUNIÃO E ESCRITÓRIOS", "DIVISÓRIAS E PORTAS DE VIDRO", "VITRINES E SHOWROOMS", "HOTÉIS E ESPAÇOS DE LAZER"].map((a, i) => (
                    <li key={i} className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-white" /><span>{a}</span></li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }} className="p-8 sm:p-10 rounded-none bg-black/40 border border-white/10 flex flex-col justify-center text-center items-center">
              <h3 className="text-xl font-bold italic text-white uppercase tracking-wider mb-4">SOLICITE UM ORÇAMENTO TÁTICO</h3>
              <p className="text-sm text-zinc-300 font-light mb-8 max-w-sm">Transforme seus vidros com a estética sofisticada da linha Miniblind & Venetian.</p>
              <button onClick={() => handleOpenContact("Orçamento Tático Miniblind & Venetian")} className="w-full max-w-xs py-4 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl">ORÇAMENTO GRATUITO</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 06 — PELÍCULA DE PROTEÇÃO */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-white mb-6 font-semibold">MINIBLIND & VENETIAN // PELÍCULA DE PROTEÇÃO</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light italic tracking-tight text-white uppercase mb-6 max-w-4xl text-center">O AUGE DA PRIVACIDADE DECORATIVA.</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: "PRIVACIDADE PURA", desc: "Controle visual imediato com elegância de persiana." },
              { icon: Sun, title: "PROTEÇÃO UV", desc: "Barreira de 99% contra raios ultravioleta." },
              { icon: Eye, title: "LUZ EQUILIBRADA", desc: "Moderação da luz visível sem perder claridade." },
              { icon: Sparkles, title: "DECORATIVA", desc: "Listras brancas que valorizam a arquitetura do vidro." },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between shadow-xl">
                <div><item.icon className="w-7 h-7 text-white mb-6" /><h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">{item.title}</h3><p className="text-xs text-zinc-400 font-light leading-relaxed">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 06.5 — GALERIA DE APLICAÇÕES */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-white mb-6 font-semibold">GALERIA DE APLICAÇÕES</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight uppercase mb-6 max-w-4xl text-center">
              <span className="text-zinc-400 font-medium">PRIVACIDADE APLICADA </span><span className="text-white font-bold">EM CAMPO.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { src: "/images/miniblind-venetian/scene-01.webp", caption: "CORPORATIVO // SALA DE REUNIÃO" },
              { src: "/images/miniblind-venetian/scene-02.webp", caption: "DIVISÓRIA // LISTRAS HORIZONTAIS" },
              { src: "/images/miniblind-venetian/scene-03.webp", caption: "RESIDENCIAL // SALA DE ESTAR" },
              { src: "/images/miniblind-venetian/scene-05.webp", caption: "ESCRITÓRIO // CIRCULAÇÃO" },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="relative overflow-hidden rounded-none border border-white/10 group aspect-[3/4] shadow-2xl">
                <img src={item.src} alt="MINIBLIND & VENETIAN™" className="absolute inset-0 w-full h-full object-cover saturate-[0.7] group-hover:saturate-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-[10px] font-mono uppercase tracking-[0.25em] text-white bg-black/50 px-3 py-1.5 border border-white/10 backdrop-blur-sm">{item.caption}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — DEFESA PERSONALIZADA */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 sm:p-14 rounded-none bg-black/70 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-2xl">
            <motion.div {...fadeInUp} className="space-y-6">
              <h3 className="text-2xl sm:text-4xl font-light italic text-white uppercase tracking-wider">DEFESA PERSONALIZADA</h3>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">Escolha a largura das listras que mais combina com o seu ambiente. Instalação meticulosa feita por especialistas autorizados WINF.</p>
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold pt-2">GARANTIA LÍDER DO SETOR PARA SUA TRANQUILIDADE.</div>
              <div className="pt-4"><button onClick={() => handleOpenContact("Orçamento Personalizado Miniblind & Venetian")} className="px-8 py-4 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center gap-2"><span>SOLICITAR ORÇAMENTO</span><ChevronDown className="w-4 h-4 -rotate-90" /></button></div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }} className="aspect-video rounded-none bg-zinc-950 border border-white/15 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl">
              <LazyVideo poster="/images/miniblind-venetian/scene-03.webp" src="/videos/mbv-office.mp4" className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <Blinds className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-500 drop-shadow" />
                <span className="text-xs sm:text-sm font-mono italic tracking-[0.3em] text-white uppercase drop-shadow font-bold">// MINIBLIND_VENETIAN_DECO</span>
                <span className="text-[10px] font-mono text-zinc-300 tracking-wider drop-shadow bg-black/60 px-3 py-1 rounded-none border border-white/10">HORIZONTAL DECORATIVE PRIVACY FILM</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 08 — DATASHEET.MINIBLIND() */}
      <section id="datasheet-miniblind" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-white mb-4 font-semibold">DATASHEET.MINIBLIND()</motion.div>
              <motion.h2 {...fadeInUp} className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase leading-[0.9]">
                <span className="text-white block">ESPECIFICAÇÕES</span><span className="text-zinc-400 block">TÉCNICAS</span>
              </motion.h2>
            </div>
            <motion.div {...fadeInUp} className="p-2 border border-white/15 rounded-none bg-black/60 flex flex-wrap gap-1.5 self-start lg:self-end backdrop-blur-md">
              {[{ id: "all", label: "MATRIZ COMPLETA" }, { id: "mini", label: "MINIBLIND 1.0" }, { id: "venetian", label: "VENETIAN 0.5" }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${activeTab === tab.id ? "bg-white text-black font-bold shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>{tab.label}</button>
              ))}
            </motion.div>
          </div>
          <motion.div {...fadeInUp} className="rounded-none border border-white/15 bg-black/70 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-white/15 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 bg-zinc-950/80">
                  <th className="py-5 px-6 font-semibold">PARÂMETRO</th>
                  <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'mini' ? 'text-white bg-white/5' : ''}`}>▪ MINIBLIND 1.0</th>
                  <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'venetian' ? 'text-white bg-white/5' : ''}`}>▪ VENETIAN 0.5</th>
                </tr></thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm font-mono">
                  {SPEC_ROWS.map((row) => {
                    const I = row.icon;
                    return (<tr key={row.parameter} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-5 px-6 font-medium text-zinc-300 flex items-center gap-3"><I className="w-4 h-4 text-white" /><span>{row.parameter}</span></td>
                      <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'mini' ? 'text-white font-bold bg-white/[0.04]' : ''}`}>{row.mini}</td>
                      <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'venetian' ? 'text-white font-bold bg-white/[0.04]' : ''}`}>{row.venetian}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-950/60">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /><span>TODOS OS TESTES HOMOLOGADOS EM CONFORMIDADE COM AS DIRETIVAS ASTM & ISO.</span></div>
              <div>ID: MBV-SPEC-REV2026</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 09 — DÚVIDAS TÁTICAS (FAQ) */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16"><h2 className="text-2xl sm:text-4xl font-light tracking-[0.3em] uppercase text-zinc-200">D Ú V I D A S   T Á T I C A S</h2></motion.div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (<motion.div key={faq.id} {...fadeInUp} className="border-b border-white/15 pb-4">
                <button onClick={() => toggleFaq(faq.id)} aria-expanded={isOpen} className="w-full py-4 flex items-center justify-between text-left text-sm sm:text-base font-light text-zinc-200 hover:text-white transition-colors cursor-pointer group">
                  <span>{faq.question}</span><ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""}`} />
                </button>
                <AnimatePresence>{isOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><p className="text-xs sm:text-sm font-light text-zinc-400 leading-relaxed pt-2 pb-4">{faq.answer}</p></motion.div>)}</AnimatePresence>
              </motion.div>);
            })}
          </div>
        </div>
      </section>

      {/* 10 — CINEMATIC BANNER */}
      <section className="relative h-[60vh] sm:h-[75vh] w-full overflow-hidden border-t border-white/10">
        <img src="/images/miniblind-venetian/scene-04.webp" alt="MINIBLIND & VENETIAN™" className="w-full h-full object-cover object-center brightness-75 saturate-[0.8] scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </section>

      {/* 11 — PROTOCOLO DE CONTATO */}
      <section id="contato" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.35em] text-white block mb-3 font-semibold">PROTOCOLO DE CONTATO // CANAL SEGURO</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase text-white">FALE CONOSCO.</h2>
          </motion.div>
          {formSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-none bg-zinc-950 border border-white/40 text-center">
              <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" /><h3 className="text-2xl font-light text-white mb-2">Protocolo Transmitido</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto mb-6">Um especialista entrará em contato via WhatsApp.</p>
              <button onClick={() => setFormSubmitted(false)} className="text-xs font-mono uppercase tracking-widest text-white hover:underline">Enviar nova mensagem</button>
            </motion.div>
          ) : (
            <motion.form {...fadeInUp} onSubmit={handleInlineContactSubmit} className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div><span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">IDENTIFICAÇÃO</span><input type="text" required placeholder="NOME COMPLETO" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-white outline-none transition-colors rounded-none" /></div>
                <div><span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">SINAL PROFISSIONAL</span><input type="text" required placeholder="E-MAIL OU WHATSAPP" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full pb-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-600 text-xs font-mono uppercase tracking-wider focus:border-white outline-none transition-colors rounded-none" /></div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">ESCOPO DO PROJETO</span>
                <select aria-label="Área de interesse" value={formInterest} onChange={(e) => setFormInterest(e.target.value)} className="w-full pb-3 bg-black border-b border-white/20 text-white text-xs font-mono uppercase tracking-wider focus:border-white outline-none cursor-pointer rounded-none">
                  <option value="MINIBLIND 1.0">MINIBLIND 1.0 (LISTRA 1,0CM)</option><option value="VENETIAN 0.5">VENETIAN 0.5 (LISTRA 0,5CM)</option><option value="PROJETO ESPECIAL">PROJETO ESPECIAL</option>
                </select>
              </div>
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                <button type="submit" className="w-full sm:w-auto px-12 py-4 rounded-none border border-white/30 bg-black hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"><span>ENVIAR</span><Send className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => handleDirectWhatsApp()} className="w-full sm:w-auto px-12 py-4 rounded-none border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"><span>WHATSAPP</span><ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* 12 — FOOTER */}
      <WinfFooter brandName="MINIBLIND & VENETIAN" />
{/* CONTACT MODAL */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-none p-6 sm:p-10 shadow-2xl relative">
              <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white block mb-2">MINIBLIND & VENETIAN™ // ORÇAMENTO</span>
              <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-6">{contactSubject}</h3>
              {formSubmitted ? (<div className="text-center py-8"><CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" /><h4 className="text-lg text-white font-medium mb-2">Solicitação Preparada</h4><p className="text-xs text-zinc-400">Você será redirecionado para o WhatsApp.</p></div>) : (
                <form onSubmit={handleInlineContactSubmit} className="space-y-4">
                  <div><label className="text-xs font-mono text-zinc-300 block mb-1">Nome Completo *</label><input type="text" required placeholder="Seu nome" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none" /></div>
                  <div><label className="text-xs font-mono text-zinc-300 block mb-1">WhatsApp *</label><input type="tel" required placeholder="(00) 00000-0000" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none" /></div>
                  <button type="submit" className="w-full mt-4 py-4 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"><span>ENVIAR SOLICITAÇÃO</span><Send className="w-3.5 h-3.5" /></button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingMiniblindVenetian;