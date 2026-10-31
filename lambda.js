/**
 * ==============================================================================
 * ADAPTADOR AWS LAMBDA (Serverless en Capa Gratuita de AWS)
 * ==============================================================================
 * Este archivo permite ejecutar la API de cobros y descargas seguras
 * (Mercado Pago, PayPal, auditoría y control de licencias) como una función
 * Serverless en AWS Lambda + Amazon API Gateway.
 *
 * BENEFICIOS EN LA CAPA GRATUITA DE AWS (Free Tier Forever):
 * - 1.000.000 (1 millón) de solicitudes gratis al mes para siempre.
 * - 3.200.000 segundos de tiempo de cómputo gratis al mes.
 * - $0 costo de mantenimiento de servidor.
 * ==============================================================================
 */

import { handlePaymentApi } from './server/payments.js';
import { EventEmitter } from 'node:events';

export const handler = async (event, context) => {
  // Manejo de pre-flight CORS
  const httpMethod = (event.requestContext?.http?.method || event.httpMethod || 'GET').toUpperCase();
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Parsear URL y ruta
  const rawPath = event.rawPath || event.path || '/';
  const queryString = event.rawQueryString || (event.queryStringParameters ? new URLSearchParams(event.queryStringParameters).toString() : '');
  const fullUrl = queryString ? `${rawPath}?${queryString}` : rawPath;

  // Mock Request compatible con Node.js HTTP stream
  const req = new EventEmitter();
  req.url = fullUrl;
  req.method = httpMethod;
  req.headers = {
    ...event.headers,
    host: event.headers?.host || 'aws-lambda.local'
  };

  // Mock Response
  let statusCode = 200;
  const resHeaders = { ...corsHeaders };
  let responseBody = '';

  const resPromise = new Promise((resolve) => {
    const res = {
      statusCode: 200,
      setHeader: (name, value) => {
        resHeaders[name] = value;
      },
      writeHead: (code, headers) => {
        statusCode = code;
        if (headers) Object.assign(resHeaders, headers);
      },
      end: (chunk) => {
        if (chunk) {
          responseBody += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        }
        resolve({
          statusCode: res.statusCode || statusCode,
          headers: resHeaders,
          body: responseBody
        });
      }
    };

    // Invocar el manejador de pagos
    Promise.resolve().then(async () => {
      try {
        const handled = await handlePaymentApi(req, res);
        if (!handled) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Ruta no encontrada en la API de pagos' }));
        }
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message || 'Error interno en AWS Lambda' }));
      }
    });

    // Enviar el body en caso de POST
    process.nextTick(() => {
      if (event.body) {
        const isBase64 = event.isBase64Encoded;
        const decoded = isBase64 ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
        req.emit('data', decoded);
      }
      req.emit('end');
    });
  });

  return await resPromise;
};
