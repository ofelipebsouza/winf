import { PAGE_META } from '../data/siteMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FooterSeals } from './FooterSeals';
import {
  ArrowRight,
  X,
  Play,
  Image as ImageIcon,
  Film,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import KoenigseggMenu from './KoenigseggMenu';

export interface LandingWinfHomeProps {
  onNavigateToWinfSelect?: () => void;
  onNavigateToAeroCore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToCeramic?: () => void;
  onOpenMenu?: () => void;
}

interface TabModel {
  id: string;
  tabLabel: string;
  lines: string[];
  placeholderLabel: string;
  action: () => void;
}

// ============================================================================
// SLEEK KOENIGSEGG-STYLE MEDIA PLACEHOLDER COMPONENT
// ============================================================================
interface MediaPlaceholderProps {
  type?: 'video' | 'image';
  label: string;
  dimension?: string;
  category?: string;
  className?: string;
  minHeight?: string;
}

const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  type = 'image',
  label,
  dimension = '1920 × 1080',
  category = 'MEDIA_ASSET',
  className = '',
  minHeight = 'min-h-[420px]'
}) => {
  usePageMeta(PAGE_META['winf-home']);

  return (
    <div
      className={`relative w-full ${minHeight} bg-[#0c0c0e] border border-white/15 rounded-none overflow-hidden flex flex-col justify-between p-6 sm:p-8 select-none group transition-all duration-500 hover:border-white/30 ${className}`}
    >
      {/* Background Blueprint Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Subtle Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      {/* Top Metadata Row */}
      <div className="w-full flex items-center justify-between z-10 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
        <div className="flex items-center gap-2">
          {type === 'video' ? (
            <Film className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="text-zinc-300 font-semibold">{type.toUpperCase()} PLACEHOLDER</span>
        </div>
        <span className="border border-white/10 px-2 py-0.5 bg-black/40 text-zinc-400">
          {category}
        </span>
      </div>

      {/* Center Technical Graphic / Icon Badge */}
      <div className="my-auto z-10 flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border border-white/20 bg-white/[0.02] flex items-center justify-center text-white/80 group-hover:border-white/50 group-hover:scale-105 group-hover:text-white transition-all duration-300 shadow-2xl backdrop-blur-sm">
          {type === 'video' ? (
            <Play className="w-6 h-6 fill-white/10 text-white translate-x-0.5" />
          ) : (
            <Layers className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="space-y-1 max-w-lg">
          <div className="text-sm sm:text-base md:text-lg font-sans font-bold uppercase tracking-widest text-white">
            {label}
          </div>
          <div className="text-[10px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
            TARGET_RES // {dimension}
          </div>
        </div>
      </div>

      {/* Bottom Technical Crosshairs & Footer */}
      <div className="w-full flex items-center justify-between z-10 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 border-t border-white/5 pt-3">
        <span>[ + ] 0.00° LATENCY</span>
        <span>WINF_OS_MEDIA_CONTAINER</span>
      </div>
    </div>
  );
};

export const LandingWinfHome: React.FC<LandingWinfHomeProps> = ({
onNavigateToWinfSelect,
  onNavigateToAeroCore,
  onNavigateToNeoskin,
  onNavigateToCeramic,
  onOpenMenu,
}) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showCookieNotice, setShowCookieNotice] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('WINF OS™ // Concierge Oficial');
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formInterest, setFormInterest] = useState('AEROCORE™ // Window Film');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Koenigsegg Model Range (Mapped to WINF Brand Range)
  const TABS_DATA: TabModel[] = [
    {
      id: 'aerocore',
      tabLabel: "AEROCORE™",
      lines: ["Performance without", "compromise"],
      placeholderLabel: "AEROCORE™ // AUTOMOTIVE THERMAL FILM (TRACK SHOT)",
      action: () => onNavigateToAeroCore?.()
    },
    {
      id: 'neoskin',
      tabLabel: "NEOSKIN™ PPF",
      lines: ["The driver’s", "dream armor"],
      placeholderLabel: "NEOSKIN™ // BALLISTIC SELF-HEALING PPF",
      action: () => onNavigateToNeoskin?.()
    },
    {
      id: 'winf-select',
      tabLabel: "WINF SELECT™",
      lines: ["Worlds first", "Mega glass architecture"],
      placeholderLabel: "WINF SELECT™ // ARCHITECTURAL THERMAL GLASS FACADE",
      action: () => onNavigateToWinfSelect?.()
    },
    {
      id: 'ceramic',
      tabLabel: "CERAMIC ARMORING™",
      lines: ["Road legal", "9H Track legend"],
      placeholderLabel: "CERAMIC ARMORING™ // 9H MOLECULAR VITRIFICATION",
      action: () => onNavigateToCeramic?.()
    },
    {
      id: 'blackshop',
      tabLabel: "BLACKSHOP™",
      lines: ["Stealth shadow", "Deepest dark made"],
      placeholderLabel: "BLACKSHOP™ // STEALTH PRIVACY & DEEP DARK",
      action: () => onNavigateToWinfSelect?.()
    },
    {
      id: 'invisible',
      tabLabel: "INVISIBLE™",
      lines: ["100% Clarity", "Unnoticed thermal shield"],
      placeholderLabel: "INVISIBLE™ // 100% CLEAR THERMAL BARRIER",
      action: () => onNavigateToWinfSelect?.()
    },
    {
      id: 'dual-reflect',
      tabLabel: "DUAL-REFLECT™",
      lines: ["Mirrored external", "Crystal night vision"],
      placeholderLabel: "DUAL-REFLECT™ // MIRRORED EXTERNAL SOLAR CONTROL",
      action: () => onNavigateToWinfSelect?.()
    }
  ];

  const currentTab = TABS_DATA[activeTabIndex] || TABS_DATA[0];

  const handleOpenContact = (subject?: string, interest?: string) => {
    if (subject) setContactSubject(subject);
    if (interest) setFormInterest(interest);
    setIsContactModalOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const text = `*SOLICITAÇÃO DE ATENDIMENTO // WINF OS™*\n\n` +
      `*Nome:* ${formName}\n` +
      `*Contato / WhatsApp:* ${formContact}\n` +
      `*Interesse:* ${formInterest}`;
    
    setTimeout(() => {
      window.open(`https://wa.me/5513997815375?text=${encodeURIComponent(text)}`, '_blank');
    }, 500);
  };

  return (
    <div className="relative bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-white/20 selection:text-white overflow-x-hidden min-h-screen">
      
      {/* ========================================================================= */}
      {/* KOENIGSEGG N1 MAIN NAVIGATION */}
      {/* ========================================================================= */}
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none transition-all duration-300">
        <div className="w-full px-6 sm:px-12 md:px-16 py-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px]">
          
          {/* Logo Insider */}
          <div className="flex items-center gap-3">
            <a 
              href="/"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <img 
                src="/winf-logo.svg" width={128} height={32} 
                alt="Koenigsegg / WINF" 
                className="h-7 sm:h-8 w-auto object-contain brightness-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              />
            </a>
          </div>

          {/* Navigation Options Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenMenu?.()}
              className="relative p-2.5 flex items-center justify-center cursor-pointer group focus:outline-none"
              aria-label="Open menu"
            >
              {/* Koenigsegg Two-Line / Close Bar Icon */}
              <div className="w-8 h-4 flex flex-col justify-between items-end">
                <span 
                  className={`block h-[1.5px] bg-white transition-all duration-300 ${'w-8 group-hover:w-8'
                  }`} 
                />
                <span 
                  className={`block h-[1.5px] bg-white transition-all duration-300 ${'w-5 group-hover:w-8'
                  }`} 
                />
              </div>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* KOENIGSEGG O8 MEGA MENU */}
        {/* ========================================================================= */}
</nav>

      {/* ========================================================================= */}
      {/* 01 — C1 HEADER MAIN (FULLSCREEN VIDEO / IMAGE PLACEHOLDER BANNER) */}
      {/* ========================================================================= */}
      <header id="c1-header-main-1" className="relative h-screen w-full flex flex-col justify-end p-6 sm:p-12 md:p-16 select-none overflow-hidden">
        
        {/* Fullscreen Video / Image Media Placeholder */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <MediaPlaceholder
            type="video"
            label="HERO VIDEO / CINEMATIC HYPERCAR REEL"
            dimension="1920 × 1400 (4K UHD)"
            category="MAIN_HERO_CINEMATIC"
            className="w-full h-full border-none"
            minHeight="h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50 z-10 pointer-events-none" />

        {/* Header Content Overlay */}
        <div className="w-full max-w-7xl mx-auto z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
          
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-[0.35em] text-zinc-400 uppercase block">
              AEROCORE
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif italic text-white font-normal drop-shadow-2xl">
              WINF absolut
            </h1>
          </div>

          {/* Koenigsegg CTA Button with Underline and Arrow Slide */}
          <nav className="cta-wrapper">
            <button
              onClick={() => onNavigateToAeroCore?.()}
              className="group relative inline-flex items-center gap-3 px-6 py-3 border border-white/30 hover:border-white bg-black/40 hover:bg-white text-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-[0.25em] cursor-pointer shadow-2xl backdrop-blur-md"
            >
              <span>Discover</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </nav>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 02 — C4 HORIZONTAL TABS (KOENIGSEGG MASKED IMAGE & MULTILINE TITLES) */}
      {/* ========================================================================= */}
      <section id="c4-horizontal-tabs-4" className="relative w-full min-h-screen bg-[#09090b] flex flex-col justify-between p-6 sm:p-12 md:p-16 border-t border-white/10 overflow-hidden">
        
        {/* Component Navigation (Horizontal Tabs) */}
        <div className="w-full max-w-7xl mx-auto z-20 space-y-10">
          
          <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto pb-4 border-b border-white/10 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 custom-scrollbar">
            {TABS_DATA.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabIndex(idx)}
                className={`whitespace-nowrap transition-colors cursor-pointer pb-2 relative ${
                  activeTabIndex === idx ? 'text-white font-semibold' : 'hover:text-zinc-300'
                }`}
              >
                {tab.tabLabel}
                {activeTabIndex === idx && (
                  <motion.div
                    layoutId="underline-active-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content (Multiline Heading + Discover More CTA) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black uppercase text-white tracking-tight leading-[0.92]">
              {currentTab.lines.map((line, lIdx) => (
                <div key={lIdx} className="line">
                  {line}
                </div>
              ))}
            </h2>

            <button
              onClick={currentTab.action}
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 border border-white hover:bg-white text-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-[0.25em] cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <span>Discover more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Visual Masked Image Display Placeholder */}
        <div className="w-full max-w-7xl mx-auto my-auto py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="relative shadow-2xl"
            >
              <MediaPlaceholder
                type="image"
                label={currentTab.placeholderLabel}
                dimension="1920 × 1000"
                category={`MODEL_${currentTab.id.toUpperCase()}`}
                minHeight="min-h-[500px]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Component CTA (Explore All Models) */}
        <div className="w-full max-w-7xl mx-auto border-t border-white/10 pt-6 flex items-center justify-between text-xs font-mono uppercase text-zinc-400 z-20">
          <button
            onClick={() => onNavigateToAeroCore?.()}
            className="group flex flex-col cursor-pointer hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              Explore past and present models
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="h-[1px] w-0 group-hover:w-full bg-white transition-all duration-300 mt-1" />
          </button>

          <span className="text-[10px] text-zinc-400">
            07 HOMOLOGATED LINES
          </span>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 03 — C6 FEATURE BLOCK (SPECIAL LAYOUT: IN-HOUSE INNOVATIONS) */}
      {/* ========================================================================= */}
      <section id="c6-feature-block-5" className="relative w-full py-28 px-6 sm:px-12 md:px-16 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left / Top Image Wrapper Placeholder */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <MediaPlaceholder
              type="image"
              label="PRECISION COMPONENT // SPUTTERING CORE & NANO CERAMIC MATRIX"
              dimension="1020 × 644"
              category="IN_HOUSE_HARDWARE"
              minHeight="min-h-[400px]"
            />
          </div>

          {/* Right / Top Text & CTA */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 lg:pl-8">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
              Technological<br />Achievements
            </p>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black uppercase text-white tracking-tight leading-[0.92]">
              <div>In-house</div>
              <div>Innovations</div>
            </h1>

            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xl">
              Staying ahead of the curve in a very competitive thermal & surface protection landscape in true WINF fashion, we are offering our ground-breaking components to visionary clientele. Sharing this technology enables WINF to deliver uncompromising protection and efficiency.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleOpenContact('In-House Innovations', 'Discover our solutions')}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 border border-white hover:bg-white text-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-[0.25em] cursor-pointer"
              >
                <span>Discover our solutions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — C6 FEATURE BLOCK (STANDARD LAYOUT: WHY WE DO WHAT WE DO) */}
      {/* ========================================================================= */}
      <section id="c6-feature-block-15" className="relative w-full py-28 px-6 sm:px-12 md:px-16 bg-[#09090b] border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Image Left Placeholder */}
          <div className="lg:col-span-5">
            <MediaPlaceholder
              type="image"
              label="ARTISAN CRAFTSMANSHIP & LABORATORY APPLICATION"
              dimension="620 × 900"
              category="ABOUT_US_MANUFACTURING"
              minHeight="min-h-[500px]"
            />
          </div>

          {/* Content Right */}
          <div className="lg:col-span-7 space-y-6 lg:pl-8">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
              About us
            </p>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black uppercase text-white tracking-tight leading-[0.92]">
              <div>Why we</div>
              <div>Do what</div>
              <div>We do</div>
            </h2>

            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xl">
              Every single detail of a WINF ecosystem solution is measured against our continuing goal: to enhance vehicle & architectural performance.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleOpenContact('About Us - Why We Do What We Do', 'About us')}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 border border-white hover:bg-white text-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-[0.25em] cursor-pointer"
              >
                <span>Discover more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — C6 FEATURE BLOCK (FLIPPED LAYOUT: DELIVERING ON A SINGULAR VISION) */}
      {/* ========================================================================= */}
      <section id="c6-feature-block-16" className="relative w-full py-28 px-6 sm:px-12 md:px-16 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Content Left */}
          <div className="lg:col-span-7 space-y-6 lg:pr-8 order-2 lg:order-1">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">
              Our history
            </p>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black uppercase text-white tracking-tight leading-[0.92]">
              <div>Delivering on</div>
              <div>A singular</div>
              <div>Vision</div>
            </h2>

            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xl">
              From our origins in high-performance solar protection to our advanced nanomaterial laboratories, WINF was born with a singular mission: to protect the uncompromising.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleOpenContact('Our History', 'Our history')}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 border border-white hover:bg-white text-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-[0.25em] cursor-pointer"
              >
                <span>Discover more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Image Right Placeholder */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <MediaPlaceholder
              type="image"
              label="HIGH-PERFORMANCE TRACK ACTION & ARCHITECTURAL MONUMENT"
              dimension="620 × 900"
              category="HISTORY_SINGULAR_VISION"
              minHeight="min-h-[500px]"
            />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 — N2 FOOTER (THE SHOW MUST GO ON + MULTI-COLUMN KOENIGSEGG FOOTER) */}
      {/* ========================================================================= */}
      <footer className="relative w-full py-28 px-6 sm:px-12 md:px-16 bg-black border-t border-white/10 text-xs font-mono">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Top Title & Links Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* The Show Must Go On Big Title */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-sans font-black uppercase text-white tracking-tight leading-[0.88]">
                <div>The</div>
                <div>Show</div>
                <div>Must</div>
                <div>Go On</div>
              </h2>

              <div className="flex items-center gap-4 pt-4">
                <img src="/winf-logo.svg" width={128} height={32} alt="WINF Shield" className="h-6 w-auto opacity-80" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest border-l border-white/20 pl-3">
                  ISO 9001 CERTIFICATION
                </span>
              </div>
            </div>

            {/* Links Wrapper */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 uppercase tracking-widest text-zinc-400">
              
              <div className="space-y-4">
                <div className="text-white font-bold tracking-widest">MEGACARS</div>
                <ul className="space-y-3 text-zinc-400 text-[11px]">
                  <li><button onClick={onNavigateToAeroCore} className="hover:text-white cursor-pointer transition-colors">AEROCORE™</button></li>
                  <li><button onClick={onNavigateToNeoskin} className="hover:text-white cursor-pointer transition-colors">NEOSKIN™</button></li>
                  <li><button onClick={onNavigateToWinfSelect} className="hover:text-white cursor-pointer transition-colors">WINF SELECT™</button></li>
                  <li><button onClick={onNavigateToCeramic} className="hover:text-white cursor-pointer transition-colors">CERAMIC ARMORING™</button></li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="text-white font-bold tracking-widest">TECHNOLOGY</div>
                <ul className="space-y-3 text-zinc-400 text-[11px]">
                  <li><button onClick={onNavigateToWinfSelect} className="hover:text-white cursor-pointer transition-colors">BLACKSHOP™</button></li>
                  <li><button onClick={onNavigateToWinfSelect} className="hover:text-white cursor-pointer transition-colors">INVISIBLE™</button></li>
                  <li><button onClick={onNavigateToWinfSelect} className="hover:text-white cursor-pointer transition-colors">DUAL-REFLECT™</button></li>
                  <li><span className="text-zinc-400">NANOCERÂMICA</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="text-white font-bold tracking-widest">SERVICES</div>
                <ul className="space-y-3 text-zinc-400 text-[11px]">
                  <li><button onClick={() => handleOpenContact('Dealer locator')} className="hover:text-white cursor-pointer transition-colors">DEALER LOCATOR</button></li>
                  <li><button onClick={() => handleOpenContact('Shop')} className="hover:text-white cursor-pointer transition-colors">SHOP</button></li>
                  <li><button onClick={() => handleOpenContact('Contact')} className="hover:text-white cursor-pointer transition-colors">CONTACT</button></li>
                  <li><button onClick={() => handleOpenContact('Careers')} className="hover:text-white cursor-pointer transition-colors">CAREERS</button></li>
                </ul>
              </div>

            </div>

          </div>

          {/* Social Links Bar */}
          <div className="flex items-center gap-6 text-zinc-400 border-t border-white/10 pt-8">
            <a href="https://www.instagram.com/winfpartners/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://x.com/winfpartners" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X (Twitter)">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* TODO: Replace "#" with real Facebook URL */}
            <a href="#" data-pending="true" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* TODO: Replace "#" with real YouTube URL */}
            <a href="#" data-pending="true" className="hover:text-white transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            {/* TODO: Replace "#" with real LinkedIn URL */}
            <a href="#" data-pending="true" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>

          {/* Seals & Logo (small & subtle) */}
          <div className="flex justify-center pt-8">
            <FooterSeals />
          </div>

          {/* Small Print Copyright & Tertiary Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-[10px] text-zinc-400 tracking-wider uppercase border-t border-white/5 pt-6">
            <p>Copyright © since 1994 – WINF Automotive & Architectural Ecosystem AB</p>
            <div className="flex items-center gap-6">
              <a href="#" data-pending="true" className="hover:text-zinc-400 transition-colors">Sitemap</a>
              <a href="#" data-pending="true" className="hover:text-zinc-400 transition-colors">Cookie Policy</a>
              <a href="#" data-pending="true" className="hover:text-zinc-400 transition-colors">Legal Links</a>
              <a href="#" data-pending="true" className="hover:text-zinc-400 transition-colors">Investor relations</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* N3 COOKIE NOTICE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCookieNotice && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 w-full z-40 bg-zinc-950/95 border-t border-white/10 px-6 py-4 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <p className="text-zinc-400 text-center sm:text-left">
                We use cookies on this website to enhance the experience, for more information read our <span className="underline text-white">privacy policy</span>.
              </p>
              <button
                onClick={() => setShowCookieNotice(false)}
                className="group inline-flex items-center gap-3 px-6 py-2.5 border border-white hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Allow Cookies</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CONTACT MODAL */}
      {/* ========================================================================= */}
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
                WINF OS™ // CONCIERGE OFICIAL
              </span>
              <h3 className="text-2xl font-light text-white uppercase tracking-tight mb-6">
                {contactSubject}
              </h3>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-lg text-white font-medium mb-2">Solicitação Preparada</h3>
                  <p className="text-xs text-zinc-400">Você será redirecionado para o WhatsApp oficial de atendimento.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">WhatsApp / Telefone *</label>
                    <input
                      type="text"
                      required
                      placeholder="(DDD) 99999-9999"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-300 block mb-1">Interesse / Produto *</label>
                    <select aria-label="Área de interesse"
                      value={formInterest}
                      onChange={(e) => setFormInterest(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-white/15 rounded-none text-sm text-white focus:border-white outline-none font-mono"
                    >
                      <option value="AEROCORE™ // Window Film Automotivo">AEROCORE™ // Window Film Automotivo</option>
                      <option value="NEOSKIN™ // PPF Militar">NEOSKIN™ // PPF Militar</option>
                      <option value="WINF SELECT™ // Arquitetura">WINF SELECT™ // Arquitetura</option>
                      <option value="CERAMIC ARMORING™ // Blindagem 9H">CERAMIC ARMORING™ // Blindagem 9H</option>
                      <option value="BLACKSHOP™ // Stealth & Privacidade">BLACKSHOP™ // Stealth & Privacidade</option>
                      <option value="INVISIBLE™ // Térmica Transparente">INVISIBLE™ // Térmica Transparente</option>
                      <option value="DUAL-REFLECT™ // Espelhada">DUAL-REFLECT™ // Espelhada</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black hover:bg-zinc-200 text-xs font-mono uppercase tracking-[0.25em] font-semibold transition-all cursor-pointer mt-4"
                  >
                    CONTINUAR NO WHATSAPP
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

export default LandingWinfHome;
