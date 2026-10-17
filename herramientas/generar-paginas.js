/* ============================================================
   generar-paginas.js — Páginas estáticas para buscadores y bots de IA.
   Genera, a partir de los mismos datos de la aplicación:
     - /plantillas/<slug>/         una página por cada caso + índice /plantillas/
     - /plantilla-tutela/, /tutela-eps/, /ejemplo-derecho-de-peticion/,
       /accion-de-tutela/          guías para las búsquedas más frecuentes
     - sitemap.xml, robots.txt, llms.txt
   Uso: node herramientas/generar-paginas.js   (volver a correr tras cambiar casos)
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..');
const SITIO = 'https://midefensor.org';
const HOY = new Date().toISOString().slice(0, 10);

/* ---------- Cargar la aplicación en Node ---------- */
const ctx = { console, Date, Math, String, Number, Array, Object, JSON, RegExp, Error, matchMedia: () => ({ matches: false }) };
ctx.window = ctx; ctx.document = { addEventListener() {} };
vm.createContext(ctx);
const html0 = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
[...html0.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]).filter(f => f !== 'js/app.js').forEach(f => vm.runInContext(fs.readFileSync(path.join(raiz, f), 'utf8'), ctx, { filename: f }));
const AJ = ctx.AJ;
const casos = AJ.casos.filter(c => !c.retirado);

/* ---------- Utilidades ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slugify = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escribir = (ruta, contenido) => { const f = path.join(raiz, ruta); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, contenido, 'utf8'); };
const ev = (fn, d) => { try { const r = typeof fn === 'function' ? fn(d || {}) : fn; return Array.isArray(r) ? r.flat().filter(Boolean) : (r ? [r] : []); } catch (e) { return []; } };
const lista = arr => arr.map(x => `<li>${x}</li>`).join('');

/* Direcciones legibles para cada caso (las que verá Google) */
const SLUGS = {
  pet_municipio_planeacion: 'derecho-de-peticion-planeacion-municipal', pet_municipio_servicios: 'derecho-de-peticion-alcaldia-barrio-vereda', pet_municipio_sisben: 'derecho-de-peticion-sisben',
  pet_municipio_transito: 'derecho-de-peticion-transito-comparendo-prescripcion', pet_municipio_predial: 'derecho-de-peticion-impuesto-predial', pet_municipio_policia: 'querella-inspeccion-de-policia-ruido-vecinos',
  pet_eps_servicio: 'derecho-de-peticion-eps-cita-medicamento-cirugia', pet_eps_historia: 'derecho-de-peticion-historia-clinica', pet_incapacidades: 'derecho-de-peticion-incapacidades-no-pagadas',
  pet_pension: 'derecho-de-peticion-colpensiones-pension', pet_empleador: 'derecho-de-peticion-empleador-salarios-liquidacion', pet_spd: 'reclamo-servicios-publicos-factura-alta',
  pet_banco: 'derecho-de-peticion-banco', pet_colegio: 'derecho-de-peticion-colegio-cupo-certificados', pet_info_publica: 'solicitud-informacion-publica', pet_copias: 'solicitud-de-copias-expediente',
  pet_queja_funcionario: 'queja-contra-funcionario-publico', pet_victimas: 'derecho-de-peticion-unidad-de-victimas', pet_migracion: 'derecho-de-peticion-migracion-colombia-ppt', pet_juzgado: 'derecho-de-peticion-juzgado-fiscalia',
  pet_icbf: 'derecho-de-peticion-icbf-comisaria-de-familia', pet_arrendador: 'reclamacion-arrendador-arrendatario', pet_prosperidad: 'derecho-de-peticion-prosperidad-social-subsidio', pet_general: 'derecho-de-peticion-modelo-general',
  tut_salud_servicio: 'tutela-eps-medicamentos-citas-cirugias', tut_salud_integral: 'tutela-tratamiento-integral', tut_peticion: 'tutela-derecho-de-peticion-sin-respuesta', tut_salario: 'tutela-salarios-no-pagados-minimo-vital',
  tut_incapacidades: 'tutela-incapacidades-no-pagadas', tut_pension: 'tutela-pension', tut_estabilidad: 'tutela-despido-embarazo-enfermedad-discapacidad', tut_educacion: 'tutela-derecho-a-la-educacion',
  tut_debido_proceso: 'tutela-debido-proceso', tut_habeas_data: 'tutela-habeas-data-datacredito', tut_servicios_publicos: 'tutela-corte-agua-energia', tut_victimas: 'tutela-victimas-del-conflicto',
  tut_vida_seguridad: 'tutela-amenazas-proteccion-unp', tut_migrantes: 'tutela-migrantes-salud-educacion', tut_general: 'tutela-general-cualquier-derecho',
  desacato: 'incidente-de-desacato-tutela', impugnacion: 'impugnacion-fallo-de-tutela', rec_reposicion: 'recurso-de-reposicion-y-apelacion', rec_spd: 'recurso-reposicion-servicios-publicos',
  queja_supersalud: 'queja-supersalud-eps', queja_consumidor: 'reclamacion-garantia-consumidor', queja_financiera: 'queja-defensor-consumidor-financiero', hd_reclamo: 'reclamo-habeas-data-datacredito', hd_supresion: 'solicitud-supresion-datos-personales',
  fam_alimentos: 'conciliacion-cuota-alimentaria', fam_proteccion: 'medida-de-proteccion-violencia-intrafamiliar', fam_custodia: 'conciliacion-custodia-y-visitas',
  con_arriendo_vivienda: 'contrato-de-arrendamiento-de-vivienda', con_compraventa_vehiculo: 'contrato-compraventa-vehiculo-moto', con_compraventa_bien: 'contrato-compraventa-bien-mueble', con_servicio_domestico: 'contrato-servicio-domestico',
  con_pagare: 'pagare-prestamo-entre-personas', con_poder: 'poder-especial-tramite', con_acuerdo_pago: 'acuerdo-de-pago-deuda', con_recibo: 'recibo-de-pago-paz-y-salvo',
  muj_denuncia: 'denuncia-violencia-contra-la-mujer-fiscalia', muj_tutela_proteccion: 'tutela-falta-de-proteccion-violencia-mujer', muj_declaracion_cabeza: 'declaracion-madre-cabeza-de-familia', muj_cabeza_familia: 'peticion-madre-cabeza-de-familia-prioridad',
  muj_licencia_maternidad: 'licencia-de-maternidad-no-pagada', muj_acoso_laboral: 'queja-acoso-laboral-acoso-sexual', muj_salud_sexual: 'peticion-eps-salud-sexual-reproductiva'
};
const rutaCaso = c => `/plantillas/${SLUGS[c.id] || slugify(c.titulo).split('-').slice(0, 7).join('-')}/`;

/* ---------- Plantilla de página ---------- */
const CABECERA = `
  <header class="cabecera">
    <div class="cabecera-in">
      <a class="marca" href="/">
        <span class="logo"><img src="/img/logo-asesor.svg" alt="" width="46" height="46"></span>
        <span>Asesor Jurídico Ciudadano<small>midefensor.org · Colombia · ${casos.length} plantillas gratis</small></span>
      </a>
      <nav class="nav" aria-label="Principal">
        <a href="/">Inicio</a>
        <a href="/plantillas/">Plantillas</a>
        <a href="/#catalogo">Buscar mi caso</a>
        <a href="/#guia">Guía</a>
        <a href="/#acerca">Acerca de</a>
      </nav>
    </div>
  </header>`;
const PIE = `
  <footer class="pie">
    <div class="pie-in">
      <span class="pie-marca"><a href="/#acerca"><img src="/img/logo-suenomotora.webp?v=3" alt="La Sueñomotora" width="1393" height="987"></a><span>Una iniciativa de la Fundación <a href="/#acerca">La Sueñomotora</a>. Herramienta gratuita de información y orientación general: <strong>no presta asesoría jurídica ni crea relación abogado-cliente</strong>. Los documentos son borradores que cada persona revisa, firma y presenta bajo su propia responsabilidad.</span></span>
      <span class="pie-legal"><a href="/#acerca/legal">Aviso legal</a> · <a href="/#acerca/legal-usuario">Términos de uso</a> · <a href="/#acerca/legal-privacidad">Privacidad</a> · <a href="/#acerca/sin-internet">Usar sin internet</a> · Ayuda gratuita: Personería municipal · Defensoría del Pueblo 01 8000 914 814 · Emergencias 123</span>
    </div>
  </footer>`;

function pagina({ ruta, titulo, descripcion, cuerpo, jsonld, migas }) {
  const url = SITIO + ruta;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO + '/' }, ...(migas || []).map((m, i) => ({ '@type': 'ListItem', position: i + 2, name: m.nombre, item: SITIO + m.ruta }))] },
    ...(jsonld || [])
  ];
  return `<!DOCTYPE html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descripcion)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="Asesor Jurídico Ciudadano · midefensor.org">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descripcion)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITIO}/img/portada.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Nunito:wght@700;800;900&family=Tinos:ital,wght@0,400;0,700;1,400&display=swap">
  <link rel="stylesheet" href="/css/estilos.css">
  <link rel="icon" href="/img/favicon.png" type="image/png">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#0f7a5a">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>${CABECERA}
  <main class="articulo">
    <nav class="migas" aria-label="Ruta"><a href="/">Inicio</a>${(migas || []).map(m => ` › <a href="${m.ruta}">${esc(m.nombre)}</a>`).join('')}</nav>
${cuerpo}
  </main>${PIE}
</body>
</html>
`;
}

/* ---------- Textos de apoyo por tipo ---------- */
const DONDE = {
  tutela: 'Se presenta ante cualquier juez del lugar donde vives, en persona en la Oficina de Reparto o por internet en Tutela en Línea (Rama Judicial), gratis y sin abogado. El juez tiene máximo diez (10) días para decidir.',
  peticion: 'Se entrega en la ventanilla de la entidad (pide sello de recibido), por su correo de PQRS o por su página web. La entidad debe responder de fondo en quince (15) días hábiles (diez para copias, treinta para consultas), según la Ley 1755 de 2015.',
  queja: 'Se radica en la ventanilla o en el formulario de PQRS de la entidad o la superintendencia. Guarda el número de radicado.',
  habeas: 'Se presenta primero a la empresa que hizo el reporte o a la central de riesgo; tienen quince (15) días hábiles para responder. Después procede la tutela.',
  recurso: 'Se presenta ante la misma entidad que tomó la decisión, dentro del plazo legal (diez días hábiles; cinco en servicios públicos). Pide constancia de la fecha de radicación.',
  desacato: 'Se presenta ante el mismo juez que falló la tutela, citando el número de radicado.',
  impugnacion: 'Se presenta ante el mismo juez que falló, dentro de los tres (3) días hábiles siguientes a la notificación.',
  familia: 'Se presenta en la Comisaría de Familia del municipio o en el Centro Zonal del ICBF, sin cita en la mayoría de los casos y sin abogado.',
  denuncia: 'Se presenta en cualquier Fiscalía (URI, Casa de Justicia, CAIVAS o CAVIF) o por internet en la denuncia virtual de la Fiscalía. Pide el número de noticia criminal.',
  contrato: 'Se imprime en dos copias, se firma por las dos partes (con testigos si se quiere) y cada parte guarda una. Algunos documentos conviene autenticarlos en notaría.'
};
const FAQ_TIPO = {
  tutela: [
    ['¿Necesito abogado para presentar una tutela?', 'No. El artículo 86 de la Constitución y el Decreto 2591 de 1991 permiten que cualquier persona presente la tutela por sí misma, sin abogado y sin costo. La Personería y la Defensoría del Pueblo también ayudan gratis.'],
    ['¿Cuánto tarda el juez en decidir?', 'Máximo diez (10) días desde que se radica. Si marcas que la situación es urgente, el juez puede dictar una medida provisional el mismo día. La entidad suele tener 48 horas para cumplir la orden.'],
    ['¿Esta plantilla de tutela sirve para mi caso?', 'Sirve si tu situación coincide con la descrita arriba. El formulario te hace preguntas en lenguaje sencillo y arma el escrito con los hechos, los derechos, las normas y las sentencias de la Corte Constitucional que corresponden. Si no estás seguro, usa la "Guía para decidir" del sitio.']
  ],
  peticion: [
    ['¿Cuánto tiempo tienen para responder un derecho de petición?', 'Quince (15) días hábiles en general, diez (10) para entrega de documentos y treinta (30) para consultas (Ley 1755 de 2015). Si no responden, procede la acción de tutela por violación del derecho de petición.'],
    ['¿El derecho de petición se puede presentar a una empresa privada?', 'Sí. Los artículos 32 y 33 de la Ley 1755 de 2015 obligan también a las empresas privadas (EPS, bancos, empresas de servicios, empleadores) a responder.'],
    ['¿Necesito abogado o pagar algo?', 'No. El derecho de petición es gratuito y lo presenta la misma persona. Esta plantilla lo redacta con las normas correctas; tú solo lo firmas y lo entregas.']
  ],
  generico: [
    ['¿Esto tiene algún costo?', 'No. La plataforma es gratuita, no pide registro y no envía tus datos a ningún servidor: todo se procesa en tu navegador.'],
    ['¿Necesito abogado?', 'Para este documento no. Es un trámite que la ley permite presentar directamente. Si tu caso se complica, la Personería, la Defensoría del Pueblo y los consultorios jurídicos universitarios ayudan gratis.'],
    ['¿Qué recibo al final?', 'El documento completo, listo para imprimir, guardar en PDF, descargar en Word o copiar, con una guía de dónde entregarlo y qué hacer si no responden.']
  ]
};
const plazoTexto = c => { const p = c.guia && c.guia.plazo; if (!p) return ''; return `${p.dias} ${p.tipo === 'habiles' ? 'días hábiles' : 'días calendario'}`; };

/* ---------- Página de cada caso ---------- */
function paginaCaso(c) {
  const tipo = AJ.tipos[c.tipo];
  const ruta = rutaCaso(c);
  const titulo = `${c.titulo} | Plantilla gratis para llenar en línea`;
  const descripcion = `${c.resumen} Plantilla gratuita, sin abogado y sin registro: respondes preguntas sencillas y descargas el documento en PDF o Word.`.slice(0, 300);
  const campos = c.campos.filter(x => x.tipo !== 'info').map(x => x.etiqueta).filter(Boolean).slice(0, 12);
  const peticiones = (c.peticiones || []).map(p => p.t);
  const anexos = (c.anexos || []).map(a => a.t);
  const normas = [...new Set(ev(c.normas, {}).map(id => AJ.normas[id] && AJ.normas[id].cita).filter(Boolean))];
  const faq = [...(FAQ_TIPO[c.tipo] || FAQ_TIPO.generico)];
  if (plazoTexto(c)) faq.push([`¿Cuánto tiempo tienen para responder ${c.tipo === 'tutela' ? 'la tutela' : 'esta solicitud'}?`, `${c.tipo === 'tutela' ? 'El juez tiene máximo' : 'El plazo legal es de'} ${plazoTexto(c)}. ${c.guia && c.guia.siNoResponden ? 'Si no responden: ' + c.guia.siNoResponden : ''}`.trim()]);
  const relacionados = casos.filter(x => x.id !== c.id && (x.tipo === c.tipo || (c.modulo && x.modulo === c.modulo))).slice(0, 8);
  const esContrato = !!tipo.contrato;
  const cuerpo = `
    <article>
      <p class="eyebrow">${esc(tipo.nombre)} · Plantilla gratuita</p>
      <h1>${esc(c.titulo)}</h1>
      <p class="resumen">${esc(c.resumen)}</p>
      <p class="cta"><a class="btn btn-primario btn-grande" href="/#caso/${c.id}">Crear mi documento gratis</a><span>Sin registro. Respondes las preguntas en unos 10 minutos y descargas el documento en PDF o Word.</span></p>
      ${c.guia && c.guia.nota ? `<div class="nota"><p>${esc(c.guia.nota)}</p></div>` : ''}

      <h2>Para qué sirve esta plantilla</h2>
      <p>${esc(tipo.descripcion)}</p>
      <p>Este modelo de ${esc(tipo.nombre.toLowerCase())} está pensado para la situación descrita arriba. No es un formato en blanco: el formulario te hace preguntas en lenguaje común y, con tus respuestas, redacta ${esContrato ? 'las cláusulas numeradas con los artículos aplicables' : 'los hechos numerados, los fundamentos de derecho, las peticiones y los anexos'}, en el lenguaje jurídico que la entidad espera.</p>

      <h2>Qué te pregunta el formulario</h2>
      <ul>${lista(campos.map(esc))}</ul>

      ${peticiones.length ? `<h2>${esContrato ? 'Qué incluye el documento' : 'Qué puedes pedir'}</h2><ul>${lista(peticiones.map(esc))}</ul>` : ''}
      ${anexos.length ? `<h2>Documentos que conviene anexar</h2><ul>${lista(anexos.map(esc))}</ul>` : ''}
      ${normas.length ? `<h2>Normas y sentencias en que se apoya</h2><p>El documento cita, con su texto, entre otras:</p><ul>${lista(normas.map(esc))}</ul>` : ''}

      <h2>Dónde se presenta y qué sigue</h2>
      <p>${esc(DONDE[c.tipo] || '')}</p>
      ${plazoTexto(c) ? `<p><strong>Plazo de respuesta:</strong> ${esc(plazoTexto(c))}. El sitio calcula la fecha exacta de vencimiento con los festivos de Colombia.</p>` : ''}
      ${c.guia && c.guia.siNoResponden ? `<p><strong>Si no responden o no cumplen:</strong> ${esc(c.guia.siNoResponden)}</p>` : ''}

      <h2>Preguntas frecuentes</h2>
      <dl class="faq">${faq.map(([q, a]) => `<dt>${esc(q)}</dt><dd>${esc(a)}</dd>`).join('')}</dl>

      <p class="cta"><a class="btn btn-primario btn-grande" href="/#caso/${c.id}">Llenar esta plantilla ahora</a></p>

      ${relacionados.length ? `<h2>Plantillas relacionadas</h2><ul class="relacionados">${lista(relacionados.map(x => `<a href="${rutaCaso(x)}">${esc(x.titulo)}</a>`))}</ul>` : ''}
      <p><a href="/plantillas/">Ver las ${casos.length} plantillas</a> · <a href="/#guia/decidir">¿No sabes cuál necesitas? Guía para decidir</a></p>
    </article>`;
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: c.titulo, description: c.resumen, url: SITIO + ruta, inLanguage: 'es-CO', isPartOf: { '@type': 'WebSite', name: 'Asesor Jurídico Ciudadano', url: SITIO + '/' }, about: tipo.nombre, publisher: { '@type': 'Organization', name: 'Fundación La Sueñomotora' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: `Plantilla: ${c.titulo}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITIO + '/#caso/' + c.id, offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' } }
  ];
  return { ruta, html: pagina({ ruta, titulo, descripcion, cuerpo, jsonld, migas: [{ nombre: 'Plantillas', ruta: '/plantillas/' }, { nombre: tipo.nombre, ruta: '/plantillas/#' + c.tipo }] }) };
}

/* ---------- Documentos de ejemplo (datos inventados pero realistas) ---------- */
function generarEjemplo(id, d) {
  const c = casos.find(x => x.id === id);
  const datos = Object.assign({}, d);
  c.campos.forEach(x => { if (x.tipo !== 'info' && datos[x.id] === undefined) datos[x.id] = x.tipo === 'checks' ? [] : (x.valorInicial !== undefined ? x.valorInicial : ''); });
  datos.peticiones = (c.peticiones || []).filter(o => o.fijo || (typeof o.inicial === 'function' ? !!o.inicial(datos) : !!o.inicial)).map(o => o.v);
  datos.anexos = (c.anexos || []).filter(o => !o.si || o.si(datos)).slice(0, 4).map(o => o.v);
  datos.derechos = (c.derechos || []).filter(o => o.inicial).map(o => o.v);
  return AJ.motor.generar(c, datos).html;
}
const EJ_TUTELA_EPS = generarEjemplo('tut_salud_servicio', {
  modo: 'representante', nombre: 'Luz Marina Restrepo Díaz', genero: 'f', tipoDoc: 'CC', numDoc: '43.567.890', expedidaEn: 'Medellín', ciudad: 'Medellín', direccion: 'Carrera 50 # 30-15, barrio Belén', telefono: '301 222 3344', correo: 'luzmarina@correo.com', condicion: ['adulto_mayor', 'enfermedad'],
  afectadoNombre: 'José Antonio Restrepo Gómez', afectadoGenero: 'm', afectadoTipoDoc: 'CC', afectadoNumDoc: '8.123.456', parentesco: 'padre', afectadoRazon: 'enfermedad',
  categoria: 'eps', entidadNombre: 'Nueva EPS', entidadCargo: 'Representante legal', entidadCiudad: 'Medellín', entidadDireccion: 'notificacionesjudiciales@nuevaeps.com.co',
  regimen: 'subsidiado', tipoServicio: 'insumos', servicio: 'Oxígeno domiciliario 2 litros por minuto, 24 horas, con concentrador', diagnostico: 'EPOC severo (J44.9)', fechaOrden: '2026-08-20', medico: 'Dr. Carlos Mejía, neumólogo, Hospital General de Medellín', respuestaEps: 'nada', riesgo: 'Sin oxígeno se ahoga, satura 82 % y ya fue hospitalizado dos veces.', recursos: 'no',
  yaPedi: 'si', fechaPrevia: '2026-09-02', radicadoPrevio: '2026-09-02-04471', medioPrevio: 'escrito', respuestaPrevia: 'nada', urgente: 'si', medidaTexto: 'Que entreguen el concentrador hoy mismo porque sin él puede morir.', otraTutela: 'no', relato: 'Llamé ocho veces a la línea de la EPS y siempre dicen que está en trámite.'
});
const EJ_PETICION_EPS = generarEjemplo('pet_eps_servicio', {
  modo: 'propio', nombre: 'Rosa Elena Quintero de Gómez', genero: 'f', tipoDoc: 'CC', numDoc: '21.345.678', expedidaEn: 'Medellín', ciudad: 'Medellín', direccion: 'Carrera 80 # 32-10, barrio Belén', telefono: '604 341 2233', correo: 'rosaquintero1952@hotmail.com', condicion: ['adulto_mayor'],
  categoria: 'eps', entidadNombre: 'Nueva EPS', entidadCargo: 'Representante legal', entidadCiudad: 'Medellín', entidadDireccion: 'notificaciones@nuevaeps.com.co',
  regimen: 'subsidiado', tipoServicio: 'cita', servicio: 'Consulta con cardiología (control de fibrilación auricular)', diagnostico: 'Fibrilación auricular (I48.0)', fechaOrden: '2026-07-30', medico: 'Dr. Mauricio Londoño, medicina interna, Hospital General de Medellín', respuestaEps: 'autorizo_sin_cita', riesgo: 'Me falta el aire, me he desmayado dos veces y el médico dijo que sin el control puedo sufrir un derrame.',
  yaPedi: 'si', fechaPrevia: '2026-08-12', radicadoPrevio: '2026-08-12-04471', medioPrevio: 'telefono', respuestaPrevia: 'prometieron'
});
const EJ_PETICION_GENERAL = generarEjemplo('pet_general', {
  modo: 'propio', nombre: 'Kevin Andrés Pérez Rúa', genero: 'm', tipoDoc: 'CC', numDoc: '1.027.456.789', expedidaEn: 'Bello', ciudad: 'Bello, Antioquia', direccion: 'Calle 22 # 50-14, barrio Niquía', telefono: '301 456 7890', correo: 'kevin.perez@gmail.com', condicion: [],
  categoria: 'municipio', entidadNombre: 'Alcaldía de Bello', entidadCargo: 'Secretaría de Hacienda', entidadCiudad: 'Bello, Antioquia', entidadDireccion: 'contactenos@bello.gov.co',
  modalidad: 'interes_particular', tema: 'Devolución de un pago doble del impuesto de industria y comercio', yaPedi: 'no', relato: 'El 20 de julio de 2026 pagué el impuesto por la página web de la Alcaldía.\nEl 22 de julio el banco me volvió a cobrar el mismo valor.\nTengo los dos comprobantes de pago.', pide: 'Que me devuelvan los 320.000 pesos pagados de más.\nQue me expliquen por qué se generó el doble cobro.'
});
const ejemplo = (html, nota) => `<div class="nota"><p>${esc(nota)}</p></div><div class="hoja ejemplo-doc">${html}</div>`;

const enlace = id => { const c = casos.find(x => x.id === id); return `<a href="${rutaCaso(c)}">${esc(c.titulo)}</a>`; };
const faqHtml = faq => `<h2>Preguntas frecuentes</h2><dl class="faq">${faq.map(([q, a]) => `<dt>${esc(q)}</dt><dd>${esc(a)}</dd>`).join('')}</dl>`;
const faqLd = faq => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const howToLd = (name, pasos) => ({ '@context': 'https://schema.org', '@type': 'HowTo', name, totalTime: 'PT15M', estimatedCost: { '@type': 'MonetaryAmount', currency: 'COP', value: '0' }, step: pasos.map(([n, t]) => ({ '@type': 'HowToStep', name: n, text: t })) });
const tutelas = casos.filter(c => c.tipo === 'tutela');
const peticiones = casos.filter(c => c.tipo === 'peticion');

/* ---------- Guías para las búsquedas más frecuentes ---------- */
const GUIAS = [];

{ // Plantilla de tutela
  const faq = [
    ['¿Dónde consigo una plantilla de tutela gratis?', 'Aquí. midefensor.org tiene ' + tutelas.length + ' modelos de acción de tutela (salud, EPS, derecho de petición, pensión, salarios, educación, servicios públicos, debido proceso, hábeas data y más). No se descarga un formato en blanco: respondes preguntas sencillas y el sitio redacta la tutela completa con tus datos.'],
    ['¿La plantilla se puede descargar en Word?', 'Sí. Al terminar puedes guardarla en PDF, descargarla en Word (.doc), copiar el texto o compartirla por WhatsApp. También puedes presentarla directamente en Tutela en Línea de la Rama Judicial.'],
    ['¿Qué debe tener una tutela para que no la rechacen?', 'Nombre y datos del accionante, entidad accionada, hechos numerados, derechos vulnerados, por qué procede (subsidiariedad e inmediatez), lo que se pide al juez, pruebas, la declaración bajo juramento de no haber presentado otra tutela igual y las direcciones de notificación. Las plantillas de este sitio incluyen todas esas partes.'],
    ['¿Sirve la misma plantilla de tutela para cualquier caso?', 'No conviene. Una tutela por salud cita la Ley 1751 de 2015 y la Sentencia T-760 de 2008; una por derecho de petición cita la Ley 1755 de 2015; una por despido en embarazo cita la SU-075 de 2018. Por eso hay un modelo por situación, cada uno con sus normas y sentencias ya verificadas.']
  ];
  const pasos = [['Escoge el modelo', 'Elige la tutela que coincide con tu situación (salud, petición sin respuesta, pensión, salarios, educación…).'], ['Responde las preguntas', 'Quién presenta, contra qué entidad, qué pasó, qué derechos te afectan, si es urgente y qué anexas. Todo en lenguaje común.'], ['Revisa el borrador', 'El sitio arma los hechos, los fundamentos de derecho con normas y sentencias, las pretensiones, la medida provisional y el juramento.'], ['Descarga y presenta', 'Guarda el PDF o el Word y preséntala en Tutela en Línea o en la Oficina de Reparto de tu municipio. El juez decide en máximo 10 días.']];
  GUIAS.push({
    ruta: '/plantilla-tutela/', titulo: 'Plantilla de tutela gratis: modelo para llenar en línea y descargar en Word o PDF',
    descripcion: `Plantilla de acción de tutela gratis y actualizada (Colombia). ${tutelas.length} modelos por tipo de caso: salud y EPS, derecho de petición, pensión, salarios, educación, servicios públicos. Se llena en línea sin abogado y se descarga en Word o PDF.`,
    jsonld: [faqLd(faq), howToLd('Cómo llenar una plantilla de tutela en línea', pasos)],
    cuerpo: `<article>
      <p class="eyebrow">Acción de tutela · Plantillas gratuitas</p>
      <h1>Plantilla de tutela gratis para llenar en línea</h1>
      <p class="resumen">Si buscas una plantilla, un modelo, un formato o un "template" de tutela, aquí tienes ${tutelas.length} modelos actualizados que se llenan respondiendo preguntas sencillas. El resultado es una acción de tutela completa, con hechos, derechos, normas, sentencias de la Corte Constitucional, pretensiones y juramento, lista para presentar sin abogado.</p>
      <p class="cta"><a class="btn btn-primario btn-grande" href="/#catalogo/tutela">Ver los modelos de tutela</a><span>Gratis, sin registro, en PDF o Word. Funciona también sin internet.</span></p>

      <h2>Elige la plantilla según tu caso</h2>
      <ul class="relacionados">${lista(tutelas.map(c => `<a href="${rutaCaso(c)}">${esc(c.titulo)}</a>`))}</ul>

      <h2>Cómo se llena la plantilla, paso a paso</h2>
      <ol class="pasos-texto">${pasos.map(([n, t]) => `<li><strong>${esc(n)}.</strong> ${esc(t)}</li>`).join('')}</ol>

      <h2>Ejemplo de tutela generada con la plantilla</h2>
      ${ejemplo(EJ_TUTELA_EPS, 'Ejemplo real de lo que produce el modelo "Tutela por salud" con datos inventados: una hija que presenta la tutela por su padre, a quien la EPS no entrega el oxígeno ordenado por el médico.')}

      <h2>Qué partes tiene una tutela bien hecha</h2>
      <ul>
        <li><strong>Encabezado:</strong> ciudad, fecha, juez de reparto, referencia con accionante, accionado y derechos invocados.</li>
        <li><strong>Hechos:</strong> numerados, en orden de fechas, con radicados y nombres.</li>
        <li><strong>Derechos vulnerados:</strong> con el artículo de la Constitución que los reconoce.</li>
        <li><strong>Fundamentos de derecho:</strong> normas y sentencias pertinentes, no una lista genérica.</li>
        <li><strong>Procedencia:</strong> legitimación, subsidiariedad e inmediatez explicadas para el caso.</li>
        <li><strong>Pretensiones:</strong> órdenes concretas con plazo (por ejemplo, 48 horas) y advertencia de desacato.</li>
        <li><strong>Medida provisional</strong> cuando esperar el fallo causaría un daño grave.</li>
        <li><strong>Pruebas, juramento</strong> de no haber presentado otra tutela igual y <strong>notificaciones</strong>.</li>
      </ul>
      ${faqHtml(faq)}
      <p>Relacionado: <a href="/tutela-eps/">cómo hacer una tutela a la EPS</a> · <a href="/accion-de-tutela/">qué es el derecho de tutela y cuándo procede</a> · <a href="/ejemplo-derecho-de-peticion/">ejemplo de derecho de petición</a> (el paso previo en muchos casos).</p>
    </article>`
  });
}

{ // Tutela EPS
  const faq = [
    ['¿Cuándo puedo poner una tutela a la EPS?', 'Cuando la EPS niega, demora o entrega incompleto un servicio ordenado por el médico tratante (medicamento, cita con especialista, cirugía, examen, terapia, insumos como pañales u oxígeno), cuando no autoriza un tratamiento integral o cuando no paga incapacidades o la licencia de maternidad. No necesitas haber presentado antes un derecho de petición, aunque ayuda como prueba.'],
    ['¿Cuánto se demora una tutela contra la EPS?', 'El juez tiene máximo diez (10) días para fallar. Si pides medida provisional por urgencia, puede ordenar la entrega del servicio en horas. La EPS normalmente tiene 48 horas para cumplir.'],
    ['¿Qué pruebas necesito para la tutela a la EPS?', 'La orden médica, la historia clínica o el diagnóstico, la respuesta de la EPS (o la prueba de que no respondió), tu cédula y el carné o certificado de afiliación. Si no tienes algún documento, la tutela pide al juez que requiera a la EPS para que lo aporte.'],
    ['¿La tutela a la EPS la puede presentar un familiar?', 'Sí, como agente oficioso, cuando el paciente no puede hacerlo por su estado de salud (artículo 10 del Decreto 2591 de 1991). La plantilla lo redacta así cuando eliges "por otra persona".'],
    ['¿Y si la EPS no cumple el fallo?', 'Se presenta un incidente de desacato ante el mismo juez: puede imponer arresto y multa al representante de la EPS. También hay plantilla para eso.']
  ];
  const pasos = [['Reúne la orden médica y la respuesta de la EPS', 'Si la EPS no ha respondido, anota las fechas en que la llamaste o fuiste.'], ['Abre la plantilla "Tutela por salud"', 'Indica si es medicamento, cita, cirugía, examen o insumo, el diagnóstico y qué pasa si no te lo dan.'], ['Marca la urgencia', 'Si esperar el fallo es peligroso, pide la medida provisional: el juez puede ordenar el servicio el mismo día.'], ['Descarga y radica', 'En Tutela en Línea (ramajudicial.gov.co) desde el celular, o en la Oficina de Reparto. Guarda el radicado.']];
  GUIAS.push({
    ruta: '/tutela-eps/', titulo: 'Cómo hacer una tutela a la EPS paso a paso (plantilla gratis y ejemplo)',
    descripcion: 'Guía para hacer una tutela contra la EPS por medicamentos, citas, cirugías, exámenes o insumos negados o demorados. Requisitos, plazos (10 días), medida provisional, ejemplo completo y plantilla gratis para llenar en línea sin abogado.',
    jsonld: [faqLd(faq), howToLd('Cómo hacer una tutela a la EPS', pasos)],
    cuerpo: `<article>
      <p class="eyebrow">Salud · Acción de tutela</p>
      <h1>Cómo hacer una tutela a la EPS</h1>
      <p class="resumen">La tutela por salud es la más presentada en Colombia: más de 200.000 al año según la Defensoría del Pueblo. Procede cuando la EPS no autoriza, no entrega o demora un medicamento, una cita, una cirugía, un examen o un insumo ordenado por el médico. Aquí tienes los pasos, los requisitos, un ejemplo completo y la plantilla para hacerla gratis.</p>
      <p class="cta"><a class="btn btn-primario btn-grande" href="/#caso/tut_salud_servicio">Hacer mi tutela a la EPS</a><span>Gratis, sin abogado, en 10 minutos. El juez decide en máximo 10 días.</span></p>

      <h2>Paso a paso</h2>
      <ol class="pasos-texto">${pasos.map(([n, t]) => `<li><strong>${esc(n)}.</strong> ${esc(t)}</li>`).join('')}</ol>

      <h2>Qué dice la ley</h2>
      <p>La salud es un derecho fundamental autónomo (Ley Estatutaria 1751 de 2015). La EPS debe garantizar los servicios que ordena el médico tratante sin barreras administrativas; la Corte Constitucional lo ha reiterado desde la Sentencia T-760 de 2008, y las citas con especialista deben asignarse en plazos razonables (Resolución 1552 de 2013). Negar un servicio por trámites internos, por "no estar en el plan de beneficios" cuando el médico lo justifica, o por mora del empleador, vulnera el derecho y hace procedente la tutela.</p>

      <h2>Plantillas de tutela a la EPS según el problema</h2>
      <ul class="relacionados">${lista(['tut_salud_servicio', 'tut_salud_integral', 'tut_incapacidades', 'tut_migrantes', 'muj_licencia_maternidad', 'pet_eps_servicio', 'queja_supersalud', 'desacato'].map(enlace))}</ul>

      <h2>Ejemplo de tutela a la EPS</h2>
      ${ejemplo(EJ_TUTELA_EPS, 'Documento generado por la plantilla con datos inventados: tutela por oxígeno domiciliario no entregado, presentada por la hija del paciente como agente oficiosa, con medida provisional.')}

      <h2>Errores que hacen perder la tutela</h2>
      <ul>
        <li>Pedir algo que el médico no ordenó (la tutela protege lo prescrito por el médico tratante).</li>
        <li>No decir que la situación es urgente cuando lo es: sin medida provisional, el fallo tarda hasta 10 días.</li>
        <li>Presentar dos tutelas por lo mismo: la segunda se rechaza por temeraria. Si ya ganaste y no cumplen, lo que procede es el desacato.</li>
        <li>No dejar correo electrónico: el juzgado notifica por correo y sin él todo tarda más.</li>
      </ul>
      ${faqHtml(faq)}
      <p>Relacionado: <a href="/plantilla-tutela/">todas las plantillas de tutela</a> · <a href="/ejemplo-derecho-de-peticion/">ejemplo de derecho de petición a la EPS</a> · <a href="/accion-de-tutela/">qué es la acción de tutela</a>.</p>
    </article>`
  });
}

{ // Ejemplo derecho de petición
  const faq = [
    ['¿Qué debe llevar un derecho de petición?', 'Según el artículo 16 de la Ley 1755 de 2015: la entidad a la que se dirige, nombre e identificación de quien lo presenta, dirección de notificación (física o correo), lo que se pide, las razones, los documentos que se anexan y la firma. No exige formato especial ni abogado.'],
    ['¿Cuánto tiempo tienen para responder?', 'Quince (15) días hábiles como regla general; diez (10) si pides documentos o información; treinta (30) si es una consulta. Si no pueden responder a tiempo deben avisarte antes del vencimiento y decir cuándo responderán.'],
    ['¿Qué pasa si no responden el derecho de petición?', 'Puedes presentar una acción de tutela por violación del derecho fundamental de petición (artículo 23 de la Constitución). El juez ordena responder en 48 horas. En este sitio hay plantilla para esa tutela.'],
    ['¿Puedo presentar un derecho de petición a una EPS o a un banco?', 'Sí. Las empresas privadas que prestan servicios públicos o frente a las que estás en situación de indefensión también deben responder (artículos 32 y 33 de la Ley 1755 de 2015).'],
    ['¿Puedo hacerlo anónimo?', 'Solo en peticiones de interés general, quejas y denuncias con pruebas. Para asuntos propios (citas, pensión, Sisbén) la entidad necesita saber quién eres.']
  ];
  GUIAS.push({
    ruta: '/ejemplo-derecho-de-peticion/', titulo: 'Ejemplo de derecho de petición: modelo gratis para llenar en línea (EPS, alcaldía, empresa)',
    descripcion: `Ejemplo completo de derecho de petición con todas sus partes (Ley 1755 de 2015) y ${peticiones.length} modelos gratis para EPS, Colpensiones, alcaldía, empleador, banco, colegio y más. Se llena en línea sin abogado y se descarga en Word o PDF.`,
    jsonld: [faqLd(faq)],
    cuerpo: `<article>
      <p class="eyebrow">Derecho de petición · Ejemplos y plantillas</p>
      <h1>Ejemplo de derecho de petición</h1>
      <p class="resumen">El derecho de petición (artículo 23 de la Constitución y Ley 1755 de 2015) sirve para pedir por escrito información, documentos, un servicio o una decisión a cualquier entidad pública o privada, que debe responder de fondo en quince días hábiles. Abajo hay dos ejemplos completos y ${peticiones.length} modelos listos para llenar con tus datos.</p>
      <p class="cta"><a class="btn btn-primario btn-grande" href="/#catalogo/peticion">Hacer mi derecho de petición</a><span>Gratis, sin registro, en PDF o Word.</span></p>

      <h2>Ejemplo 1: derecho de petición a la EPS por una cita con especialista</h2>
      ${ejemplo(EJ_PETICION_EPS, 'Generado con la plantilla "Petición a la EPS" con datos inventados: una mujer de 74 años a la que autorizaron la cita con cardiología pero no se la asignan.')}

      <h2>Ejemplo 2: derecho de petición general a una alcaldía</h2>
      ${ejemplo(EJ_PETICION_GENERAL, 'Generado con la plantilla "Derecho de petición general": devolución de un pago doble de un impuesto municipal.')}

      <h2>Partes de un derecho de petición (artículo 16 de la Ley 1755 de 2015)</h2>
      <ol class="pasos-texto">
        <li><strong>Ciudad y fecha.</strong></li>
        <li><strong>Destinatario:</strong> entidad, cargo o dependencia.</li>
        <li><strong>Referencia:</strong> el asunto en una línea.</li>
        <li><strong>Identificación:</strong> nombre, cédula, dirección y correo de quien presenta.</li>
        <li><strong>Hechos:</strong> numerados y en orden de fechas, con radicados anteriores.</li>
        <li><strong>Fundamentos de derecho:</strong> las normas que obligan a la entidad.</li>
        <li><strong>Petición:</strong> lo que pides, concreto y numerado.</li>
        <li><strong>Anexos, notificaciones y firma.</strong></li>
      </ol>

      <h2>Modelos de derecho de petición por entidad</h2>
      <ul class="relacionados">${lista(peticiones.map(c => `<a href="${rutaCaso(c)}">${esc(c.titulo)}</a>`))}</ul>
      ${faqHtml(faq)}
      <p>Si ya presentaste un derecho de petición y no respondieron: ${enlace('tut_peticion')}. Más guías: <a href="/plantilla-tutela/">plantilla de tutela</a> · <a href="/tutela-eps/">tutela a la EPS</a>.</p>
    </article>`
  });
}

{ // Acción de tutela (derecho de tutela)
  const faq = [
    ['¿Qué es la acción de tutela?', 'Es el mecanismo del artículo 86 de la Constitución para que cualquier persona pida a un juez la protección inmediata de sus derechos fundamentales cuando una autoridad o, en ciertos casos, un particular los vulnera o amenaza. Es gratuita, no requiere abogado y el juez decide en máximo diez días.'],
    ['¿Qué derechos protege la tutela?', 'Los derechos fundamentales: vida, salud, petición, debido proceso, igualdad, educación, mínimo vital, hábeas data, libertad de expresión, entre otros. También derechos económicos cuando su vulneración afecta un derecho fundamental (por ejemplo, la pensión o el salario cuando compromete el mínimo vital).'],
    ['¿Cuándo no procede la tutela?', 'Cuando existe otro mecanismo judicial eficaz y no hay un perjuicio irremediable (subsidiariedad), cuando ha pasado un tiempo irrazonable desde la vulneración (inmediatez), cuando ya se presentó otra tutela por los mismos hechos (temeridad) o contra sentencias, salvo casos excepcionales.'],
    ['¿Contra quién se puede presentar?', 'Contra cualquier autoridad pública y contra particulares que presten servicios públicos (EPS, colegios, empresas de servicios), que afecten el interés colectivo o frente a los que la persona esté en subordinación o indefensión (empleadores, bancos, centrales de riesgo).'],
    ['¿Qué pasa después del fallo?', 'La entidad debe cumplir en el plazo que fije el juez (normalmente 48 horas). Si no cumple, procede el incidente de desacato. Si la tutela se niega, se puede impugnar dentro de los tres días siguientes. Todos los fallos van a la Corte Constitucional para eventual revisión.']
  ];
  GUIAS.push({
    ruta: '/accion-de-tutela/', titulo: 'Derecho de tutela en Colombia: qué es, requisitos, plazos y cómo presentarla sin abogado',
    descripcion: 'Qué es la acción de tutela (artículo 86 de la Constitución), qué derechos protege, cuándo procede y cuándo no, plazos (fallo en 10 días, impugnación en 3), contra quién se presenta y plantillas gratis para hacerla en línea.',
    jsonld: [faqLd(faq)],
    cuerpo: `<article>
      <p class="eyebrow">Guía · Acción de tutela</p>
      <h1>El derecho de tutela en Colombia</h1>
      <p class="resumen">La acción de tutela es la herramienta más poderosa que tiene una persona en Colombia para defender sus derechos: cualquier juez, en cualquier lugar, en máximo diez días, sin abogado y sin costo. Esta guía explica cómo funciona y enlaza a las plantillas para presentarla.</p>
      <p class="cta"><a class="btn btn-primario btn-grande" href="/plantilla-tutela/">Ver las plantillas de tutela</a></p>

      <h2>Qué dice la Constitución</h2>
      <p>El artículo 86 establece que toda persona tiene acción de tutela para reclamar ante los jueces, en todo momento y lugar, mediante un procedimiento preferente y sumario, la protección inmediata de sus derechos constitucionales fundamentales, cuando resulten vulnerados o amenazados por la acción u omisión de cualquier autoridad pública, y en los casos que señala la ley, de particulares. El Decreto 2591 de 1991 la reglamenta.</p>

      <h2>Requisitos de procedencia</h2>
      <ul>
        <li><strong>Legitimación:</strong> la presenta el titular del derecho, su representante o un agente oficioso cuando el afectado no puede hacerlo.</li>
        <li><strong>Subsidiariedad:</strong> no debe existir otro medio judicial eficaz, o debe estar en juego un perjuicio irremediable.</li>
        <li><strong>Inmediatez:</strong> debe presentarse en un plazo razonable desde la vulneración.</li>
        <li><strong>No temeridad:</strong> no haber presentado otra tutela por los mismos hechos y derechos.</li>
      </ul>

      <h2>Plazos que debes conocer</h2>
      <ul>
        <li>Fallo de primera instancia: máximo <strong>10 días</strong>.</li>
        <li>Impugnación: <strong>3 días hábiles</strong> desde la notificación del fallo.</li>
        <li>Fallo de segunda instancia: <strong>20 días</strong>.</li>
        <li>Cumplimiento de la orden: el que fije el juez, normalmente <strong>48 horas</strong>.</li>
      </ul>

      <h2>Las tutelas más presentadas</h2>
      <ul class="relacionados">${lista(['tut_salud_servicio', 'tut_peticion', 'tut_pension', 'tut_salario', 'tut_estabilidad', 'tut_educacion', 'tut_debido_proceso', 'tut_habeas_data', 'tut_servicios_publicos', 'desacato', 'impugnacion'].map(enlace))}</ul>
      ${faqHtml(faq)}
      <p>Más: <a href="/tutela-eps/">cómo hacer una tutela a la EPS</a> · <a href="/ejemplo-derecho-de-peticion/">ejemplo de derecho de petición</a> · <a href="/plantillas/">todas las plantillas</a>.</p>
    </article>`
  });
}

/* ---------- Índice de plantillas ---------- */
const ordenTipos = ['tutela', 'peticion', 'queja', 'habeas', 'recurso', 'desacato', 'impugnacion', 'familia', 'denuncia', 'contrato'];
const INDICE = {
  ruta: '/plantillas/', titulo: `Plantillas legales gratis para Colombia: ${casos.length} modelos de tutela, derecho de petición, quejas, denuncias y contratos`,
  descripcion: `${casos.length} plantillas gratuitas para llenar en línea sin abogado: acciones de tutela, derechos de petición, desacato, recursos, quejas, hábeas data, cuota alimentaria, violencia intrafamiliar, documentos para mujeres y contratos tipo Minerva. En PDF o Word.`,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Plantillas legales gratis', url: SITIO + '/plantillas/', hasPart: casos.map(c => ({ '@type': 'WebPage', name: c.titulo, url: SITIO + rutaCaso(c) })) }],
  cuerpo: `<article>
    <p class="eyebrow">Catálogo</p>
    <h1>Todas las plantillas</h1>
    <p class="resumen">${casos.length} modelos gratuitos que se llenan respondiendo preguntas en lenguaje sencillo. Cada uno redacta el documento con las normas y sentencias correctas y te dice dónde entregarlo y qué hacer si no responden.</p>
    <p>Guías: <a href="/plantilla-tutela/">plantilla de tutela</a> · <a href="/tutela-eps/">tutela a la EPS</a> · <a href="/ejemplo-derecho-de-peticion/">ejemplo de derecho de petición</a> · <a href="/accion-de-tutela/">qué es la acción de tutela</a>.</p>
    ${ordenTipos.map(t => { const tipo = AJ.tipos[t]; const cs = casos.filter(c => c.tipo === t); return cs.length ? `<h2 id="${t}">${esc(tipo.plural)}</h2><p>${esc(tipo.descripcion)}</p><ul class="relacionados">${lista(cs.map(c => `<a href="${rutaCaso(c)}">${esc(c.titulo)}</a>`))}</ul>` : ''; }).join('')}
    <h2 id="mujer">Módulo: mujeres y madres cabeza de familia</h2>
    <ul class="relacionados">${lista(casos.filter(c => c.modulo === 'mujer').map(c => `<a href="${rutaCaso(c)}">${esc(c.titulo)}</a>`))}</ul>
  </article>`
};

/* ---------- Escribir todo ---------- */
const urls = [];
casos.forEach(c => { const p = paginaCaso(c); escribir(p.ruta + 'index.html', p.html); urls.push(p.ruta); });
GUIAS.forEach(g => { escribir(g.ruta + 'index.html', pagina({ ...g, migas: [{ nombre: g.titulo.split(':')[0], ruta: g.ruta }] })); urls.push(g.ruta); });
escribir(INDICE.ruta + 'index.html', pagina({ ...INDICE, migas: [{ nombre: 'Plantillas', ruta: '/plantillas/' }] })); urls.push(INDICE.ruta);

escribir('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [['/', '1.0'], ...GUIAS.map(g => [g.ruta, '0.9']), ['/plantillas/', '0.8'], ...casos.map(c => [rutaCaso(c), '0.7'])].map(([u, p]) => `  <url><loc>${SITIO}${u}</loc><lastmod>${HOY}</lastmod><priority>${p}</priority></url>`).join('\n') + '\n</urlset>\n');
escribir('robots.txt', `User-agent: *\nAllow: /\nDisallow: /herramientas/\n\nSitemap: ${SITIO}/sitemap.xml\n`);
escribir('llms.txt', `# Asesor Jurídico Ciudadano (midefensor.org)\n\n> Plataforma gratuita de la Fundación La Sueñomotora para que cualquier persona en Colombia redacte documentos legales (acciones de tutela, derechos de petición, desacatos, recursos, quejas, hábeas data, denuncias, solicitudes de familia, documentos para mujeres y madres cabeza de familia y contratos) respondiendo preguntas en lenguaje común. Sin abogado, sin registro, sin enviar datos a ningún servidor; funciona también sin internet. No presta asesoría jurídica.\n\nCada plantilla cita normas y sentencias de la Corte Constitucional vigentes y explica dónde radicar el documento, los plazos de respuesta y qué hacer si no responden.\n\n## Guías\n${GUIAS.map(g => `- [${g.titulo}](${SITIO}${g.ruta})`).join('\n')}\n- [Índice de las ${casos.length} plantillas](${SITIO}/plantillas/)\n\n## Plantillas\n${casos.map(c => `- [${c.titulo}](${SITIO}${rutaCaso(c)}): ${c.resumen}`).join('\n')}\n\n## Uso de la aplicación\n- Aplicación: ${SITIO}/ (rutas internas con #, por ejemplo ${SITIO}/#caso/tut_salud_servicio)\n- Versión sin internet (un solo archivo): ${SITIO}/descargas/asesor-juridico-ciudadano-sin-internet.html\n- Código abierto: https://github.com/santiagodiezrestrepo/asesor-juridico-ciudadano\n`);
console.log(`Generadas ${urls.length} páginas estáticas, sitemap.xml, robots.txt y llms.txt.`);
