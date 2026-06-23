# Registro de Defectos (Defect Log)

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Responsable:** Baldeon Martinez David (QA Lead)
**Período:** Abril - Julio 2026
**Versión:** 1.0.0

---

## 1. Propósito

Este registro documenta los defectos detectados durante el desarrollo del proyecto, clasificados por severidad, estado, corrección aplicada y validación realizada.

---

## 2. Registro de Defectos

| ID | Fecha | Módulo | Descripción | Severidad | Estado | Corrección Aplicada | Validación | Commits / PR Relacionados |
|---|---|---|---|---|---|---|---|---|
| DEF-001 | 28/04/2026 | Autenticación | El endpoint `POST /api/auth/login` retorna error 500 cuando se envían credenciales vacías en lugar de un 400 con mensaje descriptivo | Media | Cerrado | Agregar validación de campos vacíos en el middleware de login antes de consultar la BD | Test unitario verifica HTTP 400 para credenciales vacías | `feat: add empty credential validation to login` |
| DEF-002 | 05/05/2026 | CRUD Estudiantes | El campo `email` permite duplicados en la base de datos. Dos estudiantes pueden registrarse con el mismo correo | Crítica | Cerrado | Agregar índice único `unique: true` en el campo `email` del modelo Student | Test de integración verifica error 400 al duplicar email | `fix: add unique email index to Student model` |
| DEF-003 | 10/05/2026 | Validación Matrícula | La validación de prerrequisitos solo verifica un nivel de profundidad. Si A requiere B y B requiere C, y el estudiante no tiene C, la validación pasa incorrectamente | Crítica | Cerrado | Implementar validación recursiva que recorre toda la cadena de prerrequisitos | Test unitario con cadena de 3 niveles de prerrequisitos | `fix: implement recursive prerequisite validation` |
| DEF-004 | 15/05/2026 | UI General | El botón "Generar Horario" permanece deshabilitado incluso después de seleccionar todos los cursos requeridos en la validación de matrícula | Media | Cerrado | Corregir la lógica de habilitación del botón: verificar que se hayan seleccionado cursos y que la validación de créditos sea correcta | Test de componente verifica botón habilitado después de seleccionar cursos válidos | `fix: enable generate button after valid course selection` |
| DEF-005 | 20/05/2026 | Motor CSP | El motor CSP no respeta la restricción RD-12 (bloques horarios bloqueados). Asigna cursos en el horario de almuerzo (13:00-14:00) | Alta | Cerrado | Agregar verificación de `blockedTimeSlots` en `constraints.js`. Incluir almuerzo como slot bloqueado por defecto | Test unitario verifica que no hay asignaciones en franjas bloqueadas | `feat: add RD-12 blocked time slots constraint` |
| DEF-006 | 22/05/2026 | Motor CSP | Cuando el CSP no encuentra solución (restricciones imposibles), el servidor crashea con error 500 en lugar de retornar un mensaje de error | Alta | Cerrado | Implementar manejo de excepción: capturar fallo de asignación y retornar HTTP 400 con `{ error: "No se encontró una solución válida", details: [...] }` | Test unitario verifica respuesta controlada para escenario sin solución | `fix: handle CSP failure gracefully with 400 response` |
| DEF-007 | 25/05/2026 | Motor CSP | La heurística MRV no se aplica correctamente cuando varios cursos tienen el mismo número de valores restantes. El orden no es determinístico | Media | Cerrado | Implementar desempate (tie-breaking) por grado de restricción (máximo número de restricciones con no-asignados) | Test de regresión verifica orden consistente | `fix: add tie-breaking to MRV heuristic` |
| DEF-008 | 01/06/2026 | Visualización | El grid de horarios no muestra correctamente los cursos que ocupan 2 franjas consecutivas (sesiones dobles). Se muestran como dos celdas separadas | Media | Cerrado | Implementar fusión de celdas (rowSpan) para cursos con sesiones consecutivas en el mismo día | Verificación visual en 5 escenarios de sesiones dobles | `fix: merge consecutive time slot cells in schedule grid` |
| DEF-009 | 05/06/2026 | Visualización | Los colores de los cursos en el grid no son consistentes entre regeneraciones. El mismo curso aparece con diferente color cada vez que se genera el horario | Baja | Cerrado | Asignar color basado en el ID del curso (hash consistente) en lugar de asignación aleatoria | Verificación visual: colores consistentes en 10 regeneraciones consecutivas | `fix: assign consistent course colors based on ID hash` |
| DEF-010 | 08/06/2026 | Matching Estudiante | El algoritmo de matching de Kuhn falla cuando un estudiante selecciona más cursos de los que puede ubicar en su horario (ej. 8 cursos para 5 franjas disponibles) | Alta | Cerrado | Implementar manejo de `uncoveredCourses`: los cursos sin asignación se reportan en la respuesta sin causar fallo | Test de integración verifica respuesta con cursos no cubiertos | `feat: handle uncovered courses in Kuhn matching` |
| DEF-011 | 10/06/2026 | Seguridad | Los headers de seguridad faltan en las respuestas de la API: `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy` | Alta | Cerrado | Implementar middleware de seguridad con helmet.js configurado con CSP, HSTS, X-Frame-Options, etc. | Test unitario verifica 8 headers de seguridad en respuestas | `feat: add security headers middleware with helmet.js` |
| DEF-012 | 12/06/2026 | Frontend | El mensaje de error "Error de conexión" no se muestra cuando MongoDB Atlas está caído. La interfaz se queda cargando indefinidamente | Media | Cerrado | Agregar timeout de 10s en las peticiones fetch del frontend. Mostrar mensaje de error con opción de reintentar | Test de componente simula timeout y verifica mensaje de error | `fix: add fetch timeout and connection error UI` |
| DEF-013 | 15/06/2026 | Green Software | Las consultas a la colección `courses` hacen COLLSCAN (full collection scan) porque falta el índice en los campos de búsqueda frecuente | Media | Cerrado | Agregar índices compuestos en `course.model.js` para los campos más consultados: `code`, `career`, `semester` | Test de rendimiento: IXSCAN vs COLLSCAN (reducción 93% en tiempo) | `perf: add MongoDB indexes for course queries` |
| DEF-014 | 18/06/2026 | API REST | El endpoint `GET /api/courses` retorna todos los cursos sin paginación. Para 50+ cursos, la respuesta supera los 300KB | Media | Cerrado | Implementar paginación con parámetros `page` (default: 1) y `limit` (default: 20, max: 100) | Test de integración verifica paginación y tamaño de respuesta reducido | `feat: implement pagination for course listing` |
| DEF-015 | 20/06/2026 | Accesibilidad | El grid de horarios no es navegable por teclado. Los usuarios que dependen del teclado no pueden explorar los horarios | Alta | Cerrado | Agregar `tabIndex`, `aria-label` y manejo de eventos de teclado (flechas, TAB, ENTER) en las celdas del grid | Verificación con Lighthouse: puntuación de accesibilidad ≥ 90% | `feat: add keyboard navigation to schedule grid` |

---

## 3. Resumen por Severidad

| Severidad | Cantidad | IDs |
|---|---|---|
| Crítica | 2 | DEF-002, DEF-003 |
| Alta | 5 | DEF-005, DEF-006, DEF-010, DEF-011, DEF-015 |
| Media | 7 | DEF-001, DEF-004, DEF-007, DEF-008, DEF-012, DEF-013, DEF-014 |
| Baja | 1 | DEF-009 |
| **Total** | **15** | |

---

## 4. Resumen por Estado

| Estado | Cantidad | IDs |
|---|---|---|
| Cerrado | 15 | DEF-001 a DEF-015 |
| Abierto | 0 | - |
| **Total** | **15** | |

---

## 5. Defectos por Módulo

| Módulo | Cantidad | IDs |
|---|---|---|
| Motor CSP | 3 | DEF-005, DEF-006, DEF-007 |
| Matching Estudiante | 1 | DEF-010 |
| Autenticación | 1 | DEF-001 |
| CRUD / Modelos | 1 | DEF-002 |
| Validación Matrícula | 1 | DEF-003 |
| Visualización (Grid) | 3 | DEF-008, DEF-009, DEF-015 |
| Frontend (UI General) | 2 | DEF-004, DEF-012 |
| Seguridad | 1 | DEF-011 |
| API REST | 1 | DEF-014 |
| Green Software | 1 | DEF-013 |

---

## 6. Defectos por Sprint

| Sprint | Defectos | IDs |
|---|---|---|
| Sprint 1 | 2 | DEF-001, DEF-002 |
| Sprint 2 | 2 | DEF-003, DEF-004 |
| Sprint 3 | 4 | DEF-005, DEF-006, DEF-007, DEF-013 |
| Sprint 4 | 5 | DEF-008, DEF-009, DEF-010, DEF-012, DEF-014 |
| Sprint 5 | 2 | DEF-011, DEF-015 |

---

## 7. Tiempo de Resolución

| ID | Severidad | Fecha Detección | Fecha Cierre | Días para Resolver |
|---|---|---|---|---|
| DEF-001 | Media | 28/04/2026 | 29/04/2026 | 1 |
| DEF-002 | Crítica | 05/05/2026 | 06/05/2026 | 1 |
| DEF-003 | Crítica | 10/05/2026 | 12/05/2026 | 2 |
| DEF-004 | Media | 15/05/2026 | 17/05/2026 | 2 |
| DEF-005 | Alta | 20/05/2026 | 22/05/2026 | 2 |
| DEF-006 | Alta | 22/05/2026 | 24/05/2026 | 2 |
| DEF-007 | Media | 25/05/2026 | 27/05/2026 | 2 |
| DEF-008 | Media | 01/06/2026 | 03/06/2026 | 2 |
| DEF-009 | Baja | 05/06/2026 | 05/06/2026 | 0 (mismo día) |
| DEF-010 | Alta | 08/06/2026 | 10/06/2026 | 2 |
| DEF-011 | Alta | 10/06/2026 | 12/06/2026 | 2 |
| DEF-012 | Media | 12/06/2026 | 14/06/2026 | 2 |
| DEF-013 | Media | 15/06/2026 | 16/06/2026 | 1 |
| DEF-014 | Media | 18/06/2026 | 19/06/2026 | 1 |
| DEF-015 | Alta | 20/06/2026 | 22/06/2026 | 2 |
| **Promedio** | | | | **1.6 días** |

---

## 8. Lecciones Aprendidas de Defectos

| ID | Causa Raíz | Acción Preventiva |
|---|---|---|
| DEF-002 | Falta de validación de unicidad en el modelo de datos | Incluir restricciones de unicidad en el diseño del esquema de base de datos |
| DEF-003 | Validación insuficiente en el diseño del módulo de prerrequisitos | Validar todos los casos borde (anidamiento, ciclos, profundidad) en la fase de diseño |
| DEF-005 | Restricción RD-12 no incluida en la implementación inicial del CSP | Verificar que todas las restricciones definidas en el documento de diseño están implementadas antes de dar por terminado el módulo |

---

*Documento elaborado por el equipo SGOHA — Sprint 5 | Julio 2026*
