/* ============================================================
   motor.js — Ensambla el documento legal a partir del caso
   elegido y de las respuestas en lenguaje común.
   ============================================================ */
window.AJ = window.AJ || {};

(function () {
  const R = AJ.red;

  /* ---------- Tipos de documento ---------- */
  AJ.tipos = {
    peticion: {
      id: 'peticion', nombre: 'Derecho de petición', plural: 'Derechos de petición', icono: 'carta',
      descripcion: 'Para pedirle algo por escrito a una entidad pública o privada: información, un servicio, una decisión, copias o presentar una queja. Deben responder de fondo en 15 días hábiles (10 para documentos, 30 para consultas).',
      titulo: 'DERECHO DE PETICIÓN', permiteAnonimo: true, saludo: 'Respetados señores:',
      intro: (d, c) => `${R.identificacion(d)} en ejercicio del derecho fundamental de petición consagrado en el artículo 23 de la Constitución Política y regulado por la Ley 1755 de 2015, me dirijo a ustedes respetuosamente para presentar la siguiente petición, con fundamento en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'peticiones', 'anexos', 'notificaciones'],
      cierre: 'Agradezco su atención y quedo atento(a) a su respuesta dentro del término legal.'
    },
    tutela: {
      id: 'tutela', nombre: 'Acción de tutela', plural: 'Acciones de tutela', icono: 'balanza',
      descripcion: 'Para pedirle a un juez que proteja de inmediato un derecho fundamental (salud, petición, mínimo vital, educación, debido proceso). El juez decide en máximo 10 días. No necesitas abogado.',
      titulo: 'ACCIÓN DE TUTELA', permiteAnonimo: false, saludo: 'Respetado(a) señor(a) Juez:',
      intro: (d, c) => `${R.identificacion(d, { tutela: true })} con fundamento en el artículo 86 de la Constitución Política y en el Decreto 2591 de 1991, presento ACCIÓN DE TUTELA contra ${R.entidad(d)}${d.entidadCargo ? `, representada por su ${d.entidadCargo}` : ''}, por la vulneración de los derechos fundamentales que se indican más adelante, con base en los siguientes:`,
      secciones: ['hechos', 'derechos', 'fundamentos', 'procedencia', 'pretensiones', 'medida', 'pruebas', 'juramento', 'notificaciones'],
      cierre: ''
    },
    desacato: {
      id: 'desacato', nombre: 'Incidente de desacato', plural: 'Incidentes de desacato', icono: 'martillo',
      descripcion: 'Cuando ganaste una tutela y la entidad no cumple la orden del juez. Se presenta ante el mismo juez; puede sancionar con arresto y multa.',
      titulo: 'INCIDENTE DE DESACATO', permiteAnonimo: false, saludo: 'Respetado(a) señor(a) Juez:',
      intro: (d, c) => `${R.identificacion(d, { tutela: true })} en mi calidad de parte accionante dentro de la acción de tutela de la referencia, con fundamento en los artículos 27 y 52 del Decreto 2591 de 1991, solicito respetuosamente que se abra INCIDENTE DE DESACATO contra ${R.entidad(d)} por el incumplimiento del fallo de tutela, con base en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'pretensiones', 'pruebas', 'notificaciones'],
      cierre: ''
    },
    impugnacion: {
      id: 'impugnacion', nombre: 'Impugnación de tutela', plural: 'Impugnaciones', icono: 'flecha',
      descripcion: 'Para que un juez superior revise el fallo de tutela que te negaron. Plazo: 3 días hábiles desde la notificación.',
      titulo: 'IMPUGNACIÓN DE FALLO DE TUTELA', permiteAnonimo: false, saludo: 'Respetado(a) señor(a) Juez:',
      intro: (d, c) => `${R.identificacion(d, { tutela: true })} en mi calidad de parte accionante dentro de la acción de tutela de la referencia, con fundamento en el artículo 31 del Decreto 2591 de 1991, presento IMPUGNACIÓN contra la sentencia de primera instancia, con base en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'pretensiones', 'pruebas', 'notificaciones'],
      cierre: ''
    },
    recurso: {
      id: 'recurso', nombre: 'Recursos (reposición y apelación)', plural: 'Recursos', icono: 'documento',
      descripcion: 'Para pedir que una entidad revise y revoque una decisión que te perjudica (resolución, multa, negación). Plazo: 10 días hábiles (5 en servicios públicos).',
      titulo: 'RECURSO DE REPOSICIÓN Y EN SUBSIDIO APELACIÓN', permiteAnonimo: false, saludo: 'Respetados señores:',
      intro: (d, c) => `${R.identificacion(d)} dentro del término legal, interpongo ${c.id === 'rec_spd' ? 'RECURSO DE REPOSICIÓN Y EN SUBSIDIO DE APELACIÓN, con fundamento en los artículos 154 y siguientes de la Ley 142 de 1994,' : (R.opcionTexto(AJ.camposDe('rec_reposicion', 'tipoRecurso'), d.tipoRecurso) || 'recurso de reposición y en subsidio apelación').toUpperCase() + ', con fundamento en los artículos 74 y siguientes de la Ley 1437 de 2011,'} contra la decisión que se identifica en la referencia, con base en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'pretensiones', 'anexos', 'notificaciones'],
      cierre: ''
    },
    queja: {
      id: 'queja', nombre: 'Quejas y reclamaciones', plural: 'Quejas y reclamaciones', icono: 'alerta',
      descripcion: 'Ante superintendencias (salud, financiera) o directamente al vendedor (consumidor). Activan la vigilancia del Estado y son paso previo a otras acciones.',
      titulo: 'QUEJA / RECLAMACIÓN', permiteAnonimo: true, saludo: 'Respetados señores:',
      intro: (d, c) => `${R.identificacion(d)} en ejercicio del derecho de petición (artículo 23 de la Constitución Política) y de los derechos que me asisten como ${c.id === 'queja_consumidor' ? 'consumidor (Ley 1480 de 2011)' : c.id === 'queja_financiera' ? 'consumidor financiero (Ley 1328 de 2009)' : 'usuario del sistema de salud (Ley 1751 de 2015)'}, presento la siguiente ${c.id === 'queja_consumidor' ? 'RECLAMACIÓN DIRECTA' : 'QUEJA'}, con base en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'peticiones', 'anexos', 'notificaciones'],
      cierre: 'Agradezco su atención y quedo atento(a) a su respuesta dentro del término legal.'
    },
    habeas: {
      id: 'habeas', nombre: 'Hábeas data (datos personales)', plural: 'Reclamos de hábeas data', icono: 'escudo',
      descripcion: 'Para corregir o eliminar reportes en centrales de riesgo y para que las empresas dejen de usar tus datos. Es el paso obligatorio antes de la tutela.',
      titulo: 'RECLAMO DE HÁBEAS DATA', permiteAnonimo: false, saludo: 'Respetados señores:',
      intro: (d, c) => `${R.identificacion(d)} en ejercicio del derecho fundamental de hábeas data (artículo 15 de la Constitución Política) y conforme a ${c.id === 'hd_reclamo' ? 'el artículo 16 de la Ley 1266 de 2008' : 'los artículos 14 y 15 de la Ley 1581 de 2012'}, presento el siguiente RECLAMO, con base en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'peticiones', 'anexos', 'notificaciones'],
      cierre: 'Quedo atento(a) a su respuesta dentro del término legal de quince (15) días hábiles.'
    },
    familia: {
      id: 'familia', nombre: 'Familia y protección', plural: 'Solicitudes de familia', icono: 'familia',
      descripcion: 'Cuota alimentaria y medidas de protección por violencia intrafamiliar ante la Comisaría o la Defensoría de Familia. Gratuitas y sin abogado.',
      titulo: 'SOLICITUD', permiteAnonimo: false, saludo: 'Respetado(a) señor(a) Comisario(a) / Defensor(a) de Familia:',
      intro: (d, c) => `${R.identificacion(d)} con fundamento en ${c.id === 'fam_alimentos' ? 'los artículos 24, 111 y 129 de la Ley 1098 de 2006' : 'la Ley 294 de 1996, la Ley 575 de 2000, la Ley 1257 de 2008 y la Ley 2126 de 2021'}, presento la siguiente solicitud, con base en los siguientes:`,
      secciones: ['hechos', 'fundamentos', 'peticiones', 'pruebas', 'notificaciones'],
      cierre: ''
    }
  };

  const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  /* Contracciones y concordancias finales: "de el señor" → "del señor" */
  function pulir(t) {
    // Solo contrae cuando "de"/"a" y "el" son palabras sueltas (\b no reconoce vocales con tilde)
    return String(t == null ? '' : t)
      .replace(/(^|[\s(])de el\(la\)(?=[\s,.;:)])/g, '$1del(la)').replace(/(^|[\s(])a el\(la\)(?=[\s,.;:)])/g, '$1al(la)')
      .replace(/(^|[\s(])de el(?=[\s,.;:)])/g, '$1del').replace(/(^|[\s(])a el(?=[\s,.;:)])/g, '$1al')
      .replace(/\s+([,.;:])/g, '$1').replace(/\.\./g, '.');
  }

  function aplanar(arr) {
    const out = [];
    (arr || []).forEach(x => { if (Array.isArray(x)) out.push(...x.filter(Boolean)); else if (x) out.push(x); });
    return out;
  }

  function evaluar(fn, d, caso) {
    if (typeof fn === 'function') { try { return fn(d, caso); } catch (e) { console.error('Error en plantilla', caso && caso.id, e); return []; } }
    return fn || [];
  }

  /* Resuelve las opciones marcadas de una lista de checks (peticiones, anexos, derechos) */
  function marcadas(lista, valores, d, prop) {
    valores = valores || [];
    const out = [];
    (lista || []).forEach(op => {
      if (!valores.includes(op.v)) return;
      const texto = typeof op[prop] === 'function' ? op[prop](d) : op[prop] || op.t;
      aplanar([texto]).forEach(t => out.push(t));
    });
    return out;
  }

  function fundamentos(caso, d) {
    const out = [];
    (caso.normas || []).forEach(id => {
      const n = AJ.normas[id];
      if (n) out.push(`${n.texto} (${n.cita}).`);
    });
    const esp = R.especialProteccion(d);
    if (esp) out.push(esp);
    if (caso.tipo === 'peticion' || caso.tipo === 'queja' || caso.tipo === 'habeas') {
      const cat = AJ.entidades.categoria(d.categoria);
      if (cat.naturaleza !== 'publica' && !(caso.normas || []).includes('l1755_32')) {
        const n = AJ.normas.l1755_32; out.push(`${n.texto} (${n.cita}).`);
      }
    }
    if (caso.tipo === 'tutela') {
      const p = R.procedenciaParticular(d);
      if (p) out.push(p);
    }
    out.push(...aplanar(evaluar(caso.fundamentos, d, caso)));
    return out;
  }

  /* ---------- Generación ---------- */
  AJ.motor = {
    generar(caso, d) {
      const tipo = AJ.tipos[caso.tipo];
      const b = [];
      const a = R.actor(d);
      const hoy = R.hoy();
      const esJudicial = ['tutela', 'desacato', 'impugnacion'].includes(caso.tipo);

      // Encabezado
      b.push({ k: 'fecha', t: `${d.ciudad || '[Ciudad]'}, ${R.fechaLarga(hoy)}` });
      const dest = [];
      if (caso.tipo === 'tutela') {
        dest.push('Señor(a)', R.juezTutela(d), 'E. S. D.');
      } else if (caso.tipo === 'desacato' || caso.tipo === 'impugnacion') {
        dest.push('Señor(a)', R.mayus(d.juzgado || 'JUEZ DE PRIMERA INSTANCIA'), 'E. S. D.');
      } else {
        dest.push('Señores', R.entidad(d));
        if (d.entidadCargo) dest.push(d.entidadCargo);
        if (d.entidadDireccion) dest.push(d.entidadDireccion);
        if (d.entidadCiudad) dest.push(d.entidadCiudad);
      }
      b.push({ k: 'dest', lines: dest });

      // Referencia
      const ref = [];
      ref.push(`Referencia: ${evaluar(caso.asunto, d, caso) || tipo.titulo}`);
      if (caso.tipo === 'tutela') {
        ref.push(`Accionante: ${a.tercero ? `${a.nombre} (por medio de ${R.mayus(d.nombre)})` : R.mayus(d.nombre)}`);
        ref.push(`Accionado: ${R.entidad(d)}`);
        const der = marcadas(caso.derechos, d.derechos, d, 'legal');
        if (der.length) ref.push(`Derechos invocados: ${R.lista(der.map(x => x.replace(/\s*\(.*?\)\s*/g, ' ').trim()))}`);
      }
      if (caso.tipo === 'desacato' || caso.tipo === 'impugnacion') {
        ref.push(`Radicado: ${d.radicado || ''}`);
        ref.push(`Accionante: ${a.tercero ? a.nombre : R.mayus(d.nombre)}`);
        ref.push(`Accionado: ${R.entidad(d)}`);
      }
      b.push({ k: 'ref', lines: ref });

      b.push({ k: 'p', t: tipo.saludo });
      b.push({ k: 'p', t: tipo.intro(d, caso) });

      let n = 0;
      const titulo = (t) => { n++; b.push({ k: 'h', t: `${ROMANOS[n - 1] || n}. ${t}` }); };

      tipo.secciones.forEach(sec => {
        switch (sec) {
          case 'hechos': {
            const narr = R.relatoAHechos(d.relato);
            if (a.tercero && narr.length) narr[0] = `Según relata quien presenta este escrito: ${narr[0]}`;
            const h = [...aplanar(evaluar(caso.hechos, d, caso)), ...narr];
            if (!h.length) h.push('[Describe aquí los hechos]');
            titulo('HECHOS');
            if (a.tercero) b.push({ k: 'p', t: `Los hechos que se exponen a continuación se refieren a ${a.nom}, en cuyo nombre actúo.` });
            b.push({ k: 'ol', items: h });
            break;
          }
          case 'derechos': {
            const der = marcadas(caso.derechos, d.derechos, d, 'legal');
            const libres = caso.id === 'tut_general' ? marcadas(AJ.camposDe('tut_general', 'derechoLibre').opciones, d.derechoLibre, d, 'legal') : [];
            const todos = [...der, ...libres];
            titulo('DERECHOS FUNDAMENTALES VULNERADOS O AMENAZADOS');
            b.push({ k: 'p', t: `Con los hechos descritos, ${R.entidad(d)} vulnera o amenaza ${todos.length ? 'los siguientes derechos fundamentales' : 'los derechos fundamentales que se indican'} de ${a.nom}:` });
            b.push({ k: 'ul', items: todos.length ? todos.map(R.capital.bind(R)) : ['[Indica los derechos vulnerados]'] });
            break;
          }
          case 'fundamentos': {
            titulo('FUNDAMENTOS DE DERECHO');
            b.push({ k: 'p', t: caso.tipo === 'tutela' ? 'La presente acción se fundamenta en las siguientes normas y decisiones de la Corte Constitucional:' : 'Esta solicitud se fundamenta en las siguientes normas:' });
            fundamentos(caso, d).forEach(t => b.push({ k: 'p', t, sangria: true }));
            break;
          }
          case 'procedencia': {
            titulo('PROCEDENCIA DE LA ACCIÓN');
            const pr = [
              `Legitimación: ${a.tercero ? `${R.mayus(d.nombre)} actúa ${d.afectadoRazon === 'menor' ? 'como representante legal' : 'como agente oficioso'} de ${a.nom}, titular de los derechos, quien ${R.opcionTexto({ opciones: AJ.campos.solicitante({ permiteAnonimo: true }).find(c => c.id === 'afectadoRazon').opciones }, d.afectadoRazon, 'legal')}, conforme al artículo 10 del Decreto 2591 de 1991.` : `${a.Nom} es titular de los derechos fundamentales cuya protección se reclama (artículo 10 del Decreto 2591 de 1991).`} ${R.entidad(d)} es la ${AJ.entidades.categoria(d.categoria).naturaleza === 'publica' ? 'autoridad pública' : 'entidad'} responsable de la acción u omisión que origina la vulneración (artículos 5, 13 y 42 del Decreto 2591 de 1991).`,
              ...aplanar(evaluar(caso.procedencia, d, caso))
            ];
            pr.forEach(t => b.push({ k: 'p', t, sangria: true }));
            break;
          }
          case 'peticiones':
          case 'pretensiones': {
            const items = marcadas(caso.peticiones, d.peticiones, d, 'legal');
            if (d.peticionOtra) items.push(...R.relatoAHechos(d.peticionOtra));
            titulo(sec === 'pretensiones' ? 'PRETENSIONES' : 'PETICIÓN');
            b.push({ k: 'p', t: sec === 'pretensiones' && caso.tipo !== 'recurso' ? 'Con fundamento en lo expuesto, solicito respetuosamente al despacho:' : `Con fundamento en lo anterior, solicito respetuosamente a ${R.entidad(d)}:` });
            b.push({ k: 'ol', items: items.length ? items : ['[Indica lo que solicitas]'] });
            break;
          }
          case 'medida': {
            if (d.urgente === 'si' && caso.medida) {
              titulo('SOLICITUD DE MEDIDA PROVISIONAL');
              b.push({ k: 'p', t: evaluar(caso.medida, d, caso) });
            } else n = n; // sin sección
            break;
          }
          case 'anexos':
          case 'pruebas': {
            const items = marcadas(caso.anexos, d.anexos, d, 't').filter(x => !(R.esAnonimo(d) && /c[ée]dula/i.test(x)));
            if (d.anexosOtros) items.push(...R.relatoAHechos(d.anexosOtros));
            titulo(sec === 'pruebas' ? 'PRUEBAS Y ANEXOS' : 'ANEXOS');
            if (sec === 'pruebas') b.push({ k: 'p', t: 'Solicito tener como pruebas los siguientes documentos, que se anexan, y los demás que el despacho considere pertinentes decretar de oficio:' });
            else b.push({ k: 'p', t: 'Me permito anexar los siguientes documentos:' });
            b.push({ k: 'ol', items: items.length ? items : ['Copia del documento de identidad.'] });
            if (caso.tipo === 'tutela' && d.yaPedi === 'si') b.push({ k: 'p', t: 'Solicito igualmente que, conforme al artículo 19 del Decreto 2591 de 1991, se requiera a la entidad accionada para que rinda informe sobre los hechos y aporte los documentos relacionados con el caso, bajo la advertencia de la presunción de veracidad del artículo 20.' });
            break;
          }
          case 'juramento': {
            titulo('JURAMENTO');
            b.push({ k: 'p', t: `Bajo la gravedad del juramento manifiesto que no he presentado otra acción de tutela por los mismos hechos y derechos ante ninguna otra autoridad judicial (artículo 37 del Decreto 2591 de 1991)${d.otraTutela === 'si' ? ', salvo la que se describe en los hechos, cuyos fundamentos difieren de los aquí expuestos' : ''}.` });
            break;
          }
          case 'notificaciones': {
            titulo('NOTIFICACIONES');
            const mias = [];
            if (R.esAnonimo(d)) {
              mias.push(`Solicito que la respuesta sea enviada al correo electrónico ${d.correo || '[correo]'}${d.correo ? '' : ' o publicada en la página web de la entidad'}.`);
            } else {
              const partes = [];
              if (d.direccion) partes.push(`en la dirección ${d.direccion}${d.ciudad ? `, ${d.ciudad}` : ''}`);
              if (d.correo) partes.push(`en el correo electrónico ${d.correo}`);
              if (d.telefono) partes.push(`en el teléfono ${d.telefono}`);
              mias.push(`${esJudicial ? 'Recibiré notificaciones' : 'Recibiré respuesta y notificaciones'} ${partes.length ? R.lista(partes) : 'en la dirección indicada al pie de mi firma'}.${esJudicial ? ' Autorizo expresamente la notificación por medios electrónicos conforme a la Ley 2213 de 2022.' : ''}`);
            }
            if (esJudicial) {
              mias.push(`${caso.tipo === 'tutela' ? 'La parte accionada' : 'La entidad accionada'}, ${R.entidad(d)}, recibe notificaciones en ${d.entidadDireccion ? d.entidadDireccion : 'su sede principal y en el correo electrónico de notificaciones judiciales registrado ante la autoridad competente'}${d.entidadCiudad ? `, ${d.entidadCiudad}` : ''}.`);
            }
            mias.forEach(t => b.push({ k: 'p', t }));
            break;
          }
        }
      });

      if (tipo.cierre) b.push({ k: 'p', t: tipo.cierre });
      b.push({ k: 'p', t: 'Atentamente,' });

      // Firma
      const firma = [];
      if (R.esAnonimo(d)) {
        firma.push('PETICIONARIO(A) QUE SE RESERVA SU IDENTIDAD');
        if (d.correo) firma.push(`Correo: ${d.correo}`);
      } else {
        firma.push(R.mayus(d.nombre) || '[NOMBRE COMPLETO]');
        firma.push(`${R.tipoDocLegal(d.tipoDoc).replace(/^./, c => c.toUpperCase())} No. ${d.numDoc || '[número]'}${d.expedidaEn ? ` de ${d.expedidaEn}` : ''}`);
        if (a.tercero) firma.push(`En ${d.afectadoRazon === 'menor' ? 'representación' : 'agencia oficiosa'} de ${a.nombre}${a.doc ? ` (${a.doc})` : ''}`);
        if (d.direccion) firma.push(`Dirección: ${d.direccion}${d.ciudad ? `, ${d.ciudad}` : ''}`);
        if (d.telefono) firma.push(`Teléfono: ${d.telefono}`);
        if (d.correo) firma.push(`Correo: ${d.correo}`);
      }
      b.push({ k: 'firma', lines: firma });

      b.forEach(x => { if (x.t) x.t = pulir(x.t); if (x.items) x.items = x.items.map(pulir); if (x.lines) x.lines = x.lines.map(pulir); });
      return { bloques: b, html: this.aHtml(b, tipo, caso), texto: this.aTexto(b, tipo), titulo: tipo.titulo };
    },

    esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },

    aHtml(b, tipo, caso) {
      const e = this.esc.bind(this);
      let h = `<div class="doc-titulo">${e(tipo.titulo)}</div>`;
      b.forEach(x => {
        switch (x.k) {
          case 'fecha': h += `<p class="doc-fecha">${e(x.t)}</p>`; break;
          case 'dest': h += `<p class="doc-dest">${x.lines.map(e).join('<br>')}</p>`; break;
          case 'ref': h += `<p class="doc-ref">${x.lines.map((l, i) => i === 0 ? `<strong>${e(l)}</strong>` : e(l)).join('<br>')}</p>`; break;
          case 'h': h += `<h3 class="doc-h">${e(x.t)}</h3>`; break;
          case 'p': h += `<p class="doc-p${x.sangria ? ' doc-sangria' : ''}">${e(x.t)}</p>`; break;
          case 'ol': h += `<ol class="doc-ol">${x.items.map(i => `<li>${e(i)}</li>`).join('')}</ol>`; break;
          case 'ul': h += `<ul class="doc-ul">${x.items.map(i => `<li>${e(i)}</li>`).join('')}</ul>`; break;
          case 'firma': h += `<div class="doc-firma"><div class="doc-linea"></div>${x.lines.map((l, i) => i === 0 ? `<strong>${e(l)}</strong>` : e(l)).join('<br>')}</div>`; break;
        }
      });
      return h;
    },

    aTexto(b, tipo) {
      const out = [tipo.titulo, ''];
      b.forEach(x => {
        switch (x.k) {
          case 'fecha': out.push(x.t, ''); break;
          case 'dest': out.push(...x.lines, ''); break;
          case 'ref': out.push(...x.lines, ''); break;
          case 'h': out.push('', x.t.toUpperCase(), ''); break;
          case 'p': out.push(x.t, ''); break;
          case 'ol': x.items.forEach((i, k) => out.push(`${k + 1}. ${i}`)); out.push(''); break;
          case 'ul': x.items.forEach(i => out.push(`- ${i}`)); out.push(''); break;
          case 'firma': out.push('', '', '______________________________', ...x.lines); break;
        }
      });
      return out.join('\n');
    },

    /* HTML completo para exportar a Word (.doc) */
    aWord(html, titulo) {
      return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${this.esc(titulo)}</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]--><style>@page{size:21.59cm 27.94cm;margin:2.5cm 3cm}body{font-family:'Times New Roman',Times,serif;font-size:12pt;line-height:1.4;color:#000}.doc-titulo{text-align:center;font-weight:bold;font-size:14pt;margin:0 0 18pt}.doc-fecha{margin:0 0 14pt}.doc-dest{margin:0 0 14pt}.doc-ref{margin:0 0 14pt}.doc-h{font-size:12pt;font-weight:bold;margin:16pt 0 8pt;text-transform:uppercase}.doc-p{text-align:justify;margin:0 0 10pt}.doc-sangria{margin-left:0}.doc-ol,.doc-ul{margin:0 0 10pt 24pt}.doc-ol li,.doc-ul li{text-align:justify;margin-bottom:6pt}.doc-firma{margin-top:40pt}.doc-linea{width:220pt;border-top:1px solid #000;margin-bottom:4pt}</style></head><body>${html}</body></html>`;
    }
  };
})();
