
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Shield, MessageSquare, 
  Upload, QrCode as QrIcon, Database, 
  Send, User, FileText, Activity,
  RefreshCw, CheckCircle2, Bot
} from 'lucide-react';

interface WinfCortexTerminalProps {
  onBack: () => void;
}

const WinfCortexTerminal: React.FC<WinfCortexTerminalProps> = ({ onBack }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [knowledgeFiles, setKnowledgeFiles] = useState<string[]>([]);
  const [guidelines, setGuidelines] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [generatedAccess, setGeneratedAccess] = useState<{ protocol: string; link: string } | null>(null);
  const [logs, setLogs] = useState<{ id: string; msg: string; time: string }[]>([
    { id: '1', msg: 'SISTEMA INICIALIZADO', time: '12:00:01' },
    { id: '2', msg: 'AGUARDANDO BRIDGE WHATSAPP...', time: '12:00:05' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);
    setTimeout(() => {
      const newFiles = Array.from(files).map(f => (f as File).name);
      setKnowledgeFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      addLog(`DOC_UPLOAD: ${newFiles.length} ARQUIVOS INDEXADOS`);
    }, 1500);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    setLogs(prev => [...prev, { id: Math.random().toString(), msg: msg.toUpperCase(), time }]);
  };

  const handlePair = () => {
    setIsConnected(true);
    addLog('WHATSAPP PAREADO COM SUCESSO');
    addLog('STATUS: AGENTE EM OPERAÇÃO (AUTO)');
    addLog('LINK GUEST LOUNGE GERADO AUTOMATICAMENTE PARA NOVOS LEADS');
  };

  const generateGuestAccess = () => {
    const protocol = `#WINF-${Math.floor(1000 + Math.random() * 9000)}`;
    const link = `${window.location.origin}/?lounge=active`;
    setGeneratedAccess({ protocol, link });
    addLog(`NOVO PROTOCOLO GERADO: ${protocol}`);
    addLog(`ENVIANDO CREDENCIAIS VIA WHATSAPP BRIDGE...`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 p-4 md:p-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-zinc-900 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white flex items-center justify-center text-black">
            <Bot size={28} />
          </div>
          <div>
             <h1 className="text-xl font-black uppercase tracking-tight italic text-white leading-none">WINF CÓRTEX</h1>
             <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mt-2">Terminal de Atendimento Autônomo v1.0</p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-2 border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Fechar Terminal
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Knowledge base & Guidelines */}
        <div className="space-y-12">
          {/* File Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-zinc-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Base de Conhecimento</h2>
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-zinc-800 bg-white/[0.02] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                onChange={handleFileUpload} 
                accept=".pdf,.doc,.docx" 
              />
              {isUploading ? (
                <RefreshCw size={24} className="animate-spin text-zinc-600" />
              ) : (
                <Upload size={24} className="text-zinc-700" />
              )}
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-400">Arraste ou clique para carregar documentos</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 mt-1">PDF / DOC / MANUAIS TÉCNICOS</p>
              </div>
            </div>
            
            {knowledgeFiles.length > 0 && (
              <div className="space-y-1">
                {knowledgeFiles.map((file, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-2 flex items-center gap-3">
                    <FileText size={12} className="text-zinc-600" />
                    <span className="text-[10px] font-mono text-zinc-500 truncate">{file}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-zinc-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Diretrizes do Sistema (System Prompt)</h2>
            </div>
            <textarea 
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              placeholder="Ex: Você é um Agente WINF especialista em películas. Seja conciso, use tom executivo e nunca envie parágrafos longos."
              className="w-full h-48 bg-zinc-900/30 border border-zinc-800 p-4 text-xs font-mono leading-relaxed focus:border-zinc-600 outline-none transition-colors resize-none custom-scrollbar"
            />
          </div>

          {/* Guest Access Generator */}
          <div className="space-y-4 pt-12 border-t border-zinc-900">
            <div className="flex items-center gap-2">
              <User size={16} className="text-zinc-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Gestão de Acesso - Guest Lounge</h2>
            </div>
            
            <div className="bg-zinc-900/20 border border-zinc-900 p-6 space-y-6">
               <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-relaxed">
                 Gere e envie credenciais de acesso sensorial para novos clientes. O protocolo é validado pelo Security Gate do Lounge.
               </p>
               
               {!generatedAccess ? (
                 <button 
                   onClick={generateGuestAccess}
                   className="w-full py-4 border border-white text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                 >
                   Gerar Novo Protocolo de Acesso
                 </button>
               ) : (
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-4">
                       <div className="flex-1 bg-black border border-zinc-800 p-4 space-y-1">
                          <p className="text-[8px] font-mono text-zinc-700 uppercase">Protocolo Ativo</p>
                          <p className="text-sm font-black text-white font-mono tracking-widest">{generatedAccess.protocol}</p>
                       </div>
                       <div className="flex-1 bg-black border border-zinc-800 p-4 space-y-1">
                          <p className="text-[8px] font-mono text-zinc-700 uppercase">Validade</p>
                          <p className="text-[10px] font-black text-emerald-500 font-mono uppercase">24 Horas</p>
                       </div>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-between">
                       <code className="text-[9px] font-mono text-zinc-500 truncate mr-4">{generatedAccess.link}</code>
                       <button 
                         onClick={() => {
                           navigator.clipboard.writeText(generatedAccess.link);
                           addLog('LINK COPIADO PARA TRANSFERÊNCIA');
                         }}
                         className="text-[9px] font-black uppercase text-white hover:underline shrink-0"
                       >
                         Copiar
                       </button>
                    </div>
                    <button 
                      onClick={() => setGeneratedAccess(null)}
                      className="w-full py-2 text-[9px] font-mono text-zinc-700 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Resetar Credenciais
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column: WhatsApp & Logs */}
        <div className="space-y-12">
          {/* WhatsApp Bridge */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-zinc-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Ponte de Conexão WhatsApp</h2>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 flex flex-col items-center gap-6">
              {!isConnected ? (
                <>
                  <div 
                    className="w-48 h-48 bg-white p-3 cursor-pointer hover:scale-[1.02] transition-transform shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                    onClick={handlePair}
                  >
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center border-2 border-zinc-200">
                      <QrIcon size={64} className="text-zinc-300" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Escaneie o QR Code</p>
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto">
                      Use o WhatsApp comercial para parear o Agente ao terminal.
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full flex flex-col items-center gap-6 py-8">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-white uppercase tracking-widest">BRIDGE ATIVA: +55 11 9XXXX-XXXX</p>
                    <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] mt-2">Atendimento Autônomo em Execução</p>
                  </div>
                  <button 
                    onClick={() => setIsConnected(false)}
                    className="text-[9px] font-mono text-zinc-600 hover:text-red-500 uppercase tracking-[0.3em] underline transition-colors"
                  >
                    Desconectar Pareamento
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-zinc-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Log de Ações</h2>
              </div>
              <span className="text-[8px] font-mono text-zinc-700 bg-zinc-900 border border-zinc-800 px-2 py-0.5">READY_IO</span>
            </div>
            <div className="bg-black border border-zinc-800 h-64 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar flex flex-col gap-2">
              {logs.map(log => (
                <div key={log.id} className="flex gap-4 border-l border-zinc-900 pl-3">
                  <span className="text-zinc-700 shrink-0">[{log.time}]</span>
                  <span className={log.msg.includes('SUCESSO') ? 'text-emerald-500' : 'text-zinc-500'}>{log.msg}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-zinc-600">WINF OS™ // CÓRTEX CORE ENGINE</span>
        <div className="flex gap-6 grayscale">
          <Terminal size={14} />
          <Shield size={14} />
          <Activity size={14} />
        </div>
      </div>
    </div>
  );
};

export default WinfCortexTerminal;
