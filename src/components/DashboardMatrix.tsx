import React, { useEffect, useMemo, useState } from 'react';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  Activity, 
  ArrowUpRight, 
  MapPin, 
  ArrowLeft,
  Search,
  Filter,
  Waves,
  Zap,
  Target,
  ChevronRight,
  X,
  Award,
  Flag,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWinf } from '../contexts/WinfContext';
import { ViewState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardMatrixProps {
  onBack: () => void;
  onChangeView: (view: ViewState) => void;
}

const DashboardMatrix: React.FC<DashboardMatrixProps> = ({ onBack, onChangeView }) => {
  const { members, leads, transactions, quotes, fetchMembers, fetchTransactions, fetchLeads } = useWinf();
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchMembers();
      fetchTransactions();
      fetchLeads();
    }
    return () => { isMounted = false; };
  }, [fetchMembers, fetchTransactions, fetchLeads]);

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : 0), 0);
    const activeUnits = members.filter(m => (m.role as string) === 'Licenciado' || (m.role as string) === 'ASSET_LIGHT').length;
    const totalLeads = leads.length;
    
    return [
      { label: 'Receita Global', value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, sub: '+12% este mês', icon: TrendingUp, color: 'text-green-400' },
      { label: 'Unidades Ativas', value: activeUnits, sub: '8 em homologação', icon: Globe, color: 'text-blue-400' },
      { label: 'Network Leads', value: totalLeads, sub: '342 novos hoje', icon: Users, color: 'text-purple-400' },
      { label: 'Conversão Média', value: '24.8%', sub: '+2.1% vs anterior', icon: Activity, color: 'text-white' },
    ];
  }, [transactions, members, leads]);

  // Mock chart data for Matrix view
  const chartData = useMemo(() => [
    { name: 'Jan', value: 45000 },
    { name: 'Fev', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Abr', value: 61000 },
    { name: 'Mai', value: 55000 },
    { name: 'Jun', value: 67000 },
  ], []);

  const unitPerformance = useMemo(() => {
    return members
      .filter(m => ((m.role as string) === 'Licenciado' || (m.role as string) === 'ASSET_LIGHT') && m.name !== 'Tiago Admin')
      .map(m => ({
        id: m.id,
        name: m.name,
        city: m.address?.city || 'Brasil',
        revenue: Math.floor(Math.random() * 15000) + 5000,
        leads: Math.floor(Math.random() * 50) + 10,
        health: Math.floor(Math.random() * 20) + 80
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [members]);

  return (
    <div className="flex flex-col min-h-screen bg-[#131314] text-white overflow-x-hidden">
      {/* Matrix Header */}
      <div className="sticky top-0 z-40 bg-[#131314]/90 backdrop-blur-md border-b border-[#444746] px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 rounded-none bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white border border-[#444746]"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center border border-[#444746]">
                  <Globe size={20} className="text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                  Matriz <span className="text-white/40 font-light">Ecosystem</span>
                </h1>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-blue-500 animate-pulse"></span>
                Dashboard de Expansão Global // Modo Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
              {members.slice(0, 5).map(m => (
                <div key={m.id} className="w-8 h-8 rounded-none border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                  {m.name.charAt(0)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-none border-2 border-[#050505] bg-white text-black flex items-center justify-center text-[10px] font-bold">
                +{members.length - 5}
              </div>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-[#444746] rounded-none text-[10px] font-bold uppercase tracking-widest transition-all">
              Relatório Consolidado
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8 pb-20">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#131314] border border-[#444746] rounded-none p-6 relative overflow-hidden group hover:border-[#444746] transition-all shadow-xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={64} />
              </div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-light tracking-tight mb-2">{stat.value}</h3>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${stat.color}`}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts & Map Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-[#131314] border border-[#444746] rounded-none p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight">Crescimento da Rede</h3>
                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Volume Financeiro Consolidado (BRL)</p>
              </div>
              <div className="flex gap-2">
                {['6M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={`px-3 py-1 rounded-none text-[9px] font-bold uppercase tracking-widest border transition-all ${t === '6M' ? 'bg-white text-black border-white' : 'border-[#444746] text-zinc-500 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats / Sub-systems */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-[#121212] to-[#0A0A0A] border border-[#444746] p-8 rounded-none shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={80} />
               </div>
               <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={14} /> System Health
               </h4>
               <div className="space-y-4">
                  {[
                    { name: 'Rede Asset Light', val: '98.2%', status: 'Online' },
                    { name: 'Expansão Latam', val: 'Phase 2', status: 'Ativo' },
                    { name: 'Licenças Pendentes', val: '14', status: 'Verificar' }
                  ].map((sys, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest">
                          <span className="text-zinc-500">{sys.name}</span>
                          <span className="text-white">{sys.val}</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden">
                          <div className="w-[85%] h-full bg-white/40"></div>
                       </div>
                    </div>
                  ))}
               </div>
               <button 
                 onClick={() => onChangeView(ViewState.MODULE_MEMBERS)}
                 className="mt-8 w-full py-4 border border-[#444746] hover:border-white/30 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
               >
                 Acessar Expansion CRM <ChevronRight size={14} />
               </button>
            </div>

            <div className="bg-[#131314] border border-[#444746] p-6 rounded-none flex items-center gap-4 hover:border-[#444746] transition-all cursor-pointer group">
               <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  <Target size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Estratégia Matriz</h4>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Definição de Metas Globais</p>
               </div>
            </div>
          </div>
        </div>

        {/* Unit Performance Ranking */}
        <div className="bg-[#131314] border border-[#444746] rounded-none overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-[#444746] flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Performance por Unidade</h3>
              <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-1">Ranking de Faturamento & Integridade</p>
            </div>
            <div className="flex gap-4">
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input placeholder="Buscar Unidade..." className="bg-[#131314] border border-[#444746] rounded-none py-2 pl-9 pr-6 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-white/30" />
               </div>
               <button className="p-2.5 rounded-none border border-[#444746] text-zinc-500 hover:text-white transition-colors">
                  <Filter size={14} />
               </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#131314] border-b border-[#444746] text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-8 py-5">Unidade / Operador</th>
                  <th className="px-6 py-5">Localização</th>
                  <th className="px-6 py-5">Performance 30d</th>
                  <th className="px-6 py-5">Leads Ativos</th>
                  <th className="px-6 py-5">Integridade</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#444746]">
                {unitPerformance.map((unit, i) => (
                  <tr key={unit.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-none bg-zinc-900 border border-[#444746] flex items-center justify-center font-mono text-sm group-hover:border-white/30 transition-colors">
                          {unit.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-wide group-hover:text-blue-400 transition-colors">{unit.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">ID: {unit.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="flex items-center gap-2 text-xs text-zinc-300">
                          <MapPin size={12} className="text-zinc-500" /> {unit.city}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-mono font-bold text-white">R$ {unit.revenue.toLocaleString('pt-BR')}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight size={10} className="text-green-500" />
                        <span className="text-[9px] font-mono tracking-widest text-green-500 uppercase">+8.2%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-white/5 border border-[#444746] rounded-none text-[10px] font-bold text-white/60">
                        {unit.leads} Leads
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="flex-1 w-24 h-1 bg-white/5 rounded-none overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${unit.health}%` }}></div>
                         </div>
                         <span className="text-xs font-mono text-white/60">{unit.health}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 border border-[#444746] rounded-none hover:bg-white hover:text-black transition-all">
                          <ArrowUpRight size={16} />
                       </button>
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-white/[0.02] border-t border-[#444746] flex justify-center">
             <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                Carregar mais unidades <Waves size={12} className="animate-pulse" />
             </button>
          </div>
        </div>

      </main>

      {/* Corporate Strategy Banner */}
      <div className="bg-white text-black p-8 md:p-12">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Expansão Latam 2026</h2>
               <p className="text-xs md:text-sm font-medium opacity-60 uppercase tracking-[0.2em]">Planejamento de Dominância de Mercado Winf™ Matrix</p>
            </div>
            <button 
              onClick={() => setShowRoadmapModal(true)}
              className="px-10 py-5 bg-[#131314] text-white rounded-none text-xs font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl"
            >
               Ver Roadmap de Expansão
            </button>
         </div>
      </div>

      {/* Latam Expansion Roadmap Modal */}
      <AnimatePresence>
        {showRoadmapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#131314]/90 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-[#090909] border border-[#444746] rounded-none overflow-hidden p-6 md:p-10 text-white shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowRoadmapModal(false)}
                className="absolute top-6 right-6 p-2 rounded-none bg-white/5 hover:bg-white/10 transition-colors border border-[#444746] text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="mb-8 pr-12">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-1">
                  <Globe size={12} className="animate-spin-slow" />
                  <span>Winf™ Matrix Global Expansion</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                  Roadmap de Expansão Latam 2026/2027
                </h3>
                <p className="text-xs text-zinc-500 font-light mt-2 max-w-2xl leading-relaxed">
                  O cronograma oficial de expansão da marca Winf para estabelecer dominância em mercados estratégicos da América Latina. Implementando nosso modelo Asset Light escalável e distribuição inteligente de películas de alto desempenho.
                </p>
              </div>

              {/* Content Body with scrollbar */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                {/* Visual Timeline Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Q1 2026 */}
                  <div className="bg-[#121212] border border-[#444746] p-6 rounded-none relative overflow-hidden group hover:border-[#444746] transition-all">
                    <div className="absolute top-4 right-4 text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-none uppercase tracking-wider font-bold">
                      Q1 2026
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                        PY
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">Homologação Paraguai</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400 font-light leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-blue-400 mt-1.5 shrink-0" />
                        <span>Setup estrutural do hub de distribuição regional em Ciudad del Este e filial em Asunción.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-blue-400 mt-1.5 shrink-0" />
                        <span>Homologação tributária e parametrização de faturamento comercial para transações de alta performance (USD).</span>
                      </li>
                    </ul>
                  </div>

                  {/* Q2 2026 */}
                  <div className="bg-[#121212] border border-[#444746] p-6 rounded-none relative overflow-hidden group hover:border-[#444746] transition-all">
                    <div className="absolute top-4 right-4 text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-none uppercase tracking-wider font-bold">
                      Q2 2026
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-none bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                        UY
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-purple-400 transition-colors">Invasão Uruguai</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400 font-light leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-purple-400 mt-1.5 shrink-0" />
                        <span>Lançamento do mercado de alto padrão em Punta del Este e rede corporativa em Montevideo.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-purple-400 mt-1.5 shrink-0" />
                        <span>Onboarding dos primeiros licenciados Asset Light integrados ao fluxo automatizado da Winf Hub.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Q3 2026 */}
                  <div className="bg-[#121212] border border-[#444746] p-6 rounded-none relative overflow-hidden group hover:border-[#444746] transition-all">
                    <div className="absolute top-4 right-4 text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-none uppercase tracking-wider font-bold">
                      Q3 2026
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                        AR
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">Ativação Argentina</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400 font-light leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-amber-400 mt-1.5 shrink-0" />
                        <span>Abertura na Grande Buenos Aires e Córdoba com foco em grandes especificações arquitetônicas.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-amber-400 mt-1.5 shrink-0" />
                        <span>Rede logística direta para importação expressa de películas Winf™ Premium de controle solar.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Q4 2026 */}
                  <div className="bg-[#121212] border border-[#444746] p-6 rounded-none relative overflow-hidden group hover:border-[#444746] transition-all">
                    <div className="absolute top-4 right-4 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-none uppercase tracking-wider font-bold">
                      Q4 2026
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-none bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        CO
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">Sede Andina Colômbia</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-400 font-light leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 mt-1.5 shrink-0" />
                        <span>Estabelecimento do escritório central andino em Bogotá, integrando canais digitais automatizados.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 mt-1.5 shrink-0" />
                        <span>Parceria estratégica com os maiores escritórios de engenharia civil para especificação obrigatória Winf.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Additional Strategic KPI info */}
                <div className="p-6 bg-gradient-to-r from-blue-900/10 to-transparent border border-blue-500/20 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold uppercase tracking-wide text-blue-400 flex items-center gap-2">
                      <ShieldCheck size={16} /> Meta Estratégica Latam Matrix
                    </h5>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xl">
                      Nosso objetivo para 2026 é atingir mais de <strong>200 licenciados ativos</strong> com o ecossistema asset-light e capturar 35% de market share em películas de controle solar premium nas capitais-foco.
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap shrink-0">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Faturamento Projetado</p>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter">USD $5.2M</p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t border-[#444746] flex justify-end">
                <button 
                  onClick={() => setShowRoadmapModal(false)}
                  className="px-6 py-3 bg-white text-black hover:bg-zinc-200 transition-colors text-xs font-bold uppercase tracking-widest rounded-none"
                >
                  Confirmar Planejamento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardMatrix;
