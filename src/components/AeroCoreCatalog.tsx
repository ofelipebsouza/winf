import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface AeroCoreCatalogProps {
  product: "ghost" | "phantom" | "spectre" | "wraith";
  onBack: () => void;
  onOpenMenu?: () => void;
}

const productData = {
  ghost: {
    name: "GHOST",
    series: "HP SERIES",
    tagline: "PERFORMANCE ESSENCIAL",
    description: "PELÍCULA ESSENCIAL DE ENTRADA SUPERIOR AO MERCADO. PROTEÇÃO SOLAR EQUILIBRADA COM CLAREZA ÓPTICA IMPECÁVEL.",
    specs: ["IR 58%", "UV 99%", "3 ANOS"],
    images: [
      { src: "/images/aerocore-catalog/ghost-05.png", label: "GHOST 05%" },
      { src: "/images/aerocore-catalog/ghost-15.png", label: "GHOST 15%" },
      { src: "/images/aerocore-catalog/ghost-35.png", label: "GHOST 35%" },
    ],
    banner: "/images/aerocore-catalog/banner-aerocore.png",
  },
  phantom: {
    name: "PHANTOM",
    series: "TTA SERIES",
    tagline: "CARBONO ESTRUTURAL",
    description: "FUSÃO DE CARBONO ESTRUTURAL PARA REJEIÇÃO TÉRMICA AVANÇADA E ESTÉTICA MATTE PROFUNDA.",
    specs: ["IR 73%", "UV 99%", "10 ANOS"],
    images: [
      { src: "/images/aerocore-catalog/phantom-05.png", label: "PHANTOM 05%" },
      { src: "/images/aerocore-catalog/phantom-15.png", label: "PHANTOM 15%" },
      { src: "/images/aerocore-catalog/phantom-35.png", label: "PHANTOM 35%" },
    ],
    banner: "/images/aerocore-catalog/banner-aerocore.png",
  },
  spectre: {
    name: "SPECTRE",
    series: "HT SERIES",
    tagline: "NANO-CERÂMICA",
    description: "O ÁPICE DA TECNOLOGIA NANO-CERÂMICA. BLOQUEIO INFRAVERMELHO DE 95% PARA O MÁXIMO CONFORTO TÉRMICO.",
    specs: ["IR 95%", "UV 99%", "10 ANOS"],
    images: [
      { src: "/images/aerocore-catalog/spectre-05.png", label: "SPECTRE 05%" },
      { src: "/images/aerocore-catalog/spectre-15.png", label: "SPECTRE 15%" },
      { src: "/images/aerocore-catalog/spectre-35.png", label: "SPECTRE 35%" },
    ],
    banner: "/images/aerocore-catalog/banner-aerocore.png",
  },
  wraith: {
    name: "WRAITH",
    series: "TOP SERIES",
    tagline: "SPUTTERING IÔNICO",
    description: "BLINDAGEM TÉRMICA INVISÍVEL DE 70% VLT. MÁXIMA PROTEÇÃO SEM ALTERAR A TRANSPARÊNCIA ORIGINAL.",
    specs: ["IR 98%", "UV 99%", "10 ANOS"],
    images: [
      { src: "/images/aerocore-catalog/wraith-70.png", label: "WRAITH 70%" },
    ],
    banner: "/images/aerocore-catalog/banner-aerocore.png",
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const AeroCoreCatalog: React.FC<AeroCoreCatalogProps> = ({ product, onBack }) => {
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
          AEROCORE™ CATALOG
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
          <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-[0.3em] block mb-2">
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
              className="group relative overflow-hidden bg-zinc-900 border border-white/10 hover:border-[#2563EB] transition-all duration-300"
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

export default AeroCoreCatalog;
