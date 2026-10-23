import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Volume2, 
  Camera, 
  Flower, 
  LayoutGrid,
  Eye,
  Music,
  Music2,
  Sparkles,
  BookOpen,
  Wind,
  Info,
  Globe,
  Compass,
  Home,
  Share2,
  User,
  CreditCard,
  Wallet,
  AlertTriangle,
  Gift,
  Shield,
  Instagram,
  Facebook,
  Youtube,
  Headphones,
  Lock,
  Video,
  ExternalLink,
  Wifi
} from 'lucide-react';
import { ViewMode, Language, CountryTimezone, UserAccount, PaymentRecord, PlanCategory } from './types';
import { DAYS_CONTENT } from './data';
import { TRANSLATIONS } from './translations';
import { WifiMapModal } from './src/components/WifiMapModal';
import { MembershipModal } from './src/components/MembershipModal';
import { JournalModal } from './src/components/JournalModal';
import { OracleModal } from './src/components/OracleModal';
import { AboutModal } from './src/components/AboutModal';
import { BreathingModal } from './src/components/BreathingModal';
import { ModernZenDashboard } from './src/components/ModernZenDashboard';
import { TimezoneModal } from './src/components/TimezoneModal';
import { AuthModal } from './src/components/AuthModal';
import { PaymentGatewayModal, triggerAutomaticCategoryDownload } from './src/components/PaymentGatewayModal';
import { verifyMercadoPagoPaymentOnServer, capturePayPalOrderOnServer } from './src/utils/paymentConfig';
import { getCleanAppUrl, getShareableUrl, sanitizeBrowserAddressBar, clearPaymentParamsFromUrl } from './src/utils/urlHelper';
import { BloggerModal } from './src/components/BloggerModal';
import { InstagramModal } from './src/components/InstagramModal';
import { FacebookModal } from './src/components/FacebookModal';
import { ThreadsModal } from './src/components/ThreadsModal';
import { SocialNetworksHubModal } from './src/components/SocialNetworksHubModal';
import { SocialNetworkActionModal, SocialNetworkKey } from './src/components/SocialNetworkActionModal';
import { YouTubeModal } from './src/components/YouTubeModal';
import { YouTubeMusicModal, YouTubeTrack, CURATED_YOUTUBE_TRACKS } from './src/components/YouTubeMusicModal';
import { YouTubeFloatingPlayer } from './src/components/YouTubeFloatingPlayer';
import { TierLockModal } from './src/components/TierLockModal';
import { SupportProjectSection } from './src/components/SupportProjectSection';
import { TikTokSection } from './src/components/TikTokSection';
import { YouTubeGallerySection } from './src/components/YouTubeGallerySection';
import { 
  getUserTier, 
  checkDayAccess, 
  checkYearAccess, 
  checkAudio432Access, 
  checkJournalAccess, 
  checkBreathingAccess, 
  checkOracleAccess, 
  checkPhotoUploadAccess, 
  checkSocialPublisherAccess,
  AccessCheckResult,
  TIER_BENEFITS
} from './src/utils/tierAccess';
import { COUNTRIES_TIMEZONES, DEFAULT_COUNTRY, getTimeInTimezone } from './src/utils/timezone';
import { WeatherInfo, fetchLiveWeather } from './src/utils/weather';
import { 
  isLeapYear, 
  getDaysInMonth, 
  getArgentineHolidays, 
  MIN_YEAR, 
  MAX_YEAR 
} from './src/utils/calendarHolidays';
import { 
  DEFAULT_YEARLY_PHOTOS, 
  AVAILABLE_YEARS_GALLERY, 
  getYearlyPhotoForMonth, 
  MONTH_NAMES_ES 
} from './src/data/yearlyPhotos';

// Convierte un texto a mayúsculas limpias sin acentos en caso necesario
const removeUppercaseAccents = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/Á/g, 'A')
    .replace(/É/g, 'E')
    .replace(/Í/g, 'I')
    .replace(/Ó/g, 'O')
    .replace(/Ú/g, 'U');
};

const cleanUpper = (text: string | number | undefined | null): string => {
  if (text === undefined || text === null) return '';
  return String(text)
    .toUpperCase()
    .replace(/Á/g, 'A')
    .replace(/É/g, 'E')
    .replace(/Í/g, 'I')
    .replace(/Ó/g, 'O')
    .replace(/Ú/g, 'U');
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const HOLIDAYS_2027: Record<number, number[]> = {
  0: [1],
  1: [8, 9],
  2: [24, 25, 26],
  3: [2],
  4: [1, 25],
  5: [17, 20],
  6: [9],
  7: [16, 17],
  8: [],
  9: [11, 12],
  10: [20, 22],
  11: [8, 25]
};

const HOLIDAY_NAMES_2027: Record<string, string> = {
  "0-1": "Año Nuevo",
  "1-8": "Carnaval",
  "1-9": "Carnaval",
  "2-24": "Día Nacional de la Memoria por la Verdad y la Justicia",
  "2-25": "Jueves Santo",
  "2-26": "Viernes Santo",
  "3-2": "Día del Veterano y de los Caídos en Malvinas",
  "4-1": "Día del Trabajador",
  "4-25": "Día de la Revolución de Mayo",
  "5-17": "Paso a la Inmortalidad del Gral. Martín Miguel de Güemes",
  "5-20": "Paso a la Inmortalidad del Gral. Manuel Belgrano",
  "6-9": "Día de la Independencia",
  "7-16": "Paso a la Inmortalidad del Gral. José de San Martín (trasladado)",
  "7-17": "Paso a la Inmortalidad del Gral. José de San Martín",
  "9-11": "Día del Respeto a la Diversidad Cultural (trasladado)",
  "9-12": "Día del Respeto a la Diversidad Cultural",
  "10-20": "Día de la Soberanía Nacional",
  "10-22": "Día de la Soberanía Nacional (trasladado)",
  "11-8": "Inmaculada Concepción de María",
  "11-25": "Navidad"
};

const DEFAULT_COVER_IMAGE = "/cover.png";
const DEFAULT_COVER_IMAGE_EXTERNAL = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
const DEFAULT_COVER_FALLBACK = "https://i.ibb.co/27sqjDWg/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
const LANDSCAPE_INTRO_IMG = DEFAULT_COVER_IMAGE;
const APP_LOGO_SRC = "/logo.png";
const APP_LOGO_FALLBACK = DEFAULT_COVER_IMAGE_EXTERNAL;
const FALLBACK_IMG = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800";

interface HeaderTimeButtonProps {
  selectedCountry: CountryTimezone;
  onOpenModal: () => void;
  weatherInfo?: WeatherInfo | null;
}

const HeaderTimeButton: React.FC<HeaderTimeButtonProps> = ({ selectedCountry, onOpenModal, weatherInfo }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeState = getTimeInTimezone(selectedCountry.timeZone, now);

  return (
    <button
      id="header-timezone-btn"
      onClick={onOpenModal}
      className="px-2 sm:px-3 py-1 bg-stone-100/80 hover:bg-white text-stone-800 hover:text-stone-950 rounded-full border border-stone-200/80 transition-all flex items-center gap-1 sm:gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs group shrink-0"
      title={`Zona horaria y clima: ${selectedCountry.code} ${selectedCountry.city || selectedCountry.name} (${selectedCountry.offset}) · Temperatura: ${weatherInfo ? `${weatherInfo.temp}°C (${weatherInfo.description})` : 'Cargando...'} - Click para cambiar país o ciudad`}
    >
      <span className="text-xs sm:text-base">{selectedCountry.flag}</span>
      <span className="font-sans text-[11px] font-bold text-stone-800 hidden md:inline truncate max-w-[120px]">
        {selectedCountry.city || selectedCountry.name}
      </span>
      {weatherInfo && (
        <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-amber-800 bg-amber-50/90 px-1 sm:px-1.5 py-0.2 rounded-md font-semibold border border-amber-200/60 shadow-2xs">
          <span>{weatherInfo.icon}</span>
          <span className="font-mono">{weatherInfo.temp}°</span>
        </span>
      )}
      <span className="font-mono text-[10px] sm:text-[11px] text-terracotta-700 font-bold group-hover:text-terracotta-900 tabular-nums">
        {timeState.timeString}
      </span>
    </button>
  );
};

const App: React.FC = () => {
  const [isEmbeddedMode, setIsEmbeddedMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get('embed') === 'true' || params.get('blogger') === '1';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const v = params.get('view');
        if (v === 'day') return ViewMode.DAY_DETAIL;
        if (v === 'calendar') return ViewMode.CALENDAR;
      } catch {}
    }
    return ViewMode.INTRO;
  });
  const [currentDayIndex, setCurrentDayIndex] = useState(0); 
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [alarmActive, setAlarmActive] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [coverImage, setCoverImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('coverImage');
      if (saved && !saved.includes('unsplash.com') && !saved.includes('photo-') && !saved.includes('chgP73VC') && !saved.includes('qYyzPjVW') && !saved.includes('3mrwLdQM') && !saved.includes('IMG-20250830')) {
        return saved;
      }
    } catch {}
    return DEFAULT_COVER_IMAGE;
  });
  const [dailyImages, setDailyImages] = useState<Record<number, string>>({});
  const [monthlyImages, setMonthlyImages] = useState<Record<number, string>>({});
  const [customYearlyImages, setCustomYearlyImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('almanac_yearly_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [selectedGalleryYear, setSelectedGalleryYear] = useState<number | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('es');
  const [isBloggerModalOpen, setIsBloggerModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isFacebookModalOpen, setIsFacebookModalOpen] = useState(false);
  const [isThreadsModalOpen, setIsThreadsModalOpen] = useState(false);
  const [isSocialHubModalOpen, setIsSocialHubModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isYouTubeMusicOpen, setIsYouTubeMusicOpen] = useState(false);
  const [currentYouTubeTrack, setCurrentYouTubeTrack] = useState<YouTubeTrack | null>(null);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);

  // Zona horaria por país (El Calafate por defecto como solicitó el usuario)
  const [selectedCountry, setSelectedCountry] = useState<CountryTimezone>(() => {
    try {
      const savedJson = localStorage.getItem('almanaque_selected_country_json');
      if (savedJson) {
        const parsed = JSON.parse(savedJson);
        if (parsed && parsed.code) {
          // Si guardó anteriormente AR pero con el antiguo valor 'Buenos Aires', actualizar a El Calafate
          if (parsed.code === 'AR' && parsed.city === 'Buenos Aires') {
            return DEFAULT_COUNTRY;
          }
          return parsed;
        }
      }
      const savedCode = localStorage.getItem('almanaque_country_code');
      if (savedCode && savedCode !== 'AR') {
        const found = COUNTRIES_TIMEZONES.find(c => c.code === savedCode);
        if (found) return found;
      }
    } catch {}
    return DEFAULT_COUNTRY; // AR El Calafate (GMT-3)
  });
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);

  // Carga periódica del clima en vivo para la ciudad seleccionada
  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      if (selectedCountry.latitude !== undefined && selectedCountry.longitude !== undefined) {
        const w = await fetchLiveWeather(
          selectedCountry.latitude,
          selectedCountry.longitude,
          selectedCountry.timeZone
        );
        if (isMounted && w) {
          setWeatherInfo(w);
        }
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 10 * 60 * 1000); // 10 min
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedCountry.latitude, selectedCountry.longitude, selectedCountry.timeZone]);
  
  // Modales
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  
  // Sistema de Registro de Usuarios (Login) y Pasarela de Pagos
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('zen_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Usuario inicial para experiencia serena inmediata con 30 días de prueba gratuita
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    const initialUser: UserAccount = {
      id: 'zen-user-default',
      name: 'Alma Consciente',
      email: 'colibricolibricolibri75@gmail.com',
      plan: 'circulo',
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      paymentStatus: 'in_trial',
      paymentHistory: []
    };
    try {
      localStorage.setItem('zen_current_user', JSON.stringify(initialUser));
    } catch {}
    return initialUser;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [targetPlanForPayment, setTargetPlanForPayment] = useState<PlanCategory | 'apoyo' | 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'blogger'>('circulo');
  const [targetYearForPayment, setTargetYearForPayment] = useState<number | null>(null);
  const [customPaymentTitle, setCustomPaymentTitle] = useState<string | null>(null);
  const [customPaymentAmount, setCustomPaymentAmount] = useState<number | null>(null);
  const [initialCompletedPayment, setInitialCompletedPayment] = useState<PaymentRecord | null>(null);

  // Modal y Selector de Redes Sociales Oficiales con Lógica de $1.75 USD
  const [isSocialActionModalOpen, setIsSocialActionModalOpen] = useState(false);
  const [activeSocialNetworkAction, setActiveSocialNetworkAction] = useState<SocialNetworkKey>('instagram');

  const handleOpenSocialAction = (network: SocialNetworkKey = 'instagram') => {
    setActiveSocialNetworkAction(network);
    setIsSocialActionModalOpen(true);
  };

  // Modal de Conexión Consciente (Mapa interactivo de Wi-Fi gratuito con Leaflet y Overpass)
  const [isWifiMapOpen, setIsWifiMapOpen] = useState(false);

  const handleOpenPaymentWithCustomItem = (plan: PlanCategory | 'apoyo' | 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'blogger' = 'apoyo', customTitle?: string, customAmount?: number) => {
    setTargetPlanForPayment(plan);
    setTargetYearForPayment(null);
    setCustomPaymentTitle(customTitle || null);
    setCustomPaymentAmount(customAmount || null);
    setIsPaymentModalOpen(true);
  };
  const [unlockedYears, setUnlockedYears] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('zen_unlocked_years');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([2027, ...parsed]));
        }
      }
    } catch {}
    return [2027];
  });

  // Cálculo de días restantes de prueba gratuita
  const getTrialDaysRemaining = (): number => {
    if (!currentUser) return 0;
    if (currentUser.paymentStatus === 'active_paid') return 30;
    if (currentUser.paymentStatus === 'trial_expired') return 0;
    const end = new Date(currentUser.trialEndDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const isTrialExpired = currentUser 
    ? (currentUser.paymentStatus === 'trial_expired' || (currentUser.paymentStatus === 'in_trial' && getTrialDaysRemaining() <= 0))
    : false;

  const handleSimulateTrialExpired = () => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      paymentStatus: 'trial_expired'
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('zen_current_user', JSON.stringify(updated));
    } catch {}
    showToast("⚠️ Modo de prueba vencida activado: La pasarela de pagos ahora es requerida.");
  };

  const handleResetTrial = () => {
    if (!currentUser) return;
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    const updated: UserAccount = {
      ...currentUser,
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      paymentStatus: 'in_trial'
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('zen_current_user', JSON.stringify(updated));
    } catch {}
    showToast("✨ 30 días de prueba gratuita restablecidos.");
  };

  const handlePaymentSuccess = (payment: PaymentRecord) => {
    let user = currentUser;
    if (!user) {
      try {
        const stored = localStorage.getItem('zen_current_user');
        if (stored) user = JSON.parse(stored);
      } catch {}
    }
    if (!user) {
      const now = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 30);
      user = {
        id: `zen-${Date.now()}`,
        name: 'Alma Consciente',
        email: 'colibricolibricolibri75@gmail.com',
        plan: (payment.planId as PlanCategory) || 'circulo',
        trialStartDate: now.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        paymentStatus: 'active_paid',
        paymentHistory: []
      };
    }

    const yearToUnlock = payment.targetYear || targetYearForPayment;
    let nextUnlocked = unlockedYears;
    if (yearToUnlock) {
      nextUnlocked = Array.from(new Set([...unlockedYears, yearToUnlock]));
      setUnlockedYears(nextUnlocked);
      try {
        localStorage.setItem('zen_unlocked_years', JSON.stringify(nextUnlocked));
      } catch {}
    }

    const isSpecialIndependent = 
      payment.planId === 'apoyo' || 
      payment.planId === 'tiktok' || 
      payment.planId === 'youtube' || 
      payment.planId === 'instagram' || 
      payment.planId === 'facebook' || 
      payment.planId === 'blogger' || 
      payment.planId === 'video_individual';

    if (payment.planId === 'tiktok' || payment.planName.toLowerCase().includes('tiktok')) {
      try {
        localStorage.setItem('almanaque_tiktok_access', 'true');
      } catch {}
      showToast("🎉 ¡Gracias por tu compra! Tu acceso a las reflexiones de TikTok ha sido confirmado.");
    }
    if (payment.planId === 'youtube' || payment.planName.toLowerCase().includes('youtube')) {
      try {
        localStorage.setItem('almanaque_youtube_access', 'true');
      } catch {}
      showToast("🎉 ¡Gracias por tu compra! Tu acceso al módulo de YouTube ha sido confirmado.");
    }
    if (payment.planId === 'instagram' || payment.planName.toLowerCase().includes('instagram')) {
      try {
        localStorage.setItem('almanaque_instagram_access', 'true');
      } catch {}
      showToast("🎉 ¡Gracias por tu compra! Tu pase de Instagram ($1.75 USD) ha sido confirmado y registrado.");
    }
    if (payment.planId === 'facebook' || payment.planName.toLowerCase().includes('facebook')) {
      try {
        localStorage.setItem('almanaque_facebook_access', 'true');
      } catch {}
      showToast("🎉 ¡Gracias por tu compra! Tu pase de Facebook ($1.75 USD) ha sido confirmado y registrado.");
    }
    if (payment.planId === 'blogger' || payment.planName.toLowerCase().includes('blogger')) {
      try {
        localStorage.setItem('almanaque_blogger_access', 'true');
      } catch {}
      showToast("🎉 ¡Gracias por tu compra! Tu pase de Blogger ($1.75 USD) ha sido confirmado y registrado.");
    }

    const updated: UserAccount = {
      ...user,
      plan: isSpecialIndependent ? user.plan : (payment.planId as PlanCategory),
      paymentStatus: isSpecialIndependent ? user.paymentStatus : 'active_paid',
      unlockedYears: nextUnlocked,
      paymentHistory: [payment, ...(user.paymentHistory || [])]
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('zen_current_user', JSON.stringify(updated));
      localStorage.setItem('zen_active_membership', JSON.stringify({
        planId: payment.planId,
        planName: payment.planName,
        price: payment.amount,
        status: 'active_paid',
        paymentDate: payment.date,
        unlockedYears: nextUnlocked
      }));
    } catch {}

    if (yearToUnlock) {
      setSelectedYear(yearToUnlock);
      setTargetYearForPayment(null);
      showToast(`✨ ¡Pago de $${payment.amount.toFixed(2)} USD verificado! La anualidad del Año ${yearToUnlock} ha sido desbloqueada.`);
    } else {
      showToast(`✨ ¡Pago de $${payment.amount.toFixed(2)} USD verificado! Tu suscripción a ${payment.planName} está activa.`);
    }
  };

  // Detección y validación automática de retornos de pasarelas de pago (Mercado Pago Checkout Pro / PayPal)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment') || params.get('status') || params.get('collection_status');
      const gateway = params.get('gateway');
      const paymentId = params.get('payment_id') || params.get('collection_id');
      const planFromUrl = params.get('plan');

      // 0. CONTROL DE CANCELACIÓN O RECHAZO: NO DESCARGAR NI DAR ACCESO NUNCA
      if (
        paymentStatus === 'cancelled' || 
        paymentStatus === 'rejected' || 
        paymentStatus === 'failure' || 
        params.get('collection_status') === 'rejected' ||
        params.get('collection_status') === 'null' ||
        params.get('status') === 'rejected'
      ) {
        showToast("⚠️ La operación de pago fue cancelada o no fue aprobada. No se debitó dinero ni se otorgó acceso.");
        try {
          localStorage.removeItem('zen_pending_mp_payment');
          localStorage.removeItem('zen_pending_paypal_payment');
          clearPaymentParamsFromUrl();
        } catch {}
        return;
      }

      // 1. RETORNO DE MERCADO PAGO: SÓLO SE ACTIVA SI EL ESTADO ES APROBADO ('approved')
      const isMpApproved = (params.get('collection_status') === 'approved' || params.get('status') === 'approved' || paymentStatus === 'approved' || (paymentStatus === 'success' && gateway === 'mercadopago'));
      if (isMpApproved && (gateway === 'mercadopago' || paymentId || localStorage.getItem('zen_pending_mp_payment'))) {
        const pendingRaw = localStorage.getItem('zen_pending_mp_payment');
        const pending = pendingRaw ? JSON.parse(pendingRaw) : null;
        
        // Protección contra intentos de acceso sin pago real iniciado
        if (!pending && !paymentId) {
          clearPaymentParamsFromUrl();
          return;
        }

        const resolvedPlan = (pending?.planId || planFromUrl || 'circulo') as PlanCategory;
        const resolvedPlanName = pending?.planName || 'Membresía Almanaque de Paz';
        const targetYear = pending?.targetYear || null;

        const record: PaymentRecord = {
          id: `ZEN-MP-${paymentId || Math.floor(100000 + Math.random() * 900000)}`,
          planId: resolvedPlan,
          planName: resolvedPlanName,
          amount: pending?.amountUSD || 2.25,
          currency: 'USD',
          localCurrencyAmount: pending?.amountARS,
          localCurrency: 'ARS',
          date: new Date().toISOString(),
          paymentMethod: 'mercadopago',
          gateway: 'mercadopago_checkout_pro',
          status: 'completed',
          targetYear: targetYear || undefined,
          preferenceId: pending?.preferenceId || params.get('preference_id') || undefined,
          billingFrequency: targetYear ? 'annual' : 'monthly',
          termsAcceptedAt: pending?.termsAcceptedAt || new Date().toISOString()
        };

        if (paymentId) {
          verifyMercadoPagoPaymentOnServer(paymentId).catch(() => {});
        }

        // Desbloquear suscripción y permisos
        handlePaymentSuccess(record);

        // Disparar descarga automática compatible con celulares
        triggerAutomaticCategoryDownload(record);

        // Abrir modal de confirmación oficial con visor en pantalla y copiado al celular
        setInitialCompletedPayment(record);
        setIsPaymentModalOpen(true);

        try {
          localStorage.removeItem('zen_pending_mp_payment');
          clearPaymentParamsFromUrl();
        } catch {}
      }

      // 2. RETORNO DE PAYPAL: SÓLO SI EL ESTADO ES APROBADO Y CAPTURADO COMO 'COMPLETED'
      const isPpApproved = (paymentStatus === 'success' || paymentStatus === 'approved' || params.get('st') === 'Completed') && (gateway === 'paypal' || params.get('tx') || params.get('token'));
      if (isPpApproved) {
        const token = params.get('token') || params.get('order_id') || params.get('tx');
        const pendingRaw = localStorage.getItem('zen_pending_paypal_payment');
        const pending = pendingRaw ? JSON.parse(pendingRaw) : null;
        const resolvedOrderId = token || pending?.orderId;

        if (resolvedOrderId) {
          capturePayPalOrderOnServer(resolvedOrderId).then((capRes) => {
            if (capRes && (capRes.success || capRes.status === 'COMPLETED' || (capRes as any).details?.status === 'COMPLETED')) {
              const record: PaymentRecord = {
                id: `ZEN-PP-${resolvedOrderId}`,
                planId: (pending?.planId || planFromUrl || 'circulo') as PlanCategory,
                planName: pending?.planName || 'Membresía Almanaque de Paz',
                amount: pending?.amountUSD || 2.39,
                currency: 'USD',
                date: new Date().toISOString(),
                paymentMethod: 'paypal',
                gateway: 'paypal_checkout',
                status: 'completed',
                targetYear: pending?.targetYear || undefined,
                orderId: resolvedOrderId,
                billingFrequency: pending?.targetYear ? 'annual' : 'monthly',
                termsAcceptedAt: pending?.termsAcceptedAt || new Date().toISOString()
              };

              handlePaymentSuccess(record);
              triggerAutomaticCategoryDownload(record);
              setInitialCompletedPayment(record);
              setIsPaymentModalOpen(true);

              showToast("✨ ¡Pago verificado con éxito por PayPal! Acceso y descarga concedidos.");
            } else {
              showToast("⚠️ PayPal no confirmó la captura del dinero. No se otorgó acceso ni se descargaron archivos.");
            }
          }).catch((err) => {
            console.error('Error al capturar orden PayPal:', err);
            showToast("⚠️ Error al validar cobro con PayPal.");
          }).finally(() => {
            try {
              localStorage.removeItem('zen_pending_paypal_payment');
              clearPaymentParamsFromUrl();
            } catch {}
          });
        }
      }
    } catch (e) {
      console.warn('Error al verificar retorno de pasarela:', e);
    }
  }, [currentUser, unlockedYears]);

  // Sanitización de la barra de direcciones: elimina tokens técnicos de previsualización silenciosamente
  useEffect(() => {
    sanitizeBrowserAddressBar();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('zen_current_user');
    } catch {}
    setCurrentUser(null);
    showToast("Has cerrado sesión.");
  };

  const [tierLockInfo, setTierLockInfo] = useState<{
    isOpen: boolean;
    featureName: string;
    reason: string;
    minPlanId: PlanCategory;
    minPriceStr: string;
    targetYear?: number;
  }>({
    isOpen: false,
    featureName: '',
    reason: '',
    minPlanId: 'cat1',
    minPriceStr: '$2.25'
  });

  const requireAccess = (checkResult: AccessCheckResult, onAllowed: () => void) => {
    // 1. Verificación obligatoria de Inicio de Sesión
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast("🔐 Debes iniciar sesión con tu cuenta para acceder a esta función.");
      return;
    }

    // 2. Control de prueba expirada
    if (isTrialExpired) {
      setIsPaymentModalOpen(true);
      showToast("🔒 Tu período de prueba gratis ha concluido. Activa tu suscripción para continuar.");
      return;
    }

    // 3. Control de acceso por Nivel y Pago
    if (!checkResult.allowed) {
      // Si el motivo es falta de membresía activa paga, abrir pasarela directamente
      if (currentUser.paymentStatus !== 'active_paid') {
        setTargetPlanForPayment(checkResult.minPlanId || 'cat2');
        setIsPaymentModalOpen(true);
        showToast(`🔒 ${checkResult.reason}`);
        return;
      }

      setTierLockInfo({
        isOpen: true,
        featureName: checkResult.featureName,
        reason: checkResult.reason,
        minPlanId: checkResult.minPlanId,
        minPriceStr: checkResult.minPriceStr,
        targetYear: checkResult.targetYear
      });
      if (checkResult.targetYear) {
        setTargetYearForPayment(checkResult.targetYear);
      }
      showToast(`🔒 ${checkResult.reason}`);
      return;
    }
    onAllowed();
  };

  const handleSetPlanAndStatus = (plan: PlanCategory, status: 'in_trial' | 'active_paid' | 'trial_expired') => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      plan,
      paymentStatus: status
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('zen_current_user', JSON.stringify(updated));
    } catch {}
    const tierName = status === 'in_trial' ? 'Mes Gratis (Básico)' : `Pago Premium (${plan})`;
    showToast(`🔄 Modo de prueba actualizado: ${tierName}`);
  };

  const handleProtectedAction = (actionCallback: () => void) => {
    if (isTrialExpired) {
      setIsPaymentModalOpen(true);
      showToast("🔒 Tu mes de prueba gratis ha concluido. Activa tu suscripción para continuar.");
      return;
    }
    actionCallback();
  };
  
  const toastTimeoutRef = useRef<any>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const dailyFileInputRef = useRef<HTMLInputElement>(null);
  const monthFileInputRef = useRef<HTMLInputElement>(null);
  const yearlyFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDayNum, setUploadingDayNum] = useState<number | null>(null);
  const [uploadingMonthIdx, setUploadingMonthIdx] = useState<number | null>(null);
  const [uploadingYearPhoto, setUploadingYearPhoto] = useState<{ year: number; month: number } | null>(null);
  
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const ambientAudioRef = useRef<{
    ctx: AudioContext;
    gainNode: GainNode;
    oscillators: OscillatorNode[];
  } | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Helper para obtener la imagen del mes (Enero -> Día 1, Febrero -> Día 2, etc., con soporte para años 2028-2033+)
  const getMonthImage = (mIdx: number, year: number = selectedYear): string => {
    const correspondingDayNum = mIdx + 1;
    const customKey = `${year}_${correspondingDayNum}`;
    if (customYearlyImages[customKey]) {
      return customYearlyImages[customKey];
    }
    const yearlyPhoto = getYearlyPhotoForMonth(year, correspondingDayNum, customYearlyImages);
    if (yearlyPhoto && yearlyPhoto.imageUrl) {
      return yearlyPhoto.imageUrl;
    }
    return monthlyImages[mIdx] || dailyImages[correspondingDayNum] || DAYS_CONTENT[mIdx]?.image || FALLBACK_IMG;
  };

  // Helper para obtener la imagen de un día específico
  const getDayImage = (dayNum: number, mIdx: number = currentMonthIdx, year: number = selectedYear): string => {
    const customKey = `${year}_${mIdx + 1}`;
    if (customYearlyImages[customKey]) return customYearlyImages[customKey];
    const yearlyPhoto = getYearlyPhotoForMonth(year, mIdx + 1, customYearlyImages);
    if (yearlyPhoto && yearlyPhoto.imageUrl) return yearlyPhoto.imageUrl;

    if (dailyImages[dayNum]) return dailyImages[dayNum];
    if (dayNum >= 1 && dayNum <= 12 && monthlyImages[dayNum - 1]) {
      return monthlyImages[dayNum - 1];
    }
    if (monthlyImages[mIdx]) return monthlyImages[mIdx];
    const cIdx = (dayNum - 1) % DAYS_CONTENT.length;
    return DAYS_CONTENT[cIdx]?.image || FALLBACK_IMG;
  };

  // Disparador para subir foto de un mes específico (Enero -> Día 1, Febrero -> Día 2...)
  const triggerMonthUpload = (mIdx: number) => {
    requireAccess(checkPhotoUploadAccess(currentUser), () => {
      setUploadingMonthIdx(mIdx);
      monthFileInputRef.current?.click();
    });
  };

  // Disparador para subir/cambiar foto de un año y mes específico (2028 a 2033+)
  const triggerYearlyUpload = (year: number, monthNum: number) => {
    requireAccess(checkPhotoUploadAccess(currentUser), () => {
      setUploadingYearPhoto({ year, month: monthNum });
      yearlyFileInputRef.current?.click();
    });
  };

  // Estado para el año activo (2027 a 3037 con soporte de bisiestos y feriados argentinos)
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('app_selected_year');
      if (saved) {
        const y = parseInt(saved, 10);
        if (y >= MIN_YEAR && y <= MAX_YEAR) return y;
      }
    } catch {}
    return 2027;
  });

  const handleSelectYear = (year: number) => {
    const validYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
    if (validYear > 2027) {
      const yearCheck = checkYearAccess(currentUser, validYear, unlockedYears);
      if (!yearCheck.allowed) {
        setTargetYearForPayment(validYear);
        requireAccess(yearCheck, () => {});
        return;
      }
    }
    setSelectedYear(validYear);
    try {
      localStorage.setItem('app_selected_year', String(validYear));
    } catch {}
    const isLeap = isLeapYear(validYear);
    showToast(`📅 Año ${validYear} ${isLeap ? '(Bisiesto · Febrero con 29 días)' : ''}`);
  };

  // Cálculo de feriados nacionales argentinos y estado de año bisiesto para el año seleccionado
  const yearHolidayData = useMemo(() => getArgentineHolidays(selectedYear), [selectedYear]);
  const activeHolidays = yearHolidayData.holidays;
  const activeHolidayNames = yearHolidayData.holidayNames;
  const isCurrentYearLeap = yearHolidayData.isLeap;

  // Cálculo de días válidos para el año seleccionado en el mes activo
  const daysInCurrentMonth = getDaysInMonth(selectedYear, currentMonthIdx);
  const safeDayNum = Math.min(Math.max(1, currentDayIndex + 1), daysInCurrentMonth);
  const contentIdx = (safeDayNum - 1) % DAYS_CONTENT.length;
  const currentDay = DAYS_CONTENT[contentIdx] || DAYS_CONTENT[0];
  const currentDayNum = safeDayNum;
  
  const activeMonthImage = getMonthImage(currentMonthIdx);
  const displayedImage = dailyImages[currentDayNum] || activeMonthImage;
  const backgroundImage = (view === ViewMode.INTRO) ? (coverImage || activeMonthImage || LANDSCAPE_INTRO_IMG) : (view === ViewMode.DAY_DETAIL ? displayedImage : (coverImage || LANDSCAPE_INTRO_IMG));

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    if (target.src.includes('cover.png')) {
      target.src = DEFAULT_COVER_IMAGE_EXTERNAL;
    } else if (target.src.includes('Y7y2tzPp')) {
      target.src = DEFAULT_COVER_FALLBACK;
    } else if (target.src !== '/logo.png') {
      target.src = '/logo.png';
    }
  };

  // Navegación fluida con soporte para historial del navegador y botón Volver
  const navigateToView = (newView: ViewMode) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const cleanUrl = getCleanAppUrl();
      window.history.pushState({ view: newView }, '', cleanUrl);
    } catch {}
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setView(e.state.view);
      } else {
        setView(ViewMode.INTRO);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Limpieza y validación de caché / integridad de almacenamiento local
  useEffect(() => {
    try {
      const keysToVerify = [
        'zen_current_user',
        'zen_registered_users',
        'zen_active_membership',
        'healing_journal_entries',
        'zen_today_tasks',
        'almanaque_selected_country_json'
      ];
      keysToVerify.forEach(key => {
        try {
          const raw = localStorage.getItem(key);
          if (raw !== null) {
            JSON.parse(raw);
          }
        } catch {
          // Si una clave de caché está corrupta, se elimina para evitar errores
          localStorage.removeItem(key);
        }
      });
    } catch {}
  }, []);

  // Generador de audio ambiental zen nativo (432Hz Web Audio API)
  const startZenAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        showToast("Audio no soportado en este navegador.");
        return;
      }
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 2.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      // Frecuencias armónicas afinadas a 432 Hz para serenidad profunda
      const freqs = [108.0, 162.0, 216.0, 324.0];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.detune.setValueAtTime((idx % 2 === 0 ? 2 : -2) + (idx * 1.2), ctx.currentTime);
        oscGain.gain.setValueAtTime(0.18 / freqs.length, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      ambientAudioRef.current = { ctx, gainNode: masterGain, oscillators: oscs };
      setIsMusicPlaying(true);
      showToast("🎶 Música zen ambiental (432 Hz) activada.");
    } catch (e) {
      console.warn("Audio zen error:", e);
      showToast("Toca la pantalla para activar el sonido.");
    }
  };

  const stopZenAmbient = () => {
    if (ambientAudioRef.current) {
      try {
        const { ctx, gainNode, oscillators } = ambientAudioRef.current;
        const curGain = Math.max(0.0001, gainNode.gain.value);
        gainNode.gain.setValueAtTime(curGain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
        setTimeout(() => {
          oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch(e){} });
          ctx.close().catch(() => {});
        }, 1100);
      } catch (e) {
        console.warn(e);
      }
      ambientAudioRef.current = null;
    }
    setIsMusicPlaying(false);
    showToast("Música ambiental pausada.");
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopZenAmbient();
    } else {
      requireAccess(checkAudio432Access(currentUser), () => {
        if (isYouTubePlaying) {
          setIsYouTubePlaying(false);
          showToast("Pausando YouTube para reproducir tono 432 Hz.");
        }
        startZenAmbient();
      });
    }
  };

  // Manejo de música clásica y zen desde YouTube
  const handleSelectYouTubeTrack = (track: YouTubeTrack) => {
    if (isMusicPlaying) {
      stopZenAmbient();
    }
    setCurrentYouTubeTrack(track);
    setIsYouTubePlaying(true);
    showToast(`🎶 Reproduciendo "${track.title}" de YouTube`);
  };

  const handleToggleYouTubePlay = () => {
    if (!currentYouTubeTrack) {
      handleSelectYouTubeTrack(CURATED_YOUTUBE_TRACKS[0]);
      return;
    }
    setIsYouTubePlaying(!isYouTubePlaying);
  };

  const handleStopYouTube = () => {
    setIsYouTubePlaying(false);
    setCurrentYouTubeTrack(null);
    showToast("Música de YouTube detenida.");
  };

  // Sonido de campana tibetana suave
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(432, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(864, audioCtx.currentTime + 0.8);
      gainNode.gain.setValueAtTime(0.10, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.8);
      setTimeout(() => {
        audioCtx.close().catch(() => {});
      }, 1900);
    } catch (e) { 
      console.warn("Audio no disponible", e); 
    }
  };

  // Recordatorio de paz cada 15 minutos
  useEffect(() => {
    if (!alarmActive) return;
    const interval = setInterval(() => {
      playChime();
      showToast("🔔 Momento de calma: Respira profundo y abraza tu corazón.");
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [alarmActive]);

  useEffect(() => {
    try {
      const savedCover = localStorage.getItem('coverImage');
      if (savedCover && !savedCover.includes('unsplash.com') && !savedCover.includes('photo-') && !savedCover.includes('chgP73VC') && !savedCover.includes('qYyzPjVW') && !savedCover.includes('3mrwLdQM') && !savedCover.includes('IMG-20250830')) {
        setCoverImage(savedCover);
      } else {
        setCoverImage(DEFAULT_COVER_IMAGE);
      }
      
      const savedDailyImages = localStorage.getItem('dailyImages');
      const savedMonthlyImages = localStorage.getItem('monthlyImages');
      
      let initialDaily: Record<number, string> = {};
      let initialMonthly: Record<number, string> = {};
      
      if (savedDailyImages) { 
        try { initialDaily = JSON.parse(savedDailyImages); } catch {}
      }
      if (savedMonthlyImages) {
        try { initialMonthly = JSON.parse(savedMonthlyImages); } catch {}
      }

      // Sincronización automática: Día 1 <-> Enero (0), Día 2 <-> Febrero (1)... Día 12 <-> Diciembre (11)
      for (let m = 0; m < 12; m++) {
        const d = m + 1;
        if (initialMonthly[m] && !initialDaily[d]) {
          initialDaily[d] = initialMonthly[m];
        } else if (initialDaily[d] && !initialMonthly[m]) {
          initialMonthly[m] = initialDaily[d];
        }
      }

      setDailyImages(initialDaily);
      setMonthlyImages(initialMonthly);

      const savedLang = localStorage.getItem('app_language');
      if (savedLang && ['es', 'en', 'pt', 'it', 'fr'].includes(savedLang)) {
        setLang(savedLang as Language);
      }
    } catch (e) { 
      console.error(e); 
    }

    return () => {
      if (ambientAudioRef.current) {
        try { ambientAudioRef.current.ctx.close(); } catch(e){}
      }
    };
  }, []);

  const safeSetLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Almacenamiento local completo", e);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    safeSetLocalStorage('app_language', newLang);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCoverImage(base64);
        safeSetLocalStorage('coverImage', base64);
        showToast("✨ Foto de portada actualizada.");
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleMonthFileChange = (e: React.ChangeEvent<HTMLInputElement>, monthIdx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const correspondingDayNum = monthIdx + 1;
        const newMonthly = { ...monthlyImages, [monthIdx]: base64 };
        const newDaily = { ...dailyImages, [correspondingDayNum]: base64 };
        setMonthlyImages(newMonthly);
        setDailyImages(newDaily);
        safeSetLocalStorage('monthlyImages', JSON.stringify(newMonthly));
        safeSetLocalStorage('dailyImages', JSON.stringify(newDaily));
        const monthName = MONTH_NAMES[monthIdx];
        showToast(`✨ Foto de ${monthName} (Día ${correspondingDayNum}) guardada con éxito.`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDailyFileChange = (e: React.ChangeEvent<HTMLInputElement>, dayNum: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newDaily = { ...dailyImages, [dayNum]: base64 };
        setDailyImages(newDaily);
        safeSetLocalStorage('dailyImages', JSON.stringify(newDaily));

        // Si el día está entre 1 y 12, sincroniza también con el mes correspondiente
        if (dayNum >= 1 && dayNum <= 12) {
          const monthIdx = dayNum - 1;
          const newMonthly = { ...monthlyImages, [monthIdx]: base64 };
          setMonthlyImages(newMonthly);
          safeSetLocalStorage('monthlyImages', JSON.stringify(newMonthly));
          showToast(`✨ Foto de ${MONTH_NAMES[monthIdx]} (Día ${dayNum}) guardada.`);
        } else {
          showToast(`✨ Foto del Día ${dayNum} guardada.`);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleYearlyFileChange = (e: React.ChangeEvent<HTMLInputElement>, year: number, monthNum: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const key = `${year}_${monthNum}`;
        const updated = { ...customYearlyImages, [key]: base64 };
        setCustomYearlyImages(updated);
        safeSetLocalStorage('almanac_yearly_images', JSON.stringify(updated));
        const monthName = MONTH_NAMES[monthNum - 1] || `Mes ${monthNum}`;
        showToast(`✨ Foto de ${monthName} (Mes ${monthNum}) del Año ${year} guardada con éxito.`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const selectDay = (dayIdx: number, monthIdx?: number) => {
    const targetMonth = monthIdx !== undefined ? monthIdx : currentMonthIdx;
    const maxDays = getDaysInMonth(selectedYear, targetMonth);
    const clampedDayIdx = Math.max(0, Math.min(dayIdx, maxDays - 1));
    const targetDayNum = clampedDayIdx + 1;

    const dayCheck = checkDayAccess(currentUser, targetDayNum);
    if (!dayCheck.allowed) {
      requireAccess(dayCheck, () => {});
      return;
    }
    
    setCurrentDayIndex(clampedDayIdx);
    if (monthIdx !== undefined) setCurrentMonthIdx(monthIdx);
    setView(ViewMode.DAY_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextDay = () => {
    if (currentDayNum < daysInCurrentMonth) {
      selectDay(currentDayNum, currentMonthIdx);
    } else if (currentMonthIdx < 11) {
      selectDay(0, currentMonthIdx + 1);
    } else if (selectedYear < MAX_YEAR) {
      handleSelectYear(selectedYear + 1);
      setCurrentMonthIdx(0);
      selectDay(0, 0);
    }
  };

  const goToPrevDay = () => {
    if (currentDayNum > 1) {
      selectDay(currentDayNum - 2, currentMonthIdx);
    } else if (currentMonthIdx > 0) {
      const daysInPrevMonth = getDaysInMonth(selectedYear, currentMonthIdx - 1);
      selectDay(daysInPrevMonth - 1, currentMonthIdx - 1);
    } else if (selectedYear > MIN_YEAR) {
      const prevYear = selectedYear - 1;
      handleSelectYear(prevYear);
      const decDays = getDaysInMonth(prevYear, 11);
      setCurrentMonthIdx(11);
      selectDay(decDays - 1, 11);
    }
  };

  const handleChangeMonth = (delta: number) => {
    let nextMonth = currentMonthIdx + delta;
    if (nextMonth > 11) {
      if (selectedYear < MAX_YEAR) {
        handleSelectYear(selectedYear + 1);
        setCurrentMonthIdx(0);
      }
    } else if (nextMonth < 0) {
      if (selectedYear > MIN_YEAR) {
        handleSelectYear(selectedYear - 1);
        setCurrentMonthIdx(11);
      }
    } else {
      setCurrentMonthIdx(nextMonth);
    }
  };

  const handleShare = async () => {
    const cleanUrl = getShareableUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Almanaque de Amor Propio y Autoestima",
          text: "Te comparto este espacio de paz, respiración y amor interior.",
          url: cleanUrl,
        });
      } catch (err) {
        showToast("Enlace listo para compartir.");
      }
    } else {
      navigator.clipboard?.writeText(cleanUrl);
      showToast("✨ Enlace copiado al portapapeles.");
    }
  };

  const handleShareToFacebook = (targetDay?: typeof currentDay, targetDayNum?: number) => {
    const dNum = targetDayNum || currentDayNum;
    const mantra = targetDay ? targetDay.mantra : currentDay.mantra;
    const shareUrl = getShareableUrl({ day: String(dNum), view: 'day' });

    const quote = `Día ${dNum} - "${mantra}" · Almanaque de Amor Propio y Autoestima`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(quote)}`;
    
    const width = 640;
    const height = 480;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      fbUrl,
      'facebook-share-dialog',
      `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
    );
  };

  // Header sereno, moderno y de cristal esmerilado
  const renderHeader = () => {
    const line1 = t.name;
    const line2 = lang === 'en' ? 'Self-Love' : (lang === 'pt' ? 'Amor-Próprio' : 'Amor Propio');
    const line3 = lang === 'en' ? 'and Self-Esteem' : (lang === 'pt' ? 'e Autoestima' : 'y Autoestima');

    return (
      <header className="app-header px-2.5 sm:px-5 py-1.5 sm:py-2 glass-panel sticky top-2 mx-auto my-1.5 sm:my-2 z-40 rounded-full flex justify-between items-center min-h-[48px] sm:min-h-[60px] shadow-[0_8px_30px_rgba(46,39,33,0.06)] border border-white/85 transition-all w-[calc(100%-12px)] sm:w-[calc(100%-24px)] max-w-7xl box-border">
        <div 
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0" 
          onClick={() => navigateToView(ViewMode.INTRO)}
          title="Ir al inicio del Almanaque"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sand-100 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden ring-1 ring-sand-300/80 shrink-0">
            <img 
              src={APP_LOGO_SRC} 
              alt="Logo Almanaque de Amor Propio y Autoestima" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = APP_LOGO_FALLBACK;
              }}
            />
          </div>
          <div className="flex flex-col justify-center min-w-0 pr-1">
            <h1 className="text-xs sm:text-sm md:text-[15px] font-serif font-bold text-sand-900 leading-tight whitespace-nowrap">
              {line1}
            </h1>
            <span className="text-[9px] sm:text-[11px] text-terracotta-700 tracking-wider font-medium leading-tight whitespace-nowrap hidden lg:inline">
              {line2} {line3}
            </span>
          </div>
        </div>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Botón Volver prominente cuando se está en el Calendario u otra vista */}
        {view !== ViewMode.INTRO && (
          <button
            onClick={() => navigateToView(ViewMode.INTRO)}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="Volver a la portada principal del Almanaque"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Volver al Inicio</span>
            <span className="xs:hidden">Inicio</span>
          </button>
        )}

        {/* Selector de País & Zona Horaria (El Calafate por defecto) */}
        <HeaderTimeButton
          selectedCountry={selectedCountry}
          onOpenModal={() => setIsTimezoneModalOpen(true)}
          weatherInfo={weatherInfo}
        />

        {/* Selector de idioma sutil */}
        <div className="relative group">
          <button 
            className="p-2 text-sand-600 hover:text-sand-900 rounded-full hover:bg-sand-200/60 transition-all flex items-center gap-1 text-xs font-semibold"
            title="Cambiar idioma"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase text-[11px] hidden sm:inline">{lang}</span>
          </button>
          <div className="absolute right-0 top-full mt-1 bg-white border border-sand-200 rounded-2xl shadow-lg p-1.5 hidden group-hover:block z-50 min-w-[120px]">
            {(['es', 'en', 'pt', 'it', 'fr'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors ${lang === l ? 'bg-sand-100 font-bold text-terracotta-700' : 'text-sand-700 hover:bg-sand-50'}`}
              >
                {l === 'es' && '🇪🇸 Español'}
                {l === 'en' && '🇬🇧 English'}
                {l === 'pt' && '🇵🇹 Português'}
                {l === 'it' && '🇮🇹 Italiano'}
                {l === 'fr' && '🇫🇷 Français'}
              </button>
            ))}
          </div>
        </div>

        {/* Botón de Perfil de Usuario / Login / Estado de Prueba */}
        <button
          id="header-user-btn"
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            currentUser
              ? currentUser.paymentStatus === 'active_paid'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : isTrialExpired
                ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 animate-pulse'
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
          title={currentUser ? `Cuenta: ${currentUser.name} (${currentUser.email}) - Click para ver detalles o simular vencimiento` : "Iniciar Sesión o Registrarse"}
        >
          <User className="w-3.5 h-3.5" />
          {currentUser ? (
            <span className="flex items-center gap-1">
              <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
              {currentUser.paymentStatus === 'active_paid' ? (
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">Activo</span>
              ) : isTrialExpired ? (
                <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-bold">Pagar</span>
              ) : (
                <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded-full font-bold">{getTrialDaysRemaining()}d</span>
              )}
            </span>
          ) : (
            <span className="hidden sm:inline">Ingresar</span>
          )}
        </button>

        {/* Botón Billetera (Pasarela de Pagos) */}
        <button
          id="header-payment-gateway-btn"
          onClick={() => {
            if (currentUser) setTargetPlanForPayment(currentUser.plan);
            setIsPaymentModalOpen(true);
          }}
          className="px-2 sm:px-2.5 py-1 bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-medium text-xs rounded-full shadow-2xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Billetera (Pasarela de Pagos y Suscripciones)"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Billetera</span>
        </button>

        {/* Centro Sagrado de Redes y Comunidad (Unificado para no recargar la visual en Celular, Tablet y Notebook) */}
        <div className="relative group">
          <button
            id="header-social-hub-btn"
            onClick={() => setIsSocialHubModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-100/90 hover:bg-stone-200/90 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
            title="Redes de Amor Propio: Instagram, Facebook, Threads, Blogger, TikTok y YouTube"
          >
            <Share2 className="w-3.5 h-3.5 text-terracotta-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Redes</span>
            <span className="text-[10px] bg-terracotta-600 text-white px-1.5 py-0.2 rounded-full font-bold">
              6
            </span>
          </button>

          {/* Menú Flotante Rápido en Notebook y Tablet (Hover / Toque) */}
          <div className="absolute right-0 top-full mt-1.5 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-xl p-2 hidden group-hover:flex flex-col gap-1 z-50 min-w-[220px] animate-fade-in">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1 flex items-center justify-between">
              <span>Redes de Amor</span>
              <span className="text-terracotta-600 font-bold">6 Canales</span>
            </div>
            
            <button
              onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true))}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-900">Instagram</span>
                <span className="text-[10px] text-stone-400">Historias y Carruseles</span>
              </div>
            </button>

            <button
              onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsFacebookModalOpen(true))}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Facebook className="w-3.5 h-3.5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-900">Facebook</span>
                <span className="text-[10px] text-stone-400">Grupos y Muro</span>
              </div>
            </button>

            <button
              onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsThreadsModalOpen(true))}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <span className="font-serif font-black text-xs leading-none">@</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-900">Threads (@teread)</span>
                <span className="text-[10px] text-stone-400">Micro-hilos de Paz</span>
              </div>
            </button>

            <button
              onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsBloggerModalOpen(true))}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-900">Blogger</span>
                <span className="text-[10px] text-stone-400">Entradas y Gadgets</span>
              </div>
            </button>

            <button
              onClick={() => {
                setView(ViewMode.TIKTOK);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-stone-100 hover:text-rose-600 transition-colors text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-stone-950 text-rose-300 flex items-center justify-center shrink-0 shadow-2xs">
                <Video className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-900">TikTok ($1.75)</span>
                <span className="text-[10px] text-stone-400">Videos Diarios</span>
              </div>
            </button>

            <button
              onClick={() => {
                setView(ViewMode.YOUTUBE);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Youtube className="w-3.5 h-3.5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-stone-900">YouTube ($1.75)</span>
                <span className="text-[10px] text-stone-400">Galería Elfsight</span>
              </div>
            </button>

            <div className="pt-1.5 border-t border-stone-100 mt-0.5">
              <button
                onClick={() => setIsSocialHubModalOpen(true)}
                className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-semibold text-center transition-colors cursor-pointer"
              >
                Abrir Centro de Redes ✨
              </button>
            </div>
          </div>
        </div>

        {/* Respirar */}
        <button 
          onClick={() => requireAccess(checkBreathingAccess(currentUser), () => setIsBreathingOpen(true))}
          title="Respiración consciente" 
          className="p-2 text-sand-600 hover:text-sage-700 hover:bg-sage-100 rounded-full transition-all flex items-center gap-1 text-xs"
        >
          <Wind className="w-4 h-4 md:w-5 md:h-5 text-sage-600" />
          <span className="hidden lg:inline text-xs font-medium text-sage-700">{t.breathe}</span>
        </button>

        {/* Carta / Oráculo */}
        <button 
          onClick={() => requireAccess(checkOracleAccess(currentUser), () => setIsOracleOpen(true))}
          title={t.oracle} 
          className="p-2 text-sand-600 hover:text-gold-700 hover:bg-gold-100 rounded-full transition-all flex items-center gap-1 text-xs"
        >
          <Compass className="w-4 h-4 md:w-5 md:h-5 text-gold-600" />
          <span className="hidden lg:inline text-xs font-medium text-gold-700">{t.oracle}</span>
        </button>

        {/* Zen Audio 432Hz */}
        <button 
          onClick={toggleMusic} 
          title={isMusicPlaying ? t.musicOn : t.musicOff} 
          className={`p-2 rounded-full border transition-all ${
            isMusicPlaying 
              ? 'bg-gold-100 border-gold-300 text-gold-800 shadow-sm' 
              : 'bg-white border-sand-200 text-sand-500 hover:bg-sand-100'
          }`}
        >
          {isMusicPlaying ? (
            <Music2 className="w-4 h-4 md:w-5 md:h-5 text-gold-700 animate-pulse" />
          ) : (
            <Music className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>

        {/* Música Clásica y Zen de YouTube */}
        <button 
          id="header-youtube-music-btn"
          onClick={() => setIsYouTubeMusicOpen(true)} 
          title="Música Clásica y Zen de YouTube (Cuencos, 432Hz, Chopin, Debussy, Satie, Bach)" 
          className={`p-2 rounded-full border transition-all relative group cursor-pointer ${
            isYouTubePlaying && currentYouTubeTrack
              ? 'bg-red-50 border-red-300 text-red-700 shadow-sm ring-2 ring-red-400/20' 
              : 'bg-white border-sand-200 text-sand-500 hover:text-red-600 hover:bg-red-50/50'
          }`}
        >
          <div className="flex items-center gap-1">
            <Headphones className={`w-4 h-4 md:w-5 md:h-5 ${isYouTubePlaying ? 'text-red-600 animate-pulse' : 'text-red-500 group-hover:scale-110 transition-transform'}`} />
            {isYouTubePlaying && currentYouTubeTrack && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            )}
          </div>
        </button>

        {/* Álbum Personal */}
        <button 
          onClick={() => setView(ViewMode.GALLERY)} 
          title={t.personalAlbum} 
          className={`p-2 rounded-full border transition-all ${
            view === ViewMode.GALLERY 
              ? 'bg-terracotta-100 border-terracotta-300 text-terracotta-800' 
              : 'bg-white border-sand-200 text-sand-500 hover:bg-sand-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Calendario Dinámico (2027 a 3037) */}
        <button 
          onClick={() => setView(ViewMode.CALENDAR)} 
          title={`Ver calendario ${selectedYear}${isCurrentYearLeap ? ' (Año Bisiesto · Febrero 29 días)' : ''}`} 
          className={`px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
            view === ViewMode.CALENDAR 
              ? 'bg-sand-900 border-sand-900 text-white shadow-xs' 
              : 'bg-white border-sand-200 text-sand-700 hover:bg-sand-100'
          }`}
        >
          <CalendarIcon className="w-4 h-4 md:w-4.5 md:h-4.5" />
          <span className="text-xs font-mono font-bold">{selectedYear}</span>
          {isCurrentYearLeap && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Año Bisiesto (Febrero 29 días)" />
          )}
        </button>

        {/* Apoya este proyecto por solo $1.25 */}
        <button 
          onClick={() => {
            setView(ViewMode.SUPPORT);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          title="Apoya este proyecto por solo $1.25 (Mantras potenciados con imágenes como ojos de amor con paisajes reales)" 
          className={`px-2.5 sm:px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold shadow-xs shrink-0 ${
            view === ViewMode.SUPPORT 
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm ring-2 ring-rose-400/30' 
              : 'bg-rose-50/90 border-rose-200 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${view === ViewMode.SUPPORT ? 'fill-white' : 'text-rose-500 fill-rose-500'}`} />
          <span className="hidden sm:inline">Apoya</span>
          <span className="bg-rose-200/70 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            $1.25
          </span>
        </button>

        {/* Recordatorio de paz */}
        <button 
          onClick={() => { 
            const nextState = !alarmActive;
            setAlarmActive(nextState); 
            if(nextState) { 
              playChime(); 
              showToast("✨ Recordatorio de amor propio activado."); 
            } else {
              showToast("Recordatorio pausado.");
            }
          }} 
          title={alarmActive ? t.reminderOn : t.reminderOff} 
          className={`p-2 rounded-full border transition-all ${
            alarmActive 
              ? 'bg-terracotta-600 border-terracotta-600 text-white shadow-sm' 
              : 'bg-white border-sand-200 text-sand-500 hover:bg-sand-100'
          }`}
        >
          <Bell className={`${alarmActive ? 'animate-bounce' : ''} w-4 h-4 md:w-5 md:h-5`} />
        </button>

        {/* Botón Destacado Membresía (Motor de Monetización $1,000 USD/mes) */}
        <button
          onClick={() => setIsMembershipOpen(true)}
          className="ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gold-500 hover:bg-gold-600 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-full shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.peaceCircle}</span>
        </button>
      </div>
    </header>
    );
  };

  // Vista de Inicio: Modelo moderno, intuitivo, flotante y sereno inspirado en estética nórdica zen
  const renderIntroView = () => (
    <div className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] z-10 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      {/* Fondo con textura serena y cálida */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={coverImage || LANDSCAPE_INTRO_IMG} 
          className="w-full h-full object-cover opacity-40 filter blur-[3px]" 
          alt="" 
          referrerPolicy="no-referrer"
          onError={handleImageError} 
        />
        <div className="absolute inset-0 bg-[#FAF8F5]/75 backdrop-blur-xs" />
      </div>

      <ModernZenDashboard
        currentDay={currentDay}
        currentDayNum={currentDayNum}
        currentMonthIdx={currentMonthIdx}
        daysInCurrentMonth={daysInCurrentMonth}
        monthNames={MONTH_NAMES}
        holidays2027={activeHolidays}
        holidayNames2027={activeHolidayNames}
        selectedYear={selectedYear}
        onSelectYear={handleSelectYear}
        isLeapYear={isCurrentYearLeap}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        onPlayChime={playChime}
        onSelectDay={(dIdx, mIdx) => selectDay(dIdx, mIdx)}
        onChangeMonth={handleChangeMonth}
        onGoToDayDetail={() => handleProtectedAction(() => { setView(ViewMode.DAY_DETAIL); window.scrollTo({ top: 0, behavior: 'smooth' }); })}
        onGoToCalendar={() => { setView(ViewMode.CALENDAR); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onGoToGallery={() => { setView(ViewMode.GALLERY); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onGoToSupport={() => { setView(ViewMode.SUPPORT); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onGoToTikTok={() => { setView(ViewMode.TIKTOK); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onGoToYouTube={() => { setView(ViewMode.YOUTUBE); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onOpenJournal={() => requireAccess(checkJournalAccess(currentUser), () => setIsJournalOpen(true))}
        onOpenOracle={() => requireAccess(checkOracleAccess(currentUser), () => setIsOracleOpen(true))}
        onOpenBreathing={() => requireAccess(checkBreathingAccess(currentUser), () => setIsBreathingOpen(true))}
        onOpenMembership={() => setIsMembershipOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenCoverUpload={() => requireAccess(checkPhotoUploadAccess(currentUser), () => coverFileInputRef.current?.click())}
        alarmActive={alarmActive}
        onToggleAlarm={() => {
          const nextState = !alarmActive;
          setAlarmActive(nextState);
          if (nextState) {
            playChime();
            showToast("✨ Recordatorio de amor propio activado.");
          } else {
            showToast("Recordatorio pausado.");
          }
        }}
        coverImage={coverImage}
        lang={lang}
        selectedCountry={selectedCountry}
        onOpenTimezoneModal={() => setIsTimezoneModalOpen(true)}
        weatherInfo={weatherInfo}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPayment={() => setIsPaymentModalOpen(true)}
        isTrialExpired={isTrialExpired}
        onOpenBlogger={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsBloggerModalOpen(true))}
        onOpenInstagram={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true))}
        onOpenFacebook={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsFacebookModalOpen(true))}
        onOpenThreads={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsThreadsModalOpen(true))}
        onOpenSocialHub={() => setIsSocialHubModalOpen(true)}
        onActionSocialNetwork={handleOpenSocialAction}
        onOpenYouTube={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsYouTubeModalOpen(true))}
        onOpenYouTubeMusic={() => setIsYouTubeMusicOpen(true)}
        isYouTubeAudioPlaying={isYouTubePlaying && !!currentYouTubeTrack}
        displayedImage={activeMonthImage}
        onOpenMonthUpload={triggerMonthUpload}
        onOpenWifiMap={() => setIsWifiMapOpen(true)}
      />

      {/* Tarjeta acogedora de lino y arena que respira paz y preserva los textos fundacionales */}
      <div className="relative z-10 max-w-3xl w-full mx-auto my-8 px-4">
        <div className="glass-panel p-6 sm:p-10 border border-white/80 shadow-lg rounded-3xl transition-all">
          <div className="space-y-5 text-left text-sand-900 leading-relaxed text-base sm:text-lg">
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-terracotta-700 border-l-4 border-terracotta-400 pl-4 md:pl-5">
              "Este es un borrador de 21 días, basado en mi propia experiencia."
            </p>
            <p className="text-sand-700 text-sm sm:text-base md:text-lg font-normal">
              Existe un lugar en donde llega la calma y reina el amor puro. Y ese lugar está en tu interior.
            </p>
            <div className="pt-4 border-t border-sand-200/80 space-y-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-sand-500 block">
                Hoy deseo desde mi
              </span>
              <span className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-sand-900 block tracking-tight text-terracotta-800">
                YO SOY YO
              </span>
              <span className="text-sm sm:text-base md:text-lg font-serif italic text-gold-700 block leading-relaxed">
                ayudar con este almanaque en tu diario vivir compartiendo cada día una palabra gatillo para implementarla e ir transmutando tus viejas emociones.
              </span>
            </div>
          </div>
        </div>

        {/* Accesos Principales del Almanaque: Mismo tamaño, estética serena y proporciones que Rincón de Lectura y Conexión Consciente */}
        <div className="w-full max-w-4xl mx-auto pt-6 pb-2">
          <div className="text-center mb-4">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-stone-400 block">
              Explora Tu Viaje Interior · Celular · Tablet · Notebook
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in">
            {/* Botón 1: Comenzar el Viaje (Calendario Anual) */}
            <button
              onClick={() => {
                setView(ViewMode.CALENDAR);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-left transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              title="Comenzar el Viaje - Entrar al Calendario Anual de Amor Propio"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      {t.enterCalendar}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full border border-amber-200 shrink-0">
                      21 Días & Anual
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    Calendario interactivo con palabras gatillo de paz
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-terracotta-700 bg-white group-hover:bg-amber-100/70 px-3 py-1.5 rounded-full border border-amber-200/90 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Entrar</span>
                <ChevronRight className="w-3.5 h-3.5 text-terracotta-600" />
              </div>
            </button>

            {/* Botón 2: Tu Álbum Personal (Galería) */}
            <button
              onClick={() => {
                setView(ViewMode.GALLERY);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-left transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              title="Tu Álbum Personal - Memorias y fotos del viaje"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-pink-600 to-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      {t.personalAlbum}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.2 rounded-full border border-rose-200 shrink-0">
                      Galería
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    Tus momentos sagrados y fotos personalizadas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-800 bg-white group-hover:bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Ver Álbum</span>
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              </div>
            </button>

            {/* Botón 3: Apoya este proyecto ($1.25) */}
            <button
              onClick={() => {
                setView(ViewMode.SUPPORT);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-left transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              title="Apoya este proyecto por solo $1.25 (Mantras potenciados con imágenes como ojos de amor con paisajes reales)"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      Apoya este Proyecto
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 px-2 py-0.2 rounded-full border border-rose-200 shrink-0">
                      $1.25 USD
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    Mantras con ojos de amor y paisajes reales
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-800 bg-white group-hover:bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Aportar</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </div>
            </button>

            {/* Botón 4: Videos TikTok ($1.75) */}
            <button
              onClick={() => {
                setView(ViewMode.TIKTOK);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-left transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              title="Videos TikTok ($1.75) - Reflexiones diarias en video y música suave"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-900 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5 text-rose-200" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      Videos Diarios TikTok
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 px-2 py-0.2 rounded-full border border-stone-300 shrink-0">
                      $1.75 USD
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    Reflexiones audiovisuales de paz interior
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-stone-800 bg-white group-hover:bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Ver Videos</span>
                <Video className="w-3.5 h-3.5 text-stone-700" />
              </div>
            </button>

            {/* Botón 5: YouTube Gallery ($1.75) */}
            <button
              onClick={() => {
                setView(ViewMode.YOUTUBE);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-left transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              title="YouTube Gallery ($1.75) - Galería de afirmaciones y frecuencias 432 Hz"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-terracotta-700 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Youtube className="w-5 h-5 fill-white" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      YouTube Gallery Oficial
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-800 px-2 py-0.2 rounded-full border border-red-200 shrink-0">
                      $1.75 USD
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    Galería comunitaria y música de alta frecuencia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-red-800 bg-white group-hover:bg-red-50 px-3 py-1.5 rounded-full border border-red-200 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Canal</span>
                <Youtube className="w-3.5 h-3.5 text-red-600" />
              </div>
            </button>

            {/* Botón 6: Rincón de Lectura (Libros Gratuitos) */}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-decoration-none transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              title="Rincón de Lectura: Libros Gratuitos de Autoestima (Abre en una pestaña nueva)"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      «Rincón de Lectura: Libros Gratuitos»
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                      Gratis
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    OpenLibrary.org · Obras libres de autoestima
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta-700 bg-white group-hover:bg-amber-100/70 px-3 py-1.5 rounded-full border border-amber-200/90 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Biblioteca</span>
                <ExternalLink className="w-3.5 h-3.5 text-terracotta-600" />
              </div>
            </a>

            {/* Botón 7: Conexión Consciente (Wi-Fi Gratis) */}
            <button
              onClick={() => setIsWifiMapOpen(true)}
              className="group w-full md:col-span-2 bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer text-left transform hover:-translate-y-0.5 active:scale-[0.99]"
              title="Conexión Consciente (Wi-Fi Gratis) - Mapa interactivo sin salir del almanaque"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                      «Conexión Consciente (Wi-Fi Gratis)»
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                      Mapa GPS
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                    Redes abiertas cercanas con OpenStreetMap & Leaflet sin salir del almanaque
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-white group-hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0 shadow-2xs transition-colors">
                <span className="hidden sm:inline">Ver Mapa</span>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </button>
          </div>
        </div>

        {/* Enlace discreto a Acerca de & Gratitud (Estructura inicial en armonía y paz) */}
        <div className="pt-4 pb-2 text-center space-y-2">
          <button 
            onClick={() => setIsAboutOpen(true)} 
            className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4 transition-colors font-medium cursor-pointer"
          >
            {t.about} • Gratitud y autoría
          </button>
          <p className="text-[11px] text-stone-400 font-serif italic tracking-wide">
            "Existe un lugar en donde llega la calma y reina el amor puro"
          </p>
        </div>
      </div>
    </div>
  );

  // Calendario Dinámico (2027 - 3037): Limpio, armónico, sin saturación
  const renderCalendarView = () => (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-10 pb-24 animate-fade-in relative z-10">
      {/* Barra superior con navegación de año */}
      <div className="flex flex-col gap-4 border-b border-sand-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button 
              onClick={() => navigateToView(ViewMode.INTRO)} 
              className="w-fit flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2.5 bg-white hover:bg-sand-100 border border-sand-300 hover:border-terracotta-400 text-sand-900 rounded-full shadow-sm transition-all font-semibold text-xs sm:text-sm cursor-pointer active:scale-95 group shrink-0"
              title="Volver al inicio del Almanaque"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-terracotta-600 group-hover:-translate-x-0.5 transition-transform" />
              <span>Volver al Inicio</span>
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-sand-900">
                  Calendario {selectedYear}
                </h2>
                {selectedYear !== 2027 && (
                  <button
                    onClick={() => handleSelectYear(2027)}
                    className="text-[11px] sm:text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 sm:px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    title="Volver al año 2027"
                  >
                    <span>↺ Volver a 2027</span>
                  </button>
                )}
                {isCurrentYearLeap ? (
                  <span className="text-[10px] sm:text-[11px] font-bold bg-amber-100 text-amber-900 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1" title="Año bisiesto de 366 días. Febrero cuenta con 29 días.">
                    <span>🌱</span>
                    <span>Año Bisiesto</span>
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-semibold bg-stone-100 text-stone-700 px-2 sm:px-2.5 py-0.5 rounded-full border border-stone-200">
                    Año Regular
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                <p className="text-[11px] sm:text-xs text-terracotta-600 font-medium">
                  {t.holidaysNote}
                </p>
                <button
                  onClick={() => setIsTimezoneModalOpen(true)}
                  className="text-[10px] bg-terracotta-100/90 hover:bg-terracotta-200 text-terracotta-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                  title="Ajustar país, ciudad, zona horaria y clima"
                >
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.code} {selectedCountry.city || selectedCountry.name}</span>
                  {weatherInfo && (
                    <span className="font-mono font-bold text-terracotta-900">· {weatherInfo.temp}°C</span>
                  )}
                  <span className="text-stone-500 font-normal font-mono">({selectedCountry.offset})</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMembershipOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gold-700 bg-gold-100/80 px-3 py-1.5 rounded-full border border-gold-200 font-medium shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.peaceCircle}</span>
          </button>
        </div>

        {/* Selector interactivo de Año (2027 a 3037) */}
        <div className="bg-white/85 p-3.5 sm:p-4 rounded-2xl border border-sand-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => handleSelectYear(selectedYear - 1)}
              disabled={selectedYear <= MIN_YEAR}
              className="p-2 rounded-full border border-sand-200 bg-sand-50 hover:bg-sand-100 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title={`Año anterior (${selectedYear - 1})`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">{selectedYear - 1 >= MIN_YEAR ? selectedYear - 1 : ''}</span>
            </button>

            {/* Dropdown de Selección directa de año */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500 hidden md:inline">Seleccionar Año:</span>
              <select
                value={selectedYear}
                onChange={(e) => handleSelectYear(Number(e.target.value))}
                className="font-serif font-bold text-base sm:text-lg text-sand-900 bg-sand-100/80 hover:bg-sand-200/80 border border-sand-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-terracotta-400 cursor-pointer shadow-2xs transition-colors"
                title="Elige un año entre 2027 y 3037"
              >
                {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i).map((y) => {
                  const isYLeap = isLeapYear(y);
                  const isUnlocked = y === 2027 || unlockedYears.includes(y);
                  return (
                    <option key={y} value={y}>
                      {y} {isYLeap ? '🌱 (Bisiesto)' : ''} {!isUnlocked ? '🔒 (Requiere Anualidad)' : '✓'}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={() => handleSelectYear(selectedYear + 1)}
              disabled={selectedYear >= MAX_YEAR}
              className="p-2 rounded-full border border-sand-200 bg-sand-50 hover:bg-sand-100 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title={`Año siguiente (${selectedYear + 1})`}
            >
              <span className="hidden xs:inline">{selectedYear + 1 <= MAX_YEAR ? selectedYear + 1 : ''}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Accesos directos rápidos a años clave */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">Rápidos:</span>
            {[2027, 2028, 2029, 2030, 2032, 2036, 2050, 3000].map((quickYear) => {
              const isSelected = selectedYear === quickYear;
              const isQuickLeap = isLeapYear(quickYear);
              const isUnlocked = quickYear === 2027 || unlockedYears.includes(quickYear);
              return (
                <button
                  key={quickYear}
                  onClick={() => handleSelectYear(quickYear)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected 
                      ? 'bg-sand-900 text-white border-sand-900 shadow-2xs' 
                      : isQuickLeap
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-white hover:bg-sand-100 text-stone-700 border-sand-200'
                  }`}
                  title={`${quickYear} ${isQuickLeap ? '(Bisiesto · Febrero con 29 días)' : ''} ${!isUnlocked ? '- Requiere Anualidad Prémium' : '- Habilitado'}`}
                >
                  {!isUnlocked && <span className="text-[10px] opacity-70">🔒</span>}
                  <span>{quickYear}</span>
                  {isQuickLeap && !isSelected && <span className="text-amber-600 font-bold ml-0.5">·</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accesos Estratégicos: Rincón de Lectura & Conexión Consciente (Wi-Fi Gratis) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
        {/* Botón 1: Rincón de Lectura */}
        <a
          href="https://openlibrary.org"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 text-decoration-none transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
          title="Rincón de Lectura: Libros Gratuitos de Autoestima (Abre en una pestaña nueva)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                  Rincón de Lectura: Libros Gratuitos
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                  Gratis
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                OpenLibrary.org · Obras libres de superación
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta-700 bg-white group-hover:bg-amber-100/70 px-3 py-1.5 rounded-full border border-amber-200/90 shrink-0 shadow-2xs transition-colors">
            <span className="hidden sm:inline">Biblioteca</span>
            <ExternalLink className="w-3.5 h-3.5 text-terracotta-600" />
          </div>
        </a>

        {/* Botón 2: Conexión Consciente (Wi-Fi Gratis) */}
        <button
          onClick={() => setIsWifiMapOpen(true)}
          className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400/90 rounded-2xl sm:rounded-3xl p-3.5 sm:px-5 sm:py-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer text-left transform hover:-translate-y-0.5 active:scale-[0.99]"
          title="Conexión Consciente (Wi-Fi Gratis) - Mapa interactivo sin salir del almanaque"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors truncate">
                  Conexión Consciente (Wi-Fi Gratis)
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                  Mapa GPS
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate group-hover:text-stone-600">
                Redes abiertas cercanas con Leaflet & Overpass
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-white group-hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0 shadow-2xs transition-colors">
            <span className="hidden sm:inline">Ver Mapa</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </button>
      </div>

      {/* Barra flotante de retorno rápido al desplazarse por los 12 meses */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sand-300 shadow-md flex items-center justify-between gap-3 animate-fade-in">
        <button 
          onClick={() => navigateToView(ViewMode.INTRO)} 
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs sm:text-sm rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
          title="Regresar a la pantalla principal del Almanaque"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>
        <span className="font-serif font-bold text-sand-900 text-xs sm:text-sm truncate">
          Calendario Anual {selectedYear}
        </span>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="text-xs text-sand-600 hover:text-terracotta-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-sand-100 transition-colors cursor-pointer"
          title="Subir al inicio del calendario"
        >
          Ir arriba ↑
        </button>
      </div>

      <div className="space-y-12">
        {MONTH_NAMES.map((month, mIdx) => {
          const daysInMonth = getDaysInMonth(selectedYear, mIdx);
          const firstDayOfMonth = new Date(selectedYear, mIdx, 1);
          const emptyDaysAtStart = firstDayOfMonth.getDay(); 
          const monthImg = getMonthImage(mIdx);
          const hasCustomMonthImg = !!(monthlyImages[mIdx] || dailyImages[mIdx + 1]);

          return (
            <div key={month} className="space-y-4 bg-white/70 p-4 sm:p-6 md:p-8 rounded-3xl border border-sand-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-sand-200 shrink-0 relative group shadow-2xs bg-stone-100">
                    <img 
                      src={monthImg} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      alt={month} 
                      onError={handleImageError} 
                    />
                    <button
                      onClick={() => triggerMonthUpload(mIdx)}
                      className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                      title={`Subir foto para ${month} (Día ${mIdx + 1})`}
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-sand-900 capitalize leading-tight">
                        {month} {selectedYear}
                      </h3>
                      {mIdx === 1 && isCurrentYearLeap && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                          29 Días (Bisiesto)
                        </span>
                      )}
                      {hasCustomMonthImg && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          Foto subida
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-terracotta-700 font-mono flex items-center gap-1 mt-0.5">
                      <span>Foto del Mes: Día {mIdx + 1}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-600 font-sans font-normal truncate max-w-[200px] sm:max-w-none">{DAYS_CONTENT[mIdx]?.title}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerMonthUpload(mIdx)}
                  className="w-fit text-xs font-semibold text-stone-700 hover:text-terracotta-800 bg-sand-100/90 hover:bg-sand-200 px-3.5 py-1.5 rounded-full border border-sand-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title={`Subir o cambiar foto para ${month} (Día ${mIdx + 1})`}
                >
                  <Camera size={13} className="text-terracotta-700" />
                  <span>Subir foto de {month}</span>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2.5">
                {t.days.map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] sm:text-xs font-semibold py-1 text-sand-500 uppercase">
                    {d}
                  </div>
                ))}
                {Array.from({ length: emptyDaysAtStart }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square opacity-0" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, dIdx) => {
                  const dayNum = dIdx + 1;
                  const isHoliday = activeHolidays[mIdx]?.includes(dayNum);
                  const holidayName = activeHolidayNames[`${mIdx}-${dayNum}`];
                  const dayPhoto = dailyImages[dayNum] || monthImg;
                  const dayAccess = checkDayAccess(currentUser, dayNum);
                  const isDayLocked = !dayAccess.allowed;
                  return (
                    <button 
                      key={dIdx} 
                      onClick={() => selectDay(dayNum - 1, mIdx)} 
                      title={isDayLocked ? `Día ${dayNum} · Requiere Suscripción (Mes Gratis incluye Días 1 a 3)` : holidayName ? `🇦🇷 ${holidayName} (${dayNum} de ${month} de ${selectedYear})` : `${dayNum} de ${month} de ${selectedYear}`}
                      className={`aspect-square border transition-all overflow-hidden relative shadow-sm rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center group cursor-pointer ${
                        isDayLocked
                          ? 'border-stone-200/80 bg-stone-100/60 text-stone-400 hover:bg-amber-50 hover:border-amber-300'
                          : isHoliday 
                          ? 'border-terracotta-300 bg-terracotta-50 hover:bg-terracotta-100/70 ring-1 ring-terracotta-400/30' 
                          : 'border-sand-200 bg-white hover:bg-sand-100 hover:border-gold-300'
                      }`}
                    >
                      {dayPhoto && !isDayLocked && (
                        <img 
                          src={dayPhoto} 
                          className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-30 transition-opacity" 
                          alt="" 
                          onError={handleImageError} 
                        />
                      )}
                      <span className={`text-xs sm:text-base md:text-lg font-serif font-bold relative z-10 ${
                        isDayLocked ? 'text-stone-400' : isHoliday ? 'text-terracotta-700 font-black' : 'text-sand-900'
                      }`}>
                        {dayNum}
                      </span>
                      {isDayLocked && (
                        <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] sm:text-[9px] leading-none" title="Contenido Premium">🔒</span>
                      )}
                      {isHoliday && !isDayLocked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 absolute bottom-1 sm:bottom-2 z-10" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón final para volver al inicio al pie de los 12 meses */}
      <div className="pt-8 pb-4 flex flex-col items-center justify-center gap-4 border-t border-sand-200 text-center">
        {/* Accesos al pie del calendario */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full bg-gradient-to-r from-amber-50/80 via-white to-orange-50/80 hover:from-amber-100 hover:via-white hover:to-orange-100 text-stone-800 border border-amber-200 hover:border-terracotta-400 rounded-full px-4 py-2.5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 text-decoration-none cursor-pointer transform hover:-translate-y-0.5 active:scale-98"
            title="Rincón de Lectura: Libros Gratuitos de Autoestima (Abre en pestaña nueva)"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-terracotta-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-xs text-stone-900 group-hover:text-terracotta-700 transition-colors text-left truncate">
                Rincón de Lectura
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-terracotta-700 font-semibold bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
              <span>Libros</span>
              <ExternalLink className="w-2.5 h-2.5 text-terracotta-600" />
            </div>
          </a>

          <button
            onClick={() => setIsWifiMapOpen(true)}
            className="group w-full bg-gradient-to-r from-amber-50/80 via-white to-orange-50/80 hover:from-amber-100 hover:via-white hover:to-orange-100 text-stone-800 border border-amber-200 hover:border-terracotta-400 rounded-full px-4 py-2.5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:scale-98 text-left"
            title="Conexión Consciente (Wi-Fi Gratis) - Mapa interactivo sin salir del almanaque"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-terracotta-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-xs text-stone-900 group-hover:text-terracotta-700 transition-colors text-left truncate">
                Conexión Consciente
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
              <span>Wi-Fi</span>
              <Wifi className="w-2.5 h-2.5 text-emerald-600" />
            </div>
          </button>
        </div>

        <button 
          onClick={() => navigateToView(ViewMode.INTRO)} 
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          title="Regresar a la pantalla principal del Almanaque"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Inicio del Almanaque</span>
        </button>
        <p className="text-xs text-sand-600 max-w-md">
          Regresa a tu portada serena para disfrutar tus afirmaciones diarias, el reproductor de frecuencia 432 Hz y el Círculo de Paz.
        </p>
      </div>
    </div>
  );

  // Vista Detalle del Día: Serena, legible, libro de sabiduría
  const renderDayDetailView = () => {
    const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const currentWeekday = weekdays[new Date(selectedYear, currentMonthIdx, currentDayNum).getDay()];
    const holidayKey = `${currentMonthIdx}-${currentDayNum}`;
    const holidayName = activeHolidayNames[holidayKey];

    const isFirstDayOfYear = currentMonthIdx === 0 && currentDayNum === 1;
    const isLastDayOfYear = currentMonthIdx === 11 && currentDayNum === 31;

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-24 animate-fade-in relative z-10">
        {/* Barra superior de fecha y retorno */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => navigateToView(ViewMode.INTRO)} 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-sand-800 bg-white px-4 py-2.5 border border-sand-200 font-semibold text-xs rounded-full shadow-sm hover:bg-sand-100 transition-colors cursor-pointer"
              title="Volver a la portada principal"
            >
              <Home className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Volver al Inicio</span>
            </button>
            <button 
              onClick={() => navigateToView(ViewMode.CALENDAR)} 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-sand-800 bg-white px-4 py-2.5 border border-sand-200 font-semibold text-xs rounded-full shadow-sm hover:bg-sand-100 transition-colors cursor-pointer"
              title="Volver a la vista del calendario anual"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Calendario {selectedYear}</span>
            </button>
          </div>
          
          <div className="w-full sm:w-auto text-center text-terracotta-800 bg-terracotta-100 border border-terracotta-200 font-medium text-xs px-5 py-2.5 rounded-full shadow-sm tracking-wide">
            {currentWeekday} · {currentDayNum} de {MONTH_NAMES[currentMonthIdx]} de {selectedYear}
            {currentMonthIdx === 1 && currentDayNum === 29 && isCurrentYearLeap && (
              <span className="font-bold ml-1 text-amber-900">(Día Bisiesto)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => requireAccess(checkJournalAccess(currentUser), () => setIsJournalOpen(true))}
              className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-sand-800 border border-sand-300 font-medium text-xs rounded-full shadow-sm flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
              <span>{t.journal}</span>
            </button>
            <button
              onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true))}
              className="px-3 sm:px-3.5 py-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white border border-rose-300 font-semibold text-xs rounded-full shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Publicar este día en Instagram (Historias o Feed)"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instagram</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 bg-white hover:bg-sand-100 text-sand-600 border border-sand-200 rounded-full shadow-sm transition-all"
              title="Compartir día"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feriado destacado en terracota suave */}
        {holidayName && (
          <div className="px-4 py-2.5 bg-terracotta-50 border border-terracotta-200 rounded-2xl text-center text-terracotta-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Feriado Nacional: {holidayName}</span>
          </div>
        )}
        
        {/* Marquesina sutil y suave de Amor Propio y Autoestimas */}
        <div className="max-w-md mx-auto w-full px-2">
          <div className="bg-sand-100/90 border border-sand-200 rounded-full py-2 shadow-sm overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex items-center text-sand-600 text-xs sm:text-sm font-medium">
              <span className="px-6">Lo siento, perdóname, te amo, gracias</span>
              <span className="px-6">Lo siento, perdóname, te amo, gracias</span>
              <span className="px-6">Lo siento, perdóname, te amo, gracias</span>
            </div>
          </div>
        </div>

        {/* Tarjeta central del día */}
        <div className="bg-white/95 backdrop-blur-md border border-sand-200/90 rounded-3xl shadow-sm p-6 sm:p-10 md:p-14 space-y-8 md:space-y-12">
          {/* Título y botón de foto suave */}
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
              Día {currentDayNum}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-sand-900 leading-tight">
              {currentDay.title}
            </h2>

            {/* Burbuja sutil para foto con marquesina de respiración */}
            <button 
              onClick={() => {
                requireAccess(checkPhotoUploadAccess(currentUser), () => {
                  if (currentDayNum <= 12) {
                    triggerMonthUpload(currentDayNum - 1);
                  } else {
                    setUploadingDayNum(currentDayNum);
                    dailyFileInputRef.current?.click();
                  }
                });
              }}
              title={currentDayNum <= 12 ? `Subir foto para ${MONTH_NAMES[currentDayNum - 1]} (Día ${currentDayNum})` : `Cambiar foto del Día ${currentDayNum}`}
              className="w-full max-w-md bg-sand-100 hover:bg-sand-200 border border-sand-300 rounded-full py-2 px-4 shadow-sm overflow-hidden relative flex items-center gap-2 cursor-pointer transition-all"
            >
              <div className="shrink-0 flex items-center gap-1.5 bg-sand-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                <Camera className="w-3.5 h-3.5" />
                <span>{currentDayNum <= 12 ? `Subir Foto · ${MONTH_NAMES[currentDayNum - 1]}` : t.changePhoto}</span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <div className="animate-marquee whitespace-nowrap flex items-center text-xs text-sand-600 font-medium">
                  <span className="px-4">{currentDayNum <= 12 ? `Foto del mes de ${MONTH_NAMES[currentDayNum - 1]}` : t.breatheConfide}</span>
                  <span className="px-4">{t.breatheConfide}</span>
                  <span className="px-4">{t.breatheConfide}</span>
                </div>
              </div>
            </button>
          </div>

          {/* Imagen hermosa del día si existe */}
          {displayedImage && (
            <div className="max-w-md mx-auto aspect-[16/10] rounded-2xl overflow-hidden shadow-sm border border-sand-200 bg-sand-100">
              <img 
                src={displayedImage} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                alt={currentDay.title}
                onError={handleImageError} 
              />
            </div>
          )}

          {/* Contenido legible y poético */}
          <div className="space-y-6 text-sand-800 leading-relaxed font-normal text-base sm:text-lg">
            {currentDay.content.map((p, i) => (
              <p 
                key={i} 
                className="capitular whitespace-pre-line leading-relaxed first-letter:text-4xl md:first-letter:text-5xl first-letter:float-left first-letter:mr-2"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Bloque del Mantra Transformador */}
          <div className="bg-sand-50/90 border border-gold-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-center flex-wrap gap-3">
              <button 
                onClick={() => { playChime(); showToast("✨ Siente la paz en tu corazón. Repite la frase 3 veces."); }} 
                className="bg-white hover:bg-sand-100 text-terracotta-700 border border-sand-200 px-6 py-3.5 rounded-full shadow-sm flex items-center gap-3 active:scale-95 transition-all cursor-pointer"
                title="Tocar campana tibetana"
              >
                <Volume2 className="w-5 h-5 text-gold-600 shrink-0" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] text-sand-500 uppercase tracking-widest font-bold">
                    {t.whenUnwell}
                  </span>
                  <span className="text-sm font-semibold text-terracotta-800">
                    {t.repeatPhrase3Times}
                  </span>
                </div>
              </button>

              <button 
                id="day-detail-youtube-music-btn"
                onClick={() => setIsYouTubeMusicOpen(true)} 
                className="bg-white hover:bg-red-50/60 text-stone-700 border border-sand-200 px-5 py-3.5 rounded-full shadow-sm flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer group"
                title="Música Clásica y Zen de YouTube para acompañar la lectura"
              >
                <Headphones className={`w-5 h-5 ${isYouTubePlaying ? 'text-red-600 animate-pulse' : 'text-red-500'} group-hover:scale-110 transition-transform`} />
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] text-sand-500 uppercase tracking-widest font-bold">
                    Música YouTube
                  </span>
                  <span className="text-sm font-semibold text-stone-800 group-hover:text-red-700">
                    {isYouTubePlaying && currentYouTubeTrack ? currentYouTubeTrack.title : 'Zen & Clásica'}
                  </span>
                </div>
              </button>
            </div>

            <p className={`font-serif italic text-sand-900 leading-relaxed font-bold whitespace-pre-line ${
              currentDay.mantra.length > 80 
                ? "text-base sm:text-lg md:text-xl" 
                : "text-xl sm:text-2xl md:text-3xl"
            }`}>
              "{currentDay.mantra}"
            </p>

            {currentDay.mantraDescription && (
              <p className="text-sand-700 text-sm sm:text-base border-l-2 border-gold-400 pl-4 text-left italic font-normal">
                {currentDay.mantraDescription}
              </p>
            )}
          </div>

          {/* Invitación al Diario de Sanación */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-sand-100/80 rounded-2xl border border-sand-200">
            <div>
              <h4 className="text-sm font-semibold text-sand-900">¿Cómo te resonó la lectura de hoy?</h4>
              <p className="text-xs text-sand-600">Dedica 2 minutos a escribir en tu diario personal.</p>
            </div>
            <button
              onClick={() => requireAccess(checkJournalAccess(currentUser), () => setIsJournalOpen(true))}
              className="px-5 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-medium shadow-sm transition-all cursor-pointer"
            >
              Abrir mi Diario de Hoy
            </button>
          </div>

          {/* Difusión en Redes y Blogger Dinámicos (Solo Logo: Blogger, Instagram, Facebook) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 bg-white/85 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center gap-3 text-left">
              <div className="flex -space-x-2 overflow-hidden py-1 shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white border-2 border-white shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white border-2 border-white shadow-xs">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white border-2 border-white shadow-xs">
                  <Facebook className="w-4 h-4 fill-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white border-2 border-white shadow-xs">
                  <Youtube className="w-4 h-4 fill-white" />
                </div>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Publicar y Compartir en Redes</h4>
                <p className="text-[11px] text-stone-600">Blogger, historias para Instagram, Facebook o YouTube Shorts y miniaturas HD.</p>
              </div>
            </div>

            {/* Botones Dinámicos Solo Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsBloggerModalOpen(true))}
                aria-label="Publicar en Blogger"
                title="Publicar en Blogger (Entradas, Páginas y Gadgets)"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_14px_rgba(249,115,22,0.55)] transform hover:scale-115 active:scale-90 hover:rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <Globe className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true))}
                aria-label="Subir a Instagram"
                title="Subir a Instagram (Historias 9:16 y Posts 1:1)"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:via-rose-600 hover:to-purple-700 text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_14px_rgba(225,48,108,0.55)] transform hover:scale-115 active:scale-90 hover:-rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <Instagram className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsFacebookModalOpen(true))}
                aria-label="Subir a Facebook"
                title="Subir a Facebook (Feed 1200x630 y Cuadrado 1:1)"
                className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_14px_rgba(24,119,242,0.55)] transform hover:scale-115 active:scale-90 hover:rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <Facebook className="w-5 h-5 fill-white transform group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsYouTubeModalOpen(true))}
                aria-label="Subir a YouTube"
                title="Subir a YouTube (Shorts 9:16, Miniatura 16:9 y Guión de audio)"
                className="w-10 h-10 rounded-full bg-[#FF0000] hover:bg-[#cc0000] text-white flex items-center justify-center shadow-xs hover:shadow-[0_0_14px_rgba(255,0,0,0.6)] transform hover:scale-115 active:scale-90 hover:-rotate-6 transition-all duration-300 cursor-pointer relative group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <Youtube className="w-5 h-5 fill-white transform group-hover:scale-110 transition-transform duration-300" />
              </button>

              <button
                onClick={() => handleShareToFacebook(currentDay, currentDayNum)}
                aria-label="Compartir en Facebook"
                title="Compartir rápido en tu biografía o grupo de Facebook"
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200 rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer ml-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Compartir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Marquesina 'Limpia, limpia, limpia' */}
        <div className="max-w-md mx-auto w-full px-4 pt-4">
          <div className="bg-sand-100 border border-sand-200 rounded-full py-2 shadow-sm overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex items-center text-xs text-sand-600 font-medium">
              <span className="px-6">{t.cleanCleanClean}</span>
              <span className="px-6">{t.cleanCleanClean}</span>
              <span className="px-6">{t.cleanCleanClean}</span>
            </div>
          </div>
        </div>

        {/* Botones de navegación suaves con bordes redondeados */}
        <div className="flex gap-4 pt-4 max-w-2xl mx-auto">
          <button 
            onClick={goToPrevDay} 
            disabled={isFirstDayOfYear} 
            className="flex-1 py-4 bg-white border border-sand-200 text-sand-800 font-medium flex items-center justify-center gap-2 rounded-full shadow-sm hover:bg-sand-100 disabled:opacity-30 transition-all text-sm sm:text-base"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{t.back}</span>
          </button>
          <button 
            onClick={goToNextDay} 
            disabled={isLastDayOfYear} 
            className="flex-1 py-4 bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium flex items-center justify-center gap-2 rounded-full shadow-md hover:shadow-lg disabled:opacity-30 transition-all text-sm sm:text-base cursor-pointer"
          >
            <span>{t.next}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Accesos Conscientes: Rincón de Lectura & Conexión Consciente */}
        <div className="pt-2 max-w-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
          {/* Rincón de Lectura */}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 text-decoration-none cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.99]"
            title="Rincón de Lectura: Libros Gratuitos de Autoestima (Abre en una pestaña nueva)"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors block leading-tight truncate">
                  Rincón de Lectura
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  Libros gratuitos en OpenLibrary
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-terracotta-700 bg-white group-hover:bg-amber-100/60 px-2.5 py-1 rounded-full border border-amber-200/90 shrink-0 shadow-2xs">
              <span className="hidden xs:inline">Leer</span>
              <ExternalLink className="w-3 h-3 text-terracotta-600" />
            </div>
          </a>

          {/* Conexión Consciente (Wi-Fi Gratis) */}
          <button
            onClick={() => setIsWifiMapOpen(true)}
            className="group w-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EE] to-[#FDF8F3] hover:from-amber-50 hover:via-rose-50/70 hover:to-orange-50 text-stone-800 border border-amber-200/90 hover:border-terracotta-400 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.99] text-left"
            title="Conexión Consciente (Wi-Fi Gratis) - Mapa interactivo sin salir del almanaque"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-terracotta-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Wifi className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 group-hover:text-terracotta-700 transition-colors block leading-tight truncate">
                  Conexión Consciente
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  Mapa Wi-Fi gratis interactivo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white group-hover:bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/90 shrink-0 shadow-2xs">
              <span className="hidden xs:inline">Mapa</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </button>
        </div>
      </div>
    );
  };

  // Galería / Álbum personal sereno
  const renderGalleryView = () => (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 md:space-y-12 pb-32 animate-fade-in relative z-10">
      <div className="flex items-center gap-4 border-b border-sand-200 pb-4">
        <button 
          onClick={() => setView(ViewMode.INTRO)} 
          className="p-2.5 bg-white border border-sand-200 text-sand-700 rounded-full shadow-sm hover:bg-sand-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-sand-900">
            {t.personalAlbum}
          </h2>
          <p className="text-xs text-sand-600 font-medium">
            Personaliza tus fotos por mes: <strong>Día 1 para Enero</strong>, <strong>Día 2 para Febrero</strong>, y así sucesivamente con cada uno de los 12 meses.
          </p>
        </div>
      </div>

      {/* Sección 1: Portada Principal */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest text-sand-700 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            {t.coverPhoto}
          </h3>
          <button 
            onClick={() => requireAccess(checkPhotoUploadAccess(currentUser), () => coverFileInputRef.current?.click())} 
            className="text-xs font-semibold text-stone-700 bg-white hover:bg-sand-100 px-3.5 py-1.5 rounded-full border border-sand-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Camera size={13} className="text-stone-600" />
            <span>Cambiar Portada</span>
          </button>
        </div>
        <div className="aspect-[16/9] w-full max-w-3xl rounded-3xl overflow-hidden bg-sand-100 border border-sand-300 relative group shadow-sm flex items-center justify-center">
          {/* Fondo difuminado cálido con la misma imagen */}
          <img 
            src={coverImage || LANDSCAPE_INTRO_IMG} 
            className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-110 pointer-events-none" 
            alt="" 
            referrerPolicy="no-referrer"
          />
          {/* Imagen de portada nítida y visible */}
          <img 
            src={coverImage || LANDSCAPE_INTRO_IMG} 
            className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md" 
            alt="Portada" 
            referrerPolicy="no-referrer"
            onError={handleImageError} 
          />
          {/* Logo oficial agregado a la imagen de portada */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-white/90 shadow-md pointer-events-none">
            <img 
              src="/logo.png" 
              alt="Logo Almanaque" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-xs border border-sand-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER_IMAGE_EXTERNAL;
              }}
            />
            <div className="leading-tight text-left">
              <span className="text-[11px] sm:text-xs font-serif font-bold text-sand-900 block">Almanaque de Amor Propio</span>
              <span className="text-[9px] sm:text-[10px] text-terracotta-700 font-semibold tracking-wider uppercase block">y Autoestima</span>
            </div>
          </div>
          <div className="absolute inset-0 z-30 bg-sand-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => requireAccess(checkPhotoUploadAccess(currentUser), () => coverFileInputRef.current?.click())} 
              className="bg-white text-sand-900 border border-sand-200 px-6 py-2.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-2 hover:bg-sand-50 transition-all cursor-pointer"
            >
              <Camera size={16} /> Cambiar Foto de Portada
            </button>
          </div>
        </div>
      </section>

      {/* Sección 2: Fotos por Mes (12 Meses del Año) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-sand-800 font-bold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-terracotta-600" />
              Fotos por Mes (12 Meses del Año)
            </h3>
            <p className="text-xs text-sand-500 mt-0.5">
              La foto del <strong>Día 1 para Enero</strong>, <strong>Día 2 para Febrero</strong>, y sucesivamente para los 12 meses.
            </p>
          </div>
          <span className="text-[11px] font-mono text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 w-fit font-medium">
            12 Meses · Días 1 al 12
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {MONTH_NAMES.map((monthName, mIdx) => {
            const correspondingDay = mIdx + 1;
            const content = DAYS_CONTENT[mIdx] || DAYS_CONTENT[0];
            const img = getMonthImage(mIdx);
            const isCustom = !!(monthlyImages[mIdx] || dailyImages[correspondingDay]);

            return (
              <div 
                key={monthName}
                className="bg-white rounded-3xl border border-sand-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Visualizador de imagen */}
                <div 
                  className="aspect-[4/3] relative overflow-hidden bg-sand-100 cursor-pointer"
                  onClick={() => selectDay(correspondingDay - 1, mIdx)}
                  title={`Ver Día ${correspondingDay} en ${monthName}`}
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={`Foto de ${monthName}`} 
                    onError={handleImageError} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-black/20" />
                  
                  {/* Badge Mes y Día */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs">
                      {monthName}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-terracotta-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      Día {correspondingDay}
                    </span>
                  </div>

                  {/* Estado personalizado */}
                  {isCustom && (
                    <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold text-emerald-300 bg-stone-950/70 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      ✓ Foto personalizada
                    </span>
                  )}
                </div>

                {/* Info y botón para subir foto de este mes */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base leading-snug">
                      {content.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 italic mt-0.5">
                      "{content.mantra || content.subtitle || 'Amor propio y paz'}"
                    </p>
                  </div>

                  <button
                    onClick={() => triggerMonthUpload(mIdx)}
                    className="w-full bg-sand-100 hover:bg-terracotta-50 text-stone-800 hover:text-terracotta-800 border border-sand-300 hover:border-terracotta-300 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Camera size={14} className="text-terracotta-600" />
                    <span>Subir foto {monthName}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sección 3: Fotos Clasificadas por Años (2028 a 2033+) · Meses 1 al 12 */}
      <section className="space-y-6 pt-6 border-t border-sand-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-terracotta-700 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200/70">
                Años 2028 - 2033+
              </span>
              <span className="text-xs text-stone-500 font-medium">· Colección por Años</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
              Fotos para Días Adicionales Clasificadas por Años (Meses 1 al 12)
            </h3>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl">
              Imágenes organizadas del 1 al 12 (Enero a Diciembre) para el Año 2028, Año 2029, Año 2030, Año 2031, Año 2032 y Año 2033. Podrás personalizar y sumar más fotos en cualquier momento.
            </p>
          </div>

          {/* Selector de pestañas por Año */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedGalleryYear('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedGalleryYear === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-sand-100 hover:bg-sand-200 text-stone-700 border border-sand-300/80'
              }`}
            >
              Todos los Años
            </button>
            {AVAILABLE_YEARS_GALLERY.map((yr) => {
              const isYrUnlocked = yr === 2027 || unlockedYears.includes(yr);
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedGalleryYear(yr)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedGalleryYear === yr
                      ? 'bg-terracotta-600 text-white shadow-sm'
                      : 'bg-sand-100 hover:bg-sand-200 text-stone-700 border border-sand-300/80'
                  }`}
                >
                  {!isYrUnlocked && <span className="text-[10px] opacity-75">🔒</span>}
                  <span>Año {yr}</span>
                  {isYrUnlocked && <span className="text-[10px] text-emerald-600 font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Despliegue de los años seleccionados */}
        <div className="space-y-8">
          {(selectedGalleryYear === 'all' ? AVAILABLE_YEARS_GALLERY : [selectedGalleryYear]).map((yearNum) => {
            const totalMonths = 12;
            const isYearUnlocked = yearNum === 2027 || unlockedYears.includes(yearNum);

            return (
              <div 
                key={yearNum} 
                className="bg-white/90 rounded-3xl border border-sand-200 p-4 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center font-serif font-bold text-terracotta-700 shadow-2xs">
                      {yearNum}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                        Año {yearNum}
                        <span className="text-xs font-sans font-normal text-stone-500">
                          {yearNum === 2033 ? '(Meses 1 al 6 asignados · Espacios para sumar más)' : '(12 Meses · Clasificados del 1 al 12)'}
                        </span>
                        {isYearUnlocked ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Anualidad Habilitada
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Lock size={10} />
                            Requiere Anualidad
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {yearNum === 2028 && 'Fotos 1 al 12 (Enero a Diciembre) correspondientes a la primera etapa de días adicionales.'}
                        {yearNum === 2029 && 'Fotos 1 al 12 (Enero a Diciembre): 7 fotos anteriores + 5 nuevas incorporadas.'}
                        {yearNum === 2030 && 'Fotos 1 al 12 (Enero a Diciembre) con su clasificación y mantra mensual.'}
                        {yearNum === 2031 && 'Fotos 1 al 12 (Enero a Diciembre) para el ciclo de transformación espiritual.'}
                        {yearNum === 2032 && 'Fotos 1 al 12 (Enero a Diciembre) de amor propio, presencia y paz.'}
                        {yearNum === 2033 && 'Fotos del 1 al 6 asignadas (Enero a Junio), con tarjetas listas para sumar las siguientes fotos cuando desees.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleSelectYear(yearNum);
                      if (isYearUnlocked) {
                        setView(ViewMode.CALENDAR);
                        showToast(`📅 Navegando al Calendario ${yearNum}`);
                      }
                    }}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 w-fit cursor-pointer ${
                      isYearUnlocked
                        ? 'text-terracotta-700 hover:text-terracotta-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
                        : 'text-amber-950 hover:text-white bg-amber-100/90 hover:bg-amber-700 border-amber-300'
                    }`}
                    title={isYearUnlocked ? `Abrir calendario anual del año ${yearNum}` : `Desbloquear anualidad del Año ${yearNum} ($25.00)`}
                  >
                    {isYearUnlocked ? (
                      <>
                        <CalendarIcon size={12} />
                        <span>Ver Año {yearNum} en Calendario (Habilitado)</span>
                      </>
                    ) : (
                      <>
                        <Lock size={12} className="text-amber-700" />
                        <span>Desbloquear Año {yearNum} ($25.00 Anualidad)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {Array.from({ length: totalMonths }).map((_, mZeroIdx) => {
                    const monthNum = mZeroIdx + 1; // 1 to 12
                    const monthName = MONTH_NAMES_ES[mZeroIdx];
                    const photoInfo = getYearlyPhotoForMonth(yearNum, monthNum, customYearlyImages);
                    const hasPhoto = !!photoInfo?.imageUrl;

                    return (
                      <div
                        key={monthNum}
                        className={`rounded-2xl overflow-hidden border transition-all flex flex-col group ${
                          hasPhoto 
                            ? 'bg-sand-50 border-sand-200 shadow-2xs hover:shadow-sm hover:border-sand-300' 
                            : 'bg-stone-50/70 border-dashed border-stone-200'
                        }`}
                      >
                        {/* Contenedor de la foto */}
                        <div className="aspect-[4/3] relative overflow-hidden bg-sand-100">
                          {hasPhoto ? (
                            <>
                              <img
                                src={photoInfo.imageUrl}
                                alt={`Año ${yearNum} - Mes ${monthNum} (${monthName})`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (photoInfo?.altUrl && !target.dataset.triedAlt) {
                                    target.dataset.triedAlt = 'true';
                                    target.src = photoInfo.altUrl;
                                  } else {
                                    target.src = FALLBACK_IMG;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-black/20" />
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-stone-400 bg-stone-100/60">
                              <Camera size={20} className="text-stone-300 mb-1" />
                              <span className="text-[10px] font-medium text-stone-400">Disponible</span>
                            </div>
                          )}

                          {/* Badge de Mes y Número 1 al 12 */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                            <span className="text-[10px] font-mono font-bold bg-white/95 text-stone-900 px-2 py-0.5 rounded-full shadow-2xs">
                              {monthNum}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-stone-900/80 text-amber-200 px-1.5 py-0.5 rounded-full">
                              {monthName}
                            </span>
                          </div>

                          {/* Botón flotante para cambiar o sumar foto */}
                          <button
                            onClick={() => triggerYearlyUpload(yearNum, monthNum)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                            title={`Subir/Cambiar foto de ${monthName} ${yearNum} (Mes ${monthNum})`}
                          >
                            <Camera size={13} className="text-terracotta-700" />
                          </button>

                          {photoInfo?.isCustom && (
                            <span className="absolute bottom-2 left-2 text-[9px] font-semibold text-emerald-300 bg-stone-950/75 px-1.5 py-0.5 rounded-full z-10">
                              ✓ Personalizada
                            </span>
                          )}
                        </div>

                        {/* Pie de tarjeta con info */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between gap-1.5">
                          <div>
                            <div className="text-[10px] font-serif font-bold text-stone-900 truncate" title={photoInfo?.title || `${monthName} ${yearNum}`}>
                              {photoInfo?.title || `${monthName} ${yearNum}`}
                            </div>
                            <div className="text-[9px] text-stone-500">
                              Mes {monthNum} de 12
                            </div>
                          </div>

                          <button
                            onClick={() => triggerYearlyUpload(yearNum, monthNum)}
                            className={`w-full py-1 px-2 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              hasPhoto 
                                ? 'bg-white hover:bg-amber-50 text-stone-700 hover:text-terracotta-700 border border-stone-200 shadow-2xs' 
                                : 'bg-amber-50/80 hover:bg-amber-100 text-terracotta-800 border border-amber-200'
                            }`}
                          >
                            <Camera size={11} className="text-terracotta-600" />
                            <span>{hasPhoto ? 'Cambiar' : 'Sumar foto'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 selection:bg-gold-200 selection:text-sand-900 relative overflow-x-hidden">
      {/* Banner especial cuando se visualiza embebido dentro de Blogger */}
      {isEmbeddedMode && (
        <div className="bg-[#FAF2EE] border-b border-[#E8C5B9] text-[#7B3F30] px-3 sm:px-4 py-1.5 text-xs flex items-center justify-between z-50">
          <span className="flex items-center gap-1.5 font-medium truncate">
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 animate-pulse"></span>
            <span className="truncate">🌸 <strong>Almanaque de Amor Propio</strong> &bull; Edición Web para Blogger</span>
          </span>
          <button 
            onClick={() => {
              const cleanUrl = getShareableUrl();
              window.open(cleanUrl, '_blank');
            }}
            className="text-[11px] font-bold bg-white text-orange-800 hover:text-orange-950 px-2.5 py-0.5 rounded-full border border-[#E8C5B9] ml-2 whitespace-nowrap cursor-pointer shadow-2xs shrink-0 transition-colors"
            title="Abrir en pestaña completa independiente"
          >
            Pantalla completa ↗
          </button>
        </div>
      )}

      {/* Toast no intrusivo */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 bg-sand-900/90 backdrop-blur-md text-white border border-sand-700 shadow-xl rounded-full text-xs sm:text-sm font-medium tracking-wide animate-fade-in flex items-center gap-2 pointer-events-none">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fondo sereno dinámico */}
      {view !== ViewMode.INTRO && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-sand-50/90 backdrop-blur-[24px]" />
          </div>
        </div>
      )}

      {renderHeader()}

      <main className="container mx-auto max-w-screen-xl relative z-10 pb-12">
        {view === ViewMode.INTRO && renderIntroView()}
        {view === ViewMode.CALENDAR && renderCalendarView()}
        {view === ViewMode.DAY_DETAIL && renderDayDetailView()}
        {view === ViewMode.GALLERY && renderGalleryView()}
        {view === ViewMode.SUPPORT && (
          <SupportProjectSection 
            currentUser={currentUser}
            onOpenPayment={handleOpenPaymentWithCustomItem}
            onShowToast={showToast}
          />
        )}
        {view === ViewMode.TIKTOK && (
          <TikTokSection 
            currentUser={currentUser}
            onOpenPayment={handleOpenPaymentWithCustomItem}
            onShowToast={showToast}
            onGoToCalendar={() => { setView(ViewMode.CALENDAR); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}
        {view === ViewMode.YOUTUBE && (
          <YouTubeGallerySection 
            currentUser={currentUser}
            onOpenPayment={handleOpenPaymentWithCustomItem}
            onShowToast={showToast}
            onGoToCalendar={() => { setView(ViewMode.CALENDAR); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}
      </main>

      {/* Dock de navegación flotante tipo iOS para cambio rápido entre vistas */}
      {view !== ViewMode.INTRO && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="glass-dock px-3 sm:px-4 py-2 rounded-full flex items-center gap-1.5 sm:gap-3 shadow-[0_12px_35px_rgba(46,39,33,0.18)] border border-white/80 backdrop-blur-xl">
            <button
              onClick={() => navigateToView(ViewMode.INTRO)}
              className="p-2 sm:p-2.5 rounded-full text-stone-700 hover:bg-stone-100/80 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Inicio / Dashboard"
            >
              <Home className="w-4 h-4 text-terracotta-600" />
              <span className="hidden sm:inline">Inicio</span>
            </button>
            <button
              onClick={() => navigateToView(ViewMode.CALENDAR)}
              className={`p-2 sm:p-2.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                view === ViewMode.CALENDAR 
                  ? 'bg-sand-900 text-white shadow-xs' 
                  : 'text-stone-700 hover:bg-stone-100/80'
              }`}
              title={`Calendario ${selectedYear}`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Calendario</span>
            </button>
            <button
              onClick={() => navigateToView(ViewMode.DAY_DETAIL)}
              className={`p-2 sm:p-2.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                view === ViewMode.DAY_DETAIL 
                  ? 'bg-sand-900 text-white shadow-xs' 
                  : 'text-stone-700 hover:bg-stone-100/80'
              }`}
              title="Lectura del Día"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Día {currentDayNum}</span>
            </button>
            <button
              onClick={() => navigateToView(ViewMode.SUPPORT)}
              className={`p-2 sm:px-3 sm:py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                view === ViewMode.SUPPORT 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
              }`}
              title="Apoya este proyecto por solo $1.25"
            >
              <Heart className={`w-4 h-4 ${view === ViewMode.SUPPORT ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
              <span className="hidden sm:inline">Apoyar $1.25</span>
            </button>
            <button
              onClick={() => navigateToView(ViewMode.TIKTOK)}
              className={`p-2 sm:px-3 sm:py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                view === ViewMode.TIKTOK 
                  ? 'bg-stone-900 text-rose-300 shadow-xs' 
                  : 'text-stone-700 hover:bg-stone-100/80'
              }`}
              title="Videos Diarios de TikTok por solo $1.75"
            >
              <Video className={`w-4 h-4 ${view === ViewMode.TIKTOK ? 'text-rose-400' : 'text-stone-600'}`} />
              <span className="hidden sm:inline">TikTok $1.75</span>
            </button>
            <button
              onClick={() => navigateToView(ViewMode.YOUTUBE)}
              className={`p-2 sm:px-3 sm:py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                view === ViewMode.YOUTUBE 
                  ? 'bg-stone-900 text-red-300 shadow-xs ring-1 ring-red-400/30' 
                  : 'text-stone-700 hover:bg-stone-100/80'
              }`}
              title="Módulo de YouTube Gallery ($1.75)"
            >
              <Youtube className={`w-4 h-4 ${view === ViewMode.YOUTUBE ? 'text-red-400 fill-red-400' : 'text-stone-600'}`} />
              <span className="hidden sm:inline">YouTube $1.75</span>
            </button>
            <button
              onClick={() => requireAccess(checkOracleAccess(currentUser), () => setIsOracleOpen(true))}
              className="p-2 sm:p-2.5 rounded-full text-stone-700 hover:bg-stone-100/80 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Oráculo de Afirmaciones"
            >
              <Compass className="w-4 h-4 text-gold-600" />
              <span className="hidden sm:inline">Oráculo</span>
            </button>
            <button
              onClick={() => setIsMembershipOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-sand-100 text-terracotta-700 hover:bg-terracotta-100 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer relative"
              title="Círculo de Paz - 30 días gratis para los primeros 100"
            >
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              <span className="hidden sm:inline">Círculo</span>
              <span className="hidden md:inline text-[9px] bg-terracotta-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                30d Gratis
              </span>
            </button>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-terracotta-600 text-white hover:bg-terracotta-700 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
              title="Pasarela de Pagos Oficial"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Pagar</span>
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN DE DISCLAIMERS AL PIE DE LA PANTALLA (PAGO & 30 DÍAS GRATIS) */}
      <section id="disclaimers-pie-de-pantalla" className="container mx-auto max-w-5xl px-4 mt-8 mb-4 relative z-10">
        {/* Aviso de Prueba Vencida al Pie de la Pantalla */}
        {isTrialExpired && (
          <div id="trial-expired-bottom-card" className="mb-6 p-4 sm:p-5 bg-rose-50/95 border border-rose-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-rose-950 shadow-sm backdrop-blur-md animate-fade-in">
            <div className="flex items-start sm:items-center gap-3 text-xs sm:text-sm text-left">
              <span className="p-2 bg-rose-100 text-rose-700 rounded-full shrink-0 mt-0.5 sm:mt-0">
                <CreditCard className="w-4 h-4" />
              </span>
              <div>
                <strong className="block text-rose-900 font-bold mb-0.5">Disclaimer de Pago · Período de Gracia Concluido</strong>
                <p className="text-rose-800 text-xs leading-relaxed">
                  Tu mes de prueba gratis de 30 días ha concluido. Para continuar disfrutando del diario íntimo de sanación, el oráculo y las lecturas completas, abona tu cuota mensual en la pasarela de pagos oficial.
                </p>
              </div>
            </div>
            <button
              id="bottom-pay-now-btn"
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Abonar Cuota Mensual</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Disclaimer de 30 Días Gratis */}
          <div id="disclaimer-30-dias-gratis-pie" className="glass-panel p-5 sm:p-6 rounded-3xl border border-sand-200/90 bg-white/75 backdrop-blur-md shadow-2xs flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 text-terracotta-700 mb-2">
                <Gift className="w-4 h-4" />
                <h4 className="font-serif font-bold text-sm tracking-wide text-sand-900">
                  Disclaimer · 30 Días de Prueba Gratis
                </h4>
              </div>
              <p className="text-xs text-sand-700 leading-relaxed">
                Beneficio de bienvenida para los primeros 100 usuarios en registrarse. Brinda acceso sin costo durante 30 días continuos desde la fecha de inscripción para experimentar el almanaque, afirmaciones, meditaciones y frecuencias 432 Hz sin cobros anticipados.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sand-200/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {currentUser?.paymentStatus === 'in_trial'
                  ? `Prueba activa (${getTrialDaysRemaining()} días restantes)`
                  : 'Primeros 100 sin costo'}
              </span>
              <button
                onClick={() => setIsMembershipOpen(true)}
                className="text-xs font-semibold text-terracotta-700 hover:text-terracotta-900 underline underline-offset-2 cursor-pointer"
              >
                Ver cupos & activar
              </button>
            </div>
          </div>

          {/* Disclaimer de Pago */}
          <div id="disclaimer-pago-pie" className="glass-panel p-5 sm:p-6 rounded-3xl border border-sand-200/90 bg-white/75 backdrop-blur-md shadow-2xs flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 text-gold-700 mb-2">
                <Shield className="w-4 h-4" />
                <h4 className="font-serif font-bold text-sm tracking-wide text-sand-900">
                  Disclaimer de Pago & Suscripción Mensual
                </h4>
              </div>
              <p className="text-xs text-sand-700 leading-relaxed">
                Una vez transcurrido el mes de prueba gratuito, la membresía se sostiene mediante una cuota mensual cancelable en cualquier momento: Categoría 1 ($2.25 USD/mes), Categoría 2 ($4.99 USD/mes), Círculo de Paz ($9.99 USD/mes) o Categoría 3 ($25.00 USD/mes). Procesamiento encriptado vía Tarjeta de Crédito/Débito, Mercado Pago o PayPal.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sand-200/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-700 bg-sand-100 px-2.5 py-1 rounded-full">
                {currentUser?.paymentStatus === 'active_paid' ? 'Suscripción Activa' : 'Tarifas desde $2.25/mes'}
              </span>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-xs font-semibold text-terracotta-700 hover:text-terracotta-900 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pasarela de Pagos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Derechos de Autor, Deslinde de Responsabilidad & Política de Devolución */}
        <div id="disclaimer-derechos-y-deslinde-pie" className="mt-4 glass-panel p-5 sm:p-6 rounded-3xl border border-sand-200/90 bg-white/80 backdrop-blur-md shadow-2xs text-left space-y-3">
          <div className="flex items-center gap-2 text-stone-700 mb-1">
            <Shield className="w-4 h-4 text-terracotta-600" />
            <h4 className="font-serif font-bold text-sm tracking-wide text-sand-900">
              Derechos de Autor, Deslinde & Políticas
            </h4>
          </div>
          <p className="text-xs text-sand-700 leading-relaxed">
            <strong>Derechos de autor y autoría:</strong> Parte de las oraciones y mantras tradicionales pertenecen al acervo de sabiduría espiritual y sanación transmitida generosamente en la red. Han sido adaptadas con infinito amor y gratitud para este viaje de 21 días y anual: durante 21 días se busca transformar patrones del pasado y el resto de los días se encuentra material adicional hasta iniciar el nuevo mes, teniendo presente que cada mes es diferente.
          </p>
          <div className="p-3.5 bg-sand-50/90 rounded-2xl border border-sand-200/80 text-xs text-stone-800 leading-relaxed">
            <strong className="text-sand-900 font-bold block mb-1">Deslinde de responsabilidad:</strong>
            El contenido compartido en este espacio representa mi experiencia personal. Esta información se proporciona únicamente con fines informativos y no constituye, ni sustituye, el asesoramiento, diagnóstico o tratamiento médico o psicológico profesional. El uso de la información presentada aquí queda bajo tu propia responsabilidad.
          </div>
          <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200/90 text-xs text-amber-900 leading-relaxed space-y-2">
            <div>
              <strong className="text-amber-950 font-bold block mb-0.5">Método de entrega digital:</strong>
              Los materiales adquiridos (mantras de apoyo, planes de membresía o anualidades) son productos digitales de entrega inmediata. Una vez procesado y confirmado el pago, el material se descarga automáticamente en tu dispositivo y se activan los accesos en la plataforma, respetando las restricciones de cada categoría.
            </div>
            <div>
              <strong className="text-amber-950 font-bold block mb-0.5">Política de devolución:</strong>
              Al ser un producto digital, una vez que se descarga ya no se puede devolver.
            </div>
          </div>
        </div>
      </section>

      {/* Pie de página cálido con enlaces discretos */}
      <footer className="mt-6 md:mt-10 text-center text-sand-600 p-8 md:p-12 border-t border-sand-200 bg-sand-100/70 flex flex-col items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-sand-300 ring-2 ring-white hover:scale-105 transition-transform">
            <img 
              src={APP_LOGO_SRC} 
              alt="Logo Almanaque de Amor Propio y Autoestima" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = APP_LOGO_FALLBACK;
              }}
            />
          </div>
        </div>
        <p className="font-serif text-base md:text-lg text-sand-900 font-semibold whitespace-nowrap">
          Almanaque de Amor Propio y Autoestima
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-sand-600">
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="hover:text-sand-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Acerca de & Gratitud
          </button>
          <span>•</span>
          <button 
            onClick={() => setIsMembershipOpen(true)}
            className="hover:text-sand-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Círculo de Paz · 30 Días Gratis
          </button>
          <span>•</span>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="hover:text-sand-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Pasarela de Pagos Oficial
          </button>
          <span>•</span>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="hover:text-sand-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {currentUser ? `Cuenta (${currentUser.name.split(' ')[0]})` : 'Iniciar Sesión'}
          </button>
          <span>•</span>
          <button 
            onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsBloggerModalOpen(true))}
            className="hover:text-orange-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer text-orange-800 flex items-center gap-1"
            title="Generar código HTML para incrustar en Blogger"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publicar en Blogger</span>
          </button>
          <span>•</span>
          <button 
            onClick={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true))}
            className="hover:text-rose-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer text-rose-800 flex items-center gap-1"
            title="Adaptar y compartir en Instagram (Historias & Feed)"
          >
            <Instagram className="w-3.5 h-3.5 text-rose-600" />
            <span>Subir a Instagram</span>
          </button>
          <span>•</span>
          <button 
            onClick={() => {
              setView(ViewMode.SUPPORT);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-rose-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer text-rose-800 flex items-center gap-1"
            title="Apoya este proyecto por solo $1.25 (Mantras potenciados con imágenes como ojos de amor con paisajes reales)"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Apoya este proyecto ($1.25)</span>
          </button>
        </div>
      </footer>

      {/* Modales */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`✨ ¡Bienvenid@, ${user.name}!`);
        }}
        onLogout={handleLogout}
        onOpenPayment={() => {
          setIsAuthModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
        onSimulateTrialExpired={handleSimulateTrialExpired}
        onResetTrial={handleResetTrial}
        onSetPlanAndStatus={handleSetPlanAndStatus}
      />
      <TierLockModal
        isOpen={tierLockInfo.isOpen}
        onClose={() => {
          setTierLockInfo(prev => ({ ...prev, isOpen: false }));
          setTargetYearForPayment(null);
        }}
        featureName={tierLockInfo.featureName}
        reason={tierLockInfo.reason}
        minPlanId={tierLockInfo.minPlanId}
        minPriceStr={tierLockInfo.minPriceStr}
        currentUser={currentUser}
        targetYear={tierLockInfo.targetYear || targetYearForPayment || undefined}
        onOpenPayment={(plan, year) => {
          setTierLockInfo(prev => ({ ...prev, isOpen: false }));
          if (plan) {
            setTargetPlanForPayment(plan);
          }
          if (year) {
            setTargetYearForPayment(year);
          }
          setIsPaymentModalOpen(true);
        }}
      />
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setTargetYearForPayment(null);
          setCustomPaymentTitle(null);
          setCustomPaymentAmount(null);
          setInitialCompletedPayment(null);
        }}
        currentUser={currentUser}
        defaultPlan={targetPlanForPayment}
        targetYear={targetYearForPayment}
        customTitle={customPaymentTitle}
        customAmount={customPaymentAmount}
        onPaymentSuccess={handlePaymentSuccess}
        initialCompletedPayment={initialCompletedPayment}
      />
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        onOpenPayment={(plan) => {
          setIsMembershipOpen(false);
          setTargetPlanForPayment(plan);
          setIsPaymentModalOpen(true);
        }}
        onSuccess={(plan) => {
          showToast("✨ ¡Bienvenid@! Has activado tus 30 días de prueba gratuita.");
        }}
      />
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        dayNum={currentDayNum}
        dayTitle={currentDay.title}
        onShowToast={showToast}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPayment={() => {
          setTargetPlanForPayment('cat2');
          setIsPaymentModalOpen(true);
        }}
      />
      <OracleModal
        isOpen={isOracleOpen}
        onClose={() => setIsOracleOpen(false)}
      />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />
      <TimezoneModal
        isOpen={isTimezoneModalOpen}
        onClose={() => setIsTimezoneModalOpen(false)}
        selectedCountry={selectedCountry}
        weatherInfo={weatherInfo}
        onSelectCountry={(country) => {
          setSelectedCountry(country);
          setWeatherInfo(null);
          try {
            localStorage.setItem('almanaque_country_code', country.code);
            localStorage.setItem('almanaque_selected_country_json', JSON.stringify(country));
          } catch {}
          showToast(`📍 Ubicación y clima: ${country.code} ${country.city || country.name}`);
        }}
      />
      <BloggerModal
        isOpen={isBloggerModalOpen}
        onClose={() => setIsBloggerModalOpen(false)}
        currentDay={currentDay}
        currentDayNum={currentDayNum}
      />
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        currentDay={currentDay}
        currentDayNum={currentDayNum}
      />
      <FacebookModal
        isOpen={isFacebookModalOpen}
        onClose={() => setIsFacebookModalOpen(false)}
        currentDay={currentDay}
        currentDayNum={currentDayNum}
      />
      <ThreadsModal
        isOpen={isThreadsModalOpen}
        onClose={() => setIsThreadsModalOpen(false)}
        currentDay={currentDay}
        currentDayNum={currentDayNum}
      />
      <SocialNetworksHubModal
        isOpen={isSocialHubModalOpen}
        onClose={() => setIsSocialHubModalOpen(false)}
        currentDay={currentDay}
        currentDayNum={currentDayNum}
        onOpenInstagram={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true))}
        onOpenFacebook={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsFacebookModalOpen(true))}
        onOpenThreads={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsThreadsModalOpen(true))}
        onOpenBlogger={() => requireAccess(checkSocialPublisherAccess(currentUser), () => setIsBloggerModalOpen(true))}
        onOpenTikTok={() => {
          setView(ViewMode.TIKTOK);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenYouTube={() => {
          setView(ViewMode.YOUTUBE);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenYouTubeMusic={() => setIsYouTubeMusicOpen(true)}
      />
      <SocialNetworkActionModal
        isOpen={isSocialActionModalOpen}
        onClose={() => setIsSocialActionModalOpen(false)}
        initialNetwork={activeSocialNetworkAction}
        onProceedToPayment={(networkId, title, amount) => {
          handleOpenPaymentWithCustomItem(networkId as any, title, amount);
        }}
        onOpenContentModal={(networkId) => {
          if (networkId === 'instagram') {
            requireAccess(checkSocialPublisherAccess(currentUser), () => setIsInstagramModalOpen(true));
          } else if (networkId === 'facebook') {
            requireAccess(checkSocialPublisherAccess(currentUser), () => setIsFacebookModalOpen(true));
          } else if (networkId === 'blogger') {
            requireAccess(checkSocialPublisherAccess(currentUser), () => setIsBloggerModalOpen(true));
          } else if (networkId === 'tiktok') {
            setView(ViewMode.TIKTOK);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (networkId === 'youtube') {
            setView(ViewMode.YOUTUBE);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        currentDay={currentDay}
        currentDayNum={currentDayNum}
      />
      <YouTubeMusicModal
        isOpen={isYouTubeMusicOpen}
        onClose={() => setIsYouTubeMusicOpen(false)}
        currentTrack={currentYouTubeTrack}
        onSelectTrack={handleSelectYouTubeTrack}
        isPlaying={isYouTubePlaying}
        onTogglePlay={handleToggleYouTubePlay}
        onMinimize={() => setIsYouTubeMusicOpen(false)}
      />
      <YouTubeFloatingPlayer
        currentTrack={currentYouTubeTrack}
        isPlaying={isYouTubePlaying}
        onTogglePlay={handleToggleYouTubePlay}
        onOpenModal={() => setIsYouTubeMusicOpen(true)}
        onStop={handleStopYouTube}
        isModalOpen={isYouTubeMusicOpen}
      />

      {/* Modal de Conexión Consciente (Mapa Wi-Fi con Leaflet & Overpass) */}
      <WifiMapModal
        isOpen={isWifiMapOpen}
        onClose={() => setIsWifiMapOpen(false)}
        defaultCityName={selectedCountry.city || selectedCountry.name}
      />

      <input 
        type="file" 
        ref={coverFileInputRef} 
        onChange={handleCoverFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={dailyFileInputRef} 
        onChange={(e) => uploadingDayNum !== null && handleDailyFileChange(e, uploadingDayNum)} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={monthFileInputRef} 
        onChange={(e) => uploadingMonthIdx !== null && handleMonthFileChange(e, uploadingMonthIdx)} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={yearlyFileInputRef} 
        onChange={(e) => uploadingYearPhoto !== null && handleYearlyFileChange(e, uploadingYearPhoto.year, uploadingYearPhoto.month)} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default App;
