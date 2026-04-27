# Acta de Constitución del Proyecto

## 1. Información General

**Nombre del Proyecto:** UniScheduler
**Siglas:** UniScheduler

| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
|:---:|:---|:---|:---|:---:|:---|
| 1.0 | Chavez Apaza Marcos (Sprint 0) | -------| ------ | Abril 2026 | Creación Inicial del Proyecto |

---

## 2. Definición del Proyecto

### Descripción

**Qué:** SGOHA es una aplicación web moderna (SPA + API REST) que automatiza la generación de horarios académicos en universidades con currículo flexible, utilizando un motor basado en algoritmos de satisfacción de restricciones (CSP).

**Quién:** El sistema está dirigido a coordinadores académicos (usuarios principales), estudiantes y docentes de universidades con planes de estudio flexibles.

**Cómo:** Mediante el stack tecnológico MERN (MongoDB, Express.js, React.js, Node.js), implementando un algoritmo de backtracking con heurísticas MRV y forward checking para resolver el problema combinatorio de generación de horarios.

**Cuándo:** El proyecto se desarrolla durante el ciclo académico Abril - Julio 2026 (12 semanas), con entregas incrementales por Sprint.

**Dónde:** El proyecto se ejecuta en entorno académico (Universidad Continental), con trabajo remoto y despliegue en servicios cloud gratuitos (MongoDB Atlas, Render, Vercel).

### Finalidad y Justificación

**Propósito:** Reducir el tiempo de planificación de horarios de días a minutos, eliminando conflictos de asignación (solapamientos de docentes, aulas o estudiantes) y garantizando el cumplimiento de restricciones académicas (prerrequisitos, créditos 20-22, disponibilidad).

**Justificación Cuantitativa:**
- Reducción del tiempo de elaboración de horarios: de 5-7 días a menos de 30 segundos.
- Eliminación del 100% de conflictos de asignación.
- Validación automática de prerrequisitos y carga crediticia.

**Justificación Cualitativa:**
- No existe una solución automatizada accesible en el contexto universitario.
- La planificación manual no garantiza optimización ni consistencia.
- El currículo flexible introduce una complejidad que excede las capacidades de herramientas genéricas como Excel.

### Definición del Producto

**Producto Mínimo Viable (PMV v1.0.0):**
- Módulo de registro y gestión de entidades (estudiantes, docentes, cursos, aulas).
- Módulo de validación de matrícula (créditos 20-22, verificación de prerrequisitos).
- Motor de generación automática de horarios mediante algoritmo CSP.
- Módulo de visualización de horarios generados (grilla semanal interactiva).
- Autenticación y autorización básica por roles (coordinador, estudiante, docente).

**Queda fuera del alcance (futuras versiones):**
- Integración con sistemas ERP universitarios.
- Módulo de reportes estadísticos avanzados.
- Notificaciones automáticas por correo o SMS.
- Aplicación móvil nativa.

---

## 3. Objetivos y Criterios de Éxito

| Concepto | Objetivos | Criterio de Éxito |
|:---|:---|:---|
| **1. Alcance** | Implementar un sistema funcional con las 4 funcionalidades core (registro, validación, generación CSP, visualización) | El sistema genera horarios válidos sin conflictos para un escenario de prueba de 50 cursos y 100 estudiantes |
| **2. Tiempo** | Completar el PMV en 12 semanas (Abril - Julio 2026), siguiendo el cronograma de 5 Sprints | Todos los entregables planificados se completan dentro de los plazos establecidos por Sprint |
| **3. Costo** | Desarrollar el proyecto con herramientas y servicios gratuitos (tier gratuito) | Costo total del proyecto: S/6,210.40 (simulado, incluye contingencia del 12%) - Sin desembolsos reales por ser proyecto académico |
| **4. Calidad** | Alcanzar cobertura de pruebas ≥ 70% (unitarias e integración) | Informe de cobertura muestra ≥70% de líneas y funciones probadas |
| **5. Satisfacción** | El coordinador puede generar un horario completo sin asistencia técnica | Video demostrativo de ≤5 minutos muestra el flujo completo sin errores |

---

## 4. Designación de Roles Clave

| Rol | Responsable | Asignación |
|:---|:---|:---|
| **Patrocinador (Sponsor)** | Universidad Continental – Facultad de Ingeniería | Autoriza el proyecto en el contexto académico |
| **Cliente / Beneficiario** | Coordinadores académicos, estudiantes y docentes | Usuarios finales del sistema |
| **Gerente de Proyecto (PM)** | Scrum Master (equipo SGOHA) | Facilita ceremonias Scrum, elimina impedimentos, gestiona el tablero |
| **Product Owner** | Integrante del equipo (rol secundario) | Mantiene y prioriza el Product Backlog, valida incrementos |
| **Dev Lead (Backend)** | Integrante del equipo (rol principal) | Lidera diseño de API REST, arquitectura MongoDB, code reviews |
| **Frontend Developer** | Integrante del equipo (rol principal) | Desarrolla UI React, visualización de horarios |
| **Backend Dev / CSP** | Integrante del equipo (rol principal) | Implementa motor CSP (backtracking, MRV, forward checking) |

---

## 5. Cronograma de Hitos Tentativo

| Hito o Evento Significativo | Fecha Programada / Duración | Sprint |
|:---|:---|:---:|
| Sprint 0: Inicio del proyecto, documentación base, repositorio | Semana 1-2 (Abril 2026) | Sprint 0 |
| Sprint 1: Registro de entidades (CRUD + autenticación) | Semana 3-4 (Abril-Mayo 2026) | Sprint 1 |
| Sprint 2: Validación de matrícula (prerrequisitos, créditos) | Semana 5-6 (Mayo 2026) | Sprint 2 |
| Sprint 3: Motor de generación de horarios (CSP) | Semana 7-9 (Mayo-Junio 2026) | Sprint 3 |
| Sprint 4: Visualización de horarios y pruebas | Semana 10-11 (Junio 2026) | Sprint 4 |
| Sprint 5: Cierre, documentación final y video demostrativo | Semana 12 (Julio 2026) | Sprint 5 |
| **Fecha de entrega final** | **Julio 2026** | - |

---

## 6. Presupuesto Preliminar

| Concepto | Monto ($) | Observación |
|:---|:---:|:---|
| Sprint 0: Inicio y Planificación | 665.00 | Documentación, análisis, configuración |
| Sprint 1: Gestión de Entidades | 840.00 | CRUD, autenticación, frontend básico |
| Sprint 2: Validación de Matrícula | 672.00 | Prerrequisitos, créditos, selector de cursos |
| Sprint 3: Motor CSP | 1,260.00 | Backtracking, MRV, forward checking, restricciones |
| Sprint 4: Visualización y Pruebas | 755.00 | Grilla interactiva, integración, pruebas |
| Sprint 5: Cierre y Documentación | 510.00 | Documentación final, README, video demo |
| Gestión continua del proyecto | 843.00 | Daily Scrum, code reviews, actas |
| **Subtotal** | **5,545.00** | - |
| Contingencia (12%) | 665.40 | Riesgos: complejidad CSP, integración, ajustes |
| **TOTAL ESTIMADO** | **6,210.40** | Proyecto académico - Costos simulados (sin desembolsos reales) |

**Nota:** El proyecto opera con herramientas y servicios gratuitos (MongoDB Atlas Free, Render, Vercel, GitHub Free). Los montos son referenciales para cumplir con los lineamientos de gestión de proyectos (PMBOK).

---

## 7. Aprobaciones

| Rol | Nombre | Firma | Fecha |
|:---|:---|:---|:---:|
| Scrum Master | [Nombre del integrante] | _____________ | Abril 2026 |
| Product Owner | [Nombre del integrante] | _____________ | Abril 2026 |
| Dev Lead | [Nombre del integrante] | _____________ | Abril 2026 |
| Docente evaluador | [Nombre del docente] | _____________ | Abril 2026 |

---

**Elaborado por:** ChavezApazaMarcos - Sprint 0 
**Fecha:** Abril 2026  
**Estado:** Aprobado (consistente con `B_vision_del_proyecto.md`, `C_project_charter.md`, `A_enfoque_del_proyecto.md`)
