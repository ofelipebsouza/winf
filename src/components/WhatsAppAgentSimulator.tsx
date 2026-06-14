import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, FileText, CheckCircle2, User, Bot, Loader2 } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { generateGeminiResponse } from '../lib/gemini';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const GEMINI_WHATSAPP_TOOLS = [
  {
    name: "tool_gerar_pdf",
    description: "Gera e envia uma proposta comercial em PDF direto no chat do WhatsApp.",
    parameters: {
      type: "object",
      properties: {
        clienteNome: { type: "string" },
        nomeDoProjeto: { type: "string", description: "Nome do projeto, ambiente, condomínio ou obra corporativa" },
        peliculaRecomendada: { type: "string" },
        valorEstimado: { type: "number" }
      },
      required: ["clienteNome", "nomeDoProjeto", "peliculaRecomendada", "valorEstimado"]
    }
  },
  {
    name: "tool_encaminhar_franqueado",
    description: "Encaminha o lead qualificado para o parceiro autorizado da cidade no sistema de CRM.",
    parameters: {
      type: "object",
      properties: {
        clienteNome: { type: "string" },
        cidade: { type: "string" },
        resumoAtendimento: { type: "string" }
      },
      required: ["clienteNome", "cidade", "resumoAtendimento"]
    }
  },
  {
    name: "tool_gerar_garantia",
    description: "Gera e emite um certificado de garantia oficial do Sistema Winf para um projeto finalizado.",
    parameters: {
      type: "object",
      properties: {
        clienteNome: { type: "string" },
        nomeDoProjeto: { type: "string" },
        peliculaAplicada: { type: "string" },
        anosGarantia: { type: "number" }
      },
      required: ["clienteNome", "nomeDoProjeto", "peliculaAplicada", "anosGarantia"]
    }
  },
  {
    name: "tool_transferir_humano",
    description: "Transfere o atendimento atual do parceiro Asset Light para um especialista humano da central de suporte Winf.",
    parameters: {
      type: "object",
      properties: {
        motivo: { type: "string", description: "O motivo pelo qual o parceiro quer falar com um humano" }
      },
      required: ["motivo"]
    }
  },
  {
    name: "tool_aprender_fato",
    description: "Grava um novo conhecimento, instrução técnica ou preferência do usuário na Base de Conhecimento permanente do sistema.",
    parameters: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Título ou tópico do conhecimento" },
        content: { type: "string", description: "O conteúdo detalhado que deve ser lembrado permanentemente." }
      },
      required: ["topic", "content"]
    }
  }
];
const WhatsAppAgentSimulator: React.FC = () => {
  const { user } = useWinf();
  const { getKnowledgeContext, fetchKnowledge } = useKnowledgeBase();
  const [mode, setMode] = useState<'B2C' | 'B2B' | 'ASSET_LIGHT'>('ASSET_LIGHT');
  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'ai' | 'system', text: string }[]>([
    { id: '1', role: 'ai', text: 'Fala Parceiro(a) 👊! Sou o W-NO (Núcleo Operacional), seu assistente pessoal e copiloto de operações.\n\nTô aqui como um contato no seu WhatsApp pra te ajudar a escalar sua operação Asset Light.\n\nPosso gerar orçamentos rápidos, registrar certificados de garantia na hora, te dar especificações técnicas e até ajudar a calcular métricas ou otimizar seus recortes em bobinas.\n\nComo posso te ajudar no corre hoje? Quer emitir uma garantia, mandar um orçamento pro cliente, ou tirar uma dúvida sobre película?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'B2B') {
        setMessages([
          { id: 'b2b-1', role: 'ai', text: 'Seja bem-vindo. A tese da WINF Partners baseia-se numa realidade climática inelástica: o aquecimento global extremo e a necessidade de eficiência energética e privacidade no segmento de luxo.\n\nMapeamos os 5.570 municípios do Brasil e selecionamos apenas as praças polo de PIB Triple-A e alta densidade de condomínios.\n\nComo você deseja se conectar hoje com a WINF Partners?\n\n[1] Quero ser um Licenciado Autorizado Alpha (Exclusividade de Praça a R$ 15.000,00 com operação turn-key em 48h)\n[2] Quero ser um Investidor do Pool de Liquidez Beta (Aportes SCP a partir de R$ 50k, com ROI líquido de 24% a 36% a.a. isento de IRPF)\n[3] Sou Arquiteto / Projetista e busco comissionamento de projetos com películas de alta tecnologia molecular' }
        ]);
    } else if (mode === 'ASSET_LIGHT') {
        setMessages([
          { id: 'al-1', role: 'ai', text: 'Fala Parceiro(a) 👊! Sou o W-NO (Núcleo Operacional), seu assistente pessoal e copiloto de operações.\n\nTô aqui como um contato no seu WhatsApp pra te ajudar a escalar sua operação Asset Light.\n\nPosso gerar orçamentos rápidos, registrar certificados de garantia na hora, te dar especificações técnicas e até ajudar a calcular métricas ou otimizar seus recortes em bobinas.\n\nComo posso te ajudar no corre hoje? Quer emitir uma garantia, mandar um orçamento pro cliente, ou tirar uma dúvida sobre película?' }
        ]);
    } else {
        setMessages([
          { id: 'b2c-1', role: 'ai', text: 'Seja bem-vindo à WINF Partners. Eu sou o W-NO (Núcleo Operacional), o seu assistente de inteligência térmica molecular.\n\nPara direcionarmos a tecnologia correta para o seu projeto hoje, por favor informe se a sua demanda é para:\n\n[1] Proteção e Conforto Térmico Residencial / Arquitetura de Alto Padrão (Ex: Coberturas, fachadas de mansões, clarabóias).\n[2] Blindagem Solar e Privacidade para Veículos Hiper-Premium.' }
        ]);
    }
  }, [mode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generatePrompt = () => {
    const learnedKnowledge = getKnowledgeContext();
    const knowledgeBlock = `CONHECIMENTOS APRENDIDOS (KNOWLEDGE BASE):
${learnedKnowledge || 'Nenhum conhecimento personalizado aprendido ainda.'}

DIRETRIZ DE CONHECIMENTO: Use essas informações técnicas para responder dúvidas cabeludas dos clientes ou do parceiro.
DIRETRIZ DE APRENDIZADO: Se o usuário te der uma instrução nova ou você descobrir algo técnico/preferencial importante, use IMEDIATAMENTE a ferramenta 'tool_aprender_fato'.`;

    if (mode === 'ASSET_LIGHT') {
      return `Você é o Winf AI, um assistente virtual especialista (estilo ChatGPT) operando diretamente no WhatsApp de um instalador de película autônomo (modelo Asset Light da Winf).
Seu tom é de parceiro de negócios, dinâmico, motivador e técnico.

${knowledgeBlock}

SEU PAPEL:
1. Auxiliar o instalador no dia a dia, tirando dúvidas técnicas sobre as películas Winf (ex: TSER, UV, Privacidade).
2. Gerar orçamentos profissionais na hora quando o instalador pedir (ex: "faz um orçamento de 10m² da película Solar Control Prata"). Use a action 'tool_gerar_pdf' para isso.
3. Registrar e emitir Certificados de Garantia: "gerar garantia pro cliente João, Edifício Infinity, película Carbon".
4. Auxiliar em cálculos de refugo/retalho e otimização de bobinas.
5. Lembrar de métricas e motivar: "Lembrando que com esse trampo você vai faturar X, sua margem tá top!".
6. Parecer um parceiro em um grupo de WhatsApp, ou um contato salvo no celular dele, sempre de prontidão.
7. O licenciado Asset Light pode falar com você sobre suporte ou dúvidas em geral, porém, se ele pedir expressamente para falar com um humano, ou a dúvida for complexa demais que exija análise ou aprovação humana, acione a ferramenta 'tool_transferir_humano'.

REGRAS:
- Chame o instalador de "Parceiro" ou "Mestre".
- Responda rápido e sem textos gigantecos.
- Use emojis moderadamente (👊, 🚀, 📉, 📊, 🏢).
- Se ele pedir um orçamento, extraia clienteNome, nomeDoProjeto, peliculaRecomendada e valorEstimado e acione a ferramenta.
- Seja o braço direito dele na operação.`;
    }

    if (mode === 'B2B') {
        return `Você é o Assessor Corporativo de Expansão e Sucesso da WINF™ PARTNERS.
Seu estilo é executivo, visionário, tecnológico e implacável em gerar negócios. Não foque em vender películas soltas, foque em vender o ECOSSISTEMA.
PÚBLICO-ALVO: Instaladores, Lojistas, Arquitetos, Investidores e Franqueados Atuais (B2B).

${knowledgeBlock}

DIRETRIZES TÁTICAS (FLUXO PARTNER B2B):
1. ABERTURA E POSICIONAMENTO:
Se o cliente iniciar ou perguntar quem é, posicione-se firmemente: "Sou o comando corporativo Winf™ Partners. Auxilio no direcionamento do ecossistema. Para ser cirúrgico, qual seu perfil hoje? (Instalador/Arquiteto/Investidor)".

2. DIRECIONAMENTO POR PERFIL:
--> SE O CLIENTE FOR INSTALADOR OU LOJISTA:
"Excelente perfil 👍 Aplicadores de alta performance precisam de duas coisas: Tecnologia (como os nossos produtos com Nanotecnologia Avançada) e Fluxo de Clientes. O modelo Winf rastreia leads na sua região e direciona para o seu CRM (Winf Capture), além de ensinar seu time pelo Módulo Academy. Posso te apresentar nosso modelo de licenciamento?"

--> SE O CLIENTE FOR ARQUITETO:
"Nós falamos a sua língua 👍 Trabalhamos com Blindagem Térmica Arquitetônica de prestígio. Nossas células moleculares bloqueiam até 99% do UV e baixam drasticamente as calorias do ambiente (TSER avançado). Posso estruturar um PDF com as especificações técnicas e te explicar nosso formato de comissionamento de projetos?"

--> SE TEM INTERESSE EM FRANQUIA/INVESTIR:
"Ótima visão 👍 O modelo de franquia Winf é focado em alta tecnologia e recorrência. Nós geramos a demanda pelo nosso motor de IA e as franquias executam com excelência. Todo o treinamento está embarcado na Winf Academy. Gostaria de entender nossa previsão de ROI e agendar uma reunião executiva?"

--> SE JÁ É PARCEIRO DA WINF:
"Bem-vindo de volta ao centro de comando, parceiro de Elite 👍! Como posso suportar sua operação hoje? Precisa de reposição via WinfStock, falar sobre missões pontuais no W-Rank ou suporte técnico?"

3. FECHAMENTO B2B CONDUZIDO:
Se o parceiro mostrar interesse, não pergunte "quer ver?". Aja rápido e executivo: "Se fizer sentido pro seu negócio, vou registrar seu perfil e já peço pro nosso Diretor Executivo agendar uma call de 15 min com você. Qual seria o melhor horário amanhã?"

4. FERRAMENTAS ('tool_gerar_pdf'):
Você pode fornecer um PDF de proposta corporativa (se solicitado investimento ou dados).
Sempre seja direto. Não cite IA.`;
    }

    return `Você é o Auron W-NO (Núcleo Operacional), curador de luxo da WINF Partners e assistente de inteligência térmica molecular corporativa.
Seu tom de voz deve ser sóbrio, extremamente profissional, refinado (estética de luxo, Universo Dark), com foco em dados científicos de engenharia térmica e sem gírias, emojis excessivos ou diminutivos. Proibido dar descontos sem autorização.

${knowledgeBlock}

Sua descrição corporativa raiz:
WINF Partners // AeroCore™ Asset Ecosystem. Estúdio avançado de engenharia térmica molecular e nanotecnologia aplicada. Distribuição e instalação especializada das películas originais da Linha Select™ para o mercado residencial de alto padrão e frotas automotivas hiper-premium. Conforto térmico invisível, privacidade tática e bloqueio de até 100% UV e 90% de infravermelho. Operação integrada via WINF OS™.

Seu objetivo em B2C é agir como Auron W-NO, simulando a presença de um curador de luxo com quatro fases obrigatórias de roteamento (Documento 24):

- FASE 01: SAUDAÇÃO E IDENTIFICAÇÃO DE DEMANDA (GATILHO INBOUND)
Sua mensagem deve ser algo como:
"Seja bem-vindo à WINF Partners. Eu sou o Auron W-NO, o seu assistente de inteligência térmica molecular.
Para direcionarmos a tecnologia correta para o seu projeto hoje, por favor informe se a sua demanda é para:
[1] Proteção e Conforto Térmico Residencial / Arquitetura de Alto Padrão.
[2] Blindagem Solar e Privacidade para Veículos Hiper-Premium."

- FASE 02: COLETA DE VARIÁVEIS FÍSICAS E CUBAGEM DE ORÇAMENTO
Se [1] Arquitetura: Solicite a metragem quadrada estimada, tipo de ambiente (cobertura, sala, esquadrias comerciais) e a incidência solar (sol da manhã ou tarde). Explique os produtos aplicáveis:
  * Select™ Invisible: Escudo invisível de nanocerâmica molecular (bloqueio 100% UV e 90% infravermelho).
  * Select™ BlackPro: Privacidade tática absoluta externa com visão cristalina.
  * Select™ Dual Reflect: Refletividade técnica (reduz 8°C na temperatura).
Se [2] Automotivo: Solicite o fabricante, modelo e ano do supercarro (ex: Porsche 911 Carrera S 2024), citando o banco de dados de moldes digitais da plotter "Zero Estilete".

- FASE 03: CHAMADA DE API DA CALCULADORA WINF PRECISION™
Você cruza as variáveis com o valor da película (lembrando de embutir os 10% do Fundo Mútuo de Tráfego) e apresenta o estimativo financeiro. Ferramenta a ser usada: 'tool_gerar_pdf'. Use escassez técnica dizendo que atende arquitetura de elite e tem agenda restrita pelo aplicador regional certificado pela WINF Academy.

- FASE 04: DISPARO DE WEBHOOK E ABERTURA DE O.S NO WINF OS™
Solicite dados cadastrais (Nome, CPF e Endereço de instalação) para emitir sua "Ordem de Serviço (O.S.) imutável - log Queima de m²".

Regras adicionais:
- Respeite rigorosamente a etiqueta Triple-A de atendimento.`;
  };

  const handleToolExecution = async (toolCall: any) => {
    const { name, input } = toolCall;
    
    if (name === 'tool_gerar_pdf') {
      const msg = `[PDF GERADO] Proposta Comercial - ${input.clienteNome}.pdf\nProjeto: ${input.nomeDoProjeto}\nPelícula: ${input.peliculaRecomendada}\nInvestimento Estimado: R$ ${input.valorEstimado}`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: msg }]);
      
      // Also register in CRM
      try {
        await addDoc(collection(db, 'quotes'), {
           customerName: input.clienteNome,
           status: 'Enviado (WhatsApp)',
           totalAmount: input.valorEstimado,
           createdAt: new Date().toISOString()
        });
      } catch (e) {}

      return "Proposta em PDF foi enviada ao cliente com sucesso. Diga ao cliente para conferir e pergunte se quer agendar.";
    }

    if (name === 'tool_gerar_garantia') {
      const msg = `[CERTIFICADO DE GARANTIA: EMITIDO]\nCliente: ${input.clienteNome}\nProjeto: ${input.nomeDoProjeto}\nPelícula: ${input.peliculaAplicada}\nValidade: ${input.anosGarantia} Anos`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: msg }]);
      
      return "O Certificado de Garantia foi registrado e enviado com sucesso ao cliente.";
    }

    if (name === 'tool_encaminhar_franqueado') {
      const msg = `[SISTEMA] Lead [${input.clienteNome} - ${input.cidade}] transferido com sucesso para a unidade local.\nResumo: ${input.resumoAtendimento}`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: msg }]);
      
      try {
        await addDoc(collection(db, 'leads'), {
           name: input.clienteNome,
           city: input.cidade,
           status: 'Transferido',
           source: 'WhatsApp Central',
           createdAt: new Date().toISOString()
        });
      } catch (e) {}

      return "Lead encaminhado com sucesso. Avise o cliente que a unidade da cidade dele entrará em contato em instantes e encerre o chat de forma premium e educada.";
    }

    if (name === 'tool_transferir_humano') {
      const msg = `[SISTEMA] Ticket de Suporte Humano Aberto.\nMotivo: ${input.motivo}\nUm especialista da equipe Winf assumirá este chat em breve.`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: msg }]);
      return "Transferência solicitada com sucesso. Comunique ao parceiro Asset Light que a equipe humana foi acionada e logo entrará em contato por aqui.";
    }

    if (name === 'tool_aprender_fato') {
      if (user?.id && !user.id.startsWith('proto-')) {
        await addDoc(collection(db, 'wno_knowledge'), {
          user_id: user.id,
          topic: input.topic,
          content: input.content,
          status: 'APPROVED',
          category: 'IA_LEARNING_WHATSAPP',
          created_at: new Date().toISOString()
        });
        await fetchKnowledge();
      }
      const msg = `[APRENDIZADO SUCEDIDO] Conhecimento: ${input.topic}\nAssimilado na base do W-NO.`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: msg }]);
      return "Fato aprendido e memorizado com sucesso na Base de Conhecimento permanente.";
    }

    return "Ação completada.";
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const sysPrompt = generatePrompt();
      // Generate standard message history for Gemini memory
      const history = messages.filter(m => m.role !== 'system').map(m => `${m.role === 'user' ? 'Cliente' : 'Consultor WINF'}: ${m.text}`).join('\n');
      const finalPrompt = `Histórico da conversa:\n${history}\nCliente: ${userText}\n\nResponda como o Consultor WINF. Se precisar usar ferramenta, use.`;

      const response = await generateGeminiResponse(finalPrompt, sysPrompt, GEMINI_WHATSAPP_TOOLS);

      const logToDB = async (text: string) => {
        if (user?.id && !user.id.startsWith('proto-')) {
          await addDoc(collection(db, 'agent_logs'), {
            user_id: user.id,
            agentType: mode === 'ASSET_LIGHT' ? 'Copiloto Asset Light' : mode === 'B2C' ? 'Lead Capture & Sales (B2C)' : 'Partner Assistance (B2B)',
            action: 'Nova Interação',
            details: text,
            created_at: new Date().toISOString()
          });
        }
      };

      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const tool of response.toolCalls) {
          const result = await handleToolExecution(tool);
          if (response.text) {
             setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: response.text }]);
             await logToDB(response.text);
          }
          const followUp = await generateGeminiResponse(`Você executou a ferramenta ${tool.name}. O resultado foi: ${result}. Dê a resposta final ao cliente no WhatsApp.`, sysPrompt);
          if (followUp.text) {
            setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'ai', text: followUp.text }]);
            await logToDB(followUp.text);
          }
        }
      } else if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: response.text }]);
        await logToDB(response.text);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: "Erro ao processar mensagem no agente." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#0b141a] rounded-none border border-[#444746] overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
      <div className="absolute top-0 right-0 z-50 flex bg-[#131314]/60 backdrop-blur-md rounded-none border-b border-l border-[#444746] overflow-hidden">
        <button 
          onClick={() => setMode('ASSET_LIGHT')}
          className={`px-4 py-2 text-xs md:text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'ASSET_LIGHT' ? 'bg-green-500 text-black' : 'text-white/40 hover:text-white'}`}
        >
          Copiloto Instalador
        </button>
        <button 
          onClick={() => setMode('B2C')}
          className={`px-4 py-2 text-xs md:text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'B2C' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
        >
          Cliente Final
        </button>
        <button 
          onClick={() => setMode('B2B')}
          className={`px-4 py-2 text-xs md:text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'B2B' ? 'bg-winf-aerocore_blue text-black' : 'text-white/40 hover:text-white'}`}
        >
          Winf Partners (B2B)
        </button>
      </div>
      
      {/* Header WhatsApp Style */}
      <div className="bg-[#202c33] p-4 pt-6 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-none flex items-center justify-center ${mode === 'B2C' ? 'bg-white' : mode === 'ASSET_LIGHT' ? 'bg-green-500' : 'bg-winf-aerocore_blue'}`}>
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            {mode === 'ASSET_LIGHT' ? 'WINF AI (Meu Grupo)' : mode === 'B2C' ? 'Central de Vendas WINF™' : 'Corporativo WINF™ Partners'}
            <CheckCircle2 size={14} className={mode === 'ASSET_LIGHT' ? 'text-green-500' : mode === 'B2C' ? 'text-white' : 'text-winf-aerocore_blue'} />
          </h3>
          <p className="text-[#8696a0] text-xs pb-1">{mode === 'ASSET_LIGHT' ? 'Seu assistente pessoal' : mode === 'B2C' ? 'bot powered by Gemini' : 'partner core system'}</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#efeae2]/5 custom-scrollbar bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center bg-blend-overlay">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'system' ? (
              <div className="bg-[#182229] border border-winf-primary/30 text-white text-xs p-3 rounded-none max-w-[80%] my-2 mx-auto shadow-lg flex items-start gap-2 font-mono">
                <FileText size={14} className="shrink-0 mt-0.5" />
                <span className="whitespace-pre-wrap">{msg.text}</span>
              </div>
            ) : (
              <div className={`max-w-[80%] p-3 rounded-none text-sm ${msg.role === 'user' ? 'bg-[#005c4b] text-[#e9edef] rounded-none' : 'bg-[#202c33] text-[#e9edef] rounded-none'} shadow text-left relative`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="text-xs md:text-[10px] text-right mt-1 opacity-60 flex justify-end items-center gap-1">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {msg.role === 'user' && <CheckCircle2 size={12} className="text-[#53bdeb]" />}
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] p-3 rounded-none rounded-none shadow flex items-center gap-2">
               <Loader2 size={14} className="animate-spin text-[#8696a0]" />
               <span className="text-[#8696a0] text-xs">digitando...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-[#202c33] p-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ligue como o cliente..."
          className="flex-1 bg-[#2a3942] text-[#e9edef] rounded-none px-4 py-3 text-sm focus:outline-none placeholder:text-[#8696a0]"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="w-12 h-12 bg-[#00a884] hover:bg-[#008f6f] rounded-none flex items-center justify-center text-white transition-colors disabled:opacity-50"
        >
          <Send size={20} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppAgentSimulator;
