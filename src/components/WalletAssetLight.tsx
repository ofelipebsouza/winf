import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Plus, Bot, History, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const WalletAssetLight: React.FC = () => {
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'income', description: 'Repasse Projeto Confidencial #042', amount: 4500, date: '2026-05-15' },
        { id: 2, type: 'expense', description: 'Reposição Blackshop - Ferramentas', amount: -350, date: '2026-05-16' },
        { id: 3, type: 'expense', description: 'Combustível / Deslocamento', amount: -150, date: '2026-05-17' },
        { id: 4, type: 'expense_fixed', description: 'Assinatura Asset Light Mensal', amount: -800, date: '2026-05-01' },
    ]);

    const [personalFixedExpenses, setPersonalFixedExpenses] = useState(2500);
    const [businessFixedExpenses, setBusinessFixedExpenses] = useState(1500);

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');

    const balance = transactions.reduce((acc, curr) => acc + curr.amount, 12000); 
    const monthIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const monthExpense = transactions.filter(t => t.type.includes('expense')).reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const transactionsFixedExpenses = transactions.filter(t => t.type === 'expense_fixed').reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    
    const totalMonthlyFixedExpenses = transactionsFixedExpenses + personalFixedExpenses + businessFixedExpenses;
    const savingsPotential = monthIncome > 0 ? ((monthIncome - (monthExpense + totalMonthlyFixedExpenses)) / monthIncome) * 100 : 0;

    const handleAiSubmit = () => {
        if (!aiInput.trim()) return;
        
        // Mock simple AI parsing
        const isExpense = aiInput.toLowerCase().includes('gastei') || aiInput.toLowerCase().includes('paguei') || aiInput.toLowerCase().includes('comprei');
        const amountMatch = aiInput.match(/\d+(?:[.,]\d+)?/);
        const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : 0;
        
        if (amount > 0) {
            setTransactions([
                {
                    id: Date.now(),
                    type: isExpense ? 'expense' : 'income',
                    description: aiInput,
                    amount: isExpense ? -amount : amount,
                    date: new Date().toISOString().split('T')[0]
                },
                ...transactions
            ]);
        }
        setAiInput('');
        setIsAiModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h2 className="text-2xl font-light text-white tracking-tight">Carteira Operacional</h2>
                <p className="text-zinc-500 font-mono text-xs uppercase mt-1">Gestão de Caixa Asset Light</p>
            </header>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#131314] border border-[#444746] p-6 rounded-none">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-zinc-500 text-xs font-mono uppercase">Saldo Disponível</p>
                            <h3 className="text-3xl font-light text-white mt-1">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                            </h3>
                        </div>
                        <div className="p-2 bg-winf-primary/10 rounded-none text-winf-primary">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>Livre para saque / uso</span>
                    </div>
                </div>

                <div className="bg-[#131314] border border-[#444746] p-6 rounded-none">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-zinc-500 text-xs font-mono uppercase">Entradas (Mês)</p>
                            <h3 className="text-2xl font-light text-emerald-400 mt-1">
                                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthIncome)}
                            </h3>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-none text-emerald-400">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#131314] border border-[#444746] p-6 rounded-none">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-zinc-500 text-xs font-mono uppercase">Saídas e Fixos Estimados</p>
                            <h3 className="text-2xl font-light text-red-400 mt-1">
                                - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthExpense + totalMonthlyFixedExpenses)}
                            </h3>
                        </div>
                        <div className="p-2 bg-red-500/10 rounded-none text-red-400">
                            <ArrowDownRight size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono text-[10px]">TOTAL FIXOS: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonthlyFixedExpenses)}</span>
                    </div>
                </div>
            </div>

            {/* Economy Metrics */}
            <div className="bg-[#131314] border border-[#444746] p-6 rounded-none">
                <h3 className="text-lg font-medium text-white mb-4">Métricas de Prosperidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#131314]/50 p-4 rounded-none border border-[#444746]">
                        <p className="text-zinc-500 text-xs font-mono uppercase">Potencial de Economia</p>
                        <p className={`text-2xl font-light ${savingsPotential > 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {savingsPotential.toFixed(1)}%
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">{savingsPotential > 20 ? 'Excelente performance' : 'Há espaço para otimização'}</p>
                    </div>
                    <div className="bg-[#131314]/50 p-4 rounded-none border border-[#444746]">
                         <p className="text-zinc-500 text-xs font-mono uppercase">Custo Fixo sobre Receita</p>
                         <p className="text-2xl font-light text-white">
                            {monthIncome > 0 ? ((totalMonthlyFixedExpenses / monthIncome) * 100).toFixed(1) : 0}%
                         </p>
                    </div>
                </div>
                 {/* Fixed Expenses Management */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-400 w-32">Fixo Pessoal:</label>
                        <input type="number" value={personalFixedExpenses} onChange={(e) => setPersonalFixedExpenses(Number(e.target.value))} className="bg-[#131314] border border-[#444746] p-2 rounded-none w-full text-white text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-400 w-32">Fixo Unidade:</label>
                        <input type="number" value={businessFixedExpenses} onChange={(e) => setBusinessFixedExpenses(Number(e.target.value))} className="bg-[#131314] border border-[#444746] p-2 rounded-none w-full text-white text-sm" />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button 
                  onClick={() => setIsAiModalOpen(true)}
                  className="bg-winf-primary text-black px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-winf-primary/90 transition-colors"
                >
                    <Bot size={16} /> Adicionar com IA
                </button>
                <button className="bg-transparent border border-[#444746] text-white px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 transition-colors">
                    <Plus size={16} /> Registro Manual
                </button>
            </div>

            {/* AI Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131314]/80 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#111] border border-winf-primary/30 p-8 w-full max-w-lg rounded-none"
                    >
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Bot size={24} className="text-winf-primary" /> Assistente Financeiro</h3>
                        <p className="text-zinc-400 text-sm mb-6">Descreva o gasto ou entrada em linguagem natural.</p>
                        
                        <textarea
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            placeholder="Ex: Gastei 150 reais de combustível ontem indo para a obra."
                            className="w-full bg-[#131314] border border-[#444746] p-4 rounded-none text-white mb-4 h-32 focus:outline-none focus:border-winf-primary resize-none"
                        />
                        
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsAiModalOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase hover:text-white">Cancelar</button>
                            <button onClick={handleAiSubmit} className="px-6 py-2 bg-winf-primary text-black text-xs font-bold uppercase hover:bg-white transition-colors tracking-widest">Processar</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Extrato ListView */}
            <div className="bg-[#131314] border border-[#444746] rounded-none overflow-hidden mt-8">
                <div className="p-6 border-b border-[#444746] flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2"><History size={18} /> Histórico de Transações</h3>
                    <button className="text-zinc-500 hover:text-white transition-colors"><Settings size={18} /></button>
                </div>
                <div className="divide-y divide-[#444746]">
                    {transactions.map(t => (
                        <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-none ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                </div>
                                <div>
                                    <p className="text-white text-sm">{t.description}</p>
                                    <p className="text-zinc-500 text-xs font-mono">{t.date}</p>
                                </div>
                            </div>
                            <div className={`font-mono text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.type === 'income' ? '+' : ''}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WalletAssetLight;
