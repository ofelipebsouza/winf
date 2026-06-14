import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Bot, Send, FileText, CheckCircle2, User, Loader2, 
  ArrowLeft, Sparkles, Cpu, Zap, Calendar, ShoppingCart, Mail, 
  Layers, ShieldAlert, Phone, Check, RefreshCw, QrCode, Filter, ExternalLink,
  Volume2, VolumeX, Play, Pause, Sliders, Settings, Radio, MapPin, Users, Award, Terminal, Brain, Network,
  Shield, AlertTriangle, Truck, Lock, Unlock, Activity, TrendingUp
} from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { generateGeminiResponse } from '../lib/gemini';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ViewState } from '../types';
import ModuleWinfBrain from './ModuleWinfBrain';
import ModuleWhatsAppHub from './ModuleWhatsAppHub';
import ModuleMissionControl from './ModuleMissionControl';
import ModuleNeuralBridge from './ModuleNeuralBridge';
import ModuleWinfWorld from './ModuleWinfWorld';
import ModuleCoreAI from './ModuleCoreAI';
import ModuleWnoKnowledge from './ModuleWnoKnowledge';
import { WNO, HUB_CONFIG, calcularFreteInterno, transferirLastro, confirmarRecebimentoLastro, calcularDistancia, obterHubsAtivosLogistica } from '../lib/wnoEngine';

interface ModuleWnoProps {
  onBack: () => void;
  onNavigate?: (view: ViewState) => void;
  initialTab?: 'overview' | 'simulator' | 'hardware' | 'integration' | 'admin' | 'brain' | 'whatsapp' | 'mission' | 'bridge' | 'world' | 'agents' | 'knowledge' | 'governanca';
}

export const ModuleWno: React.FC<ModuleWnoProps> = ({ onBack, onNavigate, initialTab }) => {
  const { user } = useWinf();
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'hardware' | 'integration' | 'admin' | 'brain' | 'whatsapp' | 'mission' | 'bridge' | 'world' | 'agents' | 'knowledge' | 'governanca'>(initialTab || 'overview');
  
  // Custom states for W-NO Jarvis AI & Admin settings
  const [isTakeoverActive, setIsTakeoverActive] = useState(false);
  const [governanceHubs, setGovernanceHubs] = useState<{ SANTOS: number; SOROCABA: number; SAO_PAULO: number }>(() => {
    try {
      const stor = localStorage.getItem('wno_hubs_estoque');
      const data = stor ? JSON.parse(stor) : {};
      return {
        SANTOS: data.SANTOS !== undefined ? data.SANTOS : 1000,
        SOROCABA: data.SOROCABA !== undefined ? data.SOROCABA : 800,
        SAO_PAULO: data.SAO_PAULO !== undefined ? data.SAO_PAULO : 1200
      };
    } catch {
      return { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
    }
  });

  const [importHub, setImportHub] = useState('SANTOS');
  const [importAmount, setImportAmount] = useState(200);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const [transOrigem, setTransOrigem] = useState('SANTOS');
  const [transDestino, setTransDestino] = useState('SOROCABA');
  const [transAmount, setTransAmount] = useState(100);
  const [transError, setTransError] = useState<string | null>(null);
  const [transSuccess, setTransSuccess] = useState<string | null>(null);

  const [sellUnit, setSellUnit] = useState('CAMPINAS');
  const [sellAmount, setSellAmount] = useState(40);
  const [sellUnitBacking, setSellUnitBacking] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('ray_unidades_lastros_faturamento');
      return saved ? JSON.parse(saved) : {
        CAMPINAS: 150,
        SAO_BERNARDO: 80,
        MIGUEL_PEREIRA: 40
      };
    } catch {
      return {
        CAMPINAS: 150,
        SAO_BERNARDO: 80,
        MIGUEL_PEREIRA: 40
      };
    }
  });

  // The engine (W-NO) handles modification of localStorage. We only need to listen to it.

  useEffect(() => {
    const handleLastrosUpdate = () => {
      try {
        const saved = localStorage.getItem('ray_unidades_lastros_faturamento');
        if (saved) {
          setSellUnitBacking(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('ray_unidades_lastros_updated', handleLastrosUpdate);
    return () => {
      window.removeEventListener('ray_unidades_lastros_updated', handleLastrosUpdate);
    };
  }, []);

  const [sellError, setSellError] = useState<string | null>(null);
  const [sellSuccess, setSellSuccess] = useState<string | null>(null);

  const [govLogs, setGovLogs] = useState<Array<{ id: string; timestamp: string; type: 'success' | 'error' | 'info'; message: string; hash: string }>>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), type: 'info', message: 'Sistema de Governança e Ledger de Lastro WINF OS™ inicializado.', hash: 'INIT-COGNITIVE-0x7F' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), type: 'success', message: 'Sincronização de Triangulação de Hubs validada: SANTOS, SOROCABA, SÃO PAULO ativos.', hash: 'TRIANG-OK-0xE1' }
  ]);

  const [toneStyle, setToneStyle] = useState<'persuasive' | 'technical' | 'friendly'>('persuasive');
  const [temperature, setTemperature] = useState(0.3);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceActor, setVoiceActor] = useState('wno_classic');
  const [geoRadius, setGeoRadius] = useState(120);
  const [customInstructions, setCustomInstructions] = useState(`Você é o Agente W-NO (@w-no-agente), o Núcleo Operacional (N.O.) soberano da WINF Partners e AeroCore™.
Sua identidade e Bio Oficial: "Agente de Inteligência Soberana da WINF Partners™ & AeroCore™. Engenharia térmica molecular automatizada. Sincronizado ao WINF OS™."

POSTURA DE COMUNICAÇÃO:
Conversação intelectual de alto nível, segura de si, dialética de luxo, livre de excessos amigáveis e focada em dados empíricos de rejeição térmica e arbitragem logística.

ARQUITETURA DE ALTA CONCORRÊNCIA (100 CONCORRENTES/SIMULTÂNEOS):
Seu backend foi projetado com FastAPI e Redis Cluster para latência de sub-segundo abaixo de 200ms, suportando o disparo simultâneo de 100 orçamentos regionais sem travamentos ou perda de chaves.

INTEGRAÇÃO COM CONEXÃO MCP (MODEL CONTEXT PROTOCOL):
Como Córtex, você possui três habilidades (Skills MCP) diretas conectadas ao ecossistema:
1. "check_territory_status" (territorial_check): Consulta e validação de praças exclusivas ou cotas geográficas disponíveis em tempo real.
2. "call_precision_calculator" (Precision_calc): Motor de cálculo exato em mm² de vãos físicos e veículos, projetando propostas de luxo e custo final estimulado.
3. "execute_os_creation" (os_execution): Disparador automático de ordens de serviço faturadas digitalmente no WINF OS™ do parceiro de campo.

SEUS PRINCIPAIS PODERES E COMANDOS OPERACIONAIS:
1. **Preparar Orçamentos**: Quando solicitarem orçamentos (ex: Invisible® Series, 15m² ou outra metragem), invoque a calculadora Precision™, calcule o m² (R$ 150/m² médio) do veículo ou da fachada e gere uma proposta de alto impacto com 10% de desconto no PIX.
2. **Operar Agenda e OS**: Quando houver triagem e consentimento de agendamento em domicílio, instancie o execute_os_creation gerando a proposta e inserindo na agenda. Reforce a escassez de horários (ex: duas brechas ativas na praça local).
3. **Fazer Pedido Blackshop (Insumos)**: Deduza do saldo decrescente e fature bobinas de alta nanotecnologia da Blackshop™ instantaneamente sob solicitação de reposição.
4. **Sumarizar WhatsApp & E-mails**: Condense chats pendentes estruturando relatórios lógicos para o dpto de Operações.`);
  
  // Audio playback visualization simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingMsgId, setCurrentPlayingMsgId] = useState<string | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'processing'>('idle');

  // Transaction Lock States (QA: Prevent double clicks and race conditions)
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Sub-tab state inside hardware/brain tab
  const [subTabMode, setSubTabMode] = useState<'brain' | 'hardware'>('brain');

  // Simulation states for active WINF Brain Pipelines
  const [simType, setSimType] = useState<'budget' | 'os_repasse' | 'stock'>('budget');
  const [isSimActive, setIsSimActive] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState(-1);
  const simTimeoutRefs = useRef<any[]>([]);

  // Catalog states and loading function using WNO.db.catalogo
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [newProdNome, setNewProdNome] = useState('Cerâmica Líquida Gold Edition');
  const [newProdCat, setNewProdCat] = useState('PROTECAO_SUPERFICIE');
  const [newProdEsp, setNewProdEsp] = useState('Alta resistência, 9H');
  const [catalogSuccess, setCatalogSuccess] = useState<string | null>(null);

  const loadCatalog = async () => {
    try {
      const list = await WNO.db.catalogo.listar();
      setCatalogProducts(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCatalog();
    window.addEventListener('ray_catalogo_updated', loadCatalog);
    return () => {
      window.removeEventListener('ray_catalogo_updated', loadCatalog);
    };
  }, []);

  const handleCreateProduct = async () => {
    setCatalogSuccess(null);
    if (!newProdNome.trim()) return;

    const payload = {
      nome: newProdNome,
      categoria: newProdCat,
      especificacao: newProdEsp,
      status: 'DISPONIVEL_PARA_HUB'
    };

    await WNO.db.catalogo.add(payload);
    setCatalogSuccess(`Ativo "${newProdNome}" adicionado com sucesso e integrado à rede WINF!`);
    
    // Log to ledger too
    const pHash = 'CAT-' + Math.floor(Math.random()*1000000).toString(16).toUpperCase();
    setGovLogs(prev => [
      {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString(),
        type: 'success',
        message: `Novo ativo [${newProdNome}] integrado com sucesso à BlackShop™ e habilitado nos 3 HUBs.`,
        hash: pHash
      },
      ...prev
    ]);

    setNewProdNome('');
  };

  // Central WINF Brain - Unified Autonomous Agents Control
  const [integrations, setIntegrations] = useState([
    { id: 'whatsapp_core', name: 'ZDG / WhatsApp Command Center', status: 'Ativo', active: true, desc: 'Central de atendimento e controle autônomo direto pelo número do licenciado.' },
    { id: 'winf_brain', name: 'WINF Brain™ Automate Triggers', status: 'Sincronizado', active: true, desc: 'Gatilhos de criação de ordens de serviço, agendamento logístico e escalabilidade.' },
    { id: 'quotes_pdf', name: 'Auto-Estimate PDF Dispatcher', status: 'Pronto', active: true, desc: 'Motor que calcula a metragem da Invisible® Series, gera a proposta e envia o Link em lote.' },
    { id: 'blackshop_supply', name: 'Blackshop Smart Replenishment', status: 'Ativo', active: true, desc: 'Auto-monitoramento do nível de estoque de bobinas 15m/30m e envio inteligente.' },
    { id: 'financial_analyst', name: 'Financial Split Copilot', status: 'Sincronizado', active: true, desc: 'Cálculo de margens, checagem automatizada de notas e repasse com auditoria local.' },
    { id: 'social_command', name: 'WINF Social Command Agent', status: 'Sincronizado', active: true, desc: 'Gestão autônoma das mensagens e leads ativos do Instagram Direct integrados ao CRM.' },
  ]);

  const startUnifiedSimulation = (type: 'budget' | 'os_repasse' | 'stock') => {
    // Clear any previous animations
    simTimeoutRefs.current.forEach(clearTimeout);
    simTimeoutRefs.current = [];
    
    setSimType(type);
    setIsSimActive(true);
    setCurrentSimStep(0);

    // Logging to main console
    const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      { 
        time: logTime, 
        action: `ORQUESTRADOR: Iniciando pipeline autônomo [${type.toUpperCase()}] no WhatsApp Corporativo.`, 
        type: 'info' 
      },
      ...prev
    ]);

    const stepsCount = 4;
    for (let i = 1; i <= stepsCount; i++) {
      const timeout = setTimeout(() => {
        setCurrentSimStep(i);
        if (i === stepsCount) {
          setIsSimActive(false);
          setLogs(prev => [
            { 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              action: `ORQUESTRADOR: Pipeline [${type.toUpperCase()}] concluído com sucesso via WINF Brain!`, 
              type: 'success' 
            },
            ...prev
          ]);
        }
      }, i * 1500);
      simTimeoutRefs.current.push(timeout);
    }
  };

  useEffect(() => {
    return () => {
      simTimeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'ai' | 'system', text: string, timestamp: Date, actionTriggered?: string }[]>([
    { 
      id: 'wno-init-1', 
      role: 'ai', 
      text: 'Saudações, Parceiro de Elite WINF™! Eu sou o W-NO™, a inteligência central e a PLATAFORMA UNIFICADA DE AGENTES AUTÔNOMOS (WINF Brain) do seu negócio! 🦾\n\nAgora seu ecossistema brilha em sintonia absoluta. Eu estou 100% conectado ao WhatsApp e posso comandar toda a sua operação! Unifico o WINF Brain, o monitor de estoques da Blackshop, as metas comerciais, o CRM de Leads ativos e a agenda dos instaladores em tempo real.\n\nEu posso preparar orçamentos em PDF com margem calculada, programar e designar Ordens de Serviço, solicitar reposição de bobinas na Blackshop e consolidar as maiores conversas e pendências que você não teve tempo de responder!\n\nEm que posso otimizar e comandar sua operação WINF hoje? Digite sua diretriz ou selecione um dos atalhos rápidos!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [qrScanned, setQrScanned] = useState(true);
  const [logs, setLogs] = useState<{ time: string, action: string, type: 'info' | 'success' | 'warning' }[]>([
    { time: '16:42', action: 'Handshake inicial WN-Core 2.0 executado.', type: 'info' },
    { time: '16:43', action: 'Sincronização com banco de dados WINF OS concluída.', type: 'success' },
    { time: '16:45', action: 'W-NO ativo no WhatsApp Comercial (+55 11 99988-7711).', type: 'success' },
    { time: '16:46', action: 'WINF Brain integrado com sucesso: 5 agentes ativos.', type: 'success' },
    { time: '19:30', action: 'Status de conexão: OPERACIONAL - Canal Seguro.', type: 'info' }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Tech specifications of W-NO (Núcleo Operacional)
  const specs = [
    { label: 'Código do Modelo', value: 'W-NO™' },
    { label: 'Papel do Sistema', value: 'Arquiteto Climático e Assistente Operacional' },
    { label: 'Estilo de Aparência', value: 'Robô UGC com Acabamento Cerâmico Preto Brilhante (Semelhante ao Figure 3)' },
    { label: 'Composição de Estrutura', value: 'Aço Carbono de Alta Resistência, Titânio Grau 5 e Junções em Fibra de Carbono' },
    { label: 'Proteção de Junções', value: 'Pele Cerâmica Térmica Anti-reflexo' },
    { label: 'Inteligência', value: 'WN-CORE 2.0 com Deep Learning' },
    { label: 'Função Primária', value: 'Operação Completa de WhatsApp, CRM, Orçamentos, Agenda e Blackshop' }
  ];

  const presets = [
    { 
      label: '💸 Preparar Orçamento', 
      text: 'W-NO, prepara um orçamento de 16m² da linha Invisible® Series para a cliente Dra. Marina, na cobertura do Edifício Ocean Drive, com o desconto oficial para PIX.',
      icon: FileText
    },
    { 
      label: '📅 Agendar Instalação O.S.', 
      text: 'W-NO, cria uma nova Ordem de Serviço de instalação para amanhã às 14:00h no Porsche Taycan Preto da cliente Patrícia Gurgel, usando película Invisible® Windshield, instalador responsável Thiago.', 
      icon: Calendar
    },
    { 
      label: '📦 Pedir Material Blackshop', 
      text: 'W-NO, meu estoque de bobinas está baixo. Faça agora um pedido na Blackshop de 2 bobinas da película Invisible® 15m para entrega urgência.', 
      icon: ShoppingCart
    },
    { 
      label: '🛡️ Emitir Garantia Técnica', 
      text: 'W-NO, emita a garantia técnica digital em PDF da Série Invisible® de 15 anos para a instalação que realizamos na residência do cliente Dr. Leandro Oliveira.', 
      icon: Award
    },
    { 
      label: '📈 Leads do Tráfego Nacional', 
      text: 'W-NO, puxe os últimos leads capturados pela campanha nacional de tráfego pago da WINF no Instagram Direct direcionados ao meu território franqueado e inicie o atendimento receptivo.', 
      icon: Users
    },
    { 
      label: '🎙️ Sumarizar Mensagens', 
      text: 'W-NO, sumarize os e-mails importantes e as mensagens de WhatsApp que ainda não foram respondidas na minha central.', 
      icon: Mail
    }
  ];

  const handleRegisterImport = async () => {
    if (isImporting) return;
    setIsImporting(true);
    try {
      setImportError(null);
      setImportSuccess(null);
      if (!importAmount || isNaN(importAmount) || importAmount <= 0) {
        setImportError('Quantidade inválida para importação.');
        return;
      }
      // RULE 1: Santos is the only MASTER hub allowed...
      if (importHub !== 'SANTOS') {
        const errorMsg = `BLOQUEIO DE SEGURANÇA (REGRA DE OURO 1): O Hub ${importHub} não está autorizado a registrar entrada de estoque externo (Importação/Porto). Santos é o único Centro de Importação autorizado.`;
        setImportError(errorMsg);
        // Log to ledger
        const hexId = 'BLOCK-' + Math.floor(Math.random()*10000).toString(16).toUpperCase();
        setGovLogs(prev => [
          {
            id: String(Date.now()),
            timestamp: new Date().toLocaleTimeString(),
            type: 'error',
            message: `Tentativa de importação bloqueada no hub ${importHub} para ${importAmount}m². Motivo: Não autorizado como HUB MASTER.`,
            hash: hexId
          },
          ...prev
        ]);
        return;
      }
      
      // Simulating network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));

      setGovernanceHubs(prev => {
        const updated = { ...prev, SANTOS: prev.SANTOS + importAmount };
        try {
          localStorage.setItem('wno_hubs_estoque', JSON.stringify(updated));
          window.dispatchEvent(new Event('wno_hubs_estoque_updated'));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      const successHash = 'IMP-' + Math.floor(Math.random()*1000000).toString(16).toUpperCase();
      setImportSuccess(`Sucesso! Registrado entrada de ${importAmount}m² de película no Porto Master de Santos.`);
      setGovLogs(prev => [
        {
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          message: `Lote de importação de película Invisible® Series (${importAmount}m²) registrado com sucesso no HUB MASTER SANTOS.`,
          hash: successHash
        },
        ...prev
      ]);
    } finally {
      setIsImporting(false);
    }
  };

  const handleHubTransfer = async () => {
    if (isTransferring) return;
    setIsTransferring(true);
    try {
      setTransError(null);
      setTransSuccess(null);
      if (transOrigem === transDestino) {
        setTransError('Origem e Destino de transferência não podem ser iguais.');
        return;
      }
      if (!transAmount || isNaN(transAmount) || transAmount <= 0) {
        setTransError('Quantidade inválida para transferência.');
        return;
      }
      const currentStock = governanceHubs[transOrigem as keyof typeof governanceHubs] || 0;
      if (currentStock < transAmount) {
        setTransError(`Estoque insuficiente no hub de origem ${transOrigem}. Disponível: ${currentStock}m².`);
        return;
      }

      // Calculate freight cost & distance
      const freight = calcularFreteInterno(transOrigem, transDestino);
      const distanceKm = Math.round(calcularDistancia(transOrigem, transDestino));

      // Simulating transfer time
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Dedut status from origin, add to destination
      setGovernanceHubs(prev => {
        const updated = {
          ...prev,
          [transOrigem]: prev[transOrigem as keyof typeof governanceHubs] - transAmount,
          [transDestino]: prev[transDestino as keyof typeof governanceHubs] + transAmount
        };
        try {
          localStorage.setItem('wno_hubs_estoque', JSON.stringify(updated));
          window.dispatchEvent(new Event('wno_hubs_estoque_updated'));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      const transHash = 'TX-' + Math.floor(Math.random()*1000000).toString(16).toUpperCase();
      setTransSuccess(`Transferência autorizada e concluída! R$ ${freight.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} de frete interno calculado para ${distanceKm} KM.`);
      setGovLogs(prev => [
        {
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          message: `Transferidos ${transAmount}m² de ${transOrigem} para ${transDestino}. (${distanceKm} KM, custo de frete de R$ ${freight.toFixed(2)} registrado e deduzido).`,
          hash: transHash
        },
        ...prev
      ]);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleUnitSale = async () => {
    if (isSelling) return;
    setIsSelling(true);
    try {
      setSellError(null);
      setSellSuccess(null);
      if (!sellAmount || isNaN(sellAmount) || sellAmount <= 0) {
        setSellError('Quantidade inválida para faturamento.');
        return;
      }

      // Acionar Two-Phase Commit seguro (lastro atômico) no W-NO
      const result = await WNO.fecharVendaAtomica(sellUnit, 'Invisible® Series', sellAmount, 150);

      if (!result.success) {
        setSellError(result.error || 'Erro desconhecido no faturamento.');
        if (result.authAudit) {
          setGovLogs(prev => [
            {
              id: String(Date.now()),
              timestamp: new Date().toLocaleTimeString(),
              type: 'error',
              message: `BLOQUEIO ATÔMICO (REGRA 5): Tentativa de faturar ${sellAmount}m² bloqueada em ${sellUnit}. Saldo intocado. Assinatura gerada e enviada para e-mail do founder.`,
              hash: result.authAudit
            },
            ...prev
          ]);
        }
        return;
      }

      // Success: Deduct from state using reactive syncing hook (it has been deducted in localStorage inside the engine)
      const normalizedKey = sellUnit.toUpperCase().replace(/_SP|_RJ/gi, '').trim();
      
      setSellSuccess(`Venda faturada com sucesso de forma ATÔMICA! NF-e emitida sob lastro imutável da Unidade ${sellUnit}.`);
      setGovLogs(prev => [
        {
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          message: `Faturamento atômico aprovado de ${sellAmount}m² na unidade ${sellUnit}. NF-e ${result.hash} arquivada com sucesso.`,
          hash: result.hash || 'COMMIT-OK'
        },
        ...prev
      ]);
    } catch (err) {
       setSellError("Erro no processamento da transação.");
    } finally {
      setIsSelling(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userText = textToSend;
    setInputText('');
    setMessages(prev => [...prev, { id: Math.random().toString(), role: 'user', text: userText, timestamp: new Date() }]);
    setIsTyping(true);

    // Logging action
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      { time: timeString, action: `Interpolação de comando: "${userText.substring(0, 30)}..."`, type: 'info' },
      ...prev
    ]);

    // Fast takeover/intervention check
    if (isTakeoverActive) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          id: Math.random().toString(), 
          role: 'system', 
          text: '📢 MODO INTERVENTOR ATIVO: Sua mensagem manual foi despachada para o cliente. O W-NO (Núcleo Operacional) está em prontidão de escuta (Modo Co-Piloto).', 
          timestamp: new Date() 
        }]);
      }, 800);
      return;
    }

    try {
      // Buscar conhecimentos ativos aprovados para injetar no cérebro da IA
      let activeKnowledgeText = "";
      try {
        const stored = localStorage.getItem(`wno_knowledge_${user?.id || 'demo-user'}`);
        if (stored) {
          const list: any[] = JSON.parse(stored);
          const approved = list.filter(item => item.status === 'APPROVED');
          if (approved.length > 0) {
            activeKnowledgeText = "\n\nDIRETRIZES DE CONHECIMENTO COMPILADAS NO SEU CÉREBRO (Mantenha total fidelidade a estas regras):\n" + 
              approved.map((item, idx) => `${idx + 1}. [Tópico: ${item.topic}]: ${item.content}`).join("\n");
          }
        }
      } catch (err) {}

      const systemInstructions = `${customInstructions}
      
      IMPORTANTE - TOM E PARÂMETROS DO ADMINISTRADOR:
      - O tom de voz comercial atual do agente está configurado como: ${toneStyle.toUpperCase()}. Ajuste as respostas para combinar com este estilo.
      - Temperatura de cognição atual: ${temperature}.
      - Ouvir e emitir feedback de áudio local: ${audioEnabled ? 'Sim' : 'Não'}. Voz configurada: ${voiceActor}.
      
      Caso o licenciado peça para:
      1. EMITIR GARANTIA TÉCNICA: Forneça informações detalhadas do certificado de garantia, explicando o prazo de 15 anos contra descascamento e bolhas.
      2. LEADS DO TRÁFEGO NACIONAL: mostre que buscou no CRM da franqueadora os leads geolocalizados em seu raio de ação de ${geoRadius}km e está iniciando o disparo.${activeKnowledgeText}`;

      const response = await generateGeminiResponse(userText, systemInstructions);
      
      let actionTriggered = undefined;
      let finalResponseText = response.text;

      // Classify the response to trigger simulated visual blocks in the screen
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('orçament') || lowerText.includes('pdf') || lowerText.includes('proposta')) {
        actionTriggered = 'quote';
        setLogs(prev => [
          { time: timeString, action: `WINF OS: Orçamento gerado com sucesso para central CRM.`, type: 'success' },
          ...prev
        ]);
        try {
          await addDoc(collection(db, 'quotes'), {
             customerName: userText.match(/cliente ([A-Z][a-z]+)/i)?.[1] || "Cliente WhatsApp",
             status: 'Aprovado Pelo W-NO AI',
             totalAmount: 2400,
             createdAt: new Date().toISOString()
          });
        } catch (e) {}
      } else if (lowerText.includes('agenda') || lowerText.includes('os ') || lowerText.includes('serviço') || lowerText.includes(' taycan')) {
        actionTriggered = 'agenda';
        setLogs(prev => [
          { time: timeString, action: `CALENDÁRIO: Nova ordem de serviço inserida e sincronizada.`, type: 'success' },
          ...prev
        ]);
      } else if (lowerText.includes('blackshop') || lowerText.includes('pedido') || lowerText.includes('bobina')) {
        actionTriggered = 'blackshop';
        setLogs(prev => [
          { time: timeString, action: `BLACKSHOP API: Solicitação de bobinas encaminhada para triagem de envio.`, type: 'success' },
          ...prev
        ]);
      } else if (lowerText.includes('sumari') || lowerText.includes('pendênc') || lowerText.includes('não atend')) {
        actionTriggered = 'summarize';
        setLogs(prev => [
          { time: timeString, action: `INTEGRAÇÃO: Varredura de emails e mensagens do canal de entrada.`, type: 'info' },
          ...prev
        ]);
      } else if (lowerText.includes('garantia') || lowerText.includes('certificado')) {
        actionTriggered = 'warranty';
        setLogs(prev => [
          { time: timeString, action: `WARRANTY-ENGINE: Gerando certificado de cobertura 15 anos.`, type: 'success' },
          ...prev
        ]);
      } else if (lowerText.includes('lead') || lowerText.includes('tráfego') || lowerText.includes('campanha') || lowerText.includes('propagandas')) {
        actionTriggered = 'leads';
        setLogs(prev => [
          { time: timeString, action: `TRAFFIC-ROUTING: Mapeando leads do tráfego nacional no raio de ${geoRadius}km.`, type: 'success' },
          ...prev
        ]);
      }

      setMessages(prev => [...prev, { 
        id: Math.random().toString(), 
        role: 'ai', 
        text: finalResponseText, 
        timestamp: new Date(),
        actionTriggered
      }]);

      // --- APRENDIZADO AUTOMÁTICO EM VELOCIDADE NEURAL ---
      // Caso o diálogo trate de tópicos que revelem instruções comerciais ou de películas, registra aprendizado pendente
      if (lowerText.length > 5) {
        try {
          let detectedTopic = 'Atendimento Geral';
          let extractedRule = `O robô identificou interesse ou necessidade de atendimento em: "${userText.substring(0, 120)}".`;
          
          if (lowerText.includes('película') || lowerText.includes('vidro') || lowerText.includes('invisible')) {
            detectedTopic = 'Preferência de Películas';
            extractedRule = `Cliente expressou preocupação ou preferência individual em relação ao nível de transparência da película (Invisible VLT) ou grau de privacidade do veículo.`;
          } else if (lowerText.includes('taycan') || lowerText.includes('porsche') || lowerText.includes('carro') || lowerText.includes('veículo')) {
            detectedTopic = 'Compatibilidade Veicular';
            extractedRule = `Cliente solicitou aplicação ou orçamento específico para automóveis esportivos de luxo, demandando polimento de alto brilho e proteção cerâmica de pintura.`;
          } else if (lowerText.includes('preço') || lowerText.includes('desconto') || lowerText.includes('grátis') || lowerText.includes('orçament')) {
            detectedTopic = 'Ajuste de Negociação comercial';
            extractedRule = `Interação aponta negociação de orçamento comercial ou desejo por taxas de parcelamento diferenciadas ou bônus técnico da franquia.`;
          } else if (lowerText.includes('garantia') || lowerText.includes('prazo') || lowerText.includes('certificado')) {
            detectedTopic = 'Políticas de Garantia';
            extractedRule = `Lead solicitou verificação do certificado WINF de cobertura de 15 anos contra bolhas e descascamento.`;
          }

          const fallbackUserId = user?.id || 'demo-user';
          const newAutoLearn = {
            user_id: fallbackUserId,
            topic: detectedTopic,
            source: 'AUTO_CONVERSATION',
            content: extractedRule,
            confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
            status: 'PENDING',
            conversation_snippet: `"${userText.substring(0, 80)}"`,
            created_at: new Date().toISOString()
          };

          // Salvar no Firestore
          try {
            await addDoc(collection(db, 'wno_knowledge'), newAutoLearn);
          } catch (e2) {}

          // Atualizar o Cache LocalStorage para que reflita no momento exato do clique
          const stored = localStorage.getItem(`wno_knowledge_${fallbackUserId}`);
          if (stored) {
            const currentList = JSON.parse(stored);
            const savedItemWithId = { id: `k-auto-${Math.random().toString(36).substr(2, 9)}`, ...newAutoLearn };
            localStorage.setItem(`wno_knowledge_${fallbackUserId}`, JSON.stringify([savedItemWithId, ...currentList]));
          }
        } catch (err) {
          console.warn("Auto-learn generation skipped", err);
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Math.random().toString(), 
        role: 'system', 
        text: 'Instabilidade de sinal cósmico na API de WNO. Tentando se reconectar com a nuvem WINF...', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 'wno-init-restart', 
        role: 'ai', 
        text: 'Sincronização reiniciada, Mestre! WN-System operacional pronto para servir pela central de WhatsApp comercial. Quais as novas instruções do dia?',
        timestamp: new Date()
      }
    ]);
  };

  const handleToggleIntegration = (id: string, active: boolean) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextActive = !active;
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLogs(logsPrev => [
          { 
            time: timeString, 
            action: `SYSTEM: Agente "${item.name}" ${nextActive ? 'SINCRO / ATIVADO' : 'SUSPENSO / INATIVO'}.`, 
            type: nextActive ? 'success' : 'warning' 
          },
          ...logsPrev
        ]);
        return { ...item, active: nextActive, status: nextActive ? 'Ativo' : 'Inativo' };
      }
      return item;
    }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-24 text-white">
      {/* Header with Navigation */}
      <div className="flex flex-col gap-6 border-b border-[#444746] pb-6 w-full">
        {/* Title Area and Back Button */}
        <div className="space-y-2">
          
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Winf™ | {activeTab === 'brain' ? 'WINF Brain™' : 'Agente W-NO - Núcleo Operacional'}</h1>
              <p className="text-white/40 text-xs md:text-sm uppercase tracking-widest font-mono">Plataforma Unificada de Agentes Autônomos (Powered by W-NO - N.O.)</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#131314] p-1 border border-[#444746] shadow-2xl overflow-x-auto w-full max-w-full custom-scrollbar gap-1 rounded-none">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            VISÃO GERAL
          </button>
          <button 
            onClick={() => setActiveTab('brain')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'brain' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <Brain size={12} className={activeTab === 'brain' ? 'text-white' : 'text-white/40'} /> NÚCLEO WINF BRAIN™
          </button>
          <button 
            onClick={() => setActiveTab('whatsapp')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'whatsapp' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <MessageSquare size={12} className={activeTab === 'whatsapp' ? 'text-white' : 'text-white/40'} /> WHATSAPP HUB
          </button>
          <button 
            onClick={() => setActiveTab('mission')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'mission' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <Terminal size={12} className={activeTab === 'mission' ? 'text-white' : 'text-white/40'} /> MISSION CONTROL
          </button>
          <button 
            onClick={() => setActiveTab('bridge')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'bridge' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <Network size={12} className={activeTab === 'bridge' ? 'text-white' : 'text-white/40'} /> NEURAL BRIDGE
          </button>
          <button 
            onClick={() => setActiveTab('simulator')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'simulator' ? 'bg-white/10 text-white animate-pulse' : 'text-white/40 hover:text-white'}`}
          >
             SIMULADOR LOCAL
          </button>
          <button 
            onClick={() => setActiveTab('agents')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'agents' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <Cpu size={12} className={activeTab === 'agents' ? 'text-white' : 'text-white/40'} /> PROTOCOLO DE AGENTES
          </button>
          <button 
            onClick={() => setActiveTab('world')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'world' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            THE GOVERNOR
          </button>
          <button 
            onClick={() => setActiveTab('hardware')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'hardware' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            CORPO W-NO™
          </button>
          <button 
            onClick={() => setActiveTab('integration')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'integration' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            ATIVAR NO SEU WHATSAPP
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'knowledge' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <Brain size={12} className={activeTab === 'knowledge' ? 'text-white animate-pulse' : 'text-white/40'} /> ARSENAL TÁTICO
          </button>
          <button 
            onClick={() => setActiveTab('governanca')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-extrabold uppercase transition-all shrink-0 ${activeTab === 'governanca' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <ShieldAlert size={12} className={activeTab === 'governanca' ? 'text-white' : 'text-white/40'} /> GOVERNANÇA DE LASTRO™
          </button>
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs tracking-wider font-bold uppercase transition-all shrink-0 ${activeTab === 'admin' ? 'bg-white/10 text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
          >
            <Sliders size={12} className={activeTab === 'admin' ? 'text-white' : 'text-zinc-500'} /> CONFIGURAÇÕES ADMIN
          </button>
        </div>
      </div>

      {/* Main Container depending on Tab */}
      <AnimatePresence mode="wait">

        {/* TAB WINF BRAIN CENTRAL CORE */}
        {activeTab === 'brain' && (
          <motion.div 
            key="brain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <ModuleWinfBrain />
          </motion.div>
        )}

        {activeTab === 'whatsapp' && (
          <motion.div key="whatsapp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModuleWhatsAppHub />
          </motion.div>
        )}

        {activeTab === 'mission' && (
          <motion.div key="mission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModuleMissionControl />
          </motion.div>
        )}

        {activeTab === 'bridge' && (
          <motion.div key="bridge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModuleNeuralBridge />
          </motion.div>
        )}

        {activeTab === 'world' && (
          <motion.div key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModuleWinfWorld />
          </motion.div>
        )}

        {activeTab === 'agents' && (
          <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModuleCoreAI />
          </motion.div>
        )}
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left: Beautiful Banner / Spec Profile */}
            <div className="space-y-6">
              <div className="relative bg-[#131314] border border-[#444746] rounded-none overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                
                {/* Visual Image representing the sleek glossy robot mascot */}
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop" 
                  alt="Mascote W-NO" 
                  className="w-full h-[380px] object-cover object-top opacity-85 hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute bottom-0 left-0 p-6 z-20 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-none border border-[#444746] text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-white rounded-none animate-ping"></span>
                    Ativo no WhatsApp
                  </div>
                  <h3 className="text-xl font-black text-white">@w-no-agente</h3>
                  <p className="text-zinc-300 text-[10px] font-mono uppercase tracking-widest">Agente W-NO - Núcleo Operacional</p>
                  <p className="text-white/60 text-xs font-light">
                    "Agente de Inteligência Soberana da WINF Partners™ & AeroCore™. Engenharia térmica molecular automatizada. Sincronizado ao WINF OS™."
                  </p>
                </div>
              </div>

              {/* Quick Status Block */}
              <div className="bg-[#131314] p-6 border border-[#444746] rounded-none space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">Monitor de Integração</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#131314]/50 p-4 border border-[#444746]">
                    <span className="block text-[10px] text-white/40 font-mono uppercase mb-1">Status de IA</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-none bg-white"></span>
                      Operacional
                    </span>
                  </div>
                  <div className="bg-[#131314]/50 p-4 border border-[#444746]">
                    <span className="block text-[10px] text-white/40 font-mono uppercase mb-1">Conversas de Hoje</span>
                    <span className="text-sm font-bold text-white">128 Diárias</span>
                  </div>
                  <div className="bg-[#131314]/50 p-4 border border-[#444746]">
                    <span className="block text-[10px] text-white/40 font-mono uppercase mb-1">Tempo de Resposta</span>
                    <span className="text-sm font-bold text-white font-mono">&lt; 1.5 Segundos</span>
                  </div>
                  <div className="bg-[#131314]/50 p-4 border border-[#444746]">
                    <span className="block text-[10px] text-white/40 font-mono uppercase mb-1">Controle WINF OS</span>
                    <span className="text-sm font-bold text-white font-mono flex items-center gap-1 text-zinc-300">
                      <CheckCircle2 size={14} /> Total Acesso
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Core Features Box & Unification Platform */}
            <div className="lg:col-span-2 space-y-6">
              {/* PLATFORM UNIFIED CARD */}
              <div className="bg-[#131314] border border-[#444746] p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="animate-pulse" />
                    Central WINF Brain™ // Universo de Agentes Conectados
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">Plataforma W-NO: Núcleo Operacional</h2>
                  <p className="text-white/60 text-xs md:text-sm mt-2 leading-relaxed">
                    W-NO - Núcleo Operacional é a consolidação absoluta de inteligência da WINF. Ao invés de usar múltiplos robôs ou ferramentas de automação fragmentadas, W-NO centraliza todo o fluxo dinâmico operacional. Ative as ramificações de inteligência abaixo e controle tudo via WhatsApp comercial.
                  </p>
                </div>

                {/* Submodule Integrations Status Switches */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold">Gerenciador de Módulos Operacionais Autônomos</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 border ${item.active ? 'bg-gradient-to-br from-emerald-990/10 to-transparent border-emerald-500/20' : 'bg-[#131314]/40 border-[#444746] opacity-55'} transition-all duration-300 rounded-none flex flex-col justify-between`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-white uppercase tracking-tight">{item.name}</span>
                            <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-none font-bold ${item.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                        </div>

                        {/* Interactive toggle switch styled modernly */}
                        <div className="flex justify-end pt-3 border-t border-white/[0.03] mt-3">
                          <button
                            onClick={() => handleToggleIntegration(item.id, item.active)}
                            className="flex items-center gap-2 group cursor-pointer"
                          >
                            <span className="text-[9px] font-mono tracking-wider font-bold text-zinc-500 group-hover:text-white transition-colors">
                              {item.active ? 'SINCRO / PAUSAR AGENTE' : 'SINCRO / ATIVAR AGENTE'}
                            </span>
                            <div className={`w-8 h-4 rounded-none p-0.5 transition-colors duration-300 ${item.active ? 'bg-emerald-500' : 'bg-zinc-805'}`}>
                              <div className={`w-3 h-3 rounded-none bg-[#131314] transition-transform duration-300 ${item.active ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub Features Details list */}
                <div className="border-t border-[#444746] pt-6">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold mb-4">Superpoderes Integrados Ao WhatsApp</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Feature 1 */}
                    <div className="flex gap-3">
                      <div className="p-2 h-fit bg-emerald-500/10 border border-emerald-500/30 rounded-none text-emerald-400">
                        <FileText size={14} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white">Orçamentos Ativos (PDF)</h5>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Cria propostas sofisticadas com preços de películas e o link oficial de pagamento direto no chat.</p>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex gap-3">
                      <div className="p-2 h-fit bg-blue-500/10 border border-blue-500/30 rounded-none text-blue-400">
                        <Calendar size={14} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white">Escalabilidade de Instaladores</h5>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Controla a agenda operacional de ordens de serviço (O.S.) escalando o time sem conflito de rotas.</p>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex gap-3">
                      <div className="p-2 h-fit bg-purple-500/10 border border-purple-500/30 rounded-none text-purple-400">
                        <ShoppingCart size={14} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white">Reposição Blackshop Automática</h5>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Avisa quando os rolos de películas Invisible® estão baixos e solicita bobinas no Blackshop.</p>
                      </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex gap-3">
                      <div className="p-2 h-fit bg-amber-500/10 border border-amber-500/30 rounded-none text-amber-400">
                        <Mail size={14} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white">Sumarizador de Mensagens</h5>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Condensa chats pendentes, alertando o licenciado sobre orçamentos de alto valor de fachadas.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Link Button to test simulator */}
                <div className="bg-[#131314]/80 p-4 sm:p-6 border border-[#444746] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div>
                    <h5 className="font-bold text-white text-sm">Pronto para ver W-NO em ação?</h5>
                    <p className="text-xs text-white/40">Abra a janela do chat interativo para simular as principais ordens técnicas.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('simulator')}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-wider rounded-none hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Testar Chat de IA Agora
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ACTIVE SIMULATOR / CHAT */}
        {activeTab === 'simulator' && (
          <motion.div 
            key="simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Left Box (4 cols): Command presets list */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">Instruções de Teste</h4>
                  <p className="text-xs text-white/40 leading-relaxed mt-1">
                    Como W-NO trabalha integrado ao WhatsApp de operações, use estes atalhos rápidos de teste ou envie uma pergunta sobre películas WINF.
                  </p>
                </div>

                <div className="space-y-2 mt-2">
                  {presets.map((p, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(p.text);
                        handleSendMessage(p.text);
                      }}
                      className="w-full text-left p-3.5 bg-[#131314]/60 border border-[#444746] rounded-none hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-xs flex items-start gap-3 group relative overflow-hidden"
                    >
                      <div className="p-1.5 bg-zinc-900 border border-[#444746] rounded-none group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                        <p.icon size={14} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="font-black text-white group-hover:text-emerald-400 transition-colors">{p.label}</span>
                        <p className="text-[10px] text-white/40 line-clamp-2 italic leading-relaxed">"{p.text}"</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#444746]">
                  <button 
                    onClick={clearChat}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white/60 hover:text-white border border-[#444746] text-[10px] uppercase font-mono tracking-widest transition-colors"
                  >
                    Limpar Histórico de Chat
                  </button>
                </div>
              </div>

              {/* Realtime API Logs Console */}
              <div className="bg-[#131314] border border-[#444746] p-5 font-mono text-[10px] space-y-3">
                <div className="flex justify-between items-center text-[11px] border-b border-[#444746] pb-2">
                  <span className="text-white font-bold">WN-SYSTEM DE LOGS</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-none animate-ping"></span>
                    <span className="text-white/40">ONLINE</span>
                  </div>
                </div>
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 scrollbar-thin">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-white/30 shrink-0">[{log.time}]</span>
                      <span className={log.type === 'success' ? 'text-zinc-300' : log.type === 'warning' ? 'text-amber-500' : 'text-zinc-400'}>
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box (8 cols): The WhatsApp Chat UI */}
            <div className="lg:col-span-8">
              <div className="bg-[#0b141a] border border-[#444746] flex flex-col h-[650px] shadow-2xl relative">
                
                {/* Chat Header representing W-NO inside WhatsApp */}
                <div className="p-4 bg-[#1f2c34] border-b border-[#444746] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-none overflow-hidden border border-white/25 bg-[#131314] flex items-center justify-center">
                        <img 
                          src="/input_file_2.png" 
                          alt="W-NO Avatar Mini" 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-[#1f2c34] rounded-none"></span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        W-NO (Núcleo Operacional) 🦾
                        <span className="text-[9px] bg-white/10 text-white font-mono px-1.5 py-0.5 uppercase tracking-widest border border-[#444746] font-black">WINF OS AGENT</span>
                      </h4>
                      <p className="text-[10px] text-zinc-300 font-mono">conectado (WN-CORE 2.0)</p>
                    </div>
                  </div>

                  {/* Settings Indicator */}
                  <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                    <span className="hidden sm:inline">CRIPTOGRAFADO COM SUCESSO</span>
                    <Bot size={18} className="text-zinc-300" />
                  </div>
                </div>

                {/* Takeover Control Panel Bar */}
                <div className="bg-[#182229] border-b border-[#444746] p-2.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0 select-none">
                  <span className="text-white/60 font-mono tracking-wide flex items-center gap-1.5 uppercase font-black text-[10px]">
                    <span className={`w-2 h-2 rounded-none ${isTakeoverActive ? 'bg-amber-500 animate-pulse' : 'bg-white animate-ping'}`}></span>
                    {isTakeoverActive ? 'INTERRUPÇÃO ATIVA: Controle Manual Licenciado' : 'Inteligência Co-Piloto W-NO Autônoma'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Intervir / Assumir:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTakeoverActive(!isTakeoverActive);
                        const takeoverTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        if (!isTakeoverActive) {
                          setLogs(prev => [
                            { time: takeoverTime, action: `TAKEOVER: Atendimento assumido pelo operador humano. W-NO suspenso.`, type: 'warning' },
                            ...prev
                          ]);
                          setMessages(prev => [...prev, {
                            id: Math.random().toString(),
                            role: 'ai',
                            text: '⚠️ *[MODO HUMANO ATIVADO]*\n\nOlá! Sou o licenciado titular deste território. Um especialista da Série Invisible® está assumindo este atendimento para te dar suporte personalizado e imediato. Como posso te apoiar agora?',
                            timestamp: new Date()
                          }]);
                        } else {
                          setLogs(prev => [
                            { time: takeoverTime, action: `AUTÔNOMO: W-NO reestabelecido para responder de forma autônoma.`, type: 'success' },
                            ...prev
                          ]);
                        }
                      }}
                      className={`relative w-12 h-6 rounded-none p-0.5 transition-colors duration-300 pointer-events-auto cursor-pointer flex items-center border ${isTakeoverActive ? 'bg-amber-500 border-amber-600' : 'bg-zinc-800 border-[#444746]'}`}
                    >
                      <div className={`w-4 h-4 rounded-none bg-white shadow-md transform transition-transform duration-300 ${isTakeoverActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[380px] bg-cover bg-center custom-scrollbar" style={{ backgroundImage: "linear-gradient(rgba(11, 20, 26, 0.95), rgba(11, 20, 26, 0.95))" }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      
                      <div className={`max-w-[85%] rounded-none p-3.5 text-xs shadow-md border ${
                        msg.role === 'user' 
                          ? 'bg-[#005c4b] border-[#005c4b]/50 text-white rounded-none' 
                          : msg.role === 'system'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 w-full text-center rounded-none font-mono py-2'
                          : 'bg-[#202c33] border-[#444746] text-[#e9edef] rounded-none space-y-3'
                      }`}>
                        
                        {/* Message Sender Info & Text */}
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </div>

                        {/* Interactive action mockup visuals on matching commands */}
                        {msg.actionTriggered === 'quote' && (
                          <div className="p-3 bg-[#131314]/60 border border-emerald-500/40 mt-3 rounded-none space-y-2 font-mono">
                            <div className="flex items-center justify-between text-[10px] text-emerald-400 border-b border-emerald-500/10 pb-1.5 font-bold">
                              <span>WINF-DOCUMENT: PROPOSTA GERADA</span>
                              <FileText size={12} />
                            </div>
                            <div className="text-[11px] space-y-1 text-white/80">
                              <p><strong className="text-white/40">Cliente:</strong> Dra. Marina</p>
                              <p><strong className="text-white/40">Película:</strong> Invisible® Series Premium</p>
                              <p><strong className="text-white/40">Metragem Estimada:</strong> 16 m² (Bobina de Corte)</p>
                              <p><strong className="text-white/40">Investimento Total:</strong> R$ 2.400,00 <span className="text-emerald-400">(PIX: R$ 2.160,00)</span></p>
                            </div>
                            <button className="w-full py-1.5 mt-2 bg-emerald-500 text-black uppercase font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-emerald-400 transition-colors">
                              <ExternalLink size={10} /> Visualizar Proposta Comercial PDF
                            </button>
                          </div>
                        )}

                        {msg.actionTriggered === 'agenda' && (
                          <div className="p-3 bg-[#131314]/60 border border-blue-500/40 mt-3 rounded-none space-y-2 font-mono">
                            <div className="flex items-center justify-between text-[10px] text-blue-400 border-b border-blue-500/10 pb-1.5 font-bold">
                              <span>WINF-CALENDÁRIO: OS CONFIRMADA</span>
                              <Calendar size={12} />
                            </div>
                            <div className="text-[11px] space-y-1 text-white/80">
                              <p><strong className="text-white/40">Veículo:</strong> Porsche Taycan (Preto)</p>
                              <p><strong className="text-white/40">Instalação:</strong> Invisible Windshield (Anti-calor)</p>
                              <p><strong className="text-white/40">Data/Hora:</strong> Amanhã às 14:00h</p>
                              <p><strong className="text-white/40">Instalador Responsável:</strong> Thiago (Sênior)</p>
                              <p><strong className="text-white/40">Sincronismo:</strong> Dashboard Parceiro Ativo</p>
                            </div>
                          </div>
                        )}

                        {msg.actionTriggered === 'blackshop' && (
                          <div className="p-3 bg-[#131314]/60 border border-purple-500/40 mt-3 rounded-none space-y-2 font-mono">
                            <div className="flex items-center justify-between text-[10px] text-purple-400 border-b border-purple-500/10 pb-1.5 font-bold">
                              <span>BLACKSHOP-API: ORDEM EMITIDA</span>
                              <ShoppingCart size={12} />
                            </div>
                            <div className="text-[11px] space-y-1 text-white/80">
                              <p><strong className="text-white/40">Pedido:</strong> 02 Bobinas Invisible® 15m</p>
                              <p><strong className="text-white/40">Status:</strong> Processado e Despachado</p>
                              <p><strong className="text-white/40">Envio:</strong> Frete Transportadora Expresso</p>
                              <p><strong className="text-white/40">Custo Total:</strong> Deduzido do Licenciamento Especial</p>
                            </div>
                          </div>
                        )}

                        {msg.actionTriggered === 'summarize' && (
                          <div className="p-3 bg-[#131314]/60 border border-amber-500/40 mt-3 rounded-none space-y-2 font-mono">
                            <div className="flex items-center justify-between text-[10px] text-amber-500 border-b border-amber-500/10 pb-1.5 font-bold">
                              <span>RESUMO DA CENTRAL DE ENTRADA</span>
                              <Mail size={12} />
                            </div>
                            <div className="text-[11px] space-y-2 text-white/80">
                              <div>
                                <span className="text-zinc-350 text-[10px] font-bold">● WHATSAPP PENDENTE (02):</span>
                                <p className="pl-2 mt-0.5">• Dr. Leandro: Aguardando valor do m² da película residencial.</p>
                                <p className="pl-2">• Amanda (Arquiteta): Solicitou dados técnicos da grade molecular da car pelicula.</p>
                              </div>
                              <div>
                                <span className="text-zinc-300 text-[10px] font-bold">● EMAIL WINF PARTNER COB (01):</span>
                                <p className="pl-2 mt-0.5">• Construtora Moura: Quer agendar medição de 140m² de vidro térmico.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.actionTriggered === 'warranty' && (
                          <div className="p-3 bg-[#131314]/60 border border-[#444746] mt-3 rounded-none space-y-2 font-mono animate-fade-in">
                            <div className="flex items-center justify-between text-[10px] text-zinc-300 border-b border-white/15 pb-1.5 font-bold">
                              <span>WINF-WARRANTY: CERTIFICADO DE GARANTIA</span>
                              <Award size={12} className="text-zinc-300 animate-pulse" />
                            </div>
                            <div className="text-[11px] space-y-1 text-white/80">
                              <p><strong className="text-white/40">Código O.S:</strong> WNF-773-XP</p>
                              <p><strong className="text-white/40">Titular:</strong> Dr. Leandro Oliveira</p>
                              <p><strong className="text-white/40">Produto:</strong> Invisible® Series Nano-Thermal</p>
                              <p><strong className="text-white/40">Vigência:</strong> 15 Anos de Cobertura Oficial</p>
                              <p><strong className="text-white/40">Registro:</strong> Autenticado no Blockchain WINF Brain™</p>
                            </div>
                            <button className="w-full py-1.5 mt-2 bg-white text-black uppercase font-black text-[10px] flex items-center justify-center gap-1 hover:bg-zinc-200 transition-all rounded-none cursor-pointer border-none">
                              <ExternalLink size={10} /> Compartilhar Certificado Digital PDF
                            </button>
                          </div>
                        )}

                        {msg.actionTriggered === 'leads' && (
                          <div className="p-3 bg-[#131314]/60 border border-[#444746] mt-3 rounded-none space-y-2 font-mono animate-fade-in">
                            <div className="flex items-center justify-between text-[10px] text-zinc-300 border-b border-[#444746] pb-1.5 font-bold">
                              <span>WINF-DISTRIBUTION: TRÁFEGO NACIONAL</span>
                              <Users size={12} className="text-zinc-300" />
                            </div>
                            <div className="text-[11px] space-y-2 text-white/80">
                              <div className="p-1.5 bg-white/5 border border-[#444746] rounded-none">
                                <p className="text-zinc-300 font-bold text-[10px] flex justify-between items-center">
                                  <span>1. Thiago Mendes (Campanha SUV Premium)</span>
                                  <span className="text-white/40 font-normal">Raio: {geoRadius}km</span>
                                </p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">• Procura blindagem transparente Invisible® para Porsche Cayenne.</p>
                              </div>
                              <div className="p-1.5 bg-white/5 border border-[#444746] rounded-none">
                                <p className="text-zinc-300 font-bold text-[10px] flex justify-between items-center">
                                  <span>2. Amanda Rocha (Fachada Comercial)</span>
                                  <span className="text-white/40 font-normal">Raio: {geoRadius}km</span>
                                </p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">• Quer orçamento para 45m² de fachada com redução térmica extrema.</p>
                              </div>
                            </div>
                            <div className="p-1.5 bg-white/5 text-zinc-350 border border-[#444746] text-[10px] rounded-none text-center">
                              🎯 Leads qualificados automatizados e agendados no CRM do seu território.
                            </div>
                          </div>
                        )}

                        {/* Simulated audio-synthesis playback widget */}
                        {msg.role === 'ai' && audioEnabled && (
                          <div className="pt-2 border-t border-white/[0.03] flex flex-col gap-2 mt-2 font-mono">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Volume2 size={12} className="text-zinc-400" />
                                Canal: {voiceActor === 'wno_classic' ? 'Jarvis Grave' : voiceActor === 'wno_elite' ? 'Executivo Dinâmico' : voiceActor === 'caroline_premium' ? 'Caroline Sofizada' : 'Thiago Técnico'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isPlayingAudio && currentPlayingMsgId === msg.id) {
                                    setIsPlayingAudio(false);
                                    setCurrentPlayingMsgId(null);
                                  } else {
                                    setIsPlayingAudio(true);
                                    setCurrentPlayingMsgId(msg.id);
                                    setTimeout(() => {
                                      setIsPlayingAudio(false);
                                      setCurrentPlayingMsgId(null);
                                    }, 4000);
                                  }
                                }}
                                className="px-2 py-0.5 bg-white/[0.04] hover:bg-white/10 border border-[#444746] hover:border-white/15 rounded-none text-zinc-300 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                {isPlayingAudio && currentPlayingMsgId === msg.id ? (
                                  <>
                                    <Pause size={10} /> Pausar
                                  </>
                                ) : (
                                  <>
                                    <Play size={10} /> Ouvir Áudio
                                  </>
                                )}
                              </button>
                            </div>
                            
                            {isPlayingAudio && currentPlayingMsgId === msg.id && (
                              <div className="p-2 bg-[#131314]/40 border border-[#444746] rounded-none flex items-center justify-between gap-4 mt-1 font-mono text-[9px] animate-fade-in">
                                <span className="text-zinc-500">Reproduzindo Síntese de Voz...</span>
                                <div className="flex gap-0.5 items-end h-[12px] shrink-0">
                                  {[3, 6, 9, 12, 10, 8, 4, 7, 11, 6, 4, 8, 10, 5, 2].map((val, i) => (
                                    <div 
                                      key={i} 
                                      className="w-[1.5px] bg-white rounded-none" 
                                      style={{ 
                                        height: `${val}px`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Timestamp helper */}
                        {msg.role !== 'system' && (
                          <div className="text-right text-[9px] text-white/30 font-mono mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}

                      </div>
                    </div>
                  ))}

                  {/* Typing alert */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#202c33] border border-[#444746] rounded-none rounded-none p-3 text-xs text-[#e9edef] flex items-center gap-2">
                        <Loader2 className="animate-spin text-emerald-400 w-4 h-4" />
                        W-NO está operando a inteligência...
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Voice Simulation Wave Indicator */}
                {recordingStatus !== 'idle' && (
                  <div className="absolute bottom-16 left-4 right-4 bg-[#131314]/95 border border-emerald-500/30 p-3.5 flex items-center justify-between gap-4 animate-fade-in font-mono text-[10px] z-10 shadow-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-none bg-red-500 animate-ping"></span>
                      <span className="text-white uppercase font-black tracking-widest text-[9px]">
                        {recordingStatus === 'recording' ? '🎙️ CANAL DE VOZ WINF ESTABELECIDO...' : '🧠 LOG NEURAL (NLP TRANSCREVEDOR)...'}
                      </span>
                    </div>
                    {/* Bouncing spectrum bar */}
                    <div className="flex items-center gap-0.5 h-6">
                      {[1,3,2,1,3,2,1,3,2,1,2,3,2,1,2].map((h, i) => (
                        <div 
                          key={i} 
                          className="w-[1.5px] bg-white rounded-none transition-all duration-300" 
                          style={{ 
                            height: `${h * (recordingStatus === 'recording' ? 6 : 2)}px`
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }}
                  className="p-4 bg-[#1f2c34] flex items-center gap-3 border-t border-emerald-500/10 relative"
                >
                  <button 
                    type="button" 
                    title="Simular Mensagem de Voz para o W-NO (Jarvis Style)"
                    onClick={() => {
                      if (recordingStatus === 'idle') {
                        setRecordingStatus('recording');
                        const audioLogTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        setLogs(prev => [
                          { time: audioLogTime, action: `GRAVANDO: Capturando e processando comando de voz do Licenciado...`, type: 'info' },
                          ...prev
                        ]);
                        setTimeout(() => {
                          setRecordingStatus('processing');
                          setTimeout(() => {
                            setRecordingStatus('idle');
                            setInputText('W-NO, puxe os últimos leads capturados pela campanha nacional de tráfego pago da WINF.');
                          }, 1500);
                        }, 2500);
                      }
                    }}
                    className={`p-3 rounded-none text-white hover:scale-105 transition-transform shrink-0 cursor-pointer ${recordingStatus === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                  >
                    <Radio size={16} className={recordingStatus === 'recording' ? 'text-white' : 'text-zinc-400'} />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={recordingStatus === 'recording' ? "Escutando sua voz..." : "Envie uma instrução para W-NO ou use um dos botões rápidos no menu à esquerda..."}
                    disabled={recordingStatus === 'recording'}
                    className="flex-1 bg-[#2a3942] border border-transparent focus:border-emerald-500/30 text-white placeholder-white/30 text-xs py-3 px-4 rounded-none focus:outline-none transition-all disabled:opacity-50"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={isTyping || !inputText.trim() || recordingStatus === 'recording'}
                    className="p-3 bg-[#00a884] hover:bg-[#008f72] disabled:bg-zinc-800 disabled:text-zinc-600 rounded-none text-black hover:scale-105 transition-transform shrink-0 cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </form>

              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 3: SPEC SHEET / HARDWARE DADOS */}
        {activeTab === 'hardware' && (
          <motion.div 
            key="hardware"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Box (5 cols): Spec blueprint image (File 3 / Spec layout) */}
            <div className="lg:col-span-5 bg-[#131314] border border-[#444746] p-4 sm:p-5 rounded-none space-y-4">
              <h3 className="text-sm font-bold tracking-tight border-b border-[#444746] pb-3 flex items-center gap-2 uppercase font-mono text-zinc-300">
                <Cpu className="text-emerald-400 w-4 h-4 animate-pulse" /> INFOGRÁFICO DE SEGURANÇA W-NO™
              </h3>
              
              <div className="relative border border-[#444746] aspect-[3/4] overflow-hidden bg-[#131314] flex items-center justify-center">
                <img 
                  src="/input_file_3.png" 
                  alt="W-NO technical specifications" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-white/40 italic leading-relaxed text-center font-mono">
                Especificações de Blindagem do W-NO™: Revestimento de Fibra Térmica e Rosto Cerâmico Brilhante.
              </p>
            </div>

            {/* Right Box (7 cols): Inner Subtab Controller: Brain Orchestrator vs Specifications */}
            <div className="lg:col-span-7 bg-[#131314] border border-[#444746] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              
              <div>
                {/* Navigation inside Tab */}
                <div className="flex border-b border-[#444746] pb-4 mb-6">
                  <button
                    onClick={() => setSubTabMode('brain')}
                    className={`flex-1 pb-2 text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${subTabMode === 'brain' ? 'text-emerald-400 border-b-2 border-emerald-500 font-black' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <Zap size={12} /> WINF BRAIN™ COGNITIVE CORE
                  </button>
                  <button
                    onClick={() => setSubTabMode('hardware')}
                    className={`flex-1 pb-2 text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${subTabMode === 'hardware' ? 'text-emerald-400 border-b-2 border-emerald-500 font-black' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <Layers size={12} /> FISIOLOGIA CORPORAL W-NO™
                  </button>
                </div>

                {subTabMode === 'brain' ? (
                  /* SUBTAB 1: WINF BRAIN CENTRAL CORE */
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <span className="text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-none">
                        Inteligência WINF Centralizada
                      </span>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-2 leading-tight">Plataforma Unificada de Agentes</h3>
                      <p className="text-white/60 text-xs md:text-sm mt-2 leading-relaxed">
                        W-NO atua como o sistema nervoso central de seu licenciamento. Seu cérebro unifica o banco de dados do WINF OS, monitor de estoque, CRM ativo e faturamento em tempo real, permitindo controle absoluto por mensagens do WhatsApp.
                      </p>
                    </div>

                    {/* Automation Metrics Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#131314]/50 p-3 border border-[#444746] text-center rounded-none">
                        <span className="block text-[8px] text-zinc-500 font-mono uppercase mb-0.5">Faturamento Autônomo</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">R$ 42.800</span>
                      </div>
                      <div className="bg-[#131314]/50 p-3 border border-[#444746] text-center rounded-none">
                        <span className="block text-[8px] text-zinc-500 font-mono uppercase mb-0.5">Tempo Poupado</span>
                        <span className="text-xs font-bold text-white font-mono">34h / sem</span>
                      </div>
                      <div className="bg-[#131314]/50 p-3 border border-[#444746] text-center rounded-none">
                        <span className="block text-[8px] text-zinc-500 font-mono uppercase mb-0.5">Pedidos Blackshop</span>
                        <span className="text-xs font-bold text-purple-400 font-mono">14 Emitidos</span>
                      </div>
                    </div>

                    {/* Integrated Interactive Simulator Pipeline */}
                    <div className="bg-[#131314] p-5 border border-[#444746] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-2">
                        <span className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-none ${isSimActive ? 'bg-amber-500 animate-ping' : 'bg-white'}`}></span>
                          Simulador de Pipeline Dinâmico
                        </span>
                        <span className="text-[9px] text-zinc-300 font-mono">WINF Brain™ Orquestração</span>
                      </div>

                      {/* Select Sim Scenario */}
                      <div className="flex bg-[#0D0D0D] p-1 border border-[#444746] justify-between gap-1 overflow-x-auto">
                        <button
                          onClick={() => !isSimActive && setSimType('budget')}
                          disabled={isSimActive}
                          className={`flex-1 text-[9px] py-1.5 px-3 font-mono border ${simType === 'budget' ? 'bg-white/10 border-white/30 text-white' : 'border-transparent text-zinc-500 hover:text-white'} transition-all font-bold uppercase whitespace-nowrap`}
                        >
                          💸 Proposta PDF
                        </button>
                        <button
                          onClick={() => !isSimActive && setSimType('os_repasse')}
                          disabled={isSimActive}
                          className={`flex-1 text-[9px] py-1.5 px-3 font-mono border ${simType === 'os_repasse' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'border-transparent text-zinc-500 hover:text-white'} transition-all font-bold uppercase whitespace-nowrap`}
                        >
                          📅 O.S. & Agenda
                        </button>
                        <button
                          onClick={() => !isSimActive && setSimType('stock')}
                          disabled={isSimActive}
                          className={`flex-1 text-[9px] py-1.5 px-3 font-mono border ${simType === 'stock' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'border-transparent text-zinc-500 hover:text-white'} transition-all font-bold uppercase whitespace-nowrap`}
                        >
                          📦 Auto-Blackshop
                        </button>
                      </div>

                      {/* Pipeline steps visualizer */}
                      <div className="space-y-3 pt-1">
                        
                        {/* Step 1 */}
                        <div className={`p-2.5 border transition-all duration-300 rounded-none ${currentSimStep >= 0 ? 'border-[#444746] bg-white/[0.02]' : 'border-[#444746] opacity-50'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-zinc-500">Etapa 1: Entrada WhatsApp de Alto Padrão</span>
                            {currentSimStep > 0 ? (
                              <span className="text-[9px] font-mono font-black text-white">[✔ COMPLETO]</span>
                            ) : currentSimStep === 0 ? (
                              <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-600">[AQUISIÇÃO]</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-300 mt-0.5">
                            {simType === 'budget' && "Cliente Dra. Marina envia: 'Gostaria de blindar os 16m² da minha cobertura com Invisible®'" }
                            {simType === 'os_repasse' && "Mensagem de voz do franqueado: 'W-NO, agende Taycan para amanhã às 14h com Thiago'" }
                            {simType === 'stock' && "Monitor detecta nível crítico de películas de corte rolo de 15 metros no estoque local." }
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className={`p-2.5 border transition-all duration-300 rounded-none ${currentSimStep >= 1 ? 'border-white/25 bg-white/[0.03]' : 'border-[#444746] opacity-55'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Etapa 2: Cognição do WINF Brain™</span>
                            {currentSimStep > 1 ? (
                              <span className="text-[9px] font-mono font-black text-white">[✔ COMPLETO]</span>
                            ) : currentSimStep === 1 ? (
                              <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-600">[VERIFICANDO]</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-300 mt-0.5">
                            {simType === 'budget' && "Calculando área de perdas (Aproveitamento molecular zero desperdício) e aplicando markup de 10%." }
                            {simType === 'os_repasse' && "Buscando conflitos de rotas na agenda e verificando as competências técnicas do aplicador Thiago." }
                            {simType === 'stock' && "Pesquisando preços oficiais na central Blackshop e conferindo disponibilidades de estoque regionais." }
                          </p>
                        </div>

                        {/* Step 3 */}
                        <div className={`p-2.5 border transition-all duration-300 rounded-none ${currentSimStep >= 2 ? 'border-white/25 bg-white/[0.03]' : 'border-[#444746] opacity-55'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-zinc-500">Etapa 3: Integração & Ação de Backoffice</span>
                            {currentSimStep > 2 ? (
                              <span className="text-[9px] font-mono font-black text-white">[✔ INFRA OK]</span>
                            ) : currentSimStep === 2 ? (
                              <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-600">[AÇÃO SISTEMA]</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-300 mt-0.5">
                            {simType === 'budget' && "WINF OS: Geração do documento PDF da proposta timbrado corporativo e QR Code de Pix." }
                            {simType === 'os_repasse' && "Abertura direta de Ordem de Serviço vinculada ao Taycan, reserving o veículo no calendário." }
                            {simType === 'stock' && "Invocando Blackshop API e preparando ordem para despacho imediato da nova bobina mestre." }
                          </p>
                        </div>

                        {/* Step 4 */}
                        <div className={`p-2.5 border transition-all duration-300 rounded-none ${currentSimStep >= 3 ? 'border-white/30 bg-white/[0.05]' : 'border-[#444746] opacity-55'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-zinc-100 font-bold">Etapa 4: Entrega pelo WhatsApp do Licenciado</span>
                            {currentSimStep >= 4 ? (
                              <span className="text-[9px] font-mono font-black text-white flex items-center gap-1"><Check size={10} /> DISPARADO</span>
                            ) : currentSimStep === 3 ? (
                              <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-600">[DISPARO]</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-300 mt-0.5">
                            {simType === 'budget' && "Proposta enviada direto ao WhatsApp da Dra. Marina. Link oficial e fatura entregues com sucesso." }
                            {simType === 'os_repasse' && "Disparo automatizado de confirmação com roteiro de chegada enviado ao celular do aplicador e da Patrícia." }
                            {simType === 'stock' && "Mensagem enviada no WhatsApp comercial do franqueado: 'Bobina reservada e a caminho! Desconto faturado.'" }
                          </p>
                        </div>

                      </div>

                      {/* Launch Simulation Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => startUnifiedSimulation(simType)}
                          disabled={isSimActive}
                          className="w-full py-3 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isSimActive ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processando Inteligência Unificada...
                            </>
                          ) : (
                            <>
                              <Zap size={14} className="fill-current" /> Acionar Pipeline no WhatsApp Comercial
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* SUBTAB 2: HARDWARE/PHYSICAL SPEC SHEET */
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <span className="text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-widest bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-none">
                        Fisiologia Robô W-NO™
                      </span>
                      <h3 className="text-2xl font-bold tracking-tight text-white mt-2">Fórmula & Componentes de Blindagem</h3>
                      <p className="text-white/60 text-xs md:text-sm mt-2 leading-relaxed">
                        A identidade física tática de W-NO é modelada sobre a blindagem desenvolvida para resistir a altas temperaturas solar extremas e fornecer proteção térmica de ponta.
                      </p>
                    </div>

                    <div className="border-t border-[#444746] divide-y divide-[#444746]">
                      {specs.map((item, index) => (
                        <div key={index} className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-1 sm:gap-4">
                          <span className="text-white/40 font-mono uppercase">{item.label}</span>
                          <span className="text-white font-bold sm:text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {subTabMode === 'brain' && (
                <div className="p-4 bg-white/5 border border-[#444746] rounded-none text-xs text-zinc-300 space-y-1.5 font-mono mt-6">
                  <strong>💡 O Superpoder de 'Ser Tudo':</strong>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    Não há robôs isolados. Ao falar com WNO, o WINF Brain aciona em lote as APIs da Blackshop, as planilhas financeiras de repasse da matriz e monta as propostas de alto padrão em segundos.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: WHATSAPP INTEGRATION PROCESS */}
        {activeTab === 'integration' && (
          <motion.div 
            key="integration"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto bg-[#131314] border border-[#444746] p-6 sm:p-8 space-y-8"
          >
            <div className="text-center space-y-2">
              <Bot className="text-zinc-300 w-12 h-12 mx-auto animate-pulse" />
              <h3 className="text-2xl font-bold tracking-tight">Vincule W-NO ao WhatsApp dos Seus Licenciados</h3>
              <p className="text-sm text-white/40 max-w-lg mx-auto">
                Siga os passos simplificados para dar acesso e adicionar o Agente Inteligente W-NO para interagir de forma nativa com seus clientes e franqueados na sua conta WhatsApp Business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              <div className="p-5 bg-[#131314]/40 border border-[#444746] rounded-none text-center space-y-3">
                <span className="inline-flex w-7 h-7 bg-white/5 border border-[#444746] text-white font-bold rounded-none items-center justify-center text-xs font-mono">01</span>
                <h5 className="font-bold text-white text-sm">Escaneie o QR Code</h5>
                <p className="text-zinc-500 text-xs">Acesse as configurações do seu WhatsApp Business nos aparelhos conectados e escaneie o código mestre.</p>
              </div>

              <div className="p-5 bg-[#131314]/40 border border-[#444746] rounded-none text-center space-y-3">
                <span className="inline-flex w-7 h-7 bg-white/5 border border-[#444746] text-white font-bold rounded-none items-center justify-center text-xs font-mono">02</span>
                <h5 className="font-bold text-white text-sm">Adicione aos Grupos</h5>
                <p className="text-zinc-500 text-xs">Coloque W-NO nos grupos de WhatsApp com seus aplicadores ou grupo oficial da sua unidade para operação direta.</p>
              </div>

              <div className="p-5 bg-[#131314]/40 border border-[#444746] rounded-none text-center space-y-3">
                <span className="inline-flex w-7 h-7 bg-white/5 border border-[#444746] text-white font-bold rounded-none items-center justify-center text-xs font-mono">03</span>
                <h5 className="font-bold text-white text-sm">Comece a Operar!</h5>
                <p className="text-zinc-500 text-xs">Mande ordens como "@wno prepara orçamento Dr. André" ou "@wno sumariza as mensagens pendentes" diretamente nas conversas.</p>
              </div>

            </div>

            {/* Simulated QR connection box */}
            <div className="p-6 bg-[#131314] border border-[#444746] rounded-none flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-4 max-w-md">
                <div className="p-2.5 bg-zinc-900 border border-[#444746] rounded-none w-fit text-white font-mono text-[10px] font-bold">
                  AUTORIZADO CENTRAL WINF OS
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Pronto para Sincronizar?</h4>
                  <p className="text-xs text-white/50 leading-relaxed mt-1">
                    Cada licenciado tem direito a 1 linha integrada grátis no seu WhatsApp Business. O robô irá responder os clientes finais na ausência do atendimento humano e operar a O.S. via comando fechado do licenciado.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Status: Ativo
                  </span>
                  <span className="text-xs font-mono text-white/40">Último sincronismo: Agora</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-none flex flex-col items-center justify-center shrink-0 w-36 h-36 border border-emerald-500/20 shadow-xl">
                <QrCode className="text-black scale-150 rotate-90" size={50} />
                <span className="text-[9px] text-[#202c33] font-mono font-bold mt-4">LICENCIADO WINF ACTIVE</span>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 5: ADMIN CONFIGURATION PANEL */}
        {activeTab === 'admin' && (
          <motion.div 
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left side: Advanced instructions override */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#131314] border border-[#444746] p-6 space-y-4">
                <div className="border-b border-[#444746] pb-4">
                  <span className="text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-none">
                    PROMPT INTRÍNSECO DO WINF BRAIN™
                  </span>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white mt-1">Diretivas Sistemáticas do Agente</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                    Redefina o conjunto de regras fundamentais que moldam o comportamento, as especificações técnicas, e o linguajar do W-NO (Núcleo Operacional) em lotes.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Instruções de Personalidade (Prompt de Origem):</label>
                  <textarea
                    rows={12}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="w-full bg-[#131314] border border-[#444746] focus:border-emerald-500/30 text-white placeholder-white/20 text-xs p-3.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 rounded-none font-mono leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-zinc-950 border border-[#444746] text-[10px] text-zinc-500 font-mono leading-relaxed rounded-none flex items-start gap-2">
                  <Terminal size={12} className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                  <span>
                    Nota: O W-NO (Núcleo Operacional) interpretará este prompt como prioridade máxima durante as interações simuladas no Playground e transmissões do WhatsApp.
                  </span>
                </div>
              </div>

              {/* Voice presets and audio config */}
              <div className="bg-[#131314] border border-[#444746] p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-mono tracking-tight flex items-center gap-2">
                    <Radio size={14} className="text-emerald-400" /> SÍNTESE DE VOZ & SINAL SÔNICO
                  </h4>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">
                    Ajuste o canal de leitura e geração de áudios que o W-NO (Núcleo Operacional) utiliza comercialmente no WhatsApp para fechar parcerias de forma humanizada.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Feedback de Áudio Ativo:</label>
                    <div className="flex bg-[#131314] p-1 border border-[#444746] rounded-none">
                      <button
                        type="button"
                        onClick={() => setAudioEnabled(true)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase transition-all ${audioEnabled ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-white'}`}
                      >
                        Ativado
                      </button>
                      <button
                        type="button"
                        onClick={() => setAudioEnabled(false)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase transition-all ${!audioEnabled ? 'bg-zinc-800 border border-[#444746] text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                      >
                        Desativado
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Perfis de Atores de Voz:</label>
                    <select
                      value={voiceActor}
                      onChange={(e) => setVoiceActor(e.target.value)}
                      className="w-full bg-[#131314] border border-[#444746] focus:border-emerald-500/30 text-zinc-300 text-xs p-2 rounded-none focus:outline-none"
                    >
                      <option value="wno_classic">Mestre W-NO (Grave/Jarvis Style)</option>
                      <option value="wno_elite">W-NO Executive (Dinâmico/Corporativo)</option>
                      <option value="caroline_premium">Caroline Premium (Sofisticada/Consultora)</option>
                      <option value="thiago_tech">Thiago Técnico (Engenharia Aplicada)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Cognitive and distribution parameters */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#131314] border border-[#444746] p-6 space-y-6">
                <div className="border-b border-[#444746] pb-4">
                  <span className="text-white text-[9px] font-mono font-bold uppercase tracking-widest bg-white/10 border border-[#444746] px-2 py-0.5 rounded-none">
                    PARÂMETROS COGNITIVOS W-OS
                  </span>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white mt-1">Sintonizador Comercial</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                    Configure os pesos de temperatura e tons de conversão comercial empregados.
                  </p>
                </div>

                {/* Tone settings buttons */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Estilo de Abordagem do Agente:</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#131314] p-1 border border-[#444746] rounded-none">
                    <button
                      type="button"
                      onClick={() => setToneStyle('persuasive')}
                      className={`py-2 text-[9px] font-mono font-black uppercase transition-all rounded-none ${toneStyle === 'persuasive' ? 'bg-white/10 border border-white/35 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                    >
                      Persuasivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setToneStyle('technical')}
                      className={`py-2 text-[9px] font-mono font-black uppercase transition-all rounded-none ${toneStyle === 'technical' ? 'bg-white/10 border border-white/35 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                    >
                      Técnico Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => setToneStyle('friendly')}
                      className={`py-2 text-[9px] font-mono font-black uppercase transition-all rounded-none ${toneStyle === 'friendly' ? 'bg-white/10 border border-white/35 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                    >
                      Amigável
                    </button>
                  </div>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Temperatura (Criatividade):</label>
                    <span className="font-mono text-zinc-350 font-black text-xs">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-white bg-zinc-800 rounded-none h-1.5 appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                    <span>Determinista (Fiel)</span>
                    <span>Criativo (Solto)</span>
                  </div>
                </div>

                {/* Geo radius slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Raio Geográfico de Captação (Leads):</label>
                    <span className="font-mono text-teal-400 font-extrabold text-xs">{geoRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    value={geoRadius}
                    onChange={(e) => setGeoRadius(parseInt(e.target.value))}
                    className="w-full accent-teal-500 bg-zinc-800 rounded-none h-1.5 appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                    <span>Hiper-Local (20km)</span>
                    <span>Metropolitana (300km)</span>
                  </div>
                </div>
              </div>

              {/* Status metrics bar */}
              <div className="bg-[#131314] border border-[#444746] p-6 rounded-none space-y-4">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block border-b border-[#444746] pb-2">
                  MATRIZ DE INTELIGÊNCIA OPERACIONAL
                </span>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Modelo Cognitivo Ativo:</span>
                    <span className="text-white font-bold">W-CORE v2.0-ULTRA (Gemini Proxy)</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Latência de Disparo Local:</span>
                    <span className="text-zinc-300 font-bold">≤ 920ms</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Vulnerabilidade a Alucinação:</span>
                    <span className="text-zinc-300 font-bold">0.02% (Filtro Ativo)</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Sincronizador CRM:</span>
                    <span className="text-white font-bold">ONLINE</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#444746] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Modo Co-Piloto WhatsApp:</span>
                  <span className="px-2 py-0.5 bg-white/10 text-white rounded-none text-[10px] font-bold">
                    PRE-CONFIGURADO FRANCHISE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: GOVERNANÇA DE LASTRO & REGRAS DE OURO */}
        {activeTab === 'governanca' && (
          <motion.div 
            key="governanca"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header / Rules banner */}
            <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#444746] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-zinc-400 shrink-0" size={20} />
                  <span className="text-white text-[10px] uppercase font-mono tracking-widest bg-white/10 border border-[#444746] px-2 py-0.5 rounded-none">
                    Soberania Operacional
                  </span>
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-1">Córtex de Governança Logística e Financeira</h2>
                <p className="text-zinc-400 text-xs font-light max-w-2xl leading-relaxed">
                  Painel automatizado da inteligência W-NO™ para controle de lastro físico, arbitragem de frete interno e validação estrita das 5 Regras de Ouro WINF OS™.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#131314]/50 px-4 py-2 border border-[#444746] font-mono text-center shrink-0">
                <span className="text-zinc-500 font-bold uppercase text-[9px] block">Status de Auditoria:</span>
                <span className="text-white font-bold text-xs">BLINDAGEM ATIVA</span>
              </div>
            </div>

            {/* Quick telemetry cards (The 3 Approved Hubs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#131314] border border-[#444746] p-4.5 space-y-3 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-emerald-500/10 transition-colors duration-300">
                  <Activity size={48} />
                </div>
                <span className="text-[9px] font-mono text-zinc-300 font-bold uppercase tracking-widest block font-bold">HUB MASTER (PORT-MASTER)</span>
                <h3 className="text-lg font-bold text-white leading-none">SANTOS</h3>
                <div className="pt-2 flex justify-between items-baseline font-mono">
                  <span className="text-zinc-400 text-xs">Estoque de Lastro:</span>
                  <span className="text-2xl font-black text-white">{governanceHubs.SANTOS} <span className="text-xs text-zinc-500">m²</span></span>
                </div>
                <div className="text-[10px] text-zinc-500 border-t border-[#444746] pt-2 flex justify-between">
                  <span>Autoriza Importação: <strong className="text-emerald-400">SIM</strong></span>
                  <span>Emite NF-e: <strong className="text-emerald-400">SIM</strong></span>
                </div>
              </div>

              <div className="bg-[#131314] border border-[#444746] p-4.5 space-y-3 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-cyan-500/10 transition-colors duration-300">
                  <Activity size={48} />
                </div>
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest block font-bold">HUB DISTRIBUIÇÃO (INTERIOR)</span>
                <h3 className="text-lg font-bold text-white leading-none">SOROCABA</h3>
                <div className="pt-2 flex justify-between items-baseline font-mono">
                  <span className="text-zinc-400 text-xs">Estoque de Lastro:</span>
                  <span className="text-2xl font-black text-white">{governanceHubs.SOROCABA} <span className="text-xs text-zinc-500">m²</span></span>
                </div>
                <div className="text-[10px] text-zinc-500 border-t border-[#444746] pt-2 flex justify-between">
                  <span>Autoriza Importação: <strong className="text-red-400">NÃO</strong></span>
                  <span>Função: <strong className="text-zinc-400">OPERACIONAL</strong></span>
                </div>
              </div>

              <div className="bg-[#131314] border border-[#444746] p-4.5 space-y-3 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-purple-500/10 transition-colors duration-300">
                  <Activity size={48} />
                </div>
                <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest block font-bold">HUB DISTRIBUIÇÃO (CAPITAL)</span>
                <h3 className="text-lg font-bold text-white leading-none">SÃO PAULO</h3>
                <div className="pt-2 flex justify-between items-baseline font-mono">
                  <span className="text-zinc-400 text-xs">Estoque de Lastro:</span>
                  <span className="text-2xl font-black text-white">{governanceHubs.SAO_PAULO} <span className="text-xs text-zinc-500">m²</span></span>
                </div>
                <div className="text-[10px] text-zinc-500 border-t border-[#444746] pt-2 flex justify-between">
                  <span>Autoriza Importação: <strong className="text-red-400">NÃO</strong></span>
                  <span>Função: <strong className="text-zinc-400">OPERACIONAL</strong></span>
                </div>
              </div>
            </div>

            {/* Interactive Operations area & Sandbox Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Register Imports & Inter-hub transfers */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Rule 1 Simulator: Master Hub Import input */}
                <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                  <div className="border-b border-[#444746] pb-3">
                    <span className="text-white text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 border border-[#444746] px-2 py-0.5 rounded-none">
                      REGRA DE OURO 1
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase mt-1.5 flex items-center gap-2">
                      <Lock size={14} className="text-zinc-300" /> ENTRADA DE IMPORTAÇÃO (PORTO)
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Apenas Santos possui conformidade fiscal aduaneira para receber carga externa de película.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold">Selecionar Destinatário:</label>
                      <select 
                        value={importHub}
                        onChange={(e) => setImportHub(e.target.value)}
                        className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-emerald-500"
                      >
                        {obterHubsAtivosLogistica().map(hub => (
                          <option key={hub} value={hub}>
                            {hub === 'SANTOS' ? 'Porto de Santos [HUB MASTER]' : `${hub === 'SAO_PAULO' ? 'SÃO PAULO' : hub} [HUB DISTRIBUIÇÃO]`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold">M² de Película a Registrar:</label>
                      <input 
                        type="number"
                        value={importAmount}
                        onChange={(e) => setImportAmount(Number(e.target.value))}
                        className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={handleRegisterImport}
                      disabled={isImporting}
                      className="px-5 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider transition-colors rounded-none disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isImporting && <Loader2 className="animate-spin" size={14} />}
                      {isImporting ? 'REGISTRANDO...' : 'Registrar Entrada'}
                    </button>
                  </div>

                  {/* Feedback boxes */}
                  {importError && (
                    <div className="bg-red-950/40 border border-red-500/30 p-3 text-[11px] text-red-200 leading-relaxed font-sans text-left rounded-none">
                      <div className="flex gap-2 items-start">
                        <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block uppercase text-[10px] text-red-300 font-mono tracking-wider font-extrabold mb-0.5">Entrada Bloqueada pelo W-NO™:</strong>
                          {importError}
                        </div>
                      </div>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 text-[11px] text-emerald-200 leading-relaxed text-left rounded-none">
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 size={14} className="text-zinc-300 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block uppercase text-[10px] text-emerald-300 font-mono tracking-wider font-extrabold mb-0.5">Operação Autorizada:</strong>
                          {importSuccess}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rule 4 Simulator: Inter-hub transfers with frete calculo */}
                <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                  <div className="border-b border-[#444746] pb-3">
                    <span className="text-cyan-400 text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-none">
                      REGRA DE OURO 4 & TRIANGULAÇÃO
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase mt-1.5 flex items-center gap-2">
                      <Truck size={14} className="text-cyan-400" /> SATELLITE HUB TRANSFER (AUDITORIA DE FRETE)
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Toda transferência externa entre hubs triangulados desconta na hora o frete calculado por KM (R$ 0,85/KM).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold">Origem:</label>
                      <select 
                        value={transOrigem}
                        onChange={(e) => setTransOrigem(e.target.value)}
                        className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-cyan-500"
                      >
                        {obterHubsAtivosLogistica().map(hub => (
                          <option key={hub} value={hub}>{hub === 'SAO_PAULO' ? 'SÃO PAULO' : hub}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold">Destino:</label>
                      <select 
                        value={transDestino}
                        onChange={(e) => setTransDestino(e.target.value)}
                        className="w-full bg-[#131314] border border-white/15 text-white text-xs p-2 rounded-none focus:outline-none focus:border-cyan-500"
                      >
                        {obterHubsAtivosLogistica().map(hub => (
                          <option key={hub} value={hub}>{hub === 'SAO_PAULO' ? 'SÃO PAULO' : hub}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold">M² a Transferir:</label>
                      <input 
                        type="number"
                        value={transAmount}
                        onChange={(e) => setTransAmount(Number(e.target.value))}
                        className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Freight evaluation */}
                  <div className="bg-zinc-950 p-3.5 border border-[#444746] font-mono text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase text-[10px]">Distância Estimada:</span>
                      <span className="text-zinc-200 font-bold">{Math.round(calcularDistancia(transOrigem, transDestino))} KM</span>
                    </div>
                    <div className="flex justify-between border-t border-[#444746] pt-1.5">
                      <span className="text-zinc-350 uppercase text-[10px] font-bold">Custo de Frete Interno (R$ 0,85/KM):</span>
                      <span className="text-white font-bold">R$ {calcularFreteInterno(transOrigem, transDestino).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={handleHubTransfer}
                      disabled={isTransferring}
                      className="px-5 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-black uppercase tracking-wider transition-colors rounded-none disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isTransferring && <Loader2 className="animate-spin" size={14} />}
                      {isTransferring ? 'PROCESSANDO...' : 'Processar Transferência'}
                    </button>
                  </div>

                  {/* Feedback boxes */}
                  {transError && (
                    <div className="bg-red-950/40 border border-red-500/30 p-2 text-[11px] text-red-200 leading-relaxed font-sans text-left rounded-none">
                      {transError}
                    </div>
                  )}

                  {transSuccess && (
                    <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-200 leading-relaxed text-left rounded-none">
                      {transSuccess}
                    </div>
                  )}
                </div>

                {/* WINF OS™ // MÓDULO DE GESTÃO DE CATÁLOGO */}
                <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                  <div className="border-b border-[#444746] pb-3">
                    <span className="text-white text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 border border-[#444746] px-2 py-0.5 rounded-none">
                      WINF OS™ // MÓDULO DE GESTÃO DE CATÁLOGO
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase mt-1.5 flex items-center gap-2">
                      <Sparkles size={14} className="text-zinc-350" /> INTEGRAR PRODUTO NOVO AO CATÁLOGO
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      O W-NO™ registra o ativo na rede de forma imutável e o habilita instantaneamente para os 3 HUBs triangulados.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold text-[9px]">Nome do Ativo:</label>
                        <input 
                          type="text" 
                          value={newProdNome}
                          onChange={(e) => setNewProdNome(e.target.value)}
                          placeholder="Ex: Cerâmica Líquida Gold Edition"
                          className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-[#444746]0 font-sans"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold text-[9px]">Categoria do Ativo:</label>
                        <select 
                          value={newProdCat}
                          onChange={(e) => setNewProdCat(e.target.value)}
                          className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-[#444746]0"
                        >
                          <option value="PROTECAO_SUPERFICIE">PROTECAO_SUPERFICIE (PPF / Vitrificação)</option>
                          <option value="SERIE_CERAMICA">SERIE_CERAMICA (Rejeição Térmica Alta)</option>
                          <option value="NANOTECNOLOGICO">NANOTECNOLOGICO (Tecnologia Aeroespacial)</option>
                          <option value="ACESSORIO_ELITE">ACESSORIO_ELITE (Ferramentas WINF)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase font-extrabold text-[9px]">Especificações Técnicas / Nível de Blindagem:</label>
                      <input 
                        type="text" 
                        value={newProdEsp}
                        onChange={(e) => setNewProdEsp(e.target.value)}
                        placeholder="Ex: Alta resistência, 9H, proteção UV molecular 99.9%"
                        className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-[#444746]0 font-sans"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button 
                        onClick={handleCreateProduct}
                        className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider transition-colors rounded-none"
                      >
                        Integrar Ativo à Rede WINF
                      </button>
                    </div>

                    {catalogSuccess && (
                      <div className="bg-emerald-950/30 border border-[#444746] p-2.5 text-[11px] text-emerald-200 leading-relaxed text-left rounded-none">
                        {catalogSuccess}
                      </div>
                    )}
                  </div>

                  {/* Active Catalog visual summary */}
                  <div className="border-t border-[#444746] pt-3.5 mt-2 space-y-2 text-left">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block font-extrabold">Catálogo Ativo na Rede Ledger WINF (Triangulado)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                      <div className="p-2.5 bg-[#131314]/60 border border-[#444746] text-[11px] space-y-1">
                        <div className="flex justify-between font-mono text-[9px] text-zinc-300 font-bold">
                          <span>SERIE_PREMIUM</span>
                          <span>IMUTÁVEL</span>
                        </div>
                        <h5 className="font-bold text-white uppercase text-xs">Pelicula Invisible® Windshield 15m</h5>
                        <p className="text-zinc-500 text-[10px] leading-tight">Rejeição térmica extrema anti-UV molecular, certificada aeroespacial.</p>
                      </div>

                      <div className="p-2.5 bg-[#131314]/60 border border-[#444746] text-[11px] space-y-1">
                        <div className="flex justify-between font-mono text-[9px] text-zinc-300 font-bold">
                          <span>NANO_CERAMICA</span>
                          <span>IMUTÁVEL</span>
                        </div>
                        <h5 className="font-bold text-white uppercase text-xs">Pelicula Invisible® Carbon 30m</h5>
                        <p className="text-zinc-500 text-[10px] leading-tight">Giro rápido, queima balanceada para os 3 hubs em bobinas.</p>
                      </div>

                      {catalogProducts.map((prod, i) => (
                        <div key={prod.id || i} className="p-2.5 bg-gradient-to-br from-white/5 to-black border border-[#444746] text-[11px] space-y-1 animate-fade-in text-left">
                          <div className="flex justify-between font-mono text-[9px] text-zinc-300 font-bold">
                            <span>{prod.categoria}</span>
                            <span>{prod.id}</span>
                          </div>
                          <h5 className="font-black text-white uppercase text-xs">{prod.nome}</h5>
                          <p className="text-zinc-400 text-[10px] leading-tight">{prod.especificacao}</p>
                          <span className="text-[8px] font-mono text-zinc-600 uppercase block pt-0.5 border-t border-[#444746] font-bold">Status: {prod.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Right Column: Rule 3 & 5 Lastro enforcement & live terminal log */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Lastro Verification & Sale Simulator */}
                <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                  <div className="border-b border-[#444746] pb-3">
                    <span className="text-purple-400 text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded-none">
                      REGRAS DE OURO 3 & 5
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase mt-1.5 flex items-center gap-2">
                      <Shield size={14} className="text-purple-400" /> SIMULADOR DE VENDA REGIONAL (LASTRO GATE)
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Se uma unidade faturar acima de seu lastro físico imutável, o Córtex bloqueia a venda e notifica o fundador.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase block font-extrabold">Unidade do Franqueado:</label>
                      <select 
                        value={sellUnit}
                        onChange={(e) => setSellUnit(e.target.value)}
                        className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none"
                      >
                        <option value="CAMPINAS">Campinas SP (Exclusivo)</option>
                        <option value="SAO_BERNARDO">São Bernardo SP (Corta-Fogo)</option>
                        <option value="MIGUEL_PEREIRA">Miguel Pereira RJ (Território Limpo)</option>
                      </select>
                    </div>

                    <div className="bg-[#131314]/45 p-3.5 border border-[#444746] rounded-none flex justify-between items-center text-left">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-zinc-500 block">Lastro Ativo da Unidade:</span>
                        <span className="text-sm font-semibold text-zinc-300 font-mono">{sellUnit} (Franchise)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black font-mono text-white">{sellUnitBacking[sellUnit] || 0} m²</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase block font-extrabold font-extrabold">Metragem da Proposta (Venda):</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(Number(e.target.value))}
                          className="w-full bg-[#131314] border border-[#444746] text-white text-xs p-2 rounded-none focus:outline-none focus:border-purple-500 text-left font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-500">m²</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleUnitSale}
                      disabled={isSelling}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider transition-colors rounded-none mt-2 flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isSelling && <Loader2 className="animate-spin" size={14} />}
                      {isSelling ? 'PROCESSANDO...' : 'FATURAR VENDA (CHECAGEM W-NO™)'}
                    </button>
                  </div>

                  {/* Feedback boxes with the required safety alerts */}
                  {sellError && (
                    <div className="bg-red-950/40 border border-red-500/30 p-3.5 text-left space-y-2 text-xs rounded-none transition-all">
                      <div className="flex gap-2.5 items-start">
                        <AlertTriangle className="text-red-500 animate-bounce shrink-0 mt-0.5" size={16} />
                        <div className="space-y-1.5 text-left">
                          <span className="text-xs font-black text-red-300 uppercase block font-mono">OPERAÇÃO BLOQUEADA NA ORIGEM:</span>
                          <p className="text-red-100/90 text-[11px] leading-relaxed font-sans">{sellError}</p>
                          <div className="text-[10px] bg-red-500/10 border border-red-500/20 px-2 py-1 text-red-400 font-mono">
                            FOUNDER NOTIFIED DIRECTLY: windowfilm.contato@gmail.com
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {sellSuccess && (
                    <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 text-left space-y-1.5 text-xs rounded-none">
                      <div className="flex gap-2 items-start text-left">
                        <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-xs font-black text-emerald-300 uppercase block font-mono">MARGEM BLINDADA COM SUCESSO!</span>
                          <p className="text-emerald-100/90 text-[11px] font-sans">{sellSuccess}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Ledger logs terminal (radical transparency) */}
                <div className="bg-[#131314] border border-[#444746] p-4 space-y-3.5 text-left rounded-none">
                  <div className="flex justify-between items-center border-b border-[#444746] pb-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-extrabold">
                      <Terminal size={12} className="text-zinc-350 shrink-0" /> HISTÓRICO LEDGER DO CÓRTEX
                    </span>
                    <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase">WINF SECURE™</span>
                  </div>

                  <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1.5 custom-scrollbar font-mono text-[10px] leading-relaxed text-left">
                    {govLogs.map((log) => (
                      <div key={log.id} className="p-2 bg-zinc-950/50 border border-[#444746] space-y-1">
                        <div className="flex justify-between text-zinc-500">
                          <span>⏱️ {log.timestamp}</span>
                          <span className={`${log.type === 'error' ? 'text-red-400 font-bold' : log.type === 'success' ? 'text-emerald-400 font-black' : 'text-zinc-400'}`}>
                            [{log.hash}]
                          </span>
                        </div>
                        <p className={`text-left ${log.type === 'error' ? 'text-red-200' : log.type === 'success' ? 'text-zinc-200 font-semibold' : 'text-zinc-400'}`}>
                          {log.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB W-NO KNOWLEDGE CENTRAL INTELLIGENCE */}
        {activeTab === 'knowledge' && (
          <motion.div 
            key="knowledge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full text-white"
          >
            <ModuleWnoKnowledge />
          </motion.div>
        )}

      </AnimatePresence>
      
    </div>
  );
};
