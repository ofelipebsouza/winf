import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Activity, 
  Shield, Clock, TrendingUp, BarChart2,
  ChevronRight, Lock, FileText, Globe, DollarSign, Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { UniversoDarkSeat } from '../types';
import { ImportSimulator } from './ImportSimulator';

const DATA_VALUATION = [
  { term: '1Q25', value: 15, volume: 1.2 },
  { term: '2Q25', value: 18, volume: 1.8 },
  { term: '3Q25', value: 24, volume: 2.1 },
  { term: '4Q25', value: 31, volume: 3.4 },
  { term: '1Q26', value: 45, volume: 6.2 },
  { term: '2Q26', value: 68.5, volume: 8.5 },
];

const TICKERS = [
  { id: 'WINF.Q', label: 'WINF GLOBAL', price: 'USD 42.50', change: '+2.4%', up: true },
  { id: 'ALGT.NA', label: 'ASSET LIGHT IDX', price: 'USD 18.20', change: '+1.1%', up: true },
  { id: 'W12.B', label: 'W12 BOARD', price: 'USD 1,245.00', change: '+0.5%', up: true },
  { id: 'BSHP.US', label: 'BLACKSHOP RETAIL', price: 'USD 8.40', change: '-0.2%', up: false }
];

interface InvestorDashboardProps {
  user: FirebaseUser | null;
  purchasedSeats?: UniversoDarkSeat[];
  onAccessDataRoom?: () => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ user: parentUser, purchasedSeats = [], onAccessDataRoom }) => {
  const [user, setUser] = useState<FirebaseUser | null>(parentUser);
  const [userName, setUserName] = useState('');
  const [notification, setNotification] = useState('');
  const [activeTab, setActiveTab] = useState<'geral' | 'extrato' | 'aportes' | 'simulador' | 'relatorios'>('geral');
  
  const [investments, setInvestments] = useState<any[]>([]);
  const [dividends, setDividends] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [simValue, setSimValue] = useState<number>(15000);
  const [simMonths, setSimMonths] = useState<number>(12);
  const [simScenario, setSimScenario] = useState<'initial' | 'boosted'>('initial');
  const [customAporteValue, setCustomAporteValue] = useState<number>(150000);

  // States para Auditoria Real-Time de Logística & Rendimento
  const [ocupacaoRede, setOcupacaoRede] = useState<number>(85); // % de ocupação para valuation
  const [estoquesHubs, setEstoquesHubs] = useState<any>(() => {
    try {
      const stor = localStorage.getItem('wno_hubs_estoque');
      return stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
    } catch {
      return { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
    }
  });

  const [unidadeLastros, setUnidadeLastros] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('ray_unidades_lastros_faturamento');
      return saved ? JSON.parse(saved) : { CAMPINAS: 150, SAO_BERNARDO: 80, MIGUEL_PEREIRA: 40 };
    } catch {
      return { CAMPINAS: 150, SAO_BERNARDO: 80, MIGUEL_PEREIRA: 40 };
    }
  });

  const [ledgerInputs, setLedgerInputs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ray_ledger_inputs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Hook para sincronismo dinâmico (latência zero de liquidação física)
  useEffect(() => {
    const carregarEstoques = () => {
      try {
        const stor = localStorage.getItem('wno_hubs_estoque');
        if (stor) setEstoquesHubs(JSON.parse(stor));
      } catch (e) {
        console.error(e);
      }
    };
    const carregarLastros = () => {
      try {
        const saved = localStorage.getItem('ray_unidades_lastros_faturamento');
        if (saved) setUnidadeLastros(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    const carregarLedger = () => {
      try {
        const saved = localStorage.getItem('ray_ledger_inputs');
        if (saved) setLedgerInputs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };

    // Sincronizar dados imediatamente
    carregarEstoques();
    carregarLastros();
    carregarLedger();

    window.addEventListener('wno_hubs_estoque_updated', carregarEstoques);
    window.addEventListener('ray_unidades_lastros_updated', carregarLastros);
    window.addEventListener('ray_ledger_updated', carregarLedger);

    return () => {
      window.removeEventListener('wno_hubs_estoque_updated', carregarEstoques);
      window.removeEventListener('ray_unidades_lastros_updated', carregarLastros);
      window.removeEventListener('ray_ledger_updated', carregarLedger);
    };
  }, []);

  const getSoldFromLedger = (locName: string) => {
    try {
      const normLoc = locName.toUpperCase().trim();
      const inputs = ledgerInputs.filter((item: any) => {
        const itemLoc = (item.localizacao || '').toUpperCase().trim();
        return itemLoc === normLoc && item.quantidade < 0;
      });
      return inputs.reduce((sum: number, item: any) => sum + Math.abs(item.quantidade), 0);
    } catch {
      return 0;
    }
  };

  const simularFaturamentoDireto = (locName: string, metros: number) => {
    const normLoc = locName.toUpperCase().trim();
    const auditHash = `AUTH-AUDIT-SHA256-0x${Math.floor(Math.random() * 99999999).toString(16).toUpperCase()}`;
    
    try {
      const isHub = ['SANTOS', 'SOROCABA', 'SAO_PAULO'].includes(normLoc);
      if (isHub) {
        const stor = localStorage.getItem('wno_hubs_estoque');
        const est = stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
        est[normLoc] = Math.max(0, (est[normLoc] || 0) - metros);
        localStorage.setItem('wno_hubs_estoque', JSON.stringify(est));
        window.dispatchEvent(new Event('wno_hubs_estoque_updated'));
      } else {
        const saved = localStorage.getItem('ray_unidades_lastros_faturamento');
        const lastros = saved ? JSON.parse(saved) : { CAMPINAS: 150, SAO_BERNARDO: 80, MIGUEL_PEREIRA: 40 };
        lastros[normLoc] = Math.max(0, (lastros[normLoc] || 0) - metros);
        localStorage.setItem('ray_unidades_lastros_faturamento', JSON.stringify(lastros));
        window.dispatchEvent(new Event('ray_unidades_lastros_updated'));
      }

      const savedLedger = localStorage.getItem('ray_ledger_inputs');
      const list = savedLedger ? JSON.parse(savedLedger) : [];
      list.push({
        produto: 'Invisible® Series',
        quantidade: -metros,
        valorUnitario: 150,
        hash: auditHash,
        localizacao: normLoc,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ray_ledger_inputs', JSON.stringify(list));
      window.dispatchEvent(new Event('ray_ledger_updated'));
      
      setNotification(`Faturamento direto efetuado em ${locName}: -${metros}m² liquidados. Sincronia real-time ativa!`);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (parentUser?.uid === 'dev-mode') {
      setUser(parentUser);
      setUserName('Dev User');
      fetchInvestorData('dev-mode');
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (user?.uid === 'dev-mode') return;
      setUser(currentUser);
      if (currentUser) {
        fetchInvestorData(currentUser.uid);
      } else {
        setInvestments([]);
        setDividends([]);
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, [parentUser, user?.uid, purchasedSeats]);

  const fetchInvestorData = async (uid: string) => {
    setLoadingData(true);
    try {
      if (uid !== 'dev-mode') {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserName(userDocSnap.data().name || '');
        }
      }

      let _investments: any[] = [];
      let _dividends: any[] = [];

      if (uid !== 'dev-mode') {
        const invQuery = query(collection(db, 'investments'), where('userId', '==', uid));
        const invSnapshot = await getDocs(invQuery);
        _investments = invSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const divQuery = query(collection(db, 'dividends'), where('userId', '==', uid));
        const divSnapshot = await getDocs(divQuery);
        _dividends = divSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      
      if (_investments.length === 0) {
        if (purchasedSeats && purchasedSeats.length > 0) {
           _investments = purchasedSeats.map((seat, idx) => ({
             id: `seat-${idx}`,
             poolId: seat.code || 'W12 SEAT',
             amount: parseInt(seat.price.replace(/\D/g, '')),
             shares: 1000,
             status: 'Active',
             title: seat.r
           }));
        } else {
            _investments = [
              { id: '1', poolId: 'BLACKSHOP SUPPLY', amount: 30000, shares: 1200, status: 'Active', title: 'Cota de Abastecimento BlackShop' },
              { id: '2', poolId: 'W12 MASTER', amount: 1200000, shares: 10000, status: 'Active', title: 'W12 Global Board Seat' }
            ];
        }
      }
      
      if (_dividends.length === 0) {
        _dividends = [
          { id: 1, type: 'credit', title: 'Q2 Dividend Payout (ALGT Pool)', date: '2026-05-12', amount: '+ 12,450.00', currency: 'BRL', status: 'Settled' },
          { id: 2, type: 'credit', title: 'BlackShop Yield Distribution (BSHP)', date: '2026-05-05', amount: '+ 4,230.00', currency: 'BRL', status: 'Settled' },
          { id: 3, type: 'investment', title: 'Capital Call (W12 Series A)', date: '2026-04-28', amount: '- 15,000.00', currency: 'BRL', status: 'Executed' },
          { id: 4, type: 'credit', title: 'Q1 Dividend Payout (ALGT Pool)', date: '2026-04-12', amount: '+ 8,900.00', currency: 'BRL', status: 'Settled' }
        ];
      }

      setInvestments(_investments);
      setDividends(_dividends);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    if (user?.uid === 'dev-mode') {
      setUser(null);
      setInvestments([]);
      setDividends([]);
      setUserName('');
    } else {
      auth.signOut();
    }
  };

  const displayInvestments = simScenario === 'initial'
    ? [
        { id: 'al-init-1', poolId: 'ALGT.WINF.01', amount: 15000, shares: 1000, status: 'Active', title: 'Cota de Entrada (5 Asset Lights Ativos)' }
      ]
    : [
        { id: 'al-init-1', poolId: 'ALGT.WINF.01', amount: 15000, shares: 1000, status: 'Active', title: 'Cota de Entrada (5 Asset Lights Ativos)' },
        { id: 'al-boost-2', poolId: 'ALGT.XPAND.04', amount: customAporteValue, shares: 10000, status: 'Active', title: 'Aporte de Expansão e Escala Comercial' }
      ];

  const displayDividends = simScenario === 'initial'
    ? [
        { id: 'tx-1', type: 'credit', title: 'Rendimento OS - Node Santos-Alpha (100% Ativo)', date: '21/05/2026', amount: '+ 360,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-2', type: 'credit', title: 'Rendimento OS - São Paulo Studio (100% Ativo)', date: '20/05/2026', amount: '+ 900,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-3', type: 'credit', title: 'Rendimento OS - Campinas Mobile (100% Ativo)', date: '18/05/2026', amount: '+ 500,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-4', type: 'credit', title: 'Rendimento OS - Curitiba Prime (100% Ativo)', date: '15/05/2026', amount: '+ 420,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-5', type: 'credit', title: 'Rendimento OS - Belo Horizonte Base (100% Ativo)', date: '12/05/2026', amount: '+ 380,00', currency: 'R$', status: 'Settled' }
      ]
    : [
        { id: 'tx-b1', type: 'credit', title: 'Royalties Compartilhados BlackShop Network', date: '22/05/2026', amount: '+ 18.520,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-b2', type: 'credit', title: 'Aporte de Expansão Integrado (Sinf-Chain)', date: '22/05/2026', amount: `+ ${customAporteValue.toLocaleString('pt-BR')},00`, currency: 'R$', status: 'Settled' },
        { id: 'tx-b3', type: 'credit', title: 'Yield Pool Global (25 Asset Lights Ativos)', date: '21/05/2026', amount: '+ 6.450,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-1-b', type: 'credit', title: 'Rendimento OS - Node Santos-Alpha', date: '21/05/2026', amount: '+ 360,00', currency: 'R$', status: 'Settled' },
        { id: 'tx-2-b', type: 'credit', title: 'Rendimento OS - São Paulo Studio', date: '20/05/2026', amount: '+ 900,00', currency: 'R$', status: 'Settled' }
      ];

const renderExtrato = () => (
    <div className="bg-[#111113] border border-[#27272A] p-5 md:p-8 rounded-none animate-fade-in">
      <h3 className="text-base md:text-lg font-semibold text-[#E4E4E7] uppercase tracking-wider mb-6 flex items-center gap-2">
        <Activity size={18} className="text-[#0284C7]" /> Histórico de Transações & Movimentações
      </h3>
      
      {/* Mobile Card-Based List */}
      <div className="block md:hidden space-y-4">
        {displayDividends.map((tx: any) => (
          <div key={tx.id} className="p-5 bg-[#151518] border border-[#27272A] rounded-none space-y-3">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-[#71717A]">{tx.date}</span>
              <span className={`px-2.5 py-1 text-sm font-bold rounded-none uppercase ${
                tx.status === 'Settled' || tx.status === 'Executed'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-white/5 text-zinc-400 border border-[#27272A]'
              }`}>
                {tx.status}
              </span>
            </div>
            <p className="text-base font-semibold text-[#E4E4E7]">{tx.title}</p>
            <div className="flex justify-between items-center pt-2 border-t border-[#27272A]/40">
              <span className="text-xs text-[#71717A] uppercase font-mono">Valor:</span>
              <span className={`text-base font-bold font-mono ${tx.type === 'credit' ? 'text-green-400' : 'text-zinc-300'}`}>
                {tx.currency} {tx.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Responsive Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm font-mono">
          <thead>
            <tr className="text-[#71717A] border-b border-[#27272A]">
              <th className="font-semibold pb-4 text-xs uppercase tracking-wider">Data / Hora</th>
              <th className="font-semibold pb-4 text-xs uppercase tracking-wider">Descrição</th>
              <th className="font-semibold pb-4 text-xs uppercase tracking-wider text-right">Valor</th>
              <th className="font-semibold pb-4 text-xs uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayDividends.map((tx: any, idx: number) => (
              <tr key={tx.id} className={`border-b border-[#27272A]/40 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-[#151518]'}`}>
                <td className="py-5 text-zinc-400 text-sm">{tx.date}</td>
                <td className="py-5 text-[#E4E4E7] font-sans font-medium text-sm">{tx.title}</td>
                <td className={`py-5 text-right font-bold text-sm ${tx.type === 'credit' ? 'text-green-400' : 'text-zinc-300'}`}>
                  {tx.currency} {tx.amount}
                </td>
                <td className="py-5 text-right">
                  <span className={`px-2 py-1 uppercase text-xs rounded-none font-bold ${tx.status === 'Settled' || tx.status === 'Executed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/10 text-zinc-300'}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAportes = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#111113] border border-[#27272A] p-6 md:p-8 rounded-none">
         <h3 className="text-lg font-bold text-[#E4E4E7] uppercase tracking-wider mb-2 flex items-center gap-2">
           <DollarSign size={18} className="text-[#0284C7]" /> Aportes & Aquisição de Quotas
         </h3>
         <p className="text-base text-[#71717A] mb-8 max-w-2xl leading-relaxed">
           Aumente sua participação no ecossistema e escale seus dividendos. Cada quota de fomento BlackShop™ adiciona R$ 15.000,00 no seu principal e aumenta o Share no Profit Pool.
         </p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#27272A] p-6 md:p-8 bg-[#151518] relative overflow-hidden rounded-none hover:border-zinc-500 transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-white"><Shield size={64}/></div>
               <h4 className="text-xl font-black text-[#E4E4E7] mb-1 tracking-tight">Cota de Distribuição BlackShop™</h4>
               <p className="text-base text-green-400 font-mono mb-4 uppercase tracking-wider">Rendimento Est.: R$ 1.500/mês</p>
               <div className="text-4xl font-bold text-[#E4E4E7] mb-6 tracking-tight font-mono">
                 R$ 15.000,00
               </div>
               <button onClick={() => setNotification('Token gerado. Entre em contato com a mesa de operações para finalizar.')} className="w-full bg-[#E4E4E7] hover:bg-white text-black font-extrabold uppercase tracking-wider text-xs py-4 rounded-none transition-colors cursor-pointer min-h-[48px]">
                 Emitir Contrato & Pagamento
               </button>
            </div>
            <div className="border border-[#0284C7]/30 p-6 md:p-8 bg-[#0284C7]/5 relative overflow-hidden rounded-none hover:border-[#0284C7] transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-[#0284C7]"><Globe size={64}/></div>
               <h4 className="text-xl font-black text-[#E4E4E7] mb-1 tracking-tight">Upgrade p/ Cadeira W12</h4>
               <p className="text-base text-green-400 font-mono mb-4 uppercase tracking-wider">Yield Share: 4% ~ 8%</p>
               <div className="text-4xl font-bold text-[#E4E4E7] mb-6 tracking-tight font-mono">
                 Sob Consulta
               </div>
               <button onClick={() => setNotification('Solicitação de Due Diligence enviada para o board.')} className="w-full bg-[#0284C7] text-white font-extrabold uppercase tracking-wider text-xs py-4 rounded-none hover:bg-[#0284C7]/80 transition-colors cursor-pointer min-h-[48px]">
                 Aplicar para W12 Master
               </button>
            </div>
         </div>
      </div>
    </div>
  );

  const calculateSim = () => {
    // Rendimento médio conservador 12% a.m
    const rendimentoMensal = simValue * 0.12;
    const rendimentoTotal = rendimentoMensal * simMonths;
    const finalExato = simValue + rendimentoTotal;
    return {
      mensal: rendimentoMensal,
      total: rendimentoTotal,
      final: finalExato
    };
  };

  const simResult = calculateSim();

  const renderSimulador = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#131314] border border-[#444746] p-6 md:p-8">
         <h3 className="text-base font-mono text-white uppercase tracking-widest mb-6 flex items-center gap-2">
           <TrendingUp size={18} className="text-[#0284C7]" /> Simulador Estimado de Rentabilidade Passiva
         </h3>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">Capital Inicial (Aporte)</label>
                <div className="text-3xl font-mono text-white mb-4">R$ {simValue.toLocaleString('pt-BR')}</div>
                <input 
                  type="range" 
                  min="5000" 
                  max="100000" 
                  step="5000" 
                  value={simValue} 
                  onChange={(e) => setSimValue(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">Período de Acumulação (Meses)</label>
                <div className="text-3xl font-mono text-white mb-4">{simMonths} Meses</div>
                <input 
                  type="range" 
                  min="6" 
                  max="60" 
                  step="6" 
                  value={simMonths} 
                  onChange={(e) => setSimMonths(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>

            <div className="bg-[#131314] border border-[#444746] p-6 md:p-8 flex flex-col justify-center">
               <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-[#444746] pb-4">
                    <span className="text-sm text-zinc-400 font-sans leading-relaxed">Retorno Mensal Estimado</span>
                    <span className="text-xl font-mono text-green-400 font-bold">+ R$ {simResult.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-[#444746] pb-4">
                    <span className="text-sm text-zinc-400 font-sans leading-relaxed">Retorno Acumulado no Período</span>
                    <span className="text-xl font-mono text-white font-bold">+ R$ {simResult.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1 font-bold">Patrimônio Final Projetado</span>
                      <span className="text-sm text-zinc-600 font-sans leading-relaxed">Capital inicial + Juros Simples</span>
                    </div>
                    <span className="text-4xl font-mono font-bold text-white tracking-tight">R$ {simResult.final.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
               </div>
               <div className="mt-8 text-xs text-zinc-500 font-mono uppercase tracking-widest bg-white/5 p-4 rounded-none leading-relaxed">
                 * Projeção baseada em yield estimado de 24% a 36% ao ano sob regime SCP.<br/>Resultados passados não garantem rendimentos futuros.
               </div>
            </div>
         </div>
      </div>

      <ImportSimulator />
    </div>
  );

  const renderRelatorios = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-[#131314] border border-[#444746] p-6 md:p-8">
         <h3 className="text-sm font-mono text-white uppercase tracking-widest mb-6 flex items-center gap-2">
           <FileText size={18} className="text-zinc-500" /> Relatórios & Informe de Rendimentos (IRPF)
         </h3>
         <p className="text-xs text-zinc-400 font-sans mb-8">
           Faça o download dos extratos anuais consolidados e informes de rendimento declarados via Sociedade em Conta de Participação (SCP) ou Sociedade de Propósito Específico (SPE).
         </p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="border border-[#444746] bg-[#131314] p-6 hover:border-white/30 transition-colors cursor-pointer group" onClick={() => setNotification('Gerando IRPF 2025...')}>
              <Download className="text-zinc-500 group-hover:text-white transition-colors mb-4" size={24} />
              <h4 className="text-white font-bold text-sm mb-1 tracking-tight">Informe de Rendimentos 2025</h4>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Ano-calendário 2025</p>
           </div>
           <div className="border border-[#444746] bg-[#131314] p-6 hover:border-white/30 transition-colors cursor-pointer group opacity-50" onClick={() => setNotification('Informe de 2026 estará disponível após o encerramento do exercício.')}>
              <Download className="text-zinc-700 group-hover:text-zinc-500 transition-colors mb-4" size={24} />
              <h4 className="text-zinc-300 font-bold text-sm mb-1 tracking-tight">Informe de Rendimentos 2026</h4>
              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Aguardando fechamento</p>
           </div>
           <div className="border border-[#444746] bg-[#131314] p-6 hover:border-white/30 transition-colors cursor-pointer group" onClick={() => setNotification('Gerando Extrato do Mês Atual...')}>
              <Download className="text-zinc-500 group-hover:text-white transition-colors mb-4" size={24} />
              <h4 className="text-white font-bold text-sm mb-1 tracking-tight">Extrato Consolidado Mensal</h4>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Posição atualizada</p>
           </div>
         </div>
       </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-[#444746] bg-[#131314]">
        <Lock size={48} className="text-zinc-600 mb-6" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Acesso Restrito</h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
          Você precisa estar logado e possuir uma cota validada para acessar este Dashboard Bancário.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in w-full text-zinc-100 relative max-w-[1400px] mx-auto pb-20 font-sans tracking-tight">
      {loadingData && (
        <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center">
           <div className="animate-pulse flex flex-col items-center">
             <div className="w-12 h-1 border-t-2 border-white mb-4"></div>
             <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">CONNECTING TO MARKET DATA...</p>
           </div>
        </div>
      )}

      {/* User Info Header */}
      <div className="flex justify-between items-end mb-8 border-b border-[#444746] pb-6 px-4 md:px-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1">
            Olá, <span className="font-bold">{userName || user.displayName || 'Investidor'}</span>
          </h2>
          <p className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {user.email} | ID: {user.uid.substring(0, 8)}...
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
           <div className="w-2 h-2 rounded-none bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Ticker Tape */}
      <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar bg-[#131314] border-y border-[#444746] py-2 px-4 select-none">
        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0 mr-4">MARKET QUOTES (DELAYED)</div>
        {TICKERS.map(t => (
          <div key={t.id} className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-bold text-white tracking-wider">{t.id}</span>
            <span className="text-[11px] font-mono">{t.price}</span>
            <span className={`text-[10px] font-mono flex items-center ${t.up ? 'text-green-500' : 'text-red-500'}`}>
              {t.up ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
              {t.change}
            </span>
            <span className="w-px h-3 bg-white/10 ml-6"></span>
          </div>
        ))}
      </div>

      {/* Navigation Tabs - Highly Accessible Responsive Layout */}
      <div className="block md:hidden px-4">
        <label className="block text-xs uppercase font-mono text-[#71717A] tracking-wider mb-2 font-bold">Seção do Portfólio:</label>
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full bg-[#151518] border border-[#27272A] text-[#E4E4E7] py-3.5 px-4 rounded-none text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-[#0284C7] appearance-none cursor-pointer min-h-[48px]"
          >
            <option value="geral">📊 Visão Geral</option>
            <option value="extrato">📝 Extrato & Movimentações</option>
            <option value="aportes">💼 Meus Aportes</option>
            <option value="simulador">📈 Simulador de Retorno</option>
            <option value="relatorios font-mono">📁 Relatórios & IRPF</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E4E4E7]">
            <ChevronRight size={18} className="rotate-90 text-[#0284C7]" />
          </div>
        </div>
      </div>

      <div className="hidden md:flex border-b border-[#27272A] overflow-x-auto bg-[#111113]/80">
         {[
           { id: 'geral', label: 'Visão Geral' },
           { id: 'extrato', label: 'Extrato & Movimentações' },
           { id: 'aportes', label: 'Meus Aportes' },
           { id: 'simulador', label: 'Simulador' },
           { id: 'relatorios', label: 'Relatórios & IRPF' }
         ].map(t => (
           <button
             key={t.id}
             onClick={() => setActiveTab(t.id as any)}
             className={`px-6 py-4 text-xs md:text-sm uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 font-semibold ${
               activeTab === t.id 
                 ? 'border-[#0284C7] text-[#0284C7] bg-[#151518]' 
                 : 'border-transparent text-[#71717A] hover:text-[#E4E4E7]'
             }`}
           >
             {t.label}
           </button>
         ))}
      </div>

      {activeTab === 'geral' && (
      <div className="space-y-6">
        {/* Painel de Controle de Simulação e Status */}
        <div className="bg-gradient-to-r from-zinc-950 via-black to-zinc-950 border border-[#444746] p-6 md:p-8 rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-none blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs bg-white/5 border border-[#444746] text-zinc-300 px-2 py-0.5 font-mono uppercase tracking-widest">
                WINF CAPITAL MANAGEMENT // SIMULADOR DE JORNADA
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Simulador de Ativação & Aporte de Expansão Asset Light
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                O investidor entra na operação no "Início de Tudo" e já se depara com <span className="text-white font-bold">5 Asset Lights operando perfeitamente</span> nas regiões prioritárias. Simule abaixo o recebimento de aporte para habilitar a escala nacional!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <button 
                id="btn-scen-init"
                onClick={() => {
                  setSimScenario('initial');
                  setNotification('Cenário Restaurado: 5 Asset Lights ativos no início da operação.');
                }}
                className={`flex-1 lg:flex-none text-xs font-mono uppercase tracking-widest font-bold px-5 py-3 transition-all cursor-pointer ${
                  simScenario === 'initial'
                    ? 'bg-white text-black font-black font-bold'
                    : 'bg-[#131314] text-zinc-500 border border-[#444746] hover:text-white'
                }`}
              >
                1. Início da Operação (5 Asset Lights Ativos)
              </button>
              <button 
                id="btn-scen-boost"
                onClick={() => {
                  setSimScenario('boosted');
                  setNotification(`Aporte de R$ ${customAporteValue.toLocaleString('pt-BR')} integrado! Rede escalada para 25 polos.`);
                }}
                className={`flex-1 lg:flex-none text-xs font-mono uppercase tracking-widest font-bold px-5 py-3 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  simScenario === 'boosted'
                    ? 'bg-zinc-800 text-white font-black font-bold border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-red-950/20 text-red-400 border border-red-500/30 hover:bg-red-950/40'
                }`}
              >
                ⚡ 2. Simular Recebimento de Aporte (+ R$ {(150000).toLocaleString('pt-BR')})
              </button>
            </div>
          </div>
          
          {simScenario === 'boosted' && (
            <div className="mt-6 pt-6 border-t border-[#444746] grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Aporte Recebido</span>
                <span className="text-sm font-mono text-white">R$ {customAporteValue.toLocaleString('pt-BR')},00</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Polos Ativados</span>
                <span className="text-sm font-mono text-green-400">25 Unidades (+20)</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Faturamento Regional</span>
                <span className="text-sm font-mono text-white">R$ 130.500,00 OS / Mês</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block mb-1">Status de Escala</span>
                <span className="text-sm font-mono text-blue-400">WINF-CHAIN EXPANSION CODES ACTIVE</span>
              </div>
            </div>
          )}
        </div>

        {/* ==================== PANELS: W-NO™ REAL-TIME AUDIT COHESION CORE ==================== */}
        <div className="bg-[#131314] border border-[#444746] p-6 md:p-8 space-y-8 animate-fade-in">
          <div className="border-b border-[#444746] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-500/15 border border-purple-500/30 text-purple-400 px-2 py-0.5 font-mono uppercase tracking-widest font-bold">
                  AUDIT MODULE ACTIVE
                </span>
                <span className="text-xs bg-green-500/15 border border-green-500/30 text-green-400 px-2 py-0.5 font-mono uppercase tracking-widest font-bold">
                  SINF-CHAIN SYNC: 0.2s LATENCY
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white uppercase mt-2 flex items-center gap-2">
                <Shield size={18} className="text-purple-400 shrink-0" /> PAINEL DE AUDITORIA DE LASTRO, PREÇO E MARGEM LÍQUIDA (W-NO™ AUDIT CORE)
              </h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                Conectando o "Mundo Real" (Logística de Estoque Físico) ao "Mundo Financeiro" (Rendimento & Valuation) com liquidação atômica de lastro m².
              </p>
            </div>
            <div className="text-right flex items-center gap-2 bg-[#131314] border border-[#444746] p-3 rounded-none font-mono">
              <Clock size={14} className="text-zinc-500" />
              <div>
                <span className="text-xs text-[#71717A] block uppercase">STATUS DO CÓRTEX</span>
                <span className="text-xs text-green-400 font-bold uppercase">Sincronizado via Ledger Atômico</span>
              </div>
            </div>
          </div>

          {/* 1. Cruzamento de Lastro e Rendimento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-between">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-purple-400" /> 1. Cruzamento de Lastro Operacional e Rendimento (5 Nós)
              </h4>
              <span className="text-xs font-mono text-zinc-500">LIQUIDAÇÃO DE ESTOQUE ATÔMICA REAL (M²)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { city: 'Santos-Alpha (SANTOS)', baseStock: 500, currentStock: estoquesHubs.SANTOS !== undefined ? estoquesHubs.SANTOS : 500, baseYield: 360, freightCost: 0, distance: 0, locKey: 'SANTOS' },
                { city: 'São Paulo Studio (SAO_PAULO)', baseStock: 1200, currentStock: estoquesHubs.SAO_PAULO !== undefined ? estoquesHubs.SAO_PAULO : 1200, baseYield: 900, freightCost: 5, distance: 80, locKey: 'SAO_PAULO' },
                { city: 'Campinas Mobile (CAMPINAS)', baseStock: 150, currentStock: unidadeLastros.CAMPINAS !== undefined ? unidadeLastros.CAMPINAS : 150, baseYield: 500, freightCost: 12, distance: 210, locKey: 'CAMPINAS' },
                { city: 'Curitiba Base (CURITIBA)', baseStock: 400, currentStock: unidadeLastros.SAO_BERNARDO !== undefined ? (unidadeLastros.SAO_BERNARDO * 2) : 160, baseYield: 420, freightCost: 25, distance: 450, locKey: 'SAO_BERNARDO' }, // Bind to Sao_Bernardo physical lastro ratio for proof
                { city: 'Belo Horizonte Base (BH)', baseStock: 350, currentStock: unidadeLastros.MIGUEL_PEREIRA !== undefined ? (unidadeLastros.MIGUEL_PEREIRA * 3.5) : 140, baseYield: 380, freightCost: 30, distance: 580, locKey: 'MIGUEL_PEREIRA' } // Bind to Miguel_Pereira ratio for proof
              ].map((node, idx) => {
                const soldM2 = getSoldFromLedger(node.locKey);
                const baseCost = 45; // Custo base de referência Invisible® Series
                const sellPrice = 150; // MSRP preço praticado pelas franquias
                const netMargin = sellPrice - baseCost - node.freightCost; // Lógica da margem líquida com frete deduzido
                const calculatedNewYield = node.baseYield + (soldM2 * netMargin);

                return (
                  <div key={idx} className="bg-[#131314]/45 hover:bg-[#131314] p-4 border border-zinc-900 rounded-none space-y-3 relative overflow-hidden group transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500/50 transition-colors" />
                    <div>
                      <span className="text-[10px] font-bold text-white truncate block">{node.city}</span>
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">Nó Operacional Ativo</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-[#444746] pt-2">
                      <div>
                        <span className="text-[#71717A] text-[8.5px] uppercase">Estoque Físico</span>
                        <span className="text-white block font-bold">{node.currentStock} m²</span>
                      </div>
                      <div>
                        <span className="text-[#71717A] text-[8.5px] uppercase">Lqd. Real</span>
                        <span className="text-purple-400 block font-bold">-{soldM2} m²</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono space-y-1 bg-white/5 p-2 rounded-none">
                      <div className="flex justify-between text-zinc-400 text-[8.5px]">
                        <span>Custo Base Película:</span>
                        <span>R$ {baseCost},00</span>
                      </div>
                      <div className="flex justify-between text-zinc-400 text-[8.5px]">
                        <span>Frete Interno Dedução:</span>
                        <span className="text-red-400">- R$ {node.freightCost},00</span>
                      </div>
                      <div className="flex justify-between text-white text-[9px] font-bold border-t border-[#444746] pt-1">
                        <span>Margem Líq. Unit:</span>
                        <span className="text-green-400">R$ {netMargin},00/m²</span>
                      </div>
                    </div>

                    <div className="border-t border-[#444746] pt-2">
                      <span className="text-[8.5px] font-mono text-[#71717A] uppercase block">Yield Consolidado Real</span>
                      <span className="text-sm font-black font-mono text-green-400">R$ {calculatedNewYield.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => simularFaturamentoDireto(node.locKey, 5)}
                        className="w-full py-1 text-[8.5px] font-mono uppercase bg-zinc-900 border border-purple-500/30 text-purple-300 hover:bg-purple-950/20 hover:border-purple-400 rounded-none transition-colors text-center cursor-pointer"
                      >
                        Simular Venda + 5m²
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* 2. Auditoria de Aporte */}
            <div className="bg-[#09090B] border border-zinc-900 p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-purple-400" /> 2. Auditoria e Multiplicação de Aporte (Fomento)
                </h4>
                <p className="text-[11px] text-[#71717A] mt-0.5 leading-relaxed">
                  Demonstrativo contábil e capacidade operacional gerada a partir do aporte de fomento de capital.
                </p>
              </div>

              <div className="bg-[#131314]/30 p-4 border border-[#444746] space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500 uppercase text-[9px]">Aporte de Expansão Simulado</span>
                  <span className="text-white font-bold">R$ {customAporteValue.toLocaleString('pt-BR')},00</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500 uppercase text-[9px]">Capacidade de Compra Adicional (Invisible®)</span>
                  <span className="text-green-400 font-bold">+ {Math.floor(customAporteValue / 45).toLocaleString('pt-BR')} m²</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500 uppercase text-[9px]">Custo Médio de Aquisição Película</span>
                  <span className="text-zinc-300">R$ 45,00 / m² Encomenda</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase text-[9px]">Expansão de Capilaridade Operacional</span>
                  <span className="text-cyan-400 font-bold">5 ➔ 25 Asset Light Nodes (+20 Polos)</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic animate-pulse">
                *Nota de Governança: Os recursos aportados em fomento de estoque são travados temporariamente em smart accounts vinculadas até a liquidação física comprovada.
              </p>
            </div>

            {/* 3. Consistência de Valuation */}
            <div className="bg-[#09090B] border border-zinc-900 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={14} className="text-purple-400" /> 3. Consistência de Valuation: Validade de Performance
                  </h4>
                  <p className="text-[11px] text-[#71717A] mt-0.5 leading-relaxed">
                    O valuation estimado de R$ 68.5M exige uma Taxa mínima de Ocupação da Rede para se manter robusto.
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400 uppercase">Fator de Utilização da Rede:</span>
                  <span className={`font-bold ${ocupacaoRede >= 70 ? 'text-[#0284C7]' : 'text-red-400'}`}>{ocupacaoRede}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={ocupacaoRede}
                  onChange={(e) => setOcupacaoRede(Number(e.target.value))}
                  className="w-full accent-purple-500 text-purple-500 h-1 bg-zinc-800 rounded-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>0% (Inatividade)</span>
                  <span>70% (Mínimo Valuation)</span>
                  <span>100% (Saturação Máxima)</span>
                </div>

                <div className="border-t border-zinc-900 pt-3">
                  {ocupacaoRede >= 70 ? (
                    <div className="bg-emerald-950/20 border border-emerald-500/25 p-3 text-[10.5px] leading-relaxed text-emerald-400 flex items-start gap-2">
                      <span className="text-emerald-500 shrink-0 font-bold block mt-0.5">✔</span>
                      <div>
                        <span className="font-bold uppercase block text-[9.5px]">Valuation Est. Consistente (R$ 68.5M)</span>
                        Taxa de ocupação de {ocupacaoRede}% está acima do limite crítico de 70%. Múltiplo de mercado de 5.5x garantido por coesão operacional.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-950/20 border border-red-500/25 p-3 text-[10.5px] leading-relaxed text-red-400 flex items-start gap-2 animate-pulse">
                      <span className="text-red-500 shrink-0 font-bold block mt-0.5">⚠️</span>
                      <div>
                        <span className="font-bold uppercase block text-[9.5px] text-red-00 font-bold">ALERTA DE FLUTUAÇÃO: Valuation em Risco</span>
                        A ocupação de {ocupacaoRede}% está abaixo do patamar crítico de 70%. O valuation ajustado cai para R$ {((68.5 * ocupacaoRede) / 70).toFixed(1)}M com base em estresse de rede.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Left Column (Portfolio Overview) */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            <div className="p-6 md:p-8 bg-[#131314] border border-[#444746] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">PORTFÓLIO CONSOLIDADO</span>
                <span className="text-xs bg-white text-black px-2 py-0.5 font-bold uppercase tracking-wider">LIVE</span>
              </div>
              <div className="text-5xl md:text-6xl font-light tracking-tight text-white mb-2">
                <span className="text-3xl text-zinc-600 mr-2 font-mono">R$</span>
                {displayInvestments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0).toLocaleString('pt-BR')} <span className="text-zinc-500 text-4xl">,00</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-mono mt-4">
                <span className="text-green-500 flex items-center bg-green-500/10 px-2.5 py-1.5 border border-green-500/20 leading-relaxed">
                  <ArrowUpRight size={14} className="mr-2 animate-pulse" />
                  RENDIMENTO MENSAL: + R$ {displayInvestments.reduce((acc: number, curr: any) => acc + ((curr.amount || 0) * 0.12), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-white flex items-center bg-white/5 px-2.5 py-1.5 border border-[#444746] leading-relaxed">
                  SALDO DISPONÍVEL (SAQUE): R$ {(displayInvestments.reduce((acc: number, curr: any) => acc + ((curr.amount || 0) * 0.12), 0) * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => setNotification('Saque de todo o saldo disponível solicitado. Em processamento.')} className="flex-1 md:flex-none uppercase text-xs font-bold tracking-widest bg-white text-black px-6 py-4 hover:bg-zinc-200 transition-colors cursor-pointer">
                SACAR TUDO
              </button>
              <button onClick={handleLogout} className="flex-1 md:flex-none uppercase text-xs font-bold tracking-widest border border-[#444746] text-white px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer">
                LOGOUT
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-[#131314] border border-[#444746]">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">PERFORMANCE & VOLUME</h3>
               <div className="flex space-x-2">
                 {['1M', '3M', 'YTD', '1Y', 'MAX'].map(p => (
                   <button key={p} className={`text-[9px] font-mono px-2 py-1 ${p === 'MAX' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>{p}</button>
                 ))}
               </div>
             </div>
             
             <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DATA_VALUATION} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="term" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}M`} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', borderRadius: '0' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any, name: string) => [name === 'value' ? `${value}M` : `${value}M Vol`, name === 'value' ? 'AUM' : 'Volume']}
                      labelStyle={{ color: '#888', marginBottom: '4px' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area yAxisId="left" type="step" dataKey="value" stroke="#fff" strokeWidth={1.5} fillOpacity={1} fill="url(#gradient)" activeDot={{ r: 4, fill: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="h-[60px] w-full mt-2">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DATA_VALUATION} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <YAxis yAxisId="right" orientation="right" hide domain={[0, 'dataMax']} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={() => null} />
                    <Bar yAxisId="right" dataKey="volume" fill="rgba(255,255,255,0.1)" />
                  </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#111113] border border-[#27272A] p-4 md:p-6 rounded-none">
            <h3 className="text-xs md:text-sm font-semibold text-[#71717A] uppercase tracking-wider mb-6">ÚLTIMAS MOVIMENTAÇÕES COMPILADAS</h3>
            
            {/* Mobile transactions list cards */}
            <div className="block md:hidden space-y-4">
              {displayDividends.map((tx: any) => (
                <div key={tx.id} className="p-4 bg-[#151518] border border-[#27272A] rounded-none space-y-2">
                  <div className="flex justify-between items-center text-xs text-zinc-400">
                    <span>{tx.date}</span>
                    <span className="text-green-500 font-bold">{tx.status}</span>
                  </div>
                  <p className="text-sm font-bold text-[#E4E4E7]">{tx.title}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-[#27272A]/30">
                    <span className="text-xs text-[#71717A]">Valor:</span>
                    <span className={`text-base font-bold font-mono ${tx.type === 'credit' ? 'text-green-400' : 'text-zinc-300'}`}>
                      {tx.currency} {tx.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop transactions table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="text-[#71717A] border-b border-[#27272A]">
                    <th className="font-semibold pb-3 uppercase tracking-wider">Data</th>
                    <th className="font-semibold pb-3 uppercase tracking-wider">Descrição</th>
                    <th className="font-semibold pb-3 uppercase tracking-wider text-right">Valor</th>
                    <th className="font-semibold pb-3 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayDividends.map((tx: any, idx: number) => (
                    <tr key={tx.id} className={`border-b border-[#27272A]/40 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-[#151518]'}`}>
                      <td className="py-4 text-[#71717A] text-xs md:text-sm">{tx.date}</td>
                      <td className="py-4 text-[#E4E4E7] text-xs md:text-sm font-sans">{tx.title}</td>
                      <td className={`py-4 text-right text-xs md:text-sm font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-zinc-300'}`}>
                        {tx.currency} {tx.amount}
                      </td>
                      <td className="py-4 text-right text-xs md:text-sm">
                        <span className="bg-[#151518] px-2.5 py-1 text-[#E4E4E7] uppercase text-xs font-bold border border-[#27272A] rounded-none">{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Keys & Intelligence) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          <div className="bg-[#111113] border border-[#27272A] p-4 md:p-6 rounded-none">
            <h3 className="text-xs md:text-sm font-semibold text-[#71717A] uppercase tracking-wider mb-6">ALOCAÇÃO DE ATIVOS</h3>
            <div className="space-y-4">
              {displayInvestments.map((inv: any) => (
                <div key={inv.id} className="border border-[#27272A] p-5 bg-[#151518] hover:border-zinc-500 rounded-none transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-[#E4E4E7] tracking-tight mb-1">{inv.title}</h4>
                      <p className="text-xs font-mono text-[#71717A] uppercase tracking-wider">{inv.poolId}</p>
                    </div>
                    <Lock size={16} className="text-zinc-600 shrink-0 mt-1" />
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-[#27272A]/40 mt-2 mb-4">
                    <div>
                      <p className="text-xs font-mono text-[#71717A] uppercase tracking-wide mb-1">CAPITAL INVESTIDO</p>
                      <p className="text-base font-semibold font-mono text-[#E4E4E7]">R$ {inv.amount.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-green-500 uppercase tracking-wide mb-1 font-semibold">RENDIMENTO EST. / MÊS</p>
                      <p className="text-base font-semibold font-mono text-green-400">+ R$ {(inv.amount * 0.12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <button 
                      onClick={() => setNotification('Solicitação de Saque de Rendimentos enviada para o Comitê Financeiro. Prazo de liquidação: D+2.')} 
                      className="w-full py-3.5 px-2 border border-green-500/30 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10 uppercase tracking-widest font-mono transition-all font-bold rounded-none min-h-[48px] cursor-pointer"
                    >
                      Sacar Rendimentos
                    </button>
                    <button 
                      onClick={() => setNotification('Sua solicitação de Desinvestimento/Distrato foi iniciada. Nossa equipe entrará em contato.')} 
                      className="w-full py-3.5 px-2 border border-[#27272A] text-xs text-[#71717A] hover:text-white hover:bg-white/5 uppercase tracking-widest font-mono transition-all rounded-none min-h-[48px] cursor-pointer"
                    >
                      Solicitar Resgate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#131314] border border-[#444746] p-6">
            <div className="flex justify-between items-start mb-6">
               <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">NETWORK INTELLIGENCE</h3>
               <Globe size={16} className={`${simScenario === 'initial' ? 'text-zinc-600' : 'text-green-500 animate-pulse'}`} />
            </div>
            
            <div className="mb-6 pb-6 border-b border-[#444746]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-white">Asset Light Penetration</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {simScenario === 'initial' ? '5 / 100' : '25 / 100'}
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-1000 ${simScenario === 'initial' ? 'bg-zinc-400' : 'bg-green-500'}`}
                  style={{ width: simScenario === 'initial' ? '5%' : '25%' }}
                ></div>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">
                {simScenario === 'initial' 
                  ? 'Fase Inicial (Semente): 5 Asset Lights ativos homologados operando perfeitamente e gerando receita real.' 
                  : 'Fase de Escopo Expandido: 25 Asset Lights ativos integrados pós-fomento de capital de estoque.'
                }
              </p>
            </div>

            {/* Listagem Dinâmica de Polos Reais */}
            {simScenario === 'initial' ? (
              <div className="space-y-2 mb-6">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">5 Unidades Ativas (Início)</span>
                {[
                  { city: 'Santos-Alpha (Gonzaga)', status: '🟢 OPERANDO OK' },
                  { city: 'São Paulo Studio (V. Guilherme)', status: '🟢 OPERANDO OK' },
                  { city: 'Campinas Mobile (Cambuí)', status: '🟢 OPERANDO OK' },
                  { city: 'Curitiba Base (Batel)', status: '🟢 OPERANDO OK' },
                  { city: 'Belo Horizonte Base (Savassi)', status: '🟢 OPERANDO OK' }
                ].map((al, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] bg-[#131314] p-2 border border-[#444746] font-mono">
                    <span className="text-zinc-400">{al.city}</span>
                    <span className="text-green-500 font-bold">{al.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Capilaridade Ampliada (25 Polos)</span>
                {[
                  { region: 'Sudeste (SP, RJ, MG)', qty: '18 Polos Ativos' },
                  { region: 'Sul (PR, SC, RS)', qty: '4 Polos Ativos' },
                  { region: 'Nordeste Expansion Pool', qty: '2 Polos Ativos' },
                  { region: 'Miami US Logistics Hub', qty: '1 Polo Ativo' }
                ].map((al, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] bg-[#131314] p-2 border border-[#444746] font-mono">
                    <span className="text-zinc-300">{al.region}</span>
                    <span className="text-green-400 font-bold">{al.qty}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-zinc-400">WINF Index Volatility</span>
                 <span className="font-mono text-white">14.2%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-zinc-400">Est. Dividend Yield (TTM)</span>
                 <span className="font-mono text-white">8.4%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-zinc-400">Price / Earnings</span>
                 <span className="font-mono text-white">12.5x</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-6 border border-zinc-800">
             <div className="flex gap-4">
               <Shield className="text-zinc-400 shrink-0" size={16} />
               <div>
                 <h4 className="text-xs font-bold tracking-widest uppercase mb-2">Sinf-Chain Compliance</h4>
                 <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">
                   All equity positions and physical asset backings are audited and stored immutably via Base-64 encrypted ledgers.
                 </p>
                 <button onClick={onAccessDataRoom} className="text-[9px] font-mono tracking-widest uppercase border border-zinc-700 w-full py-2 hover:bg-zinc-800 transition-colors">
                   ACCESS DATA ROOM
                 </button>
               </div>
             </div>
          </div>
          
        </div>
      </div>
      </div>
      )}

      {activeTab === 'extrato' && renderExtrato()}
      {activeTab === 'aportes' && renderAportes()}
      {activeTab === 'simulador' && renderSimulador()}
      {activeTab === 'relatorios' && renderRelatorios()}

      {/* Notifications Overlay */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-white text-black px-6 py-4 border border-zinc-300 shadow-xl z-50 animate-fade-in flex items-center gap-3">
          <Activity size={16} />
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">SYSTEM MESSAGE</div>
            <div className="text-xs">{notification}</div>
          </div>
        </div>
      )}
    </div>
  );
};

