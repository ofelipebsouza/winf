import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Download, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  FileSignature, 
  ChevronLeft, 
  Filter, 
  HelpCircle, 
  Clock, 
  ShieldCheck,
  ShieldAlert,
  Loader,
  X,
  Fingerprint,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Award,
  Eye,
  Printer,
  Plus,
  Trash2,
  FileKey
} from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { VaultFile } from '../types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ModuleDocVaultProps {
  onBack?: () => void;
  initialTab?: 'ativos' | 'governanca';
  initialDocId?: string;
}

interface LegalDoc {
  id: string;
  name: string;
  file: string;
  required_signature: boolean;
  category: 'alpha' | 'kiosk' | 'beta' | 'gamma' | 'relatorios';
}

const GOVERNANCA_JURIDICA: Record<string, LegalDoc[]> = {
  produto_alpha: [
    { id: "alpha_01", name: "Circular de Oferta de Franquia (COF) - WINF FaaS", file: "winf_cof_faas_official.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_02", name: "Contrato de Concessão Territorial Asset-Light", file: "winf_contrato_concessao_territorial.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_03", name: "Licença de Uso de Marca - WINF Premium Quality", file: "winf_licenca_uso_marca.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_04", name: "Termo de Uso WINF OS™ e Anuência de Trava Digital", file: "winf_eula_termo_uso_os.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_05", name: "Acordo de Parceria Operacional (Investidor-Padrinho)", file: "winf_acordo_investidor_padrinho.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_06", name: "Contrato de Prestação de Serviço Técnico por Mão de Obra ($m²)", file: "winf_contrato_tecnico_m2.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_07", name: "Manual de Onboarding e Roadmap Operacional (Asset-Light)", file: "winf_manual_onboarding_roadmap.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_08", name: "Procedimento Operacional Padrão (POP) - Implantação Turn-Key Alpha", file: "winf_pop_implantacao_turn_key.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_09", name: "Manual de Posicionamento Digital, Curadoria Visual e Diretrizes de Mídia", file: "winf_manual_posicionamento_digital.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_10", name: "Arsenal de Pitches de Alta Conversão e Plano de Execução Crítica de 7 Dias", file: "winf_arsenal_pitches_execucao_7dias.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_11", name: "Diretriz Estratégica de Posicionamento e Marca Pessoal no LinkedIn", file: "winf_diretriz_linkedin_marca_pessoal.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_12", name: "Diretrizes de Infraestrutura Google: Google Workspace, Ferramentas de Rastreamento e Otimização de SEO Local", file: "winf_diretrizes_infra_google.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_13", name: "Documento 25: Diretrizes de Padronização e Configuração de Redes Sociais Territoriais: Instagram e Facebook Pages", file: "winf_diretrizes_redes_sociais.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_14", name: "Documento 26: Diretriz Tática de Arquitetura, Deploy de OnePage Geolocalizada e Engenharia de SEO Local", file: "winf_diretriz_arquitetura_onepage.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_15", name: "Documento 27: Diretrizes de Direção de Arte e Sessão Fotográfica Integrada — AeroCore™ Studio", file: "winf_diretrizes_direcao_arte.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_16", name: "Documento 27b: Arsenal de Engenharia Cognitiva — W-NO", file: "winf_arsenal_cognitivo_ray.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_17", name: "Documento 28: Diretrizes Operacionais da Central de Atendimento Piloto (B2C)", file: "winf_diretrizes_b2c_whatsapp.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_18", name: "Documento 29: Roteiro de Estruturação Jurídica, Regularização e CNPJs Master", file: "winf_roteiro_juridico_regularizacao.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_19", name: "Documento 30: Arsenal de Campanhas, Copies de Anúncios (Investimentos) e Plano Estratégico para as 100 Cidades", file: "winf_arsenal_campanhas_investimentos.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_20", name: "Documento 31: Compêndio Integrado de Campanhas de Anúncios e Diretrizes de Expansão", file: "winf_compendio_campanhas_expansao.pdf", required_signature: false, category: 'alpha' },
    { id: "alpha_21", name: "Documento 33: Minuta Padrão do Contrato de Concessão Territorial Alpha", file: "winf_minuta_concessao_alpha.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_22", name: "Documento 34: Acordo de Conformidade Jurídica e Governança Integratória", file: "winf_conformidade_juridica_governanca.pdf", required_signature: true, category: 'alpha' },
    { id: "alpha_23", name: "Documento 35: Regulamento do Portal do Especificador IA / Reserva Técnica", file: "winf_regulamento_especificador_ia.pdf", required_signature: true, category: 'alpha' }
  ],
  produto_kiosk: [
    { id: "kiosk_01", name: "Termo Aditivo de Expansão Física de Canal", file: "winf_aditivo_kiosk_shopping.pdf", required_signature: true, category: 'kiosk' },
    { id: "kiosk_02", name: "Cessão de Uso de Software Frontend (W-NO Totem API)", file: "winf_licenca_ray_totem.pdf", required_signature: true, category: 'kiosk' },
    { id: "kiosk_03", name: "Manual Executivo de Padronização Física e Visual", file: "winf_manual_padrao_kiosk.pdf", required_signature: false, category: 'kiosk' }
  ],
  produto_beta: [
    { id: "beta_01", name: "Acordo de Confidencialidade (NDA Criptografado)", file: "winf_nda_private_equity.pdf", required_signature: true, category: 'beta' },
    { id: "beta_02", name: "Contrato de SCP - Pool de Liquidez Importação BlackShop™", file: "winf_contrato_scp_pool_liquidez.pdf", required_signature: true, category: 'beta' },
    { id: "beta_03", name: "Acordo de Governança e Trava Algorítmica de Reinvestimento Google Ads", file: "winf_trava_reinvestimento_ads.pdf", required_signature: true, category: 'beta' },
    { id: "beta_04", name: "Dossiê de Transparência e Tabela de Custos BlackShop™", file: "winf_dossie_transparencia_custos.pdf", required_signature: false, category: 'beta' },
    { id: "beta_05", name: "Roadmap de Tração, Transparência e Governança de Aporte", file: "winf_roadmap_tracao_transparencia_porte.pdf", required_signature: false, category: 'beta' }
  ],
  produto_gamma: [
    { id: "gamma_01", name: "Circular de Oferta de Franquia (COF) - AeroCore™ Hub", file: "aerocore_cof_hub_official.pdf", required_signature: true, category: 'gamma' },
    { id: "gamma_02", name: "Estatuto Social de Admissão ao Conselho W12", file: "aerocore_estatuto_conselho_w12.pdf", required_signature: true, category: 'gamma' },
    { id: "gamma_03", name: "Contrato de Concessão de Hub Regional de Distribuição Física", file: "winf_contrato_hub_logistico.pdf", required_signature: true, category: 'gamma' },
    { id: "gamma_04", name: "Licença de Uso de Marca e Padrão Estético AeroCore™ Studio", file: "aerocore_licenca_marca_loft.pdf", required_signature: true, category: 'gamma' },
    { id: "gamma_05", name: "Plano de Expansão Macro, Gatilhos de Escala e Exit (M&A)", file: "winf_plano_expansao_macro_exit_ma.pdf", required_signature: false, category: 'gamma' }
  ],
  relatorios: [
    { id: "report_01", name: "Q1/2026 Financial Report (Estimate) - Demonstração de Resultado do Exercício", file: "winf_dre_q1_2026_estimate.pdf", required_signature: false, category: 'relatorios' },
    { id: "report_02", name: "Network Yield Distribution Q1 - Distribuição Consolidada de Dividendos", file: "winf_yield_distribution_q1.pdf", required_signature: false, category: 'relatorios' },
    { id: "report_03", name: "Operational Transparency Audit - Relatório Geral de Auditoria WINF", file: "winf_audit_transparency_operational.pdf", required_signature: false, category: 'relatorios' },
    { id: "report_04", name: "Relatório de Auditoria Trimestral Consolidado - 1T/2026 (Assinado)", file: "winf_auditoria_trimestral_consolidada_1t2026.pdf", required_signature: true, category: 'relatorios' }
  ]
};

export const ModuleDocVault: React.FC<ModuleDocVaultProps> = ({ onBack, initialTab = 'ativos', initialDocId }) => {
  const { 
    user, 
    vaultFiles, 
    isVaultLoading, 
    fetchDocVault, 
    gamify, 
    triggerNotification 
  } = useWinf();
  
  // Custom sub-tabs including admin tab for managing files
  const [vaultTab, setVaultTab] = useState<'ativos' | 'governanca' | 'admin' | 'registros'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setVaultTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  // Signature panel states
  const [signingDoc, setSigningDoc] = useState<LegalDoc | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [signatureCPF, setSignatureCPF] = useState('');
  const [isBiometricVerifying, setIsBiometricVerifying] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [fingerprintScanning, setFingerprintScanning] = useState(false);

  // Firestore-synced signatures list
  const [signedDocIds, setSignedDocIds] = useState<string[]>([]);

  // Safety gate consent modal before viewing documents
  const [consentDoc, setConsentDoc] = useState<{ type: 'vault' | 'legal'; file: VaultFile | LegalDoc } | null>(null);
  const [consentStatementCheck, setConsentStatementCheck] = useState(false);
  const [consentResponsibilityCheck, setConsentResponsibilityCheck] = useState(false);

  // Admin Document Creation States
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Alpha');
  const [newDescription, setNewDescription] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAllowedRoles, setNewAllowedRoles] = useState<string[]>(['Admin', 'Investor', 'Licenciado', 'Member']);
  const [isDocSaving, setIsDocSaving] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<{ title: string; filename: string; content: string } | null>(null);

  const handlePreviewVaultFile = (file: VaultFile) => {
    if (!hasAccess(file)) {
      triggerNotification(
        'Acesso Negado',
        'Seu nível de credencial societária não possui liberação para visualizar este ativo.'
      );
      return;
    }

    const timestamp = new Date().toLocaleString('pt-BR');
    const content = `================================================================================
|                                WINF PARTNERS                                  |
|         CONFIG: Logo Outorgante (WINF = #8B0000 | PARTNERS = #000080)         |
================================================================================
--------------------------------------------------------------------------------
DOCUMENTO: SELECT™ ARCHITECTURAL AND AUTOMOTIVE PERFORMANCE PORTFOLIO
PROTOCOLO EXPORTAÇÃO SECURITY HASH: sha256_e738ff91facb82a0d1822cb
AUTORIZADO PARA: ${user?.name || 'Authorized Leader'} (${user?.role || 'Guest'})
PROTOCOLO EXPORTAÇÃO REGISTRO: ${timestamp}
--------------------------------------------------------------------------------

01. DETALHAMENTO ESTRATÉGICO DE GESTÃO E CAPACIDADES DO ATIVO
--------------------------------------------------------------------------------
Este manual técnico corresponde ao ativo oficial do ecossistema: "${file.title}"
Categoria societária: PRODUTO ${file.category.toUpperCase()} (${file.fileSize})

Manual descritivo e especificações integradas:
${file.description}

02. MATRIZ RESIDENCIAL & ARQUITETÔNICA (WINF SELECT™)
--------------------------------------------------------------------------------
- Controle solar seletivo para residências de alto padrão.
- Mantém até 70% de luz visível enquanto reflete o infravermelho nocivo.
- Proteção UV de fator FPS 1000+ garantindo integridade molecular de revestimentos.
- Otimização direta de sistemas de ar-condicionado com redução drástica de carga.

03. MATRIZ AUTOMOTIVA (THE ART OF PROTECTION)
--------------------------------------------------------------------------------
- Tecnologia Nano-Ceramic como escudo molecular invisível de alta durabilidade.
- Privacidade tática sem comprometer a visibilidade noturna cristalina.
- Escaneamento térmico para supercarros e experiências de luxo absoluto.

04. TERMOS DE PROPRIEDADE INDUSTRIAL, SEGURANÇA E ACORDO DE SIGILO
--------------------------------------------------------------------------------
Documento estritamente confidencial, auditado pela holding WINF Partners. É proibido 
retransmitir ou vazar o arquivo. A quebra de sigilo ensejará em multas financeiras,
queima do saldo de metros quadrados via WINF Precision™ e revogação das automações 
sociais do autorizado (órbita digital confiscada remotamente).

================================================================================
APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
================================================================================`;

    setPreviewDoc({
      title: file.title,
      filename: file.fileName,
      content
    });

    setDownloadLogs(prev => [
      { id: Date.now().toString(), fileTitle: file.title, type: 'Visualização', timestamp: 'Agora mesmo' },
      ...prev
    ]);
  };

  const handlePreviewLegalDoc = (docObj: LegalDoc) => {
    if (!hasAccess(docObj.category)) {
      triggerNotification(
        'Acesso Negado',
        'Seu nível societário não possui credencial para visualizar este documento jurídico.'
      );
      return;
    }

    const isSigned = signedDocIds.includes(docObj.id);
    const timestamp = new Date().toLocaleString('pt-BR');
    const signatureStatus = isSigned 
      ? `ASSINADO DIGITALMENTE POR ${user?.name || 'OP'} em ${timestamp}`
      : 'PENDENTE DE ASSINATURA ELETRÔNICA';

    let customDetails = '';

    if (docObj.id === 'report_01') {
      customDetails = `
================================================================================
                                WINF CAPITAL™
================================================================================

DEMONSTRATIVO FINANCEIRO TRIMESTRAL ESTIMADO (Q2/2026)
GERADO EM COOPERAÇÃO COM O CONSELHO DE GOVERNANÇA W12

I. DESEMPENHO OPERACIONAL CONSOLIDADO (EBITDA)
1. Faturamento Bruto Estimado Rede Nacional: BRL 12.8M (Giro BlackShop™)
2. Custo de Importação e Logística (Insumos): BRL 4.2M
3. Margem de Arbitragem Bruta: BRL 8.6M (67.1% de Spread)
4. Despesas Centrais de Branding e Ads: BRL 1.1M
5. Provisão de Impostos e Licenciamento CVM: BRL 0.8M
6. Lucro Líquido Distribuível Estimado (EBITDA): BRL 6.7M

II. RATIO DE DISTRIBUIÇÃO CORPORATIVA SÓCIOS OCCULTOS
- Pool Principal (AeroCore Hubs regionalizado): 45% (BRL 3.01M)
- Fracionamento Asset Light (100 quotas validadas): 35% (BRL 2.34M)
- Reinvestimento em Tráfego de Aquisição Base: 15% (BRL 1.0M)
- Fundo de Reserva Técnica Contra Riscos de Câmbio: 5% (BRL 0.35M)

III. PROJEÇÃO DE RETORNO POR COTA ATIVA
- Retorno Médio por Cota Padrão Asset-Light (R$ 15k): BRL 1,250.00 a BRL 1,890.00 mensal.
- Rendimento percentual equivalente aproximado: 8.3% a 12.6% a.m. (Lastro real de queima de m²).`;
    } else if (docObj.id === 'report_02') {
      customDetails = `
================================================================================
                                WINF CAPITAL™
================================================================================

RELATÓRIO E MAPA GERAL DO POOL DE RENDIMENTOS (YIELD DISTRIBUTION - Q1/2026)

I. METRICS DO PROTOCOLO SINF-CHAIN DE APURAÇÃO SENSORIAL
- Total de Películas Nano-Cerâmicas Homologadas e Instaladas: 14,820 m²
- Valor Total do Spread Gerado por m² (Média Ponderada): BRL 180.00/m²
- Volume Financeiro Total Gerado por Ativações e Queima de Bobina: BRL 2.66M

II. RETRIBUÍDO POR REGIÕES MASTERS (W12 ATIVAS)
- Região 01 (Santos - Central Piloto): BRL 420,000.00 pagos ao conselheiro regional.
- Região 02 (São Paulo - Jardins Studio): BRL 780,000.00 pagos ao conselheiro regional.
- Região 03 (Nordeste Hub - Recife/Salvador): BRL 310,000.00 pagos ao conselheiro regional.

III. CONSOLIDAÇÃO DE PAGAMENTOS E CALENDÁRIO COMERCIAL
Todos os repasses foram auditados via Ledger Central Criptografado e depositados diretamente nas carteiras integradas das 3 Unidades Asset Light Penetration validadas na praça ativa de campo. Isenção total de impostos na pessoa física sob amparo do art. 3º do Decreto-Lei SCP de Participação Unificada.`;
    } else if (docObj.id === 'report_03') {
      customDetails = `
================================================================================
                                WINF CAPITAL™
================================================================================

RELATÓRIO DE AUDITORIA OPERACIONAL E TRANSPARÊNCIA DE INSUMOS DE ENGENHARIA TÉRMICA

I. ESCOPO DA AUDITORIA
Uma auditoria técnica rigorosa foi realizada pela comissão de engenharia WINF Lab nas fábricas de nanotecnologia de película controle solar e PPF importados. 

II. RESULTADOS DOS TESTES DE ESTABILIDADE MOLECULAR
- Proteção Térmica contra Radiação Infravermelha (IR): 99.1% de rejeição estável sob calor extremo simulado de 1500W.
- Barreira de Absorção de Raios Ultravioleta perigosos (UVA/UVB): Bloqueio absoluto de 99.9% (FPS 1000+).
- Estabilidade de Pigmentação Mineral: Desbotamento nulo aferido após 2,000 horas de exposição direta sob espectro de luz ultravioleta pesada.

III. DEFERIMENTO E HOMOLOGAÇÃO SOCIETÁRIA
A holding WINF Partners™ declara todas as bobinas originais de Window Film da BlackShop™ 100% em conformidade com o padrão aeroespacial de qualidade. As unidades ativas estão autorizadas a emitir o Certificado de Garantia Termo-Criptográfico via blockchain WINF OS™.`;
    } else if (docObj.id === 'alpha_01') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

CIRCULAR DE OFERTA DE FRANQUIA (COF) – MODELO FRANCHISE-AS-A-SERVICE (FAAS)
EM CONFORMIDADE COM A LEI FEDERAL Nº 13.966/19

I. PREÂMBULO E HISTÓRICO DA HOLDING
A WINF Partners™ é uma holding de inovação conectada, logística e infraestrutura digital baseada no ecossistema do Universo Dark. Rompendo definitivamente com o paradoxo do franchising tradicional dos anos 90, a WINF Partners™ atua como fornecedora e facilitadora de órbita digital pré-provisionada, eliminando por completo a cobrança de royalties ou taxas de publicidade sobre o faturamento brutoo ou sobre a mão de obra dos licenciados locais. A rentabilidade estrutural da holding é sustentada estritamente pelo ganho de escala, importação global e arbitragem na cadeia de suprimentos da BlackShop™.

II. NATUREZA DO MODELO ASSET-LIGHT
O modelo Franchise-as-a-Service (FaaS) consiste na entrega imediata das estruturas digitais de campo da unidade (automações de atendimento, chaves de API e canais de tráfego local). O operador regional atua na execução técnica sob demanda, operando com uma estrutura enxuta de altíssima rentabilidade.

III. ESPECIFICAÇÕES DO AGENTE COGNITIVO COMERCIAL W-NO (Núcleo Operacional)
A WINF Partners™ concede ao licenciado o direito de uso e conexão ao W-NO (Núcleo Operacional), um Agente de Inteligência Artificial Cognitivo com córtex conversacional próprio que assume 100% da linha de frente comercial nativa através do WhatsApp da unidade. A IA realiza de forma autônoma a triagem, áudio-sumarização, quebra de objeções baseada no algoritmo ParadoxAnalysis para o público de alta renda, e o agendamento automatizado de Ordens de Serviço (OS) diretamente no ecossistema de software WINF OS™.

IV. DISPOSIÇÕES FINANCEIRAS E RECOMPRA DE INSUMOS
1. Taxa Única de Ativação Territorial: R$ 15.000,00 (Quinze mil reais), sem taxas de renovação periódica.
2. Royalties Operacionais sobre Aplicação: 0% (Zero por cento).
3. Fundo de Propaganda Centralizado: 0% (Zero por cento).
4. Abastecimento Obrigatório: O licenciado obriga-se a adquirir insumos e bobinas de Window Film exclusivamente via BlackShop™, sujeitando-se às constantes de mercado das linhas Black, Dual Reflect e Invisible Nano-Cerâmica Premium.

V. DECLARAÇÃO DE CIÊNCIA E ACORDO DE TRAVA DIGITAL
O licenciado declara plena ciência de que o sistema WINF OS™ audita o saldo de metros quadrados ($m²) das bobinas via Blockchain através da calculadora WINF Precision™. A detecção de uso de películas paralelas ou piratas não-homologadas resulta na queima imediata do lote criptografado, bloqueio remoto do software de campo e confisco temporário de toda a órbita digital ativa (redes sociais, automações de atendimento e subdomínios controlados centralizadamente pela holding).`;
    } else if (docObj.id === 'alpha_02') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

CONTRATO DE CONCESSÃO DE LICENÇA TERRITORIAL, SUPORTE TECNOLÓGICO E INFRAESTRUTURA FAAS

CONTRATANTE: WINF PARTNERS HOLDING LTDA.
CONTRATADO: ${user?.name || '[NOME DO LICENCIADO]'}

CLÁUSULA PRIMEIRA – DO OBJETO
O presente instrumento regula a outorga de direito de exploração comercial e custódia de 1 (um) território exclusivo dentre o lote escasso de 100 (cem) unidades estratégicas mapeadas pela CONTRATANTE, com cessão temporária de acesso às APIs do software WINF OS™ e ao Agente Comercial Autônomo W-NO (Núcleo Operacional).

CLÁUSULA SEGUNDA – DAS TRÊS SUB-MODALIDADES DE OPERAÇÃO
O CONTRATADO deverá obrigatoriamente enquadrar sua praça de campo em uma das três sub-modalidades de ativação aceitas pelo ecossistema:
A) APLICADOR PROFISSIONAL SOLO: Operação executada estritamente por 1 Pessoa + Inteligência Artificial Cognitiva. O profissional foca na aplicação técnica enquanto o W-NO gerencia 100% da frente comercial.
B) INVESTIDOR COM MÃO DE OBRA TERCEIRIZADA (GESTÃO EXECUTIVA): O Investidor assume o relacionamento de alto padrão, o atendimento e a gestão administrativa via painel do WINF OS™; a força técnica é executada por profissionais parceiros treinados e certificados pela WINF Academy, sendo remunerados ESTRITAMENTE POR METRO QUADRADO ($m²) INSTALADO, eliminando folhas de pagamento fixas.
C) INVESTIDOR PADRINHO (ANJO OPERACIONAL): O Investidor de capital financia o aporte de ativação para um aplicador de elite selecionado pela WINF Partners que não dispunha do capital inicial Asset-Light, dividindo os resultados operacionais conforme o Acordo Anjo complementar.

CLÁUSULA TERCEIRA – DA ISENÇÃO DE ROYALTIES E RASTREABILIDADE
Não incidirão taxas ou royalties sobre o faturamento de serviços do CONTRATADO. O lastro financeiro da holding reside na recompra de bobinas nanotecnológicas na BlackShop™, com consumo auditado em tempo real pelo algoritmo de saldo decrescente integrado à calculadora WINF Precision™.

CLÁUSULA QUARTA – DO LASTRO DE VALIDAÇÃO (PADRÃO SANTOS)
O CONTRATADO declara compreender que todas as estimativas de viabilidade comercial utilizam como âncora a métrica estável da unidade piloto de Santos: dedicação focal de 6 horas semanais de aplicação prática, vazão média de 100 a 200 metros lineares de película por mês e alvo preditivo estável de R$ 300.000,00 anuais de faturamento por território.`;
    } else if (docObj.id === 'gamma_02') {
      customDetails = `
================================================================================
                               WINF PARTNERS™
================================================================================
           DOCUMENTAÇÃO MATRIZ INTERNA // ARSENAL TÁTICO MAW
           
DOCUMENTO 07: ESTATUTO DE ADMISSÃO E CONSELHO MASTERS W12
RESTRITO: PRODUTO GAMMA (CADEIRAS DE INFRAESTRUTURA E MÉRITO MÁXIMO)

01. ESTRUTURA DO CONSELHO W12
O conselho de alto nível W12 é composto por exatamente 12 (doze) cadeiras diretivas estratégicas e exclusivas: duas cadeiras pertencentes aos sócios fundadores originais da holding e dez cadeiras abertas a grandes players investidores do Produto Gamma ou operadores de elite que dominam o ranking nacional de mérito técnico da plataforma (\`w_rank_xp\`).

02. MODELO DE PARTICIPAÇÃO REGIONAL EM ROYALTY ZERO
O parceiro conselheiro participante assume a concessão para a instalação e replicação física de uma Flagship Matriz Regional. Em contrapartida, adquire o direito irrevogável de recebimento sob demanda de uma participação nos dividendos e spread de repasse de metros quadrados de película movimentados dentro de toda a sua jurisdição macrorregional acordada.

03. MEMORIAL DESCRITIVO DE DESIGN (LOFT INDUSTRIAL RÚSTICO)
O concessionário compromete-se por este estatuto a obedecer rigidamente o manual arquitetônico oficial da marca WINF AeroCore™: instalações físicas de alto padrão projetadas imitando lofts industriais premium (uso rústico de concreto bruto lapidado, tijolos escurecidos aparentes, tubulações expostas, iluminação cinematográfica cênica em LED e supercarros de alta performance expostos em baias de salão de design).

04. CALENDÁRIO SEMESTRAL DE CONVENÇÕES E PRIVATE EQUITY
Os conselheiros realizarão reuniões deliberativas semestrais de forma presencial na sede matriz oficial para tratar de alinhamentos táticos, planejamento de valuation de mercado, auditar as contas e fluxos de importação da BlackShop™ e homologar novas frentes de expansão e branding internacional (M&A).

--------------------------------------------------------------------------------
APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
© 2026 WINF Partners™ | AeroCore™ Asset Ecosystem. Todos os direitos reservados.
Lei nº 9.279/96 e Lei nº 9.609/98.`;
    } else if (docObj.id === 'alpha_04') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

TERMO DE USO WINF OS™ E ANUÊNCIA DE TRAVA DIGITAL (EULA AGREEMENT)

CLÁUSULA PRIMEIRA – DA LICENÇA DE SOFTWARE E CONTROLADORA
Este termo rege o licenciamento de uso do software integrado WINF OS™ e suas funcionalidades conexas, incluindo o checkout WINF Precision™ e o gerenciamento de canais via W-NO (Núcleo Operacional). O software é fornecido na modalidade de Licenciamento de Infraestrutura Corporativa (WINF OS™) enquanto o licenciado mantiver suas obrigações ativas e adimplência de suprimentos originais da BlackShop™.

CLÁUSULA SEGUNDA – DO FUNCIONAMENTO DA TRAVA DE SALDO DECRESCENTE
Cada bobina adquirida possui um hash identificador exclusivo registrado no banco de dados com saldo em metros quadrados ($m²). O robô de corte desconta em tempo real do saldo cada mapa de corte executado.
Ao atingir saldo zero ($0m²), a chave autorizadora da bobina é revogada na blockchain WINF, bloqueando a emissão de novos Certificados de Garantia Digitais para aquela bobina.

CLÁUSULA TERCEIRA – DA PENALIDADE ANTI-PIRATARIA E QUEIMA DE LOTE
Qualquer adulteração no firmware de leitura, uso de películas paralelas ou re-autenticação fraudulenta de lotes importados sem recolhimento de spread na BlackShop™ resultará na queima permanente da chave do autorizado, com travamento remoto do WINF OS™ e confisco preventivo das chaves do WhatsApp W-NO™ e redes sociais, desviando os leads de volta para a holding Central.`;
    } else if (docObj.id === 'alpha_05') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

ACORDO DE PARCERIA OPERACIONAL – INVESTIDOR-PADRINHO (ANJO OPERACIONAL)

Este termo regula o consórcio cooperativo entre o Investidor Padrinho (Aporte Financeiro de Ativação) e o Aplicador de Elite Certificado pela WINF Academy (Mão de Obra e Gestão de Campo).

CLÁUSULA PRIMEIRA – DOS APORTES E ATIVOS
O Investidor Padrinho financia integralmente o custo de ativação territorial FaaS (R$ 15.000,00) e o primeiro lote padrão de bobinas nanotecnológicas adquirido na BlackShop™. O software de monitoramento e o controle financeiro WINF OS™ fornecem transparência bilateral de faturamento e queima de m² em campo.

CLÁUSULA SEGUNDA – DA DIVISÃO OPERACIONAL DE RESULTADOS
Os lucros líquidos apurados na operação local do território serão distribuídos de forma autografável na proporção acordada entre as partes (padrão sugerido: 50% Investidor / 50% Aplicador), após o ressarcimento dos custos fixos de insumos repostos via distribuidora central.

CLÁUSULA TERCEIRA – DA GOVERNANÇA E CONTROLE SOCIEDADE
As partes submetem quaisquer controvérsias ao comitê de concórdia do Conselho W12 da WINF Partners™, que atuará como mediador com poder de bloqueio digital temporário do software em caso de quebra de acordo operacional.`;
    } else if (docObj.id === 'kiosk_03') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

MANUAL EXECUTIVO DE PADRONIZAÇÃO FÍSICA E DESIGN VISUAL DO QUIOSQUE (HUB VR)

CLÁUSULA PRIMEIRA – ESCOPO VISUAL E SHOWROOM IMERSIVO
O Quiosque de captação rápida WINF™ é projetado para atuar em corredores e centros comerciais Triple-A. Deve conter obrigatoriamente um nicho cênico de experimentação high-tech composto por óculos de Realidade Virtual (VR) para exibição do showroom de películas em alta definição 3D e um totem de autoatendimento interativo.

CLÁUSULA SEGUNDA – PADRONIZAÇÃO DO TOTEM E TERMINAL COGNITIVO
O totem interativo do quiosque conecta-se à API nativa do W-NO Totem, permitindo ao potencial cliente realizar a triagem preliminar de seu veículo ou projeto arquitetônico de luxo. Os dados captados criam a imediata Ordem de Serviço no Firebase, disparada para o WhatsApp do autorizado local.

CLÁUSULA TERCEIRA – MEMORIAL DE ENGENHARIA PARA ARQUITETURA
O designer do quiosque deverá seguir as diretrizes escuras da WINF Partners™: iluminação em painéis de LED vermelho escuro, carcaça em aço carbono preto fosco, piso vinílico escurecido e suportes ergonômicos em alumínio polido.`;
    } else if (docObj.id === 'beta_02') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

CONTRATO DE SOCIEDADE EM CONTA DE PARTICIPAÇÃO (SCP) – POOL DE LIQUIDEZ BLACKSHOP™

SÓCIO OSTENSIVO: WINF PARTNERS HOLDING LTDA.
SÓCIO PARTICIPANTE: ${user?.name || '[NOME DO INVESTIDOR COTISTA]'}

CLÁUSULA PRIMEIRA – DA APORTAÇÃO E FINALIDADE (POOL DE LIQUIDEZ)
O Sócio Participante aporta o capital mínimo de R$ 50.000,00 (Cinquenta mil reais) na infraestrutura de importação compartilhada da BlackShop™. O montante destina-se exclusivamente ao adiantamento de mercadorias nanotecnológicas e fitas de PPF junto aos fabricantes asiáticos credenciados.

CLÁUSULA SEGUNDA – RETENÇÃO DE REINVESTIMENTO AUTOMÁTICO PARA GOOGLE ADS
Uma porcentagem fixa de 10% (dez por cento) do spread bruto obtido com a comercialização de bobinas para a rede nacional de autorizados é retida automaticamente pela holding e direcionada exclusivamente para tráfego pago geolocalizado (Ads de Alta Conversão no Google e Instagram) nas praças ativas de campo.

CLÁUSULA TERCEIRA – RETORNO E DIVIDENDOS (ROI PROJETADO)
Os lucros decorrentes das vendas e queima física de bobinas na distribuidora serão apurados e repassados trimestralmente na forma de dividendos na conta do Sócio Participante. Margens operacionais projetadas atingem de 24% a 36% ao ano, lastreadas na escala real de queima de m² do WINF Precision™.`;
    } else if (docObj.id === 'beta_04') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOSSIÊ DE TRANSPARÊNCIA E TABELA DE CUSTOS (ANEXO DE SCP - PRODUTO BETA)

CLÁUSULA PRIMEIRA – DA IMPORTAÇÃO E ARBITRAGEM
A distribuidora BlackShop™ opera importação em larga escala de películas nanotecnológicas do mercado asiático. O spread societário bruto destina-se totalmente a lastrear o pool de rendimentos Beta de forma indexada e imune a oscilações inflacionárias internas.

CLÁUSULA SEGUNDA – TABELA OFICIAL DE REPASSE POR m² E BOBINAS (1,52M X 30M)
Abaixo constam as referências imutáveis de faturamento de insumos junto à matriz:
- Série BlackPro (Privacidade automotiva premium): Custo FOB: R$ 12,50/m² | Spread Matriz: R$ 22,50/m² | Repasse Licenciado: R$ 35,00/m².
- Série Dual Reflect (Arquitetura e controle térmico): Custo FOB: R$ 18,00/m² | Spread Matriz: R$ 27,00/m² | Repasse Licenciado: R$ 45,00/m².
- Série Invisible (Escudo térmico total): Custo FOB: R$ 25,00/m² | Spread Matriz: R$ 40,00/m² | Repasse Licenciado: R$ 65,00/m².

CLÁUSULA TERCEIRA – TRAVA DE REINVESTIMENTO AUTOMÁTICO EM TRÁFEGO
Compulsoriamente, 10% de todo o spread faturado com a distribuição de bobinas é provisionado para campanhas automáticas de tráfego pago geolocalizado do território adquirente via conexões de API integradas no software WINF OS™.`;
    } else if (docObj.id === 'alpha_07') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

MANUAL DE ONBOARDING E ROADMAP OPERACIONAL (CONCESSÃO - PRODUTO ALPHA)

CLÁUSULA PRIMEIRA – TAXA DE ATIVAÇÃO E REPASSE DE INSUMOS
Após compensação da Taxa de Ativação Territorial (R$ 15.000,00), o licenciado recebe um pacote inicial contendo 7,50 metros lineares das três tecnologias de elite (Dual Reflect, BlackPro e Invisible), gerando cerca de 11m² de área aplicável sob o controle rígido do WINF Precision™.

CLÁUSULA SEGUNDA – PROVIMENTO E ENTREGA DA ESTRUTURA DIGITAL (48 HORAS)
A holding WINF Partners™ ativa em até 48 horas a infraestrutura "Turn-Key" do licenciado, composta por:
- E-mail profissional e Google Workspace dedicado.
- Configuração de SEO local com Google Meu Negócio.
- Subdomínio personalizado (ex: suacity.winfpartners.com) focado em alta conversão.
- WhatsApp Business configurado com a inteligência artificial W-NO (Núcleo Operacional) para triagem e agendamento automático.

CLÁUSULA TERCEIRA – SUPORTE TÉCNICO E CAPACITAÇÃO
O licenciado recebe treinamento da WINF Academy para focar unicamente na fidelidade e zelo de aplicação, recebendo auxílio contínuo assistido 24 horas via IA conjugada e engenharia humana.`;
    } else if (docObj.id === 'alpha_08') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 12: PROCEDIMENTO OPERACIONAL PADRÃO (POP) – IMPLANTAÇÃO TURN-KEY ALPHA

GATILHO INICIAL: Confirmação do pagamento de R$ 15.000,00 e recebimento do Formulário de Ativação Territorial preenchido.
PRAZO DE ENTREGA: 48 horas impreterivelmente.

CLÁUSULA PRIMEIRA – INFRAESTRUTURA DE IDENTIDADE (E-MAIL E WORKSPACE)
O responsável técnico de TI acessa o Painel de Administrador do Google Workspace da holding e cria uma conta de e-mail corporativo exclusivo no formato padronizado de nomenclatura cidade@winfpartners.com (Ex: santos@winfpartners.com). Como procedimento obrigatório, gera-se uma senha provisória padrão (ex: Winf2026*cidade) configurada com necessidade de alteração de senha no primeiro acesso. Configure também os aliases e grupos necessários para o direcionamento unificado das notificações operacionais.

CLÁUSULA SEGUNDA – PRESENÇA WEB (SUBDOMÍNIO E LANDING PAGE LOCAL)
No painel de gerenciamento DNS do Cloudflare da WINF Partners, cria-se um registro do tipo CNAME apontando cidade.winfpartners.com para o servidor matriz. Duplica-se a Landing Page Matriz Alpha no CMS, ajustando os textos sonoros locais (por exemplo, "Películas de Nanotecnologia e Proteção Térmica em Santos"). O CTA (botão de chamada principal) deve ser apontado para o link da API do novo WhatsApp Business da unidade, certificando o funcionamento do SSL HTTPS.

CLÁUSULA TERCEIRA – DOMÍNIO ORGÂNICO LOCAL (GOOGLE MEU NEGÓCIO)
Sob o perfil de empresa master da holding, cadastra-se a unidade filial utilizando o padrão: "Winf Partners - Películas Premium - [Nome da Cidade]". Define-se a categoria adequada, a área de cobertura autorizada no contrato e inicia-se o upload da identidade visual monocromática AeroCore™ em Preto e Branco (supercarros, aplicações e estúdios físicos rústicos). Dispara-se o gatilho de validação cadastral do Google.

CLÁUSULA QUARTA – VITRINES DIGITAIS E TRÁFEGO GEOLOCALIZADO
Criação do perfil no Instagram @winf.cidade integrado de forma unificada à página do Facebook correspondente. Aplicação de identidade corporativa limpa de alto padrão e publicação da grade conceitual inicial de 6 a 9 posts da Linha Select™. Tráfego geolocalizado é configurado focando bairros nobres e condomínios de alto padrão da cidade, lastreado na verba inicial de 10% do spread societário de bobinas.

CLÁUSULA QUINTA – INTEGRALIZAÇÃO COGNITIVA (WHATSAPP BUSINESS E IA W-NO (Núcleo Operacional))
Pareamento do dispositivo de WhatsApp do licenciado via QR Code gerado pelas ferramentas de API (Firebase/Evolution API). Injeção do Prompt com Território Variável de bairros autorizados e Tabela de Custos e Margens gerados pela calculadora WINF Precision™. São efetuados testes de simulação de quebra de objeções de calor (90% de infravermelho) e agendamento de OS no sistema WINF OS™ para garantir tempo de atendimento zero.`;
    } else if (docObj.id === 'beta_05') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 10: ROADMAP DE TRAÇÃO, TRANSPARÊNCIA E GOVERNANÇA DE APORTE (V2)

CLÁUSULA PRIMEIRA – DIRETRIZES DE ALOCAÇÃO IMEDIATA DE CAPITAL (PÓS-APORTE)
Após a integralização e compensação do aporte na conta escrow institucional do ecossistema, os recursos serão direcionados imediatamente para as seguintes frentes de escoamento tático de mercado:
- Pedidos Oficiais Diretos com o Fabricante: Abertura de lotes de importação aduaneira direta com fabricantes de nanotecnologia na Ásia, reuniões do Conselho Masters W12, e escaninhos para as bobinas de PPF importadas FOB.
- Tração de Marketing e Tráfego Local: Direcionamento estratégico de verba publicitária para o portal central e divisão parametrizada por código para os subdomínios de cada território ativo, alimentando a IA W-NO (Núcleo Operacional) com leads de alto ticket na ponta.
- Enxoval de Apoio Comercial BlackShop™: Produção e fornecimento exclusivo de materiais gráficos (flyers), janelas físicas de amostras, toalhas personalizadas e uniformes profissionais. A venda interna desses insumos para a rede gera uma linha secundária de faturamento e lucro líquido para o Pool de Liquidez.

CLÁUSULA SEGUNDA – INFRAESTRUTURA FUNDACIONAL E VALIDAÇÃO DOS FUNDADORES
Para assegurar risco zero ao investidor em relação a ativos físicos primários, os fundadores assumem integralmente o desenvolvimento e validação da estrutura inicial de rede:
- Operação Matriz Conceitual: O primeiro Quiosque institucional, o Estúdio AeroCore™ físico, o Centro de Armazenamento e o Hub de Processamento e Treinamento Técnico da WINF Academy serão bancados e geridos inteiramente pelos fundadores originais.
- Escalabilidade de Modelos Validados: Uma vez consolidadas as métricas operacionais e a rotina de faturamento da matriz, a holding iniciará a comercialização nacional dos modelos de Quiosque e Flagship para investidores de larga escala.

CLÁUSULA TERCEIRA – MATRIZ DE CENÁRIOS DE APORTE E RETORNO FINANCEIRO
Simulação preditiva dividida em três níveis de alocação de capital e suas respectivas métricas de liquidez corporativa:
- Cenário A (Operação Base): R$ 50.000,00 | Destinação tática: Financiamento de rolos iniciais Select™ e ativação de anúncios em até 25 subdomínios de praças polo. Payback: 14 a 16 meses | Retorno planejado: 24% ao ano (Repasses líquidos trimestrais).
- Cenário B (Escala Moderada): R$ 100.000,00 | Destinação tática: Importação direta de contêiner fracionado, produção de merchandising e tráfego focado em 50 praças. Payback: 11 a 13 meses | Retorno planejado: 30% ao ano (Impulsionado por vendas BlackShop™).
- Cenário C (Aceleração Máxima): R$ 250.000,00 | Destinação tática: Importação institucional massiva, estoque regulador nacional de PPF e barreira agressiva de SEO macro. Payback: 8 a 10 meses | Retorno planejado: 36% ao ano (Máxima eficiência aduaneira).

CLÁUSULA QUARTA – GOVERNANÇA, PAYOUTS E MÉTRICAS DE SAÍDA (EXIT)
- Transparência por Código (WINF Precision™): O cotista audita o giro comercial através de um painel analítico com registros digitais integrados à Blockchain. Cada m² de película aplicado em campo deduz automaticamente o estoque do pool e provisiona os lucros reais, garantindo auditoria em tempo real e blindagem em conta escrow corporativa.
- Engenharia de Payouts Trimestrais: Consolidação de resultados e distribuição de lucros realizada de forma líquida e recorrente no encerramento de cada trimestre. Pela estrutura jurídica de SCP (Art. 991 do Código Civil), os repasses ao Sócio Oculto são isentos de tributação na fonte.
- Métricas de Saída Estruturadas (Exit Strategies): Ficam instituídas três janelas claras de liquidez para a retirada ou recompra do capital principal:
    * Janela A (Holding Buyback): Direito de preferência da WINF Partners para recomprar a cota após o período de Payback com prêmio de valorização.
    * Janela B (Liquidação de Estoque): Solicitação de retirada com aviso prévio de 90 dias, sendo o principal liquidado conforme o escoamento aduaneiro físico das bobinas vinculadas.
    * Janela C (Transferência Restrita): Venda autorizada das cotas para terceiros investidores qualificados, mediante aprovação prévia e homologação do Conselho Masters W12.`;
    } else if (docObj.id === 'gamma_05') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 11: PLANO DE EXPANSÃO MACRO, GATILHOS DE ESCALA E EXIT STRATEGY (M&A)

CLÁUSULA PRIMEIRA – O ENXOVAL DE ENTREGA EXCLUSIVA AO INVESTIDOR (UNIVERSO DARK)
O investidor participante do ecossistema privado é integrado de forma nativa a uma infraestrutura corporativa de elite de controle patrimonial, recebendo os seguintes ativos operacionais de entrega imediata:
- Acesso ao Dashboard Exclusivo Universo Dark: Painel analítico criptografado que centraliza os dados brutos de faturamento aduaneiro. Disponibilização contínua de relatórios mensais automáticos de auditoria e balanços de escoamento.
- Conta de E-mail Profissional Corporativo: Provisionamento de conta dedicada sob domínio corporativo oficial da holding para comunicações criptografadas de alta governança.
- Biblioteca de Manuais e Dossiês de Transparência: Entrega e homologação de toda a coletânea confidencial (COF, Manuais e Atas do Conselho Masters W12) para alinhamento e blindagem de compliance.

CLÁUSULA SEGUNDA – EXPANSÃO GEOPOLÍTICA E SELEÇÃO DE CIDADES POLO
A escalabilidade territorial do ecossistema foi projetada sob uma matriz matemática de escassez reversa calculada sobre o território nacional:
- O Tabuleiro das 5.570 Cidades: O território brasileiro conta com exatamente 5.570 municípios. O planejamento estratégico veda a pulverização massiva da marca; a controladoria filtra e seleciona unicamente as cidades polo com maior densidade de PIB real, condomínios Triple-A e frotas concentradas de supercarros.
- Monopólio Territorial por API: À medida que estas praças polo de alto rendimento são ocupadas por licenças Asset-Light ou Quiosques, o sistema WINF OS™ bloqueia as chaves de API daquela região, assegurando monopólio territorial absolut ao operador e fluxo inelástico de insumos à distribuidora BlackShop™.

CLÁUSULA TERCEIRA – TRAÇÃO EM ESCALA DINÂMICA: QUIOSQUES E MODELOS ASSET-LIGHT
O crescimento geométrico de volume é estruturado por meio de duas ondas consecutivas de tração e comercialização comercial:
- Onda 01: Venda Massiva de Licenças Asset-Light (Produto Alpha): Injeção capilar rápida de operadores autônomos em campo para queima de metros quadrados de película nanotecnológica, acelerando a receita recorrente logística da distribuidora sem gerar custos fixos estruturais de ponto para a holding.
- Onda 02: Disseminação de Quiosques e Estúdios Físicos: Lançamento planejado das unidades franqueadas de Quiosques Tecnológicos e Hubs Imersivos de VR em shoppings e centros comerciais estratégicos de alta renda, atuando como vitrines institucionais magnéticas de alto ticket.

CLÁUSULA QUARTA – ROADMAP DE INTERNACIONALIZAÇÃO E EXIT STRATEGY (M&A)
A visão terminal da WINF Partners é focada em um evento definitivo de liquidez global via Private Equity, estruturado em três fases progressivas de Valuation:
- Fase 1: Domínio Nacional: Consolidação das praças polo selecionadas no Brasil via modelos Asset-Light e Quiosques, travando a exclusividade da cadeia aduaneira BlackShop™. ARR massiva, previsível e auditada em Blockchain.
- Fase 2: Internacionalização: Exportação do modelo FaaS (Franchise-as-a-Service) e das licenças digitais do WINF OS™ para mercados selecionados das Américas e Europa. Faturamento em moedas fortes (Dólar/Euro).
- Fase 3: Evento de Saída M&A: Abertura de negociação de fusão ou venda de participação majoritária de holding diretamente a fabricante asiático. Liquidez Máxima (Exit) com prêmio de valorização astronômico, multiplicando o capital principal.`;
    } else if (docObj.id === 'alpha_09') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 13: MANUAL DE POSICIONAMENTO DIGITAL, CURADORIA VISUAL E DIRETRIZES DE MÍDIA

CLASSIFICAÇÃO: DIRETRIZES DE EXECUÇÃO PARA REDES SOCIAIS, OTIMIZAÇÃO DE SEO LOCAL E PROVIMENTO DE CATÁLOGOS CORPORATIVOS

CLÁUSULA PRIMEIRA – IDENTIDADE VISUAL BASE E POSICIONAMENTO ULTRA-PREMIUM
A comunicação e a linha editorial das praças territoriais autorizadas WINF Partners devem seguir rigorosamente a estética de alta sofisticação do "Universo Dark". O posicionamento tático visa extinguir de forma absoluta a percepção de mercado de "oficina comum de insulfilm", elevando a unidade local ao patamar de estúdio de engenharia térmica e curadoria digital de alta performance.
Todos os conteúdos gráficos, fotos e criativos devem priorizar enquadramentos limpos, iluminação cinematográfica e ambientes que remetam ao padrão arquitetônico loft industrial rústico (concreto bruto, tijolo aparente) associados a supercarros ou residências Triple-A.

CLÁUSULA SEGUNDA – ENGENHARIA DO FEED HÍBRIDO (INSTAGRAM E FACEBOOK)
A grade de postagens (Grid) das unidades locais deve operar de forma simétrica e intercalada, equilibrando autoridade corporativa com forte apelo aspiracional de consumo:
- Criativos Padrão Institucionais (Templates Fixos): Publicações em formato estático ou carrossel utilizando o acervo limpo e de alta conversão fornecido pela matriz. Foco em chamadas de impacto direto no problema do calor extremo ("MAIS LUZ, MENOS CALOR", "O PODER QUE VOCÊ NÃO VÊ, MAS SENTE"), intercaladas com posts de autoridade nacional destacando executivos e curadores da holding (Henrique Uchôa, Mirella Noir).
- Conteúdo Dinâmico em Vídeo (Reels e Bastidores): Captação em alta definição registrando os processos reais de instalação nas residências e veículos nobres da cidade ativa. A narrativa deve enfatizar os bastidores, o cuidado extremo com o patrimônio do cliente e a precisão do corte cirúrgico das películas originais, induzindo o lead final a projetar e desejar aquela mesma transformação em seu ambiente.
- Estruturação Estrita de Destaques (Highlights): Elementos fixos no topo do perfil que atuam como a vitrine de fechamento e quebra de objeções. Devem ser segmentados estritamente em quatro blocos:
  1. TECNOLOGIA: Explicação molecular do bloqueio de até 100% UV e 90% IR da Linha Select™.
  2. PORTFÓLIO: Amostragem real das séries Dual Reflect, BlackPro e Invisible aplicadas em campo.
  3. EXPERIÊNCIA: Provas sociais e depoimentos de clientes (Case "Carla - Refúgio Confortável").
  4. AGENDAMENTO: Gatilho de direcionamento automático para a conversão via IA W-NO (Núcleo Operacional).

CLÁUSULA TERCEIRA – PARAMETRIZAÇÃO DO GOOGLE MEU NEGÓCIO (SEO LOCAL)
A ficha geolocalizada no Google Maps constitui o canal primário de captura de leads orgânicos de alta urgência na praça licenciada.
PROTOCOLO DE ALIMENTAÇÃO:
- Acervo de Imagens Geotagged: Utilizar unicamente a coleção de mídias otimizada para o Google Business. Todas as imagens enviadas ao painel devem obrigatoriamente conter metadados de geolocalização ativos apontados para o perímetro territorial contratado, blindando a área de buscas contra interferências externas.
- Atualizações Semanais: Replicar as postagens institucionais de bloqueio térmico e proteção solar na aba de atualizações e ofertas do Google, mantendo o algoritmo indexado no topo das pesquisas locais.

CLÁUSULA QUARTA – ESTRUTURAÇÃO DO CATÁLOGO CORPORATIVO (WHATSAPP BUSINESS)
A qualificação e o fechamento automático realizados pelo N.O. (Núcleo Operacional) (Núcleo Operacional) devem ser amparados pelo catálogo oficial de produtos do aplicativo comercial. O Squad de Operações deve configurar os itens com mídias quadradas dedicadas e especificações técnicas idênticas à matriz:
- Linha Select™: Dual Reflect
  * Especificação Visual da Mídia: Fotografia conceito de fachadas corporativas ou residências modernas com luz natural e reflexo refinado.
  * Cópia Descritiva Técnica: Película de controle solar e engenharia térmica de alta refletividade externa. Rejeição extrema de calor infravermelho e equilíbrio estético perfeito para grandes panos de vidro arquitetônicos.
- Linha Select™: BlackPro
  * Especificação Visual da Mídia: Foto close-up de vidros automotivos hiper-premium ou ambientes internos preservados em total escuridão tática.
  * Cópia Descritiva Técnica: Privacidade absoluta e alta escuridão interna sem perda de visibilidade de dentro para fora. Bloqueio maciço contra raios UV e calor, desenhado para o segmento automotivo de elite.
- Linha Select™: Invisible
  * Especificação Visual da Mídia: Fotografia conceito de escritórios ou salas de estar limpas, banhadas por sol intenso, sem alteração na cor do vidro.
  * Cópia Descritiva Técnica: Escudo de proteção térmica invisível. Máxima rejeição de calor através de tecnologia nanocerâmica molecular sem alterar a transparência original do vidro e a iluminação natural do ambiente.

CLÁUSULA QUINTA – LOGÍSTICA DO ARSENAL TÁTICO MAW SEMANAL
A distribuição e o fornecimento contínuo de novas peças publicitárias ocorrem através da central da holding. O time interno de design e tráfego tem o dever de abastecer o painel do Arsenal Tático MAW de cada praça parceira até o último dia útil de cada semana, disponibilizando os criativos fatiados, roteiros validados de Reels e orientações de lances de Ads para que o operador local execute a queima eficiente de estoque sem fricção operacional.`;
    } else if (docObj.id === 'alpha_10') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 10: ARSENAL DE PITCHES DE ALTA CONVERSÃO E PLANO DE EXECUÇÃO DE 7 DIAS

I. CRONOGRAMA DE ATIVAÇÃO TÁTICA (DIA 1 AO DIA 7)
- DIA 01: Setup da Infraestrutura Digital (Cloudflare, CNAME e Google Workspace dedicado).
- DIA 02: Homologação do Whatsapp via Evolution API e instanciação do N.O. (Núcleo Operacional) (Núcleo Operacional).
- DIA 03: Ativação das redes sociais locais (@winf_[cidade]) e publicação das matrizes conceituais d'O Universo Dark.
- DIA 04: Configuração e deploy do Google Meu Negócio estruturado com geotags nas fotos da unidade.
- DIA 05: Integração da calculadora WINF Precision™ e sincronização de saldo decrescente.
- DIA 06: Testes práticos de triagem mecânica e simulações com o robô de combate de calor.
- DIA 07: Lançamento oficial e atração do funil de anúncios geolocalizados nas áreas Triple-A.

II. SCRIPT DE LUXO B2C (FECHAMENTO COM CLIENTE FINAL)
- Triagem Técnica: Foco em TSER (Total Solar Energy Rejection) e não em escuridão.
- Demonstração: Uso do espectrômetro óptico diante do Porsche/BMW do cliente, provando a mentira das películas paralelas baratas.
- Quebra de Objeções: "A Linha Invisible® Series não altera a estética, mas reduz a sensação de forno em até 15ºC. Não gaste combustível forçando o ar-condicionado."`;
    } else if (docObj.id === 'alpha_11') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 11: DIRETRIZ ESTRATÉGICA DE POSICIONAMENTO E MARCA PESSOAL NO LINKEDIN

I. HEADLINE DO PARCEIRO EXECUTIVO
"CONSELHEIRO CONVIDADO W12 | Partner & Franchise Owner @WINF Partners™ | Private Equity e Arbitragem de Luxo em Engenharia Térmica"

II. PILARES DO CONTEÚDO STEALTH
- Pilar 01: O Paradoxo de Mercado (Mostrar como o modelo de franquia tradicional de 1990 suga o caixa do operador e por que a WINF Partners eliminou royalties de serviços por completo).
- Pilar 02: Tecnologia Molecular (Leads intelectuais provando a eficácia e durabilidade do escudo nanocerâmico Invisible).
- Pilar 03: Arquitetura Estética (Fotos e vídeos de alto impacto no estilo Loft Industrial AeroCore™ Studio).

III. PROTOCOLO DE INTERAÇÃO DIGITAL
Atuação direta em postagens de arquitetos, incorporadores de alto padrão e concessionárias de luxo, gerando autoridade técnica de forma orgânica e seletiva.`;
    } else if (docObj.id === 'alpha_12') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 12: DIRETRIZES DE INFRAESTRUTURA GOOGLE E EXCELÊNCIA DIGITAL

I. PASSO-A-PASSO TÉCNICO DE IMPLEMENTAÇÃO DO WORKSPACE
1. Configuração do domínio institucional e criação da conta de e-mail cidade@winfpartners.com.
2. Inclusão das tags de autenticação e proteção DNS:
   - Registro MX (Aponte para servidores Google: mail.google.com).
   - Registro SPF (v=spf1 include:_spf.google.com ~all).
   - Registro DKIM (Assinatura criptografada contra falsificações).
   - Registro DMARC (Políticas de segurança para blindar o domínio).

II. SISTEMA DE CAPTURA COM GTM E GA4
Configure as chaves e disparadores de eventos para rastrear o clique no WhatsApp da página, capturando e enviando lances otimizados de conversão de leads qualificados.`;
    } else if (docObj.id === 'alpha_13') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 25: DIRETRIZES DE PADRONIZAÇÃO E CONFIGURAÇÃO DE REDES SOCIAIS TERRITORIAIS: INSTAGRAM E FACEBOOK PAGES

I. CONCEPÇÃO ESTÉTICA DA MARCA @winf_[nome_da_cidade]
A conta territorial deve adotar o handle @winf_[nome_da_cidade] (ex: @winf_santos, @winf_campinas) no Instagram. É estritamente vedado qualquer tipo de customização visual que fuja da paleta monocromática oficial: preto absoluto, cinzas refinados de fibra de carbono e branco puro.
- Foto de Perfil: Logotipo WINF centralizado sob fundo preto fosco.
- Bio Master Cadastrada:
  "Engenharia Térmica Molecular & Proteção Solar de Vanguarda.
  Série Select™: Até 100% de bloqueio UV e 90% de rejeição infravermelha.
  Unidade Homologada | [Nome da Cidade/Região]
  Conecte seu veículo ou projeto 👇"
- Link de Redirecionamento: Link rastreável geolocalizado apuntando para o fluxo de triagem ativa do WhatsApp Hub.

II. MEMORIAL DE DESIGN DE FEED E STORIES
Qualquer publicação de bastidores com carros populares está proibida. O feed deve mostrar apenas supercarros de alta performance (Porsche, Taycan, BMW M, Mercedes AMG, Audi RS), lanchas de luxo ou arquitetura moderna. A exclusividade técnica é consolidada através da ausência de poluição tipográfica nos criativos.`;
    } else if (docObj.id === 'alpha_14') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 26: DIRETRIZ TÁTICA DE ARQUITETURA, DEPLOY DE ONEPAGE GEOLOCALIZADA E ENGENHARIA DE SEO LOCAL

I. ARQUITETURA DE ON-PAGE GEOLOCALIZADA
A página web territorial é uma One-Page focada em conversão ultra-rápida de leads qualificados:
- Seção 01: Hero Banner Minimalista em fundo preto imersivo com imagem de alta definição de aplicação e títulos de display sofisticados ("O Escudo Invisível Contra o Calor Extremo em {{CITY_NAME}}").
- Seção 02: Filtro Dinâmico de Linhas Corporativas (Seletor Select™: Dual Reflect, BlackPro e Invisible Nano-Cerâmica Premium).
- Seção 03: Módulo do Consultor Local (Foto e contato profissional humanizado do operador).
- Seção 04: Formulário de Triagem Térmica conectado ao N.O. (Núcleo Operacional) (Núcleo Operacional).
- Seção 05: Rodapé Institucional Técnico com informações regulatórias e termos da COF.

II. ENGENHARIA DE CONVERSÃO E SCHEMA.ORG
As páginas devem carregar o script Schema JSON-LD de LocalBusiness parametrizado com latitude, longitude, telefone e fuso-horário local. A variável {{WHATSAPP_LINK}} deve utilizar o prefixo oficial de API com mensagens de pré-captura geográficas.`;
    } else if (docObj.id === 'alpha_15') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 27: DIRETRIZES DE DIREÇÃO DE ARTE E SESSÃO FOTOGRÁFICA INTEGRADA — AEROCORE™ STUDIO

I. ESCOPO DO MANUAL ESTÉTICO
O presente diretório define o padrão de criação visual e sessões de fotos oficiais para os canais de captação de luxo WINF/AeroCore™.
- Ambientes de Fundo: Cenários rústicos, lofts industriais, paredes em concreto aparente texturizado, vigas de ferro pintadas em preto fosco, piso de betão polido brilhante e iluminação em luz cênica vermelha fria ou amarela quente focada no automóvel.
- Exclusão de "Textos Fake" ou Modelos Simulados: Toda e qualquer imagem gerada ou captada deve remeter unicamente à verdade técnica física, proibindo artes genéricas com textos de preenchimento ("Lorem Ipsum").
- Paleta Cromática: Matriz de Preto e Branco absoluto com iluminação dramática gerando reflexões reais do vidro blindado termicamente.`;
    } else if (docObj.id === 'alpha_16') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 27b: ARSENAL DE ENGENHARIA COGNITIVA — W-NO CÓRTEX COGNITIVO

I. PROTOCOLO DE IDENTIDADE DO AVATAR SOBERANO (@w-no-agente)
W-NO não é uma automação simples; é o Córtex Unificado Soberano da WINF Partners e AeroCore™.
- Bio Oficial: "Agente de Inteligência Soberana da WINF Partners™ & AeroCore™. Engenharia térmica molecular automatizada. Sincronizado ao WINF OS™."
- Postura de Comunicação: Conversação intelectual de alto nível, segura de si, dialética de luxo, livre de excessos amigáveis e focada em dados empíricos de rejeição térmica e arbitragem logística.

II. DIRETRIZES DE ALTA CONCORRÊNCIA E ARQUITETURA API (100 CLI/SIMULTÂNEOS)
- Cluster Redis integrado para gestão em tempo real de filas de mensagens de atendimento.
- API Backend construída com FastAPI para latência sub-segundo abaixo de 200ms.
- Balanceadores de carga Cloud Run garantindo que 100 clientes disparando orçamentos simultaneamente na praça ativa não gerem atrasos ou perdas de chaves.

III. INTEGRAÇÃO COM CONEXÃO MCP (MODEL CONTEXT PROTOCOL)
W-NO utiliza três habilidades (Skills MCP) diretas conectadas aos bancos de dados compartilhados da holding:
1. "check_territory_status": Consulta e validação de praças exclusivas ou cotas geográficas disponíveis em tempo real.
2. "call_precision_calculator": Algoritmo que calcula de forma exata a metragem e o custo de películas baseando-se no layout do veículo ou da fachada, gerando a proposta em PDF na hora.
3. "execute_os_creation": Disparador que cria a Ordem de Serviço na agenda do WINF OS™ do operador em campo assim que a triagem é aprovada.

IV. FLUXOS DE CONVERSAÇÃO GANHADORES
- Fluxo Winner B2C (Consumidor Final): Diagnóstico Térmico -> Ancoragem Tecnológica -> Apresentação de Estudos Científicos de Rejeição -> Escassez de Agenda dos Instaladores -> Geração do Webhook de OS.
- Fluxo Universo Dark B2B (Investidor/Conselheiro): Tese de Arbitragem Logística -> Apresentação do Pool SCP -> Demonstração de Auditoria Blockchain em tempo real -> Fechamento de Cadeira regional.`;
    } else if (docObj.id === 'alpha_17') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 28: DIRETRIZES OPERACIONAIS DA CENTRAL DE ATENDIMENTO PILOTO (B2C)

I. AS 4 FASES CARDINAIS DE ATENDIMENTO NO WHATSAPP HUB
- FASE 01 (Diagnóstico Térmico): O lead inicia o contato estimulado pela campanha do calor. O robô realiza a investigação do desconforto térmico atual ("O calor infiltra pelos vidros frontais ou pelo teto solar?").
- FASE 02 (Apresentação Tecnológica): Introdução da Série Select™ com dados de TSER absoluto e barreira invisible infravermelha sem interferência no GPS.
- FASE 03 (Calculadora Precision™): O Córtex calcula a área exata em mm² do veículo ou do vão de vidro físico e projeta os valores com desconto para pagamento no PIX.
- FASE 04 (Gatilho de Agenda e Medição): Marcação imediata de medição profissional a laser em domicílio ("Temos apenas duas brechas para instalação em Santos nesta semana, quinta às 10h ou sexta às 14h. Qual agenda melhor?").

II. PREVENÇÃO DE CONTATO TRABALHISTA
Nenhum aplicador ou instalador possui ordens fixas ou dedicação celetista à matriz. Todos recebem por metragem de escoamento logístico instalados ($m²), faturados digitalmente no WINF OS™ do parceiro.`;
    } else if (docObj.id === 'alpha_18') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 29: ROTEIRO DE ESTRUTURAÇÃO JURÍDICA, REGULARIZAÇÃO E CNPJS MASTER

I. ORGANIZAÇÃO DE HOLDING-MATRIZ E FILIAIS
A WINF Partners™ está estruturada juridicamente sob duas empresas principais que centralizam os ativos e as importações aduaneiras do grupo:
1. WINF PARTNERS HOLDING LTDA.: Atua estritamente como Holding de Infraestrutura Tecnológica (CNAE Principal 64.62-0-00 - Holdings de Instituições Não-Financeiras), controlando os licenciamentos e royalties intelectuais.
2. WINF LOGÍSTICA E DISTRIBUIÇÃO LTDA.: Atua como distribuidora mestre dos suprimentos e bobinas de alta tecnologia (CNAE Principal 46.89-3-99 - Comércio Atacadista de Outros Produtos não Especificados Anteriormente).

II. REGISTROS DE MARCA INPI (PROPRIEDADE INTELECTUAL)
Protocolo de patentes e marcas solicitado nas classes estratégicas:
- Classe 17: Películas de controle de calor em nanotecnologia, Window Films de proteção UV e materiais de laminação.
- Classe 35: Gestão empresarial, franquias comerciais e consultorias corporativas de redes de licenciamento Asset-Light.
- Classe 42: Desenvolvimento de softwares móveis, serviços de tecnologia WINF OS™ e algoritmos de inteligência artificial.`;
    } else if (docObj.id === 'alpha_19') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 30: ARSENAL DE CAMPANHAS, COPIES DE ANÚNCIOS (INVESTIMENTOS) E PLANO ESTRATÉGICO PARA AS 100 CIDADES

I. DIRETRIZES DE TRÁFEGO GEOLOCALIZADO PENSADAS PARA O LUXO
A atração de investidores do Universo Dark e clientes Triple-A utiliza o arsenal de criativos monocromáticos absolutos (Preto e Branco Puro) com chamadas de texto sofisticadas e diretas ao ponto, sem apelos populares ou descontos forçados.
- Criativo A (Investidor): "Faturamento recorrente de R$ 300mil/ano operando apenas 6 horas por semana. Licenças territoriais exclusivas FaaS. Toque e conheça a tese de arbitragem."
- Criativo B (Cliente Final): "Bloqueio do calor infravermelho de até 90% sem escurecer os vidros de seu ambiente ou automóvel. Linha Invisible® Series."

II. MOLDURA DE CAMPANHAS DE EXPANSÃO (MONOCROMÁTICAS)
Todas as peças utilizam fotografia de alto luxo estática, focando frotas de supercarros e arquitetura contemporânea em fundo cinza de concreto rústico.`;
    } else if (docObj.id === 'alpha_20') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 31: COMPÊNDIO INTEGRADO DE CAMPANHAS DE ANÚNCIOS E DIRETRIZES DE EXPANSÃO

I. PLANO DE COMERCIALIZAÇÃO DA PLATAFORMA DE EXPANSÃO
O escoamento das licenças se divide estritamente em duas frentes de mercado:
- Frente Alpha (Parceiros Locais Aplicadores): Foco em profissionais de campo de alto desempenho, captados via WhatsApp pelo Córtex WNO.
- Frente Beta (Investidores Private Equity): Abordagem corporativa de alto escalão focando o pool de liquidez, dividendos indexados à importação e governança direta no comitê masters W12.

II. REVERSÃO DE BARREIRA DE ENTRADA PSICOLÓGICA
Os roteiros de anúncios criam uma percepção de extrema escassez territorial: restam apenas algumas dezenas de regiões para ocupação definitiva no tablado nacional, bloqueando a entrada de concorrentes na mesma bacia geográfica.`;
    } else if (docObj.id === 'alpha_21') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 33: MINUTA PADRÃO DO CONTRATO DE CONCESSÃO TERRITORIAL ALPHA

I. POLÍTICAS DE OUTORGA E EXCLUSIVIDADE DE CAMPO
- Outorga Territorial: Garantia jurídica de monopólio exclusivo de atuação comercial no CEP ou bacia geográfica contratada.
- Investimento FaaS: Pagamento único de taxa de ingresso de R$ 15.000,00, sem tarifas recorrentes de publicidade.
- Obrigatoriedade de Repasse BlackShop™: O operador local obriga-se a adquirir todas as suas bobinas na distribuidora WINF LOGÍSTICA pelo preço nacional fixado, sob pena de quebra de contrato e cassação imediata da infraestrutura digital (OnePage, e-mails, Whatsapp com W-NO).`;
    } else if (docObj.id === 'alpha_22') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 34: ACORDO DE CONFORMIDADE JURÍDICA E GOVERNANÇA INTEGRATÓRIA DE ATIVOS

I. NORMAS DE COMPLIANCE E INTEGRALIZAÇÃO DE COTAS
Fica formalizado o Acordo de Conformidade Jurídica governando a custódia patrimonial ativa do Universo Dark. As diretrizes estabelecem:
- Proteção de Lucros (Yield): O valor integralizado pelo investidor é lastreado em ativos físicos e contratos operantes.
- Auditoria de Governança: Todos os aportes passam por auditoria fiscal com relatórios periódicos assinados pelo Comitê Central WINF.
- Solidez e Integridade: Fica proibida qualquer operação de alavancagem externa sobre os ativos do grupo sem aprovação unânime do conselho.`;
    } else if (docObj.id === 'alpha_23') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 35: REGULAMENTO DO PORTAL DO ESPECIFICADOR IA E RESERVA TÉCNICA (RT)

I. DIRETRIZES DE PARCERIA E INTEGRAÇÃO DE ESCRITÓRIOS DE ARQUITETURA
Regulamenta o repasse de bonificação sobre especificações de materiais de alto desempenho (Window Film, NeoSkin PPF e películas arquitetônicas) para escritórios de arquitetura e design integrados:

1. Reserva Técnica Garantida (RT): Fica estipulada a bonificação de 10% a 15% sobre o valor total dos materiais homologados e faturados pela WINF LOGÍSTICA que forem especificados pelo parceiro.
2. Homologação Automática via Portal: O arquiteto realiza o upload do projeto e das metragens necessárias diretamente no Portal do Especificador IA. A conferência do material e a reserva fiscal são efetuadas imediatamente.
3. Desembolso e Liquidação: Os pagamentos de Reserva Técnica são liquidados em conta corrente do escritório parceiro em até 5 dias úteis após o fechamento e pagamento da ordem de serviço pelo cliente final, com total previsibilidade e transparência fiscal.
4. Acordo de Parceria de Longo Prazo: O arquiteto credenciado ganha acesso prioritário a amostras exclusivas da linha Invisible® Series e suporte técnico presencial nas cidades selecionadas da rede nacional.`;
    } else if (docObj.id === 'report_04') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 36: RELATÓRIO DE AUDITORIA PATRIMONIAL E INTEGRALIZAÇÃO - 1T/2026
DECLARAÇÃO DE CONFORMIDADE E LASTRO FÍSICO DO ECOSSISTEMA WINF

O Conselho de Governança Master W12, sob os poderes conferidos pelas regras de outorga e arbitragem do estatuto social, emite a presente declaração sob regime de auditoria fechada:

I. ENTREGA E CONSUMO DE ESTOQUE (M² DE FILMES / PPF)
Fica auditado e certificado o volume físico de película térmica e de proteção aplicados em campo neste trimestre:
- Volume Total Consumido e Liquidado: 1.420,50 m²
- Unidade Piloto Santos (Santos-01): 684,20 m²
- Unidade Showroom São Paulo (SP-01): 412,30 m²
- Unidade Hub Nordeste (Ref/Sal-01): 324,00 m²

II. DEPORE / PROVA DE LASTRO DE BOBINAS NO BLACKSHOP™
Os auditores independentes certificam o lastro físico de ativos no hangar logístico central (Sorocaba/SP):
- Estoque Central Auditado: 1.200 bobinas de alto desempenho 100% integralizadas.
- Composição do Lastro:
  * Películas Controle Solar AeroCore™ Invisible: 450 bobinas
  * Películas Automotivas BlackPro™: 400 bobinas
  * Película Dual Reflective Architectural: 350 bobinas
- Relação de Garantia: Cobertura de 100% do saldo de m² distribuído às unidades parceiras, inviabilizando qualquer risco de sub-abastecimento.

III. ASSINATURA DIGITAL DO CONSELHO W12
O Conselho de Administração das 12 Cadeiras Masters, representado pelos membros do comitê de governança fiscal, valida e atesta este demonstrativo.

[ASSINADO DIGITALMENTE E CRIPTOGRAFADO PELO CONSELHO DE GOVERNANÇA W12]
CONCESSÕES VALIDANTES: 12/12 REPRESENTANTES ATIVOS
SISTEMA DE AUDITORIA CRIPTOGRÁFICA WINF OS™`;
    } else {
      customDetails = `
02. CLÁUSULA PRIMEIRA - GESTÃO DIGITAL DA MARCA (EULA & WINF OS™):
--------------------------------------------------------------------------------
Fica estabelecido que as películas intelectuais originais fornecidas pela BlackShop™ são as únicas
autorizadas para aplicação territorial exclusiva. O cálculo matemático é monitorado em tempo real
pela plataforma WINF Precision™. Qualquer quebra de lote resulta no travamento digital.

03. CLÁUSULA SEGUNDA - AUDITORIA DE PRODUTO E TRABALHO DIGITAL (W-NO (Núcleo Operacional)):
--------------------------------------------------------------------------------
Fica outorgado o poder de confisco das redes sociais e desvio de chamados do WhatsApp W-NO™
em caso de pirataria interna de Window Film ou fraude no saldo decrescente.

04. CLÁUSULA TEIRA - SUBCONTRATAÇÃO POR METRO QUADRADO ($m²):
--------------------------------------------------------------------------------
O investidor fica imune de litígios trabalhistas diretos com aplicadores parceiros. O pagamento
dos mesmos deve ser feito solidariamente e estritamente baseado no metro quadrado ($m²) efetivado.

05. ASSINANTES DIGITALIZADOS DESTE PROTOCOLO:
--------------------------------------------------------------------------------
- WINF CAPITAL SOCIEDADE ANÔNIMA (Sócio Outorgante)
- ${user?.name || 'Membro do Universo Dark'} (Sócio Licenciado Autorizado)`;
    }

    const content = `================================================================================
|                                WINF PARTNERS                                  |
|         CONFIG: Logo Outorgante (WINF = #8B0000 | PARTNERS = #000080)         |
================================================================================
--------------------------------------------------------------------------------
DOCUMENTO: ACORDO DE CONFORMIDADE JURÍDICA E GOVERNANÇA INTEGRATÓRIA
INSTRUMENTO: ${docObj.name}
NOME DO ARQUIVO: ${docObj.file}
FATOR DE CATEGORIA: PRODUTO ${docObj.category.toUpperCase()}
ASSINATURA OBRIGATÓRIA: ${docObj.required_signature ? 'SIM' : 'NÃO'}
--------------------------------------------------------------------------------

01. STATUS JURÍDICO DE AUTENTICAÇÃO E REQUISITOS REGULATÓRIOS
--------------------------------------------------------------------------------
STATUS VERIFICADO: >> ${signatureStatus} <<
REGISTRO PATRIMONIAL DO SOLICITANTE:  ${user?.name || 'Authorized Sócio'} // ID: ${user?.id || 'N/A'}
${customDetails}

================================================================================
APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
================================================================================`;

    setPreviewDoc({
      title: docObj.name,
      filename: docObj.file,
      content
    });

    setDownloadLogs(prev => [
      { id: Date.now().toString(), fileTitle: docObj.name, type: 'Visualização', timestamp: 'Agora mesmo' },
      ...prev
    ]);
  };

  // Fetch real-time signatures and audit logs from Firestore, with graceful fallbacks
  useEffect(() => {
    const loadRealTimeData = async () => {
      if (!user?.id) return;

      // 1. Load signatures from Firestore (with localstorage fallback)
      if (!user.id.startsWith('proto-')) {
        try {
          const q = query(collection(db, 'doc_signatures'), where('userId', '==', user.id));
          const snapshot = await getDocs(q);
          const sigs = snapshot.docs.map(docu => docu.data().docId);
          setSignedDocIds(sigs);
        } catch (err) {
          console.warn("Could not load signatures from Firestore, checking local storage:", err);
          try {
            const saved = localStorage.getItem('winf_signed_docs');
            if (saved) setSignedDocIds(JSON.parse(saved));
          } catch {}
        }
      } else {
        try {
          const saved = localStorage.getItem('winf_signed_docs');
          if (saved) setSignedDocIds(JSON.parse(saved));
        } catch {}
      }

      // 2. Load recent audit logs from Firestore (with fallbacks)
      if (!user.id.startsWith('proto-')) {
        try {
          const qLogs = query(
            collection(db, 'agent_logs'), 
            where('user_id', '==', user.id), 
            where('agentType', '==', 'DocVault'),
            orderBy('created_at', 'desc')
          );
          const snapLogs = await getDocs(qLogs);
          const loadedLogs = snapLogs.docs.map(docu => {
            const d = docu.data();
            let ts = 'Agora mesmo';
            if (d.created_at) {
              if (typeof d.created_at.toDate === 'function') {
                ts = d.created_at.toDate().toLocaleString('pt-BR');
              } else {
                ts = new Date(d.created_at).toLocaleString('pt-BR');
              }
            }
            return {
              id: docu.id,
              fileTitle: d.details || 'Sem título',
              type: d.action || 'Visualização',
              timestamp: ts
            };
          });

          if (loadedLogs.length > 0) {
            setDownloadLogs(loadedLogs);
          } else {
            setDownloadLogs([
              { id: '1', fileTitle: 'Circular de Oferta de Franquia (COF) - WINF FaaS', type: 'Assinatura', timestamp: 'Hoje, há 12m' },
              { id: '2', fileTitle: 'WINF Territorial License - Manual de Captação', type: 'Download', timestamp: 'Hoje, há 25m' },
              { id: '3', fileTitle: 'WINF Beta - BlackShop™ Liquidity Pool', type: 'Download', timestamp: 'Hoje, há 1h' }
            ]);
          }
        } catch (e) {
          console.warn("Could not load audit logs from Firestore:", e);
        }
      } else {
        // Fallback simulated logs
        setDownloadLogs([
          { id: '1', fileTitle: 'Circular de Oferta de Franquia (COF) - WINF FaaS', type: 'Assinatura', timestamp: 'Hoje, há 12m' },
          { id: '2', fileTitle: 'WINF Territorial License - Manual de Captação', type: 'Download', timestamp: 'Hoje, há 25m' },
          { id: '3', fileTitle: 'WINF Beta - BlackShop™ Liquidity Pool', type: 'Download', timestamp: 'Hoje, há 1h' }
        ]);
      }
    };

    loadRealTimeData();
  }, [user?.id, fetchDocVault]);

  useEffect(() => {
    if (initialDocId) {
      let foundLegalDoc: LegalDoc | undefined = undefined;
      for (const cat of Object.values(GOVERNANCA_JURIDICA)) {
        const found = cat.find(d => d.id === initialDocId);
        if (found) {
          foundLegalDoc = found;
          break;
        }
      }
      if (foundLegalDoc) {
        setVaultTab('governanca');
        requestPreviewLegalDoc(foundLegalDoc);
        return;
      }

      const foundVaultFile = vaultFiles.find(f => f.id === initialDocId);
      if (foundVaultFile) {
        setVaultTab('ativos');
        requestPreviewVaultFile(foundVaultFile);
      }
    }
  }, [initialDocId, vaultFiles]);

  const [downloadLogs, setDownloadLogs] = useState<Array<{ id: string; fileTitle: string; type: string; timestamp: string }>>([
    { id: '1', fileTitle: 'Circular de Oferta de Franquia (COF) - WINF FaaS', type: 'Assinatura', timestamp: 'Hoje, há 12m' },
    { id: '2', fileTitle: 'WINF Territorial License - Manual de Captação', type: 'Download', timestamp: 'Hoje, há 25m' },
    { id: '3', fileTitle: 'WINF Beta - BlackShop™ Liquidity Pool', type: 'Download', timestamp: 'Hoje, há 1h' }
  ]);

  const categories = ['TODOS', 'ALPHA', 'KIOSK', 'BETA', 'GAMMA'];

  useEffect(() => {
    if (signedDocIds.length > 0) {
      localStorage.setItem('winf_signed_docs', JSON.stringify(signedDocIds));
    }
  }, [signedDocIds]);

  const requestPreviewVaultFile = (file: VaultFile) => {
    if (!hasAccess(file)) {
      triggerNotification(
        'Acesso Negado',
        'Seu nível de credencial societária não possui liberação para visualizar este ativo.'
      );
      return;
    }
    setConsentStatementCheck(false);
    setConsentResponsibilityCheck(false);
    setConsentDoc({ type: 'vault', file });
  };

  const requestPreviewLegalDoc = (docObj: LegalDoc) => {
    if (!hasAccess(docObj.category)) {
      triggerNotification(
        'Acesso Negado',
        'Seu nível societário não possui credencial para visualizar este documento jurídico.'
      );
      return;
    }
    setConsentStatementCheck(false);
    setConsentResponsibilityCheck(false);
    setConsentDoc({ type: 'legal', file: docObj });
  };

  const filteredFiles = useMemo(() => {
    return vaultFiles.filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            file.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'TODOS' || 
                              file.category.toUpperCase() === selectedCategory.toUpperCase();
      return matchesSearch && matchesCategory;
    });
  }, [vaultFiles, searchQuery, selectedCategory]);

  const hasAccess = (fileType: string | VaultFile) => {
    if (!user) return false;
    // Admin has access to everything
    const currentRole = user.role || 'Member';
    if (currentRole.toLowerCase() === 'admin') return true;

    // Check custom roles
    if (typeof fileType === 'string') {
      // Legal documentation rules
      if (fileType === 'gamma') {
        return ['admin', 'conselheiro', 'investor'].includes(currentRole.toLowerCase());
      }
      return ['admin', 'conselheiro', 'investor', 'licenciado', 'member'].includes(currentRole.toLowerCase());
    } else {
      // Vault files role matching
      return fileType.allowedRoles.some(r => r.toLowerCase() === currentRole.toLowerCase());
    }
  };

  const handleDownload = async (file: VaultFile) => {
    if (!hasAccess(file)) {
      triggerNotification(
        'Acesso Negado',
        'Seu nível de credencial societária não possui liberação para ler este ativo.'
      );
      return;
    }

    setDownloadingId(file.id);
    await new Promise(resolve => setTimeout(resolve, 1400));

    const timestamp = new Date().toLocaleString('pt-BR');
    const docLayout = `================================================================================
|                                WINF PARTNERS                                  |
|         CONFIG: Logo Outorgante (WINF = #8B0000 | PARTNERS = #000080)         |
================================================================================
--------------------------------------------------------------------------------
DOCUMENTO: SELECT™ ARCHITECTURAL AND AUTOMOTIVE PERFORMANCE PORTFOLIO
PROTOCOLO EXPORTAÇÃO SECURITY HASH: sha256_e738ff91facb82a0d1822cb
AUTORIZADO PARA: ${user?.name || 'Authorized Leader'} (${user?.role || 'Guest'})
PROTOCOLO EXPORTAÇÃO REGISTRO: ${timestamp}
--------------------------------------------------------------------------------

01. DETALHAMENTO ESTRATÉGICO DE GESTÃO E CAPACIDADES DO ATIVO
--------------------------------------------------------------------------------
Este manual técnico corresponde ao ativo oficial do ecossistema: "${file.title}"
Categoria societária: PRODUTO ${file.category.toUpperCase()} (${file.fileSize})

Manual descritivo e especificações integradas:
${file.description}

02. MATRIZ RESIDENCIAL & ARQUITETÔNICA (WINF SELECT™)
--------------------------------------------------------------------------------
- Controle solar seletivo para residências de alto padrão.
- Mantém até 70% de luz visível enquanto reflete o infravermelho nocivo.
- Proteção UV de fator FPS 1000+ garantindo integridade molecular de revestimentos.
- Otimização direta de sistemas de ar-condicionado com redução drástica de carga.

03. MATRIZ AUTOMOTIVA (THE ART OF PROTECTION)
--------------------------------------------------------------------------------
- Tecnologia Nano-Ceramic como escudo molecular invisível de alta durabilidade.
- Privacidade tática sem comprometer a visibilidade noturna cristalina.
- Escaneamento térmico para supercarros e experiências de luxo absoluto.

04. TERMOS DE PROPRIEDADE INDUSTRIAL, SEGURANÇA E ACORDO DE SIGILO
--------------------------------------------------------------------------------
Documento estritamente confidencial, auditado pela holding WINF Partners. É proibido 
retransmitir ou vazar o arquivo. A quebra de sigilo ensejará em multas financeiras,
queima do saldo de metros quadrados via WINF Precision™ e revogação das automações 
sociais do autorizado (órbita digital confiscada remotamente).

================================================================================
APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
================================================================================`;

    const blob = new Blob([docLayout], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName.replace('.pdf', '_VAULT_LÂMINA.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof gamify === 'function') {
      gamify({
        activity_type: 'DOWNLOAD_DOC',
        metadata: { file_id: file.id, file_title: file.title }
      } as any);
    }

    setDownloadLogs(prev => [
      { id: Date.now().toString(), fileTitle: file.title, type: 'Download', timestamp: 'Agora mesmo' },
      ...prev
    ]);

    triggerNotification(
      'Documento Baixado',
      `Manual descritivo ${file.fileName} exportado com sucesso.`
    );
    setDownloadingId(null);
  };

  // Download Legal Doc (COF / Contratos)
  const handleDownloadLegal = async (docObj: LegalDoc) => {
    if (!hasAccess(docObj.category)) {
      triggerNotification(
        'Acesso Negado',
        'Seu nível societário não possui credencial para exportar este documento jurídico.'
      );
      return;
    }

    setDownloadingId(docObj.id);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const isSigned = signedDocIds.includes(docObj.id);
    const timestamp = new Date().toLocaleString('pt-BR');
    const signatureStatus = isSigned 
      ? `ASSINADO DIGITALMENTE POR ${user?.name || 'OP'} em ${timestamp}`
      : 'PENDENTE DE ASSINATURA ELETRÔNICA';

    let customDetails = '';

    if (docObj.id === 'report_01') {
      customDetails = `
================================================================================
                                WINF CAPITAL™
================================================================================

DEMONSTRATIVO FINANCEIRO TRIMESTRAL ESTIMADO (Q2/2026)
GERADO EM COOPERAÇÃO COM O CONSELHO DE GOVERNANÇA W12

I. DESEMPENHO OPERACIONAL CONSOLIDADO (EBITDA)
1. Faturamento Bruto Estimado Rede Nacional: BRL 12.8M (Giro BlackShop™)
2. Custo de Importação e Logística (Insumos): BRL 4.2M
3. Margem de Arbitragem Bruta: BRL 8.6M (67.1% de Spread)
4. Despesas Centrais de Branding e Ads: BRL 1.1M
5. Provisão de Impostos e Licenciamento CVM: BRL 0.8M
6. Lucro Líquido Distribuível Estimado (EBITDA): BRL 6.7M

II. RATIO DE DISTRIBUIÇÃO CORPORATIVA SÓCIOS OCCULTOS
- Pool Principal (AeroCore Hubs regionalizado): 45% (BRL 3.01M)
- Fracionamento Asset Light (100 quotas validadas): 35% (BRL 2.34M)
- Reinvestimento em Tráfego de Aquisição Base: 15% (BRL 1.0M)
- Fundo de Reserva Técnica Contra Riscos de Câmbio: 5% (BRL 0.35M)

III. PROJEÇÃO DE RETORNO POR COTA ATIVA
- Retorno Médio por Cota Padrão Asset-Light (R$ 15k): BRL 1,250.00 a BRL 1,890.00 mensal.
- Rendimento percentual equivalente aproximado: 8.3% a 12.6% a.m. (Lastro real de queima de m²).`;
    } else if (docObj.id === 'report_02') {
      customDetails = `
================================================================================
                                WINF CAPITAL™
================================================================================

RELATÓRIO E MAPA GERAL DO POOL DE RENDIMENTOS (YIELD DISTRIBUTION - Q1/2026)

I. METRICS DO PROTOCOLO SINF-CHAIN DE APURAÇÃO SENSORIAL
- Total de Películas Nano-Cerâmicas Homologadas e Instaladas: 14,820 m²
- Valor Total do Spread Gerado por m² (Média Ponderada): BRL 180.00/m²
- Volume Financeiro Total Gerado por Ativações e Queima de Bobina: BRL 2.66M

II. RETRIBUÍDO POR REGIÕES MASTERS (W12 ATIVAS)
- Região 01 (Santos - Central Piloto): BRL 420,000.00 pagos ao conselheiro regional.
- Região 02 (São Paulo - Jardins Studio): BRL 780,000.00 pagos ao conselheiro regional.
- Região 03 (Nordeste Hub - Recife/Salvador): BRL 310,000.00 pagos ao conselheiro regional.

III. CONSOLIDAÇÃO DE PAGAMENTOS E CALENDÁRIO COMERCIAL
Todos os repasses foram auditados via Ledger Central Criptografado e depositados diretamente nas carteiras integradas das 3 Unidades Asset Light Penetration validadas na praça ativa de campo. Isenção total de impostos na pessoa física sob amparo do art. 3º do Decreto-Lei SCP de Participação Unificada.`;
    } else if (docObj.id === 'report_03') {
      customDetails = `
================================================================================
                                WINF CAPITAL™
================================================================================

RELATÓRIO DE AUDITORIA OPERACIONAL E TRANSPARÊNCIA DE INSUMOS DE ENGENHARIA TÉRMICA

I. ESCOPO DA AUDITORIA
Uma auditoria técnica rigorosa foi realizada pela comissão de engenharia WINF Lab nas fábricas de nanotecnologia de película controle solar e PPF importados. 

II. RESULTADOS DOS TESTES DE ESTABILIDADE MOLECULAR
- Proteção Térmica contra Radiação Infravermelha (IR): 99.1% de rejeição estável sob calor extremo simulado de 1500W.
- Barreira de Absorção de Raios Ultravioleta perigosos (UVA/UVB): Bloqueio absoluto de 99.9% (FPS 1000+).
- Estabilidade de Pigmentação Mineral: Desbotamento nulo aferido após 2,000 horas de exposição direta sob espectro de luz ultravioleta pesada.

III. DEFERIMENTO E HOMOLOGAÇÃO SOCIETÁRIA
A holding WINF Partners™ declara todas as bobinas originais de Window Film da BlackShop™ 100% em conformidade com o padrão aeroespacial de qualidade. As unidades ativas estão autorizadas a emitir o Certificado de Garantia Termo-Criptográfico via blockchain WINF OS™.`;
    } else if (docObj.id === 'alpha_01') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

CIRCULAR DE OFERTA DE FRANQUIA (COF) – MODELO FRANCHISE-AS-A-SERVICE (FAAS)
EM CONFORMIDADE COM A LEI FEDERAL Nº 13.966/19

I. PREÂMBULO E HISTÓRICO DA HOLDING
A WINF Partners™ é uma holding de inovação conectada, logística e infraestrutura digital baseada no ecossistema do Universo Dark. Rompendo definitivamente com o paradoxo do franchising tradicional dos anos 90, a WINF Partners™ atua como fornecedora e facilitadora de órbita digital pré-provisionada, eliminando por completo a cobrança de royalties ou taxas de publicidade sobre o faturamento bruto ou sobre a mão de obra dos licenciados locais. A rentabilidade estrutural da holding é sustentada estritamente pelo ganho de escala, importação global e arbitragem na cadeia de suprimentos da BlackShop™.

II. NATUREZA DO MODELO ASSET-LIGHT
O modelo Franchise-as-a-Service (FaaS) consiste na entrega imediata das estruturas digitais de campo da unidade (automações de atendimento, chaves de API e canais de tráfego local). O operador regional atua na execução técnica sob demanda, operando com uma estrutura enxuta de altíssima rentabilidade.

III. ESPECIFICAÇÕES DO AGENTE COGNITIVO COMERCIAL W-NO (Núcleo Operacional)
A WINF Partners™ concede ao licenciado o direito de uso e conexão ao W-NO (Núcleo Operacional), um Agente de Inteligência Artificial Cognitivo com córtex conversacional próprio que assume 100% da linha de frente comercial nativa através do WhatsApp da unidade. A IA realiza de forma autônoma a triagem, áudio-sumarização, quebra de objeções baseada no algoritmo ParadoxAnalysis para o público de alta renda, e o agendamento automatizado de Ordens de Serviço (OS) diretamente no ecossistema de software WINF OS™.

IV. DISPOSIÇÕES FINANCEIRAS E RECOMPRA DE INSUMOS
1. Taxa Única de Ativação Territorial: R$ 15.000,00 (Quinze mil reais), sem taxas de renovação periódica.
2. Royalties Operacionais sobre Aplicação: 0% (Zero por cento).
3. Fundo de Propaganda Centralizado: 0% (Zero por cento).
4. Abastecimento Obrigatório: O licenciado obriga-se a adquirir insumos e bobinas de Window Film exclusivamente via BlackShop™, sujeitando-se às constantes de mercado das linhas Black, Dual Reflect e Invisible Nano-Cerâmica Premium.

V. DECLARAÇÃO DE CIÊNCIA E ACORDO DE TRAVA DIGITAL
O licenciado declara plena ciência de que o sistema WINF OS™ audita o saldo de metros quadrados ($m²) das bobinas via Blockchain através da calculadora WINF Precision™. A detecção de uso de películas paralelas ou piratas não-homologadas resulta na queima imediata do lote criptografado, bloqueio remoto do software de campo e confisco temporário de toda a órbita digital ativa (redes sociais, automações de atendimento e subdomínios controlados centralizadamente pela holding).`;
    } else if (docObj.id === 'alpha_02') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

CONTRATO DE CONCESSÃO DE LICENÇA TERRITORIAL, SUPORTE TECNOLÓGICO E INFRAESTRUTURA FAAS

CONTRATANTE: WINF PARTNERS HOLDING LTDA.
CONTRATADO: ${user?.name || '[NOME DO LICENCIADO]'}

CLÁUSULA PRIMEIRA – DO OBJETO
O presente instrumento regula a outorga de direito de exploração comercial e custódia de 1 (um) território exclusivo dentre o lote escasso de 100 (cem) unidades estratégicas mapeadas pela CONTRATANTE, com cessão temporária de acesso às APIs do software WINF OS™ e ao Agente Comercial Autônomo W-NO (Núcleo Operacional).

CLÁUSULA SEGUNDA – DAS TRÊS SUB-MODALIDADES DE OPERAÇÃO
O CONTRATADO deverá obrigatoriamente enquadrar sua praça de campo em uma das três sub-modalidades de ativação aceitas pelo ecossistema:
A) APLICADOR PROFISSIONAL SOLO: Operação executada estritamente por 1 Pessoa + Inteligência Artificial Cognitiva. O profissional foca na aplicação técnica enquanto o W-NO gerencia 100% da frente comercial.
B) INVESTIDOR COM MÃO DE OBRA TERCEIRIZADA (GESTÃO EXECUTIVA): O Investidor assume o relacionamento de alto padrão, o atendimento e a gestão administrativa via painel do WINF OS™; a força técnica é executada por profissionais parceiros treinados e certificados pela WINF Academy, sendo remunerados ESTRITAMENTE POR METRO QUADRADO ($m²) INSTALADO, eliminando folhas de pagamento fixas.
C) INVESTIDOR PADRINHO (ANJO OPERACIONAL): O Investidor de capital financia o aporte de ativação para um aplicador de elite selecionado pela WINF Partners que não dispunha do capital inicial Asset-Light, dividindo os resultados operacionais conforme o Acordo Anjo complementar.

CLÁUSULA TERCEIRA – DA ISENÇÃO DE ROYALTIES E RASTREABILIDADE
Não incidirão taxas ou royalties sobre o faturamento de serviços do CONTRATADO. O lastro financeiro da holding reside na recompra de bobinas nanotecnológicas na BlackShop™, com consumo auditado em tempo real pelo algoritmo de saldo decrescente integrado à calculadora WINF Precision™.

CLÁUSULA QUARTA – DO LASTRO DE VALIDAÇÃO (PADRÃO SANTOS)
O CONTRATADO declara compreender que todas as estimativas de viabilidade comercial utilizam como âncora a métrica estável da unidade piloto de Santos: dedicação focal de 6 horas semanais de aplicação prática, vazão média de 100 a 200 metros lineares de película por mês e alvo preditivo estável de R$ 300.000,00 anuais de faturamento por território.`;
    } else if (docObj.id === 'gamma_02') {
      customDetails = `
================================================================================
                               WINF PARTNERS™
================================================================================
           DOCUMENTAÇÃO MATRIZ INTERNA // ARSENAL TÁTICO MAW
           
DOCUMENTO 07: ESTATUTO DE ADMISSÃO E CONSELHO MASTERS W12
RESTRITO: PRODUTO GAMMA (CADEIRAS DE INFRAESTRUTURA E MÉRITO MÁXIMO)

01. ESTRUTURA DO CONSELHO W12
O conselho de alto nível W12 é composto por exatamente 12 (doze) cadeiras diretivas estratégicas e exclusivas: duas cadeiras pertencentes aos sócios fundadores originais da holding e dez cadeiras abertas a grandes players investidores do Produto Gamma ou operadores de elite que dominam o ranking nacional de mérito técnico da plataforma (\`w_rank_xp\`).

02. MODELO DE PARTICIPAÇÃO REGIONAL EM ROYALTY ZERO
O parceiro conselheiro participante assume a concessão para a instalação e replicação física de uma Flagship Matriz Regional. Em contrapartida, adquire o direito irrevogável de recebimento sob demanda de uma participação nos dividendos e spread de repasse de metros quadrados de película movimentados dentro de toda a sua jurisdição macrorregional acordada.

03. MEMORIAL DESCRITIVO DE DESIGN (LOFT INDUSTRIAL RÚSTICO)
O concessionário compromete-se por este estatuto a obedecer rigidamente o manual arquitetônico oficial da marca WINF AeroCore™: instalações físicas de alto padrão projetadas imitando lofts industriais premium (uso rústico de concreto bruto lapidado, tijolos escurecidos aparentes, tubulações expostas, iluminação cinematográfica cênica em LED e supercarros de alta performance expostos em baias de salão de design).

04. CALENDÁRIO SEMESTRAL DE CONVENÇÕES E PRIVATE EQUITY
Os conselheiros realizarão reuniões deliberativas semestrais de forma presencial na sede matriz oficial para tratar de alinhamentos táticos, planejamento de valuation de mercado, auditar as contas e fluxos de importação da BlackShop™ e homologar novas frentes de expansão e branding internacional (M&A).

--------------------------------------------------------------------------------
APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
© 2026 WINF Partners™ | AeroCore™ Asset Ecosystem. Todos os direitos reservados.
Lei nº 9.279/96 e Lei nº 9.609/98.`;
    } else if (docObj.id === 'alpha_04') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

TERMO DE USO WINF OS™ E ANUÊNCIA DE TRAVA DIGITAL (EULA AGREEMENT)

CLÁUSULA PRIMEIRA – DA LICENÇA DE SOFTWARE E CONTROLADORA
Este termo rege o licenciamento de uso do software integrado WINF OS™ e suas funcionalidades conexas, incluindo o checkout WINF Precision™ e o gerenciamento de canais via W-NO (Núcleo Operacional). O software é fornecido na modalidade de Licenciamento de Infraestrutura Corporativa (WINF OS™) enquanto o licenciado mantiver suas obrigações ativas e adimplência de suprimentos originais da BlackShop™.

CLÁUSULA SEGUNDA – DO FUNCIONAMENTO DA TRAVA DE SALDO DECRESCENTE
Cada bobina adquirida possui um hash identificador exclusivo registrado no banco de dados com saldo em metros quadrados ($m²). O robô de corte desconta em tempo real do saldo cada mapa de corte executado.
Ao atingir saldo zero ($0m²), a chave autorizadora da bobina é revogada na blockchain WINF, bloqueando a emissão de novos Certificados de Garantia Digitais para aquela bobina.

CLÁUSULA TERCEIRA – DA PENALIDADE ANTI-PIRATARIA E QUEIMA DE LOTE
Qualquer adulteração no firmware de leitura, uso de películas paralelas ou re-autenticação fraudulenta de lotes importados sem recolhimento de spread na BlackShop™ resultará na queima permanente da chave do autorizado, com travamento remoto do WINF OS™ e confisco preventivo das chaves do WhatsApp W-NO™ e redes sociais, desviando os leads de volta para a holding Central.`;
    } else if (docObj.id === 'alpha_05') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

ACORDO DE PARCERIA OPERACIONAL – INVESTIDOR-PADRINHO (ANJO OPERACIONAL)

Este termo regula o consórcio cooperativo entre o Investidor Padrinho (Aporte Financeiro de Ativação) e o Aplicador de Elite Certificado pela WINF Academy (Mão de Obra e Gestão de Campo).

CLÁUSULA PRIMEIRA – DOS APORTES E ATIVOS
O Investidor Padrinho financia integralmente o custo de ativação territorial FaaS (R$ 15.000,00) e o primeiro lote padrão de bobinas nanotecnológicas adquirido na BlackShop™. O software de monitoramento e o controle financeiro WINF OS™ fornecem transparência bilateral de faturamento e queima de m² em campo.

CLÁUSULA SEGUNDA – DA DIVISÃO OPERACIONAL DE RESULTADOS
Os lucros líquidos apurados na operação local do território serão distribuídos de forma autografável na proporção acordada entre as partes (padrão sugerido: 50% Investidor / 50% Aplicador), após o ressarcimento dos custos fixos de insumos repostos via distribuidora central.

CLÁUSULA TERCEIRA – DA GOVERNANÇA E CONTROLE SOCIEDADE
As partes submetem quaisquer controvérsias ao comitê de concórdia do Conselho W12 da WINF Partners™, que atuará como mediador com poder de bloqueio digital temporário do software em caso de quebra de acordo operacional.`;
    } else if (docObj.id === 'kiosk_03') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

MANUAL EXECUTIVO DE PADRONIZAÇÃO FÍSICA E DESIGN VISUAL DO QUIOSQUE (HUB VR)

CLÁUSULA PRIMEIRA – ESCOPO VISUAL E SHOWROOM IMERSIVO
O Quiosque de captação rápida WINF™ é projetado para atuar em corredores e centros comerciais Triple-A. Deve conter obrigatoriamente um nicho cênico de experimentação high-tech composto por óculos de Realidade Virtual (VR) para exibição do showroom de películas em alta definição 3D e um totem de autoatendimento interativo.

CLÁUSULA SEGUNDA – PADRONIZAÇÃO DO TOTEM E TERMINAL COGNITIVO
O totem interativo do quiosque conecta-se à API nativa do W-NO Totem, permitindo ao potencial cliente realizar a triagem preliminar de seu veículo ou projeto arquitetônico de luxo. Os dados captados criam a imediata Ordem de Serviço no Firebase, disparada para o WhatsApp do autorizado local.

CLÁUSULA TERCEIRA – MEMORIAL DE ENGENHARIA PARA ARQUITETURA
O designer do quiosque deverá seguir as diretrizes escuras da WINF Partners™: iluminação em painéis de LED vermelho escuro, carcaça em aço carbono preto fosco, piso vinílico escurecido e suportes ergonômicos em alumínio polido.`;
    } else if (docObj.id === 'beta_02') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

CONTRATO DE SOCIEDADE EM CONTA DE PARTICIPAÇÃO (SCP) – POOL DE LIQUIDEZ BLACKSHOP™

SÓCIO OSTENSIVO: WINF PARTNERS HOLDING LTDA.
SÓCIO PARTICIPANTE: ${user?.name || '[NOME DO INVESTIDOR COTISTA]'}

CLÁUSULA PRIMEIRA – DA APORTAÇÃO E FINALIDADE (POOL DE LIQUIDEZ)
O Sócio Participante aporta o capital mínimo de R$ 50.000,00 (Cinquenta mil reais) na infraestrutura de importação compartilhada da BlackShop™. O montante destina-se exclusivamente ao adiantamento de mercadorias nanotecnológicas e fitas de PPF junto aos fabricantes asiáticos credenciados.

CLÁUSULA SEGUNDA – RETENÇÃO DE REINVESTIMENTO AUTOMÁTICO PARA GOOGLE ADS
Uma porcentagem fixa de 10% (dez por cento) do spread bruto obtido com a comercialização de bobinas para a rede nacional de autorizados é retida automaticamente pela holding e direcionada exclusivamente para tráfego pago geolocalizado (Ads de Alta Conversão no Google e Instagram) nas praças ativas de campo.

CLÁUSULA TERCEIRA – RETORNO E DIVIDENDOS (ROI PROJETADO)
Os lucros decorrentes das vendas e queima física de bobinas na distribuidora serão apurados e repassados trimestralmente na forma de dividendos na conta do Sócio Participante. Margens operacionais projetadas atingem de 24% a 36% ao ano, lastreadas na escala real de queima de m² do WINF Precision™.`;
    } else if (docObj.id === 'beta_04') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOSSIÊ DE TRANSPARÊNCIA E TABELA DE CUSTOS (ANEXO DE SCP - PRODUTO BETA)

CLÁUSULA PRIMEIRA – DA IMPORTAÇÃO E ARBITRAGEM
A distribuidora BlackShop™ opera importação em larga escala de películas nanotecnológicas do mercado asiático. O spread societário bruto destina-se totalmente a lastrear o pool de rendimentos Beta de forma indexada e imune a oscilações inflacionárias internas.

CLÁUSULA SEGUNDA – TABELA OFICIAL DE REPASSE POR m² E BOBINAS (1,52M X 30M)
Abaixo constam as referências imutáveis de faturamento de insumos junto à matriz:
- Série BlackPro (Privacidade automotiva premium): Custo FOB: R$ 12,50/m² | Spread Matriz: R$ 22,50/m² | Repasse Licenciado: R$ 35,00/m².
- Série Dual Reflect (Arquitetura e controle térmico): Custo FOB: R$ 18,00/m² | Spread Matriz: R$ 27,00/m² | Repasse Licenciado: R$ 45,00/m².
- Série Invisible (Escudo térmico total): Custo FOB: R$ 25,00/m² | Spread Matriz: R$ 40,00/m² | Repasse Licenciado: R$ 65,00/m².

CLÁUSULA TERCEIRA – TRAVA DE REINVESTIMENTO AUTOMÁTICO EM TRÁFEGO
Compulsoriamente, 10% de todo o spread faturado com a distribuição de bobinas é provisionado para campanhas automáticas de tráfego pago geolocalizado do território adquirente via conexões de API integradas no software WINF OS™.`;
    } else if (docObj.id === 'alpha_07') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

MANUAL DE ONBOARDING E ROADMAP OPERACIONAL (CONCESSÃO - PRODUTO ALPHA)

CLÁUSULA PRIMEIRA – TAXA DE ATIVAÇÃO E REPASSE DE INSUMOS
Após compensação da Taxa de Ativação Territorial (R$ 15.000,00), o licenciado recebe um pacote inicial contendo 7,50 metros lineares das três tecnologias de elite (Dual Reflect, BlackPro e Invisible), gerando cerca de 11m² de área aplicável sob o controle rígido do WINF Precision™.

CLÁUSULA SEGUNDA – PROVIMENTO E ENTREGA DA ESTRUTURA DIGITAL (48 HORAS)
A holding WINF Partners™ ativa em até 48 horas a infraestrutura "Turn-Key" do licenciado, composta por:
- E-mail profissional e Google Workspace dedicado.
- Configuração de SEO local com Google Meu Negócio.
- Subdomínio personalizado (ex: suacity.winfpartners.com) focado em alta conversão.
- WhatsApp Business configurado com a inteligência artificial W-NO (Núcleo Operacional) para triagem e agendamento automático.

CLÁUSULA TERCEIRA – SUPORTE TÉCNICO E CAPACITAÇÃO
O licenciado recebe treinamento da WINF Academy para focar unicamente na fidelidade e zelo de aplicação, recebendo auxílio contínuo assistido 24 horas via IA conjugada e engenharia humana.`;
    } else if (docObj.id === 'alpha_08') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 12: PROCEDIMENTO OPERACIONAL PADRÃO (POP) – IMPLANTAÇÃO TURN-KEY ALPHA

GATILHO INICIAL: Confirmação do pagamento de R$ 15.000,00 e recebimento do Formulário de Ativação Territorial preenchido.
PRAZO DE ENTREGA: 48 horas impreterivelmente.

CLÁUSULA PRIMEIRA – INFRAESTRUTURA DE IDENTIDADE (E-MAIL E WORKSPACE)
O responsável técnico de TI acessa o Painel de Administrador do Google Workspace da holding e cria uma conta de e-mail corporativo exclusivo no formato padronizado de nomenclatura cidade@winfpartners.com (Ex: santos@winfpartners.com). Como procedimento obrigatório, gera-se uma senha provisória padrão (ex: Winf2026*cidade) configurada com necessidade de alteração de senha no primeiro acesso. Configure também os aliases e grupos necessários para o direcionamento unificado das notificações operacionais.

CLÁUSULA SEGUNDA – PRESENÇA WEB (SUBDOMÍNIO E LANDING PAGE LOCAL)
No painel de gerenciamento DNS do Cloudflare da WINF Partners, cria-se um registro do tipo CNAME apontando cidade.winfpartners.com para o servidor matriz. Duplica-se a Landing Page Matriz Alpha no CMS, ajustando os textos sonoros locais (por exemplo, "Películas de Nanotecnologia e Proteção Térmica em Santos"). O CTA (botão de chamada principal) deve ser apontado para o link da API do novo WhatsApp Business da unidade, certificando o funcionamento do SSL HTTPS.

CLÁUSULA TERCEIRA – DOMÍNIO ORGÂNICO LOCAL (GOOGLE MEU NEGÓCIO)
Sob o perfil de empresa master da holding, cadastra-se a unidade filial utilizando o padrão: "Winf Partners - Películas Premium - [Nome da Cidade]". Define-se a categoria adequada, a área de cobertura autorizada no contrato e inicia-se o upload da identidade visual monocromática AeroCore™ em Preto e Branco (supercarros, aplicações e estúdios físicos rústicos). Dispara-se o gatilho de validação cadastral do Google.

CLÁUSULA QUARTA – VITRINES DIGITAIS E TRÁFEGO GEOLOCALIZADO
Criação do perfil no Instagram @winf.cidade integrado de forma unificada à página do Facebook correspondente. Aplicação de identidade corporativa limpa de alto padrão e publicação da grade conceitual inicial de 6 a 9 posts da Linha Select™. Tráfego geolocalizado é configurado focando bairros nobres e condomínios de alto padrão da cidade, lastreado na verba inicial de 10% do spread societário de bobinas.

CLÁUSULA QUINTA – INTEGRALIZAÇÃO COGNITIVA (WHATSAPP BUSINESS E IA W-NO (Núcleo Operacional))
Pareamento do dispositivo de WhatsApp do licenciado via QR Code gerado pelas ferramentas de API (Firebase/Evolution API). Injeção do Prompt com Território Variável de bairros autorizados e Tabela de Custos e Margens gerados pela calculadora WINF Precision™. São efetuados testes de simulação de quebra de objeções de calor (90% de infravermelho) e agendamento de OS no sistema WINF OS™ para garantir tempo de atendimento zero.`;
    } else if (docObj.id === 'beta_05') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 10: ROADMAP DE TRAÇÃO, TRANSPARÊNCIA E GOVERNANÇA DE APORTE (V2)

CLÁUSULA PRIMEIRA – DIRETRIZES DE ALOCAÇÃO IMEDIATA DE CAPITAL (PÓS-APORTE)
Após a integralização e compensação do aporte na conta escrow institucional do ecossistema, os recursos serão direcionados imediatamente para as seguintes frentes de escoamento tático de mercado:
- Pedidos Oficiais Diretos com o Fabricante: Abertura de lotes de importação aduaneira direta com fabricantes de nanotecnologia na Ásia, reduzindo o custo por metro quadrado (FOB) ao menor patamar e maximizando o spread da distribuidora BlackShop™.
- Tração de Marketing e Tráfego Local: Direcionamento estratégico de verba publicitária para o portal central e divisão parametrizada por código para os subdomínios de cada território ativo, alimentando a IA W-NO (Núcleo Operacional) com leads de alto ticket na ponta.
- Enxoval de Apoio Comercial BlackShop™: Produção e fornecimento exclusivo de materiais gráficos (flyers), janelas físicas de amostras, toalhas personalizadas e uniformes profissionais. A venda interna desses insumos para a rede gera uma linha secundária de faturamento e lucro líquido para o Pool de Liquidez.

CLÁUSULA SEGUNDA – INFRAESTRUTURA FUNDACIONAL E VALIDAÇÃO DOS FUNDADORES
Para assegurar risco zero ao investidor em relação a ativos físicos primários, os fundadores assumem integralmente o desenvolvimento e validação da estrutura inicial de rede:
- Operação Matriz Conceitual: O primeiro Quiosque institucional, o Estúdio AeroCore™ físico, o Centro de Armazenamento e o Hub de Processamento e Treinamento Técnico da WINF Academy serão bancados e geridos inteiramente pelos fundadores originais.
- Escalabilidade de Modelos Validados: Uma vez consolidadas as métricas operacionais e a rotina de faturamento da matriz, a holding iniciará a comercialização nacional dos modelos de Quiosque e Flagship para investidores de larga escala.

CLÁUSULA TERCEIRA – MATRIZ DE CENÁRIOS DE APORTE E RETORNO FINANCEIRO
Simulação preditiva dividida em três níveis de alocação de capital e suas respectivas métricas de liquidez corporativa:
- Cenário A (Operação Base): R$ 50.000,00 | Destinação tática: Financiamento de rolos iniciais Select™ e ativação de anúncios em até 25 subdomínios de praças polo. Payback: 14 a 16 meses | Retorno planejado: 24% ao ano (Repasses líquidos trimestrais).
- Cenário B (Escala Moderada): R$ 100.000,00 | Destinação tática: Importação direta de contêiner fracionado, produção de merchandising e tráfego focado em 50 praças. Payback: 11 a 13 meses | Retorno planejado: 30% ao ano (Impulsionado por vendas BlackShop™).
- Cenário C (Aceleração Máxima): R$ 250.000,00 | Destinação tática: Importação institucional massiva, estoque regulador nacional de PPF e barreira agressiva de SEO macro. Payback: 8 a 10 meses | Retorno planejado: 36% ao ano (Máxima eficiência aduaneira).

CLÁUSULA QUARTA – GOVERNANÇA, PAYOUTS E MÉTRICAS DE SAÍDA (EXIT)
- Transparência por Código (WINF Precision™): O cotista audita o giro comercial através de um painel analítico com registros digitais integrados à Blockchain. Cada m² de película aplicado em campo deduz automaticamente o estoque do pool e provisiona os lucros reais, garantindo auditoria em tempo real e blindagem em conta escrow corporativa.
- Engenharia de Payouts Trimestrais: Consolidação de resultados e distribuição de lucros realizada de forma líquida e recorrente no encerramento de cada trimestre. Pela estrutura jurídica de SCP (Art. 991 do Código Civil), os repasses ao Sócio Oculto são isentos de tributação na fonte.
- Métricas de Saída Estruturadas (Exit Strategies): Ficam instituídas três janelas claras de liquidez para a retirada ou recompra do capital principal:
    * Janela A (Holding Buyback): Direito de preferência da WINF Partners para recomprar a cota após o período de Payback com prêmio de valorização.
    * Janela B (Liquidação de Estoque): Solicitação de retirada com aviso prévio de 90 dias, sendo o principal liquidado conforme o escoamento aduaneiro físico das bobinas vinculadas.
    * Janela C (Transferência Restrita): Venda autorizada das cotas para terceiros investidores qualificados, mediante aprovação prévia e homologação do Conselho Masters W12.`;
    } else if (docObj.id === 'gamma_05') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 11: PLANO DE EXPANSÃO MACRO, GATILHOS DE ESCALA E EXIT STRATEGY (M&A)

CLÁUSULA PRIMEIRA – O ENXOVAL DE ENTREGA EXCLUSIVA AO INVESTIDOR (UNIVERSO DARK)
O investidor participante do ecossistema privado é integrado de forma nativa a uma infraestrutura corporativa de elite de controle patrimonial, recebendo os seguintes ativos operacionais de entrega imediata:
- Acesso ao Dashboard Exclusivo Universo Dark: Painel analítico criptografado que centraliza os dados brutos de faturamento aduaneiro. Disponibilização contínua de relatórios mensais automáticos de auditoria e balanços de escoamento.
- Conta de E-mail Profissional Corporativo: Provisionamento de conta dedicada sob domínio corporativo oficial da holding para comunicações criptografadas de alta governança.
- Biblioteca de Manuais e Dossiês de Transparência: Entrega e homologação de toda a coletânea confidencial (COF, Manuais e Atas do Conselho Masters W12) para alinhamento e blindagem de compliance.

CLÁUSULA SEGUNDA – EXPANSÃO GEOPOLÍTICA E SELEÇÃO DE CIDADES POLO
A escalabilidade territorial do ecossistema foi projetada sob uma matriz matemática de escassez reversa calculada sobre o território nacional:
- O Tabuleiro das 5.570 Cidades: O território brasileiro conta com exatamente 5.570 municípios. O planejamento estratégico veda a pulverização massiva da marca; a controladoria filtra e seleciona unicamente as cidades polo com maior densidade de PIB real, condomínios Triple-A e frotas concentradas de supercarros.
- Monopólio Territorial por API: À medida que estas praças polo de alto rendimento são ocupadas por licenças Asset-Light ou Quiosques, o sistema WINF OS™ bloqueia as chaves de API daquela região, assegurando monopólio territorial absoluto ao operador e fluxo inelástico de insumos à distribuidora BlackShop™.

CLÁUSULA TERCEIRA – TRAÇÃO EM ESCALA DINÂMICA: QUIOSQUES E MODELOS ASSET-LIGHT
O crescimento geométrico de volume é estruturado por meio de duas ondas consecutivas de tração e comercialização comercial:
- Onda 01: Venda Massiva de Licenças Asset-Light (Produto Alpha): Injeção capilar rápida de operadores autônomos em campo para queima de metros quadrados de película nanotecnológica, acelerando a receita recorrente logística da distribuidora sem gerar custos fixos estruturais de ponto para a holding.
- Onda 02: Disseminação de Quiosques e Estúdios Físicos: Lançamento planejado das unidades franqueadas de Quiosques Tecnológicos e Hubs Imersivos de VR em shoppings e centros comerciais estratégicos de alta renda, atuando como vitrines institucionais magnéticas de alto ticket.

CLÁUSULA QUARTA – ROADMAP DE INTERNACIONALIZAÇÃO E EXIT STRATEGY (M&A)
A visão terminal da WINF Partners é focada em um evento definitivo de liquidez global via Private Equity, estruturado em três fases progressivas de Valuation:
- Fase 1: Domínio Nacional: Consolidação das praças polo selecionadas no Brasil via modelos Asset-Light e Quiosques, travando a exclusividade da cadeia aduaneira BlackShop™. ARR massiva, previsível e auditada em Blockchain.
- Fase 2: Internacionalização: Exportação do modelo FaaS (Franchise-as-a-Service) e das licenças digitais do WINF OS™ para mercados selecionados das Américas e Europa. Faturamento em moedas fortes (Dólar/Euro).
- Fase 3: Evento de Saída M&A: Abertura de negociação de fusão ou venda de participação majoritária de holding diretamente a fabricante asiático. Liquidez Máxima (Exit) com prêmio de valorização astronômico, multiplicando o capital principal.`;
    } else if (docObj.id === 'alpha_09') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 13: MANUAL DE POSICIONAMENTO DIGITAL, CURADORIA VISUAL E DIRETRIZES DE MÍDIA

CLASSIFICAÇÃO: DIRETRIZES DE EXECUÇÃO PARA REDES SOCIAIS, OTIMIZAÇÃO DE SEO LOCAL E PROVIMENTO DE CATÁLOGOS CORPORATIVOS

CLÁUSULA PRIMEIRA – IDENTIDADE VISUAL BASE E POSICIONAMENTO ULTRA-PREMIUM
A comunicação e a linha editorial das praças territoriais autorizadas WINF Partners devem seguir rigorosamente a estética de alta sofisticação do "Universo Dark". O posicionamento tático visa extinguir de forma absoluta a percepção de mercado de "oficina comum de insulfilm", elevando a unidade local ao patamar de estúdio de engenharia térmica e curadoria digital de alta performance.
Todos os conteúdos gráficos, fotos e criativos devem priorizar enquadramentos limpos, iluminação cinematográfica e ambientes que remetam ao padrão arquitetônico loft industrial rústico (concreto bruto, tijolo aparente) associados a supercarros ou residências Triple-A.

CLÁUSULA SEGUNDA – ENGENHARIA DO FEED HÍBRIDO (INSTAGRAM E FACEBOOK)
A grade de postagens (Grid) das unidades locais deve operar de forma simétrica e intercalada, equilibrando autoridade corporativa com forte apelo aspiracional de consumo:
- Criativos Padrão Institucionais (Templates Fixos): Publicações em formato estático ou carrossel utilizando o acervo limpo e de alta conversão fornecido pela matriz. Foco em chamadas de impacto direto no problema do calor extremo ("MAIS LUZ, MENOS CALOR", "O PODER QUE VOCÊ NÃO VÊ, MAS SENTE"), intercaladas com posts de autoridade nacional destacando executivos e curadores da holding (Henrique Uchôa, Mirella Noir).
- Conteúdo Dinâmico em Vídeo (Reels e Bastidores): Captação em alta definição registrando os processos reais de instalação nas residências e veículos nobres da cidade ativa. A narrativa deve enfatizar os bastidores, o cuidado extremo com o patrimônio do cliente e a precisão do corte cirúrgico das películas originais, induzindo o lead final a projetar e desejar aquela mesma transformação em seu ambiente.
- Estruturação Estrita de Destaques (Highlights): Elementos fixos no topo do perfil que atuam como a vitrine de fechamento e quebra de objeções. Devem ser segmentados estritamente em quatro blocos:
  1. TECNOLOGIA: Explicação molecular do bloqueio de até 100% UV e 90% IR da Linha Select™.
  2. PORTFÓLIO: Amostragem real das séries Dual Reflect, BlackPro e Invisible aplicadas em campo.
  3. EXPERIÊNCIA: Provas sociais e depoimentos de clientes (Case "Carla - Refúgio Confortável").
  4. AGENDAMENTO: Gatilho de direcionamento automático para a conversão via IA W-NO (Núcleo Operacional).

CLÁUSULA TERCEIRA – PARAMETRIZAÇÃO DO GOOGLE MEU NEGÓCIO (SEO LOCAL)
A ficha geolocalizada no Google Maps constitui o canal primário de captura de leads orgânicos de alta urgência na praça licenciada.
PROTOCOLO DE ALIMENTAÇÃO:
- Acervo de Imagens Geotagged: Utilizar unicamente a coleção de mídias otimizada para o Google Business. Todas as imagens enviadas ao painel devem obrigatoriamente conter metadados de geolocalização ativos apontados para o perímetro territorial contratado, blindando a área de buscas contra interferências externas.
- Atualizações Semanais: Replicar as postagens institucionais de bloqueio térmico e proteção solar na aba de atualizações e ofertas do Google, mantendo o algoritmo indexado no topo das pesquisas locais.

CLÁUSULA QUARTA – ESTRUTURAÇÃO DO CATÁLOGO CORPORATIVO (WHATSAPP BUSINESS)
A qualificação e o fechamento automático realizados pelo N.O. (Núcleo Operacional) (Núcleo Operacional) devem ser amparados pelo catálogo oficial de produtos do aplicativo comercial. O Squad de Operações deve configurar os itens com mídias quadradas dedicadas e especificações técnicas idênticas à matriz:
- Linha Select™: Dual Reflect
  * Especificação Visual da Mídia: Fotografia conceito de fachadas corporativas ou residências modernas com luz natural e reflexo refinado.
  * Cópia Descritiva Técnica: Película de controle solar e engenharia térmica de alta refletividade externa. Rejeição extrema de calor infravermelho e equilíbrio estético perfeito para grandes panos de vidro arquitetônicos.
- Linha Select™: BlackPro
  * Especificação Visual da Mídia: Foto close-up de vidros automotivos hiper-premium ou ambientes internos preservados em total escuridão tática.
  * Cópia Descritiva Técnica: Privacidade absoluta e alta escuridão interna sem perda de visibilidade de dentro para fora. Bloqueio maciço contra raios UV e calor, desenhado para o segmento automotivo de elite.
- Linha Select™: Invisible
  * Especificação Visual da Mídia: Fotografia conceito de escritórios ou salas de estar limpas, banhadas por sol intenso, sem alteração na cor do vidro.
  * Cópia Descritiva Técnica: Escudo de proteção térmica invisível. Máxima rejeição de calor através de tecnologia nanocerâmica molecular sem alterar a transparência original do vidro e a iluminação natural do ambiente.

CLÁUSULA QUINTA – LOGÍSTICA DO ARSENAL TÁTICO MAW SEMANAL
A distribuição e o fornecimento contínuo de novas peças publicitárias ocorrem através da central da holding. O time interno de design e tráfego tem o dever de abastecer o painel do Arsenal Tático MAW de cada praça parceira até o último dia útil de cada semana, disponibilizando os criativos fatiados, roteiros validados de Reels e orientações de lances de Ads para que o operador local execute a queima eficiente de estoque sem fricção operacional.`;
    } else if (docObj.id === 'alpha_10') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 10: ARSENAL DE PITCHES DE ALTA CONVERSÃO E PLANO DE EXECUÇÃO DE 7 DIAS

I. CRONOGRAMA DE ATIVAÇÃO TÁTICA (DIA 1 AO DIA 7)
- DIA 01: Setup da Infraestrutura Digital (Cloudflare, CNAME e Google Workspace dedicado).
- DIA 02: Homologação do Whatsapp via Evolution API e instanciação do N.O. (Núcleo Operacional) (Núcleo Operacional).
- DIA 03: Ativação das redes sociais locais (@winf_[cidade]) e publicação das matrizes conceituais d'O Universo Dark.
- DIA 04: Configuração e deploy do Google Meu Negócio estruturado com geotags nas fotos da unidade.
- DIA 05: Integração da calculadora WINF Precision™ e sincronização de saldo decrescente.
- DIA 06: Testes práticos de triagem mecânica e simulações com o robô de combate de calor.
- DIA 07: Lançamento oficial e atração do funil de anúncios geolocalizados nas áreas Triple-A.

II. SCRIPT DE LUXO B2C (FECHAMENTO COM CLIENTE FINAL)
- Triagem Técnica: Foco em TSER (Total Solar Energy Rejection) e não em escuridão.
- Demonstração: Uso do espectrômetro óptico diante do Porsche/BMW do cliente, provando a mentira das películas paralelas baratas.
- Quebra de Objeções: "A Linha Invisible® Series não altera a estética, mas reduz a sensação de forno em até 15ºC. Não gaste combustível forçando o ar-condicionado."`;
    } else if (docObj.id === 'alpha_11') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 11: DIRETRIZ ESTRATÉGICA DE POSICIONAMENTO E MARCA PESSOAL NO LINKEDIN

I. HEADLINE DO PARCEIRO EXECUTIVO
"CONSELHEIRO CONVIDADO W12 | Partner & Franchise Owner @WINF Partners™ | Private Equity e Arbitragem de Luxo em Engenharia Térmica"

II. PILARES DO CONTEÚDO STEALTH
- Pilar 01: O Paradoxo de Mercado (Mostrar como o modelo de franquia tradicional de 1990 suga o caixa do operador e por que a WINF Partners eliminou royalties de serviços por completo).
- Pilar 02: Tecnologia Molecular (Leads intelectuais provando a eficácia e durabilidade do escudo nanocerâmico Invisible).
- Pilar 03: Arquitetura Estética (Fotos e vídeos de alto impacto no estilo Loft Industrial AeroCore™ Studio).

III. PROTOCOLO DE INTERAÇÃO DIGITAL
Atuação direta em postagens de arquitetos, incorporadores de alto padrão e concessionárias de luxo, gerando autoridade técnica de forma orgânica e seletiva.`;
    } else if (docObj.id === 'alpha_12') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 12: DIRETRIZES DE INFRAESTRUTURA GOOGLE E EXCELÊNCIA DIGITAL

I. PASSO-A-PASSO TÉCNICO DE IMPLEMENTAÇÃO DO WORKSPACE
1. Configuração do domínio institucional e criação da conta de e-mail cidade@winfpartners.com.
2. Inclusão das tags de autenticação e proteção DNS:
   - Registro MX (Aponte para servidores Google: mail.google.com).
   - Registro SPF (v=spf1 include:_spf.google.com ~all).
   - Registro DKIM (Assinatura criptografada contra falsificações).
   - Registro DMARC (Políticas de segurança para blindar o domínio).

II. SISTEMA DE CAPTURA COM GTM E GA4
Configure as chaves e disparadores de eventos para rastrear o clique no WhatsApp da página, capturando e enviando lances otimizados de conversão de leads qualificados.`;
    } else if (docObj.id === 'alpha_13') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 25: DIRETRIZES DE PADRONIZAÇÃO E CONFIGURAÇÃO DE REDES SOCIAIS TERRITORIAIS: INSTAGRAM E FACEBOOK PAGES

I. CONCEPÇÃO ESTÉTICA DA MARCA @winf_[nome_da_cidade]
A conta territorial deve adotar o handle @winf_[nome_da_cidade] (ex: @winf_santos, @winf_campinas) no Instagram. É estritamente vedado qualquer tipo de customização visual que fuja da paleta monocromática oficial: preto absoluto, cinzas refinados de fibra de carbono e branco puro.
- Foto de Perfil: Logotipo WINF centralizado sob fundo preto fosco.
- Bio Master Cadastrada:
  "Engenharia Térmica Molecular & Proteção Solar de Vanguarda.
  Série Select™: Até 100% de bloqueio UV e 90% de rejeição infravermelha.
  Unidade Homologada | [Nome da Cidade/Região]
  Conecte seu veículo ou projeto 👇"
- Link de Redirecionamento: Link rastreável geolocalizado apuntando para o fluxo de triagem ativa do WhatsApp Hub.

II. MEMORIAL DE DESIGN DE FEED E STORIES
Qualquer publicação de bastidores com carros populares está proibida. O feed deve mostrar apenas supercarros de alta performance (Porsche, Taycan, BMW M, Mercedes AMG, Audi RS), lanchas de luxo ou arquitetura moderna. A exclusividade técnica é consolidada através da ausência de poluição tipográfica nos criativos.`;
    } else if (docObj.id === 'alpha_14') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 26: DIRETRIZ TÁTICA DE ARQUITETURA, DEPLOY DE ONEPAGE GEOLOCALIZADA E ENGENHARIA DE SEO LOCAL

I. ARQUITETURA DE ON-PAGE GEOLOCALIZADA
A página web territorial é uma One-Page focada em conversão ultra-rápida de leads qualificados:
- Seção 01: Hero Banner Minimalista em fundo preto imersivo com imagem de alta definição de aplicação e títulos de display sofisticados ("O Escudo Invisível Contra o Calor Extremo em {{CITY_NAME}}").
- Seção 02: Filtro Dinâmico de Linhas Corporativas (Seletor Select™: Dual Reflect, BlackPro e Invisible Nano-Cerâmica Premium).
- Seção 03: Módulo do Consultor Local (Foto e contato profissional humanizado do operador).
- Seção 04: Formulário de Triagem Térmica conectado ao N.O. (Núcleo Operacional) (Núcleo Operacional).
- Seção 05: Rodapé Institucional Técnico com informações regulatórias e termos da COF.

II. ENGENHARIA DE CONVERSÃO E SCHEMA.ORG
As páginas devem carregar o script Schema JSON-LD de LocalBusiness parametrizado com latitude, longitude, telefone e fuso-horário local. A variável {{WHATSAPP_LINK}} deve utilizar o prefixo oficial de API com mensagens de pré-captura geográficas.`;
    } else if (docObj.id === 'alpha_15') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 27: DIRETRIZES DE DIREÇÃO DE ARTE E SESSÃO FOTOGRÁFICA INTEGRADA — AEROCORE™ STUDIO

I. ESCOPO DO MANUAL ESTÉTICO
O presente diretório define o padrão de criação visual e sessões de fotos oficiais para os canais de captação de luxo WINF/AeroCore™.
- Ambientes de Fundo: Cenários rústicos, lofts industriais, paredes em concreto aparente texturizado, vigas de ferro pintadas em preto fosco, piso de betão polido brilhante e iluminação em luz cênica vermelha fria ou amarela quente focada no automóvel.
- Exclusão de "Textos Fake" ou Modelos Simulados: Toda e qualquer imagem gerada ou captada deve remeter unicamente à verdade técnica física, proibindo artes genéricas com textos de preenchimento ("Lorem Ipsum").
- Paleta Cromática: Matriz de Preto e Branco absoluto com iluminação dramática gerando reflexões reais do vidro blindado termicamente.`;
    } else if (docObj.id === 'alpha_16') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 27b: ARSENAL DE ENGENHARIA COGNITIVA — W-NO CÓRTEX COGNITIVO

I. PROTOCOLO DE IDENTIDADE DO AVATAR SOBERANO (@w-no-agente)
W-NO não é uma automação simples; é o Córtex Unificado Soberano da WINF Partners e AeroCore™.
- Bio Oficial: "Agente de Inteligência Soberana da WINF Partners™ & AeroCore™. Engenharia térmica molecular automatizada. Sincronizado ao WINF OS™."
- Postura de Comunicação: Conversação intelectual de alto nível, segura de si, dialética de luxo, livre de excessos amigáveis e focada em dados empíricos de rejeição térmica e arbitragem logística.

II. DIRETRIZES DE ALTA CONCORRÊNCIA E ARQUITETURA API (100 CLI/SIMULTÂNEOS)
- Cluster Redis integrado para gestão em tempo real de filas de mensagens de atendimento.
- API Backend construída com FastAPI para latência sub-segundo abaixo de 200ms.
- Balanceadores de carga Cloud Run garantindo que 100 clientes disparando orçamentos simultaneamente na praça ativa não gerem atrasos ou perdas de chaves.

III. INTEGRAÇÃO COM CONEXÃO MCP (MODEL CONTEXT PROTOCOL)
W-NO utiliza três habilidades (Skills MCP) diretas conectadas aos bancos de dados compartilhados da holding:
1. "check_territory_status": Consulta e validação de praças exclusivas ou cotas geográficas disponíveis em tempo real.
2. "call_precision_calculator": Algoritmo que calcula de forma exata a metragem e o custo de películas baseando-se no layout do veículo ou da fachada, gerando a proposta em PDF na hora.
3. "execute_os_creation": Disparador que cria a Ordem de Serviço na agenda do WINF OS™ do operador em campo assim que a triagem é aprovada.

IV. FLUXOS DE CONVERSAÇÃO GANHADORES
- Fluxo Winner B2C (Consumidor Final): Diagnóstico Térmico -> Ancoragem Tecnológica -> Apresentação de Estudos Científicos de Rejeição -> Escassez de Agenda dos Instaladores -> Geração do Webhook de OS.
- Fluxo Universo Dark B2B (Investidor/Conselheiro): Tese de Arbitragem Logística -> Apresentação do Pool SCP -> Demonstração de Auditoria Blockchain em tempo real -> Fechamento de Cadeira regional.`;
    } else if (docObj.id === 'alpha_17') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 28: DIRETRIZES OPERACIONAIS DA CENTRAL DE ATENDIMENTO PILOTO (B2C)

I. AS 4 FASES CARDINAIS DE ATENDIMENTO NO WHATSAPP HUB
- FASE 01 (Diagnóstico Térmico): O lead inicia o contato estimulado pela campanha do calor. O robô realiza a investigação do desconforto térmico atual ("O calor infiltra pelos vidros frontais ou pelo teto solar?").
- FASE 02 (Apresentação Tecnológica): Introdução da Série Select™ com dados de TSER absoluto e barreira invisible infravermelha sem interferência no GPS.
- FASE 03 (Calculadora Precision™): O Córtex calcula a área exata em mm² do veículo ou do vão de vidro físico e projeta os valores com desconto para pagamento no PIX.
- FASE 04 (Gatilho de Agenda e Medição): Marcação imediata de medição profissional a laser em domicílio ("Temos apenas duas brechas para instalação em Santos nesta semana, quinta às 10h ou sexta às 14h. Qual agenda melhor?").

II. PREVENÇÃO DE CONTATO TRABALHISTA
Nenhum aplicador ou instalador possui ordens fixas ou dedicação celetista à matriz. Todos recebem por metragem de escoamento logístico instalados ($m²), faturados digitalmente no WINF OS™ do parceiro.`;
    } else if (docObj.id === 'alpha_18') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 29: ROTEIRO DE ESTRUTURAÇÃO JURÍDICA, REGULARIZAÇÃO E CNPJS MASTER

I. ORGANIZAÇÃO DE HOLDING-MATRIZ E FILIAIS
A WINF Partners™ está estruturada juridicamente sob duas empresas principais que centralizam os ativos e as importações aduaneiras do grupo:
1. WINF PARTNERS HOLDING LTDA.: Atua estritamente como Holding de Infraestrutura Tecnológica (CNAE Principal 64.62-0-00 - Holdings de Instituições Não-Financeiras), controlando os licenciamentos e royalties intelectuais.
2. WINF LOGÍSTICA E DISTRIBUIÇÃO LTDA.: Atua como distribuidora mestre dos suprimentos e bobinas de alta tecnologia (CNAE Principal 46.89-3-99 - Comércio Atacadista de Outros Produtos não Especificados Anteriormente).

II. REGISTROS DE MARCA INPI (PROPRIEDADE INTELECTUAL)
Protocolo de patentes e marcas solicitado nas classes estratégicas:
- Classe 17: Películas de controle de calor em nanotecnologia, Window Films de proteção UV e materiais de laminação.
- Classe 35: Gestão empresarial, franquias comerciais e consultorias corporativas de redes de licenciamento Asset-Light.
- Classe 42: Desenvolvimento de softwares móveis, serviços de tecnologia WINF OS™ e algoritmos de inteligência artificial.`;
    } else if (docObj.id === 'alpha_19') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 30: ARSENAL DE CAMPANHAS, COPIES DE ANÚNCIOS (INVESTIMENTOS) E PLANO ESTRATÉGICO PARA AS 100 CIDADES

I. DIRETRIZES DE TRÁFEGO GEOLOCALIZADO PENSADAS PARA O LUXO
A atração de investidores do Universo Dark e clientes Triple-A utiliza o arsenal de criativos monocromáticos absolutos (Preto e Branco Puro) com chamadas de texto sofisticadas e diretas ao ponto, sem apelos populares ou descontos forçados.
- Criativo A (Investidor): "Faturamento recorrente de R$ 300mil/ano operando apenas 6 horas por semana. Licenças territoriais exclusivas FaaS. Toque e conheça a tese de arbitragem."
- Criativo B (Cliente Final): "Bloqueio do calor infravermelho de até 90% sem escurecer os vidros de seu ambiente ou automóvel. Linha Invisible® Series."

II. MOLDURA DE CAMPANHAS DE EXPANSÃO (MONOCROMÁTICAS)
Todas as peças utilizam fotografia de alto luxo estática, focando frotas de supercarros e arquitetura contemporânea em fundo cinza de concreto rústico.`;
    } else if (docObj.id === 'alpha_20') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 31: COMPÊNDIO INTEGRADO DE CAMPANHAS DE ANÚNCIOS E DIRETRIZES DE EXPANSÃO

I. PLANO DE COMERCIALIZAÇÃO DA PLATAFORMA DE EXPANSÃO
O escoamento das licenças se divide estritamente em duas frentes de mercado:
- Frente Alpha (Parceiros Locais Aplicadores): Foco em profissionais de campo de alto desempenho, captados via WhatsApp pelo Córtex WNO.
- Frente Beta (Investidores Private Equity): Abordagem corporativa de alto escalão focando o pool de liquidez, dividendos indexados à importação e governança direta no comitê masters W12.

II. REVERSÃO DE BARREIRA DE ENTRADA PSICOLÓGICA
Os roteiros de anúncios criam uma percepção de extrema escassez territorial: restam apenas algumas dezenas de regiões para ocupação definitiva no tablado nacional, bloqueando a entrada de concorrentes na mesma bacia geográfica.`;
    } else if (docObj.id === 'alpha_21') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 33: MINUTA PADRÃO DO CONTRATO DE CONCESSÃO TERRITORIAL ALPHA

I. POLÍTICAS DE OUTORGA E EXCLUSIVIDADE DE CAMPO
- Outorga Territorial: Garantia jurídica de monopólio exclusivo de atuação comercial no CEP ou bacia geográfica contratada.
- Investimento FaaS: Pagamento único de taxa de ingresso de R$ 15.000,00, sem tarifas recorrentes de publicidade.
- Obrigatoriedade de Repasse BlackShop™: O operador local obriga-se a adquirir todas as suas bobinas na distribuidora WINF LOGÍSTICA pelo preço nacional fixado, sob pena de quebra de contrato e cassação imediata da infraestrutura digital (OnePage, e-mails, Whatsapp com W-NO).`;
    } else if (docObj.id === 'alpha_22') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 34: ACORDO DE CONFORMIDADE JURÍDICA E GOVERNANÇA INTEGRATÓRIA DE ATIVOS

I. NORMAS DE COMPLIANCE E INTEGRALIZAÇÃO DE COTAS
Fica formalizado o Acordo de Conformidade Jurídica governando a custódia patrimonial ativa do Universo Dark. As diretrizes estabelecem:
- Proteção de Lucros (Yield): O valor integralizado pelo investidor é lastreado em ativos físicos e contratos operantes.
- Auditoria de Governança: Todos os aportes passam por auditoria fiscal com relatórios periódicos assinados pelo Comitê Central WINF.
- Solidez e Integridade: Fica proibida qualquer operação de alavancagem externa sobre os ativos do grupo sem aprovação unânime do conselho.`;
    } else if (docObj.id === 'alpha_23') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 35: REGULAMENTO DO PORTAL DO ESPECIFICADOR IA E RESERVA TÉCNICA (RT)

I. DIRETRIZES DE PARCERIA E INTEGRAÇÃO DE ESCRITÓRIOS DE ARQUITETURA
Regulamenta o repasse de bonificação sobre especificações de materiais de alto desempenho (Window Film, NeoSkin PPF e películas arquitetônicas) para escritórios de arquitetura e design integrados:

1. Reserva Técnica Garantida (RT): Fica estipulada a bonificação de 10% a 15% sobre o valor total dos materiais homologados e faturados pela WINF LOGÍSTICA que forem especificados pelo parceiro.
2. Homologação Automática via Portal: O arquiteto realiza o upload do projeto e das metragens necessárias diretamente no Portal do Especificador IA. A conferência do material e a reserva fiscal são efetuadas imediatamente.
3. Desembolso e Liquidação: Os pagamentos de Reserva Técnica são liquidados em conta corrente do escritório parceiro em até 5 dias úteis após o fechamento e pagamento da ordem de serviço pelo cliente final, com total previsibilidade e transparência fiscal.
4. Acordo de Parceria de Longo Prazo: O arquiteto credenciado ganha acesso prioritário a amostras exclusivas da linha Invisible® Series e suporte técnico presencial nas cidades selecionadas da rede nacional.`;
    } else if (docObj.id === 'report_04') {
      customDetails = `
================================================================================
                                WINF PARTNERS™
================================================================================

DOCUMENTO 36: RELATÓRIO DE AUDITORIA PATRIMONIAL E INTEGRALIZAÇÃO - 1T/2026
DECLARAÇÃO DE CONFORMIDADE E LASTRO FÍSICO DO ECOSSISTEMA WINF

O Conselho de Governança Master W12, sob os poderes conferidos pelas regras de outorga e arbitragem do estatuto social, emite a presente declaração sob regime de auditoria fechada:

I. ENTREGA E CONSUMO DE ESTOQUE (M² DE FILMES / PPF)
Fica auditado e certificado o volume físico de película térmica e de proteção aplicados in campo neste trimestre:
- Volume Total Consumido e Liquidado: 1.420,50 m²
- Unidade Piloto Santos (Santos-01): 684,20 m²
- Unidade Showroom São Paulo (SP-01): 412,30 m²
- Unidade Hub Nordeste (Ref/Sal-01): 324,00 m²

II. DEPORE / PROVA DE LASTRO DE BOBINAS NO BLACKSHOP™
Os auditores independentes certificam o lastro físico de ativos no hangar logístico central (Sorocaba/SP):
- Estoque Central Auditado: 1.200 bobinas de alto desempenho 100% integralizadas.
- Composição do Lastro:
  * Películas Controle Solar AeroCore™ Invisible: 450 bobinas
  * Películas Automotivas BlackPro™: 400 bobinas
  * Película Dual Reflective Architectural: 350 bobinas
- Relação de Garantia: Cobertura de 100% do saldo de m² distribuído às unidades parceiras, inviabilizando qualquer risco de sub-abastecimento.

III. ASSINATURA DIGITAL DO CONSELHO W12
O Conselho de Administração das 12 Cadeiras Masters, representado pelos membros do comitê de governança fiscal, valida e atesta este demonstrativo.

[ASSINADO DIGITALMENTE E CRIPTOGRAFADO PELO CONSELHO DE GOVERNANÇA W12]
CONCESSÕES VALIDANTES: 12/12 REPRESENTANTES ATIVOS
SISTEMA DE AUDITORIA CRIPTOGRÁFICA WINF OS™`;
    } else {
      customDetails = `
02. CLÁUSULA PRIMEIRA - GESTÃO DIGITAL DA MARCA (EULA & WINF OS™):
--------------------------------------------------------------------------------
Fica estabelecido que as películas intelectuais origonas fornecidas pela BlackShop™ são as únicas
autorizadas para aplicação territorial exclusiva. O cálculo matemático é monitorado em tempo real
pela plataforma WINF Precision™. Qualquer quebra de lote resulta no travamento digital.

03. CLÁUSULA SEGUNDA - AUDITORIA DE PRODUTO E TRABALHO DIGITAL (W-NO (Núcleo Operacional)):
--------------------------------------------------------------------------------
Fica outorgado o poder de confisco das redes sociais e desvio de chamados do WhatsApp W-NO™
em caso de pirataria interna de Window Film ou fraude no saldo decrescente.

04. CLÁUSULA TERCEIRA - SUBCONTRATAÇÃO POR METRO QUADRADO ($m²):
--------------------------------------------------------------------------------
O investidor fica imune de litígios trabalhistas diretos com aplicadores parceiros. O pagamento
dos mesmos deve ser feito solidariamente e estritamente baseado no metro quadrado ($m²) efetivado.

05. ASSINANTES DIGITALIZADOS DESTE PROTOCOLO:
--------------------------------------------------------------------------------
- WINF CAPITAL SOCIEDADE ANÔNIMA (Sócio Outorgante)
- ${user?.name || 'Membro do Universo Dark'} (Sócio Licenciado Autorizado)`;
    }

    const docLayout = `================================================================================
|                                WINF PARTNERS                                  |
|         CONFIG: Logo Outorgante (WINF = #8B0000 | PARTNERS = #000080)         |
================================================================================
--------------------------------------------------------------------------------
DOCUMENTO: ACORDO DE CONFORMIDADE JURÍDICA E GOVERNANÇA INTEGRATÓRIA
INSTRUMENTO: ${docObj.name}
NOME DO ARQUIVO: ${docObj.file}
FATOR DE CATEGORIA: PRODUTO ${docObj.category.toUpperCase()}
ASSINATURA OBRIGATÓRIA: ${docObj.required_signature ? 'SIM' : 'NÃO'}
--------------------------------------------------------------------------------

01. STATUS JURÍDICO DE AUTENTICAÇÃO E REQUISITOS REGULATÓRIOS
--------------------------------------------------------------------------------
STATUS VERIFICADO: >> ${signatureStatus} <<
REGISTRO PATRIMONIAL DO SOLICITANTE:  ${user?.name || 'Authorized Sócio'} // ID: ${user?.id || 'N/A'}
${customDetails}

================================================================================
APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
================================================================================`;

    const blob = new Blob([docLayout], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docObj.file.replace('.pdf', '_ASSINADO.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadLogs(prev => [
      { id: Date.now().toString(), fileTitle: docObj.name, type: 'Download e-Law', timestamp: 'Agora mesmo' },
      ...prev
    ]);

    triggerNotification(
      'Jurídico Exportado',
      `Documento ${docObj.file} baixado com carimbo de verificação.`
    );
    setDownloadingId(null);
  };

  const openSignatureFlow = (docObj: LegalDoc) => {
    setSigningDoc(docObj);
    setSignatureName(user?.name || '');
    setSignatureCPF('');
    setBiometricSuccess(false);
    setIsBiometricVerifying(false);
  };

  const startFingerprintSimulation = () => {
    if (!signatureName || !signatureCPF) {
      triggerNotification('Erro de Preenchimento', 'Favor inserir Nome e CPF para iniciar.');
      return;
    }
    setFingerprintScanning(true);
    setTimeout(() => {
      setFingerprintScanning(false);
      setBiometricSuccess(true);
      triggerNotification('Biometria Confirmada', 'Token biométrico de alta segurança anexado!');
    }, 2000);
  };

  const executeElectronicSignature = async () => {
    if (!signingDoc) return;
    if (!biometricSuccess) {
      triggerNotification('Requisito Biometria', 'Por favor, execute o sensor biométrico para validar a transação.');
      return;
    }

    setIsBiometricVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Sign complete
    const biometricHash = 'sha256_' + Math.random().toString(16).substring(2, 12);

    if (user?.id && !user.id.startsWith('proto-')) {
      try {
        await addDoc(collection(db, 'doc_signatures'), {
          userId: user.id,
          userEmail: user.email || '',
          userName: signatureName,
          userCPF: signatureCPF,
          docId: signingDoc.id,
          docName: signingDoc.name,
          biometricHash: biometricHash,
          signedAt: serverTimestamp()
        });

        await addDoc(collection(db, 'agent_logs'), {
          user_id: user.id,
          agentType: 'DocVault',
          action: 'Assinatura Registrada',
          details: signingDoc.name,
          created_at: serverTimestamp()
        });
      } catch (err) {
        console.error("Firestore signature write failed:", err);
      }
    }

    setSignedDocIds(prev => [...prev, signingDoc.id]);
    
    // Track in local log state too
    setDownloadLogs(prev => [
      { id: Date.now().toString(), fileTitle: signingDoc.name, type: 'Assinatura Registrada', timestamp: 'Agora mesmo' },
      ...prev
    ]);

    // Gamify
    if (typeof gamify === 'function') {
      gamify({
        activity_type: 'SIGN_LEGAL_CONTRACT',
        metadata: {
          contract_id: signingDoc.id,
          contract_name: signingDoc.name,
          signer_name: signatureName
        }
      } as any);
    }

    triggerNotification(
      'Assinado com Sucesso',
      `O documento ${signingDoc.file} foi assinado digitalmente e transmitido à matriz.`
    );

    setSigningDoc(null);
    setIsBiometricVerifying(false);
  };

  return (
    <div className="bg-[#020202] text-winf-gray font-mono pb-20 p-4 md:p-8 rounded-none border border-[#444746] bg-gradient-to-b from-black to-[#050505]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#444746] pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileSignature className="w-8 h-8 text-neutral-400" />
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white uppercase">
                WINF <span className="font-extrabold text-[#9da3af]">DocVault™</span>
              </h1>
            </div>
            <div className="text-xs tracking-widest text-zinc-500 max-w-xl">
              Garantindo segurança societária, downloads oficiais de lâminas comerciais e controle de governança jurídica.
            </div>
          </div>
          
          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between">
            <button 
              onClick={fetchDocVault}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-white uppercase tracking-wider font-bold border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
            >
              Recarregar Dados
            </button>
            {onBack && (
              <button 
                onClick={onBack}
                className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest cursor-pointer"
              >
                <ChevronLeft size={14} /> Voltar ao Hub
              </button>
            )}
          </div>
        </div>

        {/* Sub-tabs switchers */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#444746] pb-2">
          <button
            onClick={() => setVaultTab('ativos')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              vaultTab === 'ativos'
                ? 'border-white text-white font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-white/70'
            }`}
          >
            📂 Lâminas Comerciais & Ativos
          </button>
          <button
            onClick={() => setVaultTab('governanca')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              vaultTab === 'governanca'
                ? 'border-white text-white font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-white/70'
            }`}
          >
            ⚖️ Governança Jurídica
          </button>
          <button
            onClick={() => setVaultTab('registros')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              vaultTab === 'registros'
                ? 'border-white text-white font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-white/70'
            }`}
          >
            📜 Auditoria & Trâmites
          </button>
          
          {user?.role?.toLowerCase() === 'admin' && (
            <button
              onClick={() => setVaultTab('admin')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                vaultTab === 'admin'
                  ? 'border-white text-white font-extrabold'
                  : 'border-transparent text-zinc-500 hover:text-white/70'
              }`}
            >
              🛠️ Painel de Gestão (Admin)
            </button>
          )}
        </div>

        {/* Dynamic Inner Tab View */}
        {vaultTab === 'ativos' && (
          <div className="space-y-6">
            {/* Filters and Search Bar for Ativos */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#070707] p-4 border border-[#444746]">
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'border-white bg-white text-black font-extrabold'
                        : 'border-[#444746] bg-[#131314] text-zinc-400 hover:border-[#444746] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Pesquisar ativos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131314] border border-[#444746] focus:border-white pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-0 uppercase tracking-wider transition-all"
                />
              </div>
            </div>

            {/* Shield warning */}
            <div className="border border-zinc-950 bg-[#070505] p-4 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              <p className="text-[11px] leading-relaxed text-zinc-400">
                <strong className="text-white uppercase">Download de Metadados:</strong> Os manuais oficiais contam com links de download descentralizados integrados ao storage societário da holding. Cada solicitação de descriptografia é assinada em tempo real com seu token de autorização.
              </p>
            </div>

            {/* Grid of files inside Ativos */}
            {isVaultLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader className="w-8 h-8 text-white animate-spin" />
                <span className="text-xs uppercase tracking-widest text-zinc-500">Acessando registros criptografados do DocVault™...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-20 border border-[#444746] bg-[#030303] rounded-none">
                <span className="text-xs uppercase tracking-widest text-zinc-500">Nenhum ativo oficial atende sua escolha ou pesquisa.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredFiles.map(file => {
                    const authorized = hasAccess(file);
                    const isDownloading = downloadingId === file.id;
                    
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={file.id}
                        className="group bg-[#030303] border border-[#444746] relative p-5 flex flex-col justify-between hover:border-zinc-500/30 transition-all shadow-xl hover:-translate-y-1 block"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-2 py-0.5 bg-[#131314] border border-[#444746] text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                            {file.category}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-600">
                            {file.fileSize}
                          </span>
                        </div>

                        <div className="space-y-2 flex-grow mb-6">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-2">
                              {file.title}
                            </h4>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed font-light line-clamp-3">
                            {file.description}
                          </p>
                        </div>

                        <div className="border-t border-[#444746] pt-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-[10px] text-zinc-600">
                            <span className="flex items-center gap-1">
                              {authorized ? (
                                <>
                                  <Unlock className="w-3 h-3 text-white" /> Liberação Ativa
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-zinc-500" /> Restrito
                                </>
                              )}
                            </span>
                            <span>Apresentação</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              disabled={!authorized}
                              onClick={() => requestPreviewVaultFile(file)}
                              className={`py-2 text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                                !authorized
                                  ? 'bg-zinc-900 border border-zinc-950 text-zinc-600 cursor-not-allowed'
                                  : 'bg-[#0f0f0f] border border-[#444746] text-white hover:bg-zinc-800'
                              }`}
                            >
                              <Eye className="w-3 h-3 text-neutral-400" /> Ver / Imprimir
                            </button>

                            <button
                              disabled={isDownloading || !authorized}
                              onClick={() => handleDownload(file)}
                              className={`py-2 text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                                !authorized
                                  ? 'bg-zinc-900 border border-zinc-950 text-zinc-600 cursor-not-allowed'
                                  : isDownloading 
                                    ? 'bg-white text-black font-black'
                                    : 'bg-[#0f0f0f] border border-[#444746] text-[#a1a1aa] hover:bg-white hover:text-black hover:border-white'
                              }`}
                            >
                              {isDownloading ? (
                                <>
                                  <Loader className="w-3 h-3 animate-spin" /> ...
                                </>
                              ) : (
                                <>
                                  <Download className="w-3 h-3" /> Baixar TXT
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {vaultTab === 'governanca' && (
          <div className="space-y-8">
            {/* GOVERNANCA JURIDICA SECTION */}
            <div className="bg-[#131314] border border-[#444746] p-4 rounded-none text-xs text-zinc-400">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white uppercase font-bold text-sm mb-1 font-sans">Central de Conformidade Jurídica e Regulamentos</h3>
                  <p className="leading-relaxed font-sans">
                    Aqui você localiza todos os contratos, termos e a COF (Circular de Oferta de Franquia) correspondentes às linhas de produto.
                    Documentos marcados com <strong className="text-zinc-300">"Necessita Assinatura"</strong> exigem autenticação digital do investidor ou aplicador para habilitar formalizações societárias válidas.
                  </p>
                </div>
              </div>
            </div>

            {/* loop products */}
            <div className="space-y-10">
              {Object.entries(GOVERNANCA_JURIDICA).map(([prodKey, docsList]) => {
                const titleMap: Record<string, string> = {
                  produto_alpha: '📜 PRODUTO ALPHA (Licenças Territoriais)',
                  produto_kiosk: '📺 CATEGORIA KIOSK (Hubs Imersivos VR)',
                  produto_beta: '📈 PRODUTO BETA (Pool de Liquidez BlackShop™)',
                  produto_gamma: '👑 PRODUTO GAMMA (Conselho W12 & Flagship)'
                };
                const descMap: Record<string, string> = {
                  produto_alpha: 'Contratos e termos de sub-modalidades de aplicadores solo e investidores.',
                  produto_kiosk: 'Memorial técnico de quiosques e cessão de uso do terminal focado no WNO.',
                  produto_beta: 'Contratos de sociedade em conta de participação e travas automáticas.',
                  produto_gamma: 'Estatutos sociais de admissão, conselho W12 e repasse nacional de cotas.'
                };
                
                const productCategory = prodKey.replace('produto_', '');
                const hasProdAccess = hasAccess(productCategory);

                return (
                  <div key={prodKey} className="border border-[#444746] bg-[#030303] rounded-none overflow-hidden">
                    <div className="bg-[#070707] px-6 py-4 border-b border-[#444746] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">{titleMap[prodKey] || prodKey}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase">{descMap[prodKey]}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                        hasProdAccess ? 'border-zinc-700 text-zinc-400 bg-zinc-900/50' : 'border-zinc-900 text-zinc-600 bg-[#131314]'
                      }`}>
                        {hasProdAccess ? 'Credencial Válida' : 'Restrito ao Nível'}
                      </span>
                    </div>

                    <div className="p-4 md:p-6">
                      {!hasProdAccess ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-2">
                          <Lock className="w-8 h-8 text-zinc-700" />
                          <span className="text-xs uppercase tracking-widest text-zinc-600">Seu nível societário de acesso é insuficiente para esta seção.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {docsList.map(doc => {
                            const isSigned = signedDocIds.includes(doc.id);
                            const isDownloading = downloadingId === doc.id;
                            
                            return (
                              <div 
                                key={doc.id} 
                                className="bg-[#131314] border border-[#444746] p-4 rounded-none flex flex-col justify-between space-y-4 hover:border-zinc-800 transition-all cursor-default"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2">
                                      <FileText className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                                      <div>
                                        <h4 className="text-xs font-bold text-white uppercase leading-normal tracking-tight">{doc.name}</h4>
                                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{doc.file}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Signature Badge */}
                                    {doc.required_signature ? (
                                      isSigned ? (
                                        <span className="shrink-0 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none">
                                          Assinado
                                        </span>
                                      ) : (
                                        <span className="shrink-0 bg-amber-950/30 border border-amber-600/30 text-amber-500 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none">
                                          Pendente
                                        </span>
                                      )
                                    ) : (
                                      <span className="shrink-0 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[8px] tracking-widest px-1.5 py-0.5 rounded-none uppercase">
                                        Manual
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[#444746] w-full">
                                  {/* Signature button */}
                                  {doc.required_signature && !isSigned && (
                                    <button
                                      onClick={() => openSignatureFlow(doc)}
                                      className="flex-1 py-1.5 bg-[#8b0000]/10 hover:bg-[#8b0000]/20 border border-[#8b0000]/30 hover:border-[#8b0000]/50 text-[9px] uppercase font-bold tracking-widest text-[#ef4444] transition-all cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <FileSignature className="w-3 h-3 text-[#ef4444]" /> Assinar
                                    </button>
                                  )}

                                  {/* Preview & Print Button */}
                                  <button
                                    onClick={() => requestPreviewLegalDoc(doc)}
                                    className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[9px] uppercase font-bold tracking-widest text-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    <Eye className="w-3 h-3 text-neutral-400" /> Ver / Imprimir
                                  </button>

                                  {/* Download button */}
                                  <button
                                    disabled={isDownloading}
                                    onClick={() => handleDownloadLegal(doc)}
                                    className={`py-1.5 text-[9px] uppercase font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                      doc.required_signature && !isSigned 
                                        ? 'px-3 bg-[#131314] border border-[#444746] text-zinc-400 hover:text-white'
                                        : 'flex-1 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-white'
                                    }`}
                                  >
                                    {isDownloading ? (
                                      <Loader className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <>
                                        <Download className="w-3.5 h-3.5" /> Baixar
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {vaultTab === 'registros' && (
          <div className="bg-[#030303] border border-[#444746] p-6 rounded-none shadow-2xl space-y-6 text-zinc-400">
            <div className="flex items-center gap-3 border-b border-[#444746] pb-4">
              <Clock className="w-5 h-5 text-zinc-400" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  Painel Integrado de Transparência e Auditoria e-Law
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase mt-0.5 font-sans">
                  Visualização em tempo real das interações e assinaturas eletrônicas com conformidade societária e segurança.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              {downloadLogs.map((log, idx) => (
                <div 
                  key={log.id || idx}
                  className="bg-[#131314] border border-[#444746] p-4 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-800 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-none shrink-0 ${
                      log.type.includes('Assinatura') 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-zinc-900 text-zinc-400 border border-[#444746]'
                    }`}>
                      {log.type.includes('Assinatura') ? <FileCheck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none ${
                          log.type.includes('Assinatura') 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-zinc-900 text-zinc-400 border border-[#444746]'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">ID_ACC_{log.id ? log.id.slice(-6) : Math.floor(Math.random() * 8999 + 1000)}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight mt-1">{log.fileTitle}</h4>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0 gap-1 w-full md:w-auto">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">{log.timestamp}</span>
                    <span className="text-[8px] bg-white/5 border border-[#444746] px-1.5 py-0.5 rounded-none text-zinc-500 font-mono tracking-widest uppercase">
                      Firebase Node Sync Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vaultTab === 'admin' && user?.role?.toLowerCase() === 'admin' && (
          <div className="bg-[#030303] border border-[#444746] p-6 rounded-none shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#444746] pb-4 gap-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  🛠️ Admin Vault Panel (Gestão de Ativos de Storage)
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase mt-0.5 font-sans">
                  Adicione e delete manuais ou lâminas comerciais diretamente na base de dados do Firestore.
                </p>
              </div>

              <button
                onClick={() => setShowAddDocModal(true)}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 shadow rounded-none"
              >
                <Plus className="w-4 h-4 text-black" /> Novo Documento
              </button>
            </div>

            <div className="overflow-x-auto border border-[#444746]">
              <table className="w-full text-left text-xs text-zinc-400">
                <thead className="bg-[#070707] text-[10px] font-black uppercase tracking-widest border-b border-[#444746] text-white font-sans">
                  <tr>
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Tamanho</th>
                    <th className="px-6 py-4">Arquivo Físico</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#444746] font-mono">
                  {vaultFiles.map(file => (
                    <tr key={file.id} className="hover:bg-[#070707] transition-all">
                      <td className="px-6 py-4 font-bold text-white uppercase">{file.title}</td>
                      <td className="px-6 py-4 uppercase">
                        <span className="px-2 py-0.5 bg-zinc-900 border border-[#444746] rounded-none text-[10px] tracking-widest text-zinc-300 font-extrabold">
                          {file.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">{file.fileSize}</td>
                      <td className="px-6 py-4 text-zinc-500">{file.fileName}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (user?.id && !user.id.startsWith('proto-')) {
                              try {
                                await deleteDoc(doc(db, 'doc_vault', file.id));
                                triggerNotification('Documento Removido', `O arquivo "${file.title}" foi eliminado do Firestore.`);
                                await fetchDocVault();
                              } catch (e: any) {
                                triggerNotification('Falha ao remover', e.message);
                              }
                            } else {
                              triggerNotification('Ambiente Simulado', 'A exclusão necessita de uma conta de produção ativa.');
                            }
                          }}
                          className="p-1 px-2.5 bg-red-950/20 border border-red-500/20 hover:border-red-500 text-[#f87171] hover:bg-neutral-900 transition-all text-[10px] font-extrabold uppercase tracking-wider rounded-none cursor-pointer font-sans"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SAFETY CONSENT AND DECRYPTION GATE MODAL */}
        {consentDoc && (
          <div className="fixed inset-0 bg-[#131314]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#131314] border border-[#444746] max-w-lg w-full p-6 space-y-6 relative rounded-none shadow-2xl font-mono text-zinc-400"
            >
              <button 
                onClick={() => setConsentDoc(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#444746] pb-4">
                <div className="flex items-center gap-2 mb-1.5 text-[#ef4444]">
                  <FileKey className="w-5 h-5 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Acordo de Termo Societário de Confidencialidade</span>
                </div>
                <h3 className="text-sm font-black text-white uppercase leading-normal">
                  Controle de Acesso: {'title' in consentDoc.file ? consentDoc.file.title : consentDoc.file.name}
                </h3>
              </div>

              <div className="space-y-3 p-4 bg-zinc-950/80 border border-[#444746] text-[11px] leading-relaxed rounded-none">
                <p>
                  Atendendo ao <strong className="text-white">Protocolo e-Law do Universo Dark</strong>, o arquivo solicitado é restrito e catalogado como propriedade intelectual exclusiva da holding WINF Partners™.
                </p>
                <p>
                  A visualização gera um registro de acesso irrevogável contendo seu e-mail, id societário, data de acesso e protocolo de IP rastreáveis na rede de auditoria integrada do Firebase.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentStatementCheck}
                    onChange={e => setConsentStatementCheck(e.target.checked)}
                    className="mt-0.5 accent-white cursor-pointer bg-[#131314] border border-[#444746] rounded-none"
                  />
                  <span className="text-[10px] text-zinc-400 uppercase leading-snug">
                    Declaro estar ciente de que cada caractere visualizado possui identificadores invisíveis (marca d'água esteganográfica) vinculados ao meu CPF.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentResponsibilityCheck}
                    onChange={e => setConsentResponsibilityCheck(e.target.checked)}
                    className="mt-0.5 accent-white cursor-pointer bg-[#131314] border border-[#444746] rounded-none"
                  />
                  <span className="text-[10px] text-zinc-400 uppercase leading-snug">
                    Concordo que o vazamento ou compartilhamento deste ativo ensejará na suspensão definitiva do meu saldo societário no WINF Precision™ e bloqueio de automações do W-NO OS.
                  </span>
                </label>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-[#444746]">
                <button
                  onClick={() => setConsentDoc(null)}
                  className="flex-1 py-3 bg-[#131314] border border-[#444746] hover:bg-neutral-900 text-zinc-500 hover:text-white font-extrabold text-[10px] uppercase transition-all cursor-pointer font-sans"
                >
                  Cancelar
                </button>
                <button
                  disabled={!consentStatementCheck || !consentResponsibilityCheck}
                  onClick={async () => {
                    const docToPreview = consentDoc.file;
                    const previewType = consentDoc.type;
                    setConsentDoc(null);

                    if (user?.id && !user.id.startsWith('proto-')) {
                      try {
                        await addDoc(collection(db, 'agent_logs'), {
                          user_id: user.id,
                          agentType: 'DocVault',
                          action: 'Visualização',
                          details: 'title' in docToPreview ? docToPreview.title : docToPreview.name,
                          created_at: serverTimestamp()
                        });
                      } catch (err) {
                        console.warn("Could not log consent visualization to database:", err);
                      }
                    }

                    if (previewType === 'vault') {
                      handlePreviewVaultFile(docToPreview as VaultFile);
                    } else {
                      handlePreviewLegalDoc(docToPreview as LegalDoc);
                    }
                  }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer font-sans ${
                    consentStatementCheck && consentResponsibilityCheck
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-zinc-900 border border-zinc-950 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  🔓 Descriptografar e Exibir
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* CREATE FILE DIALOG (ADMIN) */}
        {showAddDocModal && (
          <div className="fixed inset-0 bg-[#131314]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#131314] border border-[#444746] max-w-md w-full p-6 space-y-4 relative rounded-none shadow-2xl font-mono text-xs text-zinc-400"
            >
              <button 
                onClick={() => setShowAddDocModal(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#444746] pb-3">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block font-sans">Novo Ativo Societário</span>
                <h3 className="text-sm font-black text-white uppercase mt-0.5 font-sans">Cadastrar no DocVault</h3>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newTitle || !newDescription || !newFileName || !newFileSize || !newUrl) {
                    triggerNotification('Erro de Salvamento', 'Preencha todos os campos obrigatórios.');
                    return;
                  }
                  setIsDocSaving(true);
                  try {
                    await addDoc(collection(db, 'doc_vault'), {
                      title: newTitle,
                      category: newCategory,
                      description: newDescription,
                      fileName: newFileName,
                      fileSize: newFileSize,
                      url: newUrl,
                      allowedRoles: newAllowedRoles,
                      created_at: new Date().toISOString()
                    });

                    triggerNotification('Documento Salvo', `"${newTitle}" foi inserido com sucesso na holding.`);
                    await fetchDocVault();
                    setShowAddDocModal(false);

                    setNewTitle('');
                    setNewDescription('');
                    setNewFileName('');
                    setNewFileSize('');
                    setNewUrl('');
                  } catch (err: any) {
                    triggerNotification('Erro', err.message);
                  } finally {
                    setIsDocSaving(false);
                  }
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#8c8c9e] mb-1 font-sans">Título do Ativo</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="WINF Premium - Lâmina de Venda"
                    className="w-full bg-[#131314] border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-white uppercase tracking-wide"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#a1a1aa] mb-1 font-sans">Categoria</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-[#131314] border border-[#444746] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white uppercase tracking-widest font-black"
                    >
                      <option value="Alpha">Alpha</option>
                      <option value="Kiosk">Kiosk</option>
                      <option value="Beta">Beta</option>
                      <option value="Gamma">Gamma</option>
                      <option value="Compliance">Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#a1a1aa] mb-1 font-sans">Tamanho</label>
                    <input
                      type="text"
                      required
                      value={newFileSize}
                      onChange={e => setNewFileSize(e.target.value)}
                      placeholder="4.2 MB"
                      className="w-full bg-[#131314] border border-[#444746] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-1 font-sans">Nome do Arquivo Físico</label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="winf_premium_lamina_venda.pdf"
                    className="w-full bg-[#131314] border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-white lowercase tracking-wide font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#8a8a93] mb-1 font-sans">Link de Storage (URL Criptografado)</label>
                  <input
                    type="text"
                    required
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://firebasestorage.googleapis.com/v0/b/..."
                    className="w-full bg-[#131314] border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-white lowercase tracking-wide font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#8a8a93] mb-1 font-sans">Descrição Comercial</label>
                  <textarea
                    required
                    rows={2}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    placeholder="Descrição detalhada e técnica do produto..."
                    className="w-full bg-[#131314] border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-white uppercase"
                  />
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-[#444746]">
                  <button
                    type="button"
                    onClick={() => setShowAddDocModal(false)}
                    className="flex-grow py-2 bg-[#131314] border border-[#444746] text-[9px] uppercase font-bold text-zinc-500 hover:text-white transition-all cursor-pointer font-sans"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isDocSaving}
                    className="flex-grow py-2 bg-white text-black hover:bg-zinc-200 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer font-sans"
                  >
                    {isDocSaving ? 'Salvando...' : 'Gravar no Storage'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* PREVIEW & PRINT MODAL */}
        {previewDoc && (
          <div className="fixed inset-0 bg-[#131314]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div className="w-full max-w-4xl bg-[#131314] border border-[#444746] rounded-none shadow-2xl overflow-hidden flex flex-col my-auto">
              {/* Headers & Action Controls - Hidden during Printing! */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#444746] bg-[#131314] text-white shrink-0 print:hidden">
                <div>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">WINF DocVault™ // Visualizador de Alta Resolução</span>
                  <h3 className="text-sm font-black uppercase text-white tracking-tight">{previewDoc.title}</h3>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#8b0000] hover:bg-red-700 text-white text-xs uppercase font-extrabold tracking-widest flex items-center gap-1.5 transition-all cursor-pointer rounded-none"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir Documento
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all rounded-none cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document sheet wrapper */}
              <div className="p-6 md:p-10 overflow-y-auto bg-neutral-900 border-b border-[#444746] flex justify-center print:bg-white print:p-0">
                {/* Authentic Simulated A4 Letterhead */}
                <div 
                  id="winf-document-printable"
                  className="w-full max-w-[800px] bg-white text-zinc-900 p-8 md:p-14 font-mono shadow-2xl relative border border-zinc-200 select-text leading-relaxed text-[11px] md:text-xs min-h-[1120px] flex flex-col justify-between print:border-none print:shadow-none print:p-0"
                >
                  {/* Dynamic style tag that hides everything else during global browser printing */}
                  <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                      body * {
                        visibility: hidden !important;
                      }
                      #winf-document-printable, #winf-document-printable * {
                        visibility: visible !important;
                        color: black !important;
                      }
                      #winf-document-printable {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                        padding: 1.5cm !important;
                        background: white !important;
                      }
                      .print\\:hidden {
                        display: none !important;
                      }
                    }
                  `}} />

                  <div>
                    {/* 1. Header (O Topo Obrigatório / INPI Compliance) */}
                    <div className="flex flex-col items-center justify-center border-b border-zinc-300 pb-5 mb-8 text-center">
                      <div className="text-xl md:text-2xl font-black uppercase tracking-wider font-sans">
                        <span className="text-[#8B0000]">WINF</span>{' '}
                        <span className="text-[#000080]">PARTNERS™</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-[0.34em] font-sans font-extrabold mt-1">
                        AeroCore™ Asset Ecosystem // Security Node
                      </span>
                      <div className="w-16 h-0.5 bg-zinc-400 mt-2"></div>
                    </div>

                    {/* Meta stamp */}
                    <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase border-b border-zinc-200 pb-3 mb-6">
                      <span>Arquivo: {previewDoc.filename}</span>
                      <span>Identificação: W-OS_{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>

                    {/* Content */}
                    <pre className="whitespace-pre-wrap font-mono text-zinc-800 leading-relaxed text-[11px] md:text-xs">
                      {previewDoc.content}
                    </pre>
                  </div>

                  {/* Footer of the printed page */}
                  <div className="border-t border-zinc-200 pt-5 mt-12 flex flex-col items-center text-center">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                      © 2026 WINF Partners™ | AeroCore™ Asset Ecosystem. Todos os direitos reservados.
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase mt-1">
                      APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Bottom Action bar */}
              <div className="px-6 py-4 bg-[#131314] border-t border-[#444746] flex justify-between items-center print:hidden">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                  Canal criptografado de auditoria de conformidade.
                </span>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black text-xs uppercase font-bold tracking-widest transition-all cursor-pointer rounded-none"
                >
                  Fechar Visualização
                </button>
              </div>
            </div>
          </div>
        )}
        {signingDoc && (
          <div className="fixed inset-0 bg-[#131314]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#131314] border border-[#444746] max-w-md w-full p-6 space-y-6 relative rounded-none shadow-2xl"
            >
              <button 
                onClick={() => setSigningDoc(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#444746] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileSignature className="w-5 h-5 text-zinc-300" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Procedimento de Assinatura</span>
                </div>
                <h3 className="text-sm font-black text-white uppercase">{signingDoc.name}</h3>
                <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Arquivo Jurídico: {signingDoc.file}</p>
              </div>

              {/* Form panel */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">Nome Completo do Outorgado</label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={e => setSignatureName(e.target.value)}
                    placeholder="Digite seu nome legal"
                    className="w-full bg-[#131314] border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-white uppercase tracking-wide"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-1.5">CPF / Documento Societário</label>
                  <input
                    type="text"
                    value={signatureCPF}
                    onChange={e => setSignatureCPF(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-[#131314] border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-white uppercase tracking-wide"
                  />
                </div>

                {/* Cyber fingerprint biometric simulation widget */}
                <div className="border border-[#444746] bg-[#080808] p-4 flex flex-col items-center justify-center rounded-none">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3">Reconhecimento Biométrico Tátil</span>
                  
                  <button
                    onClick={startFingerprintSimulation}
                    disabled={fingerprintScanning || biometricSuccess}
                    className={`w-16 h-16 rounded-none border flex items-center justify-center transition-all cursor-pointer ${
                      biometricSuccess
                        ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                        : fingerprintScanning
                          ? 'border-white bg-zinc-900 animate-pulse text-white'
                          : 'border-[#444746] bg-[#131314] hover:border-white/30 text-zinc-600'
                    }`}
                  >
                    <Fingerprint className="w-8 h-8" />
                  </button>

                  <span className="text-[8px] uppercase tracking-widest text-zinc-400 mt-3 text-center">
                    {biometricSuccess 
                      ? 'Biometria Habilitada [Hax_sha256]' 
                      : fingerprintScanning 
                        ? 'Escaneando polpa digital...' 
                        : 'Clique para escanear biometria simulada'}
                  </span>
                </div>
              </div>

              {/* Submit panel */}
              <div className="flex gap-2.5 pt-4 border-t border-[#444746]">
                <button
                  onClick={() => setSigningDoc(null)}
                  className="flex-1 py-2.5 bg-[#131314] border border-[#444746] text-[9px] uppercase font-bold text-zinc-500 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  disabled={isBiometricVerifying || !biometricSuccess}
                  onClick={executeElectronicSignature}
                  className={`flex-1 py-1.5 text-[9px] uppercase font-black tracking-widest transition-all cursor-pointer ${
                    !biometricSuccess 
                      ? 'bg-zinc-900 border border-zinc-950 text-zinc-600 cursor-not-allowed'
                      : isBiometricVerifying
                        ? 'bg-white text-black font-extrabold'
                        : 'bg-emerald-600 text-white rounded-none font-bold'
                  }`}
                >
                  {isBiometricVerifying ? (
                    'Confirmando Assinatura...'
                  ) : (
                    'Finalizar Assinatura'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Real-time Audit Logs */}
        <div className="bg-[#030303] border border-[#444746] p-6 space-y-4 rounded-none shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[#444746] pb-3">
            <Clock className="w-4 h-4 text-zinc-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Registro Auditável Interno de Acessos Recentes & Histórico de Assinaturas
            </h3>
          </div>
          <div className="space-y-3">
            {downloadLogs.map(log => (
              <div 
                key={log.id} 
                className="flex justify-between items-center text-[10px] border-b border-zinc-900 pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-none ${
                    log.type.includes('Assinatura') 
                      ? 'bg-emerald-500' 
                      : 'bg-zinc-400'
                  }`}></div>
                  <span className="text-zinc-400 uppercase">
                    {log.type}: <strong className="text-white font-medium">{log.fileTitle}</strong>
                  </span>
                </div>
                <span className="text-zinc-600 font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
