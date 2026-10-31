export interface WeatherInfo {
  temp: number;
  weatherCode: number;
  icon: string;
  description: string;
  isNight?: boolean;
}

// Mapa de códigos meteorológicos WMO de Open-Meteo a iconos y descripciones en español
export const getWeatherDetails = (code: number, isNight: boolean = false): { icon: string; description: string } => {
  switch (code) {
    case 0:
      return { icon: isNight ? '🌙' : '☀️', description: 'Cielo despejado' };
    case 1:
      return { icon: isNight ? '🌤️' : '🌤️', description: 'Mayormente despejado' };
    case 2:
      return { icon: '⛅', description: 'Parcialmente nublado' };
    case 3:
      return { icon: '☁️', description: 'Nublado' };
    case 45:
    case 48:
      return { icon: '🌫️', description: 'Niebla o neblina' };
    case 51:
    case 53:
    case 55:
      return { icon: '🌦️', description: 'Llovizna suave' };
    case 61:
    case 63:
      return { icon: '🌧️', description: 'Lluvia moderada' };
    case 65:
      return { icon: '🌧️', description: 'Lluvia intensa' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { icon: '❄️', description: 'Nieve' };
    case 80:
    case 81:
    case 82:
      return { icon: '🌧️', description: 'Chubascos' };
    case 85:
    case 86:
      return { icon: '🌨️', description: 'Chubascos de nieve' };
    case 95:
    case 96:
    case 99:
      return { icon: '⛈️', description: 'Tormenta eléctrica' };
    default:
      return { icon: isNight ? '🌙' : '🌤️', description: 'Clima sereno' };
  }
};

// Caché en memoria para evitar peticiones repetitivas
const weatherCache = new Map<string, { data: WeatherInfo; timestamp: number }>();
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutos

/**
 * Obtiene la temperatura y estado del clima actual en tiempo real para unas coordenadas
 * usando el servicio gratuito y libre de Open-Meteo.
 */
export async function fetchLiveWeather(
  latitude: number, 
  longitude: number,
  timeZone?: string
): Promise<WeatherInfo | null> {
  const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const now = Date.now();

  const cached = weatherCache.get(cacheKey);
  if (cached && (now - cached.timestamp < CACHE_DURATION_MS)) {
    return cached.data;
  }

  try {
    const tzParam = timeZone ? `&timezone=${encodeURIComponent(timeZone)}` : '&timezone=auto';
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day${tzParam}`
    );

    if (!response.ok) {
      throw new Error(`Weather fetch status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.current) {
      const rawTemp = data.current.temperature_2m;
      const weatherCode = data.current.weather_code ?? 0;
      const isDay = data.current.is_day !== undefined ? data.current.is_day === 1 : true;
      const details = getWeatherDetails(weatherCode, !isDay);

      const info: WeatherInfo = {
        temp: Math.round(rawTemp),
        weatherCode,
        icon: details.icon,
        description: details.description,
        isNight: !isDay
      };

      weatherCache.set(cacheKey, { data: info, timestamp: now });
      return info;
    }
  } catch (error) {
    console.warn('No se pudo obtener el clima en vivo de Open-Meteo:', error);
  }

  return null;
}

/**
 * Convierte un código de país de 2 letras en su emoji de bandera (ej. AR -> 🇦🇷)
 */
export function getCountryFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const code = countryCode.toUpperCase();
  const first = code.charCodeAt(0) + 127397;
  const second = code.charCodeAt(1) + 127397;
  return String.fromCodePoint(first, second);
}

export interface GeocodedCityResult {
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

/**
 * Busca ciudades o regiones en todo el mundo usando Open-Meteo Geocoding
 */
export async function searchOpenMeteoCities(query: string): Promise<GeocodedCityResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=es&format=json`
    );
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      name: item.name,
      country: item.country || item.country_code,
      countryCode: item.country_code || '',
      flag: getCountryFlagEmoji(item.country_code || ''),
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'UTC'
    }));
  } catch (err) {
    console.warn('Error en búsqueda de ciudades:', err);
    return [];
  }
}
