import { addArsenalAsset } from '../lib/arsenalUtils';
import React, { useState, useEffect, useMemo } from 'react';
import { generateGeminiResponse } from '../lib/gemini';
import { motion } from 'motion/react';
import { 
  MapPin, Target, TrendingUp, Users, Shield, Navigation, Layers, Info, ExternalLink, Globe, X, Plus, Trash2, 
  Sun, Cloud, CloudRain, CloudSun, Moon, CloudDrizzle, Thermometer, Droplets, Wind, CloudLightning,
  Truck, RefreshCw, Check, Cpu
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Popup, Marker, CircleMarker, Polyline, useMap } from 'react-leaflet';

import { useWinf } from '../contexts/WinfContext';
import { Territory, INITIAL_TERRITORIES } from './AdminTerritories';
import { ativarUnidadeComEstoque, definirHubLogistico, calcularDistancia, vincularUnidadeAoHub, WNO, atualizarMalhaLogistica, transferirLastro, confirmarRecebimentoLastro, HUB_CONFIG, calcularFreteInterno, obterHubsAtivosLogistica } from '../lib/wnoEngine';

export interface WeatherDay {
  day: string;
  temp: number;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface WeatherHour {
  time: string;
  temp: number;
  icon: string;
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Snowy' | 'Stormy';
  conditionName: string;
  uvIndex: number;
  irIndex: string;
  relativeHumidity: string;
  windSpeed: string;
  thermalAdvice: string;
  recommendedProduct: { name: string; line: string; benefit: string; id: string };
  hourly: WeatherHour[];
  weekly: WeatherDay[];
}

export const METEOROLOGY_DATA: Record<string, WeatherData> = {
  'Santos': {
    temp: 20,
    condition: 'Rainy',
    conditionName: 'Chuvoso com Alerta Climático',
    uvIndex: 2,
    irIndex: '47%',
    relativeHumidity: '94%',
    windSpeed: '26 km/h',
    thermalAdvice: '🚨 ALERTA GERAL: Santos está sob forte chuva e rajadas de vento! Ótimo momento para vender e instalar a Linha WINF Select de Segurança (blindagem anti-vandalismo e estilhaçamento contra intempéries climáticas) para as residências no canal da Ponta da Praia ou Gonzaga.',
    recommendedProduct: { name: 'Winf Select™ Segurança', line: 'Linha Select', benefit: 'Blindagem anti-vandalismo e contra intempéries climáticas.', id: 'select-security' },
    hourly: [
      { time: '09:00', temp: 19, icon: 'cloud-rain' },
      { time: '12:00', temp: 20, icon: 'cloud-lightning' },
      { time: '15:00', temp: 20, icon: 'cloud-rain' },
      { time: '18:00', temp: 18, icon: 'cloud' },
      { time: '21:00', temp: 17, icon: 'moon' },
    ],
    weekly: [
      { day: 'Hoje', temp: 20, high: 22, low: 17, condition: 'Chuva Forte', icon: 'cloud-rain' },
      { day: 'Sex', temp: 21, high: 23, low: 18, condition: 'Chuva Leve', icon: 'cloud-drizzle' },
      { day: 'Sáb', temp: 22, high: 24, low: 18, condition: 'Parcialmente Nublado', icon: 'cloud-sun' },
      { day: 'Dom', temp: 25, high: 27, low: 19, condition: 'Ensolarado', icon: 'sun' },
      { day: 'Seg', temp: 26, high: 28, low: 20, condition: 'Ensolarado', icon: 'sun' },
      { day: 'Ter', temp: 27, high: 29, low: 21, condition: 'Ensolarado', icon: 'sun' },
      { day: 'Qua', temp: 28, high: 30, low: 22, condition: 'Ensolarado', icon: 'sun' },
    ]
  },
  'São Paulo': {
    temp: 24,
    condition: 'Cloudy',
    conditionName: 'Parcialmente Nublado',
    uvIndex: 5,
    irIndex: '62%',
    relativeHumidity: '55%',
    windSpeed: '12 km/h',
    thermalAdvice: 'Dia ameno com picos de radiação difusa. Sugira a película Winf Select Dual Reflect para controle de ofuscamento nas áreas de escritório corporativas do Itaim Bibi.',
    recommendedProduct: { name: 'Winf Select™ Dual Reflect', line: 'Linha Select', benefit: 'Privacidade reflexiva externa extrema e nitidez interna.', id: 'select-dual-reflect' },
    hourly: [
      { time: '09:00', temp: 21, icon: 'cloud' },
      { time: '12:00', temp: 24, icon: 'cloud-sun' },
      { time: '15:00', temp: 25, icon: 'cloud-sun' },
      { time: '18:00', temp: 22, icon: 'cloud' },
      { time: '21:00', temp: 19, icon: 'moon' },
    ],
    weekly: [
      { day: 'Hoje', temp: 24, high: 25, low: 17, condition: 'Nublado', icon: 'cloud' },
      { day: 'Sex', temp: 26, high: 27, low: 18, condition: 'Ensolarado', icon: 'sun' },
      { day: 'Sáb', temp: 23, high: 24, low: 16, condition: 'Chuva Leve', icon: 'cloud-rain' },
      { day: 'Dom', temp: 19, high: 20, low: 14, condition: 'Garôa', icon: 'cloud-drizzle' },
      { day: 'Seg', temp: 22, high: 23, low: 15, condition: 'Nublado', icon: 'cloud' },
      { day: 'Ter', temp: 25, high: 26, low: 17, condition: 'Claro', icon: 'sun' },
      { day: 'Qua', temp: 26, high: 28, low: 18, condition: 'Ensolarado', icon: 'sun' },
    ]
  }
};

export const getWeatherData = (cityName: string): WeatherData => {
  const norm = (cityName || 'Santos').trim();
  const matched = METEOROLOGY_DATA[norm] || METEOROLOGY_DATA[Object.keys(METEOROLOGY_DATA).find(k => k.toLowerCase() === norm.toLowerCase()) || 'Santos'];
  
  if (matched) return matched;
  
  // Custom deterministic generator based on city name seed
  const charSum = norm.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseT = 20 + (charSum % 14); // temp between 20 and 33
  const condIdx = charSum % 3;
  const conditions: ('Sunny' | 'Rainy' | 'Cloudy')[] = ['Sunny', 'Cloudy', 'Rainy'];
  const condition = conditions[condIdx];
  const conditionName = condition === 'Sunny' ? 'Ensolarado' : condition === 'Cloudy' ? 'Parcialmente Nublado' : 'Chuva Moderada';
  const uv = condition === 'Sunny' ? 8 + (charSum % 4) : condition === 'Cloudy' ? 4 + (charSum % 3) : 1 + (charSum % 3);
  const ir = `${65 + (charSum % 25)}%`;
  
  return {
    temp: baseT,
    condition,
    conditionName,
    uvIndex: uv,
    irIndex: ir,
    relativeHumidity: `${60 + (charSum % 25)}%`,
    windSpeed: `${10 + (charSum % 15)} km/h`,
    thermalAdvice: condition === 'Sunny' 
      ? `Índice de radiação solar IR de ${ir} e radiação UV ${uv} (ALTO). Perfeito para blindagem solar com tecnologia Nano Cerâmica!` 
      : 'Clima ameno na região. Excelente período para agendar as instalações da linha WINF Select de proteção.',
    recommendedProduct: condition === 'Sunny' 
      ? { name: 'Winf Select™ Invisible', line: 'Linha Select', benefit: 'Rejeição de calor imbatível sem alterar a fachada.', id: 'select-invisible' }
      : { name: 'Winf Select™ Segurança', line: 'Linha Select', benefit: 'Blindagem anti-vandalismo e contra intempéries climáticas.', id: 'select-security' },
    hourly: [
      { time: '09:00', temp: baseT - 3, icon: condition === 'Sunny' ? 'sun' : 'cloud' },
      { time: '12:00', temp: baseT, icon: condition === 'Sunny' ? 'sun' : 'cloud-sun' },
      { time: '15:00', temp: baseT + 2, icon: condition === 'Sunny' ? 'sun' : 'cloud' },
      { time: '18:00', temp: baseT - 1, icon: 'cloud' },
      { time: '21:00', temp: baseT - 4, icon: 'moon' },
    ],
    weekly: [
      { day: 'Hoje', temp: baseT, high: baseT + 2, low: baseT - 4, condition: conditionName, icon: condition === 'Sunny' ? 'sun' : 'cloud' },
      { day: 'Amanhã', temp: baseT + 1, high: baseT + 3, low: baseT - 3, condition: 'Parcialmente Nublado', icon: 'cloud-sun' },
      { day: 'Sáb', temp: baseT - 2, high: baseT, low: baseT - 5, condition: 'Chuva', icon: 'cloud-rain' },
      { day: 'Dom', temp: baseT + 1, high: baseT + 2, low: baseT - 2, condition: 'Ensolarado', icon: 'sun' },
      { day: 'Seg', temp: baseT, high: baseT + 1, low: baseT - 3, condition: 'Estável', icon: 'sun' },
    ]
  };
};

export const MASTER_TERRITORIES: Record<string, any> = {
  'Santos': {
    city: 'Santos',
    state: 'SP',
    mapCenter: [-23.9688, -46.3330],
    bairros: [
      { name: 'Gonzaga', status: 'Dominando', share: 88, potential: 'Alto', color: '#FFFFFF', tier: 'A+', demographic: 'Alta Renda / Executive', ticket: 'R$ 2.8k', volume: 'Alto', center: [-23.9688, -46.3330], radius: 700 },
      { name: 'Boqueirão', status: 'Expansão', share: 22, potential: 'Crítico', color: '#FACC15', tier: 'B', demographic: 'Residencial / Comercial', ticket: 'R$ 1.2k', volume: 'Médio', center: [-23.9734, -46.3214], radius: 650 },
      { name: 'Ponta da Praia', status: 'Líder', share: 94, potential: 'Saturado', color: '#FFFFFF', tier: 'A++', demographic: 'Corporate / Ultra High', ticket: 'R$ 4.5k', volume: 'Extremo', center: [-23.9859, -46.3023], radius: 900 },
      { name: 'Embaré', status: 'Oportunidade', share: 12, potential: 'Virene', color: '#60A5FA', tier: 'A', demographic: 'Lifestyle / Creative', ticket: 'R$ 1.9k', volume: 'Médio', center: [-23.9744, -46.3150], radius: 600 },
      { name: 'Vila Rica', status: 'Prospecção', share: 5, potential: 'Vasto', color: '#60A5FA', tier: 'A+', demographic: 'Mansões / Condomínios', ticket: 'R$ 3.2k', volume: 'Latente', center: [-23.9575, -46.3267], radius: 550 },
      { name: 'José Menino', status: 'Competindo', share: 45, potential: 'Médio', color: '#FACC15', tier: 'B+', demographic: 'Mixed / Young Prof.', ticket: 'R$ 1.6k', volume: 'Alto', center: [-23.9691, -46.3475], radius: 500 },
    ],
    insights: [
      { 
        type: 'critical', 
        title: 'José Menino: GAP de Conversão', 
        desc: 'O bairro José Menino possui alto volume de buscas por "proteção solar" mas 0% de anúncios WINF ativos no raio de 3km.',
        action: 'Disparar Campanha de Dominação (Meta Ads)' 
      },
      { 
        type: 'opportunity', 
        title: 'Vila Rica: Território Virgem', 
        desc: 'Identificamos 12 novos condomínios de luxo em fase de entrega. Potencial de R$ 450k em serviços de arquitetura.',
        action: 'Enviar Prospector Digital (LinkedIn/Direct)' 
      },
      { 
        type: 'warning', 
        title: 'Invasão Detectada: Gonzaga', 
        desc: 'Marca B aumentou o lance por palavra-chave "WINF" em 45%. Blindagem tática necessária.',
        action: 'Aumentar Bid de Defesa (Winf Brain Auth)' 
      }
    ]
  },
  'São Paulo': {
    city: 'São Paulo',
    state: 'SP',
    mapCenter: [-23.5843, -46.6795],
    bairros: [
      { name: 'Moema', status: 'Dominando', share: 88, potential: 'Alto', color: '#FFFFFF', tier: 'A+', demographic: 'Alta Renda / Executive', ticket: 'R$ 2.8k', volume: 'Alto', center: [-23.6062, -46.6578], radius: 1000 },
      { name: 'Santana', status: 'Expansão', share: 22, potential: 'Crítico', color: '#FACC15', tier: 'B', demographic: 'Residencial / Comercial', ticket: 'R$ 1.2k', volume: 'Médio', center: [-23.5041, -46.6234], radius: 800 },
      { name: 'Vila Madalena', status: 'Oportunidade', share: 12, potential: 'Virene', color: '#60A5FA', tier: 'A', demographic: 'Lifestyle / Creative', ticket: 'R$ 1.9k', volume: 'Médio', center: [-23.5539, -46.6912], radius: 700 },
      { name: 'Itaim Bibi', status: 'Líder', share: 94, potential: 'Saturado', color: '#FFFFFF', tier: 'A++', demographic: 'Corporate / Ultra High', ticket: 'R$ 4.5k', volume: 'Extremo', center: [-23.5843, -46.6795], radius: 1200 },
      { name: 'Pinheiros', status: 'Competindo', share: 45, potential: 'Médio', color: '#FACC15', tier: 'B+', demographic: 'Mixed / Young Prof.', ticket: 'R$ 1.6k', volume: 'Alto', center: [-23.5658, -46.6946], radius: 950 },
      { name: 'Morumbi', status: 'Prospecção', share: 5, potential: 'Vasto', color: '#60A5FA', tier: 'A+', demographic: 'Mansões / Condomínios', ticket: 'R$ 3.2k', volume: 'Latente', center: [-23.6265, -46.7208], radius: 1100 },
    ],
    insights: [
      { 
        type: 'critical', 
        title: 'Zona Norte: GAP de Conversão', 
        desc: 'O bairro Santana possui alto volume de buscas por "proteção solar" mas 0% de anúncios WINF ativos no raio de 3km.',
        action: 'Disparar Campanha de Dominação (Meta Ads)' 
      },
      { 
        type: 'opportunity', 
        title: 'Morumbi: Território Virgem', 
        desc: 'Identificamos 12 novos condomínios de luxo em fase de entrega. Potencial de R$ 450k em serviços de arquitetura.',
        action: 'Enviar Prospector Digital (LinkedIn/Direct)' 
      },
      { 
        type: 'warning', 
        title: 'Invasão Detectada: Itaim Bibi', 
        desc: 'Marca B aumentou o lance por palavra-chave "WINF" em 45%. Blindagem tática necessária.',
        action: 'Aumentar Bid de Defesa (Winf Brain Auth)' 
      }
    ]
  }
};

export const CITY_COORDS: Record<string, [number, number]> = {
  // SP
  'Santos': [-23.9688, -46.3330],
  'Praia Grande': [-24.0058, -46.4028],
  'Guarujá': [-23.9931, -46.2564],
  'Cubatão': [-23.8828, -46.4250],
  'Bertioga': [-23.8542, -46.1389],
  'São Vicente': [-23.9631, -46.3911],
  'São Paulo': [-23.5505, -46.6333],
  'São Paulo (Itaim Bibi)': [-23.5843, -46.6795],
  'São Paulo (Moema/Morumbi)': [-23.6062, -46.6578],
  'São Paulo (Santana/ZN)': [-23.5041, -46.6234],
  'Campinas': [-22.9056, -47.0608],
  'São José dos Campos': [-23.2237, -45.9009],
  'Ribeirão Preto': [-21.1775, -47.8103],
  'Sorocaba': [-23.5017, -47.4581],
  'Jundiaí': [-23.1857, -46.8978],
  'Santo André': [-23.6666, -46.5283],
  'São Bernardo do Campo': [-23.6939, -46.5650],
  'São Caetano do Sul': [-23.6225, -46.5489],
  'Barueri / Alphaville': [-23.5062, -46.8761],
  'Mogi das Cruzes': [-23.5228, -46.1883],
  'Piracicaba': [-22.7253, -47.6492],
  'Bauru': [-22.3147, -49.0606],
  'Marília': [-22.2139, -49.9458],
  'São José do Rio Preto': [-20.8114, -49.3758],
  'Presidente Prudente': [-22.1214, -51.3853],
  'Franca': [-20.5386, -47.4008],
  'Limeira': [-22.5647, -47.4017],
  'Campina Grande': [-7.2245, -35.8767],

  // RJ
  'Rio de Janeiro (Barra/Recreio)': [-23.0003, -43.3658],
  'Rio de Janeiro (Copacabana/Ipanema)': [-22.9711, -43.1843],
  'Niterói': [-22.8858, -43.1153],
  'Petrópolis': [-22.5112, -43.1778],
  'Volta Redonda': [-22.5208, -44.1136],
  'Nova Iguaçu': [-22.7567, -43.4608],
  'Cabo Frio': [-22.8812, -42.0250],
  'Campos dos Goytacazes': [-21.7511, -41.3258],

  // MG
  'Belo Horizonte (Lourdes/Savassi)': [-19.9281, -43.9389],
  'Nova Lima (Alphaville)': [-20.0631, -43.8953],
  'Contagem': [-19.9322, -44.0539],
  'Uberlândia': [-18.9186, -48.2772],
  'Juiz de Fora': [-21.7642, -43.3497],
  'Uberaba': [-19.7431, -47.9328],
  'Ipatinga': [-19.4678, -42.5350],
  'Governador Valadares': [-18.8497, -41.9492],
  'Montes Claros': [-16.7350, -43.8617],
  'Divinópolis': [-20.1436, -44.8875],

  // ES
  'Vitória': [-20.3155, -40.3128],
  'Vila Velha': [-20.3297, -40.2917],
  'Linhares': [-19.3911, -40.0719],

  // PR
  'Curitiba (Batel/Champagnat)': [-25.4422, -49.2892],
  'Londrina': [-23.3105, -51.1628],
  'Maringá': [-23.4210, -51.9331],
  'Cascavel': [-24.9578, -53.4597],
  'Foz do Iguaçu': [-25.5478, -54.5881],
  'Ponta Grossa': [-25.0950, -50.1619],
  'São José dos Pinhais': [-25.5342, -49.1925],

  // RS
  'Porto Alegre (Moinhos de Vento)': [-30.0242, -51.2011],
  'Caxias do Sul': [-29.1678, -51.1794],
  'Canoas': [-29.9131, -51.1850],
  'Pelotas': [-31.7658, -52.3375],
  'Santa Maria': [-29.6842, -53.8069],
  'Passo Fundo': [-28.2586, -52.4114],

  // SC
  'Florianópolis (Jurerê/Centro)': [-27.5954, -48.5480],
  'Joinville': [-26.3015, -48.8472],
  'Blumenau': [-26.9189, -49.0658],
  'Balneário Camboriú': [-26.9931, -48.6353],
  'Itajaí': [-26.9078, -48.6619],
  'Criciúma': [-28.6775, -49.3697],
  'Chapecó': [-27.1011, -52.6106],

  // Nordeste
  'Salvador (Caminho das Árvores)': [-12.9814, -38.4550],
  'Feira de Santana': [-12.2664, -38.9661],
  'Vitória da Conquista': [-14.8611, -40.8411],
  'Recife (Boa Viagem)': [-8.1147, -34.8953],
  'Caruaru': [-8.2831, -35.9753],
  'Petrolina': [-9.3986, -40.5008],
  'João Pessoa (Altiplano)': [-7.1158, -34.8211],
  'Fortaleza (Aldeota/Meireles)': [-3.7319, -38.4967],
  'Juazeiro do Norte': [-7.2244, -39.3142],
  'Natal (Tirol)': [-5.7994, -35.2012],
  'Mossoró': [-5.1889, -37.3442],
  'Maceió (Ponta Verde)': [-9.6644, -35.7042],
  'Aracaju (Jardins)': [-10.9311, -37.0542],
  'Teresina': [-5.0920, -42.8038],
  'São Luís (Ponta d\'Areia)': [-2.5011, -44.3142],
  'Imperatriz': [-5.5264, -47.4811],

  // Norte
  'Belém (Reduto)': [-1.4558, -48.4902],
  'Ananindeua': [-1.3658, -48.3753],
  'Manaus (Adrianópolis)': [-3.1022, -60.0108],
  'Porto Velho': [-8.7612, -63.9039],
  'Rio Branco': [-9.9754, -67.8080],
  'Boa Vista': [2.8235, -60.6758],
  'Macapá': [0.0355, -51.0705],

  // Centro-Oeste
  'Brasília (Lago Sul)': [-15.8258, -47.8522],
  'Goiânia (Setor Marista)': [-16.6997, -49.2611],
  'Anápolis': [-16.3267, -48.9528],
  'Rio Verde': [-17.7911, -50.9208],
  'Cuiabá (Jardim Américas)': [-15.6028, -56.0750],
  'Rondonópolis': [-16.4678, -54.6353],
  'Sinop': [-11.8589, -55.5011],
  'Campo Grande': [-20.4697, -54.6201],
  'Dourados': [-22.2239, -54.8058]
};

export const getCityCoords = (city: string, state: string): [number, number] => {
  if (CITY_COORDS[city]) return CITY_COORDS[city];
  const key = Object.keys(CITY_COORDS).find(k => k.toLowerCase().includes(city.toLowerCase()));
  if (key) return CITY_COORDS[key];
  
  const charSum = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const latOffset = (charSum % 100) / 100 - 0.5;
  const lngOffset = (charSum % 91) / 91 - 0.5;
  
  let baseCoords: [number, number] = [-15.7975, -47.8919];
  if (state === 'SP') baseCoords = [-23.5505, -46.6333];
  else if (state === 'RJ') baseCoords = [-22.9068, -43.1729];
  else if (state === 'MG') baseCoords = [-19.9173, -43.9345];
  else if (state === 'ES') baseCoords = [-20.3155, -40.3128];
  else if (['PR', 'SC', 'RS'].includes(state)) baseCoords = [-27.5954, -48.5480];
  else if (['BA', 'PE', 'CE', 'PB', 'RN', 'AL', 'SE', 'PI', 'MA'].includes(state)) baseCoords = [-8.0543, -34.8813];
  else if (['PA', 'AM', 'RO', 'AC', 'RR', 'AP'].includes(state)) baseCoords = [-3.1190, -60.0217];
  
  return [baseCoords[0] + latOffset * 0.4, baseCoords[1] + lngOffset * 0.4];
};


const MapUpdater = ({ viewLevel, center }: { viewLevel: string, center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (viewLevel === 'NATIONAL') {
      map.flyTo([-15, -53], 4, { duration: 1.5 });
    } else if (center && center.length === 2 && center[0] !== undefined) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [viewLevel, center, map]);
  return null;
};

export const ModuleGeoStrategy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, effectiveRole, quotes, leads } = useWinf();
  const currentRole = effectiveRole || user?.role;
  const isAdmin = currentRole?.toLowerCase() === 'admin';
  const [activeTab, setActiveTab] = useState<'MAP' | 'INSIGHTS' | 'UNITS' | 'HEATMAP'>('MAP');
  const [viewLevel, setViewLevel] = useState<'NATIONAL' | 'LOCAL'>(isAdmin ? 'NATIONAL' : 'LOCAL');
  const [forceRender, setForceRender] = useState(0);

  const [territories, setTerritories] = useState<any[]>([]);
  const [painelAtivacaoData, setPainelAtivacaoData] = useState<{
    id: string;
    nome: string;
    status: 'active' | 'available' | 'reserved';
    performance: number;
    onAtivar: () => void;
    onBloquear: () => void;
  } | null>(null);

  const [activationPulse, setActivationPulse] = useState<{
    id: string;
    city: string;
    active: boolean;
    step: number;
    log: string[];
  } | null>(null);

  const [showCargaTerminal, setShowCargaTerminal] = useState(false);
  const [cargaStep, setCargaStep] = useState<number>(-1); // -1: ready, >=0: loading
  const [cargaLogs, setCargaLogs] = useState<string[]>([]);

  const [showAutoActivator, setShowAutoActivator] = useState(false);
  const [autoActiveStep, setAutoActiveStep] = useState<'ready' | 'processing' | 'success'>('ready');
  const [autoActiveLogs, setAutoActiveLogs] = useState<string[]>([]);

  const [showLogisticRouter, setShowLogisticRouter] = useState(false);
  const [routerCityInput, setRouterCityInput] = useState('São Paulo');
  const [logisticaVinculos, setLogisticaVinculos] = useState<any[]>([]);

  const [showReconfigMalha, setShowReconfigMalha] = useState(false);
  const [reconfigStep, setReconfigStep] = useState<'ready' | 'processing' | 'success'>('ready');
  const [reconfigLogs, setReconfigLogs] = useState<string[]>([]);

  const [showTransferLastro, setShowTransferLastro] = useState(false);
  const [transferOrigem, setTransferOrigem] = useState('SANTOS');
  const [transferDestino, setTransferDestino] = useState('SOROCABA');
  const [transferQuantidade, setTransferQuantidade] = useState(100);
  const [transferStep, setTransferStep] = useState<'ready' | 'processing' | 'success'>('ready');
  const [transferLogs, setTransferLogs] = useState<string[]>([]);

  const [estoquesHubs, setEstoquesHubs] = useState<Record<string, number>>({
    SANTOS: 1000,
    SOROCABA: 800,
    SAO_PAULO: 1200
  });
  const [transitosLogistica, setTransitosLogistica] = useState<any[]>([]);

  const demandHotspots = useMemo(() => {
    const spots: { id: string, lat: number, lng: number, intensity: number, type: 'Automotivo' | 'Arquitetura' | 'Misto', desc: string, priority: 'HIGH' | 'MEDIUM' | 'LOW' }[] = [];
    
    // Process Quotes
    (quotes || []).forEach(q => {
      const charSum = q.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const latOffset = ((charSum % 100) / 100) * 0.8 - 0.4;
      const lngOffset = (((charSum * 3) % 100) / 100) * 0.8 - 0.4;
      
      let baseCoords: [number, number] = [-23.5505, -46.6333]; 
      if (q.customerCity) {
         try {
           baseCoords = getCityCoords(q.customerCity, 'SP');
         } catch(e) {}
      }
      
      const intensity = q.totalAmount > 5000 ? 0.9 : q.totalAmount > 2000 ? 0.6 : 0.3;
      const type = q.projectType === 'Architecture' ? 'Arquitetura' : 'Automotivo';
      
      spots.push({
        id: `q-${q.id}`,
        lat: baseCoords[0] + latOffset * 0.05,
        lng: baseCoords[1] + lngOffset * 0.05,
        intensity,
        type,
        priority: intensity > 0.7 ? 'HIGH' : intensity > 0.4 ? 'MEDIUM' : 'LOW',
        desc: `Fluxo ${type} detectado: Orçamento de alta conversão para ${q.customerName?.split(' ')[0] || 'Cliente'} identificado pelo Radar.`
      });
    });

    // Process Leads
    (leads || []).forEach(l => {
      const charSum = l.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const latOffset = ((charSum % 100) / 100) * 1.2 - 0.6; 
      const lngOffset = (((charSum * 7) % 100) / 100) * 1.2 - 0.6;
      
      let baseCoords: [number, number] = [-23.5505, -46.6333]; 
      
      const isArquitetura = l.interest?.toLowerCase().includes('arq') || l.interest?.toLowerCase().includes('resid');
      const intensity = l.ai_score > 80 ? 0.85 : l.ai_score > 50 ? 0.5 : 0.25;

      spots.push({
        id: `l-${l.id}`,
        lat: baseCoords[0] + latOffset * 0.08,
        lng: baseCoords[1] + lngOffset * 0.08,
        intensity,
        type: isArquitetura ? 'Arquitetura' : 'Automotivo',
        priority: intensity > 0.7 ? 'HIGH' : intensity > 0.4 ? 'MEDIUM' : 'LOW',
        desc: `Infiltração de Mercado: Lead qualificado monitorado via ${l.source} com interesse em ${isArquitetura ? 'Film Arquitetônico' : 'Proteção Automotiva'}.`
      });
    });

    return spots.sort((a, b) => b.intensity - a.intensity);
  }, [quotes, leads]);

  useEffect(() => {
    const reloadEstoques = () => {
      const stor = localStorage.getItem('wno_hubs_estoque');
      if (stor) {
        setEstoquesHubs(JSON.parse(stor));
      } else {
        setEstoquesHubs({ SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 });
      }
    };
    
    const reloadTransitos = () => {
      setTransitosLogistica(WNO.db.logistica.getTransitos());
    };

    reloadEstoques();
    reloadTransitos();

    window.addEventListener('wno_hubs_estoque_updated', reloadEstoques);
    window.addEventListener('ray_logistica_transitos_updated', reloadTransitos);
    window.addEventListener('wno_hubs_updated', reloadEstoques);

    return () => {
      window.removeEventListener('wno_hubs_estoque_updated', reloadEstoques);
      window.removeEventListener('ray_logistica_transitos_updated', reloadTransitos);
      window.removeEventListener('wno_hubs_updated', reloadEstoques);
    };
  }, []);

  const executarTransferenciaLastro = async () => {
    const orig = transferOrigem.toUpperCase();
    const dest = transferDestino.toUpperCase();
    
    if (orig === dest) {
      setTransferLogs(prev => [...prev, "[ERRO] Origem e Destino são idênticos. Abortando..."]);
      return;
    }

    const currentStock = estoquesHubs[orig] || 0;
    if (currentStock < transferQuantidade) {
      setTransferLogs(prev => [...prev, `[ERRO] Estoque insuficiente no HUB "${orig}" (${currentStock}m² disponível). Abortando...`]);
      return;
    }

    setTransferStep('processing');
    setTransferLogs([`[GATILHO LOGÍSTICA] Iniciando transferência de lastro: ${orig} -> ${dest} (Quantidade: ${transferQuantidade}m²)...`]);

    await new Promise(resolve => setTimeout(resolve, 600));
    setTransferLogs(prev => [...prev, `[SISTEMA OS] Acionando WNO.db.hubs.debitar("${orig}", ${transferQuantidade})...`]);

    // Executa a operação real de débito e trânsito
    await transferirLastro(orig, dest, transferQuantidade);

    await new Promise(resolve => setTimeout(resolve, 600));
    setTransferLogs(prev => [
      ...prev,
      `[W-NO LEDGER SUCCESS] Débito processado com sucesso. Novo estoque em "${orig}": ${currentStock - transferQuantidade}m²`,
      `[SISTEMA OS] Registrando trânsito via WNO.db.logistica.registrarTransito() STATUS=EM_MOVIMENTO...`,
      ` -> Registro completo no barramento de confiança.`
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setTransferLogs(prev => [
      ...prev,
      `[STATUS SUCCESS] Transferência de ${transferQuantidade}m² de películas WINF iniciada com sucesso!`,
      `[INFO] O estoque em "${dest}" será creditado de maneira imutável assim que você confirmar o recebimento.`
    ]);
    
    setTransferStep('success');
  };

  const executarReconfiguracaoMalha = async () => {
    setReconfigStep('processing');
    setReconfigLogs(["[MALHA RECONFIG] Inicializando rotina atualizarMalhaLogistica()..."]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setReconfigLogs(prev => [...prev, "[MALHA RECONFIG] Definindo novos hubs estratégicos: ['SANTOS', 'SOROCABA', 'SAO_PAULO']."]);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setReconfigLogs(prev => [...prev, "[W-NO™ BLOCKCHAIN] Resetando malha de distribuição: WNO.config.logistica.resetRede()..."]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setReconfigLogs(prev => [...prev, `[STATUS] Antiga rede desconectada. Iniciando triangulação geodésica...`]);

    // Executa a reconfiguração oficial
    atualizarMalhaLogistica();

    await new Promise(resolve => setTimeout(resolve, 600));
    setReconfigLogs(prev => [
      ...prev,
      `[W-NO™ LEDGER] Registrando Master Hub 'SANTOS' sob gestão 'FUNDADOR_ADMIN' (Controle Único)...`,
      `[W-NO™ LEDGER] Registrando Master Hub 'SOROCABA' sob gestão 'FUNDADOR_ADMIN' (Controle Único)...`,
      `[W-NO™ LEDGER] Registrando Master Hub 'SAO_PAULO' sob gestão 'FUNDADOR_ADMIN' (Controle Único)...`
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setReconfigLogs(prev => [
      ...prev,
      `[STATUS SUCCESS] Malha logística triangulada e centralizada com sucesso!`,
      `[INFO] 3 nós mestre operando em conformidade aeronáutica livre de perdas de lastro.`
    ]);
    setReconfigStep('success');
  };

  useEffect(() => {
    const loadVinculos = () => {
      setLogisticaVinculos(WNO.logistica.getVinculos());
    };
    loadVinculos();
    window.addEventListener('ray_logistica_updated', loadVinculos);
    return () => {
      window.removeEventListener('ray_logistica_updated', loadVinculos);
    };
  }, []);

  const executarCargaTerritorial = async () => {
    setCargaStep(0);
    setCargaLogs(["[CÓRTEX ADMIN] carregarBaseTerritorial() - Iniciando carga de 100 praças..."]);
    
    const initialLogs = [
      "[ADMIN] Carregando arquivo de configuração geográfica...",
      "[ADMIN] fetch('/assets/geojson/cidades_brasil.json') - Simulando importação...",
      "[ADMIN] Arquivo carregado com sucesso! Mapeando 5.570 municípios...",
      "[ADMIN] Filtrando as 100 praças estratégicas definidas como polo...",
      "[ADMIN] Registrando praças no motor de ativação do W-NO OS™..."
    ];

    for (let i = 0; i < initialLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCargaLogs(prev => [...prev, initialLogs[i]]);
      setCargaStep(i + 1);
    }

    // Register each territory in the motor
    for (let j = 0; j < INITIAL_TERRITORIES.length; j += 4) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const sub = INITIAL_TERRITORIES.slice(j, j + 4);
      sub.forEach(t => {
        setCargaLogs(prev => [
          ...prev, 
          `[REGISTRO] WNO.registrarNovoTerritorio({ id: "${t.id}", nome: "${t.city} (${t.state})", status: "DISPONIVEL" })`
        ]);
      });
      setCargaStep(prev => prev + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setCargaLogs(prev => [...prev, "[ADMIN] SUCESSO! 100 praças consolidadas no banco local de dados WINF OS™."]);
    
    // Save territories back to local storage (reset them to INITIAL_TERRITORIES if they were modified)
    localStorage.setItem('winf_100_territories', JSON.stringify(INITIAL_TERRITORIES));
    window.dispatchEvent(new Event('winf_territories_updated'));
    setForceRender(prev => prev + 1);
    setCargaStep(100);
  };

  const executarAtivacaoAutomatica = async () => {
    setAutoActiveStep('processing');
    setAutoActiveLogs(["[GATILHO WINF] Inicializando script de Ativação Automática..."]);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setAutoActiveLogs(prev => [...prev, "[GATILHO WINF] Carregando Payload de Ativação..."]);
    
    const payload = {
      unidadeId: "SANTOS_01",
      containerData: {
        hash_nfe: "NFE-2026-0001",
        itens: [
          { nome: "Winf Select® Arquitetônica Premium", metros: 30, preco: 150 }
        ]
      }
    };
    
    await new Promise(resolve => setTimeout(resolve, 850));
    setAutoActiveLogs(prev => [
      ...prev, 
      `[DATABASE API] Acionando WNO.db.unidades.update("${payload.unidadeId}", { status: "ATIVA" })...`
    ]);
    
    // Executa a função oficial importada
    await ativarUnidadeComEstoque(payload.unidadeId, payload.containerData);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setAutoActiveLogs(prev => [
      ...prev,
      `[DATABASE SUCCESS] Unidade ${payload.unidadeId} marcada como ATIVA no banco de dados.`,
      `[LEDGER API] Transferindo estoque inicial via WNO.ledger.transferirEstoque()...`,
      ` -> Sincronizando: 30 metros de "${payload.containerData.itens[0].nome}"`,
      ` -> Nota Fiscal Digital vinculada: "${payload.containerData.hash_nfe}"`
    ]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAutoActiveLogs(prev => [
      ...prev,
      `[LEDGER SUCCESS] Estoque transferido com sucesso para a unidade "${payload.unidadeId}".`,
      `[SUCESSO] Unidade ativa e lastro carregado de forma imutável!`
    ]);
    
    setAutoActiveStep('success');
  };

  useEffect(() => {
    const loadTerritories = () => {
      let saved = localStorage.getItem('winf_100_territories');
      if (saved) {
        try {
          setTerritories(JSON.parse(saved));
        } catch (e) {
          setTerritories(INITIAL_TERRITORIES);
        }
      } else {
        setTerritories(INITIAL_TERRITORIES);
        localStorage.setItem('winf_100_territories', JSON.stringify(INITIAL_TERRITORIES));
      }
    };

    loadTerritories();

    window.addEventListener('winf_territories_updated', loadTerritories);
    return () => {
      window.removeEventListener('winf_territories_updated', loadTerritories);
    };
  }, [forceRender]);

  const handleRayAction = (id: string, activate: boolean) => {
    const selected = territories.find(t => t.id === id);
    if (!selected) return;

    if (activate) {
      setActivationPulse({
        id,
        city: selected.city,
        active: true,
        step: 0,
        log: [`[CÓRTEX W-NO V1.2.0] - INICIANDO IMPLANTAÇÃO TURN-KEY COGNITIVA EM ${selected.city.toUpperCase()}`]
      });
    } else {
      const updated = territories.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'available' as any,
            owner: 'Não Atribuído',
            botStatus: 'none' as any,
            domainStatus: 'none' as any
          };
        }
        return t;
      });
      setTerritories(updated);
      localStorage.setItem('winf_100_territories', JSON.stringify(updated));
      window.dispatchEvent(new Event('winf_territories_updated'));
      setForceRender(prev => prev + 1);
      setPainelAtivacaoData(null);
    }
  };

  const RayActions = {
    ativarUnidade: (id: string) => {
      handleRayAction(id, true);
    },
    bloquearUnidade: (id: string) => {
      handleRayAction(id, false);
    }
  };

  const PainelAtivacao = {
    abrir: (data: {
      id: string;
      nome: string;
      status: 'active' | 'available' | 'reserved';
      performance: number;
      onAtivar: () => void;
      onBloquear: () => void;
    }) => {
      setPainelAtivacaoData(data);
    }
  };

  useEffect(() => {
    if (!activationPulse) return;

    const logs = [
      `[W-NO INFO] - Verificando conformidade regulatória nos 100 polos... OK`,
      `[W-NO DNS] - Parametrizando novo DNS na Cloudflare para o subdomínio ${activationPulse.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')}.winfpartners.com.br...`,
      `[W-NO AUTH] - Sincronizando chaves federadas e mestre territorial WINF... feito`,
      `[W-NO COGNITIVE] - Provisionando instância cognitiva do Córtex W-NO IA...`,
      `[W-NO LIVE] - Conectando de forma federada ao software de corte Winf Cut™...`,
      `[W-NO SUCCESS] - SUCESSO COGNITIVO! Unidade ${activationPulse.city.toUpperCase()} ativada com sucesso!`
    ];

    if (activationPulse.step < logs.length) {
      const timer = setTimeout(() => {
        setActivationPulse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            step: prev.step + 1,
            log: [...prev.log, logs[prev.step]]
          };
        });
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        const updated = territories.map(t => {
          if (t.id === activationPulse.id) {
            return {
              ...t,
              status: 'active' as any,
              owner: 'Parceiro Homologado W-NO AI',
              botStatus: 'homologated' as any,
              domainStatus: 'secured' as any
            };
          }
          return t;
        });
        setTerritories(updated);
        localStorage.setItem('winf_100_territories', JSON.stringify(updated));
        window.dispatchEvent(new Event('winf_territories_updated'));
        setForceRender(prev => prev + 1);

        setActivationPulse(null);
        setPainelAtivacaoData(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activationPulse?.step]);
  
  const metrics = isAdmin ? [
    { label: 'Unidades Ativas', value: '142', trend: '+12' },
    { label: 'Cobertura Nacional', value: '18 Est.', trend: '85%' },
    { label: 'Receita Territorial', value: 'R$ 2.4M', trend: '+14%' },
  ] : [
    { label: 'Domínio Territorial', value: '64%', trend: '+8%' },
    { label: 'Market Share Local', value: '22%', trend: '+3%' },
    { label: 'Pontos de Calor', value: '14', trend: 'Inbound' },
  ];

  const userTerritoryKey = user?.territory || user?.address?.city || 'Santos';
  const territoryData = MASTER_TERRITORIES[userTerritoryKey] || MASTER_TERRITORIES['São Paulo'];

  const bairros = territoryData.bairros;
  const [showConfig, setShowConfig] = useState(false);
  const [configCity, setConfigCity] = useState(userTerritoryKey);
  const [configBairros, setConfigBairros] = useState(bairros);

  const [selectedBairro, setSelectedBairro] = useState<any>(null);
  const [focusedSpot, setFocusedSpot] = useState<[number, number] | null>(null);
  const [pulseOpacity, setPulseOpacity] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity(prev => prev === 0.4 ? 0.1 : 0.4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'HEATMAP' && demandHotspots.length > 0 && !focusedSpot) {
      setFocusedSpot([demandHotspots[0].lat, demandHotspots[0].lng]);
    }
  }, [activeTab]);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [campaignStrategy, setCampaignStrategy] = useState<string | null>(null);

  const generateCampaignStrategy = async (bairro: any) => {
    setIsGeneratingCampaign(true);
    setCampaignStrategy(null);
    try {
      const prompt = `Gere uma estratégia de campanha de marketing focada para o bairro ${bairro.name}. 
      Perfil do público: ${bairro.demographic}.
      Status atual: ${bairro.status}.
      Market share: ${bairro.share}%.
      Potencial de mercado: ${bairro.potential}.
      
      Crie:
      1. Ideia de post (legenda) para Instagram (formatada para copiar).
      2. Estratégia de abordagem direta para esse público.
      3. Sugestão de foco de anúncio geolocalizado.`;
      
      const systemPrompt = "Você é o especialista estratégico do WINF OS. Crie estratégias de marketing de alta performance para o setor de arquitetura e window film.";
      
      const response = await generateGeminiResponse(prompt, systemPrompt);
      setCampaignStrategy(response.text);

      addArsenalAsset({
        id: `campaign-${Date.now()}`,
        title: `Campanha: ${bairro.name}`,
        type: 'script',
        category: 'Campanhas',
        description: `Estratégia gerada via AI para o bairro ${bairro.name}`,
        copy: response.text
      });
      alert('Campanha gerada e salva no Arsenal!');
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar estratégia.');
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  const handleSaveConfig = () => {
    // Aqui seria salvo no banco de dados real. No momento, simulamos no state.
    // Atualiza MASTER_TERRITORIES ou salva no context
    MASTER_TERRITORIES[configCity] = {
      city: configCity,
      state: 'Configurado',
      bairros: configBairros,
      insights: insights
    };
    setShowConfig(false);
  };


  const userCity = MASTER_TERRITORIES[configCity]?.city || territoryData.city;
  const userState = MASTER_TERRITORIES[configCity]?.state || territoryData.state;
  const insights = MASTER_TERRITORIES[configCity]?.insights || territoryData.insights;
  const userWeatherData = getWeatherData(userCity);
  const isWeatherStationActive = localStorage.getItem(`winf_weather_station_${userCity}`) !== 'false';

  const activeBairros = MASTER_TERRITORIES[configCity]?.bairros || configBairros;

  return (
    <div className="min-h-screen bg-[#131314] text-white p-4 md:p-8 space-y-8 animate-fade-in pb-24">
      <header className="relative space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 border border-[#444746] flex items-center justify-center rounded-none">
              <MapPin className="text-[#FFFFFF] w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white uppercase">
                Winf™ | Geo-Estratégia
              </h1>
              <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.3em]">
                Mapeamento de Bairros & Classes de Mercado
              </p>
            </div>
          </div>
          
          <div className="flex overflow-x-auto whitespace-nowrap bg-[#131314] border border-[#444746] p-1.5 items-center gap-2 max-w-full scrollbar-hide pb-2">
            {isAdmin && (
              <button 
                onClick={() => setViewLevel(v => v === 'NATIONAL' ? 'LOCAL' : 'NATIONAL')}
                className={`px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer ${viewLevel === 'NATIONAL' ? 'bg-white/10 text-[#FFFFFF] border-[#FFFFFF]/20 hover:bg-white/20' : 'bg-white/5 text-zinc-400 hover:text-white border-[#444746]'}`}
              >
                {viewLevel === 'NATIONAL' ? 'Ver Cidade (Local)' : 'Visão Geral (Brasil)'}
              </button>
            )}
            <button 
              onClick={() => setShowConfig(true)}
              className="px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-white/5 hover:bg-white hover:text-black border border-[#444746] text-white shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer"
            >
              Configurar Classes
            </button>
            {isAdmin && (
              <button 
                onClick={() => {
                  setShowCargaTerminal(true);
                  setCargaStep(-1);
                  setCargaLogs([]);
                }}
                className="px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-white/5 hover:bg-yellow-500 hover:text-black border border-[#444746] text-yellow-500 shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer"
              >
                Carga de Praças
              </button>
            )}
            {isAdmin && (
              <button 
                onClick={() => {
                  setShowAutoActivator(true);
                  setAutoActiveStep('ready');
                  setAutoActiveLogs([]);
                }}
                className="px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-white/10 border border-[#FFFFFF]/30 text-[#FFFFFF] hover:bg-white hover:text-black shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer"
                title="Gatilho de Ativação Automática de Unidade e Estoque Vinculado"
              >
                Gatilho Ativação
              </button>
            )}
            <button 
              onClick={() => {
                setShowLogisticRouter(true);
              }}
              className="px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-zinc-900 border border-[#444746] text-white hover:text-black hover:bg-white hover:border-[#FFFFFF] shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Calcular menor distância física para otimizar lastro e frete logístico"
            >
              Roteamento Logístico
            </button>
            <button 
              onClick={() => {
                setShowReconfigMalha(true);
                setReconfigStep('ready');
                setReconfigLogs([]);
              }}
              className="px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-zinc-900 border border-[#444746] text-white hover:text-black hover:bg-white shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Disparar script de reconfiguração de malha e triangulação de hubs logísticos"
            >
              Reconfigurar Malha
            </button>
            <button 
              onClick={() => {
                setShowTransferLastro(true);
                setTransferStep('ready');
                setTransferLogs([]);
              }}
              className="px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all bg-zinc-900 border border-[#444746] text-white hover:text-black hover:bg-white shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer"
              title="Disparar transferência voluntária de lastro físico entre hubs centrais"
            >
              Transferência de Lastro
            </button>
            {(['MAP', 'BAIRROS', 'INSIGHTS', 'HEATMAP'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab === 'BAIRROS' ? 'UNITS' : tab)}
                 className={`px-6 py-2.5 md:py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all shrink-0 min-h-[40px] md:min-h-[32px] flex items-center justify-center cursor-pointer ${
                  (activeTab === 'MAP' && tab === 'MAP' || activeTab === 'UNITS' && tab === 'BAIRROS' || activeTab === 'INSIGHTS' && tab === 'INSIGHTS' || activeTab === 'HEATMAP' && tab === 'HEATMAP') ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab === 'MAP' ? 'Geral' : tab === 'BAIRROS' ? 'Bairros' : tab === 'HEATMAP' ? 'Heatmap' : 'Oportunidades AI'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Território Zeigarnik Progress Loop Alert */}
      {(() => {
        const pctCoverage = 58;
        return (
          <div className="p-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#444746] rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-none blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="space-y-3 flex-1 text-left">
                  <span className="inline-block text-[9px] bg-emerald-500/10 text-[#FFFFFF] font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-widest animate-pulse">Dominância Geográfica</span>
                  <h3 className="text-xl font-light text-white tracking-tight shrink-0">Expansão de Território Coordenada // <strong className="text-[#FFFFFF] font-mono">{pctCoverage}% Coberto</strong></h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-2xl">
                      Você pavimentou 58% do seu território nominal (Gonzaga, Ponta da Praia e Aparecida ativados). Falta cobrir Boqueirão e Embaré para selar o ciclo de vendas regional e emitir o Selo Geográfico de Elite.
                  </p>
              </div>
              
              <div className="w-full md:w-64 space-y-2 shrink-0">
                  <div className="flex justify-between items-end text-[10px] font-mono text-zinc-400">
                      <span>PROGRESSO DA PRAÇA</span>
                      <span className="text-[#FFFFFF] font-bold">{pctCoverage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-none overflow-hidden">
                      <div className="h-full bg-white rounded-none transition-all duration-1000" style={{ width: `${pctCoverage}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono block text-right uppercase tracking-widest mt-1">Status: Ciclo Incompleto</span>
              </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#131314] border border-[#444746] p-6 space-y-2 group hover:border-[#FFFFFF]/30 transition-all">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">{m.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-light tracking-tighter">{m.value}</span>
              <span className="text-[10px] font-bold text-[#FFFFFF] mb-1 flex items-center gap-1">
                <TrendingUp size={10} /> {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {(activeTab === 'MAP' || activeTab === 'HEATMAP') && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-[#131314] border border-[#444746] relative overflow-hidden h-[500px] md:h-[700px] group">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              {/* Tactical Overlay Lines */}
              <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/5" />
              <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/5" />
              <div className="absolute left-1/3 top-0 w-[1px] h-full bg-white/5" />
              <div className="absolute left-3/4 top-0 w-[1px] h-full bg-white/5" />
            </div>

            {/* MAP LEGEND */}
            <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
              <div className="bg-[#131314]/80 backdrop-blur-md border border-[#444746] p-4 border-l-[#FFFFFF] border-l-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]">{activeTab === 'HEATMAP' ? 'MAPA DE CALOR E DEMANDA' : 'MAPA DE DOMINAÇÃO'}</span>
                <p className="text-lg font-medium text-white">{userCity} / {userState}</p>
              </div>
              
              {activeTab === 'HEATMAP' ? (
                <div className="bg-[#131314]/80 backdrop-blur-md border border-[#444746] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#3b82f6] rounded-none opacity-40 blur-[1px]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#3b82f6]">DEMANDA ARQUITETURA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#a855f7] rounded-none opacity-40 blur-[1px]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#a855f7]">DEMANDA MISTA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#ef4444] rounded-none opacity-40 blur-[1px]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ef4444]">DEMANDA AUTOMOTIVO</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#131314]/80 backdrop-blur-md border border-[#444746] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-white rounded-none" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">DOMÍNIO AEROCORE (LÍDER)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#0057FF] rounded-none" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">ZONA EM EXPANSÃO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-white/20 rounded-none" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">ZONA DE PROSPECÇÃO</span>
                  </div>
                </div>
              )}
            </div>

            {/* TERRITORY POINTS */}
            <div className="absolute inset-0 z-0">
               <MapContainer key={`${viewLevel}-${JSON.stringify(territoryData.mapCenter)}`} center={viewLevel === 'NATIONAL' ? [-15, -53] : (territoryData.mapCenter ? territoryData.mapCenter : (territoryData.bairros && territoryData.bairros.length > 0 && territoryData.bairros[0].center ? territoryData.bairros[0].center : [-23.5, -46.5]))} zoom={viewLevel === 'NATIONAL' ? 4 : 13} style={{ height: '100%', width: '100%', background: '#050505' }} zoomControl={false}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  />
                  <MapUpdater viewLevel={viewLevel} center={focusedSpot || territoryData.mapCenter || (territoryData.bairros && territoryData.bairros.length > 0 && territoryData.bairros[0].center ? territoryData.bairros[0].center : [-23.5, -46.5])} />
                  
                  {viewLevel === 'LOCAL' && activeBairros.map((b: any, i: number) => {
                    const isLeader = b.share > 50;
                    const isExpanding = b.share > 20 && b.share <= 50;
                    const isOpportunity = b.share <= 20;
                    const color = isLeader ? '#050505' : isExpanding ? '#050505' : '#10B981';
                    const borderColor = isLeader ? '#FF3B30' : isExpanding ? '#FF3B30' : '#10B981';
                    const isSelected = selectedBairro?.name === b.name;
                    
                    return (
                       <Circle 
                          key={i} 
                          center={b.center || [-23.5, -46.5]} 
                          radius={b.radius || 600} 
                          pathOptions={{ 
                            color: borderColor, 
                            fillColor: color, 
                            fillOpacity: isSelected ? 0.4 : (isOpportunity ? 0.1 : 0.3), 
                            weight: isSelected ? 3 : (isOpportunity ? 2 : 1),
                            dashArray: isOpportunity ? "4,6" : "0"
                          }}
                          eventHandlers={{ click: () => setSelectedBairro(b) }}
                       >
                          <Popup className="winf-popup font-sans">
                             <div className="p-2 min-w-[140px]">
                                {isOpportunity ? (
                                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none mb-2 inline-block">MERCADO LIVRE (ALTO POTENCIAL)</span>
                                ) : (
                                  <span className="bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none mb-2 inline-block">TERRITÓRIO DOMINADO</span>
                                )}
                                <span className="text-[#FFFFFF] font-black uppercase tracking-widest text-[12px] block mb-1">{b.name}</span>
                                <div className="space-y-1 mt-2">
                                  <div className="flex justify-between text-[10px]"><span className="text-white/40">Status:</span> <span className="text-white font-bold">{b.status || 'N/A'}</span></div>
                                  <div className="flex justify-between text-[10px]"><span className="text-white/40">Share:</span> <span className="text-white font-bold">{b.share || 0}%</span></div>
                                  {isOpportunity && (
                                    <div className="flex justify-between text-[10px] pt-1 mt-1 border-t border-white/10"><span className="text-white/40">Potencial/Mês:</span> <span className="text-emerald-400 font-black">{b.ticket || 'N/A'}</span></div>
                                  )}
                                </div>
                             </div>
                          </Popup>
                       </Circle>
                    )
                  })}

                  {viewLevel === 'NATIONAL' && territories.map((t, i) => {
                    const coords = getCityCoords(t.city, t.state);
                    const isCurrentlyActive = t.status === 'active';
                    const isCurrentlyReserved = t.status === 'reserved';
                    const color = isCurrentlyActive ? '#FFFFFF' : isCurrentlyReserved ? '#EAB308' : '#4b5563';
                    
                    return (
                      <React.Fragment key={`national-group-${t.id}`}>
                        {t.id !== 'T01' && (
                           <Polyline 
                             positions={[CITY_COORDS['Santos'], coords]} 
                             pathOptions={{ 
                               color: isCurrentlyActive ? "rgba(255, 255, 255, 0.2)" : "rgba(255,255,255,0.03)", 
                               weight: isCurrentlyActive ? 1.5 : 0.8, 
                               dashArray: "3,6" 
                             }} 
                           />
                        )}
                        <CircleMarker
                           center={coords}
                           radius={isCurrentlyActive ? 7 : 4.5}
                           pathOptions={{ 
                             color: color, 
                             fillColor: color, 
                             fillOpacity: isCurrentlyActive ? 0.9 : 0.4, 
                             weight: isCurrentlyActive ? 2 : 1 
                           }}
                           eventHandlers={{ 
                             click: () => { 
                               PainelAtivacao.abrir({
                                 id: t.id,
                                 nome: `${t.city} - ${t.state}`,
                                 status: t.status,
                                 performance: Math.floor((t.id.charCodeAt(1) || 5) * 7.5 % 30) + 70,
                                 onAtivar: () => RayActions.ativarUnidade(t.id),
                                 onBloquear: () => RayActions.bloquearUnidade(t.id)
                               });
                             } 
                           }}
                        >
                           <Popup className="winf-popup font-sans">
                             <div className="p-2 min-w-[140px]">
                               <span className="text-zinc-500 font-mono font-bold text-[8px] block mb-0.5">{t.id} - CLASSE {t.tier}</span>
                               <span className="text-white font-bold text-xs block mb-1">{t.city} ({t.state})</span>
                               <span className="text-zinc-400 text-[10px] block font-mono">Status: <span className={isCurrentlyActive ? "text-[#FFFFFF] font-bold" : isCurrentlyReserved ? "text-yellow-500 font-bold" : "text-zinc-500"}>{t.status.toUpperCase()}</span></span>
                               {t.owner && t.owner !== 'Não Atribuído' && (
                                 <span className="text-zinc-400 text-[9px] block">Op: {t.owner}</span>
                               )}
                               <span className="text-[#FFFFFF] text-[9px] block mt-2 font-bold select-none cursor-pointer">Painel de Ativação Ativo</span>
                             </div>
                           </Popup>
                        </CircleMarker>
                      </React.Fragment>
                    );
                  })}

                  {activeTab === 'HEATMAP' && demandHotspots.map(spot => (
                    <Circle
                      key={spot.id}
                      center={[spot.lat, spot.lng]}
                      radius={(spot.intensity * 800) + 400}
                      pathOptions={{
                        color: spot.type === 'Arquitetura' ? '#10B981' : '#0057FF',
                        fillColor: spot.type === 'Arquitetura' ? '#10B981' : '#0057FF',
                        fillOpacity: spot.priority === 'HIGH' ? pulseOpacity + 0.2 : (spot.intensity * 0.3) + 0.1,
                        weight: spot.priority === 'HIGH' ? 2 : 0,
                        dashArray: spot.priority === 'HIGH' ? "5, 5" : "0"
                      }}
                    >
                       <Popup className="winf-popup font-sans">
                         <div className="p-2">
                           <span className={`text-[8px] font-black px-2 py-0.5 mb-1 inline-block border ${spot.priority === 'HIGH' ? 'text-red-400 border-red-400/30' : 'text-zinc-400 border-zinc-400/30'}`}>
                             {spot.priority === 'HIGH' ? 'URGENTE: ALTO VOLUME' : 'VOLUME DETECTADO'}
                           </span>
                           <span className="text-white font-bold block text-xs underline underline-offset-4 decoration-white/20 mb-2">{spot.type} Strategy</span>
                           <p className="text-[10px] text-zinc-400 leading-tight">{spot.desc}</p>
                         </div>
                       </Popup>
                    </Circle>
                  ))}
               </MapContainer>
            </div>

            <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3 pointer-events-none">
               <button onClick={() => setActiveTab('HEATMAP')} className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:bg-white transition-all pointer-events-auto">
                 <Target size={16} /> Radar de Captação AI
               </button>
            </div>
          </div>

          <div className="space-y-6">
            {selectedBairro ? (
              <div className="bg-[#131314] border border-[#444746] p-6 space-y-6 relative overflow-hidden animate-fade-in shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFFFFF] to-[#0057FF]" />
                 <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-light uppercase tracking-tighter text-white">{selectedBairro.name}</h3>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{selectedBairro.demographic}</p>
                    </div>
                    <button onClick={() => setSelectedBairro(null)} className="p-1 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#444746]">
                   <div>
                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Classe</span>
                     <p className="text-sm font-bold text-white uppercase">{selectedBairro.tier}</p>
                   </div>
                   <div>
                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Status AI</span>
                     <p className={`text-[10px] font-black uppercase mt-1 tracking-widest ${(selectedBairro.share || 0) > 50 ? 'text-[#FFFFFF]' : 'text-[#0057FF]'}`}>{selectedBairro.status}</p>
                   </div>
                   <div>
                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Ticket Médio</span>
                     <p className="text-sm font-bold text-white">{selectedBairro.ticket}</p>
                   </div>
                   <div>
                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Demanda</span>
                     <p className="text-sm font-bold text-white uppercase">{selectedBairro.volume}</p>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                     <span>Market Share Local</span>
                     <span className="text-white">{selectedBairro.share || 0}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/10 overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${selectedBairro.share || 0}%` }}
                       className={`h-full transition-all duration-1000 ${(selectedBairro.share || 0) > 50 ? 'bg-white' : 'bg-[#0057FF]'}`}
                     />
                   </div>
                 </div>

                 <button 
                  onClick={() => generateCampaignStrategy(selectedBairro)}
                  disabled={isGeneratingCampaign}
                  className="w-full py-4 mt-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#0057FF] hover:text-white transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                 >
                   <Layers size={14} /> {isGeneratingCampaign ? 'Injetando...' : 'Ativar Injeção de Tráfego'}
                 </button>
              </div>
            ) : activeTab === 'HEATMAP' ? (
              <div className="space-y-6">
                <div className="bg-[#131314] border border-[#444746] p-6 space-y-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FFFFFF] flex items-center gap-2">
                         <Target className="w-4 h-4 text-emerald-500" /> Radares AI Ativos
                       </h3>
                       {focusedSpot && (
                         <button 
                           onClick={() => setFocusedSpot(null)}
                           className="text-[9px] font-black uppercase text-white/40 hover:text-white flex items-center gap-1 cursor-pointer pointer-events-auto"
                         >
                           <X className="w-3 h-3" /> Limpar Foco
                         </button>
                       )}
                    </div>
                   <div className="space-y-4">
                     {demandHotspots.slice(0, 5).map((spot, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col gap-2 p-3 border cursor-pointer transition-all ${focusedSpot && focusedSpot[0] === spot.lat && focusedSpot[1] === spot.lng ? 'bg-white/10 border-white' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                        onClick={() => setFocusedSpot([spot.lat, spot.lng])}
                      >
                         <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                             <TrendingUp className="w-3 h-3 text-emerald-400" />
                             Oportunidade {spot.type}
                           </span>
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded-none border uppercase ${spot.priority === 'HIGH' ? 'text-red-400 border-red-400/50 bg-red-500/10' : 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10'}`}>
                             {spot.priority === 'HIGH' ? 'CRÍTICO' : 'ALERTA'}
                           </span>
                         </div>
                         <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                           {spot.desc}
                         </p>
                       </div>
                     ))}
                   </div>
                   {demandHotspots.length === 0 && (
                     <div className="text-center py-8 opacity-50">
                       <MapPin className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
                       <p className="text-[10px] uppercase font-black text-zinc-400">Nenhum sinal captado no momento</p>
                     </div>
                   )}
                </div>
                <div className="bg-[#121212] border border-[#0057FF]/30 p-6 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Globe size={100} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Claim Territorial (Radar)</h3>
                  <p className="text-xs text-white/80 font-light leading-relaxed">
                    A IA está mapeando o volume de leads e cotações na sua base. Use estes insights para direcionar vendedores ou bloquear regiões para <strong>novos franqueados</strong> através do licenciamento de zonas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {isWeatherStationActive && (
                  <div className="bg-[#131314] border border-[#FFFFFF]/30 p-6 space-y-4 rounded-none relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-3 text-[#FFFFFF]/20">
                      <Sun className="w-20 h-20 animate-spin" style={{ animationDuration: '40s' }} />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-[#FFFFFF] bg-white/10 border border-[#FFFFFF]/20 px-2 py-0.5 rounded-none tracking-widest uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-none bg-white animate-pulse"></span>
                        Estação de Clima WINF AI
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Santos & SP OS V3</span>
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase font-mono tracking-widest text-[#FFFFFF]">Canal Meteorológico Integrado</h4>
                      <h2 className="text-xl font-mono tracking-tighter text-white mt-1">
                        {userCity} <span className="text-sm text-zinc-400 font-sans font-light">// {userState}</span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-4 py-3 border-y border-[#444746]">
                      <div className="text-3xl font-mono tracking-tighter text-white flex items-center gap-1">
                        {userWeatherData.temp}°<span className="text-zinc-500 text-sm font-sans font-light">C</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white/90 flex items-center gap-1">
                          {userWeatherData.condition === 'Sunny' ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : userWeatherData.condition === 'Cloudy' ? <Cloud className="w-3.5 h-3.5 text-zinc-400" /> : <CloudRain className="w-3.5 h-3.5 text-blue-400" />}
                          {userWeatherData.conditionName}
                        </p>
                        <p className="text-[10px] text-zinc-500 tracking-wider font-medium">Banda de Radiação Ativa</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white/5 border border-[#444746] rounded-none">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Índice Máximo UV</span>
                        <span className={`text-base font-mono font-bold ${userWeatherData.uvIndex >= 8 ? 'text-red-500' : 'text-yellow-500'}`}>
                          {userWeatherData.uvIndex} <span className="text-[9px] font-sans font-normal text-zinc-400">({userWeatherData.uvIndex >= 8 ? 'CRÍTICO' : 'MODERADO'})</span>
                        </span>
                      </div>
                      <div className="p-3 bg-white/5 border border-[#444746] rounded-none">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Bloqueio Solar (IR)</span>
                        <span className="text-base font-mono font-bold text-[#FFFFFF]">{userWeatherData.irIndex}</span>
                      </div>
                    </div>

                    <div className="text-left bg-white/[0.02] border border-[#444746] p-3 rounded-none">
                      <p className="text-[9px] font-black uppercase text-[#FFFFFF]/80 tracking-widest flex items-center gap-1.5 mb-1.5">
                        <Thermometer className="w-3 h-3 text-[#FFFFFF]" /> Recomendações Técnicas
                      </p>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-light font-sans">{userWeatherData.thermalAdvice}</p>
                    </div>

                    <div className="bg-[#121212] border border-[#444746] p-3 rounded-none flex items-center justify-between">
                      <div>
                        <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest block">Película Recomendada</span>
                        <span className="text-xs font-bold text-white block">{userWeatherData.recommendedProduct.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#FFFFFF] bg-white/5 border border-[#FFFFFF]/20 px-2 py-1 rounded-none">
                        ALTO GIRO
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-[#131314] border border-[#444746] p-6 space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-4 px-2">Top Bairros Dominados</h3>
                   {activeBairros.slice(0, 3).map((b: any, i: number) => (
                     <div key={i} className="space-y-2 cursor-pointer group" onClick={() => setSelectedBairro(b)}>
                       <div className="flex justify-between items-center group-hover:text-[#FFFFFF] transition-colors">
                         <p className="text-[10px] font-bold uppercase tracking-widest">{b.name}</p>
                         <span className={`text-[9px] font-black ${b.share > 50 ? 'text-[#FFFFFF]' : 'text-[#0057FF]'}`}>{b.share}%</span>
                       </div>
                       <div className="h-1 bg-white/5 overflow-hidden">
                         <div className={`h-full transition-all duration-500 ${b.share > 50 ? 'bg-white' : 'bg-[#0057FF]'}`} style={{ width: `${b.share}%` }} />
                       </div>
                     </div>
                   ))}
                   <div className="pt-6 border-t border-[#444746] text-center">
                     <Info size={16} className="text-white/20 mx-auto mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]">Selecione um bairro no mapa para visualizar a análise tática completa.</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'UNITS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {activeBairros.map((b: any, i: number) => (
            <div key={i} className="bg-[#131314] border border-[#444746] p-6 space-y-4 group hover:border-[#FFFFFF]/20 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-10">
                <span className="text-[40px] font-black">{b.tier}</span>
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                   <h4 className="text-xl font-light uppercase tracking-tighter">{b.name}</h4>
                   <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">{b.demographic}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className="px-2 py-0.5 bg-white/10 text-[#FFFFFF] text-[10px] font-black rounded-none border border-[#FFFFFF]/20">
                     CLASSE {b.tier}
                   </div>
                   <div className={`w-2 h-2 rounded-none mt-1 ${b.share > 50 ? 'bg-white' : 'bg-yellow-500 animate-pulse'}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 border-y border-[#444746]">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Ticket Est.</span>
                  <p className="text-[11px] font-bold text-white/70">{b.ticket}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Volume/Dia</span>
                  <p className="text-[11px] font-bold text-white/70">{b.volume}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-white/40">
                  <span>Share de Mercado</span>
                  <span className="text-white">{b.share}%</span>
                </div>
                <div className="h-1 w-full bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${b.share}%` }}
                    className="h-full bg-white transition-all duration-1000" 
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                 <span className={`text-[8px] font-black uppercase px-2 py-1 bg-white/5 tracking-widest ${b.share > 70 ? 'text-[#FFFFFF]' : 'text-white/40'}`}>
                   {b.status}
                 </span>
                 {b.share < 25 && (
                   <span className="text-[8px] font-black uppercase px-2 py-1 bg-red-500/10 text-red-500 tracking-widest animate-pulse flex items-center gap-1">
                     <Target size={8} /> Atacar Bairro
                   </span>
                 )}
              </div>
              
              <button className="w-full py-4 mt-2 bg-white/5 hover:bg-white hover:text-black text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-[#FFFFFF]/20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                Injeção de Tráfego Local
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'INSIGHTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
           {insights.map((insight, idx) => (
             <div key={idx} className="bg-[#131314] border border-[#444746] p-8 space-y-6 relative group overflow-hidden">
                <div className={`absolute top-0 right-0 p-3 ${
                  insight.type === 'critical' ? 'bg-red-500/20 text-red-500' : 
                  insight.type === 'opportunity' ? 'bg-white/20 text-[#FFFFFF]' : 
                  'bg-white/10 text-white/40'
                }`}>
                  <Shield size={14} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-[#FFFFFF] transition-colors">{insight.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-bold">{insight.desc}</p>
                </div>
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:gap-5 transition-all">
                  {insight.action} <ExternalLink size={12} className="opacity-40" />
                </button>
             </div>
           ))}
        </div>
      )}
      {showConfig && (
        <div className="fixed inset-0 z-50 bg-[#131314]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[#131314] border border-[#444746] w-full max-w-2xl rounded-none flex flex-col max-h-[90vh] shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#444746] shrink-0">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <MapPin size={18} className="text-[#FFFFFF]" /> Domínio de Território
                </h2>
                <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Configuração de Bairros e Classes</p>
              </div>
              <button onClick={() => setShowConfig(false)} className="text-white/50 hover:text-white p-2 bg-[#121212] rounded-none border border-[#444746]">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase mb-2 block">Sua Cidade / Unidade</label>
                  <input 
                    type="text" 
                    value={configCity}
                    readOnly={user?.businessModel === 'ASSET_LIGHT'}
                    onChange={(e) => setConfigCity(e.target.value)}
                    className="w-full bg-[#121212] border border-[#444746] rounded-none px-4 py-3 text-sm text-white focus:border-[#FFFFFF]/50 outline-none"
                  />
                </div>
              </div>

              {/* INTEGRATED WEATHER STATION ADAPTER (WINF METEO-OS™ ENGINE v5.0) */}
              <div className="bg-[#121212] border border-[#444746] rounded-none p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-mono uppercase text-zinc-300 flex items-center gap-1.5 font-bold">
                      <Sun className="w-4 h-4 text-yellow-400 animate-pulse" />
                      WINF METEO-OS™ & Estação Digital
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                      Associa um feed meteorológico ao território. Ativa o cálculo automático de radiação IR/UV no painel e oferece sugestões táticas de venda com base nos índices climáticos em tempo real.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const key = `winf_weather_station_${configCity}`;
                      const currentlyActive = localStorage.getItem(key) !== 'false';
                      localStorage.setItem(key, currentlyActive ? 'false' : 'true');
                      setForceRender(prev => prev + 1);
                    }}
                    className={`px-4 py-2 text-[10px] font-black tracking-widest rounded-none flex items-center gap-2 transition-all shrink-0 ${
                      (localStorage.getItem(`winf_weather_station_${configCity}`) !== 'false')
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-none ${localStorage.getItem(`winf_weather_station_${configCity}`) !== 'false' ? 'bg-[#131314] animate-ping' : 'bg-zinc-600'}`}></span>
                    {localStorage.getItem(`winf_weather_station_${configCity}`) !== 'false' ? 'ESTAÇÃO ATIVA' : 'ESTAÇÃO INATIVA'}
                  </button>
                </div>
              </div>

              <div className="bg-[#121212] border border-[#444746] rounded-none p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-mono uppercase text-zinc-400">Bairros de {configCity}</h3>
                  <button 
                    onClick={() => {
                      setConfigBairros([...configBairros, { name: 'Novo Bairro', status: 'Oportunidade', share: 0, potential: 'Vasto', color: '#60A5FA', tier: 'C', demographic: '', ticket: 'R$ 0', volume: 'Médio', pos: { x: 50, y: 50 } }]);
                    }}
                    className="text-[10px] font-bold uppercase text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-none flex items-center gap-1 transition-colors"
                  >
                    <Plus size={12} /> Adicionar Bairro
                  </button>
                </div>

                <div className="space-y-2">
                  {configBairros.map((bairro: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-[#131314] border border-[#444746] rounded-none group">
                      <div className="flex-1 flex justify-between md:block">
                        <input 
                          type="text"
                          value={bairro.name}
                          onChange={(e) => {
                            const newB = [...configBairros];
                            newB[idx].name = e.target.value;
                            setConfigBairros(newB);
                          }}
                          className="w-full bg-transparent border-none text-sm text-white focus:outline-none" 
                          placeholder="Nome do Bairro"
                        />
                        <button className="md:hidden text-zinc-600 hover:text-red-500 p-1" onClick={() => {
                          const newB = [...configBairros];
                          newB.splice(idx, 1);
                          setConfigBairros(newB);
                        }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex flex-row gap-3">
                        <div className="flex-1 md:w-24">
                        <select 
                          value={bairro.tier}
                          onChange={(e) => {
                            const newB = [...configBairros];
                            newB[idx].tier = e.target.value;
                            setConfigBairros(newB);
                          }}
                          className="w-full bg-[#1A1A1A] border border-[#444746] text-xs text-white rounded-none p-1.5 outline-none"
                        >
                          <option value="A++">Classe A++</option>
                          <option value="A+">Classe A+</option>
                          <option value="A">Classe A</option>
                          <option value="B+">Classe B+</option>
                          <option value="B">Classe B</option>
                          <option value="C">Classe C</option>
                        </select>
                      </div>
                      <div className="flex-1 md:w-36">
                        <select 
                          value={bairro.status}
                          onChange={(e) => {
                            const newB = [...configBairros];
                            newB[idx].status = e.target.value as any;
                            if (e.target.value === 'Dominando' || e.target.value === 'Líder') newB[idx].share = 80 + Math.floor(Math.random() * 20);
                            else if (e.target.value === 'Competindo') newB[idx].share = 40 + Math.floor(Math.random() * 20);
                            else newB[idx].share = Math.floor(Math.random() * 20);
                            setConfigBairros(newB);
                          }}
                          className="w-full bg-[#1A1A1A] border border-[#444746] text-xs text-white rounded-none p-1.5 outline-none"
                        >
                          <option value="Líder">Líder Isolado</option>
                          <option value="Dominando">Dominando</option>
                          <option value="Competindo">Competindo</option>
                          <option value="Expansão">Expansão</option>
                          <option value="Oportunidade">Oportunidade</option>
                          <option value="Prospecção">Prospecção</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          const newB = [...configBairros];
                          newB.splice(idx, 1);
                          setConfigBairros(newB);
                        }}
                        className="hidden md:block text-zinc-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowConfig(false)} className="px-6 py-3 border border-[#444746] hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSaveConfig} className="px-6 py-3 bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-widest rounded-none transition-colors">
                  Salvar Território
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* PAINEL DE CONTROLE DE ATIVAÇÃO W-NO OS */}
      {painelAtivacaoData && (
        <div className="fixed inset-0 z-50 bg-[#131314]/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="winf-modal-activation border-2 border-[#444746] bg-zinc-950 text-white w-full max-w-lg p-6 font-sans relative overflow-hidden flex flex-col gap-6 rounded-none"
            style={{ boxShadow: '0 0 50px rgba(255, 255, 255, 0.05)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 border border-[#444746] flex items-center justify-center relative rounded-none">
                  <div className="absolute inset-0 rounded-none bg-white/10 animate-pulse" />
                  <span className="text-white text-xs font-mono font-bold">{painelAtivacaoData.id}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-widest uppercase text-white/50">WINF™ CONTROL NETWORK</h3>
                  <h3 className="text-lg font-bold tracking-tight text-white uppercase">
                    GESTÃO DE TERRITÓRIO: {painelAtivacaoData.nome.toUpperCase()}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setPainelAtivacaoData(null)}
                className="text-white/40 hover:text-white p-2 border border-[#444746] hover:border-[#444746] transition-all cursor-pointer rounded-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 py-4 border-y border-[#444746]">
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Este painel permite a implantação turn-key e a orquestração do bot autônomo e do DNS seguro no território selecionado. Selecione a ação estratégica abaixo:
              </p>

              <div className="stats-box flex items-center justify-between p-4 bg-white/5 border border-[#444746] rounded-none">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Status do Território</span>
                  <p className="text-sm font-mono mt-0.5 text-zinc-300">
                    Status: <strong className={painelAtivacaoData.status === 'active' ? "text-white font-bold" : painelAtivacaoData.status === 'reserved' ? "text-yellow-500" : "text-zinc-500"}>
                      {painelAtivacaoData.status.toUpperCase()}
                    </strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Índice de Performance</span>
                  <p className="text-sm font-mono mt-0.5 text-zinc-300">
                    Performance: <strong className="text-white font-mono font-bold">{painelAtivacaoData.performance}%</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-900 p-3 border border-[#444746] rounded-none">
                  <span className="text-zinc-500 text-[9px] block uppercase font-bold">Bot Autônomo</span>
                  <span className="text-[10px] font-bold text-white block mt-1">
                    {painelAtivacaoData.status === 'active' ? 'W-NO v1.2.0 Ativo' : 'Sem Conexão'}
                  </span>
                </div>
                <div className="bg-zinc-900 p-3 border border-[#444746] rounded-none">
                  <span className="text-zinc-500 text-[9px] block uppercase font-bold">Sistema de Corte</span>
                  <span className="text-[10px] font-bold text-white block mt-1">
                    {painelAtivacaoData.status === 'active' ? 'Winf Cut™ Integrado' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-row flex gap-3">
              <button 
                className="btn-activate flex-1 bg-white hover:bg-zinc-200 text-black py-4 text-xs font-black uppercase tracking-widest text-center cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-[0.98] rounded-none disabled:opacity-40 disabled:hover:scale-100 disabled:pointer-events-none"
                onClick={painelAtivacaoData.onAtivar}
                disabled={painelAtivacaoData.status === 'active'}
              >
                ATIVAR UNIDADE
              </button>
              <button 
                className="btn-block flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 text-xs font-black uppercase tracking-widest text-center cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-[0.98] rounded-none disabled:opacity-40 disabled:hover:scale-100 disabled:pointer-events-none"
                onClick={painelAtivacaoData.onBloquear}
                disabled={painelAtivacaoData.status !== 'active'}
              >
                BLOQUEAR ACESSO
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* COMPILADOR DE IMPLANTAÇÃO COGNITIVA W-NO TELEMETRIA */}
      {activationPulse && (
        <div className="fixed inset-0 z-50 bg-[#131314] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#131314] border border-[#FFFFFF]/30 p-8 font-mono space-y-6 shadow-[0_0_60px_rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between border-b border-[#FFFFFF]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-none animate-ping" />
                <span className="text-xs font-black tracking-widest text-[#FFFFFF]">W-NO CÓRTEX CORE V3</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Unidade: {activationPulse.city}</span>
            </div>

            <div className="bg-[#131314] p-5 rounded-none border border-[#444746] space-y-3 min-h-[220px] max-h-[300px] overflow-y-auto text-xs text-zinc-300 leading-relaxed">
              {activationPulse.log.map((line, lIdx) => (
                <div key={lIdx} className="flex gap-2.5">
                  <span className="text-zinc-600 select-none">[{lIdx + 1}]</span>
                  <span className={line.includes('SUCCESS') || line.includes('SUCESSO') ? 'text-[#FFFFFF] font-bold' : line.includes('DNS') ? 'text-blue-400' : 'text-zinc-300'}>
                    {line}
                  </span>
                </div>
              ))}
              <div className="w-1.5 h-4 bg-white animate-pulse inline-block" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                <span>Compilando chaves federadas...</span>
                <span>{Math.round((activationPulse.step / 6) * 100)}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 overflow-hidden relative border border-[#444746]">
                <div 
                  className="bg-white h-full transition-all duration-300"
                  style={{ width: `${(activationPulse.step / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TERMINAL DE CARGA DE TERRITÓRIOS WINF OS™ */}
      {showCargaTerminal && (
        <div className="fixed inset-0 z-50 bg-[#131314]/95 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-zinc-950 border-2 border-yellow-500/20 rounded-none overflow-hidden font-mono flex flex-col h-[550px]"
            style={{ boxShadow: '0 0 60px rgba(234, 179, 8, 0.1)' }}
          >
            {/* Header */}
            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-[#444746]">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-none bg-yellow-500 animate-pulse" />
                <span className="text-xs font-black tracking-widest text-yellow-500 uppercase">WINF OS™ // SCRIPT DE CARGA DE TERRITÓRIOS</span>
              </div>
              <button 
                onClick={() => setShowCargaTerminal(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded-none transition-all cursor-pointer border border-white/15"
                disabled={cargaStep >= 0 && cargaStep < 20}
              >
                <X size={16} />
              </button>
            </div>

            {/* Description / Instructions */}
            <div className="p-6 bg-zinc-900/30 border-b border-[#444746] space-y-2">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Este utilitário executa o script de carga assíncrono <code className="text-yellow-400 font-mono">carregarBaseTerritorial()</code> para carregar as praças e prepará-las no motor do WNO.
              </p>
              <div className="flex gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">
                <div>Status da Carga: <span className={cargaStep === 100 ? 'text-[#FFFFFF]' : cargaStep >= 0 ? 'text-yellow-500 animate-pulse' : 'text-zinc-400'}>{cargaStep === 100 ? 'INTEGRADO' : cargaStep >= 0 ? 'EXECUTANDO...' : 'PRONTO'}</span></div>
                <div>Praças Polo: <span className="text-white">100 CIDADES</span></div>
              </div>
            </div>

            {/* Console Log Display */}
            <div className="flex-1 bg-[#131314] p-6 overflow-y-auto space-y-2.5 text-xs">
              {cargaLogs.length === 0 ? (
                <div className="text-zinc-650 flex flex-col items-center justify-center h-full gap-2 font-sans">
                  <Cpu className="w-8 h-8 opacity-40 animate-pulse text-yellow-500" />
                  <p className="text-xs text-zinc-500">Terminal pronto em standby. Execute a carga para iniciar.</p>
                </div>
              ) : (
                cargaLogs.map((logLine, idx) => (
                  <div key={idx} className="flex gap-3 leading-relaxed">
                    <span className="text-zinc-700 select-none">[{String(idx + 1).padStart(3, '0')}]</span>
                    <span className={logLine.includes('SUCESSO') || logLine.includes('Consolidadas') || logLine.includes('cadastrada') ? 'text-[#FFFFFF] font-bold' : logLine.includes('WNO.registrarNovoTerritorio') || logLine.includes('REGISTRO') ? 'text-blue-400' : logLine.includes('CÓRTEX ADMIN') ? 'text-yellow-500 font-black' : 'text-zinc-300'}>
                      {logLine}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions and Progress bar */}
            <div className="bg-zinc-900 border-t border-[#444746] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:max-w-xs space-y-1.5">
                {cargaStep >= 0 && (
                  <>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                      <span>Processando Carga...</span>
                      <span>{cargaStep === 100 ? '100' : Math.min(100, Math.round((cargaStep / 30) * 100))}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 overflow-hidden rounded-none relative border border-[#444746]">
                      <div 
                        className="bg-yellow-500 h-full transition-all duration-300"
                        style={{ width: `${cargaStep === 100 ? 100 : Math.min(100, Math.round((cargaStep / 30) * 100))}%` }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {cargaStep === 100 ? (
                  <button 
                    onClick={() => setShowCargaTerminal(false)}
                    className="w-full md:w-auto bg-gradient-to-r from-zinc-500 to-teal-500 text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest text-center cursor-pointer hover:opacity-95 transition-all rounded-none select-none"
                  >
                    CONCLUÍDO (SAIR)
                  </button>
                ) : (
                  <button 
                    onClick={executarCargaTerritorial}
                    disabled={cargaStep >= 0}
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3.5 text-xs font-black uppercase tracking-widest text-center cursor-pointer transition-all rounded-none select-none disabled:bg-zinc-800 disabled:text-zinc-650 disabled:pointer-events-none disabled:opacity-40"
                  >
                    EXECUTAR SCRIPT DE CARGA
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* TERMINAL DE GATILHO DE ATIVAÇÃO DE UNIDADE COM ESTOQUE (WINF OS™) */}
      {showAutoActivator && (
        <div className="fixed inset-0 z-50 bg-[#131314]/95 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-zinc-950 border-2 border-[#FFFFFF]/25 rounded-none overflow-hidden font-mono flex flex-col h-[650px]"
            style={{ boxShadow: '0 0 70px rgba(255, 255, 255, 0.12)' }}
          >
            {/* Header */}
            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-[#444746]">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-none bg-white animate-pulse" />
                <span className="text-xs font-black tracking-widest text-[#FFFFFF] uppercase">WINF OS™ // GATEWAY DE ATIVAÇÃO AUTOMÁTICA</span>
              </div>
              <button 
                onClick={() => setShowAutoActivator(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded-none transition-all cursor-pointer border border-white/15"
                disabled={autoActiveStep === 'processing'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Split Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
              {/* Left Column: JSON Payload display */}
              <div className="lg:col-span-5 bg-zinc-950 border-r border-[#444746] flex flex-col h-full overflow-hidden">
                <div className="px-5 py-3 bg-zinc-900/40 border-b border-[#444746] flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 tracking-wider">JSON INPUT PAYLOAD</span>
                  <span className="text-[9px] bg-white/10 text-[#FFFFFF] px-2 py-0.5 rounded-none font-bold font-sans">SELECT LINE</span>
                </div>
                <div className="flex-1 p-5 overflow-auto custom-scrollbar font-mono text-[11px] text-zinc-350 leading-relaxed bg-[#131314]">
                  <pre className="text-[#FFFFFF] select-all p-3 rounded-none bg-zinc-950/60 border border-[#444746]">
{`{
  "registro_ativo": {
    "unidade": "SANTOS_01",
    "status": "OPERACIONAL",
    "estoque_vinculado": {
      "linha": "SELECT_WINF_ARQUITETONICA",
      "lote_nfe": "NFE-2026-0001",
      "documentacao_url": "link_seguro_da_nota_fiscal",
      "data_envio": "2026-05-25"
    }
  }
}`}
                  </pre>
                  <div className="mt-4 p-4 border border-[#444746] bg-zinc-900/20 rounded-none font-sans text-xs space-y-2 text-zinc-400">
                    <span className="block font-black text-white text-[10px] uppercase tracking-wider">Lógica do Script:</span>
                    <p className="leading-relaxed">
                      Este gatilho chama a rotina autônoma de inteligência, realizando no mesmo bloco de transação a liberação de licença e lastreamento de bobinas originais de película termo-acústicas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Output Terminal */}
              <div className="lg:col-span-7 flex flex-col h-full bg-[#131314] overflow-hidden">
                <div className="px-5 py-3 bg-zinc-900/40 border-b border-[#444746] flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 tracking-wider">CONSOLE DE EXECUÇÃO SÍNCRONA</span>
                  <span className={`text-[9px] font-black ${autoActiveStep === 'success' ? 'text-[#FFFFFF]' : autoActiveStep === 'processing' ? 'text-yellow-500 animate-pulse' : 'text-zinc-500'}`}>
                    {autoActiveStep === 'success' ? 'TRANSACIONAL_CONCLUÍDO' : autoActiveStep === 'processing' ? 'PROCESSANDO_BLOCK...' : 'STANDBY'}
                  </span>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-2 font-mono text-xs text-zinc-350 bg-[#131314]">
                  {autoActiveLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-zinc-645 opacity-60">
                      <Cpu className="w-10 h-10 text-[#FFFFFF] animate-pulse mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-wider">NENHUMA EXECUÇÃO REALIZADA</p>
                      <p className="text-xs font-sans mt-0.5 max-w-xs leading-relaxed">Clique no botão abaixo para disparar o gatilho transacional de ativação com lastro de estoque.</p>
                    </div>
                  ) : (
                    autoActiveLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2.5 leading-relaxed">
                        <span className="text-zinc-700 select-none">[{String(idx+1).padStart(2, '0')}]</span>
                        <span className={log.includes('[SUCESSO]') || log.includes('[DATABASE SUCCESS]') || log.includes('[LEDGER SUCCESS]') ? 'text-[#FFFFFF] font-bold' : log.includes('WNO.ledger') || log.includes('WNO.db') ? 'text-blue-400' : 'text-zinc-300'}>
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Bar */}
                <div className="p-4 bg-zinc-900 flex items-center justify-between border-t border-[#444746]">
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider font-sans uppercase">W-NO Blockchain & Trust Layer</span>
                  {autoActiveStep === 'success' ? (
                    <button
                      onClick={() => setShowAutoActivator(false)}
                      className="bg-gradient-to-r from-zinc-500 to-teal-500 text-black px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all select-none cursor-pointer"
                    >
                      Sair e Ver Mapa
                    </button>
                  ) : (
                    <button
                      onClick={executarAtivacaoAutomatica}
                      disabled={autoActiveStep === 'processing'}
                      className="bg-white hover:bg-zinc-200 disabled:opacity-40 text-black px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-wider transition-all select-none cursor-pointer"
                    >
                      {autoActiveStep === 'processing' ? 'Ativando...' : 'Ativar Unidade'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* INTERACTIVE LOGISTIC ROUTING SIMULATOR */}
      {showLogisticRouter && (
        <div className="fixed inset-0 z-50 bg-[#131314]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-zinc-950 border-2 border-[#444746] rounded-none overflow-hidden font-mono flex flex-col h-[650px]"
            style={{ boxShadow: '0 0 70px rgba(255, 255, 255, 0.05)' }}
          >
            {/* Header */}
            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-[#444746]">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-white animate-pulse" />
                <span className="text-xs font-black tracking-widest text-white uppercase">WINF OS™ // ENGINE DE ROTEAMENTO LOGÍSTICO</span>
              </div>
              <button 
                onClick={() => setShowLogisticRouter(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded-none transition-all cursor-pointer border border-white/15"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
              
              {/* Left Panel: Inputs and Presets */}
              <div className="lg:col-span-5 bg-[#131314] border-r border-[#444746] flex flex-col h-full overflow-hidden p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2 font-sans-serif">Cidade de Destino</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={routerCityInput}
                      onChange={(e) => setRouterCityInput(e.target.value)}
                      placeholder="Ex: Rio de Janeiro"
                      className="w-full bg-[#131314] border border-[#444746] hover:border-[#444746] focus:border-white focus:ring-1 focus:ring-white text-white px-4 py-3 rounded-none text-sm font-sans transition-all outline-none"
                    />
                    <MapPin className="absolute right-3.5 top-3.5 text-zinc-650 w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                  <span className="block text-[9px] font-black text-zinc-650 uppercase tracking-wider font-sans">Sugestões de Região</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'São Paulo', state: 'SP' },
                      { name: 'Rio de Janeiro', state: 'RJ' },
                      { name: 'Belo Horizonte', state: 'MG' },
                      { name: 'Curitiba', state: 'PR' },
                      { name: 'Porto Alegre', state: 'RS' },
                      { name: 'Salvador', state: 'BA' },
                      { name: 'Recife', state: 'PE' },
                      { name: 'Fortaleza', state: 'CE' },
                      { name: 'Brasília', state: 'DF' },
                      { name: 'Campinas', state: 'SP' },
                      { name: 'João Pessoa', state: 'PB' },
                      { name: 'Natal', state: 'RN' },
                      { name: 'Miguel Pereira', state: 'RJ' }
                    ].map((city) => (
                      <button
                        key={city.name}
                        onClick={() => setRouterCityInput(city.name)}
                        className={`text-left p-2.5 rounded-none border text-xs transition-all flex items-center justify-between font-sans ${
                          routerCityInput.toLowerCase().trim() === city.name.toLowerCase().trim()
                            ? 'bg-white/10 border-white text-white font-bold'
                            : 'bg-zinc-950/40 border-[#444746] hover:border-[#444746] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{city.name}</span>
                        <span className="text-[8px] opacity-40 uppercase font-mono">{city.state}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-950 border border-[#444746] rounded-none text-zinc-500 font-sans text-xs space-y-1.5 leading-relaxed">
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono">SOBRE A ENGINE LO-OPT</span>
                  <p>
                    A engine calcula a distância geodésica (Haversine) em tempo real entre a cidade alvo e os três HUBs logísticos autorizados para lastro físico da WINF.
                  </p>
                </div>
              </div>

              {/* Right Panel: Hub comparison and Code Audit logs */}
              <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#131314] p-6 space-y-6">
                
                {/* Visual result section */}
                <div>
                  <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 font-sans text-xs">Análise Operacional de Lastreamento</span>
                  
                  <div className="space-y-3.5">
                     {[
                      { id: 'santos', label: 'CADEIRA SANTOS_01 (W12 BOARD)', details: 'Holding Central & Porto Alfandegário (W12)', key: 'SANTOS', role: 'Comando Central & Logística Mestre (W12)' },
                      { id: 'sorocaba', label: 'CADEIRA SOROCABA_02 (W12 BOARD)', details: 'Nó de Decisão Governamental & Interior (W12)', key: 'SOROCABA', role: 'Diretoria de Decisão & Expansão com Autonomia Plena (Ledger Ativo)' },
                      { id: 'sao_paulo', label: 'CADEIRA SÃO PAULO_03 (W12 BOARD)', details: 'Core Financeiro & Inteligência de Lastro (W12)', key: 'SAO_PAULO', role: 'Cúpula Executiva & Lastreamento Logístico W12' }
                    ].filter(h => obterHubsAtivosLogistica().includes(h.key)).map((hub) => {
                      const dist = calcularDistancia(routerCityInput, hub.key);
                      const isWinner = definirHubLogistico(routerCityInput) === hub.id;
                      const isSorocaba = hub.key === 'SOROCABA';
                      
                      return (
                        <div 
                           key={hub.id}
                           className={`p-4 rounded-none border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                             isSorocaba 
                               ? 'bg-zinc-950/90 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.08)]' 
                               : isWinner 
                                 ? 'bg-zinc-950/80 border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.02)] animate-pulse-slow' 
                                 : 'bg-zinc-950/40 border-[#444746] text-zinc-400'
                           }`}
                        >
                           {/* Left Details */}
                           <div className="space-y-1">
                             <div className="flex items-center gap-2 flex-wrap">
                               <span className={`text-xs font-black tracking-wider ${isSorocaba ? 'text-white' : isWinner ? 'text-white' : 'text-zinc-300'}`}>{hub.label}</span>
                               {isSorocaba && (
                                 <span className="text-[8px] bg-white text-black font-black px-1.5 py-0.5 rounded-none tracking-widest uppercase font-mono animate-pulse">Cadeira W12 (Board) 🏛️</span>
                                )}
                               {isWinner && !isSorocaba && (
                                 <span className="text-[8px] bg-white text-black font-black px-1.5 py-0.5 rounded-none tracking-widest uppercase font-mono">MELHOR ROTA</span>
                               )}
                             </div>
                             <span className="block text-[10px] font-sans text-zinc-300 font-semibold">{hub.details}</span>
                             <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{hub.role}</span>
                             
                             {isSorocaba && (
                               <div className="mt-2 flex items-center gap-2 bg-white/5 border border-[#444746] px-2 py-1 rounded-none w-fit">
                                 <span className="w-1.5 h-1.5 rounded-none bg-white animate-ping"></span>
                                 <span className="text-[8px] text-zinc-200 font-mono tracking-wider font-bold uppercase">AUTONOMIA DE DIRETORIA ATIVA • PARÂMETRO LEDGER CONECTADO</span>
                               </div>
                             )}
                           </div>

                           {/* Distance value */}
                           <div className="text-right sm:text-right flex flex-col items-end">
                             <span className={`text-xl font-bold font-mono tracking-tight ${isSorocaba ? 'text-white' : isWinner ? 'text-white' : 'text-zinc-200'}`}>
                               {dist.toFixed(1)} km
                             </span>
                             <span className="block text-[9px] font-sans text-zinc-500 font-medium whitespace-nowrap">Distância Estimada</span>
                           </div>

                           {/* Gradient background decoration */}
                           {isWinner && !isSorocaba && (
                             <div className="absolute right-0 bottom-0 top-0 w-24 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
                           )}
                           {isSorocaba && (
                             <div className="absolute right-0 bottom-0 top-0 w-24 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
                           )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time audit code display */}
                <div className="flex-1 flex flex-col bg-zinc-950 border border-[#444746] rounded-none overflow-hidden font-mono text-[11px] leading-relaxed">
                  <div className="bg-zinc-900/40 px-4 py-2 flex items-center justify-between border-b border-[#444746] text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                    <span>SCRIPT OFICIAL DE ROTEAMENTO LOGÍSTICO</span>
                    <span className="text-white">STATUS: ATIVO</span>
                  </div>
                  <div className="flex-1 p-4 bg-[#131314] overflow-auto pr-3 custom-scrollbar text-zinc-300 select-all font-mono">
                    <pre>
{`/* --- WINF OS™ // ENGINE DE ROTEAMENTO LOGÍSTICO --- */

function definirHubLogistico(cidadeDestino) {
    // O sistema analisa a proximidade para otimizar o frete e lastro no Triângulo Logístico W12 (Santos, São Paulo e Sorocaba)
    const distancias = {
        santos: calcularDistancia(cidadeDestino, 'SANTOS'),
        sorocaba: calcularDistancia(cidadeDestino, 'SOROCABA'),
        sao_paulo: calcularDistancia(cidadeDestino, 'SAO_PAULO')
    };

    // Retorna o Hub com a menor distância (otimização de lastro)
    return Object.keys(distancias).reduce((a, b) => 
        distancias[a] < distancias[b] ? a : b
    );
}`}
                    </pre>
                  </div>
                </div>

                {/* Bottom navigation output summary */}
                <div className="pt-3 border-t border-[#444746] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-450 font-sans">
                    Hub Atribuído para <strong className="text-white font-sans">"{routerCityInput}"</strong>: 
                    <strong className="text-white uppercase ml-1.5 font-mono">
                      {definirHubLogistico(routerCityInput).toUpperCase()}
                    </strong>
                  </span>
                  <button
                    onClick={() => setShowLogisticRouter(false)}
                    className="bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-none transition-all select-none cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* TERMINAL DE RECONFIGURAÇÃO DE MALHA LOGÍSTICA (WINF OS™) */}
      {showReconfigMalha && (
        <div className="fixed inset-0 z-50 bg-[#131314]/95 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-zinc-950 border-2 border-[#FFFFFF]/25 rounded-none overflow-hidden font-mono flex flex-col h-[650px]"
            style={{ boxShadow: '0 0 70px rgba(255, 255, 255, 0.12)' }}
          >
            {/* Header */}
            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-[#444746]">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-none bg-white animate-pulse" />
                <span className="text-xs font-black tracking-widest text-[#FFFFFF] uppercase">WINF OS™ // RECONFIGURAÇÃO DE MALHA LOGÍSTICA</span>
              </div>
              <button 
                onClick={() => setShowReconfigMalha(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded-none transition-all cursor-pointer border border-white/15"
                disabled={reconfigStep === 'processing'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Split Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
              {/* Left Column: Script display */}
              <div className="lg:col-span-5 bg-zinc-950 border-r border-[#444746] flex flex-col h-full overflow-hidden">
                <div className="px-5 py-3 bg-zinc-900/40 border-b border-[#444746] flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 tracking-wider">CÓDIGO FONTE DO GATILHO</span>
                  <span className="text-[9px] bg-white/10 text-[#FFFFFF] px-2 py-0.5 rounded-none font-bold font-sans">RECONFIG BLOCK</span>
                </div>
                <div className="flex-1 p-5 overflow-auto custom-scrollbar font-mono text-[11px] text-zinc-350 leading-relaxed bg-[#131314]">
                  <pre className="text-[#FFFFFF] select-all p-3 rounded-none bg-zinc-950/60 border border-[#444746]">
{`/* --- WINF OS™ // RECONFIGURAÇÃO --- */

const atualizarMalhaLogistica = () => {
    const novosHubs = [
      'SANTOS', 
      'SOROCABA', 
      'SAO_PAULO'
    ];
    
    // O W-NO™ reconfigura os nós
    WNO.config.logistica.resetRede();
    
    novosHubs.forEach(hub => {
        WNO.config.logistica.registrarHub({
            id: hub,
            tipo: 'MASTER_HUB',
            gestao: 'FUNDADOR_ADMIN'
        });
    });

    console.log("[STATUS] Malha logistica...");
};`}
                  </pre>
                  <div className="mt-4 p-4 border border-[#444746] bg-zinc-900/20 rounded-none font-sans text-xs space-y-2 text-zinc-400">
                    <span className="block font-black text-white text-[10px] uppercase tracking-wider">Lógica do Script:</span>
                    <p className="leading-relaxed">
                      Esta rotina é destinada à reconfiguração em tempo real dos nós de escoamento. Ela triangula a malha conectando São Paulo, Santos e Sorocaba sob o domínio administrativo direto do Board.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Output Terminal */}
              <div className="lg:col-span-7 flex flex-col h-full bg-[#131314] overflow-hidden">
                <div className="px-5 py-3 bg-zinc-900/40 border-b border-[#444746] flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 tracking-wider">CONSOLE DE COORDENAÇÃO DE MALHA</span>
                  <span className={`text-[9px] font-black ${reconfigStep === 'success' ? 'text-[#FFFFFF]' : reconfigStep === 'processing' ? 'text-yellow-500 animate-pulse' : 'text-zinc-500'}`}>
                    {reconfigStep === 'success' ? 'MALHA_RECONFIGURADA' : reconfigStep === 'processing' ? 'SINCRONIZANDO_HOLO...' : 'STANDBY'}
                  </span>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-2 font-mono text-xs text-zinc-350 bg-[#131314]">
                  {reconfigLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 opacity-60">
                      <div className="w-10 h-10 border border-[#FFFFFF]/40 flex items-center justify-center rounded-none text-[#FFFFFF] animate-pulse mb-3 bg-white/5 font-sans font-bold text-xs">
                        W
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">AGUARDANDO ATIVAÇÃO DO CONSELHO</p>
                      <p className="text-xs font-sans mt-0.5 max-w-xs leading-relaxed text-zinc-500">Clique em "Triangular Rede" para instruir o W-NO Cortex a resetar a antiga infraestrutura e firmar os novos nós.</p>
                    </div>
                  ) : (
                    reconfigLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2.5 leading-relaxed">
                        <span className="text-zinc-700 select-none">[{String(idx+1).padStart(2, '0')}]</span>
                        <span className={log.includes('[STATUS SUCCESS]') || log.includes('[MALHA RECONFIG]') || log.includes('[STATUS]') ? 'text-[#FFFFFF] font-bold' : log.includes('WNO.config') ? 'text-blue-400' : 'text-zinc-300'}>
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Bar */}
                <div className="p-4 bg-zinc-900 flex items-center justify-between border-t border-[#444746]">
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider font-sans uppercase">W-NO Blockchain & Network Topology</span>
                  {reconfigStep === 'success' ? (
                    <button
                      onClick={() => setShowReconfigMalha(false)}
                      className="bg-gradient-to-r from-zinc-500 to-teal-500 text-black px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all select-none cursor-pointer"
                    >
                      Sair e Ver Mapa
                    </button>
                  ) : (
                    <button
                      onClick={executarReconfiguracaoMalha}
                      disabled={reconfigStep === 'processing'}
                      className="bg-white hover:opacity-95 disabled:opacity-40 text-black px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-wider transition-all select-none cursor-pointer"
                    >
                      {reconfigStep === 'processing' ? 'Reconfigurando...' : 'Triangular Rede'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* TERMINAL DE TRANSFERÊNCIA DE LASTRO ENTRE HUBS (WINF OS™) */}
      {showTransferLastro && (
        <div className="fixed inset-0 z-50 bg-[#131314]/95 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl bg-zinc-950 border-2 border-[#FFFFFF]/25 rounded-none overflow-hidden font-mono flex flex-col h-[700px]"
            style={{ boxShadow: '0 0 70px rgba(255, 255, 255, 0.12)' }}
          >
            {/* Header */}
            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-[#444746]">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#FFFFFF]" />
                <span className="text-xs font-black tracking-widest text-[#FFFFFF] uppercase">WINF OS™ // COORDENAÇÃO DE FLUXO & TRANSFERÊNCIA ENTRE HUBs</span>
              </div>
              <button 
                onClick={() => setShowTransferLastro(false)}
                className="text-white/40 hover:text-white p-1 hover:bg-white/10 rounded-none transition-all cursor-pointer border border-white/15"
                disabled={transferStep === 'processing'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Split Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
              
              {/* Left Column: Form & Hub Stocks */}
              <div className="lg:col-span-5 bg-zinc-950 border-r border-[#444746] flex flex-col h-full overflow-hidden p-6 space-y-5">
                <div>
                  <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 text-xs">SELEÇÃO DE INTEGRANTES</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Origin selection */}
                    <div>
                      <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">Hub de Origem</label>
                      <select 
                        value={transferOrigem} 
                        onChange={(e) => setTransferOrigem(e.target.value)}
                        className="w-full bg-[#131314] border border-[#444746] text-white rounded-none px-3 py-2 text-xs font-sans outline-none focus:border-[#FFFFFF]"
                      >
                        {obterHubsAtivosLogistica().map(h => (
                          <option key={h} value={h}>{h} ({estoquesHubs[h as keyof typeof estoquesHubs] || 0} m²)</option>
                        ))}
                      </select>
                    </div>

                    {/* Destination selection */}
                    <div>
                      <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">Hub de Destino</label>
                      <select 
                        value={transferDestino} 
                        onChange={(e) => setTransferDestino(e.target.value)}
                        className="w-full bg-[#131314] border border-[#444746] text-white rounded-none px-3 py-2 text-xs font-sans outline-none focus:border-[#FFFFFF]"
                      >
                        {obterHubsAtivosLogistica().map(h => (
                          <option key={h} value={h}>{h} ({estoquesHubs[h as keyof typeof estoquesHubs] || 0} m²)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Amount to transfer */}
                <div>
                  <label className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">Quantidade para Envio (m²)</label>
                  <input 
                    type="number"
                    value={transferQuantidade}
                    onChange={(e) => setTransferQuantidade(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#131314] border border-[#444746] text-white rounded-none px-3 py-2 text-xs font-mono outline-none focus:border-[#FFFFFF]"
                  />
                </div>

                {/* Live Freight and Master Hub display using HUB_CONFIG */}
                <div className="bg-zinc-900/40 border border-[#444746] rounded-none p-3.5 space-y-2.5 text-left">
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-wider text-zinc-400">
                    <span>Estimativa de Frete Interno</span>
                    <span className="text-xs text-[#FFFFFF] font-sans font-bold">WINF OS™</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-[#131314]/50 p-2 rounded-none border border-[#444746] space-y-0.5">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase block">Origem &rarr; Destino</span>
                      <span className="text-zinc-200 uppercase font-mono">{transferOrigem} &rarr; {transferDestino}</span>
                    </div>
                    <div className="bg-[#131314]/50 p-2 rounded-none border border-[#444746] space-y-0.5">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase block">Custo de Frete (R$)</span>
                      <span className="text-[#FFFFFF] font-bold font-mono">
                        {transferOrigem === transferDestino 
                          ? 'R$ 0,00' 
                          : `R$ ${calcularFreteInterno(transferOrigem, transferDestino).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Master Hub highlight details */}
                  <div className="text-[10px] text-zinc-400 leading-relaxed pt-1.5 border-t border-[#444746] space-y-1">
                    <span className="font-extrabold text-[9px] uppercase tracking-wider text-zinc-400 block">Diretiva de Malha Mestra:</span>
                    <span className="block text-[10px] text-zinc-500 font-mono">
                      MASTER HUB: {HUB_CONFIG.MASTER.nome} | Emissão NF-e: {HUB_CONFIG.MASTER.pode_emitir_nfe ? 'S' : 'N'}
                    </span>
                  </div>
                </div>

                {/* Live inventory monitor */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                  <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest text-[10px]">Monitor Imutável de Lastro (Hubs)</span>
                  <div className="space-y-2.5">
                    {obterHubsAtivosLogistica().map((hub) => {
                      const qty = estoquesHubs[hub as keyof typeof estoquesHubs] || 0;
                      const maxPossible = 1500;
                      const pct = Math.min(100, (qty / maxPossible) * 100);
                      
                      return (
                        <div key={hub} className="bg-[#131314]/40 border border-[#444746] p-3 rounded-none space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-zinc-300">{hub}</span>
                            <span className="text-[#FFFFFF] font-bold">{qty} m²</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-900 rounded-none overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-zinc-500 to-[#FFFFFF] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit trigger button */}
                <div>
                  <button
                    onClick={executarTransferenciaLastro}
                    disabled={transferStep === 'processing'}
                    className="w-full bg-white hover:opacity-95 disabled:opacity-40 text-black py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all select-none cursor-pointer"
                  >
                    {transferStep === 'processing' ? 'Transmitindo...' : 'Disparar Transferência'}
                  </button>
                </div>
              </div>

              {/* Right Column: Active Transits, Logs and Code */}
              <div className="lg:col-span-7 flex flex-col h-full bg-[#131314] overflow-hidden p-6 space-y-6">
                
                {/* Active shipments block to complete deliveries */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-[10px]">Trânsitos Logísticos Ativos (Confirmação Pendente)</span>
                    <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-none font-black">LEDGER DE ENVIOS</span>
                  </div>

                  <div className="max-h-[170px] overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {transitosLogistica.length === 0 ? (
                      <div className="text-center py-6 border border-[#444746] rounded-none bg-[#131314] text-xs text-zinc-500">
                        Nenhuma transferência registrada pendente de recebimento.
                      </div>
                    ) : (
                      transitosLogistica.slice().reverse().map((transito) => (
                        <div 
                          key={transito.id} 
                          className={`p-3 rounded-none border flex items-center justify-between gap-4 transition-all ${
                            transito.status === 'EM_MOVIMENTO' 
                              ? 'bg-zinc-900/60 border-yellow-500/20 text-white' 
                              : 'bg-zinc-950/20 border-[#444746] text-zinc-500'
                          }`}
                        >
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">{transito.de} &rarr; {transito.para}</span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded-none font-black uppercase tracking-wider ${
                                transito.status === 'EM_MOVIMENTO' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/10 text-[#FFFFFF]'
                              }`}>
                                {transito.status}
                              </span>
                            </div>
                            <span className="block text-[10px] text-zinc-400 font-sans">
                              ID: {transito.id} | Quantidade: <strong className="font-mono text-zinc-100">{transito.qnt}m²</strong> | {new Date(transito.timestamp).toLocaleTimeString()}
                            </span>
                          </div>

                          {transito.status === 'EM_MOVIMENTO' && (
                            <button
                              onClick={() => confirmarRecebimentoLastro(transito.id)}
                              className="bg-white hover:opacity-90 text-black px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer flex items-center gap-1.5"
                            >
                              <Check size={11} />
                              Receber
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Console text log */}
                <div className="flex-1 flex flex-col bg-zinc-950 border border-[#444746] rounded-none overflow-hidden text-[11px] leading-relaxed">
                  <div className="bg-zinc-900/40 px-4 py-2 flex items-center justify-between border-b border-[#444746] text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-[9px]">
                    <span>CONSOLE DO PROTOCOLO TRANSFERIRLASTRO()</span>
                    <span className={`text-[9px] font-bold ${transferStep === 'success' ? 'text-[#FFFFFF]' : transferStep === 'processing' ? 'text-yellow-500 animate-pulse' : 'text-zinc-650'}`}>
                      {transferStep === 'success' ? 'LOG_REGISTRADO' : transferStep === 'processing' ? 'TRANSMISSÃO_LEDGER...' : 'STANDBY'}
                    </span>
                  </div>
                  <div className="flex-1 p-4 bg-[#131314] overflow-y-auto space-y-1.5 font-mono text-zinc-300 text-left">
                    {transferLogs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 opacity-60">
                        <RefreshCw className="w-8 h-8 text-[#FFFFFF] animate-spin -duration-1000 mb-2.5" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#FFFFFF]">BARRAMENTO DE COMANDO VAZIO</p>
                        <p className="text-xs font-sans mt-0.5 max-w-sm">Determine acima a origem e destino para remanejar o lastro físico geodésico.</p>
                      </div>
                    ) : (
                      transferLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2.5 leading-relaxed">
                          <span className="text-zinc-700 select-none">[{String(idx+1).padStart(2, '0')}]</span>
                          <span className={log.includes('[STATUS SUCCESS]') || log.includes('[W-NO LEDGER SUCCESS]') ? 'text-[#FFFFFF] font-bold' : log.includes('[ERRO]') ? 'text-rose-500 font-bold' : log.includes('WNO.db') ? 'text-blue-400' : 'text-zinc-300'}>
                            {log}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Foot Code review block */}
                <div className="h-[95px] bg-[#131314] border border-[#444746] rounded-none overflow-auto p-3 text-[10px] leading-normal text-[#FFFFFF]/90 select-all text-left">
                  <pre>
{`async function transferirLastro(origem, destino, quantidade) {
    await WNO.db.hubs.debitar(origem, quantidade);
    await WNO.db.logistica.registrarTransito({
        de: origem, para: destino, qnt: quantidade, status: 'EM_MOVIMENTO'
    });
    console.log('[LOGÍSTICA] Transferência iniciada...');
}`}
                  </pre>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ModuleGeoStrategy;
