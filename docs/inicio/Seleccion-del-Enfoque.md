# Documento de Selección del Enfoque del Proyecto
**Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Institución:** Universidad Continental  
**Versión:** 1.0.0  
**Fecha:** Abril 2026

---

## 1. Introducción

Este documento presenta la justificación técnica del enfoque metodológico y tecnológico seleccionado por el equipo para el desarrollo del Proyecto de Fin de Asignatura (PFA). Las decisiones tomadas están fundamentadas en el análisis del problema, las restricciones reales identificadas y los lineamientos establecidos por la consigna del curso.

---

## 2. Análisis del Contexto del Problema

El sistema a desarrollar aborda un **problema complejo de ingeniería de software**: la generación automática de horarios académicos en universidades con currículo flexible. Este problema presenta:

- Alta variabilidad en la matrícula estudiantil.
- Múltiples restricciones interdependientes (prerrequisitos, créditos, aulas, disponibilidad).
- Ausencia de una solución única o trivial.
- Necesidad de optimización combinatoria (CSP).

Dado este contexto, el enfoque debe ser **iterativo e incremental**, capaz de adaptarse a requerimientos cambiantes y permitir entregas funcionales tempranas.

---
## 2. Análisis del Contexto del Problema y Justificación de Complejidad

El sistema a desarrollar aborda un **problema de complejidad computacional NP-difícil** (equivalente al problema de *Graph Coloring* o *Job-Shop Scheduling*). Esta característica lo diferencia fundamentalmente de un sistema CRUD o de una aplicación de gestión convencional por las siguientes razones:

### 2.1. Explosión combinatoria del espacio de búsqueda
Para una entrada modesta de `n=50` cursos, `m=20` docentes, `p=15` aulas y `t=30` franjas horarias (lunes a sábado × 5 turnos), el espacio de soluciones posibles es `(m × p × t)^n`, un número astronómico (>10^50). **La fuerza bruta es inviable**. Se requiere un algoritmo de Satisfacción de Restricciones (CSP) con heurísticas de poda.

### 2.2. Múltiples restricciones interdependientes y en conflicto
- **Restricciones duras (hard):** RD-01 a RD-06 (ver documento D). Cualquier violación invalida el horario.
- **Restricciones blandas (soft):** Preferencias de docentes, horarios compactos para estudiantes.
- **Conflicto:** Minimizar días de clase para estudiantes vs. Maximizar uso de aulas. No existe solución óptima única, sino **soluciones Pareto-óptimas**.

### 2.3. Incertidumbre y variabilidad propias del currículo flexible
A diferencia de sistemas rígidos (ej. colegios con horarios fijos por grado), aquí:
- Cada estudiante tiene un subconjunto único de cursos aprobados (prerrequisitos).
- La matrícula cambia completamente cada semestre.
- El sistema no puede precalcular nada; debe **generar el horario desde cero** en cada ejecución.

### 2.4. Necesidad de técnicas avanzadas de inteligencia artificial
El motor CSP debe implementar al menos:
- **Backtracking** con ordenamiento dinámico de variables.
- **Heurística MRV** (Minimum Remaining Values) para elegir el curso más restringido primero.
- **Forward checking** para propagar restricciones y podar dominios anticipadamente.
- **Manejo de timeout** para devolver la mejor solución parcial si se agota el tiempo.

**Conclusión:** Este problema NO es resoluble con consultas SQL simples o lógica secuencial. Requiere un motor de optimización combinatoria, justificando el uso de algoritmos CSP en el núcleo del sistema.


## 3. Selección del Enfoque Metodológico

### 3.1. Alternativas evaluadas

| Criterio | Cascada (Waterfall) | RUP (Rational Unified Process) | **Scrum (Seleccionado)** |
|---|---|---|---|
| Adaptabilidad a cambios | Baja | Media | **Alta** |
| Entregas incrementales | No | Parcial | **Sí** |
| Adecuación a equipos pequeños | Baja | Baja | **Alta** |
| Gestión de riesgos temprana | No | Sí | **Sí** |
| Retroalimentación continua | No | Parcial | **Sí** |
| Complejidad de implementación | Baja | Alta | **Media** |

### 3.2. Enfoque seleccionado: **Scrum**

Scrum es el marco ágil elegido porque:

1. **Adaptabilidad:** Los requerimientos de un sistema de horarios son parcialmente definidos y sujetos a cambios durante el desarrollo.
2. **Entregas incrementales:** Permite construir el sistema por funcionalidades verificables en cada Sprint.
3. **Visibilidad:** Los sprints cortos permiten al equipo revisar el avance y al docente evaluar el progreso.
4. **Gestión de riesgos:** Las retrospectivas y revisiones de Sprint permiten identificar y mitigar riesgos de forma temprana.
5. **Alineación con la consigna:** La consigna del PFA está estructurada por Sprints (Sprint 0, Sprint 1, etc.), lo que exige explícitamente un enfoque Scrum.

**Estructura de Sprints propuesta:**

| Sprint | Duración | Objetivo |
|---|---|---|
| Sprint 0 | 2 semanas | Inicio del proyecto, documentación base, repositorio |
| Sprint 1 | 2 semanas | Registro de entidades (usuarios, cursos, aulas) |
| Sprint 2 | 2 semanas | Validación de matrícula y prerrequisitos |
| Sprint 3 | 3 semanas | Motor de generación de horarios (CSP) |
| Sprint 4 | 2 semanas | Visualización y ajustes finales |
| Sprint 5 | 1 semana | Pruebas, documentación final y cierre |

---

## 4. Selección del Stack Tecnológico

### 4.1. Alternativas evaluadas

| Criterio | MEAN Stack | Django + React | **MERN Stack (Seleccionado)** |
|---|---|---|---|
| Lenguaje unificado | Sí (JS) | No (Python + JS) | **Sí (JS/TS)** |
| Flexibilidad de esquema | Media | Baja | **Alta (MongoDB)** |
| Ecosistema y comunidad | Alta | Alta | **Alta** |
| Curva de aprendizaje del equipo | Media | Alta | **Baja** |
| Compatibilidad con SPA + API REST | Sí | Sí | **Sí** |
| Alineación con la consigna | Sí | Parcial | **Sí (explícito en consigna)** |

### 4.2. Stack seleccionado: **MERN**

El stack MERN está **explícitamente requerido en la consigna del repositorio** (sección 2) y es técnicamente adecuado por las siguientes razones:

| Tecnología | Rol | Justificación |
|---|---|---|
| **MongoDB** | Base de datos NoSQL | Flexibilidad de esquema para estructuras de horarios variables; escalabilidad horizontal |
| **Express.js** | Framework de backend | Ligero, robusto para construir APIs REST; amplio ecosistema |
| **React.js** | Frontend (SPA) | Permite construir interfaces reactivas; ideal para visualización dinámica de horarios |
| **Node.js** | Entorno de ejecución | JavaScript en el servidor; eficiente para operaciones I/O asíncronas |

### 4.3. Arquitectura seleccionada: **SPA + API REST**

La arquitectura SPA (Single Page Application) en el frontend desacoplada de una API REST en el backend garantiza:

- **Separación de responsabilidades** (frontend/backend independientes).
- **Escalabilidad:** Cada capa puede escalar de forma independiente.
- **Mantenibilidad:** Cambios en la UI no afectan la lógica de negocio.
- **Compatibilidad con estándares:** W3C, ISO/IEC 25010, OWASP Top 10.

---

## 5. Estándares Aplicados

| Estándar | Aplicación |
|---|---|
| **W3C** | Accesibilidad y semántica del frontend |
| **ISO/IEC 25010** | Atributos de calidad: rendimiento, seguridad, mantenibilidad, usabilidad |
| **OWASP Top 10** | Seguridad de la API REST (autenticación, validación de entradas, protección XSS/SQL) |
| **WCAG 2.1** | Accesibilidad web (contraste, navegación por teclado) |
| **Green Software** | Eficiencia computacional en el motor de generación de horarios |
| **Versionado Semántico** | Control de versiones: MAJOR.MINOR.PATCH (v1.0.0 para el PMV) |

---

## 6. Justificación de Decisiones Clave

| Decisión | Alternativa descartada | Razón de la elección |
|---|---|---|
| MongoDB sobre PostgreSQL | PostgreSQL (relacional) | La variabilidad de los esquemas de horarios y la naturaleza dinámica del currículo flexible se adaptan mejor a un esquema NoSQL |
| React sobre Angular | Angular | Menor curva de aprendizaje para el equipo; mayor flexibilidad para prototipar la UI de horarios |
| Git Flow sobre Trunk-Based | Trunk-Based | Git Flow permite gestionar mejor las ramas de features, releases y hotfixes en un equipo académico con entregas por Sprint |
| Scrum sobre Kanban | Kanban | La estructura de Sprints con entregables definidos está alineada con la evaluación del curso |

---

## 7. Conclusión

El enfoque seleccionado — **Scrum como metodología + MERN Stack como tecnología + SPA + API REST como arquitectura** — es coherente con:

- Los lineamientos explícitos de la consigna del PFA.
- Las restricciones del equipo (académicas, técnicas y temporales).
- La naturaleza compleja del problema (optimización combinatoria con múltiples actores).
- Los estándares de calidad de software exigidos (ISO/IEC 25010, OWASP, W3C, WCAG).

Esta base sólida permitirá desarrollar un PMV funcional, mantenible y escalable dentro del período académico de 12 semanas.

---

*Documento elaborado por el equipo del PFA — Sprint 0 | Universidad Continental | Abril 2026*
