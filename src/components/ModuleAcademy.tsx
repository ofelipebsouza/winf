import React, { useState } from "react";
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Star,
  Trophy,
  Zap,
  ChevronRight,
  Lock,
  Search,
  TrendingUp,
  ArrowRight,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWinf } from "../contexts/WinfContext";
import AcademyCertificate from "./AcademyCertificate";
import { AcademyMentoringContent } from "./AcademyMentoringContent";
import { ViewState } from "../types";

const COURSES_DATA = [
  {
    id: "c0",
    title: "Módulo Turn-Key: Treinamento Técnico e Certificação (5 Dias)",
    desc: "O curso fundamental e essencial (Documento 17). Capacitação em linhas residencial, comercial e automotiva premium. Cronograma intensivo de avaliação e certificação final.",
    duration: "40h 00min",
    lessons: 5,
    level: "Fundamental",
    category: "Técnico Avançado",
    thumbnail:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
    reward: 1000,
    completed: false,
    modules: [
      {
        id: "m0_dia1",
        title: "Dia 01: Química, Triagem e Limpeza Extrema",
        duration: "8h",
        type: "text",
      },
      {
        id: "m0_dia2",
        title: "Dia 02: Moldagem e Termo-encolhimento (Linha Select™)",
        duration: "8h",
        type: "video",
      },
      {
        id: "m0_dia3",
        title: "Dia 03: Treinamento Ergonômico de Teto",
        duration: "8h",
        type: "video",
      },
      {
        id: "m0_dia4",
        title: "Dia 04: Engenharia de Corte Computadorizado",
        duration: "8h",
        type: "video",
      },
      {
        id: "m0_dia5",
        title: "Dia 05: Simulação WINF OS™ e Teste de Certificação",
        duration: "8h",
        type: "text",
      },
    ],
  },
  {
    id: "c1",
    title: "Formação Básica Winf™: Postura e Padrão de Excelência",
    desc: "O primeiro passo na sua jornada. Aprenda a cultura Winf™, etiqueta corporativa e como se portar na casa do cliente.",
    duration: "1h 30min",
    lessons: 5,
    level: "Iniciante",
    category: "Comportamental",
    thumbnail:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    reward: 100,
    completed: false,
    modules: [
      {
        id: "m1_intro",
        title: "Vídeo: Introdução ao Padrão Winf™",
        duration: "10 min",
        type: "video",
      },
      {
        id: "m1_aula1",
        title: "A Empresa: Nossa História e Valores",
        duration: "15 min",
        type: "text",
      },
      {
        id: "m1_aula2",
        title: "Educação e Etiqueta: Postura com o Cliente",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m1_aula3",
        title: "Vestimenta e Apresentação Pessoal",
        duration: "15 min",
        type: "text",
      },
      {
        id: "m1_conc",
        title: "Vídeo: Conclusão do Módulo de Postura",
        duration: "5 min",
        type: "video",
      },
    ],
  },
  {
    id: "c2",
    title: "Proteção e Cuidado: O Ambiente do Cliente",
    desc: "O respeito ao ambiente de trabalho é essencial. Descubra como preparar, isolar e proteger a casa ou empresa do cliente.",
    duration: "2h 00min",
    lessons: 5,
    level: "Iniciante",
    category: "Técnico",
    thumbnail:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
    reward: 150,
    completed: false,
    modules: [
      {
        id: "m2_intro",
        title: "Vídeo: A Arte da Preparação",
        duration: "10 min",
        type: "video",
      },
      {
        id: "m2_aula1",
        title: "Isolamento: Protegendo Móveis e Pisos",
        duration: "25 min",
        type: "text",
      },
      {
        id: "m2_aula2",
        title: "Proteção de Eletrônicos e Áreas Sensíveis",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m2_aula3",
        title: "Limpeza Extrema e Entrega do Local",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m2_conc",
        title: "Vídeo: Conclusão de Preparação e Cuidados",
        duration: "5 min",
        type: "video",
      },
    ],
  },
  {
    id: "c3",
    title: "Comunicação Técnica: Explicando a Instalação",
    desc: "Saiba como explicar para o cliente todos os detalhes técnicos, acabamentos e cuidados pós-instalação.",
    duration: "1h 45min",
    lessons: 6,
    level: "Intermediário",
    category: "Vendas",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    reward: 200,
    completed: false,
    modules: [
      {
        id: "m3_intro",
        title: 'Vídeo: Como Traduzir o "Técniquês"',
        duration: "15 min",
        type: "video",
      },
      {
        id: "m3_aula1",
        title: "Explicando o Processo de Instalação no Local",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m3_aula2",
        title: "Alinhando Expectativas de Acabamento",
        duration: "25 min",
        type: "text",
      },
      {
        id: "m3_aula3",
        title: "Limitações do Material (Bolhas e Secagem)",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m3_aula4",
        title: "Cuidados e Garantia (O que o cliente deve fazer)",
        duration: "15 min",
        type: "text",
      },
      {
        id: "m3_conc",
        title: "Vídeo: Conclusão sobre Expectativa e Comunicação",
        duration: "10 min",
        type: "video",
      },
    ],
  },
  {
    id: "c4",
    title: "Fundamentos da Instalação Winf™",
    desc: "O núcleo técnico. Do corte à aplicação com certificação de excelência visual.",
    duration: "3h 30min",
    lessons: 5,
    level: "Avançado",
    category: "Instalação",
    thumbnail:
      "https://images.unsplash.com/photo-1618557219623-64a2747bb7eb?auto=format&fit=crop&q=80&w=800",
    reward: 350,
    completed: false,
    modules: [
      {
        id: "m4_intro",
        title: "Vídeo: A Arte da Instalação Invisível",
        duration: "15 min",
        type: "video",
      },
      {
        id: "m4_aula1",
        title: "Técnicas de Limpeza de Vidros (Química e Mecânica)",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m4_aula2",
        title: "Manuseio, Corte e Aproveitamento do Rolo",
        duration: "40 min",
        type: "text",
      },
      {
        id: "m4_aula3",
        title: "Aplicação e Espatulagem Perfeita",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m4_conc",
        title: "Vídeo: Conclusão do Módulo Técnico Core",
        duration: "10 min",
        type: "video",
      },
    ],
  },
  {
    id: "c5",
    title: "Design e Experiência de Luxo (A Filosofia Apple)",
    desc: 'O "unboxing" da instalação. Como alinhar estética imaculada com apresentação premium, reduzindo a sensibilidade do cliente ao preço.',
    duration: "2h 10min",
    lessons: 5,
    level: "Avançado",
    category: "Experiência",
    thumbnail:
      "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=800",
    reward: 400,
    completed: false,
    modules: [
      {
        id: "m5_intro",
        title: "Vídeo: O que é a Experiência Apple aplicada a Películas?",
        duration: "15 min",
        type: "video",
      },
      {
        id: "m5_aula1",
        title: "Detalhes Obceccados: Ferramentas Limpas e Silêncio Tático",
        duration: "25 min",
        type: "text",
      },
      {
        id: "m5_aula2",
        title: "Apresentação do Mostruário: Design Minimalista",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m5_aula3",
        title: "Elevando a Percepção de Valor Imediato",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m5_conc",
        title: "Vídeo: O Checklist do Luxo",
        duration: "10 min",
        type: "video",
      },
    ],
  },
  {
    id: "c6",
    title: "Governança SEO e Atendimento Cognitivo (Auron IA)",
    desc: "Imersão no Documento 23 e 24: Configuração mestre do Google Workspace, ranqueamento SEO Local e roteamento da Inteligência Artificial Auron W-NO.",
    duration: "3h 30min",
    lessons: 5,
    level: "Especialista",
    category: "Tecnologia & IA",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    reward: 800,
    completed: false,
    modules: [
      {
        id: "m6_intro",
        title: "Configuração do Google Workspace e Domínios Corporativos",
        duration: "40 min",
        type: "text",
      },
      {
        id: "m6_aula1",
        title: "Arquitetura de Segurança DNS: MX, DKIM, SPF, DMARC",
        duration: "45 min",
        type: "video",
      },
      {
        id: "m6_aula2",
        title:
          "Dominação Algorítmica no Google Meu Negócio e EXIF (Geotagging)",
        duration: "35 min",
        type: "video",
      },
      {
        id: "m6_aula3",
        title: "WhatsApp Business: Catálogo Digital Select™ e Automação",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m6_conc",
        title: "Injeção de Prompt Auron W-NO e Webhooks WINF OS™",
        duration: "40 min",
        type: "text",
      },
    ],
  },
  {
    id: "c7",
    title: "Engenharia Lean Winf™ (O Método Toyota)",
    desc: "Inspirado no Kaizen: elimine desperdícios de material (Winf Cut™), otimize fluxos e seja implacável na eficiência produtiva.",
    duration: "3h 00min",
    lessons: 6,
    level: "Intermediário",
    category: "Processos",
    thumbnail:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    reward: 350,
    completed: false,
    modules: [
      {
        id: "m6_intro",
        title: "Vídeo: Filosofia Lean no Workflow de Instalação",
        duration: "20 min",
        type: "video",
      },
      {
        id: "m6_aula1",
        title: "Mapeando os Desperdícios (O que drena o seu ROI)",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m6_aula2",
        title: "Gestão Inteligente de Retalhos e Setup Rápido",
        duration: "35 min",
        type: "text",
      },
      {
        id: "m6_aula3",
        title: "Otimização Logística: Deslocamentos e Ferramental",
        duration: "25 min",
        type: "text",
      },
      {
        id: "m6_aula4",
        title: "KaizenDiário: Melhoria de 1% Funcional",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m6_conc",
        title: "Vídeo: Conclusão do Flow Produtivo Toyota",
        duration: "10 min",
        type: "video",
      },
    ],
  },
  {
    id: "c10",
    title: "Obsessão pelo Cliente (O Efeito Disney & Amazon)",
    desc: "Fidelização através do encantamento emocional e resolução agressiva de problemas. Como criar defensores da sua unidade.",
    duration: "2h 45min",
    lessons: 6,
    level: "Avançado",
    category: "Atendimento",
    thumbnail:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800",
    reward: 500,
    completed: false,
    modules: [
      {
        id: "m7_intro",
        title: "Vídeo: O Espetáculo do Pós-Venda",
        duration: "15 min",
        type: "video",
      },
      {
        id: "m7_aula1",
        title: "A Jornada do Heroi (Cliente no Centro da Decisão)",
        duration: "25 min",
        type: "text",
      },
      {
        id: "m7_aula2",
        title: "Antecipação: Resolvendo o Inesperado Antes de Ocorrer",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m7_aula3",
        title: 'Customer Success: A Ligação de "Dia Seguinte"',
        duration: "20 min",
        type: "text",
      },
      {
        id: "m7_aula4",
        title: "Gerenciamento de Crise e Encantamento na Falha",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m7_conc",
        title: "Vídeo: Criando Advogados da Marca",
        duration: "10 min",
        type: "video",
      },
    ],
  },
  {
    id: "c8",
    title: "O Fator Sustentabilidade e Energia (Inspiração Tesla)",
    desc: "Mude a narrativa. Venda para tomadores de decisão (B2B) provando redução de carbono, eficiência energética e ROI sobre ar condicionado.",
    duration: "4h 20min",
    lessons: 7,
    level: "Avançado",
    category: "Negócios B2B",
    thumbnail:
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&q=80&w=800",
    reward: 700,
    completed: false,
    modules: [
      {
        id: "m8_intro",
        title: 'Vídeo: Da "Película Escura" à "Blindagem Climática"',
        duration: "20 min",
        type: "video",
      },
      {
        id: "m8_aula1",
        title: "Física Solar: Entendendo TSER e Bloqueio IR",
        duration: "40 min",
        type: "text",
      },
      {
        id: "m8_aula2",
        title: "Como Calcular o ROI de Energia (Estudo de Caso)",
        duration: "45 min",
        type: "text",
      },
      {
        id: "m8_aula3",
        title: "Pitch de Venda para Síndicos Profissionais e Fasilities",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m8_aula4",
        title: "Certificações LEED e Apelo ESG",
        duration: "35 min",
        type: "text",
      },
      {
        id: "m8_aula5",
        title: "Objeções de Grandes Corporações",
        duration: "25 min",
        type: "text",
      },
      {
        id: "m8_conc",
        title: "Vídeo: Fechando Contratos Corporativos Milionários",
        duration: "15 min",
        type: "video",
      },
    ],
  },
  {
    id: "c9",
    title: "Masterclass: Engenharia de Fachadas (Operações Complexas)",
    desc: "Para a elite técnica. Execução em grandes volumes de pele de vidro, segurança em altura NR35 e análise de stress térmico.",
    duration: "5h 00min",
    lessons: 6,
    level: "Master",
    category: "Técnico Avançado",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    reward: 1000,
    completed: false,
    modules: [
      {
        id: "m9_intro",
        title: "Vídeo: O Desafio Vertical",
        duration: "25 min",
        type: "video",
      },
      {
        id: "m9_aula1",
        title: "Diagnóstico de Vidros Laminados x Temperados",
        duration: "50 min",
        type: "text",
      },
      {
        id: "m9_aula2",
        title: "Cálculo de Risco de Quebra por Estresse Térmico",
        duration: "45 min",
        type: "text",
      },
      {
        id: "m9_aula3",
        title: "Segurança NR-35, Andaimes e Trabalho Suspenso",
        duration: "50 min",
        type: "text",
      },
      {
        id: "m9_aula4",
        title: "Logística de Distribuição e Isolamento Vertical",
        duration: "40 min",
        type: "text",
      },
      {
        id: "m9_conc",
        title: "Vídeo: A Entrega de uma Fachada Monumental",
        duration: "20 min",
        type: "video",
      },
    ],
  },
  {
    id: "c11",
    title: "Comunicação Stealth & Marca Pessoal WINF",
    desc: "Diretrizes do Documento 22: Posicionamento no LinkedIn, criação do canal Telegram e estratégia de marca para founders e investidores.",
    duration: "2h 15min",
    lessons: 5,
    level: "Master",
    category: "Expansão & Governança",
    thumbnail:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    reward: 900,
    completed: false,
    modules: [
      {
        id: "m11_intro",
        title: "A Estratégia de Posicionamento Stealth (Doc 22)",
        duration: "20 min",
        type: "text",
      },
      {
        id: "m11_aula1",
        title: "Engenharia do Perfil de LinkedIn (Headline & Summary)",
        duration: "30 min",
        type: "video",
      },
      {
        id: "m11_aula2",
        title: "Telegram WINF: Setup de Canal Oficial para Stakeholders",
        duration: "25 min",
        type: "video",
      },
      {
        id: "m11_aula3",
        title:
          "Redes Pessoais X Profissionais: O que não publicar (A Ética WINF)",
        duration: "30 min",
        type: "text",
      },
      {
        id: "m11_conc",
        title: "O Protocolo Stealth: Prospecção Invisível B2B",
        duration: "30 min",
        type: "text",
      },
    ],
  },
  {
    id: "c12",
    title: "Engenharia de Expansão: Redes Sociais e OnePage Local",
    desc: "Imersão nos Documentos 25 e 26: Parametrização rígida de Instagram/Facebook e deploy automatizado da OnePage para captura de SEO territorial.",
    duration: "2h 45min",
    lessons: 5,
    level: "Especialista",
    category: "Marketing Digital",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    reward: 850,
    completed: false,
    modules: [
      {
        id: "m12_intro",
        title: "Engenharia de Nomenclatura: Instagram e Meta Business Suite",
        duration: "30 min",
        type: "video",
      },
      {
        id: "m12_aula1",
        title: "Otimização da Bio e Vinculação de Links Estritos (Doc 25)",
        duration: "35 min",
        type: "text",
      },
      {
        id: "m12_aula2",
        title: "Arquitetura Conversacional da OnePage e Lighthouse Score",
        duration: "40 min",
        type: "video",
      },
      {
        id: "m12_aula3",
        title: "SEO Local Hostil: Meta Tags e Schema.org Dinâmicos (Doc 26)",
        duration: "35 min",
        type: "text",
      },
      {
        id: "m12_conc",
        title: "Processo de Deploy em 48h e Checklist de Homologação",
        duration: "25 min",
        type: "text",
      },
    ],
  },
];

// Add generic modules to missing courses
COURSES_DATA.forEach((c) => {
  if (!c.modules) {
    c.modules = Array.from({ length: c.lessons }).map((_, i) => ({
      id: `m${i}`,
      title: `Módulo Prático ${i + 1}`,
      duration: "10 min",
      type: "video",
    }));
  }
});

const ModuleAcademy: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({
  onNavigate,
}) => {
  const { user, gamify } = useWinf();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState<"cursos" | "equipe">("cursos");

  const filteredCourses = COURSES_DATA.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCompleteLesson = () => {
    gamify("ACADEMY_COMPLETED");
    setActiveLesson(null);
    setShowCertificate(true);
  };

  if (activeLesson) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#131314] flex flex-col animate-fade-in">
        <div className="bg-[#131314] border-b border-[#444746] p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveLesson(null)}
              className="p-2 hover:bg-[#131314] rounded-none text-white/40 transition-all"
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
            <div>
              <p className="text-xs md:text-[10px] text-white font-black uppercase tracking-widest">
                Aula em curso
              </p>
              <h2 className="text-sm font-bold text-white">
                {selectedCourse.title}
              </h2>
            </div>
          </div>
          <button
            onClick={handleCompleteLesson}
            className="bg-white text-winf-background px-6 py-2 rounded-none text-xs font-bold hover:bg-white_hover transition-all"
          >
            Finalizar Treinamento
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Content Area */}
          <div className="flex-[2] overflow-y-auto p-6 lg:p-12 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="aspect-video bg-[#131314] rounded-none overflow-hidden shadow-2xl relative group border border-[#444746]">
                <img
                  src={selectedCourse.thumbnail}
                  className="w-full h-full object-cover opacity-60"
                  alt="Lesson"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-none flex items-center justify-center text-white border border-winf-primary/30 animate-pulse">
                      <PlayCircle size={40} />
                    </div>
                    <p className="text-white font-bold text-sm tracking-widest uppercase">
                      Conteúdo Neural Disponível
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h1 className="text-3xl font-bold text-white">
                  {selectedCourse.title}
                </h1>
                <p className="text-white/80 leading-relaxed mb-8">
                  Bem-vindo à área de Mentoria Winf Ascend™. Abaixo trazemos as
                  melhores práticas, posturas corretas e o diferencial do
                  "Mestre Winf" para você aplicar imediatamente.
                </p>

                <AcademyMentoringContent courseId={selectedCourse.id} />
              </div>
            </div>
          </div>

          {/* Sidebar Player */}
          <div className="flex-1 bg-[#131314] border-l border-[#444746] p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <h4 className="text-white font-bold">Resumo do Curso</h4>
              <div className="flex items-center justify-between text-sm md:text-[11px] text-white/40">
                <span>{selectedCourse.modules?.length || 0} Módulos</span>
                <span>{selectedCourse.duration} totais</span>
              </div>
            </div>

            <div className="space-y-2">
              {selectedCourse.modules?.map((mod: any, i: number) => (
                <div
                  key={mod.id}
                  className="flex items-center gap-4 p-4 bg-[#131314]/50 rounded-none border border-transparent hover:border-winf-primary/20 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-none bg-[#131314] border border-[#444746] flex items-center justify-center text-xs md:text-[10px] font-bold text-white/40 group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                      {mod.title}
                    </p>
                    <p className="text-xs md:text-[10px] text-white/40">
                      {mod.duration}
                    </p>
                  </div>
                  {mod.type === "text" ? (
                    <FileText
                      className={i === 0 ? "text-white" : "text-white/40"}
                      size={16}
                    />
                  ) : (
                    <PlayCircle
                      className={i === 0 ? "text-white" : "text-white/40"}
                      size={16}
                    />
                  )}
                  <Lock size={12} className="text-white/10 hidden" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#444746] pb-6 md:pb-8">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Winf™ | Winf Academy
          </h1>
          <p className="text-white/40 text-xs md:text-sm">
            Plataforma de Treinamento de Elite // Evolução Winf™.
          </p>
          <div className="flex bg-[#131314] p-1 border border-[#444746] shadow-2xl overflow-x-auto max-w-full mt-4 custom-scrollbar">
            <button
              onClick={() => setActiveTab("cursos")}
              className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs md:text-[10px] md:text-sm md:text-[11px] tracking-[0.2em] font-bold uppercase transition-all ${activeTab === "cursos" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
            >
              TREINAMENTOS
            </button>
            <button
              onClick={() => setActiveTab("equipe")}
              className={`flex items-center gap-2 px-6 py-2 whitespace-nowrap text-xs md:text-[10px] md:text-sm md:text-[11px] tracking-[0.2em] font-bold uppercase transition-all ${activeTab === "equipe" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
            >
              EQUIPE E CERTIFICAÇÕES
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#131314] border border-[#444746] px-6 py-3 rounded-none">
          <div className="text-right">
            <p className="text-xs md:text-[10px] text-white/40 uppercase font-black tracking-widest">
              Winf™ Knowledge
            </p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-[#131314] rounded-none overflow-hidden">
                <div className="w-1/4 h-full bg-white"></div>
              </div>
              <p className="text-white font-bold text-sm">
                {user?.winf_knowledge || 0} XP
              </p>
            </div>
          </div>
          <div className="w-px h-8 bg-winf-border"></div>
          <div className="text-right">
            <p className="text-xs md:text-[10px] text-white/40 uppercase font-black tracking-widest">
              Nível
            </p>
            <p className="text-white font-bold text-sm">MEMBRO QUALIFICADO</p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && selectedCourse && (
          <AcademyCertificate
            courseTitle={selectedCourse.title}
            userName={user?.name || "Membro Winf"}
            date={new Date().toLocaleDateString()}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>

      {activeTab === "cursos" && (
        <div className="space-y-6 animate-fade-in">
          {/* Congratulations Welcome Banner */}
          <div className="bg-[#051c14]/80 border border-emerald-500/30 p-6 md:p-8 rounded-none relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -bottom-10 -right-10 text-zinc-300/5 select-none pointer-events-none font-mono font-black text-9xl">
              WINF
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-zinc-300 rounded-none text-xs md:text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                  ★ PARCEIROS OFICIAIS WINF™
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-white uppercase tracking-tight leading-tight">
                  MEUS PARABÉNS PELO{" "}
                  <span className="font-bold text-zinc-300">
                    SEU NOVO NEGÓCIO E LOJA OFICIAL WINF™!
                  </span>
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Seja muito bem-vindo ao ecossistema de elite! Agora você
                  possui uma{" "}
                  <strong className="text-white">loja oficial da Winf</strong>,
                  um negócio altamente lucrativo com proteção regional e
                  nano-tecnologia exclusiva.
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Para que possa conhecer perfeitamente todo o nosso sistema e
                  dominar cada ferramenta do que acabou de adquirir, preparamos
                  uma aula inaugural especial. Clique abaixo e inicie sua aula
                  de formação oficial!
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(COURSES_DATA[0])}
                className="bg-white hover:bg-emerald-400 text-white px-8 py-4 shrink-0 rounded-none font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <PlayCircle size={16} /> Começar Aula Inaugural
              </button>
            </div>
          </div>

          {/* Featured Course */}
          {!selectedCourse && (
            <div
              className="relative h-80 rounded-none overflow-hidden group cursor-pointer"
              onClick={() => setSelectedCourse(COURSES_DATA[0])}
            >
              <img
                src="/input_file_3.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Featured"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-winf-background via-winf-background/40 to-transparent"></div>
              <div className="absolute bottom-10 left-10 space-y-4 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="bg-[#131314] text-white text-xs md:text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-widest">
                    Aula Inaugural
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Formação Básica Winf™: Postura e Padrão de Excelência
                </h2>
                <p className="text-white/80 text-sm">
                  Domine a psicologia de vendas aplicada a películas de alta
                  performance e aumente seu ticket médio.
                </p>
                <button className="bg-white text-winf-background px-8 py-3 rounded-none font-bold text-sm flex items-center gap-2 hover:bg-white_hover transition-all">
                  <PlayCircle size={18} /> Começar Agora
                </button>
              </div>
            </div>
          )}

          {/* Evolution Banner */}
          <div className="bg-gradient-to-r from-winf-primary/20 to-transparent border border-winf-primary/30 rounded-none p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-4 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-none text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white uppercase tracking-widest">
                <TrendingUp size={12} /> Trajetória de Sucesso
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">
                PRONTO PARA EVOLUIR SUA LICENÇA?
              </h3>
              <p className="text-white/80 text-xs leading-relaxed max-w-lg">
                Conhecimento é a base, mas ferramentas são o acelerador. Veja
                como os planos{" "}
                <span className="text-white font-bold">Nível 1, 2 e 3</span>{" "}
                podem transform seu faturamento mensal na Blackshop.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.(ViewState.MODULE_BLACKSHOP)}
              className="relative z-10 bg-white text-black px-8 py-4 rounded-none font-black text-xs uppercase tracking-widest hover:bg-white_hover transition-all flex items-center gap-2"
            >
              Explorar Upgrades <ArrowRight size={16} />
            </button>
          </div>

          {/* Course Grid */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <BookOpen size={20} className="text-white/40" /> Cursos
                Disponíveis
              </h3>
              <div className="relative w-full md:w-80">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131314] border border-[#444746] py-2.5 pl-12 pr-4 rounded-none text-white text-sm outline-none focus:border-winf-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="bg-[#131314] border border-[#444746] rounded-none overflow-hidden flex flex-col group cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#131314]/60 backdrop-blur-md text-white text-xs md:text-[10px] md:text-sm md:text-[11px] font-black px-2 py-1 rounded-none uppercase">
                      {course.category}
                    </div>
                    {course.completed && (
                      <div className="absolute top-4 right-4 bg-green-500 text-winf-background p-1 rounded-none">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col bg-[#131314]/40">
                    <div className="space-y-2 flex-1">
                      <h4 className="text-white font-bold text-sm group-hover:text-zinc-300 font-bold transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-white/80 text-xs md:text-[11px] leading-relaxed line-clamp-2">
                        {course.desc}
                      </p>

                      {/* Zeigarnik dynamic loop feedback */}
                      {!course.completed ? (
                        <div className="mt-3 pt-2.5 pb-1 space-y-1.5 border-t border-[#444746]">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-amber-400 font-mono flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-none bg-amber-400 animate-pulse"></span>
                              Retomar Ciclo
                            </span>
                            <span className="text-zinc-500 font-mono font-bold">
                              {course.id === "c2"
                                ? "33%"
                                : course.id === "c5"
                                  ? "40%"
                                  : course.id === "c7"
                                    ? "50%"
                                    : "0%"}{" "}
                              Concluído
                            </span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-none"
                              style={{
                                width:
                                  course.id === "c2"
                                    ? "33%"
                                    : course.id === "c5"
                                      ? "40%"
                                      : course.id === "c7"
                                        ? "50%"
                                        : "5%",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 pt-2.5 pb-1 text-[9px] text-green-400 font-mono flex items-center gap-1 border-t border-[#444746]">
                          ✓ Certificação Emitida
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#444746]">
                      <div className="flex items-center gap-3 text-xs md:text-[10px] text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award size={10} /> {course.level}
                        </span>
                      </div>
                      <div className="text-white/80 font-bold text-xs flex items-center gap-1">
                        <Award size={12} /> {course.reward}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "equipe" && (
        <div className="space-y-8 animate-fade-in text-white/80">
          <div className="bg-[#131314] border border-[#444746] p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-light text-white tracking-tight uppercase">
              Progresso da Equipe e Certificados
            </h2>
            <p className="text-sm font-light text-white/60 mb-8">
              Administre a qualificação técnica dos seus aplicadores oficiais.
              Quem treina mais, reduz prejuízos.
            </p>

            <div className="space-y-4">
              {[
                {
                  name: "Marcos Silva",
                  role: "Instalador",
                  status: "Autorizado",
                  certs: 4,
                  prog: 78,
                },
                {
                  name: "Lucas Almeida",
                  role: "Consultor Técnico",
                  status: "Em Formação",
                  certs: 1,
                  prog: 35,
                },
                {
                  name: "Suelen Torres",
                  role: "Vendedora Elite",
                  status: "Autorizado",
                  certs: 6,
                  prog: 92,
                },
              ].map((person, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border border-[#444746] bg-[#131314] hover:border-[#444746] transition-all gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center font-bold text-lg text-white">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm uppercase">
                        {person.name}
                      </h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest">
                        {person.role}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 space-y-2">
                    <div className="flex justify-between text-xs text-white/50">
                      <span>Taxa de Conclusão Global</span>
                      <span>{person.prog}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-none overflow-hidden">
                      <div
                        className="h-full bg-white transition-all"
                        style={{ width: `${person.prog}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-xs md:text-[10px] uppercase text-white/40 tracking-widest mb-1">
                        Status
                      </p>
                      <span
                        className={`text-xs uppercase font-bold py-1 px-3 ${person.status === "Autorizado" ? "bg-green-500/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}
                      >
                        {person.status}
                      </span>
                    </div>
                    <div className="text-center border-l border-[#444746] pl-4">
                      <p className="text-xs md:text-[10px] uppercase text-white/40 tracking-widest mb-1">
                        Certificados
                      </p>
                      <span className="text-xl font-bold text-white">
                        {person.certs}
                      </span>
                    </div>
                    <button className="bg-transparent border border-[#444746] hover:bg-white hover:text-black py-2 px-4 transition-all text-xs font-bold uppercase tracking-widest border-r border-[#444746] ml-4 hidden md:block">
                      Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-[#131314]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#131314] border border-[#444746] rounded-none overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto relative">
                  <img
                    src={selectedCourse.thumbnail}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-winf-surface to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-none flex items-center justify-center text-winf-background shadow-xl shadow-white/10 hover:scale-110 transition-transform">
                      <PlayCircle size={32} />
                    </button>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-[10px] text-white/40 font-black uppercase tracking-widest">
                        {selectedCourse.category}
                      </span>
                      <span className="text-winf-border">•</span>
                      <span className="text-xs md:text-[10px] text-white/40 font-black uppercase tracking-widest">
                        {selectedCourse.level}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {selectedCourse.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#131314]/40 p-4 rounded-none border border-[#444746]">
                      <p className="text-xs md:text-[10px] text-white/40 uppercase font-black tracking-widest">
                        Aulas
                      </p>
                      <p className="text-white font-bold">
                        {selectedCourse.lessons}
                      </p>
                    </div>
                    <div className="bg-[#131314]/40 p-4 rounded-none border border-[#444746]">
                      <p className="text-xs md:text-[10px] text-white/40 uppercase font-black tracking-widest">
                        Recompensa
                      </p>
                      <p className="text-white/80 font-bold flex items-center gap-1">
                        <Award size={14} /> {selectedCourse.reward}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-white">
                      Conteúdo do Curso
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {selectedCourse.modules?.map((mod: any, i: number) => (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between p-3 bg-[#131314]/50 rounded-none text-xs text-white/80 border border-transparent hover:border-winf-primary/30 transition-all cursor-pointer group"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-white/40 font-mono">
                              {i + 1 < 10 ? `0${i + 1}` : i + 1}
                            </span>
                            <span className="group-hover:text-white transition-colors">
                              {mod.title}
                            </span>
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs md:text-[10px] text-white/40">
                              {mod.duration}
                            </span>
                            {mod.type === "text" ? (
                              <FileText className="text-white/40" size={14} />
                            ) : (
                              <PlayCircle className="text-white/40" size={14} />
                            )}
                          </div>
                        </div>
                      ))}
                      {(!selectedCourse.modules ||
                        selectedCourse.modules.length === 0) && (
                        <div className="text-xs text-zinc-500 py-4 text-center">
                          Módulos e aulas em breve.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="flex-1 py-3 bg-[#131314]/50 hover:bg-[#131314] text-white font-bold rounded-none transition-all border border-[#444746]"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={() => {
                        if (
                          selectedCourse.modules &&
                          selectedCourse.modules.length > 0
                        ) {
                          setActiveLesson(selectedCourse.modules[0]);
                        }
                      }}
                      className="flex-1 py-3 bg-white hover:bg-white_hover text-winf-background font-bold rounded-none transition-all shadow-lg shadow-white/5"
                    >
                      Iniciar Aula
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleAcademy;
