/* ============================================================
   otros.js — Desacato, impugnación, recursos, quejas ante
   superintendencias, hábeas data y solicitudes de familia.
   ============================================================ */
window.AJ = window.AJ || {};
AJ.casos = AJ.casos || [];

(function () {
  const R = AJ.red;
  const C = AJ.campos;
  const cd = (c, f) => AJ.camposDe(c, f);

  AJ.casos.push(
  /* ---------------- INCIDENTE DE DESACATO ---------------- */
  {
    id: 'desacato', tipo: 'desacato', categoria: 'judicial',
    titulo: 'Incidente de desacato (ganaste la tutela y no cumplen)',
    resumen: 'El juez ordenó algo y la entidad no lo hizo en el plazo. Se presenta ante el mismo juez que falló la tutela; puede imponer arresto hasta de 6 meses y multa hasta de 20 salarios mínimos.',
    palabras: ['desacato', 'incumplimiento', 'fallo', 'tutela', 'no cumplen', 'sanción', 'arresto', 'multa', 'juez'],
    destinatario: { categoria: 'eps', ejemploNombre: 'Ej.: Nueva EPS (la entidad que no cumple)', cargo: 'Representante legal' },
    campos: [
      { id: 'juzgado', tipo: 'texto', etiqueta: 'Juzgado que falló la tutela', ejemplo: 'Ej.: Juzgado 12 Civil Municipal de Medellín', requerido: true, ancho: 'completa' },
      { id: 'radicado', tipo: 'texto', etiqueta: 'Número de radicado de la tutela', requerido: true, ancho: 'media' },
      { id: 'fechaFallo', tipo: 'fecha', etiqueta: 'Fecha del fallo', requerido: true, ancho: 'media' },
      { id: 'instancia', tipo: 'select', etiqueta: '¿El fallo fue confirmado en segunda instancia?', opciones: [ { v: 'primera', t: 'Solo hubo primera instancia (no impugnaron)', legal: 'quedó en firme al no ser impugnado' }, { v: 'confirmado', t: 'Fue impugnado y confirmado', legal: 'fue confirmado en segunda instancia' } ], valorInicial: 'primera', ancho: 'completa' },
      { id: 'ordenes', tipo: 'textarea', etiqueta: '¿Qué ordenó el juez exactamente? (cópialo de la parte final del fallo)', requerido: true, filas: 4 },
      { id: 'plazoOrden', tipo: 'texto', etiqueta: 'Plazo que dio el juez', ejemplo: 'Ej.: 48 horas', ancho: 'media' },
      { id: 'fechaNotificacion', tipo: 'fecha', etiqueta: 'Fecha en que notificaron el fallo a la entidad (aprox.)', ancho: 'media' },
      { id: 'incumplimiento', tipo: 'textarea', etiqueta: '¿Qué no han cumplido o qué cumplieron a medias?', requerido: true, filas: 3 },
      { id: 'gestiones', tipo: 'textarea', etiqueta: '¿Qué has hecho para que cumplan? (llamadas, correos, visitas)', filas: 2 },
      { id: 'perjuicio', tipo: 'textarea', etiqueta: '¿Qué daño te causa el incumplimiento?', requerido: true, filas: 2 }
    ],
    asunto: d => `Incidente de desacato – Tutela radicado ${d.radicado || ''}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`Mediante sentencia del ${R.fechaLarga(d.fechaFallo)}, proferida dentro de la acción de tutela radicada bajo el número ${d.radicado}, ${d.juzgado} tuteló los derechos fundamentales de ${a.nom} y profirió las siguientes órdenes a ${R.entidad(d)}: ${R.relatoAHechos(d.ordenes).join(' ')}`);
      h.push(`El fallo ${R.opcionTexto(cd('desacato', 'instancia'), d.instancia)}${d.fechaNotificacion ? ` y fue notificado a la entidad accionada el ${R.fechaLarga(d.fechaNotificacion)}` : ''}${d.plazoOrden ? `, con un plazo de cumplimiento de ${d.plazoOrden}` : ''}.`);
      h.push(`Vencido el plazo, ${R.entidad(d)} no ha cumplido la orden judicial: ${R.oracion(d.incumplimiento)}`);
      if (d.gestiones) h.push(`${a.Nom} ha requerido a la entidad el cumplimiento, sin resultado: ${R.oracion(d.gestiones)}`);
      h.push(`El incumplimiento causa un perjuicio grave y actual: ${R.oracion(d.perjuicio)}`);
      return h;
    },
    normas: ['cp86', 'd2591_27', 'd2591_52', 'd2591_23', 'cp228'],
    fundamentos: d => ['La Corte Constitucional (sentencias T-171 de 2009, SU-034 de 2018 y T-280 de 2021, entre otras) ha precisado que el incidente de desacato tiene por finalidad lograr el cumplimiento efectivo de la orden de tutela, que el juez conserva la competencia hasta que el derecho esté restablecido, y que la sanción procede cuando se acredita la responsabilidad subjetiva del obligado (dolo o culpa), sin que la entidad pueda excusarse en trámites internos o razones presupuestales.'],
    peticiones: [
      { v: 'abrir', inicial: true, fijo: true, t: 'Que abra el incidente de desacato', legal: d => `ABRIR incidente de desacato contra el representante legal de ${R.entidad(d)} y contra el funcionario directamente responsable del cumplimiento, por el incumplimiento de la sentencia del ${R.fechaLarga(d.fechaFallo)}.` },
      { v: 'requerir', inicial: true, t: 'Que requiera a la entidad para que cumpla de inmediato', legal: d => `REQUERIR a ${R.entidad(d)} y a su superior jerárquico para que cumplan de inmediato la orden de tutela, conforme al artículo 27 del Decreto 2591 de 1991.` },
      { v: 'sancionar', inicial: true, t: 'Que sancione con arresto y multa si persisten', legal: 'SANCIONAR a los responsables con arresto y multa en los términos del artículo 52 del Decreto 2591 de 1991, en caso de persistir el incumplimiento.' },
      { v: 'copias', t: 'Que compulse copias a la Procuraduría y la Fiscalía', legal: 'COMPULSAR copias a la Procuraduría General de la Nación y a la Fiscalía General de la Nación para que investiguen disciplinaria y penalmente (fraude a resolución judicial, artículo 454 del Código Penal) la conducta de los responsables.' }
    ],
    anexos: [ { v: 'fallo', t: 'Copia del fallo de tutela (y del de segunda instancia, si existe)' }, { v: 'pruebas', t: 'Pruebas del incumplimiento (respuestas, pantallazos, constancias)' }, { v: 'gestiones', t: 'Correos o radicados en los que pediste el cumplimiento' } ],
    guia: { plazo: { dias: 10, tipo: 'calendario' }, nota: 'Se radica ante el MISMO juzgado de primera instancia, citando el radicado de la tutela. No tiene plazo límite: puedes presentarlo mientras siga el incumplimiento.', siNoResponden: 'El juez debe requerir a la entidad, abrir el incidente y decidir; la sanción se consulta ante el superior. Si el juzgado no actúa, queja ante la Comisión Seccional de Disciplina Judicial.' }
  },

  /* ---------------- IMPUGNACIÓN ---------------- */
  {
    id: 'impugnacion', tipo: 'impugnacion', categoria: 'judicial',
    titulo: 'Impugnación del fallo de tutela (la negaron o concedieron solo en parte)',
    resumen: 'Tienes 3 días hábiles desde la notificación del fallo para pedir que un juez superior lo revise. Se radica ante el mismo juez que falló.',
    palabras: ['impugnación', 'impugnar', 'apelar', 'tutela negada', 'fallo', 'segunda instancia', '3 días', 'improcedente'],
    destinatario: { categoria: 'eps', ejemploNombre: 'Ej.: La entidad accionada en la tutela', cargo: 'Representante legal' },
    campos: [
      { id: 'juzgado', tipo: 'texto', etiqueta: 'Juzgado que falló la tutela', requerido: true, ancho: 'completa' },
      { id: 'radicado', tipo: 'texto', etiqueta: 'Radicado de la tutela', requerido: true, ancho: 'media' },
      { id: 'fechaFallo', tipo: 'fecha', etiqueta: 'Fecha del fallo', requerido: true, ancho: 'media' },
      { id: 'fechaNotif', tipo: 'fecha', etiqueta: 'Fecha en que te notificaron (correo o estado)', requerido: true, ancho: 'media' },
      { id: 'decision', tipo: 'select', etiqueta: '¿Qué decidió el juez?', requerido: true, opciones: [
        { v: 'nego', t: 'Negó la tutela', legal: 'negó el amparo' }, { v: 'improcedente', t: 'La declaró improcedente (dijo que hay otro mecanismo)', legal: 'declaró improcedente la acción por considerar que existe otro medio de defensa' },
        { v: 'parcial', t: 'Concedió solo una parte', legal: 'concedió parcialmente el amparo' }, { v: 'hecho_superado', t: 'Dijo "hecho superado" pero no es cierto', legal: 'declaró la carencia actual de objeto por hecho superado' }
      ], ancho: 'completa' },
      { id: 'razonJuez', tipo: 'textarea', etiqueta: '¿Qué razones dio el juez? (resúmelas o cópialas)', requerido: true, filas: 3 },
      { id: 'argumentos', tipo: 'textarea', etiqueta: '¿Por qué crees que el juez se equivocó? (un argumento por línea)', requerido: true, filas: 4, ejemplo: 'Ej.:\nEl juez dijo que puedo ir a la Supersalud, pero mi enfermedad no puede esperar ese trámite.\nNo tuvo en cuenta que soy adulto mayor y vivo solo.\nLa EPS dijo que ya entregó el medicamento pero solo entregó una caja de las tres.' },
      { id: 'pruebasNuevas', tipo: 'textarea', etiqueta: '¿Tienes pruebas que el juez no tuvo en cuenta o nuevas? (opcional)', filas: 2 }
    ],
    asunto: d => `Impugnación del fallo de tutela – Radicado ${d.radicado || ''}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${a.Nom} presentó acción de tutela contra ${R.entidad(d)}, radicada bajo el número ${d.radicado} en ${d.juzgado}.`);
      h.push(`Mediante sentencia del ${R.fechaLarga(d.fechaFallo)}, notificada el ${R.fechaLarga(d.fechaNotif)}, el despacho ${R.opcionTexto(cd('impugnacion', 'decision'), d.decision)}, con fundamento en lo siguiente: ${R.oracion(d.razonJuez)}`);
      h.push('La presente impugnación se presenta dentro de los tres (3) días siguientes a la notificación, conforme al artículo 31 del Decreto 2591 de 1991.');
      return h;
    },
    normas: ['cp86', 'd2591_31', 'd2591_32', 'd2591_6', 'd2591_8', 'd2591_18'],
    fundamentos: d => {
      const f = R.relatoAHechos(d.argumentos).map((x, i) => `Motivo de inconformidad ${i + 1}: ${x}`);
      if (d.decision === 'improcedente') f.push('La existencia de otro medio de defensa judicial debe apreciarse en concreto, atendiendo la eficacia del mecanismo y las circunstancias de la parte accionante (artículo 6 del Decreto 2591 de 1991). Cuando el accionante es sujeto de especial protección o enfrenta un perjuicio irremediable, la tutela procede aunque existan otros mecanismos, al menos como mecanismo transitorio (Sentencia SU-961 de 1999 y jurisprudencia uniforme).');
      if (d.decision === 'hecho_superado') f.push('La carencia actual de objeto por hecho superado exige que la pretensión haya sido satisfecha de manera completa y efectiva antes del fallo (Sentencia SU-522 de 2019). Una promesa de cumplimiento, una autorización sin prestación efectiva o un cumplimiento parcial no configuran hecho superado.');
      if (d.pruebasNuevas) f.push(`Pruebas adicionales que deben valorarse: ${R.oracion(d.pruebasNuevas)}`);
      return f;
    },
    peticiones: [
      { v: 'conceder', inicial: true, fijo: true, t: 'Que concedan la impugnación y envíen al superior', legal: 'CONCEDER la impugnación y remitir el expediente al superior jerárquico dentro de los dos (2) días siguientes, conforme al artículo 32 del Decreto 2591 de 1991.' },
      { v: 'revocar', inicial: true, fijo: true, t: 'Que el juez superior revoque el fallo y conceda la tutela', legal: d => `Al superior: REVOCAR la sentencia de primera instancia del ${R.fechaLarga(d.fechaFallo)} y, en su lugar, TUTELAR los derechos fundamentales invocados, impartiendo a ${R.entidad(d)} las órdenes solicitadas en la acción de tutela.` },
      { v: 'valorar', t: 'Que valoren las pruebas aportadas y las nuevas', legal: 'VALORAR la totalidad de las pruebas obrantes en el expediente y las que se anexan a esta impugnación.' }
    ],
    anexos: [ { v: 'fallo', t: 'Copia del fallo impugnado' }, { v: 'notificacion', t: 'Copia de la notificación (correo o estado) para probar los 3 días' }, { v: 'nuevas', t: 'Pruebas nuevas' } ],
    guia: { plazo: { dias: 3, tipo: 'habiles' }, nota: 'Plazo: 3 días hábiles desde la notificación. Se radica ante el mismo juzgado (por correo o Tutela en Línea). El superior decide en 20 días.', siNoResponden: 'Si el superior confirma la negativa, el expediente va a la Corte Constitucional para eventual revisión; puedes enviar una solicitud de selección a la Corte explicando por qué tu caso es importante.' }
  },

  /* ---------------- RECURSO REPOSICIÓN / APELACIÓN ---------------- */
  {
    id: 'rec_reposicion', tipo: 'recurso', categoria: 'municipio',
    titulo: 'Recurso de reposición y apelación contra una decisión de una entidad pública',
    resumen: 'Te negaron un subsidio, una pensión, una licencia, te impusieron una multa o sanción mediante resolución. Tienes 10 días hábiles desde la notificación para pedir que la revisen.',
    palabras: ['recurso', 'reposición', 'apelación', 'resolución', 'negaron', 'multa', 'sanción', 'subsidio', 'pensión', 'licencia', 'acto administrativo', '10 días', 'notificación'],
    destinatario: { categoria: 'municipio', ejemploNombre: 'Ej.: Colpensiones / Alcaldía de Manizales – Secretaría de Tránsito', cargo: 'Funcionario que expidió la decisión' },
    campos: [
      { id: 'acto', tipo: 'texto', etiqueta: 'Número y fecha de la resolución o decisión', ejemplo: 'Ej.: Resolución No. 2026-0456 del 15 de septiembre de 2026', requerido: true, ancho: 'completa' },
      { id: 'fechaNotif', tipo: 'fecha', etiqueta: 'Fecha en que te la notificaron', requerido: true, ancho: 'media' },
      { id: 'queDecidio', tipo: 'textarea', etiqueta: '¿Qué decidió la entidad?', requerido: true, filas: 2 },
      { id: 'razonEntidad', tipo: 'textarea', etiqueta: '¿Qué razones dio?', requerido: true, filas: 2 },
      { id: 'argumentos', tipo: 'textarea', etiqueta: '¿Por qué está equivocada la decisión? (un argumento por línea: hechos falsos, pruebas no tenidas en cuenta, norma mal aplicada, sin notificación)', requerido: true, filas: 5 },
      { id: 'pruebas', tipo: 'textarea', etiqueta: 'Pruebas que aportas o pides que practiquen', filas: 2 },
      { id: 'tipoRecurso', tipo: 'select', etiqueta: '¿Qué recursos presentas?', opciones: [ { v: 'ambos', t: 'Reposición y en subsidio apelación (recomendado)', legal: 'recurso de reposición y, en subsidio, recurso de apelación' }, { v: 'reposicion', t: 'Solo reposición', legal: 'recurso de reposición' }, { v: 'apelacion', t: 'Solo apelación', legal: 'recurso de apelación' } ], valorInicial: 'ambos', ancho: 'completa' }
    ],
    asunto: d => `${R.opcionTexto(cd('rec_reposicion', 'tipoRecurso'), d.tipoRecurso).replace(/^./, c => c.toUpperCase())} contra ${d.acto || 'la decisión'}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`Mediante ${d.acto}, ${R.entidad(d)} decidió: ${R.oracion(d.queDecidio)}`);
      h.push(`La decisión se fundamentó en: ${R.oracion(d.razonEntidad)}`);
      h.push(`La decisión fue notificada a ${a.nom} el ${R.fechaLarga(d.fechaNotif)}, por lo que este recurso se presenta dentro de los diez (10) días hábiles siguientes, conforme al artículo 76 de la Ley 1437 de 2011.`);
      return h;
    },
    normas: ['cp29', 'l1437_3', 'l1437_74', 'l1437_79', 'l1437_87', 'cp83'],
    fundamentos: d => {
      const f = R.relatoAHechos(d.argumentos).map((x, i) => `Motivo de inconformidad ${i + 1}: ${x}`);
      if (d.pruebas) f.push(`Pruebas: ${R.oracion(d.pruebas)}`);
      return f;
    },
    peticiones: [
      { v: 'revocar', inicial: true, fijo: true, t: 'Que revoquen la decisión y decidan a mi favor', legal: d => `REVOCAR ${d.acto || 'la decisión recurrida'} y, en su lugar, ${d.queDecidio ? 'resolver favorablemente la solicitud de la parte recurrente' : 'acceder a lo solicitado'}.` },
      { v: 'subsidio', inicial: true, t: 'Si no reponen, que envíen la apelación al superior', legal: 'En caso de no reponerse la decisión, CONCEDER el recurso de apelación y remitir el expediente al superior jerárquico o funcional para que lo resuelva.' },
      { v: 'pruebas', t: 'Que practiquen las pruebas que pido', legal: 'DECRETAR y practicar las pruebas solicitadas y valorar las aportadas con este recurso.' },
      { v: 'suspender', t: 'Que no ejecuten la decisión mientras resuelven', legal: 'ABSTENERSE de ejecutar la decisión recurrida mientras se resuelven los recursos, en virtud del efecto suspensivo previsto en el artículo 79 de la Ley 1437 de 2011.' }
    ],
    anexos: [ { v: 'resolucion', t: 'Copia de la resolución y de la notificación' }, { v: 'pruebas', t: 'Documentos que prueban tus argumentos' }, { v: 'cedula', t: 'Copia de la cédula' } ],
    guia: { plazo: { dias: 10, tipo: 'habiles' }, nota: 'Plazo: 10 días hábiles desde la notificación. Radícalo ante la misma entidad y pide constancia. La entidad tiene hasta 2 meses para resolver (artículo 86 CPACA); si no responde, se entiende negado (silencio negativo) y puedes demandar.', siNoResponden: 'Si confirman la decisión, queda agotada la vía administrativa: puedes demandar ante la jurisdicción contencioso administrativa (4 meses) con ayuda de un consultorio jurídico, o presentar tutela si hay violación evidente del debido proceso y perjuicio irremediable.' }
  },

  /* ---------------- RECURSO SERVICIOS PÚBLICOS ---------------- */
  {
    id: 'rec_spd', tipo: 'recurso', categoria: 'spd',
    titulo: 'Recurso contra la respuesta de la empresa de servicios públicos (reposición y apelación ante Superservicios)',
    resumen: 'La empresa negó tu reclamo por la factura, el corte o el medidor. Tienes 5 días hábiles desde que conociste la respuesta para presentar reposición y, en subsidio, apelación ante la Superintendencia.',
    palabras: ['recurso', 'servicios públicos', 'superservicios', 'apelación', 'reposición', 'factura', 'reclamo negado', '5 días', 'EPM', 'energía', 'agua'],
    destinatario: { categoria: 'spd', ejemploNombre: 'Ej.: Electrificadora del Caribe (Afinia)', cargo: 'Oficina de Peticiones, Quejas y Recursos' },
    campos: [
      { id: 'cuenta', tipo: 'texto', etiqueta: 'Número de cuenta o contrato', requerido: true, ancho: 'media' },
      { id: 'direccionServicio', tipo: 'texto', etiqueta: 'Dirección del inmueble', requerido: true, ancho: 'media' },
      { id: 'respuesta', tipo: 'texto', etiqueta: 'Número y fecha de la respuesta o decisión de la empresa', requerido: true, ancho: 'completa' },
      { id: 'fechaNotif', tipo: 'fecha', etiqueta: 'Fecha en que conociste la respuesta', requerido: true, ancho: 'media' },
      { id: 'facturas', tipo: 'texto', etiqueta: 'Facturas o períodos en discusión', ancho: 'media' },
      { id: 'queDecidio', tipo: 'textarea', etiqueta: '¿Qué decidió la empresa y con qué razones?', requerido: true, filas: 3 },
      { id: 'argumentos', tipo: 'textarea', etiqueta: '¿Por qué está equivocada? (un argumento por línea)', requerido: true, filas: 4, ejemplo: 'Ej.:\nLa empresa dice que el consumo es real pero nunca revisó el medidor ni investigó la desviación.\nEl consumo histórico de 12 meses es de 90.000 pesos y cobran 480.000.\nNo me dieron copia del acta de revisión.' },
      { id: 'valorNoReclamado', tipo: 'texto', etiqueta: 'Valor que SÍ reconoces y pagas (lo no reclamado)', ejemplo: 'Ej.: 90.000', ancho: 'media' }
    ],
    asunto: d => `Recurso de reposición y en subsidio apelación – Cuenta ${d.cuenta || ''} – ${d.respuesta || ''}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${a.Nom} es usuari${a.o} del servicio prestado por ${R.entidad(d)} en ${d.direccionServicio}, cuenta ${d.cuenta}, y presentó reclamación${d.facturas ? ` sobre ${d.facturas}` : ''}.`);
      h.push(`Mediante ${d.respuesta}, conocida el ${R.fechaLarga(d.fechaNotif)}, la empresa decidió: ${R.oracion(d.queDecidio)}`);
      h.push('Este recurso se presenta dentro de los cinco (5) días siguientes al conocimiento de la decisión, conforme al artículo 154 de la Ley 142 de 1994.');
      if (d.valorNoReclamado) h.push(`Se acredita el pago de las sumas no reclamadas (${R.moneda(d.valorNoReclamado) || d.valorNoReclamado}), conforme al artículo 155 de la Ley 142 de 1994.`);
      return h;
    },
    normas: ['cp365', 'l142_152', 'l142_154', 'l142_158', 'l142_146', 'cp29'],
    fundamentos: d => R.relatoAHechos(d.argumentos).map((x, i) => `Motivo de inconformidad ${i + 1}: ${x}`),
    peticiones: [
      { v: 'reponer', inicial: true, fijo: true, t: 'Que revoquen la decisión y corrijan la factura', legal: d => `REPONER la decisión recurrida y, en su lugar, acceder a la reclamación: reliquidar la facturación conforme al consumo real o promedio histórico${d.facturas ? ` de ${d.facturas}` : ''}, y dejar sin efecto los cobros, suspensiones o intereses derivados.` },
      { v: 'apelar', inicial: true, fijo: true, t: 'En subsidio, que envíen la apelación a la Superservicios', legal: 'En subsidio, CONCEDER el recurso de apelación y remitir el expediente completo a la Superintendencia de Servicios Públicos Domiciliarios para que resuelva en segunda instancia.' },
      { v: 'no_suspender', inicial: true, t: 'Que no corten el servicio mientras se decide', legal: 'ABSTENERSE de suspender el servicio o de exigir el pago de las sumas reclamadas mientras se resuelven los recursos.' },
      { v: 'copias', t: 'Que me entreguen copia del expediente de la reclamación', legal: 'Entregar copia íntegra del expediente de la reclamación, incluidas las actas de revisión, lecturas y conceptos técnicos.' }
    ],
    anexos: [ { v: 'respuesta', t: 'Copia de la respuesta de la empresa' }, { v: 'facturas', t: 'Facturas reclamadas e historial de consumos' }, { v: 'pago', t: 'Comprobante de pago de lo no reclamado' }, { v: 'fotos', t: 'Fotos del medidor u otras pruebas' } ],
    guia: { plazo: { dias: 5, tipo: 'habiles' }, nota: 'Plazo: 5 días hábiles desde que conociste la respuesta. Si la empresa no resuelve el recurso en 15 días hábiles, se entiende resuelto a tu favor (silencio positivo).', siNoResponden: 'La Superservicios decide la apelación. Contra su decisión, demanda contenciosa. Si hay personas vulnerables sin servicio, tutela.' }
  },

  /* ---------------- QUEJA SUPERSALUD ---------------- */
  {
    id: 'queja_supersalud', tipo: 'queja', categoria: 'nacional',
    titulo: 'Queja ante la Superintendencia Nacional de Salud contra una EPS o IPS',
    resumen: 'Para que la Supersalud intervenga por negación o demora de servicios, mala atención, cobros indebidos o trabas administrativas. Se puede presentar en paralelo con la tutela.',
    palabras: ['queja', 'supersalud', 'superintendencia de salud', 'EPS', 'IPS', 'mala atención', 'negaron', 'demora', 'cobro', 'PQRD', 'denuncia'],
    destinatario: { categoria: 'nacional', nombre: 'Superintendencia Nacional de Salud', cargo: 'Delegada para la Protección al Usuario' },
    campos: [
      { id: 'eps', tipo: 'texto', etiqueta: 'EPS o IPS contra la que te quejas', requerido: true, lista: 'entidades', ancho: 'completa' },
      { id: 'motivo', tipo: 'checks', etiqueta: '¿Qué pasó?', requerido: true, opciones: [
        { v: 'negacion', t: 'Negaron o demoran un servicio ordenado por el médico', legal: 'la negación o demora injustificada de servicios ordenados por el médico tratante' },
        { v: 'citas', t: 'No hay citas ni agenda (más de 3 días para general, semanas o meses para especialista)', legal: 'la falta de oportunidad en la asignación de citas' },
        { v: 'medicamentos', t: 'No entregan medicamentos completos', legal: 'la entrega incompleta o tardía de medicamentos' },
        { v: 'urgencias', t: 'Negaron atención de urgencias o exigieron pago previo', legal: 'la negación de atención de urgencias o la exigencia de pagos previos' },
        { v: 'maltrato', t: 'Maltrato o mala atención', legal: 'el trato indigno o la mala atención' },
        { v: 'cobros', t: 'Cobros indebidos (copagos, cuotas moderadoras, "paquetes")', legal: 'cobros no autorizados por la ley' },
        { v: 'afiliacion', t: 'Problemas de afiliación, traslado o portabilidad', legal: 'barreras en la afiliación, el traslado o la portabilidad' },
        { v: 'tutela', t: 'No cumplen un fallo de tutela', legal: 'el incumplimiento de un fallo de tutela' }
      ] },
      { id: 'servicio', tipo: 'texto', etiqueta: 'Servicio o situación concreta', ejemplo: 'Ej.: Cita con cardiología ordenada el 2 de agosto; dicen que no hay agenda hasta 2027', ancho: 'completa' },
      { id: 'diagnostico', tipo: 'texto', etiqueta: 'Diagnóstico del paciente', ancho: 'media' },
      { id: 'radicadoEps', tipo: 'texto', etiqueta: 'Radicados de reclamos ante la EPS', ancho: 'media' },
      C.relato({ ejemplo: 'Ej.:\nEl 2 de agosto de 2026 el médico ordenó cita con cardiología por arritmia.\nHe llamado 6 veces; dicen que no hay agenda.\nTengo 71 años y me desmayé dos veces esta semana.' })
    ],
    asunto: d => `Queja contra ${R.mayus(d.eps)} – ${R.lista((d.motivo || []).slice(0, 2).map(v => R.opcionTexto(cd('queja_supersalud', 'motivo'), v)))}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${a.Nom} está afiliad${a.o} o es usuari${a.o} de ${R.mayus(d.eps)}${d.diagnostico ? ` y padece ${d.diagnostico}` : ''}.`);
      h.push(`La entidad ha incurrido en ${R.lista((d.motivo || []).map(v => R.opcionTexto(cd('queja_supersalud', 'motivo'), v)))}${d.servicio ? `: ${R.oracion(d.servicio)}` : '.'}`);
      if (d.radicadoEps) h.push(`Se reclamó directamente a la entidad bajo los radicados ${d.radicadoEps}, sin solución.`);
      return h;
    },
    normas: ['cp49', 'l1751_2', 'l1751_6', 'l1751_14', 'l1438_126', 'res1552', 'res1604', 'cp23'],
    peticiones: [
      { v: 'investigar', inicial: true, t: 'Que investiguen y sancionen a la entidad', legal: d => `Iniciar la investigación administrativa contra ${R.mayus(d.eps)} por los hechos descritos e imponer las sanciones que correspondan.` },
      { v: 'ordenar', inicial: true, t: 'Que ordenen a la EPS prestar el servicio de inmediato', legal: d => `Requerir de manera inmediata a ${R.mayus(d.eps)} para que garantice la prestación del servicio${d.servicio ? ` (${d.servicio})` : ''} e informe a esta Superintendencia y al quejoso las acciones adoptadas.` },
      { v: 'jurisdiccional', t: 'Que resuelvan el caso con su función jurisdiccional (decisión obligatoria)', legal: 'Tramitar la presente solicitud también bajo la función jurisdiccional prevista en el artículo 41 de la Ley 1122 de 2007 y el artículo 126 de la Ley 1438 de 2011, y ordenar a la entidad la prestación del servicio negado.' },
      { v: 'informar', inicial: true, t: 'Que me informen el radicado y el resultado', legal: 'Informar el número de radicado de la queja y comunicar al quejoso las decisiones adoptadas.' }
    ],
    anexos: [ { v: 'cedula', t: 'Copia de la cédula' }, { v: 'ordenes', t: 'Órdenes médicas e historia clínica' }, { v: 'radicados', t: 'Radicados y respuestas de la EPS' }, { v: 'fallo', t: 'Fallo de tutela (si existe)' } ],
    guia: { plazo: { dias: 15, tipo: 'habiles' }, nota: 'Se radica en www.supersalud.gov.co (PQRD) o en la línea 01 8000 513 700. No reemplaza la tutela cuando hay urgencia: puedes hacer las dos.', siNoResponden: 'Si el servicio sigue sin prestarse, tutela por salud.' }
  },

  /* ---------------- RECLAMACIÓN CONSUMIDOR ---------------- */
  {
    id: 'queja_consumidor', tipo: 'queja', categoria: 'particular',
    titulo: 'Reclamación directa a un almacén, empresa o vendedor (garantía, producto defectuoso, publicidad engañosa)',
    resumen: 'Paso obligatorio antes de ir a la Superintendencia de Industria y Comercio: reclamar por escrito al vendedor. Tiene 15 días hábiles para responder.',
    palabras: ['consumidor', 'garantía', 'producto', 'defectuoso', 'devolución', 'dinero', 'almacén', 'tienda', 'compra', 'internet', 'publicidad engañosa', 'SIC', 'celular', 'electrodoméstico', 'servicio', 'viaje', 'cancelaron'],
    destinatario: { categoria: 'particular', ejemploNombre: 'Ej.: Almacenes Éxito S.A. / Tienda virtual XYZ', cargo: 'Representante legal / Servicio al cliente' },
    campos: [
      { id: 'producto', tipo: 'texto', etiqueta: 'Producto o servicio comprado (marca, modelo, referencia)', requerido: true, ancho: 'completa' },
      { id: 'fechaCompra', tipo: 'fecha', etiqueta: 'Fecha de compra', requerido: true, ancho: 'media' },
      { id: 'valor', tipo: 'texto', etiqueta: 'Valor pagado', requerido: true, ancho: 'media' },
      { id: 'factura', tipo: 'texto', etiqueta: 'Número de factura o pedido', ancho: 'media' },
      { id: 'canal', tipo: 'select', etiqueta: '¿Dónde compraste?', opciones: [ { v: 'tienda', t: 'En tienda física', legal: 'en el establecimiento comercial' }, { v: 'internet', t: 'Por internet o redes sociales', legal: 'a través de comercio electrónico' }, { v: 'telefono', t: 'Por teléfono o a domicilio', legal: 'mediante venta a distancia' } ], valorInicial: 'tienda', ancho: 'media' },
      { id: 'problema', tipo: 'select', etiqueta: '¿Qué pasó?', requerido: true, opciones: [
        { v: 'defecto', t: 'El producto salió defectuoso o dejó de funcionar', legal: 'el producto presenta defectos de calidad o funcionamiento' },
        { v: 'no_llego', t: 'No me lo entregaron o llegó otro', legal: 'el producto no fue entregado o se entregó uno distinto' },
        { v: 'garantia', t: 'No me hacen válida la garantía o la reparación no sirvió', legal: 'el proveedor se niega a hacer efectiva la garantía o la reparación fue ineficaz' },
        { v: 'publicidad', t: 'No era lo que anunciaron (publicidad engañosa)', legal: 'el producto no corresponde a lo ofrecido en la publicidad o la información suministrada' },
        { v: 'retracto', t: 'Quiero devolverlo (compra por internet, en 5 días hábiles)', legal: 'se ejerce el derecho de retracto dentro de los cinco días hábiles siguientes a la entrega' },
        { v: 'servicio', t: 'Un servicio mal prestado o cancelado (viaje, evento, curso)', legal: 'el servicio fue prestado de manera deficiente o fue cancelado' },
        { v: 'cobro', t: 'Cobros no autorizados o cláusulas abusivas', legal: 'se realizaron cobros no autorizados o se aplican cláusulas abusivas' }
      ], ancho: 'completa' },
      { id: 'queQuiere', tipo: 'select', etiqueta: '¿Qué quieres?', requerido: true, opciones: [ { v: 'reparar', t: 'Que lo reparen gratis', legal: 'la reparación totalmente gratuita del producto' }, { v: 'cambiar', t: 'Que lo cambien por uno nuevo', legal: 'el cambio del producto por uno nuevo de las mismas características' }, { v: 'devolver', t: 'Que me devuelvan el dinero', legal: 'la devolución del dinero pagado' }, { v: 'cumplir', t: 'Que cumplan lo ofrecido', legal: 'el cumplimiento de lo ofrecido' } ], valorInicial: 'devolver', ancho: 'completa' },
      C.relato({ ejemplo: 'Ej.:\nCompré un televisor el 10 de julio de 2026 por 1.800.000 pesos.\nA los 20 días dejó de encender.\nLo llevé al servicio técnico el 5 de agosto; dicen que es "mal uso" sin revisarlo.' })
    ],
    asunto: d => `Reclamación directa (Ley 1480 de 2011) – ${d.producto || 'producto'}${d.factura ? ` – Factura ${d.factura}` : ''}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`El ${R.fechaLarga(d.fechaCompra)}, ${a.nom} adquirió de ${R.entidad(d)}, ${R.opcionTexto(cd('queja_consumidor', 'canal'), d.canal)}, ${d.producto} por un valor de ${R.moneda(d.valor) || d.valor}${d.factura ? ` (factura o pedido No. ${d.factura})` : ''}.`);
      h.push(`Se presenta la siguiente situación: ${R.opcionTexto(cd('queja_consumidor', 'problema'), d.problema)}.`);
      return h;
    },
    normas: ['l1480_7', 'l1480_23', 'l1480_58', 'cp83'],
    fundamentos: d => {
      const f = [];
      if (d.problema === 'retracto') f.push('El artículo 47 de la Ley 1480 de 2011 reconoce el derecho de retracto en las ventas por métodos no tradicionales o a distancia, dentro de los cinco (5) días hábiles siguientes a la entrega del bien o a la celebración del contrato, con devolución del dinero en máximo treinta (30) días calendario.');
      if (d.problema === 'no_llego' || d.canal === 'internet') f.push('Los artículos 49 a 54 de la Ley 1480 de 2011 regulan el comercio electrónico y obligan al proveedor a entregar el producto en el plazo ofrecido, a mantener mecanismos de atención de reclamos y a reversar el pago cuando el producto no se entrega, no corresponde a lo pedido o resulta defectuoso (artículo 51).');
      if (d.problema === 'defecto' || d.problema === 'garantia') f.push('Conforme al artículo 11 de la Ley 1480 de 2011, la garantía comprende la reparación gratuita (incluido transporte); si el defecto se repite o la reparación no es posible, el consumidor elige entre un producto nuevo o la devolución del dinero. La carga de probar el "mal uso" corresponde al proveedor (artículo 10).');
      return f;
    },
    peticiones: [
      { v: 'principal', inicial: true, fijo: true, t: 'Lo que pides (reparación, cambio, devolución o cumplimiento)', legal: d => `Hacer efectiva la garantía legal mediante ${R.opcionTexto(cd('queja_consumidor', 'queQuiere'), d.queQuiere)}, dentro de los quince (15) días hábiles siguientes a la recepción de esta reclamación.` },
      { v: 'responder', inicial: true, t: 'Que respondan por escrito en 15 días hábiles', legal: 'Responder por escrito esta reclamación dentro de los quince (15) días hábiles siguientes, conforme al Decreto 735 de 2013, indicando la decisión y sus razones.' },
      { v: 'transporte', t: 'Que asuman el transporte y los costos de revisión', legal: 'Asumir los costos de transporte, diagnóstico y revisión técnica del producto, que no pueden trasladarse al consumidor durante la garantía.' },
      { v: 'informe', t: 'Que me entreguen el informe técnico', legal: 'Entregar copia del informe técnico que sustente cualquier negativa de garantía.' }
    ],
    anexos: [ { v: 'factura', t: 'Factura, pedido o comprobante de pago' }, { v: 'fotos', t: 'Fotos o videos del defecto' }, { v: 'chats', t: 'Conversaciones con el vendedor o servicio técnico' }, { v: 'publicidad', t: 'Pantallazos de la publicidad o la oferta' } ],
    guia: { plazo: { dias: 15, tipo: 'habiles' }, nota: 'Guarda prueba de envío (correo, chat, carta con firma de recibido). Si no responden en 15 días hábiles, se entiende que aceptan.', siNoResponden: 'Demanda de protección al consumidor ante la Superintendencia de Industria y Comercio (www.sic.gov.co, gratis y sin abogado para cuantías menores) anexando esta reclamación.' }
  },

  /* ---------------- QUEJA DEFENSOR CONSUMIDOR FINANCIERO ---------------- */
  {
    id: 'queja_financiera', tipo: 'queja', categoria: 'financiera',
    titulo: 'Queja ante el Defensor del Consumidor Financiero o la Superintendencia Financiera',
    resumen: 'El banco, la aseguradora o el fondo de pensiones no resolvió tu reclamo, te cobró indebidamente, no reversó un fraude o te atendió mal. El Defensor es gratuito y obligatorio en cada entidad.',
    palabras: ['queja', 'banco', 'defensor del consumidor financiero', 'superfinanciera', 'seguro', 'aseguradora', 'fraude', 'cobro', 'crédito', 'tarjeta', 'pensiones', 'SOAT', 'póliza'],
    destinatario: { categoria: 'financiera', ejemploNombre: 'Ej.: Defensor del Consumidor Financiero de Bancolombia / Superintendencia Financiera de Colombia', cargo: 'Defensor del Consumidor Financiero' },
    campos: [
      { id: 'entidadVigilada', tipo: 'texto', etiqueta: 'Entidad financiera contra la que te quejas', requerido: true, lista: 'entidades', ancho: 'completa' },
      { id: 'producto', tipo: 'texto', etiqueta: 'Producto (crédito, tarjeta, cuenta, póliza, pensión)', requerido: true, ancho: 'completa' },
      { id: 'motivo', tipo: 'checks', etiqueta: '¿Qué pasó?', requerido: true, opciones: [
        { v: 'no_respuesta', t: 'No respondieron mi reclamo o respondieron mal', legal: 'la falta de respuesta de fondo a la reclamación presentada' },
        { v: 'fraude', t: 'No reversan transacciones fraudulentas', legal: 'la negativa a reversar transacciones no reconocidas' },
        { v: 'cobros', t: 'Cobros, intereses o seguros indebidos', legal: 'cobros no pactados o no informados' },
        { v: 'seguro', t: 'La aseguradora no paga el siniestro o la póliza', legal: 'la objeción o el no pago injustificado de la reclamación de seguro' },
        { v: 'informacion', t: 'No me dieron información clara (cláusulas, tasas)', legal: 'la falta de información clara, veraz y oportuna' },
        { v: 'cobranza', t: 'Cobranza abusiva', legal: 'prácticas de cobranza abusivas' },
        { v: 'reporte', t: 'Reporte indebido en centrales de riesgo', legal: 'el reporte indebido en centrales de riesgo' }
      ] },
      { id: 'radicado', tipo: 'texto', etiqueta: 'Radicado del reclamo ante la entidad y fecha', ancho: 'completa' },
      { id: 'valor', tipo: 'texto', etiqueta: 'Valor en discusión', ancho: 'media' },
      C.relato()
    ],
    asunto: d => `Queja contra ${R.mayus(d.entidadVigilada)} – ${d.producto || ''}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${a.Nom} es consumidor${a.g === 'f' ? 'a' : ''} financier${a.o} de ${R.mayus(d.entidadVigilada)}, titular de ${d.producto}.`);
      h.push(`La entidad ha incurrido en ${R.lista((d.motivo || []).map(v => R.opcionTexto(cd('queja_financiera', 'motivo'), v)))}${d.valor ? `, por un valor de ${R.moneda(d.valor) || d.valor}` : ''}.`);
      if (d.radicado) h.push(`Se reclamó directamente a la entidad (${d.radicado}) sin solución satisfactoria.`);
      return h;
    },
    normas: ['l1328_7', 'l1328_13', 'cp23', 'l1755_33', 'cp83'],
    fundamentos: d => {
      const f = [];
      if ((d.motivo || []).includes('seguro')) f.push('Conforme al artículo 1080 del Código de Comercio, la aseguradora debe pagar el siniestro dentro del mes siguiente a la fecha en que el asegurado acredite su ocurrencia y cuantía; la objeción debe ser seria, fundada y oportuna, y la mora genera intereses moratorios.');
      if ((d.motivo || []).includes('fraude')) f.push('La Corte Suprema de Justicia (Sentencia SC-5157 de 2019) y la Superintendencia Financiera han señalado que las entidades financieras asumen los riesgos de las operaciones fraudulentas realizadas con sus productos cuando no demuestran la culpa del cliente ni la idoneidad de sus sistemas de seguridad.');
      return f;
    },
    peticiones: [
      { v: 'resolver', inicial: true, t: 'Que el Defensor estudie la queja y emita decisión', legal: d => `Admitir y tramitar la presente queja contra ${R.mayus(d.entidadVigilada)}, requerir a la entidad y emitir decisión motivada sobre los hechos descritos.` },
      { v: 'ordenar', inicial: true, t: 'Que la entidad corrija, devuelva o pague lo que corresponde', legal: d => `Recomendar u ordenar a ${R.mayus(d.entidadVigilada)} ${R.lista((d.motivo || []).map(v => ({ no_respuesta: 'responder de fondo la reclamación', fraude: 'reversar las transacciones no reconocidas', cobros: 'devolver los cobros indebidos', seguro: 'pagar la indemnización del seguro con intereses', informacion: 'entregar la información completa del producto', cobranza: 'cesar las prácticas de cobranza abusivas', reporte: 'eliminar el reporte negativo' }[v])))}.` },
      { v: 'superfinanciera', t: 'Que trasladen la queja a la Superintendencia Financiera si la entidad no acata', legal: 'En caso de que la entidad no acate la decisión, trasladar la queja a la Superintendencia Financiera de Colombia para que ejerza sus funciones de supervisión y sanción.' },
      { v: 'informar', inicial: true, t: 'Que me informen el radicado y la decisión', legal: 'Informar el número de radicado y comunicar la decisión en la dirección y el correo indicados.' }
    ],
    anexos: [ { v: 'cedula', t: 'Copia de la cédula' }, { v: 'reclamo', t: 'Reclamo previo a la entidad y respuesta' }, { v: 'extractos', t: 'Extractos, contrato, póliza' }, { v: 'pruebas', t: 'Pruebas de los hechos (pantallazos, denuncia, llamadas)' } ],
    guia: { plazo: { dias: 15, tipo: 'habiles' }, nota: 'El Defensor del Consumidor Financiero está en la página web de cada banco. También puedes presentar la queja directamente en www.superfinanciera.gov.co.', siNoResponden: 'Demanda ante la Superintendencia Financiera (función jurisdiccional, sin abogado si es de menor cuantía) o ante un juez civil.' }
  },

  /* ---------------- HÁBEAS DATA: RECLAMO ---------------- */
  {
    id: 'hd_reclamo', tipo: 'habeas', categoria: 'financiera',
    titulo: 'Reclamo de hábeas data: eliminar o corregir un reporte en Datacrédito o TransUnion',
    resumen: 'Paso obligatorio antes de la tutela. Se envía a la entidad que reportó (fuente) y a la central de riesgo. Deben responder en 15 días hábiles.',
    palabras: ['hábeas data', 'habeas data', 'Datacrédito', 'TransUnion', 'reporte', 'eliminar', 'corregir', 'central de riesgo', 'deuda', 'pagué', 'caducidad', 'reclamo'],
    destinatario: { categoria: 'financiera', ejemploNombre: 'Ej.: Banco Falabella / Datacrédito Experian', cargo: 'Oficina de hábeas data / Representante legal' },
    campos: [
      { id: 'quienReporta', tipo: 'texto', etiqueta: 'Entidad que te reportó (fuente)', requerido: true, ancho: 'media' },
      { id: 'central', tipo: 'select', etiqueta: 'Central donde aparece', opciones: cd('tut_habeas_data', 'central').opciones, valorInicial: 'datacredito', ancho: 'media' },
      { id: 'motivo', tipo: 'select', etiqueta: '¿Por qué debe eliminarse o corregirse?', requerido: true, opciones: cd('tut_habeas_data', 'motivo').opciones, ancho: 'completa' },
      { id: 'obligacion', tipo: 'texto', etiqueta: 'Obligación reportada (producto, número, valor)', requerido: true, ancho: 'completa' },
      { id: 'fechaMora', tipo: 'fecha', etiqueta: 'Fecha de inicio de la mora (si la sabes)', ancho: 'media' },
      { id: 'fechaPago', tipo: 'fecha', etiqueta: 'Fecha de pago (si pagaste)', ancho: 'media' },
      C.relato({ requerido: false, etiqueta: 'Detalles adicionales (opcional)' })
    ],
    asunto: d => 'Reclamo de hábeas data (artículo 16 de la Ley 1266 de 2008) – Solicitud de eliminación o corrección de dato negativo',
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${d.quienReporta} reportó a ${a.nom} en ${R.opcionTexto(cd('hd_reclamo', 'central'), d.central, 't')} por la obligación ${d.obligacion}${d.fechaMora ? `, con mora desde ${R.fechaLarga(d.fechaMora)}` : ''}.`);
      h.push(`El dato debe eliminarse o corregirse porque ${R.opcionTexto(cd('hd_reclamo', 'motivo'), d.motivo)}${d.fechaPago ? `. La obligación fue pagada el ${R.fechaLarga(d.fechaPago)}` : ''}.`);
      return h;
    },
    normas: ['cp15', 'l1266_6', 'l1266_8', 'l1266_12', 'l1266_13', 'l1266_16', 'l2157'],
    peticiones: [
      { v: 'eliminar', inicial: true, t: 'Que eliminen o corrijan el dato en 15 días hábiles', legal: 'Eliminar o corregir el dato negativo reportado y actualizar la información en todas las centrales de riesgo, dentro de los quince (15) días hábiles siguientes.' },
      { v: 'leyenda', inicial: true, t: 'Que mientras tanto pongan la leyenda "reclamo en trámite"', legal: 'Incluir de inmediato en el registro la leyenda "reclamo en trámite" mientras se resuelve, conforme al numeral II del artículo 16 de la Ley 1266 de 2008.' },
      { v: 'prueba', inicial: true, t: 'Que me envíen la prueba de la comunicación previa y la autorización', legal: 'Entregar copia de la comunicación previa al reporte (artículo 12 de la Ley 1266 de 2008), con prueba de su envío y recibo, y de la autorización para el tratamiento de datos.' },
      { v: 'certificar', t: 'Que certifiquen la eliminación', legal: 'Expedir certificación de la eliminación o corrección del dato una vez realizada.' },
      { v: 'responder', inicial: true, t: 'Que respondan por escrito', legal: 'Responder por escrito este reclamo dentro del término legal, en la dirección y el correo indicados.' }
    ],
    anexos: [ { v: 'cedula', t: 'Copia de la cédula' }, { v: 'historial', t: 'Historial de crédito (gratis una vez al mes en la página de la central)' }, { v: 'pago', t: 'Paz y salvo o comprobante de pago' }, { v: 'denuncia', t: 'Denuncia por suplantación (si aplica)' } ],
    guia: { plazo: { dias: 15, tipo: 'habiles' }, nota: 'Envíalo a la fuente (quien reportó) Y a la central (Datacrédito: www.datacredito.com.co; TransUnion: www.transunion.co). Guarda los radicados.', siNoResponden: 'Pasados 15 días hábiles (o 23 si avisaron prórroga) sin solución: "Tutela por hábeas data". También queja ante la Superintendencia de Industria y Comercio.' }
  },

  /* ---------------- HÁBEAS DATA: SUPRESIÓN DATOS PERSONALES ---------------- */
  {
    id: 'hd_supresion', tipo: 'habeas', categoria: 'particular',
    titulo: 'Solicitud para que dejen de usar tus datos (llamadas, mensajes, publicidad, cobranza a terceros)',
    resumen: 'Pedir a una empresa que elimine tus datos, deje de llamarte o enviarte mensajes, corrija información o te diga de dónde sacó tus datos. Ley 1581 de 2012.',
    palabras: ['datos personales', 'llamadas', 'mensajes', 'spam', 'publicidad', 'cobranza', 'eliminar datos', 'supresión', 'autorización', 'Ley 1581', 'SIC', 'privacidad', 'WhatsApp'],
    destinatario: { categoria: 'particular', ejemploNombre: 'Ej.: Empresa de cobranzas XYZ / Operador de telefonía / Tienda en línea', cargo: 'Oficial de protección de datos / Representante legal' },
    campos: [
      { id: 'tramite', tipo: 'checks', etiqueta: '¿Qué quieres?', requerido: true, opciones: [
        { v: 'suprimir', t: 'Que eliminen mis datos de sus bases', legal: 'la supresión de mis datos personales de sus bases de datos' },
        { v: 'revocar', t: 'Que dejen de usarlos (revoco la autorización)', legal: 'la revocatoria de la autorización para el tratamiento de mis datos' },
        { v: 'llamadas', t: 'Que dejen de llamarme o escribirme', legal: 'el cese de las llamadas, mensajes y comunicaciones' },
        { v: 'terceros', t: 'Que dejen de contactar a mis familiares o mi trabajo', legal: 'el cese de las comunicaciones a terceros (familiares, compañeros, empleador)' },
        { v: 'origen', t: 'Que me digan de dónde obtuvieron mis datos', legal: 'la información sobre el origen de mis datos y la prueba de la autorización' },
        { v: 'corregir', t: 'Que corrijan datos errados', legal: 'la rectificación de los datos inexactos' },
        { v: 'acceso', t: 'Que me entreguen todos los datos que tienen de mí', legal: 'el acceso a la totalidad de los datos que tienen sobre mí' }
      ] },
      { id: 'contacto', tipo: 'texto', etiqueta: 'Número o correo al que te contactan', ancho: 'media' },
      { id: 'frecuencia', tipo: 'texto', etiqueta: 'Frecuencia y horarios de las llamadas o mensajes', ejemplo: 'Ej.: 5 a 8 llamadas diarias, incluso domingos a las 7 a. m.', ancho: 'media' },
      { id: 'relacion', tipo: 'select', etiqueta: '¿Tienes alguna relación con esa empresa?', opciones: [ { v: 'ninguna', t: 'Ninguna, nunca les di mis datos', legal: 'no tiene ni ha tenido relación con la empresa ni le ha dado autorización para tratar sus datos' }, { v: 'cliente', t: 'Fui o soy cliente', legal: 'ha sido cliente, pero no autorizó el uso de sus datos para estos fines' }, { v: 'deuda_ajena', t: 'Me cobran una deuda que no es mía', legal: 'es contactado por una deuda que no le corresponde' }, { v: 'deuda', t: 'Tengo una deuda pero el acoso es abusivo', legal: 'tiene una obligación con la empresa, pero las comunicaciones exceden los límites legales de la cobranza' } ], valorInicial: 'ninguna', ancho: 'completa' },
      C.relato({ requerido: false, etiqueta: 'Detalles adicionales (opcional)' })
    ],
    asunto: d => 'Reclamo de protección de datos personales (Ley 1581 de 2012) – Supresión, revocatoria y cese de comunicaciones',
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${R.entidad(d)} trata datos personales de ${a.nom}${d.contacto ? ` (${d.contacto})` : ''} y ${R.opcionTexto(cd('hd_supresion', 'relacion'), d.relacion)}.`);
      if (d.frecuencia) h.push(`Las comunicaciones se producen con la siguiente frecuencia: ${d.frecuencia}.`);
      h.push(`Se requiere ${R.lista((d.tramite || []).map(v => R.opcionTexto(cd('hd_supresion', 'tramite'), v)))}.`);
      return h;
    },
    normas: ['cp15', 'l1581_8', 'l1581_15', 'sic_hd'],
    fundamentos: d => ['Conforme a los artículos 4, 9 y 10 de la Ley 1581 de 2012 y al Decreto 1377 de 2013, el tratamiento de datos requiere autorización previa, expresa e informada del titular, debe limitarse a la finalidad autorizada y cesar cuando el titular revoca la autorización o solicita la supresión. Las comunicaciones de cobranza a terceros y los contactos fuera de los horarios razonables vulneran además los derechos a la intimidad y al buen nombre.'],
    peticiones: [
      { v: 'todo', inicial: true, fijo: true, t: 'Lo que marcaste arriba', legal: d => (d.tramite || []).map(v => R.capital(R.opcionTexto(cd('hd_supresion', 'tramite'), v)) + ', dentro de los quince (15) días hábiles siguientes.') },
      { v: 'confirmar', inicial: true, t: 'Que confirmen por escrito que lo hicieron', legal: 'Confirmar por escrito, en el correo indicado, la supresión de los datos y el cese de las comunicaciones.' },
      { v: 'sic', inicial: true, t: 'Advertir que acudiré a la SIC si no cumplen', legal: 'Se advierte que, de no atenderse este reclamo en el término legal, se presentará queja ante la Superintendencia de Industria y Comercio (Delegatura de Protección de Datos Personales).' }
    ],
    anexos: [ { v: 'pantallazos', t: 'Pantallazos de llamadas, mensajes o correos' }, { v: 'cedula', t: 'Copia de la cédula' } ],
    guia: { plazo: { dias: 15, tipo: 'habiles' }, siNoResponden: 'Queja ante la Superintendencia de Industria y Comercio (www.sic.gov.co) anexando este reclamo. La SIC puede sancionar y ordenar la supresión.' }
  },

  /* ---------------- FAMILIA: CUOTA ALIMENTARIA ---------------- */
  {
    id: 'fam_alimentos', tipo: 'familia', categoria: 'municipio',
    titulo: 'Solicitud de conciliación de cuota alimentaria (Comisaría o Defensoría de Familia)',
    resumen: 'Para fijar, aumentar o exigir la cuota de alimentos de un hijo o hija. La conciliación es gratuita, no requiere abogado y es el paso previo a la demanda.',
    palabras: ['alimentos', 'cuota alimentaria', 'hijo', 'hija', 'padre', 'madre', 'comisaría de familia', 'defensoría de familia', 'conciliación', 'manutención', 'ICBF', 'no paga', 'inasistencia alimentaria'],
    destinatario: { categoria: 'municipio', ejemploNombre: 'Ej.: Comisaría Segunda de Familia de Soacha / ICBF Centro Zonal Sur', cargo: 'Comisario(a) de Familia / Defensor(a) de Familia' },
    campos: [
      { id: 'menores', tipo: 'textarea', etiqueta: 'Nombre, edad y documento de cada hijo o hija', requerido: true, filas: 2, ejemplo: 'Ej.:\nSara Valentina Gómez Ruiz, 8 años, TI 1.030.456.789\nJuan David Gómez Ruiz, 4 años, RC 123456' },
      { id: 'obligado', tipo: 'texto', etiqueta: 'Nombre y documento del padre o madre que debe pagar', requerido: true, ancho: 'completa' },
      { id: 'obligadoDireccion', tipo: 'texto', etiqueta: 'Dirección, teléfono o lugar de trabajo del obligado (para citarlo)', requerido: true, ancho: 'completa' },
      { id: 'obligadoIngresos', tipo: 'texto', etiqueta: 'Ingresos u ocupación del obligado (lo que sepas)', ejemplo: 'Ej.: Conductor de Uber, aproximadamente 2.500.000 al mes', ancho: 'completa' },
      { id: 'gastos', tipo: 'textarea', etiqueta: 'Gastos mensuales de los niños (alimentación, colegio, salud, vestuario, transporte, recreación)', requerido: true, filas: 3 },
      { id: 'cuotaPedida', tipo: 'texto', etiqueta: 'Cuota mensual que pides', requerido: true, ancho: 'media' },
      { id: 'cuotaActual', tipo: 'texto', etiqueta: '¿Cuánto aporta actualmente?', ejemplo: 'Ej.: nada / 200.000 de vez en cuando', ancho: 'media' },
      { id: 'tramite', tipo: 'select', etiqueta: '¿Qué buscas?', opciones: [ { v: 'fijar', t: 'Fijar la cuota por primera vez', legal: 'la fijación de la cuota alimentaria' }, { v: 'aumentar', t: 'Aumentar una cuota ya fijada', legal: 'el aumento de la cuota alimentaria' }, { v: 'exigir', t: 'Exigir el cumplimiento de una cuota ya acordada', legal: 'el cumplimiento de la cuota alimentaria ya fijada' } ], valorInicial: 'fijar', ancho: 'completa' },
      C.relato({ requerido: false, etiqueta: 'Contexto adicional (opcional)' })
    ],
    asunto: d => `Solicitud de audiencia de conciliación – ${R.opcionTexto(cd('fam_alimentos', 'tramite'), d.tramite)}`,
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${a.Nom} tiene a su cargo el cuidado de: ${R.relatoAHechos(d.menores).join(' ')}`);
      h.push(`El padre/madre de los menores es ${d.obligado}, quien puede ser citado en ${d.obligadoDireccion}${d.obligadoIngresos ? ` y cuya ocupación e ingresos son: ${d.obligadoIngresos}` : ''}.`);
      h.push(`Los gastos mensuales de los menores son: ${R.oracion(d.gastos)}`);
      h.push(`Actualmente el obligado aporta: ${d.cuotaActual || 'nada'}. Se solicita ${R.opcionTexto(cd('fam_alimentos', 'tramite'), d.tramite)} en una suma mensual de ${R.moneda(d.cuotaPedida) || d.cuotaPedida}, más el cincuenta por ciento (50 %) de los gastos de salud, educación y vestuario no cubiertos, y la cuota adicional de diciembre.`);
      return h;
    },
    normas: ['cp44', 'cp42', 'l1098_24', 'l1098_111'],
    fundamentos: d => ['Conforme al artículo 129 de la Ley 1098 de 2006, si el obligado no comparece a la conciliación o no hay acuerdo, el Comisario o Defensor de Familia fijará provisionalmente la cuota y dará apertura al proceso judicial, pudiendo decretar embargos hasta del 50 % del salario. La inasistencia alimentaria es además un delito (artículo 233 del Código Penal).'],
    peticiones: [
      { v: 'citar', inicial: true, fijo: true, t: 'Que citen al obligado a audiencia de conciliación', legal: d => `Citar a ${d.obligado} a audiencia de conciliación para ${R.opcionTexto(cd('fam_alimentos', 'tramite'), d.tramite)} a favor de los menores relacionados.` },
      { v: 'fijar', inicial: true, t: 'Que fijen la cuota pedida (y provisionalmente si no asiste)', legal: d => `Fijar la cuota alimentaria mensual en ${R.moneda(d.cuotaPedida) || d.cuotaPedida}, más el 50 % de los gastos extraordinarios de salud, educación y vestuario y una cuota adicional en diciembre, y fijarla provisionalmente en caso de inasistencia o falta de acuerdo.` },
      { v: 'embargo', t: 'Que ordenen el descuento directo del salario', legal: 'Oficiar al empleador del obligado para que descuente directamente la cuota de su salario y la consigne a la cuenta que se indique.' },
      { v: 'judicial', t: 'Si no hay acuerdo, que remitan al juez de familia', legal: 'En caso de no lograrse acuerdo o de incumplimiento, remitir las diligencias al juez de familia para el proceso de alimentos, conforme al artículo 129 de la Ley 1098 de 2006.' }
    ],
    anexos: [ { v: 'registros', t: 'Registros civiles de nacimiento de los hijos' }, { v: 'cedula', t: 'Copia de la cédula' }, { v: 'gastos', t: 'Recibos de colegio, salud, alimentación, arriendo' }, { v: 'ingresos', t: 'Pruebas de los ingresos del obligado (si las tienes)' } ],
    guia: { plazo: { dias: 15, tipo: 'habiles' }, nota: 'La Comisaría o el ICBF deben programar la audiencia en los días siguientes. Lleva los registros civiles. No necesitas abogado.', siNoResponden: 'Si el obligado no paga la cuota fijada: proceso ejecutivo de alimentos ante juez de familia (consultorio jurídico gratuito) y denuncia por inasistencia alimentaria ante la Fiscalía.' }
  },

  /* ---------------- FAMILIA: MEDIDA DE PROTECCIÓN ---------------- */
  {
    id: 'fam_proteccion', tipo: 'familia', categoria: 'municipio',
    titulo: 'Solicitud de medida de protección por violencia intrafamiliar',
    resumen: 'Para que el Comisario de Familia ordene al agresor salir de la casa, no acercarse, no contactarte, y disponga protección policial. Plazo: 30 días desde los hechos (pero se puede pedir siempre que haya riesgo). En emergencia llama al 123 o 155.',
    palabras: ['violencia intrafamiliar', 'maltrato', 'agresión', 'golpes', 'amenazas', 'pareja', 'esposo', 'expareja', 'comisaría de familia', 'medida de protección', 'desalojo', 'mujer', 'niños', 'Línea 155'],
    destinatario: { categoria: 'municipio', ejemploNombre: 'Ej.: Comisaría Primera de Familia de Bogotá – Localidad de Kennedy', cargo: 'Comisario(a) de Familia' },
    campos: [
      { id: 'agresor', tipo: 'texto', etiqueta: 'Nombre y documento del agresor', requerido: true, ancho: 'media' },
      { id: 'relacionAgresor', tipo: 'select', etiqueta: 'Relación con el agresor', requerido: true, opciones: [ { v: 'conyuge', t: 'Esposo(a) o compañero(a) permanente', legal: 'su cónyuge o compañero(a) permanente' }, { v: 'ex', t: 'Expareja', legal: 'su expareja, con quien convivió o tiene hijos en común' }, { v: 'padre', t: 'Padre o madre', legal: 'su padre o madre' }, { v: 'hijo', t: 'Hijo o hija', legal: 'su hijo(a)' }, { v: 'hermano', t: 'Hermano(a)', legal: 'su hermano(a)' }, { v: 'otro', t: 'Otro familiar que vive en la casa', legal: 'un integrante de su familia que habita en el mismo hogar' } ], ancho: 'media' },
      { id: 'direccionAgresor', tipo: 'texto', etiqueta: 'Dirección donde vive o trabaja el agresor', requerido: true, ancho: 'completa' },
      { id: 'tipoViolencia', tipo: 'checks', etiqueta: '¿Qué tipo de violencia?', requerido: true, opciones: [ { v: 'fisica', t: 'Física (golpes, empujones)', legal: 'violencia física' }, { v: 'psicologica', t: 'Psicológica (insultos, humillaciones, control)', legal: 'violencia psicológica' }, { v: 'amenazas', t: 'Amenazas de muerte o de daño', legal: 'amenazas contra la vida y la integridad' }, { v: 'sexual', t: 'Sexual', legal: 'violencia sexual' }, { v: 'economica', t: 'Económica (no deja trabajar, quita el dinero, no da para los hijos)', legal: 'violencia económica' }, { v: 'ninos', t: 'También contra los niños', legal: 'violencia contra los niños del hogar' } ] },
      { id: 'ultimoHecho', tipo: 'fecha', etiqueta: 'Fecha del último hecho', requerido: true, ancho: 'media' },
      { id: 'convive', tipo: 'radio', etiqueta: '¿Vive contigo actualmente?', opciones: [ { v: 'si', t: 'Sí' }, { v: 'no', t: 'No' } ], valorInicial: 'si', ancho: 'media' },
      { id: 'hechos', tipo: 'textarea', etiqueta: 'Describe los hechos (qué pasó, cuándo, dónde, quién vio)', requerido: true, filas: 5 },
      { id: 'medidas', tipo: 'checks', etiqueta: '¿Qué medidas necesitas?', requerido: true, opciones: [
        { v: 'desalojo', t: 'Que el agresor salga de la casa', legal: 'ordenar al agresor el desalojo de la casa de habitación que comparte con la víctima' },
        { v: 'no_acercarse', t: 'Que no se me acerque ni a mi casa, trabajo o estudio', legal: 'ordenar al agresor abstenerse de acercarse a la víctima y a los lugares donde habita, trabaja o estudia' },
        { v: 'no_contacto', t: 'Que no me llame, escriba ni envíe mensajes por terceros', legal: 'ordenar al agresor abstenerse de contactar a la víctima por cualquier medio, directamente o a través de terceros' },
        { v: 'policia', t: 'Protección policial (rondas, acompañamiento)', legal: 'disponer la protección especial de la Policía Nacional a la víctima y su familia' },
        { v: 'armas', t: 'Que le quiten las armas', legal: 'ordenar el decomiso de las armas que posea el agresor' },
        { v: 'hijos', t: 'Custodia provisional de los hijos y regulación de visitas', legal: 'asignar provisionalmente la custodia de los hijos a la víctima y regular las visitas con protección' },
        { v: 'alimentos', t: 'Alimentos provisionales', legal: 'fijar alimentos provisionales a cargo del agresor' },
        { v: 'tratamiento', t: 'Tratamiento psicológico para el agresor', legal: 'ordenar al agresor asistir a tratamiento reeducativo y terapéutico' },
        { v: 'gastos', t: 'Que pague los gastos médicos y de reubicación', legal: 'ordenar al agresor el pago de los gastos de atención médica, psicológica y reubicación de la víctima' }
      ] }
    ],
    asunto: d => 'Solicitud de medida de protección por violencia intrafamiliar – Ley 294 de 1996',
    hechos: d => {
      const a = R.actor(d);
      const h = [];
      h.push(`${a.Nom} es víctima de violencia intrafamiliar por parte de ${d.agresor}, ${R.opcionTexto(cd('fam_proteccion', 'relacionAgresor'), d.relacionAgresor)}, quien ${d.convive === 'si' ? 'convive con la víctima' : 'reside'} en ${d.direccionAgresor}.`);
      h.push(`La violencia ejercida ha sido ${R.lista((d.tipoViolencia || []).map(v => R.opcionTexto(cd('fam_proteccion', 'tipoViolencia'), v)))}. El último hecho ocurrió el ${R.fechaLarga(d.ultimoHecho)}.`);
      h.push(...R.relatoAHechos(d.hechos));
      h.push('La víctima teme por su vida e integridad y por la de los demás integrantes del hogar, y requiere protección inmediata.');
      return h;
    },
    normas: ['cp42', 'cp43', 'cp44', 'cp11', 'l294_4', 'l294_9'],
    fundamentos: d => ['La Ley 1257 de 2008 (artículos 7, 8 y 16 a 18) reconoce el derecho de las mujeres a una vida libre de violencias, a recibir atención integral, a no ser confrontadas con el agresor y a que se adopten medidas de protección y de atención (alojamiento, alimentación, transporte) cuando sea necesario. La Ley 2126 de 2021 fortalece las Comisarías de Familia y les impone actuar con enfoque de género y debida diligencia. La violencia intrafamiliar es además delito (artículo 229 del Código Penal, modificado por la Ley 2197 de 2022), investigable de oficio.'],
    peticiones: [
      { v: 'avocar', inicial: true, fijo: true, t: 'Que admitan la solicitud y dicten medidas provisionales de inmediato', legal: 'Avocar conocimiento de inmediato y dictar las medidas de protección provisionales que la urgencia de la situación exige, conforme al artículo 11 de la Ley 575 de 2000.' },
      { v: 'medidas', inicial: true, fijo: true, t: 'Las medidas que marcaste', legal: d => (d.medidas || []).map(v => R.capital(R.opcionTexto(cd('fam_proteccion', 'medidas'), v)) + '.') },
      { v: 'definitiva', inicial: true, t: 'Que dicten la medida definitiva con la advertencia de sanción al agresor', legal: 'Dictar medida de protección definitiva, advirtiendo al agresor que su incumplimiento acarrea multa y arresto conforme al artículo 7 de la Ley 294 de 1996.' },
      { v: 'fiscalia', t: 'Que remitan a la Fiscalía para la investigación penal', legal: 'Remitir copia de la actuación a la Fiscalía General de la Nación para la investigación del delito de violencia intrafamiliar.' },
      { v: 'atencion', t: 'Que ordenen atención médica y psicológica para la víctima y los niños', legal: 'Ordenar a la EPS o a la Secretaría de Salud brindar atención médica y psicológica inmediata a la víctima y a los niños, conforme al artículo 19 de la Ley 1257 de 2008.' }
    ],
    anexos: [ { v: 'cedula', t: 'Copia de la cédula' }, { v: 'medicina', t: 'Dictamen de Medicina Legal o constancias médicas (pide la valoración en la Comisaría o la Fiscalía)' }, { v: 'pruebas', t: 'Fotos, audios, mensajes, denuncias anteriores' }, { v: 'testigos', t: 'Nombres y teléfonos de testigos' }, { v: 'registros', t: 'Registros civiles de los hijos' } ],
    guia: { plazo: { dias: 4, tipo: 'habiles' }, nota: 'La Comisaría debe avocar conocimiento de inmediato, puede dictar medidas provisionales el mismo día y debe celebrar la audiencia dentro de los 5 a 10 días siguientes. Si estás en peligro ahora, llama al 123 o al 155 y acude a la Fiscalía o a una URI.', siNoResponden: 'Si el agresor incumple la medida: informa de inmediato a la Comisaría (incidente de incumplimiento: multa y arresto) y a la Policía. Si la Comisaría no actúa, tutela por los derechos a la vida y la integridad.' }
  }
  );
})();
