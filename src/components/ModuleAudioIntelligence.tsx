
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Volume2, Music, List, Disc, Headset,
  Wind, Zap, Shield, Search, TrendingUp, Grid, Library, Radio, Mic2, Settings
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  series: string;
  collection: string;
  url: string;
  cover: string;
  time: string;
}

const COLLECTIONS = [
  { id: 'winf-select', title: 'Winf Select™ Workspace', tracks: 12, time: '55min', cover: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'aerocore', title: 'AeroCore™ MARINE Waves', tracks: 10, time: '48min', cover: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'neoskin', title: 'NeoSkin™ ADV-X Intensity', tracks: 15, time: '1h 05min', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'ascend', title: 'Winf Ascend™ Focus', tracks: 20, time: '1h 30min', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 'warp', title: 'W.A.R.P.™ Soundscape', tracks: 8, time: '42min', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=400&auto=format&fit=crop' },
];

const TRACKS_LIST: Track[] = [
  { id: '01', title: 'Winf™ Harmony', series: 'Winf Sound Experience', collection: 'Winf Premium Collection', time: '5:12', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: '02', title: 'Carbon Reflection', series: 'AeroCore™ Ensemble', collection: 'AeroCore™ Elite', time: '4:35', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: '03', title: 'Stratospheric Dreams', series: 'GravityZero', collection: 'Air Sounds', time: '6:18', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: '04', title: 'Deep Blue Horizon', series: 'Marine Soundwaves', collection: 'Oceanic Vibes', time: '4:52', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: '05', title: 'Invisible Shield', series: 'Select Architects', collection: 'Minimalist Series', time: '3:45', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: '06', title: 'Ascend to Excellence', series: 'Certification Masters', collection: 'Elite Training', time: '5:30', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=400&auto=format&fit=crop' },
];

const ModuleAudioIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sound Engine States
  const [engineConfig, setEngineConfig] = useState({
    spatial8D: true,
    lossless: true,
    sampleRate: '192kHz',
    normalization: true
  });

  // Radio AI States
  const [radioConfig, setRadioConfig] = useState({
    voiceDensity: 40,
    style: 'Executivo / Deep',
    prompt: 'Você é a voz da rádio WINF. Seu tom é inspirador, tecnológico e focado em excelência.',
    frequency: 'A cada 3 faixas'
  });

  const currentTrack = TRACKS_LIST[currentTrackIndex];

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.series,
        album: currentTrack.collection,
        artwork: [{ src: currentTrack.cover, sizes: '512x512', type: 'image/jpeg' }]
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
    }
  }, [currentTrack]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS_LIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS_LIST.length) % TRACKS_LIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-white selection:text-black">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-900 flex flex-col p-6 space-y-10 hidden md:flex shrink-0">
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-black uppercase tracking-[0.2em] text-white italic leading-tight">SYNTH</p>
          <p className="text-[14px] font-black uppercase tracking-[0.2em] text-white italic leading-tight">WAVE</p>
        </div>

        <nav className="space-y-8 flex-1">
          <div className="space-y-4">
             {[
               { id: 'inicio', label: 'Início', icon: Grid },
               { id: 'explorar', label: 'Explorar', icon: Search },
               { id: 'biblioteca', label: 'Biblioteca', icon: Library }
             ].map(item => (
               <button 
                 key={item.id} 
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest transition-colors group ${activeTab === item.id ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
               >
                 <item.icon size={14} className={activeTab === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-white'} />
                 {item.label}
               </button>
             ))}
          </div>

          <div className="space-y-5 pt-4">
             <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-700">Coleção Privada</p>
             <div className="space-y-4">
                {[
                  { id: 'playlists', label: 'Playlists', icon: List },
                  { id: 'audios', label: 'Audios', icon: Music },
                  { id: 'radio', label: 'Rádio AI', icon: Radio },
                  { id: 'mastercast', label: 'Mastercast', icon: Mic2 }
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest transition-colors group ${activeTab === item.id ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <item.icon size={14} className={activeTab === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-white'} />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>
        </nav>

        <div className="pt-6 border-t border-zinc-900">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
          >
            <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500 text-zinc-400 group-hover:text-white" />
            Preferências
          </button>
        </div>

        <div className="border border-zinc-900 p-4 space-y-3 bg-zinc-900/10">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-sm italic">CM</div>
             <div>
               <p className="text-[10px] font-bold text-white leading-none tracking-tight">CARLOS MENDES</p>
               <p className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest mt-1.5 opacity-60">Black Access</p>
             </div>
           </div>
           <button className="w-full text-center py-2 border border-zinc-900 text-[8px] font-mono uppercase tracking-widest text-zinc-600 hover:text-red-500 hover:border-red-900/50 transition-all">Sair da Sessão</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Search Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md px-10 py-6 flex justify-between items-center border-b border-zinc-900/30">
           <div className="relative w-[480px] group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-hover:text-zinc-500 transition-colors" size={14} />
             <input 
               type="text" 
               placeholder="Buscar experiências, imersão, frequências..." 
               className="w-full bg-zinc-900/30 border border-zinc-900 px-12 py-3 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-800"
             />
           </div>
          <div className="flex gap-10 text-[9px] font-mono uppercase border-l border-zinc-900 pl-10">
              <span 
                onClick={() => setIsSettingsOpen(false)}
                className={`cursor-pointer transition-colors ${!isSettingsOpen ? 'text-white' : 'text-zinc-700 hover:text-white'}`}
              >
                Coleção Master
              </span>
              <span 
                onClick={() => setIsSettingsOpen(true)}
                className={`cursor-pointer transition-colors ${isSettingsOpen ? 'text-white' : 'text-zinc-700 hover:text-white'}`}
              >
                Configurações
              </span>
           </div>
        </header>

        <div className="p-10 space-y-20">
          {!isSettingsOpen ? (
            <>
              {/* Hero Section */}
              <section>
                <div className="flex items-end justify-between mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white animate-pulse" />
                      <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.6em]">Winf Premium Collection</h2>
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter italic text-white leading-[0.8] mb-6">ESSENTIAL<br />EXPERIENCES</h1>
                    <p className="text-xs text-zinc-500 max-w-xl font-medium leading-relaxed font-mono uppercase tracking-widest opacity-60">
                      Ondas sonoras precisamente selecionadas para maximizar foco, serenidade e controle no ambiente de negócios. Acústica em altíssima fidelidade.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-6 text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white italic">25 FAIXAS REMASTERIZADAS</p>
                      <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.2em]">Lossless Audio Collection</p>
                    </div>
                    <button 
                      onClick={handleTogglePlay}
                      className="px-10 py-4 bg-white text-black font-black text-[12px] uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] active:scale-95"
                    >
                      {isPlaying ? 'Pausar Frequência' : 'Ativar Frequência'}
                    </button>
                  </div>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {COLLECTIONS.map((col, i) => (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      key={col.id} 
                      className="bg-zinc-900/10 border border-zinc-900 p-5 group hover:bg-zinc-900/20 hover:border-zinc-700 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="aspect-square bg-zinc-950 mb-4 border border-zinc-900 overflow-hidden relative">
                        <img src={col.cover} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                          <Play className="text-white fill-white" size={32} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white leading-tight transition-colors">{col.title}</h3>
                        <div className="flex items-center justify-between">
                           <p className="text-[8px] font-mono text-zinc-800 uppercase tracking-tighter">{col.tracks} faixas • {col.time}</p>
                           <TrendingUp size={10} className="text-zinc-900 group-hover:text-zinc-600" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Detailed Track Listing */}
              <section className="pb-48">
                 <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900/50">
                    <div className="flex items-center gap-10">
                       <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-400">Recentes</h2>
                       <div className="flex gap-6 text-[8px] font-mono uppercase text-zinc-800">
                         <span className="text-zinc-600">Lossless Audio</span>
                         <span className="opacity-40">Curadoria</span>
                         <span className="opacity-40">Private</span>
                         <span className="opacity-40 font-black">Tendências</span>
                         <span className="opacity-40 font-black">Oficinais</span>
                       </div>
                    </div>
                 </div>

                 <div className="w-full overflow-hidden">
                    <table className="w-full text-left border-separate border-spacing-0">
                      <thead className="bg-zinc-900/10">
                        <tr className="text-[10px] font-mono text-zinc-700 uppercase">
                          <th className="py-4 px-6 border-b border-zinc-900 font-normal">Ord</th>
                          <th className="py-4 px-6 border-b border-zinc-900 font-normal">Composição</th>
                          <th className="py-4 px-6 border-b border-zinc-900 font-normal">Compilação</th>
                          <th className="py-4 px-6 border-b border-zinc-900 font-normal text-right">Tempo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TRACKS_LIST.map((track, i) => (
                          <tr 
                            key={track.id} 
                            onClick={() => {
                              setCurrentTrackIndex(i);
                              setIsPlaying(true);
                            }}
                            className={`group cursor-pointer border-b border-zinc-900/20 hover:bg-white/[0.02] transition-colors ${currentTrackIndex === i ? 'bg-white/[0.03]' : ''}`}
                          >
                            <td className="py-5 px-6 text-zinc-800 font-mono text-[11px] group-hover:text-zinc-400 transition-colors uppercase">
                              {currentTrackIndex === i && isPlaying ? (
                                <div className="flex gap-0.5 items-end h-3">
                                  {[1, 2, 3].map(j => (
                                    <motion.div key={j} animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 + j * 0.1 }} className="w-0.5 bg-white" />
                                  ))}
                                </div>
                              ) : track.id}
                            </td>
                            <td className="py-5 px-6">
                              <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${currentTrackIndex === i ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                {track.title}
                              </p>
                              <p className="text-[9px] text-zinc-700 font-mono mt-1 opacity-50 uppercase tracking-tighter">{track.series}</p>
                            </td>
                            <td className="py-5 px-6 text-[10px] text-zinc-700 font-mono uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">
                              {track.collection}
                            </td>
                            <td className="py-5 px-6 text-zinc-800 font-mono text-[10px] text-right group-hover:text-zinc-500 transition-colors uppercase">
                              {track.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </section>
            </>
          ) : (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header Settings */}
              <div className="space-y-2">
                <h2 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Engine Control Center</h2>
                <h1 className="text-4xl font-black uppercase tracking-tight italic text-white flex items-center gap-4">
                  CONFIGURAÇÕES <span className="text-zinc-800 select-none">//</span> <span className="text-zinc-500">AUDIOPHILE</span>
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Sound Engine */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Zap size={16} className="text-zinc-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Motor Acústico (Hardware)</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { id: 'spatial8D', label: 'Emulação Espacial 8D', desc: 'Processamento surround imersivo em tempo real.', value: engineConfig.spatial8D },
                      { id: 'lossless', label: 'Lossless Fidelity Mode', desc: 'Transmissão sem perdas (FLAC) via rede local.', value: engineConfig.lossless },
                      { id: 'normalization', label: 'Normalização Sonar', desc: 'Equilíbrio automático de ganho entre faixas.', value: engineConfig.normalization },
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</p>
                          <p className="text-[9px] font-mono text-zinc-700 uppercase">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => setEngineConfig(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className={`w-12 h-6 border transition-all relative ${item.value ? 'bg-white border-white' : 'bg-transparent border-zinc-800'}`}
                        >
                          <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${item.value ? 'bg-black left-7' : 'bg-zinc-800 left-1'}`} />
                        </button>
                      </div>
                    ))}

                    <div className="space-y-3 pt-4 border-t border-zinc-900">
                      <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Sample Rate (Frequência de Amostragem)</p>
                      <div className="flex gap-4">
                        {['44.1kHz', '48kHz', '96kHz', '192kHz'].map(rate => (
                          <button 
                            key={rate}
                            onClick={() => setEngineConfig(prev => ({ ...prev, sampleRate: rate }))}
                            className={`flex-1 py-3 text-[10px] font-black border transition-all ${engineConfig.sampleRate === rate ? 'bg-white text-black border-white' : 'border-zinc-900 text-zinc-700 hover:border-zinc-700'}`}
                          >
                            {rate}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radio AI Node */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Mic2 size={16} className="text-emerald-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">Nó de Transmissão (Radio AI)</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                         <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Densidade da Voz (Mixer)</p>
                         <span className="text-[10px] font-mono text-emerald-500">{radioConfig.voiceDensity}%</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" max="100" 
                         value={radioConfig.voiceDensity}
                         onChange={(e) => setRadioConfig(prev => ({ ...prev, voiceDensity: parseInt(e.target.value) }))}
                         className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                       />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Prompt de Personalidade do Locutor</p>
                      <textarea 
                        value={radioConfig.prompt}
                        onChange={(e) => setRadioConfig(prev => ({ ...prev, prompt: e.target.value }))}
                        className="w-full h-32 bg-zinc-950 border border-zinc-900 p-4 text-[10px] font-mono leading-relaxed focus:border-emerald-500/50 outline-none transition-colors resize-none text-zinc-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-3">
                         <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Estilo de Atuação</p>
                         <select 
                           value={radioConfig.style}
                           onChange={(e) => setRadioConfig(prev => ({ ...prev, style: e.target.value }))}
                           className="w-full bg-zinc-950 border border-zinc-900 p-3 text-[10px] font-mono uppercase focus:outline-none focus:border-emerald-500/50"
                         >
                            <option>Executivo / Deep</option>
                            <option>Dinâmico / Tech</option>
                            <option>Ambiental / Lo-Fi</option>
                            <option>Futurista / AI Core</option>
                         </select>
                       </div>
                       <div className="space-y-3">
                         <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Frequência de Voz</p>
                         <select 
                           value={radioConfig.frequency}
                           onChange={(e) => setRadioConfig(prev => ({ ...prev, frequency: e.target.value }))}
                           className="w-full bg-zinc-950 border border-zinc-900 p-3 text-[10px] font-mono uppercase focus:outline-none focus:border-emerald-500/50"
                         >
                            <option>A cada 2 faixas</option>
                            <option>A cada 3 faixas</option>
                            <option>Apenas transições de álbum</option>
                            <option>Manual / Sob Demanda</option>
                         </select>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synthwave Immersive Section */}
              <div className="mt-12 pt-12 border-t border-zinc-900">
                <div className="flex items-center gap-3 mb-8">
                  <Zap size={16} className="text-yellow-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-yellow-500">Sistema de Som Synthwave™ (Neuro-Sync)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Frequência Binaural WINF™</p>
                          <p className="text-[9px] font-mono text-zinc-700 uppercase">Ondas Alpha (8Hz-12Hz) para foco máximo no Business.</p>
                        </div>
                        <button className="w-12 h-6 border bg-white border-white transition-all relative">
                          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black left-7" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Sub-Bass Cinema Mode</p>
                          <p className="text-[9px] font-mono text-zinc-700 uppercase">Enriquecimento de graves para ambientação premium.</p>
                        </div>
                        <button className="w-12 h-6 border border-zinc-800 transition-all relative">
                          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-800 left-1" />
                        </button>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Intensidade da Imersão</p>
                          <span className="text-[10px] font-mono text-yellow-500">75%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-lg relative overflow-hidden">
                           <div className="absolute left-0 top-0 h-full w-[75%] bg-yellow-500" />
                        </div>
                        <p className="text-[8px] font-mono text-zinc-700 uppercase">Aumenta o processamento do mecanismo de acústica em tempo real.</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-12 border-t border-zinc-900 flex justify-between items-center">
                <div className="flex gap-8 opacity-40 grayscale">
                   <div className="flex items-center gap-2">
                     <Shield size={12} />
                     <span className="text-[8px] font-mono uppercase tracking-[0.2em]">ENCRYPTED_SIGNAL</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Headset size={12} />
                     <span className="text-[8px] font-mono uppercase tracking-[0.2em]">LATENCY: 12ms</span>
                   </div>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-10 py-3 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                >
                  Salvar e Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* High-Fidelity Player Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-t border-zinc-900 p-8 z-50">
         <div className="max-w-[1700px] mx-auto flex items-center gap-12">
            
            {/* Current Track Info */}
            <div className="flex items-center gap-6 w-[28%] shrink-0">
               <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 relative group overflow-hidden shrink-0">
                  <img src={currentTrack.cover} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-700" alt="" />
                  <div className="absolute inset-x-0 bottom-0 py-1 bg-white text-black text-[8px] font-black uppercase text-center tracking-[0.3em] font-mono">Hi-Res Audio</div>
               </div>
               <div className="min-w-0">
                  <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-white leading-none mb-2 truncate italic">{currentTrack.title}</h4>
                  <p className="text-[10px] font-mono uppercase text-zinc-600 tracking-tighter truncate opacity-70">{currentTrack.series}</p>
                  <div className="flex gap-3 mt-3 opacity-30">
                     <div className="w-3 h-0.5 bg-zinc-800" />
                     <div className="w-3 h-0.5 bg-zinc-800" />
                     <div className="w-3 h-0.5 bg-zinc-800" />
                  </div>
               </div>
            </div>

            {/* Transport Controls */}
            <div className="flex-1 flex flex-col items-center gap-5">
               <div className="flex items-center gap-14">
                  <button onClick={handlePrev} className="text-zinc-800 hover:text-white transition-all transform active:scale-90">
                    <SkipBack size={22} className="fill-current" />
                  </button>
                  <button 
                    onClick={handleTogglePlay}
                    className="w-16 h-16 border-2 border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all transform active:scale-95 group shadow-[0_0_40px_rgba(255,255,255,0.02)]"
                  >
                    {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="ml-1 fill-current" />}
                  </button>
                  <button onClick={handleNext} className="text-zinc-800 hover:text-white transition-all transform active:scale-90">
                    <SkipForward size={22} className="fill-current" />
                  </button>
               </div>
               
               {/* Scrubber */}
               <div className="w-full max-w-4xl flex items-center gap-6">
                  <span className="text-[10px] font-mono text-zinc-800 min-w-[50px] text-right tabular-nums">0:00</span>
                  <div className="flex-1 h-[2px] bg-zinc-900 relative group cursor-pointer">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] relative"
                     >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     </motion.div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-800 min-w-[50px] tabular-nums">{currentTrack.time}</span>
               </div>
            </div>

            {/* Extra Controls */}
            <div className="w-[28%] flex justify-end gap-10 items-center shrink-0">
               <div className="flex items-center gap-4 group">
                  <Volume2 size={16} className="text-zinc-800 group-hover:text-white transition-colors" />
                  <div className="w-32 h-[1px] bg-zinc-900 relative">
                     <div className="absolute left-0 top-0 h-full w-2/3 bg-zinc-800 group-hover:bg-white transition-colors" />
                  </div>
               </div>
               <div className="flex items-center gap-3 border-l border-zinc-900 pl-10">
                 <Headset size={16} className={`text-zinc-800 ${isPlaying ? 'text-white' : ''} transition-colors`} />
                 <Disc className={`text-zinc-900 ${isPlaying ? 'animate-spin' : ''}`} size={18} />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default ModuleAudioIntelligence;
