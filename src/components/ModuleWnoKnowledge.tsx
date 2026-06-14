import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Filter, Check, X, Edit2, Trash2, Save, Plus, AlertCircle, CheckCircle2,
  FileText, ArrowUpRight, Cpu, MessageSquare, HelpCircle, RefreshCw, Terminal, DollarSign,
  BookOpen, Search, Layers, ClipboardCheck, ArrowRight, Eye, Percent, Table, Landmark, HelpCircle as HelpIcon
} from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { RayKnowledge } from '../types';

// The 14 Premium Tactical Documents derived from the Matriz Interna of WINF Partners
const TACTICAL_DOCUMENTS = [
  {
    id: "doc-01",
    num: "01",
    category: "Contratos & Compliance",
    title: "Circular de Oferta de Franquia (COF)",
    subtitle: "Modelo Franchise-As-A-Service (FaaS) // Lei Federal Nº 13.966/19",
    description: "Estruturação legal e preâmbulo da holding de inovação conectada, modelo de royalties e trava lógica.",
    sections: [
      {
        ref: "01",
        label: "Preâmbulo e Histórico da Holding",
        content: "A WINF Partners™ é uma holding de inovação conectada, logística e infraestrutura digital baseada no ecossistema de alta performance do Universo Dark™. Rompendo definitivamente com o paradoxo do franchising tradicional, a WINF Partners™ atua sob o modelo Franchise-as-a-Service (FaaS), fornecendo órbita digital pré-provisionada e eliminando royalties ou taxas de publicidade sobre o faturamento de serviços do licenciado. A rentabilidade da franqueadora provém da escala, importação global e arbitragem estruturada na BlackShop™."
      },
      {
        ref: "02",
        label: "Natureza do Modelo Asset-Light",
        content: "O modelo FaaS consiste na entrega imediata das estruturas digitais de campo da unidade (automações de atendimento, chaves de API e canais de tráfego local). O operador regional atua na execução técnica sob demanda, operando com uma estrutura enxuta de altíssima rentabilidade."
      },
      {
        ref: "03",
        label: "Especificações do Agente Cognitivo W-NO (Núcleo Operacional)",
        content: "A WINF Partners™ concede ao licenciado o direito de uso e conexão ao Agente W-NO™, um Agente de Inteligência Artificial Cognitivo com córtex conversacional próprio que assume 100% da linha de frente comercial nativa através do WhatsApp da unidade. A IA realiza de forma autônoma a triagem, áudio-sumarização de leads, convertendo e agendando as ordens de serviço diretamente no sistema."
      },
      {
        ref: "04",
        label: "Disposições Financeiras de Taxas e Royalties",
        content: "A WINF desobriga o parceiro de qualquer taxa recorrente sobre o faturamento bruto: \n• Taxa Única de Ativação Territorial: R$ 15.000,00 (Quinze mil reais), sem taxas de renovação periódica. \n• Royalties Operacionais sobre Aplicação: 0% (Zero por cento). \n• Fundo de Propaganda Centralizado: 0% (Zero por cento). \n• Abastecimento Obrigatório: Compra direta de películas nanotecnológicas e fitas de PPF exclusivamente via distribuidora BlackShop™."
      },
      {
        ref: "05",
        label: "Declaração de Ciência e Acordo de Trava Digital",
        content: "O licenciado declara plena ciência de que o sistema WINF OS™ audita o saldo de metros quadrados ($m²) das bobinas via Blockchain através da calculadora WINF Precision™. A detecção de uso de películas paralelas ou piratas não-homologadas resulta no bloqueio remoto do software de campo e confisco temporário de toda a órbita digital ativa."
      }
    ]
  },
  {
    id: "doc-02",
    num: "02",
    category: "Contratos & Compliance",
    title: "Contrato de Concessão de Licença Territorial FaaS",
    subtitle: "Modalidade: Exclusividade Limitada a 100 Praças Nacionais",
    description: "Regulação de outorga, limites territoriais, regras de fechamento operacional e lastro pregoativo de validação.",
    sections: [
      {
        ref: "01",
        label: "Objeto do Instrumento",
        content: "O presente instrumento regula a outorga de direito de exploração comercial e custódia de 1 (um) território exclusivo dentre o lote escasso de 100 (cem) unidades estratégicas mapeadas pela CONTRATANTE, com cessão temporária de acesso às APIs do software WINF OS™ e ao Agente Comercial Autônomo W-NO (Núcleo Operacional)."
      },
      {
        ref: "02",
        label: "Regras e Sub-Modalidades Operacionais de Fechamento",
        content: "A concessão é operável de forma flexível sob três pilares estratégicos de atuação:\n• A) Aplicador Profissional Solo (1 Pessoa + IA): Foco total na aplicação em campo enquanto a inteligência artificial controla os leads com escassez e táticas de fechamento automatizado.\n• B) Investidor com Mão de Obra Terceirizada: Foco puramente operacional livre de encargos fiscais tradicionais. A força de campo é executada por aplicadores formados pela WINF Academy e remunerados puramente por metro quadrado ($m²) de trabalho efetuado.\n• C) Investidor Padrinho (Anjo Operacional): Consórcio direto entre investidores de aporte financeiro e técnicos qualificados para divisão de lucros em formato de joint-venture de campo."
      },
      {
        ref: "03",
        label: "Do Lastro de Validação (Padrão Santos)",
        content: "Fica estabelecido que todas as metas de implantação e viabilidade utilizam a unidade piloto de Santos como métrica padrão: dedicação focal de 6 horas semanais de aplicação prática de Window Film, escoamento médio de 100 a 200 metros lineares de película por mês e expectativa de rendimento preditivo estável de R$ 300.000,00 anuais por território ativo."
      },
      {
        ref: "04",
        label: "Penalidades por Quebra de Exclusividade ou Fraude",
        content: "O licenciado concorda que o uso de qualquer bobina paralela desativa o token societário atrelado à blockchain local, suspendendo imediatamente a emissão de novos Certificados de Garantia Digitais WINF e autorizando o desvio técnico de seus canais do WhatsApp direto para a holding central como medida corretiva autônoma."
      }
    ]
  },
  {
    id: "doc-03",
    num: "03",
    category: "Contratos & Compliance",
    title: "Acordo de Parceria Operacional - Investidor-Padrinho",
    subtitle: "Modalidade: Desenvolvimento de Carreira e Ativação Asset-Light",
    description: "Pilares do consórcio, responsabilidade do aporte financeiro, obrigações do técnico e split de dividendos.",
    sections: [
      {
        ref: "01",
        label: "Contexto e Propósito do Consórcio",
        content: "O presente instrumento regula as relações de fomento e investimento entre o INVESTIDOR PADRINHO (aportador do capital de ativação territorial) e o APLICADOR DE ELITE (técnico responsável pela execução prática e de campo do ecossistema de Window Film)."
      },
      {
        ref: "02",
        label: "Encargos do Investidor Padrinho",
        content: "Cabe ao parceiro investidor assegurar o cumprimento das seguintes metas de suporte:\n• Garantir o aporte financeiro inicial da taxa territorial de ativação (R$ 15.000,00).\n• Fornecer o capital de giro necessário para aquisição do primeiro lote de bobinas da BlackShop™ para início imediato das aplicações.\n• Monitorar remotamente a saúde do ecossistema e compliance de marca através do painel integrado."
      },
      {
        ref: "03",
        label: "Encargos do Técnico Aplicador",
        content: "Cabe ao Aplicador de Elite parceiro assegurar a entrega técnica:\n• Executar a aplicação técnica com precisão profissional absoluta no local indicado pelo cliente final.\n• Manter as Ordens de Serviço (OS) 100% atualizadas e preenchidas dentro do WINF OS™.\n• Submeter-se à formação contínua da WINF Academy para garantia da satisfação de alto padrão."
      },
      {
        ref: "04",
        label: "Da Divisão Integral de Resultados (Payout)",
        content: "A divisão padrão de lucros líquidos apurados no território será estabelecida na proporção simétrica de 50% (cinquenta por cento) para o Investidor Padrinho e 50% (cinquenta por cento) para o Aplicador de Elite, garantindo transparência total na queima operacional via calculadora de saldo do WINF Precision™."
      }
    ]
  },
  {
    id: "doc-04",
    num: "04",
    category: "Contratos & Compliance",
    title: "Termo de Uso WINF OS™ e Anuência de Trava Digital",
    subtitle: "Modalidade: Licenciamento Integrado à Rede de Suprimentos BlackShop™",
    description: "Regulação do software de gestão, estimador de perdas, orquestrador e rotinas anticorrupção sistêmica.",
    sections: [
      {
        ref: "01",
        label: "Licença de Uso de Software",
        content: "Este termo regula o acesso temporário, revogável e não-exclusivo ao software de gestão e vendas WINF OS™, incluindo o estimador de perdas e corte WINF Precision™, o integrador de atendimento via WhatsApp W-NO (Núcleo Operacional) e os relatórios analíticos integrados de faturamento da unidade."
      },
      {
        ref: "02",
        label: "Engenharia da Trava de Saldo Decrescente",
        content: "O licenciado declara plena ciência e concorda que cada bobina original comercializada possui um saldo digital atrelado em metros quadrados ($m²$). A calculadora de corte realiza a baixa linear de estoque a cada Ordem de Serviço lançada em campo. Ao atingir o nível zero, a emissão automatizada de Certificados de Garantia em Blockchain é congelada para aquele lote até a respectiva reposição financeira."
      },
      {
        ref: "03",
        label: "Diretrizes Anti-Pirataria e Confisco Remoto",
        content: "A utilização ilegal de películas de terceiros ou fraudes intencionais no algoritmo de balanceamento do Firebase resulta no desligamento imediato do token de autorização, privando a unidade de seu córtex conversacional W-NO e direcionando todos os novos leads locais de forma automática para as dependências da holding Matriz central."
      }
    ]
  },
  {
    id: "doc-05",
    num: "05",
    category: "Desenvolvimento de Campo",
    title: "Manual Executivo do Quiosque e Hub Imersivo VR",
    subtitle: "Status: Especificações Técnicas e Arquitetura para Centros Triple-A",
    description: "Instalação física de prospecção rápida em fluxos de shoppings, estações VR e integração ao robô WNO.",
    sections: [
      {
        ref: "01",
        label: "Propósito do Concept Físico-Digital",
        content: "O Quiosque WINF™ atua como um hub físico e imersivo de prospecção expressa de leads de altíssimo faturamento. Foi projetado especificamente para ser implementado em fluxos comerciais Premium e shoppings de alta renda, facilitando a atração espontânea de novos agendamentos por impulso via experiência visual imersiva."
      },
      {
        ref: "02",
        label: "Estrutura e Arquitetura de Design do Totem",
        content: "O quiosque deve incluir rigorosamente os seguintes componentes homologados pela central:\n• Totem de Autoatendimento: Equipado com interface de toque capacitivo conectada nativamente ao terminal de inteligência do W-NO (Núcleo Operacional).\n• Estação de Realidade Virtual: Configuração completa de óculos VR rodando o showroom interativo 3D de supercarros e projetos arquitetônicos residenciais de alto luxo.\n• Estética Visual: Iluminação estruturada em painéis de LED direcionados, carcaça metálica pesada em aço carbono preto fosco e suportes ergonômicos escurecidos de alta durabilidade."
      },
      {
        ref: "03",
        label: "Integração e Agendamento Automático",
        content: "Os contatos captados de forma presencial no Totem realizam o envio imediato de chamados e barramentos de dados diretamente para o ecossistema unificado do WINF OS™ regional, permitindo agendamento instantâneo monitorado em tempo real pelo robô comercial central."
      }
    ]
  },
  {
    id: "doc-06",
    num: "06",
    category: "Equity & Dividendos",
    title: "Contrato de Sociedade em Conta de Participação (SCP)",
    subtitle: "Restrito: Produto Beta // Ativo Financeiro Integrado de Capital Privado",
    description: "Captação de cotas financeiras, spread na importação coletiva de películas e reinvestimento compulsório.",
    sections: [
      {
        ref: "01",
        label: "Finalidade e Promoção de Co-Investimento",
        content: "O presente instrumento regula a aportação de cotas financeiras de investimento (mínimo de R$ 50.000,00 por contrato) diretamente no caixa de importação coletiva da distribuidora BlackShop™. O montante destina-se exclusivamente ao financiamento, frete e reserva de suprimentos nanotecnológicos de Window Film diretamente com os parceiros internacionais da cadeia asiática."
      },
      {
        ref: "02",
        label: "Reinvestimento Compulsório em Google Ads de Campo",
        content: "Como mecanismo técnico de aceleração e retroalimentação do ecossistema, uma parcela exata de 10% (dez por cento) do faturamento e spread bruto de escoamento obtidos pela holding na venda de películas para as unidades é convertida automaticamente em tráfego pago geolocalizado (Google Ads e Meta) para alimentar os autorizados de cada região. O sucesso do aplicador garante o giro do pool."
      },
      {
        ref: "03",
        label: "Distribuição Trimestral de Dividendos",
        content: "O faturamento decorrente do balanceamento e venda de películas garante remunerações estáveis aos cotistas participantes. Com base na queima de metros quadrados monitorada pelo WINF Precision™, as projeções financeiras calculam retorno líquido de 24% a 36% ao ano, lastreado nas métricas robustas de consumo e recompra."
      }
    ]
  },
  {
    id: "doc-07",
    num: "07",
    category: "Equity & Dividendos",
    title: "Estatuto de Admissão e Conselho Masters W12",
    subtitle: "Restrito: Produto Gamma (Cadeiras de Infraestrutura e Mérito Máximo)",
    description: "Cadeiras de alta diretoria por mérito ('w_rank_xp'), modelo Flagship regional e regras de conventions.",
    sections: [
      {
        ref: "01",
        label: "Estrutura do Conselho W12",
        content: "O conselho de alto nível W12 é composto por exatamente 12 (doze) cadeiras diretivas estratégicas e exclusivas: duas cadeiras pertencentes aos sócios fundadores originais da holding e dez cadeiras abertas a grandes players investidores do Produto Gamma ou operadores de elite que dominam o ranking nacional de mérito técnico da plataforma (`w_rank_xp`)."
      },
      {
        ref: "02",
        label: "Modelo de Participação Regional em Royalty Zero",
        content: "O parceiro conselheiro participante assume a concessão para a instalação e replicação física de uma Flagship Matriz Regional. Em contrapartida, adquire o direito irrevogável de recebimento sob demanda de uma participação nos dividendos e spread de repasse de metros quadrados de película movimentados dentro de toda a sua jurisdição macrorregional acordada."
      },
      {
        ref: "03",
        label: "Memorial Descritivo de Design (Loft Industrial Rústico)",
        content: "O concessionário compromete-se por este estatuto a obedecer rigidamente o manual arquitetônico oficial da marca WINF AeroCore™: instalações físicas de alto padrão projetadas imitando lofts industriais premium (uso rústico de concreto bruto lapidado, tijolos escurecidos aparentes, tubulações expostas, iluminação cinematográfica cênica em LED e supercarros de alta performance expostos em baias de salão de design)."
      },
      {
        ref: "04",
        label: "Calendário Semestral de Convenções e Private Equity",
        content: "Os conselheiros realizarão reuniões deliberativas semestrais de forma presencial na sede matriz oficial para tratar de alinhamentos táticos, planejamento de valuation de mercado, auditar as contas e fluxos de importação da BlackShop™ e homologar novas frentes de expansão e branding internacional (M&A)."
      }
    ]
  },
  {
    id: "doc-08",
    num: "08",
    category: "Financeiro & Custos",
    title: "Dossiê de Transparência e Tabela de Custos",
    subtitle: "Dossiê Obrigatório de Custos, Margens e Regras de Tráfego do Pool",
    description: "Matriz aberta e analítica de custos aduaneiros, spread da holding, preço autorizado e regras matemáticas de tráfego.",
    sections: [
      {
        ref: "01",
        label: "Cadeia de Suprimentos e Arbitragem de Importação",
        content: "Este documento constitui o anexo financeiro e técnico do Contrato de Sociedade em Conta de Participação (SCP) do Produto Beta. A sustentabilidade e a taxa de retorno distribuída aos investidores cotistas provêm exclusivamente da arbitragem comercial operada pela distribuidora BlackShop™ na importação em larga escala de películas nanotecnológicas originárias do mercado asiático.\nO custo bruto de fabricação e desembaraço aduaneiro desses insumos é cotado em moeda estrangeira fracionada por metro quadrado, permitindo à holding uma margem bruta estruturada de repasse ao mercado interno, blindando o pool contra variações locais de inflação."
      },
      {
        ref: "02",
        label: "Regra Matemática de Reinvestimento Compulsório em Anúncios",
        content: "Para assegurar a velocidade do giro de estoque (queima de metros quadrados) e afastar o risco de estagnação de capital em bobinas paradas, fica instituída a trava sistêmica de Ads. Uma fração exata de 10% (dez por cento) de todo o spread bruto apurado pela BlackShop™ na venda de insumos para os licenciados é direcionada na origem para a conta de tráfego pago geolocalizado da respectiva praça.\nEsta regra é automatizada via gatilho de API no software WINF OS™: a cada faturamento de bobina efetuado pela matriz, o saldo correspondente de marketing é liberado no gerenciador de anúncios do Google e Meta apontando para a cidade parceira, capturando novos leads que serão convertidos de forma autônoma pela IA W-NO (Núcleo Operacional)."
      },
      {
        ref: "03",
        label: "Mecanismo de Auditoria do Pool e Payout",
        content: "A auditoria e o balanço do Produto Beta não dependem de validações manuais. O investidor cotista possui acesso a um painel analítico centralizado onde pode checar a movimentação volumétrica da distribuidora. Cada Ordem de Serviço finalizada na ponta deduz linearmente o saldo de metros quadrados da bobina associada, registrando um hash imutável na Blockchain. Os dividendos acumulados do Pool de Liquidez são liquidados e distribuídos em conta corrente aos sócios participantes trimestralmente."
      }
    ]
  },
  {
    id: "doc-09",
    num: "09",
    category: "Onboarding & Ativação",
    title: "Manual de Onboarding e Roadmap Operacional (Alpha)",
    subtitle: "Produto Alpha: Ativação Territorial e Integração de Unidade Asset-Light",
    description: "Provisionamento financeiro do enxoval técnico, geolocalização, entrega turn-key de sistemas e suporte técnico.",
    sections: [
      {
        ref: "01",
        label: "Engenharia Financeira de Ativação",
        content: "O modelo de concessão estabelece o provisionamento da licença territorial Asset-Light mediante o pagamento da Taxa Única de Ativação Territorial no valor de R$ 15.000,00 (quinze mil reais) pelo parceiro homologado.\nO Licenciado Autorizado adquire, no ato da compensação, o direito de recebimento de um enxoval físico inicial de insumos da Linha Select™ composto por exatamente 7,50 metros lineares de película de alta performance para cada uma das frentes tecnológicas da marca:\n• Dual Reflect: Película arquitetônica de alta rejeição e controle térmico por refletividade.\n• BlackPro: Linha de altíssima escuridão interna e privacidade para o segmento automotivo.\n• Invisible: Película de engenharia invisível de alta transparência com máximo bloqueio infravermelho.\nNota de Rendimento Técnico: A metragem linear de 7,50 metros fornecida equivale a aproximadamente 11m² (onze metros quadrados) de área útil por linha de produto, desde que rigidamente processada e otimizada pelo software de corte de perdas da franqueadora."
      },
      {
        ref: "02",
        label: "Protocolo de Ativação de Território",
        content: "Imediatamente após a confirmação financeira, o operador recebe credenciais exclusivas para acessar a plataforma WINF OS™ e dar início à reserva de seu perímetro. A ativação do território é condicionada ao preenchimento integral do Formulário de Ativação Territorial pela retaguarda do parceiro, fornecendo dados de geolocalização comercial, contatos de campo e informações para o provisionamento dos sistemas."
      },
      {
        ref: "03",
        label: "Entrega da Estrutura Digital 'Turn-Key'",
        content: "Recebido o formulário preenchido, a equipe técnica de engenharia da WINF assume a configuração integral da infraestrutura do parceiro, entregando o ecossistema totalmente pronto para operação em até 48 horas, composto por:\n• Conta de E-mail Profissional: Endereço corporativo exclusivo para trâmite legal, acesso às ferramentas internas e recebimento de notificações operacionais.\n• Google Workspace Hub: Conta Google parametrizada com os canais de dados e ferramentas de produtividade vinculadas à central.\n• Google Meu Negócio (SEO Local): Configuração do estúdio geolocalizado nos mecanismos de pesquisa e mapas do Google para captura direta de chamados orgânicos na região homologada.\n• Subdomínio de Alta Conversão: Criação de página web individualizada no barramento oficial da holding (ex: suacidade.winfpartners.com).\n• Redes Sociais Impulsionadas: Criação, padronização visual sob a identidade AeroCore™ e lançamento de campanhas de tráfego pago iniciais nas principais redes sociais de captação.\n• WhatsApp Business + Córtex W-NO (Núcleo Operacional): Envio de linha comercial configurada nativamente com a inteligência artificial proprietária W-NO (Núcleo Operacional), apta a executar o atendimento, triagem e agendamento automático de ordens de serviço 24 horas por dia."
      },
      {
        ref: "04",
        label: "Fluxo de Trabalho e Suporte Contínuo (WINF Academy)",
        content: "O acoplamento do licenciado ao novo fluxo de rotina ocorre através do programa prático de capacitação da WINF Academy. O operador é treinado unicamente para executar a aplicação técnica das películas originais recebidas, eliminando processos burocráticos. A retaguarda operacional é assistida em tempo real por um modelo híbrido de suporte técnico 24 horas por dia, combinando monitoramento automatizado via inteligência artificial com intervenção de engenharia humana em escala contínua."
      }
    ]
  },
  {
    id: "doc-10",
    num: "10",
    category: "Equity & Dividendos",
    title: "Roadmap de Tração, Transparência e Governança de Aporte (V2)",
    subtitle: "Dossiê de Alocação de Capital, Projeções de Liquidez e Regras de Saída (Stealth/Dark Corporate)",
    description: "Destinação pós-aporte institucional, mitigação de riscos, cenários preditivos e janelas estritas de retirada.",
    sections: [
      {
        ref: "01",
        label: "Diretrizes de Alocação Imediata de Capital (Pós-Aporte)",
        content: "Após a integralização e compensação do aporte na conta escrow institucional do ecossistema, os recursos serão direcionados imediatamente para as seguintes frentes de escoamento tático de mercado:\n• Pedidos Oficiais Diretos com o Fabricante: Abertura de lotes de importação aduaneira direta com fabricantes de nanotecnologia na Ásia, reduzindo o custo por metro quadrado (FOB) ao menor patamar e maximizando o spread da distribuidora BlackShop™.\n• Tração de Marketing e Tráfego Local: Direcionamento estratégico de verba publicitária para o portal central e divisão parametrizada por código para os subdomínios de cada território ativo, alimentando a IA W-NO (Núcleo Operacional) com leads de alto ticket na ponta.\n• Enxoval de Apoio Comercial BlackShop™: Produção e fornecimento exclusivo de materiais gráficos (flyers), janelas físicas de amostras, toalhas personalizadas e uniformes profissionais. A venda interna desses insumos para a rede gera uma linha secundária de faturamento e lucro líquido para o Pool de Liquidez."
      },
      {
        ref: "02",
        label: "Infraestrutura Fundacional e Validação dos Fundadores",
        content: "Para assegurar risco zero ao investidor em relação a ativos físicos primários, os fundadores assumem integralmente o desenvolvimento e validação da estrutura inicial de rede:\n• Operação Matriz Conceitual: O primeiro Quiosque institucional, o Estúdio AeroCore™ físico, o Centro de Armazenamento e o Hub de Processamento e Treinamento Técnico da WINF Academy serão bancados e geridos inteiramente pelos fundadores originais.\n• Escalabilidade de Modelos Validados: Uma vez consolidadas as métricas operacionais e a rotina de faturamento da matriz, a holding iniciará a comercialização nacional dos modelos de Quiosque e Flagship para investidores de larga escala."
      },
      {
        ref: "03",
        label: "Governança, Payouts e Métricas de Saída",
        content: "Regras rígidas de governança aplicadas ao fluxo de capital dentro do ecossistema privado WINF Partners:\n• Transparência por Código (WINF Precision™): O cotista audita o giro comercial através de um painel analítico com registros digitais integrados à Blockchain. Cada m² de película aplicado em campo deduz automaticamente o estoque do pool e provisiona os lucros reais, garantindo auditoria em tempo real e blindagem em conta escrow corporativa.\n• Engenharia de Payouts Trimestrais: Consolidação de resultados e distribuição de lucros realizada de forma líquida e recorrente no encerramento de cada trimestre. Pela estrutura jurídica de SCP (Art. 991 do Código Civil), os repasses ao Sócio Oculto são isentos de tributação na fonte.\n• Métricas de Saída Estruturadas (Exit Strategies): Ficam instituídas três janelas claras de liquidez para a retirada ou recompra do capital principal:\n  - Janela A (Holding Buyback): Direito de preferência da WINF Partners para recomprar a cota após o período de Payback com prêmio de valorização.\n  - Janela B (Liquidação de Estoque): Solicitação de retirada com aviso prévio de 90 dias, sendo o principal liquidado conforme o escoamento aduaneiro físico das bobinas vinculadas.\n  - Janela C (Transferência Restrita): Venda autorizada das cotas para terceiros investidores qualificados, mediante aprovação prévia e homologação do Conselho Masters W12."
      }
    ]
  },
  {
    id: "doc-11",
    num: "11",
    category: "Investidor & M&A",
    title: "Plano de Expansão Macro, Gatilhos de Escala e Exit Strategy (M&A)",
    subtitle: "Dossiê de Governança de Longo Prazo, Visão de Futuro Geopolítico e Liquidez Global (Universo Dark)",
    description: "Enxoval do investidor internacional, seleção cirúrgica de cidades pólo e 3 fases preditivas rumo a fusões globais.",
    sections: [
      {
        ref: "01",
        label: "O Enxoval de Entrega Exclusiva ao Investidor (Universo Dark)",
        content: "O investidor participante do ecossistema privado é integrado de forma nativa a uma infraestrutura corporativa de elite de controle patrimonial, recebendo os seguintes ativos operacionais de entrega imediata:\n• Acesso ao Dashboard Exclusivo Universo Dark: Painel analítico criptografado que centraliza os dados brutos de faturamento aduaneiro. Disponibilização contínua de relatórios mensais automáticos de auditoria e balanços de escoamento.\n• Conta de E-mail Profissional Corporativo: Provisionamento de conta dedicada sob domínio corporativo oficial da holding para comunicações criptografadas de alta governança.\n• Biblioteca de Manuais e Dossiês de Transparência: Entrega e homologação de toda a coletânea confidencial (COF, Manuais e Atas do Conselho Masters W12) para alinhamento e blindagem de compliance."
      },
      {
        ref: "02",
        label: "Expansão Geopolítica e Seleção de Cidades Polo",
        content: "A escalabilidade territorial do ecossistema foi projetada sob uma matriz matemática de escassez reversa calculada sobre o território nacional:\n• O Tabuleiro das 5.570 Cidades: O território brasileiro conta com exatamente 5.570 municípios. O planejamento estratégico veda a pulverização massiva da marca; a controladoria filtra e seleciona unicamente as cidades polo com maior densidade de PIB real, condomínios Triple-A e frotas concentradas de supercarros.\n• Monopólio Territorial por API: À medida que estas praças polo de alto rendimento são ocupadas por licenças Asset-Light ou Quiosques, o sistema WINF OS™ bloqueia as chaves de API daquela região, assegurando monopólio territorial absoluto ao operador e fluxo inelástico de insumos à distribuidora BlackShop™."
      },
      {
        ref: "03",
        label: "Tração em Escala Dinâmica: Quiosques e Modelos Asset-Light",
        content: "O crescimento geométrico de volume é estruturado por meio de duas ondas consecutivas de tração e comercialização comercial:\n• Onda 01: Venda Massiva de Licenças Asset-Light (Produto Alpha): Injeção capilar rápida de operadores autônomos em campo para queima de metros quadrados de película nanotecnológica, acelerando a receita recorrente logística da distribuidora sem gerar custos fixos estruturais de ponto para a holding.\n• Onda 02: Disseminação de Quiosques e Estúdios Físicos: Lançamento planejado das unidades franqueadas de Quiosques Tecnológicos e Hubs Imersivos de VR em shoppings e centros comerciais estratégicos de alta renda, atuando como vitrines institucionais magnéticas de alto ticket."
      },
      {
        ref: "04",
        label: "Roadmap de Internacionalização e Exit Strategy (M&A)",
        content: "A visão terminal da WINF Partners é focada em um evento definitivo de liquidez global via Private Equity, estruturado em três fases progressivas de Valuation:\n• Fase 1: Domínio Nacional - Consolidação das praças polo selecionadas no Brasil via modelos Asset-Light e Quiosques, travando a exclusividade da cadeia aduaneira BlackShop™. ARR massiva, previsível e auditada em Blockchain.\n• Fase 2: Internacionalização - Exportação do modelo FaaS (Franchise as-a-Service) e das licenças digitais do WINF OS™ para mercados selecionados das Américas e Europa, multiplicando o faturamento em moedas fortes ($/€).\n• Fase 3: Evento de Saída M&A - Abertura de negociação de fusão ou venda de participação majoritária estratégica da holding internacionalizada diretamente para o fabricante global asiático de películas. Retornando o capital principal dos investidores originais multiplicado."
      }
    ]
  },
  {
    id: "doc-12",
    num: "12",
    category: "Desenvolvimento de Campo",
    title: "Procedimento Operacional Padrão (POP) - Implantação Turn-Key Alpha",
    subtitle: "Implantação Turn-Key Alpha: Configuração e Entrega Territorial em 48 Horas",
    description: "Manual prático de rotina de abertura de campo, DNS, fichas Google, perfis sociais e cortex conversacional.",
    sections: [
      {
        ref: "01",
        label: "Infraestrutura de Identidade (E-mail e Workspace)",
        content: "A criação da camada de identidade institucional constitui o primeiro estágio crítico da implantação digital, habilitando os acessos subsequentes do parceiro à rede corporativa.\nDIRETRIZ DE EXECUÇÃO:\n• Criação de Conta: Desenvolver 1 (uma) conta de e-mail profissional criptografada dentro do painel Google Workspace administrado pela holding.\n• Padrão de Nomenclatura (Rigoroso): O endereço gerado deve obrigatoriamente seguir a estrutura: cidade@winfpartners.com (Exemplo: santos@winfpartners.com).\n• Senha e Credenciais: Definir uma senha provisória padronizada com a trava de segurança 'Exigir alteração de senha no primeiro acesso'. Vincular as regras de alias para cópia automática de alertas à controladoria."
      },
      {
        ref: "02",
        label: "Presença Web Regional (Subdomínio e Landing Page)",
        content: "Desenvolvimento do canal proprietário de pouso focado no mercado geolocalizado de alta renda, atuando como portal oficial da praça selecionada.\nDIRETRIZ DE EXECUÇÃO:\n• Apontamento de DNS: Acessar o servidor de DNS da holding (Cloudflare) e criar um novo registro do tipo CNAME direcionando o termo da cidade homologada para o servidor central (Exemplo: URL final cidade.winfpartners.com).\n• Duplicação de Template: Clonar o modelo master de alta conversão da Landing Page da Linha Select™ dentro do servidor institucional.\n• Customização de Dados Locais: Atualizar as metatags, títulos geográficos da região de atendimento e integrar os botões de ação (CTA) diretamente à API do novo canal de WhatsApp da praça."
      },
      {
        ref: "03",
        label: "Posicionamento Orgânico Local (Google Meu Negócio)",
        content: "Parametrização da ficha corporativa de mapas para indexação rápida nos motores de busca do Google na região, capturando demandas urgentes de alto padrão.\nDIRETRIZ DE EXECUÇÃO:\n• Abertura de Ficha: Criar uma nova empresa no painel master do Google Business Profile com a nomenclatura padronizada: Winf Partners - Películas Premium - [Nome da Cidade].\n• Configuração de Perímetro: Marcar estritamente a área de cobertura estabelecida no perímetro do contrato territorial do licenciado, vedando sobreposição em cidades vizinhas.\n• Upload de Acervo Visual: Carregar o portfólio oficial monocromático AeroCore™ de imagens conceituais de engenharia arquitetônica e supercarros. Acionar o método de verificação automatizada via retaguarda."
      },
      {
        ref: "04",
        label: "Vitrines Sociais e Contas de Anúncios (Meta & Google Ads)",
        content: "Estruturação dos perfis públicos de branding da unidade e ativação do barramento de tráfego pago alimentado pelo spread inicial da distribuidora.\nDIRETRIZ DE EXECUÇÃO:\n• Criação de Perfis: Criar conta de Instagram comercial sob o padrão @winf.[cidade] integrada à página institucional de Facebook correspondente.\n• Padronização de Feed: Implementar a identidade monocromática na foto de perfil e publicar o grid de largada conceitual contendo informações técnicas de blindagem das séries BlackPro, Dual Reflect e Invisible (bloqueio de até 100% UV e 90% IR).\n• Pixel e Campanhas: Instalar os códigos de rastreamento na Landing Page local. Configurar as primeiras campanhas de tráfego pago geolocalizadas apontadas exclusivamente para bairros e condomínios de alto luxo da praça ativa."
      },
      {
        ref: "05",
        label: "Integração do Córtex Automatizado (W-NO (Núcleo Operacional))",
        content: "Conexão do número comercial do parceiro ao robô de atendimento cognitivo inteligente da holding para operação e agendamento contínuo 24/7.\nDIRETRIZ DE EXECUÇÃO:\n• Pareamento de API: Emitir o QR Code de conexão da Evolution API e transferir ao operador local para sincronização imediata do dispositivo físico de campo.\n• Injeção de Variáveis Locais: Inserir na matriz prompt da IA as tabelas de preços específicas da região (parametrizadas pela calculadora WINF Precision™) e a lista de bairros autorizados de cobertura.\n• Homologação de Fluxo: Efetuar três testes de conversação internos simulando quebra de objeções climáticas e certificar o correto provisionamento da Ordem de Serviço automática gerada direto no painel WINF OS™."
      }
    ]
  },
  {
    id: "doc-13",
    num: "13",
    category: "Marketing & Midia",
    title: "Manual de Posicionamento Digital, Curadoria Visual e Diretrizes de Mídia",
    subtitle: "Diretrizes de Execução para Redes Sociais, Otimização de SEO Local e Provimento de Catálogos",
    description: "Guia estético Ultra-Premium do 'Universo Dark', regras de feed tático, geotagging e textos de WhatsApp.",
    sections: [
      {
        ref: "01",
        label: "Identidade Visual Base e Posicionamento Ultra-Premium",
        content: "A comunicação e a linha editorial das praças territoriais autorizadas WINF Partners devem seguir rigorosamente a estética de alta sofisticação do 'Universo Dark'. O posicionamento tático visa extinguir de forma absoluta a percepção de mercado de 'oficina comum de insulfilm', elevando a unidade local ao patamar de estúdio de engenharia térmica e curadoria digital de alta performance.\nTodos os conteúdos gráficos, fotos e criativos devem priorizar enquadramentos limpos, iluminação cinematográfica e ambientes que remetam ao padrão arquitetônico loft industrial rústico (concreto bruto, tijolo aparente) associados a supercarros ou residências Triple-A."
      },
      {
        ref: "02",
        label: "Engenharia do Feed Híbrido (Instagram e Facebook)",
        content: "A grade de postagens (Grid) das unidades locais deve operar de forma simétrica e intercalada, equilibrando autoridade corporativa com forte apelo aspiracional de consumo:\n• Criativos Padrão Institucionais (Templates Fixos): Publicações em formato estático ou carrossel utilizando o acervo limpo de alta conversão fornecido pela matriz. Foco em chamadas de impacto direto no problema do calor extremo ('MAIS LUZ, MENOS CALOR', 'O PODER QUE VOCÊ NÃO VÊ, MAS SENTE'), intercaladas com posts de autoridade nacional destacando executivos e curadores da holding (Henrique Uchôa, Mirella Noir).\n• Conteúdo Dinâmico em Vídeo (Reels e Bastidores): Captação em alta definição registrando os processos reais de instalação nas residências e veículos nobres da cidade ativa. A narrativa deve enfatizar os bastidores, o cuidado extremo com o patrimônio do cliente e a precisão do corte cirúrgico das películas originais.\n• Estruturação Estrita de Destaques (Highlights): Elementos fixos no topo do perfil que atuam como a vitrine de fechamento e quebra de objeções. Devem ser segmentados estritamente em quatro blocos:\n  1. TECNOLOGIA: Explicação molecular do bloqueio de até 100% UV e 90% IR da Linha Select™.\n  2. PORTFÓLIO: Amostragem real das séries Dual Reflect, BlackPro e Invisible aplicadas em campo.\n  3. EXPERIÊNCIA: Provas sociais e depoimentos de clientes (Case 'Carla - Refúgio Confortável').\n  4. AGENDAMENTO: Gatilho de direcionamento automático para a conversão via IA W-NO (Núcleo Operacional)."
      },
      {
        ref: "03",
        label: "Estruturação do Catálogo Corporativo (WhatsApp Business)",
        content: "A qualificação e o fechamento automático realizados pelo N.O. (Núcleo Operacional) (Núcleo Operacional) devem ser amparados pelo catálogo oficial de produtos do aplicativo comercial. O Squad de Operações deve configurar os itens com mídias quadradas dedicadas e especificações técnicas idênticas à matriz:\n• Linha Select™: Dual Reflect: Película de controle solar e engenharia térmica de alta refletividade externa. Rejeição extrema de calor infravermelho e equilíbrio estético perfeito para grandes panos de vidro arquitetônicos.\n• Linha Select™: BlackPro: Privacidade absoluta e alta escuridão interna sem perda de visibilidade de dentro para fora. Bloqueio maciço contra raios UV e calor, desenhado para o segmento automotivo de elite.\n• Linha Select™: Invisible: Escudo de proteção térmica invisível. Máxima rejeição de calor através de tecnologia nanocerâmica molecular sem alterar a transparência original do vidro e a iluminação natural do ambiente."
      }
    ]
  },
  {
    id: "doc-14",
    num: "14",
    category: "Desenvolvimento de Campo",
    title: "Dossiê Técnico-Visual de Pesquisa, Custos e Inventário (V2)",
    subtitle: "Gabarito de Compras, Integração com Maquetes 3D e Governança de Transparência Patrimonial",
    description: "Mesa de corte backlit, plotters de alto volume, estações pretas de ferramentas de elite, claraboias suspensas e renders 3D.",
    sections: [
      {
        ref: "01",
        label: "Diretrizes de Pesquisa, Critérios de Homologação e Auditoria",
        content: "Este documento constitui a matriz analítica oficial para o levantamento real de custos, compras e provimento de ativos da holding WINF Partners, englobando o Protótipo Kiosk e a Unidade Matriz Central. Todas as aquisições listadas abaixo devem obrigatoriamente passar por três cotações formais de mercado e ser lançadas no barramento de governança com sua respectiva nota fiscal digital vinculada.\n• Passo 1: Cotação de Hardware e Estruturas Metálicas (Kiosk Mode): Mapeamento de fábricas metalúrgicas e integradores de tecnologia OEM para cotar a estrutura em aço carbono preta fosca. Exigir telas capacitivas de 43 polegadas com proteção antivandalismo e processadores industriais dedicados.\n• Passo 2: Homologação de Engenharia Olfativa e Sensorial: Cotação com laboratórios químicos de perfumaria fina para o desenvolvimento do aroma proprietário ('Cheiro de Loja'). Máquinas nebulizadoras com wi-fi integrado.\n• Passo 3: Maquinário Pesado de Corte Computadorizado: Levantamento de custos de Plotters de Recorte de alta precisão (boca útil de 1,60m) com servo-motores e sensores ópticos. Vidros temperados pesados para as mesas de corte industrial com calhas de fita LED embutidas (Backlight).\n• Passo 4: Alfaiataria e Uniformização Corporativa de Luxo: Produção de fardamento premium (Bonés Tactical, Camisetas Pima, Calças Ripstop Tech e Toalhas pretas cortadas a laser)."
      },
      {
        ref: "02",
        label: "Infraestrutura da Unidade Matriz (Studio Comercial & CD)",
        content: "A Unidade Matriz da holding concentra o estúdio de atendimento a frotas hiper-premium e a base de fracionamento logístico da distribuidora BlackShop™. Sua estrutura física exige os seguintes componentes:\n• Mesa de Corte Profissional para Insumos: Estrutura pesada em perfis metálicos, tampo de vidro temperado espesso, réguas em relevo milimétrico e sistema interno de iluminação traseira em LED (Backlight) de alta intensidade.\n• Plotter de Recorte Industrial Computadorizado: Equipamento com largura de boca útil mínima de 1,60 metros, servo-motores de alta velocidade e pressão molecular de lâmina. Opera acoplado nativamente ao ecossistema de software de moldes digitais da holding.\n• Bancada e Estações de Ferramentas de Elite (Kit para 3 ou 4 Aplicadores): Bancada centralizada em aço carbono para organização de ferramentas finas (Sopradores térmicos digitais, Squeegees importados de poliuretano, borrifadores de alta pressão e lanternas de inspeção de luz fria).\n• Totem Corporativo Espelho: Instalação de uma unidade idêntica ao Totem interativo do Quiosque dentro da recepção do Studio para simulação de orçamentos e abertura de Ordens de Serviço."
      },
      {
        ref: "03",
        label: "Engenharia Pedagógica do Centro de Treinamento (WINF Academy)",
        content: "O Centro de Treinamento foi planejado sob conceitos inovadores de arquitetura escolar e engenharia ergonômica, visando acelerar a formação dos novos instaladores e franqueados da rede sem causar o desgaste físico tradicional do setor:\n• Esquadrias e Janelas Projetadas em Modelo Sala de Aula: Instalação de anteparos modulares de alumínio industrial contendo uma amostragem completa de portas de correr em vidro temperado.\n• Inovação Ergonômica: Janelas Clarabóia de Altura Acessível: Projeto exclusivo WINF Academy onde esquadrias horizontais e clarabóias de teto são montadas em braços mecânicos articulados ao nível do solo. O aluno aprende a moldar, cortar e aplicar a película no vidro horizontal simulando a inclinação de um teto real, porém trabalhando em uma altura confortável de bancada. Isso elimina o desgaste muscular na região cervical e nos ombros."
      }
    ]
  }
];

export const ModuleWnoKnowledge: React.FC = () => {
  const { user } = useWinf();
  const userId = user?.id || 'demo-user';

  // Firestore-linked properties for database tracking (Original memory retention)
  const [knowledgeList, setKnowledgeList] = useState<RayKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New states for Document reading hub
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-01");
  const [docSearchQuery, setDocSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Form states for custom teaching (Ensinar o W-NO)
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newConfidence, setNewConfidence] = useState(100);
  const [isSuccessAction, setIsSuccessAction] = useState(false);
  const [rayFeedback, setRayFeedback] = useState<string | null>(null);
  const [isTeaching, setIsTeaching] = useState(false);

  // Filter states for memory audits
  const [filterSource, setFilterSource] = useState<'ALL' | 'MANUAL' | 'AUTO_CONVERSATION' | 'SYSTEM'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [oracleSearchQuery, setOracleSearchQuery] = useState('');

  // Editing state for memories
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState('');
  const [editContent, setEditContent] = useState('');

  // Interactive Calculators States
  // Calculator 1: Spread & Profit (Doc 08)
  const [calcFilmSeries, setCalcFilmSeries] = useState<'blackpro' | 'dualreflect' | 'invisible'>('invisible');
  const [calcMeters, setCalcMeters] = useState<number>(30); // 1 bobina padrão de 30m
  
  // Calculator 2: Aporte & Retorno (Doc 10)
  const [selectedAporteCenario, setSelectedAporteCenario] = useState<'A' | 'B' | 'C'>('C');

  // Interactive Checklist states (Doc 14)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'a-1': true,
    'a-2': false,
    'a-3': false,
    'a-4': true,
    'b-1': false,
    'b-2': false,
    'b-3': true,
    'c-1': false,
    'c-2': false,
  });

  const handleToggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getChecklistProgress = () => {
    const total = Object.keys(checkedItems).length;
    const checked = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checked / total) * 100);
  };

  // Fetch Firestore memories or local backup (W-NO Knowledge database)
  const fetchKnowledge = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const q = query(
        collection(db, 'wno_knowledge'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const stored = localStorage.getItem(`wno_knowledge_${userId}`);
        if (stored) {
          setKnowledgeList(JSON.parse(stored));
        } else {
          // Fallback templates to seeded memory
          const templates: RayKnowledge[] = [
            {
              id: 'k-sys-1',
              user_id: userId,
              topic: 'Atendimento & Vendas',
              source: 'SYSTEM',
              content: 'Priorizar o isolamento térmico ultra-eficiente (até 97% de rejeição de radiação infravermelha) ao abordar novos contatos interessados na Invisible® Series.',
              confidence: 100,
              status: 'APPROVED',
              created_at: new Date(Date.now() - 3600000 * 48).toISOString()
            },
            {
              id: 'k-sys-2',
              user_id: userId,
              topic: 'Tabela de Custos (Documento 08)',
              source: 'SYSTEM',
              content: 'Série BlackPro custa R$ 12,50/m² de importação FOB, repassado aos franqueados autorizados por R$ 35,00/m². Série Dual Reflect custa R$ 18,00/m² de importação, repasse de R$ 45,00/m². Série Invisible custa R$ 25,00/m² importação, repasse R$ 65,00/m².',
              confidence: 100,
              status: 'APPROVED',
              created_at: new Date(Date.now() - 3600000 * 24).toISOString()
            },
            {
              id: 'k-sys-3',
              user_id: userId,
              topic: 'SCP Distribuição e Tráfego (Documento 06 / 08)',
              source: 'SYSTEM',
              content: 'Trava sistêmica de Ads converte automaticamente dedução de 10% de todo spread gerado pela BlackShop em campanhas locais geo-segmentadas para alimentar a IA comercial WNO.',
              confidence: 100,
              status: 'APPROVED',
              created_at: new Date(Date.now() - 3600000 * 12).toISOString()
            }
          ];
          setKnowledgeList(templates);
          localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(templates));
        }
      } else {
        const fetched: RayKnowledge[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as RayKnowledge);
        });
        setKnowledgeList(fetched);
        localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(fetched));
      }
    } catch (e) {
      console.warn("Firestore access error, fallback to local cache", e);
      const stored = localStorage.getItem(`wno_knowledge_${userId}`);
      if (stored) {
        setKnowledgeList(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [userId]);

  // Handle teaching submission
  const handleTeachRay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTeaching) return;
    if (!newTopic.trim() || !newContent.trim()) return;

    setIsTeaching(true);

    const newItem: Omit<RayKnowledge, 'id'> = {
      user_id: userId,
      topic: newTopic.trim(),
      source: 'MANUAL',
      content: newContent.trim(),
      confidence: newConfidence,
      status: 'APPROVED',
      created_at: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'wno_knowledge'), newItem);
      const savedItem: RayKnowledge = { id: docRef.id, ...newItem };
      const updated = [savedItem, ...knowledgeList];
      setKnowledgeList(updated);
      localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(updated));
    } catch (err) {
      const fallbackId = `k-local-${Math.random().toString(36).substr(2, 9)}`;
      const savedItem: RayKnowledge = { id: fallbackId, ...newItem };
      const updated = [savedItem, ...knowledgeList];
      setKnowledgeList(updated);
      localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(updated));
    } finally {
      setIsTeaching(false);
    }

    setRayFeedback(`🦾 NÚCLEO COGNITIVO EXPANDIDO: Entendi e salvei a diretriz sobre "${newTopic.trim()}". Esta regra está ativa e será integrada aos meus prompts de conversação no robô.`);
    setIsSuccessAction(true);
    setNewTopic('');
    setNewContent('');
    setNewConfidence(100);

    setTimeout(() => {
      setIsSuccessAction(false);
    }, 5000);
  };

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = knowledgeList.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus, confidence: newStatus === 'APPROVED' ? 100 : item.confidence };
      }
      return item;
    });
    setKnowledgeList(updated);
    localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(updated));

    try {
      const docRef = doc(db, 'wno_knowledge', id);
      await updateDoc(docRef, { 
        status: newStatus,
        confidence: newStatus === 'APPROVED' ? 100 : 50
      });
    } catch (err) {
      console.warn("Firestore update caching locally.");
    }

    setRayFeedback(`Diretriz neural atualizada para status: ${newStatus === 'APPROVED' ? 'ATIVADO' : 'SUSPENSO'}.`);
    setTimeout(() => setRayFeedback(null), 4000);
  };

  // Save Inline Edit
  const handleSaveEdit = async (id: string) => {
    if (!editTopic.trim() || !editContent.trim()) return;

    const updated = knowledgeList.map(item => {
      if (item.id === id) {
        return { ...item, topic: editTopic.trim(), content: editContent.trim() };
      }
      return item;
    });
    setKnowledgeList(updated);
    localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(updated));

    try {
      const docRef = doc(db, 'wno_knowledge', id);
      await updateDoc(docRef, { 
        topic: editTopic.trim(),
        content: editContent.trim()
      });
    } catch (err) {
      console.warn("Firestore edit cache sync.");
    }

    setEditingId(null);
    setRayFeedback('Instrução refinada com sucesso.');
    setTimeout(() => setRayFeedback(null), 3000);
  };

  // Delete item
  const handleDeleteKnowledge = async (id: string) => {
    const updated = knowledgeList.filter(item => item.id !== id);
    setKnowledgeList(updated);
    localStorage.setItem(`wno_knowledge_${userId}`, JSON.stringify(updated));

    try {
      const docRef = doc(db, 'wno_knowledge', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore delete syncing.");
    }
  };

  // Filtering lists
  const filteredDocs = TACTICAL_DOCUMENTS.filter(docItem => {
    const matchesCategory = categoryFilter === "ALL" || docItem.category === categoryFilter;
    const matchesSearch = docSearchQuery === "" || 
      docItem.title.toLowerCase().includes(docSearchQuery.toLowerCase()) || 
      docItem.subtitle.toLowerCase().includes(docSearchQuery.toLowerCase()) || 
      docItem.description.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      docItem.sections.some(s => s.label.toLowerCase().includes(docSearchQuery.toLowerCase()) || s.content.toLowerCase().includes(docSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredKnowledge = knowledgeList.filter(item => {
    const matchesSource = filterSource === 'ALL' || item.source === filterSource;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch = oracleSearchQuery === '' || 
      item.topic.toLowerCase().includes(oracleSearchQuery.toLowerCase()) || 
      item.content.toLowerCase().includes(oracleSearchQuery.toLowerCase());
    return matchesSource && matchesStatus && matchesSearch;
  });

  const activeDoc = TACTICAL_DOCUMENTS.find(d => d.id === selectedDocId) || TACTICAL_DOCUMENTS[0];

  // Pricing constants for Document 08 Tab
  const filmPricing = {
    blackpro: { name: 'Série BlackPro (Automotiva)', import: 12.5, authorized: 35.0, margin: '64%' },
    dualreflect: { name: 'Série Dual Reflect (Arquitetura)', import: 18.0, authorized: 45.0, margin: '60%' },
    invisible: { name: 'Série Invisible (Escudo Térmico)', import: 25.0, authorized: 65.0, margin: '61%' }
  };

  const getCalculatedSpread = () => {
    const selected = filmPricing[calcFilmSeries];
    const rollArea = calcMeters * 1.52; // bobinas padrão são 1.52m de largura
    const totalImportCost = rollArea * selected.import;
    const totalRepassePrice = rollArea * selected.authorized;
    const totalSpreadHolding = totalRepassePrice - totalImportCost;
    const trafficReinvestment = totalSpreadHolding * 0.1;
    const netProfitToPool = totalSpreadHolding - trafficReinvestment;
    
    return {
      area: rollArea.toFixed(2),
      importCost: totalImportCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      repassePrice: totalRepassePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      spread: totalSpreadHolding.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      ads: trafficReinvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      net: netProfitToPool.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    };
  };

  const calcRes = getCalculatedSpread();

  // Scenario prediction constants for Document 10 Tab
  const scenarioDetails = {
    A: { title: 'Cenário A: Operação Base', valor: 'R$ 50.000,00', dest: 'Financiamento de rolos iniciais Select™ e ativação de anúncios em até 25 subdomínios de praças polo.', payback: '14 a 16 meses', retorno: '24% ao ano (Repasses líquidos trimestrais)' },
    B: { title: 'Cenário B: Escala Moderada', valor: 'R$ 100.000,00', dest: 'Importação direta de contêiner fracionado, produção de merchandising e tráfego focado em 50 praças.', payback: '11 a 13 meses', retorno: '30% ao ano (Impulsionado por vendas BlackShop™)' },
    C: { title: 'Cenário C: Aceleração Máxima', valor: 'R$ 250.000,00', dest: 'Importação institucional massiva, estoque regulador nacional de PPF e barreira agressiva de SEO macro.', payback: '8 a 10 meses', retorno: '36% ao ano (Máxima eficiência aduaneira)' }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2 md:p-6 text-white font-sans">
      
      {/* 1. Header Hero - Corporate Branding */}
      <div className="relative bg-[#080808] border border-[#444746] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/5 to-transparent pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-zinc-900 border border-[#444746] text-zinc-400 font-mono text-[9px] font-bold uppercase tracking-[0.2em] rounded-none">
              WINF OS™ // Matriz de Comando
            </span>
            <span className="w-2 h-2 rounded-none bg-white animate-pulse"></span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider flex items-center gap-3">
            <BookOpen className="text-zinc-300" size={24} /> Arsenal Tático WINF Partners
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl font-light">
            Repositório soberano de inteligência corporativa, contratos, tabelas financeiras, diretrizes de mídia e infraestrutura da holding. Sincronização automatizada com o N.O. (Núcleo Operacional) (Núcleo Operacional).
          </p>
        </div>
        
        {/* Core Quick Stats */}
        <div className="flex items-center gap-6 bg-[#131314]/60 p-4 border border-[#444746] relative z-10">
          <div className="text-center px-4 border-r border-[#444746]">
            <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Manuais</span>
            <span className="text-lg font-black text-white font-mono">14 Cadernos</span>
          </div>
          <div className="text-center px-4 border-r border-[#444746]">
            <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Sincronia</span>
            <span className="text-lg font-black text-zinc-300 font-mono">Ativa</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Região</span>
            <span className="text-lg font-black text-cyan-400 font-mono">Territoriais</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Document Reader & Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR: Manual Selector Index */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
            <div className="border-b border-[#444746] pb-2.5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold font-bold flex items-center gap-2">
                <Search size={13} /> Localizar Documento
              </h3>
            </div>

            {/* Document search input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Pesquisar manuais..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="w-full bg-[#131314]/60 border border-[#444746] pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 rounded-none transition-colors"
              />
              <span className="absolute left-2.5 top-2.5 text-zinc-500">
                <Filter size={11} />
              </span>
            </div>

            {/* Category selection */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {["ALL", "Contratos & Compliance", "Desenvolvimento de Campo", "Financeiro & Custos", "Marketing & Midia", "Equity & Dividendos"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider rounded-none whitespace-nowrap transition-all border ${
                    categoryFilter === cat 
                      ? 'bg-white/10 text-zinc-300 font-bold border-[#444746] font-bold' 
                      : 'bg-zinc-900/40 text-zinc-400 border-[#444746] hover:text-white'
                  }`}
                >
                  {cat === "ALL" ? "TODOS" : cat.split(" & ")[0]}
                </button>
              ))}
            </div>

            {/* Scrollable list of 14 manuals */}
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
              {filteredDocs.map((docItem) => {
                const isActive = selectedDocId === docItem.id;
                return (
                  <button
                    key={docItem.id}
                    onClick={() => setSelectedDocId(docItem.id)}
                    className={`w-full text-left p-3 border rounded-none transition-all flex items-start gap-3 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-white/5 border-[#444746] border-l-2 border-l-[#FFFFFF]' 
                        : 'bg-[#131314]/40 border-[#444746] hover:border-[#444746] hover:bg-zinc-900/30'
                    }`}
                  >
                    <div className={`p-1 px-1.5 font-mono text-[9px] rounded-none font-bold ${isActive ? 'bg-white/10 text-zinc-300 font-bold' : 'bg-zinc-850 text-zinc-500 group-hover:text-white'}`}>
                      {docItem.num}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`block text-[8px] font-mono uppercase tracking-widest ${isActive ? 'text-zinc-300 font-bold' : 'text-zinc-500'}`}>
                          {docItem.category}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-none bg-white" />}
                      </div>
                      <h4 className={`text-xs font-bold leading-snug truncate ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {docItem.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 line-clamp-1 leading-normal font-light">
                        {docItem.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidenote: Blockchain guarantee */}
          <div className="bg-[#131314] border border-[#444746] p-5 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold font-bold flex items-center gap-1.5">
              <Landmark size={12} fill="currentColor" className="text-zinc-300 font-bold" /> Compliance Auditoria Ativa
            </h4>
            <div className="text-[11px] text-zinc-400 leading-relaxed font-light space-y-2">
              <p>
                Este Arsenal Tático constitui a propriedade intelectual reversa da marca <strong className="text-white">WINF Partners™</strong>.
              </p>
              <p>
                A quebra de regras de exclusividade de bobinas desativa remotamente toda a órbita digital da central regional em até 3 segundos.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN VIEWER: Detailed Document Display */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#131314] border border-[#444746] p-6 md:p-8 space-y-6 relative">
            
            {/* Upper floating reference */}
            <div className="absolute top-6 right-6 font-mono text-[9px] text-zinc-300 font-bold bg-zinc-900 border border-[#444746] px-2 py-0.5 uppercase tracking-widest rounded-none">
              Doc {activeDoc.num} // Matriz
            </div>

            {/* Doc Title block */}
            <div className="border-b border-[#444746] pb-4 space-y-1.5 max-w-[85%]">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
                {activeDoc.category}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                Documento {activeDoc.num}: {activeDoc.title}
              </h2>
              <p className="text-xs text-white/60 font-mono italic">
                {activeDoc.subtitle}
              </p>
            </div>

            {/* Interactive Section 1: Pricing Calculations inside Document 08 */}
            {activeDoc.id === "doc-08" && (
              <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold flex items-center gap-1.5">
                  <Table size={13} /> Tabela de Repasse e Custos Oficiais (Bobinas Padrão 1,52m x 30m)
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#444746] font-mono text-zinc-500 text-[9px] uppercase tracking-wider">
                        <th className="py-2.5">Linha / Série</th>
                        <th className="py-2.5 text-right">Importação (FOB/m²)</th>
                        <th className="py-2.5 text-right">Spread Holding (m²)</th>
                        <th className="py-2.5 text-right text-white">Preço Autorizado</th>
                        <th className="py-2.5 text-right text-zinc-300">Margem Líquida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#444746]">
                      <tr>
                        <td className="py-3 font-bold">Série BlackPro <span className="block text-[10px] text-zinc-500 font-light font-sans mt-0.5">Privacidade automotiva premium.</span></td>
                        <td className="py-3 text-right font-mono">R$ 12,50</td>
                        <td className="py-3 text-right font-mono">R$ 22,50</td>
                        <td className="py-3 text-right font-mono text-white">R$ 35,00</td>
                        <td className="py-3 text-right font-mono text-zinc-300 font-bold">64%</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold">Série Dual Reflect <span className="block text-[10px] text-zinc-500 font-light font-sans mt-0.5">Arquitetura e controle térmico.</span></td>
                        <td className="py-3 text-right font-mono">R$ 18,00</td>
                        <td className="py-3 text-right font-mono">R$ 27,00</td>
                        <td className="py-3 text-right font-mono text-white">R$ 45,00</td>
                        <td className="py-3 text-right font-mono text-zinc-300 font-bold">60%</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold">Série Invisible <span className="block text-[10px] text-zinc-500 font-light font-sans mt-0.5">Escudo térmico nanocerâmico.</span></td>
                        <td className="py-3 text-right font-mono">R$ 25,00</td>
                        <td className="py-3 text-right font-mono">R$ 40,00</td>
                        <td className="py-3 text-right font-mono text-white">R$ 65,00</td>
                        <td className="py-3 text-right font-mono text-zinc-300 font-bold">61%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Interactive calculator */}
                <div className="bg-[#131314] border border-[#444746] p-4 rounded-none space-y-4">
                  <div className="border-b border-[#444746] pb-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide font-bold">Simulador de Giro Comercial WINFOS</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight mt-0.5">Previsão de Margem e Divisão de Ads</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Selecionar Linha</label>
                      <select 
                        value={calcFilmSeries}
                        onChange={(e) => setCalcFilmSeries(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-[#444746] text-xs text-white p-2 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="blackpro">Série BlackPro (Repasse: R$ 35/m²)</option>
                        <option value="dualreflect">Série Dual Reflect (Repasse: R$ 45/m²)</option>
                        <option value="invisible">Série Invisible (Repasse: R$ 65/m²)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Quantidade de Metros Lineares</label>
                      <input 
                        type="number" 
                        min="1"
                        max="1000"
                        value={calcMeters}
                        onChange={(e) => setCalcMeters(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-900 border border-[#444746] text-xs text-white p-1.5 focus:outline-none focus:border-white/30"
                      />
                      <span className="block text-[8px] text-zinc-500 mt-0.5">Largura padrão de bobina: 1,52m . Representando {calcMeters * 1.52}m²</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-[#444746] bg-zinc-900/10 p-2.5">
                    <div className="text-center font-mono">
                      <span className="block text-[8px] text-zinc-500 uppercase">Área Total</span>
                      <span className="text-xs font-bold text-white">{calcRes.area} m²</span>
                    </div>
                    <div className="text-center font-mono">
                      <span className="block text-[8px] text-zinc-500 uppercase">Custo FOB</span>
                      <span className="text-xs font-bold text-red-400">R$ {calcRes.importCost}</span>
                    </div>
                    <div className="text-center font-mono">
                      <span className="block text-[8px] text-zinc-500 uppercase">Valor Repasse</span>
                      <span className="text-xs font-bold text-white">R$ {calcRes.repassePrice}</span>
                    </div>
                    <div className="text-center font-mono border-l border-[#444746] pl-2">
                      <span className="block text-[8px] text-zinc-500 uppercase text-zinc-300">10% Ads local</span>
                      <span className="text-xs font-bold text-zinc-300">R$ {calcRes.ads}</span>
                    </div>
                    <div className="text-center font-mono">
                      <span className="block text-[8px] text-zinc-500 uppercase text-cyan-400">Lucro Net Pool</span>
                      <span className="text-xs font-bold text-cyan-400">R$ {calcRes.net}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Section 2: Scenario comparison block inside Document 10 */}
            {activeDoc.id === "doc-10" && (
              <div className="bg-[#131314] border border-[#444746] p-5 space-y-4">
                <div className="pb-1 border-b border-[#444746]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold font-bold flex items-center gap-1.5">
                    <Landmark size={13} fill="currentColor" /> Simulação de Projeção Preditiva de Co-Investimento
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-light mt-0.5">Explore as três frentes de captação e escala de tráfego do pool.</p>
                </div>
                
                {/* Clickable cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.keys(scenarioDetails).map((key) => {
                    const scene = scenarioDetails[key as 'A' | 'B' | 'C'];
                    const isSelected = selectedAporteCenario === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedAporteCenario(key as any)}
                        className={`text-left p-3 border transition-all ${
                          isSelected 
                            ? 'bg-white/5 border-[#444746]' 
                            : 'bg-[#131314]/60 border-[#444746] hover:border-[#444746]'
                        }`}
                      >
                        <span className="block text-[8px] font-mono text-zinc-400 uppercase">Cenário {key}</span>
                        <h4 className="text-xs font-black text-white mt-0.5">{scene.valor}</h4>
                        <span className="block text-[10px] text-zinc-300 font-bold font-mono font-bold mt-1.5">{scene.retorno.split(" (")[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected scenario detail display */}
                <div className="bg-zinc-900/40 p-4 border border-[#444746] space-y-2.5">
                  <div className="flex justify-between items-center bg-[#131314]/50 p-2 font-mono text-xs">
                    <span className="text-zinc-300 font-bold font-bold">{scenarioDetails[selectedAporteCenario].title}</span>
                    <span className="text-zinc-500">Payback Estimado: <strong className="text-white">{scenarioDetails[selectedAporteCenario].payback}</strong></span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    <strong className="text-white">Alocação de Recurso:</strong> {scenarioDetails[selectedAporteCenario].dest}
                  </p>
                  <p className="text-xs text-zinc-400 italic">
                    <strong className="text-zinc-300 font-bold">Retorno Anual Esperado:</strong> {scenarioDetails[selectedAporteCenario].retorno}
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Section 3: Checkbox / Onboarding Checklist tracker inside Document 14 */}
            {activeDoc.id === "doc-14" && (
              <div className="bg-[#131314] border border-[#444746] p-5 space-y-5">
                
                {/* Header with progress tracker */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#444746] pb-3">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold flex items-center gap-1.5">
                      <ClipboardCheck size={13} /> Checklist Geral de Implantação e Auditoria Ativa (Pós-Ativação)
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">Marque os ativos auditados fisicamente na unidade para liberar chaves de API.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-mono">Progresso:</span>
                    <span className="text-xs font-black text-zinc-300 font-bold font-mono">{getChecklistProgress()}%</span>
                  </div>
                </div>

                {/* Checklist Categories scroll */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* Category A */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Bloco A: Infraestrutura do Quiosque de Prospecção</span>
                    <div className="space-y-1.5">
                      {[
                        { id: 'a-1', text: 'Homologar a estrutura metálica do totem, conferindo a chapa de aço e a pintura preta fosca.' },
                        { id: 'a-2', text: 'Instalar o monitor touch capacitivo de 43 polegadas e travar o sistema em "Kiosk Mode".' },
                        { id: 'a-3', text: 'Testar carregamento nativo do WINF OS™ e barramento de segurança contra acessos externos.' },
                        { id: 'a-4', text: 'Ativar o chip de dados corporativo, sincronizar WhatsApp Business e validar o robô W-NO (Núcleo Operacional).' }
                      ].map((item) => (
                        <label 
                          key={item.id}
                          className="flex items-start gap-2.5 p-2 bg-[#131314]/45 hover:bg-[#131314]/80 border border-[#444746] rounded-none transition-all cursor-pointer"
                        >
                          <input 
                            type="checkbox" 
                            checked={checkedItems[item.id] || false} 
                            onChange={() => handleToggleCheck(item.id)}
                            className="mt-0.5 rounded-none accent-emerald-500 border-[#444746]"
                          />
                          <span className={`text-xs ${checkedItems[item.id] ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category B */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Bloco B: Maquinário Industrial & Estúdio Matriz</span>
                    <div className="space-y-1.5">
                      {[
                        { id: 'b-1', text: 'Montar a Mesa de Corte Industrial, verificando nivelamento do vidro e Backlight de LED ativo.' },
                        { id: 'b-2', text: 'Fixar a Plotter de Recorte de grande porte (1,60m útil) e realizar teste de tração de película.' },
                        { id: 'b-3', text: 'Instalar o Totem Corporativo Espelho na recepção executiva do Studio para simulações cênicas.' }
                      ].map((item) => (
                        <label 
                          key={item.id}
                          className="flex items-start gap-2.5 p-2 bg-[#131314]/45 hover:bg-[#131314]/80 border border-[#444746] rounded-none transition-all cursor-pointer"
                        >
                          <input 
                            type="checkbox" 
                            checked={checkedItems[item.id] || false} 
                            onChange={() => handleToggleCheck(item.id)}
                            className="mt-0.5 rounded-none accent-white border-[#444746]"
                          />
                          <span className={`text-xs ${checkedItems[item.id] ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category B */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Bloco C: Estrutura Pedagógica WINF Academy</span>
                    <div className="space-y-1.5">
                      {[
                        { id: 'c-1', text: 'Instalar os braços mecânicos articulados das claraboias horizontais ergonômicas de solo no CT.' },
                        { id: 'c-2', text: 'Ativar o barramento de relatórios automáticos no painel criptografado do investidor.' }
                      ].map((item) => (
                        <label 
                          key={item.id}
                          className="flex items-start gap-2.5 p-2 bg-[#131314]/45 hover:bg-[#131314]/80 border border-[#444746] rounded-none transition-all cursor-pointer"
                        >
                          <input 
                            type="checkbox" 
                            checked={checkedItems[item.id] || false} 
                            onChange={() => handleToggleCheck(item.id)}
                            className="mt-0.5 rounded-none accent-cyan-500 border-[#444746]"
                          />
                          <span className={`text-xs ${checkedItems[item.id] ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General display of Sections with Inter and monospace numbers */}
            <div className="space-y-6">
              {activeDoc.sections.map((sec, index) => (
                <div key={index} className="space-y-1.5 border-l border-zinc-900 pl-4 py-1.5 hover:border-[#444746] transition-all">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-300 font-bold font-bold">
                    <span>SEÇÃO {sec.ref}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    {sec.label}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light whitespace-pre-line bg-[#131314]/10 p-4 border border-white/[0.02] rounded-none">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI Oracle / Training integration block (W-NO Teach Platform retained) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Teach Form Column */}
        <div className="lg:col-span-4 space-y-4">
          <div id="teach-form-card" className="bg-[#131314] border border-[#444746] p-6 hover:border-emerald-500/20 transition-all shadow-2xl space-y-5">
            <div className="border-b border-[#444746] pb-3">
              <span className="p-1 px-2 bg-white/10 text-zinc-300 font-mono text-[8px] font-bold uppercase tracking-wider rounded-none">
                Cortex AI Terminal
              </span>
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-zinc-300 font-bold mt-2 flex items-center gap-2">
                <Brain size={14} className="text-zinc-300 font-bold animate-pulse" /> Treinar o W-NO (Núcleo Operacional)
              </h3>
              <p className="text-xs text-white/40 mt-1 font-light">
                Escreva instruções explícitas de negócios para alinhar as decisões do robô nas orações do WhatsApp.
              </p>
            </div>

            <form onSubmit={handleTeachRay} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Categoria da Regra</label>
                <input 
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Ex: Tabela de Descontos, Produtos, Regiões"
                  className="w-full bg-[#131314]/60 border border-[#444746] p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 rounded-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Diretriz da Regra</label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Escreva a instrução clara. Ex: Aplicar desconto exclusivo de 10% no PIX se a instalação residir em condomínios fechados em Santos."
                  rows={4}
                  className="w-full bg-[#131314]/60 border border-[#444746] p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 rounded-none transition-colors resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold font-mono">Confiança de Peso</label>
                  <span className="text-xs font-mono text-zinc-300 font-bold font-bold">{newConfidence}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={newConfidence} 
                  onChange={(e) => setNewConfidence(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-1 rounded-none outline-none appearance-none cursor-pointer"
                />
              </div>

              <button 
                type="submit"
                disabled={isTeaching}
                className="w-full bg-white hover:bg-emerald-400 text-black py-3 px-4 font-mono text-xs uppercase font-black tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-transform disabled:opacity-50"
              >
                {isTeaching && <RefreshCw className="animate-spin" size={12} />}
                {isTeaching ? 'SINCROZINANDO...' : <><Save size={13} /> Sincronizar Cérebro AI</>}
              </button>
            </form>

            <AnimatePresence>
              {isSuccessAction && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/15 border border-emerald-500/20 p-4 font-mono text-[10px] space-y-2 text-emerald-300 rounded-none"
                >
                  <p className="flex items-center gap-1.5 font-black text-zinc-300 font-bold">
                    <CheckCircle2 size={12} /> DIRETRIZ NEURAL EM COMPILAÇÃO!
                  </p>
                  <p className="font-light leading-relaxed text-zinc-300">
                    O Córtex central processou a regra do Arsenal. O robô em tempo de simulação já começará a se guiar por este aprendizado.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Display Auditable Memories Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#131314] border border-[#444746] p-6 shadow-2xl space-y-5">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#444746] pb-3">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-white font-bold flex items-center gap-1.5">
                  <Terminal size={14} /> Auditória de Cérebro do W-NO
                </h3>
                <p className="text-xs text-zinc-500 mt-1 font-light">Veja memórias aprovadas e aprendizados decodificados de simulações.</p>
              </div>

              <button 
                onClick={fetchKnowledge}
                className="self-start sm:self-auto p-1.5 px-3 bg-white/5 hover:bg-white/10 border border-[#444746] text-white transition-colors flex items-center gap-2 text-xs font-mono rounded-none cursor-pointer"
              >
                <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> ATUALIZAR
              </button>
            </div>

            {/* Filter tools */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#131314]/40 p-3 border border-[#444746]">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Buscar memórias..."
                  value={oracleSearchQuery}
                  onChange={(e) => setOracleSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-[#444746] pl-8 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute left-2.5 top-2.5 text-zinc-500">
                  <Filter size={10} />
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase whitespace-nowrap">Origem:</span>
                <select 
                  value={filterSource} 
                  onChange={(e) => setFilterSource(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-[#444746] text-xs text-white p-1 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Todas Origens</option>
                  <option value="MANUAL">Manuais (Ensinadas)</option>
                  <option value="AUTO_CONVERSATION">Conversacionais (Aprendeu)</option>
                  <option value="SYSTEM">Sistema WINF</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase whitespace-nowrap">Status:</span>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-[#444746] text-xs text-white p-1 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Todos Status</option>
                  <option value="APPROVED">Ativos (Aprovadas)</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="REJECTED">Rejeitadas</option>
                </select>
              </div>
            </div>

            {/* Status alerts */}
            {rayFeedback && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 border-l-2 border-white/30 p-3 text-xs text-zinc-300 font-mono flex items-center gap-2"
              >
                <Terminal size={12} />
                <span>{rayFeedback}</span>
              </motion.div>
            )}

            {/* List entries */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="text-zinc-300 font-bold animate-spin" size={20} />
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Varrendo Córtex Neural de memórias...</span>
              </div>
            ) : filteredKnowledge.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#444746] bg-[#131314]/20 space-y-1 rounded-none">
                <AlertCircle className="mx-auto text-white/20" size={28} />
                <p className="text-xs text-zinc-500 font-mono">Nenhum aprendizado pendente encontrado.</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence>
                  {filteredKnowledge.map((item) => {
                    const isEditing = editingId === item.id;
                    return (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`border p-4 transition-all ${
                          item.status === 'PENDING' 
                            ? 'bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/20' 
                            : item.status === 'REJECTED'
                            ? 'bg-zinc-900/40 opacity-55 border-red-500/15'
                            : 'bg-[#131314]/55 hover:bg-zinc-950 border-[#444746] hover:border-white/30/10'
                        }`}
                      >
                        {/* Upper row header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 border-b border-white/[0.04] pb-2 font-mono text-[9px]">
                          <div className="flex items-center gap-2">
                            {item.source === 'MANUAL' ? (
                              <span className="px-1.5 py-0.5 bg-sky-500/10 border border-sky-500/25 text-sky-400 font-bold uppercase tracking-wider rounded-none">
                                Manual (Ensinado)
                              </span>
                            ) : item.source === 'SYSTEM' ? (
                              <span className="px-1.5 py-0.5 bg-white/10 border border-emerald-500/25 text-zinc-300 font-bold uppercase tracking-wider rounded-none">
                                Sistema WINF
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-yellow-500/15 border border-yellow-500/35 text-yellow-500 font-bold uppercase tracking-wider rounded-none flex items-center gap-1 animate-pulse">
                                <Cpu size={9} /> Analítico Conversa
                              </span>
                            )}

                            {/* Status badge */}
                            {item.status === 'APPROVED' && (
                              <span className="text-zinc-300 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> ATIVO</span>
                            )}
                            {item.status === 'PENDING' && (
                              <span className="text-yellow-400 font-bold flex items-center gap-1 animate-pulse"><AlertCircle size={10} /> AUDITAR</span>
                            )}
                            {item.status === 'REJECTED' && (
                              <span className="text-red-500 flex items-center gap-1"><X size={10} /> DESATIVADO</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 scale-90">Confiança:</span>
                            <div className="w-12 bg-zinc-800 h-1 overflow-hidden relative">
                              <div 
                                className={`h-full ${item.status === 'REJECTED' ? 'bg-zinc-650' : item.confidence < 80 ? 'bg-yellow-500' : 'bg-emerald-400'}`}
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-zinc-300 font-bold font-bold">{item.confidence}%</span>
                          </div>
                        </div>

                        {/* Inline editor */}
                        {isEditing ? (
                          <div className="space-y-3 p-3 bg-[#131314]/60 border border-emerald-500/30">
                            <div>
                              <input 
                                type="text"
                                value={editTopic}
                                onChange={(e) => setEditTopic(e.target.value)}
                                className="w-full bg-zinc-900 border border-[#444746] p-2 text-xs text-white uppercase font-mono font-bold"
                              />
                            </div>
                            <div>
                              <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={3}
                                className="w-full bg-zinc-900 border border-[#444746] p-2 text-xs text-white font-sans"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button onClick={() => setEditingId(null)} className="px-2.5 py-1 text-[9px] font-mono text-zinc-400 hover:text-white uppercase">Cancelar</button>
                              <button onClick={() => handleSaveEdit(item.id)} className="px-2.5 py-1 text-[9px] font-mono bg-white text-black font-black uppercase">Salvar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold font-mono text-white/80 uppercase">
                              Tópico: {item.topic}
                            </h4>
                            <p className="text-xs text-zinc-350 leading-relaxed font-light pl-2 border-l border-[#444746] bg-zinc-900/10 p-2">
                              {item.content}
                            </p>

                            {/* Triggers conversation snippets if any */}
                            {item.conversation_snippet && (
                              <div className="bg-yellow-500/5 p-2 border border-yellow-500/10 text-[10px] text-zinc-400 font-mono italic">
                                <span className="text-yellow-500 font-bold">Snippet: </span>{item.conversation_snippet}
                              </div>
                            )}

                            {/* Row controls */}
                            <div className="flex justify-between items-center pt-2 border-t border-white/[0.02]">
                              <span className="text-[9px] font-mono text-zinc-500">
                                Emitido: {new Date(item.created_at || Date.now()).toLocaleDateString()}
                              </span>

                              <div className="flex items-center gap-2">
                                {item.status === 'PENDING' && (
                                  <>
                                    <button onClick={() => handleUpdateStatus(item.id, 'APPROVED')} className="px-2 py-0.5 bg-white hover:bg-emerald-400 text-black font-mono text-[9px] font-bold uppercase">Aprovar</button>
                                    <button onClick={() => handleUpdateStatus(item.id, 'REJECTED')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[9px] uppercase">Rejeitar</button>
                                  </>
                                )}

                                {item.status === 'APPROVED' && item.source !== 'SYSTEM' && (
                                  <button onClick={() => handleUpdateStatus(item.id, 'REJECTED')} className="text-[9px] text-zinc-500 hover:text-red-400 font-mono uppercase">Desativar</button>
                                )}

                                {item.status === 'REJECTED' && (
                                  <button onClick={() => handleUpdateStatus(item.id, 'APPROVED')} className="text-[9px] text-zinc-300 font-mono uppercase font-bold">Ativar</button>
                                )}

                                {item.source !== 'SYSTEM' && (
                                  <div className="flex items-center gap-1 border-l border-[#444746] pl-2 ml-1">
                                    <button 
                                      onClick={() => {
                                        setEditingId(item.id);
                                        setEditTopic(item.topic);
                                        setEditContent(item.content);
                                      }}
                                      className="p-1 text-zinc-500 hover:text-white"
                                    >
                                      <Edit2 size={10} />
                                    </button>
                                    <button onClick={() => handleDeleteKnowledge(item.id)} className="p-1 text-zinc-500 hover:text-red-400">
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleWnoKnowledge;
