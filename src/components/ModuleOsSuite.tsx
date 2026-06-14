import React, { useState } from 'react';
import { useWinf } from '../contexts/WinfContext';
import { motion } from 'framer-motion';
import { 
  FileText, Plus, Clock, CheckCircle, 
  Box, MapPin, Database, Car, Printer
} from 'lucide-react';

const OS_STATUS_FLOW = ['Aguardando Veiculo', 'Pelicula no Corte', 'Em Execucao', 'Inspecao Final', 'Completed'];

export const ModuleOsSuite: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const { 
    stockItems, 
    updateStock, 
    products, 
    addInstallationJob, 
    updateInstallationJob,
    installationJobs,
    addTransaction
  } = useWinf();

  // Mode: list of OS or new OS form
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingOsId, setEditingOsId] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  
  // New OS Form fields
  const [customerName, setCustomerName] = useState('');
  const [projectType, setProjectType] = useState<'Automotivo' | 'Arquitetura'>('Automotivo');
  const [projectDetails, setProjectDetails] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedStockId, setSelectedStockId] = useState('');
  const [inputMeters, setInputMeters] = useState('5.0');
  const [osPriority, setOsPriority] = useState<'Normal' | 'Alta' | 'Urgente'>('Normal');
  const [serviceValue, setServiceValue] = useState('');
  const [avariaText, setAvariaText] = useState('');
  
  // Fiscal fields
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [cep, setCep] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmitOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert('Favor preencher o nome do cliente.');
      return;
    }

    if (!projectDetails) {
      alert('Favor preencher os detalhes do projeto (Veículo ou Endereço/Ambiente).');
      return;
    }

    const metersToUse = parseFloat(inputMeters) || 0;
    
    const technicalOS = {
      customerName,
      customer_name: customerName,
      projectName: projectType === 'Automotivo' ? `Auto: ${projectDetails}` : `Arq: ${projectDetails}`,
      projectType,
      projectDetails,
      status: viewMode === 'create' ? 'Aguardando Veiculo' : (installationJobs.find(j => j.id === editingOsId)?.status || 'Aguardando Veiculo'),
      priority: osPriority,
      chosen_film: selectedProduct?.name || 'Winf Película',
      product_id: selectedProductId,
      stock_id: selectedStockId || null,
      meters: metersToUse,
      serviceValue: parseFloat(serviceValue) || 0,
      avariaText: avariaText,
      progress: 0,
      needs_invoice: needsInvoice,
      cnpj: needsInvoice ? cnpj : '',
      cep: needsInvoice ? cep : '',
      razao_social: needsInvoice ? razaoSocial : '',
    };

    if (viewMode === 'edit' && editingOsId) {
      const res = await updateInstallationJob(editingOsId, technicalOS);
      if (res.success) {
        setNotification(`OS atualizada com sucesso para ${customerName}!`);
        clearForm();
        setViewMode('list');
      }
    } else {
      const res = await addInstallationJob(technicalOS as any);
      if (res.success) {
        setNotification(`OS criada com sucesso para ${customerName}!`);
        clearForm();
        setViewMode('list');
      }
    }
  };

  const clearForm = () => {
    setCustomerName('');
    setProjectDetails('');
    setSelectedProductId('');
    setSelectedStockId('');
    setInputMeters('5.0');
    setNeedsInvoice(false);
    setServiceValue('');
    setAvariaText('');
    setCnpj('');
    setCep('');
    setRazaoSocial('');
    setEditingOsId(null);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleEditClick = (job: any) => {
    setCustomerName(job.customer_name || job.customerName || '');
    setProjectType(job.projectType || 'Automotivo');
    setProjectDetails(job.projectDetails || '');
    setSelectedProductId(job.product_id || '');
    setSelectedStockId(job.stock_id || '');
    setInputMeters(job.meters ? job.meters.toString() : '5.0');
    setOsPriority(job.priority || 'Normal');
    setServiceValue(job.serviceValue ? job.serviceValue.toString() : '');
    setAvariaText(job.avariaText || '');
    setNeedsInvoice(job.needs_invoice || false);
    setCnpj(job.cnpj || '');
    setCep(job.cep || '');
    setRazaoSocial(job.razao_social || '');
    setEditingOsId(job.id);
    setViewMode('edit');
  };

  const handleAdvanceFlowOS = async (job: any) => {
    const currentIndex = OS_STATUS_FLOW.indexOf(job.status || 'Aguardando Veiculo');
    if (currentIndex < OS_STATUS_FLOW.length - 2) {
      // Advance normally
      const nextStatus = OS_STATUS_FLOW[currentIndex + 1];
      const res = await updateInstallationJob(job.id, { status: nextStatus, progress: (currentIndex + 1) * 25 });
      if (res.success) {
        setNotification(`OS avançou para: ${nextStatus}`);
        setTimeout(() => setNotification(''), 3000);
      }
    } else {
      // It's going to complete
      handleFinalizeOS(job);
    }
  };

  const handleFinalizeOS = async (job: any) => {
    const metersToConsume = job.meters || 0;
    
    if (job.stock_id && metersToConsume > 0) {
      await updateStock(job.stock_id, metersToConsume);
    }

    if (job.serviceValue > 0) {
      await addTransaction({
        description: `Recebimento OS: ${job.customer_name || 'Cliente'} (${job.chosen_film || 'Serviço'})`,
        type: 'income',
        amount: job.serviceValue,
        category: 'Serviços',
        date: new Date().toISOString(),
        paymentMethod: 'Credit',
        status: 'pending'
      });
    }

    const res = await updateInstallationJob(job.id, { status: 'Completed', progress: 100 });
    if (res.success) {
      setNotification(`OS Finalizada! Estoque e Financeiro atualizados.`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const printOS = (job: any) => {
    // Generate a print representation
    const printContent = `
      <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px dashed black;">
        <h1 style="text-align: center; text-transform: uppercase;">Winf - Ordem de Serviço</h1>
        <hr style="border-top: 1px dashed black;" />
        <p><strong>CLIENTE:</strong> ${job.customer_name}</p>
        <p><strong>PROJETO:</strong> ${job.projectName}</p>
        <p><strong>PELÍCULA:</strong> ${job.chosen_film} (${job.meters}m)</p>
        <p><strong>VALOR APROVADO:</strong> R$ ${(job.serviceValue || 0).toFixed(2)}</p>
        <hr style="border-top: 1px dashed black;" />
        <h3>FICHA DE VISTORIA PRÉ-SERVIÇO:</h3>
        <p style="white-space: pre-wrap;">${job.avariaText || 'Nenhuma avaria relatada.'}</p>
        <hr style="border-top: 1px dashed black;" />
        <p style="text-align: center;">Colar via no Capô / Prancheta de Execução</p>
      </div>
    `;
    const newWindow = window.open('', '', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(printContent);
      newWindow.document.close();
      newWindow.focus();
      setTimeout(() => { newWindow.print(); newWindow.close(); }, 250);
    }
  };

  return (
    <div className="animate-fade-in pb-12 w-full text-zinc-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#444746] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-medium tracking-wide text-white/60 mb-3 rounded-none">
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-none animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            Sistema Ativo
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-2">Winf™ | OS Industrial</h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {viewMode === 'list' ? (
            <button 
              onClick={() => {
                clearForm();
                setViewMode('create');
              }}
              className="w-full md:w-auto px-5 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-none hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} strokeWidth={2.5} /> Nova Ordem de Serviço
            </button>
          ) : (
            <button 
              onClick={() => setViewMode('list')}
              className="w-full md:w-auto px-5 py-3 bg-[#1e1f20] border border-[#444746] text-white font-extrabold text-xs uppercase tracking-wider rounded-none hover:bg-[#282a2c] transition-all flex items-center justify-center gap-2"
            >
              Listar Ordens de Serviço
            </button>
          )}
        </div>
      </div>

      {notification && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 p-4 mb-6 rounded-none font-medium text-sm flex items-center gap-3">
          <CheckCircle size={18} className="text-zinc-500" />
          <span>{notification}</span>
        </motion.div>
      )}

      <div className="w-full max-w-4xl mx-auto">
        {viewMode === 'create' || viewMode === 'edit' ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-[#131314] border border-[#444746] p-6 md:p-8 space-y-8 rounded-none"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-[#444746]">
              <div className="p-2 bg-[#1e1f20] border border-[#444746] rounded-none">
                <FileText size={20} className="text-zinc-300" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white">
                {viewMode === 'create' ? 'Abertura de Ordem de Serviço' : 'Edição de Ordem de Serviço'}
              </h2>
            </div>

            <form onSubmit={handleSubmitOS} className="space-y-6">
              
              {/* Type Picker */}
              <div className="flex bg-[#1e1f20] p-1.5 rounded-none border border-[#444746]">
                <button 
                  type="button" 
                  onClick={() => setProjectType('Automotivo')}
                  className={`flex-1 py-3 text-xs uppercase tracking-wider font-extrabold transition-all rounded-none flex items-center justify-center gap-2 ${projectType === 'Automotivo' ? 'bg-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Car size={16} /> Automotivo
                </button>
                <button 
                  type="button" 
                  onClick={() => setProjectType('Arquitetura')}
                  className={`flex-1 py-3 text-xs uppercase tracking-wider font-extrabold transition-all rounded-none flex items-center justify-center gap-2 ${projectType === 'Arquitetura' ? 'bg-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Box size={16} /> Arquitetura
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Nome do Cliente</label>
                  <input 
                    type="text" 
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome completo ou Razão Social"
                    className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors placeholder:text-zinc-700 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">
                    {projectType === 'Automotivo' ? 'Veículo / Placa' : 'Endereço / Ambiente'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder={projectType === 'Automotivo' ? 'Ex: Corolla Preto - ABC1234' : 'Ex: Salas 101 a 105 - Comercial'}
                    className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors placeholder:text-zinc-700 outline-none"
                  />
                </div>
              </div>

              {/* Material Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Película a ser Aplicada</label>
                  <select 
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                    className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors outline-none appearance-none"
                  >
                    <option value="">Selecione o material...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Bobina / Lote (Opcional)</label>
                  <select 
                    value={selectedStockId}
                    onChange={(e) => setSelectedStockId(e.target.value)}
                    className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Selecione a bobina de origem...</option>
                    {stockItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.product_name} — ({(item.remaining_meters || 0).toFixed(1)}m disponíveis)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Quantidade Empregada (Metros)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={inputMeters}
                    onChange={(e) => setInputMeters(e.target.value)}
                    className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Valor Final Cobrado (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={serviceValue}
                    onChange={(e) => setServiceValue(e.target.value)}
                    className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors outline-none"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Prioridade</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#1e1f20] p-1.5 rounded-none border border-[#444746] h-[54px]">
                    {['Normal', 'Alta', 'Urgente'].map(prio => (
                      <button
                        key={prio}
                        type="button"
                        onClick={() => setOsPriority(prio as any)}
                        className={`py-1 text-[10px] sm:text-xs uppercase tracking-wider transition-all font-bold rounded-none ${
                          osPriority === prio 
                            ? 'bg-zinc-700 text-white shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {prio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Checklist de Vistoria / Avarias Prévias</label>
                  <textarea 
                    value={avariaText}
                    onChange={(e) => setAvariaText(e.target.value)}
                    placeholder="Ex: Risco na porta do motorista, bolha de sol no vigia traseiro..."
                    className="w-full h-24 bg-[#131314] border border-[#444746] text-white text-sm p-4 rounded-none focus:border-zinc-500 hover:border-zinc-700 transition-colors outline-none resize-none"
                  />
                </div>
              </div>

              {/* Fiscal Session Toggle */}
              <div className="bg-[#1e1f20]/60 border border-[#444746] rounded-none p-5 space-y-4 font-sans text-left">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={needsInvoice}
                    onChange={(e) => setNeedsInvoice(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 border-[#444746] bg-[#131314] rounded-none focus:ring-0 focus:outline-none cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Requer Nota Fiscal (NF-e)</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Fornecer dados CNPJ, Razão Social e CEP para identificação do caixa</p>
                  </div>
                </label>

                {needsInvoice && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-3 border-t border-[#444746]/50 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">Razão Social / Nome Fiscal</label>
                      <input 
                        type="text"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        placeholder="Nome social corporativo ou de faturamento"
                        className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-3.5 rounded-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 outline-none"
                        required={needsInvoice}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">CNPJ / CPF</label>
                        <input 
                          type="text"
                          value={cnpj}
                          onChange={(e) => setCnpj(e.target.value)}
                          placeholder="00.000.000/0001-00"
                          className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-3.5 rounded-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 outline-none"
                          required={needsInvoice}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-medium tracking-wide text-zinc-500 block">CEP</label>
                        <input 
                          type="text"
                          value={cep}
                          onChange={(e) => setCep(e.target.value)}
                          placeholder="00000-000"
                          className="w-full bg-[#131314] border border-[#444746] text-white text-sm p-3.5 rounded-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700 outline-none"
                          required={needsInvoice}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="pt-4 border-t border-[#444746]">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-none hover:bg-zinc-200 transition-all text-center"
                >
                  {viewMode === 'create' ? 'Salvar Ordem de Serviço' : 'Atualizar Ordem de Serviço'}
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#131314] border border-[#444746] p-6 rounded-none">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#444746]">
                <h3 className="text-xs uppercase tracking-widest font-black text-zinc-400 flex items-center gap-2">
                  <Clock size={16} /> Ordens de Serviço Ativas
                </h3>
                <div className="text-[10px] text-zinc-500 font-medium px-3 py-1 bg-[#1e1f20] rounded-none border border-[#444746]">
                  {installationJobs?.length || 0} Registros
                </div>
              </div>

              {installationJobs?.length === 0 ? (
                <div className="text-center py-16 px-4 border border-dashed border-[#444746] rounded-none">
                  <FileText size={32} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-300 text-sm font-medium">Nenhuma Ordem de Serviço registrada</p>
                  <p className="text-xs text-zinc-500 mt-2">Clique em "Nova Ordem de Serviço" para abrir o primeiro chamado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {installationJobs?.map((job: any) => {
                    const isCompleted = job.status === 'Completed' || job.status === 'completed';
                    return (
                      <div 
                        key={job.id} 
                        className="bg-[#1e1f20] border border-[#444746] p-5 rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-zinc-600 transition-all"
                      >
                        <div className="space-y-2 flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="font-bold text-base text-zinc-100">
                              {job.customer_name || job.customerName}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none w-fit ${job.priority === 'Urgente' || job.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : job.priority === 'Alta' || job.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-transparent border border-zinc-700 text-zinc-400'}`}>
                                Prio: {job.priority || 'Normal'}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none w-fit bg-zinc-800 text-zinc-300 border border-zinc-700">
                                R$ {job.serviceValue ? Number(job.serviceValue).toFixed(2) : '0.00'}
                              </span>
                              
                              {job.needs_invoice && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-none bg-orange-500/15 text-orange-400 border border-orange-500/20 shadow-sm animate-pulse">
                                  NF-e Requerida
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                              {job.projectType === 'Automotivo' ? <Car size={12} /> : <MapPin size={12} />}
                              {job.projectName || job.projectDetails}
                            </span>

                            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                              <Database size={12} /> {job.chosen_film || 'Película Padrão'} ({job.meters || 0}m)
                            </span>
                          </div>

                          {job.needs_invoice && (
                            <div className="mt-2.5 p-3.5 bg-orange-500/5 rounded-none border border-orange-500/10 text-[11px] space-y-1 text-left font-mono">
                              <p className="text-zinc-500"><span className="uppercase text-[9px] tracking-wider">Razão Social:</span> <strong className="text-zinc-200">{job.razao_social || job.customer_name || job.customerName}</strong></p>
                              <div className="flex flex-wrap gap-x-5">
                                <p className="text-zinc-500"><span className="uppercase text-[9px] tracking-wider">CNPJ/CPF:</span> <strong className="text-zinc-200">{job.cnpj || 'Não fornecido'}</strong></p>
                                <p className="text-zinc-500"><span className="uppercase text-[9px] tracking-wider">CEP:</span> <strong className="text-zinc-200">{job.cep || 'Não fornecido'}</strong></p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col md:items-end gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0 border-t border-[#444746] md:border-none pt-4 md:pt-0">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none text-center ${isCompleted ? 'bg-zinc-500/10 text-zinc-400' : 'bg-winf-primary/10 text-winf-primary border border-winf-primary/20'}`}>
                            {job.status || 'Aguardando Veiculo'}
                          </span>

                          <div className="flex flex-wrap items-center justify-end gap-2 w-full">
                            <button
                              onClick={() => printOS(job)}
                              className="p-2 bg-[#1e1f20] text-zinc-400 border border-[#444746] rounded-none hover:bg-zinc-800 hover:text-white transition-colors"
                              title="Imprimir Ordem de Serviço"
                            >
                              <Printer size={14} />
                            </button>

                            {!isCompleted && (
                              <>
                                <button
                                  onClick={() => handleEditClick(job)}
                                  className="px-4 py-2 bg-zinc-800 text-white border border-zinc-700 text-[10px] font-black uppercase tracking-wider rounded-none hover:bg-zinc-700 transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleAdvanceFlowOS(job)}
                                  className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-wider rounded-none hover:bg-zinc-200 transition-colors"
                                >
                                  Avançar Fluxo
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleOsSuite;