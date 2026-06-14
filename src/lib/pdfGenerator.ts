import { jsPDF } from 'jspdf';

export const generateCommercialDeckPDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Background
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 297, 'F');

  // Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('WINF™', 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('BUSINESS DECK & MANIFESTO_ 2026', 20, 38);

  doc.setDrawColor(255, 255, 255);
  doc.line(20, 45, pageWidth - 20, 45);

  let yPos = 60;

  const addSection = (title: string, subtitle: string, whatIsIt: string, whatItDoes: string, hiddenAdvantage: string, financial: string) => {
    if (yPos > 230) {
      doc.addPage();
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, pageWidth, 297, 'F');
      yPos = 30;
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPos);
    
    doc.setTextColor(249, 115, 22); // orange-500
    doc.setFontSize(10);
    doc.text(subtitle.toUpperCase(), 20, yPos + 6);

    yPos += 15;
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('O que é: ', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const whatIsSplit = doc.splitTextToSize(whatIsIt, pageWidth - 45);
    doc.text(whatIsSplit, 38, yPos);
    yPos += (whatIsSplit.length * 5) + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('O que faz: ', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const whatItDoesSplit = doc.splitTextToSize(whatItDoes, pageWidth - 45);
    doc.text(whatItDoesSplit, 42, yPos);
    yPos += (whatItDoesSplit.length * 5) + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Vantagem: ', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const advantageSplit = doc.splitTextToSize(hiddenAdvantage, pageWidth - 45);
    doc.text(advantageSplit, 42, yPos);
    yPos += (advantageSplit.length * 5) + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Ganhos: ', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const financialSplit = doc.splitTextToSize(financial, pageWidth - 45);
    doc.text(financialSplit, 38, yPos);
    yPos += (financialSplit.length * 5) + 10;

    doc.setDrawColor(50, 50, 50);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 15;
  };

  // Section
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('A HIERARQUIA DE PODER WINF™', 20, yPos);
  yPos += 15;

  addSection(
    'ASSET LIGHT™ (Nível 01)',
    'Acesso Estratégico & Consultoria',
    'O portal de entrada para o ecossistema WINF™ PARTNERS. Feito para profissionais ágeis que buscam escalabilidade com baixo investimento estrutural.',
    'Proporciona Gestão Completa via WINF OS™, Diagnóstico Digital (Winf Precision) e um pacote de Marketing de Geração de Leads diretamente para o WhatsApp do licenciado.',
    'Acesso à marca premium sem necessidade de ponto comercial físico caro. Operação altamente digitalizada com "Asset Light".',
    'Faturamento estimado de R$ 15.000 a R$ 65.000 mensais dependendo da capacidade de execução regional. Alta margem (75%).'
  );

  addSection(
    'HIGH VELOCITY™ / KIOSK MODE (Nível 02)',
    'O Tactical Hub de Alta Rotação',
    'Um ponto de contato imersivo, desenhado para dominar shoppings Classe A, aeroportos ou galerias de luxo através de módulos compactos.',
    'Atração de clientes em massa com Totem Imersivo VR / Térmico. Venda recorrente e de impulso de acessórios automotivos/pessoais Winf™ e leads para instalação.',
    'Autoridade física esmagadora imediata frente a concorrentes. Visibilidade para a marca e Fast Payback aproveitando o "tráfego rico" dos shoppings.',
    'Ticket médio forte em acessórios (R$ 450) + captação de projetos maiores de veículos e arquitetura de alto padrão.'
  );

  addSection(
    'TOTAL AUTHORITY™ / FLAGSHIP AEROCORE™ (Nível 03)',
    'A Experiência Elite',
    'O padrão ouro absoluto. Estabelece um Centro Estético Automotivo Elite & Showroom Integrado focado no público ultra-high-end.',
    'Operação que atua como hub de serviço de extrema qualidade técnica, com atendimento premium focado na linha AeroCore™ eximindo o licenciado da guerra de preços.',
    'Dominação inquestionável de território. O parceiro dita as regras e atrai os supercarros e mansões da região, e participa do Equity Universe Winf™.',
    'Faturamento projetado para as faixas de R$ 150.000 a mais de R$ 750.000 mensais. Imunidade à concorrência com margens altíssimas.'
  );

  doc.save('WINF_Apresentacao_Comercial_2026.pdf');
};

export const generateLifestyleCatalogPDF = (partnerName: string = "WINF™ Sócio") => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Page 1: COVER
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 297, 'F');
  
  // Gold accent bar
  doc.setFillColor(235, 142, 42);
  doc.rect(20, 40, 4, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('THE ART OF', 32, 50);
  doc.text('PROTECTION', 32, 62);
  
  doc.setTextColor(235, 142, 42);
  doc.setFontSize(14);
  doc.text('VOLUME I // EXCLUSIVIDADE AUTOMOTIVA', 32, 72);
  
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(10);
  doc.text(`DESIGNED FOR SUPER-CARS & LUXURY EXPERIENCES`, 32, 85);

  // Decorative vector lines
  doc.setDrawColor(255, 255, 255);
  doc.rect(20, 120, pageWidth - 40, 1, 'F');
  
  // Main copy
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const manifesto = [
    "A alta performance nao se limita ao motor. Ela se manifesta no controle termico e visual absoluto do habitaculo.",
    "A tecnologia Nano-Ceramic da WINF™ atua como um escudo molecular invisivel, repelindo ate 99% da radiacao solar infravermelha.",
    "Preserve o luxo do seu interior. Eleve a privacidade tatica sem comprometer a visibilidade noturna cristalina."
  ];
  let y = 140;
  manifesto.forEach(paragraph => {
    const lines = doc.splitTextToSize(paragraph, pageWidth - 40);
    doc.text(lines, 20, y);
    y += (lines.length * 6) + 6;
  });

  // Footer cover
  doc.setFillColor(25, 25, 25);
  doc.rect(0, 240, pageWidth, 57, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`APRESENTADO POR: ${partnerName.toUpperCase()}`, 20, 260);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('WINF™ INTELLECTUAL PROPERTY REVERSED // ESTILO DE VIDA MUNDIAL', 20, 275);
  
  doc.save('WINF_The_Art_of_Protection_Vol_I.pdf');
};

export const generateArchitectureCatalogPDF = (partnerName: string = "WINF™ Sócio") => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Dark luxury theme
  doc.setFillColor(18, 18, 18);
  doc.rect(0, 0, pageWidth, 297, 'F');
  
  // Blue accent color for architecture
  doc.setFillColor(37, 99, 235);
  doc.rect(20, 40, 15, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('SELECT™ ARCHITECTURAL', 20, 52);
  doc.text('SERIES PORTFOLIO', 20, 64);
  
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('CONTROLE SOLAR SELETIVO PARA RESIDENCIAS DE ALTO PADRAO', 20, 72);

  doc.setDrawColor(40, 40, 40);
  doc.line(20, 85, pageWidth - 20, 85);

  let y = 100;
  
  const sections = [
    {
      title: "01. ARQUITETURA DE CLASSE MUNDIAL",
      desc: "As mansoes de alto luxo e fachadas envidracadas demandam iluminacao abundante, porem o excesso de calor costumava obrigar o uso de persianas pesadas que escondiam a vista. WINF Select™ resolve isso permitindo 70% de luz visivel enquanto reflete o infravermelho nocivo."
    },
    {
      title: "02. PROTECAO UV DE FATOR FPS 1000+",
      desc: "Bloqueie o desbotamento acelerado de pisos de madeira nobre, tapecarias importadas e mobiliarios de design. A protecao contra raios ultra-violeta e total e permanente."
    },
    {
      title: "03. SUSTENTABILIDADE E RETORNO FINANCEIRO",
      desc: "Ao rejeitar energia termica macica, o ar condicionado opera em zonas de baixa rotacao, gerando economia expressiva na conta de eletricidade e garantindo um payback natural de engenharia."
    }
  ];

  sections.forEach(sec => {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(sec.title, 20, y);
    y += 6;
    
    doc.setTextColor(170, 170, 170);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(sec.desc, pageWidth - 40);
    doc.text(descLines, 20, y);
    y += (descLines.length * 5) + 12;
  });

  doc.setDrawColor(40, 40, 40);
  doc.line(20, 240, pageWidth - 20, 240);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.text(`PORTFOLIO E CUSTODIA LOCAL DE TERRITORIO: ${partnerName.toUpperCase()}`, 20, 255);
  doc.text(`WINF™ SELECT INTELIGENCIA TERMICA INTEGRADA DE ARQUITETURA`, 20, 262);

  doc.save('WINF_Select_Architectural_Series.pdf');
};


export const generateDocPDF = (docItem: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Clean White Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 297, 'F');
  
  // Category Accent Colors
  let accentR = 235, accentG = 142, accentB = 42; // amber-500 default
  if (docItem.category === 'Manuais Operacionais') { accentR = 16; accentG = 185; accentB = 129; } // emerald
  else if (docItem.category === 'Arquitetura Premium') { accentR = 59; accentG = 130; accentB = 246; } // blue
  else if (docItem.category === 'Engenharia') { accentR = 168; accentG = 85; accentB = 247; } // purple
  
  // Top header text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('WINF PARTNERS', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('DOCUMENTAÇÃO MATRIZ INTERNA // ARSENAL TÁTICO MAW', pageWidth / 2, 33, { align: 'center' });

  // Divider Line
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 38, pageWidth - 20, 38);

  let currentY = 50;

  const renderTextWithBold = (text: string, x: number, lineMax: number, currentY: number): number => {
    const parts = text.split('**');
    let currentX = x;
    let maxY = currentY;
    
    parts.forEach((part, index) => {
      if (!part) return;
      const isBold = index % 2 !== 0;
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(0, 0, 0); // Black text
      
      const words = part.split(' ');
      words.forEach(word => {
        const wordWidth = doc.getTextWidth(word + ' ');
        if (currentX + wordWidth > lineMax) {
          currentX = x;
          maxY += 5;
        }
        doc.text(word + ' ', currentX, maxY);
        currentX += wordWidth;
      });
    });
    return maxY;
  };

  const paragraphs = docItem.content.split('\n\n');
  
  paragraphs.forEach((p: string, index: number) => {
    // Disable double-rendering because WINF PARTNERS header is already static at top
    if (index === 0 && p.toUpperCase().startsWith('# WINF')) return;
    if (index === 1 && p.toUpperCase().startsWith('## DOCUMENT')) return;

    if (currentY > 260) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 297, 'F');
      currentY = 20;
    }
    
    if (p.startsWith('### ')) {
      let text = p.replace(/^### /, '').toUpperCase();
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(text, pageWidth - 40);
      doc.text(lines, pageWidth / 2, currentY, { align: 'center' });
      currentY += (lines.length * 6) + 4;

    } else if (p.startsWith('#### ')) {
      let text = p.replace(/^#### /, '').toUpperCase();
      
      doc.setFillColor(accentR, accentG, accentB);
      doc.rect(20, currentY - 4.5, 1.5, 5, 'F'); // Vertical colored bar

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      
      const lines = doc.splitTextToSize(text, pageWidth - 45);
      doc.text(lines, 24, currentY); // Shifted right to accommodate the bar
      currentY += (lines.length * 6) + 4;

    } else if (p.startsWith('**') && p.endsWith('**') && p.split('**').length === 3) {
      let text = p.replace(/\*\*/g, '').toUpperCase();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      const lines = doc.splitTextToSize(text, pageWidth - 40);
      doc.text(lines, pageWidth / 2, currentY, { align: 'center' });
      currentY += (lines.length * 5) + 6;

    } else {
      doc.setFontSize(10);
      
      const linesArr = p.split('\n');
      linesArr.forEach((line) => {
        if (currentY > 260) {
          doc.addPage();
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageWidth, 297, 'F');
          currentY = 20;
          doc.setFontSize(10);
        }
        
        let cleaned = line;
        let isBullet = false;
        if (cleaned.startsWith('* ')) {
          cleaned = `•  ${cleaned.replace('* ', '')}`;
          isBullet = true;
        }
        
        currentY = renderTextWithBold(cleaned, isBullet ? 25 : 20, pageWidth - 20, currentY);
        currentY += 6.5; // Line spacing
      });
      currentY += 2; // Paragraph spacing
    }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 275, pageWidth - 20, 275); // Top footnote line

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`APRESENTADO POR: PARCEIRO WINF™ // INTELLECTUAL PROPERTY REVERSED`, 20, 282);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`© 2026 WINF Partners™ | AeroCore™ Asset Ecosystem. Todos os direitos reservados. Lei nº 9.279/96 e Lei nº 9.609/98.`, 20, 287);
    
    // Page number on the right
    doc.text(`PÁGINA ${i} DE ${pageCount}`, pageWidth - 20, 287, { align: 'right' });
  }

  const sanitizedFileName = docItem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${sanitizedFileName}.pdf`);
};

export const generateTechCatalogPDF = (partnerName: string = "WINF™ Sócio") => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(10, 11, 14);
  doc.rect(0, 0, pageWidth, 297, 'F');
  
  doc.setFillColor(16, 185, 129); // Emerald green for high accuracy spec
  doc.rect(20, 40, 4, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHA TECNICA ESPECIALIZADA', 28, 48);
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text('VALIDACAO DE ENGENHARIA WINF™ NANO-CERAMIC ELITE', 28, 54);

  doc.setDrawColor(40, 40, 40);
  doc.line(20, 65, pageWidth - 20, 65);

  let y = 80;
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TABELA DE REFRATACAO E DESEMPENHO', 20, y);
  y += 10;

  // Render tech spec table
  const specs = [
    { label: "Rejeicao de Infravermelho (950nm a 1400nm)", value: "99% IR" },
    { label: "Rejeicao Total de Energia Solar (TSER)", value: "85%" },
    { label: "Bloqueio de Raios Ultra-Violeta", value: "99.9%" },
    { label: "Fator de Transmissao de Luz Visivel (VLT)", value: "5% / 20% / 35% / 70%" },
    { label: "Fator de Protecao Solar (FPS)", value: "FPS 1000+" },
    { label: "Camada de Anti-Risco AeroTec(TM)", value: "Presente (Double-Layered)" },
    { label: "Revestimento Mineral Nano-Ceramico", value: "Certificado Alemao" }
  ];

  specs.forEach(s => {
    // Row line
    doc.setDrawColor(30, 31, 35);
    doc.line(20, y, pageWidth - 20, y);
    
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(s.label, 22, y + 6);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(s.value, pageWidth - 60, y + 6);
    
    y += 10;
  });

  y += 10;
  doc.setTextColor(110, 110, 115);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const footnotes = [
    "* Todos os testes foram aferidos em espectrometro digital sob as normas ASHRAE de radiologia solar.",
    "** A garantia vitalicia cobre descoloramento batedor ou delaminacao natural de adesao tatica."
  ];
  footnotes.forEach(fn => {
    doc.text(fn, 20, y);
    y += 5;
  });

  doc.setDrawColor(30, 31, 35);
  doc.line(20, 240, pageWidth - 20, 240);

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text(`TERRITORIO LICENCIADO HOMOLOGADO: ${partnerName.toUpperCase()}`, 20, 255);

  doc.save('WINF_Ficha_Tecnica_Ceramic_Elite.pdf');
};

