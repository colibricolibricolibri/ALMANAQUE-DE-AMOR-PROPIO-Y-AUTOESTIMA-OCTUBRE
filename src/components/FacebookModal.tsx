import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Facebook, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Square, 
  Maximize2, 
  Palette, 
  Heart, 
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Bookmark,
  Users,
  MessageCircle,
  Link2
} from 'lucide-react';
import { DayContent } from '../../types';
import { DAYS_CONTENT } from '../../data';
import { getShareableUrl } from '../utils/urlHelper';

interface FacebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayContent;
  currentDayNum: number;
}

type FacebookFormat = 'horizontal' | 'square' | 'story';
type FacebookTheme = 'arena' | 'noche' | 'salvia' | 'amanecer';

export const FacebookModal: React.FC<FacebookModalProps> = ({
  isOpen,
  onClose,
  currentDay: initialDay,
  currentDayNum: initialDayNum
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState(initialDayNum);
  const [format, setFormat] = useState<FacebookFormat>('horizontal');
  const [theme, setTheme] = useState<FacebookTheme>('arena');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'guide'>('preview');
  
  // Opciones de contenido en la imagen
  const [showHooponopono, setShowHooponopono] = useState(true);
  const [showCallToAction, setShowCallToAction] = useState(true);
  const [showUrlWatermark, setShowUrlWatermark] = useState(true);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sincronizar día inicial si cambia al abrir
  useEffect(() => {
    setSelectedDayNum(initialDayNum);
  }, [initialDayNum, isOpen]);

  const currentDay = DAYS_CONTENT[(selectedDayNum - 1) % DAYS_CONTENT.length] || initialDay;

  // Dimensiones oficiales para Facebook
  const dimensions: Record<FacebookFormat, { width: number; height: number; label: string; icon: any; desc: string }> = {
    horizontal: { 
      width: 1200, 
      height: 630, 
      label: 'Post Feed / Enlace (1200×630)', 
      icon: Maximize2,
      desc: 'Formato estándar y recomendado por Facebook para máxima visibilidad en el muro'
    },
    square: { 
      width: 1080, 
      height: 1080, 
      label: 'Post Cuadrado (1:1)', 
      icon: Square,
      desc: 'Ideal para publicaciones de fotos de alto impacto en dispositivos móviles'
    },
    story: { 
      width: 1080, 
      height: 1920, 
      label: 'Historia / Reels (9:16)', 
      icon: Smartphone,
      desc: 'Para Facebook Stories efímeras y pantallas completas de celulares'
    }
  };

  // Temas visuales serenos
  const themeStyles: Record<FacebookTheme, {
    name: string;
    bgStart: string;
    bgEnd: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentBg: string;
    accentBorder: string;
    gold: string;
    badgeBg: string;
    badgeText: string;
  }> = {
    arena: {
      name: 'Arena Serena',
      bgStart: '#FAF8F5',
      bgEnd: '#F2E8DC',
      cardBg: 'rgba(255, 255, 255, 0.88)',
      cardBorder: '#EBE2D8',
      textPrimary: '#2E2721',
      textSecondary: '#6A5F54',
      accent: '#C2735C',
      accentBg: '#FAF2EE',
      accentBorder: '#E8C5B9',
      gold: '#BA9252',
      badgeBg: '#F5EFEB',
      badgeText: '#944D3A'
    },
    noche: {
      name: 'Noche Zen & Oro',
      bgStart: '#1F1B18',
      bgEnd: '#2D2620',
      cardBg: 'rgba(46, 39, 33, 0.88)',
      cardBorder: '#4A4036',
      textPrimary: '#FAF8F5',
      textSecondary: '#DED3C4',
      accent: '#E8C5B9',
      accentBg: '#3E342B',
      accentBorder: '#7B3F30',
      gold: '#DECCA2',
      badgeBg: '#3A312A',
      badgeText: '#DECCA2'
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
      badgeText: '#32483B'
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
      badgeText: '#944D3A'
    }
  };

  // Dibujar en canvas con diseño para Facebook
  const drawToCanvas = (canvas: HTMLCanvasElement, targetFormat: FacebookFormat, targetTheme: FacebookTheme) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions[targetFormat];
    canvas.width = width;
    canvas.height = height;

    const currentTheme = themeStyles[targetTheme];

    // 1. Fondo degradado
    const bgGradient = ctx.createLinearGradient(0, 0, width * 0.4, height);
    bgGradient.addColorStop(0, currentTheme.bgStart);
    bgGradient.addColorStop(1, currentTheme.bgEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Elementos ornamentales sutiles
    ctx.save();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width * 0.9, height * 0.15, targetFormat === 'horizontal' ? 220 : 260, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width * 0.1, height * 0.9, targetFormat === 'horizontal' ? 180 : 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Marco exterior con margen
    const margin = targetFormat === 'horizontal' ? 36 : 48;
    ctx.save();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    ctx.restore();

    // Helper para partir texto
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

    // Renderizado según formato
    if (targetFormat === 'horizontal') {
      // FORMATO HORIZONTAL 1200 x 630 (Especial para Facebook Feed / Open Graph)
      let cursorY = 90;

      // Encabezado
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸', width / 2, cursorY);
      cursorY += 40;

      // Badge
      const badgeText = `ALMANAQUE DE AMOR PROPIO · DÍA ${selectedDayNum}`;
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 44;
      const badgeHeight = 36;
      ctx.fillStyle = currentTheme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - badgeWidth / 2, cursorY - 22, badgeWidth, badgeHeight, 18);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = currentTheme.badgeText;
      ctx.fillText(badgeText, width / 2, cursorY + 2);
      cursorY += 50;

      // Título
      ctx.fillStyle = currentTheme.textPrimary;
      const titleFont = 'bold 44px "Cormorant Garamond", "Playfair Display", Georgia, serif';
      const titleLines = wrapText(currentDay.title, width - 240, titleFont);
      ctx.font = titleFont;
      titleLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, width / 2, cursorY);
        cursorY += 48;
      });

      // Línea dorada
      ctx.strokeStyle = currentTheme.gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 70, cursorY);
      ctx.lineTo(width / 2 + 70, cursorY);
      ctx.stroke();
      cursorY += 35;

      // Tarjeta Central del Mantra
      const cardW = width - 200;
      const cardH = 175;
      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - cardW / 2, cursorY, cardW, cardH, 20);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Contenido del Mantra
      ctx.textAlign = 'center';
      const mantraFont = 'italic 30px "Cormorant Garamond", "Playfair Display", Georgia, serif';
      const mantraLines = wrapText(`"${currentDay.mantra}"`, cardW - 80, mantraFont);
      ctx.font = mantraFont;
      ctx.fillStyle = currentTheme.accent;

      let mantraY = cursorY + (mantraLines.length > 1 ? 55 : 75);
      mantraLines.forEach((line) => {
        ctx.fillText(line, width / 2, mantraY);
        mantraY += 38;
      });

      // Técnica de Amor Propio y Autoestimas
      if (showHooponopono) {
        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        ctx.fillText("✨ Lo siento · Perdóname · Te amo · Gracias ✨", width / 2, cursorY + cardH - 24);
      }

      // Pie inferior
      cursorY += cardH + 35;
      if (showCallToAction) {
        ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        ctx.fillText("Respira profundo y comparte este mensaje de paz interior", width / 2, cursorY);
      }

      if (showUrlWatermark) {
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.accent;
        ctx.fillText("Almanaque de Amor Propio & Autoestima", width / 2, height - 52);
      }

    } else {
      // FORMATOS CUADRADO (1080x1080) E HISTORIA (1080x1920)
      let cursorY = targetFormat === 'story' ? 240 : 130;

      // 1. Flor
      ctx.font = '38px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸', width / 2, cursorY);
      cursorY += 45;

      // 2. Badge
      const badgeText = 'ALMANAQUE DE AMOR PROPIO · AUTOESTIMAS';
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
      cursorY += targetFormat === 'story' ? 85 : 65;

      // 3. Día
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.accent;
      ctx.fillText(`DÍA ${selectedDayNum}`, width / 2, cursorY);
      cursorY += targetFormat === 'story' ? 65 : 55;

      // 4. Título
      ctx.fillStyle = currentTheme.textPrimary;
      const titleFontSize = targetFormat === 'story' ? 54 : 46;
      const titleFont = `bold ${titleFontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
      const titleLines = wrapText(currentDay.title, width - 200, titleFont);
      ctx.font = titleFont;
      titleLines.forEach((line) => {
        ctx.fillText(line, width / 2, cursorY);
        cursorY += titleFontSize * 1.25;
      });

      cursorY += targetFormat === 'story' ? 40 : 30;

      // Divisor
      ctx.strokeStyle = currentTheme.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 80, cursorY);
      ctx.lineTo(width / 2 + 80, cursorY);
      ctx.stroke();
      cursorY += targetFormat === 'story' ? 70 : 50;

      // 5. Tarjeta Central del Mantra
      const cardMargin = 90;
      const cardWidth = width - cardMargin * 2;
      const mantraFontSize = targetFormat === 'story' ? 38 : 32;
      const mantraFont = `italic ${mantraFontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
      const mantraLines = wrapText(`"${currentDay.mantra}"`, cardWidth - 100, mantraFont);

      const mantraBlockHeight = (mantraLines.length * mantraFontSize * 1.35) + (showHooponopono ? 120 : 60);
      const cardTop = cursorY;

      ctx.fillStyle = currentTheme.cardBg;
      ctx.beginPath();
      ctx.roundRect(cardMargin, cardTop, cardWidth, mantraBlockHeight, 28);
      ctx.fill();
      ctx.strokeStyle = currentTheme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      let textY = cardTop + (targetFormat === 'story' ? 80 : 65);
      ctx.font = mantraFont;
      ctx.fillStyle = currentTheme.accent;
      mantraLines.forEach((line) => {
        ctx.fillText(line, width / 2, textY);
        textY += mantraFontSize * 1.35;
      });

      if (showHooponopono) {
        textY += 20;
        ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        ctx.fillText("✨ Lo siento · Perdóname · Te amo · Gracias ✨", width / 2, textY);
      }

      cursorY = cardTop + mantraBlockHeight + (targetFormat === 'story' ? 70 : 45);

      // Reflexión breve
      if (currentDay.content && currentDay.content[0] && targetFormat === 'story') {
        ctx.fillStyle = currentTheme.textPrimary;
        const reflectionFont = '24px "Plus Jakarta Sans", sans-serif';
        const reflectionLines = wrapText(currentDay.content[0].substring(0, 180) + '...', width - 240, reflectionFont);
        ctx.font = reflectionFont;
        reflectionLines.slice(0, 3).forEach(line => {
          ctx.fillText(line, width / 2, cursorY);
          cursorY += 36;
        });
        cursorY += 40;
      }

      // Llamado a la acción
      if (showCallToAction) {
        ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        ctx.fillText("Respira, confía, agradece y suelta", width / 2, cursorY);
        cursorY += 35;
      }

      // Pie
      if (showUrlWatermark) {
        const bottomY = height - (targetFormat === 'story' ? 140 : 80);
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.accent;
        ctx.fillText("Almanaque de Amor Propio & Autoestima", width / 2, bottomY);

        ctx.font = '16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = currentTheme.textSecondary;
        ctx.fillText("Transformación diaria con amor propio y autoestima", width / 2, bottomY + 30);
      }
    }
  };

  // Re-dibujar vista previa cuando cambien los parámetros
  useEffect(() => {
    if (isOpen && previewCanvasRef.current && activeTab === 'preview') {
      drawToCanvas(previewCanvasRef.current, format, theme);
    }
  }, [isOpen, selectedDayNum, format, theme, showHooponopono, showCallToAction, showUrlWatermark, activeTab]);

  // Obtener URL actual limpia para compartir
  const getShareUrl = () => {
    return getShareableUrl({ day: String(selectedDayNum), view: 'day' });
  };

  // Generar texto optimizado para Facebook
  const generateFacebookCaption = () => {
    const url = getShareUrl();
    return `🌸 Reflexión del Día ${selectedDayNum} · Almanaque de Amor Propio

"${currentDay.mantra}"

✨ ${currentDay.title}
${currentDay.mantraDescription ? `\n🌿 ${currentDay.mantraDescription}\n` : ''}
${currentDay.content && currentDay.content[0] ? `"${currentDay.content[0]}"\n` : ''}
🙏 Práctica Sagrada de Amor Propio:
"Lo siento, Perdóname, Te amo, Gracias. Limpia, limpia, limpia."

Respira profundo, abraza tu corazón y suelta todo aquello que no te dé paz.

👉 Abre aquí el Almanaque y acompáñame cada día:
${url}

#AmorPropio #Autoestima #PazInterior #Meditacion #ReflexionDelDia #SanacionEspiritual #Gratitud #Bienestar`;
  };

  // Copiar publicación al portapapeles
  const handleCopyCaption = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generateFacebookCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    }
  };

  // Copiar solo el enlace
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Descargar la Imagen en Ultra Calidad PNG
  const handleDownloadImage = () => {
    setIsGenerating(true);
    try {
      const offscreenCanvas = document.createElement('canvas');
      drawToCanvas(offscreenCanvas, format, theme);

      const link = document.createElement('a');
      link.download = `almanaque-dia-${selectedDayNum}-facebook-${format}.png`;
      link.href = offscreenCanvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al generar imagen para Facebook:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // COMPARTIR DIRECTO EN FACEBOOK (Diálogo oficial de compartir)
  const handleDirectFacebookShare = () => {
    const url = getShareUrl();
    const quote = `Día ${selectedDayNum} - "${currentDay.mantra}" · Almanaque de Amor Propio y Autoestima`;
    const shareDialogUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;

    // Abrir ventana emergente centrada
    const width = 640;
    const height = 480;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      shareDialogUrl,
      'facebook-share-dialog',
      `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
    );
  };

  // Compartir nativo (Web Share API con archivo de imagen adjunto)
  const handleNativeShare = async () => {
    const offscreenCanvas = document.createElement('canvas');
    drawToCanvas(offscreenCanvas, format, theme);

    offscreenCanvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `almanaque-dia-${selectedDayNum}-facebook.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Almanaque de Amor Propio - Día ${selectedDayNum}`,
            text: `Día ${selectedDayNum}: "${currentDay.mantra}" · Amor Propio`
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        } catch {
          // El usuario canceló
        }
      } else if (navigator.share) {
        try {
          await navigator.share({
            title: `Almanaque de Amor Propio - Día ${selectedDayNum}`,
            text: generateFacebookCaption(),
            url: getShareUrl()
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        } catch {}
      } else {
        // Fallback: descargar imagen y abrir Facebook
        handleDownloadImage();
        handleCopyCaption();
        window.open('https://www.facebook.com', '_blank');
      }
    }, 'image/png');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#FAF8F5] border border-stone-200 w-full max-w-5xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera distintiva de Facebook */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-200/90 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-xs">
              <Facebook className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 leading-tight">
                  Publicar y Compartir en Facebook
                </h3>
                <span className="text-[10px] bg-blue-50 text-[#1877F2] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-200">
                  Feed, Grupos & Historias
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Sube imágenes en alta resolución, comparte con un clic en tu muro o grupos y acompaña tus publicaciones con reflexiones conscientes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de pestañas */}
        <div className="px-6 border-b border-stone-200 bg-stone-50/70 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#1877F2] text-[#1877F2]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Generador de Imágenes y Post</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#1877F2] text-[#1877F2]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guía Paso a Paso para Facebook</span>
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'preview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Columna Izquierda: Vista Previa del Canvas */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-stone-100/70 border border-stone-200/80 rounded-2xl p-4 min-h-[380px] sm:min-h-[460px]">
                
                {/* Selector rápido de día */}
                <div className="w-full flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDayNum(prev => prev > 1 ? prev - 1 : 31)}
                      className="p-1.5 bg-white border border-stone-200 rounded-full hover:bg-stone-50 text-stone-700 transition-all cursor-pointer"
                      title="Día anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-stone-800">
                      Día {selectedDayNum} de 31
                    </span>
                    <button
                      onClick={() => setSelectedDayNum(prev => prev < 31 ? prev + 1 : 1)}
                      className="p-1.5 bg-white border border-stone-200 rounded-full hover:bg-stone-50 text-stone-700 transition-all cursor-pointer"
                      title="Día siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] text-stone-500 font-medium">
                    {dimensions[format].label}
                  </span>
                </div>

                {/* Canvas de Vista Previa */}
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <div className="relative max-h-[440px] max-w-full flex items-center justify-center shadow-lg rounded-xl overflow-hidden border border-stone-300">
                    <canvas 
                      ref={previewCanvasRef} 
                      className="max-h-[420px] max-w-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                <div className="w-full mt-3 flex items-center justify-between text-[11px] text-stone-500 px-2">
                  <span>Resolución: {dimensions[format].width} × {dimensions[format].height} px</span>
                  <span>{themeStyles[theme].name}</span>
                </div>
              </div>

              {/* Columna Derecha: Configuración y Acciones para Facebook */}
              <div className="lg:col-span-5 flex flex-col gap-4">

                {/* BOTÓN PRINCIPAL: Compartir Directo en Facebook */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                      <Facebook className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                        Compartir en tu Facebook con 1 Clic
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        Abre el diálogo oficial de Facebook para publicar en tu Muro o Grupos.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      onClick={handleDirectFacebookShare}
                      className="flex-1 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Compartir en Facebook</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Copiar enlace para compartir"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-stone-500" />}
                      <span>{copiedLink ? 'Copiado' : 'Copiar Enlace'}</span>
                    </button>
                  </div>
                </div>

                {/* Selección de Formato para Facebook */}
                <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-2xs">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block mb-2">
                    1. Formato de Imagen para Facebook
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['horizontal', 'square', 'story'] as FacebookFormat[]).map((fmt) => {
                      const Icon = dimensions[fmt].icon;
                      const isSelected = format === fmt;
                      return (
                        <button
                          key={fmt}
                          onClick={() => setFormat(fmt)}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border-[#1877F2] text-[#1877F2] font-bold shadow-2xs'
                              : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:bg-stone-100/60'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px] leading-tight">
                            {fmt === 'horizontal' ? 'Feed / Link' : fmt === 'square' ? 'Cuadrado' : 'Historia'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-2">
                    {dimensions[format].desc}
                  </p>
                </div>

                {/* Selección de Tema Visual */}
                <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-2xs">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block mb-2">
                    2. Estética y Paleta Zen
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['arena', 'noche', 'salvia', 'amanecer'] as FacebookTheme[]).map((th) => {
                      const isSelected = theme === th;
                      return (
                        <button
                          key={th}
                          onClick={() => setTheme(th)}
                          className={`px-3 py-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-2xs'
                              : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100/60'
                          }`}
                        >
                          <span>{themeStyles[th].name}</span>
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20" 
                            style={{ backgroundColor: themeStyles[th].accent }} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Opciones adicionales de diseño */}
                <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-2xs space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block mb-1">
                    3. Elementos en la Imagen
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showHooponopono}
                      onChange={(e) => setShowHooponopono(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Incluir frase de Amor Propio (Lo siento, Perdóname...)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showCallToAction}
                      onChange={(e) => setShowCallToAction(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Incluir frase reflexiva de calma</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showUrlWatermark}
                      onChange={(e) => setShowUrlWatermark(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Incluir firma del Almanaque de Amor Propio</span>
                  </label>
                </div>

                {/* Acciones de Descarga y Copia de Texto */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownloadImage}
                      disabled={isGenerating}
                      className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isGenerating ? 'Generando...' : 'Descargar Foto HD'}</span>
                    </button>
                    
                    <button
                      onClick={handleCopyCaption}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCaption ? '¡Texto Copiado!' : 'Copiar Texto Post'}</span>
                    </button>
                  </div>

                  {/* Compartir nativo en móviles o abrir Facebook */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleNativeShare}
                      className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Compartir directo a través del selector del dispositivo"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                      <span>{shareSuccess ? '¡Compartido!' : 'Compartir con App'}</span>
                    </button>
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Ir a Facebook"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                      <span>Abrir Facebook</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* PESTAÑA: GUÍA PASO A PASO PARA SUBIR Y COMPARTIR EN FACEBOOK */
            <div className="max-w-3xl mx-auto space-y-6 text-stone-700 text-xs sm:text-sm">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 text-[#1877F2]">
                  <Share2 className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Método 1: Compartir con el botón directo de Facebook (Recomendado)
                  </h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-stone-600 leading-relaxed">
                  <li>Haz clic en el botón azul <strong>"Compartir en Facebook"</strong> que encuentras en esta ventana o en la cabecera del almanaque.</li>
                  <li>Se abrirá la ventana oficial de Facebook para publicar.</li>
                  <li>Podrás elegir dónde compartirlo: en tu <strong>Feed de Noticias</strong>, en tu <strong>Historia</strong>, en un <strong>Grupo de Facebook</strong>, o en una <strong>Página que administras</strong>.</li>
                  <li>Facebook mostrará automáticamente una tarjeta visual con el título y la foto zen gracias a las etiquetas OpenGraph integradas.</li>
                  <li>Escribe tu reflexión o pega el texto sugerido y pulsa <strong>"Publicar en Facebook"</strong>.</li>
                </ol>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 text-amber-700">
                  <Download className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Método 2: Subir como Foto HD + Texto del Mantra (Máximo alcance)
                  </h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-stone-600 leading-relaxed">
                  <li>Elige el formato que prefieras: <strong>Post Feed (1200×630)</strong> o <strong>Post Cuadrado (1:1)</strong>.</li>
                  <li>Haz clic en <strong>"Descargar Foto HD"</strong>. La imagen se guardará en tu teléfono o computadora.</li>
                  <li>Haz clic en <strong>"Copiar Texto Post"</strong> para tener lista la reflexión con el mantra y los hashtags.</li>
                  <li>Abre Facebook, crea una nueva publicación, sube la foto descargada y pega el texto en la descripción. ¡El algoritmo de Facebook premia las fotos nítidas con texto reflexivo!</li>
                </ol>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-700">
                  <Users className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Método 3: Compartir en Grupos de Facebook
                  </h4>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Los grupos de Facebook dedicados a <em>"Autoestima"</em>, <em>"Amor Propio"</em>, <em>"Crecimiento Espiritual"</em> y <em>"Ley de Atracción"</em> adoran recibir mantras diarios. 
                  Al compartir en estos grupos, ayudas a muchas personas a encontrar un instante de paz y conectar con su amor interior.
                </p>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-600">
                  💡 <strong>Consejo:</strong> Usa el botón "Copiar Texto Post" y añade una nota personal diciendo cómo este mantra te ayudó en tu día antes de publicarlo en el grupo.
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 text-purple-700">
                  <Smartphone className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Método 4: Subir a Historias de Facebook (Facebook Stories)
                  </h4>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-stone-600 leading-relaxed">
                  <li>Selecciona el formato <strong>"Historia / Reels (9:16)"</strong> y descarga la imagen vertical.</li>
                  <li>En Facebook, pulsa en <em>"Crear historia"</em> y selecciona la foto descargada.</li>
                  <li>Puedes agregarle música relajante de la biblioteca de Facebook o stickers de respiración.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Barra inferior del modal con resumen del post */}
        <div className="px-6 py-3 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="truncate">
              Día {selectedDayNum}: <strong>{currentDay.title}</strong> &bull; "{currentDay.mantra}"
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCaption}
              className="text-stone-600 hover:text-stone-900 font-medium underline cursor-pointer"
            >
              {copiedCaption ? '✓ Texto copiado' : 'Copiar texto del post'}
            </button>
            <span>&bull;</span>
            <button
              onClick={handleDirectFacebookShare}
              className="text-[#1877F2] hover:text-blue-800 font-bold cursor-pointer"
            >
              Compartir ahora
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
