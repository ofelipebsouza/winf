import { useState, useEffect } from 'react';
import { 
  GROWTH_DATA, 
  ASSET_LIGHT_STATUS, 
  RECENT_TRANSACTIONS, 
  W12_SEATS_DATA, 
  CITIES_LIST 
} from '../../../data/universo-dark-data';
import { createAuditHash } from '../services/darkLedger';

export interface TickerItem {
  id: string;
  source: string;
  orderId: string;
  volumeM2: number;
  productLine: string;
  timestamp: string;
  yieldBRL: string;
}

export interface DarkMetrics {
  valuation: number;
  yieldYTD: number;
  m2BurnedToday: number;
  velocityIndex: number; // m2 per minute across network
  goldSellersCount: number;
}

export function useDarkData() {
  const [metrics, setMetrics] = useState<DarkMetrics>({
    valuation: 75000000, // R$ 75M valuation base
    yieldYTD: 2478900.50, // YTD distributions
    m2BurnedToday: 642.85,
    velocityIndex: 4.12,
    goldSellersCount: 3,
  });

  const [activeTickers, setActiveTickers] = useState<TickerItem[]>([
    { id: 't1', source: 'SANTOS', orderId: 'O.S. #8892', volumeM2: 14.5, productLine: 'NEOSKIN™ PPF', timestamp: 'AGORA', yieldBRL: '2.450,00' },
    { id: 't2', source: 'SOROCABA', orderId: 'O.S. #8890', volumeM2: 8.2, productLine: 'WINF™ PREMIUM QUALITY WINDOWFILM', timestamp: '1m atrás', yieldBRL: '1.180,00' },
    { id: 't3', source: 'SÃO PAULO', orderId: 'O.S. #8889', volumeM2: 24.0, productLine: 'AeroCore™ STEALTH' , timestamp: '3m atrás', yieldBRL: '4.800,00' },
    { id: 't4', source: 'CAMPINA GRANDE', orderId: 'O.S. #8885', volumeM2: 6.5, productLine: 'NEOSKIN™ PPF', timestamp: '6m atrás', yieldBRL: '1.050,00' },
  ]);

  const [recentTransactions, setRecentTransactions] = useState(RECENT_TRANSACTIONS);
  const [cities, setCities] = useState(CITIES_LIST);

  // Simulated WebSocket/Real-time data pump
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Dynamic increase of m2 installed globally (+0.1 to +0.8m2 per tick)
      const incM2 = parseFloat((Math.random() * 0.7 + 0.1).toFixed(2));
      
      // 2. Correlation between m2 burned and valuation yield
      const incYield = parseFloat((incM2 * 125).toFixed(2));

      setMetrics(prev => ({
        ...prev,
        m2BurnedToday: parseFloat((prev.m2BurnedToday + incM2).toFixed(2)),
        yieldYTD: parseFloat((prev.yieldYTD + incYield).toFixed(2)),
        valuation: prev.valuation + Math.floor(incM2 * 8),
        velocityIndex: parseFloat((3.8 + Math.random() * 0.8).toFixed(2))
      }));

      // 3. Occasionally generate a new Live Ticker trade "O.S. Executada" (15% chance per tick)
      if (Math.random() < 0.2) {
        const sources = ['SANTOS', 'SOROCABA', 'SÃO PAULO', 'CAMPINA GRANDE', 'PORTO ALEGRE', 'RIO DE JANEIRO'];
        const lineOptions = ['NEOSKIN™ PPF', 'WINF™ PREMIUM QUALITY WINDOWFILM', 'AeroCore™ STEALTH TECHNOLOGY WINDOW FILM'];
        const chosenSource = sources[Math.floor(Math.random() * sources.length)];
        const chosenLine = lineOptions[Math.floor(Math.random() * lineOptions.length)];
        const m2 = parseFloat((Math.random() * 18 + 4).toFixed(1));
        const val = (m2 * 180).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const osId = Math.floor(Math.random() * 2000) + 8000;

        const newTicker: TickerItem = {
          id: `t_${Date.now()}`,
          source: chosenSource,
          orderId: `O.S. #${osId}`,
          volumeM2: m2,
          productLine: chosenLine,
          timestamp: 'AGORA',
          yieldBRL: val
        };

        setActiveTickers(prev => {
          // Keep top 6 items
          const updated = [newTicker, ...prev.map(p => ({ ...p, timestamp: p.timestamp === 'AGORA' ? '1m atrás' : p.timestamp }))];
          if (updated.length > 6) {
            updated.pop();
          }
          return updated;
        });

        // Add a corresponding transaction entry with a cryptographic hash for elite ledger audits
        const txId = `tx_${Date.now().toString().slice(-4)}`;
        const newTx = {
          id: txId,
          user: `Investidor #${Math.floor(Math.random() * 300).toString().padStart(3, '0')}`,
          action: `O.S. #${osId} Executada [${chosenSource}]`,
          value: `BRL ${val}`,
          time: 'Agora mesmo',
          hash: createAuditHash(m2 * 180, m2, `OS-${osId}`)
        };

        setRecentTransactions(prev => [newTx, ...prev.slice(0, 4)]);

        // Temporarily activate the city status to "Em Operação" in heatmap list if applicable
        setCities(prev => 
          prev.map(c => {
            if (c.city.toUpperCase().includes(chosenSource)) {
              return { ...c, status: 'Em Operação' };
            }
            return c;
          })
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    activeTickers,
    recentTransactions,
    cities,
    growthData: GROWTH_DATA,
    assetLightStatus: ASSET_LIGHT_STATUS,
    seatsData: W12_SEATS_DATA,
  };
}
