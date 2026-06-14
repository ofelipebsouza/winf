import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Check, 
  Copy, 
  QrCode, 
  MapPin, 
  CreditCard, 
  Users, 
  DollarSign, 
  ChevronRight, 
  Laptop, 
  ShoppingBag, 
  GraduationCap, 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  Zap, 
  Phone,
  Compass, 
  Gift,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleWinfPartnersProps {
  onBack: () => void;
  onNavigate?: (view: any) => void;
}

export default function ModuleWinfPartners({ onBack }: ModuleWinfPartnersProps) {
  // Stepper State (Active Step 1 to 10)
  const [activeStep, setActiveStep] = useState<number>(1);
  
  // Step 1 & 2 State: Selected City
  const [selectedCity, setSelectedCity] = useState<{ name: string; price: number; status: string } | null>(null);
  
  // Pix Key copied feedback state
  const [copiedPix, setCopiedPix] = useState(false);
  
  // Payment check simulator state
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Stepper checklist animations
  const [step3Checklist, setStep3Checklist] = useState({
    userCreated: false,
    territoryLinked: false,
    contractSigned: false,
    crmConnected: false,
    academyEnabled: false,
    whatsappSent: false
  });

  // Step 5 Overdue simulation state
  const [licenseStatus, setLicenseStatus] = useState<'pago' | 'aviso1' | 'aviso2' | 'suspenso'>('pago');

  // Step 6 Marketplace active items
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  
  // Step 7 Academy courses completion
  const [completedCourses, setCompletedCourses] = useState<{ [key: string]: boolean }>({});
  
  // Step 8 Lead interactive state
  const [isLeadDispatched, setIsLeadDispatched] = useState(false);
  
  // Step 9 Split Slider state
  const [saleValue, setSaleValue] = useState<number>(5000);

  // Sample Cities List for Step 1
  const cities = [
    { name: 'Santos', price: 15000, status: 'disponivel' },
    { name: 'Praia Grande', price: 15000, status: 'disponivel' },
    { name: 'Guarujá', price: 15000, status: 'disponivel' },
    { name: 'São Vicente', price: 15000, status: 'ocupado' },
    { name: 'Campinas', price: 20000, status: 'ocupado' },
  ];

  const handleSelectCityForPurchase = (city: typeof cities[0]) => {
    if (city.status === 'ocupado') return;
    setSelectedCity(city);
    setActiveStep(2);
  };

  const handleCopyPixKey = () => {
    const key = "00020101021226830014br.gov.bcb.pix2561api.asaas.com/v1/pix/qr/bill_winf_partners_territory_santos_302919429";
    navigator.clipboard.writeText(key);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSimulatePaymentApproval = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentApproved(true);
      setActiveStep(3);
    }, 1800);
  };

  // Run Checklist animation inside Step 3
  useEffect(() => {
    if (activeStep === 3) {
      setStep3Checklist({
        userCreated: false,
        territoryLinked: false,
        contractSigned: false,
        crmConnected: false,
        academyEnabled: false,
        whatsappSent: false
      });

      const timers = [
        setTimeout(() => setStep3Checklist(prev => ({ ...prev, userCreated: true })), 400),
        setTimeout(() => setStep3Checklist(prev => ({ ...prev, territoryLinked: true })), 1000),
        setTimeout(() => setStep3Checklist(prev => ({ ...prev, contractSigned: true })), 1600),
        setTimeout(() => setStep3Checklist(prev => ({ ...prev, crmConnected: true })), 2200),
        setTimeout(() => setStep3Checklist(prev => ({ ...prev, academyEnabled: true })), 2800),
        setTimeout(() => setStep3Checklist(prev => ({ ...prev, whatsappSent: true })), 3400),
      ];

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [activeStep]);

  // Marketplace items Definition
  const shopItems = [
    { id: 'films', name: 'Película Premium AeroCore™ (Bobina 30m)', price: 1850, img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=200' },
    { id: 'cutter', name: 'Plotter de Recorte Computadorizado Pro-WINF 1.6m', price: 12500, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200' },
    { id: 'uniform', name: 'Kit Polo Tactical WINF Partners (4 unid.)', price: 380, img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200' },
    { id: 'graphics', name: 'Material Gráfico PDV Premium (Banners & Windbanners)', price: 450, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200' }
  ];

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const getCartTotal = () => {
    return shopItems.reduce((acc, item) => acc + (cart[item.id] || 0) * item.price, 0);
  };

  // Academy Courses Definition
  const mockCourses = [
    { id: 'c1', name: 'Módulo 1: Instalação Técnica de Películas', category: 'Instalação', desc: 'Instalação perfeita, moldagem térmica avançada e corte computadorizado.' },
    { id: 'c2', name: 'Módulo 2: Processo de Vendas de Alto Impacto', category: 'Vendas', desc: 'Metodologia exclusiva de fechamento e conversão de clientes Triple-A.' },
    { id: 'c3', name: 'Módulo 3: Tráfego e Posicionamento Google Local', category: 'Marketing', desc: 'Configuração do Google Perfil de Empresa e captação orgânica/paga.' },
    { id: 'c4', name: 'Módulo 4: Gestão do Caos & Financeiro Pro', category: 'Operações', desc: 'Controle de fluxo de caixa, estoque e precificação tática por metro.' }
  ];

  const handleToggleCourse = (id: string) => {
    setCompletedCourses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedCourses).filter(Boolean).length;

  const stepsList = [
    { number: 1, label: 'Territórios', desc: 'Escolha da praça física' },
    { number: 2, label: 'Pagamento PIX', desc: 'Modelo Meta de auto-faturamento' },
    { number: 3, label: 'Confirmação', desc: 'Fluxo 100% automático' },
    { number: 4, label: 'Dashboard', desc: 'Dados e ranking nacional' },
    { number: 5, label: 'Mensalidade', desc: 'Automação recorrente de R$ 497' },
    { number: 6, label: 'Marketplace', desc: 'Insumos B2B integrados' },
    { number: 7, label: 'Universidade', desc: 'Treinamentos homologados' },
    { number: 8, label: 'CRM & Leads', desc: 'Push de leads ao WhatsApp' },
    { number: 9, label: 'Split Tático', desc: 'Repasse financeiro simplificado' },
    { number: 10, label: 'Partners App', desc: 'Visão unificada mobile' }
  ];

  return (
    <div className="min-h-screen bg-[#131314] text-zinc-100 flex flex-col font-sans">
      {/* Top Banner Header */}
      <header className="p-6 border-b border-zinc-800/60 bg-gradient-to-b from-zinc-950 to-zinc-900/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Building2 size={160} />
        </div>

        <div className="flex items-center gap-4 z-10">
          <button 
            onClick={onBack}
            className="p-2 rounded-none bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="text-zinc-300 font-bold" size={20} />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                WINF Partners Portal
              </h1>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-bold mt-0.5">
              Ecossistema de Licenciados & Automações de Franquia Digital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Status do Servidor:</span>
          <span className="flex items-center gap-1.5 bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-[9px] font-mono px-2.5 py-1 uppercase rounded-none">
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-none animate-pulse"></span>
            Automações Ativas
          </span>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl w-full mx-auto">
        
        {/* Left Side: Stepper Navigation Menu */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-none p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 pb-3 border-b border-zinc-900 flex items-center justify-between">
              <span>Etapas do Licenciamento</span>
              <span className="text-[10px] font-mono text-zinc-600">Simulador</span>
            </h3>
            
            <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[500px] pr-1">
              {stepsList.map(step => {
                const isActive = activeStep === step.number;
                const isCompleted = activeStep > step.number;
                
                return (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(step.number)}
                    className={`text-left p-3 rounded-none flex items-center gap-3.5 border transition-all relative overflow-hidden group ${
                      isActive 
                        ? 'bg-[#12131A] text-white border-[#444746] shadow-lg shadow-[#FFFFFF]/5' 
                        : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900/40 hover:text-zinc-200'
                    }`}
                  >
                    {/* Active indicators */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                    )}

                    <div className={`w-7 h-7 rounded-none font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                      isActive 
                        ? 'bg-white/10 border-white/30 text-zinc-300 font-bold' 
                        : isCompleted 
                        ? 'bg-white/5 border-zinc-800 text-zinc-300 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}>
                      {isCompleted ? <Check size={14} /> : step.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
                        <span className="truncate">{step.label}</span>
                        {isActive && <span className="w-1.5 h-1.5 bg-white rounded-none" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{step.desc}</p>
                    </div>

                    <ChevronRight size={14} className={`text-zinc-600 transition-transform ${isActive ? 'translate-x-1 text-zinc-400' : 'group-hover:translate-x-1'}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Informational Notice */}
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800/50 p-5 rounded-none">
            <h4 className="text-xs font-bold text-zinc-300 font-bold uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Zap size={14} /> Arquitetura FaaS
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
              Toda a esteira de atração, pagamento via Pix do Asaas, provisionamento tecnológico de infraestrutura e encaminhamento de leads está orquestrada de forma modular e integrada.
            </p>
          </div>
        </aside>

        {/* Right Side: Step-specific simulator interface */}
        <main className="lg:col-span-8 bg-[#0C0D12] border border-zinc-850 rounded-none p-6 sm:p-8 flex flex-col justify-between shadow-2xl min-h-[550px] relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-between"
            >
              
              {/* STATUS INDICATOR HEADER FOR ACTIVE STEP */}
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-[0.2em]">ETAPA 0{activeStep}</span>
                  <h2 className="text-xl font-black uppercase text-white mt-1">
                    {stepsList[activeStep - 1].label}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Modelo Automatizado</span>
                  <span className="text-xs font-bold text-zinc-300">WINF Partners</span>
                </div>
              </div>


              {/* STEP 1: TERRITÓRIOS */}
              {activeStep === 1 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      O investidor acessa o portal e confere o status de ocupação geográfica em tempo real das praças mais produtivas do país.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {cities.map((city, idx) => (
                        <div 
                          key={idx}
                          className={`p-4 rounded-none border transition-all flex justify-between items-center ${
                            city.status === 'disponivel' 
                              ? 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                              : 'bg-zinc-950/20 border-zinc-950 opacity-40 select-none'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin size={16} className={city.status === 'disponivel' ? 'text-zinc-300 font-bold' : 'text-zinc-650'} />
                            <div>
                              <h4 className="text-sm font-bold text-zinc-100">{city.name}</h4>
                              <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">Praça Física</p>
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end">
                            {city.status === 'disponivel' ? (
                              <>
                                <span className="text-xs font-mono font-bold text-zinc-300 font-bold">R$ {city.price.toLocaleString('pt-BR')}</span>
                                <button 
                                  onClick={() => handleSelectCityForPurchase(city)}
                                  className="mt-1.5 px-3 py-1 bg-white hover:bg-zinc-200 text-black text-[9px] font-bold uppercase rounded-none tracking-wider transition-all"
                                >
                                  Adquirir Praça
                                </button>
                              </>
                            ) : (
                              <span className="text-[9px] font-mono uppercase bg-red-950/40 px-2 py-0.5 border border-red-500/10 text-red-400">Ocupado</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end gap-3 mt-4">
                    <span className="text-xs text-zinc-500 self-center hidden sm:inline">Selecione uma praça de teste para prosseguir</span>
                    <button
                      onClick={() => handleSelectCityForPurchase({ name: 'Santos', price: 15000, status: 'disponivel' })}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      Avançar com Santos <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 2: PAGAMENTO INTEGRADO */}
              {activeStep === 2 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Provisionamento automático do gateway de cobrança PIX à vista, seguindo layout estrutural tático homologado.
                    </p>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-none p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-none shrink-0 aspect-square border border-zinc-200">
                        {/* High fidelity simulation of PIX QR Code via SVG */}
                        <QrCode size={120} strokeWidth={1} className="text-black" />
                        <span className="text-[8px] font-mono font-bold text-zinc-500 tracking-wider mt-2">DURANTE: 24 Horas</span>
                      </div>
                      
                      <div className="md:col-span-8 space-y-4">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-500 block uppercase">CONCEITO FATURADO</span>
                          <span className="text-base font-bold text-white">TERRITÓRIO {selectedCity?.name || 'Mestre (Santos)'} - SP</span>
                        </div>

                        <div className="font-mono text-xs text-zinc-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Licenciamento:</span>
                            <span className="text-white">R$ 15.000,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Forma:</span>
                            <span className="text-zinc-300 font-bold font-bold">PIX Integrado (Imediato)</span>
                          </div>
                        </div>

                        {/* Pix copier controller */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">PIX Copia e Cola</label>
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              readOnly 
                              value="00020101021226830014br.gov.bcb.pix2561api.asaas.com/v1/pix/qr/bill_winf_partners_..." 
                              className="bg-zinc-900 border border-zinc-850 px-3 py-2 text-[10px] font-mono text-zinc-550 flex-1 rounded-none outline-none"
                            />
                            <button 
                              onClick={handleCopyPixKey}
                              className="px-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-none text-zinc-300 font-bold hover:text-white transition-colors"
                            >
                              {copiedPix ? <Check size={14} className="text-zinc-400 animate-pulse" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-between items-center">
                    <button 
                      onClick={() => setActiveStep(1)} 
                      className="px-4 py-2 text-zinc-400 hover:text-white text-xs border border-zinc-900 hover:border-zinc-800 transition-all rounded-none"
                    >
                      Voltar
                    </button>
                    <button 
                      onClick={handleSimulatePaymentApproval}
                      disabled={processingPayment}
                      className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase cursor-pointer rounded-none transition-colors flex items-center gap-1.5"
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-none animate-spin"></div>
                          Inspecionando Rede...
                        </>
                      ) : (
                        <>
                          Simular Confirmação <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 3: CONFIRMAÇÃO AUTOMÁTICA */}
              {activeStep === 3 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                      No milissegundo em que o banco processa o pagamento do PIX, o barramento de automações da WINF dispara em cascata as etapas logísticas operacionais:
                    </p>

                    <div className="space-y-2 max-w-xl mx-auto">
                      {[
                        { key: 'userCreated', text: 'Criação do usuário licenciado no banco de dados', desc: 'Ativação imediata de conta de e-mail e acessos.' },
                        { key: 'territoryLinked', text: 'Vinculação territorial definitiva e trava de praça', desc: 'Sua região exclusiva de Santos vinculada no mapa satelital.' },
                        { key: 'contractSigned', text: 'Geração e criptografia do contrato de licitação', desc: 'Contrato gerado em PDF com hash eletrônico único.' },
                        { key: 'crmConnected', text: 'Provisionamento e integração de credenciais no CRM', desc: 'Acesso instantâneo a contatos e fluxo de negócios central.' },
                        { key: 'academyEnabled', text: 'Desbloqueio de Universidades e Trilha de onboarding', desc: 'Aulas teóricas e práticas liberadas para a equipe.' },
                        { key: 'whatsappSent', text: 'Push automatizado de onboarding no WhatsApp', desc: 'Disparo de boas-vindas com manual, contratos e kit operacional.' }
                      ].map((task, i) => {
                        const isDone = (step3Checklist as any)[task.key];
                        return (
                          <div 
                            key={i}
                            className={`flex items-start gap-3 p-3 border rounded-none transition-all duration-300 ${
                              isDone ? 'bg-zinc-900/30 border-zinc-800' : 'bg-transparent border-transparent opacity-30 scale-98'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-none flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isDone ? 'bg-white/10 text-zinc-300 font-bold' : 'bg-zinc-900 text-zinc-700'
                            }`}>
                              <Check size={11} className={isDone ? 'scale-100' : 'scale-0 transition-transform'} />
                            </div>
                            <div>
                              <div className={`text-xs font-bold transition-colors ${isDone ? 'text-zinc-100' : 'text-zinc-500'}`}>{task.text}</div>
                              {isDone && <p className="text-[10px] text-zinc-550 mt-0.5">{task.desc}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(4)}
                      className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase cursor-pointer rounded-none transition-colors flex items-center gap-1.5"
                    >
                      Ver Painel do Licenciado <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 4: DASHBOARD DO LICENCIADO */}
              {activeStep === 4 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <p className="text-sm text-zinc-400">
                      O parceiro licenciado entra no seu painel operacional central e encontra tudo limpo, tático e de fácil compreensão visual.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-none">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase">Território</span>
                        <div className="text-sm font-black text-white mt-1">Santos - SP</div>
                        <span className="inline-block bg-white/10 text-white border border-white/25 text-[8px] font-mono mt-1 px-1.5 py-0.5 uppercase shadow-[0_0_8px_rgba(255,255,255,0.15)] rounded-none">Ativo</span>
                      </div>
                      
                      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-none">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase">Faturamento (Este Mês)</span>
                        <div className="text-sm font-black text-zinc-300 font-bold mt-1">R$ 18.750</div>
                        <span className="font-mono text-zinc-500 text-[8px] uppercase">Auto-calculado</span>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-none">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase">Clientes Ativos</span>
                        <div className="text-sm font-black text-white mt-1">48 Clientes</div>
                        <span className="font-mono text-[8px] text-zinc-500 uppercase">Mapeados via CRM</span>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-none">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase">Instaladores do Polo</span>
                        <div className="text-sm font-black text-white mt-1">4 Técnicos</div>
                        <span className="font-mono text-[8px] text-zinc-300 font-bold uppercase">Homologados</span>
                      </div>
                    </div>

                    {/* Gamified National Leaderboard */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-none p-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2 mb-3 flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><Compass size={14} className="text-amber-500" /> Ranking Nacional de Licenciados</span>
                        <span className="text-[8px] font-mono text-zinc-650 uppercase">Sincronizado</span>
                      </h4>

                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {[
                          { rank: 1, name: 'Santos (Você)', revenue: 18750, xp: '3.420 XP' },
                          { rank: 2, name: 'Campinas', revenue: 16200, xp: '2.890 XP' },
                          { rank: 3, name: 'Goiânia', revenue: 14800, xp: '2.450 XP' },
                          { rank: 4, name: 'Curitiba', revenue: 12900, xp: '2.120 XP' },
                          { rank: 5, name: 'Belo Horizonte', revenue: 11500, xp: '1.980 XP' }
                        ].map((lead, i) => (
                          <div 
                            key={i}
                            className={`p-2.5 rounded-none border flex items-center justify-between font-mono text-xs ${
                              lead.rank === 1 
                                ? 'bg-white/5 border-[#444746] text-white' 
                                : 'bg-transparent border-transparent text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-5 h-5 rounded-none flex items-center justify-center font-bold text-[10px] ${
                                lead.rank === 1 
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                  : lead.rank === 2 
                                  ? 'bg-zinc-500/10 text-zinc-400' 
                                  : 'bg-zinc-900 text-zinc-600'
                              }`}>{lead.rank}º</span>
                              <span className="font-bold tracking-tight text-zinc-200">{lead.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                              <span className="text-zinc-500 font-normal scale-90">{lead.xp}</span>
                              <span className="font-bold text-white">R$ {lead.revenue.toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(5)}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      Regras de Mensalidade <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 5: MENSALIDADE RECORRENTE AUTOMÁTICA */}
              {activeStep === 5 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400">
                      Toda licença de franqueado custa R$ 497 de manutenção. Sem cobrança humana manual, as notificações de regularização ocorrem em trilha escalonável:
                    </p>

                    {/* Interactive State Selector */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-none p-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Simulador de Cobrança Automatizada:</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { state: 'pago', label: '1. Licença Paga', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
                            { state: 'aviso1', label: '2. Primeiro Atraso', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
                            { state: 'aviso2', label: '3. Alerta Crítico', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
                            { state: 'suspenso', label: '4. Suspensão Ativa', color: 'bg-red-500/10 text-red-400 border-red-500/30' }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => setLicenseStatus(item.state as any)}
                              className={`p-3 rounded-none border font-mono text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 ${
                                licenseStatus === item.state 
                                  ? `${item.color} shadow-lg scale-102` 
                                  : 'bg-zinc-900 border-zinc-850 text-zinc-550 hover:bg-zinc-800 hover:text-zinc-300'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Displaying Live Simulation Screen */}
                      <div className="border border-zinc-900 bg-zinc-900/10 rounded-none p-5 flex flex-col justify-between min-h-[140px] transition-all">
                        {licenseStatus === 'pago' && (
                          <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs">
                            <Check size={18} className="bg-zinc-500/10 p-1 rounded-none text-zinc-400 border border-zinc-500/20" />
                            <div>
                              <p className="font-bold uppercase tracking-wider">Licença Regularizada (R$ 497,00)</p>
                              <p className="text-zinc-500 font-normal mt-0.5">Operações ocorrendo plenamente sem interferências.</p>
                            </div>
                          </div>
                        )}

                        {licenseStatus === 'aviso1' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-yellow-500 font-mono text-xs">
                              <AlertTriangle size={18} className="bg-yellow-500/10 p-1 rounded-none text-yellow-500 border border-yellow-500/20" />
                              <div>
                                <p className="font-bold uppercase tracking-wider">AVISO 1: Pendência Financeira Detectada</p>
                                <p className="text-zinc-550 font-normal mt-0.5">Sistema gerou novo Pix tático via CRM no WhatsApp do licenciado.</p>
                              </div>
                            </div>
                            <div className="p-2.5 bg-yellow-550/5 border border-yellow-500/10 text-[9px] font-mono text-yellow-400/80 leading-normal">
                              <i>"Olá! Notamos que sua licença mensal da franquia WINF está em aberto. Siga com o código Pix para garantir o repasse de leads diário sem pausa."</i>
                            </div>
                          </div>
                        )}

                        {licenseStatus === 'aviso2' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-orange-500 font-mono text-xs">
                              <AlertTriangle size={18} className="bg-orange-500/10 p-1 rounded-none text-orange-500 border border-orange-500/20" />
                              <div>
                                <p className="font-bold uppercase tracking-wider">AVISO 2: Alerta de Suspensão Iminente</p>
                                <p className="text-zinc-550 font-normal mt-0.5">Pendência em atraso há mais de 4 dias. Alerta de bloqueio tático enviado.</p>
                              </div>
                            </div>
                            <div className="p-2.5 bg-orange-550/5 border border-orange-500/10 text-[9px] font-mono text-orange-400/80 leading-normal">
                              <i>"ATENÇÃO PARCEIRO: Se o repasse financeiro de R$ 497 não for liquidado em até 24h, seu login e os leads regionais serão bloqueados automaticamente."</i>
                            </div>
                          </div>
                        )}

                        {licenseStatus === 'suspenso' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-red-500 font-mono text-xs">
                              <AlertTriangle size={18} className="bg-red-500/10 p-1 rounded-none text-red-500 border border-red-500/20 animate-bounce" />
                              <div>
                                <p className="font-bold uppercase tracking-wider">ACESSO SUSPENSO TEMPORARIAMENTE</p>
                                <p className="text-zinc-550 font-normal mt-0.5">Suspensão de conta executada. Leads no CRM bloqueados.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-none flex items-center justify-between gap-4">
                              <p className="text-[10px] text-zinc-400 font-mono max-w-sm leading-normal">
                                Sua praça Santos - SP foi congelada. Clique abaixo para simular a liquidação imediata da licença.
                              </p>
                              <button 
                                onClick={() => setLicenseStatus('pago')}
                                className="px-3.5 py-1.5 bg-red-500 text-white font-bold font-mono text-[9px] uppercase rounded-none hover:bg-red-600 transition-colors"
                              >
                                Pagar com Pix
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(6)}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      Marketplace B2B <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 6: MARKETPLACE INTERNO */}
              {activeStep === 6 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      O licenciado compra bobinas AeroCore, fardamentos oficiais, ferramentas e arquivos com faturamento direto na central pelo Blackshop B2B.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shopItems.map((item, idx) => {
                        const count = cart[item.id] || 0;
                        return (
                          <div key={idx} className="p-3 bg-zinc-950 border border-zinc-900 rounded-none flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-none bg-cover bg-center shrink-0 border border-zinc-800" style={{ backgroundImage: `url(${item.img})` }}></div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-bold text-zinc-200 truncate">{item.name}</h4>
                              <p className="text-[10px] font-mono text-zinc-300 font-bold mt-0.5">R$ {item.price.toLocaleString('pt-BR')}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {count > 0 ? (
                                <>
                                  <button 
                                    onClick={() => updateCartQuantity(item.id, -1)}
                                    className="w-6 h-6 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm"
                                  >
                                    -
                                  </button>
                                  <span className="w-4 text-center font-mono text-xs text-white">{count}</span>
                                  <button 
                                    onClick={() => updateCartQuantity(item.id, 1)}
                                    className="w-6 h-6 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm"
                                  >
                                    +
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[10px] font-bold uppercase rounded-none transition-colors"
                                >
                                  Adicionar
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Simple Cart Total Footer */}
                    {getCartTotal() > 0 && (
                      <div className="p-3 bg-white/5 border border-[#444746] rounded-none flex justify-between items-center font-mono text-xs">
                        <span className="text-zinc-400">Total do Pedido B2B:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">R$ {getCartTotal().toLocaleString('pt-BR')},00</span>
                          <button 
                            onClick={() => setCart({})}
                            className="px-2.5 py-1 bg-white text-black font-bold uppercase text-[9px] rounded-none hover:bg-zinc-200 transition-all"
                          >
                            Finalizar Compra
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(7)}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      Trilhas de Capacitação <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 7: WINF ACADEMY / UNIVERSIDADE */}
              {activeStep === 7 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Para manter o padrão de excelência, cada polo licenciado cursa 4 módulos obrigatórios de certificação com certificados emitidos pela central.
                    </p>

                    <div className="space-y-2.5">
                      {mockCourses.map((course, idx) => {
                        const isDone = completedCourses[course.id];
                        return (
                          <div 
                            key={course.id}
                            className={`p-3 border rounded-none flex items-center justify-between gap-5 transition-all ${
                              isDone ? 'bg-white/5 border-white/30/15' : 'bg-zinc-950 border-zinc-900'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 ${
                                isDone ? 'bg-white/10 text-zinc-300 font-bold' : 'bg-zinc-900 text-zinc-650'
                              }`}>
                                <GraduationCap size={16} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-zinc-200">{course.name}</span>
                                  <span className="bg-zinc-900 text-zinc-550 border border-zinc-850 text-[8px] px-1.5 py-0.5 rounded-none uppercase font-mono">{course.category}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-0.5 max-w-md">{course.desc}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleCourse(course.id)}
                              className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase rounded-none transition-all ${
                                isDone 
                                  ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' 
                                  : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800'
                              }`}
                            >
                              {isDone ? 'Concluído ✓' : 'Concluir'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress feedback under WINF Academy */}
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
                      <span>Progresso Acadêmico do Polo:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-zinc-900 rounded-none overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-300" 
                            style={{ width: `${(completedCount / mockCourses.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-zinc-300 font-bold font-bold">{completedCount}/{mockCourses.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(8)}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      CRM & Leads Dinâmicos <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 8: CRM & ENCAMINHAMENTO DE LEADS */}
              {activeStep === 8 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      A Matriz gera leads altamente qualificados no site institucional. O robô tático detecta o território e envia os dados limpos direto para o WhatsApp do licenciado correspondente:
                    </p>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-none p-5 md:p-6 space-y-4">
                      {/* Lead Visual Box */}
                      <div className="p-3.5 bg-zinc-900 border border-zinc-850 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-none flex items-center justify-center shrink-0">
                            <Users size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">Rodrigo Castro</span>
                              <span className="bg-white/15 text-zinc-300 font-bold border border-white/30/25 text-[8px] font-mono px-1.5 py-0.5 rounded-none font-bold uppercase tracking-wider">AeroCore Triple-A</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Dispositivo: Solicitou Orçamento em Santos - SP</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end font-mono text-[10px] text-zinc-500">
                          <span>WhatsApp: (13) 99827-3021</span>
                          <span className="text-zinc-300 font-bold font-bold mt-1">Geo-Segmentado Santos [Bypass]</span>
                        </div>
                      </div>

                      {/* Interactive Trigger */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 border border-zinc-850 rounded-none">
                        <p className="text-xs text-zinc-400 max-w-sm font-light">
                          Simule o disparo automático da API de Integração encaminhando Rodrigo Castro para o consultor licenciado local.
                        </p>
                        <button
                          onClick={() => {
                            setIsLeadDispatched(true);
                            setTimeout(() => setIsLeadDispatched(false), 3500);
                          }}
                          className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase font-mono text-[9px] rounded-none tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <Phone size={11} /> Disparar para WhatsApp
                        </button>
                      </div>

                      {/* Animated Message Simulator */}
                      {isLeadDispatched && (
                        <div className="p-3.5 bg-zinc-900/20 border border-zinc-500/20 text-zinc-200 text-xs font-mono rounded-none flex gap-3 items-start animate-pulse">
                          <MessageSquare size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider mb-1">Simulação WhatsApp Webhook ativa:</p>
                            <span className="text-[10px] text-zinc-400 leading-normal">
                              <i>"Central WINF: Novo Lead VIP recebido! <b>Rodrigo Castro</b> em Santos. Interesse em película Nano-Térmica AeroCore para projeto residencial de 45m². Clique no número para iniciar o contato: wa.me/5513998273021."</i>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(9)}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      Repasse e Splits <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 9: COMBINADOS DE REPASSE (SPLIT AUTOMÁTICO) */}
              {activeStep === 9 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      As vendas fechadas via CRM distribuem as comissões de forma instantânea sem interferência ou auditoria manual:
                    </p>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-none p-5 md:p-6 space-y-6">
                      {/* Active split controller */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono mb-2">
                          <span className="text-zinc-400">Arraste para Simular o Valor da Venda:</span>
                          <span className="text-white font-bold text-sm">R$ {saleValue.toLocaleString('pt-BR')},00</span>
                        </div>
                        <input 
                          type="range" 
                          min={1000} 
                          max={20000} 
                          step={500} 
                          value={saleValue}
                          onChange={(e) => setSaleValue(Number(e.target.value))}
                          className="w-full accent-white h-1.5 bg-zinc-900 rounded-none outline-none cursor-ew-resize"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 90% Licensee split */}
                        <div className="p-4 bg-zinc-900 rounded-none border border-zinc-850 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 opacity-5">
                            <DollarSign size={80} />
                          </div>
                          <span className="text-[9px] font-mono text-zinc-300 font-bold uppercase tracking-widest font-bold">90% Licenciado Local</span>
                          <div className="text-xl font-black text-white mt-1.5">R$ {(saleValue * 0.9).toLocaleString('pt-BR')},00</div>
                          <p className="text-[10px] text-zinc-550 leading-normal font-mono uppercase mt-2">Liquidação instantânea via API Asaas no polo correspondente.</p>
                        </div>

                        {/* 10% Matrix commission */}
                        <div className="p-4 bg-zinc-900 rounded-none border border-zinc-850 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 opacity-5">
                            <Building2 size={80} />
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">10% WINF Matriz</span>
                          <div className="text-xl font-black text-zinc-400 mt-1.5 font-mono">R$ {(saleValue * 0.1).toLocaleString('pt-BR')},00</div>
                          <p className="text-[10px] text-zinc-550 leading-normal font-mono uppercase mt-2">Taxa operacional de royalties e gestão de inteligência.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-end">
                    <button 
                      onClick={() => setActiveStep(10)}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs uppercase cursor-pointer rounded-none border border-zinc-800 transition-colors flex items-center gap-1.5"
                    >
                      Completo App Partners <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


              {/* STEP 10: APP COMPLETO WINF PARTNERS */}
              {activeStep === 10 && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      WINF Partners consolida todas as frentes de negócios (leads, comissões, treinamentos, certificados e marketplace) em um único ambiente premium tático.
                    </p>

                    {/* Integrated Mobile Emulator */}
                    <div className="max-w-[420px] mx-auto bg-zinc-950 border border-zinc-900 rounded-none p-5 relative overflow-hidden shadow-2xl">
                      {/* Speaker camera bar on top of mobile frame */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-[#131314] rounded-none flex justify-center items-center">
                        <span className="w-1.5 h-1.5 bg-zinc-900 rounded-none" />
                      </div>
                      
                      <div className="space-y-4 pt-4">
                        {/* Mobile Header */}
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-none" />
                            <span className="text-[9px] text-zinc-500 font-mono">SISTEMA ATIVO</span>
                          </div>
                          <span className="text-[10px] text-white tracking-widest font-black">WINF OS Mobile</span>
                        </div>

                        {/* Top info badge inside mobile */}
                        <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-none flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-zinc-300 font-bold" />
                            <div className="text-[10px] font-bold text-zinc-200">Santos - SP</div>
                          </div>
                          <div className="font-mono text-[9px] text-zinc-300 font-bold font-bold">R$ 18.750,00</div>
                        </div>

                        {/* Mobile Navigation grids */}
                        <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold uppercase transition-all">
                          <div className="p-2 bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800 rounded-none text-zinc-300">
                            <Users size={12} className="mx-auto text-zinc-550 mb-1" />
                            Leads VIP (48)
                          </div>
                          <div className="p-2 bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800 rounded-none text-zinc-300">
                            <ShoppingBag size={12} className="mx-auto text-zinc-550 mb-1" />
                            Preços B2B
                          </div>
                          <div className="p-2 bg-zinc-900/60 border border-zinc-850 hover:border-zinc-800 rounded-none text-zinc-300">
                            <GraduationCap size={12} className="mx-auto text-zinc-550 mb-1" />
                            Academy Trilha
                          </div>
                          <div className="p-2 bg-white/5 border border-[#444746] rounded-none text-zinc-300 font-bold">
                            <Coins size={12} className="mx-auto text-zinc-300 font-bold mb-1" />
                            Suporte Rápido
                          </div>
                        </div>

                        {/* Complete feedback notice */}
                        <p className="text-[9px] font-mono text-zinc-600 text-center leading-normal">
                          Operando como franquia digital de películas com o máximo de sofisticação e tecnologia tática nacional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-900 flex justify-between items-center">
                    <p className="text-[10px] font-mono text-zinc-500 hidden md:inline">✓ Fluxo de Demonstração Completo!</p>
                    <button 
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase cursor-pointer rounded-none transition-colors flex items-center gap-1.5"
                    >
                      Reiniciar Simulação <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}


            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
