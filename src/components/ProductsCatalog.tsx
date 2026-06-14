import React, { useState, useEffect } from "react";
import { PRODUCT_CATALOG } from "../data/productCatalogData";
import {
  ChevronLeft,
  ArrowRight,
  Shield,
  Share2,
  Hexagon,
  Maximize,
  Thermometer,
  Sun,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductsCatalogProps {
  onBack: () => void;
  onSelectProduct?: (productId: string) => void;
}

const ARCH_MODELS = [
  {
    id: "corp",
    name: "Fachada Corporativa",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
  },
  {
    id: "house",
    name: "Residência Luxo",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "view",
    name: "Vista Panorâmica",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
  },
];

const AUTO_MODELS = [
  {
    id: "sport",
    name: "Porsche 911 GT3",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "suv",
    name: "Range Rover SV",
    img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "sedan",
    name: "BMW M5 Sedan",
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2670&auto=format&fit=crop",
  },
];

const MARINE_MODELS = [
  {
    id: "yacht",
    name: "Iate de Luxo",
    img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "speedboat",
    name: "Lancha Esportiva",
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2670&auto=format&fit=crop",
  }
];

const AERO_MODELS = [
  {
    id: "jet",
    name: "Jato Executivo",
    img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "heli",
    name: "Helicóptero",
    img: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=2670&auto=format&fit=crop",
  }
];

const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
  onBack,
  onSelectProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<"auto" | "arch" | "marine" | "aero">("arch");
  const [sunIntensity, setSunIntensity] = useState(85);
  const [selectedSimFilm, setSelectedSimFilm] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; sub: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const activeModelsList =
    activeCategory === "arch" ? ARCH_MODELS : 
    activeCategory === "marine" ? MARINE_MODELS : 
    activeCategory === "aero" ? AERO_MODELS : 
    AUTO_MODELS;
  const [activeModelId, setActiveModelId] = useState<string>(
    activeModelsList[0].id,
  );

  // --- Tuning Studio State (Arch Only) ---
  const FACHADA_PRESETS = [
    {
      id: "sports",
      name: "Edifício Corporativo",
      // Good facade
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
      windowsPath: "polygon(32% 35%, 52% 36%, 63% 45%, 26% 45%)",
    },
    {
      id: "suv",
      name: "Residência Alto Padrão",
      // SUV side profile
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600",
      windowsPath: "polygon(20% 32%, 72% 32%, 75% 50%, 15% 48%)",
    },
  ];

  const [tuningModel, setTuningModel] = useState(FACHADA_PRESETS[0].id);
  const [tuningColorHue, setTuningColorHue] = useState(0);
  const [tuningHeight, setTuningHeight] = useState(0);
  const [tuningFilmId, setTuningFilmId] = useState("");
  const [tuningTab, setTuningTab] = useState<
    "car" | "color" | "height" | "film"
  >("car");

  const activeTuningModel =
    FACHADA_PRESETS.find((m) => m.id === tuningModel) || FACHADA_PRESETS[0];
  const activeTuningFilm = PRODUCT_CATALOG.find((p) => p.id === tuningFilmId);
  const tuningVltStr = activeTuningFilm?.specs?.vlt || "100%";
  const tuningVltMatch = tuningVltStr.match(/\d+/);
  const tuningVlt = tuningVltMatch ? parseInt(tuningVltMatch[0]) : 100;
  const tuningTintOpacity = tuningFilmId ? (100 - tuningVlt) / 100 : 0;
  // ---------------------------------------

  useEffect(() => {
    setActiveModelId(
      activeCategory === "arch" ? ARCH_MODELS[0].id : 
      activeCategory === "marine" ? MARINE_MODELS[0].id : 
      activeCategory === "aero" ? AERO_MODELS[0].id : 
      AUTO_MODELS[0].id,
    );
    setSelectedSimFilm(""); // reset film
  }, [activeCategory]);

  const handleShare = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const productSlug = product.id.toLowerCase().replace(/\s+/g, "-");
    const shareUrl = `${window.location.origin}/produto/${productSlug}`;
    const message = `*Catálogo Winf™ - ${product.name}*\n\nConheça os detalhes técnicos da ${product.subname}.\nAcesse a ficha oficial no nosso site:\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredProducts = PRODUCT_CATALOG.filter(
    (product) => product.category === activeCategory,
  );
  const isAuto = activeCategory === "auto";
  const isDarkTheme = activeCategory !== "arch";

  // Theming based on category
  const theme = {
    bg: "bg-[#131314]",
    text: "text-white",
    textMuted: "text-white/40",
    border: "border-[#444746]",
    card: "bg-[#131314]",
    cardHover: "hover:bg-white/5",
    button: "bg-white text-black",
    navBg: "bg-[#131314]/60",
    accent: "text-white/20",
  };

  // Find the selected film for the simulator
  const activeSimFilm = selectedSimFilm
    ? PRODUCT_CATALOG.find(
        (p) => p.id === selectedSimFilm && p.category === activeCategory,
      ) || filteredProducts[0]
    : null;
  const activeBgModel =
    activeModelsList.find((m) => m.id === activeModelId) || activeModelsList[0];

  const getSimulatedTemperatures = () => {
    const externalTemp = Math.round(25 + sunIntensity * 0.15);
    const commonTemp = Math.round(20 + sunIntensity * 0.21);

    if (!selectedSimFilm || !activeSimFilm) {
      return { externalTemp, commonTemp, winfTemp: commonTemp };
    }

    const irrStr = activeSimFilm?.keyMetrics?.ir || "70%";
    const irrValue = parseFloat(irrStr.replace(/[^\d.]/g, "")) || 70;

    const factor = (100 - irrValue) / 100;
    const winfTemp = Math.round(
      20 + sunIntensity * 0.21 * Math.max(0.05, factor),
    );

    return { externalTemp, commonTemp, winfTemp };
  };

  const temps = getSimulatedTemperatures();

  // VLT logic to tint image
  const vltStr = activeSimFilm?.specs?.vlt || "100%";
  const vltMatch = vltStr.match(/\d+/);
  const vlt = vltMatch ? parseInt(vltMatch[0]) : 100;

  // VLT mapping: a VLT of 5% means 95% opacity of black.
  // We use this to darken the overlay on the car/house image.
  const tintOpacity = selectedSimFilm ? (100 - vlt) / 100 : 0;

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-700 selection:bg-zinc-500/30 selection:text-current font-sans flex flex-col`}
    >
      {/* Dynamic Background Effects */}
      {isDarkTheme ? (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-900/40 rounded-none blur-[150px] opacity-50 mix-blend-screen" />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-200 rounded-none blur-[150px] opacity-30 mix-blend-multiply" />
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 ${theme.navBg} backdrop-blur-xl border-b ${theme.border} transition-colors duration-700`}
      >
        <button
          onClick={onBack}
          className={`w-10 h-10 flex items-center justify-center rounded-none transition-colors border ${theme.border} ${isDarkTheme ? "hover:bg-white/10" : "hover:bg-[#131314]/5"}`}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex bg-[#111112]/90 p-1 border border-zinc-800 rounded-none absolute left-1/2 -translate-x-1/2 overflow-x-auto max-w-[65%] md:max-w-none hide-scrollbar shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setActiveCategory("arch")}
            className={`px-4 md:px-7 py-2.5 text-[10px] md:text-[9px] tracking-[0.25em] uppercase font-black transition-all duration-300 rounded-none whitespace-nowrap
              ${activeCategory === 'arch' ? "bg-white text-black font-extrabold shadow-lg" : "text-zinc-500 hover:text-zinc-100 opacity-90"}
            `}
          >
            Arch
          </button>
          <button
            onClick={() => setToast({
              message: "AeroCore™ / Neo Skin® (Automotivo)",
              sub: "Standby Estratégico. Lançamento exclusivo na inauguração do WINF Studio."
            })}
            className="px-4 md:px-7 py-2.5 text-[10px] md:text-[9px] tracking-[0.25em] uppercase font-black transition-all duration-300 rounded-none whitespace-nowrap text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-1.5"
            title="Standby Estratégico - Lançamento Futuro na Inauguração do WINF Studio"
          >
            Auto <span className="text-[10px] opacity-60">🔒</span>
          </button>
          <button
            onClick={() => setToast({
              message: "AeroCore™ / Neo Skin® (Marítimo)",
              sub: "Standby Estratégico. Lançamento exclusivo na inauguração do WINF Studio."
            })}
            className="px-4 md:px-7 py-2.5 text-[10px] md:text-[9px] tracking-[0.25em] uppercase font-black transition-all duration-300 rounded-none whitespace-nowrap text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-1.5"
            title="Standby Estratégico - Lançamento Futuro na Inauguração do WINF Studio"
          >
            Marine <span className="text-[10px] opacity-60">🔒</span>
          </button>
          <button
            onClick={() => setToast({
              message: "AeroCore™ / Neo Skin® (Aeroespacial)",
              sub: "Standby Estratégico. Lançamento exclusivo na inauguração do WINF Studio."
            })}
            className="px-4 md:px-7 py-2.5 text-[10px] md:text-[9px] tracking-[0.25em] uppercase font-black transition-all duration-300 rounded-none whitespace-nowrap text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-1.5"
            title="Standby Estratégico - Lançamento Futuro na Inauguração do WINF Studio"
          >
            Aero <span className="text-[10px] opacity-60">🔒</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const text = `*CATÁLOGO OFICIAL WINF™*\n\nExplore nossa linha completa de proteção e performance solar.\n\nAcesse agora:\n${window.location.origin}/catalog`;
              const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
              window.open(url, '_blank');
            }}
            className={`hidden md:flex items-center gap-2 px-4 py-2 border ${theme.border} text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all`}
          >
            <Share2 size={14} /> Compartilhar Catálogo
          </button>
          <div
            className={`hidden md:block text-xs font-bold tracking-widest uppercase border-l-2 ${theme.border} pl-4`}
          >
            CATÁLOGO <span className="opacity-50">WINF™</span>
          </div>
        </div>
      </nav>

      {/* Manifesto Header */}
      <AnimatePresence mode="wait">
        <motion.section
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 pt-48 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end justify-between gap-12"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase font-bold tracking-[0.4em] mb-6 flex items-center gap-4 ${isDarkTheme ? "text-zinc-500" : "text-white/40"}`}
            >
              <div className={`h-px w-8 ${theme.border}`} />
              {activeCategory === "auto"
                ? "Divisão de Performance Automotiva"
                : activeCategory === "marine"
                ? "Divisão de Proteção Náutica"
                : activeCategory === "aero"
                ? "Divisão de Engenharia Aeroespacial"
                : "Divisão de Conforto Arquitetônico"}
            </motion.div>

            <h1 className="text-4xl md:text-7xl font-extralight tracking-tight leading-[1.1] mb-8">
              {activeCategory === "auto" ? (
                <>
                  AeroCore™.
                  <br />
                  <span className="font-medium">
                    Invisível, mas indispensável.
                  </span>
                </>
              ) : activeCategory === "marine" ? (
                <>
                  Abyssal™.
                  <br />
                  <span className="font-medium">
                    Domine os oceanos sem reflexos.
                  </span>
                </>
              ) : activeCategory === "aero" ? (
                <>
                  Horizon™.
                  <br />
                  <span className="font-medium">
                    Conforto na estratosfera.
                  </span>
                </>
              ) : (
                <>
                  O mesmo vidro.
                  <br />
                  <span className="font-medium">Uma nova percepção.</span>
                </>
              )}
            </h1>

            <div
              className={`text-base md:text-xl font-light leading-relaxed max-w-2xl ${theme.textMuted}`}
            >
              {activeCategory === "auto" ? (
                <p>
                  <b className={theme.text}>
                    Engenharia de Ponta. Execução de Mestre.
                  </b>{" "}
                  A paixão por performance exige o mais alto nível de proteção
                  para verdadeiras obras de arte da engenharia motorizada.
                </p>
              ) : activeCategory === "marine" ? (
                <p>
                  <b className={theme.text}>
                    Resistência contra Maresia e Glare Extremo.
                  </b>{" "}
                  Camada extra de proteção e privacidade para iates e lanchas, com absorção massiva de choque térmico marítimo.
                </p>
              ) : activeCategory === "aero" ? (
                <p>
                  <b className={theme.text}>
                    Bloqueio UV em Altas Altitudes.
                  </b>{" "}
                  O conforto visual e a regulagem térmica exata que jatos executivos exigem em dezenas de milhares de pés.
                </p>
              ) : (
                <p>
                  <b className={theme.text}>
                    A Tecnologia Não Precisa Ser Vista. Precisa Ser Sentida.
                  </b>{" "}
                  Transforme ambientes em santuários de conforto, privacidade e
                  eficiência, filtrando o que há de ruim no sol e deixando
                  entrar apenas a luz.
                </p>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`hidden lg:flex w-32 h-32 rounded-none border border-dashed ${theme.border} items-center justify-center relative shrink-0`}
          >
            <div className="absolute inset-0 flex items-center justify-center animate-pulse opacity-20">
              {isDarkTheme ? (
                <Hexagon size={64} strokeWidth={1} />
              ) : (
                <Maximize size={64} strokeWidth={1} />
              )}
            </div>
            <div
              className={`text-[10px] md:text-[8px] font-black tracking-widest text-center uppercase ${isDarkTheme ? "text-white" : "text-black"}`}
            >
              Master
              <br />
              Specs
            </div>
          </motion.div>
        </motion.section>
      </AnimatePresence>

      {/* Catalog Grid */}
      <section className="relative z-10 pb-32 px-6 md:px-12 w-full max-w-7xl mx-auto flex-1">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group cursor-pointer border ${theme.border} ${theme.card} ${theme.cardHover} transition-all duration-500 overflow-hidden flex flex-col relative`}
                onClick={() => onSelectProduct && onSelectProduct(product.id)}
              >
                {/* Image Area */}
                <div className="relative h-[300px] overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center origin-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  {/* Subtle gradient overlay matched to theme */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${isDarkTheme ? "from-[#0A0A0A] via-[#0A0A0A]/40" : "from-white via-white/20"} to-transparent`}
                  />

                  {/* Header Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="bg-[#131314]/60 backdrop-blur-md px-3 py-1.5 text-[10px] md:text-[8px] uppercase tracking-[0.2em] font-bold text-white border border-[#444746]">
                      {product.line}
                    </div>
                    <button
                      onClick={(e) => handleShare(e, product)}
                      className="w-8 h-8 bg-[#131314]/60 backdrop-blur-md flex items-center justify-center border border-[#444746] hover:bg-white hover:text-black transition-all text-white"
                      title="Compartilhar"
                    >
                      <Share2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-1 relative">
                  <div
                    className={`text-xs md:text-[10px] md:text-sm md:text-[11px] font-black uppercase tracking-[0.2em] mb-3 ${isDarkTheme ? "text-zinc-500" : "text-white/40"}`}
                  >
                    {product.badge}
                  </div>

                  <h3 className={`text-2xl font-light mb-1 ${theme.text}`}>
                    {product.name}
                  </h3>
                  <h4 className={`text-xs italic mb-6 ${theme.textMuted}`}>
                    {product.subname}
                  </h4>

                  <p
                    className={`text-sm font-light leading-relaxed mb-10 flex-1 line-clamp-3 ${theme.textMuted}`}
                  >
                    {product.shortDescription}
                  </p>

                  {/* Footer Metrics */}
                  <div
                    className={`flex items-center justify-between mt-auto pt-6 border-t ${theme.border}`}
                  >
                    <div
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${theme.textMuted}`}
                    >
                      <Shield size={14} className={theme.accent} />
                      {product.keyMetrics.warranty}
                    </div>

                    <div
                      className={`text-xs md:text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-2 transition-colors ${theme.text} group-hover:opacity-100 opacity-60`}
                    >
                      Explorar Specs{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Hover Line Effect */}
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] w-0 bg-current transition-all duration-500 group-hover:w-full ${isDarkTheme ? "text-white" : "text-black"}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </section>

      {/* Tuning Studio / 3D Tuning Simulator (Auto Only) */}
      {isAuto && (
        <section
          className={`relative z-10 py-24 px-6 md:px-12 w-full max-w-7xl mx-auto border-t ${theme.border}`}
        >
          <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
                Winf™ 3D Studio.
              </h2>
              <p className="text-sm text-white/50 max-w-2xl">
                Simulador externo avançado. Personalize o ambiente, tipo de 
                fachada e aplique nossas películas virtuais para visualizar o
                grau de escurecimento e estética.
              </p>
            </div>
          </div>

          <div className="bg-[#131314] border border-[#444746] flex flex-col overflow-hidden">
            {/* Stage */}
            <div className="h-[300px] md:h-[500px] relative bg-[#111] overflow-hidden flex items-center justify-center">
              {/* Background gradient simulating a studio cycle */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-[#1a1a1a] to-[#222]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-white opacity-5 blur-[150px] pointer-events-none" />

              {/* Grid floor */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
                style={{
                  transform: "perspective(500px) rotateX(60deg) scale(2)",
                }}
              />

              {/* The Car */}
              <div
                className="relative w-full max-w-[900px] transition-all duration-700 ease-out"
                style={{ transform: `translateY(${tuningHeight}px)` }}
              >
                {/* Main Car Image */}
                <img
                  src={activeTuningModel.img}
                  className="w-full h-auto object-cover"
                  style={{
                    filter: `hue-rotate(${tuningColorHue}deg) contrast(1.1) brightness(0.9) drop-shadow(0 40px 30px rgba(0,0,0,0.8))`,
                  }}
                  alt="Car Model"
                />

                {/* Tint Overlay (using generic approximate clip-path to simulate window glass) */}
                <div
                  className="absolute bg-[#131314] pointer-events-none transition-opacity duration-700 ease-in-out mix-blend-multiply"
                  style={{
                    inset: 0,
                    opacity: tuningTintOpacity * 0.9, // max out a bit under 1 so it doesn't look like MS Paint
                    clipPath: activeTuningModel.windowsPath,
                  }}
                />

                {/* Additional overlay for reflection to keep it looking like glass */}
                <div
                  className="absolute bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none transition-all duration-700"
                  style={{
                    inset: 0,
                    opacity: tuningFilmId ? 1 : 0.2,
                    clipPath: activeTuningModel.windowsPath,
                  }}
                />
              </div>

              {/* Floating badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] md:text-[8px] uppercase tracking-[0.2em] font-bold text-white border border-[#444746]">
                  VLT {tuningVlt}%
                </span>
                {tuningFilmId && (
                  <span className="bg-[#131314]/60 backdrop-blur-md px-3 py-1.5 text-[10px] md:text-[8px] uppercase tracking-[0.2em] font-bold text-white border border-[#444746]">
                    {activeTuningFilm?.name}
                  </span>
                )}
              </div>
            </div>

            {/* Controls panel */}
            <div className="bg-[#131314] p-6 lg:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {/* Tab Navigation */}
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-48 overflow-x-auto shrink-0 border-b md:border-b-0 md:border-r border-[#444746] pb-4 md:pb-0 md:pr-4">
                <button
                  onClick={() => setTuningTab("car")}
                  className={`text-xs md:text-[10px] font-bold uppercase tracking-widest text-left px-4 py-3 whitespace-nowrap transition-colors ${tuningTab === "car" ? "bg-white text-black" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                >
                  Veículo
                </button>
                <button
                  onClick={() => setTuningTab("film")}
                  className={`text-xs md:text-[10px] font-bold uppercase tracking-widest text-left px-4 py-3 whitespace-nowrap transition-colors ${tuningTab === "film" ? "bg-white text-black" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                >
                  Película
                </button>
                <button
                  onClick={() => setTuningTab("color")}
                  className={`text-xs md:text-[10px] font-bold uppercase tracking-widest text-left px-4 py-3 whitespace-nowrap transition-colors ${tuningTab === "color" ? "bg-white text-black" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                >
                  Pintura Exterior
                </button>
                <button
                  onClick={() => setTuningTab("height")}
                  className={`text-xs md:text-[10px] font-bold uppercase tracking-widest text-left px-4 py-3 whitespace-nowrap transition-colors ${tuningTab === "height" ? "bg-white text-black" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                >
                  Suspensão
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 min-h-[120px] w-full">
                {tuningTab === "car" && (
                  <div className="space-y-4">
                    <label className="text-xs md:text-[10px] font-bold uppercase tracking-widest text-white/50 block">
                      Selecionar Estilo de Fachada
                    </label>
                    <div className="flex gap-4">
                      {FACHADA_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setTuningModel(preset.id)}
                          className={`px-6 py-3 text-sm font-light border transition-all ${tuningModel === preset.id ? "border-white bg-white/10 text-white" : "border-[#444746] text-white/50 hover:border-[#444746]0"}`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tuningTab === "film" && (
                  <div className="space-y-4">
                    <label className="text-xs md:text-[10px] font-bold uppercase tracking-widest text-white/50 block">
                      Aplicar Película (VLT)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => setTuningFilmId("")}
                        className={`p-4 text-left border flex flex-col gap-1 transition-all ${tuningFilmId === "" ? "border-white bg-white/10 text-white" : "border-[#444746] text-white/50 hover:border-[#444746]0"}`}
                      >
                        <span className="text-sm font-light leading-tight">
                          Original
                        </span>
                        <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-widest opacity-60">
                          Sem Película
                        </span>
                      </button>

                      {filteredProducts.map((p) => {
                        const vlt = p.specs?.vlt?.match(/\d+/)?.[0] || "X";
                        return (
                          <button
                            key={p.id}
                            onClick={() => setTuningFilmId(p.id)}
                            className={`p-4 text-left border flex flex-col gap-1 transition-all ${tuningFilmId === p.id ? "border-white bg-white/10 text-white" : "border-[#444746] text-white/50 hover:border-[#444746]0"}`}
                          >
                            <span className="text-xs font-light leading-tight truncate">
                              {p.name}
                            </span>
                            <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-widest opacity-60">
                              VLT {vlt}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {tuningTab === "color" && (
                  <div className="space-y-6 max-w-md">
                    <div className="flex items-center justify-between">
                      <label className="text-xs md:text-[10px] font-bold uppercase tracking-widest text-white/50 block">
                        Modificador Mágico de Cor (Matiz)
                      </label>
                      <span className="text-xs bg-white/10 px-2 py-1">
                        {tuningColorHue}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={tuningColorHue}
                      onChange={(e) =>
                        setTuningColorHue(parseInt(e.target.value))
                      }
                      className="w-full h-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-none appearance-none cursor-pointer accent-white"
                    />
                    <p className="text-xs md:text-[10px] text-white/40">
                      Utiliza alteração de matiz sobre imagens base para
                      pré-visualizar tonalidades do veículo.
                    </p>
                  </div>
                )}

                {tuningTab === "height" && (
                  <div className="space-y-6 max-w-md">
                    <div className="flex items-center justify-between">
                      <label className="text-xs md:text-[10px] font-bold uppercase tracking-widest text-white/50 block">
                        Altura do Veículo (Suspensão)
                      </label>
                      <span className="text-xs bg-white/10 px-2 py-1">
                        {tuningHeight > 0
                          ? "Alta"
                          : tuningHeight < 0
                            ? "Design Esportivo"
                            : "Original"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="20"
                      value={tuningHeight}
                      onChange={(e) =>
                        setTuningHeight(parseInt(e.target.value))
                      }
                      className="w-full h-1 bg-white/20 rounded-none appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-xs md:text-[10px] text-white/40 uppercase tracking-widest">
                      <span>Rebaixado</span>
                      <span>OEM</span>
                      <span>Elevado</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Simulator Section */}
      <section
        className={`relative z-10 py-24 px-6 md:px-12 w-full max-w-7xl mx-auto border-t ${theme.border}`}
      >
        <div className="mb-12">
          <h2 className={`text-4xl md:text-5xl font-light mb-4 ${theme.text}`}>
            Simulador Termodinâmico.
          </h2>
          <p
            className={`text-sm md:text-base ${theme.textMuted} max-w-2xl leading-relaxed`}
          >
            Selecione uma película do catálogo e um cenário base para visualizar
            a redução de calor e escurecimento (VLT) em tempo real.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Controls */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className={`p-8 border ${theme.border} ${theme.card}`}>
              <div className="mb-6">
                <label
                  className={`text-xs md:text-[10px] font-bold uppercase tracking-widest mb-3 block ${theme.textMuted}`}
                >
                  CENÁRIO (MODELO EM TESTE)
                </label>
                <select
                  value={activeModelId}
                  onChange={(e) => setActiveModelId(e.target.value)}
                  className={`w-full bg-transparent border-b ${theme.border} pb-3 text-sm focus:outline-none appearance-none cursor-pointer`}
                >
                  {activeModelsList.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className={
                        isAuto ? "bg-[#131314] text-white" : "bg-white text-black"
                      }
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label
                  className={`text-xs md:text-[10px] font-bold uppercase tracking-widest mb-3 block ${theme.textMuted}`}
                >
                  PELÍCULA APLICADA
                </label>
                <select
                  value={selectedSimFilm}
                  onChange={(e) => setSelectedSimFilm(e.target.value)}
                  className={`w-full bg-transparent border-b ${theme.border} pb-3 text-sm focus:outline-none appearance-none cursor-pointer`}
                >
                  <option
                    value=""
                    className={
                      isAuto ? "bg-[#131314] text-white" : "bg-white text-black"
                    }
                  >
                    Selecione a Película...
                  </option>
                  {filteredProducts.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      className={
                        isAuto ? "bg-[#131314] text-white" : "bg-white text-black"
                      }
                    >
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <div
                  className={`flex justify-between items-center pb-4 border-b ${theme.border}`}
                >
                  <span
                    className={`text-xs md:text-[10px] uppercase font-bold tracking-widest ${theme.textMuted}`}
                  >
                    Transmissão de Luz (VLT):
                  </span>
                  <span className="font-light text-xl">
                    {activeSimFilm?.specs?.vlt || "-"}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center pb-4 border-b ${theme.border}`}
                >
                  <span
                    className={`text-xs md:text-[10px] uppercase font-bold tracking-widest ${theme.textMuted}`}
                  >
                    Rejeição IR:
                  </span>
                  <span className="font-light text-xl">
                    {activeSimFilm?.keyMetrics.ir || "-"}
                  </span>
                </div>
                <div className={`flex justify-between items-center`}>
                  <span
                    className={`text-xs md:text-[10px] uppercase font-bold tracking-widest ${theme.textMuted}`}
                  >
                    Garantia:
                  </span>
                  <span className="font-light text-sm uppercase tracking-widest">
                    {activeSimFilm?.keyMetrics.warranty || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-8 border ${theme.border} ${theme.card} flex flex-col gap-6`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs md:text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}
                  >
                    Intensidade de Radiação Solar
                  </span>
                  <span className="text-sm font-bold bg-[#ef4444]/15 text-[#f57c00] border border-[#ef4444]/20 px-3 py-1 font-mono">
                    {sunIntensity}%
                  </span>
                </div>
                <p className="text-[11px] opacity-70 mb-4 leading-relaxed">
                  Ajuste a radiação térmica para simular condições climáticas reais e testar a barreira física sob altas temperaturas.
                </p>
              </div>

              {/* Enhanced Custom Slider Input with colored gradient track */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sunIntensity}
                  onChange={(e) => setSunIntensity(parseInt(e.target.value))}
                  className="premium-slider w-full cursor-pointer"
                />
                <div className="mt-2 flex items-center justify-between text-[9px] font-mono opacity-50 uppercase tracking-widest">
                  <span>0% Sombra/Climatizado</span>
                  <span>50% Sol Moderado</span>
                  <span>100% Calor Extremo</span>
                </div>
              </div>

              {/* Climate Presets for extreme ease of use */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                  Presets Rápidos de Clima:
                </span>
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSunIntensity(0)}
                    className={`px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider border rounded-none transition-all ${
                      sunIntensity === 0
                        ? "bg-blue-500/10 text-blue-400 border-blue-400"
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    0% Sombra
                  </button>
                  <button
                    type="button"
                    onClick={() => setSunIntensity(40)}
                    className={`px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider border rounded-none transition-all ${
                      sunIntensity === 40
                        ? "bg-amber-500/10 text-amber-400 border-amber-400"
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    40% Nublado
                  </button>
                  <button
                    type="button"
                    onClick={() => setSunIntensity(80)}
                    className={`px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider border rounded-none transition-all ${
                      sunIntensity === 80
                        ? "bg-orange-500/10 text-orange-400 border-orange-400"
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    80% Sol Forte
                  </button>
                  <button
                    type="button"
                    onClick={() => setSunIntensity(100)}
                    className={`px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider border rounded-none transition-all ${
                      sunIntensity === 100
                        ? "bg-red-500/15 text-red-400 border-red-500"
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    100% Extremo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visualizer */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {/* Visual Glass Tint Simulator (Photorealistic Comparison representation) */}
            <div
              className={`w-full h-[280px] md:h-[400px] border ${theme.border} relative overflow-hidden group bg-neutral-950 shadow-2xl`}
            >
              <style>{`
                @keyframes thermalDash {
                  to {
                    stroke-dashoffset: -100;
                  }
                }
                .animate-thermal-dash {
                  animation: thermalDash 12s linear infinite;
                }
                /* Premium range slider track */
                .premium-slider {
                  -webkit-appearance: none;
                  width: 100%;
                  height: 6px;
                  background: linear-gradient(to right, #3b82f6 0%, #eab308 50%, #ef4444 100%);
                  border-radius: 9999px;
                  outline: none;
                }
                .premium-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 18px;
                  height: 18px;
                  border-radius: 9999px;
                  background: #ffffff;
                  border: 2px solid #ef4444;
                  cursor: pointer;
                  box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
                  transition: transform 0.15s ease;
                }
                .premium-slider::-webkit-slider-thumb:hover {
                  transform: scale(1.2);
                  box-shadow: 0 0 16px rgba(239, 68, 68, 0.6);
                }
                .premium-slider::-moz-range-thumb {
                  width: 18px;
                  height: 18px;
                  border-radius: 9999px;
                  background: #ffffff;
                  border: 2px solid #ef4444;
                  cursor: pointer;
                  box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
                  transition: transform 0.15s ease;
                }
                .premium-slider::-moz-range-thumb:hover {
                  transform: scale(1.2);
                }
              `}</style>

              {/* Background Photo - Changes dynamically depending on selected scenery */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
                style={{ backgroundImage: `url(${activeBgModel.img})` }}
              />

              {/* Ambient Glass Reflections across entire window */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.05] to-transparent pointer-events-none z-10" />

              {/* Split Screen Container */}
              <div className="absolute inset-0 flex z-10">
                {/* Left Side: Unprotected Glass (50%) */}
                <div className="w-1/2 h-full relative border-r border-dashed border-zinc-700/50 flex flex-col justify-between p-4 md:p-6 select-none overflow-hidden">
                  {/* Heat glow layer overlays only the left side */}
                  <div 
                    className="absolute inset-0 bg-orange-600 mix-blend-color transition-opacity duration-500 pointer-events-none animate-pulse-slow"
                    style={{ opacity: sunIntensity / 100 * 0.35 }}
                  />
                  <div 
                    className="absolute inset-0 bg-amber-500/10 pointer-events-none"
                  />
                  
                  {/* Badge */}
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-none self-start z-10 shadow-sm backdrop-blur-md">
                    Sem Película
                  </span>

                  {/* Heat rays entering (penetrating vectors) */}
                  <div className="absolute inset-x-0 top-1/4 bottom-1/4 pointer-events-none z-0">
                    <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 10,-20 L 150,160"
                        stroke={isDarkTheme ? "#f59e0b" : "#d97706"}
                        strokeWidth={Math.max(1.5, sunIntensity / 25)}
                        strokeDasharray="6,4"
                        fill="none"
                        className="animate-thermal-dash"
                      />
                      <path
                        d="M 60,-20 L 200,160"
                        stroke={isDarkTheme ? "#ef4444" : "#dc2626"}
                        strokeWidth={Math.max(2, sunIntensity / 20)}
                        strokeDasharray="8,5"
                        fill="none"
                        className="animate-thermal-dash"
                      />
                    </svg>
                  </div>

                  {/* Left Bottom State */}
                  <div className="flex flex-col z-10 bg-black/45 backdrop-blur-sm p-2.5 border border-white/5 max-w-[170px] sm:max-w-none">
                    <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest mb-0.5">ESTADO TÉRMICO:</span>
                    <span className="text-xl md:text-2xl font-light text-red-500 font-mono tracking-widest">
                      {temps.commonTemp}°C
                    </span>
                  </div>
                </div>

                {/* Right Side: Protected Glass with Applied Film (50%) */}
                <div className="w-1/2 h-full relative flex flex-col justify-between p-4 md:p-6 select-none overflow-hidden transition-all duration-700">
                  {/* Dark Glass Tint overlay based on active film VLT */}
                  <div 
                    className="absolute inset-0 bg-[#02050b] transition-all duration-750 pointer-events-none"
                    style={{ opacity: selectedSimFilm ? tintOpacity : 0 }}
                  />
                  
                  {/* Backdrop brightness adjustment when film is active */}
                  <div 
                    className={`absolute inset-0 transition-all duration-750 pointer-events-none bg-blue-950/5 ${selectedSimFilm ? 'backdrop-brightness-[0.7] backdrop-contrast-[1.2]' : ''}`} 
                  />

                  {/* Badge */}
                  <span className={`text-[9px] md:text-[10px] uppercase tracking-widest font-black self-start px-2 py-0.5 rounded-none z-10 transition-all duration-300 shadow-sm backdrop-blur-md border ${
                    selectedSimFilm 
                      ? "text-blue-400 bg-blue-500/15 border-blue-400/20" 
                      : "text-zinc-400 bg-zinc-800/10 border-zinc-800/20"
                  }`}>
                    {selectedSimFilm ? "Blindagem WINF™" : "Sem Barreira"}
                  </span>

                  {/* Heat rays deflection (glowing bouncing wave vectors) */}
                  <div className="absolute inset-x-0 top-1/4 bottom-1/4 pointer-events-none z-0">
                    <svg className="w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
                      {selectedSimFilm ? (
                        <>
                          {/* Deflected heat/light waves bouncing off */}
                          <path
                            d="M 120,125 C 80,75 60,-15 160,-15"
                            stroke="#3b82f6"
                            strokeWidth="3.5"
                            strokeDasharray="6,4"
                            fill="none"
                            className="animate-thermal-dash"
                          />
                          <path
                            d="M 180,125 C 140,75 120,-15 220,-15"
                            stroke="#60a5fa"
                            strokeWidth="2"
                            fill="none"
                            className="animate-pulse"
                          />
                        </>
                      ) : (
                        <>
                          {/* Standard heat penetration when no film is selected on right */}
                          <path
                            d="M 40,-20 L 180,160"
                            stroke={isDarkTheme ? "#f59e0b" : "#d97706"}
                            strokeWidth={Math.max(1.5, sunIntensity / 25)}
                            strokeDasharray="6,4"
                            fill="none"
                            className="animate-thermal-dash"
                          />
                          <path
                            d="M 90,-20 L 230,160"
                            stroke={isDarkTheme ? "#ef4444" : "#dc2626"}
                            strokeWidth={Math.max(2, sunIntensity / 20)}
                            strokeDasharray="8,5"
                            fill="none"
                            className="animate-thermal-dash"
                          />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Right Bottom Metrics & State */}
                  <div className="flex flex-col z-10 bg-black/45 backdrop-blur-sm p-2.5 border border-white/5 max-w-[170px] sm:max-w-none transition-all duration-500">
                    <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest mb-0.5">ESTADO TÉRMICO:</span>
                    <span className={`text-xl md:text-2xl font-light font-mono tracking-widest transition-colors duration-500 ${selectedSimFilm ? "text-blue-400" : "text-amber-500"}`}>
                      {selectedSimFilm ? temps.winfTemp : temps.commonTemp}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Sun Source Badge (Upper Right) */}
              <div
                className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col items-end pointer-events-none select-none z-20 transition-transform duration-300"
                style={{
                  transform: `scale(${1 + sunIntensity * 0.002})`,
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full blur-[6px] opacity-80 ${
                    sunIntensity > 75
                      ? "bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse"
                      : sunIntensity > 40
                        ? "bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                        : "bg-amber-100 shadow-[0_0_8px_rgba(253,230,138,0.2)]"
                  }`}
                />
                <span className="text-[7px] font-mono text-white tracking-[0.35em] uppercase mt-2 text-right block drop-shadow-md bg-black/50 px-2 py-0.5">
                  EXT: {temps.externalTemp}°C
                </span>
              </div>

              {/* Centered Decorative Fine Glass Frame / Grid layout label */}
              <div className="absolute inset-y-0 inset-x-4 md:inset-x-8 border-x border-zinc-800/15 pointer-events-none z-10" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-950/95 border border-zinc-800 backdrop-blur-md px-3 py-1.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black text-white z-20 shadow-xl whitespace-nowrap rounded-none">
                VISÃO DO INTERIOR {selectedSimFilm ? `• VLT ${activeSimFilm?.specs?.vlt || "70-80%"}` : "• COMPLETAMENTE EXPOSTO"}
              </div>
            </div>

            {/* Temperatures with horizontal thermometer progress gauges */}
            <div className={`flex flex-col sm:flex-row border ${theme.border} bg-[#0c0c0e] divide-y sm:divide-y-0 sm:divide-x divide-zinc-800`}>
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 bg-zinc-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-none bg-red-500/10 text-red-500 border border-red-500/20">
                      <Thermometer size={18} />
                    </div>
                    <div>
                      <h4 className="text-[10px] md:text-[9px] font-black uppercase tracking-[0.25em] text-red-400 mb-0.5">
                        Vidro Comum (Sem Proteção)
                      </h4>
                      <p className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase">Calor Livre e Raios IR</p>
                    </div>
                  </div>
                  <div className="text-3xl font-light text-white tracking-widest font-mono">
                    {temps.commonTemp}°C
                  </div>
                </div>
                {/* Horizontal thermometer indicator bar */}
                <div className="w-full h-1.5 bg-red-950/20 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (temps.commonTemp / 60) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" 
                  />
                </div>
              </div>

              <div className={`flex-1 p-6 md:p-8 flex flex-col gap-4 transition-all duration-500 ${selectedSimFilm ? "bg-blue-950/15" : "bg-zinc-950/10"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-none transition-all duration-500 ${selectedSimFilm ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "bg-zinc-800/10 text-zinc-500 border border-zinc-800/10"}`}>
                      <Shield size={18} />
                    </div>
                    <div>
                      <h4 className={`text-[10px] md:text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${selectedSimFilm ? "text-blue-400" : "text-zinc-500"} mb-0.5`}>
                        Com {selectedSimFilm ? activeSimFilm?.name : "Winf™ Protection"}
                      </h4>
                      <p className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase">Blindagem Térmica Ativa</p>
                    </div>
                  </div>
                  <div className={`text-3xl font-light tracking-widest font-mono transition-colors duration-500 ${selectedSimFilm ? "text-blue-300" : "text-white"}`}>
                    {selectedSimFilm ? temps.winfTemp : temps.commonTemp}°C
                  </div>
                </div>
                {/* Horizontal thermometer indicator bar */}
                <div className="w-full h-1.5 bg-zinc-900 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((selectedSimFilm ? temps.winfTemp : temps.commonTemp) / 60) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className={`h-full transition-colors duration-500 ${selectedSimFilm ? "bg-gradient-to-r from-blue-500 to-cyan-400" : "bg-zinc-700"}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact callout */}
      <section className={`py-12 border-t ${theme.border} mt-auto text-center`}>
        <p
          className={`text-xs uppercase tracking-widest font-bold ${theme.textMuted}`}
        >
          Aplicação Artesanal. Realizada apenas por Mestres Aplicadores
          Certificados Winf Ascend™.
        </p>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm bg-neutral-950/95 border border-zinc-800 p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3.5 rounded-none"
          >
            <div className="w-8 h-8 rounded-none border border-neutral-800 flex items-center justify-center text-amber-500 shrink-0">
              <Shield size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
                {toast.message}
              </h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-light">
                {toast.sub}
              </p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-zinc-500 hover:text-white transition-colors text-xs font-black p-1"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsCatalog;
