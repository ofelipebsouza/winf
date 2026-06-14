import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search,
  Grid, 
  Star, 
  Coins, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  ChevronLeft,
  ChevronDown,
  Brain,
  CheckCircle2,
  Cpu,
  Target,
  Zap,
  Shield,
  Layers,
  Settings,
  Terminal,
  Globe,
  LayoutGrid,
  ShieldCheck,
  BookOpen,
  Database,
  Building2,
  MessageSquare,
  Package,
  GraduationCap,
  ShoppingBag,
  CalendarDays,
  FileSpreadsheet,
  Clock,
  Users
} from 'lucide-react';
import { ViewState } from '../types';
import { useWinf } from '../contexts/WinfContext';
import { getAllModules, MODULES_CONFIG } from '../config/modules';
import AgentAutomationsEngine from './AgentAutomationsEngine';
import FeedbackModal from './FeedbackModal';
import { WinfLogo } from './WinfLogo';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useCallback } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onBack?: () => void;
  user: any;
  onLogout: () => void;
  notification: any;
  onCloseNotification: () => void;
}

const getLevelInfo = (xp: number) => {
  if (xp <= 1000) {
    return { current: 'Iniciante', next: 'Bronze', min: 0, max: 1000, pct: (xp / 1000) * 100 };
  } else if (xp <= 2500) {
    return { current: 'Bronze', next: 'Prata', min: 1000, max: 2500, pct: ((xp - 1000) / 1500) * 100 };
  } else if (xp <= 5000) {
    return { current: 'Prata', next: 'Ouro', min: 2500, max: 5000, pct: ((xp - 2500) / 2500) * 100 };
  } else if (xp <= 8500) {
    return { current: 'Ouro', next: 'Diamante', min: 5000, max: 8500, pct: ((xp - 5000) / 3500) * 100 };
  } else if (xp <= 13000) {
    return { current: 'Diamante', next: 'Elite', min: 8500, max: 13000, pct: ((xp - 8500) / 4500) * 100 };
  } else if (xp <= 20000) {
    return { current: 'Elite', next: 'Lendário', min: 13000, max: 20000, pct: ((xp - 13000) / 7000) * 100 };
  } else {
    return { current: 'Lendário', next: 'Nível Máximo', min: 20000, max: 20000, pct: 100 };
  }
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onChangeView, 
  onBack,
  user, 
  onLogout, 
  notification, 
  onCloseNotification 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeSphere, setActiveSphere] = useState<'OPERATIONAL' | 'INTELLIGENCE' | 'ADMIN' | 'ARCHITECT'>('OPERATIONAL');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const { 
    agentInsights = [], 
    markInsightAsRead, 
    favoriteModules = [], 
    effectiveRole, 
    setEffectiveRole, 
    isOnline,
    leads = [],
    quotes = [],
    installations = [],
    stockItems = [],
    activeChats = [],
    triggerNotification,
    loginAsPrototype
  } = useWinf();

  const currentRole = effectiveRole || user?.role || 'Guest';
  const isAdmin = currentRole.toLowerCase() === 'admin';
  const isLicenciado = currentRole.toLowerCase() === 'licenciado';
  const isArchitect = currentRole.toLowerCase() === 'architect' || currentRole.toLowerCase() === 'arquiteto';
  
  // Real Admin check for the preview toggle
  const isRealAdmin = user?.role?.toLowerCase() === 'admin';

  const allModules = getAllModules();
  const favoriteItems = allModules.filter(m => favoriteModules?.includes(m.id) || false);

  const unreadInsights = agentInsights?.filter(i => !i.is_read) || [];

  useEffect(() => {
    if (notification && notification.show) {
      const timer = setTimeout(onCloseNotification, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onCloseNotification]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onChangeView(ViewState.SEARCH);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChangeView]);

  const getSidebarGroups = useCallback(() => {
    const groups = [];

    if (isArchitect) {
      groups.push({
        id: 'PLATAFORMA',
        label: 'Plataforma',
        items: [
          { id: ViewState.HUB_ARCHITECT, label: 'Hub do Arquiteto', icon: Target },
          { id: ViewState.MODULE_ARCHITECTURAL, label: 'WINF Select™ Pro', icon: Layers },
          { id: ViewState.PRODUCTS_CATALOG, label: 'Catálogo Digital', icon: Star },
        ]
      });
      return groups; // Restricted for architects
    }

    // PLATAFORMA
    groups.push({
      id: 'PLATAFORMA',
      label: 'Plataforma',
      items: [
        { id: ViewState.DASHBOARD_WINF, label: 'Painel Central', icon: LayoutDashboard },
        { id: ViewState.MODULES, label: 'Central de Aplicativos', icon: Grid },
      ]
    });

    // OS SUITE (OPERAÇÕES)
    groups.push({
      id: 'OPERACOES',
      label: 'Operações',
      items: [
        { id: ViewState.MODULE_CAPTURE, label: 'Radar', icon: Target },
        { id: ViewState.MODULE_CUSTOMER_REGISTRATION, label: 'Clientes', icon: Users },
        { id: ViewState.MODULE_QUOTES, label: 'Orçamentos', icon: FileSpreadsheet },
        { id: ViewState.MODULE_OS_SUITE, label: 'OS Industrial', icon: Clock },
      ]
    });

    // PARCEIROS (WINF PARTNERS)
    groups.push({
      id: 'PARCEIROS',
      label: 'WINF Partners',
      items: [
        { id: ViewState.LANDING_PARCERIA, label: 'Portal de Expansão', icon: Building2 },
        { id: ViewState.MODULE_ACADEMY, label: 'WINF Academy', icon: GraduationCap },
        { id: ViewState.MODULE_BLACKSHOP, label: 'Blackshop', icon: ShoppingBag },
      ]
    });

    // ADMIN DIRECT ACCESS
    if (isAdmin) {
      groups.push({
        id: 'ADMIN',
        label: 'Admin',
        items: [
          { id: ViewState.ADMIN_PANEL, label: 'Gestão de Licenciados', icon: Shield },
        ]
      });
    }

    return groups;
  }, [isAdmin, isArchitect, isLicenciado]);

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#131314] text-white flex overflow-hidden selection:bg-white/30">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#131314]/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#131314] border-r border-[#444746] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo Area */}
        <div className="h-20 flex flex-col justify-center px-6 border-b border-[#444746] bg-[#131314]/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-none pointer-events-none"></div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-white/10 flex items-center justify-center border border-[#444746]">
                <WinfLogo className="text-sm text-white" />
              </div>
            </div>
            <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase flex items-center gap-2">
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4 pb-6 px-4 space-y-6 scrollbar-hide">
          {(() => {
            const getZeigarnikIndicator = (view: ViewState) => {
              switch (view) {
                case ViewState.DASHBOARD_WINF:
                  return { 
                    text: 'Evolução Global: 72%', 
                    type: 'progress', 
                    pct: 72, 
                    color: 'text-zinc-400' 
                  };
                case ViewState.MODULE_CAPTURE: {
                  const pendingCount = (leads && Array.isArray(leads)) ? leads.filter(l => l.status === 'Novo' || l.status === 'Pendente').length : 0;
                  return { 
                    text: pendingCount > 0 ? `${pendingCount} ações pendentes` : 'Tudo resolvido', 
                    type: 'badge', 
                    count: pendingCount, 
                    color: pendingCount > 0 ? 'text-amber-400 font-bold' : 'text-zinc-500' 
                  };
                }
                case ViewState.MODULE_CUSTOMER_REGISTRATION:
                  return { 
                    text: 'Perfis 90% estruturados', 
                    type: 'text', 
                    color: 'text-zinc-500' 
                  };
                case ViewState.MODULE_QUOTES: {
                  const pendingQ = (quotes && Array.isArray(quotes)) ? quotes.filter(q => q.status === 'Pendente' || q.status === 'Aberto').length : 0;
                  return { 
                    text: pendingQ > 0 ? `${pendingQ} propostas em aberto` : 'Nenhum orçamento pendente', 
                    type: 'badge', 
                    count: pendingQ, 
                    color: pendingQ > 0 ? 'text-zinc-300 font-bold' : 'text-zinc-500' 
                  };
                }
                case ViewState.MODULE_OS_SUITE: {
                  const pendingInst = (installations && Array.isArray(installations)) ? installations.filter(i => i.status === 'pending' || i.status === 'in_progress').length : 0;
                  return { 
                    text: pendingInst > 0 ? `${pendingInst} obras agendadas` : 'Agenda em dia', 
                    type: 'badge', 
                    count: pendingInst, 
                    color: pendingInst > 0 ? 'text-amber-500 font-semibold' : 'text-zinc-500' 
                  };
                }
                case ViewState.WARRANTY:
                  return { 
                    text: 'Garantias: 95% ativas', 
                    type: 'text', 
                    color: 'text-zinc-400' 
                  };
                case ViewState.MODULE_SYSTEM_MANUAL:
                  return { 
                    text: '50% do Manual Absorvido', 
                    type: 'text', 
                    color: 'text-zinc-500' 
                  };
                case ViewState.MODULE_STOCK: {
                  const lowStock = (stockItems && Array.isArray(stockItems)) ? stockItems.filter(s => s.remaining_meters < 10).length : 2;
                  return { 
                    text: lowStock > 0 ? `${lowStock} alertas de estoque` : 'Bobinas seguras', 
                    type: 'badge', 
                    count: lowStock, 
                    color: lowStock > 0 ? 'text-red-400 font-bold' : 'text-zinc-400' 
                  };
                }
                case ViewState.MODULE_FINANCIAL:
                  return { 
                    text: 'Fluxo: 72% da meta', 
                    type: 'text', 
                    color: 'text-amber-400' 
                  };
                case ViewState.MODULE_ACADEMY:
                  return { 
                    text: 'Treinamento em curso (33%)', 
                    type: 'text', 
                    color: 'text-zinc-300 font-bold' 
                  };
                case ViewState.MODULE_BLACKSHOP:
                  return { 
                    text: 'Upgrade de Nível disp.', 
                    type: 'text', 
                    color: 'text-amber-400 font-bold animate-pulse' 
                  };
                case ViewState.MODULE_WINF_CHAIN:
                  return { 
                    text: 'ARR: Lastro verificado', 
                    type: 'text', 
                    color: 'text-zinc-500' 
                  };
                case ViewState.GEO_STRATEGY:
                  return { 
                    text: 'Dominação: 28%', 
                    type: 'text', 
                    color: 'text-blue-400 font-medium' 
                  };
                case ViewState.MODULE_WINF_BRAIN: {
                  const unreadCount = (agentInsights && Array.isArray(agentInsights)) ? agentInsights.filter(i => !i.is_read).length : 0;
                  return { 
                    text: unreadCount > 0 ? `${unreadCount} insights por ler` : 'IA operacional', 
                    type: 'badge', 
                    count: unreadCount, 
                    color: unreadCount > 0 ? 'text-zinc-300 font-bold' : 'text-zinc-500' 
                  };
                }
                case ViewState.MODULE_RAY: {
                  const pendingChats = (activeChats && Array.isArray(activeChats)) ? activeChats.filter(c => c.status === 'waiting' || c.status === 'bot_handling').length : 3;
                  return { 
                    text: pendingChats > 0 ? `${pendingChats} conversas em triagem` : 'Atendimento zerado', 
                    type: 'badge', 
                    count: pendingChats, 
                    color: pendingChats > 0 ? 'text-cyan-400 font-medium' : 'text-zinc-500' 
                  };
                }
                case ViewState.MODULE_ARSENAL:
                  return { 
                    text: 'Campanhas: 3/5 ativas', 
                    type: 'text', 
                    color: 'text-zinc-500' 
                  };
                default:
                  return null;
              }
            };

            return getSidebarGroups().map((group) => (
              <div key={group.id} className="space-y-1.5">
                <h3 className="px-2 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-2 pl-4 flex items-center gap-2">
                  {group.label}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = currentView === item.id;
                    const indicator = getZeigarnikIndicator(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center px-3.5 py-2.5 rounded-none text-xs font-medium transition-all group relative overflow-hidden ${
                          isActive 
                            ? 'bg-white/10 text-white' 
                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="nav-glow"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-white rounded-none"
                          />
                        )}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                        )}
                        <div className="flex items-center gap-3 w-full">
                          <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'} />
                          <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
                          {indicator?.type === 'badge' && indicator.count > 0 && (
                            <span className="bg-amber-550 text-[9px] font-mono leading-none rounded-none px-1.5 py-0.5 text-black font-bold">
                              {indicator.count}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ));
          })()}

          {/* Aplicativos Section */}
          <div className="pt-4 mt-4 border-t border-[#444746] space-y-1.5">
            <h3 className="px-2 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-2 pl-4 flex items-center gap-2">
              <Star size={10} className="text-zinc-500" /> Aplicativos
            </h3>
            <div className="space-y-0.5">
              {Array.from(new Set([...allModules.filter(m => m.isBasic || favoriteModules?.includes(m.id))])).map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleNavClick(module.viewState)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-medium transition-all group ${
                    currentView === module.viewState 
                      ? 'bg-white/10 text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <module.icon size={16} strokeWidth={1.5} className={currentView === module.viewState ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'} />
                  <span className="truncate">{module.title}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* User Area - Interactive & Collapsible */}
        <div className="border-t border-[#444746] bg-[#131314]/40 mt-auto flex flex-col">
          <div 
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-3 p-4 select-none cursor-pointer hover:bg-white/[0.02] transition-colors group"
            id="sidebar-profile-trigger"
          >
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-none bg-gradient-to-tr from-[#12131A] to-[#1E202B] border border-[#444746] text-white font-mono text-sm font-semibold shadow-md group-hover:border-[#444746] transition-all shrink-0"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-none" />
              ) : (
                user?.name?.charAt(0) || 'W'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight group-hover:translate-x-0.5 transition-transform duration-200">
                {user?.name || 'Membro WINF'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-none bg-zinc-500 animate-pulse"></span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 font-bold group-hover:text-zinc-400 transition-colors">
                  {currentRole}
                </span>
              </div>
            </div>
            <ChevronDown size={14} className={`text-zinc-500 group-hover:text-white transition-transform duration-200 shrink-0 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {isProfileDropdownOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-[#444746] bg-[#131314]/40"
                id="sidebar-profile-expanded-panel"
              >
                <div className="p-4 pt-1 flex flex-col gap-3 text-xs">
                  
                  {/* Rank Progress */}
                  <div className="bg-[#131314]/50 border border-[#444746] rounded-none p-3 mt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Progresso W-Class</p>
                      <span className="text-[9px] font-mono text-white/80 font-bold uppercase tracking-widest">
                        {user?.w_rank_level || 'Elite'}
                      </span>
                    </div>
                    {(() => {
                      const xp = user?.w_rank_xp || 2450;
                      const levelInfo = getLevelInfo(xp);
                      return (
                        <div>
                          <div className="w-full bg-zinc-950 rounded-none h-1 overflow-hidden border border-[#444746]">
                            <div 
                              className="bg-gradient-to-r from-zinc-500 to-zinc-300 h-full rounded-none transition-all duration-500"
                              style={{ width: `${levelInfo.pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-2 font-mono text-[8.5px] text-zinc-500 leading-none">
                            <span>Lvl {levelInfo.current} (XP: {xp})</span>
                            <span>Próx: Lvl {levelInfo.next}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Menu Options */}
                  <div className="flex flex-col gap-0.5 mt-1">
                    {user?.id?.startsWith('proto-') && (
                      <>
                        <button 
                          onClick={() => { loginAsPrototype('Admin'); setIsProfileDropdownOpen(false); }}
                          className="flex items-center gap-3 w-full p-2 rounded-none hover:bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-400 transition-all text-left group border border-dashed border-emerald-500/20 mb-1"
                        >
                          <ShieldCheck size={14} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                          <span className="font-semibold text-[10px] uppercase font-mono tracking-widest">Testar como Admin</span>
                        </button>
                        <button 
                          onClick={() => { loginAsPrototype('Licenciado'); setIsProfileDropdownOpen(false); }}
                          className="flex items-center gap-3 w-full p-2 rounded-none hover:bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-400 transition-all text-left group border border-dashed border-emerald-500/20 mb-1"
                        >
                          <Users size={14} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                          <span className="font-semibold text-[10px] uppercase font-mono tracking-widest">Testar como Licenciado</span>
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleNavClick(ViewState.PROFILE)}
                      className="flex items-center gap-3 w-full p-2 rounded-none hover:bg-white/5 text-zinc-400 hover:text-white transition-all text-left group"
                    >
                      <User size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                      <span className="font-semibold text-xs">Meu Perfil Profissional</span>
                    </button>

                    <button 
                      onClick={() => handleNavClick(ViewState.MODULE_WINF_BRAIN)}
                      className="flex items-center gap-3 w-full p-2 rounded-none hover:bg-white/5 text-zinc-400 hover:text-white transition-all text-left group"
                    >
                      <Brain size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                      <span className="font-semibold text-xs">W-NO Central AI</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsFeedbackOpen(true);
                      }}
                      className="flex items-center gap-3 w-full p-2 rounded-none hover:bg-white/5 text-zinc-400 hover:text-white transition-all text-left group"
                    >
                      <MessageSquare size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                      <span className="font-semibold text-xs">Enviar Feedback</span>
                    </button>
                  </div>

                  {/* Role Simulator Switcher for Admins */}
                  {isRealAdmin && (
                    <div className="pt-2 border-t border-[#444746] flex flex-col gap-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
                        <ShieldCheck size={11} className="text-zinc-550" />
                        <span>Simulador de Visão</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[8px] font-mono uppercase font-bold">
                        {['admin', 'licenciado', 'arquiteto', 'vendedor'].map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              setEffectiveRole(role);
                              if (triggerNotification) {
                                triggerNotification({
                                  title: 'Simulação Ativa',
                                  message: `Visão de permissão alterada para <strong>${role.toUpperCase()}</strong>.`,
                                  type: 'success',
                                  show: true
                                });
                              }
                            }}
                            className={`py-1 text-center rounded-none border transition-all ${
                              currentRole.toLowerCase() === role.toLowerCase()
                                ? 'bg-white text-zinc-950 border-white font-bold'
                                : 'bg-[#131314]/40 text-zinc-400 border-[#444746] hover:border-[#444746] hover:text-white'
                            }`}
                          >
                            {role === 'admin' ? '🛡️ ADM' : role === 'licenciado' ? '🔑 FRA' : role === 'arquiteto' ? '📐 ARC' : '💼 SAL'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom info & session actions */}
                  <div className="pt-2.5 border-t border-[#444746] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-none bg-zinc-500 animate-pulse"></span>
                      <span>ONLINE</span>
                    </div>
                    
                    <button 
                      onClick={onLogout}
                      className="flex items-center gap-1 text-zinc-500 hover:text-white font-bold transition-colors uppercase font-mono tracking-widest text-[9px]"
                    >
                      <LogOut size={11} className="text-zinc-500" />
                      <span>Sair</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 lg:h-20 bg-[#131314]/80 backdrop-blur-xl border-b border-[#444746] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              {currentView !== ViewState.DASHBOARD_WINF && currentView !== ViewState.DASHBOARD_ARCHITECT && (
                <button 
                  onClick={() => onBack ? onBack() : onChangeView(isArchitect ? ViewState.DASHBOARD_ARCHITECT : ViewState.DASHBOARD_WINF)}
                  className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-zinc-300 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 border border-[#444746] hover:border-[#444746]"
                >
                  <ChevronLeft size={12} /> Voltar
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Access Client Button */}
            <button
              onClick={() => handleNavClick(ViewState.MODULE_CUSTOMER_REGISTRATION)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-white/5 border border-[#444746] hover:bg-white/10 text-white/60 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest font-bold"
              title="Acesso Rápido - Cadastro de Clientes"
            >
              <Users size={14} className="text-zinc-500 shrink-0 hidden sm:block" />
              <span>Clientes</span>
            </button>
            <button
              onClick={() => handleNavClick(ViewState.ADMIN_PANEL)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/35 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all font-mono text-[10px] uppercase tracking-widest font-bold"
              title="Acesso Rápido - Gestão de Licenciados Administrador"
            >
              <ShieldCheck size={14} className="text-amber-500 shrink-0" />
              <span>🛠️ Atalho Admin</span>
            </button>

            {/* Role Switcher (Always available during final development for quick tests) */}
            <div className="hidden lg:flex items-center gap-2 border-r border-[#444746] pr-4 mr-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Modo:</span>
              <select 
                value={effectiveRole || 'Admin'}
                onChange={(e) => setEffectiveRole(e.target.value as any)}
                className="bg-[#131314] border border-[#444746] text-[10px] font-mono uppercase tracking-wider px-2 py-1 outline-none text-white focus:border-white/30 cursor-pointer"
              >
                <option value="Admin">System Admin</option>
                <option value="Licenciado">Licenciado</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            {/* Search Toggle */}
            <button 
              onClick={() => onChangeView(ViewState.SEARCH)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#131314] border border-[#444746] rounded-none text-white/40 hover:text-white transition-all group"
              title="Busca Global (Ctrl+K)"
            >
              <Search size={14} className="group-hover:text-white transition-colors" />
              <span className="text-[10px] font-mono uppercase tracking-wider hidden md:block">Buscar...</span>
              <kbd className="hidden md:flex h-5 items-center gap-1 border border-[#444746] bg-[#18181b] px-1.5 font-mono text-[10px] opacity-100">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Feedback Button */}
            <button
               onClick={() => setIsFeedbackOpen(true)}
               className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-[#444746] rounded-none hover:bg-white/10 text-white/60 hover:text-white transition-colors"
               title="Enviar Feedback desta ferramenta"
            >
               <MessageSquare size={14} />
               <span className="text-[10px] font-mono uppercase tracking-wider">Feedback (Labs)</span>
            </button>


            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsInsightsOpen(!isInsightsOpen)}
                className="relative p-2 text-white/40 hover:text-white transition-colors rounded-none hover:bg-[#131314]"
              >
                <Brain size={20} className={unreadInsights.length > 0 ? "text-purple-400 animate-pulse" : ""} />
                {unreadInsights.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-none"></span>
                )}
              </button>

              <AnimatePresence>
                {isInsightsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-[#444746] rounded-none shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-[#444746] bg-white/5 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                        <Brain size={16} className="text-purple-400" />
                        WINF AI Insights
                      </h3>
                      <span className="text-xs font-mono text-white/40">{unreadInsights.length} novos</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {agentInsights && agentInsights.length > 0 ? (
                        agentInsights.map(insight => (
                          <div key={insight.id} className={`p-4 border-b border-[#444746] hover:bg-white/5 transition-colors ${!insight.is_read ? 'bg-purple-500/5' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xs font-bold text-white">{insight.title}</h4>
                              {!insight.is_read && (
                                <button 
                                  onClick={() => markInsightAsRead(insight.id)}
                                  className="text-white/40 hover:text-green-400 transition-colors"
                                  title="Marcar como lido"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">{insight.content}</p>
                            <span className="text-[10px] text-zinc-500 mt-2 block font-mono">
                              {new Date(insight.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-white/40 text-sm">
                          Nenhum insight gerado ainda.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-white/40 hover:text-white transition-colors rounded-none hover:bg-[#131314]">
              <Bell size={20} />
              {notification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-none animate-pulse"></span>
              )}
            </button>

            {/* Profile Greeting & Avatar - Moved completely into the sidebar per User Request */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
          {isAdmin && <AgentAutomationsEngine />}
          
          {/* Notification Toast */}
          {notification && notification.show && (
            <div className="fixed top-6 right-6 z-[9999] bg-[#131314] border border-winf-primary/30 shadow-[0_0_30px_rgba(var(--winf-primary-rgb),0.2)] rounded-none p-4 flex items-start gap-3 max-w-sm w-[calc(100vw-3rem)] md:w-auto animate-in slide-in-from-top-4">
              <div className="text-white mt-0.5">
                <Bell size={16} />
              </div>
              <div className="flex-1">
                {notification.title && <h4 className="text-sm font-bold text-white mb-1">{notification.title}</h4>}
                <p className="text-xs text-white/40" dangerouslySetInnerHTML={{ __html: notification.message }}></p>
              </div>
              <button onClick={onCloseNotification} className="text-white/40 hover:text-white p-2 -mr-2 -mt-2">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
          </div>
        </main>
      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        currentTool={(currentView || '').replace(/_/g, ' ')} 
      />
    </div>
  );
};

export default Layout;
