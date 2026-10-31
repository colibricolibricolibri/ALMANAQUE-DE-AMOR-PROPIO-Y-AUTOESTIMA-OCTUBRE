import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Heart,
  Video,
  Play,
  Clock,
  Calendar,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Music,
  ExternalLink,
  Volume2,
  Compass,
  ArrowRight,
  Eye,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { UserAccount, PaymentRecord } from '../../types';
import { isUserAuthorizedGuest } from '../utils/tierAccess';
import { TIKTOK_VIDEOS_CONFIG } from '../utils/paymentConfig';
import { TikTokStickerIcon } from './SocialStickerIcons';

interface TikTokSectionProps {
  currentUser: UserAccount | null;
  onOpenPayment: (plan: 'tiktok', customItemTitle?: string, customAmount?: number) => void;
  onShowToast?: (msg: string) => void;
  onGoToCalendar?: () => void;
}

export const TikTokSection: React.FC<TikTokSectionProps> = ({
  currentUser,
  onOpenPayment,
  onShowToast,
  onGoToCalendar
}) => {
  // 1. Estado de Compra / Acceso del usuario
  // Se verifica en el historial de pagos del usuario o en el almacenamiento local persistente
  const [hasPaidAccess, setHasPaidAccess] = useState<boolean>(() => {
    try {
      if (isUserAuthorizedGuest(currentUser)) return true;
      const stored = localStorage.getItem('almanaque_tiktok_access');
      if (stored === 'true') return true;
      if (currentUser?.paymentHistory?.some(
        p => p.planId === 'tiktok' || p.planName.toLowerCase().includes('tiktok')
      )) {
        return true;
      }
    } catch (e) {
      console.warn('Error leyendo acceso TikTok:', e);
    }
    return false;
  });

  // Simulación opcional de fecha para que el autor pueda verificar el widget hoy mismo sin alterar la fecha real
  const [simulateFutureDate, setSimulateFutureDate] = useState<boolean>(false);

  // Fecha de liberación oficial exigida: 1 de enero de 2027 a las 00:00:00
  const UNLOCK_DATE = useMemo(() => new Date('2027-01-01T00:00:00'), []);

  // Lectura en tiempo real de la fecha del dispositivo del usuario
  const [currentDeviceDate, setCurrentDeviceDate] = useState<Date>(new Date());

  // Actualizar el reloj cada segundo para el contador de cuenta regresiva
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
      p => p.planId === 'tiktok' || p.planName.toLowerCase().includes('tiktok')
    )) {
      setHasPaidAccess(true);
      try {
        localStorage.setItem('almanaque_tiktok_access', 'true');
      } catch (e) {
        // ignore
      }
    }
  }, [currentUser]);

  // Cálculo de desbloqueo:
  // Si la fecha del dispositivo es anterior al 01/01/2027 y no se está simulando el futuro: está bloqueado
  const effectiveDate = simulateFutureDate ? new Date('2027-01-01T12:00:00') : currentDeviceDate;
  const isLocked = effectiveDate < UNLOCK_DATE;

  // Cálculo de cuenta regresiva hasta el 01/01/2027
  const countdown = useMemo(() => {
    const diff = UNLOCK_DATE.getTime() - effectiveDate.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, completed: false };
  }, [effectiveDate, UNLOCK_DATE]);

  // Inserción y ejecución dinámica del script de Elfsight cuando el widget debe mostrarse
  useEffect(() => {
    if (hasPaidAccess && !isLocked) {
      // Inyectar script si no existe
      const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // Si ya está presente, solicitar reinicialización del contenedor
        try {
          if ((window as any).ElfsightApp?.init) {
            (window as any).ElfsightApp.init();
          }
        } catch (e) {
          console.warn('ElfsightApp init error:', e);
        }
      }
    }
  }, [hasPaidAccess, isLocked]);

  const handlePurchaseClick = () => {
    onOpenPayment(
      'tiktok',
      TIKTOK_VIDEOS_CONFIG.name,
      TIKTOK_VIDEOS_CONFIG.usdPrice
    );
  };

  const handleToggleSimulation = () => {
    const nextState = !simulateFutureDate;
    setSimulateFutureDate(nextState);
    if (onShowToast) {
      onShowToast(
        nextState
          ? '✨ Simulación activada: Previsualizando liberación automática del 01/01/2027'
          : '🕒 Reloj restaurado a la fecha actual de tu dispositivo'
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* ========================================================================= */}
      {/* CONTENEDOR ESTÉTICO Y ESPIRITUAL - ARMONÍA CON EL ALMANAQUE               */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100/90 via-sand-100/95 to-amber-50/90 text-stone-900 shadow-lg border border-rose-200/80 p-6 sm:p-10">
        {/* Halos sagrados de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Badge espiritual y precio */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-rose-300/80 text-rose-800 text-xs font-semibold backdrop-blur-md shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Reflexiones Diarias de Amor Propio en Video</span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
              $1.75 USD c/u
            </span>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap sm:flex-nowrap pt-1">
            <TikTokStickerIcon className="w-11 h-11 sm:w-12 sm:h-12" />
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
              <Music className="w-3.5 h-3.5 text-rose-600" />
              Música y Video Nativo en Alta Calidad
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-stone-200/70">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Liberación Programada: 01/01/2027
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASO A: EL USUARIO AÚN NO HA ADQUIRIDO EL ACCESO ($1.75 USD)             */}
      {/* ========================================================================= */}
      {!hasPaidAccess && (
        <div className="bg-white/95 rounded-3xl border border-stone-200/80 shadow-md p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Video className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Desbloquea las Reflexiones Diarias en Video
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Adquiere tu pase de acceso exclusivo a los videos diarios que publico en TikTok por solo{' '}
              <strong className="text-stone-900 font-semibold">$1.75 USD</strong>. Una pequeña contribución que nutre tu paz interior y sostiene este hermoso trabajo independiente.
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
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Música de Alta Calidad</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sonido envolvente y frecuencias armónicas sincronizadas con cada reflexión en video.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/80 border border-sand-200/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Activación Automática</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tu compra queda registrada y guardada para activarse de forma instantánea el 01/01/2027.
              </p>
            </div>
          </div>

          {/* Tarjeta de precio y botón de compra */}
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
              <ArrowRight className="w-5 h-5" />
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
      )}

      {/* ========================================================================= */}
      {/* CASO B: EL USUARIO YA HA PAGADO ($1.75 USD)                               */}
      {/* ========================================================================= */}
      {hasPaidAccess && (
        <div className="space-y-8">
          {/* --------------------------------------------------------------------- */}
          {/* CONDICIÓN 1: FECHA ANTERIOR AL 01/01/2027 (BLOQUEO AUTOMÁTICO)        */}
          {/* Muestra exactamente el mensaje de espera exigido                      */}
          {/* --------------------------------------------------------------------- */}
          {isLocked ? (
            <div className="bg-white/95 rounded-3xl border border-rose-200/90 shadow-md p-6 sm:p-10 space-y-8 animate-fadeIn">
              {/* Insignia de confirmación de pago */}
              <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">Compra Confirmada con Éxito</h3>
                    <p className="text-xs text-stone-500">Pase a Reflexiones Diarias de Amor Propio ($1.75 USD) registrado</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>En espera de activación programada</span>
                </div>
              </div>

              {/* CONTENEDOR PRINCIPAL DEL MENSAJE DE ESPERA EXIGIDO */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 text-white p-6 sm:p-10 text-center shadow-lg space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>

                {/* TEXTO EXACTO ESPECIFICADO POR EL USUARIO */}
                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-snug max-w-2xl mx-auto">
                  ¡Gracias por tu compra! Tus videos diarios de almanaque de amor propio se activarán automáticamente el 01/01/2027
                </h2>

                <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl mx-auto leading-relaxed">
                  Tu acceso ya está asegurado y validado en la plataforma. En la fecha exacta del 1 de enero de 2027, el sistema 
                  liberará de forma nativa e inmediata el reproductor de TikTok con todas las reflexiones de video y música.
                </p>

                {/* Reloj y Cuenta Regresiva Espiritual */}
                <div className="pt-6">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-rose-200 mb-3">
                    Tiempo Restante para la Activación Automática
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <span className="block font-mono text-xl sm:text-3xl font-bold">{countdown.days}</span>
                      <span className="text-[10px] text-rose-100 uppercase tracking-wider">Días</span>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <span className="block font-mono text-xl sm:text-3xl font-bold">{countdown.hours}</span>
                      <span className="text-[10px] text-rose-100 uppercase tracking-wider">Horas</span>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <span className="block font-mono text-xl sm:text-3xl font-bold">{countdown.minutes}</span>
                      <span className="text-[10px] text-rose-100 uppercase tracking-wider">Min</span>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <span className="block font-mono text-xl sm:text-3xl font-bold">{countdown.seconds}</span>
                      <span className="text-[10px] text-rose-100 uppercase tracking-wider">Seg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de Amor Propio y Paciencia Consciente */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-stone-900 mb-1">
                    Mantra de Paciencia y Autoestima en la Espera:
                  </strong>
                  &ldquo;Honro los tiempos de mi proceso. Todo llega en el orden divino perfecto. Cada día de este almanaque prepara mi corazón para recibir la luz y el amor que merezco.&rdquo;
                </div>
              </div>

              {/* Herramienta de Comprobación para el Administrador / Usuario */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    Fecha leída en tu dispositivo: <strong>{currentDeviceDate.toLocaleDateString()} {currentDeviceDate.toLocaleTimeString()}</strong>
                  </span>
                </div>

                <button
                  onClick={handleToggleSimulation}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  title="Permite al autor verificar la integración del widget de TikTok hoy mismo"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                  <span>{simulateFutureDate ? 'Volver a fecha real' : 'Probar activación (Simular 2027)'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* --------------------------------------------------------------------- */
            /* CONDICIÓN 2: FECHA A PARTIR DEL 01/01/2027 (LIBERACIÓN AUTOMÁTICA)    */
            /* El mensaje de espera desaparece automáticamente y se despliega el      */
            /* contenedor del widget de TikTok de Elfsight con reproducción nativa   */
            /* --------------------------------------------------------------------- */
            <div className="space-y-6 animate-fadeIn">
              {/* Banner de Bienvenida y Activación Exitosa */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      ¡Reflexiones Diarias de Amor Propio Activadas y en Vivo!
                    </h3>
                    <p className="text-xs text-emerald-100">
                      Disfruta de las reflexiones diarias y música en alta calidad desde el reproductor nativo.
                    </p>
                  </div>
                </div>

                {simulateFutureDate && (
                  <button
                    onClick={handleToggleSimulation}
                    className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
                  >
                    Desactivar simulación (Volver a fecha actual)
                  </button>
                )}
              </div>

              {/* ================================================================= */}
              {/* CONTENEDOR EXACTO DEL WIDGET DE TIKTOK (CÓDIGO EMBED DE ELFSIGHT) */}
              {/* ================================================================= */}
              <div className="bg-stone-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-stone-800 text-white overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-semibold text-stone-200">Reproductor Oficial de TikTok</span>
                    <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full text-[10px]">
                      Audio & Video Nativo
                    </span>
                  </div>

                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <span>TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* --------------------------------------------------------------- */}
                {/* INSERCIÓN DIRECTA DEL CÓDIGO DE ELFSIGHT:                       */}
                {/* <!-- Elfsight TikTok Feed | Untitled TikTok Feed -->             */}
                {/* <script src="https://elfsightcdn.com/platform.js" async></script>*/}
                {/* <div class="elfsight-app-e45ac617-c047-4158-b80d-db2923acd073" data-elfsight-app-lazy></div> */}
                {/* --------------------------------------------------------------- */}
                <div className="min-h-[450px] w-full flex flex-col items-center justify-center relative">
                  {/* Contenedor del Widget Elfsight */}
                  <div
                    className="elfsight-app-e45ac617-c047-4158-b80d-db2923acd073 w-full"
                    data-elfsight-app-lazy
                  />

                  {/* Mensaje de respaldo estético si la red del cliente tarda en conectar con el CDN */}
                  <div className="text-center py-6 text-stone-400 text-xs space-y-2">
                    <div className="flex items-center justify-center gap-2 text-rose-400">
                      <Music className="w-4 h-4 animate-bounce" />
                      <span>Sincronizando reflexiones diarias y música de alta calidad...</span>
                    </div>
                    <p className="text-[11px] text-stone-500 max-w-md mx-auto">
                      Si el feed no aparece en unos segundos, asegúrate de no tener bloqueadores de anuncios o extensiones que bloqueen scripts de terceros.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NAVEGACIÓN Y RETORNO AL ALMANAQUE                                         */}
      {/* ========================================================================= */}
      {onGoToCalendar && (
        <div className="text-center pt-4">
          <button
            onClick={onGoToCalendar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-rose-600" />
            <span>Volver al Calendario Diario</span>
          </button>
        </div>
      )}
    </div>
  );
};
