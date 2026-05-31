# Constitution.md - Principios y Restricciones del Sistema

**Proyecto:** UniScheduler  
**Fecha:** Abril 2026  
**Versión:** 1.0.0

---

## Principios del Sistema (NON-NEGOTIABLE)

### I. Validez sobre optimalidad
Primero generar un horario que cumpla **todas** las restricciones duras. La optimización (preferencias) es secundaria.

### II. Rendimiento primero
El motor CSP no debe exceder **30 segundos** para 50 cursos. Se aplica backtracking con poda MRV y Forward Checking.

### III. Trazabilidad total
Cada restricción del negocio debe estar documentada, probada y trazable desde el backlog de Jira hasta el código.

### IV. Modularidad del CSP
El motor CSP debe ser reemplazable para permitir futuras mejoras (optimización con IA/ML).

### V. Dos motores de generación
- **Institucional:** CSP con backtracking + MRV + Forward Checking para generar el horario completo de la universidad.
- **Estudiantil:** Algoritmo de matching bipartito máximo (Kuhn) para asignar cada curso del estudiante a una franja horaria del horario institucional.

### VI. Seguridad por diseño
- Autenticación JWT con expiración en 8 horas
- Contraseñas encriptadas con bcrypt (costo 10)
- Todas las rutas `/api/*` protegidas excepto `/api/login`

### VII. Calidad medible
- Cobertura de pruebas ≥ 70% (Jest)
- Code reviews obligatorios en cada Pull Request
- Commits semánticos (Conventional Commits)

---

## Reglas Globales

1. **Matrícula válida:** Todo estudiante debe matricular entre 12 y 25 créditos por semestre (rango configurable vía `InstitutionalPolicy.enrollmentRules`).
2. **Créditos reducidos:** Si el estudiante tiene más de 2 cursos desaprobados, el máximo se reduce a 18 créditos.
3. **Prerrequisitos:** Un estudiante no puede matricular un curso sin haber aprobado sus prerrequisitos.
4. **No solapamientos:**
   - Un docente no puede estar en dos cursos al mismo tiempo.
   - Un aula no puede tener dos cursos al mismo tiempo.
   - Un estudiante del mismo semestre/carrera no puede tener dos cursos superpuestos.
5. **Disponibilidad del estudiante es sugerencia:** Los slots marcados como no disponibles se usan como último recurso (fallback), generando una observación.

---

## Restricciones Duras (CSP)

| ID | Restricción | Descripción Formal | Prioridad |
|----|-------------|-------------------|-----------|
| RD-01 | Docente único por franja | `∀ c1, c2: if horario(c1) = horario(c2) then docente(c1) ≠ docente(c2)` | Alta |
| RD-02 | Aula única por franja | `∀ c1, c2: if horario(c1) = horario(c2) then aula(c1) ≠ aula(c2)` | Alta |
| RD-03 | Estudiante sin solapamiento | `∀ estudiante e del mismo semestre/carrera: horario(cursos_e) sin conflictos` | Alta |
| RD-04 | Capacidad de aula | `capacidad(aula) ≥ alumnos(curso)` | Alta |
| RD-05 | Tipo de aula compatible | `tipo_aula(curso) = tipo_aula(asignada)` | Media |
| RD-06 | Disponibilidad del docente | `horario(asignado) ⊆ disponibilidad(docente) ∪ días_libres(docente)` | Alta |
| RD-07 | Disponibilidad del aula | `horario(asignado) ⊆ disponibilidad(aula)` | Alta |
| RD-08 | Carga máxima del docente | `Σ cursos(docente) ≤ maxCursos ∧ Σ horas(docente) ≤ maxHoras` | Alta |
| RD-09 | Ventana institucional | `horario(asignado) ⊆ [startTime, endTime] ∩ activeDays` | Alta |
| RD-10 | Horas continuas del docente | `horas_continuas(docente) ≤ maxContinuous` | Media |
| RD-11 | Distribución de sesiones | `sesiones_mismo_curso_mismo_día ≤ maxPerDay` | Media |
| RD-12 | Bloques bloqueados | `horario(asignado) ∉ blockedTimeSlots (ej: almuerzo 13:00-14:00)` | Alta |
| RD-13 | Preferencia de turno PH | `docente(por_horas) solo asignado en su turno preferido` | Alta |
| RD-14 | Límite de créditos | `minCredits ≤ Σ créditos(matricula(e)) ≤ maxCredits (default: 12-25)` | Alta |

---

## Restricciones Blandas (Optimización)

| ID | Restricción | Función de Costo | Prioridad |
|----|-------------|------------------|-----------|
| RS-01 | Preferencias de horario docente | Minimizar conflictos con franjas preferidas del docente | Media |
| RS-02 | Sin huecos largos | Penalizar huecos >2h entre clases del mismo docente | Baja |
| RS-03 | Días compactos | Preferir horarios que concentren clases en menos días | Baja |
| RS-04 | Equidad en shuffle | Aleatorización con semilla temporal para distribuir carga entre ejecuciones | Baja |

---

## Gobernanza

- **Modificaciones:** Cualquier cambio a este constitution requiere aprobación del equipo completo y documentación en acta.
- **Cumplimiento:** El plan de implementación (`plan.md`) debe verificar alineación con estos principios.
- **Excepciones:** Cualquier desviación debe justificarse en la sección "Complexity Tracking" del plan.

---

**Elaborado por:** Equipo UniScheduler  
**Fecha:** Abril 2026  
**Estado:** Aprobado