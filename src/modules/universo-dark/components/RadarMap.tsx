import React, { useState } from 'react';
import { MapPin, ShieldCheck, Activity, Award, ArrowUpRight, Cpu, FileCheck } from 'lucide-react';
import { CITIES_LIST } from '../../../data/universo-dark-data';
import { createAuditHash } from '../services/darkLedger';

interface RadarMapProps {
  cities: typeof CITIES_LIST;
  onInvestInScenario: (poolId: string) => void;
}

export const RadarMap: React.FC<RadarMapProps> = ({ cities, onInvestInScenario }) => {
  const [selectedPole, setSelectedPole] = useState<string>('Santos (SP)');
  const [isAporting, setIsAporting] = useState<boolean>(false);
  const [aportSuccess, setAportSuccess] = useState<boolean>(false);

  // Additional telemetry data for each selected pole plaza to demonstrate Bloomberg level richness
  const getPoleTelemetry = (city: string) => {
    switch(city) {
      case 'Santos (SP)':
        return {
          status: 'Ocupado / Em Operação',
          activeM2: '145.4 m²',
          yieldRate: '12.8%',
          digitalOrbit: 'Ativa & Pré-visionada',
          cplRate: 'R$ 3.50',
          monthlyLeads: '920 Leads/mês',
          hash: '0x8f2a99e82110ea82119c39ea...df1',
          goldTier: true,
          benchmarkPercent: '98%',
          operationalEfficiency: '97.2%'
        };
      case 'Sorocaba (SP)':
        return {
          status: 'Ocupado / Em Operação',
          activeM2: '92.1 m²',
          yieldRate: '11.4%',
          digitalOrbit: 'Ativa & Pré-visionada',
          cplRate: 'R$ 4.10',
          monthlyLeads: '740 Leads/mês',
          hash: '0x321a00f8219c892b10ac22fb...df0',
          goldTier: true,
          benchmarkPercent: '94%',
          operationalEfficiency: '95.8%'
        };
      case 'São Paulo (SP)':
        return {
          status: 'Bloqueado / Transações Ativas',
          activeM2: '382.5 m²',
          yieldRate: '14.2%',
          digitalOrbit: 'Ativa & Integrada',
          cplRate: 'R$ 4.80',
          monthlyLeads: '1250 Leads/mês',
          hash: '0x71fa99e21010ea82209c12ea...df9',
          goldTier: true,
          benchmarkPercent: '100%',
          operationalEfficiency: '99.1%'
        };
      case 'Campina Grande (PB)':
        return {
          status: 'Centro de TI / Ocupado',
          activeM2: '64.0 m²',
          yieldRate: '15.1%',
          digitalOrbit: 'Ativa & Otimizada',
          cplRate: 'R$ 3.20',
          monthlyLeads: '850 Leads/mês',
          hash: '0x12fa9981a2010eb312bc12ef...dfc',
          goldTier: true,
          benchmarkPercent: '92%',
          operationalEfficiency: '98.5%'
        };
      case 'Porto Alegre (RS)':
        return {
          status: 'Em Triagem de Capitais',
          activeM2: '0.0 m²',
          yieldRate: '---',
          digitalOrbit: 'Aprovisionando Redes',
          cplRate: 'R$ 4.90 (Est.)',
          monthlyLeads: '---',
          hash: '0x99fa189cda928ea112cb92ab...dfd',
          goldTier: false,
          benchmarkPercent: '---',
          operationalEfficiency: '---'
        };
      case 'Rio de Janeiro (RJ)':
        return {
          status: 'Ocupado / Em Operação',
          activeM2: '210.3 m²',
          yieldRate: '10.9%',
          digitalOrbit: 'Ativa & Pré-visionada',
          cplRate: 'R$ 5.20',
          monthlyLeads: '610 Leads/mês',
          hash: '0xbc92a82fca92167a80b99c15...dfe',
          goldTier: false,
          benchmarkPercent: '89%',
          operationalEfficiency: '91.4%'
        };
      case 'Salvador (BA)':
        return {
          status: 'Em Triagem de Captação',
          activeM2: '0.0 m²',
          yieldRate: '---',
          digitalOrbit: 'Aprovisionando Redes',
          cplRate: 'R$ 3.50 (Est.)',
          monthlyLeads: '---',
          hash: '0x41ab9981ea209bcae12739ea...dff',
          goldTier: false,
          benchmarkPercent: '---',
          operationalEfficiency: '---'
        };
      default:
        return {
          status: 'Disponível / Livre para Captação',
          activeM2: '0.0 m²',
          yieldRate: '---',
          digitalOrbit: 'Não Aprovisionada',
          cplRate: '---',
          monthlyLeads: '---',
          hash: 'IMMUTABLE-STANDBY-HASH',
          goldTier: false,
          benchmarkPercent: '---',
          operationalEfficiency: '---'
        };
    }
  };

  const handleApplyAport = () => {
    setIsAporting(true);
    setTimeout(() => {
      setIsAporting(false);
      setAportSuccess(true);
      onInvestInScenario('alpha_license');
      setTimeout(() => setAportSuccess(false), 4000);
    }, 1500);
  };

  const telemetry = getPoleTelemetry(selectedPole);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6  bg-[#131314] p-6 md:p-8 rounded-none border border-[#444746]/60 transition-all font-sans">
      
      {/* Camada A: O Mapa de Radar Territorial (Interactive Grid Widget) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest text-blue-500 bg-white/5 px-2 py-0.5 rounded-none">
            CAMADA A: RADAR DE OPERAÇÕES
          </span>
          <h2 className="text-xl text-white font-bold tracking-tight mt-2">
            Ocupação Territorial de Elite
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Monitore o efeito de rede em tempo real. Cidades em verde representam operação imobilizada com repasse BlackShop ativado.
          </p>
        </div>

        {/* Tactical interactive grid of plazas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
          {cities.map((item) => {
            const isSelected = selectedPole === item.city;
            const isOccupied = item.status.includes('Bloqueado') || item.status.includes('Ocupado') || item.status.includes('Operação');
            const isTriagem = item.status.includes('Triagem');

            return (
              <button
                key={item.city}
                onClick={() => setSelectedPole(item.city)}
                className={`p-4 rounded-none text-left border relative overflow-hidden transition-all duration-300 group cursor-pointer ${
                  isSelected 
                    ? 'border-[#444746]/60 bg-white/[0.02]' 
                    : 'bg-white/[0.02] border-[#444746]/60 hover:border-white/20'
                }`}
              >
                {/* Micro operational status dot */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-none ${
                    isOccupied ? 'bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]' : isTriagem ? 'bg-amber-500' : 'bg-neutral-800'
                  }`} />
                  <span className="text-[10px] text-neutral-500 font-mono scale-90 uppercase tracking-widest">
                    {isOccupied ? 'OPR' : isTriagem ? 'TRG' : 'LVR'}
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="text-sm text-neutral-300 font-medium block group-hover:text-white transition-colors truncate">
                    {item.city}
                  </span>
                  <span className="text-xs text-neutral-500 block truncate leading-relaxed font-light">
                    {item.status}
                  </span>
                  {item.key && (
                    <span className="text-[10px] text-neutral-600 font-mono block tracking-widest uppercase mt-0.5">
                      {item.key.slice(-8)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Map visualization legend */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-white"></span>
            <span>Unidade Operatória Ativa (+Yield)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-amber-500"></span>
            <span>Triagem e Auditoria Prévia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-[#0F172A]"></span>
            <span>Praça Admissível para Aporte</span>
          </div>
        </div>
      </div>

      {/* Camada C: Pop-up de Telemetria e Botão de Ação (Aceleração) */}
      <div className="lg:col-span-5 p-6 rounded-none border border-[#444746]/60 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs text-neutral-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Telemetria de Ativo
            </span>
            {telemetry.goldTier && (
              <span className="text-xs text-neutral-400 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-none border border-[#444746]/60 border-amber-500/20 flex items-center gap-1">
                <Award className="w-3 h-3" />
                PRAÇA DE ELITE (TIER GOLD)
              </span>
            )}
          </div>

          <h3 className="text-lg text-white font-bold mt-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-neutral-300 text-neutral-300" />
            {selectedPole}
          </h3>

          {/* Core numerical specs - Bloomberg style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-white/[0.02] border border-[#444746]/60 p-4">
            <div className="border-b border-[#444746]/60 sm:border-0 pb-2">
              <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-widest">Volume Instalado</span>
              <span className="text-xl text-white font-light tracking-tight">{telemetry.activeM2}</span>
            </div>
            <div className="border-b border-[#444746]/60 sm:border-0 pb-2">
              <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-widest">Rendimento (Yield)</span>
              <span className="text-xl text-white font-light text-zinc-300 tracking-tight">{telemetry.yieldRate}</span>
            </div>
            <div className="border-b border-[#444746]/60 sm:border-0 pb-2">
              <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-widest">Nível Lead CPL</span>
              <span className="text-xl text-white font-light tracking-tight">{telemetry.cplRate}</span>
            </div>
            <div className="border-b border-[#444746]/60 sm:border-0 pb-2">
              <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-widest">Fluxo e Órbita</span>
              <span className="text-sm text-indigo-400 font-light block tracking-tight mt-1">{telemetry.digitalOrbit}</span>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="mt-4 bg-[#1e1f20] p-4 rounded-none border border-[#444746]/60 flex flex-col sm:flex-row items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] text-white/80 uppercase font-mono tracking-widest block">Hash de Governança Mutável (Polo)</span>
              <code className="text-xs text-white/70 font-mono tracking-wider break-all block">{telemetry.hash}</code>
              <span className="text-[10px] text-neutral-500 block italic leading-relaxed mt-1">✓ Registro de compliance certificado pela holding WINF Partners.</span>
            </div>
          </div>
        </div>

        {/* Camada C: Botão de Ação Aportar no Cenário C com Efeito Glow de Luxo */}
        <div className="space-y-4 pt-4 border-t border-[#444746]/60">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block">Camada C: Aceleração Regional</span>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Injete liquidez direta no escoamento de Window Film de altíssima margem para este polo.
            </p>
          </div>

          {aportSuccess ? (
            <div className="w-full bg-white/[0.04] border border-[#444746]/60 p-4 rounded-none text-left flex flex-col items-center">
              <FileCheck className="w-6 h-6 text-white mb-2" />
              <span className="text-sm text-zinc-300 font-medium block">Aporte Pré-Verificado com Sucesso</span>
              <span className="text-xs text-white/70 block text-center mt-1">Operação adicionada ao ledger de transações ativas.</span>
            </div>
          ) : (
            <button
              onClick={handleApplyAport}
              disabled={isAporting}
              className={`w-full py-4 px-4 rounded-none text-xs font-black uppercase tracking-[0.15em] text-black transition-all cursor-pointer relative overflow-hidden group ${
                isAporting 
                  ? 'bg-white/[0.02]0 pointer-events-none' 
                  : 'bg-white hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)]'
              }`}
            >
              <span className="relative flex items-center justify-center gap-2 z-10">
                {isAporting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-black" />
                    <span>Processando Assign de Cota...</span>
                  </>
                ) : (
                  <>
                    <span>Aportar no Cenário C [WINF.ALPHA]</span>
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </>
                )}
              </span>
            </button>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span>Quota mínima: BRL 15.000,00</span>
            <span>•</span>
            <span>Retorno de Bench Santos Ativado</span>
          </div>
        </div>

      </div>

    </div>
  );
};
