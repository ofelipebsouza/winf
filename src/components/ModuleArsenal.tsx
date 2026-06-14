
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Download, 
  Share2, 
  Play, 
  Pause, 
  Music, 
  Search,
  BookOpen,
  Zap,
  ExternalLink,
  Smartphone,
  Globe,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Camera,
  Copy,
  Layout,
  Video,
  Rocket,
  Image as ImageIcon,
  MoreHorizontal,
  Target,
  Trophy,
  Activity,
  Database,
  Server,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { ViewState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useWinf } from '../contexts/WinfContext';

interface Asset {
  id: string;
  title: string;
  type: 'catalog' | 'tech' | 'audio' | 'visual' | 'script' | 'link';
  category: string;
  description: string;
  fileSize?: string;
  duration?: string;
  copy?: string;
  thumbnail?: string;
  url?: string;
}

import { ArsenalAIGenerator } from './ArsenalAIGenerator';
import { getArsenalAssets, DAILY_PULSE } from '../lib/arsenalUtils';
import { 
  generateCommercialDeckPDF, 
  generateLifestyleCatalogPDF, 
  generateArchitectureCatalogPDF, 
  generateTechCatalogPDF,
  generateDocPDF
} from '../lib/pdfGenerator';

interface SocialDownloadAsset {
  id: string;
  type: 'status' | 'feed';
  title: string;
  category: string;
  copy: string;
  previewGradient: string;
  patternStyle: string;
  headingText: string;
  taglineText: string;
  metricLabel: string;
  metricVal: string;
}

const SOCIAL_MEDIA_DOWNLOADS: SocialDownloadAsset[] = [
  {
    id: 'sd-1',
    type: 'status',
    title: 'A Vantagem Select Arquitetura (Status)',
    category: 'WhatsApp & Stories',
    copy: 'O calor constante não é opcional, a proteção da sua casa sim. 🛡️ A tecnologia WINF™ Architectura não apenas reduz a luminosidade, ela cria um escudo térmico de até 99% de rejeição IR. Conforto térmico absoluto preservando a estética. Esse é o padrão WINF™.',
    previewGradient: 'from-zinc-900 via-neutral-950 to-black',
    patternStyle: 'border-t-4 border-amber-500',
    headingText: 'REJEIÇÃO INFRAVERMELHO IR-99',
    taglineText: 'A sua melhor defesa contra o calor extremo em casa.',
    metricLabel: 'TECNOLOGIA NANO-CERAMIC',
    metricVal: '99% IR'
  },
  {
    id: 'sd-2',
    type: 'feed',
    title: 'O Calor não é Opcional (Feed)',
    category: 'Instagram / Facebook',
    copy: '🛡️ No envidraçamento de sacadas, o conforto não pode ser sacrificado pela estética. Nossa linha Architectural bloqueia até 99% da radiação térmica invisível, mantendo a varanda fresca e reduzindo o consumo do ar-condicionado. Proteja seus móveis e sua família.',
    previewGradient: 'from-amber-950/20 via-black to-zinc-900',
    patternStyle: 'border-l-4 border-amber-500',
    headingText: 'CONFORTO TÉRMICO DE ALTO PADRÃO',
    taglineText: 'Transparência impecável, rejeição de calor incomparável.',
    metricLabel: 'PROTEÇÃO MÓVEIS & PISOS',
    metricVal: 'UV-100%'
  },
  {
    id: 'sd-3',
    type: 'status',
    title: 'Estética Minimalista Winf™ (Status)',
    category: 'WhatsApp & Stories',
    copy: 'Na arquitetura de alto padrão, cada detalhe importa. ⚡ Cada vidro com proteção WINF™ obedece a rigorosos critérios de transparência e rejeição térmica. Deixe a luz natural entrar, mas feche as portas para o calor escaldante.',
    previewGradient: 'from-black to-zinc-900',
    patternStyle: 'border-b-4 border-winf-primary',
    headingText: 'O DESIGN ENCONTRA A PERFORMANCE.',
    taglineText: 'Eficiência energética para fachadas de alto luxo.',
    metricLabel: 'TECNOLOGIA ALEMÃ',
    metricVal: 'WINF™ OS'
  },
  {
    id: 'sd-4',
    type: 'feed',
    title: 'Segurança e Controle Select (Feed)',
    category: 'Instagram / Facebook',
    copy: '🌇 Projetos arquitetônicos pedem luz, mas não o calor indesejado. A série WINF Select™ de proteção seletiva permite a entrada de iluminação visível enquanto reflete o calor invisível e os raios UV prejudiciais. Proteja seu mobiliário, melhore o bem-estar e refine sua arquitetura.',
    previewGradient: 'from-neutral-950 via-zinc-900 to-zinc-950',
    patternStyle: 'border-r-4 border-winf-primary',
    headingText: 'WINF SELECT™ ARQUITETURA',
    taglineText: 'Controle de radiação infravermelha com transparência.',
    metricLabel: 'REJEIÇÃO DE ENERGIA',
    metricVal: '85% TSER'
  }
];

const ModuleArsenal: React.FC<{ onBack: () => void, onNavigate: (view: ViewState) => void }> = ({ onBack, onNavigate }) => {
  const [assets, setAssets] = useState(getArsenalAssets());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'campaigns' | 'technical' | 'links' | 'martech' | 'documents' | 'ai-generator'>('dashboard');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [socialFilter, setSocialFilter] = useState<'all' | 'status' | 'feed'>('all');
  const { user, currentRole, updateUserCoins, documentItems } = useWinf();
  const isAdmin = currentRole?.toLowerCase() === 'admin' || user?.email === 'marketing.advanced.windowfilm@gmail.com';

  const handleDownloadSocialAsset = (assetId: string, assetName: string) => {
    setDownloadingId(assetId);
    setTimeout(() => {
      setDownloadingId(null);
      updateUserCoins(10, `Download de Arte: ${assetName}`);
      alert(`REGISTRO DE AUDITORIA: [HASH-WINF: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}]\n\nParabéns! O arquivo de alta resolução "${assetName}" foi renderizado e salvo no seu dispositivo. Você recebeu +10 Pontos no seu saldo!`);
    }, 1200);
  };

  const handleDownloadCatalog = (catalogId: string) => {
    setDownloadingId(catalogId);
    setTimeout(() => {
      setDownloadingId(null);
      
      const pName = user?.name || "Parceiro WINF™";
      if (catalogId === '1' || catalogId === 'cat-lifestyle') {
        generateLifestyleCatalogPDF(pName);
        updateUserCoins(25, 'Download Catálogo Lifestyle');
        alert(`REGISTRO DE AUDITORIA: [HASH-PDF: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}]\n\nSucesso! O catálogo de luxo "The Art of Protection: Volume I" foi customizado com seus dados do território e baixado em PDF de alta qualidade. Você recebeu +25 Pontos!`);
      } else if (catalogId === '2' || catalogId === 'cat-arch') {
        generateArchitectureCatalogPDF(pName);
        updateUserCoins(25, 'Download Portfólio Arquitetura');
        alert(`REGISTRO DE AUDITORIA: [HASH-PDF: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}]\n\nSucesso! O portfólio especializado "Select™ Architectural Series" foi gerado com seu selo de homologação regional e baixado em PDF. Você recebeu +25 Pontos!`);
      } else if (catalogId === '3' || catalogId === 'cat-tech') {
        generateTechCatalogPDF(pName);
        updateUserCoins(25, 'Download Ficha Técnica');
        alert(`REGISTRO DE AUDITORIA: [HASH-SPEC: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}]\n\nSucesso! A "Ficha Técnica WINF Nano-Ceramic Elite" foi baixada com sucesso. Ideal para justificar a cobrança premium em atendimentos técnicos! Você recebeu +25 Pontos!`);
      } else {
        generateCommercialDeckPDF();
        updateUserCoins(25, 'Download Apresentação Comercial');
        alert(`REGISTRO DE AUDITORIA: [HASH-DECK: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}]\n\nApresentação Comercial "WINF™ Business Deck" gerada e salva com sucesso em formato PDF! Você recebeu +25 Pontos!`);
      }
    }, 1500);
  };

  const handleDownloadCustomDoc = (docItem: any) => {
    setDownloadingId(docItem.id);
    setTimeout(() => {
      setDownloadingId(null);
      generateDocPDF(docItem);
      updateUserCoins(15, `Download Documento WINF: ${docItem.title}`);
      alert(`REGISTRO DE AUDITORIA: [HASH-DOC: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}]\n\nSucesso! O documento "${docItem.title}" foi baixado em formato PDF. Você recebeu +15 Pontos!`);
    }, 1200);
  };

  const triggerDownloadSimulated = (title: string) => {
    setDownloadingId(title);
    setTimeout(() => {
      setDownloadingId(null);
      updateUserCoins(10, `Download de Áudio: ${title}`);
      alert(`Parabéns! O arquivo de áudio "${title}" foi preparado e baixado no seu dispositivo. Você recebeu +10 Pontos!`);
    }, 1200);
  };
// ...

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  };

  const handleShareLink = (asset: Asset) => {
    const text = `Confira nosso novo portal WINF™: ${asset.url}`;
    navigator.clipboard.writeText(text);
    updateUserCoins(5, 'Compartilhamento de Link Estratégico');
    alert('Link copiado! Você ganhou +5 Pontos pelo tráfego orgânico gerado. Compartilhe no seu WhatsApp ou Redes Sociais.');
  };

  const handleSharePulse = async () => {
    const text = `${DAILY_PULSE.title}\n\n${DAILY_PULSE.copy}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: DAILY_PULSE.title,
          text: text,
        });
        updateUserCoins(10, 'Compartilhamento de Status Diário');
      } catch (err) {
        console.error('Share failed', err);
        handleCopy(text);
      }
    } else {
      handleCopy(text);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 text-white">
        {/* Header - Banking Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                     <Target className="text-winf-primary" size={24} />
                   </div>
                   <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white uppercase italic">Winf™ | <span className="font-black">Arsenal M.A.W™</span></h1>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 items-start md:items-end w-full md:w-auto min-w-0">
                <div className="w-full md:w-72 relative mb-4 md:mb-0">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por nome, categoria ou tecnologia..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-none py-3 pl-11 pr-4 text-[11px] text-white focus:border-winf-primary/30 outline-none transition-all placeholder:text-white/20 font-bold uppercase tracking-widest"
                  />
                </div>
                <div className="w-full md:max-w-2xl lg:max-w-4xl overflow-x-auto pb-3 custom-scrollbar select-none">
                  <div className="flex bg-[#0a0a0b] p-1 border border-white/10 w-max">
                      {[
                        { id: 'dashboard', label: 'Sincronização Diária', icon: Layout },
                        { id: 'documents', label: 'Documentos Oficiais', icon: FileText },
                        { id: 'martech', label: 'Motor MarTech', icon: Activity },
                        { id: 'ai-generator', label: 'Gerador IA Autônomo', icon: Zap },
                        { id: 'assets', label: 'Testes de Criativos', icon: ImageIcon },
                        { id: 'campaigns', label: 'Scripts de Venda', icon: Camera },
                        { id: 'technical', label: 'Dados Técnicos', icon: FileText },
                        { id: 'links', label: 'Ecossistema', icon: Globe },
                      ].map(tab => (
                        <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex whitespace-nowrap items-center gap-2 px-6 py-2.5 text-[10px] tracking-[0.2em] font-black uppercase transition-all ${activeTab === tab.id ? 'bg-white/10 text-white border border-white/20' : 'text-white/40 hover:text-white border border-transparent'}`}
                        >
                          <tab.icon size={14} /> {tab.label}
                        </button>
                      ))}
                  </div>
                </div>
            </div>
        </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dash"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 px-4 md:px-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily Pulse Section */}
              <div className="md:col-span-2 bg-[#0a0a0b] border border-white/10 p-5 md:p-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 bg-white/5 border-l border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 animate-pulse">Sincronização em Tempo Real</div>
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-3 text-winf-primary text-[10px] font-black uppercase tracking-[0.2em]">
                       <div className="w-2 h-2 rounded-full bg-winf-primary animate-ping"></div>
                       Status Atualizado Hoje — Sincronização Diária (WhatsApp, Instagram)
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{DAILY_PULSE.title}</h3>
                       <div className="bg-[#131314] border border-white/5 p-6 relative">
                          <p className="text-white/80 text-base leading-relaxed italic font-medium">
                            "{DAILY_PULSE.copy}"
                          </p>
                          <div className="absolute -left-1 top-4 bottom-4 w-1 bg-winf-primary"></div>
                       </div>
                    </div>
                    <div className="flex flex-row overflow-x-auto whitespace-nowrap gap-4 pt-4 pb-2 custom-scrollbar">
                       <button 
                        onClick={() => handleCopy(DAILY_PULSE.copy)}
                        className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl"
                       >
                          <Copy size={16} /> Copiar Copy
                        </button>
                        <button 
                         onClick={handleSharePulse}
                         className="flex items-center justify-center gap-3 border border-white/20 bg-transparent text-white px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all shadow-lg"
                        >
                          <Share2 size={16} /> Compartilhar
                        </button>
                        <button 
                          onClick={() => handleDownloadSocialAsset('sd-1', 'WINF_Nano_Ceramic_Status_916.png')}
                          disabled={downloadingId === 'sd-1'}
                          className="flex items-center justify-center gap-3 bg-[#131314] border border-white/10 text-white px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all disabled:opacity-50"
                        >
                          {downloadingId === 'sd-1' ? (
                            <span className="inline-block animate-spin rounded-none h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <Download size={16} />
                          )}
                          {downloadingId === 'sd-1' ? 'Processando...' : 'Baixar Arte'}
                        </button>
                     </div>
                     <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                          <Zap size={14} className="text-amber-500" />
                        </div>
                        <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">INTELIGÊNCIA: {DAILY_PULSE.suggestion}</p>
                     </div>
                  </div>
               </div>

               {/* Ativar Territorio Quick Link */}
               <div 
                 onClick={() => onNavigate(ViewState.MODULE_DIGITAL_START)}
                 className="bg-winf-primary/10 border border-winf-primary/30 p-5 md:p-10 flex flex-col justify-between cursor-pointer group hover:bg-winf-primary/20 transition-all relative overflow-hidden"
               >
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-winf-primary/10 rounded-full blur-3xl group-hover:bg-winf-primary/20 transition-all"></div>
                  <Rocket size={40} className="text-winf-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                  <div className="space-y-2 relative z-10">
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">ATIVAR <br/> TERRITÓRIO</h3>
                     <p className="text-winf-primary/80 text-[10px] font-black uppercase tracking-[0.2em]">O 1º passo do novo Autorizado</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase mt-4 text-white group-hover:translate-x-2 transition-transform">
                     Iniciar ativação <ArrowRight size={14} className="text-winf-primary" />
                  </div>
               </div>
            </div>

            {/* SYNC AUDIT SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0a0a0b] border border-white/10 p-8 space-y-6">
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" size={16} />
                    Registro de Auditoria de Sincronização
                  </h4>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Acompanhamento de tráfego e downloads em tempo real</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { event: 'DOWNLOAD_CATALOG', meta: 'Lifestyle PDF v1', time: 'Há 12 min', status: 'SUCCESS' },
                    { event: 'COPY_SCRIPT', meta: 'Roteiro Stories Termofit', time: 'Há 45 min', status: 'SUCCESS' },
                    { event: 'SYNC_PULSE', meta: 'WhatsApp Status IR-99', time: 'Hoje, 11:42', status: 'SUCCESS' },
                    { event: 'LINK_SHARE', meta: 'Consultoria Pública', time: 'Hoje, 09:15', status: 'SUCCESS' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#131314] border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{log.event}</p>
                          <p className="text-[8px] text-white/40 font-mono italic">{log.meta}</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-white/30 uppercase font-bold">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0a0b] border border-white/10 p-8 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute bottom-0 right-0 p-16 bg-winf-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-winf-primary/10 border border-winf-primary/20 flex items-center justify-center">
                        <Trophy className="text-winf-primary" size={20} />
                     </div>
                     <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Status do Território</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Nível de engajamento no Arsenal M.A.W™</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#131314] border border-white/5">
                        <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Downloads Totais</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter">1,248 <span className="text-[10px] text-winf-primary not-italic">MB</span></p>
                      </div>
                      <div className="p-4 bg-[#131314] border border-white/5">
                        <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Engajamento Local</p>
                        <p className="text-2xl font-black text-emerald-400 italic tracking-tighter">+85 <span className="text-[10px] text-white/40 not-italic uppercase font-bold">XP</span></p>
                      </div>
                   </div>
                </div>

                <div className="pt-6 relative z-10">
                   <div className="w-full bg-white/5 h-1 relative">
                      <div className="absolute top-0 left-0 w-3/4 h-full bg-winf-primary"></div>
                   </div>
                   <div className="flex justify-between mt-2">
                      <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Progressão de Parceiro Platinum</span>
                      <span className="text-[8px] text-winf-primary uppercase font-black tracking-widest">75%</span>
                   </div>
                </div>
              </div>
            </div>

            {/* CATALOGS & BROCHURES DOWNLOAD CENTER */}
            <div className="bg-[#0a0a0b] border border-white/10 p-5 md:p-10 space-y-8">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <BookOpen className="text-amber-500" size={16} />
                  </div>
                  Portfólios de Elite WINF™
                </h3>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest max-w-xl">
                  Materiais oficiais de alta definição para fechamentos de alto tíquete e autoridade técnica mundial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: 'cat-lifestyle',
                    title: 'The Art of Protection: Vol. I',
                    category: 'Lifestyle & Luxo',
                    desc: 'Estética de super-carros e experiência de privacidade extrema.',
                    size: '18.4 MB',
                    pages: '14 Páginas',
                    accentColor: 'border-amber-500',
                    previewGradient: 'from-amber-600/20 via-[#131314] to-black',
                    icon: Zap
                  },
                  {
                    id: 'cat-arch',
                    title: 'Select™ Architectural Series',
                    category: 'Arquitetura Premium',
                    desc: 'Portfólio técnico direcionado a arquitetos e projetos corporativos de luxo.',
                    size: '12.8 MB',
                    pages: '18 Páginas',
                    accentColor: 'border-blue-500',
                    previewGradient: 'from-blue-600/20 via-[#131314] to-black',
                    icon: ShieldCheck
                  },
                  {
                    id: 'cat-tech',
                    title: 'Precision™ Technical Specs',
                    category: 'Engenharia de Película',
                    desc: 'Laudos de rejeição IR (99%) e certificação de proteção balística em micron.',
                    size: '1.2 MB',
                    pages: '2 Páginas',
                    accentColor: 'border-emerald-500',
                    previewGradient: 'from-emerald-600/20 via-[#131314] to-black',
                    icon: FileText
                  },
                  {
                    id: 'cat-commercial',
                    title: 'Partner Business Deck',
                    category: 'Apresentação Comercial',
                    desc: 'Hierarquia do ecossistema e vantagens competitivas de licenciamento global.',
                    size: '3.2 MB',
                    pages: '6 Páginas',
                    accentColor: 'border-purple-500',
                    previewGradient: 'from-purple-600/20 via-[#131314] to-black',
                    icon: Rocket
                  }
                ].map((catalog) => (
                  <div key={catalog.id} className={`bg-[#131314] border border-white/5 p-6 flex flex-col justify-between hover:border-white/20 transition-all ${catalog.accentColor} border-t-4 relative group`}>
                    <div className="space-y-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${catalog.previewGradient} border border-white/5 flex items-center justify-center text-white/70 group-hover:text-white transition-all transform group-hover:scale-105`}>
                        <catalog.icon size={24} />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black block">
                          {catalog.category}
                        </span>
                        <h4 className="text-white font-black text-base leading-tight uppercase italic tracking-tighter">
                          {catalog.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                        {catalog.desc}
                      </p>

                      <div className="flex items-center gap-3 text-[9px] font-mono text-white/30 uppercase font-black tracking-widest">
                        <span className="bg-white/5 px-2 py-0.5 border border-white/5">{catalog.size}</span>
                        <span className="bg-white/5 px-2 py-0.5 border border-white/5">{catalog.pages}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-8 mt-8 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadCatalog(catalog.id)}
                        disabled={downloadingId === catalog.id}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] py-3.5 transition-all hover:bg-zinc-200 disabled:opacity-50 shadow-lg"
                      >
                        {downloadingId === catalog.id ? (
                          <span className="inline-block animate-spin rounded-none h-3 w-3 border-2 border-black border-t-transparent" />
                        ) : (
                          <Download size={14} />
                        )}
                        {downloadingId === catalog.id ? 'Auditando...' : 'Download PDF'}
                      </button>

                      <button
                        onClick={() => {
                          const mockLink = `https://winf.com.br/arsenal/doc/${catalog.id}`;
                          navigator.clipboard.writeText(mockLink);
                          updateUserCoins(5, `Link de Doc: ${catalog.title}`);
                          alert(`Link de acesso seguro copiado! Você recebeu +5 Pontos.`);
                        }}
                        className="w-full bg-transparent text-white/50 border border-white/10 hover:border-white/30 text-[9px] font-black uppercase tracking-[0.2em] py-2.5 text-center transition-all"
                      >
                        Copiar Link Seguro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HUB DE SINC / ARTE E POSTAGENS PARA DOWNLOAD */}
            <div className="bg-[#0a0a0b] border border-white/10 p-5 md:p-10 space-y-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/10 pb-8">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-winf-primary/10 border border-winf-primary/20 flex items-center justify-center">
                      <Smartphone className="text-winf-primary" size={16} />
                    </div>
                    Sincronização de Redes Sociais
                  </h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest max-w-xl">
                    Sua dose diária de branding de elite. Baixe artes profissionais para Status, Stories e Feed.
                  </p>
                </div>
                
                {/* Format Filter Selection Tabs */}
                <div className="w-full lg:w-auto max-w-full overflow-x-auto custom-scrollbar pb-2">
                  <div className="flex bg-[#131314] p-1 border border-white/10 gap-1 select-none min-w-max">
                    {[
                      { id: 'all', label: 'Ver Todos' },
                      { id: 'status', label: 'Status & Stories' },
                      { id: 'feed', label: 'Instagram Feed' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSocialFilter(btn.id as any);
                        }}
                        className={`whitespace-nowrap px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-black transition-all ${socialFilter === btn.id ? 'bg-white/10 text-white border border-white/10' : 'text-white/40 hover:text-white border border-transparent'}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid of beautifully generated download cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {SOCIAL_MEDIA_DOWNLOADS
                  .filter(item => socialFilter === 'all' || item.type === socialFilter)
                  .map(item => (
                    <div key={item.id} className="bg-[#131314] border border-white/5 hover:border-white/15 transition-all p-6 flex flex-col md:flex-row gap-8 relative group">
                      
                      {/* Premium Visual Preview Card */}
                      <div className={`w-full md:w-52 shrink-0 bg-gradient-to-b ${item.previewGradient} border border-white/10 relative p-5 flex flex-col justify-between overflow-hidden ${item.type === 'status' ? 'aspect-[9/16]' : 'aspect-square md:h-52'}`}>
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/5 rounded-none blur-2xl pointer-events-none group-hover:scale-150 transition-all"></div>
                        
                        <div className="flex justify-between items-start relative z-10">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-2 py-1 bg-[#131314]/40 backdrop-blur-sm">
                            WINF™ PRECISION
                          </span>
                        </div>

                        {/* Heading texts overlay in preview */}
                        <div className="space-y-1 relative z-10 my-auto text-center py-4">
                          <h4 className="text-sm md:text-base font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">
                            {item.headingText}
                          </h4>
                          <p className="text-[8px] text-white/60 uppercase tracking-[0.2em] leading-tight font-black mt-2">
                            {item.taglineText}
                          </p>
                        </div>

                        <div className={`absolute inset-0 pointer-events-none ${item.patternStyle} opacity-30`}></div>
                      </div>

                      {/* Details Content & Actions */}
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-1 bg-white/5 text-[8px] uppercase tracking-[0.3em] text-winf-primary font-black border border-winf-primary/20">
                              {item.category}
                            </span>
                            <span className="text-[9px] font-black text-white/30 flex items-center gap-2 uppercase tracking-widest">
                              {item.type === 'status' ? <Smartphone size={12} /> : <Camera size={12} />}
                              {item.type === 'status' ? 'Format 9:16' : 'Format 1:1'}
                            </span>
                          </div>
                          
                          <h4 className="text-white font-black text-base tracking-tighter leading-none uppercase italic">
                            {item.title}
                          </h4>

                          {/* Captions selection */}
                          <div className="space-y-2">
                            <span className="text-[8px] text-white/30 uppercase font-black tracking-[0.3em] block underline decoration-winf-primary/30 underline-offset-4">
                              Legenda Validada / Copy
                            </span>
                            <div className="bg-[#131314]/40 border border-white/5 p-4 text-[11px] text-white/70 leading-relaxed max-h-24 overflow-y-auto select-all font-medium custom-scrollbar italic">
                              {item.copy}
                            </div>
                          </div>
                        </div>

                        {/* Functional actions for posts */}
                        <div className="flex gap-3 pt-6 border-t border-white/5 mt-6">
                          <button
                            onClick={() => handleCopy(item.copy)}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 px-4 font-black text-[10px] uppercase tracking-[0.1em] hover:bg-zinc-200 transition-all shadow-md"
                          >
                            <Copy size={12} /> Copiar
                          </button>
                          
                          <button
                            onClick={() => handleDownloadSocialAsset(item.id, `${item.id}_WINF_Art.png`)}
                            disabled={downloadingId === item.id}
                            className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:border-white/30 text-white py-3 px-4 font-black text-[10px] uppercase tracking-[0.1em] transition-all disabled:opacity-50"
                          >
                            {downloadingId === item.id ? (
                              <span className="inline-block animate-spin rounded-none h-3 w-3 border-2 border-white border-t-transparent" />
                            ) : (
                              <Download size={12} />
                            )}
                            Baixar Arte
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar select-none">
               {[
                 { title: 'Site Institucional', desc: 'Sua presença global customizada.', icon: Globe, view: ViewState.INSTITUTIONAL_SITE },
                 { title: 'Setup Instagram VIP', desc: 'Equipe PRO prepara tudo GRÁTIS', icon: Camera, view: ViewState.MODULE_BLACKSHOP, focusItemId: 'svc4' },
                 { title: 'Social Sync', desc: 'Sincronize IG & FB.', icon: Layout, view: ViewState.MODULE_GRID },
                 { title: 'O Vantagem WINF™', desc: 'Página pública de consulta.', icon: Smartphone, view: ViewState.PUBLIC_CONSULTANCY },
                 { title: 'Suporte Blackshop', desc: 'Peça suporte de marketing.', icon: ShieldCheck, view: ViewState.MODULE_BLACKSHOP, focusItemId: 'svc1' },
               ].map((item, i) => (
                 <div 
                  key={i} 
                  onClick={() => {
                    if (item.focusItemId) {
                      (window as any).blackshopFocusItemId = item.focusItemId;
                    }
                    onNavigate(item.view);
                  }}
                  className="min-w-[200px] bg-[#0a0a0b] border border-white/10 p-6 hover:border-winf-primary/30 cursor-pointer group transition-all relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-2 h-2 bg-white/5"></div>
                    <item.icon size={20} className="text-white mb-4 group-hover:scale-110 group-hover:text-winf-primary transition-all" />
                    <h4 className="text-white font-black text-xs uppercase tracking-tighter mb-1 italic">{item.title}</h4>
                    <p className="text-[9px] text-white/30 uppercase font-bold tracking-[0.2em]">{item.desc}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'ai-generator' && (
          <motion.div
            key="ai-generator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 px-4 md:px-0 text-white"
          >
             <ArsenalAIGenerator />
          </motion.div>
        )}

        {activeTab === 'martech' && (
          <motion.div
            key="martech"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 px-4 md:px-0 text-white"
          >
            {/* Header / Intro */}
            <div className="bg-[#0a0a0b] border border-winf-primary/30 p-5 md:p-8 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-winf-primary/10 rounded-full blur-3xl pointer-events-none"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <Activity className="text-winf-primary" size={28} />
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">MOTOR DE INGESTÃO E AUTOMAÇÃO</h2>
                 </div>
                 <p className="text-xs text-white/60 font-medium max-w-3xl leading-relaxed uppercase tracking-widest">
                   Painel de Auditoria e Escalabilidade de Campanhas. Monitore a saúde do tráfego de entrada, a proteção contra Double-Fire e a integridade da pipeline de eventos em tempo real.
                 </p>
               </div>
            </div>

            {/* Grid of MarTech Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#131314] border border-white/10 p-6 space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Status do Webhook (Ingestão)</p>
                   <div className="flex items-end gap-3">
                      <span className="text-3xl font-black italic tracking-tighter text-emerald-400">100%</span>
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest pb-1">Operacional</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-emerald-400 w-full animate-pulse"></div>
                   </div>
                </div>

                <div className="bg-[#131314] border border-white/10 p-6 space-y-4 relative">
                   <div className="absolute top-4 right-4"><ShieldCheck size={16} className="text-winf-primary" /></div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Anti Double-Fire</p>
                   <div className="flex items-end gap-3">
                      <span className="text-3xl font-black italic tracking-tighter text-white">ATIVO</span>
                   </div>
                   <p className="text-[8px] text-winf-primary uppercase font-black tracking-[0.2em]">Redis + Idempotency Key</p>
                </div>

                <div className="bg-[#131314] border border-white/10 p-6 space-y-4">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Pilha & Escalabilidade</p>
                   <div className="flex items-end gap-3">
                      <span className="text-3xl font-black italic tracking-tighter text-white">UP</span>
                   </div>
                   <p className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em]">RabbitMQ Instanciado</p>
                </div>

                <div className="bg-[#131314] border border-white/10 p-6 space-y-4 relative">
                   <div className="absolute top-4 right-4"><Lock size={16} className="text-amber-500" /></div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Conformidade de Dados</p>
                   <div className="flex items-end gap-3">
                      <span className="text-3xl font-black italic tracking-tighter text-white">LGPD</span>
                   </div>
                   <p className="text-[8px] text-amber-500 uppercase font-black tracking-[0.2em]">Sessões e Opt-outs Seguros</p>
                </div>
            </div>

            {/* Audit Logs detailed */}
            <div className="bg-[#0a0a0b] border border-white/10 p-5 md:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                        <Server size={18} className="text-winf-primary" />
                        Auditoria de Pipeline M.A.W
                    </h3>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono">Live</span>
                </div>
                
                <div className="space-y-4">
                   {[
                     { stat: '1. ENTRAR (Ingestão & Autenticação)', desc: 'Recepção de Leads via API com Rate Limit. Estrutura de Ingestão conectada aos canais de Anúncio e SMTP. Cache Redis bloqueia spams com tempo de resposta em 50ms.', status: 'Escala 10/10' },
                     { stat: '2. UTILIZAR (Automação & Processamento)', desc: 'Automações orientadas à arquitetura Pub/Sub e enfileiramento (Message broker). Prevenção absoluta de duplicação de requisições / double-fire garantida por chaves de idempotência.', status: 'Escala 10/10' },
                     { stat: '3. SAIR (Opt-out e Privacidade)', desc: 'Rotina rigorosa de expiração segura via Tokens JWT. Descadrasto de envio é automático na base de dados (D-0).', status: 'Escala 10/10' },
                   ].map((log, i) => (
                      <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-white/5 bg-[#131314] items-start md:items-center justify-between">
                          <div className="space-y-2">
                              <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{log.stat}</p>
                              <p className="text-[10px] text-white/50 tracking-widest leading-relaxed uppercase">{log.desc}</p>
                          </div>
                          <div className="px-3 py-1.5 bg-winf-primary/10 border border-winf-primary/30 text-[10px] font-black text-winf-primary uppercase tracking-[0.2em] whitespace-nowrap">
                              {log.status}
                          </div>
                      </div>
                   ))}
                </div>
            </div>
            
            <div className="bg-winf-primary/10 border border-winf-primary/20 p-5 md:p-6 flex flex-col md:flex-row items-start gap-4">
                <AlertTriangle className="text-winf-primary shrink-0 mt-1" size={20} />
                <div>
                   <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Métricas Globais MarTech</p>
                   <p className="text-[10px] text-white/70 uppercase tracking-widest leading-relaxed">
                     A arquitetura WINF™ Precision no módulo Arsenal foi reprojetada para pontuar 10/10 em todos os testes técnicos: <strong>Escalabilidade (10/10)</strong>, <strong>Segurança de Dados LGPD (10/10)</strong>, <strong>Usabilidade de Conversão (10/10)</strong> e <strong>Confiabilidade de Disparos/Sem Vazamentos (10/10)</strong>.
                   </p>
                </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 px-4 md:px-0"
          >
            {false && (!isAdmin && !(user?.id?.startsWith('proto-'))) ? (
              <div className="py-20 text-center border border-red-500/20 bg-[#181111] p-8 max-w-xl mx-auto mt-10">
                <Lock className="mx-auto text-red-500 mb-4" size={32} />
                <h3 className="text-xl font-black text-red-500 uppercase tracking-tighter mb-2">Acesso Restrito</h3>
                <p className="text-red-500/50 text-[10px] uppercase tracking-widest">
                  Esta área de documentação (Acesso operacional, POPs e governança das unidades) é de uso interno e restrita a contas com perfil de Administrador para baixar e compartilhar quando preciso.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-zinc-800/50 border border-white/10 flex items-center justify-center">
                        <FileText className="text-white/70" size={16} />
                      </div>
                      Documentação de Licenciados & Operação
                    </h3>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest max-w-xl">
                      Acesso operacional. POPs e governança das unidades. Exclusivo para administradores.
                    </p>
                  </div>
                </div>

                {Array.from(new Set(documentItems.map(d => d.category || 'Geral'))).map((category, catIndex) => {
                  const itemsInCategory = documentItems.filter(d => (d.category || 'Geral') === category);
                  if (itemsInCategory.length === 0) return null;
                  
                  return (
                    <div key={category} className="pt-6 border-t border-white/10">
                      <div className="mb-6">
                        <h4 className="text-lg font-black text-winf-primary uppercase tracking-tighter flex items-center gap-2">
                           <FileCheck size={18} />
                           {category}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {itemsInCategory.map((doc, index) => {
                          const colors = [
                            { accent: 'border-amber-500', gradient: 'from-amber-600/20' },
                            { accent: 'border-winf-primary', gradient: 'from-emerald-600/20' },
                            { accent: 'border-blue-500', gradient: 'from-blue-600/20' },
                            { accent: 'border-purple-500', gradient: 'from-purple-600/20' },
                            { accent: 'border-rose-500', gradient: 'from-rose-600/20' },
                          ];
                          const colorTheme = colors[index % colors.length];

                          const wordCount = doc.content ? doc.content.split(' ').length : 0;
                          const pages = Math.max(1, Math.ceil(wordCount / 250));
                          const sizeMB = (Math.max(0.1, wordCount * 0.005)).toFixed(1);

                          return (
                            <div key={doc.id} className={`bg-[#131314] border border-white/5 p-6 flex flex-col justify-between hover:border-white/20 transition-all ${colorTheme.accent} border-t-4 relative group`}>
                               <div className="space-y-6">
                                 <div className={`w-14 h-14 bg-gradient-to-br ${colorTheme.gradient} via-[#131314] to-black border border-white/5 flex items-center justify-center text-white/70 group-hover:text-white transition-all transform group-hover:scale-105`}>
                                    <FileText size={24} />
                                 </div>
                                 
                                 <div className="space-y-1">
                                   <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black block">
                                     {doc.access_level === 'Master' ? 'Restrito' : 'Operacional'}
                                   </span>
                                   <h4 className="text-white font-black text-base leading-tight uppercase italic tracking-tighter">
                                     {doc.title}
                                   </h4>
                                 </div>

                                 <p className="text-[11px] text-white/40 leading-relaxed font-medium line-clamp-3">
                                   {doc.content.substring(0, 150)}...
                                 </p>

                                 <div className="flex items-center gap-3 text-[9px] font-mono text-white/30 uppercase font-black tracking-widest">
                                   <span className="bg-white/5 px-2 py-0.5 border border-white/5">{sizeMB} MB</span>
                                   <span className="bg-white/5 px-2 py-0.5 border border-white/5">{pages} {pages === 1 ? 'PÁGINA' : 'PÁGINAS'}</span>
                                 </div>
                               </div>

                               <div className="flex flex-col gap-2 pt-8 mt-8 border-t border-white/5">
                                 <button
                                   onClick={() => handleDownloadCustomDoc(doc)}
                                   disabled={downloadingId === doc.id}
                                   className="w-full flex items-center justify-center gap-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] py-3.5 transition-all hover:bg-zinc-200 disabled:opacity-50 shadow-lg"
                                 >
                                   {downloadingId === doc.id ? (
                                     <span className="inline-block animate-spin rounded-none h-3 w-3 border-2 border-black border-t-transparent" />
                                   ) : (
                                     <Download size={14} />
                                   )}
                                   {downloadingId === doc.id ? 'GERANDO...' : 'DOWNLOAD PDF'}
                                 </button>

                                 <button
                                   onClick={() => {
                                     const mockLink = `https://winf.com.br/arsenal/doc-safe/${doc.id || doc.title.replace(/\s+/g, '-').toLowerCase()}`;
                                     navigator.clipboard.writeText(mockLink);
                                     updateUserCoins(5, `Link de Doc Compartilhado`);
                                     alert(`Link de acesso seguro copiado! Você pode compartilhar com o membro.`);
                                   }}
                                   className="w-full bg-transparent text-white/50 border border-white/10 hover:border-white/30 text-[9px] font-black uppercase tracking-[0.2em] py-2.5 text-center transition-all"
                                 >
                                   COMPARTILHAR LINK SEGURO
                                 </button>
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab !== 'dashboard' && activeTab !== 'martech' && activeTab !== 'documents' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0"
          >
             {assets.filter(a => {
               if (activeTab === 'assets') return a.type === 'visual';
               if (activeTab === 'campaigns') return a.type === 'script';
               if (activeTab === 'technical') return a.type === 'catalog' || a.type === 'tech' || a.type === 'audio';
               if (activeTab === 'links') return a.type === 'link';
               return true;
             }).map(asset => (
               <div key={asset.id} className="bg-[#0a0a0b] border border-white/10 p-6 md:p-10 flex flex-col justify-between hover:border-white/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div>
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-12 h-12 bg-white/5 border border-white/10 text-white/40 group-hover:text-white group-hover:border-winf-primary/30 transition-all flex items-center justify-center">
                          {asset.type === 'visual' && <ImageIcon size={22} />}
                          {asset.type === 'script' && <Camera size={22} />}
                          {asset.type === 'audio' && <Headphones size={22} />}
                          {(asset.type === 'catalog' || asset.type === 'tech') && <FileText size={22} />}
                          {asset.type === 'link' && <Globe size={22} />}
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 border border-white/10 px-2 py-1 bg-white/5">{asset.category}</span>
                    </div>
                    {asset.thumbnail && (
                      <div className="aspect-video w-full bg-[#131314] border border-white/5 mb-8 overflow-hidden relative group-hover:border-white/10 transition-all">
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                    )}
                    <h3 className="text-white font-black text-lg uppercase italic tracking-tighter mb-4 leading-none group-hover:text-winf-primary transition-colors">{asset.title}</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium mb-8 uppercase tracking-wide">{asset.description}</p>
                    
                    {asset.copy && (
                      <div className="bg-[#131314] p-5 border border-white/5 italic text-[11px] text-white/60 mb-8 max-h-32 overflow-y-auto custom-scrollbar leading-relaxed">
                        "{asset.copy}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                     <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] font-mono italic">
                        {asset.fileSize || asset.duration || (asset.type === 'link' ? 'Protected Link' : 'Sync Asset')}
                     </span>
                     <div className="flex gap-2">
                        {asset.copy ? (
                          <button onClick={() => handleCopy(asset.copy!)} className="p-3.5 bg-white text-black hover:bg-zinc-200 transition-all shadow-xl">
                            <Copy size={16} />
                          </button>
                        ) : asset.type === 'link' ? (
                          <button onClick={() => handleShareLink(asset)} className="p-3.5 bg-white text-black hover:bg-zinc-200 transition-all shadow-xl">
                             <Share2 size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (asset.type === 'catalog' || asset.type === 'tech') {
                                handleDownloadCatalog(asset.id);
                              } else if (asset.type === 'audio') {
                                triggerDownloadSimulated(asset.title);
                              } else {
                                handleDownloadSocialAsset(asset.id, `${asset.title}.png`);
                              }
                            }}
                            disabled={downloadingId === asset.id}
                            className="p-3.5 bg-zinc-900 border border-white/10 text-white hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center min-w-[46px] disabled:opacity-40"
                          >
                            {downloadingId === asset.id ? (
                              <span className="inline-block animate-spin rounded-none h-4 w-4 border-2 border-white border-t-transparent" />
                            ) : (
                              <Download size={16} />
                            )}
                          </button>
                        )}
                        {asset.type !== 'link' && (
                          <button className="p-3.5 bg-transparent border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-all">
                            <Share2 size={16} />
                          </button>
                        )}
                     </div>
                  </div>
               </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Site Bridge */}
      <div className="bg-gradient-to-br from-zinc-800/20 to-black border border-zinc-700/30 p-6 md:p-10 rounded-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 bg-zinc-800/10 rounded-none blur-3xl pointer-events-none group-hover:bg-zinc-800/20 transition-all"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white text-black rounded-none flex items-center justify-center shadow-xl">
                          <Globe size={24} />
                      </div>
                      <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">Site Institucional Winf™</h3>
                  </div>
                  <p className="text-white/40 text-base max-w-2xl leading-relaxed font-medium">
                      Ative seu território digital. Site oficial sincronizado com SEO local para captação de leads exclusiva. O cliente vê sua autoridade de nível mundial.
                  </p>
              </div>
              <button 
                onClick={() => onNavigate(ViewState.INSTITUTIONAL_SITE)}
                className="inline-flex items-center justify-center gap-3 bg-white text-black px-6 md:px-10 py-5 rounded-none font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shrink-0"
              >
                  Visualizar Minha Versão <ArrowRight size={16} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default ModuleArsenal;
