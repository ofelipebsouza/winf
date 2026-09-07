import { PAGE_META } from '../data/siteMeta';
import { usePageMeta } from '../hooks/usePageMeta';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Search, Menu, X, ChevronRight } from "lucide-react";

interface LandingShopProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  images: string[];
  description: string;
  sizes?: string[];
}

const products: Product[] = [
  { id: 1, name: "AEROCORE TACTICAL CAP", category: "HEADWEAR", price: "R$ 189", images: ["/images/shop/blackshop (1).png", "/images/shop/blackshop (2).webp", "/images/shop/blackshop (3).webp"], description: "Gorra tática com embroso AEROCORE™. Feita em ripstop resistente com acabamento premium.", sizes: ["M", "L", "XL"] },
  { id: 2, name: "NEOSKIN SHIELD HOODIE", category: "OUTERWEAR", price: "R$ 459", images: ["/images/shop/blackshop (4).webp", "/images/shop/blackshop (5).webp", "/images/shop/blackshop (6).webp"], description: "Moletom premium com estampa NEOSKIN™. Algodão francês 380gsm com forro polar.", sizes: ["S", "M", "L", "XL"] },
  { id: 3, name: "WINF SELECT TEE BLACK", category: "TOPS", price: "R$ 199", images: ["/images/shop/blackshop (7).webp", "/images/shop/blackshop (8).webp", "/images/shop/blackshop (9).webp"], description: "Camiseta essentials com logo WINF SELECT™. Algodão orgânico 240gsm.", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 4, name: "GHOST SERIES CAP", category: "HEADWEAR", price: "R$ 169", images: ["/images/shop/blackshop (10).webp", "/images/shop/blackshop (11).webp", "/images/shop/blackshop (12).webp"], description: "Gorra estilo snapback com bordado GHOST™. Estrutura rígida com aba curva.", sizes: ["M", "L"] },
  { id: 5, name: "BLACKPRO ELITE JACKET", category: "OUTERWEAR", price: "R$ 699", images: ["/images/shop/blackshop (13).webp", "/images/shop/blackshop (14).webp", "/images/shop/blackshop (15).webp"], description: "Jaqueta softshell técnica BLACKPRO™. Resistente ao vento e água com membrana impermeável.", sizes: ["S", "M", "L", "XL"] },
  { id: 6, name: "THERMAL INTELLIGENCE TEE", category: "TOPS", price: "R$ 229", images: ["/images/shop/blackshop (16).webp", "/images/shop/blackshop (17).webp", "/images/shop/blackshop (18).webp"], description: "Camiseta técnica com tecnologia THERMAL INTELLIGENCE™. Secagem rápida.", sizes: ["S", "M", "L", "XL"] },
  { id: 7, name: "DUAL REFLECT BEANIE", category: "HEADWEAR", price: "R$ 129", images: ["/images/shop/blackshop (19).webp", "/images/shop/blackshop (20).webp", "/images/shop/blackshop (21).webp"], description: "Gorro premium DUAL REFLECT™. Malha canelada com label de couro sintético.", sizes: ["UNI"] },
  { id: 8, name: "INVISIBLE SHIELD VEST", category: "OUTERWEAR", price: "R$ 549", images: ["/images/shop/blackshop (22).webp", "/images/shop/blackshop (23).webp", "/images/shop/blackshop (24).webp"], description: "Colete técnico INVISIBLE™. Design minimalista com múltiplos bolsos funcionais.", sizes: ["S", "M", "L", "XL"] },
  { id: 9, name: "AEROCORE TECH POLO", category: "TOPS", price: "R$ 279", images: ["/images/shop/blackshop (25).webp", "/images/shop/blackshop (26).webp", "/images/shop/blackshop (27).webp"], description: "Polo técnica AEROCORE™. Malha piqueté com acabamento antimanchas.", sizes: ["S", "M", "L", "XL"] },
  { id: 10, name: "WINF PARTNERS CAP", category: "HEADWEAR", price: "R$ 159", images: ["/images/shop/blackshop (28).webp", "/images/shop/blackshop (29).webp", "/images/shop/blackshop (30).webp"], description: "Gorra ajustável WINF PARTNERS™. Trama densa com fecho metálico.", sizes: ["M", "L"] },
  { id: 11, name: "NEOSKIN DEFENSE KIT", category: "ACCESSORIES", price: "R$ 899", images: ["/images/shop/blackshop (31).webp", "/images/shop/blackshop (32).webp", "/images/shop/blackshop (33).webp"], description: "Kit completo de proteção NEOSKIN™. Inclui cap + bandana + pin set.", sizes: ["M", "L", "XL"] },
  { id: 12, name: "CERAMIC ARMOR TEE", category: "TOPS", price: "R$ 209", images: ["/images/shop/blackshop (34).webp", "/images/shop/blackshop (35).webp", "/images/shop/blackshop (36).webp"], description: "Camiseta CERAMIC ARMOR™ com estampa refletiva. Algodão premium 260gsm.", sizes: ["S", "M", "L", "XL"] },
  { id: 13, name: "SECURITYBLINDER BOMBER", category: "OUTERWEAR", price: "R$ 799", images: ["/images/shop/blackshop (37).webp", "/images/shop/blackshop (38).webp", "/images/shop/blackshop (39).webp"], description: "Jaqueta bomber SECURITYBLINDER™. Material nylon ripstop com forro satinado.", sizes: ["S", "M", "L", "XL"] },
  { id: 14, name: "WRAITH SHADOW GLOVES", category: "ACCESSORIES", price: "R$ 149", images: ["/images/shop/blackshop (40).webp", "/images/shop/blackshop (41).webp", "/images/shop/blackshop (42).webp"], description: "Luvas tacticas WRAITH™. Toque sensível na tela com palma antiderrapante.", sizes: ["M", "L", "XL"] },
  { id: 15, name: "SPECTRE ULTRA LONG", category: "TOPS", price: "R$ 319", images: ["/images/shop/blackshop (43).webp", "/images/shop/blackshop (44).webp", "/images/shop/blackshop (45).webp"], description: "Camiseta longa SPECTRE ULTRA™. Tecido térmico com costuras flatlock.", sizes: ["S", "M", "L", "XL"] },
  { id: 16, name: "PHANTOM STEALTH PACK", category: "ACCESSORIES", price: "R$ 349", images: ["/images/shop/blackshop (46).webp", "/images/shop/blackshop (47).webp", "/images/shop/blackshop (48).webp"], description: "Kit PHANTOM™: mochila sling + power bank + carregador wireless.", sizes: [] },
  { id: 17, name: "WINF LEGACY TOTE", category: "ACCESSORIES", price: "R$ 179", images: ["/images/shop/blackshop (49).webp", "/images/shop/blackshop (50).webp", "/images/shop/blackshop (51).webp"], description: "Tote bag WINF LEGACY™. Canvas orgânico 12oz com estampa serigrafada.", sizes: [] },
  { id: 18, name: "GHOST PRO RAIN JACKET", category: "OUTERWEAR", price: "R$ 599", images: ["/images/shop/blackshop (52).webp", "/images/shop/blackshop (53).webp", "/images/shop/blackshop (54).webp"], description: "Jaqueta de chuva GHOST PRO™. Impermeável com costuras soldadas e capuz destacável.", sizes: ["S", "M", "L", "XL"] },
  { id: 19, name: "AEROCORE SNAP V2", category: "HEADWEAR", price: "R$ 179", images: ["/images/shop/blackshop (55).webp", "/images/shop/blackshop (56).webp", "/images/shop/blackshop (57).webp"], description: "Gorra snapback AEROCORE V2™. Nova coleção com design aerodinâmico.", sizes: ["M", "L"] },
  { id: 20, name: "UNIVERSO DARK EDITION", category: "OUTERWEAR", price: "R$ 999", images: ["/images/shop/blackshop (58).webp", "/images/shop/blackshop (59).webp", "/images/shop/blackshop (60).png"], description: "Edição limitada UNIVERSO DARK™. Jaqueta premium com detalhes em couro e hardware gunmetal.", sizes: ["S", "M", "L", "XL"] },
];

const categories = ["ALL", "HEADWEAR", "TOPS", "OUTERWEAR", "ACCESSORIES"];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const LandingShop: React.FC<LandingShopProps> = ({ onBack, onOpenMenu }) => {
  usePageMeta(PAGE_META.shop);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const filteredProducts = selectedCategory === "ALL"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImage(0);
    setSelectedSize(product.sizes?.[0] || "");
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white">
      {/* ── HEADER ── */}
      <header className="w-full border-b border-white/10 sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">VOLTAR</span>
          </button>
          <h1 className="text-sm sm:text-base font-bold tracking-[0.4em] uppercase">WINF™ BLACKSHOP</h1>
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
            <ShoppingBag className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {selectedProduct ? (
          /* ── PRODUCT DETAIL ── */
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 sm:px-10 py-8"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-8">
              <button onClick={() => setSelectedProduct(null)} className="hover:text-white transition-colors cursor-pointer">SHOP</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-300">{selectedProduct.category}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{selectedProduct.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Images */}
              <div>
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full aspect-square bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden mb-4"
                >
                  <img
                    src={selectedProduct.images[selectedImage]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="flex gap-3">
                  {selectedProduct.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 bg-zinc-900 border transition-all cursor-pointer ${
                        i === selectedImage ? "border-white" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-[0.3em] mb-3">{selectedProduct.category}</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">{selectedProduct.name}</h2>
                <p className="text-lg font-mono text-zinc-300 mb-6">{selectedProduct.price}</p>
                <p className="text-sm font-mono text-zinc-400 uppercase leading-relaxed mb-8">{selectedProduct.description}</p>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-8">
                    <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">TAMANHO</p>
                    <div className="flex gap-3">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                            selectedSize === size
                              ? "border-white bg-white text-black"
                              : "border-white/20 text-white hover:border-white"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full py-4 bg-white text-black font-bold text-xs font-mono uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  ADICIONAR AO CARRINHO
                </button>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="mt-4 py-3 text-xs font-mono text-zinc-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer text-center"
                >
                  ← VOLTAR À LOJA
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── PRODUCT GRID ── */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero */}
            <div className="w-full py-16 sm:py-24 text-center border-b border-white/10">
              <motion.h2
                {...fadeInUp}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-4"
              >
                <span className="text-white">WINF™ </span>
                <span className="text-zinc-400">BLACKSHOP</span>
              </motion.h2>
              <motion.p
                {...fadeInUp}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-xs sm:text-sm font-mono text-zinc-400 uppercase tracking-[0.3em]"
              >
                MERCHANDISE OFICIAL · ENGENHARIA INVISÍVEL
              </motion.p>
            </div>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 border-b border-white/10 pb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer pb-2 ${
                      selectedCategory === cat
                        ? "text-white border-b border-white"
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-10">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    {...fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => openProduct(product)}
                    className="group cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-zinc-900 border border-white/10 group-hover:border-white/30 transition-all duration-500 overflow-hidden mb-3 relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-1">{product.category}</p>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide mb-1 group-hover:text-zinc-300 transition-colors">{product.name}</h3>
                    <p className="text-xs font-mono text-zinc-400">{product.price}</p>
                    <p className="text-[10px] font-mono text-white uppercase tracking-widest mt-2 underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity">SHOP NOW</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t border-white/10 py-16 sm:py-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
                    THE<br />SHOW<br />MUST<br />GO ON
                  </h3>
                </div>
                <div>
                  <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-6">
                    RECEBA NOVIDADES E OFERTAS EXCLUSIVAS
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="SEU E-MAIL"
                      className="flex-1 px-4 py-3 bg-transparent border border-white/20 text-white text-xs font-mono uppercase tracking-widest placeholder:text-zinc-400 focus:outline-none focus:border-white"
                    />
                    <button className="px-6 py-3 bg-white text-black text-xs font-bold font-mono uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer">
                      INSCREVER
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 py-8">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-8 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  <span className="hover:text-white cursor-pointer transition-colors">POLÍTICA DE PRIVACIDADE</span>
                  <span className="hover:text-white cursor-pointer transition-colors">TERMOS DE USO</span>
                  <span className="hover:text-white cursor-pointer transition-colors">CONTATO</span>
                </div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">© 2026 WINF™ BLACKSHOP</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingShop;
