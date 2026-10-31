import React, { useState } from 'react';
import { Search, Globe, ExternalLink, X, Sparkles, Compass, HelpCircle } from 'lucide-react';

interface GoogleSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const GoogleSearchModal: React.FC<GoogleSearchModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent, type: 'web' | 'news' | 'maps' = 'web') => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      if (onShowToast) onShowToast('Ingresa lo que deseas buscar en Google');
      return;
    }

    let url = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;
    if (type === 'news') {
      url = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}&tbm=nws`;
    } else if (type === 'maps') {
      url = `https://www.google.com/maps/search/${encodeURIComponent(cleanQuery)}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    if (onShowToast) onShowToast(`🔍 Buscando "${cleanQuery}" en Google...`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F7F2E7] rounded-3xl p-5 sm:p-7 shadow-2xl border border-amber-200/90 text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          title="Cerrar buscador"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                G
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 leading-tight">
                Barra de Búsqueda Google
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                Directa
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Explora cualquier tema sin perderte ni cerrar tu Almanaque
            </p>
          </div>
        </div>

        {/* Formulario de búsqueda principal */}
        <form onSubmit={(e) => handleSearch(e, 'web')} className="mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en Google o escribir una pregunta..."
              autoFocus
              className="w-full pl-11 pr-24 py-3.5 bg-white border-2 border-stone-200 focus:border-blue-500 focus:outline-none rounded-2xl text-sm text-stone-900 shadow-inner placeholder:text-stone-400 transition-all font-sans"
            />
            <Search className="absolute left-3.5 w-5 h-5 text-stone-400 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Botones de acción rápida por categoría */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => handleSearch(undefined, 'web')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Web General</span>
          </button>
          <button
            type="button"
            onClick={() => handleSearch(undefined, 'news')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Noticias</span>
          </button>
          <button
            type="button"
            onClick={() => handleSearch(undefined, 'maps')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lugares / Maps</span>
          </button>
        </div>

        {/* Búsquedas conscientes sugeridas */}
        <div className="bg-white/80 p-3.5 sm:p-4 rounded-2xl border border-stone-200/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Sugerencias de Bienestar y Curiosidad:
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
                className="text-left px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200/80 text-[11px] text-stone-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{s}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Pie */}
        <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
          <span>Abre en una pestaña limpia segura</span>
          <button
            onClick={onClose}
            className="font-semibold text-terracotta-700 hover:text-terracotta-800 cursor-pointer"
          >
            Volver al Almanaque
          </button>
        </div>
      </div>
    </div>
  );
};
