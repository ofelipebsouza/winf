import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Lock, TrendingUp, Shield, Globe, Crown, MapPin, Eye } from 'lucide-react';

interface LandingUniversoDarkProps {
  onBack: () => void;
  onEnterRestricted: () => void;
}

const LandingUniversoDark: React.FC<LandingUniversoDarkProps> = ({ onBack, onEnterRestricted }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Background Noise/Grid */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]" 
        style={{ backgroundImage: `linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      ></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-900/40 rounded-none blur-[120px] pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none bg-gradient-to-b from-[#020202] to-transparent">
        <div className="flex items-center gap-6 pointer-events-auto">
          {onBack && (
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors bg-white/5 px-4 py-2 border border-[#444746] shadow-sm"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retornar
            </button>
          )}
        </div>
        <div className="font-bold tracking-[0.3em] text-[10px] uppercase text-white/50 bg-white/5 px-4 py-2 border border-[#444746] backdrop-blur-sm pointer-events-auto flex items-center gap-2">
            <Shield size={12} className="text-zinc-500" /> WINF™ CAPITAL
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col justify-center pt-32 pb-24 px-6 md:px-12 border-b border-[#444746] overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 flex flex-col items-center gap-4">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-none animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 border border-[#444746] px-4 py-1.5 bg-white/5">
                WINF Partners // Investimentos Estratégicos & Capital Advisory
              </span>
            </div>
            
            <h1 className="text-5xl md:text-[8rem] font-bold tracking-tighter leading-[0.9] text-white mb-6 uppercase">
              UNIVERSO <span className="font-light italic text-white/40">DARK</span>
            </h1>

            <h2 className="text-xs md:text-sm uppercase font-sans tracking-[0.3em] text-zinc-400 mb-8 max-w-fit mx-auto font-semibold">
              TERMINAL DE GOVERNANÇA
            </h2>
            
            <p className="text-lg md:text-2xl font-light text-white/60 mb-12 max-w-3xl leading-relaxed">
              Governança corporativa lastreada em ativos reais. Monitoramos a cadeia de suprimentos globais, gerenciamos a distribuição de insumos em tempo real e garantimos transparência radical para os membros do conselho.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center w-full max-w-xl">
              <button 
                onClick={onEnterRestricted}
                className="w-full bg-white text-black flex items-center justify-center gap-4 px-8 py-5 hover:bg-white/80 transition-colors group"
              >
                <Lock size={18} className="text-black group-hover:scale-110 transition-transform" />
                <span className="font-bold text-[10px] md:text-sm uppercase tracking-[0.3em]">
                  Acessar Área Restrita
                </span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-[10px] uppercase font-mono tracking-widest">Explore a Tese</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"></div>
        </motion.div>
      </section>

      {/* The Thesis */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 font-sans">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
                        A Máquina de <br/><span className="text-white/40 italic">Equity</span>
                    </h2>
                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                        Enquanto o mercado convencional comercializa apenas marcas, nós consolidamos uma infraestrutura de distribuição e inteligência logística centralizada: a BlackShop B2B. Nosso modelo operacional é focado em eficiência e escalabilidade: lideramos a distribuição de tecnologia de superfícies através de uma rede descentralizada de aplicadores e Lojas Base em modelo Asset-Light, integrados contratualmente ao fornecido da matriz.
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#444746]">
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-2">Target Yield</p>
                            <p className="text-3xl font-bold text-white">12-18% <span className="text-sm font-normal text-zinc-400">a.a.</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-2">Target Valuation</p>
                            <p className="text-3xl font-bold text-white">R$ 1B+ <span className="text-xs font-normal text-zinc-400 block mt-1">(Visão Macro)</span></p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: 'The First 100', desc: 'Expansão estratégica garantindo capilaridade operacional e rentabilidade sólida na linha de frente.', icon: <TrendingUp className="text-white/45" /> },
                        { title: 'W12 Board (Conselho)', desc: '12 cadeiras de governança global. Alinhamento estratégico e participação no topo da cadeia patrimonial.', icon: <Crown className="text-white/45" /> },
                        { title: 'BlackShop B2B', desc: 'Uma distribuidora central que gerencia e fornece a matéria-prima homologada para toda a malha de atendimento.', icon: <Globe className="text-white/45" /> },
                        { title: 'Liderança Territorial', desc: 'Ocupação de praças polo através dos Studios Flagship dedicados às tecnologias do ecossistema.', icon: <MapPin className="text-white/45" /> },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 border border-[#444746] p-8 hover:bg-white/10 transition-colors rounded-none">
                            <div className="mb-6">{item.icon}</div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">{item.title}</h3>
                            <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Call to Action Data Room */}
      <section className="py-40 px-6 md:px-12 bg-[#131314] border-t border-[#444746] relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
                <Eye size={48} className="text-zinc-700 mx-auto mb-8" />
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white">
                    Solicite o seu lugar<br/>no Conselho Global
                </h2>
                <p className="text-sm md:text-base text-zinc-400 font-normal mb-12 max-w-2xl mx-auto leading-relaxed">
                    O acesso ao Data Room, relatórios de auditoria, estruturação jurídica e informações sobre as cadeiras do Conselho W12 são restrições restritas. Acesse a área restrita utilizando suas credenciais autorizadas.
                </p>
                <button 
                  onClick={onEnterRestricted}
                  className="bg-transparent text-white border border-white/30 px-12 py-5 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                >
                    Entrar no Universo Dark
                </button>
            </div>
      </section>
    </div>
  );
};

export default LandingUniversoDark;
