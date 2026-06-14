import React from 'react';
import { TickerItem } from '../hooks/useDarkData';
import { RefreshCw, Activity, ArrowUpRight } from 'lucide-react';

interface LiveTickerProps {
  tickers: TickerItem[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ tickers }) => {
  return (
    <div className="w-full py-3 border-y border-white/[0.04] bg-[#050505] relative z-10 overflow-hidden font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Ticker Title Column */}
        <div className="flex items-center gap-2 shrink-0 border-r border-white/[0.04] pr-4">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-none h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-500">
            WINF OS LIVE FEED
          </span>
        </div>

        {/* Horizontal Ticker track with fading overlay */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10" />
          
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap overflow-x-auto scrollbar-none py-0.5">
            {tickers.map((item) => (
              <div 
                key={item.id} 
                className="inline-flex items-center gap-2.5 text-sm font-bold tracking-wide bg-white/5 border border-white/[0.04] px-3 py-1.5 rounded-none hover:border-white/20 transition-all duration-300 shadow-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-white/5 px-1.5 py-0.5 border border-white/5">
                  {item.source}
                </span>
                
                <span className="font-mono text-[11px] text-neutral-400">
                  {item.orderId}
                </span>

                <span className="text-neutral-500 font-mono text-[11px]">
                  {item.volumeM2}m²
                </span>

                <span className="text-[10px] tracking-widest uppercase text-white">
                  {item.productLine}
                </span>

                <div className="flex items-center gap-0.5 text-emerald-400 font-mono text-[11px]">
                  <span>+R$ {item.yieldBRL}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>

                <span className="text-[9px] font-mono uppercase italic text-neutral-600">
                  {item.timestamp}
                </span>
              </div>
            ))}

            {/* Repeat list for smooth fallback flow */}
            {tickers.slice(0, 3).map((item) => (
              <div 
                key={`${item.id}-dup`} 
                className="inline-flex items-center gap-2.5 text-sm font-bold tracking-wide bg-white/5 border border-white/[0.04] px-3 py-1.5 rounded-none opacity-60 shadow-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-white/5 px-1.5 py-0.5 border border-white/5">
                  {item.source}
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {item.orderId}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">
                  {item.volumeM2}m²
                </span>
                <div className="flex items-center gap-0.5 text-emerald-400 font-mono text-[11px]">
                  <span>+R$ {item.yieldBRL}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Audit indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shrink-0 pl-2 text-neutral-500">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
          <span>TICKER SYNC: COMPLIANT</span>
        </div>

      </div>
    </div>
  );
};
