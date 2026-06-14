import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BrainCircuit, Activity, ChevronRight, Zap, Target, Cpu } from 'lucide-react';
import { ViewState } from '../../types';

interface WinfOnboardingProps {
  onComplete: () => void;
  onSelectPath: (path: 'BUSINESS' | 'TECH') => void;
}

export const WinfOnboarding: React.FC<WinfOnboardingProps> = ({ onComplete, onSelectPath }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 bg-[#131314] text-white overflow-hidden flex flex-col font-sans selection:bg-white/20">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#444746]" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#444746]" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#444746]" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#444746]" />

      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-2xl"
            >
              <div className="flex justify-center mb-6">
                <Shield className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                WINF OS <span className="opacity-50">INITIALIZED</span>
              </h1>
              <p className="text-sm md:text-base font-mono text-[#71717a] mb-12 uppercase tracking-widest leading-relaxed">
                Bem-vindo à nova plataforma unificada da Advanced Window Film.
                <br/>
                Gestão comercial avançada e operação técnica de películas inteligentes em um só lugar.
              </p>
              
              <button 
                onClick={nextStep}
                className="group flex items-center justify-between w-full max-w-sm mx-auto bg-white text-black px-6 py-4 font-mono font-bold uppercase tracking-widest hover:bg-[#fafafa] transition-colors"
              >
                <span>INICIAR SETUP</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-4xl"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">DUAL ARCHITECTURE</h2>
              <p className="text-xs font-mono text-[#71717a] uppercase tracking-widest mb-10">
                O WINF OS agora opera em dois núcleos fundamentais. Escolha sua visão principal (você poderá alterar isso depois):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Modulo 1: Business */}
                <button 
                  onClick={() => {
                    onSelectPath('BUSINESS');
                    nextStep();
                  }}
                  className="bg-[#18181b] border border-[#444746] p-8 text-left hover:border-white/40 transition-all group relative overflow-hidden flex flex-col h-full min-h-[280px]"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white/5 border border-[#444746] flex items-center justify-center">
                        <Target size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4d4d8]">MÓDULO</h3>
                        <h2 className="text-xl font-bold uppercase tracking-tight text-white">BUSINESS CORE</h2>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-[#71717a] uppercase tracking-widest leading-relaxed mb-6 flex-1">
                      Para Gestores, Franqueados e Arquitetos.
                      Gerencie CRM de vendas, orçamentos inteligentes via IA, gestão de estoque, garantias vitalícias e rede de relacionamento.
                    </p>
                    <div className="text-[10px] font-mono border-b border-[#444746] pb-2 mb-2 w-full text-white/50 group-hover:text-white transition-colors flex justify-between uppercase">
                      <span>Selecionar Caminho</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </button>

                {/* Modulo 2: Tech */}
                <button 
                  onClick={() => {
                    onSelectPath('TECH');
                    nextStep();
                  }}
                  className="bg-[#18181b] border border-[#444746] p-8 text-left hover:border-white/40 transition-all group relative overflow-hidden flex flex-col h-full min-h-[280px]"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white/5 border border-[#444746] flex items-center justify-center">
                        <Activity size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-[#d4d4d8]">MÓDULO</h3>
                        <h2 className="text-xl font-bold uppercase tracking-tight text-white">TECH & IoT CORE</h2>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-[#71717a] uppercase tracking-widest leading-relaxed mb-6 flex-1">
                      Para Técnicos, Operadores e Instaladores Master.
                      Controle de películas em tempo real (MQTT), telemetria ambiental, comandos Iot e monitoramento de ativos do cliente.
                    </p>
                    <div className="text-[10px] font-mono border-b border-[#444746] pb-2 mb-2 w-full text-white/50 group-hover:text-white transition-colors flex justify-between uppercase">
                      <span>Selecionar Caminho</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-2xl"
            >
              <div className="flex justify-center mb-6">
                <BrainCircuit className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                WINF BRAIN <span className="opacity-50">ONLINE</span>
              </h1>
              <p className="text-sm md:text-base font-mono text-[#71717a] mb-12 uppercase tracking-widest leading-relaxed">
                Toda a plataforma é assistida pelos agentes inteligentes do Winf OS.
                Do roteamento de leads à otimização de temperatura das películas.
                O sistema é vivo.
              </p>
              
              <button 
                onClick={onComplete}
                className="group flex items-center justify-center gap-4 w-full max-w-sm mx-auto bg-white text-black px-6 py-4 font-mono font-bold uppercase tracking-widest hover:bg-[#fafafa] transition-colors"
                >
                <Zap size={18} className="text-black group-hover:animate-pulse" />
                <span>INICIAR SISTEMA</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-300 ${step === i ? 'w-12 bg-white' : 'w-4 bg-white/20'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default WinfOnboarding;
