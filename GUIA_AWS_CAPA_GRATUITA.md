# ☁️ GUÍA MAESTRA DE DESPLIEGUE EN AWS (CAPA GRATUITA)
## Almanaque de Paz & Diario Anual de Autoestima
> **Diseñado especialmente para usuarios sin experiencia técnica de programación.**  
> Todo el código ya ha sido estructurado, optimizado y empaquetado en tu proyecto para subirlo hoy mismo a **Amazon Web Services (AWS)** a costo $0.

---

## 🎯 Resumen de Arquitectura AWS & Capa Gratuita (Free Tier)

| Servicio AWS | Función en tu Proyecto | Beneficio en Capa Gratuita (Free Tier) |
|---|---|---|
| **AWS Amplify Hosting** *(Recomendado)* | Aloja tu frontend web (HTML, CSS, JS), gestiona HTTPS automático y CDN global | **100% Gratis**: 1.000 minutos de compilación/mes + 15 GB servidos/mes |
| **Amazon S3 + CloudFront** | Opción alternativa de alojamiento estático ultrarrápido | **100% Gratis**: 5 GB en S3 + **1 TB (1.000 GB) de transferencia mensual de por vida** en CloudFront |
| **AWS Lambda** | Ejecuta la API segura de pagos y auditoría sin tener un servidor prendido | **100% Gratis de por vida**: 1.000.000 (1 millón) de solicitudes al mes |
| **Amazon EC2 (t2.micro / t3.micro)** | Si deseas correr el servidor completo Node.js 24/7 | **750 horas al mes gratis durante 12 meses** (equivale a 1 servidor prendido 24 horas al día todo el mes) |

---

## 🔒 Control Seguro de Acceso (Diario y Descargas)
Hemos configurado una regla de seguridad estricta para garantizar que **nadie que no haya iniciado sesión y pagado** pueda usar el diario ni descargar contenidos:

1. **Control de Inicio de Sesión:**
   * Si un visitante no ha iniciado sesión, el sistema bloquea inmediatamente la apertura del diario y cualquier intento de descarga, mostrando el modal para registrarse o identificarse.
2. **Control de Pago Activo (`active_paid`):**
   * El usuario debe tener una suscripción confirmada activa (Categoría 2, Círculo de Paz o Prémium Anual).
   * Si el usuario está en modo de prueba gratuita o vencida, el diario muestra la pantalla de bloqueo seguro con candado y lo redirige a la pasarela de pagos oficial.
3. **Protección Criptográfica en Descargas:**
   * Las descargas de reflexiones y material digital ahora llevan embebido el identificador de usuario y la licencia de entrega digital (`AUDIT-DL`), protegiéndote contra desconocimientos de compra en **Mercado Pago** y **PayPal**.

---

## 🚀 OPCIÓN 1 (LA MÁS FÁCIL EN 3 CLICS): AWS Amplify Hosting
*Esta es la forma recomendada por AWS para quienes no son programadores. No requiere configurar servidores Linux ni terminales.*

### Paso 1: Crear tu cuenta en AWS
1. Entra a [https://aws.amazon.com/free/](https://aws.amazon.com/free/) y haz clic en **"Crear una cuenta de AWS"**.
2. Completa tu correo y datos. AWS te otorgará automáticamente los 12 meses de Capa Gratuita.

### Paso 2: Ir a AWS Amplify
1. En la barra de búsqueda superior de AWS, escribe **Amplify** y haz clic en **AWS Amplify**.
2. Haz clic en el botón naranja **"Crear una nueva aplicación"** (o **"Host web app"**).

### Paso 3: Subir tu archivo empaquetado
1. En tu proyecto ya generamos el archivo listo para subir: **`ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`** (o `dist-aws.zip`).
2. En la consola de Amplify, selecciona la opción **"Deploy without Git provider"** (Desplegar sin Git) o arrastra y suelta el archivo **`ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`**.
3. Ponle como nombre: `Almanaque de Paz`.
4. Haz clic en **"Save and deploy"** (Guardar y desplegar).

¡Listo! En menos de 2 minutos, AWS Amplify te dará una URL segura con candado verde `https://tudominio.amplifyapp.com`. Puedes conectar tu propio dominio personalizado (.com) gratis.

---

## 🌐 OPCIÓN 2: Amazon S3 + CloudFront (Hosting Clásico de Alta Velocidad)

Si prefieres la arquitectura clásica de S3 y CloudFront:

1. **Crear Bucket S3:**
   * Ve a **Amazon S3** > **Crear bucket**.
   * Nombre: `almanaque-de-paz-web` (o tu nombre elegido).
   * Desmarca la casilla *"Bloquear todo el acceso público"* (Block public access).
   * En la pestaña **Propiedades**, baja hasta el final y activa **"Alojamiento de sitios web estáticos"** (Static website hosting), indicando como documento de índice: `index.html` y documento de error: `index.html`.
2. **Subir los archivos:**
   * Entra al bucket y sube todo el contenido de la carpeta `dist/` (o descomprime `dist-aws.zip`).
3. **Distribución en CloudFront:**
   * Ve a **CloudFront** > **Crear distribución**.
   * Origen: Selecciona el bucket S3 que acabas de crear.
   * Redirección HTTPS: Elige *"Redirect HTTP to HTTPS"*.
   * Páginas de error personalizadas (Custom error responses):
     - Error code: `403` -> Response page path: `/index.html` -> HTTP response code: `200`.
     - Error code: `404` -> Response page path: `/index.html` -> HTTP response code: `200`.
   *(Esto es necesario para que el enrutamiento de la aplicación funcione en cualquier página sin dar error 404).*

---

## 🖥️ OPCIÓN 3: Servidor Node.js Completo en AWS EC2 (t2.micro / t3.micro)

Si deseas tener el servidor backend completo (`index.js`) corriendo con su API en una máquina virtual de AWS:

1. **Lanzar Instancia:**
   * Ve a **EC2** > **Lanzar una instancia**.
   * Sistema operativo: **Ubuntu Server 22.04 LTS** (apto para la capa gratuita).
   * Tipo de instancia: **t2.micro** (o **t3.micro** en regiones habilitadas).
   * En Grupos de Seguridad (Security Group), permite tráfico **HTTP (puerto 80)**, **HTTPS (puerto 443)** y **SSH (puerto 22)**.
2. **Instalar Node.js y PM2 en la máquina:**
   ```bash
   sudo apt update && sudo apt install -y nodejs npm
   sudo npm install -g pm2
   ```
3. **Subir tu proyecto y encenderlo:**
   * Copia los archivos del proyecto a la carpeta `/var/www/almanaque`.
   * Enciende el servidor con el archivo de configuración que ya te preparamos:
     ```bash
     pm2 start ecosystem.config.cjs
     pm2 startup
     pm2 save
     ```
   * PM2 mantendrá tu aplicación encendida 24 horas al día, 7 días a la semana, y la reiniciará sola si el servidor se reinicia.

---

## 🔑 Configurar las Variables de Entorno en AWS (.env)

Copia los valores de tu pasarela desde `.env.aws.example`:
* En **AWS Amplify**: Ve a **App settings** > **Environment variables** y añade:
  * `VITE_MERCADOPAGO_PUBLIC_KEY`: Tu clave pública de Mercado Pago.
  * `VITE_PAYPAL_CLIENT_ID`: Tu Client ID de PayPal.
  * `COTIZACION_DOLAR`: `1540`
* En **AWS EC2**: Copia `.env.aws.example` a un archivo `.env` en la raíz de tu servidor.

---

## 🛠️ Comandos útiles ya configurados en tu `package.json`

| Comando | Para qué sirve |
|---|---|
| `npm run build` | Compila el proyecto React generando la carpeta estática `dist/` |
| `npm run build:aws` | Compila el proyecto y genera automáticamente el archivo `dist-aws.zip` listo para subir a AWS |
| `npm start` | Inicia el servidor de producción Node.js (`index.js`) |

---

## 🎬 Módulos Adicionales de Video: YouTube & TikTok ($1.75 USD)

1. **Módulo Integrado en la App:**
   - Accesible directamente desde la cabecera, el dock flotante y el dashboard.
   - Cuenta con cobro independiente de **$1.75 USD** y emisión automática de comprobante descargable.
2. **Lógica Temporal Automatizada (Corte 01/01/2027):**
   - **Preventa (2026):** El reproductor opera normal y los botones de compra/descarga están totalmente operativos.
   - **A partir del 01/01/2027:** El script en JavaScript nativo activa automáticamente la **capa invisible responsiva protectora** sobre la barra de controles de Elfsight para deshabilitar o bloquear el botón de 'Stop' o pausa, forzando la reproducción continua e inmersiva del video en celulares, tablets y notebooks, sin obstruir jamás los botones de compra ni descarga.
3. **Archivo Autónomo para AWS S3:**
   - Si deseas alojar este módulo en una página independiente dentro de tu bucket de S3 sin servidor, ya tienes disponible el archivo listo: **`public/modulo-youtube-elfsight.html`**. Puedes subirlo a cualquier bucket S3 estático en la Capa Gratuita.

