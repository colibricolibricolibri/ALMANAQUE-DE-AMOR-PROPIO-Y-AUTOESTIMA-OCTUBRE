import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Globe, 
  ExternalLink, 
  Code, 
  Eye, 
  Layout, 
  Sliders, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  HelpCircle,
  Share2,
  FileText,
  BookmarkCheck
} from 'lucide-react';
import { DayContent } from '../../types';
import { getCleanAppUrl } from '../utils/urlHelper';

interface BloggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayContent;
  currentDayNum: number;
}

export const BloggerModal: React.FC<BloggerModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  currentDayNum
}) => {
  const [activeTab, setActiveTab] = useState<'responsive-embed' | 'sidebar-widget' | 'editorial-post' | 'preview'>('responsive-embed');
  const [embedHeight, setEmbedHeight] = useState<'850' | '750' | '1000' | '100vh'>('850');
  const [initialView, setInitialView] = useState<'intro' | 'day' | 'calendar'>('intro');
  const [includeFullscreenButton, setIncludeFullscreenButton] = useState(true);
  const [appUrl, setAppUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Tomamos la URL limpia sin tokens de entorno ni parámetros de iframe
      const clean = getCleanAppUrl(window.location.href);
      const url = new URL(clean);
      url.searchParams.delete('embed');
      url.searchParams.delete('blogger');
      setAppUrl(url.toString());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetUrl = () => {
    try {
      const base = new URL(getCleanAppUrl(appUrl || (typeof window !== 'undefined' ? window.location.href : 'https://almanaque-amor-propio.web.app')));
      base.searchParams.set('embed', 'true');
      if (initialView === 'day') {
        base.searchParams.set('view', 'day');
      } else if (initialView === 'calendar') {
        base.searchParams.set('view', 'calendar');
      }
      return base.toString();
    } catch {
      return `${appUrl || 'https://almanaque-amor-propio.web.app'}?embed=true`;
    }
  };

  // 1. Código Embebido Responsivo para Entradas o Páginas de Blogger
  const generateResponsiveEmbedCode = () => {
    const finalUrl = targetUrl();
    const heightVal = embedHeight === '100vh' ? '92vh' : `${embedHeight}px`;

    return `<!-- ========================================================
     ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA - WIDGET PARA BLOGGER
     Pega este código en Blogger: Vista HTML (<>) de tu Entrada o Página
     ======================================================== -->
<div class="almanaque-blogger-container" style="position: relative; width: 100%; max-width: 100%; margin: 24px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  ${includeFullscreenButton ? `
  <!-- Barra superior elegante con enlace a pantalla completa -->
  <div style="display: flex; justify-content: space-between; align-items: center; background: #F5EFEB; border: 1px solid #EBE2D8; padding: 10px 18px; border-radius: 14px 14px 0 0; color: #4A4036; font-size: 13px; font-weight: 600;">
    <span style="display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 8px; height: 8px; background: #C2735C; border-radius: 50%;"></span>
      🌸 <strong>Almanaque de Amor Propio</strong> &bull; Reflexión & Paz
    </span>
    <a href="${appUrl || finalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; color: #944D3A; text-decoration: none; font-size: 12px; background: #ffffff; padding: 4px 12px; border-radius: 20px; border: 1px solid #DC9F8C; transition: all 0.2s ease;">
      Abrir en pantalla completa ↗
    </a>
  </div>` : ''}

  <!-- Marco interactivo con altura optimizada para lectura en blog -->
  <div style="position: relative; width: 100%; height: ${heightVal}; min-height: 600px; background: #FAF8F5; ${includeFullscreenButton ? 'border-radius: 0 0 16px 16px;' : 'border-radius: 16px;'} overflow: hidden; box-shadow: 0 10px 30px rgba(46, 39, 33, 0.08); border: 1px solid #EBE2D8;">
    <iframe 
      src="${finalUrl}" 
      title="Almanaque de Amor Propio y Autoestima"
      style="width: 100%; height: 100%; border: none; display: block;" 
      allow="autoplay; camera; clipboard-write"
      loading="lazy">
    </iframe>
  </div>

  <!-- Pie explicativo opcional para los lectores de tu Blog -->
  <div style="text-align: center; margin-top: 10px; font-size: 12px; color: #887b70;">
    Meditación diaria, amor propio y afirmaciones de luz. Puedes interactuar libremente dentro del almanaque.
  </div>
</div>`;
  };

  // 2. Widget Compacto para la Barra Lateral / Gadget de Blogger (HTML/JavaScript)
  const generateSidebarWidgetCode = () => {
    return `<!-- WIDGET LATERAL PARA BLOGGER (Diseño > Añadir Gadget > HTML/JavaScript) -->
<div style="background: linear-gradient(145deg, #FAF8F5 0%, #F5EFEB 100%); border: 1px solid #EBE2D8; border-radius: 20px; padding: 20px; text-align: center; color: #2E2721; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 6px 18px rgba(0,0,0,0.04); margin-bottom: 20px;">
  <div style="font-size: 28px; margin-bottom: 8px;">🌸</div>
  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #944D3A; font-weight: bold; margin-bottom: 6px;">
    Afirmación de Hoy &bull; Día ${currentDayNum}
  </div>
  <h4 style="font-size: 16px; font-weight: 700; color: #2E2721; margin: 0 0 10px 0; line-height: 1.3;">
    "${currentDay.title}"
  </h4>
  <p style="font-size: 13px; color: #5A5046; font-style: italic; margin: 0 0 14px 0; line-height: 1.4;">
    "${currentDay.mantra}"
  </p>
  <div style="font-size: 11px; color: #8EAF97; font-weight: 600; margin-bottom: 16px;">
    🌿 Amor Propio: Lo siento, perdóname, te amo, gracias
  </div>
  <a href="${appUrl || 'https://almanaque-amor-propio.web.app'}" target="_blank" rel="noopener noreferrer" style="display: block; background: #C2735C; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 50px; font-size: 12px; font-weight: bold; box-shadow: 0 4px 12px rgba(194, 115, 92, 0.3); transition: background 0.2s ease;">
    ✨ Abrir Almanaque Interactivo
  </a>
</div>`;
  };

  // 3. Plantilla de Entrada Editorial Lista con Contenido + Iframe para Blogger
  const generateEditorialPostCode = () => {
    return `<!-- TITULO SUGERIDO PARA BLOGGER:
     Almanaque de Amor Propio: Afirmación Diaria, Amor Propio y Autoestimas
-->

<p style="font-size: 16px; line-height: 1.8; color: #2E2721; margin-bottom: 18px;">
  Hoy te invito a tomar una pausa y regalarte un instante de profunda calma interior. El <strong>Almanaque de Amor Propio y Autoestima</strong> es un espacio digital diseñado para acompañarte día a día con el método de amor propio y autoestimas, afirmaciones conscientes y frecuencias de paz.
</p>

<blockquote style="background: #F5EFEB; border-left: 4px solid #C2735C; padding: 16px 20px; margin: 24px 0; border-radius: 0 12px 12px 0; font-size: 15px; font-style: italic; color: #4A4036;">
  <strong>Reflexión para hoy (Día ${currentDayNum}):</strong> "${currentDay.mantraDescription || currentDay.mantra}"
  <div style="margin-top: 8px; font-size: 13px; font-style: normal; color: #944D3A; font-weight: 600;">
    ✨ Amor Propio: <em>Lo siento, perdóname, te amo, gracias.</em>
  </div>
</blockquote>

<p style="font-size: 15px; line-height: 1.7; color: #4A4036; margin-bottom: 20px;">
  Puedes navegar los días del mes, escuchar música zen en 432 Hz, realizar respiración consciente y registrar tus pensamientos en el diario íntimo directamente a continuación:
</p>

${generateResponsiveEmbedCode()}

<p style="font-size: 14px; color: #6e6459; text-align: center; margin-top: 24px;">
  Etiquetas sugeridas: <em>#AmorPropio, #Autoestimas, #PazInterior, #Almanaque2027</em>
</p>`;
  };

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#FAF8F5] border border-stone-200 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-xs">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 leading-tight">
                  Publicar en Blogger
                </h3>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Blogspot & Web
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Convierte y publica el Almanaque en cualquier entrada, página estática o barra lateral de Blogger.
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

        {/* Pestañas de opciones de publicación */}
        <div className="flex border-b border-stone-200/80 bg-stone-50/70 px-4 sm:px-6 overflow-x-auto gap-2 py-2">
          <button
            onClick={() => setActiveTab('responsive-embed')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'responsive-embed'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Code className="w-4 h-4 text-amber-400" />
            <span>1. Entrada / Página (Iframe Responsivo)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('sidebar-widget')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'sidebar-widget'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Layout className="w-4 h-4 text-emerald-400" />
            <span>2. Gadget Lateral (Barra de Blogger)</span>
          </button>

          <button
            onClick={() => setActiveTab('editorial-post')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'editorial-post'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-rose-400" />
            <span>3. Entrada Editorial Completa</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>4. Vista Previa en Blogger</span>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">

          {/* Guía rápida de 4 pasos */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50/60 border border-orange-200/80 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <BookmarkCheck className="w-4 h-4 text-orange-700" />
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                Guía Rápida: Cómo publicarlo en Blogger en 1 minuto
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] sm:text-xs text-stone-700">
              <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200/40">
                <span className="font-bold text-orange-700">1. En Blogger:</span> Crea una <em>Nueva Entrada</em> o ve a <em>Páginas &gt; Nueva Página</em>.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200/40">
                <span className="font-bold text-orange-700">2. Cambia a HTML:</span> Haz clic en el ícono del lápiz y elige <strong>"Vista HTML (&lt;&gt;)"</strong>.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200/40">
                <span className="font-bold text-orange-700">3. Pega el código:</span> Haz clic abajo en <strong>"Copiar Código HTML"</strong> y pégalo.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200/40">
                <span className="font-bold text-orange-700">4. ¡Publica!:</span> Haz clic en <strong>Publicar</strong>. Tus lectores lo verán interactivo.
              </div>
            </div>
          </div>

          {/* Opciones de personalización */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
                Personalizar Integración para tu Blog
              </span>
              <span className="text-[11px] text-stone-500">
                URL activa de tu aplicación lista para incrustar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  URL de la Web / Aplicación:
                </label>
                <input
                  type="text"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="https://tu-almanaque.run.app"
                  className="w-full text-xs font-mono px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-terracotta-500 text-stone-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Altura del marco en Blogger:
                </label>
                <select
                  value={embedHeight}
                  onChange={(e) => setEmbedHeight(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-terracotta-500 text-stone-800 font-medium"
                >
                  <option value="750">750px (Compacto para blogs pequeños)</option>
                  <option value="850">850px (Recomendado para la mayoría)</option>
                  <option value="1000">1000px (Espacioso y editorial)</option>
                  <option value="100vh">Pantalla Completa Relativa (92vh)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Vista Inicial al abrir en Blogger:
                </label>
                <select
                  value={initialView}
                  onChange={(e) => setInitialView(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-terracotta-500 text-stone-800 font-medium"
                >
                  <option value="intro">Tablero Zen Nórdico (Inicio)</option>
                  <option value="day">Día de Hoy Directo (Afirmación & Mantra)</option>
                  <option value="calendar">Calendario Anual Dinámico Completo</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={includeFullscreenButton}
                  onChange={(e) => setIncludeFullscreenButton(e.target.checked)}
                  className="w-4 h-4 rounded text-terracotta-600 focus:ring-0"
                />
                <span>Incluir barra superior con botón "Abrir en pantalla completa ↗"</span>
              </label>
            </div>
          </div>

          {/* TAB 1: Iframe Responsivo */}
          {activeTab === 'responsive-embed' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Código HTML para Entrada o Página de Blogger
                  </h4>
                  <p className="text-xs text-stone-500">
                    Inserta este código en la <strong>Vista HTML (&lt;&gt;)</strong> de Blogger para que el Almanaque se vea en tu blog de forma fluida y responsiva.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(generateResponsiveEmbedCode(), 'responsive')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedKey === 'responsive'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-xs'
                  }`}
                >
                  {copiedKey === 'responsive' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código HTML</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-stone-900 text-stone-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-64 border border-stone-800 leading-relaxed">
                  {generateResponsiveEmbedCode()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Gadget Barra Lateral */}
          {activeTab === 'sidebar-widget' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Código para Gadget de Barra Lateral de Blogger
                  </h4>
                  <p className="text-xs text-stone-500">
                    Ve a <strong>Blogger &gt; Diseño &gt; Añadir un Gadget &gt; HTML/JavaScript</strong> y pega este código para mostrar la afirmación del día en la columna lateral.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(generateSidebarWidgetCode(), 'sidebar')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedKey === 'sidebar'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-xs'
                  }`}
                >
                  {copiedKey === 'sidebar' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Gadget Lateral</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <pre className="bg-stone-900 text-stone-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-64 border border-stone-800 leading-relaxed">
                    {generateSidebarWidgetCode()}
                  </pre>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col justify-center">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-2">
                    Previsualización del Gadget:
                  </span>
                  <div 
                    className="border border-dashed border-stone-300 rounded-xl p-3"
                    dangerouslySetInnerHTML={{ __html: generateSidebarWidgetCode() }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Entrada Editorial Completa */}
          {activeTab === 'editorial-post' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    Entrada de Blog Lista para Publicar
                  </h4>
                  <p className="text-xs text-stone-500">
                    Incluye una introducción reflexiva, la cita del día de amor propio y autoestimas y el almanaque interactivo completo embebido.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(generateEditorialPostCode(), 'editorial')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedKey === 'editorial'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-xs'
                  }`}
                >
                  {copiedKey === 'editorial' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Entrada Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Entrada Completa</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-stone-900 text-stone-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-72 border border-stone-800 leading-relaxed">
                  {generateEditorialPostCode()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Simulador de Vista Previa en Blogger */}
          {activeTab === 'preview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-stone-600" />
                  Simulación de cómo lucirá dentro de una entrada en tu blog de Blogger:
                </span>
                <a
                  href={targetUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-terracotta-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Probar URL en nueva pestaña</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Simulación del layout de un Blog en Blogspot */}
              <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-lg">
                {/* Barra superior de Blogger simulada */}
                <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs text-stone-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="ml-2 font-sans font-bold text-stone-700">MiBlogDeBienestar.blogspot.com</span>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-sans font-bold">
                    Vista Blogger
                  </span>
                </div>

                {/* Contenido simulado del blog */}
                <div className="p-4 sm:p-6 bg-[#FAF9F6]">
                  <div className="max-w-2xl mx-auto mb-4 text-center">
                    <span className="text-[11px] text-stone-400 font-medium">Martes, 15 de Septiembre &bull; Publicado por Alma Serena</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                      Almanaque de Amor Propio y Autoestima
                    </h2>
                    <p className="text-xs text-stone-600 mt-1.5">
                      Un viaje íntimo de sanación mediante afirmaciones diarias, amor propio y frecuencias zen.
                    </p>
                  </div>

                  {/* Marco donde se renderiza el iframe real del almanaque */}
                  <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    {includeFullscreenButton && (
                      <div className="bg-[#F5EFEB] border-b border-[#EBE2D8] px-3 py-2 flex justify-between items-center text-xs text-[#4A4036] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-terracotta-600"></span>
                          🌸 Almanaque de Amor Propio
                        </span>
                        <span className="text-[11px] text-terracotta-700 bg-white px-2 py-0.5 rounded-full border border-terracotta-300">
                          Pantalla completa ↗
                        </span>
                      </div>
                    )}
                    <iframe
                      src={targetUrl()}
                      title="Vista Previa en Blogger"
                      className="w-full h-[550px] border-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal con accesos directos */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>¿Listo para publicar?</span>
            <a
              href="https://www.blogger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-700 hover:text-orange-900 inline-flex items-center gap-1 hover:underline"
            >
              Ir a mi panel de Blogger.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => handleCopy(generateResponsiveEmbedCode(), 'footer-copy')}
              className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'footer-copy' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código para Blogger</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
