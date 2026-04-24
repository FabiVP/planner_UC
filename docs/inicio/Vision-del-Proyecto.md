# Declaración de la Visión del Proyecto
**Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Institución:** Universidad Continental  
**Versión:** 1.0.0  
**Fecha:** Abril 2026

---

## 1. Enunciado de la Visión

> **"Desarrollar una aplicación web inteligente, basada en el stack MERN, que automatice la generación de horarios académicos válidos y óptimos en universidades con currículo flexible, reduciendo el tiempo de planificación y eliminando conflictos de asignación, para beneficio de estudiantes, docentes y coordinadores académicos."**

---

## 2. Declaración FOR (Plantilla de Visión)

| Campo | Descripción |
|---|---|
| **PARA** | Coordinadores académicos, estudiantes y docentes de universidades con currículo flexible |
| **QUIENES** | Enfrentan dificultades significativas en la planificación manual de horarios debido a la alta variabilidad de la matrícula, restricciones académicas y limitaciones de recursos |
| **EL** | Sistema de Generación Óptima de Horarios Académicos (SGOHA) |
| **ES** | Una aplicación web moderna (SPA + API REST) con motor de generación automática de horarios basado en algoritmos de satisfacción de restricciones (CSP) |
| **QUE** | Genera horarios académicos válidos, libres de conflictos y optimizados según restricciones reales (créditos, prerrequisitos, disponibilidad de docentes, aulas e infraestructura) |
| **A DIFERENCIA DE** | La planificación manual en hojas de cálculo o sistemas rígidos que no consideran la flexibilidad curricular ni la optimización simultánea de múltiples restricciones |
| **NUESTRO PRODUCTO** | Ofrece una solución automatizada, accesible desde el navegador, con visualización intuitiva de horarios, validación en tiempo real y generación optimizada en segundos |

---

## 3. Propuesta de Valor

El sistema aporta valor medible en tres dimensiones:

### 3.1. Valor para los Coordinadores Académicos
- Reducción del tiempo de elaboración de horarios de días a minutos.
- Eliminación de conflictos de asignación (solapamiento de aulas, docentes o estudiantes).
- Trazabilidad y registro de decisiones de planificación.

### 3.2. Valor para los Estudiantes
- Horarios coherentes con sus prerrequisitos aprobados y límite de créditos (20–22).
- Acceso a visualización clara de su horario generado.
- Equidad en la asignación de franjas horarias.

### 3.3. Valor para los Docentes
- Asignación de cursos respetando su disponibilidad horaria declarada.
- Reducción de conflictos con otras asignaciones.

---

## 4. Alcance del Producto Mínimo Viable (PMV v1.0.0)

### Incluido en el PMV:
- Registro y gestión de estudiantes, docentes, cursos y aulas.
- Validación de matrícula (créditos y prerrequisitos).
- Motor de generación automática de horarios (algoritmo CSP).
- Visualización de horarios generados en formato de grilla semanal.
- Autenticación básica de usuarios por rol.

### Excluido del PMV (futuras versiones):
- Integración con sistemas ERP universitarios existentes.
- Notificaciones por correo electrónico.
- Módulo de reportes avanzados y estadísticas.
- App móvil nativa.
- Optimización multiobjetivo con IA/ML.

---

## 5. Criterios de Éxito Medibles

| Criterio | Métrica de Éxito |
|---|---|
| Generación de horarios | El sistema genera un horario válido en menos de 30 segundos para un escenario de 50 cursos |
| Ausencia de conflictos | 0 solapamientos de docente, aula o estudiante en el horario generado |
| Cobertura de restricciones | El sistema valida correctamente las 6 restricciones definidas en la consigna |
| Usabilidad | El coordinador puede generar un horario completo sin asistencia técnica |
| Calidad del código | Cobertura de pruebas ≥ 70% (unitarias e integración) |

---

## 6. Alineación con los Objetivos del Curso

Esta visión está directamente alineada con el propósito de aprendizaje del curso:

- **Análisis y estructuración** de un problema complejo de ingeniería de software. ✓
- **Uso de Scrum, GitHub y técnicas de levantamiento de requerimientos.** ✓
- **Aplicación de principios de análisis de sistemas y gestión de proyectos.** ✓
- **Desarrollo de una aplicación web moderna con base sólida y justificable.** ✓

---

*Documento elaborado por el equipo del PFA — Sprint 0 | Universidad Continental | Abril 2026*
