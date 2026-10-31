import { CountryTimezone } from '../../types';

export const COUNTRIES_TIMEZONES: CountryTimezone[] = [
  {
    code: 'AR',
    name: 'El Calafate',
    flag: '🇦🇷',
    timeZone: 'America/Argentina/Buenos_Aires',
    offset: 'GMT-3',
    city: 'El Calafate',
    latitude: -50.3378,
    longitude: -72.2648
  },
  {
    code: 'AR',
    name: 'Buenos Aires',
    flag: '🇦🇷',
    timeZone: 'America/Argentina/Buenos_Aires',
    offset: 'GMT-3',
    city: 'Buenos Aires',
    latitude: -34.6037,
    longitude: -58.3816
  },
  {
    code: 'AR',
    name: 'Bariloche',
    flag: '🇦🇷',
    timeZone: 'America/Argentina/Buenos_Aires',
    offset: 'GMT-3',
    city: 'San Carlos de Bariloche',
    latitude: -41.1335,
    longitude: -71.3103
  },
  {
    code: 'AR',
    name: 'Ushuaia',
    flag: '🇦🇷',
    timeZone: 'America/Argentina/Buenos_Aires',
    offset: 'GMT-3',
    city: 'Ushuaia (Tierra del Fuego)',
    latitude: -54.8019,
    longitude: -68.3030
  },
  {
    code: 'AR',
    name: 'Córdoba',
    flag: '🇦🇷',
    timeZone: 'America/Argentina/Cordoba',
    offset: 'GMT-3',
    city: 'Córdoba Capital',
    latitude: -31.4201,
    longitude: -64.1888
  },
  {
    code: 'UY',
    name: 'Uruguay',
    flag: '🇺🇾',
    timeZone: 'America/Montevideo',
    offset: 'GMT-3',
    city: 'Montevideo',
    latitude: -34.9011,
    longitude: -56.1645
  },
  {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    timeZone: 'America/Santiago',
    offset: 'GMT-3',
    city: 'Santiago',
    latitude: -33.4489,
    longitude: -70.6693
  },
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    timeZone: 'America/Sao_Paulo',
    offset: 'GMT-3',
    city: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333
  },
  {
    code: 'PY',
    name: 'Paraguay',
    flag: '🇵🇾',
    timeZone: 'America/Asuncion',
    offset: 'GMT-3',
    city: 'Asunción',
    latitude: -25.2637,
    longitude: -57.5759
  },
  {
    code: 'BO',
    name: 'Bolivia',
    flag: '🇧🇴',
    timeZone: 'America/La_Paz',
    offset: 'GMT-4',
    city: 'La Paz',
    latitude: -16.5000,
    longitude: -68.1500
  },
  {
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    timeZone: 'America/Caracas',
    offset: 'GMT-4',
    city: 'Caracas',
    latitude: 10.4806,
    longitude: -66.9036
  },
  {
    code: 'PE',
    name: 'Perú',
    flag: '🇵🇪',
    timeZone: 'America/Lima',
    offset: 'GMT-5',
    city: 'Lima',
    latitude: -12.0464,
    longitude: -77.0428
  },
  {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    timeZone: 'America/Bogota',
    offset: 'GMT-5',
    city: 'Bogotá',
    latitude: 4.7110,
    longitude: -74.0721
  },
  {
    code: 'EC',
    name: 'Ecuador',
    flag: '🇪🇨',
    timeZone: 'America/Guayaquil',
    offset: 'GMT-5',
    city: 'Quito',
    latitude: -0.1807,
    longitude: -78.4678
  },
  {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    timeZone: 'America/Mexico_City',
    offset: 'GMT-6',
    city: 'Ciudad de México',
    latitude: 19.4326,
    longitude: -99.1332
  },
  {
    code: 'US',
    name: 'EE.UU. (Este)',
    flag: '🇺🇸',
    timeZone: 'America/New_York',
    offset: 'GMT-5',
    city: 'Miami / New York',
    latitude: 25.7617,
    longitude: -80.1918
  },
  {
    code: 'ES',
    name: 'España',
    flag: '🇪🇸',
    timeZone: 'Europe/Madrid',
    offset: 'GMT+1',
    city: 'Madrid / Barcelona',
    latitude: 40.4168,
    longitude: -3.7038
  },
  {
    code: 'IT',
    name: 'Italia',
    flag: '🇮🇹',
    timeZone: 'Europe/Rome',
    offset: 'GMT+1',
    city: 'Roma',
    latitude: 41.9028,
    longitude: 12.4964
  }
];

export const DEFAULT_COUNTRY = COUNTRIES_TIMEZONES[0]; // El Calafate, Argentina (GMT-3)

/**
 * Obtiene la hora y estado de tiempo en la zona horaria indicada
 */
export function getTimeInTimezone(timeZone: string, date: Date = new Date()) {
  try {
    const timeParts = new Intl.DateTimeFormat('es-AR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(date);

    let hour = '00';
    let minute = '00';
    let second = '00';

    for (const part of timeParts) {
      if (part.type === 'hour') hour = part.value;
      if (part.type === 'minute') minute = part.value;
      if (part.type === 'second') second = part.value;
    }

    const hourNum = parseInt(hour, 10);
    const isNight = hourNum >= 20 || hourNum < 6;

    let greeting = 'Buenos días';
    if (hourNum >= 12 && hourNum < 20) {
      greeting = 'Buenas tardes';
    } else if (isNight) {
      greeting = 'Buenas noches';
    }

    const dateFormatted = new Intl.DateTimeFormat('es-AR', {
      timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);

    // Capitalizar primera letra
    const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

    return {
      hours: hour,
      minutes: minute,
      seconds: second,
      timeString: `${hour}:${minute}`,
      timeWithSeconds: `${hour}:${minute}:${second}`,
      dateString: capitalizedDate,
      isNight,
      greeting,
      hourNum
    };
  } catch (err) {
    // Fallback en caso de error
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return {
      hours,
      minutes,
      seconds: '00',
      timeString: `${hours}:${minutes}`,
      timeWithSeconds: `${hours}:${minutes}:00`,
      dateString: 'Hoy',
      isNight: false,
      greeting: 'Paz en tu día',
      hourNum: 12
    };
  }
}
