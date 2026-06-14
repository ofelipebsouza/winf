import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Layers,
  Wand2,
  ChevronRight,
  Zap,
  Activity,
  User,
  Calculator,
  Send,
  FileText,
  DollarSign,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { ViewState } from '../types';
import { useWinf } from '../contexts/WinfContext';
import { DashboardTutorial } from './DashboardTutorial';

interface HubArchitectProps {
  onChangeView: (view: ViewState) => void;
}

const HubArchitect: React.FC<HubArchitectProps> = ({ onChangeView }) => {
  const { user, products, triggerNotification, addInstallationJob, installationJobs } = useWinf();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'novo_projeto'>('dashboard');

  // --- MOCK DADOS DE GANHOS DO ARQUITETO ---
  const projetosFechados = installationJobs.filter(j => j.architect_id === user?.id && j.status === 'completed').map(j => ({
    id: j.service_order_id,
    cliente: j.customer_name,
    valorProjeto: j.total_amount || 0,
    rt: j.architect_rt || 0,
    status: 'Instalado',
    data: new Date(j.completed_at || '').toLocaleDateString('pt-BR'),
    instalador: 'Licenciado Winf'
  }));

  const projetosEnviados = installationJobs.filter(j => j.architect_id === user?.id && j.status === 'network_routing').map(j => ({
    id: j.service_order_id,
    cliente: j.customer_name,
    valorProjeto: j.total_amount || 0,
    rt: j.architect_rt || 0,
    status: 'Buscando Instalador',
    data: new Date().toLocaleDateString('pt-BR')
  }));

  const totalRtGerada = projetosFechados.reduce((acc, p) => acc + p.rt, 0);

  // --- NOVA COTAÇÃO ---
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formArea, setFormArea] = useState('50');
  const [formSearch, setFormSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Filtramos os produtos para a tabela do arquiteto
  const architectProducts = useMemo(() => {
    return products.filter(p => p.category === 'Arquitetura' || p.name.includes('Arquitetura') || p.name.includes('Select') || p.name.includes('AeroCore')).map(prod => {
      // Cálculo de Tabela Específica para Arquiteto
      let baseInstaladoM2 = 250; // default
      if (prod.name.includes('Invisible')) baseInstaladoM2 = 450;
      else if (prod.name.includes('Silver')) baseInstaladoM2 = 200;
      else if (prod.name.includes('AeroCore')) baseInstaladoM2 = 550;
      else if (prod.name.includes('Dual')) baseInstaladoM2 = 250;
      else if (prod.name.includes('Security')) baseInstaladoM2 = 350;
      
      const comissaoM2 = baseInstaladoM2 * 0.15; // 15% de RT (Reserva Técnica) garantida
      
      return {
        ...prod,
        suggestedClientPriceM2: baseInstaladoM2,
        architectRtM2: comissaoM2
      };
    });
  }, [products]);

  const filteredProducts = architectProducts.filter(p => p.name.toLowerCase().includes(formSearch.toLowerCase()) || (p.description && p.description.toLowerCase().includes(formSearch.toLowerCase())));

  const activeProduct = selectedProductId ? architectProducts.find(p => p.id === selectedProductId) : null;
  const numArea = parseFloat(formArea) || 0;
  const totalClientPrice = activeProduct ? numArea * activeProduct.suggestedClientPriceM2 : 0;
  const totalRt = activeProduct ? numArea * activeProduct.architectRtM2 : 0;

  const handleDispatchOrder = async () => {
    if (!formName || !formCity || !activeProduct || numArea <= 0) {
      triggerNotification('Dados Incompletos', 'Preencha os dados do cliente e selecione a película.');
      return;
    }

    const jobData = {
      service_order_id: `OS-ARQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: formName,
      customer_city: formCity,
      chosen_film: activeProduct.name,
      vehicle_model: 'Arquitetura (Métrica: ' + numArea + 'm²)',
      total_amount: totalClientPrice,
      collaborator_id: 'pending', // No installer yet
      status: 'network_routing' as const,
      is_network_demand: true,
      architect_id: user?.id || 'arq_1',
      architect_rt: totalRt,
    };

    await addInstallationJob(jobData);

    setActiveTab('dashboard');
    setFormName('');
    setFormCity('');
    setSelectedProductId('');
    triggerNotification('Pedido Roteado!', `Projeto de ${formName} enviado para o instalador da região ${formCity}.`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-12 text-white selection:bg-[#0284C7]/30 font-sans">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        
        {/* Header simplificado */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-[#444746] pb-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-[#444746] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#0284C7] rounded-none">
              <span className="w-1.5 h-1.5 bg-[#0284C7] rounded-none animate-pulse"></span>
              Portal de Especificadores e Parceiros (Asset Light)
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">
              Gerenciamento de <span className="font-bold">Indicações & Repasses</span>
            </h1>
            <p className="text-white/50 text-sm font-light tracking-wide max-w-2xl">
              Bem-vindo(a), {user?.name || 'Parceiro'}. Arquitetos, Vidraceiros, Serralheiros e Síndicos: Especifique a demanda, envie para o Radar e nós cuidamos da execução através dos homologados regionais gratuitos para você.
            </p>
          </div>
          <div className="flex bg-[#131314] border border-[#444746] p-1 h-fit">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest transition-all ${
                activeTab === 'dashboard' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              Meus Ganhos
            </button>
            <button
              onClick={() => setActiveTab('novo_projeto')}
              className={`px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-2 ${
                activeTab === 'novo_projeto' ? 'bg-[#0284C7] text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap size={14} /> Indicar Demanda
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-8">
              
              {/* Highlight Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 border border-[#444746] p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-emerald-500 uppercase flex items-center gap-1.5 font-bold">
                      <DollarSign size={13} /> RT Gerada (Ganhos)
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-light tracking-tight text-white mb-1">
                      {totalRtGerada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Liberado para saque</p>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-[#444746] p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-[#0284C7] uppercase flex items-center gap-1.5 font-bold">
                      <CheckCircle2 size={13} /> Obras Executadas
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-light tracking-tight text-white mb-1">
                      {projetosFechados.length} Projetos
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Pelos instaladores WINF</p>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-[#444746] p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase flex items-center gap-1.5 font-bold">
                      <Clock size={13} /> Em Roteamento
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-light tracking-tight text-white mb-1">
                      {projetosEnviados.length} Demandas
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Aguardando captação local</p>
                  </div>
                </div>
              </div>

              {/* Tabelas de Rastreio */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Demandas Enviadas */}
                <div className="bg-[#111113] border border-[#27272A] p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#0284C7] mb-4 flex items-center gap-2 border-b border-[#27272A] pb-3">
                    <Send size={14} /> Demandas Enviadas (Aguardando Instalação)
                  </h3>
                  {projetosEnviados.length === 0 ? (
                    <p className="text-xs text-zinc-600 font-mono text-center py-6">Nenhum projeto em repasse.</p>
                  ) : (
                    <div className="space-y-3">
                      {projetosEnviados.map(p => (
                        <div key={p.id} className="bg-zinc-900 border border-[#444746] p-4 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-bold text-white uppercase tracking-tight">{p.cliente}</div>
                            <div className="text-[10px] font-mono text-zinc-500 mt-1">ID: {p.id} • {p.data}</div>
                            <div className="text-[9px] uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 mt-2 inline-block w-fit">
                              {p.status}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] font-mono text-zinc-500 uppercase mb-0.5">Sua RT Prevista</div>
                            <div className="text-emerald-400 font-bold">{p.rt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Histórico Finalizado */}
                <div className="bg-[#111113] border border-[#27272A] p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2 border-b border-[#27272A] pb-3">
                    <ShieldCheck size={14} /> Obras Executadas (RTs Concluídas)
                  </h3>
                  <div className="space-y-3">
                    {projetosFechados.map(p => (
                      <div key={p.id} className="bg-zinc-900 border border-emerald-900/40 p-4 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <CheckCircle2 size={64} className="text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-bold text-white uppercase tracking-tight">{p.cliente}</div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-1">Instalador Mapeado: {p.instalador} • {p.data}</div>
                          <div className="text-[9px] uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 mt-2 inline-block w-fit">
                            {p.status}
                          </div>
                        </div>
                        <div className="text-right relative z-10">
                          <div className="text-[9px] font-mono text-zinc-500 uppercase mb-0.5">RT Liquidada</div>
                          <div className="text-emerald-400 font-bold">{p.rt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Information / Relatório Policy */}
              <div className="bg-[#111113] border border-[#27272A] p-6 mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Calculator size={120} className="text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                       Ciclo de Repasses & Regras de Fechamento do Radar
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                      O sistema está estruturado para garantir 100% de transparência para **Arquitetos, Vidraceiros, Serralheiros, Síndicos e Parceiros Asset Light**. Todas as suas indicações registradas nesta plataforma são despachadas automaticamente para o <strong className="text-white">WINF Radar</strong>.
                    </p>
                    <ul className="space-y-2 text-[10px] text-zinc-500 font-mono tracking-wide uppercase">
                      <li className="flex items-start gap-2">
                         <span className="text-amber-500 font-black">1.</span>
                         <span>O parceiro indica o serviço preenchendo a área "Indicar Demanda" no topo desta tela. O lead é capturado pelo WINF Radar.</span>
                      </li>
                      <li className="flex items-start gap-2">
                         <span className="text-emerald-500 font-black">2.</span>
                         <span>Nossa rede de instaladores homologados executa a obra com alto padrão.</span>
                      </li>
                      <li className="flex items-start gap-2">
                         <span className="text-[#0284C7] font-black">3.</span>
                         <span>Ao longo do mês, você acompanha suas "Indicações em Progresso" e "Obras Executadas" em tempo real nesta tela.</span>
                      </li>
                      <li className="flex items-start gap-2">
                         <span className="text-zinc-300 font-black">4.</span>
                         <span>O extrato pode ser gerado a qualquer momento utilizando o botão abaixo para fechamento financeiro e faturamento.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="w-full md:w-64 bg-zinc-950 border border-[#27272A] p-5 flex flex-col justify-between">
                     <div>
                        <div className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-2">Comissões Liberadas</div>
                        <div className="text-xl font-light text-emerald-400 tracking-tight">{totalRtGerada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-[#27272A]">
                        <button 
                          onClick={() => window.print()}
                          className="w-full bg-white text-black font-bold text-xs uppercase tracking-widest py-3 hover:bg-zinc-200 transition-colors"
                        >
                           Gerar Relatório (PDF)
                        </button>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                 <button onClick={() => onChangeView(ViewState.MODULE_ARCHITECTURAL)} className="text-[10px] font-mono text-zinc-500 uppercase hover:text-white border-b border-zinc-700 pb-1 flex items-center gap-2 transition-all">
                   Abrir Gerador de Propostas (IA) <ArrowUpRight size={12} className="lucide lucide-arrow-up-right" />
                 </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'novo_projeto' && (
            <motion.div key="novo_projeto" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Formulário & Seleção */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#111113] border border-[#27272A] p-6">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-6 flex items-center gap-2 border-b border-[#27272A] pb-3">
                    <FileText size={16} className="text-[#0284C7]" /> Resumo do Projeto (Cliente)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Cliente / Empreendimento</label>
                      <input 
                        type="text" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Residência Alpha"
                        className="w-full bg-[#131314] border border-[#444746] text-white px-3 py-2 text-xs font-mono focus:border-[#0284C7] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Cidade Local da Obra</label>
                      <input 
                        type="text" 
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="Ex: Campinas, SP"
                        className="w-full bg-[#131314] border border-[#444746] text-white px-3 py-2 text-xs font-mono focus:border-[#0284C7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-8">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold flex justify-between items-end">
                      <span>Metragem Total Envidraçada estimada (m²)</span>
                      <span className="text-[#0284C7] text-sm">{formArea} m²</span>
                    </label>
                    <input 
                      type="range" 
                      min="5" 
                      max="300" 
                      step="1"
                      value={formArea}
                      onChange={(e) => setFormArea(e.target.value)}
                      className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#0284C7]"
                    />
                  </div>

                  <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-4 flex items-center gap-2 border-b border-[#27272A] pb-3">
                    <Layers size={16} className="text-[#0284C7]" /> Tabela de Escolha (Especificação WINF)
                  </h3>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Pesquisar por película..."
                      value={formSearch}
                      onChange={(e) => setFormSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#131314] border border-[#444746] focus:border-[#0284C7] focus:outline-none text-white font-mono"
                    />
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts.length === 0 ? (
                      <p className="text-[10px] font-mono text-zinc-500 p-4 text-center border border-dashed border-[#444746]">Nenhum produto atende a pesquisa.</p>
                    ) : (
                      filteredProducts.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedProductId(p.id)}
                          className={`p-4 border cursor-pointer transition-all ${
                            selectedProductId === p.id 
                              ? 'bg-blue-900/10 border-[#0284C7]' 
                              : 'bg-zinc-900/40 border-[#444746] hover:border-zinc-500'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-tight text-white">{p.name}</span>
                            <span className="text-[9px] font-mono bg-zinc-800 border border-[#27272A] px-1.5 py-0.5 text-zinc-400">
                              R$ {p.suggestedClientPriceM2.toFixed(2)}/m² Cliente
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-3">
                            <ul className="text-[9px] font-mono text-zinc-500 space-y-0.5">
                              {p.tech_specs?.tser && <li>● TSER: {p.tech_specs.tser}%</li>}
                              {p.tech_specs?.uvr && <li>● UVR: {p.tech_specs.uvr}%</li>}
                              <li>● Vidas Útil / Garantia: {p.warranty_years || 5} anos</li>
                            </ul>
                            <div className="text-right">
                              <span className="text-[8px] font-mono uppercase text-emerald-500 tracking-widest block">SUA RT / m²</span>
                              <span className="text-xs font-bold text-emerald-400">{p.architectRtM2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Roteador & Precificador (Resumo Financeiro) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#131314] border border-[#0284C7]/30 p-6 sticky top-8">
                  <div className="absolute top-0 right-0 bg-[#0284C7] text-[9px] font-bold font-mono px-2 py-0.5 uppercase tracking-wider text-white">
                    Simulador W-Connect
                  </div>
                  
                  <h3 className="text-sm font-light tracking-tight text-white mb-6 mt-2 flex items-center gap-2 border-b border-[#27272A] pb-3">
                    <Calculator size={16} className="text-[#0284C7]" /> Resumo e Envio de Indicação
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-xs font-mono border-b border-[#27272A] pb-3">
                      <span className="text-zinc-400 uppercase">Película Especificada:</span>
                      <span className="text-white font-bold max-w-[150px] truncate text-right" title={activeProduct?.name || 'Nenhuma'}>
                        {activeProduct?.name || 'Nenhuma'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono border-b border-[#27272A] pb-3">
                      <span className="text-zinc-400 uppercase">Área Confirmada:</span>
                      <span className="text-white font-bold">{numArea} m²</span>
                    </div>

                    <div className="bg-[#0A0A0B] border border-[#27272A] p-4 mt-6">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Custo Final ao Cliente (Apresentação)</p>
                      <p className="text-2xl font-light tracking-tight text-white">
                        {totalClientPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                        Este é o valor que o cliente final pagará. O instalador homologado Winf faturará diretamente contra o cliente na sua região ({formCity || 'Cidade'}).
                      </p>
                    </div>

                    {activeProduct && (
                      <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 blur-xl w-24 h-24 bg-emerald-500 rounded-full"></div>
                        <p className="text-[9px] font-mono uppercase tracking-widest text-emerald-500 mb-1 relative z-10 font-bold">
                          1. Seus Ganhos (Recorrência RT/Comissão)
                        </p>
                        <p className="text-xl font-bold tracking-tight text-emerald-400 relative z-10">
                          +{totalRt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-2 uppercase tracking-wide relative z-10">
                          *Sua comissão será processada e liberada no fechamento do mês (Dia 05) conforme política, assim que a obra for executada.
                        </p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleDispatchOrder}
                    disabled={!formName || !activeProduct}
                    className="w-full bg-[#0284C7] hover:bg-[#0284C7]/80 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-[11px] font-bold uppercase tracking-widest py-4 transition-all flex items-center justify-center gap-2"
                  >
                    Enviar Indicação ao Radar <Send size={14} />
                  </button>
                  <p className="text-[9px] text-zinc-500 text-center uppercase tracking-widest mt-4 font-mono">
                    Sem envolvimento logístico. Sem mão-de-obra. Apenas indicação.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default HubArchitect;

