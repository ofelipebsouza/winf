
import { OperationalLog } from '../../types';

/**
 * Interface para Processadores de Linguagem (LLM)
 */
export interface ILLMProvider {
  /** Gera resposta baseada em prompt e contexto */
  generateResponse(prompt: string, context?: string): Promise<string>;
  /** Executa raciocínio com Function Calling (ReAct Loop) */
  executeAgenticLoop(userInput: string, availableTools: any[]): Promise<{
    thought: string;
    action?: { tool: string; params: any };
    response: string;
  }>;
}

/**
 * Interface para Provedores de Comunicação (WhatsApp/Messaging)
 */
export interface ICommunicationProvider {
  /** Status da conexão */
  getStatus(): 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  /** Envia mensagens curtas em blocos (Anti-textão) */
  sendMessage(to: string, content: string): Promise<void>;
  /** Gera QR Code para pareamento */
  getQRCode(): Promise<string>;
  /** Listener para mensagens recebidas */
  onMessage(callback: (message: { from: string; body: string }) => void): void;
}

/**
 * Definição de Ferramentas (Functions) que o Agente pode chamar
 */
export interface ICortexTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<any>;
}
