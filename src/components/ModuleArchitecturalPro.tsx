
import React, { useState, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  Building2, 
  Maximize2, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  Camera, 
  RefreshCw, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Thermometer, 
  Sun,
  Layers,
  Wand2,
  Loader,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Clock,
  Info,
  Hexagon,
  Download,
  Printer,
  Share2,
  X,
  Terminal,
  CheckCircle2,
  Lock,
  FileSignature,
  FileText,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { useWinf } from '../contexts/WinfContext';
import { generateGeminiResponse } from '../lib/gemini';
import ArchitectureCalculator from './ArchitectureCalculator';

interface WindowPane {
  id: string;
  width: number;
  height: number;
  qty: number;
  type: string;
}

const ModuleArchitecturalPro: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [panes, setPanes] = useState<WindowPane[]>([]);
  const [newPane, setNewPane] = useState({ width: '', height: '', qty: '1', type: 'Vidro Simples' });
  const [activeTab, setActiveTab] = useState<'survey' | 'roi' | 'proposal' | 'orders'>('survey');
  const [facadeImg, setFacadeImg] = useState<string | null>(null);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const { user, products, addLead, addInstallationJob } = useWinf();

  // Obter películas de arquitetura do contexto, ou usar padrões
  // Metrics State
  const [metrics, setMetrics] = useState({
    m2Sold: 45,
    goal: 100,
    winfCoins: 1250,
    rank: 'Iniciante',
    patents: ['Explorador']
  });

  const getMotivation = (m2Sold: number, goal: number) => {
    const percent = (m2Sold / goal) * 100;
    if (percent < 25) return "O início é sempre desafiador! Vamos alcançar esses primeiros metros!";
    if (percent < 50) return "Você está ganhando ritmo! Continue focado.";
    if (percent < 75) return "Excelente progresso! A meta está logo ali!";
    if (percent < 100) return "Falta pouco! Reta final para bater os 100m²!";
    return "Meta batida! Parabéns pelo desempenho extraordinário!";
  };

  const checkGoal = () => {
    if (metrics.m2Sold >= metrics.goal) {
       setMetrics(prev => ({
         ...prev,
         goal: Math.floor(prev.goal * 1.5),
         rank: prev.rank === 'Iniciante' ? 'Avançado' : 'Elite',
         winfCoins: prev.winfCoins + 500,
         patents: prev.patents.includes('Estrategista') ? prev.patents : [...prev.patents, 'Estrategista']
       }));
    }
  };

  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const archProducts = useMemo(() => {
     const arch = products.filter(p => p.category === 'Arquitetura' || p.name.includes('Select') || p.name.includes('Arquitetura'));
     if (arch.length > 0) return arch;
     
     // Fallback if none found
     return [
        { id: '1', name: 'Winf Select™ Invisible', price: 280, cost_architect: 180, tech_specs: { tser: '58' } },
        { id: '2', name: 'Winf Select™ Dual Reflect', price: 160, cost_architect: 120, tech_specs: { tser: '72' } },
        { id: '3', name: 'Winf Select™ BlackPro', price: 140, cost_architect: 100, tech_specs: { tser: '65' } },
        { id: '4', name: 'Winf Select™ White', price: 160, cost_architect: 140, tech_specs: { tser: '55' } },
        { id: '5', name: 'Winf Security® Nível 2', price: 200, cost_architect: 170, tech_specs: { tser: '0' } },
        { id: '6', name: 'Winf Security® Nível 3', price: 240, cost_architect: 200, tech_specs: { tser: '0' } },
        { id: '7', name: 'Winf Security® Nível 4', price: 300, cost_architect: 260, tech_specs: { tser: '0' } }
     ];
  }, [products]);

  const [selectedFilmId, setSelectedFilmId] = useState<string>(archProducts[0]?.id || '1');
  const selectedProduct = archProducts.find(p => p.id === selectedFilmId) || archProducts[0];
  const selectedFilmName = selectedProduct?.name || 'Winf Select';
  const clientPrice = selectedProduct?.price || 450;
  // Assumes architect cost is around 40% of client price if not explicitly defined
  const architectCost = (selectedProduct as any)?.cost_architect || Math.floor(clientPrice * 0.4);
  const filmEfficiency = parseFloat(selectedProduct?.tech_specs?.tser || '15');
  const [acBTUs, setAcBTUs] = useState('12000');
  const [acUsageHours, setAcUsageHours] = useState('8');
  const [kwhCost, setKwhCost] = useState('0.92');
  const [projectCost, setProjectCost] = useState('4500');
  const [showDossier, setShowDossier] = useState(false);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vetor B: Os Gatilhos de Automação IA (O Portal do Especificador IA)
  const [calculatorView, setCalculatorView] = useState('simulate'); // 'simulate' | 'ledger'
  const [showTechnicalDossierSheet, setShowTechnicalDossierSheet] = useState(false);
  const [notification, setNotification] = useState('');

  const [specGlassArea, setSpecGlassArea] = useState(120);
  const [specOrientation, setSpecOrientation] = useState('Oeste');
  const [specOriginalGlass, setSpecOriginalGlass] = useState('Comum Recozido Incolor');
  const [specSelectedFilm, setSpecSelectedFilm] = useState('Select™ Invisible (PPF)');
  const [specProjectName, setSpecProjectName] = useState('Residência G3 - Alto da Boa Vista');
  const [specTotalCost, setSpecTotalCost] = useState(24800);
  const [specDossierOutput, setSpecDossierOutput] = useState('');
  const [specIntentFilter, setSpecIntentFilter] = useState<'thermal' | 'privacy' | 'glare'>('thermal');
  const [specBimFile, setSpecBimFile] = useState<string | null>(null);
  const [specUploadProgress, setSpecUploadProgress] = useState(0);
  const [specIsUploading, setSpecIsUploading] = useState(false);
  const [specCnpj, setSpecCnpj] = useState('12.345.678/0001-99');
  const [specAddress, setSpecAddress] = useState('Rua Bento Gonçalves, 1420 - Santos, SP');
  const [specLatitude, setSpecLatitude] = useState('-23.9618');
  const [specLongitude, setSpecLongitude] = useState('-46.3322');
  const [specActiveRTs, setSpecActiveRTs] = useState([
    { id: 'RT-1092', project: 'Edifício Wave Corporate - Santos', area: 380, value: 85200, rtValue: 8520, status: 'Homologado', localPartner: 'HUB L1 Santos Master', date: '11/05/2026' },
    { id: 'RT-1088', project: 'Residência Alphaville III - Sorocaba', area: 150, value: 34500, rtValue: 3450, status: 'Aprovado / Pago', localPartner: 'HUB L1 Sorocaba Operador', date: '04/05/2026' },
    { id: 'RT-1081', project: 'Sede BTG Pactual - SP Metro', area: 890, value: 184000, rtValue: 18400, status: 'Em Análise', localPartner: 'Núcleo Central SP Metro', date: '21/05/2026' }
  ]);

  const [bimLogs, setBimLogs] = useState<string[]>([]);
  const [bimScanning, setBimScanning] = useState(false);
  const [architectOfficeName, setArchitectOfficeName] = useState('Studio G3 Arquitetura de Alto Padrão');

  const suggestedPricePerM2 = useMemo(() => {
    if (specSelectedFilm.includes('Invisible')) return 450;
    if (specSelectedFilm.includes('Silver')) return 200;
    if (specSelectedFilm.includes('AeroCore')) return 550;
    if (specSelectedFilm.includes('Dual')) return 250;
    if (specSelectedFilm.includes('Security')) return 350;
    return 250; // BlackPro and default
  }, [specSelectedFilm]);

  const calculatedTotalCost = specGlassArea * suggestedPricePerM2;

  // Use calculated cost by default unless user overrides it, but the instruction is to use standard table
  // Overwrite specTotalCost with calculated value whenever area or film changes
  React.useEffect(() => {
    setSpecTotalCost(calculatedTotalCost);
  }, [calculatedTotalCost]);

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

    if (specSelectedFilm.includes('Invisible')) {
      U_winf = 3.9;
      SHGC_winf = 0.15;
      tir = 0.98;
      uvr = 0.999;
      tempReduction = -6.8;
    } else if (specSelectedFilm.includes('BlackPro')) {
      U_winf = 4.1;
      SHGC_winf = 0.17;
      tir = 0.95;
      uvr = 0.990;
      tempReduction = -5.8;
    } else if (specSelectedFilm.includes('Dual')) {
      U_winf = 4.3;
      SHGC_winf = 0.19;
      tir = 0.92;
      uvr = 0.995;
      tempReduction = -4.8;
    } else {
      // Ceramic Elite
      U_winf = 3.8;
      SHGC_winf = 0.12;
      tir = 0.99;
      uvr = 0.999;
      tempReduction = -7.4;
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
DOSSIÊ TÉCNICO, TERMODINÂMICO E ECONÔMICO GERADOR DE PROPOSTAS
PROJETO: ${specProjectName.toUpperCase()}
ESPECIFICADOR CERTIFICADO W12 / WINF OS™
---

PARÂMETROS DA EDIFICAÇÃO:
- Área Total Envidraçada (A): ${specGlassArea} m²
- Orientação Solar Crítica (It): ${specOrientation} (${results.radIncident} W/m² radiação incident)
- Composição dos Vidros Originais (U_base / SHGC_base): ${results.uBase} W/m²K / ${results.shgcBase}
- Solução WINF Prescrita (U_winf / SHGC_winf): ${specSelectedFilm} (${results.uWinf} W/m²K / ${results.shgcWinf})

MODELAGEM MOLECULAR W-NO™ AI (Equação de Fluxo de Calor):
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

  const startBimIngestion = () => {
    setBimScanning(true);
    setBimLogs([]);
    setSpecIsUploading(true);
    setSpecUploadProgress(10);

    const logMessages = [
      '⚡ INICIALIZANDO NÚCLEO DE INGESTÃO BIM / GERADOR DE PROPOSTAS...',
      '📂 DESCOMPACTANDO CAMADAS DO VETOR DE ARQUITETURA (.RVT EXTRUDED)...',
      '🔮 ANALISANDO VOLUMETRIA E NÚCLEO DE ABSORÇÃO MOLECULAR...',
      '📍 VALIDANDO COORDENADAS SATELITAIS: Latitude -23.96 e Longitude -46.33...',
      '☀️ DETECTADO 14 VÃOS ENVIDRAÇADOS EXPOSTOS À ORIENTAÇÃO SOL CRÍTICO (OESTE)...',
      '📏 GEOPROCESSAMENTO COMPACTADO: ÁREA DE FACHADA ENCONTRADA = 380m²',
      '🔬 CALIBRANDO MOTOR TÉRMICO SOBRE BASELINE DE VIDRO TEMPERADO COMUM...',
      '✅ DOSSIÊ W-NO™ PRONTO PARA CÁLCULO ESPECTRAL.'
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
        <div className="bg-[#08080A] border border-[#444746] p-6 lg:p-8 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0284C7]"></div>
          
          {/* HEADER SECTOR WITH 3 SUB-TABS */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6 border-b border-[#444746] pb-5">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider italic flex items-center gap-2">
                <FileSignature className="text-[#0284C7]" /> PORTAL DO ESPECIFICADOR IA // GERADOR DE PROPOSTAS
              </h3>
              <p className="text-xs text-[#71717A] max-w-2xl mt-1">
                A ferramenta secreta dos maiores escritórios de arquitetura corporativa do país. Desenvolva laudos de eficiência termodinâmica certificados pelo W-NO™ e fature 10% de Reserva Técnica (RT) sob contratos protegidos por blockchain.
              </p>
            </div>
            
            <div className="flex overflow-x-auto whitespace-nowrap bg-[#131314] p-1 border border-zinc-805 rounded-none select-none w-full xl:w-auto scrollbar-hide gap-1">
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
                  className={`flex-1 xl:flex-none shrink-0 text-[10px] uppercase font-mono tracking-widest font-bold px-4 py-3 md:py-2.5 rounded-none transition-all text-center leading-none cursor-pointer min-h-[40px] md:min-h-[34px] ${
                    calculatorView === tab.id 
                      ? 'bg-[#0284C7] text-white shadow-lg' 
                      : 'text-[#71717A] hover:text-white hover:bg-[#151518]'
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
                <div className="bg-gradient-to-br from-[#121214] to-[#18181b] border border-[#444746] p-6 rounded-none relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <span className="w-2 h-2 rounded-none bg-blue-500 animate-pulse"></span>
                    <span className="text-[8px] font-mono text-blue-400 font-bold uppercase">BIM PARSER CENTRAL</span>
                  </div>

                  <p className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-zinc-400 mb-3 block">
                    🚀 Ingestão de Fachadas de Alta Tecnologia
                  </p>
                  <p className="text-[11px] text-[#71717A] leading-relaxed mb-6">
                    Insira arquivos estruturais de seu projeto para que nossa inteligência de mapeamento varra as coordenadas espaciais, identifique os vãos de vidro vulneráveis e calcule a orientação solar instantaneamente.
                  </p>

                  {/* Drag and drop Simulated Box */}
                  <div 
                    onClick={startBimIngestion}
                    className={`border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-all ${
                      specBimFile 
                        ? 'border-emerald-500/40 bg-emerald-500/5' 
                        : 'border-[#444746] hover:border-[#0284C7]/50 hover:bg-[#131314]/20'
                    }`}
                  >
                    <div className="w-12 h-12 bg-[#0284C7]/10 text-[#0284C7] rounded-none flex items-center justify-center mx-auto mb-4 border border-[#0284C7]/20">
                      {bimScanning ? (
                        <Terminal className="animate-spin text-[#0284C7]" size={20} />
                      ) : specBimFile ? (
                        <CheckCircle2 className="text-emerald-400" size={20} />
                      ) : (
                        <Download className="text-zinc-400" size={20} />
                      )}
                    </div>
                    {specBimFile ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold font-mono text-emerald-400 block">{specBimFile}</span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Arquivo processado com sucesso • 14 superfícies ativas</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-zinc-300 block">Arraste seu arquivo BIM (.rvt), DWG ou PDF da fachada aqui</span>
                        <span className="text-[9px] text-zinc-500 font-mono tracking-widest block uppercase">Ou clique para simular upload com inteligência W-NO™</span>
                      </div>
                    )}
                  </div>

                  {/* Upload logs live output */}
                  {bimLogs.length > 0 && (
                    <div className="mt-5 bg-[#131314] border border-[#27272A] p-4 font-mono text-[9px] leading-relaxed rounded-none h-40 overflow-y-auto space-y-1 scrollbar-thin">
                      {bimLogs.map((log, i) => (
                        <div key={i} className={log.startsWith('✅') ? 'text-emerald-400' : log.startsWith('⚡') ? 'text-[#0284C7]' : 'text-zinc-500'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#111113]/40 border border-[#444746] p-5 rounded-none space-y-3">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">🔍 Geolocalização Satelital e Cores Coordenadas</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase text-zinc-500">Coordenadas de Obra:</label>
                      <div className="bg-[#131314]/60 p-2.5 border border-[#444746] rounded-none font-mono text-[10px] text-zinc-400">
                        LAT: <span className="text-emerald-400">{specLatitude}</span> <br/>
                        LON: <span className="text-emerald-400">{specLongitude}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase text-zinc-500">Endereço Postal Auditado:</label>
                      <input 
                        type="text" 
                        value={specAddress} 
                        onChange={(e) => setSpecAddress(e.target.value)}
                        className="w-full bg-[#131314] border border-[#444746] text-white px-2.5 py-2 text-[10px] font-mono focus:border-[#0284C7] focus:outline-none min-h-[34px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtering Parameters and Solar Orientation Config */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#131314]/40 border border-[#444746] p-5 rounded-none space-y-4">
                  <span className="text-[10px] font-mono text-[#0284C7] uppercase font-bold tracking-wider block">⚡ CONFIGURAÇÃO DE PARAMETRIZAÇÃO</span>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider font-bold block">Nome do Empreendimento / Cliente:</label>
                    <input 
                      type="text" 
                      value={specProjectName} 
                      onChange={(e) => setSpecProjectName(e.target.value)}
                      className="w-full bg-[#151518] border border-[#444746] text-white px-3 py-2 text-xs font-mono focus:border-[#0284C7] focus:outline-none min-h-[38px]"
                    />
                  </div>

                  {/* Intent filter options */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider font-bold block">Filtro de Desafio & Intenção Primária:</label>
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
                              ? 'bg-[#0284C7]/10 border-[#0284C7] text-white' 
                              : 'bg-[#131314]/30 border-[#444746] text-zinc-400 hover:border-[#444746]'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider">{item.label}</div>
                          <p className="text-[8px] text-zinc-500 mt-0.5">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setCalculatorView('simulate')}
                      className="w-full bg-[#0284C7] hover:bg-[#0284C7]/80 text-white text-xs font-bold uppercase tracking-widest py-3 font-mono leading-none transition-all flex items-center justify-center gap-1.5"
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
                <div className="bg-[#131314]/40 border border-[#27272A] p-5 rounded-none space-y-4">
                  <div className="flex justify-between items-center border-b border-[#444746] pb-1.5 mb-2">
                    <p className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-none bg-blue-500"></span> Ajuste Dinâmico da Equação
                    </p>
                    <span className="text-[8.5px] font-mono text-blue-400 font-bold bg-blue-950/40 border border-blue-900/40 px-1 rounded-none">Q = U·A·ΔT + SHGC·It·A</span>
                  </div>

                  {/* Sliders Area & Orientation */}
                  <div className="space-y-4 font-sans">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="uppercase font-mono text-zinc-400 tracking-wider font-bold">Área Envidraçada Total (A):</span>
                        <span className="text-white font-mono font-bold">{specGlassArea} m²</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10" 
                        value={specGlassArea} 
                        onChange={(e) => setSpecGlassArea(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#0284C7]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider font-bold block">Orientação Solar (It):</label>
                        <select 
                          value={specOrientation} 
                          onChange={(e) => setSpecOrientation(e.target.value)}
                          className="w-full bg-[#151518] border border-[#444746] text-white px-3 py-2 text-xs font-bold font-mono focus:border-[#0284C7] focus:outline-none min-h-[38px] cursor-pointer"
                        >
                          <option value="Oeste">Oeste (Sol de Tarde: 850 W/m²)</option>
                          <option value="Norte">Norte (Exposição Crítica: 750 W/m²)</option>
                          <option value="Leste">Leste (Sol de Manhã: 550 W/m²)</option>
                          <option value="Sul">Sul (Diffuse Sol: 300 W/m²)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider font-bold block">Vidro Estrutural Inicial:</label>
                        <select 
                          value={specOriginalGlass} 
                          onChange={(e) => setSpecOriginalGlass(e.target.value)}
                          className="w-full bg-[#151518] border border-[#444746] text-white px-3 py-2 text-xs font-bold font-mono focus:border-[#0284C7] focus:outline-none min-h-[38px] cursor-pointer"
                        >
                          <option value="Comum Recozido Incolor">Comum Incolor (U: 5.8 / SHGC: 0.82)</option>
                          <option value="Temperado Incolor">Temperado Incolor (U: 5.7 / SHGC: 0.78)</option>
                          <option value="Laminado Fumê">Laminado Fumê (U: 4.9 / SHGC: 0.62)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#27272A]">
                      <label className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider font-bold block">Solução WINF Aplicada (Através de Plasma Descarga):</label>
                      <select 
                        value={specSelectedFilm} 
                        onChange={(e) => setSpecSelectedFilm(e.target.value)}
                        className="w-full bg-[#151518] border border-[#27272A] text-[#0284C7] px-3 py-2.5 text-xs font-bold font-mono focus:border-[#0284C7] focus:outline-none min-h-[40px] cursor-pointer bg-[#131314]"
                      >
                        <option value="Select™ Invisible (PPF)">Select™ Invisible (PPF) - U: 3.9 / SHGC: 0.15 (98% TIR, 99.9% UVR)</option>
                        <option value="Select™ BlackPro (Film Premium)">Select™ BlackPro (Premium) - U: 4.1 / SHGC: 0.17 (95% TIR, 99.0% UVR)</option>
                        <option value="Select™ Dual Reflect (Térmica)">Select™ Dual Reflect - U: 4.3 / SHGC: 0.19 (92% TIR, 99.5% UVR)</option>
                        <option value="WINF Nano-Ceramic Elite">WINF Nano-Ceramic Elite - U: 3.8 / SHGC: 0.12 (99% TIR, 99.9% UVR)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mathematical Equation output visual block */}
                <div className="bg-zinc-950 border border-[#444746] p-5 rounded-none font-mono text-left space-y-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">📐 RESOLUÇÃO TERMODINÂMICA DA EQUAÇÃO:</span>
                  <div className="bg-[#131314]/60 p-4 border border-zinc-900 rounded-none space-y-2 text-[10.5px] leading-relaxed select-text">
                    <p className="text-zinc-400">
                      Cálculo de Transferência Térmica Total para o Vão: <br/>
                      <strong className="text-white">Q = (U · A · ΔT) + (SHGC · It · A)</strong>
                    </p>
                    <div className="h-px bg-zinc-800 my-2"></div>
                    <p className="text-zinc-500">
                      <span className="text-[#0284C7] font-bold">● Cenário Baseline:</span> <br/>
                      Q = ({results.uBase} · {specGlassArea} · 15) + ({results.shgcBase} · {results.radIncident} · {specGlassArea}) = <span className="text-rose-400 font-bold">{results.qBase} de Fluxo Térmico Incidente</span>
                    </p>
                    <p className="text-zinc-500">
                      <span className="text-emerald-400 font-bold">● Cenário WINF Shield:</span> <br/>
                      Q = ({results.uWinf} · {specGlassArea} · 15) + ({results.shgcWinf} · {results.radIncident} · {specGlassArea}) = <span className="text-emerald-400 font-bold">{results.qWinf} de Fluxo Térmico Residual</span>
                    </p>
                    <div className="h-px bg-zinc-800 my-2"></div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[#0284C7]">EFICIÊNCIA MOLECULAR DO FILTRO:</span>
                      <span className="text-emerald-400">{results.efficiencyFactor} DE BLOQUEIO ATIVO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spectral engine live calculations */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-[#131314] border border-[#444746] p-6 rounded-none relative overflow-hidden space-y-5">
                  <div className="flex justify-between items-center border-b border-[#27272A] pb-2.5">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">📈 MÉTRICAS ESPECTRAIS / EFICIÊNCIA ENERGÉTICA</span>
                    <span className="text-[8px] font-mono text-zinc-500 bg-neutral-900 border border-zinc-800 px-1.5 py-0.5 rounded-none">W-NO v4 System</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111113] p-4 border border-[#27272A]">
                      <span className="text-[9.5px] font-mono text-zinc-500 block uppercase mb-1">Corte Térmico Conquistado</span>
                      <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">{results.tempReduction}</span>
                      <span className="text-[8px] font-sans text-zinc-600 block uppercase mt-0.5 leading-tight">Estabilidade física de lajes e forros</span>
                    </div>

                    <div className="bg-[#111113] p-4 border border-[#27272A]">
                      <span className="text-[9.5px] font-mono text-zinc-500 block uppercase mb-1">Economia HVAC Estimada</span>
                      <span className="text-2xl font-black font-mono text-[#0284C7] tracking-tight">{results.savings}</span>
                      <span className="text-[8px] font-sans text-zinc-600 block uppercase mt-0.5 leading-tight">Redução direta de energia do compressor</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <div className="bg-[#111113] p-4 border border-[#27272A]">
                      <span className="text-[9.5px] font-mono text-zinc-500 block uppercase mb-1">Capacidade de Climatização Salva</span>
                      <span className="text-xl font-bold font-mono text-white tracking-tight">{results.qBlockedTR}</span>
                      <span className="text-[8px] font-sans text-zinc-600 block uppercase mt-0.5">Demanda de compressor descartada</span>
                    </div>

                    <div className="bg-[#111113] p-4 border border-[#27272A]">
                      <span className="text-[9.5px] font-mono text-zinc-500 block uppercase mb-1">Carbono Atmosférico Mitigado</span>
                      <span className="text-xl font-bold font-mono text-white tracking-tight">~{results.totalCo2Mitigated} <span className="text-xs text-zinc-500">t/ano</span></span>
                      <span className="text-[8px] font-sans text-zinc-600 block uppercase mt-0.5">Disparador automático no inventário ESG</span>
                    </div>
                  </div>

                  {/* Copy & View Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={copySpecDossierToClipboard}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold font-mono uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5"
                    >
                      Copiar Dossiê ROI Markdown
                    </button>
                    <button 
                      onClick={() => {
                        setCalculatorView('ledger');
                        setNotification('Avançando para ativação de dotação de RT');
                      }}
                      className="flex-1 bg-[#0284C7] hover:bg-[#0284C7]/80 text-white text-xs font-bold font-mono uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5"
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
              <div className="bg-[#131314]/40 border border-[#444746] p-6 rounded-none relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-none font-bold uppercase block">CONTRATO DE RESGUARDO DIGITAL</span>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Passo 03: Homologação de Dossiê de ROI & Travamento de Protetor Regional</h4>
                  <p className="text-[11px] text-[#71717A]">Aqui você amarra a dotação de 10% de Reserva Técnica (RT) ao seu registro profissional (CPF/CNPJ). Seu escoamento é travado em block na localidade selecionada.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                  <div className="xl:col-span-4 bg-[#111113] border border-[#27272A] p-5 flex flex-col justify-between rounded-none">
                    <div className="space-y-3.5">
                      <span className="text-[10px] uppercase font-mono text-[#0284C7] tracking-wider font-bold block">1. Assinatura da Especificadora</span>
                      
                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-mono text-zinc-500 font-bold block">Nome do Escritor / Arquiteto:</label>
                        <input 
                          type="text" 
                          value={architectOfficeName} 
                          onChange={(e) => setArchitectOfficeName(e.target.value)}
                          className="w-full bg-[#131314] border border-[#27272A] text-white px-2.5 py-1.5 text-xs font-bold focus:border-[#0284C7] focus:outline-none min-h-[34px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-mono text-zinc-500 font-bold block">CNPJ / CPF de Repasse de Honorários:</label>
                        <input 
                          type="text" 
                          value={specCnpj} 
                          onChange={(e) => setSpecCnpj(e.target.value)}
                          placeholder="EX: 00.000.000/0001-00"
                          className="w-full bg-[#131314] border border-[#27272A] text-white px-2.5 py-1.5 text-xs font-mono focus:border-[#0284C7] focus:outline-none min-h-[34px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8.5px] uppercase font-mono text-zinc-500 font-bold block">
                          Valor Total do Projeto Sugerido (R$ {suggestedPricePerM2}/m²):
                        </label>
                        <div className="flex gap-2 items-center">
                          <span className="text-zinc-500 text-xs font-mono">R$</span>
                          <input 
                            type="number" 
                            value={specTotalCost} 
                            onChange={(e) => setSpecTotalCost(Number(e.target.value))}
                            className="w-full bg-[#131314] border border-[#27272A] text-white px-2.5 py-1.5 text-xs font-mono font-bold focus:border-[#0284C7] focus:outline-none min-h-[34px]"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={async () => {
                        const rtValue = specTotalCost * 0.10;
                        const newCase = {
                          id: 'RT-' + Math.floor(Math.random() * 900 + 1000),
                          project: specProjectName,
                          area: specGlassArea,
                          value: specTotalCost,
                          rtValue: rtValue,
                          status: 'Homologado',
                          localPartner: 'HUB L1 Master',
                          date: new Date().toLocaleDateString('pt-BR')
                        };
                        setSpecActiveRTs(prev => [newCase, ...prev]);

                        // Add to installation jobs to route to installers
                        const jobData = {
                          service_order_id: `OS-ARQ-${Math.floor(1000 + Math.random() * 9000)}`,
                          customer_name: specProjectName, // Or client name if available
                          customer_city: specAddress,
                          chosen_film: specSelectedFilm,
                          vehicle_model: 'Arquitetura (Métrica: ' + specGlassArea + 'm²)',
                          total_amount: specTotalCost,
                          collaborator_id: 'pending', // No installer yet
                          status: 'network_routing' as const,
                          is_network_demand: true,
                          architect_id: user?.id || 'arq_1',
                          architect_rt: rtValue,
                        };
                        
                        if (addInstallationJob) {
                          await addInstallationJob(jobData);
                        }

                        setNotification('Novo Projeto Homologado e RT Trancada com Sucesso em Blockchain!');
                      }}
                      className="mt-6 w-full bg-[#0284C7] hover:bg-[#0284C7]/80 text-white text-[10px] font-black uppercase tracking-widest py-3 leading-none transition-all flex items-center justify-center gap-1.5 font-mono"
                    >
                      🛡️ REGISTRAR ESPECIFICAÇÃO & TRAVAR TERRITÓRIO
                    </button>
                  </div>

                  {/* ROI Whitepaper Live Preview Sheet */}
                  <div className="xl:col-span-8 bg-[#111113]/70 border border-[#27272A] p-5 space-y-4 rounded-none text-xs select-text">
                    <div className="flex justify-between items-center border-b border-[#27272A] pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">📋 PRÉ-VIALIZAÇÃO DO RELATÓRIO DE ENGENHARIA ROI</span>
                      <span className="text-[8.5px] tracking-widest font-mono text-zinc-500">FORMATO EXPORTÁVEL PDF</span>
                    </div>

                    <div className="bg-[#131314]/60 p-5 rounded-none border border-[#27272A] leading-relaxed space-y-4 font-mono text-[10.5px]">
                      {/* Document header representation */}
                      <div className="flex justify-between border-b border-dashed border-[#27272A] pb-3">
                        <div>
                          <p className="text-white font-bold uppercase text-[11px]">{architectOfficeName}</p>
                          <p className="text-[#71717A] text-[8px] uppercase mt-0.5">CNPJ: {specCnpj} • CPF/CNPJ Cadastrado</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-[11px]">GERADOR DE PROPOSTAS</p>
                          <p className="text-emerald-400 text-[8.5px] uppercase font-bold mt-0.5">ESTADO: TERRITÓRIO LOCK ATIVO</p>
                        </div>
                      </div>

                      {/* Brief text for client */}
                      <div className="space-y-1.5">
                        <p className="text-zinc-500 text-[8px] uppercase font-bold mb-1.5">LAUDO DE RETORNO DO INVESTIMENTO ENERGÉTICO & ENGENHARIA TERMOCLÍNICA:</p>
                        <p className="text-zinc-300">
                          Laudo de Eficiência elaborado em conformidade com as diretivas de proteção molecular WINF v4.2. O tratamento prescrito **{specSelectedFilm}** promove o isolamento termodinâmico contínuo na fachada com rejeição de calor de **{results.tir}** do espectro infravermelho.
                        </p>
                      </div>

                      {/* Financial Payback Columns */}
                      <div className="bg-[#111113] p-3.5 border border-[#27272A] grid grid-cols-3 gap-2.5 rounded-none text-center">
                        <div>
                          <span className="text-[8.5px] text-zinc-500 block uppercase mb-1">Acúmulo Est. em 5 Anos:</span>
                          <span className="text-white font-black text-sm block">{savings5Years}</span>
                          <span className="text-[8px] text-emerald-500/60 block uppercase mt-0.5">Ativo Climatização</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-[#0284C7] block uppercase mb-1 font-bold">Acúmulo Est. em 10 Anos:</span>
                          <span className="text-emerald-400 font-black text-sm block">{savings10Years}</span>
                          <span className="text-[8px] text-emerald-500/60 block uppercase mt-0.5">HVAC Recarga Reduzida</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-zinc-500 block uppercase mb-1">Acúmulo Est. em 20 Anos:</span>
                          <span className="text-[#0284C7] font-black text-sm block">{savings20Years}</span>
                          <span className="text-[8px] text-[#0284C7]/60 block uppercase mt-0.5">Retorno x3 Solução</span>
                        </div>
                      </div>

                      {/* Locked alert notice */}
                      <div className="bg-rose-500/5 p-3.5 border border-rose-500/10 border-l-2 border-l-rose-500 text-[9px] text-[#E4E4E7] space-y-1">
                        <div className="flex gap-2 items-center text-rose-400 font-bold uppercase tracking-wider">
                          <Lock size={12} /> BLOQUEIO DE CADEIA ANTICOMPETITIVA ATIVADO:
                        </div>
                        <p className="leading-normal font-sans text-zinc-400 text-[9.5px]">
                          Para preservar a Reserva Técnica de <strong className="text-white font-mono">{results.rtEarned}</strong> vinculada ao seu escritório de arquitetura, as bobinas ativas do tratamento de plasma prescrito para a obra <strong>{specProjectName}</strong> estão trancadas na blockchain de escoamento. Nenhuma construtora ou gestor consegue fechar esta compra faturando por outro canal sem acionar o sistema regional L1 de conformidade.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE RT REGISTER LEDGER */}
              <div className="bg-[#131314]/40 border border-[#444746] p-6 rounded-none relative overflow-hidden space-y-4">
                <span className="text-[10px] font-mono text-[#0284C7] uppercase font-bold tracking-wider block">📊 DIÁRIO DE HONORÁRIOS & CHAVES DE PROSPECÇÃO DE RT:</span>
                
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left font-mono text-[10.5px]">
                    <thead>
                      <tr className="border-b border-[#27272A] text-zinc-500">
                        <th className="pb-3 uppercase tracking-wider font-bold">Ref No.</th>
                        <th className="pb-3 uppercase tracking-wider font-bold">Obra Especificada</th>
                        <th className="pb-3 uppercase tracking-wider font-bold text-center border-none">Área (A)</th>
                        <th className="pb-3 uppercase tracking-wider font-bold text-right border-none">Faturamento Obra</th>
                        <th className="pb-3 uppercase tracking-wider font-bold text-right border-none text-emerald-400">Hon. RT (10%)</th>
                        <th className="pb-3 uppercase tracking-wider font-bold text-center border-none">Status Lock</th>
                        <th className="pb-3 uppercase tracking-wider font-bold text-right border-none">Data Hub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#151518]">
                      {specActiveRTs.map((rtCase) => (
                        <tr key={rtCase.id} className="hover:bg-zinc-950/40 transition-colors">
                          <td className="py-3 text-zinc-400 font-bold">{rtCase.id}</td>
                          <td className="py-3 font-sans text-white font-bold">
                            {rtCase.project} <br/>
                            <span className="text-[8.5px] font-mono text-zinc-500 block uppercase font-light mt-0.5">Parceiro Fiscal: {rtCase.localPartner}</span>
                          </td>
                          <td className="py-3 text-center border-none text-zinc-300">{rtCase.area} m²</td>
                          <td className="py-3 text-right border-none text-zinc-300">R$ {rtCase.value.toLocaleString('pt', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 text-right border-none font-black text-emerald-400">R$ {rtCase.rtValue.toLocaleString('pt', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 text-center border-none">
                            <span className={`px-2 py-0.5 text-[8.5px] rounded-none font-bold uppercase ${
                              rtCase.status === 'Aprovado / Pago' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : rtCase.status === 'Homologado'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {rtCase.status}
                            </span>
                          </td>
                          <td className="py-3 text-right border-none text-zinc-500">{rtCase.date}</td>
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

  const addPane = () => {
    if (!newPane.width || !newPane.height) return;
    const pane: WindowPane = {
      id: Date.now().toString(),
      width: parseFloat(newPane.width),
      height: parseFloat(newPane.height),
      qty: parseInt(newPane.qty),
      type: newPane.type
    };
    setPanes([...panes, pane]);
    setNewPane({ width: '', height: '', qty: '1', type: 'Vidro Simples' });
  };

  const removePane = (id: string) => setPanes(panes.filter(p => p.id !== id));

  const totalM2 = useMemo(() => panes.reduce((acc, p) => acc + (p.width * p.height * p.qty), 0), [panes]);
  const totalWithWaste = totalM2 * 1.15; 

  // ROI LOGIC
  const roiData = useMemo(() => {
    const efficiencyFactor = filmEfficiency;
    const btuFactor = parseInt(acBTUs) / 12000;
    const monthlySavings = (totalM2 * efficiencyFactor) * (parseInt(acUsageHours) / 8) * btuFactor * parseFloat(kwhCost); 
    const monthsToPay = parseFloat(projectCost) / (monthlySavings || 1);
    
    const chartData = Array.from({ length: 24 }, (_, i) => {
        const month = i + 1;
        const accumulatedSaving = monthlySavings * month;
        return {
            name: month === 1 ? '1m' : month % 6 === 0 ? `${month}m` : '',
            saving: Math.round(accumulatedSaving),
            cost: parseFloat(projectCost)
        };
    });

    return { monthlySavings, monthsToPay, chartData };
  }, [totalM2, acUsageHours, kwhCost, projectCost, filmEfficiency, acBTUs]);

  const handleSimulateSelect = async () => {
    if (!facadeImg) return;
    setIsSimulating(true);
    try {
        const base64Data = facadeImg.split(',')[1];
        const mimeType = facadeImg.split(';')[0].split(':')[1];

        const prompt = `
            Simule a aplicação da película arquitetônica Winf Select™ Platinum na fachada desta imagem.
            O vidro deve ficar com um tom sutilmente escurecido/espelhado de luxo.
            Destaque a redução de reflexo e o conforto visual.
        `;

        const response = await generateGeminiResponse(
            [{
                role: 'user',
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: prompt }
                ]
            }],
            "Você é um especialista em arquitetura e simulação visual de películas Winf."
        );

        if (response.inlineData) {
            setGeneratedImg(`data:${response.inlineData.mimeType};base64,${response.inlineData.data}`);
        } else {
            console.warn("IA não retornou imagem simulada.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20 font-sans">
      {/* Header Tático - Universo Dark Theme */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.05] pb-8">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors mb-4 group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Mission Control
          </button>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#131314] border border-zinc-700/50 rounded-none flex items-center justify-center shadow-[0_0_20px_rgba(113,113,122,0.2)]">
                <Building2 size={24} className="text-white/40" />
             </div>
             <div>
                <h1 className="text-4xl md:text-5xl font-heading font-light text-white tracking-tighter uppercase">
                    WINF <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-950">SELECT™ PRO</span>
                </h1>
                <p className="text-white/40 text-xs mt-1 font-mono uppercase tracking-[0.2em]">Architectural Intelligence Unit // Level 4 Access</p>
             </div>
          </div>
        </div>
        
        {/* Navigation Pod */}
        <div className="flex bg-[#131314] border border-[#444746] p-1.5 rounded-none shadow-2xl backdrop-blur-md">
           {[
               { id: 'survey', label: 'Medição', icon: Maximize2 },
               { id: 'roi', label: 'ROI Engine', icon: DollarSign },
               { id: 'proposal', label: 'Relatório', icon: FileSpreadsheet },
               { id: 'orders', label: 'Pedidos', icon: Share2 }
           ].map((tab) => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-6 py-3 text-xs md:text-[10px] font-bold uppercase tracking-widest rounded-none transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                    ? 'bg-zinc-800 text-white shadow-[0_0_20px_rgba(113,113,122,0.4)] border border-zinc-700/50' 
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }`}
               >
                   <tab.icon size={12} /> {tab.label}
               </button>
           ))}
        </div>
      </div>

        {/* Performance Mensal */}
        <div className="mb-10">
            <div className="p-6 bg-[#020202] border border-[#444746] space-y-2 max-w-sm">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Performance Mensal</h3>
                <p className="text-3xl text-white font-black tracking-tighter">{metrics.m2Sold} / {metrics.goal} m²</p>
                <div className="w-full h-1 bg-zinc-800">
                    <div className="h-full bg-white transition-all" style={{ width: `${Math.min((metrics.m2Sold / metrics.goal) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 font-italic mt-2">{getMotivation(metrics.m2Sold, metrics.goal)}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Ferramenta Ativa */}
        <div className="lg:col-span-8 space-y-6">
            
            {activeTab === 'orders' && (
                <div className="bg-[#080808] border border-[#444746] rounded-none p-5 md:p-8 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/5 rounded-none blur-[100px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-center border-b border-[#444746] pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-800/20 rounded-none flex items-center justify-center border border-zinc-700/30">
                                <Share2 size={20} className="text-white/40" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">CENTRAL DE PEDIDOS & GARANTIA</h3>
                                <p className="text-xs md:text-[10px] text-white/40 uppercase tracking-widest font-mono">Architect Exclusive Access</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-zinc-800/10 border border-zinc-700/30 rounded-none text-white/40 text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold uppercase tracking-widest">
                            Status: Autenticado
                        </div>
                    </div>

                    {/* Tabela de Preços Especiais */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                            <TrendingUp size={14} /> TABELA DE PREÇOS & LUCRATIVIDADE
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {archProducts.slice(0, 3).map((p) => {
                                    const pClientPrice = customPrices[p.id] || p.price || 450;
                                    const pArchitectCost = (p as any).cost_architect || Math.floor(pClientPrice * 0.4);
                                    return (
                                    <div key={p.id} className="p-6 bg-[#020202] border border-[#444746] rounded-none hover:border-zinc-700/30 transition-all group">
                                        <p className="text-xs md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 truncate" title={p.name}>{p.name}</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-gray-600 uppercase font-bold">Custo Arquiteto</span>
                                                <span className="text-sm font-mono text-white font-bold">R$ {pArchitectCost}/m²</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-gray-600 uppercase font-bold">Preço de Venda</span>
                                                <input 
                                                    type="number"
                                                    value={pClientPrice}
                                                    onChange={(e) => setCustomPrices({...customPrices, [p.id]: parseFloat(e.target.value)})}
                                                    className="w-20 bg-[#131314] border border-[#444746] p-1 text-right text-sm font-mono text-white focus:border-zinc-700 outline-none"
                                                />
                                            </div>
                                            <div className="pt-3 border-t border-[#444746] flex justify-between items-center">
                                                <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold">Sua Margem</span>
                                                <span className="text-lg font-mono text-white font-black">R$ {pClientPrice - pArchitectCost}/m²</span>
                                            </div>
                                        </div>
                                    </div>
                                )})}
                        </div>
                    </div>

                    {/* Resumo do Pedido Atual */}
                    <div className="bg-[#020202] border border-[#444746] rounded-none p-5 md:p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">RESUMO DO PROJETO</h4>
                            <span className="text-xs md:text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Área Total: {totalM2.toFixed(2)} m²</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="p-4 bg-zinc-800/10 rounded-none border border-zinc-700/20">
                                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-zinc-500 uppercase font-bold mb-1">Investimento Total (Cliente)</p>
                                    <p className="text-3xl font-mono text-white font-black">R$ {(totalM2 * clientPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-none border border-[#444746]">
                                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-1">Seu Retorno Estimado</p>
                                    <p className="text-3xl font-mono text-white/40 font-black">R$ {(totalM2 * (clientPrice - architectCost)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={async () => {
                                        if (!clientName) { alert('Nome do cliente é obrigatório.'); return; }
                                        const res = await addLead({
                                            name: clientName,
                                            source: 'Architect Portal',
                                            interest: `Especificação: ${selectedFilmName} - ${totalM2.toFixed(2)}m²`,
                                            status: 'Novo',
                                            ai_score: 95,
                                            dominance_score: 80,
                                            decay_level: 100,
                                            is_public: true
                                        });
                                        if (res.success) alert('Oportunidade enviada para a Sincronia Neural Winf™.');
                                    }}
                                    className="w-full py-5 bg-winf-primary text-black font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-white transition-all flex items-center justify-center gap-3"
                                >
                                    <Zap size={16} /> Enviar para Radar
                                </button>
                                <button 
                                    onClick={() => alert('Pedido enviado para a Central Winf™. Nossa IA está selecionando o instalador certificado mais próximo para o seu projeto.')}
                                    className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-3"
                                >
                                    <Share2 size={16} /> Enviar para Central Winf™
                                </button>
                                <button 
                                    onClick={() => alert('Certificado de Garantia Vitalícia Winf™ gerado e vinculado ao projeto.')}
                                    className="w-full py-5 border border-[#444746] text-white font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                                >
                                    <ShieldCheck size={16} /> Gerar Garantia Vitalícia
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-none flex items-start gap-4">
                            <Info size={18} className="text-zinc-500 shrink-0 mt-0.5" />
                            <p className="text-xs md:text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                                Ao enviar para a central, nosso sistema processa os dados técnicos e encaminha para o instalador Master mais apropriado para a sua região, garantindo a execução perfeita do projeto.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'survey' && (
                <ArchitectureCalculator />
            )}

            {activeTab === 'roi' && (
                <div className="bg-[#080808] border border-[#444746] rounded-none p-5 md:p-8 space-y-8 animate-fade-in shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950"></div>
                    <div className="absolute top-0 right-0 p-40 bg-zinc-800/5 rounded-none blur-[120px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <DollarSign size={20} className="text-white/40" /> SELECT™ ROI ENGINE
                        </h3>
                        <div className="px-4 py-1.5 bg-zinc-800/20 rounded-none text-white/40 text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold uppercase tracking-[0.2em] border border-zinc-700/30 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-none animate-pulse"></div> Live Calculation
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Inputs Técnicos */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="p-6 bg-[#020202] rounded-none border border-[#444746] space-y-5 shadow-inner">
                                <div>
                                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-2 block flex items-center gap-1">Película Selecionada <Info size={10}/></label>
                                    <select value={selectedFilmId} onChange={e => setSelectedFilmId(e.target.value)} className="w-full bg-[#131314] border border-[#444746] p-3 rounded-none text-white text-xs focus:border-zinc-700 outline-none appearance-none">
                                        {archProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-2 block">Capacidade Ar (BTUs)</label>
                                    <select value={acBTUs} onChange={e => setAcBTUs(e.target.value)} className="w-full bg-[#131314] border border-[#444746] p-3 rounded-none text-white text-xs focus:border-zinc-700 outline-none appearance-none">
                                        <option value="9000">9.000 BTUs</option>
                                        <option value="12000">12.000 BTUs</option>
                                        <option value="18000">18.000 BTUs</option>
                                        <option value="30000">30.000 BTUs+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-2 block">Uso Diário</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min="1" max="24" value={acUsageHours} onChange={e => setAcUsageHours(e.target.value)} className="w-full accent-zinc-400 h-1 bg-gray-800 rounded-none appearance-none cursor-pointer" />
                                        <span className="text-xs text-white/40 font-bold font-mono w-16 text-right">{acUsageHours}h</span>
                                    </div>
                                </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-2 block">kWh (R$)</label>
                                            <input type="number" step="0.01" value={kwhCost || ''} onChange={e => setKwhCost(e.target.value)} className="w-full bg-[#131314] border border-[#444746] p-3 rounded-none text-white text-xs focus:border-zinc-700 outline-none font-mono" />
                                        </div>
                                        <div>
                                            <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-2 block">Invest. (R$)</label>
                                            <input type="number" value={projectCost || ''} onChange={e => setProjectCost(e.target.value)} className="w-full bg-[#131314] border border-[#444746] p-3 rounded-none text-white text-xs focus:border-zinc-700 outline-none font-mono" />
                                        </div>
                                    </div>
                            </div>
                        </div>

                        {/* Gráfico e Resultados */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-[#020202] rounded-none border border-[#444746] p-6 min-h-[300px] flex flex-col relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Projeção Acumulada (24 Meses)</h4>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold"><div className="w-2 h-2 bg-zinc-800 rounded-none shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div> Savings</div>
                                        <div className="flex items-center gap-2 text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold"><div className="w-2 h-2 bg-gray-600 rounded-none"></div> Break-even</div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={roiData.chartData}>
                                            <defs>
                                                <linearGradient id="colorSaving" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                            <XAxis dataKey="name" stroke="#444" tick={{fontSize: 9, fill: '#666'}} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#444" tick={{fontSize: 9, fill: '#666'}} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#050505', border: '1px solid #333', fontSize: '10px', color: '#fff'}}
                                                itemStyle={{color: '#ffffff'}}
                                            />
                                            <Area type="monotone" dataKey="saving" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorSaving)" />
                                            <Area type="step" dataKey="cost" stroke="#4B5563" strokeWidth={1} fill="transparent" strokeDasharray="4 4" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                    <div className="p-4 bg-zinc-800/10 border border-zinc-700/20 rounded-none">
                                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-1 tracking-wider">Payback Estimado</p>
                                        <p className="text-2xl text-white font-bold font-mono">{roiData.monthsToPay.toFixed(1)} <span className="text-xs text-white/40 font-sans font-normal">meses</span></p>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-[#444746] rounded-none">
                                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-1 tracking-wider">Economia Mensal</p>
                                        <p className="text-2xl text-white/40 font-bold font-mono">R$ {roiData.monthlySavings.toFixed(2)}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-none col-span-2">
                                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-zinc-500 uppercase font-bold mb-1 tracking-wider">Lucratividade do Especificador (Estimada)</p>
                                        <p className="text-xl font-mono text-white font-black">R$ {(totalM2 * (clientPrice - architectCost)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-zinc-800/20 to-black p-5 rounded-none border-l-4 border-zinc-700 flex items-start gap-4">
                                <Lightbulb className="text-white/40 shrink-0" size={24} />
                                <div>
                                    <p className="text-white font-bold text-sm mb-1 uppercase tracking-wide">NeuroArgument™</p>
                                    <p className="text-xs text-white/40 leading-relaxed font-light">
                                        Ao investir na tecnologia <strong>{selectedFilmName}</strong>, o retorno total ocorre em apenas <strong>{roiData.monthsToPay.toFixed(0)} meses</strong>. Após esse período, o sistema gera lucro líquido mensal de <strong>R$ {roiData.monthlySavings.toFixed(2)}</strong> em eficiência energética pura.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'proposal' && (
                <div className="bg-[#080808] border border-[#444746] rounded-none p-6 md:p-10 animate-fade-in flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950"></div>
                    
                    <div className="w-24 h-24 bg-zinc-800/10 border border-zinc-700/30 rounded-none flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(113,113,122,0.15)]">
                        <CheckCircle size={48} className="text-white/40" />
                    </div>
                    <h2 className="text-4xl font-heading font-light text-white mb-2 tracking-tighter">RELATÓRIO <span className="font-bold text-white/40">CONFIDENCIAL</span></h2>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-10">
                        Protocolo de Proposta Gerado em {new Date().toLocaleDateString()}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
                        <div className="p-6 bg-[#020202] border border-[#444746] rounded-none text-center hover:border-zinc-700/30 transition-all group">
                            <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold tracking-wider mb-2 group-hover:text-white/40">Total Área</p>
                            <p className="text-2xl font-mono text-white font-bold">{totalM2.toFixed(2)}<span className="text-sm text-gray-600 ml-1">m²</span></p>
                        </div>
                        <div className="p-6 bg-[#020202] border border-[#444746] rounded-none text-center hover:border-zinc-700/30 transition-all group">
                            <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold tracking-wider mb-2 group-hover:text-white/40">Payback</p>
                            <p className="text-2xl font-mono text-white/40 font-bold">{roiData.monthsToPay.toFixed(1)}<span className="text-sm text-gray-600 ml-1">m</span></p>
                        </div>
                        <div className="p-6 bg-[#020202] border border-[#444746] rounded-none text-center hover:border-zinc-700/30 transition-all group">
                            <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold tracking-wider mb-2 group-hover:text-white/40">Economia/Ano</p>
                            <p className="text-2xl font-mono text-white font-bold">R$ {(roiData.monthlySavings * 12).toFixed(0)}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowDossier(true)}
                        className="bg-zinc-800 text-white px-12 py-4 rounded-none font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-zinc-700 transition-all shadow-lg shadow-zinc-800/30"
                    >
                        <FileSpreadsheet size={16} /> Gerar Dossiê Técnico
                    </button>
                </div>
            )}

        </div>

        {/* Dossier Modal */}
        <AnimatePresence>
            {showDossier && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDossier(false)}
                        className="absolute inset-0 bg-[#131314]/90 backdrop-blur-xl"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white text-black rounded-none overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Dossier Header */}
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#131314] text-white flex items-center justify-center font-black text-xl rounded-none">W</div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter">Dossiê de Performance Energética</h2>
                                    <p className="text-xs md:text-[10px] text-white/40 font-bold uppercase tracking-widest">Winf Select™ Architectural Intelligence</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 hover:bg-gray-200 rounded-none transition-colors text-white/40" title="Imprimir">
                                    <Printer size={20} />
                                </button>
                                <button className="p-3 hover:bg-gray-200 rounded-none transition-colors text-white/40" title="Compartilhar">
                                    <Share2 size={20} />
                                </button>
                                <button onClick={() => setShowDossier(false)} className="p-3 hover:bg-gray-200 rounded-none transition-colors text-white/40">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Dossier Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-16 custom-scrollbar-light">
                            {/* Cover Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-block px-3 py-1 bg-[#131314] text-white text-[10px] md:text-[8px] font-black uppercase tracking-[0.3em]">Relatório Técnico #8829-X</div>
                                        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                                            Eficiência <br /> <span className="text-white/60">Molecular.</span>
                                        </h1>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="border-l-4 border-black pl-6">
                                            <p className="text-xs md:text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Cliente / Projeto</p>
                                            <input 
                                                value={projectName} 
                                                onChange={e => setProjectName(e.target.value)}
                                                placeholder="NOME DO PROJETO"
                                                className="text-2xl font-black uppercase tracking-tighter w-full border-none focus:ring-0 p-0 placeholder:text-white/80"
                                            />
                                        </div>
                                        <div className="border-l-4 border-gray-200 pl-6">
                                            <p className="text-xs md:text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Responsável Técnico</p>
                                            <p className="text-xl font-bold uppercase tracking-tight">Winf Authorized Partner</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="aspect-square bg-gray-100 rounded-none overflow-hidden relative">
                                    {generatedImg ? (
                                        <img src={generatedImg} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                                            <Building2 size={64} />
                                            <p className="text-xs md:text-[10px] font-bold uppercase tracking-widest mt-4">Simulação Visual Indisponível</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-none border border-[#444746] shadow-xl">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] md:text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Tecnologia Aplicada</p>
                                                <p className="text-xs font-black uppercase tracking-tight">{selectedFilmName}</p>
                                            </div>
                                            <ShieldCheck className="text-black" size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { label: 'Área Total', value: `${totalM2.toFixed(2)}m²`, icon: Maximize2 },
                                    { label: 'Economia Mensal', value: `R$ ${roiData.monthlySavings.toFixed(2)}`, icon: DollarSign },
                                    { label: 'Payback', value: `${roiData.monthsToPay.toFixed(1)} Meses`, icon: Clock },
                                    { label: 'Redução Temp.', value: '-12°C', icon: Thermometer }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 bg-gray-50 rounded-none border border-gray-100">
                                        <stat.icon size={18} className="text-white/40 mb-4" />
                                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-xl font-black font-mono">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Technical Specs */}
                            <div className="space-y-8">
                                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <Layers size={24} /> Especificações de Performance
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Rejeição de Calor (IR)</span>
                                            <span className="text-lg font-black font-mono">99%</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Bloqueio UV</span>
                                            <span className="text-lg font-black font-mono">99.9%</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Redução de Brilho</span>
                                            <span className="text-lg font-black font-mono">65%</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#131314] p-5 md:p-8 rounded-none text-white space-y-4">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Certificação Winf™</h4>
                                        <p className="text-xs leading-relaxed font-light opacity-70">
                                            Este projeto utiliza a tecnologia Winf Select™, garantindo a máxima eficiência energética disponível no mercado global. O material possui garantia vitalícia contra desbotamento e descolamento, assegurada pelo Winf OS™ Blockchain.
                                        </p>
                                        <div className="pt-4 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center">
                                                <Hexagon size={20} className="text-white" />
                                            </div>
                                            <span className="text-xs md:text-[10px] font-bold uppercase tracking-widest">Selo de Autenticidade Digital</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dossier Footer */}
                        <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                            <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-[0.4em]">WINF ARCHITECTURAL INTELLIGENCE UNIT</p>
                            <button className="bg-[#131314] text-white px-8 py-3 rounded-none text-xs md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all">
                                <Download size={14} /> Baixar Versão Final
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Sidebar: Tactical Field Data */}
        <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#020202] border border-zinc-700/30 p-5 md:p-8 rounded-none relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-16 bg-zinc-800/10 rounded-none blur-[60px] group-hover:bg-zinc-800/20 transition-colors"></div>
                
                <div className="space-y-8 relative z-10">
                    <div>
                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase font-bold mb-3 tracking-widest">Performance Térmica Estimada</p>
                        <div className="flex items-center gap-3 text-white/40">
                            <Thermometer size={18} />
                            <span className="text-xl font-bold font-mono">-12°C</span>
                            <span className="text-xs text-white/40">redução interna</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#080808] border border-[#444746] p-5 md:p-8 rounded-none shadow-xl">
                <h4 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <CheckCircle size={16} className="text-gray-600" /> Field Checklist
                </h4>
                <ul className="space-y-4">
                    {['Aferição de Vidros', 'Mapeamento de Sombras', 'Verificação de AC (BTU)', 'Stress Térmico UV'].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-xs md:text-[10px] text-white/40 uppercase font-bold tracking-widest group cursor-default">
                            <div className="w-4 h-4 rounded-none border border-[#444746] flex items-center justify-center group-hover:border-zinc-700 group-hover:bg-zinc-800/20 transition-all">
                                <div className="w-1.5 h-1.5 bg-zinc-800 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div> 
                            <span className="group-hover:text-white transition-colors">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ModuleArchitecturalPro;
