import React from 'react';
import { motion } from 'motion/react';
import { useWinf } from '../contexts/WinfContext';
import { ViewState } from '../types';

// Let's provide both:
// 1. The literal plain HS string template EXACTLY as the user specified, so any dynamic evaluation works
export const getLegacyGlobalHeaderHtml = (): string => {
  return `
  <header class="winf-header">
      <div class="logo-aero">AEROCORE™</div>
      <nav class="nav-links">
          <a href="/dashboard">DarkPool</a>
          <a href="/blackshop">B2B</a>
          <a href="/academy">Academy</a>
      </nav>
      <div class="status-indicator">● OPERACIONAL</div>
  </header>
  <style>
      .winf-header { 
          display: flex; justify-content: space-between; 
          align-items: center;
          padding: 20px; background: #0a0a0a; color: #fff;
          border-bottom: 1px solid #333; font-family: 'Inter', sans-serif;
      }
      .logo-aero {
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #fff;
      }
      .nav-links {
          display: flex;
          gap: 24px;
      }
      .nav-links a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.2s ease;
      }
      .nav-links a:hover {
          color: #FFFFFF;
      }
      .status-indicator {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #FFFFFF;
          letter-spacing: 0.1em;
          animation: pulse 2s infinite;
      }
      @media (max-width: 768px) { .nav-links { display: none; } }
  </style>
  `;
};

// 2. A highly responsive, premium React implementation structured with Tailwind CSS and full SPA navigation
interface GlobalHeaderProps {
  onNavigate?: (view: ViewState) => void;
  activeItem?: 'dashboard' | 'blackshop' | 'academy' | 'none';
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onNavigate, activeItem = 'none' }) => {
  const { isOnline } = useWinf();

  const handleLinkClick = (e: React.MouseEvent, target: 'dashboard' | 'blackshop' | 'academy') => {
    e.preventDefault();
    if (!onNavigate) return;

    if (target === 'dashboard') {
      onNavigate(ViewState.DASHBOARD_WINF);
    } else if (target === 'blackshop') {
      onNavigate(ViewState.MODULE_BLACKSHOP);
    } else if (target === 'academy') {
      onNavigate(ViewState.MODULE_ACADEMY);
    }
  };

  return (
    <header className="winf-header flex justify-between items-center px-6 py-5 bg-[#131314] text-white border-b border-[#444746] font-sans z-50 sticky top-0 backdrop-blur-md">
      {/* Brand Logo with pulse core */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-cyan-500 rounded-none shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-pulse" />
        <span className="logo-aero font-black text-sm tracking-[0.25em] text-white uppercase select-none">
          AEROCORE™
        </span>
      </div>

      {/* Interactive Hub Nav Links */}
      <nav className="nav-links hidden md:flex items-center gap-8">
        <a 
          href="/dashboard" 
          onClick={(e) => handleLinkClick(e, 'dashboard')}
          className={`text-xs font-mono uppercase tracking-[0.15em] transition-all hover:text-zinc-300 font-bold font-bold ${
            activeItem === 'dashboard' ? 'text-zinc-300 font-bold border-b border-white/30 pb-1' : 'text-white/60'
          }`}
        >
          DarkPool
        </a>
        <a 
          href="/blackshop" 
          onClick={(e) => handleLinkClick(e, 'blackshop')}
          className={`text-xs font-mono uppercase tracking-[0.15em] transition-all hover:text-zinc-300 font-bold font-bold ${
            activeItem === 'blackshop' ? 'text-zinc-300 font-bold border-b border-white/30 pb-1' : 'text-white/60'
          }`}
        >
          B2B
        </a>
        <a 
          href="/academy" 
          onClick={(e) => handleLinkClick(e, 'academy')}
          className={`text-xs font-mono uppercase tracking-[0.15em] transition-all hover:text-zinc-300 font-bold font-bold ${
            activeItem === 'academy' ? 'text-zinc-300 font-bold border-b border-white/30 pb-1' : 'text-white/60'
          }`}
        >
          Academy
        </a>
      </nav>

      {/* Operations Indicator Hub */}
      <div className="flex items-center gap-2">
        <span className="status-indicator text-[11px] font-mono font-bold text-zinc-300 font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/10 px-3 py-1.5 border border-[#444746]">
          <span className="inline-block w-1.5 h-1.5 rounded-none bg-white animate-ping" />
          ● OPERACIONAL
        </span>
      </div>

      {/* Legacy CSS injection within style tag to satisfy exact design system patterns if extracted */}
      <style>{`
        .logo-aero {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
        }
        .status-indicator {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </header>
  );
};

export default GlobalHeader;
