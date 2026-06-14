import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Lock, TriangleAlert, Server } from 'lucide-react';

interface ExecutiveClosingHUDProps {
  onBack: () => void;
}

export const ExecutiveClosingHUD: React.FC<ExecutiveClosingHUDProps> = ({ onBack }) => {
  const [progress, setProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  React.useEffect(() => {
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

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
        window.location.href = "mailto:marketing.advanced.windowfilm@gmail.com?subject=[WINF EXEC_CONNECT] Acionamento VIP Protocol&body=O Convidado VIP acaba de assinar eletronicamente o W-IPD e validou a Fase 03. O IP esta blindado.";
        setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="bg-[#131314] min-h-screen text-winf-gray p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-winf-gray/20 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-winf-primary" />
              <h1 className="text-3xl font-medium tracking-tight text-white">WINF CRITICAL CORE AUDIT™</h1>
            </div>
            <div className="text-sm tracking-widest text-winf-primary/80">CLASSIFICATION: ENTERPRISE EXECUTIVO | STATUS: HOMOLOGATED</div>
          </div>
          <button onClick={onBack} className="text-winf-gray hover:text-white transition-colors">
             &lt; System Return
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
           <div className="flex justify-between text-xs tracking-wider">
              <span>SYSTEM AUDIT PROGRESS</span>
              <span>{progress}%</span>
           </div>
           <div className="w-full bg-winf-gray/10 h-1">
              <div 
                className="bg-winf-primary h-1 transition-all duration-300 shadow-[0_0_10px_rgba(201,162,39,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

        {/* Bloque 1: Business Plan & Posicionamento */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="border border-winf-gray/20 p-6 bg-winf-gray/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-winf-primary/5 blur-3xl rounded-none"></div>
            <h2 className="text-xl text-white font-medium mb-6 flex items-center"><Server className="w-5 h-5 mr-3 text-winf-primary" /> BLINDAGEM DO MODELO DE NEGÓCIO</h2>
            
            <div className="space-y-6 text-sm leading-relaxed">
              <div>
                 <h3 className="text-white mb-2">1. O POSICIONAMENTO ESTRATÉGICO</h3>
                 <p>A WINF™ não atua sob o modelo obsoleto de prestação de serviços convencionais. Nossa holding opera exclusivamente como uma <strong>Infraestrutura Tecnológica e de Engenharia Térmica de Alta Performance</strong>.</p>
              </div>

              <div>
                 <h3 className="text-white mb-2">2. OS MODELOS DE NEGÓCIO DA REDE</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="border border-winf-gray/10 p-4">
                       <h4 className="text-winf-primary mb-2">Regional HUB</h4>
                       <ul className="space-y-2 text-xs">
                          <li><strong>Papel Operacional:</strong> Centro de distribuição tática e suporte logístico em raio de 150km. Controle de malha fina.</li>
                          <li><strong>Requisitos de Infra:</strong> Centro logístico climatizado A+, docas de recepção, sala de treinamento Master, showroom invisível (Stealth Luxury).</li>
                          <li><strong>Fluxos de Receita:</strong> Venda de insumos físicos B2B, margem em certificação de franquias subordinadas e escoamento regional (BlackShop Pool).</li>
                          <li><strong>Rentabilidade:</strong> Escalabilidade exponencial com base em capilaridade territorial, retorno sobre investimentos em infraestrutura (ROI estimado em 8-12 meses).</li>
                       </ul>
                    </div>
                    <div className="border border-winf-gray/10 p-4">
                       <h4 className="text-white mb-2">Premium Franchise</h4>
                       <ul className="space-y-2 text-xs">
                          <li><strong>Papel Operacional:</strong> Ponta de lança de execução de alto padrão. Atendimento direto B2C Premium e Arquitetura B2B de luxo.</li>
                          <li><strong>Requisitos de Infra:</strong> Estúdio imaculado (Kiosk ou Studio), iluminação de espectro técnico.</li>
                          <li><strong>Fluxos de Receita:</strong> Serviços de instalação Premium, upgrades no simulador.</li>
                          <li><strong>Rentabilidade:</strong> Altíssima margem de lucro por metro quadrado operado; ticket médio 4x superior ao mercado convencional.</li>
                       </ul>
                    </div>
                    <div className="border border-winf-gray/10 p-4">
                       <h4 className="text-winf-gray mb-2">Asset Light Member</h4>
                       <ul className="space-y-2 text-xs">
                          <li><strong>Papel Operacional:</strong> Expansão via inteligência sem estoque de hardware. Captação de leads.</li>
                          <li><strong>Requisitos de Infra:</strong> Zero ativos físicos. Somente malha digital, acesso ao WINF OS™ e credenciamento tático VIP.</li>
                          <li><strong>Fluxos de Receita:</strong> Comissionamento vitalício residual por projetos fechados dentro da célula.</li>
                          <li><strong>Rentabilidade:</strong> Infinite ROI (zero capital de aquisição imobilizado). Risco zero de ociosidade operacional.</li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-white mb-2">3. A TRILHA GAMIFICADA (LEVELS 1 A 5 - W-RANK)</h3>
                 <p className="mb-4">O Motor Base de Reputação Viva calcula a eficácia do parceiro não apenas pelo volume de faturamento, mas por sua conformidade operacional (W-Rank). Essa é uma métrica inflexível processada on-chain.</p>
                 <table className="w-full text-left text-xs border-collapse">
                    <thead>
                       <tr className="border-b border-winf-gray/20 text-winf-primary/80">
                          <th className="p-2">Level</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Unlock / Destrava no Plataforma</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-winf-gray/10">
                       <tr><td className="p-2">L1</td><td className="p-2">Operador Iniciado</td><td className="p-2">Acesso ao Motor de Orçamentos Básicos e Material Stealth de base.</td></tr>
                       <tr><td className="p-2">L2</td><td className="p-2">Especialista Técnico</td><td className="p-2">Destrava acesso total ao WINF Select™ Pro Avançado e Relatórios Prediais Inteligentes.</td></tr>
                       <tr><td className="p-2">L3</td><td className="p-2">Elite Partner</td><td className="p-2">Acesso Privilegiado ao Painel de Captação Geográfica Assistida por AI. (WINF Brain)</td></tr>
                       <tr><td className="p-2">L4</td><td className="p-2">Master Architect</td><td className="p-2">Painel de Holding; capacidade de operar o Asset Light Member como afiliado próprio.</td></tr>
                       <tr><td className="p-2 font-bold text-winf-primary">L5</td><td className="p-2 font-bold text-winf-primary">Regional Council</td><td className="p-2 font-bold text-winf-primary">Direito de Voto em Decisões de Matriz Térmica. Participação em Pool Institucional de Leads (Cortex).</td></tr>
                    </tbody>
                 </table>
              </div>

              <div>
                 <h3 className="text-white mb-2">4. A CONEXÃO COM WINF OS™ E PROTEÇÃO POSTGRESQL (RLS)</h3>
                 <p>O WINF OS™ consolida-se como a espinha dorsal de controle de uma malha global. Utilizamos arquitetura de nuvem em camada multi-tenant, o que significa que o painel de faturamento, contratos e leads de cada parceiro rodam através de um Row-Level Security (RLS) proprietário hospedado em PostgreSQL. Essa infraestrutura garante criptograficamente o isolamento absoluto de banco de dados: um HUB não pode vazar dados para outro; um Elite Partner tem a certeza de que seu comissionamento e seus simuladores são regidos por regras de proteção do motor de cálculo da Holding, operando sem viés, em perfeita segurança da informação cibernética e automação auditável em tempo real.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloque 2: Legal Deployment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
          <div className="border border-winf-gray/20 p-6 bg-[#131314] relative">
            <h2 className="text-xl text-white font-medium mb-6 flex items-center"><Lock className="w-5 h-5 mr-3 text-winf-primary" /> MINUTA DE CONTRATO DE LICENCIAMENTO DE USO DE MARCA (W-IPD)</h2>
            <div className="bg-[#131314] border border-winf-gray/10 p-6 text-sm text-winf-gray/80 space-y-6 uppercase leading-loose" style={{ fontFamily: 'monospace' }}>
               
               <p><strong>CLÁUSULA PRIMEIRA – DA PROPRIEDADE INDUSTRIAL (IP) E INTELECTUAL ESTRITA</strong></p>
               <p>O PARCEIRO RECONHECE EXPRESSAMENTE QUE O CÓDIGO-FONTE DO WINF OS™, O MOTOR DE CÁLCULO TÉRMICO (ENGINEERING CORE), O ALGORITMO PREDITIVO W-RANK E TODAS E QUAISQUER IMAGENS, RENDERS 3D, FOTOGRAFIAS, MATERIAIS DE CAMPANHA E REPRESENTAÇÕES VISUAIS DE AMBIENTES ARQUITETÔNICOS E VEÍCULOS GERADOS PELA CONTRATANTE, PERTENCEM EXCLUSIVAMENTE E EM 100% (CEM POR CENTO) À HOLDING WINF CAPITAL™. O ACESSO CONCEDIDO PRESENTE NESTE INSTRUMENTO É ESTRITAMENTE TEMPORÁRIO, INSTRUMENTAL, NÃO-EXCLUSIVO E IMEDIATAMENTE REVOGÁVEL POR DESCUMPRIMENTO. NENHUMA PROPRIEDADE OU DIREITO PATRIMONIAL É TRANSFERIDO.</p>

               <p><strong>CLÁUSULA SEGUNDA – DA NÃO-CONCORRÊNCIA EXECUTIVA (NON-COMPETE) E SEGREDO DE NEGÓCIO</strong></p>
               <p>FICA TERMINANTEMENTE PROIBIDO AO LICENCIADO/PARCEIRO O USO DIRETO OU INDIRETO DO KNOW-HOW TÉCNICO, DOS PROCESSOS DE ENGENHARIA TÉRMICA E DOS SEGREDOS DE NEGÓCIO ACUMULADOS OU FORNECIDOS PELA WINF™, PARA A CRIAÇÃO DE MARCAS, HOLDINGS OU FRENTES CONCORRENTES. CASO HAJA RESCISÃO OU DISTRATO – POR QUALQUER MOTIVADOR – O PARCEIRO FICA TOTALMENTE RESTRITO E IMPEDIDO DE SE ASSOCIAR E/OU CRIAR MARCA CONCORRENTE, DIRETAMENTE OU POR INTERPOSTAS PESSOAS, PELO PRAZO INEGOCIÁVEL DE 5 (CINCO) ANOS APÓS A EXTINÇÃO DO CONTRATO, SOB PENA DE MULTA COMPENSATÓRIA ARBITRADA EM VALOR DE EQUIVALENTE DE MERCADO ACRESCIDA DE PERDAS E DANOS CALCULADOS PELA HOLDING CORTEX.</p>

               <p><strong>CLÁUSULA TERCEIRA – DO DIREITO DE IMAGEM E DA POLÍTICA DE REMOÇÃO DE ACERVO (KILL-SWITCH)</strong></p>
               <p>TODOS OS DIREITOS DE USO DAS MÍDIAS, PADRÃO VISUAL E MATERIAL DE LUXO SILENCIOSO ("STEALTH LUXURY") PERTENCEM À WINF CAPITAL™. EM CASO DE DESLIGAMENTO, DESCREDENCIAMENTO OU EXPULSÃO DA REDE POR REBAIXAMENTO NA TRILHA W-RANK, O PARCEIRO CONCORDA EM ATUAR SOB A DIRETRIZ DE "KILL-SWITCH DE MARCA". ISTO SIGNIFICA A EXCLUSÃO PEREMPTÓRIA E A REMOÇÃO DE TODO O ACERVO VISUAL DA WINF™ DE SUAS REDES SOCIAIS, PORTAIS, FACHADAS COMPARTILHADAS OU CONTEÚDOS IMPRESSOS DENTRO DE UM PRAZO MÁXIMO E ESTRIBO DE 48 (QUARENTA E OITO) HORAS APÓS A NOTIFICAÇÃO DO ENCERRAMENTO.</p>
            </div>
          </div>
        </motion.div>

        {/* Bloque 3: Trigger Connection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-8">
           <div className="bg-winf-primary/10 border border-winf-primary/30 p-8 text-center rounded-none">
             <TriangleAlert className="w-12 h-12 text-winf-primary mx-auto mb-4" />
             <h2 className="text-2xl text-white tracking-widest font-medium mb-4">PROTOCOLO EXEC_CONNECT™ HOMOLOGADO</h2>
             <p className="text-sm text-winf-gray/90 max-w-2xl mx-auto mb-8">
               Avisamos taticamente que as minutas contratuais e de confidencialidade (W-IPD) estão prontas para emissão e assinatura digital segura. A barreira jurídica intransponível está de pé. Clique no comando abaixo para notificar os fundadores e habilitar o fechamento de parceria VIP.
             </p>
             <button 
               onClick={handleConnect}
               className="inline-flex items-center justify-center px-10 py-4 bg-winf-primary text-black font-medium tracking-widest hover:bg-white transition-all disabled:opacity-50"
               disabled={isConnecting || progress < 100}
             >
               {isConnecting ? (
                  <span className="flex items-center"><div className="w-4 h-4 border-2 border-black border-t-transparent flex animate-spin mr-3"></div> INICIATING WINF_CONNECT...</span>
               ) : (
                  <span className="flex items-center">EXECUTAR GATILHO EXEC_CONNECT™ <ChevronRight className="w-5 h-5 ml-2" /></span>
               )}
             </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExecutiveClosingHUD;
