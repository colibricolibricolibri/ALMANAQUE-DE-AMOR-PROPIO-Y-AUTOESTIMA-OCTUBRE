import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CreditCard, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Check, 
  Copy, 
  Code2, 
  Settings2, 
  Globe, 
  Share2, 
  ArrowRight,
  Flame,
  Lock
} from 'lucide-react';
import { 
  InstagramStickerIcon, 
  FacebookStickerIcon, 
  BloggerStickerIcon, 
  TikTokStickerIcon, 
  YouTubeStickerIcon 
} from './SocialStickerIcons';
import { 
  INSTAGRAM_CONFIG, 
  FACEBOOK_CONFIG, 
  BLOGGER_CONFIG, 
  TIKTOK_VIDEOS_CONFIG, 
  YOUTUBE_GALLERY_CONFIG,
  DEFAULT_ARS_EXCHANGE_RATE,
  formatUSD,
  formatARS,
  getArsAmount
} from '../utils/paymentConfig';

export type SocialNetworkKey = 'instagram' | 'facebook' | 'blogger' | 'tiktok' | 'youtube';

interface SocialNetworkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNetwork?: SocialNetworkKey;
  onProceedToPayment: (networkId: SocialNetworkKey, title: string, amount: number) => void;
  onOpenContentModal?: (networkId: SocialNetworkKey) => void;
}

interface SocialLinkData {
  url: string;
}

const DEFAULT_LINKS: Record<SocialNetworkKey, string> = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  blogger: 'https://www.blogger.com/',
  tiktok: 'https://www.tiktok.com/',
  youtube: 'https://www.youtube.com/'
};

export const SocialNetworkActionModal: React.FC<SocialNetworkActionModalProps> = ({
  isOpen,
  onClose,
  initialNetwork = 'instagram',
  onProceedToPayment,
  onOpenContentModal
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetworkKey>(initialNetwork);
  const [activeTab, setActiveTab] = useState<'action' | 'code' | 'settings'>('action');
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Enlaces configurables almacenados en localStorage
  const [links, setLinks] = useState<Record<SocialNetworkKey, string>>(() => {
    try {
      const saved = localStorage.getItem('almanaque_social_links');
      if (saved) {
        return { ...DEFAULT_LINKS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_LINKS;
  });

  const [editUrl, setEditUrl] = useState(links[initialNetwork] || DEFAULT_LINKS[initialNetwork]);

  useEffect(() => {
    if (isOpen) {
      setSelectedNetwork(initialNetwork);
      setEditUrl(links[initialNetwork] || DEFAULT_LINKS[initialNetwork]);
      setActiveTab('action');
      setCopiedCode(false);
    }
  }, [isOpen, initialNetwork]);

  useEffect(() => {
    setEditUrl(links[selectedNetwork] || DEFAULT_LINKS[selectedNetwork]);
  }, [selectedNetwork, links]);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...links, [selectedNetwork]: editUrl.trim() || DEFAULT_LINKS[selectedNetwork] };
    setLinks(updated);
    try {
      localStorage.setItem('almanaque_social_links', JSON.stringify(updated));
    } catch {}
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 2500);
  };

  const getNetworkDetails = (net: SocialNetworkKey) => {
    switch (net) {
      case 'instagram':
        return {
          id: 'instagram' as const,
          name: 'Instagram',
          badgeText: 'Pase Exclusivo · $1.75',
          price: 1.75,
          icon: <InstagramStickerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
          accentGradient: 'from-amber-500 via-rose-500 to-purple-600',
          accentText: 'text-rose-600',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          description: 'Accede a las reflexiones diarias de amor propio, historias verticales 9:16, afirmaciones y carruseles sanadores con energía de autoestima y paz.',
          redirectLabel: 'Ir a mi Instagram Oficial',
          paymentTitle: 'Pase de Acceso a Instagram ($1.75 USD)'
        };
      case 'facebook':
        return {
          id: 'facebook' as const,
          name: 'Facebook',
          badgeText: 'Pase Exclusivo · $1.75',
          price: 1.75,
          icon: <FacebookStickerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
          accentGradient: 'from-[#1877F2] to-[#0d5ac1]',
          accentText: 'text-[#1877F2]',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
          description: 'Únete a nuestra comunidad en Facebook con citas de amor propio, reflexiones de superación diaria y lecturas guiadas de paz y autoestima.',
          redirectLabel: 'Ir a mi Facebook / Comunidad Oficial',
          paymentTitle: 'Pase de Acceso a Facebook ($1.75 USD)'
        };
      case 'blogger':
        return {
          id: 'blogger' as const,
          name: 'Blogger',
          badgeText: 'Pase Exclusivo · $1.75',
          price: 1.75,
          icon: <BloggerStickerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
          accentGradient: 'from-orange-500 to-amber-500',
          accentText: 'text-orange-600',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          description: 'Lee las entradas y artículos profundos de sanación y sabiduría en Blogger con diseño responsivo optimizado para celular, tablet y notebook.',
          redirectLabel: 'Ir a mi Blog de Blogger Oficial',
          paymentTitle: 'Pase de Acceso a Blogger ($1.75 USD)'
        };
      case 'tiktok':
        return {
          id: 'tiktok' as const,
          name: 'TikTok',
          badgeText: 'Reflexiones · $1.75',
          price: 1.75,
          icon: <TikTokStickerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
          accentGradient: 'from-stone-900 via-stone-800 to-rose-950',
          accentText: 'text-stone-900',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          description: 'Un espacio sagrado e independiente con música y la energía transformadora para acompañar tu superación día a día.',
          redirectLabel: 'Ir a mi TikTok Oficial',
          paymentTitle: 'Reflexiones Diarias de Amor Propio en TikTok ($1.75 USD)'
        };
      case 'youtube':
        return {
          id: 'youtube' as const,
          name: 'YouTube',
          badgeText: 'Reflexiones · $1.75',
          price: 1.75,
          icon: <YouTubeStickerIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
          accentGradient: 'from-red-600 via-red-500 to-stone-900',
          accentText: 'text-red-600',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          description: 'Un espacio sagrado e independiente con música y la energía transformadora para acompañar tu superación día a día.',
          redirectLabel: 'Ir a mi Canal de YouTube Oficial',
          paymentTitle: 'Reflexiones Diarias de Amor Propio en YouTube ($1.75 USD)'
        };
    }
  };

  const current = getNetworkDetails(selectedNetwork);
  const currentUrl = links[selectedNetwork] || DEFAULT_LINKS[selectedNetwork];
  const arsPrice = getArsAmount(current.price, DEFAULT_ARS_EXCHANGE_RATE);

  // Código HTML y CSS limpio y profesional para entregar al usuario
  const generatedHtmlCssCode = `<!-- ============================================================
  ALMANAQUE DE AMOR PROPIO - BOTONES GLOBALES DE REDES & PASES
  Precios oficiales: Instagram ($1.75) | Facebook ($1.75) | Blogger ($1.75) | YouTube ($1.75) | TikTok ($1.75)
  Diseño responsivo para Celular, Tablet y Notebook
  ============================================================ -->

<div class="almanaque-social-container">
  <!-- Botón Instagram ($1.75 USD) -->
  <a href="${links.instagram}" target="_blank" rel="noopener noreferrer" class="almanaque-btn btn-instagram" title="Pase de Instagram por $1.75 USD">
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    </div>
    <span class="btn-label">Instagram</span>
    <span class="btn-badge">$1.75</span>
  </a>

  <!-- Botón Facebook ($1.75 USD) -->
  <a href="${links.facebook}" target="_blank" rel="noopener noreferrer" class="almanaque-btn btn-facebook" title="Pase de Facebook por $1.75 USD">
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </div>
    <span class="btn-label">Facebook</span>
    <span class="btn-badge">$1.75</span>
  </a>

  <!-- Botón Blogger ($1.75 USD) -->
  <a href="${links.blogger}" target="_blank" rel="noopener noreferrer" class="almanaque-btn btn-blogger" title="Pase de Blogger por $1.75 USD">
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2zm-4.7 6.4c0 .8-.7 1.5-1.5 1.5h-.8v-3h.8c.8 0 1.5.7 1.5 1.5zm.9 6.8c0 .9-.8 1.6-1.7 1.6h-4.2V7.2h3.9c1.4 0 2.5 1.1 2.5 2.5 0 .8-.4 1.5-1 1.9.9.4 1.5 1.3 1.5 2.4z"/>
      </svg>
    </div>
    <span class="btn-label">Blogger</span>
    <span class="btn-badge">$1.75</span>
  </a>

  <!-- Botón YouTube ($1.75 USD) -->
  <a href="${links.youtube}" target="_blank" rel="noopener noreferrer" class="almanaque-btn btn-youtube" title="Reflexiones YouTube por $1.75 USD">
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    </div>
    <span class="btn-label">YouTube</span>
    <span class="btn-badge badge-alt">$1.75</span>
  </a>

  <!-- Botón TikTok ($1.75 USD) -->
  <a href="${links.tiktok}" target="_blank" rel="noopener noreferrer" class="almanaque-btn btn-tiktok" title="Reflexiones TikTok por $1.75 USD">
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23.99.04 2.09.7 2.85.67.76 1.71 1.15 2.69 1.03.95-.08 1.81-.66 2.24-1.5.22-.45.31-.96.31-1.47V.02z"/>
      </svg>
    </div>
    <span class="btn-label">TikTok</span>
    <span class="btn-badge badge-alt">$1.75</span>
  </a>
</div>

<style>
/* CSS Limpio, Armonioso y Responsivo para los Botones */
.almanaque-social-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e7e5e4;
  border-radius: 9999px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.almanaque-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 9999px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.25s ease;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.almanaque-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.almanaque-btn .btn-icon svg {
  width: 15px;
  height: 15px;
  display: block;
}

.almanaque-btn .btn-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Estilos específicos de cada red respetando su energía */
.btn-instagram {
  background: linear-gradient(135deg, #f59e0b, #e11d48, #9333ea);
  color: #ffffff;
}

.btn-facebook {
  background: linear-gradient(135deg, #1877f2, #0d5ac1);
  color: #ffffff;
}

.btn-blogger {
  background: linear-gradient(135deg, #ea580c, #f59e0b);
  color: #ffffff;
}

.btn-youtube {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #ffffff;
}

.btn-tiktok {
  background: linear-gradient(135deg, #1c1917, #0c0a09);
  color: #fda4af;
  border: 1px solid rgba(251, 113, 133, 0.3);
}

/* Adaptación fluida para Celulares y Tablets */
@media (max-width: 640px) {
  .almanaque-social-container {
    border-radius: 24px;
    padding: 10px;
    gap: 8px;
  }
  .almanaque-btn {
    padding: 6px 11px;
    font-size: 12px;
  }
  .almanaque-btn .btn-badge {
    font-size: 10px;
    padding: 1px 5px;
  }
}
</style>`;

  const copyHtmlCss = () => {
    navigator.clipboard?.writeText(generatedHtmlCssCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-stone-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl sm:rounded-[36px] border border-stone-200/90 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="px-5 sm:px-7 py-4.5 border-b border-stone-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-300/60 flex items-center justify-center text-rose-700 shadow-xs">
              <Sparkles className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                  Almanaque de Amor Propio · Redes & Pases
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 hidden sm:inline-block">
                  Pase Oficial $1.75 USD
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pase de acceso con pasarela de pago y redirección directa a tus redes oficiales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SELECTOR DE REDES (TABS HORIZONTALES) */}
        <div className="px-4 sm:px-7 pt-4 pb-2 bg-stone-100/60 border-b border-stone-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {(['instagram', 'facebook', 'blogger', 'youtube', 'tiktok'] as SocialNetworkKey[]).map((net) => {
            const isSelected = selectedNetwork === net;
            const details = getNetworkDetails(net);
            return (
              <button
                key={net}
                onClick={() => {
                  setSelectedNetwork(net);
                  setActiveTab('action');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-md scale-102 ring-2 ring-stone-900/10'
                    : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200/80'
                }`}
              >
                <span>{details.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected 
                    ? 'bg-white/20 text-rose-200' 
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  ${details.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* SUB-PESTAÑAS DE VISTA: ACCIÓN / CÓDIGO HTML / CONFIGURAR ENLACE */}
        <div className="px-5 sm:px-7 py-2 bg-white/70 border-b border-stone-200/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('action')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                activeTab === 'action'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Pase & Redirección
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código HTML & CSS</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Cambiar mi enlace</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-600 hidden md:inline">
            Para Celular, Tablet y Notebook
          </span>
        </div>

        {/* CUERPO PRINCIPAL CON SCROLL */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* VISTA 1: ACCIÓN PRINCIPAL (PAGO O REDIRECCIÓN) */}
          {activeTab === 'action' && (
            <div className="space-y-6 animate-fade-in">
              {/* Tarjeta de presentación de la red seleccionada */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-md relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${current.accentGradient} opacity-10 rounded-bl-full pointer-events-none`} />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {/* Ícono Sticker en tamaño medio con efecto troquelado */}
                  <div className="shrink-0 flex items-center justify-center p-1 bg-stone-50 rounded-2xl border border-stone-200/70 shadow-xs">
                    {current.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        {current.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.badgeBg}`}>
                        ${current.price} USD
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        Pase Oficial Unificado
                      </span>
                    </div>

                    <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                      {current.description}
                    </p>

                    <div className="pt-1 text-xs text-stone-600 flex items-center justify-center sm:justify-start gap-3">
                      <span>• Pasarelas: Mercado Pago (ARS) & PayPal (USD)</span>
                      <span>• Descarga digital automática</span>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN: 1. PAGAR EL PASE ($1.75 USD)  2. REDIRIGIR A LA RED */}
                <div className="mt-7 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* BOTÓN 1: PAGO DIRECTO */}
                  <button
                    onClick={() => {
                      onClose();
                      onProceedToPayment(selectedNetwork, current.paymentTitle, current.price);
                    }}
                    className={`w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r ${current.accentGradient} text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2 group`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar Pase de ${current.price} USD</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* BOTÓN 2: REDIRECCIÓN A LA RED SOCIAL */}
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-xs hover:shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>{current.redirectLabel}</span>
                    <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors" />
                  </a>
                </div>

                {/* NOTA DE CONVERSIÓN Y TRANSPARENCIA */}
                <div className="mt-4 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-500 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Argentina: Facturación en ARS (~${arsPrice.toLocaleString()} ARS a tipo oficial protegido).</span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Enlace configurado: {currentUrl.replace('https://', '')}
                  </span>
                </div>
              </div>

              {/* Mensaje de Amor Propio y Paz */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
                <p className="text-xs text-rose-900 leading-relaxed">
                  <strong>Un espacio sagrado e independiente:</strong> Creado con música y energía transformadora para acompañar tu superación día a día, manteniendo la calma y el amor propio en todos tus dispositivos.
                </p>
              </div>
            </div>
          )}

          {/* VISTA 2: CÓDIGO HTML & CSS LIMPIO Y LISTO PARA COPIAR */}
          {activeTab === 'code' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Código HTML & CSS Limpio para tu Web o Blog
                  </h3>
                  <p className="text-xs text-stone-500">
                    Copia y pega este bloque en Blogger, WordPress o cualquier página web. No requiere conocimientos de programación.
                  </p>
                </div>

                <button
                  onClick={copyHtmlCss}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Copiado con Éxito!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 p-4 font-mono text-xs overflow-x-auto max-h-[380px] shadow-inner">
                <pre className="whitespace-pre">{generatedHtmlCssCode}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>¿Cómo usar este código si no eres programador?</strong>
                  <p className="mt-0.5 text-amber-800">
                    En Blogger: Ve a tu panel &gt; <em>Diseño</em> &gt; <em>Añadir un gadget</em> &gt; Elige <strong>HTML/Javascript</strong> &gt; Pega este código y haz clic en Guardar. Los botones quedarán automáticamente adaptados a celular, tablet y notebook.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: CONFIGURAR ENLACE DE RED SOCIAL (SIN SER PROGRAMADOR) */}
          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Personalizar el Enlace de {current.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Ingresa la dirección web exacta de tu cuenta, grupo o blog. Se guardará de inmediato y todos los botones redirigirán a ella.
                </p>
              </div>

              <form onSubmit={handleSaveUrl} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    URL o enlace oficial de {current.name}:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder={`Ej: https://www.${selectedNetwork}.com/tu_cuenta`}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Guardar
                    </button>
                  </div>
                </div>

                {savedSettingsMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡Enlace guardado correctamente en tu navegador!</span>
                  </div>
                )}
              </form>

              {/* Lista de enlaces actuales */}
              <div className="pt-4 border-t border-stone-200/70 space-y-2">
                <h4 className="text-xs font-bold text-stone-700">Tus enlaces configurados actualmente:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['instagram', 'facebook', 'blogger', 'youtube', 'tiktok'] as SocialNetworkKey[]).map((k) => (
                    <div key={k} className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                      <span className="font-semibold capitalize text-stone-800">{k}:</span>
                      <a 
                        href={links[k]} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-stone-500 hover:text-stone-900 truncate max-w-[170px] text-[11px]"
                      >
                        {links[k]}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PIE DE PÁGINA MODAL */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-stone-200/80 bg-stone-50 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-serif italic">Amor Propio & Paz Interior · 2027</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
