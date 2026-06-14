import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Filter, CheckCircle, XCircle, Globe, Cpu, Mail, 
  ShieldCheck, AlertTriangle, Edit2, Check, RefreshCw, Layers 
} from 'lucide-react';

export interface Territory {
  id: string;
  city: string;
  state: string;
  region: 'Sudeste' | 'Sul' | 'Nordeste' | 'Norte' | 'Centro-Oeste';
  tier: 'A+++' | 'A++' | 'A+' | 'A' | 'B+';
  status: 'active' | 'available' | 'reserved';
  owner: string;
  botStatus: 'homologated' | 'pending' | 'none';
  domainStatus: 'secured' | 'pending' | 'none';
  customFee?: number;
}

export const INITIAL_TERRITORIES: Territory[] = [
  // CORES E UNIDADES ATIVAS DO CO-FOUNDER (DIRETRIZES)
  { id: 'T01', city: 'Santos', state: 'SP', region: 'Sudeste', tier: 'A+++', status: 'active', owner: 'Tiago (CEO / Founder)', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T02', city: 'Campina Grande', state: 'PB', region: 'Nordeste', tier: 'A+', status: 'active', owner: 'Tiago (Tech / Founder)', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T03', city: 'Praia Grande', state: 'SP', region: 'Sudeste', tier: 'A', status: 'active', owner: 'Tiago (CEO / Founder)', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T04', city: 'Guarujá', state: 'SP', region: 'Sudeste', tier: 'A+', status: 'active', owner: 'Tiago (CEO / Founder)', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T05', city: 'Cubatão', state: 'SP', region: 'Sudeste', tier: 'B+', status: 'active', owner: 'Tiago (CEO / Founder)', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T06', city: 'Bertioga', state: 'SP', region: 'Sudeste', tier: 'A', status: 'active', owner: 'Tiago (CEO / Founder)', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T07', city: 'São Vicente', state: 'SP', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T08', city: 'São Paulo (Itaim Bibi)', state: 'SP', region: 'Sudeste', tier: 'A+++', status: 'reserved', owner: 'WINF Partners Mestre', botStatus: 'pending', domainStatus: 'secured' },
  { id: 'T09', city: 'São Paulo (Moema/Morumbi)', state: 'SP', region: 'Sudeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T10', city: 'São Paulo (Santana/ZN)', state: 'SP', region: 'Sudeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T11', city: 'Campinas', state: 'SP', region: 'Sudeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T12', city: 'São José dos Campos', state: 'SP', region: 'Sudeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T13', city: 'Ribeirão Preto', state: 'SP', region: 'Sudeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T14', city: 'Sorocaba', state: 'SP', region: 'Sudeste', tier: 'A', status: 'active', owner: 'Cadeira W12 (Board) / Interior', botStatus: 'homologated', domainStatus: 'secured' },
  { id: 'T15', city: 'Jundiaí', state: 'SP', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T16', city: 'Santo André', state: 'SP', region: 'Sudeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T17', city: 'São Bernardo do Campo', state: 'SP', region: 'Sudeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T18', city: 'São Caetano do Sul', state: 'SP', region: 'Sudeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T19', city: 'Barueri / Alphaville', state: 'SP', region: 'Sudeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T20', city: 'Mogi das Cruzes', state: 'SP', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T21', city: 'Piracicaba', state: 'SP', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T22', city: 'Bauru', state: 'SP', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T23', city: 'Marília', state: 'SP', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T24', city: 'São José do Rio Preto', state: 'SP', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T25', city: 'Presidente Prudente', state: 'SP', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T26', city: 'Franca', state: 'SP', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T27', city: 'Limeira', state: 'SP', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  
  // RIO DE JANEIRO
  { id: 'T28', city: 'Rio de Janeiro (Barra/Recreio)', state: 'RJ', region: 'Sudeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T29', city: 'Rio de Janeiro (Copacabana/Ipanema)', state: 'RJ', region: 'Sudeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T30', city: 'Niterói', state: 'RJ', region: 'Sudeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T31', city: 'Petrópolis', state: 'RJ', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T32', city: 'Volta Redonda', state: 'RJ', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T33', city: 'Nova Iguaçu', state: 'RJ', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T34', city: 'Cabo Frio', state: 'RJ', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T35', city: 'Campos dos Goytacazes', state: 'RJ', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },

  // MINAS GERAES / ESPIRITO SANTO
  { id: 'T36', city: 'Belo Horizonte (Lourdes/Savassi)', state: 'MG', region: 'Sudeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T37', city: 'Nova Lima (Alphaville)', state: 'MG', region: 'Sudeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T38', city: 'Contagem', state: 'MG', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T39', city: 'Uberlândia', state: 'MG', region: 'Sudeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T40', city: 'Juiz de Fora', state: 'MG', region: 'Sudeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T41', city: 'Uberaba', state: 'MG', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T42', city: 'Ipatinga', state: 'MG', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T43', city: 'Governador Valadares', state: 'MG', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T44', city: 'Montes Claros', state: 'MG', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T45', city: 'Divinópolis', state: 'MG', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T46', city: 'Vitória', state: 'ES', region: 'Sudeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T47', city: 'Vila Velha', state: 'ES', region: 'Sudeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T48', city: 'Linhares', state: 'ES', region: 'Sudeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },

  // SUL - PR, SC, RS
  { id: 'T49', city: 'Curitiba (Batel/Champagnat)', state: 'PR', region: 'Sul', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T50', city: 'Londrina', state: 'PR', region: 'Sul', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T51', city: 'Maringá', state: 'PR', region: 'Sul', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T52', city: 'Cascavel', state: 'PR', region: 'Sul', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T53', city: 'Foz do Iguaçu', state: 'PR', region: 'Sul', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T54', city: 'Ponta Grossa', state: 'PR', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T55', city: 'São José dos Pinhais', state: 'PR', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T56', city: 'Porto Alegre (Moinhos de Vento)', state: 'RS', region: 'Sul', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T57', city: 'Caxias do Sul', state: 'RS', region: 'Sul', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T58', city: 'Canoas', state: 'RS', region: 'Sul', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T59', city: 'Pelotas', state: 'RS', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T60', city: 'Santa Maria', state: 'RS', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T61', city: 'Passo Fundo', state: 'RS', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T62', city: 'Florianópolis (Jurerê/Centro)', state: 'SC', region: 'Sul', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T63', city: 'Joinville', state: 'SC', region: 'Sul', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T64', city: 'Blumenau', state: 'SC', region: 'Sul', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T65', city: 'Balneário Camboriú', state: 'SC', region: 'Sul', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T66', city: 'Itajaí', state: 'SC', region: 'Sul', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T67', city: 'Criciúma', state: 'SC', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T68', city: 'Chapecó', state: 'SC', region: 'Sul', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },

  // NORDESTE
  { id: 'T69', city: 'Salvador (Caminho das Árvores)', state: 'BA', region: 'Nordeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T70', city: 'Feira de Santana', state: 'BA', region: 'Nordeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T71', city: 'Vitória da Conquista', state: 'BA', region: 'Nordeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T72', city: 'Recife (Boa Viagem)', state: 'PE', region: 'Nordeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T73', city: 'Caruaru', state: 'PE', region: 'Nordeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T74', city: 'Petrolina', state: 'PE', region: 'Nordeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T75', city: 'João Pessoa (Altiplano)', state: 'PB', region: 'Nordeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T76', city: 'Fortaleza (Aldeota/Meireles)', state: 'CE', region: 'Nordeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T77', city: 'Juazeiro do Norte', state: 'CE', region: 'Nordeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T78', city: 'Natal (Tirol)', state: 'RN', region: 'Nordeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T79', city: 'Mossoró', state: 'RN', region: 'Nordeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T80', city: 'Maceió (Ponta Verde)', state: 'AL', region: 'Nordeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T81', city: 'Aracaju (Jardins)', state: 'SE', region: 'Nordeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T82', city: 'Teresina', state: 'PI', region: 'Nordeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T83', city: 'São Luís (Ponta d\'Areia)', state: 'MA', region: 'Nordeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T84', city: 'Imperatriz', state: 'MA', region: 'Nordeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },

  // NORTE
  { id: 'T85', city: 'Belém (Reduto)', state: 'PA', region: 'Norte', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T86', city: 'Ananindeua', state: 'PA', region: 'Norte', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T87', city: 'Manaus (Adrianópolis)', state: 'AM', region: 'Norte', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T88', city: 'Porto Velho', state: 'RO', region: 'Norte', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T89', city: 'Rio Branco', state: 'AC', region: 'Norte', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T90', city: 'Boa Vista', state: 'RR', region: 'Norte', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T91', city: 'Macapá', state: 'AP', region: 'Norte', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },

  // CENTRO-OESTE
  { id: 'T92', city: 'Brasília (Lago Sul)', state: 'DF', region: 'Centro-Oeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T93', city: 'Goiânia (Setor Marista)', state: 'GO', region: 'Centro-Oeste', tier: 'A+++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T94', city: 'Anápolis', state: 'GO', region: 'Centro-Oeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T95', city: 'Rio Verde', state: 'GO', region: 'Centro-Oeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T96', city: 'Cuiabá (Jardim Américas)', state: 'MT', region: 'Centro-Oeste', tier: 'A++', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T97', city: 'Rondonópolis', state: 'MT', region: 'Centro-Oeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T98', city: 'Sinop', state: 'MT', region: 'Centro-Oeste', tier: 'A', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T99', city: 'Campo Grande', state: 'MS', region: 'Centro-Oeste', tier: 'A+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' },
  { id: 'T100', city: 'Dourados', state: 'MS', region: 'Centro-Oeste', tier: 'B+', status: 'available', owner: 'Não Atribuído', botStatus: 'none', domainStatus: 'none' }
];

export const AdminTerritories: React.FC = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  
  // Edit form state
  const [editOwner, setEditOwner] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'available' | 'reserved'>('available');
  const [editBot, setEditBot] = useState<'homologated' | 'pending' | 'none'>('none');
  const [editDomain, setEditDomain] = useState<'secured' | 'pending' | 'none'>('none');
  const [editFee, setEditFee] = useState<number>(15000);

  useEffect(() => {
    const loadTerritories = () => {
      const saved = localStorage.getItem('winf_100_territories');
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
  }, []);

  const saveTerritories = (updated: Territory[]) => {
    setTerritories(updated);
    localStorage.setItem('winf_100_territories', JSON.stringify(updated));
    window.dispatchEvent(new Event('winf_territories_updated'));
  };

  const handleSelectTerritory = (t: Territory) => {
    setSelectedTerritory(t);
    setEditOwner(t.owner);
    setEditStatus(t.status);
    setEditBot(t.botStatus);
    setEditDomain(t.domainStatus);
    setEditFee(t.customFee || 15000);
  };

  const handleUpdate = () => {
    if (!selectedTerritory) return;
    const updated = territories.map(t => {
      if (t.id === selectedTerritory.id) {
        return {
          ...t,
          owner: editOwner,
          status: editStatus,
          botStatus: editBot,
          domainStatus: editDomain,
          customFee: editFee
        };
      }
      return t;
    });
    saveTerritories(updated);
    setSelectedTerritory(null);
  };

  const handleQuickActivate = (id: string) => {
    const updated = territories.map(t => {
      if (t.id === id) {
        const isCurrentlyActive = t.status === 'active';
        return {
          ...t,
          status: (isCurrentlyActive ? 'available' : 'active') as 'active' | 'available',
          owner: isCurrentlyActive ? 'Não Atribuído' : 'Ativado pelo Admin',
          botStatus: isCurrentlyActive ? 'none' : 'homologated' as any,
          domainStatus: isCurrentlyActive ? 'none' : 'secured' as any
        };
      }
      return t;
    });
    saveTerritories(updated);
    if (selectedTerritory && selectedTerritory.id === id) {
      setSelectedTerritory(null);
    }
  };

  const filtered = territories.filter(t => {
    const matchesSearch = t.city.toLowerCase().includes(search.toLowerCase()) || 
                          t.state.toLowerCase().includes(search.toLowerCase()) ||
                          t.owner.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'all' || t.region === regionFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const stats = {
    total: territories.length,
    active: territories.filter(t => t.status === 'active').length,
    reserved: territories.filter(t => t.status === 'reserved').length,
    available: territories.filter(t => t.status === 'available').length,
    bots: territories.filter(t => t.botStatus === 'homologated').length,
    domains: territories.filter(t => t.domainStatus === 'secured').length
  };

  return (
    <div className="bg-[#131314] border border-[#444746] p-6 mb-8 text-zinc-100 font-sans tracking-tight">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#444746] pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="text-zinc-400" size={18} /> OS 100 TERRITÓRIOS ESTRATÉGICOS DA HOLDING
          </h3>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
            Plano Nacional de Expansão | Ativação Instantânea FaaS de Unidades de Arbitragem Energética
          </p>
        </div>
        
        {/* QUICK STATUS RATIO */}
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0 text-[10px] font-mono">
          <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-green-400">
            {stats.active} ATIVAS
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 text-yellow-400">
            {stats.reserved} RESERVADAS
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-blue-400">
            {stats.available} DISPONÍVEIS
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-purple-400">
            {stats.bots} W-NO INSTANCIADO
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input 
            type="text" 
            placeholder="Buscar por cidade, estado ou operador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-[#444746] pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#444746]0 focus:bg-zinc-900 transition-colors"
          />
        </div>

        <div>
          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-[#444746] px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#444746]0 transition-colors"
          >
            <option value="all">Filtro: Todas Regiões</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Sul">Sul</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
            <option value="Norte">Norte</option>
          </select>
        </div>

        <div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-[#444746] px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#444746]0 transition-colors"
          >
            <option value="all">Filtro: Todos Status</option>
            <option value="active">Ativo (Em Operação)</option>
            <option value="available">Disponível para Captação</option>
            <option value="reserved">Reservado (Em Setup)</option>
          </select>
        </div>
      </div>

      {/* SPLIT LIST AND EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LISTING TBL: 2/3 WIDTH */}
        <div className="lg:col-span-2 border border-[#444746] bg-zinc-950/50 max-h-[550px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-zinc-900 z-10 border-b border-[#444746]">
              <tr className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Cidade / UF</th>
                <th className="p-3">Região</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Instância Bot</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                    Nenhum território corresponde aos filtros estabelecidos.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr 
                    key={t.id} 
                    className={`border-b border-[#444746] hover:bg-white/5 transition-colors cursor-pointer ${selectedTerritory?.id === t.id ? 'bg-white/5 border-l-2 border-l-white/60' : ''}`}
                    onClick={() => handleSelectTerritory(t)}
                  >
                    <td className="p-3 font-mono text-zinc-400 font-bold">{t.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <MapPin size={12} className={t.status === 'active' ? 'text-zinc-300' : 'text-zinc-600'} />
                        {t.city} - {t.state}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-mono truncate max-w-[150px]">
                        Op: {t.owner}
                      </div>
                    </td>
                    <td className="p-3 text-zinc-400 font-mono text-[10px]">{t.region}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 font-bold font-mono text-[9px] ${
                        t.tier.startsWith('A++') ? 'bg-amber-500/10 text-amber-400' :
                        t.tier.startsWith('A') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {t.tier}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        {t.botStatus === 'homologated' ? (
                          <span className="text-zinc-300 flex items-center gap-1">
                            <Cpu size={10} /> W-NO LIVE
                          </span>
                        ) : t.botStatus === 'pending' ? (
                          <span className="text-yellow-500 flex items-center gap-1 animate-pulse">
                            <Cpu size={10} /> Setup...
                          </span>
                        ) : (
                          <span className="text-zinc-600 flex items-center gap-1">
                            <Cpu size={10} /> Inativo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-none text-[9px] font-mono font-bold uppercase ${
                        t.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                        t.status === 'reserved' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {t.status === 'active' ? 'Ativo' : t.status === 'reserved' ? 'Setup' : 'Livre'}
                      </span>
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleQuickActivate(t.id)}
                        className={`px-2 py-1 text-[9px] font-bold uppercase border tracking-widest transition-all ${
                          t.status === 'active' 
                            ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' 
                            : 'border-zinc-500 text-zinc-300 hover:bg-white/5'
                        }`}
                      >
                        {t.status === 'active' ? 'Desativar' : 'Ativar FaaS'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* SIDE EDITOR PANELS: 1/3 WIDTH */}
        <div className="bg-zinc-900 border border-[#444746] p-5 flex flex-col justify-between">
          {selectedTerritory ? (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-[#444746] pb-3">
                <span className="text-[9px] font-mono bg-zinc-800 px-2 py-1 text-zinc-400 font-bold uppercase">{selectedTerritory.id}</span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-2">
                  Gerenciar: {selectedTerritory.city} - {selectedTerritory.state}
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Região: {selectedTerritory.region} | Tier: {selectedTerritory.tier}</p>
              </div>

              {/* OPERATOR FIELD */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  Parceiro Operador / Investidor
                </label>
                <input 
                  type="text" 
                  value={editOwner}
                  onChange={(e) => setEditOwner(e.target.value)}
                  className="w-full bg-zinc-950 border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#444746]0"
                  placeholder="Nome do master do território..."
                />
              </div>

              {/* OUTORGA FLEXIBILIZADA - CONFORME COF DOC 33 */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 flex justify-between">
                  <span>Taxa de Ingresso FaaS (BRL)</span>
                  <span className="text-zinc-600 font-normal">Padrão COF: R$ 15.000,00</span>
                </label>
                <input 
                  type="number" 
                  value={editFee}
                  onChange={(e) => setEditFee(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-[#444746] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#444746]0 font-mono"
                  placeholder="15000"
                />
              </div>

              {/* SWITCH STATUS */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  type="button"
                  onClick={() => setEditStatus('active')}
                  className={`py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all ${editStatus === 'active' ? 'bg-green-500/10 border-green-500 text-green-400' : 'border-[#444746] text-zinc-500 hover:text-white'}`}
                >
                  Ativo
                </button>
                <button 
                  type="button"
                  onClick={() => setEditStatus('reserved')}
                  className={`py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all ${editStatus === 'reserved' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'border-[#444746] text-zinc-500 hover:text-white'}`}
                >
                  Setup
                </button>
                <button 
                  type="button"
                  onClick={() => setEditStatus('available')}
                  className={`py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all ${editStatus === 'available' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-[#444746] text-zinc-500 hover:text-white'}`}
                >
                  Livre
                </button>
              </div>

              {/* INFRAESTRUTURA DIGITAL - DOC 12 */}
              <div className="bg-zinc-950 p-3 border border-[#444746] space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block border-b border-[#444746] pb-1">Ativação de Hardware e DNS</span>
                
                {/* DOMAIN SETUP MX/SPF/DKIM */}
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Mail size={12} className="text-zinc-500" /> DNS Google Workspace
                  </span>
                  <select 
                    value={editDomain}
                    onChange={(e: any) => setEditDomain(e.target.value)}
                    className="bg-zinc-900 border border-[#444746] text-[10px] text-zinc-300 font-mono focus:outline-none"
                  >
                    <option value="none">Não Ativado</option>
                    <option value="pending">Processando tags</option>
                    <option value="secured">Homologado (SPF/DKIM)</option>
                  </select>
                </div>

                {/* BOT COGNITIVE W-NO INSTANCE */}
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Cpu size={12} className="text-zinc-500" /> Córtex W-NO IA
                  </span>
                  <select 
                    value={editBot}
                    onChange={(e: any) => setEditBot(e.target.value)}
                    className="bg-zinc-900 border border-[#444746] text-[10px] text-zinc-300 font-mono focus:outline-none"
                  >
                    <option value="none">Sem Robô</option>
                    <option value="pending">Evolution API Setup</option>
                    <option value="homologated">Integrado (WINF OS)</option>
                  </select>
                </div>
              </div>

              {/* SAVE OR CANCEL */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleUpdate}
                  className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest text-[9px] py-2.5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check size={12} /> Salvar Alterações
                </button>
                <button 
                  onClick={() => setSelectedTerritory(null)}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-[9px] uppercase transition-colors"
                >
                  X
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-[#444746]">
              <Layers size={32} className="text-zinc-700 mb-3" />
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Holo-Painel Config</h4>
              <p className="text-[10px] text-zinc-500 leading-normal max-w-[200px] mt-2">
                Clique em qualquer uma das dezenas de bacias geográficas do menu lateral para configurar licenças, tokens API, operabilidades e DNS de e-mails corporativos.
              </p>
            </div>
          )}

          {/* REALTIME SIMULATION STATUS */}
          <div className="mt-6 border-t border-[#444746] pt-4 bg-zinc-950/30 p-3 rounded-none text-[10px] font-mono text-zinc-500 space-y-1">
            <div className="flex justify-between text-green-400">
              <span>● MULTIPLICADORES VALUATION</span>
              <span>ATIVO</span>
            </div>
            <p className="text-[9px] text-zinc-600 leading-normal">
              Atingindo o teto de 100 polos Asset Light por território garante aos investidores dividendos recorrentes baseados em arbitragem tributária logística.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
