# Análisis: acceso ciudadano a documentos legales en Colombia

Fecha del análisis: 8 de octubre de 2026.

## 1. El problema

En Colombia, los mecanismos que más usan las personas para defender sus derechos no requieren abogado por mandato legal: el derecho de petición (artículo 23 de la Constitución, Ley 1755 de 2015), la acción de tutela (artículo 86 de la Constitución, artículo 14 del Decreto 2591 de 1991: "no será necesario actuar por medio de apoderado"), el incidente de desacato, los recursos administrativos, las reclamaciones ante empresas de servicios públicos (artículo 152 de la Ley 142 de 1994: "en cuanto sea posible el usuario no se vea obligado a acudir a abogados") y las solicitudes ante comisarías de familia.

Aun así, la población civil enfrenta tres barreras:

1. **Conocimiento.** No sabe cuál documento corresponde a su situación, qué norma citar, ante quién presentarlo ni qué plazo exigir.
2. **Miedo a equivocarse.** Teme que un formato mal diligenciado sea rechazado o "no sirva". En la práctica, la ley prohíbe rechazar peticiones por fundamentación inadecuada (artículo 16 de la Ley 1755 de 2015) y la tutela es informal (artículo 14 del Decreto 2591 de 1991), pero la persona no lo sabe.
3. **Costo.** Los honorarios de un abogado por un derecho de petición o una tutela superan con frecuencia el valor económico de lo que se reclama, y la ayuda gratuita (Personerías, Defensoría, consultorios jurídicos) está saturada o es desconocida.

## 2. Magnitud: qué reclaman los colombianos

Cifras verificadas con fuentes oficiales y prensa que las reproduce:

| Año | Tutelas en Colombia | Derecho de petición | Salud | Fuente |
|---|---|---|---|---|
| 2023 | 633.475 | primer lugar | 197.765 (31 %) | Defensoría del Pueblo, informe sobre tutela y salud |
| 2024 | 912.615 | 46,9 % | 29,1 % (más de 265.000) | Corte Constitucional (cifras citadas por trabajo académico) y Defensoría |
| 2025 | más de 1,1 millones | 432.658 | 378.895 (≈312.500 según Defensoría) | Consejo Superior de la Judicatura; Defensoría del Pueblo (abril de 2026) |

Conclusiones para el diseño:

- **El derecho de petición es la puerta de entrada.** Casi la mitad de las tutelas del país se presentan porque una entidad no respondió una petición. Una herramienta que ayude a radicar bien la petición (con constancia, plazo contado y texto claro) y luego la tutela por silencio, cubre por sí sola el caso más frecuente.
- **La salud es el segundo gran bloque** y el más urgente: prestación de servicios (45,6 % de las tutelas de salud), tratamientos integrales (14 %) y medicamentos (12,2 %). Las EPS más demandadas son las del régimen contributivo y subsidiado con mayor número de afiliados.
- **Detrás vienen** el mínimo vital (salarios, incapacidades, pensiones), el debido proceso administrativo, la educación, el hábeas data y la estabilidad laboral reforzada. El Consejo Superior de la Judicatura reporta que la demanda de tutelas creció 162 % entre 2020 y 2025.

## 3. Marco jurídico aplicado en la plataforma

### Derecho de petición (Ley 1755 de 2015)
- Plazos: 15 días hábiles (general), 10 (documentos e información, con aceptación tácita si no responden), 30 (consultas). Prórroga máxima: el doble, avisando antes del vencimiento.
- Contenido mínimo (artículo 16): autoridad, nombres y documento, dirección, objeto, razones, anexos, firma. No puede rechazarse por fundamentación inadecuada.
- Procede ante particulares: organizaciones privadas (artículo 32), personas naturales en subordinación o indefensión (parágrafo 1), cajas de compensación, entidades de seguridad social, sistema financiero y empresas de servicios públicos (artículo 33).
- Anónimas: válidas para quejas y denuncias cuando aportan pruebas (artículo 38 de la Ley 190 de 1995; artículo 69 de la Ley 1952 de 2019).
- Núcleo esencial (Sentencia T-377 de 2000): respuesta pronta, de fondo, clara, congruente y notificada.

### Acción de tutela (Decreto 2591 de 1991)
- Procedencia: subsidiariedad apreciada en concreto (artículo 6), mecanismo transitorio por perjuicio irremediable (artículo 8), contra particulares en los casos del artículo 42 (salud, educación, servicios públicos, subordinación o indefensión, hábeas data).
- Legitimación: por sí mismo, representante o agente oficioso cuando el titular no puede defenderse (artículo 10).
- Contenido (artículo 14): hechos, derecho, autoridad; sin formalidades ni abogado. Juramento de no haber presentado otra por los mismos hechos (artículo 37).
- Medida provisional (artículo 7), fallo en 10 días, cumplimiento en 48 horas (artículo 27), impugnación en 3 días (artículo 31), desacato con arresto hasta 6 meses y multa hasta 20 SMLMV (artículo 52).
- Reparto (Decreto 1069 de 2015, artículo 2.2.3.1.2.1, modificado por el Decreto 333 de 2021 y decretos posteriores): entidades nacionales a jueces del circuito; departamentales, municipales y particulares a jueces municipales; jueces a tribunales superiores. Son reglas de reparto, no de competencia (Autos 124 de 2009 y 193 de 2021). Radicación en línea: Tutela en Línea de la Rama Judicial; la Ley 2213 de 2022 elimina la exigencia de firma manuscrita y presentación personal.

### Normas sectoriales incorporadas
- **Salud:** Ley 1751 de 2015 (artículos 2, 6, 8, 10, 11, 14, 15, 17), Resolución 1604 de 2013 (medicamentos en 48 horas), Resolución 1552 de 2013 (citas generales en 3 días hábiles; autorización de especialista en 5), MIPRES, Sentencias T-760 de 2008 y C-313 de 2014, SU-677 de 2017 (migrantes).
- **Pensiones:** artículo 33 de la Ley 100 de 1993 y artículo 19 del Decreto 656 de 1994 (4 meses), Ley 717 de 2001 (sobrevivientes, 2 meses), Ley 700 de 2001 (pago, 6 meses), Sentencias T-1013 de 2003 y T-257 de 2005.
- **Trabajo:** artículos 57, 65, 127, 134, 239 a 241 del CST; artículo 26 de la Ley 361 de 1997; Sentencias SU-995 de 1999, SU-070 de 2013, SU-049 de 2017; incapacidades (artículo 206 de la Ley 100, artículo 142 del Decreto Ley 019 de 2012, artículo 67 de la Ley 1753 de 2015).
- **Hábeas data:** Ley 1266 de 2008 (artículos 6, 8, 12, 13, 16) modificada por la Ley 2157 de 2021 (permanencia: doble de la mora, máximo 4 años; caducidad a los 8 años), Ley 1581 de 2012.
- **Servicios públicos:** Ley 142 de 1994 (artículos 140, 146, 149, 150, 152 a 155, 158), silencio administrativo positivo, Sentencia T-740 de 2011 (mínimo vital de agua).
- **Procedimiento administrativo:** Ley 1437 de 2011 (artículos 3, 62, 66 a 69, 74 a 80, 87); prescripción de multas de tránsito (artículo 159 de la Ley 769 de 2002) y de impuestos (artículo 817 del Estatuto Tributario, Ley 1066 de 2006).
- **Consumidor y finanzas:** Ley 1480 de 2011 (garantía, reclamación directa, Decreto 735 de 2013), Ley 1328 de 2009 (Defensor del Consumidor Financiero).
- **Educación:** artículos 44 y 67 de la Constitución, Ley 115 de 1994, Ley 1098 de 2006, Sentencia SU-624 de 1999, Decreto 1421 de 2017.
- **Familia:** Ley 1098 de 2006 (alimentos, artículos 24, 111, 129), Ley 294 de 1996, Ley 575 de 2000, Ley 1257 de 2008, Ley 2126 de 2021.
- **Víctimas y seguridad:** Ley 1448 de 2011, Sentencia T-025 de 2004, Decreto 1066 de 2015 (UNP).
- **Municipio:** Ley 136 de 1994, Ley 388 de 1997 y Decreto 1077 de 2015 (licencias en 45 días hábiles), Ley 1801 de 2016 (querellas), Ley 142 (estratificación), Sisbén IV.

## 4. Base de datos de casos (66 plantillas activas)

| Tipo | Casos |
|---|---|
| Derecho de petición (24) | Planeación municipal; problemas del barrio (interés general); Sisbén; Tránsito (prescripción, fotomultas); Hacienda (predial, prescripción); querella ante Inspección de Policía; EPS (autorizaciones); historia clínica; incapacidades; pensiones; empleador; servicios públicos; banco; colegio y universidad; información pública (Ley 1712); copias; queja contra funcionario; Unidad para las Víctimas; Migración Colombia; juzgado o fiscalía; ICBF y comisaría; arrendador; Prosperidad Social (subsidios); petición general |
| Acción de tutela (15) | Salud (servicio negado); tratamiento integral; derecho de petición sin respuesta; salarios (mínimo vital); incapacidades; pensión; estabilidad laboral reforzada; educación; debido proceso; hábeas data; corte de servicios públicos; víctimas; vida y seguridad (UNP); migrantes; tutela general |
| Otros (11) | Incidente de desacato; impugnación; recurso de reposición y apelación; recurso ante empresa de servicios públicos; queja ante Supersalud; reclamación directa al vendedor; queja ante Defensor del Consumidor Financiero; reclamo de hábeas data; supresión de datos personales; cuota alimentaria (hijos menores, hijos mayores que estudian, personas mayores, cónyuges y familiares dependientes: artículos 411 y siguientes del Código Civil, Ley 1850 de 2017, sentencia C-1033 de 2002); medida de protección por violencia intrafamiliar |
| Módulo "Mujeres y madres cabeza de familia" (8 nuevos + 3 existentes) | Denuncia penal por violencia contra la mujer o intrafamiliar (Ley 906 de 2004, Ley 1257 de 2008, Ley 1542 de 2012, Ley 1761 de 2015, Convención de Belém do Pará); tutela por falta de protección (T-735/2017, T-338/2018, T-462/2018, SU-080/2020); declaración juramentada de madre o padre cabeza de familia (Ley 82 de 1993, Ley 1232 de 2008, SU-388 y SU-389 de 2005); petición de prioridad como madre cabeza de familia (Ley 1537 de 2012); licencia de maternidad (CST art. 236, Ley 1822 de 2017, Ley 2114 de 2021, Decreto 780 de 2016); queja por acoso laboral o sexual (Ley 1010 de 2006, art. 210A del Código Penal, Ley 2365 de 2024); salud sexual y reproductiva (C-355/2006, SU-096/2018, C-055/2022, Resolución 051 de 2023, Resolución 459 de 2012, Ley 1412 de 2010); custodia y visitas (Ley 1098 de 2006 arts. 23, 82 y 86). El módulo reúne también la cuota alimentaria, la medida de protección y la tutela por despido en embarazo |

Cada caso define, en lenguaje común, las preguntas que debe responder la persona (con ayudas y ejemplos), y en lenguaje jurídico: el asunto, los hechos estructurados, las normas y sentencias, los argumentos de procedencia (en tutela), las peticiones o pretensiones marcables, los anexos sugeridos y la guía de qué hacer después (dónde radicar, plazo, siguiente paso si no responden).

### 4.1 Módulo de contratos (hojas Minerva)

| Activos | Conservados pero retirados del catálogo |
|---|---|
| Arrendamiento de vivienda (Ley 820 de 2003), compraventa de vehículo, compraventa de bien mueble, contrato de servicio doméstico (CST, Ley 1788 de 2016, Convenio 189 OIT), pagaré (C. de Co. arts. 709 ss.), poder especial, acuerdo de pago y recibo o paz y salvo | Promesa de compraventa de inmueble, arrendamiento de local comercial, contrato de trabajo general y prestación de servicios: son el trabajo habitual de los abogados en negocios entre particulares y no están dirigidos a población vulnerable. Siguen en `js/datos/contratos.js` con la marca `retirado: true` |

Cada contrato se construye con las dos partes (persona o empresa), el papel de quien llena el formulario, cláusulas numeradas con los artículos aplicables, cláusulas opcionales, testigos, firmas con espacio para huella y una guía de qué hacer después (autenticación, traspaso, afiliaciones).

### 4.2 Revisión jurídica y de usabilidad (8 de octubre de 2026)

Dos revisores independientes evaluaron 56 documentos generados con datos realistas. El revisor jurídico verificó 63 sentencias en la relatoría de la Corte Constitucional: 12 citas resultaron erradas o inexistentes y fueron reemplazadas por las decisiones correctas (entre otras, T-224/2020, T-425/2017, T-016/2015, T-246/2018, T-514/2020, C-270/2023, T-168/2010, T-017/2011, T-436/2024, T-029/2025, T-185/2021, T-659/2012, T-086/2020 y las sentencias SC18614-2016 y SC5176-2020 de la Corte Suprema). Se corrigieron reglas derogadas o mal citadas (término del PARD según la Ley 1878/2018, artículos del Código General Disciplinario, Ley 294/1996 y Ley 575/2000, Ley 2220/2022 en lugar de la derogada Ley 640/2001, incapacidades 181-540 según la Sentencia C-270/2023) y se incorporaron normas recientes (Ley 2466/2025 sobre recargos, Ley 2300/2023 sobre cobranza, Ley Estatutaria 2573/2026 sobre suplantación de identidad, régimen de telecomunicaciones de la Resolución CRC 5050/2016 y los Decretos 799/2025 y 1446/2026 sobre reparto). El revisor de usabilidad produjo 22 cambios de flujo y lenguaje (quién presenta el documento, respuestas sin valores por defecto que afirmen hechos, peticiones que siguen al trámite elegido, buscador con más de 500 sinónimos cotidianos, avisos de plazos, privacidad en computadores públicos).

## 5. Decisiones de diseño

- **Lenguaje común adentro, lenguaje legal afuera.** Las etiquetas de los campos son preguntas cotidianas ("¿Qué te ordenaron y no te han dado?"); cada opción tiene su equivalente jurídico que el motor inserta en el documento.
- **Anonimato posible donde la ley lo permite** (peticiones, quejas y denuncias con pruebas), bloqueado donde no (tutela, desacato, recursos).
- **Representación de terceros** (hijos menores, familiares enfermos o mayores) mediante agencia oficiosa o representación legal, con la frase que exige el artículo 10 del Decreto 2591 de 1991.
- **Sujetos de especial protección.** Marcar la condición (adulto mayor, discapacidad, embarazo, víctima, etc.) agrega automáticamente el fundamento constitucional y la solicitud de atención prioritaria.
- **Plazos reales.** Calculadora de días hábiles con los festivos colombianos (Ley 51 de 1983) y fecha de vencimiento del derecho de petición, el fallo de tutela, la impugnación, los recursos y los trámites pensionales.
- **Privacidad.** Todo se procesa en el navegador; "Mis documentos" y "Mis datos" se guardan solo en el dispositivo (localStorage), con exportación e importación de copias.
- **Salida lista para radicar.** Impresión o PDF, descarga en Word (.doc), texto plano y copia al portapapeles; guía lateral con dónde radicar (incluida Tutela en Línea), checklist de anexos y qué hacer si no responden.

## 6. Riesgos y límites

- La jurisprudencia y algunas normas cambian (reparto de tutelas, reforma pensional, "borrón y cuenta nueva 2.0"). La biblioteca de normas (`js/datos/normas.js`) está centralizada para facilitar actualizaciones.
- La herramienta orienta y redacta; no reemplaza la valoración de un abogado en casos complejos (procesos judiciales ordinarios, penales, de tierras). Por eso cada caso remite a Personerías, Defensoría y consultorios jurídicos gratuitos.
- Los documentos dependen de la calidad del relato del usuario; el formulario pide un hecho por línea con fechas y radicados para producir hechos numerados verificables.

## 7. Evolución sugerida

1. ~~Alojamiento público (GitHub Pages, Netlify) y versión instalable (PWA) para uso sin conexión.~~ Hecho: publicada en GitHub Pages, instalable como aplicación (service worker y manifiesto) y disponible como un solo archivo `.html` para copiar en los computadores que La Sueñomotora entrega en zonas sin conexión (`herramientas/empaquetar.js`).
2. Directorio de correos de notificación judicial y PQRS por entidad y municipio.
3. Generación de PDF nativo con firma digital opcional.
4. Más casos: acción popular, acción de cumplimiento, conciliación extrajudicial, denuncia penal, revocatoria directa, solicitudes ante la UGPP, Fomag y regímenes especiales.
5. Revisión periódica por abogados voluntarios y retroalimentación de usuarios sobre resultados (respondido / tutela concedida).

## Fuentes consultadas

- Ley 1755 de 2015 (compilaciones de Función Pública, Colpensiones y DIAN).
- Decreto 333 de 2021 y decretos posteriores sobre reparto de tutelas (Decreto 799 de 2025, Decreto 1446 de 2026).
- Ley 2157 de 2021 y Sentencia C-282 de 2021.
- Resoluciones 1552 y 1604 de 2013 del Ministerio de Salud.
- Ley 100 de 1993 (artículo 33), Decreto 656 de 1994, Ley 717 de 2001, Ley 700 de 2001; Sentencias T-1013 de 2003 y T-257 de 2005.
- Defensoría del Pueblo, informes "La tutela y los derechos a la salud y a la seguridad social" (2024 y 2026); Consejo Superior de la Judicatura, cifras de tutelas 2020-2025; Corte Constitucional, estadísticas 2024.
- Rama Judicial, servicio Tutela en Línea; Ley 2213 de 2022.
