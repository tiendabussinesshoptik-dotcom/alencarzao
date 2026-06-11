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

## 🚀 Publicar la web (paso a paso)

La opción más rápida y gratuita: **Vercel** (también vale Netlify o GitHub Pages).

### 1. Desplegar en Vercel (5 min)

1. Entra en [vercel.com](https://vercel.com) → **Sign up with GitHub**.
2. **Add New → Project** → importa el repositorio `alencarzao`.
3. Framework preset: **Other** (es estático, no hay build). → **Deploy**.
4. En ~30 segundos tendrás una URL tipo `alencarzao.vercel.app`. ✅ Con esto ya puedes enseñar la demo desde cualquier móvil **antes de conectar el dominio**.

### 2. Conectar los dominios de GoDaddy

Tienes dos dominios: `alencarzao.com` (principal) y `alencarzão.com` (con tilde — internamente es `xn--alencarzo-s2a.com`).

**En Vercel:**
1. Proyecto → **Settings → Domains** → añade `alencarzao.com` y `www.alencarzao.com`.
2. Vercel te mostrará los registros DNS exactos a crear.

**En GoDaddy** ([dcc.godaddy.com](https://dcc.godaddy.com) → tu dominio → **DNS → Manage DNS**):

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

> Borra los registros A/CNAME de "parking" que GoDaddy crea por defecto si entran en conflicto.

3. Espera la propagación DNS (de 10 min a 48 h, normalmente <1 h). Vercel emite el certificado HTTPS automáticamente.

**Para `alencarzão.com` (el de la tilde),** lo más simple es redirigirlo al principal desde GoDaddy: dominio → **Forwarding → Domain → Add Forwarding** → `https://alencarzao.com`, tipo *Permanent (301)*. Así cualquiera que lo escriba acaba en la web buena. (Alternativa: añadirlo también como dominio en Vercel con los mismos registros DNS y que Vercel redirija.)

### 3. Activar el formulario de contacto

1. Con la web ya online, envía un mensaje de prueba desde `/contact.html`.
2. Llegará un correo de **FormSubmit** a `soyunviciadoalfortniteyas@gmail.com` → pulsa **Activate**.
3. Envía otro mensaje de prueba: ya llegará el contenido completo. Listo.

> Para cambiar el correo de destino más adelante, edita la URL de FormSubmit en `assets/js/main.js`.

## 📱 Ver la demo en el iPhone sin publicar

Opciones de más fácil a más completa:

1. **Vercel preview** (recomendada): el paso 1 de arriba te da `alencarzao.vercel.app` sin tocar dominios — ábrela en Safari del iPhone. Es privada de facto (nadie conoce la URL).
2. **Desde GitHub sin desplegar nada:** abre en Safari
   `https://raw.githack.com/tiendabussinesshoptik-dotcom/alencarzao/claude/portfolio-website-multilingual-7054m5/index.html`
   (sirve el HTML del repo renderizado; requiere que el repo sea público).
3. **En local:** en tu ordenador, dentro de la carpeta del repo: `python3 -m http.server 8000` y desde el iPhone (misma WiFi) entra a `http://IP-DE-TU-PC:8000`.

## Desarrollo local

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Sin dependencias, sin build.
