# DOCUMENTO MAESTRO DE TRANSFERENCIA DE CONTEXTO: PLATAFORMA DE ESTUDIO DIAN 2676 (TODO-EN-UNO)
**Formato:** Especificación Funcional y Base de Conocimiento Completa (Normativa, Casos y Código)
**Convocatoria:** DIAN 2676 — Facilitador I (Nivel Asistencial) | OPEC: 236908 | Inscripción: 1273550754

---

## 1. PERFIL, ESTRATEGIA Y REGLAS DEL EXAMEN

### 1.1. Ficha Técnica del Aspirante y del Empleo
* **Proceso de Selección:** Convocatoria DIAN 2676 (Comisión Nacional del Servicio Civil - CNSC).
* **Denominación del Cargo:** Facilitador I.
* **Nivel Jerárquico:** Asistencial.
* **Código OPEC:** 236908.
* **Número de Inscripción:** 1273550754.
* **Fecha del Examen Escrito:** Domingo, 8 de noviembre de 2026.
* **Horario de la Jornada:** 8:00 a. m. a 1:00 p. m. (Duración máxima: 5 horas).
* **Hora Límite de Ingreso (Cierre de puertas):** 8:30 a. m.
* **Fecha de Corte Normativo:** Solo se evalúan normas vigentes expedidas antes del 19 de junio de 2026.
* **Meta de Puntaje Global:** +85.00 puntos (objetivo competitivo para asegurar posición de mérito en lista de elegibles).

### 1.2. Estructura de Pruebas, Pesos Porcentuales y Reglas de Calificación
* **1. Competencias Funcionales:** Eliminatoria | Peso: 70 % (sin experiencia) / 65 % (con experiencia) | Puntaje mínimo aprobatorio: 70.00 puntos | Pruebas de Juicio Situacional (PJS) con opciones A, B y C.
* **2. Competencias Comportamentales:** Clasificatoria | Peso: 20 % / 15 % | Autoinforme con escala de 4 niveles + subescalas de control.
* **3. Prueba de Integridad (Valores):** Clasificatoria | Peso: 10 % / 10 % | Autoinforme con escala de 4 niveles + subescalas de control.

### 1.3. Reglas de Oro para Responder como Facilitador I (Nivel Asistencial)
1. **Alcance Operativo y Asistencial:** Radica comunicaciones, verifica requisitos formales, orienta al ciudadano sobre trámites y canales, organiza expedientes conforme a las TRD, digita y depura bases de datos y apoya la logística de la dependencia.
2. **Prohibición de Usurpar Funciones:** Descartar opciones donde el Facilitador I emita un concepto jurídico vinculante, modifique de oficio una liquidación oficial, resuelva de fondo un recurso o autorice el levante de mercancía aprehendida.
3. **Actuación ante Falta de Competencia de la DIAN:** Nunca rechazar de plano un documento escrito ni resolver asuntos de otras entidades. Si es verbal, se orienta en el acto; si es escrito, se recibe, se radica y se traslada dentro de los 5 días hábiles siguientes (Art. 21, Ley 1755 de 2015), enviando copia del oficio remisorio al peticionario.
4. **Criterio Legal sobre Buena Fe:** Elegir siempre la opción que respete el procedimiento reglado, la cadena de mando, los términos legales y la trazabilidad escrita.


---

## 2. ESTADO TÉCNICO DEL REPOSITORIO Y HISTORIAL DE MEJORAS (ACTUALIZADO 19 OCT 2026)

### 2.1. Rutas y Despliegue Activo
* **Ruta Local del Proyecto:** `C:\Proyectos\dian-2676-facilitador`
* **Repositorio GitHub:** `https://github.com/GaraXPro/dian-2676-facilitador.git` (Rama principal: `main`)
* **Sitio Web en Vivo (GitHub Pages):** `https://garaxpro.github.io/dian-2676-facilitador/`
* **Usuario Git Configurado:** `GaraXPro` (`marcelino2210@gmail.com`) — Credenciales ya autenticadas en Windows Credential Manager.

### 2.2. Mejoras Recientes Aplicadas
1. **Barra de Música Discreta (`🎵 Música` en el Header):**
   - Se eliminó la tarjeta grande del Dashboard para dar protagonismo a los indicadores y al reloj Pomodoro.
   - Incluye cintilla colapsable con las 7 estaciones de Marcelino:
     1. *lofi hip hop radio 📚 beats to relax/study to* (`https://www.youtube.com/watch?v=rFZHOHl-L8A`)
     2. *Música Clásica de Enfoque (Mozart, Bach, Vivaldi & Piano)*
     3. *Synthwave / Chillstep Focus*
     4. *Bandas Sonoras Épicas (Hans Zimmer / Interstellar)*
     5. *Rock Argentino Clásico (Soda Stereo, Cerati, Charly, Enanitos)*
     6. *Cumbia Santafesina (Los Palmeras, Leo Mattioli, Trinidad)*
     7. *Salsa Brava Clásica (Héctor Lavoe, Willie Colón, Fania, Niche)*
   - Permite guardar y abrir link personalizado de YouTube/Spotify.
2. **Simulador PJS Mejorado:**
   - Botón `🎯 Repasar Fallados` para filtrar exclusivamente los reactivos contestados de forma incorrecta.
   - Botón `🔄 Reintentar este caso` individual en el panel de retroalimentación de cada reactivo.
   - Contador de fallos visible en el banner de puntaje.
3. **Motor de Audio Estable:**
   - Instancia única reutilizable de `AudioContext` para evitar bloqueos de sonido del navegador.
4. **Diseño 100% Responsivo (Celulares y Tablets):**
   - En pantallas móviles (`<= 768px`), el encabezado principal se desplaza naturalmente para no cubrir media pantalla, dejando únicamente la barra de pestañas (`nav-tabs`) fija arriba con deslizamiento táctil horizontal y autocentrado de pestaña activa.
   - Reestructuración de las filas de los 22 indicadores (`.indicator-item` + `.indicator-actions`), el visor lateral de estudio (con scroll automático al contenido al elegir un indicador en móvil), la hoja cuadriculada Cornell, el documento APA y las fórmulas de Excel para evitar cualquier desborde horizontal.
5. **Arquitectura de Curso Secuencial Profesional (Estilo Cisco Networking Academy + Coursera + Udemy):**
   - **Árbol Secuencial Conectado de 5 Pasos por Tema (`X.1` a `X.5` — 110 pasos en total):**
     - `X.1 📖 Lectura Teórica y Trampas CNSC`
     - `X.2 📓 Mapa en Libreta Cuadriculada (Método Cornell)`
     - `X.3 🛠️ Práctica y Laboratorio del Tema`: Integra las Flashcards propias de cada indicador, más la Calculadora/Matriz TRD dentro de los Indicadores #10 y #11, y el Taller Práctico de Excel/Razonamiento dentro de los Indicadores #21 y #22.
     - `X.4 🔗 Recursos Oficiales Verificados`: Cada enlace oficial tiene su propio check individual (`dian2676_checked_resources`) para marcar qué recurso ya se leyó hoy y cuál queda pendiente para después.
     - `X.5 ⚖️ Cuestionario de Sección (Simulador Integrado)`: Incluye **30 Casos PJS comentados** (6 casos en el Indicador #1, 5 casos en el Indicador #2 y cobertura en los 4 bloques) + integración directa de los reactivos de **Autoinforme Comportamental e Integridad (30%)** dentro de los Indicadores #3–#9 y #13–#20.
   - **Panel Lateral Estilo Cisco NetAcad:** Con dos pestañas superiores (`✓ Esquema de Curso` con árbol vertical desplegable `1.1` → `1.5` y `🔗 Recursos` con checks individuales) + botón azul oficial estilo Coursera **`[ ✓ Marcar como completo ]`** al final de cada sección.
   - **Cabecera Superior Reorganizada + Botón `▶️ Reanudar Aprendizaje` + Persistencia Total (`F5` seguro):** Guarda automáticamente en `localStorage` la pestaña activa, el indicador activo, el sub-paso exacto (`dian2676_last_position`) y los recursos vistos para que al recargar con `F5` o cerrar la pestaña nunca se pierda el hilo.
6. **Tonalidades Globales de Descanso Visual y Modo Concentración en TODA la Web:**
   - Los 3 temas (`📜 Sepia Cálido`, `🌙 Papel Oscuro`, `📄 Hoja Word`), el escalado de fuente (`A-`, `A+`) y el `🧘 Modo Concentración` se aplican de forma **global a toda la plataforma** (Dashboard, Aula del Curso, Simuladores, Talleres y Visor APA).
