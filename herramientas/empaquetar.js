/* ============================================================
   empaquetar.js — Genera la versión SIN INTERNET de la plataforma:
   un solo archivo .html con los estilos, todo el código y el logo
   adentro, que se abre con doble clic en cualquier navegador y
   funciona completo sin conexión.

   Uso (desde la carpeta del proyecto):
     node herramientas/empaquetar.js
   Resultado:
     descargas/asesor-juridico-ciudadano-sin-internet.html
   ============================================================ */
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const salidaDir = path.join(raiz, 'descargas');
const salida = path.join(salidaDir, 'asesor-juridico-ciudadano-sin-internet.html');
const leer = f => fs.readFileSync(path.join(raiz, f), 'utf8');

let html = leer('index.html');
const css = leer('css/estilos.css');
const logo = 'data:image/webp;base64,' + fs.readFileSync(path.join(raiz, 'img/logo-suenomotora.webp')).toString('base64');
const RE_LOGO = /img\/logo-suenomotora\.webp(\?v=\d+)?/g;

// 1. Scripts en el mismo orden que index.html. El código va en base64 dentro de la página:
//    así ninguna secuencia del código ("</script", "<!--", "<script") puede confundir al
//    analizador HTML, y los acentos se conservan (UTF-8).
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
let js = scripts.map(s => `/* ===== ${s} ===== */\n${leer(s)}`).join('\n;\n');
js = js.replace(RE_LOGO, logo);
const jsB64 = Buffer.from(js, 'utf8').toString('base64');
const cargador = `(function(){var b=atob(document.getElementById('aj-codigo').textContent.replace(/\\s+/g,''));var u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);var s=document.createElement('script');s.textContent=new TextDecoder('utf-8').decode(u);document.head.appendChild(s);})();`;

// 2. Sin fuentes externas ni manifiesto: el archivo no depende de la red
html = html
  .replace(/\s*<link rel="preconnect"[^>]*>/g, '')
  .replace(/\s*<link rel="stylesheet" href="https:\/\/fonts[^>]*>/g, '')
  .replace(/\s*<link rel="manifest"[^>]*>/g, '')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, '')
  .replace(/<link rel="stylesheet" href="css\/estilos.css">/, `<style>\n${css}\n</style>`)
  .replace(RE_LOGO, logo)
  .replace(/<title>Asesor Jurídico Ciudadano<\/title>/, '<title>Asesor Jurídico Ciudadano (sin internet)</title>')
  .replace(/(\s*<script src="[^"]+"><\/script>)+/, `\n  <script>window.AJ_SIN_INTERNET = true; window.AJ_VERSION = '${new Date().toISOString().slice(0, 10)}';</script>\n  <script type="text/plain" id="aj-codigo">\n${jsB64.replace(/.{120}/g, '$&\n')}\n  </script>\n  <script>${cargador}</script>`);

fs.mkdirSync(salidaDir, { recursive: true });
fs.writeFileSync(salida, html, 'utf8');
fs.writeFileSync(path.join(salidaDir, 'LEEME.txt'), [
  'ASESOR JURÍDICO CIUDADANO — VERSIÓN SIN INTERNET',
  '',
  'Qué es: la plataforma completa en un solo archivo (asesor-juridico-ciudadano-sin-internet.html).',
  'Cómo usarla: copia el archivo en una memoria USB, pégalo en el escritorio del computador y ábrelo con doble clic.',
  'Se abre en cualquier navegador (Chrome, Edge, Firefox) y funciona sin conexión a internet.',
  'Para imprimir o guardar en PDF: dentro de la plataforma, botón "Guardar PDF / Imprimir".',
  'Los documentos guardados quedan en el navegador de ese computador ("Mis documentos").',
  '',
  `Generado el ${new Date().toLocaleDateString('es-CO')} a partir de https://santiagodiezrestrepo.github.io/asesor-juridico-ciudadano/`,
  'Para actualizarla, vuelve a descargar el archivo desde esa página (sección "Acerca de" → "Usar sin internet").',
  '',
  'Una iniciativa de la Fundación La Sueñomotora. Herramienta gratuita de orientación general: no presta asesoría jurídica.'
].join('\r\n'), 'utf8');

const kb = Math.round(fs.statSync(salida).size / 1024);
console.log(`Generado ${path.relative(raiz, salida)} (${kb} KB) con ${scripts.length} archivos de código.`);
