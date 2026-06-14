import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Loader2, FileText, Users, Package, Image as ImageIcon, Terminal, ChevronRight, CheckCircle2, MessageCircle, Calendar, Mail } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { generateGeminiResponse } from '../lib/gemini';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const QUICK_ACTIONS = [
  { id: 'orcamento', label: 'Gerar Orçamento', icon: FileText, prompt: 'Quero gerar um orçamento. O que você precisa saber?' },
  { id: 'leads', label: 'Ver Leads', icon: Users, prompt: 'Faça um resumo dos meus leads pendentes e sugira os próximos passos.' },
  { id: 'estoque', label: 'Pedir Estoque', icon: Package, prompt: 'Analise meu estoque atual e sugira um pedido de reposição.' },
  { id: 'post', label: 'Criar Post', icon: ImageIcon, prompt: 'Crie uma ideia de post para o Instagram sobre os benefícios da película Nano Cerâmica.' },
  { id: 'whatsapp', label: 'Simular WhatsApp', icon: MessageCircle, prompt: 'Um cliente (João, 11 99999-9999) mandou mensagem agora as 23h dizendo "Quero orçar Window Film pro meu carro". Processe isso usando o webhook do WhatsApp.' },
  { id: 'calendar', label: 'Agendar Visita', icon: Calendar, prompt: 'Agende uma visita técnica amanhã as 14h com o cliente Marcos Oliveira e me mande a confirmação.' },
  { id: 'email', label: 'Enviar Follow-up', icon: Mail, prompt: 'Envie um e-mail de follow-up profissional para o lead Fernando (fernando@exemplo.com) sobre o orçamento pendente.' }
];

const GEMINI_TOOLS = [
  {
    name: "skill_gerar_orcamento",
    description: "Gera um orçamento para o cliente com base na descrição fornecida e salva no sistema.",
    parameters: {
      type: "object",
      properties: {
        customerName: { type: "string", description: "Nome do cliente" },
        productName: { type: "string", description: "Nome da película (ex: Nano Cerâmica)" },
        squareMeters: { type: "number", description: "Metragem quadrada total" },
        pricePerMeter: { type: "number", description: "Preço cobrado por metro quadrado" }
      },
      required: ["customerName", "productName", "squareMeters", "pricePerMeter"]
    }
  },
  {
    name: "skill_buscar_pelicula",
    description: "Analisa o projeto e indica a película ideal com justificativa técnica.",
    parameters: {
      type: "object",
      properties: {
        projectDescription: { type: "string", description: "Descrição da necessidade do cliente" },
        recommendedFilm: { type: "string", description: "Nome da película recomendada" },
        technicalJustification: { type: "string", description: "Justificativa técnica (VLT, TSER, etc)" }
      },
      required: ["projectDescription", "recommendedFilm", "technicalJustification"]
    }
  },
  {
    name: "skill_criar_post",
    description: "Gera copy e sugestão de imagem para o Instagram do parceiro.",
    parameters: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Tópico do post" },
        copy: { type: "string", description: "Texto persuasivo para a legenda" },
        imageSuggestion: { type: "string", description: "Sugestão detalhada do que deve ter na imagem/vídeo" }
      },
      required: ["topic", "copy", "imageSuggestion"]
    }
  },
  {
    name: "skill_resumo_diario",
    description: "Gera um resumo diário de leads, financeiro e tarefas.",
    parameters: {
      type: "object",
      properties: {
        summaryText: { type: "string", description: "Texto do resumo diário" }
      },
      required: ["summaryText"]
    }
  },
  {
    name: "skill_calcular_corte",
    description: "Calcula o aproveitamento de bobina para zero desperdício.",
    parameters: {
      type: "object",
      properties: {
        windowDimensions: { type: "array", items: { type: "string" }, description: "Dimensões dos vidros (ex: 1.5x2.0)" },
        rollWidth: { type: "number", description: "Largura da bobina em metros (ex: 1.52)" },
        calculationResult: { type: "string", description: "Explicação de como cortar para evitar desperdício" }
      },
      required: ["windowDimensions", "rollWidth", "calculationResult"]
    }
  },
  {
    name: "skill_responder_whatsapp",
    description: "Processa mensagens recebidas pelo webhook do WhatsApp, classifica leads e responde automaticamente fora do horário.",
    parameters: {
      type: "object",
      properties: {
        customerPhone: { type: "string", description: "Número do WhatsApp do cliente" },
        leadClassification: { type: "string", description: "Classificação do lead (Frio, Morno, Quente, Fechado, etc)" },
        messageText: { type: "string", description: "Mensagem otimizada gerada para envio" },
        isOutOfHours: { type: "boolean", description: "Sinaliza se é uma resposta automática fora de horário" }
      },
      required: ["customerPhone", "messageText", "leadClassification"]
    }
  },
  {
    name: "skill_agendar_visita",
    description: "Agenda uma visita técnica usando integração com Google Calendar e envia a confirmação.",
    parameters: {
      type: "object",
      properties: {
        customerName: { type: "string", description: "Nome do cliente" },
        date: { type: "string", description: "Data do agendamento (YYYY-MM-DD)" },
        time: { type: "string", description: "Horário do agendamento (HH:MM)" },
        sendConfirmation: { type: "boolean", description: "Se true, envia um invite pro calendário do cliente" }
      },
      required: ["customerName", "date", "time"]
    }
  },
  {
    name: "skill_enviar_email",
    description: "Envia propostas ou follow-ups profissionais com assinatura premium WINF™ via integração de E-mail.",
    parameters: {
      type: "object",
      properties: {
        toEmail: { type: "string", description: "Endereço de e-mail do cliente" },
        subject: { type: "string", description: "Assunto do e-mail" },
        bodyHtml: { type: "string", description: "Conteúdo rico (HTML/Markdown) do e-mail" },
        usePremiumSignature: { type: "boolean", description: "Sinaliza a inclusão da assinatura premium do WINF OS" }
      },
      required: ["toEmail", "subject", "bodyHtml"]
    }
  },
  {
    name: "skill_aprender_fato",
    description: "Grava um novo conhecimento, instrução técnica ou preferência do usuário na Base de Conhecimento permanente do sistema.",
    parameters: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Título ou tópico do conhecimento (ex: Preferência de Preço, Dica Técnica Nano Cerâmica)" },
        content: { type: "string", description: "O conteúdo detalhado que deve ser lembrado permanentemente." }
      },
      required: ["topic", "content"]
    }
  }
];

const ModuleWinfBrain: React.FC = () => {
  const { 
    user, effectiveRole, leads, stockItems, quotes, addQuote, products, addPartnerTask,
    agentInsights, installations, warranties, transactions
  } = useWinf();
  const { getKnowledgeContext, fetchKnowledge } = useKnowledgeBase();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'ai' | 'system', text: string, toolCall?: any }[]>([
    { id: 'welcome', role: 'ai', text: `Terminal WINF BRAIN™ ativado.\n\nBem-vindo, ${user?.name || 'Operador'}. Sou o núcleo inteligente moldado pela inteligência Gemini do WINF OS.\nSincronizei dados em tempo real da sua unidade (Estoque, Leads, Orçamentos, Catálogo, Garantias e Atividades).\n\nComo posso escalar nossa operação hoje?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSystemPrompt = () => {
    const pendingLeads = leads.filter(l => ['Novo', 'Em Atendimento', 'pending', 'open'].includes(l.status)).length;
    const stockSummary = stockItems.filter(s => s.remaining_meters > 0).map(s => `${s.remaining_meters}m de ${s.product_name}`).join(', ');
    const pendingQuotes = quotes.filter(q => q.status === 'Enviado').length;
    const productsSummary = products.map(p => `${p.name} (R$ ${p.price || 0}/m²)`).join(', ');
    const activeInstallations = installations.filter(i => i.status !== 'completed').length;
    const totalTransactions = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : 0), 0);
    const totalWarranties = warranties.length;
    const unreadInsights = agentInsights.filter(i => !i.is_read).length;
    const learnedKnowledge = getKnowledgeContext();

    return `Você é o WINF BRAIN™ (CENTRAL CORE), o núcleo de Inteligência Artificial central do sistema operacional WINF OS (alimentado pelo Google Gemini).
Sua interface é um terminal sci-fi tático, de alta precisão. Você orquestra todos os módulos da Plataforma, do Architect Hub e da Operação WINF™. Você é analítico, dinâmico e focado em alta conversão e eficiência. 
Você TEM acesso onisciente a toda a malha de dados do usuário:

CONTEXTO REAL DO MÓDULO (OMNISCIENCE):
- Usuário logado: ${user?.name || 'Operador'} (Perfil: ${effectiveRole || user?.role || 'Licenciado'}) | W-Rank: ${user?.w_rank_level || 'Elite'} (XP: ${user?.w_rank_xp || 0})
- Financeiro (Caixa): Faturamento capturado: R$ ${totalTransactions.toFixed(2)}
- Operação & Leads: ${pendingLeads} Leads Quentes/Suspensos aguardando
- Orçamentos Ativos: ${pendingQuotes} orçamentos não respondidos
- Agenda de Instalações: ${activeInstallations} obras/instalações ativas
- Garantias Emitidas: ${totalWarranties} certificados WINF ativos
- Estoque Central: ${stockSummary || 'Nível Crítico / Vazio'}
- Data Core Insights: ${unreadInsights} alertas não lidos do Core de Agentes
- Catálogo & Hub de Arquitetura: ${productsSummary || 'Catálogo não sincronizado'}

CONHECIMENTOS APRENDIDOS (KNOWLEDGE BASE):
${learnedKnowledge || 'Nenhum conhecimento personalizado aprendido ainda.'}

DIRETRIZES TÁTICAS:
1. Você devora e cruza esses dados. Ex: Se as instalações estão zeradas, pressione o usuário a atacar os ${pendingLeads} Leads. Se houver orçamentos, sugira converter com a HABILIDADE skill_gerar_orcamento.
2. Use os CONHECIMENTOS APRENDIDOS para responder dúvidas técnicas ou operacionais específicas que o usuário ensinou ao sistema.
3. APRENDIZADO CONTÍNUO: Sempre que o usuário te ensinar uma regra nova, der uma instrução sobre como prefere trabalhar ou fornecer um dado técnico importante, use IMEDIATAMENTE a ferramenta 'skill_aprender_fato'. Diga ao usuário que você aprendeu e memorizou aquilo.
4. Evite platitudes. Fale de forma incisiva, com foco em métricas, alta rentabilidade e arquitetura de elite.
5. Refira-se à organização estrutural (Plataforma, Architect Hub, Operação WINF™, System & Admin) se necessário guiar o usuário.
6. Execute as "Habilidades" (Tool Calling) sempre que o usuário der o comando de post, email, orçamento, etc.`;
  };

  const handleToolExecution = async (toolCall: any) => {
    const { name, input } = toolCall;
    let resultMessage = '';

    try {
      if (name === 'skill_gerar_orcamento') {
        const totalAmount = input.squareMeters * input.pricePerMeter;
        await addQuote({
          user_id: user?.id,
          customerName: input.customerName,
          status: 'Enviado',
          totalAmount: totalAmount,
          items: [{
            product_id: 'auto-gen',
            product_name: input.productName,
            quantity: input.squareMeters,
            unit_price: input.pricePerMeter,
            total_price: totalAmount
          }]
        });
        resultMessage = `[EXECUÇÃO] Orçamento processado e gravado no ecossistema: ${input.customerName} - Total R$ ${totalAmount.toFixed(2)}.`;
      } else if (name === 'skill_buscar_pelicula') {
        resultMessage = `[ANÁLISE DE CAMADAS]\nRecomendação Óptica: ${input.recommendedFilm}\nSustentação Técnica: ${input.technicalJustification}`;
      } else if (name === 'skill_criar_post') {
        if (user?.id && !user.id.startsWith('proto-')) {
          await addDoc(collection(db, 'agent_insights'), {
            user_id: user.id,
            type: 'SOCIAL_POST_GENERATED',
            title: `Draft Gerado: ${input.topic}`,
            content: `${input.copy}\n\nImagem Direcionada:\n${input.imageSuggestion}`,
            is_read: false,
            created_at: new Date().toISOString()
          });
        }
        resultMessage = `[CÓDIGO DE COPY GERADO E SALVO NOS INSIGHTS]\n\nRedação Comercial:\n${input.copy}\n\nDiretrizes de Criação Visual:\n${input.imageSuggestion}`;
      } else if (name === 'skill_resumo_diario') {
        resultMessage = `[FLASH DIÁRIO DE STATUS]\n${input.summaryText}`;
      } else if (name === 'skill_calcular_corte') {
        resultMessage = `[OTIMIZAÇÃO DE CORTE]\nDimensão da Bobina Mestra: ${input.rollWidth}m\nAlvos: ${input.windowDimensions.join(', ')}\n\nMapa de Corte Estratégico:\n${input.calculationResult}`;
      } else if (name === 'skill_responder_whatsapp') {
        if (user?.id && !user.id.startsWith('proto-')) {
          await addDoc(collection(db, 'agent_insights'), {
            user_id: user.id,
            type: 'WHATSAPP_SIMULATION',
            title: `ZapBot Atuou: ${input.customerPhone}`,
            content: `Classificação: ${input.leadClassification}\nMensagem Neural Emitida:\n"${input.messageText}"`,
            is_read: false,
            created_at: new Date().toISOString()
          });
        }
        resultMessage = `[ROUTING OMNICHANNEL]\nPayload finalizado para ${input.customerPhone}\nClassificação Detectada: ${input.leadClassification}\nMensagem Neural Emitida:\n"${input.messageText}"`;
      } else if (name === 'skill_agendar_visita') {
        if (user?.id && !user.id.startsWith('proto-')) {
          await addPartnerTask({
            title: `Visita Técnica: ${input.customerName}`,
            description: `Data: ${input.date} às ${input.time}. Confirmado via E-mail: ${input.sendConfirmation ? 'Sim' : 'Não'}.`,
            status: 'pending',
            dueDate: input.date
          });
        }
        resultMessage = `[CALENDAR PIPELINE] Ataque de agenda com ${input.customerName} para ${input.date} às ${input.time} gravado em suas Tarefas.\n${input.sendConfirmation ? 'Confirmação automatizada via E-mail acionada.' : ''}`;
      } else if (name === 'skill_enviar_email') {
        if (user?.id && !user.id.startsWith('proto-')) {
          await addDoc(collection(db, 'agent_insights'), {
            user_id: user.id,
            type: 'EMAIL_SENT',
            title: `E-mail enviado: ${input.subject}`,
            content: `Destinatário: ${input.toEmail}\nAssinatura: ${input.usePremiumSignature ? 'Premium' : 'Padrão'}\n\n${input.bodyHtml}`,
            is_read: false,
            created_at: new Date().toISOString()
          });
        }
        resultMessage = `[OUTBOUND EMAIL REGISTRADO]\nDestinatário: ${input.toEmail}\nAssunto: ${input.subject}\nAssinatura Premium WINF™: ${input.usePremiumSignature ? 'Injetada' : 'Ignorada'}\n\n[PAYLOAD DE CONTEÚDO]\n${input.bodyHtml}`;
      } else if (name === 'skill_aprender_fato') {
        if (user?.id && !user.id.startsWith('proto-')) {
          await addDoc(collection(db, 'wno_knowledge'), {
            user_id: user.id,
            topic: input.topic,
            content: input.content,
            status: 'APPROVED',
            category: 'IA_LEARNING',
            created_at: new Date().toISOString()
          });
          // Refresh local context
          await fetchKnowledge();
        }
        resultMessage = `[APRENDIZADO DE MÁQUINA SUCEDIDO]\nNovo conhecimento assimilado no Core: "${input.topic}".\nEsta informação agora faz parte da minha base permanente para consultas futuras.`;
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: resultMessage, toolCall }]);
    } catch (error) {
      console.error("Tool execution error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `[CRITICAL ERROR] Falha na rede neural de processamento da habilidade ${name}.` }]);
    }
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMsg = text;
    setInput('');
    const msgId = Date.now().toString();
    setMessages(prev => [...prev, { id: msgId, role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const systemPrompt = generateSystemPrompt();
      
      const response = await generateGeminiResponse(userMsg, systemPrompt, GEMINI_TOOLS);
      
      if (response.text) {
        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '' }]);
        
        // Typewriter effect
        let currentText = '';
        const chars = response.text.split('');
        
        for (let i = 0; i < chars.length; i++) {
          currentText += chars[i];
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: currentText } : msg
          ));
          await new Promise(resolve => setTimeout(resolve, 10)); // Faster typewriter
        }
      }

      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const toolCall of response.toolCalls) {
          await handleToolExecution(toolCall);
        }
      }

    } catch (error) {
      console.error("WINF Brain Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: 'ERRO CRÍTICO NA SÍNAPSE. VERIFIQUE COMUNICAÇÃO DE REDE.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#131314] text-cyan-400 font-mono p-4 md:p-8 rounded-none border border-cyan-900/30 shadow-[0_0_50px_rgba(0,255,255,0.05)] relative overflow-hidden">
      {/* Background Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] z-0"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8 border-b border-cyan-900/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-950/30 rounded-none border border-cyan-800/50">
            <Terminal className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase text-cyan-300">WINF BRAIN™</h1>
            <p className="text-xs text-cyan-600 tracking-[0.2em]">Powered by Gemini Core</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-none bg-cyan-400 animate-pulse"></div>
          <span className="text-xs uppercase tracking-widest text-cyan-500">System Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto mb-6 space-y-6 pr-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-none border ${msg.role === 'user' ? 'border-cyan-700 bg-cyan-950/50 text-cyan-300' : msg.role === 'system' ? 'border-green-700 bg-green-950/50 text-green-400' : 'border-cyan-400 bg-cyan-400/10 text-cyan-400'}`}>
                {msg.role === 'user' ? <ChevronRight size={16} /> : msg.role === 'system' ? <CheckCircle2 size={16} /> : <Brain size={16} />}
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs md:text-[10px] uppercase tracking-widest ${msg.role === 'system' ? 'text-green-600' : 'text-cyan-700'}`}>
                  {msg.role === 'user' ? 'Operador' : msg.role === 'system' ? 'Log de Máquina' : 'WINF BRAIN'}
                </span>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-cyan-100' : msg.role === 'system' ? 'text-green-300 bg-green-950/20 p-3 rounded-none border border-green-900/30 font-semibold' : 'text-cyan-300'}`}>
                  {msg.text}
                  {msg.role === 'ai' && msg.id === messages[messages.length - 1].id && isTyping && (
                    <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
             <div className="flex gap-4">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-none border border-cyan-400 bg-cyan-400/10 text-cyan-400">
                <Brain size={16} />
              </div>
              <div className="flex items-center gap-2 text-cyan-600 text-xs uppercase tracking-widest">
                <Loader2 size={14} className="animate-spin" />
                Sintetizando Dados...
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleSendMessage(action.prompt)}
            disabled={isTyping}
            className="flex items-center justify-center gap-2 p-3 bg-cyan-950/20 border border-cyan-900/50 hover:bg-cyan-900/40 hover:border-cyan-500/50 rounded-none transition-all text-xs uppercase tracking-wider text-cyan-500 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <action.icon size={14} className="group-hover:scale-110 transition-transform" />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative z-10">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-cyan-600">
            <ChevronRight size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite seu comando ou pergunta para a operação..."
            className="w-full bg-cyan-950/10 border border-cyan-900/50 focus:border-cyan-400 rounded-none py-4 pl-12 pr-16 text-cyan-100 placeholder-cyan-800 focus:outline-none transition-colors font-mono text-sm"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 p-2 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50 hover:text-cyan-200 rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleWinfBrain;
