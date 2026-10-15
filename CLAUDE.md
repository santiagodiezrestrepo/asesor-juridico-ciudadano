# Asesor Jurídico Ciudadano

## Qué es
Web estática (HTML/CSS/JS puro, PWA con `sw.js`) para que cualquier persona en Colombia genere documentos legales (tutelas, derechos de petición, desacatos, hábeas data, etc.) respondiendo preguntas en lenguaje común. Publicada en GitHub Pages: https://santiagodiezrestrepo.github.io/asesor-juridico-ciudadano/

## Cómo se corre
Abrir `index.html` con doble clic, o:
```bash
python -m http.server 8791
```

## Cómo se prueba
Sin pruebas automáticas. Abrir la página, escoger un caso, llenar el formulario y verificar la vista previa, la descarga en Word y la impresión. Probar también modo oscuro.

## Estructura
- `index.html` página única · `css/estilos.css` · `js/app.js` interfaz · `js/` plantillas y normas
- `docs/` documentación · `herramientas/` scripts auxiliares · `descargas/` material de referencia · `img/`

## Reglas
- No hay backend: nada del usuario sale del navegador. Mantenerlo así.
- Español jurídico colombiano; citar norma y jurisprudencia vigentes.
- Al cambiar archivos cacheados, actualizar la versión en `sw.js`.
- Tiene git y remoto en GitHub: hacer commits pequeños.
