export const GROWTH_DATA = [
  { step: '1Q25', arr: 1.2, equity: 15, dividend: 0.2 },
  { step: '2Q25', arr: 4.5, equity: 18, dividend: 1.5 },
  { step: '3Q25', arr: 12.8, equity: 24, dividend: 5.2 },
  { step: '4Q25', arr: 28.5, equity: 31, dividend: 14.0 },
  { step: '1Q26', arr: 50.0, equity: 45, dividend: 25.0 },
  { step: '2Q26', arr: 75.0, equity: 68.5, dividend: 42.0 },
  { step: '3Q26', arr: 112.5, equity: 92.0, dividend: 58.5, note: 'Global Launch' },
];

export const ASSET_LIGHT_STATUS = {
  sold: 3,
  total: 100,
  waitlist: 312,
  averageProfit: 'BRL 1.250,00',
  nextBatch: '3º Trimestre / 2026'
};

export const ROADMAP = [
  {
    phase: 'Fase 1: Domínio Nacional',
    status: 'Concluído',
    items: ['Consolidação de Praças Polo (BR)', 'Ativação de 100+ Asset Lights', 'Validação do Modelo FaaS']
  },
  {
    phase: 'Fase 2: Internacionalização',
    status: 'Em Execução',
    items: ['Exportação FaaS (EUA e Europa)', 'Faturamento Multi-moeda (USD/EUR)', 'Hubs Logísticos Internacionais']
  },
  {
    phase: 'Fase 3: Evento de Saída M&A',
    status: 'Planejamento',
    items: ['Liquidez Global via Private Equity', 'Fusão Estratégica com Fabricante', 'Exit Multiplicador (Unicórnio)']
  }
];

export const REPORTS = [
  { id: 1, title: 'Relatório Financeiro 2T/2026 (Estimativa)', date: '12/05/2026', type: 'PDF' },
  { id: 2, title: 'Distribuição de Rendimentos da Rede 1T', date: '15/04/2026', type: 'Planilha' },
  { id: 3, title: 'Auditoria de Transparência Operacional', date: '10/03/2026', type: 'PDF' },
  { id: 4, title: 'Relatório de Auditoria Trimestral Consolidado - 1T/2026', date: '29/05/2026', type: 'Auditoria' }
];

export const RECENT_TRANSACTIONS = [
  { id: 'tx_01', user: 'Investidor #088', action: 'Compra de Cotas [ALGT.NA]', value: 'BRL 15.000,00', time: '2h atrás' },
  { id: 'tx_int_01', user: 'Global Partner #LIS', action: 'Ativação FaaS Lisboa', value: 'EUR 2.500,00', time: '3h atrás' },
  { id: 'tx_02', user: 'Investidor #012', action: 'Reinvestimento BlackShop', value: 'BRL 5.420,00', time: '5h atrás' },
  { id: 'tx_int_02', user: 'Miami Hub #MIM', action: 'Import Batch [US.EAST]', value: 'USD 12.450,00', time: '8h atrás' },
  { id: 'tx_03', user: 'Winf Smart Contract', action: 'Pagamento de Dividendos #042', value: 'BRL 1.850,00', time: '12h atrás' },
  { id: 'tx_04', user: 'Investidor #201', action: 'Setup de Studio AeroCore', value: 'BRL 50.000,00', time: '1d atrás' },
];

export const INVESTMENT_RULES = [
  { title: 'Janela de Resgate', desc: 'Saques de lucros (Yield) são liberados todo dia 05 de cada mês automaticamente.' },
  { title: 'Lock-up de Capital', desc: 'O aporte principal possui carência de 12 meses para garantir a estabilidade do estoque BlackShop.' },
  { title: 'Liquidez Secundária', desc: 'É permitido vender sua cota Asset Light para outros membros aprovados após o 6º mês.' },
  { title: 'Taxa de Saque', desc: '0% para saques programados. 10% de taxa administrativa para resgates emergenciais fora da janela.' }
];

export const INVESTMENT_POOLS = [
  {
    id: 'alpha_license',
    name: 'Produto Alpha: Licença Territorial [WINF.ALPHA]',
    type: 'Franchise-as-a-Service (FaaS) Nível 1',
    available: 'R$ 15.000 (Unit)',
    min: 'R$ 15.000',
    roi: 'R$ 300k+ Anuais (Benchmark Santos)',
    risk: 'Extremamente Baixo',
    progress: 92,
    description: 'Licença Territorial com órbita digital pré-provisionada (Instagram, WhatsApp, subdomínio e Google Meu Negócio) pronta para rodar.',
    payback: 'Rápido Retorno',
    structure: 'FaaS Model (No Royalties on Services)',
    thesis: 'Modelo que inverte a lógica de franchising de 1990. O operador do território escoa de 100 a 200 metros lineares/mês trabalhando apenas 6 horas semanais em aplicações práticas de altíssima margem, com repasse integral e obrigatório via BlackShop™.',
    docs: ['Alpha_FaaS_Model.pdf', 'Territorial_License_Setup.pdf'],
  },
  {
    id: 'beta_liquidity',
    name: 'Produto Beta: Pool BlackShop™ [BSHP.BETA]',
    type: 'Quota de Liquidez / Financiamento de Importação',
    available: 'A partir de R$ 50.000',
    min: 'R$ 50.000',
    roi: 'Média de 10% a 15% mensais sobre giros',
    risk: 'Baixo (Repasse Global Lastreado)',
    progress: 74,
    description: 'Cotas para o pool de liquidez da BlackShop™, financiando a importação em escala diretamente da Ásia (China e Coreia do Sul) para capturar o spread de distribuição física.',
    payback: 'Rendimento Trimestral',
    structure: 'Quota de Participação de Importação em Escala',
    thesis: 'Seja o financiador da BlackShop™. O investidor compra participação no capital de giro exclusivo da rede de Window Films de alto desempenho, capturando o spread de distribuição da importação direta para os Autorizados obrigados contratualmente.',
    docs: ['Blackshop_Beta_Liquidity_Pool.pdf', 'Asia_Supply_Chain_Spread.pdf'],
  },
  {
    id: 'gamma_council',
    name: 'Produto Gama: Conselho W12 [W12.BR]',
    type: 'Conselheiro & Hub Regional [W12]',
    available: 'R$ 250.000',
    min: 'R$ 250.000',
    roi: 'Profit Share Regional + Conselho',
    risk: 'Moderado',
    progress: 16,
    description: 'Compra direta de assento no Conselho W12 composto por 12 cadeiras, transformando sua operação em Hub Regional de Distribuição Física com dividendos sob toda a macrorregião.',
    payback: 'Médio / Longo Prazo',
    structure: 'Assento no Conselho Global + Regional Hub Share',
    thesis: '10 cadeiras abertas de Private Equity para formar o Conselho de 12 cadeiras (2 fundadores + 10 conselheiros). O assento transforma a unidade em Hub Regional físico da BlackShop™ com comissão e Profit Share sobre toda a sua zona de influência.',
    docs: ['W12_Board_Statute.pdf', 'Regional_Hub_Logistics_Agreement.pdf'],
  }
];

export const W12_SEATS_DATA = [
  { id: 1, r: 'Cadeira 01: Santos (SP) / Litoral', role: 'Gestão Central (WINF)', status: 'occupied', price: 'R$ 250.000', code: 'BR-01', owner: 'tiago.ceo@winf.com.br' },
  { id: 2, r: 'Cadeira 02: Campina Grande (PB) / Paraíba', role: 'Parceiro Operacional', status: 'occupied', price: 'R$ 15.000', code: 'BR-02', owner: 'tiago.anjos@winf.com.br' },
  { id: 3, r: 'Cadeira 03: Sorocaba (SP) / Cadeira W12 (Board)', role: 'Diretoria Estratégica Interior', status: 'occupied', price: 'R$ 250.000', code: 'BR-03', owner: 'diretoria.sorocaba@winf.com.br' },
  { id: 4, r: 'Cadeira 04: Região Sul (PR, SC, RS)', role: 'Gestão Regional Sul', status: 'available', price: 'R$ 350.000', code: 'BR-04' },
  { id: 5, r: 'Cadeira 05: Rio de Janeiro (RJ) e ES', role: 'Gestão Regional Rio e ES', status: 'available', price: 'R$ 300.000', code: 'BR-05' },
  { id: 6, r: 'Cadeira 06: Minas Gerais (MG)', role: 'Gestão Regional Minas Gerais', status: 'available', price: 'R$ 250.000', code: 'BR-06' },
  { id: 7, r: 'Cadeira 07: Mato Grosso (MT) e MS', role: 'Gestão Regional Centro-Oeste', status: 'available', price: 'R$ 250.000', code: 'BR-07' },
  { id: 8, r: 'Cadeira 08: Goiás (GO) e DF', role: 'Gestão Regional Goiás e DF', status: 'available', price: 'R$ 250.000', code: 'BR-08' },
  { id: 9, r: 'Cadeira 09: Pernambuco (PE) e Litoral Nordeste', role: 'Gestão Regional Nordeste 1', status: 'available', price: 'R$ 200.000', code: 'BR-09' },
  { id: 10, r: 'Cadeira 10: Bahia (BA) e Sergipe (SE)', role: 'Gestão Regional Nordeste 2', status: 'available', price: 'R$ 200.000', code: 'BR-10' },
  { id: 11, r: 'Cadeira 11: Ceará (CE), RN e PI', role: 'Gestão Regional Nordeste 3', status: 'available', price: 'R$ 200.000', code: 'BR-11' },
  { id: 12, r: 'Cadeira 12: Região Norte (AM, PA e demais)', role: 'Gestão Regional Norte', status: 'available', price: 'R$ 150.000', code: 'BR-12' },
];

export const CPL_REGIONAL_DATA = [
  { region: 'SP Metro', cpl: 4.80, clicks: 12500, leadVolume: 920 },
  { region: 'Rio Litoral', cpl: 5.20, clicks: 8400, leadVolume: 610 },
  { region: 'SUL Central', cpl: 4.10, clicks: 9800, leadVolume: 740 },
  { region: 'NE Polo I', cpl: 3.50, clicks: 11000, leadVolume: 850 },
  { region: 'Centro-Oeste', cpl: 4.90, clicks: 7200, leadVolume: 510 },
  { region: 'Norte Hub', cpl: 3.20, clicks: 5400, leadVolume: 420 },
];

export const CITIES_LIST = [
  { city: 'Santos (SP)', status: 'Bloqueado', key: 'winf_alpha_santos_2026_xa91' },
  { city: 'Sorocaba (SP)', status: 'Bloqueado', key: 'winf_alpha_soro_2026_x89a' },
  { city: 'São Paulo (SP)', status: 'Bloqueado', key: 'winf_alpha_sp_2026_x77c' },
  { city: 'Campina Grande (PB)', status: 'Centro de TI / Ocupado', key: 'winf_alpha_cg_2026_x124' },
  { city: 'Porto Alegre (RS)', status: 'Em Triagem', key: 'winf_alpha_poa_tmp_x992' },
  { city: 'Rio de Janeiro (RJ)', status: 'Bloqueado', key: 'winf_alpha_rj_2026_xc39' },
  { city: 'Salvador (BA)', status: 'Em Triagem', key: 'winf_alpha_salv_tmp_x411' },
  { city: 'Belo Horizonte (MG)', status: 'Livre', key: '' },
  { city: 'Curitiba (PR)', status: 'Livre', key: '' }
];
