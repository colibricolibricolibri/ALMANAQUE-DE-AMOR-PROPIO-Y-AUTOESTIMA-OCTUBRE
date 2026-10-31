import React from 'react';
import { 
  Search, 
  FileEdit, 
  Phone, 
  Wifi, 
  Palette, 
  BookOpen, 
  ExternalLink, 
  Layers, 
  Minimize2, 
  Maximize2,
  X
} from 'lucide-react';

export interface MultitaskTab {
  id: 'google' | 'office' | 'contacts' | 'wifi' | 'canva' | 'library';
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  colorClass: string;
  externalUrl?: string;
}

interface FloatingMultitaskBarProps {
  // Estados y callbacks de cada herramienta
  isGoogleOpen: boolean;
  isGoogleMinimized: boolean;
  onToggleGoogle: () => void;
  onOpenGoogleExternal: () => void;

  isOfficeOpen: boolean;
  isOfficeMinimized: boolean;
  onToggleOffice: () => void;
  onOpenOfficeExternal: () => void;

  isContactsOpen: boolean;
  isContactsMinimized: boolean;
  onToggleContacts: () => void;

  isWifiOpen: boolean;
  isWifiMinimized: boolean;
  onToggleWifi: () => void;

  onOpenCanvaExternal: () => void;
  onOpenLibraryExternal: () => void;

  onCloseAllTabs: () => void;
}

export const FloatingMultitaskBar: React.FC<FloatingMultitaskBarProps> = ({
  isGoogleOpen,
  isGoogleMinimized,
  onToggleGoogle,
  onOpenGoogleExternal,

  isOfficeOpen,
  isOfficeMinimized,
  onToggleOffice,
  onOpenOfficeExternal,

  isContactsOpen,
  isContactsMinimized,
  onToggleContacts,

  isWifiOpen,
  isWifiMinimized,
  onToggleWifi,

  onOpenCanvaExternal,
  onOpenLibraryExternal,

  onCloseAllTabs
}) => {
  const activeWindowsCount = [isGoogleOpen, isOfficeOpen, isContactsOpen, isWifiOpen].filter(Boolean).length;
  const [isBarExpanded, setIsBarExpanded] = React.useState(true);

  // Si no hay herramientas abiertas, mostramos una barra elegante y discreta con acceso rápido para abrir pestañas
  return (
    <aside 
      aria-label="Pestañas multitarea flotantes"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-20px)] sm:w-auto max-w-4xl animate-fadeIn"
    >
      <div className="bg-[#FFFDF9]/95 backdrop-blur-md border border-amber-200/90 shadow-[0_10px_35px_rgba(46,39,33,0.18)] rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 text-stone-800 transition-all">
        
        {/* Indicador de Multitarea / Pestañas */}
        <div className="flex items-center gap-1.5 pl-1 pr-1.5 border-r border-stone-200/80 shrink-0">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="hidden md:inline font-cambria font-bold text-xs text-stone-900 whitespace-nowrap">
            Pestañas Multitarea
          </span>
          {activeWindowsCount > 0 && (
            <span className="text-[10px] font-bold bg-terracotta-600 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
              {activeWindowsCount}
            </span>
          )}
        </div>

        {/* Lista de pestañas flotantes */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          
          {/* Pestaña 1: Google Search */}
          <div className="relative group shrink-0">
            <button
              onClick={onToggleGoogle}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isGoogleOpen && !isGoogleMinimized
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xs scale-102 ring-2 ring-blue-300/60'
                  : isGoogleOpen && isGoogleMinimized
                  ? 'bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100'
                  : 'bg-stone-100/90 hover:bg-blue-50 text-stone-700 hover:text-blue-800 border border-stone-200'
              }`}
              title="Buscador de Google: Buscar mientras miras el Almanaque"
            >
              <Search className={`w-3.5 h-3.5 ${isGoogleOpen && !isGoogleMinimized ? 'text-white' : 'text-blue-600'}`} />
              <span className="text-[11px] sm:text-xs">Google</span>
              {isGoogleOpen && (
                <span className={`w-1.5 h-1.5 rounded-full ${isGoogleMinimized ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`} />
              )}
            </button>
            {/* Acceso directo a pestaña nueva de Google */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenGoogleExternal();
              }}
              className="absolute -top-1 -right-1 p-0.5 bg-white text-blue-600 hover:text-blue-800 border border-blue-200 rounded-full shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Abrir Google en pestaña nueva del navegador ↗"
            >
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Pestaña 2: Office Suite */}
          <div className="relative group shrink-0">
            <button
              onClick={onToggleOffice}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isOfficeOpen && !isOfficeMinimized
                  ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-xs scale-102 ring-2 ring-orange-300/60'
                  : isOfficeOpen && isOfficeMinimized
                  ? 'bg-orange-50 text-orange-800 border border-orange-300 hover:bg-orange-100'
                  : 'bg-stone-100/90 hover:bg-orange-50 text-stone-700 hover:text-orange-800 border border-stone-200'
              }`}
              title="Paquete Office: Word, Excel y borrador sin cerrar el Almanaque"
            >
              <FileEdit className={`w-3.5 h-3.5 ${isOfficeOpen && !isOfficeMinimized ? 'text-white' : 'text-orange-600'}`} />
              <span className="text-[11px] sm:text-xs">Office</span>
              {isOfficeOpen && (
                <span className={`w-1.5 h-1.5 rounded-full ${isOfficeMinimized ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`} />
              )}
            </button>
            {/* Acceso directo a pestaña nueva de Word/Office */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenOfficeExternal();
              }}
              className="absolute -top-1 -right-1 p-0.5 bg-white text-orange-600 hover:text-orange-800 border border-orange-200 rounded-full shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Abrir Word en pestaña nueva del navegador ↗"
            >
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Pestaña 3: Contactos / Teléfonos */}
          <button
            onClick={onToggleContacts}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              isContactsOpen && !isContactsMinimized
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs scale-102 ring-2 ring-emerald-300/60'
                : isContactsOpen && isContactsMinimized
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-100/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200'
            }`}
            title="Agenda de Teléfonos & Contactos de Ayuda"
          >
            <Phone className={`w-3.5 h-3.5 ${isContactsOpen && !isContactsMinimized ? 'text-white' : 'text-emerald-600'}`} />
            <span className="text-[11px] sm:text-xs">Teléfonos</span>
            {isContactsOpen && (
              <span className={`w-1.5 h-1.5 rounded-full ${isContactsMinimized ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`} />
            )}
          </button>

          {/* Pestaña 4: Wi-Fi Map */}
          <button
            onClick={onToggleWifi}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              isWifiOpen && !isWifiMinimized
                ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-xs scale-102 ring-2 ring-teal-300/60'
                : isWifiOpen && isWifiMinimized
                ? 'bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100'
                : 'bg-stone-100/90 hover:bg-teal-50 text-stone-700 hover:text-teal-800 border border-stone-200'
            }`}
            title="Mapa de Redes Wi-Fi Gratuitas Cercanas"
          >
            <Wifi className={`w-3.5 h-3.5 ${isWifiOpen && !isWifiMinimized ? 'text-white' : 'text-teal-600'}`} />
            <span className="text-[11px] sm:text-xs">Wi-Fi</span>
            {isWifiOpen && (
              <span className={`w-1.5 h-1.5 rounded-full ${isWifiMinimized ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`} />
            )}
          </button>

          {/* Pestaña Externa 5: Canva (Pestaña nueva del navegador) */}
          <button
            onClick={onOpenCanvaExternal}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100/90 hover:bg-purple-50 text-stone-700 hover:text-purple-800 border border-stone-200 transition-all shrink-0 cursor-pointer"
            title="Abrir Canva en una nueva pestaña del navegador"
          >
            <Palette className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] sm:text-xs">Canva</span>
            <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
          </button>

          {/* Pestaña Externa 6: Libros / Biblioteca (Pestaña nueva del navegador) */}
          <button
            onClick={onOpenLibraryExternal}
            className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100/90 hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200 transition-all shrink-0 cursor-pointer"
            title="Abrir Biblioteca gratuita en una nueva pestaña del navegador"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] sm:text-xs">Biblioteca</span>
            <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
          </button>

        </div>

        {/* Botón para cerrar o minimizar todas las ventanas activas si hay alguna */}
        {activeWindowsCount > 0 && (
          <button
            onClick={onCloseAllTabs}
            className="p-1 sm:p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors shrink-0 cursor-pointer"
            title="Cerrar todas las pestañas flotantes abiertas"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

      </div>
    </aside>
  );
};
