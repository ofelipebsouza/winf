/* --- WINF OS™ // MOBILE GATEWAY // COMPONENTE DESACOPLADO --- */
import React from 'react';
import { Smartphone, Download, Play } from 'lucide-react';

const MobileGateway = () => (
  <div className="app-download-gateway mt-8 pt-6 border-t border-[#444746] text-center font-sans">
    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">
      ACESSO VIA DISPOSITIVO MÓVEL (WINF OS™ CLIENT)
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
      <a 
        href="/downloads/winf-os-latest.apk" 
        className="w-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-wider text-zinc-300 font-bold border-2 border-[#444746] hover:border-white/30 bg-zinc-950/80 px-5 py-3 rounded-none transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <Smartphone className="w-4 h-4" />
        <div className="text-left font-mono">
          <span className="block text-[8px] text-zinc-500 font-black tracking-widest uppercase">DISPOSITIVOS ANDROID</span>
          <span className="text-[11px] font-black tracking-wider">BAIXAR APK</span>
        </div>
      </a>
      
      <a 
        href="https://play.google.com/store/apps/..." 
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-3 text-xs font-black uppercase tracking-wider text-white border-2 border-[#444746] hover:border-white/30 bg-zinc-950/80 px-5 py-3 rounded-none transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <Play className="w-4 h-4 fill-white" />
        <div className="text-left font-mono">
          <span className="block text-[8px] text-zinc-500 font-black tracking-widest uppercase">GOOGLE PLAY</span>
          <span className="text-[11px] font-black tracking-wider">PLAY STORE</span>
        </div>
      </a>
    </div>
  </div>
);

export default MobileGateway;
