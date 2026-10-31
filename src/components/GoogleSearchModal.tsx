import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  X, 
  Sparkles, 
  Compass, 
  Minus, 
  Maximize2, 
  Minimize2,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface GoogleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

export const GoogleSearchModal: React.FC<GoogleSearchModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  isMinimized = false,
  onMinimize
}) => {
  const [query, setQuery] = useState('');
  const [isDockedToSide, setIsDockedToSide] = useState(true);

  if (!isOpen || isMinimized) return null;

  const handleSearch = (e?: React.FormEvent, type: 'web' | 'news' | 'maps' = 'web', inNewTab: boolean = true) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      // Si no escribe nada, abrir la página principal de Google
      window.open('https://www.google.com', '_blank', 'noopener,noreferrer');
      if (onShowToast) onShowToast('🌐 Abriendo Google en una nueva pestaña...');
      return;
    }

    let url = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;
    if (type === 'news') {
      url = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}&tbm=nws`;
    } else if (type === 'maps') {
      url = `https://www.google.com/maps/search/${encodeURIComponent(cleanQuery)}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    if (onShowToast) onShowToast(`🔍 Buscando "${cleanQuery}" en Google (Nueva pestaña)...`);
  };

  const handleOpenDirectGoogle = () => {
    window.open('https://www.google.com', '_blank', 'noopener,noreferrer');
    if (onShowToast) onShowToast('🌐 Abriendo Google en pestaña nueva del navegador...');
  };

  const SUGGESTED_SEARCHES = [
    'Significado de números angelicales y sincronías',
    'Técnicas de respiración para calmar la ansiedad',
    'Afirmaciones positivas de amor propio Louise Hay',
    'Sonidos binaurales 432 Hz beneficios para la mente',
    'Clima y pronóstico extendido de hoy',
    'Recetas conscientes y saludables de cocina natural'
  ];

  return (
    /* Contenedor flotante no-bloqueante: Permite interactuar y leer el Almanaque mientras buscas */
    <div 
      className={`fixed z-50 transition-all duration-300 pointer-events-none ${
        isDockedToSide
          ? 'bottom-16 sm:bottom-20 right-2 sm:right-6 w-[calc(100%-16px)] sm:w-[480px] max-h-[82vh]'
          : 'inset-0 flex items-center justify-center p-3 sm:p-4 bg-stone-900/25 backdrop-blur-[2px]'
      }`}
    >
      <div 
        className="pointer-events-auto relative w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F7F2E7] rounded-3xl p-4 sm:p-6 shadow-[0_15px_45px_rgba(46,39,33,0.22)] border-2 border-amber-200/90 text-stone-800 flex flex-col max-h-[82vh] overflow-y-auto no-scrollbar animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de controles estilo ventana / pestaña de navegador */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 p-0.5 shadow-xs shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <span className="font-bold text-sm bg-gradient-to-r from-blue-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                  G
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-tight">
                  Buscador Google
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full border border-blue-200">
                  Multitarea
                </span>
              </div>
              <p className="text-[10px] text-stone-500 truncate">
                Busca mientras miras el Almanaque
              </p>
            </div>
          </div>

          {/* Botones de control: Abrir en pestaña nueva, Acoplar/Centrar, Minimizar, Cerrar */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleOpenDirectGoogle}
              className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
              title="Abrir Google en una pestaña nueva del navegador ↗"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Pestaña Nueva</span>
            </button>

            <button
              onClick={() => setIsDockedToSide(!isDockedToSide)}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title={isDockedToSide ? "Centrar ventana" : "Anclar al lateral"}
            >
              {isDockedToSide ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            {onMinimize && (
              <button
                onClick={onMinimize}
                className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Minimizar a la barra de pestañas inferior"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              title="Cerrar pestaña"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formulario de búsqueda principal */}
        <form onSubmit={(e) => handleSearch(e, 'web', true)} className="mb-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en Google o escribir tu duda..."
              autoFocus
              className="w-full pl-10 pr-24 py-2.5 sm:py-3 bg-white border-2 border-stone-200 focus:border-blue-500 focus:outline-none rounded-2xl text-xs sm:text-sm text-stone-900 shadow-inner placeholder:text-stone-400 transition-all font-sans"
            />
            <Search className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                title="Buscar en Google y abrir pestaña nueva"
              >
                <span>Buscar</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </form>

        {/* Botones de categorías rápidas */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => handleSearch(undefined, 'web', true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 border border-stone-200 text-stone-700 text-[11px] font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Globe className="w-3 h-3 text-blue-600" />
            <span>Web General</span>
          </button>
          <button
            type="button"
            onClick={() => handleSearch(undefined, 'news', true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 text-stone-700 text-[11px] font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Noticias</span>
          </button>
          <button
            type="button"
            onClick={() => handleSearch(undefined, 'maps', true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 text-stone-700 text-[11px] font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Compass className="w-3 h-3 text-emerald-600" />
            <span>Maps</span>
          </button>
          <button
            type="button"
            onClick={handleOpenDirectGoogle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-semibold shadow-2xs transition-all cursor-pointer ml-auto"
          >
            <span>Google.com</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Sugerencias de búsqueda rápida */}
        <div className="bg-white/85 p-3 rounded-2xl border border-stone-200/70 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Sugerencias de Bienestar:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SEARCHES.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(s);
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(s)}`, '_blank', 'noopener,noreferrer');
                }}
                className="text-left px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200/80 text-[11px] text-stone-600 transition-all flex items-center gap-1 cursor-pointer"
                title="Buscar esta sugerencia en pestaña nueva"
              >
                <span className="truncate max-w-[200px]">{s}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Pie de la ventana */}
        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-600" />
            <span>Pestaña multitarea activa</span>
          </span>
          <div className="flex items-center gap-2">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                Minimizar a dock
              </button>
            )}
            <button
              onClick={onClose}
              className="text-terracotta-700 hover:text-terracotta-900 font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
