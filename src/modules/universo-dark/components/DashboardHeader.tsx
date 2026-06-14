import React from 'react';
import { Shield, Landmark, Activity, Layers } from 'lucide-react';
import { DarkMetrics } from '../hooks/useDarkData';

interface DashboardHeaderProps {
  metrics: DarkMetrics;
  onNavigateTab: (tab: 'hub' | 'painel' | 'jornada' | 'roadmap' | 'transparencia' | 'celulas' | 'dashboard' | 'formalizacao' | 'doc_vault') => void;
  activeTab: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  metrics,
  onNavigateTab,
  activeTab
}) => {
  
  return (
    <div className="w-full bg-[#131314]/60 backdrop-blur-3xl transition-colors duration-300 py-6 px-6 lg:px-8 font-sans border-b border-[#444746]/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative pb-6 border-b border-[#444746]/60">
        
        {/* Core title and metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 px-3 py-1.5 rounded-none border border-[#444746]/60 bg-white/[0.02]">
              WINFPartners Holding
            </span>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.1em] text-white">
              <Shield className="w-3.5 h-3.5" />
              <span>Verificado • Auditoria Contínua</span>
            </div>
          </div>
          <div className="border-l-4 border-zinc-600 pl-4 py-1 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-widest text-white leading-tight uppercase font-sans break-words hyphens-auto">
              Painel Executivo <br className="hidden md:block"/> Operacional
            </h1>
          </div>
          <p className="text-[11px] mt-4 text-neutral-400 max-w-2xl font-medium tracking-widest uppercase mb-1">
            Gestão Consolidada de Ativos e Metas
          </p>
        </div>

        {/* Action center (Theme toggle & audit certification) */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center justify-center gap-3 px-5 py-2.5 bg-black/40 border border-[#444746]/60 text-white backdrop-blur-md rounded-none">
            <span className="w-1.5 h-1.5 rounded-none bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase font-mono">SISTEMA ONLINE</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Ribbon */}
      <div className="max-w-7xl mx-auto flex gap-6 mt-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'hub', label: 'Overview Operacional' },
          { id: 'painel', label: 'Territórios & Cotas' },
          { id: 'jornada', label: 'Evolução de Ocupação' },
          { id: 'transparencia', label: 'Governança & SEC' },
          { id: 'celulas', label: 'Board W12' },
          { id: 'roadmap', label: 'Estágios M&A' },
          { id: 'dashboard', label: 'Modelagem (Sim)' },
          { id: 'doc_vault', label: 'Data Room Confidencial' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigateTab(tab.id as any)}
              className={`pb-3 text-[11px] font-medium uppercase tracking-[0.15em] whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isSelected 
                  ? 'border-white text-white' 
                  : 'border-transparent text-neutral-500 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
