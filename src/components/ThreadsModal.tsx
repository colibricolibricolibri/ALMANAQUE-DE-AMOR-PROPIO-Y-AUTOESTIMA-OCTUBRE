import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Square, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Repeat,
  Send,
  Download,
  Info
} from 'lucide-react';
import { DayContent } from '../../types';
import { DAYS_CONTENT } from '../../data';

interface ThreadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayContent;
  currentDayNum: number;
}

type ThreadsFormat = 'thread' | 'single' | 'affirmation';
type ThreadsTheme = 'arena' | 'noche' | 'salvia';

export const ThreadsModal: React.FC<ThreadsModalProps> = ({
  isOpen,
  onClose,
  currentDay: initialDay,
  currentDayNum: initialDayNum
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState(initialDayNum);
  const [format, setFormat] = useState<ThreadsFormat>('thread');
  const [theme, setTheme] = useState<ThreadsTheme>('arena');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setSelectedDayNum(initialDayNum);
  }, [initialDayNum, isOpen]);

  if (!isOpen) return null;

  const currentDay = DAYS_CONTENT[(selectedDayNum - 1) % DAYS_CONTENT.length] || initialDay;

  // Generación de textos para hilos de Threads
  const threadParts = [
    // Parte 1: Introducción y palabra gatillo
    `🌱 Día ${selectedDayNum} de 21 · ${currentDay.title}\n\n"Este es un borrador de 21 días, basado en mi propia experiencia. Existe un lugar en donde llega la calma y reina el amor puro. Y ese lugar está en tu interior."\n\nHoy deseo desde mi YO SOY YO recordarte que tu paz no es negociable. ✨\n\n🧵 Abro hilo con la práctica de hoy 👇`,
    
    // Parte 2: El mensaje de fondo y la transmutación
    `🕊️ Reflexión de hoy: ${currentDay.title}\n\n${currentDay.content[0] || 'Abraza tu presente con gratitud.'}\n\nCuando sientas que la mente se acelera, respira en 4 tiempos y di para tus adentros: "Lo siento, Perdóname, Te amo, Gracias". Transmuta cualquier dolor en aprendizaje amoroso. 🌸`,

    // Parte 3: Cierre, afirmación y llamado
    `✨ Afirmación para hoy:\n"Merezco paz, merezco descanso y elijo amarme sin condiciones."\n\n¿Qué palabra gatillo te ayuda a volver a tu centro cuando lo necesitas? Te leo en los comentarios 💬🤍\n\n#AmorPropio #YoSoyYo #PazInterior #Autoestima #Almanaque2027 #Calma #Sanacion`
  ];

  const singlePostText = `🌱 Día ${selectedDayNum} · ${currentDay.title}\n\n"Existe un lugar en donde llega la calma y reina el amor puro. Y ese lugar está en tu interior."\n\nHoy desde mi YO SOY YO abrazo mi paz y transmuto cada pensamiento en amor propio.\n\nPalabra gatillo: ${currentDay.title} ✨\n\n#AmorPropio #YoSoyYo #PazInterior #Autoestima`;

  const affirmationOnlyText = `✨ AFIRMACIÓN DEL DÍA ${selectedDayNum} ✨\n\n"Hoy elijo la calma sobre la prisa, el amor sobre la duda, y reconozco el valor sagrado de mi presencia."\n\nYO SOY YO. 🕊️🤍\n\n#AmorPropio #Paz #Autoestima`;

  const getActiveTextToCopy = () => {
    if (format === 'single') return singlePostText;
    if (format === 'affirmation') return affirmationOnlyText;
    return threadParts.join('\n\n---\n\n');
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2200);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2200);
    }
  };

  const openThreadsIntent = (textToShare: string) => {
    const encoded = encodeURIComponent(textToShare);
    const url = `https://www.threads.net/intent/post?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Generador de imagen para Threads
  const downloadCardImage = () => {
    setIsGenerating(true);
    const canvas = previewCanvasRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Fondo según tema
    if (theme === 'noche') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1E1915');
      grad.addColorStop(1, '#2E2721');
      ctx.fillStyle = grad;
    } else if (theme === 'salvia') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#EBF1EB');
      grad.addColorStop(1, '#DFE9DE');
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#FAF8F5');
      grad.addColorStop(1, '#F3ECE3');
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);

    // Marco sutil
    ctx.strokeStyle = theme === 'noche' ? 'rgba(255,255,255,0.1)' : 'rgba(194, 115, 92, 0.2)';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Tarjeta central blanca / oscura
    ctx.fillStyle = theme === 'noche' ? 'rgba(46, 39, 33, 0.85)' : 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.roundRect(80, 80, width - 160, height - 160, 40);
    ctx.fill();

    // Textos
    const textColor = theme === 'noche' ? '#FAF8F5' : '#2E2721';
    const accentColor = theme === 'noche' ? '#E8C5B9' : '#C2735C';

    ctx.textAlign = 'center';

    // Encabezado
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`ALMANAQUE DE AMOR PROPIO · DÍA ${selectedDayNum}`, width / 2, 170);

    // Título palabra gatillo
    ctx.fillStyle = textColor;
    ctx.font = 'bold 54px Georgia, serif';
    ctx.fillText(currentDay.title.toUpperCase(), width / 2, 250);

    // Cita central
    ctx.font = 'italic 34px Georgia, serif';
    ctx.fillStyle = theme === 'noche' ? '#EAE3D9' : '#5A4E43';
    const quote = `"Existe un lugar en donde llega la calma y reina el amor puro."`;
    ctx.fillText(quote, width / 2, 360);

    // Reflexión
    ctx.font = '28px Georgia, serif';
    ctx.fillStyle = textColor;
    const bodyText = currentDay.content[0] || 'Hoy elijo volver a mí y abrazar mi presente con infinita serenidad.';
    
    // Auto-wrap para el texto del día
    const words = bodyText.split(' ');
    let line = '';
    let y = 480;
    const maxWidth = 800;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 46;
        if (y > 700) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Mantra inferior
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText('YO SOY YO', width / 2, 850);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = theme === 'noche' ? '#B8AEA3' : '#8A7D71';
    ctx.fillText('Threads · @amorpropio · Amor Propio y Autoestimas', width / 2, 910);

    // Descargar canvas
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Threads_Dia_${selectedDayNum}_${currentDay.title.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Contenedor principal modal */}
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl sm:rounded-[36px] border border-stone-200/90 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-stone-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-sm">
              {/* Icono de Threads estilizado */}
              <span className="font-serif font-black text-lg leading-none tracking-tight">@</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  Publicar en Threads
                </h3>
                <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded-full font-bold">
                  @teread
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Micro-hilos de amor propio, calma y transmutación emocional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVEGADOR DE DÍAS (DÍA 1 A 21) */}
        <div className="px-5 sm:px-7 py-3 bg-stone-100/70 border-b border-stone-200/60 flex items-center justify-between shrink-0 text-xs">
          <button
            onClick={() => setSelectedDayNum(prev => prev > 1 ? prev - 1 : 21)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-200/80 text-stone-700 font-semibold border border-stone-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Día Anterior</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-widest block">
              Día {selectedDayNum} de 21
            </span>
            <span className="font-serif font-bold text-stone-900 text-sm sm:text-base">
              {currentDay.title}
            </span>
          </div>

          <button
            onClick={() => setSelectedDayNum(prev => prev < 21 ? prev + 1 : 1)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-200/80 text-stone-700 font-semibold border border-stone-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <span className="hidden sm:inline">Día Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CUERPO PRINCIPAL CON SCROLL */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
          
          {/* SELECTOR DE FORMATO */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-2">
              Formato:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFormat('thread')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  format === 'thread'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Hilo de 3 partes
              </button>
              <button
                onClick={() => setFormat('single')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  format === 'single'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Post Único
              </button>
              <button
                onClick={() => setFormat('affirmation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  format === 'affirmation'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Afirmación
              </button>
            </div>
          </div>

          {/* VISTA PREVIA ESTILO THREADS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Vista Previa en Threads
              </span>
              <button
                onClick={() => copyToClipboard(getActiveTextToCopy())}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-full border border-stone-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado con amor!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>Copiar Todo</span>
                  </>
                )}
              </button>
            </div>

            {/* Muestra según el formato seleccionado */}
            {format === 'thread' ? (
              <div className="space-y-4">
                {threadParts.map((partText, idx) => (
                  <div key={idx} className="relative pl-8 pb-4">
                    {/* Línea conectora de hilo */}
                    {idx < threadParts.length - 1 && (
                      <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-stone-200" />
                    )}

                    {/* Avatar circular */}
                    <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/70 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed space-y-3">
                      <div>{partText}</div>
                      
                      <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-stone-500">
                        <div className="flex items-center gap-4 text-stone-400">
                          <Heart className="w-3.5 h-3.5 hover:text-rose-500 transition-colors" />
                          <MessageCircle className="w-3.5 h-3.5 hover:text-stone-700 transition-colors" />
                          <Repeat className="w-3.5 h-3.5 hover:text-emerald-600 transition-colors" />
                          <Send className="w-3.5 h-3.5 hover:text-stone-700 transition-colors" />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(partText, idx)}
                            className="text-[11px] font-semibold text-terracotta-700 hover:text-terracotta-900 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar parte {idx + 1}</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => openThreadsIntent(partText)}
                            className="text-[11px] font-bold text-stone-800 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Publicar</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : format === 'single' ? (
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/70 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed space-y-4">
                <div>{singlePostText}</div>
                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-stone-500">
                  <div className="flex items-center gap-4 text-stone-400">
                    <Heart className="w-4 h-4 hover:text-rose-500 transition-colors" />
                    <MessageCircle className="w-4 h-4 hover:text-stone-700 transition-colors" />
                    <Repeat className="w-4 h-4 hover:text-emerald-600 transition-colors" />
                  </div>
                  <button
                    onClick={() => openThreadsIntent(singlePostText)}
                    className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Abrir y Publicar en Threads</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/70 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed space-y-4">
                <div className="font-serif italic text-sm sm:text-base text-terracotta-800 border-l-4 border-terracotta-500 pl-4 py-1">
                  {affirmationOnlyText}
                </div>
                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-stone-500">
                  <div className="flex items-center gap-4 text-stone-400">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </div>
                  <button
                    onClick={() => openThreadsIntent(affirmationOnlyText)}
                    className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Publicar Afirmación</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* GENERADOR DE ARTE PARA THREADS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                  Imagen Oficial para Adjuntar en Threads
                </h4>
                <p className="text-xs text-stone-500">
                  Formato cuadrado 1080x1080 con estética zen de alta resolución
                </p>
              </div>

              {/* Selector de tema */}
              <div className="flex items-center gap-1.5">
                {(['arena', 'noche', 'salvia'] as ThreadsTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer capitalize ${
                      theme === t
                        ? 'bg-terracotta-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                Incluye la frase de amor propio, palabra gatillo y autoría sagrada
              </span>

              <button
                onClick={downloadCardImage}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generando...' : 'Descargar Tarjeta PNG'}</span>
              </button>
            </div>

            {/* Canvas oculto para render */}
            <canvas ref={previewCanvasRef} className="hidden" />
          </div>

        </div>

        {/* PIE DE PÁGINA MODAL */}
        <div className="px-5 sm:px-7 py-4 bg-stone-100/80 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-stone-500 text-center sm:text-left">
            🤍 "Existe un lugar en donde llega la calma y reina el amor puro."
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openThreadsIntent(getActiveTextToCopy())}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Threads Web / App</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
