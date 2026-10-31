import React from 'react';
import { X, Heart, ShieldCheck, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sand-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-sand-50 border border-sand-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-sand-900">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-sand-500 hover:text-sand-800 hover:bg-sand-200/60 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <div className="flex items-center gap-2.5 text-terracotta-600">
            <div className="w-6 h-6 rounded-full overflow-hidden shadow-2xs border border-sand-300 shrink-0">
              <img 
                src="https://i.ibb.co/ymM0h3KV/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-2.png" 
                alt="Logo Almanaque" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Acerca de este Almanaque</span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-sand-900">
            Un camino de amor propio y transformación
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-sand-700 leading-relaxed bg-white/70 p-4 rounded-2xl border border-sand-200/60">
            <p>
              Este almanaque fue creado desde el corazón como una recopilación vivencial para cultivar la paz interior, sanar heridas del pasado y reconectar con nuestro valor sagrado.
            </p>
            <p>
              Inspirado en la sabiduría milenaria del <strong>Amor Propio y Autoestimas</strong>, la metafísica del <em>"YO SOY"</em> y ejercicios de autoobservación compasiva.
            </p>
            <div className="pt-2.5 border-t border-sand-200/60 space-y-2">
              <p className="text-[11px] text-sand-500">
                * Nota de autoría y respeto: Parte de las oraciones y mantras tradicionales pertenecen al acervo de sabiduría espiritual y sanación transmitida generosamente en la red. Han sido adaptadas con infinito amor y gratitud para este viaje de 21 días y anual: durante 21 días se busca transformar patrones del pasado y el resto de los días se encuentra material adicional hasta iniciar el nuevo mes, ya que cada mes es diferente.
              </p>
              <p className="text-[11px] sm:text-xs text-stone-700 bg-sand-100/90 p-3 rounded-xl border border-sand-200/80 leading-relaxed">
                <strong>Deslinde de responsabilidad:</strong> El contenido compartido en este espacio representa mi experiencia personal. Esta información se proporciona únicamente con fines informativos y no constituye, ni sustituye, el asesoramiento, diagnóstico o tratamiento médico o psicológico profesional. El uso de la información presentada aquí queda bajo tu propia responsabilidad.
              </p>
              <p className="text-[11px] sm:text-xs text-amber-900 bg-amber-50/90 p-3 rounded-xl border border-amber-200/80 leading-relaxed space-y-1">
                <span className="block"><strong>Método de entrega digital:</strong> Descarga digital automática e inmediata en tu dispositivo al completar el pago, respetando las restricciones de cada categoría.</span>
                <span className="block"><strong>Política de devolución:</strong> Al ser un producto digital, una vez que se descarga ya no se puede devolver.</span>
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-sand-200 hover:bg-sand-300 text-sand-800 rounded-full text-xs font-semibold transition-all"
            >
              Cerrar con gratitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
