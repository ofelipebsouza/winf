import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlobalHeader } from "./GlobalHeader";
import {
  ArrowLeft,
  Shield,
  Lock,
  ChevronRight,
  CheckCircle2,
  Eye,
  Timer,
  Play,
  RotateCcw,
  Sliders,
  Cpu,
  Fingerprint,
  Building,
  Mail,
  User,
  Zap,
  Check
} from "lucide-react";

interface LandingAeroCoreProps {
  onBack: () => void;
  onNavigateToCatalog?: () => void;
  onNavigateToNeoskin?: () => void;
}

// Simulated logarithmic logs for the registration console
const LOG_MESSAGES = [
  "SYSTEM_INIT: Habilitando porta criptográfica segura...",
  "SECURE_GATEWAY: Conexão estritamente restrita ativada.",
  "COMPLIANCE_ENGINE: Iniciando verificação de raio de exclusividade postal...",
  "LOGISTICS_NET: Conexão direta aos Hubs BlackShop™ estabelecida.",
  "WNF_COGNITIVE: Operador Neural W-NO™ em escuta ativa.",
];

export const LandingAeroCore: React.FC<LandingAeroCoreProps> = ({
  onBack,
  onNavigateToCatalog,
  onNavigateToNeoskin
}) => {
  const [view, setView] = useState<"request" | "login" | "success" | "preview">("request");
  const [timeLeft, setTimeLeft] = useState(25);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([LOG_MESSAGES[0]]);
  const [nestingOptimized, setNestingOptimized] = useState(false);
  const [infraredSlider, setInfraredSlider] = useState(75); // initial external heat temp input
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    veiculo: "",
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logic for custom logs
  useEffect(() => {
    if (view === "request" || view === "login") {
      const interval = setInterval(() => {
        setTerminalLogs((prev) => {
          if (prev.length >= LOG_MESSAGES.length) {
            return [LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]];
          }
          return [...prev, LOG_MESSAGES[prev.length]];
        });
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [view]);

  // Demo timeout countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === "preview" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (view === "preview" && timeLeft === 0) {
      setView("request");
      setTimeLeft(25);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view, timeLeft]);

  // Log user activity
  const handleFormChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setTerminalLogs((prev) => [
      ...prev,
      `USER_INPUT: Alocação do campo [${field.toUpperCase()}] alterada com sucesso.`,
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "request") {
      setTerminalLogs((prev) => [
        ...prev,
        "COMPLIANCE_VERIFIED: Dados em total conformidade socioeconômica.",
        "SYSTEM_DISPATCH: Tenant ID emitido para processador securitário...",
      ]);
      setView("success");
    } else {
      onBack();
    }
  };

  // Nesting polygons simulation coords
  const randomBlocks = [
    { id: 1, w: 90, h: 60, title: "Car Glass F", optimizedX: 5, optimizedY: 5 },
    { id: 2, w: 140, h: 50, title: "Side glass R", optimzedX: 100, optimizedY: 5 },
    { id: 3, w: 80, h: 80, title: "Glass Sun", optimizedX: 5, optimizedY: 70 },
    { id: 4, w: 60, h: 40, title: "Side glass L", optimizedX: 90, optimizedY: 70 },
    { id: 5, w: 110, h: 35, title: "Rear Glass B", optimizedX: 155, optimizedY: 70 }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-white/20 relative overflow-x-hidden">
      
      {/* GRID VECTOR OVERLAY - Inspired by figure.ai */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      {/* GLOBAL HEADER - Built exactly per specification */}
      <GlobalHeader 
        activeItem="none" 
        onNavigate={(view) => {
          onBack();
        }}
      />

      {/* Sub Back Link for aesthetic alignment */}
      <div className="bg-[#030303] border-b border-white/[0.03] px-6 py-2 relative z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] font-mono group"
          >
            <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Nexus</span>
          </button>
          <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-600 uppercase">
            AEROCORE™ // INTERFACE SECURE NODE_01
          </span>
        </div>
      </div>

      {/* VIEW DETERMINATION */}
      <AnimatePresence mode="wait">
        
        {/* PREVIEW VIEW (Landing / Catalog presentation on Figure.ai level) */}
        {view === "preview" ? (
          <motion.div
            key="preview-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-[calc(100vh-60px)] pb-16"
          >
            {/* Countdown floating notification */}
            <div className="fixed top-[65px] left-0 w-full bg-blue-600/90 backdrop-blur-md z-[100] px-6 py-2.5 flex justify-between items-center text-white border-b border-blue-500/50">
              <div className="flex items-center gap-2">
                <Timer size={14} className="animate-spin text-white" />
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em]">
                  DE_GUSTAÇÃO: ACESSO TEMPORÁRIO AO SISTEMA DE MARCA
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono font-bold tabular-nums bg-[#131314]/40 px-3 py-1 border border-[#444746]">
                  {timeLeft} SECONDS REMAINING
                </span>
                <button
                  onClick={() => setView("request")}
                  className="bg-white text-black px-3 py-1 text-[11px] uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Encerrar
                </button>
              </div>
            </div>

            {/* HERO SECTION - GIGANTIC ROBOT W-NO HELMET RENDERING */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-6 border-b border-white/[0.05] pt-24 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_60%)]" />

              <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
                
                {/* HERO COPY - LEFT */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/[0.06] bg-white/[0.02] text-zinc-400 text-[10px] font-mono uppercase tracking-[0.45em] mb-8 w-fit">
                    <Cpu size={12} className="text-blue-500 animate-pulse" />
                    <span>SYSTEM CORE ACTIVATED // W-NO™</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.9] text-white">
                    AEROCORE<span className="text-blue-500 font-light">®</span>
                  </h1>

                  <p className="text-zinc-400 font-mono text-xs uppercase tracking-[0.23em] mb-4">
                    THERMAL BARRIER TECHNOLOGY BY WINFOS™
                  </p>

                  <div className="h-0.5 w-24 bg-blue-500/50 mb-8" />

                  <p className="text-lg text-zinc-300 font-light max-w-xl mb-10 leading-relaxed">
                    Nascida com investimento tecnológico avançado em termodinâmica espacial. 
                    A AeroCore® da Winf™ foi adaptada para criar a barreira definitiva de proteção solar em projetos de alto padrão, isolando calor extremo sem alterar espectros óticos ou privacidade.
                  </p>

                  {/* MINI SPECS DASHBOARD */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="border border-[#444746] bg-[#090909] p-4 font-mono">
                      <div className="text-[10px] text-zinc-500 tracking-wider">INFRA_BARRIER</div>
                      <div className="text-xl font-bold mt-1 text-white">98.3% Rejection</div>
                    </div>
                    <div className="border border-[#444746] bg-[#090909] p-4 font-mono">
                      <div className="text-[10px] text-zinc-500 tracking-wider">LIFETIME_GUARANTEE</div>
                      <div className="text-xl font-bold mt-1 text-white">Class-1 Certification</div>
                    </div>
                    <div className="border border-[#444746] bg-[#090909] p-4 font-mono col-span-2 md:col-span-1">
                      <div className="text-[10px] text-zinc-500 tracking-wider">THERMO_DECAY</div>
                      <div className="text-xl font-bold mt-1 text-blue-400">-12°C Delta T</div>
                    </div>
                  </div>
                </div>

                {/* HELMET VISUALIZER - RIGHT (Interactive CSS-based model) */}
                <div className="lg:col-span-5 flex justify-center items-center relative">
                  <div className="absolute -inset-10 bg-blue-500/5 rounded-none blur-[120px] pointer-events-none" />
                  
                  {/* W-NO CUSTOM RENDERING */}
                  <div className="w-80 h-96 bg-[#090909] border border-[#444746] rounded-none p-6 relative flex flex-col items-center justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Top matrix indices */}
                    <div className="w-full flex justify-between items-center text-[8px] font-mono text-zinc-600">
                      <span>CHASSIS_ID: NA-01</span>
                      <span>LOC: 45.289° N</span>
                    </div>

                    {/* Cybernetic head casing */}
                    <div className="relative w-56 h-56 mt-4 flex items-center justify-center">
                      {/* Outer Matte carbon carbon ring */}
                      <div className="absolute inset-x-0 inset-y-0 border-4 border-zinc-800 rounded-none bg-gradient-to-br from-[#121212] to-black flex items-center justify-center">
                        {/* Exposed metal articulation lines */}
                        <div className="absolute inset-1 border border-zinc-700/50 rounded-none" />
                        
                        {/* Face polished black glass */}
                        <div className="w-[88%] h-[88%] bg-[#131314] rounded-none shadow-inner relative overflow-hidden flex items-center justify-center">
                          {/* Pulser LED Ring representation of W-NO face */}
                          <div className="absolute w-24 h-24 rounded-none border-4 border-blue-500/20 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-none border border-blue-400 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse" />
                          </div>

                          {/* Subtle vertical scanning light */}
                          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-blue-500/15 to-transparent w-full animate-scan pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom identity tag */}
                    <div className="w-full text-center mt-6">
                      <div className="text-[10px] font-mono text-zinc-500 tracking-[0.25em] uppercase">
                        W-NO™ (W-NO)
                      </div>
                      <div className="text-[9px] font-mono text-blue-400 tracking-wider uppercase mt-1">
                        SUPREME BRAND PRESENTATIVE
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* CORE INTERACTIVE SYSTEM: WINF OS™ ALGORITHMIC NESTING SIMULATOR */}
            <section className="py-24 px-6 border-b border-white/[0.05] bg-[#131314]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center md:text-left max-w-2xl mb-12">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-blue-500 uppercase block mb-3">
                    [ COMPUTATIONAL POWER ]
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-white mb-4">
                    WINF OS™ Algorithmic Nesting
                  </h2>
                  <p className="text-zinc-400 font-light">
                    O varejo tradicional joga material e margem financeira no lixo devido a cortes imprecisos. Nosso motor calcula o agrupamento geométrico exato das janelas na bobina da central BlackShop™ de modo a zerar sobras.
                  </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* INTERACTIVE BOARD SIMULATOR - LEFT */}
                  <div className="lg:col-span-7 bg-[#090909] border border-[#444746] p-6 rounded-none font-mono">
                    <div className="flex justify-between items-center border-b border-[#444746] pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] text-zinc-300">NESTING_SOLVER_RUNNING</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                        <span>WIDTH: 152cm</span>
                        <span>ROLL_LEN: 300cm</span>
                      </div>
                    </div>

                    {/* Simulation Field */}
                    <div className="relative w-full h-48 bg-[#131314]/40 border border-[#444746] rounded-none p-3 mb-6 overflow-hidden flex flex-col justify-between">
                      {/* Background bobina representation */}
                      <span className="absolute right-2 top-2 text-[8px] text-zinc-700 uppercase">
                        Bobina BlackShop™ Matéria-Prima
                      </span>

                      {/* Displaying Polygons representation */}
                      <div className="relative w-full h-full">
                        {/* Raw layout before optimize */}
                        {!nestingOptimized ? (
                          <div className="grid grid-cols-5 gap-3 h-full items-center">
                            {randomBlocks.map((block) => (
                              <motion.div 
                                key={block.id}
                                layoutId={`block-${block.id}`}
                                className="border border-red-500/30 bg-red-500/5 p-2 h-20 flex flex-col justify-between text-left rounded-none"
                              >
                                <span className="text-[8px] text-red-400 font-bold uppercase truncate">{block.title}</span>
                                <span className="text-[10px] text-zinc-400">{block.w}x{block.h}cm</span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative w-full h-full border border-blue-500/20 bg-blue-500/[0.02]">
                            {/* Unified Nesting layout */}
                            {randomBlocks.map((block) => (
                              <motion.div
                                key={block.id}
                                layoutId={`block-${block.id}`}
                                className="absolute border border-blue-500/50 bg-blue-500/10 p-1 flex flex-col justify-between rounded-none"
                                style={{
                                  width: `${block.w * 1.8}px`,
                                  height: `${block.h * 1.4}px`,
                                  left: `${block.optimizedX * 1.8}px`,
                                  top: `${block.optimizedY * 1.1}px`
                                }}
                              >
                                <span className="text-[7px] text-blue-300 font-bold truncate leading-none uppercase">{block.title}</span>
                                <span className="text-[8px] text-zinc-300 leading-none">{block.w}x{block.h}cm</span>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions and Metrics */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex gap-10">
                        <div>
                          <div className="text-[10px] text-zinc-500">CONSUMO_ESTIMADO</div>
                          <div className="text-xl font-bold text-white mt-1">
                            {nestingOptimized ? "184 cm" : "295 cm"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500">DESPERDÍCIO_MATERIAL</div>
                          <div className={`text-xl font-bold mt-1 transition-colors ${nestingOptimized ? "text-emerald-400" : "text-red-500"}`}>
                            {nestingOptimized ? "2.1% (Excepcional)" : "18.4% (Gargalo)"}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {nestingOptimized && (
                          <button
                            onClick={() => setNestingOptimized(false)}
                            className="bg-white/5 border border-[#444746] hover:bg-white/10 p-3 text-[11px] font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-center gap-2 group transition-all"
                          >
                            <RotateCcw size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => setNestingOptimized(true)}
                          disabled={nestingOptimized}
                          className={`flex-1 sm:flex-none p-3 px-6 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                            nestingOptimized 
                              ? "bg-emerald-500 text-black border border-emerald-500 cursor-not-allowed" 
                              : "bg-white text-black hover:bg-zinc-200"
                          }`}
                        >
                          <Sliders size={12} />
                          {nestingOptimized ? "PROCESSADO_NESTING" : "OTIMIZAR MAQUINA"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* LOGS DESCRIPTION - RIGHT */}
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                      Por que eficiência matemática importa?
                    </h3>
                    <p className="text-zinc-400 font-light leading-relaxed">
                      Cada corte manual errado, cada ponta ociosa de bobina parada na prateleira de instaladores diminui o ROI de caixa operacional. O WINF OS™ conecta de forma milimétrica as plantas de engenharia ao faturamento e suprimento descentralizado BlackShop™.
                    </p>
                    <ul className="space-y-3 font-mono text-[11px] text-zinc-500">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>INTEGRAÇÃO REAL-TIME COM OS PLOTTERS BLACKSHOP™</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>PREVISÃO AUTOMÁTICA DE CUSTOS DE FATURAMENTO</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>SUPORTE A FORMATOS CAD/POLIGONOS LIVRES</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </section>

            {/* THERMAL GAUGE SIMULATOR: RADIATION INTENSITY SLIDER */}
            <section className="py-24 px-6 border-b border-white/[0.05] bg-[#030303] relative">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* COPIERS - LEFT */}
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-blue-500 uppercase block mb-1">
                      [ EXTREM TOLERANCE CHECK ]
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-white mb-2">
                      Física Térmica sob Controle
                    </h2>
                    <p className="text-zinc-400 font-light leading-relaxed">
                      Simule a incidência de radiação infra vermelha solar (ondas térmicas curtas). O sistema AeroCore® rechaça até 98.3% do decaimento calórico, mantendo o ambiente interno refrigerado com esforço zero de energia.
                    </p>
                    <div className="bg-[#090909] border border-[#444746] p-4 rounded-none">
                      <div className="text-[10px] font-mono text-zinc-500">ENTREGA DE DADOS</div>
                      <p className="text-xs font-mono text-zinc-400 mt-2">
                        Película comum permite o superaquecimento rápido, enquanto AeroCore® estabiliza em níveis perfeitos de climatização.
                      </p>
                    </div>
                  </div>

                  {/* SLIDER AND GRAPHICS INTERFACE - RIGHT */}
                  <div className="lg:col-span-7 bg-[#090909] border border-[#444746] p-6 rounded-none font-mono">
                    <div className="mb-8">
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-3">
                        <span>TEMPERATURA AMBIENTE EXTERNA</span>
                        <span className="text-orange-400 font-bold">{infraredSlider}°C RADIAÇÃO</span>
                      </div>
                      <input 
                        type="range"
                        min="20"
                        max="120"
                        value={infraredSlider}
                        onChange={(e) => setInfraredSlider(Number(e.target.value))}
                        className="w-full accent-blue-500 bg-white/10 h-1 rounded-none cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4">
                      {/* Standard film thermal response */}
                      <div className="border border-[#444746] bg-[#131314]/40 p-4 rounded-none">
                        <div className="text-zinc-500 text-[10px] uppercase">Película Tradicional</div>
                        <div className="text-3xl font-extrabold text-red-400 mt-2">
                          {(infraredSlider * 0.76).toFixed(1)}°C
                        </div>
                        <div className="text-[9px] text-zinc-500 mt-2 uppercase tracking-tight">
                          Superaquecimento do habitáculo
                        </div>
                        <div className="w-full bg-white/5 h-1 mt-4 rounded-none overflow-hidden">
                          <div 
                            className="bg-red-400 h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, infraredSlider)}%` }}
                          />
                        </div>
                      </div>

                      {/* AeroCore thermal response */}
                      <div className="border border-[#444746] bg-blue-500/[0.02] p-4 rounded-none">
                        <div className="text-zinc-500 text-[10px] uppercase">AeroCore® Shield</div>
                        <div className="text-3xl font-extrabold text-blue-400 mt-2">
                          {(21 + (infraredSlider * 0.05)).toFixed(1)}°C
                        </div>
                        <div className="text-[9px] text-zinc-300 mt-2 uppercase tracking-tight font-bold">
                          Temperatura Estabilizada
                        </div>
                        <div className="w-full bg-white/10 h-1 mt-4 rounded-none overflow-hidden">
                          <div 
                            className="bg-blue-400 h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, 21 + (infraredSlider * 0.05))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* PRESTIGE GALLERY & WORKSPACES */}
            <section className="py-24 px-6 border-b border-white/[0.05] bg-[#131314]">
              <div className="max-w-7xl mx-auto">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-blue-500 uppercase block mb-3">
                      [ REALITY APPLICATIONS ]
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-white">
                      Universo de Domínio Técnico
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-light mt-3">
                      As soluções AeroCore® e NeoSkin® operando no ápice do luxo residencial, corporativo e automotivo de alta gama.
                    </p>
                  </div>
                  
                  {onNavigateToNeoskin && (
                    <button
                      onClick={onNavigateToNeoskin}
                      className="group flex flex-col items-start md:items-end p-2 border border-[#444746] bg-white/[0.02] hover:bg-white/5 transition-all rounded-none px-4 py-2"
                    >
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-1">
                        NEOSKIN AUTOMOTIVE SHIELD
                      </span>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="text-xs font-bold uppercase tracking-tight">Explore NeoSkin PPF</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: "AERO-01",
                      name: "Automotive Elite",
                      desc: "Filtragem absoluta para superesportivos e hipercarros.",
                      img: "https://images.unsplash.com/photo-1503376713601-383b7aa36cc2?auto=format&fit=crop&q=80&w=800"
                    },
                    {
                      id: "AERO-02",
                      name: "Aircraft Shield",
                      desc: "Tolerância térmica extrema para altíssimas altitudes.",
                      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800"
                    },
                    {
                      id: "AERO-03",
                      name: "Marine Core",
                      desc: "Resistência impenetrável contra salitre em embarcações.",
                      img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800"
                    },
                    {
                      id: "AERO-04",
                      name: "Architectural Glass",
                      desc: "Controle estético sem alteração ótica de fachadas corporativas.",
                      img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800"
                    }
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className="group relative h-96 overflow-hidden bg-[#131314] border border-[#444746]"
                    >
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      
                      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                        <span className="font-mono text-[10px] text-zinc-500">{item.id}</span>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white mt-1">{item.name}</h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed mt-2 max-w-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* COMPLETED CALL TO ACTION BUTTON */}
            <section className="py-24 px-6 text-center border-t border-[#444746] mt-auto bg-[#030303]">
              <div className="max-w-3xl mx-auto">
                <span className="font-mono text-[10px] tracking-[0.3em] text-blue-500 uppercase block mb-3">
                  [ CLOSED LOOP SYSTEM ]
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-6">
                  Pronto para a admissão?
                </h2>
                <p className="text-zinc-500 font-light mb-10 text-base">
                  Retorne para o formulário de admissão e envie suas coordenadas para herdar a exclusividade em sua região com o modelo Asset Light.
                </p>
                <button
                  onClick={() => setView("request")}
                  className="bg-white text-black font-black uppercase tracking-[0.2em] text-xs py-4 px-10 hover:bg-zinc-200 transition-colors"
                >
                  PREENCHER ADMISSÃO
                </button>
              </div>
            </section>

          </motion.div>
        ) : (
          /* PROCESS AND ADMISSION FORMS (Swiss high-tech terminal look) */
          <motion.div
            key="form-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          >
            
            {/* COPY WRITING & THEME HEADER - LEFT */}
            <div className="lg:col-span-6 flex flex-col justify-center select-none pt-4 lg:pt-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#444746] bg-white/5 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.45em] mb-8 w-fit backdrop-blur-sm">
                <Lock size={11} className="text-white/40" /> RETRISTO PARA CONVIDADOS CERTIFICADOS
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase mb-6 leading-tight text-white">
                Onde o mercado comum vende filmees, nós instalamos engenharia.
              </h1>

              <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500/80 to-transparent mb-8" />

              <p className="text-base text-zinc-400 mb-8 max-w-lg leading-relaxed">
                Esqueça os rolos fatiados na tesoura e imobilização inútil de estoque parado. 
                O ecossistema **WINF Partners Asset Light** conecta você ao motor **WINF OS™** e ao fracionamento robusto da central **BlackShop™**.
              </p>

              <div className="space-y-4 mb-4">
                <div className="flex gap-4 items-start">
                  <div className="p-1.5 border border-[#444746] bg-zinc-900 rounded-none font-mono text-[10px] text-zinc-400 mt-1">01</div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">CapEx Imobiliário Controlado</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">Você não precisa alugar galpões caros para operar o sistema de luxo WINF™.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="p-1.5 border border-[#444746] bg-zinc-900 rounded-none font-mono text-[10px] text-zinc-400 mt-1">02</div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Zero Bobina Paralizada</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">O estoque viaja sob demanda, fatiado e selado milimetricamente nos hubs BlackShop™.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM CONTAINER & TERMINAL CONSOLE - RIGHT */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Main Auth Container */}
              <div className="bg-[#131314] border border-[#444746] p-6 md:p-10 shadow-2xl relative">
                
                {/* Thin header light bar */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                <AnimatePresence mode="wait">
                  
                  {/* REQUEST ACCESS VIEW */}
                  {view === "request" && (
                    <motion.div
                      key="request-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="mb-8">
                        <span className="font-mono text-[9px] text-zinc-400 tracking-[0.25em] uppercase block mb-1">
                          [ WINF PARTNERSHIP ADMISSION ]
                        </span>
                        <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                          Solicitar Zoneamento
                        </h2>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                            NAME_
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Nome Completo"
                            className="w-full bg-[#131314]/40 border border-[#444746] p-3 pl-16 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                            value={formData.nome}
                            onChange={(e) => handleFormChange("nome", e.target.value)}
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                            MAIL_
                          </span>
                          <input
                            type="email"
                            required
                            placeholder="E-mail Executivo"
                            className="w-full bg-[#131314]/40 border border-[#444746] p-3 pl-16 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                            value={formData.email}
                            onChange={(e) => handleFormChange("email", e.target.value)}
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                            COMP_
                          </span>
                          <input
                            type="text"
                            placeholder="Empresa / Estúdio Operacional"
                            className="w-full bg-[#131314]/40 border border-[#444746] p-3 pl-16 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                            value={formData.empresa}
                            onChange={(e) => handleFormChange("empresa", e.target.value)}
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                            VEH_
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Veículo ou Tipo de Aplicação"
                            className="w-full bg-[#131314]/40 border border-[#444746] p-3 pl-16 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                            value={formData.veiculo}
                            onChange={(e) => handleFormChange("veiculo", e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs py-4 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group"
                        >
                          SOLICITAR ZONEAMENTO <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setView("preview")}
                          className="w-full bg-transparent border border-[#444746] text-zinc-300 font-bold uppercase tracking-[0.15em] text-xs py-3.5 hover:bg-white/[0.02] hover:text-white transition-colors flex items-center justify-center gap-2 group"
                        >
                          <Eye size={12} className="text-zinc-500 group-hover:text-white" /> DE_GUSTAR TECNOLOGIA <span className="text-white/40 text-[9px] font-mono">(25s)</span>
                        </button>
                      </form>

                      <div className="mt-6 border-t border-[#444746] pt-4 text-center">
                        <button
                          onClick={() => setView("login")}
                          className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Já possui login de parceiro? <strong className="text-white underline">Entrar</strong>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* LOGIN VIEW */}
                  {view === "login" && (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="mb-8">
                        <span className="font-mono text-[9px] text-zinc-400 tracking-[0.25em] uppercase block mb-1">
                          [ WINF PARTNERSHIP AUTH ]
                        </span>
                        <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                          Autenticação Segura
                        </h2>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                            EMAIL_
                          </span>
                          <input
                            type="email"
                            required
                            placeholder="AeroCore™ ID (E-mail)"
                            className="w-full bg-[#131314]/40 border border-[#444746] p-3 pl-16 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
                            KEY_
                          </span>
                          <input
                            type="password"
                            required
                            placeholder="Chave de Criptologia"
                            className="w-full bg-[#131314]/40 border border-[#444746] p-3 pl-16 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs py-4 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group"
                        >
                          Acessas Canal Seguro <Lock size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setView("preview")}
                          className="w-full bg-transparent border border-[#444746] text-zinc-300 font-bold uppercase tracking-[0.15em] text-xs py-3.5 hover:bg-white/[0.02] hover:text-white transition-colors flex items-center justify-center gap-2 group"
                        >
                          <Eye size={12} /> DE_GUSTAR RECURSOS <span className="text-white/40 text-[9px] font-mono">(25s)</span>
                        </button>
                      </form>

                      <div className="mt-6 border-t border-[#444746] pt-4 text-center">
                        <button
                          onClick={() => setView("request")}
                          className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Não possui chaves estruturais? <strong className="text-white underline">Solicitar</strong>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* SUCCESS VIEW */}
                  {view === "success" && (
                    <motion.div
                      key="success-form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-none flex items-center justify-center mx-auto mb-6">
                        <Check size={28} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-wide mb-3 text-white">
                        Admissão Processada
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light mb-8 max-w-sm mx-auto">
                        Suas coordenadas foram criptografadas e enviadas para nossa mesa de due diligence preliminar. Um token provisório **Tenant ID** e orientações para verificação da sua área postal foram encaminhados à central.
                      </p>
                      <button
                        onClick={onBack}
                        className="bg-zinc-900 border border-[#444746] text-white font-mono uppercase tracking-widest text-[11px] px-8 py-3.5 hover:bg-white hover:text-black transition-all"
                      >
                        FECHAR CANAL
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

              {/* LIVE CONSOLE LOG LOGGER - Standard Figure AI layout trait */}
              <div className="bg-[#131314] border border-[#444746] p-4 rounded-none text-[9px] font-mono text-zinc-500 space-y-1.5 h-32 overflow-y-auto no-scrollbar relative">
                <div className="sticky top-0 right-0 float-right flex items-center gap-1.5 bg-[#131314]/95 backdrop-blur px-2 py-0.5 rounded-none border border-[#444746] text-zinc-500 uppercase">
                  <span className="h-1.5 w-1.5 rounded-none bg-emerald-500 animate-pulse" />
                  <span>SECURE_SHELL</span>
                </div>
                {terminalLogs.map((log, index) => (
                  <div key={index} className="leading-tight select-none">
                    <span className="text-blue-500/80 mr-1.5">&gt;</span> {log}
                  </div>
                ))}
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] py-8 px-6 bg-[#030303] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase">
          <div>
            © {new Date().getFullYear()} AEROCORE™ BY WINFOS™. ALL INTELLECTUAL PROPERTY RESERVED.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">terms_of_use</a>
            <a href="#" className="hover:text-white transition-colors">privacy_policy</a>
            <a href="#" className="hover:text-white transition-colors">vocal_audit</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingAeroCore;
