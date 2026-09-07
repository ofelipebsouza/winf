export interface Article {
  slug: string;
  title: string;
  tag: string;
  date: string;
  readTime: string;
  excerpt: string;
  cover: string;
  content: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'rejeicao-infravermelha',
    title: 'Rejeição infravermelha: a engenharia do conforto térmico',
    tag: 'TÉRMICA',
    date: 'SET 2026',
    readTime: '4 MIN',
    excerpt:
      'Como as películas de controle solar seletivo barram o calor antes de ele atravessar o vidro — sem transformar a arquitetura em uma caixa escura.',
    cover: '/images/dualreflect-poster-1.webp',
    content: [
      'Todo calor que invade um ambiente nasce, em grande parte, da radiação infravermelha. Ela atravessa o vidro comum quase sem resistência, transforma-se em energia térmica ao tocar superfícies internas e fica presa dentro do ambiente — o efeito estufa que obriga o ar-condicionado a trabalhar em regime permanente.',
      'As películas de controle solar atacam exatamente esse ponto. Camadas nanométricas de partículas cerâmicas e metálicas, depositadas sobre o filme, refletem seletivamente a radiação de onda longa antes que ela atravesse o vidro. O resultado é medido em TSER — Total Solar Energy Rejection — e nos sistemas de alta performance supera 80%.',
      'O segredo está na seletividade. Um bom filme não bloqueia tudo: ele separa o infravermelho — que é calor — da luz visível — que é arquitetura. O índice que traduz essa separação é o LSG (Light-to-Solar-Gain), e quanto maior, mais claro e mais fresco o ambiente permanece ao mesmo tempo.',
      'Na prática, isso significa fachadas envidraçadas que mantêm a leitura de transparência projetada pelo arquiteto, redução imediata da carga térmica e conforto estável junto ao vidro — aquele perímetro antes impossível de ocupar em dias de sol pleno.',
      'O retorno também é financeiro: menor consumo de climatização, menor dimensionamento de equipamentos e menor desgaste dos sistemas ao longo do ano. O vidro permanece. O ambiente muda.',
    ],
  },
  {
    slug: 'blindagem-transparente',
    title: 'Blindagem transparente: como funciona uma película de segurança',
    tag: 'SEGURANÇA',
    date: 'SET 2026',
    readTime: '5 MIN',
    excerpt:
      'Vidro temperado estilhaça. Vidro laminado cede. Com a película certa, o conjunto retém estilhaços e resiste a impacto — sem mudar um milímetro da fachada.',
    cover: '/images/securityblind/scene-07.webp',
    content: [
      'O vidro é o material mais vulnerável de qualquer edificação. Um único impacto — acidental ou intencional — converte um painel em milhares de fragmentos projetados a alta velocidade. A película de segurança existe para reescrever esse cenário.',
      'A tecnologia é uma lámina de PET de alta tenacidade, em múltiplas camadas, com adesivo sensível à pressão. Aplicada sobre o vidro existente, ela não impede a fratura — impede a desintegração. Quando o vidro quebra, os fragmentos ficam retidos no filme, formando a clássica teia de aranha que permanece no quadro.',
      'Esse comportamento transforma cenários: arrombamentos perdem minutos preciosos — o tempo de que um sistema de alarme necessita; acidentes com vidro deixam de gerar estilhaços cortantes; explosões e vendavais reduzem drasticamente a projeção de fragmentos internos.',
      'A performance é graduada por classe: filmes de 4 a 8 milésimos para retenção de estilhaços e anti-vandalismo; composições multilaminadas, associadas a silicone estrutural, para níveis de blindagem e resistência a impacto continuado.',
      'Tudo isso aplicado sobre o vidro que já existe — sem troca de esquadria, sem obra, sem alteração da linguagem original do projeto. Segurança que a arquitetura não percebe. E que quem tenta atravessá-la percebe muito bem.',
    ],
  },
  {
    slug: 'privacidade-arquitetonica',
    title: 'Privacidade sem abrir mão da luz: a arquitetura do vidro escuro',
    tag: 'PRIVACIDADE',
    date: 'AGO 2026',
    readTime: '4 MIN',
    excerpt:
      'Refletiva por fora, serena por dentro: como os filmes de escurecimento resolvem a equação impossível entre abertura para a paisagem e discrição total.',
    cover: '/images/blackpro-poster-1.webp',
    content: [
      'Toda fachada envidraçada carrega uma contradição: quem vê a paisagem também é visto. Em projetos residenciais e corporativos, a resposta comum foi travar a vista com cortinas e persianas — abrindo mão exatamente daquilo que o vidro prometia.',
      'Os filmes de privacidade arquitetônica resolvem a equação de outra forma. Trabalhando com camadas refletivas densas, eles invertem o comportamento do vidro conforme a luz: durante o dia, a face externa espelha o ambiente urbano, enquanto de dentro o ambiente permanece legível em direção à paisagem.',
      'À noite, o protocolo se complementa: iluminação cenográfica posicionada junto ao vidro mantém o efeito espelhado, enquanto a iluminação interna permanece indireta. O resultado é um ambiente que permanece aberto, iluminado e completamente discreto do lado de fora.',
      'Além da discrição, os mesmos camados entregam controle solar expressivo — rejeição térmica alta e bloqueio de UV — reduzindo o ganho de calor e protegendo interiores da radiação direta.',
      'Privacidade deixa de ser sinônimo de caixa fechada. É mais uma camada de engenharia invisível aplicada ao vidro — que preserva a luz, a vista e a linguagem do projeto.',
    ],
  },
  {
    slug: 'ceramica-nanometrica',
    title: 'Cerâmica nanométrica: proteção UV sem nenhum filtro visível',
    tag: 'NANO CERÂMICA',
    date: 'AGO 2026',
    readTime: '3 MIN',
    excerpt:
      'Filmes com partículas cerâmicas bloqueiam 99,9% da radiação ultravioleta com tonalidade quase nula — a proteção que o olho não percebe.',
    cover: '/images/invisible-poster-1.webp',
    content: [
      'A radiação ultravioleta é o agente silencioso do envelhecimento: desbota têxteis, resina madeira, degrada couro e afeta a pele em exposições prolongadas. Atravessa nuvens, atravessa vidro comum e opera o ano inteiro, independentemente da temperatura.',
      'A resposta mais avançada vem da nanotecnologia cerâmica. Partículas de óxidos — como o óxido de estanho dopado — distribuídas em escala nanométrica dentro do filme bloqueiam praticamente toda a faixa UVA e UVB, ao mesmo tempo em que permanecem invisíveis ao olho humano.',
      'A diferença para os filmes coloridos tradicionais é radical: onde antes havia tonalidade densa e alteração cromática, agora há Clareza óptica quase total. O vidro continua vidro. A proteção, porém, é total.',
      'Com 99,9% de bloqueio UV e rejeição infravermelha elevada, esses filmes se tornaram o padrão para ambientes que exigem preservação de interiores — galerias, showrooms, acervos, residências com mobiliário assinado — sem comprometer a projeto luminotécnico.',
      'É a materialização de um princípio que guia todo o ecossistema WINF: a melhor tecnologia é a que a arquitetura não percebe.',
    ],
  },
  {
    slug: 'persianas-no-vidro',
    title: 'Persianas dentro do vidro: a estética do Miniblind & Venetian',
    tag: 'DECORATIVA',
    date: 'JUL 2026',
    readTime: '3 MIN',
    excerpt:
      'Listras jateadas e transparentes que desenham persianas horizontais diretamente no vidro — privacidade suave, sem peças, sem manutenção.',
    cover: '/images/miniblind-venetian/scene-03.webp',
    content: [
      'A película Miniblind & Venetian reproduz no vidro o desenho da persiana horizontal clássica: faixas opacas, jateadas, alternadas com faixas transparentes de definição milimétrica. O efeito é gráfico, limpo e permanente — uma persiana que ninguém precisa puxar.',
      'A proposta resolve três problemas de uma vez. Privacidade: as faixas jateadas difundem a visão e a luz. Estética: o padrão linear organiza fachadas e divisórias com ritmo arquitetônico. Praticidade: zero peças móveis, zero poeira, zero manutenção.',
      'As variantes de traço — listras de 1,0 cm e 0,5 cm — permitem calibrar a leitura do padrão: mais contemporâneo e denso ou mais clássico e espaçado. Em vidros temperados e laminados, o filme acompanha qualquer altura de peitoril ou divisória.',
      'O controle de luz é moderado e suave: a radiação direta é difundida pelas faixas opacas, eliminando ofuscamento sem transformar o ambiente em caverna. UV bloqueado, privacidade garantida e a luz visível conduzida com elegância.',
      'É a solução ideal para divisórias corporativas, salas de reunião, fachadas comerciais e ambientes que pedem discrição com assinatura de design.',
    ],
  },
  {
    slug: 'ppf-armadura-invisivel',
    title: 'PPF: a armadura invisível para superfícies premium',
    tag: 'PROTEÇÃO',
    date: 'JUL 2026',
    readTime: '4 MIN',
    excerpt:
      ' Poliuretano autorregenerável que absorve pedras, areia e contato diário — a mesma lógica de proteção aplicada ao pintado e ao vidro.',
    cover: '/images/neoskin-hero.webp',
    content: [
      'Paint Protection Film nasceu num contexto exigente: proteger superfícies de alto valor contra o desgaste inevitável do uso. Uma lâmina de poliuretano alifático de alta elasticidade, aplicada sobre o pintado, absorve impactos de pedrisco, areia e contato cotidiano.',
      'A engenharia está na camada elástica autorregenerável: micro-riscos superficiais desaparecem com calor — solar ou térmico — porque o material retorna à sua forma original. A proteção não é estática; é viva.',
      'A mesma lógica se estende ao vidro e a outras superfícies do projeto: capôs e carrosseria no automotivo, superfícies de contato na arquitetura, mobiliário premium e pontos de desgaste crítico.',
      'Óptico por construção, o filme desaparece quando bem aplicado: sem alteração de cor, sem textura visível, sem que o olho perceba a camada. O que permanece é o acabamento original — preservado ano após ano.',
      'Para quem trata superfície como ativo, PPF não é custo: é seguro patrimonial. A armadura invisível do ecossistema WINF.',
    ],
  },
];

export const getArticle = (slug: string | null): Article | undefined =>
  slug ? ARTICLES.find((a) => a.slug === slug) : undefined;
