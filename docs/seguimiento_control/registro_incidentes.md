# Registro de Incidentes o Problemas (Issue Log)

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Responsable:** Scrum Master — Villaverde Pacheco Fabiola Karina
**Período:** Abril - Julio 2026
**Versión:** 1.0.0

---

## 1. Propósito

Este registro documenta los problemas reales que surgieron durante la ejecución del proyecto, incluyendo responsables, estado, prioridad y acciones correctivas aplicadas.

---

## 2. Registro de Incidentes

| ID | Fecha | Descripción | Prioridad | Responsable | Estado | Acción Correctiva | Fecha de Cierre |
|---|---|---|---|---|---|---|---|
| INC-001 | 18/05/2026 | Error 500 en generación CSP cuando las restricciones son imposibles de satisfacer (ej. todas las aulas ocupadas). El servidor retorna un crash en lugar de un mensaje de error amigable | Alta | Baldeon Martinez David | Cerrado | Implementar manejo de errores en el motor CSP: detectar fallo de asignación y retornar HTTP 400 con mensaje descriptivo. Agregar test para escenario de restricciones imposibles | 20/05/2026 |
| INC-002 | 22/05/2026 | Tiempo de ejecución del CSP excede 30 segundos sin heurísticas activadas. Para 50 cursos y 100 estudiantes, el backtracking puro tarda > 2 minutos | Crítica | Baldeon Martinez David | Cerrado | Implementar heurística MRV (Minimum Remaining Values) para ordenar variables y Forward Checking para podar dominios. Redujo tiempo a 0.597s | 01/06/2026 |
| INC-003 | 02/05/2026 | Conflictos de merge entre ramas `feature/student-crud` y `feature/teacher-crud` en el modelo de base de datos. Ambos desarrolladores modificaron el mismo archivo `User.js` | Media | Chavez Apaza Marcos Alberto | Cerrado | Resolver conflictos manualmente en reunión sincrónica. Establecer regla: notificar antes de modificar modelos compartidos | 03/05/2026 |
| INC-004 | 15/06/2026 | Caída de MongoDB Atlas (tier gratuito) durante 4 horas. El frontend muestra errores de conexión y no permite operaciones CRUD | Alta | Villaverde Pacheco Fabiola Karina | Cerrado | Implementar reintentos automáticos con backoff exponencial en backend. Documentar procedimiento de conmutación a MongoDB local | 16/06/2026 |
| INC-005 | 10/05/2026 | Error en validación de prerrequisitos: cursos con prerrequisitos anidados (A requiere B, B requiere C) no se validan correctamente si solo se verifica el primer nivel | Alta | Baldeon Martinez David | Cerrado | Implementar validación recursiva de prerrequisitos. Agregar test para cadenas de 3+ niveles de prerrequisitos | 12/05/2026 |
| INC-006 | 25/05/2026 | El selector de cursos en el frontend no muestra los créditos de cada curso, dificultando al estudiante verificar su carga crediticia | Media | Chavez Apaza Marcos Alberto | Cerrado | Agregar columna de créditos en el selector de cursos. Mostrar subtotal de créditos seleccionados en tiempo real | 27/05/2026 |
| INC-007 | 08/06/2026 | El grid de visualización de horarios no se actualiza después de regenerar el horario. Muestra los datos anteriores hasta que se recarga la página | Media | Chavez Apaza Marcos Alberto | Cerrado | Implementar actualización reactiva del estado del grid al recibir nueva respuesta del CSP. Forzar re-renderizado del componente | 09/06/2026 |
| INC-008 | 05/06/2026 | El endpoint `POST /api/generations/generate` no valida correctamente los IDs de cursos enviados. Si se envía un ID inválido, retorna error 500 en lugar de 400 | Media | Villaverde Pacheco Fabiola Karina | Cerrado | Agregar validación de IDs de cursos contra la base de datos antes de ejecutar el CSP. Retornar 400 con lista de IDs inválidos | 06/06/2026 |
| INC-009 | 12/05/2026 | El login muestra un error genérico "Error de autenticación" que no permite al usuario saber si el error es de credenciales, conexión o servidor | Baja | Chavez Apaza Marcos Alberto | Cerrado | Mejorar mensajes de error: diferenciar entre "Credenciales inválidas", "Error de conexión" y "Error del servidor" con códigos específicos | 14/05/2026 |
| INC-010 | 20/06/2026 | Las pruebas E2E de Playwright fallan intermitentemente por problemas de timeout en CI. La misma prueba pasa localmente pero falla en GitHub Actions | Alta | Baldeon Martinez David | Cerrado | Aumentar timeouts de Playwright para CI (30s → 60s). Agregar reintentos automáticos (2 intentos) en pruebas E2E | 22/06/2026 |

---

## 3. Resumen por Prioridad

| Prioridad | Cantidad | IDs |
|---|---|---|
| Crítica | 1 | INC-002 |
| Alta | 4 | INC-001, INC-004, INC-005, INC-010 |
| Media | 4 | INC-003, INC-006, INC-007, INC-008 |
| Baja | 1 | INC-009 |
| **Total** | **10** | |

---

## 4. Resumen por Estado

| Estado | Cantidad | IDs |
|---|---|---|
| Cerrado | 10 | INC-001 a INC-010 |
| Abierto | 0 | - |
| **Total** | **10** | |

---

## 5. Incidentes por Sprint

| Sprint | Incidentes | IDs |
|---|---|---|
| Sprint 1 | 1 | INC-003 |
| Sprint 2 | 3 | INC-005, INC-006, INC-009 |
| Sprint 3 | 3 | INC-001, INC-002, INC-008 |
| Sprint 4 | 2 | INC-004, INC-007 |
| Sprint 5 | 1 | INC-010 |

---

## 6. Lecciones Aprendidas de Incidentes

| ID | Lección | Recomendación |
|---|---|---|
| INC-002 | Las heurísticas de poda (MRV + Forward Checking) son indispensables para problemas CSP de tamaño real. Sin ellas, el tiempo de ejecución es inviable | Incluir heurísticas desde el diseño inicial del CSP |
| INC-005 | La validación recursiva de prerrequisitos debe considerarse desde el diseño, no como un parche posterior | Modelar prerrequisitos como estructura de grafo desde el inicio |
| INC-010 | Las pruebas E2E en CI requieren configuraciones diferentes a las locales (timeouts, recursos) | Probar E2E en CI desde el primer commit |

---

*Documento elaborado por el equipo SGOHA — Sprint 5 | Julio 2026*
