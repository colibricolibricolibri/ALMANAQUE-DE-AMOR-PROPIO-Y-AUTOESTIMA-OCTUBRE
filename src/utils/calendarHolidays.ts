/**
 * Utilidades para cálculo de calendarios y feriados de Argentina
 * Válido para años 2027 hasta 3037
 * Incluye cálculo exacto de años bisiestos (ej: 2028, febrero con 29 días)
 * y feriados nacionales de Argentina según Ley 27.399 y calendario litúrgico de Pascua.
 */

export const MIN_YEAR = 2027;
export const MAX_YEAR = 3037;

/**
 * Determina si un año es bisiesto según el calendario gregoriano.
 * Un año es bisiesto si es divisible por 4, excepto si es fin de siglo no divisible por 400.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Retorna la cantidad de días de un mes para un año dado.
 * Maneja automáticamente los años bisiestos (Febrero tiene 29 días en 2028, 2032, etc.).
 * @param year Año (ej: 2027, 2028, etc.)
 * @param monthIdx Índice del mes (0 = Enero, 1 = Febrero, ..., 11 = Diciembre)
 */
export function getDaysInMonth(year: number, monthIdx: number): number {
  return new Date(year, monthIdx + 1, 0).getDate();
}

/**
 * Calcula la fecha del Domingo de Pascua para cualquier año gregoriano
 * utilizando el algoritmo clásico de Meeus/Butcher.
 */
export function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed (2 = Marzo, 3 = Abril)
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

/**
 * Agrega o resta días a una fecha determinada
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export interface YearHolidayData {
  holidays: Record<number, number[]>; // monthIdx -> array de días
  holidayNames: Record<string, string>; // "monthIdx-day" -> nombre del feriado
  isLeap: boolean;
  totalDays: number;
}

/**
 * Genera el diccionario completo de feriados de Argentina para cualquier año.
 * Aplica feriados inamovibles, carnaval, semana santa y traslados de ley.
 */
export function getArgentineHolidays(year: number): YearHolidayData {
  const isLeap = isLeapYear(year);
  const totalDays = isLeap ? 366 : 365;

  const holidays: Record<number, number[]> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [],
    6: [], 7: [], 8: [], 9: [], 10: [], 11: []
  };
  const holidayNames: Record<string, string> = {};

  const addHoliday = (month: number, day: number, name: string) => {
    if (month < 0 || month > 11) return;
    const maxDays = getDaysInMonth(year, month);
    if (day < 1 || day > maxDays) return;

    if (!holidays[month]) {
      holidays[month] = [];
    }
    if (!holidays[month].includes(day)) {
      holidays[month].push(day);
    }
    const key = `${month}-${day}`;
    if (holidayNames[key]) {
      holidayNames[key] = `${holidayNames[key]} / ${name}`;
    } else {
      holidayNames[key] = name;
    }
  };

  // 1. Feriados Inamovibles de Argentina
  addHoliday(0, 1, "Año Nuevo");
  addHoliday(2, 24, "Día Nacional de la Memoria por la Verdad y la Justicia");
  addHoliday(3, 2, "Día del Veterano y de los Caídos en la Guerra de Malvinas");
  addHoliday(4, 1, "Día del Trabajador");
  addHoliday(4, 25, "Día de la Revolución de Mayo");
  addHoliday(5, 20, "Paso a la Inmortalidad del Gral. Manuel Belgrano (Día de la Bandera)");
  addHoliday(6, 9, "Día de la Independencia");
  addHoliday(11, 8, "Inmaculada Concepción de María");
  addHoliday(11, 25, "Navidad");

  // 2. Feriados Móviles por Pascua (Carnaval y Semana Santa)
  const easter = getEasterSunday(year);
  const carnavalLunes = addDays(easter, -48);
  const carnavalMartes = addDays(easter, -47);
  const juevesSanto = addDays(easter, -3);
  const viernesSanto = addDays(easter, -2);

  addHoliday(carnavalLunes.getMonth(), carnavalLunes.getDate(), "Carnaval (Lunes de Carnaval)");
  addHoliday(carnavalMartes.getMonth(), carnavalMartes.getDate(), "Carnaval (Martes de Carnaval)");
  addHoliday(juevesSanto.getMonth(), juevesSanto.getDate(), "Jueves Santo (Día no laborable)");
  addHoliday(viernesSanto.getMonth(), viernesSanto.getDate(), "Viernes Santo");

  // 3. Feriados Trasladables de Argentina (Ley 27.399)
  // Regla legal: Martes o Miércoles -> Lunes anterior. Jueves o Viernes -> Lunes siguiente.
  const applyTransferredHoliday = (baseMonth: number, baseDay: number, name: string) => {
    const baseDate = new Date(year, baseMonth, baseDay);
    const dayOfWeek = baseDate.getDay(); // 0 = Dom, 1 = Lun, 2 = Mar, 3 = Mie, 4 = Jue, 5 = Vie, 6 = Sab
    
    // Siempre registramos el día de conmemoración oficial
    addHoliday(baseMonth, baseDay, name);

    let shiftedDate: Date | null = null;
    if (dayOfWeek === 2) {
      // Martes -> lunes anterior (-1 día)
      shiftedDate = addDays(baseDate, -1);
    } else if (dayOfWeek === 3) {
      // Miércoles -> lunes anterior (-2 días)
      shiftedDate = addDays(baseDate, -2);
    } else if (dayOfWeek === 4) {
      // Jueves -> lunes siguiente (+4 días)
      shiftedDate = addDays(baseDate, 4);
    } else if (dayOfWeek === 5) {
      // Viernes -> lunes siguiente (+3 días)
      shiftedDate = addDays(baseDate, 3);
    } else if (dayOfWeek === 6) {
      // Sábado -> habitualmente feriado puente turístico o lunes posterior (+2 días)
      shiftedDate = addDays(baseDate, 2);
    }

    if (shiftedDate && (shiftedDate.getMonth() !== baseMonth || shiftedDate.getDate() !== baseDay)) {
      addHoliday(shiftedDate.getMonth(), shiftedDate.getDate(), `${name} (trasladado/puente)`);
    }
  };

  // 17 de Junio: Güemes
  applyTransferredHoliday(5, 17, "Paso a la Inmortalidad del Gral. Martín Miguel de Güemes");
  // 17 de Agosto: San Martín
  applyTransferredHoliday(7, 17, "Paso a la Inmortalidad del Gral. José de San Martín");
  // 12 de Octubre: Diversidad Cultural
  applyTransferredHoliday(9, 12, "Día del Respeto a la Diversidad Cultural");
  // 20 de Noviembre: Soberanía Nacional
  applyTransferredHoliday(10, 20, "Día de la Soberanía Nacional");

  // Ordenar los días en cada mes
  for (let m = 0; m < 12; m++) {
    holidays[m].sort((a, b) => a - b);
  }

  return { holidays, holidayNames, isLeap, totalDays };
}
