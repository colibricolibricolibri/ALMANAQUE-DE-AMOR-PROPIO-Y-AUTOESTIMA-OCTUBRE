import itemsData from './supportProjectItems.json';

export interface SupportProjectImage {
  directUrl: string;
  originalUrl: string;
}

export interface SupportProjectItem {
  id?: string;
  number: number;
  title: string;
  price: number;
  links: string[];
  images: SupportProjectImage[];
  subtitle?: string;
}

export const SUPPORT_CATEGORY_INFO = {
  id: 'apoyo' as const,
  name: 'Apoya este proyecto por solo $1.25',
  shortName: 'Apoya este proyecto',
  priceUSD: 1.25,
  description:
    'Si este material te ha ayudado y deseas colaborar, esta categoría es para ti. Llévate los mantras potenciados con imágenes como ojos de amor con paisajes reales, que actúan como anclas visuales para profundizar tu práctica.',
  tagline: 'Mantras potenciados con imágenes como ojos de amor con paisajes reales',
  badge: 'Colaboración · $1.25',
  badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  individualItemsCount: 39
};

export const SUPPORT_PROJECT_ITEMS: SupportProjectItem[] = itemsData as SupportProjectItem[];
