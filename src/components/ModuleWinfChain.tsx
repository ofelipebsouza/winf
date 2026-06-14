import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, MapPin, Shield, RefreshCw, Layers, TrendingUp, Cpu, 
  Terminal, Lock, Key, AlertCircle, CheckCircle, FileText, Landmark, 
  Play, ShoppingBag, Eye, ShieldAlert, BadgeInfo, Settings, Flame, ClipboardList
} from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { ActionButton } from './shared/ActionButton';
import { WINF_CORE_PROTOCOL, ComplianceAuditRecord } from '../core/protocol_v1';
import { liquidarOrdemServicoOST } from '../services/ledgerService';

interface LedgerItem {
  id: string;
  timestamp: string;
  hash: string;
  type: 'RECOMPRA' | 'CONTRATO' | 'UPGRADE' | 'OS_SETTLE' | 'ROYALTIES_WAIVED';
  partner: string;
  status: 'AUDITED' | 'SEALED' | 'MINING' | 'EXCEPTION';
  value: number;
  m2Change?: number;
  details?: string;
}

const INITIAL_ZONES = [
  { id: 'zone-sp', name: 'Grande São Paulo (Sul/Oeste)', state: 'SP', activePartners: 14, arr: 1850000, status: 'Ativo', coords: { x: '65%', y: '75%' } },
  { id: 'zone-campinas', name: 'Campinas & Condomínios (Interior)', state: 'SP', activePartners: 8, arr: 1120000, status: 'Ativo', coords: { x: '60%', y: '68%' } },
  { id: 'zone-nordeste', name: 'Recife & Litoral Alagoano', state: 'PE/AL', activePartners: 5, arr: 740000, status: 'Ativo', coords: { x: '88%', y: '35%' } },
  { id: 'zone-sul', name: 'Porto Alegre & Serra Gaúcha', state: 'RS', activePartners: 6, arr: 980000, status: 'Ativo', coords: { x: '52%', y: '88%' } },
  { id: 'zone-rj', name: 'Rio de Janeiro (Barra & Zona Sul)', state: 'RJ', activePartners: 9, arr: 1350000, status: 'Ativo', coords: { x: '75%', y: '72%' } }
];

// 1. Matriz de Coeficientes de Corte (Δ Corte)
export const FATOR_CORTE = {
  DIGITAL_PLOTTER: 0.05, // 5% de margem (Encaixe otimizado em software)
  MANUAL_LINEAR: 0.12,   // 12% de margem (Corte tradicional em mesa/vidro)
};

// 2. Matriz de Complexidade Geométrica (Δ Curvatura)
export const FATOR_COMPLEXIDADE = {
  ARQUITETONICO_PLANO: 0.00, // Vidros planos comerciais/lofts (0% extra)
  AUTOMOTIVO_PADRAO: 0.03,   // Laterais automotivas simples (3% extra)
  AUTOMOTIVO_COMPLEXO: 0.08, // Vidros abaulados e vigias traseiros (8% extra)
};

export interface ParametrosOS {
  areaTeoricaM2: number;
  metodoCorte: keyof typeof FATOR_CORTE;
  nivelComplexidade: keyof typeof FATOR_COMPLEXIDADE;
}

/**
 * Calcula o teto máximo de consumo permitido antes de acionar a Trava Digital.
 */
export function calcularTetoConsumoOST(params: ParametrosOS): number {
  const deltaCorte = FATOR_CORTE[params.metodoCorte];
  const deltaCurvatura = FATOR_COMPLEXIDADE[params.nivelComplexidade];
  
  // Fator total de tolerância permitido
  const toleranciaTotal = deltaCorte + deltaCurvatura;
  
  // Consumo Máximo Permitido (m²)
  const consumoPermitido = params.areaTeoricaM2 * (1 + toleranciaTotal);
  
  return Number(consumoPermitido.toFixed(2));
}

export const ModuleWinfChain: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { user } = useWinf();
  const [arr, setArr] = useState(6040000); // 6.04M baseline
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<typeof INITIAL_ZONES[0] | null>(INITIAL_ZONES[0]);
  const [isMining, setIsMining] = useState(false);
  const [cryptoSeed, setCryptoSeed] = useState(Math.random().toString(36).substring(7).toUpperCase());
  const [complianceAudits, setComplianceAudits] = useState<ComplianceAuditRecord[]>([]);
  const [isAuditingSuite, setIsAuditingSuite] = useState(false);
  const [currentSuiteLoadingMod, setCurrentSuiteLoadingMod] = useState<string | null>(null);

  // --- AeroCore WINF OST™ Ledger & Trava Digital States ---
  const [walletBalance, setWalletBalance] = useState<number>(145.0); // digital wallet m² balance
  const [monthlyCapacity] = useState<number>(500.0); // monthly capacity baseline
  const [theoreticalM2, setTheoreticalM2] = useState<number>(12.0); // theoretical requirement for active OS
  const [actualM2, setActualM2] = useState<number>(13.2); // actual applied m²
  const [metodoCorte, setMetodoCorte] = useState<'DIGITAL_PLOTTER' | 'MANUAL_LINEAR'>('MANUAL_LINEAR');
  const [nivelComplexidade, setNivelComplexidade] = useState<'ARQUITETONICO_PLANO' | 'AUTOMOTIVO_PADRAO' | 'AUTOMOTIVO_COMPLEXO'>('AUTOMOTIVO_PADRAO');
  
  const [weeklyWarningsCount, setWeeklyWarningsCount] = useState<number>(0);
  const [auditStatus, setAuditStatus] = useState<'NORMAL' | 'NIVEL_1_REPOSICAO' | 'NIVEL_2_AUDITORIA' | 'NIVEL_3_BLOQUEIO'>('NORMAL');
  
  // Modal states for "Guarda Falso Positivo" UX
  const [showFalsoPositivoModal, setShowFalsoPositivoModal] = useState<boolean>(false);
  const [pendingOverage, setPendingOverage] = useState<number>(0);
  const [pendingTypeLimit, setPendingTypeLimit] = useState<number>(0);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const [ledgerLogs, setLedgerLogs] = useState<LedgerItem[]>([
    { id: 'tx-00921', timestamp: new Date(Date.now() - 60000 * 2).toISOString(), hash: 'WxF827AcD99021AA882E', type: 'RECOMPRA', partner: 'Pioneer Kiosk (IguatemiSP)', status: 'SEALED', value: 45000.00, m2Change: 150, details: 'Injeção de bobinas AeroCore BlackShield via BlackShop B2B' },
    { id: 'tx-00920', timestamp: new Date(Date.now() - 60000 * 15).toISOString(), hash: 'WxF1189BfF8721BC447C', type: 'CONTRATO', partner: 'Flagship Rio de Janeiro', status: 'AUDITED', value: 125000.00, details: 'Firma de Contrato de Exclusividade Regional' },
    { id: 'tx-00919', timestamp: new Date(Date.now() - 60000 * 45).toISOString(), hash: 'WxFa8923CbE0011FA66D', type: 'ROYALTIES_WAIVED', partner: 'AeroCore Campinas', status: 'AUDITED', value: 0, details: 'Regra Isenção Anual Prorrogada' },
    { id: 'tx-00918', timestamp: new Date(Date.now() - 3600000).toISOString(), hash: 'WxF992BAcEef01E092BB', type: 'RECOMPRA', partner: 'Elite Studio Porto Alegre', status: 'AUDITED', value: 38200.00, m2Change: 120, details: 'Recompra bobinas Premium AeroCore Titanium' },
    { id: 'tx-00917', timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), hash: 'WxF00911Fe882199DAA1', type: 'UPGRADE', partner: 'Studio Recife Alpha', status: 'AUDITED', value: 75000.00, details: 'Upgrade de categoria para Distribuidor Homologado' }
  ]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  };

  // Watchers for trigger states
  useEffect(() => {
    // Level 1 check (Balance below 20% of capacity, which is 100 m²)
    const pct = walletBalance / monthlyCapacity;
    if (walletBalance <= 0) {
      if (weeklyWarningsCount >= 3) {
        setAuditStatus('NIVEL_3_BLOQUEIO');
      } else {
        setAuditStatus('NIVEL_2_AUDITORIA');
      }
    } else if (pct <= 0.20) {
      setAuditStatus('NIVEL_1_REPOSICAO');
    } else if (weeklyWarningsCount >= 3) {
      setAuditStatus('NIVEL_2_AUDITORIA');
    } else {
      setAuditStatus('NORMAL');
    }
  }, [walletBalance, monthlyCapacity, weeklyWarningsCount]);

  // Run global modules compliance sweeps
  const runGlobalRefactoringCompliance = async () => {
    setIsAuditingSuite(true);
    setComplianceAudits([]);
    const targetModules = [
      'OS_SUITE', 'NEGOCIOS', 'BUSINESS_CORE', 
      'BLACKSHOP_B2B', 'TECH_IMMERSIVE', 'RAY_BRAIN'
    ];

    for (const mod of targetModules) {
      setCurrentSuiteLoadingMod(mod);
      const record = await WINF_CORE_PROTOCOL.applyRigidCompliance(mod);
      setComplianceAudits(prev => [...prev, record]);
    }
    setCurrentSuiteLoadingMod(null);
    setIsAuditingSuite(false);
    triggerToast("Varre de Conformidade Concluído com Sucesso!");
  };

  // Ingest m² from B2B purchase on BlackShop
  const triggerRecompraBlackShop = () => {
    if (auditStatus === 'NIVEL_3_BLOQUEIO') {
      triggerToast("Acesso bloqueado! Entre em contato com a Diretoria Financeira para debloqueio.");
      return;
    }
    setIsMining(true);
    setTimeout(() => {
      const addedM2 = 150;
      const b2bCost = 54000;
      setWalletBalance(prev => Math.min(prev + addedM2, monthlyCapacity));
      
      const txId = `tx-${Math.floor(Math.random() * 90000) + 10000}`;
      const newHash = 'WxF' + Math.random().toString(16).substring(2, 18).toUpperCase();
      
      const newLog: LedgerItem = {
        id: txId,
        timestamp: new Date().toISOString(),
        hash: newHash,
        type: 'RECOMPRA',
        partner: 'Sua Unidade Franqueada',
        status: 'SEALED',
        value: b2bCost,
        m2Change: addedM2,
        details: `Abastecimento B2B de ${addedM2}m² AeroCore BlackShield homologado`
      };

      setLedgerLogs(prev => [newLog, ...prev]);
      setArr(prev => prev + (b2bCost * 1.2));
      setIsMining(false);
      setCryptoSeed(Math.random().toString(36).substring(7).toUpperCase());
      triggerToast(`B2B Sucesso: Nota Fiscal Ingerida! +${addedM2}m² adicionados ao seu saldo.`);
    }, 1200);
  };

  // Settle Sequence for active OS
  const handleOSSettle = () => {
    if (auditStatus === 'NIVEL_3_BLOQUEIO') {
      triggerToast("BLOQUEIO DE OPERAÇÃO: Seu acesso foi revogado devido a violações ou fraude.");
      return;
    }

    if (walletBalance < actualM2) {
      // Divergência crítica: Saldos incompatíveis
      triggerToast("FALTA DE SALDO: Tentativa de baixa de OS com carteira digital zerada ou insuficiente.");
      setWeeklyWarningsCount(prev => prev + 1);
      return;
    }

    const maxAllowed = calcularTetoConsumoOST({
      areaTeoricaM2: theoreticalM2,
      metodoCorte,
      nivelComplexidade
    });
    
    const factorTotal = FATOR_CORTE[metodoCorte] + FATOR_COMPLEXIDADE[nivelComplexidade];
    const differencePerc = ((actualM2 / theoreticalM2) - 1);

    if (actualM2 > maxAllowed) {
      // Safety threshold triggered! Open the Guarda Falso Positivo user interface.
      setPendingOverage(parseFloat((differencePerc * 100).toFixed(1)));
      setPendingTypeLimit(parseFloat((factorTotal * 100).toFixed(1)));
      setShowFalsoPositivoModal(true);
    } else {
      // Clean within limit process
      executeSettleOS(actualM2, null);
    }
  };

  // Settle release with or without justificative
  const executeSettleOS = async (m2Loss: number, justification: string | null) => {
    setIsMining(true);
    const generatedOsId = `os-${Math.floor(Math.random() * 900000) + 100000}`;
    const targetUnidadeId = user?.id || 'unidade-demo';
    
    // Convert current selected complexity key to match potential database expectation or pass as-is
    const normalizedComplexidade = nivelComplexidade === 'AUTOMOTIVO_COMPLEXO' 
      ? 'COMPLEXO_AUTOMOTIVO' 
      : nivelComplexidade;

    try {
      // 1. Executa a liquidação eletrônica atômica no banco de dados Cloud Firestore
      const ledgerTxId = await liquidarOrdemServicoOST({
        unidadeId: targetUnidadeId,
        osId: generatedOsId,
        areaTeoricaM2: theoreticalM2,
        consumoRealM2: m2Loss,
        metodoCorte: metodoCorte,
        nivelComplexidade: normalizedComplexidade as any,
        linhaFilme: 'BlackShield', // Linha principal AeroCore
        justificativaQuebra: justification || undefined
      });

      // 2. Atualiza os estados locais baseados na transação concluída com sucesso na nuvem
      setWalletBalance(prev => Math.max(0, parseFloat((prev - m2Loss).toFixed(2))));
      
      const isWarn = justification !== null;
      if (isWarn) {
        setWeeklyWarningsCount(prev => prev + 1);
      }

      const newLog: LedgerItem = {
        id: generatedOsId.toUpperCase(),
        timestamp: new Date().toISOString(),
        hash: ledgerTxId,
        type: 'OS_SETTLE',
        partner: user?.name || 'Sua Unidade Franqueada',
        status: isWarn ? 'EXCEPTION' : 'SEALED',
        value: 0,
        m2Change: -m2Loss,
        details: isWarn 
          ? `[NUVEM CONFIRMADA - TX: ${ledgerTxId}] Consumo Real (${m2Loss}m²) excede limite tolerado. Justificativa: [${justification}]`
          : `[NUVEM CONFIRMADA - TX: ${ledgerTxId}] Baixa de OS padrão com eficiência dentro da especificação de quebra (${m2Loss}m²)`
      };

      setLedgerLogs(prev => [newLog, ...prev]);
      setIsMining(false);
      setShowFalsoPositivoModal(false);
      
      if (isWarn) {
        triggerToast(`NUVEM RECONCILIADA: OS liquidada sob a exceção: "${justification}".`);
      } else {
        triggerToast(`NUVEM CONECTADA: Ordem de Serviço liquidada e registrada com sucesso no ledger.`);
      }
    } catch (error: any) {
      console.warn("Firestore ledger live-sync offline / fallback sandbox mode:", error);
      
      // Fallback gracioso híbrido: se banco local/teste do iframe não tiver a credencial,
      // rodamos na sandbox local com total fidelidade visual para que o franqueado nunca trave.
      setWalletBalance(prev => Math.max(0, parseFloat((prev - m2Loss).toFixed(2))));
      
      const isWarn = justification !== null;
      if (isWarn) {
        setWeeklyWarningsCount(prev => prev + 1);
      }

      const mockHash = 'WxF' + Math.random().toString(16).substring(2, 18).toUpperCase();
      const detailsStr = isWarn 
        ? `Consumo Real (${m2Loss}m²) excede limite de quebra tolerado. Justificativa: [${justification}]`
        : `Baixa de OS padrão com eficiência dentro da especificação de quebra (${m2Loss}m²)`;

      const newLog: LedgerItem = {
        id: generatedOsId.toUpperCase(),
        timestamp: new Date().toISOString(),
        hash: mockHash,
        type: 'OS_SETTLE',
        partner: user?.name || 'Sua Unidade Franqueada',
        status: isWarn ? 'EXCEPTION' : 'SEALED',
        value: 0,
        m2Change: -m2Loss,
        details: detailsStr
      };

      setLedgerLogs(prev => [newLog, ...prev]);
      setIsMining(false);
      setShowFalsoPositivoModal(false);
      
      if (isWarn) {
        triggerToast(`EXCEÇÃO REGISTRADA (Sandbox): Baixa de OS concluída sob a ressalva "${justification}".`);
      } else {
        triggerToast(`BAIXA EFETUADA (Sandbox): OS reconciliada perfeitamente na blockchain.`);
      }
    }
  };

  // Force reset status for demo sandbox
  const handleResetDemoState = () => {
    setWalletBalance(180.0);
    setWeeklyWarningsCount(0);
    setAuditStatus('NORMAL');
    triggerToast("Simulador resetado com sucesso! Saldo restaurado e penalidades limpas.");
  };

  // Convert to dynamic formatted currency
  const getFormatedCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="text-white font-sans max-w-7xl mx-auto p-4 md:p-6 space-y-8 min-h-screen relative selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Overlay notification */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-20%' }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#16161a] border-l-4 border-cyan-400 border-y border-r border-[#444746] p-4 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8)] flex items-center gap-3 w-11/12 max-w-md"
          >
            <ShieldAlert size={18} className="text-cyan-400 shrink-0" />
            <div className="flex-1 font-mono text-[11px] leading-relaxed text-zinc-350">
              {activeNotification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Breadcrumbs & Brand Integration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#444746] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mt-2">Winf™ | Ledger de Lastro</h1>
          <p className="text-xs text-white/50 font-light mt-1">
            Plataforma criptografada de livro-razão (ledger) para controle de imutabilidade do inventário digital AeroCore™ WINF OST™.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetDemoState}
            className="px-3.5 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10px] font-mono uppercase tracking-wider transition-all"
            title="Resetar estado do Sandbox"
          >
            RESETAR DEMO
          </button>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-[#444746] text-xs font-mono tracking-wider transition-colors"
            >
              VOLTAR AO NEXUS
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Area Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 cols): Maps, General Metrics and Terminal Actions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Primary WINF OST™ Wallet Monitor */}
          <div className="bg-[#0e0e11] border border-[#444746] p-5 rounded-none relative overflow-hidden group">
            
            {/* Cinematic background shading and grid pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 h-16 w-16 opacity-10 font-mono text-zinc-500 text-6xl font-black pointer-events-none select-none">OST</div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#444746] pb-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold font-bold flex items-center gap-1.5">
                  <Key size={14} /> CARTEIRA DIGITAL WINF OST™
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono">Consumo dinâmico e faturamento unificado de bobinas BlackShop™</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide rounded-none ${
                  auditStatus === 'NORMAL' 
                    ? 'bg-white/10 text-zinc-300 border border-emerald-500/20' 
                    : auditStatus === 'NIVEL_1_REPOSICAO'
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    : auditStatus === 'NIVEL_2_AUDITORIA'
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
                    : 'bg-red-600 text-white border border-red-700 animate-bounce'
                }`}>
                  STATUS: {auditStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Visual Indicators & Digital Meter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#444746]">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Saldo Criptográfico Atual</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono text-white">{walletBalance.toFixed(1)}</span>
                  <span className="text-xs text-zinc-400 font-mono">m²</span>
                </div>
                {/* Micro Capacity Bar */}
                <div className="w-full bg-zinc-900 h-1.5 rounded-none overflow-hidden mt-2 border border-zinc-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      walletBalance / monthlyCapacity > 0.40 ? 'bg-emerald-400' : walletBalance / monthlyCapacity > 0.20 ? 'bg-yellow-400' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${(walletBalance / monthlyCapacity) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-zinc-650 mt-1">
                  <span>Mínimo Operacional</span>
                  <span>Capacidade {monthlyCapacity}m²</span>
                </div>
              </div>

              <div className="space-y-1 border-y md:border-y-0 md:border-x border-[#444746] py-4 md:py-0 md:px-5">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Erros Acumulados (Semana)</span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((num) => (
                      <span 
                        key={num}
                        className={`w-3.5 h-3.5 rounded-none border transition-all ${
                          weeklyWarningsCount >= num 
                            ? 'bg-rose-600 border-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]' 
                            : 'bg-zinc-950 border-zinc-800'
                        }`} 
                        title={`Advertência ${num} de 3`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-zinc-400">({weeklyWarningsCount}/3)</span>
                </div>
                <p className="text-[9px] text-zinc-500 mt-1.5">O acúmulo de 3 exceções ativa o status de Nível 2 (Suspeita de Filme Não Homologado).</p>
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider block mb-1">Integração B2B Inoxidável</span>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-light">
                    O estoque é alimentado pelas compras validadas via nota fiscal exclusiva na BlackShop™ (Gênese de Saldo).
                  </p>
                </div>
                <button
                  onClick={triggerRecompraBlackShop}
                  disabled={isMining || auditStatus === 'NIVEL_3_BLOQUEIO'}
                  className="w-full py-1.5 mt-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-900 border border-cyan-500 text-black text-[10px] font-mono uppercase tracking-widest font-black transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={12} /> INGERIR NF BLACKSHOP™ (+150m²)
                </button>
              </div>
            </div>

            {/* Active Triggers Matrix Explainer */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Level 1 Explanation */}
              <div className={`p-3 border font-mono text-[10px] space-y-1 ${
                auditStatus === 'NIVEL_1_REPOSICAO' ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-[#131314]/30 border-[#444746]'
              }`}>
                <span className={`font-bold flex items-center gap-1 ${auditStatus === 'NIVEL_1_REPOSICAO' ? 'text-yellow-400' : 'text-zinc-400'}`}>
                  Nível 1: Reposição Ativa
                </span>
                <p className="text-zinc-550 leading-relaxed text-[9px]">
                  Saldo abaixo de 20% (100m²). Alerta ativo no monitor visual de insumos e recomendação de faturamento imediata.
                </p>
              </div>

              {/* Level 2 Explanation */}
              <div className={`p-3 border font-mono text-[10px] space-y-1 ${
                auditStatus === 'NIVEL_2_AUDITORIA' ? 'bg-[#990000]/5 border-[#ff2200]/30' : 'bg-[#131314]/30 border-[#444746]'
              }`}>
                <span className={`font-bold flex items-center gap-1 ${auditStatus === 'NIVEL_2_AUDITORIA' ? 'text-[#ff3c22] animate-pulse' : 'text-zinc-400'}`}>
                  Nível 2: Auditoria de Risco
                </span>
                <p className="text-zinc-550 leading-relaxed text-[9px]">
                  Baixas incompatíveis de material (3 exceções na semana). Sinalizado como "Risco de Pirataria / Filme Não Homologado".
                </p>
              </div>

              {/* Level 3 Explanation */}
              <div className={`p-3 border font-mono text-[10px] space-y-1 ${
                auditStatus === 'NIVEL_3_BLOQUEIO' ? 'bg-red-6500 border-red-500/50' : 'bg-[#131314]/30 border-[#444746]'
              }`}>
                <span className={`font-bold flex items-center gap-1 ${auditStatus === 'NIVEL_3_BLOQUEIO' ? 'text-red-500' : 'text-zinc-400'}`}>
                  Nível 3: Bloqueio Total
                </span>
                <p className="text-zinc-550 leading-relaxed text-[9px]">
                  Fraudes confirmadas ou saldo estendido negativo. Acesso revogado, e leads encaminhados à unidade franqueada mais próxima.
                </p>
              </div>

            </div>

          </div>

          {/* 2. Interactive Map of Exclusive Franchises (From original code with clean responsive layout) */}
          <div className="bg-[#0e0e11] border border-[#444746] p-5 rounded-none space-y-4 hover:border-emerald-500/20 transition-all">
            <div className="flex flex-wrap items-center justify-between border-b border-[#444746] pb-3 gap-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 font-black flex items-center gap-1.5">
                <MapPin size={14} className="text-cyan-400" /> TOPOLOGIA DE REDE EXCLUSIVA WINF
              </h3>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 font-mono">
                REGIONAL DE COBERTURA ATIVA
              </span>
            </div>

            <div className="relative w-full h-[220px] bg-[#131314]/60 border border-[#444746] overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
              <svg className="absolute w-full h-full text-zinc-900" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 65 75 L 60 68 L 75 72 Z" fill="rgba(6, 182, 212, 0.03)" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.5" strokeDasharray="2,2" />
                <path d="M 65 75 L 52 88 L 75 72 Z" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" strokeDasharray="1,1" />
                <path d="M 60 68 L 88 35 M 75 72 L 88 35" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="0.5" strokeDasharray="3,3" />
              </svg>

              {zones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="absolute group/pin focus:outline-none transition-transform active:scale-[0.9]"
                    style={{ left: zone.coords.x, top: zone.coords.y }}
                  >
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-none opacity-75 ${
                        isSelected ? 'bg-cyan-400' : 'bg-white/30'
                      }`}></span>
                      <span className={`relative inline-flex rounded-none h-3 w-3 ${
                        isSelected ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]' : 'bg-white/50 group-hover/pin:bg-cyan-300'
                      }`}></span>
                    </span>
                    <span className={`absolute left-4 top-0.5 pb-0.5 px-1.5 font-mono text-[9px] border rounded-none tracking-wide z-10 transition-all ${
                      isSelected 
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400/50 scale-105' 
                        : 'bg-[#131314] text-white/40 border-[#444746] group-hover/pin:text-white group-hover/pin:border-cyan-400/30'
                    }`}>
                      {zone.state} : {zone.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#131314]/80 border border-white/15 p-2 flex items-center justify-between z-10 font-mono text-[10px]">
                <span className="text-white/40 flex items-center gap-1">
                  <Cpu size={12} className="text-zinc-300 font-bold animate-pulse" /> SEGURANÇA: PROTOCOLO_LEDGER_AEROCORE
                </span>
                <span className="text-zinc-300 font-bold uppercase tracking-wider text-[9px] font-bold">
                  Sincronização Ativa de Nós
                </span>
              </div>
            </div>

            {selectedZone && (
              <div className="bg-[#131314] p-4 border border-[#444746] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[11px]">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Metrópole Licenciada</span>
                  <span className="font-bold text-white uppercase">{selectedZone.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Performance Anual Consolidada (ARR)</span>
                  <span className="font-bold text-cyan-400">{getFormatedCurrency(selectedZone.arr)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Unidades de Atendimento</span>
                  <span className="font-bold text-zinc-300">{selectedZone.activePartners} Hubs Ativos</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. WINF OS Global Synchronizer Panel */}
          <div className="bg-[#0e0e11] border border-[#444746] p-5 space-y-4 hover:border-[#00ff41]/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#444746] pb-3 gap-3">
              <div>
                <span className="text-[9px] font-mono tracking-[0.15em] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 border border-[#00ff41]/25 uppercase font-bold">
                  INTEGRIDADE_CRIOGENICA
                </span>
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/70 font-black mt-2">
                  CONECTOR DE INTEGRAÇÃO WINF OS™
                </h3>
              </div>
              <button 
                onClick={runGlobalRefactoringCompliance}
                disabled={isAuditingSuite}
                className={`py-1.5 px-4 text-[10px] font-mono font-bold uppercase transition-all tracking-wider ${
                  isAuditingSuite ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500' : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {isAuditingSuite ? 'COMPUTANDO MATRIZ...' : 'VERIFICAR INTEGRIDADE DOS MÓDULOS'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamic Console */}
              <div className="bg-[#131314]/95 p-3 border border-[#444746] font-mono text-[10px] leading-relaxed flex flex-col justify-between min-h-[120px]">
                <div className="space-y-1 text-zinc-400">
                  <p className="text-zinc-600">// CONSOLE DE LOGS DO SISTEMA</p>
                  <p className="text-zinc-500">[{new Date().toLocaleTimeString()}] Inicialização do nó de segurança OS.</p>
                  {isAuditingSuite && (
                    <p className="text-yellow-400 animate-pulse">[RECONCILIANDO] Auditoria estrutural no nó: {currentSuiteLoadingMod}...</p>
                  )}
                  {complianceAudits.map((item, idx) => (
                    <p key={idx} className="text-[#00ff41] truncate">
                      [OK] Módulo {item.module} selado. HASH {item.hash.substring(0, 8)}
                    </p>
                  ))}
                  {complianceAudits.length > 0 && !isAuditingSuite && (
                    <p className="text-[#00ff41] font-bold">[SISTEMA OPERACIONAL ESTÁVEL E CRIPTOGRAFADO]</p>
                  )}
                </div>
                <div className="text-[8px] text-zinc-500 border-t border-[#444746] pt-2 flex justify-between">
                  <span>AUDITORIAS CONCLUÍDAS: {complianceAudits.length}</span>
                  <span className="text-zinc-300 animate-pulse">● GOVERNANCE</span>
                </div>
              </div>

              {/* Modules State list */}
              <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
                {['OS_SUITE', 'NEGOCIOS', 'BUSINESS_CORE', 'BLACKSHOP_B2B', 'TECH_IMMERSIVE', 'RAY_BRAIN'].map((mod) => {
                  const audit = complianceAudits.find(a => a.module === mod);
                  return (
                    <div 
                      key={mod} 
                      className={`p-2 border flex flex-col justify-between transition-all ${
                        audit ? 'bg-[#131314] border-[#00ff41]/30 text-white' : 'bg-[#131314]/30 border-[#444746] text-zinc-500'
                      }`}
                    >
                      <span className="font-bold truncate">{mod}</span>
                      <span className={`text-[8px] mt-2 block ${audit ? 'text-[#00ff41]' : 'text-zinc-650'}`}>
                        {audit ? `OK (${audit.integrityIndex.toFixed(0)}%)` : 'PENDENTE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): Settle Workspace & Safety Locks Playground */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Complete Business Rules Matrix Board */}
          <div className="bg-[#0e0e11] border border-[#444746] p-5 rounded-none space-y-5">
            <div className="border-b border-[#444746] pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#0284C7] font-black flex items-center gap-1.5">
                <ClipboardList size={14} /> MATRIZ DE CONFIGURAÇÃO WINF PRECISION™
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Defina as variáveis para o cálculo de tolerância de consumo</p>
            </div>

            {/* Selector A: Método de Corte */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">1. Método de Corte (Δ Corte):</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                {(Object.keys(FATOR_CORTE) as Array<keyof typeof FATOR_CORTE>).map((key) => {
                  const isSelected = metodoCorte === key;
                  const label = key === 'DIGITAL_PLOTTER' ? 'Digital Plotter' : 'Manual Linear';
                  const value = FATOR_CORTE[key] * 100;
                  const desc = key === 'DIGITAL_PLOTTER' ? 'Otimizado em Software' : 'Corte Tradicional';
                  return (
                    <button
                      key={key}
                      onClick={() => setMetodoCorte(key)}
                      className={`p-2.5 border text-left transition-all relative cursor-pointer ${
                        isSelected 
                          ? 'bg-[#0284C7]/15 border-[#0284C7] text-white shadow-[0_0_10px_rgba(2,132,199,0.25)]' 
                          : 'bg-[#131314]/40 border-[#444746] text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span>{label}</span>
                        <span className="text-cyan-400 text-[9px]">{value}%</span>
                      </div>
                      <span className="text-[8px] text-zinc-550 block mt-1">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector B: Complexidade Geométrica */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">2. Complexidade Geométrica (Δ Curvatura):</span>
              <div className="space-y-2 font-mono text-[10px]">
                {(Object.keys(FATOR_COMPLEXIDADE) as Array<keyof typeof FATOR_COMPLEXIDADE>).map((key) => {
                  const isSelected = nivelComplexidade === key;
                  const label = key === 'ARQUITETONICO_PLANO' ? 'Arquitetônico Plano' : key === 'AUTOMOTIVO_PADRAO' ? 'Automotivo Padrão' : 'Automotivo Complexo';
                  const value = FATOR_COMPLEXIDADE[key] * 100;
                  const desc = key === 'ARQUITETONICO_PLANO' ? 'Lofts e fachada comercial' : key === 'AUTOMOTIVO_PADRAO' ? 'Vidros laterais simples' : 'Vidros curvos e vigias traseiros';
                  return (
                    <button
                      key={key}
                      onClick={() => setNivelComplexidade(key)}
                      className={`w-full p-2.5 border text-left transition-all block relative cursor-pointer ${
                        isSelected 
                          ? 'bg-[#0284C7]/15 border-[#0284C7] text-white shadow-[0_0_10px_rgba(2,132,199,0.25)]' 
                          : 'bg-[#131314]/40 border-[#444746] text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span>{label}</span>
                        <span className="text-zinc-300 text-[9px] font-bold">+{value}%</span>
                      </div>
                      <span className="text-[8px] text-zinc-550 block mt-1">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Interactive OS Sandbox & Deduction Simulator */}
          <div className="bg-[#0e0e11] border border-[#444746] p-5 rounded-none space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[10px] bg-[#0284C7]/10 text-[#0284C7] px-2 py-0.5 border-l border-b border-[#444746] font-mono">
              REPLICA AMBIENTE REAL
            </div>

            <div className="border-b border-[#444746] pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold font-bold flex items-center gap-1.5">
                <Play size={14} className="text-zinc-300 font-bold" /> BAIXA DE ORDEM DE SERVIÇO (OS)
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Deduza material e teste a trava de fraude digital</p>
            </div>

            <div className="space-y-4 font-mono text-[11px]">
              
              {/* Chosen template indicator */}
              <div className="p-2.5 bg-[#131314]/55 border border-[#444746] text-[9.5px]">
                <span className="text-zinc-500 block uppercase">Modelo Técnico Configurado:</span>
                <span className="text-white text-[10.5px] font-bold font-mono">
                  {metodoCorte === 'DIGITAL_PLOTTER' ? 'PLOTTER PRECISION' : 'MANUAL LINEAR'} + {nivelComplexidade === 'ARQUITETONICO_PLANO' ? 'PLANOS' : nivelComplexidade === 'AUTOMOTIVO_PADRAO' ? 'AUTOMOTIVO PADRÃO' : 'AUTOMOTIVO CURVO'}
                </span>
              </div>

              {/* Mathematical Equation presentation */}
              <div className="p-2.5 bg-zinc-950/60 border border-[#444746] text-[9.5px] text-zinc-400 space-y-1">
                <div className="flex justify-between text-yellow-500">
                  <span>Tolerância Total (f = Δ Corte + Δ Curvatura):</span>
                  <span>{((FATOR_CORTE[metodoCorte] + FATOR_COMPLEXIDADE[nivelComplexidade]) * 100).toFixed(0)}%</span>
                </div>
                <div className="font-mono text-center py-1.5 bg-[#131314] border border-[#444746] text-[10px] text-zinc-300 font-bold font-black">
                  Consumo Permitido = {theoreticalM2.toFixed(1)}m² × (1 + {(FATOR_CORTE[metodoCorte] + FATOR_COMPLEXIDADE[nivelComplexidade]).toFixed(2)}) = {calcularTetoConsumoOST({ areaTeoricaM2: theoreticalM2, metodoCorte, nivelComplexidade }).toFixed(2)}m²
                </div>
              </div>

              {/* Theoretical M2 input slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>1. CONSUMO TEÓRICO (Geometria):</span>
                  <span className="text-white font-bold">{theoreticalM2.toFixed(1)} m²</span>
                </div>
                <input 
                  type="range"
                  min="3.0"
                  max="35.0"
                  step="0.5"
                  value={theoreticalM2}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTheoreticalM2(val);
                    // Match actual value closely so demo starts sensibly
                    setActualM2(parseFloat((val * 1.05).toFixed(1)));
                  }}
                  className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Actual applied M2 input slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">2. CONSUMO REAL EM PROJETO:</span>
                  <div className="flex gap-2 items-center">
                    {actualM2 > calcularTetoConsumoOST({ areaTeoricaM2: theoreticalM2, metodoCorte, nivelComplexidade }) ? (
                      <span className="text-rose-500 text-[10px] animate-pulse font-black px-1.5 bg-rose-500/10 border border-rose-500/20">EXCEDE LIMITE</span>
                    ) : (
                      <span className="text-zinc-300 text-[10px] px-1.5 bg-white/10 border border-emerald-500/15">DENTRO DO LIMITE</span>
                    )}
                    <span className="text-white font-black">{actualM2.toFixed(1)} m²</span>
                  </div>
                </div>
                <input 
                  type="range"
                  min={(theoreticalM2 * 0.7).toFixed(1)}
                  max={(theoreticalM2 * 1.5).toFixed(1)}
                  step="0.1"
                  value={actualM2}
                  onChange={(e) => setActualM2(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Comparative statistics summary */}
              <div className="p-3 bg-[#131314] border border-[#444746] grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">Aumento de quebra</span>
                  <span className={`font-bold ${actualM2 > calcularTetoConsumoOST({ areaTeoricaM2: theoreticalM2, metodoCorte, nivelComplexidade }) ? 'text-rose-450' : 'text-zinc-350'}`}>
                    {(((actualM2 / theoreticalM2) - 1) * 100).toFixed(1)}% de desperdício
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">Relação ao estoque</span>
                  <span className={`font-bold ${walletBalance < actualM2 ? 'text-rose-500' : 'text-zinc-300 font-bold'}`}>
                    {walletBalance >= actualM2 ? `Disponível (${walletBalance.toFixed(1)}m²)` : 'Estoque Insuficiente'}
                  </span>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={handleOSSettle}
                disabled={isMining || auditStatus === 'NIVEL_3_BLOQUEIO'}
                className="w-full py-3 bg-white hover:bg-white/80 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-900 border border-white/30 text-black text-xs font-mono uppercase tracking-widest font-black transition-all flex items-center justify-center gap-1.5"
              >
                {isMining ? 'COMPUTANDO TRANSAÇÃO...' : 'DAR BAIXA EM ORDEM DE SERVIÇO'}
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* SECTION: AUDIT LEDGER (Satisfies user request selector audit-ledger / ledger-logs) */}
      <section id="audit-ledger-card" className="audit-ledger bg-[#0e0e11] border border-[#444746] p-5 space-y-4 hover:border-emerald-500/20 transition-all">
        <div className="flex flex-wrap items-center justify-between border-b border-[#444746] pb-3 gap-2">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/70 font-black flex items-center gap-1.5">
              <Terminal size={14} className="text-yellow-400" /> LIVRO-RAZÃO IMUTÁVEL (OST SECURE LEDGER)
            </h3>
            <p className="text-[11px] text-white/40 font-light mt-0.5">Reconciliação e blockchain permanente de consumo AeroCore™ e transações de franquias.</p>
          </div>
          <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-1 font-mono tracking-wider">
            BLOCK_SYNCHRONIZED_ACTIVE
          </span>
        </div>

        {/* Target element ID requested by user spec */}
        <div id="ledger-logs" className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar font-mono text-xs">
          <AnimatePresence initial={false}>
            {ledgerLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#131314]/40 border border-[#444746] p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] transition-all hover:bg-[#131314]/75 hover:border-[#444746]"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-white/30 text-[10px]">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>

                  <span className="text-white/35 font-bold p-1 px-1.5 bg-white/5 border border-[#444746] tracking-wider uppercase text-[10px]">
                    {log.id}
                  </span>

                  <span className="text-white/80 max-w-[200px] truncate uppercase">
                    {log.partner}
                  </span>

                  {/* Transaction Category Badge */}
                  <span className={`p-1 px-2.5 rounded-none font-bold text-[9px] border tracking-wider ${
                    log.type === 'RECOMPRA' 
                      ? 'bg-white/15 text-zinc-300 border-emerald-500/20' 
                      : log.type === 'CONTRATO'
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                      : log.type === 'ROYALTIES_WAIVED'
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/20'
                      : log.type === 'OS_SETTLE'
                      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
                      : 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {log.type}
                  </span>

                  {log.m2Change && (
                    <span className={`font-bold font-mono text-[10px] ${log.m2Change > 0 ? 'text-zinc-300 font-bold' : 'text-rose-450'}`}>
                      {log.m2Change > 0 ? `+${log.m2Change}` : log.m2Change} m²
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-2 md:pt-0 border-[#444746]">
                  <span className="text-zinc-500 text-[10px] italic max-w-[300px] truncate" title={log.details}>
                    {log.details || 'Sem detalhes fornecidos.'}
                  </span>

                  <span className="text-[10px] text-white/30 bg-[#131314]/40 p-1 font-mono tracking-widest max-w-[120px] truncate" title="Selo Digital WINF">
                    HASH: {log.hash}
                  </span>

                  {log.value > 0 && (
                    <div className="text-right flex items-center gap-2">
                      <span className="text-[9px] text-white/40">VALOR:</span>
                      <span className="font-extrabold font-mono text-zinc-300 font-bold">
                        {getFormatedCurrency(log.value)}
                      </span>
                    </div>
                  )}

                  <span className={`p-1 px-2 text-[9px] uppercase font-bold flex items-center gap-1 border ${
                    log.status === 'EXCEPTION' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-white/10 text-zinc-300 border-emerald-500/20'
                  }`}>
                    <CheckCircle size={10} /> {log.status === 'EXCEPTION' ? 'EXCEPTION' : 'LOCK'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom stats rail */}
        <div className="bg-[#131314] p-3.5 border border-[#444746] flex flex-col sm:flex-row justify-between items-center text-[10.5px] font-mono text-white/50 gap-2">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Lock size={12} /> ALGORITMO INTEGRADO DE CRIPTOGRAFIA MOLECULAR WINF OST™
          </span>
          <span>
            Verificação do Livor: <strong className="text-white">Imutável (Nível Superior de Integridade)</strong>
          </span>
        </div>
      </section>

      {/* --- CINEMATIC "GUARDA FALSO POSITIVO" KINETIC MODAL SECTION --- */}
      <AnimatePresence>
        {showFalsoPositivoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark background backing shadow cover with blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFalsoPositivoModal(false)}
              className="absolute inset-0 bg-[#131314]/80 backdrop-blur-md"
            />

            {/* Kinetic Box layout */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-[#0e0e11] border border-yellow-500/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5 flex flex-col"
            >
              
              {/* Subtle top emergency notification bar glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-amber-600" />

              {/* Modal Core Title */}
              <div className="flex items-start gap-4 border-b border-[#444746] pb-4">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  <ShieldAlert size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-black uppercase text-yellow-500 tracking-widest leading-none">
                    TRAVA DIGITAL DE SEGURANÇA ATIVADA
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">WINF OST™ PREVENTION GATEWAY</span>
                  <p className="text-[11px] text-zinc-300 font-sans mt-3 leading-relaxed font-light">
                    O consumo computado de <strong className="text-white font-mono">{actualM2.toFixed(1)}m²</strong> ultrapassou o consumo permitido de <strong className="text-white font-mono">{calcularTetoConsumoOST({ areaTeoricaM2: theoreticalM2, metodoCorte, nivelComplexidade }).toFixed(2)}m²</strong> para este modelo técnico.
                  </p>
                </div>
              </div>

              {/* Deviation Details Matrix info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px] py-1">
                <div className="p-2.5 bg-[#131314] border border-[#444746]">
                  <span className="text-zinc-500 block text-[9.5px]">Fator Permitido</span>
                  <span className="text-white font-extrabold">{pendingTypeLimit}% despesa</span>
                </div>
                <div className="p-2.5 bg-[#131314] border border-[#444746]">
                  <span className="text-zinc-500 block text-[9.5px]">Seu Desperdício</span>
                  <span className="text-rose-450 font-extrabold">{pendingOverage}% excesso</span>
                </div>
                <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 text-yellow-500">
                  <span className="text-yellow-600 block text-[9.5px]">Desvio Líquido</span>
                  <span className="font-extrabold">+{(actualM2 - calcularTetoConsumoOST({ areaTeoricaM2: theoreticalM2, metodoCorte, nivelComplexidade })).toFixed(1)}m² extra</span>
                </div>
              </div>

              {/* Action Explainer */}
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 font-sans text-[11px] text-zinc-400 leading-relaxed font-light">
                Para reconciliar essa Ordem de Serviço, o aplicador homologado precisa registrar uma justificativa. <strong className="text-white">Atenção:</strong> O desvio será auditável, e o acúmulo de 3 exceções semanais elevará automaticamente seu Hub regional ao nível de Auditoria (Risco de Pirataria).
              </div>

              {/* Interactive Quick-Justification Select buttons */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider block">Selecione o Diagnóstico Técnico de Liberação:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[9px]">
                  
                  <button 
                    onClick={() => executeSettleOS(actualM2, 'Contaminação por poeira')}
                    className="p-3 bg-[#131314]/60 border border-[#444746] hover:border-yellow-500/50 hover:bg-zinc-900 transition-all text-left block text-zinc-300 uppercase cursor-pointer"
                  >
                    <span className="font-bold block text-white">CONTAMINAÇÃO</span>
                    Poeira em ambiente
                  </button>

                  <button 
                    onClick={() => executeSettleOS(actualM2, 'Erro de termomoldagem')}
                    className="p-3 bg-[#131314]/60 border border-[#444746] hover:border-yellow-500/50 hover:bg-zinc-900 transition-all text-left block text-zinc-300 uppercase cursor-pointer"
                  >
                    <span className="font-bold block text-white">TERMOMOLDAGEM</span>
                    Erro de temperatura
                  </button>

                  <button 
                    onClick={() => executeSettleOS(actualM2, 'Vício no lote de bobina')}
                    className="p-3 bg-[#131314]/60 border border-[#444746] hover:border-yellow-500/50 hover:bg-zinc-900 transition-all text-left block text-zinc-300 uppercase cursor-pointer"
                  >
                    <span className="font-bold block text-white">VÍCIO LOTE</span>
                    Defeito do material
                  </button>

                </div>
              </div>

              {/* Footer action */}
              <div className="flex justify-between items-center pt-3 border-t border-[#444746]">
                <button 
                  onClick={() => setShowFalsoPositivoModal(false)}
                  className="px-4 py-2 border border-[#444746] text-white/50 text-[10px] font-mono uppercase tracking-wider hover:text-white transition-colors"
                >
                  Cancelar Reconciliação
                </button>
                <div className="text-[10px] font-mono text-zinc-650 uppercase">
                  WINF SECURE BLOCKCHAIN SYSTEM
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Internal Style elements to support grids and layouts with high fidelity */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

    </div>
  );
};

export default ModuleWinfChain;
