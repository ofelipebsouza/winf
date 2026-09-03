import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronDown, CheckCircle2, Shield, Sun, Eye, Layers, Lock, Sparkles, Send, ExternalLink, Globe } from 'lucide-react';
import KoenigseggMenu from './KoenigseggMenu';
import { FooterSeals } from './FooterSeals';

interface LandingWinfSelectProps {
  onBack?: () => void;
  onNavigateToAerocore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToInvisible?: () => void;
  onNavigateToDualReflect?: () => void;
  onNavigateToBlackPro?: () => void;
  onNavigateToSecurityBlinder?: () => void;
  onNavigateToCatalog?: () => void;
  onContactConsultant?: () => void;
  videoSrc?: string;
  onOpenMenu?: () => void;
}

interface ProductLineSpec {
  id: string;
  name: string;
  category: string;
  headline: string;
  desc: string;
  purpose: string;
  transparency: string;
  solarControl: string;
  privacy: string;
  safety: string;
  applications: string[];
  warranty: string;
  badge: string;
}

const PRODUCT_LINES: ProductLineSpec[] = [
  {
    id: 'invisible',
    name: 'INVISIBLE™',
    category: 'NANO CERAMIC',
    badge: '01 / INVISIBLE™',
    headline: 'Performance térmica. Visual praticamente intacto.',
    desc: 'Para projetos nos quais o vidro precisa continuar parecendo vidro. A tecnologia nano cerâmica WINF SELECT™ domina o espectro solar mantendo máxima transmissão de luz e zero interferência estética.',
    purpose: 'Máxima redução térmica com transparência absoluta e iluminação natural',
    transparency: 'Alta (70% - 85% VLT)',
    solarControl: 'Até 98%+ Rejeição Infravermelha (TIR)',
    privacy: 'Sutil / Neutra',
    safety: 'Retenção básica de estilhaços',
    applications: ['RESIDENCIAL', 'FACHADAS', 'VÃOS PANORÂMICOS', 'ARQUITETURA CONTEMPORÂNEA'],
    warranty: 'Até 15 Anos*',
  },
  {
    id: 'dual_reflect',
    name: 'DUAL REFLECT™',
    category: 'SOLAR CONTROL',
    badge: '02 / DUAL REFLECT™',
    headline: 'Controle solar com uma nova leitura da fachada.',
    desc: 'Tecnologia refletiva desenvolvida para ambientes submetidos à incidência solar elevada, combinando redução térmica, controle de luminosidade e privacidade diurna.',
    purpose: 'Controle solar intenso e reflexão equilibrada para grandes panos de vidro',
    transparency: 'Média (15% - 35% VLT)',
    solarControl: 'Até 82% Energia Solar Total Rejeitada (TSER)',
    privacy: 'Elevada (Efeito espelho unilateral diurno)',
    safety: 'Retenção de estilhaços',
    applications: ['EDIFÍCIOS', 'ESCRITÓRIOS', 'COBERTURAS', 'FACHADAS COMERCIAIS'],
    warranty: 'Até 10 Anos*',
  },
  {
    id: 'blackpro',
    name: 'BLACKPRO™',
    category: 'PRIVACY / SOLAR CONTROL',
    badge: '03 / BLACKPRO™',
    headline: 'Menos exposição. Mais presença.',
    desc: 'Uma interpretação mais escura e arquitetônica do controle solar. BLACKPRO™ combina privacidade, redução de luminosidade e identidade visual para ambientes onde o próprio vidro participa da composição da fachada.',
    purpose: 'Privacidade arquitetônica acentuada e redução de ofuscamento visual',
    transparency: 'Escura (05% - 20% VLT)',
    solarControl: 'Até 94% Rejeição IR',
    privacy: 'Máxima (Fechamento visual externo)',
    safety: 'Retenção de estilhaços',
    applications: ['COBERTURAS', 'SALAS DE REUNIÃO', 'RESIDÊNCIAS', 'FACHADAS AUTORAIS'],
    warranty: 'Até 10 Anos*',
  },
  {
    id: 'securityblind',
    name: 'SECURITYBLINDER™',
    category: 'SAFETY FILM',
    badge: '04 / SECURITYBLINDER™',
    headline: 'Porque vidro também pode fazer parte da estratégia de proteção.',
    desc: 'Películas multicamadas desenvolvidas para aumentar a retenção do vidro após impactos. Uma solução complementar para vitrines, portas, janelas, fachadas e ambientes que demandam maior mitigação de riscos de estilhaçamento.',
    purpose: 'Retenção física de fragmentos e aumento da resistência mecânica do vidro',
    transparency: 'Transparente ou Fumê',
    solarControl: 'Filtro UV 99.9% + Opções com controle térmico',
    privacy: 'Conforme tonalidade',
    safety: 'Alta retenção mecânica multicamadas (4 a 12 Mil)',
    applications: ['VITRINES', 'PORTAS', 'JANELAS', 'FACHADAS', 'RESIDÊNCIAS', 'AMBIENTES COMERCIAIS'],
    warranty: 'Até 10 Anos*',
  },
];

// Reusable cinematic animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 45, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: false, amount: 0.25, margin: "-60px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const fadeInLabel = {
  initial: { opacity: 0, y: 15, letterSpacing: '0.2em' },
  whileInView: { opacity: 1, y: 0, letterSpacing: '0.35em' },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export const LandingWinfSelect: React.FC<LandingWinfSelectProps> = ({
onBack,
  onNavigateToAerocore,
  onNavigateToNeoskin,
  onNavigateToCeramic,
  onNavigateToInvisible,
  onNavigateToDualReflect,
  onNavigateToBlackPro,
  onNavigateToSecurityBlinder,
  onNavigateToCatalog,
  onContactConsultant,
  videoSrc = '/videos/video-bg.mp4',
  onOpenMenu,
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTabLine, setActiveTabLine] = useState<string>('invisible');

  // Video Ref & Animation Engine
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isVideoReadyRef = useRef<boolean>(false);
  const isSeekingRef = useRef<boolean>(false);

  // Simulator State
  const [simArea, setSimArea] = useState<number>(45);
  const [simType, setSimType] = useState<string>('Residencial Alto Padrão');
  const [simSun, setSimSun] = useState<string>('Tarde (Poente / Calor Intenso)');
  const [simObjective, setSimObjective] = useState<string>('Reduzir calor sem perder luz');

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formProjectType, setFormProjectType] = useState('Residencial');
  const [formArea, setFormArea] = useState('');
  const [formNeed, setFormNeed] = useState('Controle térmico');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // menu handled globally
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global Scroll Video Scrubbing Engine across entire page
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      isVideoReadyRef.current = true;
      video.pause();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', () => {
      isSeekingRef.current = false;
    });

    if (video.readyState >= 1) {
      isVideoReadyRef.current = true;
      video.pause();
    }

    let animationFrameId: number;

    const updateVideoLoop = () => {
      if (video && isVideoReadyRef.current && video.duration) {
        const target = targetProgressRef.current;
        const current = currentProgressRef.current;
        const diff = target - current;

        // Apply smooth inertia damping
        currentProgressRef.current += diff * 0.12;
        const targetTime = currentProgressRef.current * video.duration;
        const timeDiff = targetTime - video.currentTime;

        // Forward scrubbing: use hardware accelerated playbackRate
        if (timeDiff > 0.08) {
          const speed = Math.min(Math.max(timeDiff * 4.5, 0.75), 4.0);
          video.playbackRate = speed;
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else if (timeDiff < -0.05) {
          // Backward scrubbing: step backwards smoothly
          if (!video.paused) {
            video.pause();
          }
          if (!isSeekingRef.current) {
            isSeekingRef.current = true;
            video.currentTime = Math.max(0, video.currentTime + timeDiff * 0.4);
          }
        } else {
          // Settled on target frame
          if (!video.paused) {
            video.pause();
          }
          if (Math.abs(timeDiff) > 0.01 && !isSeekingRef.current) {
            isSeekingRef.current = true;
            video.currentTime = targetTime;
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoLoop);
    };

    animationFrameId = requestAnimationFrame(updateVideoLoop);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        targetProgressRef.current = progress;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      if (video) video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleContact = (contextMessage?: string) => {
    // menu handled globally
    const msg = contextMessage || 'Olá, gostaria de conhecer as soluções WINF™ na minha cidade.';
    if (onContactConsultant) {
      onContactConsultant();
    } else {
      window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const text = `*NOVA SOLICITAÇÃO // WINF SELECT™*\n\n` +
      `*Nome:* ${formName}\n` +
      `*Empresa/Escritório:* ${formCompany || 'N/A'}\n` +
      `*WhatsApp:* ${formPhone}\n` +
      `*Cidade:* ${formCity}\n` +
      `*Tipo de Projeto:* ${formProjectType}\n` +
      `*Área aproximada:* ${formArea || 'A definir'} m²\n` +
      `*Principal Necessidade:* ${formNeed}`;
    
    setTimeout(() => {
      window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(text)}`, '_blank');
    }, 600);
  };

  const selectedLine = PRODUCT_LINES.find(l => l.id === activeTabLine) || PRODUCT_LINES[0];

  const navLinks = [
    { number: '01', title: 'WINF SELECT™', subtitle: 'Thermal Intelligence & Arquitetura', action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { number: '02', title: 'AEROCORE™ DEFENSE', subtitle: 'Proteção Térmica Automotiva', action: () => { if (onNavigateToAerocore) onNavigateToAerocore(); } },
    { number: '03', title: 'NEOSKIN™ PPF', subtitle: 'Paint Protection Film Militar', action: () => { if (onNavigateToNeoskin) onNavigateToNeoskin(); } },
    { number: '04', title: 'CERAMIC ARMORING™', subtitle: 'Blindagem Molecular 9H', action: () => { if (onNavigateToCeramic) onNavigateToCeramic(); } },
    { number: '05', title: 'A CIÊNCIA DO CONFORTO', subtitle: 'Estética, Eficiência & Blindagem', action: () => { document.getElementById('ciencia-conforto')?.scrollIntoView({ behavior: 'smooth' }); } },
    { number: '06', title: 'TECNOLOGIA AEROESPACIAL', subtitle: 'Nano Cerâmica, Magnathon & Grafeno', action: () => { document.getElementById('aeroespacial')?.scrollIntoView({ behavior: 'smooth' }); } },
    { number: '07', title: 'LINHAS ARQUITETÔNICAS', subtitle: 'Invisible, Dual Reflect, BlackPro & Security', action: () => { document.getElementById('linhas')?.scrollIntoView({ behavior: 'smooth' }); } },
    { number: '08', title: 'SIMULADOR DE PROJETO', subtitle: 'Análise Preliminar de Desempenho', action: () => { document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' }); } },
    { number: '09', title: 'ATENDIMENTO OFICIAL', subtitle: 'WhatsApp Concierge & Licenciados', action: () => { document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }); } },
  ];

  return (
    <div className="relative bg-black text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
      {/* GLOBAL FIXED BACKGROUND VIDEO (HIGH CLARITY & LUMINOSITY) */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          playsInline
          muted
          preload="auto"
          className="w-full h-full object-cover opacity-75 mix-blend-screen scale-105"
          src={videoSrc}
        />
        {/* Soft, Transparent Vignette */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
      </div>

      {/* 01 — HERO SECTION (FULLSCREEN VIEWPORT) */}
      <section className="relative z-10 min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none">
        {/* Header */}
        <header className="w-full flex items-center justify-between z-30 relative">
          {/* WINF Brand Logo */}
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

          {/* Nav Menu Toggle (Dois Palitos) */}
          <button
            onClick={() => onOpenMenu?.()}
            className="group flex flex-col items-end justify-center gap-2 p-2.5 focus:outline-none cursor-pointer z-50 relative hover:opacity-80 transition-opacity"
            aria-label="Abrir Menu de Navegação"
          >
            <span 
              className={`block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${
                'w-7 group-hover:w-8'
              }`} 
            />
            <span 
              className={`block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${
                'w-5 group-hover:w-8'
              }`} 
            />
          </button>
        </header>

        {/* Center Hero Title (Pure Minimalist Hero) */}
        <div className="flex-1 flex items-center justify-center my-auto px-4 z-20 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.18em] sm:tracking-[0.25em] md:tracking-[0.3em] text-white uppercase leading-none font-sans drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] whitespace-nowrap flex items-center justify-center">
              <span>WINF SELECT</span>
              <span className="text-xs sm:text-base md:text-xl lg:text-2xl font-light text-zinc-300 ml-1.5 sm:ml-2.5 -translate-y-2 sm:-translate-y-4 md:-translate-y-6">
                TM
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Full-Width 100% Infinite Marquee Strip (Positioned 24px higher) */}
        <div className="w-[calc(100%+3rem)] sm:w-[calc(100%+5rem)] md:w-[calc(100%+7rem)] -mx-6 sm:-mx-10 md:-mx-14 py-4 sm:py-5 md:py-6 bg-black/15 backdrop-blur-xl border-y border-white/[0.08] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-20 -translate-y-6 mb-6 sm:mb-10">
          <div className="animate-infinite-ticker flex items-center whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-xs sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.45em] text-zinc-200 uppercase shrink-0">
                <span>WINF SELECT™</span>
                <span className="mx-6 sm:mx-8 text-white/50 text-xs">●</span>
                <span>THERMAL INTELLIGENCE</span>
                <span className="mx-6 sm:mx-8 text-white/50 text-xs">●</span>
                <span>A CIÊNCIA DO CONFORTO</span>
                <span className="mx-6 sm:mx-8 text-white/50 text-xs">●</span>
                <span>REJEIÇÃO INFRAVERMELHO 98%+</span>
                <span className="mx-6 sm:mx-8 text-white/50 text-xs">●</span>
                <span>ZERO INTERFERÊNCIA VISUAL</span>
                <span className="mx-6 sm:mx-8 text-white/50 text-xs">●</span>
                <span>BLOQUEIO UVR 99.9%</span>
                <span className="mx-6 sm:mx-8 text-white/50 text-xs">●</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="w-full flex items-center justify-between text-xs text-zinc-300 z-10 relative pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-zinc-400">
            FRAME // {Math.round(scrollProgress * 100)}%
          </div>

          <div 
            className={`flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-opacity duration-500 ${
              scrollProgress > 0.05 ? 'opacity-30' : 'opacity-90 animate-pulse'
            }`}
          >
            <span>SCROLL</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-300 animate-bounce" />
          </div>
        </div>
      </section>

      {/* 02 — MANIFESTO */}
      <section id="manifesto" className="relative z-10 min-h-[70vh] flex items-center justify-center px-6 sm:px-12 md:px-20 py-24 border-t border-white/10 bg-black/25 backdrop-blur-[1px]">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-8 drop-shadow">
            WINF SELECT™ // ARCHITECTURE
          </motion.div>

          <motion.h2
            {...fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight uppercase mb-10 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          >
            O vidro permanece.<br />
            <span className="text-zinc-300 font-extralight">O ambiente muda.</span>
          </motion.h2>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-2xl md:text-3xl text-zinc-200 font-light leading-relaxed max-w-4xl mb-16 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            Tecnologia aplicada ao vidro para controle térmico, proteção UV, privacidade e segurança — preservando a linguagem original da arquitetura.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-400 border-t border-white/10 pt-8 drop-shadow"
          >
            RESIDENCIAL / CORPORATIVO / FACHADAS / VITRINES
          </motion.div>
        </div>
      </section>

      {/* 03 — A CIÊNCIA DO CONFORTO (3 PILARES) */}
      <section id="ciencia-conforto" className="relative z-10 px-6 sm:px-12 md:px-20 py-24 border-t border-white/10 bg-black/35 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            ENGINEERING PILLARS
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-12 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            A Ciência do Conforto
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', tag: 'INVIOLABILIDADE', title: 'Estética Inviolável', desc: 'Nanolâminas dominam o espectro solar sem alterar a transparência. Desempenho extremo em silêncio.', stat: '// ZERO INTERFERÊNCIA VISUAL' },
              { num: '02', tag: 'ENERGIA RADIANTE', title: 'Eficiência Térmica', desc: 'Rejeição infravermelha TIR 98%+ diretamente na superfície do vidro com engenharia de precisão.', stat: '// TIR 98%+ REJEIÇÃO IR' },
              { num: '03', tag: 'LONGEVIDADE', title: 'Blindagem de Patrimônio', desc: 'Bloqueio de 99,9% da radiação ultravioleta, preservando interiores e ativos de alto valor.', stat: '// 99.9% BLOQUEIO UVR' },
            ].map((item) => (
              <motion.div key={item.num} {...fadeInUp} className="p-6 rounded-none bg-black/40 border border-white/15 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block mb-3">{item.num} // {item.tag}</span>
                  <h3 className="text-xl font-light text-white uppercase mb-3 drop-shadow">{item.title}</h3>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed drop-shadow">{item.desc}</p>
                </div>
                <div className="pt-4 mt-6 border-t border-white/10 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  {item.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — TECNOLOGIA AEROESPACIAL */}
      <section id="aeroespacial" className="relative z-10 px-6 sm:px-12 md:px-20 py-24 border-t border-white/10 bg-black/30 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            ORBITAL PROTECTION STANDARD
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-10 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-4xl">
            Tecnologia aeroespacial acessível para você.
          </motion.h2>

          {/* Frentes Tecnológicas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Nano Cerâmica' },
              { title: 'Magnetron Sputtering' },
              { title: 'Grafeno' },
              { title: 'TPU Auto-Regeneração' },
              { title: 'Carbono de Alta Pureza' },
              { title: 'Invisibilidade Ótica' },
            ].map((tech, idx) => (
              <motion.div
                key={tech.title}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                className="p-4 rounded-none bg-black/40 border border-white/10 backdrop-blur-sm text-center"
              >
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">0{idx + 1}</span>
                <span className="text-xs font-mono text-white uppercase tracking-wider leading-tight block">{tech.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — O PROBLEMA */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-24 border-t border-white/10 bg-black/25 backdrop-blur-[1px]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            SOLAR EXPOSURE
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight mb-10 max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Grandes superfícies de vidro têm um custo invisível.
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'CALOR', desc: 'Carga térmica elevada.' },
              { label: 'UV', desc: 'Desgaste de interiores.' },
              { label: 'OFUSCAMENTO', desc: 'Conforto visual comprometido.' },
              { label: 'ENERGIA', desc: 'Maior demanda de climatização.' },
            ].map((item, idx) => (
              <motion.div key={item.label} {...fadeInUp} transition={{ duration: 0.6, delay: idx * 0.08 }} className="border-t border-white/15 pt-4">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-white mb-1 drop-shadow">{item.label}</div>
                <p className="text-xs text-zinc-300 font-light drop-shadow">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.h3 {...fadeInUp} className="text-xl sm:text-2xl font-light text-zinc-100 tracking-tight border-t border-white/15 pt-8 drop-shadow">
            WINF SELECT™ atua exatamente nessa superfície.
          </motion.h3>
        </div>
      </section>

      {/* 05.5 — ECOSSISTEMA: AEROCORE™ & NEOSKIN™ */}
      <section id="ecossistema" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/30 backdrop-blur-[1px]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            WINF ECOSYSTEM // AEROCORE™ & NEOSKIN™
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-16 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Ecossistema de Alta Performance
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AEROCORE™ */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative group overflow-hidden rounded-none bg-black/40 border border-white/15 backdrop-blur-md shadow-2xl"
            >
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src="/images/aerocore-hero.png"
                  alt="AeroCore™"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400 block mb-3">
                    AEROCORE™ DEFENSE
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-wide mb-2 drop-shadow">
                    AeroCore™
                  </h3>
                  <p className="text-sm text-zinc-300 font-light max-w-md drop-shadow">
                    Proteção térmica automotiva de alto desempenho. Tecnologia aeroespacial aplicada à superfície do seu veículo.
                  </p>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <button
                  onClick={() => onNavigateToAerocore && onNavigateToAerocore()}
                  className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white border-b border-white/60 hover:border-white pb-1.5 transition-all cursor-pointer drop-shadow"
                >
                  <span>SAIBA MAIS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* NEOSKIN™ */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group overflow-hidden rounded-none bg-black/40 border border-white/15 backdrop-blur-md shadow-2xl"
            >
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src="/images/neoskin-hero.png"
                  alt="NeoSkin™"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400 block mb-3">
                    NEOSKIN™ PPF
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-wide mb-2 drop-shadow">
                    NeoSkin™
                  </h3>
                  <p className="text-sm text-zinc-300 font-light max-w-md drop-shadow">
                    Paint Protection Film militar. Autorregeneração, clareza cristalina e defesa molecular impenetrável.
                  </p>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <button
                  onClick={() => onNavigateToNeoskin && onNavigateToNeoskin()}
                  className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white border-b border-white/60 hover:border-white pb-1.5 transition-all cursor-pointer drop-shadow"
                >
                  <span>SAIBA MAIS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 06 — LINHAS WINF SELECT™ (OVERVIEW) */}
      <section id="linhas" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/35 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-4 drop-shadow">
                ARCHITECTURAL LINEUP
              </motion.div>
              <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                Linhas WINF SELECT™
              </motion.h2>
            </div>
            <motion.p {...fadeInUp} className="text-sm text-zinc-300 max-w-md font-light drop-shadow">
              Soluções de engenharia para cada desafio térmico, óptico e de proteção em vidro.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCT_LINES.map((line, idx) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 50, scale: 0.97, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  document.getElementById(line.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/15 hover:border-white/40 backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
                      {line.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-light text-white tracking-wide uppercase mb-4 drop-shadow">
                    {line.name}
                  </h3>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed mb-8 drop-shadow">
                    {line.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-200 group-hover:text-white pt-6 border-t border-white/10">
                  <span>EXPLORE {line.name.replace('™', '')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — WINF™ PARTNERS */}
      <section id="partners" className="relative z-10 px-6 sm:px-12 md:px-20 py-24 border-t border-white/10 bg-black/35 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            WINF™ PARTNERS
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Assuma o controle do seu ambiente.
          </motion.h2>

          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.15 }} className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-3xl mb-10 drop-shadow">
            Fachadas envidraçadas são obras de arte, não fontes de desequilíbrio térmico. A WINF™ neutraliza o desconforto radiante com eficiência operacional e execução certificada.
          </motion.p>

          <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <span className="px-4 py-2 border border-white/10 bg-black/30">SUSTENTABILIDADE</span>
            <span className="px-4 py-2 border border-white/10 bg-black/30">GOVERNANÇA WINF™</span>
            <span className="px-4 py-2 border border-white/10 bg-black/30">EXECUÇÃO CERTIFICADA</span>
          </div>
        </div>
      </section>

      {/* 12 — COMPARAÇÃO */}
      <section className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/45 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            LINE COMPARISON MATRIX
          </motion.div>
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-12 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Comparativo de Linhas
          </motion.h2>

          {/* Selector Tabs */}
          <motion.div {...fadeInUp} transition={{ duration: 0.8, delay: 0.1 }} className="flex flex-wrap gap-3 mb-12">
            {PRODUCT_LINES.map((line) => (
              <button
                key={line.id}
                onClick={() => setActiveTabLine(line.id)}
                className={`px-6 py-3 rounded-none text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${
                  activeTabLine === line.id
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'bg-black/50 text-zinc-300 hover:text-white border border-white/15 backdrop-blur-sm'
                }`}
              >
                {line.name}
              </button>
            ))}
          </motion.div>

          {/* Active Detail Matrix Card */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="p-8 sm:p-12 rounded-none bg-black/50 border border-white/15 backdrop-blur-md shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">{selectedLine.category}</span>
                <h3 className="text-2xl sm:text-4xl font-light text-white mt-1 drop-shadow">{selectedLine.name}</h3>
              </div>
              <span className="text-xs font-mono text-zinc-300">Garantia: {selectedLine.warranty}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">Finalidade Principal</span>
                <p className="text-zinc-200 font-light">{selectedLine.purpose}</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">Transparência (VLT)</span>
                <p className="text-zinc-200 font-light">{selectedLine.transparency}</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">Controle Solar (IR/TSER)</span>
                <p className="text-zinc-200 font-light">{selectedLine.solarControl}</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">Nível de Privacidade</span>
                <p className="text-zinc-200 font-light">{selectedLine.privacy}</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">Retenção de Segurança</span>
                <p className="text-zinc-200 font-light">{selectedLine.safety}</p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">Aplicações Recomendadas</span>
                <p className="text-zinc-200 font-light">{selectedLine.applications.join(' • ')}</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => handleContact(`Olá! Gostaria de ver as especificações completas da linha ${selectedLine.name}.`)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <span>VER ESPECIFICAÇÕES COMPLETAS +</span>
              </button>

              <button
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-none bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-widest text-white border border-white/20 transition-colors"
              >
                Solicitar Cotação desta Linha →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 13 — SIMULADOR */}
      <section id="simulador" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/45 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            WINF SELECT™ // PROJECT ANALYSIS
          </motion.div>
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Quanto vidro existe entre você e o sol?
          </motion.h2>
          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.15 }} className="text-base text-zinc-300 font-light max-w-2xl mb-16 drop-shadow">
            Informe alguns dados do projeto para receber uma estimativa preliminar de solução e performance.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-black/50 p-8 sm:p-12 rounded-none border border-white/15 backdrop-blur-md shadow-2xl"
          >
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                  Área Envidraçada Aproximada: <strong className="text-white font-mono text-sm">{simArea} m²</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={simArea}
                  onChange={(e) => setSimArea(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-700 rounded-none appearance-none cursor-pointer accent-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                  Tipo de Imóvel
                </label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value)}
                  className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none backdrop-blur-sm"
                >
                  <option value="Residencial Alto Padrão" className="bg-black">Residencial Alto Padrão</option>
                  <option value="Apartamento / Cobertura" className="bg-black">Apartamento / Cobertura</option>
                  <option value="Edifício Corporativo / Escritório" className="bg-black">Edifício Corporativo / Escritório</option>
                  <option value="Loja / Vitrine Comercial" className="bg-black">Loja / Vitrine Comercial</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                  Incidência Solar Predominante
                </label>
                <select
                  value={simSun}
                  onChange={(e) => setSimSun(e.target.value)}
                  className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none backdrop-blur-sm"
                >
                  <option value="Tarde (Poente / Calor Intenso)" className="bg-black">Tarde (Poente / Calor Intenso)</option>
                  <option value="Manhã (Nascente)" className="bg-black">Manhã (Nascente)</option>
                  <option value="Integral (Exposição Total)" className="bg-black">Integral (Exposição Total)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                  Objetivo Principal
                </label>
                <select
                  value={simObjective}
                  onChange={(e) => setSimObjective(e.target.value)}
                  className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none backdrop-blur-sm"
                >
                  <option value="Reduzir calor sem perder luz" className="bg-black">Reduzir calor sem perder luz</option>
                  <option value="Preservar transparência total" className="bg-black">Preservar transparência total</option>
                  <option value="Aumentar privacidade" className="bg-black">Aumentar privacidade</option>
                  <option value="Proteger interiores e pisos" className="bg-black">Proteger interiores e pisos</option>
                  <option value="Segurança do vidro contra impactos" className="bg-black">Segurança do vidro contra impactos</option>
                </select>
              </div>
            </div>

            {/* Preliminary Output */}
            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                  DIAGNÓSTICO PRELIMINAR // ESTIMATIVA
                </span>
                <h4 className="text-xl font-light text-white mb-4 drop-shadow">
                  {simObjective.includes('privacidade') ? 'WINF SELECT™ Dual Reflect ou BlackPro' : simObjective.includes('Segurança') ? 'WINF SELECT™ SecurityBlinder' : 'WINF SELECT™ Invisible Nano Ceramic'}
                </h4>
                <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6 drop-shadow">
                  Para uma fachada de {simArea} m² sob incidência {simSun.toLowerCase()}, a tecnologia recomendada mitiga a carga radiante proporcionando alívio térmico imediato sem descaracterizar a luminosidade natural.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6">
                  <div className="p-3 bg-black/60 rounded-none border border-white/10 backdrop-blur-sm">
                    <span className="text-zinc-400 block text-[10px]">BLOQUEIO UVR</span>
                    <span className="text-white font-bold text-sm">99.9%</span>
                  </div>
                  <div className="p-3 bg-black/60 rounded-none border border-white/10 backdrop-blur-sm">
                    <span className="text-zinc-400 block text-[10px]">REDUÇÃO TIR EST.</span>
                    <span className="text-white font-bold text-sm">Até 98%+</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const msg = `Olá! Fiz uma simulação no site para ${simArea}m² de vidro (${simType}, sol ${simSun}, foco: ${simObjective}). Gostaria de receber uma proposta detalhada.`;
                  handleContact(msg);
                }}
                className="w-full py-4 rounded-none bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer shadow-lg"
              >
                SIMULAR MEU PROJETO →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 14 — CTA PRINCIPAL // VIVA A EXPERIÊNCIA WINF */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/25 backdrop-blur-[1px] text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            VIVA A EXPERIÊNCIA WINF
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-4xl sm:text-6xl md:text-7xl font-light text-white uppercase tracking-tight leading-tight mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            Seu projeto já possui vidro.<br />
            <span className="text-zinc-300 font-extralight">Agora escolha o que ele pode fazer.</span>
          </motion.h2>

          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.15 }} className="text-sm sm:text-base text-zinc-300 font-light max-w-2xl mx-auto mb-12 drop-shadow">
            Fale agora com nosso especialista pelo WhatsApp e seja encaminhado para o licenciado WINF™ oficial da sua cidade.
          </motion.p>

          <motion.div {...fadeInUp} transition={{ duration: 0.9, delay: 0.25 }} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => handleContact('Olá, gostaria de conhecer as soluções WINF™ na minha cidade.')}
              className="w-full sm:w-auto px-10 py-5 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-widest transition-all cursor-pointer shadow-2xl"
            >
              FALAR COM ESPECIALISTA →
            </button>
            <a
              href="https://winf.com.br/catalogo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-5 rounded-none border border-white/30 bg-black/40 hover:bg-black/70 text-zinc-200 hover:text-white font-mono text-xs uppercase tracking-widest transition-all cursor-pointer backdrop-blur-sm inline-flex items-center justify-center gap-2"
            >
              <span>VER CATÁLOGO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.9, delay: 0.35 }} className="mt-8 text-xs font-mono text-zinc-400 tracking-wider">
            Licenciados em todo o Brasil · Atendimento via WhatsApp 24h
          </motion.div>
        </div>
      </section>

      {/* 15 — CONTATO (FORMULÁRIO EDITORIAL) */}
      <section id="contato" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-4 drop-shadow">
            PROJECT ADVISORY
          </motion.div>
          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-16 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Conte-nos sobre o projeto.
          </motion.h2>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-none bg-black/60 border border-white/20 text-center backdrop-blur-md"
            >
              <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-light text-white mb-2">Solicitação Encaminhada</h3>
              <p className="text-sm text-zinc-300 font-light max-w-md mx-auto mb-6">
                Seus dados foram organizados e um especialista WINF SELECT™ dará continuidade pelo seu WhatsApp.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white cursor-pointer"
              >
                Enviar outro projeto
              </button>
            </motion.div>
          ) : (
            <motion.form
              {...fadeInUp}
              onSubmit={handleFormSubmit}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-500 text-sm focus:border-white outline-none transition-colors rounded-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                    Empresa / Escritório (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do escritório ou empresa"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-500 text-sm focus:border-white outline-none transition-colors rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-500 text-sm focus:border-white outline-none transition-colors rounded-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                    Cidade / UF *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: São Paulo / SP"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-500 text-sm focus:border-white outline-none transition-colors rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                    Tipo de Projeto
                  </label>
                  <select
                    value={formProjectType}
                    onChange={(e) => setFormProjectType(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white text-sm focus:border-white outline-none rounded-none"
                  >
                    <option value="Residencial" className="bg-black">Residencial</option>
                    <option value="Apartamento / Cobertura" className="bg-black">Apartamento / Cobertura</option>
                    <option value="Comercial / Escritório" className="bg-black">Comercial / Escritório</option>
                    <option value="Fachada / Edifício" className="bg-black">Fachada / Edifício</option>
                    <option value="Vitrine / Varejo" className="bg-black">Vitrine / Varejo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                    Área Aproximada de Vidro (m²)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 50 m²"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder-zinc-500 text-sm focus:border-white outline-none transition-colors rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-2">
                  Principal Necessidade
                </label>
                <select
                  value={formNeed}
                  onChange={(e) => setFormNeed(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white text-sm focus:border-white outline-none rounded-none"
                >
                  <option value="Controle térmico" className="bg-black">Controle térmico</option>
                  <option value="Transparência com proteção UV" className="bg-black">Transparência com proteção UV</option>
                  <option value="Privacidade" className="bg-black">Privacidade</option>
                  <option value="Proteção de pisos e mobiliário" className="bg-black">Proteção de pisos e mobiliário</option>
                  <option value="Segurança contra impactos" className="bg-black">Segurança contra impactos</option>
                  <option value="Quero orientação técnica" className="bg-black">Quero orientação técnica</option>
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-5 rounded-none bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-xl"
                >
                  <span>ENVIAR PROJETO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* FOOTER // OFFICIAL BRAND & LEGAL NOTICE */}
      <footer className="relative z-10 border-t border-white/10 py-16 px-6 sm:px-12 md:px-20 text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/winf-logo.svg" alt="WINF™" className="h-6 w-auto opacity-90 drop-shadow" />
              <span className="text-[10px] tracking-widest uppercase text-zinc-400">
                // ECOSSISTEMA DE ATIVOS AEROCORE™ | GOVERNANÇA DE DADOS
              </span>
            </div>

            <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
              <a 
                href="https://www.instagram.com/winfpartners/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>INSTAGRAM</span>
              </a>
              <span>•</span>
              <a 
                href="https://winf.com.br/catalogo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>CATÁLOGO</span>
              </a>
              <span>•</span>
              <span className="text-zinc-500">LEGAL SECURITIES (INPI_DEED)</span>
            </div>
          </div>

          <FooterSeals />

          <div className="text-[11px] text-zinc-500 leading-relaxed border-t border-white/5 pt-8">
            © 2026 WINF Partners™ | AeroCore™ Asset Ecosystem. Todos os direitos reservados. O uso não autorizado deste software ou de seus algoritmos conversacionais viola a Lei de Propriedade Industrial (Lei nº 9.279/96) e a Lei do Software (Lei nº 9.609/98).
          </div>
        </div>
      </footer>

      {/* Full-Screen Koenigsegg Mega Menu */}
</div>
  );
};

export default LandingWinfSelect;
