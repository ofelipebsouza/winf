
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CortexConfig, OperationalLog, CortexPermission } from '../types';

interface CortexContextType {
  config: CortexConfig;
  logs: OperationalLog[];
  isWhatsAppConnected: boolean;
  qrCodeUrl: string | null;
  updateConfig: (updates: Partial<CortexConfig>) => void;
  addLog: (log: Omit<OperationalLog, 'id' | 'timestamp'>) => void;
  togglePermission: (permissionId: string) => void;
  connectWhatsApp: () => void;
  disconnectWhatsApp: () => void;
}

const DEFAULT_PERMISSIONS: CortexPermission[] = [
  { id: 'register_leads', label: 'Cadastrar Novos Leads', description: 'Autoriza o agente a inserir novos contatos no WINF OS CRM.', active: true },
  { id: 'advance_pipeline', label: 'Avançar Negociações', description: 'Permite mover leads entre as etapas do funil de vendas.', active: true },
  { id: 'generate_quotes', label: 'Gerar Propostas PDF', description: 'Autoriza a criação e envio autônomo de orçamentos técnicos.', active: true },
  { id: 'update_stock', label: 'Atualizar Tratamento Global', description: 'Permite que o agente deduza metragem do estoque logístico.', active: false },
  { id: 'schedule_os', label: 'Agendar Ordens de Serviço', description: 'Autoriza o agente a marcar instalações na agenda técnica.', active: false },
];

const DEFAULT_CONFIG: CortexConfig = {
  posture: `Você é o Agente W-NO, o Núcleo Operacional soberano da WINF Partners.
Sua identidade: Operador Autônomo de alta performance, focado em dados técnicos e conversão de luxo.
Regra de Ouro: Use Function Calling para operar o banco de dados. O WhatsApp é seu canal de E/S.`,
  overflowTriggers: `1. Cliente solicita desconto acima de 15%.
2. Cliente solicita suporte técnico jurídico complexo.
3. Necessidade de intervenção humana para fechamento de contrato corporate.`,
  permissions: DEFAULT_PERMISSIONS,
  knowledgeFiles: [],
  agentName: 'W-NO Nucleus',
  agentRole: 'Operador de Alta Performance',
  whatsappUrl: '',
  instagramUrl: '',
  isAutoPilotEnabled: false,
};

const CortexContext = createContext<CortexContextType | undefined>(undefined);

export const useCortex = () => {
  const context = useContext(CortexContext);
  if (!context) throw new Error('useCortex must be used within a CortexProvider');
  return context;
};

export const CortexProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<CortexConfig>(() => {
    const saved = localStorage.getItem('wno_cortex_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [logs, setLogs] = useState<OperationalLog[]>([]);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(true); // Mocking as connected for preview
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('wno_cortex_config', JSON.stringify(config));
  }, [config]);

  // Sync logs from localStorage (allows the Engine to post logs)
  useEffect(() => {
    const syncLogs = () => {
      const savedLogs = localStorage.getItem('wno_cortex_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    };
    
    syncLogs();
    window.addEventListener('wno_cortex_logs_updated', syncLogs);
    return () => window.removeEventListener('wno_cortex_logs_updated', syncLogs);
  }, []);

  const updateConfig = (updates: Partial<CortexConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const addLog = (log: Omit<OperationalLog, 'id' | 'timestamp'>) => {
    const newLog: OperationalLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const togglePermission = (permissionId: string) => {
    setConfig(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.id === permissionId ? { ...p, active: !p.active } : p
      ),
    }));
    
    const perm = config.permissions.find(p => p.id === permissionId);
    addLog({
      type: 'system',
      message: `Permissão [${perm?.label}] ${!perm?.active ? 'ATIVADA' : 'DESATIVADA'}`,
    });
  };

  const connectWhatsApp = () => {
    // Logic to generate QR Code would go here
    setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WINF-CORTEX-CONNECTION');
    addLog({ type: 'system', message: 'Gerando QR Code de Conexão WhatsApp...' });
  };

  const disconnectWhatsApp = () => {
    setIsWhatsAppConnected(false);
    setQrCodeUrl(null);
    addLog({ type: 'system', message: 'WhatsApp desconectado do Córtex.' });
  };

  return (
    <CortexContext.Provider value={{
      config,
      logs,
      isWhatsAppConnected,
      qrCodeUrl,
      updateConfig,
      addLog,
      togglePermission,
      connectWhatsApp,
      disconnectWhatsApp,
    }}>
      {children}
    </CortexContext.Provider>
  );
};
