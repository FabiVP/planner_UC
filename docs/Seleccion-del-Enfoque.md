# Documento de Selección del Enfoque del Proyecto

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 1.0

---

## 1. Objetivo del documento

Este documento justifica las decisiones técnicas y metodológicas adoptadas por el equipo para el desarrollo del PMV de UniScheduler, comparando alternativas y argumentando cada elección en función del contexto, las restricciones del proyecto y los objetivos del curso.

---

## 2. Selección del stack tecnológico

### 2.1 Alternativas evaluadas

| Criterio | PERN (PostgreSQL + Express + React + Node.js) | MERN (MongoDB + Express + React + Node.js) | Django + React (Python) |
|---|---|---|---|
| Lenguaje unificado | ✅ JavaScript en todo el stack | ✅ JavaScript en todo el stack | ❌ Python (backend) + JS (frontend) |
| Curva de aprendizaje | ✅ Media — visto en clase | ✅ Media — visto en clase | ❌ Alta — dos lenguajes distintos |
| Integridad referencial | ✅ Alta — foreign keys, constraints nativos | ❌ Debe validarse manualmente en el backend | ✅ Alta |
| Adecuación al problema CSP | ✅ Relaciones bien definidas entre entidades; JOINs naturales para verificar restricciones | ⚠️ Documentos anidados dificultan consultas de restricciones cruzadas | ✅ Buena, pero fuera del ecosistema JS |
| Consistencia de datos | ✅ Alta — ACID garantizado | ⚠️ Media — consistencia eventual por defecto | ✅ Alta |
| Ecosistema y comunidad | ✅ Muy amplio | ✅ Muy amplio | ✅ Amplio |
| Visto en clase | ✅ Sí | ✅ Sí | ✅ Parcialmente |

### 2.2 Decisión y justificación

**Stack seleccionado: PERN (PostgreSQL, Express.js, React, Node.js)**

El equipo eligió PostgreSQL sobre MongoDB tras evaluar las características del problema. La decisión se justifica técnicamente por:

- **Naturaleza relacional del problema:** Las entidades del sistema (cursos, docentes, estudiantes, aulas, horarios) tienen relaciones bien definidas y estables: un curso *tiene* prerrequisitos, un docente *tiene* disponibilidades, un estudiante *tiene* historial académico. Este tipo de relaciones se modelan de forma directa y eficiente en un esquema relacional.
- **Integridad referencial garantizada:** PostgreSQL aplica restricciones de integridad (foreign keys, constraints, unique) a nivel de base de datos. Por ejemplo, no es posible registrar un prerrequisito que apunte a un curso inexistente. En MongoDB esto requeriría validación manual en el backend, aumentando la probabilidad de errores.
- **Consultas de restricciones CSP más naturales:** El algoritmo CSP necesita cruzar datos entre múltiples entidades simultáneamente (por ejemplo, verificar que un docente no tenga otro curso en el mismo bloque horario). Con PostgreSQL esto es un JOIN directo; con MongoDB requeriría múltiples consultas o `$lookup` encadenados, más complejos y menos eficientes.
- **Consistencia ACID:** PostgreSQL garantiza transacciones ACID, crítico en el proceso de asignación de horarios donde múltiples operaciones deben ejecutarse de forma atómica (asignar curso + docente + aula + bloque en una sola transacción sin estados intermedios inconsistentes).
- **Uniformidad del lenguaje:** Al igual que MERN, el stack PERN mantiene JavaScript en frontend y backend (Node.js + Express), manteniendo la ventaja de un solo lenguaje en el equipo.
- **ORM Prisma:** Se utilizará Prisma como ORM, que genera tipos TypeScript automáticamente desde el esquema de base de datos, reduce errores en tiempo de desarrollo y tiene excelente integración con Node.js + PostgreSQL.

---

## 3. Selección de la metodología de gestión

### 3.1 Alternativas evaluadas

| Criterio | Scrum | Kanban | Cascada (Waterfall) |
|---|---|---|---|
| Adaptabilidad a cambios | ✅ Alta — sprints cortos permiten ajustar | ✅ Alta — flujo continuo | ❌ Baja — cambios costosos |
| Estructura para equipos pequeños | ✅ Adaptable — Scrum for Small Teams | ✅ Simple | ⚠️ Puede ser excesivo |
| Visibilidad del progreso | ✅ Alta — Sprint reviews, tablero | ✅ Alta — WIP visible | ⚠️ Media |
| Requerido por la consigna | ✅ Explícitamente indicado (Scrum) | ❌ No indicado | ❌ No indicado |
| Adecuación a requerimientos ambiguos | ✅ Alta — se refinan por sprint | ✅ Alta | ❌ Baja |

### 3.2 Decisión y justificación

**Metodología seleccionada: Scrum adaptado a equipo de 3 personas**

Scrum es la metodología indicada en la consigna. Técnicamente se justifica porque:

- El problema tiene **requerimientos ambiguos y cambiantes** (típico de un CSP donde las restricciones pueden refinarse), lo que requiere un enfoque iterativo e incremental.
- Los **sprints de 2 semanas** permiten al equipo entregar valor incremental y recibir retroalimentación del docente antes de avanzar, reduciendo el riesgo de retrabajo al final del proyecto.
- Con 3 integrantes, los roles de Scrum se adaptan: el Scrum Master también es desarrollador, y el Product Owner es el docente del curso.
- El uso de **GitHub Projects** como tablero Scrum digitaliza la gestión de tareas e integra el control de versiones con la gestión del proyecto en una sola plataforma.

---

## 4. Selección del flujo de control de versiones

### 4.1 Alternativas evaluadas

| Criterio | Trunk-Based Development | Git Flow | Feature Branch Workflow |
|---|---|---|---|
| Simplicidad | ✅ Alta — pocas ramas activas | ❌ Baja — múltiples ramas (main, develop, feature, release, hotfix) | ✅ Media |
| Adecuación a CI/CD | ✅ Excelente | ⚠️ Complejo | ✅ Buena |
| Para equipos pequeños | ✅ Ideal | ❌ Overhead innecesario para 3 personas | ✅ Adecuado |
| Velocidad de integración | ✅ Alta — integraciones frecuentes a main | ⚠️ Media — dependiente del ciclo de release | ✅ Media |

### 4.2 Decisión y justificación

**Flujo seleccionado: Trunk-Based Development**

Trunk-Based Development fue elegido por el equipo porque:

- Con 3 integrantes trabajando en funcionalidades relacionadas, mantener pocas ramas activas reduce la complejidad de gestión y los conflictos de merge.
- La integración frecuente a `main` (con ramas de feature de corta duración, máximo 2 días) permite detectar conflictos de código tempranamente.
- Se alinea con las prácticas de entrega continua (CI/CD) que el equipo puede implementar más adelante.
- Es más fácil de aprender y mantener consistentemente para un equipo con nivel básico en Git.

---

## 5. Selección del enfoque para el algoritmo CSP

### 5.1 Alternativas evaluadas

| Alternativa | Descripción | Adecuación al PMV |
|---|---|---|
| Backtracking simple | Búsqueda exhaustiva con retroceso al encontrar conflicto | ✅ Implementable por el equipo, suficiente para datos del PMV |
| Backtracking + heurísticas (MRV, LCV) | Mejora eficiencia del backtracking con ordenamiento inteligente | ✅ Extensión natural si el tiempo lo permite |
| Algoritmos genéticos | Optimización bioinspirada para problemas grandes | ❌ Alta complejidad de implementación, fuera del alcance del PMV |
| Programación con restricciones (CP-SAT, OR-Tools) | Uso de solucionadores especializados | ❌ Dependencia externa, dificulta la comprensión del algoritmo |

### 5.2 Decisión y justificación

**Algoritmo seleccionado: Backtracking con heurística MRV (Minimum Remaining Values)**

- El **backtracking simple** es la base implementable por el equipo con nivel básico, suficiente para generar horarios válidos en el contexto del PMV (datos acotados, restricciones finitas).
- La heurística **MRV** (asignar primero la variable con menor dominio disponible) reduce significativamente el espacio de búsqueda sin incrementar la complejidad de implementación de forma sustancial.
- Esta combinación permite al equipo demostrar comprensión del modelo CSP (variables, dominios, restricciones) exigido en la consigna, sin recurrir a librerías externas que oculten la lógica del algoritmo.

---

## 6. Resumen de decisiones

| Dimensión | Decisión | Justificación principal |
|---|---|---|
| Stack tecnológico | PERN | Uniformidad de lenguaje JS; integridad relacional nativa; JOINs para verificar restricciones CSP; consistencia ACID |
| Metodología de gestión | Scrum adaptado | Requerido por consigna; adecuado para requerimientos ambiguos e iterativos |
| Flujo Git | Trunk-Based Development | Simplicidad para equipo pequeño; integración frecuente; menor overhead |
| Algoritmo CSP | Backtracking + MRV | Implementable por el equipo; suficiente para el PMV; demuestra comprensión del CSP |

---

*Documento elaborado en el marco del Sprint 0 – Inicio del Proyecto.*  
*Las decisiones aquí documentadas son la línea base técnica del proyecto y requieren acuerdo del equipo para modificarse.*
