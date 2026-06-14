import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, CheckCircle2, Lock, FileSignature } from 'lucide-react';

interface ModuleExecutiveDocsProps {
  onBack: () => void;
}

export const ModuleExecutiveDocs: React.FC<ModuleExecutiveDocsProps> = ({ onBack }) => {
  const [activeDoc, setActiveDoc] = useState(1);

  const handleDownload = () => {
    const docContent = `================================================================================
WINF GLOBAL ECOSYSTEM™ | CADERNOS EXECUTIVOS DE INFRAESTRUTURA E FRANQUIAS (FAAS)
CLASSIFICAÇÃO: CONFIDENCIAL / USO SOCIETÁRIA E EXPANSÃO INTEGRAÇÃO
DATA DE ATUALIZAÇÃO / SINCRO: 24/05/2026
================================================================================

--------------------------------------------------------------------------------
DOCUMENTO 01: MANIFESTO EXECUTIVO E POSICIONAMENTO ESTATUTÁRIO
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: USO JURÍDICO INTERNO E ESCRITÓRIO DE EXPANSÃO

1. NATUREZA JURÍDICA E ESCOPO DA HOLDING
Fica expressamente definido para fins de estatuto comercial, registro de Franquia (Lei 13.966/2019) e Licenciamento que a WINF CAPITAL™ (WINF Partners™) atua estritamente como uma Holding de Infraestrutura Tecnológica, Controladora de Engenharia Térmica e Licenciadora Estratégica de Marca.

A detentora abstém-se formalmente da prestação direta de serviços de instalação automotiva ou arquitetônica. Sua operação matriz é o fornecimento intelectual, algorítmico, e de software de gestão (WINF OS™), garantindo a proteção e distribuição de suprimentos por meio de sua malha validada para os operadores licenciados e franqueados da rede.

2. ESTRUTURA DE MONETIZAÇÃO E RECEITAS DA MATRIZ (HOLDING DE INFRAESTRUTURA)
O modelo de captação de recursos operacionais da WINF CAPITAL™ lastreia-se nas seguintes verticais escaláveis:

A. Licenciamento de Tecnologia de Infraestrutura (WINF OS™):
Cobrança de licenciamento mensal (BRL 149,00 a BRL 499,00) compulsório atribuído a todos os perfis ativos da rede (Asset Light, Kiosk e Studio) correspondente ao direito de navegação e uso das inteligências do algoritmo de cálculo e gestão de Leads.

B. Arbitragem e Take Rate Logístico (BlackShop™ Spread):
Rendimento recorrente oriundo da importação própria direta e distribuição de bobinas e películas inteligentes nanotecnológicas fracionadas por kit, eliminando royalties societários sobre a mão de obra.

C. Taxa Única de Ativação Territorial (Zero Capex Asset-Light):
Taxa única de ativação territorial de BRL 15.000,00 sem taxa de renovação e livre de custos periódicos adicionais (Isenção total de royalties operacionais e de marketing centralizado).

3. DECLARAÇÃO DE ISENÇÃO DE PASSIVO TRABALHISTA E RESPONSABILIDADE SUBSIDIÁRIA
Todos os parceiros credenciados na modalidade "Asset Light Member", "Regional Hub", "Kiosk" e "Studio AeroCore", atuam como pessoas jurídicas autônomas, mantendo CNPJ próprio e integral responsabilidade sobre seus funcionários, encargos e passivos estaduais. Não há, sob qualquer pretexto, subordinação jurídica, hierárquica-celetista ou vínculo empregatício formal com a holding WINF CAPITAL™.


--------------------------------------------------------------------------------
DOCUMENTO 02: MATRIZ OPERACIONAL (BASE DA C.O.F.)
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: OFERTA DE FRANQUIA E LICENCIAMENTO FAAS

Estruturação primária para composição da Circular de Oferta de Franquia (COF) e Termos de Licenciamento Tecnológico:

PERFIL I: Asset Light Member (Licença de Software & FaaS)
- Formato Jurídico: Termo de Licenciamento de Uso de Infraestrutura Tecnológica (WINF OS™), Ativação FaaS e Cessão Temporária de Marca.
- Exigência Imobiliária: Nenhuma (Zero Capex). Operação estritamente volante e digital.
- Obrigações Contratuais: Manter a assinatura do WINF OS™ ativa; submeter-se estritamente ao código de conduta W-Rank; retirar materiais via BlackShop™; usufruir da isenção de royalties.

PERFIL II: WINF Kiosk™ (Microfranquia)
- Formato Jurídico: Contrato de Franquia Formato Quiosque (Lei 13.966/2019).
- Exigência Imobiliária: Ponto comercial de 6m² a 12m² em shoppings AAA, aeroportos ou hipermercados selecionados.
- Obrigações Contratuais: Pagar Taxa de Franquia de Ingresso; respeitar padronização arquitetônica; operar captação de leads de alta renda.

PERFIL III: Studio AeroCore™ (Conselho Masters W12)
- Formato Jurídico: Contrato de Franquia Completa com Cadeira Consultiva Regional.
- Exigência Imobiliária: Espaço de rua ou galpão comercial de 100m² a 250m² certificado Dust-Free, imitando Loft Industrial Rústico.
- Obrigações Contratuais: Operar como base técnica avançada; respeitar o manual estético rigorosamente; representar a autoridade master de distribuição locoregional.


--------------------------------------------------------------------------------
DOCUMENTO 03: MANUAL DE SUPPLY CHAIN (BLACKSHOP™)
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: REGRAS LOGÍSTICAS E FORNECIMENTO FRACIONADO

O fornecimento de películas em bobinas fechadas está banido das operações diretas. O sistema BlackShop™ impõe um controle de suprimento fracionado guiado por software, mitigando desvios e estoques ociosos.

1. DO FLUXO DE ORDEM DE SERVIÇO (O.S.)
1. O franqueado ou licenciado (Asset Light) gera o orçamento no WINF OS™.
2. Ao aprovar com o cliente, o motor converte a planta ou o veículo em milímetros quadrados precisos (Cálculo Nesting).
3. A ordem de corte é disparada para o Regional Hub mais próximo.
4. O material é cortado milimetricamente pelo plotter central, envelopado em tubo de proteção rígido, e despachado (ou retirado no balcão).

2. DA PROBIÇÃO DE MATERIAIS DE TERCEIROS (Homologação Exclusiva)
É considerada quebra de contrato gravíssima a utilização de materiais concorrentes nas dependências de qualquer WINF Kiosk ou Studio AeroCore. Toda a cadeia de suprimentos é de exclusividade via BlackShop™.


--------------------------------------------------------------------------------
DOCUMENTO 04: GOVERNANÇA GAMIFICADA (W-RANK)
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: COMPLIANCE E PROGRESSÃO DE REDE

O W-Rank é o termômetro de conformidade e reputação algorítmica da rede. A permanência do licenciado ou franqueado na rede não é garantida pelo capital, mas pela aderência pontuada.

Indicadores Positivos (Gain):
- +50 pts: Venda de Contrato AAA
- +30 pts: Upload de Fotos do Check-in
- +20 pts: Avaliação 5 Estrelas no Sistema
- +100 pts: Participação em Treinamentos Matrix / W12

Indicadores Negativos (Loss):
- -100 pts: Atraso de Mensalidade OS
- -200 pts: Acionamento indevido de Garantia
- -500 pts: Uso de logomarca fora do padrão (Vandalismo Visual)
- -1000 pts: Descredenciamento Sumário

Franqueados ou Licenciados cujo W-Rank caia para a zona de risco têm seus acessos a novos Leads corporativos cortados. Se não houver recuperação em 30 dias, a Holding deflagra o Protocolo de Rescisão de Segurança.


--------------------------------------------------------------------------------
DOCUMENTO 05: PROTEÇÃO DE IP E NON-COMPETE
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: BLINDAGEM INTELECTUAL (W-IPD)

Cláusula 1: Propriedade do Código e Artefatos Visuais
Todos os direitos, patentes, marcas registradas, designs de UI/UX, código-fonte (WINF OS™), cálculos térmicos, bem como fotos e renders de marketing de nossa marca pertencem à holding.

Cláusula 2: Kill-Switch Visual em 48 Horas
Em caso de distrato, o letreiro deve ser removido e redes sociais purgadas em 48 horas.

Cláusula 3: Barreira de Não-Concorrência (5 Anos)
O licenciado assina termo abdicando do direito de criar ou fundar marca concorrente de distribuição tecnológica de películas por um período de 5 (cinco) anos.


--------------------------------------------------------------------------------
DOCUMENTO 06: INTEGRAÇÃO COGNITIVA W-NO (Núcleo Operacional) E WINF PRECISION™
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: INTELIGÊNCIA ARTIFICIAL E CONTROLE DE EXPANSÃO

1. ARQUITETURA DO PROJETO W-NO (Núcleo Operacional)
O W-NO (Núcleo Operacional) opera como o braço comercial robótico do ecossistema WINF OS™. Ele herda um córtex conversacional contextual avançado, focado em alta conversão e quebra de objeções baseadas no ParadoxAnalysis. É responsável pela triagem de leads recebidos, síntese e sumarização de áudios de clientes no WhatsApp, e conversão direta em Ordens de Serviço pré-agendadas nos centros técnicos.

2. COMPUTAÇÃO MÉTRICA WINF PRECISION™
Todo cálculo de película consumida segue a matriz de cubagem eletrônica WINF Precision™. Através desse algoritmo, o gasto exato de película é debitado em BRL/m² do saldo decrescente sob demanda. O sistema é blindado com auditoria via blockchain descentralizada. Em caso de desvio no uso de película ou incompatibilidade técnica dolosa, o sistema executa o Soft-Lock ou Lock Remoto da licença em tempo real.


--------------------------------------------------------------------------------
DOCUMENTO 07: ESTATUTO DE GESTÃO E CONSELHO MASTERS W12
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: GOVERNANÇA DE CADEIRAS CORPORATIVAS (PRODUTO GAMMA)

1. ESTRUTURA DO CONSELHO W12
O conselho de alto nível W12 é composto por exatamente 12 (doze) cadeiras diretivas estratégicas e exclusivas: duas pertencentes aos sócios fundadores originais da holding e dez cadeiras abertas a grandes players investidores do Produto Gamma ou operadores de elite que dominam o ranking nacional de mérito técnico da plataforma (\`w_rank_xp\`).

2. DESIGN E PADRÃO ESTÉTICO (LOFT INDUSTRIAL RÚSTICO)
Todos os Hubs e Studios devem obedecer rigorosamente o memorial de arquitetura premium contendo concreto bruto lapidado, tijolos escurecidos aparentes, tubulações de ar-condicionado expostas, iluminação cinematográfica cênica em LED e supercarros de alta performance em exibição contínua.

3. DIVIDENDOS E MODELO DE SCP
Para os investidores do Produto Gamma (Conselheiros W12) ou investidores SCP da BlackShop™, os dividendos e spreads logísticos regionais são liquidados trimestralmente ou sob demanda através de auditoria do volume em metros quadrados escoados de película em toda a macrorregião coberta de forma exclusiva.


--------------------------------------------------------------------------------
DOCUMENTO 08: DOSSIÊ DE TRANSPARÊNCIA E TABELA DE CUSTOS
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: ANEXO OBRIGATÓRIO DE CUSTOS, MARGENS E REGRAS DE TRÁFEGO DO POOL DE LIQUIDEZ (PRODUTO BETA)

1. CADEIA DE SUPRIMENTOS E ARBITRAGEM DE IMPORTAÇÃO
Este documento constitui o anexo financeiro e técnico do Contrato de Sociedade em Conta de Participação (SCP) do Produto Beta. A sustentabilidade e a taxa de retorno distribuída aos investidores cotistas provêm exclusivamente da arbitragem comercial operada pela distribuidora BlackShop™ na importação em larga escala de películas nanotecnológicas originárias do mercado asiático.
O custo bruto de fabricação e desembaraço aduaneiro desses insumos é cotado em moeda estrangeira fracionada por metro quadrado, permitindo à holding uma margem bruta estruturada de repasse ao mercado interno, blindando o pool contra variações locais de inflação.

2. MATRIZ ABERTA DE CUSTOS E REPASSE (BOBINAS PADRÃO 1,52M X 30M)
Abaixo são detalhados os custos de importação, o spread operacional da holding e os valores obrigatórios de aquisição por parte das praças licenciadas autorizadas da rede:
- Série BlackPro (Privacidade automotiva premium): Custo de Imp.: R$ 12,50/m² | Spread Operacional Holding: R$ 22,50/m² | Preço de Compra Autorizado: R$ 35,00/m² | Margem Líquida Estimada do Pool: Média de 64% por lote escoado.
- Série Dual Reflect (Arquitetura e controle térmico): Custo de Imp.: R$ 18,00/m² | Spread Operacional Holding: R$ 27,00/m² | Preço de Compra Autorizado: R$ 45,00/m² | Margem Líquida Estimada do Pool: Média de 60% por lote escoado.
- Série Invisible (Escudo térmico nanocerâmico): Custo de Imp.: R$ 25,00/m² | Spread Operacional Holding: R$ 40,00/m² | Preço de Compra Autorizado: R$ 65,00/m² | Margem Líquida Estimada do Pool: Média de 61% por lote escoado.

3. REGRA MATEMÁTICA DE REINVESTIMENTO COMPULSÓRIO EM ANÚNCIOS
Para assegurar a velocidade do giro de estoque (queima de metros quadrados) e afastar o risco de estagnação de capital em bobinas paradas, fica instituída a trava sistêmica de Ads. Uma fração exata de 10% (dez por cento) de todo o spread bruto apurado pela BlackShop™ na venda de insumos para os licenciados é direcionada na origem para a conta de tráfego pago geolocalizado da respectiva praça.
Esta regra é automatizada via gatilho de API no software WINF OS™: a cada faturamento de bobina efetuado pela matriz, o saldo correspondente de marketing é liberado no gerenciador de anúncios do Google e Meta apontando para a cidade parceira, capturando novos leads que serão convertidos de forma autônoma pela IA W-NO (Núcleo Operacional).

4. MECANISMO DE AUDITORIA DO POOL E PAYOUT
A auditoria e o balanço do Produto Beta não dependem de validações manuais. O investidor cotista possui acesso a um painel analítico centralizado onde pode checar a movimentação volumétrica da distribuidora. Cada Ordem de Serviço finalizada na ponta deduz linearmente o saldo de metros quadrados da bobina associada, registrando um hash imutável na Blockchain. Os dividendos acumulados do Pool de Liquidez são liquidados e distribuídos em conta corrente aos sócios participantes trimestralmente.


--------------------------------------------------------------------------------
DOCUMENTO 09: MANUAL DE ONBOARDING E ROADMAP OPERACIONAL
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: PRODUTO ALPHA: ATIVAÇÃO TERRITORIAL E INTEGRAÇÃO DE UNIDADE ASSET-LIGHT

1. ENGENHARIA FINANCEIRA DE ATIVAÇÃO
O modelo de concessão estabelece o provisionamento da licença territorial Asset-Light mediante o pagamento da Taxa Única de Ativação Territorial no valor de R$ 15.000,00 (quinze mil reais) pelo parceiro homologado.
O Licenciado Autorizado adquire, no ato da compensação, o direito de recebimento de um enxoval físico inicial de insumos da Linha Select™ composto por exatamente 7,50 metros lineares de película de alta performance para cada uma das frentes tecnológicas da marca:
- Dual Reflect: Película arquitetônica de alta rejeição e controle térmico por refletividade.
- BlackPro: Linha de altíssima escuridão interna e privacidade para o segmento automotivo.
- Invisible: Película de engenharia invisível de alta transparência com máximo bloqueio infravermelho.
Nota de Rendimento Técnico: A metragem linear de 7,50 metros fornecida equivale a aproximadamente 11m² (onze metros quadrados) de área útil por linha de produto, desde que rigidamente processada e de acordo com o software de corte de perdas da franqueadora.

2. PROTOCOLO DE ATIVAÇÃO DE TERRITÓRIO
Imediatamente após a confirmação financeira, o operador recebe credenciais exclusivas para acessar a plataforma WINF OS™ e dar início à reserva de seu perímetro. A ativação do território é condicionada ao preenchimento integral do Formulário de Ativação Territorial pela retaguarda do parceiro, fornecendo dados de geolocalização comercial, contatos de campo e informações para o provisionamento dos sistemas.

3. ENTREGA DA ESTRUTURA DIGITAL "TURN-KEY" (em até 48 horas)
- Conta de E-mail Profissional: Endereço corporativo exclusivo para trâmite legal, acesso às ferramentas internas e recebimento de notificações operacionais.
- Google Workspace Hub: Conta Google parametrizada com os canais de dados e ferramentas de produtividade vinculadas à central.
- Google Meu Negócio (SEO Local): Configuração do estúdio geolocalizado nos mecanismos de pesquisa e mapas do Google para captura direta de chamados orgânicos na região homologada.
- Subdomínio de Alta Conversão: Criação de página web individualizada no barramento oficial da holding (ex: suacidade.winfpartners.com).
- Redes Sociais Impulsionadas: Criação, padronização visual sob a identidade AeroCore™ e lançamento de campanhas de tráfego pago iniciais nas principais redes sociais de captação.
- WhatsApp Business + Córtex W-NO (Núcleo Operacional): Envio de linha comercial configurada nativamente com a inteligência artificial proprietária W-NO (Núcleo Operacional), apta a executar o atendimento, triagem e agendamento automático de ordens de serviço 24 horas por dia.

4. FLUXO DE TRABALHO E SUPORTE CONTÍNUO (WINF ACADEMY)
O acoplamento do licenciado ao novo fluxo de rotina ocorre através do programa prático de capacitação da WINF Academy. O operador é treinado unicamente para executar a aplicação técnica das películas originais recebidas, eliminando processos burocráticos. A retaguarda operacional é assistida em tempo real por um modelo híbrido de suporte técnico 24 horas por dia, combinando monitoramento automatizado via inteligência artificial com intervenção de engenharia humana em escala contínua.


--------------------------------------------------------------------------------
DOCUMENTO 10: ROADMAP DE TRAÇÃO, TRANSPARÊNCIA E GOVERNANÇA DE APORTE (V2)
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: DOSSIÊ DE ALOCAÇÃO DE CAPITAL, PROJEÇÕES DE LIQUIDEZ E REGRAS DE SAÍDA (STEALTH/DARK CORPORATE)

1. DIRETRIZES DE ALOCAÇÃO IMEDIATA DE CAPITAL (PÓS-APORTE)
- Pedidos Oficiais Diretos com o Fabricante: Abertura de lotes de importação aduaneira direta com fabricantes de nanotecnologia na Ásia, reduzindo o custo por metro quadrado (FOB) ao menor patamar e maximizando o spread da distribuidora BlackShop™.
- Tração de Marketing e Tráfego Local: Direcionamento estratégico de verba publicitária para o portal central e divisão parametrizada por código para os subdomínios de cada território ativo, alimentando a IA W-NO (Núcleo Operacional) com leads de alto ticket na ponta.
- Enxoval de Apoio Comercial BlackShop™: Produção e fornecimento exclusivo de materiais gráficos (flyers), janelas físicas de amostras, toalhas personalizadas e uniformes profissionais. A venda interna desses insumos para a rede gera uma linha secundária de faturamento e lucro líquido para o Pool de Liquidez.

2. INFRAESTRUTURA FUNDACIONAL E VALIDAÇÃO DOS FUNDADORES
Para assegurar risco zero ao investidor em relação a ativos físicos primários, os fundadores assumem integralmente o desenvolvimento e validação da estrutura inicial de rede:
- Operação Matriz Conceitual: O primeiro Quiosque institucional, o Estúdio AeroCore™ físico, o Centro de Armazenamento e o Hub de Processamento e Treinamento Técnico da WINF Academy serão bancados e geridos inteiramente pelos fundadores originais.
- Escalabilidade de Modelos Validados: Uma vez consolidadas as métricas operacionais e a rotina de faturamento da matriz, a holding iniciará a comercialização nacional dos modelos de Quiosque e Flagship para investidores de larga escala.

3. MATRIZ DE CENÁRIOS DE APORTE E RETORNO FINANCEIRO
Simulação preditiva dividida em três níveis de alocação de capital e suas respectivas métricas de liquidez corporativa:
- Cenário A (Operação Base): R$ 50.000,00 | Destinação tática: Financiamento de rolos iniciais Select™ e ativação de anúncios em até 25 subdomínios de praças polo. Payback: 14 a 16 meses | Retorno: 24% ao ano (Repasses líquidos trimestrais).
- Cenário B (Escala Moderada): R$ 100.000,00 | Destinação tática: Importação direta de contêiner fracionado, produção de merchandising e tráfego focado em 50 praças. Payback: 11 a 13 meses | Retorno: 30% ao ano (Impulsionado por vendas BlackShop™).
- Cenário C (Aceleração Máxima): R$ 250.000,00 | Destinação tática: Importação institucional massiva, estoque regulador nacional de PPF e barreira agressiva de SEO macro. Payback: 8 a 10 meses | Retorno: 36% ao ano (Máxima eficiência aduaneira).

4. GOVERNANÇA, PAYOUTS E MÉTRICAS DE SAÍDA (EXIT)
- Transparência por Código (WINF Precision™): O cotista audita o giro comercial através de um painel analítico com registros digitais integrados à Blockchain. Cada m² de película aplicado em campo deduz automaticamente o estoque do pool e provisiona os lucros reais, garantindo auditoria em tempo real e blindagem em conta escrow corporativa.
- Engenharia de Payouts Trimestrais: Consolidação de resultados e distribuição de lucros realizada de forma líquida e recorrente no encerramento de cada trimestre. Pela estrutura jurídica de SCP (Art. 991 do Código Civil), os repasses ao Sócio Oculto são isentos de tributação na fonte.
- Métricas de Saída Estruturadas (Exit Strategies): Ficam instituídas três janelas claras de liquidez para a retirada ou recompra do capital principal:
    * Janela A (Holding Buyback): Direito de preferência da WINF Partners para recomprar a cota após o período de Payback com prêmio de valorização.
    * Janela B (Liquidação de Estoque): Solicitação de retirada com aviso prévio de 90 dias, sendo o principal liquidado conforme o escoamento aduaneiro físico das bobinas vinculadas.
    * Janela C (Transferência Restrita): Venda autorizada das cotas para terceiros investidores qualificados, mediante aprovação prévia e homologação do Conselho Masters W12.


--------------------------------------------------------------------------------
DOCUMENTO 11: PLANO DE EXPANSÃO MACRO, GATILHOS DE ESCALA E EXIT STRATEGY (M&A)
--------------------------------------------------------------------------------
CLASSIFICAÇÃO: DOSSIÊ DE GOVERNANÇA DE LONGO PRAZO, VISÃO DE FUTURO GEOPOLÍTICO E LIQUIDEZ GLOBAL (UNIVERSO DARK)

1. O ENXOVAL DE ENTREGA EXCLUSIVA AO INVESTIDOR (UNIVERSO DARK)
O investidor participante do ecossistema privado é integrado de forma nativa a uma infraestrutura corporativa de elite de controle patrimonial, recebendo os seguintes ativos operacionais de entrega imediata:
- Acesso ao Dashboard Exclusivo Universo Dark: Painel analítico criptografado que centraliza os dados brutos de faturamento aduaneiro. Disponibilização contínua de relatórios mensais automáticos de auditoria e balanços de escoamento.
- Conta de E-mail Profissional Corporativo: Provisionamento de conta dedicada sob domínio corporativo oficial da holding para comunicações criptografadas de alta governança.
- Biblioteca de Manuais e Dossiês de Transparência: Entrega e homologação de toda a coletânea confidencial (COF, Manuais e Atas do Conselho Masters W12) para alinhamento e blindagem de compliance.

2. EXPANSÃO GEOPOLÍTICA E SELEÇÃO DE CIDADES POLO
A escalabilidade territorial do ecossistema foi projetada sob uma matriz matemática de escassez reversa calculada sobre o território nacional:
- O Tabuleiro das 5.570 Cidades: O território brasileiro conta com exatamente 5.570 municípios. O planejamento estratégico veda a pulverização massiva da marca; a controladoria filtra e seleciona unicamente as cidades polo com maior densidade de PIB real, condomínios Triple-A e frotas concentradas de supercarros.
- Monopólio Territorial por API: À medida que estas praças polo de alto rendimento são ocupadas por licenças Asset-Light ou Quiosques, o sistema WINF OS™ bloqueia as chaves de API daquela região, assegurando monopólio territorial absoluto ao operador e fluxo inelástico de insumos à distribuidora BlackShop™.

3. TRAÇÃO EM ESCALA DINÂMICA: QUIOSQUES E MODELOS ASSET-LIGHT
O crescimento geométrico de volume é estruturado por meio de duas ondas consecutivas de tração e comercialização comercial:
- Onda 01: Venda Massiva de Licenças Asset-Light (Produto Alpha): Injeção capilar rápida de operadores autônomos em campo para queima de metros quadrados de película nanotecnológica, acelerando a receita recorrente logística da distribuidora sem gerar custos fixos estruturais de ponto para a holding.
- Onda 02: Disseminação de Quiosques e Estúdios Físicos: Lançamento planejado das unidades franqueadas de Quiosques Tecnológicos e Hubs Imersivos de VR em shoppings e centros comerciais estratégicos de alta renda, atuando como vitrines institucionais magnéticas de alto ticket.

4. ROADMAP DE INTERNACIONALIZAÇÃO E EXIT STRATEGY (M&A)
A visão terminal da WINF Partners é focada em um evento definitivo de liquidez global via Private Equity, estruturado em três fases progressivas de Valuation:
- Fase 1: Domínio Nacional: Consolidação das praças polo selecionadas no Brasil via modelos Asset-Light e Quiosques, travando a exclusividade da cadeia aduaneira BlackShop™. ARR massiva, previsível e auditada em Blockchain.
- Fase 2: Internacionalização: Exportação do modelo FaaS (Franchise-as-a-Service) e das licenças digitais do WINF OS™ para mercados selecionados das Américas e Europa. Faturamento em moedas fortes (Dólar/Euro).
- Fase 3: Evento de Saída M&A: Abertura de negociação de fusão ou venda de participação majoritária de holding diretamente a fabricante asiático. Liquidez Máxima (Exit) com prêmio de valorização astronômico, multiplicando o capital principal.

================================================================================
FIM DA DOCUMENTAÇÃO SOCIETÁRIA INTEGRADA - DATA CORE SINCRO
================================================================================`;

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CADERNOS_EXECUTIVOS_WINF_CAPITAL.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#020202] min-h-screen text-winf-gray p-8 font-mono pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-winf-gray/20 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileSignature className="w-8 h-8 text-winf-primary" />
              <h1 className="text-3xl font-medium tracking-tight text-white uppercase">Data Core: Cadernos Executivos</h1>
            </div>
            <div className="text-sm tracking-widest text-winf-primary/80">WINF CAPITAL™ | DOCUMENTAÇÃO SOCIETÁRIA E FRANQUIAS</div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleDownload}
              className="px-4 py-2 bg-winf-primary/10 hover:bg-winf-primary text-winf-primary hover:text-black border border-winf-primary/40 rounded-none font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText size={14} /> EXPORTAR CADERNOS (.TXT)
            </button>
            <button onClick={onBack} className="text-winf-gray hover:text-white transition-colors flex items-center cursor-pointer">
               &lt; System Return
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveDoc(1)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 1 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 01: Estatuto e Receitas</span>
              {activeDoc === 1 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(2)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 2 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 02: Matriz Operacional (COF)</span>
              {activeDoc === 2 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(3)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 3 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 03: Logística BlackShop</span>
              {activeDoc === 3 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(4)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 4 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 04: Regras do W-Rank</span>
              {activeDoc === 4 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(5)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 5 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 05: Proteção de IP (NDA)</span>
              {activeDoc === 5 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(6)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 6 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 06: IA W-NO & Precision</span>
              {activeDoc === 6 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(7)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 7 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 07: Conselho Masters W12</span>
              {activeDoc === 7 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(8)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 8 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 08: Dossiê e Custos Beta</span>
              {activeDoc === 8 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(9)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 9 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 09: Onboarding e Roteiro Alpha</span>
              {activeDoc === 9 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(10)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 10 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 10: Roteiro e Governança de Aporte</span>
              {activeDoc === 10 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(11)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 11 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 11: Expansão Macro e Exit M&A</span>
              {activeDoc === 11 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>

            <button 
              onClick={() => setActiveDoc(12)}
              className={`w-full text-left p-4 border transition-colors flex items-center justify-between ${
                activeDoc === 12 ? 'border-winf-primary bg-winf-primary/10 text-white' : 'border-winf-gray/20 bg-[#131314] text-winf-gray/80 hover:bg-winf-gray/5'
              }`}
            >
              <span className="text-xs tracking-wider uppercase font-medium">Doc 12: POP – Implantação Alpha</span>
              {activeDoc === 12 && <CheckCircle2 className="w-4 h-4 text-winf-primary" />}
            </button>
          </div>

          {/* Document Content */}
          <div className="md:col-span-3">
            {activeDoc === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest">DOCUMENTO 01: MANIFESTO EXECUTIVO E POSICIONAMENTO ESTATUTÁRIO</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: USO JURÍDICO INTERNO E ESCRITÓRIO DE EXPANSÃO</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  
                  <div className="space-y-2">
                    <h3 className="text-white font-medium uppercase tracking-wider mb-3">1. NATUREZA JURÍDICA E ESCOPO DA HOLDING</h3>
                    <p className="text-justify indent-8">
                       Fica expressamente definido para fins de estatuto comercial, registro de Franquia (Lei 13.966/2019) e Licenciamento que a WINF CAPITAL™ atua estritamente como uma <strong>Holding de Infraestrutura Tecnológica, Controladora de Engenharia Térmica e Licenciadora Estratégica de Marca</strong>. 
                    </p>
                    <p className="text-justify indent-8">
                       A detentora abstém-se formalmente da prestação direta de serviços de instalação automotiva ou arquitetônica. Sua operação matriz é o fornecimento intelectual, algorítmico, e de software de gestão (WINF OS™), garantindo a proteção e distribuição de suprimentos por meio de sua malha validada para os operadores licenciados e franqueados da rede.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider mb-3">2. ESTRUTURA DE MONETIZAÇÃO E RECEITAS DA MATRIZ (HOLDING)</h3>
                    <p>O modelo de captação de recursos operacionais da WINF CAPITAL™ lastreia-se nas seguintes verticais escaláveis:</p>
                    
                    <ul className="space-y-4 pt-2">
                      <li className="bg-[#131314] border-l-2 border-winf-primary p-4">
                        <strong className="text-white block mb-1">A. Licenciamento de Tecnologia de Infraestrutura (WINF OS™):</strong> 
                        <span className="block mt-1">Cobrança de mensalidade/anuidade compulsória atribuída a todos os perfis da rede (Asset Light, Kiosk e Studio) correspondente ao direito de navegação e uso das inteligências do algoritmo de cálculo e da gestão de Leads.</span>
                      </li>
                      <li className="bg-[#131314] border-l-2 border-winf-primary p-4">
                        <strong className="text-white block mb-1">B. Take Rate Logístico (BlackShop™ Spread):</strong> 
                        <span className="block mt-1">Margem bruta aplicada sobre as Ordens de Serviço (kits de instalação processados e fracionados), atuando como um spread operacional do centro logístico direto, garantindo lucro recorrente sobre cada metro quadrado aplicado globalmente pela rede.</span>
                      </li>
                      <li className="bg-[#131314] border-l-2 border-winf-primary p-4">
                        <strong className="text-white block mb-1">C. Taxa de Franquia (Franchise Fee) e Isenção de Royalties:</strong> 
                        <span className="block mt-1">Capital imobilizado no ato de ingresso das modalidades premium (WINF Kiosk™ e Studio AeroCore™), contando com isenção total de royalties (nosso sistema não cobra royalties sobre o seu faturamento).</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2 mt-8 p-4 bg-winf-primary/5 border border-winf-primary/20">
                    <h3 className="text-white font-medium uppercase tracking-wider mb-2">3. DECLARAÇÃO DE ISENÇÃO DE PASSIVO TRABALHISTA E RESPONSABILIDADE SUBSIDIÁRIA</h3>
                    <p className="text-justify text-xs uppercase leading-loose text-winf-primary">
                       Todos os parceiros credenciados na modalidade "Asset Light Member", "Regional Hub", "Kiosk" e "Studio AeroCore", atuam como pessoas jurídicas autônomas, mantendo CNPJ próprio e integral responsabilidade sobre seus funcionários, encargos e passivos estaduais. Não há, sob qualquer pretexto, subordinação jurídica, hierárquica-celetista ou vínculo empregatício formal com a holding WINF CAPITAL™.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeDoc === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest">DOCUMENTO 02: MATRIZ OPERACIONAL (BASE DA C.O.F.)</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: OFERTA DE FRANQUIA E LICENCIAMENTO</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <p className="mb-4">Estruturação primária para composição da Circular de Oferta de Franquia (COF) e Termos de Licenciamento Tecnológico.</p>
                  
                  <div className="space-y-4">
                    <div className="bg-[#131314] border border-winf-gray/20 p-4">
                      <h4 className="text-white font-medium uppercase mb-2">PERFIL I: Asset Light Member (Licença de Software)</h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        <li><strong>Formato Jurídico:</strong> Termo de Licenciamento de Uso de Infraestrutura Tecnológica (WINF OS™) e Cessão Temporária de Marca.</li>
                        <li><strong>Exigência Imobiliária:</strong> Nenhuma (Zero Capex). Operação estritamente volante e digital.</li>
                        <li><strong>Obrigações Contratuais:</strong> Manter a assinatura do WINF OS™ ativa; submeter-se estritamente ao código de conduta W-Rank; retirar materiais via BlackShop.</li>
                      </ul>
                    </div>

                    <div className="bg-[#131314] border border-winf-gray/20 p-4">
                      <h4 className="text-white font-medium uppercase mb-2">PERFIL II: WINF Kiosk™ (Microfranquia)</h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        <li><strong>Formato Jurídico:</strong> Contrato de Franquia Formato Quiosque (Lei 13.966/2019).</li>
                        <li><strong>Exigência Imobiliária:</strong> Ponto comercial de 6m² a 12m² em shoppings AAA, aeroportos ou hipermercados selecionados.</li>
                        <li><strong>Obrigações Contratuais:</strong> Pagar Taxa de Franquia de Ingresso; respeitar padronização arquitetônica (Stealth Luxury); operar captação de leads.</li>
                      </ul>
                    </div>

                    <div className="bg-[#131314] border border-winf-gray/20 p-4">
                      <h4 className="text-white font-medium uppercase mb-2">PERFIL III: Studio AeroCore™ (Franquia Master)</h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        <li><strong>Formato Jurídico:</strong> Contrato de Franquia Completa com Exclusividade de Raio Opcional.</li>
                        <li><strong>Exigência Imobiliária:</strong> Loja de rua, galpão de bairro nobre ou centro comercial de 100m² a 250m², com certificação Dust-Free.</li>
                        <li><strong>Obrigações Contratuais:</strong> Operar como base técnica avançada; respeitar o manual de compliance; representar a autoridade intelectual da marca, usufruindo de 100% de isenção de royalties sobre o faturamento.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeDoc === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest">DOCUMENTO 03: MANUAL DE SUPPLY CHAIN (BLACKSHOP™)</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: REGRAS LOGÍSTICAS E FORNECIMENTO</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  
                  <div className="space-y-4">
                    <p className="text-justify indent-8">
                      O fornecimento de películas em bobinas fechadas está banido das operações diretas. O sistema BlackShop™ impõe um controle de suprimento fracionado guiado por software, mitigando desvios e estoques ociosos.
                    </p>

                    <h3 className="text-white font-medium uppercase mt-6 mb-2">1. DO FLUXO DE ORDEM DE SERVIÇO (O.S.)</h3>
                    <ul className="bg-[#131314] border border-winf-gray/20 p-4 space-y-2 text-xs">
                       <li>1. O franqueado ou licenciado (Asset Light) gera o orçamento no WINF OS™.</li>
                       <li>2. Ao aprovar com o cliente, o motor converte a planta ou o veículo em milímetros quadrados precisos (Cálculo Nesting).</li>
                       <li>3. A ordem de corte é disparada para o <strong>Regional Hub</strong> mais próximo.</li>
                       <li>4. O material é cortado milimetricamente pelo plotter central, envelopado em tubo de proteção rígido, e despachado (ou retirado no balcão).</li>
                    </ul>

                    <h3 className="text-white font-medium uppercase mt-6 mb-2">2. DA PROIBIÇÃO DE MATERIAIS DE TERCEIROS (Homologação Exclusiva)</h3>
                    <p className="bg-winf-primary/10 border-l-4 border-winf-primary p-4 text-xs text-white">
                      É considerada quebra de contrato gravíssima (sujeita a rescisão imediata e multa contratual) a utilização, comercialização ou exposição de materiais de terceiros, similares ou concorrentes nas dependências de qualquer WINF Kiosk ou Studio AeroCore, ou a aplicação destes materiais reportando-os no sistema WINF OS™. Toda a cadeia de suprimentos é de exclusividade (Single-Source Supplier) via BlackShop™.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeDoc === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest">DOCUMENTO 04: GOVERNANÇA GAMIFICADA (W-RANK)</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: COMPLIANCE E PROGRESSÃO DE REDE</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <p className="mb-4">O W-Rank é o termômetro de conformidade e reputação algorítmica da rede. A permanência do licenciado ou franqueado na rede não é garantida pelo capital, mas pela aderência pontuada.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-winf-gray/20 p-4 bg-[#131314]">
                      <h4 className="text-winf-primary text-xs uppercase mb-2">Indicadores Positivos (Gain)</h4>
                      <ul className="text-xs space-y-2">
                        <li>+50 pts: Venda de Contrato AAA</li>
                        <li>+30 pts: Upload de Fotos do Check-in</li>
                        <li>+20 pts: Avaliação 5 Estrelas no Sistema</li>
                        <li>+100 pts: Participação em Treinamentos Matrix</li>
                      </ul>
                    </div>
                    <div className="border border-red-900/30 p-4 bg-[#1a0505]">
                      <h4 className="text-red-400 text-xs uppercase mb-2">Indicadores Negativos (Loss)</h4>
                      <ul className="text-xs space-y-2">
                        <li>-100 pts: Atraso de Mensalidade OS</li>
                        <li>-200 pts: Acionamento indevido de Garantia</li>
                        <li>-500 pts: Uso de logomarca fora do padrão (Vandalismo Visual)</li>
                        <li className="text-red-300 font-bold">-1000 pts: Descredenciamento Sumário</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-justify pt-4 text-xs">
                    Franqueados ou Licenciados cujo W-Rank caia para a zona de risco (<strong>Score Negativo</strong>) têm seus acessos a novos Leads corporativos cortados (Soft-Lock no WINF Brain). Se não houver recuperação em 30 dias, a Holding deflagra o Protocolo de Rescisão de Segurança.
                  </p>
                </div>
              </motion.div>
            )}

            {activeDoc === 5 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest">DOCUMENTO 05: PROTEÇÃO DE IP E NON-COMPETE</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: BLINDAGEM INTELECTUAL (W-IPD)</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  
                  <blockquote className="border-l-4 border-winf-primary/50 pl-4 bg-[#131314] p-4 text-xs">
                    <strong className="text-white block mb-1 uppercase">Cláusula 1: Propriedade do Código e Artefatos Visuais</strong> Todos os direitos, patentes, marcas registradas, designs de UI/UX, código-fonte (WINF OS™), cálculos térmicos (GeoStrategy), bem como fotos e renders de marketing distribuídos pertencem inteiramente e inalienavelmente à WINF CAPITAL™.
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-winf-primary/50 pl-4 bg-[#131314] p-4 text-xs">
                    <strong className="text-white block mb-1 uppercase">Cláusula 2: Kill-Switch Visual em 48 Horas</strong> Em caso de distrato, o ex-parceiro concede anuência prévia para que se retire do ar qualquer vínculo visual físico e virtual. Letreiros devem ser removidos e as redes sociais purgadas de menções à WINF™ no prazo peremptório de 48 horas.
                  </blockquote>
                  
                  <blockquote className="border-l-4 border-winf-primary/50 pl-4 bg-[#131314] p-4 text-xs">
                    <strong className="text-white block mb-1 uppercase">Cláusula 3: Barreira de Não-Concorrência (5 Anos)</strong> Tendo passado pela Academia (Matrix) e obtido segredos industriais e de processo da WINF™, o licenciado assina termo legal abdicando do direito de criar, fundar ou atuar como Diretor de qualquer marca concorrente de distribuição tecnológica de películas por um período de 5 (cinco) anos.
                  </blockquote>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 6 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 06: INTEGRAÇÃO COGNITIVA W-NO (Núcleo Operacional) E WINF PRECISION™</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: INTELIGÊNCIA ARTIFICIAL E CONTROLE DE EXPANSÃO</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider">1. ARQUITETURA DO PROJETO W-NO (Núcleo Operacional)</h3>
                    <p className="text-justify indent-8 text-xs leading-relaxed">
                      O W-NO (Núcleo Operacional) opera como o braço comercial robótico do ecossistema WINF OS™. Ele herda um córtex conversacional contextual avançado, focado em alta conversão e quebra de objeções baseadas no ParadoxAnalysis. É responsável pela triagem de leads recebidos, síntese e sumarização de áudios de clientes no WhatsApp, e conversão direta em Ordens de Serviço pré-agendadas nos centros técnicos.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">2. COMPUTAÇÃO MÉTRICA WINF PRECISION™</h3>
                    <p className="text-justify indent-8 text-xs leading-relaxed">
                      Todo cálculo de película consumida segue a matriz de cubagem eletrônica WINF Precision™. Através desse algoritmo, o gasto exato de película é debitado em BRL/m² do saldo decrescente sob demanda. O sistema é blindado com auditoria via blockchain descentralizada. Em caso de desvio no uso de película ou incompatibilidade técnica dolosa, o sistema executa o Soft-Lock ou Lock Remoto da licença em tempo real.
                    </p>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 7 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 07: ESTATUTO DE GESTÃO E CONSELHO MASTERS W12</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: GOVERNANÇA DE CADEIRAS CORPORATIVAS (PRODUTO GAMMA)</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider">1. ESTRUTURA DO CONSELHO W12</h3>
                    <p className="text-justify indent-8 text-xs leading-relaxed">
                      O conselho de alto nível W12 é composto por exatamente 12 (doze) cadeiras diretivas estratégicas e exclusivas: duas pertencentes aos sócios fundadores originais da holding e dez cadeiras abertas a grandes players investidores do Produto Gamma ou operadores de elite que dominam o ranking nacional de mérito técnico da plataforma (<code className="text-winf-primary">w_rank_xp</code>).
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">2. DESIGN E PADRÃO ESTÉTICO (LOFT INDUSTRIAL RÚSTICO)</h3>
                    <p className="text-justify indent-8 text-xs leading-relaxed">
                      Todos os Hubs e Studios devem obedecer rigorosamente o memorial de arquitetura premium contendo concreto bruto lapidado, tijolos escurecidos aparentes, tubulações de ar-condicionado expostas, iluminação cinematográfica cênica em LED e supercarros de alta performance em exibição contínua.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">3. DIVIDENDOS E MODELO DE SCP</h3>
                    <p className="text-justify indent-8 text-xs leading-relaxed">
                      Para os investidores do Produto Gamma (Conselheiros W12) ou investidores SCP da BlackShop™, os dividendos e spreads logísticos regionais são liquidados trimestralmente ou sob demanda através de auditoria do volume em metros quadrados escoados de película em toda a macrorregião coberta de forma exclusiva.
                    </p>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 8 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 08: DOSSIÊ DE TRANSPARÊNCIA E TABELA DE CUSTOS</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: ANEXO OBRIGATÓRIO DE CUSTOS, MARGENS E REGRAS DE TRÁFEGO DO POOL DE LIQUIDEZ (PRODUTO BETA)</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider">01. CADEIA DE SUPRIMENTOS E ARBITRAGEM DE IMPORTAÇÃO</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Este documento constitui o anexo financeiro e técnico do Contrato de Sociedade em Conta de Participação (SCP) do Produto Beta. A sustentabilidade e a taxa de retorno distribuída aos investidores cotistas provêm exclusivamente da arbitragem comercial operada pela distribuidora BlackShop™ na importação em larga escala de películas nanotecnológicas originárias do mercado asiático.
                    </p>
                    <p className="text-justify text-xs leading-relaxed">
                      O custo bruto de fabricação e desembaraço aduaneiro desses insumos é cotado em moeda estrangeira fracionada por metro quadrado, permitindo à holding uma margem bruta estruturada de repasse ao mercado interno, blindando o pool contra variações locais de inflação.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">02. MATRIZ ABERTA DE CUSTOS E REPASSE (BOBINAS PADRÃO 1,52M X 30M)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-winf-gray/20 text-left text-xs text-winf-gray/80">
                        <thead className="bg-[#0c0c0c] border-b border-winf-gray/20 text-white font-medium uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3 border-r border-winf-gray/20">Linha de Produto</th>
                            <th className="p-3 border-r border-winf-gray/20">Custo Importação (FOB/m²)</th>
                            <th className="p-3 border-r border-winf-gray/20">Spread Operacional Holding</th>
                            <th className="p-3 border-r border-winf-gray/20">Preço de Compra Autorizado</th>
                            <th className="p-3">Margem Líquida Estimada do Pool</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-winf-gray/20 bg-[#131314]">
                          <tr className="hover:bg-zinc-900/30">
                            <td className="p-3 border-r border-winf-gray/20 font-bold text-white">
                              Série BlackPro
                              <span className="block font-normal text-[10px] text-zinc-500">Privacidade aut. premium</span>
                            </td>
                            <td className="p-3 border-r border-winf-gray/20">R$ 12,50 / m²</td>
                            <td className="p-3 border-r border-winf-gray/20">R$ 22,50 / m²</td>
                            <td className="p-3 border-r border-winf-gray/20 text-winf-primary font-bold">R$ 35,00 / m²</td>
                            <td className="p-3 font-bold text-green-400">Média de 64% por lote</td>
                          </tr>
                          <tr className="hover:bg-zinc-900/30">
                            <td className="p-3 border-r border-winf-gray/20 font-bold text-white">
                              Série Dual Reflect
                              <span className="block font-normal text-[10px] text-zinc-500">Arq. e controle térmico</span>
                            </td>
                            <td className="p-3 border-r border-winf-gray/20">R$ 18,00 / m²</td>
                            <td className="p-3 border-r border-winf-gray/20">R$ 27,00 / m²</td>
                            <td className="p-3 border-r border-winf-gray/20 text-winf-primary font-bold">R$ 45,00 / m²</td>
                            <td className="p-3 font-bold text-green-400">Média de 60% por lote</td>
                          </tr>
                          <tr className="hover:bg-zinc-900/30">
                            <td className="p-3 border-r border-winf-gray/20 font-bold text-white">
                              Série Invisible
                              <span className="block font-normal text-[10px] text-zinc-500">Escudo term. nanocerâmico</span>
                            </td>
                            <td className="p-3 border-r border-winf-gray/20">R$ 25,00 / m²</td>
                            <td className="p-3 border-r border-winf-gray/20">R$ 40,00 / m²</td>
                            <td className="p-3 border-r border-winf-gray/20 text-winf-primary font-bold">R$ 65,00 / m²</td>
                            <td className="p-3 font-bold text-green-400">Média de 61% por lote</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">03. REGRA MATEMÁTICA DE REINVESTIMENTO COMPULSÓRIO EM ANÚNCIOS</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Para assegurar a velocidade do giro de estoque (queima de metros quadrados) e afastar o risco de estagnação de capital em bobinas paradas, fica instituída a trava sistêmica de Ads. Uma fração exata de 10% (dez por cento) de todo o spread bruto apurado pela BlackShop™ na venda de insumos para os licenciados é direcionada na origem para a conta de tráfego pago geolocalizado da respectiva praça.
                    </p>
                    <p className="text-justify text-xs leading-relaxed">
                      Esta regra é automatizada via gatilho de API no software WINF OS™: a cada faturamento de bobina efetuado pela matriz, o saldo correspondente de marketing é liberado no gerenciador de anúncios do Google e Meta apontando para a cidade parceira, capturando novos leads que serão convertidos de forma autônoma pela IA W-NO (Núcleo Operacional).
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">04. MECANISMO DE AUDITORIA DO POOL E PAYOUT</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      A auditoria e o balanço do Produto Beta não dependem de validações manuais. O investidor cotista possui acesso a um painel analítico centralizado onde pode checar a movimentação volumétrica da distribuidora. Cada Ordem de Serviço finalizada na ponta deduz linearmente o saldo de metros quadrados da bobina associada, registrando um hash imutável na Blockchain. Os dividendos acumulados do Pool de Liquidez são liquidados e distribuídos em conta corrente aos sócios participantes trimestralmente.
                    </p>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 9 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 09: MANUAL DE ONBOARDING E ROADMAP OPERACIONAL</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: PRODUTO ALPHA: ATIVAÇÃO TERRITORIAL E INTEGRAÇÃO DE UNIDADE ASSET-LIGHT</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider">01. ENGENHARIA FINANCEIRA DE ATIVAÇÃO</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      O modelo de concessão estabelece o provisionamento da licença territorial Asset-Light mediante o pagamento da Taxa Única de Ativação Territorial no valor de R$ 15.000,00 (quinze mil reais) pelo parceiro homologado.
                    </p>
                    <p className="text-justify text-xs leading-relaxed">
                      O Licenciado Autorizado adquire, no ato da compensação, o direito de recebimento de um enxoval físico inicial de insumos da Linha Select™ composto por exatamente 7,50 metros lineares de película de alta performance para cada uma das frentes tecnológicas da marca:
                    </p>
                    <ul className="text-xs space-y-2 pl-4 list-disc text-white">
                      <li><strong>Dual Reflect:</strong> Película arquitetônica de alta rejeição e controle térmico por refletividade.</li>
                      <li><strong>BlackPro:</strong> Linha de altíssima escuridão interna e privacidade para o segmento automotivo.</li>
                      <li><strong>Invisible:</strong> Película de engenharia invisível de alta transparência com máximo bloqueio infravermelho.</li>
                    </ul>
                    <p className="bg-zinc-900 border-l border-winf-primary p-3 text-[11px] leading-relaxed">
                      <strong>Nota de Rendimento Técnico:</strong> A metragem linear de 7,50 metros fornecida equivale a aproximadamente 11m² (onze metros quadrados) de área útil por linha de produto, desde que rigidamente processada e de acordo com o software de corte de perdas da franqueadora.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">02. PROTOCOL EM EXPANSÃO DE TERRITÓRIO</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Imediatamente após a confirmação financeira, o operador recebe credenciais exclusivas para acessar a plataforma WINF OS™ e dar início à reserva de seu perímetro. A ativação do território é condicionada ao preenchimento integral do Formulário de Ativação Territorial pela retaguarda do parceiro, fornecendo dados de geolocalização comercial, contatos de campo e informações para o provisionamento dos sistemas.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">03. ENTREGA DA ESTRUTURA DIGITAL "TURN-KEY" (48 HORAS)</h3>
                    <ul className="text-xs space-y-3 bg-[#0c0c0c] p-4 border border-winf-gray/20">
                      <li>
                        <strong className="text-white block">● Conta de E-mail Profissional:</strong>
                        <span className="text-zinc-400">Endereço corporativo exclusivo para trâmite legal, acesso às ferramentas internas e recebimento de notificações operacionais.</span>
                      </li>
                      <li>
                        <strong className="text-white block">● Google Workspace Hub:</strong>
                        <span className="text-zinc-400">Conta Google parametrizada com os canais de dados e ferramentas de produtividade vinculadas à central.</span>
                      </li>
                      <li>
                        <strong className="text-white block">● Google Meu Negócio (SEO Local):</strong>
                        <span className="text-zinc-400">Configuração do estúdio geolocalizado nos mecanismos de pesquisa e mapas do Google para captura direta de chamados orgânicos na região homologada.</span>
                      </li>
                      <li>
                        <strong className="text-white block">● Subdomínio de Alta Conversão:</strong>
                        <span className="text-zinc-400">Criação de página web individualizada no barramento oficial da holding (ex: suacidade.winfpartners.com).</span>
                      </li>
                      <li>
                        <strong className="text-white block">● Redes Sociais Impulsionadas:</strong>
                        <span className="text-zinc-400">Criação, padronização visual sob a identidade AeroCore™ e lançamento de campanhas de tráfego pago iniciais nas principais redes do mercado.</span>
                      </li>
                      <li>
                        <strong className="text-white block">● WhatsApp Business + Córtex W-NO (Núcleo Operacional):</strong>
                        <span className="text-zinc-400">Envio de linha comercial configurada nativamente com a inteligência artificial proprietária W-NO (Núcleo Operacional), apta a executar o atendimento, triagem e agendamento automático de ordens de serviço 24 horas por dia.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">04. FLUXO DE TRABALHO E SUPORTE CONTÍNUO (WINF ACADEMY)</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      O acoplamento do licenciado ao novo fluxo de rotina ocorre através do programa prático de capacitação da WINF Academy. O operador é treinado unicamente para executar a aplicação técnica das películas originais recebidas, eliminando processos burocráticos. A retaguarda operacional é assistida em tempo real por um modelo híbrido de suporte técnico 24 horas por dia, combinando monitoramento automatizado via inteligência artificial com intervenção de engenharia humana em escala contínua.
                    </p>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 10 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 10: ROADMAP DE TRAÇÃO e GOVERNANÇA DE APORTE</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: DOSSIÊ DE ALOCAÇÃO DE CAPITAL, PROJEÇÕES DE LIQUIDEZ E REGRAS DE SAÍDA (STEALTH)</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider">01. ALOCAÇÃO IMEDIATA DE RECURSOS</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Após o aporte integralizado no pool do Universo Dark, o montante correspondente será escoado para as frentes estruturadas: importações FOB massivas de pellets inteligentes asiáticos, campanhas nacionais direcionadas para gerar autoridade de subdomínios, e enxoval promocional distribuído para aceleração rápida de m² aplicado em campo corporativo.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">02. SEPARABILIDADE DE RISCOS DOS FUNDADORES</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      A holding blinda a cota de investimento isentando o pool de riscos de validação física estrutural secundária. A instalação, infraestrutura fabril dos primeiros quiosques piloto, o suporte técnico central WINF Academy e o estoque rotativo inicial de segurança são custeados integralmente com capital proprietário dos sócios fundadores originais.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-semibold uppercase tracking-wider">03. MATRIZ FINANCEIRA DE CENÁRIOS E RETORNO ESTIMADO</h3>
                    <ul className="text-xs space-y-3 bg-[#0c0c0c] p-4 border border-winf-gray/20">
                      <li>
                        <strong className="text-winf-primary block">● Cenário A (Escala Base): R$ 50.000,00</strong>
                        <span className="text-zinc-400">Ativação prioritária de rolos iniciais e ads localizados para 25 territórios polo. Payback: 14 a 16 meses. Retorno médio: 24% a.a. pagos trimestralmente via SCP.</span>
                      </li>
                      <li>
                        <strong className="text-winf-primary block">● Cenário B (Escala Moderada): R$ 100.000,00</strong>
                        <span className="text-zinc-400">Importação fracionada direta de pellets com maior faturamento margem na distribuidora BlackShop™. Payback: 11 a 13 meses. Retorno médio: 30% a.a.</span>
                      </li>
                      <li>
                        <strong className="text-winf-primary block">● Cenário C (Aceleração Exponencial): R$ 250.000,00</strong>
                        <span className="text-zinc-400">Contêiner cheio, domínio de estoque para todo o cinturão de franqueados e proteção cambial FOB. Payback: 8 a 10 meses. Retorno estimado: 36% a.a.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">04. GOVERNANÇA, PAYOUTS E RECOMPRA</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Auditoria integral automatizada via registros criptográficos parametrizados no WINF Precision™. Distribuição líquida bimestral/trimestral sem repasse de impostos societários por conta da engenharia legal SCP (Sociedade em Conta de Participação). Janelas de saída com buyback garantido pela holding ou liquidação fracionada de lotes logísticos aduaneiros vinculados.
                    </p>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 11 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 11: PLANO DE EXPANSÃO MACRO e EXIT STRATEGY (M&A)</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: DOSSIÊ DE DIRECIOMAMENTO ESTÁTICO, ESCASSEZ DE PRAÇAS E EVENTOS DE SAÍDA (EXIT)</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium uppercase tracking-wider">01. O ENXOVAL DIGITAL DO INVESTIDOR</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Todo investidor integrado ao Universo Dark recebe acesso irrestrito ao Dashboard analítico para auditoria, e-mail corporativo criptografado sob canal oficial e cópia autenticada eletronicamente de toda a suite regulatória da holding e deliberações anteriores do conselho diretivo W12.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">02. MONOPÓLIO GEOPOLÍTICO DE CIDADES POLO</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Das 5.570 cidades que compõem o território brasileiro, a controladoria da holding isola e seleciona unicamente as praças polo de altíssima densidade de PIB e renda alta. Uma vez que o território é travado via API no WINF OS™, nenhum outro operador pode comercializar na região, direcionando todos os orçamentos e escoamento aduaneiro local ao parceiro franqueado ou licenciado dominante.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">03. ONDA EXPANSIÓN: MULTIPLICAÇÃO DE PONTOS E ASSET-LIGHT</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      A expansão de capilaridade fundamenta-se na dupla via de escoamento: Onda 1 de captação maciça de aplicadores licenciados volantes (Zero Capex) para consumo pulverizado acelerado de películas; de forma subsequente, Onda 2 focada na instalação tática de Quiosques Tecnológicos imersivos como pontos fixos de alto tráfego urbano em shoppings e centros comerciais Triple-A.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">04. EVENTO DE SAÍDA EXCLUSIVO (M&A)</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      Alinhamento estratégico visa centralizar a expansão das praças nacionais e tecnologia digital sob a chancela FaaS. O valuation acelerado em blockchain e o fluxo inelástico de compra aduaneira preparam a holding em até 5 anos para um evento de consolidação via Private Equity ou aquisição direta por grande fabricante multinacional do setor, garantindo liquidez astronômica e prêmio de valuation de saída aos sócios participantes do pool.
                    </p>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}

            {activeDoc === 12 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-winf-gray/20 bg-[#131314] relative">
                <div className="p-6 border-b border-winf-gray/20 bg-[#070707]">
                   <h2 className="text-xl text-white font-medium flex items-center uppercase tracking-widest font-mono">DOCUMENTO 12: PROCEDIMENTO OPERACIONAL PADRÃO (POP) – IMPLANTAÇÃO TURN-KEY ALPHA</h2>
                   <p className="text-xs font-mono text-winf-primary mt-2">CLASSIFICAÇÃO: MANUAL DE EXECUÇÃO TÉCNICA E PROCEDIMENTOS TURN-KEY (OPERACIONAL)</p>
                </div>
                
                <div className="p-8 space-y-6 text-sm text-winf-gray/80 leading-relaxed font-mono">
                  <div className="bg-[#0b0b0b] p-4 border border-winf-gray/20 space-y-2 text-xs">
                    <p className="text-white"><strong className="text-winf-primary">⏱️ GATILHO INICIAL:</strong> Confirmação do pagamento de R$ 15.000,00 + retirada do Formulário de Ativação Territorial preenchido.</p>
                    <p className="text-white"><strong className="text-winf-primary">🕒 PRAZO LIMITE DE ENTREGA:</strong> 48 horas impreterivelmente.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">01. INFRAESTRUTURA DE IDENTIDADE (E-MAIL E WORKSPACE)</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      O primeiro tijolo digital. Sem isso, o parceiro não acessa a rede. O que criar: 1 conta de e-mail corporativo exclusivo no Google Workspace.
                    </p>
                    <ul className="text-xs space-y-1 list-disc pl-5 text-winf-gray/60">
                      <li>Padrão de Nomenclatura (Obrigatório): <code className="text-white">cidade@winfpartners.com</code> (Ex: santos@winfpartners.com).</li>
                      <li>Aceder ao Painel de Administrador do Google Workspace da holding e criar o usuário.</li>
                      <li>Gerar senha provisória padrão (<code className="text-white">Winf2026*cidade</code>) com "Exigir alteração de senha no primeiro acesso".</li>
                      <li>Configurar aliases e grupos para redundância das notificações corporativas na central da holding.</li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">02. PRESENÇA WEB (SUBDOMÍNIO E LANDING PAGE LOCAL)</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      A página de pouso regional onde o robô capturará os clientes de alto padrão. O que criar: Subdomínio ativo e Landing Page regionalizada de alta conversão.
                    </p>
                    <ul className="text-xs space-y-1 list-disc pl-5 text-winf-gray/60">
                      <li>Padrão de URL (CNAME Cloudflare): <code className="text-white">cidade.winfpartners.com</code> (Ex: santos.winfpartners.com).</li>
                      <li>Apontar o CNAME para o servidor matriz de Landing Page Alpha.</li>
                      <li>Duplicar a Landing Page Matriz Alpha no CMS, alterando os textos sonoros locais (ex: "Películas de Nanotecnologia e Proteção Térmica em Santos").</li>
                      <li>Vincular botões de CTA diretamente à API do novo WhatsApp Business daquela unidade. Testar carregamento SSL HTTPS.</li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">03. DOMÍNIO ORGÂNICO LOCAL (GOOGLE MEU NEGÓCIO)</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      A maior fonte de clientes de urgência. Quando o dono de uma mansão ou Porsche busca por proteção térmica no Google, o parceiro tem de aparecer no mapa.
                    </p>
                    <ul className="text-xs space-y-1 list-disc pl-5 text-winf-gray/60">
                      <li>Criar empresa via Google Business Profile master no padrão: <code className="text-white">Winf Partners - Películas Premium - [Nome da Cidade]</code>.</li>
                      <li>Configuração de Categoria: Serviços de Insulfilm ou Controle Solar e Térmico.</li>
                      <li>Inserir área de cobertura geográfica exata do contrato (bloqueando cidades vizinhas).</li>
                      <li>Subir kit visual monocromático em Preto e Branco AeroCore™ (supercarros, aplicações e estúdios rústicos) e acionar verificação padrão.</li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">04. VITRINES DIGITAIS E IMPULSIONAMENTO (REDES SOCIAIS & ADS)</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      A engrenagem que gera o desejo visual em clientes de alto ticket. Criação de Facebook Page, Instagram comercial e conta Meta/Google Ads.
                    </p>
                    <ul className="text-xs space-y-1 list-disc pl-5 text-winf-gray/60">
                      <li>Criar perfil no Instagram <code className="text-white">@winf.[cidade]</code> vinculado à página correspondente do Facebook.</li>
                      <li>Aplicar foto oficial WINF Partners, biografia padronizada e link do subdomínio local.</li>
                      <li>Publicar feed conceitual de largada com 6 a 9 posts da Linha Select™ (Dual Reflect, BlackPro, Invisible).</li>
                      <li>Instalar pixel de rastreamento e configurar campanha com 10% do spread de largada em bairros nobres e condomínios fechados.</li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-medium uppercase tracking-wider">05. ATIVAÇÃO DO CÓRTEX COMERCIAL (WHATSAPP BUSINESS + IA W-NO (Núcleo Operacional))</h3>
                    <p className="text-justify text-xs leading-relaxed">
                      O coração automatizado da operação. O robô que atende e agenda 24h por dia.
                    </p>
                    <ul className="text-xs space-y-1 list-disc pl-5 text-winf-gray/60">
                      <li>Assegurar número ativo do whatsapp business do parceiro com Linha Select cadastrada no catálogo.</li>
                      <li>Gerar QR Code na plataforma (Firebase/Evolution API) e parear dispositivo.</li>
                      <li>Injetar Prompt específico da cidade no W-NO (Núcleo Operacional) (bairros atendidos e tabela de preços locais do WINF Precision™).</li>
                      <li>Efetuar 3 simulações reais de clientes abordando objeções de calor de 90% infravermelho e gerando ordens de serviço automáticas.</li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-winf-gray/10">
                    <h3 className="text-white font-semibold uppercase tracking-wider">06. CHECKLIST DE ENTREGA FINAL (O QUE ENVIAR AO PARCEIRO)</h3>
                    <ul className="text-xs space-y-2 bg-[#0c0c0c] p-4 border border-winf-gray/20">
                      <li><strong className="text-winf-primary">● Credenciais do E-mail Workspace:</strong> Usuário (<code className="text-white">cidade@winfpartners.com</code>) e Senha provisória.</li>
                      <li><strong className="text-winf-primary">● Acesso WINF OS™:</strong> Link de acesso ao painel + Chave de Acesso Territorial contratada.</li>
                      <li><strong className="text-winf-primary">● Links Oficiais Ativos:</strong> URL da Landing Page local configurada + Ficha do Google Maps ativa.</li>
                      <li><strong className="text-winf-primary">● Status do Córtex:</strong> Pareamento verificado e IA W-NO (Núcleo Operacional) ativa.</li>
                      <li><strong className="text-winf-primary">● Convite WINF Academy:</strong> Link exclusivo para os módulos práticos de capacitação e aplicação de m².</li>
                    </ul>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 border border-winf-primary text-winf-primary hover:bg-winf-white hover:bg-winf-primary hover:text-black transition-colors font-medium flex justify-center items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    AUTENTICAR, VALIDAR E EXPORTAR CADERNOS (.TXT)
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleExecutiveDocs;
