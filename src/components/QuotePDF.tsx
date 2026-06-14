import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts - using robust fallback to standard Helvetia/Courier
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuG1fAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFUfAZ9hiA.woff2', fontWeight: 900 },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
  },
  optionBlock: {
    backgroundColor: '#67717A',
    padding: 16,
    paddingLeft: 24,
    borderBottom: '2pt solid #ffffff',
  },
  optionLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -1,
  },
  trademark: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
  },
  logoW: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 900,
    marginLeft: 8,
    marginTop: 4,
  },
  infraredText: {
    color: '#ffffff',
    fontSize: 6,
    fontWeight: 700,
    marginLeft: 6,
    marginTop: 18,
  },
  exclusiveText: {
    color: '#cbd5e1',
    fontSize: 7,
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  descText: {
    color: '#ffffff',
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 12,
  },
  priceText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: 700,
  },
  iconsRow: {
    backgroundColor: '#67717A',
    padding: 10,
    borderBottom: '2pt solid #ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconText: {
    color: '#ffffff',
    fontSize: 7,
    width: 50,
    textAlign: 'center',
    fontWeight: 600,
  },
  bannerBlock: {
    backgroundColor: '#5A6C7B',
    padding: 16,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottom: '2pt solid #ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLogo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 900,
  },
  bannerRight: {
    alignItems: 'flex-end',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 1,
  },
  bannerSub: {
    color: '#86efac',
    fontSize: 12,
    fontWeight: 700,
    marginTop: 2,
  },
});

// Polyfill safe regex parser to find M2 out of measurements string safely
const parseM2 = (measureString: string) => {
  if (!measureString) return 1.0;
  const match = measureString.match(/([\d.,]+)\s*(?:m²|M2|M²|m2|)/i);
  if (match) {
    const parsed = parseFloat(match[1].replace(',', '.'));
    return isNaN(parsed) ? 1.0 : parsed;
  }
  return 1.0;
};

const QuotePDF = ({ quote, qrCodeUrl }: { quote: any, qrCodeUrl: string }) => {
  const mockM2 = parseM2(quote.measurements);
  
  const options = quote.productsList || [
    { id: 'dual-reflect', name: 'DUAL REFLECT', tagline: 'Linha Dual Reflect   arquitetura - metalizada - espelhada -\nRedução UV (ultra violeta) 99%+   bloqueio IR ( infravermelho ) 81%\nSensação térmica melhora de 80 a 100%\nGarantia 7+ anos\nMade in usa', customValue: 130 },
    { id: 'blackpro', name: 'BLACKPRO', tagline: 'Linha Fume Blackpro - arquitetura - não metalizada - fume -\nbloqueio UV (ultra violeta) 99%  bloqueio IR 73+ % ( infravermelho )\nSensação térmica melhora de de 80 a 100%\nGarantia 7+ anos\nMade in usa', customValue: 120 },
    { id: 'invisible', name: 'Invisible', tagline: 'ORIGIN W® IR ADVANCED NANO CERAMIC - INVISIBLE® & BLACK®-\nLINE - INVISIBLE - Bloqueio UV (ultra violeta) 100%   bloqueio IR 86%+\n\nSensação térmica melhora 80% A 100%\nGarantia 10 + anos\nMade in usa', customValue: 280 },
    { id: 'white-matter', name: 'WHITE MATTER', tagline: 'blasted and total white\njateada / branca / miniblind / venetian\nGarantia 10\nMade in usa', customValue: 140 }
  ];

  const taxFactor = quote.applyTax ? 1.15 : 1.0;

  // Split options exactly like the layout image if there's 4
  const mainOptions = options.slice(0, 3);
  const remainingOptions = options.slice(3);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {mainOptions.map((prod: any, idx: number) => {
          const unitPrice = prod.customValue * taxFactor;
          const itemTotal = unitPrice * mockM2;
          return (
            <View key={idx} style={styles.optionBlock}>
              <Text style={styles.optionLabel}>opção {idx + 1}</Text>
              
              <View style={styles.titleRow}>
                <Text style={styles.title}>{prod.name}</Text>
                <Text style={styles.trademark}>®</Text>
                {prod.id !== 'white-matter' && <Text style={styles.logoW}>W</Text>}
                {prod.id !== 'white-matter' && <Text style={styles.infraredText}>infrared-block®{'\n'}TECHNOLOGY</Text>}
              </View>
              
              {prod.id !== 'white-matter' && <Text style={styles.exclusiveText}>EXCLUSIVE PRODUCT WINF. INC</Text>}
              
              <Text style={styles.descText}>
                {prod.tagline || `${prod.name} de alto rendimento térmico.`}
              </Text>
              
              <Text style={styles.priceText}>VALOR = R$ {itemTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          );
        })}

        {/* Separator / Icons Area */}
        <View style={styles.iconsRow}>
          <Text style={styles.iconText}>Economia de energia em até 20%</Text>
          <Text style={styles.iconText}>Redução de temperatura</Text>
          <Text style={styles.iconText}>Bloqueio UV</Text>
          <Text style={styles.iconText}>Efeito{'\n'}espião</Text>
          <Text style={styles.iconText}>Mais{'\n'}Segurança</Text>
          <Text style={styles.iconText}>Ultra visão interna</Text>
          <Text style={[styles.iconText, { fontSize: 16, fontWeight: 900, width: 30 }]}>W™</Text>
        </View>

        {/* Banner */}
        <View style={styles.bannerBlock}>
          <Text style={styles.bannerLogo}>WINF™</Text>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerTitle}>PROPOSTA INVESTIMENTO</Text>
            <Text style={styles.bannerSub}>Feita para você</Text>
          </View>
        </View>

        {/* Remaining Options */}
        {remainingOptions.map((prod: any, idx: number) => {
          const actualIdx = idx + 3;
          const unitPrice = prod.customValue * taxFactor;
          const itemTotal = unitPrice * mockM2;
          return (
            <View key={`rem-${idx}`} style={[styles.optionBlock, { flexGrow: 1, borderBottom: 'none' }]}>
              <Text style={styles.optionLabel}>opção {actualIdx + 1}</Text>
              
              <View style={styles.titleRow}>
                <Text style={styles.title}>{prod.name}</Text>
                <Text style={styles.trademark}>®</Text>
              </View>
              
              <Text style={styles.descText}>
                {prod.tagline || 'Película de alto rendimento.'}
              </Text>
              
              <Text style={styles.priceText}>VALOR = R$ {itemTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          );
        })}

      </Page>
      
      {/* Attachments if any */}
      {quote.attachments && quote.attachments.length > 0 && (
        <Page size="A4" style={[styles.page, { backgroundColor: '#67717A', padding: 24 }]}>
          <Text style={[styles.title, { marginBottom: 20 }]}>Anexos Fotográficos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {quote.attachments.map((att: string, index: number) => (
              <Image key={index} src={att} style={{ width: 250, height: 180, marginBottom: 10, border: '2pt solid #ffffff', borderRadius: 0 }} />
            ))}
          </View>
        </Page>
      )}
    </Document>
  );
};

export default QuotePDF;

