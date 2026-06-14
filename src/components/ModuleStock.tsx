
import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, History, TrendingUp, AlertCircle, Search, Filter, ChevronRight, ArrowDownLeft, ArrowUpRight, Scissors, Bot, Trash2, Cpu, X } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { motion, AnimatePresence } from 'framer-motion';
import { WNO } from '../lib/wnoEngine';

interface ModuleStockProps {
    onBack?: () => void;
}

const DEFAULT_SANTOS_ITEMS = [
    { id: 'ST-001', nome: 'Winf Invisible® Premium Pro', metros: 30, preco: 150 },
    { id: 'ST-002', nome: 'Winf BlackPro® Carbon Ultra', metros: 30, preco: 95 },
    { id: 'ST-003', nome: 'Winf Dual Reflect® Extreme Deep', metros: 30, preco: 125 },
];

const ModuleStock: React.FC<ModuleStockProps> = ({ onBack }) => {
    const { stockItems, stockHistory, retalhos, fetchRetalhos, addRetalho, updateStock, user, gamify, dispatchAgentCommand, effectiveRole } = useWinf();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddRetalhoModal, setShowAddRetalhoModal] = useState(false);
    const [selectedRetalhoProduct, setSelectedRetalhoProduct] = useState<any>(null);
    const [isAgentProcessing, setIsAgentProcessing] = useState(false);

    const [showCargaSantosModal, setShowCargaSantosModal] = useState(false);
    const [santosLogs, setSantosLogs] = useState<string[]>([]);
    const [santosLedgerInputs, setSantosLedgerInputs] = useState<any[]>([]);
    const [santosCargaExecutada, setSantosCargaExecutada] = useState(false);
    const [estaProcessandoLote, setEstaProcessandoLote] = useState(false);

    useEffect(() => {
        const loadLedger = () => {
            const inputs = WNO.ledger.getInputs();
            setSantosLedgerInputs(inputs.filter((i: any) => i.localizacao === 'SANTOS_01'));
        };
        loadLedger();
        window.addEventListener('ray_ledger_updated', loadLedger);
        return () => {
            window.removeEventListener('ray_ledger_updated', loadLedger);
        };
    }, []);

    const gerarHashUnico = (id: string | number) => {
        return 'LST-' + btoa(`${id}-${Date.now()}-${Math.random()}`).substring(0, 12).toUpperCase();
    };

    const carregarEstoqueSantos = async (itens: any[]) => {
        setEstaProcessandoLote(true);
        setSantosLogs(["[AUDITORIA] carregarEstoqueSantos() - Iniciando carga de estoque no HUB Santos 01..."]);
        
        for (let i = 0; i < itens.length; i++) {
            const item = itens[i];
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const newHash = gerarHashUnico(item.id);
            
            WNO.ledger.input({
                produto: item.nome,
                quantidade: item.metros,
                valorUnitario: item.preco,
                hash: newHash,
                localizacao: 'SANTOS_01'
            });
            
            setSantosLogs(prev => [
                ...prev,
                `[INPUT] Produto: "${item.nome}" | Quantidade: ${item.metros}m | Valor: R$ ${item.preco} | Hash: "${newHash}"`
            ]);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        const msg = "[AUDITORIA] Estoque de Lastro: Santos 01 - REGISTRADO.";
        console.log(msg);
        setSantosLogs(prev => [
            ...prev,
            `\nSUCCESS: ${msg}`
        ]);
        setSantosCargaExecutada(true);
        setEstaProcessandoLote(false);
        gamify('COIN_PURCHASE', { message: 'Último lote de lastros integrado com sucesso no Ledger W-NO!' });
    };

    useEffect(() => {
        fetchRetalhos();
    }, [fetchRetalhos]);

    const handleAgentReplenish = async () => {
        const lowStockItems = stockItems.filter(i => i.remaining_meters < 5);
        if (lowStockItems.length === 0) return;

        setIsAgentProcessing(true);
        const itemNames = lowStockItems.map(i => i.product_name).join(', ');
        
        await dispatchAgentCommand({
            type: 'MESSAGE',
            action: `Solicitar reposição de estoque baixo: ${itemNames}`,
            payload: { items: lowStockItems }
        });

        setIsAgentProcessing(false);
        alert(`Agente Neural acionado para reposição de: ${itemNames}`);
    };

    const filteredStock = stockItems.filter(item => 
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayHistory = stockHistory.length > 0 ? stockHistory.slice(0, 5) : [
        { type: 'OUT', product_name: 'Winf Invisible®', amount: 2.4, date: new Date().toISOString(), ref: 'Orçamento #Q-128' },
        { type: 'IN', product_name: 'Winf BlackPro®', amount: 30.0, date: new Date().toISOString(), ref: 'Compra BlackShop' },
        { type: 'OUT', product_name: 'Winf Dual Reflect®', amount: 1.8, date: new Date(Date.now() - 86400000).toISOString(), ref: 'Orçamento #Q-127' },
    ];

    const totalStockValue = filteredStock.reduce((acc, item) => acc + (item.remaining_meters * 15), 0); // Mock value per meter

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-fade-in pb-24 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#444746] pb-8">
                <div className="flex items-center gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Winf™ | Estoque & Rolls</h1>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                    <button 
                        onClick={() => {
                            setSantosLogs([]);
                            setSantosCargaExecutada(false);
                            setShowCargaSantosModal(true);
                        }}
                        className="bg-zinc-800 text-zinc-300 px-6 py-4 font-black flex items-center gap-2 transition-all uppercase tracking-[0.2em] text-xs md:text-[10px]"
                    >
                        <Cpu size={16} /> Carga Santos 01
                    </button>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-white hover:bg-zinc-200 text-black px-6 py-4 font-black flex items-center gap-2 transition-all uppercase tracking-[0.2em] text-xs md:text-[10px]"
                    >
                        <Plus size={16} /> Nova Entrada
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 space-y-4">
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-black tracking-[0.3em]">Total em Estoque</p>
                    <h3 className="text-4xl font-mono text-white tracking-tighter">{stockItems.reduce((acc, i) => acc + (i.remaining_meters || 0), 0).toFixed(1)}m</h3>
                    <div className="flex items-center gap-2 text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-widest mt-2 border-t border-[#444746] pt-4">
                        <TrendingUp size={12} className="text-white/60" /> +5.2% vs mês anterior
                    </div>
                </div>
                <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 space-y-4">
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-black tracking-[0.3em]">Valor Estimado</p>
                    <h3 className="text-4xl font-mono text-white tracking-tighter">R$ {totalStockValue.toLocaleString()}</h3>
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-widest mt-2 border-t border-[#444746] pt-4">Baseado em custo médio</p>
                </div>
                <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 space-y-4">
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-black tracking-[0.3em]">Rolos Ativos</p>
                    <h3 className="text-4xl font-mono text-white tracking-tighter">{stockItems.length}</h3>
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-widest mt-2 border-t border-[#444746] pt-4">Prontos para corte</p>
                </div>
                <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-black tracking-[0.3em]">Alertas de Reposição</p>
                            <h3 className="text-4xl font-mono text-white tracking-tighter">{stockItems.filter(i => i.remaining_meters < 5).length}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs md:text-[10px] text-white font-bold">
                            <AlertCircle size={14} className="text-white/60" />
                        </div>
                    </div>
                    {stockItems.filter(i => i.remaining_meters < 5).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#444746]">
                            <button 
                                onClick={handleAgentReplenish}
                                disabled={isAgentProcessing}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/80 text-xs md:text-[10px] md:text-sm md:text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all border border-[#444746]"
                            >
                                <Bot size={14} className={isAgentProcessing ? 'animate-pulse' : ''} />
                                {isAgentProcessing ? 'Acionando Agente...' : 'Solicitar Reposição'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory & Retalhos Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inventory Table */}
                <div className="col-span-2 bg-[#131314] border border-[#444746] overflow-hidden">
                    <div className="p-8 border-b border-[#444746] flex flex-col md:flex-row justify-between items-center gap-6">
                        <h3 className="text-sm md:text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3"><Package size={16} className="text-white/40" /> Inventário de Rolos</h3>
                        <div className="relative w-full md:w-80">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                            <input 
                                type="text" 
                                placeholder="Buscar material..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-[#131314] border border-[#444746] py-3 pl-12 pr-4 text-white text-sm md:text-[11px] font-bold uppercase tracking-widest outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-white/60">
                            <thead className="bg-[#131314] text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase font-black tracking-[0.3em] text-white/40">
                                <tr>
                                    <th className="p-6">Material</th>
                                    <th className="p-6">Disponível</th>
                                    <th className="p-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#444746]">
                                {filteredStock.map(item => {
                                    const nameLower = item.product_name?.toLowerCase() || '';
                                    const isAeroOrPPF = nameLower.includes('aerocore') || nameLower.includes('neoskin');
                                    const isRestricted = isAeroOrPPF && (effectiveRole || user?.role) !== 'Admin';

                                    return (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <p className="text-white font-light text-lg flex items-center gap-2">
                                                        {item.product_name}
                                                        {isRestricted && (
                                                            <span className="text-[9px] font-mono tracking-widest bg-red-500/10 border border-red-500/30 text-red-500 px-2 py-0.5 uppercase font-bold">
                                                                🔒 Standby / Locked
                                                            </span>
                                                        )}
                                                    </p>
                                                    {isRestricted && (
                                                        <span className="text-[10px] text-white/30 italic font-mono mt-0.5">
                                                            Sob governança de alta prioridade. Lançamento restrito à inauguração do WINF Studio.
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {isRestricted ? (
                                                    <span className="text-white/30 font-mono text-sm uppercase tracking-wider">Bloqueado</span>
                                                ) : (
                                                    <span className="text-white font-mono text-lg">{(item.remaining_meters || 0).toFixed(1)}m</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                {isRestricted ? (
                                                    <div className="inline-flex p-3 bg-white/5 border border-[#444746] text-white/20 select-none cursor-not-allowed uppercase text-[9px] tracking-widest font-mono font-bold" title="Acesso Bloqueado pelo Conselho W12">
                                                        Restrito
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => { setSelectedRetalhoProduct(item); setShowAddRetalhoModal(true); }}
                                                        className="p-3 bg-[#131314] hover:bg-white/5 transition-all border border-[#444746] text-white/40 hover:text-white"
                                                    >
                                                        <Scissors size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Retalhos Table */}
                <div className="col-span-1 bg-[#131314] border border-[#444746] overflow-hidden">
                    <div className="p-8 border-b border-[#444746] flex justify-between items-center">
                        <h3 className="text-sm md:text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3"><Scissors size={16} className="text-white/40" /> Retalhos</h3>
                    </div>
                    <div className="p-6 space-y-3">
                        {retalhos.map(retalho => (
                            <div key={retalho.id} className="p-4 bg-[#131314] border border-[#444746] flex justify-between items-center text-xs md:text-[10px] uppercase font-bold tracking-widest">
                                <div>
                                    <p className="text-white">{retalho.product_name}</p>
                                    <p className="text-white/40">{retalho.dimensions}</p>
                                </div>
                                <span className="text-white/80 font-mono tracking-tighter">{retalho.areaM2}m²</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Movements */}
            <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 space-y-6">
                    <h3 className="text-sm md:text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3"><History size={16} className="text-white/40" /> Movimentações Recentes</h3>
                    <div className="space-y-4">
                        {displayHistory.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-[#131314] border border-[#444746]">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 flex items-center justify-center border ${m.type === 'IN' ? 'bg-white/5 border-[#444746] text-white' : 'bg-transparent border-[#444746] text-white/40'}`}>
                                        {m.type === 'IN' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-white font-light text-lg">{m.product_name}</p>
                                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold tracking-widest mt-1">{m.ref || 'Movimentação'} • {new Date(m.date).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className={`font-mono text-xl ${m.type === 'IN' ? 'text-white/80' : 'text-white/40'}`}>
                                    {m.type === 'IN' ? '+' : '-'}{m.amount}m
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optimization Insight */}
                <div className="bg-gradient-to-br from-[#0A0A0A] to-black border border-[#444746] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-5 md:p-8 opacity-10">
                        <TrendingUp size={160} className="text-white" />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="w-16 h-16 bg-white flex items-center justify-center text-black">
                            <TrendingUp size={28} />
                        </div>
                        <h3 className="text-3xl font-light text-white tracking-tight">Insight de Otimização</h3>
                        <p className="text-white/60 text-sm md:text-[11px] font-bold uppercase tracking-[0.1em] leading-relaxed max-w-sm">
                            Seu aproveitamento de material subiu <span className="text-white">14%</span> este mês usando o Winf Precision™. Economia de <span className="text-white">R$ 1.240</span> em desperdício evitado.
                        </p>
                    </div>
                    <button className="w-full mt-8 py-5 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-[0.2em] text-xs md:text-[10px] transition-all">
                        Ver Relatório de Desperdício
                    </button>
                </div>
            </div>

            {/* Add Retalho Modal */}
            <AnimatePresence>
                {showAddRetalhoModal && selectedRetalhoProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131314]/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-[#131314] border border-[#444746] p-6 rounded-none w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Scissors size={20} className="text-white" /> Registrar Retalho
                            </h3>
                            <p className="text-sm text-white/40 mb-4">
                                Material: <strong className="text-white">{selectedRetalhoProduct.product_name}</strong>
                            </p>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const dimensions = formData.get('dimensions') as string;
                                const areaM2 = parseFloat(formData.get('areaM2') as string);
                                if (dimensions && !isNaN(areaM2)) {
                                    setIsAgentProcessing(true);
                                    await addRetalho({
                                        product_id: selectedRetalhoProduct.id,
                                        product_name: selectedRetalhoProduct.product_name,
                                        dimensions,
                                        areaM2,
                                        is_used: false
                                    });
                                    setIsAgentProcessing(false);
                                    setShowAddRetalhoModal(false);
                                    gamify('SALE_CLOSED', { message: 'Retalho salvo!' });
                                }
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-xs md:text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Dimensões (Ex: 1.5m x 0.5m)</label>
                                    <input name="dimensions" required placeholder="1.5m x 0.5m" className="w-full bg-[#131314] border border-[#444746] p-3 text-white text-sm outline-none focus:border-winf-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Área (m²)</label>
                                    <input name="areaM2" required type="number" step="0.01" placeholder="0.75" className="w-full bg-[#131314] border border-[#444746] p-3 text-white text-sm outline-none focus:border-winf-primary transition-all" />
                                </div>
                                <div className="flex gap-4 pt-4 border-t border-[#444746]">
                                    <button type="button" onClick={() => setShowAddRetalhoModal(false)} className="flex-1 py-3 text-white/40 hover:text-white transition-colors font-bold text-sm">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isAgentProcessing} className="flex-1 bg-white hover:bg-white_hover text-winf-background font-bold py-3 transition-all flex items-center justify-center gap-2">
                                        {isAgentProcessing ? <Bot size={16} className="animate-spin" /> : 'Registrar'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* TERMINAL DE CARGA DE ESTOQUE SANTOS 01 WINF OS™ */}
            <AnimatePresence>
                {showCargaSantosModal && (
                    <div className="fixed inset-0 z-50 bg-[#131314]/95 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl bg-zinc-950 border-2 border-zinc-600/20 rounded-none overflow-hidden font-mono flex flex-col h-[600px]"
                            style={{ boxShadow: '0 0 60px rgba(255,255,255, 0.1)' }}
                        >
                            {/* Header */}
                            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-[#444746]">
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-none bg-zinc-800 animate-pulse" />
                                    <span className="text-xs font-black tracking-widest text-zinc-400 uppercase font-mono">WINF OS™ // INTEGRATION GATEWAY // SANTOS_01</span>
                                </div>
                                <button 
                                    onClick={() => setShowCargaSantosModal(false)}
                                    className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded-none transition-all cursor-pointer border border-white/15"
                                    disabled={estaProcessandoLote}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
                                {/* Left column: Actions and Terminal */}
                                <div className="lg:col-span-8 flex flex-col h-full border-r border-[#444746]">
                                    {/* Info Panel */}
                                    <div className="p-6 bg-zinc-900/30 border-b border-[#444746] space-y-2">
                                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                                            Este painel gerencia a sincronização de entrada física de rolos e lastreamento criptográfico via <code className="text-zinc-400 font-mono">carregarEstoqueSantos()</code> no HUB Alfandegário Santos 01.
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">
                                            <div>Status do Terminal: <span className={santosCargaExecutada ? 'text-zinc-400' : estaProcessandoLote ? 'text-yellow-500 animate-pulse' : 'text-zinc-400'}>{santosCargaExecutada ? 'CADASTRADO' : estaProcessandoLote ? 'EXECUTANDO SCRIPT...' : 'PRONTO'}</span></div>
                                            <div>Pre-sets de Lote: <span className="text-white">4 PRODUTOS</span></div>
                                        </div>
                                    </div>

                                    {/* Terminal logs */}
                                    <div className="flex-1 bg-[#131314] p-6 overflow-y-auto space-y-2 text-[11px] font-mono">
                                        {santosLogs.length === 0 ? (
                                            <div className="text-zinc-650 flex flex-col items-center justify-center h-full gap-2 font-sans-serif">
                                                <Cpu className="w-8 h-8 opacity-40 animate-pulse text-zinc-400 mx-auto mb-2" />
                                                <p className="text-xs text-zinc-500 text-center font-sans uppercase tracking-[0.1em]">Terminal em prontidão. Clique em executar para carregar o estoque de lastro.</p>
                                            </div>
                                        ) : (
                                            santosLogs.map((logLine, idx) => (
                                                <div key={idx} className="flex gap-3 leading-relaxed">
                                                    <span className="text-zinc-700 select-none">[{String(idx + 1).padStart(3, '0')}]</span>
                                                    <span className={logLine.includes('SUCCESS') || logLine.includes('Estoque de Lastro') || logLine.includes('SUCCESS:') ? 'text-zinc-400 font-bold' : logLine.includes('[INPUT]') ? 'text-blue-400 font-medium' : 'text-zinc-300'}>
                                                        {logLine}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Actions bottom bar */}
                                    <div className="bg-zinc-900 border-t border-[#444746] p-4 flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-500 font-bold font-sans uppercase">Auditoria Criptográfica de Lastreamento</span>
                                        <button 
                                            onClick={() => carregarEstoqueSantos(DEFAULT_SANTOS_ITEMS)}
                                            disabled={estaProcessandoLote}
                                            className="bg-zinc-800 text-zinc-300 px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-wider transition-all"
                                        >
                                            {estaProcessandoLote ? 'Executando...' : 'Carregar Estoque Santos'}
                                        </button>
                                    </div>
                                </div>

                                {/* Right column: Current local ledger list */}
                                <div className="lg:col-span-4 flex flex-col h-full bg-zinc-950/40 font-sans">
                                    <div className="p-4 bg-zinc-900/60 border-b border-[#444746] flex items-center gap-2">
                                        <Package className="w-4 h-4 text-zinc-400" />
                                        <span className="text-[10px] font-black tracking-wider text-white uppercase font-sans">Ledger Imutável (Santos 01)</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
                                        {santosLedgerInputs.length === 0 ? (
                                            <div className="text-center py-20 text-zinc-650 space-y-1">
                                                <Package className="w-8 h-8 opacity-20 mx-auto mb-2 text-zinc-400" />
                                                <p className="text-xs font-black uppercase tracking-wider text-zinc-400 font-sans text-center">Nenhum Registro</p>
                                                <p className="text-[10px] text-zinc-650 font-sans text-center">Execute a carga para ver os inputs registrados no W-NO Ledger.</p>
                                            </div>
                                        ) : (
                                            santosLedgerInputs.map((item, idx) => (
                                                <div key={idx} className="p-3 bg-zinc-900/80 border border-[#444746] rounded-none space-y-1.5 hover:border-zinc-600/30 transition-all font-mono">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs text-white font-bold truncate pr-1 max-w-[130px]" title={item.produto}>{item.produto}</span>
                                                        <span className="text-[9px] bg-zinc-800/10 text-zinc-400 px-1.5 py-0.5 font-bold uppercase rounded-none">{item.quantidade}m</span>
                                                    </div>
                                                    <div className="flex justify-between text-[9px] text-zinc-500">
                                                        <span>Val: R$ {item.valorUnitario}/m</span>
                                                        <span className="text-blue-400 select-all font-semibold font-mono text-[8px]">{item.hash}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModuleStock;
