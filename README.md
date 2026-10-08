# Asesor Jurídico Ciudadano

**Úsala en línea:** https://santiagodiezrestrepo.github.io/asesor-juridico-ciudadano/

Plataforma web gratuita para que cualquier persona en Colombia genere, sin abogado, documentos legales bien fundamentados: derechos de petición, acciones de tutela, incidentes de desacato, impugnaciones, recursos, quejas ante superintendencias, reclamos de hábeas data y solicitudes ante comisarías de familia.

La persona escoge su caso, responde preguntas en lenguaje común y obtiene el documento con el lenguaje jurídico, las normas y la jurisprudencia aplicables, listo para imprimir, descargar en Word o copiar.

## Cómo usarla

No necesita instalación ni servidor: es HTML, CSS y JavaScript puros.

- **Abrir localmente:** abre `index.html` en el navegador (doble clic). Para que las fuentes de Google se carguen se necesita internet; sin internet la página funciona igual con las fuentes del sistema.
- **Servir en la red local:**

```bash
python -m http.server 8791
```

y entra a `http://localhost:8791`.

- **Publicar:** sube la carpeta completa a cualquier hosting estático (GitHub Pages, Netlify, Vercel, un servidor Apache o Nginx). No hay backend: nada de lo que escriben los usuarios sale de su navegador.

## Qué incluye

| Carpeta / archivo | Contenido |
|---|---|
| `index.html` | Página única de la aplicación |
| `css/estilos.css` | Diseño (modo claro y oscuro, impresión) |
| `js/app.js` | Interfaz: búsqueda, catálogo, formularios, vista previa, exportación, "Mis documentos", guía y calculadora de plazos |
| `js/motor.js` | Motor que ensambla el documento (hechos, fundamentos, peticiones, pruebas, notificaciones, firma) y lo exporta a HTML, texto y Word |
| `js/festivos.js` | Festivos de Colombia (Ley 51 de 1983) y cálculo de días hábiles |
| `js/datos/normas.js` | Biblioteca de normas y sentencias citables (Constitución, leyes, decretos, resoluciones, Corte Constitucional) |
| `js/datos/entidades.js` | Categorías de entidades, EPS, fondos, bancos, empresas de servicios, dependencias municipales y directorio de ayuda gratuita |
| `js/datos/comunes.js` | Campos comunes (quién presenta, anonimato, representación, destinatario) y funciones de redacción jurídica |
| `js/datos/peticiones*.js` | 23 casos de derecho de petición |
| `js/datos/tutelas*.js` | 15 casos de acción de tutela |
| `js/datos/otros.js` | Desacato, impugnación, recursos, quejas, hábeas data y familia (11 casos) |
| `docs/ANALISIS.md` | Análisis del problema, cifras, marco jurídico y decisiones de diseño |

## Cómo agregar o modificar un caso

Cada caso es un objeto en uno de los archivos de `js/datos/`. Sus partes:

```js
{
  id: 'pet_ejemplo', tipo: 'peticion', categoria: 'municipio',
  titulo: 'Título en lenguaje común', resumen: 'Para qué sirve',
  palabras: ['palabras', 'clave', 'para', 'buscar'],
  destinatario: { categoria: 'municipio', cargo: 'Secretaría de ...' },
  campos: [ /* preguntas: texto, textarea, select, radio, checks, fecha, info */ ],
  asunto: d => 'Referencia del documento',
  hechos: d => ['Hecho redactado en lenguaje legal a partir de las respuestas', ...],
  normas: ['cp23', 'l1755_14'],          // ids de js/datos/normas.js
  fundamentos: d => ['Párrafos jurídicos adicionales'],
  peticiones: [ { v: 'id', t: 'Texto en lenguaje común', legal: 'Texto jurídico', inicial: true } ],
  anexos: [ { v: 'cedula', t: 'Copia de mi cédula' } ],
  guia: { plazo: { dias: 15, tipo: 'habiles' }, nota: '...', siNoResponden: '...' }
}
```

Las tutelas agregan `derechos`, `procedencia` y `medida`. Los campos usan `mostrarSi` / `ocultarSi` para aparecer según otras respuestas, y cada opción puede tener un texto `legal` distinto del texto `t` que ve la persona.

Para agregar una norma, añade una entrada en `js/datos/normas.js` con `cita` y `texto`, y referénciala por su id en `normas`.

## Pruebas

Un script de humo genera los 49 casos con datos de ejemplo en Node y verifica que no haya errores ni textos vacíos:

```bash
node --check js/app.js
```

(Repetir para cada archivo. El script completo usado en el desarrollo está descrito en `docs/ANALISIS.md`.)

## Aviso

La herramienta orienta y redacta con base en la normativa vigente, pero no reemplaza la asesoría de un abogado en casos complejos. La ayuda gratuita está en la Personería municipal, la Defensoría del Pueblo (01 8000 914 814) y los consultorios jurídicos universitarios.
