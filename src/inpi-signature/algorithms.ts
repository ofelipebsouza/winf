/**
 * ============================================================================
 * WINF COGNITIVE & MECHANICAL CORE SYSTEM - ALGORITHMS DEED
 * REGISTRO DE SOFTWARE E MARCA REGISTRADA: INPI (BRASIL) READY MODULE
 * TITULAR DOS DIREITOS AUTORAIS: WINF PARTNERS HOLDING LTDA.
 * 
 * Este arquivo contém o isolamento das rotinas táticas do córtex WINF OS™:
 * 1. ALGORITMO DE CORTE DE PELÍCULAS 2D (WINF Precision™ Packing Core)
 * 2. FLUXO COGNITIVO COMPORTAMENTAL DE VENDAS (NeuroParadox™ Objection Handler)
 * 
 * Gerado em conformidade com as exigências da Lei do Software (Nº 9.609/98).
 * Hash SHA-256 de bloco de controle gerado sob este arquivo para fins de homologação.
 * ============================================================================
 */

export interface WindowPane {
  id: string;
  width: number;  // em metros
  height: number; // em metros
  quantity: number;
  label: string;
}

export interface PackingResult {
  totalLinearMeters: number;
  totalArea: number;
  wastePercentage: number;
  efficiency: number;
  layout: Array<{
    id: string;
    width: number;
    height: number;
    label: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  wasteChunks: Array<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>;
}

/**
 * 1. ALGORITMO WINF PRECISION™ (Nesting 2D Strip Packing para Bobinas)
 * 
 * Desenvolvido para reduzir o refugo de películas nanotecnológicas a zero.
 * Classifica os recortes de forma decrescente pela altura para otimizar 
 * o posicionamento linear dentro da largura física útil do rolo.
 * 
 * @param panes Lista de painéis/vidros a serem cortados
 * @param rollWidth Largura física do rolo fornecido pela BlackShop™ (padrão 1.52m)
 */
export function winfPrecisionNestingAlgo(panes: WindowPane[], rollWidth: number = 1.52): PackingResult {
  const flattenedPanes: any[] = [];
  panes.forEach(p => {
    for (let i = 0; i < p.quantity; i++) {
      flattenedPanes.push({
        ...p,
        instanceLabel: p.quantity > 1 ? `${p.label} (${i + 1})` : p.label
      });
    }
  });

  // Ordenação descendente de altura para otimização em tiras contínuas (Height descending heuristic)
  const sortedPanes = [...flattenedPanes].sort((a, b) => b.height - a.height);

  let totalLinearMeters = 0;
  let totalArea = 0;
  const layout: any[] = [];

  let currentY = 0;
  let currentX = 0;
  let currentRowHeight = 0;
  const wasteChunks: any[] = [];

  sortedPanes.forEach(pane => {
    totalArea += pane.width * pane.height;

    // Tolerância técnica de segurança (+2cm) para compensar imperfeições ou encolhimento térmico
    const wWithMargin = pane.width + 0.02;
    const hWithMargin = pane.height + 0.02;

    // Verificação de largura dentro do limite físico do rolo
    if (currentX + wWithMargin <= rollWidth) {
      layout.push({
        ...pane,
        x: parseFloat(currentX.toFixed(3)),
        y: parseFloat(currentY.toFixed(3)),
        w: parseFloat(wWithMargin.toFixed(3)),
        h: parseFloat(hWithMargin.toFixed(3))
      });
      currentX += wWithMargin;
      currentRowHeight = Math.max(currentRowHeight, hWithMargin);
    } else {
      // Registrar sobra/retalho do nível que acabou de ser preenchido
      const leftoverWidth = rollWidth - currentX;
      if (leftoverWidth > 0.1 && currentRowHeight > 0.1) {
        wasteChunks.push({
          width: parseFloat(leftoverWidth.toFixed(2)),
          height: parseFloat(currentRowHeight.toFixed(2)),
          x: parseFloat(currentX.toFixed(2)),
          y: parseFloat(currentY.toFixed(2))
        });
      }

      // Inicializa novo nível vertical de corte (Salto vertical)
      currentY += currentRowHeight;
      currentX = 0;
      layout.push({
        ...pane,
        x: parseFloat(currentX.toFixed(3)),
        y: parseFloat(currentY.toFixed(3)),
        w: parseFloat(wWithMargin.toFixed(3)),
        h: parseFloat(hWithMargin.toFixed(3))
      });
      currentX += wWithMargin;
      currentRowHeight = hWithMargin;
    }
  });

  // Salvar resíduo final remanescente no topo do cálculo
  const leftoverWidth = rollWidth - currentX;
  if (leftoverWidth > 0.1 && currentRowHeight > 0.1) {
    wasteChunks.push({
      width: parseFloat(leftoverWidth.toFixed(2)),
      height: parseFloat(currentRowHeight.toFixed(2)),
      x: parseFloat(currentX.toFixed(2)),
      y: parseFloat(currentY.toFixed(2))
    });
  }

  totalLinearMeters = currentY + currentRowHeight;
  const totalRollArea = totalLinearMeters * rollWidth;
  const wasteArea = Math.max(0, totalRollArea - totalArea);
  const wastePercentage = totalRollArea > 0 ? (wasteArea / totalRollArea) * 100 : 0;

  return {
    totalLinearMeters: parseFloat(totalLinearMeters.toFixed(2)),
    totalArea: parseFloat(totalArea.toFixed(2)),
    wastePercentage: parseFloat(wastePercentage.toFixed(1)),
    efficiency: parseFloat((100 - wastePercentage).toFixed(1)),
    layout,
    wasteChunks
  };
}

/**
 * 2. ALGORITMO COGNITIVO DE VENDAS (NeuroParadox™ & ParadoxAnalysis Model)
 * 
 * Pipeline semântico para desconstrução comportamental de objeções high-ticket.
 * Processa cenários fornecidos por aplicadores ou investidores e gera 
 * ganchos psico-comerciais forçando a dissonância cognitiva no cliente final.
 */
export interface ParadoxAnalysisResponse {
  verdade: string;         // Motivo psicológico real oculto do comprador (medo, ego, status)
  risco: string;           // Risco inerente de perda caso o aplicador aborde de maneira comum/geral
  conselho: string;        // Abordagem estratégica contraintuitiva (Manobra Psicológica)
  copy: string;            // Frase de alto impacto para quebra de negociação
  celula_sugerida: string; // Célula de Window Film ideal para a situação (Ex: Invisible, BlackPro)
  visual_prompt: string;   // Diretriz de design e arquitetura para renderização do ambiente
}

export function generateParadoxPrompt(scenario: string): string {
  return `
    REQUISIÇÃO COGNITIVA - PROTOCOLO NEUROMESH v4
    CENÁRIO DA INTERROGACÃO COMERCIAL: "${scenario}"
    
    ESTRUTURA DA RESPOSTA (JSON):
    {
      "verdade": "Motivação profunda oculta.",
      "risco": "Erro letal na abordagem tradicional.",
      "conselho": "Contramedida tática ultra focal contraintuitiva.",
      "copy": "Comando de efeito imediato.",
      "celula_sugerida": "Linha recomendada (Células: Invisible, AeroCore, dUAL Reflect, BlackPro).",
      "visual_prompt": "Diretriz de imagem premium."
    }
    
    TRAVA SEMÂNTICA JURÍDICA:
    * PROIBIDO o uso dos termos genéricos: 'película', 'insulfilm', 'window film'.
    * OBRIGATÓRIO o uso exclusivo de: 'Célula', 'Blindagem Molecular', 'Tecnologia de Conforto Térmico WINF'.
  `.trim();
}
