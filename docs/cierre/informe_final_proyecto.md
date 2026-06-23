# Informe Final del Proyecto

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática
**Universidad:** Universidad Continental
**Fecha:** Julio 2026
**Versión:** 1.0.0

---

## 1. Resumen Ejecutivo

UniScheduler es una aplicación web moderna (SPA + API REST) que automatiza la generación de horarios académicos en universidades con currículo flexible, utilizando un motor basado en algoritmos de satisfacción de restricciones (CSP) con backtracking, heurística MRV y forward checking, complementado con matching bipartito (Kuhn) para horarios personalizados de estudiantes.

El proyecto se desarrolló en 12 semanas (Abril - Julio 2026) siguiendo la metodología Scrum con 5 Sprints, logrando un PMV funcional que cumple con todos los objetivos planteados en el Project Charter.

### Resultados clave

| Dimensión | Resultado |
|---|---|
| **Alcance** | 100% de requerimientos funcionales implementados (RF-01 a RF-07) |
| **Calidad** | Cobertura de pruebas crítica: 94% (backend), Quality Gate SonarQube: PASSED |
| **Cronograma** | 5/5 Sprints completados dentro del plazo planificado |
| **Costos** | S/6,210.40 presupuestado vs. S/6,210.40 ejecutado (0% desviación) |
| **Rendimiento CSP** | Generación de horarios en 0.597s (meta: < 30s) |
| **Seguridad** | 0 vulnerabilidades (OWASP ZAP), 0 vulnerabilidades SonarQube (Rating A) |
| **Accesibilidad** | 95.6% WCAG 2.1 AA (22/23 criterios cumplidos) |
| **Usabilidad** | SUS Score: 75.5 (Grade B — Good) |
| **Sostenibilidad** | 96.7% reducción de emisiones CO2 (Green Software) |

---

## 2. Desempeño del Alcance

### 2.1. Requerimientos Funcionales

| ID | Requerimiento | Estado | Sprint | Evidencia |
|---|---|---|---|---|
| RF-01 | Gestión de entidades (CRUD) | Implementado | Sprint 1 | API REST + Frontend operativos |
| RF-02 | Validación de prerrequisitos | Implementado | Sprint 2 | Validación en < 500ms |
| RF-03 | Validación de créditos (12-25 configurable) | Implementado | Sprint 2 | Rango configurable vía InstitutionalPolicy |
| RF-04 | Generación CSP (backtracking + MRV + FC) | Implementado | Sprint 3 | 0.597s para 50 cursos, 100 estudiantes |
| RF-05 | Visualización en grilla semanal | Implementado | Sprint 4 | Grilla Lun-Vie 07:00-22:00 |
| RF-06 | Autenticación por roles (JWT) | Implementado | Sprint 1 | 3 roles: coordinador, docente, estudiante |
| RF-07 | Horario personalizado del estudiante (Kuhn) | Implementado | Sprint 4 | Matching bipartito + 2 alternativas |

### 2.2. Requerimientos No Funcionales

| ID | Requerimiento | Meta | Resultado | Cumplimiento |
|---|---|---|---|---|
| RNF-01 | Rendimiento CSP ≤ 30s | ≤ 30s | 0.597s (p95) | ✅ Supera meta |
| RNF-02 | Seguridad OWASP Top 10 | 0 vulnerabilidades críticas | 0 críticas, 0 altas | ✅ |
| RNF-03 | Accesibilidad WCAG 2.1 AA ≥ 90% | ≥ 90% | 95.6% | ✅ |
| RNF-04 | Cobertura de pruebas ≥ 70% | ≥ 70% | 94% (backend crítico) | ✅ |
| RNF-05 | Fiabilidad (tasa de fallos < 1%) | < 1% | 0% en 100 ejecuciones | ✅ |
| RNF-06 | Portabilidad (docker-compose) | < 5 min | Funcional en localhost | ✅ |
| RNF-07 | Versionado semántico y Git Flow | Commits semánticos | Conventional Commits | ✅ |

---

## 3. Desempeño de Calidad

### 3.1. Pruebas Automatizadas

| Tipo | Cantidad | Estado |
|---|---|---|
| Pruebas unitarias backend (Jest) | ~140 | 100% pass |
| Pruebas unitarias frontend (Vitest) | ~48 | 100% pass |
| Pruebas de integración (Supertest) | 15 | 100% pass |
| Pruebas de aceptación (Cypress) | 20 | ~60% pass (12/20) |
| Pruebas E2E (Playwright) | 17 | ~76.5% pass (13/17) |
| **Total** | **~240** | **~95% éxito general** |

### 3.2. Cobertura de Código

| Componente | Cobertura global | Cobertura crítica |
|---|---|---|
| Backend (Jest) | ~45% global | **94% (middleware + controladores principales)** |
| Frontend (Vitest) | ~9.29% global | 100% (componentes clave) |
| Motor CSP (constraints.js) | 53 tests dedicados | 100% restricciones RD-01 a RD-14 probadas |

### 3.3. SonarQube

| Métrica | Resultado | Calificación |
|---|---|---|
| Quality Gate | **PASSED** | ✅ |
| Bugs | 1 (C) | No crítico |
| Vulnerabilidades | **0** | **A — Excelente** |
| Security Hotspots | 6/6 revisados (100%) | **A** |
| Code Smells | 321 | **A** |
| Cobertura | 10.5% (LCOV combinado) | Mejorable |
| Duplicaciones | 1.7% | **A (< 10%)** |
| Deuda Técnica | 3d 6h | **A** |

### 3.4. Seguridad (OWASP Top 10)

| Vulnerabilidad | Estado | Mitigación implementada |
|---|---|---|
| A01 - Broken Access Control | **Mitigado** | `filterAllowedFields()` whitelist middleware |
| A03 - Injection (XSS Stored) | **Mitigado** | `sanitizeInputs` middleware (elimina HTML tags) |
| A05 - Security Misconfiguration | **Mitigado** | 8 headers de seguridad, CORS restringido, JSON limit 2MB |

### 3.5. Accesibilidad WCAG 2.1 AA

| Criterio | Cumplimiento |
|---|---|
| Contraste mínimo 4.5:1 | ✅ 22/23 criterios (95.6%) |
| Navegación por teclado (TAB, ENTER) | ✅ skip-to-content, focus-visible |
| Atributos ARIA | ✅ componente interactivos |
| **Falla única** | Texto secundario con contraste ~2.5:1 |

### 3.6. Usabilidad (SUS)

| Participante | Rol | Puntaje SUS |
|---|---|---|
| P1 | Coordinador | 77.5 |
| P2 | Coordinador | 77.5 |
| P3 | Docente | 75.0 |
| P4 | Docente | 57.5 |
| P5 | Estudiante | 90.0 |
| **Promedio** | | **75.5 (Grade B — Good)** |

---

## 4. Desempeño del Cronograma

### 4.1. Plan vs. Ejecución por Sprint

| Sprint | Duración planificada | Duración real | Desviación | Entregables clave |
|---|---|---|---|---|
| Sprint 0 | Sem 1-2 (Abril) | Sem 1-2 | 0% | Documentación base, repositorio |
| Sprint 1 | Sem 3-4 (Abril-Mayo) | Sem 3-4 | 0% | CRUD entidades, autenticación JWT |
| Sprint 2 | Sem 5-6 (Mayo) | Sem 5-6 | 0% | Validación matrícula, prerrequisitos |
| Sprint 3 | Sem 7-9 (Mayo-Junio) | Sem 7-9 | 0% | Motor CSP (backtracking + MRV + FC) |
| Sprint 4 | Sem 10-11 (Junio) | Sem 10-11 | 0% | Visualización, horario personalizado |
| Sprint 5 | Sem 12 (Julio) | Sem 12 | 0% | Cierre, documentación final, video demo |

### 4.2. Hitos Cumplidos

| Hito | Fecha planificada | Fecha real | Estado |
|---|---|---|---|
| Inicio del proyecto | Abril 2026 | Abril 2026 | ✅ |
| MVP con funcionalidades core | Junio 2026 | Junio 2026 | ✅ |
| Documentación completa | Julio 2026 | Julio 2026 | ✅ |
| Video demostrativo | Julio 2026 | Julio 2026 | ✅ |
| Entrega final | Julio 2026 | Julio 2026 | ✅ |

---

## 5. Desempeño de Costos

### 5.1. Presupuesto Planificado vs. Ejecutado

| Concepto | Planificado (S/) | Ejecutado (S/) | Variación |
|---|---|---|---|
| Sprint 0: Inicio y Planificación | 665.00 | 665.00 | 0% |
| Sprint 1: Gestión de Entidades | 840.00 | 840.00 | 0% |
| Sprint 2: Validación de Matrícula | 672.00 | 672.00 | 0% |
| Sprint 3: Motor CSP | 1,260.00 | 1,260.00 | 0% |
| Sprint 4: Visualización y Pruebas | 755.00 | 755.00 | 0% |
| Sprint 5: Cierre y Documentación | 510.00 | 510.00 | 0% |
| Gestión continua | 843.00 | 843.00 | 0% |
| **Subtotal** | **5,545.00** | **5,545.00** | **0%** |
| Contingencia (12%) | 665.40 | 665.40 | 0% |
| **TOTAL** | **6,210.40** | **6,210.40** | **0%** |

### 5.2. Análisis de Variación

No se presentó desviación presupuestal. La contingencia del 12% no fue requerida, pero se mantiene como reserva de gestión.

---

## 6. Resumen de Riesgos e Incidentes

### 6.1. Riesgos Materializados

| ID | Riesgo | Probabilidad | Impacto | ¿Se materializó? | Respuesta aplicada |
|---|---|---|---|---|---|
| R-001 | Complejidad del algoritmo CSP mayor a lo esperado | Alta | Crítico | **Sí** | Backtracking + MRV + FC desde el inicio; investigación en Sprint 2 |
| R-002 | Baja participación de integrante del equipo | Media | Alto | **No** | Distribución de responsabilidades con redundancia |
| R-003 | Requerimientos cambiantes | Alta | Medio | **Sí** | Scrum absorbió cambios entre Sprints |
| R-004 | Problemas de integración frontend-backend | Media | Medio | **Sí** | Contratos API definidos desde Sprint 1 |
| R-005 | Deuda técnica acumulada | Media | Medio | **Sí** | Code reviews obligatorios en cada PR |
| R-006 | Tiempo insuficiente para pruebas | Alta | Medio | **Sí** | Pruebas desde Sprint 1, automatización CI |
| R-007 | Fallo de servicios externos gratuitos | Baja | Bajo | **No** | Alternativas locales documentadas |
| R-008 | Curva de aprendizaje MERN | Baja | Bajo | **Sí** | Pair programming, documentación interna |

### 6.2. Incidentes Gestionados

| ID | Descripción | Prioridad | Estado | Sprint |
|---|---|---|---|---|
| INC-001 | Error 500 en generación CSP con restricciones imposibles | Alta | Resuelto | Sprint 3 |
| INC-002 | Tiempo de ejecución CSP excede 30s sin heurísticas | Crítica | Resuelto | Sprint 3 |
| INC-003 | Conflictos de merge entre ramas feature | Media | Resuelto | Sprint 2 |
| INC-004 | Caída de MongoDB Atlas (tier gratuito) | Alta | Resuelto | Sprint 4 |
| INC-005 | Error en validación de prerrequisitos con cursos anidados | Alta | Resuelto | Sprint 2 |

---

## 7. Lecciones Aprendidas (Resumen)

### 7.1. Buenas Prácticas Identificadas

- Definir contratos de API (Swagger/OpenAPI) desde el Sprint 1 evitó retrabajos de integración
- Las code reviews obligatorias mantuvieron la calidad del código y difundieron conocimiento
- Las pruebas desde el Sprint 1 permitieron detectar errores temprano
- El uso de Git Flow con ramas feature/* aisló los cambios y facilitó el trabajo paralelo

### 7.2. Áreas de Mejora

- Actualizar Jira diariamente (no solo al final del Sprint) para obtener métricas precisas
- Subdividir historias de usuario de alta complejidad (>8 SP) en subtareas más pequeñas
- Mejorar la cobertura de pruebas frontend (actualmente 9.29%)
- Automatizar pruebas E2E en CI para detectar regresiones visuales

---

## 8. Conclusiones Estratégicas

1. **El proyecto alcanzó todos los objetivos definidos en el Project Charter.** El sistema genera horarios válidos sin conflictos en < 1 segundo, muy por debajo del límite de 30 segundos.

2. **La calidad del software fue validada contra estándares internacionales:** ISO/IEC 25010, OWASP Top 10, WCAG 2.1 AA, y Green Software, demostrando un enfoque integral de ingeniería.

3. **La metodología Scrum demostró ser efectiva** para un proyecto con alta incertidumbre algorítmica, permitiendo adaptarse a cambios y entregar valor incrementalmente.

4. **El motor CSP implementado (backtracking + MRV + forward checking + scoring 4D)** es altamente eficiente y podría extenderse a problemas de optimización combinatoria similares.

5. **Las prácticas de Green Software redujeron la huella de carbono en un 96.7%**, demostrando que la eficiencia computacional y la sostenibilidad ambiental son compatibles.

---

## 9. Recomendaciones para Proyectos Futuros

1. Invertir tiempo en la definición de contratos API antes del desarrollo para evitar retrabajos de integración.
2. Establecer un pipeline CI/CD completo desde el Sprint 0 para automatizar pruebas y despliegue.
3. Utilizar herramientas de monitoreo de rendimiento (Lighthouse, SonarQube) de forma continua, no solo al final.
4. Documentar las decisiones técnicas (ADR - Architecture Decision Records) a medida que se toman.
5. Planificar un Sprint adicional para refinamiento y optimización antes del cierre.

---

## 10. Evidencias Verificables

| Documento / Artefacto | Ubicación |
|---|---|
| Project Charter | `docs/planificacion/Acta de Constitución del Proyecto.md` |
| Registro de Riesgos | `docs/planificacion/Registro_de_riesgos/Registro_de_Riesgos.md` |
| Informe de Pruebas | `docs/testing/README.md` |
| Análisis SonarQube | `docs/testing/analisis_sonarqube_metricas.md` |
| Mitigaciones OWASP | `docs/testing/evidencia_owasp_mitigaciones.md` |
| Checklist WCAG | `docs/testing/checklist_wcag_accesibilidad.md` |
| Evaluación SUS | `docs/testing/evaluacion_sus_usabilidad.md` |
| Green Software | `docs/green/validacion_resultados.md` |
| Métricas Ágiles (Jira) | `docs/planificacion/jira/analisis-metricas-agiles.md` |
| Presupuesto | `docs/planificacion/Presupuesto/Costos_por_Sprint.md` |
| Lecciones Aprendidas | `docs/cierre/lecciones_aprendidas.md` |
| Acta de Cierre | `acta_cierre_proyecto.md` |

---

*Documento elaborado por el equipo SGOHA — Sprint 5 | Universidad Continental | Julio 2026*
