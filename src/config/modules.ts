import { 
  Zap, Globe, Star, ShoppingBag, Wallet, Scissors,
  GraduationCap, FileSpreadsheet, 
  Building2, ShieldCheck, Link, HelpCircle, Brain,
  Package, LayoutDashboard, Users, Target, Monitor, Cpu,
  Filter, MessageCircle, CalendarDays, Clock, PackageSearch, Blocks, Trophy, Leaf, Rocket, ClipboardList, Settings, Headset, Coffee, FileText
} from 'lucide-react';
import { ViewState } from '../types';

export interface ModuleItem {
  id: string;
  title: string;
  icon: any;
  desc: string;
  viewState: ViewState;
  isComingSoon?: boolean;
  isAdminOnly?: boolean;
  isBasic?: boolean;
}

export interface ModuleCategory {
  category: string;
  items: ModuleItem[];
}

export const MODULES_CONFIG: ModuleCategory[] = [
    { category: 'OS Suite', items: [
      { id: 'module_os_suite', title: 'OS Industrial', icon: Clock, desc: 'Pipeline e Orçamentos', viewState: ViewState.MODULE_OS_SUITE, isBasic: true },
      { id: 'module_capture', title: 'Radar', icon: Target, desc: 'Pipeline de Oportunidades', viewState: ViewState.MODULE_CAPTURE, isBasic: true },
      { id: 'module_customer_registration', title: 'Cadastro de Clientes', icon: Users, desc: 'Registrar novos clientes', viewState: ViewState.MODULE_CUSTOMER_REGISTRATION, isBasic: true },
      { id: 'quotes', title: 'Orçamentos', icon: FileSpreadsheet, desc: 'Orçamentos de Arquitetura e Auto', viewState: ViewState.MODULE_QUOTES },
      { id: 'installations', title: 'OS', icon: CalendarDays, desc: 'Gestão de Instalações', viewState: ViewState.MODULE_INSTALLATIONS },
      { id: 'warranties', title: 'Central de Garantias', icon: ShieldCheck, desc: 'Certificados e CRM', viewState: ViewState.WARRANTY },
  ]},
  { category: 'System & Support', items: [
      { id: 'system_manual', title: 'Manual do Sistema', icon: HelpCircle, desc: 'Instruções e Tutoriais', viewState: ViewState.MODULE_SYSTEM_MANUAL },
  ]},
  { category: 'Business Core (Backoffice)', items: [
      { id: 'stock', title: 'Estoque & Rolls', icon: Package, desc: 'Controle de Bobinas & Metragens', viewState: ViewState.MODULE_STOCK },
      { id: 'financial', title: 'Financeiro', icon: Wallet, desc: 'Gestão Financeira & Lançamentos', viewState: ViewState.MODULE_FINANCIAL },
      { id: 'academy', title: 'Winf Academy', icon: GraduationCap, desc: 'Capacitação Técnica & Certificações', viewState: ViewState.MODULE_ACADEMY },
      { id: 'blackshop', title: 'Blackshop', icon: ShoppingBag, desc: 'Reposição de Material', viewState: ViewState.MODULE_BLACKSHOP },
      { id: 'winf_chain', title: 'Ledger de Lastro', icon: Blocks, desc: 'Auditoria de Lastro & ARR Consolidado', viewState: ViewState.MODULE_WINF_CHAIN },
  ]},
  { category: 'Tech & Immersive', items: [
      { id: 'winf_precision', title: 'Winf Precision™', icon: Scissors, desc: 'Precisão e Corte', viewState: ViewState.MODULE_WINF_PRECISION },
      { id: 'geo_strategy', title: 'Geo-Estratégia', icon: Globe, desc: 'Dominação Territorial & Market Share', viewState: ViewState.GEO_STRATEGY },
      { id: 'cortex_terminal', title: 'WINF Córtex', icon: Cpu, desc: 'Terminal de Atendimento Autônomo', viewState: ViewState.MODULE_CORTEX_TERMINAL },
      { id: 'audio_intelligence', title: 'Inteligência Auditiva', icon: Headset, desc: 'Ambientação Synthwave WINF™', viewState: ViewState.MODULE_AUDIO_INTELLIGENCE },
      { id: 'guest_lounge', title: 'Guest Lounge', icon: Coffee, desc: 'Área do Cliente e Status', viewState: ViewState.GUEST_LOUNGE },
      { id: 'arsenal', title: 'Arsenal M.A.W™', icon: Target, desc: 'Material de Alta Conversão', viewState: ViewState.MODULE_ARSENAL },
      { id: 'board', title: 'The Board™', icon: LayoutDashboard, desc: 'Ranking Nacional (W12)', viewState: ViewState.MODULE_THE_BOARD },
  ]}
];

export const ADMIN_MODULES: ModuleItem[] = [
  { id: 'catalog_admin', title: 'Catálogo de Produtos', icon: Package, desc: 'Edição de Fichas Técnicas', viewState: ViewState.MODULE_BLACKSHOP_ADMIN, isAdminOnly: true },
  { id: 'cortex_terminal_admin', title: 'Winf™ Cortex Terminal', icon: Cpu, desc: 'Gestão de Operador Autônomo', viewState: ViewState.MODULE_CORTEX_TERMINAL, isAdminOnly: true },
  { id: 'data_core', title: 'Data Core', icon: Settings, desc: 'Configurações de Acesso', viewState: ViewState.MODULE_DATA_CORE, isAdminOnly: true },
  { id: 'documents_admin', title: 'Arsenal Tático Admin', icon: FileText, desc: 'Gestão de Documentos WINF', viewState: ViewState.MODULE_DOCUMENTS_ADMIN, isAdminOnly: true },
];

export const getAllModules = () => {
  const all: ModuleItem[] = [];
  MODULES_CONFIG.forEach(cat => all.push(...cat.items));
  all.push(...ADMIN_MODULES);
  return all;
};
