import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface NeoSkinCatalogProps {
  product: "bunker" | "apocalypse";
  onBack: () => void;
  onOpenMenu?: () => void;
}

const productData = {
  bunker: {
    name: "BUNKER 150",
    series: "BKR-150",
    tagline: "150 MICRONS",
    description: "A BARREIRA HIDROFÓBICA E TÁTICA QUE OBLITERA A OXIDAÇÃO EM CRUZADORES E LANCHAS ÁGEIS. PROTEÇÃO PPF DE ALTA DENSIDADE PARA IMPACTOS SEVEROS.",
    specs: ["150 MICRONS", "PPF ELITE", "RESISTÊNCIA EXTREMA"],
    images: [
      { src: "/images/neoskin-catalog/bunker-150.png", label: "BUNKER 150" },
    ],
    banner: "/images/neoskin-catalog/banner-neoskin.png",
  },
  apocalypse: {
    name: "APOCALYPSE 190",
    series: "APX-190",
    tagline: "190 MICRONS",
    description: "PROTEÇÃO FÍSICA OCEÂNICA INTRANSPONÍVEL CONTRA CORAIS AFIADOS E IMPACTOS DE ALTA ENERGIA NO CAIS. A MÁXIMA ESPESSURA EM PPF MILITAR.",
    specs: ["190 MICRONS", "PPF MILITAR", "BLINDAGEM TOTAL"],
    images: [
      { src: "/images/neoskin-catalog/apocalypse-190.png", label: "APOCALYPSE 190" },
    ],
    banner: "/images/neoskin-catalog/banner-neoskin.png",
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const NeoSkinCatalog: React.FC<NeoSkinCatalogProps> = ({ product, onBack }) => {
  const data = productData[product];

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-6 sm:p-10 z-30 relative">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-mono uppercase tracking-widest">VOLTAR</span>
        </button>
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em]">
          NEOSKIN™ CATALOG
        </h2>
      </header>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-[40vh] sm:h-[50vh] relative overflow-hidden"
      >
        <img
          src={data.banner}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <span className="text-[10px] font-mono text-[#7A9856] uppercase tracking-[0.3em] block mb-2">
            {data.series}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-2">
            {data.name}
          </h1>
          <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
            {data.tagline}
          </p>
        </div>
      </motion.div>

      {/* Description */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-12">
        <p className="text-sm sm:text-base font-mono text-zinc-300 uppercase leading-relaxed mb-8">
          {data.description}
        </p>
        <div className="flex flex-wrap gap-6 text-xs font-mono text-zinc-500 uppercase tracking-wider">
          {data.specs.map((spec, i) => (
            <span key={i}>{spec}</span>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-20">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] mb-8">
          CATÁLOGO DE ESPECIFICAÇÕES
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.images.map((img, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden bg-zinc-900 border border-white/10 hover:border-[#546A36] transition-all duration-300"
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <span className="text-xs font-mono text-white uppercase tracking-widest">
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeoSkinCatalog;
