import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  FileText, 
  Check, 
  User, 
  MapPin, 
  Maximize2, 
  Calendar, 
  DollarSign, 
  Printer, 
  Download, 
  PlusCircle, 
  Award,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  Share2
} from 'lucide-react';

const FILM_METADATA = {
  'DUAL REFLECT': {
    title: 'DUAL REFLECT W®',
    sub: 'W infrared-block®',
    desc: (
      <span>
        <strong>Linha Dual Reflect</strong> arquitetura - metalizada - espelhada - Redução UV (ultra violeta) 99%+ bloqueio IR (infravermelho) 81% Sensação térmica melhora de 80 a 100%. Garantia 7+ anos. Made in USA.
      </span>
    )
  },
  'BLACKPRO': {
    title: 'BLACKPRO W®',
    sub: 'W infrared-block®',
    desc: (
      <span>
        <strong>Linha Fume Blackpro</strong> - arquitetura - não metalizada - fume - bloqueio UV (ultra violeta) 99% bloqueio IR 73+% (infravermelho). Sensação térmica melhora de 80 a 100%. Garantia 7+ anos. Made in USA.
      </span>
    )
  },
  'INVISIBLE': {
    title: 'Invisible W®',
    sub: 'W infrared-block®',
    desc: (
      <span>
        <strong>ORIGIN W® IR ADVANCED NANO CERAMIC - INVISIBLE® & BLACK®</strong> - LINE - INVISIBLE - Bloqueio UV (ultra violeta) 100% bloqueio IR 86%+. Sensação térmica melhora 80% A 100%. Garantia 10+ anos. Made in USA.
      </span>
    )
  },
  'WHITE MATTER': {
    title: 'WHITE MATTER W®',
    sub: 'W infrared-block®',
    desc: (
      <span>
        <strong>Linha White Matter</strong> - arquitetura premium - maior resistência e atenuação luminosa ideal para projetos de cobertura e teto - bloqueio UV 99% bloqueio IR 85%+.
      </span>
    )
  }
};

interface ClientRecord {
  id: string;
  nome: string;
  endereco: string;
  area: number;
  data: string;
  prices: {
    'DUAL REFLECT': number;
    'BLACKPRO': number;
    'INVISIBLE': number;
    'WHITE MATTER': number;
  };
  activeOptions?: string[];
}

interface ArchitectureCalculatorProps {
  onBack?: () => void;
}

export const ArchitectureCalculator: React.FC<ArchitectureCalculatorProps> = ({ onBack }) => {
  // Navigation Screens: 'list' | 'create' | 'proposal'
  const [screen, setScreen] = useState<'list' | 'create' | 'proposal'>('list');
  
  // Persisted clients list
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);

  // Form Fields (Large text & Comfortable UI setup)
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [area, setArea] = useState('');
  const [prices, setPrices] = useState({
    'DUAL REFLECT': 130,
    'BLACKPRO': 120,
    'INVISIBLE': 280,
    'WHITE MATTER': 140
  });
  const [activeOptions, setActiveOptions] = useState<string[]>([
    'DUAL REFLECT',
    'BLACKPRO',
    'INVISIBLE',
    'WHITE MATTER'
  ]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('winf_arch_clients');
    if (saved) {
      try {
        setClients(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Premium Seed Data (matching Claudia with 6m² etc)
      const mockList: ClientRecord[] = [
        {
          id: 'client-1',
          nome: 'Claudia',
          endereco: 'Rua das Palmeiras, 102 - Condomínio Altos',
          area: 6,
          data: '01/06/2026',
          prices: {
            'DUAL REFLECT': 130,
            'BLACKPRO': 120,
            'INVISIBLE': 280,
            'WHITE MATTER': 140
          }
        },
        {
          id: 'client-2',
          nome: 'Roberto Silveira',
          endereco: 'Av. das Américas, 4200 - Barra',
          area: 12.5,
          data: '01/06/2026',
          prices: {
            'DUAL REFLECT': 130,
            'BLACKPRO': 120,
            'INVISIBLE': 280,
            'WHITE MATTER': 140
          }
        }
      ];
      localStorage.setItem('winf_arch_clients', JSON.stringify(mockList));
      setClients(mockList);
    }
  }, []);

  const saveToStorage = (updated: ClientRecord[]) => {
    localStorage.setItem('winf_arch_clients', JSON.stringify(updated));
    setClients(updated);
  };

  const handleSaveClient = () => {
    if (!nome.trim() || !area) {
      alert('Por favor, preencha o nome e a área (m²).');
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const newRecord: ClientRecord = {
      id: `client-${Date.now()}`,
      nome: nome.trim(),
      endereco: endereco.trim() || 'Não especificado',
      area: parseFloat(area),
      data: formattedDate,
      prices: { ...prices },
      activeOptions: [...activeOptions]
    };

    const updated = [newRecord, ...clients];
    saveToStorage(updated);
    setSelectedClient(newRecord);

    // Reset Form (prices remain saved as default)
    setNome('');
    setEndereco('');
    setArea('');
    setActiveOptions(['DUAL REFLECT', 'BLACKPRO', 'INVISIBLE', 'WHITE MATTER']);
    
    setScreen('proposal');
  };

  const handleDeleteClient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja realmente excluir este orçamento?')) {
      const updated = clients.filter(c => c.id !== id);
      saveToStorage(updated);
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  const handleViewProposal = (client: ClientRecord) => {
    setSelectedClient(client);
    setActiveOptions(client.activeOptions || ['DUAL REFLECT', 'BLACKPRO', 'INVISIBLE', 'WHITE MATTER']);
    setScreen('proposal');
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-white flex flex-col items-center">
      
      {/* SCREEN 1: HISTÓRICO DE CLIENTES (Clean dark premium dashboard) */}
      {screen === 'list' && (
        <div className="w-full min-h-screen flex flex-col justify-between bg-[#151518] border border-[#27272A] max-w-2xl mx-auto relative shadow-2xl">
          {/* Header with NO borders */}
          <div className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 bg-[#151518] border-b border-[#27272A] z-10">
            <div className="flex items-center gap-3">
              {onBack && (
                <button 
                  onClick={onBack} 
                  className="p-3 -ml-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-none transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-light uppercase tracking-widest text-white mt-0.5">Gerador de Propostas</h1>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setNome('');
                setEndereco('');
                setArea('');
                setActiveOptions(['DUAL REFLECT', 'BLACKPRO', 'INVISIBLE', 'WHITE MATTER']);
                setScreen('create');
              }}
              className="w-12 h-12 rounded-none bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-all shadow-lg active:scale-95"
              title="Nova Simulação"
              id="new_budget_btn"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-grow overflow-y-auto px-6 py-6 space-y-6">

            {clients.length === 0 ? (
              <div className="text-center py-24 bg-[#111113] border border-[#27272A] rounded-none p-8">
                <FileText className="mx-auto text-zinc-500 mb-5" size={56} />
                <p className="text-base font-black text-zinc-400">Nenhum orçamento gerado ainda</p>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Toque no botão "+" no topo para começar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clients.map(client => (
                  <div 
                    key={client.id}
                    onClick={() => handleViewProposal(client)}
                    className="p-5 bg-[#131314] border border-[#27272A] hover:border-zinc-500 active:scale-[0.99] rounded-none flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-none flex items-center justify-center font-black text-lg">
                        {client.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-lg group-hover:text-zinc-300 transition-colors">{client.nome}</h3>
                        <p className="text-sm text-zinc-400 font-semibold truncate max-w-[185px] mt-0.5">{client.endereco}</p>
                        <div className="flex items-center gap-3.5 mt-2.5 text-xs text-zinc-500 font-mono font-bold">
                          <span className="flex items-center gap-1 bg-black/40 border border-white/5 px-2.5 py-1 rounded-none"><Maximize2 size={12} className="text-white" /> {client.area} m²</span>
                          <span className="flex items-center gap-1 bg-black/40 border border-white/5 px-2.5 py-1 rounded-none"><Calendar size={12} className="text-zinc-400" /> {client.data}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ChevronRight size={22} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                      <button 
                        onClick={(e) => handleDeleteClient(client.id, e)}
                        className="p-3.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-none transition-all"
                        title="Deletar"
                        id={`delete_client_${client.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Bottom Bar with NO borders */}
          <div className="px-6 py-6 bg-[#151518] sticky bottom-0 z-10 border-t border-[#27272A]">
            <button 
              onClick={() => {
                setNome('');
                setEndereco('');
                setArea('');
                setActiveOptions(['DUAL REFLECT', 'BLACKPRO', 'INVISIBLE', 'WHITE MATTER']);
                setScreen('create');
              }}
              className="w-full bg-white hover:bg-zinc-200 active:scale-[0.98] text-black font-black h-[60px] rounded-none transition-all flex items-center justify-center gap-2.5 shadow-md text-base"
              id="new_mapping_bottom_btn"
            >
              <PlusCircle size={22} />
              <span>Nova Simulação</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: CADASTRAR CLIENTE (Elegant Matte Dark Obsidian Style - Anti-Fatigue, Zero Borders, Huge Text) */}
      {screen === 'create' && (
        <div className="w-full min-h-screen flex flex-col justify-between bg-[#151518] text-[#F3F4F6] max-w-2xl border border-[#27272A] mx-auto relative">
          
          {/* Top Bar - No borders */}
          <div className="px-6 pt-10 pb-6 flex items-center justify-between bg-[#151518] sticky top-0 z-10 border-b border-[#27272A]">
            <button 
              onClick={() => setScreen('list')}
              className="p-3 -ml-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-none transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <div className="text-center">
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-zinc-500 block mb-0.5">Ferramenta</span>
              <h1 className="text-sm font-semibold text-zinc-300 tracking-tight uppercase">Simulação</h1>
            </div>
            <button 
              onClick={() => setScreen('list')}
              className="p-3 text-zinc-450 hover:text-white hover:bg-white/5 rounded-none transition-colors"
              title="Voltar"
              id="view_history_btn"
            >
              <Calendar size={24} />
            </button>
          </div>

          {/* Large comfortable Inputs */}
          <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
            
            {/* Input Nome */}
            <div className="border-b border-[#27272A] focus-within:border-zinc-500 pb-2 pt-4 transition-colors text-left flex flex-col">
              <span className="text-[#F3F4F6] text-xl font-normal leading-relaxed tracking-wide">Nome</span>
              <input 
                type="text" 
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder=""
                className="w-full bg-transparent text-[#E4E4E7] text-2xl font-light focus:outline-none p-0 focus:ring-0 placeholder-zinc-800 mt-2"
                id="input_nome"
                autoFocus
              />
            </div>

            {/* Input Endereço */}
            <div className="border-b border-[#27272A] focus-within:border-zinc-500 pb-2 pt-4 transition-colors text-left flex flex-col mt-4">
              <span className="text-[#F3F4F6] text-xl font-normal leading-relaxed tracking-wide">Endereço</span>
              <input 
                type="text" 
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                placeholder=""
                className="w-full bg-transparent text-[#E4E4E7] text-2xl font-light focus:outline-none p-0 focus:ring-0 placeholder-zinc-800 mt-2"
                id="input_endereco"
              />
            </div>

            {/* Input Área */}
            <div className="border-b border-[#27272A] focus-within:border-zinc-500 pb-2 pt-4 transition-colors text-left flex flex-col mt-4">
              <span className="text-[#F3F4F6] text-xl font-normal leading-relaxed tracking-wide">Área (m²)</span>
              <input 
                type="number" 
                step="0.01"
                min="0.1"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder=""
                className="w-full bg-transparent text-[#E4E4E7] text-2xl font-mono font-light focus:outline-none p-0 focus:ring-0 placeholder-zinc-800 mt-2"
                id="input_area"
              />
            </div>

            {/* Date block */}
            <div className="text-left text-xl text-[#F3F4F6] font-light py-4">
              Data: {new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()}
            </div>

            {/* Pricing list inline with interactive selection and custom activeOptions */}
            <div className="pt-2 space-y-6 text-left">
              {Object.keys(prices).map((key) => {
                const materialKey = key as keyof typeof prices;
                const isActive = activeOptions.includes(key);
                return (
                  <div 
                    key={key} 
                    className={`flex items-center justify-between py-2 transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    {/* Film toggle selection and name */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            if (activeOptions.length === 1) {
                              alert('Selecione pelo menos 1 película para o orçamento.');
                              return;
                            }
                            setActiveOptions(activeOptions.filter(item => item !== key));
                          } else {
                            setActiveOptions([...activeOptions, key]);
                          }
                        }}
                        className={`w-5 h-5 rounded-none flex items-center justify-center border transition-all ${
                          isActive 
                            ? 'bg-white border-white text-black' 
                            : 'border-zinc-700 bg-transparent text-transparent hover:border-zinc-500'
                        }`}
                        id={`toggle_option_${String(materialKey)}`}
                      >
                        <Check size={12} className="stroke-[3]" />
                      </button>

                      <span 
                        onClick={() => {
                          if (isActive) {
                            if (activeOptions.length === 1) {
                              alert('Selecione pelo menos 1 película para o orçamento.');
                              return;
                            }
                            setActiveOptions(activeOptions.filter(item => item !== key));
                          } else {
                            setActiveOptions([...activeOptions, key]);
                          }
                        }}
                        className={`font-semibold text-lg tracking-wide uppercase cursor-pointer select-none ${
                          isActive ? 'text-[#F3F4F6]' : 'text-zinc-600 line-through'
                        }`}
                      >
                        {key}
                      </span>
                    </div>

                    {/* Labeled input box for value */}
                    <div className="relative border border-[#27272A] focus-within:border-zinc-500 rounded-none px-4 py-1.5 w-32 bg-transparent transition-colors">
                      {/* Nested border label on top */}
                      <span className="absolute -top-2 right-4 bg-[#151518] px-1 text-[10px] text-zinc-400 font-sans tracking-wide">
                        Valor
                      </span>
                      <input 
                        type="number"
                        step="1"
                        disabled={!isActive}
                        value={prices[materialKey]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPrices(prev => ({ ...prev, [materialKey]: val }));
                        }}
                        className="w-full bg-transparent border-none text-white text-xl font-light font-sans focus:outline-none text-right p-0 focus:ring-0 leading-none"
                        id={`input_price_${String(materialKey)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Control Actions Bottom Bar */}
          <div className="px-6 py-6 bg-[#151518] space-y-4 z-10 border-t border-[#27272A]">
            <div className="grid grid-cols-2 gap-3.5">
              <button 
                type="button"
                onClick={handleSaveClient}
                className="bg-[#1C1C1F] hover:bg-zinc-800 text-white font-black h-[54px] rounded-none flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-wider border border-[#27272A]"
              >
                <Check size={18} className="text-emerald-500" />
                <span>Salvar Registro</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setScreen('list')}
                className="bg-[#1C1C1F] hover:bg-zinc-800 text-white font-black h-[54px] rounded-none flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-wider border border-[#27272A]"
              >
                <Calendar size={18} className="text-white" />
                <span>Ver Histórico</span>
              </button>
            </div>

            <button 
              type="button"
              onClick={handleSaveClient}
              className="w-full bg-white hover:bg-zinc-200 active:bg-zinc-300 text-black font-black h-[60px] rounded-none transition-all flex items-center justify-center gap-2.5 shadow-md text-sm uppercase tracking-widest"
              id="generate_proposal_btn"
            >
              <FileText size={20} />
              <span>Gerar Orçamento PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: VER ORÇAMENTO (Luxurious Warm Ivory/White document layout without borders) */}
      {screen === 'proposal' && selectedClient && (
        <div className="w-full min-h-screen bg-stone-100 flex flex-col justify-between max-w-md mx-auto relative select-text shadow-2xl">
          
          {/* Float Return Navigation Tab - No borders */}
          <div className="px-6 py-4 bg-white flex items-center justify-between sticky top-0 z-20 print:hidden shadow-sm">
            <button 
              onClick={() => setScreen('create')}
              className="flex items-center gap-1.5 text-xs font-black text-[#1E1E24] hover:text-zinc-500 uppercase tracking-widest bg-stone-50 px-4 py-2.5 rounded-none transition-colors"
            >
              <ChevronLeft size={18} /> Ajustar Medidas
            </button>
            
            <span className="text-[10px] font-black text-black tracking-wider uppercase font-mono bg-white px-3.5 py-1.5 rounded-none">
              Orçamento Ativo
            </span>

            <button 
              onClick={() => setScreen('list')}
              className="p-3 text-[#1E1E24] hover:text-zinc-500 rounded-none transition-colors"
              title="Voltar ao Histórico"
            >
              <Calendar size={22} />
            </button>
          </div>

          {/* PDF Page Container (White Physical Document Style, Zero Borders) */}
          <div className="bg-white flex-grow p-8 flex flex-col justify-start space-y-8 relative overflow-hidden print:p-0">
            
            {/* Top Corporate Badge Bar */}
            <div className="w-full h-11 bg-black text-white px-5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest rounded-none select-none">
              <span>Orçamento Nº 0{selectedClient.id.substring(selectedClient.id.length - 3)}</span>
              <span>Safra 2026 / 2027</span>
              <span className="font-serif italic text-lg font-bold">W</span>
            </div>

            {/* WINF Title */}
            <div className="text-center pt-2 select-none">
              <h1 className="text-5xl font-black tracking-tighter text-black m-0 leading-none">WINF</h1>
              <p className="text-[10px] tracking-[0.3em] font-extrabold uppercase text-[#94A3B8] mt-2">PREMIUM QUALITY WINDOWFILM</p>
            </div>

            {/* Client Context Details Grid (Spaced block instead of borders) */}
            <div className="rounded-none p-6 bg-stone-50 grid grid-cols-1 gap-4 text-base">
              <div className="flex items-start gap-4">
                <span className="font-black text-[#94A3B8] text-xs uppercase w-20 pt-1">Cliente:</span>
                <span className="text-black font-extrabold text-xl">{selectedClient.nome}</span>
              </div>
              <div className="flex items-start gap-4 pt-1">
                <span className="font-black text-[#94A3B8] text-xs uppercase w-20 pt-1">Local:</span>
                <span className="text-stone-700 font-bold leading-relaxed">{selectedClient.endereco}</span>
              </div>
              <div className="flex items-start gap-4 pt-1">
                <span className="font-black text-[#94A3B8] text-xs uppercase w-20 pt-1">Serviço:</span>
                <span className="text-stone-600 font-semibold leading-relaxed">Aplicação de película de alta performance para vidros</span>
              </div>
              <div className="flex items-start gap-4 pt-1 font-mono">
                <span className="font-black text-[#94A3B8] text-xs uppercase w-20 pt-1">Área Total:</span>
                <span className="text-black font-black text-xl">{selectedClient.area} m²</span>
              </div>
            </div>

            {/* Pricing split into separate independent options, ZERO borders, simple separation */}
            <div className="space-y-8 pt-3">
              {Object.keys(FILM_METADATA)
                .filter(key => activeOptions.includes(key))
                .map((key, index) => {
                  const info = FILM_METADATA[key as keyof typeof FILM_METADATA];
                  const priceValue = selectedClient.prices[key as keyof typeof selectedClient.prices] || 0;
                  const totalValue = selectedClient.area * priceValue;

                  return (
                    <div key={key} className="space-y-4 bg-stone-50/50 p-6 rounded-none border border-stone-200/30 animate-fade-in text-left">
                      <div className="flex items-center justify-between select-none">
                        <span className="text-[11px] font-black text-black uppercase tracking-widest bg-white border border-black px-3 py-1 rounded-none">
                          OPÇÃO {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mt-1">
                        <h3 className="font-extrabold tracking-tight text-3xl text-zinc-950">{info.title}</h3>
                        <span className="text-xs font-mono font-bold text-stone-400">{info.sub}</span>
                      </div>
                      
                      <p className="text-sm text-stone-700 leading-relaxed font-normal">
                        {info.desc}
                      </p>

                      <div className="pt-6 pb-5 px-6 flex flex-col items-center justify-center bg-stone-50 border border-stone-200/60 rounded-none text-center space-y-2 mt-4 shadow-sm">
                        <span className="text-[10px] font-extrabold uppercase text-stone-500 tracking-[0.12em] font-mono">
                          Valor total calculado ({selectedClient.area} m² × R$ {priceValue.toFixed(1)})
                        </span>
                        <p className="text-4xl font-extrabold text-black leading-none font-mono tracking-tight mt-1">
                          R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* ALERT BOX explaining that the options are independent and not summed up! */}
            <div className="p-5 bg-amber-50/60 border-l-4 border-amber-500 rounded-none flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-none bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 select-none">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">Modalidade de Escolha</span>
                <p className="text-stone-700 text-xs font-semibold leading-relaxed mt-0.5">
                  Prezado cliente, as opções acima representam <strong>tecnologias e alternativas independentes</strong> para sua avaliação. O valor do contrato final corresponderá <strong>apenas à opção escolhida</strong> por você (os valores das alternativas não se somam).
                </p>
              </div>
            </div>

            {/* Document Stamp Seal Info Footer with NO borders */}
            <div className="pt-8 grid grid-cols-12 gap-4 items-center select-none bg-stone-50/40 p-6 rounded-none">
              
              {/* Stamp (left) */}
              <div className="col-span-4 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-none border-2 border-dashed border-zinc-200 flex flex-col justify-center items-[#111827] items-center p-1.5 text-center bg-white">
                  <Award size={20} className="text-black mb-0.5" />
                  <span className="text-[8px] font-black uppercase leading-none text-stone-700">WINF CERTIFIED</span>
                  <span className="text-[7px] text-black font-extrabold leading-none mt-1">AUTHORIZED</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 mt-1">
                  <Globe size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider">ECO-ACTIVE</span>
                </div>
              </div>

              {/* Technical Consultant (center) */}
              <div className="col-span-5 text-left pl-2">
                <h4 className="text-sm font-black text-[#111827] tracking-tight uppercase">Tiago a Corrêa</h4>
                <p className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Consultor Técnico de Projetos</p>
                <div className="space-y-1.5 mt-3 text-xs text-stone-600 font-bold">
                  <p className="flex items-center gap-1.5"><Phone size={12} className="text-black" /> (13) 99166-2300</p>
                  <p className="flex items-center gap-1.5"><Mail size={12} className="text-black" /> winf@gmail.com</p>
                  <p className="flex items-center gap-1.5"><Globe size={12} className="text-black" /> www.winf.com.br</p>
                </div>
              </div>

              {/* QR Code (right) */}
              <div className="col-span-3 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-none p-2 bg-white shadow-sm flex items-center justify-center relative">
                  <div className="grid grid-cols-4 gap-1 w-full h-full opacity-70">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full ${
                          (i % 3 === 0 || i % 7 === 0 || i === 0 || i === 15) ? 'bg-[#131314]' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Symbol */}
                  <div className="absolute inset-0 m-auto w-6 h-6 bg-white rounded-none flex items-center justify-center text-emerald-500 shadow-sm border border-stone-105">
                    <Phone size={11} className="fill-emerald-500 text-stone-100" />
                  </div>
                </div>
                <span className="text-[8px] font-black text-[#94A3B8] uppercase mt-2 tracking-widest">Auto QR Code</span>
              </div>
            </div>

            {/* Vertical margin text */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 transform rotate-90 origin-right text-[10px] uppercase tracking-[0.2em] text-[#15803D] font-extrabold select-none opacity-40">
              Vamos juntos salvar o planeta.
            </div>

          </div>

          {/* Share / Print bottom footer bar - No borders */}
          <div className="px-6 py-6 bg-white sticky bottom-0 z-10 print:hidden flex flex-col gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-3 gap-3.5">
              <button 
                onClick={() => alert('Simulação: Proposta salva com sucesso!')}
                className="bg-[#111827] hover:bg-[#131314] text-white font-black h-[54px] rounded-none flex items-center justify-center gap-1.5 transition-all active:scale-95 text-[10px] md:text-xs uppercase tracking-widest shadow-sm"
              >
                <Download size={16} />
                <span>Salvar</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-white hover:bg-zinc-50 border border-zinc-250 text-zinc-700 font-extrabold h-[54px] rounded-none flex items-center justify-center gap-1.5 transition-all active:scale-95 text-[10px] md:text-xs uppercase tracking-widest"
              >
                <Printer size={16} />
                <span> PDF</span>
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Proposta WINF Select™',
                      text: 'Confira a proposta técnica gerada.',
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    alert('Compartilhamento não suportado neste navegador, mas link copiado.');
                  }
                }}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-extrabold h-[54px] rounded-none flex items-center justify-center gap-1.5 transition-all active:scale-95 text-[10px] md:text-xs uppercase tracking-widest"
              >
                <Share2 size={16} />
                <span>Compartilhar</span>
              </button>
            </div>
            
            <button 
              onClick={() => setScreen('list')}
              className="w-full bg-black hover:bg-zinc-800 font-extrabold h-[60px] rounded-none text-white transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-md"
            >
              <Check size={20} />
              <span>Concluir Orçamento</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ArchitectureCalculator;
