# Registro de Impedimentos (Impediment Log)

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Scrum Master:** Villaverde Pacheco Fabiola Karina
**Período:** Abril - Julio 2026
**Versión:** 1.0.0

---

## 1. Propósito

Este registro documenta los obstáculos que frenaron el progreso del equipo durante el desarrollo del proyecto, identificando su impacto, las acciones de mitigación aplicadas y las lecciones derivadas.

---

## 2. Registro de Impedimentos

| ID | Fecha | Descripción del Impedimento | Sprint | Impacto en Cronograma | Impacto en Costo | Acción de Mitigación | Responsable | Estado | Riesgo Relacionado |
|---|---|---|---|---|---|---|---|---|---|
| IMP-001 | 25/05/2026 | Complejidad inesperada en la implementación de la restricción RD-03 (estudiante sin solapamiento). La validación O(n²) ralentiza el backtracking a niveles inaceptables (> 2 min) | Sprint 3 | Retraso de 7-10 días en la entrega del motor CSP | S/210 (horas extras de desarrollo) | Implementar índices en memoria (Map/diccionarios) para acelerar la validación de estudiantes. Aplicar Forward Checking para poda temprana | Baldeon Martinez David | Cerrado | R-001 (Complejidad CSP) |
| IMP-002 | 02/05/2026 | Conflictos de merge recurrentes en archivos compartidos del backend (modelos de Mongoose) debido a trabajo paralelo sin coordinación | Sprint 1 | Retraso de 1 día en integración | S/24 (2 horas de reunión de resolución) | Establecer regla: notificar en el canal de WhatsApp antes de modificar modelos compartidos. Usar ramas feature/* aisladas | Villaverde Pacheco Fabiola Karina | Cerrado | R-004 (Problemas de integración) |
| IMP-003 | 15/06/2026 | Caída del servicio de MongoDB Atlas (tier gratuito) durante 4 horas, bloqueando todas las operaciones CRUD y generación de horarios | Sprint 4 | Retraso de 4 horas en desarrollo y pruebas | S/0 (servicio gratuito) | Implementar mecanismo de reintentos automáticos con backoff exponencial. Documentar procedimiento de conmutación a instancia local de MongoDB | Villaverde Pacheco Fabiola Karina | Cerrado | R-007 (Fallo servicios externos) |
| IMP-004 | 18/05/2026 | Falta de claridad en los requisitos de validación de matrícula: no estaba definido si la validación de prerrequisitos debía ser recursiva (cadena de prerrequisitos) o solo de primer nivel | Sprint 2 | Retraso de 2 días por re-trabajo en la lógica de validación | S/48 (4 horas de reunión + re-trabajo) | Consultar al Product Owner (docente). Definir validación recursiva. Documentar la decisión en el registro de supuestos | Chavez Apaza Marcos Alberto | Cerrado | R-003 (Requerimientos cambiantes) |
| IMP-005 | 08/06/2026 | El equipo no tenía experiencia previa en algoritmos de matching bipartito (Kuhn) para horarios personalizados de estudiantes, requiriendo investigación adicional | Sprint 4 | Retraso de 3 días en inicio de implementación | S/72 (6 horas de investigación) | Dedicar 2 días a investigación y POC del algoritmo Kuhn. Usar pair programming entre el Dev Lead y el especialista CSP | Baldeon Martinez David | Cerrado | R-008 (Curva de aprendizaje) |
| IMP-006 | 10/05/2026 | Baja disponibilidad de un integrante del equipo durante 3 días por compromisos académicos (exámenes finales de otros cursos) | Sprint 2 | Redistribución de tareas: 30% de avance menor en frontend | S/0 (re-distribución interna) | Redistribuir tareas entre los otros 2 integrantes. Ajustar el alcance del Sprint en el Daily Scrum | Villaverde Pacheco Fabiola Karina | Cerrado | R-002 (Baja participación) |
| IMP-007 | 22/06/2026 | Las pruebas E2E (Playwright) fallan en CI (GitHub Actions) pero pasan localmente. Diferencia de tiempo de carga y recursos entre entornos | Sprint 5 | Retraso de 2 días en configuración de CI | S/48 (4 horas de depuración) | Aumentar timeouts de 30s a 60s para CI. Agregar reintentos automáticos. Usar `--workers 1` para evitar contención de recursos | Baldeon Martinez David | Cerrado | R-006 (Tiempo insuficiente para pruebas) |

---

## 3. Resumen por Impacto en Cronograma

| Rango de Impacto | Cantidad | IDs |
|---|---|---|
| Alto (> 5 días) | 1 | IMP-001 |
| Medio (2-5 días) | 3 | IMP-004, IMP-005, IMP-007 |
| Bajo (< 2 días) | 3 | IMP-002, IMP-003, IMP-006 |

---

## 4. Resumen por Estado

| Estado | Cantidad | IDs |
|---|---|---|
| Cerrado | 7 | IMP-001 a IMP-007 |
| Abierto | 0 | - |
| **Total** | **7** | |

---

## 5. Mapeo de Impedimentos a Riesgos

| Impedimento | Riesgo Relacionado | ¿Se activó el plan de mitigación? |
|---|---|---|
| IMP-001 | R-001 (Complejidad CSP) | Sí — Se aplicó investigación de librerías y horas de contingencia |
| IMP-002 | R-004 (Problemas de integración) | No — El riesgo no anticipó conflictos de merge en modelos compartidos |
| IMP-003 | R-007 (Fallo servicios externos) | Sí — Se activó procedimiento de alternativa local |
| IMP-004 | R-003 (Requerimientos cambiantes) | Sí — Scrum absorbió el cambio, aunque con retrabajo |
| IMP-005 | R-008 (Curva de aprendizaje) | Sí — Pair programming y POC |
| IMP-006 | R-002 (Baja participación) | Sí — Redistribución de tareas |
| IMP-007 | R-006 (Tiempo insuficiente para pruebas) | Sí — Ajuste de configuración CI |

---

## 6. Lecciones Aprendidas de Impedimentos

| Impedimento | Causa Raíz | Acción Preventiva para Futuros Proyectos |
|---|---|---|
| IMP-001 | No se anticipó la complejidad computacional de RD-03 en el diseño del CSP | Incluir análisis de complejidad algorítmica detallado en el diseño previo a la implementación |
| IMP-002 | Falta de coordinación en modificación de archivos compartidos | Implementar reglas claras de comunicación para archivos compartidos (modelos, configuraciones) |
| IMP-004 | Requisitos incompletos en la planificación del Sprint | Validar todos los casos borde con el Product Owner antes de comenzar la implementación |

---

*Documento elaborado por el equipo SGOHA — Sprint 5 | Julio 2026*
