import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Printer } from 'lucide-react';
import QuotePDF from './QuotePDF';

interface PDFSectionProps {
  selectedQuote: any;
  qrCodeUrl: string;
}

const PDFSection: React.FC<PDFSectionProps> = ({ selectedQuote, qrCodeUrl }) => {
  if (!selectedQuote) {
    return (
      <button className="flex-grow w-full bg-[#1e1f20] text-white/40 py-4 rounded-none font-bold uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 border border-[#444746] shadow-md cursor-not-allowed">
        <Printer size={16}/> Baixar PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink 
        document={<QuotePDF quote={selectedQuote} qrCodeUrl={qrCodeUrl} />} 
        fileName={`WINF_Proposta_${(selectedQuote.customerName || 'Cliente').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
        className="flex-grow w-full bg-[#1e1f20] text-white py-4 rounded-none font-bold uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 border border-[#444746] hover:bg-[#282a2c] transition-all shadow-md text-decoration-none focus:outline-none focus:ring-0"
    >
        {({ loading }) => (
            <><Printer size={16}/> {loading ? 'Gerando...' : 'Baixar PDF'}</>
        )}
    </PDFDownloadLink>
  );
};

export default PDFSection;
