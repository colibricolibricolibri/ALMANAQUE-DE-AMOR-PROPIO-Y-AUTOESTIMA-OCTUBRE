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
  FolderOpen
} from 'lucide-react';

interface OfficeSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const OfficeSuiteModal: React.FC<OfficeSuiteModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'suite' | 'editor'>('suite');
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

  if (!isOpen) return null;

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
    if (onShowToast) onShowToast('📥 Archivo descargado exitosamente.');
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
      desc: 'Crea, redacta y edita documentos de texto enriquecido en línea de forma 100% gratuita.',
      badge: 'Word Gratis',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FileText,
      iconBg: 'from-blue-600 to-blue-700',
      actionUrl: 'https://word.new',
      directName: 'Abrir Word'
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
      directName: 'Abrir Excel'
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
      directName: 'Abrir PowerPoint'
    },
    {
      id: 'onenote',
      name: 'Microsoft OneNote en la Web',
      desc: 'Cuaderno digital para organizar ideas, reflexiones, tareas y listas personales.',
      badge: 'OneNote Gratis',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: BookOpen,
      iconBg: 'from-purple-600 to-purple-700',
      actionUrl: 'https://www.onenote.com/notebooks',
      directName: 'Abrir OneNote'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F7F2E7] rounded-3xl shadow-2xl border border-amber-200/90 text-stone-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-200/70 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Cerrar suite"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cambria font-bold text-lg sm:text-xl text-stone-900 leading-tight">
                  Paquete Office Gratis en la Web
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200">
                  Microsoft 365
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Trabaja fluidamente con Word, Excel, PowerPoint o redacta borradores sin cerrar el Almanaque
              </p>
            </div>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('suite')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'suite'
                  ? 'bg-gradient-to-r from-orange-600 to-terracotta-600 text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Programas Office Gratuitos</span>
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-gradient-to-r from-orange-600 to-terracotta-600 text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Editor & Bloc Rápido Zen</span>
            </button>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'suite' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Microsoft ofrece acceso 100% gratuito a sus aplicaciones web oficiales (Word, Excel y PowerPoint) para cualquier persona con una cuenta gratuita de Microsoft/Outlook/Hotmail. Haz clic para abrir cualquiera de los programas en una pestaña limpia y trabajar en paralelo.
                </p>
              </div>

              {OFFICE_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.iconBg} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-cambria font-bold text-sm text-stone-900">
                            {tool.name}
                          </h4>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full border ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {tool.desc}
                        </p>
                      </div>
                    </div>

                    <a
                      href={tool.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0 self-end sm:self-center"
                      title={tool.name}
                    >
                      <span>{tool.directName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}

              {/* Botón Central Portal Office */}
              <div className="pt-2 text-center">
                <a
                  href="https://www.office.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-terracotta-600 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Portal Oficial Microsoft 365 (Office.com)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-3 flex flex-col h-full">
              {/* Barra de título y herramientas del documento */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-stone-200/80">
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Título de tu documento..."
                  className="font-cambria font-bold text-sm sm:text-base text-stone-900 bg-transparent border-none focus:outline-none w-full"
                />
                
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
                    title="Copiar todo el texto"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadDoc}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-medium transition-colors"
                    title="Descargar como Word (.doc)"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Word (.doc)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
                    title="Descargar como archivo de texto (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.txt</span>
                  </button>
                </div>
              </div>

              {/* Área de texto de redacción */}
              <div className="relative">
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Escribe aquí tus notas de trabajo, borradores de cartas, balances diarios, proyectos o reflexiones... Se guarda automáticamente mientras escribes."
                  className="w-full h-64 sm:h-80 p-4 bg-white border border-stone-200/90 rounded-2xl font-cambria text-stone-800 text-sm sm:text-base leading-relaxed focus:outline-none focus:border-amber-400 shadow-inner resize-none"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-stone-400 bg-white/90 px-2 py-0.5 rounded-full border border-stone-200 pointer-events-none">
                  {wordCount} palabras · {charCount} caracteres
                </div>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                💾 Todo lo que escribes se guarda automáticamente en tu navegador para que nunca pierdas tu trabajo.
              </p>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
          <span className="text-[11px]">Paquete de herramientas de trabajo para el Almanaque</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};
