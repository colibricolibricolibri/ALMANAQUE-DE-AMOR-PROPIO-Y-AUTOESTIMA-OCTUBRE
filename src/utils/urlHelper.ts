/**
 * Utilidades para sanitización y limpieza de URLs en el Almanaque de Amor Propio.
 * Garantiza que tokens internos de desarrollo/previsualización (como __aistudio_auth_token)
 * o parámetros técnicos no aparezcan en la barra de direcciones ni en los enlaces compartidos
 * en redes sociales, Blogger, WhatsApp o portapapeles.
 */

const INTERNAL_QUERY_PARAMS = [
  '__aistudio_auth_token',
  'auth_token',
  'aistudio_token'
];

/**
 * Limpia cualquier URL eliminando tokens de entorno y parámetros técnicos no deseados.
 */
export function getCleanAppUrl(inputUrl?: string): string {
  if (typeof window === 'undefined' && !inputUrl) {
    return 'https://almanaque-amor-propio.web.app';
  }

  try {
    const raw = inputUrl || window.location.href;
    const url = new URL(raw, typeof window !== 'undefined' ? window.location.origin : 'https://almanaque-amor-propio.web.app');

    // Remover tokens internos
    INTERNAL_QUERY_PARAMS.forEach(param => {
      url.searchParams.delete(param);
    });

    const search = url.searchParams.toString();
    const cleanSearch = search ? `?${search}` : '';
    return `${url.origin}${url.pathname}${cleanSearch}${url.hash}`;
  } catch {
    return inputUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://almanaque-amor-propio.web.app');
  }
}

/**
 * Genera una URL limpia lista para compartir en redes sociales, WhatsApp o portapapeles.
 */
export function getShareableUrl(extraParams?: Record<string, string>): string {
  if (typeof window === 'undefined') {
    return 'https://almanaque-amor-propio.web.app';
  }

  try {
    const url = new URL(window.location.href);

    // Eliminar tokens técnicos e incrustados
    INTERNAL_QUERY_PARAMS.forEach(param => url.searchParams.delete(param));
    url.searchParams.delete('embed');
    url.searchParams.delete('blogger');

    // Eliminar parámetros temporales de pasarelas de pago
    url.searchParams.delete('payment');
    url.searchParams.delete('payment_id');
    url.searchParams.delete('collection_id');
    url.searchParams.delete('collection_status');
    url.searchParams.delete('preference_id');
    url.searchParams.delete('status');
    url.searchParams.delete('gateway');
    url.searchParams.delete('token');
    url.searchParams.delete('order_id');

    // Agregar parámetros adicionales si existen (ej. view=day&day=14)
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });
    }

    const search = url.searchParams.toString();
    const cleanSearch = search ? `?${search}` : '';
    return `${url.origin}${url.pathname}${cleanSearch}${url.hash}`;
  } catch {
    return window.location.origin;
  }
}

/**
 * Sanitiza la barra de direcciones del navegador en silencio (sin recargar la página),
 * removiendo __aistudio_auth_token y dejando una URL limpia para el usuario.
 */
export function sanitizeBrowserAddressBar(): void {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;

  try {
    const url = new URL(window.location.href);
    let changed = false;

    INTERNAL_QUERY_PARAMS.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        changed = true;
      }
    });

    if (changed) {
      const search = url.searchParams.toString();
      const cleanUrl = url.pathname + (search ? `?${search}` : '') + url.hash;
      window.history.replaceState(window.history.state, document.title, cleanUrl);
    }
  } catch (err) {
    console.debug('No se pudo sanitizar la URL del navegador:', err);
  }
}

/**
 * Limpia los parámetros de retorno de pasarelas de pago de la URL manteniendo el estado limpio.
 */
export function clearPaymentParamsFromUrl(): void {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;

  try {
    const url = new URL(window.location.href);
    const paramsToRemove = [
      ...INTERNAL_QUERY_PARAMS,
      'payment',
      'payment_id',
      'collection_id',
      'collection_status',
      'preference_id',
      'status',
      'gateway',
      'token',
      'order_id',
      'plan'
    ];

    paramsToRemove.forEach(p => url.searchParams.delete(p));

    const search = url.searchParams.toString();
    const cleanUrl = url.pathname + (search ? `?${search}` : '') + url.hash;
    window.history.replaceState(window.history.state, document.title, cleanUrl);
  } catch {}
}
