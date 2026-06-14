export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  album: string;
  image: string;
  audioUrl: string;
}

export const RECENT_TRACKS: Track[] = [
  { id: 1, title: 'Winf™ Harmony', artist: 'Winf Sound Experience', album: 'Winf Premium Collection', duration: '1:08', image: 'https://images.unsplash.com/photo-1614064641936-38204bfa95f3?auto=format&fit=crop&q=80&w=600', audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg' },
  { id: 2, title: 'Carbon Reflection', artist: 'AeroCore™ Ensemble', album: 'AeroCore™ Elite', duration: '2:15', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
  { id: 3, title: 'Stratospheric Dreams', artist: 'GravityZero', album: 'Air Sounds', duration: '0:45', image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600', audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg' },
  { id: 4, title: 'Deep Blue Horizon', artist: 'Marine Soundwaves', album: 'Oceanic Vibes', duration: '3:05', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600', audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_hover_craft.ogg' },
  { id: 5, title: 'Invisible Shield', artist: 'Select Architects', album: 'Minimalist Series', duration: '1:50', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
  { id: 6, title: 'Ascend to Excellence', artist: 'Certification Masters', album: 'Elite Training', duration: '0:30', image: 'https://images.unsplash.com/photo-1559082260-26462c161be0?auto=format&fit=crop&q=80&w=600', audioUrl: 'https://actions.google.com/sounds/v1/foley/typing_on_typewriter.ogg' },
];

export const RECENT_GRID = [
  { id: 1, title: 'Músicas Curtidas', image: 'https://images.unsplash.com/photo-1614064641936-38204bfa95f3?auto=format&fit=crop&w=150&q=80', isLiked: true },
  { id: 2, title: 'Bob Marley - As melhores', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80' },
  { id: 3, title: 'Embalos de sábado à noite', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92e?auto=format&fit=crop&w=150&q=80' },
  { id: 4, title: 'Best of Bach', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=150&q=80' },
  { id: 5, title: 'Roxette as melhores', image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&w=150&q=80' },
  { id: 6, title: 'ELETRÔNICAS 2026', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80' },
  { id: 7, title: 'Lana Del Rey: as melhores', image: 'https://images.unsplash.com/photo-1516280440502-3c40ac78cb77?auto=format&fit=crop&w=150&q=80' },
  { id: 8, title: 'Melhores e Mais Tocadas', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=150&q=80' },
];

export const HORIZONTAL_CAROUSELS = [
  {
    title: "Curadoria WINF",
    items: [
      { id: 1, title: 'This is AeroCore', desc: 'Sons profundos.', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80' },
      { id: 2, title: 'Radio NeoSkin', desc: 'Atmosfera ativa.', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80' },
      { id: 3, title: 'Daily Mix', desc: 'Feito para você.', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92e?auto=format&fit=crop&w=300&q=80' },
    ]
  }
];
