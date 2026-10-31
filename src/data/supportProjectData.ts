import groupedData from './supportProjectGrouped.json';

export interface SupportProjectImage {
  directUrl: string;
  originalUrl?: string;
  label?: string;
}

export interface SupportProjectItem {
  id?: string;
  number: number;
  originalNumber?: number;
  title: string;
  price: number;
  links: string[];
  images: SupportProjectImage[];
  subtitle?: string;
  unlockNotice?: string;
  isMonth?: boolean;
  monthIndex?: number;
  groupedPhrases?: number[];
  groupedTitles?: string[];
}

export const SUPPORT_CATEGORY_INFO = {
  id: 'apoyo' as const,
  name: 'Apoya este proyecto por solo $1.25',
  shortName: 'Apoya este proyecto',
  priceUSD: 1.25,
  description:
    'Colabora con el proyecto y desbloquea el calendario del mes seleccionado (solo ese mes) o accede a las frases y mantras potenciados con imágenes como ojos de amor con paisajes reales, que actúan como anclas visuales.',
  tagline: 'Mantras potenciados con imágenes como ojos de amor con paisajes reales',
  badge: 'Colaboración · $1.25',
  badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  monthsCount: 12,
  looseItemsCount: 8,
  totalItemsCount: 20
};

export const SUPPORT_PROJECT_MONTHS: SupportProjectItem[] = groupedData.months as SupportProjectItem[];
export const SUPPORT_PROJECT_LOOSE_ITEMS: SupportProjectItem[] = groupedData.loose as SupportProjectItem[];
export const SUPPORT_PROJECT_ITEMS: SupportProjectItem[] = groupedData.allItems as SupportProjectItem[];
