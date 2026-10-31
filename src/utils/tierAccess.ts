import { UserAccount, PlanCategory } from '../../types';

/**
 * ============================================================================
 * 👑 LISTA DE 30 CORREOS INVITADOS Y ADMINISTRADOR (ACCESO TOTAL SIN PAGO)
 * ============================================================================
 * 📍 LÍNEA EXACTA PARA MODIFICAR: Líneas 14 a 22 (dentro de correosInvitados).
 * Para añadir un nuevo usuario con acceso total gratuito sin pasar por la pasarela de pago:
 * Escribe o pega su correo entre comillas simples 'correo@gmail.com' seguido de una coma.
 * Tienes espacio para 30 correos o más.
 * ============================================================================
 */
export const correosInvitados: string[] = [
  'colibricolibricolibri75@gmail.com', // 👑 Correo de Administrador (Acceso Completo Ilimitado)
  'ejemplo1@gmail.com',                // Ejemplo 1 (fácil de borrar o reemplazar)
  'ejemplo2@gmail.com',                // Ejemplo 2 (fácil de borrar o reemplazar)
  // 'invitado3@gmail.com',
  // 'invitado4@gmail.com',
  // 'invitado5@gmail.com',
  // 'invitado6@gmail.com',
  // 'invitado7@gmail.com',
  // 'invitado8@gmail.com',
  // 'invitado9@gmail.com',
  // 'invitado10@gmail.com',
  // 'invitado11@gmail.com',
  // 'invitado12@gmail.com',
  // 'invitado13@gmail.com',
  // 'invitado14@gmail.com',
  // 'invitado15@gmail.com',
  // 'invitado16@gmail.com',
  // 'invitado17@gmail.com',
  // 'invitado18@gmail.com',
  // 'invitado19@gmail.com',
  // 'invitado20@gmail.com',
  // 'invitado21@gmail.com',
  // 'invitado22@gmail.com',
  // 'invitado23@gmail.com',
  // 'invitado24@gmail.com',
  // 'invitado25@gmail.com',
  // 'invitado26@gmail.com',
  // 'invitado27@gmail.com',
  // 'invitado28@gmail.com',
  // 'invitado29@gmail.com',
  // 'invitado30@gmail.com'
];

// Alias para compatibilidad
export const CORREOS_INVITADOS = correosInvitados;

/**
 * Revisa si el correo del usuario está en la lista de correosInvitados
 */
export function isUserAuthorizedGuest(user: UserAccount | null | string): boolean {
  if (!user) return false;
  const email = typeof user === 'string' ? user : user.email;
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return correosInvitados.some(authorized => authorized.trim().toLowerCase() === cleanEmail);
}

// Alias para verificar directamente por dirección de correo
export const isEmailAuthorizedGuest = isUserAuthorizedGuest;

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
      'Lectura completa del mes de prueba (1 de 31 días según el mes en que inicies)',
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

  // 👑 Excepción total para Administrador e Invitados autorizados:
  if (isUserAuthorizedGuest(user)) {
    return 'cat3'; // Máximo nivel prémium con todas las funciones desbloqueadas
  }

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
  // 👑 Administrador e Invitados tienen todos los años desbloqueados (2027 a 3037)
  if (isUserAuthorizedGuest(user)) {
    return Array.from({ length: 1011 }, (_, i) => 2027 + i);
  }

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

export const MONTH_NAMES_SPANISH = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Obtiene la lista de meses desbloqueados individualmente por el usuario (0 a 11)
 * a través de la colaboración "Apoya este proyecto" ($1.25 USD).
 */
export function getUnlockedMonths(user: UserAccount | null): number[] {
  // 👑 Administrador e Invitados tienen los 12 meses desbloqueados de forma ilimitada
  if (isUserAuthorizedGuest(user)) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }

  const months: number[] = [];
  if (user?.unlockedMonths && Array.isArray(user.unlockedMonths)) {
    months.push(...user.unlockedMonths);
  }
  if (user?.paymentHistory) {
    user.paymentHistory.forEach(p => {
      if (p.status === 'completed' && p.targetMonth !== undefined && p.targetMonth !== null) {
        months.push(Number(p.targetMonth));
      }
    });
  }
  try {
    const saved = localStorage.getItem('zen_unlocked_months');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        months.push(...parsed.map(Number));
      }
    }
  } catch {}
  return Array.from(new Set(months));
}

/**
 * Guarda en almacenamiento local un mes desbloqueado (0 a 11)
 */
export function unlockMonthLocally(monthIdx: number): number[] {
  const current = getUnlockedMonths(null);
  const updated = Array.from(new Set([...current, monthIdx]));
  try {
    localStorage.setItem('zen_unlocked_months', JSON.stringify(updated));
  } catch {}
  return updated;
}

/**
 * Verifica si el usuario puede acceder a un día específico (1 a 31)
 * - Invitado Autorizado / Administrador: Acceso total a todos los días de todos los meses
 * - Mes gratis: días 1 a 3
 * - Mes desbloqueado individualmente ($1.25): días 1 a 31 de ese mes
 * - Categoría 1 ($2.25+): días 1 a 31 de todos los meses
 */
export function checkDayAccess(
  user: UserAccount | null, 
  dayNum: number, 
  monthIdx?: number, 
  customUnlockedMonths?: number[]
): AccessCheckResult {
  // 👑 1. Excepción Total para Administrador e Invitados Autorizados (Sin Pasarela de Pago)
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: `Día ${dayNum}`,
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
    };
  }

  const tier = getUserTier(user);
  const tierNum = getTierLevelNumber(tier);

  // Días totales del mes en consulta (31, 28/29, 30 días según el mes)
  const MONTH_MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDaysInThisMonth = monthIdx !== undefined ? (MONTH_MAX_DAYS[monthIdx] || 31) : 31;
  const targetMonthName = monthIdx !== undefined ? (MONTH_NAMES_SPANISH[monthIdx] || `Mes ${monthIdx + 1}`) : 'Enero';

  // Si el usuario está en su período de prueba gratuito activo (30-31 días):
  // Tiene acceso completo de 1 a 31 días (según los días del mes en que inicie la prueba)
  const isTrialActive = !user || user.paymentStatus === 'in_trial' || user.paymentStatus === 'active_paid';
  if (isTrialActive && dayNum <= maxDaysInThisMonth) {
    return {
      allowed: true,
      minRequiredTier: 'free_trial',
      minPlanId: 'cat1',
      minPriceStr: '$0.00',
      featureName: `Día ${dayNum} de ${maxDaysInThisMonth} días`,
      reason: `Incluido en tu Mes Gratis (${dayNum} de ${maxDaysInThisMonth} días según el mes).`
    };
  }

  // Si el mes específico fue desbloqueado con la colaboración de $1.25 ("Apoya este proyecto"):
  if (monthIdx !== undefined) {
    const unlocked = customUnlockedMonths || getUnlockedMonths(user);
    if (unlocked.includes(monthIdx)) {
      return {
        allowed: true,
        minRequiredTier: 'free_trial',
        minPlanId: 'cat1',
        minPriceStr: '$1.25',
        featureName: `Día ${dayNum} (${targetMonthName})`,
        reason: `Mes de ${targetMonthName} desbloqueado exitosamente con tu colaboración de $1.25.`
      };
    }
  }

  // Si la prueba concluyó (expired) y requiere suscripción
  const allowed = tierNum >= 1;
  return {
    allowed,
    minRequiredTier: 'cat1',
    minPlanId: 'cat1',
    minPriceStr: '$2.25 / mes',
    featureName: `Día ${dayNum} de ${maxDaysInThisMonth} días`,
    reason: allowed
      ? 'Desbloqueado con tu suscripción activa'
      : `Tu prueba concluyó. Para acceder a los ${maxDaysInThisMonth} días completos de ${targetMonthName}, suscríbete desde Categoría 1 ($2.25/mes) o desbloquea este mes por $1.25 en "Apoya este proyecto".`
  };
}

/**
 * Cronograma oficial de desbloqueo de calendarios anuales:
 * - Para años 2028 en adelante, el desbloqueo y la bajada se produce en el mes de OCTUBRE del año previo (Y - 1).
 *   Ejemplos:
 *   - Año 2028: se desbloquea a partir de Octubre de 2027.
 *   - Año 2029: se desbloquea a partir de Octubre de 2028.
 *   - Año 2030: se desbloquea a partir de Octubre de 2029.
 *   - Año 2027: año base incluido.
 */
export function isYearUnlockedByReleaseSchedule(year: number, simulatedDate?: Date): { 
  isUnlocked: boolean; 
  unlockMonthName: string; 
  unlockYear: number; 
  unlockDateStr: string;
  targetUnlockDate: Date;
} {
  if (year <= 2027) {
    return { 
      isUnlocked: true, 
      unlockMonthName: 'Inmediato', 
      unlockYear: 2027, 
      unlockDateStr: 'Disponible',
      targetUnlockDate: new Date('2027-01-01T00:00:00')
    };
  }
  const unlockYear = year - 1;
  const targetUnlockDate = new Date(unlockYear, 9, 1, 0, 0, 0); // 1 de Octubre de (year - 1)
  const now = simulatedDate || new Date();
  const isUnlocked = now >= targetUnlockDate;
  return {
    isUnlocked,
    unlockMonthName: 'Octubre',
    unlockYear,
    unlockDateStr: `Octubre de ${unlockYear}`,
    targetUnlockDate
  };
}

/**
 * Verifica el acceso a un año específico (2027 a 3037).
 * - Años 2028 en adelante: el desbloqueo y bajada se produce en Octubre del año previo.
 * - Año 2027: Año base incluido.
 */
export function checkYearAccess(
  user: UserAccount | null, 
  year: number,
  customUnlockedYears?: number[],
  simulatedDate?: Date
): AccessCheckResult {
  // 👑 1. Excepción total para Administrador e Invitados Autorizados
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: `Año ${year} Habilitado (Acceso Maestro)`,
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.',
      targetYear: year
    };
  }

  // 2. Control de Lanzamiento Programado (para 2028 en adelante se habilita en Octubre del año previo)
  if (year >= 2028) {
    const release = isYearUnlockedByReleaseSchedule(year, simulatedDate);
    if (!release.isUnlocked) {
      return {
        allowed: false,
        minRequiredTier: 'cat3',
        minPlanId: 'cat3',
        minPriceStr: `Lanzamiento ${release.unlockDateStr}`,
        featureName: `Calendario del Año ${year}`,
        reason: `La bajada y uso del calendario del año ${year} estará disponible a partir de ${release.unlockDateStr}. Cada nuevo calendario se desbloquea en el mes de octubre del año en curso.`,
        targetYear: year
      };
    }
  }

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
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: 'Frecuencias Continuas 432 Hz & Cuencos Tibetanos',
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
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
    featureName: 'Frecuencias Continuas 432 Hz & Cuencos Tibetanos',
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'El reproductor continuo de frecuencias 432 Hz para meditación profunda está disponible a partir de Categoría 2 ($4.99/mes). En tu mes gratis puedes escuchar la campana zen de muestra.'
  };
}

/**
 * Diario Íntimo de sanación y autoobservación
 */
export function checkJournalAccess(user: UserAccount | null): AccessCheckResult {
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: 'Diario Íntimo de Sanación & Desahogo',
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
    };
  }

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
 * Control de Descargas de material digital y exportación de diarios.
 */
export function checkDownloadAccess(user: UserAccount | null, featureTitle = 'Material Digital'): AccessCheckResult {
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: `Descarga de ${featureTitle}`,
      reason: 'Descarga libre autorizada para Administrador / Invitado VIP.'
    };
  }

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
 */
export function checkBreathingAccess(user: UserAccount | null): AccessCheckResult {
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: 'Respiración Consciente Guiada (Pranayama)',
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
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
    featureName: 'Respiración Consciente Guiada (Pranayama)',
    reason: allowed
      ? 'Desbloqueado con tu suscripción'
      : 'Los ejercicios guiados de respiración consciente con sincronizador visual están disponibles a partir de Categoría 2 ($4.99/mes).'
  };
}

/**
 * Oráculo de Cartas de Luz
 */
export function checkOracleAccess(user: UserAccount | null): AccessCheckResult {
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: 'Oráculo Sagrado de Cartas de Luz',
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
    };
  }

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
 */
export function checkPhotoUploadAccess(user: UserAccount | null): AccessCheckResult {
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: 'Personalización de Fotos (Portada y 12 Meses)',
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
    };
  }

  const tier = getUserTier(user);
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
 */
export function checkSocialPublisherAccess(user: UserAccount | null): AccessCheckResult {
  if (isUserAuthorizedGuest(user)) {
    return {
      allowed: true,
      minRequiredTier: 'cat3',
      minPlanId: 'cat3',
      minPriceStr: '$0.00',
      featureName: 'Publicador para Blogger & Redes Sociales',
      reason: 'Acceso total de Administrador / Invitado VIP autorizado.'
    };
  }

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

/**
 * 🌸 Logo Oficial Emblema con Girasoles y Colibríes (https://ibb.co/p6s2WmNn)
 */
export const OFFICIAL_ALMANAQUE_LOGO = "https://i.ibb.co/ymM0h3KV/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-2.png";

/**
 * ============================================================================
 * 🎁 CAMPAÑA DE 100 USUARIOS GRATUITOS (INICIO DICIEMBRE 2026)
 * ============================================================================
 * - El conteo está liberado en 0 (0 cupos tomados, 100 cupos disponibles).
 * - Recién a partir de Diciembre de 2026 se cuenta cada nuevo usuario registrado.
 * - Solo los primeros 100 usuarios visualizan gratis 30 días continuos.
 * - Una vez cubiertos los 100 cupos, el resto debe pagar su suscripción.
 * ============================================================================
 */
export const DECEMBER_2026_PROMO_START = new Date('2026-12-01T00:00:00');
export const MAX_FREE_PROMO_USERS = 100;

export function resetPromoSpotsToZero(): void {
  try {
    localStorage.setItem('zen_claimed_spots_first100', '0');
  } catch {}
}

export function getClaimedPromoSpots(simulatedDate?: Date): number {
  const now = simulatedDate || new Date();
  if (now < DECEMBER_2026_PROMO_START) {
    return 0;
  }
  try {
    const saved = localStorage.getItem('zen_claimed_spots_first100');
    if (saved !== null && saved !== '76') {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        return Math.min(MAX_FREE_PROMO_USERS, parsed);
      }
    }
  } catch {}
  return 0;
}

export function checkFreePromoSpotAvailable(userEmail?: string, simulatedDate?: Date): {
  isAvailable: boolean;
  claimedSpots: number;
  spotsLeft: number;
  promoStarted: boolean;
  message: string;
} {
  const now = simulatedDate || new Date();
  const promoStarted = now >= DECEMBER_2026_PROMO_START;

  if (userEmail && isEmailAuthorizedGuest(userEmail)) {
    return {
      isAvailable: true,
      claimedSpots: getClaimedPromoSpots(now),
      spotsLeft: MAX_FREE_PROMO_USERS,
      promoStarted,
      message: 'Acceso Maestro VIP / Administrador.'
    };
  }

  const claimed = getClaimedPromoSpots(now);
  const spotsLeft = Math.max(0, MAX_FREE_PROMO_USERS - claimed);

  if (!promoStarted) {
    return {
      isAvailable: true,
      claimedSpots: 0,
      spotsLeft: MAX_FREE_PROMO_USERS,
      promoStarted: false,
      message: 'Campaña de 100 cupos liberada a 0. Conteo oficial inicia en Diciembre de 2026.'
    };
  }

  const isAvailable = spotsLeft > 0;
  return {
    isAvailable,
    claimedSpots: claimed,
    spotsLeft,
    promoStarted: true,
    message: isAvailable
      ? `¡Quedan ${spotsLeft} de 100 cupos con 30 días gratis!`
      : 'Se han completado los 100 cupos gratuitos de Diciembre 2026. Para acceder, activa tu membresía en la pasarela de pagos.'
  };
}

export function claimPromoSpotIfAvailable(userEmail?: string, simulatedDate?: Date): boolean {
  if (userEmail && isEmailAuthorizedGuest(userEmail)) return true;
  const now = simulatedDate || new Date();
  if (now < DECEMBER_2026_PROMO_START) {
    resetPromoSpotsToZero();
    return true;
  }
  const current = getClaimedPromoSpots(now);
  if (current >= MAX_FREE_PROMO_USERS) {
    return false;
  }
  const next = current + 1;
  try {
    localStorage.setItem('zen_claimed_spots_first100', String(next));
  } catch {}
  return true;
}
