import React from 'react';
import { Zap, Target, BookOpen, Shield, ShieldCheck, Sun, Lightbulb, Users, Hexagon } from 'lucide-react';

interface MentoringContentProps {
  courseId: string;
}

export const AcademyMentoringContent: React.FC<MentoringContentProps> = ({ courseId }) => {
  const contentMap: Record<string, React.ReactNode> = {
    'c0': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <Hexagon size={18} /> Módulo Turn-Key: Treinamento Técnico de Base
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          O treinamento prático de campo da matriz WINF Academy, detalhado no Documento 17, é compactado em um ciclo de 40 horas semanais de alta intensidade. O foco absoluto do centro de ensino é associar a precisão de ferramentas de alta tecnologia com a preservação física do operador através de infraestruturas ergonômicas patenteadas de solo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">A Diretriz Zero Estilete</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Fica expressamente proibido o uso de estiletes tradicionais diretamente sobre superfícies pintadas, borrachas ou latarias de veículos. Cultive o uso cirúrgico das plotters e da mesa backlight iluminada por LED.
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">Critérios de Homologação</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Tolerância zero para bolhas, micropartículas e arranhões. A precisão de acabamento perante as guarnições, e a fluidez e a organização visual do ambiente de trabalho ditam o sucesso do Mestre WINF.
                </div>
            </div>
        </div>
      </div>
    ),
    'c1': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <Hexagon size={18} /> Protocolos: Padrão Winf™ & Postura
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          A Winf™ Academy não ensina apenas a instalar películas, mas a construir uma mentalidade de elite. Sua postura na casa do cliente deve transmitir organização, respeito e um nível de cuidado cirúrgico. Nunca esqueça que você está no ambiente mais sagrado de outra pessoa.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">1. Educação e Etiqueta</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Apresente-se sempre pelo seu nome e pela marca Winf™. "Muito bom dia, sou [Nome] da Winf, e viemos realizar a blindagem térmica do seu ambiente."
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">2. Código Visual e Higiene</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Uniformes sempre limpos, sapatos propés ao entrar, e uma apresentação pessoal invejável. O alto padrão exige que o mensageiro seja impecável assim como a mensagem.
                </div>
            </div>
        </div>
      </div>
    ),
    'c2': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <Target size={18} /> Protocolos: Cuidado com o Ambiente
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          O preparo do terreno é a fundação da excelência. Um serviço só pode ser executado se o ecossistema ao redor (móveis, eletrônicos, piso) estiver 100% isolado da água e detritos resultantes do processo da instalação.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">1. Isolamento Absoluto</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Panos de microfibra de alta absorção em todos os caixilhos de janela, lona sobre o piso e sofás, plásticos antiestáticos em tomadas.
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">2. Reorganização Pós-Serviço</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    O ambiente deve ficar MELHOR ou igual ao que você encontrou. Aspire a área se necessário, e organize todos os pertences com extrema cautela.
                </div>
            </div>
        </div>
      </div>
    ),
    'c3': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={18} /> Protocolos: Comunicação Técnica
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          Conduzir a percepção do cliente sobre detalhes como tempo de secagem (cura da cola) e pequenas bolhas d'água é o que diferencia o medo de ser lesado da segurança de estar acompanhado por um especialista.
        </p>
        <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="bg-[#131314] p-4 rounded-none text-xs text-white/60 border-l-2 border-winf-primary">
                <strong className="text-white block mb-1">Guia de Tradução Técnica para o Cliente:</strong>
                1. "Senhor, ao final do processo, é normal ficar com o aspecto úmido por até 30 dias (tempo de cura)."<br/>
                2. Instrua firmemente sobre as etapas de limpeza: "Nunca limpe antes de X dias e nunca com produtos químicos abrasivos."<br/>
                3. Transmita o conhecimento usando o "Winf Book" de forma simples.
            </div>
        </div>
      </div>
    ),
    'c4': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <BookOpen size={18} /> Protocolos: Fundamentos de Instalação Winf™
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          A matriz de corte e colagem de vitrines com zero poeira. Todo franqueado de sucesso inicia calibrando sua ferramenta de corte e refinando a espatulagem para uma drenagem eficaz de água, evitando retrabalhos de garantia.
        </p>
        <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary mt-6">
            "Não existe instalação rápida bem-feita. Se há poeira suspensa, combata a estática primeiro. Se focar no detalhe, a perfeição cuidará de si mesma."
        </div>
      </div>
    ),
    'c5': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <Hexagon size={18} /> A Filosofia Apple: Design e Experiência
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          A Apple não vende tecnologia, ela vende um design impecável e uma experiência de luxo intuitiva. Na Winf™, traduzimos isso aplicando uma disciplina estética formidável dentro da casa do cliente. Suas ferramentas não podem ser sujas ou desorganizadas. O ato de abrir a bolsa de ferramentas deve transparecer o cuidado com os detalhes de um relojoeiro.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">1. O Ritual Minimalista</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Mostruários organizados simetricamente, silêncio ao trabalhar, nenhuma ferramenta largada no chão desprotegida. A estética visualiza competência.
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">2. Valorizando a Solução</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    O momento de remover o liner do filme ou fazer a limpeza primária não é braçal, é calculado. A fluidez do seu movimento vende profissionalismo indestrutível.
                </div>
            </div>
        </div>
      </div>
    ),
    'c6': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <Target size={18} /> Método Toyota (Lean): Eficiência Implacável
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          A Toyota criou o farol da produtividade mundial eliminando o excesso ("Muda"). No ecossistema Winf™, aplicamos o Lean cortando retalhos desnecessários de películas, evitando deslocamentos sem sentido até a van e padronizando o 'setup' de aplicação. Tempo na obra custa caro; desperdício de material mina o seu lucro real.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">1. Combate ao Desperdício (Winf Cut)</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Todo corte deve ser matematicamente arranjado antes do bisturi tocar no material. Cada centímetro jogado fora é capital da sua empresa no lixo.
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-white font-bold text-sm">2. A Evolução do Processo (Kaizen)</p>
                <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary">
                    Equipes fortes analisam a obra após a finalização: O que poderia ser feito 5 minutos mais rápido hoje se tivéssemos levado a escada certa imediatamente?
                </div>
            </div>
        </div>
      </div>
    ),
    'c7': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={18} /> Obsessão pelo Cliente: Efeito Disney e Amazon
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          A Amazon baseia toda sua cadeia produtiva na satisfação suprema do consumidor, e a Disney no deslumbramento mágico. Na prestação de serviços premium da Winf™, transformamos problemas pontuais (como uma refação de painel) em oportunidades de gerar advogados da marca. É a forma como lidamos com os erros que eleva nosso patamar ético frente à concorrência.
        </p>
        <div className="bg-[#131314] p-4 rounded-none text-xs text-white/60 border-l-2 border-winf-primary mt-6">
            <strong className="text-white block mb-1">A Regra do Ouro da Retenção:</strong>
            "Se o cliente achar um defeito justificado, não confronte, celebre o conserto. Abrace a garantia como a afirmação física de que a Winf não abandona o cliente de alto padrão. Essa atitude rende dez vezes mais indicações em condomínios de luxo."
        </div>
      </div>
    ),
    'c8': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <BookOpen size={18} /> Padrão Tesla: O Pitch Corporativo B2B
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          Assim como a Tesla re-significou carros elétricos de lentos para velozes potências focadas em tecnologia, você precisa re-significar a janela. Não vendemos escurecimento visual; vendemos barreiras ativas termo-climáticas que garantem o certificado ESG, reduzem severamente a conta de energia do edifício (ROI rápido) e protegem mobiliário valioso contra UV em larga escala.
        </p>
        <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary mt-6">
            "Quando falar com arquitetos corporate ou facilities, substitua expressões estéticas por métricas matemáticas: Fator Solar, Shading Coefficient (SC), Transmissão de Lux e Total de Energia Solar Rejeitada (TSER)."
        </div>
      </div>
    ),
    'c9': (
      <div className="space-y-8 mt-12 bg-[#131314] p-5 md:p-8 rounded-none border border-[#444746]">
        <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
            <Hexagon size={18} /> Masterclass: Engenharia de Fachadas Complexas
        </h3>
        <p className="text-white/80 leading-relaxed text-sm md:text-base">
          O patamar mais arriscado e lucrativo do segmento de Window Films corporativos. Dominar vidro laminado em fachadas norte para não causar quebras por estresse térmico exige base acadêmica e técnica. Além disso, operações em altura exigem respeito estrito a coordenações logísticas. 
        </p>
        <div className="bg-[#131314] p-4 rounded-none italic text-xs text-white/40 border-l-2 border-winf-primary mt-6">
            "Nunca subestime a radiação solar absorvida por um vidro duplo ou uma lâmina temperada. O Mestre Winf garante que sua película seja uma cura, não a causa da dilatação e explosão."
        </div>
      </div>
    )
  };

  return <>{contentMap[courseId] || <div className="text-white/40 mt-8 italic text-sm">Este painel neural está em processamento de expansão.</div>}</>;
}
