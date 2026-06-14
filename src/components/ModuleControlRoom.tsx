import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, ShieldCheck, Zap, Network, Database, MessageSquare, Terminal, Globe, Search, Clock, ChevronRight, MapPin, Box, ArrowUpRight, Cpu } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useWinf, OperationType, handleFirestoreError } from '../contexts/WinfContext';
import { WinfCliSimulator } from './WinfCliSimulator';

const ModuleControlRoom: React.FC = () => {
  const { user, isAuthenticated } = useWinf();
  const [logs, setLogs] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentInstallations, setRecentInstallations] = useState<any[]>([]);
  const [assetLights, setAssetLights] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'terminal' | 'asset_lights'>('terminal');
  const [controlTerminalView, setControlTerminalView] = useState<'cli' | 'streams'>('cli');

  const [stats, setStats] = useState({
    totalLeads: 0,
    activeAgents: 8,
    certificatesIssued: 0,
    assetLightCount: 0
  });

  useEffect(() => {
    if (!db || !isAuthenticated || !user) return;
    if (user.id.startsWith('proto-')) return;
    
    const isAdmin = user.role === 'Admin';

    // Listen to Agent Logs
    const qLogs = isAdmin 
      ? query(collection(db, 'agent_logs'), orderBy('created_at', 'desc'), limit(15))
      : query(collection(db, 'agent_logs'), where('user_id', '==', user.id), orderBy('created_at', 'desc'), limit(15));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: new Date(doc.data().created_at).toLocaleTimeString()
      }));
      setLogs(fetchedLogs);
    }, (error) => {
      console.error('Error in agent_logs listener:', error);
      if (error.code === 'permission-denied') {
        try {
          handleFirestoreError(error, OperationType.GET, 'agent_logs');
        } catch (e) {}
      }
    });

    // Listen to Recent Leads
    const qLeads = isAdmin 
      ? query(collection(db, 'leads'), orderBy('created_at', 'desc'), limit(10))
      : query(collection(db, 'leads'), where('user_id', '==', user.id), orderBy('created_at', 'desc'), limit(10));

    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
      const fetchedLeads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentLeads(fetchedLeads);
      setStats(prev => ({ ...prev, totalLeads: snapshot.size }));
    }, (error) => {
      console.error('Error in leads listener:', error);
      if (error.code === 'permission-denied') {
        try {
          handleFirestoreError(error, OperationType.GET, 'leads');
        } catch (e) {}
      }
    });

    // Listen to Recent Installations
    const qInst = query(collection(db, 'installations'), orderBy('created_at', 'desc'), limit(10));
    const unsubInst = onSnapshot(qInst, (snapshot) => {
      const fetchedInst = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentInstallations(fetchedInst);
      setStats(prev => ({ ...prev, certificatesIssued: snapshot.size }));
    }, (error) => {
      console.error('Error in installations listener:', error);
      if (error.code === 'permission-denied') {
        try {
          handleFirestoreError(error, OperationType.GET, 'installations');
        } catch (e) {}
      }
    });

    // Fetch Asset Lights (Users with role 'Licenciado' representing the Asset Light Network)
    if (isAdmin) {
      const fetchAssetLights = async () => {
        try {
          const qAL = query(collection(db, 'users'), where('role', '==', 'Licenciado'));
          const snapshot = await getDocs(qAL);
          const alNodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Mock some extra active Asset Lights to reflect the expansion goal
          const mockALs = [
            { id: 'al-1', name: 'Winf Asset Light - Alphaville', company: 'Studio Alpha', email: 'alpha@partner.winf.com', stock_health: '98%', status: 'Active', location: 'Barueri, SP' },
            { id: 'al-2', name: 'Winf Asset Light - Sul', company: 'Prime Films', email: 'prime@partner.winf.com', stock_health: '75%', status: 'Active', location: 'Curitiba, PR' },
            { id: 'al-3', name: 'Winf Asset Light - Nordeste Hub', company: 'Winf NE', email: 'ne@partner.winf.com', stock_health: '40%', status: 'Warning', location: 'Recife, PE' },
            { id: 'al-4', name: 'Winf Asset Light - Miami', company: 'Winf US South', email: 'miami@partner.winf.com', stock_health: '100%', status: 'Active', location: 'Miami, FL (US)' },
          ];
          
          setAssetLights([...alNodes, ...mockALs]);
          setStats(prev => ({ ...prev, assetLightCount: alNodes.length + mockALs.length }));
        } catch (error) {
          console.error("Failed to fetch Asset Lights", error);
        }
      };
      fetchAssetLights();
    } else {
      setAssetLights([]);
      setStats(prev => ({ ...prev, assetLightCount: 1 }));
    }

    return () => {
      unsubLogs();
      unsubLeads();
      unsubInst();
    };
  }, [isAuthenticated, user]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">WINF CORE COMMAND</h1>
          </div>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Global Asset Light Management & AI Uplink</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-none">
          <div className="w-2 h-2 rounded-none bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Sinf-Chain Online</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Asset Lights Ativados', value: `${stats.assetLightCount} / 100`, icon: Network, color: 'blue' },
          { label: 'Geração de Leads', value: stats.totalLeads, icon: Users, color: 'zinc' },
          { label: 'Garantias Emitidas', value: stats.certificatesIssued, icon: ShieldCheck, color: 'green' },
          { label: 'Agentes IA no Fluxo', value: stats.activeAgents, icon: Zap, color: 'zinc' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#131314] border border-[#444746] p-6 rounded-none group hover:border-winf-primary/30 transition-all relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 bg-${stat.color}-500/10 rounded-none group-hover:bg-${stat.color}-500/20 transition-colors border border-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1 relative z-10">{stat.value}</p>
            <p className="text-xs text-white/40 uppercase tracking-widest relative z-10">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#444746]">
        <button 
          onClick={() => setActiveTab('terminal')}
          className={`px-6 py-4 text-xs md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'terminal' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-2"><Terminal size={14} /> Neural Terminal</div>
        </button>
        <button 
          onClick={() => setActiveTab('asset_lights')}
          className={`px-6 py-4 text-xs md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'asset_lights' ? 'bg-white/5 text-white border-b-2 border-cyan-500' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-2"><Globe size={14} /> Malha Asset Light</div>
        </button>
      </div>

      {activeTab === 'terminal' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive WINF-CLI Shell vs Live Stream Activity */}
          <div className="lg:col-span-2 bg-[#131314] border border-[#444746] rounded-none overflow-hidden flex flex-col min-h-[650px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="bg-[#131314]/60 border-b border-[#444746] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-none bg-red-500/50 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-none bg-white/50 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-none bg-cyan-500/50 animate-pulse delay-150"></div>
                </div>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <Terminal className="w-4 h-4 text-white" />
                <h3 className="text-xs md:text-[10px] font-mono text-white/60 uppercase tracking-[0.3em]">WINF_OS_COMMAND_CENTER</h3>
              </div>
              
              {/* Selector Tabs */}
              <div className="flex border border-[#444746] rounded-none overflow-hidden font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setControlTerminalView('cli')}
                  className={`px-3 py-1.5 font-bold uppercase tracking-widest transition-colors cursor-pointer select-none ${controlTerminalView === 'cli' ? 'bg-white text-black' : 'bg-transparent text-white/50 hover:text-white'}`}
                >
                  [WINF-CLI SHELL]
                </button>
                <button
                  type="button"
                  onClick={() => setControlTerminalView('streams')}
                  className={`px-3 py-1.5 font-bold uppercase tracking-widest transition-colors cursor-pointer select-none ${controlTerminalView === 'streams' ? 'bg-white text-black' : 'bg-transparent text-white/50 hover:text-white'}`}
                >
                  [SYSTEM LOGS STREAMS]
                </button>
              </div>
            </div>
            
            {/* View Switching */}
            {controlTerminalView === 'cli' ? (
              <div className="p-6 flex-1 bg-[#131314]/40 overflow-y-auto">
                <WinfCliSimulator />
              </div>
            ) : (
              <div className="p-6 flex-1 overflow-y-auto font-mono text-xs md:text-[10px] space-y-4 custom-scrollbar bg-[#131314]/80">
                {/* Pending Leads Section */}
                {recentLeads.filter(l => l.agent_status === 'pending').map((lead, i) => (
                  <motion.div 
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 group border-l-2 border-cyan-500/50 pl-4 py-1"
                  >
                    <span className="text-cyan-400 shrink-0 font-bold tracking-tighter">[LEAD_INTERCEPT]</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="font-black tracking-tight px-1.5 py-0.5 rounded-none bg-cyan-500/10 text-cyan-400">
                        WINF CONCIERGE AI™
                      </span>
                      <span className="text-gray-800">::</span>
                      <span className="text-white/40">Qualificando prospect: <span className="text-white">{lead.name}</span> ({lead.city || 'Desconhecido'})</span>
                    </div>
                  </motion.div>
                ))}

                {/* Logs Section */}
                {logs.map((log, i) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 group hover:bg-white/5 p-1 transition-colors"
                  >
                    <span className="text-gray-700 shrink-0 font-bold tracking-tighter">[{log.time}]</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className={`font-black tracking-tight px-1.5 py-0.5 rounded-none border ${
                        log.agentType?.includes('Sales') ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        log.agentType?.includes('B2B') ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        'bg-white/5 text-white/80 border-[#444746]'
                      }`}>
                        {log.agentType || log.agent || 'SYSTEM_LOG'}
                      </span>
                      <span className="text-gray-800">::</span>
                      <span className="text-white/60 group-hover:text-white transition-colors">{log.action || log.details}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Registry */}
          <div className="bg-[#131314] border border-[#444746] rounded-none flex flex-col h-[650px] shadow-2xl">
            <div className="p-6 border-b border-[#444746] flex items-center justify-between bg-[#131314]/40">
              <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs md:text-[10px]">Real-Time Registry / Emitidos</h3>
              <Database className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              <AnimatePresence>
                {recentInstallations.map((inst, i) => (
                  <motion.div 
                    key={inst.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-zinc-900 border border-[#444746] p-5 rounded-none hover:border-cyan-500/30 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-mono text-white/50 font-bold tracking-widest">{inst.id}</span>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-none border ${
                        inst.status === 'completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/10 border-[#444746]'
                      }`}>
                        <ShieldCheck className={`w-3 h-3 ${inst.status === 'completed' ? 'text-green-500' : 'text-white'}`} />
                        <span className={`text-[10px] md:text-[8px] font-black uppercase tracking-widest ${
                          inst.status === 'completed' ? 'text-green-500' : 'text-white'
                        }`}>
                          {inst.status === 'completed' ? 'Garantia Emitida' : 'Processando'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-black text-white mb-1 uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{inst.client_name}</p>
                    <p className="text-xs md:text-[10px] text-zinc-400 mb-3 font-medium">{inst.product_name}</p>
                    <div className="flex items-center gap-2 text-[10px] md:text-[8px] text-cyan-600/80 font-mono uppercase tracking-widest border-t border-[#444746] pt-3">
                      <MapPin className="w-3 h-3" />
                      LOC: {inst.city || 'Central Base'}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'asset_lights' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          <div className="bg-[#131314] border border-[#444746] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Expansão da Rede Asset Light</h2>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Monitoramento dos pólos avançados da Winf. Nossa meta global imediata é validar <b className="text-white">100 unidades Asset Light</b> operacionais sob jurisdição do Board W12, garantindo dominância geográfica e escoamento acelerado de estoque através da Sinf-Chain.
              </p>
              <div className="w-full bg-zinc-900 border border-[#444746] h-3 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-1000 relative"
                  style={{ width: `${(stats.assetLightCount / 100) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Penetração Inicial</span>
                <span className="text-[10px] font-black text-cyan-400 font-mono tracking-widest">{stats.assetLightCount}/100 ALs</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <div className="bg-green-500/10 border border-green-500/20 p-4 shrink-0 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Supply Chain Sync</p>
                  <p className="text-sm font-black text-white">Online</p>
                </div>
                <Box className="w-6 h-6 text-green-500 opacity-50" />
              </div>
              <button 
                onClick={() => alert("Feature restrita. Iniciar Onboarding de novo Asset Light (Draft).")}
                className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-colors py-4 flex justify-center items-center gap-2"
              >
                + Adicionar Polo Asset Light
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetLights.map((al, idx) => (
              <div key={idx} className="bg-[#131314] border border-[#444746] p-6 relative group hover:border-cyan-500/30 transition-colors">
                <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px]">
                  <span className={`px-2 py-0.5 font-bold uppercase tracking-widest border ${
                    al.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    al.status === 'Warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                    'bg-white/5 text-white/60 border-[#444746]'
                  }`}>
                    {al.status || 'Ativo'}
                  </span>
                </div>
                
                <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1 pr-16">{al.name || al.company || 'Novo Asset Light'}</h3>
                <p className="text-[10px] font-mono text-zinc-500 mb-4">{al.email}</p>
                
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                  <MapPin size={12} className="text-cyan-500" />
                  <span>{al.location || al.address?.city || 'Local não definido'}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#444746] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Saúde do Estoque</span>
                    <span className={`text-[10px] font-mono font-bold ${
                      parseInt(al.stock_health || '100') < 50 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {al.stock_health || '100%'}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 border border-[#444746] h-1">
                    <div 
                      className={`h-full ${parseInt(al.stock_health || '100') < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: al.stock_health || '100%' }}
                    />
                  </div>
                </div>
                
                <button className="w-full mt-6 flex justify-between items-center py-2 px-3 border border-[#444746] hover:border-[#444746] bg-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-white tracking-widest">Gerenciar Polo</span>
                  <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-white" />
                </button>
              </div>
            ))}
          </div>

        </motion.div>
      )}
    </div>
  );
};

export default ModuleControlRoom;
