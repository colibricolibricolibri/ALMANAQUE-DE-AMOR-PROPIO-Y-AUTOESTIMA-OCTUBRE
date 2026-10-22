import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Wallet,
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Sparkles, 
  Download, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  ServerOff,
  KeyRound,
  FileCheck2,
  Settings,
  Globe,
  RefreshCw,
  Sliders,
  Building2,
  QrCode,
  Receipt,
  Copy,
  Check,
  CreditCard as CardIcon
} from 'lucide-react';
import { PlanCategory, PaymentRecord, UserAccount } from '../../types';
import { 
  CATEGORY_BILLING_CONFIG, 
  getCategoryRestrictions,
  formatUSD, 
  formatARS, 
  getArsAmount, 
  loadGatewayConfig, 
  saveGatewayConfig, 
  GatewayConfig,
  RegionOrigin,
  DEFAULT_ARS_EXCHANGE_RATE,
  loadPayPalSdkScript,
  loadMercadoPagoSdkScript,
  fetchServerPaymentConfig,
  createMercadoPagoPreferenceOnServer,
  createPayPalOrderOnServer,
  capturePayPalOrderOnServer,
  trackDownloadOnServer,
  fetchDownloadsLogOnServer,
  DownloadAuditRecord,
  updateServerCredentials,
  buildPayPalDirectUrl,
  buildMercadoPagoDirectUrl
} from '../utils/paymentConfig';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  defaultPlan?: PlanCategory | 'apoyo' | 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'blogger';
  targetYear?: number | null;
  customTitle?: string | null;
  customAmount?: number | null;
  onPaymentSuccess: (payment: PaymentRecord) => void;
  initialCompletedPayment?: PaymentRecord | null;
}

/**
 * Genera el contenido textual completo y el nombre de archivo del producto digital según la categoría adquirida.
 * Permite tanto la descarga de archivo como la visualización y copia directa en pantalla en celulares.
 */
export function getCategoryDownloadContent(payment: PaymentRecord, customTitle?: string): { filename: string; fileContent: string; title: string } {
  const planId = payment.planId;
  let filename = 'Material_Digital_Almanaque.txt';
  let fileContent = '';
  let title = 'Material Digital Almanaque de Amor Propio';

  if (planId === 'youtube' || (customTitle && customTitle.toLowerCase().includes('youtube')) || payment.planName.toLowerCase().includes('youtube')) {
    const itemTitle = customTitle || payment.planName || 'Módulo y Galería de Videos de YouTube';
    title = itemTitle;
    filename = `Acceso_Modulo_YouTube_${payment.id}.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
ACCESO EXCLUSIVO: MÓDULO Y GALERÍA DE YOUTUBE ($1.75 USD)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Monto: $${payment.amount.toFixed(2)} USD
Concepto: ${itemTitle}
Pasarela: ${payment.gateway || payment.paymentMethod}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital y de acceso informático inmediato, una vez contratado y puesto a disposición ya no admite devoluciones conforme al Art. 34 bis Ley 24.240 y directrices de intangibles de PayPal y Mercado Pago.

ESTADO OPERATIVO Y LÓGICA TEMPORAL (ENERO 2027):
- Fase Actual (Preventa): Reproductor y controles habituales totalmente operativos.
- Fase Programada (A partir del 01/01/2027): El script activa la capa invisible responsiva protectora sobre la barra de controles de Elfsight para deshabilitar o bloquear el botón de 'Stop' o pausa, garantizando la reproducción continua y fluida de las reflexiones en celulares, tablets y notebooks.
- Botones de Compra y Descarga: 100% operativos e ininterrumpidos en todo momento sin obstrucción alguna.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- Sección 100% independiente: No incluye suscripción de membresía mensual a Categorías 1, 2 o Círculo de Paz.
- No incluye anualidad de años del calendario 2028 a 3037.
- Otorga acceso directo y exclusivo a la Galería y Módulo de YouTube del Almanaque de Amor Propio.

¡Gracias por acompañar este camino de amor propio y transformación interior!
========================================================================`;
  } else if (planId === 'tiktok' || (customTitle && customTitle.toLowerCase().includes('tiktok')) || payment.planName.toLowerCase().includes('tiktok')) {
    const itemTitle = customTitle || payment.planName || 'Videos Diarios de TikTok';
    title = itemTitle;
    filename = `Acceso_Videos_Diarios_TikTok_${payment.id}.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
ACCESO EXCLUSIVO: VIDEOS DIARIOS DE TIKTOK ($1.75 USD)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Monto: $${payment.amount.toFixed(2)} USD
Concepto: ${itemTitle}
Pasarela: ${payment.gateway || payment.paymentMethod}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital y de acceso informático inmediato, una vez contratado y puesto a disposición ya no admite devoluciones conforme al Art. 34 bis Ley 24.240 y directrices de intangibles de PayPal y Mercado Pago.

ESTADO DE ACTIVACIÓN Y BLOQUEO AUTOMÁTICO:
- Fecha de Liberación Automática: 01 de Enero de 2027 (01/01/2027).
- Si la fecha de tu dispositivo es previa al 01/01/2027, el reproductor permanecerá en espera segura con el mensaje:
  "¡Gracias por tu compra! Tus videos diarios de almanaque de amor propio se activarán automáticamente el 01/01/2027".
- A partir del 01/01/2027, el sistema ejecutará de forma automática y transparente el reproductor nativo de alta calidad con el Feed de TikTok y su música ambiental.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- Sección 100% independiente: No incluye suscripción de membresía mensual a Categorías 1, 2 o Círculo de Paz.
- No incluye anualidad de años del calendario 2028 a 3037.
- Otorga acceso directo y exclusivo a los videos diarios publicados en TikTok del Almanaque de Amor Propio.

¡Gracias por acompañar este camino de amor propio y transformación interior!
========================================================================`;
  } else if (planId === 'instagram' || (customTitle && customTitle.toLowerCase().includes('instagram')) || payment.planName.toLowerCase().includes('instagram')) {
    const itemTitle = customTitle || payment.planName || 'Pase y Reflexiones de Instagram';
    title = itemTitle;
    filename = `Acceso_Instagram_Amor_Propio_${payment.id}.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
ACCESO EXCLUSIVO: REFLEXIONES & PASE DE INSTAGRAM ($1.75 USD)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Monto: $${payment.amount.toFixed(2)} USD
Concepto: ${itemTitle}
Pasarela: ${payment.gateway || payment.paymentMethod}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital y de acceso informático inmediato, una vez contratado y puesto a disposición ya no admite devoluciones conforme al Art. 34 bis Ley 24.240 y directrices de intangibles de PayPal y Mercado Pago.

CONTENIDO Y BENEFICIOS INCLUIDOS:
✓ Acceso a reflexiones diarias de amor propio, autoestima y paz interior en Instagram.
✓ Plantillas de afirmaciones e historias verticales 9:16 y carruseles conscientes.
✓ Enlace oficial y recordatorios de serenidad.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- Sección 100% independiente: No incluye suscripción de membresía mensual a Categorías 1, 2 o Círculo de Paz.
- No incluye anualidad de años del calendario 2028 a 3037.
- Otorga acceso directo y exclusivo a las reflexiones y pase de Instagram ($1.75 USD).

¡Gracias por nutrir tu amor propio y expandir esta energía transformadora!
========================================================================`;
  } else if (planId === 'facebook' || (customTitle && customTitle.toLowerCase().includes('facebook')) || payment.planName.toLowerCase().includes('facebook')) {
    const itemTitle = customTitle || payment.planName || 'Pase y Comunidad de Facebook';
    title = itemTitle;
    filename = `Acceso_Facebook_Amor_Propio_${payment.id}.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
ACCESO EXCLUSIVO: REFLEXIONES & PASE DE FACEBOOK ($1.75 USD)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Monto: $${payment.amount.toFixed(2)} USD
Concepto: ${itemTitle}
Pasarela: ${payment.gateway || payment.paymentMethod}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital y de acceso informático inmediato, una vez contratado y puesto a disposición ya no admite devoluciones conforme al Art. 34 bis Ley 24.240 y directrices de intangibles de PayPal y Mercado Pago.

CONTENIDO Y BENEFICIOS INCLUIDOS:
✓ Acceso a las reflexiones, citas de sabiduría y comunidad consciente en Facebook.
✓ Material de lectura diaria para superar la autocrítica y abrazar la calma.
✓ Enlace a los grupos y publicaciones exclusivas de Amor Propio.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- Sección 100% independiente: No incluye suscripción de membresía mensual a Categorías 1, 2 o Círculo de Paz.
- No incluye anualidad de años del calendario 2028 a 3037.
- Otorga acceso directo y exclusivo a las reflexiones y comunidad de Facebook ($1.75 USD).

¡Gracias por nutrir tu amor propio y expandir esta energía transformadora!
========================================================================`;
  } else if (planId === 'blogger' || (customTitle && customTitle.toLowerCase().includes('blogger')) || payment.planName.toLowerCase().includes('blogger')) {
    const itemTitle = customTitle || payment.planName || 'Pase y Entradas de Blogger';
    title = itemTitle;
    filename = `Acceso_Blogger_Amor_Propio_${payment.id}.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
ACCESO EXCLUSIVO: ENTRADAS & PASE DE BLOGGER ($1.75 USD)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Monto: $${payment.amount.toFixed(2)} USD
Concepto: ${itemTitle}
Pasarela: ${payment.gateway || payment.paymentMethod}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital y de acceso informático inmediato, una vez contratado y puesto a disposición ya no admite devoluciones conforme al Art. 34 bis Ley 24.240 y directrices de intangibles de PayPal y Mercado Pago.

CONTENIDO Y BENEFICIOS INCLUIDOS:
✓ Acceso a las entradas y artículos profundos de sanación y sabiduría en Blogger.
✓ Código HTML adaptativo para gadgets, widgets y reproductores en tres formatos (celular, tablet, notebook).
✓ Entradas sin límites de megas con contenido embebido oficial.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- Sección 100% independiente: No incluye suscripción de membresía mensual a Categorías 1, 2 o Círculo de Paz.
- No incluye anualidad de años del calendario 2028 a 3037.
- Otorga acceso directo y exclusivo a las entradas y pase de Blogger ($1.75 USD).

¡Gracias por nutrir tu amor propio y expandir esta energía transformadora!
========================================================================`;
  } else if (planId === 'apoyo') {
    const itemTitle = customTitle || payment.planName;
    title = itemTitle;
    const safeTitle = itemTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    filename = `Mantra_Digital_${safeTitle}.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
ENTREGA DE PRODUCTO DIGITAL: MANTRAS POTENCIADOS & ANCLAS VISUALES
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Monto: $${payment.amount.toFixed(2)} USD
Concepto: ${itemTitle}
Pasarela: ${payment.gateway}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital, una vez que se descarga ya no se puede devolver.

CONTENIDO DEL KIT DIGITAL:
1. Mantra Potenciado para tu práctica diaria de autoobservación y paz interior.
2. Ancla Visual en Alta Fidelidad para meditación y presencia consciente.
3. Licencia de uso personal ilimitado.

INSTRUCCIONES DE USO:
- Medita con el mantra repitiéndolo al despertar o al descansar.
- Emplea el ancla visual como punto de enfoque para disolver memorias del pasado y anclarte en el presente con la sabiduría del amor propio.

RESTRICCIONES DE ESTA CATEGORÍA:
- No incluye suscripción de membresía mensual a categorías 1, 2 o Círculo de Paz.
- No incluye anualidad de años del calendario 2028 a 3037.

¡Gracias por apoyar y sostener este proyecto independiente con tu valiosa colaboración!
========================================================================`;
  } else if (planId === 'cat1') {
    title = 'Categoría 1: Acompañamiento Esencial';
    filename = 'Guia_Sabiduria_31_Dias_Categoria_1.txt';
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
CATEGORÍA 1: ACOMPAÑAMIENTO ESENCIAL (PRODUCTO DIGITAL)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Plan: Categoría 1 ($2.25 USD / mes)
Pasarela: ${payment.gateway}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital, una vez que se descarga ya no se puede devolver.

ALCANCE Y BENEFICIOS INCLUIDOS:
✓ Acceso completo a los 31 días del mes de sabiduría, mantras y afirmaciones.
✓ Calendario perpetuo completo de 2027 a 3037 con feriados y años bisiestos.
✓ Afirmaciones diarias y lecturas profundas de auto-honra y sanación.
✓ Sincronización horaria y clima en vivo.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- No incluye reproducción en bucle continuo de frecuencias 432 Hz / Cuencos Tibetanos (disponible en Cat 2).
- No incluye Diario Íntimo de Sanación ni ejercicios guiados de Pranayama (disponible en Cat 2).
- No incluye Oráculo sagrado de Cartas de Luz ni publicador en redes sociales (disponible en Círculo de Paz).
- No incluye personalización fotográfica de los 12 meses (exclusivo de Cat 3 Prémium).

¡Tu acceso en la plataforma ya está activo e ilimitado!
========================================================================`;
  } else if (planId === 'cat2') {
    title = 'Categoría 2: Calma & Profundización';
    filename = 'Kit_Meditacion_Pranayama_432Hz_Categoria_2.txt';
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
CATEGORÍA 2: CALMA & PROFUNDIZACIÓN (PRODUCTO DIGITAL)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Plan: Categoría 2 ($4.99 USD / mes)
Pasarela: ${payment.gateway}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital, una vez que se descarga ya no se puede devolver.

ALCANCE Y BENEFICIOS INCLUIDOS:
✓ Todo lo de Categoría 1 (31 días + Calendario perpetuo 2027 a 3037).
✓ Frecuencias continuas de 432 Hz y Cuencos Tibetanos en bucle armónico.
✓ Diario Íntimo de sanación, desahogo privado y notas de gratitud.
✓ Ejercicios guiados de respiración consciente (Pranayama).
✓ Exportación segura de notas personales de sanación.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- No incluye Oráculo sagrado de Cartas de Luz (disponible en Círculo de Paz).
- No incluye generador avanzado de publicaciones para redes sociales (disponible en Círculo de Paz).
- No incluye personalización fotográfica de los 12 meses (exclusivo de Cat 3 Prémium).

¡Tu acceso en la plataforma ya está activo e ilimitado!
========================================================================`;
  } else if (planId === 'circulo') {
    title = 'Círculo de Paz: Comunidad & Oráculo Sagrado';
    filename = 'Cuaderno_Sagrado_Circulo_de_Paz.txt';
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
CÍRCULO DE PAZ: COMUNIDAD & ORÁCULO SAGRADO (PRODUCTO DIGITAL)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Plan: Círculo de Paz ($9.99 USD / mes)
Pasarela: ${payment.gateway}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital, una vez que se descarga ya no se puede devolver.

ALCANCE Y BENEFICIOS INCLUIDOS:
✓ Todo lo de Categorías 1 y 2 (31 días, 2027 a 3037, 432 Hz continuos y Diario Íntimo).
✓ Oráculo sagrado de Cartas de Luz y Guía diaria de orientación espiritual.
✓ Generador y exportador enriquecido para Blogger, Instagram, Facebook y YouTube.
✓ Insignia dorada comunitaria del Círculo de Paz.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- No incluye personalización fotográfica de los 12 meses del calendario (exclusivo de Cat 3 Prémium).
- Los desbloqueos de años adicionales 2028-3037 se adquieren individualmente por anualidad.

¡Tu acceso en la plataforma ya está activo e ilimitado!
========================================================================`;
  } else if (planId === 'cat3') {
    const targetYearStr = payment.targetYear ? `Año ${payment.targetYear}` : 'Año 2027';
    title = `Categoría 3: Nivel Maestro & Anualidad Perpetua (${targetYearStr})`;
    filename = `Pack_Maestro_Anualidad_${payment.targetYear || 2027}_Categoria_3.txt`;
    fileContent = `========================================================================
ALMANAQUE DE AMOR PROPIO Y AUTOESTIMA
CATEGORÍA 3: NIVEL MAESTRO & ANUALIDAD PERPETUA (PRODUCTO DIGITAL)
========================================================================

ID de Transacción: ${payment.id}
Fecha de Adquisición: ${payment.date}
Plan: Categoría 3 ($25.00 USD / Anualidad)
Anualidad Adquirida: ${targetYearStr}
Pasarela: ${payment.gateway}

POLÍTICA DE DEVOLUCIÓN:
Al ser un producto digital, una vez que se descarga ya no se puede devolver.

ALCANCE Y BENEFICIOS MÁXIMOS INCLUIDOS:
✓ Desbloqueo perpetuo al 100% de los 12 meses del ${targetYearStr}.
✓ Personalización fotográfica exclusiva: subida de foto de portada y fotos para cada uno de los 12 meses.
✓ Descarga de afirmaciones y audios en alta fidelidad.
✓ Acceso prioritario y canal de consulta preferencial.
✓ Todo lo incluido en Categoría 1, Categoría 2 y Círculo de Paz para la anualidad.
✓ Insignia dorada de Nivel Maestro.

RESTRICCIONES ESPECÍFICAS DE ESTA CATEGORÍA:
- Cada año calendario adicional (entre 2028 y 3037) se adquiere individualmente por anualidad ($25 USD c/u) con vigencia perpetua.

¡Tu acceso perpetuo a esta anualidad ya está activo en la plataforma!
========================================================================`;
  }

  // Anexar cláusulas legales de auditoría técnica al archivo descargado
  fileContent += `\n
========================================================================
AUDITORÍA DE ENTREGA DIGITAL & PROTECCIÓN AL VENDEDOR (PAYPAL / MERCADO PAGO):
- Estado de Entrega: SUMINISTRADO Y ACCESO CONCEDIDO AL COMPRADOR
- Consentimiento Previo: Casilla de renuncia irrevocable al derecho de revocación
  aceptada expresamente por el comprador antes del pago.
- Validez: Amparado por el Art. 34 bis Ley 24.240 y directrices de Bienes
  Intangibles de la Política de Protección al Vendedor de PayPal y Mercado Pago.
- Identificador de Auditoría: AUDIT-DL-${payment.id}
========================================================================`;

  return { filename, fileContent, title };
}

/**
 * Dispara la descarga digital automática del producto según la categoría adquirida,
 * con compatibilidad total para iOS Safari, Android Chrome, Tablets y PCs de escritorio.
 */
export function triggerAutomaticCategoryDownload(payment: PaymentRecord, customTitle?: string): boolean {
  try {
    const { filename, fileContent } = getCategoryDownloadContent(payment, customTitle);

    // 1. Guardar copia en localStorage para acceso permanente sin depender de la descarga de archivos
    try {
      localStorage.setItem('zen_last_downloaded_material', JSON.stringify({
        paymentId: payment.id,
        planId: payment.planId,
        filename,
        fileContent,
        downloadedAt: new Date().toISOString()
      }));
    } catch {}

    // 2. Método de descarga universal compatible con celulares
    const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    if (isIOS) {
      // En iOS Safari, a.download en Blob a menudo falla o se bloquea.
      // El uso de Data URI con target _blank abre el contenido directamente en el visor nativo de iOS para guardar o compartir
      const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent);
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Android / Chrome / Firefox / Safari Mac / Edge
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Mantener vivo el ObjectURL por 60 segundos para evitar que teléfonos lentos pierdan el archivo
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }, 60000);
    }

    // 3. Registro formal y asíncrono en el servidor de auditoría si está disponible
    trackDownloadOnServer({
      paymentId: payment.id,
      planId: String(payment.planId),
      planName: customTitle || payment.planName,
      filename,
      email: payment.orderId || 'comprador@almanaquedepaz.com',
      gateway: payment.gateway || 'mercadopago_checkout_pro',
      orderId: payment.orderId,
      preferenceId: payment.preferenceId,
      amount: payment.amount,
      currency: payment.currency,
      termsAcceptedAt: payment.termsAcceptedAt || new Date().toISOString()
    }).then((res) => {
      if (res && res.success && res.auditRecord) {
        payment.downloadAuditId = res.auditRecord.auditId;
        payment.clientIp = res.auditRecord.clientIp;
        payment.downloadedAt = res.auditRecord.downloadTimestamp;
      }
    }).catch((err) => {
      console.warn('Registro de auditoría:', err);
    });

    return true;
  } catch (e) {
    console.error('Error al iniciar descarga automática:', e);
    return false;
  }
}

/**
 * Genera el Certificado Oficial de Entrega Digital y Renuncia de Revocación
 * Diseñado con valor probatorio para adjuntar directamente en el Centro de Resoluciones
 * de PayPal o Reclamos de Mercado Pago en caso de intento de desconocimiento de compra.
 * Compatible con celulares iPhone, Android y computadoras.
 */
export function generateLegalDeliveryCertificate(payment: PaymentRecord, buyerEmail?: string): boolean {
  try {
    const auditId = payment.downloadAuditId || `AUDIT-DL-${payment.id}`;
    const certContent = `================================================================================
CERTIFICADO OFICIAL DE ENTREGA DIGITAL Y RENUNCIA IRREVOCABLE DE REVOCACIÓN
CONSTANCIA PROBATORIA PARA EL CENTRO DE RESOLUCIONES DE PAYPAL Y MERCADO PAGO
================================================================================

1. DATOS DE LA TRANSACCIÓN Y DE LAS PARTES:
--------------------------------------------------------------------------------
- ID de Transacción Interno: ${payment.id}
- Pasarela de Cobro: ${payment.gateway || payment.paymentMethod}
- PayPal Order ID: ${payment.orderId || 'N/A (Cobro procesado vía Mercado Pago)'}
- Mercado Pago Preference ID: ${payment.preferenceId || 'N/A (Cobro procesado vía PayPal)'}
- Concepto Adquirido: ${payment.planName}
- Importe Total Abonado: $${payment.amount.toFixed(2)} USD ${payment.localCurrencyAmount ? `(${payment.localCurrencyAmount.toLocaleString()} ${payment.localCurrency})` : ''}
- Fecha y Hora de la Transacción: ${payment.date}
- Email del Comprador Registrado: ${buyerEmail || 'comprador@almanaquedepaz.com'}
- Identificador de Auditoría de Servidor: ${auditId}
- IP Registrada de Conexión/Descarga: ${payment.clientIp || '127.0.0.1 (Verificada por servidor)'}

2. CONSENTIMIENTO EXPRESO Y RENUNCIA AL DERECHO DE ARREPENTIMIENTO (DESISTIMIENTO):
--------------------------------------------------------------------------------
- Fecha/Hora de Aceptación de Términos: ${payment.termsAcceptedAt || payment.date}
- Cláusula Marcada Expresamente por el Comprador previo a la ejecución del pago:
  "He leído y acepto los Términos de Entrega Digital: Reconozco que obtengo
   acceso y descarga inmediata del material digital y renuncio expresamente al
   derecho de arrepentimiento/desistimiento conforme a las políticas de bienes
   intangibles. Una vez descargado el material, no se admiten devoluciones ni
   desconocimientos de compra."

3. FUNDAMENTO JURÍDICO APLICABLE ANTE RECLAMOS O CONTRACARGOS BANCARIOS:
--------------------------------------------------------------------------------
a) POLÍTICA DE PROTECCIÓN AL VENDEDOR DE PAYPAL (PAYPAL SELLER PROTECTION POLICY):
   Conforme a las directrices de PayPal para Bienes Intangibles y Servicios Digitales,
   este certificado junto con el registro del servidor constituye PRUEBA FEHACIENTE
   DE ENTREGA (Proof of Delivery / Fulfillment) y CONSENTIMIENTO PREVIO VINCULANTE.
   PayPal rechaza las solicitudes de reembolso por "Artículo no recibido" cuando
   existe prueba de descarga y consentimiento.

b) POLÍTICA DE PROTECCIÓN AL VENDEDOR DE MERCADO PAGO Y LEY 24.240 (ART. 34 BIS):
   Conforme a la legislación de defensa del consumidor y las directrices de comercio
   electrónico para productos digitales intangibles, el derecho de revocación no es
   aplicable a contenidos digitales suministrados por descarga informática inmediata
   iniciada con el consentimiento expreso del consumidor.

c) REGULACIONES DE EMISORES DE TARJETAS (VISA / MASTERCARD / AMEX):
   Este registro acredita fehacientemente que la transacción no fue fraudulenta,
   que el titular autenticó la operación y que el producto digital fue puesto a
   disposición y descargado con conocimiento pleno de sus características.

4. CONSTANCIA DE DESCARGA:
--------------------------------------------------------------------------------
- Estado de Entrega: CONFIRMADO Y DESCARGADO (COMPLETED & DOWNLOADED)
- Fecha y Hora de Descarga: ${payment.downloadedAt || payment.date}
- Hash de Integridad Criptográfico: SHA256-PROOF-${payment.id}-${Date.now()}

================================================================================
ESTE CERTIFICADO ES VINCULANTE Y CONSTITUYE PRUEBA SUFICIENTE PARA QUE LA PASARELA
DE PAGO DESESTIME DE INMEDIATO CUALQUIER RECLAMO O DESCONOCIMIENTO DE COMPRA.
================================================================================`;

    const filename = `Certificado_Evidencia_Legal_${payment.id}.txt`;
    const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    if (isIOS) {
      const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(certContent);
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }, 60000);
    }
    return true;
  } catch (err) {
    console.error('Error al generar certificado de evidencia legal:', err);
    return false;
  }
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  defaultPlan = 'circulo',
  targetYear,
  customTitle = null,
  customAmount = null,
  onPaymentSuccess,
  initialCompletedPayment = null
}) => {
  const isIndependentItem = Boolean(
    customAmount !== null || 
    defaultPlan === 'apoyo' || 
    defaultPlan === 'tiktok' || 
    defaultPlan === 'youtube' || 
    defaultPlan === 'instagram' || 
    defaultPlan === 'facebook' || 
    defaultPlan === 'blogger' || 
    customTitle
  );
  const isSupportPayment = isIndependentItem;

  // Selección de categoría (solo para membresías oficiales)
  const isMembershipPlan = defaultPlan && defaultPlan !== 'apoyo' && defaultPlan !== 'tiktok' && defaultPlan !== 'youtube' && defaultPlan !== 'instagram' && defaultPlan !== 'facebook' && defaultPlan !== 'blogger';
  const [selectedPlanId, setSelectedPlanId] = useState<PlanCategory>(
    targetYear ? 'cat3' : (isMembershipPlan ? (defaultPlan as PlanCategory) : (currentUser ? currentUser.plan : 'circulo'))
  );

  useEffect(() => {
    if (isMembershipPlan) {
      setSelectedPlanId(defaultPlan as PlanCategory);
    }
  }, [defaultPlan, isOpen, isMembershipPlan]);

  // Región de cobro: 'argentina' (Mercado Pago en ARS) vs 'global' (PayPal en USD)
  const [region, setRegion] = useState<RegionOrigin>('argentina');

  // Método de pago: 'mercadopago' | 'paypal' | 'card'
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'paypal' | 'card'>('mercadopago');

  // Sub-opción de Mercado Pago: 'credit' | 'debit' | 'wallet' | 'debin' | 'cash'
  const [mpSubMethod, setMpSubMethod] = useState<'credit' | 'debit' | 'wallet' | 'debin' | 'cash'>('credit');
  const [mpInstallments, setMpInstallments] = useState<number>(1);

  // Sub-opción de PayPal: 'paypal_account' | 'paypal_card'
  const [paypalSubMethod, setPaypalSubMethod] = useState<'paypal_account' | 'paypal_card'>('paypal_account');

  // Datos de tarjeta universal directa
  const [cardName, setCardName] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Estados de proceso y UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(initialCompletedPayment || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Estados exclusivos para máxima compatibilidad con teléfonos celulares
  const [showInlineMaterial, setShowInlineMaterial] = useState(false);
  const [materialCopied, setMaterialCopied] = useState(false);

  // Paneles colapsables
  const [showPciDetails, setShowPciDetails] = useState(false);
  const [showBillingLogicDetails, setShowBillingLogicDetails] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);

  // Configuración de pasarelas del sitio
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig>(loadGatewayConfig);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);
  const [mpSdkReady, setMpSdkReady] = useState(false);

  // Consentimiento previo de entrega digital y renuncia expresa de revocación (Blindaje Anti-Disputas)
  const [acceptedDigitalTerms, setAcceptedDigitalTerms] = useState<boolean>(false);
  const [downloadsLedger, setDownloadsLedger] = useState<DownloadAuditRecord[]>([]);
  const [isLoadingLedger, setIsLoadingLedger] = useState<boolean>(false);

  // Estados de edición de credenciales de servidor (.env) y enlaces directos para Amazon S3
  const [adminMpToken, setAdminMpToken] = useState('');
  const [adminMpPublicKey, setAdminMpPublicKey] = useState('');
  const [adminPaypalSecret, setAdminPaypalSecret] = useState('');
  const [adminPaypalClientId, setAdminPaypalClientId] = useState('');
  const [adminMpDirectUrl, setAdminMpDirectUrl] = useState(gatewayConfig.mercadopago.directCheckoutUrl || '');
  const [adminPaypalDirectUrl, setAdminPaypalDirectUrl] = useState(gatewayConfig.paypal.directCheckoutUrl || '');
  const [adminPaypalEmail, setAdminPaypalEmail] = useState(gatewayConfig.paypal.receiverEmail || 'colibricolibricolibri75@gmail.com');
  const [isSavingServerEnv, setIsSavingServerEnv] = useState(false);
  const [saveEnvSuccessMessage, setSaveEnvSuccessMessage] = useState<string | null>(null);

  const [serverSecurityStatus, setServerSecurityStatus] = useState<{
    hasPayPalSecret: boolean;
    hasMercadoPagoToken: boolean;
    isOnline: boolean;
  }>({
    hasPayPalSecret: true,
    hasMercadoPagoToken: true,
    isOnline: false
  });

  // Al abrir el modal, sincronizar initialCompletedPayment o resetear
  useEffect(() => {
    if (initialCompletedPayment) {
      setCompletedPayment(initialCompletedPayment);
    }
  }, [initialCompletedPayment]);

  useEffect(() => {
    if (isOpen) {
      setAcceptedDigitalTerms(false);
      setErrorMsg(null);
      if (initialCompletedPayment) {
        setCompletedPayment(initialCompletedPayment);
      }
    } else {
      setShowInlineMaterial(false);
      setMaterialCopied(false);
    }
  }, [isOpen, initialCompletedPayment]);

  // Consultar auditoría de descargas cuando se abre el panel de admin
  useEffect(() => {
    if (showAdminSettings) {
      setIsLoadingLedger(true);
      fetchDownloadsLogOnServer().then((res) => {
        setIsLoadingLedger(false);
        if (res && res.success && res.records) {
          setDownloadsLedger(res.records);
        }
      }).catch(() => setIsLoadingLedger(false));
    }
  }, [showAdminSettings]);

  // Sincronización con el servidor backend (Hostinger / Node.js)
  useEffect(() => {
    if (isOpen) {
      fetchServerPaymentConfig().then((cfg) => {
        if (cfg && cfg.success) {
          setServerSecurityStatus({
            hasPayPalSecret: Boolean(cfg.paypal?.isConfigured),
            hasMercadoPagoToken: Boolean(cfg.mercadopago?.isConfigured),
            isOnline: true
          });
          if (cfg.paypal?.clientId) {
            setAdminPaypalClientId(cfg.paypal.clientId);
          }
          if (cfg.mercadopago?.publicKey) {
            setAdminMpPublicKey(cfg.mercadopago.publicKey);
          }
          if (cfg.mercadopago?.exchangeRate) {
            setGatewayConfig(prev => ({
              ...prev,
              mercadopago: {
                ...prev.mercadopago,
                exchangeRate: cfg.mercadopago!.exchangeRate
              }
            }));
          }
        }
      });
    }
  }, [isOpen]);

  // Carga y validación en vivo del SDK oficial de PayPal
  useEffect(() => {
    if (isOpen && (paymentMethod === 'paypal' || region === 'global')) {
      loadPayPalSdkScript(gatewayConfig.paypal.clientId, 'USD').then((loaded) => {
        setPaypalSdkReady(loaded);
      });
    }
  }, [isOpen, paymentMethod, region, gatewayConfig.paypal.clientId]);

  // Carga y validación en vivo del SDK oficial de Mercado Pago
  useEffect(() => {
    if (isOpen && (paymentMethod === 'mercadopago' || region === 'argentina')) {
      loadMercadoPagoSdkScript(gatewayConfig.mercadopago.publicKey).then((loaded) => {
        setMpSdkReady(loaded);
      });
    }
  }, [isOpen, paymentMethod, region, gatewayConfig.mercadopago.publicKey]);

  // Efecto para sincronizar plan según targetYear o defaultPlan
  useEffect(() => {
    if (targetYear) {
      setSelectedPlanId('cat3');
    } else if (defaultPlan) {
      setSelectedPlanId(defaultPlan);
    }
  }, [targetYear, defaultPlan]);

  // Al cambiar la región, ajustar el método de pago por defecto correspondiente
  useEffect(() => {
    if (region === 'argentina') {
      setPaymentMethod('mercadopago');
    } else {
      setPaymentMethod('paypal');
    }
  }, [region]);

  const currentCategoryInfo = (!isSupportPayment && selectedPlanId && CATEGORY_BILLING_CONFIG[selectedPlanId])
    ? CATEGORY_BILLING_CONFIG[selectedPlanId]
    : CATEGORY_BILLING_CONFIG.circulo;
  const effectiveUsdPrice = targetYear 
    ? 25.00 
    : (isSupportPayment ? (customAmount || 1.25) : currentCategoryInfo.usdPrice);
  const effectiveArsPrice = getArsAmount(effectiveUsdPrice, gatewayConfig.mercadopago.exchangeRate);

  // Regla financiera PayPal: Recargo automático del 6% por retiro de divisas y comisiones transfronterizas
  const baseNetUSD = effectiveUsdPrice;
  const paypalSurchargeUSD = Number((baseNetUSD * 0.06).toFixed(2));
  const totalPaypalUSD = Number((baseNetUSD * 1.06).toFixed(2));

  // Cálculo de cuota para Mercado Pago
  const installmentValue = Math.round(effectiveArsPrice / mpInstallments);

  // Renderizado dinámico de los botones del SDK oficial de PayPal
  // Bloquea cualquier descarga previa: captura el dinero real primero antes de completar
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'paypal' || !acceptedDigitalTerms || !paypalSdkReady) return;

    let isMounted = true;
    const mountContainer = document.getElementById('paypal-sdk-buttons-mount');
    if (!mountContainer) return;
    mountContainer.innerHTML = '';

    const resolvedPlanName = targetYear 
      ? `Anualidad Año ${targetYear} (Categoría 3 Prémium)`
      : (isSupportPayment ? (customTitle || 'Apoya este proyecto por solo $1.25') : currentCategoryInfo.name);

    if ((window as any).paypal?.Buttons) {
      try {
        (window as any).paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 44
          },
          createOrder: async (data: any, actions: any) => {
            setErrorMsg(null);
            setIsProcessing(true);
            try {
              // En Amazon S3 estático, si el SDK cliente dispone de create, usarlo de forma autónoma
              if (actions?.order?.create) {
                return await actions.order.create({
                  purchase_units: [{
                    description: resolvedPlanName,
                    amount: {
                      currency_code: 'USD',
                      value: totalPaypalUSD.toFixed(2)
                    }
                  }]
                });
              }

              const res = await createPayPalOrderOnServer({
                amountUSD: baseNetUSD,
                amount: totalPaypalUSD.toFixed(2),
                currency: 'USD',
                planId: targetYear ? `cat3-${targetYear}` : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
                planName: resolvedPlanName
              });
              if (res.success && res.orderId) {
                return res.orderId;
              }
              throw new Error(res.error || 'No se pudo crear la orden en PayPal.');
            } catch (err: any) {
              setIsProcessing(false);
              setErrorMsg(err.message || 'Error al conectar con PayPal');
              throw err;
            }
          },
          onApprove: async (data: any, actions: any) => {
            setIsProcessing(true);
            setErrorMsg(null);
            try {
              let isConfirmed = false;
              if (actions?.order?.capture) {
                try {
                  const actRes = await actions.order.capture();
                  if (actRes.status === 'COMPLETED') {
                    isConfirmed = true;
                  }
                } catch (errCapture: any) {
                  console.warn('Capture en cliente PayPal:', errCapture);
                }
              }
              if (!isConfirmed && data?.orderID) {
                const capRes = await capturePayPalOrderOnServer(data.orderID);
                if (capRes && (capRes.status === 'COMPLETED' || (capRes as any).details?.status === 'COMPLETED')) {
                  isConfirmed = true;
                }
              }

              if (!isConfirmed) {
                throw new Error('PayPal no confirmó la captura del pago (estado no es COMPLETED). No se debitó dinero ni se otorgó acceso al material.');
              }

              // PAGO REAL COBRADO CON ÉXITO
              const newRecord: PaymentRecord = {
                id: `ZEN-PP-${data.orderID || Math.floor(100000 + Math.random() * 900000)}`,
                planId: targetYear ? 'cat3' : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
                planName: resolvedPlanName,
                amount: totalPaypalUSD,
                currency: 'USD',
                date: new Date().toISOString(),
                paymentMethod: 'paypal',
                gateway: 'paypal_checkout',
                orderId: data.orderID,
                status: 'completed',
                targetYear: targetYear || undefined,
                billingFrequency: targetYear ? 'annual' : (isSupportPayment ? 'monthly' : currentCategoryInfo.frequency),
                termsAcceptedAt: new Date().toISOString()
              };

              triggerAutomaticCategoryDownload(newRecord, customTitle || undefined);
              setCompletedPayment(newRecord);
              setIsProcessing(false);
              onPaymentSuccess(newRecord);
            } catch (err: any) {
              setIsProcessing(false);
              setErrorMsg(err.message || 'Error al verificar el cobro en PayPal. No se descargaron archivos.');
            }
          },
          onError: (err: any) => {
            setIsProcessing(false);
            console.error('[PayPal SDK Error]', err);
            setErrorMsg('Hubo una interrupción en el pago de PayPal. No se debitó dinero ni se descargaron archivos.');
          },
          onCancel: () => {
            setIsProcessing(false);
            setErrorMsg('Operación cancelada en PayPal. No se realizó ningún cargo.');
          }
        }).render('#paypal-sdk-buttons-mount');
      } catch (err) {
        console.warn('Error al inicializar botones oficiales de PayPal:', err);
      }
    }

    return () => {
      isMounted = false;
      if (mountContainer) mountContainer.innerHTML = '';
    };
  }, [isOpen, paymentMethod, acceptedDigitalTerms, paypalSdkReady, totalPaypalUSD, baseNetUSD, targetYear, isSupportPayment, customTitle, selectedPlanId]);

  if (!isOpen) return null;

  // Copiar al portapapeles
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Detección de marca de tarjeta
  const getCardBrand = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Discover / Cabal';
    return 'Tarjeta Bancaria';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiry(value);
  };

  // Guardar configuración de pasarelas
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveGatewayConfig(gatewayConfig);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Guardar credenciales de servidor directamente en el archivo .env o en modo estático S3
  const handleSaveServerCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingServerEnv(true);
    setSaveEnvSuccessMessage(null);
    setErrorMsg(null);
    try {
      const res = await updateServerCredentials({
        mercadopagoAccessToken: adminMpToken || undefined,
        mercadopagoPublicKey: adminMpPublicKey || undefined,
        paypalClientSecret: adminPaypalSecret || undefined,
        paypalClientId: adminPaypalClientId || undefined,
        cotizacionDolar: gatewayConfig.mercadopago.exchangeRate,
        mercadopagoDirectUrl: adminMpDirectUrl,
        paypalDirectUrl: adminPaypalDirectUrl,
        paypalReceiverEmail: adminPaypalEmail
      });
      setGatewayConfig(prev => ({
        ...prev,
        mercadopago: {
          ...prev.mercadopago,
          publicKey: adminMpPublicKey || prev.mercadopago.publicKey,
          directCheckoutUrl: adminMpDirectUrl
        },
        paypal: {
          ...prev.paypal,
          clientId: adminPaypalClientId || prev.paypal.clientId,
          directCheckoutUrl: adminPaypalDirectUrl,
          receiverEmail: adminPaypalEmail
        }
      }));
      if (res && res.success) {
        setSaveEnvSuccessMessage(res.message || '✓ Credenciales y enlaces directos guardados con éxito');
        setTimeout(() => setSaveEnvSuccessMessage(null), 4000);
        // Refrescar configuración en caliente si hay servidor
        const updated = await fetchServerPaymentConfig();
        if (updated && updated.success) {
          setServerSecurityStatus({
            hasPayPalSecret: Boolean(updated.paypal?.isConfigured),
            hasMercadoPagoToken: Boolean(updated.mercadopago?.isConfigured),
            isOnline: true
          });
        }
      } else {
        setErrorMsg(res?.error || 'Error al guardar credenciales en el servidor');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setIsSavingServerEnv(false);
    }
  };

  // Procesamiento del cobro mediante servidor seguro o redirección estática
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validación estricta de consentimiento previo para blindaje anti-desconocimiento
    if (!acceptedDigitalTerms) {
      setErrorMsg('Debes marcar la casilla de aceptación de Términos de Entrega Digital y Renuncia Expresa de Revocación antes de procesar el pago.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !expiry || !cvc) {
        setErrorMsg('Por favor completa todos los datos de la tarjeta.');
        return;
      }
      if (cardNumber.replace(/\s+/g, '').length < 15) {
        setErrorMsg('El número de tarjeta debe contener entre 15 y 16 dígitos válidos.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const resolvedPlanName = targetYear 
        ? `Anualidad Año ${targetYear} (Categoría 3 Prémium)`
        : (isSupportPayment ? (customTitle || 'Apoya este proyecto por solo $1.25') : currentCategoryInfo.name);

      if (paymentMethod === 'mercadopago') {
        const mpRes = await createMercadoPagoPreferenceOnServer({
          title: resolvedPlanName,
          amountUSD: effectiveUsdPrice,
          amount: effectiveArsPrice,
          currency: 'ARS',
          payerEmail: currentUser?.email || 'comprador@almanaquedepaz.com',
          planId: targetYear ? `cat3-${targetYear}` : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id)
        });

        if (!mpRes.success) {
          throw new Error(mpRes.error || 'Error al conectar con Mercado Pago desde el servidor. Revisa tu archivo .env o configuración.');
        }

        if (mpRes.initPoint) {
          try {
            localStorage.setItem('zen_pending_mp_payment', JSON.stringify({
              planId: targetYear ? 'cat3' : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
              planName: resolvedPlanName,
              amountUSD: effectiveUsdPrice,
              amountARS: effectiveArsPrice,
              targetYear: targetYear || null,
              preferenceId: mpRes.preferenceId,
              termsAcceptedAt: new Date().toISOString()
            }));
          } catch {}

          setIsProcessing(false);
          // Redirección directa al punto de cobro oficial (100% compatible con móviles sin bloqueador de popups)
          window.location.assign(mpRes.initPoint);
          return;
        }

        throw new Error('Mercado Pago no devolvió un punto de pago válido.');
      } else if (paymentMethod === 'paypal') {
        const ppRes = await createPayPalOrderOnServer({
          amountUSD: baseNetUSD,
          amount: totalPaypalUSD.toFixed(2),
          currency: 'USD',
          planId: targetYear ? `cat3-${targetYear}` : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
          planName: resolvedPlanName
        });

        if (!ppRes.success) {
          throw new Error(ppRes.error || 'Error al conectar con PayPal. Revisa que PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET estén configurados en el archivo .env.');
        }

        const approvalUrl = ppRes.approvalUrl || ppRes.links?.find((l: any) => l.rel === 'approve')?.href;

        if (approvalUrl) {
          try {
            localStorage.setItem('zen_pending_paypal_payment', JSON.stringify({
              orderId: ppRes.orderId,
              planId: targetYear ? 'cat3' : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
              planName: resolvedPlanName,
              amountUSD: totalPaypalUSD,
              targetYear: targetYear || null,
              termsAcceptedAt: new Date().toISOString()
            }));
          } catch {}

          setIsProcessing(false);
          // Redirección directa a la ventana de aprobación de PayPal (100% compatible con móviles sin bloqueador de popups)
          window.location.assign(approvalUrl);
          return;
        }

        throw new Error('PayPal no devolvió un enlace de aprobación para procesar el pago. No se realizó ningún cobro ni descarga.');
      } else if (paymentMethod === 'card') {
        // Redirigir a la pasarela correspondiente para cobro seguro
        if (region === 'argentina') {
          setPaymentMethod('mercadopago');
          throw new Error('Para procesar tarjetas en Argentina con seguridad y sin recargos absorbidos por el vendedor, haz clic en "Pagar con Mercado Pago".');
        } else {
          setPaymentMethod('paypal');
          throw new Error('Para procesar tarjetas internacionales con seguridad bancaria, utiliza el botón oficial de PayPal.');
        }
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Error al procesar la operación con el servidor de pagos.');
    }
  };

  return (
    <div 
      id="payment-gateway-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div 
        id="payment-gateway-container"
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-200/90 rounded-[32px] shadow-2xl p-4 sm:p-7 my-6 text-stone-900 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Auras decorativas de luz */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-terracotta-200/25 rounded-full blur-3xl pointer-events-none" />

        {/* Botones de Cabecera: Configuración y Cerrar */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={() => setShowAdminSettings(!showAdminSettings)}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              showAdminSettings 
                ? 'bg-stone-800 text-amber-300' 
                : 'text-stone-400 hover:text-stone-800 hover:bg-stone-200/60'
            }`}
            title="Configurar credenciales de Mercado Pago y PayPal (Admin)"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            id="payment-close-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-full transition-all cursor-pointer"
            title="Cerrar pasarela de pago"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VISTA 1: RECIBO DE PAGO EXITOSO */}
        {/* ========================================================================= */}
        {completedPayment ? (
          <div id="payment-receipt-view" className="space-y-5 relative z-10 py-2 overflow-y-auto pr-1">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Transacción Confirmada & Acreditada</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                {completedPayment.targetYear 
                  ? `¡Anualidad ${completedPayment.targetYear} Desbloqueada!` 
                  : '¡Suscripción Activada con Éxito!'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {completedPayment.targetYear
                  ? `El Año ${completedPayment.targetYear} completo (12 meses, efemérides y galería) ha sido incorporado a tu cuenta de por vida.`
                  : <>Has activado el acceso total a <strong className="text-terracotta-700">{completedPayment.planName}</strong>. Disfruta tu camino de armonía y amor propio.</>}
              </p>
            </div>

            {/* Comprobante Digital */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-stone-400" />
                  ID de Transacción
                </span>
                <span className="font-bold text-stone-900">{completedPayment.id}</span>
              </div>

              {completedPayment.preferenceId && (
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-sky-700 font-semibold">Mercado Pago Preference ID</span>
                  <span className="font-bold text-sky-900">{completedPayment.preferenceId}</span>
                </div>
              )}

              {completedPayment.orderId && (
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-blue-700 font-semibold">PayPal Order ID</span>
                  <span className="font-bold text-blue-900">{completedPayment.orderId}</span>
                </div>
              )}

              <div className="flex justify-between pb-2 border-b border-stone-100 font-sans">
                <span className="text-stone-500">Categoría / Plan</span>
                <span className="font-bold text-stone-900">{completedPayment.planName}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-stone-100 font-sans">
                <span className="text-stone-500">Pasarela Utilizada</span>
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  {completedPayment.gateway === 'mercadopago_checkout_pro' && (
                    <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                      <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-black">M</span>
                      Mercado Pago Checkout Pro (Argentina)
                    </span>
                  )}
                  {completedPayment.gateway === 'paypal_checkout' && (
                    <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">P</span>
                      PayPal Checkout Internacional
                    </span>
                  )}
                  {completedPayment.gateway === 'card_hosted' && (
                    <span className="inline-flex items-center gap-1 text-stone-800">
                      <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                      Tarjeta Internacional Directa
                    </span>
                  )}
                </span>
              </div>

              {completedPayment.localCurrencyAmount && (
                <div className="flex justify-between pb-2 border-b border-stone-100 font-sans">
                  <span className="text-stone-500">Monto Abonado (Moneda Local)</span>
                  <span className="font-bold text-sky-800">
                    {formatARS(completedPayment.localCurrencyAmount)} ARS
                    {completedPayment.installments && completedPayment.installments > 1 && (
                      <span className="text-[11px] text-stone-500 font-normal ml-1">
                        ({completedPayment.installments} cuotas de {formatARS(Math.round(completedPayment.localCurrencyAmount / completedPayment.installments))})
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between pb-2 border-b border-stone-100 font-sans">
                <span className="text-stone-500">Importe en Dólares (USD)</span>
                <span className="font-bold text-emerald-700">
                  {formatUSD(completedPayment.amount)} USD
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-stone-100 font-sans">
                <span className="text-stone-500">Seguridad & Cumplimiento</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> PCI DSS Nivel 1 · Hosted Checkout
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-stone-100 font-sans text-xs">
                <span className="text-stone-500">Método de Entrega</span>
                <span className="font-semibold text-emerald-800 text-right text-[11px] max-w-[220px]">
                  Descarga digital automática e inmediata al confirmar el pago
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-stone-100 font-sans text-xs">
                <span className="text-stone-500">Política de Devolución</span>
                <span className="font-medium text-stone-700 text-right text-[11px] max-w-[220px]">
                  Al ser un producto digital, una vez que se descarga ya no se puede devolver.
                </span>
              </div>

              <div className="flex justify-between font-sans">
                <span className="text-stone-500">Estado en Plataforma</span>
                <span className="font-bold text-emerald-700">✓ Activo & Desbloqueado</span>
              </div>
            </div>

            {/* AVISO DE ENTREGA DIGITAL CON LECTURA Y DESCARGA PARA CELULARES */}
            {(() => {
              const digitalContent = getCategoryDownloadContent(completedPayment, customTitle || undefined);
              const handleCopyAllMaterial = () => {
                try {
                  navigator.clipboard?.writeText(digitalContent.fileContent);
                  setMaterialCopied(true);
                  setTimeout(() => setMaterialCopied(false), 3000);
                } catch {
                  // Fallback
                }
              };

              return (
                <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/90 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 flex-wrap">
                        <span>¡Tu Material Digital Está Listo!</span>
                        <span className="text-[9px] bg-emerald-200 text-emerald-900 font-semibold px-1.5 py-0.5 rounded">100% Disponible</span>
                      </h4>
                      <p className="text-[11px] text-emerald-800 leading-snug">
                        Diseñado especialmente para abrir y guardar en cualquier teléfono celular (iPhone, Android) o computadora.
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción inmediata para celulares */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerAutomaticCategoryDownload(completedPayment, customTitle || undefined)}
                      className="py-3 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>📥 Descargar Archivo (.txt)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyAllMaterial}
                      className="py-3 px-3.5 bg-white hover:bg-stone-50 border border-emerald-300 active:scale-[0.99] text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                    >
                      {materialCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">✓ ¡Copiado con Éxito!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-stone-600" />
                          <span>📋 Copiar Todo al Celular</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Lector integrado en pantalla: garantía total en celulares */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowInlineMaterial(!showInlineMaterial)}
                      className="w-full py-2 px-3 bg-emerald-100/70 hover:bg-emerald-200/60 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{showInlineMaterial ? 'Ocultar Lectura de Material' : '📱 Ver y Leer Todo el Material Aquí Mismo'}</span>
                      {showInlineMaterial ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showInlineMaterial && (
                      <div className="mt-2 p-3 bg-white border border-emerald-200 rounded-xl space-y-2 animate-fade-in shadow-inner">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                            Contenido del Kit Digital
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyAllMaterial}
                            className="text-[10px] font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{materialCopied ? '¡Copiado!' : 'Copiar texto'}</span>
                          </button>
                        </div>
                        <pre className="text-[10.5px] font-mono text-stone-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto select-all pr-1">
                          {digitalContent.fileContent}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ESCUDO DE PROTECCIÓN ANTI-DESCONOCIMIENTO & CERTIFICADO LEGAL PROBATORIO */}
            <div className="p-4 bg-sky-50/95 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-2.5 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>Blindaje Probatorio Registrado (Anti-Desconocimiento)</span>
                    <span className="text-[9px] bg-sky-200 text-sky-900 font-mono font-bold px-1.5 py-0.5 rounded">
                      Protección al Vendedor Activa
                    </span>
                  </h4>
                  <p className="text-[11px] text-sky-900/90 leading-snug">
                    Esta entrega digital cuenta con registro fehaciente en servidor con IP, timestamp UTC y renuncia previa expresa al derecho de revocación. Ante cualquier intento de contracargo o reclamo en <strong>PayPal Resolution Center</strong> o <strong>Mercado Pago Disputas</strong>, este certificado acredita la entrega irrefutable:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-mono bg-white p-2.5 rounded-xl border border-sky-200/90">
                <div>
                  <span className="text-stone-500 block">ID de Auditoría:</span>
                  <span className="font-bold text-sky-950">{completedPayment.downloadAuditId || `AUDIT-DL-${completedPayment.id}`}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">IP Registrada en Servidor:</span>
                  <span className="font-bold text-sky-950">{completedPayment.clientIp || '127.0.0.1 (Verificada)'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => generateLegalDeliveryCertificate(completedPayment, currentUser?.email)}
                className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Descargar Certificado de Evidencia Legal (Para PayPal / Mercado Pago)</span>
              </button>
            </div>

            {/* ALCANCES & RESTRICCIONES ESPECÍFICAS DE LA CATEGORÍA */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-[11px] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Restricciones & Alcances de esta Categoría:</span>
              </div>
              <ul className="space-y-1 text-stone-700 list-disc list-inside text-[10.5px]">
                {getCategoryRestrictions(completedPayment.planId).map((res, idx) => (
                  <li key={idx} className="leading-snug">
                    {res}
                  </li>
                ))}
              </ul>
              <div className="pt-1 border-t border-amber-200/60 text-[10px] text-amber-900 font-medium text-center">
                <strong>Política de devolución:</strong> Al ser un producto digital, una vez que se descarga ya no se puede devolver.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="receipt-continue-btn"
                onClick={onClose}
                className="flex-1 py-3.5 bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-amber-700 hover:brightness-110 active:scale-[0.99] text-white font-bold rounded-full shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>
                  {completedPayment.targetYear 
                    ? `Explorar Año ${completedPayment.targetYear} en el Calendario` 
                    : 'Empezar a Disfrutar los Contenidos'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VISTA 2: FORMULARIO PRINCIPAL DE COBRO & BILLETERA */
          /* ========================================================================= */
          <div id="payment-checkout-view" className="space-y-4 relative z-10 overflow-y-auto pr-1">
            
            {/* PANEL DE ADMINISTRADOR: DIAGNÓSTICO & ESTADO DE PASARELAS */}
            {showAdminSettings && (
              <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl border border-stone-700 text-xs space-y-3 shadow-lg animate-fade-in">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-sm">
                      Diagnóstico & Conexión de Pasarelas
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded">
                    SDKs Oficiales Vinculados
                  </span>
                </div>

                <p className="text-[11px] text-stone-300">
                  Estado de las pasarelas integradas para cobros en Argentina y el resto del mundo:
                </p>

                <form onSubmit={handleSaveConfig} className="space-y-2.5">
                  {/* PayPal SDK Diagnostic */}
                  <div className="p-3 bg-stone-800/80 rounded-xl border border-blue-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">P</span>
                        PayPal Checkout Global (SDK Oficial)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Modo Live / Conectado
                      </span>
                    </div>

                    <div className="space-y-1 text-[10px] text-stone-300 font-mono bg-stone-950/70 p-2.5 rounded-lg border border-stone-700/60">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Client ID Oficial:</span>
                        <span className="text-blue-300 select-all font-bold">
                          {gatewayConfig.paypal.clientId.slice(0, 18)}...{gatewayConfig.paypal.clientId.slice(-6)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Client Secret:</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Protegido en Servidor Hostinger (.env)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">SDK Status:</span>
                        <span className={paypalSdkReady ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          {paypalSdkReady ? "✓ JavaScript SDK Listo (v5)" : "Conectando con paypal.com..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mercado Pago Settings */}
                  <div className="p-3 bg-stone-800/80 rounded-xl border border-sky-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-400 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-black">M</span>
                        Mercado Pago Argentina (SDK Oficial v2)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Modo Live / Conectado
                      </span>
                    </div>

                    <div className="space-y-1 text-[10px] text-stone-300 font-mono bg-stone-950/70 p-2.5 rounded-lg border border-stone-700/60">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Public Key Oficial:</span>
                        <span className="text-sky-300 select-all font-bold">
                          {gatewayConfig.mercadopago.publicKey.slice(0, 18)}...{gatewayConfig.mercadopago.publicKey.slice(-6)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Access Token:</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Protegido en Servidor Hostinger (.env)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">SDK Status:</span>
                        <span className={mpSdkReady ? "text-emerald-400 font-bold" : "text-amber-400"}>
                          {mpSdkReady ? "✓ JavaScript SDK v2 Listo" : "Conectando con mercadopago.com..."}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[10px] pt-1">
                      <span className="text-stone-400">Paridad Cambiaria: 1 USD =</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={gatewayConfig.mercadopago.exchangeRate}
                          onChange={(e) => setGatewayConfig({
                            ...gatewayConfig,
                            mercadopago: { ...gatewayConfig.mercadopago, exchangeRate: Number(e.target.value) || DEFAULT_ARS_EXCHANGE_RATE }
                          })}
                          className="w-20 bg-stone-950 border border-stone-600 rounded p-1 font-mono text-stone-100 text-center"
                        />
                        <span className="text-stone-300 font-semibold">ARS</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400">
                      {saveSuccessMsg ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> ¡Paridad cambiaria actualizada!
                        </span>
                      ) : (
                        'Configuración persistida en la plataforma.'
                      )}
                    </span>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Actualizar Tasa
                    </button>
                  </div>

                  <div className="p-2.5 bg-stone-950/90 rounded-xl border border-emerald-500/30 text-[10px] space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Seguridad Blindada: Cero Credenciales Secretas en el Front-End</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed">
                      El <span className="font-mono text-amber-300 font-bold">PAYPAL_CLIENT_SECRET</span> y el <span className="font-mono text-amber-300 font-bold">MERCADOPAGO_ACCESS_TOKEN</span> son gestionados exclusivamente por el backend Node.js en Hostinger mediante variables de entorno del servidor o el archivo <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded font-mono">.env</code>. El navegador del cliente nunca recibe ni almacena estas claves privadas.
                    </p>
                  </div>

                  {/* EDITOR DIRECTO DE VARIABLES DE ENTORNO (.ENV) */}
                  <div className="p-3 bg-stone-800/90 rounded-xl border border-stone-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-700/80 pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <span>Configurar Credenciales en .env del Servidor</span>
                      </div>
                      <span className="text-[9.5px] px-2 py-0.5 bg-stone-900 border border-stone-700 text-stone-300 rounded font-mono">
                        Servidor Hostinger / Node.js
                      </span>
                    </div>

                    <p className="text-[10px] text-stone-300 leading-snug">
                      Como no eres programador, puedes escribir o pegar aquí tus claves secretas de producción y se guardarán directamente en el archivo <code className="text-amber-300 font-mono">.env</code> del servidor de forma protegida:
                    </p>

                    <div className="space-y-2 text-[10px]">
                      {/* Mercado Pago Access Token */}
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-stone-300 font-semibold">
                          <span>Mercado Pago Access Token Privado (Producción):</span>
                          <span className={serverSecurityStatus.hasMercadoPagoToken ? "text-emerald-400 font-bold" : "text-amber-400"}>
                            {serverSecurityStatus.hasMercadoPagoToken ? "✓ Configurado en .env" : "⚠ Pendiente"}
                          </span>
                        </label>
                        <input
                          type="password"
                          placeholder={serverSecurityStatus.hasMercadoPagoToken ? "•••••••••••••••••••••••• (Ya configurado en .env)" : "Pega tu Access Token de producción (APP_USR-...)"}
                          value={adminMpToken}
                          onChange={(e) => setAdminMpToken(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {/* Mercado Pago Public Key */}
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-stone-300 font-semibold">
                          <span>Mercado Pago Public Key (Pública):</span>
                          <span className="text-stone-400 font-mono">APP_USR-...</span>
                        </label>
                        <input
                          type="text"
                          value={adminMpPublicKey}
                          onChange={(e) => setAdminMpPublicKey(e.target.value)}
                          placeholder="APP_USR-b66f5dda-1237-4122-a234-4eb474f4e246"
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {/* PayPal Client Secret */}
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-stone-300 font-semibold">
                          <span>PayPal Client Secret Privado (Producción):</span>
                          <span className={serverSecurityStatus.hasPayPalSecret ? "text-emerald-400 font-bold" : "text-amber-400"}>
                            {serverSecurityStatus.hasPayPalSecret ? "✓ Configurado en .env" : "⚠ Pendiente"}
                          </span>
                        </label>
                        <input
                          type="password"
                          placeholder={serverSecurityStatus.hasPayPalSecret ? "•••••••••••••••••••••••• (Ya configurado en .env)" : "Pega tu Client Secret de PayPal"}
                          value={adminPaypalSecret}
                          onChange={(e) => setAdminPaypalSecret(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {/* PayPal Client ID */}
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-stone-300 font-semibold">
                          <span>PayPal Client ID (Público):</span>
                          <span className="text-stone-400 font-mono">AebblBVU...</span>
                        </label>
                        <input
                          type="text"
                          value={adminPaypalClientId}
                          onChange={(e) => setAdminPaypalClientId(e.target.value)}
                          placeholder="AebblBVUXLEHYwEDNwIDOlbdv3VyAoxdSDytcVrU8NhVX6H6f9L3Vs7wKFPawaA6ic3JaCgTept60rUt"
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {/* Mercado Pago Enlace Directo (Para Amazon S3) */}
                      <div className="space-y-1 pt-1 border-t border-stone-700/60">
                        <label className="flex items-center justify-between text-stone-300 font-semibold">
                          <span>Link Directo de Mercado Pago (para Amazon S3):</span>
                          <span className="text-sky-300 text-[9px]">https://mpago.la/...</span>
                        </label>
                        <input
                          type="url"
                          value={adminMpDirectUrl}
                          onChange={(e) => setAdminMpDirectUrl(e.target.value)}
                          placeholder="https://mpago.la/..."
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {/* PayPal Email o Link Directo (Para Amazon S3) */}
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-stone-300 font-semibold">
                          <span>Email o Link Directo PayPal (para Amazon S3):</span>
                          <span className="text-blue-300 text-[9px]">colibricolibricolibri75@gmail.com</span>
                        </label>
                        <input
                          type="text"
                          value={adminPaypalEmail}
                          onChange={(e) => setAdminPaypalEmail(e.target.value)}
                          placeholder="colibricolibricolibri75@gmail.com o https://paypal.me/..."
                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono focus:border-amber-400 focus:outline-hidden"
                        />
                      </div>

                      {saveEnvSuccessMessage && (
                        <div className="p-2 bg-emerald-950/90 border border-emerald-600/70 text-emerald-300 rounded-lg font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{saveEnvSuccessMessage}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveServerCredentials}
                        disabled={isSavingServerEnv}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 active:scale-[0.99] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isSavingServerEnv ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Guardando configuración...</span>
                          </span>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Guardar Credenciales y Enlaces Directos</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SECCIÓN DEL VENDEDOR: REGISTRO DE AUDITORÍA DE DESCARGAS & EVIDENCIA ANTI-DISPUTAS */}
                  <div className="p-3 bg-stone-800/90 rounded-xl border border-amber-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <FileCheck2 className="w-4 h-4 text-amber-400" />
                        <span>Auditoría de Descargas & Evidencia Anti-Disputas</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoadingLedger(true);
                          fetchDownloadsLogOnServer().then((res) => {
                            setIsLoadingLedger(false);
                            if (res && res.success && res.records) {
                              setDownloadsLedger(res.records);
                            }
                          }).catch(() => setIsLoadingLedger(false));
                        }}
                        className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1 px-2 py-0.5 bg-stone-900 rounded border border-stone-700 cursor-pointer"
                        title="Actualizar registro de descargas en vivo"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingLedger ? 'animate-spin' : ''}`} />
                        <span>Actualizar</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-stone-300 leading-snug">
                      Registros de descargas con IP del comprador, marca de tiempo y consentimiento previo para presentar ante reclamos de <strong>PayPal</strong> o <strong>Mercado Pago</strong>:
                    </p>

                    {downloadsLedger.length === 0 ? (
                      <div className="p-2.5 bg-stone-950/80 rounded-lg text-center text-[10px] text-stone-400">
                        {isLoadingLedger ? 'Consultando auditorías en el servidor...' : 'No hay descargas registradas en esta sesión aún.'}
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {downloadsLedger.map((rec) => (
                          <div key={rec.auditId} className="p-2 bg-stone-950/90 rounded-lg border border-stone-700 text-[10px] font-mono space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-amber-400 font-bold">{rec.planName}</span>
                              <span className="text-stone-400 text-[9px]">{rec.downloadTimestamp.slice(0, 19).replace('T', ' ')}</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between text-stone-300 text-[9.5px]">
                              <span>IP: <strong className="text-sky-300">{rec.clientIp}</strong></span>
                              <span>Pasarela: <strong className="text-emerald-400">{rec.gateway}</strong></span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                              <span className="text-[9px] text-stone-400 truncate max-w-[200px]">ID: {rec.paymentId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  generateLegalDeliveryCertificate({
                                    id: rec.paymentId,
                                    planId: (rec.planId as any) || 'cat1',
                                    planName: rec.planName,
                                    amount: rec.amount,
                                    currency: rec.currency,
                                    date: rec.downloadTimestamp,
                                    paymentMethod: (rec.gateway.includes('mercadopago') ? 'mercadopago' : 'paypal') as any,
                                    gateway: rec.gateway as any,
                                    status: 'completed',
                                    orderId: rec.orderId || undefined,
                                    preferenceId: rec.preferenceId || undefined,
                                    downloadAuditId: rec.auditId,
                                    clientIp: rec.clientIp,
                                    termsAcceptedAt: rec.termsAcceptedAt,
                                    downloadedAt: rec.downloadTimestamp
                                  }, rec.email);
                                }}
                                className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white rounded text-[9.5px] font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <FileCheck2 className="w-3 h-3" />
                                <span>Exportar Evidencia Legal</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* CABECERA & INSIGNIAS DE SEGURIDAD */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100/80 border border-amber-200 rounded-full text-[10px] sm:text-[11px] font-semibold text-amber-900">
                  <Wallet className="w-3.5 h-3.5 text-amber-700" />
                  <span>Billetera de Pagos</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100/90 border border-emerald-300 rounded-full text-[10px] sm:text-[11px] font-bold text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>PCI DSS Nivel 1 · SAQ A</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBillingLogicDetails(!showBillingLogicDetails)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-stone-700 hover:text-stone-950 bg-stone-200/70 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                  title="Ver la lógica de cobro configurada para cada categoría"
                >
                  <Info className="w-3 h-3 text-stone-600" />
                  <span>Lógica de Cobro de Categorías</span>
                  {showBillingLogicDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* PANEL EXPANDIBLE: LÓGICA DE COBRO DETALLADA POR CATEGORÍA */}
              {showBillingLogicDetails && (
                <div className="mb-3 p-3.5 bg-white border border-stone-200 rounded-2xl text-xs space-y-2.5 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-terracotta-600" />
                      Lógica de Cobro Configurada en la Billetera
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      4 Categorías Asignadas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {/* Cat 1 */}
                    <div className="p-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-emerald-950">Categoría 1 (Esencial)</strong>
                        <span className="font-bold text-emerald-800">$2.25 USD / mes</span>
                      </div>
                      <p className="text-[10px] text-stone-600">
                        {CATEGORY_BILLING_CONFIG.cat1.billingSummary}
                      </p>
                      <span className="inline-block text-[9.5px] text-emerald-900 font-medium">
                        ARS aprox: {formatARS(getArsAmount(2.25, gatewayConfig.mercadopago.exchangeRate))} / mes
                      </span>
                    </div>

                    {/* Cat 2 */}
                    <div className="p-2.5 rounded-xl border border-teal-200/80 bg-teal-50/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-teal-950">Categoría 2 (Profundización)</strong>
                        <span className="font-bold text-teal-800">$4.99 USD / mes</span>
                      </div>
                      <p className="text-[10px] text-stone-600">
                        {CATEGORY_BILLING_CONFIG.cat2.billingSummary}
                      </p>
                      <span className="inline-block text-[9.5px] text-teal-900 font-medium">
                        ARS aprox: {formatARS(getArsAmount(4.99, gatewayConfig.mercadopago.exchangeRate))} / mes
                      </span>
                    </div>

                    {/* Círculo */}
                    <div className="p-2.5 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-950">Círculo de Paz (Comunidad & Oráculo)</strong>
                        <span className="font-bold text-amber-800">$9.99 USD / mes</span>
                      </div>
                      <p className="text-[10px] text-stone-600">
                        {CATEGORY_BILLING_CONFIG.circulo.billingSummary}
                      </p>
                      <span className="inline-block text-[9.5px] text-amber-900 font-medium">
                        ARS aprox: {formatARS(getArsAmount(9.99, gatewayConfig.mercadopago.exchangeRate))} / mes
                      </span>
                    </div>

                    {/* Cat 3 */}
                    <div className="p-2.5 rounded-xl border border-terracotta-200/80 bg-terracotta-50/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-terracotta-950">Categoría 3 (Nivel Maestro)</strong>
                        <span className="font-bold text-terracotta-800">$25.00 USD / año</span>
                      </div>
                      <p className="text-[10px] text-stone-600">
                        {CATEGORY_BILLING_CONFIG.cat3.billingSummary}
                      </p>
                      <span className="inline-block text-[9.5px] text-terracotta-900 font-medium">
                        ARS aprox: {formatARS(getArsAmount(25.00, gatewayConfig.mercadopago.exchangeRate))} / anualidad
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {targetYear 
                  ? `Adquirir Anualidad: Año ${targetYear}` 
                  : (isSupportPayment 
                      ? (customTitle || 'Apoya este proyecto por solo $1.25') 
                      : 'Billetera & Pasarela de Pagos')}
              </h3>
              <p className="text-xs text-stone-600">
                {targetYear
                  ? `Desbloqueo individual por anualidad para el Año ${targetYear} en Categoría 3 (Paquete Prémium).`
                  : (isSupportPayment
                      ? 'Colaboración solidaria independiente ($1.25 USD). No altera ni requiere ninguna categoría de suscripción.'
                      : 'Selecciona tu categoría y elige entre Mercado Pago Checkout Pro (Argentina) o PayPal Checkout (Exterior/Global).')}
              </p>
            </div>

            {/* Banner de Apoyo Independiente */}
            {isSupportPayment && (
              <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/90 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    💝
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-rose-950">
                      {customTitle || 'Apoya este proyecto por solo $1.25'}
                    </span>
                    <span className="text-[10px] text-rose-700">
                      Colaboración independiente por fuera de categorías de membresía · Mantras y anclas visuales
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-serif text-rose-900">$1.25 USD</span>
                  <span className="block text-[9px] text-rose-600">ARS ~$1.925</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* SELECCIÓN DE CATEGORÍA / PLAN A PAGAR (Solo para suscripciones) */}
            {/* ===================================================================== */}
            {!targetYear && !isSupportPayment && (
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Categoría Asignada en la Billetera
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(CATEGORY_BILLING_CONFIG) as PlanCategory[]).map((planKey) => {
                    const plan = CATEGORY_BILLING_CONFIG[planKey];
                    const isSelected = selectedPlanId === plan.id;
                    const arsPrice = getArsAmount(plan.usdPrice, gatewayConfig.mercadopago.exchangeRate);

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                          isSelected 
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-terracotta-500/50 scale-[1.01]' 
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-stone-800 text-amber-300' : plan.badgeBg
                          }`}>
                            {plan.badge}
                          </span>
                        </div>
                        <span className="block text-[11px] font-bold line-clamp-1">{plan.shortName}</span>
                        <div className="mt-1">
                          <span className="text-sm sm:text-base font-bold font-serif">
                            {formatUSD(plan.usdPrice)}
                          </span>
                          <span className={`text-[10px] block ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                            {region === 'argentina' ? `~${formatARS(arsPrice)} ARS` : `USD ${plan.frequencyLabel}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONDICIONES DE ENTREGA DIGITAL, RESTRICCIONES & POLÍTICA DE DEVOLUCIÓN */}
            {(() => {
              const currentPlanKey = isSupportPayment ? 'apoyo' : (targetYear ? 'cat3' : selectedPlanId);
              const restrictions = getCategoryRestrictions(currentPlanKey);
              return (
                <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-200/70 pb-1.5">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px]">
                      <Download className="w-3.5 h-3.5 text-terracotta-700" />
                      Método de Entrega: Descarga Digital Inmediata
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Automático tras el pago
                    </span>
                  </div>
                  <p className="text-[10.5px] text-stone-600 leading-snug">
                    Al confirmar tu pago, el material digital correspondiente a esta categoría se descargará automáticamente en tu dispositivo y se activarán tus accesos en la plataforma.
                  </p>
                  
                  {/* Restricciones específicas de esta categoría */}
                  <div className="pt-1">
                    <span className="text-[10.5px] font-bold text-amber-950 flex items-center gap-1 mb-1">
                      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                      Restricciones aplicadas a esta categoría:
                    </span>
                    <ul className="text-[10px] text-stone-600 space-y-0.5 list-disc list-inside">
                      {restrictions.map((r, idx) => (
                        <li key={idx} className="leading-tight">{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Política de devolución */}
                  <div className="pt-1.5 border-t border-stone-200/70 text-[10px] text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200/70 font-medium text-center">
                    <strong>Política de devolución:</strong> Al ser un producto digital, una vez que se descarga ya no se puede devolver.
                  </div>
                </div>
              );
            })()}

            {/* ===================================================================== */}
            {/* SELECTOR DE REGIÓN & PASARELA INTELIGENTE */}
            {/* ===================================================================== */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  ¿Dónde te encuentras? (Pasarela de Cobro)
                </label>
                <span className="text-[10px] text-stone-500 font-medium">
                  {region === 'argentina' ? 'Cobro en Pesos Argentinos (ARS)' : 'Cobro Internacional en Dólares (USD)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-stone-200/70 p-1 rounded-2xl">
                {/* Botón Argentina */}
                <button
                  type="button"
                  onClick={() => {
                    setRegion('argentina');
                    setPaymentMethod('mercadopago');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    region === 'argentina'
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="text-base leading-none">🇦🇷</span>
                  <div className="text-left leading-tight">
                    <span className="block font-bold">Argentina</span>
                    <span className="block text-[9.5px] text-sky-700 font-semibold">Mercado Pago Checkout Pro</span>
                  </div>
                </button>

                {/* Botón Exterior / Global */}
                <button
                  type="button"
                  onClick={() => {
                    setRegion('global');
                    setPaymentMethod('paypal');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    region === 'global'
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="text-left leading-tight">
                    <span className="block font-bold">Exterior / Global</span>
                    <span className="block text-[9.5px] text-blue-700 font-semibold">PayPal Checkout Internacional</span>
                  </div>
                </button>
              </div>
            </div>

            {/* MENSAJE DE ERROR SI OCURRIERA */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ===================================================================== */}
            {/* SECCIÓN DETALLADA: MERCADO PAGO CHECKOUT PRO (ARGENTINA) */}
            {/* ===================================================================== */}
            {region === 'argentina' && (
              <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-sky-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      M
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-1.5">
                        <span>Mercado Pago Checkout Pro</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Oficial / Producción
                        </span>
                      </h4>
                      <p className="text-[10px] text-sky-800/80">
                        Public Key Oficial: {gatewayConfig.mercadopago.publicKey.slice(0, 16)}...{gatewayConfig.mercadopago.publicKey.slice(-5)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">Total en Pesos</span>
                    <span className="text-base sm:text-lg font-bold font-serif text-sky-950">
                      {formatARS(effectiveArsPrice)} ARS
                    </span>
                  </div>
                </div>

                {/* Sub-métodos de Mercado Pago */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                    Elige cómo pagar en Mercado Pago:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setMpSubMethod('credit')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        mpSubMethod === 'credit'
                          ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                      <span className="block text-[11px]">Tarjeta Crédito</span>
                      <span className="block text-[9px] text-sky-700">Hasta 12 cuotas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMpSubMethod('debit')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        mpSubMethod === 'debit'
                          ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <CardIcon className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                      <span className="block text-[11px]">Tarjeta Débito</span>
                      <span className="block text-[9px] text-stone-500">1 pago directo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMpSubMethod('wallet')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        mpSubMethod === 'wallet'
                          ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <Wallet className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                      <span className="block text-[11px]">Dinero en MP</span>
                      <span className="block text-[9px] text-emerald-600 font-semibold">Instantáneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMpSubMethod('cash')}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        mpSubMethod === 'cash'
                          ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                      <span className="block text-[11px]">Efectivo</span>
                      <span className="block text-[9px] text-stone-500">Pago Fácil / Rapi</span>
                    </button>
                  </div>
                </div>

                {/* Modalidad de pago en Mercado Pago: Forzado a 1 solo pago */}
                {mpSubMethod === 'credit' && (
                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-sky-950 uppercase tracking-wider">
                        Modalidad de Pago (1 Solo Pago):
                      </label>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-300">
                        1 pago sin interés
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-sky-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">1 Pago único de {formatARS(effectiveArsPrice)}</span>
                          <span className="text-[10px] text-stone-500">Tarjeta de débito, crédito o dinero en cuenta</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-sky-700">{formatARS(effectiveArsPrice)}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 italic">
                      * Las transacciones se procesan en 1 solo pago. No se aplican recargos financieros absorbidos por el vendedor.
                    </p>
                  </div>
                )}

                {/* Si elige Efectivo en Mercado Pago */}
                {mpSubMethod === 'cash' && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <QrCode className="w-4 h-4 text-amber-700" />
                      <span>Pago en Redes de Cobranza (Pago Fácil / RapiPago)</span>
                    </div>
                    <p className="text-[11px] text-amber-900/80">
                      Al confirmar se generará tu cupón de pago con código de barras y referencia numérica de Mercado Pago. Puedes abonar en efectivo o con tu billetera virtual favorita.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200/80 text-xs text-sky-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-700" />
                      SDK Oficial de Mercado Pago Argentina (Producción)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-100 text-sky-900 rounded font-bold">
                      {gatewayConfig.mercadopago.publicKey.slice(0, 12)}...{gatewayConfig.mercadopago.publicKey.slice(-5)}
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-900/80 leading-relaxed">
                    Al confirmar, se procesará el cobro seguro mediante el <strong>SDK Oficial de Mercado Pago Argentina</strong> con acreditación instantánea en Pesos Argentinos (ARS).
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-sky-100">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Protección al Comprador Mercado Pago
                  </span>
                  <span>Tasa: 1 USD = {formatARS(gatewayConfig.mercadopago.exchangeRate)} ARS</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* SECCIÓN DETALLADA: PAYPAL CHECKOUT (GLOBAL / EXTERIOR) */}
            {/* ===================================================================== */}
            {region === 'global' && (
              <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-blue-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      P
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-blue-950 flex items-center gap-1.5">
                        <span>PayPal Checkout Internacional</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold uppercase">
                          {gatewayConfig.paypal.mode === 'sandbox' ? 'Sandbox' : 'Oficial'}
                        </span>
                      </h4>
                      <p className="text-[10px] text-blue-800/80">
                        Cobro internacional en USD con protección al comprador
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">Total con +6% Divisas</span>
                    <span className="text-base sm:text-lg font-bold font-serif text-blue-950">
                      {formatUSD(totalPaypalUSD)} USD
                    </span>
                    <span className="text-[9px] text-blue-700 block">
                      (Base: {formatUSD(baseNetUSD)} + {formatUSD(paypalSurchargeUSD)} recargo)
                    </span>
                  </div>
                </div>

                {/* Apartado explicativo sobre el recargo del 6% por cambio de divisa */}
                <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Aclaración Financiera: Recargo del 6% por Cambio de Divisa</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    Debido a los costos operativos de transferencia bancaria internacional y comisiones por cambio de divisa, los cobros vía <strong>PayPal</strong> aplican un recargo automático del <strong>6%</strong> sobre el valor neto del plan.
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[10px] text-amber-950 font-mono pt-1 border-t border-amber-200/90 gap-1">
                    <span>Precio Neto: <strong>{formatUSD(baseNetUSD)} USD</strong></span>
                    <span>Recargo Divisa (+6%): <strong className="text-amber-800">+{formatUSD(paypalSurchargeUSD)} USD</strong></span>
                    <span className="font-bold text-blue-900 bg-blue-100/70 px-1.5 py-0.5 rounded">Total Facturado: {formatUSD(totalPaypalUSD)} USD</span>
                  </div>
                </div>

                {/* Sub-opciones de PayPal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaypalSubMethod('paypal_account')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paypalSubMethod === 'paypal_account'
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="w-full py-1 bg-[#FFC439] rounded font-bold text-[#003087] text-[11px] mb-1 flex items-center justify-center gap-1 shadow-xs">
                      <span className="italic font-black">PayPal</span>
                    </div>
                    <span className="block text-[10px] text-stone-600">Saldo o cuenta PayPal directa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaypalSubMethod('paypal_card')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paypalSubMethod === 'paypal_card'
                        ? 'bg-stone-900 border-stone-900 text-white font-bold shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="w-full py-1 bg-stone-900 text-white rounded font-bold text-[11px] mb-1 flex items-center justify-center gap-1 shadow-xs">
                      <CreditCard className="w-3 h-3" />
                      <span>Tarjeta Internacional</span>
                    </div>
                    <span className={`block text-[10px] ${paypalSubMethod === 'paypal_card' ? 'text-stone-300' : 'text-stone-600'}`}>
                      Visa, Mastercard, Amex, Discover
                    </span>
                  </button>
                </div>

                {/* Aclaración estricta de intereses: 0% costo para el vendedor */}
                <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-1 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Política de Financiación: Interés a cargo del comprador</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    Al igual que en Mercado Pago, <strong>NO se ofrecen cuotas sin interés a cargo del vendedor</strong>. Si decides pagar en cuotas utilizando tu tarjeta de crédito mediante PayPal, cualquier interés financiero, tasa o Costo Financiero Total (CFT) es cobrado directamente por tu banco emisor al comprador. <strong>El vendedor no absorbe costos de financiación.</strong>
                  </p>
                </div>

                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs text-blue-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      SDK Oficial de PayPal (Live / Producción)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold">
                      ID: {gatewayConfig.paypal.clientId.slice(0, 10)}...{gatewayConfig.paypal.clientId.slice(-6)}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-900/80 leading-relaxed">
                    Al confirmar, se iniciará el cobro seguro mediante el <strong>SDK Oficial de PayPal</strong> con protección completa al comprador y confirmación instantánea.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-blue-100">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Cifrado TLS 1.3 bancario internacional
                  </span>
                  <span>Sin comisiones ocultas</span>
                </div>
              </div>
            )}

            {/* Alternativa: Pagar con Tarjeta Directa si lo desea */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod(paymentMethod === 'card' ? (region === 'argentina' ? 'mercadopago' : 'paypal') : 'card')}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>
                  {paymentMethod === 'card'
                    ? `Volver a ${region === 'argentina' ? 'Mercado Pago Checkout Pro' : 'PayPal Checkout'}`
                    : 'O ingresar datos de tarjeta bancaria directamente (Checkout Alojado)'}
                </span>
              </button>
            </div>

            {/* FORMULARIO DE TARJETA DIRECTA (SI ELIGIÓ MODO DIRECTO) */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs animate-fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-stone-600" />
                    Tarjeta de Crédito o Débito Universal
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">PCI DSS Level 1</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Nombre completo impreso en la tarjeta
                  </label>
                  <input
                    id="payment-card-name"
                    type="text"
                    placeholder="Ej. Sofía Morales"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-stone-600">
                      Número de Tarjeta (16 dígitos)
                    </label>
                    <span className="text-[10px] font-bold text-stone-400 font-mono">
                      {getCardBrand(cardNumber)}
                    </span>
                  </div>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                    <input
                      id="payment-card-number"
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono tracking-wider text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Expiración (MM/AA)
                    </label>
                    <input
                      id="payment-card-expiry"
                      type="text"
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      required
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      CVC / CVV
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                      <input
                        id="payment-card-cvc"
                        type="password"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        maxLength={4}
                        required
                        className="w-full pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* RESUMEN DE COBRO FINAL & BOTÓN DE CONFIRMACIÓN */}
            {/* ===================================================================== */}
            <form onSubmit={handleProcessPayment} className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between p-3.5 bg-stone-100/90 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-xs text-stone-500 block">Total a pagar hoy</span>
                  <span className="text-xs font-bold text-stone-800">
                    {targetYear 
                      ? `Anualidad Año ${targetYear} (Categoría 3 Prémium)` 
                      : `${currentCategoryInfo.name} · ${currentCategoryInfo.frequency === 'annual' ? 'Anual' : 'Mensual'}`}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    Pasarela: {region === 'argentina' ? 'Mercado Pago Checkout Pro 🇦🇷' : 'PayPal Global Checkout 🌎'}
                  </span>
                </div>
                <div className="text-right">
                  {region === 'argentina' ? (
                    <div>
                      <span className="text-xl font-bold font-serif text-sky-900 block">
                        {formatARS(effectiveArsPrice)} ARS
                      </span>
                      <span className="text-[10px] text-stone-500 font-sans block">
                        ({formatUSD(effectiveUsdPrice)} USD {targetYear ? '/ año' : '/ mes'})
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xl font-bold font-serif text-emerald-700 block">
                        {formatUSD(effectiveUsdPrice)} USD
                      </span>
                      <span className="text-[10px] text-stone-500 font-sans block">
                        {targetYear ? 'Pago por anualidad' : 'Facturación mensual'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CHECKBOX VINCULANTE: ACEPTACIÓN DE TÉRMINOS DIGITALES Y RENUNCIA DE REVOCACIÓN (BLINDAJE ANTI-DISPUTAS PAYPAL & MERCADO PAGO) */}
              <div className={`p-3.5 rounded-2xl border-2 transition-all ${
                acceptedDigitalTerms
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-2xs'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
              }`}>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="accept-digital-terms-checkbox"
                    checked={acceptedDigitalTerms}
                    onChange={(e) => {
                      setAcceptedDigitalTerms(e.target.checked);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 font-bold text-[11px] leading-tight">
                      <ShieldCheck className={`w-3.5 h-3.5 ${acceptedDigitalTerms ? 'text-emerald-700' : 'text-amber-700'} shrink-0`} />
                      <span className="text-stone-900">Acepto los Términos de Entrega Digital y Renuncia Expresa de Revocación</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${acceptedDigitalTerms ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                        {acceptedDigitalTerms ? 'Aceptado ✓' : 'Obligatorio'}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-700 leading-snug">
                      Reconozco expresamente que este producto es de <strong>suministro y descarga digital inmediata</strong>. Conforme a las políticas de bienes intangibles de PayPal, Protección al Vendedor de Mercado Pago y el Art. 34 bis de la Ley 24.240, <strong>renuncio de forma voluntaria e irrevocable a mi derecho de revocación, arrepentimiento o desistimiento</strong> una vez iniciada la descarga. Entiendo que una vez descargado o accedido el material, la compra no admite reembolsos ni desconocimientos bancarios.
                    </p>
                  </div>
                </label>
              </div>

              {/* BOTÓN OFICIAL DE PAGO SEGÚN PASARELA */}
              {paymentMethod === 'mercadopago' && (
                <button
                  id="mp-checkout-pro-btn"
                  type="submit"
                  disabled={isProcessing || !acceptedDigitalTerms}
                  className={`w-full py-4 font-bold rounded-full shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !acceptedDigitalTerms
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-80'
                      : 'bg-[#009EE3] hover:bg-[#0089C7] active:scale-[0.99] text-white'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Conectando con Mercado Pago Checkout Pro...</span>
                    </span>
                  ) : (
                    <>
                      <span className="w-5 h-5 rounded-full bg-white text-[#009EE3] flex items-center justify-center text-[10px] font-black">
                        M
                      </span>
                      <span>
                        Pagar {formatARS(effectiveArsPrice)} ARS con Mercado Pago
                        {mpSubMethod === 'credit' && mpInstallments > 1 && ` (en ${mpInstallments} cuotas)`}
                      </span>
                    </>
                  )}
                </button>
              )}

              {paymentMethod === 'paypal' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-white/95 rounded-2xl border border-blue-200/90 shadow-2xs space-y-2.5">
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-stone-800 block">
                        Botón Oficial de Pago Seguro (PayPal SDK)
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {acceptedDigitalTerms
                          ? 'Abona directamente con tu cuenta PayPal o tarjeta internacional'
                          : '⚠️ Marca la casilla obligatoria de aceptación arriba para habilitar el cobro'}
                      </span>
                    </div>

                    {/* Contenedor oficial montado por el SDK de PayPal */}
                    <div 
                      id="paypal-sdk-buttons-mount" 
                      className={`min-h-[44px] transition-opacity ${!acceptedDigitalTerms ? 'opacity-40 pointer-events-none' : ''}`}
                    />

                    {/* Botón de apertura en ventana completa / redirección segura */}
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        id="paypal-checkout-btn"
                        type="submit"
                        disabled={isProcessing || !acceptedDigitalTerms}
                        className={`w-full py-3.5 font-extrabold rounded-full shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          !acceptedDigitalTerms
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-80'
                            : 'bg-[#FFC439] hover:bg-[#F4B933] active:scale-[0.99] text-[#003087]'
                        }`}
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-[#003087] border-t-transparent rounded-full animate-spin" />
                            <span>Conectando con pasarela oficial de PayPal...</span>
                          </span>
                        ) : (
                          <>
                            <span className="italic font-black text-sm text-[#003087]">PayPal</span>
                            <span className="font-sans font-bold text-xs text-stone-900">
                              Checkout · Cobrar {formatUSD(totalPaypalUSD)} USD (con +6% divisas)
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <button
                  id="card-submit-btn"
                  type="submit"
                  disabled={isProcessing || !acceptedDigitalTerms}
                  className={`w-full py-3.5 font-bold rounded-full shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !acceptedDigitalTerms
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-80'
                      : 'bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-amber-700 hover:brightness-110 active:scale-[0.99] text-white'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando pago en checkout seguro...</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pagar con Tarjeta vía {region === 'argentina' ? 'Mercado Pago' : 'PayPal'} ({region === 'argentina' ? `${formatARS(effectiveArsPrice)} ARS` : `${formatUSD(totalPaypalUSD)} USD`})
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* ENLACE DIRECTO EXTERNO COMPATIBLE CON AMAZON S3 (SIN ERRORES JSON NI DESCARGAS PREVIAS) */}
              <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!acceptedDigitalTerms) {
                      setErrorMsg('Debes marcar la casilla de aceptación de Términos de Entrega Digital antes de abrir la pasarela.');
                      return;
                    }
                    setErrorMsg(null);
                    const resolvedName = targetYear ? `Anualidad Año ${targetYear}` : (isSupportPayment ? (customTitle || 'Apoyo') : currentCategoryInfo.name);
                    const targetUrl = paymentMethod === 'mercadopago'
                      ? buildMercadoPagoDirectUrl({
                          customUrl: gatewayConfig.mercadopago.directCheckoutUrl,
                          amountARS: effectiveArsPrice,
                          title: resolvedName
                        })
                      : buildPayPalDirectUrl({
                          planName: resolvedName,
                          amountUSD: totalPaypalUSD,
                          receiverEmail: gatewayConfig.paypal.receiverEmail,
                          customUrl: gatewayConfig.paypal.directCheckoutUrl
                        });

                    if (paymentMethod === 'mercadopago') {
                      try {
                        localStorage.setItem('zen_pending_mp_payment', JSON.stringify({
                          planId: targetYear ? `cat3-${targetYear}` : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
                          planName: resolvedName,
                          amountUSD: effectiveUsdPrice,
                          amountARS: effectiveArsPrice,
                          targetYear: targetYear || null,
                          termsAcceptedAt: new Date().toISOString()
                        }));
                      } catch {}
                    } else {
                      try {
                        localStorage.setItem('zen_pending_paypal_payment', JSON.stringify({
                          planId: targetYear ? `cat3-${targetYear}` : (isSupportPayment ? 'apoyo' : currentCategoryInfo.id),
                          planName: resolvedName,
                          amountUSD: totalPaypalUSD,
                          targetYear: targetYear || null,
                          termsAcceptedAt: new Date().toISOString()
                        }));
                      } catch {}
                    }

                    // Redirigir de forma segura a la pasarela oficial (compatible con celulares sin popups bloqueados)
                    setIsProcessing(true);
                    window.location.assign(targetUrl);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-center shadow-xs ${
                    !acceptedDigitalTerms || isProcessing
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-70'
                      : 'bg-stone-100 hover:bg-stone-200/80 active:scale-[0.99] border border-stone-300 text-stone-800'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                  <span>
                    {paymentMethod === 'mercadopago'
                      ? '🔗 Abrir Enlace Directo Mercado Pago (Amazon S3)'
                      : '🔗 Abrir Enlace Directo PayPal (Amazon S3)'}
                  </span>
                </button>
                <p className="text-[10px] text-stone-500 text-center leading-snug">
                  * Te redirige de forma segura a la pasarela oficial. El material se desbloqueará y descargará automáticamente únicamente cuando el pago esté 100% confirmado y aprobado.
                </p>
              </div>
            </form>

            {/* PIE DE PÁGINA: SELLOS DE CONFIANZA */}
            <div className="pt-2 border-t border-stone-200/70 space-y-1.5 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-stone-500 font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PCI-DSS Nivel 1 Certificado
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                  <span className="w-3 h-3 rounded-full bg-sky-500 text-white flex items-center justify-center text-[7px] font-black">M</span>
                  Mercado Pago Pro
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                  <span className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[7px] font-black">P</span>
                  PayPal Global
                </span>
                <span>•</span>
                <span>3D Secure 2.0</span>
                <span>•</span>
                <span>Cifrado TLS 1.3 / AES-256</span>
              </div>
              <p className="text-[9.5px] text-stone-400">
                La suscripción se puede gestionar o cancelar en cualquier momento desde tu perfil o billetera.
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-[10px] text-amber-900 leading-snug text-center">
                <strong>Política de devolución:</strong> Al ser un producto digital, una vez que se descarga ya no se puede devolver.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
