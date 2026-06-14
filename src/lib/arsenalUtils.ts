import { Asset } from '../types';

export const INITIAL_ARSENAL_DATA: Asset[] = [
  // --- NOVOS CRIATIVOS DE TESTE (PERFORMANCE) ---
  {
    id: 'c1',
    title: 'Criativo A/B: Termômetro vs Família',
    type: 'visual',
    category: 'Testes de Criativos',
    description: 'Criativo teste A (Dor Racional vs Dor Emocional). Lado a lado: O termômetro de calor vs família suando na varanda.',
    fileSize: '3.2 MB',
    thumbnail: 'https://images.unsplash.com/photo-1542315181-2292f7e0258d?q=80&w=600'
  },
  {
    id: 'c2',
    title: 'Criativo Story: Enquete "Você Sofre Com Isso?"',
    type: 'visual',
    category: 'Testes de Criativos',
    description: 'Imagem para Story com área dedicada para enquete do Instagram: "Seu ar-condicionado dá conta da sala à tarde?".',
    fileSize: '2.8 MB',
    thumbnail: 'https://images.unsplash.com/photo-1620626011761-996317b8d143?q=80&w=600'
  },
  {
    id: 'c3',
    title: 'Criativo Anúncio: Carrossel Antes/Depois (Arquitetura)',
    type: 'visual',
    category: 'Testes de Criativos',
    description: 'Carrossel prático focando no antes (luz estourada, calor) e depois (luz suave, conforto, privacidade) em 3 slides.',
    fileSize: '6.1 MB',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600'
  },
  {
    id: 'c4',
    title: 'Vídeo Script: VSL Arquitetos 1 Min',
    type: 'script',
    category: 'Testes de Criativos',
    description: 'Script para uma mini-VSL a ser rodada em campanhas de YouTube Ads para B2B (arquitetos e parceiros).',
    copy: 'HOOK (0-5s): "Arquiteto, o seu projeto lindo não pode virar uma estufa inabitável de tarde."\n\nPROBLEMA (5-20s): "Muitos projetos incríveis sofrem com o feedback negativo dos clientes porque o envidraçamento acumulou calor e dobrou a conta de energia. E cortinas não resolvem o calor, só bloqueiam a vista."\n\nSOLUÇÃO (20-40s): "Conheça o WINF Select. Películas de altíssima rejeição térmica, totalmente transparentes. Elas dão suporte técnico ao seu design. 99% de bloqueio IR, zero de reflexo exagerado."\n\nCTA (40-60s): "Baixe nosso catálogo técnico exclusivo para arquitetos no botão abaixo e agregue valor real ao seu projeto."'
  },
  
  {
    id: 'c5',
    title: 'Ad Teste: Minimalismo vs Comparativo Tech',
    type: 'visual',
    category: 'Testes de Criativos',
    description: 'A/B de design: Versão A usa uma sacada extremamente clean e apenas o texto "WINF Select". Versão B mostra gráfico de rejeição térmica e selo de redução UV sobreposto na imagem.',
    fileSize: '5.2 MB',
    thumbnail: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=600'
  },
  {
    id: 'c6',
    title: 'Página Teste: Quiz de Conforto Térmico',
    type: 'link',
    category: 'Testes de Criativos',
    description: 'Página para tráfego (Facebook Ads) focada na gamificação. "Faça o teste e descubra qual modelo WINF melhor adapta-se à sua obra".',
    url: 'https://winf.com.br/quiz-conforto'
  },
  
  // --- KIT BRANDING & LOGOS ---
  {
    id: 'b1',
    title: 'Kit Logos WINF™ (Horizontal/Vertical)',
    type: 'visual',
    category: 'Branding',
    description: 'Pacote completo de logotipos em alta definição (PNG Transparente e Vetor) para uniformes, fachadas e materiais impressos.',
    fileSize: '12.5 MB',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600'
  },
  {
    id: 'b2',
    title: 'Manual de Identidade Visual v2.0',
    type: 'catalog',
    category: 'Branding',
    description: 'Guia de uso de cores, fontes e aplicações da marca WINF para garantir o padrão premium da franquia.',
    fileSize: '8.4 MB'
  },

  // --- ÁUDIOS DE TREINAMENTO E EXPLICAÇÃO ---
  {
    id: 'a1',
    title: 'Audio: Como Explicar a Linha Select™',
    type: 'audio',
    category: 'Treinamento',
    description: 'Explicação rápida de 40 segundos para enviar no WhatsApp para clientes que perguntam sobre estética residencial.',
    fileSize: '1.8 MB'
  },
  {
    id: 'a2',
    title: 'Audio: Lidando com Objeção de Preço',
    type: 'audio',
    category: 'Vendas',
    description: 'Roteiro de áudio focado em converter clientes que comparam o preço WINF com películas comuns de mercado.',
    fileSize: '2.5 MB'
  },

  // --- CATÁLOGOS ESPECIAIS & APOIO ---
  {
    id: 'cat-corp',
    title: 'Portfólio Corporativo: Projetos de Edifícios',
    type: 'catalog',
    category: 'Técnico',
    description: 'Catálogo focado em grandes fachadas, controle de ofuscamento e eficiência energética para empresas.',
    fileSize: '22.1 MB'
  },
  {
    id: 'capa-1',
    title: 'Capa Promocional: YouTube/LinkedIn',
    type: 'visual',
    category: 'Marketing',
    description: 'Banner otimizado para perfis profissionais com a estética dark-premium WINF.',
    fileSize: '4.2 MB',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600'
  },
  
  {
    id: 'c7',
    title: 'Copy Teste: Gancho Curioso vs Gancho Medo',
    type: 'script',
    category: 'Testes de Criativos',
    description: 'Teste de copy para Facebook Ads. Versão 1: "O segredo das coberturas frescas". Versão 2: "O sol está destruindo seu piso de madeira?".',
    copy: 'TESTE A (CURIOSIDADE):\nJá reparou como algumas casas parecem estar sempre frescas, mesmo sem o barulho do ar-condicionado o dia todo? O segredo não está na arquitetura, mas no vidro. Conheça a tecnologia de filtragem seletiva WINF.\n\nTESTE B (DOR/MEDO):\nQuanto custou o seu piso de madeira ou o tecido do seu sofá? O sol está "comendo" o valor da sua decoração todos os dias. Pare o desbotamento hoje com 100% de proteção UV.'
  },
  {
    id: 'c8',
    title: 'Roteiro Reel: Teste da Lâmpada de Calor',
    type: 'script',
    category: 'Reels',
    description: 'Demonstração visual em vídeo: colocar a mão atrás de um vidro comum com lâmpada infravermelha vs vidro com WINF.',
    copy: 'AÇÃO: [Coloca a mão atrás do vidro comum] "Sente o calor? A lâmpada infravermelha simula o sol da tarde."\n\nAÇÃO: [Troca pelo vidro com WINF Select] "Agora olha isso. A luz passa, mas o calor para. Sinta a diferença imediata. Isso é engenharia aplicada ao seu conforto."'
  },
  {
    id: 'c9',
    title: 'Script Zap: O Matador de Objeções (Preço)',
    type: 'script',
    category: 'Scripts',
    description: 'Texto para converter o cliente que achou o orçamento "caro". Foco no ROI e proteção de ativos.',
    copy: 'Entendo perfeitamente o seu ponto, [Nome]. O investimento em WINF Select é superior a uma película comum porque não é um custo, é uma proteção de ativos.\n\nSe você considerar que ela vai evitar o desbotamento de um piso que custou 5x mais e vai reduzir sua conta de energia em até 30% ao mês, a película se paga sozinha em menos de 18 meses. Além do conforto que não tem preço. Vamos garantir o seu ambiente protegido?'
  },
  
  // --- VISUAL & CATÁLOGOS ---
  { 
    id: '1', 
    title: 'The Art of Protection: Volume I', 
    type: 'catalog', 
    category: 'Lifestyle', 
    description: 'Catálogo de luxo focado em experiência do arquiteto e estética de projetos residenciais para envio a clientes de alto padrão.', 
    fileSize: '18.4 MB' 
  },
  { 
    id: 'v1',
    title: 'Fachada Residencial // WINF Select Elite 15',
    type: 'visual',
    category: 'Arquitetura',
    description: 'Foto em altíssima definição demonstrando o acabamento ultra-dark e uniforme da nossa película premium em vidros duplos.',
    fileSize: '4.5 MB',
    thumbnail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600'
  },
  
  // --- NOVO: M.A.W SOCIAL MEDIA COPYS (INSTAGRAM, FACEBOOK, WHATSAPP) ---
  {
    id: 'm1',
    title: 'Copy Insta/Face: Ar-Condicionado Não Dá Conta (Residencial)',
    type: 'script',
    category: 'Conversão',
    description: 'Texto focado na dor do calor interno da casa e economia na conta de luz. Ideal para Feed e Anúncios M.A.W.',
    copy: 'O ar-condicionado da sua sala está sempre no máximo, gastando mais energia e mesmo assim você ainda sente o ambiente quente e abafado?\n\n🔥 O problema não é o seu ar, é o vidro desprotegido.\n\nCom a tecnologia WINF Select™, criamos um escudo invisível na sua fachada que rejeita até 99% do calor infravermelho (IR). Seu ambiente fica fresco mais rápido, você economiza na conta de luz e ainda protege seus móveis contra 100% dos raios UV.\n\n✅ Visibilidade cristalina de dentro para fora\n✅ Privacidade total de fora para dentro\n✅ Preserva a estética original da fachada\n\n👉 Toque no link da bio ou chame no direct para transformar o conforto da sua casa hoje mesmo.'
  },
  {
    id: 'm2',
    title: 'Copy Insta/Face: Casa Nova, Móveis Salvos (Arquitetura)',
    type: 'script',
    category: 'Conversão',
    description: 'Texto para Arquitetura focado em desbotamento de móveis, pisos e conforto térmico da sala de estar.',
    copy: 'Sua sala de estar deveria ser o lugar mais agradável da casa, não uma estufa durante a tarde. 🥵\n\nA luz solar direta no seu ambiente gera duas coisas que destroem o seu conforto:\n1. Calor excessivo que faz o ar-condicionado dobrar a conta de luz.\n2. Raios UV que ressecam e desbotam sofás, tapetes e pisos de madeira prematuramente.\n\nA nossa linha WINF Select™ Series foi desenvolvida exatamente para arquitetura de alto padrão: bloqueamos o calor (+85%) e os raios UV (100%), permitindo que a luz natural entre, sem que a temperatura suba.\n\n📲 Solicite uma simulação técnica gratuita com nosso especialista no WhatsApp. (Link na bio)'
  },
  {
    id: 'm3',
    title: 'Copy WhatsApp: Quebra de Gelo (Lead Frio)',
    type: 'script',
    category: 'Scripts',
    description: 'Mensagem inicial para enviar a leads que chegaram via campanha e não responderam na primeira vez.',
    copy: 'Olá [Nome]! Vi que você buscou informações sobre as nossas películas térmicas de alta performance para controle solar.\n\nEu sei que no calor que tem feito, ficar na varanda ou na sala se tornou quase imposssível à tarde. Muitos dos nossos clientes relatam uma queda de até 8 graus na temperatura interna após a instalação da linha WINF Select.\n\nPosso te enviar duas fotos de como o visual da sacada fica incrível de fora (privacidade), enquanto quem está dentro mantém a visão perfeita e clara?'
  },
  {
    id: 'm4',
    title: 'Copy WhatsApp: Aquecimento (Lista de Transmissão/Status)',
    type: 'script',
    category: 'Scripts',
    description: 'Texto curto de impacto para colocar no Status ou Stories com uma foto do termômetro.',
    copy: 'A prova não mente: olha a diferença de calor que o vidro limpo (esquerda) deixa passar vs. a nossa tecnologia Arquitetônica WINF (direita). 🌡️❌\nNão sofra com o envidraçamento da sua sacada virando um forno. A diferença que uma verdadeira barreira térmica faz no seu bem-estar é imediata. Diga TCHAU para o mormaço dentro de casa. 🔥🚫 Responda com "QUERO" que te mostro as opções.'
  },
  
  // --- SCRIPTS DE VIDEO (REELS/TIKTOK) ---
  {
    id: 's1',
    title: 'Roteiro Reel: O Teste do Isqueiro (Termofit)',
    type: 'script',
    category: 'Reels',
    description: 'Roteiro dinâmico e visual de 30-45 seg para capturar atenção logo nos primeiros 3s.',
    copy: 'HOOK (0-3s): [Câmera próxima, isqueiro sendo aceso atrás do vidro] "Se a proteção do seu vidro não faz isso, você só escureceu a sala, não resolveu o calor."\n\nCONTEXTO (3-15s): [Mostrando o termômetro subindo rápido na película comum/vidro limpo] "Película tingida comum não bloqueia calor, ela absorve. Por isso a sua varanda ferve no sol."\n\nPROVA (15-25s): [Mostrando filme WINF Cerâmico; o termômetro não sobe] "A linha Arquitetônica WINF é literalmente um escudo térmico. Rejeita 99% dos raios IR. Você pode encostar no vidro e ele não queima."\n\nCTA (25-30s): "Pare de gastar fortunas com ar-condicionado. Clica no botão e faça um orçamento para a sua residência ou empresa."'
  },
  {
    id: 's2',
    title: 'Roteiro Reel: Beleza Sem Escuridão',
    type: 'script',
    category: 'Reels',
    description: 'Focado no cliente que não quer película super escura em casa, mas quer proteção extrema.',
    copy: 'HOOK (0-3s): "Quem disse que pra bloquear o calor, a película precisa transformar sua casa numa caverna?"\n\nCORPO (3-15s): [Filmando de dentro para fora um vidro de sacada claríssimo, depois mostrando um termômetro estático] "Com a engenharia WINF Select de alta transparência, você mantém 70% de luminosidade natural para o seu projeto, mas bloqueia o calor como se fosse uma parede de tijolos e corta 100% dos raios UV que desbotam o seu piso e sofá."\n\nCTA (15-20s): "Estética impecável, luz natural e a sala gelada. Quer saber como testar isso na prática? Leia a legenda."'
  },
  
  // --- LINKS & MATERIAIS TÉCNICOS ---
  { 
    id: '3', 
    title: 'Ficha Técnica: WINF Select Architectural', 
    type: 'tech', 
    category: 'Técnico', 
    description: 'Laudo de aferição científica de rejeição IR (99%), bloqueio UV (100%) e controle de ofuscamento para edifícios.', 
    fileSize: '1.2 MB' 
  },
  {
    id: 'l1',
    title: 'Landing Page de Alta Conversão (Móvel)',
    type: 'link',
    category: 'Tráfego',
    description: 'Link direto da página projetada para conversão mobile, perfeita para campanhas Facebook Ads voltadas para arquitetura e condomínios.',
    url: 'https://winf.com.br/lp/mobile-conversion'
  }
];

export const DAILY_PULSE = {
  date: "Hoje",
  title: "A Vantagem WINF Select",
  copy: "O calor constante não é opcional, a proteção da sua casa sim. 🛡️ A tecnologia WINF™ Architectura não apenas reduz a luminosidade exagerada, ela cria um verdadeiro escudo térmico com até 99% de rejeição do infravermelho. Conforto térmico absoluto, preservação dos móveis e a beleza da luz natural mantida. Esse é o padrão de excelência WINF™.",
  suggestion: "Postar no Status do WhatsApp entre 11:30 e 13:00 com localização do condomínio ou bairro nobre ativada. Além do status, utilize estas postagens para alimentar diariamente o instagram e o facebook."
};

export const getArsenalAssets = (): Asset[] => {
    const stored = localStorage.getItem('winf_arsenal_assets_v5');
    if (!stored) {
        localStorage.setItem('winf_arsenal_assets_v5', JSON.stringify(INITIAL_ARSENAL_DATA));
        return INITIAL_ARSENAL_DATA;
    }
    return JSON.parse(stored);
};

export const addArsenalAsset = (asset: Asset) => {
    const assets = getArsenalAssets();
    const updated = [asset, ...assets];
    localStorage.setItem('winf_arsenal_assets_v5', JSON.stringify(updated));
};
