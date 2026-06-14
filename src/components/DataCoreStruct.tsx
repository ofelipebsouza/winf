import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, ChevronRight, Binary, Server, BookOpen, Crown, Scale, Crosshair, Target } from 'lucide-react';

interface DataCoreStructProps {
  onBack: () => void;
}

export const DataCoreStruct: React.FC<DataCoreStructProps> = ({ onBack }) => {
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
              <Database className="w-8 h-8 text-winf-primary" />
              <h1 className="text-3xl font-medium tracking-tight text-white">WINF DATA CORE STRUCTURING DIRECTIVE™</h1>
            </div>
            <div className="text-sm tracking-widest text-winf-primary/80">CLASSIFICATION: ENTERPRISE DATA ARCHITECTURE | STATUS: STRUCTURED</div>
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

        {/* Content Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                
                {/* Módulo 01 */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative">
                    <h2 className="text-lg text-white font-medium mb-4 flex items-center"><Target className="w-5 h-5 mr-3 text-winf-primary" /> MÓDULO 01: MANIFESTO E POSICIONAMENTO</h2>
                    <ul className="space-y-4 text-sm text-winf-gray/80 leading-relaxed">
                        <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                            <span><strong>Transição Corporativa:</strong> A marca abandona o modelo de serviços tradicional e as operações de varejo obsoletas. Assume o posicionamento definitivo como Holding de Infraestrutura Tecnológica, Engenharia Térmica e Governança de Campo.</span>
                        </li>
                        <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                            <span><strong>Pilares Core:</strong> 1) Engenharia Térmica Científica (cálculos de redução e emissividade preditiva). 2) Rastreabilidade Criptográfica (garantias seguras on-chain). 3) Sistema de Reputação Viva (W-Rank e auditoria de campo constante).</span>
                        </li>
                    </ul>
                </div>

                {/* Módulo 02 */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative">
                    <h2 className="text-lg text-white font-medium mb-4 flex items-center"><Binary className="w-5 h-5 mr-3 text-winf-primary" /> MÓDULO 02: MATRIZ DE MODELOS DE NEGÓCIO</h2>
                    <div className="space-y-4 text-sm text-winf-gray/80 leading-relaxed">
                        <div className="bg-[#131314] p-4 border border-winf-gray/10">
                            <h3 className="text-winf-primary font-medium mb-2">Regional HUB</h3>
                            <p>O pulmão logístico do ecossistema. Requer galpão de 150m² a 300m² em concreto bruto. Atua como distribuidor fracionado de suprimentos e homologador técnico do W-Rank na região. Margens financeiras: Spread de venda sobre produtos B2B (20% a 35%) e Take Rate territorial (3% a 7%).</p>
                        </div>
                        <div className="bg-[#131314] p-4 border border-winf-gray/10">
                            <h3 className="text-white font-medium mb-2">Premium Franchise</h3>
                            <p>Showroom conceitual estruturado em luxo silencioso (Stealth Luxury). Base de captação primária de clientes alta renda (B2C AAA) e formulação agressiva de contratos corporativos de alto ticket. Experiência de venda tangibilizada por meio do Motor Térmico.</p>
                        </div>
                        <div className="bg-[#131314] p-4 border border-winf-gray/10">
                            <h3 className="text-winf-gray font-medium mb-2">Asset Light Member</h3>
                            <p>Operador ágil volante e Sniper Técnico da corporação. Possui ZERO custo imobiliário atrelado. Vende diretamente via aplicativo móvel WINF OS™, focando em velocidade e captação de leads. A aquisição e retirada de materiais é feita sob demanda nos HUBs.</p>
                        </div>
                    </div>
                </div>

            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
                
                {/* Módulo 03 */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative">
                    <h2 className="text-lg text-white font-medium mb-4 flex items-center"><Crown className="w-5 h-5 mr-3 text-winf-primary" /> MÓDULO 03: MECÂNICA GAMIFICADA (W-RANK)</h2>
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-winf-gray/20 text-winf-primary/80">
                                <th className="p-2">Level (Tier)</th>
                                <th className="p-2">Unlock de Funcionalidades WINF OS™</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-winf-gray/10 mt-2">
                            <tr><td className="p-2 text-winf-gray">L1 (Starter)</td><td className="p-2 text-winf-gray/80">Motor de Orçamentos Básicos e Materiais de Base.</td></tr>
                            <tr><td className="p-2 text-winf-gray">L2 (Specialist)</td><td className="p-2 text-winf-gray/80">WINF Select™ Pro Avançado e Relatórios Estratégicos.</td></tr>
                            <tr><td className="p-2 text-white">L3 (Certified Pro)</td><td className="p-2 text-winf-gray/80">Painel de Captação Assistida (WINF Brain / Leads).</td></tr>
                            <tr><td className="p-2 text-white font-medium">L4 (Elite)</td><td className="p-2 text-winf-gray/80">Painel de Holding; Operação de Asset Light Members afiliados.</td></tr>
                            <tr><td className="p-2 font-bold text-winf-primary">L5 (Black Tier)</td><td className="p-2 text-winf-gray/80">Voto em Matriz Térmica. Pool Institucional de Leads (Cortex).</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Módulo 04 */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative">
                    <h2 className="text-lg text-white font-medium mb-4 flex items-center"><Server className="w-5 h-5 mr-3 text-winf-primary" /> MÓDULO 04: INTEGRAÇÃO WINF OS™ CORE</h2>
                    <ul className="space-y-3 text-sm text-winf-gray/80 leading-relaxed text-justify">
                        <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                            <span><strong>Multi-Tenant & RLS (PostgreSQL):</strong> Isolamento completo de dados. Cada parceiro processa leads, orçamentos e financeiro em silos independentes. O Row-Level Security garante que os dados não vazem algoritmicamente entre HUBs ou entre parceiros, preservando sigilo corporativo absoluto.</span>
                        </li>
                        <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 mr-2 mt-1 text-winf-primary flex-shrink-0" />
                            <span><strong>Motor de Cálculo / GeoStrategy:</strong> Automação científica em orçamentos prediais. Mapeia as variáveis externas (índice de insolação), emissividade térmica da película aplicada e Delta T em tempo real para cálculo automático de custos e entrega de relatório de ROI energético com total precisão computacional.</span>
                        </li>
                    </ul>
                </div>

                {/* Módulo 05 */}
                <div className="border border-winf-gray/20 p-6 bg-[#131314] relative">
                    <h2 className="text-lg text-white font-medium mb-4 flex items-center"><Scale className="w-5 h-5 mr-3 text-winf-primary" /> MÓDULO 05: PROPRIEDADE INTELECTUAL</h2>
                    <div className="space-y-3 text-sm text-winf-gray/80 leading-relaxed font-mono">
                        <blockquote className="border-l-2 border-winf-primary/50 pl-4 bg-[#131314] p-3 text-xs">
                            <strong className="text-white block mb-1 uppercase">Cláusula IP Estrita</strong> Código-fonte do WINF OS™, o motor térmico, algoritmo W-Rank, além dos renders de ambientes e veículos pertencem 100% à holding WINF CAPITAL™.
                        </blockquote>
                        <blockquote className="border-l-2 border-winf-primary/50 pl-4 bg-[#131314] p-3 text-xs">
                            <strong className="text-white block mb-1 uppercase">Cláusula Não-Concorrência (Non-Compete)</strong> Bloqueio absoluto de associação, treinamento ou criação de marca concorrente no mercado num período estrito de 5 (cinco) anos após rescisão legal.
                        </blockquote>
                        <blockquote className="border-l-2 border-winf-primary/50 pl-4 bg-[#131314] p-3 text-xs">
                            <strong className="text-white block mb-1 uppercase">Kill-Switch de Marca Automático</strong> Retirada integral de todas as chancelas visuais WINF™, letreiros físicos e menções em redes sociais no limite rígido de 48 horas após distrato oficial.
                        </blockquote>
                    </div>
                </div>

            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default DataCoreStruct;
