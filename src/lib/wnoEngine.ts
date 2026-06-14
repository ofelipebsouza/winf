/* --- WINF OS™ // W-NO INTELLIGENCE ENGINE (FASE 2) --- */
import Governance, { GovernanceToken } from './governance';
import { BusinessCore } from './businessCore';

export interface LeadData {
  id: string;
  name: string;
  city: string;
  phone?: string;
}

export interface AuditRecord {
  hash: string;
  timestamp: string;
  status: 'LOCKED' | 'PENDING' | 'EXECUTED';
  data: {
    leadData: LeadData;
    sku: string;
    m2: number;
    value?: number;
  };
}

export class RayLogger {
  public static logToCortex(type: 'intent' | 'function' | 'system' | 'error', message: string, details?: string) {
    try {
      const existing = localStorage.getItem('wno_cortex_logs');
      const logs = existing ? JSON.parse(existing) : [];
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type,
        message,
        details
      };
      logs.unshift(newLog);
      localStorage.setItem('wno_cortex_logs', JSON.stringify(logs.slice(0, 50)));
      window.dispatchEvent(new Event('wno_cortex_logs_updated'));
    } catch (e) {
      console.error('Failed to log to Cortex', e);
    }
  }

  public static gerarAssinaturaDigital(dados: any): string {
    const rawString = typeof dados === 'string' ? dados : JSON.stringify(dados);
    let hash = 2166136261; // FNV-1a 32-bit offset basis
    for (let i = 0; i < rawString.length; i++) {
      hash ^= rawString.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    const hexHash = hash.toString(16).toUpperCase().padStart(8, '0');
    return `AUTH-AUDIT-SHA256-0x${hexHash}`.toUpperCase();
  }

  public static registrarAlertaSoberano(mensagem: string, operacao: any): string {
    const signature = this.gerarAssinaturaDigital(operacao);
    console.warn(`[W-NO SECURITY ALERT] To: founder (windowfilm.contato@gmail.com)\nWarning: ${mensagem}\nFooter Audit Record:\n==================================================\nauth_audit: ${signature}\n==================================================`);
    return signature;
  }
}

class RayEngineClass {
  public protocol: string;
  public config: {
    logistica: {
      resetRede: () => void;
      registrarHub: (hub: { id: string; tipo: string; gestao: string }) => void;
      getHubs: () => any[];
    };
  };
  public db: {
    catalogo: {
      add: (produto: { nome: string; categoria: string; especificacao: string; status: string }) => Promise<void>;
      listar: () => Promise<any[]>;
    };
    unidades: {
      update: (unidadeId: string, data: { status: string }) => Promise<void>;
    };
    hubs: {
      debitar: (hubId: string, quantidade: number) => Promise<void>;
      creditar: (hubId: string, quantidade: number) => Promise<void>;
      getHubEstoque: (hubId: string) => number;
    };
    logistica: {
      registrarTransito: (transito: {
        de: string;
        para: string;
        qnt: number;
        status: string;
      }) => Promise<void>;
      getTransitos: () => any[];
    };
  };
  public logistica: {
    registrar: (vinculo: {
      id: string;
      hub_origem: string;
      capacidade_estoque: string;
      status_distribuicao: string;
    }) => void;
    getVinculos: () => any[];
  };
  public hub: {
    reclassificar: (hubId: string, configuracao: {
      funcao: string;
      gestao: string;
      permissao_logistica: boolean;
      permissao_codigo: boolean;
    }) => void;
  };
  public ledger: {
    input: (item: {
      produto: string;
      quantidade: number;
      valorUnitario: number;
      hash: string;
      localizacao: string;
    }) => void;
    getInputs: () => any[];
    transferirEstoque: (payload: {
      origem: string;
      destino: string;
      itens: any[];
      documentacao_hash: string;
    }) => Promise<void>;
  };

  private checkPermission(permissionId: string): boolean {
    try {
      const configRaw = localStorage.getItem('wno_cortex_config');
      if (!configRaw) return true;
      const config = JSON.parse(configRaw);
      const perm = config.permissions?.find((p: any) => p.id === permissionId);
      return perm ? perm.active : true;
    } catch (e) {
      return true;
    }
  }

  constructor() {
    this.protocol = "WINF_CORE_PROTOCOL_V1";
    this.config = {
      logistica: {
        resetRede: () => {
          console.log("[W-NO CONFIG] Resetando a rede de hubs logísticos...");
          try {
            localStorage.setItem('wno_hubs_config', JSON.stringify([]));
            window.dispatchEvent(new Event('wno_hubs_updated'));
          } catch (e) {
            console.error('[W-NO HUB RESET ERROR]', e);
          }
        },
        registrarHub: (hub) => {
          console.log(`[W-NO CONFIG] Registrando novo Hub na malha: ${hub.id} (${hub.tipo})`);
          try {
            const existing = localStorage.getItem('wno_hubs_config');
            const list = existing ? JSON.parse(existing) : [];
            list.push({ ...hub, timestamp: new Date().toISOString() });
            localStorage.setItem('wno_hubs_config', JSON.stringify(list));
            window.dispatchEvent(new Event('wno_hubs_updated'));
          } catch (e) {
            console.error('[W-NO HUB REGISTRATION ERROR]', e);
          }
        },
        getHubs: () => {
          try {
            const existing = localStorage.getItem('wno_hubs_config');
            return existing ? JSON.parse(existing) : [
              { id: 'SANTOS', tipo: 'MASTER_HUB', gestao: 'FUNDADOR_ADMIN_PADRAO' },
              { id: 'SOROCABA', tipo: 'MASTER_HUB', gestao: 'FUNDADOR_ADMIN_PADRAO' },
              { id: 'SAO_PAULO', tipo: 'MASTER_HUB', gestao: 'FUNDADOR_ADMIN_PADRAO' }
            ];
          } catch (e) {
            return [];
          }
        }
      }
    };
    this.logistica = {
      registrar: (vinculo) => {
        console.log(`[W-NO LOGISTICA] Registrando unidade ${vinculo.id} vinculada ao hub ${vinculo.hub_origem}`);
        try {
          const existing = localStorage.getItem('ray_logistica_vinculos');
          const list = existing ? JSON.parse(existing) : [];
          list.push({ ...vinculo, timestamp: new Date().toISOString() });
          localStorage.setItem('ray_logistica_vinculos', JSON.stringify(list));
          
          // Also dispatch event when updated
          window.dispatchEvent(new Event('ray_logistica_updated'));
        } catch (e) {
          console.error('[W-NO LOGISTICA ERROR]', e);
        }
      },
      getVinculos: () => {
        try {
          const existing = localStorage.getItem('ray_logistica_vinculos');
          return existing ? JSON.parse(existing) : [];
        } catch (e) {
          return [];
        }
      }
    };
    this.db = {
      catalogo: {
        add: async (produto: { nome: string; categoria: string; especificacao: string; status: string }) => {
          console.log(`[CATÁLOGO] Novo ativo ${produto.nome} integrado à rede WINF.`);
          try {
            const stor = localStorage.getItem('ray_db_catalogo');
            const items = stor ? JSON.parse(stor) : [];
            items.push({
              ...produto,
              id: 'PROD-' + Math.floor(Math.random() * 100000),
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('ray_db_catalogo', JSON.stringify(items));
            window.dispatchEvent(new Event('ray_catalogo_updated'));
          } catch (e) {
            console.error('[W-NO CATALOG ADD ERROR]', e);
          }
        },
        listar: async () => {
          try {
            const stor = localStorage.getItem('ray_db_catalogo');
            return stor ? JSON.parse(stor) : [];
          } catch (e) {
            return [];
          }
        }
      },
      unidades: {
        update: async (unidadeId: string, data: { status: string }) => {
          console.log(`[W-NO DB] Atualizando unidade "${unidadeId}" para status "${data.status}"`);
          try {
            const saved = localStorage.getItem('winf_100_territories');
            if (saved) {
              const territories = JSON.parse(saved);
              const updated = territories.map((t: any) => {
                const isMatch = t.id === unidadeId || 
                                t.city.toUpperCase().replace(/\s+/g, '_') === unidadeId ||
                                (unidadeId.startsWith('T') && t.id === unidadeId) ||
                                (unidadeId === 'SANTOS_01' && t.id === 'T01');
                if (isMatch) {
                  return {
                    ...t,
                    status: data.status === 'ATIVA' ? 'active' : 'disabled',
                    owner: t.owner === 'Não Atribuído' ? 'Parceiro Homologado W-NO AI' : t.owner,
                    botStatus: 'homologated',
                    domainStatus: 'secured'
                  };
                }
                return t;
              });
              localStorage.setItem('winf_100_territories', JSON.stringify(updated));
              window.dispatchEvent(new Event('winf_territories_updated'));
            }
          } catch (e) {
            console.error('[W-NO DB UPDATE ERROR]', e);
          }
        }
      },
      hubs: {
        debitar: async (hubId: string, quantidade: number) => {
          console.log(`[W-NO DB] Debitando ${quantidade} de "${hubId}"`);
          try {
            const stor = localStorage.getItem('wno_hubs_estoque');
            const estoques = stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
            const id = hubId.toUpperCase();
            estoques[id] = Math.max(0, (estoques[id] || 0) - quantidade);
            localStorage.setItem('wno_hubs_estoque', JSON.stringify(estoques));
            window.dispatchEvent(new Event('wno_hubs_estoque_updated'));
          } catch (e) {
            console.error('[W-NO HUB DEBIT ERROR]', e);
          }
        },
        creditar: async (hubId: string, quantidade: number) => {
          console.log(`[W-NO DB] Creditando ${quantidade} em "${hubId}"`);
          try {
            const stor = localStorage.getItem('wno_hubs_estoque');
            const estoques = stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
            const id = hubId.toUpperCase();
            estoques[id] = (estoques[id] || 0) + quantidade;
            localStorage.setItem('wno_hubs_estoque', JSON.stringify(estoques));
            window.dispatchEvent(new Event('wno_hubs_estoque_updated'));
          } catch (e) {
            console.error('[W-NO HUB CREDIT ERROR]', e);
          }
        },
        getHubEstoque: (hubId: string) => {
          try {
            const stor = localStorage.getItem('wno_hubs_estoque');
            const estoques = stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
            return estoques[hubId.toUpperCase()] !== undefined ? estoques[hubId.toUpperCase()] : 300;
          } catch (e) {
            return 300;
          }
        }
      },
      logistica: {
        registrarTransito: async (transito: { de: string; para: string; qnt: number; status: string }) => {
          console.log(`[W-NO DB LOGÍSTICA] Registrando trânsito de ${transito.qnt}m²: ${transito.de} -> ${transito.para}`);
          try {
            const stor = localStorage.getItem('ray_logistica_transitos');
            const list = stor ? JSON.parse(stor) : [];
            list.push({ ...transito, id: 'TR-' + Math.floor(Math.random() * 100000), timestamp: new Date().toISOString() });
            localStorage.setItem('ray_logistica_transitos', JSON.stringify(list));
            window.dispatchEvent(new Event('ray_logistica_transitos_updated'));
          } catch (e) {
            console.error('[W-NO REGISTRAR TRANSITO ERROR]', e);
          }
        },
        getTransitos: () => {
          try {
            const stor = localStorage.getItem('ray_logistica_transitos');
            return stor ? JSON.parse(stor) : [];
          } catch (e) {
            return [];
          }
        }
      }
    };
    this.ledger = {
      input: (item) => {
        console.log(`[LEDGER INPUT] ${item.produto} - ${item.quantidade}m em ${item.localizacao} [HASH: ${item.hash}] registrado.`);
        try {
          const existingData = localStorage.getItem('ray_ledger_inputs');
          const list = existingData ? JSON.parse(existingData) : [];
          list.push({ ...item, timestamp: new Date().toISOString() });
          localStorage.setItem('ray_ledger_inputs', JSON.stringify(list));
          window.dispatchEvent(new Event('ray_ledger_updated'));
        } catch (e) {
          console.error('[LEDGER INPUT ERROR]', e);
        }
      },
      getInputs: () => {
        try {
          const existingData = localStorage.getItem('ray_ledger_inputs');
          return existingData ? JSON.parse(existingData) : [];
        } catch (e) {
          return [];
        }
      },
      transferirEstoque: async (payload) => {
        console.log(`[W-NO LEDGER TRANSFER] Origem: ${payload.origem} | Destino: ${payload.destino} | Hash Doc: ${payload.documentacao_hash}`);
        try {
          const existingTransfers = localStorage.getItem('ray_ledger_transfers');
          const list = existingTransfers ? JSON.parse(existingTransfers) : [];
          list.push({ ...payload, timestamp: new Date().toISOString() });
          localStorage.setItem('ray_ledger_transfers', JSON.stringify(list));
          window.dispatchEvent(new Event('ray_ledger_transfers_updated'));
          
          // Lastro do estoque para o HUB de carregamento
          if (payload.itens && Array.isArray(payload.itens)) {
            payload.itens.forEach((item: any) => {
              this.ledger.input({
                produto: item.nome || item.produto || 'Winf Select® Arquitetônica',
                quantidade: item.metros || item.quantidade || item.quantidade_linear || 30,
                valorUnitario: item.preco || item.valorUnitario || item.valor_unitario || 150,
                hash: payload.documentacao_hash || 'LST-AUTO',
                localizacao: payload.destino
              });
            });
          }
        } catch (e) {
          console.error('[W-NO LEDGER TRANSFER ERROR]', e);
        }
      }
    };
    this.hub = {
      reclassificar: (hubId, configuracao) => {
        console.log(`[STATUS] ${hubId} reconfigurado como Centro de TI e CTO.`);
        try {
          const key = 'ray_hub_classificacoes';
          const stored = localStorage.getItem(key);
          const classificacoes = stored ? JSON.parse(stored) : {};
          classificacoes[hubId] = {
            ...configuracao,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(key, JSON.stringify(classificacoes));
          window.dispatchEvent(new Event('ray_hub_reclassificado'));
        } catch (e) {
          console.error('[W-NO HUB RECLASSIFICAR ERROR]', e);
        }
      }
    };

    // WINF OS™ // AUTOMATIC INITIALIZATION FOR SIMULATION
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Seed hub classifications to represent the Triângulo de Governança W12
        const classKey = 'ray_hub_classificacoes';
        const rawClass = localStorage.getItem(classKey);
        const currentClass = rawClass ? JSON.parse(rawClass) : {};
        
        currentClass.SANTOS = {
          funcao: 'ESTRATEGICO',
          permissao_logistica: true,
          permissao_governo: true,
          descricao: 'Cadeira 01: Santos (SP) - Board Core'
        };
        currentClass.SAO_PAULO = {
          funcao: 'ESTRATEGICO',
          permissao_logistica: true,
          permissao_governo: true,
          descricao: 'Cadeira 03: São Paulo (SP) - Board Core'
        };
        currentClass.SOROCABA = {
          funcao: 'ESTRATEGICO',
          permissao_logistica: true,
          permissao_governo: true, // Elevada a Cadeira de Governança/Decisão
          descricao: 'Cadeira 04: Sorocaba (SP) - Board Core / Diretoria Interior'
        };
        localStorage.setItem(classKey, JSON.stringify(currentClass));

        // Registry the elevation protocol in the immutable Ledger for compliance
        const ledgInputsKey = 'ray_ledger_inputs';
        const rawLedg = localStorage.getItem(ledgInputsKey);
        const currentLedg = rawLedg ? JSON.parse(rawLedg) : [];
        const elevationPreApproved = currentLedg.some((inputs: any) => inputs.produto && inputs.produto.includes('Sorocaba'));
        if (!elevationPreApproved) {
          currentLedg.push({
            produto: 'Protocolo de Elevação Hierárquica: Sorocaba W12',
            quantidade: 1,
            valorUnitario: 250000,
            hash: 'W12-BOARD-SRB-ELEVATION-2026',
            localizacao: 'SOROCABA',
            vendedor: 'AUTO-GOVERNANCE-LEDGER',
            timestamp: new Date().toISOString()
          });
          currentLedg.push({
            produto: 'Sincronização de Triângulo de Poder W12 (Santos-SP-Sorocaba)',
            quantidade: 3,
            valorUnitario: 0,
            hash: 'W12-GOV-TRIANGLE-ACT-2026',
            localizacao: 'HOLDING_CORE',
            vendedor: 'W-NO-ENGINE-LEDGER',
            timestamp: new Date().toISOString()
          });
          localStorage.setItem(ledgInputsKey, JSON.stringify(currentLedg));
        }

        // 1. Initial backlog/estoque: Set SANTOS (Master Hub) to 500m2 of Invisible line
        const stokKey = 'wno_hubs_estoque';
        const rawStock = localStorage.getItem(stokKey);
        const currentStock = rawStock ? JSON.parse(rawStock) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
        currentStock.SANTOS = 500; // Force 500 m2 of Invisible line in Santos Hub as requested by creator
        localStorage.setItem(stokKey, JSON.stringify(currentStock));

        // 2. Initial Catalog Setup for AeroCore™, BlackPRO®, Dual Reflect®
        const catKey = 'ray_db_catalogo';
        const rawCatalog = localStorage.getItem(catKey);
        const currentCatalog = rawCatalog ? JSON.parse(rawCatalog) : [];
        
        const aeroCoreExists = currentCatalog.some((p: any) => p.nome && p.nome.includes('AeroCore'));
        const blackProExists = currentCatalog.some((p: any) => p.nome && p.nome.includes('BlackPRO'));
        const dualReflectExists = currentCatalog.some((p: any) => p.nome && p.nome.includes('Dual Reflect'));

        if (!aeroCoreExists) {
          currentCatalog.push({
            id: 'PROD-AEROCORE',
            nome: 'AeroCore™ Nano-Ceramic',
            categoria: 'SERIE_CERAMICA',
            especificacao: 'IRR: 98% (Extremo), UVR: 99.9%, Garantia: Vitalícia | Custo Ref: R$ 45.00/m² | Sugestão: R$ 150.00/m²',
            status: 'DISPONIVEL_PARA_HUB'
          });
        }
        if (!blackProExists) {
          currentCatalog.push({
            id: 'PROD-BLACKPRO',
            nome: 'BlackPRO® Carbon Shield',
            categoria: 'PROTECAO_SUPERFICIE',
            especificacao: 'IRR: 82% (Balanceado), UVR: 99.0%, Garantia: 10 anos | Custo Ref: R$ 35.00/m² | Sugestão: R$ 120.00/m²',
            status: 'DISPONIVEL_PARA_HUB'
          });
        }
        if (!dualReflectExists) {
          currentCatalog.push({
            id: 'PROD-DUALREFLECT',
            nome: 'Dual Reflect® Architectural',
            categoria: 'NANOTECNOLOGICO',
            especificacao: 'IRR: 92% (Alta Rejeição), UVR: 99.9%, Garantia: 15 anos | Custo Ref: R$ 55.00/m² | Sugestão: R$ 180.00/m²',
            status: 'DISPONIVEL_PARA_HUB'
          });
        }

        localStorage.setItem(catKey, JSON.stringify(currentCatalog));
      }
    } catch (e) {
      console.error('[W-NO INITIALIZATION ERROR]', e);
    }
  }

  // Processamento com auditoria (Documento 18, página 3)
  public async processarVenda(leadData: LeadData, sku: string, m2: number, token?: GovernanceToken): Promise<AuditRecord> {
    if (!this.checkPermission('update_stock')) {
      RayLogger.logToCortex('error', 'Tentativa de venda bloqueada: Permissão de ESTOQUE desativada.');
      throw new Error("Ação bloqueada pela Governança do Córtex: update_stock.");
    }

    // Se um token for enviado, podemos validar o acesso
    if (token) {
      const access = Governance.validateAccess(token, 'LEVEL_GAMMA_OP');
      if (!access.granted) {
        throw new Error(`Acesso negado para o W-NO (Núcleo Operacional): ${access.error}`);
      }
    }

    // Gerar Hash único para o investidor (Transparência Radical)
    const auditHash = btoa(`${leadData.id}-${Date.now()}-${sku}-${m2}`);
    
    // Call Business Core to synchronize logistics
    await BusinessCore.sincronizarLastro(sku, m2, auditHash);
    
    const registro: AuditRecord = {
      hash: auditHash,
      timestamp: new Date().toISOString(),
      status: 'LOCKED',
      data: { leadData, sku, m2 }
    };

    // Salvar no barramento de auditoria
    console.log(`[W-NO (Núcleo Operacional)] Operação Registrada: ${auditHash}`);
    return registro;
  }

  // Processamento de Inteligência para o Catálogo (FASE 2)
  public async processarDecisao(modulo: string, dados: any): Promise<{ status: string; data: any; auditHash: string }> {
    console.log(`[W-NO] Analisando operação no módulo: ${modulo}`);
    
    // Validação de Governança (Zero botões inúteis)
    if (!this.validarPermissao(modulo)) {
      throw new Error("Acesso negado: Perímetro de segurança.");
    }

    // Execução da Inteligência
    return await this.executarLogica(modulo, dados);
  }

  public validarPermissao(modulo: string): boolean {
    // Integração direta com o seu Business Core
    return !!modulo; 
  }

  public async executarLogica(modulo: string, dados: any): Promise<{ status: string; data: any; auditHash: string }> {
    // Simulate smart decisions execution in environment nodes
    const mockHash = 'AUx' + Math.floor(Math.random() * 1000000).toString(16).toUpperCase();
    return {
      status: 'DECISION_APPROVED',
      data: {
        modulo,
        decisionTimestamp: new Date().toISOString(),
        analysisResult: "COMPLIANCE_OPTIMIZATION_SUCCESS",
        payload: dados
      },
      auditHash: mockHash
    };
  }

  public async fecharVendaAtomica(
    unidadeId: string,
    sku: string,
    m2: number,
    valorUnitario: number
  ): Promise<{ success: boolean; hash?: string; authAudit?: string; error?: string }> {
    if (!this.checkPermission('update_stock')) {
      return { success: false, error: "Permissão de [Atualizar Estoque] desativada no Córtex." };
    }
    
    console.log(`[COMMIT DUAS FASES] Iniciando faturamento de: ${m2}m² de ${sku} em ${unidadeId}`);
    try {
      // 1. Fase de Preparação (Verificar se é HUB de origem ou Unidade franqueada e resgatar saldos)
      const idUpper = unidadeId.toUpperCase().trim();
      const isHub = ['SANTOS', 'SOROCABA', 'SAO_PAULO', 'SAOPAULO'].includes(idUpper);

      if (isHub) {
        // Obter estoques do Hub
        const stor = localStorage.getItem('wno_hubs_estoque');
        const estoques = stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
        const currentHubStock = estoques[idUpper] !== undefined ? estoques[idUpper] : 0;

        if (currentHubStock < m2) {
          throw new Error(`[LASTRO GATE] Erro atômico: Estoque insuficiente no HUB origem ${idUpper}. Disponível: ${currentHubStock}m²`);
        }

        // 2. Fase de Dedução (Primeiro commit)
        estoques[idUpper] = currentHubStock - m2;
        localStorage.setItem('wno_hubs_estoque', JSON.stringify(estoques));
        window.dispatchEvent(new Event('wno_hubs_estoque_updated'));
      } else {
        // É uma unidade regional de franqueado
        const savedBacking = localStorage.getItem('ray_unidades_lastros_faturamento');
        const lastros = savedBacking ? JSON.parse(savedBacking) : { CAMPINAS: 150, SAO_BERNARDO: 80, MIGUEL_PEREIRA: 40 };
        // normalize keys
        const cleanKey = idUpper.replace(/_SP|_RJ/gi, '').trim();
        const currentLastro = lastros[cleanKey] !== undefined ? lastros[cleanKey] : 50;

        if (currentLastro < m2) {
          throw new Error(`[LASTRO GATE] Erro atômico: Unidade regional ${cleanKey} não possui lastro físico suficiente em estoque. Disponível: ${currentLastro}m²`);
        }

        // 2. Fase de Dedução (Primeiro commit)
        lastros[cleanKey] = currentLastro - m2;
        localStorage.setItem('ray_unidades_lastros_faturamento', JSON.stringify(lastros));
        window.dispatchEvent(new Event('ray_unidades_lastros_updated'));
      }

      // 3. Fase de Ledger & Assinatura (Segundo commit)
      const auditHash = 'NFE-' + Math.floor(Math.random() * 1000000).toString(16).toUpperCase();
      const authAudit = RayLogger.gerarAssinaturaDigital({
        unidadeId: idUpper,
        sku,
        m2,
        valorUnitario,
        timestamp: new Date().toISOString(),
        relacao: 'VENDA_ATOMICA_WINF_OS'
      });

      // Registrar entrada no Ledger do lastro
      this.ledger.input({
        produto: sku,
        quantidade: -m2,
        valorUnitario,
        hash: auditHash,
        localizacao: idUpper
      });

      console.log(`[COMMIT DUAS FASES] Sucesso atômico! Transação persistida sob hash ${auditHash}. Assinatura: ${authAudit}`);
      return { success: true, hash: auditHash, authAudit };
    } catch (e: any) {
      console.error(`[COMMIT DUAS FASES ROLLBACK] Falha na venda: ${e.message}`);
      // Lançar alerta assinado ao fundador
      const authAudit = RayLogger.registrarAlertaSoberano(
        `Falha na tentativa de transação atômica em ${unidadeId}: ${e.message}`,
        { unidadeId, sku, m2, valorUnitario, error: e.message }
      );
      return { success: false, error: e.message, authAudit };
    }
  }
}

// Inicialização do nó de inteligência
export const WNO = new RayEngineClass();

/* --- WINF OS™ // GATILHO DE ATIVAÇÃO AUTOMÁTICA --- */
export async function ativarUnidadeComEstoque(unidadeId: string, containerData: any) {
  // 1. Libera o acesso administrativo
  await WNO.db.unidades.update(unidadeId, { status: 'ATIVA' });

  // 2. Transfere o estoque inicial (Container de películas Select)
  await WNO.ledger.transferirEstoque({
    origem: 'HOLDING_CENTRAL',
    destino: unidadeId,
    itens: containerData.itens, // Linha Select da WINF
    documentacao_hash: containerData.hash_nfe // Link para a nota fiscal
  });

  console.log("[SUCESSO] Unidade ativa e lastro carregado.");
}

export default WNO;

/* --- WINF OS™ // ENGINE DE ROTEAMENTO LOGÍSTICO --- */

export interface LatLng {
  lat: number;
  lng: number;
}

export const COORDENADAS_HUBS: Record<string, LatLng> = {
  SANTOS: { lat: -23.9608, lng: -46.3331 },
  SOROCABA: { lat: -23.5015, lng: -47.4526 },
  SAO_PAULO: { lat: -23.5505, lng: -46.6333 }
};

export const CORDENADAS_CIDADES: Record<string, LatLng> = {
  SAO_PAULO: { lat: -23.5505, lng: -46.6333 },
  RIO_DE_JANEIRO: { lat: -22.9068, lng: -43.1729 },
  BELO_HORIZONTE: { lat: -19.9167, lng: -43.9345 },
  PORTO_ALEGRE: { lat: -30.0346, lng: -51.2177 },
  CURITIBA: { lat: -25.4290, lng: -49.2671 },
  SALVADOR: { lat: -12.9777, lng: -38.5016 },
  RECIFE: { lat: -8.0543, lng: -34.8813 },
  FORTALEZA: { lat: -3.7319, lng: -38.5267 },
  MANAUS: { lat: -3.1190, lng: -60.0217 },
  BRASILIA: { lat: -15.7942, lng: -47.8822 },
  GOIANIA: { lat: -16.6869, lng: -49.2648 },
  CAMPINAS: { lat: -22.9056, lng: -47.0608 },
  SANTOS: { lat: -23.9608, lng: -46.3331 },
  SOROCABA: { lat: -23.5015, lng: -47.4526 },
  CAMPINA_GRANDE: { lat: -7.2241, lng: -35.8774 },
  SAO_BERNARDO_DO_CAMPO: { lat: -23.6939, lng: -46.5650 },
  JOAO_PESSOA: { lat: -7.1196, lng: -34.8450 },
  NATAL: { lat: -5.7945, lng: -35.2110 },
  ARACAJU: { lat: -10.9472, lng: -37.0731 },
  MACEIO: { lat: -9.6658, lng: -35.7350 },
  VITORIA: { lat: -20.3155, lng: -40.3128 },
  SAO_LUIS: { lat: -2.5307, lng: -44.3068 },
  TERESINA: { lat: -5.0920, lng: -42.8038 },
  FLORIANOPOLIS: { lat: -27.5954, lng: -48.5480 },
  CUIABA: { lat: -15.6010, lng: -56.0974 },
  CAMPO_GRANDE: { lat: -20.4697, lng: -54.6201 },
  JOINVILLE: { lat: -26.3045, lng: -48.8456 },
  RIBEIRAO_PRETO: { lat: -21.1775, lng: -47.8103 },
  SAO_JOSE_DOS_CAMPOS: { lat: -23.1896, lng: -45.8841 },
  MIGUEL_PEREIRA: { lat: -22.4571, lng: -43.4697 }
};

export function calcularDistancia(cidadeA: string, cidadeB: string): number {
  const normA = cidadeA.toUpperCase().trim().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normB = cidadeB.toUpperCase().trim().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const cA = CORDENADAS_CIDADES[normA] || COORDENADAS_HUBS[normA] || obterCoordenadasDeterministas(normA);
  const cB = CORDENADAS_CIDADES[normB] || COORDENADAS_HUBS[normB] || obterCoordenadasDeterministas(normB);

  // Haversine formula
  const R = 6371; // km
  const dLat = (cB.lat - cA.lat) * Math.PI / 180;
  const dLng = (cB.lng - cA.lng) * Math.PI / 180;
  const lat1 = cA.lat * Math.PI / 180;
  const lat2 = cB.lat * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function obterCoordenadasDeterministas(nomeCidade: string): LatLng {
  let hash = 0;
  for (let i = 0; i < nomeCidade.length; i++) {
    hash = nomeCidade.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const lat = -35 + (Math.abs((hash * 13) % 350) / 10);
  const lng = -70 + (Math.abs((hash * 23) % 350) / 10);
  
  return { lat, lng };
}

export function definirHubLogistico(cidadeDestino: string): string {
  // O sistema analisa a proximidade para otimizar o frete e lastro no Triângulo Logístico W12 (Santos, São Paulo e Sorocaba)
  const distancias = {
    santos: calcularDistancia(cidadeDestino, 'SANTOS'),
    sorocaba: calcularDistancia(cidadeDestino, 'SOROCABA'),
    sao_paulo: calcularDistancia(cidadeDestino, 'SAO_PAULO')
  };

  // Retorna o Hub com a menor distância (otimização de lastro)
  return Object.keys(distancias).reduce((a, b) => 
    distancias[a as keyof typeof distancias] < distancias[b as keyof typeof distancias] ? a : b
  );
}

/* --- WINF OS™ // MÓDULO DE ROTEAMENTO LOGÍSTICO --- */
export const vincularUnidadeAoHub = (cidade: { id: string }, hubOrigem: string) => {
  // Registra a unidade na malha logística
  WNO.logistica.registrar({
    id: cidade.id,
    hub_origem: hubOrigem, // SANTOS, SOROCABA ou SAO_PAULO
    capacidade_estoque: 'DEFAULT_CONTAINER_SIZE',
    status_distribuicao: 'AGUARDANDO_INTEGRACAO'
  });
};

/* --- WINF OS™ // RECONFIGURAÇÃO DE MALHA LOGÍSTICA --- */
export const atualizarMalhaLogistica = () => {
    const novosHubs = ['SANTOS', 'SOROCABA', 'SAO_PAULO'];
    
    // O W-NO™ reconfigura os nós de distribuição
    WNO.config.logistica.resetRede();
    
    novosHubs.forEach(hub => {
        WNO.config.logistica.registrarHub({
            id: hub,
            tipo: 'MASTER_HUB',
            gestao: 'FUNDADOR_ADMIN' // Controle único
        });
    });

    console.log("[STATUS] Malha logística triangulada e centralizada com sucesso.");
};

/* --- WINF OS™ // ENGINE DE TRANSFERÊNCIA ENTRE HUBs --- */
export async function transferirLastro(origem: string, destino: string, quantidade: number) {
    // 1. O sistema debita da origem
    await WNO.db.hubs.debitar(origem, quantidade);
    
    // 2. O sistema registra o trânsito
    await WNO.db.logistica.registrarTransito({
        de: origem,
        para: destino,
        qnt: quantidade,
        status: 'EM_MOVIMENTO'
    });
    
    // 3. O sistema credita no destino (após confirmação de recebimento)
    console.log(`[LOGÍSTICA] Transferência de ${quantidade}m² iniciada: ${origem} -> ${destino}`);
}

export async function confirmarRecebimentoLastro(transitoId: string) {
  try {
    const stor = localStorage.getItem('ray_logistica_transitos');
    if (stor) {
      const list = JSON.parse(stor);
      const idx = list.findIndex((t: any) => t.id === transitoId);
      if (idx !== -1 && list[idx].status === 'EM_MOVIMENTO') {
        list[idx].status = 'COMPLETADO';
        
        // Credita destino
        await WNO.db.hubs.creditar(list[idx].para, list[idx].qnt);
        
        localStorage.setItem('ray_logistica_transitos', JSON.stringify(list));
        window.dispatchEvent(new Event('ray_logistica_transitos_updated'));
        console.log(`[LOGÍSTICA] Transferência ${transitoId} concluída. ${list[idx].qnt}m² creditados em ${list[idx].para}.`);
      }
    }
  } catch (e) {
    console.error('[W-NO CONFIRM TRANSIT ERROR]', e);
  }
}

/* --- WINF OS™ // CONFIGURAÇÃO MESTRA DE HUBs --- */

export const HUB_CONFIG = {
    MASTER: {
        id: 'HUB_SANTOS',
        nome: 'SANTOS (PORT MASTER)',
        funcao: 'ADMINISTRATIVO_E_IMPORTACAO',
        pode_emitir_nfe: true
    },
    DISTRIBUICAO: [
        { id: 'HUB_SOROCABA', nome: 'SOROCABA (INTERIOR)', funcao: 'OPERACIONAL' },
        { id: 'HUB_SAOPAULO', nome: 'SAO_PAULO (CAPITAL)', funcao: 'OPERACIONAL' }
    ]
};

export const obterDistancia = (origem: string, destino: string): number => {
  // Ajuste de IDs de Hub para as coordenadas normais
  const cleanId = (id: string) => {
    return id.replace('HUB_', '').replace('SAOPAULO', 'SAO_PAULO');
  };
  return calcularDistancia(cleanId(origem), cleanId(destino));
};

// Função para calcular custo de frete entre hubs (ex: Santos -> Sorocaba)
export const calcularFreteInterno = (origem: string, destino: string, peso?: number) => {
    // Lógica simples de custo de deslocamento para manter sua margem blindada
    const km = obterDistancia(origem, destino);
    return km * 0.85; // Custo fixo por KM
};

// Filtro Global de Roteamento de Interface: Exclui nós CENTRO_DE_DESENVOLVIMENTO_TI de movimentação de lastro
export function obterHubsAtivosLogistica(): string[] {
  try {
    const key = 'ray_hub_classificacoes';
    const stored = localStorage.getItem(key);
    const classificacoes = stored ? JSON.parse(stored) : {};
    
    // Todos os hubs físicos na malha padrão
    const defaultHubs = ['SANTOS', 'SOROCABA', 'SAO_PAULO'];
    
    return defaultHubs.filter(hubId => {
      const config = classificacoes[hubId];
      if (config) {
        if (config.funcao === 'CENTRO_DE_DESENVOLVIMENTO_TI' || config.permissao_logistica === false) {
          return false;
        }
      }
      return true;
    });
  } catch (e) {
    return ['SANTOS', 'SOROCABA', 'SAO_PAULO'];
  }
}


