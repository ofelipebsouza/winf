import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Box, CreditCard, ChevronRight, CheckCircle2, Lock, Cpu, Globe, Database, Fingerprint, Loader2, Truck, MapPin, Zap } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutBlackshopProps {
  onBack: () => void;
  onSuccess: () => void;
  items: any[];
}

const CheckoutBlackshop: React.FC<CheckoutBlackshopProps> = ({ onBack, onSuccess, items }) => {
  const { user, gamify, addTransaction } = useWinf();
  const isServiceOnly = items.every(item => item.id?.startsWith('svc') || item.category === 'services' || item.category === 'Licenciamento');
  const [step, setStep] = useState(isServiceOnly ? 1 : 0.5); // Start directly at address or payment based on item type
  const [paymentMethod, setPaymentMethod] = useState<'credit'|'pix'|'crypto'>('credit');
  const isWinfCoinCurrency = false;
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  
  // Freight & Address
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' });
  const [freightCost, setFreightCost] = useState(0);
  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);
  
  // Card Data
  const [cardData, setCardData] = useState({ name: '', number: '', exp: '', cvc: '' });
  const [cepError, setCepError] = useState('');
  
  // Calculate total
  const itemsTotal = items.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = itemsTotal + freightCost;

  const handleCalculateFreight = async () => {
      if (cep.length < 8) return;
      setIsCalculatingFreight(true);
      setCepError('');
      try {
          const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
          const data = await res.json();
          if (!data.erro) {
              setAddress({ ...address, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf });
              
              // Tabela de Frete por Região (Valores Fixos)
              const freightTable: Record<string, number> = {
                'SP': 25.00,
                'RJ': 30.00,
                'MG': 35.00,
                'ES': 35.00,
                'PR': 40.00,
                'SC': 45.00,
                'RS': 50.00,
                'MS': 60.00,
                'MT': 65.00,
                'GO': 55.00,
                'DF': 45.00,
                'BA': 70.00,
                'SE': 75.00,
                'AL': 75.00,
                'PE': 80.00,
                'PB': 85.00,
                'RN': 85.00,
                'CE': 90.00,
                'PI': 95.00,
                'MA': 95.00,
                'TO': 100.00,
                'PA': 110.00,
                'AP': 120.00,
                'RR': 130.00,
                'AM': 125.00,
                'AC': 135.00,
                'RO': 115.00
              };
              
              const ufStr = data.uf ? data.uf.toUpperCase() : '';
              const cost = freightTable[ufStr] || 50.00;
              setFreightCost(cost);
          } else {
              setCepError('CEP não encontrado.');
          }
      } catch (error) {
          console.error(error);
          setCepError('Erro ao buscar CEP.');
      }
      setIsCalculatingFreight(false);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setStep(3); // Verification step
    
    try {
      const generatedHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setTxHash(generatedHash);
      
      // Save order to firestore
      const trackingCode = 'WN-' + Math.floor(Math.random() * 1000000000).toString();
      await addDoc(collection(db, 'blackshop'), {
          userId: user?.id || 'unknown',
          userEmail: user?.email || '',
          items,
          itemsTotal,
          freightCost,
          totalAmount: total,
          currency: 'BRL',
          shippingAddress: { cep, ...address },
          paymentMethod,
          status: 'Aguardando Despacho',
          trackingCode,
          txHash: generatedHash,
          createdAt: serverTimestamp()
      });

      // Notification/Log (simulated)
      console.log(`[WINF LOG] Novo pedido #WN! Aviso enviado para a central via WhatsApp/Email.`);

      // Integration with Financial Module (Caixa) - Sincronizado estritamente aqui no Try/Catch
      addTransaction({
        description: `Compra Blackshop: ${items.map(i => i.name).join(', ')}`,
        type: 'expense',
        amount: total,
        category: 'Estoque',
        paymentMethod: paymentMethod === 'credit' ? 'Credit' : paymentMethod === 'pix' ? 'Pix' : 'BankTransfer',
        date: new Date().toISOString()
      });

      gamify('SALE_CLOSED', { value: total });

      setTimeout(() => {
        setStep(4); // Success step
      }, 3000);
    } catch (e) {
      console.error(e);
      alert('Erro ao processar o banco de dados. Transação abortada para evitar dessincronização com o caixa local.');
      setStep(1);
    }
  };

  return (
    <div className="min-h-0 lg:min-h-[85vh] bg-[#020202] flex flex-col lg:flex-row relative overflow-hidden animate-fade-in text-white border border-white/10 rounded-none shadow-2xl">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* LEFT COL: Cart & Details */}
      <div className="w-full lg:w-[42%] bg-[#080808] lg:border-r border-b lg:border-b-0 border-white/5 p-5 sm:p-6 md:p-8 z-10 flex flex-col">
        <button onClick={onBack} className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-8 w-fit">
          <ChevronLeft size={14} /> Voltar para Loja
        </button>

        <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-6">Resumo do <span className="font-bold">Pedido</span></h2>
        
        <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#111] border border-white/10 rounded-none overflow-hidden flex items-center justify-center shrink-0">
                {item.img ? (
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <Box className="text-white/40" size={20} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs md:text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{item.category}</p>
                <h4 className="text-sm font-semibold text-white">{item.name}</h4>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">R$ {item.price.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 mt-auto">
          <div className="flex justify-between items-center text-sm text-white/60 mb-4">
            <span>Subtotal</span>
            <span>R$ {total.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-white/60 mb-6 pb-6 border-b border-white/10">
            <span>{isServiceOnly ? 'Logística Digital' : 'Frete / Logística'}</span>
            <span>{isServiceOnly ? 'Isento' : `R$ ${freightCost.toLocaleString('pt-BR')}`}</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="block text-xs md:text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total a Pagar</span>
              <span className="text-3xl font-black text-white">R$ {total.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COL: Checkout logic */}
      <div className="w-full lg:w-[58%] bg-[#0A0A0A] p-5 sm:p-6 md:p-8 z-10 flex flex-col justify-center min-h-[400px]">
        {step === 0.5 && (
            <div className="space-y-6 animate-fade-in max-w-md mx-auto w-full">
              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                  {isServiceOnly ? 'Área de Atuação / Destino' : 'Destino de Entrega'}
                </h3>
                 <p className="text-white/40 text-xs mt-1">
                   {isServiceOnly ? 'Dados para configuração e ativação remota' : 'Cálculo de frete e despacho'}
                 </p>
              </div>

              {isServiceOnly ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block font-bold">Cidade para Ativação do Serviço</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Curitiba - PR" 
                      value={address.cidade}
                      onChange={(e) => setAddress({...address, cidade: e.target.value, rua: 'Digital', numero: '0'})}
                      className="w-full bg-black border border-white/10 rounded-none p-3.5 text-sm text-white focus:border-white transition-all outline-none font-sans" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block font-bold">WhatsApp do Responsável (Entrega do Setup)</label>
                    <input 
                      type="tel" 
                      placeholder="(00) 00000-0000" 
                      value={address.complemento}
                      onChange={(e) => setAddress({...address, complemento: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-none p-3.5 text-sm text-white focus:border-white transition-all outline-none font-sans" 
                    />
                  </div>
                  <div className="bg-winf-primary/10 border border-winf-primary/20 p-4 rounded-none flex gap-3 text-winf-primary mt-2">
                    <Zap size={20} className="shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-sans">
                      Assim que o pagamento for aprovado, nosso sistema enviará uma notificação via WhatsApp avisando que nosso time já está trabalhando na ativação na sua cidade.
                    </p>
                  </div>
                </div>
              ) : (
                !isWinfCoinCurrency && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="CEP" 
                                value={cep}
                                onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                                maxLength={8}
                                className="flex-1 bg-black border border-white/10 rounded-none p-3 text-sm text-white focus:border-white transition-all outline-none font-mono" 
                            />
                            <button 
                                onClick={handleCalculateFreight}
                                disabled={cep.length < 8 || isCalculatingFreight}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-none px-4 text-xs font-bold uppercase disabled:opacity-50 transition-all font-sans"
                            >
                                {isCalculatingFreight ? <Loader2 size={16} className="animate-spin" /> : 'Calcular'}
                            </button>
                        </div>
                        {cepError && <span className="text-red-500 text-xs font-bold">{cepError}</span>}

                        {address.rua && (
                            <div className="space-y-4 animate-fade-in pt-4">
                                <div className="bg-[#111] p-3 border border-white/5 text-xs text-white/70 rounded-none flex gap-3">
                                    <MapPin className="text-winf-primary shrink-0" />
                                    <div>
                                        <p className="font-bold text-white">{address.rua}, {address.bairro}</p>
                                        <p>{address.cidade} - {address.estado}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Número" 
                                        value={address.numero}
                                        onChange={(e) => setAddress({...address, numero: e.target.value})}
                                        className="w-1/3 bg-black border border-white/10 rounded-none p-3 text-xs text-white focus:border-white transition-all outline-none" 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Complemento" 
                                        value={address.complemento}
                                        onChange={(e) => setAddress({...address, complemento: e.target.value})}
                                        className="w-2/3 bg-black border border-white/10 rounded-none p-3 text-xs text-white focus:border-white transition-all outline-none" 
                                    />
                                </div>
                                <div className="bg-winf-primary/10 border border-winf-primary/20 p-3.5 rounded-none flex justify-between items-center text-winf-primary mt-3">
                                    <div className="flex items-center gap-2">
                                        <Truck size={18} />
                                        <span className="font-bold uppercase tracking-widest text-xs">Frete Especial</span>
                                    </div>
                                    <span className="font-bold">R$ {freightCost.toLocaleString('pt-BR')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )
              )}

              <button 
                onClick={() => setStep(1)}
                disabled={isServiceOnly ? (!address.cidade || !address.complemento) : (!address.rua || !address.numero)}
                className="w-full bg-white text-black py-3 mt-6 font-bold text-xs uppercase tracking-wider rounded-none hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar <ChevronRight size={16} />
              </button>
            </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-fade-in max-w-md mx-auto w-full">
            <button onClick={() => setStep(0.5)} className="text-xs md:text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white flex items-center gap-1 mb-8">
              <ChevronLeft size={12} /> Voltar
            </button>
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Método de Pagamento</h3>
              <p className="text-white/40 text-sm">Transação encriptada via WINF CHAIN™</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setPaymentMethod('credit')}
                className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-none border transition-all ${paymentMethod === 'credit' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/20 bg-black'}`}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className={paymentMethod === 'credit' ? 'text-white' : 'text-white/40'} />
                  <span className="font-bold text-sm tracking-widest uppercase">Cartão de Crédito</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-8 h-5 bg-white/10 rounded-none"></span>
                  <span className="w-8 h-5 bg-white/10 rounded-none"></span>
                </div>
              </button>

              <button 
                onClick={() => setPaymentMethod('pix')}
                className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-none border transition-all ${paymentMethod === 'pix' ? 'border-winf-primary bg-winf-primary/5' : 'border-white/10 hover:border-white/20 bg-black'}`}
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck className={paymentMethod === 'pix' ? 'text-winf-primary' : 'text-white/40'} />
                  <span className={`font-bold text-sm tracking-widest uppercase ${paymentMethod==='pix'?'text-winf-primary':''}`}>PIX (Aprovação Imadiata)</span>
                </div>
              </button>

              <button 
                onClick={() => setPaymentMethod('crypto')}
                className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-none border transition-all ${paymentMethod === 'crypto' ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 hover:border-white/20 bg-black'}`}
              >
                <div className="flex items-center gap-4">
                  <Globe className={paymentMethod === 'crypto' ? 'text-purple-500' : 'text-white/40'} />
                  <span className={`font-bold text-sm tracking-widest uppercase ${paymentMethod==='crypto'?'text-purple-500':''}`}>USDT / Crypto</span>
                </div>
                <span className="text-xs md:text-[10px] md:text-sm md:text-[11px] font-bold text-purple-500 bg-purple-500/10 px-2 py-1 uppercase tracking-widest">Web3</span>
              </button>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-white text-black py-3 mt-6 font-bold text-xs uppercase tracking-wider rounded-none hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              Prosseguir <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in max-w-md mx-auto w-full">
            <button onClick={() => setStep(1)} className="text-xs md:text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white flex items-center gap-1 mb-8">
              <ChevronLeft size={12} /> Voltar
            </button>

            {paymentMethod === 'credit' && (
              <div className="space-y-6">
                 <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6">Dados do Cartão</h3>
                 <input type="text" placeholder="Nome no Cartão" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-none p-3 text-sm text-white focus:border-white transition-all outline-none" />
                 <input type="text" placeholder="0000 0000 0000 0000" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} className="w-full bg-black border border-white/10 rounded-none p-3 text-sm text-white focus:border-white transition-all outline-none font-mono" />
                 <div className="flex gap-4">
                   <input type="text" placeholder="MM/AA" value={cardData.exp} onChange={(e) => setCardData({...cardData, exp: e.target.value})} className="w-1/2 bg-black border border-white/10 rounded-none p-3 text-sm text-white focus:border-white transition-all outline-none" />
                   <input type="text" placeholder="CVC" value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value})} className="w-1/2 bg-black border border-white/10 rounded-none p-3 text-sm text-white focus:border-white transition-all outline-none" />
                 </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="text-center py-8">
                 <div className="w-48 h-48 bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-6">
                    <span className="text-white/20 font-mono text-sm">QR_CODE_GENERATOR</span>
                 </div>
                 <p className="text-sm text-white/60 mb-2">Escaneie o QR Code ou copie o código Pix copia e cola.</p>
                 <div className="bg-[#111] border border-white/10 p-3 flex justify-between items-center">
                    <span className="font-mono text-xs text-white/40 truncate w-4/5">00020126420014br.gov.bcb.pix...</span>
                    <button className="text-xs md:text-[10px] md:text-sm md:text-[11px] uppercase tracking-widest font-bold text-white">Copiar</button>
                 </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="text-center py-8 space-y-6">
                 <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-none flex items-center justify-center mx-auto mb-4">
                    <Fingerprint size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white">Conectar Wallet</h3>
                 <p className="text-white/40 text-sm">Aceitamos MetaMask, TrustWallet e WalletConnect na rede Polygon e Ethereum.</p>
                 <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 font-bold tracking-widest uppercase transition-colors">
                   Connect Web3 Wallet
                 </button>
              </div>
            )}


            <button 
              onClick={handleProcessPayment}
              className="w-full bg-winf-primary text-black py-3 mt-6 font-bold text-xs uppercase tracking-wider rounded-none hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
               Confirmar & Pagar
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-8 animate-fade-in flex flex-col items-center justify-center h-full">
            <div className="relative">
              <Cpu size={64} className="text-winf-primary animate-pulse" />
              <div className="absolute inset-0 bg-winf-primary blur-[50px] opacity-20"></div>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Registrando na I-BLOCKCHAIN™</h3>
              <p className="text-white/40 text-sm font-mono flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Verificando nós da rede...
              </p>
            </div>
            
            <div className="w-64 max-w-full text-left space-y-2 font-mono text-xs md:text-[10px] text-white/30">
               <p>➜ Validando credenciais...</p>
               <p className="text-winf-primary/50">➜ Lock Smart Contract...</p>
               <p>➜ Gerando Hash...</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-8 animate-fade-in max-w-md mx-auto w-full">
            <div className="w-20 h-20 bg-winf-primary/10 rounded-none flex items-center justify-center mx-auto text-winf-primary mb-6">
              <CheckCircle2 size={40} />
            </div>
            
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Pagamento Aprovado</h3>
              <p className="text-white/60 mb-8">
                {isServiceOnly 
                  ? "Sua requisição foi recebida com sucesso! Você receberá um e-mail de confirmação em instantes e nossa equipe de especialistas entrará em contato para iniciar o seu atendimento." 
                  : "Sua transação foi confirmada e o despacho será processado pela central."}
              </p>
            </div>

            <div className="bg-[#111] border border-white/5 p-5 rounded-none text-left space-y-4">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Hash da Transação</span>
                <span className="font-mono text-xs text-winf-primary break-all">{txHash}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Valor</span>
                  <span className="font-bold text-white text-sm">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Status</span>
                  <span className="font-bold text-green-400 text-sm">{isServiceOnly ? 'Em Iniciação' : 'Verificado'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onSuccess}
              className="w-full bg-white text-black py-3 mt-6 font-bold text-xs uppercase tracking-wider rounded-none hover:bg-zinc-200 transition-all"
            >
              {isServiceOnly ? 'Voltar ao App' : 'Ver Meus Pedidos'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutBlackshop;
