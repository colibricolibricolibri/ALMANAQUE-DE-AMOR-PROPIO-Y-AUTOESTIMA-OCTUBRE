import React from 'react';
import { 
  Play, 
  Pause, 
  X, 
  Maximize2, 
  Youtube, 
  Headphones, 
  Music2,
  Volume2
} from 'lucide-react';
import { YouTubeTrack } from './YouTubeMusicModal';

interface YouTubeFloatingPlayerProps {
  currentTrack: YouTubeTrack | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenModal: () => void;
  onStop: () => void;
  isModalOpen: boolean;
}

export const YouTubeFloatingPlayer: React.FC<YouTubeFloatingPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onOpenModal,
  onStop,
  isModalOpen
}) => {
  if (!currentTrack) return null;

  return (
    <>
      {/* Contenedor persistente del Iframe (si la modal no está abierta, se mantiene activo en un viewport discreto para que el audio siga sonando sin interrupciones) */}
      <div 
        className={isModalOpen ? 'hidden' : 'fixed bottom-4 right-4 z-40 max-w-[340px] w-[calc(100%-2rem)] sm:w-80 animate-fade-in shadow-2xl'}
      >
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3 rounded-2xl border border-stone-700/80 shadow-2xl flex items-center gap-3">
          
          {/* Miniatura con botón de play/pause */}
          <div 
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-xl overflow-hidden bg-black relative shrink-0 cursor-pointer group"
          >
            <img 
              src={currentTrack.thumbnail} 
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </div>
          </div>

          {/* Info del tema */}
          <div 
            onClick={onOpenModal}
            className="flex-1 min-w-0 cursor-pointer"
            title="Click para expandir el reproductor"
          >
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                currentTrack.category === 'zen' ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'
              }`}>
                {currentTrack.category === 'zen' ? 'Zen 432Hz' : 'Clásica'}
              </span>
              <div className="flex items-center gap-0.5 h-2">
                {[1, 2, 3, 4].map((i) => (
                  <span 
                    key={i}
                    className={`w-0.5 rounded-full bg-red-400 transition-all ${
                      isPlaying ? `h-2.5 animate-pulse` : 'h-1 bg-stone-600'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <h5 className="text-xs font-semibold text-white truncate mt-0.5">
              {currentTrack.title}
            </h5>
            <p className="text-[10px] text-stone-400 truncate">
              {currentTrack.composerOrArtist}
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenModal}
              title="Expandir reproductor"
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onStop}
              title="Detener música"
              className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Iframe persistente en miniatura (invisible o ultracompacto) cuando la modal principal está cerrada */}
        {!isModalOpen && (
          <div className="h-0 w-0 opacity-0 overflow-hidden pointer-events-none">
            <iframe
              title="YouTube Background Player"
              src={`https://www.youtube-nocookie.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              allow="autoplay; encrypted-media"
              className="w-1 h-1"
            />
          </div>
        )}
      </div>
    </>
  );
};
