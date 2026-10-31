import React from 'react';
import { 
  Lock, 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Heart,
  Crown,
  BookOpen,
  Headphones,
  Compass,
  Camera
} from 'lucide-react';
import { PlanCategory, UserAccount } from '../../types';
import { getUserTier, TIER_BENEFITS, UserTier } from '../utils/tierAccess';

interface TierLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPayment: (targetPlan: PlanCategory, targetYear?: number) => void;
  featureName?: string;
  reason?: string;
  minPlanId?: PlanCategory;
  minPriceStr?: string;
  currentUser: UserAccount | null;
  targetYear?: number;
}

export const TierLockModal: React.FC<TierLockModalProps> = ({
  isOpen,
  onClose,
  onOpenPayment,
  featureName = 'Contenido de Profundización',
  reason = 'Este beneficio está disponible para miembros con suscripción de pago activa.',
  minPlanId = 'cat1',
  minPriceStr = '$2.25',
  currentUser,
  targetYear
}) => {
  if (!isOpen) return null;

  const currentTier = getUserTier(currentUser);
  const currentTierInfo = TIER_BENEFITS[currentTier];

  const handleUpgrade = (plan: PlanCategory) => {
    onClose();
    onOpenPayment(plan, targetYear);
  };

  return (
    <div 
      id="tier-lock-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div 
        id="tier-lock-modal-container"
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-200/90 rounded-[30px] shadow-2xl p-5 sm:p-7 my-6 text-stone-900 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Auras decorativas de luz */}
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

        <div className="space-y-4 overflow-y-auto pr-1 relative z-10">
          {/* Cabecera Serene */}
          <div className="text-center space-y-2 pt-1">
            <div className="w-13 h-13 mx-auto bg-gradient-to-tr from-amber-100 to-terracotta-100 text-terracotta-700 rounded-2xl flex items-center justify-center shadow-xs border border-terracotta-200/60">
              <Lock className="w-6 h-6 text-terracotta-600" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-100/90 text-amber-900 border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>{targetYear && targetYear >= 2028 ? 'Lanzamiento Anual Programado' : 'Beneficio de Pago Requerido'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {featureName}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              {reason}
            </p>

            {targetYear && targetYear >= 2028 && (
              <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-xs text-amber-950 text-left flex items-start gap-2.5 max-w-lg mx-auto">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Cronograma Oficial:</strong> Los calendarios de los años 2028 en adelante tienen su bajada y desbloqueo en el mes de <strong>octubre del año previo</strong> (el calendario 2028 se abre en octubre de 2027; el de 2029 en octubre de 2028, y así sucesivamente).
                </p>
              </div>
            )}
          </div>

          {/* Tarjeta de Estado Actual del Usuario */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                Tu Nivel Actual:
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                  {currentTierInfo.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentTierInfo.badgeColor}`}>
                  {currentTierInfo.priceStr}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {currentTier === 'free_trial' 
                  ? 'Tienes acceso activo a lo básico (Días 1 a 3 y año 2027).'
                  : currentTierInfo.shortDesc}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-[10px] text-stone-400 block">Disponible desde:</span>
              <span className="text-xs sm:text-sm font-bold text-terracotta-700 font-mono">
                {minPriceStr}
              </span>
            </div>
          </div>

          {/* ESCALERA TRANSPARENTE: Aumenta la visibilidad según el importe abonado */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-gold-600" />
                Escala de Visibilidad & Beneficios por Importe Abonado:
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Elige tu categoría:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Categoría 1 ($2.25) */}
              <div 
                onClick={() => handleUpgrade('cat1')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  minPlanId === 'cat1'
                    ? 'border-terracotta-500 bg-white ring-2 ring-terracotta-300/40 shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Categoría 1 (Esencial)</span>
                    <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-md">$2.25 / mes</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span><strong>31 Días completos</strong> de sabiduría</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span><strong>Calendario 2027 a 3037</strong> con feriados</span>
                    </li>
                  </ul>
                </div>
                <button 
                  type="button"
                  className="mt-2.5 w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Activar por $2.25/mes
                </button>
              </div>

              {/* Categoría 2 ($4.99) */}
              <div 
                onClick={() => handleUpgrade('cat2')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  minPlanId === 'cat2'
                    ? 'border-teal-500 bg-white ring-2 ring-teal-300/40 shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Categoría 2 (Calma)</span>
                    <span className="text-xs font-bold text-teal-800 font-mono bg-teal-50 px-2 py-0.5 rounded-md">$4.99 / mes</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>Todo lo de Categoría 1</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-teal-600 shrink-0" />
                      <span><strong>Frecuencias 432 Hz y Cuencos</strong> continuos</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-teal-600 shrink-0" />
                      <span><strong>Diario Íntimo</strong> de sanación y notas</span>
                    </li>
                  </ul>
                </div>
                <button 
                  type="button"
                  className="mt-2.5 w-full py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Activar por $4.99/mes
                </button>
              </div>

              {/* Círculo de Paz ($9.99) */}
              <div 
                onClick={() => handleUpgrade('circulo')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  minPlanId === 'circulo'
                    ? 'border-gold-500 bg-white ring-2 ring-gold-300/40 shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-600" />
                      Círculo de Paz
                    </span>
                    <span className="text-xs font-bold text-gold-900 font-mono bg-gold-100 px-2 py-0.5 rounded-md">$9.99 / mes</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-gold-600 shrink-0" />
                      <span>Todo lo de Categorías 1 y 2</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-gold-600 shrink-0" />
                      <span><strong>Oráculo sagrado</strong> de Cartas de Luz</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-gold-600 shrink-0" />
                      <span><strong>Publicador Blogger & Redes</strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-gold-600 shrink-0" />
                      <span>Comunidad consciente y meditaciones</span>
                    </li>
                  </ul>
                </div>
                <button 
                  type="button"
                  className="mt-2.5 w-full py-1.5 bg-gold-600 hover:bg-gold-700 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Activar por $9.99/mes
                </button>
              </div>

              {/* Categoría 3 ($25.00) - Prémium por Anualidad */}
              <div 
                onClick={() => handleUpgrade('cat3')}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                  targetYear || minPlanId === 'cat3'
                    ? 'border-terracotta-600 bg-white ring-2 ring-terracotta-400/40 shadow-sm'
                    : 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-terracotta-900 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-terracotta-600" />
                      {targetYear ? `Anualidad Año ${targetYear}` : 'Categoría 3 (Prémium)'}
                    </span>
                    <span className="text-xs font-bold text-terracotta-900 font-mono bg-terracotta-100 px-2 py-0.5 rounded-md">
                      $25.00 / año
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                    <li className="flex items-center gap-1.5 font-bold text-terracotta-800">
                      <Check className="w-3 h-3 text-terracotta-600 shrink-0" />
                      <span>{targetYear ? `Desbloquea los 12 meses del Año ${targetYear}` : 'Acceso por anualidad (2027-3037)'}</span>
                    </li>
                    <li className="flex items-center gap-1.5 font-semibold text-terracotta-900 bg-amber-50/80 px-1 rounded">
                      <Check className="w-3 h-3 text-terracotta-600 shrink-0" />
                      <span><strong>Personalización exclusiva de fotos</strong> (Portada y 12 Meses)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-terracotta-600 shrink-0" />
                      <span>Galería fotográfica y efemérides completas</span>
                    </li>
                  </ul>
                </div>
                <button 
                  type="button"
                  className="mt-2.5 w-full py-1.5 bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {targetYear ? `Pagar Anualidad ${targetYear} ($25.00)` : 'Desbloquear Anualidad ($25.00)'}
                </button>
              </div>
            </div>
          </div>

          {/* Botón de Acción Principal Directo */}
          <div className="pt-2">
            <button
              onClick={() => handleUpgrade(targetYear ? 'cat3' : ((minPlanId as PlanCategory) || 'cat1'))}
              className="w-full py-3.5 bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold rounded-full shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>
                {targetYear 
                  ? `Adquirir Anualidad Año ${targetYear} ($25.00 USD)` 
                  : `Desbloquear ${featureName} (${minPriceStr})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Garantía & Confianza */}
          <div className="space-y-1 text-center pt-1">
            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-medium">
              <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 text-white inline-flex items-center justify-center text-[7px] font-black">M</span>
                Mercado Pago Pro (Argentina)
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[7px] font-black">P</span>
                PayPal Checkout (Global)
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                PCI DSS Nivel 1
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400">
              <span>Activación inmediata</span>
              <span>•</span>
              <span>Cancela cuando quieras</span>
              <span>•</span>
              <span>Sin costos ocultos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
