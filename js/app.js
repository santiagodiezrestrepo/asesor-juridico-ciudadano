/* ============================================================
   app.js — Interfaz: navegación, formularios en lenguaje común,
   vista previa, exportación, documentos guardados y guía.
   ============================================================ */
window.AJ = window.AJ || {};

(function () {
  const R = AJ.red;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = s => AJ.motor.esc(s);

  const estado = { caso: null, datos: {}, generado: null, idGuardado: null, filtros: { tipo: '', categoria: '', q: '' } };
  let temporizador = null;

  /* ---------- Iconos (SVG en línea) ---------- */
  const ICONOS = {
    carta: '<path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>',
    balanza: '<path d="M12 3v18M5 21h14M3 8l9-2 9 2"/><path d="M3 8l3 7a3 3 0 0 0 6 0L9 8M15 8l3 7a3 3 0 0 0 6 0l-3-7" transform="translate(-3 0)"/>',
    martillo: '<path d="m14 4 6 6-4 4-6-6zM11 11l-8 8 2 2 8-8M4 21h8"/>',
    flecha: '<path d="M7 17 17 7M8 7h9v9"/>',
    documento: '<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5M9 13h7M9 17h7"/>',
    alerta: '<path d="M12 3 2 21h20zM12 10v5M12 18v.5"/>',
    escudo: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
    familia: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M14 21v-1a4 4 0 0 1 4-4h1a3 3 0 0 1 3 3v2"/>',
    edificio: '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2"/>',
    bandera: '<path d="M5 22V3M5 3h13l-3 4 3 4H5"/>',
    salud: '<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="3"/>',
    pension: '<circle cx="9" cy="9" r="6"/><path d="M15 9a6 6 0 1 1-6 6M7 9h4M9 7v4"/>',
    trabajo: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 12h18"/>',
    servicios: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    banco: '<path d="M3 10h18L12 3zM5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/>',
    educacion: '<path d="M2 7 12 3l10 4-10 4z"/><path d="M6 9v5c0 2 3 3 6 3s6-1 6-3V9M22 7v6"/>',
    persona: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    imprimir: '<path d="M6 9V3h12v6M6 17H3v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6h-3M6 14h12v7H6z"/>',
    copiar: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    descargar: '<path d="M12 3v12M6 10l6 6 6-6M4 21h16"/>',
    guardar: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3M8 21v-7h8v7"/>',
    editar: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    volver: '<path d="m11 5-7 7 7 7M4 12h16"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
    carpeta: '<path d="M3 6h6l2 2h10v12H3z"/>',
    libro: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
    estrella: '<path d="m12 3 2.8 6 6.2.8-4.5 4.3 1.2 6.4L12 17.5 6.3 20.5l1.2-6.4L3 9.8 9.2 9z"/>'
  };
  function icono(n, cls) { return `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[n] || ICONOS.documento}</svg>`; }

  /* ---------- Utilidades ---------- */
  function normalizar(s) { return (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function hoyISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

  const almacen = {
    leer(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  function aviso(msg, tipo) {
    const el = $('#aviso');
    el.textContent = msg; el.className = `aviso visible ${tipo || ''}`;
    clearTimeout(el._t); el._t = setTimeout(() => { el.className = 'aviso'; }, 3500);
  }

  function descargar(nombre, contenido, mime) {
    const blob = new Blob([contenido], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = nombre; document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
  }

  function nombreArchivo(ext) {
    const base = `${AJ.tipos[estado.caso.tipo].nombre} - ${estado.datos.entidadNombre || estado.caso.titulo}`.replace(/[^\w\sáéíóúñÁÉÍÓÚÑ-]/g, '').trim().slice(0, 70);
    return `${base}.${ext}`;
  }

  /* ---------- Búsqueda de casos ---------- */
  function buscarCasos(q, tipo, categoria) {
    const terminos = normalizar(q).split(/\s+/).filter(t => t.length > 2);
    return AJ.casos.map(c => {
      if (tipo && c.tipo !== tipo) return null;
      if (categoria && c.categoria !== categoria) return null;
      let puntos = 0;
      if (terminos.length) {
        const texto = normalizar([c.titulo, c.resumen, (c.palabras || []).join(' '), AJ.tipos[c.tipo].nombre, AJ.entidades.categoria(c.categoria).nombre].join(' '));
        const tit = normalizar(c.titulo);
        terminos.forEach(t => { if (tit.includes(t)) puntos += 3; else if (texto.includes(t)) puntos += 1; });
        if (!puntos) return null;
      }
      return { c, puntos };
    }).filter(Boolean).sort((a, b) => b.puntos - a.puntos).map(x => x.c);
  }

  /* ---------- Navegación ---------- */
  function ir(hash) { location.hash = hash; }
  function ruta() {
    const h = location.hash.replace(/^#\/?/, '');
    const [vista, ...resto] = h.split('/');
    return { vista: vista || 'inicio', arg: resto.join('/') };
  }

  function render() {
    const { vista, arg } = ruta();
    const main = $('#app');
    window.scrollTo({ top: 0 });
    $$('.nav a').forEach(a => a.classList.toggle('activo', a.getAttribute('href') === `#${vista}`));
    switch (vista) {
      case 'catalogo': vistaCatalogo(main, arg); break;
      case 'caso': vistaCaso(main, arg); break;
      case 'documento': vistaDocumento(main); break;
      case 'mis-documentos': vistaMisDocumentos(main); break;
      case 'guia': vistaGuia(main, arg); break;
      case 'acerca': vistaAcerca(main); break;
      default: vistaInicio(main);
    }
  }

  /* ---------- Vista: inicio ---------- */
  function tarjetaCaso(c) {
    const t = AJ.tipos[c.tipo];
    return `<a class="tarjeta caso" href="#caso/${c.id}">
      <div class="tarjeta-tipo tipo-${c.tipo}">${icono(t.icono)}<span>${esc(t.nombre)}</span></div>
      <h3>${esc(c.titulo)}</h3>
      <p>${esc(c.resumen)}</p>
      <div class="tarjeta-pie"><span class="chip">${esc(AJ.entidades.categoria(c.categoria).nombre)}</span>${c.guia && c.guia.plazo ? `<span class="chip chip-plazo">${icono('calendario')} ${esc(plazoCorto(c))}</span>` : ''}</div>
    </a>`;
  }
  function plazoCorto(c) {
    const p = c.guia.plazo;
    if (p.meses) return `${p.meses} meses`;
    if (c.tipo === 'tutela') return 'Fallo en 10 días';
    return `${p.dias} días ${p.tipo === 'habiles' ? 'hábiles' : ''}`.trim();
  }

  function vistaInicio(main) {
    const tipos = Object.values(AJ.tipos);
    const populares = ['tut_salud_servicio', 'tut_peticion', 'pet_eps_servicio', 'pet_municipio_planeacion', 'pet_pension', 'pet_spd', 'tut_estabilidad', 'hd_reclamo'].map(id => AJ.casos.find(c => c.id === id)).filter(Boolean);
    main.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Gratis · Sin abogado · Tus datos no salen de tu dispositivo</p>
        <h1>Defiende tus derechos con un documento legal bien hecho</h1>
        <p class="hero-texto">Escoge tu situación, responde preguntas en lenguaje sencillo y obtén un derecho de petición, una tutela o el documento que necesites, con el lenguaje jurídico y las normas correctas. Listo para imprimir o enviar.</p>
        <form class="buscador" id="buscador-inicio" role="search">
          ${icono('buscar')}
          <input type="search" id="q-inicio" placeholder="Escribe tu problema: &quot;la EPS no me da el medicamento&quot;, &quot;me reportaron en Datacrédito&quot;, &quot;no me pagan&quot;…" aria-label="Describe tu problema">
          <button type="submit" class="btn btn-primario">Buscar</button>
        </form>
        <div id="resultados-inicio" class="resultados-inicio"></div>
      </section>

      <section class="seccion">
        <div class="seccion-cab"><h2>¿Qué documento necesitas?</h2><p>Si no estás seguro, usa el buscador o la <a href="#guia/decidir">guía para decidir</a>.</p></div>
        <div class="grid-tipos">
          ${tipos.map(t => `<a class="tarjeta tipo" href="#catalogo/${t.id}"><div class="tarjeta-tipo tipo-${t.id}">${icono(t.icono)}</div><h3>${esc(t.nombre)}</h3><p>${esc(t.descripcion)}</p><span class="contador">${(n => `${n} ${n === 1 ? 'caso prediseñado' : 'casos prediseñados'}`)(AJ.casos.filter(c => c.tipo === t.id).length)}</span></a>`).join('')}
        </div>
      </section>

      <section class="seccion">
        <div class="seccion-cab"><h2>¿A quién le vas a escribir?</h2><p>Los casos se organizan según la entidad: así sabrás qué pedir, qué norma citar y ante qué juez iría una tutela.</p></div>
        <div class="grid-categorias">
          ${AJ.entidades.categorias.map(c => `<a class="categoria" href="#catalogo/todos/${c.id}">${icono(c.icono)}<div><strong>${esc(c.nombre)}</strong><span>${esc(c.descripcion)}</span></div></a>`).join('')}
        </div>
      </section>

      <section class="seccion">
        <div class="seccion-cab"><h2>Los casos más frecuentes en Colombia</h2><p>En 2025 se presentaron más de 430.000 tutelas por derecho de petición y casi 380.000 por salud. Estos son los documentos que más personas necesitan.</p></div>
        <div class="grid-casos">${populares.map(tarjetaCaso).join('')}</div>
      </section>

      <section class="seccion como">
        <div class="seccion-cab"><h2>Cómo funciona</h2></div>
        <ol class="pasos">
          <li><strong>Escoge tu caso.</strong> Busca por problema, por tipo de documento o por entidad.</li>
          <li><strong>Responde en tus palabras.</strong> Quién eres (o anónimo), a quién le escribes y qué pasó. Sin términos legales.</li>
          <li><strong>Revisa el documento.</strong> La plataforma redacta hechos, fundamentos de derecho con las normas y sentencias, y peticiones.</li>
          <li><strong>Imprime o envía.</strong> Descárgalo en Word, guárdalo en PDF o cópialo. La guía te dice dónde radicarlo y cuándo vence el plazo.</li>
        </ol>
      </section>

      <section class="seccion nota-legal">
        <h2>Importante</h2>
        <p>Esta herramienta genera documentos con base en la Constitución, las leyes y la jurisprudencia vigentes en Colombia, pero no reemplaza la asesoría de un abogado para casos complejos. El derecho de petición, la tutela, el desacato y las solicitudes ante comisarías de familia <strong>no requieren abogado</strong> por mandato legal. Si tu caso es urgente o complicado, acude a la Personería de tu municipio, a la Defensoría del Pueblo o a un consultorio jurídico universitario: son gratuitos.</p>
      </section>`;

    const form = $('#buscador-inicio');
    const caja = $('#resultados-inicio');
    const buscar = () => {
      const q = $('#q-inicio').value.trim();
      if (q.length < 3) { caja.innerHTML = ''; return; }
      const res = buscarCasos(q).slice(0, 6);
      caja.innerHTML = res.length ? `<div class="grid-casos">${res.map(tarjetaCaso).join('')}</div><p class="ver-mas"><a href="#catalogo/todos/todos/${encodeURIComponent(q)}">Ver todos los resultados</a></p>` : `<p class="sin-resultados">No encontramos un caso con esas palabras. Prueba con otras (por ejemplo, el nombre de la entidad o del trámite) o usa la <a href="#caso/pet_general">petición general</a> o la <a href="#caso/tut_general">tutela general</a>.</p>`;
    };
    form.addEventListener('submit', e => { e.preventDefault(); buscar(); });
    $('#q-inicio').addEventListener('input', () => { clearTimeout(temporizador); temporizador = setTimeout(buscar, 250); });
  }

  /* ---------- Vista: catálogo ---------- */
  function vistaCatalogo(main, arg) {
    const [tipo = '', categoria = '', q = ''] = arg.split('/');
    estado.filtros = { tipo: tipo === 'todos' ? '' : tipo, categoria: categoria === 'todos' ? '' : categoria, q: decodeURIComponent(q || '') };
    const dibujar = () => {
      const f = estado.filtros;
      const res = buscarCasos(f.q, f.tipo, f.categoria);
      $('#lista-casos').innerHTML = res.length ? res.map(tarjetaCaso).join('') : `<p class="sin-resultados">No hay casos con esos filtros. Prueba quitando alguno o usa la <a href="#caso/pet_general">petición general</a>.</p>`;
      $('#conteo').textContent = `${res.length} ${res.length === 1 ? 'caso' : 'casos'}`;
      $$('.chips .chip').forEach(ch => ch.classList.toggle('activo', ch.dataset.tipo === f.tipo));
    };
    main.innerHTML = `
      <section class="seccion">
        <div class="seccion-cab"><h1>Catálogo de casos</h1><p>Cada caso es una plantilla con preguntas en lenguaje común y fundamentos jurídicos ya redactados.</p></div>
        <div class="filtros">
          <div class="buscador compacto">${icono('buscar')}<input type="search" id="q-cat" value="${esc(estado.filtros.q)}" placeholder="Buscar por problema, entidad o palabra clave" aria-label="Buscar"></div>
          <select id="cat-cat" aria-label="Tipo de entidad"><option value="">Todas las entidades</option>${AJ.entidades.categorias.map(c => `<option value="${c.id}" ${c.id === estado.filtros.categoria ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}</select>
        </div>
        <div class="chips" role="tablist">
          <button class="chip" data-tipo="">Todos</button>
          ${Object.values(AJ.tipos).map(t => `<button class="chip" data-tipo="${t.id}">${esc(t.nombre)}</button>`).join('')}
        </div>
        <p class="conteo" id="conteo"></p>
        <div class="grid-casos" id="lista-casos"></div>
      </section>`;
    $('#q-cat').addEventListener('input', e => { estado.filtros.q = e.target.value; clearTimeout(temporizador); temporizador = setTimeout(dibujar, 200); });
    $('#cat-cat').addEventListener('change', e => { estado.filtros.categoria = e.target.value; dibujar(); });
    $$('.chips .chip').forEach(ch => ch.addEventListener('click', () => { estado.filtros.tipo = ch.dataset.tipo; dibujar(); }));
    dibujar();
  }

  /* ---------- Formulario ---------- */
  function camposDelCaso(caso) {
    const tipo = AJ.tipos[caso.tipo];
    const secciones = [
      { id: 'quien', titulo: '¿Quién presenta el documento?', ayuda: tipo.permiteAnonimo ? 'Puedes hacerlo a tu nombre, en nombre de otra persona o de forma anónima.' : 'La tutela debe identificar a la persona afectada; puedes presentarla en nombre de un familiar que no pueda hacerlo.', campos: AJ.campos.solicitante({ permiteAnonimo: tipo.permiteAnonimo }) },
      { id: 'destino', titulo: ['tutela'].includes(caso.tipo) ? '¿Contra quién va la tutela?' : ['desacato', 'impugnacion'].includes(caso.tipo) ? '¿Contra qué entidad fue la tutela?' : '¿A quién va dirigido?', ayuda: 'Escribe el nombre como aparece en sus documentos o su página web. Empieza a escribir y te sugerimos entidades conocidas.', campos: AJ.campos.destinatario(caso.destinatario || {}) },
      { id: 'situacion', titulo: 'Tu situación', ayuda: 'Responde con tus palabras. Lo que escribas se convertirá en hechos numerados dentro del documento.', campos: caso.campos }
    ];
    if (caso.tipo === 'tutela') {
      const der = { id: 'derechos', tipo: 'checks', etiqueta: 'Derechos que te están vulnerando (ya marcamos los habituales para este caso)', opciones: caso.derechos || [] };
      const extra = [];
      if ((caso.derechos || []).length) extra.push(der);
      extra.push(...AJ.campos.tutelaExtra());
      secciones.push({ id: 'tutela', titulo: 'Derechos, urgencia y juramento', ayuda: 'El juez necesita saber qué derechos proteger y si debe actuar antes del fallo.', campos: extra });
    }
    secciones.push({ id: 'pide', titulo: caso.tipo === 'tutela' ? '¿Qué quieres que ordene el juez?' : '¿Qué pides?', ayuda: 'Marca las peticiones que apliquen. Las que están bloqueadas son necesarias para este tipo de documento.', campos: [
      { id: 'peticiones', tipo: 'checks', etiqueta: 'Peticiones', opciones: caso.peticiones || [] },
      { id: 'peticionOtra', tipo: 'textarea', etiqueta: '¿Algo más que quieras pedir? (opcional, una petición por línea)', filas: 2 }
    ] });
    secciones.push({ id: 'anexos', titulo: 'Pruebas y documentos que vas a anexar', ayuda: 'Marca lo que tengas. No necesitas tenerlo todo: anexa lo que puedas y explica lo demás en el relato.', campos: [
      { id: 'anexos', tipo: 'checks', etiqueta: 'Anexos', opciones: caso.anexos || [] },
      { id: 'anexosOtros', tipo: 'textarea', etiqueta: 'Otros documentos (opcional, uno por línea)', filas: 2 }
    ] });
    return secciones;
  }

  function valorInicialCampo(c) {
    if (c.tipo === 'checks') return (c.opciones || []).filter(o => o.inicial || o.fijo).map(o => o.v);
    if (c.valorInicial !== undefined) return c.valorInicial;
    if (c.tipo === 'radio' && c.opciones && c.opciones.length) return c.opciones[0].v;
    return '';
  }

  function inicializarDatos(caso, previos) {
    const datos = {};
    camposDelCaso(caso).forEach(s => s.campos.forEach(c => { if (c.tipo !== 'info') datos[c.id] = valorInicialCampo(c); }));
    if (caso.destinatario) {
      if (caso.destinatario.nombre) datos.entidadNombre = caso.destinatario.nombre;
      if (caso.destinatario.cargo) datos.entidadCargo = caso.destinatario.cargo;
      datos.categoria = caso.destinatario.categoria || caso.categoria;
    }
    const mios = almacen.leer('aj_misdatos', null);
    if (mios && !previos) ['nombre', 'genero', 'tipoDoc', 'numDoc', 'expedidaEn', 'ciudad', 'direccion', 'telefono', 'correo'].forEach(k => { if (mios[k]) datos[k] = mios[k]; });
    if (previos) Object.assign(datos, previos);
    return datos;
  }

  function visible(c, datos) {
    if (c.mostrarSi) { const v = datos[c.mostrarSi.campo]; if (!(Array.isArray(v) ? v.includes(c.mostrarSi.valor) : v === c.mostrarSi.valor)) return false; }
    if (c.ocultarSi) { const v = datos[c.ocultarSi.campo]; if (Array.isArray(v) ? v.includes(c.ocultarSi.valor) : v === c.ocultarSi.valor) return false; }
    return true;
  }

  function renderCampo(c, datos) {
    const v = datos[c.id];
    const req = c.requerido ? '<span class="req" title="Obligatorio">*</span>' : '';
    const ayuda = c.ayuda ? `<p class="ayuda">${esc(c.ayuda)}</p>` : '';
    let control = '';
    switch (c.tipo) {
      case 'info': return `<div class="campo info" data-id="${c.id}" ${visible(c, datos) ? '' : 'hidden'}>${icono('info')}<p>${esc(c.texto)}</p></div>`;
      case 'textarea': control = `<textarea id="f-${c.id}" name="${c.id}" rows="${c.filas || 4}" placeholder="${esc(c.ejemplo || '')}">${esc(v || '')}</textarea>`; break;
      case 'select': control = `<select id="f-${c.id}" name="${c.id}">${(c.opciones || []).map(o => `<option value="${esc(o.v)}" ${o.v === v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select>`; break;
      case 'radio': control = `<div class="opciones">${(c.opciones || []).map(o => `<label class="opcion"><input type="radio" name="${c.id}" value="${esc(o.v)}" ${o.v === v ? 'checked' : ''}><span>${esc(o.t)}</span></label>`).join('')}</div>`; break;
      case 'checks': control = `<div class="opciones">${(c.opciones || []).map(o => `<label class="opcion ${o.fijo ? 'fijo' : ''}"><input type="checkbox" name="${c.id}" value="${esc(o.v)}" ${(v || []).includes(o.v) ? 'checked' : ''} ${o.fijo ? 'disabled' : ''}><span>${esc(o.t)}</span></label>`).join('')}</div>`; break;
      case 'fecha': control = `<input type="date" id="f-${c.id}" name="${c.id}" value="${esc(v || '')}" max="2100-12-31">`; break;
      default: control = `<input type="text" id="f-${c.id}" name="${c.id}" value="${esc(v || '')}" placeholder="${esc(c.ejemplo || '')}" ${c.lista ? `list="lista-${c.lista}"` : ''} autocomplete="off">`;
    }
    const etiqueta = c.tipo === 'radio' || c.tipo === 'checks' ? `<span class="etiqueta">${esc(c.etiqueta)}${req}</span>` : `<label class="etiqueta" for="f-${c.id}">${esc(c.etiqueta)}${req}</label>`;
    return `<div class="campo ${c.ancho === 'media' ? 'media' : 'completa'}" data-id="${c.id}" ${visible(c, datos) ? '' : 'hidden'}>${etiqueta}${control}${ayuda}<p class="error" hidden>Este dato es necesario.</p></div>`;
  }

  function vistaCaso(main, id) {
    const caso = AJ.casos.find(c => c.id === id);
    if (!caso) { main.innerHTML = '<section class="seccion"><p>No encontramos ese caso. <a href="#catalogo">Volver al catálogo</a>.</p></section>'; return; }
    const tipo = AJ.tipos[caso.tipo];
    if (!estado.caso || estado.caso.id !== caso.id) { estado.caso = caso; estado.datos = inicializarDatos(caso); estado.idGuardado = null; estado.generado = null; }
    const secciones = camposDelCaso(caso);
    const todosCampos = secciones.flatMap(s => s.campos);
    main.innerHTML = `
      <section class="seccion caso-cab">
        <a class="volver" href="#catalogo/${caso.tipo}">${icono('volver')} Volver a ${esc(tipo.plural.toLowerCase())}</a>
        <div class="tarjeta-tipo tipo-${caso.tipo}">${icono(tipo.icono)}<span>${esc(tipo.nombre)}</span></div>
        <h1>${esc(caso.titulo)}</h1>
        <p class="resumen">${esc(caso.resumen)}</p>
        ${caso.guia && caso.guia.nota ? `<div class="nota">${icono('info')}<p>${esc(caso.guia.nota)}</p></div>` : ''}
      </section>
      <div class="layout-form">
        <form id="formulario" class="formulario" novalidate>
          ${secciones.map((s, i) => `<fieldset class="bloque" id="sec-${s.id}"><legend><span class="num">${i + 1}</span>${esc(s.titulo)}</legend><p class="bloque-ayuda">${esc(s.ayuda)}</p><div class="campos">${s.campos.map(c => renderCampo(c, estado.datos)).join('')}</div></fieldset>`).join('')}
          <div class="acciones-form">
            <label class="opcion recordar"><input type="checkbox" id="recordar" ${almacen.leer('aj_misdatos', null) ? 'checked' : ''}><span>Recordar mis datos personales en este dispositivo</span></label>
            <button type="submit" class="btn btn-primario btn-grande">${icono('documento')} Generar documento</button>
          </div>
        </form>
        <aside class="previa" id="previa"><div class="previa-cab"><strong>Vista previa</strong><span>Se actualiza mientras escribes</span></div><div class="hoja" id="hoja-previa"></div></aside>
      </div>`;

    const form = $('#formulario');
    const actualizarVisibilidad = () => { todosCampos.forEach(c => { const el = form.querySelector(`.campo[data-id="${c.id}"]`); if (el) el.hidden = !visible(c, estado.datos); }); };
    const previa = () => { clearTimeout(temporizador); temporizador = setTimeout(() => { try { estado.generado = AJ.motor.generar(caso, estado.datos); $('#hoja-previa').innerHTML = estado.generado.html; } catch (e) { console.error(e); } }, 350); };

    form.addEventListener('input', e => leer(e.target));
    form.addEventListener('change', e => leer(e.target));
    function leer(t) {
      if (!t.name) return;
      const c = todosCampos.find(x => x.id === t.name);
      if (!c) return;
      if (c.tipo === 'checks') estado.datos[t.name] = $$(`input[name="${t.name}"]`, form).filter(i => i.checked).map(i => i.value);
      else if (c.tipo === 'radio') { if (t.checked) estado.datos[t.name] = t.value; }
      else estado.datos[t.name] = t.value;
      if (t.name === 'entidadNombre') { const cat = AJ.entidades.categoriaDeNombre(t.value); if (cat) { estado.datos.categoria = cat; const sel = $('#f-categoria', form); if (sel) sel.value = cat; } }
      const wrap = t.closest('.campo'); if (wrap) { wrap.classList.remove('invalido'); const err = $('.error', wrap); if (err) err.hidden = true; }
      actualizarVisibilidad(); previa();
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const faltan = todosCampos.filter(c => c.requerido && visible(c, estado.datos) && c.tipo !== 'info').filter(c => { const v = estado.datos[c.id]; return Array.isArray(v) ? !v.length : !(v && String(v).trim()); });
      $$('.campo.invalido', form).forEach(el => { el.classList.remove('invalido'); $('.error', el).hidden = true; });
      if (faltan.length) {
        faltan.forEach(c => { const el = form.querySelector(`.campo[data-id="${c.id}"]`); if (el) { el.classList.add('invalido'); $('.error', el).hidden = false; } });
        const primero = form.querySelector('.campo.invalido'); if (primero) primero.scrollIntoView({ behavior: 'smooth', block: 'center' });
        aviso(`Faltan ${faltan.length} ${faltan.length === 1 ? 'dato obligatorio' : 'datos obligatorios'} (marcados en rojo).`, 'error');
        return;
      }
      if ($('#recordar').checked) {
        const m = {}; ['nombre', 'genero', 'tipoDoc', 'numDoc', 'expedidaEn', 'ciudad', 'direccion', 'telefono', 'correo'].forEach(k => { if (estado.datos[k]) m[k] = estado.datos[k]; });
        almacen.guardar('aj_misdatos', m);
      } else { try { localStorage.removeItem('aj_misdatos'); } catch (x) {} }
      estado.generado = AJ.motor.generar(caso, estado.datos);
      ir('documento');
    });
    previa();
  }

  /* ---------- Vista: documento ---------- */
  function calcularPlazo(caso, desdeISO) {
    const p = caso.guia && caso.guia.plazo; if (!p) return null;
    const desde = AJ.festivos.parseISO(desdeISO) || R.hoy();
    let vence, texto;
    if (p.meses) { vence = AJ.festivos.sumarMeses(desde, p.meses); texto = `${p.meses} meses`; }
    else if (p.tipo === 'habiles' || caso.tipo === 'tutela') { vence = AJ.festivos.sumarDiasHabiles(desde, p.dias); texto = `${p.dias} días hábiles`; }
    else { vence = AJ.festivos.sumarDias(desde, p.dias); texto = `${p.dias} días`; }
    const festivos = [];
    let f = new Date(desde); while (f < vence) { f = AJ.festivos.sumarDias(f, 1); const n = AJ.festivos.nombreFestivo(f); if (n) festivos.push(`${R.fechaLarga(f)} (${n})`); }
    return { vence, texto, festivos };
  }

  function vistaDocumento(main) {
    if (!estado.caso || !estado.generado) { ir('catalogo'); return; }
    const caso = estado.caso, tipo = AJ.tipos[caso.tipo], d = estado.datos;
    const cat = AJ.entidades.categoria(d.categoria);
    const advertencias = [];
    if (d.modo === 'anonimo') advertencias.push('Presentaste el documento de forma anónima: la entidad puede pedir identificación para resolver asuntos personales. Para quejas de interés general el anonimato es válido si aportas pruebas.');
    if (caso.tipo === 'tutela' && d.otraTutela === 'si') advertencias.push('Indicaste que ya presentaste otra tutela por los mismos hechos. Si ganaste y no cumplen, usa el incidente de desacato; si la perdiste, solo puedes volver a presentarla con hechos nuevos.');
    if (caso.tipo === 'tutela' && d.yaPedi === 'no' && ['tut_peticion'].includes(caso.id)) advertencias.push('Para esta tutela es indispensable anexar la prueba de que radicaste el derecho de petición.');
    if (caso.id === 'tut_habeas_data' && d.reclamo === 'no') advertencias.push('Antes de la tutela por hábeas data debes presentar el reclamo a la entidad y esperar 15 días hábiles.');

    main.innerHTML = `
      <section class="seccion doc-cab">
        <a class="volver" href="#caso/${caso.id}">${icono('volver')} Volver a editar</a>
        <h1>${esc(tipo.nombre)} lista para ${caso.tipo === 'tutela' ? 'radicar' : 'enviar'}</h1>
        <p class="resumen">Revisa el texto. Puedes volver a editar, imprimirlo, guardarlo como PDF, descargarlo en Word o copiarlo.</p>
        <div class="acciones">
          <button class="btn btn-primario" id="b-imprimir">${icono('imprimir')} Imprimir / Guardar PDF</button>
          <button class="btn" id="b-word">${icono('descargar')} Descargar Word</button>
          <button class="btn" id="b-txt">${icono('descargar')} Descargar texto</button>
          <button class="btn" id="b-copiar">${icono('copiar')} Copiar texto</button>
          <button class="btn" id="b-guardar">${icono('guardar')} ${estado.idGuardado ? 'Actualizar en mis documentos' : 'Guardar en mis documentos'}</button>
        </div>
        ${advertencias.map(a => `<div class="nota alerta">${icono('alerta')}<p>${esc(a)}</p></div>`).join('')}
      </section>
      <div class="layout-doc">
        <div class="hoja hoja-final" id="hoja">${estado.generado.html}</div>
        <aside class="guia-lateral">
          <h2>${icono('estrella')} ¿Qué sigue?</h2>
          <div class="guia-bloque">
            <h3>1. Firma y prepara</h3>
            <ul>
              <li>Imprime o guarda el PDF y <strong>firma</strong> donde está la línea (si lo envías por correo, basta con escribir tu nombre; la Ley 2213 de 2022 no exige firma manuscrita en trámites judiciales).</li>
              <li>Anexa copia de tu cédula y los documentos marcados.</li>
              <li>Guarda una copia completa para ti.</li>
            </ul>
          </div>
          <div class="guia-bloque">
            <h3>2. Dónde presentarlo</h3>
            ${dondeRadicar(caso, d, cat)}
          </div>
          <div class="guia-bloque">
            <h3>3. Plazo para que respondan</h3>
            <label class="etiqueta" for="fecha-radicacion">Fecha en que lo radicas</label>
            <input type="date" id="fecha-radicacion" value="${hoyISO()}">
            <div id="plazo-resultado" class="plazo"></div>
          </div>
          <div class="guia-bloque">
            <h3>4. Si no responden o no cumplen</h3>
            <p>${esc(caso.guia && caso.guia.siNoResponden || 'Puedes presentar una acción de tutela por violación del derecho de petición.')}</p>
            ${enlacesSiguientes(caso)}
          </div>
          <div class="guia-bloque">
            <h3>Checklist de anexos</h3>
            <ul class="checklist">${(d.anexos || []).map(v => { const o = (caso.anexos || []).find(x => x.v === v); return o ? `<li><label class="opcion"><input type="checkbox"><span>${esc(o.t)}</span></label></li>` : ''; }).join('')}${R.relatoAHechos(d.anexosOtros).map(t => `<li><label class="opcion"><input type="checkbox"><span>${esc(t)}</span></label></li>`).join('')}</ul>
          </div>
        </aside>
      </div>`;

    const pintarPlazo = () => {
      const r = calcularPlazo(caso, $('#fecha-radicacion').value);
      if (!r) { $('#plazo-resultado').innerHTML = ''; return; }
      $('#plazo-resultado').innerHTML = `<p><strong>${esc(r.texto)}</strong> → vence el <strong>${esc(R.fechaLarga(r.vence))}</strong>.</p>${r.festivos.length ? `<p class="ayuda">No se cuentan sábados, domingos ni festivos: ${esc(r.festivos.join('; '))}.</p>` : ''}${caso.tipo === 'tutela' ? '<p class="ayuda">El juez tiene máximo 10 días para fallar y la entidad 48 horas para cumplir la orden (salvo que el fallo diga otra cosa).</p>' : ''}`;
    };
    $('#fecha-radicacion').addEventListener('change', pintarPlazo); pintarPlazo();

    $('#b-imprimir').addEventListener('click', () => window.print());
    $('#b-word').addEventListener('click', () => descargar(nombreArchivo('doc'), '﻿' + AJ.motor.aWord(estado.generado.html, tipo.titulo), 'application/msword'));
    $('#b-txt').addEventListener('click', () => descargar(nombreArchivo('txt'), '﻿' + estado.generado.texto, 'text/plain;charset=utf-8'));
    $('#b-copiar').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(estado.generado.texto); aviso('Texto copiado. Pégalo en un correo o en Word.', 'ok'); }
      catch (e) { const r = document.createRange(); r.selectNodeContents($('#hoja')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); aviso('Selecciona y copia el texto con Ctrl+C.', ''); }
    });
    $('#b-guardar').addEventListener('click', () => {
      const lista = almacen.leer('aj_documentos', []);
      const reg = { id: estado.idGuardado || `doc_${Date.now()}`, casoId: caso.id, titulo: `${tipo.nombre} – ${d.entidadNombre || caso.titulo}`, fecha: new Date().toISOString(), datos: estado.datos };
      const i = lista.findIndex(x => x.id === reg.id);
      if (i >= 0) lista[i] = reg; else lista.unshift(reg);
      if (almacen.guardar('aj_documentos', lista)) { estado.idGuardado = reg.id; $('#b-guardar').innerHTML = `${icono('guardar')} Actualizar en mis documentos`; aviso('Guardado en "Mis documentos" (solo en este navegador).', 'ok'); }
      else aviso('No se pudo guardar: el navegador bloqueó el almacenamiento.', 'error');
    });
  }

  function dondeRadicar(caso, d, cat) {
    const E = esc(d.entidadNombre || 'la entidad');
    if (caso.tipo === 'tutela') return `<ul>
      <li><strong>Por internet:</strong> <a href="https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea" target="_blank" rel="noopener">Tutela en Línea</a> (Rama Judicial), gratis y las 24 horas. Sube el PDF firmado y los anexos.</li>
      <li><strong>Presencial:</strong> Oficina Judicial de Reparto de ${esc(d.entidadCiudad || d.ciudad || 'tu ciudad')} (en el palacio de justicia). Lleva original y una copia.</li>
      <li>Según las reglas de reparto, por ser ${esc(cat.nombre.toLowerCase())}, le corresponde a un <strong>${esc(R.juezTutela(d).replace(' (REPARTO)', '').toLowerCase())}</strong>; el sistema la asigna automáticamente y ningún juez puede rechazarla por reparto.</li>
      <li>Si necesitas ayuda, la <strong>Personería</strong> de tu municipio la presenta contigo, gratis.</li></ul>`;
    if (caso.tipo === 'desacato' || caso.tipo === 'impugnacion') return `<ul><li>Ante el <strong>mismo juzgado</strong> que falló la tutela: ${esc(d.juzgado || '')}. Envíalo al correo institucional del despacho (búscalo en www.ramajudicial.gov.co) citando el radicado, o radícalo en la secretaría del juzgado.</li>${caso.tipo === 'impugnacion' ? '<li>Recuerda: solo tienes <strong>3 días hábiles</strong> desde la notificación.</li>' : ''}</ul>`;
    if (caso.tipo === 'familia') return `<ul><li>En la <strong>Comisaría de Familia</strong> de tu municipio o localidad (también en Casas de Justicia) o en el Centro Zonal del ICBF. Atienden sin cita en la mayoría de casos.</li><li>Si hay peligro inmediato: Policía 123, Línea 155 (mujeres), Línea 141 (niños).</li></ul>`;
    return `<ul>
      <li><strong>Ventanilla de radicación</strong> de ${E}: lleva dos copias y pide sello de recibido con fecha en la tuya.</li>
      <li><strong>Correo electrónico</strong> de PQRS o de notificaciones de la entidad (en su página web, sección "Atención al ciudadano"). Guarda el correo enviado como prueba.</li>
      <li><strong>Página web</strong>: muchas entidades tienen formulario de PQRS; guarda el número de radicado.</li>
      ${cat.naturaleza !== 'publica' ? '<li>Las empresas privadas también están obligadas a responder (artículos 32 y 33 de la Ley 1755 de 2015).</li>' : ''}</ul>`;
  }

  function enlacesSiguientes(caso) {
    const mapa = { peticion: ['tut_peticion'], queja: ['tut_salud_servicio', 'tut_peticion'], habeas: ['tut_habeas_data'], tutela: ['desacato', 'impugnacion'], desacato: [], impugnacion: [], recurso: ['tut_debido_proceso'], familia: ['tut_general'] };
    const ids = (mapa[caso.tipo] || []).filter(id => id !== caso.id);
    if (!ids.length) return '';
    return `<ul class="enlaces">${ids.map(id => { const c = AJ.casos.find(x => x.id === id); return c ? `<li><a href="#caso/${c.id}">${icono('flecha')} ${esc(c.titulo)}</a></li>` : ''; }).join('')}</ul>`;
  }

  /* ---------- Vista: mis documentos ---------- */
  function vistaMisDocumentos(main) {
    const lista = almacen.leer('aj_documentos', []);
    main.innerHTML = `
      <section class="seccion">
        <div class="seccion-cab"><h1>Mis documentos</h1><p>Se guardan únicamente en este navegador. Nadie más puede verlos. Si borras el historial del navegador, se pierden: exporta una copia.</p></div>
        <div class="acciones">
          <button class="btn" id="b-exportar" ${lista.length ? '' : 'disabled'}>${icono('descargar')} Exportar copia de seguridad</button>
          <label class="btn">${icono('carpeta')} Importar copia <input type="file" id="i-importar" accept="application/json" hidden></label>
        </div>
        ${lista.length ? `<div class="lista-docs">${lista.map(x => { const c = AJ.casos.find(k => k.id === x.casoId); return `<div class="doc-item" data-id="${x.id}"><div><strong>${esc(x.titulo)}</strong><span>${esc(c ? c.titulo : x.casoId)} · ${esc(R.fechaLarga(new Date(x.fecha)))}</span></div><div class="doc-botones"><button class="btn btn-mini" data-accion="abrir">${icono('editar')} Abrir</button><button class="btn btn-mini" data-accion="duplicar">${icono('copiar')} Duplicar</button><button class="btn btn-mini peligro" data-accion="eliminar">Eliminar</button></div></div>`; }).join('')}</div>` : `<p class="sin-resultados">Aún no has guardado documentos. Cuando generes uno, usa el botón "Guardar en mis documentos".</p>`}
      </section>`;
    $('#b-exportar').addEventListener('click', () => descargar(`asesor-juridico-documentos-${hoyISO()}.json`, JSON.stringify(lista, null, 2), 'application/json'));
    $('#i-importar').addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const nuevos = JSON.parse(r.result); if (!Array.isArray(nuevos)) throw new Error(); const actual = almacen.leer('aj_documentos', []); nuevos.forEach(n => { if (n && n.id && n.casoId && n.datos && !actual.some(a => a.id === n.id)) actual.push(n); }); almacen.guardar('aj_documentos', actual); aviso('Documentos importados.', 'ok'); render(); } catch (x) { aviso('El archivo no es una copia válida.', 'error'); } };
      r.readAsText(f);
    });
    $$('.doc-item button').forEach(b => b.addEventListener('click', () => {
      const id = b.closest('.doc-item').dataset.id; const reg = lista.find(x => x.id === id); const caso = AJ.casos.find(c => c.id === reg.casoId);
      if (!caso) { aviso('Ese caso ya no existe en la plataforma.', 'error'); return; }
      if (b.dataset.accion === 'eliminar') { if (!b.dataset.confirmar) { b.dataset.confirmar = '1'; b.textContent = '¿Seguro? Clic de nuevo'; return; } almacen.guardar('aj_documentos', lista.filter(x => x.id !== id)); render(); return; }
      estado.caso = caso; estado.datos = inicializarDatos(caso, reg.datos); estado.idGuardado = b.dataset.accion === 'abrir' ? id : null; estado.generado = AJ.motor.generar(caso, estado.datos);
      ir(`caso/${caso.id}`);
    }));
  }

  /* ---------- Vista: guía ---------- */
  function vistaGuia(main, arg) {
    const decidir = [
      { q: 'Necesito que una entidad me responda, me dé información, copias o un servicio', id: 'pet_general', t: 'Derecho de petición' },
      { q: 'Ya presenté un derecho de petición y no me respondieron en 15 días hábiles', id: 'tut_peticion', t: 'Tutela por derecho de petición' },
      { q: 'La EPS no me da un medicamento, cita, cirugía o examen que ordenó el médico', id: 'tut_salud_servicio', t: 'Tutela por salud (o primero la petición a la EPS)' },
      { q: 'Gané una tutela y la entidad no cumple lo que ordenó el juez', id: 'desacato', t: 'Incidente de desacato' },
      { q: 'Me negaron la tutela y han pasado menos de 3 días', id: 'impugnacion', t: 'Impugnación' },
      { q: 'Me llegó una resolución, multa o decisión en mi contra (menos de 10 días hábiles)', id: 'rec_reposicion', t: 'Recurso de reposición y apelación' },
      { q: 'La factura de agua, luz o gas llegó altísima o me cortaron el servicio', id: 'pet_spd', t: 'Reclamo a la empresa de servicios públicos' },
      { q: 'Me reportaron en Datacrédito o TransUnion injustamente', id: 'hd_reclamo', t: 'Reclamo de hábeas data (y luego tutela)' },
      { q: 'Me despidieron estando embarazada, enferma o con discapacidad', id: 'tut_estabilidad', t: 'Tutela por estabilidad laboral reforzada' },
      { q: 'No me pagan el salario, la liquidación o las incapacidades', id: 'pet_empleador', t: 'Petición al empleador (y luego tutela por mínimo vital)' },
      { q: 'Colpensiones o el fondo no resuelve mi pensión', id: 'pet_pension', t: 'Petición a pensiones (y luego tutela)' },
      { q: 'Un almacén no me responde por la garantía de un producto', id: 'queja_consumidor', t: 'Reclamación directa al vendedor' },
      { q: 'Sufro violencia en mi familia', id: 'fam_proteccion', t: 'Medida de protección' },
      { q: 'El padre o madre de mis hijos no da para su sostenimiento', id: 'fam_alimentos', t: 'Conciliación de cuota alimentaria' },
      { q: 'Tengo un problema del barrio con la alcaldía (vías, basuras, ruido)', id: 'pet_municipio_servicios', t: 'Petición a la alcaldía o querella policiva' }
    ];
    const glosario = [
      ['Accionante / accionado', 'Quien presenta la tutela / la entidad contra la que se presenta.'],
      ['Agente oficioso', 'Persona que presenta la tutela en nombre de otra que no puede hacerlo (enfermo, adulto mayor). Debe decirlo en el escrito.'],
      ['Días hábiles', 'Lunes a viernes, sin festivos. Los plazos de la ley se cuentan así, desde el día siguiente a la radicación.'],
      ['Desacato', 'Trámite para que el juez sancione a quien no cumple una orden de tutela (arresto hasta 6 meses y multa hasta 20 salarios mínimos).'],
      ['Impugnar', 'Pedir que un juez superior revise el fallo. En tutela, 3 días hábiles.'],
      ['Mínimo vital', 'Lo que una persona necesita para vivir dignamente (comida, vivienda, salud). Si te lo quitan, la tutela puede proceder aunque exista otro proceso.'],
      ['Medida provisional', 'Orden urgente que el juez puede dar apenas recibe la tutela, antes de fallar, para evitar un daño grave.'],
      ['Perjuicio irremediable', 'Daño grave e inminente que no se puede reparar después. Permite usar la tutela aunque haya otro camino legal.'],
      ['PQRS', 'Peticiones, quejas, reclamos y sugerencias: la ventanilla por donde las entidades reciben los derechos de petición.'],
      ['Radicar', 'Entregar oficialmente un documento y obtener constancia (sello o número de radicado). Esa constancia es tu prueba.'],
      ['Recurso de reposición / apelación', 'Pedir a la misma entidad que cambie su decisión (reposición) o que la revise el superior (apelación). 10 días hábiles.'],
      ['Silencio administrativo positivo', 'En servicios públicos: si la empresa no responde tu reclamo en 15 días hábiles, se entiende que te dio la razón.'],
      ['Subsidiariedad', 'Regla según la cual la tutela solo procede si no hay otro mecanismo judicial eficaz, o si lo hay pero no sirve frente a la urgencia.'],
      ['Sujeto de especial protección', 'Niños, mujeres embarazadas, adultos mayores, personas con discapacidad o enfermedad grave, víctimas, desplazados. Tienen prioridad y protección reforzada.'],
      ['Tutela', 'Acción rápida ante cualquier juez para proteger derechos fundamentales. Sin abogado, sin costo, fallo en 10 días.']
    ];
    main.innerHTML = `
      <section class="seccion">
        <div class="seccion-cab"><h1>Guía práctica</h1><p>Lo que necesitas saber para usar bien estos documentos.</p></div>
        <nav class="subnav"><a href="#guia/decidir">¿Qué documento necesito?</a><a href="#guia/pasos">Cómo radicar</a><a href="#guia/plazos">Calculadora de plazos</a><a href="#guia/glosario">Glosario</a><a href="#guia/directorio">Dónde pedir ayuda</a></nav>
      </section>
      <section class="seccion" id="decidir"><h2>¿Qué documento necesito?</h2><p>Busca tu situación:</p>
        <div class="decidir">${decidir.map(x => `<a class="decidir-item" href="#caso/${x.id}"><span>${esc(x.q)}</span><strong>${icono('flecha')} ${esc(x.t)}</strong></a>`).join('')}</div>
        <p class="ayuda">Regla general: primero el <strong>derecho de petición</strong> (deja constancia y obliga a responder); si no responden o si hay urgencia de salud o de vida, la <strong>tutela</strong>; si ganas y no cumplen, el <strong>desacato</strong>.</p>
      </section>
      <section class="seccion" id="pasos"><h2>Cómo radicar y qué guardar</h2>
        <ol class="pasos">
          <li><strong>Imprime dos copias</strong> (o guarda el PDF). Firma con tu nombre y número de cédula.</li>
          <li><strong>Radica</strong> en la ventanilla de la entidad y pide que sellen tu copia con fecha y número; o envíalo al correo de PQRS o de notificaciones judiciales (lo encuentras en la página web de la entidad). Guarda el correo enviado.</li>
          <li><strong>Tutelas:</strong> por internet en <a href="https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea" target="_blank" rel="noopener">Tutela en Línea</a> o en la Oficina de Reparto. Te llegará un correo con el juzgado asignado y el radicado; revisa tu correo a diario, incluido el spam.</li>
          <li><strong>Cuenta el plazo</strong> con la calculadora de abajo. Anota la fecha de vencimiento.</li>
          <li><strong>Si no responden</strong>, genera la tutela por derecho de petición anexando tu copia radicada. Si no cumplen un fallo, el incidente de desacato.</li>
          <li><strong>Nunca pagues</strong> por un derecho de petición o una tutela: son gratuitos y no necesitan abogado. La Personería y los consultorios jurídicos te ayudan sin costo.</li>
        </ol>
      </section>
      <section class="seccion" id="plazos"><h2>Calculadora de plazos (días hábiles en Colombia)</h2>
        <div class="calculadora">
          <div class="campo media"><label class="etiqueta" for="c-fecha">Fecha de radicación</label><input type="date" id="c-fecha" value="${hoyISO()}"></div>
          <div class="campo media"><label class="etiqueta" for="c-plazo">Plazo</label><select id="c-plazo">
            <option value="15h">15 días hábiles (petición general)</option><option value="10h">10 días hábiles (documentos e información)</option><option value="30h">30 días hábiles (consultas)</option>
            <option value="10h">10 días hábiles (fallo de tutela / recursos CPACA)</option><option value="3h">3 días hábiles (impugnar tutela)</option><option value="5h">5 días hábiles (recurso servicios públicos)</option>
            <option value="15h">15 días hábiles (reclamo servicios públicos, hábeas data, consumidor)</option><option value="2m">2 meses (pensión de sobrevivientes)</option><option value="4m">4 meses (pensión de vejez o invalidez)</option><option value="60h">60 días hábiles (inclusión en el RUV)</option>
          </select></div>
          <div class="campo completa plazo" id="c-resultado"></div>
        </div>
        <details><summary>Festivos de ${new Date().getFullYear()} que se tienen en cuenta</summary><ul class="festivos">${AJ.festivos.listaAnio(new Date().getFullYear()).lista.map(f => `<li>${esc(R.fechaLarga(f.fecha))} – ${esc(f.nombre)}</li>`).join('')}</ul></details>
      </section>
      <section class="seccion" id="glosario"><h2>Glosario en lenguaje común</h2><dl class="glosario">${glosario.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl></section>
      <section class="seccion" id="directorio"><h2>Dónde pedir ayuda gratuita</h2>
        <div class="directorio">${AJ.entidades.directorio.map(x => `<div class="dir-item"><strong>${esc(x.nombre)}</strong><p>${esc(x.queHace)}</p><span>${esc(x.canal)}</span></div>`).join('')}</div>
      </section>
      <section class="seccion nota-legal"><h2>Fuentes</h2><p>Constitución Política de 1991; Ley 1755 de 2015; Decreto 2591 de 1991; Decreto 1069 de 2015 (reparto de tutelas, modificado por el Decreto 333 de 2021); Ley 1751 de 2015; Ley 100 de 1993; Ley 1266 de 2008 y Ley 2157 de 2021; Ley 142 de 1994; Ley 1437 de 2011; Ley 1480 de 2011; Ley 1328 de 2009; Ley 1098 de 2006; Ley 294 de 1996; Ley 1448 de 2011; Ley 1801 de 2016; Código Sustantivo del Trabajo; sentencias de la Corte Constitucional citadas en cada documento. Cifras de tutelas: Consejo Superior de la Judicatura y Defensoría del Pueblo (2023-2025).</p></section>`;
    const calc = () => {
      const [, n, u] = $('#c-plazo').value.match(/^(\d+)([hm])$/);
      const desde = AJ.festivos.parseISO($('#c-fecha').value) || R.hoy();
      const vence = u === 'm' ? AJ.festivos.sumarMeses(desde, +n) : AJ.festivos.sumarDiasHabiles(desde, +n);
      $('#c-resultado').innerHTML = `<p>Vence el <strong>${esc(R.fechaLarga(vence))}</strong>. El plazo se cuenta desde el día siguiente a la radicación${u === 'h' ? ', sin sábados, domingos ni festivos' : ''}.</p>`;
    };
    $('#c-fecha').addEventListener('change', calc); $('#c-plazo').addEventListener('change', calc); calc();
    if (arg) { const el = document.getElementById(arg); if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50); }
  }

  /* ---------- Vista: acerca de ---------- */
  function vistaAcerca(main) {
    main.innerHTML = `
      <section class="seccion acerca">
        <div class="acerca-cab">
          <figure class="acerca-logo">
            <img src="img/logo-suenomotora.webp" alt="Logo de La Sueñomotora" width="1456" height="1092" onerror="this.closest('.acerca-logo').hidden = true">
          </figure>
          <div class="acerca-texto">
            <p class="eyebrow">Una iniciativa de La Sueñomotora</p>
            <h1>Acerca de esta plataforma</h1>
            <p class="acerca-lead">La Sueñomotora es una fundación creada hace catorce años por Santiago Diez Restrepo y Juan Gonzalo Lalinde para llevar libros y computadores a las zonas más apartadas de Colombia: veredas, corregimientos y pueblos con dificultades de comunicación y marcados por el conflicto armado. En ese camino ha entregado más de mil bibliotecas en los lugares más lejanos del país.</p>
            <p>En cada viaje hemos visto cómo las personas de estas comunidades son atropelladas en sus derechos: por otras personas, por empresas, por grupos armados, por instituciones del Estado y por la propia fuerza pública. Y hemos visto que muchas veces no se defienden porque nadie les ha dicho que pueden hacerlo, ni cómo.</p>
            <p>Asesor Jurídico Ciudadano nace de esa experiencia. Es una herramienta para que la sociedad civil, desde los niños hasta los mayores, cualquiera que sepa usar un computador y tenga conexión a internet, pueda defender sus derechos y los de su familia, sus conocidos y su comunidad, con documentos claros, bien fundamentados en la ley y listos para presentar.</p>
          </div>
        </div>
      </section>

      <section class="seccion">
        <div class="seccion-cab"><h2>Lo que creemos</h2></div>
        <div class="grid-principios">
          <div class="principio">${icono('libro')}<h3>El derecho se aprende usándolo</h3><p>Cada documento explica, en lenguaje común, qué norma protege a la persona, cuánto tiempo tiene la entidad para responder y qué sigue después. Quien presenta uno, aprende a presentar el siguiente y a ayudar a otros.</p></div>
          <div class="principio">${icono('persona')}<h3>Para cualquier persona</h3><p>Sin registro, sin costo y sin palabras difíciles. Funciona en un computador de biblioteca, en un colegio rural o en el celular, con la misma conexión que se usa para leer el correo.</p></div>
          <div class="principio">${icono('escudo')}<h3>Tus datos son tuyos</h3><p>Todo se procesa en tu navegador. Nombres, cédulas e historias no se envían a ningún servidor ni los conoce nadie más. Lo que guardes queda solo en tu dispositivo.</p></div>
          <div class="principio">${icono('balanza')}<h3>Fundamentado en la ley colombiana</h3><p>Constitución, leyes, decretos, resoluciones y sentencias de la Corte Constitucional, citadas en cada documento y revisadas para mantenerlas vigentes.</p></div>
        </div>
      </section>

      <section class="seccion">
        <div class="seccion-cab"><h2>Cómo puedes ayudar</h2></div>
        <ul class="lista-ayudar">
          <li><strong>Úsala y compártela.</strong> Enséñale a alguien de tu familia, tu vereda o tu barrio a presentar su primer derecho de petición. Instálala como favorito en los computadores de la biblioteca o la escuela.</li>
          <li><strong>Cuéntanos qué pasó.</strong> Si una entidad respondió, si un juez concedió la tutela o si algo del documento no sirvió, ese aprendizaje mejora la herramienta para los demás.</li>
          <li><strong>Mejórala.</strong> El código es abierto: puedes proponer nuevos casos, corregir una norma o traducir las guías en <a href="https://github.com/santiagodiezrestrepo/asesor-juridico-ciudadano" target="_blank" rel="noopener">el repositorio del proyecto</a>.</li>
        </ul>
      </section>

      <section class="seccion nota-legal">
        <h2>Aviso</h2>
        <p>Esta plataforma orienta y redacta documentos con base en la normativa vigente, pero no sustituye la valoración de un abogado en casos complejos ni constituye representación legal. Para acompañamiento gratuito acude a la Personería de tu municipio, a la Defensoría del Pueblo o a un consultorio jurídico universitario. Consulta la <a href="#guia/directorio">lista de entidades que ayudan sin costo</a>.</p>
      </section>`;
  }

  /* ---------- Arranque ---------- */
  function construirDatalist() {
    const dl = document.createElement('datalist'); dl.id = 'lista-entidades';
    dl.innerHTML = AJ.entidades.lista.map(e => `<option value="${esc(e.nombre)}"></option>`).join('') + AJ.entidades.dependenciasMunicipio.map(e => `<option value="${esc(e.nombre)}"></option>`).join('');
    document.body.appendChild(dl);
  }

  document.addEventListener('DOMContentLoaded', () => {
    construirDatalist();
    $('#total-casos').textContent = AJ.casos.length;
    const tema = $('#tema');
    if (tema) {
      const aplicar = v => { if (v) document.documentElement.dataset.theme = v; else delete document.documentElement.dataset.theme; };
      aplicar(almacen.leer('aj_tema', ''));
      tema.addEventListener('click', () => { const actual = document.documentElement.dataset.theme; const oscuroSistema = matchMedia('(prefers-color-scheme: dark)').matches; const nuevo = actual ? (actual === 'dark' ? 'light' : 'dark') : (oscuroSistema ? 'light' : 'dark'); aplicar(nuevo); almacen.guardar('aj_tema', nuevo); });
    }
    window.addEventListener('hashchange', render);
    render();
  });
})();
