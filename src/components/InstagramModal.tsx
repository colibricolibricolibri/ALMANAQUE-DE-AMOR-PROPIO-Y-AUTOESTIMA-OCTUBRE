import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Instagram, 
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
  Bookmark
} from 'lucide-react';
import { DayContent } from '../../types';
import { DAYS_CONTENT } from '../../data';
import { getShareableUrl } from '../utils/urlHelper';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayContent;
  currentDayNum: number;
}

type InstagramFormat = 'story' | 'square' | 'portrait';
type InstagramTheme = 'arena' | 'noche' | 'salvia' | 'amanecer';

export const InstagramModal: React.FC<InstagramModalProps> = ({
  isOpen,
  onClose,
  currentDay: initialDay,
  currentDayNum: initialDayNum
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState(initialDayNum);
  const [format, setFormat] = useState<InstagramFormat>('story');
  const [theme, setTheme] = useState<InstagramTheme>('arena');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showHooponopono, setShowHooponopono] = useState(true);
  const [showHandle, setShowHandle] = useState(true);
  const [showCallToAction, setShowCallToAction] = useState(true);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sincronizar día inicial si cambia al abrir
  useEffect(() => {
    setSelectedDayNum(initialDayNum);
  }, [initialDayNum, isOpen]);

  const currentDay = DAYS_CONTENT[(selectedDayNum - 1) % DAYS_CONTENT.length] || initialDay;

  // Configuración de dimensiones según el formato oficial de Instagram
  const dimensions = {
    story: { width: 1080, height: 1920, label: 'Historia / Reel (9:16)', icon: Smartphone },
    square: { width: 1080, height: 1080, label: 'Post Cuadrado (1:1)', icon: Square },
    portrait: { width: 1080, height: 1350, label: 'Post Retrato (4:5)', icon: Maximize2 }
  };

  // Temas visuales alineados a la estética serena
  const themeStyles = {
    arena: {
      name: 'Arena Serena',
      bgStart: '#FAF8F5',
      bgEnd: '#F2E8DC',
      cardBg: 'rgba(255, 255, 255, 0.85)',
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
      cardBg: 'rgba(46, 39, 33, 0.85)',
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
      cardBg: 'rgba(255, 255, 255, 0.9)',
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
      cardBg: 'rgba(255, 255, 255, 0.9)',
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

  // Dibujar la imagen en canvas en alta resolución (1080px base)
  const drawToCanvas = (canvas: HTMLCanvasElement, targetFormat: InstagramFormat, targetTheme: InstagramTheme) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions[targetFormat];
    canvas.width = width;
    canvas.height = height;

    const currentTheme = themeStyles[targetTheme];

    // 1. Fondo con degradado suave
    const bgGradient = ctx.createLinearGradient(0, 0, width * 0.3, height);
    bgGradient.addColorStop(0, currentTheme.bgStart);
    bgGradient.addColorStop(1, currentTheme.bgEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Elementos ornamentales sutiles (círculos zen y marcos)
    ctx.save();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.15, width * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.88, width * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Marco exterior con margen
    const margin = 50;
    ctx.save();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    ctx.restore();

    // Función auxiliar para medir y partir texto
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

    let cursorY = targetFormat === 'story' ? 240 : targetFormat === 'portrait' ? 170 : 130;

    // 3. Encabezado de Identidad
    // Pequeño ícono de flor
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌸', width / 2, cursorY);
    cursorY += 45;

    // Badge Pill "ALMANAQUE DE AMOR PROPIO"
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

    // Número de día
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = currentTheme.accent;
    ctx.fillText(`DÍA ${selectedDayNum}`, width / 2, cursorY);
    cursorY += targetFormat === 'story' ? 65 : 55;

    // 4. Título Principal de la Afirmación
    ctx.fillStyle = currentTheme.textPrimary;
    const titleFontSize = targetFormat === 'story' ? 56 : targetFormat === 'portrait' ? 52 : 46;
    const titleFont = `bold ${titleFontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
    const titleLines = wrapText(currentDay.title, width - 200, titleFont);
    
    ctx.font = titleFont;
    titleLines.forEach((line) => {
      ctx.fillText(line, width / 2, cursorY);
      cursorY += titleFontSize * 1.25;
    });

    cursorY += targetFormat === 'story' ? 40 : 30;

    // Divisor decorativo
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
    const mantraFontSize = targetFormat === 'story' ? 40 : targetFormat === 'portrait' ? 36 : 32;
    const mantraFont = `italic ${mantraFontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
    const mantraLines = wrapText(`"${currentDay.mantra}"`, cardWidth - 100, mantraFont);

    // Medir altura de la tarjeta
    const mantraBlockHeight = (mantraLines.length * mantraFontSize * 1.35) + (currentDay.mantraDescription ? 120 : 60);
    const cardTop = cursorY;

    // Fondo tarjeta
    ctx.fillStyle = currentTheme.cardBg;
    ctx.beginPath();
    ctx.roundRect(cardMargin, cardTop, cardWidth, mantraBlockHeight, 32);
    ctx.fill();
    ctx.strokeStyle = currentTheme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Comillas decorativas
    ctx.font = '72px "Playfair Display", Georgia, serif';
    ctx.fillStyle = currentTheme.accent;
    ctx.fillText('“', cardMargin + 50, cardTop + 65);

    // Texto del Mantra
    ctx.font = mantraFont;
    ctx.fillStyle = currentTheme.textPrimary;
    let mantraY = cardTop + 75;
    mantraLines.forEach((line) => {
      ctx.fillText(line, width / 2, mantraY);
      mantraY += mantraFontSize * 1.35;
    });

    if (currentDay.mantraDescription) {
      ctx.font = 'italic 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.textSecondary;
      const descLines = wrapText(currentDay.mantraDescription, cardWidth - 120, 'italic 24px sans-serif');
      mantraY += 15;
      descLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, width / 2, mantraY);
        mantraY += 34;
      });
    }

    cursorY = cardTop + mantraBlockHeight + (targetFormat === 'story' ? 70 : 45);

    // 6. Frase Sagrada de Amor Propio
    if (showHooponopono) {
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.accent;
      ctx.fillText('MÉTODO DE AMOR PROPIO', width / 2, cursorY);
      cursorY += 36;

      ctx.font = 'bold italic 28px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = currentTheme.textPrimary;
      ctx.fillText('« Lo siento · Perdóname · Te amo · Gracias »', width / 2, cursorY);
      cursorY += targetFormat === 'story' ? 70 : 45;
    }

    // 7. Pie de Tarjeta / Call to Action
    const bottomY = height - margin - 35;

    if (showHandle) {
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.textPrimary;
      ctx.fillText('@almanaque.amorpropio', width / 2, bottomY - 35);
    }

    if (showCallToAction) {
      ctx.font = '20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = currentTheme.textSecondary;
      ctx.fillText('✨ Guarda esta afirmación y compártela en tus historias', width / 2, bottomY);
    }
  };

  // Re-dibujar en el canvas de previsualización al cambiar cualquier parámetro
  useEffect(() => {
    if (!isOpen) return;
    const canvas = previewCanvasRef.current;
    if (canvas) {
      drawToCanvas(canvas, format, theme);
    }
  }, [isOpen, selectedDayNum, format, theme, showHooponopono, showHandle, showCallToAction]);

  // Generar Caption de Instagram listo para copiar
  const generateInstagramCaption = () => {
    return `🌸 DÍA ${selectedDayNum} · ${currentDay.title}

"${currentDay.mantra}"

${currentDay.mantraDescription ? `🌿 ${currentDay.mantraDescription}\n\n` : ''}✨ Recordatorio de Amor Propio para hoy:
« Lo siento · Perdóname · Te amo · Gracias »

🌬️ Pausa consciente:
Toma tres respiraciones profundas, siente la paz en tu corazón y repite esta afirmación durante tu jornada. Si esta reflexión resuena contigo, guárdala para volver a ella cuando la necesites.

📲 Accede al Almanaque interactivo completo con música en 432 Hz y diario de sanación en el enlace de nuestra biografía.

.
.
#AmorPropio #Autoestima #PazInterior #AfirmacionesDiarias #Espiritualidad #SanacionInterior #PensamientoPositivo #CrecimientoPersonal #Almanaque2027 #MindfulnessEnEspañol`;
  };

  // Copiar Caption al Portapapeles
  const handleCopyCaption = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generateInstagramCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    }
  };

  // Descargar la Imagen en Ultra Calidad PNG (1080px de ancho nativo)
  const handleDownloadImage = () => {
    setIsGenerating(true);
    try {
      const offscreenCanvas = document.createElement('canvas');
      drawToCanvas(offscreenCanvas, format, theme);

      const link = document.createElement('a');
      link.download = `almanaque-dia-${selectedDayNum}-instagram-${format}.png`;
      link.href = offscreenCanvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al generar imagen para Instagram:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Compartir directamente usando Web Share API (abre Instagram / selector nativo en móviles)
  const handleNativeShare = async () => {
    const offscreenCanvas = document.createElement('canvas');
    drawToCanvas(offscreenCanvas, format, theme);

    offscreenCanvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `almanaque-dia-${selectedDayNum}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Almanaque de Amor Propio - Día ${selectedDayNum}`,
            text: `Día ${selectedDayNum}: "${currentDay.mantra}" · Amor Propio`
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        } catch (err) {
          // Si el usuario canceló el diálogo no hacemos nada
        }
      } else if (navigator.share) {
        try {
          await navigator.share({
            title: `Almanaque de Amor Propio - Día ${selectedDayNum}`,
            text: generateInstagramCaption(),
            url: getShareableUrl({ day: String(selectedDayNum), view: 'day' })
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        } catch {}
      } else {
        // Fallback a descarga directa y copia de texto
        handleDownloadImage();
        handleCopyCaption();
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
        {/* Cabecera con degradado distintivo de Instagram */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-200/90 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 leading-tight">
                  Publicar en Instagram
                </h3>
                <span className="text-[10px] bg-gradient-to-r from-rose-100 to-amber-100 text-rose-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-200">
                  Historias & Feed
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Genera imágenes HD para Stories, Carruseles y Feeds con el texto, mantras y estética listos para compartir.
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

        {/* Contenido Principal en Dos Columnas: Configuración a la izquierda, Previsualización a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Panel Izquierdo de Controles (5 columnas en desktop) */}
          <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-stone-200/80 space-y-5 bg-white/50">
            
            {/* 1. Selector de Día */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  1. Seleccionar Día del Almanaque
                </label>
                <span className="text-xs font-semibold text-terracotta-700">
                  Día {selectedDayNum} de 365
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDayNum((prev) => Math.max(1, prev - 1))}
                  disabled={selectedDayNum <= 1}
                  className="p-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 rounded-xl transition-colors cursor-pointer"
                  title="Día anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-center">
                  <span className="text-xs font-bold text-stone-800 truncate block">
                    "{currentDay.title}"
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDayNum((prev) => Math.min(365, prev + 1))}
                  disabled={selectedDayNum >= 365}
                  className="p-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 rounded-xl transition-colors cursor-pointer"
                  title="Día siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Selector de Formato de Instagram */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                2. Formato de Publicación
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['story', 'square', 'portrait'] as InstagramFormat[]).map((fmt) => {
                  const Icon = dimensions[fmt].icon;
                  const isSelected = format === fmt;
                  return (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-stone-500'}`} />
                      <span className="text-[11px] font-bold capitalize">
                        {fmt === 'story' ? 'Historia (9:16)' : fmt === 'square' ? 'Cuadrado (1:1)' : 'Retrato (4:5)'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Selector de Estilo / Tema Zen */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-500" />
                <span>3. Estilo Visual</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['arena', 'noche', 'salvia', 'amanecer'] as InstagramTheme[]).map((thKey) => {
                  const th = themeStyles[thKey];
                  const isSelected = theme === thKey;
                  return (
                    <button
                      key={thKey}
                      onClick={() => setTheme(thKey)}
                      className={`p-2.5 rounded-2xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-xs'
                          : 'bg-stone-50 hover:bg-white border-stone-200'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs shrink-0" 
                        style={{ background: `linear-gradient(135deg, ${th.bgStart}, ${th.bgEnd})` }}
                      />
                      <span className="text-xs font-semibold text-stone-800">
                        {th.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Elementos a Incluir */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Opciones del Diseño:
              </span>
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showHooponopono}
                  onChange={(e) => setShowHooponopono(e.target.checked)}
                  className="rounded text-terracotta-600 focus:ring-0"
                />
                <span>Incluir Frase Sagrada de Amor Propio</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showHandle}
                  onChange={(e) => setShowHandle(e.target.checked)}
                  className="rounded text-terracotta-600 focus:ring-0"
                />
                <span>Mostrar @almanaque.amorpropio</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showCallToAction}
                  onChange={(e) => setShowCallToAction(e.target.checked)}
                  className="rounded text-terracotta-600 focus:ring-0"
                />
                <span>Texto de pie ("Guarda y comparte")</span>
              </label>
            </div>

            {/* 5. Pie de Foto / Caption con Hashtags para Instagram */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                  <span>Pie de foto & Hashtags</span>
                </span>
                <button
                  onClick={handleCopyCaption}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    copiedCaption 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={generateInstagramCaption()}
                className="w-full h-24 text-[11px] font-sans p-3 bg-white border border-stone-200 rounded-xl text-stone-600 focus:outline-none resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Panel Derecho de Previsualización en Vivo de Instagram (7 columnas en desktop) */}
          <div className="lg:col-span-7 p-5 sm:p-6 bg-stone-100/70 flex flex-col items-center justify-center">
            
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 px-1 text-xs text-stone-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-stone-600" />
                  <span>Previsualización en Instagram</span>
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-stone-200 font-mono">
                  {dimensions[format].width} x {dimensions[format].height} px (HD)
                </span>
              </div>

              {/* Simulación del marco de Instagram en móvil */}
              <div className="w-full bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden flex flex-col">
                
                {/* Barra superior estilo Instagram */}
                <div className="px-3.5 py-2.5 border-b border-stone-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px]">
                        🌸
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-none">
                        almanaque.amorpropio
                      </span>
                      <span className="text-[9px] text-stone-400 leading-none">
                        Amor Propio & Paz Interior
                      </span>
                    </div>
                  </div>
                  <span className="text-stone-400 text-xs font-bold">•••</span>
                </div>

                {/* Canvas donde se renderiza el diseño gráfico del día */}
                <div className="p-3 bg-stone-50 flex items-center justify-center overflow-hidden">
                  <canvas 
                    ref={previewCanvasRef} 
                    className={`max-w-full h-auto rounded-2xl shadow-sm border border-stone-200 transition-all ${
                      format === 'story' ? 'max-h-[380px] aspect-[9/16]' : format === 'portrait' ? 'max-h-[380px] aspect-[4/5]' : 'max-h-[360px] aspect-square'
                    }`}
                  />
                </div>

                {/* Barra inferior simulada de interacciones */}
                <div className="px-4 py-2.5 bg-white border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <Share2 className="w-4 h-4 text-stone-600" />
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">
                    100% optimizado para tu audiencia
                  </span>
                </div>

              </div>

              {/* Guía práctica para publicar en Instagram */}
              <div className="mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-stone-700 w-full flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Tip para Historias:</strong> Al subir la imagen a tus Stories de Instagram, usa el sticker <em>"Enlace"</em> para poner el link a tu Almanaque y agrega música relajante (ej: 432 Hz).
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Pie de Acción con Descarga y Compartir */}
        <div className="px-5 sm:px-7 py-4 border-t border-stone-200 bg-white/95 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Formato activo:</span>
            <span className="font-bold text-stone-800">{dimensions[format].label}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              onClick={handleNativeShare}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir diálogo de compartir nativo o compartir directo en Instagram"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{shareSuccess ? '¡Compartido!' : 'Compartir en Instagram'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-700 hover:via-pink-700 hover:to-amber-700 text-white rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generando imagen...' : 'Descargar Imagen HD'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
