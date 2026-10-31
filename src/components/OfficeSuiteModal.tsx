import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Table, 
  Presentation, 
  BookOpen, 
  ExternalLink, 
  X, 
  Save, 
  Copy, 
  Download, 
  Check, 
  Sparkles, 
  FileEdit,
  FolderOpen,
  Minus,
  Maximize2,
  Minimize2,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface OfficeSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

export const OfficeSuiteModal: React.FC<OfficeSuiteModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  isMinimized = false,
  onMinimize
}) => {
  const [activeTab, setActiveTab] = useState<'suite' | 'editor'>('suite');
  const [isDockedToSide, setIsDockedToSide] = useState(true);
  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    try {
      return localStorage.getItem('zen_office_scratchpad') || '';
    } catch {
      return '';
    }
  });
  const [docTitle, setDocTitle] = useState<string>(() => {
    try {
      return localStorage.getItem('zen_office_doc_title') || 'Mi Borrador de Trabajo';
    } catch {
      return 'Mi Borrador de Trabajo';
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('zen_office_scratchpad', scratchpadText);
      localStorage.setItem('zen_office_doc_title', docTitle);
    } catch {}
  }, [scratchpadText, docTitle]);

  if (!isOpen || isMinimized) return null;

  const handleCopy = () => {
    if (!scratchpadText) {
      if (onShowToast) onShowToast('No hay texto para copiar aún.');
      return;
    }
    navigator.clipboard.writeText(scratchpadText);
    setCopied(true);
    if (onShowToast) onShowToast('📋 Texto copiado al portapapeles.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!scratchpadText) {
      if (onShowToast) onShowToast('Escribe algo primero para descargar.');
      return;
    }
    const blob = new Blob([scratchpadText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.trim() || 'documento'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('📥 Archivo de texto (.txt) descargado.');
  };

  const handleDownloadDoc = () => {
    if (!scratchpadText) {
      if (onShowToast) onShowToast('Escribe algo primero para descargar.');
      return;
    }
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${docTitle}</title></head>
      <body style="font-family: Cambria, Georgia, serif; line-height: 1.6; padding: 20px;">
        <h2>${docTitle}</h2>
        <div style="white-space: pre-wrap;">${scratchpadText.replace(/\n/g, '<br/>')}</div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.trim() || 'documento'}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('📄 Documento Word (.doc) descargado.');
  };

  const wordCount = scratchpadText.trim() ? scratchpadText.trim().split(/\s+/).length : 0;
  const charCount = scratchpadText.length;

  const OFFICE_TOOLS = [
    {
      id: 'word',
      name: 'Microsoft Word en la Web',
      desc: 'Crea, redacta y edita documentos de texto enriquecido en línea de forma gratuita.',
      badge: 'Word Gratis',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FileText,
      iconBg: 'from-blue-600 to-blue-700',
      actionUrl: 'https://word.new',
      directName: 'Abrir Word en Pestaña Nueva ↗'
    },
    {
      id: 'excel',
      name: 'Microsoft Excel en la Web',
      desc: 'Planillas de cálculo, presupuestos de economía consciente y tablas con fórmulas.',
      badge: 'Excel Gratis',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Table,
      iconBg: 'from-emerald-600 to-emerald-700',
      actionUrl: 'https://excel.new',
      directName: 'Abrir Excel en Pestaña Nueva ↗'
    },
    {
      id: 'powerpoint',
      name: 'Microsoft PowerPoint en la Web',
      desc: 'Crea diapositivas y presentaciones visuales conscientes con plantillas gratuitas.',
      badge: 'PowerPoint Gratis',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Presentation,
      iconBg: 'from-orange-600 to-orange-700',
      actionUrl: 'https://powerpoint.new',
      directName: 'Abrir PowerPoint en Pestaña Nueva ↗'
    },
    {
      id: 'onenote',
      name: 'Microsoft OneNote en la Web',
      desc: 'Cuaderno digital para organizar ideas, pensamientos y notas de sanación.',
      badge: 'OneNote Gratis',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: BookOpen,
      iconBg: 'from-purple-600 to-purple-700',
      actionUrl: 'https://www.onenote.com/notebooks',
      directName: 'Abrir OneNote en Pestaña Nueva ↗'
    }
  ];

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 pointer-events-none ${
        isDockedToSide
          ? 'bottom-16 sm:bottom-20 left-2 sm:left-6 w-[calc(100%-16px)] sm:w-[540px] max-h-[82vh]'
          : 'inset-0 flex items-center justify-center p-3 sm:p-4 bg-stone-900/25 backdrop-blur-[2px]'
      }`}
    >
      <div 
        className="pointer-events-auto relative w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F7F2E7] rounded-3xl p-4 sm:p-6 shadow-[0_15px_45px_rgba(46,39,33,0.22)] border-2 border-amber-200/90 text-stone-800 flex flex-col max-h-[82vh] overflow-y-auto no-scrollbar animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado con controles de pestaña y ventana */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-cambria font-bold text-sm sm:text-base text-stone-900 leading-tight">
                  Paquete Office Gratis en la Web
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.2 rounded-full border border-orange-200">
                  Multitarea
                </span>
              </div>
              <p className="text-[10px] text-stone-500 truncate">
                Word, Excel y Borrador sin cerrar el Almanaque
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="https://word.new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-orange-700 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
              title="Abrir Word directamente en una pestaña nueva ↗"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Word ↗</span>
            </a>

            <button
              onClick={() => setIsDockedToSide(!isDockedToSide)}
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title={isDockedToSide ? "Centrar ventana" : "Anclar al lateral"}
            >
              {isDockedToSide ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            {onMinimize && (
              <button
                onClick={onMinimize}
                className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Minimizar a la barra de pestañas inferior"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              title="Cerrar pestaña"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación interna: Herramientas Office / Bloc de Notas Zen */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('suite')}
            className={`flex-1 py-1.5 sm:py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'suite'
                ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Suite Web (Pestañas Nuevas)</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-1.5 sm:py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Borrador Integrado</span>
            {charCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        </div>

        {/* Contenido según pestaña */}
        {activeTab === 'suite' ? (
          <div className="space-y-2.5">
            <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              💡 <strong>Acceso directo a Office en Pestañas Nuevas:</strong> Puedes abrir Word, Excel y PowerPoint con un solo clic. Se abren en una pestaña limpia de tu navegador sin cerrar ni recargar el Almanaque.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OFFICE_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className="p-3 bg-white/90 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${tool.iconBg} text-white flex items-center justify-center shadow-xs`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <h4 className="font-cambria font-bold text-xs text-stone-900 leading-tight">
                        {tool.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>

                    <a
                      href={tool.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 w-full py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-decoration-none shadow-2xs cursor-pointer"
                      title={`Abrir ${tool.name} en una nueva pestaña`}
                    >
                      <span>{tool.directName}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Título del documento o nota..."
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500"
            />
            <textarea
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              placeholder="Escribe tus notas, reflexiones, ideas de proyectos o borradores de trabajo aquí. Se guardan automáticamente y no se borran al cerrar..."
              rows={7}
              className="w-full p-3 bg-white border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 font-sans leading-relaxed resize-none shadow-inner"
            />
            
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-[11px]">
              <span className="text-stone-500 text-[10px]">
                {wordCount} palabras · {charCount} caracteres
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  title="Descargar como documento Word .doc"
                >
                  <Download className="w-3 h-3" />
                  <span>Word (.doc)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title="Descargar como archivo de texto .txt"
                >
                  <Download className="w-3 h-3" />
                  <span>.txt</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pie de ventana */}
        <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-orange-600" />
            <span>Pestaña multitarea activa</span>
          </span>
          <div className="flex items-center gap-2">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                Minimizar a dock
              </button>
            )}
            <button
              onClick={onClose}
              className="text-terracotta-700 hover:text-terracotta-900 font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
