
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Settings,
  Calendar,
  CheckCircle,
  Users,
  Car,
  Layers,
  ArrowUpRight,
  Search,
  Bot as BotIcon,
  Crosshair,
  Radar,
  Inbox,
  Radio,
  MessageSquare,
  Briefcase,
  Globe,
  Store,
  Paperclip,
  ArrowUpDown,
  X,
  FileText,
  Check
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid, Pie, Cell, PieChart } from 'recharts';
import { useWinf } from '../contexts/WinfContext';
import { Skeleton } from './ui/LoadingSkeleton';
import { WINF_LOCAL_UNITS } from '../types';

const FILM_OPTIONS = [
    'Winf Select™ Architectural',
    'Standard Carbon Dyed',
    'Outros Serviços'
];

interface Client {
    id: string;
    name: string;
    vehicle: string;
    phone: string;
}

// Dados simulados baseados no Manual V5 (Mix de Produtos)
const MONTHLY_PROJECTION = [
    { name: 'Sem 1', revenue: 8500, cost: 950 },
    { name: 'Sem 2', revenue: 9200, cost: 1100 },
    { name: 'Sem 3', revenue: 11500, cost: 1050 },
    { name: 'Sem 4', revenue: 11300, cost: 1100 },
];

const ModuleFinancial: React.FC<{onBack: () => void, initialTab?: 'dashboard' | 'transactions' | 'leads' | 'invoices'}> = ({ onBack, initialTab = 'dashboard' }) => {
  const { 
    transactions, 
    fetchTransactions, 
    addTransaction, 
    updateTransaction,
    isLoading,
    leads,
    publicLeads,
    fetchLeads,
    fetchPublicLeads,
    claimLead,
    gamify,
    stockItems = [],
    installationJobs = [],
    updateInstallationJob
  } = useWinf();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'income' | 'expense' | 'pending' | 'paid'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [incentiveFeedback, setIncentiveFeedback] = useState<string | null>(null);
  
  const dynamicPendingInvoices = useMemo(() => {
    return (installationJobs || []).filter((j: any) => 
      j.status === 'completed' && 
      j.needs_invoice && 
      !j.nfe_issued
    );
  }, [installationJobs]);
  
  // Multi-unit Invoicing integration states
  const [nfeList, setNfeList] = useState([
    { id: 'nf1', clientName: 'Roberto Silveira', document: '123.456.789-00', description: 'Aplicação BlackPro (Fachada Vidraça Escritório 8m²)', amount: 1850, date: '2026-06-05', status: 'Emitida', nfNumber: 'NF-e #10842', unit: 'Matriz São Paulo' },
    { id: 'nf2', clientName: 'Ana Paula Souza', document: '987.654.321-11', description: 'Aplicação Invisible (Janelas Residencial Alphaville 16m²)', amount: 5800, date: '2026-06-04', status: 'Emitida', nfNumber: 'NF-e #10841', unit: 'Unidade Campinas' },
    { id: 'nf3', clientName: 'Eduardo Santos', document: '232.111.444-55', description: 'Kit de Instalação Profissional Especializado 4 Peças', amount: 350, date: '2026-06-03', status: 'Pendente', nfNumber: 'Pendente (Aprovação Fiscal)', unit: 'Unidade Rio de Janeiro' },
    { id: 'nf4', clientName: 'Juliana Mendes', document: '444.555.666-77', description: 'Aplicação Dual Reflect (Fachada Comercial Panorâmica 15m²)', amount: 2400, date: '2026-06-02', status: 'Processando', nfNumber: 'Enviada à Pref. ⌛', unit: 'Unidade Belo Horizonte' }
  ]);
  const [showNfeModal, setShowNfeModal] = useState(false);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('Todos');
  const [searchNfeQuery, setSearchNfeQuery] = useState<string>('');
  const [statusNfeFilter, setStatusNfeFilter] = useState<string>('Todos');
  
  const filteredPendingInvoicesList = useMemo(() => {
    const jobs = (dynamicPendingInvoices || []).map((j: any) => ({
        id: j.id,
        isDynamic: true,
        service_order_id: j.service_order_id || 'OS-AVULSA',
        clientName: j.razao_social || j.customer_name,
        document: j.cnpj || '---.---.---/0001-99',
        description: `Aplicação de Película Premium ${j.chosen_film || ''} (OS #${j.service_order_id || ''})`,
        amount: j.total_amount || 0,
        unit: j.unit || 'Matriz São Paulo',
        details: `Aplicação: ${j.chosen_film || 'Película Standard'} - m² Estimado`
    }));

    const staticItems = [
        {
            id: 'static-p1',
            isDynamic: false,
            service_order_id: 'OS-CAMP-802',
            clientName: 'Marcos Paulo de Alencar',
            document: '32.144.488/0001-23',
            description: 'Aplicação Invisible Nano (Cobertura de Vidro Residencial 12m²)',
            amount: 2450,
            unit: 'Unidade Campinas',
            details: 'Cobertura de Vidro Residencial 12m² (Invisible Nano)'
        },
        {
            id: 'static-p2',
            isDynamic: false,
            service_order_id: 'OS-MAT-754',
            clientName: 'Dra. Claudia Vantini Rego',
            document: '55.522.134/0001-99',
            description: 'Película Refração Solar Branca White Matter (Arquitetural Residencial 18m²)',
            amount: 3800,
            unit: 'Matriz São Paulo',
            details: 'Janelas Integradas Vidro Duplo 18m² (White Matter)'
        }
    ];

    const all = [...jobs, ...staticItems];

    return all.filter(item => {
        if (selectedUnitFilter !== 'Todos' && item.unit !== selectedUnitFilter) return false;
        if (searchNfeQuery) {
            const query = searchNfeQuery.toLowerCase();
            return (
                item.clientName.toLowerCase().includes(query) ||
                item.document.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.unit.toLowerCase().includes(query)
            );
        }
        return true;
    });
  }, [dynamicPendingInvoices, selectedUnitFilter, searchNfeQuery]);

  const filteredNfeList = useMemo(() => {
    return nfeList.filter(nf => {
        if (selectedUnitFilter !== 'Todos' && nf.unit !== selectedUnitFilter) return false;
        if (statusNfeFilter !== 'Todos' && nf.status !== statusNfeFilter) return false;
        if (searchNfeQuery) {
            const query = searchNfeQuery.toLowerCase();
            return (
                nf.clientName.toLowerCase().includes(query) ||
                nf.document.toLowerCase().includes(query) ||
                nf.description.toLowerCase().includes(query) ||
                nf.unit.toLowerCase().includes(query) ||
                (nf.nfNumber && nf.nfNumber.toLowerCase().includes(query))
            );
        }
        return true;
    });
  }, [nfeList, selectedUnitFilter, statusNfeFilter, searchNfeQuery]);

  const [newNfe, setNewNfe] = useState({
    clientName: '',
    document: '',
    description: '',
    amount: '',
    unit: 'Matriz São Paulo',
    jobId: ''
  });

  const transmitNfe = (id: string) => {
    // Set status to Processando, then Emitida after 2 seconds!
    setNfeList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Processando', nfNumber: 'Autorizando... ⚙' };
      }
      return item;
    }));
    
    gamify?.({ title: 'Transmitindo Fiscal', points: 10, type: 'action' });
    
    setTimeout(() => {
      setNfeList(prev => prev.map(item => {
        if (item.id === id) {
          const randomNum = Math.floor(10843 + Math.random() * 100);
          return { ...item, status: 'Emitida', nfNumber: `NF-e #${randomNum}` };
        }
        return item;
      }));
      gamify?.({ title: 'Nota Fiscal Emitida!', points: 25, type: 'action' });
    }, 1500);
  };

  const handleCreateNfe = () => {
    if (!newNfe.clientName || !newNfe.amount || !newNfe.description) return;

    const newNfeObj = {
      id: 'nf_' + Date.now(),
      clientName: newNfe.clientName,
      document: newNfe.document || '---.---.---/0001-99',
      description: newNfe.description,
      amount: parseFloat(newNfe.amount) || 0,
      date: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      nfNumber: 'Aguardando Envio',
      unit: newNfe.unit
    };

    setNfeList(prev => [newNfeObj, ...prev]);
    setShowNfeModal(false);

    if (newNfe.jobId) {
      updateInstallationJob?.(newNfe.jobId, { nfe_issued: true });
    }

    setNewNfe({
      clientName: '',
      document: '',
      description: '',
      amount: '',
      unit: 'Matriz São Paulo',
      jobId: ''
    });
    
    gamify?.({ title: 'NF-e Solicitada', points: 15, type: 'action' });
    setIncentiveFeedback(`Solicitação de Emissão enviada com sucesso para a unidade "${newNfeObj.unit}". O departamento fiscal revisará os dados do cliente e transmitirá para a prefeitura em lote.`);
  };

  const [newTx, setNewTx] = useState({ 
    type: 'income' as 'income' | 'expense', 
    amount: '', 
    description: '', 
    category: 'Residencial (m²)', 
    paymentMethod: 'Pix',
    allocation: null as string | null, // 'maw' | 'stock' | 'operational' | null
    isPaid: true as boolean,
    receiptFile: null as File | null,
    receiptPreview: null as string | null
  });

  // Custom categories for expenses (Baseado no Manual Winf)
  const EXPENSE_CATEGORIES = [
    'Material / Estoque',
    'Aluguel / Loja / Moradia',
    'Prestações / Parcelas',
    'Cartão de Crédito',
    'Família / Dependentes',
    'Lazer / Bem Estar',
    'Combustível / Gasolina',
    'Alimentação',
    'Insumos (Detergente/Papel)',
    'Estacionamento',
    'Ajudante / Diária',
    'Ferramentas / Lâminas',
    'Marketing / Tráfego',
    'Impostos',
    'Software',
    'Outros'
  ];

  const INCOME_CATEGORIES = [
    'Residencial (m²)',
    'Corporativo / Fachada (m²)',
    'Coberturas / Clarabóias (m²)',
    'Venda de Kits / Ferramentas',
    'Consultoria / Outros'
  ];

  // Leads related states
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [activeLeadPool, setActiveLeadPool] = useState<'personal' | 'public'>('personal');
  const [financialLeadSearch, setFinancialLeadSearch] = useState('');
  const [financialLeadSortBy, setFinancialLeadSortBy] = useState<'score' | 'date'>('score');
  const [financialLeadSortOrder, setFinancialLeadSortOrder] = useState<'desc' | 'asc'>('desc');

  const processedFinancialLeads = useMemo(() => {
    const list = activeLeadPool === 'personal' ? leads : publicLeads;
    let result = [...list];

    // 1. Search Filter
    if (financialLeadSearch.trim() !== '') {
      const q = financialLeadSearch.toLowerCase();
      result = result.filter(lead => 
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.interest || '').toLowerCase().includes(q) ||
        (lead.source || '').toLowerCase().includes(q)
      );
    }

    // 2. Sorting
    result.sort((a, b) => {
      if (financialLeadSortBy === 'score') {
        const scoreA = a.dominance_score ?? a.ai_score ?? 0;
        const scoreB = b.dominance_score ?? b.ai_score ?? 0;
        return financialLeadSortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      } else {
        const getTimestamp = (lead: any) => {
          if (lead.created_at) return new Date(lead.created_at).getTime();
          if (lead.distributed_at) return new Date(lead.distributed_at).getTime();
          return 0;
        };
        const timeA = getTimestamp(a);
        const timeB = getTimestamp(b);
        return financialLeadSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
    });

    return result;
  }, [leads, publicLeads, activeLeadPool, financialLeadSearch, financialLeadSortBy, financialLeadSortOrder]);
  
  const displayTransactions = useMemo(() => {
    return [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const filteredDashboardTransactions = useMemo(() => {
    let list = [...transactions];
    if (dashboardFilter === 'income') {
      list = list.filter(t => t.type === 'income');
    } else if (dashboardFilter === 'expense') {
      list = list.filter(t => t.type === 'expense');
    } else if (dashboardFilter === 'pending') {
      list = list.filter(t => !t.isPaid);
    } else if (dashboardFilter === 'paid') {
      list = list.filter(t => t.isPaid);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, dashboardFilter]);

  const realIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const realExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const totalRevenue = realIncome;
  const totalCost = realExpense;
  const netProfit = totalRevenue - totalCost;

  const incomeTxCount = transactions.filter(t => t.type === 'income').length;
  const ticketMedio = incomeTxCount > 0 ? totalRevenue / incomeTxCount : 0;

  const expenseByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};
    const expenseList = transactions.filter(t => t.type === 'expense');
    expenseList.forEach(t => {
      const cat = t.category || 'Outros';
      categories[cat] = (categories[cat] || 0) + t.amount;
    });
    
    return Object.entries(categories).map(([name, amount]) => ({
      name,
      amount,
      percentage: realExpense > 0 ? (amount / realExpense) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions, realExpense]);

  const chartData = useMemo(() => {
    // Pegar as últimas 10 transações para desenhar uma linha de fluxo de caixa acumulado
    const sorted = [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let balanceAccumulator = 0;
    return sorted.map((t, idx) => {
      if (t.type === 'income') {
        balanceAccumulator += t.amount;
      } else {
        balanceAccumulator -= t.amount;
      }
      const rawName = t.description || `Lançamento #${idx + 1}`;
      const name = rawName.length > 15 ? rawName.substring(0, 15) + '...' : rawName;
      return {
        name,
        saldo: balanceAccumulator,
        valor: t.amount,
        tipo: t.type === 'income' ? 'Entrada' : 'Saída'
      };
    }).slice(-10); // mostra os últimos 10 saltos de saldo
  }, [transactions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTx(prev => ({ 
          ...prev, 
          receiptFile: file,
          receiptPreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTx = async () => {
    if(!newTx.description || !newTx.amount) return;
    
    await addTransaction({
        type: newTx.type,
        amount: Number(newTx.amount),
        description: newTx.description,
        category: newTx.category,
        paymentMethod: newTx.paymentMethod,
        allocation: newTx.allocation,
        isPaid: newTx.isPaid,
        date: new Date().toISOString(),
        metadata: newTx.receiptPreview ? { hasReceipt: true } : {}
    });

    if (newTx.type === 'expense') {
        gamify?.({ title: 'Gente que Cuida!', points: 10, type: 'action' } as any);
    }

    setShowAddModal(false);
    setNewTx({ 
        type: 'income', 
        amount: '', 
        description: '', 
        category: 'Residencial (m²)', 
        paymentMethod: 'Pix',
        allocation: null,
        isPaid: true,
        receiptFile: null,
        receiptPreview: null
    });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 w-full text-white">
        {/* Header - Banking Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#444746] pb-8">
            <div className="space-y-4">
                <div>
                   <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">Winf™ | Financeiro</h1>
                </div>
            </div>
            
            <div className="w-full md:w-auto">
                <div className="flex w-full bg-[#131314] p-1 border border-[#444746] rounded-none overflow-x-auto whitespace-nowrap min-w-max gap-1">
                    {[
                      { id: 'dashboard', name: 'PANORAMA' },
                      { id: 'transactions', name: 'TRANSAÇÕES' },
                      { id: 'leads', name: 'OPORTUNIDADES' },
                      { id: 'invoices', name: 'NOTAS (NF-E)' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 md:flex-initial text-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-none text-[10px] sm:text-xs tracking-[0.15em] font-black uppercase transition-all duration-300 ${
                          activeTab === tab.id ? "bg-white text-black font-black" : "text-zinc-500 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                </div>
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="space-y-8">
                {/* Visual Header Guide Column with direct Click Actions */}
                <div className="bg-[#131314] border border-[#444746] p-6 sm:p-8 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-none blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                    <div className="space-y-1.5 z-10 max-w-xl text-left">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/30 text-white text-[9px] font-black uppercase tracking-widest mb-1">
                             ✓ CONTROLE ATIVO DE REGISTROS
                        </span>
                        <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Praticidade Financeira para sua Empresa</h2>
                        <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-bold uppercase tracking-wider">
                            Evite surpresas ou esquecimentos. Registre cada aplicação realizada, vendas de kits ou pequenas despesas operacionais em poucos cliques para ter clareza total dos seus ganhos reais.
                        </p>
                    </div>
                    {/* Quick Access Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 z-10">
                        <button 
                            onClick={() => {
                                setNewTx({ 
                                    type: 'income', 
                                    amount: '', 
                                    description: '', 
                                    category: 'Residencial (m²)', 
                                    paymentMethod: 'Pix',
                                    allocation: null,
                                    isPaid: true,
                                    receiptFile: null,
                                    receiptPreview: null
                                });
                                setShowAddModal(true);
                            }}
                            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:opacity-90 active:scale-95 text-black text-xs uppercase font-black tracking-[0.12em] rounded-none transition-all font-sans cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)] border-none"
                        >
                            <Plus size={14} className="stroke-[3]" /> REGISTRAR ENTRADA (GANHO)
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => {
                                setNewTx({ 
                                    type: 'expense', 
                                    amount: '', 
                                    description: '', 
                                    category: 'Material / Estoque', 
                                    paymentMethod: 'Pix',
                                    allocation: null,
                                    isPaid: true,
                                    receiptFile: null,
                                    receiptPreview: null
                                });
                                setShowAddModal(true);
                            }}
                            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1e1f20] hover:bg-zinc-800 border border-[#444746] text-white text-xs uppercase font-black tracking-[0.12em] rounded-none transition-all font-sans cursor-pointer"
                        >
                            <Plus size={14} className="stroke-[3] text-white" /> REGISTRAR SAÍDA (GASTO)
                        </button>
                    </div>
                </div>

                {/* KPI Cards fully simplified and made modern, sharp, squared with neon accents */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
                    {/* KPI 1: Entradas */}
                    <div className="bg-[#131314] border border-[#444746] p-5 sm:p-6 md:p-7 rounded-none group relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-5 md:p-8 bg-white/5 rounded-none blur-xl"></div>
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[9px] text-white font-black uppercase tracking-widest block font-sans">Total de Entradas</span>
                            <span className="text-[8px] text-zinc-500 font-mono font-black uppercase tracking-wider">FATURADO BRUTO</span>
                        </div>
                        <div className="flex items-baseline gap-1 sm:gap-2 relative z-10">
                           <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-white tracking-tighter">R$ {totalRevenue.toLocaleString('pt-BR')}</span>
                           <TrendingUp size={14} className="text-white shrink-0" />
                        </div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-3.5 leading-tight">Valor total faturado com serviços e kits.</p>
                    </div>

                    {/* KPI 2: Custos / Despesas */}
                    <div className="bg-[#131314] border border-[#444746] p-5 sm:p-6 md:p-7 rounded-none group relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-5 md:p-8 bg-zinc-800/10 rounded-none blur-xl"></div>
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block font-sans">Total de Saídas</span>
                            <span className="text-[8px] text-zinc-500 font-mono font-black uppercase tracking-wider">CMV & DESPESAS</span>
                        </div>
                        <div className="flex items-baseline gap-1 sm:gap-2 relative z-10">
                           <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-white tracking-tighter">R$ {totalCost.toLocaleString('pt-BR')}</span>
                           <TrendingDown size={14} className="text-zinc-500 shrink-0" />
                        </div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-3.5 leading-tight">Custos operacionais, materiais e despesas.</p>
                    </div>

                    {/* KPI 3: Saldo Real */}
                    <div className="bg-[#131314] border border-[#444746] p-5 sm:p-6 md:p-7 rounded-none group relative overflow-hidden shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white" />
                        <div className="absolute top-0 right-0 p-5 md:p-8 bg-white/5 rounded-none blur-xl"></div>
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[9px] font-black uppercase tracking-widest block font-sans text-white">
                                Saldo Líquido
                            </span>
                            <span className="text-[8px] text-zinc-500 font-mono font-black uppercase tracking-wider">LUCRO NO BOLSO</span>
                        </div>
                        <div className="flex items-baseline gap-1 sm:gap-2 relative z-10">
                           <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono tracking-tighter text-white">
                               R$ {netProfit.toLocaleString('pt-BR')}
                           </span>
                        </div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-3.5 leading-tight">O que restou limpo no caixa da empresa.</p>
                    </div>

                    {/* KPI 4: Ticket Médio cobrado */}
                    <div className="bg-[#131314] border border-[#444746] p-5 sm:p-6 md:p-7 rounded-none group relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-5 md:p-8 bg-zinc-800/10 rounded-none blur-xl"></div>
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block font-sans">Média por Serviço</span>
                            <span className="text-[8px] text-zinc-500 font-mono font-black uppercase tracking-wider">TICKET MÉDIO</span>
                        </div>
                        <div className="flex items-baseline gap-1 sm:gap-2 relative z-10">
                           <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-white tracking-tighter">R$ {ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-3.5 leading-tight">Valor médio recebido em cada faturamento.</p>
                    </div>
                </div>

                {/* VISUAL EDUCATION GUIDE WIDGET - MAKING FINANCIAL TOOL EXTREMELY EASY TO UNDERSTAND */}
                <div className="bg-[#131314] border border-[#444746] p-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-white" />
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 bg-white" />
                        <h4 className="text-xs font-black tracking-[0.2em] uppercase text-white">Guia Rápido de Interpretação: Entenda suas Finanças Sem Complicação</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                        <div className="p-4 bg-black/50 border border-[#444746] space-y-1">
                            <p className="text-[10px] font-black uppercase text-white tracking-widest">1. Total de Entradas</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 leading-relaxed">
                                Representa todo o dinheiro faturado. É o <b className="text-white">Faturamento Bruto</b>. Use a entrada para registrar o valor total cobrado do cliente pelo serviço de instalação ou pelos kits de películas vendidos.
                            </p>
                        </div>
                        <div className="p-4 bg-black/50 border border-[#444746] space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">2. Total de Saídas</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 leading-relaxed">
                                São todas as despesas ou custos. Registre aqui o dinheiro gasto com ajudantes, compra de rolos de películas de reposição, materiais de apoio (estiletes, detergentes) ou custos fixos do negócio.
                            </p>
                        </div>
                        <div className="p-4 bg-black/50 border border-[#444746] space-y-1">
                            <p className="text-[10px] font-black uppercase text-white tracking-widest">3. Lucro no Bolso</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 leading-relaxed">
                                O <b className="text-white">Saldo Líquido</b> é o seu indicador principal de saúde! Ele calcula: <span className="text-white font-mono">Entradas - Saídas</span>. Se este valor estiver positivo, seu caixa está saudável e gerando dinheiro real.
                            </p>
                        </div>
                        <div className="p-4 bg-black/50 border border-[#444746] space-y-1">
                            <p className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">4. Ticket Médio</p>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 leading-relaxed">
                                O quanto você costuma cobrar em média por cada instalação realizada. Para aumentar este valor e sobrar mais caixa, ofereça películas premium com maior margem de lucro (Winf Select™).
                            </p>
                        </div>
                    </div>
                </div>

                {/* GRAPHIC / HEALTH SECTION GORGEOUS COMPOSITIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                    {/* Cumulative Chart Card - 7 Columns */}
                    <div className="lg:col-span-7 bg-[#131314] border border-[#444746] p-5 md:p-6 flex flex-col justify-between rounded-none">
                        <div>
                            <h3 className="text-xs uppercase font-black text-white tracking-[0.2em] mb-1">Evolução do Saldo de Caixa</h3>
                            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-4 text-left">Sua curva de saldo acumulado nas últimas 10 transações.</p>
                        </div>
                        <div className="h-[210px] w-full text-zinc-500 text-xs">
                          {transactions.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={netProfit >= 0 ? "white" : "#EF4444"} stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor={netProfit >= 0 ? "white" : "#EF4444"} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1E" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={8} tickLine={false} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#131314', borderColor: '#444746', color: '#fff', fontSize: '11px', borderRadius: '0px' }} 
                                  itemStyle={{ color: '#E5E5E5' }}
                                  labelStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="saldo" name="Saldo Acumulado" stroke={netProfit >= 0 ? "white" : "#EF4444"} strokeWidth={2.5} fillOpacity={1} fill="url(#colorSaldo)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center border border-dashed border-[#444746] rounded-none bg-black/20">
                              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Cadastre lançamentos para desenhar a linha</p>
                            </div>
                          )}
                        </div>
                    </div>

                    {/* Category Cost progress bar (Where is the money going?) - 5 Columns */}
                    <div className="lg:col-span-5 bg-[#131314] border border-[#444746] p-5 md:p-6 flex flex-col justify-between rounded-none">
                        <div>
                            <h3 className="text-xs uppercase font-black text-white tracking-[0.2em] mb-1">Destinação das Saídas</h3>
                            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-4">Veja com clareza para onde seu dinheiro está indo.</p>
                        </div>
                        
                        <div className="flex-1 space-y-3 justify-center flex flex-col">
                            {expenseByCategory.length > 0 ? (
                                expenseByCategory.slice(0, 4).map((cat, i) => {
                                    const progressColors = ["bg-white", "bg-zinc-400", "bg-zinc-600", "bg-zinc-800"];
                                    const colorClass = progressColors[i % progressColors.length];
                                    return (
                                        <div key={cat.name} className="space-y-1.5 text-left">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-zinc-300 font-bold uppercase tracking-wider text-[10px] truncate max-w-[170px]">{cat.name}</span>
                                                <span className="text-white font-mono font-black text-xs">R$ {cat.amount.toLocaleString('pt-BR')}</span>
                                            </div>
                                            <div className="w-full bg-zinc-950 h-2.5 rounded-none overflow-hidden border border-[#444746]">
                                                <div 
                                                    className={`h-full rounded-none ${colorClass}`} 
                                                    style={{ width: `${Math.min(100, Math.max(5, cat.percentage))}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-[9px] text-[#818384] font-mono leading-none pt-0.5 uppercase tracking-wide">
                                                <span>Representa {cat.percentage.toFixed(0)}% das despesas</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center border border-dashed border-[#444746] rounded-none bg-black/20 my-auto">
                                    <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Nenhuma despesa ou custo lançado neste mês.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* LIVRO DE REGISTROS - TRANSACTIONS WITH CLICKABLE CHIPS FILTER */}
                <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 rounded-none text-left space-y-6">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                        <div>
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1">Livro de Lançamentos</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Selecione uma categoria abaixo para filtrar a relação na tela.</p>
                        </div>
                        
                        {/* Quick filter chips */}
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'all', name: 'Todos' },
                                { id: 'income', name: 'Entradas' },
                                { id: 'expense', name: 'Saídas' },
                                { id: 'pending', name: 'Pendentes' },
                                { id: 'paid', name: 'Concluídos' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setDashboardFilter(filter.id as any)}
                                    className={`px-3.5 py-1.5 rounded-none text-[9.5px] tracking-wider font-mono font-black uppercase transition-all duration-300 cursor-pointer border ${
                                        dashboardFilter === filter.id 
                                            ? 'bg-white text-black border-white' 
                                            : 'bg-[#1e1f20] text-zinc-400 border-[#444746] hover:text-white hover:bg-[#1e1f20]/60'
                                    }`}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        {isLoading ? (
                            <div className="space-y-4 p-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : filteredDashboardTransactions.length === 0 ? (
                            <div className="p-12 text-center text-gray-600 bg-black/20 border border-[#444746] rounded-none">
                                <DollarSign size={24} className="mx-auto mb-3 opacity-20" />
                                <p className="text-xs uppercase font-black tracking-widest text-[#818384]">Nenhuma transação correspondente encontrada.</p>
                            </div>
                        ) : (
                            filteredDashboardTransactions.map((t: any) => (
                                <div key={t.id} className="flex justify-between items-center p-3 sm:p-4 hover:bg-[#1e1f20] border-b border-[#444746] last:border-0 transition-all duration-200 group gap-4">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        {/* Interactive Checkbox for status */}
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await updateTransaction(t.id, { isPaid: !t.isPaid });
                                            }}
                                            className={`w-5 h-5 rounded-none border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                                t.isPaid 
                                                    ? 'bg-white/10 border-white/40 text-white font-bold hover:bg-white/20' 
                                                    : 'bg-[#1e1f20] border-[#444746] text-white/10 hover:border-zinc-500 hover:bg-[#1e1f20]/80'
                                            }`}
                                            title={t.isPaid ? 'Marcar como Pendente' : 'Marcar como Concluído'}
                                        >
                                            {t.isPaid && <CheckCircle size={10} className="stroke-[3.5]" />}
                                        </button>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                                <p className={`text-sm font-bold text-white transition-all truncate ${t.isPaid ? 'opacity-90' : 'text-zinc-400'}`}>
                                                    {t.description}
                                                </p>
                                                {t.description?.toLowerCase().includes('blackshop') && (
                                                  <span className="text-[8px] bg-white/10 text-white/60 px-1.5 py-0.5 font-black uppercase tracking-tighter rounded-none shrink-0">Winf Store</span>
                                                )}
                                                {t.allocation === 'maw' && (
                                                  <span className="text-[8px] bg-orange-500/20 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider rounded-none shrink-0">⚡ Res. MAW™</span>
                                                )}
                                                {t.allocation === 'stock' && (
                                                  <span className="text-[8px] bg-blue-500/20 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider rounded-none shrink-0">📦 Estoque</span>
                                                )}
                                                {t.allocation === 'operational' && (
                                                  <span className="text-[8px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider rounded-none shrink-0">💼 Geral</span>
                                                )}
                                                {t.metadata?.hasReceipt && (
                                                  <Paperclip size={10} className="text-winf-primary animate-pulse shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 uppercase tracking-widest truncate">
                                                {new Date(t.date).toLocaleDateString()} • {t.paymentMethod} •{' '}
                                                <span className={t.isPaid ? 'text-zinc-400/80 font-bold' : 'text-neutral-500 font-bold'}>
                                                    {t.isPaid ? (t.type === 'income' ? 'RECEBIDO' : 'PAGO') : (t.type === 'income' ? 'A RECEBER' : 'PENDENTE')}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-mono font-bold shrink-0 text-sm sm:text-base ${t.type === 'income' ? 'text-white' : 'text-zinc-500'} ${t.isPaid ? '' : 'opacity-60'}`}>
                                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}
        
        {/* Full Transactions View */}
        {activeTab === 'transactions' && (
            <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 rounded-none">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.3em]">Histórico Completo</h3>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
                       <Plus size={14} /> Registrar Transação
                    </button>
                </div>
                <div className="space-y-1">
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : displayTransactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-600">
                            <DollarSign size={32} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xs uppercase font-black tracking-widest text-[#818384]">Nenhuma transação registrada.</p>
                        </div>
                    ) : (
                        displayTransactions.map((t: any) => (
                            <div key={t.id} className="flex justify-between items-center p-3 sm:p-4 hover:bg-[#1e1f20] border-b border-[#444746] last:border-0 transition-all duration-200 group gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {/* Interactive Checkbox for status */}
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await updateTransaction(t.id, { isPaid: !t.isPaid });
                                        }}
                                        className={`w-5 h-5 rounded-none border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                            t.isPaid 
                                                ? 'bg-white/10 border-white/40 text-white font-bold hover:bg-white/20' 
                                                : 'bg-[#1e1f20] border-[#444746] text-white/10 hover:border-zinc-500 hover:bg-[#1e1f20]/80'
                                        }`}
                                        title={t.isPaid ? 'Marcar como Pendente' : 'Marcar como Concluído'}
                                    >
                                        {t.isPaid && <CheckCircle size={10} className="stroke-[3.5]" />}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                            <p className={`text-sm font-bold text-white transition-all truncate ${t.isPaid ? 'opacity-90' : 'text-zinc-400'}`}>
                                                {t.description}
                                            </p>
                                            {t.description?.toLowerCase().includes('blackshop') && (
                                              <span className="text-[8px] bg-white/10 text-white/60 px-1.5 py-0.5 font-black uppercase tracking-tighter rounded-none shrink-0">Winf Store</span>
                                            )}
                                            {t.allocation === 'maw' && (
                                              <span className="text-[8px] bg-orange-500/20 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider rounded-none shrink-0">⚡ Res. MAW™</span>
                                            )}
                                            {t.allocation === 'stock' && (
                                              <span className="text-[8px] bg-blue-500/20 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider rounded-none shrink-0">📦 Estoque</span>
                                            )}
                                            {t.allocation === 'operational' && (
                                              <span className="text-[8px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider rounded-none shrink-0">💼 Geral</span>
                                            )}
                                            {t.metadata?.hasReceipt && (
                                              <Paperclip size={10} className="text-white animate-pulse shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest truncate">
                                            {new Date(t.date).toLocaleDateString()} • {t.paymentMethod} • {t.category} •{' '}
                                            <span className={t.isPaid ? 'text-white font-bold font-mono' : 'text-neutral-500 font-bold'}>
                                                {t.isPaid ? (t.type === 'income' ? 'RECEBIDO' : 'PAGO') : (t.type === 'income' ? 'A RECEBER' : 'PENDENTE')}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-mono font-bold shrink-0 text-sm sm:text-base ${t.type === 'income' ? 'text-white' : 'text-zinc-500'} ${t.isPaid ? '' : 'opacity-60'}`}>
                                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
        
        {activeTab === 'leads' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
                {/* Leads List */}
                <div className="lg:col-span-7 bg-[#131314] border border-[#444746] rounded-none p-4 h-[380px] sm:h-[500px] lg:h-[600px] flex flex-col">
                    <div className="p-2 sm:p-4 border-b border-white/[0.05] space-y-3">
                        <div className="flex gap-1 sm:gap-2 bg-black/30 p-1 border border-[#444746] rounded-none w-full">
                            <button 
                                onClick={() => setActiveLeadPool('personal')}
                                className={`flex-1 text-center py-1.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all rounded-none cursor-pointer duration-300 ${activeLeadPool === 'personal' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                            >
                                Canal ({leads.length})
                            </button>
                            <button 
                                onClick={() => setActiveLeadPool('public')}
                                className={`flex-1 text-center py-1.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all rounded-none cursor-pointer duration-300 ${activeLeadPool === 'public' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                            >
                                Pool ({publicLeads.length})
                            </button>
                        </div>

                        {/* Search and Sort controls */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1 bg-black/20 border border-[#444746] rounded-none focus-within:border-zinc-400 transition-all">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    value={financialLeadSearch}
                                    onChange={(e) => setFinancialLeadSearch(e.target.value)}
                                    placeholder="Pesquisar oportunidades..."
                                    className="w-full bg-transparent py-1.5 pl-8 pr-6 text-[11px] font-bold uppercase tracking-wider text-white outline-none placeholder:text-white/20"
                                />
                                {financialLeadSearch && (
                                    <button 
                                        onClick={() => setFinancialLeadSearch('')} 
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-1.5 justify-end">
                                <button
                                    onClick={() => setFinancialLeadSortBy(prev => prev === 'score' ? 'date' : 'score')}
                                    className="px-2.5 py-1.5 bg-[#131314] border border-[#444746] hover:border-zinc-400 text-[10px] text-zinc-400 hover:text-white font-black uppercase tracking-widest transition-all rounded-none flex items-center gap-1 shrink-0 cursor-pointer"
                                    title="Alternar critério de ordenação"
                                >
                                    <span>Ord: {financialLeadSortBy === 'score' ? 'Score' : 'Data'}</span>
                                </button>
                                <button
                                    onClick={() => setFinancialLeadSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                    className="px-2.5 py-1.5 bg-[#131314] border border-[#444746] hover:border-zinc-400 text-[10px] text-zinc-400 hover:text-white font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center shrink-0 cursor-pointer"
                                    title="Alternar direção de ordenação"
                                >
                                    {financialLeadSortOrder === 'desc' ? <ArrowUpDown size={10} /> : <ArrowUpDown className="rotate-180" size={10} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {processedFinancialLeads.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/20 p-8">
                                <Inbox size={32} className="mb-3 stroke-1 opacity-60 text-zinc-650" />
                                <p className="text-[10px] uppercase font-black tracking-widest text-[#818384] text-center">Nenhuma oportunidade encontrada.</p>
                                {financialLeadSearch && (
                                    <p className="text-[9px] font-light text-white/35 text-center mt-1">Refine seus termos de busca.</p>
                                )}
                            </div>
                        ) : (
                            processedFinancialLeads.map((lead) => (
                                <div 
                                    key={lead.id} 
                                    onClick={() => setSelectedLead(lead)}
                                    className={`p-3 cursor-pointer transition-all duration-200 flex items-center gap-3 border rounded-none ${selectedLead?.id === lead.id ? 'bg-[#1e1f20] border-white' : 'bg-transparent border-[#444746] hover:border-zinc-400 hover:bg-[#1e1f20]/40'}`}
                                >
                                    <div className="w-9 h-9 rounded-none border border-[#444746] flex items-center justify-center font-mono text-xs bg-black/35 font-black text-white shrink-0">
                                        {lead.dominance_score}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-wide truncate">{lead.name}</h4>
                                        <p className="text-[9px] text-zinc-400 font-bold truncate uppercase tracking-widest">{lead.interest}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white">{lead.source}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Lead Profile */}
                <div className="lg:col-span-5 bg-[#131314] border border-[#444746] p-4 sm:p-6 rounded-none flex flex-col justify-between min-h-[300px]">
                    {!selectedLead ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-10">
                            <Users size={36} className="mb-3 stroke-1 text-zinc-500" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Selecione um Lead</p>
                        </div>
                    ) : (
                        <div className="space-y-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="border-b border-[#444746] pb-4">
                                    <h3 className="text-white font-black text-lg uppercase tracking-wider mb-1">{selectedLead.name}</h3>
                                    <p className="text-[10px] text-white font-black uppercase tracking-widest">{selectedLead.status}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-black/25 border border-[#444746] rounded-none">
                                        <p className="text-[8px] text-zinc-500 uppercase font-black mb-1.5 tracking-wider">Interesse</p>
                                        <p className="text-xs text-white font-bold uppercase truncate">{selectedLead.interest}</p>
                                    </div>
                                    <div className="p-3 bg-black/25 border border-[#444746] rounded-none">
                                        <p className="text-[8px] text-zinc-500 uppercase font-black mb-1.5 tracking-wider">Origem</p>
                                        <p className="text-xs text-white font-bold uppercase truncate">{selectedLead.source}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#444746]">
                                {activeLeadPool === 'public' ? (
                                    <button 
                                        onClick={async () => {
                                            const res = await claimLead(selectedLead.id);
                                            if(res.success) {
                                                setSelectedLead(null);
                                                setActiveLeadPool('personal');
                                            }
                                        }}
                                        className="w-full py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-none hover:bg-white border border-white hover:border-white transition-all duration-300 cursor-pointer"
                                    >
                                        Reivindicar Leads
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <button className="w-full py-2.5 bg-zinc-500 hover:bg-zinc-400 text-white font-black text-xs uppercase tracking-widest rounded-none transition-all cursor-pointer">
                                            Falar no WhatsApp
                                        </button>
                                        <button className="w-full py-2.5 bg-transparent border border-[#444746] text-zinc-400 hover:border-white hover:text-white text-xs uppercase font-black tracking-widest rounded-none transition-all cursor-pointer">
                                            Gerar Orçamento Precision™
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
        
        {activeTab === 'invoices' && (
            <div className="space-y-6 animate-slide-up text-left">
                {/* Visual Header Banner */}
                <div className="p-6 bg-black border border-[#444746] rounded-none relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-none">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-none blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                    <div className="space-y-2 max-w-xl text-left font-sans">
                        <span className="text-[9px] bg-white/10 text-white/80 border border-white/20 font-mono font-bold px-2.5 py-0.5 rounded-none uppercase tracking-wider block w-fit">
                            🔒 Central de Operações Fiscais Integrada
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-wider text-white">Painel Gerencial de Notas Fiscais</h3>
                        <p className="text-[11px] font-light leading-relaxed text-zinc-400">
                            Selecione uma filial abaixo para gerenciar a fila exclusiva de trabalho diário. Emita notas fiscais (NF-e) coordenadas e transmita os pacotes XML à SEFAZ em 1-clique.
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            setNewNfe({
                                clientName: '',
                                document: '',
                                description: '',
                                amount: '',
                                unit: selectedUnitFilter !== 'Todos' ? selectedUnitFilter : 'Matriz São Paulo',
                                jobId: ''
                            });
                            setShowNfeModal(true);
                        }} 
                        className="flex items-center justify-center gap-2 bg-white hover:bg-white text-black hover:text-black font-black text-xs uppercase tracking-widest px-5 py-3 rounded-none transition-all duration-300 shrink-0 cursor-pointer border border-white"
                    >
                        <FileText size={14} /> Emitir Nota Avulsa
                    </button>
                </div>

                {/* FILIAIS SELECTOR CARDS GRID (Painel Fácil e Intuitivo por Unidade) */}
                <div className="space-y-2 font-sans">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest font-mono">SELECIONE A UNIDADE ATIVA</span>
                        {selectedUnitFilter !== 'Todos' && (
                            <button 
                                onClick={() => setSelectedUnitFilter('Todos')}
                                className="text-[10px] text-white font-mono font-black uppercase hover:underline"
                            >
                                [✖ Ver Todas as Unidades]
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Option: Todos */}
                        <div 
                            onClick={() => setSelectedUnitFilter('Todos')}
                            className={`p-4 rounded-none border transition-all cursor-pointer flex flex-col justify-between ${
                                selectedUnitFilter === 'Todos' 
                                ? 'bg-white/10 border-white' 
                                : 'bg-black/35 border-[#444746] hover:bg-white/[0.02] hover:border-white/[0.1]'
                            }`}
                        >
                            <div>
                                <span className="text-[8px] font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded-none text-zinc-400 font-bold">Consolidação</span>
                                <h4 className="text-xs font-bold text-white uppercase mt-1.5">Múltiplas Filiais</h4>
                                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Ver todas as OS pendentes e registradas.</p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-white/[0.05] flex justify-between items-center">
                                <span className="text-[9px] text-[#818384] font-mono uppercase font-black">Pendentes: {filteredPendingInvoicesList.length}</span>
                                <span className="text-[10px] font-mono font-black text-white">Total</span>
                            </div>
                        </div>

                        {/* Map over WINF_LOCAL_UNITS for actual branches */}
                        {WINF_LOCAL_UNITS.map(unit => {
                            const pendingCount = (dynamicPendingInvoices || []).filter((j: any) => j.unit === unit.name).length + 
                                (unit.name === 'Unidade Campinas' ? 1 : 0) + 
                                (unit.name === 'Matriz São Paulo' ? 1 : 0); // Include standard seeded items

                            const isSelected = selectedUnitFilter === unit.name;

                            return (
                                <div 
                                    key={unit.name}
                                    onClick={() => setSelectedUnitFilter(unit.name)}
                                    className={`p-4 rounded-none border transition-all cursor-pointer flex flex-col justify-between relative ${
                                        isSelected 
                                        ? 'bg-white/10 border-white' 
                                        : 'bg-black/35 border-[#444746] hover:bg-white/[0.02] hover:border-white/[0.1]'
                                    }`}
                                >
                                    {pendingCount > 0 && (
                                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-white rounded-none animate-ping"></span>
                                    )}
                                    
                                    <div>
                                        <span className="text-[8.5px] font-mono uppercase font-black text-zinc-500 block truncated max-w-full" title={unit.razaoSocial}>
                                            {unit.name}
                                        </span>
                                        <h4 className="text-xs font-black text-white uppercase mt-1 leading-tight truncate">
                                            {unit.razaoSocial.replace("Winf Partners ", "").replace("Winf Capital ", "")}
                                        </h4>
                                        <div className="mt-1.5 space-y-0.5 text-[9px] text-zinc-500 font-mono">
                                            <p>CNPJ: {unit.cnpj}</p>
                                            <p>CEP: {unit.cep}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-white/[0.05] flex justify-between items-center text-[9px]">
                                        <span className="text-zinc-500 font-mono font-black uppercase">A Faturar:</span>
                                        <span className={`font-mono font-black ${pendingCount > 0 ? 'text-white' : 'text-zinc-650'}`}>
                                            {pendingCount} OS{pendingCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SEARCH AND QUICK FILTERS FOR UTILITY CONTROL */}
                <div className="p-4 bg-[#131314] border border-[#444746] rounded-none flex flex-col md:flex-row gap-4 justify-between items-center font-sans">
                    <div className="relative w-full md:max-w-md">
                        <span className="absolute inset-y-0 left-3 flex items-center text-zinc-500">
                            <Search size={14} />
                        </span>
                        <input
                            type="text"
                            value={searchNfeQuery}
                            onChange={(e) => setSearchNfeQuery(e.target.value)}
                            placeholder="Buscar notas por Cliente, CNPJ, Valor ou CPF..."
                            className="w-full bg-[#1e1f20] border border-[#444746] rounded-none pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600 font-bold uppercase tracking-wider"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest font-mono">Status:</span>
                            <select
                                value={statusNfeFilter}
                                onChange={(e) => setStatusNfeFilter(e.target.value)}
                                className="bg-[#1e1f20] border border-[#444746] text-xs text-white p-2 rounded-none focus:outline-none appearance-none cursor-pointer uppercase font-black tracking-widest"
                            >
                                <option value="Todos">Todos os Status</option>
                                <option value="Emitida">Emitida ✓</option>
                                <option value="Pendente">Pendente ⚡</option>
                                <option value="Processando">Processando ⌛</option>
                            </select>
                        </div>
                        
                        {(searchNfeQuery !== '' || statusNfeFilter !== 'Todos' || selectedUnitFilter !== 'Todos') && (
                            <button
                                onClick={() => {
                                    setSearchNfeQuery('');
                                    setStatusNfeFilter('Todos');
                                    setSelectedUnitFilter('Todos');
                                }}
                                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-none text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer border border-[#444746]"
                            >
                                Limpar Filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* WORKSPACE DUAL-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* COLUMN 1: PENDING BILLING QUEUE (Fila fácil de alimentar e faturar) - 5 Cols */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="p-4 bg-white/5 border border-white/20 rounded-none text-left">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                    <h4 className="text-xs font-black uppercase text-white tracking-[0.2em]">⚡ Fila de Faturamento</h4>
                                    <p className="text-[10px] text-zinc-400">Selecione uma OS pronta para registrar a nota instantaneamente.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-zinc-500 font-mono uppercase font-black tracking-wider">VALOR PENDENTE</div>
                                    <div className="text-sm font-mono font-black text-white">
                                        R$ {filteredPendingInvoicesList.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredPendingInvoicesList.length === 0 ? (
                                <div className="p-8 text-center bg-[#131314] border border-[#444746] rounded-none space-y-2">
                                    <div className="w-10 h-10 bg-white/10 text-white rounded-none border border-white/30 flex items-center justify-center mx-auto">
                                        <Check size={20} />
                                    </div>
                                    <h5 className="text-xs font-black text-white uppercase tracking-wider">Tudo em dia!</h5>
                                    <p className="text-[10px] text-zinc-500 max-w-xs mx-auto font-mono">Não há aplicações pendentes de nota fiscal para a unidade ou filtro selecionado.</p>
                                </div>
                            ) : (
                                filteredPendingInvoicesList.map((job) => {
                                    const matchedUnit = WINF_LOCAL_UNITS.find(u => u.name === job.unit);
                                    return (
                                        <div 
                                            key={job.id} 
                                            className="p-4.5 bg-[#131314] hover:bg-[#1e1f20] border border-[#444746] hover:border-white/50 transition-all rounded-none relative overflow-hidden flex flex-col justify-between gap-3 group"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] group-hover:bg-white/[0.02] rounded-none blur-xl pointer-events-none"></div>
                                            
                                            <div className="min-w-0 text-left">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="w-1.5 h-1.5 bg-white rounded-none animate-pulse"></span>
                                                    <span className="text-[9px] text-zinc-400 font-mono font-black uppercase tracking-wider">{job.service_order_id}</span>
                                                    <span className="text-[8.5px] text-white bg-white/10 px-2 py-0.5 rounded-none font-black font-mono uppercase">{job.unit}</span>
                                                </div>
                                                
                                                <h5 className="text-xs font-black text-white uppercase mt-1.5 leading-tight">{job.clientName}</h5>
                                                <p className="text-[10.5px] text-zinc-400 mt-1 font-mono uppercase font-bold text-[9px] tracking-wider">{job.details}</p>
                                                
                                                {matchedUnit && (
                                                    <div className="mt-2.5 p-2 bg-black/20 rounded-none text-[9px] font-mono space-y-0.5 border border-[#444746]">
                                                        <p className="text-white font-black uppercase text-[8px] tracking-wider">🏬 EMISSOR LEGAL AUTORIZADO</p>
                                                        <p className="text-white truncate font-bold uppercase">{matchedUnit.razaoSocial}</p>
                                                        <p className="text-zinc-500">CNPJ: {matchedUnit.cnpj} | CEP: {matchedUnit.cep}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-[#444746]/50">
                                                <span className="text-xs font-mono font-black text-white">R$ {job.amount.toLocaleString('pt-BR')}</span>
                                                <button
                                                    onClick={() => {
                                                        setNewNfe({
                                                            clientName: job.clientName,
                                                            document: job.document,
                                                            description: job.description,
                                                            amount: job.amount.toString(),
                                                            unit: job.unit,
                                                            jobId: job.isDynamic ? job.id : ''
                                                        });
                                                        setShowNfeModal(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-black text-black bg-white hover:bg-white hover:text-black hover:opacity-85 px-4 py-2 rounded-none transition-all cursor-pointer shadow-none"
                                                >
                                                    Faturar OS ⚡
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* COLUMN 2: ARCHIVED & RECENT TRANSMITTED INVOICES (HISTÓRICO) - 7 Cols */}
                    <div className="lg:col-span-7 bg-[#131314] border border-[#444746] p-5 sm:p-6 rounded-none space-y-4 font-sans text-left">
                        <div className="flex justify-between items-center pb-3 border-b border-[#444746]/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#818384] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-none"></span>
                                Notas Fiscais Emitidas ({filteredNfeList.length})
                            </h4>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase font-black">Status SEFAZ Sincronizado</span>
                        </div>

                        {filteredNfeList.length === 0 ? (
                            <div className="p-12 text-center text-zinc-500 space-y-1">
                                <FileText size={24} className="mx-auto text-zinc-700 mb-2" />
                                <p className="text-xs font-bold text-zinc-400 uppercase">Nenhuma nota encontrada</p>
                                <p className="text-[10px] text-zinc-650 max-w-xs mx-auto">Tente alterar os filtros de busca ou selecionar outra filial acima.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.02] overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-white/[0.05]">
                                            <th className="py-2 text-[9px] uppercase font-mono text-zinc-500 font-bold">Filial / Emitente</th>
                                            <th className="py-2 text-[9px] uppercase font-mono text-zinc-500 font-bold">Cliente / Tomador</th>
                                            <th className="py-2 text-[9px] uppercase font-mono text-zinc-500 font-bold">Valor (R$)</th>
                                            <th className="py-2 text-[9px] uppercase font-mono text-zinc-500 font-bold">Documentação</th>
                                            <th className="py-2 text-[9px] uppercase font-mono text-zinc-500 font-bold text-right">Ação / Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredNfeList.map((nf) => {
                                            const matchedUnit = WINF_LOCAL_UNITS.find(u => u.name === nf.unit);
                                            return (
                                                <tr key={nf.id} className="hover:bg-white/[0.01] transition-colors border-b border-white/[0.01]">
                                                    <td className="py-3 pr-2">
                                                        <span className="text-[10px] text-zinc-300 font-bold bg-white/5 border border-white/5 px-2 py-0.5 rounded-none uppercase font-mono block w-fit">{nf.unit}</span>
                                                        {matchedUnit && (
                                                            <span className="text-[8px] text-[#818384] font-mono block mt-1 uppercase" title={matchedUnit.razaoSocial}>
                                                                CNPJ EMISSOR: {matchedUnit.cnpj}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 pr-2">
                                                        <div className="min-w-[124px]">
                                                            <p className="text-[11px] font-bold text-white leading-tight uppercase font-black">{nf.clientName}</p>
                                                            <p className="text-[9px] text-zinc-505 font-mono mt-0.5">{nf.document}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-2 text-[11px] font-bold font-mono text-white">
                                                        R$ {nf.amount.toLocaleString('pt-BR')}
                                                    </td>
                                                    <td className="py-3 pr-2">
                                                        <div className="text-[9px] font-mono text-zinc-400">
                                                            <span className="block text-zinc-500">{nf.nfNumber}</span>
                                                            <span className="text-[8px] font-mono text-zinc-650 mt-0.5 block truncate max-w-[120px]" title={nf.description}>
                                                                {nf.description}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        {nf.status === 'Emitida' && (
                                                            <span className="inline-flex items-center gap-1 text-[9px] bg-white/10 text-white border border-white/25 px-2.5 py-1 rounded-none font-bold font-mono uppercase tracking-wide">
                                                                ✓ EMITIDA
                                                            </span>
                                                        )}
                                                        {nf.status === 'Processando' && (
                                                            <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2.5 py-1 rounded-none font-bold font-mono uppercase tracking-wide animate-pulse">
                                                                 TRANSMITINDO...
                                                            </span>
                                                        )}
                                                        {nf.status === 'Pendente' && (
                                                            <button
                                                                onClick={() => transmitNfe(nf.id)}
                                                                className="inline-flex items-center gap-1 text-[9px] bg-white hover:bg-white text-black px-2.5 py-1 rounded-none font-black font-mono uppercase tracking-widest transition-all cursor-pointer border border-white"
                                                            >
                                                                Transmitir XML ⚡
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        
        {/* Placeholder for Add Modal */}
        {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                <div className="w-full max-w-md bg-black border border-[#444746] p-5 sm:p-6 rounded-none relative z-10 animate-slide-up shadow-none">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#444746]">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">[ Nova Operação ]</h3>
                        <button onClick={() => setShowAddModal(false)} className="text-white hover:text-white font-mono text-xl p-1 shrink-0">&times;</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setNewTx({...newTx, type: 'income', category: INCOME_CATEGORIES[0]})}
                                className={`py-2.5 text-xs font-black uppercase tracking-widest rounded-none transition-all border ${newTx.type === 'income' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/45 border-[#444746] hover:bg-white/10'}`}
                            >
                                Receita
                            </button>
                            <button 
                                onClick={() => setNewTx({...newTx, type: 'expense', category: EXPENSE_CATEGORIES[0]})}
                                className={`py-2.5 text-xs font-black uppercase tracking-widest rounded-none transition-all border ${newTx.type === 'expense' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/45 border-[#444746] hover:bg-white/10'}`}
                            >
                                Despesa
                            </button>
                        </div>

                        {/* Quick Prefill Selection Row */}
                        <div>
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1.5 block">Sugestões (Preencher com 1-Clique)</label>
                            <div className="flex gap-2.5 overflow-x-auto pb-1 max-w-full scrollbar-none flex-nowrap">
                                {newTx.type === 'income' ? (
                                    <>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Aplicação Invisible Nano (Cobertura Residencial 12m²)',
                                                    amount: '1850',
                                                    category: 'Residencial (m²)',
                                                    allocation: 'maw'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            💎 Invisible 12m² (R$ 1.850)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Aplicação BlackPro (Fachada Comercial 8m²)',
                                                    amount: '950',
                                                    category: 'Corporativo / Fachada (m²)',
                                                    allocation: 'maw'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            🖤 BlackPro 8m² (R$ 950)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Venda de Kit Ferramentas Premium',
                                                    amount: '350',
                                                    category: 'Venda de Kits / Ferramentas',
                                                    allocation: 'stock'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            📦 Kit de Ferramentas (R$ 350)
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Aluguel Mensal Residencial/Loja',
                                                    amount: '2200',
                                                    category: 'Aluguel / Loja / Moradia',
                                                    allocation: 'operational'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            🏠 Aluguel (R$ 2.200)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Fatura Cartão de Crédito',
                                                    amount: '1500',
                                                    category: 'Cartão de Crédito',
                                                    allocation: 'operational'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            💳 Fatura Cartão (R$ 1.500)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Parcela de Financiamento',
                                                    amount: '750',
                                                    category: 'Prestações / Parcelas',
                                                    allocation: 'operational'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            📈 Prestação/Parcela (R$ 750)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Supermercado e Rancho Família',
                                                    amount: '600',
                                                    category: 'Família / Dependentes',
                                                    allocation: 'operational'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            🛒 Supermercado (R$ 600)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setNewTx({
                                                    ...newTx,
                                                    description: 'Lazer e Restaurante em Família',
                                                    amount: '250',
                                                    category: 'Lazer / Bem Estar',
                                                    allocation: 'operational'
                                                });
                                            }}
                                            className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-zinc-800 text-zinc-300 rounded-none shrink-0 transition-all font-sans cursor-pointer whitespace-nowrap uppercase font-bold"
                                        >
                                            🌊 Lazer Família (R$ 250)
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Descrição</label>
                            <input 
                                type="text"
                                value={newTx.description}
                                onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                                placeholder="Ex: Winf Select™ Architectural"
                                className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white focus:border-white focus:outline-none placeholder-zinc-850 uppercase font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Valor (R$)</label>
                                <input 
                                    type="number"
                                    value={newTx.amount}
                                    onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                                    placeholder="0.00"
                                    className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-zinc-400 font-mono font-bold focus:border-zinc-600 focus:outline-none placeholder-zinc-800"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Método</label>
                                <select 
                                    value={newTx.paymentMethod}
                                    onChange={(e) => setNewTx({...newTx, paymentMethod: e.target.value})}
                                    className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white uppercase font-black tracking-wider focus:border-zinc-600 focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Pix">Pix</option>
                                    <option value="Credit">Crédito</option>
                                    <option value="Debit">Débito</option>
                                    <option value="Cash">Dinheiro</option>
                                    <option value="BankTransfer">Transferência</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Categoria</label>
                            <select 
                                value={newTx.category}
                                onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                                className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white uppercase font-black tracking-wider focus:border-zinc-600 focus:outline-none appearance-none cursor-pointer"
                            >
                                {(newTx.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Direct Allocations Tag Selector */}
                        <div>
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">
                                Marcar Alocação ({newTx.type === 'income' ? 'Origem' : 'Destinação'})
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setNewTx({...newTx, allocation: 'maw'})}
                                    className={`py-2 px-1 text-[10px] uppercase font-mono font-bold rounded-none transition-all border leading-tight ${newTx.allocation === 'maw' ? 'bg-zinc-800/20 text-zinc-400 border-zinc-600' : 'bg-[#131314] text-zinc-500 border-[#444746] hover:bg-white/10'}`}
                                >
                                    ⚡ Meta MAW™
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setNewTx({...newTx, allocation: 'stock'})}
                                    className={`py-2 px-1 text-[10px] uppercase font-mono font-bold rounded-none transition-all border leading-tight ${newTx.allocation === 'stock' ? 'bg-zinc-800/20 text-zinc-400 border-zinc-600' : 'bg-[#131314] text-zinc-500 border-[#444746] hover:bg-white/10'}`}
                                >
                                    📦 Estoque
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setNewTx({...newTx, allocation: 'operational'})}
                                    className={`py-2 px-1 text-[10px] uppercase font-mono font-bold rounded-none transition-all border leading-tight ${newTx.allocation === 'operational' || newTx.allocation === null ? 'bg-zinc-800 text-zinc-300 border-zinc-600' : 'bg-[#131314] text-zinc-500 border-[#444746] hover:bg-white/10'}`}
                                >
                                    💼 Geral
                                </button>
                            </div>
                        </div>

                        {/* Interactive Status checklist toggle */}
                        <div className="flex items-center justify-between bg-black/20 border border-[#444746] p-3 rounded-none">
                            <div className="min-w-0 pr-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Status do Lançamento</label>
                                <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight font-mono uppercase">Marque se este valor já foi pago/recebido.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNewTx({...newTx, isPaid: !newTx.isPaid})}
                                className={`px-2.5 py-1.5 text-[9px] uppercase font-mono font-black border transition-all rounded-none flex items-center gap-1 shrink-0 ${newTx.isPaid ? 'bg-zinc-400/10 text-zinc-300 border-zinc-400/30' : 'bg-neutral-500/10 text-neutral-400 border-[#444746]'}`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-none ${newTx.isPaid ? 'bg-zinc-300' : 'bg-neutral-500'}`}></span>
                                {newTx.isPaid ? (newTx.type === 'income' ? 'Recebido ✓' : 'Pago ✓') : (newTx.type === 'income' ? 'Pendente' : 'Pendente')}
                            </button>
                        </div>

                        {newTx.type === 'expense' && (
                            <div className="pt-1">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Comprovante / Recibo</label>
                                <div className="relative group/photo">
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full border border-dashed border-[#444746] p-4 rounded-none flex flex-col items-center justify-center gap-2 group-hover/photo:border-white/30 transition-all bg-white/[0.01]">
                                        {newTx.receiptPreview ? (
                                            <div className="relative w-full aspect-video rounded-none overflow-hidden">
                                                <img src={newTx.receiptPreview} alt="Comprovante" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Alterar Foto</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-8 h-8 bg-white/5 rounded-none border border-white/10 flex items-center justify-center">
                                                    <Plus size={16} className="text-white/40" />
                                                </div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tirar ou Anexar Foto</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-3">
                            <button 
                                onClick={handleAddTx} 
                                disabled={!newTx.description || !newTx.amount}
                                className="w-full py-3 bg-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-none disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 transition-all duration-300 shadow-none border border-zinc-600 cursor-pointer"
                            >
                                Registrar Lançamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showNfeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowNfeModal(false)}></div>
                <div className="w-full max-w-md bg-black border border-[#444746] p-5 sm:p-6 rounded-none relative z-10 animate-slide-up shadow-none text-left font-sans">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#444746]">
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileText size={14} className="text-zinc-400" />
                            [ Solicitar Nova NF-e ]
                        </h3>
                        <button onClick={() => setShowNfeModal(false)} className="text-zinc-400 hover:text-white font-mono text-xl p-1 shrink-0">&times;</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Unidade Geradora</label>
                            <select 
                                value={newNfe.unit}
                                onChange={(e) => setNewNfe({...newNfe, unit: e.target.value})}
                                className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white uppercase font-black tracking-wider focus:border-zinc-600 focus:outline-none appearance-none cursor-pointer"
                            >
                                <option value="Matriz São Paulo">Matriz São Paulo</option>
                                <option value="Unidade Campinas">Unidade Campinas</option>
                                <option value="Unidade Rio de Janeiro">Unidade Rio de Janeiro</option>
                                <option value="Unidade Belo Horizonte">Unidade Belo Horizonte</option>
                            </select>

                            {(() => {
                                const selectedIssuer = WINF_LOCAL_UNITS.find(u => u.name === newNfe.unit) || WINF_LOCAL_UNITS[0];
                                return selectedIssuer ? (
                                    <div className="mt-2 text-left bg-zinc-950 border border-zinc-800 p-3 rounded-none space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[8px] font-mono font-black uppercase text-zinc-400 tracking-widest">🏢 CREDENCIAIS FISCAIS DO EMITENTE</span>
                                            <span className="text-[8px] text-zinc-400 font-bold bg-zinc-800/10 px-1 rounded-none border border-zinc-600/25 font-mono">ATIVO</span>
                                        </div>
                                        <h5 className="text-[10px] font-bold text-white mt-1 leading-tight uppercase tracking-wider">{selectedIssuer.razaoSocial}</h5>
                                        <div className="flex gap-3 text-[9px] text-zinc-500 font-mono">
                                            <span>CNPJ: <strong className="text-zinc-300">{selectedIssuer.cnpj}</strong></span>
                                            <span>CEP: <strong className="text-zinc-300">{selectedIssuer.cep}</strong></span>
                                        </div>
                                        <p className="text-[8.5px] text-zinc-650 font-mono truncate uppercase">{selectedIssuer.endereco}</p>
                                    </div>
                                ) : null;
                            })()}
                        </div>

                        <div>
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Nome do Cliente</label>
                            <input 
                                type="text"
                                value={newNfe.clientName || ''}
                                onChange={(e) => setNewNfe({...newNfe, clientName: e.target.value})}
                                placeholder="Ex: Dr. Carlos Eduardo Nogueira"
                                className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white uppercase font-bold tracking-wider focus:border-zinc-600 focus:outline-none placeholder-zinc-850"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Documento (CPF/CNPJ)</label>
                                <input 
                                    type="text"
                                    value={newNfe.document || ''}
                                    onChange={(e) => setNewNfe({...newNfe, document: e.target.value})}
                                    placeholder="000.000.000-00"
                                    className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white font-mono focus:border-zinc-600 focus:outline-none placeholder-zinc-800"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Valor Total (R$)</label>
                                <input 
                                    type="number"
                                    value={newNfe.amount || ''}
                                    onChange={(e) => setNewNfe({...newNfe, amount: e.target.value})}
                                    placeholder="0.00"
                                    className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-zinc-400 font-mono font-bold focus:border-zinc-600 focus:outline-none placeholder-zinc-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1.5 block">Descrição Fiscal do Serviço</label>
                            <textarea 
                                value={newNfe.description || ''}
                                onChange={(e) => setNewNfe({...newNfe, description: e.target.value})}
                                placeholder="Ex: Prestação de serviços de aplicação de película de controle..."
                                rows={3}
                                className="w-full bg-[#131314] border border-[#444746] rounded-none p-2.5 text-xs text-white focus:border-zinc-600 focus:outline-none placeholder-zinc-850 resize-none font-sans"
                            />
                        </div>

                        <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-none">
                            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed uppercase">
                                <strong className="text-zinc-400">💡 Integração Sincronizada:</strong> Ao enviar, esta nota entra na fila fiscal ativa do Winf OS™ para validação na Prefeitura.
                            </p>
                        </div>

                        <div className="pt-3">
                            <button 
                                onClick={handleCreateNfe}
                                disabled={!newNfe.clientName || !newNfe.amount || !newNfe.description}
                                className="w-full py-3 bg-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-none disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-850 transition-all duration-300 border border-zinc-600 cursor-pointer"
                            >
                                Enviar Solicitação Fiscal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ModuleFinancial;
