/**
 * ==============================================================================
 * ALMANAQUE DE PAZ - SERVIDOR BACKEND PRINCIPAL (Node.js / Hostinger)
 * ==============================================================================
 * Este archivo gestiona el servidor web de producción y los endpoints de cobro
 * seguros para Mercado Pago (Argentina en ARS) y PayPal (Internacional en USD).
 *
 * REGLAS DE NEGOCIO Y FINANCIERAS:
 * 1. COTIZACION_DOLAR: Dólar fijo a $1540 ARS para evitar pérdidas por brecha cambiaria.
 * 2. RECARGO_PAYPAL: Recargo automático del 6% (1.06) sobre compras en PayPal para
 *    cubrir comisiones transfronterizas y retiro de divisas (redondeado a .toFixed(2)).
 * 3. MERCADO PAGO: Forzar exactamente 1 pago (installments: 1) para que el vendedor
 *    no absorba ninguna tasa de financiación ni Costo Financiero Total (CFT).
 * 4. SEGURIDAD: Las credenciales secretas (Access Token y Client Secret) NUNCA se
 *    envían al navegador del cliente.
 * ==============================================================================
 */

// 1. COTIZACIÓN FIJA DE VENTA MERCADO PAGO (USD -> ARS)
const COTIZACION_DOLAR = 1540;

// 2. RECARGO FINANCIERO PAYPAL (Comisión internacional y retiro de divisas: +6%)
const RECARGO_PAYPAL = 1.06;

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

/**
 * Carga segura de variables desde el archivo .env si existen
 */
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (process.env[key] === undefined || process.env[key] === '') {
            process.env[key] = val;
          }
        }
      }
    } catch (err) {
      console.warn('[Env] Advertencia al leer .env:', err.message);
    }
  }
}

// Cargar variables de entorno al iniciar
loadEnvFile();

// Asegurar que el directorio compilado dist/ exista
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('Compilando aplicación para producción (npm run build)...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  } catch (err) {
    console.error('Error al compilar:', err);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4'
};

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }

    const isHashedAsset = ext === '.js' || ext === '.css' || ext === '.woff2';
    const cacheControl = isHashedAsset
      ? 'public, max-age=31536000, immutable'
      : 'no-cache, no-store, must-revalidate';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(data);
  });
}

/**
 * Autenticación OAuth 2.0 con PayPal usando credenciales del servidor
 */
async function getPayPalAccessToken(clientId, clientSecret) {
  if (!clientId || !clientSecret) {
    throw new Error('Faltan credenciales de PayPal (PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET) en el servidor.');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.message || 'Error al autenticar con PayPal');
  }

  return data.access_token;
}

/**
 * Manejador principal de la API de Pagos (Mercado Pago y PayPal)
 */
export async function handlePaymentApi(req, res) {
  loadEnvFile();

  const hostHeader = req.headers.host || 'localhost:3000';
  const urlObj = new URL(req.url, `http://${hostHeader}`);
  const pathname = urlObj.pathname;
  const method = req.method ? req.method.toUpperCase() : 'GET';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  const readJsonBody = () => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });

  // =========================================================================
  // ENDPOINT 1: GET /api/payments/config
  // Informa cotizaciones oficiales y estado de conexión sin revelar secretos
  // =========================================================================
  if (pathname === '/api/payments/config' && method === 'GET') {
    const paypalClientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID || 'AebblBVUXLEHYwEDNwIDOlbdv3VyAoxdSDytcVrU8NhVX6H6f9L3Vs7wKFPawaA6ic3JaCgTept60rUt';
    const mercadopagoPublicKey = process.env.MERCADOPAGO_PUBLIC_KEY || process.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'APP_USR-b66f5dda-1237-4122-a234-4eb474f4e246';

    const hasPayPalSecret = Boolean(process.env.PAYPAL_CLIENT_SECRET && process.env.PAYPAL_CLIENT_SECRET.length > 10);
    const hasMercadoPagoToken = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_ACCESS_TOKEN.length > 10);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      cotizacionDolar: COTIZACION_DOLAR,
      recargoPayPal: RECARGO_PAYPAL,
      recargoPayPalPorcentaje: 6,
      paypal: {
        clientId: paypalClientId,
        isConfigured: hasPayPalSecret,
        mode: 'production',
        currency: 'USD',
        surchargeMultiplier: RECARGO_PAYPAL,
        surchargePercent: 6,
        surchargeReason: 'Comisión por retiro de divisas y procesamiento internacional'
      },
      mercadopago: {
        publicKey: mercadopagoPublicKey,
        isConfigured: hasMercadoPagoToken,
        mode: 'production',
        exchangeRate: COTIZACION_DOLAR,
        installmentsPolicy: '1_pago_estricto_sin_interes_absorbido'
      },
      security: {
        secretsStoredOnServer: true,
        secretsExposedToClient: false,
        fixedRateEnforced: true,
        paypalSurchargeEnforced: true
      }
    }));
    return true;
  }

  // =========================================================================
  // ENDPOINT 2: POST /api/payments/mercadopago/create-preference
  // Crea preferencia en Mercado Pago con:
  // 1. Dólar Fijo a $1540 (unit_price en ARS = USD * COTIZACION_DOLAR)
  // 2. payment_methods: { installments: 1, default_installments: 1 } (1 solo pago, 0 interés absorbido)
  // =========================================================================
  if (pathname === '/api/payments/mercadopago/create-preference' && method === 'POST') {
    try {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'MERCADOPAGO_ACCESS_TOKEN no configurado en el servidor Hostinger.'
        }));
        return true;
      }

      const body = await readJsonBody();
      const {
        title = 'Membresía Almanaque de Paz',
        amountUSD,
        amount,
        currency = 'ARS',
        payerEmail = 'comprador@almanaquedepaz.com',
        planId = 'cat1',
        origin = req.headers.origin || `https://${hostHeader}`
      } = body;

      // Cálculo del monto en ARS aplicando la COTIZACION_DOLAR fija de $1540
      let unitPriceARS = 0;
      if (amountUSD !== undefined && amountUSD !== null) {
        unitPriceARS = Math.round(Number(amountUSD) * COTIZACION_DOLAR);
      } else if (currency === 'USD') {
        unitPriceARS = Math.round(Number(amount) * COTIZACION_DOLAR);
      } else if (amount !== undefined && amount !== null) {
        if (Number(amount) <= 100) {
          unitPriceARS = Math.round(Number(amount) * COTIZACION_DOLAR);
        } else {
          unitPriceARS = Math.round(Number(amount));
        }
      } else {
        unitPriceARS = Math.round(2.25 * COTIZACION_DOLAR);
      }

      if (unitPriceARS < 1) unitPriceARS = Math.round(2.25 * COTIZACION_DOLAR);

      const safeOrigin = origin.startsWith('http') ? origin : `https://${origin}`;
      const isPublicHttps = safeOrigin.startsWith('https://') && !safeOrigin.includes('localhost') && !safeOrigin.includes('127.0.0.1');

      // Objeto de preferencia oficial de Mercado Pago
      const preferencePayload = {
        items: [
          {
            id: String(planId),
            title: String(title),
            quantity: 1,
            unit_price: unitPriceARS, // Precio exacto en ARS según COTIZACION_DOLAR ($1540)
            currency_id: 'ARS'
          }
        ],
        payer: {
          email: payerEmail
        },
        // Forzar estrictamente 1 solo pago: el vendedor NO absorbe ningún interés ni CFT
        payment_methods: {
          installments: 1,
          default_installments: 1
        },
        statement_descriptor: 'ALMANAQUE PAZ'
      };

      if (isPublicHttps) {
        preferencePayload.back_urls = {
          success: `${safeOrigin}/?payment=success&gateway=mercadopago&plan=${encodeURIComponent(planId)}`,
          failure: `${safeOrigin}/?payment=failure&gateway=mercadopago`,
          pending: `${safeOrigin}/?payment=pending&gateway=mercadopago`
        };
        preferencePayload.auto_return = 'approved';
      }

      const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferencePayload)
      });

      const mpData = await mpResponse.json();

      if (!mpResponse.ok) {
        res.statusCode = mpResponse.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: mpData.message || 'Error al comunicarse con Mercado Pago',
          details: mpData
        }));
        return true;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        preferenceId: mpData.id,
        initPoint: mpData.init_point,
        sandboxInitPoint: mpData.sandbox_init_point,
        unitPriceARS: unitPriceARS,
        cotizacionDolar: COTIZACION_DOLAR,
        installments: 1
      }));
      return true;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: err.message || 'Error interno al procesar preferencia de Mercado Pago'
      }));
      return true;
    }
  }

  // =========================================================================
  // ENDPOINT 3: POST /api/payments/paypal/create-order
  // Crea orden oficial en PayPal v2 aplicando recargo automático del 6% (RECARGO_PAYPAL = 1.06)
  // Redondeo exacto a 2 decimales (.toFixed(2)) para cumplir el estándar de la API de PayPal
  // =========================================================================
  if (pathname === '/api/payments/paypal/create-order' && method === 'POST') {
    try {
      const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

      if (!clientSecret) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'PAYPAL_CLIENT_SECRET no configurado en el servidor Hostinger.'
        }));
        return true;
      }

      const body = await readJsonBody();
      const {
        amount = '2.25',
        amountUSD,
        currency = 'USD',
        planId = 'cat1',
        planName = 'Membresía Almanaque de Paz'
      } = body;

      // Monto base neto en USD
      const netUsdAmount = Number(amountUSD || amount || 2.25);

      // Aplicar recargo del 6% y redondear estrictamente a 2 decimales (.toFixed(2))
      const finalUsdAmount = (netUsdAmount * RECARGO_PAYPAL).toFixed(2);
      const recargoCalculado = (Number(finalUsdAmount) - netUsdAmount).toFixed(2);

      const accessToken = await getPayPalAccessToken(clientId, clientSecret);
      const origin = req.headers.origin || `https://${hostHeader}`;
      const safeOrigin = origin.startsWith('http') ? origin : `https://${origin}`;

      const orderPayload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: String(planId),
            description: `${String(planName)} (+6% comisiones de cambio y pasarela)`,
            amount: {
              currency_code: currency,
              value: finalUsdAmount // Monto con recargo del 6% redondeado a 2 decimales
            }
          }
        ],
        application_context: {
          brand_name: 'Almanaque de Paz',
          locale: 'es-ES',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          return_url: `${safeOrigin}/?payment=success&gateway=paypal&plan=${encodeURIComponent(planId)}`,
          cancel_url: `${safeOrigin}/?payment=cancelled&gateway=paypal`
        }
      };

      const ppResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const ppData = await ppResponse.json();

      if (!ppResponse.ok) {
        res.statusCode = ppResponse.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: ppData.message || 'Error al comunicarse con la API de PayPal',
          details: ppData
        }));
        return true;
      }

      const approvalLink = ppData.links?.find(l => l.rel === 'approve')?.href || null;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        orderId: ppData.id,
        status: ppData.status,
        approvalUrl: approvalLink,
        links: ppData.links,
        netAmountUSD: netUsdAmount.toFixed(2),
        finalAmountUSD: finalUsdAmount,
        recargoFactor: RECARGO_PAYPAL,
        recargoPercent: 6,
        recargoCalculado
      }));
      return true;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: err.message || 'Error interno al crear orden en PayPal'
      }));
      return true;
    }
  }

  // =========================================================================
  // ENDPOINT 4: POST /api/payments/paypal/capture-order
  // =========================================================================
  if (pathname === '/api/payments/paypal/capture-order' && method === 'POST') {
    try {
      const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

      if (!clientSecret) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'PAYPAL_CLIENT_SECRET no configurado en el servidor.'
        }));
        return true;
      }

      const body = await readJsonBody();
      const { orderId } = body;

      if (!orderId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Falta orderId requerido.' }));
        return true;
      }

      const accessToken = await getPayPalAccessToken(clientId, clientSecret);
      const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const captureData = await captureResponse.json();

      if (!captureResponse.ok) {
        res.statusCode = captureResponse.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: captureData.message || 'Error al capturar orden en PayPal',
          details: captureData
        }));
        return true;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        orderId: captureData.id,
        status: captureData.status,
        details: captureData
      }));
      return true;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: err.message || 'Error interno al capturar orden en PayPal'
      }));
      return true;
    }
  }

  return false;
}

// Exportar constantes para uso en módulos
export { COTIZACION_DOLAR, RECARGO_PAYPAL };

// =========================================================================
// SERVIDOR HTTP PRINCIPAL (Hostinger / Producción)
// =========================================================================
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Endpoints de salud
  if (urlPath === '/_healthz' || urlPath === '/healthz' || urlPath === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      uptime: process.uptime(), 
      cotizacionDolar: COTIZACION_DOLAR,
      recargoPayPal: RECARGO_PAYPAL 
    }));
    return;
  }

  // Protección de seguridad estricta: bloquear acceso a archivos sensibles
  if (
    urlPath.includes('.env') ||
    urlPath.startsWith('/server') ||
    urlPath.includes('package.json') ||
    urlPath.includes('..')
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Enrutar llamadas de pagos al manejador seguro
  if (urlPath.startsWith('/api/payments/')) {
    handlePaymentApi(req, res);
    return;
  }

  // Servir frontend compilado en dist/
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(distDir, safePath);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(filePath, res);
      return;
    }

    if (!err && stats.isDirectory()) {
      const nestedIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(nestedIndex)) {
        sendFile(nestedIndex, res);
        return;
      }
    }

    // SPA fallback a dist/index.html
    const spaIndex = path.join(distDir, 'index.html');
    if (fs.existsSync(spaIndex)) {
      sendFile(spaIndex, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Hostinger / Node.js] Servidor iniciado en puerto ${PORT}`);
  console.log(`[Cotización Mercado Pago] 1 USD = $${COTIZACION_DOLAR} ARS fija`);
  console.log(`[Mercado Pago] Forzado a 1 solo pago (installments: 1). CFT = 0% para el vendedor.`);
  console.log(`[PayPal Internacional] Recargo del 6% automático (RECARGO_PAYPAL = ${RECARGO_PAYPAL}) para cubrir costos de retiro y cambio de divisa.`);
});
