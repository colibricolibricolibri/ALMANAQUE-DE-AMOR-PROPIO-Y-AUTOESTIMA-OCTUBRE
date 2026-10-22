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
  CreditCard, 
  Wallet, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { SUPPORT_CATEGORY_INFO, SUPPORT_PROJECT_ITEMS, SupportProjectItem } from '../data/supportProjectData';
import { PlanCategory, PaymentRecord, UserAccount } from '../../types';

interface SupportProjectSectionProps {
  currentUser: UserAccount | null;
  onOpenPayment: (plan: 'apoyo', customItemTitle?: string, customAmount?: number) => void;
  onShowToast?: (msg: string) => void;
}

export const SupportProjectSection: React.FC<SupportProjectSectionProps> = ({
  currentUser,
  onOpenPayment,
  onShowToast
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

  const getItemKey = (item: SupportProjectItem) => item.id || `${item.number}-${item.title}`;

  // Filtrado de mantras
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SUPPORT_PROJECT_ITEMS;
    return SUPPORT_PROJECT_ITEMS.filter(it => 
      it.number.toString().includes(q) ||
      it.title.toLowerCase().includes(q) ||
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
    navigator.clipboard?.writeText(`${item.number} ${item.title}`);
    setCopiedId(itemKey);
    if (onShowToast) {
      onShowToast(`✨ Copiado: ${item.number} ${item.title}`);
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* ========================================================================= */}
      {/* HERO BANNER DE LA CATEGORÍA - TONOS CÁLIDOS DE PAZ, CALMA Y AMOR */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/90 via-sand-100/95 to-amber-50/90 text-stone-900 shadow-md border border-rose-200/80 p-6 sm:p-10">
        {/* Adornos sutiles de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-rose-300/80 text-rose-800 text-xs font-semibold backdrop-blur-md shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Colaboración Solidaria Independiente</span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
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
              <span>Mercado Pago (ARS $1.540) o PayPal (+6%)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-850 bg-emerald-50/95 px-3.5 py-2 rounded-full border border-emerald-200/80 shadow-2xs backdrop-blur-sm">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span><strong>Método de entrega:</strong> Descarga digital automática e inmediata al abonar.</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50/95 px-3.5 py-2 rounded-full border border-amber-200/80 shadow-2xs backdrop-blur-sm">
              <span><strong>Política de devolución:</strong> Al ser un producto digital, una vez que se descarga ya no se puede devolver.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARRA DE BÚSQUEDA Y TOTALES */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
              Catálogo de Mantras Potenciados
            </h3>
            <p className="text-xs text-stone-500">
              Cada mantra incluye sus anclas visuales de paisajes reales y ojos de amor a solo $1.25 USD cada uno.
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
            placeholder="Buscar por número o nombre..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-sand-50/70 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GRID DE MANTRAS INDIVIDUALES CON SU PRECIO */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredItems.map((item) => {
          const itemKey = getItemKey(item);
          const currentImgIndex = activeImageIndices[itemKey] || 0;
          const currentImg = item.images[currentImgIndex] || item.images[0];

          return (
            <div
              key={itemKey}
              id={`mantra-item-${itemKey}`}
              className="group bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              {/* Header de la tarjeta */}
              <div className="p-4 pb-3 flex items-center justify-between border-b border-stone-100 bg-gradient-to-r from-sand-50/80 via-white to-sand-50/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-terracotta-600 text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                    {item.number}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-tight truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-stone-500 font-medium truncate block">
                      {item.subtitle || 'Ancla Visual & Mantra'}
                    </span>
                  </div>
                </div>

                {/* Precio Individual */}
                <div className="text-right shrink-0 ml-2">
                  <div className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
                    ${item.price.toFixed(2)} USD
                  </div>
                  <span className="text-[9px] text-stone-400 block mt-0.5">
                    ARS $1.925
                  </span>
                </div>
              </div>

              {/* Selector de tipo de imagen (Frases vs Aclaración) */}
              {item.images.length > 1 && (
                <div className="flex bg-sand-50/90 border-b border-stone-150 p-1.5 gap-1.5">
                  {item.images.map((img, idx) => {
                    const isFrases = idx === 0;
                    const label = isFrases 
                      ? '1. Frases (3x)' 
                      : (idx === 1 ? '2. Aclaración' : `3. Aclaración ${idx}`);
                    const isActive = idx === currentImgIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectImageIndex(itemKey, idx);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-rose-50 text-rose-700 shadow-2xs font-bold border border-rose-200'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-white/90'
                        }`}
                        title={isFrases ? 'Ver imagen con las 3 frases del mantra' : 'Ver imagen con la aclaración y significado'}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Imagen principal interactiva con fondo suave y sereno */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-sand-100/90 via-stone-100/80 to-rose-50/60 overflow-hidden cursor-pointer border-y border-stone-100">
                {/* Badge de tipo de imagen actual */}
                <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-[10px] font-bold border border-rose-200/80 shadow-xs flex items-center gap-1 pointer-events-none">
                  {currentImgIndex === 0 ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>1. Frases del Mantra (3x)</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3 h-3 text-rose-600" />
                      <span>{currentImgIndex === 1 ? '2. Aclaración y Significado' : '3. Aclaración Complementaria'}</span>
                    </>
                  )}
                </div>

                {(() => {
                  const imgKey = `${itemKey}-${currentImgIndex}`;
                  const hasDirectFile = currentImg?.directUrl && 
                    (currentImg.directUrl.includes('i.ibb.co') || currentImg.directUrl.startsWith('/assets') || currentImg.directUrl.startsWith('/images') || currentImg.directUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)) &&
                    !imageErrors[imgKey];

                  if (hasDirectFile) {
                    return (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        {/* Fondo ambiental difuminado para llenar el marco con suavidad */}
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
                          alt={`${item.number} - ${item.title}`}
                          referrerPolicy="no-referrer"
                          className="relative z-10 max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                          loading="lazy"
                          onError={(e) => {
                            if (item.number === 34 && !e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/campanita_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            if (item.number === 35 && !e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/hawai_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            if (item.number === 36 && !e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/poi_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            if (item.number === 37 && !e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/lavanda_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            if (item.number === 38 && !e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/llama_violeta_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            if (item.number === 39 && !e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/arco_iris_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            if (!e.currentTarget.src.includes('/images/support/')) {
                              e.currentTarget.src = `/images/support/item_${item.number}_${currentImgIndex + 1}.jpg`;
                              return;
                            }
                            setImageErrors(prev => ({ ...prev, [imgKey]: true }));
                          }}
                          onClick={() => setSelectedImage({
                            url: currentImg.directUrl,
                            originalUrl: currentImg.originalUrl,
                            title: item.title,
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
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-rose-50/80 via-sand-50 to-amber-50/70 text-stone-800 space-y-2 select-none group/placeholder"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-rose-100/70 border border-rose-200/80 flex items-center justify-center text-rose-600 group-hover/placeholder:scale-110 transition-transform shadow-2xs">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-0.5 max-w-[200px]">
                        <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-stone-600 block">
                          {currentImgIndex === 0 ? '✨ Frases del Mantra (3x)' : '📖 Aclaración y Significado'}
                        </span>
                      </div>
                      {currentImg?.originalUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full border border-rose-200/80">
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Ver enlace original</span>
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Botón para ampliar imagen suave */}
                <button
                  type="button"
                  onClick={() => setSelectedImage({
                    url: currentImg?.directUrl || '',
                    originalUrl: currentImg?.originalUrl,
                    title: item.title,
                    itemNumber: item.number,
                    subIndex: currentImgIndex
                  })}
                  className="absolute bottom-2.5 left-2.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-rose-700 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-stone-200/80"
                >
                  <Eye className="w-3.5 h-3.5 text-rose-500" />
                  <span>Ampliar {currentImgIndex === 0 ? 'Frases' : 'Aclaración'}</span>
                </button>

                {/* Selector rápido en la esquina inferior derecha */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full border border-stone-200/80 shadow-xs">
                    {item.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectImageIndex(itemKey, idx);
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                          idx === currentImgIndex
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                        }`}
                        title={idx === 0 ? 'Ver 1. Frases (3x)' : 'Ver 2. Aclaración'}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pie de la tarjeta con acciones de compra */}
              <div className="p-4 space-y-3 mt-auto bg-white">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.images.length} {item.images.length === 1 ? 'ancla visual' : 'anclas visuales'}</span>
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

                {/* Botón principal de compra / apoyo individual */}
                <button
                  onClick={() => onOpenPayment('apoyo', `Mantra #${item.number}: ${item.title} ($1.25 USD)`, item.price)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-terracotta-600 hover:from-rose-600 hover:to-terracotta-700 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-200 fill-white group-hover/btn:scale-110 transition-transform" />
                  <span>Adquirir este Mantra · ${item.price.toFixed(2)} USD</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-100 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 space-y-3 shadow-xs">
          <p className="font-serif text-lg text-stone-800">
            No se encontraron mantras con el término "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-rose-600 font-semibold underline underline-offset-4"
          >
            Limpiar búsqueda y ver todos los {SUPPORT_PROJECT_ITEMS.length} mantras
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE LIGHTBOX / IMAGEN EN ALTA RESOLUCIÓN (SUAVE Y TRANQUILO) */}
      {/* ========================================================================= */}
      {selectedImage && (() => {
        const activeModalItem = SUPPORT_PROJECT_ITEMS.find(it => it.number === selectedImage.itemNumber);
        const modalImages = activeModalItem?.images || [];
        const totalModalImages = modalImages.length;

        const handleSwitchModalImage = (nextIdx: number) => {
          if (!activeModalItem || totalModalImages === 0) return;
          const targetImg = modalImages[nextIdx];
          setSelectedImage({
            url: targetImg.directUrl,
            originalUrl: targetImg.originalUrl,
            title: activeModalItem.title,
            itemNumber: activeModalItem.number,
            subIndex: nextIdx
          });
        };

        return (
          <div 
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl w-full max-h-[92vh] bg-sand-50 rounded-3xl overflow-hidden border border-sand-200/90 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del lightbox con paleta serena y clara */}
              <div className="p-3.5 sm:p-4 bg-white/95 border-b border-sand-200/80 flex flex-wrap items-center justify-between gap-3 text-sand-900">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-terracotta-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    #{selectedImage.itemNumber}
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base leading-tight text-sand-900">
                      {selectedImage.title}
                    </h3>
                    <span className="text-[11px] text-rose-700 font-medium">
                      {selectedImage.subIndex === 0 
                        ? '✨ Imagen 1: Frases del Mantra (se repite 3 veces)' 
                        : (selectedImage.subIndex === 1 
                            ? '📖 Imagen 2: Aclaración y Significado' 
                            : '🌱 Imagen 3: Aclaración Complementaria')}
                    </span>
                  </div>
                </div>

                {/* Selector de sub-imagen dentro del modal */}
                {totalModalImages > 1 && (
                  <div className="flex items-center gap-1.5 bg-sand-100/90 p-1 rounded-xl border border-sand-200/90">
                    {modalImages.map((img, idx) => {
                      const isFrases = idx === 0;
                      const label = isFrases ? '1. Frases (3x)' : (idx === 1 ? '2. Aclaración' : `3. Aclaración ${idx}`);
                      const isActive = idx === selectedImage.subIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSwitchModalImage(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-rose-600 text-white shadow-xs font-bold'
                              : 'text-sand-700 hover:text-sand-950 hover:bg-white'
                          }`}
                        >
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {selectedImage.originalUrl && (
                    <a
                      href={selectedImage.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-700 text-xs transition-colors"
                      title="Ver enlace original en ImgBB"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-700 hover:text-sand-950 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Visualización de la imagen con fondo suave y flechas de navegación */}
              <div className="relative flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-sand-100/80 via-white to-sand-100/80 min-h-[50vh]">
                {/* Flechas anterior / siguiente si tiene más de 1 imagen */}
                {totalModalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSwitchModalImage((selectedImage.subIndex - 1 + totalModalImages) % totalModalImages)}
                      className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-rose-600 hover:text-white text-sand-800 transition-all backdrop-blur-md cursor-pointer border border-sand-200/90 z-30 shadow-md group"
                      title="Ver imagen anterior"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchModalImage((selectedImage.subIndex + 1) % totalModalImages)}
                      className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-rose-600 hover:text-white text-sand-800 transition-all backdrop-blur-md cursor-pointer border border-sand-200/90 z-30 shadow-md group"
                      title="Ver siguiente imagen"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </>
                )}

                {selectedImage.url && (selectedImage.url.includes('i.ibb.co') || selectedImage.url.startsWith('/assets') || selectedImage.url.startsWith('/images') || selectedImage.url.match(/\.(jpg|jpeg|png|webp|gif)/i)) ? (
                  <div className="relative flex items-center justify-center max-h-[70vh] w-full">
                    {/* Badge sobre la foto en el modal con estilo suave */}
                    <div className="absolute top-2 left-2 z-20 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-850 text-xs font-bold border border-rose-200/90 shadow-sm">
                      {selectedImage.subIndex === 0 ? '✨ 1. Frases del Mantra (3x)' : '📖 2. Aclaración y Significado'}
                    </div>

                    <img
                      key={`modal-${selectedImage.url}-${selectedImage.subIndex}`}
                      src={selectedImage.url}
                      alt={selectedImage.title}
                      referrerPolicy="no-referrer"
                      className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-xl border border-stone-200/60"
                      onError={(e) => {
                        if (selectedImage.itemNumber === 34 && !e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/campanita_${selectedImage.subIndex + 1}.jpg`;
                        } else if (selectedImage.itemNumber === 35 && !e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/hawai_${selectedImage.subIndex + 1}.jpg`;
                        } else if (selectedImage.itemNumber === 36 && !e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/poi_${selectedImage.subIndex + 1}.jpg`;
                        } else if (selectedImage.itemNumber === 37 && !e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/lavanda_${selectedImage.subIndex + 1}.jpg`;
                        } else if (selectedImage.itemNumber === 38 && !e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/llama_violeta_${selectedImage.subIndex + 1}.jpg`;
                        } else if (selectedImage.itemNumber === 39 && !e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/arco_iris_${selectedImage.subIndex + 1}.jpg`;
                        } else if (!e.currentTarget.src.includes('/images/support/')) {
                          e.currentTarget.src = `/images/support/item_${selectedImage.itemNumber}_${selectedImage.subIndex + 1}.jpg`;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="max-w-md w-full p-8 text-center bg-white/95 rounded-3xl border border-sand-200/90 space-y-4 text-sand-900 shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100/70 border border-rose-200/80 flex items-center justify-center mx-auto text-rose-600 shadow-2xs">
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-sand-900">
                        Mantra #{selectedImage.itemNumber}: {selectedImage.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {selectedImage.subIndex === 0 ? '✨ Frases del Mantra (se repite 3 veces)' : '📖 Aclaración y Significado del Mantra'}
                      </p>
                    </div>
                    {selectedImage.originalUrl && (
                      <div className="pt-2">
                        <a
                          href={selectedImage.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-semibold shadow-md hover:scale-105 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Abrir enlace en ImgBB</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer con botón de compra rápida */}
              <div className="p-3.5 sm:p-4 bg-white/95 border-t border-sand-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-sand-800">
                <span className="text-xs text-stone-600">
                  Mantras potenciados como ojos de amor con paisajes reales · <strong className="text-rose-700">$1.25 USD</strong>
                </span>

                <button
                  onClick={() => {
                    const num = selectedImage.itemNumber;
                    const title = selectedImage.title;
                    setSelectedImage(null);
                    onOpenPayment('apoyo', `Mantra #${num}: ${title} ($1.25 USD)`, 1.25);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-terracotta-600 hover:from-rose-600 hover:to-terracotta-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Adquirir este Mantra · $1.25 USD</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
