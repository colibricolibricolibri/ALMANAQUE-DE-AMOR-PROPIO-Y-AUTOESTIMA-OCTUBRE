import { Language } from './types';

export const TRANSLATIONS: Record<Language, {
  name: string;
  subtitle: string;
  enterCalendar: string;
  personalAlbum: string;
  holidaysNote: string;
  changePhoto: string;
  breatheConfide: string;
  whenUnwell: string;
  repeatPhrase3Times: string;
  cleanCleanClean: string;
  back: string;
  next: string;
  peaceCircle: string;
  journal: string;
  oracle: string;
  breathe: string;
  about: string;
  aboutTitle: string;
  aboutContent: string;
  musicOn: string;
  musicOff: string;
  reminderOn: string;
  reminderOff: string;
  coverPhoto: string;
  dailyPhotos: string;
  days: string[];
  months: string[];
}> = {
  es: {
    name: "Almanaque",
    subtitle: "Amor Propio y Autoestima",
    enterCalendar: "Comenzar el Viaje",
    personalAlbum: "Tu Álbum Personal",
    holidaysNote: "Feriados en terracota suave",
    changePhoto: "Cambiar Foto",
    breatheConfide: "Respira, confía, agradece, suelta",
    whenUnwell: "cuando sientas malestar",
    repeatPhrase3Times: "repite la frase 3 veces",
    cleanCleanClean: "Limpia, limpia, limpia",
    back: "Anterior",
    next: "Siguiente",
    peaceCircle: "Círculo de Paz",
    journal: "Diario Íntimo",
    oracle: "Carta del Día",
    breathe: "Respirar",
    about: "Acerca de",
    aboutTitle: "Acerca de este Almanaque",
    aboutContent: "Este almanaque nació como una guía íntima de amor propio, sanación y autoobservación inspirada en el método Ho'oponopono y en el camino personal de transformación. Todas las reflexiones fueron creadas para acompañarte con ternura y recordarte tu luz esencial.",
    musicOn: "Pausar música zen (432 Hz)",
    musicOff: "Activar música zen (432 Hz)",
    reminderOn: "Desactivar recordatorio",
    reminderOff: "Activar recordatorio de paz",
    coverPhoto: "Foto de Portada",
    dailyPhotos: "Fotos Diarias",
    days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  },
  en: {
    name: "Almanac",
    subtitle: "Self-Love and Self-Esteem",
    enterCalendar: "Begin the Journey",
    personalAlbum: "Your Personal Album",
    holidaysNote: "Holidays marked in soft terracotta",
    changePhoto: "Change Photo",
    breatheConfide: "Breathe, trust, give thanks, let go",
    whenUnwell: "when you feel unease",
    repeatPhrase3Times: "repeat this phrase 3 times",
    cleanCleanClean: "Cleanse, cleanse, cleanse",
    back: "Previous",
    next: "Next",
    peaceCircle: "Circle of Peace",
    journal: "Intimate Journal",
    oracle: "Card of the Day",
    breathe: "Breathe",
    about: "About",
    aboutTitle: "About this Almanac",
    aboutContent: "This almanac was born as an intimate guide of self-love, healing, and self-observation inspired by the Ho'oponopono tradition and a personal journey of transformation. All reflections are crafted to hold space for you with gentleness and remind you of your innate light.",
    musicOn: "Pause zen music (432 Hz)",
    musicOff: "Play zen music (432 Hz)",
    reminderOn: "Disable reminder",
    reminderOff: "Enable peace reminder",
    coverPhoto: "Cover Photo",
    dailyPhotos: "Daily Photos",
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  },
  pt: {
    name: "Almanaque",
    subtitle: "Amor-Próprio e Autoestima",
    enterCalendar: "Começar a Jornada",
    personalAlbum: "Seu Álbum Pessoal",
    holidaysNote: "Feriados em terracota suave",
    changePhoto: "Mudar Foto",
    breatheConfide: "Respire, confie, agradeça, solte",
    whenUnwell: "quando sentir desconforto",
    repeatPhrase3Times: "repita a frase 3 vezes",
    cleanCleanClean: "Limpa, limpa, limpa",
    back: "Anterior",
    next: "Seguinte",
    peaceCircle: "Círculo de Paz",
    journal: "Diário Íntimo",
    oracle: "Carta do Dia",
    breathe: "Respirar",
    about: "Sobre",
    aboutTitle: "Sobre este Almanaque",
    aboutContent: "Este almanaque nasceu como um guia íntimo de amor-próprio, cura e auto-observação inspirado no método Ho'oponopono e na jornada pessoal de transformação.",
    musicOn: "Pausar música zen (432 Hz)",
    musicOff: "Ativar música zen (432 Hz)",
    reminderOn: "Desativar lembrete",
    reminderOff: "Ativar lembrete de paz",
    coverPhoto: "Foto de Capa",
    dailyPhotos: "Fotos Diárias",
    days: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  },
  it: {
    name: "Almanacco",
    subtitle: "Amore Proprio e Autostima",
    enterCalendar: "Inizia il Viaggio",
    personalAlbum: "Il Tuo Album Personale",
    holidaysNote: "Giorni festivi in terracotta tenue",
    changePhoto: "Cambia Foto",
    breatheConfide: "Respira, abbi fiducia, ringrazia, lascia andare",
    whenUnwell: "quando provi disagio",
    repeatPhrase3Times: "ripeti la frase 3 volte",
    cleanCleanClean: "Pulisci, purifica, libera",
    back: "Precedente",
    next: "Successivo",
    peaceCircle: "Cerchio di Pace",
    journal: "Diario Intimo",
    oracle: "Carta del Giorno",
    breathe: "Respira",
    about: "Informazioni",
    aboutTitle: "Informazioni sull'Almanacco",
    aboutContent: "Questo almanacco è nato come guida intima di amore proprio, guarigione e auto-osservazione ispirata al metodo Ho'oponopono e al cammino di trasformazione interiore.",
    musicOn: "Pausa musica zen (432 Hz)",
    musicOff: "Attiva musica zen (432 Hz)",
    reminderOn: "Disattiva promemoria",
    reminderOff: "Attiva promemoria di pace",
    coverPhoto: "Foto di Copertina",
    dailyPhotos: "Foto Giornaliere",
    days: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
  },
  fr: {
    name: "Almanach",
    subtitle: "Amour de Soi et Estime",
    enterCalendar: "Commencer le Voyage",
    personalAlbum: "Votre Album Personnel",
    holidaysNote: "Jours fériés en terracotta douce",
    changePhoto: "Changer la Photo",
    breatheConfide: "Respirez, ayez confiance, remerciez, lâchez prise",
    whenUnwell: "lorsque vous ressentez un malaise",
    repeatPhrase3Times: "répétez cette phrase 3 fois",
    cleanCleanClean: "Nettoie, purifie, libère",
    back: "Précédent",
    next: "Suivant",
    peaceCircle: "Cercle de Paix",
    journal: "Journal Intime",
    oracle: "Carte du Jour",
    breathe: "Respirer",
    about: "À Propos",
    aboutTitle: "À Propos de cet Almanach",
    aboutContent: "Cet almanach est né comme un guide intime d'amour de soi, de guérison et d'observation inspiré de la sagesse Ho'oponopono et du voyage de transformation personnelle.",
    musicOn: "Pause musique zen (432 Hz)",
    musicOff: "Activer musique zen (432 Hz)",
    reminderOn: "Désactiver le rappel",
    reminderOff: "Activer le rappel de paix",
    coverPhoto: "Photo de Couverture",
    dailyPhotos: "Photos Quotidiennes",
    days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  }
};
