import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Shield, 
  ArrowLeft,
  Globe,
  TrendingUp,
  Fingerprint,
  X,
  MapPin,
  Layers,
  Sparkles,
  Check,
  AlertTriangle,
  Download,
  Search,
  FileText,
  Sliders,
  Settings,
  RefreshCw,
  SlidersHorizontal,
  MessageSquare,
  Award,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  Terminal,
  Activity,
  UserCheck,
  UserX,
  BadgeAlert,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWinf } from '../contexts/WinfContext';
import { UniversoDarkMaps } from './UniversoDarkMaps';
import { AdminTerritories } from './AdminTerritories';
import { db } from '../lib/firebase';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { User, Transaction, SocialPost, WarrantyRegistration as Warranty } from '../types';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { 
    members, 
    fetchMembers, 
    leads, 
    transactions, 
    updateUserRole, 
    triggerNotification, 
    socialPosts,
    warranties 
  } = useWinf();

  const [viewGlobalMap, setViewGlobalMap] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'reports' | 'territories' | 'settings'>('overview');
  
  // Local Copy of Members for instant state mutations and offline support
  const [localMembers, setLocalMembers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('All');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Moderation state
  const [moderationTab, setModerationTab] = useState<'social' | 'warranties' | 'reviews'>('social');
  const [pendingSocialPosts, setPendingSocialPosts] = useState<any[]>([
    {
      id: 'p_mod_1',
      author: 'João Silva (Campinas-SP)',
      title: 'Proteção Climática Perfeita',
      caption: 'Mais uma vitrine finalizada com a película Winf Select Active IR! Proteção absoluta contra calor e UV sem alterar a transparência do vidro.',
      platform: 'Instagram',
      created_at: '2026-06-10T09:30:00Z',
      image_mock: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400',
      status: 'pending'
    },
    {
      id: 'p_mod_2',
      author: 'Carlos Souza (Curitiba-PR)',
      title: 'Padrão Editorial Apple',
      caption: 'Acabamos de instalar a película no escritório de arquitetura parceiro. Alinhamento simétrico impecável.',
      platform: 'Facebook',
      created_at: '2026-06-10T08:15:00Z',
      image_mock: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=400',
      status: 'pending'
    }
  ]);

  const [pendingWarranties, setPendingWarranties] = useState<any[]>([
    {
      id: 'war_mod_1',
      unit: 'Santos Flagship',
      client: 'Residência Alphaville Bloco B',
      film_series: 'Invisible Pro Series 90',
      area_sqm: 45,
      installation_date: '2026-06-08',
      status: 'review_required',
      author: 'Tiago Winf'
    },
    {
      id: 'war_mod_2',
      unit: 'Sorocaba Studio',
      client: 'Dr. Roberto Mendes (Ferrari 812)',
      film_series: 'NeoShield Premium Clear',
      area_sqm: 12,
      installation_date: '2026-06-09',
      status: 'review_required',
      author: 'Eduardo Santos'
    }
  ]);

  const [pendingReviews, setPendingReviews] = useState<any[]>([
    {
      id: 'rev_mod_1',
      student: 'Reginaldo Flores (Instalador)',
      course_title: 'Fundamentos da Instalação Winf™',
      rating: 5,
      comment: 'As técnicas de espatulagem para eliminação de bolha reduziram nosso tempo de obra em quase 22 minutos por janela!',
      status: 'pending'
    },
    {
      id: 'rev_mod_2',
      student: 'Mariana Duarte (Arquiteta)',
      course_title: 'Design e Experiência de Luxo (Apple Philosophy)',
      rating: 5,
      comment: 'Muito esclarecedora a aula de etiqueta. O cliente de alto padrão valoriza muito a higiene e organização.',
      status: 'pending'
    }
  ]);

  // Global Config Parameters State
  const [sysConfig, setSysConfig] = useState({
    maintenanceMode: false,
    autoApproveLicensees: true,
    requireCnpj: true,
    welcomeMessage: 'Bem-vindo ao Córtex Central da Winf. Mantenha o padrão de excelência de um cirurgião em todos os seus atendimentos!',
    exchangeRateCoins: 10,
    apiGateway: 'https://api.cortex.winf.com/v2',
    tserMultiplier: 1.5,
    maxPendingLeadsRate: 5
  });

  // Reports state
  const [reportType, setReportType] = useState<'desempenho_regional' | 'academy_eng' | 'garantia_auditoria' | 'financeiro_faas'>('desempenho_regional');
  const [reportPeriod, setReportPeriod] = useState<'current_month' | 'last_quarter' | 'all_time'>('current_month');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedReportData, setGeneratedReportData] = useState<any | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Sync contextual members with local members state
  useEffect(() => {
    if (members && members.length > 0) {
      setLocalMembers(members);
    }
  }, [members]);

  // Derived Real Stats
  const totalRevenue = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : 0), 0);
  const activeUnitsCount = localMembers.filter(m => m.role === 'Licenciado' || m.role === 'ASSET_LIGHT').length;
  const globalLeadsCount = leads.length;
  
  const stats = [
    { label: 'RECEITA RECORRENTE (REAL)', value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'UNIDADES EM OPERAÇÃO', value: activeUnitsCount.toString(), icon: Globe, color: 'text-blue-500' },
    { label: 'LEADS DO CÓRTEX', value: globalLeadsCount.toString(), icon: Users, color: 'text-purple-500' },
    { label: 'SOLICITAÇÕES DE RETENÇÃO', value: `${pendingSocialPosts.length + pendingWarranties.length} ALERTA(S)`, icon: Layers, color: 'text-red-500' }
  ];

  const adminTabs = [
    { id: 'overview', label: 'Resumo Executivo', icon: Layers },
    { id: 'territories', label: 'Gestão de Territórios', icon: MapPin },
    { id: 'users', label: 'Parceiros & Perfis', icon: Users },
    { id: 'moderation', label: 'Moderação Hub', icon: MessageSquare },
    { id: 'reports', label: 'Centro de Relatórios', icon: FileText },
    { id: 'settings', label: 'Diretrizes do Sistema', icon: Shield }
  ];

  // User Actions Helpers
  const handleUpdateUsersRoleLocally = async (userId: string, newRole: any) => {
    setUpdatingUserId(userId);
    try {
      // Call context model update (which interacts with firebase or prototype state)
      await updateUserRole(userId, newRole);
      
      // Update local members state
      setLocalMembers(prev => prev.map(m => m.id === userId ? { ...m, role: newRole } : m));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
      }
      triggerNotification('Nível Promovido', `O cargo do usuário foi atualizado para ${newRole}.`);
    } catch (e: any) {
      triggerNotification('Erro ao Atualizar', e.message || 'Houve uma falha na atualização.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUpdateUserStatus = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    const updatedStatus = !currentStatus;
    try {
      if (!userId.startsWith('proto-')) {
        await updateDoc(doc(db, 'users', userId), { is_active: updatedStatus });
      }
      setLocalMembers(prev => prev.map(m => m.id === userId ? { ...m, is_active: updatedStatus } : m));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, is_active: updatedStatus } : null);
      }
      triggerNotification('Status Modificado', `O usuário está agora ${updatedStatus ? 'ATIVO' : 'SUSPENSO'} no sistema.`);
    } catch (e: any) {
      triggerNotification('Erro ao Atualizar', e.message || 'Falha ao sincronizar status.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleAdjustUserCoins = async (userId: string, coinsDiff: number) => {
    setUpdatingUserId(userId);
    try {
      const uEntity = localMembers.find(m => m.id === userId);
      if (!uEntity) return;
      const newCoins = Math.max(0, (uEntity.winfCoins || 0) + coinsDiff);
      
      if (!userId.startsWith('proto-')) {
        await updateDoc(doc(db, 'users', userId), { winfCoins: newCoins });
      }
      setLocalMembers(prev => prev.map(m => m.id === userId ? { ...m, winfCoins: newCoins } : m));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, winfCoins: newCoins } : null);
      }
      triggerNotification('Coins Balance Ajustado', `Nova carteira: ${newCoins} WinfCoins.`);
    } catch (e: any) {
      triggerNotification('Erro', e.message || 'Houve uma falha ao ajustar carteira.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleCustomFieldSave = async (userId: string, fields: Partial<User>) => {
    setUpdatingUserId(userId);
    try {
      if (!userId.startsWith('proto-')) {
        await updateDoc(doc(db, 'users', userId), fields);
      }
      setLocalMembers(prev => prev.map(m => m.id === userId ? { ...m, ...fields } : m));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, ...fields } : null);
      }
      triggerNotification('Dados Gravados', 'Parâmetros específicos do operador salvos no servidor Cortex.');
    } catch (e: any) {
      triggerNotification('Erro', e.message || 'Falha ao salvar especificações.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Moderation Logic
  const handleApproveSocialPost = (postId: string, title: string) => {
    setPendingSocialPosts(prev => prev.filter(p => p.id !== postId));
    triggerNotification('Postagem Aprovada', `A postagem "${title}" foi liberada para o feed público global.`);
  };

  const handleRejectSocialPost = (postId: string, title: string) => {
    setPendingSocialPosts(prev => prev.filter(p => p.id !== postId));
    triggerNotification('Postagem Rejeitada', `A postagem "${title}" foi recusada e enviada para revisão.`);
  };

  const handleApproveWarranty = (warrantyId: string, client: string) => {
    setPendingWarranties(prev => prev.filter(w => w.id !== warrantyId));
    triggerNotification('Garantia Homologada', `A garantia eletrônica do cliente "${client}" foi homologada.`);
  };

  const handleRejectWarranty = (warrantyId: string, client: string) => {
    setPendingWarranties(prev => prev.filter(w => w.id !== warrantyId));
    triggerNotification('Garantia Recusada', `O certificado para "${client}" foi recusado para readequação física.`);
  };

  const handleApproveReview = (reviewId: string) => {
    setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    triggerNotification('Pontuação Publicada', 'Feedback de treinamento publicado no fórum oficial.');
  };

  const handleDiscardReview = (reviewId: string) => {
    setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    triggerNotification('Review Arquivado', 'Avaliação arquivada pela administração.');
  };

  // Global Config Save
  const handleSaveSystemConfig = () => {
    triggerNotification('Sincronizando Sistema', 'Iniciando atualização de redundância nas 100 praças...');
    setTimeout(() => {
      triggerNotification('Sucesso', 'Configurações de infraestrutura WINF salvas com sucesso.');
    }, 1500);
  };

  // Report Generator Logic
  const handleTriggerReportGeneration = () => {
    setIsGeneratingReport(true);
    setGeneratedReportData(null);
    
    const steps = [
      'Estágio 1: Mapeando faturamento e volume transacional corporativo...',
      'Estágio 2: Coletando métricas geográficas do Córtex Central...',
      'Estágio 3: Indexando histórico acadêmico de parceiros e cursos ativos...',
      'Estágio 4: Avaliando taxa de retrabalho e retenção de garantias...',
      'Estágio 5: Compilando e gerando relatório criptografado...'
    ];

    let currentStepIdx = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setGenerationStep(steps[currentStepIdx]);
      } else {
        clearInterval(interval);
        
        // Finalize Mock Data compiled using actual values from local state
        const generatedData = {
          title: reportType === 'desempenho_regional' ? 'RELATÓRIO DE DESEMPENHO REGIONAL DA REDE' :
                 reportType === 'academy_eng' ? 'RELATÓRIO DE CAPACITAÇÃO E ACADEMY WINF' :
                 reportType === 'garantia_auditoria' ? 'AUDITORIA COMPLETA DE GARANTIAS E PARCEIROS' :
                 'CONSOLIDADO FINANCEIRO E ROI DE UNIDADES WINF OS',
          generatedAt: new Date().toLocaleString('pt-BR'),
          period: reportPeriod === 'current_month' ? 'Junho / 2026' :
                  reportPeriod === 'last_quarter' ? 'Último Trimestre (Q2-2026)' : 'Todo o Histórico',
          hash: 'WNF-AES-' + Math.random().toString(36).substring(3, 11).toUpperCase() + '-2026',
          metrics: {
            unidades_em_operacao: activeUnitsCount,
            total_faturamento: totalRevenue,
            leads_gerados: globalLeadsCount,
            eficiencia_sistema: '98.54% (Excelente)',
            garantias_emitidas: warranties?.length || 48,
            descarte_pelicula_reduzido: '340 metros lineares'
          }
        };
        
        setGeneratedReportData(generatedData);
        setIsGeneratingReport(false);
        triggerNotification('Relatório Compilado', 'Os resultados analíticos foram formatados e estão prontos.');
      }
    }, 900);
  };

  // Filtered lists for rendering
  const filteredUsers = localMembers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          (u.company && u.company.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
                          (u.address?.city && u.address.city.toLowerCase().includes(userSearchQuery.toLowerCase()));
    
    if (userRoleFilter === 'All') return matchesSearch;
    return matchesSearch && u.role.toLowerCase() === userRoleFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#131314] text-white relative">
      {/* Background Ambience styling */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[#101014] opacity-50 blur-[130px] rounded-none pointer-events-none z-0" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 z-10 bg-[#131314]/90 backdrop-blur-md px-6 md:px-8 py-5 border-b border-[#444746]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-none bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white border border-[#444746]"
            id="admin-back-btn"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-zinc-400" />
              <h1 className="text-xl md:text-2xl font-light uppercase tracking-tighter">
                CONTROLE <span className="font-bold text-white">CENTRAL</span> WINF OS
              </h1>
            </div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.25em] font-mono mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse"></span>
              Córtex Admin: Orquestração de Licenciados, Moderação de Feed e Relatórios Computados
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Navigation Tabs (Desktop Grid) */}
          <div className="hidden lg:flex bg-zinc-900 border border-[#444746] p-1 mr-4">
            {adminTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedUser(null);
                }}
                className={`flex items-center gap-2 px-4 py-1.5 text-[9px] uppercase font-bold tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setViewGlobalMap(true)} 
            className="text-[10px] font-mono tracking-widest text-[#cfcfcf] hover:text-white uppercase transition-colors border border-zinc-600/30 hover:border-zinc-500 px-4 py-2 bg-zinc-800/20 hover:bg-zinc-800/40"
            id="admin-global-map-btn"
          >
            Ver Mapa Geopolítico
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 px-6 md:px-8 py-8 w-full max-w-[1450px] mx-auto space-y-8 z-10">
        
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-[#444746]/30">
          {adminTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedUser(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-[9px] uppercase font-bold tracking-widest whitespace-nowrap border transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-black border-white' 
                  : 'bg-zinc-900 text-zinc-500 border-[#444746]'
              }`}
            >
              <tab.icon size={11} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Real-time Statistics Header */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-zinc-950 border border-[#444746] p-5 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                  <stat.icon size={11} className={stat.color} /> {stat.label}
                </span>
                <span className="text-[9px] font-mono text-zinc-600">CENTRAL</span>
              </div>
              <div className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main executive narrative */}
                <div className="lg:col-span-2 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-[#444746] p-8 flex flex-col justify-between gap-6 relative">
                  <div className="absolute top-5 right-5 text-emerald-500 flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    CÓRTEX ONLINE
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Visão Geral da Operação</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed max-w-xl">
                      Bem-vindo ao centro de comando WINF. Aqui você monitora a expansão territorial, a integridade da comunicação dos canais, a saúde financeira dos parceiros licenciados e a performance de todo o ecossistema global.
                    </p>
                    
                    <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-400 font-mono">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-[#444746]">
                        <UserCheck size={12} className="text-emerald-500" />
                        <span>Licenciados Ativos: {localMembers.filter(m => m.role === 'Licenciado').length}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-[#444746]">
                        <Activity size={12} className="text-blue-500" />
                        <span>Leads em Atendimento: {leads.filter(l => l.status === 'atendimento' || l.status === 'negocio').length}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-[#444746]">
                        <FileSpreadsheet size={12} className="text-purple-500" />
                        <span>Transações de Operação: {transactions.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-[#444746] pt-6">
                    <div className="p-4 bg-zinc-900/40 border border-[#444746]/50">
                      <div className="text-[9px] text-zinc-500 uppercase font-mono mb-1">Crescimento Mensal</div>
                      <div className="text-lg font-bold text-white">+14.2%</div>
                    </div>
                    <div className="p-4 bg-zinc-900/40 border border-[#444746]/50">
                      <div className="text-[9px] text-zinc-500 uppercase font-mono mb-1">Ticket Médio Geral</div>
                      <div className="text-lg font-bold text-white">R$ 9.2k</div>
                    </div>
                    <div className="p-4 bg-zinc-900/40 border border-[#444746]/50">
                      <div className="text-[9px] text-zinc-500 uppercase font-mono mb-1">Índice NPS (Cuidado)</div>
                      <div className="text-lg font-bold text-green-400">99.2/100</div>
                    </div>
                  </div>
                </div>

                {/* Right Quick Action Console */}
                <div className="bg-zinc-950 p-6 border border-[#444746] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 shrink-0 opacity-5 pointer-events-none">
                    <Sparkles size={180} className="text-white" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white border-b border-[#444746]/70 pb-3 flex items-center justify-between">
                      <span>Status de Expansão</span>
                      <Terminal size={12} className="text-zinc-500" />
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Atualmente operando em 12 estados simultâneos com 100% de automação de faturamento via Winf OS. Os dados de territorialidade estão homologados no servidor regional.
                    </p>
                    <div className="p-3 bg-zinc-900/80 border border-[#444746] rounded-none">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>Canal de Leads</span>
                        <span className="text-emerald-400">ONLINE</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-1.5">
                        <span>Sincronização de Rolamentos</span>
                        <span className="text-blue-400">100% OK</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('territories')}
                      className="w-full py-3 bg-zinc-900 border border-[#444746] hover:bg-zinc-800 text-zinc-300 font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-colors mt-2"
                    >
                      Inspecionar Territórios & DNS
                    </button>
                  </div>
                </div>
              </div>

              {/* Actionable Administration Alerts */}
              <div className="bg-zinc-950 border border-[#444746] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#444746] pb-3">
                  <div className="flex items-center gap-2">
                    <BadgeAlert size={14} className="text-amber-500 animate-bounce" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">Tarefas Operacionais Pendentes</h4>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">RESUMIDO DE TODAS AS PRAÇAS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/30 border border-[#444746] flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 uppercase tracking-wider">Posts Pendentes</span>
                      <p className="text-xs font-bold text-white mt-2">Existem {pendingSocialPosts.length} postagens esperando aprovação</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Postagens sugeridas para canais oficiais.</p>
                    </div>
                    <button onClick={() => { setActiveTab('moderation'); setModerationTab('social'); }} className="text-[9px] font-mono text-zinc-300 hover:text-white uppercase underline">Moderar</button>
                  </div>

                  <div className="p-4 bg-zinc-900/30 border border-[#444746] flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 uppercase tracking-wider">Auditoria de Certificados</span>
                      <p className="text-xs font-bold text-white mt-2">Faltam conferir {pendingWarranties.length} solicitações de garantia técnica</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Relatórios fotográficos de estanqueidade e cura d'água.</p>
                    </div>
                    <button onClick={() => { setActiveTab('moderation'); setModerationTab('warranties'); }} className="text-[9px] font-mono text-zinc-300 hover:text-white uppercase underline">Moderar</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: USER & LEAD MANAGEMENT (INTERACTIVE) */}
          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Users list panel */}
              <div className="lg:col-span-2 bg-zinc-950 border border-[#444746] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#444746] pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-zinc-400" />
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Parceiros, Leads & Operadores</h3>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Clique em um perfil para abrir o sub-painel de edição em tempo real</p>
                      </div>
                    </div>
                    
                    <span className="bg-[#131314] text-zinc-400 text-[10px] border border-[#444746] font-mono px-3 py-1 uppercase shrink-0">
                      {filteredUsers.length} Perfis Encontrados
                    </span>
                  </div>

                  {/* Filters and Search Bar */}
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="flex-1 relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Pesquisar por nome, empresa, e-mail ou cidade..." 
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-[#444746] text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
                      />
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                      {['All', 'Admin', 'Licenciado', 'Member', 'Arquiteto', 'Instalador'].map((role) => (
                        <button
                          key={role}
                          onClick={() => setUserRoleFilter(role)}
                          className={`text-[9px] font-mono px-3 py-1.5 uppercase border transition-colors ${
                            userRoleFilter === role 
                              ? 'bg-white text-black border-white font-bold' 
                              : 'bg-zinc-900 text-zinc-500 border-[#444746] hover:text-white'
                          }`}
                        >
                          {role === 'All' ? 'Todos' : role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Users List Grid */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[#444746] p-6">
                        <Users size={28} className="text-zinc-600 mx-auto mb-2" />
                        <p className="text-zinc-500 font-mono text-xs">Nenhum operador atende o filtro selecionado.</p>
                      </div>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelected = selectedUser?.id === u.id;
                        return (
                          <div 
                            key={u.id} 
                            onClick={() => setSelectedUser(u)}
                            className={`flex items-center justify-between p-3.5 bg-zinc-900/40 border cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-zinc-300 bg-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                : 'border-[#444746] hover:border-zinc-500 hover:bg-zinc-900/70'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-800 border border-[#444746] flex items-center justify-center font-mono text-xs text-zinc-300 font-bold uppercase rounded-none">
                                {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-bold uppercase text-white flex items-center gap-2">
                                  <span>{u.name}</span>
                                  {u.is_active === false && (
                                    <span className="text-[8px] font-mono bg-red-950 text-red-500 border border-red-900 px-1 py-0.2 uppercase">Suspenso</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-mono text-zinc-500 mt-1">
                                  <span>{u.email}</span>
                                  <span>•</span>
                                  {u.company ? (
                                    <span className="text-zinc-400">{u.company}</span>
                                  ) : (
                                    <span className="text-zinc-500">Sem Empresa</span>
                                  )}
                                  <span>•</span>
                                  <span className="text-zinc-400 flex items-center gap-0.5"><MapPin size={8} /> {u.address?.city || u.city || 'Operador Local'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono px-2 py-0.5 border border-[#444746] bg-[#131314] text-zinc-300 uppercase shrink-0">
                                {u.role}
                              </span>
                              
                              <span className="text-[9px] font-mono text-amber-500 px-1 py-0.5 bg-amber-500/5 hover:bg-amber-500/10 shrink-0">
                                🟡 {(u.winfCoins || 0).toLocaleString()} Coins
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* User edit details drawer */}
              <div className="bg-zinc-950 border border-[#444746] p-6 flex flex-col justify-between">
                {selectedUser ? (
                  <div className="space-y-6">
                    <div className="border-b border-[#444746] pb-4 flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono bg-[#111112] text-zinc-500 border border-[#444746] px-2 py-0.5 uppercase tracking-wider block w-fit">ADMIN_EDIT_MODE</span>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mt-2">Painel do Operador</h3>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">ID: {selectedUser.id}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedUser(null)}
                        className="text-zinc-500 hover:text-white p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* User Mini Avatar/Identities */}
                    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-[#444746]">
                      <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center font-mono text-white text-sm font-bold">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase text-white">{selectedUser.name}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{selectedUser.email}</div>
                      </div>
                    </div>

                    {/* EDITABLE FIELDS */}
                    <div className="space-y-4">
                      
                      {/* Active Status Toggle */}
                      <div className="flex items-center justify-between bg-[#131415] border border-[#444746] p-3 text-xs">
                        <span className="text-zinc-300">Status Operacional:</span>
                        <button
                          onClick={() => handleUpdateUserStatus(selectedUser.id, selectedUser.is_active !== false)}
                          className={`text-[9px] font-mono px-3 py-1 uppercase font-bold transition-all ${
                            selectedUser.is_active !== false 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {selectedUser.is_active !== false ? '● ATIVO / HOMOLOGADO' : '● EXPULSO / SUSPENSO'}
                        </button>
                      </div>

                      {/* Promove/Demote standard Role */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">Cargo Legal (Acesso OS)</label>
                        <select
                          value={selectedUser.role}
                          onChange={(e) => handleUpdateUsersRoleLocally(selectedUser.id, e.target.value)}
                          className="w-full bg-zinc-900 border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Licenciado">Licenciado</option>
                          <option value="Member">Member</option>
                          <option value="Instalador">Instalador</option>
                          <option value="Arquiteto">Arquiteto</option>
                          <option value="ASSET_LIGHT">Asset Light</option>
                        </select>
                      </div>

                      {/* Coins awarder */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 block pb-1">Diretrizes de WinfCoins ({selectedUser.winfCoins || 0})</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleAdjustUserCoins(selectedUser.id, 500)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-[#444746] font-mono py-1.5 text-[9px] uppercase tracking-wider"
                          >
                            +500 Coins (Bônus)
                          </button>
                          <button
                            onClick={() => handleAdjustUserCoins(selectedUser.id, -500)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-[#444746] font-mono py-1.5 text-[9px] uppercase tracking-wider"
                            disabled={(selectedUser.winfCoins || 0) < 500}
                          >
                            -500 Coins (Multa)
                          </button>
                        </div>
                      </div>

                      {/* Technical Level Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-zinc-400 block pb-1">Proficiência Técnica (Academy™)</label>
                        <div className="grid grid-cols-4 gap-1">
                          {['Iniciante', 'Intermediário', 'Avançado', 'Master'].map((lvl) => {
                            const isSelected = selectedUser.technical_level === lvl || (lvl === 'Iniciante' && !selectedUser.technical_level);
                            return (
                              <button
                                key={lvl}
                                onClick={() => handleCustomFieldSave(selectedUser.id, { technical_level: lvl as any })}
                                className={`text-[8px] font-mono py-1 border uppercase text-center truncate ${
                                  isSelected 
                                    ? 'bg-zinc-300 text-black border-zinc-300 font-bold' 
                                    : 'bg-zinc-900 text-zinc-500 border-[#444746] hover:text-white'
                                }`}
                              >
                                {lvl.substring(0, 5)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Certifications (Checklist) */}
                      <div className="space-y-1.5 bg-[#131314] border border-[#444746] p-3">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 block pb-1 border-b border-[#444746]/50 mb-2">Treinamentos Validadores</span>
                        <div className="space-y-1.5 text-[10px] font-sans">
                          {[
                            { key: 'invisible', label: 'Certificado Invisible Pro (Invisibilidade)' },
                            { key: 'blackpro', label: 'Especialista BlackPro (Estilo & Calor)' },
                            { key: 'dualreflect', label: 'Mestre Dual Reflect (Fachadas B2B)' }
                          ].map((cert) => {
                            const hasCert = selectedUser.arch_clearance?.[cert.key as keyof typeof selectedUser.arch_clearance] === true;
                            return (
                              <label key={cert.key} className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                                <input
                                  type="checkbox"
                                  checked={hasCert}
                                  onChange={(e) => {
                                    const nextClearance = {
                                      invisible: selectedUser.arch_clearance?.invisible === true,
                                      blackpro: selectedUser.arch_clearance?.blackpro === true,
                                      dualreflect: selectedUser.arch_clearance?.dualreflect === true,
                                      ...selectedUser.arch_clearance,
                                      [cert.key]: e.target.checked
                                    };
                                    handleCustomFieldSave(selectedUser.id, { arch_clearance: nextClearance });
                                  }}
                                  className="rounded bg-zinc-900 border-[#444746]"
                                />
                                <span>{cert.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {updatingUserId === selectedUser.id && (
                      <div className="flex items-center justify-center gap-2 text-zinc-400 text-[10px] font-mono bg-zinc-900 py-2 border border-[#444746]">
                        <RefreshCw size={11} className="animate-spin text-zinc-400" />
                        <span>Sincronizando com o Córtex...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-[#444746] py-12">
                    <Users size={32} className="text-zinc-600 mb-3 animate-pulse" />
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Painel Clínico</h4>
                    <p className="text-[10px] text-zinc-500 leading-normal max-w-[200px] mt-2">
                      Selecione qualquer usuário ou lead do ecossistema centralizado para modificar acessos, faturamento e créditos.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: CONTENT MODERATION HUB (INTERACTIVE) */}
          {activeTab === 'moderation' && (
            <motion.div 
              key="moderation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-950 border border-[#444746] p-6 space-y-6"
            >
              {/* Inner Tabs */}
              <div className="flex items-center justify-between border-b border-[#444746] pb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-zinc-300" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Central de Governança de Conteúdos</h3>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Modere e valide o padrão ético antes da exposição pública</p>
                  </div>
                </div>

                <div className="flex bg-zinc-900 p-0.5 border border-[#444746]">
                  <button
                    onClick={() => setModerationTab('social')}
                    className={`px-3 py-1 text-[9px] uppercase font-bold tracking-wider ${
                      moderationTab === 'social' ? 'bg-white text-black' : 'text-zinc-400'
                    }`}
                  >
                    Postagens Sociais ({pendingSocialPosts.length})
                  </button>
                  <button
                    onClick={() => setModerationTab('warranties')}
                    className={`px-3 py-1 text-[9px] uppercase font-bold tracking-wider ${
                      moderationTab === 'warranties' ? 'bg-white text-black' : 'text-zinc-400'
                    }`}
                  >
                    Garantias Clinicas ({pendingWarranties.length})
                  </button>
                  <button
                    onClick={() => setModerationTab('reviews')}
                    className={`px-3 py-1 text-[9px] uppercase font-bold tracking-wider ${
                      moderationTab === 'reviews' ? 'bg-white text-black' : 'text-zinc-400'
                    }`}
                  >
                    Curso Feedbacks ({pendingReviews.length})
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Social Posts moderation */}
              {moderationTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingSocialPosts.length === 0 ? (
                    <div className="md:col-span-2 text-center py-12 border border-dashed border-[#444746] p-6">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2 animate-pulse" />
                      <p className="text-zinc-400 font-bold uppercase text-xs">Fila de Posts Vazia</p>
                      <p className="text-zinc-500 text-[10px] mt-1 font-mono">Nenhum operador submeteu panfletos ou campanhas fora de conformidade.</p>
                    </div>
                  ) : (
                    pendingSocialPosts.map((post) => (
                      <div key={post.id} className="bg-zinc-900 border border-[#444746] overflow-hidden flex flex-col md:flex-row justify-between">
                        {post.image_mock && (
                          <div className="md:w-36 h-full shrink-0">
                            <img src={post.image_mock} alt="" className="w-full h-full object-cover min-h-[140px]" />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[8px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 uppercase">{post.platform}</span>
                              <span className="text-[9px] font-mono text-zinc-500">Submetido por: {post.author}</span>
                            </div>
                            <h4 className="text-xs font-bold uppercase text-white truncate">{post.title}</h4>
                            <p className="text-[11px] text-zinc-400 mt-2 font-sans italic leading-relaxed">
                              "{post.caption}"
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-[#444746]/50">
                            <button
                              onClick={() => handleApproveSocialPost(post.id, post.title)}
                              className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-[9px] py-1.5 transition-colors"
                            >
                              Publicar Post (+50xp)
                            </button>
                            <button
                              onClick={() => handleRejectSocialPost(post.id, post.title)}
                              className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-[9px] uppercase transition-colors"
                            >
                              Sinalizar Ajuste
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Sub-tab 2: Warranties moderation */}
              {moderationTab === 'warranties' && (
                <div className="space-y-3">
                  {pendingWarranties.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[#444746] p-6">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                      <p className="text-zinc-400 font-bold uppercase text-xs">Garantias Inteiramente Auditadas</p>
                      <p className="text-zinc-500 text-[10px] mt-1 font-mono">Todas as obras registradas possuem fotos e selos autenticados.</p>
                    </div>
                  ) : (
                    pendingWarranties.map((war) => (
                      <div key={war.id} className="p-4 bg-zinc-900 border border-[#444746] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono bg-red-500/10 text-rose-400 border border-red-500/20 px-2 py-0.5 uppercase font-bold">REQUER AUDITORIA</span>
                            <span className="text-[10px] font-mono text-zinc-500">ID: {war.id}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white uppercase">{war.client}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 text-[9px] font-mono text-zinc-400">
                            <span>Unidade: {war.unit}</span>
                            <span>•</span>
                            <span>Série Aplicada: {war.film_series}</span>
                            <span>•</span>
                            <span>Área total: {war.area_sqm} m²</span>
                            <span>•</span>
                            <span>Data da Obra: {war.installation_date}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleApproveWarranty(war.id, war.client)}
                            className="bg-white hover:bg-zinc-200 text-black font-bold uppercase text-[9px] px-4 py-2 transition-colors flex items-center gap-1"
                          >
                            <Check size={10} /> Validar & Emitir Selo (+100 XP)
                          </button>
                          <button
                            onClick={() => handleRejectWarranty(war.id, war.client)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-[9px] uppercase px-3 py-2 transition-colors"
                          >
                            Recusar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Sub-tab 3: Reviews moderation */}
              {moderationTab === 'reviews' && (
                <div className="space-y-3">
                  {pendingReviews.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[#444746] p-6">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                      <p className="text-zinc-400 font-bold uppercase text-xs">Sem Feedbacks Pendentes</p>
                      <p className="text-zinc-500 text-[10px] mt-1 font-mono font-mono">Toda opinião dos alunos da Academy já foi processada.</p>
                    </div>
                  ) : (
                    pendingReviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-zinc-900 border border-[#444746] flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-zinc-400">Aluno: {rev.student}</span>
                            <span className="text-zinc-500 text-[10px] ml-2">Curso: <strong className="text-white">{rev.course_title}</strong></span>
                          </div>
                          <span className="text-amber-500 font-mono text-[#10px]">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-sans italic">
                          "{rev.comment}"
                        </p>
                        <div className="flex gap-2 pt-2 border-t border-[#444746]/40">
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="bg-white hover:bg-zinc-200 text-black font-bold uppercase text-[9px] px-4 py-1.5 transition-colors"
                          >
                            Tornar Review Público
                          </button>
                          <button
                            onClick={() => handleDiscardReview(rev.id)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-[9px] uppercase px-3 py-1.5 transition-colors"
                          >
                            Descartar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 4: SYSTEM PARAMS CONFIGURATION */}
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Sub Panel (toggles & values) */}
              <div className="bg-zinc-950 p-6 border border-[#444746] space-y-6">
                <div className="flex items-center gap-2 border-b border-[#444746] pb-3">
                  <Sliders size={14} className="text-zinc-400" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Parâmetros Ativos de Winf OS</h4>
                </div>

                <div className="space-y-4">
                  {/* Maintenance Mode */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 border border-[#444746]">
                    <div>
                      <span className="text-xs text-zinc-200 block font-bold uppercase tracking-wide">Modo de Manutenção Central</span>
                      <span className="text-[10px] text-zinc-500">Bloqueia consultas estéticas na One-Page se ativo</span>
                    </div>
                    <button
                      onClick={() => setSysConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                      className={`text-[9px] font-mono px-3 py-1 uppercase font-bold transition-all ${
                        sysConfig.maintenanceMode 
                          ? 'bg-red-500 text-white' 
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {sysConfig.maintenanceMode ? 'BLOQUEADO' : 'LIBERADO'}
                    </button>
                  </div>

                  {/* Auto Approve Licensees */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 border border-[#444746]">
                    <div>
                      <span className="text-xs text-zinc-200 block font-bold uppercase tracking-wide">Auto-Ativação de Licenciados</span>
                      <span className="text-[10px] text-zinc-500">Novos instaladores cadastrados entram pré-aprovados</span>
                    </div>
                    <button
                      onClick={() => setSysConfig(prev => ({ ...prev, autoApproveLicensees: !prev.autoApproveLicensees }))}
                      className={`text-[9px] font-mono px-3 py-1 uppercase font-bold transition-all ${
                        sysConfig.autoApproveLicensees 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                          : 'bg-zinc-850 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {sysConfig.autoApproveLicensees ? 'HABILITADO' : 'MANUAL'}
                    </button>
                  </div>

                  {/* Require CNPJ */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 border border-[#444746]">
                    <div>
                      <span className="text-xs text-zinc-200 block font-bold uppercase tracking-wide">Exigência de CNPJ</span>
                      <span className="text-[10px] text-zinc-500">Obrigatório para emissão de garantias B2B</span>
                    </div>
                    <button
                      onClick={() => setSysConfig(prev => ({ ...prev, requireCnpj: !prev.requireCnpj }))}
                      className={`text-[9px] font-mono px-3 py-1 uppercase font-bold transition-all ${
                        sysConfig.requireCnpj 
                          ? 'bg-white text-black' 
                          : 'text-zinc-500 bg-zinc-900 border border-[#444746]'
                      }`}
                    >
                      {sysConfig.requireCnpj ? 'OBRIGATÓRIO' : 'FLEXÍVEL'}
                    </button>
                  </div>

                  {/* API rates and numeric values */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Coins por Moeda R$</label>
                      <input 
                        type="number" 
                        value={sysConfig.exchangeRateCoins}
                        onChange={(e) => setSysConfig(prev => ({ ...prev, exchangeRateCoins: Number(e.target.value) }))}
                        className="w-full bg-zinc-900 border border-[#444746] p-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Multiplicador TSER</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={sysConfig.tserMultiplier}
                        onChange={(e) => setSysConfig(prev => ({ ...prev, tserMultiplier: Number(e.target.value) }))}
                        className="w-full bg-zinc-900 border border-[#444746] p-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Governance Panel (inputs & saving actions) */}
              <div className="bg-zinc-950 p-6 border border-[#444746] flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-[#444746] pb-3">
                    <Shield size={14} className="text-zinc-400" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Diretrizes da Central (Redundância FaaS)</h4>
                  </div>
                  
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Ajustando esses limites você instrui o Gateway do Córtex Central a reenquadrar orçamentos, comissões de corretores integrados, e tokens de rate-limit.
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-1.2">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Global API Gateway</label>
                      <input 
                        type="text" 
                        value={sysConfig.apiGateway}
                        onChange={(e) => setSysConfig(prev => ({ ...prev, apiGateway: e.target.value }))}
                        className="w-full bg-zinc-900 border border-[#444746] p-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.2">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Mensagem Global Inteligente (Dashboard)</label>
                      <textarea
                        value={sysConfig.welcomeMessage}
                        onChange={(e) => setSysConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                        className="w-full bg-zinc-900 border border-[#444746] p-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-sans h-24 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#444746]/50">
                  <div className="p-3 bg-[#131314] border border-[#444746] font-mono text-[9px] text-zinc-500 space-y-1">
                    <div>SYSTEM_STATUS: <span className="text-emerald-500">STABLE (99.98% UPTIME)</span></div>
                    <div>GATEWAY_PINGS: <span className="text-zinc-400">12ms (Latency Central)</span></div>
                    <div>ACTIVE_CORTEX: 3X12 MICROSERVICES</div>
                  </div>

                  <button
                    onClick={handleSaveSystemConfig}
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <Save size={12} /> Salvar e Propagar Diretrizes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: REPORTS GENERATOR (CORE REQUIREMENT) */}
          {activeTab === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-zinc-950 border border-[#444746] p-6">
                <div className="flex items-center justify-between border-b border-[#444746] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-zinc-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white">Central de Emissões e Relatórios do Córtex</h3>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">Configure, filtre e processe dados agregados da rede para tomada de decisão estratégica</p>
                    </div>
                  </div>
                </div>

                {/* Generator Panel Forms */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-900/50 p-4 border border-[#444746] mb-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block pb-1">Modelo de Relatório</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                    >
                      <option value="desempenho_regional">Desempenho Regional FaaS</option>
                      <option value="academy_eng">Winf Academy & Certificações</option>
                      <option value="garantia_auditoria">Auditoria de Garantias Reais</option>
                      <option value="financeiro_faas">Consolidado Financeiro (Winf OS)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block pb-1">Período de Seleção</label>
                    <select
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                    >
                      <option value="current_month">Junho de 2026</option>
                      <option value="last_quarter">Segundo Trimestre (Q2)</option>
                      <option value="all_time">Todo o Histórico Ativo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block pb-1">Disposição do Arquivo</label>
                    <select
                      value={reportFormat}
                      onChange={(e) => setReportFormat(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                    >
                      <option value="PDF">Formato Comercial PDF (.pdf)</option>
                      <option value="CSV">Planilha Estruturada CSV (.csv)</option>
                    </select>
                  </div>

                  <div className="flex items-end select-none">
                    <button
                      onClick={handleTriggerReportGeneration}
                      disabled={isGeneratingReport}
                      className="w-full bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest text-[9px] py-2.5 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isGeneratingReport ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Computando...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp size={12} />
                          <span>Processar Relatório</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Processing/Loading indicator */}
                {isGeneratingReport && (
                  <div className="p-8 border border-dashed border-[#444746] text-center space-y-4">
                    <RefreshCw size={24} className="animate-spin text-zinc-400 mx-auto" />
                    <div className="space-y-1 animate-pulse">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">{generationStep}</p>
                      <p className="text-[9px] text-[#88888b] font-mono font-mono">Consolidando dados cruzados do ecossistema...</p>
                    </div>
                    <div className="w-56 h-1 bg-zinc-800 mx-auto overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-white w-24 animate-[loading_1.5s_infinite_ease-in-out]"></div>
                    </div>
                  </div>
                )}

                {/* Generated report output view */}
                {generatedReportData && !isGeneratingReport && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-[#444746] bg-zinc-900/40 p-6 md:p-8 space-y-8 max-w-4xl mx-auto"
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#444746] pb-4 select-none">
                      <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 border border-[#444746] flex items-center justify-center font-bold font-mono text-zinc-300">W</div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white">WINF DIGITAL ECOSYSTEM</h4>
                          <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Córtex Central Autônomo</span>
                        </div>
                      </div>
                      
                      <div className="text-right mt-2 md:mt-0 font-mono text-[9px] text-zinc-500">
                        <div>Sessão Criptográfica: <span className="text-white">{generatedReportData.hash}</span></div>
                        <div>Emissão: <span className="text-white">{generatedReportData.generatedAt}</span></div>
                      </div>
                    </div>

                    {/* Report Specific Layout mimicking a real paper */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase text-white tracking-widest border-b border-[#404044] pb-2 text-center w-full">
                        {generatedReportData.title} ({generatedReportData.period})
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center pt-2">
                        <div className="p-3 bg-zinc-950/75 border border-[#444746]">
                          <span className="text-[8px] text-zinc-500 block">UNIDADES ATIVAS</span>
                          <span className="text-sm font-bold text-white block mt-1">{generatedReportData.metrics.unidades_em_operacao}</span>
                        </div>
                        <div className="p-3 bg-zinc-950/75 border border-[#444746]">
                          <span className="text-[8px] text-zinc-500 block">MÉDIA LEADS</span>
                          <span className="text-sm font-bold text-white block mt-1">{generatedReportData.metrics.leads_gerados}</span>
                        </div>
                        <div className="p-3 bg-zinc-950/75 border border-[#444746]">
                          <span className="text-[8px] text-zinc-500 block">GARANTIAS REALIZADAS</span>
                          <span className="text-sm font-bold text-white block mt-1">{generatedReportData.metrics.garantias_emitidas}</span>
                        </div>
                        <div className="p-3 bg-zinc-950/75 border border-[#444746]">
                          <span className="text-[8px] text-zinc-500 block">EFICIÊNCIA (LEAN)</span>
                          <span className="text-sm font-bold text-emerald-400 block mt-1">{generatedReportData.metrics.eficiencia_sistema}</span>
                        </div>
                      </div>

                      {/* Detailed narrative block */}
                      <div className="space-y-3 p-4 bg-zinc-950/40 border border-[#444746] rounded-none">
                        <h5 className="text-[10px] font-bold uppercase text-zinc-300 flex items-center gap-1">
                          <Info size={11} className="text-zinc-500" /> COMENTÁRIO ANALÍTICO DA ADMINISTRADOR
                        </h5>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                          Com base na inteligência do Winf OS, as bacias hidrográficas geográficas mais ativas consolidaram um faturamento de <strong>R$ {generatedReportData.metrics.total_faturamento.toLocaleString('pt-BR')}</strong> no período indicado. A aplicação de treinamentos estruturados da Winf Academy como a "Toyota Lean" e a "Apple Experience" no modelo de negócios Asset Light reduziu substancialmente o desperdício em obra para aproximadamente <strong>{generatedReportData.metrics.descarte_pelicula_reduzido}</strong> de película reaproveitada por corte inteligente. Recomenda-se prosseguir com a otimização tributária para manter o e-mail corporativo institucional homologado em 100% dos polos ativos.
                        </p>
                      </div>

                    </div>

                    {/* Download report block */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-950 p-4 border border-[#444746] md:p-6 select-none">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500">FORMATO ESCOLHIDO: {reportFormat}</span>
                        <p className="text-xs text-white max-w-sm mt-1 font-bold">Instruções de download formatado e homologável pelo comitê.</p>
                      </div>
                      
                      <button 
                        onClick={() => triggerNotification('Arquivo Baixado', `O arquivo .${reportFormat.toLowerCase()} foi gerado e salvo para backup.`)}
                        className="bg-white hover:bg-zinc-250 text-black px-6 py-3 font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 shrink-0 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-transparent rounded-none"
                      >
                        <Download size={14} /> Fazer Download da Guia Formatada
                      </button>
                    </div>

                  </motion.div>
                )}

              </div>
            </motion.div>
          )}

          {/* TAB 6: PURE TERRITORY MANAGEMENT */}
          {activeTab === 'territories' && (
            <motion.div 
              key="territories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminTerritories />
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Global Map Modal */}
      <AnimatePresence>
        {viewGlobalMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#131314] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#444746] bg-[#131314] shrink-0">
              <div className="flex items-center gap-3">
                <Globe className="text-[#bfbfbf]" />
                <h2 className="text-base font-bold uppercase tracking-wider text-white">Visualização Geocrítica: Unidades e Polos</h2>
              </div>
              <button 
                onClick={() => setViewGlobalMap(false)} 
                className="text-white/50 hover:text-white p-2"
                id="close-global-map-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <UniversoDarkMaps lang="pt" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
