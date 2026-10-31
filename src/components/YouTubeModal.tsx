import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Youtube, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Square, 
  Video, 
  Palette, 
  Heart, 
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Tag,
  MessageSquare,
  Flame,
  Clock,
  Radio,
  Tv
} from 'lucide-react';
import { DayContent } from '../../types';
import { DAYS_CONTENT } from '../../data';
import { getShareableUrl } from '../utils/urlHelper';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayContent;
  currentDayNum: number;
}

type YouTubeFormat = 'shorts' | 'thumbnail' | 'community';
type YouTubeTheme = 'arena' | 'noche' | 'salvia' | 'amanecer' | 'crimson';

export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  currentDay: initialDay,
  currentDayNum: initialDayNum
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState(initialDayNum);
  const [format, setFormat] = useState<YouTubeFormat>('shorts');
  const [theme, setTheme] = useState<YouTubeTheme>('arena');
  const [channelName, setChannelName] = useState('@AlmanaqueAmorPropio');
  const [activeTab, setActiveTab] = useState<'preview' | 'script' | 'seo' | 'guide'>('preview');

  // Copiado states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCommunity, setCopiedCommunity] = useState(false);

  // Opciones visuales
  const [showHooponopono, setShowHooponopono] = useState(true);
  const [showChannelHandle, setShowChannelHandle] = useState(true);
  const [showSubscribeBadge, setShowSubscribeBadge] = useState(true);
  const [showShortsBadge, setShowShortsBadge] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio / Speech síntesis para práctica de locución
  const [isSpeaking, setIsSpeaking] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sincronizar día inicial al abrir
  useEffect(() => {
    setSelectedDayNum(initialDayNum);
  }, [initialDayNum, isOpen]);

  // Detener síntesis al cerrar
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const currentDay = DAYS_CONTENT[(selectedDayNum - 1) % DAYS_CONTENT.length] || initialDay;

  // Dimensiones oficiales para YouTube
  const dimensions = {
    shorts: { 
      width: 1080, 
      height: 1920, 
      label: 'YouTube Shorts (9:16)', 
      ratioText: '1080 × 1920 px',
      desc: 'Formato vertical ideal para Shorts y videos rápidos de reflexión' 
    },
    thumbnail: { 
      width: 1280, 
      height: 720, 
      label: 'Miniatura de Video (16:9)', 
      ratioText: '1280 × 720 px',
      desc: 'Portada oficial HD para videos estándar, meditaciones y listas' 
    },
    community: { 
      width: 1080, 
      height: 1080, 
      label: 'Pestaña Comunidad (1:1)', 
      ratioText: '1080 × 1080 px',
      desc: 'Publicación cuadrada para interactuar con tus suscriptores' 
    }
  };

  // Temas visuales serenos
  const themeStyles = {
    arena: {
      name: 'Arena Serena',
      bgStart: '#FAF8F5',
      bgEnd: '#F2E8DC',
      cardBg: 'rgba(255, 255, 255, 0.90)',
      cardBorder: '#EBE2D8',
      textPrimary: '#2E2721',
      textSecondary: '#6A5F54',
      accent: '#C2735C',
      accentBg: '#FAF2EE',
      accentBorder: '#E8C5B9',
      gold: '#BA9252',
      badgeBg: '#F5EFEB',
      badgeText: '#944D3A',
      ytRed: '#FF0000'
    },
    noche: {
      name: 'Noche Zen & Oro',
      bgStart: '#1A1614',
      bgEnd: '#2A221C',
      cardBg: 'rgba(46, 39, 33, 0.90)',
      cardBorder: '#4A4036',
      textPrimary: '#FAF8F5',
      textSecondary: '#DED3C4',
      accent: '#E8C5B9',
      accentBg: '#3E342B',
      accentBorder: '#7B3F30',
      gold: '#DECCA2',
      badgeBg: '#3A312A',
      badgeText: '#DECCA2',
      ytRed: '#FF2E2E'
    },
    salvia: {
      name: 'Salvia & Sanación',
      bgStart: '#F3F6F4',
      bgEnd: '#E1ECE4',
      cardBg: 'rgba(255, 255, 255, 0.92)',
      cardBorder: '#C8DACD',
      textPrimary: '#26342B',
      textSecondary: '#5A7A64',
      accent: '#455E4E',
      accentBg: '#E5EDE7',
      accentBorder: '#ADC4B4',
      gold: '#8EAF97',
      badgeBg: '#E5EDE7',
      badgeText: '#32483B',
      ytRed: '#E63946'
    },
    amanecer: {
      name: 'Amanecer Cálido',
      bgStart: '#FFF8F3',
      bgEnd: '#FCE7DF',
      cardBg: 'rgba(255, 255, 255, 0.92)',
      cardBorder: '#F4D4C8',
      textPrimary: '#38221D',
      textSecondary: '#7A5247',
      accent: '#B0604A',
      accentBg: '#FAF0EB',
      accentBorder: '#DC9F8C',
      gold: '#BA9252',
      badgeBg: '#FCECE6',
      badgeText: '#944D3A',
      ytRed: '#FF0000'
    },
    crimson: {
      name: 'YouTube Zen Red',
      bgStart: '#260B0B',
      bgEnd: '#421414',
      cardBg: 'rgba(38, 11, 11, 0.88)',
      cardBorder: '#662222',
      textPrimary: '#FFF5F5',
      textSecondary: '#F3C5C5',
      accent: '#FF4D4D',
      accentBg: '#591B1B',
      accentBorder: '#802626',
      gold: '#FFD166',
      badgeBg: '#FF0000',
      badgeText: '#FFFFFF',
      ytRed: '#FF0000'
    }
  };

  // Dibujar en canvas con calidad profesional
  const drawToCanvas = (canvas: HTMLCanvasElement, targetFormat: YouTubeFormat, targetTheme: YouTubeTheme) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions[targetFormat];
    canvas.width = width;
    canvas.height = height;

    const currentTheme = themeStyles[targetTheme];

    // 1. Fondo degradado de alta gama
    const bgGradient = ctx.createLinearGradient(0, 0, width * 0.4, height);
    bgGradient.addColorStop(0, currentTheme.bgStart);
    bgGradient.addColorStop(1, currentTheme.bgEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Elementos ornamentales geométricos sutiles
    ctx.save();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1.5;

    // Círculos zen etéreos
    ctx.beginPath();
    ctx.arc(width * 0.88, height * 0.14, width * 0.22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width * 0.12, height * 0.86, width * 0.20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Marco exterior con margen
    const margin = targetFormat === 'thumbnail' ? 35 : 45;
    ctx.save();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    ctx.restore();

    // Función auxiliar para medir y envolver texto
    const wrapText = (text: string, maxWidth: number, font: string): string[] => {
      ctx.font = font;
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = words[0] || '';

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const widthCheck = ctx.measureText(currentLine + ' ' + word).width;
        if (widthCheck < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // RENDERIZADO SEGÚN FORMATO
    if (targetFormat === 'shorts') {
      // ===== FORMATO YOUTUBE SHORTS (9:16 - 1080x1920) =====
      let cursorY = 220;

      // Icono YouTube + Badge de Shorts
      if (showShortsBadge) {
        // Píldora de YouTube Shorts
        const shortsPillWidth = 240;
        const shortsPillHeight = 48;
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.roundRect(width / 2 - shortsPillWidth / 2, cursorY - 32, shortsPillWidth, shortsPillHeight, 24);
        ctx.fill();

        // Icono Play blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const iconX = width / 2 - 75;
        const iconY = cursorY - 8;
        ctx.moveTo(iconX, iconY - 9);
        ctx.lineTo(iconX + 14, iconY);
        ctx.lineTo(iconX, iconY + 9);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SHORTS · 432 Hz', iconX + 24, cursorY - 1);
        cursorY += 80;
      }

      // Badge de Título del Almanaque
      ctx.textAlign = 'center';
      const badgeText = 'ALMANAQUE DE AMOR PROPIO';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 50;
      const badgeHeight = 44;

      ctx.fillStyle = currentTheme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - badgeWidth / 2, cursorY - 26, badgeWidth, badgeHeight, 22);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = currentTheme.badgeText;
      ctx.fillText(badgeText, width / 2, cursorY + 2);
      cursorY += 85;

      // Número de día
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.accent;
      ctx.fillText(`DÍA ${selectedDayNum} · AFIRMACIÓN DIARIA`, width / 2, cursorY);
      cursorY += 75;

      // Título Principal de la Afirmación
      ctx.fillStyle = currentTheme.textPrimary;
      const titleFont = 'bold 64px "Cormorant Garamond", "Playfair Display", Georgia, serif';
      const titleLines = wrapText(currentDay.title, width - 200, titleFont);
      ctx.font = titleFont;
      titleLines.forEach((line) => {
        ctx.fillText(line, width / 2, cursorY);
        cursorY += 78;
      });

      cursorY += 30;

      // Línea divisoria en Oro
      ctx.strokeStyle = currentTheme.gold;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 90, cursorY);
      ctx.lineTo(width / 2 + 90, cursorY);
      ctx.stroke();
      cursorY += 80;

      // Tarjeta Central del Mantra
      const cardMargin = 80;
      const cardWidth = width - cardMargin * 2;
      const mantraFont = 'italic 42px "Cormorant Garamond", "Playfair Display", Georgia, serif';
      const mantraLines = wrapText(`"${currentDay.mantra}"`, cardWidth - 110, mantraFont);
      const mantraBlockHeight = (mantraLines.length * 56) + (currentDay.mantraDescription ? 150 : 80);
      const cardTop = cursorY;

      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(cardMargin, cardTop, cardWidth, mantraBlockHeight, 36);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Comillas elegantes
      ctx.font = '84px "Playfair Display", Georgia, serif';
      ctx.fillStyle = currentTheme.accent;
      ctx.fillText('“', cardMargin + 55, cardTop + 75);

      // Líneas del mantra
      ctx.font = mantraFont;
      ctx.fillStyle = currentTheme.textPrimary;
      let mantraY = cardTop + 85;
      mantraLines.forEach((line) => {
        ctx.fillText(line, width / 2, mantraY);
        mantraY += 56;
      });

      if (currentDay.mantraDescription) {
        ctx.font = 'italic 25px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        const descLines = wrapText(currentDay.mantraDescription, cardWidth - 130, 'italic 25px sans-serif');
        mantraY += 20;
        descLines.slice(0, 3).forEach((line) => {
          ctx.fillText(line, width / 2, mantraY);
          mantraY += 38;
        });
      }

      cursorY = cardTop + mantraBlockHeight + 75;

      // Amor Propio
      if (showHooponopono) {
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.accent;
        ctx.fillText('MÉTODO DE AMOR PROPIO', width / 2, cursorY);
        cursorY += 40;

        ctx.font = 'bold italic 32px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = currentTheme.textPrimary;
        ctx.fillText('« Lo siento · Perdóname · Te amo · Gracias »', width / 2, cursorY);
        cursorY += 75;
      }

      // Zona Inferior de Suscripción / YouTube Branding
      const bottomY = height - margin - 45;

      if (showSubscribeBadge) {
        // Botón rojo estilo Suscríbete de YouTube
        const subWidth = 320;
        const subHeight = 52;
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.roundRect(width / 2 - subWidth / 2, bottomY - 95, subWidth, subHeight, 26);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 21px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🔔 SUSCRÍBETE Y COMPARTE', width / 2, bottomY - 62);
      }

      if (showChannelHandle) {
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textPrimary;
        ctx.fillText(channelName || '@AlmanaqueAmorPropio', width / 2, bottomY - 15);
      }

    } else if (targetFormat === 'thumbnail') {
      // ===== FORMATO MINIATURA 16:9 (1280x720) =====
      const leftColWidth = 780;
      let cursorY = 120;
      ctx.textAlign = 'left';

      // Badge superior izquierdo con icono de YouTube
      const badgeY = cursorY;
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.roundRect(margin + 30, badgeY - 26, 170, 42, 21);
      ctx.fill();

      // Triángulo de Play
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(margin + 52, badgeY - 5 - 8);
      ctx.lineTo(margin + 66, badgeY - 5);
      ctx.lineTo(margin + 52, badgeY - 5 + 8);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('YOUTUBE', margin + 76, badgeY + 2);

      // Badge Día al lado
      ctx.fillStyle = currentTheme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(margin + 215, badgeY - 26, 180, 42, 21);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = currentTheme.accent;
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`DÍA ${selectedDayNum} DE 31`, margin + 235, badgeY + 2);

      cursorY += 75;

      // Título de la miniatura grande y legible
      ctx.fillStyle = currentTheme.textPrimary;
      const titleFont = 'bold 54px "Cormorant Garamond", "Playfair Display", Georgia, serif';
      const titleLines = wrapText(currentDay.title, leftColWidth, titleFont);
      ctx.font = titleFont;
      titleLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, margin + 30, cursorY);
        cursorY += 62;
      });

      cursorY += 15;

      // Tarjeta con Mantra destacado
      const mantraBoxWidth = leftColWidth;
      const mantraBoxHeight = 160;
      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(margin + 30, cursorY, mantraBoxWidth, mantraBoxHeight, 24);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'italic bold 30px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = currentTheme.textPrimary;
      const mantraLines = wrapText(`"${currentDay.mantra}"`, mantraBoxWidth - 70, 'italic bold 30px serif');
      let mY = cursorY + 50;
      mantraLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, margin + 65, mY);
        mY += 40;
      });

      // Ho'oponopono dentro de la tarjeta
      if (showHooponopono) {
        ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.accent;
        ctx.fillText('« Lo siento · Perdóname · Te amo · Gracias »', margin + 65, cursorY + 135);
      }

      // Pie inferior izquierdo con el canal
      if (showChannelHandle) {
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        ctx.fillText(channelName || '@AlmanaqueAmorPropio', margin + 35, height - margin - 35);
      }

      // COLUMNA DERECHA: SELLO ZEN / MEDALLÓN VISUAL
      const rightCenterX = width - 230;
      const rightCenterY = height / 2;

      // Círculos concéntricos dorados
      ctx.strokeStyle = currentTheme.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rightCenterX, rightCenterY, 130, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(rightCenterX, rightCenterY, 145, 0, Math.PI * 2);
      ctx.stroke();

      // Texto dentro del medallón
      ctx.textAlign = 'center';
      ctx.font = '48px sans-serif';
      ctx.fillText('🌸', rightCenterX, rightCenterY - 30);

      ctx.font = 'bold 24px "Cormorant Garamond", serif';
      ctx.fillStyle = currentTheme.textPrimary;
      ctx.fillText('PAZ INTERIOR', rightCenterX, rightCenterY + 15);

      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.accent;
      ctx.fillText('432 Hz · MINDFULNESS', rightCenterX, rightCenterY + 42);

      if (showSubscribeBadge) {
        // Píldora de suscripción abajo a la derecha
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.roundRect(rightCenterX - 110, height - margin - 60, 220, 42, 21);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('🔔 SUSCRÍBETE', rightCenterX, height - margin - 33);
      }

    } else {
      // ===== FORMATO COMUNIDAD DE YOUTUBE (1:1 - 1080x1080) =====
      let cursorY = 150;
      ctx.textAlign = 'center';

      // Badge superior
      const topBadge = 'COMUNIDAD YOUTUBE · ALMANAQUE DE AMOR PROPIO';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      const badgeWidth = ctx.measureText(topBadge).width + 50;
      ctx.fillStyle = currentTheme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - badgeWidth / 2, cursorY - 26, badgeWidth, 44, 22);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = currentTheme.badgeText;
      ctx.fillText(topBadge, width / 2, cursorY + 4);
      cursorY += 75;

      // Día
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.accent;
      ctx.fillText(`REFLEXIÓN DIARIA · DÍA ${selectedDayNum}`, width / 2, cursorY);
      cursorY += 65;

      // Título
      ctx.fillStyle = currentTheme.textPrimary;
      const titleFont = 'bold 52px "Cormorant Garamond", "Playfair Display", Georgia, serif';
      const titleLines = wrapText(currentDay.title, width - 220, titleFont);
      ctx.font = titleFont;
      titleLines.forEach((line) => {
        ctx.fillText(line, width / 2, cursorY);
        cursorY += 65;
      });

      cursorY += 25;

      // Tarjeta Mantra
      const cardMargin = 70;
      const cardWidth = width - cardMargin * 2;
      const mantraFont = 'italic 38px "Cormorant Garamond", Georgia, serif';
      const mantraLines = wrapText(`"${currentDay.mantra}"`, cardWidth - 100, mantraFont);
      const mantraBlockHeight = (mantraLines.length * 52) + (currentDay.mantraDescription ? 120 : 60);
      const cardTop = cursorY;

      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(cardMargin, cardTop, cardWidth, mantraBlockHeight, 30);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Mantra
      ctx.font = mantraFont;
      ctx.fillStyle = currentTheme.textPrimary;
      let mY = cardTop + 65;
      mantraLines.forEach((line) => {
        ctx.fillText(line, width / 2, mY);
        mY += 52;
      });

      if (currentDay.mantraDescription) {
        ctx.font = 'italic 23px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        const descLines = wrapText(currentDay.mantraDescription, cardWidth - 120, 'italic 23px sans-serif');
        mY += 10;
        descLines.slice(0, 2).forEach((line) => {
          ctx.fillText(line, width / 2, mY);
          mY += 34;
        });
      }

      cursorY = cardTop + mantraBlockHeight + 60;

      // Amor Propio
      if (showHooponopono) {
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.accent;
        ctx.fillText('MÉTODO DE AMOR PROPIO', width / 2, cursorY);
        cursorY += 34;

        ctx.font = 'bold italic 28px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = currentTheme.textPrimary;
        ctx.fillText('« Lo siento · Perdóname · Te amo · Gracias »', width / 2, cursorY);
        cursorY += 60;
      }

      // Canal y Cierre
      const bottomY = height - margin - 35;
      if (showSubscribeBadge) {
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#FF0000';
        ctx.fillText('🔔 ¿Cómo resuena esta afirmación contigo hoy? Déjalo en comentarios', width / 2, bottomY - 35);
      }

      if (showChannelHandle) {
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textPrimary;
        ctx.fillText(channelName || '@AlmanaqueAmorPropio', width / 2, bottomY);
      }
    }
  };

  // Redibujar al cambiar opciones
  useEffect(() => {
    if (!isOpen) return;
    const canvas = previewCanvasRef.current;
    if (canvas) {
      drawToCanvas(canvas, format, theme);
    }
  }, [isOpen, selectedDayNum, format, theme, channelName, showHooponopono, showChannelHandle, showSubscribeBadge, showShortsBadge]);

  // Generar Título de YouTube
  const generateYouTubeTitle = (): string => {
    if (format === 'shorts') {
      return `✨ Afirmación Día ${selectedDayNum}: ${currentDay.title} | Amor Propio & Autoestimas #Shorts`;
    } else if (format === 'thumbnail') {
      return `Día ${selectedDayNum}: ${currentDay.title} - Meditación de Amor Propio y Autoestimas (Frecuencia 432 Hz)`;
    }
    return `🌸 Reflexión Día ${selectedDayNum} · ${currentDay.title} | Comunidad`;
  };

  // Generar Descripción completa de YouTube
  const generateYouTubeDescription = (): string => {
    return `✨ AFIRMACIÓN DÍA ${selectedDayNum} · "${currentDay.mantra}"
Tema de hoy: ${currentDay.title}

🌿 Práctica de Amor Propio y Autoestimas:
« Lo siento · Perdóname · Te amo · Gracias »

${currentDay.content ? currentDay.content.join('\n\n') : ''}

${currentDay.mantraDescription ? `💫 Significado del mantra:\n${currentDay.mantraDescription}\n` : ''}
⏱️ GUÍA DE RESPIRACIÓN Y PRESENCIA:
1. Cierra tus ojos y haz una inhalación profunda en 4 tiempos.
2. Sostén el aire sintiendo agradecimiento por tu vida.
3. Exhala soltando cualquier tensión o juicio hacia ti mismo.
4. Repite mentalmente o en voz alta la afirmación del día.

💬 PREGUNTA PARA TI EN LOS COMENTARIOS:
¿Qué palabra sagrada necesitas dedicarte hoy a ti mismo? Escribe "ACEPTO Y ME AMO" para anclar esta energía de sanación en tu vida.

🔔 SUSCRÍBETE al canal y activa la campanita para no perderte tu afirmación diaria y continuar juntos este viaje de 31 días de transformación interior.

🌐 Accede al Almanaque Interactivo completo con reproductor en 432 Hz, diario íntimo y oráculo de cartas en:
${getShareableUrl()}

#Shorts #AmorPropio #Autoestimas #Meditacion #PazInterior #AfirmacionesDiarias #DesarrolloPersonal #SanacionInterior #MindfulnessEnEspañol #Frecuencia432Hz`;
  };

  // Generar Etiquetas / Tags para YouTube Studio
  const generateYouTubeTags = (): string => {
    return `amor propio, autoestimas, autoestima, afirmaciones diarias, afirmacion dia ${selectedDayNum}, meditacion guiada, paz interior, salud mental, mindfulness en espanol, lo siento perdoname te amo gracias, espiritualidad, frecuencia 432 hz, crecimiento personal, pensamientos positivos, amor propio shorts, shorts espirituales, canal de meditacion`;
  };

  // Generar Guión de Locución para Shorts (Voice-Over Script)
  const generateVoiceOverScript = (): string => {
    return `🎙️ GUIÓN DE VOZ EN OFF (Para grabar tu Short de 20-30 segundos)

[0:00 - 0:04 · GANCHO]
"Toma una respiración profunda... Si este video llegó a ti hoy, es porque tu alma necesitaba escuchar esto:"

[0:04 - 0:12 · AFIRMACIÓN Y MANTRA]
"Día ${selectedDayNum}: ${currentDay.title}.
Repite conmigo con fe:
« ${currentDay.mantra} »"

[0:12 - 0:20 · MÉTODO DE AMOR PROPIO]
"Limpia cualquier culpa o juicio del pasado con estas cuatro palabras de luz:
Lo siento. Perdóname. Te amo. Gracias."

[0:20 - 0:28 · CIERRE Y ACCIÓN]
"Siente la calma en tu pecho. Guarda este Short para escucharlo durante el día y suscríbete para recibir tu afirmación diaria de amor propio."`;
  };

  // Texto para la Pestaña Comunidad
  const generateCommunityPostText = (): string => {
    return `🌸 DÍA ${selectedDayNum} · ${currentDay.title}

"${currentDay.mantra}"

✨ Recordatorio de Amor Propio y Autoestimas para hoy:
« Lo siento · Perdóname · Te amo · Gracias »

Querida comunidad, hoy nos damos permiso para soltar las expectativas ajenas y abrazar nuestra autenticidad.

👇 Déjame en los comentarios:
¿Cuál es un pequeño acto de amor propio que harás por ti hoy?

✨ Si deseas interactuar con el Almanaque completo con música 432 Hz y oráculo, visita el enlace en la descripción del canal.`;
  };

  // Descargar imagen HD
  const handleDownloadImage = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        const filename = `youtube_${format}_dia_${selectedDayNum}_${currentDay.title.toLowerCase().replace(/\s+/g, '_')}.png`;
        link.download = filename;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (err) {
        console.error('Error al descargar:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  // Locución con Web SpeechSynthesis
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Tu navegador no soporta síntesis de voz.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = `Toma una respiración profunda. Día ${selectedDayNum}. ${currentDay.title}. Repite conmigo: ${currentDay.mantra}. Lo siento. Perdóname. Te amo. Gracias. Guarda esta afirmación y suscríbete para recibir tu dosis diaria de paz interior.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Ritmo pausado y sereno
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ENCABEZADO MODAL CON BRANDING DE YOUTUBE */}
        <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-md text-white">
              <Youtube className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                  Publicar en YouTube
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider">
                  Shorts & Videos
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Genera portadas HD, guiones para Shorts, títulos SEO y descripciones listas para YouTube Studio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN DENTRO DEL MODAL */}
        <div className="flex items-center gap-1 sm:gap-2 px-5 sm:px-7 pt-3 pb-2 bg-stone-50 border-b border-stone-200/80 shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview' 
                ? 'bg-red-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Generador de Imágenes HD</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'script' 
                ? 'bg-red-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Guión de Locución</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'seo' 
                ? 'bg-red-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Metadatos & SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'guide' 
                ? 'bg-red-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guía Paso a Paso</span>
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* SELECTOR RÁPIDO DE DÍA DEL ALMANAQUE (Disponible en todas las pestañas) */}
          <div className="flex items-center justify-between bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDayNum((prev) => (prev > 1 ? prev - 1 : 31))}
                className="p-1.5 bg-white hover:bg-stone-200 rounded-full text-stone-700 transition-colors shadow-2xs cursor-pointer"
                title="Día anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[11px] uppercase font-bold text-stone-500 block leading-tight">
                  Publicación Seleccionada
                </span>
                <span className="font-serif font-bold text-stone-900 text-sm">
                  Día {selectedDayNum}: {currentDay.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDayNum((prev) => (prev < 31 ? prev + 1 : 1))}
                className="p-1.5 bg-white hover:bg-stone-200 rounded-full text-stone-700 transition-colors shadow-2xs cursor-pointer"
                title="Día siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <select
                value={selectedDayNum}
                onChange={(e) => setSelectedDayNum(Number(e.target.value))}
                className="bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-semibold text-stone-800 shadow-2xs cursor-pointer"
              >
                {DAYS_CONTENT.map((d, i) => (
                  <option key={i + 1} value={i + 1}>
                    Día {i + 1}: {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PESTAÑA 1: GENERADOR DE IMÁGENES HD PARA YOUTUBE */}
          {activeTab === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* COLUMNA IZQUIERDA: CANVAS DE PREVISUALIZACIÓN */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full bg-stone-900/5 rounded-3xl p-4 sm:p-6 border border-stone-200 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px]">
                  <div 
                    className={`relative rounded-2xl shadow-xl overflow-hidden border border-stone-300/80 bg-white transition-all duration-300 ${
                      format === 'shorts' 
                        ? 'w-60 sm:w-64 aspect-[9/16]' 
                        : format === 'thumbnail' 
                          ? 'w-full max-w-md aspect-[16/9]' 
                          : 'w-64 sm:w-72 aspect-square'
                    }`}
                  >
                    <canvas
                      ref={previewCanvasRef}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between w-full max-w-md text-xs text-stone-500 font-medium">
                    <span>{dimensions[format].label}</span>
                    <span className="font-mono text-[11px] bg-stone-200 px-2 py-0.5 rounded-md text-stone-700">
                      {dimensions[format].ratioText}
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN PRINCIPAL DE DESCARGA Y ACCESO A YOUTUBE STUDIO */}
                <div className="w-full mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadImage}
                    disabled={isGenerating}
                    className="flex-1 py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGenerating ? 'Generando PNG...' : 'Descargar Imagen HD para YouTube'}</span>
                  </button>

                  <a
                    href="https://studio.youtube.com/channel/UC/videos/upload"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Abrir YouTube Studio en nueva pestaña para subir tu contenido"
                  >
                    <span>YouTube Studio</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                </div>
              </div>

              {/* COLUMNA DERECHA: CONFIGURACIÓN DE FORMATOS Y ESTILOS */}
              <div className="lg:col-span-6 space-y-5">
                
                {/* 1. Selección de Formato */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-red-600" />
                    <span>Formato de YouTube</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFormat('shorts')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        format === 'shorts'
                          ? 'bg-red-50 border-red-400 text-red-950 shadow-2xs ring-1 ring-red-400'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Smartphone className="w-4 h-4 text-red-600" />
                        <span>Shorts (9:16)</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">1080×1920</span>
                    </button>

                    <button
                      onClick={() => setFormat('thumbnail')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        format === 'thumbnail'
                          ? 'bg-red-50 border-red-400 text-red-950 shadow-2xs ring-1 ring-red-400'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Video className="w-4 h-4 text-red-600" />
                        <span>Miniatura (16:9)</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">1280×720</span>
                    </button>

                    <button
                      onClick={() => setFormat('community')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        format === 'community'
                          ? 'bg-red-50 border-red-400 text-red-950 shadow-2xs ring-1 ring-red-400'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Square className="w-4 h-4 text-red-600" />
                        <span>Comunidad (1:1)</span>
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">1080×1080</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 italic">
                    {dimensions[format].desc}
                  </p>
                </div>

                {/* 2. Paleta de Temas Visuales */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-red-600" />
                    <span>Estilo y Paleta de Color</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(themeStyles) as YouTubeTheme[]).map((tKey) => {
                      const tObj = themeStyles[tKey];
                      const isSelected = theme === tKey;
                      return (
                        <button
                          key={tKey}
                          onClick={() => setTheme(tKey)}
                          className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs scale-[1.02]' 
                              : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                            style={{ background: tObj.bgEnd }} 
                          />
                          <span className="text-xs font-semibold truncate">{tObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Personalización del Canal & Elementos */}
                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block">
                    Elementos en la Imagen
                  </label>

                  {/* Input de Nombre de Canal */}
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Nombre o Identificador de tu Canal de YouTube
                    </label>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="@TuCanalDeYouTube"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                      <span>Frase Sagrada de Amor Propio («Lo siento...»)</span>
                      <input
                        type="checkbox"
                        checked={showHooponopono}
                        onChange={(e) => setShowHooponopono(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                      <span>Mostrar nombre de canal en pie de imagen</span>
                      <input
                        type="checkbox"
                        checked={showChannelHandle}
                        onChange={(e) => setShowChannelHandle(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                      <span>Botón de Suscripción / Campanita 🔔</span>
                      <input
                        type="checkbox"
                        checked={showSubscribeBadge}
                        onChange={(e) => setShowSubscribeBadge(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                      />
                    </label>

                    {format === 'shorts' && (
                      <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                        <span>Badge superior "SHORTS · 432 Hz"</span>
                        <input
                          type="checkbox"
                          checked={showShortsBadge}
                          onChange={(e) => setShowShortsBadge(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PESTAÑA 2: GUIÓN DE LOCUCIÓN PARA SHORTS (VOICE-OVER) */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200/90 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                      Guión de Voz en Off para YouTube Shorts (15 a 30 seg)
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Lee este texto pausado mientras muestras la imagen de fondo o grabas tu voz con música relajante a 432 Hz.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSpeech}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                      isSpeaking 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                        : 'bg-amber-700 hover:bg-amber-800 text-white'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isSpeaking ? 'Detener Voz' : 'Escuchar Muestra'}</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(generateVoiceOverScript(), setCopiedScript)}
                    className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? '¡Copiado!' : 'Copiar Guión'}</span>
                  </button>
                </div>
              </div>

              {/* Caja de texto del guión */}
              <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed border border-stone-800 relative">
                <pre className="whitespace-pre-wrap font-sans">
                  {generateVoiceOverScript()}
                </pre>
              </div>

              {/* Consejos para el algoritmo de YouTube Shorts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-1">
                    <Flame className="w-4 h-4" />
                    <span>El Gancho Inicial</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Los primeros 3 segundos deciden si la persona se queda. Invita a respirar o haz una pregunta reflexiva.
                  </p>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Duración Óptima</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Entre 20 y 35 segundos para que la retención promedio supere el 80% y YouTube recomiende el Short masivamente.
                  </p>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Música en Tendencia</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    En la app móvil de YouTube, agrega una pista suave de fondo de la biblioteca ("Meditation", "432 Hz" o "Relaxing").
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: METADATOS Y SEO PARA YOUTUBE STUDIO */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              
              {/* 1. TÍTULO SUGERIDO */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Título Optimizado (Copiar y Pegar en YouTube Studio)
                  </label>
                  <button
                    onClick={() => copyToClipboard(generateYouTubeTitle(), setCopiedTitle)}
                    className="text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTitle ? '¡Copiado!' : 'Copiar Título'}</span>
                  </button>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-300 font-medium text-xs sm:text-sm text-stone-900">
                  {generateYouTubeTitle()}
                </div>
              </div>

              {/* 2. DESCRIPCIÓN COMPLETA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Descripción Completa (Con Timestamps, Amor Propio y Enlace)
                  </label>
                  <button
                    onClick={() => copyToClipboard(generateYouTubeDescription(), setCopiedDescription)}
                    className="text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedDescription ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDescription ? '¡Copiada!' : 'Copiar Descripción'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={generateYouTubeDescription()}
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-800 leading-relaxed focus:outline-none font-sans"
                />
              </div>

              {/* 3. ETIQUETAS (TAGS) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Etiquetas / Tags para YouTube Studio (Separadas por comas)
                  </label>
                  <button
                    onClick={() => copyToClipboard(generateYouTubeTags(), setCopiedTags)}
                    className="text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTags ? '¡Copiadas!' : 'Copiar Tags'}</span>
                  </button>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-700 leading-relaxed font-mono">
                  {generateYouTubeTags()}
                </div>
              </div>

              {/* 4. TEXTO PARA PESTAÑA COMUNIDAD */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                    <span>Texto para Post de la Pestaña Comunidad</span>
                  </label>
                  <button
                    onClick={() => copyToClipboard(generateCommunityPostText(), setCopiedCommunity)}
                    className="text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCommunity ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCommunity ? '¡Copiado!' : 'Copiar Post'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={5}
                  value={generateCommunityPostText()}
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-800 leading-relaxed focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* PESTAÑA 4: GUÍA PASO A PASO PARA PUBLICAR EN YOUTUBE */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Paso 1 */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h5 className="text-sm font-bold text-stone-900">Crear un YouTube Short (Desde el Teléfono)</h5>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
                    <li>Descarga la imagen en formato <strong>Shorts (9:16)</strong> desde la pestaña "Generador".</li>
                    <li>Abre la aplicación de YouTube en tu móvil y pulsa el botón <strong>+ (Crear) &gt; Crear un Short</strong>.</li>
                    <li>Selecciona la imagen descargada de tu galería.</li>
                    <li>Pulsa en <strong>"Sonido"</strong> arriba y busca "432 Hz Meditation" o cualquier música ambiental relajante.</li>
                    <li>Copia el título y descripción desde la pestaña "Metadatos & SEO" y dale a <strong>Publicar</strong>.</li>
                  </ul>
                </div>

                {/* Paso 2 */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h5 className="text-sm font-bold text-stone-900">Publicar en la Pestaña Comunidad</h5>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
                    <li>Descarga la imagen en formato <strong>Comunidad (1:1 Cuadrado)</strong>.</li>
                    <li>Entra a tu canal de YouTube y ve a la pestaña <strong>Comunidad</strong>.</li>
                    <li>Selecciona <strong>"Imagen"</strong> y sube la tarjeta descargada.</li>
                    <li>Pega el texto reflexivo generado en la pestaña "Metadatos & SEO".</li>
                    <li>Añade una pregunta para que tus suscriptores comenten y aumente el alcance de tu canal.</li>
                  </ul>
                </div>

                {/* Paso 3 */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h5 className="text-sm font-bold text-stone-900">Videos Largos de Meditación (16:9)</h5>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
                    <li>Descarga la <strong>Miniatura (16:9 - 1280x720)</strong> con tipografía de alto contraste.</li>
                    <li>En tu editor de video favorito (como CapCut, Canva o Premiere), pon la imagen como portada.</li>
                    <li>Agrega música de fondo a 432 Hz y graba la afirmación leída lentamente.</li>
                    <li>Sube el video a <a href="https://studio.youtube.com" target="_blank" rel="noreferrer" className="text-red-600 underline">YouTube Studio</a> y sube la miniatura personalizada.</li>
                  </ul>
                </div>

                {/* Paso 4 */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <h5 className="text-sm font-bold text-stone-900">Vincular tu Canal con el Almanaque</h5>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
                    <li>Incluye siempre el enlace al Almanaque interactivo en la primera línea de tus descripciones.</li>
                    <li>Fija un comentario con el enlace al día correspondiente para que tus suscriptores sigan la práctica en vivo.</li>
                    <li>Utiliza el hashtag sagrado <code>#Hooponopono</code> y <code>#AmorPropio</code> para posicionar en búsquedas orgánicas.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* PIE DEL MODAL */}
        <div className="px-5 sm:px-7 py-3 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Youtube className="w-4 h-4 text-red-600 fill-red-600" />
            <span className="font-semibold">Adaptado para YouTube Shorts, Miniaturas 16:9 y Comunidad</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Abrir YouTube Studio</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
