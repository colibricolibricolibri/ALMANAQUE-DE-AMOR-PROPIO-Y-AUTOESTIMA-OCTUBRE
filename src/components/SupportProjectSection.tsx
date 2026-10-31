import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Eye, 
  Download, 
  Check, 
  Copy, 
  ShieldCheck, 
  Compass, 
  ArrowRight,
  Calendar,
  Lock,
  Unlock,
  Layers
} from 'lucide-react';
import { 
  SUPPORT_CATEGORY_INFO, 
  SUPPORT_PROJECT_MONTHS, 
  SUPPORT_PROJECT_LOOSE_ITEMS,
  SUPPORT_PROJECT_ITEMS,
  SupportProjectItem,
  SupportProjectImage
} from '../data/supportProjectData';
import { UserAccount } from '../../types';
import { getUnlockedMonths, isUserAuthorizedGuest } from '../utils/tierAccess';

const LOOSE_ITEMS_UNLOCK_DATE = new Date('2027-10-01T00:00:00');

interface SupportProjectSectionProps {
  currentUser: UserAccount | null;
  onOpenPayment: (
    plan: 'apoyo', 
    customItemTitle?: string, 
    customAmount?: number, 
    meta?: { targetMonth?: number | null }
  ) => void;
  onShowToast?: (msg: string) => void;
  onGoToCalendarMonth?: (monthIdx: number) => void;
}

export const SupportProjectSection: React.FC<SupportProjectSectionProps> = ({
  currentUser,
  onOpenPayment,
  onShowToast,
  onGoToCalendarMonth
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    originalUrl?: string;
    title: string;
    itemNumber: number;
    subIndex: number;
  } | null>(null);

  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const isAdmin = isUserAuthorizedGuest(currentUser);
  const [adminForceLockTest, setAdminForceLockTest] = useState<boolean>(false);
  const isLooseUnlocked = (new Date() >= LOOSE_ITEMS_UNLOCK_DATE) || (isAdmin && !adminForceLockTest);

  const unlockedMonths = useMemo(() => getUnlockedMonths(currentUser), [currentUser]);

  const getItemKey = (item: SupportProjectItem) => item.id || `${item.number}-${item.title}`;

  // Filtrado de meses
  const filteredMonths = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SUPPORT_PROJECT_MONTHS;
    return SUPPORT_PROJECT_MONTHS.filter(it => 
      it.title.toLowerCase().includes(q) ||
      it.number.toString().includes(q) ||
      (it.subtitle && it.subtitle.toLowerCase().includes(q)) ||
      (it.groupedTitles && it.groupedTitles.some(t => t.toLowerCase().includes(q))) ||
      (it.groupedPhrases && it.groupedPhrases.some(p => p.toString().includes(q)))
    );
  }, [searchQuery]);

  // Filtrado de frases sueltas (1 a 8)
  const filteredLoose = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SUPPORT_PROJECT_LOOSE_ITEMS;
    return SUPPORT_PROJECT_LOOSE_ITEMS.filter(it => 
      it.title.toLowerCase().includes(q) ||
      it.number.toString().includes(q) ||
      (it.originalNumber && it.originalNumber.toString().includes(q)) ||
      (it.subtitle && it.subtitle.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectImageIndex = (itemKey: string, index: number) => {
    setActiveImageIndices(prev => ({
      ...prev,
      [itemKey]: index
    }));
  };

  const handleCopyTitle = (item: SupportProjectItem) => {
    const itemKey = getItemKey(item);
    const textToCopy = item.isMonth
      ? `Mes de ${item.title} ($1.25 USD) - Desbloquea el calendario de ${item.title}`
      : `Frase #${item.number}: ${item.title} ($1.25 USD)`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(itemKey);
    if (onShowToast) {
      onShowToast(`✨ Copiado al portapapeles: ${item.title}`);
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderCard = (item: SupportProjectItem, isMonthItem: boolean) => {
    const itemKey = getItemKey(item);
    const currentImgIndex = activeImageIndices[itemKey] || 0;
    const currentImg = item.images && item.images.length > 0 
      ? item.images[currentImgIndex] || item.images[0]
      : null;
    const isMonthUnlocked = isMonthItem && item.monthIndex !== undefined && unlockedMonths.includes(item.monthIndex);

    return (
      <div 
        key={itemKey}
        className={`group bg-white rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 relative ${
          isMonthUnlocked 
            ? 'border-emerald-300 ring-2 ring-emerald-400/20' 
            : isMonthItem 
            ? 'border-rose-200/90 hover:border-rose-400' 
            : 'border-sand-200 hover:border-amber-400'
        }`}
      >
        {/* Cabecera de la tarjeta */}
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-stone-100 bg-gradient-to-r from-sand-50/70 via-white to-rose-50/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
              isMonthUnlocked 
                ? 'bg-emerald-600 text-white' 
                : isMonthItem 
                ? 'bg-gradient-to-tr from-rose-500 to-terracotta-600 text-white' 
                : 'bg-stone-900 text-amber-200'
            }`}>
              {isMonthItem ? (
                <span>{item.number}</span>
              ) : (
                <span>#{item.number}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg group-hover:text-rose-700 transition-colors truncate">
                  {item.title}
                </h3>
                {isMonthItem ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    isMonthUnlocked 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {isMonthUnlocked ? '✓ Mes Desbloqueado' : 'Calendario & Mantras'}
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${
                    !isLooseUnlocked 
                      ? 'bg-amber-100/90 text-amber-900 border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {!isLooseUnlocked ? (
                      <>
                        <Lock className="w-2.5 h-2.5 text-amber-700" />
                        <span>Bloqueado · Oct. 2027</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-2.5 h-2.5 text-emerald-700" />
                        <span>Frase Adicional</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>

          {/* Precio Individual */}
          <div className="text-right shrink-0 ml-2">
            <div className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs font-sans">
              ${item.price.toFixed(2)} USD
            </div>
            <span className="text-[9px] text-stone-400 block mt-0.5">
              ARS ~$1.925
            </span>
          </div>
        </div>

        {/* Notificación de desbloqueo de mes */}
        {isMonthItem && (
          <div className={`px-4 py-2 border-b text-[11px] flex items-center gap-2 ${
            isMonthUnlocked 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : 'bg-amber-50/80 text-amber-900 border-amber-200/80'
          }`}>
            {isMonthUnlocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">¡El calendario de {item.title} está 100% desbloqueado en tu cuenta!</span>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Al abonar $1.25 se desbloquea el calendario del mes de <strong>{item.title}</strong> (solo mes de {item.title}).</span>
              </>
            )}
          </div>
        )}

        {/* Notificación para frase adicional bloqueada */}
        {!isMonthItem && !isLooseUnlocked && (
          <div className="px-4 py-2 bg-amber-50/90 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Candado activo:</strong> Se desbloquea en <strong>Octubre de 2027</strong> junto con el Calendario 2028.
            </span>
          </div>
        )}

        {/* Selector de anclas visuales / imágenes agrupadas */}
        {item.images && item.images.length > 1 && (
          <div className="flex bg-sand-50/90 border-b border-stone-200/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
            {item.images.map((img, idx) => {
              const isActive = idx === currentImgIndex;
              const shortLabel = img.label 
                ? (img.label.length > 22 ? `${img.label.slice(0, 20)}...` : img.label)
                : `Ancla ${idx + 1}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectImageIndex(itemKey, idx);
                  }}
                  className={`py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 shadow-2xs font-bold border border-rose-200 ring-1 ring-rose-400/20'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/90 border border-transparent'
                  }`}
                  title={img.label || `Ver imagen ${idx + 1}`}
                >
                  <Sparkles className={`w-2.5 h-2.5 ${isActive ? 'text-amber-500' : 'text-stone-400'}`} />
                  <span>{shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Imagen principal interactiva */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-sand-100/90 via-stone-100/80 to-rose-50/60 overflow-hidden cursor-pointer border-b border-stone-100">
          {/* Badge del ancla actual */}
          <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-[10px] font-bold border border-rose-200/80 shadow-xs flex items-center gap-1.5 pointer-events-none max-w-[85%] truncate">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate">{currentImg?.label || `Ancla Visual #${currentImgIndex + 1}`}</span>
          </div>

          {(() => {
            const imgKey = `${itemKey}-${currentImgIndex}`;
            const hasDirectFile = currentImg?.directUrl && !imageErrors[imgKey];

            if (hasDirectFile) {
              return (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    key={`bg-${currentImg.directUrl || imgKey}`}
                    src={currentImg.directUrl}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                  />
                  <img
                    key={`fg-${currentImg.directUrl || imgKey}`}
                    src={currentImg.directUrl}
                    alt={`${item.title} - ${currentImg.label || 'Ancla visual'}`}
                    referrerPolicy="no-referrer"
                    className="relative z-10 max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    loading="lazy"
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [imgKey]: true }));
                    }}
                    onClick={() => setSelectedImage({
                      url: currentImg.directUrl,
                      originalUrl: currentImg.originalUrl,
                      title: `${item.title} - ${currentImg.label || 'Ancla Visual'}`,
                      itemNumber: item.number,
                      subIndex: currentImgIndex
                    })}
                  />
                </div>
              );
            }

            return (
              <div 
                onClick={() => setSelectedImage({
                  url: currentImg?.directUrl || '',
                  originalUrl: currentImg?.originalUrl,
                  title: item.title,
                  itemNumber: item.number,
                  subIndex: currentImgIndex
                })}
                className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-rose-50/80 via-sand-50 to-amber-50/70 text-stone-800 space-y-2 select-none"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-100/70 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-2xs">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-0.5 max-w-[220px]">
                  <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 block truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    {currentImg?.label || 'Ancla Visual Sagrada'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Botón para ampliar imagen suave */}
          <button
            type="button"
            onClick={() => setSelectedImage({
              url: currentImg?.directUrl || '',
              originalUrl: currentImg?.originalUrl,
              title: `${item.title} - ${currentImg?.label || 'Ancla Visual'}`,
              itemNumber: item.number,
              subIndex: currentImgIndex
            })}
            className="absolute bottom-2.5 left-2.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-rose-700 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-stone-200/80"
          >
            <Eye className="w-3.5 h-3.5 text-rose-500" />
            <span>Ampliar</span>
          </button>

          {/* Indicador de cantidad de imágenes */}
          {item.images && item.images.length > 1 && (
            <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-200/80 shadow-xs text-[10px] font-bold text-stone-700 flex items-center gap-1">
              <Layers className="w-3 h-3 text-rose-500" />
              <span>{currentImgIndex + 1} de {item.images.length}</span>
            </div>
          )}

          {/* Overlay de candado suave pastel para las 8 frases adicionales */}
          {!isMonthItem && !isLooseUnlocked && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onShowToast) {
                  onShowToast(`🔒 Frase #${item.number} bloqueada con candado: Se desbloqueará en Octubre de 2027 junto con el Calendario 2028.`);
                }
              }}
              className="absolute inset-0 z-30 bg-stone-900/60 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-center text-white cursor-pointer select-none transition-all hover:bg-stone-900/65"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border border-amber-200/80 shadow-md flex items-center justify-center text-stone-950 mb-2">
                <Lock className="w-6 h-6 text-stone-950" />
              </div>
              <span className="font-serif font-bold text-sm sm:text-base text-amber-100 drop-shadow-sm">
                Frase & Mantra #{item.number}
              </span>
              <p className="text-[11px] sm:text-xs text-stone-100 max-w-[210px] mt-1 leading-snug drop-shadow-sm">
                Desbloqueo exclusivo en <strong>Octubre de 2027</strong> junto con el Calendario 2028.
              </p>
              <span className="mt-2 text-[10px] font-medium px-3 py-1 rounded-full bg-white/20 border border-white/30 text-amber-50 backdrop-blur-sm">
                🌸 Paz, serenidad y paciencia
              </span>
            </div>
          )}
        </div>

        {/* Pie de la tarjeta con acciones */}
        <div className="p-4 space-y-3 mt-auto bg-white">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{item.images.length} anclas visuales</span>
            </span>
            <button
              onClick={() => handleCopyTitle(item)}
              className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedId === itemKey ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar datos</span>
                </>
              )}
            </button>
          </div>

          {/* Botón principal */}
          {isMonthItem ? (
            isMonthUnlocked ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onGoToCalendarMonth && item.monthIndex !== undefined && onGoToCalendarMonth(item.monthIndex)}
                  className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ir al Calendario</span>
                </button>
                <button
                  onClick={() => onOpenPayment(
                    'apoyo', 
                    `Colaboración Mes de ${item.title} ($1.25 USD)`, 
                    item.price,
                    { targetMonth: item.monthIndex }
                  )}
                  className="py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Re-descargar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenPayment(
                  'apoyo', 
                  `Colaboración Mes de ${item.title} ($1.25 USD)`, 
                  item.price,
                  { targetMonth: item.monthIndex }
                )}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-terracotta-600 hover:from-rose-600 hover:to-terracotta-700 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
              >
                <Heart className="w-3.5 h-3.5 text-rose-200 fill-white group-hover/btn:scale-110 transition-transform" />
                <span>Colaborar $1.25 · Desbloquear {item.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-100 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )
          ) : !isLooseUnlocked ? (
            <button
              type="button"
              onClick={() => onShowToast && onShowToast(`🔒 Frase #${item.number} bloqueada con candado: Se desbloqueará en Octubre de 2027 junto con el Calendario 2028. ¡Respira paz y calma!`)}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-100 via-rose-100 to-sand-100 hover:from-amber-200 hover:to-rose-200 text-stone-800 font-semibold text-xs sm:text-sm border border-amber-300/80 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Desbloqueo en Octubre 2027 (con Calendario 2028)</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenPayment(
                'apoyo', 
                `Frase #${item.number}: ${item.title} ($1.25 USD)`, 
                item.price
              )}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
            >
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-500 group-hover/btn:scale-110 transition-transform" />
              <span>Adquirir Frase #{item.number} · ${item.price.toFixed(2)} USD</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-200 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 md:py-10 space-y-10 animate-fadeIn">
      {/* ========================================================================= */}
      {/* HERO BANNER DE APOYO AL PROYECTO */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/90 via-sand-100/95 to-amber-50/90 text-stone-900 shadow-md border border-rose-200/80 p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-rose-300/80 text-rose-800 text-xs font-semibold backdrop-blur-md shadow-2xs font-sans">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Colaboración Solidaria Independiente</span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold font-sans">
              $1.25 USD c/u
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
            {SUPPORT_CATEGORY_INFO.name}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-700 leading-relaxed font-sans">
            {SUPPORT_CATEGORY_INFO.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenPayment('apoyo', 'Apoyo general al proyecto ($1.25 USD)', 1.25)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-terracotta-600 hover:from-rose-600 hover:to-terracotta-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Colaborar con el Proyecto ($1.25 USD)</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-700 bg-white/90 px-3.5 py-2.5 rounded-full border border-stone-200/90 shadow-2xs backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mercado Pago (ARS ~$1.925) o PayPal en USD</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-850 bg-emerald-50/95 px-3.5 py-2 rounded-full border border-emerald-200/80 shadow-2xs backdrop-blur-sm">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span><strong>Entrega inmediata:</strong> Desbloqueo en el calendario y descarga automática al confirmar el pago.</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50/95 px-3.5 py-2 rounded-full border border-amber-200/80 shadow-2xs backdrop-blur-sm">
              <span><strong>Política de devolución:</strong> Al ser un producto digital intangible, una vez que se descarga o desbloquea ya no se puede devolver.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARRA DE BÚSQUEDA */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
              Desbloqueo de Meses del Almanaque y Mantras Potenciados
            </h3>
            <p className="text-xs text-stone-500">
              Cada colaboración de $1.25 USD desbloquea el calendario de ese mes exclusivo o adquiere frases y anclas visuales.
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar mes o frase..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-sand-50/70 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: LOS 12 MESES (ENERO A DICIEMBRE CON FRASES AGRUPADAS) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-sand-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
              12
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                12 Meses del Almanaque (Enero a Diciembre)
              </h2>
              <p className="text-xs text-stone-600">
                Cada mes agrupa sus mantras y anclas visuales sagradas. Al colaborar por $1.25 se desbloquea el mes seleccionado (solo ese mes).
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-rose-800 rounded-full border border-rose-200 font-sans">
            $1.25 USD cada mes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonths.map(item => renderCard(item, true))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: FRASES SUELTAS (NUMERADAS DEL 1 EN ADELANTE) CON CANDADO */}
      {/* ========================================================================= */}
      {filteredLoose.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-200 flex items-center justify-center text-xs font-bold">
                8
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 flex items-center gap-2">
                  <span>8 Frases y Mantras Adicionales</span>
                  {!isLooseUnlocked && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>Candado Activo</span>
                    </span>
                  )}
                </h2>
                <p className="text-xs text-stone-600">
                  Frases independientes con sus anclas visuales y mantras sagrados. Desbloqueo programado para Octubre 2027 junto con el Calendario 2028.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-800 rounded-full border border-stone-200 font-sans">
              Frases 1 a 8
            </span>
          </div>

          {/* Banner pastel de paz, serenidad y candado de lanzamiento 2027-2028 */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sand-50 via-rose-50/70 to-amber-50/80 border border-amber-200/80 shadow-2xs space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-100/90 border border-amber-300/80 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs mt-0.5">
                <Lock className="w-4 h-4 text-amber-700" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                  Ciclo Sagrado de Desbloqueo: Octubre de 2027
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Cada una de las <strong>8 frases y mantras adicionales</strong> cuenta con un candado protector individual. En sintonía con el ritmo del amor propio, se desbloquearán oficialmente en <strong>Octubre de 2027</strong> junto con la apertura del <strong>Calendario 2028</strong>, guiando cada mes con serenidad y calma interior.
                </p>
                <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px] text-stone-600">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-sand-200 font-medium">
                    🌸 8 Candados individuales
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-sand-200 font-medium">
                    🕊️ Lanzamiento: 1 de Octubre 2027
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-sand-200 font-medium">
                    📅 Junto con Calendario 2028
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle de prueba discreto para el administrador colibricolibricolibri75@gmail.com */}
            {isAdmin && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-stone-700 font-medium">
                  👑 <strong>Acceso Maestro Administrador ({currentUser?.email}):</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setAdminForceLockTest(prev => !prev)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    adminForceLockTest
                      ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {adminForceLockTest 
                    ? '👁️ Estás viendo el MODO VISITANTE (Con Candados 🔒)' 
                    : '🔓 Estás en MODO ADMIN (Desbloqueado) - Clic para probar vista con candados'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoose.map(item => renderCard(item, false))}
          </div>
        </div>
      )}

      {/* Modal visor de imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del visor */}
            <div className="p-4 sm:px-6 flex items-center justify-between bg-stone-900 text-white gap-3">
              <div className="min-w-0">
                <span className="font-serif font-bold text-sm sm:text-base block truncate">
                  {selectedImage.title}
                </span>
                <span className="text-[11px] text-stone-300">
                  Ancla visual de meditación y presencia
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Imagen grande */}
            <div className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-auto p-2 sm:p-4 min-h-[300px]">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Pie del visor */}
            <div className="p-3 sm:px-6 bg-stone-100 flex items-center justify-between gap-3 text-xs text-stone-700">
              <span className="text-[11px] text-stone-500">
                Mantras y anclas visuales · Almanaque de Amor Propio
              </span>
              {selectedImage.originalUrl && (
                <a
                  href={selectedImage.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                  <span>Ver origen</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
