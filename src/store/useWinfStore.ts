import { create } from 'zustand';
import { 
  User, 
  Lead, 
  Product, 
  Order, 
  Installation, 
  WarrantyRegistration, 
  NotificationState,
  AgentState,
  WhatsAppConfig,
  WhatsAppChat,
  ParadoxAnalysis,
  AgentInsight,
  AgentCommand,
  VaultFile
} from '../types';

interface WinfState {
  // Auth Slice
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  effectiveRole: User['role'] | null;
  
  // Data Slice
  leads: Lead[];
  publicLeads: Lead[];
  products: Product[];
  orders: Order[];
  installations: Installation[];
  warranties: WarrantyRegistration[];
  agentInsights: AgentInsight[];
  vaultFiles: VaultFile[];
  isVaultLoading: boolean;
  
  // UI Slice
  notification: NotificationState;
  isOnline: boolean;
  favoriteModules: string[];
  
  // Agent Slice
  agentState: AgentState;
  paradoxAnalysis: ParadoxAnalysis | null;
  
  // Comm Slice
  whatsappConfigs: WhatsAppConfig[];
  activeChats: WhatsAppChat[];

  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setNotification: (notif: NotificationState) => void;
  setLeads: (leads: Lead[]) => void;
  setProducts: (products: Product[]) => void;
  setInstallations: (installations: Installation[]) => void;
  setWarranties: (warranties: WarrantyRegistration[]) => void;
  setAgentState: (state: Partial<AgentState>) => void;
  dispatchAgentCommand: (command: AgentCommand) => Promise<{ success: boolean; output: string }>;
  distributeLead: (leadData: any) => Promise<{ success: boolean; routedTo: string }>;
  setEffectiveRole: (role: User['role'] | null) => void;
  setFavoriteModules: (modules: string[]) => void;
  setActiveChats: (chats: WhatsAppChat[]) => void;
  setOrders: (orders: Order[]) => void;
  setPublicLeads: (leads: Lead[]) => void;
  setVaultFiles: (files: VaultFile[]) => void;
  setVaultLoading: (loading: boolean) => void;
}

export const useWinfStore = create<WinfState>((set) => ({
  // Initial States
  user: null,
  isAuthenticated: false,
  isLoading: true,
  effectiveRole: null,
  
  leads: [],
  publicLeads: [],
  products: [],
  orders: [],
  installations: [],
  warranties: [],
  agentInsights: [],
  vaultFiles: [],
  isVaultLoading: false,
  
  notification: { show: false, message: '', points: 0 },
  isOnline: true,
  favoriteModules: JSON.parse(localStorage.getItem('winf_favorites') || '[]'),
  
  agentState: {
    status: 'online',
    activeAgents: 3,
    memoryPoints: 1240,
    lastSync: new Date().toISOString(),
    logs: [
      '[SYSTEM] Neural Bridge v2.5 initialized.',
      '[VPS] Connected to Hostinger-Node-01 (Kimi K2.5)',
      '[DOCKER] Container "second-brain-core" is running.',
      '[AGENT] Sub-agent "Researcher-01" started web crawl.',
      '[SYNC] Memory core updated with 124 new context points.'
    ]
  },
  paradoxAnalysis: null,
  
  whatsappConfigs: [
    { id: 'wa-central', city: 'Central (Brasil)', phoneNumber: '+55 13 99999-0000', isCentral: true, status: 'online', agentName: 'Winf Core AI' },
    { id: 'wa-santos', city: 'Santos', phoneNumber: '+55 13 98888-1111', isCentral: false, status: 'online', agentName: 'Santos Agent v1' },
    { id: 'wa-sp', city: 'São Paulo', phoneNumber: '+55 11 97777-2222', isCentral: false, status: 'online', agentName: 'SP Agent v2' },
    { id: 'wa-curitiba', city: 'Curitiba', phoneNumber: '+55 41 96666-3333', isCentral: false, status: 'online', agentName: 'Curitiba Agent v1' },
  ],
  activeChats: [
    { id: 'chat1', customerName: 'Carlos Silva', lastMessage: 'Quero saber sobre PPF em Santos', timestamp: new Date().toISOString(), city: 'Santos', status: 'bot_handling' },
    { id: 'chat2', customerName: 'Mariana Oliveira', lastMessage: 'Olá, sou de SP e vi o anúncio', timestamp: new Date().toISOString(), city: 'São Paulo', status: 'bot_handling' },
  ],

  // Actions
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setNotification: (notification) => set({ notification }),
  setLeads: (leads) => set({ leads }),
  setProducts: (products) => set({ products }),
  setInstallations: (installations) => set({ installations }),
  setWarranties: (warranties) => set({ warranties }),
  setAgentState: (state) => set((prev) => ({ agentState: { ...prev.agentState, ...state } })),
  
  dispatchAgentCommand: async (command) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${command.type}] Executing: ${command.action}...`;
    
    set((prev) => ({ 
      agentState: { ...prev.agentState, logs: [...prev.agentState.logs, logEntry] } 
    }));

    await new Promise((resolve) => setTimeout(resolve, 800));
    let output = `[${timestamp}] [SUCCESS] ${command.action} completed.`;
    
    if (command.type === 'TERMINAL' && command.action.includes('status')) {
      output = `[${timestamp}] [VPS] CPU: 14% | RAM: 1.6GB/4GB | Disk: 45%`;
    }

    set((prev) => ({
      agentState: {
        ...prev.agentState,
        logs: [...prev.agentState.logs, output],
        memoryPoints: prev.agentState.memoryPoints + 5
      }
    }));
    return { success: true, output };
  },

  distributeLead: async (leadData) => {
    const city = leadData.city || 'Desconhecido';
    set((prev) => ({
      agentState: { ...prev.agentState, logs: [...prev.agentState.logs, `[WHATSAPP] Novo lead detectado na Central: ${leadData.name} (${city})`] }
    }));

    const regionalConfig = useWinfStore.getState().whatsappConfigs.find(c => c.city?.toLowerCase() === city?.toLowerCase() && !c.isCentral);
    const routedTo = regionalConfig ? regionalConfig.city : 'Fila de Espera Central';

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newChat: WhatsAppChat = {
      id: `chat-${Date.now()}`,
      customerName: leadData.name,
      lastMessage: `Encaminhado para ${routedTo}`,
      timestamp: new Date().toISOString(),
      city: city,
      status: regionalConfig ? 'routed' : 'waiting'
    };

    set((prev) => ({
      activeChats: [newChat, ...prev.activeChats],
      agentState: { ...prev.agentState, logs: [...prev.agentState.logs, `[WHATSAPP] Lead ${leadData.name} distribuído para: ${routedTo}`] }
    }));

    return { success: true, routedTo };
  },

  setEffectiveRole: (effectiveRole) => set({ effectiveRole }),
  setActiveChats: (activeChats) => set({ activeChats }),
  setOrders: (orders) => set({ orders }),
  setPublicLeads: (publicLeads) => set({ publicLeads }),
  setVaultFiles: (vaultFiles) => set({ vaultFiles }),
  setVaultLoading: (isVaultLoading) => set({ isVaultLoading }),
  setFavoriteModules: (favoriteModules) => {
    localStorage.setItem('winf_favorites', JSON.stringify(favoriteModules));
    set({ favoriteModules });
  },
}));
