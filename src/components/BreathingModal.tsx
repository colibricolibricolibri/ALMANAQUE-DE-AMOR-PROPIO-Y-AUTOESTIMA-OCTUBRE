import React, { useState, useEffect } from 'react';
import { X, Wind, Heart } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'Inhala' | 'Sostén' | 'Exhala'>('Inhala');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setPhase((p) => {
            if (p === 'Inhala') return 'Sostén';
            if (p === 'Sostén') return 'Exhala';
            return 'Inhala';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sand-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-sand-50 border border-sand-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-sand-900 text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-sand-500 hover:text-sand-800 hover:bg-sand-200/60 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 py-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-100 border border-sage-300/60 rounded-full text-sage-700 text-xs font-semibold uppercase tracking-wider">
            <Wind className="w-3.5 h-3.5" />
            <span>Respiración de Paz</span>
          </div>

          {/* Animated breathing sphere */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            <div 
              className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out ${
                phase === 'Inhala' 
                  ? 'bg-sage-200/70 scale-100' 
                  : phase === 'Sostén' 
                    ? 'bg-gold-200/70 scale-105' 
                    : 'bg-terracotta-200/60 scale-75'
              }`} 
            />
            <div 
              className={`relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center bg-white shadow-md border border-sand-200 transition-all duration-1000 ${
                phase === 'Inhala' ? 'scale-105' : phase === 'Sostén' ? 'scale-110' : 'scale-90'
              }`}
            >
              <span className="text-sm font-semibold text-sand-500 uppercase tracking-widest">{phase}</span>
              <span className="text-3xl font-serif font-bold text-sand-900">{counter}</span>
            </div>
          </div>

          <p className="text-xs text-sand-600 max-w-xs mx-auto">
            Siente el aire entrando suavemente. Estás a salvo, este instante te pertenece.
          </p>

          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-sand-200 hover:bg-sand-300 text-sand-800 rounded-full text-xs font-semibold transition-all"
          >
            Regresar con calma
          </button>
        </div>
      </div>
    </div>
  );
};
