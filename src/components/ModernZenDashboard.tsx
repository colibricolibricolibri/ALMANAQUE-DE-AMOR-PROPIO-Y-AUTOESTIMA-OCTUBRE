import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Bell, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Wind, 
  Compass, 
  CheckCircle2, 
  Circle, 
  Droplets, 
  Plus, 
  Minus, 
  Camera, 
  LayoutGrid, 
  Sliders, 
  SunMedium, 
  Eye, 
  Share2,
  Maximize2,
  Minimize2,
  Smartphone,
  Quote,
  User,
  CreditCard,
  Wallet,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Headphones,
  Lock,
  Crown,
  Gift,
  Video,
  ExternalLink,
  Wifi
} from 'lucide-react';
import { DayContent, Language, CountryTimezone, UserAccount } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { getTimeInTimezone } from '../utils/timezone';
import { WeatherInfo } from '../utils/weather';
import { checkDayAccess } from '../utils/tierAccess';

interface ModernZenDashboardProps {
  currentDay: DayContent;
  currentDayNum: number;
  currentMonthIdx: number;
  daysInCurrentMonth: number;
  monthNames: string[];
  holidays2027: Record<number, number[]>;
  holidayNames2027: Record<string, string>;
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  isLeapYear?: boolean;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onPlayChime: () => void;
  onSelectDay: (dayIdx: number, monthIdx?: number) => void;
  onChangeMonth: (delta: number) => void;
  onGoToDayDetail: () => void;
  onGoToCalendar: () => void;
  onGoToGallery: () => void;
  onOpenJournal: () => void;
  onOpenOracle: () => void;
  onOpenBreathing: () => void;
  onOpenMembership: () => void;
  onOpenAbout: () => void;
  onOpenCoverUpload: () => void;
  alarmActive: boolean;
  onToggleAlarm: () => void;
  coverImage: string | null;
  lang: Language;
  selectedCountry: CountryTimezone;
  onOpenTimezoneModal: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
  onOpenPayment?: () => void;
  isTrialExpired?: boolean;
  onOpenBlogger?: () => void;
  onOpenInstagram?: () => void;
  onOpenFacebook?: () => void;
  onOpenThreads?: () => void;
  onOpenSocialHub?: () => void;
  onOpenYouTube?: () => void;
  onOpenYouTubeMusic?: () => void;
  isYouTubeAudioPlaying?: boolean;
  weatherInfo?: WeatherInfo | null;
  displayedImage?: string;
  onOpenMonthUpload?: (monthIdx: number) => void;
  onGoToSupport?: () => void;
  onGoToTikTok?: () => void;
  onGoToYouTube?: () => void;
  onActionSocialNetwork?: (network: 'instagram' | 'facebook' | 'blogger' | 'youtube' | 'tiktok') => void;
  onOpenWifiMap?: () => void;
}

export const ModernZenDashboard: React.FC<ModernZenDashboardProps> = ({
  currentDay,
  currentDayNum,
  currentMonthIdx,
  daysInCurrentMonth,
  monthNames,
  holidays2027,
  holidayNames2027,
  selectedYear = 2027,
  onSelectYear,
  isLeapYear = false,
  isMusicPlaying,
  onToggleMusic,
  onPlayChime,
  onSelectDay,
  onChangeMonth,
  onGoToDayDetail,
  onGoToCalendar,
  onGoToGallery,
  onGoToSupport,
  onGoToTikTok,
  onGoToYouTube,
  onActionSocialNetwork,
  onOpenJournal,
  onOpenOracle,
  onOpenBreathing,
  onOpenMembership,
  onOpenAbout,
  onOpenCoverUpload,
  alarmActive,
  onToggleAlarm,
  coverImage,
  lang,
  selectedCountry,
  onOpenTimezoneModal,
  currentUser,
  onOpenAuth,
  onOpenPayment,
  isTrialExpired,
  onOpenBlogger,
  onOpenInstagram,
  onOpenFacebook,
  onOpenThreads,
  onOpenSocialHub,
  onOpenYouTube,
  onOpenYouTubeMusic,
  isYouTubeAudioPlaying,
  weatherInfo,
  displayedImage,
  onOpenMonthUpload,
  onOpenWifiMap
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  // Reloj en tiempo real según la zona horaria del país seleccionado
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeState = getTimeInTimezone(selectedCountry.timeZone, now);

  // Estados interactivos para los widgets modernos
  const [waterCups, setWaterCups] = useState<number>(() => {
    const saved = localStorage.getItem('zen_water_cups');
    return saved ? parseInt(saved, 10) : 6;
  });

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('zen_today_tasks');
      return saved ? JSON.parse(saved) : { mirror: true, triggerWord: false, journal: false };
    } catch {
      return { mirror: true, triggerWord: false, journal: false };
    }
  });

  const [activeFrequencyIdx, setActiveFrequencyIdx] = useState(0);
  const frequencies = [
    { name: "432 Hz · Paz Interior", subtitle: "Sanación Celular & Calma", hz: 432 },
    { name: "528 Hz · Transformación", subtitle: "Frecuencia del Milagro", hz: 528 },
    { name: "Cuencos Tibetanos", subtitle: "Limpieza de Memorias", hz: 396 }
  ];

  const [viewStyle, setViewStyle] = useState<'mockup' | 'grid'>('mockup');

  const toggleTask = (key: string) => {
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(updated);
    localStorage.setItem('zen_today_tasks', JSON.stringify(updated));
  };

  const handleWaterChange = (delta: number) => {
    const newVal = Math.max(0, Math.min(12, waterCups + delta));
    setWaterCups(newVal);
    localStorage.setItem('zen_water_cups', String(newVal));
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((currentDayNum / 21) * 100);

  // Generación de días del mini calendario
  const firstDayOfMonth = new Date(selectedYear, currentMonthIdx, 1).getDay(); // 0 = Domingo
  const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-6 md:py-12 px-3 sm:px-6 z-10">
      
      {/* Barra de accesos directos: Celular primero (carrusel táctil fluido) y expandido en Tablet / Notebook */}
      <div className="max-w-6xl mx-auto mb-4 sm:mb-6 px-1 sm:px-4">
        <div className="flex items-center justify-start lg:justify-between gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={onOpenTimezoneModal}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-stone-700 bg-white/85 hover:bg-white backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-stone-200/80 shadow-2xs transition-all cursor-pointer group shrink-0"
            title="Click para ajustar la ciudad, zona horaria y clima"
          >
            <span className="text-sm sm:text-base">{selectedCountry.flag}</span>
            <span className="font-serif text-stone-900 font-bold">{selectedCountry.code} {selectedCountry.city || selectedCountry.name}</span>
            {weatherInfo && (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-900 bg-amber-100/90 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-300/60 shadow-2xs">
                <span>{weatherInfo.icon}</span>
                <span>{weatherInfo.temp}°C</span>
              </span>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            <span className="font-mono font-bold text-terracotta-700 text-xs tabular-nums">{timeState.timeString}</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Indicador y botón de Usuario / Login */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs shrink-0 ${
                  currentUser?.paymentStatus === 'active_paid'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                    : isTrialExpired
                    ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                    : 'bg-amber-50/90 border-amber-200 text-amber-900 hover:bg-amber-100'
                }`}
                title={currentUser ? `Usuario: ${currentUser.name} (${currentUser.email})` : "Iniciar Sesión o Registro"}
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentUser ? currentUser.name.split(' ')[0] : 'Iniciar Sesión'}</span>
              </button>
            )}

            {/* Nivel de Acceso y Visibilidad según Pago */}
            {currentUser && (
              currentUser.paymentStatus === 'active_paid' ? (
                <button
                  onClick={onOpenMembership}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
                  title="Membresía Activa de Pago · Haz clic para ver beneficios"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {currentUser.plan === 'cat3' 
                      ? '👑 Nivel Maestro ($25)'
                      : currentUser.plan === 'circulo'
                      ? '✨ Círculo de Paz ($9.99)'
                      : currentUser.plan === 'cat2'
                      ? '🌊 Categoría 2 ($4.99)'
                      : '🌿 Categoría 1 ($2.25)'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenMembership}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-full text-xs font-semibold shadow-2xs transition-all group cursor-pointer shrink-0"
                  title="Prueba Gratuita: Acceso básico (Días 1-3 y 2027) · Haz clic para desbloquear más según tu aporte"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Mes Gratis</span>
                  <span className="bg-terracotta-700 group-hover:bg-terracotta-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    ⭐ Desbloquear
                  </span>
                </button>
              )
            )}

            {/* Botón de Billetera (Pasarela de Pagos) */}
            {onOpenPayment && (
              <button
                onClick={onOpenPayment}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-medium shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Billetera (Pasarela de Pagos)"
              >
                <Wallet className="w-3 h-3" />
                <span>Billetera</span>
              </button>
            )}

            {/* Botón de Apoya este proyecto ($1.25) */}
            {onGoToSupport && (
              <button
                onClick={onGoToSupport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Apoya este proyecto por solo $1.25"
              >
                <Heart className="w-3 h-3 fill-white" />
                <span>Apoya $1.25</span>
              </button>
            )}

            {/* Botón de Reflexiones TikTok ($1.75) */}
            {onGoToTikTok && (
              <button
                onClick={onGoToTikTok}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 text-rose-300 border border-rose-500/40 rounded-full text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Reflexiones Diarias de TikTok por solo $1.75"
              >
                <Video className="w-3 h-3 text-rose-400" />
                <span>TikTok $1.75</span>
              </button>
            )}

            {/* Botón de Reflexiones YouTube ($1.75) */}
            {onGoToYouTube && (
              <button
                onClick={onGoToYouTube}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-950 to-stone-900 hover:from-red-900 hover:to-stone-900 text-red-200 border border-red-500/40 rounded-full text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Reflexiones Diarias de YouTube por solo $1.75"
              >
                <Youtube className="w-3 h-3 text-red-400 fill-red-400" />
                <span>YouTube $1.75</span>
              </button>
            )}

            {/* Botón de Pase Instagram ($1.75) */}
            {(onActionSocialNetwork || onOpenInstagram) && (
              <button
                onClick={() => onActionSocialNetwork ? onActionSocialNetwork('instagram') : onOpenInstagram?.()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white rounded-full text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Pase y Reflexiones de Instagram por solo $1.75 USD"
              >
                <Instagram className="w-3 h-3 text-white" />
                <span>Instagram</span>
              </button>
            )}

            {/* Botón de Pase Facebook ($1.75) */}
            {(onActionSocialNetwork || onOpenFacebook) && (
              <button
                onClick={() => onActionSocialNetwork ? onActionSocialNetwork('facebook') : onOpenFacebook?.()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#1877F2] to-[#0d5ac1] hover:bg-[#166fe5] text-white rounded-full text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Pase y Comunidad de Facebook por solo $1.75 USD"
              >
                <Facebook className="w-3 h-3 fill-white" />
                <span>Facebook</span>
              </button>
            )}

            {/* Botón de Pase Blogger ($1.75) */}
            {(onActionSocialNetwork || onOpenBlogger) && (
              <button
                onClick={() => onActionSocialNetwork ? onActionSocialNetwork('blogger') : onOpenBlogger?.()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Pase y Entradas de Blogger por solo $1.75 USD"
              >
                <Globe className="w-3 h-3 text-white" />
                <span>Blogger</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BANNER DESTACADO DE PORTADA OFICIAL - Tonos suaves de paz, calma y amor propio */}
      <div className="max-w-6xl mx-auto mb-6 px-1 sm:px-2">
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-amber-100/90 group bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3]">
          <div className="aspect-[16/10] sm:aspect-[22/8] md:aspect-[32/9] w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-stone-50/70">
            {/* Fondo ambiental difuso, sereno y luminoso */}
            <img 
              src={coverImage || "/cover.png"}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-30 scale-110 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            {/* Resplandor sutil y cálido */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />

            {/* Imagen principal de portada nítida y perfectamente visible */}
            <img 
              src={coverImage || "/cover.png"}
              alt="Foto de Portada - Almanaque de Amor Propio y Autoestima"
              className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-700 drop-shadow-sm"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedExt) {
                  target.dataset.triedExt = "true";
                  target.src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                } else if (!target.dataset.triedAlt) {
                  target.dataset.triedAlt = "true";
                  target.src = "https://i.ibb.co/27sqjDWg/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                }
              }}
            />
            
            {/* Contenido sobre la portada: Logo oficial intacto + Título en tarjeta suave de cristal esmerilado */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-5 sm:right-5 flex flex-col xs:flex-row items-start xs:items-end justify-between gap-2 z-30 pointer-events-none">
              <div className="flex items-center gap-2.5 sm:gap-3 bg-white/95 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl border border-white/90 shadow-sm pointer-events-auto max-w-full">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-amber-200/80 shadow-2xs bg-white shrink-0">
                  <img 
                    src="/logo.png"
                    alt="Logo Almanaque"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                    }}
                  />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] sm:text-[10px] font-semibold text-terracotta-700 bg-amber-50/80 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200/60">
                      Portada Oficial
                    </span>
                    <span className="hidden sm:inline-block text-[11px] text-stone-500 font-medium">
                      · Espacio de Calma & Autoestima
                    </span>
                  </div>
                  <h2 className="text-stone-900 font-serif font-bold text-xs sm:text-lg md:text-xl leading-snug truncate">
                    Almanaque de Amor Propio y Autoestima
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto self-end xs:self-auto shrink-0">
                <button
                  onClick={onOpenCoverUpload}
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white/90 hover:bg-white text-stone-800 border border-stone-200/80 text-[11px] sm:text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm transition-all cursor-pointer hover:scale-105 flex items-center gap-1.5"
                  title="Cambiar foto de portada (Exclusivo Categoría 3)"
                >
                  <Camera className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Personalizar Portada</span>
                  <span className="sm:hidden text-[10px]">Portada</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Perspectiva Adaptativo (Celular 1° · Tablet · Notebook) */}
      <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto mb-5 px-2 gap-2.5">
        <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1 rounded-full border border-stone-200/80 shadow-2xs w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={() => setViewStyle('mockup')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              viewStyle === 'mockup' 
                ? 'bg-stone-900 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Vista Móvil Flotante 3D"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista Móvil 3D</span>
          </button>
          <button
            onClick={() => setViewStyle('grid')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              viewStyle === 'grid' 
                ? 'bg-stone-900 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Vista Mosaico Expandida"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Vista Mosaico</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-500 font-medium bg-white/60 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden md:inline">Diseño fluido: Celular · Tablet · Notebook</span>
          <span className="md:hidden">Celular & Tablet</span>
        </div>
      </div>

      {/* COMPOSICIÓN PRINCIPAL: MOCKUP FLOTANTE O GRILLA EXPANDIDA */}
      {viewStyle === 'mockup' ? (
        /* VISTA FLOTANTE INSPIRADA EXACTAMENTE EN LA FOTOGRAFÍA */
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 relative py-2 lg:py-8 box-border px-1 sm:px-4">
          
          {/* COLUMNA IZQUIERDA: WIDGETS FLOTANTES (Mini Calendario, Reproductor 432 Hz, Frase Afirmación) */}
          <div className="w-full lg:w-72 flex flex-col gap-5 order-2 lg:order-1">
            
            {/* WIDGET 1: MINI CALENDARIO (Dinámico 2027 a 3037) */}
            <div className="glass-widget p-4 sm:p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl group">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/50">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                      {monthNames[currentMonthIdx]} {selectedYear}
                    </span>
                    {isLeapYear && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300/80 shadow-2xs" title="Año Bisiesto (366 días · Febrero tiene 29 días)">
                        Bisiesto
                      </span>
                    )}
                  </div>
                  {onSelectYear && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <button
                        onClick={() => onSelectYear(Math.max(2027, selectedYear - 1))}
                        disabled={selectedYear <= 2027}
                        className="text-[10px] text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-0.5 font-medium cursor-pointer"
                        title="Año anterior"
                      >
                        <ChevronLeft className="w-2.5 h-2.5" />
                        <span>{selectedYear - 1 >= 2027 ? selectedYear - 1 : ''}</span>
                      </button>
                      <button
                        onClick={onGoToCalendar}
                        className="text-[10px] text-terracotta-700 hover:underline font-bold px-1"
                        title="Ver calendario anual completo"
                      >
                        · Cambiar Año ·
                      </button>
                      <button
                        onClick={() => onSelectYear(Math.min(3037, selectedYear + 1))}
                        disabled={selectedYear >= 3037}
                        className="text-[10px] text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-0.5 font-medium cursor-pointer"
                        title="Año siguiente"
                      >
                        <span>{selectedYear + 1 <= 3037 ? selectedYear + 1 : ''}</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onChangeMonth(-1)}
                    className="p-1 hover:bg-stone-200/60 rounded-full text-stone-600 transition-colors cursor-pointer"
                    title="Mes anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onChangeMonth(1)}
                    className="p-1 hover:bg-stone-200/60 rounded-full text-stone-600 transition-colors cursor-pointer"
                    title="Mes siguiente"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Encabezado días de la semana */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-semibold text-stone-400 uppercase">
                <span>D</span>
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {daysArray.map((d) => {
                  const isSelected = d === currentDayNum;
                  const isHoliday = holidays2027[currentMonthIdx]?.includes(d);
                  const dayCheck = checkDayAccess(currentUser || null, d);
                  const isLocked = !dayCheck.allowed;
                  return (
                    <button
                      key={d}
                      onClick={() => onSelectDay(d - 1, currentMonthIdx)}
                      title={isLocked ? `Día ${d} · Suscripción Requerida (Mes gratis incluye Días 1 a 3)` : `Día ${d}`}
                      className={`aspect-square flex items-center justify-center rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-medium transition-all relative cursor-pointer ${
                        isSelected 
                          ? 'bg-terracotta-600 text-white font-bold shadow-sm scale-105' 
                          : isHoliday 
                            ? 'bg-terracotta-100/70 text-terracotta-800 font-bold hover:bg-terracotta-200/70' 
                            : isLocked
                            ? 'text-stone-400 bg-stone-100/50 hover:bg-amber-50 hover:text-amber-900'
                            : 'text-stone-700 hover:bg-white/80'
                      }`}
                    >
                      <span>{d}</span>
                      {isLocked && !isSelected && (
                        <span className="absolute top-0.5 right-0.5 text-[8px] leading-none" title="Contenido Premium">🔒</span>
                      )}
                      {isHoliday && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-terracotta-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RINCÓN DE LECTURA: LIBROS GRATUITOS DE AUTOESTIMA (OPENLIBRARY) */}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-widget p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-rose-50/70 to-orange-50/90 hover:from-amber-100 hover:via-rose-100 hover:to-orange-100 transition-all hover:translate-y-[-2px] hover:shadow-md flex items-center justify-between gap-2.5 text-stone-800 group text-decoration-none cursor-pointer shadow-xs active:scale-[0.99]"
              title="Rincón de Lectura: Libros Gratuitos de Autoestima (Abre en pestaña nueva)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors block leading-tight truncate">
                    «Rincón de Lectura: Libros Gratuitos»
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    Biblioteca digital libre · OpenLibrary.org
                  </span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 text-terracotta-700 shadow-2xs border border-amber-200/60 group-hover:bg-amber-100/60">
                <ExternalLink className="w-3 h-3 text-terracotta-600" />
              </div>
            </a>

            {/* CONEXIÓN CONSCIENTE: WI-FI GRATIS (LEAFLET & OVERPASS) */}
            <button
              onClick={() => onOpenWifiMap?.()}
              className="glass-widget p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-rose-50/70 to-orange-50/90 hover:from-amber-100 hover:via-rose-100 hover:to-orange-100 transition-all hover:translate-y-[-2px] hover:shadow-md flex items-center justify-between gap-2.5 text-stone-800 group cursor-pointer shadow-xs active:scale-[0.99] text-left"
              title="Conexión Consciente (Wi-Fi Gratis) - Mapa interactivo sin salir del almanaque"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors block leading-tight truncate">
                    «Conexión Consciente (Wi-Fi Gratis)»
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    Mapa interactivo de redes libres cercanas
                  </span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs border border-emerald-200/60 group-hover:bg-emerald-50">
                <Wifi className="w-3 h-3 text-emerald-600" />
              </div>
            </button>

            {/* WIDGET 2: REPRODUCTOR DE PAZ 432 HZ CON ONDA SONORA VIVA */}
            <div className="glass-widget p-4 sm:p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                    Frecuencia de Paz
                  </span>
                  <h4 className="font-serif font-bold text-stone-800 text-sm">
                    {frequencies[activeFrequencyIdx].name}
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    {frequencies[activeFrequencyIdx].subtitle}
                  </p>
                </div>
                <button
                  onClick={onPlayChime}
                  title="Tocar campana tibetana"
                  className="p-2 bg-stone-100/80 hover:bg-stone-200 text-stone-700 rounded-full transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-gold-600" />
                </button>
              </div>

              {/* Visualizador de barras de onda sonora animadas */}
              <div className="h-10 my-3 flex items-center justify-center gap-1 bg-stone-100/60 rounded-2xl px-3 overflow-hidden">
                {[1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1].map((bar, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isMusicPlaying 
                        ? `bg-terracotta-500 wave-bar-${(i % 8) + 1}` 
                        : 'h-1.5 bg-stone-300'
                    }`}
                  />
                ))}
              </div>

              {/* Controles de reproducción */}
              <div className="flex items-center justify-between pt-1">
                <button 
                  onClick={() => setActiveFrequencyIdx((prev) => (prev > 0 ? prev - 1 : frequencies.length - 1))}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onToggleMusic}
                  className={`p-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer ${
                    isMusicPlaying 
                      ? 'bg-terracotta-600 text-white shadow-terracotta-600/30' 
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                  title={isMusicPlaying ? "Pausar música" : "Iniciar 432 Hz"}
                >
                  {isMusicPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button 
                  onClick={() => setActiveFrequencyIdx((prev) => (prev + 1) % frequencies.length)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Acceso rápido a Música Clásica & Zen de YouTube */}
              {onOpenYouTubeMusic && (
                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    YouTube Clásica & Zen
                  </span>
                  <button
                    onClick={onOpenYouTubeMusic}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/70 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="Abrir reproductor de música clásica y zen de YouTube"
                  >
                    <Headphones className="w-3 h-3 text-red-600" />
                    <span>{isYouTubeAudioPlaying ? 'Ver Reproductor' : 'Abrir Música'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* WIDGET 3: TARJETA DE AFIRMACIÓN CON COMILLAS Y HOJA BOTÁNICA (Como en la foto) */}
            <div className="glass-widget p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl relative overflow-hidden">
              <Quote className="w-7 h-7 text-gold-500/30 absolute top-4 left-4" />
              <div className="relative z-10 pt-4 space-y-2">
                <p className="font-serif italic text-stone-800 text-sm sm:text-base leading-relaxed">
                  "Pequeños pasos de amor cada día crean grandes transformaciones en tu alma."
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-stone-200/50">
                  <span className="text-[10px] font-semibold text-terracotta-700 uppercase tracking-wider">
                    Palabra Gatillo: {currentDay.title}
                  </span>
                  <button 
                    onClick={onOpenBreathing}
                    className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1"
                  >
                    <Wind className="w-3 h-3 text-sage-600" />
                    <span>Respirar</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA CENTRAL: EL TELÉFONO MÓVIL ESTILO DE LA FOTO */}
          <div className="w-full max-w-md order-1 lg:order-2">
            {/* Chasis exterior del smartphone de cristal y marco refinado */}
            <div className="relative bg-stone-900/5 p-2.5 sm:p-3.5 rounded-[32px] sm:rounded-[44px] shadow-[0_20px_60px_rgba(46,39,33,0.14)] border border-stone-300/60 backdrop-blur-xl">
              
              {/* Pantalla del teléfono */}
              <div className="bg-[#FAF8F5] rounded-2xl sm:rounded-[36px] overflow-hidden border border-stone-200/80 shadow-inner flex flex-col min-h-0 sm:min-h-[660px] relative">
                
                {/* Barra de estado superior con Dynamic Island */}
                <div className="pt-3 px-4 sm:px-6 pb-2 flex items-center justify-between relative z-20">
                  <button
                    onClick={onOpenTimezoneModal}
                    className="flex items-center gap-1.5 hover:bg-stone-200/60 px-2 py-0.5 rounded-full transition-colors cursor-pointer group"
                    title={`Zona horaria y clima: ${selectedCountry.code} ${selectedCountry.city || selectedCountry.name} - Click para cambiar`}
                  >
                    <span className="text-xs">{selectedCountry.flag}</span>
                    <span className="text-xs font-semibold text-stone-800 tracking-tight font-mono tabular-nums group-hover:text-terracotta-700">
                      {timeState.timeString}
                    </span>
                    {weatherInfo && (
                      <span className="text-[10px] text-amber-800 font-mono font-bold flex items-center gap-0.5">
                        <span>{weatherInfo.icon}</span>
                        <span>{weatherInfo.temp}°C</span>
                      </span>
                    )}
                  </button>
                  {/* Dynamic Island estilizada */}
                  <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-stone-950 rounded-full shadow-inner flex items-center justify-end px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <span className="text-[10px] font-bold">5G</span>
                    <span className="text-[10px]">100%</span>
                  </div>
                </div>

                {/* Encabezado dentro del teléfono */}
                <div className="px-4 sm:px-6 pt-2 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 font-medium block">
                      {timeState.greeting} · {timeState.dateString}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                        ALMA BELLA
                      </h3>
                      <button
                        onClick={onOpenTimezoneModal}
                        className="text-[10px] bg-terracotta-100/80 hover:bg-terracotta-200 text-terracotta-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                        title="Cambiar ciudad, país o región"
                      >
                        <span>{selectedCountry.flag}</span>
                        <span className="font-mono font-bold">{selectedCountry.code} {selectedCountry.city || selectedCountry.name}</span>
                        {weatherInfo && (
                          <span className="font-mono font-bold text-amber-900">· {weatherInfo.temp}°C</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onToggleAlarm();
                      if (!alarmActive) onPlayChime();
                    }}
                    className={`p-2 sm:p-2.5 rounded-full border transition-all ${
                      alarmActive 
                        ? 'bg-terracotta-600 border-terracotta-600 text-white shadow-sm' 
                        : 'bg-white/80 border-stone-200 text-stone-600 hover:bg-white'
                    }`}
                    title={alarmActive ? "Recordatorio activado" : "Activar recordatorio"}
                  >
                    <Bell className={`w-4 h-4 ${alarmActive ? 'animate-bounce' : ''}`} />
                  </button>
                </div>

                {/* Contenido scrolleable de la pantalla */}
                <div className="px-3.5 sm:px-5 space-y-4 pb-20 sm:pb-24 overflow-y-auto max-h-[500px] sm:max-h-[580px] scrollbar-none">
                  
                  {/* HERO CARD: FOCUS DE HOY / DÍA ACTUAL (Como en la foto) */}
                  <div className="glass-panel p-4 rounded-3xl relative overflow-hidden group shadow-sm">
                    <div className="flex items-center gap-4">
                      {/* Imagen zen con planta / jarrón */}
                      <div className="w-24 h-28 rounded-2xl overflow-hidden shrink-0 border border-stone-200/70 shadow-sm relative bg-stone-100">
                        <img 
                          src={coverImage || displayedImage || currentDay.image || "/cover.png"} 
                          alt={currentDay.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.triedExt) {
                              target.dataset.triedExt = "true";
                              target.src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                            } else if (!target.dataset.triedAlt) {
                              target.dataset.triedAlt = "true";
                              target.src = "https://i.ibb.co/27sqjDWg/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                            }
                          }}
                        />
                        {/* Logo insignia oficial https://ibb.co/27sqjDWg agregado a la portada */}
                        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full overflow-hidden border border-white/90 shadow-xs bg-white z-10 pointer-events-none" title="Almanaque de Amor Propio y Autoestima">
                          <img 
                            src="/logo.png" 
                            alt="Logo Almanaque" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                            }}
                          />
                        </div>
                        <button
                          onClick={() => onOpenMonthUpload ? onOpenMonthUpload(currentMonthIdx) : onOpenCoverUpload()}
                          className="absolute bottom-1 right-1 p-1.5 bg-stone-900/75 hover:bg-stone-950 text-white rounded-full transition-colors shadow-xs cursor-pointer z-10"
                          title={`Subir/Cambiar foto de ${monthNames[currentMonthIdx]} (Día ${currentMonthIdx + 1}) · Exclusivo Categoría 3`}
                        >
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Detalles del día */}
                      <div className="flex-1 flex flex-col justify-between h-28 py-0.5">
                        <div>
                          <span className="text-[10px] font-semibold text-terracotta-700 uppercase tracking-wider block">
                            Día {currentDayNum} de 21
                          </span>
                          <h4 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                            {currentDay.title}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {currentDay.subtitle || "Sanación y Autoestima"}
                          </p>
                        </div>

                        <button
                          onClick={onGoToDayDetail}
                          className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                          <span>Iniciar Reflexión</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MENSAJE SAGRADO DEL ALMANAQUE: "YO SOY YO" */}
                  <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-2">
                    <p className="font-serif italic text-xs text-terracotta-800 border-l-2 border-terracotta-500 pl-2.5">
                      "Este es un borrador de 21 días, basado en mi propia experiencia."
                    </p>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Existe un lugar en donde llega la calma y reina el amor puro. Y ese lugar está en tu interior.
                    </p>
                    <div className="pt-2 border-t border-stone-200/60 flex items-baseline justify-between">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                        Hoy deseo desde mi
                      </span>
                      <span className="font-serif font-bold text-sm text-stone-900 tracking-tight text-terracotta-800">
                        YO SOY YO
                      </span>
                    </div>
                    <p className="font-serif italic text-xs text-gold-700 leading-normal">
                      ayudar con este almanaque en tu diario vivir compartiendo cada día una palabra gatillo para implementarla e ir transmutando tus viejas emociones.
                    </p>
                  </div>

                  {/* TODAY'S PLAN: PRÁCTICA DE HOY (Como en la foto) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Prácticas de Hoy
                      </h4>
                      <span className="text-[11px] font-medium text-stone-500">
                        {completedCount}/3 Completadas
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Tarea 1: Espejo */}
                      <button
                        onClick={() => toggleTask('mirror')}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          completedTasks.mirror 
                            ? 'bg-emerald-50/70 border-emerald-200 text-stone-700' 
                            : 'bg-white/80 border-stone-200/80 text-stone-800 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {completedTasks.mirror ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                          )}
                          <div>
                            <span className={`text-xs font-semibold block ${completedTasks.mirror ? 'line-through text-stone-400' : ''}`}>
                              Mirarse al espejo con amor
                            </span>
                            <span className="text-[10px] text-stone-400">10:00 AM · Autoobservación</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400">10:00 AM</span>
                      </button>

                      {/* Tarea 2: Palabra Gatillo */}
                      <button
                        onClick={() => toggleTask('triggerWord')}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          completedTasks.triggerWord 
                            ? 'bg-emerald-50/70 border-emerald-200 text-stone-700' 
                            : 'bg-white/80 border-stone-200/80 text-stone-800 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {completedTasks.triggerWord ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                          )}
                          <div>
                            <span className={`text-xs font-semibold block ${completedTasks.triggerWord ? 'line-through text-stone-400' : ''}`}>
                              Repetir palabra gatillo 3 veces
                            </span>
                            <span className="text-[10px] text-stone-400">01:30 PM · Transmutar memoria</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400">01:30 PM</span>
                      </button>

                      {/* Tarea 3: Diario */}
                      <button
                        onClick={() => {
                          toggleTask('journal');
                          onOpenJournal();
                        }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          completedTasks.journal 
                            ? 'bg-emerald-50/70 border-emerald-200 text-stone-700' 
                            : 'bg-white/80 border-stone-200/80 text-stone-800 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {completedTasks.journal ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                          )}
                          <div>
                            <span className={`text-xs font-semibold block ${completedTasks.journal ? 'line-through text-stone-400' : ''}`}>
                              Escribir en el Diario Íntimo
                            </span>
                            <span className="text-[10px] text-stone-400">03:00 PM · Gratitud & Desahogo</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400">03:00 PM</span>
                      </button>
                    </div>
                  </div>

                  {/* ESTADÍSTICA DE PAZ INTERIOR (Como en la foto) */}
                  <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                        Serenidad Semanal
                      </span>
                      {/* Curva suave de serenidad */}
                      <svg className="w-28 h-8 text-stone-500 my-1" viewBox="0 0 120 32" fill="none">
                        <path 
                          d="M2 24 C 20 8, 40 28, 60 16 C 80 4, 100 22, 118 8" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                        />
                      </svg>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-serif font-bold text-emerald-700 block">
                        +24%
                      </span>
                      <span className="text-[10px] text-stone-400">vs semana anterior</span>
                    </div>
                  </div>

                </div>

                {/* BARRA DE NAVEGACIÓN FLOTANTE INFERIOR DOCK (Exactamente como en la foto) */}
                <div className="absolute bottom-3 left-4 right-4 z-30">
                  <div className="glass-dock py-2 px-3 rounded-full flex items-center justify-around shadow-lg">
                    <button 
                      onClick={() => {}} 
                      className="p-2 text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                      title="Inicio"
                    >
                      <Heart className="w-4 h-4 fill-terracotta-600 text-terracotta-600" />
                    </button>
                    <button 
                      onClick={onGoToCalendar} 
                      className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                      title={`Calendario ${selectedYear}`}
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                    {/* Botón Central Acción */}
                    <button 
                      onClick={onGoToDayDetail}
                      className="w-10 h-10 bg-stone-900 hover:bg-stone-800 text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
                      title="Lectura del Día"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={onOpenOracle} 
                      className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                      title="Oráculo de Cartas"
                    >
                      <Compass className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={onOpenMembership} 
                      className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                      title="Círculo de Paz"
                    >
                      <Sparkles className="w-4 h-4 text-gold-600" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: WIDGETS FLOTANTES (Clima/Paz, Anillo Progreso 76%, Tareas, Agua) */}
          <div className="w-full lg:w-72 flex flex-col gap-4 sm:gap-5 order-3">
            
            {/* WIDGET 4: CLIMA EMOCIONAL & MOMENTO PRESENTE (Adaptado al país y zona horaria) */}
            <div className="glass-widget p-4 sm:p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left w-full">
                <div className="flex flex-col items-center sm:items-start w-full">
                  {/* Hora destacada */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap w-full">
                    <span className="text-2xl sm:text-xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                      {timeState.timeString}
                    </span>
                    <span className="text-[11px] font-normal text-stone-500 font-sans">
                      ({selectedCountry.offset})
                    </span>
                  </div>

                  {/* Clima y País / Ciudad */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap mt-1 w-full">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-xs font-bold text-stone-800">
                      {selectedCountry.code} {selectedCountry.city || selectedCountry.name}
                    </span>
                    {weatherInfo && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1 shadow-2xs">
                        <span>{weatherInfo.icon}</span>
                        <span>{weatherInfo.temp}°C</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-stone-500 font-medium block mt-1 text-center sm:text-left w-full">
                    {weatherInfo ? `${weatherInfo.description} · ` : ''}{timeState.isNight ? 'Noche serena · Reflexión' : 'Día luminoso · Paz interior'}
                  </span>
                </div>
                <button
                  onClick={onOpenTimezoneModal}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                    timeState.isNight 
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                      : 'bg-amber-50 border-amber-100 text-amber-500'
                  }`}
                  title={`Hora y temperatura en ${selectedCountry.city || selectedCountry.name}. Click para cambiar.`}
                >
                  {weatherInfo ? (
                    <span className="text-2xl leading-none">{weatherInfo.icon}</span>
                  ) : timeState.isNight ? (
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                  ) : (
                    <SunMedium className="w-6 h-6 animate-spin-slow" />
                  )}
                </button>
              </div>
              <div className="mt-3 pt-2.5 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500 w-full">
                <span>{selectedCountry.name}</span>
                <button
                  onClick={onOpenTimezoneModal}
                  className="text-terracotta-700 hover:text-terracotta-900 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Cambiar ciudad / país
                </button>
              </div>
            </div>

            {/* WIDGET 5: ANILLO DE PROGRESO DE TRANSFORMACIÓN (Como el 76% de la foto) */}
            <div className="glass-widget p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                Progreso del Viaje Interior
              </span>

              <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Círculo base */}
                  <path
                    className="text-stone-200/70"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Círculo de avance */}
                  <path
                    className="text-terracotta-600 transition-all duration-1000"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-serif font-bold text-stone-900">
                    {progressPercent}%
                  </span>
                  <span className="text-[9px] text-stone-400 uppercase">Día {currentDayNum}</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-stone-600">
                <p className="font-medium">Ciclo de 21 Días</p>
                <p className="text-[10px] text-stone-400">{21 - currentDayNum} días para transmutar</p>
              </div>
            </div>

            {/* WIDGET 6: TAREAS COMPLETADAS */}
            <div className="glass-widget p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Prácticas
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {completedCount} de 3
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200/70 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                  style={{ width: `${(completedCount / 3) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-2">
                {completedCount === 3 ? "✨ ¡Todas las prácticas de hoy realizadas!" : "Sigue cultivando tu paz a tu ritmo."}
              </p>
            </div>

            {/* WIDGET 7: RECORDATORIO DE AGUA & PAUSA CONSCIENTE (Como en la foto 6/8 Cups) */}
            <div className="glass-widget p-5 rounded-3xl transition-all hover:translate-y-[-2px] hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Pausas de Calma / Agua
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-serif font-bold text-stone-900">
                      {waterCups}/8
                    </span>
                    <span className="text-xs text-stone-500">Vasos</span>
                  </div>
                </div>
                <div className="p-2.5 bg-sky-50 rounded-2xl border border-sky-100 text-sky-600">
                  <Droplets className="w-5 h-5" />
                </div>
              </div>

              {/* Barra de progreso de agua */}
              <div className="w-full h-2 bg-stone-200/70 rounded-full overflow-hidden my-2">
                <div 
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterCups / 8) * 100)}%` }}
                />
              </div>

              {/* Botones + y - para regular agua */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleWaterChange(-1)}
                  className="p-1.5 bg-white hover:bg-stone-100 text-stone-600 rounded-full border border-stone-200 shadow-xs transition-colors"
                  title="Restar vaso"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleWaterChange(1)}
                  className="p-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full shadow-xs transition-colors"
                  title="Sumar vaso"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* VISTA MOSAICO EXPANDIDA: PARA QUIENES DESEAN VER TODO EN FORMATO AMPLIO */
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta 1: Hero Principal */}
            <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="w-full sm:w-44 aspect-[4/5] rounded-2xl overflow-hidden shrink-0 border border-stone-200 shadow-sm bg-stone-100 relative group">
                <img 
                  src={coverImage || displayedImage || currentDay.image || "/cover.png"} 
                  alt={currentDay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedExt) {
                      target.dataset.triedExt = "true";
                      target.src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                    } else if (!target.dataset.triedAlt) {
                      target.dataset.triedAlt = "true";
                      target.src = "https://i.ibb.co/27sqjDWg/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                    }
                  }}
                />
                {/* Logo insignia oficial https://ibb.co/27sqjDWg agregado a la portada */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/90 shadow-sm z-10 pointer-events-none" title="Almanaque de Amor Propio y Autoestima">
                  <img 
                    src="/logo.png" 
                    alt="Logo Almanaque" 
                    className="w-4 h-4 rounded-full object-cover shadow-2xs" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                    }}
                  />
                  <span className="text-[10px] font-serif font-bold text-stone-900 leading-none">Almanaque</span>
                </div>
                <button
                  onClick={() => onOpenMonthUpload ? onOpenMonthUpload(currentMonthIdx) : onOpenCoverUpload()}
                  className="absolute bottom-2 right-2 p-2 bg-stone-900/80 hover:bg-stone-950 text-white rounded-full transition-all shadow-md cursor-pointer flex items-center gap-1 text-[11px] z-10"
                  title={`Subir foto de ${monthNames[currentMonthIdx]} (Día ${currentMonthIdx + 1}) · Exclusivo Categoría 3`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium pr-1">Foto Mes</span>
                </button>
              </div>
              <div className="space-y-3 text-left">
                <span className="text-xs font-bold text-terracotta-700 uppercase tracking-widest">
                  Día {currentDayNum} · Práctica de Hoy
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {currentDay.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                  {currentDay.content[0]}
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={onGoToDayDetail}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
                  >
                    Abrir Lectura Completa
                  </button>
                  <button
                    onClick={onOpenJournal}
                    className="px-5 py-2.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold rounded-full shadow-sm transition-all"
                  >
                    Escribir en Diario
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Progreso & Racha */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between text-center shadow-sm">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Transformación
              </span>
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-3">
                <span className="text-2xl font-serif font-bold text-stone-900">
                  {progressPercent}%
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Día {currentDayNum} de 21 completado
              </p>
              {isTrialExpired ? (
                <button
                  id="dashboard-membership-trial-btn"
                  onClick={onOpenPayment || onOpenMembership}
                  className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Prueba Concluida · Pagar Cuota</span>
                </button>
              ) : (
                <button
                  id="dashboard-membership-trial-btn"
                  onClick={onOpenMembership}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white rounded-full text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Círculo de Paz · 30 Días Gratis</span>
                </button>
              )}
            </div>

          </div>

          {/* Grilla inferior de widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Reproductor 432 Hz */}
            <div className="glass-widget p-5 rounded-3xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                Frecuencia 432 Hz
              </span>
              <h5 className="font-serif font-bold text-stone-800 text-sm mb-3">Música Zen Continua</h5>
              <button
                onClick={onToggleMusic}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-medium flex items-center justify-center gap-2"
              >
                {isMusicPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isMusicPlaying ? "Pausar" : "Reproducir 432 Hz"}</span>
              </button>
            </div>

            {/* Calendario */}
            <div className="glass-widget p-5 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                  Almanaque {selectedYear}
                </span>
                <h5 className="font-serif font-bold text-stone-800 text-sm">{monthNames[currentMonthIdx]}</h5>
              </div>
              <button
                onClick={onGoToCalendar}
                className="w-full py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-full text-xs font-medium"
              >
                Ver Todo el Año
              </button>
            </div>

            {/* Respiración */}
            <div className="glass-widget p-5 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                  Pausa Consciente
                </span>
                <h5 className="font-serif font-bold text-stone-800 text-sm">Respiración 4-4-4</h5>
              </div>
              <button
                onClick={onOpenBreathing}
                className="w-full py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-full text-xs font-medium"
              >
                Iniciar Sesión
              </button>
            </div>

            {/* Oráculo */}
            <div className="glass-widget p-5 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                  Sabiduría del Día
                </span>
                <h5 className="font-serif font-bold text-stone-800 text-sm">Oráculo de Luz</h5>
              </div>
              <button
                onClick={onOpenOracle}
                className="w-full py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-full text-xs font-medium"
              >
                Consultar Carta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCESOS CONSCIENTES: RINCÓN DE LECTURA & WI-FI GRATIS */}
      <div className="max-w-md sm:max-w-4xl mx-auto mt-6 px-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Rincón de Lectura */}
        <a
          href="https://openlibrary.org"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-full glass-panel p-3.5 sm:px-5 rounded-2xl sm:rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-rose-50/60 to-orange-50/90 hover:from-amber-100 hover:via-rose-100 hover:to-orange-100 transition-all duration-300 flex items-center justify-between gap-3 text-stone-800 shadow-xs hover:shadow-md text-decoration-none cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.99]"
          title="Rincón de Lectura: Libros Gratuitos de Autoestima (Abre en pestaña nueva)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left min-w-0">
              <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors block leading-tight truncate">
                «Rincón de Lectura: Libros Gratuitos»
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                Acceso a OpenLibrary.org
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-terracotta-700 bg-white/90 group-hover:bg-white px-3 py-1 rounded-full border border-amber-200/80 shrink-0 shadow-2xs">
            <span className="hidden xs:inline">Explorar</span>
            <ExternalLink className="w-3 h-3 text-terracotta-600" />
          </div>
        </a>

        {/* Conexión Consciente (Wi-Fi Gratis) */}
        <button
          onClick={() => onOpenWifiMap?.()}
          className="group w-full glass-panel p-3.5 sm:px-5 rounded-2xl sm:rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-rose-50/60 to-orange-50/90 hover:from-amber-100 hover:via-rose-100 hover:to-orange-100 transition-all duration-300 flex items-center justify-between gap-3 text-stone-800 shadow-xs hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.99] text-left"
          title="Conexión Consciente (Wi-Fi Gratis) - Mapa interactivo sin salir del almanaque"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Wifi className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left min-w-0">
              <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors block leading-tight truncate">
                «Conexión Consciente (Wi-Fi Gratis)»
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                Mapa interactivo con Leaflet & Overpass
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-white/90 group-hover:bg-white px-3 py-1 rounded-full border border-emerald-200/80 shrink-0 shadow-2xs">
            <span className="hidden xs:inline">Ver Mapa</span>
            <Wifi className="w-3 h-3 text-emerald-600" />
          </div>
        </button>
      </div>

      {/* QUICK ACTIONS BAR FLOTANTE (Inspirada en el dock de la parte inferior de la foto) */}
      <div className="max-w-md mx-auto mt-6 flex items-center justify-center">
        <div className="glass-panel py-2 px-5 rounded-full flex items-center gap-4 sm:gap-6 shadow-md border border-white/90">
          <button
            onClick={onOpenJournal}
            className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-stone-900 transition-colors"
            title="Diario Íntimo"
          >
            <BookOpen className="w-4 h-4 text-terracotta-600" />
            <span className="text-[10px] font-medium">Diario</span>
          </button>

          <button
            onClick={() => onOpenMonthUpload ? onOpenMonthUpload(currentMonthIdx) : onOpenCoverUpload()}
            className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-stone-900 transition-colors"
            title={`Subir/Cambiar foto de ${monthNames[currentMonthIdx]} (Día ${currentMonthIdx + 1}) · Exclusivo Categoría 3`}
          >
            <Camera className="w-4 h-4 text-stone-700" />
            <span className="text-[10px] font-medium">Foto</span>
          </button>

          <button
            onClick={onOpenOracle}
            className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-stone-900 transition-colors"
            title="Oráculo"
          >
            <Compass className="w-4 h-4 text-gold-600" />
            <span className="text-[10px] font-medium">Oráculo</span>
          </button>

          <button
            onClick={onOpenBreathing}
            className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-stone-900 transition-colors"
            title="Respirar"
          >
            <Wind className="w-4 h-4 text-sage-600" />
            <span className="text-[10px] font-medium">Calma</span>
          </button>

          {/* Icono de Música Clásica y Zen de YouTube */}
          {onOpenYouTubeMusic && (
            <button
              onClick={onOpenYouTubeMusic}
              className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-red-700 transition-colors relative group cursor-pointer"
              title="Música Clásica y Zen de YouTube"
            >
              <div className="relative">
                <Headphones className={`w-4 h-4 ${isYouTubeAudioPlaying ? 'text-red-600 animate-pulse' : 'text-red-500 group-hover:scale-110 transition-transform'}`} />
                {isYouTubeAudioPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping" />
                )}
              </div>
              <span className="text-[10px] font-medium group-hover:text-red-700">Música</span>
            </button>
          )}

          {/* Canales de Redes y Blog Dinámicos (Armonizados: Blogger, Instagram, Facebook, Threads, YouTube) */}
          {(onOpenBlogger || onOpenInstagram || onOpenFacebook || onOpenThreads || onOpenYouTube || onOpenSocialHub) && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
              {onOpenSocialHub && (
                <button
                  onClick={onOpenSocialHub}
                  aria-label="Centro de Redes y Comunidad"
                  className="px-2 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 flex items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer shadow-2xs group"
                  title="Abrir Centro de Redes y Comunidad de Amor Propio"
                >
                  <Share2 className="w-3 h-3 text-terracotta-600 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Redes</span>
                </button>
              )}

              {onOpenBlogger && (
                <button
                  onClick={onOpenBlogger}
                  aria-label="Publicar en Blogger"
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_10px_rgba(249,115,22,0.55)] transform hover:scale-120 active:scale-90 hover:rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
                  title="Publicar en Blogger (Entradas y Gadgets)"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <Globe className="w-3.5 h-3.5 transform group-hover:scale-110 transition-transform duration-300" />
                </button>
              )}

              {onOpenInstagram && (
                <button
                  onClick={onOpenInstagram}
                  aria-label="Publicar en Instagram"
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:via-rose-600 hover:to-purple-700 text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_10px_rgba(225,48,108,0.55)] transform hover:scale-120 active:scale-90 hover:-rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
                  title="Publicar en Instagram (Historias y Carruseles)"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <Instagram className="w-3.5 h-3.5 transform group-hover:scale-110 transition-transform duration-300" />
                </button>
              )}

              {onOpenFacebook && (
                <button
                  onClick={onOpenFacebook}
                  aria-label="Publicar en Facebook"
                  className="w-7 h-7 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_10px_rgba(24,119,242,0.55)] transform hover:scale-120 active:scale-90 hover:rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
                  title="Publicar en Facebook (Grupos y Feed)"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <Facebook className="w-3.5 h-3.5 fill-white transform group-hover:scale-110 transition-transform duration-300" />
                </button>
              )}

              {onOpenThreads && (
                <button
                  onClick={onOpenThreads}
                  aria-label="Publicar en Threads"
                  className="w-7 h-7 rounded-full bg-stone-900 hover:bg-stone-950 text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_10px_rgba(46,39,33,0.55)] transform hover:scale-120 active:scale-90 hover:rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
                  title="Publicar en Threads (@teread - Micro-hilos de Paz)"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <span className="font-serif font-black text-xs leading-none transform group-hover:scale-110 transition-transform duration-300">@</span>
                </button>
              )}

              {onOpenYouTube && (
                <button
                  onClick={onOpenYouTube}
                  aria-label="Publicar en YouTube"
                  className="w-7 h-7 rounded-full bg-[#FF0000] hover:bg-[#cc0000] text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_10px_rgba(255,0,0,0.6)] transform hover:scale-120 active:scale-90 hover:-rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
                  title="Publicar en YouTube (Shorts y Galería)"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <Youtube className="w-3.5 h-3.5 fill-white transform group-hover:scale-110 transition-transform duration-300" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
