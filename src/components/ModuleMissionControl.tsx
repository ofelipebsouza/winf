
import React, { useState } from 'react';
import { 
  Target, 
  MapPin, 
  Zap, 
  Search, 
  CheckCircle2, 
  Clock, 
  Globe, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Briefcase,
  AlertTriangle,
  FileText,
  Hammer
} from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { motion } from 'framer-motion';

const ModuleMissionControl: React.FC = () => {
    const { user, leads, installations, quotes, transactions } = useWinf();
    const [activeTab, setActiveTab] = useState<'overview' | 'dispatch' | 'alerts'>('overview');

    // Mocks / Derived data for Unit Monitor
    const unitLeads = leads.filter(l => l.user_id === user?.id || !l.user_id); // Unit contextual leads
    const activeInstallations = installations.filter(i => i.status !== 'completed');
    const pendingQuotes = quotes.filter(q => q.status === 'Pendente' || q.status === 'Enviado');
    const monthlyRevenue = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : 0), 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#444746] pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-zinc-500 mb-4 border border-[#444746] px-3 py-1.5 uppercase bg-[#121212] rounded-none">
                        <span className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse"></span> Unidade Ativa
                    </div>
                    <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight uppercase">
                        Monitor de <span className="font-bold text-white/90">Unidade</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2 font-mono tracking-wide">Controle de Operações Locais WINF™</p>
                </div>
                <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-none border border-[#444746]">
                    {['overview', 'dispatch', 'alerts'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab === 'overview' ? 'Visão Geral' : tab === 'dispatch' ? 'Expedição' : 'Alertas'}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                {activeTab === 'overview' && (
                    <>
                        {/* Key Metrics - Crypto Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Faturamento Mensal', value: `R$ ${monthlyRevenue.toLocaleString('pt-BR')}`, icon: TrendingUp, trend: '+12.5%', isUp: true },
                                { label: 'Novas Oportunidades', value: unitLeads.length, icon: Target, trend: '+4', isUp: true },
                                { label: 'Orçamentos Ativos', value: pendingQuotes.length, icon: FileText, trend: '-2', isUp: false },
                                { label: 'Instalações em Curso', value: activeInstallations.length, icon: Hammer, trend: 'Estável', isUp: true }
                            ].map((stat, idx) => (
                                <motion.div key={idx} variants={itemVariants} className="bg-[#131314] border border-[#444746] p-6 rounded-none hover:border-[#444746] transition-colors group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-[0.08] transition-opacity">
                                        <stat.icon size={64} />
                                    </div>
                                    <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <stat.icon size={14} className="text-zinc-400" /> {stat.label}
                                    </h3>
                                    <p className="text-3xl font-mono tracking-tighter text-white mb-2">{stat.value}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
                                        <span className={`flex items-center gap-1 ${stat.isUp ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 bg-zinc-800'} px-2 py-0.5 rounded-none`}>
                                            {stat.isUp ? <ArrowUpRight size={10} /> : null} {stat.trend}
                                        </span>
                                        <span className="text-zinc-600">Este Mês</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Live Flow - Pipeline */}
                            <motion.div variants={itemVariants} className="lg:col-span-8 bg-[#131314] border border-[#444746] rounded-none p-6 shadow-2xl flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-light text-white tracking-tight">Fluxo Operacional Vivo</h3>
                                    <button className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-mono border border-[#444746] px-3 py-1.5 rounded-none transition-all bg-[#121212]">Relatório Completo</button>
                                </div>
                                <div className="flex-1 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#444746]">
                                                <th className="pb-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-normal">Transação / Lead</th>
                                                <th className="pb-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-normal">Estágio</th>
                                                <th className="pb-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-normal text-right">Valor Estimado</th>
                                                <th className="pb-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-normal text-right pr-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#444746] text-sm">
                                            {unitLeads.slice(0, 7).map((lead, i) => (
                                                <tr key={lead.id} className="hover:bg-[#121212] transition-colors group cursor-pointer">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-none bg-[#18181b] border border-[#444746] flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-[#444746] transition-all">
                                                                <Briefcase size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white/90 group-hover:text-white transition-colors">{lead.name}</p>
                                                                <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{lead.interest}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-zinc-400 font-light truncate max-w-[150px]">{lead.status}</td>
                                                    <td className="py-4 text-right font-mono tracking-tighter text-zinc-300">R$ {((10 - i) * 1250).toLocaleString('pt-BR')}</td>
                                                    <td className="py-4 text-right pr-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                            <Clock size={10} /> Em Atendimento
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {unitLeads.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-8 text-center text-zinc-500 font-mono text-xs">Sem dados operacionais no momento.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>

                            {/* Secondary Column: Insights & Alerts */}
                            <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                                <div className="bg-gradient-to-b from-[#121212] to-[#0A0A0A] border border-[#444746] rounded-none p-6 shadow-xl relative overflow-hidden h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-white/5 rounded-none flex items-center justify-center text-white">
                                            <Activity size={18} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-sm font-medium text-white uppercase tracking-widest">WINF Radar</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-[#131314] p-4 rounded-none border border-[#444746] flex gap-4 items-start">
                                            <div className="w-2 h-2 rounded-none bg-red-500 shrink-0 mt-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                            <div>
                                                <p className="text-xs text-white font-medium mb-1">3 Orçamentos Vencendo</p>
                                                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">Orçamentos enviados há mais de 48h sem resposta do cliente. Necessário follow-up.</p>
                                            </div>
                                        </div>
                                        <div className="bg-[#131314] p-4 rounded-none border border-[#444746] flex gap-4 items-start">
                                            <div className="w-2 h-2 rounded-none bg-yellow-500 shrink-0 mt-1.5 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                            <div>
                                                <p className="text-xs text-white font-medium mb-1">Estoque Crítico: Select</p>
                                                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">Bobina Winf Select com menos de 3 metros. Agende ressuprimento pela Blackshop.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-[#444746]">
                                        <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-none hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2">
                                            <Target size={14} /> Atacar Pendências
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}

                {activeTab === 'dispatch' && (
                    <motion.div variants={itemVariants} className="bg-[#131314] border border-[#444746] rounded-none p-6 min-h-[400px] flex items-center justify-center text-center">
                        <div>
                            <Hammer size={48} className="mx-auto text-zinc-700 mb-4" strokeWidth={1} />
                            <h3 className="text-xl font-light text-white mb-2">Módulo de Expedição em Atualização</h3>
                            <p className="text-sm text-zinc-500 font-mono">Controle de instaladores e agenda física será disponibilizado no próximo patch.</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'alerts' && (
                    <motion.div variants={itemVariants} className="bg-[#131314] border border-[#444746] rounded-none p-6 min-h-[400px] flex items-center justify-center text-center">
                        <div>
                            <AlertTriangle size={48} className="mx-auto text-zinc-700 mb-4" strokeWidth={1} />
                            <h3 className="text-xl font-light text-white mb-2">Central de Alertas Limpa</h3>
                            <p className="text-sm text-zinc-500 font-mono">Sua unidade não possui alertas críticos no momento.</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ModuleMissionControl;
