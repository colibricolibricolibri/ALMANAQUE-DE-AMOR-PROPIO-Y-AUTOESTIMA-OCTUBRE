export interface DayContent {
  day: number;
  month: string;
  title: string;
  subtitle?: string;
  content: string[];
  mantra: string;
  mantraDescription: string;
  image: string;
}

export enum ViewMode {
  INTRO = 'INTRO',
  CALENDAR = 'CALENDAR',
  DAY_DETAIL = 'DAY_DETAIL',
  GALLERY = 'GALLERY',
  SUPPORT = 'SUPPORT',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE'
}

export type Language = 'es' | 'en' | 'pt' | 'it' | 'fr';

export interface CountryTimezone {
  code: string;
  name: string;
  flag: string;
  timeZone: string;
  offset: string;
  city: string;
  latitude?: number;
  longitude?: number;
  temperature?: number;
  weatherIcon?: string;
}

export interface JournalEntry {
  day: number;
  date: string;
  reflection: string;
  gratitude: string;
  shadowNote?: string;
}

export type PlanCategory = 'cat1' | 'cat2' | 'circulo' | 'cat3';

export interface PaymentRecord {
  id: string;
  planId: PlanCategory | 'apoyo' | 'tiktok' | 'youtube' | 'video_individual' | 'instagram' | 'facebook' | 'blogger';
  planName: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: 'card' | 'mercadopago' | 'paypal' | 'transfer';
  gateway?: 'mercadopago_checkout_pro' | 'paypal_checkout' | 'card_hosted' | 'bank_transfer';
  installments?: number;
  localCurrencyAmount?: number;
  localCurrency?: string;
  cardLast4?: string;
  status: 'completed' | 'pending' | 'refunded';
  invoiceUrl?: string;
  targetYear?: number;
  targetMonth?: number | null;
  preferenceId?: string;
  orderId?: string;
  billingFrequency?: 'monthly' | 'annual';
  termsAcceptedAt?: string;
  downloadAuditId?: string;
  downloadedAt?: string;
  clientIp?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: PlanCategory;
  trialStartDate: string;
  trialEndDate: string;
  paymentStatus: 'in_trial' | 'trial_expired' | 'active_paid' | 'cancelled';
  paymentHistory: PaymentRecord[];
  unlockedYears?: number[];
  unlockedMonths?: number[];
}

