/* ============================================================
   sw.js — Service worker: guarda la plataforma completa en el
   navegador la primera vez que se abre con internet, para que
   después funcione sin conexión (y se actualice sola cuando
   vuelva a haber red).
   Al publicar cambios, sube el número de VERSION.
   ============================================================ */
const VERSION = 'aj-2026-10-08-1';
const ARCHIVOS = [
  './', './index.html', './manifest.webmanifest', './css/estilos.css',
  './js/festivos.js', './js/datos/normas.js', './js/datos/entidades.js', './js/datos/comunes.js',
  './js/datos/peticiones.js', './js/datos/peticiones2.js', './js/datos/peticiones3.js',
  './js/datos/tutelas.js', './js/datos/tutelas2.js', './js/datos/otros.js', './js/datos/contratos.js',
  './js/datos/mujer.js', './js/datos/sinonimos.js', './js/motor.js', './js/app.js',
  './img/logo-suenomotora.webp', './img/icono-192.png', './img/icono-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fuentes de Google y enlaces externos: los maneja el navegador
  if (/\/descargas\//.test(url.pathname) || url.pathname.endsWith('/sw.js')) return; // la versión sin internet se descarga siempre fresca
  e.respondWith(caches.open(VERSION).then(async cache => {
    const guardado = await cache.match(e.request, { ignoreSearch: true });
    const red = fetch(e.request).then(r => { if (r && r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    if (guardado) return guardado; // responde ya con lo guardado y actualiza en segundo plano
    const r = await red;
    if (r) return r;
    if (e.request.mode === 'navigate') return cache.match('./index.html');
    return new Response('', { status: 503, statusText: 'Sin conexión' });
  }));
});
