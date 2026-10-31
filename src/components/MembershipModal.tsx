import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Check, X, Shield, Award, Gift, Users, Clock, ArrowRight, CreditCard, Wallet } from 'lucide-react';
import { PlanCategory } from '../../types';
import { 
  getClaimedPromoSpots, 
  claimPromoSpotIfAvailable, 
  checkFreePromoSpotAvailable, 
  DECEMBER_2026_PROMO_START,
  OFFICIAL_ALMANAQUE_LOGO 
} from '../utils/tierAccess';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: string) => void;
  onOpenPayment?: (plan: PlanCategory) => void;
}

interface PlanDetails {
  id: PlanCategory;
  name: string;
  tagline: string;
  monthlyPrice: number;
  monthlyPriceStr: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
}

const PLANS: PlanDetails[] = [
  {
    id: 'cat1',
    name: 'Categoría 1',
    tagline: 'Acompañamiento Esencial',
    monthlyPrice: 2.25,
    monthlyPriceStr: '$2.25',
    features: [
      'Acceso completo a los 31 días del mes de sabiduría y mantras',
      'Calendario perpetuo completo (2027 a 3037) con feriados y bisiestos',
      'Afirmaciones profundas y oraciones diarias para autoobservación',
      'Clima, zonas horarias y reloj mundial en vivo'
    ]
  },
  {
    id: 'cat2',
    name: 'Categoría 2',
    tagline: 'Calma & Profundización',
    monthlyPrice: 4.99,
    monthlyPriceStr: '$4.99',
    features: [
      'Todo lo incluido en Categoría 1 (31 días + Años 2027-3037)',
      'Frecuencias continuas 432 Hz y Cuencos Tibetanos ilimitados',
      'Diario Íntimo de sanación, desahogo privado y gratitud',
      'Ejercicios guiados de respiración consciente (Pranayama)'
    ]
  },
  {
    id: 'circulo',
    name: 'Círculo de Paz',
    tagline: 'Comunidad Consciente & Oráculo',
    monthlyPrice: 9.99,
    monthlyPriceStr: '$9.99',
    badge: 'Más Elegido',
    badgeColor: 'bg-gold-500 text-white',
    features: [
      'Todo lo de Categorías 1 y 2 (31 días, 2027-3037, 432Hz y Diario)',
      'Oráculo sagrado de Cartas de Luz y Guía diaria orientadora',
      'Generador y exportador para Blogger, Instagram, Facebook y YouTube',
      'Comunidad consciente y meditaciones guiadas'
    ]
  },
  {
    id: 'cat3',
    name: 'Categoría 3 (Prémium)',
    tagline: 'Acceso por Anualidad & Nivel Maestro',
    monthlyPrice: 25.0,
    monthlyPriceStr: '$25.00 / año',
    badge: 'Acceso por Anualidad',
    badgeColor: 'bg-terracotta-600 text-white',
    features: [
      'Personalización exclusiva de fotos: Subida de foto de portada y de los 12 meses',
      'Acceso por Anualidad: Pago del Año 2027 incluido; desbloqueo año a año para 2028 a 3037',
      'Al abonar cada año (ej. 2028), se activa ese año completo (12 meses, efemérides y galería)',
      '¡TODOS LOS BENEFICIOS DESBLOQUEADOS AL 100% del año adquirido!',
      'Canal de consulta y acompañamiento prioritario personalizado',
      'Descarga de afirmaciones y audios en alta fidelidad'
    ]
  }
];

export const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose, onSuccess, onOpenPayment }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanCategory>('circulo');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activated, setActivated] = useState(false);
  const [claimedSpots, setClaimedSpots] = useState<number>(0);

  // Cargar cupos restantes para los primeros 100 (Liberado a 0, se cuenta a partir de diciembre de 2026)
  useEffect(() => {
    try {
      const savedSpots = localStorage.getItem('zen_claimed_spots_first100');
      // Si estaba en 76 de pruebas anteriores, resetear a 0 como solicitó el usuario
      if (!savedSpots || savedSpots === '76') {
        localStorage.setItem('zen_claimed_spots_first100', '0');
        setClaimedSpots(0);
      } else {
        const parsed = parseInt(savedSpots, 10);
        setClaimedSpots(isNaN(parsed) ? 0 : parsed);
      }
    } catch {
      setClaimedSpots(0);
    }
  }, []);

  if (!isOpen) return null;

  const currentPlan = PLANS.find(p => p.id === selectedPlan) || PLANS[2];
  const spotsLeft = Math.max(0, 100 - claimedSpots);
  const isPromoActive = new Date() >= DECEMBER_2026_PROMO_START;

  // Calcular fecha en 30 días para mostrar transparencia total
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30);
  const trialEndFormatted = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(trialEndDate);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Si los 100 cupos están agotados: el resto debe abonar su suscripción
    if (spotsLeft <= 0) {
      if (onOpenPayment) {
        onClose();
        onOpenPayment(currentPlan.id);
      }
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Recién a partir de diciembre de 2026 se cuenta cada cupo ocupado
      let nextSpots = claimedSpots;
      if (isPromoActive) {
        nextSpots = Math.min(100, claimedSpots + 1);
        setClaimedSpots(nextSpots);
        try {
          localStorage.setItem('zen_claimed_spots_first100', String(nextSpots));
        } catch {}
      }

      try {
        localStorage.setItem('zen_active_membership', JSON.stringify({
          planId: currentPlan.id,
          planName: currentPlan.name,
          price: currentPlan.monthlyPrice,
          email,
          name,
          trialDays: 30,
          trialEndDate: trialEndDate.toISOString(),
          status: 'trial_active',
          activatedAt: new Date().toISOString()
        }));
      } catch {}

      setIsProcessing(false);
      setActivated(true);
      onSuccess(currentPlan.id);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-stone-200/90 rounded-[32px] shadow-2xl p-5 sm:p-8 my-6 text-stone-900 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Auras decorativas de calma */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-terracotta-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-full transition-all cursor-pointer z-20"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {activated ? (
          /* PANTALLA DE ÉXITO Y BIENVENIDA */
          <div className="text-center py-8 px-2 sm:px-6 space-y-5 relative z-10 overflow-y-auto">
            <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shadow-inner animate-bounce">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 block">
                ¡Mes Gratis Activado!
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Bienvenid@ al Camino de Paz
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Tu registro gratuito incluye acceso al contenido básico (Días 1, 2 y 3 del mes y calendario 2027). Para desbloquear los 31 días completos y todos los beneficios de {currentPlan.name}, puedes activar tu suscripción mensual en cualquier momento.
              </p>
            </div>

            {/* Tarjeta comprobante del período de prueba */}
            <div className="max-w-md mx-auto bg-white/90 p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs text-stone-500 font-medium">Categoría de interés</span>
                <span className="text-xs font-bold text-stone-900">{currentPlan.name}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs text-stone-500 font-medium">Nivel de acceso actual</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Mes Gratis (Contenido Básico)
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs text-stone-500 font-medium">Vigencia del mes gratis</span>
                <span className="text-xs text-stone-700 font-mono">Hasta {trialEndFormatted}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Desbloqueo de todos los beneficios</span>
                <span className="font-bold text-terracotta-700 font-mono">{currentPlan.monthlyPriceStr} USD / mes</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-full font-medium transition-colors cursor-pointer text-xs sm:text-sm"
              >
                Comenzar con el contenido básico
              </button>
              {onOpenPayment && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPayment(selectedPlan);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full font-semibold shadow-md transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  <span>Pasar a Pago Premium ({currentPlan.monthlyPriceStr}/mes)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* CONTENIDO PRINCIPAL CON LOS 4 PLANES Y LA PRUEBA DE 30 DÍAS */
          <div className="space-y-4 relative z-10 overflow-y-auto pr-1">
            
            {/* Header */}
            <div className="text-center space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100/90 border border-gold-300/70 rounded-full text-gold-800 text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                <span>Membresías & Círculo de Paz</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                Invierte en tu paz, calma y amor propio
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
                Acompañamiento diario para transmutar viejas memorias e integrar hábitos de gratitud y serenidad.
              </p>
            </div>

            {/* BANNER DESTACADO: PRUEBA GRATUITA DE 30 DÍAS PARA LOS PRIMEROS 100 */}
            <div id="membership-trial-banner" className="bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-amber-700 text-white p-4 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base leading-tight">
                      100 Cupos Gratuitos · Inicio Diciembre de 2026
                    </h4>
                    <p className="text-[11px] text-white/90">
                      Conteo liberado a 0. Solo los primeros 100 usuarios visualizan 30 días gratis a partir de Diciembre 2026; el resto abona su cuota regular.
                    </p>
                  </div>
                </div>

                <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl text-right shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    <Users className="w-3.5 h-3.5 text-gold-300" />
                    <span>¡Quedan {spotsLeft} cupos!</span>
                  </div>
                  <span className="text-[9px] text-white/80 block">de 100 plazas gratis (Inicio Dic. 2026)</span>
                </div>
              </div>

              {/* Barra de progreso de cupos */}
              <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gold-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, claimedSpots)}%` }}
                />
              </div>
            </div>

            {/* SELECTOR DE LAS 4 CATEGORÍAS */}
            <div id="membership-plans-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    id={`plan-card-${plan.id}`}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-terracotta-600 bg-white shadow-lg ring-2 ring-terracotta-400/30 -translate-y-1'
                        : 'border-stone-200/80 bg-white/70 hover:bg-white hover:border-stone-300 shadow-xs'
                    }`}
                  >
                    {/* Badge opcional */}
                    {plan.badge && (
                      <div className={`absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${plan.badgeColor}`}>
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-serif font-bold uppercase tracking-wider ${isSelected ? 'text-terracotta-700' : 'text-stone-700'}`}>
                          {plan.name}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-terracotta-600 border-terracotta-600 text-white' : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-500 font-medium mt-0.5 line-clamp-1">
                        {plan.tagline}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-stone-100">
                        {/* Indicador de 30 días gratis */}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                          30 Días Gratis
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif font-bold text-stone-900 font-mono">
                            {plan.monthlyPriceStr}
                          </span>
                          <span className="text-[11px] text-stone-500">/mes</span>
                        </div>
                        <span className="text-[9px] text-stone-400 block mt-0.5">
                          después de los 30 días
                        </span>
                      </div>

                      {/* Lista de características del plan */}
                      <ul className="mt-3 space-y-1.5 text-[11px] text-stone-600">
                        {plan.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-tight">
                            <Check className="w-3 h-3 text-sage-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>Cancela libremente</span>
                      <span className="font-semibold text-terracotta-600">$0.00 hoy</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DETALLE DEL PLAN SELECCIONADO */}
            <div className="bg-stone-100/70 rounded-2xl p-3.5 border border-stone-200/80 text-xs text-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  Beneficios incluidos en {currentPlan.name}:
                </span>
                <span className="text-[11px] font-bold text-terracotta-700 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                  {currentPlan.monthlyPriceStr} USD / mes tras 30 días gratis
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMULARIO DE SUSCRIPCIÓN CON PRUEBA GRATIS */}
            <form id="membership-subscription-form" onSubmit={handleSubscribe} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  id="membership-input-name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-all"
                  required
                />
                <input
                  id="membership-input-email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-all"
                  required
                />
              </div>

              {/* AVISO DE VISIBILIDAD */}
              <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Acceso según tu elección:</span>
                </div>
                <p>
                  • <strong>Pago Premium:</strong> Desbloquea todos los beneficios de {currentPlan.name} según el importe abonado ({currentPlan.monthlyPriceStr}/mes).
                </p>
                <p>
                  • <strong>Mes Gratis ($0):</strong> Acceso de prueba al contenido básico (Días 1 a 3 y año 2027).
                </p>
              </div>

              {/* OPCIÓN 1: PAGO PREMIUM (TODOS LOS BENEFICIOS) */}
              {onOpenPayment && (
                <div className="space-y-1.5">
                  <button
                    id="membership-pay-premium-direct-btn"
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPayment(selectedPlan);
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-terracotta-600 via-amber-600 to-terracotta-700 hover:from-terracotta-700 hover:to-amber-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-gold-300" />
                    <span>
                      Inscribirme con Pago Premium ({currentPlan.monthlyPriceStr}/mes) · Todos los Beneficios
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-medium">
                    <span className="inline-flex items-center gap-1 text-sky-700">
                      <span className="w-3 h-3 rounded-full bg-sky-500 text-white inline-flex items-center justify-center text-[7px] font-black">M</span>
                      Mercado Pago Checkout Pro (Argentina)
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-blue-700">
                      <span className="w-3 h-3 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[7px] font-black">P</span>
                      PayPal Checkout (Global)
                    </span>
                  </div>
                </div>
              )}

              {/* OPCIÓN 2: MES GRATIS (SOLO CONTENIDO BÁSICO) */}
              <button
                id="membership-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-medium rounded-full transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {isProcessing ? (
                  <span>Activando mes gratis básico...</span>
                ) : (
                  <>
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      Anotarme solo para el Mes Gratis ($0.00 hoy · Acceso Básico Días 1 a 3)
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* SELLOS DE CONFIANZA */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500 pt-1 pb-1">
              <span className="flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-terracotta-600" /> 
                30 días de prueba sin cargo
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> 
                Sin compromiso, cancela cuando quieras
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-gold-600" /> 
                Primeros 100 con beneficio exclusivo
              </span>
            </div>

            <div className="p-2.5 bg-stone-100/80 rounded-xl border border-stone-200 text-[10.5px] text-stone-700 text-center space-y-0.5">
              <div><strong>Método de entrega:</strong> Descarga digital automática e inmediata tras el pago, con las restricciones propias de cada categoría.</div>
              <div><strong>Política de devolución:</strong> Al ser un producto digital, una vez que se descarga ya no se puede devolver.</div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
