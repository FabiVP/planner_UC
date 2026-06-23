# Declaración de Trabajo (Statement of Work — SOW)

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Cliente:** Universidad Continental — Facultad de Ingeniería
**Equipo Ejecutor:** SGOHA (Villaverde Pacheco, Chavez Apaza, Baldeon Martinez)
**Período:** Abril - Julio 2026
**Versión:** 1.0.0

---

## 1. Resumen del Trabajo Comprometido

El presente documento valida el cumplimiento del alcance comprometido y los entregables acordados en el Project Charter y la documentación de inicio del proyecto UniScheduler.

---

## 2. Verificación de Entregables

### 2.1. Entregables de Gestión (Sprint 0)

| ID | Entregable | Estado | Ubicación | Fecha de Entrega |
|---|---|---|---|---|
| E-01 | Documento de selección del enfoque | ✅ Entregado | `docs/inicio/Seleccion-del-Enfoque.md` | Abril 2026 |
| E-02 | Declaración de la visión del proyecto | ✅ Entregado | `docs/inicio/Vision-del-Proyecto.md` | Abril 2026 |
| E-03 | Project Charter | ✅ Entregado | `docs/inicio/Project-Charter.md` | Abril 2026 |
| E-04 | Registro de supuestos y restricciones | ✅ Entregado | `docs/inicio/Supuestos-y-Restricciones.md` | Abril 2026 |
| E-05 | Declaración del equipo del proyecto | ✅ Entregado | `docs/inicio/Declaracion-del-Equipo.md` | Abril 2026 |
| E-06 | Repositorio GitHub operativo | ✅ Entregado | `github.com/.../planner_UC` | Abril 2026 |
| E-07 | Documento inicial del problema | ✅ Entregado | `docs/inicio/Documento-del-Problema.md` | Abril 2026 |
| E-08 | Lista de requerimientos funcionales y no funcionales | ✅ Entregado | `docs/inicio/Requerimientos.md` | Abril 2026 |

### 2.2. Entregables Técnicos por Sprint

| ID | Entregable | Sprint | Estado | Ubicación / Evidencia |
|---|---|---|---|---|
| E-09 | Módulo de registro de entidades (backend + frontend) | Sprint 1 | ✅ Entregado | API REST `/api/students`, `/api/teachers`, `/api/courses`, `/api/classrooms` + Frontend CRUD |
| E-10 | Módulo de validación de matrícula | Sprint 2 | ✅ Entregado | Validación de prerrequisitos, créditos (12-25 configurable), corequisitos |
| E-11 | Motor de generación de horarios (CSP) | Sprint 3 | ✅ Entregado | Backtracking + MRV + Forward Checking + Scoring 4D. Tiempo: 0.597s |
| E-12 | Módulo de visualización de horarios | Sprint 4 | ✅ Entregado | Grilla semanal interactiva (Lun-Vie 07:00-22:00). Matching Kuhn para horarios personalizados |
| E-13 | Suite de pruebas (cobertura ≥ 70%) | Sprint 4-5 | ✅ Entregado | ~240 pruebas. Cobertura crítica backend: 94% |
| E-14 | Documentación técnica final | Sprint 5 | ✅ Entregado | `docs/cierre/`, `docs/testing/`, `docs/green/` |
| E-15 | Video demostrativo (≤ 5 min) | Sprint 5 | ✅ Entregado | Enlace en README.md |

---

## 3. Matriz de Trazabilidad de Requerimientos vs. Entregables

| ID Requerimiento | Descripción | Entregable Relacionado | Estado |
|---|---|---|---|
| RF-01 | Gestión de entidades (CRUD) | E-09 | ✅ Implementado |
| RF-02 | Validación de prerrequisitos | E-10 | ✅ Implementado |
| RF-03 | Validación de créditos (12-25 configurable) | E-10 | ✅ Implementado |
| RF-04 | Generación CSP (backtracking + MRV + FC) | E-11 | ✅ Implementado |
| RF-05 | Visualización en grilla semanal | E-12 | ✅ Implementado |
| RF-06 | Autenticación por roles (JWT) | E-09 | ✅ Implementado |
| RF-07 | Horario personalizado del estudiante (Kuhn) | E-12 | ✅ Implementado |
| RNF-01 | Rendimiento CSP ≤ 30s | E-11 | ✅ 0.597s (supera meta) |
| RNF-02 | Seguridad OWASP Top 10 | E-09, E-14 | ✅ 0 vulnerabilidades |
| RNF-03 | Accesibilidad WCAG 2.1 AA ≥ 90% | E-12, E-14 | ✅ 95.6% |
| RNF-04 | Cobertura de pruebas ≥ 70% | E-13 | ✅ 94% (backend crítico) |
| RNF-05 | Fiabilidad (< 1% fallos) | E-11 | ✅ 0% en 100 ejecuciones |
| RNF-06 | Portabilidad (docker-compose) | E-09 | ✅ Funcional en localhost |
| RNF-07 | Versionado semántico y Git Flow | E-06, E-14 | ✅ Conventional Commits |

---

## 4. Validación de Objetivos del Proyecto

| Objetivo | Criterio de Éxito | Resultado | Cumplimiento |
|---|---|---|---|
| OE-01 | Documento de análisis del problema aprobado | `docs/inicio/Documento-del-Problema.md` v2.0.0 | ✅ |
| OE-02 | Modelo formal documentado con variables, dominios y restricciones | CSP formalizado con RD-01 a RD-14 en `docs/inicio/Supuestos-y-Restricciones.md` | ✅ |
| OE-03 | Diagrama de arquitectura validado | Arquitectura SPA + API REST documentada en `docs/inicio/Seleccion-del-Enfoque.md` | ✅ |
| OE-04 | PMV con todas las funcionalidades core operativas | Sistema funcional: CRUD + Validación + CSP + Visualización | ✅ |
| OE-05 | Cobertura de pruebas ≥ 70% | 94% backend crítico, 0 vulnerabilidades, Quality Gate PASSED | ✅ |
| OE-06 | Repositorio GitHub con documentación completa | Repositorio con documentación de inicio, planificación, testing, green, cierre | ✅ |

---

## 5. Criterios de Aceptación del Proyecto

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. El sistema genera horarios válidos sin conflictos | ✅ Horarios generados en 0.597s sin conflictos | `docs/testing/interpretacion_resultados.md` |
| 2. Todas las restricciones del CSP son verificadas correctamente | ✅ RD-01 a RD-14 implementadas y probadas | `backend/engine/constraints.js` + 53 tests |
| 3. Repositorio GitHub cumple con lineamientos (ramas, commits) | ✅ Git Flow + Conventional Commits | Historial de commits en GitHub |
| 4. Cobertura de pruebas ≥ 70% | ✅ 94% backend crítico | `docs/testing/COVERAGE_ANALYSIS.md` |
| 5. Video demostrativo en ≤ 5 minutos | ✅ Video completo del flujo del sistema | README.md |
| 6. Documentación técnica completa | ✅ Documentos de inicio, planificación, testing, green, cierre | Estructura de docs/ |

---

## 6. Declaración de Cumplimiento

Por la presente declaramos que:

1. Todos los entregables comprometidos han sido completados y entregados en las fechas establecidas.
2. El sistema UniScheduler cumple con los requisitos funcionales y no funcionales definidos en el documento de requerimientos.
3. La documentación técnica y de gestión ha sido generada y está disponible en el repositorio del proyecto.
4. Las pruebas ejecutadas validan la calidad del software según los estándares ISO/IEC 25010, OWASP Top 10 y WCAG 2.1.
5. El proyecto se ha ejecutado dentro del presupuesto planificado (S/6,210.40) y el cronograma establecido (12 semanas).

---

## 7. Aprobaciones

| Rol | Nombre | Firma | Fecha |
|---|---|---|---|
| Scrum Master | Villaverde Pacheco Fabiola Karina | _____________ | Julio 2026 |
| Product Owner | Chavez Apaza Marcos Alberto | _____________ | Julio 2026 |
| Dev Lead | Baldeon Martinez David | _____________ | Julio 2026 |
| Docente Evaluador | [Nombre del docente] | _____________ | Julio 2026 |

---

*Documento elaborado por el equipo SGOHA — Sprint 5 | Universidad Continental | Julio 2026*
