import React, { useState } from 'react';
import { TrendingUp, Globe, Ship, DollarSign, Lock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PRODUCTS = [
  { 
    id: 'invisible', 
    name: 'Série Select™ Invisible', 
    costFOB: 25.0, 
    spreadHolding: 40.0, 
    repassePrice: 65.0, 
    poolMarginPct: 61, 
    traditionalBRCost: 250.0,
    subtitle: 'Escudo térmico nanocerâmico de transparência total e máximo infravermelho'
  },
  { 
    id: 'dual', 
    name: 'Série Select™ Dual Reflect', 
    costFOB: 18.0, 
    spreadHolding: 27.0, 
    repassePrice: 45.0, 
    poolMarginPct: 60, 
    traditionalBRCost: 180.0,
    subtitle: 'Controle térmico arquitetônico híbrido por refletividade externa'
  },
  { 
    id: 'blackpro', 
    name: 'Série BlackPro', 
    costFOB: 12.50, 
    spreadHolding: 22.50, 
    repassePrice: 35.0, 
    poolMarginPct: 64, 
    traditionalBRCost: 120.0,
    subtitle: 'Privacidade automotiva premium de altíssima rejeição e escuridão tática'
  }
];

export const ImportSimulator = () => {
  const [activeTerritories, setActiveTerritories] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  
  // Fórmula de Demanda Recorrente baseada na unidade piloto de Santos
  // Dedicação focal, escoamento médio de 100m² a 200m² de película por mês por território
  const averageUnitFlowM2 = 150; 
  const totalMonthlyVolumeM2 = activeTerritories * averageUnitFlowM2;

  // Calculos com base na Matriz Aberta de Custos e Repasse (FOB vs Spread vs Repasse)
  const totalCostFOB = totalMonthlyVolumeM2 * selectedProduct.costFOB; // Custo FOB de importação
  const totalSpreadHolding = totalMonthlyVolumeM2 * selectedProduct.spreadHolding; // Spread operacional bruto acumulado
  const totalRepasseRevenue = totalMonthlyVolumeM2 * selectedProduct.repassePrice; // Faturamento de repasse para as praças
  const traditionalBRMarketCost = totalMonthlyVolumeM2 * selectedProduct.traditionalBRCost; // Custo que a rede gastaria no mercado tradicional BR

  // Lucro Líquido do Pool de Liquidez Beta (lastreado na queima e margem líquida média por lote)
  const netPoolDividend = totalSpreadHolding * (selectedProduct.poolMarginPct / 100);

  // Projeção futura de faturamento trimestral para o painel de gráficos
  const chartData = [
    { name: 'Mês 1', repasse: totalRepasseRevenue * 0.8, dividendo: netPoolDividend * 0.8 },
    { name: 'Mês 2', repasse: totalRepasseRevenue * 0.9, dividendo: netPoolDividend * 0.9 },
    { name: 'Mês 3', repasse: totalRepasseRevenue * 1.0, dividendo: netPoolDividend * 1.0 },
    { name: 'Mês 4', repasse: totalRepasseRevenue * 1.2, dividendo: netPoolDividend * 1.2 },
    { name: 'Mês 5', repasse: totalRepasseRevenue * 1.5, dividendo: netPoolDividend * 1.5 },
  ];

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div id="simulador-financeiro" className="bg-[#151518] border border-[#27272A] p-6 md:p-8 relative overflow-hidden mt-8 rounded-none font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284C7]/5 blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#E4E4E7] uppercase tracking-wider italic flex items-center gap-2">
            <Globe className="text-[#0284C7]" /> Simulador Arbitragem BlackShop™ (COF)
          </h3>
          <p className="text-xs text-[#71717A] max-w-2xl mt-1 uppercase tracking-wide font-mono">
            Auditoria volumétrica de custos, spread aduaneiro e projeção de dividendos sob o regime de SCP (Art. 991 CC).
          </p>
        </div>
        <div className="bg-[#0284C7]/5 border border-[#0284C7]/20 px-4 py-2 flex items-center gap-2 rounded-none font-mono text-[9px]">
          <Ship size={14} className="text-[#0284C7]" />
          <span className="font-semibold text-[#0284C7] tracking-wider uppercase">Blockchain Ledger Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111113] border border-[#27272A] p-5 rounded-none">
            <label className="block text-[10px] md:text-xs text-[#71717A] font-bold uppercase tracking-widest mb-3 font-mono">Linha de Insumos Select™</label>
            <div className="space-y-2">
              {PRODUCTS.map(p => (
                <button
                   key={p.id}
                   id={`btn-prod-${p.id}`}
                   onClick={() => setSelectedProduct(p)}
                   className={`w-full text-left p-3 text-[10px] md:text-xs tracking-wider transition-all border rounded-none font-mono cursor-pointer ${selectedProduct.id === p.id ? 'bg-[#27272A] border-[#71717A] text-[#E4E4E7]' : 'bg-transparent border-[#27272A] text-[#71717A] hover:bg-[#151518]'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{p.name}</span>
                    <span className="text-[#0284C7] font-semibold">{formatBRL(p.repassePrice)}/m²</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-1 uppercase truncate font-sans">{p.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111113] border border-[#27272A] p-5 rounded-none">
            <div className="flex justify-between mb-1 font-mono">
              <label className="text-[10px] md:text-xs text-[#71717A] font-bold uppercase tracking-widest">Unidades Ativas em Campo</label>
              <span className="text-[#0284C7] font-bold text-xs">{activeTerritories} Licenciados</span>
            </div>
            <input 
              id="slider-territorios"
              type="range" 
              min="1" 
              max="100" 
              step="1"
              value={activeTerritories}
              onChange={(e) => setActiveTerritories(Number(e.target.value))}
              className="w-full h-1 bg-[#27272A] rounded-none appearance-none cursor-pointer accent-[#0284C7]"
            />
            <div className="flex justify-between mt-2 text-[10px] text-[#71717A] font-mono leading-relaxed uppercase">
              <span>Giro Médio p/ Territory: 150m²/mês</span>
              <span className="text-[#E4E4E7]">Vazão Total: {totalMonthlyVolumeM2}m²</span>
            </div>
          </div>

          <div className="bg-[#0284C7]/5 border border-[#0284C7]/20 p-5 rounded-none space-y-4">
             <div>
               <h4 className="text-[10px] text-[#0284C7] font-bold uppercase tracking-widest mb-2 font-mono">Matriz Aberta de Custos (Documento 08)</h4>
               <p className="text-xs font-light text-[#71717A] font-mono">Custo de Importação (FOB): <span className="text-[#E4E4E7] font-mono font-bold">{formatBRL(selectedProduct.costFOB)} / m²</span></p>
               <p className="text-xs font-light text-[#71717A] font-mono">Spread Operacional Holding: <span className="text-[#E4E4E7] font-mono font-bold">{formatBRL(selectedProduct.spreadHolding)} / m²</span></p>
               <p className="text-xs font-light text-[#71717A] font-mono">Preço Distribuidora BlackShop: <span className="text-[#0284C7] font-mono font-bold">{formatBRL(selectedProduct.repassePrice)} / m²</span></p>
             </div>
             
             <div className="h-px bg-[#27272A]" />
             
             <div className="flex items-start gap-2 text-[#71717A]">
                <Lock size={14} className="text-[#0284C7] shrink-0 mt-0.5" />
                <p className="text-[9px] leading-relaxed uppercase tracking-wider font-mono">
                  <strong className="text-[#E4E4E7] font-black block mb-1">Trava Sistêmica de Bobinas:</strong> 
                  O licenciamento possui trava digital atrelada ao metros quadrados das bobinas. Detecção de películas alternativas desativa remotamente o Córtex conversacional WNO.
                </p>
             </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111113] border border-[#27272A] p-4 flex flex-col justify-center rounded-none font-mono">
                 <span className="text-[9px] text-[#71717A] uppercase tracking-widest mb-1">Custo Adquirido Rede BR</span>
                 <span className="text-sm font-bold text-red-500/85 line-through decoration-red-500/50 tracking-tighter">{formatBRL(traditionalBRMarketCost)}</span>
              </div>
              <div className="bg-[#111113] border border-[#27272A] p-4 flex flex-col justify-center rounded-none font-mono">
                 <span className="text-[9px] text-[#71717A] uppercase tracking-widest mb-1 font-mono">Massa FOB de Importação</span>
                 <span className="text-sm font-bold text-[#E4E4E7] tracking-tighter">{formatBRL(totalCostFOB)}</span>
              </div>
              <div className="bg-[#111113] border border-[#27272A] p-4 flex flex-col justify-center rounded-none font-mono">
                 <span className="text-[9px] text-[#0284C7] uppercase tracking-widest mb-1">Giro BlackShop™</span>
                 <span className="text-sm font-bold text-[#0284C7] tracking-tighter">{formatBRL(totalRepasseRevenue)}</span>
              </div>
              <div className="bg-[#111113] border border-[#27272A] p-4 flex flex-col justify-center border-l-2 border-l-green-500 relative overflow-hidden rounded-none font-mono">
                 <div className="absolute top-0 right-0 p-2"><TrendingUp size={16} className="text-green-500/20" /></div>
                 <span className="text-[9px] text-green-500 uppercase tracking-widest mb-1 font-bold">Dividendo Líquido Pool</span>
                 <span className="text-sm font-bold text-green-400 tracking-tighter">{formatBRL(netPoolDividend)}</span>
              </div>
           </div>

           <div className="bg-[#111113] border border-[#27272A] p-6 flex-1 flex flex-col min-h-[300px] rounded-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                 <div>
                   <span className="text-xs md:text-sm text-[#E4E4E7] uppercase tracking-widest font-black font-sans">Projeções de Performance do Pool Beta</span>
                   <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">Baseado na margem média de {selectedProduct.poolMarginPct}% sobre a queima operacional</p>
                 </div>
                 <div className="flex items-center gap-4 text-[9px] tracking-wider uppercase font-mono">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#0284C7] rounded-none"></div> Volume BlackShop</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-none"></div> Repasse Líquido Sócio Oculto</div>
                 </div>
              </div>
              <div className="flex-1 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGiro" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717A" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717A" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111113', borderColor: '#27272A', borderRadius: '0px' }}
                        itemStyle={{ fontSize: '11px', color: '#E4E4E7' }}
                        labelStyle={{ color: '#71717A', fontSize: '9px', fontFamily: 'monospace' }}
                        formatter={(val: number) => [formatBRL(val)]}
                      />
                      <Area type="monotone" dataKey="repasse" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#colorGiro)" activeDot={{ r: 5, fill: '#0284C7', stroke: '#111113', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="dividendo" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorDiff)" activeDot={{ r: 5, fill: '#22c55e', stroke: '#111113', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
