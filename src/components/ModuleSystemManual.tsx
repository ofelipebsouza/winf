import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, ChevronRight, HelpCircle, 
  Target, FileSpreadsheet, CalendarDays, ShieldCheck, 
  Package, Wallet, GraduationCap, ShoppingBag, 
  Scissors, Globe, Brain, Users, LayoutDashboard, Settings, Bot, MessageSquare, Sparkles
} from 'lucide-react';
import { ViewState } from '../types';

interface ManualSection {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
}

const getSections = (onNavigate?: (view: ViewState) => void): ManualSection[] => [
  {
    id: 'intro',
    title: 'Introdução ao WINF OS',
    icon: Book,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Bem-vindo ao WINF OS</h3>
        <p>O WINF OS é o sistema operacional central para os parceiros e licenciados WINF. Aqui você gerenciará toda sua operação de películas, desde a prospecção via Radar até o fechamento financeiro.</p>
        <p>Na sua dashboard principal, você verá indicadores rápidos e poderá acessar qualquer módulo. Se você é um <strong>Licenciado</strong>, verá ferramentas focadas na sua unidade. Se for um <strong>Admin</strong>, terá acesso a funcionalidades extras de gestão macro da marca.</p>
      </div>
    )
  },
  {
    id: 'ray_agent',
    title: 'Agente W-NO™ (WhatsApp)',
    icon: Bot,
    content: (
      <div className="space-y-6 text-zinc-300 leading-relaxed">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-none flex items-start gap-4">
          <Sparkles className="shrink-0 w-6 h-6 animate-pulse mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-base">NOVIDADE SISTÊMICA: W-NO AI está Online!</h4>
            <p className="text-xs text-zinc-300 mt-1">Conheça o nosso novo assistente inteligente de IA e avatar UGC, conectado nativamente ao WhatsApp dos licenciados.</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white">Como Funciona o Copiloto W-NO?</h3>
        <p>
          O <strong>W-NO</strong> é modelado com a aparência de um robô de alta performance com acabamento cerâmico preto brilhante, inspirado na linha W-NO™ Climate Architect. Ele opera diretamente no WhatsApp da sua franquia ou negócio para ajudar na agilidade e no fechamento de vendas.
        </p>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Principais Funções Embarcadas na Memória de W-NO:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Operação do Winf OS e Agenda:</strong> Se você pedir {"\"W-NO, agenda uma instalação amanhã às 14h pro Taycan Patrícia\""}, ele verifica conflitos e cria a O.S. automaticamente.</li>
            <li><strong>Emissão de Orçamentos Rápidos:</strong> W-NO calcula custos, deduz rolos e gera PDFs profissionais com links curtos de pagamento.</li>
            <li><strong>Pedidos directos na Blackshop:</strong> Quando as bobinas do seu inventário de Invisible® Series estiverem no fim, aprove o reabastecimento na hora pelo WhatsApp.</li>
            <li><strong>Sumarização Intemperativa:</strong> Peça um resumo de conversas e e-mails não respondidos para focar somente em propostas lucrativas.</li>
          </ul>
        </div>

        <div className="p-6 bg-[#131314] border border-[#444746] space-y-4 rounded-none">
          <h4 className="text-sm font-bold text-white">Explore o Painel de Configuração</h4>
          <p className="text-xs text-white/50 leading-relaxed">
            Nós preparamos uma página interativa especial para você conhecer os dados físicos de WNO, testar comandos reais em um playground de WhatsApp simulado e escanear o QR Code de ativação.
          </p>
          {onNavigate && (
            <button 
              onClick={() => onNavigate(ViewState.MODULE_RAY)}
              className="px-6 py-2.5 bg-emerald-500 text-black font-bold uppercase text-xs tracking-wider hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Acessar Página Interativa de W-NO™
            </button>
          )}
        </div>
      </div>
    )
  },
  {
    id: 'pipeline',
    title: 'Radar (Pipeline)',
    icon: Target,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Módulo Radar</h3>
        <p>Este módulo é o seu funil de vendas simplificado. Ele permite visualizar potenciais clientes e converter "leads" (interessados) em clientes formatados.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Leads Públicos:</strong> Na aba "Base de Leads WINF", você (se for Licenciado) verá leads distribuídos pela franqueadora. Você pode <em>puxar (Claim)</em> um lead para a sua base.</li>
          <li><strong>Sua Carteira:</strong> É a aba onde ficam seus contatos locais. Você pode adicionar um lead manualmente clicando no formulário, ou movê-los pelo funil.</li>
          <li><strong>Passo a passo:</strong> Clique em "Novo Lead", preencha nome, telefone, veículo/necessidade, e clique em adicionar. Depois, você pode convertê-lo em orçamento clicando no botão "Criar Orçamento".</li>
        </ul>
      </div>
    )
  },
  {
    id: 'quotes',
    title: 'Gerador de Orçamentos',
    icon: FileSpreadsheet,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Enviando Propostas</h3>
        <p>No módulo <strong>Orçamentos</strong>, você cria propostas profissionais para enviar ao cliente.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Passo 1:</strong> Preencha os dados do cliente (ou busque um lead existente).</li>
          <li><strong>Passo 2:</strong> Selecione os produtos do catálogo. O sistema calculará o valor sugerido e aplicará descontos se configurado (ex: pagamento em PIX).</li>
          <li><strong>Passo 3:</strong> Salve o orçamento. Você verá ele na lista.</li>
          <li><strong>Enviar para o Cliente:</strong> Basta clicar no orçamento salvo e usar a opção "Compartilhar Link" ou baixar o PDF gerado automaticamente com a identidade WINF.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'installations',
    title: 'Agenda de Obras e Instalações',
    icon: CalendarDays,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Agenda e O.S.</h3>
        <p>Quando um orçamento é aprovado, você deve transformá-lo em uma Ordem de Serviço (O.S.).</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Acesse a <strong>Agenda de Obras</strong> e clique no dia desejado ou em "Agendar Nova O.S.".</li>
          <li>Vincule o agendamento a um orcamento aprovado, ou preencha as informações do zero (dados do veículo/local, placa, instalador responsável).</li>
          <li>O instalador saberá exatamente o que precisa ser feito naquele dia através da aba "Minha Agenda".</li>
          <li>Após finalizar o serviço, a O.S. é marcada como "Concluída" e o sistema pedirá para gerar o certificado.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'warranties',
    title: 'Central de Garantias',
    icon: ShieldCheck,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Certificação Nacional</h3>
        <p>A Winf possui um sistema nacional de validação de garantia. Todos os clientes homologados devem ser registrados aqui.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Em "Central de Garantias", clique em "Emitir Novo Certificado".</li>
          <li>Coloque a categoria do produto (Automotivo ou Arquitetura), linha escolhida, nota fiscal, CNPJ da loja, etc.</li>
          <li>O sistema gera um <strong>QR Code e um Código único</strong> de 8 a 12 dígitos, que pode ser verificado no portal público. Assim o cliente tem a garantia que usou um produto legítimo.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'stock',
    title: 'Estoque & Rolls',
    icon: Package,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Controle Físico</h3>
        <p>Para licenciados que gerenciam bobinas, o módulo <strong>Estoque & Rolls</strong> é essencial.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Adicione novas bobinas informando o SKU, metragem total (geralmente 15m ou 30m).</li>
          <li>Quando um carro for feito, registre a baixa. O sistema vai subtrair 1m, 1.5m etc., até o rolo zerar.</li>
          <li>Se houver retalhos de grandes sobras, é possível cadastrar as medidas para reaproveitar depois de forma fácil.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'admin',
    title: 'Painel da Matriz (Tools Admin)',
    icon: LayoutDashboard,
    content: (
      <div className="space-y-4 text-zinc-300 leading-relaxed">
        <h3 className="text-xl font-bold text-white mb-4">Exclusivo para o Papel de Admin</h3>
        <p>O Administrador Master possui poderes além dos licenciados. Como Admin, as ferramentas listadas abaixo ficam bloqueadas ou indisponíveis para licenciados e membros comuns:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>The Board™ (Monitoramento):</strong> Um radar em tempo real de todas as lojas licenciadas, performance global de leads e emissão de garantias nacionais.</li>
          <li><strong>Catálogo Blackshop:</strong> O Admin é o único que pode editar as fichas técnicas, TSER, UVR e preços de bobina dos produtos. Todas as lojas consomem esse catálogo em tempo real.</li>
          <li><strong>Winf AI™ Central:</strong> Onde o Admin ajusta os comandos mestres da IA, podendo até definir regras do funil.</li>
          <li><strong>Data Core:</strong> Repositório criptografado para contratos e segredos comerciais. O Admin controla quais papéis podem ler o que.</li>
          <li><strong>Membros (Equipe):</strong> Somente admins conseguem aprovar franqueados e deletar perfis da base.</li>
        </ul>
        <div className="mt-4 p-4 border border-blue-500/30 bg-blue-500/10 rounded-none">
          <p className="text-blue-400 text-sm italic">Você pode testar a visão de ambos os perfis a qualquer momento mudando o seu <strong>Papel Temporário (Simulação de Perfil)</strong> no avatar, localizado na barra lateral ou cabeçalho do layout.</p>
        </div>
      </div>
    )
  }
];

const ModuleSystemManual: React.FC<{onBack: () => void, onNavigate?: (view: ViewState) => void}> = ({ onBack, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const sections = getSections(onNavigate);

  return (
    <div className="min-h-screen bg-[#131314] text-white flex flex-col md:flex-row pb-24 md:pb-0">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-80 border-r border-[#444746] bg-[#131314] p-4 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-none transition-colors text-zinc-400">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-light text-white tracking-tight">Winf™ | Manual do Sistema</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-none text-left transition-all
                  ${isActive 
                    ? 'bg-blue-500/10 border-l-2 border-blue-500 text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border-l-2 border-transparent'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-blue-400' : 'text-zinc-500'} />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto h-screen bg-[#131314]">
        <AnimatePresence mode="wait">
          {sections.map((section) => section.id === activeSection && (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl"
            >
              <div className="mb-8 pb-4 border-b border-[#444746] flex items-center gap-4">
                 <div className="p-3 bg-zinc-900 rounded-none border border-[#444746]">
                   <section.icon size={28} className={section.id === 'ray_agent' ? 'text-emerald-400' : 'text-blue-400'} />
                 </div>
                 <h2 className="text-3xl font-bold tracking-tight text-white">{section.title}</h2>
              </div>
              
              <div className="prose prose-invert max-w-none text-zinc-300">
                {section.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default ModuleSystemManual;
