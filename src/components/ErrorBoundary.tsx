import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Error inesperado' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ErrorBoundary capturó una anomalía:', error, errorInfo);
  }

  private handleClearCacheAndReload = () => {
    try {
      // Limpiar datos temporales o corruptos conservando la calma
      sessionStorage.clear();
      // Eliminar posibles llaves defectuosas de localStorage
      const keysToCheck = [
        'zen_registered_users',
        'healing_journal_entries',
        'zen_today_tasks',
        'almanaque_selected_country_json'
      ];
      keysToCheck.forEach(k => {
        try {
          const val = localStorage.getItem(k);
          if (val) JSON.parse(val);
        } catch {
          localStorage.removeItem(k);
        }
      });
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo Almanaque" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/Y7y2tzPp/Elegant-Emblem-Logo-with-Sunflowers-and-Hummingbirds-20260110-202620-0000.png";
                }}
              />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Restaurando la Paz del Almanaque
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Detectamos un leve desajuste en el almacenamiento o memoria caché temporal. No te preocupes, tus datos esenciales están a salvo.
            </p>
            <button
              onClick={this.handleClearCacheAndReload}
              className="w-full mt-2 py-3 px-6 bg-[#C2735C] hover:bg-[#B0604A] text-white font-semibold text-sm rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ✨ Limpiar Caché y Reiniciar con Calma
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
