import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, LayoutTemplate, Briefcase, PackageCheck, Users, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ModuleStrategicPresentationProps {
  onBack: () => void;
}

export const ModuleStrategicPresentation: React.FC<ModuleStrategicPresentationProps> = ({ onBack }) => {
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
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#020202] min-h-screen text-winf-gray p-8 font-mono pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-winf-gray/20 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <LayoutTemplate className="w-8 h-8 text-winf-primary" />
              <h1 className="text-3xl font-medium tracking-tight text-white uppercase">WINF INTERFACE OVERRIDE™</h1>
            </div>
            <div className="text-sm tracking-widest text-winf-primary/80">CLASSIFICATION: STRATEGIC COMMERCIAL PRESENTATION | COGNITIVE DEPLOY</div>
          </div>
          <button onClick={onBack} className="text-winf-gray hover:text-white transition-colors flex items-center">
             &lt; System Return
          </button>
        </div>

        {/* HUD Progress Bar */}
        <div className="space-y-2">
           <div className="flex justify-between text-xs tracking-wider">
              <span>SYSTEM COMPILE: KNOWLEDGE BASE INTEGRATION</span>
              <span>{progress}%</span>
           </div>
           <div className="w-full bg-winf-gray/10 h-1">
              <div 
                className="bg-winf-primary h-1 transition-all duration-300 shadow-[0_0_10px_rgba(201,162,39,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

        {/* Executive Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-winf-gray/90 leading-relaxed border-l-2 border-winf-primary pl-4 bg-winf-primary/5 p-4 rounded-none">
          <p>
            Bem-vindos à mesa de governança da <strong>WINF CAPITAL™</strong>. Este painel resume as verticais estratégicas da holding, projetadas para erradicar a ineficiência do modelo obsoleto de serviços automotivos/residenciais por meio do fornecimento estrito de infraestrutura tecnológica, engenharia de ponta e logística descentralizada. Todo esse arcabouço encontra-se formalmente estruturado e documentado em nossa base de dados oficial (Oficial Knowledge Base - OKB).
          </p>
        </motion.div>

        {/* 1. O Portfólio Comercial */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="border border-winf-gray/20 bg-[#131314] relative">
            <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
              <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest"><Briefcase className="w-5 h-5 mr-3 text-winf-primary" /> 1. Portfólio Comercial: WINF PARTNERS™</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#131314] border border-winf-gray/10 p-5 group hover:border-winf-primary/50 transition-colors">
                <h3 className="text-winf-primary font-medium mb-3 uppercase tracking-wider text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Asset Light
                </h3>
                <p className="text-xs text-winf-gray/80 leading-relaxed mb-4">
                  Licenciamento com zero Capex imobiliário. Focado no uso corporativo do sistema <strong>WINF OS™</strong> para prospecção técnica in-loco nas propriedades dos clientes.
                </p>
                <div className="bg-winf-primary/10 p-2 text-winf-primary text-xs uppercase font-medium border border-winf-primary/20 flex justify-between items-center">
                  <span>Meta de Operação:</span>
                  <span>100 Unidades Ativas</span>
                </div>
              </div>

              <div className="bg-[#131314] border border-winf-gray/10 p-5 group hover:border-winf-primary/50 transition-colors">
                <h3 className="text-white font-medium mb-3 uppercase tracking-wider text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-winf-primary" /> WINF Kiosks
                </h3>
                <p className="text-xs text-winf-gray/80 leading-relaxed">
                  Postos avançados implantados em centros urbanos estratégicos (Shoppings AAA e Aeroportos nas capitais). Operações táticas formatadas para captura massiva de leads de luxo e fluxo de alto padrão, retroalimentando as outras pernas da rede corporativa com projetos residenciais de vulto.
                </p>
              </div>

              <div className="bg-[#131314] border border-winf-gray/10 p-5 group hover:border-winf-primary/50 transition-colors">
                <h3 className="text-white font-medium mb-3 uppercase tracking-wider text-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-winf-primary" /> Studio AeroCore
                </h3>
                <p className="text-xs text-winf-gray/80 leading-relaxed">
                  Posicionamento técnico supremo. Bases robustas de engenharia térmica exclusivas e dedicadas a serviços complexos (grau aeroespacial). São a materialização física máxima de autoridade da The Winf Company™.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2 e 3 Grid Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 2. Engenharia Logística BlackShop */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-winf-gray/20 bg-[#131314] flex flex-col">
            <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
              <h2 className="text-lg text-white font-medium flex items-center uppercase tracking-widest"><PackageCheck className="w-5 h-5 mr-3 text-winf-primary" /> 2. Logística BlackShop™</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-winf-gray/80 leading-relaxed flex-1 bg-[#131314]/50">
              <p>O braço logístico <strong>BlackShop™</strong> resolve a ruptura tradicional do mercado pulverizado de suprimentos. Trata-se do e-commerce B2B e da estrutura de distribuição descentralizada de suprimentos.</p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                  <span><strong>Processamento Automatizado:</strong> Orçamentos chancelados pelo WINF OS™ nas pontas disparam remessas automatizadas do centro de distribuição, realizando o corte exato para execução.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                  <span><strong>Descentralização com HUBs:</strong> Elimina estoque das unidades menores (Asset Light/Kiosk), deslocando a segurança do suprimento estrito para sob-demanda com máxima agilidade macro-regional.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* 3. Governança 12 Cadeiras */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border border-winf-gray/20 bg-[#131314] flex flex-col">
            <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
              <h2 className="text-lg text-white font-medium flex items-center uppercase tracking-widest"><Users className="w-5 h-5 mr-3 text-winf-primary" /> 3. Conselhos de Classe (12 Cadeiras)</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-winf-gray/80 leading-relaxed flex-1 bg-[#131314]/50">
              <p>O grau máximo de integração societária e inteligência institucional da Holding acontece no assento das <strong>12 Cadeiras de Dividendos</strong>.</p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                  <span><strong>Participação Econômica:</strong> Remuneração atrelada aos resultados globais macro (Licenciamentos WINF OS™, giro BlackShop™ e contratos HUBs), estabelecendo um realinhamento onde parceiro e holding jogam pelo mesmo ganho sistêmico.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                  <span><strong>Decisão Macro:</strong> Participação ativa nos Comitês de alocação de ativos e direção da tecnologia térmica mundial da marca.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        
        </div>

        {/* 4. Triagem Obrigatória */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
           <div className="bg-winf-primary/10 border border-winf-primary/30 p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
             <AlertTriangle className="w-12 h-12 text-winf-primary flex-shrink-0" />
             <div>
               <h2 className="text-xl text-white tracking-widest font-medium mb-3 uppercase">Triagem Obrigatória & Inclusão Administrativa</h2>
               <p className="text-sm text-winf-gray/90 leading-relaxed mb-4">
                 É <strong>terminantemente proibido</strong> o ingresso automatizado ou o livre acesso às licenças executivas do grupo. O acesso a uma das 12 Cadeiras de Governança ou ao portfólio oficial (Asset Light e Hubs) <strong>OBRIGA</strong> a estrita Triagem Manual pela alta liderança da WINF CAPITAL™.
               </p>
               <div className="bg-[#131314]/50 border border-winf-primary/20 p-4 font-mono text-xs text-winf-primary mt-2">
                 <span>{`> PROTOCOLO_STATUS = "STRICT_SCREENING_ENFORCED"`}</span><br/>
                 <span>{`> VOTAÇÃO UNÂNIME DE FUNDADORES REQUIRED FOR CLEARANCE`}</span>
               </div>
             </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModuleStrategicPresentation;
