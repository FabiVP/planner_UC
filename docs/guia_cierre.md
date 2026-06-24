# Guía de Exposición — Desglose Completo de la Rúbrica

## Fase de Control y Cierre del Proyecto UniScheduler

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Equipo:** UniScheduler | Taller de Proyectos 2 | Universidad Continental  
**Duración estimada:** 30 min

**Propósito de este documento:** Explica en detalle cada entregable, cada criterio de la rúbrica, qué debe contener, por qué es importante, cómo lo implementamos y —lo más importante— muestra el código real que respalda cada afirmación. No es solo un listado: es la guía completa para entender y defender cada parte del proyecto frente al evaluador, con evidencia técnica verificable.

---

## Estructura de la Exposición

| Bloque | Tema | Tiempo |
|--------|------|--------|
| 1 | Apertura: qué es la fase de cierre y qué nos pide la consigna | 2 min |
| 2 | Los 11 entregables obligatorios — qué son, qué contienen, cómo están estructurados y cómo los implementamos | 5 min |
| 3 | Los 14 criterios de la rúbrica — explicación completa de cada uno con ejemplos de código | 16 min |
| 4 | Guía práctica para alcanzar el nivel sobresaliente | 3 min |
| 5 | Criterios de éxito, métricas finales y cierre | 4 min |

---

# BLOQUE 1: APERTURA

---

## 1.1 ¿Qué es la fase de control y cierre?

**Concepto:** La fase de control y cierre es la última fase del ciclo de vida del proyecto, según el enfoque PMBOK. No es simplemente "entregar documentos": es el proceso formal de consolidar toda la documentación generada durante el proyecto, verificar que los entregables tengan trazabilidad entre sí, validar que la documentación sea internamente consistente (números, fechas, IDs, terminología), registrar las incidencias y riesgos que efectivamente ocurrieron, y asegurar que el proyecto deje evidencia verificable de control, mantenimiento y versionamiento.

**¿Por qué es importante?** Porque sin una fase de cierre bien documentada, el proyecto no tiene memoria institucional. No se puede saber qué salió bien, qué salió mal, cuánto costó realmente, o cómo mantener el producto. El cierre es lo que transforma un proyecto en aprendizaje organizacional.

---

## 1.2 ¿Qué nos pide la consigna TP2?

La consigna, documentada en el archivo `TP_2 Consigna fase de control y cierre del proyecto.md`, nos pide específicamente:

**Objetivo general:**
> "Elaborar, actualizar, consolidar y versionar la documentación asociada al control y cierre del Proyecto, garantizando coherencia entre los entregables técnicos, administrativos y de gestión, mediante el uso de mecanismos formales de documentación, control de configuración y trazabilidad del proyecto."

**Entregables que nos pide (11 en total):**
- **2 informes principales:** Informe Final del Proyecto, Informe de Lecciones Aprendidas
- **5 registros administrativos:** Riesgos, Incidentes, Impedimentos, Defectos, Supuestos
- **4 documentos de cierre formal:** Project Charter (revisado), Acta de Cierre, SOW (Statement of Work), Guía de Capacitación

**Requisitos de formato:**
- Todos los documentos en Markdown (.md)
- Organización coherente en carpetas dentro del repositorio
- Nombres de archivo consistentes y descriptivos
- Versionamiento con commits semánticos (Conventional Commits)
- Enlaces cruzados entre documentos (trazabilidad)

**Cómo será evaluado:**
Mediante una rúbrica de 14 criterios, cada uno con 4 niveles: Sobresaliente (3 pts), Suficiente (2), En desarrollo (1), Insatisfactorio (0). Máximo total: 42 puntos.

---

## 1.3 Nuestro proyecto: UniScheduler

**¿Qué es?** Un sistema web para generar horarios académicos óptimos en universidades con currículo flexible. Permite que coordinadores definan carreras y cursos, que docentes registren preferencias y disponibilidad, que estudiantes se matriculen y obtengan horarios personalizados, y que el sistema genere horarios respetando 14 restricciones simultáneamente.

**Stack tecnológico:**
- **Backend:** Node.js + Express, MongoDB + Mongoose, JWT para autenticación
- **Frontend:** React + Vite, React Router, Chart.js, CSS Modules
- **Motor de generación:** CSP con backtracking + MRV (Minimum Remaining Values) + Forward Checking + Algoritmo de Kuhn para matching bipartito
- **Calidad:** ESLint, Prettier, SonarQube, Swagger/OpenAPI
- **Infraestructura:** Docker, docker-compose, GitHub Actions (CI/CD)

**Lo que implementamos:**
- 12 requerimientos funcionales (RF-01 a RF-12): autenticación, CRUD de cursos/docentes/estudiantes/aulas, matrícula, generación de horarios, horarios personalizados, reportes, notificaciones, simulaciones, preferencias, proyecciones, restricciones, políticas institucionales
- 7 requerimientos no funcionales (RNF-01 a RNF-07): rendimiento (<30s generación), seguridad (OWASP), usabilidad, disponibilidad, mantenibilidad, escalabilidad, compatibilidad
- 393 pruebas automatizadas (261 backend + 132 frontend)
- Quality Gate SonarQube con Rating A y 0 vulnerabilidades

---

# BLOQUE 2: LOS 11 ENTREGABLES OBLIGATORIOS

## Lo que necesita la exposición en este bloque

En este bloque debes explicar cada uno de los 11 entregables: qué son, qué debe contener cada parte según la consigna, cómo está estructurado cada componente dentro del documento, y por qué cada componente es importante. No es solo "lo hicimos": es explicar qué contiene cada sección y cómo se evidencia.

---

## 2.1 Informe Final del Proyecto

**Archivo:** `docs/cierre/informe_final_proyecto.md`

**¿Qué es?** Es el documento principal de cierre. Su propósito es proporcionar al patrocinador una visión general del desempeño del proyecto y servir como registro histórico para futuros proyectos. Es el documento que responde la pregunta: "¿Qué logramos realmente y cómo?"

### 2.1.1 Resumen ejecutivo

**¿Qué es y por qué es importante?** El resumen ejecutivo es la primera sección que lee el patrocinador. Debe responder en 3-4 párrafos: (1) ¿qué problema resuelve el sistema?, (2) ¿qué alcance tuvo el proyecto?, (3) ¿cuáles fueron los resultados clave? Si el resumen no comunica bien, el lector puede no continuar leyendo.

**¿Qué contiene el nuestro?**
- **Párrafo 1:** Explica que UniScheduler es un sistema web desarrollado con stack MERN que utiliza algoritmos CSP (backtracking + MRV + Forward Checking) para generar horarios académicos óptimos en instituciones con currículo flexible.
- **Párrafo 2:** Describe el alcance del proyecto: 12 requerimientos funcionales (autenticación, CRUD, matrícula, generación de horarios, reportes, notificaciones, etc.) y 7 no funcionales (rendimiento, seguridad, usabilidad, etc.) implementados y verificados.
- **Párrafo 3:** Presenta los resultados principales: 393 tests automatizados (261 backend + 132 frontend), Quality Gate SonarQube con Rating A y 0 vulnerabilidades, tiempo de generación CSP de 0.597 segundos (`backend/engine/csp.js`), presupuesto ejecutado de S/6,210.40 sin desviación.

**¿Dónde se evidencia?** En la sección "Resumen Ejecutivo" del archivo `docs/cierre/informe_final_proyecto.md`.

### 2.1.2 Desempeño del alcance

**¿Qué es y por qué es importante?** Esta sección mide cuánto de lo planificado se completó realmente. El evaluador quiere ver un porcentaje claro de cumplimiento y trazabilidad: cada requerimiento debe poder rastrearse desde su definición hasta su implementación.

**¿Qué contiene el nuestro?** Una tabla con los 19 requerimientos (12 RF + 7 RNF), cada uno con: ID, nombre, descripción, estado (Completo/Parcial/No implementado), enlace al archivo de implementación en el código, y enlace al test que lo verifica. El resultado es 18 completos y 1 parcial (RNF-04: cobertura de código, porque la cobertura global del frontend está al 14.47%).

**¿Dónde se evidencia?** En la sección "Desempeño de Alcance" del informe final, con la tabla completa.

### 2.1.3 Desempeño de calidad

**¿Qué es y por qué es importante?** El evaluador quiere métricas duras de calidad: no solo "probamos el sistema", sino cuántas pruebas hay, qué cobertura tienen, qué dice SonarQube. La calidad debe ser cuantificable.

**¿Qué contiene el nuestro?** Una tabla con las siguientes métricas:
- Pruebas backend: 261 tests en 21 suites de prueba
- Pruebas frontend: 132 tests en 18 suites de prueba
- Cobertura de statements backend: 41.09% global, ~94% en módulos críticos (auth, classrooms, courses, students, security middleware)
- Cobertura de branches backend: 27.86%
- SonarQube Quality Gate: PASSED con Rating A
- Vulnerabilidades: 0
- Code Smells: manejados y documentados

**¿Dónde se evidencia?** En la sección "Desempeño de Calidad" del informe final.

### 2.1.4 Desempeño de cronograma

**¿Qué es y por qué es importante?** Compara el plan original contra la ejecución real. Responde: ¿entregamos a tiempo? ¿Qué Sprints se atrasaron? ¿Por qué?

**¿Qué contiene el nuestro?** Una tabla comparativa desde Sprint 0 hasta Sprint 5, mostrando:
- Sprint 0: Planificado 7 días / Real 7 días / Hito: Stack definido, requisitos documentados
- Sprint 1: Planificado 14 días / Real 14 días / Hito: CRUD backend completo
- Sprint 2: Planificado 14 días / Real 17 días / Hito: Motor CSP funcional (+3 días por capacitación)
- Sprint 3: Planificado 14 días / Real 14 días / Hito: Frontend con schedule grid
- Sprint 4: Planificado 14 días / Real 16 días / Hito: Matching Kuhn + horarios personalizados (+2 días por datos externos)
- Sprint 5: Planificado 14 días / Real 14 días / Hito: QA, documentación y cierre

**¿Dónde se evidencia?** En la sección "Desempeño de Cronograma" del informe final.

### 2.1.5 Desempeño de costos

**¿Qué es y por qué es importante?** Muestra el presupuesto planificado vs. ejecutado. El evaluador quiere ver que hubo control financiero.

**¿Qué contiene el nuestro?** Tabla de presupuesto con 4 fuentes de costo:
- Personal de desarrollo: Planificado S/4,200.00 / Real S/4,200.00 / Variación 0%
- Software y licencias: Planificado S/510.40 / Real S/510.40 / Variación 0%
- Infraestructura: Planificado S/750.00 / Real S/750.00 / Variación 0%
- Contingencia (10%): Planificado S/750.00 / Real S/750.00 / Variación 0%
- **Total:** Planificado S/6,210.40 / Real S/6,210.40 / Variación 0%

**¿Dónde se evidencia?** En la sección "Desempeño de Costos" del informe final.

### 2.1.6 Resumen de riesgos e incidentes

**¿Qué es y por qué es importante?** No es el registro detallado, sino un resumen ejecutivo de los problemas que ocurrieron y cómo se gestionaron.

**¿Qué contiene el nuestro?** Un resumen que menciona: 10 incidentes documentados (desde caída de MongoDB hasta bugs de interfaz), 7 impedimentos (falta de experiencia CSP, dependencia de datos externos), 15 defectos clasificados por severidad, y una referencia a los registros detallados para quien quiera profundizar.

**¿Dónde se evidencia?** En la sección "Resumen de Riesgos e Incidentes" con referencias a los registros detallados: `docs/seguimiento_control/registro_incidentes.md`, `docs/seguimiento_control/registro_impedimentos.md`, `docs/seguimiento_control/registro_defectos.md`.

### 2.1.7 Conclusiones estratégicas

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo es capaz de analizar los resultados y extraer aprendizaje. No es solo "todo salió bien", sino un análisis crítico con datos.

**¿Qué contiene el nuestro?** Conclusiones basadas en evidencia numérica: el tiempo de generación CSP (0.597s) está muy por debajo de la meta de 30 segundos, demostrando que el motor es eficiente; la cobertura crítica del 94% asegura que los módulos más importantes están probados; se incluyen recomendaciones como implementar CI/CD desde el Sprint 1 en proyectos futuros.

**¿Dónde se evidencia?** En la sección "Conclusiones y Recomendaciones" del informe final.

---

## 2.2 Informe de Lecciones Aprendidas

**Archivo:** `docs/cierre/lecciones_aprendidas.md`

**¿Qué es?** Compila el aprendizaje generado durante el proyecto: retrospectivas, buenas prácticas, errores, acciones correctivas. La consigna pide que sea crítico y reflexivo, no una simple lista de "cosas que pasaron".

### 2.2.1 Retrospectivas por Sprint (Sprint 0 a Sprint 5)

**¿Qué es y por qué es importante?** Cada Sprint debe tener su retrospectiva documentada con el formato Start-Stop-Continue. Esto muestra que el equipo aplicó mejora continua durante todo el proyecto, no solo al final.

**¿Qué contiene el nuestro?** Para cada Sprint (0 a 5), documentamos:
- **Start (Qué empezar a hacer):** Por ejemplo, en Sprint 1: "Empezar a usar Conventional Commits". En Sprint 2: "Empezar a ejecutar pruebas antes de cada merge".
- **Stop (Qué dejar de hacer):** Por ejemplo, en Sprint 3: "Dejar de hacer commits directos a main".
- **Continue (Qué continuar haciendo):** Por ejemplo, "Continuar con las daily standups", "Continuar con code review".

**¿Dónde se evidencia?** En la sección "Retrospectivas por Sprint" del archivo `docs/cierre/lecciones_aprendidas.md`.

### 2.2.2 Buenas prácticas identificadas

**¿Qué es y por qué es importante?** Identificar qué salió bien y por qué. El evaluador quiere ver que el equipo sabe reconocer aciertos y escalarlos.

**¿Qué contiene el nuestro?**
- **Git Flow con Conventional Commits desde Sprint 1:** Esto mejoró la organización del código, permitió rastrear cada cambio a un requerimiento específico, y facilitó el code review. Se evidencia en el historial de commits con formato `feat:`, `fix:`, `docs:`, `test:`.
- **SonarQube Quality Gate desde Sprint 2:** Permitió mantener 0 vulnerabilidades durante todo el proyecto y Rating A consistente. Se evidencia en los reportes de SonarQube.
- **Pipeline CI/CD:** Redujo errores de regresión a cero porque cada PR ejecuta automáticamente los 393 tests antes de hacer merge. Se evidencia en `.github/workflows/test.yml`.

### 2.2.3 Errores y causas raíz

**¿Qué es y por qué es importante?** El evaluador no quiere excusas, quiere análisis. La técnica de los 5 porqués demuestra que el equipo investigó las causas profundas, no se quedó en lo superficial.

**¿Qué contiene el nuestro?** Aplicamos la técnica de los 5 porqués al error principal:
- **Problema:** Subestimación del tiempo de testing en Sprints 1 y 2.
- **Porqué 1:** Porque el equipo no tenía experiencia con Jest y supertest.
- **Porqué 2:** Porque era la primera vez que usaban estas herramientas en un proyecto real.
- **Porqué 3:** Porque no se incluyó capacitación en testing en el plan del Sprint 0.
- **Porqué 4:** Porque se asumió que la experiencia previa en otros frameworks era transferible.
- **Porqué 5:** Porque no se evaluaron las habilidades reales del equipo en testing al inicio del proyecto.
- **Causa raíz:** Falta de evaluación inicial de competencias técnicas del equipo.

### 2.2.4 Acciones correctivas aplicadas

**¿Qué es y por qué es importante?** No basta con identificar errores: hay que mostrar qué se hizo para corregirlos y que la corrección fue efectiva.

**¿Qué contiene el nuestro?** Las acciones correctivas implementadas:
- Se creó un pipeline CI/CD que ejecuta pruebas automáticamente en cada PR
- Se agregaron tests en los módulos críticos (auth, classrooms, courses, scoring)
- Se configuró ESLint y Prettier para estandarizar el código
- **Resultado:** Después de estas acciones, los errores por regresión se redujeron a cero

### 2.2.5 Oportunidades de mejora

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo puede proponer mejoras concretas para proyectos futuros, no solo quejarse de lo que salió mal.

**¿Qué contiene el nuestro?** Recomendaciones específicas:
- Definir estándares de calidad desde el Sprint 0, no desde el Sprint 2
- Incluir capacitación en testing al inicio del proyecto (primeros 3 días del Sprint 0)
- Establecer métricas de calidad desde el primer Sprint y monitorearlas semanalmente

### 2.2.6 Aprendizaje organizacional

**¿Qué es y por qué es importante?** El evaluador quiere ver que el aprendizaje trasciende el proyecto y puede aplicarse a otros proyectos de la organización.

**¿Qué contiene el nuestro?** Recomendaciones transferibles:
- La calidad debe medirse desde el inicio, no al final. Implementar SonarQube desde el Sprint 1.
- El CI/CD debe implementarse en el Sprint 1, no cuando ya hay errores de integración.
- Las retrospectivas deben ser estructuradas (formato Start-Stop-Continue) para generar aprendizaje real, no solo conversación informal.

---

## 2.3 Registro de Riesgos

**Archivo:** `docs/planificacion/Registro_de_riesgos/Registro_de_Riesgos.md`

**¿Qué es?** Documenta los eventos de riesgo identificados durante la planificación, su evolución a lo largo del proyecto, y las respuestas aplicadas. No es una lista estática: es un registro vivo que se actualizó al cierre.

### 2.3.1 Identificación de riesgos

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo identificó riesgos relevantes, no riesgos genéricos. Cada riesgo debe estar vinculado a una característica real del proyecto.

**¿Qué contiene el nuestro?** Identificamos más de 10 riesgos específicos del contexto de UniScheduler:
- **R-01: Falta de experiencia con motor CSP.** El equipo nunca había implementado un solver de restricciones. Probabilidad: Alta. Impacto: Alto.
- **R-02: Cambios en requisitos durante el desarrollo.** El alcance podía variar porque el cliente no tenía experiencia con sistemas de horarios. Probabilidad: Media. Impacto: Alto.
- **R-03: Dependencia de datos reales de la universidad.** Sin datos, no podíamos probar el motor CSP. Probabilidad: Alta. Impacto: Medio.
- **R-04: Disponibilidad del equipo.** Miembros del equipo con otros cursos y responsabilidades. Probabilidad: Media. Impacto: Medio.
- **R-05: Rendimiento del CSP.** El algoritmo podría no cumplir la meta de 30 segundos. Probabilidad: Media. Impacto: Alto.

### 2.3.2 Probabilidad e impacto

**¿Qué es y por qué es importante?** No todos los riesgos son iguales. El evaluador quiere ver que el equipo clasificó cada riesgo con criterios claros.

**¿Qué contiene el nuestro?** Cada riesgo tiene columnas de probabilidad (Alta/Media/Baja) e impacto (Alto/Medio/Bajo). La probabilidad se determinó por la experiencia del equipo y el contexto del proyecto. El impacto se midió en términos de días de retraso potencial y costo adicional.

### 2.3.3 Priorización

**¿Qué es y por qué es importante?** La priorización permite al equipo enfocarse en los riesgos más importantes.

**¿Qué contiene el nuestro?** La prioridad se calculó multiplicando probabilidad × impacto. Por ejemplo, un riesgo con probabilidad Alta (3) e impacto Alto (3) tiene prioridad 9. Los riesgos están ordenados de mayor a menor prioridad en el registro.

### 2.3.4 Estrategia de respuesta

**¿Qué es y por qué es importante?** No basta con identificar riesgos: hay que planificar qué hacer si ocurren.

**¿Qué contiene el nuestro?** Definimos estrategias específicas:
- **Mitigar:** Para el riesgo CSP (R-01), planificamos una capacitación interna de 2 días.
- **Aceptar:** Para cambios en requisitos (R-02), aceptamos el riesgo pero establecimos un proceso de control de cambios.
- **Transferir:** Para seguridad de datos, transferimos el riesgo a la infraestructura cloud (MongoDB Atlas).
- **Evitar:** Para riesgos con probabilidad muy alta, rediseñamos el alcance para evitarlos.

### 2.3.5 Estado final

**¿Qué es y por qué es importante?** Al cierre, cada riesgo debe tener un estado final que muestre si ocurrió o no, y cómo se gestionó.

**¿Qué contiene el nuestro?** Marcamos cada riesgo como:
- **Cerrado:** No ocurrió durante el proyecto (ej: R-02 cambios en requisitos no ocurrieron)
- **Materializado:** Ocurrió y se gestionó (ej: R-01 falta experiencia CSP sí ocurrió, se mitigó con capacitación)
- **Mitigado:** Se redujo su impacto (ej: R-03 datos externos se mitigó generando datos sintéticos)

### 2.3.6 Lección aprendida por riesgo

**¿Qué es y por qué es importante?** Esta columna adicional muestra que el equipo reflexionó sobre cada riesgo más allá de si ocurrió o no.

**¿Qué contiene el nuestro?** Cada riesgo tiene una reflexión. Por ejemplo, para R-01: "La capacitación interna fue efectiva, pero debería haberse planificado en el Sprint 0 en lugar de esperar a que el riesgo se materializara en el Sprint 2".

---

## 2.4 Registro de Incidentes

**Archivo:** `docs/seguimiento_control/registro_incidentes.md`

**¿Qué es?** Documenta problemas reales que surgieron durante la ejecución, no potenciales (como los riesgos), sino los que efectivamente ocurrieron y afectaron el desarrollo.

### 2.4.1 Incidencias reales documentadas

**¿Qué es y por qué es importante?** El evaluador quiere ver incidentes reales y específicos, no genéricos. Cada incidente debe tener una historia: qué pasó, cuándo, cómo se detectó.

**¿Qué contiene el nuestro?** Documentamos 10 incidentes reales (INC-001 a INC-010):
- **INC-001:** Caída del servidor MongoDB Atlas (24/03/2026). Dejó el backend inaccesible por 2 horas.
- **INC-002:** Conflicto de merge en rama develop (02/04/2026). Dos desarrolladores modificaron el mismo archivo.
- **INC-003:** Bug en ScheduleGrid: mostraba 11 franjas en lugar de 15 (10/04/2026). El RF-05 exige franjas de 07:00 a 22:00.
- **INC-004:** Error 500 al generar horarios sin docentes disponibles (15/04/2026).
- **INC-005:** Lentitud en dashboard con muchos datos (22/04/2026). Tiempo de carga >5 segundos.
- **INC-006:** Error en validación de matrícula: permitía créditos fuera del rango 12-25 (05/05/2026).
- **INC-007:** Problema de CORS al conectar frontend con backend en producción (12/05/2026).
- **INC-008:** Error en exportación de reportes a PDF (20/05/2026).
- **INC-009:** Inconsistencia en datos de prueba entre desarrolladores (28/05/2026).
- **INC-010:** Error en restauración de generaciones anteriores (05/06/2026).

### 2.4.2 Responsables asignados

**¿Qué es y por qué es importante?** Cada incidente debe tener un responsable claro. Esto demuestra que el equipo tenía ownership y no se perdían los problemas.

**¿Qué contiene el nuestro?** Cada incidente tiene un responsable asignado según el módulo afectado: frontend (desarrollador frontend), backend (desarrollador backend), base de datos (desarrollador backend), integración (Scrum Master).

### 2.4.3 Prioridad y estado

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo supo priorizar: no todos los incidentes son igual de urgentes.

**¿Qué contiene el nuestro?** Clasificamos cada incidente con:
- **Prioridad:** Alta (bloquea funcionalidad crítica), Media (afecta pero tiene workaround), Baja (cosmético o mejora)
- **Estado:** Abierto, En Proceso, Resuelto, Cerrado
- **Ejemplo:** INC-003 (bug ScheduleGrid) fue prioridad Alta porque el RF-05 es un requerimiento funcional clave

### 2.4.4 Acción correctiva

**¿Qué es y por qué es importante?** No basta con reportar el problema: hay que documentar qué se hizo para resolverlo.

**¿Qué contiene el nuestro?** Para cada incidente, describimos la solución aplicada. Por ejemplo, INC-003: "Se agregaron las 4 franjas faltantes (18:00, 19:00, 20:00, 21:00) en el archivo `frontend/src/components/schedule/ScheduleGrid.jsx` (líneas 31-41) y se actualizaron los tests en `frontend/src/tests/components/ScheduleGrid.test.jsx` para verificar que ahora se renderizan exactamente 15 franjas de 07:00 a 22:00".

### 2.4.5 Evidencia de cierre

**¿Qué es y por qué es importante?** El evaluador quiere poder verificar que el incidente está realmente resuelto, no solo "marcado como resuelto".

**¿Qué contiene el nuestro?** Enlaces directos al commit o PR donde se aplicó la corrección. Por ejemplo, para INC-003: enlace al commit `ba4daaa` que contiene el fix.

---

## 2.5 Registro de Impedimentos

**Archivo:** `docs/seguimiento_control/registro_impedimentos.md`

**¿Qué es?** Documenta obstáculos que frenaron el progreso del equipo. La diferencia con los incidentes es que los impedimentos son problemas de gestión/entorno, no bugs técnicos.

### 2.5.1 Impedimentos identificados

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo identificó los cuellos de botella reales.

**¿Qué contiene el nuestro?** 7 impedimentos documentados (IMP-001 a IMP-007):
- **IMP-001:** Falta de experiencia del equipo con el motor CSP (Sprint 2). El equipo tardó 3 días más de lo planificado en implementar el solver.
- **IMP-002:** Dependencia de datos externos de la universidad (Sprint 2-3). La universidad solo proporcionó una muestra limitada de datos.
- **IMP-003:** Problemas de conectividad con MongoDB Atlas (Sprint 1). Cortes intermitentes que afectaron el desarrollo.
- **IMP-004:** Conflicto de horarios del equipo (Sprint 0-5). Miembros con otros cursos y trabajos.
- **IMP-005:** Curva de aprendizaje de React para pruebas (Sprint 3). El equipo no conocía React Testing Library.
- **IMP-006:** Falta de documentación de API externa (Sprint 4). Para integración con sistemas existentes.
- **IMP-007:** Limitaciones de hardware para pruebas locales (Sprint 5). Equipos con poca memoria RAM.

### 2.5.2 Análisis de impacto

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo midió el impacto real, no solo dijo "nos atrasó".

**¿Qué contiene el nuestro?** Medimos el impacto en días:
- IMP-001: +3 días en cronograma, sin impacto en costo
- IMP-002: +2 días en cronograma, sin impacto en costo
- IMP-003: +1 día en cronograma, sin impacto en costo

### 2.5.3 Mapeo a riesgos

**¿Qué es y por qué es importante?** Esto demuestra trazabilidad: los impedimentos no son sorpresas, son riesgos que se materializaron.

**¿Qué contiene el nuestro?** Cada impedimento está mapeado a un riesgo del Risk Register:
- IMP-001 (falta experiencia CSP) → R-03 del Risk Register
- IMP-002 (datos externos) → R-05 del Risk Register
- IMP-003 (conectividad) → R-07 del Risk Register

### 2.5.4 Acciones de mitigación

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo no solo reportó el problema, sino que actuó para resolverlo.

**¿Qué contiene el nuestro?** Mitigaciones aplicadas:
- IMP-001: Capacitación interna de 2 días a cargo del desarrollador más experimentado
- IMP-002: Generación de datos sintéticos realistas para completar las pruebas
- IMP-003: Cambio a MongoDB local para desarrollo, manteniendo Atlas solo para producción

### 2.5.5 Gestión activa del equipo

**¿Qué es y por qué es importante?** El evaluador quiere evidencia de que el Scrum Master dio seguimiento activo.

**¿Qué contiene el nuestro?** Para cada impedimento, documentamos en qué daily standup se reportó y cómo se escaló. Esto demuestra que el equipo practicó Scrum de verdad, no solo en el papel.

---

## 2.6 Registro de Defectos

**Archivo:** `docs/seguimiento_control/registro_defectos.md`

**¿Qué es?** Identifica defectos técnicos detectados durante el desarrollo (bugs), su severidad, corrección y validación. La diferencia con incidentes: los defectos son bugs en el código; los incidentes pueden ser operativos.

### 2.6.1 Defectos documentados

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo hizo QA real y documentó los bugs encontrados.

**¿Qué contiene el nuestro?** 15 defectos (DEF-001 a DEF-015):
- **DEF-001:** Error 500 al generar horarios si no hay docentes disponibles. Backend. Severidad: Crítico.
- **DEF-002:** ScheduleGrid muestra 11 franjas en lugar de 15. Frontend. Severidad: Crítico.
- **DEF-003:** Validación de créditos permite valores fuera del rango 12-25. Backend. Severidad: Mayor.
- **DEF-004:** Schedule no ordenado por hora de inicio. Frontend. Severidad: Menor.
- **DEF-005:** Error al eliminar generación con schedules asociados. Backend. Severidad: Crítico.
- **DEF-006:** Al actualizar un curso, no se valida el tipo de aula. Backend. Severidad: Mayor.
- **DEF-007:** El login no muestra mensaje de error claro. Frontend. Severidad: Menor.
- **DEF-008:** Al crear matrícula, no verifica prerequisitos. Backend. Severidad: Mayor.
- **DEF-009:** Tabla de horarios no responsive en móvil. Frontend. Severidad: Menor.
- **DEF-010:** Error en cálculo de horas totales del docente. Backend. Severidad: Mayor.
- **DEF-011:** Restricción RD-04 (capacidad de aula) no se aplica correctamente. Backend. Severidad: Mayor.
- **DEF-012:** Modal de confirmación no se cierra al hacer clic fuera. Frontend. Severidad: Menor.
- **DEF-013:** Error al importar datos de estudiantes desde CSV. Backend. Severidad: Mayor.
- **DEF-014:** Carga de datos duplicados al ejecutar seed múltiples veces. BD. Severidad: Mayor.
- **DEF-015:** Índices faltantes en colección schedules causan lentitud. BD. Severidad: Menor.

### 2.6.2 Clasificación por severidad y módulo

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo clasificó los defectos para priorizar correcciones.

**¿Qué contiene el nuestro?**
- Por severidad: 3 Críticos, 7 Mayores, 5 Menores
- Por módulo: 5 Frontend, 8 Backend, 2 BD

### 2.6.3 Corrección registrada

**¿Qué es y por qué es importante?** Cada defecto debe tener su fix documentado con trazabilidad al repositorio.

**¿Qué contiene el nuestro?** Cada defecto tiene un enlace al commit o PR donde se corrigió. Por ejemplo, DEF-002 se corrigió en el commit donde se modificó `frontend/src/components/schedule/ScheduleGrid.jsx`.

### 2.6.4 Validación con test

**¿Qué es y por qué es importante?** El evaluador quiere ver que el fix no fue "a ciegas", sino que se validó con una prueba automatizada.

**¿Qué contiene el nuestro?** Cada defecto tiene el nombre del archivo de test que valida la corrección. Por ejemplo, DEF-002 se validó con `frontend/src/tests/components/ScheduleGrid.test.jsx`, que verifica que se renderizan exactamente 15 franjas de 07:00 a 22:00.

---

## 2.7 Registro de Supuestos

**Archivo:** `docs/inicio/Supuestos-y-Restricciones.md`

**¿Qué es?** Documenta los supuestos bajo los cuales se planificó el proyecto, y cómo se validaron durante la ejecución.

### 2.7.1 Supuestos identificados

**¿Qué es y por qué es importante?** El evaluador quiere ver que el equipo fue explícito sobre lo que daba por sentado.

**¿Qué contiene el nuestro?** Los supuestos definidos en Sprint 0:
- **SUP-01:** La universidad proporcionará datos reales de cursos y docentes para pruebas.
- **SUP-02:** El equipo tendrá acceso continuo a MongoDB Atlas.
- **SUP-03:** Los miembros del equipo podrán dedicar al menos 15 horas semanales al proyecto.
- **SUP-04:** Las tecnologías open source (MERN) serán suficientes para implementar todos los requerimientos.
- **SUP-05:** El algoritmo CSP podrá generar horarios válidos en menos de 30 segundos.

### 2.7.2 Estado final actualizado

**¿Qué es y por qué es importante?** Al cierre, cada supuesto debe tener un estado que muestre si se cumplió o no.

**¿Qué contiene el nuestro?**
- SUP-01: **Parcialmente cumplido.** Solo obtuvimos una muestra limitada de datos. Generamos datos sintéticos para completar.
- SUP-02: **Válido.** MongoDB Atlas funcionó durante todo el proyecto.
- SUP-03: **Válido.** El equipo cumplió con la dedicación comprometida.
- SUP-04: **Válido.** MERN fue suficiente para todos los RF-01 a RF-12.
- SUP-05: **Válido.** CSP genera horarios en 0.597s, muy por debajo de la meta.

### 2.7.3 Análisis de impacto

**¿Qué es y por qué es importante?** Cuando un supuesto resulta falso o parcial, el equipo debe analizar cómo afectó al proyecto.

**¿Qué contiene el nuestro?** Para SUP-01 (datos reales parciales): el impacto fue que tuvimos que dedicar 2 días adicionales a generar datos sintéticos realistas. La decisión fue documentada en el plan de pruebas y no afectó la calidad final del producto, porque los datos sintéticos cubrieron todos los casos de borde necesarios.

---

## 2.8 Project Charter (Acta de Constitución)

**Archivo:** `docs/planificacion/Acta de Constitución del Proyecto.md`

**¿Qué es?** El documento que autorizó formalmente el proyecto. En la fase de cierre, se revisa para verificar si se cumplieron los objetivos y criterios de éxito definidos al inicio.

### 2.8.1 Revisión de objetivos

**¿Qué es y por qué es importante?** El evaluador quiere ver una comparación directa: objetivo definido en Sprint 0 vs. resultado real al cierre.

**¿Qué contiene el nuestro?** Una tabla que compara cada objetivo del Project Charter con el resultado real:
- **Objetivo 1:** "Desarrollar un sistema de generación de horarios usando algoritmos CSP" → **Resultado:** Implementado con backtracking + MRV + Forward Checking. Evidencia: motor CSP en `backend/engine/csp.js`, tiempo de generación 0.597s.
- **Objetivo 2:** "Implementar autenticación con roles y permisos" → **Resultado:** Implementado con JWT y 4 roles (admin, coordinador, docente, estudiante). Evidencia: `backend/controllers/auth.controller.js`, 10 tests.
- **Objetivo 3:** "Permitir matrícula con validación de créditos" → **Resultado:** Implementado con rango 12-25 créditos. Evidencia: `backend/controllers/enrollment.controller.js`.

### 2.8.2 Criterios de éxito

**¿Qué es y por qué es importante?** No son objetivos, son indicadores que determinan si el proyecto fue exitoso.

**¿Qué contiene el nuestro?** Checklist con cada criterio y su evidencia de cumplimiento:
- Generación de horarios en <30s → 0.597s ✅
- Cobertura de tests >80% en módulos críticos → ~94% ✅
- 0 vulnerabilidades críticas en SonarQube → 0 vulnerabilidades ✅
- Presupuesto dentro del límite → S/6,210.40 sin desviación ✅

### 2.8.3 In-Scope / Out-of-Scope actualizado

**¿Qué es y por qué es importante?** El alcance puede cambiar durante el proyecto. Al cierre, debe reflejar lo que realmente se hizo.

**¿Qué contiene el nuestro?** Actualizamos el In-Scope para incluir RF-08 a RF-12 (reportes, notificaciones, simulaciones, preferencias de horario, proyecciones de demanda) que originalmente estaban en Out-of-Scope pero se implementaron porque el avance del proyecto lo permitió. El Out-of-Scope final incluye: integración con sistemas SIS/ERP, aplicación móvil nativa, despliegue en producción real, pasarela de pagos, multi-idioma, y notificaciones push.

---

## 2.9 Acta de Cierre del Proyecto

**Archivo:** `acta_cierre_proyecto.md` (raíz del repositorio)

**¿Qué es?** Documento formal que certifica el cierre del proyecto. Es el equivalente a una "factura" administrativa: formaliza que el proyecto terminó y que el cliente acepta los entregables.

### 2.9.1 Datos del proyecto

**¿Qué es y por qué es importante?** Identifica el proyecto de manera única.

**¿Qué contiene el nuestro?** Nombre del proyecto (UniScheduler), fechas de inicio y fin, presupuesto ejecutado, y nombres del equipo. Esto permite identificar el proyecto en el portafolio de la organización.

### 2.9.2 Dueño del Proyecto y Gerente de Proyecto

**¿Qué es y por qué es importante?** La consigna exige explícitamente que aparezcan el Dueño del Proyecto (quien recibe) y el Gerente de Proyecto (quien entrega), con nombres y firmas.

**¿Qué contiene el nuestro?** Sección con:
- **Dueño del Proyecto:** Nombre, cargo y espacio para firma
- **Gerente de Proyecto:** Nombre, cargo y espacio para firma
- **Fecha de cierre**

### 2.9.3 Checklist de entregables

**¿Qué es y por qué es importante?** Lista de verificación de todo lo que se entrega. El evaluador quiere ver que ningún entregable quedó pendiente.

**¿Qué contiene el nuestro?** Tabla con cada entregable, su estado (Entregado/Pendiente) y observaciones. Todos los entregables están marcados como Entregado.

### 2.9.4 Liberación de recursos y aceptación formal

**¿Qué es y por qué es importante?** Formaliza que el equipo se disuelve y que el cliente acepta el producto.

**¿Qué contiene el nuestro?** Declaración de que los recursos del equipo se liberan y que el proyecto se da por cerrado con la aceptación del Dueño del Proyecto.

---

## 2.10 Declaración de Trabajo (SOW)

**Archivo:** `docs/cierre/declaracion_trabajo_sow.md`

**¿Qué es?** Valida el cumplimiento del alcance comprometido. Compara lo que se dijo que se iba a hacer con lo que efectivamente se hizo.

### 2.10.1 Matriz entregable planificado vs. entregado

**¿Qué es y por qué es importante?** El evaluador quiere una comparación directa, idealmente en forma de matriz, con enlaces que permitan verificar cada entregable.

**¿Qué contiene el nuestro?** Una tabla que lista cada entregable planificado (según el Project Charter y los requerimientos), su descripción, el archivo o funcionalidad donde se implementó (con enlace directo al repositorio), y el % de cumplimiento.

**Ejemplos de la matriz:**
| Entregable planificado | Descripción | Implementación | % |
|---|---|---|---|
| Módulo de autenticación | Registro, login, roles | `backend/controllers/auth.controller.js` + 10 tests | 100% |
| CRUD de cursos | Crear, listar, actualizar, eliminar cursos | `backend/controllers/course.controller.js` + 12 tests | 100% |
| Motor CSP | Generación de horarios con backtracking + MRV | `backend/engine/csp.js` + tests en `backend/tests/csp.test.js` | 100% |

### 2.10.2 % de cumplimiento

**¿Qué contiene el nuestro?** 100% de los entregables planificados fueron completados y entregados. Esto se evidencia en la columna "% Cumplimiento" de la matriz, donde todos los valores son 100%.

---

## 2.11 Guía de Capacitación

**Archivo:** `docs/cierre/guia_capacitacion.md`

**¿Qué es?** Documentación para transferencia de conocimiento al cliente. Debe permitir que el cliente opere el sistema sin asistencia del equipo de desarrollo.

### 2.11.1 Guía de instalación

**¿Qué es y por qué es importante?** El evaluador quiere ver que el sistema se puede poner en funcionamiento siguiendo pasos claros.

**¿Qué contiene el nuestro?** Pasos detallados:
1. Requisitos del sistema (Node.js 18+, Docker, MongoDB)
2. Clonar repositorio
3. Configurar variables de entorno (`backend/.env` con base en `backend/.env.example`)
4. Ejecutar con Docker: `docker-compose up -d` (archivo `docker-compose.yml` en la raíz)
5. Poblar base de datos: `npm run seed`
6. Verificar instalación accediendo a `http://localhost:5173`

### 2.11.2 Operación por rol

**¿Qué es y por qué es importante?** Diferentes usuarios usan el sistema de diferentes maneras. La guía debe cubrir los 4 roles.

**¿Qué contiene el nuestro?** 3 secciones (Coordinador, Docente, Estudiante) con pasos específicos:
- **Coordinador:** Gestión de carreras, cursos, aulas, docentes; generación de horarios; reportes.
- **Docente:** Consulta de horarios asignados, registro de preferencias y disponibilidad.
- **Estudiante:** Matrícula en cursos, consulta de horario personalizado.

### 2.11.3 Casos de uso típicos

**¿Qué es y por qué es importante?** Los pasos sueltos no son suficientes: el evaluador quiere ver escenarios completos.

**¿Qué contiene el nuestro?** Ejemplos paso a paso:
- **Caso 1:** "Generar horario para una carrera" — desde iniciar sesión como coordinador hasta obtener el horario generado
- **Caso 2:** "Matricular a un estudiante" — desde buscar al estudiante hasta confirmar la matrícula
- **Caso 3:** "Consultar disponibilidad de aulas" — desde seleccionar el día hasta ver los resultados

### 2.11.4 Troubleshooting

**¿Qué es y por qué es importante?** Los problemas van a ocurrir. La guía debe preparar al usuario para resolver los más comunes sin llamar al equipo de desarrollo.

**¿Qué contiene el nuestro?** 5 problemas con solución:
1. Error de conexión a MongoDB → Verificar que Docker esté corriendo y las credenciales en `backend/.env`
2. Puerto 3000 ocupado → Cambiar el puerto en `docker-compose.yml` (raíz del repositorio)
3. Error de autenticación al iniciar sesión → Verificar que el seed se ejecutó correctamente
4. Generación de horarios lenta → Verificar que no haya más de 100 cursos en la generación
5. Frontend no carga → Verificar que `npm install` se ejecutó y no hay errores en la consola

### 2.11.5 FAQ

**¿Qué es y por qué es importante?** Preguntas frecuentes que el usuario podría tener.

**¿Qué contiene el nuestro?** 5+ preguntas con respuesta:
- ¿Cómo recupero mi contraseña? → (procedimiento)
- ¿Puedo tener dos roles a la vez? → No, cada usuario tiene un rol único
- ¿Cómo respaldo la base de datos? → Usando `mongodump`
- ¿Puedo personalizar los horarios generados? → Sí, usando la sección "Mi Horario"
- ¿Cuántos cursos puedo matricular? → Depende de los créditos (máximo 25)

---

# BLOQUE 3: LOS 14 CRITERIOS DE LA RÚBRICA — DESGLOSE COMPLETO CON CÓDIGO

## Cómo leer esta sección

Cada criterio se explica en 4 partes:
1. **¿Qué evalúa?** — Qué mira el evaluador
2. **Texto exacto de la rúbrica para sobresaliente (3 pts)** — Para que sepas exactamente qué debes cumplir
3. **Explicación de cada subcriterio** — Desglose de lo que pidió la rúbrica, qué implementamos y cómo se evidencia, con fragmentos de código real
4. **Datos clave y ejemplos concretos para mencionar en la exposición**

---

## Criterio 1 — Informe Final del Proyecto

### ¿Qué evalúa este criterio?
Evalúa si el informe final del proyecto es completo, coherente y contiene la información necesaria para que el patrocinador entienda el desempeño del proyecto. No es solo "entregar un informe", sino que el informe demuestre control de gestión.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Documento integral, coherente y técnicamente sólido; incluye métricas cuantitativas, análisis comparativo plan vs. ejecución, trazabilidad total y conclusiones estratégicas con evidencia verificable."

### Explicación de cada subcriterio:

**1.1 Documento integral y coherente**
- **¿Qué pidió la rúbrica?** Que el informe cubra todas las áreas del proyecto (alcance, calidad, cronograma, costos, riesgos) sin contradicciones internas. Los números del cronograma deben coincidir con los del presupuesto, los incidentes mencionados deben estar en el registro, etc.
- **¿Qué hicimos?** Nos aseguramos de que todos los datos del informe sean consistentes con los demás documentos del proyecto. Por ejemplo: el tiempo de generación CSP (0.597s) aparece igual en el informe final, en el informe de lecciones, y en el acta de cierre. Los 393 tests se mencionan igual en todas partes. No hay discrepancias numéricas.
- **¿Dónde se evidencia?** En la consistencia de datos a lo largo de todo el informe y entre documentos.

**1.2 Métricas cuantitativas**
- **¿Qué pidió la rúbrica?** Números duros, no opiniones. "Buena calidad" no sirve; "94% de cobertura en módulos críticos" sí.
- **¿Qué hicimos?** Incluimos métricas verificables en cada sección: 393 tests (261+132), cobertura crítica 94%, SonarQube Rating A, 0 vulnerabilidades, CSP 0.597s, presupuesto S/6,210.40 sin desviación.
- **¿Dónde se evidencia?** En las tablas de métricas del informe.

**1.3 Análisis comparativo plan vs. ejecución**
- **¿Qué pidió la rúbrica?** No basta con dar los números actuales: hay que compararlos con lo planificado y explicar las diferencias.
- **¿Qué hicimos?** Tablas comparativas para alcance (18/19 completos), cronograma (Sprint por Sprint con duración planificada vs. real), y costos (planificado vs. ejecutado con variación 0%).
- **¿Dónde se evidencia?** En las secciones "Desempeño de Alcance", "Desempeño de Cronograma" y "Desempeño de Costos".

**1.4 Trazabilidad total**
- **¿Qué pidió la rúbrica?** Cada requerimiento debe poder rastrearse desde el informe hasta su implementación en el código.
- **¿Qué hicimos?** La tabla de requerimientos incluye enlaces directos a los archivos de implementación y a los tests que verifican cada requerimiento.
- **¿Dónde se evidencia?** En la tabla de la sección "Desempeño de Alcance".

**1.5 Conclusiones estratégicas con evidencia verificable**
- **¿Qué pidió la rúbrica?** Las conclusiones deben basarse en datos, no en percepciones. Deben incluir recomendaciones accionables.
- **¿Qué hicimos?** Conclusiones basadas en datos: "El motor CSP genera horarios en 0.597s, muy por debajo de la meta de 30s, demostrando que la implementación con backtracking + MRV + Forward Checking fue la decisión técnica correcta." Recomendamos implementar CI/CD desde el Sprint 1 en futuros proyectos.
- **¿Dónde se evidencia?** En la sección "Conclusiones y Recomendaciones".

### Datos clave para mencionar en la exposición:
- "Nuestro informe final cubre 7 áreas: resumen ejecutivo, alcance, calidad, cronograma, costos, riesgos y conclusiones."
- "Incluye 19 requerimientos con trazabilidad directa al código."
- "Todas las métricas son cuantitativas y verificables: 393 tests, 94% cobertura, 0.597s CSP."
- "Las conclusiones estratégicas están basadas en datos, no en opiniones."

---

## Criterio 2 — Lecciones Aprendidas

### ¿Qué evalúa este criterio?
Evalúa si el informe identifica buenas prácticas, errores, acciones correctivas y oportunidades de mejora de manera crítica y reflexiva. No es un "diario de lo que pasó", sino un análisis profundo con aprendizaje real.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Consolida lecciones aprendidas de manera crítica y reflexiva; propone mejoras aplicables y evidencia aprendizaje organizacional."

### Explicación de cada subcriterio:

**2.1 Síntesis de retrospectivas por Sprint**
- **¿Qué pidió la rúbrica?** Resumen de las retrospectivas de cada Sprint (Sprint 0 a 5), usando un formato estructurado.
- **¿Qué hicimos?** Documentamos 6 retrospectivas con el formato Start-Stop-Continue. Cada retrospectiva identifica acciones concretas: empezar a hacer (Conventional Commits, CI/CD), dejar de hacer (commits directos a main), continuar haciendo (daily standups, code review).
- **¿Dónde se evidencia?** En la sección "Retrospectivas por Sprint" del archivo `docs/cierre/lecciones_aprendidas.md`.

**2.2 Buenas prácticas identificadas**
- **¿Qué pidió la rúbrica?** Identificar qué salió bien y por qué, no solo listar cosas buenas.
- **¿Qué hicimos?** Identificamos 3 buenas prácticas con análisis de por qué funcionaron: Git Flow (organización), SonarQube (calidad consistente), CI/CD (cero regresiones).
- **¿Dónde se evidencia?** En la sección "Buenas Prácticas".

**2.3 Errores con causas raíz**
- **¿Qué pidió la rúbrica?** Usar técnica de análisis de causa raíz (ej: 5 porqués, diagrama de Ishikawa).
- **¿Qué hicimos?** Aplicamos 5 porqués al error principal (subestimación de testing), identificando la causa raíz: no se evaluaron las habilidades reales del equipo al inicio.
- **¿Dónde se evidencia?** En la sección "Errores y Causas Raíz".

**2.4 Acciones correctivas aplicadas**
- **¿Qué pidió la rúbrica?** Documentar las correcciones y demostrar que fueron efectivas.
- **¿Qué hicimos?** Documentamos: pipeline CI/CD, tests agregados, ESLint/Prettier. Resultado: cero regresiones después de implementarlas.
- **¿Dónde se evidencia?** En la sección "Acciones Correctivas".

**2.5 Oportunidades de mejora**
- **¿Qué pidió la rúbrica?** Recomendaciones concretas y aplicables, no genéricas como "mejorar la comunicación".
- **¿Qué hicimos?** Recomendaciones específicas: "Definir estándares de calidad desde el Sprint 0", "Incluir capacitación en testing al inicio del proyecto".
- **¿Dónde se evidencia?** En la sección "Oportunidades de Mejora".

**2.6 Aprendizaje organizacional**
- **¿Qué pidió la rúbrica?** Recomendaciones transferibles a otros proyectos de la organización.
- **¿Qué hicimos?** Documentamos que la calidad debe medirse desde el inicio, el CI/CD debe implementarse en el Sprint 1, y las retrospectivas deben ser estructuradas.
- **¿Dónde se evidencia?** En la sección "Aprendizaje Organizacional".

### Datos clave para mencionar en la exposición:
- "Usamos 5 porqués para identificar la causa raíz de la subestimación de testing."
- "Formato Start-Stop-Continue en las 6 retrospectivas."
- "Después de las acciones correctivas, las regresiones se redujeron a cero."
- "Las recomendaciones son transferibles a cualquier proyecto de software."

---

## Criterio 3 — Registro de Riesgos

### ¿Qué evalúa este criterio?
Evalúa si el registro de riesgos está completo, actualizado y evidencia gestión efectiva de riesgos. No es "una lista que hicimos al inicio y nunca más miramos".

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Registro completo y actualizado; riesgos priorizados mediante criterios claros; respuestas efectivas y trazabilidad verificable."

### Explicación de cada subcriterio:

**3.1 Registro completo y actualizado**
- **¿Qué pidió la rúbrica?** El registro debe tener todos los riesgos identificados y debe estar actualizado al cierre del proyecto.
- **¿Qué hicimos?** 10+ riesgos documentados, cada uno con ID único (R-01, R-02, etc.), y todos actualizados con estado al cierre (cerrado, materializado o mitigado).
- **¿Dónde se evidencia?** En `docs/planificacion/Registro_de_riesgos/Registro_de_Riesgos.md`.

**3.2 Riesgos priorizados**
- **¿Qué pidió la rúbrica?** Criterios claros de priorización, no solo ordenar al azar.
- **¿Qué hicimos?** Priorización = probabilidad × impacto. Cada riesgo tiene nivel (Alto/Medio/Bajo) en ambas dimensiones, y la prioridad se calcula multiplicando los valores.
- **¿Dónde se evidencia?** En las columnas de probabilidad, impacto y prioridad del registro.

**3.3 Respuestas efectivas**
- **¿Qué pidió la rúbrica?** Cada riesgo debe tener una estrategia de respuesta definida y aplicada.
- **¿Qué hicimos?** Definimos estrategias: mitigar (capacitación CSP), aceptar (cambios en requisitos), transferir (seguridad a cloud), evitar (rediseño de alcance).
- **¿Dónde se evidencia?** En la columna "Estrategia de Respuesta".

**3.4 Trazabilidad verificable**
- **¿Qué pidió la rúbrica?** Relación con otros documentos del proyecto.
- **¿Qué hicimos?** Columna de lección aprendida por riesgo, conectando con el informe de lecciones aprendidas. Los impedimentos en el registro de impedimentos están mapeados a los riesgos.
- **¿Dónde se evidencia?** En la columna "Lección Aprendida" y en los enlaces entre registros.

### Datos clave para mencionar en la exposición:
- "Identificamos 10+ riesgos específicos del proyecto, no genéricos."
- "Cada riesgo tiene probabilidad e impacto con priorización calculada."
- "Al cierre, cada riesgo tiene estado final: cerrado, materializado o mitigado."
- "Los impedimentos están mapeados a los riesgos que se materializaron."

---

## Criterio 4 — Registro de Incidentes

### ¿Qué evalúa este criterio?
Evalúa si el registro de incidentes documenta problemas reales y su resolución.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Registro estructurado, actualizado y alineado con el seguimiento real del proyecto; evidencia resolución y control efectivo."

### Explicación de cada subcriterio:

**4.1 Incidencias reales documentadas**
- **¿Qué pidió la rúbrica?** Problemas que realmente ocurrieron, no inventados ni genéricos.
- **¿Qué hicimos?** 10 incidentes reales con fecha, descripción específica y contexto. Por ejemplo: INC-003 — bug en ScheduleGrid que mostraba 11 franjas en lugar de las 15 que exige el RF-05.
- **¿Dónde se evidencia?** En `docs/seguimiento_control/registro_incidentes.md`.

**4.2 Responsables asignados**
- **¿Qué pidió la rúbrica?** Cada incidente debe tener un responsable claro.
- **¿Qué hicimos?** Columna de responsable por incidente, asignado según módulo afectado.
- **¿Dónde se evidencia?** En la columna "Responsable" del registro.

**4.3 Estado y prioridad**
- **¿Qué pidió la rúbrica?** Estado actual y nivel de prioridad.
- **¿Qué hicimos?** Prioridad (Alta/Media/Baja) y estado (Abierto/En Proceso/Resuelto) por incidente.
- **¿Dónde se evidencia?** En las columnas "Estado" y "Prioridad".

**4.4 Acción correctiva y evidencia de cierre**
- **¿Qué pidió la rúbrica?** Solución aplicada y cómo se verificó.
- **¿Qué hicimos?** Cada incidente tiene su acción correctiva descrita y un enlace al commit o PR de fix.
- **¿Dónde se evidencia?** En las columnas "Acción Correctiva" y "Evidencia de Cierre".

### Ejemplo concreto para la exposición:
"El incidente INC-003 fue un bug en el ScheduleGrid que mostraba solo 11 franjas horarias en lugar de las 15 requeridas por el RF-05. Tuvo prioridad Alta. La acción correctiva fue agregar las 4 franjas faltantes (18:00, 19:00, 20:00, 21:00) en `frontend/src/components/schedule/ScheduleGrid.jsx`. La evidencia de cierre es el commit de corrección y los tests que validan las 15 franjas."

---

## Criterio 5 — Registro de Impedimentos

### ¿Qué evalúa este criterio?
Evalúa si el registro identifica obstáculos que afectaron el avance y documenta su resolución.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Identifica impedimentos críticos con análisis de impacto y resolución efectiva; demuestra gestión activa del equipo."

### Explicación de cada subcriterio:

**5.1 Impedimentos identificados**
- **¿Qué pidió la rúbrica?** Obstáculos reales que frenaron el progreso, no excusas.
- **¿Qué hicimos?** 7 impedimentos documentados. El más crítico: IMP-001 (falta de experiencia CSP, retraso de 3 días).
- **¿Dónde se evidencia?** En `docs/seguimiento_control/registro_impedimentos.md`.

**5.2 Análisis de impacto**
- **¿Qué pidió la rúbrica?** Impacto medible en cronograma y/o costo.
- **¿Qué hicimos?** IMP-001: +3 días en cronograma, sin costo adicional. IMP-002: +2 días.
- **¿Dónde se evidencia?** En las columnas de impacto del registro.

**5.3 Mapeo a riesgos**
- **¿Qué pidió la rúbrica?** Relación con el Risk Register.
- **¿Qué hicimos?** IMP-001 → R-03, IMP-002 → R-05. Esto demuestra que los riesgos identificados se materializaron y se gestionaron.
- **¿Dónde se evidencia?** En la columna "Riesgo Asociado".

**5.4 Gestión activa y resolución**
- **¿Qué pidió la rúbrica?** Evidencia de que el equipo gestionó activamente los impedimentos.
- **¿Qué hicimos?** Mitigaciones específicas (capacitación, datos sintéticos) y referencia a las daily standups donde se reportaron.
- **¿Dónde se evidencia?** En la columna "Acción de Mitigación" y referencias a reuniones.

### Datos clave para la exposición:
- "7 impedimentos documentados, el más significativo fue la falta de experiencia CSP (3 días de retraso)."
- "Cada impedimento mapeado a un riesgo del Risk Register."
- "Mitigación: capacitación interna de 2 días resolvió el impedimento CSP."

---

## Criterio 6 — Registro de Defectos

### ¿Qué evalúa este criterio?
Evalúa si el registro documenta defectos técnicos, su severidad, corrección y validación.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Registro completo con clasificación técnica, trazabilidad y evidencia de corrección validada."

### Explicación de cada subcriterio:

**6.1 Clasificación técnica**
- **¿Qué pidió la rúbrica?** Clasificación por severidad y por módulo.
- **¿Qué hicimos?** 15 defectos clasificados: 3 Críticos, 7 Mayores, 5 Menores; 5 Frontend, 8 Backend, 2 BD.
- **¿Dónde se evidencia?** En las columnas "Severidad" y "Módulo" del registro.

**6.2 Trazabilidad de corrección**
- **¿Qué pidió la rúbrica?** Cada defecto debe tener su fix registrado con trazabilidad.
- **¿Qué hicimos?** Cada defecto tiene enlace al commit o PR donde se corrigió.
- **¿Dónde se evidencia?** En la columna "Commit/PR de Fix".

**6.3 Corrección validada**
- **¿Qué pidió la rúbrica?** El fix debe estar validado por un test, no solo "se corrigió".
- **¿Qué hicimos?** Cada defecto tiene el nombre del archivo de test que valida la corrección. Ej: DEF-002 validado con `frontend/src/tests/components/ScheduleGrid.test.jsx`.
- **¿Dónde se evidencia?** En la columna "Test de Validación".

### Ejemplo concreto para la exposición:
"El defecto DEF-002, de severidad Crítica en Frontend, era que ScheduleGrid mostraba 11 franjas en lugar de 15. Se corrigió agregando las franjas faltantes y se validó con `frontend/src/tests/components/ScheduleGrid.test.jsx`, que verifica exactamente 15 franjas de 07:00 a 22:00."

---

## Criterio 7 — Registro de Supuestos

### ¿Qué evalúa este criterio?
Evalúa si el registro de supuestos está actualizado y analiza el impacto de los supuestos en el proyecto.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Registro detallado y actualizado; analiza impacto de los supuestos y su relación con decisiones del proyecto."

### Explicación de cada subcriterio:

**7.1 Supuestos detallados y actualizados**
- **¿Qué pidió la rúbrica?** Lista completa de supuestos, cada uno con estado actualizado al cierre.
- **¿Qué hicimos?** 5 supuestos definidos en Sprint 0, todos con estado final: válido, invalidado o parcialmente cumplido.
- **¿Dónde se evidencia?** En `docs/inicio/Supuestos-y-Restricciones.md`.

**7.2 Análisis de impacto**
- **¿Qué pidió la rúbrica?** Evaluar las consecuencias de los supuestos que resultaron falsos.
- **¿Qué hicimos?** Para SUP-01 (datos reales parciales): el impacto fue generar datos sintéticos, incrementando el esfuerzo de pruebas pero sin afectar la calidad.
- **¿Dónde se evidencia?** En la columna "Impacto y Decisión" del registro.

**7.3 Relación con decisiones del proyecto**
- **¿Qué pidió la rúbrica?** Vínculo entre supuestos y decisiones de diseño.
- **¿Qué hicimos?** Referenciamos las decisiones afectadas por cada supuesto. Por ejemplo, la decisión de generar datos sintéticos está vinculada al supuesto SUP-01.
- **¿Dónde se evidencia?** En las referencias a documentación técnica.

### Datos clave para la exposición:
- "5 supuestos, todos actualizados al cierre."
- "SUP-01 (datos reales) fue parcialmente cumplido, lo que nos obligó a generar datos sintéticos."
- "Cada supuesto tiene análisis de impacto y relación con decisiones."

---

## Criterio 8 — Project Charter (Acta de Constitución)

### ¿Qué evalúa este criterio?
Evalúa si el Project Charter fue revisado al final para verificar cumplimiento de objetivos.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Verifica integralmente cumplimiento de objetivos, criterios de éxito y alineación con resultados finales."

### Explicación de cada subcriterio:

**8.1 Verificación de objetivos**
- **¿Qué pidió la rúbrica?** Comparación directa: cada objetivo del charter vs. resultado real.
- **¿Qué hicimos?** Tabla con cada objetivo, su descripción original, el resultado real y la evidencia de cumplimiento. Ej: "Generar horarios <30s" → 0.597s.
- **¿Dónde se evidencia?** En la sección "Verificación de Objetivos" del Project Charter.

**8.2 Criterios de éxito**
- **¿Qué pidió la rúbrica?** Checklist de criterios de éxito con evidencia.
- **¿Qué hicimos?** Checklist con cada criterio y su evidencia: cobertura crítica 94%, 0 vulnerabilidades, presupuesto sin desviación.
- **¿Dónde se evidencia?** En la sección "Criterios de Éxito".

**8.3 Alineación con resultados finales**
- **¿Qué pidió la rúbrica?** Coherencia entre lo planeado y lo ejecutado.
- **¿Qué hicimos?** Actualizamos In-Scope/Out-of-Scope: RF-08 a RF-12 pasaron a In-Scope porque están implementados en el código.
- **¿Dónde se evidencia?** En la sección "In-Scope/Out-of-Scope" actualizada.

### Datos clave para la exposición:
- "Tabla comparativa de objetivos vs. resultados con evidencia verificable."
- "Checklist de criterios de éxito: 94% cobertura, 0 vulnerabilidades, S/6,210.40 sin desviación."
- "In-Scope actualizado para reflejar RF-08 a RF-12."

---

## Criterio 9 — Declaración de Trabajo (SOW)

### ¿Qué evalúa este criterio?
Evalúa si el SOW valida el cumplimiento del alcance comprometido.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Evidencia validación formal del alcance y cumplimiento total del trabajo comprometido."

### Explicación de cada subcriterio:

**9.1 Validación formal del alcance**
- **¿Qué pidió la rúbrica?** Comparación estructurada entre entregables planificados y entregados.
- **¿Qué hicimos?** Matriz con cada entregable planificado, su descripción, y el enlace directo al archivo o funcionalidad implementada. Ej: "Módulo de autenticación" → `backend/controllers/auth.controller.js` con 10 tests.
- **¿Dónde se evidencia?** En `docs/cierre/declaracion_trabajo_sow.md`.

**9.2 Cumplimiento total**
- **¿Qué pidió la rúbrica?** Porcentaje de cumplimiento.
- **¿Qué hicimos?** 100% de los entregables planificados completados y entregados.
- **¿Dónde se evidencia?** En la columna "% Cumplimiento" de la matriz.

### Datos clave para la exposición:
- "Matriz entregable vs. entregado con enlaces directos al repositorio."
- "100% de cumplimiento en todos los entregables."

---

## Criterio 10 — Documentación de Capacitación

### ¿Qué evalúa este criterio?
Evalúa si la documentación permite transferir el conocimiento al cliente.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Documentación clara, usable y completa; facilita transferencia operativa y mantenimiento del producto."

### Explicación de cada subcriterio:

**10.1 Guía de instalación**
- **¿Qué pidió la rúbrica?** Instrucciones claras para poner el sistema en funcionamiento.
- **¿Qué hicimos?** Pasos detallados con Docker: requisitos, clonar, configurar `backend/.env`, ejecutar `docker-compose up -d` (archivo `docker-compose.yml` en raíz), seed, verificar.
- **¿Dónde se evidencia?** En la sección "Instalación" de `docs/cierre/guia_capacitacion.md`.

**10.2 Operación por rol**
- **¿Qué pidió la rúbrica?** Instrucciones para cada perfil de usuario.
- **¿Qué hicimos?** 3 secciones: Coordinador (gestión, generación), Docente (horarios, preferencias), Estudiante (matrícula, horario personalizado).
- **¿Dónde se evidencia?** En la sección "Operación por Rol".

**10.3 Casos de uso y troubleshooting**
- **¿Qué pidió la rúbrica?** Escenarios completos y solución de problemas.
- **¿Qué hicimos?** 3 casos de uso paso a paso y 5 problemas con solución.
- **¿Dónde se evidencia?** En las secciones "Casos de Uso" y "Troubleshooting".

**10.4 FAQ**
- **¿Qué pidió la rúbrica?** Preguntas frecuentes.
- **¿Qué hicimos?** 5+ preguntas sobre roles, respaldo, personalización, etc.
- **¿Dónde se evidencia?** En la sección "FAQ".

### Datos clave para la exposición:
- "Guía que permite al cliente operar sin asistencia del equipo de desarrollo."
- "3 roles cubiertos, 3 casos de uso, 5 problemas de troubleshooting, 5+ FAQ."
- "Instalación con Docker en 6 pasos."

---

## Criterio 11 — Uso de Markdown y Organización en Repositorio

### ¿Qué evalúa este criterio?
Evalúa la estructura del repositorio, el formato de los documentos y el versionamiento.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Todos los documentos en Markdown correctamente estructurado; repositorio ordenado, versionado y con historial consistente."

### Explicación de cada subcriterio:

**11.1 Formato Markdown**
- **¿Qué pidió la rúbrica?** Documentos en .md con formato correcto.
- **¿Qué hicimos?** 100% en Markdown con tablas, listas, bloques de código, enlaces internos/externos, y formato consistente de títulos (## y ###).
- **¿Dónde se evidencia?** En todos los archivos .md del repositorio.

**11.2 Estructura de carpetas**
- **¿Qué pidió la rúbrica?** Organización coherente.
- **¿Qué hicimos?** `docs/inicio/`, `docs/planificacion/`, `docs/ejecucion/`, `docs/seguimiento_control/`, `docs/cierre/`.
- **¿Dónde se evidencia?** En la estructura de directorios.

**11.3 Nombres de archivo consistentes**
- **¿Qué pidió la rúbrica?** Nombres descriptivos y consistentes.
- **¿Qué hicimos?** `docs/seguimiento_control/registro_incidentes.md`, `docs/seguimiento_control/registro_impedimentos.md`, `docs/cierre/informe_final_proyecto.md`, etc.
- **¿Dónde se evidencia?** En los nombres de archivo.

**11.4 Versionamiento**
- **¿Qué pidió la rúbrica?** Commits semánticos y ramas Git Flow.
- **¿Qué hicimos?** Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`), ramas `main`/`develop`/`feature/*`.
- **¿Dónde se evidencia?** En `git log --oneline` y la estructura de ramas.

### Datos clave para la exposición:
- "100% de documentos en Markdown con formato consistente."
- "5 carpetas organizadas temáticamente en docs/."
- "Commits semánticos (Conventional Commits) y Git Flow."

---

## Criterio 12 — Coherencia y Trazabilidad Documental

### ¿Qué evalúa este criterio?
Evalúa la relación consistente entre los diferentes documentos del proyecto.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Existe trazabilidad completa entre documentos, entregables y evidencias; alta coherencia técnica y administrativa."

### Explicación de cada subcriterio:

**12.1 IDs consistentes**
- **¿Qué pidió la rúbrica?** Mismos identificadores en todos los documentos.
- **¿Qué hicimos?** RF-01 a RF-12, RNF-01 a RNF-07, RD-01 a RD-14, INC-001, IMP-001, DEF-001 aparecen consistentemente en `docs/inicio/Requerimientos.md`, informe final, registros de control, etc.
- **¿Dónde se evidencia?** En todos los documentos del proyecto.

**12.2 Enlaces cruzados**
- **¿Qué pidió la rúbrica?** Referencias entre documentos relacionados.
- **¿Qué hicimos?** El informe final referencia los registros de incidentes, impedimentos y defectos. El Risk Register referencia las lecciones aprendidas.
- **¿Dónde se evidencia?** En los enlaces internos entre documentos.

**12.3 Trazabilidad completa**
- **¿Qué pidió la rúbrica?** Poder rastrear un elemento desde su definición hasta su implementación.
- **¿Qué hicimos?** Ejemplo: RF-05 (horarios personalizados) se rastrea: `docs/inicio/Requerimientos.md` → implementación en `backend/controllers/student-schedule.controller.js` (líneas 526-543, algoritmo Kuhn) → tests → costo en Sprint 4 → riesgo R-03 → defecto DEF-002 → lección aprendida Sprint 4.
- **¿Dónde se evidencia?** En las referencias cruzadas entre todos los documentos.

**12.4 Glosario común**
- **¿Qué pidió la rúbrica?** Terminología consistente.
- **¿Qué hicimos?** Términos como "Franja horaria", "Matching bipartito", "CSP", "RF", "RNF", "RD" se usan consistentemente.
- **¿Dónde se evidencia?** En el glosario incluido en la documentación.

### Datos clave para la exposición:
- "IDs consistentes en los 11 entregables."
- "Trazabilidad completa: RF-05 → código → tests → costo → riesgo → defecto → lección."
- "Glosario común con terminología consistente."

---

## Criterio 13 — Aplicación de Prácticas PMBOK y Control de Configuración

### ¿Qué evalúa este criterio?
Evalúa si se evidencia control documental, mantenimiento y gestión de cambios.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Aplica rigurosamente buenas prácticas PMBOK; control de versiones, cambios y configuración claramente evidenciados."

### Explicación de cada subcriterio:

**13.1 Control de versiones**
- **¿Qué pidió la rúbrica?** Uso de Git con historial verificable.
- **¿Qué hicimos?** Todo el proyecto versionado en Git con commits semánticos. Historial verificable con `git log --oneline`.
- **¿Dónde se evidencia?** En el historial de Git.

**13.2 Línea base de configuración**
- **¿Qué pidió la rúbrica?** Tags o versiones marcadas.
- **¿Qué hicimos?** Tag `v1.0.0` para el PMV al cierre del Sprint 5.
- **¿Dónde se evidencia?** En `git tag -l v1.0.0`.

**13.3 Changelog**
- **¿Qué pidió la rúbrica?** Registro de cambios por versión.
- **¿Qué hicimos?** `CHANGELOG.md` (raíz del repositorio) con formato estándar.
- **¿Dónde se evidencia?** En el archivo `CHANGELOG.md` del repositorio.

**13.4 CI/CD**
- **¿Qué pidió la rúbrica?** Automatización de pruebas y calidad.
- **¿Qué hicimos?** Pipeline en `.github/workflows/test.yml` con 4 jobs: backend-tests, frontend-tests, e2e-tests, quality-report.
- **¿Dónde se evidencia?** En el archivo `.github/workflows/test.yml`.

**13.5 Control de entorno y calidad de código**
- **¿Qué pidió la rúbrica?** Entornos reproducibles y estándares de codificación.
- **¿Qué hicimos?** `Dockerfile` (raíz) + `docker-compose.yml` (raíz), ESLint + Prettier.
- **¿Dónde se evidencia?** En los archivos `Dockerfile`, `docker-compose.yml`, `.eslintrc.json` (raíz + `backend/.eslintrc.json`), `.prettierrc` (raíz).

### Datos clave para la exposición:
- "Tag v1.0.0 marca la línea base de configuración."
- "Pipeline CI/CD con 4 jobs ejecuta 393 tests automáticamente."
- "Entornos reproducibles con Docker en 3 servicios (MongoDB, backend, frontend)."
- "ESLint + Prettier garantizan calidad de código consistente."

---

## Criterio 14 — Calidad Técnica y Redacción Profesional

### ¿Qué evalúa este criterio?
Evalúa la claridad, ortografía, consistencia terminológica y presentación formal.

### Texto exacto de la rúbrica para SOBRESALIENTE (3 pts):
> "Redacción profesional, técnica y libre de errores; excelente presentación y consistencia documental."

### Explicación de cada subcriterio:

**14.1 Ortografía y gramática**
- **¿Qué pidió la rúbrica?** Sin errores ortográficos ni gramaticales.
- **¿Qué hicimos?** Revisión con corrector ortográfico antes de versionar cada documento.
- **¿Dónde se evidencia?** En la calidad de redacción de todos los documentos.

**14.2 Lenguaje técnico**
- **¿Qué pidió la rúbrica?** Terminología precisa y consistente.
- **¿Qué hicimos?** Usamos términos técnicos de manera consistente: "CSP" (no "algoritmo genérico"), "Franja horaria" (no "slot"), "Matching bipartito" (no "algoritmo de asignación").
- **¿Dónde se evidencia?** En la consistencia terminológica entre documentos.

**14.3 Formato uniforme**
- **¿Qué pidió la rúbrica?** Mismos estilos en todos los documentos.
- **¿Qué hicimos?** Todos los documentos usan: títulos con ## y ###, tablas con formato uniforme, listas con guiones, bloques de código con ```.
- **¿Dónde se evidencia?** En la presentación visual consistente de todos los archivos .md.

**14.4 Consistencia terminológica**
- **¿Qué pidió la rúbrica?** Mismos términos en todos los documentos.
- **¿Qué hicimos?** Glosario común y verificación cruzada de términos en todos los documentos.
- **¿Dónde se evidencia?** En el glosario y en la redacción consistente.

### Datos clave para la exposición:
- "Todos los documentos revisados ortográficamente."
- "Lenguaje técnico consistente: CSP, Franja horaria, Matching bipartito."
- "Formato uniforme en los 11 entregables."

---

# BLOQUE 4: GUÍA PRÁCTICA PARA SOBRESALIENTE

---

## Resumen: qué hacer para obtener 3 puntos en cada criterio

| Criterio | ¿Qué hace falta para 3 pts? | ¿Cómo lo logramos nosotros? |
|----------|----------------------------|----------------------------|
| 1. Informe Final | Tablas comparativas plan vs. ejecución con datos numéricos reales, trazabilidad a código, conclusiones estratégicas | 18/19 requerimientos con enlaces, 393 tests, CSP 0.597s, S/6,210.40 sin desviación |
| 2. Lecciones Aprendidas | Retrospectiva estructurada, 5 porqués, mejoras aplicables, aprendizaje organizacional | Start-Stop-Continue, 5 porqués para causa raíz de testing, CI/CD como acción correctiva |
| 3. Registro de Riesgos | Priorización clara, respuestas efectivas, trazabilidad, estado al cierre | Probabilidad×Impacto, mitigación/aceptar/transferir/evitar, columna de lección aprendida |
| 4. Registro de Incidentes | Problemas reales, responsables, prioridad, acción correctiva, evidencia de cierre | 10 incidentes con enlaces a commits de fix, INC-003: bug ScheduleGrid → fix + test |
| 5. Registro de Impedimentos | Impacto medible, mapeo a riesgos, gestión activa | +3 días CSP, +2 datos, IMP-001 → R-03, mitigación con capacitación |
| 6. Registro de Defectos | Clasificación severidad+módulo, fix con trazabilidad, validación con test | 3 críticos/7 mayores/5 menores, 5 frontend/8 backend/2 BD, cada uno con test de validación |
| 7. Registro de Supuestos | Estado actualizado, impacto analizado, relación con decisiones | 5 supuestos, SUP-01 parcial → datos sintéticos, impacto documentado |
| 8. Project Charter | Comparación objetivo vs. resultado, criterios de éxito, alineación | Tabla de verificación, checklist con evidencia, In-Scope actualizado |
| 9. SOW | Matriz entregable vs. entregado, % cumplimiento, enlaces | 100% cumplimiento, matriz con enlaces directos al repositorio |
| 10. Capacitación | Guía de instalación, operación por rol, casos de uso, troubleshooting, FAQ | Docker, 3 roles, 3 casos de uso, 5 troubleshooting, 5+ FAQ |
| 11. Markdown | Documentos .md, estructura de carpetas, nombres consistentes, versionamiento | 5 carpetas en docs/, Conventional Commits, Git Flow |
| 12. Trazabilidad | IDs consistentes, enlaces cruzados, trazabilidad completa, glosario | IDs RF/RNF/RD/INC/IMP/DEF, RF-05 trazable desde req hasta código y defecto |
| 13. PMBOK | Control de versiones, tags, changelog, CI/CD, Docker, ESLint | v1.0.0, CHANGELOG, pipeline 4 jobs, Docker compose, ESLint+Prettier |
| 14. Redacción | Ortografía, lenguaje técnico, formato uniforme, consistencia | Corrección ortográfica, CSP/Franja/Matching, formato homogéneo |

---

## Las 5 evidencias más impactantes para mostrar en la exposición

| # | Evidencia | Criterio que refuerza | Cómo mostrarla |
|---|-----------|----------------------|----------------|
| 1 | `git log --oneline` con commits semánticos | 11 (Markdown), 13 (PMBOK) | Abrir terminal y mostrar commits con formato `feat:`, `fix:`, `docs:`, `test:` |
| 2 | Tabla de trazabilidad RF-05 → código → tests | 12 (Trazabilidad) | Mostrar `docs/inicio/Requerimientos.md` → `backend/controllers/student-schedule.controller.js`:526-543 → test → DEF-002 |
| 3 | Pipeline CI/CD con 4 jobs | 13 (PMBOK) | Mostrar `.github/workflows/test.yml` y los checks pasando |
| 4 | Registro de defectos con fix + test | 6 (Defectos) | Mostrar DEF-002: bug, commit de fix, `frontend/src/tests/components/ScheduleGrid.test.jsx` validando 15 franjas |
| 5 | Métricas de cobertura y SonarQube | 1 (Informe Final), 14 (Calidad) | Mostrar tabla con 393 tests, 94% cobertura crítica, Rating A |

---

## Cómo responder preguntas difíciles del evaluador

**P: "¿Por qué solo 94.7% de requerimientos completos?"**
**R:** "Tenemos 18 de 19 requerimientos completos. El único parcial es RNF-04 (cobertura de código). La cobertura global del frontend está en 14.47% porque los tests se centran en componentes específicos. Sin embargo, la cobertura crítica del backend está en ~94%, y el Quality Gate de SonarQube aprobó con Rating A. Para mejorar esto, recomendamos en las lecciones aprendidas definir estándares de cobertura desde el Sprint 0."

**P: "¿Por qué el historial de commits está desbalanceado?"**
**R:** "El 94% de los commits fueron realizados por un miembro del equipo debido a que asumió el rol de integrador de código y documentación. Los demás miembros contribuyeron en ramas feature/* y en las daily standups. Sabemos que esto es una debilidad y lo documentamos en las lecciones aprendidas: recomendamos rotar el rol de integrador en cada Sprint para futuros proyectos."

**P: "¿Dónde están las actas de las daily standups?"**
**R:** "No registramos actas formales de las daily standups durante el proyecto. Este es un área de mejora que documentamos en las lecciones aprendidas. Para la fase de cierre, registramos los impedimentos y su seguimiento en el registro de impedimentos, que incluye referencias a las daily donde se reportaron."

**P: "¿Cómo verifico que el motor CSP realmente funciona?"**
**R:** "Puede verificar de 3 maneras: (1) los tests en `backend/tests/csp.test.js` validan que el solver genera soluciones válidas respetando todas las restricciones; (2) el informe final documenta un tiempo de generación de 0.597 segundos para 50 cursos y 100 estudiantes; (3) los tests de integración en `backend/tests/integration/api.test.js` prueban el endpoint de generación end-to-end."

**P: "¿Dónde está el video de capacitación?"**
**R:** "El video demostrativo no está incluido en el repositorio. La guía de capacitación en `docs/cierre/guia_capacitacion.md` cubre la operación del sistema por rol con casos de uso paso a paso y troubleshooting. Para la exposición, podemos mostrar una demo en vivo del sistema."

---

# BLOQUE 5: CRITERIOS DE ÉXITO, MÉTRICAS Y CIERRE

---

## Los 10 criterios de éxito de la fase de cierre

La consigna define 10 condiciones que deben cumplirse para que la fase sea exitosa. Verificamos cada una:

| # | Criterio | ¿Cómo lo verificamos? | ¿Lo cumplimos? |
|---|----------|----------------------|----------------|
| 1 | Todos los documentos obligatorios existen en Markdown | Revisión de estructura de archivos | Sí, 11 documentos en sus carpetas |
| 2 | Informe final incluye métricas cuantitativas verificables | Lectura del documento | Sí: 393 tests, 94% cobertura, SonarQube A |
| 3 | Trazabilidad cruzada entre documentos | Verificación manual de referencias | Sí: IDs consistentes y enlaces cruzados |
| 4 | Registro de riesgos actualizado con estado final | Comparación con versión inicial | Sí: cerrado/materializado/mitigado |
| 5 | Lecciones aprendidas críticas y reflexivas | Evaluación de profundidad analítica | Sí: 5 porqués, Start-Stop-Continue |
| 6 | Redacción profesional sin errores ortográficos | Revisión de calidad | Sí: corrección automatizada aplicada |
| 7 | Repositorio con historial de commits semánticos | `git log --oneline` | Sí: Conventional Commits |
| 8 | Coherencia entre planificado y realizado | Matriz de trazabilidad | Sí: SOW con matriz entregable vs. entregado |
| 9 | Capacitación permite operar sin asistencia | Prueba de lectura | Sí: guía paso a paso con troubleshooting |
| 10 | Evidencia de prácticas PMBOK | CHANGELOG, control de cambios | Sí: changelog, CI/CD, tag v1.0.0 |

---

## Métricas finales del proyecto

| Métrica | Valor |
|---------|-------|
| Requerimientos cumplidos | 18/19 (18 completos, 1 parcial) |
| Pruebas backend | 261 tests, 21 suites |
| Pruebas frontend | 132 tests, 18 suites |
| **Total pruebas automatizadas** | **393 tests** |
| Cobertura crítica backend | ~94% |
| SonarQube Quality Gate | Rating A, 0 vulnerabilidades |
| Tiempo de generación CSP | **0.597 segundos** (meta: <30s) |
| Presupuesto ejecutado | S/6,210.40 sin desviación |
| Commits | Semánticos (Conventional Commits) |
| Tag de versión | v1.0.0 |
| Documentos entregados | 11/11 (100%) |

---

## Puntaje objetivo: 42/42

| Criterio | Puntaje máximo | Nuestro objetivo |
|----------|---------------|------------------|
| 1. Informe Final del Proyecto | 3 | 3 |
| 2. Informe de Lecciones Aprendidas | 3 | 3 |
| 3. Registro de Riesgos | 3 | 3 |
| 4. Registro de Incidentes | 3 | 3 |
| 5. Registro de Impedimentos | 3 | 3 |
| 6. Registro de Defectos | 3 | 3 |
| 7. Registro de Supuestos | 3 | 3 |
| 8. Acta de Constitución del Proyecto | 3 | 3 |
| 9. Declaración de Trabajo (SOW) | 3 | 3 |
| 10. Documentación de Capacitación | 3 | 3 |
| 11. Uso de Markdown y organización | 3 | 3 |
| 12. Coherencia y trazabilidad documental | 3 | 3 |
| 13. Prácticas PMBOK y control de configuración | 3 | 3 |
| 14. Calidad técnica y redacción profesional | 3 | 3 |
| **Total** | **42** | **42** |

> *"Nuestro objetivo es alcanzar 42 de 42 puntos posibles, logrando el nivel Sobresaliente en todos los criterios de la rúbrica."*
