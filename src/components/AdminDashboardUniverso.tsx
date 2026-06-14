import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, BarChart2, CheckCircle2, XCircle, Search, ChevronRight, Download, Clock } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { UniversoDarkSeat, User } from '../types';
import { AdminTerritories } from './AdminTerritories';

interface AdminDashboardUniversoProps {
  user: User | null;
}

export const AdminDashboardUniverso: React.FC<AdminDashboardUniversoProps> = ({ user }) => {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      // Assuming investments are stored in 'universo_investments'
      const q = query(collection(db, 'universo_investments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestments(data);
    } catch (error) {
      console.error("Error fetching investments: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'universo_investments', id), {
        status: 'approved',
        updatedAt: Date.now()
      });
      fetchInvestments();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const filteredInvestments = investments.filter(inv => 
    inv.investorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.seatCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvested = investments.filter(i => i.status === 'approved').reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const pendingRequests = investments.filter(i => i.status === 'pending').length;

  if (!user || (user.role !== 'Admin' && user.role !== 'ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-red-500/20 bg-red-500/5">
        <Shield size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2 uppercase">Acesso Negado</h2>
        <p className="text-sm text-zinc-400">Você não tem privilégios de administrador para visualizar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in w-full text-zinc-100 max-w-[1400px] mx-auto pb-20 font-sans tracking-tight">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#444746]/60 pb-6 px-4 md:px-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1 flex items-center gap-3">
            <Shield className="text-white" /> Painel de Controle Admin
          </h2>
          <p className="text-xs md:text-sm font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
            Gestão de Investidores Universo Dark | Módulo W12
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4 text-sm font-mono">
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total Aprovado (BRL)</p>
            <p className="text-2xl text-zinc-300 font-bold tracking-tight">R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-right border-l border-[#444746]/60 pl-4 font-mono">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Pedidos Pendentes</p>
            <p className="text-2xl text-white font-bold tracking-tight">{pendingRequests}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-4 md:px-0">
        {[{ title: 'Usuários Ativos', val: investments.length, desc: 'Total Registrado', icon: <Users size={20} /> },
          { title: 'Taxa de Conversão', val: investments.length ? Math.round((investments.filter(i=>i.status==='approved').length / investments.length)*100)+'%' : '0%', desc: 'Aportes Aprovados', icon: <Activity size={20} /> },
          { title: 'Relatório Consolidado', val: 'Export', desc: 'Gerar arquivo (CSV)', icon: <Download size={20} /> }
        ].map((k, i) => (
          <div key={i} className="bg-white/[0.02] border border-[#444746]/60 p-6 md:p-8 flex flex-col justify-between group hover:bg-white/[0.04] transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/50 group-hover:text-zinc-300 transition-colors">{k.icon}</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">{k.desc}</span>
            </div>
            <div>
              <p className="text-3xl font-light text-white mb-1 tracking-tight">{k.val}</p>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{k.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <AdminTerritories />

      <div className="bg-white/[0.02] border border-[#444746]/60 p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2 mb-2 font-mono">
          <Activity size={16} className="animate-pulse" /> Status da Unidade Piloto: Santos (Ativa)
        </h3>
        <p className="text-xs text-white/70 leading-relaxed font-light">Tudo operando conforme protocolos AeroCore™ e ativado online no ledger central.</p>
      </div>

      <div className="bg-[#131314] border border-[#444746]/60 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
            <BarChart2 size={16} className="text-white" /> Solicitações e Aportes
          </h3>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="Buscar investidor..."
              className="bg-white/[0.02] border border-[#444746]/60 pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#444746]/60 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                <th className="p-4 font-normal">Data</th>
                <th className="p-4 font-normal">Investidor</th>
                <th className="p-4 font-normal">Cadeira / Cota</th>
                <th className="p-4 font-normal text-right">Valor (R$)</th>
                <th className="p-4 font-normal text-center">Status</th>
                <th className="p-4 font-normal text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Carregando dados...</td></tr>
              ) : filteredInvestments.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Nenhum aporte encontrado.</td></tr>
              ) : (
                filteredInvestments.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#444746] hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-zinc-400 font-mono">
                      {new Date(inv.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {inv.investorName}
                      <span className="block text-sm text-zinc-500 font-normal leading-relaxed">{inv.investorEmail}</span>
                    </td>
                    <td className="p-4 text-zinc-300">
                      {inv.seatCode}
                    </td>
                    <td className="p-4 text-right font-mono text-white tracking-tight">
                      {inv.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      {inv.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-green-500 uppercase bg-green-500/10 px-2 py-1 rounded-none">
                          <CheckCircle2 size={12} /> Aprovado
                        </span>
                      ) : inv.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-500 uppercase bg-red-500/10 px-2 py-1 rounded-none">
                          <XCircle size={12} /> Rejeitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-500 uppercase bg-yellow-500/10 px-2 py-1 rounded-none">
                          <Clock size={12} /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {inv.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleApprove(inv.id)} className="p-2 border border-green-500/30 text-green-500 hover:bg-green-500/20 transition-colors cursor-pointer" title="Aprovar">
                            <CheckCircle2 size={16} />
                          </button>
                          <button className="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer" title="Rejeitar">
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                      {inv.status !== 'pending' && (
                        <button className="p-2 text-zinc-600 hover:text-white transition-colors cursor-pointer">
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
