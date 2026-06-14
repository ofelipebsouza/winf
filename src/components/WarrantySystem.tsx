import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  Search,
  Calendar,
  History,
  FileText,
  ChevronLeft,
  CheckCircle,
  Clock,
  Share2,
  ExternalLink,
  MessageCircle,
  FileSearch,
} from "lucide-react";
import { useWinf } from "../contexts/WinfContext";
import { Quote, WarrantyRegistration } from "../types";

type Tab = "register" | "history" | "schedule";

const WarrantySystem: React.FC<{onBack?: () => void}> = ({onBack}) => {
  const { warranties, registerWarranty, fetchWarranties, quotes, fetchQuotes } = useWinf();
  const [activeTab, setActiveTab] = useState<Tab>("register");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productLine: "AeroCore",
    purchaseDate: new Date().toISOString().split('T')[0],
    quoteId: "",
  });

  const [lastIssuedWarranty, setLastIssuedWarranty] = useState<WarrantyRegistration | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchWarranties();
    fetchQuotes();
  }, []);

  const handleSelectQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      setForm({
        ...form,
        customerName: quote.customerName,
        customerEmail: "", // Quotes usually don't have email in the demo mock but we could add if available
        customerPhone: quote.customerWhatsApp || "",
        quoteId: quote.id,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerWarranty(form as any);
    if (result.success) {
      setLastIssuedWarranty(result.warranty as WarrantyRegistration);
      setShowSuccessModal(true);
      setForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        productLine: "AeroCore",
        purchaseDate: new Date().toISOString().split('T')[0],
        quoteId: "",
      });
    } else {
      alert("Erro ao registrar garantia: " + result.error);
    }
  };

  const handleShareWhatsApp = (warranty: WarrantyRegistration) => {
    const text = `*CERTIFICADO DE GARANTIA WINF™*\n\nOlá ${warranty.customerName},\nSua proteção foi ativada com sucesso!\n\n*Produto:* ${warranty.productLine}\n*Serial:* ${warranty.serialNumber}\n*Status:* Ativo Digital Verificado\n\nAcesse seu certificado oficial:\nhttps://winf-os.app/certificate/${warranty.serialNumber}\n\nObrigado por escolher a excelência WINF.`;
    const url = `https://api.whatsapp.com/send?phone=${warranty.customerPhone?.replace(/\D/g, '')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#444746] pb-6">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              Winf™ | Central de Garantias
            </h1>
            <p className="text-white/40 text-sm md:text-[11px] font-bold uppercase tracking-[0.1em] mt-2">
              O fim do achismo. Gestão de ativos e certificados digitais.
            </p>
          </div>
        </div>
        <div className="bg-[#131314] border border-[#444746] px-6 py-3 flex items-center gap-3">
          <ShieldCheck size={18} className="text-white/70" />
          <span className="text-xs md:text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {warranties.length} ATIVOS CERTIFICADOS
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#444746] pb-px">
        <button
          onClick={() => setActiveTab("register")}
          className={`px-8 py-4 text-xs md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 ${activeTab === "register" ? "text-white border-white bg-white/5" : "text-white/40 border-transparent hover:text-white hover:bg-white/5"}`}
        >
          <Plus size={16} /> EMITIR CERTIFICADO
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-8 py-4 text-xs md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 ${activeTab === "history" ? "text-white border-white bg-white/5" : "text-white/40 border-transparent hover:text-white hover:bg-white/5"}`}
        >
          <History size={16} /> PORTAL DO CLIENTE (TRACKER)
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-8 py-4 text-xs md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 ${activeTab === "schedule" ? "text-white border-white bg-white/5" : "text-white/40 border-transparent hover:text-white hover:bg-white/5"}`}
        >
          <Calendar size={16} /> CRONOGRAMA DE MANUTENÇÃO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-12">
          {/* TAB: REGISTER */}
          {activeTab === "register" && (
            <div className="bg-gradient-to-br from-[#0A0A0A] to-black border border-[#444746] p-5 md:p-8 max-w-3xl mx-auto animate-slide-up">
              <div className="flex items-center gap-4 mb-8 border-b border-[#444746] pb-6">
                <div className="w-12 h-12 bg-white/5 border border-[#444746] flex items-center justify-center text-white/80">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-white font-light text-xl tracking-tight">
                    Emissão do Certificado
                  </h3>
                  <p className="text-xs md:text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                    Gere o ativo digital imutável na blockchain WINF.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <FileSearch size={14} /> Vincular Orçamento Aprovado
                  </label>
                  <select
                    value={form.quoteId}
                    onChange={(e) => handleSelectQuote(e.target.value)}
                    className="w-full bg-[#131314] border border-[#444746] p-4 text-sm md:text-[11px] font-bold text-white uppercase focus:border-white/30 outline-none transition-all appearance-none"
                  >
                    <option value="">Emissão Avulsa (Sem vínculo)</option>
                    {quotes.filter(q => q.status === 'Approved' || q.status === 'Closed' || q.status === 'Pending').map(q => (
                      <option key={q.id} value={q.id}>
                        {q.customerName} - {q.projectType === 'Automotive' ? '🏎️' : '🏠'} - R$ {q.totalAmount.toLocaleString('pt-BR')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                      Cliente / Titular
                    </label>
                    <input
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                      placeholder="Nome Completo"
                      className="w-full bg-[#131314] border border-[#444746] p-4 text-sm md:text-[11px] font-bold text-white uppercase focus:border-white/30 outline-none transition-all placeholder:text-white/20"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                      WhatsApp do Cliente
                    </label>
                    <input
                      value={form.customerPhone}
                      onChange={(e) =>
                        setForm({ ...form, customerPhone: e.target.value })
                      }
                      placeholder="(DD) 99999-9999"
                      className="w-full bg-[#131314] border border-[#444746] p-4 text-sm md:text-[11px] font-bold text-white uppercase focus:border-white/30 outline-none transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                      E-mail do Titular
                    </label>
                    <input
                      value={form.customerEmail}
                      onChange={(e) =>
                        setForm({ ...form, customerEmail: e.target.value })
                      }
                      placeholder="E-mail opcional"
                      className="w-full bg-[#131314] border border-[#444746] p-4 text-sm md:text-[11px] font-bold text-white uppercase focus:border-white/30 outline-none transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                      Produto Master
                    </label>
                    <select
                      value={form.productLine}
                      onChange={(e) =>
                        setForm({ ...form, productLine: e.target.value })
                      }
                      className="w-full bg-[#131314] border border-[#444746] p-4 text-sm md:text-[11px] font-bold text-white uppercase focus:border-white/30 outline-none transition-all appearance-none"
                    >
                      <option value="AeroCore">AeroCore™ Nano-Ceramic</option>
                      <option value="Select">Winf Select™ Architectural</option>
                      <option value="NeoSkin">NeoSkin™ PPF Protection</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
                      Data de Emissão
                    </label>
                    <div className="relative">
                      <Calendar
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                      />
                      <input
                        type="date"
                        value={form.purchaseDate}
                        onChange={(e) =>
                          setForm({ ...form, purchaseDate: e.target.value })
                        }
                        className="w-full bg-[#131314] border border-[#444746] p-4 pl-12 text-sm md:text-[11px] font-bold text-white uppercase focus:border-white/30 outline-none transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#444746]">
                  <button
                    type="submit"
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black py-5 uppercase tracking-[0.2em] text-xs md:text-[10px] transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle size={16} /> Emitir Ativo Digital & Gerar Série
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-8 animate-slide-up">
              {/* INNOVATION BANNER */}
              <div className="bg-[#131314] border border-[#444746] p-5 md:p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.03] pointer-events-none">
                  <ShieldCheck size={300} />
                </div>
                <div className="flex-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-[#444746] text-xs md:text-[10px] md:text-sm md:text-[11px] font-black uppercase tracking-[0.4em] text-white/50 mb-6">
                    <ShieldCheck size={12} /> Exclusividade Absoluta
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                    O FIM DO ACHISMO.
                  </h2>
                  <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6 leading-[0.9] text-white/20">
                    GARANTIA RASTREÁVEL.
                  </h2>
                  <p className="text-sm text-white/60 font-light leading-relaxed mb-8">
                    No mercado tradicional, garantias são promessas verbais ou
                    papéis que se perdem. Na WINF™, sua garantia é um{" "}
                    <strong className="text-white">
                      ativo digital imutável
                    </strong>
                    , atrelado ao número de série da sua película. Valide a
                    autenticidade e a cobertura do seu projeto em tempo real.
                    Transparência técnica de ponta a ponta.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-8 h-8 border border-[#444746] flex items-center justify-center text-white/50 bg-[#131314] shrink-0">
                        <CheckCircle size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs md:text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-1">
                          Validação em Tempo Real
                        </h4>
                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
                          Status da blindagem online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-8 h-8 border border-[#444746] flex items-center justify-center text-white/50 bg-[#131314] shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs md:text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-1">
                          Certificado Oficial
                        </h4>
                        <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
                          Autenticidade DNA digital
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual App representation */}
                <div className="w-full md:w-80 border border-[#444746] bg-[#131314] p-6 md:p-8 shadow-2xl relative z-10 flex-shrink-0">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 border border-[#444746] flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} className="text-white/40" />
                      </div>
                      <div>
                        <div className="text-[6px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">
                          Status
                        </div>
                        <div className="text-[10px] md:text-[8px] uppercase tracking-[0.3em] font-black text-zinc-300 font-bold flex items-center gap-2">
                          AUTENTICADO{" "}
                          <div className="w-1.5 h-1.5 bg-white rounded-none animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[6px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">
                        Serial
                      </div>
                      <div className="text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-[0.2em] font-mono text-white/80">
                        WINF-1744
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl text-white font-bold tracking-tighter italic leading-none mb-2">
                    CERTIFICADO
                    <br />
                    OFICIAL
                  </h3>
                  <p className="text-[6px] text-white/60 font-black uppercase tracking-[0.5em] mb-10">
                    Winf Select Pro
                  </p>
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-[#444746]">
                      <div className="text-[6px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">
                        Vencimento
                      </div>
                      <div className="text-xs md:text-[10px] font-bold tracking-[0.1em] text-white">
                        DEZ 2036
                      </div>
                    </div>
                    <div>
                      <div className="text-[6px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">
                        Concessão
                      </div>
                      <div className="text-xs md:text-[10px] font-bold tracking-[0.1em] text-white">
                        WINF™ OFICIAL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#131314] border border-[#444746] p-6">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#444746]">
                  <h3 className="text-white font-light text-xl tracking-tight flex items-center gap-3">
                    <History size={20} className="text-white/40" /> Acesso ao
                    Portal do Cliente
                  </h3>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      placeholder="Buscar serial..."
                      className="bg-[#131314] border border-[#444746] py-3 pl-10 pr-4 text-xs md:text-[10px] font-bold text-white uppercase tracking-widest w-64 focus:border-white/30 outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {warranties.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-[#444746]">
                      <ShieldCheck
                        size={32}
                        className="mx-auto mb-4 text-white/20"
                        strokeWidth={1}
                      />
                      <p className="text-white/40 text-sm md:text-[11px] font-bold uppercase tracking-[0.2em]">
                        Nenhum ativo registrado.
                      </p>
                    </div>
                  ) : (
                    warranties.map((w) => (
                      <div
                        key={w.id}
                        className="flex flex-col md:flex-row justify-between items-center p-6 bg-[#131314] border border-[#444746] hover:border-white/30 transition-colors group"
                      >
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="w-12 h-12 bg-white/5 border border-[#444746] flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <p className="text-white font-light text-lg">
                              {w.customerName}
                            </p>
                            <p className="text-xs md:text-[10px] text-white/40 font-bold tracking-widest uppercase mt-1">
                              {w.serialNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold">
                              Produto
                            </p>
                            <p className="text-sm text-white">
                              {w.productLine}
                            </p>
                          </div>
                          <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-black uppercase bg-white text-black px-4 py-2 flex items-center gap-2">
                            <CheckCircle size={12} /> ATIVO DIGITAL VERIFICADO
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SCHEDULE (New Calendar Feature) */}
          {activeTab === "schedule" && (
            <div className="bg-[#131314] border border-[#444746] p-6 md:p-12 text-center animate-slide-up flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-[#131314] border border-[#444746] flex items-center justify-center mb-8 relative">
                <Calendar
                  size={32}
                  className="text-white/80 relative z-10"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-3xl font-light text-white mb-4 tracking-tight">
                Cronograma de <span className="font-bold">Manutenção</span>
              </h3>
              <p className="text-white/40 max-w-md mx-auto mb-10 text-sm md:text-[11px] font-bold tracking-[0.1em] uppercase leading-relaxed">
                O sistema notifica automaticamente seus clientes quando for a
                hora da revisão periódica ou manutenção da aplicação.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
                <div className="bg-[#131314] border border-[#444746] p-6 flex items-center gap-6 group hover:border-white/30 transition-all">
                  <div className="bg-white/5 p-4 text-white/60 group-hover:text-white transition-colors">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-white font-light text-lg">
                      Próxima Revisão
                    </p>
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">
                      João Silva - Porsche 911 (15 dias)
                    </p>
                  </div>
                </div>
                <div className="bg-[#131314] border border-[#444746] p-6 flex items-center gap-6 opacity-40">
                  <div className="bg-white/5 p-4 text-white/40">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-white font-light text-lg">
                      Agenda Vazia
                    </p>
                    <p className="text-xs md:text-[10px] md:text-sm md:text-[11px] text-white/40 font-bold uppercase tracking-widest mt-1">
                      Nenhum retorno para hoje.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* MODAL SUCESSO EMISSÃO */}
          {showSuccessModal && lastIssuedWarranty && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#131314]/90 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#131314] border border-[#444746] p-8 max-w-lg w-full text-center space-y-8 shadow-2xl"
              >
                <div className="w-20 h-20 bg-white/5 border border-[#444746] flex items-center justify-center mx-auto rounded-none text-white">
                  <CheckCircle size={40} className="text-zinc-300 font-bold" />
                </div>
                <div>
                  <h3 className="text-2xl font-light text-white tracking-tight uppercase">Garantia Ativada</h3>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">Ativo Digital imutável gerado com sucesso.</p>
                </div>

                <div className="bg-[#131314]/50 border border-[#444746] p-6 space-y-4 text-left">
                  <div className="flex justify-between items-center pb-4 border-b border-[#444746]">
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Serial Number</span>
                    <span className="text-sm font-mono text-white">{lastIssuedWarranty.serialNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-[#444746]">
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Cliente</span>
                    <span className="text-sm text-white">{lastIssuedWarranty.customerName}</span>
                  </div>
                  {lastIssuedWarranty.quoteId && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Orçamento Ref.</span>
                      <span className="text-xs text-white/60">#{lastIssuedWarranty.quoteId.substring(0, 8)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handleShareWhatsApp(lastIssuedWarranty)}
                    className="w-full bg-[#25D366] active:scale-95 hover:bg-[#128C7E] text-white font-black py-5 md:py-4 uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <MessageCircle size={20} /> Compartilhar no WhatsApp
                  </button>
                  <button 
                    onClick={() => window.open(`/certificate/${lastIssuedWarranty.serialNumber}`, '_blank')}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3"
                  >
                    <FileText size={18} /> Visualizar Certificado PDF
                  </button>
                  <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-transparent border border-[#444746] text-white/40 hover:text-white font-bold py-4 uppercase tracking-[0.2em] text-[10px] transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WarrantySystem;
