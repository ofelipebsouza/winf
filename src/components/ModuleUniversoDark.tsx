
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, TrendingUp, AlertTriangle, Fingerprint, Activity, DollarSign, Briefcase, Share2, Eye, Shield, Globe, Users, MapPin, Package, PieChart, Wallet, LogIn, Key, User, UserPlus, FileText, Download, CheckCircle2, FileSignature } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { setDoc, doc, collection } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { WinfLogo } from './WinfLogo';
import { UniversoDarkSeat } from '../types';

import { UniversoDarkMaps } from './UniversoDarkMaps';
import { InvestorDashboard } from './InvestorDashboard';
import { AdminDashboardUniverso } from './AdminDashboardUniverso';
import { ImportSimulator } from './ImportSimulator';
import { useWinf } from '../contexts/WinfContext';
import { useTheme } from '../contexts/ThemeProvider';
import { useDarkData } from '../modules/universo-dark/hooks/useDarkData';
import { DashboardHeader } from '../modules/universo-dark/components/DashboardHeader';
import { LiveTicker } from '../modules/universo-dark/components/LiveTicker';
import { RadarMap } from '../modules/universo-dark/components/RadarMap';
import { ModuleDocVault } from './ModuleDocVault';

import { Terminal } from 'lucide-react';
import { GROWTH_DATA, ASSET_LIGHT_STATUS, ROADMAP, REPORTS, RECENT_TRANSACTIONS, INVESTMENT_RULES, INVESTMENT_POOLS, W12_SEATS_DATA, CPL_REGIONAL_DATA, CITIES_LIST } from '../data/universo-dark-data';

interface ModuleUniversoDarkProps {
  onBack: () => void;
}

const ModuleUniversoDark: React.FC<ModuleUniversoDarkProps> = ({ onBack }) => {
  const { user: appUser } = useWinf();
    const { metrics, activeTickers, recentTransactions: liveRecentTransactions, cities: liveCities } = useDarkData();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const [seats, setSeats] = useState<UniversoDarkSeat[]>(W12_SEATS_DATA as UniversoDarkSeat[]);
  const [checkoutSeat, setCheckoutSeat] = useState<UniversoDarkSeat | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasInvested, setHasInvested] = useState(false);
  const [purchasedSeats, setPurchasedSeats] = useState<UniversoDarkSeat[]>([]);
  const [globalFilter, setGlobalFilter] = useState<'geral' | 'alpha' | 'beta' | 'realtime'>('geral');
  const [winfRealtimeMode, setWinfRealtimeMode] = useState<'real_operational' | 'strategic_projection'>('real_operational');
  const [selectedCityApiKey, setSelectedCityApiKey] = useState<{ city: string; key: string } | null>(null);
  const [activePersona, setActivePersona] = useState<'admin'>('admin');
  const [showTiRedirectModal, setShowTiRedirectModal] = useState(false);
  const [showEmbeddedCli, setShowEmbeddedCli] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<string | null>('NEOSKIN™ PPF');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (user?.uid === 'dev-mode') return; // protect dev bypass
      setUser(currentUser);
      setIsVerifying(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hub' | 'painel' | 'jornada' | 'roadmap' | 'transparencia' | 'celulas' | 'dashboard' | 'formalizacao' | 'admin' | 'doc_vault'>('hub');
  const [notification, setNotification] = useState('');
  const [docVaultInitialDocId, setDocVaultInitialDocId] = useState<string | undefined>(undefined);
  const [docVaultInitialTab, setDocVaultInitialTab] = useState<'ativos' | 'governanca'>('ativos');
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);

  const [onboardingSignatureName, setOnboardingSignatureName] = useState('');
  const [onboardingSigned, setOnboardingSigned] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [onboardingCity, setOnboardingCity] = useState('');

  const [specGlassArea, setSpecGlassArea] = useState('');
  const [specOrientation, setSpecOrientation] = useState('');
  const [specOriginalGlass, setSpecOriginalGlass] = useState('');
  const [specSelectedFilm, setSpecSelectedFilm] = useState('');
  const [specTotalCost, setSpecTotalCost] = useState('');
  const [specProjectName, setSpecProjectName] = useState('');
  const [specIsUploading, setSpecIsUploading] = useState(false);
  const [specUploadProgress, setSpecUploadProgress] = useState(0);
  const [specBimFile, setSpecBimFile] = useState<File | null>(null);
  const [specLatitude, setSpecLatitude] = useState('');
  const [specLongitude, setSpecLongitude] = useState('');
  const [specAddress, setSpecAddress] = useState('');
  const [specIntentFilter, setSpecIntentFilter] = useState('');
  const [specCnpj, setSpecCnpj] = useState('');
  const [specActiveRTs, setSpecActiveRTs] = useState<string[]>([]);
  
  const [onboardingKey, setOnboardingKey] = useState('');
  const [onboardingScanning, setOnboardingScanning] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [onboardingLogs, setOnboardingLogs] = useState<string[]>([]);

  const startScanningOnboarding = () => {
    setOnboardingScanning(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setOnboardingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setOnboardingScanning(false);
      }
    }, 200);
  };
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleExtractAuditReport = async () => {
    setIsGeneratingAudit(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const reportText = `================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 36: RELATÓRIO DE AUDITORIA PATRIMONIAL E INTEGRALIZAÇÃO - 1T/2026
DECLARAÇÃO DE CONFORMIDADE E LASTRO FÍSICO DO ECOSSISTEMA WINF

O Conselho de Governança Master W12, sob os poderes conferidos pelas regras de outorga e arbitragem do estatuto social, emite a presente declaração sob regime de auditoria fechada:

I. ENTREGA E CONSUMO DE ESTOQUE (M² DE FILMES / PPF)
Fica auditado e certificado o volume físico de película térmica e de proteção aplicados in campo neste trimestre:
- Volume Total Consumido e Liquidado: 1.420,50 m²
- Unidade Piloto Santos (Santos-01): 684,20 m²
- Unidade Showroom São Paulo (SP-01): 412,30 m²
- Unidade Hub Nordeste (Ref/Sal-01): 324,00 m²

II. DEPORE / PROVA DE LASTRO DE BOBINAS NO BLACKSHOP™
Os auditores independentes certificam o lastro físico de ativos no hangar logístico central (Sorocaba/SP):
- Estoque Central Auditado: 1.200 bobinas de alto desempenho 100% integralizadas.
- Composição do Lastro:
  * Películas Controle Solar AeroCore™ Invisible: 450 bobinas
  * Películas Automotivas BlackPro™: 400 bobinas
  * Película Dual Reflective Architectural: 350 bobinas
- Relação de Garantia: Cobertura de 100% do saldo de m² distribuído às unidades parceiras, inviabilizando qualquer risco de sub-abastecimento.

III. ASSINATURA DIGITAL DO CONSELHO W12
O Conselho de Administração das 12 Cadeiras Masters, representado pelos membros do comitê de governança fiscal, valida e atesta este demonstrativo.

[ASSINADO DIGITALMENTE E CRIPTOGRAFADO PELO CONSELHO DE GOVERNANÇA W12]
CONCESSÕES VALIDANTES: 12/12 REPRESENTANTES ATIVOS
SISTEMA DE AUDITORIA CRIPTOGRÁFICA WINF OS™
EMISSÃO DE CERTIFICADO DE LASTRO REAL #WINF-AUDIT-1T2026`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'WINF_Relatorio_Auditoria_Patrimonial_1T2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGeneratingAudit(false);
    setNotification('Auditoria Q1/2026 exportada com sucesso!');
  };

  const handleViewReport = (reportId: number) => {
    let docId = 'report_01';
    if (reportId === 2) docId = 'report_02';
    if (reportId === 3) docId = 'report_03';
    if (reportId === 4) docId = 'report_04';
    
    setDocVaultInitialTab('governanca');
    setDocVaultInitialDocId(docId);
    setActiveTab('doc_vault');
  };

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          name: name || 'Investidor',
          role: 'investor',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setLoginError('Email já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setLoginError('Senha deve ter pelo menos 6 caracteres.');
      } else {
        setLoginError('Credenciais inválidas. Verifique seu email e senha.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const renderJornada = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 relative overflow-hidden">
        <h3 className="text-2xl font-light mb-2 text-white uppercase tracking-[0.1em] flex items-center gap-2">
          <TrendingUp className="text-white" /> A Tese de Escala WINF™
        </h3>
        <p className="text-sm text-neutral-400 mb-8 max-w-2xl leading-relaxed">
          Nossa arquitetura de expansão baseia-se em escassez, tecnologia autônoma e descentralização logística. Conheça as 4 fases estruturais do nosso ecossistema corporativo.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Semente: Os 100 Pioneiros', desc: 'Ativação de apenas 100 territórios exclusivos no Brasil (menos de 2% dos 5.570 municípios). Operação digital baseada no WINF OS™ (inteligência artificial que assume o atendimento comercial do WhatsApp sozinho). O parceiro trabalha apenas 6 horas semanais em aplicações, escoando de 100 a 200 metros de Window Film por mês e gerando um faturamento previsível de R$ 300 mil+ anuais por unidade. (Benchmark ativo da operação de Santos).', icon: <DollarSign className="text-white" /> },
            { step: 2, title: 'Scale: A Plataforma Gamificada', desc: 'Painel de monitoramento em tempo real que mede os dados de interação, interação com o WINF OS e volume de escoamento dos 100 pioneiros para filtrar os líderes de mercado.', icon: <Activity className="text-white" /> },
            { step: 3, title: 'Domínio Logístico: O Conselho W12', desc: 'Abertura de 10 cadeiras de Private Equity disponíveis (Conselho composto por 12 cadeiras: 2 Fundadores + 10 Selecionados). O transporte desses 10 conselheiros descentraliza a logística e transforma suas bases em Hubs Regionais de Envio da BlackShop™, garantindo a eles frete restrito, comissão e Profit Share sobre toda a sua zona de influência.', icon: <Globe className="text-white" /> },
            { step: 4, title: 'Ancoragem Física: Ativos AeroCore™', desc: 'Direcionamento de capital focado na fundação das unidades piloto de alta conversão gerenciadas pela holding: o Pioneer Kiosk AeroCore (conceito de atendimento aeroespacial para shoppings de luxo) e o Flagship Studio AeroCore (Triple-Play: Centro Estético Premium, Centro de Distribuição e Centro de Treinamento Elite).', icon: <MapPin className="text-white" /> }
          ].map((item) => (
            <div key={item.step} className="p-6 bg-[#131314] border border-[#444746]/60 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-7xl font-medium text-white/5 group-hover:text-white/10 transition-colors uppercase italic">{item.step}</div>
              <div className="mb-4">{item.icon}</div>
              <h4 className="text-xs md:text-sm font-medium text-white uppercase tracking-widest mb-2 leading-tight">{item.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 text-slate-100">
             <PieChart size={200} />
          </div>
          <h3 className="text-base font-medium text-white uppercase tracking-widest mb-4 border-b border-[#444746]/60 pb-4 relative z-10 flex items-center gap-2">
            <TrendingUp size={14} className="text-green-500" /> O Caminho para a Liquidez (Exit / Venda de Equity)
          </h3>
          <p className="text-sm text-neutral-400 mb-6 relative z-10 leading-relaxed">
            A Winf não é apenas sobre o retorno mensal. O grande salto patrimonial ocorre na formatação da empresa para M&A ou venda de participação para Fundos de Private Equity. O valor da rede (Valuation) multiplica conforme a BlackShop escoa materiais para a rede nacional de pontos Asset Light (alvo sustentável de 1.200 postos nacionais).
          </p>
          <div className="space-y-4 relative z-10">
            <div className="/5 p-4 border border-[#444746]/60 border-l-green-500 border-l-2">
              <h5 className="text-sm md:text-xs font-medium text-white uppercase tracking-widest mb-1">Cenário 1: Dividendos (Yield)</h5>
              <p className="text-xs md:text-xs text-neutral-500 leading-relaxed">Distribuição mensal dos lucros gerados pela margem de distribuição da BlackShop. Quanto mais Asset Lights consumindo no Brasil, maior o pool de dividendos para o board W12.</p>
            </div>
            <div className="/5 p-4 border border-[#444746]/60 border-l-blue-500 border-l-2">
              <h5 className="text-sm md:text-xs font-medium text-white uppercase tracking-widest mb-1">Cenário 2: Venda de Participação Governança</h5>
              <p className="text-xs md:text-xs text-neutral-500 leading-relaxed">Investidores originais vendem suas cotas (no mercado secundário ou na bolsa/fundo) inflacionadas pelo multiplicador de receita gerada pela cadeia nacional (as 12 cadeiras atingindo suas metas).</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 relative overflow-hidden font-sans">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[100px]"></div>
          <h3 className="text-xl font-medium text-white uppercase tracking-widest mb-8 border-b border-[#444746]/60 pb-4">Acesso ao Data Room</h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm md:text-xs font-medium text-neutral-500 uppercase tracking-widest">Pasta: Governança e Direito</h4>
              {['Term sheet da rodada W12', 'Contrato de Acionistas e Lock-up', 'NDA e Confidencialidade'].map(doc => (
                <div key={doc} onClick={() => setActiveTab('doc_vault')} className="flex items-center gap-3 p-3 bg-white/5 border border-[#444746]/60 text-sm md:text-xs text-neutral-400 hover:bg-white/10 hover:border-white/[0.08] transition-all cursor-pointer">
                  <Shield size={12} className="text-neutral-500" /> {doc}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="text-sm md:text-xs font-medium text-neutral-500 uppercase tracking-widest">Pasta: Manuais e Processos</h4>
              {['Blueprint Técnico da Unidade AeroCore™', 'SLA de Instalação e Excelência'].map(doc => (
                <div key={doc} onClick={() => setActiveTab('doc_vault')} className="flex items-center gap-3 p-3 bg-white/5 border border-[#444746]/60 text-sm md:text-xs text-neutral-400 hover:bg-white/10 hover:border-white/[0.08] transition-all cursor-pointer">
                  <Briefcase size={12} className="text-neutral-500" /> {doc}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="text-sm md:text-xs font-medium text-neutral-500 uppercase tracking-widest">Pasta: Visão de Futuro</h4>
              {['Roadmap do WINF OS v2.0', 'Estudo de Viabilidade de Franquias Internacionais'].map(doc => (
                <div key={doc} onClick={() => setActiveTab('doc_vault')} className="flex items-center gap-3 p-3 bg-white/5 border border-[#444746]/60 text-sm md:text-xs text-neutral-400 hover:bg-white/10 hover:border-white/[0.08] transition-all cursor-pointer">
                  <TrendingUp size={12} className="text-neutral-500" /> {doc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 relative overflow-hidden font-sans">
        <h3 className="text-2xl font-light mb-2 text-white uppercase tracking-[0.1em] flex items-center gap-2">
          <Activity className="text-white" /> Monitoramento Estratégico & Escassez (Simulação)
        </h3>
        <p className="text-sm text-neutral-500 font-light mb-10 max-w-2xl leading-relaxed">
          Acompanhamento em tempo real da ocupação de territórios e desempenho da rede WINF. Gamificação projetada para estimular alta performance dos investidores.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#131314] border border-[#444746]/60 p-6 md:p-8 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none group-hover:bg-red-500/20 transition-all"></div>
            <h4 className="text-xs md:text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">Vagas Livres (Tier Semente)</h4>
            <div className="text-5xl lg:text-6xl font-light text-white font-mono tracking-tight mb-2">12 <span className="text-xl text-white/30">/ 100</span></div>
            <p className="text-xs uppercase text-red-600 font-medium tracking-widest animate-pulse">Esgotamento Iminente</p>
          </div>

          <div className="bg-[#131314] border border-[#444746]/60 p-6 md:p-8 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-[40px] pointer-events-none group-hover:bg-white/[0.04] transition-all"></div>
            <h4 className="text-xs md:text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">Escoamento Relâmpago</h4>
            <div className="text-5xl lg:text-6xl font-light text-white font-mono tracking-tight mb-2">18.4K <span className="text-xl text-white/30">m²</span></div>
            <p className="text-xs uppercase text-zinc-400 font-medium tracking-widest">Registrado nos últimos 30 dias</p>
          </div>

          <div className="bg-[#131314] border border-[#444746]/60 p-6 md:p-8 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
            <h4 className="text-xs md:text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">Conselho W12 Ativo</h4>
            <div className="text-5xl lg:text-6xl font-light text-white font-mono tracking-tight mb-2">3 <span className="text-xl text-white/30">/ 12</span></div>
            <p className="text-xs uppercase text-neutral-300 font-medium tracking-widest">Cadeiras Master Ocupadas</p>
          </div>
        </div>
      </div>

      <ImportSimulator />
    </div>
  );

  const renderOnboarding = () => {
    return null;
  };

  const _disabled_onboarding = () => {
    return (
      <div className="space-y-8 animate-fade-in relative font-sans text-left">
        <div className="bg-[#1e1f20]/90 border border-[#444746]/60 p-6 lg:p-8 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-white"></div>
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-medium text-white uppercase tracking-wider italic flex items-center gap-2">
              <Fingerprint className="text-white/80 animate-pulse" /> RITUAL DE LOGON INTEGRAL // WINF MASTER ONBOARDING
            </h3>
            <p className="text-xs text-neutral-500 max-w-2xl mt-1">
              Onboarding estratégico para investidores. Aqui consolidamos a doutrina soberana do modelo de negócios da WINF, ativando sua chave na blockchain e configurando sua estação de controle regional.
            </p>
          </div>

          {/* Stepper progress tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 border-y border-[#444746]/60 py-4 my-8">
            {[
              { num: 1, label: 'Ameaça Territorial', desc: 'Diagnóstico solar' },
              { num: 2, label: 'Ignição Cripto', desc: 'Ativação blockchain' },
              { num: 3, label: 'Pacto de Soberania', desc: 'Combate a comoditização' },
              { num: 4, label: 'Célula Ativada', desc: 'Estação Operacional' }
            ].map(s => (
              <div 
                key={s.num} 
                onClick={() => onboardingKey || onboardingSigned || onboardingStep > s.num ? setOnboardingStep(s.num) : null}
                className={`p-3 border transition-colors cursor-pointer relative ${
                  onboardingStep === s.num 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : onboardingStep > s.num 
                      ? 'bg-white/[0.04] border-[#444746]/60 text-zinc-400' 
                      : 'bg-white/20 border-[#444746]/60/50 text-neutral-500'
                }`}
              >
                <div className="absolute top-2 right-2 font-mono text-neutral-400 text-[9px]">0{s.num}</div>
                <div className="flex items-center gap-1.5 font-medium uppercase tracking-wider text-[10px] leading-tight mb-0.5">
                  {onboardingStep > s.num ? (
                    <span className="w-1.5 h-1.5 rounded-none bg-white"></span>
                  ) : onboardingStep === s.num ? (
                    <span className="w-1.5 h-1.5 rounded-none bg-white animate-ping"></span>
                  ) : null}
                  {s.label}
                </div>
                <p className="text-[9px] text-neutral-500 font-light font-sans truncate">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* STEP 1: Varredura de Escassez Territorial */}
          {onboardingStep === 1 && (
            <div className="space-y-6">
              <div className="bg-[#131314] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden">
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-white uppercase tracking-widest mb-1">Passo 01: Varredura Solar & Diagnóstico Comercial</h4>
                  <p className="text-[11px] text-neutral-500">Analisar quadrantes, radiação UV/IR e a deficiência técnica do território para justificar a não-competição pelo modelo tradicional.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider font-medium block">Definir Cidade do Implante:</label>
                    <input 
                      type="text" 
                      value={onboardingCity} 
                      onChange={(e) => setOnboardingCity(e.target.value)}
                      placeholder="Ex: Santos (SP), Sorocaba (SP)"
                      className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-3 py-2 text-xs font-medium font-mono focus:border-white/20 focus:outline-none min-h-[38px]"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <button 
                      onClick={startScanningOnboarding}
                      disabled={onboardingScanning}
                      className="w-full bg-white hover:bg-white/80 disabled:bg-[#1e1f20] text-white text-xs font-medium uppercase tracking-widest py-3 font-mono leading-none transition-all flex items-center justify-start gap-2"
                    >
                      {onboardingScanning ? 'Scanneando Solo Territorial...' : 'Iniciar Análise e Geoprocessamento do Solo'}
                    </button>
                  </div>
                </div>

                {onboardingScanning && (
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-white/80 font-medium">
                      <span>VARREDURA EM ANDAMENTO...</span>
                      <span>{onboardingProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#1e1f20] border border-[#444746]/60 rounded-none overflow-hidden p-0.5">
                      <div className="h-full bg-white rounded-none transition-all duration-300" style={{ width: `${onboardingProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {onboardingLogs.length > 0 && (
                  <div className="bg-[#1e1f20] border border-[#444746]/60 p-4 font-mono text-neutral-500 text-[10px] leading-relaxed rounded-none h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
                    {onboardingLogs.map((log, i) => (
                      <div key={i} className={log.startsWith('✅') ? 'text-zinc-400' : log.startsWith('⚠️') ? 'text-amber-600 animate-pulse' : 'text-neutral-500'}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button 
                  disabled={!onboardingKey && onboardingLogs.length === 0}
                  onClick={() => setOnboardingStep(2)}
                  className="bg-white hover:bg-white/80 disabled:bg-[#1e1f20] disabled:text-neutral-400 transition-colors text-white font-medium uppercase tracking-widest text-xs px-6 py-3 font-mono flex items-center gap-1.5"
                >
                  Ir para Ignição Cripto <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Cripto-Chave WINF OS™ */}
          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div className="bg-[#131314] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden">
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-white uppercase tracking-widest mb-1">Passo 02: Ativação da Chave Criptográfica</h4>
                  <p className="text-[11px] text-neutral-500">Atrelar a coordenada física do seu polo na blockchain de escoamento. Esta tokenização bloqueia vendas cinzas e desvios de territórios.</p>
                </div>

                <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 rounded-none text-left space-y-4 max-w-lg mx-0">
                  <div className="w-12 h-12 bg-white/10 text-white/80 rounded-none flex items-center justify-center mx-auto mb-2 border border-white/20/20">
                    <Key size={20} className="animate-pulse" />
                  </div>
                  <h5 className="text-xs font-medium text-white uppercase tracking-widest font-mono">Endereço de Célula na Rede</h5>
                  
                  {onboardingKey ? (
                    <div className="space-y-2 p-1">
                      <code className="text-[11px] block bg-[#1e1f20] border border-[#444746]/60 px-3 py-2 text-zinc-400 font-mono tracking-wider break-all leading-relaxed">
                        {onboardingKey}
                      </code>
                      <p className="text-[9px] text-neutral-500 font-mono text-center uppercase">Registrado no Bloco #G3-ALPHA-2026 // Assinado com SHA-256</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#131314] border border-[#444746]/60 rounded-none">
                      <p className="text-[11px] text-neutral-500 font-mono uppercase italic mb-3">Chave Pendente. Identificação Territorial não finalizada ou em espera.</p>
                      <button 
                        onClick={() => {
                          setOnboardingKey('WINF_ALPHA_' + onboardingCity.toUpperCase().replace(/\s+/g, '_').replace(/[()]/g, '') + '_2026_x7a' + Math.floor(Math.random() * 90 + 10));
                          setNotification('Chave gerada no Blockchain');
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-medium uppercase tracking-wider px-4 py-2 font-mono transition-colors"
                      >
                        Forçar Ignição Criptográfica Manual
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setOnboardingStep(1)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium uppercase tracking-widest text-xs px-6 py-3 font-mono transition-colors"
                >
                  Voltar
                </button>
                <button 
                  disabled={!onboardingKey}
                  onClick={() => setOnboardingStep(3)}
                  className="bg-white hover:bg-white/80 disabled:bg-[#1e1f20] disabled:text-neutral-400 transition-colors text-white font-medium uppercase tracking-widest text-xs px-6 py-3 font-mono flex items-center gap-1.5"
                >
                  Ir para Pacto de Soberania <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pacto de Não-Competição e Soberania */}
          {onboardingStep === 3 && (
            <div className="space-y-6">
              <div className="bg-[#131314] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden">
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-white uppercase tracking-widest mb-1">Passo 03: Pacto de Soberania (Combate à Canibalização do Varejo Comum)</h4>
                  <p className="text-[11px] text-neutral-500">Para operar o sistema WINF OS™, você assume com o conselho um pacto indestrutível de entrega de alto ticket, ciência inquestionável e governança física.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  <div className="bg-[#131314] border border-[#444746]/60 p-5 space-y-4 text-xs font-light text-neutral-400 leading-relaxed font-sans">
                    <p className="font-medium text-white uppercase tracking-wider text-[10px] font-mono text-white/80 mb-2 border-b border-[#444746]/60 pb-1.5 font-sans">CLÁUSULAS DE INFRAESTRUTURA DE VALOR:</p>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-white/80 font-mono font-medium shrink-0">I.</span>
                      <p><strong>NÃO COMPRAREMOS COM PREÇO:</strong> Nunca competiremos por preço de fitas residenciais baratas de poliéster de baixo giro. Nosso foco é blindagem termodinâmica de alto padrão molecular.</p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-white/80 font-mono font-medium shrink-0">II.</span>
                      <p><strong>REPASSE OBRIGATÓRIO:</strong> Todo insumo de reposição e escoamento será rigorosamente rastreado e faturado na blockchain descentralizada do ecossistema WINF.</p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-white/80 font-mono font-medium shrink-0">III.</span>
                      <p><strong>INTEGRIDADE DE PROTEÇÃO:</strong> Prometer apenas taxas físicas e científicas comprovadas cientificamente pela engenharia WINF (TIR de 95% a 99%, UVR de 99.9% real via Magnetron Sputtering).</p>
                    </div>
                  </div>

                  <div className="bg-[#1e1f20] border border-[#444746]/60 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider font-medium block">Assine o Pacto de Doutrina:</label>
                      <input 
                        type="text" 
                        value={onboardingSignatureName} 
                        onChange={(e) => setOnboardingSignatureName(e.target.value)}
                        placeholder="Nome para Assinatura Autêntica"
                        className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-3 py-2 text-xs font-medium font-mono focus:border-white/20 focus:outline-none min-h-[38px]"
                      />
                      
                      {onboardingSignatureName && (
                        <div className="p-4 bg-[#1e1f20]/60 border border-dashed border-[#444746]/60 text-left select-none flex flex-col justify-between items-start cursor-pointer" onClick={() => setOnboardingSigned(true)}>
                          <p className="text-[8px] uppercase text-neutral-500 font-mono tracking-widest mb-1.5">Assinatura Certificada Corporativa WINF OS™</p>
                          <span className="text-lg text-zinc-400 font-serif italic tracking-wider block">
                            {onboardingSignatureName}
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        if (!onboardingSignatureName) return;
                        setOnboardingSigned(true);
                        setNotification('Pacto assinado e validado');
                      }}
                      disabled={!onboardingSignatureName}
                      className="mt-4 w-full bg-white hover:bg-white/80 disabled:bg-[#1e1f20] text-white text-xs font-medium uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5 font-mono"
                    >
                      {onboardingSigned ? '✓ ASSINADO E TRAVADO POR CONTRATURA DE ACIONISTAS' : 'VALIDAR E ASSINAR PACTO NA GESTAO'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setOnboardingStep(2)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium uppercase tracking-widest text-xs px-6 py-3 font-mono transition-colors"
                >
                  Voltar
                </button>
                <button 
                  disabled={!onboardingSigned}
                  onClick={() => {
                    setOnboardingStep(4);
                    setOnboardingActive(true);
                  }}
                  className="bg-white hover:bg-white/80 disabled:bg-[#1e1f20] disabled:text-neutral-400 transition-colors text-white font-medium uppercase tracking-widest text-xs px-6 py-3 font-mono flex items-center gap-1.5"
                >
                  Liberar Estação Operacional <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Ativação da Estação WINF™ */}
          {onboardingStep === 4 && (
            <div className="space-y-6">
              <div className="bg-[#1e1f20] border border-[#444746]/60 dark:border-[#444746]/60 p-8 rounded-none text-left space-y-6 flex flex-col items-start relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient(from_center,_white/[0.02],_transparent_70%) pointer-events-none"></div>
                <div className="w-16 h-16 bg-white/[0.04] text-zinc-400 border border-[#444746]/60 rounded-none flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={28} className="animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-medium text-zinc-400 uppercase tracking-widest font-mono mb-1">BEM-VINDO AO BOARD WINF OS™</h4>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">Sua estação regional para {onboardingCity} foi implantada com sucesso nas instâncias ativas do ecossistema WINF no blockchain corporativo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 border-t border-[#444746]/60">
                  <div className="bg-[#1e1f20] p-4 border border-[#444746]/60 text-left">
                    <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">NÓ LOCAL INTEGRADO</span>
                    <span className="text-xs font-medium text-white block truncate">{onboardingCity}</span>
                  </div>
                  <div className="bg-[#1e1f20] p-4 border border-[#444746]/60 text-left">
                    <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">NÚMERO DE LEADS AI</span>
                    <span className="text-xs font-medium text-zinc-400 block font-mono">17 Leads Pré-Qualificados</span>
                  </div>
                  <div className="bg-[#1e1f20] p-4 border border-[#444746]/60 text-left">
                    <span className="text-[8px] font-mono text-neutral-500 block uppercase mb-1">CONTROLE DE ESTOQUE</span>
                    <span className="text-xs font-medium text-white/80 block font-mono">250 m² Select PPF Ativo</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setActiveTab('hub');
                      setNotification(`Painel Central carregado com base em ${onboardingCity}`);
                    }}
                    className="bg-white hover:bg-white/80 text-white font-medium uppercase tracking-widest text-xs px-8 py-4 font-mono leading-none transition-colors"
                  >
                    ACESSAR CONSOLE DE OPERAÇÃO CENTRAL
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  // Vetor B: Os Gatilhos de Automação IA (O Portal do Especificador IA)
  const [calculatorView, setCalculatorView] = useState('simulate'); // 'simulate' | 'dossier'
  const [showTechnicalDossierSheet, setShowTechnicalDossierSheet] = useState(false);

  // Quick technical coefficients computation
  const computeThermodynamicCoefficients = () => {
    // 1. Inputs mapping based on UI selections
    const A = specGlassArea; // Area in m2
    const dT = 15; // Temperature difference default (Summer condition, e.g. Ext 37°C, Int 22°C)

    // Solar Irradiation Base (W / m²) based on orientation mapping
    let It = 750; // default (Norte)
    if (specOrientation === 'Oeste') It = 850; // Critical late afternoon sun
    if (specOrientation === 'Leste') It = 550; // Morning sun
    if (specOrientation === 'Sul') It = 300;   // Moderate diffuse sun

    // U-Value & SHGC for standard glasses
    let U_base = 5.8;
    let SHGC_base = 0.82;
    if (specOriginalGlass.includes('Temperado')) {
      U_base = 5.7;
      SHGC_base = 0.78;
    } else if (specOriginalGlass.includes('Fumê')) {
      U_base = 4.9;
      SHGC_base = 0.62;
    }

    // U-Value & SHGC for WINF AeroCore Treatment alternatives
    let U_winf = 4.2;
    let SHGC_winf = 0.18;
    let tir = 0.95;
    let uvr = 0.999;
    let tempReduction = -5.4;

    if (specSelectedFilm.includes('NEOSKIN') || specSelectedFilm.includes('PPF')) {
      U_winf = 3.9;
      SHGC_winf = 0.15;
      tir = 0.98;
      uvr = 0.999;
      tempReduction = -6.8;
    } else if (specSelectedFilm.includes('PREMIUM') || specSelectedFilm.includes('WINDOWFILM')) {
      U_winf = 4.1;
      SHGC_winf = 0.17;
      tir = 0.95;
      uvr = 0.990;
      tempReduction = -5.8;
    } else {
      // AeroCore STEALTH
      U_winf = 3.8;
      SHGC_winf = 0.12;
      tir = 0.99;
      uvr = 0.999;
      tempReduction = -7.5;
    }

    // Apply orientation scaling factors to temperature reduction
    if (specOrientation === 'Oeste') tempReduction -= 1.2;
    if (specOrientation === 'Norte') tempReduction -= 0.8;
    if (specOrientation === 'Leste') tempReduction -= 0.3;

    // 2. Physics Equations Process: Q = U * A * dT + SHGC * It * A
    // Total Heat Transfer in baseline condition (in Watts)
    const Q_base = (U_base * A * dT) + (SHGC_base * It * A);
    // Total Heat Transfer after WINF Sputtered Coating (in Watts)
    const Q_winf = (U_winf * A * dT) + (SHGC_winf * It * A);

    const deltaQ_W = Q_base - Q_winf; // Mitigation in Watts
    const deltaQ_kW = deltaQ_W / 1000; // Kilowatts
    const deltaQ_TR = deltaQ_W / 3517; // Equivalent Tons of Refrigeration (TR Blocked)

    // 3. Financial Return / Economia Estimativa
    // HVAC energy saving ratio, factor of Heat reduction from overall baseline solar load
    const savingsRatio = (Q_base - Q_winf) / Q_base;
    const savingsPercent = Math.min((savingsRatio * 100), 88.5); // Smashed upper bound cap

    // Power savings based on COP (~2.8 typical efficiency)
    // HVAC compresser electric power saved (kWh / hour of active solar load)
    const powerSavedPerHour = (deltaQ_kW / 2.8);
    // Over 1 year operating (6 hours peak sun * 22 working days * 12 months)
    const annualEnergySavedKwh = powerSavedPerHour * 6 * 22 * 12;
    // Multiplied by default Brazilian regional commercial tariff (e.g. R$ 0.88 / kWh)
    const annualFinancialSaving = annualEnergySavedKwh * 0.88;

    const totalCo2Mitigated = (annualEnergySavedKwh * 0.00042).toFixed(2); // standard conversion tCO2
    const rtEarned = specTotalCost * 0.10;

    return {
      tir: (tir * 100).toFixed(1) + '%',
      uvr: (uvr * 100).toFixed(2) + '%',
      savings: savingsPercent.toFixed(1) + '%',
      tempReduction: tempReduction.toFixed(1) + '°C',
      totalCo2Mitigated,
      rtEarned: rtEarned.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      qBase: (Q_base / 1000).toFixed(1) + ' kW',
      qWinf: (Q_winf / 1000).toFixed(1) + ' kW',
      qBlockedTR: deltaQ_TR.toFixed(1) + ' TR',
      efficiencyFactor: ((1 - (Q_winf / Q_base)) * 100).toFixed(0) + '%',
      annualFinancialSaving: annualFinancialSaving.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      energySavedKwh: Math.round(annualEnergySavedKwh).toLocaleString('pt-BR') + ' kWh',
      uBase: U_base,
      uWinf: U_winf,
      shgcBase: SHGC_base,
      shgcWinf: SHGC_winf,
      radIncident: It
    };
  };

  const copySpecDossierToClipboard = () => {
    const results = computeThermodynamicCoefficients();
    const markdownSpec = `---
DOSSIÊ TÉCNICO, TERMODINÂMICO E ECONÔMICO WINF PRECISION™
PROJETO: ${specProjectName.toUpperCase()}
ESPECIFICADOR CERTIFICADO W12 / WINF OS™
---

PARÂMETROS DA EDIFICAÇÃO:
- Área Total Envidraçada (A): ${specGlassArea} m²
- Orientação Solar Crítica (It): ${specOrientation} (${results.radIncident} W/m² radiação incident)
- Composição dos Vidros Originais (U_base / SHGC_base): ${results.uBase} W/m²K / ${results.shgcBase}
- Solução WINF Prescrita (U_winf / SHGC_winf): ${specSelectedFilm} (${results.uWinf} W/m²K / ${results.shgcWinf})

MODELAGEM DE EFICIÊNCIA TERMODINÂMICA WINF™ (Equação de Fluxo de Calor):
EUA: Q = U * A * dT + SHGC * It * A

- Carga Térmica Original (Q_baseline): ${results.qBase}
- Carga Térmica com Blindagem WINF: ${results.qWinf}
- Carga Térmica Total Bloqueada: ${results.qBlockedTR} (Tons of Refrigeration)
- Redução de Fluxo Energético por Convecção/Radiação: ${results.efficiencyFactor}

VIABILIDADE ECONÔMICA & RETORNO DO INVESTIMENTO (ROI):
- Economia Estimada em Eletricidade (HVAC/AC): ${results.energySavedKwh}/ano
- Payback Financeiro Retornado ao Cliente: ${results.annualFinancialSaving}/ano (ROI cumulativo em 5/10/20 anos)
- Mitigação de Alta Concentração UVR: ${results.uvr}
- Descarbonização Atmosférica Anual Estimada: ${results.totalCo2Mitigated} tCO2 Evitados

DOTAÇÃO DE GOVERNANÇA (RESERVA TÉCNICA - RT):
- Parcela de Honorários de Especificação Autenticada (10%): ${results.rtEarned}
- Status de Registro: Homologado na blockchain local WINF OS™
- Chave de Proteção Anticompetição: ATIVA (Território Protegido L1)

CONDIÇÃO DE GARANTIA CO-ASSINADA:
- 15 anos de Lastro contra Descoloração, Bolhas e Fadiga Molecular (Ativo Blockchain)
---
Garantia imutável atrelada ao blockchain WINF OS™
`;

    navigator.clipboard.writeText(markdownSpec);
    setNotification('Dossiê Técnico & ROI Copiado para Área de Transferência!');
  };

  const [bimLogs, setBimLogs] = useState<string[]>([]);
  const [bimScanning, setBimScanning] = useState(false);
  const [architectOfficeName, setArchitectOfficeName] = useState('Studio G3 Arquitetura de Alto Padrão');

  const startBimIngestion = () => {
    setBimScanning(true);
    setBimLogs([]);
    setSpecIsUploading(true);
    setSpecUploadProgress(10);

    const logMessages = [
      '⚡ INICIALIZANDO NÚCLEO DE INGESTÃO BIM / WINF PRECISION OPERATOR...',
      '📂 DESCOMPACTANDO CAMADAS DO VETOR DE ARQUITETURA (.RVT EXTRUDED)...',
      '🔮 ANALISANDO VOLUMETRIA E NÚCLEO DE ABSORÇÃO MOLECULAR...',
      '📍 VALIDANDO COORDENADAS SATELITAIS: Latitude -23.96 e Longitude -46.33...',
      '☀️ DETECTADO 14 VÃOS ENVIDRAÇADOS EXPOSTOS À ORIENTAÇÃO SOL CRÍTICO (OESTE)...',
      '📏 GEOPROCESSAMENTO COMPACTADO: ÁREA DE FACHADA ENCONTRADA = 380m²',
      '🔬 CALIBRANDO MOTOR TÉRMICO SOBRE BASELINE DE VIDRO TEMPERADO COMUM...',
      '✅ DOSSIÊ WINF™ PRONTO PARA CÁLCULO ESPECTRAL.'
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logMessages.length) {
        setBimLogs(prev => [...prev, logMessages[currentLog]]);
        setSpecUploadProgress(Math.min(90, Math.floor(((currentLog + 1) / logMessages.length) * 100)));
        currentLog++;
      } else {
        clearInterval(interval);
        setBimScanning(false);
        setSpecIsUploading(false);
        setSpecUploadProgress(100);
        setSpecGlassArea(380);
        setSpecOrientation('Oeste');
        setSpecOriginalGlass('Temperado Incolor');
        setSpecBimFile('fachada_santos_wave_revit_v4.rvt');
        setNotification('Projeto carregado com sucesso via Ingestão Inteligente!');
      }
    }, 600);
  };

  const renderEspecificador = () => {
    return null;
  };

  const _disabled_especificador = () => {
    const results = computeThermodynamicCoefficients();
    
    // Internal calculation helper for standard Q vs WINF Q
    const qBaseNumeric = Number(results.qBase.split(' ')[0]);
    const qWinfNumeric = Number(results.qWinf.split(' ')[0]);
    const thermalBlockPct = results.efficiencyFactor;

    // Years scaling projection
    const annualSavingsNum = parseFloat(results.annualFinancialSaving.replace(/[^0-9,]/g, '').replace(',', '.'));
    const savings5Years = (annualSavingsNum * 5).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const savings10Years = (annualSavingsNum * 10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const savings20Years = (annualSavingsNum * 20).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
    <div className="space-y-8 animate-fade-in relative text-left font-sans">
        <div className="bg-[#1e1f20]/95 border border-[#444746]/60 p-6 lg:p-8 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-white"></div>
          
          {/* HEADER SECTOR WITH 3 SUB-TABS */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6 border-b border-[#444746]/60 pb-5">
            <div>
              <h3 className="text-xl md:text-2xl font-medium text-white uppercase tracking-wider italic flex items-center gap-2">
                <FileSignature className="text-white/80" /> PORTAL DO ESPECIFICADOR IA // WINF PRECISION™
              </h3>
              <p className="text-xs text-neutral-500 max-w-2xl mt-1">
                A ferramenta secreta dos maiores escritórios de arquitetura corporativa do país. Desenvolva laudos de eficiência termodinâmica certificados pela WINF™ e fature 10% de Reserva Técnica (RT) sob contratos protegidos por blockchain.
              </p>
            </div>
            
            <div className="flex overflow-x-auto whitespace-nowrap bg-[#1e1f20] p-1 border border-[#444746]/60 rounded-none select-none w-full xl:w-auto scrollbar-hide gap-1 min-w-0">
              {[
                { id: 'ingest', label: '1. Ingestão de Projetos' },
                { id: 'simulate', label: '2. Cálculo Espectral' },
                { id: 'ledger', label: '3. Painel de RTs / Bloqueio' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => {
                    setCalculatorView(tab.id);
                    setNotification(`Navegando para etapa ${tab.label}`);
                  }}
                  className={`flex-1 xl:flex-none shrink-0 text-[9.5px] uppercase font-mono tracking-widest font-medium px-4 py-3 md:py-2.5 rounded-none transition-all text-left flex items-center leading-none cursor-pointer min-h-[40px] md:min-h-[34px] ${
                    calculatorView === tab.id 
                      ? 'bg-white text-white shadow-lg' 
                      : 'text-neutral-500 hover:text-white hover:bg-[#1e1f20]/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* VIEW 1: TERMINAL DE ENTRADA // INGESTÃO DE PROJETO */}
          {calculatorView === 'ingest' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* BIM Drag and Drop Section */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-gradient-to-br from-[#121214] to-[#18181b] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <span className="w-2 h-2 rounded-none bg-blue-500 animate-pulse"></span>
                    <span className="text-[8px] font-mono text-neutral-300 font-medium uppercase">BIM PARSER CENTRAL</span>
                  </div>

                  <p className="font-medium text-white uppercase tracking-wider text-[11px] font-mono text-neutral-400 mb-3 block">
                    🚀 Ingestão de Fachadas de Alta Tecnologia
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed mb-6">
                    Insira arquivos estruturais de seu projeto para que nossa inteligência de mapeamento varra as coordenadas espaciais, identifique os vãos de vidro vulneráveis e calcule a orientação solar instantaneamente.
                  </p>

                  {/* Drag and drop Simulated Box */}
                  <div 
                    onClick={startBimIngestion}
                    className={`border-2 border-dashed rounded-none p-8 text-left cursor-pointer transition-all flex flex-col justify-between items-start ${
                      specBimFile 
                        ? 'border-[#444746]/60 bg-white/[0.02]' 
                        : 'border-[#444746]/60 hover:border-white/20/50 hover:bg-white/20'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white/10 text-white/80 rounded-none flex items-center justify-center mx-auto mb-4 border border-white/20/20">
                      {bimScanning ? (
                        <Terminal className="animate-spin text-white/80" size={20} />
                      ) : specBimFile ? (
                        <CheckCircle2 className="text-zinc-400" size={20} />
                      ) : (
                        <Download className="text-neutral-400" size={20} />
                      )}
                    </div>
                    {specBimFile ? (
                      <div className="space-y-1">
                        <span className="text-xs font-medium font-mono text-zinc-400 block">{specBimFile}</span>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase block">Arquivo processado com sucesso • 14 superfícies ativas</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-neutral-400 block">Arraste seu arquivo BIM (.rvt), DWG ou PDF da fachada aqui</span>
                        <span className="text-[9px] text-neutral-500 font-mono tracking-widest block uppercase">Ou clique para simular upload com inteligência WINF™</span>
                      </div>
                    )}
                  </div>

                  {/* Upload logs live output */}
                  {bimLogs.length > 0 && (
                    <div className="mt-5 bg-[#1e1f20] border border-[#444746]/60 p-4 font-mono text-[9px] leading-relaxed rounded-none h-40 overflow-y-auto space-y-1 scrollbar-thin">
                      {bimLogs.map((log, i) => (
                        <div key={i} className={log.startsWith('✅') ? 'text-zinc-400' : log.startsWith('⚡') ? 'text-white/80' : 'text-neutral-500'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#1e1f20] border border-[#444746]/60 p-5 rounded-none space-y-3">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">🔍 Geolocalização Satelital e Cores Coordenadas</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-medium uppercase text-neutral-500">Coordenadas de Obra:</label>
                      <div className="bg-[#131314] p-2.5 border border-[#444746]/60 rounded-none font-mono text-[10px] text-neutral-400">
                        LAT: <span className="text-zinc-400">{specLatitude}</span> <br/>
                        LON: <span className="text-zinc-400">{specLongitude}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-medium uppercase text-neutral-500">Endereço Postal Auditado:</label>
                      <input 
                        type="text" 
                        value={specAddress} 
                        onChange={(e) => setSpecAddress(e.target.value)}
                        className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-2.5 py-2 text-[10px] font-mono focus:border-white/20 focus:outline-none min-h-[34px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtering Parameters and Solar Orientation Config */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#131314] border border-[#444746]/60 p-5 rounded-none space-y-4">
                  <span className="text-[10px] font-mono text-white/80 uppercase font-medium tracking-wider block">⚡ CONFIGURAÇÃO DE PARAMETRIZAÇÃO</span>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider font-medium block">Nome do Empreendimento / Cliente:</label>
                    <input 
                      type="text" 
                      value={specProjectName} 
                      onChange={(e) => setSpecProjectName(e.target.value)}
                      className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-3 py-2 text-xs font-mono focus:border-white/20 focus:outline-none min-h-[38px]"
                    />
                  </div>

                  {/* Intent filter options */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider font-medium block">Filtro de Desafio & Intenção Primária:</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'thermal', label: '🛡️ Atenuação Térmica Extrema', desc: 'Foco no esmagamento de ganho solar de ondas curtas.' },
                        { id: 'privacy', label: '🔒 Privacidade Absoluta', desc: 'Máxima blindagem visual sem perder transmissão luminosa.' },
                        { id: 'glare', label: '👁️ Design & Controle de Ofuscamento', desc: 'Derruba fadiga visual e rebatimento de luz indireta.' }
                      ].map(item => (
                        <div 
                          key={item.id}
                          onClick={() => setSpecIntentFilter(item.id as any)}
                          className={`p-3 border rounded-none cursor-pointer transition-all ${
                            specIntentFilter === item.id 
                              ? 'bg-white/10 border-white/20 text-white' 
                              : 'bg-white/30 border-[#444746]/60 text-neutral-400 hover:border-[#444746]/60'
                          }`}
                        >
                          <div className="text-[10px] font-medium uppercase tracking-wider">{item.label}</div>
                          <p className="text-[8px] text-neutral-500 mt-0.5">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setCalculatorView('simulate')}
                      className="w-full bg-white hover:bg-white/80 text-white text-xs font-medium uppercase tracking-widest py-3 font-mono leading-none transition-all flex items-center justify-center gap-1.5"
                    >
                      Avançar para Cálculo Espectral <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: O MOTOR DE PROCESSAMENTO // CÁLCULO ESPECTRAL */}
          {calculatorView === 'simulate' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Physics calculator sliders and configurations */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-[#131314] border border-[#444746]/60 p-5 rounded-none space-y-4">
                  <div className="flex justify-between items-center border-b border-[#444746]/60 pb-1.5 mb-2">
                    <p className="font-medium text-white uppercase tracking-wider text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-none bg-blue-500"></span> Ajuste Dinâmico da Equação
                    </p>
                    <span className="text-[8.5px] font-mono text-neutral-300 font-medium bg-blue-50/40 border border-blue-200/40 px-1 rounded-none">Q = U·A·ΔT + SHGC·It·A</span>
                  </div>

                  {/* Sliders Area & Orientation */}
                  <div className="space-y-4 font-sans">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="uppercase font-mono text-neutral-400 tracking-wider font-medium">Área Envidraçada Total (A):</span>
                        <span className="text-white font-mono font-medium">{specGlassArea} m²</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10" 
                        value={specGlassArea} 
                        onChange={(e) => setSpecGlassArea(Number(e.target.value))}
                        className="w-full h-1 bg-[#1e1f20] rounded-none appearance-none cursor-pointer accent-[#0284C7]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider font-medium block">Orientação Solar (It):</label>
                        <select 
                          value={specOrientation} 
                          onChange={(e) => setSpecOrientation(e.target.value)}
                          className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-3 py-2 text-xs font-medium font-mono focus:border-white/20 focus:outline-none min-h-[38px] cursor-pointer"
                        >
                          <option value="Oeste">Oeste (Sol de Tarde: 850 W/m²)</option>
                          <option value="Norte">Norte (Exposição Crítica: 750 W/m²)</option>
                          <option value="Leste">Leste (Sol de Manhã: 550 W/m²)</option>
                          <option value="Sul">Sul (Diffuse Sol: 300 W/m²)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider font-medium block">Vidro Estrutural Inicial:</label>
                        <select 
                          value={specOriginalGlass} 
                          onChange={(e) => setSpecOriginalGlass(e.target.value)}
                          className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-3 py-2 text-xs font-medium font-mono focus:border-white/20 focus:outline-none min-h-[38px] cursor-pointer"
                        >
                          <option value="Comum Recozido Incolor">Comum Incolor (U: 5.8 / SHGC: 0.82)</option>
                          <option value="Temperado Incolor">Temperado Incolor (U: 5.7 / SHGC: 0.78)</option>
                          <option value="Laminado Fumê">Laminado Fumê (U: 4.9 / SHGC: 0.62)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#444746]/60">
                      <label className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider font-medium block">Solução WINF Aplicada (Através de Plasma Descarga):</label>
                      <select 
                        value={specSelectedFilm} 
                        onChange={(e) => setSpecSelectedFilm(e.target.value)}
                        className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white/80 px-3 py-2.5 text-xs font-medium font-mono focus:border-white/20 focus:outline-none min-h-[40px] cursor-pointer bg-[#1e1f20]"
                      >
                        <option value="NEOSKIN™ PPF">NEOSKIN™ PPF - U: 3.9 / SHGC: 0.15 (98% TIR, 99.9% UVR)</option>
                        <option value="WINF™ PREMIUM QUALITY WINDOWFILM">WINF™ PREMIUM QUALITY WINDOWFILM - U: 4.1 / SHGC: 0.17 (95% TIR, 99.0% UVR)</option>
                        <option value="AeroCore™ STEALTH TECHNOLOGY WINDOW FILM">AeroCore™ STEALTH - U: 3.8 / SHGC: 0.12 (99% TIR, 99.9% UVR)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mathematical Equation output visual block */}
                <div className="bg-[#1e1f20] border border-[#444746]/60 p-5 rounded-none font-mono text-left space-y-3">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-medium block">📐 RESOLUÇÃO TERMODINÂMICA DA EQUAÇÃO:</span>
                  <div className="bg-[#131314] p-4 border border-[#444746]/60 rounded-none space-y-2 text-[10.5px] leading-relaxed select-text">
                    <p className="text-neutral-400">
                      Cálculo de Transferência Térmica Total para o Vão: <br/>
                      <strong className="text-white">Q = (U · A · ΔT) + (SHGC · It · A)</strong>
                    </p>
                    <div className="h-px bg-[#1e1f20] my-2"></div>
                    <p className="text-neutral-500">
                      <span className="text-white/80 font-medium">● Cenário Baseline:</span> <br/>
                      Q = ({results.uBase} · {specGlassArea} · 15) + ({results.shgcBase} · {results.radIncident} · {specGlassArea}) = <span className="text-rose-600 font-medium">{results.qBase} de Fluxo Térmico Incidente</span>
                    </p>
                    <p className="text-neutral-500">
                      <span className="text-zinc-400 font-medium">● Cenário WINF Shield:</span> <br/>
                      Q = ({results.uWinf} · {specGlassArea} · 15) + ({results.shgcWinf} · {results.radIncident} · {specGlassArea}) = <span className="text-zinc-400 font-medium">{results.qWinf} de Fluxo Térmico Residual</span>
                    </p>
                    <div className="h-px bg-[#1e1f20] my-2"></div>
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-white/80">EFICIÊNCIA MOLECULAR DO FILTRO:</span>
                      <span className="text-zinc-400">{results.efficiencyFactor} DE BLOQUEIO ATIVO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spectral engine live calculations */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden space-y-5">
                  <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2.5">
                    <span className="text-[9px] font-mono font-medium text-zinc-400 uppercase">📈 MÉTRICAS ESPECTRAIS / EFICIÊNCIA ENERGÉTICA</span>
                    <span className="text-[8px] font-mono text-neutral-500 bg-neutral-100 border border-[#444746]/60 px-1.5 py-0.5 rounded-none">WINF v4 System</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e1f20] p-4 border border-[#444746]/60">
                      <span className="text-[9.5px] font-mono text-neutral-500 block uppercase mb-1">Corte Térmico Conquistado</span>
                      <span className="text-2xl font-medium font-mono text-zinc-400 tracking-tight">{results.tempReduction}</span>
                      <span className="text-[8px] font-sans text-neutral-400 block uppercase mt-0.5 leading-tight">Estabilidade física de lajes e forros</span>
                    </div>

                    <div className="bg-[#1e1f20] p-4 border border-[#444746]/60">
                      <span className="text-[9.5px] font-mono text-neutral-500 block uppercase mb-1">Economia HVAC Estimada</span>
                      <span className="text-2xl font-medium font-mono text-white/80 tracking-tight">{results.savings}</span>
                      <span className="text-[8px] font-sans text-neutral-400 block uppercase mt-0.5 leading-tight">Redução direta de energia do compressor</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <div className="bg-[#1e1f20] p-4 border border-[#444746]/60">
                      <span className="text-[9.5px] font-mono text-neutral-500 block uppercase mb-1">Capacidade de Climatização Salva</span>
                      <span className="text-xl font-medium font-mono text-white tracking-tight">{results.qBlockedTR}</span>
                      <span className="text-[8px] font-sans text-neutral-400 block uppercase mt-0.5">Demanda de compressor descartada</span>
                    </div>

                    <div className="bg-[#1e1f20] p-4 border border-[#444746]/60">
                      <span className="text-[9.5px] font-mono text-neutral-500 block uppercase mb-1">Carbono Atmosférico Mitigado</span>
                      <span className="text-xl font-medium font-mono text-white tracking-tight">~{results.totalCo2Mitigated} <span className="text-xs text-neutral-500">t/ano</span></span>
                      <span className="text-[8px] font-sans text-neutral-400 block uppercase mt-0.5">Disparador automático no inventário ESG</span>
                    </div>
                  </div>

                  {/* Copy & View Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={copySpecDossierToClipboard}
                      className="flex-1 bg-[#1e1f20] hover:bg-[#1e1f20] border border-[#444746]/60 hover:border-white/[0.08] text-white text-xs font-medium font-mono uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5"
                    >
                      Copiar Dossiê ROI Markdown
                    </button>
                    <button 
                      onClick={() => {
                        setCalculatorView('ledger');
                        setNotification('Avançando para ativação de dotação de RT');
                      }}
                      className="flex-1 bg-white hover:bg-white/80 text-white text-xs font-medium font-mono uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5"
                    >
                      Vincular Reserva Técnica (RT) <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: LEDGER DE RESUMO, BRANTING & HONORÁRIOS DE RT */}
          {calculatorView === 'ledger' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#131314] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="text-[8.5px] font-mono text-zinc-400 bg-white/[0.04] border border-[#444746]/60 px-2 py-0.5 rounded-none font-medium uppercase">CONTRATO DE RESGUARDO DIGITAL</span>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-medium text-white uppercase tracking-widest mb-1">Passo 03: Homologação de Dossiê de ROI & Travamento de Protetor Regional</h4>
                  <p className="text-[11px] text-neutral-500">Aqui você amarra a dotação de 10% de Reserva Técnica (RT) ao seu registro profissional (CPF/CNPJ). Seu escoamento é travado em block na localidade selecionada.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                  <div className="xl:col-span-4 bg-[#1e1f20] border border-[#444746]/60 p-5 flex flex-col justify-between rounded-none">
                    <div className="space-y-3.5">
                      <span className="text-[10px] uppercase font-mono text-white/80 tracking-wider font-medium block">1. Assinatura da Especificadora</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-mono text-neutral-500 font-medium block">Nome do Escritor / Arquiteto:</label>
                        <input 
                          type="text" 
                          value={architectOfficeName} 
                          onChange={(e) => setArchitectOfficeName(e.target.value)}
                          className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-2.5 py-1.5 text-xs font-medium focus:border-white/20 focus:outline-none min-h-[34px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-mono text-neutral-500 font-medium block">CNPJ / CPF de Repasse de Honorários:</label>
                        <input 
                          type="text" 
                          value={specCnpj} 
                          onChange={(e) => setSpecCnpj(e.target.value)}
                          placeholder="EX: 00.000.000/0001-00"
                          className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-2.5 py-1.5 text-xs font-mono focus:border-white/20 focus:outline-none min-h-[34px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-mono text-neutral-500 font-medium block">Valor Total do Escopo Estimado:</label>
                        <div className="flex gap-2 items-center">
                          <span className="text-neutral-500 text-xs font-mono">R$</span>
                          <input 
                            type="number" 
                            value={specTotalCost} 
                            onChange={(e) => setSpecTotalCost(Number(e.target.value))}
                            className="w-full bg-[#1e1f20] border border-[#444746]/60 text-white px-2.5 py-1.5 text-xs font-mono font-medium focus:border-white/20 focus:outline-none min-h-[34px]"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        const newId = 'RT-' + Math.floor(Math.random() * 900 + 1000);
                        const newCase = {
                          id: newId,
                          project: specProjectName,
                          area: specGlassArea,
                          value: specTotalCost,
                          rtValue: specTotalCost * 0.10,
                          status: 'Homologado',
                          localPartner: 'HUB L1 Santos Master',
                          date: new Date().toLocaleDateString('pt-BR')
                        };
                        setSpecActiveRTs(prev => [newCase, ...prev]);
                        setNotification('Novo Projeto Homologado e RT Trancada com Sucesso em Blockchain!');
                      }}
                      className="mt-6 w-full bg-white hover:bg-white/80 text-white text-[10px] font-medium uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5 font-mono"
                    >
                      🛡️ REGISTRAR ESPECIFICAÇÃO & TRAVAR TERRITÓRIO
                    </button>
                  </div>

                  {/* ROI Whitepaper Live Preview Sheet */}
                  <div className="xl:col-span-8 bg-[#131314] border border-[#444746]/60 p-5 space-y-4 rounded-none text-xs select-text">
                    <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                      <span className="text-[10px] font-mono text-zinc-400 font-medium uppercase">📋 PRÉ-VIALIZAÇÃO DO RELATÓRIO DE ENGENHARIA ROI</span>
                      <span className="text-[8.5px] tracking-widest font-mono text-neutral-500">FORMATO EXPORTÁVEL PDF</span>
                    </div>

                    <div className="bg-[#131314] p-5 rounded-none border border-[#444746]/60 leading-relaxed space-y-4 font-mono text-[10.5px]">
                      {/* Document header representation */}
                      <div className="flex justify-between border-b border-dashed border-[#444746]/60 pb-3">
                        <div>
                          <p className="text-white font-medium uppercase text-[11px]">{architectOfficeName}</p>
                          <p className="text-neutral-500 text-[8px] uppercase mt-0.5">CNPJ: {specCnpj} • CPF/CNPJ Cadastrado</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-[11px]">WINF PRECISION ENGINE</p>
                          <p className="text-zinc-400 text-[8.5px] uppercase font-medium mt-0.5">ESTADO: TERRITÓRIO LOCK ATIVO</p>
                        </div>
                      </div>

                      {/* Brief text for client */}
                      <div className="space-y-1.5">
                        <p className="text-neutral-500 text-[8px] uppercase font-medium mb-1.5">LAUDO DE RETORNO DO INVESTIMENTO ENERGÉTICO & ENGENHARIA TERMOCLÍNICA:</p>
                        <p className="text-neutral-400">
                          Laudo de Eficiência elaborado em conformidade com as diretivas de proteção molecular WINF v4.2. O tratamento prescrito **{specSelectedFilm}** promove o isolamento termodinâmico contínuo na fachada com rejeição de calor de **{results.tir}** do espectro infravermelho.
                        </p>
                      </div>

                      {/* Financial Payback Columns */}
                      <div className="bg-[#1e1f20] p-3.5 border border-[#444746]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2.5 rounded-none text-left">
                        <div>
                          <span className="text-[8.5px] text-neutral-500 block uppercase mb-1">Acúmulo Est. em 5 Anos:</span>
                          <span className="text-white font-medium text-sm block">{savings5Years}</span>
                          <span className="text-[8px] text-white/60 block uppercase mt-0.5">Ativo Climatização</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-white/80 block uppercase mb-1 font-medium">Acúmulo Est. em 10 Anos:</span>
                          <span className="text-zinc-400 font-medium text-sm block">{savings10Years}</span>
                          <span className="text-[8px] text-white/60 block uppercase mt-0.5">HVAC Recarga Reduzida</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-neutral-500 block uppercase mb-1">Acúmulo Est. em 20 Anos:</span>
                          <span className="text-white/80 font-medium text-sm block">{savings20Years}</span>
                          <span className="text-[8px] text-white/80/60 block uppercase mt-0.5">Retorno x3 Solução</span>
                        </div>
                      </div>

                      {/* Locked alert notice */}
                      <div className="bg-rose-500/5 p-3.5 border border-rose-500/10 border-l-2 border-l-rose-500 text-[9px] text-neutral-500 space-y-1">
                        <div className="flex gap-2 items-center text-rose-600 font-medium uppercase tracking-wider">
                          <Lock size={12} /> BLOQUEIO DE CADEIA ANTICOMPETITIVA ATIVADO:
                        </div>
                        <p className="leading-normal font-sans text-neutral-400 text-[9.5px]">
                          Para preservar a Reserva Técnica de <strong className="text-white font-mono">{results.rtEarned}</strong> vinculada ao seu escritório de arquitetura, as bobinas ativas do tratamento de plasma prescrito para a obra <strong>{specProjectName}</strong> estão trancadas na blockchain de escoamento. Nenhuma construtora ou gestor consegue fechar esta compra faturando por outro canal sem acionar o sistema regional L1 de conformidade.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE RT REGISTER LEDGER */}
              <div className="bg-[#131314] border border-[#444746]/60 p-6 rounded-none relative overflow-hidden space-y-4">
                <span className="text-[10px] font-mono text-white/80 uppercase font-medium tracking-wider block">📊 DIÁRIO DE HONORÁRIOS & CHAVES DE PROSPECÇÃO DE RT:</span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10.5px]">
                    <thead>
                      <tr className="border-b border-[#444746]/60 text-neutral-500">
                        <th className="pb-3 uppercase tracking-wider font-medium">Ref No.</th>
                        <th className="pb-3 uppercase tracking-wider font-medium">Obra Especificada</th>
                        <th className="pb-3 uppercase tracking-wider font-medium text-left">Área (A)</th>
                        <th className="pb-3 uppercase tracking-wider font-medium text-right">Faturamento Obra</th>
                        <th className="pb-3 uppercase tracking-wider font-medium text-right text-zinc-400">Hon. RT (10%)</th>
                        <th className="pb-3 uppercase tracking-wider font-medium text-left">Status Lock</th>
                        <th className="pb-3 uppercase tracking-wider font-medium text-right">Data Hub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {specActiveRTs.map((rtCase) => (
                        <tr key={rtCase.id} className="hover:bg-[#1e1f20]/40 transition-colors">
                          <td className="py-3 text-neutral-400 font-medium">{rtCase.id}</td>
                          <td className="py-3 font-sans text-white font-medium">
                            {rtCase.project} <br/>
                            <span className="text-[8.5px] font-mono text-neutral-500 block uppercase font-light mt-0.5">Parceiro Fiscal: {rtCase.localPartner}</span>
                          </td>
                          <td className="py-3 text-left text-neutral-400">{rtCase.area} m²</td>
                          <td className="py-3 text-right text-neutral-400">R$ {rtCase.value.toLocaleString('pt', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 text-right font-medium text-zinc-400">R$ {rtCase.rtValue.toLocaleString('pt', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 text-left">
                            <span className={`px-2 py-0.5 text-[8.5px] rounded-none font-medium uppercase ${
                              rtCase.status === 'Aprovado / Pago' 
                                ? 'bg-white/[0.04] text-zinc-400 border border-[#444746]/60' 
                                : rtCase.status === 'Homologado'
                                  ? 'bg-blue-500/10 text-neutral-300 border border-blue-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {rtCase.status}
                            </span>
                          </td>
                          <td className="py-3 text-right text-neutral-500">{rtCase.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  const renderRoadmap = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
      {ROADMAP.map((item, idx) => (
        <div key={idx} className="bg-[#1e1f20] border border-[#444746]/60 p-8 relative group">
          <div className="absolute top-0 right-0 p-4">
            <span className={`text-[10px] md:text-[8px] font-medium uppercase tracking-widest px-2 py-1 ${item.status === 'Em Execução' ? 'bg-green-500/20 text-green-500' : '/5 text-neutral-500'}`}>
              {item.status}
            </span>
          </div>
          <h3 className="text-xl font-medium text-white mb-6 group-hover:text-neutral-400 transition-colors">{item.phase}</h3>
          <ul className="space-y-4">
            {item.items.map((it, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-none bg-[#0F172A] mt-1 flex-shrink-0"></span>
                {it}
              </li>
            ))}
          </ul>
          {idx === 2 && (
            <div className="mt-8 pt-8 border-t border-[#444746]/60">
              <p className="text-xs md:text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-2 italic">A BlackShop Strategy</p>
              <p className="text-xs md:text-[10px] text-white/30 leading-relaxed font-light">
                O e-commerce centralizado será a pulsação financeira de toda a rede. Lucro líquido vindo da recorrência de cada batedor de insumo em cada cidade do Brasil.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const handleCheckout = async () => {
    setIsProcessingPayment(true);
    
    try {
      if (checkoutSeat && user) {
        // Obter valor numérico
        const priceStr = checkoutSeat.price.replace(/[^0-9]/g, '');
        const amount = parseInt(priceStr, 10);
        
        await setDoc(doc(collection(db, 'universo_investments')), {
          investorName: appUser?.name || user?.displayName || 'Investidor Independente',
          investorEmail: user?.email || '',
          seatCode: checkoutSeat.code || checkoutSeat.r,
          amount: amount || 0,
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    } catch (e) {
      console.error("Erro ao registrar investimento", e);
    }
    
    setTimeout(() => {
        setIsProcessingPayment(false);
        setSeats(prev => prev.map(s => s?.id === checkoutSeat?.id ? { ...s, status: 'occupied', owner: user?.email || 'Investidor Independente' } : s));
        if (checkoutSeat) {
          setPurchasedSeats(prev => [...prev, checkoutSeat]);
        }
        setHasInvested(true);
        setNotification('Investimento confirmado e enviado para análise!');
        setCheckoutSeat(null);
        setActiveTab('dashboard');
    }, 2000);
  };

  const renderCelulas = () => (
    <div className="space-y-8 animate-fade-in relative">
      <UniversoDarkMaps />
      
      <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 relative overflow-hidden">
        <div className="mb-6 flex justify-between items-center relative z-10">
           <div>
             <h3 className="text-xl font-medium text-white uppercase tracking-widest flex items-center gap-2">
               <Globe size={18} className="text-neutral-500" /> W12 Brasil Board
             </h3>
             <p className="text-xs text-neutral-500 italic">Expansão de Fundos e Gestão de Território Nacional.</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] uppercase font-medium text-neutral-500 tracking-widest md:text-sm">Vagas Preenchidas</p>
             <p className="text-xl font-mono text-white">{seats.filter(s => s.status === 'occupied').length} / 12</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {seats.map(seat => (
                <div key={seat.id} className={`p-4 border transition-colors ${seat.status === 'occupied' ? 'bg-white/50 border-[#444746]/60' : 'bg-[#1e1f20]/40 border-[#444746]/60 hover:border-white/30 cursor-pointer'}`} onClick={() => seat.status === 'available' && setCheckoutSeat(seat)}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] md:text-xs font-medium text-white uppercase tracking-wider">{seat.r}</span>
                        {seat.status === 'occupied' ? (
                           <Lock size={14} className="text-red-500" />
                        ) : (
                           <div className="w-2 h-2 rounded-none bg-green-500 animate-pulse mt-1" />
                        )}
                    </div>
                    <p className="text-xs text-neutral-500 mb-4 h-8 overflow-hidden">{seat.role}</p>
                    {seat.status === 'occupied' ? (
                       <p className="text-[10px] font-mono text-red-500 uppercase">INDISPONÍVEL / OCUPADA</p>
                    ) : (
                       <div className="flex justify-between items-center pt-3 border-t border-[#444746]/60 mt-2">
                         <span className="text-[10px] font-medium text-neutral-500 uppercase">Preço Alvo</span>
                         <span className="text-sm font-mono text-green-500">{seat.price}</span>
                       </div>
                    )}
                </div>
            ))}
        </div>
        
        <div className="mt-8 p-6 bg-green-500/5 text-left flex items-center justify-between border-t border-green-500/20">
          <p className="text-sm text-green-500/80 mb-2"><strong>A Máquina de Dinheiro da Cadeira</strong></p>
          <p className="text-xs text-neutral-400 max-w-2xl mx-auto">
            Ao se tornar um dos 12, o investidor não apenas injeta capital, ele passa a receber dividendos de toda a cadeia da sua região. Estúdios Piloto e Kiosks são projetados para retroalimentar o caixa do W12, gerando Equity bruto e lucro distribuível para os conselheiros antes mesmo do Exit (Venda da empresa).
          </p>
        </div>
      </div>

      {checkoutSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
            <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 max-w-lg w-full animate-fade-in relative">
                <button onClick={() => setCheckoutSeat(null)} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">✕</button>
                <div className="flex items-center gap-3 mb-6">
                   <Shield size={24} className="text-green-500" />
                   <h2 className="text-xl font-medium uppercase tracking-widest text-white">Garantir Vaga</h2>
                </div>
                
                <div className="space-y-4 mb-8">
                   <div className="bg-[#1e1f20] border border-[#444746]/60 p-4 rounded-none">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Cadeira Selecionada</p>
                      <p className="text-sm font-medium text-white uppercase">{checkoutSeat.r}</p>
                   </div>
                   <div className="bg-[#1e1f20] border border-[#444746]/60 p-4 rounded-none">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Região de Controle</p>
                      <p className="text-sm text-white">{checkoutSeat.role}</p>
                   </div>
                   <div className="bg-[#1e1f20] border border-green-500/20 p-4 rounded-none border-l-2 border-l-green-500 flex justify-between items-center">
                      <span className="text-[10px] md:text-xs font-medium text-white uppercase tracking-widest">Valor do Aporte</span>
                      <span className="text-xl font-mono text-green-500">{checkoutSeat.price}</span>
                   </div>
                </div>

                <div className="text-xs text-neutral-500 mb-6 italic leading-relaxed">
                   * Em ambiente simulado (preview), o pagamento será confirmado instantaneamente para fins de visualização do fluxo de investimento. Nenhum valor real será cobrado.
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessingPayment}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:bg-[#1e1f20] disabled:text-neutral-500 transition-colors text-black font-medium uppercase tracking-widest text-[10px] md:text-sm py-4 flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? 'Processando Contrato & Aporte...' : 'Pagar e Garantir Vaga'}
                </button>
            </div>
        </div>
      )}
    </div>
  );

  const renderTransparencia = () => (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* SEÇÃO PRINCIPAL DEDICADA: AUDITORIA PATRIMONIAL CONSOLIDADA */}
      <div className=" bg-[#1e1f20] border border-[#444746]/60 p-8 rounded-none relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#000080] via-transparent to-[#8B0000]/10"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-[#444746]/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-widest font-medium text-neutral-500 text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-none">
                Conselho Master W12
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest font-medium text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-none">
                Selo de Lastro Físico
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase">
              Central de Auditoria Patrimonial
            </h3>
            <p className="text-xs text-neutral-500 italic mt-1 font-sans">
              Apuração trimestral unificada de consumo de estoque, volume físico na BlackShop™ e validação do conselho.
            </p>
          </div>

          <button
            onClick={handleExtractAuditReport}
            disabled={isGeneratingAudit}
            className={`w-full lg:w-auto relative px-6 py-3.5 rounded-none font-medium text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
              isGeneratingAudit 
                ? 'bg-[#1e1f20] text-neutral-500 cursor-not-allowed'
                : 'bg-[#000080] text-white hover:bg-[#000060] bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isGeneratingAudit ? (
              <>
                <span className="w-4 h-4 border-2 border-t-transparent border-white/[0.08] rounded-none animate-spin"></span>
                <span>Processando Ledger...</span>
              </>
            ) : (
              <>
                <FileText size={16} />
                <span>Extrair Relatório de Auditoria 1T/2026</span>
              </>
            )}
          </button>
        </div>

        {/* Três pilares de seriedade do investidor Private Equity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pilar 1: Entrega de Estoque */}
          <div className="p-5 bg-[#131314] border border-slate-200/60 border-[#444746]/60 rounded-none flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">Pilar de Utilização</p>
              <h4 className="text-xs font-medium text-white uppercase mb-3 flex items-center gap-1.5">
                <Activity size={12} className="text-blue-500" /> Entrega de Estoque
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4 font-sans">
                Consumo e aplicação física de bobinas de películas de alta performance homologadas pelas unidades ativas.
              </p>
            </div>
            
            <div className="mt-2 pt-4 border-t border-[#444746]/60/40">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[9px] tracking-wider text-white/30 uppercase">Volume Q1</span>
                <span className="text-xs font-medium text-white">1.420,50 m² consumidos</span>
              </div>
              <div className="h-1.5 w-full rounded-none overflow-hidden">
                <div className="h-full bg-blue-600 bg-blue-500" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          {/* Pilar 2: Prova de Lastro */}
          <div className="p-5 bg-[#131314] border border-slate-200/60 border-[#444746]/60 rounded-none flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">Ativo Tangível</p>
              <h4 className="text-xs font-medium text-white uppercase mb-3 flex items-center gap-1.5">
                <Shield size={12} className="text-white" /> Lastro BlackShop™
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4 font-sans">
                Garantia física de bobinas intocadas em nosso CD central logístico para garantir fornecimento ininterrupto.
              </p>
            </div>

            <div className="mt-2 pt-4 border-t border-[#444746]/60/40">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[9px] tracking-wider text-white/30 uppercase">Auditado</span>
                <span className="text-xs font-medium text-zinc-400">1.200 Bobinas Ativas</span>
              </div>
              <div className="h-1.5 w-full rounded-none overflow-hidden">
                <div className="h-full bg-white" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Pilar 3: Assinatura do Conselho */}
          <div className="p-5 bg-[#131314] border border-slate-200/60 border-[#444746]/60 rounded-none flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">Chave de Governança</p>
              <h4 className="text-xs font-medium text-white uppercase mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-neutral-500 text-neutral-300" /> Conselho W12
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4 font-sans">
                Membros titulares atestam o lastro societário, garantindo conformidade jurídica de Private Equity.
              </p>
            </div>

            <div className="mt-2 pt-4 border-t border-[#444746]/60/40">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[9px] tracking-wider text-white/30 uppercase">Assinaturas</span>
                <span className="text-xs font-medium text-neutral-500 text-neutral-300 uppercase tracking-wider font-mono">12/12 INTEGRALIZADO</span>
              </div>
              <div className="flex gap-1 justify-between">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx} className="h-1.5 flex-1 mx-[1px] bg-blue-600 bg-blue-500 rounded-none" title={`Conselheiro ${idx+1} validado`}></div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Secundário: Governança, logs e relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Relatórios e Regras */}
        <div className="lg:col-span-2  bg-[#1e1f20] border border-[#444746]/60 p-8 rounded-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-medium text-white uppercase tracking-widest">Documentação legal & Payouts</h3>
              <p className="text-xs text-neutral-500 italic">Métricas de governança, conformidade regulatória e dividendos.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INVESTMENT_RULES.map((rule, i) => (
                <div key={i} className="p-4 border border-slate-200/60 border-[#444746]/60 rounded-none">
                  <h4 className="text-xs md:text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Shield size={10} /> {rule.title}
                  </h4>
                  <p className="text-sm md:text-[11px] text-neutral-400 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-[#444746]/60/40">
              <h4 className="text-xs font-medium text-white uppercase tracking-widest mb-4">Relatórios de Auditoria Adicionais</h4>
              <div className="space-y-2">
                {REPORTS.map(report => (
                  <div key={report.id} onClick={() => handleViewReport(report.id)} className="flex items-center justify-between p-4 bg-white/5 border border-[#444746]/60 hover:border-white/[0.08] transition-all group cursor-pointer rounded-none">
                    <div className="flex items-center gap-4">
                      <Activity size={16} className="text-neutral-400 group-hover:group-hover:text-white transition-colors" />
                      <div>
                        <p className="text-xs font-medium text-white">{report.title}</p>
                        <p className="text-[10px] text-neutral-500 uppercase font-mono">{report.date} • {report.type}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleViewReport(report.id); }} className="text-xs md:text-[10px] font-mono group-hover:group-hover:text-white transition-colors flex items-center gap-2">
                      VIEW <ChevronRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Ledger / Feed de Atividades */}
        <div className=" bg-[#1e1f20] border border-[#444746]/60 p-8 rounded-none relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={14} className="text-neutral-500" /> Live Activity Feed
            </h3>
            <div className="space-y-4">
              {liveRecentTransactions.map((tx) => (
                <div key={tx.id} className="border-l border-[#444746]/60 pl-4 py-2 relative">
                  <div className="absolute -left-[4.5px] top-4 w-2 h-2 rounded-none /10"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-medium text-white/80">{tx.user}</p>
                    <span className="text-[10px] font-mono text-white/30 uppercase">{tx.time}</span>
                  </div>
                  <p className="text-xs mb-1">{tx.action}</p>
                  <p className="text-xs font-mono font-medium text-white">{tx.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#444746]/60 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-light">
              Todas as transações registradas via <br/> Sinf-Chain Ledger v2.1
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className=" bg-[#1e1f20] border border-[#444746]/60 p-8 rounded-none">
          <h4 className="text-xs md:text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-4 italic">Alocação de Recursos (Q1 2026)</h4>
          <div className="space-y-4">
            {[
              { label: 'Marketing de Aquisição', value: 45 },
              { label: 'P&D (Novos Insumos)', value: 20 },
              { label: 'Logística BlackShop', value: 25 },
              { label: 'Custos Operacionais', value: 10 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs md:text-[10px] font-mono text-neutral-500 mb-2 uppercase">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-1 w-full">
                  <div className="h-full bg-[#0F172A] transition-all duration-1000" style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" bg-[#1e1f20] border border-[#444746]/60 p-8 rounded-none flex flex-col justify-between items-start text-left">
            <Lock size={32} className="mx-auto text-neutral-500 mb-4" />
            <h4 className="text-sm font-medium text-white uppercase tracking-widest mb-2">Área de Votação (LPs)</h4>
            <p className="text-xs text-white/30 italic">Disponível apenas para investidores Tier 1 & Elite Squad.</p>
        </div>
      </div>
    </div>
  );

  const renderFormalizacao = () => (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 relative overflow-hidden">
        <h3 className="text-xl md:text-2xl font-medium mb-2 text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="text-white" /> Plano de Negócios & Formalização
        </h3>
        <p className="text-xs md:text-sm text-neutral-500 mb-8 max-w-3xl">
          Documentação legal, contrato de adesão, estimativas de rentabilidade e fluxo de pagamentos (Yield) referentes às quotas de licenciamento (Asset Light e W12).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Section for clear explanation */}
          <div className="lg:col-span-2 bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8">
            <h4 className="text-xl font-medium text-white mb-4 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-none bg-green-500/20 text-green-500 flex items-center justify-center text-sm">?</span>
              Como funciona na prática?
            </h4>
            <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
              O ecossistema WINF possui vagas limitadas por região para garantir rentabilidade a quem entra: <strong>100 vagas Asset Light</strong> e <strong>12 vagas Master (W12)</strong>. O seu capital é alocado diretamente na infraestrutura, estoque (BlackShop) e marketing local, gerando vendas todos os dias que retornam lucro para você.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} /></div>
                <h5 className="text-sm font-medium text-white mb-2 uppercase tracking-widest">Exemplo 1: Investindo R$ 5.000</h5>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">Quotas Fracionadas Asset Light</p>
                <ul className="text-sm text-white/70 space-y-3">
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Para quem é:</strong> Investidor menor que deseja validar o formato antes de maiores aportes.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Onde entra o dinheiro:</strong> Compra direta de estoque na BlackShop para subsidiar uma operação de instalação na sua região.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Quando recebe:</strong> A partir de 30 dias após a ativação do capital.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Quanto recebe:</strong> Estimativa conservadora de R$ 500 a R$ 800 por mês (10% a 16%), até que lucre o dobro do investido (retorno rápido).</li>
                </ul>
              </div>
              <div className="bg-[#1e1f20] border border-green-500/20 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-green-500/10"><Globe size={64} /></div>
                <h5 className="text-sm font-medium text-white mb-2 uppercase tracking-widest">Exemplo 2: Investindo R$ 100.000</h5>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">Cadeira Estratégica (Hub Master W12 Regional)</p>
                <ul className="text-sm text-white/70 space-y-3">
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Para quem é:</strong> Investidores tubarões que querem controle e dominar uma grande região metropolitana.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Onde entra o dinheiro:</strong> Você recebe os Direitos Regionais e abre o Centro de Distribuição Oficial.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Quando recebe:</strong> Recebe ganhos imediatos a cada mês sobre TODOS os Autorizados menores (Asset Lights) na sua área. Recebe, extra, dividendos a cada 3 meses.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Quanto recebe:</strong> Rendimentos altíssimos mensais (Yield / Profit Share contínuo), e a construção de um Equity estimado em milhões após o terceiro ano.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Asset Light Card */}
          <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-neutral-500" />
                <h4 className="text-lg font-medium text-white uppercase tracking-widest">Produto Alpha: Licença Territorial [WINF.ALPHA]</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                Licença Territorial com órbita digital pré-provisionada (Instagram, WhatsApp, subdomínio e Google Meu Negócio) pronta para faturar. Sem nenhuma taxa de royalties sobre serviços.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Adesão Única</span>
                  <span className="text-sm font-mono text-white font-medium">R$ 15.000,00</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Taxa de Royalties</span>
                  <span className="text-sm font-mono text-green-400 font-medium">R$ 0,00 (ISENTO)</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Rendimento Esperado</span>
                  <span className="text-sm font-mono text-white">R$ 300.000,00+ Ano (Santos)</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Vias de Escoamento</span>
                  <span className="text-sm font-mono text-white">Repasse BlackShop™</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Acesso ao Software</span>
                  <span className="text-sm font-mono text-white">WINF OS™ Incluso</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => { setDocVaultInitialTab('ativos'); setDocVaultInitialDocId('doc-alpha-license'); setActiveTab('doc_vault'); }} className="w-full  text-black py-4 font-medium uppercase text-[10px] tracking-widest flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors">
              <Download size={14} /> Download Dossiê do Autorizado (Asset Light)
            </button>
          </div>

          {/* W12 Board Seat Card */}
          <div className="bg-[#1e1f20] border border-green-500/20 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-none blur-[40px] pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe size={20} className="text-green-500" />
                <h4 className="text-lg font-medium text-white uppercase tracking-widest">Produto Gama: Conselho W12 [W12.BR]</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                Assento no Conselho de Administração, transformando sua operação em Hub Regional com Profit Share e ganhos logísticos de toda a macrorregião geográfica.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Aporte Inicial</span>
                  <span className="text-sm font-mono text-white font-medium">R$ 250.000 ~ R$ 1MM+</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Rendimento Estimado / Mês</span>
                  <span className="text-sm font-mono text-green-400 font-medium">Baseado em Volume (Yield 4%~8%)</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Dividendos (Profit Pool)</span>
                  <span className="text-sm font-mono text-white">Trimestral (Quarterly)</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Exit Event (M&A / IPO)</span>
                  <span className="text-sm font-mono text-white">Elegível após 36 meses</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#444746]/60 pb-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Lock-up Start</span>
                  <span className="text-sm font-mono text-white">12 Meses de Carência</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => { setDocVaultInitialTab('ativos'); setDocVaultInitialDocId('doc-gamma-hub'); setActiveTab('doc_vault'); }} className="w-full bg-green-500/20 text-green-400 border border-green-500/30 py-4 font-medium uppercase text-[10px] tracking-widest flex justify-center items-center gap-2 hover:bg-green-500/30 transition-colors">
              <Download size={14} /> Download Acordo de Acionistas (Rascunho)
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white uppercase tracking-widest mb-6 border-b border-[#444746]/60 pb-4">Documentos Legais para Formalização</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Contrato de Aquisição Asset Light', desc: 'SLA de operação e termo de distrato.', v: 'v2.4', id: 'alpha_02' },
              { title: 'NDA & Acordo de Confidencialidade', desc: 'Obrigatório para acesso à DRE Blackshop.', v: 'v1.1', id: 'beta_01' },
              { title: 'Modelo de Receita & ROI Kiosk', desc: 'Planilha estática com previsibilidade de caixa.', v: 'v3.0', id: 'kiosk_03' },
              { title: 'Prospecto M&A (W12 Series A)', desc: 'Deck de valuation das 12 cadeiras e expansão nacional.', v: 'v5.8', id: 'gamma_02' },
            ].map(doc => (
              <div key={doc.title} onClick={() => { setDocVaultInitialTab('governanca'); setDocVaultInitialDocId(doc.id); setActiveTab('doc_vault'); }} className="bg-[#1e1f20] border border-[#444746]/60 p-4 flex justify-between items-center group cursor-pointer hover:border-white/[0.08] transition-all">
                 <div>
                    <h5 className="text-xs font-medium text-white mb-1">{doc.title}</h5>
                    <p className="text-[10px] text-neutral-500 uppercase">{doc.desc}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-neutral-400 px-2 py-1 rounded-none">{doc.v}</span>
                    <button onClick={(e) => { e.stopPropagation(); setDocVaultInitialTab('governanca'); setDocVaultInitialDocId(doc.id); setActiveTab('doc_vault'); }} className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 transition-colors">
                       <Download size={16} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-10 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-none flex gap-4 items-start">
          <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-1" />
          <div>
            <h5 className="text-xs font-medium text-yellow-500 uppercase tracking-widest mb-2">Notice Legal de Risco (Risk Warning)</h5>
            <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed font-mono">
              O WINF Universo Dark (Portal do Investidor) apresenta projeções de ganhos baseadas em resultados históricos da nossa rede própria (AeroCore). Investimentos de modalidade Corporate Equity, Venture Capital e Licenciamento Comercial envolvem risco de capital. Retornos mensais e dividendos não são universalmente garantidos e variam conforme o modelo de absorção da região. 
              <br/><br/>
              Ao avançar e realizar a assinatura digital (Formalização), o investidor declara ter lido o material CVM pertinente e concorda com os termos de Lock-up do Acordo de Sócios Ocultos (SCP).
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isVerifying) return <div className="min-h-screen bg-[#1e1f20] flex items-center justify-center text-neutral-500"><div className="w-8 h-8 border-2 border-white/20 border-t-transparent rounded-none animate-spin"></div></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1e1f20] flex flex-col items-center justify-center p-6 text-neutral-500 relative overflow-hidden">
        {notification && (
          <div className="fixed top-4 right-4 bg-white text-white px-6 py-3 rounded-none shadow-lg z-50 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
            <Activity size={16} />
            {notification}
          </div>
        )}
        
        <div className="relative z-10 w-full max-w-md">
          <div className="flex flex-col items-start mb-10 text-left">
            <WinfLogo className="text-5xl mb-4 text-white/80" />
            <h1 className="text-2xl font-light tracking-wide uppercase text-neutral-500 mb-2">
              Universo <span className="font-medium text-white/80">Dark</span>
            </h1>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold font-sans">Área Segura do Autorizado WINF</p>
          </div>

          <form onSubmit={handleAccess} className="bg-[#1e1f20] border border-[#444746]/60 p-6 md:p-8 rounded-none w-full relative z-10 space-y-6 shadow-2xl">
            {loginError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 text-xs text-center font-semibold rounded-none uppercase">
                {loginError}
              </div>
            )}

            <div className="space-y-5">
              {isRegistering && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-medium text-neutral-500 tracking-wider">Nome do Autorizado (Razão Social)</label>
                  <input 
                    type="text" 
                    required={isRegistering}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1e1f20] border border-[#444746]/60 focus:border-white/20 rounded-none py-3 px-4 text-sm text-neutral-500 focus:outline-none transition-all placeholder:text-[#27272A] min-h-[48px]"
                    placeholder="DIGITE SEU NOME OU CONTA CORPORATIVA"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-medium text-neutral-500 tracking-wider">Email Cadastrado</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e1f20] border border-[#444746]/60 focus:border-white/20 rounded-none py-3 px-4 text-sm text-neutral-500 focus:outline-none transition-all placeholder:text-neutral-500 min-h-[48px]"
                  placeholder="exemplo@vostro.com.br"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-medium text-neutral-500 tracking-wider">Senha de Acesso</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1e1f20] border border-[#444746]/60 focus:border-white/20 rounded-none py-3 px-4 text-sm text-neutral-500 focus:outline-none transition-all placeholder:text-neutral-500 min-h-[48px]"
                  placeholder="••••••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-[#E4E4E7] hover: text-black font-medium uppercase tracking-wider text-xs md:text-sm py-4 rounded-none transition-all flex justify-center items-center gap-2 mt-2 cursor-pointer shadow-lg min-h-[48px]"
              >
                {isLoggingIn ? 'Verificando Chaves...' : (
                  isRegistering ? 'Criar Credencial' : 'Entrar na Sessão Segura'
                )}
              </button>
            </div>

            <div className="text-center pt-2 border-t border-[#444746]/60/40">
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-white/80 hover:text-white/80/80 uppercase tracking-widest font-semibold cursor-pointer py-1.5"
              >
                {isRegistering ? 'Já possuo conta de investidor' : 'Criar nova credencial corporativa'}
              </button>
            </div>
          </form>

          {/* Minimalist Tech Dev Area */}
          <div className="mt-12 text-center flex flex-col items-center gap-4 font-mono text-xs tracking-widest text-neutral-500">
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                type="button" 
                onClick={() => {
                  setUser({ uid: 'dev-mode', email: 'investidor@winf.com.br' } as FirebaseUser);
                }}
                className="hover:text-white hover:bg-white/5 transition-colors border border-[#444746]/60 hover:border-[#71717A] px-4 py-2 bg-transparent rounded-none text-xs font-semibold cursor-pointer"
              >
                [ DEV BYPASS ]
              </button>

              <button 
                onClick={onBack} 
                className="hover:text-white hover:bg-white/5 transition-colors border border-[#444746]/60 hover:border-[#71717A] px-4 py-2 bg-transparent rounded-none text-xs font-semibold cursor-pointer"
              >
                [ Retornar ao Sistema ]
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#131314] text-neutral-300 transition-all duration-300 overflow-x-hidden flex flex-col font-sans relative selection:bg-white/30 selection:text-white">
      {/* Premium Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
      <DashboardHeader 
        metrics={metrics} 
        activeTab={activeTab} 
        onNavigateTab={(tab) => setActiveTab(tab as any)} 
      />
      
      <LiveTicker tickers={activeTickers} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-8 space-y-8">
        {notification && (
          <div className="fixed top-4 right-4 bg-white text-white px-6 py-3 rounded-none shadow-lg z-50 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
            <Activity size={16} className="animate-pulse" />
            {notification}
          </div>
        )}

      {/* Ambiente Seguro de Auditoria WINF */}
      <div className="bg-[#1e1f20] border border-[#444746]/60 p-5 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <Shield className="text-zinc-450 shrink-0" size={20} />
          <div className="text-left font-sans">
            <span className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider block">AMBIENTE SEGURO DE GOVERNANÇA CORPORATIVA</span>
            <p className="text-xs text-neutral-400 mt-0.5">Sessão criptografada de auditoria ativa para <strong>{appUser?.email || 'Investidor Gold'}</strong>.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-none bg-white"></span>
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Auditado e Seguro</span>
        </div>
      </div>

      {/* Retornar ao ecossistema global button */}
      <div className="flex items-center justify-between border-b border-[#444746]/60 pb-5 mt-2">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 transition-all text-xs font-medium uppercase tracking-widest bg-[#1e1f20] border border-[#444746]/80 text-white hover:bg-zinc-800 hover:border-zinc-500 px-4 py-2 rounded-none cursor-pointer"
        >
          <ChevronLeft size={14} className="text-neutral-400" />
          <span>Voltar ao Sistema Central</span>
        </button>

        <div className="text-right text-xxs font-mono uppercase tracking-widest hidden sm:block">
          WINF Partners Terminal • ID: {appUser?.email || 'Investidor Gold'}
        </div>
      </div>

                {activeTab === 'hub' && (
        <div className="space-y-6 font-sans text-neutral-300">
          
          {/* Top Bar: Title & Global Quick Filter */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#1e1f20] border border-[#444746]/60 p-8 rounded-none relative transition-all">
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-light uppercase tracking-[0.1em] text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-white/40"></span>
                Painel Executivo Operacional
              </h2>
              <p className="text-xs text-neutral-500 font-light mt-2 tracking-widest uppercase">
                Gestão Consolidada de Ativos e Metas
              </p>
            </div>
            
            {/* 🕹️ Global Quick Filter Pill Buttons */}
            {activePersona === 'admin' ? (
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 relative z-10 w-full overflow-hidden min-w-0">
                <span className="text-[10px] font-medium uppercase text-neutral-500 tracking-[0.2em] shrink-0">Filtro Setorial:</span>
                <div className="flex bg-[#131314] border border-[#444746]/50 p-1 gap-1 w-full lg:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide min-w-0">
                  <button
                    onClick={() => setGlobalFilter('geral')}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all ${globalFilter === 'geral' ? 'bg-[#1e1f20] text-white border border-[#444746]/70 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                  >
                    Visão Global
                  </button>
                  <button
                    onClick={() => setGlobalFilter('alpha')}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all ${globalFilter === 'alpha' ? 'bg-[#1e1f20] text-white border border-[#444746]/70 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                  >
                    Territórios
                  </button>
                  <button
                    onClick={() => setGlobalFilter('beta')}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all ${globalFilter === 'beta' ? 'bg-[#1e1f20] text-white border border-[#444746]/70 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                  >
                    Liquidez
                  </button>
                  <button
                    onClick={() => {
                      setGlobalFilter('realtime');
                      setNotification('WINF Realtime™ Executado: Filtrando apenas Ativos Reais!');
                    }}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${globalFilter === 'realtime' ? 'bg-white/[0.08] text-zinc-300 font-medium border border-[#444746]/60' : 'text-neutral-500 hover:text-zinc-300'}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                    Terminal
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-3 bg-[#1e1f20] border border-[#444746]/80 text-neutral-300 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Visão Adaptativa: Sorocaba (SP)
              </div>
            )}
          </div>

          {/* ⚡ Active WINF Realtime CLI Script Status Line */}
          {globalFilter === 'realtime' && activePersona === 'admin' && (
            <div className="bg-[#131314] border border-[#444746]/60 p-6 lg:p-8 flex flex-col gap-6 text-left transition-all">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-block w-2.5 h-2.5 bg-white animate-pulse"></span>
                  <span className="text-white text-[10px] font-medium uppercase tracking-[0.2em]">Conexão Segura Estabelecida</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto overflow-hidden min-w-0">
                  <span className="text-[10px] text-neutral-500 uppercase font-medium tracking-widest shrink-0">Modo de Relatório:</span>
                  <div className="flex bg-[#1e1f20] border border-[#444746]/60 p-1 gap-1 w-full sm:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide min-w-0">
                    <button
                      onClick={() => {
                        setWinfRealtimeMode('real_operational');
                        setNotification('Visualização: MODO REALISTA (OPERACIONAL REAL) ativado.');
                      }}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all ${
                        winfRealtimeMode === 'real_operational'
                          ? 'bg-neutral-800 text-white font-medium'
                          : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      Realidade Ativa
                    </button>
                    <button
                      onClick={() => {
                        setWinfRealtimeMode('strategic_projection');
                        setNotification('Visualização: MODO ESTRATEGISTA (ALVO) ativado.');
                      }}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all ${
                        winfRealtimeMode === 'strategic_projection'
                          ? 'bg-neutral-800 text-white font-medium'
                          : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      Projeção Linear
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-xs font-medium uppercase tracking-[0.1em] text-white">Target Direcional</h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Painel calibrado para avaliação patrimonial. Reflete dados da infraestrutura isolada ou inclui expansões projetadas no pipeline da Master.
                  </p>
                </div>
                <div className="bg-[#1e1f20] p-5 border border-[#444746]/60 text-left overflow-x-auto whitespace-nowrap scrollbar-hide min-w-0">
                  <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-4">Métricas do Nó Operacional:</p>
                  <table className="w-full text-xs font-light text-neutral-300">
                    <tbody>
                      <tr className="border-b border-white/[0.02]">
                        <td className="py-2.5">Capital de Referência</td>
                        <td className="py-2.5 text-right font-medium text-white pl-4">
                          {winfRealtimeMode === 'real_operational' ? 'R$ 4,80 Milhões' : 'R$ 68,50 Milhões'}
                        </td>
                      </tr>
                      <tr className="border-b border-white/[0.02]">
                        <td className="py-2.5">Polos Interconectados</td>
                        <td className="py-2.5 text-right font-medium text-white pl-4">
                          {winfRealtimeMode === 'real_operational' ? '3 Polos Ativos' : '85 Licenças em Escala'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5">Conformidade Legal</td>
                        <td className="py-2.5 text-right font-medium text-zinc-300 pl-4">
                          Auditado SEC / CVM
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BENTO GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Top Row: KPIs in 12 columns, splitting into 3 neat symmetric tiles on md and up. Highly readable, zero visual noise or asymmetry */}
            <div className={`col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 ${globalFilter === 'beta' ? 'opacity-40 grayscale' : ''}`}>
               {/* Card 1 */}
               <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 flex flex-col justify-between relative group hover:border-[#444746] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] uppercase font-medium text-[#c0c0c0] tracking-[0.2em]">Volume de Capital</h4>
                    <DollarSign size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-light text-white tracking-tight">R$ 4.885.000</div>
                    <div className="mt-4 flex items-center gap-2">
                       <span className="text-[9px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-400 border-none font-medium">↑ 28.4%</span>
                       <span className="text-[9px] text-[#8e8e8f] uppercase tracking-widest font-mono">Ano Corrente</span>
                    </div>
                  </div>
               </div>

               {/* Card 2 */}
               <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 flex flex-col justify-between relative group hover:border-[#444746] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] uppercase font-medium text-[#c0c0c0] tracking-[0.2em]">Distribuição Acumulada</h4>
                    <Briefcase size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-light text-white tracking-tight">R$ 2.450.000</div>
                    <div className="mt-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                       <span className="text-[9px] text-[#8e8e8f] uppercase tracking-widest font-mono">Liquidado em Carteira</span>
                    </div>
                  </div>
               </div>

               {/* Card 3 */}
               <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 flex flex-col justify-between relative group hover:border-[#444746] transition-colors duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-[10px] uppercase font-medium text-[#c0c0c0] tracking-[0.2em]">Taxa de Ocupação da Rede</h4>
                    <MapPin size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-light text-white tracking-tight">88.5%</div>
                    <div className="mt-4 flex items-center gap-2">
                       <span className="text-[9px] px-1.5 py-0.5 bg-emerald-900/40 text-emerald-400 border-none font-medium font-mono">88 / 100 Praças</span>
                       <span className="text-[9px] text-[#8e8e8f] uppercase tracking-widest">Estabilidade Nominal</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Radar Heatmap taking up 12 cols, beautifully spacious (ocupação territorial is next) */}
            <div className="col-span-12 bg-[#1e1f20] border border-[#444746]/60 p-1 flex flex-col justify-between">
                <RadarMap 
                    cities={liveCities} 
                    onInvestInScenario={(poolId) => {
                    setSelectedPool(poolId);
                    setActiveTab('dashboard');
                    setNotification(`Redirecionamento de Cota: Iniciando aporte tático no pool Alpha!`);
                }} 
                />
            </div>

            {/* Bottom Section - Lists / Cli / Geo Strategy */}
            {/* Bloco B & C content */}
            <div className={`md:col-span-12 xl:col-span-6 space-y-6 transition-all ${globalFilter === 'beta' ? 'opacity-25 pointer-events-none' : ''}`}>
                <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 h-full flex flex-col">
                    <div className="border-b border-[#444746]/50 pb-6 mb-6 flex justify-between items-end">
                        <div>
                            <h3 className="text-sm uppercase tracking-widest text-white font-medium">Relatório de Municípios</h3>
                            <p className="text-[10px] text-neutral-500 uppercase mt-1.5 tracking-widest font-light">Direitos de Exploração e Escala</p>
                        </div>
                        <div className="px-3 py-1 bg-[#131314] border border-[#444746]/60 text-[9px] uppercase tracking-widest text-neutral-300">
                            100 Territórios
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[300px] space-y-2 pr-2 scrollbar-thin">
                    {liveCities.filter(c => {
                      if (globalFilter === 'realtime') {
                        if (winfRealtimeMode === 'real_operational') {
                          return c.city.includes('Santos') || c.city.includes('Sorocaba') || c.city.includes('São Paulo') || c.city.includes('Campina Grande');
                        }
                      }
                      return true;
                    }).map((c, i) => {
                      const displayStatus = c.city.includes('Campina Grande') ? 'Centro de TI' : c.status;
                      const isTiInfra = displayStatus.includes('Infraestrutura') || displayStatus.includes('TI');
                      return (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#131314] border border-[#444746]/45 hover:border-zinc-700 transition-colors gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white tracking-wide truncate">{c.city}</p>
                            <span className={`text-[9px] uppercase tracking-widest mt-1 block truncate ${
                                isTiInfra ? 'text-zinc-300' :
                                c.status === 'Bloqueado' ? 'text-white/60' : 
                                'text-neutral-500'
                            }`}>
                              {displayStatus}
                            </span>
                          </div>
                          <div>
                            {c.key ? (
                              <button 
                                onClick={() => {
                                  if (c.city.includes('Campina Grande')) {
                                    setShowTiRedirectModal(true);
                                  } else {
                                    setSelectedCityApiKey({ city: c.city, key: c.key });
                                  }
                                }}
                                className="px-4 py-2 bg-white text-black text-[10px] font-medium tracking-widest uppercase hover:bg-neutral-200 transition-all cursor-pointer"
                              >
                                {c.city.includes('Campina Grande') ? 'Conectar' : 'Analisar'}
                              </button>
                            ) : (
                              <span className="text-[10px] text-neutral-600 uppercase tracking-widest px-2">Livre</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>

            <div className={`md:col-span-12 xl:col-span-6 space-y-6 transition-all ${globalFilter === 'alpha' ? 'opacity-25 pointer-events-none' : ''}`}>
                <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 h-full flex flex-col">
                    <div className="border-b border-[#444746]/50 pb-6 mb-6 flex justify-between items-end">
                        <div>
                            <h3 className="text-sm uppercase tracking-widest text-white font-medium">Eventos Operacionais</h3>
                            <p className="text-[10px] text-neutral-500 uppercase mt-1.5 tracking-widest font-light">Últimas Atualizações do Portfólio</p>
                        </div>
                        <Activity className="text-neutral-500" size={14} />
                    </div>

                    <div className="flex-1 overflow-hidden min-h-[300px] relative space-y-3">
                        <div className="p-4 border border-[#444746]/40 bg-[#131314] flex items-start gap-4">
                            <div className="mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                            <div>
                                <h4 className="text-xs text-white font-medium mb-1">Aporte de Liquidez Concluído</h4>
                                <p className="text-[10px] text-neutral-400">Polo de Sorocaba recebeu novo aporte de infraestrutura (R$ 150k).</p>
                                <span className="text-[9px] text-neutral-500 font-mono mt-2 block">HOJE, 09:41</span>
                            </div>
                        </div>

                        <div className="p-4 border border-[#444746]/40 bg-[#131314] flex items-start gap-4">
                            <div className="mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                            </div>
                            <div>
                                <h4 className="text-xs text-white font-medium mb-1">Auditoria Trimestral Iniciada</h4>
                                <p className="text-[10px] text-neutral-400">Processo de verificação de cotas da região Alpha Sul em andamento.</p>
                                <span className="text-[9px] text-neutral-500 font-mono mt-2 block">ONTEM, 14:22</span>
                            </div>
                        </div>

                        <div className="p-4 border border-[#444746]/40 bg-[#131314] flex items-start gap-4">
                            <div className="mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                            </div>
                            <div>
                                <h4 className="text-xs text-white font-medium mb-1">Distribuição de Dividendos (Payout)</h4>
                                <p className="text-[10px] text-neutral-400">Ciclo anterior liquidado e depositado para cotistas da Master.</p>
                                <span className="text-[9px] text-neutral-500 font-mono mt-2 block">10 MAI, 08:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'painel' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Left Col - Graph */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 relative shadow-2xl">
              <div className="absolute top-0 right-0 p-4"><Eye size={20} className="text-white/10" /></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 className="text-xl font-light text-white tracking-tight mb-1">Previsão Alpha de Crescimento</h3>
                    <p className="text-xs md:text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">Escala Nacional (Base BlackShop Revenue)</p>
                  </div>
              </div>

              <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={GROWTH_DATA}>
                        <defs>
                          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="dividendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="step" stroke="#666" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" stroke="#666" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#22c55e" tick={{fill: '#22c55e', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#131314', border: '1px solid #444746', borderRadius: '0px', fontSize: '10px', color: '#a3a3a3' }} itemStyle={{color: '#a3a3a3'}} />
                        <Area yAxisId="left" type="monotone" dataKey="equity" name="Valuation/Equity (M)" stroke="#888" strokeWidth={2} fillOpacity={1} fill="url(#equityGrad)" />
                        <Area yAxisId="right" type="monotone" dataKey="dividend" name="Dividendos Distrib. (M)" stroke="#22c55e" strokeWidth={1} fillOpacity={1} fill="url(#dividendGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Globe size={16} /> Oportunidades de Alocação</h3>
              <div className="space-y-4">
                  {INVESTMENT_POOLS.map((pool) => (
                    <div 
                      key={pool.id} 
                      onClick={() => setSelectedPool(pool.id)}
                      className={`bg-[#1e1f20]/60 border ${selectedPool === pool.id ? 'border-[#444746]' : 'border-[#444746]/40'} p-6 cursor-pointer hover:border-[#444746] transition-all group`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] px-2 py-0.5 border border-[#444746]/40 text-neutral-500 uppercase tracking-[0.2em]">{pool.type}</span>
                            <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] px-2 py-0.5 text-neutral-500 uppercase tracking-[0.2em]">Risco: {pool.risk}</span>
                          </div>
                          <h4 className="text-xl font-medium text-white mb-2 group-hover:text-neutral-400 transition-colors uppercase italic tracking-tighter">{pool.name}</h4>
                          <p className="text-xs text-neutral-500 leading-relaxed max-w-lg italic font-light">"{pool.description}"</p>
                        </div>
                        
                        <div className="w-full md:w-auto flex-shrink-0 bg-[#131314] p-4 border border-[#444746]/50 md:min-w-[200px]">
                          <div className="flex justify-between mb-4">
                            <div>
                              <p className="text-[10px] md:text-[8px] text-neutral-500 uppercase tracking-[0.2em] mb-1">Aporte/Entry</p>
                              <p className="text-sm font-mono text-white">{pool.min}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] md:text-[8px] text-neutral-500 uppercase tracking-[0.2em] mb-1">ROI Est.</p>
                              <p className="text-sm font-mono text-green-500 tracking-tighter">{pool.roi}</p>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-[10px] md:text-[8px] font-mono text-neutral-500 mb-2 italic">
                              <span>Absorção de Mercado</span>
                              <span>{pool.progress}%</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden">
                              <div className="h-full bg-white" style={{ width: `${pool.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Col - Execution */}
          <div className="space-y-6">
            <div className="bg-[#1e1f20] border border-[#444746]/60 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32  opacity-5 blur-[100px]"></div>
                
                <h4 className="text-xs md:text-[10px] font-medium text-white/30 uppercase tracking-[0.3em] mb-8 flex items-center gap-2 italic">
                  <Briefcase size={12} /> Execution Engine
                </h4>
                
                {!selectedPool ? (
                  <div className="text-left p-12 flex flex-col items-start border border-[#444746]/40 border-dashed">
                    <Fingerprint size={32} className="mx-auto text-white/20 mb-4" />
                    <p className="text-xs md:text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Selecione um Syndicate <br/> para visualizar a tese.</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in text-left">
                    {(() => {
                      const pool = INVESTMENT_POOLS.find(p => p.id === selectedPool);
                      return pool ? (
                        <>
                          <div className="border-b border-[#444746]/40 pb-6 mb-6">
                            <h5 className="text-2xl font-medium text-white mb-2 leading-none uppercase italic tracking-tighter">{pool.name}</h5>
                            <p className="text-xs md:text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em] mb-6">{pool.structure}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#131314] p-4 border border-[#444746]/60 rounded-none">
                                  <p className="text-xs md:text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-1">Target Yield</p>
                                  <p className="text-base font-mono text-green-500 font-medium">{pool.roi}</p>
                                </div>
                                <div className="bg-[#131314] p-4 border border-[#444746]/60 rounded-none">
                                  <p className="text-xs md:text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-1">Cycle Length</p>
                                  <p className="text-xs font-mono text-white mt-1 uppercase italic tracking-widest">{pool.payback}</p>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h6 className="text-xs md:text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-3 border-l-2 border-[#444746] pl-3">Tese Alpha</h6>
                                <p className="text-xs text-neutral-500 leading-relaxed font-light italic">"{pool.thesis}"</p>
                            </div>

                            <div className="mb-8">
                                <h6 className="text-xs md:text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-3 border-l-2 border-[#444746] pl-3">Arquivos de Inteligência</h6>
                                <div className="flex flex-col gap-1.5">
                                    {pool.docs.map((doc, i) => (
                                        <button onClick={() => setNotification('Download do arquivo indisponível no momento.')} key={i} className="flex items-center justify-between p-3 border border-[#444746]/50 hover:bg-[#131314] transition-all group w-full text-left cursor-pointer">
                                            <div className="flex items-center gap-3">
                                              <Share2 size={12} className="text-neutral-400 group-hover:text-neutral-400 transition-colors" />
                                              <span className="text-xs md:text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors">{doc}</span>
                                            </div>
                                            <Eye size={12} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-xs md:text-[10px] text-neutral-500 uppercase tracking-[0.1em]">Allocated: <span className="font-mono text-white">{pool.available}</span></p>
                          </div>
                          
                          <div className="space-y-4">
                            <button onClick={() => setNotification('Sua solicitação de interesse foi registrada. Um Capital Officer entrará em contato.')} className="w-full py-5 text-white font-medium text-xs md:text-[10px] uppercase tracking-[0.3em] bg-[#131314] hover:bg-neutral-800 border border-[#444746] transition-colors cursor-pointer">
                              Contact Capital Officer
                            </button>
                            <p className="text-sm md:text-[11px] md:text-sm md:text-[11px] md:text-[9px] text-neutral-400 text-left uppercase tracking-widest leading-loose">
                              Todas as propostas estão sujeitas ao KYC (Know Your Customer) e AML (Anti-Money Laundering).
                            </p>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
            </div>

            <div className="bg-[#1e1f20] border border-[#444746]/60 p-6 relative group overflow-hidden">
               <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white opacity-5 blur-3xl transition-all group-hover:opacity-10"></div>
               <h4 className="text-xs md:text-[10px] font-medium text-neutral-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <Shield size={12} /> Live Portfolio Monitor
               </h4>
               <div className="text-left py-6 flex flex-col items-start">
                  <div className="flex items-center justify-start gap-4 mb-2">
                    <p className="text-5xl font-mono font-light text-white tracking-tighter">R$ 0,00</p>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <span className="w-2 h-2 rounded-none bg-[#1e1f20]"></span>
                    <p className="text-xs md:text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-mono">No Active Positions Detected</p>
                  </div>
               </div>
               <div className="mt-6 pt-6 border-t border-[#444746]/60 flex justify-between items-center text-[10px] md:text-[8px] font-mono text-neutral-500">
                  <span className="uppercase tracking-widest italic">Status: Standby</span>
                  <span className="uppercase tracking-widest">Winf-Core v4.2</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'jornada' && renderJornada()}
      {activeTab === 'celulas' && renderCelulas()}
      {activeTab === 'formalizacao' && renderFormalizacao()}
      {activeTab === 'doc_vault' && (
        <ModuleDocVault 
          onBack={() => {
            setActiveTab('hub');
            setDocVaultInitialDocId(undefined);
          }} 
          initialTab={docVaultInitialTab}
          initialDocId={docVaultInitialDocId}
        />
      )}
      {activeTab === 'roadmap' && renderRoadmap()}
      {activeTab === 'transparencia' && renderTransparencia()}
      {activeTab === 'dashboard' && (
        <InvestorDashboard 
          user={user} 
          purchasedSeats={purchasedSeats} 
          onAccessDataRoom={() => {
            setDocVaultInitialTab('ativos');
            setDocVaultInitialDocId(undefined);
            setActiveTab('doc_vault');
          }} 
        />
      )}
      {activeTab === 'admin' && <AdminDashboardUniverso user={appUser} />}
      
      <div className="mt-12 text-center border-t border-[#444746]/60 pt-8">
        <div className="flex flex-col items-center gap-4">
          <WinfLogo className="text-xl text-white/20" />
          <p className="text-[10px] md:text-[8px] text-white/20 uppercase tracking-[0.4em] font-mono">
            Gestão de Capital Winf // Estritamente Confidencial // Camada de Criptografia Base-64
          </p>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default ModuleUniversoDark;
