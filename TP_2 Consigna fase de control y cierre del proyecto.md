**Taller de Proyectos 2 – Ingeniería de Sistemas e Informática**
**Universidad Continental**

---

# CONSIGNA: FASE DE CONTROL Y CIERRE DEL PROYECTO

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Versión:** 1.0
**Fecha:** Julio 2026

---

## 1. Contexto del proyecto

Como parte del proceso de gestión y dirección del proyecto, corresponde ejecutar formalmente la fase de control y cierre, consolidando la documentación técnica, administrativa y de gestión generada durante el ciclo de vida del proyecto.

La fase de cierre tiene como propósito verificar la trazabilidad de los entregables, validar la consistencia documental, registrar incidencias y riesgos ocurridos durante el desarrollo, consolidar las lecciones aprendidas y asegurar que el proyecto disponga de evidencia verificable de control, mantenimiento y versionamiento.

La actividad deberá desarrollarse aplicando buenas prácticas de gestión de proyectos alineadas al enfoque PMBOK y principios de ingeniería de software orientados a calidad, trazabilidad y mantenibilidad.

---

## 2. Objetivo general

Elaborar, actualizar, consolidar y versionar la documentación asociada al control y cierre del Proyecto, garantizando coherencia entre los entregables técnicos, administrativos y de gestión, mediante el uso de mecanismos formales de documentación, control de configuración y trazabilidad del proyecto.

---

## 3. Entregables obligatorios

### 3.1. Informes de Cierre Principales

#### 3.1.1. Informe Final del Proyecto (Final Project Report)

Resumen del desempeño del proyecto que proporciona al patrocinador una visión general y sirve como registro histórico.

**Contenido mínimo requerido (nivel sobresaliente):**
- Resumen ejecutivo del proyecto (propósito, alcance, resultados clave)
- Desempeño de alcance: % de requerimientos cumplidos vs. planificados con trazabilidad a requisitos
- Desempeño de calidad: métricas de pruebas, cobertura, SonarQube, OWASP, WCAG, SUS
- Desempeño de cronograma: plan vs. ejecución por Sprint, hitos cumplidos
- Desempeño de costos: presupuesto planificado vs. ejecutado con análisis de variación
- Resumen de riesgos e incidentes: riesgos materializados, incidentes gestionados
- Conclusiones estratégicas con evidencia verificable
- Recomendaciones para proyectos futuros

**Archivo:** `docs/cierre/informe_final_proyecto.md`

#### 3.1.2. Informe Final de Lecciones Aprendidas (Final Lessons Learned Report)

Compila la información de las sesiones de lecciones aprendidas y retrospectivas realizadas a lo largo del proyecto.

**Contenido mínimo requerido (nivel sobresaliente):**
- Síntesis de retrospectivas por Sprint (Sprint 0 a Sprint 5)
- Identificación crítica de buenas prácticas (qué salió bien y por qué)
- Identificación de errores y causas raíz (qué no funcionó y por qué)
- Acciones correctivas aplicadas con evidencia de efectividad
- Oportunidades de mejora concretas y aplicables
- Aprendizaje organizacional: recomendaciones transferibles a otros proyectos
- Reflexión del equipo sobre el proceso de desarrollo

**Archivo:** `docs/cierre/lecciones_aprendidas.md`

---

### 3.2. Documentación Administrativa y de Registro

Para asegurar un cierre administrativo adecuado y un seguimiento de acciones correctivas, se presentan los siguientes registros:

#### 3.2.1. Registro de Riesgos (Risk Register) — Actualizado

Documenta los eventos de riesgo, su evolución y las respuestas aplicadas durante todo el proyecto.

**Archivo:** `docs/planificacion/Registro_de_riesgos/Registro_de_Riesgos.md`

#### 3.2.2. Registro de Incidentes o Problemas (Issue Log)

Documenta problemas reales que surgieron durante la ejecución, con responsables, estado, prioridad y acciones correctivas.

**Archivo:** `docs/seguimiento_control/registro_incidentes.md`

#### 3.2.3. Registro de Impedimentos (Impediment Log)

Documenta obstáculos que frenaron el progreso del equipo, su impacto y las acciones de mitigación aplicadas.

**Archivo:** `docs/seguimiento_control/registro_impedimentos.md`

#### 3.2.4. Registro de Defectos (Defect Log)

Identifica defectos detectados durante el desarrollo, su severidad, estado, corrección y validación.

**Archivo:** `docs/seguimiento_control/registro_defectos.md`

#### 3.2.5. Registro de Supuestos (Assumption Log) — Actualizado

Documentación de supuestos del proyecto, su impacto potencial y validación durante la ejecución.

**Archivo:** `docs/inicio/Supuestos-y-Restricciones.md`

---

### 3.3. Documentos de Revisión y Cierre Formal

#### 3.3.1. Acta de Constitución del Proyecto (Project Charter) — Revisión Final

Se revisa al final para evaluar si se cumplieron los requisitos de alto nivel y los criterios de éxito definidos al inicio.

**Archivo:** `docs/planificacion/Acta de Constitución del Proyecto.md`

#### 3.3.2. Acta de Cierre del Proyecto (Project Closure Document)

Documento formal que certifica el cierre del proyecto, verifica la entrega de todos los productos y libera los recursos del equipo.

**Archivo:** `acta_cierre_proyecto.md`

#### 3.3.3. Declaración de Trabajo (Statement of Work — SOW)

Valida el cumplimiento contractual del alcance comprometido y los entregables acordados.

**Archivo:** `docs/cierre/declaracion_trabajo_sow.md`

#### 3.3.4. Documentación de Capacitación

Manuales, guías o evidencias de transferencia de conocimiento al cliente u operaciones para garantizar la continuidad del producto.

**Archivo:** `docs/cierre/guia_capacitacion.md`

---

### 3.4. Requisitos de Formato y Repositorio

Todos los documentos deben cumplir con:
- Formato **Markdown** (.md) correctamente estructurado
- Organización coherente en el repositorio (carpetas `docs/cierre/`, `docs/seguimiento_control/`, etc.)
- Nombres de archivos consistentes y descriptivos
- Versionamiento verificable mediante historial de commits semánticos
- Enlaces cruzados entre documentos relacionados (trazabilidad documental)

---

## 4. Rúbrica de evaluación — Fase de control y cierre del proyecto

### 4.1. Criterios de evaluación

| Criterio / Indicador | **Sobresaliente (3)** | Suficiente (2) | En desarrollo (1) | Insatisfactorio (0) |
|---|---|---|---|---|
| **Informe Final del Proyecto:** presenta resumen ejecutivo completo; evidencia desempeño del alcance, calidad, cronograma y costos; integra métricas, incidencias, riesgos y resultados verificables | Documento integral, coherente y técnicamente sólido; incluye métricas cuantitativas, análisis comparativo plan vs. ejecución, trazabilidad total y conclusiones estratégicas con evidencia verificable | Presenta los componentes requeridos y evidencia suficiente del desempeño del proyecto; existen mínimos detalles faltantes sin afectar la comprensión | El informe está incompleto, con análisis superficial o inconsistencias entre resultados y evidencias | No presenta el informe o contiene información irrelevante, desordenada o sin sustento |
| **Informe Final de Lecciones Aprendidas:** identifica buenas prácticas, errores, acciones correctivas y oportunidades de mejora; consolida retrospectivas del proyecto | Consolida lecciones aprendidas de manera crítica y reflexiva; propone mejoras aplicables y evidencia aprendizaje organizacional | Incluye lecciones aprendidas relevantes y correctamente organizadas | Presenta lecciones superficiales, repetitivas o poco relacionadas con el proyecto | No incluye lecciones aprendidas o el contenido carece de utilidad |
| **Registro de Riesgos:** documenta riesgos identificados, probabilidad, impacto, respuesta aplicada y estado final | Registro completo y actualizado; riesgos priorizados mediante criterios claros; respuestas efectivas y trazabilidad verificable | Incluye riesgos relevantes con respuestas documentadas adecuadamente | Existen riesgos incompletos, sin seguimiento o con clasificación deficiente | No existe registro o contiene información incorrecta o irrelevante |
| **Registro de Incidentes o Problemas:** documenta incidencias reales, responsables, estado, prioridad y acciones correctivas | Registro estructurado, actualizado y alineado con el seguimiento real del proyecto; evidencia resolución y control efectivo | Registra incidencias principales y acciones aplicadas correctamente | Presenta incidencias incompletas o sin seguimiento adecuado | No presenta registro o la información es inconsistente |
| **Registro de Impedimentos:** identifica obstáculos que afectaron el avance; documenta impacto y acciones de mitigación | Identifica impedimentos críticos con análisis de impacto y resolución efectiva; demuestra gestión activa del equipo | Incluye impedimentos relevantes y acciones básicas de mitigación | Registro parcial o con impedimentos poco claros | No presenta impedimentos o el contenido carece de relación con el proyecto |
| **Registro de Defectos:** documenta defectos detectados, severidad, estado, corrección y validación | Registro completo con clasificación técnica, trazabilidad y evidencia de corrección validada | Registra defectos relevantes y sus correcciones principales | El registro es incompleto o sin evidencia suficiente de solución | No presenta registro o existen defectos sin documentar |
| **Registro de Supuestos:** identifica supuestos del proyecto, impacto potencial y validación durante la ejecución | Registro detallado y actualizado; analiza impacto de los supuestos y su relación con decisiones del proyecto | Presenta supuestos relevantes correctamente identificados | Los supuestos son ambiguos o insuficientes | No presenta supuestos o son irrelevantes |
| **Acta de Constitución del Proyecto:** evidencia revisión de objetivos, criterios de éxito y cumplimiento de requisitos de alto nivel | Verifica integralmente cumplimiento de objetivos, criterios de éxito y alineación con resultados finales | Presenta revisión adecuada de objetivos y resultados | Revisión parcial o con inconsistencias respecto al proyecto ejecutado | No presenta revisión o carece de coherencia |
| **Declaración de Trabajo (SOW):** valida cumplimiento contractual, alcance comprometido y entregables acordados | Evidencia validación formal del alcance y cumplimiento total del trabajo comprometido | Presenta verificación general del trabajo realizado | El documento presenta vacíos o inconsistencias respecto al alcance | No presenta SOW o no evidencia cumplimiento |
| **Documentación de Capacitación:** incluye manuales, guías o evidencias de transferencia de conocimiento al cliente u operaciones | Documentación clara, usable y completa; facilita transferencia operativa y mantenimiento del producto | Incluye documentación básica suficiente para capacitación | La documentación es incompleta o difícil de utilizar | No presenta documentación de capacitación |
| **Uso de formato Markdown y organización en repositorio:** estructura adecuada de carpetas, nombres consistentes y versionamiento verificable | Todos los documentos están en Markdown correctamente estructurado; repositorio ordenado, versionado y con historial consistente | Los documentos están en Markdown y organizados adecuadamente con mínimos errores | Existen problemas de formato, estructura o versionamiento parcial | No utiliza Markdown o el repositorio está desorganizado |
| **Coherencia y trazabilidad documental:** relación consistente entre entregables técnicos, administrativos y de gestión | Existe trazabilidad completa entre documentos, entregables y evidencias; alta coherencia técnica y administrativa | La mayoría de documentos mantiene coherencia y relación verificable | Existen inconsistencias parciales entre documentos | Los documentos no guardan relación ni coherencia |
| **Aplicación de buenas prácticas PMBOK y control de configuración:** evidencia control documental, mantenimiento y gestión de cambios | Aplica rigurosamente buenas prácticas PMBOK; control de versiones, cambios y configuración claramente evidenciados | Aplica prácticas básicas de control y documentación correctamente | Aplicación parcial o inconsistente de prácticas de gestión | No evidencia aplicación de prácticas de gestión |
| **Calidad técnica y redacción profesional:** claridad, ortografía, consistencia terminológica y presentación formal | Redacción profesional, técnica y libre de errores; excelente presentación y consistencia documental | Presentación clara y adecuada con mínimos errores formales | Presenta errores frecuentes de redacción o formato | Documento deficiente, desordenado o con numerosos errores |

---

### 4.2. Guía práctica para alcanzar el nivel **SOBRESALIENTE** en cada criterio

| Criterio | ¿Qué hacer para obtener 3 puntos? | Evidencia clave a incluir |
|---|---|---|
| **Informe Final del Proyecto** | Incluir tablas comparativas plan vs. ejecución con datos numéricos reales (costos, tiempos, cobertura). Agregar gráficas de burndown, velocity, control chart. Concluir con análisis estratégico. | Métricas de Jira, informes de cobertura, tablas de presupuesto vs. real |
| **Informe de Lecciones Aprendidas** | Realizar una retrospectiva estructurada por Sprint con formato "Start-Stop-Continue". Identificar causas raíz con técnica de los 5 porqués. Proponer mejoras específicas y accionables. | Actas de retrospectivas, tablero de acción de mejoras |
| **Registro de Riesgos** | Actualizar el registro con el estado final de cada riesgo (cerrado, materializado, mitigado). Incluir columna de lección aprendida por riesgo. | Matriz de probabilidad e impacto actualizada, fechas de cierre |
| **Registro de Incidentes** | Documentar cada incidente con: fecha, descripción, responsable, prioridad, acción correctiva, fecha de resolución, evidencia de cierre. | Capturas de issues resueltos, enlaces a PRs de fix |
| **Registro de Impedimentos** | Mapear cada impedimento a un riesgo del Risk Register. Incluir análisis de impacto en cronograma y costo. Evidenciar gestión activa del Scrum Master. | Actas de daily donde se reportó, escalamiento, resolución |
| **Registro de Defectos** | Clasificar por severidad (crítico, mayor, menor) y módulo. Enlazar cada defecto a su fix en el repositorio (commit o PR). Validar corrección con test. | Enlaces a commits, PRs, tests que validan la corrección |
| **Registro de Supuestos** | Revisar cada supuesto del Sprint 0 y marcar: válido, invalidado, o parcialmente cumplido. Analizar el impacto de los supuestos que resultaron falsos. | Referencias a decisiones de diseño afectadas por supuestos |
| **Acta de Constitución** | Crear una tabla de verificación objetivos vs. resultados reales. Incluir métricas de cumplimiento de cada criterio de éxito. | Checklist de criterios de éxito con evidencia de cumplimiento |
| **Declaración de Trabajo (SOW)** | Comparar cada entregable planificado con su versión entregada. Incluir enlace directo al archivo o funcionalidad en el repositorio. | Matriz entregable vs. entregado con links al repositorio |
| **Documentación de Capacitación** | Crear una guía paso a paso con capturas de pantalla, casos de uso típicos y sección de troubleshooting. Incluir video demo embedido. | Manual de usuario, guía rápida, FAQ, video demostrativo |
| **Markdown y repositorio** | Usar tablas, listas, código bloque, enlaces internos y externos. Mantener estructura consistente de carpetas. Commits semánticos y ramas Git Flow. | Historial de commits, estructura de carpetas, archivos .md válidos |
| **Coherencia documental** | Cruzar IDs y referencias entre todos los documentos. Usar un glosario común. Mantener consistencia en nombres de archivos y títulos. | Tabla de trazabilidad maestra que relaciona todos los documentos |
| **Prácticas PMBOK** | Evidenciar control de versiones (changelog), gestión de cambios (solicitudes de cambio documentadas), y control de configuración. | CHANGELOG.md, solicitudes de cambio, línea base de configuración |
| **Calidad técnica y redacción** | Revisar ortografía y gramática con corrector automático. Usar lenguaje técnico preciso y consistente. Mantener formato uniforme (mismos estilos de títulos, tablas, etc.). | Sin errores ortográficos, formato homogéneo en todos los documentos |

---

## 5. Estructura de repositorio recomendada para la entrega

```
C:\planner_UC\
├── acta_cierre_proyecto.md
├── TP_2 Consigna fase de control y cierre del proyecto.md
├── docs/
│   ├── inicio/
│   │   ├── Project-Charter.md
│   │   ├── Declaracion-del-Equipo.md
│   │   ├── Documento-del-Problema.md
│   │   ├── Requerimientos.md
│   │   ├── Seleccion-del-Enfoque.md
│   │   ├── Supuestos-y-Restricciones.md
│   │   └── Vision-del-Proyecto.md
│   ├── planificacion/
│   │   ├── Acta de Constitución del Proyecto.md
│   │   ├── Registro_de_riesgos/
│   │   │   ├── Registro_de_Riesgos.md
│   │   │   ├── Registro_de_Oportunidades.md
│   │   │   ├── Matriz_Prioridades_Proyecto.md
│   │   │   ├── Categorias_de_Riesgos.md
│   │   │   └── Definiciones.md
│   │   └── Presupuesto/
│   ├── seguimiento_control/
│   │   ├── registro_incidentes.md
│   │   ├── registro_impedimentos.md
│   │   └── registro_defectos.md
│   ├── cierre/
│   │   ├── informe_final_proyecto.md
│   │   ├── lecciones_aprendidas.md
│   │   ├── declaracion_trabajo_sow.md
│   │   └── guia_capacitacion.md
│   ├── testing/
│   └── green/
```

---

## 6. Criterios de éxito para la fase de cierre

Para que la fase de control y cierre se considere exitosa (nivel sobresaliente), deben cumplirse todas las siguientes condiciones:

| # | Criterio | Verificación |
|---|---|---|
| 1 | Todos los documentos obligatorios existen en el repositorio y están en Markdown | Revisión de estructura de archivos |
| 2 | El informe final del proyecto incluye métricas cuantitativas verificables (cobertura, tiempos, costos, calidad) | Lectura del documento |
| 3 | Existe trazabilidad cruzada entre documentos (enlaces internos, IDs consistentes) | Verificación manual de referencias |
| 4 | El registro de riesgos está actualizado con estado final de cada riesgo | Comparación con versión inicial |
| 5 | Las lecciones aprendidas son críticas y reflexivas (no simples descripciones) | Evaluación de profundidad analítica |
| 6 | Todos los documentos tienen redacción profesional sin errores ortográficos | Revisión de calidad de redacción |
| 7 | El repositorio muestra historial de versiones con commits semánticos | `git log --oneline` |
| 8 | Existe coherencia entre los entregables planificados y los efectivamente realizados | Matriz de trazabilidad entregables |
| 9 | La documentación de capacitación permite a un usuario nuevo operar el sistema sin asistencia | Prueba de lectura por tercero |
| 10 | Se evidencian buenas prácticas PMBOK: control de cambios, versiones y configuración | CHANGELOG y registro de cambios |

---

## 7. Instrucciones de entrega

1. Todos los documentos deben estar en el repositorio GitHub del proyecto antes de la fecha límite.
2. Los archivos deben ser exclusivamente en formato Markdown (.md).
3. El repositorio debe mantener la estructura de carpetas especificada.
4. Se debe evidenciar el versionamiento mediante commits semánticos en la rama `main` o `develop`.
5. El informe final debe estar enlazado desde el `README.md` del repositorio para facilitar la navegación.

---

*Documento generado para el equipo UniScheduler — Taller de Proyectos 2 | Universidad Continental | Julio 2026*
*Objetivo: Nivel SOBRESALIENTE en todos los criterios de la rúbrica de control y cierre.*
