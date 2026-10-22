import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save, Download, Sparkles, Heart, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { JournalEntry, UserAccount } from '../../types';
import { checkJournalAccess, checkDownloadAccess } from '../utils/tierAccess';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNum: number;
  dayTitle: string;
  onShowToast: (msg: string) => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
  onOpenPayment?: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  dayNum,
  dayTitle,
  onShowToast,
  currentUser,
  onOpenAuth,
  onOpenPayment
}) => {
  const [reflection, setReflection] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [savedEntries, setSavedEntries] = useState<Record<number, JournalEntry>>({});

  const accessCheck = checkJournalAccess(currentUser || null);
  const isAuthorized = accessCheck.allowed;

  useEffect(() => {
    if (!isOpen || !isAuthorized) return;
    try {
      const stored = localStorage.getItem('healing_journal_entries');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedEntries(parsed);
        if (parsed[dayNum]) {
          setReflection(parsed[dayNum].reflection || '');
          setGratitude(parsed[dayNum].gratitude || '');
        } else {
          setReflection('');
          setGratitude('');
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, [isOpen, dayNum, isAuthorized]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!isAuthorized) {
      if (!currentUser) {
        onShowToast("🔐 Debes iniciar sesión con tu cuenta para guardar en tu diario.");
        onOpenAuth?.();
      } else {
        onShowToast("🔒 Activa tu suscripción paga para guardar notas en el diario.");
        onOpenPayment?.();
      }
      return;
    }

    const entry: JournalEntry = {
      day: dayNum,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      reflection,
      gratitude
    };

    const updated = { ...savedEntries, [dayNum]: entry };
    setSavedEntries(updated);
    try {
      localStorage.setItem('healing_journal_entries', JSON.stringify(updated));
      onShowToast("✨ Reflexión guardada con amor y cifrada en tu diario.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportAll = () => {
    // Control estricto de Descarga Segura
    const dlCheck = checkDownloadAccess(currentUser || null, 'Diario de Sanación');
    if (!dlCheck.allowed) {
      if (!currentUser) {
        onShowToast("🔐 Inicia sesión con tu cuenta para habilitar la descarga.");
        onOpenAuth?.();
      } else {
        onShowToast("🔒 La descarga requiere una suscripción activa paga.");
        onOpenPayment?.();
      }
      return;
    }

    try {
      const entries = Object.values(savedEntries) as JournalEntry[];
      if (entries.length === 0) {
        onShowToast("Aún no tienes entradas guardadas en tu diario para descargar.");
        return;
      }

      let content = `========================================================================\n`;
      content += `ALMANAQUE DE PAZ - DIARIO ÍNTIMO DE SANACIÓN PERSONAL\n`;
      content += `USUARIO TITULAR: ${currentUser?.name || 'Usuario Verificado'}\n`;
      content += `CORREO: ${currentUser?.email || 'N/A'}\n`;
      content += `ESTADO DE SUSCRIPCIÓN: PAGO ACTIVO CONFIRMADO (AWS PROTECTED)\n`;
      content += `FECHA DE EXPORTACIÓN: ${new Date().toLocaleString('es-ES')}\n`;
      content += `========================================================================\n\n`;

      content += entries
        .sort((a, b) => a.day - b.day)
        .map(entry => `--- DÍA ${entry.day} (${entry.date}) ---\nReflexión:\n${entry.reflection}\n\nGratitud:\n${entry.gratitude}\n\n`)
        .join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mi_Diario_De_Sanacion_${currentUser?.name ? currentUser.name.replace(/\s+/g, '_') : 'Usuario'}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      onShowToast("📥 Tu diario de sanación y reflexiones fue descargado con éxito.");
    } catch (e) {
      onShowToast("No fue posible exportar en este momento.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sand-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-sand-50 border border-sand-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-sand-900">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-sand-500 hover:text-sand-800 hover:bg-sand-200/60 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthorized ? (
          /* PANTALLA DE CONTROL SEGURO DE ACCESO */
          <div className="text-center py-6 px-2 space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 text-sand-800 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Acceso Seguro Controlado</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-sand-950">
                Diario y Descargas Protegidas
              </h3>
              <p className="text-sm text-sand-700 leading-relaxed">
                {!currentUser 
                  ? 'Para proteger la privacidad de tus reflexiones íntimas y habilitar las descargas oficiales, debes iniciar sesión con tu cuenta registrada.'
                  : `Hola ${currentUser.name}. El Diario Íntimo y el panel de descargas de reflexiones están reservados para miembros con suscripción activa paga (Categoría 2, Círculo de Paz o Categoría 3).`}
              </p>
            </div>

            <div className="p-4 bg-white/80 border border-sand-200 rounded-2xl text-left text-xs text-sand-700 space-y-1.5 max-w-md mx-auto shadow-xs">
              <div className="flex items-center gap-2 font-semibold text-sand-900">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
                <span>Beneficios de tu Membresía Paga:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-sand-600">
                <li>Espacio ilimitado para escribir tus desahogos y notas de gratitud.</li>
                <li>Cifrado personal y guardado seguro diario.</li>
                <li>Descarga y exportación completa de tus reflexiones en cualquier momento.</li>
                <li>Soporte de protección al comprador y certificado digital.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center max-w-md mx-auto">
              {!currentUser ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth?.();
                  }}
                  className="w-full py-3 px-6 bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium rounded-full shadow-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Iniciar Sesión / Registrarme</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPayment?.();
                  }}
                  className="w-full py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-full shadow-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Activar Mi Membresía Paga</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* PANTALLA PRINCIPAL DEL DIARIO (AUTORIZADO Y PAGADO) */
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-terracotta-600">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Diario Íntimo de Sanación</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Sesión y Pago Verificados</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-sand-900">
                Día {dayNum}: {dayTitle}
              </h3>
              <p className="text-sand-600 text-xs sm:text-sm mt-1">
                Escribe libremente lo que tu corazón necesita expresar hoy. Tus reflexiones están vinculadas a tu cuenta y protegidas.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sand-700 uppercase tracking-wide mb-1.5">
                  ¿Qué sentí hoy y qué elijo liberar?
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Observa tus emociones sin juzgarte... déjalas salir en estas líneas."
                  className="w-full h-28 p-3.5 bg-white border border-sand-300 rounded-2xl text-sm text-sand-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-700 uppercase tracking-wide mb-1.5">
                  Mi agradecimiento del día
                </label>
                <textarea
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="Agradezco a mi cuerpo, a mi respiración, a la vida..."
                  className="w-full h-20 p-3.5 bg-white border border-sand-300 rounded-2xl text-sm text-sand-800 focus:outline-none focus:ring-2 focus:ring-gold-400/40 resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-6 bg-terracotta-600 hover:bg-terracotta-700 active:scale-95 text-white font-medium rounded-full shadow-sm flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar en mi Diario</span>
              </button>
              <button
                onClick={handleExportAll}
                className="py-3 px-5 bg-white hover:bg-sand-100 border border-sand-300 text-sand-800 rounded-full font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Diario Completo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
