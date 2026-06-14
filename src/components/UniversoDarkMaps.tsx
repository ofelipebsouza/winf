import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Circle, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getWeatherData, MASTER_TERRITORIES } from './ModuleGeoStrategy';
import { 
  MapPin, Globe, CheckCircle2, X, CloudRain, Sun, Cloud, AlertTriangle, 
  Compass, Thermometer, Droplets, Wind, ShieldAlert, Sparkles, RefreshCw 
} from 'lucide-react';

const LocalZoomUpdater = ({ cityKey }: { cityKey: string | null }) => {
  const map = useMap();
  useEffect(() => {
    if (cityKey) {
      const terr = MASTER_TERRITORIES[cityKey];
      if (terr) {
        map.flyTo(terr.mapCenter, 12, { duration: 1.5 });
      }
    } else {
      map.flyTo([-15, -53], 4, { duration: 1.5 });
    }
  }, [cityKey, map]);
  return null;
};

const MapViewUpdater = ({ activeTab, globalHubs }: { activeTab: string, globalHubs: any[] }) => {
  const map = useMap();
  useEffect(() => {
    if (activeTab === 'brasil') {
      map.flyTo([-15, -53], 4, { duration: 1.5 });
    } else if (activeTab === 'world') {
      map.flyTo([20, 0], 2, { duration: 1.5 });
    } else {
      const hub = globalHubs.find(h => h.id === activeTab);
      if (hub) {
        map.flyTo([hub.coordinates[1], hub.coordinates[0]], 5, { duration: 1.5 });
      }
    }
  }, [activeTab, map, globalHubs]);
  return null;
};


const worldGeoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const brazilGeoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

// The Brazil map center coordinates
const BRAZIL_CENTER: [number, number] = [-53, -15];

const CAPITALS = [
  [-46.6333, -23.5505], // SP
  [-43.1729, -22.9068], // RJ
  [-49.2731, -25.4284], // Curitiba
  [-51.2177, -30.0346], // Porto Alegre
  [-38.5267, -3.7319],  // Fortaleza
  [-38.5016, -12.9714], // Salvador
  [-43.9378, -19.9208], // Belo Horizonte
  [-47.8822, -15.7942], // Brasilia
  [-48.5492, -27.5969], // Floripa
  [-34.8811, -8.0578],  // Recife
  [-60.0217, -3.1190],  // Manaus
  [-48.3277, -1.4550],  // Belém
  [-49.2646, -16.6869], // Goiania
  [-44.3036, -2.5297],  // São Luís
  [-35.7351, -9.6662],  // Maceió
  [-35.2094, -5.7945],  // Natal
  [-42.8016, -5.0892],  // Teresina
  [-34.8631, -7.1153],  // Joao Pessoa
  [-37.0719, -10.9472], // Aracaju
  [-56.0969, -15.6014], // Cuiabá
  [-54.6201, -20.4428], // Campo Grande
  [-63.9039, -8.7612],  // Porto Velho
  [-51.0620, 0.0356]    // Macapá
];

const RAND_ASSETS = Array.from({ length: 42 }).map((_, i) => {
  const cap = CAPITALS[i % CAPITALS.length];
  const dx = (Math.sin(i) * 0.3) - (i % 2 === 0 ? 0.2 : 0);
  const dy = (Math.cos(i) * 0.3);
  return {
    coordinates: [cap[0] + dx, cap[1] + dy] as [number, number],
    name: `Asset Light Unit #${i + 13}`,
    status: 'available',
    owner: 'Território Disponível'
  };
});

const ASSET_LIGHT_LOCATIONS = [
  // Tiago (CEO / Founder) - Baixada Santista e afins
  { coordinates: [-46.3333, -23.9608] as [number, number], name: "Asset Light Santos/SP", status: "active", owner: "Tiago (CEO / Founder)" },
  { coordinates: [-46.4167, -24.0058] as [number, number], name: "Asset Light Praia Grande/SP", status: "active", owner: "Tiago (CEO / Founder)" },
  { coordinates: [-46.2564, -23.9931] as [number, number], name: "Asset Light Guarujá/SP", status: "active", owner: "Tiago (CEO / Founder)" },
  { coordinates: [-46.4233, -23.8950] as [number, number], name: "Asset Light Cubatão/SP", status: "active", owner: "Tiago (CEO / Founder)" },
  { coordinates: [-46.1386, -23.8492] as [number, number], name: "Asset Light Bertioga/SP", status: "active", owner: "Tiago (CEO / Founder)" },
  
  // Disponíveis - Baixada Santista
  { coordinates: [-46.3917, -23.9536] as [number, number], name: "Asset Light São Vicente/SP", status: "available", owner: "Território Disponível" },
  { coordinates: [-46.6206, -24.0931] as [number, number], name: "Asset Light Mongaguá/SP", status: "available", owner: "Território Disponível" },

  // Tiago (Tech / Founder)
  { coordinates: [-35.8811, -7.2307] as [number, number], name: "Asset Light Campina Grande/PB", status: "active", owner: "Tiago (Tech / Founder)" },

  ...RAND_ASSETS
];

const GLOBAL_HUBS: any[] = [
  { id: 'US', country: 'USA', coordinates: [-74.0060, 40.7128], flag: '🇺🇸', name: 'Miami / East Coast Hub' },
  { id: 'PT', country: 'Portugal', coordinates: [-9.1393, 38.7223], flag: '🇵🇹', name: 'Lisboa / Iberia Hub' },
  { id: 'AE', country: 'EAU', coordinates: [55.2708, 25.2048], flag: '🇦🇪', name: 'Dubai / MENA Hub' },
  { id: 'JP', country: 'Japão', coordinates: [139.6917, 35.6895], flag: '🇯🇵', name: 'Tokyo / Asia Hub' },
  { id: 'UK', country: 'UK', coordinates: [-0.1276, 51.5074], flag: '🇬🇧', name: 'London / Europe Hub' },
];

const W12_BRASIL_CELLS = [
  { coordinates: [-46.3333, -23.9608] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 01 / Santos (SP)", id: "01", active: true, investor: "Tiago (CEO / Founder)", location: "Santos/SP" },
  { coordinates: [-35.8811, -7.2307] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 02 / Campina Grande (PB)", id: "02", active: true, investor: "Tiago (Tech / Founder)", location: "Campina Grande/PB" },
  { coordinates: [-46.6333, -23.5505] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 03 / São Paulo (SP)", id: "03", active: true, investor: "Diretoria de Governança São Paulo", location: "São Paulo/SP" },
  { coordinates: [-47.4526, -23.5015] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 04 / Sorocaba (SP)", id: "04", active: true, investor: "Cadeira W12 (Board) / Diretoria Interior", location: "Sorocaba/SP" },
  { coordinates: [-49.2731, -25.4284] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 05 (Livre)", id: "05", active: false, investor: "Não Atribuído", location: "Curitiba/PR" },
  { coordinates: [-43.1729, -22.9068] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 06 (Livre)", id: "06", active: false, investor: "Não Atribuído", location: "Rio de Janeiro/RJ" },
  { coordinates: [-43.9378, -19.9208] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 07 (Livre)", id: "07", active: false, investor: "Não Atribuído", location: "Belo Horizonte/MG" },
  { coordinates: [-56.0969, -15.6014] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 08 (Livre)", id: "08", active: false, investor: "Não Atribuído", location: "Cuiabá/MT" },
  { coordinates: [-47.8822, -15.7942] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 09 (Livre)", id: "09", active: false, investor: "Não Atribuído", location: "Brasília/DF" },
  { coordinates: [-34.8811, -8.0578] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 10 (Livre)", id: "10", active: false, investor: "Não Atribuído", location: "Recife/PE" },
  { coordinates: [-38.5016, -12.9714] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 11 (Livre)", id: "11", active: false, investor: "Não Atribuído", location: "Salvador/BA" },
  { coordinates: [-38.5267, -3.7319] as [number, number], country: "Brasil", capital: "Brasília", name: "Cadeira 12 (Livre)", id: "12", active: false, investor: "Não Atribuído", location: "Fortaleza/CE" },
];

const W12_WORLD_CELLS = GLOBAL_HUBS;

interface UniversoDarkMapsProps {
  lang?: 'pt' | 'en' | 'es';
}

export const UniversoDarkMaps: React.FC<UniversoDarkMapsProps> = ({ lang = 'pt' }) => {
  const [activeTab, setActiveTab] = useState<string>('brasil');
  const [localCityZoom, setLocalCityZoom] = useState<string | null>(null);
  
  const [tooltipInfo, setTooltipInfo] = useState<{ x: number, y: number, content: any, type: 'cell' | 'asset' } | null>(null);
  const [showValuationModal, setShowValuationModal] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  const countryPoints = React.useMemo(() => {
    const data: Record<string, { chairs: any[], assets: any[] }> = {};
    
    // Configurações Estratégicas Baseadas em População e HUBs Financeiros
    const STRATEGIC_LOCATIONS: Record<string, any[]> = {
      'US': [
        { coords: [-74.0060, 40.7128], name: "New York (East Coast Hub)" },
        { coords: [-118.2437, 34.0522], name: "Los Angeles (West Coast Hub)" },
        { coords: [-87.6298, 41.8781], name: "Chicago (Midwest Hub)" },
        { coords: [-80.1918, 25.7617], name: "Miami (LatAm Gateway)" },
        { coords: [-95.3698, 29.7604], name: "Houston (South Hub)" },
        { coords: [-122.4194, 37.7749], name: "San Francisco (Tech Hub)" },
        { coords: [-79.3832, 43.6532], name: "Toronto (Canada Hub)" }
      ],
      'PT': [
        { coords: [-9.1393, 38.7223], name: "Lisboa (Iberia Gateway)" },
        { coords: [-3.7038, 40.4168], name: "Madrid (Spain Hub)" },
        { coords: [2.3522, 48.8566], name: "Paris (France Hub)" },
        { coords: [13.4050, 52.5200], name: "Berlin (DACH Hub)" },
        { coords: [12.4964, 41.9028], name: "Roma (Italy Hub)" }
      ],
      'AE': [
        { coords: [55.2708, 25.2048], name: "Dubai (Global Trade Hub)" },
        { coords: [54.3667, 24.4667], name: "Abu Dhabi (Capital Hub)" },
        { coords: [46.7167, 24.6333], name: "Riyadh (Saudi Hub)" },
        { coords: [51.5333, 25.2833], name: "Doha (Qatar Hub)" }
      ],
      'JP': [
        { coords: [139.6917, 35.6895], name: "Tokyo (Japan Hub)" },
        { coords: [126.9780, 37.5665], name: "Seoul (Korea Hub)" },
        { coords: [121.4737, 31.2304], name: "Shanghai (China Hub)" },
        { coords: [103.8198, 1.3521], name: "Singapore (SE Asia Hub)" },
        { coords: [114.1694, 22.3193], name: "Hong Kong (Fin Hub)" }
      ],
      'AU': [
        { coords: [151.2093, -33.8688], name: "Sydney (East Coast Hub)" },
        { coords: [144.9631, -37.8136], name: "Melbourne (Southern Hub)" },
        { coords: [153.0251, -27.4698], name: "Brisbane (North East Hub)" },
        { coords: [115.8605, -31.9505], name: "Perth (West Coast Hub)" }
      ],
      'UK': [
        { coords: [-0.1276, 51.5074], name: "London (Master Financial Hub)" },
        { coords: [-2.2426, 53.4808], name: "Manchester (Northern Hub)" },
        { coords: [-3.1883, 55.9533], name: "Edinburgh (Scotland Hub)" }
      ]
    };

    GLOBAL_HUBS.forEach(h => {
      const locations = STRATEGIC_LOCATIONS[h.id] || [];
      const assetCount = ['US'].includes(h.id) ? 100 : ['PT', 'AE'].includes(h.id) ? 50 : 30;
      
      let seed = h.country.length;
      const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      const spread = ['PT', 'AE', 'JP', 'UK'].includes(h.id) ? 4 : 10;

      data[h.id] = {
        chairs: locations.map((loc, i) => ({
          coordinates: loc.coords as [number, number],
          country: h.country,
          name: loc.name,
          id: String(i + 1).padStart(2, '0'),
          active: false,
          investor: "Asset List",
          location: "Elegível para Captação"
        })),
        assets: Array.from({ length: assetCount }).map((_, i) => ({
          coordinates: [h.coordinates[0] + (random() - 0.5) * (spread * 1.5), h.coordinates[1] + (random() - 0.5) * (spread * 1.5)] as [number, number],
          name: `Asset Light #${i + 1}`,
          status: 'available',
          owner: 'Território Disponível',
          country: h.country
        }))
      };
    });
    return data;
  }, []);



  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

  };


  const dict = {
    pt: {
      geoStrategy: "Geo-Estratégia W12",
      mapping: "Mapeamento em tempo real das Cadeiras Board (W12) e pontos Asset Light.",
      brHubs: "Brasil (5.000 Hubs)",
      globalBoard: "Global Board",
      activeCells: "Cadeiras Ativas (Fundadores)",
      availChairs: "Cadeiras Disponíveis",
      assetLights: "Asset Lights (Rede)",
      statusRep: "Status do Relatório",
      chairsOcc: "Cadeiras W12 Ocupadas",
      assetBr: "Asset Lights (Brasil)",
      mapText: "À medida que as cotas são adquiridas e novos polos Asset Light são montados, eles aparecem em tempo real no mapa da Winf-Chain. O atingimento da meta de 100 polos Asset Light por território garante Múltiplos de Valuation. Após 100 polos, a expansão exige no mínimo 1 Asset Light por cidade em cada estado.",
      pleitear: "Pleitear Cadeira Regional"
    },
    en: {
      geoStrategy: "W12 Geo-Strategy",
      mapping: "Real-time mapping of Board Cells (W12) and Asset Light hubs.",
      brHubs: "Brazil (5,000 Hubs)",
      globalBoard: "Global Board",
      activeCells: "Active Chairs (Founders)",
      availChairs: "Available Seats",
      assetLights: "Asset Lights (Network)",
      statusRep: "Report Status",
      chairsOcc: "Occupied W12 Seats",
      assetBr: "Asset Lights (Brazil)",
      mapText: "As quotas are acquired and new Asset Light hubs are deployed, they appear in real-time on the map. Every 100 new cells secure Valuation Multipliers. After 100 hubs, expansion requires at least 1 Asset Light per city in each state.",
      pleitear: "Claim Regional Seat"
    },
    es: {
      geoStrategy: "Geo-Estrategia W12",
      mapping: "Mapeo en tiempo real de Sillas de la Junta (W12) y puntos Asset Light.",
      brHubs: "Brasil (5.000 Hubs)",
      globalBoard: "Junta Global",
      activeCells: "Sillas Activas (Fundadores)",
      availChairs: "Asientos Disponibles",
      assetLights: "Asset Lights (Red)",
      statusRep: "Estado del Informe",
      chairsOcc: "Asientos W12 Ocupados",
      assetBr: "Asset Lights (Brasil)",
      mapText: "A medida que se adquieren cuotas y se despliegan nuevos hubs Asset Light, aparecen en tiempo real en el mapa. Cada 100 nuevos hubs aseguran Múltiplos de Valoración. Después de 100 hubs, la expansión requiere al menos 1 Asset Light por ciudad en cada país.",
      pleitear: "Reclamar Asiento Regional"
    }
  };

  const t = dict[lang];

  return (
    <div className="bg-[#131314] border border-[#444746] p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 opacity-5 blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1 text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="text-green-500" /> {t.geoStrategy}
          </h3>
          <p className="text-xs text-white/50">{t.mapping}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 border border-[#444746] p-2 bg-white/5 rounded-none w-full md:max-w-2xl">
          <button 
            onClick={() => handleTabChange('brasil')}
            className={`px-4 py-2 text-xs md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'brasil' ? 'bg-green-500 text-black' : 'text-white/40 hover:text-white'}`}
          >
            BRASIL
          </button>
          <button 
            onClick={() => handleTabChange('world')}
            className={`px-4 py-2 text-xs md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'world' ? 'bg-green-500 text-black' : 'text-white/40 hover:text-white'}`}
          >
            WORLD (PHASE 2)
          </button>
          {GLOBAL_HUBS.map(hub => (
            <button 
              key={hub.id}
              onClick={() => handleTabChange(hub.id)}
              className={`px-4 py-2 text-xs md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === hub.id ? 'bg-blue-500 text-white' : 'text-white/20 hover:text-white/40'}`}
            >
              {hub.flag} {hub.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 h-[400px] md:h-[500px] border border-[#444746] bg-[#131314] relative cursor-crosshair">
          {localCityZoom && (
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setLocalCityZoom(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-green-500 hover:text-zinc-950 border border-green-500/30 text-green-500 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all rounded-none shadow-xl shadow-black/80 font-mono"
              >
                ← Voltar para Visão Brasil
              </button>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs md:text-[10px] uppercase font-mono bg-[#131314]/60 px-3 py-1.5 border border-[#444746]">
               <span className="w-2 h-2 rounded-none bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> {t.activeCells}
            </div>
            <div className="flex items-center gap-2 text-xs md:text-[10px] uppercase font-mono bg-[#131314]/60 px-3 py-1.5 border border-[#444746]">
               <span className="w-2 h-2 rounded-none border border-zinc-600"></span> {t.availChairs}
            </div>
            <div className="flex items-center gap-2 text-xs md:text-[10px] uppercase font-mono bg-[#131314]/60 px-3 py-1.5 border border-[#444746]">
               <span className="w-1.5 h-1.5 rounded-none bg-white/40"></span> {t.assetLights}
            </div>
          </div>

          
          <MapContainer
            center={activeTab === 'brasil' ? [-15, -53] : activeTab === 'world' ? [20, 0] : [GLOBAL_HUBS.find(h => h.id === activeTab)?.coordinates[1] || 0, GLOBAL_HUBS.find(h => h.id === activeTab)?.coordinates[0] || 0]}
            zoom={activeTab === 'brasil' ? 4 : activeTab === 'world' ? 2 : 4}
            style={{ width: "100%", height: "100%", background: '#050505', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapViewUpdater activeTab={activeTab} globalHubs={GLOBAL_HUBS} />
            <LocalZoomUpdater cityKey={localCityZoom} />
            <MapViewUpdater activeTab={activeTab} globalHubs={GLOBAL_HUBS} />

            {/* Render Logistic Connections pt1 */}
            {activeTab === 'brasil' && ASSET_LIGHT_LOCATIONS.map((loc, i) => {
              if (loc.owner === "Tiago (CEO / Founder)" && loc.name !== "Asset Light Santos/SP") {
                return <Polyline key={`route-ceo-${i}`} positions={[[-23.9608, -46.3333], [loc.coordinates[1], loc.coordinates[0]]]} pathOptions={{ color: "rgba(34,197,94,0.4)", weight: 1, dashArray: "5,5" }} />;
              }
              if (loc.owner === "Tiago (Tech / Founder)" && loc.name !== "Asset Light Campina Grande/PB") {
                return <Polyline key={`route-tech-${i}`} positions={[[-7.2307, -35.8811], [loc.coordinates[1], loc.coordinates[0]]]} pathOptions={{ color: "rgba(34,197,94,0.4)", weight: 1, dashArray: "5,5" }} />;
              }
              if (loc.status === "available") { 
                return <Polyline key={`route-avail-${i}`} positions={[[-23.9608, -46.3333], [loc.coordinates[1], loc.coordinates[0]]]} pathOptions={{ color: "rgba(234,179,8,0.2)", weight: 0.5, dashArray: "3,6" }} />;
              }
              return null;
            })}
            
            {activeTab === 'world' && GLOBAL_HUBS.map((loc, i) => {
               return <Polyline key={`route-world-${i}`} positions={[[-23.9608, -46.3333], [loc.coordinates[1], loc.coordinates[0]]]} pathOptions={{ color: "rgba(234,179,8,0.2)", weight: 1, dashArray: "5,10" }} />;
            })}

            {/* Render Asset Lights */}
            {activeTab === 'brasil' && ASSET_LIGHT_LOCATIONS.map((loc, i) => (
              <CircleMarker 
                key={`asset-${i}`} 
                center={[loc.coordinates[1], loc.coordinates[0]]}
                radius={loc.status === 'active' ? 5 : 4}
                pathOptions={{ 
                  color: loc.status === 'active' ? "rgba(34,197,94,0.8)" : "rgba(234,179,8,0.6)", 
                  fillColor: loc.status === 'active' ? "rgba(34,197,94,0.8)" : "rgba(234,179,8,0.6)", 
                  fillOpacity: 1 
                }}
                eventHandlers={{
                  mouseover: (e: any) => setTooltipInfo({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, content: loc, type: 'asset' }),
                  mouseout: () => setTooltipInfo(null),
                  click: (e) => {
                    setTooltipInfo(null);
                    setSelectedRegion({
                      ...loc,
                      type: 'asset',
                      contact: loc.status === 'active' ? 'comercial@winf.com.br' : 'franquias@winf.com.br',
                      phone: loc.status === 'active' ? '+55 (11) 99999-9999' : '0800 123 4567'
                    });
                  }
                }}
              />
            ))}

            {/* Render Asset Lights for Country Tabs */}
            {activeTab !== 'brasil' && activeTab !== 'world' && countryPoints[activeTab]?.assets.map((loc: any, i: number) => (
              <CircleMarker 
                key={`asset-country-${i}`} 
                center={[loc.coordinates[1], loc.coordinates[0]]}
                radius={4}
                pathOptions={{ color: "rgba(234,179,8,0.6)", fillColor: "rgba(234,179,8,0.6)", fillOpacity: 1 }}
                eventHandlers={{
                  mouseover: (e: any) => setTooltipInfo({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, content: loc, type: 'asset' }),
                  mouseout: () => setTooltipInfo(null),
                  click: (e) => {
                    setTooltipInfo(null);
                    setSelectedRegion({
                      ...loc,
                      type: 'asset',
                      contact: 'franchise@winf.com',
                      phone: 'Global Support Line'
                    });
                  }
                }}
              />
            ))}

            {/* Render W12 Cadeiras */}
            {(activeTab === 'brasil' 
              ? W12_BRASIL_CELLS 
              : activeTab === 'world' 
                ? [W12_BRASIL_CELLS[0], ...W12_WORLD_CELLS] 
                : countryPoints[activeTab]?.chairs || [])
              .map((cell: any, i: number) => {
                const isCommandUnit = cell.location && (
                  cell.location.includes('Santos') || 
                  cell.location.includes('São Paulo') || 
                  cell.location.includes('Sorocaba')
                );
                const isActive = cell.active || isCommandUnit;
                const innerFill = isCommandUnit ? "#ffffff" : (isActive ? "#22c55e" : "#ffffff");
                const strokeColor = isCommandUnit ? "#ffffff" : (isActive ? "#22c55e" : "#000000");
                const cityName = cell.location?.split('/')[0] || 'Santos';
                const weather = getWeatherData(cityName);
                const isRaining = weather?.condition === 'Rainy';

                return (
                  <React.Fragment key={`cell-wrap-${i}`}>
                    {/* Pulsing weather warning halo for rainy hotspots */}
                    {isActive && isRaining && !isCommandUnit && (
                      <CircleMarker 
                        center={[cell.coordinates[1], cell.coordinates[0]]}
                        radius={18}
                        pathOptions={{ 
                          color: '#3b82f6', 
                          fillColor: '#3b82f6', 
                          fillOpacity: 0.15, 
                          weight: 1.5, 
                          className: "animate-pulse" 
                        }}
                      />
                    )}

                    {/* Pulsing command/governance chair halo (White/High Priority) */}
                    {isCommandUnit && (
                      <CircleMarker 
                        center={[cell.coordinates[1], cell.coordinates[0]]}
                        radius={16}
                        pathOptions={{ 
                          color: '#ffffff', 
                          fillColor: '#ffffff', 
                          fillOpacity: 0.25, 
                          weight: 1.5, 
                          className: "animate-pulse" 
                        }}
                      />
                    )}

                    <CircleMarker 
                      center={[cell.coordinates[1], cell.coordinates[0]]}
                      radius={8}
                      pathOptions={{ color: strokeColor, fillColor: innerFill, fillOpacity: 1, weight: 2 }}
                      eventHandlers={{
                        mouseover: (e: any) => setTooltipInfo({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, content: { ...cell, weather }, type: 'cell' }),
                        mouseout: () => setTooltipInfo(null),
                        click: (e) => {
                          setTooltipInfo(null);
                          setSelectedRegion({
                            ...cell,
                            type: 'cell',
                            weather,
                            contact: cell.active ? 'master@winf.com.br' : 'investments@winf.com.br',
                            phone: cell.active ? 'Private Line' : 'Board Application'
                          });
                          if (activeTab === 'world') {
                            if (cell.id === '01') handleTabChange('brasil');
                            else handleTabChange(cell.id);
                          }
                        }
                      }}
                    >
                      {/* Permanent Weather Badging directly floating over live hubs */}
                      {isActive && (
                        <Tooltip permanent direction="top" offset={[0, -10]} className="custom-weather-tooltip border-none bg-transparent shadow-none">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950/90 border border-zinc-800 text-white font-mono text-[9px] rounded-none shadow-md uppercase select-none tracking-wider">
                            <span>{weather.condition === 'Rainy' ? '⛈️' : weather.condition === 'Cloudy' ? '☁️' : '☀️'}</span>
                            <span className={weather.condition === 'Rainy' ? 'text-blue-400 font-bold' : 'text-zinc-300'}>
                              {cityName}: {weather.temp}°C
                            </span>
                          </div>
                        </Tooltip>
                      )}
                    </CircleMarker>
                  </React.Fragment>
                );
              })}

            {/* Render local city neighborhoods if zoomed in */}
            {localCityZoom && MASTER_TERRITORIES[localCityZoom] && (
              MASTER_TERRITORIES[localCityZoom].bairros.map((b: any, bIdx: number) => (
                <Circle
                  key={`bairro-local-${bIdx}`}
                  center={b.center}
                  radius={b.radius}
                  pathOptions={{
                    color: b.color || '#10b981',
                    fillColor: b.color || '#10b981',
                    fillOpacity: 0.15,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div className="bg-zinc-950 p-3 border border-zinc-800 text-white font-mono text-xs rounded-none max-w-[240px]">
                      <div className="font-bold text-sm text-green-400 mb-1 border-b border-zinc-805 pb-1 uppercase flex justify-between items-center">
                        <span>{b.name}</span>
                        <span className="text-[9px] bg-zinc-800 px-1 py-0.5 rounded-none text-zinc-400 hover:text-white">Tier {b.tier}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-normal mb-1">
                        <strong>Status:</strong> {b.status} ({b.share}% share)
                      </p>
                      <p className="text-[11px] text-zinc-300 leading-normal mb-1">
                        <strong>Público:</strong> {b.demographic}
                      </p>
                      <p className="text-[11px] text-zinc-300 leading-normal">
                        <strong>Ticket Médio:</strong> {b.ticket}
                      </p>
                    </div>
                  </Popup>
                </Circle>
              ))
            )}
          </MapContainer>

          
          {/* Tooltip */}
          {tooltipInfo && (
            <div 
              className="fixed z-50 pointer-events-none bg-[#131314]/90 border border-[#444746] p-4 shadow-2xl backdrop-blur-md rounded-none"
              style={{ top: tooltipInfo.y > window.innerHeight - 150 ? tooltipInfo.y - 120 : tooltipInfo.y - 10, left: tooltipInfo.x > window.innerWidth - 250 ? tooltipInfo.x - 230 : tooltipInfo.x + 15, width: 250 }}
            >
              {tooltipInfo.type === 'cell' ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse"></span>
                    <h5 className="text-sm md:text-[11px] font-black tracking-widest uppercase text-white">
                      {tooltipInfo.content.name}
                    </h5>
                  </div>
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-[#444746]">
                    <p className="text-xs md:text-[10px] text-zinc-400 font-mono"><strong className="text-zinc-300">País:</strong> {tooltipInfo.content.country}</p>
                    {tooltipInfo.content.location ? (
                      <p className="text-xs md:text-[10px] text-zinc-400 font-mono"><strong className="text-zinc-300">HUB:</strong> {tooltipInfo.content.location}</p>
                    ) : (
                      <p className="text-xs md:text-[10px] text-zinc-400 font-mono"><strong className="text-zinc-300">Capital:</strong> {tooltipInfo.content.capital}</p>
                    )}
                    <p className="text-xs md:text-[10px] text-zinc-400 font-mono"><strong className="text-zinc-300">Investidor:</strong> {tooltipInfo.content.investor}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    {tooltipInfo.content.status === 'active' ? (
                      <span className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-none bg-yellow-500"></span>
                    )}
                    <h5 className="text-sm md:text-[11px] font-black tracking-widest uppercase text-white">
                      {tooltipInfo.content.name}
                    </h5>
                  </div>
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-[#444746]">
                    <p className="text-xs md:text-[10px] text-zinc-400 font-mono"><strong className="text-zinc-300">Licenciado:</strong> {tooltipInfo.content.owner}</p>
                    <div className="pt-2">
                      <span className={`text-[11px] md:text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-none border ${tooltipInfo.content.status === 'active' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'}`}>
                        {tooltipInfo.content.status === 'active' ? 'Status: Ativo' : 'Status: Disponível'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-[#444746] p-6 flex flex-col h-full">
           <h4 className="text-xs md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-[#444746] pb-4">
             <CheckCircle2 size={12} /> {t.statusRep}
           </h4>
           
           <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs md:text-[10px] text-white/40 uppercase font-mono mb-1">
                  {t.chairsOcc} {activeTab === 'world' ? '(Global)' : activeTab !== 'brasil' ? `(${GLOBAL_HUBS.find(h => h.id === activeTab)?.country})` : ''}
                </p>
                <p className="text-xl font-bold font-mono text-green-500">
                  {activeTab === 'brasil' ? '02 ' : activeTab === 'world' ? '02 ' : '00 '} 
                  <span className="text-xs text-zinc-600">/ {activeTab === 'brasil' ? '12' : activeTab === 'world' ? '216' : countryPoints[activeTab]?.chairs.length || '0'}</span>
                </p>
              </div>
              
              <div>
                <p className="text-xs md:text-[10px] text-white/40 uppercase font-mono mb-1">
                  {activeTab === 'brasil' ? t.assetBr : activeTab === 'world' ? t.assetLights : `Asset Lights (${GLOBAL_HUBS.find(h => h.id === activeTab)?.country})`}
                </p>
                <p className="text-xl font-bold font-mono text-white">
                  {activeTab === 'brasil' ? ASSET_LIGHT_LOCATIONS.length : activeTab === 'world' ? 'Global' : '00 '} 
                  <span className="text-xs text-zinc-600">/ Total de Unidades Ativas</span>
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#444746]">
                <p className="text-[11px] md:text-[9px] text-zinc-500 leading-relaxed italic">
                  {t.mapText}
                </p>
              </div>

              {/* Real-time Weather Telemetry Alert Station */}
              <div className="pt-5 mt-5 border-t border-[#444746] space-y-4">
                <h5 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-sans">
                  <ShieldAlert className="text-red-500 animate-pulse" size={13} />
                  <span>ALERTAS CLIMÁTICOS ATIVOS</span>
                </h5>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Cruzamento dinâmico de telemetria meteorológica de cada território ativado:
                </p>

                <div 
                  onClick={() => setLocalCityZoom('Santos')}
                  className="p-3 bg-blue-950/25 hover:bg-blue-950/45 border border-blue-500/20 hover:border-blue-500/50 rounded-none cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <CloudRain size={12} className="animate-bounce" /> Santos chovendo
                    </span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 border border-blue-500/10 font-mono animate-pulse">ALERTA</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Tempestade de 20°C e ventos de 26 km/h. O WINF Brain ativou o recomendador de película resiliente devido à alta umidade (94%).
                  </p>
                  <div className="bg-zinc-950/80 p-2 border border-blue-500/10 text-[9px] text-blue-300 font-mono rounded-none">
                    Recomendação: <strong>Winf Select™ Segurança</strong> para proteção contra estilhaçamento por ventanias.
                  </div>
                  <div className="text-[9px] text-zinc-500 group-hover:text-white underline transition-colors flex items-center gap-1 pt-1 font-mono">
                    <Compass size={10} /> Mapear Zoneamento Santos →
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/30 border border-zinc-800 rounded-none space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Sun size={12} /> Campina Grande
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">ESTÁVEL</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Clima limpo a 28°C. Radiação UV extrema recomenda as linhas de Nano Cerâmica de alta rejeição térmica.
                  </p>
                </div>
              </div>
           </div>

           <div className="space-y-2 mt-4">
             <button 
                onClick={() => setShowValuationModal(true)}
                className="w-full py-3 bg-zinc-900 border border-green-500/30 text-green-500 font-black text-xs md:text-[10px] uppercase tracking-[0.1em] hover:bg-green-500/10 transition-colors">
                SIMULAÇÃO DE VALUATION
             </button>
             <button className="w-full py-3 bg-white text-black font-black text-xs md:text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors">
                {t.pleitear}
             </button>
           </div>
        </div>
      </div>
      {/* Valuation Simulation Modal */}
      {showValuationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131314]/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-[#444746] w-full max-w-4xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">Valuation <span className="text-green-500">Nacional & Meta</span></h2>
                <p className="text-zinc-500 mt-2 font-mono text-sm max-w-xl">Projeção da meta 100% (12 Cadeiras + 100 Asset Lights ativos) e a expansão da WINF-Chain em 12 polos regionais brasileiros.</p>
              </div>
              <button onClick={() => setShowValuationModal(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white/5 border border-[#444746]">
                <div className="text-white/40 font-mono text-xs mb-2">Meta Brasil (Captação)</div>
                <div className="text-4xl font-black text-white">100%</div>
                <div className="text-green-500 text-xs font-mono mt-2">12 Cadeiras + 100 Asset Lights</div>
              </div>
              <div className="p-6 bg-white/5 border border-[#444746]">
                <div className="text-white/40 font-mono text-xs mb-2">Receita de Licenciamento</div>
                <div className="text-4xl font-black text-white">R$ 10.8<span className="text-2xl">M</span></div>
                <div className="text-green-500 text-xs font-mono mt-2">Ticket Médio Arrecadado</div>
              </div>
              <div className="p-6 bg-white/5 border border-[#444746]">
                <div className="text-white/40 font-mono text-xs mb-2">MRR Projetado (Rede)</div>
                <div className="text-4xl font-black text-green-500">R$ 2.5<span className="text-2xl">M</span></div>
                <div className="text-green-500/50 text-xs font-mono mt-2">Assinaturas OS & Transações/mês</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">A Lógica Exponencial (Equity)</h3>
                <ul className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-green-500">01.</span>
                    <p><strong>Atingimento da Meta:</strong> Ao fechar os 100 Asset Lights e 12 Cadeiras, geramos fluxo de caixa massivo e uma rede logística capilarizada invencível.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-500">02.</span>
                    <p><strong>Escala Nacional:</strong> O modelo expande cobrindo todo o território nacional. Ao ter todas as maiores potências estaduais, o valor da W12 dispara através da <strong>Malha Logística e de Inteligência</strong>.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-500">03.</span>
                    <p>A WINF-Chain atua absorvendo as transações estaduais, jogando nosso Valuation para múltiplos de M&A (Fusões e Aquisições) de empresas de tecnologia e franquia.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-[#131314] border border-green-500/30 p-6 flex flex-col justify-center">
                <div className="text-center">
                  <div className="text-green-500 font-mono text-sm mb-4 tracking-widest uppercase">Target Valuation (W12 Brasil)</div>
                  <div className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">R$ 1.2<span className="text-green-500">B</span></div>
                  <p className="text-zinc-500 text-sm">Com o Brasil consolidado (Meta 100%) e o modelo validado, o Equity atinge a escala de Unicórnio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Region Modal */}
      {selectedRegion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131314]/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-[#444746] w-full max-w-lg p-6 relative">
            <button onClick={() => setSelectedRegion(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold ${selectedRegion.status === 'active' || selectedRegion.active ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>
                   {(selectedRegion.status === 'active' || selectedRegion.active) ? 'Ativo' : 'Disponível'}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">ID: {selectedRegion.id || selectedRegion.type}</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedRegion.name}</h3>
            </div>
            
            <div className="space-y-4 text-sm font-mono text-zinc-400 mb-8 border-t border-[#444746] pt-6">
               <div className="flex justify-between items-center pb-2 border-b border-[#444746]">
                  <span>Franqueado/Owner:</span>
                  <span className="text-white">{selectedRegion.owner || selectedRegion.investor}</span>
               </div>
               {(selectedRegion.country || selectedRegion.capital) && (
                 <div className="flex justify-between items-center pb-2 border-b border-[#444746]">
                    <span>Localização:</span>
                    <span className="text-white">{selectedRegion.country || selectedRegion.location || selectedRegion.capital}</span>
                 </div>
               )}
               <div className="flex justify-between items-center pb-2 border-b border-[#444746]">
                  <span>E-mail de Contato:</span>
                  <span className="text-white">{selectedRegion.contact}</span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-[#444746]">
                  <span>Telefone:</span>
                  <span className="text-white">{selectedRegion.phone}</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {(selectedRegion.status === 'active' || selectedRegion.active) && (
                <button 
                  onClick={() => {
                    const cityName = selectedRegion.location?.split('/')[0] || selectedRegion.name;
                    setLocalCityZoom(cityName);
                    setSelectedRegion(null);
                  }}
                  className="w-full py-3 bg-green-500 hover:bg-green-400 text-zinc-950 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                >
                  <Compass size={14} /> Localizar Zoneamento (Ver Bairros/Clima)
                </button>
              )}
              
              <div className="flex gap-4 w-full">
                <button onClick={() => setSelectedRegion(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-colors border border-[#444746]">
                   Fechar
                </button>
                <button 
                  onClick={() => {
                    alert(`Iniciando contato com: ${selectedRegion.contact}`);
                    setSelectedRegion(null);
                  }} 
                  className="flex-[2] py-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Solicitar Contato
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
