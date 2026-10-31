import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Youtube,
  Sparkles,
  Heart,
  Play,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Download,
  Clock,
  Calendar,
  ExternalLink,
  Volume2,
  RefreshCw,
  Info,
  Smartphone,
  Tablet,
  Laptop,
  Flame,
  Music,
  ArrowRight
} from 'lucide-react';
import { UserAccount, PaymentRecord } from '../../types';
import { isUserAuthorizedGuest } from '../utils/tierAccess';
import { YOUTUBE_GALLERY_CONFIG } from '../utils/paymentConfig';
import { YouTubeStickerIcon } from './SocialStickerIcons';

interface YouTubeGallerySectionProps {
  currentUser: UserAccount | null;
  onOpenPayment: (plan: 'youtube', customItemTitle?: string, customAmount?: number) => void;
  onShowToast?: (msg: string) => void;
  onGoToCalendar?: () => void;
}

export const YouTubeGallerySection: React.FC<YouTubeGallerySectionProps> = ({
  currentUser,
  onOpenPayment,
  onShowToast,
  onGoToCalendar
}) => {
  // 1. Verificación de compra / acceso del usuario
  const [hasPaidAccess, setHasPaidAccess] = useState<boolean>(() => {
    try {
      if (isUserAuthorizedGuest(currentUser)) return true;
      const stored = localStorage.getItem('almanaque_youtube_access');
      if (stored === 'true') return true;
      if (currentUser?.paymentHistory?.some(
        p => p.planId === 'youtube' || p.planName.toLowerCase().includes('youtube')
      )) {
        return true;
      }
    } catch (e) {
      console.warn('Error verificando acceso YouTube:', e);
    }
    return false;
  });

  // Simulación interactiva de fecha para que el autor pueda verificar el comportamiento de Preventa (2026) y Bloqueo 2027
  const [simulate2027, setSimulate2027] = useState<boolean>(false);

  // Fecha hito oficial: 1 de enero de 2027
  const UNLOCK_DATE_2027 = useMemo(() => new Date('2027-01-01T00:00:00'), []);

  // Lectura en tiempo real de la fecha del dispositivo del usuario
  const [currentDeviceDate, setCurrentDeviceDate] = useState<Date>(new Date());

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDeviceDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sincronizar compra con cambios en el usuario
  useEffect(() => {
    if (isUserAuthorizedGuest(currentUser)) {
      setHasPaidAccess(true);
      return;
    }
    if (currentUser?.paymentHistory?.some(
      p => p.planId === 'youtube' || p.planName.toLowerCase().includes('youtube')
    )) {
      setHasPaidAccess(true);
      try {
        localStorage.setItem('almanaque_youtube_access', 'true');
      } catch {}
    }
  }, [currentUser]);

  // Fecha efectiva (real del dispositivo o simulada para pruebas)
  const effectiveDate = simulate2027 ? new Date('2027-01-02T12:00:00') : currentDeviceDate;

  // Lógica temporal de bloqueo solicitada:
  // - Preventa (Antes del 01/01/2027): Reproductor funciona normal.
  // - A partir del 01/01/2027: Se activa de forma automática una capa invisible responsiva sobre la barra de controles de Elfsight
  //   para deshabilitar o bloquear el botón de 'Stop' o pausa, forzando la reproducción continua del video en celular, tablet y notebook.
  const isProtected2027Active = effectiveDate >= UNLOCK_DATE_2027;

  // Contador de cuenta regresiva hacia el 01/01/2027 (durante preventa)
  const countdown = useMemo(() => {
    const diff = UNLOCK_DATE_2027.getTime() - effectiveDate.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, arrived: false };
  }, [effectiveDate, UNLOCK_DATE_2027]);

  // Contenedor del widget de Elfsight
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);

  // Inserción y carga del script de Elfsight
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      try {
        if ((window as any).ElfsightApp?.init) {
          (window as any).ElfsightApp.init();
        }
      } catch (e) {
        console.warn('Elfsight init:', e);
      }
    }
  }, []);

  // Script en JavaScript nativo que detecta e intercepta pausas/stops a partir del 1 de enero de 2027
  useEffect(() => {
    if (!isProtected2027Active) return;

    // Escuchador nativo para capturar clics que intenten pausar o detener el reproductor
    const handlePotentialPauseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detectar elementos con atributos, clases o roles de pausa/stop
      const isPauseBtn = 
        target.closest('[aria-label*="paus" i]') ||
        target.closest('[title*="paus" i]') ||
        target.closest('[class*="pause" i]') ||
        target.closest('[aria-label*="stop" i]') ||
        target.closest('[title*="stop" i]') ||
        target.closest('[class*="stop" i]');

      if (isPauseBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (onShowToast) {
          onShowToast('🛡️ Reproducción continua protegida: Modo inmersión espiritual sin pausas activo.');
        }
      }
    };

    const container = widgetContainerRef.current;
    if (container) {
      container.addEventListener('click', handlePotentialPauseClick, true);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handlePotentialPauseClick, true);
      }
    };
  }, [isProtected2027Active, onShowToast]);

  const handlePurchaseClick = () => {
    onOpenPayment(
      'youtube',
      YOUTUBE_GALLERY_CONFIG.name,
      YOUTUBE_GALLERY_CONFIG.usdPrice
    );
  };

  const handleDownloadReceipt = () => {
    const payment = currentUser?.paymentHistory?.find(
      p => p.planId === 'youtube' || p.planName.toLowerCase().includes('youtube')
    );
    const txId = payment?.id || `YT_${Date.now()}`;
    const dateStr = payment?.date || new Date().toISOString().split('T')[0];
    
    const receiptContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
COMPROBANTE DE ACCESO: MÓDULO Y GALERÍA DE YOUTUBE ($1.75 USD)
========================================================================

ID de Transacción: ${txId}
Fecha de Emisión: ${dateStr}
Monto: $1.75 USD
Concepto: ${YOUTUBE_GALLERY_CONFIG.name}
Usuario: ${currentUser?.email || 'Usuario Registrado'}
Estado: Confirmado y Activo

POLÍTICA DE PRODUCTO DIGITAL:
Conforme al Art. 34 bis Ley 24.240 y directrices de intangibles digitales, este producto ofrece acceso informático inmediato y no admite devoluciones tras su descarga o habilitación.

LÓGICA TEMPORAL IMPLEMENTADA:
- 2026 (Preventa): Reproductor y controles operativos.
- A partir del 01/01/2027: Capa invisible responsiva protectora sobre la barra de controles para asegurar reproducción continua en celular, tablet y notebook.
- Botones de compra y descarga: 100% operativos permanentemente.

¡Gracias por sostener este camino de expansión y amor propio!
========================================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante_Acceso_YouTube_${txId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('📥 Comprobante digital de acceso a YouTube descargado con éxito.');
    }
  };

  const handleToggleSimulation = () => {
    const nextVal = !simulate2027;
    setSimulate2027(nextVal);
    if (onShowToast) {
      onShowToast(
        nextVal
          ? '✨ Simulación 2027 activada: Capa invisible protectora de reproducción continua activa'
          : '🕒 Reloj restaurado a Preventa (Fecha actual del dispositivo)'
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* =========================================================================
          ENCABEZADO PRINCIPAL DE LA SECCIÓN (ESPIRITUAL Y ESTÉTICO - IDÉNTICO A TIKTOK)
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/90 via-sand-100/95 to-amber-50/90 text-stone-900 shadow-lg border border-rose-200/80 p-6 sm:p-10">
        {/* Halos sagrados de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Badge espiritual y precio - Exactamente igual a TikTok */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-rose-300/80 text-rose-800 text-xs font-semibold backdrop-blur-md shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Reflexiones Diarias de Amor Propio en Video</span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
              $1.75 USD c/u
            </span>
          </div>

          {/* Título con ícono sticker de YouTube en tamaño medio, sacando la palabra - Formato idéntico a TikTok */}
          <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap sm:flex-nowrap pt-1">
            <YouTubeStickerIcon className="w-11 h-11 sm:w-12 sm:h-12" />
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              Reflexiones Diarias de Amor Propio
            </h1>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-stone-700 leading-relaxed font-sans">
            Un espacio sagrado e independiente con música y la energía transformadora para acompañar tu superación día a día
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-600 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-stone-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Acceso Aparte (No incluido en los 4 niveles tradicionales)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-stone-200/70">
              <Laptop className="w-3.5 h-3.5 text-rose-600" />
              Adaptable a Celular, Tablet y Notebook
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-stone-200/70">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Lógica Temporal: Enero 2027
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TARJETA DE ADQUISICIÓN Y BENEFICIOS (VISUAL Y NÚMERO DE COSTO IGUAL A TIKTOK) */}
      {/* ========================================================================= */}
      {!hasPaidAccess ? (
        <div className="bg-white/95 rounded-3xl border border-stone-200/80 shadow-md p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Youtube className="w-8 h-8 fill-white" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Desbloquea las Reflexiones Audiovisuales en YouTube
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Adquiere tu pase de acceso exclusivo a la galería completa de YouTube del Almanaque por solo{' '}
              <strong className="text-stone-900 font-semibold">$1.75 USD</strong>. Una pequeña contribución independiente que nutre tu paz interior y expande tu camino de auto-honra.
            </p>
          </div>

          {/* Tarjetas de beneficios del video */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-200/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Amor Propio Genuino</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mensajes que disuelven culpas y reprograman tu mente subconsciente en la certeza de ser suficiente.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-200/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Youtube className="w-5 h-5 fill-red-600" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Galería de Alta Fidelidad</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Reproducción de YouTube optimizada y fluida en cualquier dispositivo móvil o de escritorio.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-200/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Transición Continua 2027</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Actualmente en preventa abierta y a partir de 2027 con modo inmersivo continuo protegido.
              </p>
            </div>
          </div>

          {/* Tarjeta de precio y botón de compra - EXACTA A TIKTOK */}
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 text-white text-center shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-widest uppercase text-rose-300">
                Aporte Único e Independiente
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">$1.75</span>
                <span className="text-sm font-semibold text-stone-400">USD</span>
              </div>
              <p className="text-xs text-stone-400">
                Equivalente aproximado en moneda local (ARS en Mercado Pago / USD en PayPal y tarjetas)
              </p>
            </div>

            <button
              onClick={handlePurchaseClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-rose-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Adquirir Acceso por $1.75 USD</span>
              <ExternalLink className="w-5 h-5" />
            </button>

            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pasarela Segura SSL
              </span>
              <span>• Mercado Pago (Argentina)</span>
              <span>• PayPal & Tarjetas (Global)</span>
              <span>• Comprobante descargable</span>
            </div>
          </div>
        </div>
      ) : (
        /* Estado de compra confirmada (acorde con TikTok) */
        <div className="bg-white/95 rounded-3xl border border-rose-200/90 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Acceso a Galería YouTube Habilitado
                </h3>
                <p className="text-xs text-stone-600">
                  Transacción de $1.75 USD confirmada · Acceso independiente activo
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Comprobante ($1.75 USD)</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANEL DE ESTADO TEMPORAL Y LÓGICA DE CONTROL (ENERO 2027)
         ========================================================================= */}
      <section className="bg-stone-900/60 backdrop-blur-md border border-stone-800/80 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm sm:text-base font-semibold text-stone-200">
                Lógica Temporal Automatizada (Corte 01/01/2027)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              {isProtected2027Active ? (
                <span className="text-amber-300 font-medium">
                  🛡️ Modo Continuo Activo: Se encuentra activa la capa invisible responsiva que bloquea el botón de pausa/stop para forzar la reproducción ininterrumpida sin obstruir compras ni descargas.
                </span>
              ) : (
                <span>
                  ✨ Modo Preventa Activo ({effectiveDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}): El reproductor opera normalmente y los botones de compra y descarga están completamente operativos. Faltan <strong className="text-amber-300">{countdown.days} días, {countdown.hours}h {countdown.minutes}m</strong> para la transición a reproducción continua.
                </span>
              )}
            </p>
          </div>

          {/* Botón de simulación para que el creador compruebe ambos estados inmediatamente */}
          <div className="shrink-0 flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={handleToggleSimulation}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                simulate2027
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title="Alternar entre fecha real del dispositivo y simulación de Enero 2027"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulate2027 ? 'animate-spin' : ''}`} />
              {simulate2027 ? 'Modo 2027 Simulado' : 'Probar Bloqueo 2027'}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTENEDOR ADAPTABLE DEL REPRODUCTOR (CELULAR, TABLET, NOTEBOOK)
          CON CÓDIGO EMBED DE ELFSIGHT Y CAPA INVISIBLE RESPONSIVA
         ========================================================================= */}
      <section className="space-y-4">
        {/* Barra superior del reproductor con indicadores y botones de acción */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span>Elfsight YouTube Gallery · Feed Oficial</span>
            {isProtected2027Active && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                Reproducción Continua Protegida
              </span>
            )}
          </div>

          {/* Botones de acción alineados (Compra y Descarga libres de obstrucción) */}
          <div className="flex items-center gap-2">
            {!hasPaidAccess ? (
              <button
                onClick={handlePurchaseClick}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                Comprar Acceso ($1.75 USD)
              </button>
            ) : (
              <button
                onClick={handleDownloadReceipt}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Comprobante
              </button>
            )}

            {onGoToCalendar && (
              <button
                onClick={onGoToCalendar}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition cursor-pointer"
              >
                Volver al Calendario
              </button>
            )}
          </div>
        </div>

        {/* 
          Marco exterior del reproductor:
          100% responsivo usando Flexbox/Grid con adaptación a Celular, Tablet y Notebook,
          con marco espiritual armónico con el Almanaque
        */}
        <div 
          ref={widgetContainerRef}
          className="relative w-full rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-stone-800 shadow-2xl overflow-hidden p-3 sm:p-5 md:p-6"
        >
          {/* Sutiles halos de fondo para realzar la estética espiritual del Almanaque sin tapar el video */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          {/* ===================================================================
              INSERCIÓN DIRECTA DEL CÓDIGO EMBED DE ELFSIGHT YOUTUBE GALLERY
              <!-- Elfsight YouTube Gallery | Untitled YouTube Gallery -->
              <script src="https://elfsightcdn.com/platform.js" async></script>
              <div class="elfsight-app-d3f035eb-ca5f-4c91-9541-98973d6fe4e4" data-elfsight-app-lazy></div>
             =================================================================== */}
          <div className="w-full min-h-[380px] sm:min-h-[480px] md:min-h-[580px] flex items-center justify-center relative">
            <div 
              className="elfsight-app-d3f035eb-ca5f-4c91-9541-98973d6fe4e4 w-full"
              data-elfsight-app-lazy
            />

            {/*
              CAPA INVISIBLE RESPONSIVA (Activada a partir del 01/01/2027)
              Esta capa se posiciona específicamente sobre la barra inferior de controles
              de Elfsight para deshabilitar o bloquear el botón de 'Stop' o pausa,
              forzando la reproducción continua sin obstruir los botones de compra ni de descarga.
            */}
            {isProtected2027Active && (
              <div
                id="youtube-pause-guard-layer-2027"
                title="Reproducción continua activada - Pausa deshabilitada para inmersión continua"
                className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-auto cursor-not-allowed select-none bg-transparent"
                style={{
                  touchAction: 'none'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onShowToast) {
                    onShowToast('🛡️ Reproducción continua protegida: Botón de pausa deshabilitado según programación 2027.');
                  }
                }}
              >
                {/* Micro indicador sutil de protección en la esquina inferior */}
                <div className="absolute bottom-2 right-3 pointer-events-none opacity-40 hover:opacity-100 transition text-[10px] text-stone-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Protección Continua 2027</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            BARRA INFERIOR DE ACCIONES Y COMPROMISO ÉTICO/LEGAL
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-stone-900/40 border border-stone-800/60 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-stone-300">
              <p className="font-semibold text-stone-200">Compatibilidad 100% AWS</p>
              <p className="text-stone-400 leading-relaxed font-light">
                Diseñado como código estático universal HTML5, CSS y JS, listo para alojarse en Amazon S3, CloudFront o Amplify en la Capa Gratuita.
              </p>
            </div>
          </div>

          <div className="bg-stone-900/40 border border-stone-800/60 rounded-xl p-4 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-stone-300">
              <p className="font-semibold text-stone-200">Audio y Video de Alta Fidelidad</p>
              <p className="text-stone-400 leading-relaxed font-light">
                Transmisión directa desde YouTube en alta definición con frecuencias sonoras limpias para acompañar la lectura del diario.
              </p>
            </div>
          </div>

          <div className="bg-stone-900/40 border border-stone-800/60 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-stone-300">
              <p className="font-semibold text-stone-200">Compra Segura y Descarga</p>
              <p className="text-stone-400 leading-relaxed font-light">
                Estructura de pago unificada ($1.75 USD) con generación inmediata de comprobante digital y auditoría de descarga.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
