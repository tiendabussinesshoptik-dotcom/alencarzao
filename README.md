# Alencarzao — Web oficial 💖

Web profesional multiidioma (🇬🇧 EN · 🇪🇸 ES · 🇧🇷 PT-BR) para **Alencarzao** (Geovanna Alencar), creadora de contenido brasileña — 12M+ en TikTok, 3M+ en Instagram.

**Demo lista para enseñar a la clienta y a marcas.** Sin frameworks ni build: HTML + CSS + JS estático, se publica en cualquier hosting en minutos.

## Qué incluye

| Página | Archivo | Descripción |
|---|---|---|
| Home | `index.html` | Hero premium, stats, galería, colaboraciones, preview de tienda |
| About | `about.html` | Historia, timeline, datos clave |
| Media Kit | `mediakit.html` | Plataformas, audiencia, formatos y tarifas para marcas |
| Link in bio | `links.html` | Todos sus enlaces (estilo Linktree, con su marca) |
| Tienda | `shop.html` | Merch oficial con carrito y checkout demo |
| Contacto | `contact.html` | Formulario "Work With Me" → llega por email |
| Panel admin | `admin/` | Dashboard privado: productos, pedidos, leads y estadísticas |

- **Idiomas:** selector EN/ES/PT en la cabecera. Detecta el idioma del navegador y recuerda la elección.
- **Formulario de contacto:** envía por email vía [FormSubmit](https://formsubmit.co) a `soyunviciadoalfortniteyas@gmail.com`. ⚠️ **El primer envío dispara un correo de activación a esa bandeja — pulsa "Activate" una vez** y a partir de ahí llegan todos los mensajes. Además, cada propuesta aparece en el panel admin (sección *Brand Leads*).
- **Tienda demo:** el checkout es simulado; los pedidos aparecen en el panel admin (*Orders*).
- **Panel admin:** `tudominio.com/admin/` — contraseña demo: `alencar2026` (cámbiala en `assets/js/admin.js`). Es una demo visual con datos locales; para producción real necesitaría backend y autenticación de verdad.

## Fotos de Geovanna

Por derechos de imagen no se han descargado fotos suyas de Instagram/TikTok. La web usa **visuales de marca temporales** en `assets/img/`. Cuando ella pase sus fotos oficiales, solo hay que **sustituir estos archivos manteniendo el nombre** (o cambiar la extensión en el HTML a `.jpg`):

| Archivo | Dónde aparece | Tamaño recomendado |
|---|---|---|
| `hero.svg` | Foto principal de la home | 800×1000 (vertical) |
| `about.svg` | Página About | 800×1000 |
| `avatar.svg` | Avatar del link-in-bio | 600×600 (cuadrada) |
| `gallery-1..6.svg` | Galería | 800×1000 |
| `product-1..6.svg` | Productos de la tienda | 800×800 |

## 🚀 Publicar la web (paso a paso, con GitHub Pages)

Gratis, sin cuentas nuevas: se publica directamente desde este repositorio. ⚠️ Con cuenta gratuita de GitHub, el repo debe ser **público** para usar Pages.

### 1. Activar GitHub Pages (2 min)

1. En GitHub: repo `alencarzao` → **Settings → Pages**.
2. En **Source** elige **Deploy from a branch** → rama `main` (o la rama donde esté la web) → carpeta `/ (root)` → **Save**.
3. En ~1 minuto la web estará en
   `https://tiendabussinesshoptik-dotcom.github.io/alencarzao/`
   ✅ Esta URL ya te sirve para enseñar la demo desde cualquier móvil **antes de conectar el dominio**.

### 2. Conectar `alencarzao.com` (GoDaddy)

**En GitHub:** Settings → Pages → **Custom domain** → escribe `alencarzao.com` → Save. (GitHub añadirá solo un archivo `CNAME` a la rama.)

**En GoDaddy** ([dcc.godaddy.com](https://dcc.godaddy.com) → tu dominio → **DNS → Manage DNS**), crea estos registros:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `tiendabussinesshoptik-dotcom.github.io` |

> Borra los registros A/CNAME de "parking" que GoDaddy crea por defecto si entran en conflicto (suele haber un A `@` apuntando a "Parked").

Espera la propagación DNS (de 10 min a 48 h, normalmente <1 h). Cuando GitHub verifique el dominio, marca **Enforce HTTPS** en Settings → Pages para el certificado SSL automático.

### 3. El dominio con tilde: `alencarzão.com`

Internamente es `xn--alencarzo-s2a.com`. Lo más simple es redirigirlo al principal desde GoDaddy: dominio → **Forwarding → Domain → Add Forwarding** → `https://alencarzao.com`, tipo *Permanent (301)*. Así cualquiera que lo escriba acaba en la web buena.

> Alternativas si algún día no quieres GitHub Pages: Netlify o Cloudflare Pages (gratis, mismo concepto), o el hosting propio de GoDaddy (de pago — se suben los archivos tal cual por cPanel/FTP, sin tocar DNS).

### 3. Activar el formulario de contacto

1. Con la web ya online, envía un mensaje de prueba desde `/contact.html`.
2. Llegará un correo de **FormSubmit** a `soyunviciadoalfortniteyas@gmail.com` → pulsa **Activate**.
3. Envía otro mensaje de prueba: ya llegará el contenido completo. Listo.

> Para cambiar el correo de destino más adelante, edita la URL de FormSubmit en `assets/js/main.js`.

## 📱 Ver la demo en el iPhone sin publicar

Opciones de más fácil a más completa:

1. **GitHub Pages sin dominio** (recomendada): el paso 1 de arriba te da `https://tiendabussinesshoptik-dotcom.github.io/alencarzao/` sin tocar dominios — ábrela en Safari del iPhone.
2. **Desde GitHub sin desplegar nada:** abre en Safari
   `https://raw.githack.com/tiendabussinesshoptik-dotcom/alencarzao/claude/portfolio-website-multilingual-7054m5/index.html`
   (sirve el HTML del repo renderizado; requiere que el repo sea público).
3. **En local:** en tu ordenador, dentro de la carpeta del repo: `python3 -m http.server 8000` y desde el iPhone (misma WiFi) entra a `http://IP-DE-TU-PC:8000`.
4. **Simulador con marco de iPhone:** abre `preview-iphone.html` en el navegador del ordenador — muestra la web dentro de un iPhone 15 a tamaño real con botones para cambiar de página.

## Desarrollo local

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Sin dependencias, sin build.
