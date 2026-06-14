import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWinf } from '../contexts/WinfContext';
import { WINF_LOCAL_UNITS } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  QrCode, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  X, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Award,
  Clock,
  CheckCircle2,
  DollarSign,
  Share2,
  Phone,
  Printer,
  Bell,
  MessageSquare,
  CalendarDays,
  List,
  Zap,
  Target
} from 'lucide-react';

const ModuleInstallations: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const { installations, products, user, registerInstallation, installationJobs, updateInstallationJob, completeJobAndGenerateWarranty, quotes, addInstallationJob, addTransaction, updateUserCoins } = useWinf();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'agenda' | 'history' | 'network_demands'>('agenda');
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('weekly');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro' | 'Faturamento pós-NF-e'>('Pix');
  
  const [completeRazaoSocial, setCompleteRazaoSocial] = useState('');
  const [completeCnpj, setCompleteCnpj] = useState('');
  const [completeCep, setCompleteCep] = useState('');

  useEffect(() => {
    if (selectedJob) {
      setCompleteRazaoSocial(selectedJob.razao_social || selectedJob.customer_name || '');
      setCompleteCnpj(selectedJob.cnpj || '');
      setCompleteCep(selectedJob.cep || '');
    } else {
      setCompleteRazaoSocial('');
      setCompleteCnpj('');
      setCompleteCep('');
    }
  }, [selectedJob]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({ enabled: true, leadTime: 24 });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualOSModal, setShowManualOSModal] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [thunderMode, setThunderMode] = useState(false);
  const [scheduleData, setScheduleData] = useState({ quoteId: '', scheduledDate: '' });
  const [manualOSData, setManualOSData] = useState({
    customerName: '',
    customerWhatsApp: '',
    chosenFilm: '',
    vehicleModel: '',
    totalAmount: '',
    scheduledDate: '',
    customerAddress: '',
    needsInvoice: false,
    cnpj: '',
    cep: '',
    razaoSocial: '',
    unit: 'Matriz São Paulo',
  });
  
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedJobId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedJobId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDayIndex: number) => {
    e.preventDefault();
    if (!draggedJobId) return;
    const job = installationJobs.find(j => j.id === draggedJobId);
    if (job) {
      if (targetDayIndex === -1) {
          await updateInstallationJob(job.id, { scheduled_date: '' });
      } else {
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
        const mondayDate = new Date(today);
        mondayDate.setDate(today.getDate() + diffToMonday);
        
        const targetDate = new Date(mondayDate);
        targetDate.setDate(mondayDate.getDate() + targetDayIndex);
        
        await updateInstallationJob(job.id, { scheduled_date: targetDate.toISOString() });
      }
    }
    setDraggedJobId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleManualOSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOSData.customerName || !manualOSData.chosenFilm || !manualOSData.scheduledDate) {
      alert("Preencha os campos obrigatórios (Cliente, Película, Data).");
      return;
    }
    setLoading(true);
    const jobData = {
      service_order_id: `OS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: manualOSData.customerName,
      customer_whatsapp: manualOSData.customerWhatsApp || '',
      customer_address: manualOSData.customerAddress || '',
      customer_city: '',
      chosen_film: manualOSData.chosenFilm,
      vehicle_model: manualOSData.vehicleModel || 'Manual',
      total_amount: parseFloat(manualOSData.totalAmount) || 0,
      scheduled_date: manualOSData.scheduledDate,
      collaborator_id: user?.id,
      needs_invoice: manualOSData.needsInvoice,
      cnpj: manualOSData.needsInvoice ? manualOSData.cnpj : '',
      cep: manualOSData.needsInvoice ? manualOSData.cep : '',
      razao_social: manualOSData.needsInvoice ? manualOSData.razaoSocial : '',
      unit: manualOSData.unit || 'Matriz São Paulo',
    };
    await addInstallationJob(jobData);
    setShowManualOSModal(false);
    setManualOSData({
      customerName: '', customerWhatsApp: '', chosenFilm: '', vehicleModel: '', totalAmount: '', scheduledDate: '', customerAddress: '',
      needsInvoice: false, cnpj: '', cep: '', razaoSocial: '', unit: 'Matriz São Paulo'
    });
    alert("OS Manual criada com sucesso!");
    setLoading(false);
  };

  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const currentWeekDates = useMemo(() => {
    const dates: { day: string, dateStr: string, index: number }[] = [];
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() + diffToMonday);

    for (let i = 0; i < 6; i++) {
      const targetDate = new Date(mondayDate);
      targetDate.setDate(mondayDate.getDate() + i);
      const dateFormatted = targetDate.getDate().toString().padStart(2, '0');
      dates.push({
        day: daysOfWeek[i],
        dateStr: dateFormatted,
        index: i
      });
    }
    return dates;
  }, []);

  const unscheduledJobs = useMemo(() => {
    return installationJobs.filter(job => (!job.scheduled_date || job.scheduled_date === '') && job.status !== 'completed');
  }, [installationJobs]);

  const getDayJobs = (dayIndex: number) => {
    // 0 = Segunda, 1 = Terça, ..., 5 = Sábado
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return installationJobs.filter(job => {
      if (!job.scheduled_date || job.status === 'completed') return false;
      const jobDate = new Date(job.scheduled_date);
      // getDay() returns 0 for Sunday, 1 for Monday...
      // We want to map 1 -> 0 (Seg), 2 -> 1 (Ter)... 6 -> 5 (Sab)
      const day = jobDate.getDay();
      const adjustedDay = day === 0 ? -1 : day - 1; // Ignore Sunday
      return adjustedDay === dayIndex;
    });
  };

  const notifications = [
    { id: '1', type: 'interest', member: 'João Silva', project: 'Residencial Alphaville', time: '10 min atrás' },
    { id: '2', type: 'assignment', member: 'Carlos Tech', project: 'BMW X5 - AeroCore', time: '1 hora atrás' },
    { id: '3', type: 'update', member: 'Ana Arquiteta', project: 'Escritório Central', time: '2 horas atrás' },
  ];

  const filteredJobs = installationJobs.filter(job => 
    job.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.service_order_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const networkJobs = filteredJobs.filter(job => job.status === 'network_routing');

  const handleAcceptNetworkDemand = async (jobId: string) => {
    setLoading(true);
    await updateInstallationJob(jobId, { status: 'pending', collaborator_id: user?.id || 'installer' });
    alert("Demanda aceita com sucesso! A OS agora está na sua Agenda.");
    setActiveTab('agenda');
    setLoading(false);
  };
  const [photosAttached, setPhotosAttached] = useState<string[]>([]);
  const [clientSignature, setClientSignature] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotosAttached([...photosAttached, `photo_${Date.now()}.jpg`]);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!clientSignature) {
      alert("É necessária a assinatura (ou nome) do cliente para concluir a OS.");
      return;
    }
    if (photosAttached.length === 0) {
      alert("É obrigatório anexar pelo menos 1 foto do serviço concluído para o laudo de garantia.");
      return;
    }
    
    // Check invoice details validation if "Faturamento pós-NF-e" is chosen
    const isPostNfe = paymentMethod === 'Faturamento pós-NF-e';
    if (isPostNfe) {
      if (!completeRazaoSocial.trim() || !completeCnpj.trim()) {
        alert("Para a modalidade de Faturamento pós-NF-e, é obrigatório preencher a Razão Social e o CNPJ do faturamento.");
        return;
      }
    }

    setLoading(true);
    if (vehiclePlate) {
      await updateInstallationJob(jobId, { vehicle_plate: vehiclePlate });
    }
    const result = await completeJobAndGenerateWarranty(jobId);
    if (result.success) {
      const job = installationJobs.find(j => j.id === jobId);
      const jobUnit = job?.unit || 'Matriz São Paulo';

      // Update payment method, logistics and billing details
      await updateInstallationJob(jobId, { 
        payment_method: paymentMethod, 
        client_signature: clientSignature,
        photos_count: photosAttached.length,
        needs_invoice: isPostNfe ? true : undefined,
        razao_social: isPostNfe ? completeRazaoSocial : undefined,
        cnpj: isPostNfe ? completeCnpj : undefined,
        cep: isPostNfe ? completeCep : undefined,
        unit: jobUnit
      });
      
      if (job) {
          await addTransaction({
              type: 'income',
              amount: job.total_amount || 0,
              description: `Serviço (OS: ${job.service_order_id}) - ${job.customer_name}`,
              category: 'Aplicação',
              paymentMethod: paymentMethod,
              status: isPostNfe ? 'pending_billing' : 'completed', // pending billing clearance
              date: new Date().toISOString(),
              razao_social: isPostNfe ? completeRazaoSocial : undefined,
              cnpj: isPostNfe ? completeCnpj : undefined,
              cep: isPostNfe ? completeCep : undefined,
              needs_invoice: isPostNfe ? true : undefined,
              service_order_id: job.service_order_id,
              unit: jobUnit
          });
      }

      setSelectedJob(null);
      setClientSignature('');
      setPhotosAttached([]);
      setVehiclePlate('');
      alert(isPostNfe 
        ? "Garantia Registrada! Serviço concluído com sucesso. A OS foi encaminhada à Fila de Emissão de Nota Fiscal no Módulo Financeiro."
        : "Garantia Registrada! Serviço concluído, valor lançado no Caixa e recibo disponível.");
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const shareReceipt = (job: any) => {
    const text = `*RECIBO WINF™*\n\nOlá ${job.customer_name},\nSeu serviço foi concluído com sucesso!\n\n*OS:* ${job.service_order_id}\n*Produto:* ${job.chosen_film}\n*Valor:* R$ ${job.total_amount?.toLocaleString('pt-BR')}\n*Pagamento:* ${job.payment_method || 'Confirmado'}\n\n*Garantia:* ${job.warranty_id}\n\nObrigado por escolher Winf!`;
    const phoneSegment = job.customer_whatsapp ? `wa.me/${job.customer_whatsapp.replace(/\D/g, '')}` : `api.whatsapp.com/send`;
    const url = `https://${phoneSegment}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleNotifyDelay = (job: any) => {
    const text = `Olá ${job.customer_name}, aqui é da Winf! Gostaria de avisar que nosso técnico está finalizando um atendimento e chegará em breve para realizar seu serviço. Agradecemos imensamente a compreensão!`;
    const phoneSegment = job.customer_whatsapp ? `wa.me/${job.customer_whatsapp.replace(/\D/g, '')}` : `api.whatsapp.com/send`;
    const url = `https://${phoneSegment}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleReschedule = async (jobId: string, newDate: string) => {
    if (!newDate) return;
    const confirmMsg = "Deseja realmente reagendar este serviço?";
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    const res = await updateInstallationJob(jobId, { scheduled_date: newDate });
    if (res.success) {
      alert("Serviço reagendado com sucesso!");
    } else {
      alert("Erro ao reagendar.");
    }
    setLoading(false);
  };

  const handleScheduleService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.quoteId || !scheduleData.scheduledDate) {
      alert("Selecione um orçamento e a data.");
      return;
    }
    setLoading(true);
    const selectedQuote = quotes.find(q => q.id === scheduleData.quoteId);
    if (selectedQuote) {
      const jobData = {
        service_order_id: `OS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_name: selectedQuote.customerName,
        customer_whatsapp: selectedQuote.customerWhatsApp || '',
        customer_address: selectedQuote.customerAddress || '',
        customer_city: selectedQuote.customerCity || '',
        chosen_film: selectedQuote.items.map(i => i.description).join(', '),
        vehicle_model: selectedQuote.vehicleModel || selectedQuote.projectType || 'Residencial',
        total_amount: selectedQuote.totalAmount,
        scheduled_date: scheduleData.scheduledDate,
        collaborator_id: user?.id,
      };
      await addInstallationJob(jobData);
      setShowScheduleModal(false);
      setScheduleData({ quoteId: '', scheduledDate: '' });
      alert("Serviço agendado com sucesso!");
    } else {
      alert("Orçamento não encontrado.");
    }
    setLoading(false);
  };

  const handleNotifySchedule = (job: any) => {
    const text = `*CONFIRMAÇÃO DE AGENDAMENTO WINF™*\n\nOlá ${job.customer_name},\nConfirmando seu serviço agendado para o dia *${new Date(job.scheduled_date).toLocaleDateString('pt-BR')}*.\n\n*Serviço:* ${job.chosen_film}\n*Modelo:* ${job.vehicle_model || 'Não especificado'}\n\nNosso técnico chegará no horário previsto. Caso precise reagendar, por favor nos avise.\n\nObrigado por escolher Winf!`;
    const phone = job.customer_whatsapp?.replace(/\D/g, '') || '';
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-2 animate-fade-in pb-12 w-full text-white">
        {/* Header - Banking Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#444746] pb-4">
            <div className="space-y-4">
                <div>
                   <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Winf™ | OS</h1>
                </div>
            </div>
            
            <div className="w-full md:w-auto flex justify-end">
                <div className="flex bg-zinc-950 p-1 rounded-none border border-[#444746] w-full md:w-auto justify-between md:justify-start gap-1">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative px-3 py-1.5 text-xs font-bold transition-all ${showNotifications ? 'text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    <Bell size={13} />
                    <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-white rounded-none"></span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('network_demands')}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-none text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium transition-all text-center ${activeTab === 'network_demands' ? 'bg-[#0284C7] text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    DEMANDAS DE REDE (Arq)
                  </button>
                  <button 
                    onClick={() => setActiveTab('agenda')}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-none text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium transition-all text-center ${activeTab === 'agenda' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    Winf™ | Agenda & Ordem de Serviço
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-none text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium transition-all text-center ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                  >
                    HISTÓRICO OS
                  </button>
                </div>
            </div>
        </div>

      {showNotifications && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#131314] border border-[#444746] rounded-none p-5 mb-6 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
              <Bell size={13} className="text-zinc-400" /> Central de Notificações
            </h3>
            <button onClick={() => setShowNotifications(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#444746]">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Alertas Prévios</h4>
              <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-none border border-[#444746]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-none flex items-center justify-center transition-all ${notificationConfig.enabled ? 'bg-white/10 text-white' : 'bg-zinc-900 text-zinc-600'}`}>
                    <Bell size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Equipes de Campo</p>
                    <p className="text-[10px] text-zinc-500">Alertar antes do início</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationConfig({...notificationConfig, enabled: !notificationConfig.enabled})}
                  className={`w-10 h-5 rounded-none transition-all relative ${notificationConfig.enabled ? 'bg-white' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-none transition-all ${notificationConfig.enabled ? 'right-0.5 bg-[#131314]' : 'left-0.5 bg-zinc-500'}`}></div>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tempo de Antecedência</h4>
              <div className="flex gap-2">
                {[24, 48].map(hours => (
                  <button 
                    key={hours}
                    onClick={() => setNotificationConfig({...notificationConfig, leadTime: hours})}
                    className={`flex-1 py-2.5 rounded-none text-xs font-medium transition-all border ${notificationConfig.leadTime === hours ? 'bg-white text-black border-white' : 'bg-zinc-950/60 text-zinc-400 border-[#444746] hover:border-[#444746]'}`}
                  >
                    {hours} HORAS
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Atividades Recentes</h4>
            {notifications.map(n => (
              <div key={n.id} className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-none border border-[#444746] hover:border-[#444746] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center text-zinc-400">
                    {n.type === 'interest' ? <MessageSquare size={14} /> : <User size={14} />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">
                      {n.type === 'interest' ? `${n.member} demonstrou interesse em ${n.project}` : 
                       n.type === 'assignment' ? `Nova OS atribuída para ${n.member}` :
                       `${n.member} atualizou status`}
                    </p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">{n.time}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white text-zinc-300 hover:text-black text-[9px] font-bold px-2.5 py-1 rounded-none uppercase transition-all">Ver</button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'agenda' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> Fluxo de Trabalho
                <button onClick={() => setThunderMode(!thunderMode)} className={`ml-2 p-1 border border-transparent rounded-none transition-all ${thunderMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-transparent text-zinc-600 hover:text-orange-400'}`}>
                  <Zap size={14} className={thunderMode ? 'fill-current' : ''} />
                </button>
              </h2>
              <div className="grid grid-cols-4 gap-2 w-full lg:w-auto">
                <button 
                  onClick={() => setShowManualOSModal(true)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-none border border-[#444746] bg-transparent hover:bg-white/5 transition-all text-zinc-400 hover:text-white w-full lg:w-28"
                >
                  <Plus size={18} />
                  <span className="text-[9px] uppercase tracking-widest font-semibold">Nova OS</span>
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-none border border-[#444746] bg-transparent hover:bg-white/5 transition-all text-zinc-400 hover:text-white w-full lg:w-28"
                >
                  <FileText size={18} />
                  <span className="text-[9px] uppercase tracking-widest font-semibold">Vincular</span>
                </button>
                <button 
                  onClick={() => setViewMode('weekly')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-none border transition-all w-full lg:w-28 ${viewMode === 'weekly' ? 'border-white text-white bg-white/5' : 'border-[#444746] text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  <CalendarDays size={18} />
                  <span className="text-[9px] uppercase tracking-widest font-semibold">Semanal</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-none border transition-all w-full lg:w-28 ${viewMode === 'list' ? 'border-white text-white bg-white/5' : 'border-[#444746] text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  <List size={18} />
                  <span className="text-[9px] uppercase tracking-widest font-semibold">Lista</span>
                </button>
              </div>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar OS ou Cliente..."
                className="w-full bg-zinc-950/60 border border-[#444746] rounded-none py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-650 focus:border-[#444746] outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.filter(j => j.status !== 'completed').map((job) => (
                <motion.div
                  key={job.id}
                  layoutId={job.id}
                  className="bg-zinc-950/45 border border-[#444746] rounded-none p-5 space-y-4 hover:border-[#444746] transition-all cursor-pointer group"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-center">
                    <span className="bg-white/5 border border-[#444746] text-[9px] font-mono text-zinc-400 px-2 py-0.5 rounded-none uppercase tracking-wide flex items-center gap-1.5">
                      {job.service_order_id}
                      {job.needs_invoice && (
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-none animate-pulse"></span>
                      )}
                    </span>
                    <div className="flex gap-1.5">
                      {job.needs_invoice && (
                        <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-none bg-orange-500/15 text-orange-400 border border-orange-500/20">
                          NF-e
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase px-2 py-0.5 rounded-none ${job.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-zinc-900 text-zinc-400 border border-[#444746]'}`}>
                        <span className={`w-1 h-1 rounded-none ${job.status === 'in_progress' ? 'bg-blue-400 animate-pulse' : 'bg-zinc-500'}`}></span>
                        {job.status === 'in_progress' ? 'Executando' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-zinc-350 transition-colors">{job.customer_name}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {job.customer_city || 'Não informado'}
                    </p>
                  </div>

                  <div className="bg-zinc-900/30 rounded-none p-3.5 border border-[#444746] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Material:</span>
                      <span className="text-zinc-300 font-medium">{job.chosen_film}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Agendamento:</span>
                      <span className="text-zinc-300">{new Date(job.scheduled_date || '').toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <button className="w-full bg-white/5 hover:bg-white text-zinc-300 hover:text-black py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-all">
                    Ver Detalhes da OS
                  </button>
                </motion.div>
              ))}
              {filteredJobs.filter(j => j.status !== 'completed').length === 0 && (
                <div className="col-span-full py-16 text-center border border-dashed border-[#444746] bg-zinc-950/30 rounded-none flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-none bg-zinc-900/60 border border-[#444746] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium text-xs uppercase tracking-widest">Nenhuma OS agendada</p>
                    <p className="text-zinc-500 text-[10px] max-w-xs mx-auto">Não há ordens de serviço pendentes no momento.</p>
                  </div>
                  <button 
                    onClick={() => setShowManualOSModal(true)}
                    className="text-zinc-300 text-[10px] font-semibold uppercase tracking-wider hover:text-white transition-colors"
                  >
                    + Criar OS Manual
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-3.5 pb-2 md:pb-0">
                {currentWeekDates.map(({ day, dateStr, index }) => {
                  const dayJobs = getDayJobs(index);
                  const hasJobs = dayJobs.length > 0;
                  
                  let borderColor = "border-[#444746] hover:border-zinc-500";
                  let textColor = "text-zinc-300";
                  let statusColor = "text-zinc-400";
                  let bgColor = "bg-[#1e1f20] hover:bg-[#252627]";
                  
                  if (hasJobs) {
                      if (thunderMode) {
                          borderColor = "border-orange-500/50 hover:border-orange-400";
                          textColor = "text-orange-400";
                          statusColor = "text-orange-400";
                          bgColor = "bg-orange-500/5 hover:bg-orange-500/10";
                      } else {
                          borderColor = "border-emerald-500/50 hover:border-emerald-400";
                          textColor = "text-emerald-400";
                          statusColor = "text-emerald-400";
                          bgColor = "bg-emerald-500/5 hover:bg-emerald-500/10";
                      }
                  }

                  return (
                    <div key={day} className="space-y-3 w-full">
                      <div 
                        className={`flex flex-col items-center justify-center p-4 cursor-pointer rounded-none border transition-all shadow-sm h-full list-none ${bgColor} ${borderColor}`}
                        onClick={() => setSelectedDayIndex(index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <span className={`${textColor} text-base md:text-lg uppercase tracking-[0.2em] font-black mb-1 pointer-events-none transition-colors`}>{day}</span>
                        <span className="text-3xl sm:text-4xl font-extralight text-white tracking-tighter pointer-events-none">{dateStr}</span>
                        <div className={`mt-4 pt-3 border-t w-full text-center pointer-events-none transition-colors ${hasJobs ? (thunderMode ? 'border-orange-500/20' : 'border-emerald-500/20') : 'border-[#444746]'}`}>
                          <span className={`text-[9px] font-medium uppercase tracking-widest transition-colors ${statusColor}`}>
                            {dayJobs.length === 0 ? 'Livre' : `${dayJobs.length} Serviço${dayJobs.length !== 1 ? 's' : ''}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unscheduled OS Area */}
              <div 
                className="p-4 bg-zinc-950 rounded-none border border-dashed border-[#444746] min-h-[140px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, -1)}
              >
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock size={12} /> Serviços Não Agendados (Arraste para os dias)
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {unscheduledJobs.length === 0 && (
                    <div className="w-full text-center py-6 text-zinc-600 text-xs font-mono uppercase tracking-widest">
                      Todos os serviços estão agendados.
                    </div>
                  )}
                  {unscheduledJobs.map(job => (
                    <motion.div 
                      key={job.id}
                      whileHover={{ scale: 1.02 }}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, job.id as string)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedJob(job)}
                      className={`min-w-[220px] max-w-[220px] p-3 bg-[#1e1f20] border border-[#444746] rounded-none cursor-pointer hover:border-zinc-500 transition-all ${draggedJobId === job.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-mono text-zinc-500">{job.service_order_id}</span>
                      </div>
                      <h4 className="text-sm font-light text-white truncate">{job.customer_name}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{job.chosen_film}</p>
                      <div className="mt-2 text-xs font-bold text-zinc-400">R$ {job.total_amount?.toLocaleString('pt-BR')}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'network_demands' && (
        <div className="space-y-6">
          <div className="bg-[#111113] border border-[#0284C7]/30 p-6">
            <h2 className="text-[10px] font-bold text-[#0284C7] uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <Zap size={14} /> Fila de Roteamento (Asset Light)
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Oportunidades de instalação roteadas por Arquitetos e Especificadores. Aceite as demandas para agendar a instalação na sua base operacional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {networkJobs.map(job => (
                <div key={job.id} className="bg-zinc-950 border border-[#444746] rounded-none p-5 relative overflow-hidden group hover:border-[#0284C7] transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-all">
                    <Target size={64} className="text-[#0284C7]" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] font-mono bg-[#0284C7]/20 text-[#0284C7] px-2 py-0.5 border border-[#0284C7]/30 uppercase font-black">
                          Nova Demanda
                        </span>
                        <div className="text-[10px] text-zinc-500 font-mono mt-2">OS: {job.service_order_id}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block">Valor Liquido</span>
                        <span className="text-lg text-emerald-400 font-light tracking-tight flex items-center gap-1 justify-end">
                          <DollarSign size={14} /> 
                          {((job.total_amount || 0) - (job.architect_rt || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[8px] text-zinc-600 block mt-0.5">- RT do Arquiteto abatida</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-6">
                      <div className="text-xs font-bold text-white uppercase tracking-tight">{job.customer_name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1"><MapPin size={10} /> {job.customer_city || 'Local não especificado'}</div>
                      <div className="text-[11px] text-zinc-300 mt-2 p-2 bg-zinc-900 border border-[#27272A]">
                        <span className="text-zinc-500 text-[9px] block uppercase mb-1">Especificação WINF:</span>
                        {job.chosen_film}
                        <br/>
                        <span className="text-zinc-500 text-[9px] inline-block mt-1">{job.vehicle_model}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAcceptNetworkDemand(job.id)}
                      disabled={loading}
                      className="mt-auto w-full bg-white/5 hover:bg-[#0284C7] border border-[#444746] hover:border-[#0284C7] text-white text-[10px] font-bold uppercase tracking-[0.2em] py-3 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processando...' : 'Captar Demanda (Aceitar)'}
                    </button>
                  </div>
                </div>
              ))}
              {networkJobs.length === 0 && (
                <div className="col-span-full py-16 text-center border border-dashed border-[#444746] bg-zinc-950/30 rounded-none flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-none bg-zinc-900/60 border border-[#444746] flex flex-col items-center justify-center">
                    <Target size={20} className="text-zinc-500" />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Nenhuma demanda da rede disponível neste momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-zinc-900/40 border border-[#444746] rounded-none overflow-x-auto w-full relative">
          <table className="w-full text-left text-sm text-white/40 min-w-[800px]">
            <thead className="bg-white/5 text-xs md:text-[10px] uppercase font-bold tracking-widest text-zinc-500">
              <tr>
                <th className="p-6">OS / Data</th>
                <th className="p-6">Cliente</th>
                <th className="p-6">Produto</th>
                <th className="p-6">Valor / Pagamento</th>
                <th className="p-6">Status</th>
                <th className="p-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444746]">
              {filteredJobs.filter(j => j.status === 'completed').map(job => (
                <tr key={job.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="font-mono text-zinc-300">{job.service_order_id}</div>
                    <div className="text-xs md:text-[10px]">{new Date(job.completed_at || '').toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-white">{job.customer_name}</div>
                    <div className="text-xs md:text-[10px] flex items-center gap-1"><Phone className="w-2 h-2" /> {job.customer_whatsapp}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-zinc-300">{job.chosen_film}</div>
                    <div className="text-xs md:text-[10px] uppercase text-zinc-500">{job.vehicle_model}</div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-white">R$ {job.total_amount?.toLocaleString('pt-BR')}</div>
                    <div className="text-xs md:text-[10px] uppercase text-zinc-500">{job.payment_method || 'Confirmado'}</div>
                  </td>
                  <td className="p-6">
                    <span className="bg-green-500/20 text-green-400 text-xs md:text-[10px] font-bold px-2 py-1 rounded-none uppercase">Concluído</span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <button onClick={() => shareReceipt(job)} className="p-2 bg-zinc-800 rounded-none hover:bg-zinc-700 transition-colors text-zinc-300" title="Enviar Recibo WhatsApp">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-zinc-800 rounded-none hover:bg-zinc-700 transition-colors text-zinc-300" title="Imprimir Comprovante">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.filter(j => j.status === 'completed').length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">Nenhum serviço concluído no histórico.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedDayIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedDayIndex(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-zinc-950 border border-[#444746] rounded-none w-full max-w-2xl overflow-hidden shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white font-medium text-base uppercase tracking-widest flex items-center gap-2">
                    <CalendarDays size={16} /> 
                    {currentWeekDates[selectedDayIndex].day} - {currentWeekDates[selectedDayIndex].dateStr}
                  </h3>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Serviços do dia</p>
                </div>
                <button onClick={() => setSelectedDayIndex(null)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {getDayJobs(selectedDayIndex).map((job) => (
                  <div key={job.id} className="p-4 bg-[#1e1f20] border border-[#444746] rounded-none flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-zinc-500">{job.service_order_id}</span>
                        <span className={`px-1.5 py-0.5 rounded-none text-[8px] uppercase tracking-wider font-bold ${job.status === 'in_progress' ? 'bg-blue-900/30 text-blue-400' : 'bg-zinc-800 text-zinc-300'}`}>
                          {job.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                        </span>
                        {job.needs_invoice && (
                          <span className="bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-none text-[8px] uppercase tracking-wider font-black shadow-sm">
                            NF-e
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-light text-white truncate">{job.customer_name}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{job.chosen_film} - {job.vehicle_model}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <div className="flex flex-col flex-1 min-w-[120px]">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Horário de Start</label>
                        <input
                          type="time"
                          defaultValue={job.scheduled_time || ''}
                          onBlur={(e) => updateInstallationJob(job.id, { scheduled_time: e.target.value })}
                          className="bg-[#131314] items-center border border-[#444746] rounded-none px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 self-end">
                        <button 
                          onClick={() => { setSelectedDayIndex(null); setSelectedJob(job); }}
                          className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-[#444746] rounded-none text-white font-medium uppercase text-[10px] tracking-wider transition-all w-full text-center"
                        >
                          Abrir O.S
                        </button>
                        <button 
                          onClick={() => updateInstallationJob(job.id, { scheduled_date: '', scheduled_time: '' })}
                          className="py-1 px-3 text-red-500/70 hover:text-red-400 font-medium uppercase text-[9px] tracking-wider transition-all w-full text-center"
                          title="Remover do Dia"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getDayJobs(selectedDayIndex).length === 0 && (
                  <div className="py-10 text-center border border-dashed border-[#444746] rounded-none bg-zinc-950/40">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Nenhum serviço agendado para este dia.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual OS Modal */}
      <AnimatePresence>
        {showManualOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowManualOSModal(false)}
              className="absolute inset-0 bg-[#131314]/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-zinc-950 border border-[#444746] rounded-none w-full max-w-lg overflow-hidden shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white font-medium text-base uppercase tracking-widest">Nova OS (Serviço Avulso)</h3>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Lançamento direto sem orçamento</p>
                </div>
                <button onClick={() => setShowManualOSModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleManualOSSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <User size={10} className="text-white/40" /> 1. Nome do Cliente
                    </label>
                    <input
                      type="text"
                      value={manualOSData.customerName}
                      onChange={(e) => setManualOSData({ ...manualOSData, customerName: e.target.value })}
                      placeholder="Identificação do cliente"
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all focus:ring-1 focus:ring-white/5"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={10} className="text-white/40" /> 2. Material Escolhido
                    </label>
                    <input
                      type="text"
                      value={manualOSData.chosenFilm}
                      onChange={(e) => setManualOSData({ ...manualOSData, chosenFilm: e.target.value })}
                      placeholder="Ex: AeroCore Full, Winf Select Plus"
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all focus:ring-1 focus:ring-white/5"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <MapPin size={10} className="text-white/40" /> Veículo / Local
                    </label>
                    <input
                      type="text"
                      value={manualOSData.vehicleModel}
                      onChange={(e) => setManualOSData({ ...manualOSData, vehicleModel: e.target.value })}
                      placeholder="Audi Q5 / Varanda"
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <DollarSign size={10} className="text-white/40" /> Investimento (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={manualOSData.totalAmount}
                      onChange={(e) => setManualOSData({ ...manualOSData, totalAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <MapPin size={10} className="text-white/40" /> Endereço Completo
                    </label>
                    <input
                      type="text"
                      value={manualOSData.customerAddress}
                      onChange={(e) => setManualOSData({ ...manualOSData, customerAddress: e.target.value })}
                      placeholder="Sem rua, número, bairro..."
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <Calendar size={10} className="text-white/40" /> 3. Data de Ativação
                    </label>
                    <input
                      type="date"
                      value={manualOSData.scheduledDate}
                      onChange={(e) => setManualOSData({ ...manualOSData, scheduledDate: e.target.value })}
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all [color-scheme:dark]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={10} className="text-white/40" /> Unidade Executora
                    </label>
                    <select
                      value={manualOSData.unit}
                      onChange={(e) => setManualOSData({ ...manualOSData, unit: e.target.value })}
                      className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 transition-all cursor-pointer appearance-none"
                    >
                      {WINF_LOCAL_UNITS.map(u => (
                        <option key={u.name} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fiscal Section Toggle */}
                <div className="bg-zinc-900/40 border border-[#444746] rounded-none p-3.5 space-y-3 font-sans">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={manualOSData.needsInvoice}
                      onChange={(e) => setManualOSData({ ...manualOSData, needsInvoice: e.target.checked })}
                      className="w-4 h-4 accent-orange-500 border-[#444746] bg-zinc-950 rounded-none focus:ring-0 focus:outline-none cursor-pointer"
                    />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white">Requer Nota Fiscal (NF-e)</p>
                      <p className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Identificação de faturamento para o financeiro</p>
                    </div>
                  </label>

                  {manualOSData.needsInvoice && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2.5 border-t border-[#444746]/50 overflow-hidden text-left"
                    >
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Razão Social / Nome Fiscal</label>
                        <input 
                          type="text"
                          value={manualOSData.razaoSocial}
                          onChange={(e) => setManualOSData({ ...manualOSData, razaoSocial: e.target.value })}
                          placeholder="Ex: Advanced Window Film LTDA"
                          className="w-full bg-[#131314] border border-[#444746] rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                          required={manualOSData.needsInvoice}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">CNPJ ou CPF</label>
                          <input 
                            type="text"
                            value={manualOSData.cnpj}
                            onChange={(e) => setManualOSData({ ...manualOSData, cnpj: e.target.value })}
                            placeholder="00.000.000/0001-00"
                            className="w-full bg-[#131314] border border-[#444746] rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                            required={manualOSData.needsInvoice}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">CEP</label>
                          <input 
                            type="text"
                            value={manualOSData.cep}
                            onChange={(e) => setManualOSData({ ...manualOSData, cep: e.target.value })}
                            placeholder="00000-000"
                            className="w-full bg-[#131314] border border-[#444746] rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                            required={manualOSData.needsInvoice}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="pt-3">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-none hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Processando...' : <><Plus size={14} /> Salvar OS</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowScheduleModal(false)}
              className="absolute inset-0 bg-[#131314]/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-zinc-950 border border-[#444746] rounded-none w-full max-w-md overflow-hidden shadow-2xl p-6 md:p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white font-medium text-base uppercase tracking-widest">Agendar Serviço</h3>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Vincular orçamento e data</p>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleScheduleService} className="space-y-5">
                <div className="space-y-1.55">
                  <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest">Selecione o Orçamento (PDF)</label>
                  <select
                    value={scheduleData.quoteId}
                    onChange={(e) => setScheduleData({ ...scheduleData, quoteId: e.target.value })}
                    className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Escolha um orçamento aprovado...</option>
                    {quotes.map(q => (
                      <option key={q.id} value={q.id}>{q.customerName} - R$ {q.totalAmount?.toLocaleString('pt-BR')} ({new Date(q.createdAt).toLocaleDateString()})</option>
                    ))}
                    {quotes.length === 0 && <option value="" disabled>Nenhum orçamento encontrado.</option>}
                  </select>
                  {scheduleData.quoteId && (
                    <div className="p-3 bg-white/5 border border-[#444746] rounded-none mt-2">
                      <p className="text-[9px] text-white/40 uppercase">Preenchimento Automático ativado</p>
                      <p className="text-[10px] text-green-400 flex items-center gap-1 mt-1"><CheckCircle2 size={11}/> Dados do cliente, produto e valores vinculados.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest">Selecione a Data</label>
                  <input
                    type="date"
                    value={scheduleData.scheduledDate}
                    onChange={(e) => setScheduleData({ ...scheduleData, scheduledDate: e.target.value })}
                    className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 transition-all [color-scheme:dark]"
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={() => {
                         const tomorrow = new Date();
                         tomorrow.setDate(tomorrow.getDate() + 1);
                         setScheduleData({...scheduleData, scheduledDate: tomorrow.toISOString().split('T')[0]});
                      }}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-white/60 rounded-none transition-colors uppercase font-medium tracking-wider"
                    >
                      Amanhã
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                         const nextWeek = new Date();
                         nextWeek.setDate(nextWeek.getDate() + 7);
                         setScheduleData({...scheduleData, scheduledDate: nextWeek.toISOString().split('T')[0]});
                      }}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] text-white/60 rounded-none transition-colors uppercase font-medium tracking-wider"
                    >
                      Próx. Semana
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-none hover:bg-zinc-100 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Confirmar Agendamento'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-[#131314]/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-[#1e1f20] border border-[#444746] rounded-none w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest">Ordem de Serviço</span>
                    <h2 className="text-2xl font-semibold text-white tracking-tight mt-1">{selectedJob.service_order_id}</h2>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="p-1.5 hover:bg-white/5 rounded-none transition-colors text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/25 p-4 rounded-none border border-[#444746]">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Cliente</p>
                      <p className="text-base font-semibold text-white">{selectedJob.customer_name}</p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5"><Phone className="w-3 h-3 text-zinc-500" /> {selectedJob.customer_whatsapp}</p>
                    </div>
                    {(selectedJob.customer_address || selectedJob.customer_city) && (
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Local Execução</p>
                        <p className="text-xs text-zinc-350">{selectedJob.customer_address}</p>
                        <p className="text-xs text-zinc-550">{selectedJob.customer_city}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Material Escolhido</p>
                      <p className="text-base font-semibold text-white">{selectedJob.chosen_film}</p>
                      {selectedJob.vehicle_model && (
                        <p className="text-xs text-zinc-400 uppercase">{selectedJob.vehicle_model}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Investimento</p>
                      <p className="text-lg font-bold text-white">R$ {selectedJob.total_amount?.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                {/* Fiscal Information Display */}
                {selectedJob.needs_invoice && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-none space-y-3 font-sans text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-none animate-pulse shadow-[0_0_6px_rgba(251,146,60,0.8)]"></span>
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">⚠️ Solicitação de Nota Fiscal (NF-e)</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Razão Social</span>
                        <span className="text-xs font-bold text-white block truncate" title={selectedJob.razao_social || selectedJob.customer_name}>
                          {selectedJob.razao_social || selectedJob.customer_name}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">CNPJ / CPF</span>
                        <span className="text-xs font-bold text-white block">{selectedJob.cnpj || 'Não cadastrado'}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">CEP</span>
                        <span className="text-xs font-bold text-white block">{selectedJob.cep || 'Não cadastrado'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedJob.status !== 'completed' && (
                  <div className="space-y-5 pt-4 border-t border-[#444746]">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Placa / Identificação (Opcional)</label>
                          <input
                            type="text"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            placeholder="ABC-1234"
                            className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-zinc-650"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Forma de Pagamento</label>
                          <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-none border border-[#444746]">
                            {['Pix', 'Cartão', 'Dinheiro', 'Faturamento pós-NF-e'].map((m) => (
                              <button 
                                key={m}
                                type="button"
                                onClick={() => setPaymentMethod(m as any)}
                                className={`py-1.5 rounded-none text-[9px] font-bold uppercase tracking-wider transition-all truncate px-1 ${paymentMethod === m ? 'bg-white/15 text-white' : 'text-zinc-500 hover:text-white'}`}
                                title={m}
                              >
                                {m === 'Faturamento pós-NF-e' ? 'NF-e Pós' : m}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Conditional Fiscal Form for Faturamento pós-NF-e */}
                      {paymentMethod === 'Faturamento pós-NF-e' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-none space-y-3 text-left font-sans"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-none animate-pulse shadow-[0_0_6px_rgba(251,146,60,0.8)]"></span>
                            <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest">🔒 Dados para Faturamento após Nota Fiscal</span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Razão Social / Nome de Faturamento</label>
                            <input 
                              type="text"
                              value={completeRazaoSocial}
                              onChange={(e) => setCompleteRazaoSocial(e.target.value)}
                              placeholder="Digitalize a Razão Social da Empresa"
                              className="w-full bg-[#131314] border border-[#444746] rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-zinc-700"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">CNPJ ou CPF</label>
                              <input 
                                type="text"
                                value={completeCnpj}
                                onChange={(e) => setCompleteCnpj(e.target.value)}
                                placeholder="00.000.000/0001-00"
                                className="w-full bg-[#131314] border border-[#444746] rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-zinc-700"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">CEP</label>
                              <input 
                                type="text"
                                value={completeCep}
                                onChange={(e) => setCompleteCep(e.target.value)}
                                placeholder="00000-000"
                                className="w-full bg-[#131314] border border-[#444746] rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-zinc-700"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Fotos do Serviço (Mínimo 1)</label>
                          <label className="flex flex-col items-center justify-center w-full min-h-[60px] border border-dashed border-[#444746] hover:border-[#444746] bg-zinc-950/40 rounded-none cursor-pointer transition-colors text-center block">
                            <div className="p-3 text-center">
                              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Anexar imagem concluída</span>
                            </div>
                            <input type="file" className="hidden" multiple accept="image/*" onChange={handlePhotoUpload} />
                          </label>
                          {photosAttached.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {photosAttached.map((p, i) => (
                                <span key={i} className="px-2 py-0.5 bg-zinc-900 border border-[#444746] rounded-none text-[9px] uppercase text-zinc-400">{p}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-zinc-500 uppercase font-medium tracking-wider">Assinatura do Cliente</label>
                          <input
                            type="text"
                            value={clientSignature}
                            onChange={(e) => setClientSignature(e.target.value)}
                            placeholder="Nome por extenso do cliente"
                            className="w-full bg-[#131314] border border-[#444746] rounded-none px-3.5 py-3 text-xs text-white focus:outline-none focus:border-white/30 transition-all text-center italic font-serif"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#444746]">
                      <button 
                        onClick={() => handleNotifyDelay(selectedJob)}
                        className="py-2.5 px-3 bg-zinc-900/45 hover:bg-zinc-900 border border-[#444746] rounded-none text-zinc-300 font-medium uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare size={12} className="text-zinc-550" /> WhatsApp: Avisar Atraso
                      </button>
                      
                      <div className="flex gap-1.5 w-full">
                        <input 
                          type="date" 
                          className="flex-1 bg-[#131314] border border-[#444746] rounded-none px-2 text-[10px] text-white [color-scheme:dark] outline-none" 
                          id={`reschedule-date-${selectedJob.id}`}
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById(`reschedule-date-${selectedJob.id}`) as HTMLInputElement;
                            handleReschedule(selectedJob.id, input?.value);
                          }}
                          className="py-2.5 px-3 bg-red-950/20 text-red-400 border border-red-900/20 rounded-none font-medium uppercase text-[10px] tracking-wider hover:bg-red-950/30 transition-all whitespace-nowrap"
                          title="Reagendar OS"
                        >
                          Reagendar
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleCompleteJob(selectedJob.id)}
                      disabled={loading}
                      className="w-full bg-white text-black py-3 rounded-none font-semibold uppercase tracking-wider hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? 'Processando...' : <><CheckCircle2 className="w-4 h-4" /> Concluir Serviço e Ativar Garantia</>}
                    </button>
                  </div>
                )}

                {selectedJob.status === 'completed' && (
                  <div className="pt-4 border-t border-[#444746] flex gap-3">
                    <button onClick={() => shareReceipt(selectedJob)} className="flex-1 bg-emerald-600 hover:bg-emerald-550 border border-emerald-500/20 text-white py-2.5 rounded-none font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                      <Share2 className="w-4 h-4" /> Compartilhar Recibo
                    </button>
                    <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-[#444746] text-zinc-300 py-2.5 rounded-none font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                      <Printer className="w-4 h-4" /> Imprimir
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleInstallations;
