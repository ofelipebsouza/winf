
import { useWinfStore } from '../store/useWinfStore';
import { MANUAL_DATA } from '../data/manual';
import { DEFAULT_WINF_DOCUMENTS } from '../lib/documentSeeder';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { 
  User, 
  NotificationState, 
  GamificationAction, 
  WarrantyRegistration, 
  Lead as LeadType, 
  Product, 
  Order, 
  Installation,
  Vehicle, 
  AiGeneration, 
  CoinLedgerEntry, 
  SocialPost, 
  UserModuleProgress, 
  PlatformEvent,
  WinfContextType,
  UserPerformanceMetrics,
  ContentCalendarEvent,
  DocumentItem,
  Transaction,
  Quote,
  StockItem,
  TrainingModule,
  AgentState,
  AgentCommand,
  WhatsAppConfig,
  WhatsAppChat,
  Retalho,
  InstallationJob,
  PartnerTask,
  ParadoxAnalysis,
  AgentInsight,
  Asset
} from '../types';
import { db, auth } from '../lib/firebase';
import { winfApi } from '../services/winfApi';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, limit, orderBy, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export function calculateRankLevel(xp: number): string {
  if (xp <= 1000) return 'Iniciante';
  if (xp <= 2500) return 'Bronze';
  if (xp <= 5000) return 'Prata';
  if (xp <= 8500) return 'Ouro';
  if (xp <= 13000) return 'Diamante';
  if (xp <= 20000) return 'Elite';
  return 'Lendário';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const WinfContext = createContext<WinfContextType | undefined>(undefined);

export const useWinf = () => {
  const context = useContext(WinfContext);
  if (!context) throw new Error('useWinf must be used within a WinfProvider');
  return context;
};

// Fixed missing arch_clearance to satisfy the User interface
const PROTO_USER_TIAGO: User = {
  id: 'proto-tiago-001',
  name: 'Tiago Augusto Correa',
  email: 'tiago.correa@winf.com',
  role: 'Admin',
  avatar: 'https://via.placeholder.com/150/0057FF/FFFFFF?text=TC', 
  company: 'Winf Corporate',
  phone: '(13) 99999-9999',
  cnpj: '00.000.000/0001-00',
  address: {
    city: 'Santos',
    state: 'SP',
    street: 'Av. Ana Costa, 400',
    zip: '11060-002'
  },
  w_rank_xp: 4500,
  w_rank_level: 'Master',
  winfCoins: 12500,
  arch_clearance: {
    invisible: true,
    blackpro: true,
    dualreflect: true
  },
  plan: 'nivel3',
  winf_knowledge: 2500,
  cortex_influence: 980,
  neural_memory: 1200,
  tactical_assets: 450
};

const PROTO_USER_ARCHITECT: User = {
  id: 'proto-arch-001',
  name: 'Arq. Roberto Simões',
  email: 'roberto.architect@winf.com',
  role: 'Architect',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80', 
  company: 'RS Fine Architecture',
  phone: '(11) 98888-7777',
  cnpj: '11.111.111/0001-11',
  address: {
    city: 'São Paulo',
    state: 'SP',
    street: 'Av. Paulista, 1000',
    zip: '01310-100'
  },
  w_rank_xp: 1200,
  w_rank_level: 'Elite',
  winfCoins: 3500,
  arch_clearance: {
    invisible: true,
    blackpro: true,
    dualreflect: true
  },
  plan: 'nivel1',
  winf_knowledge: 1500,
  cortex_influence: 400,
  neural_memory: 600,
  tactical_assets: 200
};

const PROTO_USER_LICENCIADO: User = {
  id: 'proto-lic-001',
  name: 'João Licenciado',
  email: 'joao.licenciado@winf.com',
  role: 'Licenciado',
  avatar: 'https://via.placeholder.com/150/111111/FFFFFF?text=JL', 
  company: 'Winf Cuidade Master',
  phone: '(13) 98888-7777',
  cnpj: '22.222.222/0001-22',
  address: {
    city: 'Santos',
    state: 'SP',
    street: 'Av. Conselheiro Nébias, 500',
    zip: '11045-000'
  },
  w_rank_xp: 500,
  w_rank_level: 'Initiate',
  winfCoins: 1000,
  arch_clearance: {
    invisible: true,
    blackpro: true,
    dualreflect: false
  },
  plan: 'nivel1',
  winf_knowledge: 500,
  cortex_influence: 100,
  neural_memory: 200,
  tactical_assets: 50
};

const PROTO_USER_INVESTOR: User = {
  id: 'proto-inv-001',
  name: 'Investidor Winf',
  email: 'investidor@winf.com',
  role: 'Investor',
  avatar: 'https://via.placeholder.com/150/111111/FFFFFF?text=I', 
  company: 'Winf Equity Partners',
  phone: '(11) 99999-8888',
  w_rank_xp: 0,
  w_rank_level: 'Initiate',
  winfCoins: 0,
  arch_clearance: {
    invisible: false,
    blackpro: false,
    dualreflect: false
  },
  plan: 'nivel1',
  winf_knowledge: 0,
  cortex_influence: 0,
  neural_memory: 0,
  tactical_assets: 0
};

export const WinfProvider = ({ children }: { children?: ReactNode }) => {
  const {
      user, setUser,
      isAuthenticated, setIsAuthenticated,
      isLoading, setIsLoading,
      notification, setNotification,
      leads, setLeads,
      publicLeads, setPublicLeads,
      warranties, setWarranties,
      products, setProducts,
      orders, setOrders,
      installations, setInstallations,
      agentState, setAgentState,
      dispatchAgentCommand,
      distributeLead,
      effectiveRole, setEffectiveRole,
      favoriteModules, setFavoriteModules,
      paradoxAnalysis, setParadoxAnalysis,
      whatsappConfigs,
      activeChats, setActiveChats,
      vaultFiles, setVaultFiles,
      isVaultLoading, setVaultLoading,
  } = useWinfStore();

  const [aiGenerations, setAiGenerations] = useState<AiGeneration[]>([]);
  const [coinLedger, setCoinLedger] = useState<CoinLedgerEntry[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [userModuleProgress, setUserModuleProgress] = useState<UserModuleProgress[]>([]);
  const [platformEvents, setPlatformEvents] = useState<PlatformEvent[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [userPerformanceMetrics, setUserPerformanceMetrics] = useState<UserPerformanceMetrics[]>([]);
  const [contentCalendarEvents, setContentCalendarEvents] = useState<ContentCalendarEvent[]>([]);
  const [documentItems, setDocumentItems] = useState<DocumentItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [retalhos, setRetalhos] = useState<Retalho[]>([]);
  const [trainingModules, setTrainingModules] = useState<any[]>([]);
  const [partnerTasks, setPartnerTasks] = useState<PartnerTask[]>([]);
  const [agentInsights, setAgentInsights] = useState<AgentInsight[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [hasInitializedPrototypes, setHasInitializedPrototypes] = useState(false);

  useEffect(() => {
    if (!hasInitializedPrototypes && user?.id?.startsWith('proto-') && isAuthenticated) {
        // Simular a criação de territórios e registros iniciais
        const prototypes = [
            { id: 'proto-praia-grande', name: 'Território Praia Grande' },
            { id: 'proto-guaruja', name: 'Território Guarujá' },
            { id: 'proto-campina-grande', name: 'Território Campina Grande', manager: 'Tiago Dos Anjos' },
            { id: 'proto-sorocaba', name: 'Território Sorocaba', manager: 'Tiago Augusto Correa' },
            { id: 'proto-sao-vicente', name: 'Território São Vicente', manager: 'Diego' }
        ];

        console.log("Inicializando territórios e compras simuladas:", prototypes);

        // Simulando compras na Blackshop
        const newStockItems = [...stockItems];
        prototypes.forEach(p => {
             ['prod-dual', 'prod-blackpro', 'prod-invisible'].forEach(prodId => {
                 console.log(`Compra simulada: ${prodId} para ${p.name}`);
                 newStockItems.push({
                     id: `stock-${p.id}-${prodId}`,
                     user_id: p.id,
                     product_id: prodId,
                     product_name: prodId.replace('prod-', '').toUpperCase(),
                     total_meters: 15, // Meio rolo (15m de 30m)
                     width: 1.52,
                     remaining_meters: 15,
                     created_at: new Date().toISOString()
                 });
             });
        });
        setStockItems(newStockItems);

        // Registrar eventos iniciais (coins, compras)
        setUser(prev => prev ? { ...prev, winfCoins: 50000 } : null);
        
        setHasInitializedPrototypes(true);
    }
  }, [user?.id, isAuthenticated, hasInitializedPrototypes, stockItems, setStockItems, setUser]);

  const [totalLeads, setTotalLeads] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentActivities, setRecentActivities] = useState<{ id: string; type: string; description: string; created_at: string; }[]>([]);

  const fetchUserProfile = useCallback(async (id: string): Promise<User | null> => {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const profileData = docSnap.data();
      const isClientAdmin = profileData.email === 'marketing.advanced.windowfilm@gmail.com';
      return {
        id: docSnap.id,
        name: profileData.name || profileData.email,
        email: profileData.email,
        role: isClientAdmin ? 'Admin' : (profileData.role || 'Member'),
        avatar: profileData.avatar || '',
        winfCoins: profileData.winfCoins || 0,
        company: profileData.company || '',
        phone: profileData.phone || '',
        cnpj: profileData.cnpj || '',
        address: profileData.address || undefined,
        w_rank_xp: profileData.w_rank_xp || 0,
        w_rank_level: profileData.w_rank_level || 'Initiate',
        arch_clearance: profileData.arch_clearance || {
          invisible: false,
          blackpro: false,
          dualreflect: false
        },
        winf_knowledge: profileData.winf_knowledge || 0,
        cortex_influence: profileData.cortex_influence || 0,
        neural_memory: profileData.neural_memory || 0,
        tactical_assets: profileData.tactical_assets || 0,
        plan: profileData.plan || 'nivel1'
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile(userCredential.user.uid);
      if (profile) {
        setUser(profile);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true, error: null };
      } else {
        return { success: false, error: "Perfil de usuário não encontrado." };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const loginAsPrototype = async (role?: string) => {
    // For prototyping, defaults to Licenciado 
    if (role === 'Admin') {
      setUser(PROTO_USER_TIAGO);
    } else if (role === 'Architect' || role === 'Arquiteto') {
      setUser(PROTO_USER_ARCHITECT);
    } else {
      setUser(PROTO_USER_LICENCIADO);
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    if (!user?.id?.startsWith('proto-')) {
      await signOut(auth);
    }
    setUser(null); 
    setIsAuthenticated(false);
  };

  const fetchCoinLedger = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { 
      setCoinLedger([
        { id: 'cl1', user_id: user.id, amount: 50, description: 'Bônus de Login', action_type: 'EARN', created_at: new Date().toISOString() },
        { id: 'cl2', user_id: user.id, amount: -20, description: 'Resgate de Voucher', action_type: 'SPEND', created_at: new Date(Date.now() - 3600000).toISOString() },
      ]);
      return; 
    } 
    try {
      const q = query(collection(db, 'coin_ledger'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setCoinLedger(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'coin_ledger');
    }
  }, [user?.id]);

  const updateUserCoins = async (amount: number, reason: string, xp: number = 0) => {
    if (!user?.id) return;
    
    const nextXpProto = (user.w_rank_xp || 0) + xp;
    const nextLevelProto = calculateRankLevel(nextXpProto);
    const levelUpProto = user.w_rank_level !== nextLevelProto;

    if (user?.id?.startsWith('proto-')) { 
      setUser(prev => prev ? { 
        ...prev, 
        winfCoins: prev.winfCoins + amount, 
        w_rank_xp: nextXpProto,
        w_rank_level: nextLevelProto
      } : null);
      
      if (levelUpProto) {
        setNotification({ 
          show: true, 
          message: `🏆 EVOLUÇÃO DE PATENTE! Parabéns! Você avançou para a patente <strong>${nextLevelProto}</strong>!`, 
          points: amount 
        });
      } else {
        setNotification({ show: true, message: amount > 0 ? `Ganhou moedas: ${reason}` : `Gastou moedas: ${reason}`, points: amount });
      }
      setRecentActivities(prev => [{ id: `act-${Date.now()}`, type: 'XP_EARNED', description: reason, created_at: new Date().toISOString() }, ...prev]);
      return;
    }
    try {
      const docRef = doc(db, 'users', user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentCoins = docSnap.data().winfCoins || 0;
        const currentXp = docSnap.data().w_rank_xp || 0;
        const prevLevel = docSnap.data().w_rank_level || 'Iniciante';
        
        const nextXp = currentXp + xp;
        const nextLevel = calculateRankLevel(nextXp);
        const levelUp = prevLevel !== nextLevel;

        await updateDoc(docRef, {
          winfCoins: currentCoins + amount,
          w_rank_xp: nextXp,
          w_rank_level: nextLevel
        });
        
        await addDoc(collection(db, 'coin_ledger'), {
          user_id: user.id,
          amount: amount,
          description: reason,
          action_type: amount > 0 ? 'EARN' : 'SPEND',
          created_at: new Date().toISOString()
        });

        const updatedProfile = await fetchUserProfile(user.id);
        if (updatedProfile) setUser(updatedProfile);
        await fetchCoinLedger();
        
        if (levelUp) {
          setNotification({ 
            show: true, 
            message: `🏆 EVOLUÇÃO DE PATENTE! Parabéns! Você avançou para a patente <strong>${nextLevel}</strong>!`, 
            points: amount 
          });
        } else {
          setNotification({ show: true, message: amount > 0 ? `Ganhou moedas: ${reason}` : `Gastou moedas: ${reason}`, points: amount });
        }
        setRecentActivities(prev => [{ id: `act-${Date.now()}`, type: 'XP_EARNED', description: reason, created_at: new Date().toISOString() }, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const redeemMarketingActivation = useCallback(async (serviceName: string, cost: number) => {
    if (!user || user.winfCoins < cost) return { success: false, error: 'Pontos de performance insuficientes' };

    try {
      await updateUserCoins(-cost, `Ativação de Marketing: ${serviceName}`);
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user, updateUserCoins]);

  const gamify = useCallback((action: GamificationAction, details?: any) => {
    let points = 0; let xp = 0; let message = '';
    switch (action) {
      case 'COMMENT': points = 15; xp = 5; message = 'Você ganhou <strong>Pontos</strong> por interagir!'; break;
      case 'POST': points = 20; xp = 10; message = 'Publicação realizada! <strong>+20 Pontos</strong>.'; break;
      case 'SHARE': points = 25; xp = 10; message = 'Obrigado por compartilhar!'; break;
      case 'LOGIN': points = 10; xp = 5; message = 'Bônus de acesso diário.'; break;
      case 'AI_GENERATED': points = 30; xp = 15; message = 'Conteúdo IA gerado! <strong>+30 Pontos</strong>.'; break; // Added XP for AI_GENERATED
      case 'LEAD_ADDED': points = 40; xp = 20; message = 'Novo lead capturado!'; break;
      case 'WARRANTY_REGISTERED': points = 50; xp = 25; message = 'Garantia registrada. Bom trabalho!'; break;
      case 'COURSE_COMPLETED': points = 60; xp = 30; message = 'Módulo da Academy concluído!'; break;
      case 'ACADEMY_COMPLETED': points = 100; xp = 50; message = 'Curso concluído na Academy! <strong>+100 Pontos</strong>.'; break;
      case 'SCHEDULE_POST': points = 25; xp = 10; message = 'Postagem agendada!'; break;
      case 'SALE_CLOSED': points = 50; xp = 25; message = 'Pedido finalizado! <strong>Dica: Guarde retalhos!</strong> Registre-os no estoque para otimizar futuras instalações.'; break;
      case 'REDEEM': points = -details?.cost || 0; xp = 0; message = `Resgate de ${details?.item || 'item'} concluído.`; break;
    }
    if (points !== 0 || xp !== 0) updateUserCoins(points, message, xp);
    else if (message) setNotification({ show: true, message, points: 0 });
  }, [user?.id]);

  const closeNotification = useCallback(() => setNotification(prev => ({ ...prev, show: false })), []);

  const triggerNotification = useCallback((title: string, message: string) => {
    setNotification({ show: true, message, points: 0, title });
  }, []);

  const toggleFavorite = useCallback((moduleId: string) => {
    setFavoriteModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  }, [setFavoriteModules]);

  const addAuditLog = useCallback(async (action: string, targetUserId: string, details: string) => {
    if (user?.id) {
      await addDoc(collection(db, 'security_audits'), {
        adminId: user.id,
        adminEmail: user.email,
        action: action,
        targetUserId: targetUserId,
        details: details,
        timestamp: serverTimestamp()
      });
    }
  }, [user?.id, user?.email]);

  // Installation Jobs State
  const [installationJobs, setInstallationJobs] = useState<InstallationJob[]>(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const diffToSaturday = 6 - currentDayOfWeek;
    const saturdayDate = new Date(today);
    saturdayDate.setDate(today.getDate() + diffToSaturday);

    return [
    {
      id: 'job-1',
      service_order_id: 'OS-2025-001',
      customer_name: 'Marcos Paulo',
      vehicle_model: 'Porsche 911 Carrera',
      collaborator_id: '1',
      status: 'in_progress',
      measurements: { windshield: '1.2m x 0.8m', sides: '0.9m x 0.5m' },
      media: { photos: [], videos: [] },
      created_at: new Date().toISOString(),
      scheduled_date: new Date().toISOString()
    },
    {
      id: 'job-2',
      service_order_id: 'OS-2025-002',
      customer_name: 'Ana Beatriz',
      vehicle_model: 'BMW X5',
      collaborator_id: '2',
      status: 'pending',
      measurements: { windshield: '1.3m x 0.8m', sides: '1.0m x 0.5m' },
      media: { photos: [], videos: [] },
      created_at: new Date().toISOString(),
      scheduled_date: saturdayDate.toISOString() // Saturday
    },
    {
      id: 'job-3',
      service_order_id: 'OS-2025-003',
      customer_name: 'Roberto Luiz',
      vehicle_model: 'Tesla Model 3',
      collaborator_id: '1',
      status: 'pending',
      measurements: { windshield: '1.2m x 0.9m', sides: '0.8m x 0.4m' },
      media: { photos: [], videos: [] },
      created_at: new Date().toISOString(),
      scheduled_date: '' // Unscheduled
    }
  ]});

  const addInstallationJob = useCallback(async (job: any) => {
    const newJob: InstallationJob = {
      id: `job-${Date.now()}`,
      ...job,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    setInstallationJobs(prev => [newJob, ...prev]);
    return { success: true, error: null };
  }, []);

  const updateInstallationJob = useCallback(async (id: string, updates: any) => {
    setInstallationJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
    return { success: true, error: null };
  }, []);

  const completeJobAndGenerateWarranty = useCallback(async (jobId: string, additionalData?: { vehiclePlate: string, rollSerialNumber?: string, areaUsedM2?: number }) => {
    const job = installationJobs.find(j => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found' };

    try {
        if (user?.id?.startsWith('proto-')) {
          setInstallationJobs(prev => prev.map(j => j.id === jobId ? { 
            ...j, 
            status: 'completed', 
            completed_at: new Date().toISOString(),
            warranty_id: 'mock-warr-123',
            vehicle_plate: additionalData?.vehiclePlate
          } : j));
  
          setWarranties(prev => [{
            id: 'mock-warr-123',
            customerName: job.customer_name,
            productLine: job.chosen_film || 'Winf AeroCore',
            serialNumber: job.service_order_id,
            purchaseDate: new Date().toISOString(),
            status: 'Ativa',
            agent_status: 'pending',
            licenciado_id: user?.id,
            vehiclePlate: additionalData?.vehiclePlate,
            serviceOrderId: job.service_order_id,
            installerId: user?.id,
            installerName: user?.name || 'Instalador Winf',
            architectId: job.architect_id,
            architectName: job.architect_id ? 'Arquiteto / Especificador Parceiro' : undefined
          } as any, ...prev]);
  
          // Auto-sync with Financial Module (Caixa Pendente)
          const transactionValueProto = parseFloat(job.service_order_id.replace(/\D/g, '')) || 350;
          await addTransaction({
              description: `Recebimento OS: ${job.customer_name} (${job.chosen_film})`,
              type: 'income',
              amount: transactionValueProto,
              category: 'Serviços',
              status: 'pending' // Enters as Pending automatically
          });

          await updateUserCoins(150, 'OS Concluída & Certificado Emitido', 250);
          return { success: true, warrantyId: 'mock-warr-123', error: null };
        }

        // WINF.OS™ Zero-Trust Cloud Function Interaction
        const result = await winfApi.completeInstallation({
            osId: jobId,
            rollSerialNumber: additionalData?.rollSerialNumber || 'MOCK-ROLL-001',
            areaUsedM2: additionalData?.areaUsedM2 || 2.5,
            photos: ['mock-photo.jpg'],
            customerId: job.customer_name || 'Anonymous'
        });

        // Update Job Optimistically
        setInstallationJobs(prev => prev.map(j => j.id === jobId ? { 
          ...j, 
          status: 'completed', 
          completed_at: new Date().toISOString(),
          warranty_id: result.warranty_id,
          vehicle_plate: additionalData?.vehiclePlate
        } : j));

        setWarranties(prev => [{
          id: result.warranty_id,
          customerName: job.customer_name,
          productLine: job.chosen_film || 'Winf AeroCore',
          serialNumber: job.service_order_id,
          purchaseDate: new Date().toISOString(),
          status: 'Ativa',
          agent_status: 'pending',
          licenciado_id: user?.id,
          vehiclePlate: additionalData?.vehiclePlate,
          serviceOrderId: job.service_order_id,
          installerId: user?.id,
          installerName: user?.name,
          architectId: job.architect_id,
          architectName: job.architect_id ? 'Arquiteto / Especificador Parceiro' : undefined
        } as any, ...prev]);

        // Auto-sync with Financial Module (Caixa Pendente)
        const transactionValue = parseFloat(job.service_order_id.replace(/\D/g, '')) || 350; // Mock value logic if OS didn't have total
        await addTransaction({
            description: `Recebimento OS: ${job.customer_name} (${job.chosen_film})`,
            type: 'income',
            amount: transactionValue,
            category: 'Serviços',
            status: 'pending' // Enters as Pending automatically
        });

        // Note: gamify and other internal things shouldn't directly modify secure db without admin,
        // The cloud function already added the WINFCoins via 'coin_ledger'.
        // gamify('WARRANTY_REGISTERED');
        // Let's just update local stat for Prototype:
        setUser(prev => prev ? { ...prev, winfCoins: (prev.winfCoins || 0) + result.coins_earned } : null);

        return { success: true, warrantyId: result.warranty_id, error: null };

    } catch (e: any) {
        console.error("WINF.OS™ Security Hub Rejeitou a Operação:", e.message);
        return { success: false, error: e.message };
    }
  }, [installationJobs, user?.id]);

  const fetchLeads = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { 
      setLeads([
        { 
          id: 'lead1', user_id: user?.id || 'proto', name: 'Ricardo Santos (Porsche 911)', contact: '11999991234', source: 'Instagram Ads', interest: 'NeoSkin PPF Gloss', status: 'Zona de Ataque', ai_score: 95, 
          dominance_score: 92, decay_level: 80, last_paradox_truth: 'Cliente busca status, mas teme o custo invisível da manutenção.', last_paradox_maneuver: 'Focar na Valorização de Ativo e Revenda Garantida.' 
        },
        { 
          id: 'lead2', user_id: user?.id || 'proto', name: 'Amanda Carvalho (Audi Q8)', contact: '13988887766', source: 'W.A.R.P Search', interest: 'AeroCore NanoCeramic', status: 'Zona de Pressão', ai_score: 70,
          dominance_score: 68, decay_level: 40, last_paradox_truth: 'Comparando Winf com película comum. Medo de ser "enganado" por marketing.', last_paradox_maneuver: 'Demonstração Técnica da Grade Molecular e Certificado MIL-SPEC.'
        },
        { 
          id: 'lead3', user_id: user?.id || 'proto', name: 'Condomínio Prime (Arquitetura)', contact: '11977775544', source: 'Select Pro Portal', interest: 'Winf Select IR-99', status: 'Zona de Ataque', ai_score: 88,
          dominance_score: 85, decay_level: 90, last_paradox_truth: 'Decisão coletiva. Síndico focado em redução de custo energético.', last_paradox_maneuver: 'Apresentar Laudo de ROI Energético e Garantia de 15 Anos.'
        },
      ]);
      return; 
    } 
    try {
      const q = query(collection(db, 'leads'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadType));
      setLeads(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'leads');
    }
  }, [user?.id]);

  const fetchPublicLeads = useCallback(async () => {
    if (user?.id?.startsWith('proto-')) {
      setPublicLeads([
        { 
          id: 'public-1', name: 'Investidor Imobiliário (SP)', contact: '11912345678', source: 'Google Ads (Novos Negócios)', interest: 'AeroCore™ Whole Building', status: 'Novo', ai_score: 98, 
          dominance_score: 90, decay_level: 100, is_public: true, campaign_name: 'Campanha SP - Centro'
        },
        { 
          id: 'public-2', name: 'Ricardo Alencar (Santos)', contact: '13976543210', source: 'Instagram (Novos Negócios)', interest: 'Select Invisible IR-99', status: 'Novo', ai_score: 92, 
          dominance_score: 85, decay_level: 100, is_public: true, campaign_name: 'Retargeting Arquitetura'
        },
        { 
          id: 'public-3', name: 'Paula Arquiteta (Curitiba)', contact: '41944445555', source: 'Architect Portal', interest: 'Parceria NeoSkin', status: 'Novo', ai_score: 85, 
          dominance_score: 75, decay_level: 95, is_public: true
        },
        { 
          id: 'public-4', name: 'Usuário Totem BarraShopping', contact: '21933334444', source: 'Kiosk Mode', interest: 'BlackPro Automotive', status: 'Novo', ai_score: 80, 
          dominance_score: 65, decay_level: 100, is_public: true
        },
      ]);
      return;
    }
    try {
      const q = query(collection(db, 'leads'), where('is_public', '==', true), where('is_distributed', '==', false));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadType));
      setPublicLeads(data);
    } catch (e) {
      console.error('Error fetching public leads:', e);
    }
  }, [user?.id]);

  const claimLead = useCallback(async (leadId: string) => {
    if (!user?.id) return { success: false, error: 'Auth required' };
    
    if (user.id.startsWith('proto-')) {
      const leadToClaim = publicLeads.find(l => l.id === leadId);
      if (!leadToClaim) return { success: false, error: 'Lead not found in Pool' };

      const claimedLead = { 
        ...leadToClaim, 
        user_id: user.id, 
        is_public: false, 
        is_distributed: true, 
        assigned_to_id: user.id,
        assigned_to_name: user.name,
        distributed_at: new Date().toISOString(),
        status: 'Reivindicado'
      };

      setPublicLeads(prev => prev.filter(l => l.id !== leadId));
      setLeads(prev => [claimedLead, ...prev]);
      gamify('LEAD_ADDED');
      setNotification({ show: true, message: `Lead ${leadToClaim.name} adicionado à sua carteira!`, points: 10 });
      
      return { success: true, error: null };
    }

    try {
      const leadRef = doc(db, 'leads', leadId);
      const updates = {
        user_id: user.id,
        is_public: false,
        is_distributed: true,
        assigned_to_id: user.id,
        assigned_to_name: user.name,
        distributed_at: new Date().toISOString(),
        status: 'Reivindicado'
      };
      
      await updateDoc(leadRef, updates);
      
      // Update local state
      const leadData = publicLeads.find(l => l.id === leadId);
      if (leadData) {
        setPublicLeads(prev => prev.filter(l => l.id !== leadId));
        setLeads(prev => [{ ...leadData, ...updates }, ...prev]);
      }
      
      gamify('LEAD_ADDED');
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user, publicLeads, gamify]);

  const addLead = useCallback(async (lead: any) => {
    const userId = lead.is_public ? 'system-public-inbox' : (user?.id || 'system-public-inbox');
    if (user?.id?.startsWith('proto-')) { 
      const newLead = { 
        ...lead, 
        id: `demo-lead-${Date.now()}`, 
        user_id: lead.is_public ? 'system-public-inbox' : userId, 
        created_at: new Date().toISOString(),
        dominance_score: lead.dominance_score || 50, 
        decay_level: lead.decay_level || 100, 
        agent_status: 'pending'
      };
      if (lead.is_public) {
        setPublicLeads(prev => [newLead, ...prev]);
      } else {
        setLeads(prev => [newLead, ...prev]);
      }
      gamify('LEAD_ADDED');
      return { success: true, error: null };
    }
    try {
      const leadData = { 
        ...lead, 
        user_id: userId, 
        created_at: new Date().toISOString(), 
        agent_status: 'pending',
        is_distributed: false,
        is_public: lead.is_public || false
      };
      const docRef = await addDoc(collection(db, 'leads'), leadData);
      const newLead = { id: docRef.id, ...leadData };
      
      if (lead.is_public) {
        setPublicLeads(prev => [newLead as any, ...prev]);
      } else if (user?.id === userId) {
        setLeads(prev => [newLead as any, ...prev]);
        gamify('LEAD_ADDED');
      }
      
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, gamify]);

  const updateLead = useCallback(async (id: string, updates: any) => {
    if (user?.id?.startsWith('proto-')) { setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l)); return { success: true, error: null }; }
    try {
      await updateDoc(doc(db, 'leads', id), updates);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const deleteLead = useCallback(async (id: string) => {
    if (user?.id?.startsWith('proto-')) { setLeads(prev => prev.filter(l => l.id !== id)); return { success: true, error: null }; }
    try {
      await deleteDoc(doc(db, 'leads', id));
      setLeads(prev => prev.filter(l => l.id !== id));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const deleteProfile = useCallback(async (id: string) => {
    if (user?.id?.startsWith('proto-')) { setMembers(prev => prev.filter(m => m.id !== id)); return { success: true, error: null }; }
    try {
      await deleteDoc(doc(db, 'users', id));
      await addAuditLog('delete', id, 'Deleted user profile');
      setMembers(prev => prev.filter(m => m.id !== id));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, addAuditLog]);

  const fetchWarranties
 = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { 
      setWarranties([
        { id: 'warr1', customerName: 'João Silva', customerEmail: 'joao@email.com', productLine: 'AeroCore™ Nano-Ceramic', serialNumber: 'SN-123456', purchaseDate: new Date().toISOString().split('T')[0], coverage: '5 years', status: 'Active' },
      ]);
      return; 
    } 
    try {
      const q = query(collection(db, 'warranties'), where('licenciado_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const warrantiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setWarranties(warrantiesData ? warrantiesData.map(w => ({ 
        id: w.id, 
        customerName: w.customer_name, 
        customerEmail: w.customer_email, 
        customerPhone: w.customer_phone,
        productLine: w.product_line, 
        serialNumber: w.serial_number, 
        purchaseDate: w.installation_date || '', 
        coverage: w.coverage_period || '', 
        status: w.status || '',
        quoteId: w.quote_id,
        serviceOrderId: w.service_order_id,
        installerId: w.installer_id,
        installerName: w.installer_name,
        architectId: w.architect_id,
        architectName: w.architect_name
      })) : []);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'warranties');
    }
  }, [user?.id]);

  const fetchWarrantyBySerialNumber = useCallback(async (serialNumber: string) => {
    try {
      const q = query(collection(db, 'warranties'), where('serial_number', '==', serialNumber), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const w = querySnapshot.docs[0].data();
      return { 
        id: querySnapshot.docs[0].id, 
        customerName: w.customer_name, 
        customerEmail: w.customer_email, 
        customerPhone: w.customer_phone,
        productLine: w.product_line, 
        serialNumber: w.serial_number, 
        purchaseDate: w.installation_date || '', 
        coverage: w.coverage_period || '', 
        status: w.status || '',
        quoteId: w.quote_id,
        serviceOrderId: w.service_order_id,
        installerId: w.installer_id,
        installerName: w.installer_name,
        architectId: w.architect_id,
        architectName: w.architect_name
      } as WarrantyRegistration;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `warranties/${serialNumber}`);
      return null;
    }
  }, []);

  const fetchQuoteById = useCallback(async (quoteId: string) => {
    // If the quoteId matches the shortened REF code format, we need to query differently or fetch and filter
    // Since quoteId is just the doc id, we can try to look up by doc id first. 
    // If they just typed the first 8 characters, Firestore doesn't support startswith on document IDs easily, 
    // but the users might type the full ID or we could have stored a shortId. Realistically we should fetch it by id.
    try {
      // First try direct lookup assuming they pasted the full ID
      try {
        const docRef = doc(db, 'quotes', quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Quote;
        }
      } catch (e) {
        // Ignored, try querying all for the short ID
      }
      
      // If direct lookup fails (e.g. short ID provided), fetch and find matching
      const q = query(collection(db, 'quotes'));
      const querySnapshot = await getDocs(q);
      const matched = querySnapshot.docs.find(d => d.id === quoteId || d.id.substring(0, 8).toUpperCase() === quoteId.toUpperCase());
      if (matched) {
        return { id: matched.id, ...matched.data() } as Quote;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `quotes/${quoteId}`);
      return null;
    }
  }, []);

  const registerWarranty = useCallback(async (data: any) => {
    if (!user?.id) return { success: false, error: "Auth required" };
    if (user?.id?.startsWith('proto-')) {
      const newWarranty = { 
        ...data, 
        id: `demo-warranty-${Date.now()}`, 
        licenciado_id: user.id, 
        status: 'Active', 
        coverage: '10 years', 
        serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`, 
        created_at: new Date().toISOString() 
      };
      setWarranties(prev => [newWarranty, ...prev]);
      gamify('WARRANTY_REGISTERED');
      return { success: true, error: null, warranty: newWarranty };
    }
    const sn = `SN-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const docData = { 
        licenciado_id: user.id, 
        customer_name: data.customerName, 
        customer_email: data.customerEmail || null, 
        customer_phone: data.customerPhone || null,
        product_line: data.productLine, 
        serial_number: sn, 
        installation_date: data.purchaseDate, 
        quote_id: data.quoteId || null,
        service_order_id: data.serviceOrderId || null,
        installer_id: data.installerId || null,
        installer_name: data.installerName || null,
        architect_id: data.architectId || null,
        architect_name: data.architectName || null,
        status: 'Active',
        created_at: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'warranties'), docData);
      await fetchWarranties(); 
      gamify('WARRANTY_REGISTERED');
      return { success: true, error: null, warranty: { id: docRef.id, ...docData } };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, gamify, fetchWarranties]);

  const fetchProducts = useCallback(async () => {
    if (!user || user?.id?.startsWith('proto-')) { 
      setProducts([
        { 
          id: 'prod-invisible', 
          name: 'Winf Select™ Invisible', 
          line: 'WINF Select™', 
          description: 'Linha Arquitetura IR Advanced Ceramic. 100% UV, 86% IR. Tecnologia NanoCeramic de última geração.', 
          benefits: ['100% Rejeição UV', '86% Rejeição IR', 'Alta Transparência', 'Não interfere em sinais'],
          category: 'Arquitetura', 
          thickness: '2 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 10,
          thermal_score: 9, 
          light_score: 8, 
          shield_score: 7, 
          privacy_score: 3, 
          price: 280.00, 
          image_url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705', 
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [0.50, 0.75, 1.00, 1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '70%', irr: '86%', uvr: '100%', tser: '58%' }
        },
        { 
          id: 'prod-silver', 
          name: 'Winf Select™ Silver', 
          line: 'WINF Select™', 
          description: 'Arquitetura Refletiva. Máxima rejeição de calor com efeito espelhado.', 
          benefits: ['Privacidade Extrema Diurna', 'Máxima Rejeição Térmica', 'Aparência Moderna'],
          category: 'Arquitetura', 
          thickness: '1.5 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 5,
          thermal_score: 9, 
          light_score: 4, 
          shield_score: 2, 
          privacy_score: 10, 
          price: 200, 
          image_url: null,
          stock_quantity: 400,
          is_active: true,
          available_widths: [1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '20%', irr: '75%', uvr: '99%', tser: '80%' }
        },
        { 
          id: 'prod-dual', 
          name: 'Winf Select™ Dual Reflect', 
          line: 'WINF Select™', 
          description: 'Arquitetura Metalizada. Equilíbrio perfeito entre privacidade e rejeição térmica.', 
          benefits: ['Alta Privacidade Diurna', 'Rejeição Térmica Superior', 'Redução de Brilho'],
          category: 'Arquitetura', 
          thickness: '1.5 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 7,
          thermal_score: 8, 
          light_score: 6, 
          shield_score: 6, 
          privacy_score: 8, 
          price: 160.00, 
          image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [0.50, 0.75, 1.00, 1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '15%', irr: '81%', uvr: '99%', tser: '72%' }
        },
        { 
          id: 'prod-blackpro', 
          name: 'Winf Select™ BlackPro', 
          line: 'WINF Select™', 
          description: 'Arquitetura Não Metalizada. Estética premium com alta durabilidade.', 
          benefits: ['Cor Estável', 'Sem Interferência', 'Fácil Aplicação'],
          category: 'Arquitetura', 
          thickness: '1.5 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 7,
          thermal_score: 7, 
          light_score: 4, 
          shield_score: 6, 
          privacy_score: 9, 
          price: 140.00, 
          image_url: 'https://images.unsplash.com/photo-1502672260273-b3db776b971a', 
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [0.50, 0.75, 1.00, 1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '05%', irr: '73%', uvr: '99%', tser: '65%' }
        },
        { 
          id: 'prod-white', 
          name: 'Winf Select™ White', 
          line: 'WINF Select™', 
          description: 'Série Nanocristalina Arquitetônica.', 
          benefits: ['Máxima Transparência', 'Escudo Térmico'],
          category: 'Arquitetura', 
          thickness: '1.5 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 10,
          thermal_score: 8, 
          light_score: 9, 
          shield_score: 5, 
          privacy_score: 2, 
          price: 160.00, 
          image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop',
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [0.50, 0.75, 1.00, 1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '75%', irr: '90%', uvr: '99.9%', tser: '55%' }
        },
        { 
          id: 'prod-security-2', 
          name: 'Winf Security® Nível 2', 
          line: 'WINF Select™', 
          description: 'Barreira Anti-Impacto.', 
          benefits: ['Muralha Invisível'],
          category: 'Arquitetura', 
          thickness: '4 Mil',
          dimensions: '1.52m x 30m',
          warranty_years: 10,
          thermal_score: 5, 
          light_score: 9, 
          shield_score: 9, 
          privacy_score: 2, 
          price: 200.00,
          image_url: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2400',
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '89%', irr: 'N/A', uvr: '99%', tser: 'N/A' }
        },
        { 
          id: 'prod-security-3', 
          name: 'Winf Security® Nível 3', 
          line: 'WINF Select™', 
          description: 'Barreira Anti-Impacto.', 
          benefits: ['Muralha Invisível'],
          category: 'Arquitetura', 
          thickness: '6 Mil',
          dimensions: '1.52m x 30m',
          warranty_years: 10,
          thermal_score: 5, 
          light_score: 9, 
          shield_score: 10, 
          privacy_score: 2, 
          price: 240.00,
          image_url: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2400',
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '89%', irr: 'N/A', uvr: '99%', tser: 'N/A' }
        },
        { 
          id: 'prod-security-4', 
          name: 'Winf Security® Nível 4', 
          line: 'WINF Select™', 
          description: 'Barreira Anti-Impacto.', 
          benefits: ['Muralha Invisível'],
          category: 'Arquitetura', 
          thickness: '8 Mil',
          dimensions: '1.52m x 30m',
          warranty_years: 10,
          thermal_score: 5, 
          light_score: 9, 
          shield_score: 10, 
          privacy_score: 2, 
          price: 300.00,
          image_url: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2400',
          stock_quantity: 500, 
          is_active: true, 
          available_widths: [1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '89%', irr: 'N/A', uvr: '99%', tser: 'N/A' }
        },
        { 
          id: 'prod-shadow', 
          name: 'ShadowCarbon™', 
          line: 'WINF AeroCore™ MOBILE', 
          description: 'Tecnologia Carbon para fachadas premium. Estética negra profunda.', 
          benefits: ['Estética Premium', 'Rejeição de Calor', 'Sem Metal'],
          category: 'Arquitetura', 
          thickness: '1.5 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 5,
          thermal_score: 6, 
          light_score: 5, 
          shield_score: 8, 
          privacy_score: 7, 
          price: 350.00, 
          image_url: 'https://images.unsplash.com/photo-1579586311681-35b866596b6d', 
          stock_quantity: 200, 
          is_active: true, 
          available_widths: [0.50, 0.75, 1.00, 1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '20%', irr: '65%', uvr: '99%', tser: '52%' }
        },
        { 
          id: 'prod-aerocore-99', 
          name: 'AeroCore™ IR-99', 
          line: 'WINF AeroCore™', 
          description: 'A elite da proteção térmica. Rejeição de infravermelho próxima da perfeição.', 
          benefits: ['99.8% Rejeição IR', 'Conforto Térmico Extremo', 'Nitidez Cristalina'],
          category: 'Arquitetura', 
          thickness: '2 mil',
          dimensions: '1.52m x 30m',
          warranty_years: 15,
          thermal_score: 10, 
          light_score: 9, 
          shield_score: 9, 
          privacy_score: 4, 
          price: 890.00, 
          image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e', 
          stock_quantity: 150, 
          is_active: true, 
          available_widths: [0.50, 0.75, 1.00, 1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '70%', irr: '99.8%', uvr: '100%', tser: '62%' }
        },
        { 
          id: 'prod-neoskin', 
          name: 'NeoSkin ADV™', 
          line: 'WINF AeroCore™ | NeoSkin', 
          description: 'Paint Protection Film de alta resistência. Autocura térmica e brilho hidrofóbico. Sub-marca oficial AeroCore™.', 
          benefits: ['Proteção extrema contra Impactos', 'Self-Healing Rápido', 'Resistência Química'],
          category: 'PPF', 
          thickness: '8 mil',
          dimensions: '1.52m x 15m',
          warranty_years: 10,
          thermal_score: 3, 
          light_score: 10, 
          shield_score: 10, 
          privacy_score: 1, 
          price: 2500.00, 
          image_url: 'https://images.unsplash.com/photo-1507089947368-19c1da977535', 
          stock_quantity: 40, 
          is_active: true, 
          available_widths: [1.52],
          created_at: new Date().toISOString(),
          tech_specs: { vlt: '92%', irr: '25%', uvr: '100%', tser: '15%' }
        },
        { 
          id: 'prod-insumo-tools', 
          name: 'Kit Insumos & Ferramentas Master', 
          line: 'WINF BLACKSHOP™', 
          description: 'Reposição oficial de ferramentas, lâminas de titânio, espátulas de precisão e fluidos de aplicação Winf OS.', 
          benefits: ['Qualidade Homologada', 'Ferramentas de Titânio', 'Fluido de Aplicação Exclusivo'],
          category: 'Insumos', 
          price: 550.00, 
          image_url: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab', 
          stock_quantity: 150, 
          is_active: true, 
          created_at: new Date().toISOString(),
        },
        { 
          id: 'prod-marketing-pack', 
          name: 'Pacote de Marketing Digital (Mensal)', 
          line: 'WINF PARTNERS™', 
          description: 'Pack de artes, vídeos em 4k, roteiros para reels e banners digitais homologados pela Winf. Atualizado mensalmente.', 
          benefits: ['Material Premium 4K', 'Roteiros Validados', 'Posicionamento de Alto Valor'],
          category: 'Marketing', 
          price: 350.00, 
          image_url: 'https://images.unsplash.com/photo-1557838923-298493635a8f', 
          stock_quantity: 999, 
          is_active: true, 
          created_at: new Date().toISOString(),
        },
        { 
          id: 'prod-ads-traffic', 
          name: 'Assessoria de Tráfego & Impulsionamento', 
          line: 'WINF OS™', 
          description: 'Nossa equipe de performance cria, otimiza e gerencia suas campanhas de Ads locais para atração de leads High-Ticket.', 
          benefits: ['Gestão Profissional', 'Relatórios Mensais', 'Foco no Público Certo'],
          category: 'Marketing', 
          price: 900.00, 
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 
          stock_quantity: 50, 
          is_active: true, 
          created_at: new Date().toISOString(),
        },
        { 
          id: 'prod-uniforms', 
          name: 'Kit Vestuário & Uniformes', 
          line: 'WINF BLACKSHOP™', 
          description: 'Camisas polo, camisetas em algodão egípcio e jaquetas corta-vento com a marca exclusiva Winf e seu nome.', 
          benefits: ['Algodão Premium', 'Estilo Tático & Clean', 'Apresentação Profissional'],
          category: 'Vestuário', 
          price: 420.00, 
          image_url: 'https://images.unsplash.com/photo-1618354691438-25af04751493', 
          stock_quantity: 200, 
          is_active: true, 
          created_at: new Date().toISOString(),
        },
        { 
          id: 'prod-cleaner-master', 
          name: 'Solução Prep Elite (5L)', 
          line: 'WINF OS™', 
          description: 'Fluido concentrado para limpeza profunda e preparação de vidros antes da aplicação de películas Nano.', 
          benefits: ['Limpeza Inteligente', 'Sem Resíduos', 'Alto Rendimento'],
          category: 'Insumos', 
          price: 180.00, 
          image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', 
          stock_quantity: 100, 
          is_active: true, 
          created_at: new Date().toISOString(),
        }
      ]);
      return;
    }
    try {
      const q = query(collection(db, 'products'), where('is_active', '==', true));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }, [user?.id]);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { setOrders([]); return; } 
    try {
      const q = query(collection(db, 'orders'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  }, [user?.id]);

  const fetchInstallations = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { setInstallations([]); return; }
    try {
      const q = query(collection(db, 'installations'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setInstallations(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'installations');
    }
  }, [user?.id]);

  const fetchInstallationById = useCallback(async (id: string) => {
    try {
      const docRef = doc(db, 'installations', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Installation;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `installations/${id}`);
      return null;
    }
  }, []);

  const registerInstallation = useCallback(async (data: any) => {
    if (!user?.id) return { success: false, error: "Auth required" };
    
    const installationId = `INST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const qrCodeUrl = `https://winf.app/certificate/${installationId}`;
    
    const installationData = {
      ...data,
      id: installationId,
      user_id: user.id,
      installer_id: user.id,
      installer_name: user.name,
      qr_code_url: qrCodeUrl,
      status: 'completed',
      agent_status: 'pending',
      created_at: new Date().toISOString()
    };

    if (user?.id?.startsWith('proto-')) {
      setInstallations(prev => [installationData, ...prev]);
      
      // Auto-generate warranty
      const warrantyId = `W-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const newWarranty: WarrantyRegistration = {
        id: warrantyId,
        customerName: data.client_name,
        customerEmail: data.client_email,
        productLine: data.product_name,
        serialNumber: installationId,
        purchaseDate: data.date,
        status: 'Active',
        licenciado_id: user.id,
        created_at: new Date().toISOString()
      };
      setWarranties(prev => [newWarranty, ...prev]);
      
      gamify('INSTALLATION_REGISTERED');
      return { success: true, error: null };
    }
    try {
      await setDoc(doc(db, 'installations', installationId), installationData);
      
      // Also register warranty in Firestore
      const warrantyId = `W-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      await addDoc(collection(db, 'warranties'), {
        licenciado_id: user.id,
        customer_name: data.client_name,
        customer_email: data.client_email,
        product_line: data.product_name,
        serial_number: installationId,
        installation_date: data.date,
        status: 'Active',
        created_at: new Date().toISOString()
      });

      setInstallations(prev => [installationData, ...prev]);
      await fetchWarranties();
      gamify('INSTALLATION_REGISTERED');
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, gamify, fetchWarranties]);

  const createOrder = useCallback(async (items: any[], shippingAddress: any, paymentMethod: string) => {
    if (!user?.id) return { success: false, error: "Auth required" };
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    if (user?.id?.startsWith('proto-')) {
      const newOrder = { id: `demo-order-${Date.now()}`, user_id: user.id, total_amount: total, status: 'completed', created_at: new Date().toISOString() };
      setOrders(prev => [newOrder, ...prev]);
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'orders'), { user_id: user.id, total_amount: total, status: 'completed', created_at: new Date().toISOString() });
      const orderItems = items.map(i => ({ order_id: docRef.id, product_id: i.product_id, quantity: i.quantity, unit_price: i.unit_price }));
      for (const item of orderItems) {
        await addDoc(collection(db, 'order_items'), item);
      }
      
      // Automatically add to stock for members
      for (const item of items) {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
              await addStockItem({
                  product_id: product.id,
                  product_name: product.name,
                  total_meters: 30 * item.quantity, // Assuming 30m per roll
                  width: 1.52,
                  remaining_meters: 30 * item.quantity
              });
          }
      }
      
      await fetchOrders();
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, fetchOrders, products]);

  const addStockItem = useCallback(async (item: any) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      const newItem = { ...item, id: `stock-${Date.now()}`, user_id: user.id, created_at: new Date().toISOString() };
      setStockItems(prev => [newItem, ...prev]);
      setStockHistory(prev => [{ id: `hist-${Date.now()}`, user_id: user.id, product_id: item.product_id, product_name: item.product_name, type: 'IN', amount: item.total_meters, date: new Date().toISOString() }, ...prev]);
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'stock_items'), { ...item, user_id: user.id });
      setStockItems(prev => [{ id: docRef.id, ...item, user_id: user.id }, ...prev]);
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);
  const fetchAiGenerations = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { 
      setAiGenerations([{ id: 'ai1', user_id: user.id, tool_used: 'Vision', prompt: 'Porsche 911 protected...', output_url: 'https://images.unsplash.com/photo-1618557219623-64a2747bb7eb', media_type: 'image/png', created_at: new Date().toISOString() }]);
      return; 
    }
    try {
      const q = query(collection(db, 'ai_generations'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setAiGenerations(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'ai_generations');
    }
  }, [user?.id]);

  const saveAiGeneration = useCallback(async (gen: any) => {
    if (!user?.id) return { success: false, error: "Auth required" };
    if (user?.id?.startsWith('proto-')) {
      const newGen = { ...gen, id: `demo-ai-${Date.now()}`, user_id: user.id, created_at: new Date().toISOString() };
      setAiGenerations(prev => [newGen, ...prev]);
      gamify('AI_GENERATED');
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'ai_generations'), { ...gen, user_id: user.id });
      setAiGenerations(prev => [{ id: docRef.id, ...gen, user_id: user.id }, ...prev]);
      gamify('AI_GENERATED');
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, gamify]);

  const fetchSocialPosts = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { setSocialPosts([]); return; } 
    try {
      const q = query(collection(db, 'social_posts'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setSocialPosts(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'social_posts');
    }
  }, [user?.id]);

  const fetchVehicles = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) { setVehicles([]); return; } 
    try {
      const q = query(collection(db, 'vehicles'), where('owner_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setVehicles(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'vehicles');
    }
  }, [user?.id]);

  const fetchPlatformEvents = useCallback(async () => {
    if (!user?.id) return; 
    if (user?.id?.startsWith('proto-')) { 
      setPlatformEvents([{ id: 'ev1', title: 'Global Townhall 2025', date: new Date().toISOString(), type: 'Online', host: 'CEO', created_at: new Date().toISOString(), target_roles: ['Admin', 'Licenciado', 'Member'] }]); 
      return; 
    } 
    try {
      const querySnapshot = await getDocs(collection(db, 'platform_events'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPlatformEvents(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'platform_events');
    }
  }, [user?.id]);

  const fetchMembers = useCallback(async () => {
    if (user?.role !== 'Admin') return;
    if (user?.id?.startsWith('proto-')) {
      setMembers([
        { id: 'u1', name: 'Tiago Winf', email: 'tiago@winf.com', role: 'Admin', winfCoins: 15000, w_rank_level: 'Sovereign' } as User,
        { id: 'u2', name: 'João Silva', email: 'joao@parceiro.com', role: 'Licenciado', winfCoins: 2500, w_rank_level: 'Master' } as User,
        { id: 'u3', name: 'Maria Oliveira', email: 'maria@membro.com', role: 'Member', winfCoins: 500, w_rank_level: 'Initiate' } as User,
        { id: 'u4', name: 'Carlos Souza', email: 'carlos@elite.com', role: 'Licenciado', winfCoins: 8000, w_rank_level: 'Elite' } as User,
      ]);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setMembers(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'users');
    }
  }, [user?.role]);

  const updateUserRole = async (userId: string, newRole: string) => {
    if (user?.role !== 'Admin') return;
    if (user?.id?.startsWith('proto-')) {
      setMembers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      return;
    }
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      await addAuditLog('update_role', userId, `Changed role to ${newRole}`);
      setMembers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const fetchDocumentItems = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      const mockDocs = DEFAULT_WINF_DOCUMENTS.map((d, index) => ({ ...d, id: `mock-doc-${index}` }));
      setDocumentItems(mockDocs);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, 'documents_master'));
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data() as any;
        // Merge with local defaults to ensure latest category names
        const localMatched = DEFAULT_WINF_DOCUMENTS.find(d => d.title === docData.title);
        if (localMatched) {
          docData.category = localMatched.category;
          docData.access_level = localMatched.access_level;
        }
        return { id: doc.id, ...docData };
      });
      
      const mergedData = [...data];
      DEFAULT_WINF_DOCUMENTS.forEach(defaultDoc => {
        if (!data.some(d => d.title === defaultDoc.title)) {
           mergedData.push({
             ...defaultDoc,
             id: 'df-' + defaultDoc.title.replace(/\s+/g, '-').toLowerCase()
           });
        }
      });
      
      setDocumentItems(mergedData);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'documents_master');
      const fallbacks = DEFAULT_WINF_DOCUMENTS.map((d, index) => ({ ...d, id: `mock-doc-${index}` }));
      setDocumentItems(fallbacks);
    }
  }, [user?.id]);

  const fetchTotalLeads = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      setTotalLeads(leads.length);
      return;
    }
    try {
      const q = query(collection(db, 'leads'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      setTotalLeads(querySnapshot.size);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'leads/count');
    }
  }, [user?.id, leads.length]);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      setTransactions([{ id: 'tx1', type: 'income', amount: 1500, description: 'Serviço Porsche', category: 'Vendas', paymentMethod: 'Pix', date: new Date().toISOString() }]);
      return;
    }
    try {
      const q = query(collection(db, 'transactions'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTransactions(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'transactions');
    }
  }, [user?.id]);

  const addTransaction = useCallback(async (tx: any) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      setTransactions(prev => [{ ...tx, id: `tx-${Date.now()}` }, ...prev]);
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'transactions'), { ...tx, user_id: user.id });
      setTransactions(prev => [{ id: docRef.id, ...tx, user_id: user.id }, ...prev]);
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const updateTransaction = useCallback(async (id: string, updates: any) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
      return { success: true, error: null };
    }
    try {
      await updateDoc(doc(db, 'transactions', id), updates);
      setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const fetchQuotes = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      setQuotes([
        { 
          id: 'quote-empresa-xyz', 
          customerName: 'Empresa XYZ', 
          customerCity: 'São Paulo, SP',
          items: [
            { 
              productId: 'prod-invisible', 
              description: 'Winf Select™ Invisible (Suprimento + Instalação)', 
              quantity: 50, 
              unitPrice: 1400 
            }
          ], 
          totalAmount: 70000, 
          status: 'Pending', 
          createdAt: new Date().toISOString(), 
          projectType: 'Architecture',
          measurements: '50m²'
        },
        { id: 'quote1', customerName: 'João Cliente', vehicleModel: 'Porsche 911', items: [], totalAmount: 12000, status: 'Approved', createdAt: new Date().toISOString(), projectType: 'Automotive' },
        { id: 'quote2', customerName: 'Edifício Luxo', vehicleModel: '', items: [], totalAmount: 45000, status: 'Pending', createdAt: new Date(Date.now() - 86400000).toISOString(), projectType: 'Architecture' },
      ]);
      return;
    }
    try {
      const q = query(collection(db, 'quotes'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setQuotes(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'quotes');
    }
  }, [user?.id]);

  const addQuote = useCallback(async (quote: any) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      setQuotes(prev => [{ ...quote, id: `quote-${Date.now()}`, createdAt: new Date().toISOString(), status: 'Pending' }, ...prev]);
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'quotes'), { ...quote, user_id: user.id, status: 'Pending', createdAt: new Date().toISOString() });
      setQuotes(prev => [{ id: docRef.id, ...quote, user_id: user.id, status: 'Pending', createdAt: new Date().toISOString() }, ...prev]);
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const approveQuote = useCallback(async (quoteId: string, scheduledDate?: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return { success: false, error: 'Quote not found' };

    // 1. Update Quote Status
    await updateQuote(quoteId, { status: 'Approved' });

    // 2. Create Order
    const orderId = `ORD-${Date.now()}`;
    await createOrder(quote.items, {}, 'Pending'); // Simplified order creation

    // 2.1 Add Transaction
    await addTransaction({
        type: 'income',
        amount: quote.totalAmount,
        description: `Venda Aprovada: ${quote.customerName} - ${quote.vehicleModel || 'Serviço'}`,
        category: 'Vendas',
        date: new Date().toISOString()
    });

    // 3. Create Installation Job (OS)
    const osId = `OS-${Math.floor(Math.random() * 9000) + 1000}`;
    await addInstallationJob({
      service_order_id: osId,
      customer_name: quote.customerName,
      customer_whatsapp: quote.customerWhatsApp,
      customer_address: quote.customerAddress,
      customer_city: quote.customerCity,
      vehicle_model: quote.vehicleModel || 'Architecture',
      chosen_film: quote.items[0]?.description || 'Winf Film',
      total_amount: quote.totalAmount,
      payment_method: quote.paymentMethod as any,
      status: 'pending',
      scheduled_date: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      measurements: { architecture: quote.measurements }
    });

    gamify('SALE_CLOSED' as any);
    return { success: true, error: null };
  }, [quotes, user?.id, gamify, createOrder, addInstallationJob, addTransaction]);

  const updateQuote = useCallback(async (id: string, updates: any) => {
    if (user?.id?.startsWith('proto-')) {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
      return { success: true, error: null };
    }
    try {
      await updateDoc(doc(db, 'quotes', id), updates);
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const fetchStockItems = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      setStockItems([
        { id: 'stock1', user_id: user.id, product_id: 'prod-invisible', product_name: 'Winf Select™ Invisible', total_meters: 30, width: 1.52, remaining_meters: 24.5, created_at: new Date().toISOString() },
        { id: 'stock2', user_id: user.id, product_id: 'prod-blackpro', product_name: 'Winf Select™ BlackPro', total_meters: 30, width: 1.52, remaining_meters: 12.0, created_at: new Date().toISOString() },
        { id: 'stock3', user_id: user.id, product_id: 'prod-aerocore-99', product_name: 'AeroCore™ IR-99', total_meters: 30, width: 1.52, remaining_meters: 30.0, created_at: new Date().toISOString() },
        { id: 'stock4', user_id: user.id, product_id: 'prod-neoskin-ppf', product_name: 'NeoSkin™ PPF Active', total_meters: 30, width: 1.52, remaining_meters: 30.0, created_at: new Date().toISOString() }
      ]);
      return;
    }
    try {
      const q = query(collection(db, 'stock_items'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setStockItems(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'stock_items');
    }
  }, [user?.id]);

  const updateStock = useCallback(async (id: string, metersUsed: number) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      const item = stockItems.find(i => i.id === id);
      setStockItems(prev => prev.map(item => item.id === id ? { ...item, remaining_meters: Math.max(0, item.remaining_meters - metersUsed) } : item));
      if (item) {
        setStockHistory(prev => [{ id: `hist-${Date.now()}`, user_id: user.id, product_id: item.product_id, product_name: item.product_name, type: 'OUT', amount: metersUsed, date: new Date().toISOString() }, ...prev]);
      }
      return { success: true, error: null };
    }
    try {
      const docRef = doc(db, 'stock_items', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return { success: false, error: "Item not found" };
      const current = docSnap.data();
      const newRemaining = Math.max(0, (current.remaining_meters || 0) - metersUsed);
      await updateDoc(docRef, { remaining_meters: newRemaining });
      await fetchStockItems();
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id, fetchStockItems, stockItems]);

  const fetchTrainingModules = useCallback(async () => {
    // Mock training data
    setTrainingModules([
      { id: 'tm1', title: 'A Ciência da Rejeição IR', description: 'Entenda como as películas Winf bloqueiam o calor sem escurecer o ambiente.', type: 'video', category: 'Technical', url: 'https://example.com/video1', duration: '12:45', xp_reward: 100, coins_reward: 50 },
      { id: 'tm2', title: 'Argumentação de Elite: Arquitetura', description: 'Como abordar arquitetos e fechar projetos de alto ticket.', type: 'audio', category: 'Sales', url: 'https://example.com/audio1', duration: '08:20', xp_reward: 80, coins_reward: 40 },
      { id: 'tm3', title: 'Gestão de Estoque e Winf Precision', description: 'Maximizando o lucro através do aproveitamento inteligente de material.', type: 'video', category: 'Management', url: 'https://example.com/video2', duration: '15:10', xp_reward: 120, coins_reward: 60 },
      { id: 'tm4', title: 'Instalação em Grandes Formatos', description: 'Técnicas avançadas para vidros de fachadas e coberturas.', type: 'video', category: 'Technical', url: 'https://example.com/video3', duration: '20:00', xp_reward: 150, coins_reward: 75 },
    ]);
  }, []);

  const fetchRetalhos = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      return;
    }
    try {
      const q = query(collection(db, 'retalhos'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Retalho));
      setRetalhos(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'retalhos');
    }
  }, [user?.id]);
  
  const addRetalho = useCallback(async (retalho: any) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      setRetalhos(prev => [{ 
        id: `ret-${Date.now()}`, 
        ...retalho, 
        user_id: user.id, 
        created_at: new Date().toISOString(), 
        is_used: false 
      }, ...prev]);
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'retalhos'), { 
        ...retalho, 
        user_id: user.id, 
        created_at: new Date().toISOString(), 
        is_used: false 
      });
      setRetalhos(prev => [{ 
        id: docRef.id, 
        ...retalho, 
        user_id: user.id, 
        created_at: new Date().toISOString(), 
        is_used: false 
      }, ...prev]);
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const fetchPartnerTasks = useCallback(async () => {
    if (!user?.id) return;
    if (user?.id?.startsWith('proto-')) {
      setPartnerTasks([
        { id: 'task1', user_id: user.id, title: 'Revisar Leads da Porsche', description: 'Fazer follow-up com os leads quentes do Instagram.', priority: 'HIGH', status: 'PENDING', category: 'SALES', created_at: new Date().toISOString() },
        { id: 'task2', user_id: user.id, title: 'Treinamento AeroCore', description: 'Completar o módulo técnico de instalação.', priority: 'MEDIUM', status: 'IN_PROGRESS', category: 'TECHNICAL', created_at: new Date().toISOString() },
        { id: 'task3', user_id: user.id, title: 'Reposição de Estoque', description: 'Pedir mais rolos de Winf Invisible.', priority: 'CRITICAL', status: 'PENDING', category: 'ADMIN', created_at: new Date().toISOString() },
      ]);
      return;
    }
    try {
      const q = query(collection(db, 'partner_tasks'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerTask));
      setPartnerTasks(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'partner_tasks');
    }
  }, [user?.id]);

  const fetchAgentInsights = useCallback(async () => {
    if (!user?.id || user.id.startsWith('proto-')) return;
    try {
      const q = query(collection(db, 'agent_insights'), where('user_id', '==', user.id), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        let ca = docData.created_at;
        if (ca && typeof ca.toDate === 'function') {
          ca = ca.toDate().toISOString();
        } else if (ca && typeof ca === 'object') {
          ca = new Date().toISOString();
        }
        return { 
          id: doc.id, 
          ...docData,
          created_at: ca || new Date().toISOString()
        } as AgentInsight;
      });
      setAgentInsights(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'agent_insights');
    }
  }, [user?.id]);

  const markInsightAsRead = useCallback(async (id: string) => {
    if (!user?.id || user?.id?.startsWith('proto-')) return { success: true, error: null };
    try {
      await updateDoc(doc(db, 'agent_insights', id), { is_read: true });
      setAgentInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
      return { success: true, error: null };
    } catch (e: any) {
      handleFirestoreError(e, OperationType.UPDATE, `agent_insights/${id}`);
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const SEEDED_DOCS = [
    {
      id: "doc-alpha-license",
      fileName: "winf_alpha_territorial_license.pdf",
      title: "WINF Territorial License - Manual de Captação e Estrategia",
      category: "Alpha",
      description: "Lâmina Oficial do Produto Alpha. Detalhamento e estratégia comercial da franquia modular de licenças territoriais. Meta padrão R$300k/ano.",
      fileSize: "4.8 MB",
      url: "https://firebasestorage.googleapis.com/v0/b/winf-partners/o/doc_vault%2Fwinf_alpha_territorial_license.pdf?alt=media",
      allowedRoles: ["Admin", "Investor", "Licenciado", "Member"],
      created_at: new Date().toISOString()
    },
    {
      id: "doc-kiosk-hub",
      fileName: "winf_kiosk_product_hub.pdf",
      title: "WINF Kiosk - Hub Imersivo de Captação e Experiencia",
      category: "Kiosk",
      description: "Especificações e visual do Quiosque FaaS Triple-A de captação por impulso. Equipado com showroom VR 3D e Totem digital.",
      fileSize: "6.2 MB",
      url: "https://firebasestorage.googleapis.com/v0/b/winf-partners/o/doc_vault%2Fwinf_kiosk_product_hub.pdf?alt=media",
      allowedRoles: ["Admin", "Investor", "Licenciado", "Member"],
      created_at: new Date().toISOString()
    },
    {
      id: "doc-beta-pool",
      fileName: "winf_beta_blackshop_liquidity_pool.pdf",
      title: "WINF Beta - BlackShop™ Liquidity Pool",
      category: "Beta",
      description: "Apresentação de fluxo co-investido corporativo com repasses de dividendos trimestrais indexados ao giro de suprimentos da distribuidora (ROI 24% a 36%/ano).",
      fileSize: "3.5 MB",
      url: "https://firebasestorage.googleapis.com/v0/b/winf-partners/o/doc_vault%2Fwinf_beta_blackshop_liquidity_pool.pdf?alt=media",
      allowedRoles: ["Admin", "Investor", "Licenciado", "Member"],
      created_at: new Date().toISOString()
    },
    {
      id: "doc-gamma-hub",
      fileName: "winf_gamma_aerocore_flagship_hub.pdf",
      title: "WINF Gamma - AeroCore™ Flagship Hub",
      category: "Gamma",
      description: "Diretrizes exclusivas para grandes operadores. Assento no Conselho W12, estética Loft Industrial Rústico e participação de profit share institucional.",
      fileSize: "8.1 MB",
      url: "https://firebasestorage.googleapis.com/v0/b/winf-partners/o/doc_vault%2Fwinf_gamma_aerocore_flagship_hub.pdf?alt=media",
      allowedRoles: ["Admin", "Investor", "Licenciado", "Member"],
      created_at: new Date().toISOString()
    }
  ];

  const fetchDocVault = useCallback(async () => {
    setVaultLoading(true);
    if (!user?.id || user.id.startsWith('proto-')) {
      // In proto environments, directly load local mock data
      setVaultFiles(SEEDED_DOCS);
      setVaultLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'doc_vault'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Seeding mechanism: if DB is empty and user is Admin, seed documents
        const profileRole = user.role;
        if (profileRole === 'Admin') {
          const seededList: any[] = [];
          for (const docSpec of SEEDED_DOCS) {
            const docRef = await addDoc(collection(db, 'doc_vault'), docSpec);
            seededList.push({ ...docSpec, id: docRef.id });
          }
          setVaultFiles(seededList);
        } else {
          setVaultFiles(SEEDED_DOCS);
        }
      } else {
        const data = querySnapshot.docs.map(docu => {
          const dData = docu.data();
          let ca = dData.created_at;
          if (ca && typeof ca.toDate === 'function') {
            ca = ca.toDate().toISOString();
          }
          return {
            id: docu.id,
            fileName: dData.fileName || '',
            title: dData.title || '',
            category: dData.category || '',
            description: dData.description || '',
            fileSize: dData.fileSize || '0 KB',
            url: dData.url || '',
            allowedRoles: dData.allowedRoles || [],
            created_at: ca || new Date().toISOString()
          } as any;
        });
        setVaultFiles(data);
      }
    } catch (e) {
      console.warn("Firestore collection 'doc_vault' reading failed, falling back to secure preview files:", e);
      setVaultFiles(SEEDED_DOCS);
    } finally {
      setVaultLoading(false);
    }
  }, [user?.id, user?.role]);

  const addPartnerTask = useCallback(async (task: any) => {
    if (!user?.id) return { success: false, error: "Auth" };
    if (user?.id?.startsWith('proto-')) {
      const newTask: PartnerTask = { ...task, id: `task-${Date.now()}`, user_id: user.id, created_at: new Date().toISOString(), status: 'PENDING' };
      setPartnerTasks(prev => [newTask, ...prev]);
      return { success: true, error: null };
    }
    try {
      const docRef = await addDoc(collection(db, 'partner_tasks'), { ...task, user_id: user.id });
      setPartnerTasks(prev => [{ id: docRef.id, ...task, user_id: user.id } as PartnerTask, ...prev]);
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const updatePartnerTask = useCallback(async (id: string, updates: any) => {
    if (user?.id?.startsWith('proto-')) {
      setPartnerTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      return { success: true, error: null };
    }
    try {
      await updateDoc(doc(db, 'partner_tasks', id), updates);
      setPartnerTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } as PartnerTask : t));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const deletePartnerTask = useCallback(async (id: string) => {
    if (user?.id?.startsWith('proto-')) {
      setPartnerTasks(prev => prev.filter(t => t.id !== id));
      return { success: true, error: null };
    }
    try {
      await deleteDoc(doc(db, 'partner_tasks', id));
      setPartnerTasks(prev => prev.filter(t => t.id !== id));
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [user?.id]);

  const toggleFavoriteModule = (moduleId: string) => {
    const updated = favoriteModules.includes(moduleId)
      ? favoriteModules.filter(id => id !== moduleId)
      : [...favoriteModules, moduleId];
    setFavoriteModules(updated);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          // Create basic profile if not exists
          const newProfile: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email || 'User',
            email: firebaseUser.email || '',
            role: 'Licenciado',
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            winfCoins: 0,
            w_rank_xp: 0,
            w_rank_level: 'Initiate',
            arch_clearance: {
              invisible: false,
              blackpro: false,
              dualreflect: false
            },
            winf_knowledge: 0,
            cortex_influence: 0,
            neural_memory: 0,
            tactical_assets: 0
          };
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setUser(newProfile);
            setIsAuthenticated(true);
          } catch (e) {
            console.error("Error creating profile:", e);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile, setUser, setIsAuthenticated, setIsLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && user?.id) {
        setIsLoading(true);
        // Load initial data only once when user is authenticated
        await Promise.all([
          fetchLeads(), fetchWarranties(), fetchOrders(), fetchInstallations(), fetchAiGenerations(),
          fetchPlatformEvents(), fetchDocumentItems(),
          fetchTotalLeads(), fetchTransactions(), fetchQuotes(),
          fetchStockItems(), fetchTrainingModules(), fetchPartnerTasks(), fetchAgentInsights(),
          fetchDocVault()
        ]);
        setIsLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, user?.id, fetchLeads, fetchWarranties, fetchOrders, fetchInstallations, fetchAiGenerations, fetchPlatformEvents, fetchDocumentItems, fetchTotalLeads, fetchTransactions, fetchQuotes, fetchStockItems, fetchTrainingModules, fetchPartnerTasks, fetchAgentInsights, fetchDocVault]);

  const contextValue: WinfContextType = useMemo(() => ({
    user, isAuthenticated, isLoading, notification, leads, warranties, products, orders, installations, aiGenerations, coinLedger, socialPosts, vehicles,
    userModuleProgress, platformEvents, members, userPerformanceMetrics, contentCalendarEvents, documentItems, transactions, quotes,
    stockItems, stockHistory, retalhos, trainingModules, partnerTasks,
    totalLeads, totalMembers, totalOrders, recentActivities,
    arsenalAssets: [], addArsenalAsset: () => {},
    isOnline: true, claimLead: async () => ({ success: true, error: null }),
    login, loginAsPrototype, logout, updateUserCoins, redeemMarketingActivation, gamify, closeNotification, triggerNotification,
    uploadFileToStorage: async () => ({ url: null, error: 'Not implemented' }),
    fetchLeads, fetchPublicLeads, addLead, updateLead, deleteLead,
    publicLeads,
    fetchWarranties, registerWarranty, fetchProducts, fetchOrders, createOrder: async () => ({ success: true, error: null }),
    fetchInstallations, registerInstallation,
    fetchAiGenerations, saveAiGeneration: async () => ({ success: true, error: null }), fetchSocialPosts: async () => {}, 
    addSocialPost: async () => ({ success: true, error: null }),
    updateSocialPost: async () => ({ success: true, error: null }),
    deleteSocialPost: async () => ({ success: true, error: null }),
    fetchVehicles: async () => {}, addVehicle: async () => ({ success: true, error: null }),
    updateVehicle: async () => ({ success: true, error: null }),
    deleteVehicle: async () => ({ success: true, error: null }),
    fetchUserModuleProgress: async () => {},
    updateUserModuleProgress: async (moduleId, trackId, progress, status) => {
        setUserModuleProgress(prev => {
            const existing = prev.find(p => p.module_id === moduleId && p.track_id === trackId);
            if (existing) {
                return prev.map(p => p.id === existing.id ? { ...p, progress, status, last_accessed: new Date().toISOString() } : p);
            }
            return [...prev, { id: Date.now().toString(), user_id: 'temp', module_id: moduleId, track_id: trackId, progress, progress_percentage: progress, status, last_accessed: new Date().toISOString(), created_at: new Date().toISOString() }];
        });
        return { success: true, error: null };
    },
    fetchPlatformEvents: async () => {}, 
    fetchMembers,
    updateUserRole,
    deleteProfile,
    fetchDocumentItems: async () => {}, 
    fetchCoinLedger, fetchTransactions, addTransaction, updateTransaction,
    fetchQuotes, addQuote, approveQuote,
    fetchStockItems, updateStock, addStockItem: async () => ({ success: true, error: null }), fetchRetalhos, addRetalho, fetchTrainingModules,
    fetchPartnerTasks, addPartnerTask, updatePartnerTask, deletePartnerTask,
    agentInsights, fetchAgentInsights, markInsightAsRead,
    fetchTotalLeads: async () => {}, fetchTotalMembers: async () => {}, fetchTotalOrders: async () => {}, fetchRecentActivities: async () => {},
    fetchInstallationById, fetchWarrantyBySerialNumber, fetchQuoteById,
    fetchUserPerformanceMetrics: async () => {}, fetchContentCalendarEvents: async () => {}, addContentCalendarEvent: async () => ({ success: true, error: null }),
    agentState,
    dispatchAgentCommand,
    paradoxAnalysis,
    setParadoxAnalysis,
    whatsappConfigs,
    distributeLead,
    activeChats,
    installationJobs,
    addInstallationJob,
    updateInstallationJob,
    completeJobAndGenerateWarranty,
    vaultFiles,
    isVaultLoading,
    fetchDocVault,
    effectiveRole,
    setEffectiveRole,
    favoriteModules,
    toggleFavoriteModule
  }), [
    user, isAuthenticated, isLoading, notification, leads, warranties, products, orders, installations, aiGenerations, coinLedger, socialPosts, vehicles,
    userModuleProgress, platformEvents, members, userPerformanceMetrics, contentCalendarEvents, documentItems, transactions, quotes,
    stockItems, stockHistory, retalhos, trainingModules, partnerTasks,
    totalLeads, totalMembers, totalOrders, recentActivities,
    publicLeads,
    agentInsights,
    vaultFiles,
    isVaultLoading,
    agentState,
    paradoxAnalysis,
    whatsappConfigs,
    activeChats,
    installationJobs,
    effectiveRole,
    favoriteModules,
    login, loginAsPrototype, logout, updateUserCoins, redeemMarketingActivation, gamify, closeNotification, triggerNotification,
    fetchLeads, fetchPublicLeads, addLead, updateLead, deleteLead,
    fetchWarranties, registerWarranty, fetchProducts, fetchOrders,
    fetchInstallations, registerInstallation,
    fetchAiGenerations,
    fetchCoinLedger, fetchTransactions, addTransaction, updateTransaction,
    fetchQuotes, addQuote, approveQuote,
    fetchStockItems, updateStock, fetchTrainingModules,
    fetchPartnerTasks, addPartnerTask, updatePartnerTask, deletePartnerTask,
    fetchAgentInsights, markInsightAsRead,
    fetchInstallationById, fetchWarrantyBySerialNumber, fetchQuoteById,
    fetchDocVault,
    dispatchAgentCommand,
    distributeLead,
    addInstallationJob, updateInstallationJob, completeJobAndGenerateWarranty,
    toggleFavoriteModule
  ]);

  return <WinfContext.Provider value={contextValue}>{children}</WinfContext.Provider>;
};
