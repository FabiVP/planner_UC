# Registro de Riesgos del Proyecto

**Proyecto:** UniScheduler   
**Gerente del Proyecto:** Scrum Master - Villaverde Pacheco Fabis Fabis  
**Fecha:** Abril 2026  
**Versión:** 1.0.0

---

Este documento detalla las amenazas identificadas, su evaluación de impacto y los planes de mitigación.

| ID Riesgo | Descripción del Riesgo | Área de Impacto | Impacto | Probabilidad | Puntuación de Riesgo | Estado | Asignado a | Estrategia de Respuesta |
|:----------|:-----------------------|:----------------|:--------|:-------------|---------------------:|:-------|:-----------|:------------------------|
| **R-001** | Complejidad del algoritmo CSP mayor a la esperada, requiriendo más tiempo y recursos para implementar backtracking, MRV y forward checking | Cronograma | Crítico | Alta | 20 | Activo | Backend Dev (CSP) | Mitigar: Investigar librerías CSP existentes; implementar versión simplificada primero; dedicar horas de contingencia del 12% |
| **R-002** | Abandono o baja participación de algún integrante del equipo, afectando la velocidad de entrega de los Sprints | Recursos | Alto | Media | 12 | Activo | Scrum Master | Mitigar: Documentar todas las decisiones; distribuir responsabilidades con redundancia; registrar horas semanales |
| **R-003** | Requerimientos cambiantes durante el desarrollo por parte del docente o Product Owner, afectando el alcance planificado | Alcance | Medio | Alta | 12 | Activo | Product Owner | Aceptar: Scrum como metodología absorbe cambios entre Sprints; priorizar con Product Owner |
| **R-004** | Problemas de integración entre frontend (React) y backend (API REST), causando retrasos en la conexión de componentes | Cronograma | Medio | Media | 9 | Activo | Dev Lead | Mitigar: Definir contratos de API (Swagger/OpenAPI) desde Sprint 1; pruebas de integración tempranas |
| **R-005** | Deuda técnica acumulada por presión de entregas rápidas, afectando la calidad del código y sprints futuros | Calidad | Medio | Media | 9 | Activo | Dev Lead | Mitigar: Code reviews obligatorios en cada PR; estándares de código definidos desde Sprint 0 |
| **R-006** | Tiempo insuficiente para pruebas exhaustivas debido al cronograma ajustado, afectando la cobertura (>70%) | Calidad | Medio | Alta | 12 | Activo | QA Engineer | Mitigar: Incluir pruebas desde Sprint 1; automatizar con GitHub Actions; pruebas unitarias por feature |
| **R-007** | Fallo o interrupción de servicios externos gratuitos (GitHub, MongoDB Atlas, Render, Vercel) | Infraestructura | Bajo | Baja | 6 | Activo | Scrum Master | Aceptar: Tener alternativas locales (MongoDB local, GitLab como respaldo); documentar procedimientos |
| **R-008** | Curva de aprendizaje del equipo en MongoDB y tecnologías del stack MERN, ralentizando el desarrollo inicial | Recursos | Bajo | Baja | 4 | Activo | Dev Lead | Mitigar: Dedicar horas de investigación al inicio del Sprint 1; documentar mejores prácticas; pair programming |

---

## Leyenda de Valoración

| Nivel | Impacto | Probabilidad | Puntuación |
|:------|:--------|:-------------|-----------:|
| Muy Alto | 5 | 5 | 21-25 |
| Alto | 4 | 4 | 16-20 |
| Medio | 3 | 3 | 10-15 |
| Bajo | 2 | 2 | 5-9 |
| Muy Bajo | 1 | 1 | 1-4 |

**Fórmula de puntuación:** `Impacto × Probabilidad` (escala 1-5)

---

## Clasificación por Estado

| Estado | Cantidad | IDs |
|:-------|:--------:|:----|
| Activo | 8 | R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008 |
| Cerrado | 0 | - |
| Observado | 0 | - |

---

## Clasificación por Prioridad

| Prioridad | Puntuación | Cantidad | IDs |
|:----------|-----------:|:--------:|:----|
| Crítica | 20-25 | 1 | R-001 |
| Alta | 15-19 | 0 | - |
| Media | 10-14 | 3 | R-002, R-003, R-006 |
| Media-Baja | 5-9 | 3 | R-004, R-005, R-007 |
| Baja | 1-4 | 1 | R-008 |

---

**Elaborado por:** Chavez Apaza Marcos - Sprint 0  
**Fecha:** Abril 2026  
**Estado:** Aprobado (consistente con `C_project_charter.md` y `Matriz_Prioridades_Proyecto.md`)
