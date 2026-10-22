import React, { useState } from 'react';
import { 
  X, 
  Youtube, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Music, 
  Headphones, 
  Search, 
  ExternalLink, 
  Minimize2, 
  Maximize2,
  Disc,
  Radio,
  Plus
} from 'lucide-react';

export interface YouTubeTrack {
  id: string;
  videoId: string;
  title: string;
  subtitle: string;
  category: 'zen' | 'clasica';
  duration: string;
  composerOrArtist: string;
  thumbnail: string;
  description: string;
}

export const CURATED_YOUTUBE_TRACKS: YouTubeTrack[] = [
  // MÚSICA ZEN
  {
    id: 'zen-1',
    videoId: '1ZYbU8csQz4',
    title: 'Cuencos Tibetanos y Campanas Sagradas',
    subtitle: 'Vibración pura para limpiar el campo áurico y aquietar la mente',
    category: 'zen',
    duration: '3 Horas',
    composerOrArtist: 'Sonoterapia Ancestral',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
    description: 'Armónicos de cuencos del Himalaya para meditación de amor propio y autoestimas profunda.'
  },
  {
    id: 'zen-2',
    videoId: 'lFcSrYw-ARY',
    title: 'Frecuencia Sanadora 432 Hz · Paz Total',
    subtitle: 'Afinación natural del universo para soltar tensiones y ansiedad',
    category: 'zen',
    duration: '2 Horas',
    composerOrArtist: 'Armonía 432Hz',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
    description: 'Tonos sinusoidales puros y arpas zen para restaurar la calma interior.'
  },
  {
    id: 'zen-3',
    videoId: '4xDzrJKXOOY',
    title: 'Flauta Zen Shakuhachi y Arroyo de Agua',
    subtitle: 'Naturaleza viva y brisa de bambú para respiración consciente',
    category: 'zen',
    duration: '1 Hora',
    composerOrArtist: 'Tradición Zen Oriental',
    thumbnail: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=400',
    description: 'El sonido del agua fluyendo junto al canto sereno de la flauta tradicional.'
  },
  {
    id: 'zen-4',
    videoId: '77ZozI0rw7w',
    title: 'Milagro 528 Hz · Transformación y Amor',
    subtitle: 'Frecuencia Solfeggio de transmutación y regeneración celular',
    category: 'zen',
    duration: '2 Horas',
    composerOrArtist: 'Solfeggio Meditations',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    description: 'Ideal para acompañar las afirmaciones de perdón, gratitud y amor propio.'
  },
  {
    id: 'zen-5',
    videoId: 'DWcJFNfaw9c',
    title: 'Piano Zen Bajo la Lluvia Suave',
    subtitle: 'Gotas de serenidad que abrazan el corazón cansado',
    category: 'zen',
    duration: '3 Horas',
    composerOrArtist: 'Ambiente Acuático Zen',
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=400',
    description: 'Melodías lentas y cadenciosas de piano acústico con murmullo de lluvia.'
  },

  // MÚSICA CLÁSICA
  {
    id: 'clasica-1',
    videoId: 'W-fFHeTX70Q',
    title: 'Frédéric Chopin · Nocturnos para el Alma',
    subtitle: 'Poesía romántica al piano para la paz, la lectura y la introspección',
    category: 'clasica',
    duration: '2 Horas',
    composerOrArtist: 'Frédéric Chopin (Piano)',
    thumbnail: 'https://images.unsplash.com/photo-1520523839898-50712825e617?auto=format&fit=crop&q=80&w=400',
    description: 'Obras maestras que calman los latidos y despiertan la ternura interior.'
  },
  {
    id: 'clasica-2',
    videoId: '4Tr0otuiQuU',
    title: 'Claude Debussy · Clair de Lune & Ensueños',
    subtitle: 'Impresionismo etéreo y ondulante como el agua cristalina',
    category: 'clasica',
    duration: '1.5 Horas',
    composerOrArtist: 'Claude Debussy',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
    description: 'Sonoridades transparentes inspiradas en la luna, la luz y la calma.'
  },
  {
    id: 'clasica-3',
    videoId: 'RBMXWb3Qkno',
    title: 'Erik Satie · Gymnopédies & Gnossiennes',
    subtitle: 'Minimalismo clásico hipnótico, sereno e intemporal',
    category: 'clasica',
    duration: '1 Hora',
    composerOrArtist: 'Erik Satie',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=400',
    description: 'Acordes sostenidos que abren espacios de silencio y descanso mental.'
  },
  {
    id: 'clasica-4',
    videoId: '6JQm5aSjX6g',
    title: 'J.S. Bach · Suites para Cello & Aire Sagrado',
    subtitle: 'Cuerdas profundas y resonantes que enraízan la serenidad',
    category: 'clasica',
    duration: '1.5 Horas',
    composerOrArtist: 'Johann Sebastian Bach',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=400',
    description: 'Estructura armónica perfecta que ordena los pensamientos dispersos.'
  },
  {
    id: 'clasica-5',
    videoId: 'mGQLXRTl3Z0',
    title: 'W.A. Mozart · Adagios Serenos & Piano Dulce',
    subtitle: 'Claridad luminosa y armonía para el bienestar emocional',
    category: 'clasica',
    duration: '2 Horas',
    composerOrArtist: 'Wolfgang Amadeus Mozart',
    thumbnail: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=format&fit=crop&q=80&w=400',
    description: 'Efecto Mozart: frecuencias equilibradas que relajan y elevan el ánimo.'
  },
  {
    id: 'clasica-6',
    videoId: 'xFrGuyw1V8s',
    title: 'L. van Beethoven · Claro de Luna & Adagios',
    subtitle: 'Sensibilidad profunda que acaricia el espíritu en quietud',
    category: 'clasica',
    duration: '1 Hora',
    composerOrArtist: 'Ludwig van Beethoven',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    description: 'El primer movimiento de la Sonata Claro de Luna en su cadencia más pura.'
  }
];

// Helper para extraer ID de video de YouTube
export const extractYouTubeVideoId = (input: string): string | null => {
  if (!input) return null;
  const trimmed = input.trim();
  
  // Si ya es un ID limpio de 11 caracteres
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Patrones estándar de YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

interface YouTubeMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: YouTubeTrack | null;
  onSelectTrack: (track: YouTubeTrack) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onMinimize?: () => void;
}

export const YouTubeMusicModal: React.FC<YouTubeMusicModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack,
  isPlaying,
  onTogglePlay,
  onMinimize
}) => {
  const [activeTab, setActiveTab] = useState<'zen' | 'clasica'>('zen');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTracks = CURATED_YOUTUBE_TRACKS.filter(t => t.category === activeTab);

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    const videoId = extractYouTubeVideoId(customUrlInput);
    if (!videoId) {
      setCustomError('Enlace de YouTube no válido. Pega una URL como https://www.youtube.com/watch?v=... o el código del video.');
      return;
    }

    const newTrack: YouTubeTrack = {
      id: `custom-${Date.now()}`,
      videoId,
      title: 'Tu Selección de YouTube',
      subtitle: 'Video o música personalizada desde YouTube',
      category: activeTab,
      duration: 'Personalizado',
      composerOrArtist: 'YouTube Music',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      description: 'Audio y video cargado por tu enlace personal.'
    };

    onSelectTrack(newTrack);
    setCustomUrlInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="bg-white/95 rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-3xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Reproductor Zen & Clásica */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-stone-50 via-rose-50/40 to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
              <Youtube className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  Música Zen & Clásica
                </h3>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  YouTube
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Acompaña tu lectura y meditación con frecuencias serenas y piezas clásicas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onMinimize && (
              <button
                onClick={onMinimize}
                title="Minimizar reproductor flotante"
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Cerrar ventana"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reproductor Activo en la parte superior si hay track seleccionado */}
        {currentTrack && (
          <div className="bg-stone-900 text-white p-4 sm:p-5 border-b border-stone-800">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Contenedor del Iframe de YouTube incrustado */}
              <div className="w-full sm:w-56 aspect-video rounded-2xl overflow-hidden bg-black shadow-lg shrink-0 relative border border-stone-800">
                <iframe
                  key={currentTrack.videoId}
                  title={currentTrack.title}
                  src={`https://www.youtube-nocookie.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Información y controles del tema actual */}
              <div className="flex-1 w-full space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    currentTrack.category === 'zen' ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50' : 'bg-amber-900/80 text-amber-300 border border-amber-700/50'
                  }`}>
                    {currentTrack.category === 'zen' ? '🧘 Música Zen & 432 Hz' : '🎻 Música Clásica'}
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                    <Headphones className="w-3 h-3 text-red-400" />
                    {currentTrack.duration}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-serif font-bold text-white tracking-tight line-clamp-1">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-stone-300 font-medium line-clamp-1">
                  {currentTrack.composerOrArtist} · {currentTrack.subtitle}
                </p>

                {/* Controles de reproducción rápida y enlace a YouTube */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={onTogglePlay}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${currentTrack.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Abrir en YouTube</span>
                  </a>

                  {onMinimize && (
                    <button
                      onClick={onMinimize}
                      className="px-3 py-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Minimizar a barra flotante para seguir usando la app"
                    >
                      <Minimize2 className="w-3 h-3" />
                      <span>Flotante</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestañas: Zen vs Clásica */}
        <div className="px-5 pt-4 pb-2 border-b border-stone-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-stone-100/90 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('zen')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'zen'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🧘</span>
              <span>Música Zen (432Hz)</span>
            </button>
            <button
              onClick={() => setActiveTab('clasica')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'clasica'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🎻</span>
              <span>Música Clásica</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Disc className="w-3.5 h-3.5 text-stone-400 animate-spin-slow" />
            <span>{filteredTracks.length} Selecciones Curadas</span>
          </div>
        </div>

        {/* Lista de temas curados */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTracks.map((track) => {
              const isSelected = currentTrack?.videoId === track.videoId;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer group relative ${
                    isSelected
                      ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400/20 shadow-sm'
                      : 'bg-white hover:bg-stone-50/90 border-stone-200/80 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative shadow-2xs">
                    <img 
                      src={track.thumbnail} 
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isSelected ? 'bg-red-600 text-white animate-pulse' : 'bg-white/90 text-stone-900'}`}>
                        {isSelected && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider truncate">
                        {track.composerOrArtist}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {track.duration}
                      </span>
                    </div>
                    <h5 className={`text-xs sm:text-sm font-semibold tracking-tight line-clamp-1 ${isSelected ? 'text-red-900 font-bold' : 'text-stone-900'}`}>
                      {track.title}
                    </h5>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {track.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pegar enlace propio de YouTube */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-red-50/30 border border-stone-200">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4 text-red-600" />
              <h5 className="text-xs font-bold text-stone-800">
                ¿Deseas escuchar otro video o música de YouTube?
              </h5>
            </div>
            <p className="text-[11px] text-stone-500 mb-2">
              Pega cualquier enlace de YouTube (Música clásica, cuencos tibetanos, sonidos de lluvia o tu lista preferida):
            </p>

            <form onSubmit={handleAddCustomTrack} className="flex gap-2">
              <input
                type="text"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Ejemplo: https://www.youtube.com/watch?v=... o código de 11 letras"
                className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0"
              >
                Reproducir
              </button>
            </form>
            {customError && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{customError}</p>
            )}
          </div>
        </div>

        {/* Pie con sugerencias de búsqueda en YouTube */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px]">Explora más horas en YouTube:</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/results?search_query=musica+zen+meditacion+432hz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
            >
              <span>Buscar Zen 432Hz</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-stone-300">·</span>
            <a
              href="https://www.youtube.com/results?search_query=musica+clasica+relajante+piano"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
            >
              <span>Buscar Clásica Piano</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
