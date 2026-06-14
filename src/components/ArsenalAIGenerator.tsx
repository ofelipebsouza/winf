import React, { useState } from 'react';
import { Bot, Sparkles, Loader2, Copy, CheckCircle2, Image as ImageIcon, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const doc13Prompt = `
Você é Auron W-NO, a Inteligência Artificial corporativa da WINF Partners.
Sua tarefa é gerar conteúdos de marketing digital autônomo e de altíssimo luxo, 
baseado no DOCUMENTO 13 (DIRETRIZES DE MÍDIA PARA REDES SOCIAIS).

Diretrizes de Marca (Universo Dark):
- Posicionamento Ultra-Premium: A WINF não é uma "oficina comum de insulfilm", é um "estúdio de engenharia térmica e curadoria digital".
- Estética: "Loft industrial rústico, concreto bruto, tijolo aparente, iluminação cinematográfica, supercarros, residências Triple-A".
- Foco Técnico: "Rejeição de energia e bloqueio de calor invisível (UV 100%, IR 90-99%)". "Mais luz, menos calor".
- Tom de Voz: Elegante, afirmativo, sofisticado, escasso, luxuoso e técnico.

Por favor, crie um plano de conteúdo com 3 postagens (sendo 1 Feed, 1 Reels/Video e 1 Status/Story).
Retorne no formato JSON com a seguinte estrutura:
{
  "posts": [
    {
      "format": "FEED" | "REELS" | "STORY",
      "title": "Título Curto",
      "copy": "Texto completo da legenda com emojis sofisticados e espaçamento adequado...",
      "hashtags": "#WinfPartners #EngenhariaTermica ...",
      "imagePrompt": "Prompt em inglês para ser usado no Midjourney/DALL-E focado na estética Universo Dark..."
    }
  ]
}
`;

const doc16Prompt = `
Você é Auron W-NO, a Inteligência Artificial corporativa da WINF Partners.
Sua tarefa é gerar scripts de abordagem de vendas, dialética de luxo e quebra de objeções baseados no DOCUMENTO 16.

Tom de Voz (Universo Dark):
- Sem pressões comerciais tradicionais, focado em condução intelectual e escassez.
- Vocabulário focado em: engenharia térmica, blindagem molecular, conforto térmico invisível, radiação infravermelha, proteção de ativos, escassez territorial.
- Perfis Alvo: Investidores Beta/Gamma, Parceiros Alpha (operadores locais), Clientes B2C donos de supercarros e mansões.

Crie 3 novos scripts situacionais focados no cliente (B2C, Partner Alpha ou Investidor).
Retorne no formato JSON com a seguinte estrutura:
{
  "posts": [
    {
      "format": "WHATSAPP DRAFT" | "OBJECTION HANDLING" | "PITCH B2C",
      "title": "Contexto do Script (ex: Abordagem inicial para dono de Porsche)",
      "copy": "O texto do script com quebras de linha prontas para copiar e colar para o cliente...",
      "hashtags": "TAG: Vendas, Focado em B2C...",
      "imagePrompt": "Nenhum (Retorne VAZIO para scripts, pois não precisam de imagens)"
    }
  ]
}
`;

const doc17Prompt = `
Você é Auron W-NO, a Inteligência Artificial corporativa da WINF Partners.
Sua tarefa é gerar comunicados corporativos, convites de treinamento e reforços culturais baseados no DOCUMENTO 17 (WINF ACADEMY).

Tom de Voz:
- Professor/Mestre, rigoroso e inspirador. Focado em ergonomia ("Zero Estilete", ferramentas de precisão) e na postura premium Triple-A.
- Vocabulário focado em: certificação, excelência técnica, preservação de materiais de luxo, precisão cirúrgica.

Crie 3 conteúdos focados na formação da WINF Academy (ex: Convite para o Módulo Turn-Key, Lembrete da Diretriz Zero Estilete, Post motivacional sobre a precisão na instalação).
Retorne no formato JSON com a seguinte estrutura:
{
  "posts": [
    {
      "format": "COMUNICADO" | "CONVITE" | "POST ACADEMY",
      "title": "Contexto do Conteúdo",
      "copy": "O texto completo com formatação adequada...",
      "hashtags": "#WINFAcademy #PadraoWINF #TreinamentoElite ...",
      "imagePrompt": "Prompt em inglês para ser usado no Midjourney/DALL-E simulando a área de treinamento tecnológico e limpa da WINF Academy..."
    }
  ]
}
`;

export const ArsenalAIGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const generateContent = async (type: number) => {
    setLoading(true);
    setLoadingType(type);
    setPosts([]);
    try {
      let prompt = "";
      let systemPrompt = "";
      if (type === 13) {
        prompt = "Gere 3 postagens premium de Window Film e Engenharia Térmica para a semana seguinte.";
        systemPrompt = doc13Prompt;
      } else if (type === 16) {
        prompt = "Gere 3 scripts avançados de dialética de fechamento focados na rejeição de infravermelho e exclusividade territorial baseados no Documento 16.";
        systemPrompt = doc16Prompt;
      } else if (type === 17) {
        prompt = "Gere 3 comunicados da WINF Academy baseados no Documento 17, abordando 'Zero Estilete' e excelência.";
        systemPrompt = doc17Prompt;
      }

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          systemPrompt: systemPrompt,
          responseMimeType: "application/json"
        }),
      });
      const data = await res.json();
      if (data.text) {
        const parsed = JSON.parse(data.text);
        setPosts(parsed.posts || []);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar conteúdo. Verifique o console ou a API Key.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      <div className="bg-[#0a0a0b] border border-winf-primary/30 p-5 md:p-8 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-winf-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-winf-primary/20 transition-all"></div>
        <div className="relative z-10 flex flex-col items-start gap-6">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
               <Bot className="text-winf-primary animate-pulse" size={28} />
               <h2 className="text-3xl font-black uppercase italic tracking-tighter">AGENTE CRIADOR AUTÔNOMO</h2>
             </div>
             <p className="text-xs text-white/50 font-black max-w-3xl leading-relaxed uppercase tracking-widest">
               Motor de Curadoria Alimentado pelos Documentos 13, 16 e 17. Gere peças publicitárias de altíssima conversão, scripts de fechamento comercial e materiais de treinamento da WINF Academy.
             </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap">
            <button
              onClick={() => generateContent(13)}
              disabled={loading}
              className="shrink-0 flex items-center justify-center gap-3 bg-white text-black px-6 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {loadingType === 13 ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {loadingType === 13 ? "PROCESSANDO..." : "GERAR REDES SOCIAIS (DOC 13)"}
            </button>
            <button
              onClick={() => generateContent(16)}
              disabled={loading}
              className="shrink-0 flex items-center justify-center gap-3 border border-winf-primary/50 text-white bg-winf-primary/10 px-6 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-winf-primary/20 transition-all shadow-xl shadow-winf-primary/5 disabled:opacity-50"
            >
              {loadingType === 16 ? <Loader2 className="animate-spin" size={16} /> : <MessageSquare size={16} />}
              {loadingType === 16 ? "PROCESSANDO..." : "GERAR SCRIPTS DE VENDAS (DOC 16)"}
            </button>
            <button
              onClick={() => generateContent(17)}
              disabled={loading}
              className="shrink-0 flex items-center justify-center gap-3 border border-white/20 text-white bg-black/60 px-6 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-xl disabled:opacity-50"
            >
              {loadingType === 17 ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {loadingType === 17 ? "PROCESSANDO..." : "GERAR CRIATIVOS ACADEMY (DOC 17)"}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
           {[1,2,3].map(i => (
             <div key={i} className="h-96 bg-[#131314] border border-white/5 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-24 h-4 bg-white/10"></div>
                  <div className="w-full h-8 bg-white/10"></div>
                  <div className="space-y-2 mt-4">
                     <div className="w-full h-3 bg-white/5"></div>
                     <div className="w-5/6 h-3 bg-white/5"></div>
                     <div className="w-4/6 h-3 bg-white/5"></div>
                  </div>
                </div>
                <div className="w-full h-32 bg-white/5 mt-6"></div>
             </div>
           ))}
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-[#131314] border border-white/10 hover:border-winf-primary/50 transition-all flex flex-col group relative">
               <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-[8px] bg-winf-primary/20 text-winf-primary border border-winf-primary/30 px-2 py-1 font-black uppercase tracking-widest">IA VALIDADA</span>
               </div>
               
               <div className="p-6 border-b border-white/5 space-y-4 flex-1">
                 <div className="flex items-center gap-3 mb-2 text-white/40">
                   {post.format === 'STORY' || post.format === 'STATUS' ? <Send size={16} /> : post.format === 'REELS' ? <Send size={16} className="rotate-90"/> : post.format?.includes('WHATSAPP') || post.format?.includes('PITCH') || post.format?.includes('OBJECTION') ? <MessageSquare size={16} /> : <ImageIcon size={16} /> }
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{post.format}</span>
                 </div>
                 <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                   {post.title}
                 </h3>
                 
                 <div className="space-y-2 pt-2">
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">CONTEÚDO</p>
                   <div className="bg-black/30 p-4 border border-white/5 text-[11px] text-white/70 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar italic font-medium whitespace-pre-wrap">
                     {post.copy}
                     <br/><br/>
                     <span className="text-winf-primary">{post.hashtags}</span>
                   </div>
                 </div>
               </div>

               <div className="p-6 bg-[#0a0a0b] space-y-4">
                  {post.imagePrompt && post.imagePrompt !== "Nenhum" && post.imagePrompt !== "VAZIO" && (
                    <>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ImageIcon size={12}/> PROMPT DE IA GLOBAL (MIDJOURNEY/DALL-E)
                      </p>
                      <div className="bg-[#131314] p-3 border border-white/5 text-[9px] font-mono text-white/50 break-all leading-relaxed">
                        {post.imagePrompt}
                      </div>
                    </>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleCopy(post.copy + "\\n\\n" + (post.hashtags || ""), idx)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-300 transition-all"
                    >
                      {copiedId === idx ? <CheckCircle2 size={12} className="text-green-600"/> : <Copy size={12} />} COPIAR TEXTO
                    </button>
                    {post.imagePrompt && post.imagePrompt !== "Nenhum" && post.imagePrompt !== "VAZIO" && (
                      <button 
                        onClick={() => handleCopy(post.imagePrompt, idx + 100)}
                        className="flex-1 flex items-center justify-center gap-2 border border-white/20 bg-transparent text-white py-2 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        {copiedId === idx + 100 ? <CheckCircle2 size={12} className="text-emerald-400"/> : <Copy size={12} />} COPIAR PROMPT
                      </button>
                    )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
