import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  CreditCard, 
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import { UserAccount, PlanCategory } from '../../types';
import { 
  isUserAuthorizedGuest, 
  checkFreePromoSpotAvailable, 
  claimPromoSpotIfAvailable,
  DECEMBER_2026_PROMO_START 
} from '../utils/tierAccess';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onOpenPayment: () => void;
  onSimulateTrialExpired?: () => void;
  onResetTrial?: () => void;
  onSetPlanAndStatus?: (plan: PlanCategory, status: 'in_trial' | 'active_paid' | 'trial_expired') => void;
}

const PLAN_NAMES: Record<PlanCategory, string> = {
  cat1: "Categoría 1 ($2.25/mes)",
  cat2: "Categoría 2 ($4.99/mes)",
  circulo: "Círculo de Paz ($9.99/mes)",
  cat3: "Categoría 3 ($25.00/anualidad)"
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onOpenPayment,
  onSimulateTrialExpired,
  onResetTrial,
  onSetPlanAndStatus
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanCategory>('circulo');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Manejo de Registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password || !name) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        // Verificar si el correo ya existe
        const storedUsersStr = localStorage.getItem('zen_registered_users');
        const users: UserAccount[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          setErrorMsg('Este correo ya se encuentra registrado. Por favor inicia sesión.');
          setIsProcessing(false);
          return;
        }

        // Verificar disponibilidad de los 100 cupos gratuitos (a partir de diciembre de 2026)
        const promoCheck = checkFreePromoSpotAvailable(email);
        const isFree = promoCheck.isAvailable || isUserAuthorizedGuest({ email } as any);

        if (isFree && !isUserAuthorizedGuest({ email } as any)) {
          claimPromoSpotIfAvailable(email);
        }

        const now = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 30);

        const newUser: UserAccount = {
          id: `user-${Date.now()}`,
          name,
          email,
          plan: selectedPlan,
          trialStartDate: now.toISOString(),
          trialEndDate: trialEnd.toISOString(),
          paymentStatus: isFree ? 'in_trial' : 'trial_expired',
          paymentHistory: []
        };

        users.push(newUser);
        localStorage.setItem('zen_registered_users', JSON.stringify(users));
        localStorage.setItem('zen_current_user', JSON.stringify(newUser));

        setIsProcessing(false);
        if (isFree) {
          setSuccessMsg('✨ ¡Cuenta creada exitosamente! Tus 30 días de prueba gratuita han comenzado.');
        } else {
          setSuccessMsg('✨ Cuenta creada. Los 100 cupos gratuitos han concluido; activa tu suscripción para acceder a todas las funciones.');
        }
        
        setTimeout(() => {
          onLogin(newUser);
          onClose();
        }, 1200);

      } catch (err) {
        setErrorMsg('Ocurrió un error al registrar la cuenta.');
        setIsProcessing(false);
      }
    }, 800);
  };

  // Manejo de Inicio de Sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor introduce tu correo y contraseña.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const storedUsersStr = localStorage.getItem('zen_registered_users');
        const users: UserAccount[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

        let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // Si es usuario demo de bienvenida o primera vez
        if (!found) {
          // Crear automáticamente cuenta para agilizar uso si ingresa datos válidos
          const now = new Date();
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 30);

          found = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0] || 'Miembro de Paz',
            email,
            plan: 'circulo',
            trialStartDate: now.toISOString(),
            trialEndDate: trialEnd.toISOString(),
            paymentStatus: 'in_trial',
            paymentHistory: []
          };
          users.push(found);
          localStorage.setItem('zen_registered_users', JSON.stringify(users));
        }

        localStorage.setItem('zen_current_user', JSON.stringify(found));
        setIsProcessing(false);
        setSuccessMsg('✨ ¡Bienvenido/a de regreso!');

        setTimeout(() => {
          onLogin(found!);
          onClose();
        }, 800);
      } catch (err) {
        setErrorMsg('Error al verificar las credenciales.');
        setIsProcessing(false);
      }
    }, 700);
  };

  // Entrada Rápida de Prueba (Demo)
  const handleQuickDemo = () => {
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);

    const demoUser: UserAccount = {
      id: 'demo-user-zen',
      name: 'Alma Consciente',
      email: 'paz@almanaque.com',
      plan: 'circulo',
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      paymentStatus: 'in_trial',
      paymentHistory: []
    };

    localStorage.setItem('zen_current_user', JSON.stringify(demoUser));
    onLogin(demoUser);
    onClose();
  };

  // Cálculo de días restantes de prueba para el usuario logueado
  const getTrialDaysLeft = (user: UserAccount): number => {
    if (user.paymentStatus === 'trial_expired') return 0;
    if (user.paymentStatus === 'active_paid') return 30;

    const end = new Date(user.trialEndDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-md bg-[#FAF8F5] border border-stone-200/90 rounded-[28px] shadow-2xl p-6 sm:p-8 my-6 text-stone-900 overflow-hidden"
      >
        {/* Auras decorativas de paz */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-gold-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-terracotta-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          id="auth-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-full transition-all cursor-pointer z-20"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* VISTA 1: USUARIO YA IDENTIFICADO (PERFIL Y ESTADO DEL PLAN / PRUEBA) */}
        {currentUser ? (
          <div id="user-profile-view" className="space-y-6 relative z-10">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-terracotta-100 text-terracotta-700 rounded-full flex items-center justify-center text-xl font-serif font-bold shadow-inner border border-terracotta-200">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {currentUser.name}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {currentUser.email}
              </p>
            </div>

            {/* Tarjeta de Estado del Plan y Prueba Gratuita */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs text-stone-500 font-medium">Plan seleccionado</span>
                <span className="text-xs font-bold text-stone-800">
                  {PLAN_NAMES[currentUser.plan] || currentUser.plan}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">Estado de la suscripción</span>
                {currentUser.paymentStatus === 'active_paid' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Suscripción Activa (Paga)
                  </span>
                ) : currentUser.paymentStatus === 'trial_expired' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Prueba Vencida (Pago requerido)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTrialDaysLeft(currentUser)} días de prueba restante
                  </span>
                )}
              </div>

              {currentUser.paymentStatus === 'in_trial' && (
                <div className="pt-2">
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(5, (getTrialDaysLeft(currentUser) / 30) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 text-center mt-1.5">
                    Tienes 30 días de acceso gratuito. Al finalizar, se solicitará el abono mensual para continuar.
                  </p>
                </div>
              )}

              {/* Anualidades desbloqueadas */}
              <div className="pt-2.5 border-t border-stone-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 font-medium">Anualidades Habilitadas (Cat. 3):</span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {(() => {
                      const years = currentUser.unlockedYears && currentUser.unlockedYears.length > 0 
                        ? currentUser.unlockedYears 
                        : [2027];
                      return `${years.length} ${years.length === 1 ? 'año' : 'años'}`;
                    })()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const years = currentUser.unlockedYears && currentUser.unlockedYears.length > 0 
                      ? currentUser.unlockedYears 
                      : [2027];
                    return years.sort((a, b) => a - b).map((yr) => (
                      <span 
                        key={yr}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                      >
                        <span>✓ Año {yr}</span>
                      </span>
                    ));
                  })()}
                </div>
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  En Categoría 3 (Prémium), el acceso se desbloquea por anualidad individual ($25.00 USD) para cada año entre el 2028 y el 3037.
                </p>
              </div>
            </div>

            {/* Botón de Pago / Suscripción */}
            {currentUser.paymentStatus !== 'active_paid' && (
              <div className="space-y-1.5">
                <button
                  id="profile-pay-now-btn"
                  onClick={() => {
                    onClose();
                    onOpenPayment();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-amber-700 hover:brightness-110 text-white rounded-full font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {currentUser.paymentStatus === 'trial_expired' 
                      ? 'Activar Suscripción en Billetera de Pagos' 
                      : 'Asegurar / Pagar Suscripción en Billetera'}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-medium">
                  <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                    <span className="w-3 h-3 rounded-full bg-sky-500 text-white inline-flex items-center justify-center text-[7px] font-black">M</span>
                    Mercado Pago Pro (Argentina)
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                    <span className="w-3 h-3 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[7px] font-black">P</span>
                    PayPal Checkout (Global)
                  </span>
                </div>
              </div>
            )}

            {/* HERRAMIENTAS DE PRUEBA Y DEMOSTRACIÓN PARA EL CLIENTE */}
            <div className="p-3.5 bg-stone-100/90 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-600 block">
                  Simulación de Niveles y Visibilidad (Prueba Instantánea)
                </span>
                <span className="text-[10px] text-terracotta-700 font-bold">1-Clic</span>
              </div>
              
              {onSetPlanAndStatus && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onSetPlanAndStatus('cat1', 'in_trial')}
                    className={`p-1.5 rounded-lg border font-medium text-left transition-all ${
                      currentUser.paymentStatus === 'in_trial'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold ring-1 ring-amber-300'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-[10px] font-bold text-amber-700">Mes Gratis</span>
                    <span className="text-[10px] text-stone-500">$0 · Solo Básico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetPlanAndStatus('cat1', 'active_paid')}
                    className={`p-1.5 rounded-lg border font-medium text-left transition-all ${
                      currentUser.paymentStatus === 'active_paid' && currentUser.plan === 'cat1'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold ring-1 ring-emerald-300'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-[10px] font-bold text-emerald-700">Categoría 1</span>
                    <span className="text-[10px] text-stone-500">$2.25 · 31 Días</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetPlanAndStatus('cat2', 'active_paid')}
                    className={`p-1.5 rounded-lg border font-medium text-left transition-all ${
                      currentUser.paymentStatus === 'active_paid' && currentUser.plan === 'cat2'
                        ? 'bg-teal-100 border-teal-300 text-teal-900 font-bold ring-1 ring-teal-300'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-[10px] font-bold text-teal-700">Categoría 2</span>
                    <span className="text-[10px] text-stone-500">$4.99 · 432Hz/Diario</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetPlanAndStatus('circulo', 'active_paid')}
                    className={`p-1.5 rounded-lg border font-medium text-left transition-all ${
                      currentUser.paymentStatus === 'active_paid' && currentUser.plan === 'circulo'
                        ? 'bg-gold-100 border-gold-300 text-gold-900 font-bold ring-1 ring-gold-300'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-[10px] font-bold text-gold-700">Círculo Paz</span>
                    <span className="text-[10px] text-stone-500">$9.99 · Oráculo/Redes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSetPlanAndStatus('cat3', 'active_paid')}
                    className={`p-1.5 rounded-lg border font-medium text-left transition-all col-span-2 sm:col-span-2 ${
                      currentUser.paymentStatus === 'active_paid' && currentUser.plan === 'cat3'
                        ? 'bg-terracotta-100 border-terracotta-300 text-terracotta-900 font-bold ring-1 ring-terracotta-400'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-[10px] font-bold text-terracotta-700">Categoría 3 (Maestro)</span>
                    <span className="text-[10px] text-stone-500">$25.00 · Fotos Exclusivas / Anualidad</span>
                  </button>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  id="simulate-expired-btn"
                  onClick={onSimulateTrialExpired}
                  className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center"
                  title="Simula que transcurrieron los 30 días para probar la pasarela de pagos obligatoria"
                >
                  Simular Mes Vencido
                </button>
                <button
                  id="reset-trial-btn"
                  onClick={onResetTrial}
                  className="flex-1 py-1.5 px-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  title="Restablece la prueba gratuita a 30 días completos"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restablecer 30 Días
                </button>
              </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <button
              id="profile-logout-btn"
              onClick={onLogout}
              className="w-full py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-full font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          /* VISTA 2: FORMULARIO DE INICIO DE SESIÓN / REGISTRO */
          <div id="auth-forms-view" className="space-y-5 relative z-10">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto bg-terracotta-100 text-terracotta-600 rounded-2xl flex items-center justify-center shadow-xs">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h3>
              <p className="text-xs text-stone-500">
                {authMode === 'login' 
                  ? 'Accede a tu diario, calendario y camino de paz interior'
                  : 'Regístrate hoy con 30 días de prueba gratuita'}
              </p>
            </div>

            {/* Selector de Pestaña: Iniciar Sesión vs Registro */}
            <div className="flex bg-stone-200/70 p-1 rounded-full text-xs font-semibold">
              <button
                id="tab-login-btn"
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
                className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                  authMode === 'login' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                id="tab-register-btn"
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
                className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                  authMode === 'register' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Registrarse (30d Gratis)
              </button>
            </div>

            {/* Mensajes de feedback */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Formulario Dinámico */}
            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Tu nombre completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      id="auth-input-name"
                      type="text"
                      placeholder="Ej. Sofía Morales"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 shadow-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    id="auth-input-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    id="auth-input-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 shadow-xs"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Plan elegido para iniciar con 30 días gratis
                  </label>
                  <select
                    id="auth-select-plan"
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value as PlanCategory)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 shadow-xs cursor-pointer"
                  >
                    <option value="cat1">Categoría 1 · $2.25 USD/mes (Esencial)</option>
                    <option value="cat2">Categoría 2 · $4.99 USD/mes (432Hz + Diario)</option>
                    <option value="circulo">Círculo de Paz · $9.99 USD/mes (Oráculo + Comunidad)</option>
                    <option value="cat3">Categoría 3 · $25.00 USD/año (Prémium Anual)</option>
                  </select>
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-terracotta-600 hover:bg-terracotta-700 active:scale-[0.99] text-white font-semibold rounded-full shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando...</span>
                  </span>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Acceder a mi Cuenta' : 'Crear Cuenta y Activar 30 Días Gratis'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-stone-200 flex-1" />
              <span className="text-[10px] uppercase font-bold text-stone-400">O acceso rápido</span>
              <div className="h-px bg-stone-200 flex-1" />
            </div>

            {/* Botón de Acceso Demo Inmediato */}
            <button
              id="auth-quick-demo-btn"
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-full border border-stone-300/80 text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Entrar como Visitante Consciente (Demo)</span>
            </button>

            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tus datos y reflexiones están protegidos con cifrado local seguro</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
