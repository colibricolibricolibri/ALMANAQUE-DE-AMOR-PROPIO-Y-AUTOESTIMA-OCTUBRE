export interface YearlyPhotoItem {
  year: number;
  month: number; // 1 to 12
  monthName: string;
  title: string;
  imageUrl: string;
  altUrl?: string;
  isCustom?: boolean;
}

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DEFAULT_YEARLY_PHOTOS: Record<number, Record<number, { title: string; imageUrl: string; altUrl?: string }>> = {
  // Año 2028: 12 fotos (Mes 1 al 12) que corresponden a las primeras 12 de días adicionales
  2028: {
    1: { title: "Aceptación", imageUrl: "https://i.ibb.co/sJ99mww4/day13.png" },
    2: { title: "Ojos de Amor", imageUrl: "https://i.ibb.co/PsFRjTCn/day14.png" },
    3: { title: "Voz Interior", imageUrl: "https://i.ibb.co/GQN1hGJv/image.png" },
    4: { title: "Niñ@ Interior", imageUrl: "https://i.ibb.co/Y40yxLPb/day16.png" },
    5: { title: "Nueva Realidad", imageUrl: "https://i.ibb.co/G3GpdCng/day17.png" },
    6: { title: "Sin Expectativas", imageUrl: "https://i.ibb.co/kVJTMr57/day18.png" },
    7: { title: "Auto-Honra", imageUrl: "https://i.ibb.co/JWp1r7LL/image.jpg" },
    8: { title: "El Espejo Externo", imageUrl: "https://i.ibb.co/TBmdmpc2/day20.png" },
    9: { title: "Unidad", imageUrl: "https://i.ibb.co/HTCwkfjQ/day21.png" },
    10: { title: "Soltar y Dejar Ir", imageUrl: "https://i.ibb.co/3y3Zv4pW/day22.png" },
    11: { title: "Suelta y confía", imageUrl: "https://i.ibb.co/dsCB5KNK/day23.png" },
    12: { title: "Suelta y libera", imageUrl: "https://i.ibb.co/S7nYmTbj/day24.png" },
  },

  // Año 2029: Las 7 que ya estaban (Meses 1 al 7) + Las 5 nuevas agregadas (Meses 8 al 12)
  2029: {
    1: { title: "Suelta y fluye", imageUrl: "https://i.ibb.co/whnRDQb5/day25.png" },
    2: { title: "Confío y estoy a salvo", imageUrl: "https://i.ibb.co/GfnLQSf8/day26.png" },
    3: { title: "Auto-Perdón", imageUrl: "https://i.ibb.co/Y7319s80/day27.png" },
    4: { title: "Todo fluye", imageUrl: "https://i.ibb.co/WJSd89g/day28.png" },
    5: { title: "Bendición del Pasado", imageUrl: "https://i.ibb.co/MyGH9c7n/image.png" },
    6: { title: "Sintonía Universal", imageUrl: "https://i.ibb.co/xqp1V2Bt/day30.png" },
    7: { title: "Regreso al Trono", imageUrl: "https://i.ibb.co/JjnVgQgF/12.jpg", altUrl: "https://ibb.co/GQ7yNTN3" },
    8: { title: "Renacer y Gratitud", imageUrl: "https://i.ibb.co/75dLYG4/1.jpg", altUrl: "https://ibb.co/8pLtKjc" },
    9: { title: "Paz Interior", imageUrl: "https://i.ibb.co/mFTZXZhZ/1-1.jpg", altUrl: "https://ibb.co/h19QZQ2Q" },
    10: { title: "Amor Propio Elevado", imageUrl: "https://i.ibb.co/Psk4jjtq/1-1-1.jpg", altUrl: "https://ibb.co/dsZ6MM78" },
    11: { title: "Armonía Serena", imageUrl: "https://i.ibb.co/yntf0cHM/1-1.jpg", altUrl: "https://ibb.co/xSWChtxc" },
    12: { title: "Cierre en Plenitud", imageUrl: "https://i.ibb.co/x8hvXgjg/1-2.jpg", altUrl: "https://ibb.co/bR1hQvBv" },
  },

  // Año 2030: 12 fotos (Mes 1 al 12)
  2030: {
    1: { title: "Enero: Nuevo Despertar", imageUrl: "https://i.ibb.co/jv1czcGB/1-2-2.jpg", altUrl: "https://ibb.co/MD3YfYpW" },
    2: { title: "Febrero: Vínculos Conscientes", imageUrl: "https://i.ibb.co/GvSWRr7R/1-2.jpg", altUrl: "https://ibb.co/nsJ7jKrj" },
    3: { title: "Marzo: Florecimiento Interior", imageUrl: "https://i.ibb.co/MWgWsWF/1-3.jpg", altUrl: "https://ibb.co/QzJzfzy" },
    4: { title: "Abril: Claridad y Calma", imageUrl: "https://i.ibb.co/Kc4RfWzY/1-3.jpg", altUrl: "https://ibb.co/cKfMZQXP" },
    5: { title: "Mayo: Fuerza del Alma", imageUrl: "https://i.ibb.co/35HhJb8b/1-4.jpg", altUrl: "https://ibb.co/cKdTm9p9" },
    6: { title: "Junio: Solsticio de Paz", imageUrl: "https://i.ibb.co/NgQdRkK0/1-5.jpg", altUrl: "https://ibb.co/1YhtcpTC" },
    7: { title: "Julio: Sabiduría Serena", imageUrl: "https://i.ibb.co/rKy7HZwq/1-5.jpg", altUrl: "https://ibb.co/XfJ2tzC6" },
    8: { title: "Agosto: Entrega y Confianza", imageUrl: "https://i.ibb.co/1YXFBj2j/1-6.jpg", altUrl: "https://ibb.co/DPM0mTKT" },
    9: { title: "Septiembre: Renuevo de Luz", imageUrl: "https://i.ibb.co/dw7Z6LSC/1-6.jpg", altUrl: "https://ibb.co/ksMZ09pb" },
    10: { title: "Octubre: Transformación Gentil", imageUrl: "https://i.ibb.co/cGT4v4k/IMG-20260926-131853783.jpg", altUrl: "https://ibb.co/46NhfhK" },
    11: { title: "Noviembre: Agradecimiento", imageUrl: "https://i.ibb.co/Fqkkv9dL/1-7.jpg", altUrl: "https://ibb.co/HpLLv09f" },
    12: { title: "Diciembre: Paz Infinita", imageUrl: "https://i.ibb.co/XrHcT40Q/1-8.jpg", altUrl: "https://ibb.co/rR9DJt8j" },
  },

  // Año 2031: 12 fotos (Mes 1 al 12)
  2031: {
    1: { title: "Enero: Pureza Inicial", imageUrl: "https://i.ibb.co/wZh2L69c/1-8.jpg", altUrl: "https://ibb.co/HLT92gWh" },
    2: { title: "Febrero: Amor Sagrado", imageUrl: "https://i.ibb.co/C391vZrk/1-9.jpg", altUrl: "https://ibb.co/NdNVpP48" },
    3: { title: "Marzo: Conexión Espiritual", imageUrl: "https://i.ibb.co/1YpPLpGx/1-10.jpg", altUrl: "https://ibb.co/bjyCPy5n" },
    4: { title: "Abril: Serenidad Activa", imageUrl: "https://i.ibb.co/99gBrFmh/1-10.jpg", altUrl: "https://ibb.co/cc3RrGKw" },
    5: { title: "Mayo: Luz de Compasión", imageUrl: "https://i.ibb.co/cS8TQGVK/1-11.jpg", altUrl: "https://ibb.co/rRpyHCNK" },
    6: { title: "Junio: Fluir Armonioso", imageUrl: "https://i.ibb.co/3mLcSq3T/FLOR1.jpg", altUrl: "https://ibb.co/b58XNZ06" },
    7: { title: "Julio: Respiro del Alma", imageUrl: "https://i.ibb.co/k6zdGjBq/1-12.jpg", altUrl: "https://ibb.co/JF8hcVtr" },
    8: { title: "Agosto: Fortaleza Calma", imageUrl: "https://i.ibb.co/QFGk17v5/1-11.jpg", altUrl: "https://ibb.co/kgFJWV2d" },
    9: { title: "Septiembre: Sendero Propio", imageUrl: "https://i.ibb.co/PGHMjC1q/1.jpg", altUrl: "https://ibb.co/TM312hP9" },
    10: { title: "Octubre: Madurez Serena", imageUrl: "https://i.ibb.co/TMPyCP3S/2.jpg", altUrl: "https://ibb.co/Ld9KG97W" },
    11: { title: "Noviembre: Gratitud Pura", imageUrl: "https://i.ibb.co/hxy3RFbM/3.jpg", altUrl: "https://ibb.co/sp28v9nP" },
    12: { title: "Diciembre: Celebración del Ser", imageUrl: "https://i.ibb.co/rRcJN29g/3.jpg", altUrl: "https://ibb.co/FL0tC4p9" },
  },

  // Año 2032: 12 fotos (Mes 1 al 12)
  2032: {
    1: { title: "Enero: Semilla de Paz", imageUrl: "https://i.ibb.co/tpX2SS8w/4.jpg", altUrl: "https://ibb.co/Zzmg33WR" },
    2: { title: "Febrero: Ternura y Autoestima", imageUrl: "https://i.ibb.co/9k6YVRcJ/4.jpg", altUrl: "https://ibb.co/xtW5fVXy" },
    3: { title: "Marzo: Equilibrio Natural", imageUrl: "https://i.ibb.co/rKKjwwp1/5.jpg", altUrl: "https://ibb.co/6ccMWWtf" },
    4: { title: "Abril: Renovación Consciente", imageUrl: "https://i.ibb.co/svSrBL3z/5.jpg", altUrl: "https://ibb.co/fYR7cm0L" },
    5: { title: "Mayo: Luz Esencial", imageUrl: "https://i.ibb.co/DDNLkKtH/6.jpg", altUrl: "https://ibb.co/27w5PKy1" },
    6: { title: "Junio: Expansión de Calma", imageUrl: "https://i.ibb.co/5hz0wW08/6.jpg", altUrl: "https://ibb.co/d43Tx0T2" },
    7: { title: "Julio: Refugio Interior", imageUrl: "https://i.ibb.co/PGFCJfB0/7.jpg", altUrl: "https://ibb.co/qY71hPbV" },
    8: { title: "Agosto: Presencia Serena", imageUrl: "https://i.ibb.co/Y4GPY91M/8.jpg", altUrl: "https://ibb.co/BHRcdDQx" },
    9: { title: "Septiembre: Cosecha Espiritual", imageUrl: "https://i.ibb.co/ZpBMm2jc/8.jpg", altUrl: "https://ibb.co/pBfLyh74" },
    10: { title: "Octubre: Quietud Reparadora", imageUrl: "https://i.ibb.co/fYt4mg3G/9.jpg", altUrl: "https://ibb.co/RpPzLFX4" },
    11: { title: "Noviembre: Bendición de Camino", imageUrl: "https://i.ibb.co/d0SyBW91/9.jpg", altUrl: "https://ibb.co/jvdFh6KB" },
    12: { title: "Diciembre: Plenitud y Amor", imageUrl: "https://i.ibb.co/h1J9x5cr/10.jpg", altUrl: "https://ibb.co/gFL9b1dQ" },
  },

  // Año 2033: Fotos asignadas (Mes 1 al 6) y espacio preparado para más fotos
  2033: {
    1: { title: "Enero: Nuevo Ciclo Cósmico", imageUrl: "https://i.ibb.co/rKc5Hxsq/10.jpg", altUrl: "https://ibb.co/JWyrHvQ8" },
    2: { title: "Febrero: Corazón en Paz", imageUrl: "https://i.ibb.co/C5khK0bR/11.jpg", altUrl: "https://ibb.co/gM5zZgSk" },
    3: { title: "Marzo: Fortaleza Espiritual", imageUrl: "https://i.ibb.co/cX7P5sD8/11.jpg", altUrl: "https://ibb.co/WpYQ9Rgz" },
    4: { title: "Abril: Florecer en Calma", imageUrl: "https://i.ibb.co/cSXr344q/CEREZO5.jpg", altUrl: "https://ibb.co/mVFcTffp" },
    5: { title: "Mayo: Belleza y Gratitud", imageUrl: "https://i.ibb.co/jZD82zDM/FLOR2.jpg", altUrl: "https://ibb.co/KzW5kDWq" },
    6: { title: "Junio: Luz y Serenidad", imageUrl: "https://i.ibb.co/nqXJJPg0/IMG-20260924-185710817-HDR.jpg", altUrl: "https://ibb.co/WNrJJVx3" },
  }
};

export const AVAILABLE_YEARS_GALLERY = [2028, 2029, 2030, 2031, 2032, 2033];

export function getYearlyPhotoForMonth(
  year: number,
  monthNum: number, // 1 to 12
  customYearlyImages: Record<string, string> = {}
): { title: string; imageUrl: string; altUrl?: string; isCustom: boolean } | null {
  const customKey = `${year}_${monthNum}`;
  if (customYearlyImages[customKey]) {
    return {
      title: `${MONTH_NAMES_ES[monthNum - 1]} ${year}`,
      imageUrl: customYearlyImages[customKey],
      isCustom: true,
    };
  }

  const yearData = DEFAULT_YEARLY_PHOTOS[year];
  if (yearData && yearData[monthNum]) {
    return {
      ...yearData[monthNum],
      isCustom: false,
    };
  }

  return null;
}
