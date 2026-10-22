import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Heart } from 'lucide-react';

interface OracleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORACLE_CARDS = [
  {
    title: "El Abrazo Interior",
    message: "No necesitas demostrar nada a nadie para ser dign@ de amor. Eres suficiente en este instante exacto. Respira y abrázate.",
    mantra: "Me acepto, me honro y me amo tal como soy."
  },
  {
    title: "Suelta el Control",
    message: "Cuando dejas de forzar los resultados, permites que la inteligencia divina del universo ordene cada detalle en perfecta paz.",
    mantra: "Suelto y confío en el flujo perfecto de la vida."
  },
  {
    title: "El Poder de Tu Nombre",
    message: "Tu nombre es un templo de luz. Cada vez que lo pronuncies con ternura, estás sanando a todas tus generaciones pasadas.",
    mantra: "Bendigo mi nombre y abro caminos de bendición."
  },
  {
    title: "Luz en la Sombra",
    message: "Aquello que te dolió vino a enseñarte tu propia fuerza. No rechaces tus emociones; dales la bienvenida y transmútalas en compasión.",
    mantra: "Lo siento, perdóname, te amo, gracias."
  },
  {
    title: "Merecimiento Puro",
    message: "La abundancia y la serenidad no son premios que debes ganarte con esfuerzo agobiante. Son tu estado natural de ser.",
    mantra: "Recibo con brazos abiertos todo el bien que el universo tiene para mí."
  }
];

export const OracleModal: React.FC<OracleModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(true);

  if (!isOpen) return null;

  const card = ORACLE_CARDS[currentIdx];

  const handleNextCard = () => {
    setIsRevealed(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % ORACLE_CARDS.length);
      setIsRevealed(true);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sand-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-sand-50 border border-sand-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-sand-900 text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-sand-500 hover:text-sand-800 hover:bg-sand-200/60 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100/80 border border-gold-300/60 rounded-full text-gold-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oráculo de Amor Propio</span>
          </div>

          <div className={`p-6 sm:p-8 rounded-2xl bg-white border border-sand-200/80 shadow-md transition-all duration-300 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-serif font-bold text-terracotta-700 mb-3">
              {card.title}
            </h3>
            <p className="text-sand-700 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              "{card.message}"
            </p>
            <div className="pt-4 border-t border-sand-100">
              <span className="text-[11px] uppercase tracking-widest text-gold-600 font-bold block mb-1">Afirmación del Momento</span>
              <p className="font-serif italic text-sand-900 text-base font-semibold">
                "{card.mantra}"
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleNextCard}
              className="py-2.5 px-6 bg-sand-200 hover:bg-sand-300 text-sand-800 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Elegir otra carta</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
            >
              Integrar en mi corazón
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
