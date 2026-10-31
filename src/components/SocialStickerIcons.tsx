import React from 'react';

interface StickerIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Ícono Sticker de TikTok en tamaño medio con borde troquelado blanco,
 * sombra física y efecto tridimensional de calcomanía ("sticker").
 */
export const TikTokStickerIcon: React.FC<StickerIconProps> = ({ 
  className = "w-11 h-11 sm:w-12 sm:h-12" 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${className}`}
      title="TikTok"
      aria-label="TikTok"
    >
      {/* Borde exterior blanco de sticker con relieve y sombra */}
      <div className="w-full h-full rounded-2xl bg-white p-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.08)] border border-stone-200/70">
        {/* Cuerpo del sticker con fondo negro icónico de TikTok */}
        <div className="w-full h-full rounded-[13px] bg-stone-950 flex items-center justify-center relative overflow-hidden">
          {/* Brillo suave de calcomanía en la mitad superior */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
          
          {/* Símbolo de nota musical con efecto cromático cian/magenta */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" 
            fill="none"
          >
            {/* Sombra Cian (#25F4EE) desplazada a la izquierda */}
            <path
              d="M16.5 5.8a4.8 4.8 0 0 1-3.2-1.6V15.2a4.4 4.4 0 1 1-3.8-4.4v2.3a2.2 2.2 0 1 0 1.6 2.1V3.5h2.2a4.8 4.8 0 0 0 3.2 3.1v-.8z"
              fill="#25F4EE"
              transform="translate(-0.6, -0.6)"
              opacity="0.95"
            />
            {/* Sombra Magenta (#FE2C55) desplazada a la derecha */}
            <path
              d="M16.5 5.8a4.8 4.8 0 0 1-3.2-1.6V15.2a4.4 4.4 0 1 1-3.8-4.4v2.3a2.2 2.2 0 1 0 1.6 2.1V3.5h2.2a4.8 4.8 0 0 0 3.2 3.1v-.8z"
              fill="#FE2C55"
              transform="translate(0.6, 0.6)"
              opacity="0.95"
            />
            {/* Nota blanca central */}
            <path
              d="M16.5 5.8a4.8 4.8 0 0 1-3.2-1.6V15.2a4.4 4.4 0 1 1-3.8-4.4v2.3a2.2 2.2 0 1 0 1.6 2.1V3.5h2.2a4.8 4.8 0 0 0 3.2 3.1v-.8z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Ícono Sticker de YouTube en tamaño medio con borde troquelado blanco,
 * sombra física y efecto tridimensional de calcomanía ("sticker").
 */
export const YouTubeStickerIcon: React.FC<StickerIconProps> = ({ 
  className = "w-11 h-11 sm:w-12 sm:h-12" 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${className}`}
      title="YouTube"
      aria-label="YouTube"
    >
      {/* Borde exterior blanco de sticker con relieve y sombra */}
      <div className="w-full h-full rounded-2xl bg-white p-[3px] shadow-[0_4px_12px_rgba(238,29,36,0.2),0_1px_3px_rgba(0,0,0,0.08)] border border-rose-200/70">
        {/* Cuerpo del sticker con fondo rojo degradado de YouTube */}
        <div className="w-full h-full rounded-[13px] bg-gradient-to-tr from-red-600 via-red-500 to-rose-500 flex items-center justify-center relative overflow-hidden">
          {/* Brillo suave de calcomanía */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
          
          {/* Triángulo de Play blanco */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" 
            fill="none"
          >
            <path
              d="M9.75 8.5v7l6-3.5-6-3.5z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Ícono Sticker de Instagram en tamaño medio con borde troquelado blanco,
 * degradado cromático auténtico y efecto tridimensional de calcomanía.
 */
export const InstagramStickerIcon: React.FC<StickerIconProps> = ({ 
  className = "w-11 h-11 sm:w-12 sm:h-12" 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${className}`}
      title="Instagram"
      aria-label="Instagram"
    >
      <div className="w-full h-full rounded-2xl bg-white p-[3px] shadow-[0_4px_12px_rgba(225,48,108,0.25),0_1px_3px_rgba(0,0,0,0.08)] border border-rose-200/70">
        <div className="w-full h-full rounded-[13px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Ícono Sticker de Facebook en tamaño medio con borde troquelado blanco,
 * azul clásico #1877F2 y efecto tridimensional de calcomanía.
 */
export const FacebookStickerIcon: React.FC<StickerIconProps> = ({ 
  className = "w-11 h-11 sm:w-12 sm:h-12" 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${className}`}
      title="Facebook"
      aria-label="Facebook"
    >
      <div className="w-full h-full rounded-2xl bg-white p-[3px] shadow-[0_4px_12px_rgba(24,119,242,0.25),0_1px_3px_rgba(0,0,0,0.08)] border border-blue-200/70">
        <div className="w-full h-full rounded-[13px] bg-gradient-to-tr from-[#166fe5] to-[#1877F2] flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 fill-white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Ícono Sticker de Blogger en tamaño medio con borde troquelado blanco,
 * naranja cálido emblemático y efecto tridimensional de calcomanía.
 */
export const BloggerStickerIcon: React.FC<StickerIconProps> = ({ 
  className = "w-11 h-11 sm:w-12 sm:h-12" 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group transition-transform duration-200 hover:scale-105 ${className}`}
      title="Blogger"
      aria-label="Blogger"
    >
      <div className="w-full h-full rounded-2xl bg-white p-[3px] shadow-[0_4px_12px_rgba(249,115,22,0.25),0_1px_3px_rgba(0,0,0,0.08)] border border-amber-200/70">
        <div className="w-full h-full rounded-[13px] bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 fill-white">
            <path d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2zm-4.7 6.4c0 .8-.7 1.5-1.5 1.5h-.8v-3h.8c.8 0 1.5.7 1.5 1.5zm.9 6.8c0 .9-.8 1.6-1.7 1.6h-4.2V7.2h3.9c1.4 0 2.5 1.1 2.5 2.5 0 .8-.4 1.5-1 1.9.9.4 1.5 1.3 1.5 2.4z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

