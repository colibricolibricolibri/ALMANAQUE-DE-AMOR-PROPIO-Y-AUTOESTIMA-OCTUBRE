import { UserAccount, PlanCategory } from '../../types';

export type UserTier = 'free_trial' | 'cat1' | 'cat2' | 'circulo' | 'cat3' | 'expired';

export interface TierBenefitInfo {
  tier: UserTier;
  name: string;
  priceStr: string;
  priceVal: number;
  badge: string;
  badgeColor: string;
  shortDesc: string;
  unlockedFeatures: string[];
}

export const TIER_BENEFITS: Record<UserTier, TierBenefitInfo> = {
  free_trial: {
    tier: 'free_trial',
    name: 'Mes Gratis (Acceso Básico)',
    priceStr: '$0.00',
    priceVal: 0,
    badge: 'Mes Gratis',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    shortDesc: 'Contenido básico de introducción',
    unlockedFeatures: [
      'Lectura de los primeros 3 días del mes (Días 1, 2 y 3)',
      'Afirmación y mantra esencial de cada día básico',
      'Mini calendario del año actual (2027)',
      'Campana zen tibetana individual (chime)',
      'Clima y reloj mundial de ciudades'
    ]
  },
  cat1: {
    tier: 'cat1',
    name: 'Categoría 1 (Acompañamiento Esencial)',
    priceStr: '$2.25 / mes',
    priceVal: 2.25,
    badge: 'Categoría 1 · $2.25',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    shortDesc: '31 Días completos y Calendario perpetuo 2027 a 3037',
    unlockedFeatures: [
      'Acceso irrestricto a los 31 días del mes de sabiduría y mantras',
      'Calendario perpetuo completo de 2027 a 3037 con feriados y años bisiestos',
      'Oraciones y afirmaciones profundas de todo el año',
      'Sincronización horaria y clima en vivo',
      'Todo lo incluido en el acceso básico'
    ]
  },
  cat2: {
    tier: 'cat2',
    name: 'Categoría 2 (Calma & Profundización)',
    priceStr: '$4.99 / mes',
    priceVal: 4.99,
    badge: 'Categoría 2 · $4.99',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    shortDesc: '432 Hz continuos, Diario Íntimo y Respiración Pranayama',
    unlockedFeatures: [
      'Todo lo incluido en Categoría 1 (31 días + Calendario 2027-3037)',
      'Frecuencias continuas de 432 Hz y Cuencos Tibetanos en bucle armónico',
      'Diario Íntimo de sanación, desahogo privado y notas de gratitud',
      'Ejercicios guiados de respiración consciente (Pranayama)',
      'Exportación segura de tus notas personales de sanación'
    ]
  },
  circulo: {
    tier: 'circulo',
    name: 'Círculo de Paz (Comunidad & Oráculo)',
    priceStr: '$9.99 / mes',
    priceVal: 9.99,
    badge: 'Círculo de Paz · $9.99',
    badgeColor: 'bg-gold-100 text-gold-900 border-gold-300',
    shortDesc: 'Oráculo sagrado, Sabiduría y Publicador en Redes',
    unlockedFeatures: [
      'Todo lo de Categorías 1 y 2 (31 días, 2027-3037, 432Hz y Diario)',
      'Oráculo sagrado de Cartas de Luz y Guía diaria de orientación',
      'Generador y exportador enriquecido para Blogger, Instagram, Facebook y YouTube',
      'Insignia dorada del Círculo de Paz'
    ]
  },
  cat3: {
    tier: 'cat3',
    name: 'Categoría 3 (Paquete Prémium / Nivel Maestro)',
    priceStr: '$25.00 / anualidad',
    priceVal: 25.0,
    badge: 'Prémium Anual · $25.00',
    badgeColor: 'bg-terracotta-100 text-terracotta-900 border-terracotta-400',
    shortDesc: 'Personalización fotográfica exclusiva, Anualidad (2027 a 3037) y Nivel Maestro',
    unlockedFeatures: [
      'Personalización fotográfica exclusiva: Subida de foto de portada y de los 12 meses del año',
      'Acceso por Anualidad: Pago del Año 2027 incluido; desbloqueo año a año para 2028 a 3037',
      'Desbloqueo al 100% de los 12 meses, mantras y galería completa del año adquirido',
      'Todo lo de Categoría 1, 2 y Círculo de Paz con prioridad total',
      'Descarga de afirmaciones y audios en alta fidelidad',
      'Canal de consulta y acompañamiento prioritario',
      'Insignia dorada de Nivel Maestro'
    ]
  },
  expired: {
    tier: 'expired',
    name: 'Prueba Concluida',
    priceStr: 'Pago Requerido',
    priceVal: 0,
    badge: 'Prueba Concluida',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    shortDesc: 'Activa tu suscripción para continuar',
    unlockedFeatures: []
  }
};

/**
 * Obtiene el nivel de suscripción efectivo del usuario
 */
export function getUserTier(user: UserAccount | null): UserTier {
  if (!user) return 'free_trial';

  if (user.paymentStatus === 'active_paid') {
    if (user.plan === 'cat3') return 'cat3';
    if (user.plan === 'circulo') return 'circulo';
    if (user.plan === 'cat2') return 'cat2';
    if (user.plan === 'cat1') return 'cat1';
    return 'circulo';
  }

  if (user.paymentStatus === 'trial_expired') {
    return 'expired';
  }

  // Si está en mes gratis (in_trial), solo tiene acceso a lo básico:
  return 'free_trial';
}

export function getTierLevelNumber(tier: UserTier): number {
  switch (tier) {
    case 'free_trial': return 0;
    case 'cat1': return 1;
    case 'cat2': return 2;
    case 'circulo': return 3;
    case 'cat3': return 4;
    case 'expired': return -1;
  }
}

export interface AccessCheckResult {
  allowed: boolean;
  minRequiredTier: UserTier;
  minPlanId: PlanCategory;
  minPriceStr: string;
  featureName: string;
  reason: string;
  targetYear?: number;
}

/**
 * Obtiene la lista de años desbloqueados por anualidad para el usuario.
 * El año 2027 siempre está incluido como año base.
 */
export function getUnlockedYears(user: UserAccount | null): number[] {
  if (user && user.unlockedYears && user.unlockedYears.length > 0) {
    return Array.from(new Set([2027, ...user.unlockedYears]));
  }
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
}

/**
 * Verifica si el usuario puede acceder a un día específico (1 a 31)
 * Mes gratis: días 1 a 3
 * Categoría 1 ($2.25+): días 1 a 31
 */
export function checkDayAccess(user: UserAccount | null, dayNum: number): AccessCheckResult {
  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);

  // Días 1, 2 y 3 siempre accesibles en el mes gratis
  if (dayNum <= 3) {
    return {
      allowed: true,
      minRequiredTier: 'free_trial',
      minPlanId: 'cat1',
      minPriceStr: '$2.25',
      featureName: `Día ${dayNum}`,
      reason: 'Incluido en el Mes Gratis'
    };
  }

  // Días 4 al 31 requieren Categoría 1 ($2.25/mes) o superior
  const allowed = tierNum >= 1;
  return {
    allowed,
    minRequiredTier: 'cat1',
    minPlanId: 'cat1',
    minPriceStr: '$2.25 / mes',
    featureName: `Día ${dayNum} del Almanaque`,
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'En el mes gratis tienes acceso a los Días 1, 2 y 3. Para acceder a los 31 días completos de sabiduría y mantras profundos, suscríbete desde Categoría 1 ($2.25/mes).'
  };
}

/**
 * Verifica el acceso a un año específico (2027 a 3037).
 * Restricción en la Categoría 3 (Paquete Prémium) por anualidad:
 * - Año 2027: Pago/acceso incluido de base.
 * - Año 2028: Se muestra recién cuando se paga la anualidad 2028.
 * - Años 2029 al 3037: Cada año se desbloquea al pagar su anualidad individual.
 */
export function checkYearAccess(
  user: UserAccount | null, 
  year: number,
  customUnlockedYears?: number[]
): AccessCheckResult {
  const unlocked = customUnlockedYears || getUnlockedYears(user);

  // Si el año es 2027 o ya fue pagado/desbloqueado por anualidad:
  if (year === 2027 || unlocked.includes(year)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$25.00 / año',
      featureName: `Año ${year} Habilitado`,
      reason: `Anualidad del Año ${year} activa y desbloqueada.`,
      targetYear: year
    };
  }

  // Si el año aún no ha sido pagado (2028 a 3037):
  return {
    allowed: false,
    minRequiredTier: 'cat3',
    minPlanId: 'cat3',
    minPriceStr: '$25.00 / anualidad',
    featureName: `Anualidad del Año ${year} (Categoría 3 Prémium)`,
    reason: `En la Categoría 3 (Paquete Prémium), el acceso se restringe por anualidad: tienes activo el Año 2027. Para ver y navegar el Año ${year}, debes abonar la anualidad correspondiente a ese año ($25.00), habilitando sus 12 meses completos, efemérides y galería. Cada año sucesivo hasta el 3037 se adquiere por anualidad.`,
    targetYear: year
  };
}

/**
 * Frecuencias 432 Hz continuas y cuencos tibetanos
 * Requiere Categoría 2 ($4.99/mes) o superior
 */
export function checkAudio432Access(user: UserAccount | null): AccessCheckResult {
  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);
  const allowed = tierNum >= 2;

  return {
    allowed,
    minRequiredTier: 'cat2',
    minPlanId: 'cat2',
    minPriceStr: '$4.99 / mes',
    featureName: 'Frecuencias Continuas 432 Hz & Cuencos Tibetanos',
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'El reproductor continuo de frecuencias 432 Hz para meditación profunda está disponible a partir de Categoría 2 ($4.99/mes). En tu mes gratis puedes escuchar la campana zen de muestra.'
  };
}

/**
 * Diario Íntimo de sanación y autoobservación
 * Requiere estrictamente:
 * 1. Usuario autenticado (haber iniciado sesión con su cuenta).
 * 2. Suscripción activa y paga (paymentStatus === 'active_paid') de Categoría 2 ($4.99/mes) o superior.
 */
export function checkJournalAccess(user: UserAccount | null): AccessCheckResult {
  // 1. Control de inicio de sesión
  if (!user) {
    return {
      allowed: false,
      minRequiredTier: 'cat2',
      minPlanId: 'cat2',
      minPriceStr: '$4.99 / mes',
      featureName: 'Diario Íntimo de Sanación & Desahogo',
      reason: 'Debes iniciar sesión con tu cuenta registrada para acceder a tu diario personal.'
    };
  }

  // 2. Control de pago activo
  if (user.paymentStatus !== 'active_paid') {
    return {
      allowed: false,
      minRequiredTier: 'cat2',
      minPlanId: 'cat2',
      minPriceStr: '$4.99 / mes',
      featureName: 'Diario Íntimo de Sanación & Desahogo',
      reason: 'El Diario Íntimo requiere una suscripción activa paga (Categoría 2, Círculo de Paz o Categoría 3).'
    };
  }

  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);
  const allowed = tierNum >= 2;

  return {
    allowed,
    minRequiredTier: 'cat2',
    minPlanId: 'cat2',
    minPriceStr: '$4.99 / mes',
    featureName: 'Diario Íntimo de Sanación & Desahogo',
    reason: allowed
      ? 'Desbloqueado con tu suscripción activa'
      : 'El Diario Íntimo con notas de gratitud, desahogo privado y autoobservación se desbloquea a partir de Categoría 2 ($4.99/mes).'
  };
}

/**
 * Control estricto de Descargas de material digital y exportación de diarios.
 * Requiere obligatoriamente:
 * 1. Usuario autenticado con sesión iniciada.
 * 2. Pago activo confirmado (paymentStatus === 'active_paid').
 */
export function checkDownloadAccess(user: UserAccount | null, featureTitle = 'Material Digital'): AccessCheckResult {
  if (!user) {
    return {
      allowed: false,
      minRequiredTier: 'cat1',
      minPlanId: 'cat1',
      minPriceStr: '$2.25 / mes',
      featureName: `Descarga de ${featureTitle}`,
      reason: 'Debes iniciar sesión con tu cuenta para realizar descargas de material seguro.'
    };
  }

  if (user.paymentStatus !== 'active_paid') {
    return {
      allowed: false,
      minRequiredTier: 'cat1',
      minPlanId: 'cat1',
      minPriceStr: '$2.25 / mes',
      featureName: `Descarga de ${featureTitle}`,
      reason: 'Las descargas de contenido y reflexiones están reservadas exclusivamente para usuarios con membresía activa paga.'
    };
  }

  return {
    allowed: true,
    minRequiredTier: 'cat1',
    minPlanId: 'cat1',
    minPriceStr: '$2.25 / mes',
    featureName: `Descarga de ${featureTitle}`,
    reason: 'Descarga autorizada y verificada para usuario activo.'
  };
}

/**
 * Ejercicios de respiración Pranayama
 * Requiere Categoría 2 ($4.99/mes) o superior
 */
export function checkBreathingAccess(user: UserAccount | null): AccessCheckResult {
  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);
  const allowed = tierNum >= 2;

  return {
    allowed,
    minRequiredTier: 'cat2',
    minPlanId: 'cat2',
    minPriceStr: '$4.99 / mes',
    featureName: 'Respiración Consciente Guiada (Pranayama)',
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'Los ejercicios guiados de respiración consciente con sincronizador visual están disponibles a partir de Categoría 2 ($4.99/mes).'
  };
}

/**
 * Oráculo de Cartas de Luz
 * Requiere Círculo de Paz ($9.99/mes) o Categoría 3 ($25.00/mes)
 */
export function checkOracleAccess(user: UserAccount | null): AccessCheckResult {
  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);
  const allowed = tierNum >= 3;

  return {
    allowed,
    minRequiredTier: 'circulo',
    minPlanId: 'circulo',
    minPriceStr: '$9.99 / mes',
    featureName: 'Oráculo Sagrado de Cartas de Luz',
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'El Oráculo sagrado con cartas de luz y mensajes de sabiduría diarios es un beneficio exclusivo del Círculo de Paz ($9.99/mes) y Categoría 3 ($25.00/mes).'
  };
}

/**
 * Subida de fotos personalizadas (portada y 12 meses)
 * Beneficio exclusivo y reservado SOLO para Categoría 3 ($25.00 / anualidad)
 */
export function checkPhotoUploadAccess(user: UserAccount | null): AccessCheckResult {
  const tier = getUserTier(user);
  // La personalización de fotos es SOLO para la Categoría 3
  const allowed = tier === 'cat3';

  return {
    allowed,
    minRequiredTier: 'cat3',
    minPlanId: 'cat3',
    minPriceStr: '$25.00 / anualidad',
    featureName: 'Personalización de Fotos (Portada y 12 Meses)',
    reason: allowed
      ? 'Desbloqueado con tu suscripción a Categoría 3 (Paquete Prémium)'
      : 'La personalización y sincronización de tu propio álbum fotográfico mensual y foto de portada es un beneficio exclusivo de Categoría 3 ($25.00/anualidad).'
  };
}

/**
 * Publicador en Blogger, Instagram, Facebook y YouTube
 * Requiere Círculo de Paz ($9.99/mes) o Categoría 3 ($25.00/mes)
 */
export function checkSocialPublisherAccess(user: UserAccount | null): AccessCheckResult {
  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);
  const allowed = tierNum >= 3;

  return {
    allowed,
    minRequiredTier: 'circulo',
    minPlanId: 'circulo',
    minPriceStr: '$9.99 / mes',
    featureName: 'Publicador para Blogger & Redes Sociales',
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'El generador de entradas para Blogger y plantillas para historias de Instagram es un beneficio del Círculo de Paz ($9.99/mes) y Categoría 3 ($25.00/mes).'
  };
}
