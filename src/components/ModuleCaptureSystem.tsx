import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Bot as BotIcon,
  Crosshair,
  Radar,
  Store,
  Globe,
  Radio,
  MessageSquare,
  Users,
  Briefcase,
  TrendingUp,
  Inbox,
  CheckCircle,
  FileText,
  Camera,
  Share2,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  X
} from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { Lead } from '../types';
import { LeadItemSkeleton } from './ui/LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ModuleCaptureSystem: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const { user, effectiveRole, leads, publicLeads, fetchLeads, fetchPublicLeads, addLead, claimLead, gamify, distributeLead, addInstallationJob, isLoading } = useWinf();
  const currentRole = effectiveRole || user?.role;
  const [revealSensitive, setRevealSensitive] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'radar'>('list');
  const [isScanning, setIsScanning] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'public'>('personal');

  useEffect(() => { 
    if (user?.id) fetchLeads(); 
    fetchPublicLeads();
  }, [user?.id]);

  const canViewSensitive = currentRole === 'Admin' || currentRole === 'Licenciado';

  const handleClaimLead = async () => {
    if (!selectedTarget) return;
    setIsConverting(true);
    const result = await claimLead(selectedTarget.id);
    if (result.success) {
      setSelectedTarget(null);
      setActiveTab('personal');
    } else {
      alert(result.error);
    }
    setIsConverting(false);
  };

  const handleConvertToSquad = async () => {
    if (!selectedTarget) return;
    setIsConverting(true);
    
    // Simulate Order Creation
    const osId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 999)}`;
    
    // Create Installation Job
    await addInstallationJob({
      service_order_id: osId,
      customer_name: selectedTarget.name,
      vehicle_model: selectedTarget.interest.includes('AeroCore') ? 'Embarcação/Veículo (Análise)' : 'Projeto Executivo',
      collaborator_id: '1', // Default to first tech for demo
    });

    gamify('SALE_CLOSED');
    alert(`Oportunidade convertida em negócio! Protocolo Operacional ${osId} gerado.`);
    setIsConverting(false);
    setSelectedTarget(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-black border-black bg-white';
    if (score >= 50) return 'text-white border-[#444746] bg-white/10';
    return 'text-white/40 border-[#444746] bg-transparent';
  };

  const getZoneLabel = (score: number) => {
    if (score >= 80) return 'ALTA CONVERSÃO';
    if (score >= 50) return 'EM TRATATIVA';
    return 'PROSPECÇÃO FRIA';
  };

  const simulateIncomingLead = async () => {
      setIsScanning(true);
      
      setTimeout(async () => {
          const sources = [
              { src: 'Winf TouchPoint (Físico)', interest: 'Solução AeroCore', score: 85 },
              { src: 'Indicação Parceiro (Asset Light / Arquiteto)', interest: 'Película de Controle Solar', score: 98 },
              { src: 'Campanha Institucional', interest: 'Película Select', score: 72 },
              { src: 'Indicação Síndico / Vidraceiro', interest: 'Automação Corporativa', score: 90 }
          ];
          const randomSource = sources[Math.floor(Math.random() * sources.length)];
          
          await addLead({
              name: `Cliente Potencial #${Math.floor(Math.random() * 9999)}`,
              contact: '(XX) 9XXXX-XXXX',
              source: randomSource.src,
              interest: randomSource.interest,
              status: 'Aguardando',
              ai_score: 95,
              dominance_score: randomSource.score,
              decay_level: 100
          });
          
          gamify('LEAD_ADDED');
          setIsScanning(false);
          setViewMode('list'); 
      }, 3000);
  };

  const simulateWhatsAppLead = async () => {
      setIsScanning(true);
      const lead = { name: `Lead WhatsApp #${Math.floor(Math.random() * 999)}`, city: 'Santos' };
      
      setTimeout(async () => {
          await distributeLead(lead);
          await addLead({
              name: lead.name,
              contact: '(13) 9XXXX-XXXX',
              source: 'WhatsApp Corporativo',
              interest: 'Orçamento Especializado',
              status: 'Distribuído',
              ai_score: 88,
              dominance_score: 75,
              decay_level: 100
          });
          gamify('LEAD_ADDED');
          setIsScanning(false);
          setViewMode('list');
      }, 2000);
  };

  // Filtros avançados para a equipe de vendas
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('any');
  const [filterProduct, setFilterProduct] = useState<string>('any');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Computa o nível de filtros ativos para indicar visualmente
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim() !== '') count++;
    if (filterStatus !== 'any') count++;
    if (filterProduct !== 'any') count++;
    if (sortBy !== 'score' || sortOrder !== 'desc') count++;
    return count;
  }, [searchTerm, filterStatus, filterProduct, sortBy, sortOrder]);

  const processLeads = (leadList: Lead[]) => {
    let result = [...leadList];

    // 1. Filtro por Busca (Nome, Interesse, Canal d'origem, Contato)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(lead => 
        (lead.name || '').toLowerCase().includes(query) ||
        (lead.interest || '').toLowerCase().includes(query) ||
        (lead.source || '').toLowerCase().includes(query) ||
        (lead.contact || '').toLowerCase().includes(query)
      );
    }

    // 2. Filtro por Status
    if (filterStatus !== 'any') {
      result = result.filter(lead => {
        const status = lead.status || 'Ativo';
        return status.toLowerCase() === filterStatus.toLowerCase();
      });
    }

    // 3. Filtro por Produto/Interesse
    if (filterProduct !== 'any') {
      result = result.filter(lead => {
        const interest = lead.interest || '';
        return interest.toLowerCase().includes(filterProduct.toLowerCase());
      });
    }

    // 4. Ordenação
    result.sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.dominance_score ?? a.ai_score ?? 0;
        const scoreB = b.dominance_score ?? b.ai_score ?? 0;
        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      } else {
        // Ordena por data de atualização/criação
        const getTimestamp = (lead: Lead) => {
          if (lead.created_at) return new Date(lead.created_at).getTime();
          if (lead.distributed_at) return new Date(lead.distributed_at).getTime();
          const match = lead.id.match(/\d+$/);
          if (match) return parseInt(match[0], 10);
          return 0;
        };
        const timeA = getTimestamp(a);
        const timeB = getTimestamp(b);
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
    });

    return result;
  };

  const processedLeads = useMemo(() => {
    const listToProcess = activeTab === 'personal' ? leads : publicLeads;
    return processLeads(listToProcess);
  }, [activeTab, leads, publicLeads, searchTerm, sortBy, sortOrder, filterStatus, filterProduct]);

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('score');
    setSortOrder('desc');
    setFilterStatus('any');
    setFilterProduct('any');
  };

  const uniqueStatuses = useMemo(() => {
    const list = activeTab === 'personal' ? leads : publicLeads;
    const statuses = list.map(l => l.status || 'Ativo');
    return Array.from(new Set(statuses));
  }, [activeTab, leads, publicLeads]);

  const uniqueInterests = useMemo(() => {
    const list = activeTab === 'personal' ? leads : publicLeads;
    const interests = list.map(l => {
      const parts = l.interest.split('(');
      return parts[0].trim();
    });
    return Array.from(new Set(interests));
  }, [activeTab, leads, publicLeads]);

  return (
    <div className="space-y-10 animate-fade-in pb-12 w-full text-white">
        {/* Header - Banking Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#444746] pb-8">
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-2">Winf™ | Radar</h1>
                    <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-[0.2em]">Inteligência em Prospecção e Monitoramento de Mercado</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`px-6 py-3 rounded-none text-xs md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${viewMode === 'list' ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-transparent text-white/40 border-[#444746] hover:border-white/30 hover:text-white'}`}
                > Monitoramento </button>
                <button 
                  onClick={() => setViewMode('radar')} 
                  className={`px-6 py-3 rounded-none text-xs md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all border flex items-center gap-2 ${viewMode === 'radar' ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-transparent text-white/40 border-[#444746] hover:border-white/30 hover:text-white'}`}
                > <Radar size={12} /> Radar </button>
            </div>
        </div>

        {/* Atendimento Zeigarnik Metric Bar */}
        {(() => {
          const totalLeads = leads.length + publicLeads.length;
          const waitingTriagem = leads.filter(l => l.status === 'Aguardando' || l.status === 'Novo' || l.status?.toLowerCase() === 'pendente').length + publicLeads.length;
          const inConversation = leads.filter(l => l.status === 'Distribuído' || l.status === 'Tratando' || l.status?.toLowerCase() === 'em tratamento').length;
          const conversionRate = totalLeads > 0 ? Math.max(10, Math.round(((totalLeads - waitingTriagem) / totalLeads) * 100)) : 100;
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="bg-[#131314] border border-[#444746] p-5 rounded-none flex flex-col justify-between group hover:border-white/20 transition-all">
                    <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Índice de Tratativa</span>
                        <h3 className="text-lg font-light text-white tracking-tight mt-1">Eficiência do Radar</h3>
                    </div>
                    <div>
                        <div className="mt-4 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-500 uppercase">Absorção de Demanda</span>
                            <span className="text-white font-bold">{conversionRate}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden mt-2">
                            <div className="h-full bg-white rounded-none transition-all duration-500" style={{ width: `${conversionRate}%` }} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#131314] border border-[#444746] p-5 rounded-none flex flex-col justify-between">
                    <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Ciclos Críticos em Aberto</span>
                        <h3 className="text-lg font-light text-amber-400 tracking-tight mt-1 flex items-center gap-1.5 font-sans">
                            {waitingTriagem} Contatos Pendentes
                        </h3>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-light mt-3 uppercase tracking-wider">
                        {waitingTriagem > 0 ? '✗ A mente foca no que está incompleto. Trate-os hoje.' : '✓ Todos os contatos sob controle!'}
                    </p>
                </div>

                <div className="bg-[#131314] border border-[#444746] p-5 rounded-none flex flex-col justify-between">
                    <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Em Conversação</span>
                        <h3 className="text-lg font-light text-white tracking-tight mt-1 font-mono uppercase">{inConversation} Clientes Ativos</h3>
                    </div>
                    <div>
                        <div className="mt-4 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-500">PROGRESSÃO ATALHO</span>
                            <span className="text-zinc-300">ACESSAR RADAR</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-none mt-2 overflow-hidden">
                            <div className="h-full bg-white rounded-none transition-all duration-500" style={{ width: `${inConversation > 0 ? Math.min(100, Math.round(100 / inConversation)) : 0}%` }} />
                        </div>
                    </div>
                </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: LIST OR RADAR */}
            <div className="lg:col-span-8 bg-[#131314] border border-[#444746] rounded-none p-4 h-[700px] flex flex-col relative shadow-2xl">
                
                {viewMode === 'list' && (
                    <>
                        <div className="p-4 border-b border-white/[0.05] flex justify-between items-center mb-4">
                            <div className="flex gap-2 bg-[#131314] p-1 border border-[#444746] rounded-none">
                                <button 
                                    onClick={() => setActiveTab('personal')}
                                    className={`px-4 py-2 text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-none ${activeTab === 'personal' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                                >
                                    Minha Carteira ({leads.length})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('public')}
                                    className={`px-4 py-2 text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all rounded-none ${activeTab === 'public' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                                >
                                    Pool Institucional ({publicLeads.length})
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={simulateIncomingLead} disabled={isScanning} className="text-xs md:text-[10px] font-bold text-white bg-white/5 hover:bg-white/10 border border-[#444746] px-5 py-2.5 rounded-none tracking-[0.2em] transition-all flex items-center gap-2 group shadow-lg">
                                    {isScanning ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-white rounded-none animate-ping" />
                                            Sincronizando...
                                        </span>
                                    ) : (
                                        <>
                                            <TrendingUp size={12} className="group-hover:scale-110 transition-transform" /> 
                                            Escanear Mercado
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Search and Advanced Filters Row */}
                        <div className="px-4 pb-4 border-b border-white/[0.05] flex flex-col md:flex-row gap-3 items-center">
                            <div className="relative flex-1 w-full bg-[#131314] border border-[#444746] rounded-none focus-within:border-[#444746] transition-all">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Pesquisar por nome, produto, contato..."
                                    className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs font-light text-white outline-none placeholder:text-white/20"
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')} 
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                                <button
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-none border text-xs font-bold uppercase tracking-widest transition-all ${
                                        showAdvancedFilters || activeFiltersCount > 0
                                            ? 'bg-white/10 text-white border-white/35'
                                            : 'bg-transparent text-white/40 border-[#444746] hover:border-[#444746] hover:text-white/80'
                                    }`}
                                >
                                    <SlidersHorizontal size={12} />
                                    <span>Filtros</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="w-1.5 h-1.5 rounded-none bg-white animate-pulse" />
                                    )}
                                </button>
                                
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white/40 hover:text-red-400 border border-[#444746] hover:border-red-500/20 text-[10px] font-bold uppercase tracking-widest transition-all rounded-none md:w-auto w-full justify-center"
                                        title="Limpar Filtros"
                                    >
                                        <X size={10} />
                                        <span>Limpar</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Collapsible Advanced Filters Drawer */}
                        <AnimatePresence>
                            {showAdvancedFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden border-b border-white/[0.05] bg-[#020202] px-4 py-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Sort Options */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 block">Ordenar por</label>
                                            <div className="flex bg-[#131314] p-0.5 border border-[#444746] rounded-none">
                                                <button
                                                    onClick={() => setSortBy('score')}
                                                    className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all ${sortBy === 'score' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    Score de Conversão
                                                </button>
                                                <button
                                                    onClick={() => setSortBy('date')}
                                                    className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1.5 ${sortBy === 'date' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    <Calendar size={10} />
                                                    Data Atualização
                                                </button>
                                            </div>
                                        </div>

                                        {/* Sort Directions */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 block">Direção</label>
                                            <div className="flex bg-[#131314] p-0.5 border border-[#444746] rounded-none">
                                                <button
                                                    onClick={() => setSortOrder('desc')}
                                                    className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1 ${sortOrder === 'desc' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    <ArrowUpDown size={10} />
                                                    Decrescente
                                                </button>
                                                <button
                                                    onClick={() => setSortOrder('asc')}
                                                    className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1 ${sortOrder === 'asc' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    <ArrowUpDown className="rotate-180" size={10} />
                                                    Crescente
                                                </button>
                                            </div>
                                        </div>

                                        {/* Status Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 block">Filtrar por Status</label>
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className="w-full bg-[#131314] border border-[#444746] py-2 px-3 text-xs font-light text-white outline-none rounded-none focus:border-[#444746] transition-all uppercase"
                                            >
                                                <option value="any">Todos os Status</option>
                                                {uniqueStatuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Product Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 block">Filtrar por Produto/Interesse</label>
                                            <select
                                                value={filterProduct}
                                                onChange={(e) => setFilterProduct(e.target.value)}
                                                className="w-full bg-[#131314] border border-[#444746] py-2 px-3 text-xs font-light text-white outline-none rounded-none focus:border-[#444746] transition-all uppercase"
                                            >
                                                <option value="any">Todos os Produtos</option>
                                                {uniqueInterests.map(interest => (
                                                    <option key={interest} value={interest}>{interest}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {/* Active filters display tags */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-white/[0.03]">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 mr-1.5">Filtros Ativos:</span>
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-[#444746] text-[9px] font-bold uppercase tracking-wider text-white/60 rounded-none">
                                                Busca: "{searchTerm}"
                                                <button onClick={() => setSearchTerm('')} className="hover:text-red-400 transition-colors ml-1"><X size={10} /></button>
                                            </span>
                                        )}
                                        {filterStatus !== 'any' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-[#444746] text-[9px] font-bold uppercase tracking-wider text-white/60 rounded-none">
                                                Status: {filterStatus}
                                                <button onClick={() => setFilterStatus('any')} className="hover:text-red-400 transition-colors ml-1"><X size={10} /></button>
                                            </span>
                                        )}
                                        {filterProduct !== 'any' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-[#444746] text-[9px] font-bold uppercase tracking-wider text-white/60 rounded-none">
                                                Interesse: {filterProduct}
                                                <button onClick={() => setFilterProduct('any')} className="hover:text-red-400 transition-colors ml-1"><X size={10} /></button>
                                            </span>
                                        )}
                                        {(sortBy !== 'score' || sortOrder !== 'desc') && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-[#444746] text-[9px] font-bold uppercase tracking-wider text-white/60 rounded-none">
                                                Ordenado por: {sortBy === 'score' ? 'Score' : 'Data Atualização'} ({sortOrder === 'desc' ? 'Decrescente' : 'Crescente'})
                                                <button onClick={() => { setSortBy('score'); setSortOrder('desc'); }} className="hover:text-red-400 transition-colors ml-1"><X size={10} /></button>
                                            </span>
                                        )}
                                        {activeFiltersCount === 0 && (
                                            <span className="text-[10px] font-light text-white/30 italic">Nenhum filtro personalizado ativo (exibindo todos os leads)</span>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mt-2">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <LeadItemSkeleton />
                                    <LeadItemSkeleton />
                                    <LeadItemSkeleton />
                                </div>
                            ) : processedLeads.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/20 p-8">
                                    <Inbox size={48} className="mb-4 stroke-1 opacity-60" />
                                    <p className="text-xs md:text-[10px] uppercase font-black tracking-[0.2em] text-center">Nenhum Lead Encontrado.</p>
                                    {activeFiltersCount > 0 && (
                                        <p className="text-[10px] font-light text-white/30 text-center mt-2 max-w-xs leading-relaxed uppercase tracking-widest">
                                            Ajuste os filtros ou clique em limpar à direita para ver os registros.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                processedLeads.map((lead) => (
                                    <div 
                                        key={lead.id} 
                                        onClick={() => setSelectedTarget(lead)}
                                        className={`p-5 cursor-pointer transition-all flex items-center gap-6 rounded-none border group relative overflow-hidden ${selectedTarget?.id === lead.id ? 'bg-[#1e1f20] border-white/30 ring-1 ring-white/10' : 'bg-transparent border-[#444746] hover:border-[#444746] hover:bg-white/[0.02]'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-none border flex flex-col items-center justify-center font-mono transition-all group-hover:scale-105 ${getScoreColor(lead.dominance_score)}`}>
                                            <span className="text-sm font-bold">{lead.dominance_score}</span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium text-sm truncate">{lead.name}</h4>
                                            <div className="flex gap-4 mt-1 items-center">
                                                <p className="text-xs md:text-[10px] text-white/40 font-light truncate">{lead.interest}</p>
                                                <div className="h-[2px] w-[2px] bg-white/20 rounded-none"></div>
                                                <div className="flex items-center gap-1.5 text-xs md:text-[10px] text-white/40 font-light">
                                                    {lead.source.includes('Kiosk') ? <Store size={10} /> : lead.source.includes('Web') || lead.source.includes('Ads') ? <Globe size={10} /> : <Briefcase size={10} />}
                                                    {lead.source}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-[10px] md:text-[8px] font-bold uppercase tracking-[0.2em] mb-1.5 ${lead.dominance_score >= 80 ? 'text-white' : 'text-white/40'}`}>{getZoneLabel(lead.dominance_score)}</p>
                                            <div className="flex gap-0.5 justify-end">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-3 h-1 rounded-none ${i < (lead.decay_level / 20) ? 'bg-white' : 'bg-white/10'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {viewMode === 'radar' && (
                    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-none bg-[#131314]">
                        {/* Elegant Radar Visual */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
                        <div className="relative w-[300px] h-[300px] border border-[#444746] rounded-none flex items-center justify-center">
                            <div className="absolute w-[200px] h-[200px] border border-[#444746] rounded-none"></div>
                            <div className="absolute w-[100px] h-[100px] border border-[#444746] rounded-none bg-[#131314]"></div>
                            
                            {/* Scanning Line */}
                            <div className={`absolute top-0 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/60 shadow-[0_0_15px_rgba(255,255,255,0.4)] origin-left animate-[spin_4s_linear_infinite] ${isScanning ? 'opacity-100' : 'opacity-0'}`}></div>
                            
                            {/* Radar Pulse Rings */}
                            {isScanning && (
                                <>
                                    <div className="absolute w-[300px] h-[300px] border border-white/10 rounded-full animate-[ping_3s_linear_infinite]" />
                                    <div className="absolute w-[240px] h-[240px] border border-white/5 rounded-full animate-[ping_4s_linear_infinite_1s]" />
                                </>
                            )}

                            {/* CENTER HUB */}
                            <div className="z-10 bg-[#131314] border border-[#444746] w-12 h-12 rounded-none flex items-center justify-center shadow-2xl">
                                <Radio size={16} className={`text-white ${isScanning ? 'animate-pulse' : 'opacity-40'}`} />
                            </div>
                        </div>

                        <div className="absolute bottom-12 text-center space-y-3 px-8">
                            <h3 className="text-white font-light text-lg tracking-tight">Radar de Oportunidades Winf™</h3>
                            <p className="text-white/40 text-xs font-light max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
                                Rastreamento de leads qualificados em tempo real.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                                <button 
                                    onClick={simulateWhatsAppLead}
                                    disabled={isScanning}
                                    className="bg-[#131314] border border-[#444746] text-white px-6 py-3 rounded-none font-bold text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={14} />
                                    {isScanning ? 'Conectando...' : 'WhatsApp Hub'}
                                </button>
                                <button 
                                    onClick={simulateIncomingLead}
                                    disabled={isScanning}
                                    className="bg-zinc-800/20 border border-[#444746] text-white px-6 py-3 rounded-none font-bold text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Globe size={14} />
                                    {isScanning ? 'Sincronizando...' : 'Ads & Web'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: LEAD PROFILE */}
            <div className="lg:col-span-4 bg-[#131314] border border-[#444746] rounded-none p-5 md:p-8 flex flex-col relative shadow-2xl">
                {!selectedTarget ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                        <Users size={48} className="mb-4 stroke-1" />
                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold uppercase tracking-[0.3em]">Selecione um Cliente</p>
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-8 h-full flex flex-col">
                        <div className="border-b border-[#444746] pb-6">
                            <h3 className="text-white font-light text-2xl tracking-tight mb-2">{selectedTarget.name}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                    <CheckCircle size={12} className="text-white" /> 
                                    {selectedTarget.status || 'Ativo'}
                                </p>
                                <span className="text-xs md:text-[10px] text-white/20 font-mono">ID: {selectedTarget.id.slice(0,8)}</span>
                            </div>
                        </div>

                        {/* INFO BOXES */}
                        <div className="space-y-4">
                            <div className="p-4 bg-[#131314] border border-[#444746] rounded-none flex items-start gap-4">
                                <Briefcase className="text-white/40 shrink-0" size={16} />
                                <div>
                                    <p className="text-[10px] md:text-[8px] text-white/40 uppercase font-bold tracking-[0.2em] mb-1">Interesse / Produto</p>
                                    <p className="text-sm text-white font-light">{selectedTarget.interest}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-[#131314] border border-[#444746] rounded-none flex items-start gap-4">
                                <Radio className="text-white/40 shrink-0" size={16} />
                                <div>
                                    <p className="text-[10px] md:text-[8px] text-white/40 uppercase font-bold tracking-[0.2em] mb-1">Origem da Captação</p>
                                    <p className="text-sm text-white font-light">{selectedTarget.source}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI ANALYSIS */}
                        <div className="bg-[#131314] border border-[#444746] p-6 rounded-none relative overflow-hidden mt-2">
                            <h4 className="text-white/40 text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <BotIcon size={14} className="text-white" /> Análise Preditiva Winf
                            </h4>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] md:text-[8px] text-white/30 uppercase font-bold tracking-[0.2em] mb-1">Perfil de Consumo</p>
                                    <p className="text-xs text-white/80 font-light leading-relaxed">
                                        {selectedTarget.campaign_name ? `Detectado em campaign "${selectedTarget.campaign_name}". ` : ''}
                                        {selectedTarget.last_paradox_truth || "Alta probabilidade de conversão para soluções premium corporativas."}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-[8px] text-white/30 uppercase font-bold tracking-[0.2em] mb-1">Próxima Ação Recomendada</p>
                                    <p className="text-sm text-white font-medium tracking-tight">
                                        {selectedTarget.last_paradox_maneuver || "Apresentar estimativa via módulo de Propostas."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-auto pt-6 space-y-3">
                            {activeTab === 'public' ? (
                                <button 
                                    onClick={handleClaimLead}
                                    disabled={isConverting}
                                    className="w-full py-4 bg-white text-black font-bold text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.2em] rounded-none hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={14} className={isConverting ? 'animate-spin' : ''} />
                                    {isConverting ? 'Processando...' : 'Reivindicar do Pool'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleConvertToSquad}
                                    disabled={isConverting}
                                    className="w-full py-4 bg-white text-black font-bold text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.2em] rounded-none hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Crosshair size={14} className={isConverting ? 'animate-spin' : ''} />
                                    {isConverting ? 'Processando...' : 'Converter em Oportunidade'}
                                </button>
                            )}
                            <button className="w-full py-4 bg-transparent border border-[#444746] text-white/60 font-bold text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.2em] rounded-none hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2">
                                <FileText size={14} /> Relatório do Cliente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ModuleCaptureSystem;
