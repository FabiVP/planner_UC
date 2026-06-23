# Resumen de Ejecución por Sprints

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Período:** Abril - Julio 2026
**Versión:** 1.0.0

---

## Sprint 0 — Inicio y Documentación Base

| Campo | Detalle |
|---|---|
| **Duración** | Semanas 1-2 (Abril 2026) |
| **Objetivo** | Establecer la base del proyecto: metodología, stack, repositorio y documentación de inicio |
| **SP planificados** | 20 |
| **SP completados** | 20 (100%) |

### Entregables generados
- Documento de selección del enfoque
- Declaración de la visión del proyecto
- Project Charter
- Registro de supuestos y restricciones
- Declaración del equipo
- Repositorio GitHub configurado con Git Flow
- Documento inicial del problema
- Lista de requerimientos funcionales y no funcionales

### Decisiones técnicas clave
- Metodología: Scrum (Sprints de 2-3 semanas)
- Stack: MERN (MongoDB, Express, React, Node.js)
- Arquitectura: SPA + API REST
- Algoritmo: CSP con backtracking + MRV + Forward Checking
- Estándares: Conventional Commits, Git Flow, ISO 25010, OWASP, WCAG

---

## Sprint 1 — Gestión de Entidades

| Campo | Detalle |
|---|---|
| **Duración** | Semanas 3-4 (Abril - Mayo 2026) |
| **Objetivo** | CRUD de estudiantes, docentes, cursos, aulas + autenticación JWT |
| **SP planificados** | 28 |
| **SP completados** | 28 (100%) |

### Funcionalidades implementadas
- API REST para CRUD de entidades (students, teachers, courses, classrooms)
- Autenticación JWT con 3 roles (coordinador, docente, estudiante)
- Modelos Mongoose con índices y validaciones
- Frontend React con componentes de gestión

### Incidentes
- INC-003: Conflictos de merge en modelos compartidos (resuelto)

---

## Sprint 2 — Validación de Matrícula

| Campo | Detalle |
|---|---|
| **Duración** | Semanas 5-6 (Mayo 2026) |
| **Objetivo** | Validación de prerrequisitos, créditos (12-25), corequisitos |
| **SP planificados** | 28 |
| **SP completados** | 28 (100%) |

### Funcionalidades implementadas
- Validación recursiva de prerrequisitos
- Validación de rango de créditos (12-25 configurable vía InstitutionalPolicy)
- Análisis de sobrecarga académica
- Selector de cursos con indicadores visuales

### Incidentes
- INC-005: Error en validación de prerrequisitos anidados (resuelto)

---

## Sprint 3 — Motor CSP

| Campo | Detalle |
|---|---|
| **Duración** | Semanas 7-9 (Mayo - Junio 2026) |
| **Objetivo** | Motor de generación de horarios con backtracking + MRV + Forward Checking |
| **SP planificados** | ~50 |
| **SP completados** | ~30 (progreso parcial en restricciones complejas) |

### Funcionalidades implementadas
- Backtracking con ordenamiento dinámico de variables
- Heurística MRV (Minimum Remaining Values)
- Forward Checking para poda de dominios
- Restricciones RD-01 a RD-14 implementadas en `constraints.js`
- Sistema de scoring 4D (validez, institucional, preferencias, optimización)
- Tiempo de generación: 0.597s (meta: < 30s)

### Incidentes
- INC-001: Error 500 en CSP con restricciones imposibles (resuelto)
- INC-002: Tiempo de ejecución > 30s sin heurísticas (resuelto)

### Impedimentos
- IMP-001: Complejidad de restricción RD-03 (estudiante sin solapamiento) — resuelto con índices en memoria

---

## Sprint 4 — Visualización y Pruebas

| Campo | Detalle |
|---|---|
| **Duración** | Semanas 10-11 (Junio 2026) |
| **Objetivo** | Grilla semanal interactiva, horario personalizado estudiante (Kuhn), pruebas integrales |
| **SP planificados** | Según plan |
| **SP completados** | 100% |

### Funcionalidades implementadas
- Grilla semanal interactiva (Lun-Vie 07:00-22:00, 15 franjas)
- Matching bipartito (Kuhn) para horarios personalizados del estudiante
- Hasta 2 alternativas de horario por estudiante
- Manejo de cursos no cubiertos (uncoveredCourses)
- Navegación por teclado en grid (WCAG)
- Pruebas unitarias, integración y E2E

### Incidentes
- INC-004: Caída de MongoDB Atlas (resuelto con reintentos)
- INC-007: Grid no se actualizaba tras regeneración (resuelto)

---

## Sprint 5 — Cierre y Documentación Final

| Campo | Detalle |
|---|---|
| **Duración** | Semana 12 (Julio 2026) |
| **Objetivo** | Documentación final, video demostrativo, acta de cierre |
| **SP completados** | 100% |

### Entregables generados
- Informe Final del Proyecto
- Informe de Lecciones Aprendidas
- Registro de Incidentes, Impedimentos y Defectos
- Declaración de Trabajo (SOW)
- Guía de Capacitación
- Acta de Cierre del Proyecto
- Documentación Green Software (4 técnicas implementadas)
- Documentación de Testing y Calidad (SonarQube, OWASP, WCAG, SUS)

---

## Resumen de Métricas de Ejecución

| Métrica | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Total |
|---|---|---|---|---|---|---|---|
| SP completados | 20 | 28 | 28 | ~30 | ~25 | ~15 | ~146 |
| Defectos | 0 | 2 | 2 | 4 | 5 | 2 | 15 |
| Incidentes | 0 | 1 | 1 | 3 | 2 | 1 | 10 |
| Impedimentos | 0 | 1 | 2 | 1 | 2 | 1 | 7 |

---

*Documento elaborado por el equipo SGOHA — Sprint 5 | Universidad Continental | Julio 2026*
