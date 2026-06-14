import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Zap,
  Diamond,
  CheckCircle2,
  MessageSquare,
  Send,
  Bot,
  Loader2,
  TrendingUp,
  Award,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Shield,
  Shirt,
  Coins,
  Megaphone,
  BarChart,
  MapPin,
  Database,
  CreditCard,
  Activity
} from "lucide-react";
import { useWinf } from "../contexts/WinfContext";
import { generateGeminiResponse } from '../lib/gemini';
import ModuleProducts from "./ModuleProducts";
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const LICENSING_PLANS = [
  {
    id: "asset-light",
    title: "Asset Light Select",
    subtitle: "NÍVEL 1 • CONSULTORIA VIRTUAL",
    price: 15000,
    icon: Diamond,
    color: "text-white",
    bg: "bg-white/10",
    border: "border-white/20",
    description:
      "Venda direta para o cliente final (residencial e corporativo) com operação enxuta sem necessidade de loja física.",
    benefits: [
      "Acesso ao Portfólio",
      "WINF OS™ CRM",
      "Academy 360",
      "Mentoria",
      "Marketing Hub",
    ],
  },
  {
    id: "kiosk",
    title: "Kiosk",
    subtitle: "NÍVEL 2 • PONTO DE EXPERIÊNCIA",
    price: 120000,
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    description:
      "Ilhas imersivas para shoppings de luxo. Máquina de captação de leads físicos.",
    benefits: [
      "Tudo do Asset Light",
      "Projeto Arquitetônico",
      "Displays Térmicos",
      "Hardware VR",
      "Exclusividade",
    ],
  },
  {
    id: "flagship",
    title: "Flagship + Total",
    subtitle: "NÍVEL 3 • DISTRIBUIÇÃO REGIONAL",
    price: 250000,
    icon: Shield,
    color: "text-white",
    bg: "bg-white/10",
    border: "border-white/20",
    description:
      "Estúdios de Luxo Flagship, com direitos de master e distribuição regional.",
    benefits: [
      "Tudo do Nível Kiosk",
      "Projeto Flagship",
      "Licença de Distribuição",
      "Prioridade VIP",
      "Mentoria Board",
    ],
  },
];

const SHOP_ITEMS = [
  {
    id: "m5",
    category: "merch",
    classification: "Acessórios Elite",
    name: "Óculos de Sol WINF™ DarkMode",
    desc: "Construção em acetato premium fresado à mão. Lentes polarizadas com bloqueio UV 400 oficial e antirreflexo interno. Hastes com detalhe em metal fosco gravado a laser com logo WINF™. Acompanha estojo de couro sintético texturizado e flanela de microfibra de alta gramatura.",
    price: 490,
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "m6",
    category: "merch",
    classification: "Vestuário Técnico",
    name: "Jaqueta Corta-Vento W-Pro",
    desc: "Tecido tecnológico 100% impermeável e corta-vento com costuras seladas a quente. Logo refletivo de alta visibilidade aplicado no peito e nas costas, garantindo segurança noturna. Capuz anatômico ajustável e bolsos selados. Design tático, minimalista e ergonômico projetado para total mobilidade.",
    price: 380,
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "m1",
    category: "merch",
    classification: "Uniforme Oficial",
    name: "Camisa Técnica Dry-Fit WINF™",
    desc: "Camisa manga longa de alta performance para o instalador avançado. Tecido com tecnologia de microcápsulas de resfriamento ativo, tratamento antibacteriano antiodor e proteção UV50+. Secagem ultra-rápida e recortes ergonômicos em mesh nas laterais e axilas para máxima respirabilidade durante projetos complexos.",
    price: 180,
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "m2",
    category: "merch",
    classification: "Acessórios de Trabalho",
    name: "Headwear Performance WINF™",
    desc: "O headwear essencial dos instaladores da elite WINF™. Aba curva moldada e tecido em poliamida texturizada de peso-pluma. Furos feitos a laser para exaustão térmica constante e tecnologia dry interna de absorção de suor, impedindo que o suor atrapalhe a aplicação da película.",
    price: 85,
    img: "https://images.unsplash.com/photo-1542280756-74b2f55e73e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "s1",
    category: "supplies",
    classification: "Nanotecnologia Cerâmica",
    name: "WINF Select Nano® Premium",
    desc: "Película arquitetônica super premium de alta performance, projetada para as mais altas exigências. Retenção térmica real comprovada de até 90% dos raios IR e 99.9% de bloqueio dos raios UV. Camada antirrrisco de dureza avançada (SR) e claridade ótica livre de distorções. Garantia certificada intra-molecular. Bobina lacrada de fábrica com selo de autenticidade WINF™.",
    price: 3200,
    img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop",
  },

  {
    id: "svc1",
    category: "services",
    classification: "Assessoria de Marketing",
    name: "Marketing Advanced Windowfilm (MAW)",
    desc: "A célula de inteligência da matriz assume o ataque cibernético comercial do seu território. Operamos campanhas hiper-agressivas e de altíssima conversão em Meta/Google Ads. Injetamos uma avalanche contínua de clientes qualificados diretamente no seu CRM Winf OS™ e WhatsApp. Você mantém o padrão de excelência na instalação técnica, enquanto nós impulsionamos o monopólio e dominamos brutalmente o mercado digital da sua região.",
    price: 1500,
    currency: "BRL",
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    id: "svc2",
    category: "services",
    classification: "Assessoria de Branding",
    name: "Bureau Design VIP WINF™",
    desc: "Nossa agência interna de design ao seu dispor. Precisa de adesivação de frota no padrão Elite? Um outdoor local com as especificações da sua franquia? Conteúdos de altíssimo impacto para Instagram em formato carrossel? Contrate créditos para projetos visuais.",
    price: 250,
    currency: "BRL",
    icon: Diamond,
    color: "text-purple-400",
  },
  {
    id: "svc3",
    category: "services",
    classification: "Assessoria Corporativa",
    name: "Hub Contábil & Legal",
    desc: "Serviço exclusivo de assessoria fiscal, tributária e jurídica homologada pela WINF™. Obtenha análise de contratos com clientes de grande porte, orientação sobre tributação de serviços, blindagem patrimonial e redução estruturada de impostos. Inclui direcionamento e onboarding imediato com nosso contador parceiro direto via WhatsApp para o seu atendimento personalizado.",
    price: 300,
    currency: "BRL",
    icon: Shield,
    color: "text-emerald-400",
  },
  {
    id: "svc4",
    category: "services",
    classification: "Onboarding Digital",
    name: "Tuning Técnico de Instagram",
    desc: "Padronização profissional rigorosa do seu perfil (Asset Light). Reescritura da bio baseada em neurovendas, configuração dos links e CRM integrado, templates homologados WINF™ para destaques e padronização visual da foto de perfil. Após a ativação, nosso time entra em contato imediatamente via WhatsApp para iniciar o seu tuning.",
    price: 0,
    icon: Zap,
    color: "text-winf-primary",
  },
  {
    id: "i1",
    category: "investor",
    classification: "Ativo de Alto Retorno",
    name: "Ilha Imersiva Ponto de Venda KIOSK",
    desc: "Licenciamento completo para operar um quiosque de demonstração VR (Virtual Reality) e sensorial térmico de alto impacto em shoppings classe A. Retorno sobre investimento estimado altíssimo via captação massiva de leads, arquitetura disruptiva projetada e fabricada pela WINF™.",
    price: 120000,
    icon: BarChart,
    color: "text-emerald-400",
  },
  {
    id: "i2",
    category: "investor",
    classification: "Licenciamento Master",
    name: "Ponto Distribuidor STUDIO Regional",
    desc: "A coroa do licenciamento WINF™. Espaço físico de altíssimo luxo (Flagship), desenhado por nossa equipe arquitetônica global. Domínio comercial exclusivo de região estendida, distribuição de produtos B2B, margem ampliada e conexão direta com a diretoria (Board) WINF™.",
    price: 250000,
    icon: Diamond,
    color: "text-blue-400",
  },
];

import CheckoutBlackshop from './CheckoutBlackshop';

interface ModuleBlackshopProps {
  onBack?: () => void;
  onNavigateToChain?: () => void;
}

const ModuleBlackshop: React.FC<ModuleBlackshopProps> = ({ onBack, onNavigateToChain }) => {
  const { user, products } = useWinf();
  const [activeTab, setActiveTab] = useState<
    "storefront" | "catalog" | "orders" | "licensing"
  >("storefront");
  const [showAiOverlay, setShowAiOverlay] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<any>(null);

  // Auto scroll and highlight logic for focused items from window (Setup Instagram vs Support)
  useEffect(() => {
    const focusId = (window as any).blackshopFocusItemId;
    if (focusId) {
      delete (window as any).blackshopFocusItemId; // clean up immediately
      setActiveTab("storefront");
      setTimeout(() => {
        const el = document.getElementById(`bs-card-${focusId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          let ringClass = 'ring-winf-primary';
          let shadowClass = 'shadow-[0_0_40px_rgba(235,142,42,0.4)]';
          let timeToKeep = 3500;
          
          if (focusId === 'svc1') {
            ringClass = 'ring-orange-500';
            shadowClass = 'shadow-[0_0_40px_rgba(249,115,22,0.6)]';
            timeToKeep = 300000; // 5 minutes for Energy
          } else if (focusId === 'svc4') {
            ringClass = 'ring-red-500';
            shadowClass = 'shadow-[0_0_40px_rgba(239,68,68,0.6)]';
            timeToKeep = 300000; // 5 minutes for Tuning as well since it's a similar highlight
          }
          
          el.classList.add('ring-4', ringClass, shadowClass);
          setTimeout(() => {
            el.classList.remove('ring-4', ringClass, shadowClass);
          }, timeToKeep);
        }
      }, 800);
    }
  }, []);
  
  // Orders State
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
        fetchMyOrders();
    }
  }, [activeTab, user]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
        const q = query(
            collection(db, 'blackshop'),
            where('userId', '==', user?.id),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyOrders(fetched);
    } catch (e) {
        console.error(e);
    }
    setLoadingOrders(false);
  };

  // Variation State
  const [configuringProduct, setConfiguringProduct] = useState<any>(null);
  const [selectedLength, setSelectedLength] = useState<number>(30); // 15 or 30
  const [selectedWidth, setSelectedWidth] = useState<number>(1.52); // 1, 0.52, 0.75, 1.52

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleAiAsk = async (planId?: string) => {
    setShowAiOverlay(true);
    if (!planId) return;
    const plan = LICENSING_PLANS.find((p) => p.id === planId);
    if (!plan) return;
    const initialAsk = `Quero comparar o plano ${plan.title} com os outros. O que ele tem de melhor para o meu momento?`;
    await processAiResponse(initialAsk);
  };

  const processAiResponse = async (text: string) => {
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setIsAiTyping(true);
    try {
      const response = await generateGeminiResponse(
        text,
        `Você é o WINF UPGRADE AI™, assistente especialista em expansão de negócios da rede WINF.`
      );
      setChatMessages((prev) => [...prev, { role: "ai", text: response.text }]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "O terminal neural está offline ou API não configurada corretamente.",
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handlePurchase = (item: any) => {
    if (item.category === "Arquitetura" || item.category === "supplies") {
        setConfiguringProduct(item);
        return;
    }
    if (item.price === 0) {
      alert(`Itens gratuitos resgatados: ${item.name}`);
      return;
    }
    setCheckoutItem([item]);
  };

  const handleConfirmConfig = () => {
      if (!configuringProduct) return;
      const m2Price = configuringProduct.price || 100; // base price if missing
      const sqMeters = selectedLength * selectedWidth;
      const finalPrice = m2Price * sqMeters;
      
      const configuredItem = {
          ...configuringProduct,
          name: `${configuringProduct.name} - Rolo ${selectedLength}m x ${selectedWidth}m`,
          price: finalPrice,
          originalPrice: m2Price
      };
      
      setConfiguringProduct(null);
      setCheckoutItem([configuredItem]);
  };

  const renderStorefrontGrid = (title: string, categoryItems: any[]) => {
    if (categoryItems.length === 0) return null;

    return (
      <div className="mb-10 sm:mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-3 border-b border-[#444746] pb-4 md:border-none md:pb-0">
          <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-[0.1em] text-white">
            {title}
          </h3>
          <span className="text-white text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase block">
            {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'itens'} autenticados
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              id={`bs-card-${item.id}`}
              className={`group flex flex-col h-full bg-[#131314] transition-all duration-300 rounded-none relative overflow-hidden border border-[#444746] hover:border-white shadow-md`}
            >
              {/* Subtle gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="h-52 sm:h-60 md:h-64 bg-[#1e1f20] flex items-center justify-center relative overflow-hidden group-hover:bg-[#282a2c] transition-colors duration-500">
                {item.img ? (
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                ) : (
                  <Package className="text-white/5 group-hover:text-white/10 transition-all duration-700 group-hover:scale-110 w-12 h-12 sm:w-16 sm:h-16" />
                )}
                {item.id === 'svc4' ? (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest z-10 rounded-none shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-none animate-ping" />
                    Suporte Técnico
                  </div>
                ) : item.id === 'svc1' ? (
                  <div className="absolute top-4 left-4 bg-white/90 text-black px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest z-10 rounded-none flex items-center gap-1.5">
                    <Zap size={10} className="fill-current" />
                    ENERGY
                  </div>
                ) : item.is_new ? (
                  <div className="absolute top-4 left-4 bg-white text-black px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest z-10 rounded-none shadow-md">
                    Novo
                  </div>
                ) : null}
                {item.price === 0 && (
                  <div className="absolute top-4 right-4 bg-white/10 border border-white/20 text-white px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest z-10 rounded-none shadow-md">
                    Cortesia
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col p-5 sm:p-6 bg-gradient-to-b from-transparent to-[#131314] relative z-10">
                <div className="flex-1 mb-6 text-left">
                  {item.classification && (
                    <span className="inline-block px-2 py-0.5 bg-zinc-800 border border-[#444746] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-3 rounded-none">
                      {item.classification}
                    </span>
                  )}
                  {item.id === 'svc4' && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-0.5 bg-red-950/40 border border-red-500/30 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-red-400 rounded-none animate-pulse">
                        ⚠️ Suporte Técnico Prioritário
                      </span>
                    </div>
                  )}
                  <h4 className="text-base sm:text-lg font-black text-white mb-2 leading-tight tracking-wide uppercase">
                    {item.name}
                  </h4>
                  <div className="relative">
                    <p className="text-xs text-zinc-400 leading-relaxed font-bold uppercase tracking-wider text-[11px] line-clamp-3 group-hover:line-clamp-none transition-all duration-500 ease-in-out">
                      {item.description || item.desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-4 gap-4 border-t border-[#444746] transition-colors duration-300">
                  <div className="text-left">
                    <span className="text-[9px] text-zinc-500 tracking-widest uppercase block mb-0.5 font-bold">
                      Valor do Investimento
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white font-mono tracking-tight flex items-center gap-1.5">
                       {item.price === 0 ? "Gratuito" : false ? (
                         <>
                           <Coins size={16} className="text-white" />
                           {Number(item.price).toLocaleString("pt-BR")}
                         </>
                       ) : (
                         `R$ ${Number(item.price || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                       )}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    className="w-full sm:w-auto text-center px-4 py-2.5 bg-white hover:opacity-90 text-black text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] rounded-none transition-all duration-300 border-none cursor-pointer"
                  >
                    Adquirir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (checkoutItem) {
    return (
      <div className="animate-fade-in w-full">
        <CheckoutBlackshop 
          items={checkoutItem} 
          onBack={() => setCheckoutItem(null)} 
          onSuccess={() => {
            setCheckoutItem(null);
            setActiveTab("orders");
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-12 w-full text-white">
        {/* Header - Banking Style */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#444746] pb-6">
            <div className="space-y-3">
                <div>
                   <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 uppercase">Winf™ | Blackshop B2B</h1>
                </div>
            </div>
            
            <div className="w-full lg:w-auto">
                <div className="flex w-full bg-[#131314] p-1 border border-[#444746] rounded-none overflow-x-auto custom-scrollbar-hide gap-1">
                    {["storefront", "catalog", "orders", "licensing"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 text-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-none whitespace-nowrap text-[10px] sm:text-xs tracking-[0.15em] font-black uppercase transition-all duration-300 ${
                          activeTab === tab ? "bg-white text-black font-black" : "text-zinc-500 hover:text-white"
                        }`}
                      >
                        {tab === "storefront" ? "LOJA" : tab === "catalog" ? "CATÁLOGO" : tab === "orders" ? "PEDIDOS" : "EVOLUÇÃO"}
                      </button>
                    ))}
                </div>
            </div>
        </div>

      <AnimatePresence mode="popLayout">
        {activeTab === "storefront" && (
          <motion.div
            key="storefront"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Vibe BLACKSHOP (based on provided image) */}
            <div className="py-6 sm:py-10 md:py-14 text-left">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white mb-4 leading-tight tracking-tight">
                UMA MARCA.<br />UM LIFESTYLE.
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-zinc-400 mb-8 sm:mb-10 font-normal max-w-2xl">
                Para clientes que exigem o melhor. Para parceiros e investidores que querem dominar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mb-10">
                <div className="bg-[#dfdfdf] aspect-square flex items-center justify-center p-4 sm:p-6 md:p-8 rounded-none border border-[#444746] overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
                    className="w-full h-full object-contain filter grayscale contrast-125 mix-blend-multiply hover:scale-105 transition-all duration-500"
                    alt="Exclusive Item"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                    O CÓDIGO WINF™
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-bold uppercase tracking-wide">
                    O ecossistema Blackshop conecta clientes VIP ao universo da marca. Se você já tem a tecnologia em seus vidros, pode vestir a nossa estética. Se quer fazer parte do futuro, torne-se um licenciado ou invista em nossos Kiosks e Studios.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
                <button 
                  onClick={() => {
                    document.getElementById('storefront-items')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 sm:py-3.5 border border-[#444746] text-white bg-[#1e1f20] rounded-none font-black tracking-[0.15em] uppercase hover:bg-zinc-800 transition-all text-[10px] sm:text-xs cursor-pointer"
                >
                  Explorar Catálogo
                </button>
                <button 
                  onClick={() => setActiveTab('licensing')}
                  className="py-3 sm:py-3.5 border border-[#444746] text-white bg-[#1e1f20] rounded-none font-black tracking-[0.15em] uppercase hover:bg-zinc-800 transition-all text-[10px] sm:text-xs cursor-pointer"
                >
                  Evoluir Negócio
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white mb-2 leading-tight tracking-tight">
                  DESENVOLVIDO PARA A ELITE
                </h2>
                <p className="text-xs sm:text-sm text-white/50 font-normal max-w-2xl">
                  Explore nossas coleções, suprimentos técnicos certificados e passe para o próximo nível.
                </p>
              </div>
            </div>

            <div id="storefront-items">
              {renderStorefrontGrid(
                "Cuidar e Conectar (Serviços)",
                [...SHOP_ITEMS, ...products].filter((i) => i.category === "services"),
              )}
              {renderStorefrontGrid(
                "WINF™ Lifestyle",
                [...SHOP_ITEMS, ...products].filter((i) => i.category === "merch"),
              )}
              {renderStorefrontGrid(
                "Oportunidades de Investimento",
                [...SHOP_ITEMS, ...products].filter((i) => i.category === "investor"),
              )}
              {renderStorefrontGrid(
                "Serviços Digitais",
                [...SHOP_ITEMS, ...products].filter((i) => i.category === "digital"),
              )}
              {renderStorefrontGrid(
                "Películas Oficiais (Rolo)",
                [...SHOP_ITEMS, ...products].filter((i) => i.category === "Arquitetura" || i.category === "supplies"),
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "catalog" && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ModuleProducts />
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12 animate-fade-in"
          >
            <div className="flex flex-col mb-12 border-b border-white/5 pb-8">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
                MEUS PEDIDOS
              </h2>
              <p className="text-white/40 text-sm">Acompanhe seus suprimentos, ativos e códigos de rastreio</p>
            </div>
            
            {loadingOrders ? (
              <div className="flex items-center justify-center py-20 text-white/50">
                <Loader2 size={32} className="animate-spin text-white" />
              </div>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-20 border border-[#444746] bg-[#131314] rounded-none">
                  <Package size={48} className="mx-auto text-zinc-600 mb-6" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-[0.15em]">Nenhum pedido encontrado</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">Você ainda não realizou compras na Blackshop.</p>
                  <button onClick={() => setActiveTab('storefront')} className="px-6 py-3.5 bg-white hover:opacity-90 text-black font-black uppercase tracking-[0.15em] text-xs transition-colors rounded-none border-none cursor-pointer">
                    Explorar Produtos
                  </button>
              </div>
            ) : (
                <div className="space-y-6 text-left">
                    {myOrders.map(order => (
                        <div key={order.id} className="bg-[#131314] border border-[#444746] p-6 md:p-8 hover:border-white transition-all rounded-none relative overflow-hidden group">
                           <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                              {/* Left side info */}
                              <div className="flex-1 space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                  <span className="bg-[#1e1f20] px-3 py-1.5 text-[10px] uppercase tracking-widest font-black text-zinc-300 border border-[#444746] rounded-none">
                                    PEDIDO {order.trackingCode}
                                  </span>
                                  <span className="text-xs text-zinc-500 font-mono">
                                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString('pt-BR') : 'Recente'}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded-none ${order.status === 'Entregue' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : order.status === 'Em Trânsito' ? 'bg-white/20 text-white border border-white/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>
                                    {order.status}
                                  </span>
                                </div>
                                
                                <div className="space-y-4">
                                  {order.items?.map((item: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-4 border-l-2 border-white pl-4 py-1">
                                          <div className="w-10 h-10 bg-[#1e1f20] border border-[#444746] flex items-center justify-center shrink-0 rounded-none">
                                            {item.img ? <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-60" /> : <Package size={16} className="text-white" />}
                                          </div>
                                          <div>
                                            <p className="font-extrabold text-sm text-white uppercase tracking-wide">{item.name}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-black">{item.category}</p>
                                          </div>
                                      </div>
                                  ))}
                                </div>

                                {order.shippingAddress && order.shippingAddress.cep && (
                                    <div className="flex items-start gap-4 mt-4 text-xs font-bold uppercase tracking-wider text-zinc-400 bg-[#1e1f20] p-5 border border-[#444746] rounded-none">
                                      <MapPin className="text-white shrink-0" size={16} />
                                      <div>
                                         <p className="font-black text-white">Destino de Entrega:</p>
                                         <p className="text-zinc-300 mt-1">{order.shippingAddress.rua}, {order.shippingAddress.numero} {order.shippingAddress.complemento}</p>
                                         <p className="text-zinc-300">{order.shippingAddress.bairro} - {order.shippingAddress.cidade}/{order.shippingAddress.estado}</p>
                                         <p className="mt-2 font-mono text-zinc-500">CEP: {order.shippingAddress.cep}</p>
                                      </div>
                                    </div>
                                )}
                              </div>
                              
                              {/* Right side info */}
                              <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-[#444746] pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                                 <div>
                                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-black">Método de Pagamento</p>
                                   <div className="flex items-center gap-2 mb-6">
                                     {order.paymentMethod === 'winfcoin' ? <Database size={14} className="text-white" /> : <CreditCard size={14} className="text-white" />}
                                     <span className="text-xs font-black uppercase tracking-wider text-white">{order.paymentMethod}</span>
                                   </div>
                                   
                                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-black">Valor Total</p>
                                   <p className="text-2xl font-black font-mono text-white">
                                     R$ {order.totalAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                   </p>
                                   {order.freightCost > 0 && <p className="text-[10px] text-white tracking-widest uppercase mt-1 font-bold">+ Frete Integrado</p>}
                                 </div>
                                 
                                 {order.status !== 'Entregue' && (
                                     <button className="w-full mt-8 py-3.5 bg-[#1e1f20] hover:bg-zinc-800 border border-[#444746] text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer">
                                       <Activity size={14} className="text-white" /> Rastrear Objeto
                                     </button>
                                 )}
                              </div>
                           </div>
                        </div>
                    ))}
                </div>
            )}
          </motion.div>
        )}

        {activeTab === "licensing" && (
          <motion.div
            key="licensing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Intro Hero */}
            <div className="bg-[#1e1f20] border border-[#444746] p-6 sm:p-8 md:p-10 rounded-none relative overflow-hidden group text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] group-hover:bg-white/10 transition-all"></div>
              <div className="relative z-10 max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#131314] border border-[#444746] text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.15em] rounded-none">
                  <TrendingUp size={12} /> Roadmap de Carreira
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight uppercase tracking-[0.05em]">
                  EVOLUA SEU NEGÓCIO <br />
                  PARA O <span className="text-white">PRÓXIMO NÍVEL</span>
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-bold uppercase tracking-wider text-[11px]">
                  A Blackshop é o portal de evolução da rede. Escolha seu licenciamento e desbloqueie ferramentas de marketing, suporte estratégico e prioridade de leads.
                </p>
                <button
                  onClick={() => handleAiAsk()}
                  className="flex items-center gap-2.5 bg-white text-black px-6 py-3.5 rounded-none font-black text-xs uppercase tracking-[0.15em] hover:opacity-90 transition-all group border-none cursor-pointer"
                >
                  <Bot size={16} /> Conversar com Winf Upgrade AI™
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1.5 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {LICENSING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-[#131314] border border-[#444746] hover:border-white p-6 rounded-none flex flex-col h-full hover:scale-[1.01] transition-all duration-300 group relative shadow-lg`}
                >
                  {plan.id === "asset-light" && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black border border-black px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded-none shadow-lg">
                      Entrada Estratégica
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className={`p-3 bg-zinc-900 border border-[#444746] text-white w-fit mb-4 rounded-none`}
                    >
                      <plan.icon size={24} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase mb-0.5">
                      {plan.title}
                    </h3>
                    <p
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white`}
                    >
                      {plan.subtitle}
                    </p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">R$</span>
                      <span className="text-2xl font-black text-white font-mono">
                        {plan.price.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed font-bold uppercase tracking-wider text-[11px] mb-6 grow">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[11px] text-zinc-350 uppercase font-black tracking-wider"
                      >
                        <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-white" /> <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 pt-4 border-t border-[#444746]/50 mt-auto">
                    <button
                      onClick={() => setCheckoutItem([{ name: plan.title, category: 'Licenciamento', price: plan.price, img: null }])}
                      className="w-full py-3 bg-white hover:opacity-90 text-black font-black text-xs uppercase tracking-[0.15em] transition-all border-none rounded-none cursor-pointer"
                    >
                      Adquirir Licença
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll Configuration Modal */}
      <AnimatePresence>
          {configuringProduct && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
              >
                  <motion.div 
                      initial={{ scale: 0.95, y: 20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.95, y: 20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-[#131314] border border-[#444746] p-6 sm:p-8 md:p-10 max-w-xl w-full rounded-none shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar text-left"
                  >
                      {/* Subtle background glow */}
                      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-none blur-[100px] pointer-events-none" />

                      <button 
                          onClick={() => setConfiguringProduct(null)}
                          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all bg-[#1e1f20] border border-[#444746] p-2 rounded-none hover:bg-zinc-800 cursor-pointer flex items-center justify-center md:top-8 md:right-8"
                      >
                          <ChevronLeft className="rotate-180" size={16} />
                      </button>
                      
                      <div className="mb-6 text-left pt-2 border-b border-[#444746] pb-4">
                        <div className="inline-block px-2.5 py-0.5 bg-[#1e1f20] border border-[#444746] text-[9px] font-black uppercase tracking-[0.15em] text-white mb-2 rounded-none">
                          Arquitetura & Suprimentos
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-1">Configurar Rolo</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-bold uppercase tracking-wider">{configuringProduct.name}</p>
                      </div>
                      
                      <div className="space-y-6 relative z-10">
                          <div>
                              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-zinc-500 mb-2.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-white rounded-none inline-block"></span>
                                Comprimento (Metros)
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                  {[15, 30].map(len => (
                                      <button 
                                          key={len}
                                          onClick={() => setSelectedLength(len)}
                                          className={`py-4 border rounded-none cursor-pointer ${selectedLength === len ? 'border-white text-white bg-white/10' : 'border-[#444746] text-zinc-400 hover:border-zinc-500 hover:bg-[#1e1f20]'} flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden`}
                                      >
                                          {selectedLength === len && <div className="absolute top-0 left-0 w-full h-1 bg-white" />}
                                          <span className="text-xl sm:text-2xl font-black tracking-tight font-mono">{len}<span className="text-sm sm:text-base text-zinc-500 ml-1 font-sans">m</span></span>
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-zinc-500 mb-2.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-white rounded-none inline-block"></span>
                                Largura (Metros)
                              </label>
                              <div className="grid grid-cols-4 gap-2">
                                  {[1.52, 1.0, 0.75, 0.52].map(width => (
                                      <button 
                                          key={width}
                                          onClick={() => setSelectedWidth(width)}
                                          className={`py-3.5 border rounded-none cursor-pointer ${selectedWidth === width ? 'border-white text-white bg-white/10' : 'border-[#444746] text-zinc-400 hover:border-zinc-500 hover:bg-[#1e1f20]'} flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden`}
                                      >
                                          {selectedWidth === width && <div className="absolute top-0 left-0 w-full h-0.5 bg-white" />}
                                          <span className="text-sm sm:text-base font-black tracking-tight font-mono">{width}<span className="text-[10px] text-zinc-500 ml-0.5 font-sans">m</span></span>
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-[#444746] flex flex-col sm:flex-row justify-between sm:items-end gap-6 sm:gap-0 relative z-10">
                          <div>
                              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#818384] mb-1">Investimento Total Estimado</p>
                              <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                                  R$ {((configuringProduct.price || 100) * (selectedLength * selectedWidth)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </p>
                          </div>
                          <button 
                              onClick={handleConfirmConfig}
                              className="w-full sm:w-auto text-center px-6 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.15em] rounded-none hover:opacity-90 transition-all shadow-md border-none cursor-pointer"
                          >
                              Adicionar ao Carrinho
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* AI Assistant Overlay */}
      <AnimatePresence>
        {showAiOverlay && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#131314] border-l border-[#444746] z-[100] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-[#444746] bg-[#1e1f20] flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#131314] border border-[#444746] flex items-center justify-center text-white rounded-none">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    WINF UPGRADE AI™
                  </h3>
                  <p className="text-xs md:text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">
                    Consultor de Evolução
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiOverlay(false)}
                className="text-zinc-500 hover:text-white p-2.5 bg-[#131314] border border-[#444746] rounded-none cursor-pointer flex items-center justify-center"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <MessageSquare size={40} className="text-zinc-650" />
                  <p className="text-xs font-black uppercase tracking-widest text-white">
                    Qual a sua dúvida sobre <br /> as licenças WINF™?
                  </p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} text-left`}
                >
                  <div
                    className={`max-w-[85%] p-4 text-[13px] leading-relaxed rounded-none ${msg.role === "user" ? "bg-white text-black font-extrabold" : "bg-[#1e1f20] text-zinc-250 border border-[#444746]"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1e1f20] p-4 border border-[#444746] rounded-none flex gap-1">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-1.5 h-1.5 bg-white"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-white"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-white"
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-[#1e1f20] border-t border-[#444746]">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    chatInput.trim() &&
                    !isAiTyping &&
                    processAiResponse(chatInput)
                  }
                  placeholder="Tire suas dúvidas..."
                  className="w-full bg-[#131314] border border-[#444746] py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-white transition-all rounded-none font-bold uppercase tracking-wide"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim() && !isAiTyping)
                      processAiResponse(chatInput);
                    setChatInput("");
                  }}
                  disabled={!chatInput.trim() || isAiTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black hover:opacity-90 disabled:opacity-50 transition-all font-black border-none rounded-none cursor-pointer flex items-center justify-center"
                >
                  {isAiTyping ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleBlackshop;
