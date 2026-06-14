
import { ILLMProvider, ICommunicationProvider, ICortexTool } from './interfaces';
import { RayLogger, WNO } from '../wnoEngine';

export class AgenticOrchestrator {
  private llm: ILLMProvider;
  private messenger: ICommunicationProvider;
  private tools: ICortexTool[] = [];

  constructor(llm: ILLMProvider, messenger: ICommunicationProvider) {
    this.llm = llm;
    this.messenger = messenger;
    this.setupTools();
    this.setupMessenger();
  }

  private setupTools() {
    this.tools = [
      {
        name: 'registrar_lead',
        description: 'Cadastra um novo lead no WINF OS CRM.',
        parameters: { name: 'string', city: 'string', phone: 'string' },
        execute: async (args) => {
          // Mocking DB call for now, but connecting to RayLogger for audit
          RayLogger.logToCortex('function', `REGISTRAR_LEAD: ${args.name} em ${args.city}`);
          return { success: true, message: `Lead ${args.name} cadastrado com sucesso.` };
        }
      },
      {
        name: 'consultar_estoque',
        description: 'Consulta o saldo de lastro em um HUB específico.',
        parameters: { hubId: 'string' },
        execute: async (args) => {
          const saldo = WNO.db.hubs.getHubEstoque(args.hubId);
          RayLogger.logToCortex('function', `CONSULTAR_ESTOQUE: HUB ${args.hubId} | Saldo: ${saldo}m²`);
          return { hub: args.hubId, saldo };
        }
      },
      {
        name: 'gerar_proposta',
        description: 'Gera uma proposta PDF baseada em SKU e metragem.',
        parameters: { sku: 'string', m2: 'number' },
        execute: async (args) => {
          RayLogger.logToCortex('function', `GERAR_PROPOSTA: ${args.m2}m² de ${args.sku}`);
          return { success: true, url: 'https://winf.ai/proposta_gerada.pdf' };
        }
      }
    ];
  }

  private setupMessenger() {
    this.messenger.onMessage(async (msg) => {
      await this.processIncomingMessage(msg.from, msg.body);
    });
  }

  public async processIncomingMessage(from: string, body: string) {
    const configRaw = localStorage.getItem('wno_cortex_config');
    let isAutoPilot = false;
    try {
      if (configRaw) isAutoPilot = JSON.parse(configRaw).isAutoPilotEnabled;
    } catch {}

    const modeTag = isAutoPilot ? '[MODO: AUTO-PILOT]' : '[MODO: MONITORAMENTO]';
    RayLogger.logToCortex('intent', `${modeTag} Input Recebido de ${from}: "${body}"`);

    try {
      // ReAct Loop - Step 1: Reasoning + Action Selection
      const result = await this.llm.executeAgenticLoop(body, this.tools);
      
      // Log Thought
      RayLogger.logToCortex('system', `PENSAMENTO: ${result.thought}`);

      // Step 2: Action Execution (if applicable)
      if (result.action) {
        const tool = this.tools.find(t => t.name === result.action?.tool);
        if (tool) {
          if (this.checkPermission(tool.name)) {
            const toolResult = await tool.execute(result.action.params);
            RayLogger.logToCortex('system', `OBSERVAÇÃO [${tool.name}]: ${JSON.stringify(toolResult)}`);
            
            // Step 3: Inform user (Anti-textão protocol is handled by LLM response formatting)
            await this.messenger.sendMessage(from, result.response);
          } else {
            const errorMsg = `Ação [${tool.name}] bloqueada por falta de permissão no Córtex.`;
            RayLogger.logToCortex('error', errorMsg);
            await this.messenger.sendMessage(from, "Desculpe, não tenho autorização para executar essa operação no momento.");
          }
        }
      } else {
        // Just a conversational response
        await this.messenger.sendMessage(from, result.response);
      }

    } catch (error: any) {
      RayLogger.logToCortex('error', `Falha no Loop Agentico: ${error.message}`);
      await this.messenger.sendMessage(from, "Ocorreu um erro interno no processamento do Córtex.");
    }
  }

  private checkPermission(toolName: string): boolean {
    const configRaw = localStorage.getItem('wno_cortex_config');
    if (!configRaw) return true;
    try {
      const config = JSON.parse(configRaw);
      // Mapping tool names to permission IDs
      const mapping: Record<string, string> = {
        'registrar_lead': 'register_leads',
        'gerar_proposta': 'generate_quotes',
        'consultar_estoque': 'update_stock'
      };
      const permId = mapping[toolName];
      if (!permId) return true;
      const perm = config.permissions?.find((p: any) => p.id === permId);
      return perm ? perm.active : true;
    } catch {
      return true;
    }
  }
}
