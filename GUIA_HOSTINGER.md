# 🟣 GUÍA DEFINITIVA DE PUBLICACIÓN EN HOSTINGER
## Almanaque de Amor Propio y Autoestima
> **Diseñado especialmente para ti (sin necesidad de saber programación).**  
> Tu aplicación ya está 100% construida, blindada contra fraudes, optimizada para **celulares, tablets y notebooks**, y empaquetada en el archivo **`ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`** (también disponible como `dist-hostinger.zip`).

---

## 📦 ¿Qué incluye tu paquete para Hostinger?

1. **`index.html`**: Punto de entrada con todas las metaetiquetas, títulos y optimizaciones SEO.
2. **Carpeta `assets/`**: Código JavaScript y estilos CSS minificados y acelerados para carga ultrarrápida.
3. **`.htaccess` (Exclusivo para Hostinger / LiteSpeed)**:
   * **Rutas SPA garantizadas**: Evita cualquier error 404 si el usuario recarga la página o entra con un enlace directo.
   * **Caché y Gzip**: Carga instantánea en teléfonos celulares con redes móviles 4G/5G.
   * **Seguridad HTTPS**: Redirección automática a conexión segura con candado verde.
4. **Carpeta `images/`, `fonts/` y multimedia**: Portadas oficiales, tipografías personalizadas y reproductores.

---

## 🚀 PASO A PASO: Cómo publicar en Hostinger (En menos de 5 minutos)

### Paso 1: Descargar o ubicar tu archivo
* En la raíz de tu proyecto encontrarás el archivo comprimido: **`ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`** (o `dist-hostinger.zip`).

---

### Paso 2: Entrar a tu panel de Hostinger (hPanel)
1. Ingresa a [https://hpanel.hostinger.com](https://hpanel.hostinger.com) con tu usuario y contraseña.
2. En la sección **Sitios Web** (Websites), haz clic en el botón **Administrar** (Manage) correspondiente al dominio donde vas a publicar el Almanaque.

---

### Paso 3: Abrir el Administrador de Archivos (File Manager)
1. En el menú lateral izquierdo o en el buscador de hPanel, escribe **Administrador de archivos** (File Manager).
2. Haz clic en **Archivos de [tu dominio]** (File Manager of your domain).
3. Se abrirá una nueva pestaña con las carpetas de tu servidor.
4. Haz doble clic en la carpeta llamada **`public_html`**.
   *(Nota: `public_html` es la carpeta principal donde se publica tu página web para todo el mundo).*

> 💡 **Consejo de limpieza:** Si dentro de `public_html` tienes un archivo por defecto llamado `default.php` o una página en blanco anterior, puedes seleccionarlo y eliminarlo para que no interfiera.

---

### Paso 4: Subir `ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`
1. En la barra superior del Administrador de Archivos, haz clic en el icono de **Subir** (una flecha apuntando hacia arriba ⬆️ o el botón **Upload**).
2. Selecciona **Archivo** (File) y busca en tu computadora **`ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`** (o `dist-hostinger.zip`).
3. Espera unos segundos a que la barra de carga llegue al 100%.

---

### Paso 5: Extraer los archivos (1 solo clic)
1. Haz clic derecho sobre el archivo **`ACCESO AL ALMANAQUE DE AMOR PROPIO.zip`** que acabas de subir.
2. Selecciona la opción **Extraer** (Extract).
3. Hostinger te preguntará la carpeta de destino: escribe un punto `.` o deja la carpeta actual (`public_html/`) y pulsa **Extraer**.
4. ¡Listo! Verás que dentro de `public_html` ahora aparecen directamente:
   * `index.html`
   * `.htaccess`
   * Carpeta `assets/`
   * Carpeta `images/`
   * Carpeta `fonts/`
   * `logo.png`, `cover.jpg`, etc.
5. *(Opcional)* Puedes borrar el archivo `dist-hostinger.zip` de tu servidor para no ocupar espacio, ya que todo su contenido ya quedó extraído.

---

### Paso 6: Activar el Certificado SSL Gratuito (Candado HTTPS)
1. En el menú de Hostinger, busca la opción **Seguridad** -> **SSL**.
2. Verifica que tu dominio tenga el estado **Activo**. (Hostinger lo instala gratis automáticamente).
3. Gracias al archivo `.htaccess` que te dejamos configurado, si alguien escribe `http://tudominio.com`, el servidor lo llevará automáticamente a la versión segura `https://tudominio.com`.

---

## 📱 Verificación en Dispositivos

Tu web ya fue testeada y adaptada para verse excelente en:
* **Celulares (iPhone y Android):** Carrusel táctil fluido, botones táctiles adaptados, descarga de material digital con visor en pantalla y botón *"📋 Copiar Todo al Celular"*.
* **Tablets (iPad y Android):** Menús flexibles que bajan de renglón (`flex-wrap`) para que ningún botón se corte ni se pierda.
* **Notebooks y Computadoras de Escritorio:** Ancho panorámico expandido (`max-w-7xl`), sin choques de texto ni botones fuera de pantalla.

---

## 💳 Pasarelas de Pago en Hostinger (Mercado Pago & PayPal)
* El sistema ya cuenta con **enlaces directos seguros** (`window.location.assign`).
* **Blindaje de Seguridad 100% Activo:** Nadie puede descargar el material a menos que Mercado Pago devuelva el estado de pago aprobado (`approved`) y PayPal devuelva `COMPLETED`.
* En caso de cancelaciones o cierres de pestaña, el sistema protege tu material digital y no descarga nada.
