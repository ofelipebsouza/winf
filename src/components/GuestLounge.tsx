
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, Volume2, Shield, 
  Wind, Zap, CheckCircle2, Clock,
  ArrowRight, Download
} from 'lucide-react';

const GuestLounge: React.FC = () => {
  const [protocolInput, setProtocolInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [status, setStatus] = useState<'preparing' | 'ready'>('preparing');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Mock status progression
  useEffect(() => {
    if (isAuthorized) {
      const timer = setTimeout(() => setStatus('ready'), 8000);
      return () => clearTimeout(timer);
    }
  }, [isAuthorized]);

  const handleAccess = () => {
    if (protocolInput.trim().length >= 4) {
      setIsAuthorized(true);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-zinc-800">
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full"></div>
        </div>
        
        <div className="w-full max-w-sm space-y-12 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-white mb-4 rotate-45">
              <Shield size={40} className="-rotate-45" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-[0.3em] italic">SECURITY GATE</h1>
              <p className="text-[9px] uppercase tracking-[0.5em] text-zinc-600 font-mono">Autenticação de Protocolo WINF™</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 ml-1">Código de Acesso</label>
              <input 
                type="text" 
                value={protocolInput}
                onChange={(e) => setProtocolInput(e.target.value.toUpperCase())}
                placeholder="EX: #WINF-XXXX"
                className="w-full bg-zinc-900/50 border border-zinc-800 p-5 text-center text-sm font-mono tracking-[0.5em] focus:border-white focus:outline-none transition-all placeholder:tracking-normal placeholder:text-zinc-800"
              />
            </div>
            <button 
              onClick={handleAccess}
              className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all active:scale-95"
            >
              Validar Acesso
            </button>
            <p className="text-center text-[8px] font-mono uppercase tracking-widest text-zinc-700">
              O seu código foi enviado via WhatsApp pelo Agente Córtex.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col p-6 selection:bg-zinc-800">
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/50 rounded-full animate-ping"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-lg mx-auto flex flex-col justify-center w-full space-y-12 relative z-10 pt-12 pb-32">
        
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-white mb-4 rotate-45">
            <Shield size={32} className="-rotate-45" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] italic">WINF™ GUEST LOUNGE</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-mono">Protocolo de Atendimento Exclusivo</p>
        </div>

        {/* Status Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 space-y-6 backdrop-blur-sm">
          <div className="flex justify-between items-start">
             <div className="space-y-1">
               <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Status do Orçamento</h2>
               <p className="text-xl font-bold uppercase tracking-tight">
                 {status === 'preparing' ? 'Preparando Proposta...' : 'Proposta Disponível'}
               </p>
             </div>
             {status === 'preparing' ? <Clock className="animate-spin text-zinc-600" size={20} /> : <CheckCircle2 className="text-emerald-500" size={20} />}
          </div>

          <div className="h-1 bg-zinc-950 overflow-hidden">
            <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: status === 'preparing' ? '0%' : '100%' }}
               transition={{ duration: 8, ease: "linear" }}
               className="h-full bg-white"
            />
          </div>

          <p className="text-[10px] font-mono leading-relaxed text-zinc-500 uppercase tracking-widest">
            {status === 'preparing' 
              ? 'Nossa Inteligência está processando as variáveis técnicas e tabelas exclusivas para sua unidade.' 
              : 'Clique no botão abaixo para visualizar os detalhes da sua especificação técnica personalizada.'}
          </p>

          {status === 'ready' && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all group"
            >
              Visualizar Proposta <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>

        {/* Simplified Player */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-4 border-l-2 border-white/20 pl-4 py-2">
            <div className={`w-8 h-8 flex items-center justify-center ${isPlaying ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'} transition-colors`}>
               <Volume2 size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">Experiência Sonora</h3>
              <p className="text-[9px] font-mono uppercase text-zinc-600 mt-1">Synthwave Industrial // WINF Select</p>
            </div>
          </div>
          
          <button 
            onClick={handleTogglePlay}
            className={`w-full py-5 border flex items-center justify-center gap-3 transition-all ${isPlaying ? 'border-zinc-700 bg-zinc-900/30' : 'border-white bg-white text-black'}`}
          >
            {isPlaying ? (
              <>
                <Pause size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pausar Áudio</span>
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ativar Aura Sonora</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-0 w-full px-6 flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-700">
        <span>Licenciado WINF™ Autorizado</span>
        <div className="flex gap-4">
          <Shield size={12} />
          <Wind size={12} />
          <Zap size={12} />
        </div>
      </div>

      {status === 'ready' && (
         <button className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
           <Download size={12} />
           Baixar Apresentação Corporativa
         </button>
      )}
    </div>
  );
};

export default GuestLounge;
