/* ============================================================
   comunes.js — Campos compartidos por todos los documentos y
   funciones de redacción (lenguaje común → lenguaje jurídico).
   ============================================================ */
window.AJ = window.AJ || {};

/* ---------- Definición de campos reutilizables ---------- */
AJ.campos = {
  tiposDocumento: [
    { v: 'CC', t: 'Cédula de ciudadanía', legal: 'cédula de ciudadanía' },
    { v: 'TI', t: 'Tarjeta de identidad', legal: 'tarjeta de identidad' },
    { v: 'CE', t: 'Cédula de extranjería', legal: 'cédula de extranjería' },
    { v: 'PPT', t: 'Permiso por Protección Temporal (PPT)', legal: 'Permiso por Protección Temporal' },
    { v: 'PAS', t: 'Pasaporte', legal: 'pasaporte' },
    { v: 'RC', t: 'Registro civil (niños sin tarjeta)', legal: 'registro civil de nacimiento' },
    { v: 'OTRO', t: 'Otro documento', legal: 'documento de identidad' }
  ],

  condiciones: [
    { v: 'adulto_mayor', t: 'Soy una persona mayor (60 años o más)', legal: 'persona adulta mayor' },
    { v: 'discapacidad', t: 'Tengo una discapacidad', legal: 'persona en situación de discapacidad' },
    { v: 'enfermedad', t: 'Tengo una enfermedad grave, crónica o catastrófica', legal: 'persona con una enfermedad grave que compromete su salud' },
    { v: 'embarazo', t: 'Estoy embarazada o en período de lactancia', legal: 'mujer en estado de embarazo o lactancia' },
    { v: 'cabeza_familia', t: 'Soy madre o padre cabeza de familia', legal: 'madre o padre cabeza de familia' },
    { v: 'menor', t: 'La persona afectada es menor de edad', legal: 'niño, niña o adolescente' },
    { v: 'victima', t: 'Soy víctima del conflicto armado o persona desplazada', legal: 'víctima del conflicto armado' },
    { v: 'migrante', t: 'Soy migrante', legal: 'persona migrante' },
    { v: 'etnico', t: 'Pertenezco a una comunidad indígena, afro, raizal, palenquera o Rrom', legal: 'integrante de una comunidad étnica' },
    { v: 'bajos_recursos', t: 'No tengo recursos económicos (Sisbén A o B, sin empleo)', legal: 'persona de escasos recursos económicos' }
  ],

  solicitante(opts) {
    opts = opts || {};
    const modos = [
      { v: 'propio', t: 'Yo mismo(a), en mi propio nombre' },
      { v: 'representante', t: 'Yo, en nombre de otra persona (mi hijo(a), un familiar enfermo, una persona mayor)' }
    ];
    if (opts.permiteAnonimo) modos.push({ v: 'anonimo', t: 'De forma anónima (sin dar mi nombre)' });
    return [
      { id: 'modo', tipo: 'radio', etiqueta: '¿Quién presenta este documento?', opciones: modos, requerido: true, valorInicial: 'propio' },
      { id: 'infoAnonimo', tipo: 'info', mostrarSi: { campo: 'modo', valor: 'anonimo' }, texto: 'Puedes presentar derechos de petición, quejas y denuncias sin identificarte. Ten en cuenta: la entidad puede exigir identificación para responder sobre asuntos personales tuyos (tu historia clínica, tu pensión); el anonimato funciona mejor para quejas y temas de interés general. Indica un correo electrónico (puede ser uno creado solo para esto) para recibir la respuesta.' },
      { id: 'nombre', tipo: 'texto', etiqueta: 'Tu nombre completo', ejemplo: 'Ej.: María Fernanda López Ruiz', requerido: true, ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'genero', tipo: 'select', etiqueta: '¿Cómo quieres que te mencione el documento?', opciones: [
        { v: 'f', t: 'En femenino (la suscrita, identificada)' }, { v: 'm', t: 'En masculino (el suscrito, identificado)' }, { v: 'n', t: 'Neutro (el(la) suscrito(a))' }
      ], valorInicial: 'n', ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'tipoDoc', tipo: 'select', etiqueta: 'Tipo de documento de identidad', opciones: this.tiposDocumento, valorInicial: 'CC', ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'numDoc', tipo: 'texto', etiqueta: 'Número del documento', ejemplo: 'Ej.: 1.020.345.678', requerido: true, ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'expedidaEn', tipo: 'texto', etiqueta: 'Lugar donde fue expedido', ejemplo: 'Ej.: Medellín', ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'ciudad', tipo: 'texto', etiqueta: 'Ciudad o municipio donde vives', ejemplo: 'Ej.: Envigado, Antioquia', requerido: true, ancho: 'media' },
      { id: 'direccion', tipo: 'texto', etiqueta: 'Dirección para recibir correspondencia', ejemplo: 'Ej.: Calle 10 # 5-20, barrio El Centro', ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'telefono', tipo: 'texto', etiqueta: 'Teléfono o celular', ejemplo: 'Ej.: 300 123 4567', ocultarSi: { campo: 'modo', valor: 'anonimo' }, ancho: 'media' },
      { id: 'correo', tipo: 'texto', etiqueta: 'Correo electrónico para notificaciones', ejemplo: 'Ej.: nombre@correo.com', ayuda: 'Hoy casi todas las entidades y juzgados notifican por correo. Revisa esta cuenta con frecuencia.', ancho: 'media' },
      { id: 'condicion', tipo: 'checks', etiqueta: '¿Alguna de estas situaciones aplica a la persona afectada? (marca las que correspondan)', ayuda: 'La ley exige a las entidades atención prioritaria a estas personas. Esto fortalece el documento.', opciones: this.condiciones },
      // Datos de la persona representada
      { id: 'afectadoNombre', tipo: 'texto', etiqueta: 'Nombre completo de la persona afectada (a quien representas)', requerido: true, mostrarSi: { campo: 'modo', valor: 'representante' }, ancho: 'media' },
      { id: 'afectadoGenero', tipo: 'select', etiqueta: 'La persona afectada es', opciones: [ { v: 'f', t: 'Mujer / niña' }, { v: 'm', t: 'Hombre / niño' }, { v: 'n', t: 'Prefiero no especificar' } ], valorInicial: 'n', mostrarSi: { campo: 'modo', valor: 'representante' }, ancho: 'media' },
      { id: 'afectadoTipoDoc', tipo: 'select', etiqueta: 'Tipo de documento de la persona afectada', opciones: this.tiposDocumento, valorInicial: 'CC', mostrarSi: { campo: 'modo', valor: 'representante' }, ancho: 'media' },
      { id: 'afectadoNumDoc', tipo: 'texto', etiqueta: 'Número del documento de la persona afectada', mostrarSi: { campo: 'modo', valor: 'representante' }, ancho: 'media' },
      { id: 'parentesco', tipo: 'select', etiqueta: '¿Qué relación tienes con la persona afectada?', opciones: [
        { v: 'hijo', t: 'Es mi hijo o hija', legal: 'madre/padre' }, { v: 'padre', t: 'Es mi padre o madre', legal: 'hijo(a)' },
        { v: 'conyuge', t: 'Es mi esposo(a) o compañero(a) permanente', legal: 'cónyuge o compañero(a) permanente' }, { v: 'hermano', t: 'Es mi hermano o hermana', legal: 'hermano(a)' },
        { v: 'abuelo', t: 'Es mi abuelo o abuela', legal: 'nieto(a)' }, { v: 'nieto', t: 'Es mi nieto o nieta', legal: 'abuelo(a)' },
        { v: 'otro_familiar', t: 'Otro familiar', legal: 'familiar' }, { v: 'cuidador', t: 'Soy su cuidador(a) o acudiente', legal: 'cuidador(a)' }, { v: 'otro', t: 'Otra relación', legal: 'allegado(a)' }
      ], mostrarSi: { campo: 'modo', valor: 'representante' }, ancho: 'media' },
      { id: 'afectadoRazon', tipo: 'select', etiqueta: '¿Por qué la persona afectada no presenta el documento directamente?', opciones: [
        { v: 'menor', t: 'Es menor de edad', legal: 'es menor de edad' },
        { v: 'enfermedad', t: 'Está enfermo(a) u hospitalizado(a) y no puede actuar', legal: 'se encuentra en un estado de salud que le impide actuar por sí mismo(a)' },
        { v: 'discapacidad', t: 'Tiene una discapacidad que le impide hacerlo', legal: 'tiene una condición de discapacidad que le impide promover su propia defensa' },
        { v: 'mayor', t: 'Es una persona mayor que depende de mí', legal: 'es una persona adulta mayor que depende de su familia y no está en condiciones de adelantar el trámite' },
        { v: 'ausente', t: 'Está fuera del lugar / privado(a) de la libertad', legal: 'se encuentra ausente o privado(a) de la libertad y no puede actuar directamente' },
        { v: 'otra', t: 'Otra razón (explícala en el relato)', legal: 'no está en condiciones de promover su propia defensa' }
      ], mostrarSi: { campo: 'modo', valor: 'representante' }, ancho: 'media' }
    ];
  },

  destinatario(sug) {
    sug = sug || {};
    return [
      { id: 'categoria', tipo: 'select', etiqueta: '¿Qué tipo de entidad es?', ayuda: 'Define las normas que aplican y, si llegas a la tutela, el juez al que se reparte.', opciones: AJ.entidades.categorias.map(c => ({ v: c.id, t: c.nombre })), valorInicial: sug.categoria || 'municipio', requerido: true, ancho: 'media' },
      { id: 'entidadNombre', tipo: 'texto', etiqueta: 'Nombre de la entidad, empresa o persona a quien va dirigido', ejemplo: sug.ejemploNombre || 'Ej.: Alcaldía Municipal de Rionegro', lista: 'entidades', requerido: true, valorInicial: sug.nombre || '', ancho: 'media' },
      { id: 'entidadCargo', tipo: 'texto', etiqueta: 'Dependencia o cargo de quien debe responder (si lo sabes)', ejemplo: sug.ejemploCargo || 'Ej.: Secretaría de Planeación / Gerente / Representante legal', valorInicial: sug.cargo || '', ancho: 'media' },
      { id: 'entidadCiudad', tipo: 'texto', etiqueta: 'Ciudad de la entidad', ejemplo: 'Ej.: Rionegro, Antioquia', ancho: 'media' },
      { id: 'entidadDireccion', tipo: 'texto', etiqueta: 'Dirección o correo de la entidad (si lo sabes)', ejemplo: 'Ej.: notificacionesjudiciales@entidad.gov.co', ancho: 'media' }
    ];
  },

  relato(opts) {
    opts = opts || {};
    return { id: 'relato', tipo: 'textarea', etiqueta: opts.etiqueta || 'Cuéntanos qué pasó, con tus palabras', ayuda: opts.ayuda || 'Escribe cada hecho en una línea aparte y en orden de fechas. No necesitas lenguaje legal: el documento lo convertirá en hechos numerados. Incluye fechas, nombres y números de radicado si los tienes.', ejemplo: opts.ejemplo || 'Ej.:\nEl 3 de marzo de 2026 fui a la oficina y radiqué la solicitud.\nMe dijeron que en 15 días respondían.\nHan pasado dos meses y no he recibido respuesta.', requerido: opts.requerido !== false, filas: 7 };
  },

  previo(opts) {
    opts = opts || {};
    return [
      { id: 'yaPedi', tipo: 'radio', etiqueta: opts.etiqueta || '¿Ya habías hecho esta solicitud antes (por escrito, correo, teléfono o página web)?', opciones: [ { v: 'no', t: 'No, es la primera vez' }, { v: 'si', t: 'Sí, ya la había pedido' } ], valorInicial: 'no', requerido: true },
      { id: 'fechaPrevia', tipo: 'fecha', etiqueta: '¿Cuándo la pediste?', mostrarSi: { campo: 'yaPedi', valor: 'si' }, ancho: 'media' },
      { id: 'radicadoPrevio', tipo: 'texto', etiqueta: 'Número de radicado o referencia (si lo tienes)', ejemplo: 'Ej.: 2026-RAD-004512', mostrarSi: { campo: 'yaPedi', valor: 'si' }, ancho: 'media' },
      { id: 'medioPrevio', tipo: 'select', etiqueta: '¿Por qué medio la pediste?', opciones: [
        { v: 'escrito', t: 'Por escrito en ventanilla', legal: 'por escrito radicado en la ventanilla de la entidad' }, { v: 'correo', t: 'Por correo electrónico', legal: 'mediante correo electrónico' },
        { v: 'web', t: 'Por la página web o aplicación', legal: 'a través del canal virtual de la entidad' }, { v: 'telefono', t: 'Por teléfono o línea de atención', legal: 'por vía telefónica' },
        { v: 'presencial', t: 'Personalmente, sin radicado', legal: 'de manera verbal y presencial' }
      ], valorInicial: 'escrito', mostrarSi: { campo: 'yaPedi', valor: 'si' }, ancho: 'media' },
      { id: 'respuestaPrevia', tipo: 'select', etiqueta: '¿Qué pasó con esa solicitud?', opciones: [
        { v: 'nada', t: 'No me han respondido nada' }, { v: 'parcial', t: 'Me respondieron algo que no resuelve lo que pedí' }, { v: 'negaron', t: 'Me la negaron' }, { v: 'prometieron', t: 'Me prometieron algo pero no cumplieron' }
      ], valorInicial: 'nada', mostrarSi: { campo: 'yaPedi', valor: 'si' }, ancho: 'media' }
    ];
  }
};

/* ---------- Redacción jurídica ---------- */
AJ.red = {
  meses: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],

  hoy() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); },

  fechaLarga(d) {
    if (!d) return '';
    if (typeof d === 'string') d = AJ.festivos.parseISO(d);
    if (!d || isNaN(d)) return '';
    return `${d.getDate()} de ${this.meses[d.getMonth()]} de ${d.getFullYear()}`;
  },

  fechaCorta(d) {
    if (typeof d === 'string') d = AJ.festivos.parseISO(d);
    if (!d || isNaN(d)) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  },

  // "el 3 de marzo de 2026" o "en fecha que no recuerdo con exactitud"
  elDia(iso, alternativa) {
    const f = this.fechaLarga(iso);
    return f ? `el ${f}` : (alternativa || 'en fecha reciente');
  },

  mayus(s) { return (s || '').toString().trim().toUpperCase(); },
  capital(s) { s = (s || '').toString().trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; },

  oracion(s) {
    s = (s || '').toString().trim().replace(/\s+/g, ' ');
    if (!s) return '';
    s = this.capital(s);
    if (!/[.!?…]$/.test(s)) s += '.';
    return s;
  },

  lista(arr, conj) {
    arr = (arr || []).filter(Boolean);
    conj = conj || 'y';
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(', ') + ` ${conj} ` + arr[arr.length - 1];
  },

  numerosLetras: { 1: 'un', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez', 15: 'quince', 20: 'veinte', 30: 'treinta', 45: 'cuarenta y cinco', 48: 'cuarenta y ocho', 60: 'sesenta', 90: 'noventa' },
  dias(n, tipo) {
    const l = this.numerosLetras[n];
    const base = l ? `${l} (${n})` : `${n}`;
    return `${base} ${tipo === 'habiles' ? 'días hábiles' : tipo === 'horas' ? 'horas' : 'días'}`;
  },

  moneda(v) {
    const n = Number(String(v || '').replace(/[^\d]/g, ''));
    if (!n) return '';
    return '$' + n.toLocaleString('es-CO');
  },

  // Divide el relato en hechos (una línea = un hecho)
  relatoAHechos(texto) {
    return (texto || '').split(/\n+/).map(l => l.trim()).filter(l => l.length > 1).map(l => this.oracion(l.replace(/^[-•*\d.)\s]+/, '')));
  },

  opcionTexto(campo, valor, prop) {
    if (!campo || !campo.opciones) return valor || '';
    const o = campo.opciones.find(x => x.v === valor);
    if (!o) return valor || '';
    return o[prop || 'legal'] || o.t;
  },

  tipoDocLegal(v) { return this.opcionTexto({ opciones: AJ.campos.tiposDocumento }, v, 'legal') || 'documento de identidad'; },

  // Terminaciones de género: g('o','a') → 'o' | 'a' | 'o(a)'
  terminacion(gen, m, f) { return gen === 'm' ? m : gen === 'f' ? f : `${m}(${f})`; },

  // Resuelve "o(a)", "(a)" según el género conocido: "hijo(a)" → "hija" / "hijo"
  generizar(texto, gen) {
    texto = texto || '';
    if (gen === 'm') return texto.replace(/\(a\)/g, '');
    if (gen === 'f') return texto.replace(/o\(a\)/g, 'a').replace(/\(a\)/g, 'a');
    return texto;
  },

  esAnonimo(d) { return d.modo === 'anonimo'; },
  esRepresentante(d) { return d.modo === 'representante'; },

  /* Persona afectada: devuelve cómo nombrarla en tercera persona dentro del documento. */
  actor(d) {
    const t = this.terminacion.bind(this);
    if (this.esRepresentante(d)) {
      const g = d.afectadoGenero || 'n';
      const nombre = this.mayus(d.afectadoNombre) || 'LA PERSONA REPRESENTADA';
      const art = t(g, 'el señor', 'la señora');
      const esMenor = d.afectadoRazon === 'menor' || (d.condicion || []).includes('menor');
      const trato = esMenor ? t(g, 'el menor', 'la menor') : art;
      return {
        tercero: true, g,
        nombre,
        doc: d.afectadoNumDoc ? `${this.tipoDocLegal(d.afectadoTipoDoc)} No. ${d.afectadoNumDoc}` : '',
        nom: `${trato} ${nombre}`,
        Nom: `${this.capital(trato)} ${nombre}`,
        corto: esMenor ? t(g, 'el menor', 'la menor') : t(g, 'el señor', 'la señora'),
        o: t(g, 'o', 'a'), su: 'su', le: 'le', se: 'se', posesivo: 'su'
      };
    }
    if (this.esAnonimo(d)) {
      return { tercero: false, anonimo: true, g: 'n', nombre: 'QUIEN SUSCRIBE', doc: '', nom: 'quien suscribe', Nom: 'Quien suscribe', corto: 'quien suscribe', o: 'o(a)', su: 'su', posesivo: 'su' };
    }
    const g = d.genero || 'n';
    return {
      tercero: false, g,
      nombre: this.mayus(d.nombre) || 'EL(LA) SOLICITANTE',
      doc: d.numDoc ? `${this.tipoDocLegal(d.tipoDoc)} No. ${d.numDoc}` : '',
      nom: t(g, 'el suscrito', 'la suscrita'), Nom: t(g, 'El suscrito', 'La suscrita'), corto: t(g, 'el suscrito', 'la suscrita'),
      o: t(g, 'o', 'a'), su: 'su', posesivo: 'su'
    };
  },

  /* Nombre de la entidad destinataria en mayúsculas */
  entidad(d) { return this.mayus(d.entidadNombre) || 'LA ENTIDAD'; },

  /* Párrafo de identificación del firmante (para el inicio del documento) */
  identificacion(d, opts) {
    opts = opts || {};
    const t = this.terminacion.bind(this);
    if (this.esAnonimo(d)) {
      return `Quien suscribe, ciudadano(a) que por razones personales se reserva su identidad conforme lo permite el ordenamiento jurídico para las peticiones de interés general, quejas y denuncias (artículo 38 de la Ley 190 de 1995 y artículo 69 de la Ley 1952 de 2019), residente en ${d.ciudad || 'esta ciudad'},`;
    }
    const g = d.genero || 'n';
    const nombre = this.mayus(d.nombre) || '[NOMBRE COMPLETO]';
    const ident = `identificad${t(g, 'o', 'a')} con ${this.tipoDocLegal(d.tipoDoc)} No. ${d.numDoc || '[NÚMERO]'}${d.expedidaEn ? ` expedida en ${d.expedidaEn}` : ''}`;
    const dom = d.ciudad ? `, domiciliad${t(g, 'o', 'a')} en ${d.ciudad}` : '';
    let rep = 'actuando en nombre propio';
    if (this.esRepresentante(d)) {
      const a = this.actor(d);
      const razon = this.generizar(this.opcionTexto({ opciones: AJ.campos.solicitante({ permiteAnonimo: true }).find(c => c.id === 'afectadoRazon').opciones }, d.afectadoRazon, 'legal'), a.g);
      const parentesco = this.generizar(this.opcionTexto({ opciones: AJ.campos.solicitante({ permiteAnonimo: true }).find(c => c.id === 'parentesco').opciones }, d.parentesco, 'legal'), g);
      const esMenor = d.afectadoRazon === 'menor';
      if (opts.tutela) {
        rep = esMenor
          ? `actuando en calidad de ${parentesco} y representante legal de ${a.nom}${a.doc ? `, identificad${a.o} con ${a.doc}` : ''}, quien ${razon}`
          : `actuando como agente oficios${t(g, 'o', 'a')} de ${a.nom}${a.doc ? `, identificad${a.o} con ${a.doc}` : ''}, en mi calidad de ${parentesco}, por cuanto ${razon}, conforme al artículo 10 del Decreto 2591 de 1991`;
      } else {
        rep = `actuando en nombre y representación de ${a.nom}${a.doc ? `, identificad${a.o} con ${a.doc}` : ''}, en mi calidad de ${parentesco}, por cuanto ${razon}`;
      }
    }
    return `${nombre}, mayor de edad, ${ident}${dom}, ${rep},`;
  },

  /* Frase sobre especial protección constitucional según las condiciones marcadas */
  especialProteccion(d) {
    const cond = (d.condicion || []).filter(c => c !== 'bajos_recursos');
    if (!cond.length) return '';
    const a = this.actor(d);
    const textos = cond.map(c => this.opcionTexto({ opciones: AJ.campos.condiciones }, c, 'legal'));
    const quien = a.tercero ? a.nom : a.nom;
    return `${this.capital(quien)} es sujeto de especial protección constitucional por tratarse de ${this.lista(textos)}, condición que, conforme a los artículos 13, 44, 46 y 47 de la Constitución Política, obliga a las autoridades y a los particulares a brindarle un trato prioritario y a remover las barreras que le impidan el goce efectivo de sus derechos.`;
  },

  bajosRecursos(d) { return (d.condicion || []).includes('bajos_recursos'); },

  /* Hechos derivados de una solicitud previa */
  hechosPrevio(d, objeto) {
    if (d.yaPedi !== 'si') return [];
    const a = this.actor(d);
    const medio = this.opcionTexto({ opciones: AJ.campos.previo().find(c => c.id === 'medioPrevio').opciones }, d.medioPrevio, 'legal');
    const h = [];
    h.push(`${this.capital(a.nom)} ya había solicitado ${objeto || 'lo que aquí se pide'} a ${this.entidad(d)} ${this.elDia(d.fechaPrevia, 'con anterioridad')}, ${medio}${d.radicadoPrevio ? `, solicitud que quedó registrada bajo el radicado o referencia No. ${d.radicadoPrevio}` : ''}.`);
    const resp = {
      nada: 'A la fecha de presentación de este escrito no se ha recibido ninguna respuesta a esa solicitud, con lo cual se superó ampliamente el término legal para resolverla.',
      parcial: 'La respuesta recibida no resolvió de fondo lo solicitado: fue evasiva, parcial o se refirió a asuntos distintos de los pedidos, lo que equivale jurídicamente a la ausencia de respuesta.',
      negaron: 'La solicitud fue negada sin que se expusieran razones válidas y suficientes, o con fundamento en argumentos que no se ajustan a la ley.',
      prometieron: 'La entidad manifestó que atendería la solicitud, pero hasta la fecha no ha cumplido lo prometido ni ha dado una respuesta formal.'
    };
    h.push(resp[d.respuestaPrevia] || resp.nada);
    return h;
  },

  /* Nombre del juez según la categoría de la entidad */
  juezTutela(d) {
    const cat = AJ.entidades.categoria(d.categoria);
    const ciudad = d.entidadCiudad || d.ciudad || '[CIUDAD]';
    if (cat.juez === 'circuito') return `JUEZ DEL CIRCUITO DE ${this.mayus(ciudad)} (REPARTO)`;
    if (cat.juez === 'tribunal') return `MAGISTRADO DEL TRIBUNAL SUPERIOR DEL DISTRITO JUDICIAL DE ${this.mayus(ciudad)} (REPARTO)`;
    return `JUEZ MUNICIPAL DE ${this.mayus(ciudad)} (REPARTO)`;
  },

  /* Explicación de por qué procede la tutela contra un particular */
  procedenciaParticular(d) {
    const cat = AJ.entidades.categoria(d.categoria);
    if (cat.naturaleza === 'publica') return '';
    const E = this.entidad(d);
    const base = {
      eps: `${E} es una entidad particular encargada de la prestación del servicio público de salud, por lo que la tutela procede en su contra conforme al numeral 2 del artículo 42 del Decreto 2591 de 1991.`,
      spd: `${E} es una empresa prestadora de servicios públicos domiciliarios, por lo que la tutela procede en su contra conforme al numeral 3 del artículo 42 del Decreto 2591 de 1991.`,
      educacion: `${E} está encargada de la prestación del servicio público de educación, por lo que la tutela procede en su contra conforme al numeral 1 del artículo 42 del Decreto 2591 de 1991.`,
      financiera: `${E} es una organización privada frente a la cual la parte accionante se encuentra en situación de indefensión, y además administra o reporta información personal, de modo que la tutela procede conforme a los numerales 4 y 6 del artículo 42 del Decreto 2591 de 1991.`,
      pensiones: `${E} es una entidad particular que administra el servicio público de seguridad social en pensiones, frente a la cual la parte accionante se encuentra en situación de indefensión, por lo que la tutela procede conforme al artículo 42 del Decreto 2591 de 1991.`,
      empleador: `${E} es un particular frente al cual la parte accionante se encuentra en situación de subordinación derivada de la relación laboral o contractual, por lo que la tutela procede conforme al numeral 4 del artículo 42 del Decreto 2591 de 1991.`,
      particular: `La parte accionante se encuentra en situación de indefensión o subordinación frente a ${E}, pues no cuenta con medios materiales ni jurídicos eficaces para resistir la vulneración, por lo que la tutela procede conforme al numeral 4 del artículo 42 del Decreto 2591 de 1991.`
    };
    return base[d.categoria] || base.particular;
  }
};
