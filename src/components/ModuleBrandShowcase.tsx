import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Play, Maximize, Droplets, Sun, Activity, Zap, Shield, Sparkles, Navigation, Check, Package, Eye, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface ModuleBrandShowcaseProps {
  onBack: () => void;
  onNavigate?: (view: ViewState) => void;
}

const PRODUCTS = [
  {
    id: 'invisible',
    name: 'Winf Select™ Invisible',
    subtitle: 'O Poder Que Você Não Vê, Mas Sente.',
    description: 'Aeronáutica e Nanocerâmica fundidas. Transparência cristalina com bloqueio térmico absoluto. A visão pura do alto luxo.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2400',
    color: '#ffffff',
    glowColor: 'rgba(255,255,255,0.3)',
    stats: [
      { label: 'Visibilidade', value: '70% / 80%' },
      { label: 'Rejeição IR', value: 'Até 86%' },
      { label: 'Garantia', value: '10 Anos' }
    ],
    icon: Sparkles
  },
  {
    id: 'dualreflect',
    name: 'Winf Select™ Dual Reflect',
    subtitle: 'O Equilíbrio Perfeito entre Luz e Sombras.',
    description: 'Arquitetura envidraçada de alto padrão. Reflexão espelhada calibrada com máxima rejeição térmica e privacidade diurna.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400',
    color: '#00FFFF',
    glowColor: 'rgba(0, 255, 255, 0.4)',
    stats: [
      { label: 'Rejeição Térmica', value: 'Até 81%' },
      { label: 'Linhas', value: 'DR15 / DR35' },
      { label: 'Acabamento', value: 'Espelhado' }
    ],
    icon: Zap
  },
  {
    id: 'blackpro',
    name: 'Winf Select™ BlackPro',
    subtitle: 'Privacidade Absoluta. Proteção Impenetrável.',
    description: 'Desenvolvido para máxima absorção térmica. Nanotecnologia com polissacarídeos escuros para a estética mais agressiva e luxuosa.',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2400',
    color: '#00FF00',
    glowColor: 'rgba(0, 255, 0, 0.4)',
    stats: [
      { label: 'Rejeição UV', value: '99%' },
      { label: 'Privacidade', value: 'Extrema' },
      { label: 'Linhas', value: 'B5 / B20' }
    ],
    icon: Shield
  },
  {
    id: 'seguranca',
    name: 'Winf Select™ Segurança',
    subtitle: 'Proteção Anti-Vandalismo e Impacto.',
    description: 'Camadas espessas de poliéster de altíssima tensão projetadas para absorver impactos e manter vidros estilhaçados em seus aros. Blindagem invisível de alto calibre.',
    image: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2400',
    color: '#FFCC00',
    glowColor: 'rgba(255, 204, 0, 0.4)',
    stats: [
      { label: 'Espessura', value: '4 Mil a 8 Mil' },
      { label: 'Proteção UV', value: '99%' },
      { label: 'Resistência', value: 'Extrema' }
    ],
    icon: Shield
  },
  {
    id: 'white',
    name: 'Winf Select™ White',
    subtitle: 'Luminosidade Total. Calor Zero.',
    description: 'Estética minimalista para projetos que exigem fachadas translúcidas com alta incidência de luz natural e rejeição térmica avançada.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2400',
    color: '#E0E0E0',
    glowColor: 'rgba(224, 224, 224, 0.6)',
    stats: [
      { label: 'Luminosidade', value: 'Máxima' },
      { label: 'Rejeição IR', value: 'Até 90%' },
      { label: 'Corrente', value: 'Clear' }
    ],
    icon: Sun
  },
  {
    id: 'aerocore',
    name: 'AeroCore™',
    subtitle: 'Nascida em Laboratório. Feita para Dominar.',
    description: 'Alta tecnologia aeroespacial para performance incomparável. Nanocerâmica criptográfica para regulação térmica extrema no seu veículo, iate ou jato.',
    image: 'https://images.unsplash.com/photo-1543226862-39202f29696f?auto=format&fit=crop&q=80&w=2400',
    color: '#0066FF',
    glowColor: 'rgba(0, 102, 255, 0.5)',
    stats: [
      { label: 'Performance', value: 'Militar' },
      { label: 'Espectro', value: 'Amplo Controle' },
      { label: 'Privacidade', value: 'Criptográfica' }
    ],
    icon: Navigation
  },
  {
    id: 'neoskin',
    name: 'NeoX / NeoSkin™ Brutal',
    subtitle: 'A Barreira de Sacrifício Hiper-Resistente.',
    description: 'A armadura tática (PPF) construída para resistir além dos limites. Tecnologia de sacrifício contra ambientes apocalípticos e terrenos extremos.',
    image: 'https://images.unsplash.com/photo-1506544777-62cd39efbf82?q=80&w=2670&auto=format&fit=crop',
    color: '#E33B0E',
    glowColor: 'rgba(227, 59, 14, 0.4)',
    stats: [
      { label: 'Microns', value: '150 a 800' },
      { label: 'Auto-Cura', value: 'Térmica' },
      { label: 'Proteção', value: 'Ambiental' }
    ],
    icon: Shield
  }
];

const PRODUCT_SALES_INFO: Record<string, {
  highlight: string;
  narrative: string;
  longDescription: string;
  packagingDetails: string[];
  techDetails: { label: string; value: string }[];
  productRollImg: string;
  externalViewImg: string;
  internalViewImg: string;
  externalViewDesc: string;
  internalViewDesc: string;
}> = {
  invisible: {
    highlight: "SÉRIE EXTRA PREMIUM INVISÍVEL",
    narrative: "O Poder Que Você Não Vê, Mas Sente — Quiet Luxury Absoluto.",
    longDescription: "Projetada pioneiramente com tecnologia aeroespacial para aeronaves de grande altitude, a série Invisible funde nanocerâmica cristalina purificada e blindores moleculares. Ela preserva integralmente a fachada do imóvel e o visual de fábrica do seu automóvel de luxo. Por trás dessa invisibilidade estética, repousa uma barreira inabalável dotada de altíssima rejeição térmica, criando ambientes de frescor contínuo com zero alteração na luminosidade natural. A escolha pura de arquitetos minimalistas, prédios históricos e proprietários que buscam luxo tecnológico discreto e sofisticado.",
    packagingDetails: [
      "1x Bobina Winf Select™ Invisible original lacrada de fábrica",
      "Selo holográfico com sensor óptico e registro exclusivo SINF-Chain",
      "Lacre protetor de metal escovado WINF Blackbox original",
      "Certificado físico de garantia certificada de 10 anos contra desbotamentos"
    ],
    techDetails: [
      { label: "Visibilidade / VLT", value: "70% a 80% (Transparência de Cristal Puro)" },
      { label: "Rejeição de Infravermelho (IR)", value: "Até 86% real contínuo" },
      { label: "Bloqueio Ultravioleta (UV)", value: "99.9% de proteção em nível dermatológico" },
      { label: "Interferência de Sinais", value: "0.0% (Totalmente compatível com GPS, 5G e Rádios)" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Fachada mantendo design original sem alteração de tonalidade com bloqueio térmico insuperável.",
    internalViewDesc: "Vista interna cristalina e livre de ofuscamento solar, preservando a luz e eliminando o calor."
  },
  dualreflect: {
    highlight: "SÉRIE ESPELHADA ARQUITETÔNICA",
    narrative: "Privacidade Diurna Soberana e Rejeição Solar Extrema.",
    longDescription: "O equilíbrio definitivo entre luz, privacidade e proteção climática. A série Dual Reflect possui dupla camada refletiva otimizada: alta refletividade externa para máxima rejeição de calor e privacidade superior sob a luz solar, aliada a uma baixíssima refletividade interna para que a visibilidade de dentro para fora durante a noite continue límpida e natural, sem o incômodo efeito 'espelho interno'. Uma engenharia de vanguarda projetada para fachadas envidraçadas e residências de luxo expostas ao sol intenso das praias e grandes metrópoles.",
    packagingDetails: [
      "1x Bobina Winf Select™ Dual Reflect original certificada",
      "Holograma de autenticidade SINF-Chain integrado à bobina",
      "Embalagem rígida especial anti-esmagamento com protetores nas bordas",
      "Guia completo de manutenção periódica e pós-instalação"
    ],
    techDetails: [
      { label: "Energia Solar Rejeitada", value: "Até 81% de energia térmica total" },
      { label: "Redução de Ofuscamento", value: "Até 85% do clarão solar incômodo" },
      { label: "Níveis Disponíveis", value: "DR15 (Escura) / DR35 (Média-Clara)" },
      { label: "Composição Química", value: "Sputtering de metais nobres estabilizados por vácuo" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Visual externo perfeitamente reflexivo refletindo o céu, garantindo privacidade extrema de dia.",
    internalViewDesc: "Sem espelhado reverso interno. Perfeito controle dinâmico de luz com transparência natural."
  },
  blackpro: {
    highlight: "SÉRIE PRIVACIDADE ABSOLUTA",
    narrative: "Escuridão Profunda Impenetrável e Absorção Térmica Híbrida.",
    longDescription: "A tonalidade escura mais densa e sofisticada disponível no mercado global de vidros. Desenvolvida à base de nanopartículas híbridas de polissacarídeos e cerâmica escura, a série BlackPro atinge privacidade total para o interior, mantendo o visual limpo sem o aspecto espelhado ou metálico. Ela filtra de forma impecável o brilho e confere um visual contemporâneo, arrojado e imponente. Ideal para veículos presidenciais, salas VIP e proprietários que guardam segredo absoluto sobre o seu espaço privado com conforto térmico sem precedentes.",
    packagingDetails: [
      "1x Bobina Winf Select™ BlackPro em cilindro protetor tático",
      "Adesivo holográfico antifraude gravado a laser",
      "Manual de manutenção pós-aplicação exclusivo",
      "Garantia premium ativa de 10 anos contra bolhas e perda de cor"
    ],
    techDetails: [
      { label: "Transmissão Luminosa", value: "Disponível em B5 (super escura) e B20 (média)" },
      { label: "Rejeição de Raios UV", value: "99.9% de proteção contínua" },
      { label: "Estética Visual", value: "Acabamento preto carvão puro sem reflexão metálica" },
      { label: "Proteção de Painéis", value: "Preserva couros, acabamentos e telas do sol" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Aspecto externo profundamente negro e sofisticado. Privacidade absoluta de nível executivo.",
    internalViewDesc: "Luminosidade ideal de dentro para fora, minimizando a fadiga ocular mesmo sob sol forte."
  },
  seguranca: {
    highlight: "SÉRIE BLINDAGEM DE IMPACTO",
    narrative: "Absorção de Impactos Severos com Discrição Absoluta.",
    longDescription: "Proteger o que é insubstituível. A série de Segurança Winf Select funde camadas de poliéster de altíssima tensão estrutural com um adesivo sensível a pressões mecânicas extremas. Caso ocorra vandalismo, tentativas de invasão com marretas ou desastres térmicos atmosféricos, a película dissipa a força do impacto e mantém os estilhaços de vidro colados à moldura, atrasando significativamente ou impedindo invasões físicas. Uma blindagem transparente de altíssimo desempenho para frotas executivas e fachadas residenciais ou corporativas de prestígio.",
    packagingDetails: [
      "1x Bobina Winf Select™ Segurança (High Tension)",
      "Selo SINF-Chain de homologação mecânica rastreável",
      "Embalagem reforçada de calibre industrial de alta resistência",
      "Certificado oficial de Blindagem Antiestilhaço com selagem holográfica"
    ],
    techDetails: [
      { label: "Espessura de Película", value: "4 Mil a 8 Mil mícrons (calibrados para alta tração)" },
      { label: "Força de Ruptura Mecânica", value: "Até 120 libras por polegada linear" },
      { label: "Luminosidade", value: "Absolutamente translúcido, 100% invisível ao público" },
      { label: "Retardo de Invasão", value: "Bloqueio por tempo estendido de arrombamentos" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Proteção contra impactos severos. Vidro que não estilhaça sob vandalismo ou incidentes.",
    internalViewDesc: "Segurança de alto calibre totalmente integrada sem obstruir a paisagem ou a estética interna."
  },
  white: {
    highlight: "SÉRIE MINIMALISTA TRANSLÚCIDA",
    narrative: "Luminosidade Total com Rejeição Avançada na Faixa de Calor.",
    longDescription: "A fusão perfeita da luz abundante escandinava com o frescor térmico. Desenvolvida para projetos de vanguarda que prezam pela integração de ambientes externos repletos de luz visível natural, mas recusam as altas temperaturas. A série White utiliza frações microscópicas de cerâmica branca purificada para desviar com precisão os comprimentos de onda de infravermelho (calor), de modo a permitir que o dia ilumine seu escritório ou residência de modo revigorante e arejado.",
    packagingDetails: [
      "1x Bobina Winf Select™ White Premium",
      "Selador original holográfico com hash único de lote",
      "Capa protetora térmica para rolos de alta performance",
      "Garantia oficial de 10 anos contra amarelamento"
    ],
    techDetails: [
      { label: "Transmissão de Luz", value: "Permite até 90% da luz solar visível" },
      { label: "Rejeição de Infravermelho", value: "Até 90% real (desmenpenho avançado)" },
      { label: "Filtro Ultravioleta", value: "Bloqueio de 99% (evita desbotamento de pisos de madeira)" },
      { label: "Textura Visual", value: "Ultra transparente com brilho reflexivo frio de alta costura" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Atmosfera externa translúcida de puro requinte e equilíbrio estético minimalista.",
    internalViewDesc: "Luz suave difusa e acolhedora com conforto acústico e térmico otimizados."
  },
  aerocore: {
    highlight: "SÉRIE MILITAR PREMIUM",
    narrative: "Armadura de Conforto Térmico Máximo Sob Condições Clínicas.",
    longDescription: "Concebida originalmente para proteger painéis digitais, aviônicos de aviação de luxo, superiates oceânicos e superfícies táticas expostas ao sol impiedoso de águas abertas ou alta atmosfera. A AeroCore™ traz nanocerâmica criptográfica de espectro amplo. Ela atua repelindo os comprimentos de onda invisíveis de maior densidade energética de maneira quase instantânea, garantindo conforto climático absoluto, mesmo sob variações severas de umidade e radiação interestelar.",
    packagingDetails: [
      "1x Bobina Winf AeroCore™ Original de Cabine",
      "Envelope de segurança blindado antifraude de alumínio anodizado",
      "Certificado físico criptografado com código QR de validação",
      "Chave digital SINF-Chain VIP Concierge ativa automática"
    ],
    techDetails: [
      { label: "Nível de Desempenho", value: "Certificação de Nível Aeroespacial e Marítimo" },
      { label: "Estabilização Térmica", value: "Proteção extrema em variações de -30°C até +80°C" },
      { label: "Controle Multiespectral", value: "Refração ativa de ondas infravermelhas e calor imediata" },
      { label: "Garantia Oficial", value: "Vitalícia limitada com suporte concierge tático total" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1605281317010-fe5fed93a444?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Visual externo aplicado em alta náutica e frotas especiais de alta cilindrada.",
    internalViewDesc: "Interior de cockpit e cabines climatizados à perfeição sob qualquer estresse atmosférico."
  },
  neoskin: {
    highlight: "SÉRIE PROTEÇÃO DE DESIGN (PPF)",
    narrative: "Armadura Tática Auto-Regenerável para Superfícies de Luxo.",
    longDescription: "A fusão perfeita de barreira mecânica e estética intocável. O NeoSkin™ Brutal é uma armadura transparente baseada em poliuretano termoplástico (TPU) de altíssima densidade molecular, desenhada para absorver a pancada física de detritos de estradas, arranhões, chuva ácida, insetos de estrada e fezes de aves. Dotada da tecnologia Self-Healing, sob exposição solar moderada ou água morna, pequenos riscos e marcas de fricção desaparecem espontaneamente no polímero em segundos, cicatrizando a armadura e revitalizando o brilho original da lataria.",
    packagingDetails: [
      "1x Bobina NeoSkin™ Brutal High-Density original",
      "Par de luvas de aplicação tática original WINF de microfibra premium",
      "Lacre mecânico com tag holográfica rastreável SINF-Chain",
      "Guia completo de manutenção periódica e fluidos recomendados"
    ],
    techDetails: [
      { label: "Espessura de Armadura", value: "150 a 800 mícrons de elasticidade termoplástica" },
      { label: "Regeneração Molecular", value: "Auto-cura térmica instantânea (< 15 segundos)" },
      { label: "Acabamento de Brilho", value: "Efeito vitrificado Gloss Profundo ou Stealth Matte autêntico" },
      { label: "Proteção de Pintura", value: "Nível impermeável com repelência hidrofóbica ativa" }
    ],
    productRollImg: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
    externalViewImg: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    internalViewImg: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
    externalViewDesc: "Excepcional efeito hidrofóbico sobre lataria de luxo. Líquidos escoam e repelem sujeira instantly.",
    internalViewDesc: "Close-up microscópico de lataria polida de alta costura selada pela película termoplástica TPU."
  }
};

const ModuleBrandShowcase: React.FC<ModuleBrandShowcaseProps> = ({ onBack, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState(0);
  const [selectedProductForSalesPage, setSelectedProductForSalesPage] = useState<any | null>(null);
  const [activeSalesGalleryTab, setActiveSalesGalleryTab] = useState<'external' | 'internal' | 'package'>('external');
  const [activeMediaTab, setActiveMediaTab] = useState<'external' | 'internal' | 'roll'>('external');
  const [isWinfApplied, setIsWinfApplied] = useState<boolean>(true);
  const [isDiagnosticMinimized, setIsDiagnosticMinimized] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const index = Math.round((scrollTop / (scrollHeight - clientHeight)) * (PRODUCTS.length));
      setActiveSegment(Math.min(index, PRODUCTS.length - 1));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-[#131314] z-[100] text-white flex overflow-hidden">
      
      {/* Global Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 p-5 md:p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-white text-white/50 transition-colors"
        >
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Voltar ao Sistema</span><span className="sm:hidden">Voltar</span>
        </button>
        <div className="flex gap-2">
          {PRODUCTS.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1 transition-all duration-500 rounded-none ${idx <= activeSegment ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
             />
          ))}
        </div>
      </nav>

      {/* Main Snap Scrolling Container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory hide-scrollbar relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        
        {/* Intro Slide */}
        <section className="h-screen w-full snap-center relative flex items-center justify-center p-5 md:p-8 lg:p-24">
           <img 
             src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400" 
             className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
           
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="relative z-10 text-center max-w-4xl"
           >
             <h4 className="text-[10px] md:text-xs font-bold tracking-[0.4em] md:tracking-[0.6em] text-white/50 uppercase mb-4 md:mb-6">A Reinvenção da Proteção Solar</h4>
             <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
               WINF™ <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">Digital Experience</span>
             </h1>
             <p className="text-lg md:text-2xl text-white/40 font-light max-w-3xl mx-auto leading-relaxed">
               Não vendemos película. Oferecemos controle absoluto sobre o ambiente.
             </p>
             
             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="mt-16 md:mt-24 opacity-50 flex flex-col items-center justify-center"
             >
                <div className="text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4">Desça para Explorar</div>
               <ChevronDown size={24} />
             </motion.div>
           </motion.div>
        </section>

        {/* Product Slides */}
        {PRODUCTS.map((prod, idx) => (
          <section key={prod.id} className="h-screen w-full snap-start relative flex items-center overflow-hidden">
            {/* Background Image with Parallax effect feeling */}
            <div className="absolute inset-0 z-0">
               <motion.div 
                 className="w-full h-full"
                 style={{ 
                    backgroundImage: `url(${prod.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                 }}
               />
            </div>
            
            {/* Gradients to blend content */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            
            {/* Content Left Side */}
            <div className="relative z-20 w-full lg:w-1/2 p-5 md:p-8 md:p-24 flex flex-col justify-center h-full">
               
               {/* Standby Strategic Badge */}
               {(prod.id === 'aerocore' || prod.id === 'neoskin') && (
                 <div className="absolute top-20 left-5 md:left-24 z-30 flex items-center gap-2 bg-[#E33B0E]/10 border border-[#E33B0E]/30 px-3 py-1.5 rounded-none backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-none bg-[#E33B0E] animate-pulse"></span>
                    <span className="text-[8px] font-mono tracking-widest font-bold uppercase text-[#E33B0E]">Locked: Standby Estratégico (Inauguração Studio)</span>
                 </div>
               )}

               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
               >
                 <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <prod.icon size={20} className="md:w-6 md:h-6 opacity-80" style={{ color: prod.color }} />
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] font-bold" style={{ color: prod.color }}>{prod.id} Series</span>
                 </div>
                 
                 <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-3 md:mb-4 leading-[1.1] md:leading-none">
                   {prod.name.replace('Winf Select™ ', '')}
                 </h2>
                 <h3 className="text-lg md:text-2xl font-light text-white/80 tracking-tight mb-6 md:mb-8 flex items-center gap-2 flex-wrap">
                   {prod.subtitle}
                   {(prod.id === 'aerocore' || prod.id === 'neoskin') && (
                     <span className="text-[9px] font-bold tracking-widest uppercase bg-white/5 text-white/40 px-2.5 py-1 font-sans border border-[#444746]">
                       Lançamento Futuro / Em Expansão
                     </span>
                   )}
                 </h3>
                 
                 <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed mb-8 md:mb-12 max-w-lg">
                   {prod.description}
                 </p>
                 
                 {/* Tech Specs */}
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 border-t border-[#444746] pt-6 md:pt-8 max-w-lg mb-8 md:mb-12">
                   {prod.stats.map((stat, i) => (
                     <div key={i} className="flex flex-col">
                       <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">{stat.label}</span>
                       <span className="text-lg md:text-xl font-medium tracking-tight text-white">{stat.value}</span>
                     </div>
                   ))}
                 </div>
                 
                 {/* Action Button */}
                 <button 
                   onClick={() => {
                     if (prod.id === 'aerocore' || prod.id === 'neoskin') {
                       alert(`${prod.name} encontra-se em Standby Estratégico. O lançamento oficial ocorrerá exclusivamente na data de inauguração do WINF Studio.`);
                       return;
                     }
                     setSelectedProductForSalesPage(prod);
                   }} 
                   className={`group relative px-6 md:px-8 py-4 md:py-5 border uppercase text-[10px] md:text-xs tracking-[0.3em] font-bold overflow-hidden bg-[#131314]/50 backdrop-blur-md transition-all w-full sm:w-auto text-left
                     ${prod.id === 'aerocore' || prod.id === 'neoskin' ? 'border-[#444746] opacity-40 cursor-not-allowed' : 'border-[#444746] hover:border-white'}`}
                   style={{ 
                     boxShadow: prod.id === 'aerocore' || prod.id === 'neoskin' ? 'none' : `0 0 40px ${prod.glowColor}` 
                   }}
                 >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-between">
                      {(prod.id === 'aerocore' || prod.id === 'neoskin') ? "Lançamento Futuro / Em Expansão 🔒" : "Conhecer a Película"} <ArrowLeft size={16} className="rotate-180 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </span>
                 </button>
               </motion.div>

            </div>
          </section>
        ))}

        {/* Closing Slide */}
        <section className="min-h-screen w-full snap-start relative flex flex-col items-center justify-center p-5 md:p-8 bg-[#131314]">
          <div className="max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-600">
              PRONTO PARA ELEVAR SUA ARQUITETURA?
            </h2>
            <p className="text-zinc-500 font-light text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Inicie a análise na WINF Core ou converse com nossa equipe de concierge técnico sobre como as tecnologias Winf Select™ e AeroCore™ podem se integrar ao seu projeto.
            </p>
            
            <button 
               onClick={onBack}
               className="bg-white text-black px-12 py-6 text-xs uppercase tracking-[0.4em] font-bold hover:bg-gray-200 transition-colors shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              Acessar Painel Central
            </button>
          </div>
        </section>

      </div>
      
      {/* Decorative lines & elements */}
      <div className="absolute bottom-12 right-12 text-[10px] md:text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold rotate-[-90deg] origin-bottom-right pointer-events-none hidden md:block">
        WINF INTERNATIONAL • EXPERIÊNCIA {new Date().getFullYear()}
      </div>

      {/* Detailed Sales Page Overlay */}
      <AnimatePresence>
        {selectedProductForSalesPage && (() => {
          const salesInfo = PRODUCT_SALES_INFO[selectedProductForSalesPage.id];
          if (!salesInfo) return null;
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed inset-0 bg-[#020202] z-[120] text-white flex flex-col overflow-y-auto"
            >
              {/* Overlay Navigation Header */}
              <header className="p-4 sm:p-6 md:p-8 border-b border-[#444746] flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-zinc-950/85 sticky top-0 backdrop-blur-xl z-[130]">
                <button 
                  onClick={() => setSelectedProductForSalesPage(null)}
                  className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-white text-white/50 transition-colors w-fit"
                >
                  <ArrowLeft size={16} /> Voltar à Galeria
                </button>
                <div className="flex items-center gap-2 w-fit">
                  <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-zinc-300 font-bold bg-white/10 border border-[#444746] px-2.5 py-1">
                    SINF-CHAIN ORIGIN ACTIVE
                  </span>
                </div>
              </header>

              {/* Main Content Layout */}
              <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-12 xl:p-16 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 xl:gap-16 items-start">
                
                {/* 12-Column Immersive Media Configurator Visualizer */}
                <div className="xl:col-span-12 space-y-4 md:space-y-6 bg-zinc-950 p-4 sm:p-6 md:p-8 border border-[#444746] rounded-none mb-2 md:mb-4">
                  {/* Tab selectors */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-6 border-b border-[#444746]">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveMediaTab('external')}
                        className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all flex items-center gap-2 ${
                          activeMediaTab === 'external'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-zinc-400 border-[#444746] hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <Eye size={13} /> Visão Externa (Fachada)
                      </button>
                      <button
                        onClick={() => setActiveMediaTab('internal')}
                        className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all flex items-center gap-2 ${
                          activeMediaTab === 'internal'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-zinc-400 border-[#444746] hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <Sun size={13} /> Visão Interna (Conforto)
                      </button>
                      <button
                        onClick={() => setActiveMediaTab('roll')}
                        className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all flex items-center gap-2 ${
                          activeMediaTab === 'roll'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-zinc-400 border-[#444746] hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <Package size={13} /> Rolo de Película & Etiqueta
                      </button>
                    </div>

                    {/* Simulation controls (only show for external/internal views) */}
                    {activeMediaTab !== 'roll' && (
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Simulação:</span>
                        <button
                          onClick={() => setIsWinfApplied(!isWinfApplied)}
                          className={`px-4 py-2 text-[10px] font-mono tracking-widest border transition-all flex items-center gap-2 font-bold ${
                            isWinfApplied
                              ? 'bg-white/10 text-zinc-300 font-bold border-white/30/40'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-none ${isWinfApplied ? 'bg-white' : 'bg-red-400'} animate-pulse`} />
                          {isWinfApplied ? 'PELÍCULA ATIVADA' : 'SEM PELÍCULA (GLARE SOLAR)'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Active Visualizer Pane */}
                  <div className="relative h-[320px] sm:h-[480px] md:h-[550px] bg-[#080808] border border-[#444746] overflow-hidden group shadow-2xl flex items-center justify-center">
                    
                    {/* Background image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={
                          activeMediaTab === 'external'
                            ? salesInfo.externalViewImg
                            : activeMediaTab === 'internal'
                            ? salesInfo.internalViewImg
                            : salesInfo.productRollImg
                        }
                        alt="Visualizer Pane"
                        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                          activeMediaTab !== 'roll' && !isWinfApplied
                            ? 'brightness-125 saturate-125 contrast-90 blur-[0.3px]'
                            : ''
                        }`}
                      />

                      {/* Dynamic filter matching selected product color & properties when applied */}
                      {activeMediaTab !== 'roll' && isWinfApplied && (
                        <div 
                          className="absolute inset-0 transition-all duration-700 pointer-events-none mix-blend-multiply opacity-50"
                          style={{
                            backgroundColor: selectedProductForSalesPage.id === 'blackpro' 
                              ? 'rgba(0,0,0,0.85)' 
                              : selectedProductForSalesPage.id === 'dualreflect'
                              ? 'rgba(0, 150, 255, 0.22)' 
                              : selectedProductForSalesPage.id === 'invisible'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : selectedProductForSalesPage.id === 'seguranca'
                              ? 'rgba(255, 200, 0, 0.06)'
                              : selectedProductForSalesPage.id === 'white'
                              ? 'rgba(240, 240, 240, 0.12)'
                              : selectedProductForSalesPage.id === 'aerocore'
                              ? 'rgba(0, 50, 255, 0.18)'
                              : 'rgba(255,255,255,0.05)'
                          }}
                        />
                      )}

                      {/* Overplaying Sun flare when WINF is disabled */}
                      {activeMediaTab !== 'roll' && !isWinfApplied && (
                        <div className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-none blur-[80px] pointer-events-none animate-pulse" />
                      )}
                    </div>

                    {/* Label tag indicators */}
                    <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none">
                      <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-400 bg-[#131314]/85 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#444746] uppercase rounded-none flex items-center gap-1.5 backdrop-blur-md">
                        <span>SÉRIE:</span> 
                        <strong className="text-white font-bold">{selectedProductForSalesPage.id.toUpperCase()}</strong>
                      </span>
                      {activeMediaTab !== 'roll' && (
                        <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-zinc-300 font-bold bg-[#131314]/85 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#444746] uppercase rounded-none inline-block backdrop-blur-md">
                          {isWinfApplied ? 'CONTROLE TÉRMICO E ANTI-POLARE ATIVO' : 'RADIAÇÃO E CALOR EM NÍVEL DIRETOR'}
                        </span>
                      )}
                    </div>

                    {/* Corner Realtime Statistics comparison box */}
                    {activeMediaTab !== 'roll' && (
                      isDiagnosticMinimized ? (
                        <button 
                          onClick={() => setIsDiagnosticMinimized(false)}
                          className="absolute bottom-3 left-3 z-[11] bg-[#131314]/95 hover:bg-zinc-900 text-zinc-300 font-bold border border-[#444746] px-3 py-1.5 text-[8px] sm:text-[9px] font-mono tracking-widest rounded-none shadow-2xl flex items-center gap-2 backdrop-blur-md"
                        >
                          <Activity size={10} className="animate-pulse text-zinc-300 font-bold" />
                          VER DIAGNÓSTICO CLIMÁTICO
                        </button>
                      ) : (
                        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 z-10 bg-[#131314]/90 border border-[#444746] p-3 sm:p-4 md:p-5 backdrop-blur-xl max-w-none sm:max-w-xs space-y-3 sm:space-y-4 rounded-none shadow-2xl">
                          <div className="flex justify-between items-center border-b border-white/15 pb-1 sm:pb-1.5">
                            <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-zinc-500 uppercase block">Diagnóstico Climático do Sol</span>
                            <button 
                              onClick={() => setIsDiagnosticMinimized(true)}
                              className="text-[8px] py-0.5 px-1 bg-white/5 hover:bg-white/10 border border-[#444746] font-mono text-zinc-400 hover:text-white uppercase cursor-pointer"
                            >
                              [-] Ocultar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-0.5">
                              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-400 uppercase block">Temperatura Interna</span>
                              <span className={`text-sm sm:text-base font-bold ${isWinfApplied ? 'text-zinc-300 font-bold' : 'text-red-400'}`}>
                                {isWinfApplied ? '21°C (Estável)' : '36°C (Abafado)'}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-400 uppercase block">Rejeição IR</span>
                              <span className="text-sm sm:text-base font-bold text-white">
                                {isWinfApplied ? salesInfo.techDetails[1]?.value || 'Até 86%' : '0% Sem Barreira'}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-400 uppercase block">Filtro Ultra-Violeta</span>
                              <span className="text-sm sm:text-base font-bold text-white">
                                {isWinfApplied ? '99.9%' : 'Nenhum'}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-400 uppercase block">Controle Ofuscamento</span>
                              <span className={`text-sm sm:text-base font-bold ${isWinfApplied ? 'text-zinc-300 font-bold' : 'text-red-400'}`}>
                                {isWinfApplied ? 'CONFORTÁVEL' : 'VULNERÁVEL'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* Special Roll Product Details Badge */}
                    {activeMediaTab === 'roll' && (
                      <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 z-10 bg-[#131314]/90 border border-[#444746] p-4 sm:p-5 rounded-none backdrop-blur-xl max-w-none sm:max-w-sm space-y-2 sm:space-y-2.5 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/15 pb-1.5 sm:pb-2">
                          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-zinc-400">BOBINA INDUSTRIAL WINF SELECT™</span>
                          <span className="text-[7px] sm:text-[8px] font-mono text-zinc-300 font-bold bg-white/10 border border-[#444746] px-1.5 sm:px-2 py-0.5">AUTÊNTICA</span>
                        </div>
                        <div className="space-y-1 sm:space-y-1.5">
                          <p className="text-[10px] sm:text-xs text-zinc-300 font-light leading-relaxed">
                            A película original Winf Select™ é entregue em uma bobina tática lacrada com adesivos holográficos gravados a laser, contendo liner termoplástico auto-aderente de alto vácuo.
                          </p>
                          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1 pt-1 sm:pt-1.5 text-[7px] sm:text-[8px] font-mono text-zinc-500">
                            <div>CARRETEL: 1.52m x 30.0m</div>
                            <div>CONTROLE: SINF-Chain Blockchain Key</div>
                            <div>CERTIFICADO: WNF-GENUINE-PLATE</div>
                            <div>LOTE MESTRE: CONFIRMADO VIP</div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Left Column: Narrative, Storytelling & Detailed Specs */}
                <div className="xl:col-span-7 space-y-6 sm:space-y-8 animate-fade-in">
                  <div className="space-y-3">
                    <span className="text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase" style={{ color: selectedProductForSalesPage.color }}>
                      {salesInfo.highlight}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white font-sans">
                      {selectedProductForSalesPage.name}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl font-light text-zinc-400 tracking-tight leading-relaxed max-w-2xl">
                      {salesInfo.narrative}
                    </p>
                  </div>

                  <div className="h-[1px] bg-white/10 w-full" />

                  {/* Brief Narrative */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">NARRATIVA DO PRODUTO</h4>
                    <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-3xl">
                      {salesInfo.longDescription}
                    </p>
                  </div>

                  {/* Technical Information Grid */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">REQUISITOS E DESEMPENHO</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {salesInfo.techDetails.map((td, idx) => (
                        <div key={idx} className="bg-white/5 border border-[#444746] p-4 flex flex-col justify-between hover:border-white/15 transition-all">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">{td.label}</span>
                          <span className="text-sm md:text-base font-semibold text-white tracking-tight">{td.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Packaging Details */}
                  <div className="space-y-4 bg-zinc-950 border border-[#444746] p-5 sm:p-6 md:p-8">
                    <h4 className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Package size={14} /> COMPONENTES DA EMBALAGEM EXCLUSIVA WINF
                    </h4>
                    <ul className="space-y-3">
                      {salesInfo.packagingDetails.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-[11px] sm:text-xs md:text-sm text-zinc-300 font-light leading-snug">
                          <Check size={16} className="text-zinc-300 font-bold shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Packaging Digital Asset & Primary Call To Action */}
                <div className="xl:col-span-5 space-y-8 xl:sticky xl:top-32 xl:pb-12">
                  
                  {/* Digital 3D Luxury Packaging Model */}
                  <div className="relative bg-[#0d0d0d] border border-[#444746] p-8 flex flex-col items-center justify-center overflow-hidden aspect-square rounded-none group hover:border-white/30 transition-all shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-950 to-transparent opacity-40" />
                    
                    {/* Glowing radial backplate matching category color */}
                    <div 
                      className="absolute inset-[15%] rounded-none blur-[80px] opacity-25 pointer-events-none transition-all duration-700 group-hover:scale-110"
                      style={{ backgroundColor: selectedProductForSalesPage.color }}
                    />
                    
                    <span className="absolute top-4 left-4 text-[8px] font-mono tracking-widest text-zinc-500 uppercase">
                      WINF OFFICIAL PACKAGING // VIRTUAL ASSET
                    </span>

                    {/* Interactive 3D CSS Canister / Box Representation */}
                    <div className="relative w-44 h-80 flex items-center justify-center pointer-events-none">
                      {/* Cylindrical canister representing luxury film packaging */}
                      <div className="w-28 h-64 border border-white/15 bg-gradient-to-b from-zinc-800 via-zinc-950 to-black relative flex flex-col justify-between p-4 shadow-2xl overflow-hidden rounded-none group-hover:rotate-1 transition-all duration-700">
                        {/* Metallic reflection strip */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full url-reflected transition-all duration-[1500ms] ease-in-out" />
                        
                        {/* Hologram tape */}
                        <div className="absolute top-10 left-0 w-full h-3 bg-gradient-to-r from-[#FFFFFF] via-[#00c5ee] to-[#0066FF] opacity-90 border-y border-[#444746]" />

                        {/* Top Cap */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-zinc-700 to-zinc-900 border-b border-[#444746]" />
                        
                        {/* Bottom Cap */}
                        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-zinc-900 to-black border-t border-[#1a1a1a]" />

                        {/* Holographic SINF-Chain sticker */}
                        <div className="z-10 bg-[#131314]/80 border border-[#444746] p-2 text-[7px] font-mono mt-12 text-center text-zinc-400">
                          <div className="text-[6px] tracking-widest text-zinc-500 uppercase">AUTHENTICITY KEY</div>
                          <div className="text-zinc-300 font-bold font-bold">WINF.SINF.{selectedProductForSalesPage.id.toUpperCase()}</div>
                        </div>

                        {/* Brand Signature Label embossed on the tube */}
                        <div className="z-10 flex flex-col items-center">
                          <span className="text-[9px] font-bold tracking-[0.5em] text-white/40 uppercase mb-1">
                            WINF SELECT™
                          </span>
                          <span 
                            className="text-xs font-black tracking-widest uppercase mb-1 text-center font-sans block"
                            style={{ color: selectedProductForSalesPage.color }}
                          >
                            {selectedProductForSalesPage.id}
                          </span>
                          <div className="w-12 h-[2px]" style={{ backgroundColor: selectedProductForSalesPage.color }} />
                        </div>

                        {/* Security seal badge barcode */}
                        <div className="z-10 bg-white/5 border border-[#444746] p-1 mb-6 flex flex-col items-center">
                          <div className="w-16 h-4 bg-zinc-400 opacity-60 flex items-center justify-around overflow-hidden gap-[1px] px-1 py-0.5">
                            {/* Barcode lines */}
                            {[2,1,3,1,2,3,1,2,1,3,2,1].map((val, k) => (
                              <div key={k} className="h-full bg-[#131314] shrink-0" style={{ width: `${val}px` }} />
                            ))}
                          </div>
                          <span className="text-[5px] font-mono text-zinc-500">COD.WNF-EXP-{selectedProductForSalesPage.id.substring(0,4).toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Small holographic roll peek peeking next to it */}
                      <div className="absolute right-0 bottom-8 w-12 h-44 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-[#444746] opacity-70 rounded-none -z-10 -rotate-6 transform scale-95 flex items-center justify-center shadow-lg">
                        <div className="w-1 h-full bg-white/5" />
                        <div className="absolute top-0 bottom-0 left-0 w-2 bg-zinc-100/10" />
                        <span className="text-[6px] font-mono text-zinc-500 tracking-widest -rotate-90 uppercase block font-semibold">FILM ROLL</span>
                      </div>
                    </div>

                    <div className="mt-4 text-center z-10 w-full">
                      <span className="text-xs text-zinc-300 font-light">Embalagem Premium Winf Box</span>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">Cilindro térmico com proteção antirrisco e bloqueador de umidade</p>
                    </div>
                  </div>

                  {/* Primary Sales Pitch Call To Action Button (acessar a visão de consultoria) */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate(ViewState.PUBLIC_CONSULTANCY);
                        } else {
                          alert("Visão de Consultoria indisponível no momento.");
                        }
                      }}
                      className="w-full bg-white text-black px-8 py-5 text-sm uppercase tracking-[0.25em] font-black hover:bg-zinc-200 transition-all duration-300 uppercase shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_55px_rgba(255,255,255,0.45)] border border-white/30 flex items-center justify-between group rounded-none"
                    >
                      <span className="relative z-10 font-extrabold text-xs">Acessar Visão de Consultoria</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-mono text-center">
                      *Abre a ferramenta oficial de simulação técnica interativa, estimadores de conforto térmico e o gerador de propostas inteligentes com o cliente da ponta.
                    </p>
                  </div>

                </div>

              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default ModuleBrandShowcase;
