import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Activity,
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Zap,
  FileText, 
  ChevronRight,
  Scissors,
  Award,
  Search,
  MessageSquare,
  MessageCircle,
  PackageSearch,
  Clock,
  Target,
  ShoppingBag,
  Headphones,
  Briefcase,
  Filter,
  Package,
  Brain,
  MapPin,
  LucideIcon,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Moon,
  CloudDrizzle,
  Thermometer,
  Droplets,
  Wind,
  CloudLightning,
  X,
  Sparkles,
  GraduationCap,
  Lock,
  Check,
  Bot,
  Shield,
  CalendarDays
, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWinf } from '../contexts/WinfContext';
import { ViewState, Lead, User, Installation, InstallationJob } from '../types';
import { getWeatherData } from './ModuleGeoStrategy';
import { useProductivityMonitor } from '../hooks/useProductivityMonitor';

interface DashboardWinfProps {
    user: User | null;
    data?: any;
    onChangeView: (view: ViewState) => void;
}

interface ActionButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    isHighlighted?: boolean;
    isLocked?: boolean;
    isGreen?: boolean;
    isWhite?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick, isActive, isHighlighted, isLocked, isGreen, isWhite }) => (
  <motion.button
    whileHover={{ y: isLocked ? 0 : -2 }}
    whileTap={{ scale: isLocked ? 1 : 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-2 transition-all relative group w-[85px] sm:w-[100px] shrink-0 px-1 py-3.5 rounded-none border ${
      isLocked 
        ? 'bg-[#131314]/80 border-[#444746]/40' 
        : isGreen 
        ? 'bg-zinc-900/20 border-zinc-400/20 text-zinc-300 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
        : isWhite 
        ? 'bg-white/5 border-[#444746] text-white shadow-[0_0_15px_rgba(255,255,255,0.08)]' 
        : 'bg-[#131314] border-[#444746]/60 hover:bg-[#1e1f20] hover:border-zinc-700/50 hover:text-white'
    }`}
  >
    {isHighlighted && !isLocked && (
      <div className={`absolute inset-0 blur-xl rounded-none ${isWhite ? 'bg-white/10' : isGreen ? 'bg-white/10' : 'bg-zinc-200/5'}`}></div>
    )}
    
    <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-none transition-all relative z-10 
      ${isLocked 
        ? 'bg-[#131314] text-zinc-600' 
        : isGreen 
        ? 'bg-white/10 text-zinc-300 shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
        : isWhite 
        ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]' 
        : isActive 
        ? 'bg-zinc-100 text-zinc-950 shadow-[0_0_12px_rgba(255,255,255,0.15)]' 
        : 'bg-[#1e1f20] text-zinc-450 group-hover:text-zinc-200 group-hover:bg-[#282a2c]'
      }`}
    >
      <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
      {/* Small lock icon indicator */}
      {isLocked && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#1e1f20] text-[8px] font-mono font-bold text-zinc-500 px-1 py-0.5 rounded-none border border-[#444746] flex items-center justify-center shadow-sm">
          <Lock size={10} className="mr-0.5" />
        </span>
      )}
      {isGreen && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-none border-2 border-[#444746] animate-pulse"></span>
      )}
      {isWhite && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-none border-2 border-[#444746] shadow-[0_0_6px_white] animate-pulse"></span>
      )}
    </div>
    
    <span className={`text-[11px] sm:text-[12px] font-semibold text-center leading-tight tracking-tight px-1 
      ${isLocked 
        ? 'text-zinc-600' 
        : isGreen 
        ? 'text-zinc-300/95 font-bold' 
        : isWhite 
        ? 'text-white font-bold' 
        : isActive 
        ? 'text-zinc-200' 
        : 'text-zinc-450 group-hover:text-zinc-200 transition-colors'
      }`}
    >
      {label}
    </span>
  </motion.button>
);

interface ServiceItemProps {
    installation: InstallationJob;
    onClick: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ installation, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="px-6 py-4.5 flex items-center justify-between hover:bg-[#131314]/65 transition-colors cursor-pointer group border-b border-[#444746] last:border-0"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-none flex items-center justify-center border transition-colors bg-[#1e1f20] border-[#444746]/80 text-zinc-500 group-hover:text-zinc-300">
          <ArrowUpRight size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors tracking-wide truncate max-w-[150px] sm:max-w-xs">{installation.customer_name}</p>
          <p className="text-xs md:text-sm text-zinc-500 font-mono tracking-widest mt-1.5 uppercase">{installation.vehicle_model || installation.chosen_film}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-mono tracking-tighter text-zinc-100 leading-none">
          {installation.scheduled_date ? new Date(installation.scheduled_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Não agendado'}
        </p>
        <div className="flex items-center justify-end gap-1.5 mt-2">
           <span className="w-1.5 h-3 rounded-none bg-zinc-400"></span>
           <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-zinc-400">AGENDADO</p>
        </div>
      </div>
    </div>
  );
};

const DashboardWinf: React.FC<DashboardWinfProps> = ({ user, onChangeView }) => {
  const { 
    leads = [], 
    fetchUserPerformanceMetrics, 
    isLoading, 
    effectiveRole, 
    updateUserCoins, 
    agentInsights = [], 
    favoriteModules = [], 
    toggleFavoriteModule,
    quotes = [],
    installationJobs = [],
    stockItems = [],
    activeChats = []
  } = useWinf();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showBalance, setShowBalance] = useState(true);

  // Territory activation and locking
  const [digitalState, setDigitalState] = useState<'NOT_STARTED' | 'PENDING' | 'ACTIVATED'>(() => {
    return (localStorage.getItem('winf_digital_start_state') as any) || 'ACTIVATED';
  });
  const [showLockModal, setShowLockModal] = useState(false);
  const [triedModule, setTriedModule] = useState('');
  const [isEditingQuickAccess, setIsEditingQuickAccess] = useState(false);
  
  const [isAuronActive, setIsAuronActive] = useState(() => {
    return localStorage.getItem('auron_wno_active') !== 'false';
  });

  const toggleAuron = () => {
    const newState = !isAuronActive;
    setIsAuronActive(newState);
    localStorage.setItem('auron_wno_active', String(newState));
  };

  const ALL_APPS = useMemo(() => [
    { id: 'cadastro_clientes', icon: Users, label: 'Clientes', view: ViewState.MODULE_CUSTOMER_REGISTRATION, requiresActivation: true },
    { id: 'financeiro', icon: DollarSign, label: 'Caixa', view: ViewState.MODULE_FINANCIAL, requiresActivation: true },
    { id: 'blackshop', icon: ShoppingBag, label: 'Blackshop', view: ViewState.MODULE_BLACKSHOP, requiresActivation: true },
    { id: 'agenda', icon: CalendarDays, label: 'OS', view: ViewState.MODULE_INSTALLATIONS, requiresActivation: true },
    { id: 'territorio', icon: MapPin, label: 'Território', view: ViewState.GEO_STRATEGY, requiresActivation: false },
    { id: 'novos_negocios', icon: Target, label: 'Radar', view: ViewState.MODULE_CAPTURE, requiresActivation: true },
    { id: 'orcamentos', icon: FileText, label: 'Orçamentos', view: ViewState.MODULE_QUOTES, requiresActivation: true },
    { id: 'precision', icon: Scissors, label: 'Precision™', view: ViewState.MODULE_WINF_PRECISION, requiresActivation: true },
    { id: 'arsenal', icon: Zap, label: 'Arsenal M.A.W™', view: ViewState.MODULE_ARSENAL, requiresActivation: true },
    { id: 'cortex_v2', icon: Bot, label: 'WINF Córtex', view: ViewState.MODULE_CORTEX_TERMINAL, requiresActivation: true },
    { id: 'audio_intel', icon: Headphones, label: 'Áudio WINF', view: ViewState.MODULE_AUDIO_INTELLIGENCE, requiresActivation: true },
    { id: 'guest_lounge', icon: Briefcase, label: 'Lounge', view: ViewState.GUEST_LOUNGE, requiresActivation: true },
    { id: 'catalogo', icon: Briefcase, label: 'Catálogo', view: ViewState.PRODUCTS_CATALOG, requiresActivation: false },
    { id: 'garantia', icon: Award, label: 'Garantias', view: ViewState.WARRANTY, requiresActivation: true },
    { id: 'estoque', icon: Package, label: 'Estoque & Rolls', view: ViewState.MODULE_STOCK, requiresActivation: true },
    { id: 'academy', icon: GraduationCap, label: 'Academy™', view: ViewState.MODULE_ACADEMY, requiresActivation: false, isGreen: true },
    { id: 'board', icon: Trophy, label: 'The Board™', view: ViewState.MODULE_THE_BOARD, requiresActivation: false },
  ], []);

  const defaultApps = useMemo(() => ['cadastro_clientes', 'orcamentos', 'agenda', 'catalogo', 'garantia', 'arsenal', 'cortex_v2', 'audio_intel', 'guest_lounge', 'blackshop', 'estoque', 'board'], []);
  
  useEffect(() => {
    if (favoriteModules.length === 0) {
      defaultApps.forEach(id => toggleFavoriteModule(id));
    }
  }, [favoriteModules.length, toggleFavoriteModule, defaultApps]);

  const displayedApps = useMemo(() => {
    const activeFavorites = favoriteModules.length > 0 ? favoriteModules : defaultApps;
    return ALL_APPS.filter(app => activeFavorites.includes(app.id) || app.id === 'academy');
  }, [favoriteModules, ALL_APPS, defaultApps]);

  useEffect(() => {
    const freshState = (localStorage.getItem('winf_digital_start_state') as any) || 'ACTIVATED';
    setDigitalState(freshState);
  }, []);

  // Integrated WINF METEO-OS™ Engine States
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const userCityDefault = user?.territory || user?.address?.city || 'Santos';
  const [weatherCity, setWeatherCity] = useState(userCityDefault);
  const [forceUpdate, setForceUpdate] = useState(0);

  const liveWeatherData = getWeatherData(weatherCity);
  const isCityStationActive = localStorage.getItem(`winf_weather_station_${weatherCity}`) !== 'false';
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const allCities = ['Santos', 'São Paulo', 'Campinas', 'Rio de Janeiro', 'Curitiba'];
  
  const currentRole = effectiveRole || user?.role || 'Guest';
  const isAdmin = (currentRole || 'Guest').toLowerCase() === 'admin' || user?.email === 'marketing.advanced.windowfilm@gmail.com';
  
  useEffect(() => { 
    // Intentionally wrap inside an async call or proper useEffect dep array
    let isMounted = true;
    if (isMounted) {
      fetchUserPerformanceMetrics(); 
      const hasSeen = localStorage.getItem('winf_tutorial_seen_v3');
      if (!hasSeen) {
        setShowTutorial(true);
      }
    }
    return () => { isMounted = false; };
  }, [fetchUserPerformanceMetrics]);

  const tourStepsData = useMemo(() => [
    { target: 'balance', title: 'Bem-vindo ao Winf OS', desc: 'Acompanhe a saúde do seu negócio e a receita potencial dos projetos locais e comerciais.' },
    { target: 'actions', title: 'Acesso Rápido', desc: 'Sua central de operações. Aqui você vai gerar orçamentos autênticos Winf, consultar materiais e liderar projetos.' },
    { target: 'transactions', title: 'Start Digital Local', desc: 'Para liberar todas as suas ferramentas, precisamos iniciar a configuração do seu território. Nossa equipe fará todo o trabalho pesado.' },
  ], []);

  const handleNextTourStep = useCallback(() => {
    if (tourStep < tourStepsData.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      localStorage.setItem('winf_tutorial_seen_v3', 'true');
      setShowTutorial(false);
      if (digitalState === 'NOT_STARTED') {
        onChangeView(ViewState.MODULE_DIGITAL_START);
      }
    }
  }, [tourStep, tourStepsData.length, updateUserCoins, digitalState, onChangeView]);

  const upcomingInstallations = useMemo(() => {
    return [...installationJobs]
      .filter(job => job.status !== 'completed' && job.scheduled_date)
      .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime())
      .slice(0, 5);
  }, [installationJobs]);

  const {
      totalM2Sold,
      totalRevenue,
      isAdvancedLevel,
      isTurboActivated,
      assetLightTargetM2,
      metricsPct,
      showTrafficRecommendation,
      dismissTrafficRecommendation,
      toggleTurbo
  } = useProductivityMonitor(quotes);

  const [showTurboConfirm, setShowTurboConfirm] = useState(false);

  const handleToggleTurbo = () => {
    toggleTurbo();
  };

  const confirmTurbo = () => {
    setShowTurboConfirm(false);
    if (!isTurboActivated) {
        toggleTurbo();
    }
    (window as any).blackshopFocusItemId = 'svc1';
    onChangeView(ViewState.MODULE_BLACKSHOP);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };


  return (
    <>
      <AnimatePresence>
        {showTutorial && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-end md:items-center justify-center p-4">
             <div className="absolute inset-0 bg-[#131314]/60 backdrop-blur-[2px] transition-all duration-500"></div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-[#131314] border border-[#444746] w-full max-w-md overflow-hidden relative shadow-2xl rounded-none pointer-events-auto z-10 text-zinc-105"
             >
               <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-zinc-100 rounded-none flex items-center justify-center mx-auto mb-6">
                    <Target size={24} className="text-zinc-100" strokeWidth={1.5} />
                 </div>
                 <h3 className="text-2xl font-light tracking-tight text-zinc-900 mb-3">
                   {tourStepsData[tourStep].title}
                 </h3>
                 <p className="text-sm font-light text-zinc-500 mb-8 min-h-[60px] leading-relaxed">
                   {tourStepsData[tourStep].desc}
                 </p>
                 <button onClick={handleNextTourStep} className={`w-full ${tourStep === tourStepsData.length - 1 ? 'bg-white hover:bg-white/90 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-[#282a2c] hover:bg-[#333537] text-white'} py-4 rounded-none text-xs uppercase font-bold tracking-widest transition-colors mb-4 flex items-center justify-center gap-2`}>
                   {tourStep === tourStepsData.length - 1 ? (
                     <>
                       <Zap size={16} /> Ativar Território (+50 🪙)
                     </>
                   ) : 'Próximo'}
                 </button>
                 <button onClick={() => { 
                   setShowTutorial(false); 
                   localStorage.setItem('winf_tutorial_seen_v3', 'true');
                   if (digitalState === 'NOT_STARTED') {
                     onChangeView(ViewState.MODULE_DIGITAL_START);
                   }
                  }} className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Pular Introdução</button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showLockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#131314]/85 backdrop-blur-md transition-all duration-300" onClick={() => setShowLockModal(false)}></div>
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 15 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 15 }}
             className="bg-[#131314] border border-[#444746] w-full max-w-lg overflow-hidden relative shadow-2xl rounded-none z-10 p-8 space-y-6 text-left text-zinc-200"
           >
             <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
               <div className="w-12 h-12 bg-[#282a2c] text-white rounded-none flex items-center justify-center border border-zinc-300 shrink-0">
                  <PackageSearch size={22} />
               </div>
               <div>
                  <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block">Módulo Aguardando Liberação</span>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 uppercase">
                    Configure seu Território
                  </h3>
               </div>
             </div>

             <p className="text-sm font-light text-zinc-700 leading-relaxed">
               O módulo <strong className="text-zinc-900 font-bold">"{triedModule}"</strong> requer que o seu território esteja configurado. Para iniciar as suas vendas com a ferramenta oficial <span className="text-zinc-900 font-bold">WINF™</span>, você precisa preencher os dados de <strong className="text-zinc-300 font-bold">Start Digital</strong>.
             </p>

             <div className="bg-white/5 border border-[#444746] p-4 rounded-none space-y-2">
               <p className="text-xs text-zinc-300 font-bold font-mono tracking-widest uppercase font-bold flex items-center gap-1.5">
                 <Zap size={14} /> PRÓXIMO PASSO
               </p>
               <p className="text-xs text-zinc-500 leading-relaxed">
                 A nossa equipe fará o trabalho de ativação, liberação de marketing integrado, e configurações de faturamento logo após o seu preenchimento rápido.
               </p>
             </div>

             <div className="flex flex-col gap-3 pt-2">
               <button 
                 onClick={() => {
                   setShowLockModal(false);
                   onChangeView(ViewState.MODULE_DIGITAL_START);
                 }} 
                 className="w-full bg-white text-black py-4 rounded-none text-xs uppercase font-bold tracking-widest hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                 >
                 <Sparkles size={14} /> Ativar Start Digital
               </button>
               <button 
                 onClick={() => {
                   setShowLockModal(false);
                   onChangeView(ViewState.MODULE_ACADEMY);
                 }} 
                 className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-none text-xs uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 border border-zinc-300"
               >
                 <GraduationCap size={14} /> Acessar Academy (Liberada)
               </button>
               <button 
                 onClick={() => setShowLockModal(false)} 
                 className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors text-center mt-2"
               >
                 Voltar ao Painel
               </button>
             </div>
           </motion.div>
        </div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 bg-[#131314] min-h-full overflow-y-auto overflow-x-hidden text-zinc-200 p-0 sm:-m-6 md:-m-8 sm:p-6 md:p-8 pb-32"
      >
        <div className="max-w-6xl mx-auto space-y-6 px-6 sm:px-8 md:px-8 lg:px-12 pt-4 sm:pt-0">
        {/* Header / Crypto Balance Area */}
        <div className="bg-transparent mb-8">
          {/* Admin Command Quick Shortcut Banner */}
          {isAdmin && (
            <div className="hidden md:flex mb-8 p-5 bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#444746] rounded-none flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-none bg-white/5 border border-[#444746] flex items-center justify-center text-zinc-300 font-bold shrink-0 shadow-inner">
                  <Shield size={20} className="text-zinc-300 font-bold" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    Painel de Controle Administrador
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
                    Estão disponíveis aqui os 100 Territórios Estratégicos prontos para ativação e controle.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onChangeView(ViewState.MODULE_DOCUMENTS_ADMIN)}
                  className="px-5 py-3 bg-zinc-900 border border-[#444746] hover:bg-zinc-800 text-white text-[10px] font-mono uppercase tracking-widest font-bold transition-colors rounded-none flex items-center justify-center gap-1.5 shrink-0"
                >
                   <FileText size={14} /> Gestão de PDFs
                </button>
                <button
                  onClick={() => onChangeView(ViewState.ADMIN_PANEL)}
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-zinc-200 text-black text-[10px] font-mono uppercase tracking-widest font-black transition-colors rounded-none flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#FFFFFF]/10"
                >
                  Configurar Territórios
                </button>
              </div>
            </div>
          )}

          <div className={`px-2 ${showTutorial && tourStepsData[tourStep].target === 'balance' ? 'ring-1 ring-zinc-700/50 rounded-none relative z-50 bg-[#1e1f20]/40 py-6' : ''}`}>
            <div className="flex justify-between items-start w-full mb-2">
              <button 
                onClick={() => onChangeView(ViewState.MODULE_FINANCIAL)}
                className="text-left w-auto hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0 pt-6"
              >
                <div className="flex items-end gap-3 mb-4 mt-2 bg-transparent">
                  <h1 className={`text-2xl sm:text-3xl font-mono tracking-tighter transition-all ${showBalance ? 'text-white' : 'text-zinc-700 blur-[4px]'}`}>
                    R$ {Math.floor(Number(totalRevenue) || 0).toLocaleString('pt-BR')}<span className="text-lg text-zinc-400">,{((Number(totalRevenue) || 0) % 1).toFixed(2).substring(2)}</span>
                  </h1>
                </div>
              </button>

              <div className="flex flex-col items-end gap-5">
                 <button onClick={() => setShowBalance(!showBalance)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showBalance ? <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 bg-[#1e1f20]/60 rounded-none border border-[#444746]/60">Ocultar</span> : <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 bg-[#1e1f20]/60 rounded-none border border-[#444746]/60 text-zinc-300">Mostrar</span>}
                 </button>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between font-mono text-xs md:text-sm mb-8 mt-2">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleToggleTurbo}
                    className={`uppercase tracking-widest flex items-center gap-3 px-4 py-2 bg-transparent border rounded-none transition-colors font-medium cursor-pointer ${isTurboActivated ? 'border-orange-500/50 text-zinc-200' : 'border-zinc-700/80 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'}`}
                    title={isTurboActivated ? 'Market Advanced Windowfilm' : 'Modo Operacional Padrão'}
                  >
                    <span>{isTurboActivated ? 'M.A.W ATIVADO' : 'OPERAÇÃO PADRÃO'}</span>
                    
                    <div className={`relative inline-flex h-4 w-7 items-center rounded-none transition-colors ${isTurboActivated ? 'bg-orange-500 shadow-[0_0_8px_0_rgba(249,115,22,0.6)]' : 'bg-zinc-600'}`}>
                      <span className={`inline-block h-3 w-3 transform rounded-none bg-white transition-transform duration-300 ${isTurboActivated ? 'translate-x-[14px]' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                  <button 
                    onClick={() => setShowTurboConfirm(true)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 shrink-0 ${
                      isTurboActivated 
                        ? 'text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse' 
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                    title="Acessar BlackShop"
                  >
                    <Zap size={22} strokeWidth={1} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className={`uppercase tracking-widest flex items-center gap-1.5 font-medium ${isTurboActivated ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    <Clock size={14}/> {isTurboActivated ? '6h/dia' : '3h/dia'}
                    <span className={`ml-3 border-l pl-3 ${isTurboActivated ? 'border-zinc-600' : 'border-zinc-700 opacity-90'}`}>{isTurboActivated ? '5 a 6x/semana' : '3 a 4x/semana'}</span>
                  </span>
                  <span className={`uppercase tracking-widest flex items-center gap-1.5 font-medium ${isTurboActivated ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    Volume: {(totalM2Sold || 0).toFixed(1)} m² / {assetLightTargetM2} m²
                  </span>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 flex shrink-0">
                 {/*  */}
              </div>
            </div>

            {/* Financial Metric Goal (Medidor de Meta) */}
            <div className="space-y-4 pb-2 pt-2 border-t border-[#444746]/40 cursor-help" title={`Meta de Produção Ideal: ${assetLightTargetM2} m². Capacidade Máx: ${isAdvancedLevel ? 600 : 300} m²`}>
               <div className="flex justify-between items-end bg-transparent">
                  <span className="text-xl sm:text-2xl font-mono tracking-tighter text-zinc-100 flex items-center gap-2 transition-all">
                    {metricsPct}% <span className="text-xs text-zinc-500 font-light font-sans tracking-normal uppercase relative -top-0.5">da capacidade {isAdvancedLevel ? 'expandida' : 'base'}</span>
                  </span>
               </div>
               
               {/* Timeline style gauge */}
               <div className="relative w-full h-1.5 bg-[#1e1f20] rounded-none mt-2">
                 <motion.div 
                   className={`absolute top-0 left-0 h-full rounded-none transition-colors ${isTurboActivated ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-zinc-300 shadow-[0_0_6px_rgba(255,255,255,0.2)]'}`}
                   initial={{ width: 0 }}
                   animate={{ width: `${metricsPct || 0}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                 />
                 
                 {/* Max capacity marker line extending past the basic target virtually */}
                 <div className="absolute top-0 right-0 h-full bg-indigo-500/20 rounded-none" style={{ width: '33%', left: '100%', clipPath: 'inset(0 0 0 0)'}}></div>
                 
                 {/* Target Marker */}
                 <div className="absolute h-5 -top-1.5 border-r-2 border-zinc-500 z-10 transition-all duration-1000" style={{ left: '100%' }}>
                    <span className="absolute -top-4 -translate-x-1/2 text-[8px] font-mono text-zinc-500 transition-all duration-1000">{isAdvancedLevel ? '400m²' : '200m²'}</span>
                 </div>
                 
                 {/* Capacity Stretch Marker (150%) - visualized relatively */}
                 <div className="absolute h-5 -top-1.5 border-r border-[#444746] z-10 border-dashed transition-all duration-1000" style={{ left: '150%' }}>
                    <span className="absolute -top-4 -translate-x-1/2 text-[8px] font-mono text-indigo-400/50 transition-all duration-1000">{isAdvancedLevel ? '600m²' : '300m²'} (Máx)</span>
                 </div>
               </div>
            </div>

            {/* AI Recommendation Banner */}
            <AnimatePresence>
              {showTrafficRecommendation && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-4 border-t border-[#444746]/40"
                >
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-none p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                        <Bot size={14} /> Recomendação W-NO
                      </h4>
                      <p className="text-[11px] text-zinc-300 font-sans font-light leading-relaxed">
                        Sua produtividade ultrapassou os 150m² mensais. O modelo ideal agora indica impulsionar o <strong className="font-semibold text-white">Marketing Advanced Windowfilm (MAW)</strong> para explorar plenamente sua capacidade.
                      </p>
                    </div>
                    <button 
                      onClick={dismissTrafficRecommendation}
                      className="shrink-0 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors uppercase tracking-widest font-mono text-[9px] font-bold rounded-none border border-indigo-500/30"
                    >
                      Ciente
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className={`py-4 mb-8 sm:mb-10 ${showTutorial && tourStepsData[tourStep].target === 'actions' ? 'ring-1 ring-white/50 rounded-none relative z-50 bg-[#131314] p-6' : ''}`}>
          
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Acesso Rápido</h3>
             <button 
                onClick={() => setIsEditingQuickAccess(!isEditingQuickAccess)}
                className={`text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-none border transition-colors ${
                  isEditingQuickAccess 
                    ? 'bg-white/10 text-zinc-300 border-zinc-400/30' 
                    : 'bg-[#131314] text-zinc-400 border-[#444746]/60 hover:text-white hover:bg-[#282a2c]/50'
                }`}
              >
                {isEditingQuickAccess ? 'Concluído' : '+ Personalizar'}
             </button>
          </div>

          {!isEditingQuickAccess ? (
            <div className="flex overflow-x-auto pb-4 gap-4 sm:flex-wrap items-start custom-scrollbar">
              {displayedApps.map((app) => (
                <ActionButton 
                  key={app.id}
                  icon={app.icon} 
                  label={app.label} 
                  isLocked={app.requiresActivation && digitalState !== 'ACTIVATED'} 
                  isGreen={app.isGreen}
                  isHighlighted={app.requiresActivation && digitalState === 'ACTIVATED'}
                  isWhite={app.id === 'territorio' && digitalState === 'ACTIVATED'}
                  onClick={() => {
                    if (app.requiresActivation && digitalState !== 'ACTIVATED') {
                      setTriedModule(app.label);
                      setShowLockModal(true);
                    } else {
                      onChangeView(app.view);
                    }
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#131314] p-4 sm:p-6 rounded-none border border-[#444746]/60 shadow-xl">
              <p className="text-xs text-zinc-500 mb-6 font-light">
                 Selecione os módulos que deseja manter no seu acesso rápido. Personalize a interface para combinar com sua operação e agilizar seu fluxo. O módulo da Academy™ é fixo.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {ALL_APPS.map(app => {
                  const isSelected = favoriteModules.includes(app.id);
                  return (
                    <div 
                      key={app.id}
                      onClick={() => {
                        if (app.id !== 'academy') {
                          toggleFavoriteModule(app.id);
                        }
                      }}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-none border transition-all cursor-pointer ${isSelected || app.id === 'academy' ? 'bg-[#1e1f20]/80 border-zinc-700/80 text-white' : 'bg-[#131314]/45 border-[#444746]/60 opacity-60 hover:opacity-100 hover:bg-[#1e1f20]/40 text-zinc-450'}`}
                    >
                      <div className={`w-12 h-12 rounded-none flex items-center justify-center ${isSelected || app.id === 'academy' ? (app.isGreen ? 'bg-white/20 text-zinc-300' : 'bg-zinc-100 text-zinc-900') : 'bg-[#1e1f20] text-zinc-500'}`}>
                        <app.icon size={20} />
                      </div>
                      <span className="text-[11px] sm:text-xs text-center font-medium flex items-center text-zinc-350 leading-tight group-hover:text-zinc-200">
                        {app.label}
                      </span>
                      {(isSelected || app.id === 'academy') && (
                        <div className="absolute top-2 right-2 flex items-center justify-center text-zinc-950 bg-white rounded-none p-0.5">
                          <Check size={14} className="p-0.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Recent Activity (Upcoming Services) */}
          <div className={`lg:col-span-8 flex flex-col gap-6 ${showTutorial && tourStepsData[tourStep].target === 'transactions' ? 'ring-1 ring-white/50 rounded-none relative z-50 bg-[#131314] md:-mx-4 md:px-4 md:py-6 border border-[#444746]/60' : ''}`}>
             <div className="bg-[#131314]/95 border border-[#444746]/60 rounded-none overflow-hidden shadow-2xl flex-1 flex flex-col">
               <div className="px-6 py-4 border-b border-[#444746]/50 flex justify-between items-center bg-[#1e1f20]/40">
                 <h2 className="text-lg sm:text-xl font-medium text-zinc-100 tracking-tight">Próximos Serviços a Serem Executados</h2>
                 <button onClick={() => onChangeView(ViewState.MODULE_INSTALLATIONS)} className="text-[10px] filter saturate-75 font-mono text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 border border-[#444746]/80 px-3.5 py-1.5 rounded-none bg-[#282a2c]/40 hover:bg-[#282a2c]/60 transition-all">
                   Ver Agenda
                 </button>
               </div>
               
               <div className="flex flex-col flex-1 bg-transparent">
                 {isLoading ? (
                    <div className="p-6 space-y-4">
                       <div className="h-20 bg-[#1e1f20]/60 animate-pulse rounded-none"></div>
                       <div className="h-20 bg-[#1e1f20]/60 animate-pulse rounded-none"></div>
                       <div className="h-20 bg-[#1e1f20]/60 animate-pulse rounded-none"></div>
                    </div>
                 ) : upcomingInstallations.length > 0 ? (
                    upcomingInstallations.map(inst => (
                      <ServiceItem key={inst.id} installation={inst} onClick={() => onChangeView(ViewState.MODULE_INSTALLATIONS)} />
                    ))
                 ) : (
                    <div className="p-12 text-center text-zinc-500 font-mono text-base">
                      Nenhum serviço agendado no momento.
                    </div>
                 )}
               </div>
             </div>
          </div>

          {/* Right Column: Analytics & Quick Actions */}
          <div className="flex lg:col-span-4 flex-col gap-6">

            {/* MICROSOFT WEATHER FLUID DISCOVERY WIDGET */}
            <div className="bg-[#131314]/95 border border-[#444746]/60 p-6 sm:p-7 rounded-none shadow-2xl relative overflow-hidden group hover:border-[#444746] transition-all flex flex-col gap-3">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                {liveWeatherData.condition === 'Sunny' ? (
                  <Sun className="w-32 h-32 text-yellow-400 animate-spin" style={{ animationDuration: '60s' }} />
                ) : (
                  <Cloud className="w-32 h-32 text-zinc-500" />
                )}
              </div>

              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <Sun className={`w-5 h-5 ${isCityStationActive ? 'text-white animate-pulse' : 'text-zinc-500'}`} />
                  <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">Clima & Urgência</span>
                </div>
                
                <span className={`text-[10px] font-bold uppercase font-mono px-2 py-1 rounded-none ${isCityStationActive ? 'bg-white/10 text-white' : 'bg-transparent border border-[#444746] text-zinc-500'}`}>
                  {isCityStationActive ? 'ESTAÇÃO ATIVA' : 'INATIVA'}
                </span>
              </div>

              <div className="z-10 mt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Território Ativo</span>
                <h3 className="text-lg sm:text-xl font-medium text-zinc-100 tracking-tight flex items-center gap-1.5 mt-0.5">
                  {weatherCity} 
                  <span className="text-sm text-zinc-500 font-mono font-light">// UTC-3</span>
                </h3>
              </div>

              {isCityStationActive ? (
                <div className="space-y-4 z-10 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-mono tracking-tighter text-zinc-100">
                      {liveWeatherData.temp}°C
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                        {liveWeatherData.condition === 'Sunny' ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Cloud className="w-3.5 h-3.5 text-zinc-500" />}
                        {liveWeatherData.conditionName}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">UV MÁX: {liveWeatherData.uvIndex} • IR Rejeitado: {liveWeatherData.irIndex}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#1e1f20]/40 border border-[#444746]/40 rounded-none text-left">
                    <p className="text-[9px] font-black uppercase text-zinc-350 tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-white" /> Recomendação Tática
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-sans font-light mt-1 truncate">
                      Urgência UV detectada! Ofereça {liveWeatherData.recommendedProduct.name}.
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowWeatherModal(true)}
                    className="w-full py-2.5 bg-[#1e1f20] border border-[#444746] hover:border-zinc-700 hover:text-white text-zinc-400 font-bold text-[9px] uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center gap-1"
                  >
                     Painel Telemetria Clima
                  </button>
                </div>
              ) : (
                <div className="space-y-4 z-10 animate-fade-in text-left">
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    A estação climática para <strong>{weatherCity}</strong> está offline. Ative-a para receber alertas urgentes de radiação solar para converter clientes com alta temperatura.
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        localStorage.setItem(`winf_weather_station_${weatherCity}`, 'true');
                        setForceUpdate(p => p + 1);
                      }}
                      className="flex-1 py-3 bg-white/10 hover:bg-white hover:text-black border border-[#444746] text-white font-bold text-[9px] uppercase tracking-widest rounded-none transition-all"
                    >
                      Ativar Agora
                    </button>
                    <button 
                      onClick={() => onChangeView(ViewState.GEO_STRATEGY)}
                      className="px-3 py-3 bg-[#1e1f20] hover:bg-[#282a2c] text-zinc-300 border border-[#444746] font-bold text-[9px] uppercase tracking-widest rounded-none transition-all"
                    >
                      Configurar
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Minimalist Stock Level Indicator */}
            <div className="bg-[#131314]/95 border border-[#444746]/60 p-6 sm:p-7 rounded-none shadow-2xl relative overflow-hidden group hover:border-[#444746] transition-all flex flex-col gap-3 text-left">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package className="w-16 h-16 text-zinc-400" />
              </div>
              
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <Package className="w-4.5 h-4.5 text-zinc-300" />
                  <span className="text-[11px] font-mono tracking-widest text-zinc-350 uppercase">Nível de Estoque</span>
                </div>
                <button 
                  onClick={() => onChangeView(ViewState.MODULE_STOCK)} 
                  className="text-[9px] font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-wider bg-[#1e1f20] border border-[#444746] px-2 py-1 rounded-none"
                >
                  Visualizar Insumos
                </button>
              </div>

              <div className="space-y-3 mt-2 z-10">
                {(stockItems && stockItems.length > 0 ? stockItems : [
                  { id: 's1', product_name: 'Winf Select™ Invisible', remaining_meters: 24.5, total_meters: 30 },
                  { id: 's2', product_name: 'Winf Select™ BlackPro', remaining_meters: 8.5, total_meters: 30 },
                  { id: 's3', product_name: 'AeroCore™ IR-99', remaining_meters: 30.0, total_meters: 30 },
                  { id: 's4', product_name: 'NeoSkin™ PPF Active', remaining_meters: 4.0, total_meters: 30 }
                ]).slice(0, 4).map((item) => {
                  const maxMeters = item.total_meters || 30;
                  const pct = Math.round(((item.remaining_meters || 0) / maxMeters) * 100);
                  const isLow = (item.remaining_meters || 0) < 10;
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-350 font-medium truncate max-w-[150px]">{item.product_name}</span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <span className={`${isLow ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}>
                            {(item.remaining_meters || 0).toFixed(1)}m
                          </span>
                          <span className="text-zinc-600">/</span>
                          <span className="text-zinc-550">{pct}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-[#1e1f20] rounded-none overflow-hidden flex">
                        <motion.div 
                          className={`h-full rounded-none ${isLow ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]' : 'bg-zinc-650'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, pct)}%` }}
                          transition={{ duration: 1.2 }}
                        />
                      </div>
                      {isLow && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="w-1 h-1 rounded-none bg-amber-400 animate-pulse"></span>
                          <span className="text-[8px] font-mono uppercase text-amber-400/90 tracking-wider font-bold">
                            Nível Baixo — Reabastecimento Sugerido
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-[#131314]/95 border border-[#444746]/60 p-6 sm:p-7 rounded-none shadow-2xl relative overflow-hidden group hover:border-zinc-700/40 transition-all flex flex-col gap-3">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Activity size={80} />
               </div>
               <div className="w-10 h-10 bg-[#131314] border border-[#444746] rounded-none flex items-center justify-center text-zinc-300 mb-4">
                  <Brain size={24} strokeWidth={1.5} />
               </div>
               <h4 className="text-xs font-mono text-white/90 font-bold uppercase tracking-[0.3em] mb-4">
                  WINF BRAIN™ Insights
               </h4>
               <p className="text-[13px] sm:text-sm text-zinc-350 font-light leading-relaxed mb-4">
                  {agentInsights && agentInsights.filter(i => !i.is_read).length > 0 
                    ? [...agentInsights].filter(i => !i.is_read).sort((a,b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime())[0]?.content 
                    : 'Fluxo operacional estável. Oportunidade de expansão no pipeline de Projetos Residencial identificada para os próximos 7 dias.'}
               </p>
               <button onClick={() => onChangeView(ViewState.MODULE_RAY)} className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 group/btn">
                  Decodificar Estratégia <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
               </button>
            </div>


            {isAdmin && (
              <div className="bg-[#131314]/95 border border-[#444746]/60 p-6 rounded-none">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-none bg-red-500/10 flex items-center justify-center text-red-400">
                     <Target size={14} />
                   </div>
                   <h3 className="text-sm font-medium text-zinc-200">Global Dashboard</h3>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-4">Administração Matriz</p>
                
                <button 
                  onClick={() => onChangeView(ViewState.DASHBOARD_MATRIX)}
                  className="w-full py-3.5 flex items-center justify-center gap-2 bg-[#1e1f20] hover:bg-white hover:text-black border border-[#444746] text-zinc-300 rounded-none transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Modo Expansão <ArrowUpRight size={14} />
                </button>
              </div>
            )}
            
          </div>
        </div>
        </div>
      </motion.div>

      {/* MICROSOFT WEATHER TELEMETRY CORE (WINF OS CLIMA INTELLIGENCE HUB) */}
      <AnimatePresence>
        {showTurboConfirm && (
          <div className="fixed inset-0 z-[110] bg-[#131314]/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#131314] border border-[#444746]/80 w-full max-w-md rounded-none p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-none blur-3xl pointer-events-none -mr-32 -mt-32"></div>
              
              <div className="w-16 h-16 rounded-none bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 text-orange-500">
                <Zap size={32} className="fill-current" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-orange-500 uppercase tracking-widest font-mono mb-4 text-shadow-sm shadow-orange-500/20">
                {isTurboActivated ? 'ACESSAR CENTRAL BLACKSHOP?' : 'INICIALIZAR PROTOCOLO MAW?'}
              </h2>
              <p className="text-sm text-zinc-300 mb-8 max-w-sm leading-relaxed">
                <strong className="text-white block mb-2">{isTurboActivated ? 'Aviso MAW Ativo:' : 'Aviso de Sobrecarga:'}</strong>
                {isTurboActivated ? 'Operação MAW está ativa. Certifique-se de que sua equipe está preparada para o recebimento dos insumos e execução de alta performance.' : 'A ativação do '}
                {!isTurboActivated && <span className="text-orange-400 font-semibold">Marketing Advanced Windowfilm</span>}
                {!isTurboActivated && ' injetará um volume massivo de requisições de clientes na sua unidade. Organize sua operação imediatamente para o choque de demanda. O domínio integral do seu território será acionado.'}
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={confirmTurbo}
                  className="w-full py-4 text-[11px] md:text-xs uppercase tracking-[0.2em] font-mono text-black bg-orange-500 hover:bg-orange-400 font-black rounded-none transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:-translate-y-0.5"
                >
                  {isTurboActivated ? 'ACESSAR BLACKSHOP' : 'ATIVAR MAW (IR PARA BLACKSHOP)'}
                </button>
                <button 
                  onClick={() => setShowTurboConfirm(false)}
                  className="w-full py-3 text-[10px] uppercase tracking-widest font-mono text-zinc-500 hover:text-zinc-300 border border-[#444746]/50 rounded-none hover:bg-white/5 transition-all"
                >
                  Manter Passo Padrão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWeatherModal && (
          <div className="fixed inset-0 z-[110] bg-[#131314]/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#131314] border border-[#444746]/80 w-full max-w-4xl rounded-none flex flex-col max-h-[90vh] shadow-2xl relative overflow-hidden"
            >
              {/* Fluent Glow effect */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-none blur-3xl pointer-events-none -mr-32 -mt-32"></div>

              {/* Modals Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#444746]/60 shrink-0 z-10 bg-[#131314]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1e1f20] border border-[#444746]/60 rounded-none flex items-center justify-center text-yellow-500">
                    <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: '30s' }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold uppercase tracking-widest text-white flex items-center gap-1.5 font-mono">
                      WINF METEO-OS™ <span className="text-[9px] font-normal text-zinc-500 font-sans tracking-normal">// Telemetria Territorial</span>
                    </h2>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">WINF Central Intelligence Meteorology • v5.03</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowWeatherModal(false);
                    setFeedbackMsg(null);
                  }} 
                  className="text-zinc-400 hover:text-white p-2 bg-[#1e1f20] rounded-none border border-[#444746] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 z-10">
                
                {/* Territory Tabs Switcher */}
                <div className="bg-[#131314]/80 p-2 rounded-none border border-zinc-805/50">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 px-2">Trocar Regional de Análise</span>
                  <div className="flex flex-wrap gap-1">
                    {allCities.map(city => {
                      const isSelected = weatherCity === city;
                      const active = localStorage.getItem(`winf_weather_station_${city}`) !== 'false';
                      return (
                        <button
                          key={city}
                          onClick={() => {
                            setWeatherCity(city);
                            setFeedbackMsg(null);
                          }}
                          className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-none transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-[#1e1f20] text-zinc-300 font-bold border border-[#444746]' 
                              : 'bg-[#131314]/40 text-zinc-500 hover:text-zinc-900 hover:bg-[#131314]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-none ${active ? 'bg-white' : 'bg-red-500'}`} />
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Toast */}
                {feedbackMsg && (
                  <div className="bg-white/15 border border-[#444746] text-zinc-300 font-bold p-4 rounded-none text-xs flex justify-between items-center animate-slide-up">
                    <span className="font-medium tracking-wide">{feedbackMsg}</span>
                    <button onClick={() => setFeedbackMsg(null)} className="text-zinc-300 font-bold hover:text-zinc-900 font-bold uppercase text-[9px] tracking-widest font-mono">Fechar</button>
                  </div>
                )}

                {/* Station Status Warning */}
                {!isCityStationActive && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">Sensores de Clima Desconectados</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                        A telemetria climática está desativada no território de {weatherCity}. Ative-a para restabelecer os feeds de Urgência de Radiação Solar.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.setItem(`winf_weather_station_${weatherCity}`, 'true');
                        setForceUpdate(p => p + 1);
                        setFeedbackMsg(`☀️ Estação climática para regional ${weatherCity} reativada com sucesso!`);
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-zinc-900 font-bold text-[10px] uppercase tracking-widest rounded-none transition-all shrink-0"
                    >
                      Ativar Estação
                    </button>
                  </div>
                )}

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Gau Dials & Telemetry */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="bg-[#131314] rounded-none border border-[#444746]/60 p-6 space-y-6 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Leitura Atual OS</span>
                          <h3 className="text-3xl font-mono tracking-tighter text-white mt-1">
                            {liveWeatherData.temp}°<span className="text-zinc-400 text-lg">C</span>
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-zinc-300 font-bold bg-white/10 border border-[#444746] px-2 py-0.5 rounded-none tracking-widest uppercase inline-block">
                            FEED ESTÁVEL
                          </span>
                          <p className="text-xs font-semibold text-zinc-200 uppercase mt-2 flex items-center gap-1 justify-end">
                            {liveWeatherData.condition === 'Sunny' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Cloud className="w-4 h-4 text-zinc-500" />}
                            {liveWeatherData.conditionName}
                          </p>
                        </div>
                      </div>

                      {/* UV / Solar Radiation Gauges */}
                      <div className="space-y-4 pt-4 border-t border-zinc-200 text-left">
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Índice de Radiação UV</span>
                            <span className={`font-mono font-bold ${liveWeatherData.uvIndex >= 8 ? 'text-red-500' : 'text-yellow-500'}`}>
                              NÍVEL {liveWeatherData.uvIndex} ({liveWeatherData.uvIndex >= 8 ? 'EXTREMO' : 'MODERADO'})
                            </span>
                          </div>
                          <div className="h-2 w-full bg-zinc-100 rounded-none overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${liveWeatherData.uvIndex >= 8 ? 'bg-gradient-to-r from-yellow-500 to-red-500' : 'bg-yellow-500'}`} 
                              style={{ width: `${(liveWeatherData.uvIndex / 12) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Exposição a Raios Infravermelhos (Infrared Heat)</span>
                            <span className="font-mono font-bold text-zinc-300 font-bold">{liveWeatherData.irIndex}</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-100 rounded-none overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-1000" 
                              style={{ width: liveWeatherData.irIndex }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Meteorological Details Cards */}
                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-left">
                        <div className="p-3 bg-[#131314]/50 border border-[#444746]/40 rounded-none flex items-center gap-3">
                          <Wind className="w-4 h-4 text-zinc-500" />
                          <div>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Ventos Máximos</span>
                            <span className="font-mono text-white text-sm font-semibold">{liveWeatherData.windSpeed}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/[0.02] border border-zinc-200 rounded-none flex items-center gap-3">
                          <Droplets className="w-4 h-4 text-zinc-500" />
                          <div>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Umidade Ar</span>
                            <span className="font-mono text-zinc-900 text-sm font-bold">{liveWeatherData.relativeHumidity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Solar Film Recommendation panel */}
                    <div className="bg-[#131314] border border-[#444746]/60 rounded-none p-6 text-left relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <Thermometer className="w-4 h-4 text-zinc-300 font-bold" />
                        <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-300 font-bold">Análise Térmica & Película Indicada</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{liveWeatherData.thermalAdvice}</p>

                        <div className="p-4 bg-[#131314] border border-[#444746]/60 rounded-none flex items-center justify-between">
                          <div>
                            <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">WINF Smart Film Suggestion</p>
                            <h4 className="text-sm font-bold text-zinc-900 mt-1">{liveWeatherData.recommendedProduct.name}</h4>
                            <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">{liveWeatherData.recommendedProduct.benefit}</p>
                          </div>
                          <span className="px-3 py-1.5 bg-white/10 border border-[#444746] rounded-none text-[9px] font-bold text-zinc-300 font-bold font-mono uppercase shrink-0">
                            Foco de Venda
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 7-Day & Sales Trigger */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* WINF METEO-OS™ 7-Day beautiful vertical table with bars */}
                    <div className="bg-[#131314] rounded-none border border-[#444746]/60 p-6 text-left">
                      <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-500 mb-4 px-1">Previsão Semanal de Dominação</h4>
                      
                      <div className="space-y-3">
                        {liveWeatherData.weekly.map((d, index) => (
                          <div key={index} className="flex items-center justify-between text-xs hover:bg-white/[0.02] p-2 rounded-none transition-colors">
                            <span className="w-16 font-medium text-zinc-300">{d.day}</span>
                            <div className="w-32 flex items-center gap-1.5">
                              {d.icon === 'sun' ? <Sun className="w-4 h-4 text-yellow-400 shrink-0" /> : d.icon === 'cloud-sun' ? <CloudSun className="w-4 h-4 text-zinc-500 shrink-0" /> : d.icon === 'cloud-rain' ? <CloudRain className="w-4 h-4 text-blue-400 shrink-0" /> : <Cloud className="w-4 h-4 text-zinc-500 shrink-0" />}
                              <span className="text-zinc-500 text-[10px] truncate">{d.condition}</span>
                            </div>
                            
                            {/* Horizontal Range Slider representation matching MS Clima */}
                            <div className="flex-1 max-w-[120px] mx-4 flex items-center gap-2">
                              <span className="text-[10px] text-zinc-500 font-mono">{d.low}°</span>
                              <div className="flex-1 h-1.5 bg-zinc-100 rounded-none relative overflow-hidden">
                                <div className="absolute left-[30%] right-[20%] h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-none"></div>
                              </div>
                              <span className="text-[10px] text-zinc-900 font-mono">{d.high}°</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTION CLIMATE TRIGGER CAMPAIGN */}
                    <div className="bg-[#131314] border border-[#444746] p-6 rounded-none text-left space-y-4 shadow-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-zinc-300 font-bold" />
                          <h4 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-zinc-300 font-bold">Winf Brain™ Clima marketing</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mt-2">
                          Quer aproveitar esta temperatura para vender? Dispare notificações do WINF AI avisando seus contatos/leads sobre o índice de calor UV alto. Essa ação tática gera senso de imediatismo para comprar películas solares!
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setFeedbackMsg(`🔥 Ação de marketing climática de Santos & SP disparada! Mensagens de conscientização UV enviadas para +24 leads estratégicos.`);
                        }}
                        disabled={!isCityStationActive}
                        className="w-full py-4 bg-white hover:bg-white/90 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                      >
                        <Zap className="w-4 h-4" /> Disparar Alerta de Radiação WINF
                      </button>
                    </div>
                  </div>
                  
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardWinf;
