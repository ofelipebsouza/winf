import React from 'react';
import { LayoutDashboard, TrendingUp, Users, Shield, Cpu, Target, CheckCircle2, Lock, Database, FileSignature } from 'lucide-react';
import { ViewState } from '../types';

interface HubAdminProps {
  onChangeView?: (view: ViewState) => void;
}

const HubAdmin: React.FC<HubAdminProps> = ({ onChangeView }) => {
  return (
    <div className="p-8 text-white min-h-screen bg-[#020202]">
      <header className="flex justify-between items-end mb-10 border-b border-[#444746] pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tighter">
            Winf <span className="text-winf-primary">Command</span>
          </h1>
          <p className="text-zinc-500 mt-1 font-mono uppercase text-xs tracking-widest">Gestão Integrada do Ecossistema</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => onChangeView?.(ViewState.EXECUTIVE_CLOSING)}
                className="px-4 py-2 bg-winf-primary/10 hover:bg-winf-primary/20 border border-winf-primary/50 text-winf-primary rounded-none font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all">
                <Lock size={14} /> WINF VIP CLOSING (AUDIT)
            </button>
            <button 
                onClick={() => onChangeView?.(ViewState.DATA_CORE_STRUCTURING)}
                className="px-4 py-2 bg-winf-primary/10 hover:bg-winf-primary/20 border border-winf-primary/50 text-winf-primary rounded-none font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all">
                <Database size={14} /> DATA CORE (INDEX)
            </button>
            <button 
                onClick={() => onChangeView?.(ViewState.PORTFOLIO_ASSETS)}
                className="px-4 py-2 bg-winf-primary/10 hover:bg-winf-primary/20 border border-winf-primary/50 text-winf-primary rounded-none font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all">
                <LayoutDashboard size={14} /> PORTFÓLIO E EXPANSÃO
            </button>
            <button 
                onClick={() => onChangeView?.(ViewState.STRATEGIC_PRESENTATION)}
                className="px-4 py-2 bg-winf-primary/10 hover:bg-winf-primary/20 border border-winf-primary/50 text-winf-primary rounded-none font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all">
                <Shield size={14} /> APRESENTAÇÃO ESTRATÉGICA
            </button>
            <button 
                onClick={() => onChangeView?.(ViewState.EXECUTIVE_DOCS)}
                className="px-4 py-2 bg-winf-primary/10 hover:bg-winf-primary/20 border border-winf-primary/50 text-winf-primary rounded-none font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all">
                <FileSignature size={14} /> CADERNOS EXECUTIVOS
            </button>
            <div className="px-4 py-2 bg-emerald-950/30 border border-emerald-900/50 rounded-none text-emerald-500 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} /> Sistema Online 24/7
            </div>
        </div>
      </header>
      
      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Faturamento Consolidado', value: 'R$ 842.500', trend: '+12.4%', icon: TrendingUp },
            { label: 'Unidades Ativas', value: '14/15', trend: 'Monitoradas', icon: Cpu },
            { label: 'Projetos em Análise', value: '38', trend: 'Pendente', icon: Target },
            { label: 'Patrimônio Consolidado', value: 'R$ 4.2M', trend: 'Meta', icon: Shield },
          ].map((m, i) => (
              <div key={i} className="bg-[#131314] border border-[#444746] p-5 rounded-none">
                  <div className="text-zinc-500 flex justify-between items-center mb-3">
                    <span className="text-xs uppercase tracking-wider font-mono">{m.label}</span>
                    <m.icon size={16} />
                  </div>
                  <div className="text-2xl font-mono tracking-tight font-medium">{m.value}</div>
                  <div className="text-xs text-zinc-600 mt-1 font-mono">{m.trend}</div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Architect Demand Hub */}
        <div className="lg:col-span-2 bg-[#131314] border border-[#444746] p-6 rounded-none">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Target size={18} className="text-winf-primary" />
                ArchiHub: Projetos Pendentes
            </h2>
            <div className="space-y-3">
                {[
                    { architect: 'Arq. Mariana Silva', project: 'Residência Alpha', status: 'Processar' },
                    { architect: 'Studio K - Arq. Lucas', project: 'Edifício Corporate', status: 'Aguardar' },
                    { architect: 'Arq. Gabriela Rocha', project: 'Interior Vila Verde', status: 'Processar' },
                ].map((demand, i) => (
                    <div key={i} className="bg-[#0F0F0F] p-4 flex justify-between items-center rounded-none border border-[#444746] hover:border-[#444746] transition-all">
                        <div>
                            <p className="text-sm font-medium">{demand.project}</p>
                            <p className="text-xs text-zinc-500 font-mono">{demand.architect}</p>
                        </div>
                        <button className="px-4 py-1.5 bg-winf-primary text-black rounded-none text-[10px] font-bold uppercase tracking-widest hover:bg-winf-primary/80">
                            {demand.status}
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Operational Nodes */}
        <div className="bg-[#131314] border border-[#444746] p-6 rounded-none">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Cpu size={18} className="text-blue-500" />
                Status da Rede: Unidades Operacionais
            </h2>
            <div className="space-y-4">
               {[
                   { name: 'Node SP - Leste', status: 'Online', load: '85%' },
                   { name: 'Node RJ - Zona Sul', status: 'Online', load: '40%' },
                   { name: 'Node Curitiba - PR', status: 'Offline', load: '0%' },
               ].map((node, i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-[#444746] pb-2">
                       <span className="text-zinc-300 font-mono">{node.name}</span>
                       <span className={`font-mono text-xs ${node.status === 'Online' ? 'text-emerald-500' : 'text-red-500'}`}>{node.status}</span>
                   </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HubAdmin;