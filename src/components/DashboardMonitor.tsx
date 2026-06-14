import React from 'react';

interface DashboardMonitorProps {
  osData: {
    techEngine: {
      aproveitamento: string;
    };
    businessCore: {
      valorLastreado: number;
    };
    ledgerHash: string;
  };
}

const DashboardMonitor: React.FC<DashboardMonitorProps> = ({ osData }) => {
  return (
    <div className="winf-card border-l-4 border-[#00ff41] p-6 bg-gray-950 rounded-none shadow-xl" id="dashboard-monitor">
      <h3 className="text-xl font-bold text-white mb-6 tracking-tight">MONITOR DE CONVERSÃO INDUSTRIAL</h3>

      <div className="monitor-grid grid grid-cols-2 gap-6 mb-6">
        <div className="kpi flex flex-col items-start bg-gray-900 p-4 rounded-none">
          <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">EFICIÊNCIA DE CORTE:</span>
          <strong className="text-[#00ff41] text-3xl font-mono">{osData.techEngine.aproveitamento}</strong>
        </div>
        <div className="kpi flex flex-col items-start bg-gray-900 p-4 rounded-none">
          <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">LASTRO GERADO:</span>
          <strong className="text-white text-3xl font-mono">R$ {osData.businessCore.valorLastreado.toFixed(2)}</strong>
        </div>
      </div>

      <div className="status-ledger mb-6">
        <small className="block text-gray-500 text-xs mb-2 uppercase tracking-wider">HASH DE AUDITORIA:</small>
        <code className="text-[0.65rem] break-all bg-gray-900 p-3 rounded-none text-gray-300 font-mono border border-gray-800">
          {osData.ledgerHash}
        </code>
      </div>
      
      <button
        className="winf-btn w-full bg-[#00ff41] text-black font-bold py-3 px-4 rounded-none hover:bg-[#00cc35] transition-all duration-200 uppercase tracking-wider font-mono text-sm"
        onClick={() => console.log('Auditando...')}
      >
        AUDITAR LASTRO
      </button>
    </div>
  );
};

export default DashboardMonitor;
