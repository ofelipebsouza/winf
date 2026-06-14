
import React, { useState } from 'react';
import { ArrowRight, Lock, Loader, ShieldCheck, Hexagon, Fingerprint } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { ViewState } from '../types';
import MobileGateway from './MobileGateway';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onNavigate?: (view: ViewState) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, loginAsPrototype } = useWinf();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { success, error: authError } = await login(email, password);
      if (!success) {
        setError(authError || "Credenciais inválidas.");
        setIsLoading(false);
      }
    } catch (e) {
      setError("Erro de conexão.");
      setIsLoading(false);
    }
  };

  const handlePrototypeAccess = async () => {
    setIsLoading(true);
    await loginAsPrototype();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-sans text-white overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #050506 0%, #0a0a0c 50%, #101014 100%)',
      }}
    >
      {/* Subtle Apple-style private equity layout assets (tactile glass dots) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* High-end decorative ambient light orb behind content area to highlight Liquid Glass translucency */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] bg-zinc-400/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 rounded-[4px] flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.1] pointer-events-none" />
              <Hexagon className="text-white/80" size={26} strokeWidth={1} />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl font-black text-white uppercase tracking-tighter mb-4 flex justify-center items-center"
          >
            WINF<span className="text-zinc-600 font-medium ml-1">OS</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[9px] text-[#71717a] uppercase tracking-[0.35em] font-mono space-y-2"
          >
            <p className="block">Architectural Excellence</p>
            <p className="block opacity-60">// Elite Squad</p>
          </motion.div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          onSubmit={handleLogin} 
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-[9px] font-mono text-[#71717a] uppercase tracking-[0.2em] pl-1 font-bold">Architect Email</label>
            <div className="relative group">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@studio.com"
                required
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[4px] py-4 px-4 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.04] focus:ring-0 outline-none transition-all duration-300 text-xs font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-mono text-[#71717a] uppercase tracking-[0.2em] pl-1 font-bold">Access Key</label>
            <div className="relative group">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[4px] py-4 px-4 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.04] focus:ring-0 outline-none transition-all duration-300 text-xs font-mono shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-[4px] bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-[10px] font-mono shadow-[inset_0_1px_1px_rgba(239,68,68,0.1)]">
                  <ShieldCheck size={14} className="shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 space-y-5">
            {/* Obsidian Dark Liquid Glass Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full text-white flex items-center justify-center gap-3 px-8 py-4.5 rounded-[4px] transition-all duration-300 ease-out hover:-translate-y-[1px] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, rgba(35, 35, 40, 0.98) 0%, rgba(20, 20, 25, 0.99) 50%, rgba(10, 10, 12, 1) 100%)',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.9), 0 8px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <><Loader size={14} className="animate-spin text-white/60" /> <span className="font-bold text-[11px] uppercase tracking-[0.2em]">Authenticating...</span></>
                ) : (
                  <><Fingerprint size={14} className="opacity-60" /> <span className="font-bold text-[11px] uppercase tracking-[0.2em]">Enter System</span></>
                )}
              </div>
            </button>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/[0.05]"></div>
              <span className="flex-shrink-0 mx-4 text-[#71717a] text-[9px] font-mono uppercase tracking-[0.2em]">Alternative</span>
              <div className="flex-grow border-t border-white/[0.05]"></div>
            </div>

            {/* Clear Translucent Liquid Glass Button */}
            <button 
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => loginAsPrototype(), 1000);
              }}
              disabled={isLoading}
              className="w-full text-zinc-300 flex items-center justify-center gap-3 px-8 py-4 rounded-[4px] transition-all duration-300 ease-out backdrop-blur-md hover:-translate-y-[1px] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.005) 100%)',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3), 0 8px 24px -4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-white/[0.06] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="opacity-80 saturate-50 group-hover:saturate-100 transition-all"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="font-mono uppercase tracking-[0.15em] text-[10px] font-bold">Secure Workspace</span>
              </div>
            </button>
          </div>
        </motion.form>

        {/* Developer access (keep small/hidden) */}
        {!import.meta.env.PROD && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 text-center"
          >
            <button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => loginAsPrototype(), 800);
              }}
              disabled={isLoading}
              className="bg-transparent text-white/30 hover:text-white py-2 px-4 text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer border-none"
            >
              [Prototype Access]
            </button>
          </motion.div>
        )}

        {/* Keep but hide gateway explicitly in UI for this screen layout if not used */}
        <div className="hidden">
           <MobileGateway />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
    