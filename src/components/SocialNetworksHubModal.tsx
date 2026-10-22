import React from 'react';
import { 
  X, 
  Instagram, 
  Facebook, 
  Globe, 
  Youtube, 
  Video, 
  Sparkles, 
  Heart, 
  ExternalLink,
  Share2,
  ChevronRight,
  BookOpen,
  Headphones
} from 'lucide-react';
import { DayContent } from '../../types';

interface SocialNetworksHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayContent;
  currentDayNum: number;
  onOpenInstagram: () => void;
  onOpenFacebook: () => void;
  onOpenThreads: () => void;
  onOpenBlogger: () => void;
  onOpenTikTok: () => void;
  onOpenYouTube: () => void;
  onOpenYouTubeMusic?: () => void;
}

export const SocialNetworksHubModal: React.FC<SocialNetworksHubModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  currentDayNum,
  onOpenInstagram,
  onOpenFacebook,
  onOpenThreads,
  onOpenBlogger,
  onOpenTikTok,
  onOpenYouTube,
  onOpenYouTubeMusic
}) => {
  if (!isOpen) return null;

  const networks = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: 'Reflexiones e Historias · $1.75',
      badge: 'Pase y Creador · $1.75',
      description: 'Accede a las reflexiones de amor propio, historias verticales 9:16 y carruseles con energía transformadora.',
      colorClass: 'from-amber-500 via-rose-500 to-purple-600',
      textColor: 'text-rose-600',
      bgLight: 'bg-rose-50/70',
      borderClass: 'border-rose-200/80',
      icon: <Instagram className="w-5 h-5 text-white" />,
      action: () => {
        onClose();
        onOpenInstagram();
      },
      buttonText: 'Pase & Contenido Instagram'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'Comunidad y Reflexiones · $1.75',
      badge: 'Pase y Comunidad · $1.75',
      description: 'Publica y disfruta reflexiones sanadoras en tu comunidad con citas de paz, amor propio y superación diaria.',
      colorClass: 'from-[#1877F2] to-[#0d5ac1]',
      textColor: 'text-[#1877F2]',
      bgLight: 'bg-blue-50/70',
      borderClass: 'border-blue-200/80',
      icon: <Facebook className="w-5 h-5 text-white fill-white" />,
      action: () => {
        onClose();
        onOpenFacebook();
      },
      buttonText: 'Pase & Contenido Facebook'
    },
    {
      id: 'threads',
      name: 'Threads',
      handle: '@teread',
      badge: 'Micro-hilos y Afirmaciones',
      description: 'Comparte hilos diarios de 3 partes con reflexiones de autoestima, amor propio y transmutación.',
      colorClass: 'from-stone-900 to-stone-800',
      textColor: 'text-stone-900',
      bgLight: 'bg-stone-100/80',
      borderClass: 'border-stone-300/80',
      icon: <span className="font-serif font-black text-white text-base leading-none">@</span>,
      action: () => {
        onClose();
        onOpenThreads();
      },
      buttonText: 'Abrir Hilos de Threads'
    },
    {
      id: 'blogger',
      name: 'Blogger',
      handle: 'Blog de Sanación y Paz · $1.75',
      badge: 'Pase y Gadgets · $1.75',
      description: 'Entradas responsivas de sabiduría, artículos de amor propio y código HTML adaptativo para celular, tablet y notebook.',
      colorClass: 'from-orange-500 to-amber-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-amber-50/70',
      borderClass: 'border-amber-200/80',
      icon: <Globe className="w-5 h-5 text-white" />,
      action: () => {
        onClose();
        onOpenBlogger();
      },
      buttonText: 'Pase & Entradas Blogger'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: 'Reflexiones Diarias · $1.75',
      badge: 'Amor Propio y Paz',
      description: 'Un espacio sagrado e independiente con música y la energía transformadora para acompañar tu superación día a día.',
      colorClass: 'from-stone-950 via-stone-900 to-rose-950',
      textColor: 'text-rose-500',
      bgLight: 'bg-rose-50/50',
      borderClass: 'border-rose-200/70',
      icon: <Video className="w-5 h-5 text-rose-300" />,
      action: () => {
        onClose();
        onOpenTikTok();
      },
      buttonText: 'Ver Reflexiones TikTok'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: 'Reflexiones Diarias · $1.75',
      badge: 'Amor Propio y Paz',
      description: 'Un espacio sagrado e independiente con música y la energía transformadora para acompañar tu superación día a día.',
      colorClass: 'from-[#FF0000] to-[#b30000]',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50/60',
      borderClass: 'border-red-200/70',
      icon: <Youtube className="w-5 h-5 text-white fill-white" />,
      action: () => {
        onClose();
        onOpenYouTube();
      },
      buttonText: 'Abrir YouTube Gallery'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-stone-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Contenedor principal modal */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl sm:rounded-[36px] border border-stone-200/90 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="px-6 sm:px-8 py-5 border-b border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-terracotta-600 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  Comunidad y Redes de Amor Propio
                </h3>
                <span className="text-[10px] bg-terracotta-100 text-terracotta-800 px-2 py-0.5 rounded-full font-bold">
                  6 Canales
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Día {currentDayNum} · {currentDay.title} · Difunde paz y amor sin recargar la pantalla
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

        {/* CITA DE PAZ Y CALMA */}
        <div className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-sand-100/90 via-amber-50/70 to-rose-50/80 border-b border-stone-200/60 shrink-0">
          <p className="font-serif italic text-xs sm:text-sm text-stone-800 text-center leading-relaxed">
            "Existe un lugar en donde llega la calma y reina el amor puro. Y ese lugar está en tu interior."
          </p>
        </div>

        {/* GRILLA DE REDES (ADAPTABLE A NOTEBOOK, TABLET Y CELULAR) */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {networks.map((net) => (
              <div
                key={net.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  {/* Encabezado de la tarjeta */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${net.colorClass} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        {net.icon}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-base">
                          {net.name}
                        </h4>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {net.handle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge de formato */}
                  <div className="mb-2.5">
                    <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {net.badge}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {net.description}
                  </p>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={net.action}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    net.id === 'tiktok'
                      ? 'bg-stone-900 hover:bg-stone-800 text-rose-300'
                      : net.id === 'youtube'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : net.id === 'threads'
                      ? 'bg-stone-900 hover:bg-stone-800 text-white'
                      : 'bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white'
                  }`}
                >
                  <span>{net.buttonText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* OPCIÓN ADICIONAL: MÚSICA CLÁSICA DE YOUTUBE */}
          {onOpenYouTubeMusic && (
            <div className="mt-5 p-4 sm:p-5 bg-white/90 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                    Música Clásica y Zen de YouTube (432 Hz)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Chopin, Debussy, Bach, Satie y Cuencos Tibetanos para acompañar tu lectura.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenYouTubeMusic();
                }}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Abrir Reproductor Musical</span>
              </button>
            </div>
          )}
        </div>

        {/* PIE DE PÁGINA */}
        <div className="px-6 sm:px-8 py-4 bg-stone-100/80 border-t border-stone-200/80 flex items-center justify-between shrink-0 text-xs text-stone-500">
          <span className="font-serif italic">
            YO SOY YO · Almanaque de Amor Propio y Autoestima
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-stone-200/80 text-stone-700 font-semibold rounded-full border border-stone-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
