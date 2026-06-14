import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, 
  Home, Compass, Library, Heart, Settings, ListMusic, 
  Search, Bell, MoreHorizontal, User, Clock, Radio, Mic, Disc,
  ChevronDown, Shuffle, Tv
} from 'lucide-react';

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface ModuleSynthwaveProps {
  onBack: () => void;
}

import { Track, RECENT_TRACKS, RECENT_GRID, HORIZONTAL_CAROUSELS } from '../data/synthwave/catalog';

const ModuleSynthwave: React.FC<ModuleSynthwaveProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(RECENT_TRACKS[0]);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");
  const [activeFilter, setActiveFilter] = useState('Tudo');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false;
    }
    const audio = audioRef.current;
    
    const updateTime = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTimeStr(formatTime(audio.currentTime));
      }
    };
    
    const updateDuration = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDurationStr(formatTime(audio.duration));
      } else {
        setDurationStr(currentTrack.duration); // Fallback to mocked duration
      }
    };
    
    const handleEnded = () => {
      const currentIndex = RECENT_TRACKS.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % RECENT_TRACKS.length;
      setCurrentTrack(RECENT_TRACKS[nextIndex]);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]); // added currentTrack dependency for handleEnded fallback

  useEffect(() => {
    if (audioRef.current && currentTrack.audioUrl) {
      if (audioRef.current.src !== currentTrack.audioUrl) {
         audioRef.current.src = currentTrack.audioUrl;
         setDurationStr(currentTrack.duration); // initial fallback
         setProgress(0);
         setCurrentTimeStr("0:00");
         audioRef.current.load();
      }
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
           playPromise.catch(e => console.log("Auto-play prevented", e));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  return (
    <div className="flex flex-col h-screen w-full fixed inset-0 z-50 bg-[#121212] text-white font-sans overflow-hidden selection:bg-white/20">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-36 pt-4 bg-gradient-to-b from-[#1E1E1E] to-[#121212]">
        
        {/* Top Header */}
        <header className="px-4 pb-4 flex items-center gap-3 sticky top-0 z-20 bg-gradient-to-b from-[#1E1E1E] to-transparent">
           <button onClick={onBack} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-transparent hover:border-white/20">
             <ArrowLeft size={18} className="text-white" />
           </button>
           <div className="w-8 h-8 rounded-full bg-emerald-700/80 flex items-center justify-center shrink-0 shadow-lg text-[10px] font-bold">
             WF
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
             {['Tudo', 'Música', 'Podcasts'].map(filter => (
               <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-[#1ed760] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}
               >
                 {filter}
               </button>
             ))}
           </div>
        </header>

        <div className="px-4 mt-2">
          {/* Recent Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
            {RECENT_GRID.map((item) => (
              <div 
                key={item.id} 
                className="bg-white/5 hover:bg-white/20 transition-colors rounded overflow-hidden flex items-center h-14 cursor-pointer relative group"
              >
                {item.isLiked ? (
                  <div className="w-14 h-14 bg-gradient-to-br from-[#450af5] to-[#c4efeb] flex items-center justify-center shrink-0">
                    <Heart size={20} className="fill-white" />
                  </div>
                ) : (
                  <img src={item.image} alt={item.title} className="w-14 h-14 object-cover shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.5)]" />
                )}
                <span className="font-bold text-[11px] sm:text-[13px] tracking-tight leading-tight ml-3 pr-2 truncate whitespace-normal line-clamp-2">{item.title}</span>
                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1ed760] text-black w-10 h-10 rounded-full shadow-lg md:flex hidden items-center justify-center translate-y-1 group-hover:translate-y-0 duration-300">
                  <Play size={20} className="fill-black ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Ad Container */}
          <div className="bg-gradient-to-br from-[#282828] to-[#181818] rounded-md p-4 mb-8 shadow-2xl border border-white/5 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] relative z-10">
              <span className="bg-white/10 px-2 py-0.5 rounded-sm">Publicidade WINF</span>
              <div className="flex items-center gap-4">
                <Volume2 size={16} className="hover:text-white transition-colors" />
                <MoreHorizontal size={16} className="hover:text-white transition-colors" />
              </div>
            </div>
            <div className="aspect-[21/9] w-full bg-black rounded overflow-hidden relative mb-4 shadow-inner">
               <img src="https://images.unsplash.com/photo-1614064641936-38204bfa95f3?auto=format&fit=crop&q=80&w=1200" alt="Winf Tech" className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-1000" />
               <div className="absolute inset-0 flex items-center justify-center flex-col bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-white drop-shadow-lg">WINF™</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-emerald-400 font-bold mt-2">Tecnologia Global</span>
               </div>
            </div>
            <div className="flex items-center justify-between relative z-10">
               <span className="font-bold text-sm tracking-tight text-white/90">WINF International Group</span>
               <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs hover:scale-105 transition-transform">
                 Saiba mais
               </button>
            </div>
          </div>

          {/* Carousel Sections */}
          {HORIZONTAL_CAROUSELS.map((section, idx) => (
            <section key={idx} className="mb-8">
               <div className="flex items-end gap-3 mb-5">
                 <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 shadow-lg">
                   <img src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="flex flex-col">
                   <h3 className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-0.5">Artista Recomendado</h3>
                   <h2 className="text-2xl font-black tracking-tight leading-none text-white">WINF Select</h2>
                 </div>
               </div>
               
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
                 {section.items.map(item => (
                   <div key={item.id} className="min-w-[140px] md:min-w-[160px] snap-start cursor-pointer group">
                      <div className="relative aspect-square w-full mb-3 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.5)] overflow-hidden group-hover:shadow-[0_12px_25px_rgba(0,0,0,0.6)] transition-all">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md rounded px-1.5 py-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-2.5 h-2.5 text-white fill-[#1ed760]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">This Is</span>
                        </div>
                        <div className="absolute right-2 bottom-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-[#1ed760] text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg md:flex hidden">
                          <Play size={20} className="fill-black ml-1" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-[13px] tracking-tight truncate text-white">{item.title}</h4>
                        <p className="text-[11px] text-white/50 truncate mt-0.5 font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          ))}
        </div>
      </div>

      {/* Floating Bottom Player */}
      <div className="absolute bottom-[72px] left-2 right-2 md:left-4 md:right-4 z-[60]">
        <div 
          className="bg-[#18181b] hover:bg-[#27272a] transition-colors rounded-lg p-2.5 flex items-center justify-between cursor-pointer shadow-2xl relative overflow-hidden group"
          onClick={() => setIsFullScreen(true)}
        >
          <div className="flex items-center gap-3 overflow-hidden flex-1">
             <img src={currentTrack.image} className="w-10 h-10 rounded shadow-md shrink-0 object-cover" alt="Cover" />
             <div className="flex flex-col overflow-hidden leading-tight">
                <span className="text-[13px] font-bold text-white truncate">{currentTrack.title}</span>
                <span className="text-[11px] font-medium text-white/60 truncate relative top-[-1px]">{currentTrack.artist}</span>
             </div>
          </div>
          <div className="flex items-center gap-[18px] shrink-0 ml-4 relative z-10 px-1">
             <button className="text-white/60 hover:text-white transition-colors active:scale-95 flex items-center justify-center p-1" onClick={(e) => { e.stopPropagation(); }}>
               <Tv size={18} />
             </button>
             <button className="text-[#1ed760] transition-transform active:scale-95 flex items-center justify-center p-1" onClick={(e) => { e.stopPropagation(); }}>
               <Heart size={20} className="fill-[#1ed760]" />
             </button>
             <button className="text-white hover:scale-105 transition-transform active:scale-95 w-8 h-8 flex items-center justify-center mr-1" onClick={togglePlay}>
               {isPlaying ? <Pause size={22} className="fill-white" /> : <Play size={22} className="fill-white ml-1" />}
             </button>
          </div>
          {/* Progress Bar under the player */}
          <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-gradient-to-t from-[#000] to-[#000]/95 backdrop-blur-xl border-t border-transparent fixed bottom-0 left-0 w-full z-50 flex items-center justify-around px-2 pb-safe">
        {[
          { icon: Home, label: 'Início', active: true },
          { icon: Search, label: 'Buscar' },
          { icon: Library, label: 'Sua Biblioteca' },
          { icon: Disc, label: 'Premium' }
        ].map((item, idx) => (
          <button key={idx} className={`flex flex-col items-center justify-center w-full h-full gap-1 pt-1 ${item.active ? 'text-white' : 'text-white/50 hover:text-white transition-colors'}`}>
            <item.icon size={22} className={item.active ? "fill-white" : ""} strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Full Screen Player */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black text-white flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
              <img src={currentTrack.image} className="w-full h-full object-cover opacity-40 blur-[60px] scale-150 saturate-200" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#121212]" />
            </div>

            <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar pb-12">
              <div className="flex flex-col min-h-full px-6 py-6 max-w-md mx-auto w-full">
              {/* Top Header */}
              <div className="flex items-center justify-between mb-8 sticky top-0 z-50 pt-2 pb-2 bg-gradient-to-b from-transparent to-transparent">
                <button onClick={() => setIsFullScreen(false)} className="p-2 -ml-2 text-white/80 hover:text-white transition-colors active:scale-95">
                  <ChevronDown size={28} />
                </button>
                <div className="text-center flex flex-col pt-1">
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 mb-0.5">Tocando da Playlist</span>
                  <span className="text-xs font-bold text-white tracking-tight">Músicas curtidas</span>
                </div>
                <button className="p-2 -mr-2 text-white/80 hover:text-white transition-colors active:scale-95">
                  <MoreHorizontal size={24} />
                </button>
              </div>

              {/* Lyrics overlay or image centered */}
              <div className="flex-1 flex flex-col justify-center min-h-[300px] mb-8 relative px-2 shrink-0">
                 <h2 className="text-[28px] leading-tight font-bold tracking-tight text-white w-full max-w-[280px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] opacity-95">
                   Telling myself, "I won't go there"
                 </h2>
              </div>

              {/* Container for Album Info & Controls matching image 2 */}
              <div className="mt-auto flex flex-col shrink-0">
                <button className="w-fit bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-full px-3.5 py-1.5 flex items-center gap-2 mb-6 border border-white/5">
                  <Tv size={14} className="text-white" />
                  <span className="text-[11px] font-bold text-white">Mudar para vídeo</span>
                </button>
                
                {/* Track Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img src={currentTrack.image} alt={currentTrack.title} className="w-14 h-14 rounded aspect-square object-cover shadow-lg" />
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-white mb-0.5 truncate tracking-tight tooltip">{currentTrack.title}</h2>
                      <span className="text-white/70 text-sm">{currentTrack.artist}</span>
                    </div>
                  </div>
                  <button className="text-[#1ed760] active:scale-95 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="h-1 bg-white/20 rounded-full w-full relative mb-2 cursor-pointer group" onClick={handleSeek}>
                    <div className="h-full bg-white rounded-full relative transition-all duration-75" style={{width: `${progress}%`}}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-white/50 font-medium font-mono">
                    <span>{currentTimeStr}</span>
                    <span>{durationStr}</span>
                  </div>
                </div>

                {/* Main Playback Controls */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <button className="text-[#1ed760] active:scale-95 transition-transform relative">
                    <Shuffle size={26} />
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full"></span>
                  </button>
                  <button className="text-white hover:text-white/80 active:scale-95 transition-transform" onClick={() => {
                    const currentIndex = RECENT_TRACKS.findIndex(t => t.id === currentTrack.id);
                    const prevIndex = (currentIndex - 1 + RECENT_TRACKS.length) % RECENT_TRACKS.length;
                    setCurrentTrack(RECENT_TRACKS[prevIndex]);
                  }}>
                    <SkipBack size={40} className="fill-current" />
                  </button>
                  <button onClick={togglePlay} className="w-[72px] h-[72px] rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
                    {isPlaying ? <Pause size={32} className="fill-black" /> : <Play size={32} className="fill-black ml-2" />}
                  </button>
                  <button className="text-white hover:text-white/80 active:scale-95 transition-transform" onClick={() => {
                    const currentIndex = RECENT_TRACKS.findIndex(t => t.id === currentTrack.id);
                    const nextIndex = (currentIndex + 1) % RECENT_TRACKS.length;
                    setCurrentTrack(RECENT_TRACKS[nextIndex]);
                  }}>
                    <SkipForward size={40} className="fill-current" />
                  </button>
                  <button className="text-white/70 hover:text-white active:scale-95 transition-transform">
                    <Clock size={26} />
                  </button>
                </div>

                {/* Bottom Extra Controls */}
                <div className="flex items-center justify-between pb-4">
                  <button className="text-white hover:text-white/80 active:scale-95 transition-transform">
                    <Tv size={20} />
                  </button>
                  <div className="flex gap-6 text-white/70">
                     <button className="hover:text-white transition-colors">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                     </button>
                     <button className="hover:text-white transition-colors">
                       <ListMusic size={22} />
                     </button>
                  </div>
                </div>

                {/* About Artist Teaser Box */}
                <div className="bg-[#242424] rounded-xl mt-6 border border-white/5 cursor-pointer hover:bg-[#2a2a2a] transition-colors p-4">
                  <span className="text-white font-bold text-sm tracking-tight mb-3 block">Sobre o artista</span>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-3">
                     <img src={currentTrack.image} className="w-full h-full object-cover" alt="Artist" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                     <span className="absolute bottom-3 left-4 text-white font-bold text-lg">{currentTrack.artist}</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
                    A soundscape pioneer, creating immersive audio environments that blend analog warmth with cutting-edge digital precision. Known for highly textured, atmospheric compositions that feel simultaneously futuristic and nostalgic.
                  </p>
                </div>
                
                {/* Advertisement / Media Container inside the flow */}
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-xl mt-6 p-5 border border-white/10 relative overflow-hidden group cursor-pointer shadow-lg mb-8">
                   <div className="absolute top-0 right-0 p-3 flex items-center justify-end z-10 w-full">
                     <div className="bg-white/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                       Patrocinado
                     </div>
                   </div>
                   <div className="flex items-center gap-4 mb-4 relative z-10">
                     <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                       <span className="font-bold text-white text-xl italic">W™</span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-white font-bold text-base leading-tight">WINF Pro Experience</span>
                       <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1 text-[10px]">Som de Alta Fidelidade</span>
                     </div>
                   </div>
                   <div className="aspect-[16/9] bg-black rounded-lg mb-4 relative overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" alt="ad" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play size={40} className="text-white drop-shadow-xl" fill="rgba(255,255,255,0.2)" />
                     </div>
                   </div>
                   <p className="text-white/70 text-sm mb-4 leading-relaxed relative z-10">
                     Desbloqueie áudio sem perdas (lossless) e uma biblioteca exclusiva. Teste 1 mês gratuito hoje.
                   </p>
                   <button className="bg-white text-black font-bold py-3 px-6 rounded-full w-full hover:scale-105 transition-transform active:scale-95">
                     Assine Agora
                   </button>
                </div>
                
              </div>
             </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleSynthwave;
