import { PAGE_META } from '../data/siteMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle2, ExternalLink, Globe } from 'lucide-react';
import { FooterSeals } from './FooterSeals';
import { ARTICLES } from '../data/articles';

interface LandingWinfSelectProps {
  onBack?: () => void;
  onNavigateToAerocore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCeramic?: () => void;
  onNavigateToInvisible?: () => void;
  onNavigateToDualReflect?: () => void;
  onNavigateToBlackPro?: () => void;
  onNavigateToSecurityBlinder?: () => void;
  onNavigateToMiniblindVenetian?: () => void;
  onNavigateToBlog?: (slug?: string) => void;
  onContactConsultant?: () => void;
  videoSrc?: string;
  onOpenMenu?: () => void;
}

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

// Video that only downloads/plays when scrolled into view (saves ~50MB+ on first paint)
const LazyVideo: React.FC<{ src: string; poster: string; className?: string }> = ({ src, poster, className }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} loop muted playsInline preload="none" poster={poster} src={src} className={className} />;
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
  onNavigateToMiniblindVenetian,
  onNavigateToBlog,
  onContactConsultant,
  videoSrc = '/videos/dualreflect-hero.mp4',
  onOpenMenu,
}) => {
  usePageMeta(PAGE_META['home']);

    const [scrollProgress, setScrollProgress] = useState(0);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formProjectType, setFormProjectType] = useState('Residencial');
  const [formArea, setFormArea] = useState('');
  const [formNeed, setFormNeed] = useState('Controle térmico');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Scroll progress for UI animations (no video scrubbing)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Brand showcase covers — logo over looping background video
  interface BrandCard { id: string; name: string; short?: string; category: string; logo?: string; logoClass?: string; video: string; poster: string; action?: () => void; }

  // WINF SELECT™ — linha arquitetônica (patrimônio e projetos de vidro)
  const WINF_SELECT_BRANDS: BrandCard[] = [
    { id: 'invisible', name: 'Invisible™', category: 'NANO CERÂMICA ARQUITETÔNICA', logo: '/logo-invisible.svg', logoClass: 'w-32', video: '/videos/invisible-hero.mp4', poster: '/images/invisible-poster-1.webp', action: onNavigateToInvisible },
    { id: 'blackpro', name: 'BlackPro™', category: 'PRIVACIDADE ARQUITETÔNICA', logo: '/logo-blackpro.svg', logoClass: 'w-32', video: '/videos/blackpro-hero.mp4', poster: '/images/blackpro-poster-1.webp', action: onNavigateToBlackPro },
    { id: 'dual-reflect', name: 'Dual Reflect™', category: 'CONTROLE SOLAR REFLETIVO', logo: '/logo-dual-reflect.svg', logoClass: 'w-32', video: '/videos/dualreflect-hero.mp4', poster: '/images/dualreflect-poster-1.webp', action: onNavigateToDualReflect },
    { id: 'securityblind', name: 'SecurityBlinder™', short: 'SECURITYBLINDER™', category: 'SAFETY & SECURITY FILM', video: '/videos/securityblind/sbv-impact.mp4', poster: '/images/securityblind/scene-07.webp', action: onNavigateToSecurityBlinder },
    { id: 'miniblind-venetian', name: 'Miniblind & Venetian™', category: 'PELÍCULA DECORATIVA', logo: '/images/miniblind-venetian/minibrind-venetian-logo.svg', logoClass: 'w-28', video: '/videos/mbv-figures.mp4', poster: '/images/miniblind-venetian/scene-01.webp', action: onNavigateToMiniblindVenetian },
  ];

  // AEROCORE™ — linha automotiva, aeronáutica e náutica
  const AEROCORE_BRANDS: BrandCard[] = [
    { id: 'aerocore', name: 'AeroCore™', short: 'AEROCORE™', category: 'DEFESA TÉRMICA AUTOMOTIVA', video: '/videos/aerocore/aerocore-hero.mp4', poster: '/images/aerocore-hero.webp', action: onNavigateToAerocore },
    { id: 'neoskin', name: 'NeoSkin™', short: 'NEOSKIN™', category: 'PAINT PROTECTION FILM', video: '/videos/neoskin/neoskin-hero.mp4', poster: '/images/neoskin-hero.webp', action: onNavigateToNeoskin },
    { id: 'ceramic', name: 'Ceramic Armoring™', short: 'CERAMIC™', category: 'BLINDAGEM MOLECULAR 9H', video: '/videos/1.mp4', poster: '/images/ceramic-hero.webp', action: onNavigateToCeramic },
  ];

  const renderBrandCard = (brand: BrandCard, idx: number) => (
    <motion.div
      key={brand.id}
      initial={{ opacity: 0, y: 50, scale: 0.97, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (idx % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => brand.action && brand.action()}
      className="relative group overflow-hidden rounded-none border border-white/15 hover:border-white/50 bg-black/50 shadow-2xl cursor-pointer transition-all duration-300 flex flex-col"
    >
      {/* Cover — logo over looping video */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <LazyVideo
          poster={brand.poster}
          src={brand.video}
          className="w-full h-full object-cover opacity-45 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

        {/* Centered logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          {brand.logo ? (
            <img
              width={128}
              height={48}
              src={brand.logo}
              alt={brand.name}
              className={`${brand.logoClass || 'w-32'} h-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500`}
            />
          ) : (
            <h3 className="text-xl sm:text-2xl font-light tracking-[0.2em] text-white uppercase text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-500 whitespace-nowrap">
              {brand.short}
            </h3>
          )}
        </div>
      </div>

      {/* Footer strip */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 block truncate">{brand.category}</span>
          <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">{brand.name}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-300 group-hover:text-white shrink-0 ml-3">
          <span>VER</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </motion.div>
  );

  // Pause hero video while it is off-screen (saves decode when scrolled past)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative bg-black text-white selection:bg-white/20 selection:text-white font-sans overflow-x-hidden">
      {/* 01 — HERO SECTION (FULLSCREEN VIEWPORT, background video confined to this section) */}
      <section className="relative z-10 min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden">
        {/* Hero background video + vignette (absolute, only covers the hero) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            playsInline
            muted
            loop
            autoPlay
            preload="auto"
            className="w-full h-full object-cover opacity-75 mix-blend-screen scale-105"
            src={videoSrc}
          />
          {/* Soft, Transparent Vignette */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
        </div>
        {/* Header */}
        <header className="w-full flex items-center justify-between z-30 relative">
          {/* WINF Brand Logo */}
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
            <div className="relative inline-block">
              <h1 className="text-[3.5rem] sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.18em] sm:tracking-[0.25em] md:tracking-[0.3em] text-white uppercase leading-none font-sans drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] whitespace-nowrap -mr-[0.18em] sm:-mr-[0.25em] md:-mr-[0.3em]">
                WINF
              </h1>
              <span className="absolute top-0 right-0 translate-x-full -translate-y-1/2 text-xs sm:text-base md:text-xl lg:text-2xl font-light text-zinc-300">
                TM
              </span>
            </div>
            <p className="mt-5 sm:mt-7 text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-[0.45em] sm:tracking-[0.6em] text-zinc-300 drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
              Premium Quality Windowfilm
            </p>
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

      {/* 03 — MARCAS DO ECOSSISTEMA WINF */}
      <section id="ecossistema" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/30 backdrop-blur-[1px]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            WINF ECOSYSTEM // PRODUCT LINES
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Marcas do Ecossistema
          </motion.h2>
          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.1 }} className="text-sm sm:text-base text-zinc-300 font-light max-w-2xl mb-14 drop-shadow">
            Cada marca com sua engenharia dedicada — proteção térmica, blindagem, privacidade e estética em um só ecossistema.
          </motion.p>

          {/* ── WINF SELECT™ // ARQUITETURA ── */}
          <motion.div {...fadeInLabel} className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white uppercase tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              <span className="align-top font-mono text-xs sm:text-sm text-zinc-500 tracking-[0.3em] mr-2">//</span>
              WINF SELECT™
            </h3>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-300 border border-white/15 bg-black/40 backdrop-blur-sm px-3 py-1">GLASS + HOME</span>
            <div className="h-px flex-1 min-w-[40px] bg-white/10" />
          </motion.div>
          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.05 }} className="text-xs sm:text-sm text-zinc-400 font-light max-w-2xl mb-8 drop-shadow">
            Linhas para patrimônio, fachadas e projetos de vidro — controle térmico, privacidade, segurança e estética.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WINF_SELECT_BRANDS.map((brand, idx) => renderBrandCard(brand, idx))}
          </div>

          {/* ── AEROCORE™ // AUTOMOTIVO · AERONÁUTICO · NÁUTICO ── */}
          <motion.div {...fadeInLabel} className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-20 mb-3">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white uppercase tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              <span className="align-top font-mono text-xs sm:text-sm text-zinc-500 tracking-[0.3em] mr-2">//</span>
              AEROCORE™
            </h3>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-300 border border-white/15 bg-black/40 backdrop-blur-sm px-3 py-1">AUTOMOTIVO · AERONÁUTICO · NÁUTICO</span>
            <div className="h-px flex-1 min-w-[40px] bg-white/10" />
          </motion.div>
          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.05 }} className="text-xs sm:text-sm text-zinc-400 font-light max-w-2xl mb-8 drop-shadow">
            Defesa térmica, proteção de pintura e blindagem molecular para veículos, aeronaves e embarcações.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AEROCORE_BRANDS.map((brand, idx) => renderBrandCard(brand, idx))}
          </div>
        </div>
      </section>

      {/* 04 — CTA PRINCIPAL // VIVA A EXPERIÊNCIA WINF */}
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

      {/* 05 — WINF JOURNAL // ARTIGOS */}
      <section id="journal" className="relative z-10 px-6 sm:px-12 md:px-20 py-32 border-t border-white/10 bg-black/30 backdrop-blur-[1px]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInLabel} className="text-[11px] sm:text-xs font-mono uppercase text-zinc-400 mb-6 drop-shadow">
            CONHECIMENTO // WINF JOURNAL
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            WINF Journal™
          </motion.h2>
          <motion.p {...fadeInUp} transition={{ duration: 0.9, delay: 0.1 }} className="text-sm sm:text-base text-zinc-300 font-light max-w-2xl mb-16 drop-shadow">
            Engenharia, tecnologia e design aplicados ao vidro — artigos técnicos do ecossistema WINF™.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.slice(0, 3).map((article, idx) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 50, scale: 0.97, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onNavigateToBlog && onNavigateToBlog(article.slug)}
                className="relative group overflow-hidden border border-white/15 hover:border-white/50 bg-black/50 shadow-2xl cursor-pointer transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
                  <span className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-200 border border-white/30 bg-black/60 backdrop-blur-sm px-2.5 py-1">
                    {article.tag}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-light text-white uppercase tracking-tight leading-snug mb-3 group-hover:translate-x-1 transition-transform duration-500">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>
                  <span className="mt-auto flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-300 group-hover:text-white">
                    <span>LER</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInUp} transition={{ duration: 0.9, delay: 0.2 }} className="mt-12 flex justify-center">
            <button
              onClick={() => onNavigateToBlog && onNavigateToBlog()}
              className="px-8 py-4 border border-white/30 bg-black/40 hover:bg-black/70 text-zinc-200 hover:text-white font-mono text-xs uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>VER TODOS OS ARTIGOS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 06 — CONTATO (FORMULÁRIO EDITORIAL) */}
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
                  <select aria-label="Tipo de projeto"
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
                <select aria-label="Principal necessidade"
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
              <img src="/winf-logo.svg" width={128} height={32} alt="WINF™" className="h-6 w-auto opacity-90 drop-shadow" />
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
              <span className="text-zinc-400">LEGAL SECURITIES (INPI_DEED)</span>
            </div>
          </div>

          <FooterSeals />

          <div id="politica-de-privacidade" className="text-[11px] text-zinc-400 leading-relaxed border-t border-white/5 pt-8">
            © 2026 WINF Partners™ | AeroCore™ Asset Ecosystem. Todos os direitos reservados. O uso não autorizado deste software ou de seus algoritmos conversacionais viola a Lei de Propriedade Industrial (Lei nº 9.279/96) e a Lei do Software (Lei nº 9.609/98).
          </div>
        </div>
      </footer>

</div>
  );
};

export default LandingWinfSelect;
