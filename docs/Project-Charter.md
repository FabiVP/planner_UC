# PROJECT CHARTER

---

## Información General

| Campo | Detalle |
|---|---|
| **Project Title** | UniScheduler — Sistema de Generación Óptima de Horarios Académicos |
| **Project Sponsor** | Universidad Continental — Taller de Proyectos 2 |
| **Date Prepared** | Marzo 2026 |
| **Project Manager** | Villaverde Pacheco Fabiola Karina — Scrum Master |
| **Project Customer** | Coordinadores académicos y estudiantes UC |

---

## Propósito del proyecto

Automatizar la generación de horarios académicos válidos y sin conflictos en universidades con currículo flexible, aplicando un algoritmo de Satisfacción de Restricciones (CSP) sobre una arquitectura web moderna (PERN Stack), con el fin de reducir la carga administrativa de los coordinadores y garantizar una planificación eficiente y equitativa.

---

## Descripción general del proyecto

UniScheduler es una aplicación web que resuelve la problemática de planificación de horarios en entornos de currículo flexible. El sistema permite registrar estudiantes, docentes, cursos y aulas; valida la matrícula respetando restricciones de créditos (12–25) y prerrequisitos; y genera automáticamente horarios válidos aplicando un algoritmo CSP con backtracking y heurística MRV (Minimum Remaining Values). Los horarios generados se visualizan en un grid semanal interactivo con detección de conflictos en tiempo real.

El proyecto se desarrolla con el stack **PERN** (PostgreSQL + Express.js + React + Node.js) bajo metodología **Scrum** adaptada a equipo de 3 integrantes, usando **Trunk-Based Development** como flujo de control de versiones y **Prisma** como ORM.

---

## Límites del proyecto

### Incluido en el PMV

- Módulo de autenticación con roles (administrador, coordinador, docente, estudiante)
- CRUD completo de estudiantes, docentes, cursos (con créditos y prerrequisitos) y aulas
- Validación de matrícula: créditos 12–25 y verificación de prerrequisitos
- Algoritmo CSP de generación automática de horarios sin solapamientos
- Visualización de horarios en grid semanal interactivo
- Detección y alerta de conflictos en tiempo real
- Dashboard de resumen para coordinadores académicos
- Exportación del horario generado en formato PDF
- Pruebas unitarias e integración con cobertura ≥ 70%

### Excluido del PMV

- Integración con sistemas externos (SGA, Intranet, plataformas LMS)
- Optimización multiobjetivo avanzada (algoritmos genéticos, heurísticas complejas)
- Módulo de reportes estadísticos o analytics avanzados
- Notificaciones automáticas por correo o mensajería
- Aplicación móvil nativa

---

## Entregables clave

1. Documentación de inicio del proyecto (Sprint 0)
2. Módulo de gestión de entidades base funcional (CRUD) — `v0.1.0` a `v0.3.0`
3. Módulo de validación de matrícula y lógica de negocio — `v0.4.0` a `v0.6.0`
4. Algoritmo CSP de generación automática de horarios — `v0.7.0` a `v0.9.0`
5. PMV completo con visualización de horarios y dashboard — `v1.0.0`
6. Suite de pruebas unitarias e integración con cobertura ≥ 70%
7. Video demostrativo del sistema (máximo 5 minutos)
8. Informe final y documentación PMBOK completa en `docs/`

---

## Requisitos de alto nivel

### Funcionales

| ID | Requerimiento |
|---|---|
| RF01 | Registro, edición y eliminación de estudiantes, docentes, cursos y aulas |
| RF02 | Validación de matrícula: créditos entre 12 y 25, verificación de prerrequisitos |
| RF03 | Generación automática de horarios válidos mediante algoritmo CSP |
| RF04 | Visualización del horario en grid semanal interactivo |
| RF05 | Detección y alerta de conflictos en tiempo real |
| RF06 | Autenticación con roles diferenciados |
| RF07 | Dashboard de resumen para el coordinador académico |
| RF08 | Exportación del horario en formato PDF |

### No Funcionales (ISO/IEC 25010)

| ID | Requerimiento |
|---|---|
| RNF01 | Generación de horario para 30 cursos en menos de 10 segundos |
| RNF02 | Compatible con Chrome y Firefox versión 100+ |
| RNF03 | Contraseñas hasheadas con bcrypt; comunicación por HTTPS |
| RNF04 | Arquitectura por capas mantenible (routes → controllers → services → models) |
| RNF05 | Interfaz responsiva para escritorio (≥1280px) y tablet (≥768px) |
| RNF06 | Cobertura de pruebas ≥ 70% en módulos críticos |

---

## Riesgo general del proyecto

| # | Riesgo | Nivel | Estrategia de respuesta |
|---|---|---|---|
| R01 | Complejidad del algoritmo CSP supera la capacidad del equipo | Alto | Simplificar el modelo priorizando restricciones duras; aplicar heurística MRV |
| R02 | Falta de dominio en el stack PERN genera retrasos | Alto | Capacitación semanas 1–2; asignación de áreas de especialización por integrante |
| R03 | Inconsistencia en commits o uso desordenado de Git | Medio | Normas de commits semánticos; revisión obligatoria de Pull Requests |
| R04 | Documentación incompleta o entregada fuera de plazo | Alto | Responsable de documentación por sprint con cierre 2 días antes de la entrega |
| R05 | Subestimación del tiempo por carga académica simultánea | Medio | Planificación con holgura del 20%; revisión del backlog cada semana |
| R06 | Ambigüedad en requerimientos genera retrabajo | Medio | Revisión conjunta al inicio de cada sprint; registro de supuestos actualizado |

---

## Resumen de hitos y criterios de éxito

| Hito | Criterios de éxito |
|---|---|
| Sprint 0 — Documentación de inicio | 7 documentos en `docs/inicio/` y Wiki de GitHub operativa |
| Sprint 1–2 — CRUD entidades base (`v0.3.0`) | CRUD funcional para las 4 entidades con autenticación por roles |
| Sprint 3–4 — Validación y lógica (`v0.6.0`) | 100% de reglas de créditos y prerrequisitos validadas correctamente |
| Sprint 5–6 — Algoritmo CSP (`v0.9.0`) | Generación de horario para 30 cursos en menos de 10 segundos sin conflictos |
| Sprint 7 — PMV final (`v1.0.0`) | Sistema funcional, video ≤5 min, documentación completa, tag `v1.0.0` en GitHub |

---

## Alcance / Tiempo / Costo

| Dimensión | Restricción | Criterios de éxito |
|---|---|---|
| **Alcance** | PMV con 4 funcionalidades principales: registro, validación, generación CSP y visualización | Sistema genera horarios válidos sin conflictos para al menos 30 cursos |
| **Time** | 16 semanas, 7 sprints. Fecha límite: semana 16 | Todos los entregables completados en fecha. Tag `v1.0.0` al cierre |
| **Cost** | S/ 0.00 — herramientas gratuitas: GitHub, PostgreSQL, Vercel/Render | El proyecto se ejecuta dentro del presupuesto cero |
| **Other** | Stack: PERN. Flujo Git: Trunk-Based Development. Metodología: Scrum | Repositorio con ≥20 commits, ≥5 ramas y versionado semántico |

---

## Objetivos del proyecto

| Objetivo | Fecha de vencimiento |
|---|---|
| Completar la documentación de inicio del proyecto (Sprint 0) | Semana 2 |
| Implementar CRUD completo de entidades base con autenticación por roles | Semana 5 |
| Desarrollar módulo de validación de matrícula (créditos y prerrequisitos) | Semana 8 |
| Implementar algoritmo CSP de generación automática de horarios | Semana 11 |
| Desarrollar interfaz de visualización del horario (grid semanal) | Semana 13 |
| Completar pruebas unitarias e integración con cobertura ≥ 70% | Semana 14 |
| Publicar PMV `v1.0.0` con video demostrativo e informe final | Semana 16 |

---

## Recursos financieros preaprobados

**Presupuesto aprobado: S/ 0.00**

El proyecto opera íntegramente con herramientas gratuitas: GitHub (repositorio y Wiki), PostgreSQL (local y/o Railway free tier), Vercel o Render (despliegue free tier), Node.js y React (open source). No se requiere aprobación de recursos económicos adicionales.

---

## Stakeholders

| Stakeholder | Role |
|---|---|
| Gamarra Moreno Daniel Job — Taller de Proyectos 2 | Product Owner / Evaluador |
| Coordinador académico universitario | Usuario principal del sistema |
| Estudiante universitario | Usuario final — consulta su horario |
| Docente universitario | Usuario final — consulta su disponibilidad |
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend Lead |
| Chavez Apaza Marcos Alberto | Frontend Lead / UI-UX |
| Balden Martinez David | Algoritmo CSP / QA Lead |

---

## Criterios de salida del proyecto

1. El PMV etiquetado como `v1.0.0` en GitHub es funcional y genera horarios válidos sin conflictos.
2. La documentación en `docs/` cubre todas las fases PMBOK requeridas.
3. El repositorio evidencia trabajo colaborativo: ≥20 commits, ≥5 ramas, Pull Requests integrados.
4. El video demostrativo (≤5 minutos) está publicado y accesible desde el README.
5. Las pruebas automatizadas alcanzan cobertura ≥70% en módulos críticos.
6. El informe final ha sido entregado y aprobado por el docente del curso.

---

## Nivel de autoridad del director de proyecto

**Decisiones de personal**
El Scrum Master tiene autoridad para redistribuir tareas entre integrantes cuando un impedimento bloquea el avance de un sprint. Cualquier cambio debe documentarse en la retrospectiva.

**Gestión presupuestaria y variaciones**
No aplica presupuesto económico. El Scrum Master gestiona el presupuesto de tiempo: desviaciones mayores al 20% deben informarse al docente del curso.

**Decisiones técnicas**
Las decisiones técnicas se toman por consenso (mayoría de 2 de 3). En caso de desacuerdo persistente, se escala al docente como árbitro. Cambios al stack requieren actualización del documento de selección del enfoque.

**Resolución de conflictos**
Los merge conflicts los resuelve el autor del último commit con revisión del afectado. Los conflictos de equipo se resuelven en la retrospectiva del sprint.

**Autoridad patrocinadora**
El docente (Product Owner / Sponsor) tiene autoridad final sobre el alcance y la aceptación de entregables. Cambios significativos requieren su aprobación explícita.

---

## Aprobaciones

| | Project Manager | Sponsor / Originator |
|---|---|---|
| **Signature** | | |
| **Name** | Villaverde Pacheco Fabiola Karina | Daniel Job Gamarra Moreno |
| **Date** | 31-03-2026 | 31-03-2026 |

---

*Documento elaborado en el marco del Sprint 0 – Inicio del Proyecto.*  
*Versión: 1.0 — Marzo 2026*
