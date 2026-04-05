# Declaración de la Visión del Proyecto

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 1.0

---

## 1. Enunciado de la visión

> *Para los **coordinadores académicos** y **estudiantes** de universidades con currículo flexible, que enfrentan dificultades en la planificación y gestión de horarios académicos, **UniScheduler** es una aplicación web que **genera automáticamente horarios válidos y optimizados**, considerando restricciones de créditos, prerrequisitos, disponibilidad de docentes y capacidad de aulas. A diferencia de los procesos manuales o sistemas genéricos, nuestra solución aplica un enfoque de **Problema de Satisfacción de Restricciones (CSP)** adaptado al contexto universitario peruano, garantizando resultados sin conflictos y con visualización clara para todos los actores involucrados.*

---

## 2. Problema central

Las universidades con currículo flexible enfrentan una planificación de horarios altamente compleja debido a la variabilidad en la matrícula estudiantil, la interdependencia de restricciones académicas y la limitación de recursos físicos (aulas, horarios). Este proceso, cuando se realiza de forma manual o con herramientas no especializadas, genera:

- Conflictos de horarios entre docentes, estudiantes y aulas.
- Incumplimiento de restricciones de prerrequisitos y límites de créditos.
- Ineficiencia operativa y carga administrativa elevada para los coordinadores.
- Insatisfacción estudiantil por disponibilidad limitada o desorganizada de cursos.

---

## 3. Propuesta de valor

UniScheduler aporta valor al:

1. **Automatizar** la generación de horarios respetando todas las restricciones definidas.
2. **Validar** matrícula en tiempo real (créditos entre 12 y 25, prerrequisitos cumplidos).
3. **Visualizar** los horarios generados de forma clara mediante un grid semanal interactivo.
4. **Detectar y alertar** sobre conflictos antes de que impacten a los usuarios.
5. **Reducir** el tiempo y esfuerzo del proceso de planificación académica.

---

## 4. Alcance del PMV (v1.0.0)

El Producto Mínimo Viable contempla:

- Registro y gestión de entidades base: estudiantes, docentes, cursos y aulas.
- Validación de reglas de matrícula (créditos 12–25, prerrequisitos).
- Algoritmo CSP básico de generación automática de horarios sin conflictos.
- Visualización de horarios generados en vista semanal.
- Panel de administración para coordinadores académicos.
- Autenticación con roles diferenciados (administrador, coordinador, docente, estudiante).

**Fuera del alcance del PMV:**
- Integración con sistemas externos (SGA, Intranet universitaria).
- Optimización multiobjetivo avanzada (más allá de satisfacción de restricciones básicas).
- Módulo de reportes estadísticos avanzados.
- Aplicación móvil nativa.

---

## 5. Criterios de éxito medibles

| Criterio | Métrica |
|---|---|
| El sistema genera horarios sin conflictos | 0 solapamientos en los horarios generados |
| Validación de matrícula funcional | 100% de reglas de créditos y prerrequisitos verificadas |
| Tiempo de generación aceptable | Generación de horario completo en menos de 10 segundos |
| Usabilidad básica | El coordinador puede generar un horario sin asistencia técnica |
| Cobertura de pruebas | ≥ 70% de cobertura en módulos críticos |

---

## 6. Stakeholders principales

| Actor | Rol en el sistema | Interés principal |
|---|---|---|
| Estudiante | Usuario final | Visualizar su horario válido y sin conflictos |
| Docente | Usuario final | Consultar su disponibilidad asignada |
| Coordinador académico | Usuario principal | Generar y gestionar horarios del período |
| Administrador del sistema | Gestor técnico | Mantener y configurar el sistema |

---

*Documento elaborado en el marco del Sprint 0 – Inicio del Proyecto.*  
*Sujeto a revisión al cierre del Sprint 0.*
