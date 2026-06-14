import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertCircle, ShoppingBag, Bot, Wallet, LayoutGrid, ShieldCheck, Search, ClipboardCheck, AlertTriangle, X, Globe } from 'lucide-react';
import WalletAssetLight from './WalletAssetLight';
import AuditSystem from './AuditSystem';
import WhatsAppAgentSimulator from './WhatsAppAgentSimulator';
import { ViewState } from '../types';

const HubAssetLight: React.FC<{ onNavigateToClientView?: () => void, onChangeView?: (view: ViewState) => void }> = ({ onNavigateToClientView, onChangeView }) => {
    const [currentTab, setCurrentTab] = useState<'DASHBOARD' | 'WALLET' | 'AUDIT'>('DASHBOARD');
    const [showCopilot, setShowCopilot] = useState(false);

    return (
        <div className="p-8 text-white min-h-screen bg-[#020202]">
            {/* ... (keep existing header) ... */}
            <header className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-light tracking-tighter text-winf-primary">AssetLight Hub</h1>
                    <p className="text-zinc-500 mt-1 font-mono uppercase text-xs tracking-widest">Painel Operacional do Licenciado</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {onNavigateToClientView && (
                        <button 
                            onClick={onNavigateToClientView}
                            className="px-4 py-2 bg-winf-primary/10 text-winf-primary border border-winf-primary/30 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors hover:bg-winf-primary/20"
                        >
                            <Globe size={14} /> Visão do Cliente
                        </button>
                    )}
                    <div className="flex bg-[#131314] border border-[#444746] p-1 rounded-none overflow-hidden flex-wrap">
                    <button 
                        onClick={() => setCurrentTab('DASHBOARD')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${currentTab === 'DASHBOARD' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <LayoutGrid size={14} /> Visão Geral
                    </button>
                    <button 
                        onClick={() => setCurrentTab('WALLET')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${currentTab === 'WALLET' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <Wallet size={14} /> Carteira & Caixa
                    </button>
                    <button 
                        onClick={() => setCurrentTab('AUDIT')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${currentTab === 'AUDIT' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <CheckCircle2 size={14} /> Auditoria
                    </button>
                </div>
                </div>
            </header>

            {currentTab === 'DASHBOARD' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-[#131314] border border-[#444746] p-6 rounded-none cursor-not-allowed opacity-50">
                        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Cpu size={18} /> Projetos Distribuídos</h2>
                        <p className="text-zinc-400">Projetos recebidos pela central administrativa.</p>
                    </div>
                    <div 
                        className="bg-[#131314] border border-[#444746] p-6 rounded-none cursor-pointer hover:border-winf-primary/50 transition-all transition-colors"
                        onClick={() => onChangeView && onChangeView(ViewState.MODULE_KIOSK_MODE)}
                    >
                        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><LayoutGrid size={18} className="text-winf-primary" /> Totem Kiosk Mode</h2>
                        <p className="text-zinc-400">Ativar visualizador de totem para showroom.</p>
                    </div>
                    <div 
                        onClick={() => setCurrentTab('AUDIT')}
                        className="bg-[#131314] border border-[#444746] p-6 rounded-none cursor-pointer hover:border-winf-primary/50 transition-all transition-colors"
                    >
                        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><CheckCircle2 size={18} className="text-winf-primary" /> Compliance & Performance</h2>
                        <p className="text-zinc-400">Indicadores de qualidade e auditoria de instalação.</p>
                    </div>
                    <div className="bg-[#131314] border border-[#444746] p-6 rounded-none cursor-not-allowed opacity-50">
                        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><ShoppingBag size={18} /> Reposição Blackshop</h2>
                        <p className="text-zinc-400">Fluxo de insumos de material.</p>
                    </div>
                    <div className="lg:col-span-2 bg-gradient-to-r from-winf-primary/20 to-[#0A0A0A] border border-winf-primary/30 p-6 md:p-8 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">Assistente IA Winf</h2>
                            <p className="text-zinc-400 max-w-lg">Utilize o seu copiloto de Inteligência Artificial para orçamentos, garantias e suporte técnico imediato. Se precisar, transfira para um especialista humano.</p>
                        </div>
                        <button onClick={() => setShowCopilot(true)} className="px-6 py-3 bg-winf-primary text-black font-bold uppercase tracking-widest rounded-none hover:bg-winf-primary/90 flex items-center gap-2">
                            <Bot size={18} /> Acessar Copiloto
                        </button>
                    </div>
                </div>
            ) : currentTab === 'WALLET' ? (
                <WalletAssetLight />
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AuditSystem />
                </div>
            )}
            {/* ... (keep existing copilot modal) ... */}

            {showCopilot && (
                <div className="fixed inset-0 z-50 bg-[#131314]/80 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#020202] w-full max-w-4xl max-h-screen rounded-none border border-[#444746] overflow-hidden flex flex-col relative shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b border-[#444746] bg-[#131314]">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <Bot className="text-winf-primary" /> Central de Inteligência Winf
                            </h2>
                            <button onClick={() => setShowCopilot(false)} className="p-2 hover:bg-white/10 rounded-none transition-colors">
                                <X size={20} className="text-zinc-500 hover:text-white" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                             <WhatsAppAgentSimulator />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HubAssetLight;
