import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  FileText,
  Zap,
  BarChart
} from 'lucide-react';
import { motion } from 'motion/react';

const AuditSystem: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const auditProjects = [
        { 
            id: 'AUD-9021', 
            project: 'Residência G. Silva', 
            status: 'PENDING', 
            compliance: 85, 
            date: '2026-05-18', 
            issues: 2,
            type: 'Architectural'
        },
        { 
            id: 'AUD-8854', 
            project: 'Edifício Corporate Alpha', 
            status: 'APPROVED', 
            compliance: 100, 
            date: '2026-05-17', 
            issues: 0,
            type: 'Performance'
        },
        { 
            id: 'AUD-8742', 
            project: 'Loja Conceito Winf', 
            status: 'FLAGGED', 
            compliance: 62, 
            date: '2026-05-16', 
            issues: 5,
            type: 'Standard'
        },
        { 
            id: 'AUD-8611', 
            project: 'Apartamento Loft 42', 
            status: 'IN_REVIEW', 
            compliance: 92, 
            date: '2026-05-15', 
            issues: 1,
            type: 'Architectural'
        }
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'FLAGGED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'IN_REVIEW': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-winf-primary" /> Sistema de Auditoria de Projetos
                    </h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase mt-1 tracking-widest">Controle de Qualidade e Compliance Winf OS</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-winf-primary/10 text-winf-primary border border-winf-primary/20 px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest hover:bg-winf-primary/20 transition-all flex items-center gap-2">
                        <Zap size={14} /> Auditoria Rápida
                    </button>
                    <button className="bg-white text-black px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2">
                        <BarChart size={14} /> Relatório Geral
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Projetos Auditados', value: '1,248', color: 'text-white' },
                    { label: 'Taxa de Compliance', value: '94.2%', color: 'text-emerald-400' },
                    { label: 'Alertas Ativos', value: '12', color: 'text-red-400' },
                    { label: 'Em Revisão', value: '45', color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#131314] border border-[#444746] p-4 rounded-none">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-xl font-medium ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#131314] border border-[#444746] p-4 rounded-none">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-winf-primary transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Buscar por ID, projeto ou técnico..."
                        className="w-full bg-[#131314] border border-[#444746] rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-winf-primary/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none border border-[#444746] bg-[#131314] text-zinc-400 px-4 py-2 rounded-none text-sm flex items-center justify-center gap-2 hover:text-white transition-colors">
                        <Filter size={16} /> Filtros
                    </button>
                </div>
            </div>

            {/* Audit Table */}
            <div className="bg-[#131314] border border-[#444746] rounded-none overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#444746] bg-white/[0.02]">
                                <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ID Auditoria</th>
                                <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Projeto</th>
                                <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">Score</th>
                                <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Data</th>
                                <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#444746]">
                            {auditProjects.map((item) => (
                                <motion.tr 
                                  key={item.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-winf-primary">{item.id}</span>
                                        <p className="text-[9px] text-zinc-600 uppercase mt-0.5">{item.type}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-white">{item.project}</p>
                                        {item.issues > 0 && (
                                            <div className="flex items-center gap-1.5 mt-1 text-red-400">
                                                <AlertTriangle size={10} />
                                                <span className="text-[10px] uppercase font-bold">{item.issues} Não-conformidades</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-none overflow-hidden">
                                                <motion.div 
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${item.compliance}%` }}
                                                  className={`h-full ${item.compliance === 100 ? 'bg-emerald-500' : item.compliance > 80 ? 'bg-winf-primary' : 'bg-red-500'}`}
                                                />
                                            </div>
                                            <span className="text-[10px] text-zinc-500 font-mono mt-1.5">{item.compliance}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none border text-[9px] font-bold uppercase tracking-wider ${getStatusStyles(item.status)}`}>
                                            {item.status === 'APPROVED' && <CheckCircle2 size={10} />}
                                            {item.status === 'PENDING' && <Clock size={10} />}
                                            {item.status === 'FLAGGED' && <AlertTriangle size={10} />}
                                            {item.status === 'IN_REVIEW' && <Eye size={10} />}
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-500 font-mono italic">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-none transition-all">
                                            <FileText size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-white/[0.01] border-t border-[#444746] flex items-center justify-between">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Exibindo 4 de 1.248 registros</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-[#444746] text-[10px] text-zinc-500 rounded-none disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 border border-[#444746] text-[10px] text-zinc-500 rounded-none active:bg-winf-primary active:text-black">Próxima</button>
                    </div>
                </div>
            </div>
            
            {/* AI Insight Section */}
            <div className="bg-gradient-to-br from-indigo-950/20 to-black border border-indigo-500/20 p-6 rounded-none flex items-start gap-6">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-none">
                    <Zap size={24} />
                </div>
                <div className="flex-1">
                    <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1 italic">Winf Brain Insight</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed font-light">
                        Detectamos uma inconsistência recorrente na <span className="text-white font-medium">Residência G. Silva (AUD-9021)</span>. O sensor térmico da camada <span className="text-winf-primary">AeroCore™</span> reportou uma variação de 2.4% fora do padrão nominal de compliance. Recomendamos auditoria técnica presencial ou reforço via assistência remota.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors">Ver Detalhes do Erro</button>
                        <button className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Ignorar (Falso-Positivo)</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditSystem;
