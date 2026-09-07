import { PAGE_META, faqJsonLd } from '../data/siteMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import React, { useState, useEffect } from "react";
import WinfFooter from './WinfFooter';
import { motion, AnimatePresence } from "framer-motion";
import LazyVideo from './LazyVideo';
import {
  Eye, Zap, Sun, Sparkles, Shield, Thermometer, Activity,
  ArrowRight, X, Send, ChevronDown, CheckCircle2, Check,
  Box, Droplets, ShieldCheck, Flame
} from "lucide-react";

interface LandingDualReflectProps {
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

interface SpecRow { parameter: string; icon: any; inv70: string; inv80: string; spectre: string; }

const SPEC_ROWS: SpecRow[] = [
  { parameter: "Transmissão Luminosa (VLT)", icon: Eye, inv70: "70% (Invisível)", inv80: "82% (Ultra-Claro)", spectre: "75% (Optic Grade)" },
  { parameter: "Rejeição Infravermelho (IR)", icon: Zap, inv70: "94% Bloqueio", inv80: "96% Bloqueio", spectre: "99% Bloqueio Extremo" },
  { parameter: "Bloqueio Ultravioleta (UV)", icon: Sun, inv70: "99.9% Barreira Total", inv80: "99.9% Barreira Total", spectre: "99.99% Solar Shield" },
  { parameter: "Redução Carga Térmica (TSER)", icon: Flame, inv70: "62% Rejeição Real", inv80: "58% Rejeição Real", spectre: "68% Rejeição Real" },
  { parameter: "Interferência Eletromagnética", icon: Sparkles, inv70: "Zero (100% Dialétrica)", inv80: "Zero (100% Dialétrica)", spectre: "Zero (100% Dialétrica)" },
  { parameter: "Reflexão Interna / Noturna", icon: Droplets, inv70: "7% (Não-Espelhado)", inv80: "8% (Não-Espelhado)", spectre: "6% (Cristal Puro)" },
  { parameter: "Garantia Homologada WINF", icon: Check, inv70: "10 Anos Residencial", inv80: "10 Anos Residencial", spectre: "15 Anos Vitalício" },
];

const FAQ_ITEMS = [
  { id: "faq-1", question: "O vidro fica com efeito espelho de verdade?", answer: "Não. A tecnologia WINF SELECT DUAL REFLECT™ foi formulada com nanopartículas puras de óxido cerâmico que atuam exclusivamente nas frequências invisíveis do espectro. A visão permanece 100% translúcida." },
  { id: "faq-2", question: "Pode ser aplicado em edifícios com regras rígidas?", answer: "Sim. Por não alterar a fachada, a linha Invisible é a solução #1 recomendada por escritórios de arquitetura." },
  { id: "faq-3", question: "Como protege móveis, quadros e pisos nobres?", answer: "O Invisible bloqueia 99.9% dos raios UV e até 99% do calor IR, estendendo a vida útil do patrimônio de interiores em mais de 10x." },
];

export const LandingDualReflect: React.FC<LandingDualReflectProps> = ({
onBack, onNavigateToWinf, onNavigateToInvisible, onNavigateToDualReflect, onNavigateToBlackPro,
  onNavigateToAeroCore, onNavigateToNeoskin, onNavigateToCeramic, onNavigateToSecurityBlind,
  onOpenMenu,
}) => {
  usePageMeta({ ...PAGE_META['dual-reflect'], jsonLd: [...(PAGE_META['dual-reflect'].jsonLd ?? []), faqJsonLd(FAQ_ITEMS)] });

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("Especificação WINF SELECT DUAL REFLECT™");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInterest, setFormInterest] = useState("DUAL REFLECT 35");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setIsContactModalOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleOpenContact = (s?: string) => { if (s) setContactSubject(s); setIsContactModalOpen(true); };
  const handleDirectWhatsApp = (m?: string) => {
    window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(m || "Olá! Gostaria de mais informações sobre WINF SELECT DUAL REFLECT™.")}`, "_blank");
  };
  const handleInlineContactSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormSubmitted(true);
    const t = `*PROTOCOLO DE CONTATO // DUAL REFLECT™*\n\n*Identificação:* ${formName}\n*E-mail:* ${formEmail || 'N/A'}\n*Interesse:* ${formInterest}`;
    setTimeout(() => { window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(t)}`, "_blank"); }, 500);
  };
  const toggleFaq = (id: string) => { setOpenFaq(openFaq === id ? null : id); };
  const fadeInUp = { initial: { opacity: 0, y: 35, filter: "blur(6px)" }, whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: false, amount: 0.2 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

  return (
    <div className="relative bg-black text-white font-sans selection:bg-sky-500/20 selection:text-white overflow-x-hidden min-h-screen">

      {/* 01 — HERO */}
      <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline preload="auto" poster="/images/dualreflect-poster-1.webp" src="/videos/dualreflect-hero.mp4" className="w-full h-full object-cover object-center brightness-90 contrast-110 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-black/60" />
          <div className="absolute inset-0 bg-sky-500/10 mix-blend-overlay" />
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
            <img src="/logo-dual-reflect.svg" width={128} height={48} alt="DUAL REFLECT™" className="w-64 sm:w-80 md:w-96 lg:w-[500px] h-auto drop-shadow-[0_4px_40px_rgba(56,189,248,0.15)]" />
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-zinc-300 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed">
              CONTROLE SOLAR COM PRIVACIDADE REFLETIVA.
            </motion.p>
          </motion.div>
        </div>
        <div className="w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] md:w-[calc(100%+7rem)] -mx-6 sm:-mx-10 md:-mx-14 py-4 sm:py-5 md:py-6 bg-black/15 backdrop-blur-xl border-y border-white/[0.08] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-20 -translate-y-6 mb-4 sm:mb-6">
          <div className="animate-infinite-ticker flex items-center whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.45em] text-zinc-200 uppercase shrink-0">
                <span>82% IR REJECTION</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
                <span>EFFECT MIRROR</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
                <span>99.9% UV TOTAL BLOCK</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
                <span>10 YEARS WARRANTY</span><span className="mx-6 sm:mx-8 text-white text-xs">●</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full z-20 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <button onClick={() => document.getElementById("arsenal-dualreflect")?.scrollIntoView({ behavior: "smooth" })} className="px-6 sm:px-8 py-3 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl">ANALISAR ARSENAL</button>
            <button onClick={onBack} className="px-6 sm:px-8 py-3 rounded-none border border-white/30 bg-black/50 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-[0.25em] transition-all cursor-pointer backdrop-blur-sm shadow-xl">VOLTAR WINF SELECT</button>
          </div>
        </div>
      </section>

      {/* 02 — PRODUCT INFO + PROGRESS BARS */}
      <section className="relative z-10 px-6 sm:px-10 md:px-16 py-20 bg-black border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">Linha <span className="text-white">Dual Reflect®</span></h2>
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-white mb-6">NÃO METALIZADA • FUME</p>
            <p className="text-base text-zinc-300 leading-relaxed mb-10">Privacidade total e conforto térmico máximo! A Linha Invisible da Winf™ bloqueia a luz e o calor, garantindo ambientes mais frescos e protegidos dos raios UV.</p>
          </motion.div>
          <motion.div {...fadeInUp} className="space-y-8 mb-10">
            <div>
              <div className="flex justify-between mb-3"><span className="text-sm text-zinc-300">Redução <strong className="text-white">UV</strong> (Ultra Violeta)</span><span className="text-sm font-bold text-white">99%</span></div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "99%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-sky-400 rounded-full" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-3"><span className="text-sm text-zinc-300">Bloqueio <strong className="text-white">IR</strong> (Infravermelho)</span><span className="text-sm font-bold text-white">73%</span></div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "73%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-sky-400 rounded-full" /></div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-sky-400/30"><Check className="w-4 h-4 text-sky-400" /><span className="text-sm text-zinc-300">Conforto Térmico: <strong className="text-white">Excelente</strong></span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-sky-400/30"><Check className="w-4 h-4 text-sky-400" /><span className="text-sm text-zinc-300">Garantia: <strong className="text-white">7 anos</strong></span></div>
          </motion.div>
          <motion.div {...fadeInUp} className="flex flex-wrap gap-3">
            {[{ icon: Shield, label: "Mais Segurança" }, { icon: Sun, label: "Bloqueio UV" }, { icon: Zap, label: "Economia" }, { icon: Thermometer, label: "Redução de Temperatura" }, { icon: Eye, label: "Ultra Visão" }, { icon: Activity, label: "Climatização" }].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-transparent rounded-full border border-zinc-700 hover:border-white transition-colors cursor-default"><item.icon className="w-4 h-4 text-zinc-400" /><span className="text-xs text-zinc-300">{item.label}</span></div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 03 — ENGENHARIA REFLETIVA */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-sky-400 mb-6 font-semibold">ENGENHARIA REFLETIVA</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight uppercase mb-6 max-w-4xl text-center">
              <span className="text-sky-400 font-medium">CONTROLE SOLAR COM </span><span className="text-white font-bold">PRIVACIDADE REFLETIVA.</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/15">
            {[
              { icon: Sun, crit: "CRIT_01", title: "BLOQUEIO UV 99.9%", desc: "PROTEÇÃO TOTAL CONTRA DESBOTAMENTO." },
              { icon: Zap, crit: "CRIT_02", title: "INFRAVERMELHO 99%", desc: "REJEIÇÃO TÉRMICA MÁXIMA SEM AFETAR A CLAREZA." },
              { icon: Eye, crit: "CRIT_03", title: "CLAREZA PERFEITA", desc: "ZERO DISTORÇÃO VISUAL. ZERO ESCURECIMENTO." },
              { icon: Sparkles, crit: "CRIT_04", title: "ZERO INTERFERÊNCIA", desc: "100% DIELÉTRICA. SEM BLOQUEIO DE SINAIS." },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="lg:px-8">
                <div className="flex items-center gap-2 text-white mb-4"><item.icon className="w-5 h-5 text-sky-400" /><span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">{item.crit}</span></div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mb-3">{item.title}</h3>
                <p className="text-xs font-mono uppercase text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — ARSENAL.DUALREFLECT() */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyVideo poster="/images/dualreflect-poster-2.webp" src="/videos/dualreflect-arsenal.mp4" className="w-full h-full object-cover object-center brightness-50 contrast-125 scale-105" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-white mb-4 font-semibold">ARSENAL.DUALREFLECT()</motion.div>
              <motion.h2 {...fadeInUp} className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none">
                <span className="text-white">SOLUÇÕES DE </span><span className="text-zinc-300">PELÍCULAS.</span>
              </motion.h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {[
              { code: "DR-35", name: "DUAL REFLECT 35", sub: "70% VLT", desc: "EFEITO ESPELHO ALTO. PRIVACIDADE DIURNA TOTAL E CONTROLE SOLAR MÁXIMO PARA FACHADAS.", subject: "Orçamento Invisible 70" },
              { code: "DR-70", name: "DUAL REFLECT 70", sub: "CLAREZA REFLETIVA", desc: "MÁXIMA TRANSPARÊNCIA COM LEVE REFLETIVIDADE. PARA AMBIENTES QUE EXIGEM LUZ.", subject: "Orçamento Invisible Spectre" },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="p-8 sm:p-10 rounded-none bg-black/75 hover:bg-sky-400 border border-white/15 hover:border-sky-400 backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all duration-300 group cursor-pointer">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-black font-bold uppercase tracking-widest transition-colors">{item.code}</span>
                    <span className="w-6 h-[1.5px] bg-sky-400/40 group-hover:bg-sky-400 transition-colors" />
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
      <section id="arsenal-dualreflect" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-[#06080F]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-sky-400 mb-6 font-semibold">ARSENAL INDUSTRIAL // DUAL REFLECT</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light italic tracking-tight text-white uppercase mb-6 max-w-4xl text-center">PROTEÇÃO REFLETIVA DE NÍVEL TÁTICO.</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Sun, title: "BLOQUEIO UV 99.9%", desc: "Previne envelhecimento prematuro e degradação de interiores." },
              { icon: Zap, title: "IR 99% REJEITADO", desc: "Controle solar extremo sem alterar a estética do vidro." },
              { icon: Eye, title: "CLAREZA PERFEITA", desc: "Zero distorção visual. Zero escurecimento." },
              { icon: Sparkles, title: "ZERO INTERFERÊNCIA", desc: "100% dielétrica. Sinais Wi-Fi e celulares intactos." },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between shadow-xl">
                <div><item.icon className="w-7 h-7 text-sky-400 mb-6" /><h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{item.title}</h3><p className="text-xs text-zinc-400 font-light leading-relaxed">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <motion.div {...fadeInUp} className="p-8 sm:p-10 rounded-none bg-black/40 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-light italic text-white uppercase tracking-wider mb-8">APLICAÇÕES ESTRATÉGICAS</h3>
                <ul className="space-y-4 text-xs sm:text-sm font-mono uppercase text-zinc-300">
                  {["FACHADAS E VIDROS COMERCIAIS", "EDIFÍCIOS RESIDENCIAIS DE ALTO PADRÃO", "ESCRITÓRIOS E SALAS DE REUNIÃO", "LOJAS E SHOWROOMS", "HOTÉIS E ESPAÇOS DE LAZER"].map((a, i) => (
                    <li key={i} className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-white" /><span>{a}</span></li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }} className="p-8 sm:p-10 rounded-none bg-black/40 border border-white/10 flex flex-col justify-center text-center items-center">
              <h3 className="text-xl font-bold italic text-white uppercase tracking-wider mb-4">SOLICITE UM ORÇAMENTO TÁTICO</h3>
              <p className="text-sm text-zinc-300 font-light mb-8 max-w-sm">Proteja seus vidros com a tecnologia refletiva da Dual Reflect.</p>
              <button onClick={() => handleOpenContact("Orçamento Tático Invisible Industrial")} className="w-full max-w-xs py-4 rounded-none bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl">ORÇAMENTO GRATUITO</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 06 — PELÍCULA DE PROTEÇÃO */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center flex flex-col items-center mb-16">
            <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-sky-400 mb-6 font-semibold">DUAL REFLECT // PELÍCULA REFLETIVA</motion.div>
            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl md:text-6xl font-light italic tracking-tight text-white uppercase mb-6 max-w-4xl text-center">O AUGE DA PRIVACIDADE REFLETIVA.</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Eye, title: "TRANSPARÊNCIA PURA", desc: "Visão 100% cristalina sem distorção ou escurecimento." },
              { icon: Zap, title: "BLOQUEIO TÉRMICO", desc: "Rejeita até 99% do calor infravermelho." },
              { icon: Shield, title: "PROTEÇÃO UV", desc: "Barreira total contra raios ultravioleta." },
              { icon: Sparkles, title: "INVISÍVEL", desc: "Aplicação invisível que preserva o design original." },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 * (idx + 1) }} className="p-8 rounded-none bg-black/60 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between shadow-xl">
                <div><item.icon className="w-7 h-7 text-sky-400 mb-6" /><h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">{item.title}</h3><p className="text-xs text-zinc-400 font-light leading-relaxed">{item.desc}</p></div>
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
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">Personalize a proteção exata onde seu ambiente mais precisa. Instalação meticulosa feita por especialistas autorizados.</p>
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold pt-2">GARANTIA LÍDER DO SETOR PARA SUA TRANQUILIDADE.</div>
              <div className="pt-4"><button onClick={() => handleOpenContact("Orçamento Personalizado Invisible")} className="px-8 py-4 rounded-none bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center gap-2"><span>SOLICITAR ORÇAMENTO</span><ChevronDown className="w-4 h-4 -rotate-90" /></button></div>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }} className="aspect-video rounded-none bg-zinc-950 border border-white/15 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl">
              <LazyVideo poster="/images/dualreflect-poster-1.webp" src="/videos/dualreflect-defense.mp4" className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <ShieldCheck className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-500 drop-shadow" />
                <span className="text-xs sm:text-sm font-mono italic tracking-[0.3em] text-white uppercase drop-shadow font-bold">// DUAL_REFLECT_PPF_ULTRA</span>
                <span className="text-[10px] font-mono text-zinc-300 tracking-wider drop-shadow bg-black/60 px-3 py-1 rounded-none border border-white/10">HIGH-DENSITY TRANSPARENCY ARMOR</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 08 — DATASHEET.DUALREFLECT() */}
      <section id="datasheet-dualreflect" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <motion.div {...fadeInUp} className="text-xs font-mono uppercase tracking-[0.35em] text-white mb-4 font-semibold">DATASHEET.DUALREFLECT()</motion.div>
              <motion.h2 {...fadeInUp} className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase leading-[0.9]">
                <span className="text-white block">ESPECIFICAÇÕES</span><span className="text-zinc-400 block">TÉCNICAS</span>
              </motion.h2>
            </div>
            <motion.div {...fadeInUp} className="p-2 border border-white/15 rounded-none bg-black/60 flex flex-wrap gap-1.5 self-start lg:self-end backdrop-blur-md">
              {[{ id: "all", label: "MATRIZ COMPLETA" }, { id: "70", label: "DUAL REFLECT 35" }, { id: "80", label: "DUAL REFLECT 50" }, { id: "spectre", label: "SPECTRE" }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-none text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${activeTab === tab.id ? "bg-white text-black font-bold shadow-lg" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>{tab.label}</button>
              ))}
            </motion.div>
          </div>
          <motion.div {...fadeInUp} className="rounded-none border border-white/15 bg-black/70 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-white/15 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 bg-zinc-950/80">
                  <th className="py-5 px-6 font-semibold">PARÂMETRO</th>
                  <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === '70' ? 'text-white bg-white/5' : ''}`}>▪ DUAL REFLECT 35</th>
                  <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === '80' ? 'text-white bg-white/5' : ''}`}>▪ DUAL REFLECT 50</th>
                  <th className={`py-5 px-6 font-semibold transition-colors ${activeTab === 'spectre' ? 'text-white bg-white/5' : ''}`}>▪ SPECTRE</th>
                </tr></thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm font-mono">
                  {SPEC_ROWS.map((row) => {
                    const I = row.icon;
                    return (<tr key={row.parameter} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-5 px-6 font-medium text-zinc-300 flex items-center gap-3"><I className="w-4 h-4 text-white" /><span>{row.parameter}</span></td>
                      <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === '70' ? 'text-white font-bold bg-white/[0.04]' : ''}`}>{row.inv70}</td>
                      <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === '80' ? 'text-white font-bold bg-white/[0.04]' : ''}`}>{row.inv80}</td>
                      <td className={`py-5 px-6 text-zinc-200 transition-colors ${activeTab === 'spectre' ? 'text-white font-bold bg-white/[0.04]' : ''}`}>{row.spectre}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-950/60">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /><span>TODOS OS TESTES HOMOLOGADOS EM CONFORMIDADE COM AS DIRETIVAS ASTM & ISO.</span></div>
              <div>ID: DR-70-REV2026</div>
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
        <LazyVideo poster="/images/dualreflect-poster-3.webp" src="/videos/dualreflect-cinematic.mp4" className="w-full h-full object-cover object-center brightness-75 scale-105" />
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
                  <option value="DUAL REFLECT 35">DUAL REFLECT 35</option><option value="DUAL REFLECT 50">DUAL REFLECT 50</option><option value="DUAL REFLECT 70">DUAL REFLECT 70</option><option value="PROJETO ESPECIAL">PROJETO ESPECIAL</option>
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
      <WinfFooter brandName="DUAL REFLECT" />
{/* CONTACT MODAL */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-none p-6 sm:p-10 shadow-2xl relative">
              <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white block mb-2">DUAL REFLECT™ // ORÇAMENTO</span>
              <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-6">{contactSubject}</h3>
              {formSubmitted ? (<div className="text-center py-8"><CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" /><h4 className="text-lg text-white font-medium mb-2">Solicitação Preparada</h4><p className="text-xs text-zinc-400">Você será redirecionado para o WhatsApp.</p></div>) : (
                <form onSubmit={handleInlineContactSubmit} className="space-y-4">
                  <div><label className="text-xs font-mono text-zinc-300 block mb-1">Nome Completo *</label><input type="text" required placeholder="Seu nome" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none" /></div>
                  <div><label className="text-xs font-mono text-zinc-300 block mb-1">WhatsApp *</label><input type="tel" required placeholder="(00) 00000-0000" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none" /></div>
                  <button type="submit" className="w-full mt-4 py-4 rounded-none bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"><span>ENVIAR SOLICITAÇÃO</span><Send className="w-3.5 h-3.5" /></button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingDualReflect;
