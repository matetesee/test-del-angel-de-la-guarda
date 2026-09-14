# Test del Ángel de la Guarda

Clon estático del sitio `https://testedosanjos.misteriosdaalma.com` ("Leitura do Anjo da Guarda"), reconstruido a partir de los archivos publicados en producción (HTML, bundles de Vue.js, CSS e imágenes) para recuperar el acceso perdido al proyecto original.

## Contenido

- `public/index.html` – HTML original de la página.
- `public/js/` – Bundles compilados de Vue (app + chunk-vendors + chunks de cada ruta del funnel).
- `public/css/` – Hojas de estilo (incluye `astrologyStyle.css` y los CSS por ruta).
- `public/img/` – Todas las imágenes propias del quiz (arcángeles, signos, planetas, estado civil, etc.).
- `server.js` – Servidor Express que sirve los archivos estáticos y hace fallback a `index.html` para que el router de Vue (modo `history`) resuelva las rutas internas del funnel.

## Rutas internas detectadas (Vue Router)

- `/` – Página principal (video de ventas)
- `/enviodosdados`
- `/pGwZSDj`
- `/ababa`
- `/assinatura-poder`
- `/g-ass`
- `/obrigado-correio`
- `/brd`

## Correr localmente

```bash
npm install
npm start
```

Por defecto levanta en `http://localhost:3000`.

## Notas

- Las librerías de terceros (Bootstrap, jQuery, video.js, GSAP, Google Fonts, Font Awesome) se siguen cargando desde sus CDN originales, igual que en el sitio original.
- El video principal, el reproductor y el checkout dependen de servicios externos (Converteai/VTurb, Kirvano, Google Maps, PostHog, Clarity, Utmify) que pertenecen a las cuentas originales del dueño del sitio y no se pueden clonar; si esas integraciones también se perdieron, hay que reconectarlas con las credenciales correspondientes.
- Hay una referencia de imagen de fondo (`astrologyStyle.css`) que ya estaba rota en el sitio original (404) y se dejó igual para que el clon sea fiel al estado real de la página.
