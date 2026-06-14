import React from 'react';
import { motion } from 'motion/react';
import { Shield, ChevronRight, Zap, Thermometer, Sun } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    image?: string;
    line?: string;
    performance?: {
      thermal: number;
      light: number;
      shield: number;
      privacy: number;
    };
  };
  onDetails: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDetails }) => {
  // Translate fields from both standard layout and user properties safely
  const imageUrl = product.image || `https://picsum.photos/seed/${product.id}/800/600`;
  const name = product.name;
  const description = product.description;
  const sku = product.id.toUpperCase();
  
  // High-end pricing estimation based on product line
  const price = product.id.includes('select') ? '1.850,00' : product.id.includes('neoskin') ? '3.200,00' : '2.450,00';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="product-card group relative bg-[#0f0f0f] border border-[#333] rounded-none overflow-hidden transition-all duration-300 hover:border-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
      id={`product-card-${product.id}`}
    >
      {/* Visual Header / Image Box (Satisfies user request selector card-visual) */}
      <div className="card-visual relative h-64 overflow-hidden bg-[#131314] flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-85" />
        
        {/* User Required Overlay Badge (Satisfies selector overlay-badge with AEROCORE™ theme) */}
        <div className="overlay-badge absolute top-6 left-6 px-4 py-1.5 bg-[#000]/80 backdrop-blur-md border border-[#333] rounded-none">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00ff41] font-mono animate-pulse">
            AEROCORE™
          </p>
        </div>

        {/* Dynamic Category Overlay */}
        {product.line && (
          <div className="absolute top-6 right-6 px-3 py-1 bg-white/5 border border-[#444746] rounded-none">
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
              {product.line}
            </span>
          </div>
        )}
      </div>

      {/* Info Body (Satisfies user request selector card-info) */}
      <div className="card-info p-8 space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-white transition-colors">
            {name}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-medium">
            {description}
          </p>
        </div>

        {/* Performance metrics breakdown if available */}
        {product.performance && (
          <div className="flex items-center gap-4 py-3 border-y border-[#444746] font-mono text-[10px]">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="font-bold text-white/60 tracking-wider">TE: {product.performance.thermal}/10</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-bold text-white/60 tracking-wider">Luz: {product.performance.light}/10</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white/60 tracking-wider">Bloq: {product.performance.shield}/10</span>
            </div>
          </div>
        )}

        {/* Pricing Segment with Courier Monospace highlight (Satisfies selector price-tag) */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Preço Sugerido / Bobina</span>
          <div className="price-tag font-mono text-xl font-extrabold text-[#00ff41] tracking-wide">
            R$ {price}
          </div>
        </div>

        {/* User Required Button (Satisfies btn-winf for call to action) */}
        <button
          onClick={() => onDetails(product.id)}
          className="btn-winf w-full group/btn relative flex items-center justify-between bg-white text-black px-6 py-3.5 rounded-none font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-zinc-200 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-1">
            SOLICITAR ORÇAMENTO
          </span>
          <ChevronRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
        </button>
      </div>

      {/* Defensive embedded styles matching template precisely to protect cascade */}
      <style>{`
        .product-card { 
            background: #0f0f0f; border: 1px solid #333; 
            border-radius: 4px; overflow: hidden; transition: 0.3s;
        }
        .product-card:hover { border-color: #fff; }
        .price-tag { 
            font-family: 'Courier New', monospace; 
            font-size: 1.2rem; 
            color: #00ff41; 
            margin: 10px 0; 
        }
        .btn-winf { 
            width: 100%; padding: 12px; background: #fff; 
            color: #000; border: none; cursor: pointer; text-transform: uppercase; font-weight: bold;
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
