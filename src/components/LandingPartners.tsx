import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Check,
  ShieldCheck,
  Crown,
  Eye,
  Brain,
  FileSpreadsheet,
  Hexagon,
  Building2,
  TrendingUp,
  Microscope,
  ScanLine,
  Globe,
  Sparkles,
  Users,
  GalleryVerticalEnd,
  FlaskConical,
  Layers3,
  Cpu,
  Atom,
} from 'lucide-react';
import WinfFooter from './WinfFooter';
import { usePageMeta } from '../hooks/usePageMeta';
import { PAGE_META } from '../data/siteMeta';

interface LandingPartnersProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
  onNavigateToBrand?: () => void;
  onNavigateToAeroCore?: () => void;
  onNavigateToNeoskin?: () => void;
  onNavigateToShop?: () => void;
  onNavigateToBlog?: () => void;
}

const WHATSAPP_LINK = "https://wa.me/5513991662300";

const openWhatsApp = (text: string) => {
  window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, "_blank");
};

// ─── Reference assets (verified live; the 2 dead URLs from the source were replaced) ───
const IMG = {
  heroArch: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920",
  studio: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2072",
  architects: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
  forest: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2072",
  multi: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2072",
  lifestyle: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2072",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920",
  techOrigin: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920",
};

const NOISE_BG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

interface Scenario {
  name: string;
  revenue: number;
}

interface LicensingModel {
  id: string;
  level: string;
  title: string;
  description: string;
  image: string;
  price: number;
  payback: string;
  availabilityNote?: string;
  deliverables: string[];
  scenarios: Scenario[];
}

const MODELS: LicensingModel[] = [
  {
    id: "nivel1",
    level: "NÍVEL 01",
    title: "ASSET LIGHT SELECT",
    description:
      "O modelo perfeito para instaladores e profissionais autônomos. Foque nas vendas e entregas, nós cuidamos da engenharia e da estrutura.",
    image: IMG.studio,
    price: 15000,
    payback: "30–90 dias",
    deliverables: [
      "Geração de Leads",
      "Kit de Materiais Premium",
      "One-Page & WINF OS",
      "Mapeamento Satelital Global",
    ],
    scenarios: [
      { name: "Conservador", revenue: 45000 },
      { name: "Realista", revenue: 70000 },
      { name: "Agressivo", revenue: 100000 },
    ],
  },
  {
    id: "nivel2",
    level: "NÍVEL 02",
    title: "KIOSK ARQUITETÔNICO",
    description:
      "Hub focado no varejo de alto fluxo, projetado para captação de grandes obras e condomínios fechados. Seu showroom arquitetônico regional.",
    image: IMG.architects,
    price: 95000,
    payback: "12–18 meses",
    availabilityNote: "Disponibilidade territorial sujeita a análise de board.",
    deliverables: [
      "Showroom Arquitetônico",
      "Estoque Regional Cross Docking",
      "Prioridade em Grandes Obras",
      "Treinamento Winf Ascend™",
    ],
    scenarios: [
      { name: "Conservador", revenue: 120000 },
      { name: "Realista", revenue: 180000 },
      { name: "Agressivo", revenue: 240000 },
    ],
  },
  {
    id: "nivel3",
    level: "NÍVEL 03",
    title: "FLAGSHIP STUDIO",
    description:
      "O centro de excelência técnica para aplicação da Vertical Automotiva (AeroCore™ e NeoSkin™ PPF) e dominação regional da execução premium.",
    image: IMG.forest,
    price: 95000,
    payback: "10–16 meses",
    availabilityNote: "Uma operação Studio por região. Análise de perfil obrigatória.",
    deliverables: [
      "Centro Técnico Certificado",
      "Domínio Regional Automotivo",
      "Hub de Cross Docking",
      "Suporte N1 Dedicado",
    ],
    scenarios: [
      { name: "Conservador", revenue: 150000 },
      { name: "Realista", revenue: 220000 },
      { name: "Agressivo", revenue: 300000 },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// DOSSIER MODAL (KIOSK / STUDIO / ASSET LIGHT performance dossier)
// ════════════════════════════════════════════════════════════════════════════
const DossierModal: React.FC<{
  model: LicensingModel;
  onClose: () => void;
  onProceed: (model: LicensingModel) => void;
}> = ({ model, onClose, onProceed }) => {
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAuthenticating(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center p-0 md:p-8 bg-[#050505]/98 backdrop-blur-3xl overflow-y-auto pt-0 md:pt-12 lg:pt-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-6xl w-full bg-[#0A0A0A] border-0 md:border md:border-white/5 rounded-none overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)] min-h-screen md:min-h-0 mb-0 md:mb-20"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-10 md:right-10 z-50 w-10 h-10 md:w-14 md:h-14 bg-white text-black rounded-none flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          aria-label="Fechar dossiê"
        >
          <X size={24} className="md:w-7 md:h-7" />
        </button>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none z-0">
          <div className="text-[12rem] font-bold text-white whitespace-nowrap tracking-tighter mix-blend-overlay">
            WINF PARTNERS
          </div>
        </div>

        {authenticating ? (
          <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-2 border-white/10 rounded-none" />
              <div className="absolute inset-0 border-t-2 border-white rounded-none animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-none animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.5em] text-white/40 animate-pulse mb-2">
                Autenticando Acesso
              </p>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">
                Preparando Dossiê de Performance...
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row min-h-[80vh]"
          >
            {/* Left panel — identity & deliverables */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 relative bg-[#0d0d0d] p-6 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5"
            >
              <div className="absolute inset-0 opacity-20 grayscale pointer-events-none">
                <img src={model.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
              </div>

              <div className="relative z-10">
                <button
                  onClick={onClose}
                  className="mb-8 md:mb-12 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Radar
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter leading-tight md:leading-none">
                  {model.title}
                </h2>
                <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed mb-10 md:mb-12 max-w-md">
                  {model.description}
                </p>

                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="text-xs font-black uppercase tracking-[0.3em] text-white/20 w-auto sm:w-20 md:w-24 shrink-0">
                      Investimento
                    </div>
                    <div className="hidden sm:block h-px flex-1 bg-white/5" />
                    <div className="text-xl md:text-2xl font-black text-white tracking-tighter">
                      R$ {model.price.toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="text-xs font-black uppercase tracking-[0.3em] text-white/20 w-auto sm:w-20 md:w-24 shrink-0">
                      Payback Est.
                    </div>
                    <div className="hidden sm:block h-px flex-1 bg-white/5" />
                    <div className="text-xl md:text-2xl font-black text-white tracking-tighter">{model.payback}</div>
                  </div>
                  {model.availabilityNote && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-none bg-white/5 border border-white/20"
                    >
                      <div className="flex items-start gap-3 text-white/50">
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-none animate-pulse mt-1.5 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-widest leading-relaxed">
                          {model.availabilityNote}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-12 md:mt-16">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-4 md:mb-6">
                  Entregáveis Premium
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {model.deliverables.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-2 md:gap-3 text-xs font-bold text-white/60 uppercase tracking-widest"
                    >
                      <div className="w-1 h-1 bg-white rounded-none" /> {d}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right panel — live performance simulation */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="md:w-1/2 p-6 md:p-16 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-white/20">
                  Projeção de Performance
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-green-500 rounded-none animate-pulse" />
                  <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                    Live Data Simulation
                  </span>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8 flex-1">
                {model.scenarios.map((s, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <h5 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                        Cenário {s.name}
                      </h5>
                      <div className="text-lg md:text-xl font-black text-white tracking-tighter">
                        R$ {s.revenue.toLocaleString("pt-BR")}{" "}
                        <span className="text-xs text-white/20 font-bold uppercase tracking-widest ml-1">/mês</span>
                      </div>
                    </div>
                    <div className="h-1.5 md:h-2 bg-white/5 rounded-none overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.revenue / 1e5) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.2 }}
                        className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      />
                    </div>
                    <div className="mt-2 md:mt-3 flex justify-between text-xs font-bold text-white/20 uppercase tracking-widest">
                      <span>Lucro Líquido Est.</span>
                      <span className="text-white/40">R$ {(s.revenue * 0.4).toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/5">
                <button
                  onClick={() => onProceed(model)}
                  className="w-full py-5 md:py-6 bg-white text-black font-black text-xs uppercase tracking-[0.5em] rounded-none hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-4 md:mb-6"
                >
                  Solicitar Credenciamento
                </button>
                <p className="text-center text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
                  Sujeito a análise de perfil e disponibilidade territorial.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// LICENSING PLANS (light section)
// ════════════════════════════════════════════════════════════════════════════
const LicensingPlans: React.FC<{ onOpenDossier: (m: LicensingModel) => void }> = ({ onOpenDossier }) => {
  const nivel1 = MODELS[0];
  return (
    <div className="w-full text-black bg-[#F9F9F9] font-sans selection:bg-black selection:text-white pb-32">
      <div className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 border border-black/10 bg-white text-xs font-bold uppercase tracking-[0.4em] text-[#050505] mb-6"
          >
            Nossas Operações
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-heading font-black tracking-tighter uppercase mb-6 text-[#050505]"
          >
            Planos de <span className="block text-zinc-500">Expansão.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-zinc-600 text-lg md:text-xl font-light leading-relaxed"
          >
            A Winf™ não é uma empresa de películas. Somos um ecossistema de tecnologia e serviços projetado para
            entregar conforto e performance. Três formatos exclusivos projetados para dominar nichos e se fortalecerem
            mutuamente.
          </motion.p>
        </div>

        {/* NÍVEL 01 card */}
        <div className="grid grid-cols-1 gap-8 relative z-10 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#F9F9F9] border border-black/5 p-6 md:p-10 flex flex-col relative group hover:border-black/20 transition-all shadow-xl"
          >
            <div className="mb-8">
              <Building2 size={28} className="text-[#050505]/40 mb-6" />
              <div className="text-xs font-black uppercase tracking-widest text-[#050505]/40 mb-2">{nivel1.level}</div>
              <h3 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-[#050505] mb-2">
                {nivel1.title}
              </h3>
              <p className="text-sm md:text-base text-zinc-500 h-auto md:h-10">{nivel1.description}</p>
            </div>

            <div className="mb-8 p-6 bg-white border border-black/5">
              <div className="text-xs font-bold text-black/40 uppercase tracking-wider mb-2">Investimento Inicial</div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-[#050505]">
                  <span className="text-xl md:text-2xl text-black/40">12x R$</span> 1.500
                  <span className="text-sm font-normal text-black/40">*</span>
                </div>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#050505]/60 flex justify-between items-center mt-2">
                <span>ou R$ 15.000 à vista</span>
                <span className="bg-green-500/10 text-green-700 px-3 py-1 rounded">Alta Margem & Retorno Imediato</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {nivel1.deliverables.map((d, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Check size={16} className="text-[#050505]/40 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-600">{d}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenDossier(nivel1)}
              className="w-full py-5 bg-[#050505] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-black/90 transition-colors flex items-center justify-center gap-2"
            >
              SABER MAIS SOBRE ASSET LIGHT <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Investors block */}
        <div className="mt-16 max-w-5xl mx-auto p-6 md:p-8 bg-black text-white border border-white/10 flex flex-col items-center text-center gap-6 relative z-10 shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Hexagon size={120} />
          </div>
          <div className="relative z-10 w-full">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white/50 mb-3 flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/50 rounded-none" />
              Acesso Restrito
              <div className="w-1.5 h-1.5 bg-white/50 rounded-none" />
            </h4>
            <h3 className="text-2xl md:text-4xl font-heading font-black tracking-tighter text-white mb-4">
              OPÇÕES PARA INVESTIDORES
            </h3>
            <p className="text-white/60 font-light text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Para perfis corporativos e investidores com capital a partir de R$ 95.000. Opções focadas em varejo de
              alto fluxo (Kiosk) e dominação regional automotiva e arquitetônica (Flagship Studio).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => onOpenDossier(MODELS[1])}
                className="py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
              >
                Detalhes KIOSK
              </button>
              <button
                onClick={() => onOpenDossier(MODELS[2])}
                className="py-4 border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
              >
                Detalhes STUDIO
              </button>
            </div>
          </div>
        </div>

        {/* Architects block */}
        <div className="mt-8 max-w-5xl mx-auto p-6 md:p-8 bg-white border border-black/10 flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 shadow-sm">
          <div className="w-16 h-16 shrink-0 bg-[#050505] flex items-center justify-center text-white rounded-none">
            <Building2 size={24} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#050505] mb-2">
              Aos Arquitetos e Especificadores
            </h4>
            <p className="text-zinc-600 font-light text-sm leading-relaxed mb-4">
              Você pode formalizar a homologação e fechar o projeto com os membros homologados de{" "}
              <b className="text-[#050505] font-bold">qualquer um dos 3 níveis de operação</b>. O arquiteto com cadastro
              gratuito possui acesso a uma tabela diferenciada com os licenciados Nível 1 (
              <b className="text-[#050505] font-bold">Asset Light</b>), que recebem prioridade nos projetos.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4 border-t border-black/5 pt-4">
              <div>
                <strong className="text-xs uppercase font-black tracking-widest text-[#050505]">
                  Fluxo e RT (Reserva Técnica)
                </strong>
                <p className="text-xs text-zinc-500 mt-1">
                  O RT é garantido para projetos encaminhados. Você pode fechar o pedido direto com seu cliente ou
                  enviar para o licenciado atender. Pagamento padrão: 50% no pedido, saldo a combinar (com você ou o
                  cliente).
                </p>
              </div>
              <div>
                <strong className="text-xs uppercase font-black tracking-widest text-[#050505]">
                  Expansão para Arquitetos
                </strong>
                <p className="text-xs text-zinc-500 mt-1">
                  Arquitetos também podem se tornar <b className="text-[#050505]">Asset Light</b>. Ao se licenciar, você
                  internaliza a operação, garantindo as margens máximas da rede e dominando a execução dos seus próprios
                  projetos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN LANDING — WINF™ PARTNERS (Winf Digital Ecosystem)
// ════════════════════════════════════════════════════════════════════════════
export const LandingPartners: React.FC<LandingPartnersProps> = ({
  onBack,
  onOpenMenu,
  onNavigateToBrand,
  onNavigateToAeroCore,
  onNavigateToNeoskin,
  onNavigateToShop,
  onNavigateToBlog,
}) => {
  usePageMeta(PAGE_META.partners);

  const [activeModel, setActiveModel] = useState<LicensingModel | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroImages = [IMG.heroArch, IMG.studio, IMG.architects];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const pillars = [
    {
      icon: <ShieldCheck size={24} />,
      title: "Blindagem de Valor",
      desc: "Desconecte-se da guerra de preços. Nosso ecossistema estabelece um posicionamento onde margens premium são a única realidade aceitável.",
      tag: "Controle Absoluto",
    },
    {
      icon: <Crown size={24} />,
      title: "Transferência de Autoridade",
      desc: "A percepção molda o julgamento. Ao absorver a assinatura WINF™, seu negócio adquire instantaneamente o status e a reverência do luxo.",
      tag: "Ancoragem de Prestígio",
    },
    {
      icon: <Eye size={24} />,
      title: "A Força Oculta",
      desc: "Opere com a retaguarda de um império. Uma engenharia avançada e silenciosa trabalhando nos bastidores para orquestrar sua expansão.",
      tag: "Vantagem Assimétrica",
    },
    {
      icon: <Brain size={24} />,
      title: "Presciência Operacional",
      desc: "A inteligência do WINF OS™ atua como uma extensão da sua visão, decodificando o mercado e o comportamento do cliente antes mesmo que se formem.",
      tag: "Supremacia de Dados",
    },
  ];

  const architectTools = [
    { icon: <Sparkles size={24} />, title: "Simulação AI", desc: "Fachadas em tempo real." },
    { icon: <TrendingUp size={24} />, title: "Dossiê ROI", desc: "Dados de eficiência." },
    { icon: <FileSpreadsheet size={24} />, title: "Arquivos BIM", desc: "Especificação pronta." },
    { icon: <Users size={24} />, title: "Suporte Pro", desc: "Engenharia dedicada." },
  ];

  const techPillars = [
    {
      icon: <Cpu size={18} />,
      title: "Tecnologia",
      sub: "Core do Jogo",
      items: [
        { label: "MAGNETRON SPUTTERING", value: "Multi-metálica" },
        { label: "NANO_CERÂMICA", value: "Dispersa" },
        { label: "FILMES_ÓPTICOS", value: "200+ Layers" },
      ],
    },
    {
      icon: <FlaskConical size={18} />,
      title: "Controle",
      sub: "de Ambiente",
      items: [
        { label: "CLEAN_ROOM", value: "Nível Óptico Alto" },
        { label: "MEDIDA_EXATA", value: "Controle Molecular" },
        { label: "ATMOSFERA", value: "Nível Aeroespacial" },
      ],
    },
    {
      icon: <Layers3 size={18} />,
      title: "Cadeia",
      sub: "Verticalizada",
      items: [
        { label: "PROCESSO", value: "PET > Coating" },
        { label: "ESTRUTURA", value: "Metal > Adesivo" },
        { label: "PRODUÇÃO ELITE", value: "200 Milhões m²/ano" },
      ],
    },
    {
      icon: <Atom size={18} />,
      title: "Patentes",
      sub: "Reais",
      items: [
        { label: "CONTROLE_ESPECTRAL", value: "IR/UV" },
        { label: "REJEIÇÃO_DE_CALOR", value: "Seletiva" },
        { label: "NANOMATERIAIS", value: "Transp. + Proteção" },
      ],
    },
  ];

  const handleCredenciamento = (model: LicensingModel) => {
    openWhatsApp(
      `*SOLICITAÇÃO DE CREDENCIAMENTO // WINF PARTNERS™*\n\n` +
        `*Modelo:* ${model.title} (${model.level})\n` +
        `*Investimento:* R$ ${model.price.toLocaleString("pt-BR")}\n\n` +
        `Aguardo análise de perfil e disponibilidade territorial.`
    );
    setActiveModel(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-x-hidden relative transition-colors duration-300">
      {/* Blueprint grid backdrop */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.01]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Top progress scan line */}
      <div className="fixed top-0 w-full z-[90] h-0.5 bg-white/5 overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>

      {/* Dossier modal */}
      <AnimatePresence>
        {activeModel && (
          <DossierModal model={activeModel} onClose={() => setActiveModel(null)} onProceed={handleCredenciamento} />
        )}
      </AnimatePresence>

      {/* Film grain */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />

      {/* ══════════ HERO ══════════ */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,#050505_80%)]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center grayscale contrast-110 brightness-75"
              style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#050505]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-none blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-none blur-[120px] animate-pulse delay-1000" />
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        {/* Shared header (logo + menu) — same as all other pages */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6 sm:p-10 md:p-14 flex items-center justify-between">
          <div onClick={onBack} className={`flex items-center ${onBack ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
            <img src="/winf-logo.svg" width={128} height={32} alt="WINF™" className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" />
          </div>
          <button onClick={() => onOpenMenu?.()} className="group flex flex-col items-end justify-center gap-2 p-2.5 focus:outline-none cursor-pointer z-50 relative hover:opacity-80 transition-opacity" aria-label="Abrir Menu">
            <span className="block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-7 group-hover:w-8" />
            <span className="block h-[1.5px] bg-white transition-all duration-300 ease-out shadow-[0_1px_4px_rgba(0,0,0,0.8)] w-5 group-hover:w-8" />
          </button>
        </div>

        <div className="relative z-10 text-center max-w-6xl px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 border border-white/20 bg-transparent text-white/50 text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] mb-8 md:mb-12"
          >
            <span>NÚCLEO ESTRATÉGICO</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="relative mb-6 md:mb-8"
          >
            <h1 className="text-4xl sm:text-6xl md:text-[6rem] lg:text-[7rem] font-bold tracking-tighter leading-[0.9] uppercase text-white">
              WINF™ PARTNERS
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-12 md:mb-16 relative"
          >
            <h2 className="text-base md:text-xl font-light tracking-[0.2em] md:tracking-[0.3em] text-white/70 uppercase max-w-4xl mx-auto leading-relaxed">
              <span className="font-medium text-white">Tecnologia Invisível.</span> Domínio Absoluto.
            </h2>
            <p className="text-xs font-medium text-white/50 uppercase tracking-[0.4em] mt-6">
              Fim da competição. <span className="text-white">Domine.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center w-full sm:w-auto"
          >
            <button
              onClick={() => scrollToId("licensing-plans")}
              className="w-full sm:w-auto bg-white text-black px-6 md:px-12 py-4 rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all text-center flex items-center justify-center gap-3"
            >
              Explorar Modelos <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigateToBrand?.()}
              className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-6 md:px-12 py-4 rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Conhecer a Marca
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <button onClick={() => scrollToId("manifesto")} className="group flex flex-col items-center gap-2">
              <span className="text-xs text-white/50 font-bold uppercase tracking-[0.4em] transition-all group-hover:text-white group-hover:tracking-[0.5em]">
                Acessar Protocolo WINF
              </span>
              <div className="w-12 h-[1px] bg-white/20 group-hover:w-24 group-hover:bg-white transition-all duration-500" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-xs font-black uppercase tracking-[0.6em] text-white/20">Mission Control</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </header>

      {/* ══════════ MANIFESTO ══════════ */}
      <section id="manifesto" className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-white/50 uppercase tracking-[0.5em] mb-4 flex items-center justify-center gap-2"
            >
              <div className="w-8 h-[1px] bg-white/20" />
              A Engenharia do Posicionamento
              <div className="w-8 h-[1px] bg-white/20" />
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              Onde o mercado enxerga preço, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                Nós construímos valor inquestionável.
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg max-w-3xl mx-auto mt-6 leading-relaxed"
            >
              A verdadeira liderança não se conquista disputando orçamentos, mas redefinindo o padrão. Enquanto o
              mercado comum dilui margens para sobreviver, entregamos a você a infraestrutura, a tecnologia e a
              exclusividade para se tornar a única escolha lógica no segmento premium. Pare de competir. Comece a
              dominar.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-none overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:scale-105 transition-transform duration-1000"
              style={{ backgroundImage: `url(${IMG.office})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  openWhatsApp("Olá, solicito acesso ao Manifesto Winf™ (Análise Estratégica 4:20 min).")
                }
                className="w-24 h-24 md:w-32 md:h-32 bg-white text-black rounded-none flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] transition-all"
                aria-label="Assistir manifesto"
              >
                <Play size={40} className="ml-2" />
              </motion.button>
              <div className="text-center">
                <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-white mb-2">
                  Manifesto Winf™
                </p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Análise Estratégica: 4:20 min
                </p>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-white rounded-none animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Winf™ Partners Ecosystem Overview
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-1 w-32 bg-white/10 rounded-none overflow-hidden">
                  <div className="h-full w-1/3 bg-white" />
                </div>
                <span className="text-xs font-mono text-white/40">01:24 / 04:20</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() =>
                openWhatsApp(
                  "APLICAÇÃO // WINF PARTNERS™\n\nOlá, quero aplicar para Membro Partner. Seguem meus dados para análise de board."
                )
              }
              className="bg-white text-black px-12 py-5 rounded-none text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:bg-zinc-200"
            >
              Aplicar para Membro Partner <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
      </section>

      {/* ══════════ LICENSING PLANS ══════════ */}
      <div id="licensing-plans" className="bg-black border-t border-white/5 pt-12 pb-0">
        <LicensingPlans onOpenDossier={setActiveModel} />
      </div>

      {/* ══════════ HIERARQUIA DE PODER ══════════ */}
      <section id="models" className="py-24 bg-[#050505] relative border-t border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-white/50 uppercase tracking-[0.4em] mb-4"
            >
              Diferenciação Absoluta
            </motion.h2>
            <h3 className="text-3xl md:text-6xl font-bold text-white uppercase tracking-tighter">
              HIERARQUIA DE <span className="text-white/70 italic font-medium">PODER</span>.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-none bg-black border border-white/5 hover:border-white/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-[0.4em] mb-3">{p.tag}</div>
                <h4 className="text-lg font-bold text-white uppercase tracking-tighter mb-4 group-hover:text-white/80 transition-colors">
                  {p.title}
                </h4>
                <p className="text-sm text-white/40 uppercase tracking-widest leading-relaxed font-light">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* O FIM DO ACHISMO + certificate */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 border-t border-white/5 pt-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.4em] text-white/50 mb-8">
                  <ShieldCheck size={12} /> Exclusividade Absoluta
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                  O FIM DO ACHISMO.
                </h2>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-[0.9] text-white/20">
                  GARANTIA RASTREÁVEL.
                </h2>
                <div className="space-y-6 text-sm text-white/60 font-light leading-relaxed max-w-xl">
                  <p>
                    No mercado tradicional, garantias são promessas verbais ou papéis que se perdem. Na WINF™, sua
                    garantia é um ativo digital imutável, atrelado ao número de série da sua película.
                  </p>
                  <p>
                    Acesse o nosso <strong>Portal do Cliente</strong> a qualquer momento, digite o número de série e
                    valide a autenticidade e a cobertura do seu projeto em tempo real. Transparência técnica de ponta a
                    ponta.
                  </p>
                </div>
                <div className="mt-12 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 bg-black shrink-0">
                      <ScanLine size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">
                        Validação em Tempo Real
                      </h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                        Consulte o status da sua blindagem online de forma autônoma em nossa plataforma.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 bg-black shrink-0">
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">
                        Certificado de Autenticidade
                      </h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                        Cada metro quadrado WINF™ possui um DNA digital verificado na blockchain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#050505] border border-white/10 p-5 md:p-12 relative group flex flex-col justify-center min-h-[500px]">
                <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <ShieldCheck size={200} />
                </div>
                <div className="relative z-10 border border-white/10 bg-[#0A0A0A] p-5 md:p-12 shadow-2xl">
                  <div className="flex justify-between items-start mb-16">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} className="text-white/40" />
                      </div>
                      <div>
                        <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">
                          Status do Projeto
                        </div>
                        <div className="text-xs uppercase tracking-[0.3em] font-black text-[#00E5A3] flex items-center gap-2">
                          AUTENTICADO <div className="w-1.5 h-1.5 bg-[#00E5A3] rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">
                        Garantia Nº
                      </div>
                      <div className="text-xs xl:text-sm uppercase tracking-[0.2em] font-mono text-white/80">
                        WINF-1744-XA
                      </div>
                    </div>
                  </div>
                  <h3 className="text-3xl xl:text-4xl text-white font-bold tracking-tighter italic leading-none mb-4">
                    CERTIFICADO
                    <br />
                    OFICIAL
                  </h3>
                  <p className="text-xs text-white/60 font-black uppercase tracking-[0.5em] mb-16">
                    Engineering & Architecture
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-12">
                    <div>
                      <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
                        Tecnologia Ativa
                      </div>
                      <div className="text-xs xl:text-sm font-bold tracking-[0.1em] text-white">SELECT PRO</div>
                    </div>
                    <div>
                      <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
                        Vencimento
                      </div>
                      <div className="text-xs xl:text-sm font-bold tracking-[0.1em] text-white">DEZ 2036</div>
                    </div>
                    <div>
                      <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
                        Aplicação
                      </div>
                      <div className="text-xs xl:text-sm font-bold tracking-[0.1em] text-white">FACHADA CORPORATE</div>
                    </div>
                    <div>
                      <div className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
                        Concessão
                      </div>
                      <div className="text-xs xl:text-sm font-bold tracking-[0.1em] text-white">WINF™ OFICIAL</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Architects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-6 md:p-20 rounded-none border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Hexagon size={300} />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1 rounded-none border border-white/20 bg-transparent text-xs font-bold uppercase tracking-[0.5em] text-white/50 mb-8">
                  Portal do Especificador // Architects
                </div>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 italic leading-[0.9]">
                  É ARQUITETO? <br />
                  <span className="text-white">CADASTRE-SE GRÁTIS.</span>
                </h2>
                <p className="text-lg text-white/60 font-light leading-relaxed max-w-xl mb-12 uppercase tracking-widest">
                  Tenha acesso exclusivo ao nosso ecossistema de engenharia molecular. Utilize nossas ferramentas de
                  simulação AI, cálculo de ROI energético e especificações técnicas para elevar o padrão dos seus
                  projetos.
                </p>
                <div className="flex flex-wrap gap-6 items-center">
                  <button
                    onClick={() =>
                      openWhatsApp(
                        "CADASTRO DE ARQUITETO // WINF PARTNERS™\n\nOlá, sou arquiteto/especificador e quero meu cadastro gratuito no Portal do Especificador."
                      )
                    }
                    className="bg-white text-black px-12 py-5 rounded-none text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3 group"
                  >
                    Registrar Gratuitamente{" "}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-4 px-6 py-3 rounded-none border border-white/10 bg-black">
                    <ScanLine size={16} className="text-white/50" />
                    <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
                      Acesso sob Análise
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {architectTools.map((t, i) => (
                  <div
                    key={i}
                    className="p-8 rounded-none border border-white/5 bg-black/40 backdrop-blur-xl hover:border-white/20 transition-all"
                  >
                    <div className="text-white/50 mb-4">{t.icon}</div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2">{t.title}</h4>
                    <p className="text-xs text-white/30 leading-relaxed uppercase font-light">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ O PREÇO DA AUTORIDADE ══════════ */}
      <section id="budget" className="py-40 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-white/50 uppercase tracking-[0.6em] mb-6"
            >
              DADOS NÃO MENTEM // Q2-2026
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-[5rem] font-bold text-white uppercase tracking-tighter leading-[0.8] mb-12"
            >
              O PREÇO DA <span className="text-white/80 italic font-medium">AUTORIDADE.</span>
            </motion.h3>
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-3 px-6 py-2 rounded-none border border-white/20 bg-transparent">
                <TrendingUp size={16} className="text-white/50" />
                <span className="text-xs font-bold text-white/50 uppercase tracking-[0.5em]">
                  VALORIZAÇÃO IMPLÍCITA // ATIVA
                </span>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-sm md:text-xl max-w-3xl mx-auto font-light leading-relaxed uppercase tracking-widest"
            >
              "Assuma o controle do seu valor de mercado." Compare as modelagens operacionais e alcance a soberania no
              seu segmento. Ignoramos conjecturas; operamos com engenharia de lucro exata e previsível.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black border border-white/5 rounded-none p-6 md:p-16 relative overflow-hidden group w-full"
            >
              <div className="absolute top-0 right-0 p-5 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={80} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-12 flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-1.5 h-1.5 bg-white rounded-none" />
                A ENGENHARIA DO LUCRO: EFEITO MULTIPLICADOR
              </h4>
              <div className="space-y-16">
                <div className="relative pl-10 border-l border-white/10">
                  <div className="absolute -left-1 top-0 w-2 h-2 bg-white rounded-none" />
                  <h5 className="text-white font-bold text-xs uppercase tracking-[0.3em] mb-4">
                    A MATEMÁTICA DA RIQUEZA
                  </h5>
                  <p className="text-sm text-white/40 mb-6 uppercase tracking-widest font-light leading-relaxed">
                    Exemplo prático na linha Select™: o investimento do partner por bobina na fábrica é irrelevante
                    frente ao valor percebido no mercado. Você não vende película, você implementa blindagem térmica e
                    proteção patrimonial premium.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.03] p-6 rounded-none border border-white/5 group-hover:border-white/20 transition-all">
                      <p className="text-xs text-white/20 uppercase font-bold tracking-widest mb-2">
                        Lucro Limpo / Rolo
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">
                        R$ 5.3k <span className="text-sm font-medium tracking-normal text-white/50">a</span> 9.6k
                      </p>
                    </div>
                    <div className="bg-white/[0.03] p-6 rounded-none border border-white/5 group-hover:border-white/20 transition-all">
                      <p className="text-xs text-white/50 uppercase font-bold tracking-widest mb-2">Multiplicador (ROI)</p>
                      <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">Até 530%</p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-10 border-l border-white/10">
                  <div className="absolute -left-1 top-0 w-2 h-2 bg-white/40 rounded-none" />
                  <h5 className="text-white font-bold text-xs uppercase tracking-[0.3em] mb-4">
                    PROJEÇÃO DE FLUXO DE CAIXA
                  </h5>
                  <p className="text-sm text-white/40 mb-6 uppercase tracking-widest font-light leading-relaxed">
                    Um técnico operando em regime de alta eficiência pode processar volumes expressivos mensais. Aliado
                    à nossa engine de captação de clientes corporativos e residenciais premium, os limites tradicionais
                    de faturamento do mercado de window film são sumariamente rompidos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.03] p-6 rounded-none border border-white/5 group-hover:border-white/20 transition-all">
                      <p className="text-xs text-white/20 uppercase font-bold tracking-widest mb-2">
                        Caixa Mensal (Nível 1)
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">R$ 30k</p>
                    </div>
                    <div className="bg-white/[0.03] p-6 rounded-none border border-white/5 group-hover:border-white/20 transition-all">
                      <p className="text-xs text-white/50 uppercase font-bold tracking-widest mb-2">
                        Caixa Mensal (Nível 2)
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">
                        R$ 60k <span className="text-sm font-medium tracking-normal text-white/50">+</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ GALERIA ══════════ */}
      <section id="social" className="py-40 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold text-white/50 uppercase tracking-[0.7em] mb-8 flex items-center gap-3"
              >
                <GalleryVerticalEnd size={14} className="text-white/30" /> PORTFÓLIO VISUAL // ELITE_ASSETS
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-8xl font-bold text-white leading-[0.8] uppercase tracking-tighter"
              >
                A ESTÉTICA DO <span className="text-white/80 italic font-medium">PODER.</span>
              </motion.h3>
            </div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-sm md:text-lg max-w-sm leading-relaxed text-right font-light uppercase tracking-widest"
            >
              "Aja como um Rei para ser tratado como um." Explore a materialização absoluta do prestígio Winf™ em ativos
              de ultra-luxo.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
            {/* 01 — Supercars (tall) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative rounded-none overflow-hidden md:col-span-1 md:row-span-2 border border-white/5 bg-black min-h-[420px]"
            >
              <img
                src={IMG.forest}
                alt="Supercars — AeroCore™"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-[0.05] transition-opacity select-none z-10">
                <div className="text-6xl font-black text-white whitespace-nowrap rotate-[-15deg]">CONFIDENTIAL</div>
              </div>
              <div className="absolute inset-0 p-6 md:p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <p className="text-xs text-white/40 font-black uppercase tracking-[0.5em] mb-4">01 // ASSET_CORE</p>
                <h4 className="text-4xl font-black text-white uppercase tracking-tighter">Supercars</h4>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity scanline-overlay" />
            </motion.div>

            {/* 02 — Arquitetura */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative rounded-none overflow-hidden border border-white/5 bg-black min-h-[320px]"
            >
              <img
                src={IMG.studio}
                alt="Arquitetura — WINF SELECT™"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-8 left-8">
                <p className="text-xs text-white/70 font-black uppercase tracking-[0.3em]">Arquitetura</p>
              </div>
            </motion.div>

            {/* 03 — Lifestyle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-none overflow-hidden border border-white/5 bg-black min-h-[320px]"
            >
              <img
                src={IMG.lifestyle}
                alt="Lifestyle — Kiosk WINF"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-8 left-8">
                <p className="text-xs text-white/70 font-black uppercase tracking-[0.3em]">Lifestyle</p>
              </div>
            </motion.div>

            {/* 04 — Detailing (wide) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative rounded-none overflow-hidden md:col-span-2 border border-white/5 bg-black min-h-[320px]"
            >
              <img
                src={IMG.multi}
                alt="Detailing — NeoSkin™ PPF"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-[0.05] transition-opacity select-none z-10">
                <div className="text-8xl font-black text-white whitespace-nowrap rotate-[-15deg]">CONFIDENTIAL</div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 md:p-12">
                <p className="text-xs text-white/40 font-black uppercase tracking-[0.5em] mb-4">04 // PROCESS_FLOW</p>
                <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Detailing</h4>
                <p className="text-sm text-white/40 uppercase tracking-widest max-w-md hidden md:block font-medium leading-relaxed">
                  Processos de correção de pintura e aplicação de NeoSkin™ PPF com precisão cirúrgica em laboratórios
                  certificados.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-24 text-center">
            <a
              href="https://www.instagram.com/winf.windowfilm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 text-xs font-black text-white uppercase tracking-[0.4em] border border-white/10 px-6 md:px-10 py-5 rounded-none hover:bg-white hover:text-black transition-all group"
            >
              <Globe size={18} /> Acessar Galeria Oficial{" "}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ A ORIGEM REAL ══════════ */}
      <section className="py-40 bg-[#020202] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center grayscale mix-blend-overlay"
            style={{ backgroundImage: `url(${IMG.techOrigin})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-none border border-white/5 bg-black backdrop-blur-xl">
              <div className="w-1.5 h-1.5 bg-white rounded-none animate-pulse" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-[0.5em]">
                ORIGEM TECNOLÓGICA // MANUFATURA_AVANÇADA
              </span>
            </div>

            <h2 className="text-4xl md:text-[6rem] font-bold text-white uppercase tracking-tighter leading-[0.8] mb-12">
              A Origem Real. <br />
              <span className="text-white/80 italic font-medium">O Topo da Cadeia.</span>
            </h2>

            <div className="space-y-12">
              <p className="text-xl md:text-3xl font-light text-white/80 leading-tight tracking-tight max-w-5xl mx-auto italic border-l-8 border-white/20 pl-8 md:pl-12 text-left">
                "Esqueça argumentos de venda genéricos. A liderança global em proteção térmica é desenhada por
                engenharia molecular em parques nanotecnológicos de altíssimo investimento (ex: KDX). Dominar a ponta é
                ter acesso direto à origem."
              </p>
              <p className="text-sm md:text-lg font-medium text-white/50 leading-relaxed max-w-4xl mx-auto uppercase tracking-[0.2em] md:tracking-[0.4em]">
                A realidade corporativa: 80% das marcas dependem de terceiros. A WINF™ exige e opera no núcleo
                tecnológico dos maiores desenvolvedores do mundo. Nossos 4 pilares inegociáveis:
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-white/5 mt-20 border border-white/5 p-px">
                {techPillars.map((t, i) => (
                  <div
                    key={i}
                    className="p-8 bg-[#020202] text-left group hover:bg-[#050505] transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] group-hover:bg-white/10 transition-all rounded-full -mt-16 -mr-16" />
                    <div className="flex flex-col gap-6 relative z-10">
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black">
                        {t.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-2">
                        {t.title}
                        <br />
                        <span className="text-white/40 font-normal">{t.sub}</span>
                      </h4>
                    </div>
                    <ul className="space-y-4 mt-8 relative z-10">
                      {t.items.map((item, j) => (
                        <li key={j} className="flex flex-col gap-1 border-l-2 border-white/10 pl-3">
                          <span className="text-xs text-white/50 font-bold uppercase tracking-widest">{item.label}</span>
                          <span className="text-xs text-white font-mono">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pt-12 flex flex-wrap justify-center gap-12 opacity-60">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 flex items-center justify-center rounded-none bg-white/5 border border-white/10 text-white/80">
                    <Globe size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">GLOBALLY SOURCED</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 flex items-center justify-center rounded-none bg-white/5 border border-white/10 text-white/80">
                    <Layers3 size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">NANO_LAYER</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 flex items-center justify-center rounded-none bg-white/5 border border-white/10 text-white/80">
                    <Microscope size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">MIL_SPEC SECURE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER (compartilhado) ══════════ */}
      <WinfFooter brandName="WINF PARTNERS" />
    </div>
  );
};

export default LandingPartners;
