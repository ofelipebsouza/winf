import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Play, RefreshCw, Layers, Sliders, ShieldCheck, Cpu, ArrowRightLeft, LayoutGrid, Check, AlertCircle } from 'lucide-react';

interface CLIHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

interface CalibrationToken {
  name: string;
  value: string;
  status: 'CALIBRATED' | 'COMPLIANT' | 'OPTIMUM';
  metric: number; // Percentage
}

export const WinfCliSimulator: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('winf-cli init --phase 1 --strict-visual-compliance --responsive-grid=true');
  const [history, setHistory] = useState<CLIHistoryItem[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionPhase, setExecutionPhase] = useState<number>(0); // 0-6
  const [isCalibratedStatus, setIsCalibratedStatus] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Monitor real-time screen resize to showcase true responsive grid compliance live!
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // Initial welcome log
    setHistory([
      {
        id: 'initial',
        command: 'systeminfo --firmware',
        output: (
          <div className="space-y-1 text-zinc-400 font-mono text-[11px] leading-relaxed">
            <p className="text-zinc-500">{"// --- WINF OS™ SECURE IGNITION INTERACTION SHELL ---"}</p>
            <p>CORE SYSTEM VERSION: 4.9.1-NUCLEUS</p>
            <p>DESIGN SYSTEM AGENT ID: <span className="text-cyan-400">DS-8801A</span></p>
            <p>HARDWARE STATUS: <span className="text-[#00ff41]">READY</span></p>
            <p>RESPONSIVE MATRIX CONFIGURATION: V2_FLEX_GRID</p>
            <p className="text-white/40">Gatilho de auto-calibração disponível. Execute o comando WINF-CLI abaixo para iniciar conformidade rígida.</p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, executionPhase, isExecuting]);

  const getResponsiveBreakpoint = () => {
    if (viewportWidth < 640) return { name: 'mobile (xs/sm)', color: 'text-red-400', range: '< 640px' };
    if (viewportWidth < 768) return { name: 'tablet (sm/md)', color: 'text-yellow-400', range: '640px - 768px' };
    if (viewportWidth < 1024) return { name: 'laptop (md/lg)', color: 'text-cyan-400', range: '768px - 1024px' };
    if (viewportWidth < 1280) return { name: 'desktop (lg/xl)', color: 'text-emerald-400', range: '1024px - 1280px' };
    return { name: 'ultra-wide (xl/2xl)', color: 'text-[#00ff41]', range: '> 1280px' };
  };

  const executeCommand = async (cmdText: string) => {
    const commandToExec = cmdText.trim();
    if (!commandToExec) return;

    setIsExecuting(true);
    setInputVal('');

    // Pre-insert typed command into history block
    const commandId = `cmd-${Date.now()}`;
    
    if (commandToExec.toLowerCase().includes('winf-cli init') && commandToExec.includes('--strict-visual-compliance')) {
      // Trigger multi-stage compliance cinematic experience
      setExecutionPhase(1);
      await new Promise(r => setTimeout(r, 600));
      setExecutionPhase(2);
      await new Promise(r => setTimeout(r, 850));
      setExecutionPhase(3);
      await new Promise(r => setTimeout(r, 700));
      setExecutionPhase(4);
      await new Promise(r => setTimeout(r, 900));
      setExecutionPhase(5);
      await new Promise(r => setTimeout(r, 600));
      setExecutionPhase(6);
      await new Promise(r => setTimeout(r, 400));

      setIsCalibratedStatus(true);
      
      const bp = getResponsiveBreakpoint();

      const newHistoryItem: CLIHistoryItem = {
        id: commandId,
        command: commandToExec,
        output: (
          <div className="space-y-4 font-mono text-[11px] leading-relaxed mt-2 p-4 bg-[#09090b] border border-[#00ff41]/20">
            <div className="flex items-center gap-2 text-[#00ff41]">
              <ShieldCheck size={16} />
              <span className="font-bold uppercase tracking-wider">IGNITION PHASE 1 CONCLUÍDA COM RIGOR COMPACTO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#444746]">
              <div className="space-y-1.5">
                <p className="text-zinc-500 uppercase text-[9px] tracking-widest font-bold">GRID RESPONSIVO ATALHO</p>
                <div className="flex justify-between border-b border-[#444746] pb-1">
                  <span className="text-white/50">Breakpoint Ativo:</span>
                  <span className={`font-bold ${bp.color} uppercase`}>{bp.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#444746] pb-1">
                  <span className="text-white/50">Resolução de Viewport:</span>
                  <span className="text-white">{viewportWidth}px ({bp.range})</span>
                </div>
                <div className="flex justify-between border-b border-[#444746] pb-1">
                  <span className="text-white/50">Fluid Box Constraints:</span>
                  <span className="text-[#00ff41]">ASPECT_RATIO_LOCKED (16:9)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-zinc-500 uppercase text-[9px] tracking-widest font-bold">DESIGN SYSTEM STATUS</p>
                <div className="flex justify-between border-b border-[#444746] pb-1">
                  <span className="text-white/50">Inter Sans-Serif:</span>
                  <span className="text-emerald-400">ACTIVE (300-900)</span>
                </div>
                <div className="flex justify-between border-b border-[#444746] pb-1">
                  <span className="text-white/50">JetBrains Mono:</span>
                  <span className="text-emerald-400">LOADED (400-700)</span>
                </div>
                <div className="flex justify-between border-b border-[#444746] pb-1">
                  <span className="text-white/50">Visual Theme:</span>
                  <span className="text-white uppercase">Cosmic Matte Dark (Strict)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-zinc-500 block mb-1">CUMPRIMENTO DAS REGRAS DE LAYOUT GERAIS:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                <div className="bg-[#131314]/40 border border-[#00ff41]/20 p-2 text-center text-[#00ff41]">
                  ✓ CONTRASTE SEGURO (21:1)
                </div>
                <div className="bg-[#131314]/40 border border-[#00ff41]/20 p-2 text-center text-[#00ff41]">
                  ✓ NO IN-APP THEME FLICKER
                </div>
                <div className="bg-[#131314]/40 border border-[#00ff41]/20 p-2 text-center text-[#00ff41]">
                  ✓ REAL-TIME RENDER RESISTANT
                </div>
              </div>
            </div>

            <p className="text-[#00ff41] font-bold mt-2">--- AUDITORIA DE COMPLIANCE VISUAL COMPLETA: 100% PASS ---</p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString()
      };

      setHistory(prev => [...prev, newHistoryItem]);
    } else if (commandToExec.toLowerCase() === 'help') {
      const newHistoryItem: CLIHistoryItem = {
        id: commandId,
        command: commandToExec,
        output: (
          <div className="space-y-1 text-zinc-400 font-mono text-[11px] leading-relaxed">
            <p className="text-white">Opções de Comandos WINF OS™ Clé-Générale:</p>
            <p className="text-zinc-500 font-normal">-----------------------------------------------------</p>
            <p><span className="text-[#00ff41] font-bold">winf-cli init --phase 1 --strict-visual-compliance --responsive-grid=true</span></p>
            <p className="pl-4 text-zinc-500">Inicializa a calibração de grid design system tático.</p>
            <p><span className="text-cyan-400 font-bold">system-status</span></p>
            <p className="pl-4 text-zinc-500">Exibe integridade de viewport e tokens ativos.</p>
            <p><span className="text-yellow-500 font-bold">clear</span></p>
            <p className="pl-4 text-zinc-500">Limpa todo o histórico do terminal.</p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [...prev, newHistoryItem]);
    } else if (commandToExec.toLowerCase() === 'system-status') {
      const bp = getResponsiveBreakpoint();
      const newHistoryItem: CLIHistoryItem = {
        id: commandId,
        command: commandToExec,
        output: (
          <div className="space-y-1.5 text-zinc-400 font-mono text-[11px] leading-relaxed">
            <p className="text-white font-bold">WINF NETWORK CORE DIAGNOSTICS:</p>
            <p>ACTIVE RESOLUTION: {viewportWidth}px (Width) x {typeof window !== 'undefined' ? window.innerHeight : 800}px (Height)</p>
            <p>ACTIVE GRID STACK: Tailwind v4.0.0 Integrated Compiler</p>
            <p>ESTADO DE RESPONSIVIDADE: <span className={`${bp.color} font-bold uppercase`}>{bp.name}</span></p>
            <p>PERMISSÕES ATIVAS DE CÂMERA/LOCALIZAÇÃO: DECLARED IN METADATA.JSON</p>
            <p>SUITE INTEGRATION STATUS: <span className="text-[#00ff41]">SHIELDS STABLE</span></p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [...prev, newHistoryItem]);
    } else if (commandToExec.toLowerCase() === 'clear') {
      setHistory([]);
      setIsExecuting(false);
      setExecutionPhase(0);
      return;
    } else {
      // Unknown command fallback
      const newHistoryItem: CLIHistoryItem = {
        id: commandId,
        command: commandToExec,
        output: (
          <div className="space-y-1 text-red-400 font-mono text-[11px] leading-relaxed">
            <p className="flex items-center gap-1"><AlertCircle size={12} /> ERRO: COMANDO DESCONHECIDO NO WINF NUCLEUS</p>
            <p className="text-zinc-500">Digite <span className="text-white underline cursor-pointer" onClick={() => setInputVal('help')}>help</span> para visualizar comandos operacionais autorizados.</p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [...prev, newHistoryItem]);
    }

    setIsExecuting(false);
    setExecutionPhase(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const handleAutocompleteClick = () => {
    setInputVal('winf-cli init --phase 1 --strict-visual-compliance --responsive-grid=true');
  };

  const dummyCalibrationTokens: CalibrationToken[] = [
    { name: 'Grid Breakpoint Match', value: 'FLUID DESKTOP', status: 'OPTIMUM', metric: 99.8 },
    { name: 'Contrast Ration Guard', value: '4.5:1 SECURE', status: 'COMPLIANT', metric: 100.0 },
    { name: 'Font Inter Integration', value: '300-900 WEIGHTS', status: 'CALIBRATED', metric: 98.5 },
    { name: 'Dark Slate Aspect Ratio', value: 'SECURE CLAMP', status: 'COMPLIANT', metric: 97.2 },
  ];

  return (
    <div className="space-y-6" id="winf-cli-vphase-container">
      {/* Dynamic Viewport Compliance Panel */}
      <div className="bg-[#131314] border border-[#444746] p-5 rounded-none grid grid-cols-1 md:grid-cols-12 gap-6 hover:border-[#444746] transition-all select-none">
        
        {/* Dynamic break-down gauge */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#444746]">
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-[#00ff41]" />
              <span className="text-xs md:text-[10px] font-mono tracking-[0.25em] text-[#00ff41] font-black uppercase">
                IGNITION CALIBRATOR ENGINE
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
              <span className="inline-block w-1.5 h-1.5 bg-[#00ff41] animate-pulse"></span>
              SISTEMA INTEGRADO
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase text-white tracking-widest font-sans">Responsividade Live Viewport Gauge</span>
              <span className="font-mono text-xs text-[#00ff41] font-bold">{viewportWidth}px</span>
            </div>
            
            {/* Visual multi-segment bar indicating breakpoint range */}
            <div className="grid grid-cols-5 gap-1.5 h-3 bg-zinc-950 border border-[#444746] p-0.5">
              <div className={`h-full transition-colors duration-500 ${viewportWidth < 640 ? 'bg-red-500' : 'bg-red-500/20'}`} />
              <div className={`h-full transition-colors duration-500 ${viewportWidth >= 640 && viewportWidth < 768 ? 'bg-yellow-400' : 'bg-yellow-400/20'}`} />
              <div className={`h-full transition-colors duration-500 ${viewportWidth >= 768 && viewportWidth < 1024 ? 'bg-cyan-400' : 'bg-cyan-400/20'}`} />
              <div className={`h-full transition-colors duration-500 ${viewportWidth >= 1024 && viewportWidth < 1280 ? 'bg-emerald-400' : 'bg-emerald-400/10'}`} />
              <div className={`h-full transition-colors duration-500 ${viewportWidth >= 1280 ? 'bg-[#00ff41]' : 'bg-[#00ff41]/10'}`} />
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest pt-1">
              <span>Mobile (xs)</span>
              <span>Tablet (sm)</span>
              <span>Laptop (md)</span>
              <span>Desktop (lg)</span>
              <span>Ultra (xl)</span>
            </div>
          </div>
        </div>

        {/* Live audit info */}
        <div className="md:col-span-4 bg-zinc-950/60 border border-[#444746] p-4 flex flex-col justify-between min-h-[120px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">VISUAL COMPLIANCE CHECK</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-500/5 px-1 rounded-none font-mono">OK</span>
            </div>
            <p className="text-sm font-black text-white uppercase tracking-tight mt-2">RIGOR PROFISSIONAL ACTIVO</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 leading-normal">
              Controles de layout bloqueados. Alinhamento de contorno, fontes e contraste estão validados e selados sob especificação W12.
            </p>
          </div>
          <div className="border-t border-[#444746] pt-2 flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-500">COMPLIANCE SEAL:</span>
            <span className="text-[#00ff41] font-bold">WxF-Design-Pass</span>
          </div>
        </div>

      </div>

      {/* Main Interactive Terminal Body */}
      <div className="bg-[#131314] border border-[#444746] rounded-none overflow-hidden flex flex-col h-[520px] shadow-[0_15px_60px_rgba(0,0,0,0.8)]">
        
        {/* CLI Header bar */}
        <div className="bg-[#131314] border-b border-[#444746] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="text-white" size={15} />
            <span className="font-mono text-xs text-white/80 uppercase font-black tracking-widest">
              WINF SECURE SHELL TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="text-zinc-500">PORT: <strong className="text-white">3000</strong></span>
            <span className="text-zinc-500">HOST: <strong className="text-[#00ff41]">LOCAL</strong></span>
          </div>
        </div>

        {/* Console Print Log Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-[#131314]/90 tracking-normal custom-scrollbar select-text selection:bg-white selection:text-black">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                <span className="text-rose-500">WINF-OS:~ operator$</span>
                <span className="text-white font-bold">{item.command}</span>
                <span className="text-[9px] text-zinc-600 block shrink-0 ml-auto">{item.timestamp}</span>
              </div>
              <div className="pl-4 border-l border-zinc-800/40">
                {item.output}
              </div>
            </div>
          ))}

          {/* Rendering the active multi-step calibration ticker if command is executing online */}
          {isExecuting && (
            <div className="space-y-2 font-mono text-[11px] text-zinc-400 border-l border-cyan-500/50 pl-4 py-1">
              <div className="flex items-center gap-2 text-yellow-500">
                <RefreshCw className="animate-spin" size={12} />
                <span className="font-bold">INITIALIZING CORE WINF-CLI IN ENVIRONMENT PHASES...</span>
              </div>
              
              {executionPhase >= 1 && (
                <p className="text-emerald-400">✅ [STAGE 1] IGNITION LAUNCHED: VALIDATING CORE MODULES NODES...</p>
              )}
              {executionPhase >= 2 && (
                <p className="text-emerald-400">✅ [STAGE 2] INTEGRATED ARGUMENTS PARSING: &ldquo;--strict-visual-compliance&rdquo; SECURED...</p>
              )}
              {executionPhase >= 3 && (
                <p className="text-emerald-400">✅ [STAGE 3] VERIFYING REUSE OF RESPONSIVE MULTI-BREAKPOINT LAYOUTS...</p>
              )}
              {executionPhase >= 4 && (
                <p className="text-emerald-400">✅ [STAGE 4] CALIBRATING SYSTEM TOKENS &amp; MONOSPACE COURIER ELEMENTS...</p>
              )}
              {executionPhase >= 5 && (
                <p className="text-emerald-400">✅ [STAGE 5] TESTING ASPECT-RATIO FLUID LOCK AND FONT SCALE CLAMP...</p>
              )}
              {executionPhase >= 6 && (
                <p className="text-emerald-400">✅ [STAGE 6] COMPILING CONFORMANCE METRICS INDEX... COMPLETE.</p>
              )}
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Command Helper Autocomplete Suggestions panel */}
        <div className="bg-[#09090b] border-t border-[#444746] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Dica de Comando:</span>
            <button 
              onClick={handleAutocompleteClick}
              className="text-[10px] font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/20 hover:bg-cyan-400/15 py-1 px-2.5 transition-colors text-left"
            >
              winf-cli init --phase 1 --strict-visual-compliance --responsive-grid=true
            </button>
          </div>
          <p className="text-[10px] font-mono text-zinc-500">
            Digite <span className="underline text-white pointer" onClick={() => executeCommand('help')}>help</span> no shell para ver opções.
          </p>
        </div>

        {/* Input Prompt Form */}
        <form onSubmit={handleSubmit} className="bg-[#131314] border-t border-[#444746] p-3.5 flex items-center gap-3">
          <div className="text-rose-500 font-mono text-[11px] font-bold select-none shrink-0 pl-1.5 flex items-center gap-1">
            <span>WINF-OS:~ operator$</span>
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-white font-mono text-xs md:text-[11px] focus:outline-none focus:ring-0 placeholder-zinc-700 font-bold select-text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isExecuting}
            placeholder="Type standard command here..."
          />
          <button
            type="submit"
            disabled={isExecuting}
            className="shrink-0 font-mono text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-[#00ff41] hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5 transition-all select-none disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
          >
            <Play size={10} fill="currentColor" /> RUN
          </button>
        </form>

      </div>

      {/* Grid compliance status if calibrated */}
      <AnimatePresence>
        {isCalibratedStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
          >
            {dummyCalibrationTokens.map((token, index) => (
              <div key={index} className="bg-[#131314] border border-[#00ff41]/20 p-4 space-y-3 relative hover:border-white transition-all select-none">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">{token.name}</span>
                  <span className="text-[9px] font-mono text-[#00ff41] bg-[#00ff41]/5 px-1.5 border border-[#00ff41]/20">
                    {token.status}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                    <span>Calibration Percent:</span>
                    <span className="text-white font-bold">{token.metric}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-[#00ff41]" style={{ width: `${token.metric}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-mono border-t border-[#444746] pt-2">
                  <span className="text-white/40">Registered Value:</span>
                  <span className="text-white font-bold">{token.value}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WinfCliSimulator;
