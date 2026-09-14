import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LandingPartnersProps {
  onBack: () => void;
  onOpenMenu: () => void;
}

const WHATSAPP_LINK = "https://wa.me/5513991662300";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stats = [
  { value: "98.3%", label: "Rejeção Infravermelho" },
  { value: "0%", label: "Estoque Imobilizado" },
  { value: "3-5x", label: "Margem Sobre Varejo" },
  { value: "24h", label: "Dispatch BlackShop™" },
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    title: "WINF OS™",
    subtitle: "Plataforma Connect",
    desc: "Painel exclusivo para cotação em escala, aprovação de crédito corporativo B2B e emissão de ARTs instantâneas. O sistema executa a matemática tributária, financeira e geométrica por você.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
      </svg>
    ),
    title: "BlackShop™",
    subtitle: "Logística Direta",
    desc: "Estoque centralizado em Hubs de Suprimento regionais. Você paga apenas pelo milímetro que fatura. Corte profissional a laser despachado em menos de 24h.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: "Território Protegido",
    subtitle: "Exclusividade Regional",
    desc: "Apenas 1 Parceiro por Região Geográfica Protegida. Seu território é blindado contratualmente. Sem concorrência amadora na sua zona de atuação.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    ),
    title: "W-Rank™",
    subtitle: "Governança Ativa",
    desc: "Sistema de auditoria em tempo real que mede qualidade operacional, pontualidade e feedbacks de clientes. Leads AAA são direcionados ao Partner com melhor ranking da região.",
  },
];

const objectionBreakers = [
  {
    lie: "Preciso investir centenas de milhares em um Studio físico",
    truth: "O modelo Asset Light elimina o CapEx inicial. Atue como operador volante de alta performance ou em parceria com centros já existentes. O que importa é a precisão do processamento digital.",
  },
  {
    lie: "Preciso ter estoque de rolos inteiros para atender",
    truth: "A custódia física de estoque acabou. O BlackShop™ mantém estoque centralizado. Você acessa a ordem no WINF OS™, o sistema corta e despacha. Paga só pelo que fatura.",
  },
  {
    lie: "Não sou bom com gestão e sistemas complexos",
    truth: "O WINF OS™ executa toda a matemática. Cálculo tributário, financeiro, nesting geométrico — tudo em microssegundos. Se você preenche 3 campos, está qualificado.",
  },
  {
    lie: "Película escura qualquer marca vende",
    truth: "Não jogamos o jogo de plásticos escuros. A nano-engenharia AeroCore™ reduz 98.3% do infravermelho sem interferir em GPS. O consumidor AAA não compra filme — assina infraestrutura ambiental avançada.",
  },
];

const LandingPartners: React.FC<LandingPartnersProps> = ({ onBack, onOpenMenu }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Olá, tenho interesse na operação WINF PARTNERS. Gostaria de solicitar análise do meu dossiê.");
    window.open(`${WHATSAPP_LINK}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[150px] rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#E29E84]/[0.04] blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 border border-white/15 bg-white/[0.03] backdrop-blur-sm text-[11px] font-bold uppercase tracking-[0.4em] text-white/60 mb-10 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E29E84] animate-pulse"></span>
            Ecossistema B2B de Alta Performance
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] font-black tracking-[-4px] uppercase mb-8"
          >
            WINF<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">PARTNERS.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-white/50 leading-relaxed max-w-[700px] mx-auto mb-14 font-light"
          >
            Formamos a elite do controle térmico B2B no Brasil. <span className="text-white/80 font-medium">Rede neural corporativa</span> exclusiva para investidores e integradores. Apenas convidados ou aprovados em análise de board.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-20"
          >
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-5 bg-white text-black text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 active:scale-[0.97] transition-all flex items-center justify-center gap-3 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Submeter Dossiê
            </button>
            <div className="flex-1 flex flex-col justify-center items-center py-5 border border-white/15 bg-white/[0.02] backdrop-blur-sm rounded-full">
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">Acesso Restrito</span>
              <span className="text-[14px] tracking-[0.3em] font-light text-white/80">INVITE ONLY</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/[0.06]"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                <p className="text-[10px] text-white/35 uppercase tracking-[0.2em] mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Diagnóstico: A Quebra da Ilusão ── */}
      <section className="py-28 md:py-40 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.span variants={fadeInUp} custom={0} className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">
              [01 // Diagnóstico do Gargalo]
            </motion.span>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
              Enquanto o mercado comum disputa centavos<br className="hidden md:block" /> fatiando bobinas na tesoura, nós entregamos<br className="hidden md:block" /> a única engenharia do segmento premium.
            </motion.h2>
          </motion.div>

          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={0}
              className="p-8 md:p-10 border border-white/[0.06] bg-white/[0.01] rounded-2xl"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/60 mb-6 block">O Aplicador Comum</span>
              <ul className="space-y-5">
                {[
                  "Imobiliza R$ 30k–80k em rolos que demoram meses para girar",
                  "Perde até 18% da película em erros manuais e cortes com estilete",
                  "Compete com o \"instalador da esquina\" que dilui o preço",
                  "Custos de estrutura pesados, pouca previsibilidade operacional",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/40 text-sm leading-relaxed">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400/40 mt-0.5 shrink-0">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* WINF Partner */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={1}
              className="p-8 md:p-10 border border-white/10 bg-white/[0.03] rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#E29E84]/[0.06] blur-[60px] rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E29E84]/80 mb-6 block relative z-10">O Parceiro Licenciado WINF™</span>
              <ul className="space-y-5 relative z-10">
                {[
                  "Capital protegido — investimento zero em estoque imobilizado",
                  "Corte robótico via BlackShop™ — exatamente nas dimensões do projeto",
                  "Margem sênior — 3x a 5x acima do varejo ordinário",
                  "Governança ativa — território protegido contratualmente por região",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E29E84]/70 mt-0.5 shrink-0">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features: Domínio B2B ── */}
      <section className="py-28 md:py-40 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.span variants={fadeInUp} custom={0} className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">
              [02 // Inteligência Operacional]
            </motion.span>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Domínio B2B.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={idx}
                className="group"
              >
                <div className="w-14 h-14 border border-white/10 flex items-center justify-center mb-6 bg-white/[0.03] group-hover:bg-white group-hover:text-black transition-all duration-500 rounded-xl">
                  {item.icon}
                </div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-bold block mb-2">{item.subtitle}</span>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-white">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Objeções Desmanteladas ── */}
      <section className="py-28 md:py-40 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.span variants={fadeInUp} custom={0} className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">
              [03 // Protocolo de Desarmamento]
            </motion.span>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              As 4 Grandes Mentiras<br/>Desmanteladas pelo Modelo Asset Light
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {objectionBreakers.map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={idx}
                className="p-8 border border-white/[0.06] bg-[#050505] rounded-2xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-[10px] font-bold text-white/20 bg-white/[0.05] px-2 py-1 rounded-full uppercase tracking-wider shrink-0 mt-0.5">Mentira {String(idx + 1).padStart(2, '0')}</span>
                  <p className="text-white/50 text-sm font-medium italic">"{item.lie}"</p>
                </div>
                <div className="ml-0 md:ml-16 pl-4 border-l border-[#E29E84]/20">
                  <p className="text-white/70 text-sm leading-relaxed">{item.truth}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 md:py-44 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E29E84]/[0.04] blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-[700px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeInUp} custom={0} className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-8">
              WINF Executive Board
            </motion.span>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-tight">
              Seu network.<br/>Nossa infraestrutura.
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2} className="text-white/40 text-base leading-relaxed mb-14 font-light">
              Os parceiros WINF interagem diretamente no W.A.R.P. Command para fechar grandes contratos. Se você possui acessos em empresas de facilities, construtoras e arquitetura corporativa, esta é sua operação.
            </motion.p>

            {/* Checklist */}
            <motion.div variants={fadeInUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              {[
                "Risco de Caixa Zerado",
                "Logística em 24h",
                "Leads AAA Diretos",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-white/50 uppercase tracking-[0.15em]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E29E84" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.button
              variants={fadeInUp}
              custom={4}
              onClick={handleWhatsApp}
              className="mx-auto px-12 py-5 bg-white text-black text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-white/90 active:scale-[0.97] transition-all flex items-center justify-center gap-3 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Iniciar Processo de Admissão
            </motion.button>

            <motion.p variants={fadeInUp} custom={5} className="text-[10px] text-white/25 uppercase tracking-[0.2em] mt-6">
              Tempo estimado: 02:40 minutos · 1 Parceiro por região
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer minimal ── */}
      <footer className="py-8 border-t border-white/[0.06] text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">© 2026 WINF™ — Engenharia Invisível em Vidro. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPartners;
