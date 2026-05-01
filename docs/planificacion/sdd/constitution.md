# Constitution.md - Principios y Restricciones del Sistema

**Proyecto:** UniScheduler  
**Fecha:** Abril 2026  
**Versión:** 1.0.0

---

## Principios del Sistema (NON-NEGOTIABLE)

### I. Validez sobre optimalidad
Primero generar un horario que cumpla **todas** las restricciones duras. La optimización (preferencias) es secundaria.

### II. Rendimiento primero
El motor CSP no debe exceder **30 segundos** para 50 cursos. Se aplicará backtracking con poda MRV y Forward Checking.

### III. Trazabilidad total
Cada restricción del negocio debe estar documentada, probada y trazable desde el backlog de Jira hasta el código.

### IV. Modularidad del CSP
El motor CSP debe ser reemplazable para permitir futuras mejoras (optimización con IA/ML).

### V. Seguridad por diseño
- Autenticación JWT con expiración en 8 horas
- Contraseñas encriptadas con bcrypt (costo 10)
- Todas las rutas `/api/*` protegidas excepto `/api/login`

### VI. Calidad medible
- Cobertura de pruebas ≥ 70% (Jest)
- Code reviews obligatorios en cada Pull Request
- Commits semánticos (Conventional Commits)

---

## Reglas Globales

1. **Matrícula válida:** Todo estudiante debe matricular entre 20 y 22 créditos por semestre.
2. **Prerrequisitos:** Un estudiante no puede matricular un curso sin haber aprobado sus prerrequisitos.
3. **No solapamientos:**
   - Un docente no puede estar en dos cursos al mismo tiempo.
   - Un aula no puede tener dos cursos al mismo tiempo.
   - Un estudiante no puede tener dos cursos superpuestos.

---

## Restricciones Duras (CSP)

| ID | Restricción | Descripción Formal | Prioridad |
|----|-------------|-------------------|-----------|
| RD-01 | Docente único por franja | `∀ c1, c2: if horario(c1) = horario(c2) then docente(c1) ≠ docente(c2)` | Alta |
| RD-02 | Aula única por franja | `∀ c1, c2: if horario(c1) = horario(c2) then aula(c1) ≠ aula(c2)` | Alta |
| RD-03 | Estudiante sin solapamiento | `∀ estudiante e: horario(cursos_e) sin conflictos` | Alta |
| RD-04 | Límite de créditos | `20 ≤ Σ créditos(matricula(e)) ≤ 22` | Alta |
| RD-05 | Prerrequisitos | `∀ curso en matricula(e): prerrequisitos aprobados` | Alta |
| RD-06 | Tipo de aula compatible | `tipo_aula(curso) = tipo_aula(asignada)` | Media |

---

## Restricciones Blandas (Optimización)

| ID | Restricción | Función de Costo | Prioridad |
|----|-------------|------------------|-----------|
| RS-01 | Preferencias de horario | Minimizar conflictos con franjas preferidas | Baja |

---

## Gobernanza

- **Modificaciones:** Cualquier cambio a este constitution requiere aprobación del equipo completo y documentación en acta.
- **Cumplimiento:** El plan de implementación (`plan.md`) debe verificar alineación con estos principios.
- **Excepciones:** Cualquier desviación debe justificarse en la sección "Complexity Tracking" del plan.

---

**Elaborado por:** Equipo UniScheduler  
**Fecha:** Abril 2026  
**Estado:** Aprobado