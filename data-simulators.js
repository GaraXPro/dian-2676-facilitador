// ============================================================================
// BANCO DE SIMULADORES: JUICIO SITUACIONAL (PJS), AUTOINFORME, FLASHCARDS, TRD Y LÓGICA
// ============================================================================

window.PJS_CASES = [
  {
    id: "pjs1",
    indicatorId: "ind1",
    blockId: "bloque1",
    title: "Caso 1 — Competencia y Objeto Misional (Decreto 1742 de 2020)",
    context: "Un comerciante acude al punto de contacto de la Dirección Seccional de Impuestos y Aduanas donde usted se desempeña como Facilitador I. El usuario manifiesta su inconformidad porque recibió un cobro coactivo por concepto del Impuesto de Industria y Comercio (ICA) y una sanción por extemporaneidad en la declaración del Impuesto al Valor Agregado (IVA), solicitando que la DIAN anule ambos cobros en un solo trámite.",
    stem: "De acuerdo con el objeto y las competencias asignadas a la DIAN en el Decreto 1742 de 2020, la orientación correcta que usted debe brindar al ciudadano es:",
    options: {
      A: "Recibir la solicitud unificada y trasladarla a la División de Fiscalización de la Dirección Seccional, dado que la DIAN coadyuva a la seguridad fiscal del Estado y tiene competencia sobre todos los tributos que gravan la actividad comercial en el territorio nacional.",
      B: "Indicarle el procedimiento y los canales institucionales para gestionar su solicitud respecto a la sanción del IVA por tratarse de un tributo del orden nacional administrado por la DIAN, e informarle que frente al cobro del ICA debe dirigirse a la administración tributaria municipal o distrital competente.",
      C: "Rechazar de plano la recepción de cualquier documento del comerciante hasta tanto separe las solicitudes, argumentando que la Dirección General en el Nivel Central es la única facultada para dirimir conflictos entre impuestos nacionales y territoriales."
    },
    correct: "B",
    explanation: {
      correctWhy: "Conforme al Artículo 2 del Decreto 1742 de 2020, la competencia de la DIAN en materia tributaria se circunscribe a los impuestos del orden nacional (como el IVA), mientras que el Impuesto de Industria y Comercio (ICA) es un tributo territorial (municipal o distrital) administrado por la respectiva Secretaría de Hacienda. Además, según el Artículo 21 de la Ley 1755 de 2015, ante una solicitud verbal donde hay falta parcial de competencia, se orienta en el acto al ciudadano.",
      distractorA: "Incurre en la trampa de extender la competencia de la DIAN a tributos territoriales; la DIAN no administra ni fiscaliza el ICA.",
      distractorC: "Vulnera el derecho de petición y el deber de orientación al ciudadano al rechazar de plano la atención, e inventa una competencia inexistente en cabeza de la Dirección General."
    }
  },
  {
    id: "pjs2",
    indicatorId: "ind1",
    blockId: "bloque1",
    title: "Caso 2 — Estructura Orgánica y Niveles de la Entidad (Decreto 1742 de 2020)",
    context: "En la ventanilla de correspondencia de una Dirección Seccional, usted recibe como Facilitador I una queja escrita de un importador quien afirma que, pese a haber presentado oportunamente sus documentos en el puerto, su mercancía lleva retenida varios días sin justificación y siente que se están vulnerando sus derechos como usuario aduanero, por lo que solicita la intervención del órgano especial de la entidad encargado de velar por el respeto de los derechos de los contribuyentes y usuarios aduaneros.",
    stem: "Según la estructura orgánica establecida en el Decreto 1742 de 2020, ¿a qué instancia o dependencia debe direccionarse esta solicitud tras su radicación?",
    options: {
      A: "A la Defensoría del Contribuyente y del Usuario Aduanero, como órgano especial de la entidad encargado de garantizar el respeto a los derechos de los administrados.",
      B: "A la Dirección de Gestión de Policía Fiscal y Aduanera (POLFA) del Nivel Central, por tratarse de una retención física de mercancías en zona primaria aduanera.",
      C: "Al Ministerio de Comercio, Industria y Turismo, dado que la DIAN está adscrita a dicha cartera ministerial en los asuntos relacionados con comercio exterior."
    },
    correct: "A",
    explanation: {
      correctWhy: "De acuerdo con los Artículos 4 y 49 del Decreto 1742 de 2020, la Defensoría del Contribuyente y del Usuario Aduanero es el órgano especial de la DIAN encargado de velar por el respeto de los derechos de los contribuyentes, responsables y usuarios aduaneros.",
      distractorB: "La POLFA apoya operativos de control y lucha contra el contrabando, pero no es el órgano defensor de los derechos del usuario aduanero.",
      distractorC: "Utiliza la trampa clásica del Artículo 1 del Decreto 1742 de 2020: la DIAN está adscrita al Ministerio de Hacienda y Crédito Público, no al Ministerio de Comercio."
    }
  },
  {
    id: "pjs3",
    indicatorId: "ind1",
    blockId: "bloque1",
    title: "Caso 3 — Mapa de Procesos y Rol del Facilitador I",
    context: "Durante una jornada de inducción operativa en la Dirección Seccional, su jefe inmediato le asigna apoyar la organización de los expedientes físicos y electrónicos derivados de las solicitudes de inscripción y actualización del Registro Único Tributario (RUT) atendidas en los puntos de contacto, así como consolidar el reporte diario de turnos atendidos.",
    stem: "Dentro del Mapa de Procesos de la DIAN y la naturaleza de sus funciones, las actividades que usted está apoyando se articulan directamente con el proceso misional denominado:",
    options: {
      A: "Gestión Jurídica, puesto que el RUT constituye el documento legal que otorga personería jurídica y capacidad tributaria a los ciudadanos frente al Estado.",
      B: "Cumplimiento de Obligaciones Aduaneras y Cambiarias, ya que el registro tributario es un requisito exclusivo para habilitar operaciones de comercio exterior.",
      C: "Cercanía al Ciudadano, el cual comprende los servicios de asistencia al cliente, facilitación y gestión del registro tributario en los canales de atención de la entidad."
    },
    correct: "C",
    explanation: {
      correctWhy: "En la Cadena de Valor y el Mapa de Procesos de la DIAN, el proceso misional Cercanía al Ciudadano agrupa Asistencia al Cliente, Cultura de la Contribución, Registro Único Tributario (RUT) y Recaudo/Devoluciones.",
      distractorA: "El RUT no otorga personería jurídica, y Gestión Jurídica se encarga de doctrina, recursos y defensa judicial.",
      distractorB: "El RUT no es exclusivo para comercio exterior; identifica, ubica y clasifica a todos los sujetos de obligaciones tributarias, aduaneras y cambiarias."
    }
  },
  {
    id: "pjs4",
    indicatorId: "ind1",
    blockId: "bloque1",
    title: "Caso 4 — Alcance Funcional del Nivel Asistencial vs. Misionalidad",
    context: "Un usuario entrega en su puesto de trabajo un derecho de petición en el que consulta la interpretación jurídica de un artículo del Estatuto Tributario sobre deducciones especiales en el Impuesto sobre la Renta, y le pide a usted que, como funcionario de la DIAN, le deje por escrito en el sello de recibido si tiene o no derecho al beneficio tributario antes de vencer el plazo de su declaración mañana.",
    stem: "Frente a esta solicitud y conforme a la distribución de funciones de la entidad, la actuación procedente desde su rol de Facilitador I es:",
    options: {
      A: "Analizar rápidamente el artículo citado del Estatuto Tributario y anotar una respuesta provisional en la copia del ciudadano para garantizar el principio de eficacia y evitar que incurra en sanciones al día siguiente.",
      B: "Radicar formalmente la petición verificando sus datos y anexos, entregar constancia de radicación al ciudadano y remitirla al área de Gestión Jurídica competente, explicándole que la emisión de conceptos sobre interpretación normativa corresponde a dicha dependencia y no al trámite de ventanilla.",
      C: "Abstenerse de recibir el documento porque las consultas sobre el Impuesto sobre la Renta solo pueden ser radicadas por Grandes Contribuyentes directamente ante el Despacho del Director General en Bogotá."
    },
    correct: "B",
    explanation: {
      correctWhy: "Respeta simultáneamente el Acuerdo AGN 060 de 2001 (radicación sin alteraciones en el sello), la Ley 1755 de 2015 (recepción obligatoria de consultas con término de 30 días hábiles) y el alcance del nivel Asistencial (no usurpar funciones de Gestión Jurídica).",
      distractorA: "Incurre en extralimitación de funciones (usurpa competencias de Gestión Jurídica) y viola el Acuerdo 060 de 2001 al alterar el sello de radicación.",
      distractorC: "Cualquier ciudadano tiene derecho constitucional a formular consultas escritas a la DIAN (Art. 23 C.P. y Art. 14 Ley 1755 de 2015)."
    }
  },
  {
    id: "pjs5",
    indicatorId: "ind2",
    blockId: "bloque1",
    title: "Caso 5 — Silencio Administrativo Positivo en Solicitud de Copias (Ley 1755 de 2015)",
    context: "Al revisar el tablero de control de peticiones de la dependencia, usted advierte como Facilitador I que una petición en la que el propio contribuyente solicitó copias simples de sus recibos de pago no tuvo respuesta y hoy se cumplieron once (11) días hábiles desde su radicación sin que se hubiera informado prórroga alguna.",
    stem: "De conformidad con el Artículo 14 de la Ley 1755 de 2015, la consecuencia jurídica que usted debe advertir de inmediato a su jefe para gestionar la entrega es que:",
    options: {
      A: "El término aún se encuentra vigente, dado que todas las peticiones presentadas ante la DIAN cuentan con un plazo general de quince (15) días hábiles para ser contestadas.",
      B: "Se ha configurado la aceptación legal de la solicitud por vencimiento del plazo de diez (10) días hábiles, por lo que la administración ya no podrá negar la entrega de las copias y deberá suministrarlas dentro de los tres (3) días hábiles siguientes.",
      C: "Ha operado el silencio administrativo negativo, razón por la cual debe archivarse el expediente y esperar a que el ciudadano presente nuevamente la petición."
    },
    correct: "B",
    explanation: {
      correctWhy: "Según el Art. 14 (numeral 1 y parágrafo) de la Ley 1755 de 2015, las peticiones de información y copias de documentos deben resolverse en 10 días hábiles. Si en ese lapso no se ha dado respuesta, se entiende aceptada la solicitud (silencio administrativo positivo especial) y las copias deben entregarse dentro de los 3 días hábiles siguientes.",
      distractorA: "Confunde el plazo general de 15 días hábiles con el plazo especial de 10 días hábiles para documentos e información.",
      distractorC: "En solicitud de copias no opera el silencio negativo al día 10, sino la aceptación legal con obligación de entrega en 3 días hábiles."
    }
  },
  {
    id: "pjs6",
    indicatorId: "ind2",
    blockId: "bloque1",
    title: "Caso 6 — Peticiones Incompletas y Desistimiento Tácito (Art. 17, Ley 1755 de 2015)",
    context: "Una ciudadana acude a la ventanilla de radicación a presentar una solicitud escrita de devolución, pero al verificar formalmente los anexos enunciados en el oficio, usted nota que olvidó adjuntar la copia del poder especial que menciona en el texto. La ciudadana insiste en radicar el documento hoy mismo.",
    stem: "Según los artículos 15 y 17 de la Ley 1755 de 2015, el procedimiento legal que debe aplicarse es:",
    options: {
      A: "Negarse rotundamente a estampar el sello de radicación hasta tanto la ciudadana traiga el poder faltante, puesto que está prohibido ingresar documentos incompletos al sistema de correspondencia.",
      B: "Recibir y radicar la petición dejando constancia expresa del anexo faltante, para que dentro de los diez (10) días hábiles siguientes se le requiera por una sola vez que la complete en el término máximo de un (1) mes.",
      C: "Radicar la solicitud y decretar en el mismo acto de ventanilla el desistimiento tácito inmediato, archivando el documento en la serie de comunicaciones anuladas."
    },
    correct: "B",
    explanation: {
      correctWhy: "Los artículos 15 y 17 de la Ley 1755 de 2015 prohíben rechazar la recepción o radicación de peticiones por estar incompletas. Se radica dejando constancia de lo faltante y dentro de los 10 días hábiles siguientes se requiere al peticionario por una sola vez para que la complete en máximo 1 mes (so pena de desistimiento tácito mediante acto motivado).",
      distractorA: "Viola expresamente el Art. 15 de la Ley 1755 de 2015 («Ninguna autoridad podrá negarse a la recepción y radicación de solicitudes y peticiones»).",
      distractorC: "El Facilitador I no decreta desistimientos tácitos en ventanilla ni este procede sin haber otorgado primero el plazo de 1 mes al ciudadano."
    }
  },
  {
    id: "pjs7",
    indicatorId: "ind2",
    blockId: "bloque1",
    title: "Caso 7 — Reserva Tributaria y Recurso de Insistencia (Art. 583 E.T. y Ley 1755)",
    context: "Un periodista presenta un derecho de petición solicitando copia íntegra de la declaración del Impuesto sobre la Renta del año gravable anterior de un contratista privado de su municipio, argumentando que realiza una investigación de interés periodístico y que no cuenta con autorización del declarante.",
    stem: "Al apoyar la proyección del trámite y la organización del expediente, usted debe tener en cuenta que frente a dicha información:",
    options: {
      A: "Debe entregarse de inmediato en virtud del principio de máxima publicidad de la Ley 1712 de 2014, dado que los periodistas están exentos de la reserva tributaria.",
      B: "Opera la reserva legal prevista en el artículo 583 del Estatuto Tributario, por lo que procede su negativa motivada; y si el peticionario insiste dentro de los diez (10) días hábiles siguientes, el recurso de insistencia será decidido por el Tribunal Administrativo competente.",
      C: "El Facilitador I debe tachar con marcador negro las cifras de patrimonio de la declaración y entregarle una fotocopia informal en ventanilla para evitar que interponga una acción de tutela."
    },
    correct: "B",
    explanation: {
      correctWhy: "El artículo 583 del Estatuto Tributario consagra la reserva legal de las declaraciones tributarias. Conforme a los artículos 24, 25 y 26 de la Ley 1755 de 2015, el rechazo debe ser motivado citando la norma de reserva, y el solicitante cuenta con 10 días hábiles para presentar el recurso de insistencia, que remite la entidad al Tribunal Administrativo.",
      distractorA: "La reserva legal tributaria es una excepción constitucional y legal expresa al acceso público (Art. 24 Ley 1755/2015).",
      distractorC: "Viola gravemente la reserva tributaria, el deber de confidencialidad y el conducto formal."
    }
  },
  {
    id: "pjs8",
    indicatorId: "ind4",
    blockId: "bloque1",
    title: "Caso 8 — Orientación al Usuario y al Ciudadano (Nivel 2) y Atención Preferencial",
    context: "En una mañana de alta congestión en el punto de contacto de la DIAN, usted observa en la fila general a una adulta mayor de 78 años que pregunta tímidamente si allí le pueden desbloquear la contraseña del portal transaccional para luego actualizar su RUT.",
    stem: "Actuando conforme a la competencia de Orientación al Usuario (Nivel 2) y los protocolos de servicio al ciudadano, la actuación más efectiva es:",
    options: {
      A: "Brindarle prelación de turno por tratarse de un sujeto de especial protección constitucional, indagar integralmente los requisitos de ambos trámites para evitarle una doble fila y orientarla paso a paso en el canal de autogestión asistida.",
      B: "Indicarle amablemente que debe conservar su puesto en la fila general para respetar el valor de la justicia frente a los demás contribuyentes que llegaron más temprano.",
      C: "Pedirle que le anote en un papel su contraseña personal para que usted, en sus horas de almuerzo, ingrese desde su propio computador a realizarle la actualización del RUT."
    },
    correct: "A",
    explanation: {
      correctWhy: "Combina la prelación constitucional obligatoria para adultos mayores con las conductas del Nivel 2 de Orientación al Ciudadano: indagar más allá de la consulta inicial para resolver la necesidad real sin reprocesos y acompañar pedagógicamente en el uso de canales digitales.",
      distractorB: "Desconoce la prelación legal de atención preferencial (que no vulnera la equidad sino que materializa la igualdad material).",
      distractorC: "Pedir contraseñas personales de los contribuyentes vulnera las políticas de seguridad de la información."
    }
  },
  {
    id: "pjs9",
    indicatorId: "ind7",
    blockId: "bloque1",
    title: "Caso 9 — Valores del Código de Integridad (Honestidad y Justicia)",
    context: "Tras orientar exitosamente a un representante legal sobre los requisitos formales para radicar una solicitud de compensación de saldos a favor, el ciudadano regresa en la tarde y deja sobre su escritorio una tarjeta de regalo de un almacén de cadena por valor de $150.000 en señal de agradecimiento por su amabilidad.",
    stem: "De acuerdo con el Código de Integridad del Servicio Público y de la DIAN, usted debe:",
    options: {
      A: "Aceptar el bono únicamente porque el trámite ya fue radicado y su recepción posterior no altera el orden de los turnos ni el sentido de la decisión de fondo.",
      B: "Rechazar de manera cortés pero categórica el obsequio, explicándole al ciudadano que la atención brindada hace parte de su deber constitucional como servidor público y que los trámites ante la DIAN son gratuitos.",
      C: "Recibir la tarjeta de regalo para no hacer sentir despreciado al usuario y repartir su valor en insumos de cafetería para todos los compañeros de la dependencia."
    },
    correct: "B",
    explanation: {
      correctWhy: "El valor de Honestidad prohíbe expresamente aceptar regalos, propinas, dádivas, invitaciones o favores de ciudadanos, contribuyentes o proveedores bajo cualquier circunstancia, antes o después del trámite.",
      distractorA: "La prohibición de recibir dádivas es absoluta; no admite excepciones por cuantía ni por haberse efectuado después del servicio.",
      distractorC: "Recibir dádivas para compartirlas en la oficina sigue configurando una falta ética y disciplinaria."
    }
  },
  {
    id: "pjs10",
    indicatorId: "ind10",
    blockId: "bloque2",
    title: "Caso 10 — Proceso de Organización y Reglas de Foliación (Ley 594 y Acuerdo 042)",
    context: "A usted le entregan un expediente de contratación administrativa en el Archivo de Gestión que acaba de cerrar su trámite. El expediente cuenta con 185 folios y al revisarlo detecta que tiene ganchos metálicos de cosedora, los documentos más recientes están puestos al principio de la carpeta y al foliar del 1 al 50 usted escribió por error dos veces el número 34.",
    stem: "Conforme al Decreto 1080 de 2015, el Acuerdo AGN 042 de 2002 y la Cartilla de Foliación del AGN, la intervención técnica correcta que usted debe realizar es:",
    options: {
      A: "Dejar el documento más reciente al inicio para facilitar su lectura, aplicar corrector líquido sobre el número 34 repetido y conservar todo en la misma carpeta utilizando cosedora industrial.",
      B: "Retirar el material metálico abrasivo, ordenar los documentos cronológicamente del más antiguo al más reciente respetando el principio de orden original, anular el folio erróneo trazando una línea diagonal (/) sobre el número equivocado escribiendo al lado el correcto con lápiz de mina negra HB, y mantenerlos en la misma unidad de conservación por no superar los 200 folios.",
      C: "Dividir el expediente inmediatamente en dos carpetas porque el límite máximo por carpeta es de 100 folios, y refoliar todo el expediente con bolígrafo de tinta negra indeleble."
    },
    correct: "B",
    explanation: {
      correctWhy: "Cumple todas las reglas técnicas del AGN: 1) Retiro de material abrasivo (ganchos); 2) Principio de Orden Original (del documento más antiguo que inició el trámite al más reciente); 3) Foliación con lápiz de mina negra blanda (HB/B) en el extremo superior derecho y corrección con línea diagonal (/) sin corrector líquido; 4) Capacidad máxima de hasta 200 folios por carpeta.",
      distractorA: "Viola el Principio de Orden Original, usa corrector líquido (prohibido) y mantiene material metálico abrasivo.",
      distractorC: "La capacidad máxima por carpeta es de 200 folios (no 100) y está prohibido foliar con tinta o bolígrafo."
    }
  },
  {
    id: "pjs11",
    indicatorId: "ind10",
    blockId: "bloque2",
    title: "Caso 11 — Subprocesos de Organización y Ciclo Vital del Documento",
    context: "Su coordinador en la Dirección Seccional le solicita preparar la Transferencia Primaria de los expedientes del año 2023 que ya cumplieron su tiempo de retención en la oficina productora, siguiendo estrictamente el orden de los subprocesos técnicos de organización archivística.",
    stem: "¿Cuál es la secuencia técnica exacta de organización que usted debe verificar y a qué etapa del ciclo vital se remitirán dichos expedientes?",
    options: {
      A: "Primero Clasificación, segundo Ordenación y tercero Descripción (diligenciando el inventario FUID), para remitirlos del Archivo de Gestión al Archivo Central.",
      B: "Primero Ordenación alfabética, segundo Descripción en el rótulo y tercero Clasificación por tamaño, para remitirlos del Archivo de Gestión directamente al Archivo Histórico.",
      C: "Primero Valoración, segundo Eliminación de copias y tercero Foliación con marcador, para transferirlos del Archivo Central al Archivo de Gestión."
    },
    correct: "A",
    explanation: {
      correctWhy: "El proceso de Organización (Decreto 1080 de 2015) se compone siempre en orden estricto de: 1) Clasificación (por procedencia, serie y subserie según TRD), 2) Ordenación (secuencia cronológica según orden original) y 3) Descripción (FUID y rótulos). Y la Transferencia Primaria va del Archivo de Gestión (AG) al Archivo Central (AC).",
      distractorB: "Invierte el orden de los subprocesos y salta erróneamente del AG al Archivo Histórico (que corresponde a la transferencia secundaria desde el AC).",
      distractorC: "Mezcla procesos inexistentes y revierte el flujo del ciclo vital."
    }
  },
  {
    id: "pjs12",
    indicatorId: "ind11",
    blockId: "bloque2",
    title: "Caso 12 — Diferencia entre TRD y TVD y Reglas de Eliminación (Acuerdo 004 de 2019)",
    context: "Durante una jornada de organización en una bodega de la Seccional, se hallan 40 cajas con documentos producidos en el año 1991 por una antigua Administración de Impuestos cuya estructura orgánica ya desapareció y no contaba con tablas de retención. Paralelamente, un compañero propone triturar de inmediato 10 cajas de copias de informes de la oficina actual que ya cumplieron su tiempo de retención en la TRD con letra «E».",
    stem: "De acuerdo con el Acuerdo AGN 004 de 2019 y la Ley 594 de 2000, el criterio técnico que usted debe aplicar frente a ambas situaciones es:",
    options: {
      A: "Aplicar la TRD vigente a las cajas de 1991 y proceder a triturar hoy mismo las 10 cajas de informes actuales dado que la letra «E» autoriza al Facilitador I a destruirlos sin más trámites.",
      B: "Informar que la documentación de 1991 constituye un fondo acumulado que debe intervenirse mediante Tablas de Valoración Documental (TVD), y que las 10 cajas con disposición «E» no pueden destruirse sin antes elaborar el inventario FUID, contar con aprobación del Comité Institucional y publicar el inventario y acta en la web por treinta (30) días hábiles.",
      C: "Remitir las 40 cajas de 1991 y las 10 cajas actuales directamente al Archivo General de la Nación para que dicha entidad decida cuáles documentos quemar."
    },
    correct: "B",
    explanation: {
      correctWhy: "1) Los fondos acumulados de estructuras desaparecidas se intervienen con Tablas de Valoración Documental (TVD), no con TRD. 2) La Eliminación (E) jamás puede ser ejecutada de facto por un funcionario: exige inventario FUID, publicación web previa durante 30 días hábiles para observaciones ciudadanas y acta aprobada por el Comité Institucional de Gestión y Desempeño / Archivo.",
      distractorA: "Confunde TRD con TVD y autoriza una destrucción ilegal de documentos públicos (que incluso constituye delito y falta gravísima).",
      distractorC: "Cada entidad es responsable de aplicar sus propias TRD y TVD; no se envían cajas sin control al AGN para eliminación."
    }
  },
  {
    id: "pjs13",
    indicatorId: "ind12",
    blockId: "bloque2",
    title: "Caso 13 — Reglas de Radicación y Comunicaciones Anónimas (Acuerdo 060 de 2001)",
    context: "A las 4:45 p. m. del viernes se presentan dos situaciones en la Unidad de Correspondencia donde usted apoya como Facilitador I: primero, un profesional de otra dependencia le pide que le «guarde y separe tres números de radicado con fecha de hoy» para unos oficios que apenas va a redactar el lunes; segundo, ingresa por ventanilla un sobre dirigido a la DIAN con una denuncia detallada de evasión tributaria, pero el documento no tiene firma ni nombre del remitente.",
    stem: "Conforme al Acuerdo AGN 060 de 2001 y la normativa sobre denuncias, la actuación correcta frente a los dos eventos es:",
    options: {
      A: "Reservar los tres números de radicado en un cuaderno auxiliar para colaborar con el profesional y destruir el sobre sin firma por prohibición de recibir anónimos.",
      B: "Explicar al profesional que el artículo 5 del Acuerdo 060 de 2001 prohíbe expresamente reservar números de radicación, y proceder a recibir y radicar la denuncia registrando «Anónimo» en el campo de remitente para trasladarla al área de fiscalización o control competente.",
      C: "Asignar los tres números de radicado en blanco en el sistema y devolver el documento anónimo al mensajero exigiendo fotocopia de la cédula."
    },
    correct: "B",
    explanation: {
      correctWhy: "El artículo 5 del Acuerdo AGN 060 de 2001 establece que no se podrán reservar números de radicación, ni habrá números repetidos, enmendados o tachados. Por su parte, las quejas o denuncias anónimas sí se reciben y radican como comunicación oficial (registrando «Anónimo») para que la dependencia competente evalúe sus méritos (Art. 38 Ley 190/1995 y Art. 81 Ley 962/2005).",
      distractorA: "Viola la prohibición expresa de reservar radicados y destruye ilegalmente una denuncia recibida.",
      distractorC: "Genera radicados falsos en blanco e impide el trámite de denuncias anónimas."
    }
  },
  {
    id: "pjs14",
    indicatorId: "ind12",
    blockId: "bloque2",
    title: "Caso 14 — Documentación Organizacional GTC 185 y Seguridad de Escritorio Limpio",
    context: "Su jefe inmediato en la División de Gestión Administrativa le solicita redactar una comunicación interna dirigida al Jefe de la División de Fiscalización de la misma Dirección Seccional para solicitarle el listado de expedientes listos para transferencia primaria. Minutos después, usted debe ausentarse de su puesto durante 10 minutos para llevar una carpeta al segundo piso.",
    stem: "De acuerdo con la Guía Técnica Colombiana GTC 185 y la política de Seguridad de la Información (MSPI) de la DIAN, usted debe:",
    options: {
      A: "Elaborar un Memorando por tratarse de una comunicación interna entre dependencias de la misma entidad, y antes de levantarse del puesto bloquear la sesión de su computador (Windows + L) y resguardar bajo llave los documentos con reserva tributaria.",
      B: "Elaborar una Carta u Oficio comercial dirigido al Jefe de Fiscalización, y dejar la pantalla encendida para que sus compañeros vean que usted sigue en horario laboral.",
      C: "Elaborar una Constancia solemne en estilo Semibloque y compartirle su contraseña del computador al practicante por si llega un correo urgente mientras usted sube al segundo piso."
    },
    correct: "A",
    explanation: {
      correctWhy: "Según la GTC 185, el Memorando es la comunicación escrita que se emplea internamente entre dependencias o funcionarios de la misma entidad (mientras que la Carta u Oficio es para destinatarios externos). Y según la política de Escritorio Limpio y Pantalla Limpia del MSPI DIAN, siempre se debe bloquear el equipo (Windows + L) y guardar documentos reservados al ausentarse.",
      distractorB: "Confunde Oficio (externo) con Memorando (interno) e incumple la política de Pantalla Limpia.",
      distractorC: "La Constancia no es el documento para solicitar informes internos y compartir contraseñas está estrictamente prohibido."
    }
  },
  {
    id: "pjs15",
    indicatorId: "ind15",
    blockId: "bloque3",
    title: "Caso 15 — Comportamiento Ético (Nivel 4) y Comunicación Efectiva (Nivel 2)",
    context: "Mientras organiza una serie documental de cobro, un compañero antiguo le comenta en voz baja que olvidó radicar a tiempo una respuesta que vencía ayer y le pide a usted que altere manualmente el registro de fecha en la base de control compartido para que aparezca radicada dos días antes, asegurándole que «nadie se dará cuenta y así evitamos afectar el indicador del grupo».",
    stem: "Actuando conforme al Nivel 4 de Comportamiento Ético y al Nivel 2 de Comunicación Efectiva, la respuesta procedente es:",
    options: {
      A: "Negarse rotundamente a alterar el registro explicando que ello vulnera la integridad documental, e informar de inmediato y con datos claros la situación del vencimiento al superior jerárquico para gestionar la contingencia por las vías legales.",
      B: "Negarse a modificar el archivo usted mismo, pero guardar absoluto silencio sobre el vencimiento para no perjudicar el clima laboral ni la amistad con su compañero.",
      C: "Modificar únicamente la fecha en la hoja de Excel interna sin tocar el sello físico, como muestra de Trabajo en Equipo y Orientación al Logro."
    },
    correct: "A",
    explanation: {
      correctWhy: "El Nivel 4 de Comportamiento Ético exige ser referente de integridad, no ceder ante presiones para vulnerar la ley y actuar activamente ante irregularidades; y el Nivel 2 de Comunicación Efectiva exige informar oportunamente novedades o retrasos reales al superior para tomar correctivos legales.",
      distractorB: "La complicidad pasiva u ocultamiento de un vencimiento legal incumple el Nivel 4 de Comportamiento Ético y el deber de reporte oportuno.",
      distractorC: "Alterar registros oficiales de control constituye falsedad/falta disciplinaria; jamás puede justificarse como trabajo en equipo."
    }
  },
  {
    id: "pjs16",
    indicatorId: "ind21",
    blockId: "bloque4",
    title: "Caso 16 — Ofimática en Excel: Cruce Exacto de NITs y Referencias Absolutas",
    context: "En una hoja de cálculo de Microsoft Excel, usted tiene en la columna A (desde A2 hasta A1500) el listado de NITs de los expedientes recibidos hoy, y necesita traer automáticamente la Razón Social de cada contribuyente desde una matriz maestra ubicada en el rango D2:F5000 (donde la columna D contiene el NIT y la columna E la Razón Social), arrastrando la fórmula hacia abajo sin que se desplace el rango de la matriz.",
    stem: "¿Cuál es la estructura de fórmula técnicamente correcta que garantiza tanto la fijación de la matriz al arrastrar como la coincidencia exacta del NIT?",
    options: {
      A: "=BUSCARV(A2; D2:F5000; 2; VERDADERO)",
      B: "=BUSCARV(A2; $D$2:$F$5000; 2; FALSO)",
      C: "=CONTAR.SI($D$2:$F$5000; A2; 2)"
    },
    correct: "B",
    explanation: {
      correctWhy: "La función BUSCARV requiere: 1) Valor buscado (A2, referencia relativa para que cambie al bajar a A3, A4...), 2) Matriz fijada con referencias absolutas ($D$2:$F$5000) para que no se corra al arrastrar, 3) Indicador de columna 2 (Razón Social), y 4) El argumento FALSO (o 0) para obligar a una coincidencia exacta del NIT.",
      distractorA: "Usa referencias relativas en la matriz (se desconfigura al arrastrar) y usa VERDADERO (coincidencia aproximada, que trae nombres equivocados).",
      distractorC: "CONTAR.SI solo cuenta celdas y no acepta 3 argumentos ni devuelve textos de otra columna."
    }
  },
  {
    id: "pjs17",
    indicatorId: "ind21",
    blockId: "bloque4",
    title: "Caso 17 — Word (Combinación de Correspondencia) y Correo Masivo (CCO - Habeas Data)",
    context: "La Dirección Seccional debe generar 450 oficios persuasivos personalizados (cambiando en cada uno el Nombre, NIT, Dirección y Número de Expediente que reposan en una tabla de Excel) y, adicionalmente, enviar un boletín informativo por correo electrónico a 300 ciudadanos inscritos en una jornada de capacitación tributaria.",
    stem: "Para ejecutar ambas tareas con eficiencia ofimática y estricto cumplimiento de la Ley 1581 de 2012 (Protección de Datos Personales), usted debe:",
    options: {
      A: "Utilizar la herramienta Combinación de Correspondencia en Word vinculada a la base de Excel para generar los 450 oficios, y enviar el boletín electrónico colocando las 300 direcciones de los ciudadanos en el campo CCO (Con Copia Oculta).",
      B: "Utilizar una Tabla Dinámica en Word para redactar los oficios uno por uno, y enviar el correo masivo poniendo los 300 correos en el campo CC (Con Copia) para que todos vean quiénes asistirán.",
      C: "Aplicar saltos de sección manuales copiando y pegando las 450 filas de Excel, y adjuntar la base completa de correos en un archivo .zip."
    },
    correct: "A",
    explanation: {
      correctWhy: "La Combinación de Correspondencia (Mail Merge) en Word automatiza la generación de oficios personalizados conectando el documento base con la tabla de Excel; y el uso del campo CCO (Con Copia Oculta) evita exponer las direcciones de correo electrónico de los ciudadanos entre sí, protegiendo sus datos personales (Ley 1581 de 2012).",
      distractorB: "Las Tablas Dinámicas son de Excel (no para generar cartas en Word) y usar CC expone ilegalmente los datos personales de los 300 ciudadanos.",
      distractorC: "Genera reprocesos manuales innecesarios y filtra la base de datos completa a terceros."
    }
  },
  {
    id: "pjs18",
    indicatorId: "ind22",
    blockId: "bloque4",
    title: "Caso 18 — Razonamiento Categorial: Condicionales (Modus Tollens) y Negación Contradictoria",
    context: "En el manual de auditoría interna del archivo de la Seccional se establecen dos premisas verificadas: (1) «Si un expediente pertenece a la serie de Historias Laborales, entonces su disposición final en la TRD es de Conservación Total (CT)»; y (2) Se afirma como hipótesis que «Todos los expedientes de la caja N.º 12 están debidamente foliados».",
    stem: "Si al revisar un expediente específico usted comprueba que su disposición final NO es de Conservación Total (CT), y además descubre que la hipótesis sobre la caja N.º 12 es FALSA, ¿qué conclusiones lógicas se deducen con certeza absoluta?",
    options: {
      A: "Que el expediente específico NO pertenece a la serie de Historias Laborales (por Modus Tollens), y que en la caja N.º 12 al menos un expediente NO está debidamente foliado (por contradicción lógica).",
      B: "Que ningún expediente de la entidad tiene Conservación Total, y que en la caja N.º 12 absolutamente ningún expediente está foliado.",
      C: "Que el expediente específico pertenece a la serie de Contratos, y que todos los expedientes de la caja N.º 12 fueron eliminados."
    },
    correct: "A",
    explanation: {
      correctWhy: "1) Por Modus Tollens (Si P → Q; no ocurre Q → por tanto no ocurre P): si no tiene Conservación Total, con certeza NO pertenece a Historias Laborales. 2) Por el Cuadro de Oposición de Boecio, la negación contradictoria de una Universal Afirmativa Tipo A («Todos están foliados») es la Particular Negativa Tipo O («Al menos uno / alguno NO está foliado»).",
      distractorB: "Cae en la trampa clásica de negar «Todos» con «Ninguno» (contraria, no contradictoria).",
      distractorC: "Deduce información particular no contenida en las premisas."
    }
  },
  {
    id: "pjs19",
    indicatorId: "ind3",
    blockId: "bloque1",
    title: "Caso 19 — Orientación al Usuario y al Ciudadano (Nivel 1: Lenguaje Claro y Escucha)",
    context: "Un pequeño productor agrícola acude por primera vez al punto de contacto de la DIAN manifestando que no entiende qué significa «responsable del régimen simple» ni qué documentos debe entregar en ventanilla. En ese momento hay quince personas más esperando turno.",
    stem: "Conforme a las conductas asociadas al Nivel 1 de la competencia Orientación al Usuario y al Ciudadano, usted debe:",
    options: {
      A: "Escucharlo con atención sin interrumpirlo y explicarle los requisitos del trámite utilizando un lenguaje claro, sencillo y libre de tecnicismos, asegurándose de brindarle información veraz y completa.",
      B: "Entregarle impreso el texto completo del Estatuto Tributario para que lo lea fuera de la fila y así agilizar la atención de los quince usuarios restantes.",
      C: "Emitirle verbalmente un concepto jurídico tributario definiendo cuál régimen de tributación le conviene más financieramente a su finca."
    },
    correct: "A",
    explanation: {
      correctWhy: "El Nivel 1 de Orientación al Usuario exige escucha activa sin interrumpir, trato cortés bajo alta afluencia y uso de lenguaje claro, sencillo y libre de tecnicismos innecesarios dentro del marco de las funciones asistenciales.",
      distractorB: "Evade el deber de orientación clara en el primer contacto.",
      distractorC: "Incurre en usurpación de funciones (asesoría tributaria / concepto jurídico no corresponde al Facilitador I)."
    }
  },
  {
    id: "pjs20",
    indicatorId: "ind5",
    blockId: "bloque1",
    title: "Caso 20 — Valores del Código de Integridad: Compromiso y Diligencia",
    context: "Faltando veinte minutos para finalizar la jornada laboral, ingresa por el canal de correspondencia una petición urgente de un ciudadano que requiere radicación inmediata para no perder un término legal, y al mismo tiempo usted nota que una impresora del área quedó encendida desperdiciando papel por un error de cola de impresión.",
    stem: "Articulando los valores de Compromiso y Diligencia del Código de Integridad, la actuación procedente es:",
    options: {
      A: "Posponer la radicación del ciudadano para el día siguiente argumentando cierre próximo de ventanilla, e ignorar la impresora porque su mantenimiento corresponde al área de soporte técnico.",
      B: "Atender y radicar con prontitud y amabilidad la solicitud del ciudadano comprendiendo la importancia de su necesidad (Compromiso), y cancelar la cola errónea cuidando los insumos y recursos del Estado (Diligencia).",
      C: "Recibir el documento sin verificar sus folios para salir rápido y apagar el taco eléctrico de toda la oficina."
    },
    correct: "B",
    explanation: {
      correctWhy: "El Compromiso implica empatía y disposición permanente para resolver las necesidades ciudadanas, mientras que la Diligencia exige cumplir los deberes con prontitud, calidad y uso eficiente de los recursos públicos.",
      distractorA: "Refleja desgano e indiferencia («no es asunto mío»), conductas prohibidas en el Código de Integridad.",
      distractorC: "Genera reprocesos por falta de revisión formal."
    }
  },
  {
    id: "pjs21",
    indicatorId: "ind8",
    blockId: "bloque1",
    title: "Caso 21 — Valores del Código de Integridad: Justicia y Respeto",
    context: "En el punto de atención coinciden dos usuarios sin condición de prelación especial: el primero en llegar es un ciudadano que viste de forma sencilla y expresa molestia en voz alta por la demora; el segundo en llegar es un excompañero suyo de otra entidad pública que lo saluda afectuosamente y le pide que lo atienda primero.",
    stem: "De acuerdo con los valores de Justicia y Respeto del Código de Integridad, usted debe:",
    options: {
      A: "Atender primero a su excompañero por cortesía interinstitucional y dejar de último al ciudadano molesto como sanción pedagógica por haber alzado la voz.",
      B: "Respetar estrictamente el orden de llegada atendiendo primero al ciudadano que llegó antes (Justicia), manteniendo el autocontrol, la escucha activa y un trato digno pese a su alteración (Respeto).",
      C: "Negarse a atender a ambos usuarios para evitar tanto un conflicto de interés con el conocido como una discusión con el ciudadano alterado."
    },
    correct: "B",
    explanation: {
      correctWhy: "El valor de Justicia exige imparcialidad, equidad y respeto al orden de turno sin favoritismos personales; y el valor de Respeto exige trato digno y autocontrol frente a usuarios alterados.",
      distractorA: "Incurre en favoritismo arbitrario y retaliación contra el ciudadano.",
      distractorC: "Paraliza injustificadamente la prestación del servicio público."
    }
  },
  {
    id: "pjs22",
    indicatorId: "ind13",
    blockId: "bloque3",
    title: "Caso 22 — Adaptabilidad (Nivel 1) ante Cambios Tecnológicos",
    context: "La Dirección de Gestión de Innovación y Tecnología implementa en su Seccional una nueva versión del gestor electrónico de expedientes que modifica la interfaz de cargue de inventarios FUID. Algunos compañeros manifiestan que el cambio es innecesario y proponen seguir llevando el control en hojas sueltas.",
    stem: "Para evidenciar el Nivel 1 de la competencia Adaptabilidad, su conducta debe ser:",
    options: {
      A: "Asumir el cambio con disposición positiva y constructiva, capacitarse de inmediato en el nuevo aplicativo e implementarlo en su rutina diaria apoyando la transición de la oficina.",
      B: "Continuar utilizando las hojas sueltas hasta que finalice el año para no disminuir su velocidad habitual de registro.",
      C: "Presentar una queja formal contra la Dirección de Tecnología exigiendo que mantengan el software anterior exclusivamente para su puesto."
    },
    correct: "A",
    explanation: {
      correctWhy: "El Nivel 1 de Adaptabilidad evalúa la capacidad de enfrentarse con flexibilidad a situaciones nuevas, aceptando e implementando de forma positiva y constructiva los cambios en aplicativos o procedimientos.",
      distractorB: "Evidencia rigidez y resistencia al cambio.",
      distractorC: "Rechaza injustificadamente la modernización institucional."
    }
  },
  {
    id: "pjs23",
    indicatorId: "ind14",
    blockId: "bloque3",
    title: "Caso 23 — Comportamiento Ético (Nivel 1): Uso de Credenciales y Bienes Públicos",
    context: "Un compañero de su mismo grupo de trabajo le pide prestado su token y contraseña del sistema electrónico durante media hora porque el suyo se bloqueó y necesita consultar el RUT de tres contribuyentes para terminar un informe urgente.",
    stem: "De acuerdo con el Nivel 1 de Comportamiento Ético y las políticas de seguridad de la información de la DIAN, usted debe:",
    options: {
      A: "Prestarle su usuario y contraseña únicamente por esos treinta minutos vigilando de cerca su pantalla para colaborar con la meta del grupo.",
      B: "Abstenerse de prestar sus credenciales por ser personales e intransferibles, e indicarle la ruta ante la mesa de ayuda tecnológica o apoyar la consulta dentro de sus propias funciones autorizadas.",
      C: "Anotar su clave en un adhesivo pegado al monitor compartido para que cualquier integrante del área pueda usarla en caso de bloqueo."
    },
    correct: "B",
    explanation: {
      correctWhy: "El Nivel 1 de Comportamiento Ético exige cumplir rigurosamente los reglamentos y protocolos de seguridad. Las credenciales de acceso son estrictamente personales e intransferibles; jamás aplica la «excepción benévola».",
      distractorA: "Viola las políticas de seguridad de la información (MSPI) y trazabilidad de auditoría.",
      distractorC: "Exponer contraseñas en el escritorio vulnera gravemente la seguridad informática."
    }
  },
  {
    id: "pjs24",
    indicatorId: "ind16",
    blockId: "bloque3",
    title: "Caso 24 — Comunicación Efectiva (Nivel 1 y Nivel 2)",
    context: "Su jefe inmediato le da una instrucción verbal rápida para consolidar los derechos de petición pendientes de la semana, pero usted nota que no especificó si el corte incluye los radicados recibidos por la sede electrónica después de las 4:00 p. m.",
    stem: "Aplicando las conductas de Comunicación Efectiva, la acción correcta es:",
    options: {
      A: "Asumir por cuenta propia que no se incluyen y entregar el reporte incompleto al final de la tarde sin hacer preguntas para no incomodar al jefe.",
      B: "Verificar y confirmar oportunamente con su jefe el alcance exacto de la instrucción antes de procesar la base (Nivel 1), y entregar un cuadro ejecutivo sintetizando las alertas de vencimiento (Nivel 2).",
      C: "Enviar un correo masivo a toda la Seccional quejándose por la falta de precisión en las órdenes del área."
    },
    correct: "B",
    explanation: {
      correctWhy: "Integra el Nivel 1 (verificar que se han comprendido bien las instrucciones antes de ejecutarlas) y el Nivel 2 (sintetizar información compleja y retroalimentar proactivamente el estado de los trámites).",
      distractorA: "Suponer sin verificar genera reprocesos y riesgo de vencimiento de términos.",
      distractorC: "Desconoce el conducto regular y la comunicación asertiva."
    }
  },
  {
    id: "pjs25",
    indicatorId: "ind19",
    blockId: "bloque3",
    title: "Caso 25 — Orientación al Logro (Nivel 1 y Nivel 2)",
    context: "Usted identifica que en el archivo de gestión de la dependencia se pierden cerca de dos horas diarias porque cada funcionario digita manualmente desde cero los rótulos de las carpetas, cometiendo además frecuentes errores en los códigos de las series documentales.",
    stem: "Conforme a la competencia de Orientación al Logro (Niveles 1 y 2), la actuación más efectiva es:",
    options: {
      A: "Omitir la colocación de rótulos en las carpetas nuevas para ahorrar esas dos horas diarias y duplicar la cantidad de expedientes archivados.",
      B: "Priorizar y revisar su trabajo diario cumpliendo los estándares de calidad (Nivel 1), y diseñar una propuesta de plantilla automatizada con validación de datos de la TRD para presentarla a su jefe inmediato como mejora del proceso (Nivel 2).",
      C: "Cambiar por cuenta propia los códigos oficiales de la TRD por números de un solo dígito sin consultar al Comité ni a su superior."
    },
    correct: "B",
    explanation: {
      correctWhy: "Combina el Nivel 1 (cumplir metas respetando estándares de calidad y tiempo) y el Nivel 2 (identificar cuellos de botella y proponer mejoras prácticas por el conducto regular sin violar el procedimiento oficial).",
      distractorA: "Viola la norma archivística (subproceso de Descripción) por ir más rápido.",
      distractorC: "Nadie puede alterar unilateralmente los códigos aprobados en la TRD."
    }
  },
  {
    id: "pjs26",
    indicatorId: "ind20",
    blockId: "bloque3",
    title: "Caso 26 — Trabajo en Equipo (Nivel 1)",
    context: "Un nuevo Facilitador I acaba de posesionarse en su dependencia y presenta dificultades para diligenciar el Formato Único de Inventario Documental (FUID), lo que está retrasando la entrega grupal de la transferencia primaria programada para el viernes.",
    stem: "Para actuar conforme al Nivel 1 de la competencia Trabajo en Equipo, usted debe:",
    options: {
      A: "Limitarse a entregar únicamente las cajas que le corresponden a usted, advirtiendo por escrito que el atraso de la dependencia es culpa exclusiva del funcionario nuevo.",
      B: "Compartirle sus conocimientos prácticos y guías sobre el diligenciamiento del FUID y, previa coordinación con su superior, apoyar la revisión conjunta para asegurar que el equipo cumpla la meta de transferencia.",
      C: "Falsificar la firma del compañero nuevo en las planillas de control sin que él aprenda el procedimiento para salir rápido del compromiso."
    },
    correct: "B",
    explanation: {
      correctWhy: "El Nivel 1 de Trabajo en Equipo exige participar activamente en la meta común, compartir conocimientos útiles sobre aplicativos y formatos, y colaborar previa coordinación cuando hay sobrecarga o curva de aprendizaje.",
      distractorA: "Refleja individualismo extremo contrario a la competencia.",
      distractorC: "Suplantar firmas es una falta disciplinaria y penal grave."
    }
  }
];

window.ACHIEVEMENTS_DATA = [
  {
    id: "ach_first",
    icon: "🥉",
    title: "Primer Paso de Comando",
    desc: "Dominar tu primer indicador en la plataforma.",
    check: (ctx) => ctx.completedCount >= 1
  },
  {
    id: "ach_sprint1",
    icon: "⚡",
    title: "Núcleo Legal Dominado",
    desc: "Dominar Indicador 1 (Decreto 1742) e Indicador 2 (Ley 1755).",
    check: (ctx) => !!ctx.progressState["ind1"] && !!ctx.progressState["ind2"]
  },
  {
    id: "ach_bloque1",
    icon: "🛡️",
    title: "Guardián del Ciudadano (Fase 1)",
    desc: "Completar los 9 indicadores del Bloque 1 (Identidad, Ética y Servicio).",
    check: (ctx) => ["ind1","ind2","ind3","ind4","ind5","ind6","ind7","ind8","ind9"].every(id => !!ctx.progressState[id])
  },
  {
    id: "ach_bloque2",
    icon: "🗂️",
    title: "Maestro Archivista (Fase 2)",
    desc: "Completar los indicadores 10, 11 y 12 (Ley 594, TRD/TVD y GTC 185).",
    check: (ctx) => ["ind10","ind11","ind12"].every(id => !!ctx.progressState[id])
  },
  {
    id: "ach_bloque3",
    icon: "🧭",
    title: "Referente Comportamental (Fase 3)",
    desc: "Completar los indicadores 13 al 20 (Competencias Comportamentales).",
    check: (ctx) => ["ind13","ind14","ind15","ind16","ind17","ind18","ind19","ind20"].every(id => !!ctx.progressState[id])
  },
  {
    id: "ach_bloque4",
    icon: "💻",
    title: "Estratega Analítico (Bloque 4)",
    desc: "Completar Ofimática (Ind. 21) y Razonamiento Categorial (Ind. 22).",
    check: (ctx) => !!ctx.progressState["ind21"] && !!ctx.progressState["ind22"]
  },
  {
    id: "ach_pjs85",
    icon: "🏆",
    title: "Puntaje de Lista de Elegibles (+85)",
    desc: "Alcanzar 85.0 puntos o más en el Simulador PJS con al menos 5 casos resueltos.",
    check: (ctx) => ctx.pjsAnsweredCount >= 5 && ctx.pjsScore >= 85
  },
  {
    id: "ach_all22",
    icon: "👑",
    title: "Comandante Facilitador I (22/22)",
    desc: "Dominar el 100 % de los 22 indicadores evaluables de la OPEC 236908.",
    check: (ctx) => ctx.completedCount >= 22
  }
];


window.AUTOINFORME_ITEMS = [
  {
    id: "auto1",
    category: "Competencia: Orientación al Usuario (Nivel 2)",
    statement: "Cuando un ciudadano acude con una duda sobre un trámite, indago más allá de su consulta inicial para asegurarme de que cuenta con todos los requisitos y evitarle filas o reprocesos futuros.",
    idealLevel: 4, // 4 = Totalmente de acuerdo, 1 = Totalmente en desacuerdo
    isControlTrap: false,
    explanation: "Conducta observable directa del Nivel 2 de Orientación al Usuario y al Ciudadano: anticipar necesidades reales y evitar reprocesos. Debes marcar «Totalmente de acuerdo»."
  },
  {
    id: "auto2",
    category: "Competencia: Comportamiento Ético (Nivel 1) — Trampa de Excepción Benévola",
    statement: "Si un compañero de mi entera confianza tiene sobrecarga de trabajo al cierre del día, le facilito temporalmente mi usuario y contraseña del sistema para que la dependencia cumpla la meta a tiempo.",
    idealLevel: 1,
    isControlTrap: false,
    explanation: "¡Cuidado! Es una trampa de «excepción benévola». Las credenciales de acceso en la DIAN son estrictamente personales e intransferibles (MSPI / Comportamiento Ético). Debes marcar «Totalmente en desacuerdo»."
  },
  {
    id: "auto3",
    category: "Subescala de Control — Deseabilidad Social (Alerta de Distorsión)",
    statement: "En toda mi vida jamás he sentido el más mínimo cansancio, impaciencia o molestia ante una situación injusta o estresante.",
    idealLevel: 2, // En desacuerdo (honestidad humana realista)
    isControlTrap: true,
    explanation: "⚠️ REACTIVO DE CONTROL DE DESEABILIDAD SOCIAL: Afirmaciones absolutas («En toda mi vida jamás...», «Nunca jamás he cometido un error humano») miden si el aspirante intenta fingir perfección irreal. Responder «Totalmente de acuerdo» dispara la alerta de distorsión/invalidez. Lo correcto es responder con honestidad realista («En desacuerdo»)."
  },
  {
    id: "auto4",
    category: "Valor de Integridad: Honestidad",
    statement: "Si advierto que cometí un error involuntario al foliar o radicar un documento, lo informo de inmediato a mi superior para corregirlo mediante el procedimiento formal en lugar de ocultarlo.",
    idealLevel: 4,
    isControlTrap: false,
    explanation: "Refleja directamente la conducta oficial del valor Honestidad del Código de Integridad: actuar con la verdad incluso ante errores operativos propios y corregirlos por la vía reglada."
  },
  {
    id: "auto5",
    category: "Competencia: Orientación al Logro (Nivel 2) — Trampa de Saltarse Controles",
    statement: "Para superar el promedio de atención diaria en mi ventanilla, omito la verificación de anexos formales en los derechos de petición cuando veo que la fila es muy larga.",
    idealLevel: 1,
    isControlTrap: false,
    explanation: "En la DIAN, la Orientación al Logro exige cumplir metas respetando siempre los estándares de calidad y legalidad. Saltarse un control formal para ir más rápido es una falta operativa. Marca «Totalmente en desacuerdo»."
  },
  {
    id: "auto6",
    category: "Competencia: Comportamiento Ético (Nivel 4)",
    statement: "Si presencio que un funcionario altera la fecha de recepción de un trámite o solicita beneficios a un contribuyente, mantengo mi rectitud y reporto el hecho por los canales institucionales de denuncia.",
    idealLevel: 4,
    isControlTrap: false,
    explanation: "En el Nivel 4 de Comportamiento Ético se evalúa el rol ejemplarizante y la promoción activa de la transparencia, rechazando la complicidad silenciosa. Marca «Totalmente de acuerdo»."
  },
  {
    id: "auto7",
    category: "Valor de Integridad: Justicia",
    statement: "Cuando atiendo al público en la Dirección Seccional, aplico exactamente los mismos criterios formales y el orden de turno sin favorecer a conocidos, amigos o personas influyentes.",
    idealLevel: 4,
    isControlTrap: false,
    explanation: "Define el núcleo del valor Justicia en el Código de Integridad: imparcialidad, equidad e igualdad sin discriminación ni favoritismos. Marca «Totalmente de acuerdo»."
  },
  {
    id: "auto8",
    category: "Subescala de Control — Deseabilidad Social (Alerta de Distorsión)",
    statement: "Desde mi infancia hasta hoy, absolutamente todas las palabras que he dicho en mi vida han sido perfectas y jamás he tenido una sola duda sobre ningún tema.",
    idealLevel: 1,
    isControlTrap: true,
    explanation: "⚠️ REACTIVO DE CONTROL DE DESEABILIDAD SOCIAL: Ningún ser humano carece de dudas desde su infancia. Marcar «De acuerdo» o «Totalmente de acuerdo» penaliza la escala de sinceridad de la prueba."
  },
  {
    id: "auto9",
    category: "Competencia: Adaptabilidad (Nivel 1)",
    statement: "Cuando la entidad implementa un nuevo aplicativo de gestión documental o cambia los formatos de control, prefiero seguir utilizando mis plantillas antiguas porque ya las domino.",
    idealLevel: 1,
    isControlTrap: false,
    explanation: "Reactivo inverso de Adaptabilidad Nivel 1: resistirse a las nuevas herramientas institucionales contradice la competencia. Debes marcar «Totalmente en desacuerdo»."
  },
  {
    id: "auto10",
    category: "Competencia: Comunicación Efectiva (Nivel 2)",
    statement: "Cuando detecto un cuello de botella o un posible retraso en los trámites asignados a mi puesto, sintetizo la información clave e informo preventivamente a mi jefe antes de que se venzan los términos.",
    idealLevel: 4,
    isControlTrap: false,
    explanation: "Conducta exacta de Comunicación Efectiva Nivel 2: síntesis ejecutiva y retroalimentación proactiva y oportuna sobre el avance de los procesos."
  },
  {
    id: "auto11",
    category: "Valor de Integridad: Diligencia",
    statement: "Cuido los insumos de papelería, los equipos de cómputo y el tiempo de mi jornada laboral, asegurándome de que cada expediente quede bien organizado desde la primera vez.",
    idealLevel: 4,
    isControlTrap: false,
    explanation: "Conducta modelo del valor Diligencia: uso eficiente de los recursos del Estado y trabajo con prontitud y calidad sin reprocesos."
  },
  {
    id: "auto12",
    category: "Valor de Integridad: Respeto",
    statement: "Si un ciudadano llega exaltado a reclamar por un cobro tributario, le respondo en el mismo tono elevado para hacer respetar la autoridad de la DIAN.",
    idealLevel: 1,
    isControlTrap: false,
    explanation: "Viola el valor de Respeto y la competencia de Orientación al Ciudadano. Ante usuarios alterados se exige autocontrol, escucha activa y trato digno. Marca «Totalmente en desacuerdo»."
  }
];

window.FLASHCARDS_DATA = [
  {
    cat: "Ley 1755 de 2015",
    q: "¿Cuál es el plazo legal para resolver una Petición de Interés General o Particular, Queja, Reclamo o Sugerencia?",
    a: "15 días hábiles siguientes a su recepción (Art. 14, Ley 1755 de 2015)."
  },
  {
    cat: "Ley 1755 de 2015 — Trampa de Oro",
    q: "¿Cuál es el plazo para Peticiones de Información y Copias de Documentos, y qué pasa si vence sin respuesta?",
    a: "10 días hábiles. Si no se responde en esos 10 días hábiles, opera el Silencio Administrativo POSITIVO (se entiende aceptada) y las copias deben entregarse dentro de los 3 días hábiles siguientes."
  },
  {
    cat: "Ley 1755 de 2015",
    q: "¿Cuál es el plazo legal para resolver Consultas (conceptos jurídicos o técnicos) sobre materias a cargo de la entidad?",
    a: "30 días hábiles siguientes a su recepción (Art. 14, numeral 2, Ley 1755 de 2015)."
  },
  {
    cat: "Ley 1755 de 2015",
    q: "¿Cuál es el plazo para el Traslado por Falta de Competencia cuando se recibe una petición escrita?",
    a: "Dentro de los 5 días hábiles siguientes a la recepción (Art. 21, Ley 1755 de 2015), enviando copia del oficio remisorio al peticionario. (Si es verbal, se informa en el acto)."
  },
  {
    cat: "Ley 1755 de 2015",
    q: "¿Cuáles son los plazos en una Petición Incompleta antes de decretar el Desistimiento Tácito?",
    a: "Se radica obligatoriamente; dentro de los 10 días hábiles siguientes se requiere por una sola vez al ciudadano, quien tiene máximo 1 mes para completarla. Si no lo hace en 1 mes, se decreta el desistimiento tácito mediante acto motivado (Art. 17)."
  },
  {
    cat: "Ley 1755 / Ley 5 de 1992",
    q: "¿Cuál es el plazo para Peticiones entre Autoridades y cuál para Peticiones de Congresistas en control político?",
    a: "• Peticiones entre autoridades: 10 días hábiles (Art. 30 Ley 1755).\n• Peticiones de Congresistas (Ley 5 de 1992): 5 días calendario."
  },
  {
    cat: "Reserva Tributaria",
    q: "¿Qué término tiene el peticionario para presentar el Recurso de Insistencia ante negativa por reserva legal y quién lo decide?",
    a: "10 días hábiles siguientes a la notificación de la negativa. Lo decide en única instancia el Tribunal Administrativo competente (Art. 26 Ley 1755 de 2015)."
  },
  {
    cat: "Decreto 1742 de 2020",
    q: "¿Cuál es la naturaleza jurídica exacta de la DIAN y a qué Ministerio está adscrita?",
    a: "Unidad Administrativa Especial (UAE) del orden nacional, de carácter eminentemente técnico y especializado, con personería jurídica, autonomía administrativa y presupuestal y patrimonio propio, adscrita al Ministerio de Hacienda y Crédito Público (Art. 1)."
  },
  {
    cat: "Decreto 1742 de 2020",
    q: "¿Cuáles son los 4 Procesos Misionales en la Cadena de Valor (Mapa de Procesos) de la DIAN?",
    a: "1. Cercanía al Ciudadano (incluye RUT, asistencia y recaudo).\n2. Cumplimiento de Obligaciones Tributarias.\n3. Cumplimiento de Obligaciones Aduaneras y Cambiarias.\n4. Gestión Jurídica."
  },
  {
    cat: "Ley 594 de 2000 / Archivo",
    q: "¿Cuáles son los 3 subprocesos del proceso de Organización Archivística en orden estricto?",
    a: "1.º Clasificación (oficina productora, serie y subserie según TRD).\n2.º Ordenación (secuencia cronológica según Principio de Orden Original).\n3.º Descripción (FUID, rótulos, hojas de control)."
  },
  {
    cat: "Acuerdo AGN 042 / Foliación",
    q: "¿Con qué instrumento se folia, en qué esquina, cuál es el tope de folios por carpeta y cómo se corrige un error?",
    a: "• Lápiz de mina negra y blanda (HB o B), extremo superior derecho.\n• Máximo 200 folios por carpeta.\n• Si hay error: trazar línea diagonal (/) sobre el número equivocado y escribir al lado el correcto (nunca usar corrector líquido)."
  },
  {
    cat: "Acuerdo AGN 004 de 2019",
    q: "¿Cuál es la diferencia exacta entre TRD y TVD y cuántos días debe publicarse en web un inventario de Eliminación (E)?",
    a: "• TRD: Producción documental activa de la estructura vigente.\n• TVD: Fondos acumulados de estructuras pasadas/suprimidas.\n• Publicación web previa para Eliminación (E): 30 días hábiles."
  },
  {
    cat: "Acuerdo AGN 060 y GTC 185",
    q: "¿Se pueden reservar números de radicado? ¿Y cuándo se usa Memorando vs. Oficio?",
    a: "• Prohibido reservar, repetir, tachar o enmendar números de radicación (Art. 5 Acuerdo 060).\n• Memorando: comunicaciones INTERNAS entre dependencias.\n• Carta u Oficio: comunicaciones hacia personas o entidades EXTERNAS."
  },
  {
    cat: "Ofimática y Lógica",
    q: "¿Qué significa el 4.º argumento FALSO en BUSCARV y cuál es la negación contradictoria de «Todos los S son P»?",
    a: "• En BUSCARV, FALSO (o 0) exige coincidencia exacta.\n• La contradictoria de «Todos los S son P» (Tipo A) es «Al menos un S (algún S) NO es P» (Tipo O)."
  }
];

window.TRD_MATRIX_DATA = [
  {
    codigo: "100-02-01",
    dependencia: "Despacho Dirección Seccional",
    serie: "ACTAS",
    subserie: "Actas de Comité de Coordinación Seccional",
    tipos: "Citación, Orden del día, Listado de asistencia, Acta firmada",
    retencionAG: 2,
    retencionAC: 8,
    disposicion: "CT",
    procedimiento: "Conservación Total. Cumplido el tiempo en el Archivo Central (8 años), se realiza transferencia secundaria al Archivo Histórico por poseer valores secundarios e institucionales."
  },
  {
    codigo: "200-14-01",
    dependencia: "División de Cercanía al Ciudadano",
    serie: "DERECHOS DE PETICIÓN",
    subserie: "Peticiones de Información y Copias",
    tipos: "Oficio de solicitud radicada, Oficio de respuesta, Constancia de entrega de copias",
    retencionAG: 2,
    retencionAC: 3,
    disposicion: "E",
    procedimiento: "Eliminación. Cumplidos 2 años en AG y 3 años en AC tras cierre del trámite, se inventaría en FUID, se publica por 30 días hábiles en web y se elimina previa aprobación del Comité Institucional."
  },
  {
    codigo: "300-25-02",
    dependencia: "División Administrativa y Financiera",
    serie: "HISTORIAS LABORALES",
    subserie: "Historias Laborales de Servidores Públicos",
    tipos: "Acto de nombramiento, Acta de posesión, Evaluaciones de desempeño, Certificados, Acto de retiro",
    retencionAG: 2,
    retencionAC: 80,
    disposicion: "M/D + S",
    procedimiento: "Se conserva 2 años en AG tras retiro del funcionario y 80 años en AC por valor laboral y pensional. Se digitaliza (M/D) y se aplica Selección (S) de muestra representativa."
  },
  {
    codigo: "200-31-04",
    dependencia: "División de Cercanía al Ciudadano",
    serie: "REGISTRO ÚNICO TRIBUTARIO",
    subserie: "Expedientes de Inscripción y Actualización RUT",
    tipos: "Formulario 001 firmado, Soportes de representación legal, Constancia de formalización",
    retencionAG: 1,
    retencionAC: 9,
    disposicion: "M/D + CT",
    procedimiento: "Digitalización garantizando valor probatorio; permanece 1 año en AG después del trámite y 9 años en AC antes de pasar a conservación permanente electrónica."
  },
  {
    codigo: "300-08-01",
    dependencia: "Unidad de Correspondencia",
    serie: "INFORMES",
    subserie: "Planillas de Control de Comunicaciones Oficiales Enviadas",
    tipos: "Planilla diaria de envíos, Guía de mensajería, Acta de anulación de radicados",
    retencionAG: 2,
    retencionAC: 3,
    disposicion: "E",
    procedimiento: "Eliminación técnica por trituración una vez agotados los 5 años totales (2 en AG + 3 en AC), previa publicación del inventario en la web institucional por 30 días hábiles."
  }
];

window.EXCEL_LOGIC_EXERCISES = [
  {
    id: "ex1",
    type: "Excel",
    question: "Tienes en la celda C5 los días hábiles transcurridos de un derecho de petición de interés particular. Quieres que Excel muestre \"FUERA DE TÉRMINO\" si supera los 15 días hábiles o \"EN TÉRMINO\" en caso contrario. ¿Cuál fórmula escribes?",
    options: [
      "=SI(C5>15; \"FUERA DE TÉRMINO\"; \"EN TÉRMINO\")",
      "=BUSCARV(C5>15; \"FUERA DE TÉRMINO\"; \"EN TÉRMINO\"; FALSO)",
      "=CONTAR.SI(C5; \">15\"; \"FUERA DE TÉRMINO\")"
    ],
    correctIndex: 0,
    explanation: "La función condicional =SI(prueba_lógica; valor_si_verdadero; valor_si_falso) evalúa si C5>15; si se cumple, devuelve el segundo argumento y si no, el tercero."
  },
  {
    id: "ex2",
    type: "Excel",
    question: "Necesitas contar cuántos radicados de la columna B (rango B2:B800) pertenecen simultáneamente a la dependencia \"JURÍDICA\" y además en la columna D (rango D2:D800) tienen estado \"PENDIENTE\". ¿Qué función debes usar?",
    options: [
      "=CONTAR.SI(B2:B800; \"JURÍDICA\"; D2:D800; \"PENDIENTE\")",
      "=CONTAR.SI.CONJUNTO(B2:B800; \"JURÍDICA\"; D2:D800; \"PENDIENTE\")",
      "=SUMAR.SI(B2:B800; \"JURÍDICA\"; D2:D800)"
    ],
    correctIndex: 1,
    explanation: "Cuando debes contar registros que cumplen DOS o más condiciones simultáneas en distintas columnas, la función obligatoria es =CONTAR.SI.CONJUNTO(...)."
  },
  {
    id: "ex3",
    type: "Lógica Categorial",
    question: "Premisa normativa: «Ninguna comunicación personal dirigida a un funcionario se radica como comunicación oficial». ¿Cuál de las siguientes proposiciones es lógicamente equivalente (conversión válida de una Universal Negativa Tipo E)?",
    options: [
      "Algunas comunicaciones personales sí se radican si son urgentes.",
      "Ninguna comunicación radicada como oficial es una comunicación personal dirigida a un funcionario.",
      "Todas las comunicaciones que llegan a la DIAN son personales."
    ],
    correctIndex: 1,
    explanation: "En lógica categorial, la proposición Universal Negativa Tipo E («Ningún S es P») es simétrica y convertible sin perder validez: equivale exactamente a «Ningún P es S»."
  },
  {
    id: "ex4",
    type: "Lógica Categorial",
    question: "Premisa: «Todos los expedientes en el Archivo de Gestión cuentan con Hoja de Control». Durante una revisión, el auditor demuestra que esa afirmación es FALSA. ¿Qué se concluye con certeza?",
    options: [
      "Que ningún expediente del Archivo de Gestión tiene Hoja de Control.",
      "Que al menos un expediente del Archivo de Gestión NO cuenta con Hoja de Control.",
      "Que todos los expedientes pasaron al Archivo Histórico."
    ],
    correctIndex: 1,
    explanation: "La contradictoria (negación exacta) de «Todos los S son P» (Tipo A) es «Al menos un S (algún S) NO es P» (Tipo O). Basta con que 1 solo expediente no tenga Hoja de Control para que «Todos la tienen» sea falso."
  }
];
