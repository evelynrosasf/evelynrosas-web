# evelynrosas.me

Sitio web de Evelyn Rosas, consultora de marca y marketing. Es un sitio estático (HTML, CSS y un poco de JavaScript), sin dependencias ni paso de compilación, listo para GitHub Pages.

## Estructura

```
index.html        Inicio
sobre-mi.html     Sobre mí
trabajo.html      Trabajo
contacto.html     Contacto: Brand Therapy Call, opción 2 y preguntas frecuentes
formulario.html   Formulario de contacto
css/estilos.css   Estilos compartidos (colores en :root)
js/main.js        Menú, preguntas frecuentes, calendario y formulario
img/              Fotos, logos y favicon
```

Para cambiar un texto, edita el archivo `.html` de esa página. Para cambiar un color en todo el sitio, edita las variables al principio de `css/estilos.css`.

## Publicar en GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En **Source** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
3. En un par de minutos el sitio queda en `https://TU-USUARIO.github.io/evelynrosas-web/`.

Cada vez que subas un cambio a `main`, la web se actualiza sola.

## Conectar el dominio evelynrosas.me

1. En **Settings → Pages → Custom domain** escribe `evelynrosas.me` y guarda (esto crea el archivo `CNAME`).
2. En el panel donde compraste el dominio, añade estos registros DNS:
   - Cuatro registros **A** para `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Un registro **CNAME** para `www` que apunte a `TU-USUARIO.github.io`
3. Cuando GitHub detecte el dominio (de minutos a 24 h), marca **Enforce HTTPS**.

Comprueba las IP en la guía oficial antes de configurarlas: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

## Pendientes antes de lanzar

- **Instagram:** los enlaces apuntan a `https://www.instagram.com/`. Cambia la URL por la de tu perfil en todas las páginas (busca `instagram.com`).
- **Formulario:** ahora, al enviar, abre un correo ya redactado hacia hello@evelynrosas.me. Para recibir los mensajes directamente, crea un formulario gratis en Formspree (o similar) y pega su URL en `data-endpoint=""` dentro de `formulario.html`.
- **Calendario:** "Confirmar reserva" abre un correo con la fecha y la hora elegidas. Para reservas automáticas, crea tu evento en Calendly o Cal.com y sustituye el botón (o el bloque `#cal` de `contacto.html`) por su código para incrustar.
- **Correo hello@evelynrosas.me:** se contrata aparte (Google Workspace, Zoho, el proveedor del dominio…).
- **Fotos:** la de Pastrypedia en Trabajo es provisional (croissants).
