import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, Layers, MapPin, Building2, PackageSearch, Users } from 'lucide-react';

interface ModulePortfolioAssetsProps {
  onBack: () => void;
}

export const ModulePortfolioAssets: React.FC<ModulePortfolioAssetsProps> = ({ onBack }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#020202] min-h-screen text-winf-gray p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-winf-gray/20 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Briefcase className="w-8 h-8 text-winf-primary" />
              <h1 className="text-3xl font-medium tracking-tight text-white uppercase">Portfólio de Ativos Comerciais e Metas de Expansão</h1>
            </div>
            <div className="text-sm tracking-widest text-winf-primary/80">WINF PARTNERS™ | CLASSIFICATION: ENTERPRISE STRATEGY | STATUS: ACTIVE</div>
          </div>
          <button onClick={onBack} className="text-winf-gray hover:text-white transition-colors">
             &lt; System Return
          </button>
        </div>

        {/* HUD Progress Bar */}
        <div className="space-y-2">
           <div className="flex justify-between text-xs tracking-wider">
              <span>SYSTEM INDEXING & SANITIZATION PROGRESS</span>
              <span>{progress}%</span>
           </div>
           <div className="w-full bg-winf-gray/10 h-1">
              <div 
                className="bg-winf-primary h-1 transition-all duration-300 shadow-[0_0_10px_rgba(201,162,39,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

        <p className="text-sm text-winf-gray/90 leading-relaxed max-w-4xl">
          A WINF™ opera com ativos de tecnologia, licenças corporativas e canais físicos estruturados de distribuição. Este é o portfólio de produtos e a engenharia de expansão financeira da holding.
        </p>

        {/* Content Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                
                {/* Portfólio de Licenciamentos */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative h-full">
                    <h2 className="text-lg text-white font-medium mb-6 flex items-center uppercase tracking-wider"><Layers className="w-5 h-5 mr-3 text-winf-primary" /> A. Produtos e Licenciamentos de Mercado</h2>
                    
                    <div className="space-y-6">
                        {/* Asset Light */}
                        <div className="bg-[#131314] border border-winf-gray/10 p-5">
                            <h3 className="text-winf-primary font-medium mb-3 flex items-center"><ChevronRight className="w-4 h-4 mr-2" /> 1. LICENCIAMENTO ASSET LIGHT (Expansão Digital)</h3>
                            <ul className="space-y-3 text-xs text-winf-gray/80">
                                <li><strong className="text-white">O que é:</strong> Concessão do direito de uso comercial da marca WINF™ associado ao fornecimento do token de acesso móvel ao ecossistema de software WINF OS™ para consultores autônomos e aplicadores volantes.</li>
                                <li><strong className="text-white">Exemplo Prático:</strong> Um especialista técnico credenciado atua sem a necessidade de imobilizar capital em ponto comercial (Zero Capex Imobiliário). Através do aplicativo, ele realiza a análise científica de perda térmica no imóvel do cliente e fecha o projeto. O sistema calcula automaticamente sua margem e emite o pedido logístico.</li>
                                <li className="bg-winf-primary/10 p-2 border border-winf-primary/30 mt-2 text-winf-primary"><strong className="uppercase">META DE TRAÇÃO:</strong> Consolidação imediata de mercado através da meta corporativa de 100 Licenças Asset Light validadas e operantes na rede.</li>
                            </ul>
                        </div>

                        {/* WINF Kiosk */}
                        <div className="bg-[#131314] border border-winf-gray/10 p-5">
                            <h3 className="text-white font-medium mb-3 flex items-center"><MapPin className="w-4 h-4 text-winf-primary mr-2" /> 2. WINF KIOSK™ (Captação Estratégica)</h3>
                            <ul className="space-y-3 text-xs text-winf-gray/80">
                                <li><strong className="text-white">O que é:</strong> Modelo de microfranquia em formato de quiosque tático de altíssimo padrão, projetado para instalação em shoppings AAA e aeroportos das principais capitais e cidades polo.</li>
                                <li><strong className="text-white">Exemplo Prático:</strong> Unidades físicas compactas com estética minimalista (concreto bruto e displays retroiluminados) focadas em atrair o público proprietário de veículos importados e agendar auditorias térmicas residenciais de alto padrão em tempo real.</li>
                            </ul>
                        </div>

                        {/* STUDIO AEROCORE */}
                        <div className="bg-[#131314] border border-winf-gray/10 p-5">
                            <h3 className="text-white font-medium mb-3 flex items-center"><Building2 className="w-4 h-4 text-winf-primary mr-2" /> 3. STUDIO AEROCORE™ (Unidades de Engenharia)</h3>
                            <ul className="space-y-3 text-xs text-winf-gray/80">
                                <li><strong className="text-white">O que é:</strong> Showrooms de marca e centros de engenharia focados no fornecimento e aplicação de películas solares de grau aeroespacial, revestimentos de alta performance com nanotecnologia e proteção de superfícies complexas. É o selo de autoridade técnica máxima do grupo.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6 flex flex-col">
                
                {/* BlackShop */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative flex-1">
                    <h2 className="text-lg text-white font-medium mb-6 flex items-center uppercase tracking-wider"><PackageSearch className="w-5 h-5 mr-3 text-winf-primary" /> B. BLACKSHOP™ — INFRAESTRUTURA LOGÍSTICA</h2>
                    
                    <div className="bg-[#131314] border border-winf-gray/10 p-5 space-y-4 text-xs text-winf-gray/80">
                        <p><strong className="text-white">O que é:</strong> O ecossistema de e-commerce B2B e a estrutura de distribuição descentralizada responsável por suprir e blindar toda a cadeia de suprimentos da rede.</p>
                        <p><strong className="text-white">Dinâmica Operacional:</strong> Quando uma Ordem de Serviço é fechada em qualquer ponto da rede pelo WINF OS™ (seja por um Kiosk, Studio AeroCore ou membro Asset Light), a requisição é processada automaticamente pela BlackShop™. O centro realiza o corte computadorizado sob medida do lote do material e despacha o kit de instalação diretamente para o local da execução, eliminando o custo de estoque local imobilizado dos parceiros.</p>
                    </div>
                </div>

                {/* Governança Corporativa */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative flex-1">
                    <h2 className="text-lg text-white font-medium mb-6 flex items-center uppercase tracking-wider"><Users className="w-5 h-5 mr-3 text-winf-primary" /> C. GOVERNANÇA CORPORATIVA: AS 12 CADEIRAS</h2>
                    
                    <div className="bg-[#131314] border border-winf-gray/10 p-5 space-y-4 text-xs text-winf-gray/80">
                        <p className="text-winf-primary mb-2 uppercase tracking-widest text-xs font-semibold">A estrutura máxima de tesouraria e conselho econômico da WINF CAPITAL™</p>
                        <p><strong className="text-white">Definição:</strong> Um conselho restrito de governança composto por exatamente 12 Cadeiras de Conselheiros/Investidores Estratégicos.</p>
                        <p><strong className="text-white">Mecânica Financeira:</strong> Os titulares das Cadeiras participam do comitê de decisão sobre a expansão internacional e a alocação de ativos da holding. Possuem o direito de recebimento proporcional de dividendos e participação nos lucros sobre toda a receita macro-regional gerada pelo ecossistema (licenciamentos WINF OS™ da rede Partners, volume de faturamento da distribuidora BlackShop™ e contratos globais dos Studios AeroCore). O ingresso é restrito e depende de aprovação unânime dos fundadores.</p>
                    </div>
                </div>

            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ModulePortfolioAssets;
