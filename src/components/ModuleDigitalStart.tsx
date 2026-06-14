import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ChevronLeft, Camera, MessageSquare, 
  Mail, Video, User, CheckCircle2, Shield, Zap, Globe, 
  ArrowRight, Sparkles, Smartphone, Award, Target, Users, Megaphone,
  Download, X, LayoutGrid, Clock, ShieldAlert, Key, Clipboard, Check,
  Play, Pause, Volume2, Headphones, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { ViewState } from '../types';

interface FormData {
  partnerName: string;
  partnerPhone: string;
  territory: string;
  instagramDesired: string;
  emailDesired: string;
  needsPhysicalSupport: string;
}

const ModuleDigitalStart: React.FC<{ onBack: () => void, onNavigate: (view: ViewState) => void }> = ({ onBack, onNavigate }) => {
  // Persistence state
  const [status, setStatus] = useState<'NOT_STARTED' | 'PENDING' | 'ACTIVATED'>(() => {
    const saved = localStorage.getItem('winf_digital_start_state');
    return (saved as any) || 'NOT_STARTED';
  });

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('winf_digital_start_form');
    return saved ? JSON.parse(saved) : {
      partnerName: '',
      partnerPhone: '',
      territory: '',
      instagramDesired: '',
      emailDesired: '',
      needsPhysicalSupport: 'no'
    };
  });

  const [submitTime, setSubmitTime] = useState<number>(() => {
    const saved = localStorage.getItem('winf_digital_start_submit_time');
    return saved ? Number(saved) : 0;
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<string>('48:00:00');
  const [timePercent, setTimePercent] = useState<number>(100);

  // Audio player mock states
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({ email: false, insta: false });

  // Mock technical explanation audios
  const explanationAudios = [
    {
      id: 1,
      title: "Venda Consultiva: Película Cerâmica Premium de Alta Rejeição",
      desc: "Análise técnica rápida para o cliente sobre como a cerâmica bloqueia calor infravermelho sem escurecer demais.",
      duration: "04:15",
      totalSeconds: 255,
      scenario: "Automotivo & Arquitetura"
    },
    {
      id: 2,
      title: "Tratamento de Objeções: 'Window Film comum na esquina custa metade'",
      desc: "Como desarmar o argumento do preço mostrando o desbotamento, a falta de segurança e o calor real no braço do motorista.",
      duration: "03:10",
      totalSeconds: 190,
      scenario: "Fechamento de Alto Padrão"
    },
    {
      id: 3,
      title: "Pitch de Soluções Térmicas para Grandes Vidraças Residenciais",
      desc: "Explicativo direto mostrando a economia na conta de luz com o ar condicionado e proteção contra raios UV nocivos.",
      duration: "02:45",
      totalSeconds: 165,
      scenario: "Arquitetura Civil / Corporate"
    }
  ];

  // Live Timer Countdown Effect (48 Hours = 172,800 seconds)
  useEffect(() => {
    if (status !== 'PENDING' || !submitTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - submitTime) / 1000);
      const totalDuration = 48 * 3600; // 172800 seconds
      const secondsRemaining = Math.max(0, totalDuration - elapsedSeconds);

      if (secondsRemaining <= 0) {
        setStatus('ACTIVATED');
        localStorage.setItem('winf_digital_start_state', 'ACTIVATED');
        clearInterval(timer);
        return;
      }

      // Calculate percentage
      const percent = (secondsRemaining / totalDuration) * 100;
      setTimePercent(percent);

      // Format time remaining (HH:MM:SS)
      const hrs = Math.floor(secondsRemaining / 3600);
      const mins = Math.floor((secondsRemaining % 3600) / 60);
      const secs = secondsRemaining % 60;

      const formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      setTimeLeft(formatted);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, submitTime]);

  // Handle active audio progress simulations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingAudioId !== null) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          const current = prev[playingAudioId] || 0;
          const matched = explanationAudios.find(a => a.id === playingAudioId);
          if (!matched) return prev;
          
          if (current >= 100) {
            setPlayingAudioId(null);
            return { ...prev, [playingAudioId]: 0 };
          }
          return { ...prev, [playingAudioId]: current + (100 / matched.totalSeconds) };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playingAudioId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    localStorage.setItem('winf_digital_start_form', JSON.stringify(updated));
  };

  const triggerClipboardNotification = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowNotification("Copiado para a área de transferência!");
    setTimeout(() => setShowNotification(null), 2500);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    if (!formData.partnerName || !formData.partnerPhone || !formData.territory) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    // Save submit time & update state
    const now = Date.now();
    setSubmitTime(now);
    setStatus('PENDING');
    localStorage.setItem('winf_digital_start_state', 'PENDING');
    localStorage.setItem('winf_digital_start_submit_time', now.toString());

    // Generate WhatsApp text for submission
    const messageText = `🚀 *SOLICITAÇÃO START DIGITAL DE TERRITÓRIO WINF* 🚀\n\n` +
      `● *Licenciado:* ${formData.partnerName}\n` +
      `● *Telefone:* ${formData.partnerPhone}\n` +
      `● *Território Solicitado:* ${formData.territory}\n` +
      `● *Instagram Desejado:* @${formData.instagramDesired || 'Não informado'}\n` +
      `● *E-mail Desejado:* ${formData.emailDesired || 'Não informado'}@advancedwinf.net\n` +
      `● *Precisa Suporte Físico:* ${formData.needsPhysicalSupport === 'yes' ? 'Sim' : 'Não'}\n\n` +
      `----------------------------------------\n` +
      `⚠️ *Aguardando Ativação das credenciais oficiais e links em até 48 horas!*`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/5513999191510?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Simulator helper functions to experience the systems instantly:
  const simulateActivate = () => {
    setStatus('ACTIVATED');
    localStorage.setItem('winf_digital_start_state', 'ACTIVATED');
    // Ensure mock fields if empty when simulated
    if (!formData.territory) {
      const mockForm = {
        partnerName: 'Sócio Licenciado Premium',
        partnerPhone: '5513999191510',
        territory: 'Santos',
        instagramDesired: 'winf_santos',
        emailDesired: 'santos',
        needsPhysicalSupport: 'no'
      };
      setFormData(mockForm);
      localStorage.setItem('winf_digital_start_form', JSON.stringify(mockForm));
    }
  };

  const simulateReset = () => {
    localStorage.removeItem('winf_digital_start_state');
    localStorage.removeItem('winf_digital_start_submit_time');
    setStatus('NOT_STARTED');
    setSubmitTime(0);
    setFormData({
      partnerName: '',
      partnerPhone: '',
      territory: '',
      instagramDesired: '',
      emailDesired: '',
      needsPhysicalSupport: 'no'
    });
  };

  const currentTerritory = formData.territory || 'Santos';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24 px-4 md:px-0">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-amber-500 text-black px-6 py-4 font-black uppercase text-xs tracking-widest border border-[#444746] shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={16} /> {showNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation & Status Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#444746] pb-4 sm:pb-6 gap-3 sm:gap-4">
        <button onClick={onBack} className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all flex items-center gap-2">
          <ChevronLeft size={14} /> <span className="hidden sm:inline">Voltar ao Arsenal</span><span className="sm:hidden">Voltar</span>
        </button>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {status === 'NOT_STARTED' && (
            <span className="px-3 sm:px-4 py-1.5 bg-zinc-900 border border-[#444746] text-white/40 font-black text-[9px] sm:text-xs uppercase tracking-widest flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-none bg-zinc-600 animate-pulse"></span> Não Iniciado
            </span>
          )}
          {status === 'PENDING' && (
            <span className="px-3 sm:px-4 py-1.5 bg-red-950/40 border border-red-500/30 text-red-500 font-black text-[9px] sm:text-xs uppercase tracking-widest flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-none bg-red-500 animate-ping"></span> AGUARDANDO ATIVAÇÃO (48H)
            </span>
          )}
          {status === 'ACTIVATED' && (
            <span className="px-3 sm:px-4 py-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-black text-[9px] sm:text-xs uppercase tracking-widest flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse"></span> TERRITÓRIO ATIVO
            </span>
          )}

          {/* SIMULATOR SHORTCUT PANEL FOR FASTER TESTING AND OUTSTANDING UX */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto bg-[#070707] border border-[#444746] rounded-none p-1 gap-1">
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest px-2">Simulador WINF:</span>
            <button 
              onClick={simulateActivate}
              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[9px] uppercase border border-emerald-500/20"
            >
              Ativar Já
            </button>
            <button 
              onClick={simulateReset}
              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[9px] uppercase border border-red-500/20"
            >
              Resetar
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Dynamic Rendering */}
      <AnimatePresence mode="wait">
        
        {/* STATE 1: NOT STARTED (FORM SHEETS) */}
        {status === 'NOT_STARTED' && (
          <motion.div
            key="not-started"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#131314] border border-[#444746] p-8 md:p-12 space-y-8"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 flex items-center justify-center border border-[#444746]">
                <Rocket className="text-white" size={24} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                START DIGITAL WINF™
              </h2>
              <p className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">Ativação Gratuita de Presença Digital Local</p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed pt-2">
                Ative todas as ferramentas de alta performance do seu território. Nosso time de design e marketing irá configurar suas credenciais de e-mail corporativo, layout do Instagram com grade otimizada, site com SEO local e links em até <span className="text-white font-bold">48 horas, totalmente grátis</span>.
              </p>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6 pt-4 border-t border-[#444746]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
                    Nome Completo do Sócio *
                  </label>
                  <input 
                    type="text"
                    name="partnerName"
                    required
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    placeholder="Ex: Roberto Silveira"
                    className="w-full bg-zinc-950 border border-[#444746] p-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
                    WhatsApp de Atendimento *
                  </label>
                  <input 
                    type="text"
                    name="partnerPhone"
                    required
                    value={formData.partnerPhone}
                    onChange={handleInputChange}
                    placeholder="Ex: 5513999191510"
                    className="w-full bg-zinc-950 border border-[#444746] p-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all rounded-none"
                  />
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">Formato: Código do país + DDD + Número</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
                    Território de Atuação *
                  </label>
                  <select
                    name="territory"
                    required
                    value={formData.territory}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-[#444746] p-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all rounded-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="Santos">Santos/SP e Região</option>
                    <option value="São Paulo">São Paulo/SP</option>
                    <option value="Rio de Janeiro">Rio de Janeiro/RJ</option>
                    <option value="Campinas">Campinas/SP</option>
                    <option value="Curitiba">Curitiba/PR</option>
                    <option value="Brasil">Outros (Central Brasil)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
                    Instagram Desejado para o Território
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-xs">@</span>
                    <input 
                      type="text"
                      name="instagramDesired"
                      value={formData.instagramDesired}
                      onChange={handleInputChange}
                      placeholder="winf_meuterritorio"
                      className="w-full bg-zinc-950 border border-[#444746] pl-8 pr-4 py-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
                    E-mail Institucional Desejado
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      name="emailDesired"
                      value={formData.emailDesired}
                      onChange={handleInputChange}
                      placeholder="meunome"
                      className="w-full bg-zinc-950 border border-[#444746] pr-36 pl-4 py-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all rounded-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-[10px] uppercase">@advancedwinf.net</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
                    Necessita de Ponto de Apoio / Studio Físico?
                  </label>
                  <select
                    name="needsPhysicalSupport"
                    value={formData.needsPhysicalSupport}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-[#444746] p-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all rounded-none"
                  >
                    <option value="no">Não - Vou operar inteiramente Asset Light (Delivery)</option>
                    <option value="yes">Sim - Gostaria de planejar um Box/Studio regional futuramente</option>
                  </select>
                </div>

              </div>

              <div className="pt-6 border-t border-[#444746] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Shield size={16} />
                  <p className="text-[10px] font-mono uppercase tracking-widest">Seus dados estão protegidos por criptografia interna WINF™</p>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  Confirmar & Enviar para Análise WINF™ <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STATE 2: PENDING ACTIVATION (RED DESIGN & ACTIVE COUNTDOWN) */}
        {status === 'PENDING' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#131314] border border-red-500/20 p-8 md:p-12 space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-950/40 flex items-center justify-center border border-red-500/30">
                  <Clock className="text-red-500 animate-pulse" size={24} />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-red-500 uppercase italic tracking-tighter leading-none">
                  START EM PROGRESSO
                </h2>
                <p className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">Configurando seu Território</p>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  O formulário do território <strong className="text-white">{currentTerritory}</strong> foi transmitido com sucesso. Nossa equipe está registrando seus e-mails institucionais, gerando o blueprint e o banco de dados local. Você receberá a notificação de liberação assim que as credenciais estiverem prontas.
                </p>

                <div className="pt-4 space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Dados Enviados:</h4>
                  <div className="bg-zinc-950 p-4 font-mono text-[11px] text-zinc-400 border border-[#444746] space-y-1">
                    <p><span className="text-red-500/70">● Licenciado:</span> {formData.partnerName}</p>
                    <p><span className="text-red-500/70">● Contato:</span> {formData.partnerPhone}</p>
                    <p><span className="text-red-500/70">● Instagram:</span> @{formData.instagramDesired}</p>
                    <p><span className="text-red-500/70">● E-mail:</span> {formData.emailDesired}@advancedwinf.net</p>
                  </div>
                </div>
              </div>

              {/* Red Status Action Center with live countdown timer */}
              <div className="lg:col-span-5 bg-zinc-950 border border-red-500/20 p-6 md:p-8 flex flex-col items-center text-center space-y-6">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                  Tempo Estimado de Liberação
                </div>

                <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest border-y border-red-500/20 py-4 w-full">
                  {timeLeft}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-red-950/30 h-1.5 border border-red-500/10">
                  <div 
                    className="bg-red-500 h-full transition-all duration-1000"
                    style={{ width: `${timePercent}%` }}
                  ></div>
                </div>

                <div className="space-y-4 w-full">
                  {/* PENDING RED BUTTON OF EXTRAVAGANT FEEDBACK */}
                  <button 
                    onClick={() => {
                      const messageText = `Olá equipe WINF! Solicitei o Start Digital há algumas horas e gostaria de verificar o andamento da ativação do meu território: ${currentTerritory}. Obrigado!`;
                      window.open(`https://wa.me/5513999191510?text=${encodeURIComponent(messageText)}`, '_blank');
                    }}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Chamar Suporte WINF
                  </button>

                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                    Deseja testar a visão do território já ativado? Use o botão "Ativar Já" no painel simulador acima para simular a conclusão da configuração.
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* STATE 3: ACTIVATED & LIVE ARSENAL DEPLOY (GREEN DESIGN) */}
        {status === 'ACTIVATED' && (
          <motion.div
            key="activated"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            
            {/* Banner of absolute success and territorial ownership */}
            <div className="bg-gradient-to-r from-emerald-950/20 to-black border border-emerald-500/20 p-6 md:p-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-400" size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
                    TERRITÓRIO CONECTADO!
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
                    Parabéns, Comandante. O território <strong className="text-emerald-400 font-bold uppercase">{currentTerritory}</strong> está oficialmente sincronizado e liberado com todas as credenciais ativas na rede Advanced Window Film.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => onNavigate(ViewState.MODULE_ARSENAL)}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 text-black text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                  >
                    <LayoutGrid size={14} /> Ir para o Arsenal de Imagens
                  </button>
                  <button 
                    onClick={() => {
                      const messageText = `Olá equipe WINF! Meu Start Digital foi ativado com sucesso para o território ${currentTerritory}. Obrigado pela agilidade! 🚀`;
                      window.open(`https://wa.me/5513999191510?text=${encodeURIComponent(messageText)}`, '_blank');
                    }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-zinc-950 hover:bg-zinc-900 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={12} /> Confirmar no Suporte
                  </button>
                </div>
              </div>
            </div>

            {/* Credenciais de Acesso Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* E-mail Profissional Card */}
              <div className="bg-zinc-950 border border-[#444746] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Mail size={16} className="text-emerald-400" /> E-mail do Território
                  </h4>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">ATIVO</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-white font-mono">
                    {formData.emailDesired || currentTerritory.toLowerCase()}@advancedwinf.net
                  </p>
                  
                  <div className="flex items-center justify-between bg-[#131314] px-4 py-3 border border-[#444746] font-mono text-xs">
                    <span className="text-zinc-500">Senha:</span>
                    <span className="text-white">
                      {showPasswords.email ? 'WinfPartner2026@!' : '••••••••••••'}
                    </span>
                    <button 
                      onClick={() => setShowPasswords(p => ({ ...p, email: !p.email }))}
                      className="text-zinc-400 hover:text-white"
                    >
                      {showPasswords.email ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerClipboardNotification(`${formData.emailDesired || currentTerritory.toLowerCase()}@advancedwinf.net`)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-wider border border-[#444746] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Clipboard size={12} /> Copiar Usuário
                  </button>
                  <a 
                    href="https://webmail.advancedwinf.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-wider border border-emerald-500/20 transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    Painel do E-mail <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              {/* Instagram Configurado Card */}
              <div className="bg-zinc-950 border border-[#444746] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Camera size={16} className="text-amber-500" /> Instagram Oficial Setup
                  </h4>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">CONFIRMADO</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-white font-mono">
                    @{formData.instagramDesired || `winf_${currentTerritory.toLowerCase()}`}
                  </p>
                  
                  <div className="flex items-center justify-between bg-[#131314] px-4 py-3 border border-[#444746] font-mono text-xs">
                    <span className="text-zinc-500">Responsável:</span>
                    <span className="text-zinc-300">Equipe de Suporte Blackshop</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => triggerClipboardNotification(`https://instagram.com/${formData.instagramDesired || `winf_${currentTerritory.toLowerCase()}`}`)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-wider border border-[#444746] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Clipboard size={12} /> Copiar Link Bio
                  </button>
                  <a 
                    href={`https://instagram.com/${formData.instagramDesired || `winf_${currentTerritory.toLowerCase()}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-black text-[10px] uppercase tracking-wider border border-amber-500/20 transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    Ver meu IG Ativado <ArrowRight size={12} />
                  </a>
                </div>
              </div>

            </div>

            {/* AUDIOS DE ATENDIMENTO E EXPLICAÇÃO DE PRODUTOS */}
            <div className="bg-zinc-950 border border-[#444746] p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#444746] pb-4 gap-2">
                <div>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                    <Headphones className="text-emerald-400" /> Áudios Originais de Explicação de Produtos
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Explicativos, scripts e quebras de objeção para escutar e compartilhar</p>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-[#444746] font-mono text-[9px] uppercase tracking-wider text-white">
                  3 Arquivos de Voz Autênticos
                </div>
              </div>

              <div className="space-y-4">
                {explanationAudios.map((audio) => {
                  const isPlaying = playingAudioId === audio.id;
                  const progress = audioProgress[audio.id] || 0;
                  
                  return (
                    <div 
                      key={audio.id} 
                      className={`p-4 border transition-all duration-300 ${isPlaying ? 'bg-zinc-900 border-emerald-500/30' : 'bg-[#131314] border-[#444746] hover:border-white/15'}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono bg-white/5 border border-[#444746] text-zinc-400 px-2 py-0.5 uppercase tracking-wider">
                              {audio.scenario}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500">Duração: {audio.duration}</span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                            {audio.title}
                          </h5>
                          <p className="text-[11px] text-zinc-400 font-light">
                            {audio.desc}
                          </p>
                        </div>

                        {/* Simulated Professional Audio Player Controller */}
                        <div className="flex items-center gap-3 shrink-0">
                          <button 
                            onClick={() => {
                              if (isPlaying) {
                                setPlayingAudioId(null);
                              } else {
                                setPlayingAudioId(audio.id);
                              }
                            }}
                            className={`w-12 h-12 rounded-none flex items-center justify-center transition-all ${isPlaying ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/10 text-white hover:bg-white/15'}`}
                          >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                          </button>

                          <button 
                            onClick={() => triggerClipboardNotification(`https://core.advancedwinf.net/audios/explanation-v${audio.id}.mp3`)}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-[#444746] text-zinc-400 hover:text-white transition-all text-xs font-mono uppercase tracking-widest flex items-center gap-1.5"
                          >
                            <Download size={14} /> Link
                          </button>
                        </div>
                      </div>

                      {/* Display progress wave animation for stunning premium feel */}
                      {isPlaying && (
                        <div className="mt-4 pt-4 border-t border-[#444746] space-y-2">
                          <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500">
                            <span>REPRODUZINDO AUDIO DE TREINAMENTO</span>
                            <div className="flex items-center gap-0.5">
                              <span className="w-1 h-3 bg-emerald-500 animate-pulse"></span>
                              <span className="w-1 h-5 bg-emerald-500 animate-pulse delay-75"></span>
                              <span className="w-1 h-4 bg-emerald-500 animate-pulse delay-100"></span>
                              <span className="w-1 h-2 bg-emerald-500 animate-pulse delay-150"></span>
                            </div>
                          </div>
                          <div className="w-full bg-[#131314] h-1 rounded-none overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* IMAGENS REAIS DE SUPORTE NO ARSENAL */}
            <div className="bg-zinc-950 border border-[#444746] p-6 md:p-8 space-y-4">
              <div>
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                  <Camera className="text-amber-500" /> Banco de Imagens Reais de Alta Resolução
                </h4>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Fotos reais prontas em alta definição para envio de propostas ou mídia social</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[
                  { title: "Tesla Model Y // WINF Ceramic 15", category: "Automotivo", img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400" },
                  { title: "Cobertura de Prédio // Glass Shield 70", category: "Arquitetura", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=400" },
                  { title: "Porsche Carrera 911 // Carbon Block", category: "Luxo", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400" },
                  { title: "Fachada Minimalista // WINF Mirror", category: "Arquitetura", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400" },
                ].map((item, index) => (
                  <div key={index} className="group relative aspect-video bg-[#131314]/40 border border-[#444746] overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex items-end justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-wider">{item.category}</span>
                        <p className="text-[9px] font-bold text-white uppercase leading-tight">{item.title}</p>
                      </div>
                      <button 
                        onClick={() => triggerClipboardNotification(item.img)}
                        className="p-1 px-2 border border-[#444746] bg-[#131314]/60 text-white text-[8px] font-mono uppercase tracking-widest hover:border-white transition-all shrink-0"
                      >
                        Baixar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* FOOTER SECURITY STAMPS AND GUIDELINES */}
      <div className="flex items-center justify-center gap-6 opacity-30 group hover:opacity-100 transition-opacity">
        <p className="text-xs md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">WINF™ OPERATIONAL DEPLOY</p>
        <div className="w-12 h-[1px] bg-white/20"></div>
        <p className="text-xs md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">2026 DIGITAL PROTOCOLS</p>
      </div>

    </div>
  );
};

export default ModuleDigitalStart;
