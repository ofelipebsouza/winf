
import { ILLMProvider } from './interfaces';
import { generateGeminiResponse } from '../gemini';

export class GeminiLLMProvider implements ILLMProvider {
  private model: string;

  constructor(model: string = 'gemini-2.0-flash') {
    this.model = model;
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    const fullPrompt = context ? `Contexto: ${context}\n\nUsuário: ${prompt}` : prompt;
    const result = await generateGeminiResponse(fullPrompt, "Você é um assistente cirúrgico e direto.");
    return result.text;
  }

  async executeAgenticLoop(userInput: string, availableTools: any[]): Promise<{
    thought: string;
    action?: { tool: string; params: any };
    response: string;
  }> {
    // ReAct Loop Implementation
    // 1. Pensamento (Trace)
    // 2. Ação (Function Call)
    // 3. Observação (Resultado da Função)
    // 4. Resposta Final
    
    const systemPrompt = `Você é o Agente W-NO, um Operador Autônomo da WINF Partners.
Sua missão é operar o sistema WINF OS via Function Calling.

FLUXO RECT:
PENSAMENTO: Raciocine sobre o que o usuário quer.
AÇÃO: Chame uma ferramenta se necessário.
RESPOSTA: Formule uma resposta humana curta (Anti-textão).

Ferramentas Disponíveis: ${JSON.stringify(availableTools.map(t => ({ name: t.name, desc: t.description })))}
`;

    const result = await generateGeminiResponse(userInput, systemPrompt, availableTools);

    // Se houver uma chamada de função (ação)
    if (result.toolCalls && result.toolCalls.length > 0) {
      const call = result.toolCalls[0];
      return {
        thought: "Analisando intenção para execução de comando de sistema.",
        action: { tool: call.name, params: call.input },
        response: result.text || "Executando ação solicitada..."
      };
    }

    return {
      thought: "Processando solicitação informativa.",
      response: result.text
    };
  }
}
