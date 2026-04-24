# Declaración del Equipo del Proyecto

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Universidad:** Universidad Continental  
**Fecha:** Marzo 2026  
**Versión:** 1.0

---

## 1. Integrantes y roles

El equipo aplica Scrum adaptado a un equipo pequeño de 3 personas, por lo que algunos roles son compartidos. Todos los integrantes participan activamente en el desarrollo técnico.

| Integrante | Rol principal | Responsabilidades clave |
|---|---|---|
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend  | Facilitar ceremonias Scrum, gestionar el tablero, desarrollar modelos y controladores Node.js/Express, configurar MongoDB |
| Chavez Apaza Marcos Alberto | Frontend / UI-UX | Desarrollar componentes React, implementar el grid de horarios, asegurar usabilidad y diseño responsivo |
| Baldeon Martinez David | Algoritmo CSP / QA | Implementar el algoritmo de generación de horarios, desarrollar pruebas unitarias e integración, documentar decisiones técnicas |

> **Nota:** Los roles de Product Owner son ejercidos por el docente del curso. Los tres integrantes participan en todas las capas del stack (full-stack) aunque cada uno tenga un área de liderazgo.

---

## 2. Definición de Roles y Responsabilidades

### 2.1. Scrum Master

**Responsabilidades:**
- Facilitar las ceremonias Scrum: Sprint Planning, Daily Standup, Sprint Review y Sprint Retrospective.
- Eliminar impedimentos que bloqueen el avance del equipo.
- Asegurar que el equipo siga las prácticas y valores de Scrum.
- Mantener actualizado el tablero de tareas (GitHub Projects / Trello).
- Registrar actas de reuniones y decisiones del equipo.
- Coordinar la entrega de documentos al docente en las fechas establecidas.

**Entregables a su cargo:** Actas de reuniones, tablero Scrum actualizado, registro de impedimentos.

### 2.2. Product Owner

**Responsabilidades:**
- Representar la visión del producto y los intereses de los stakeholders.
- Mantener y priorizar el Product Backlog.
- Redactar y refinar las User Stories con criterios de aceptación claros.
- Validar que los incrementos de cada Sprint cumplen los criterios de aceptación.
- Tomar decisiones sobre el alcance cuando hay conflictos de prioridades.

**Entregables a su cargo:** Product Backlog, User Stories, criterios de aceptación, declaración de visión.

### 2.3. Dev Lead (Backend)

**Responsabilidades:**
- Liderar el diseño y desarrollo de la API REST (Node.js + Express.js).
- Definir la arquitectura de base de datos (MongoDB).
- Implementar el motor de generación de horarios (algoritmo CSP).
- Revisar el código del equipo mediante Pull Requests.
- Definir y documentar los contratos de la API (endpoints, payloads).
- Implementar las medidas de seguridad (JWT, bcrypt, validación de inputs).

**Entregables a su cargo:** API REST funcional, modelo de datos, documentación de endpoints.

### 2.4. Frontend Developer

**Responsabilidades:**
- Desarrollar la interfaz de usuario con React.js siguiendo principios SPA.
- Implementar la visualización de horarios (grilla semanal interactiva).
- Asegurar el cumplimiento de estándares W3C y WCAG 2.1.
- Integrar el frontend con la API REST del backend.
- Implementar el diseño responsivo y la experiencia de usuario (UX).

**Entregables a su cargo:** Aplicación React funcional, componentes UI, integración frontend–backend.

### 2.5. Backend Developer / Especialista en Algoritmos

**Responsabilidades:**
- Apoyar el desarrollo del backend (rutas, controladores, modelos).
- Investigar e implementar el algoritmo de satisfacción de restricciones (CSP).
- Desarrollar los módulos de validación de matrícula y prerrequisitos.
- Escribir pruebas unitarias para los módulos del backend.
- Documentar las decisiones técnicas sobre el modelado del CSP.

**Entregables a su cargo:** Módulos de validación, implementación del CSP, pruebas unitarias backend.

---

## 3. Matriz RACI

| Entregable / Actividad | Scrum Master | Product Owner | Dev Lead | Frontend Dev | Backend Dev |
|---|---|---|---|---|---|
| Ceremonias Scrum | **R/A** | C | C | C | C |
| Product Backlog | C | **R/A** | I | I | I |
| Documentación PMBOK | **R/A** | C | C | C | C |
| Diseño de arquitectura | I | C | **R/A** | C | C |
| API REST (backend) | I | C | **R/A** | C | R |
| Motor CSP | I | C | C | I | **R/A** |
| Frontend React | I | C | C | **R/A** | I |
| Pruebas (testing) | C | I | C | C | **R/A** |
| Revisión de PR (code review) | I | I | **R/A** | C | C |
| README y docs técnicas | C | C | C | C | **R/A** |
| Video demostrativo | **R/A** | C | C | C | C |

*R = Responsable, A = Aprobador, C = Consultado, I = Informado*

---

## 4. Normas de Trabajo del Equipo

### 4.1. Comunicación

- **Canal principal:** WhatsApp.
- **Reuniones síncronas:** Mínimo 2 por semana (Daily Scrum y sesión de trabajo).
- **Daily Scrum:** Máximo 15 minutos, cada integrante responde: ¿Qué hice ayer? ¿Qué haré hoy? ¿Tengo algún impedimento?
- **Tiempo máximo de respuesta** a mensajes del equipo: 4 horas en horario hábil.
- **Decisiones importantes** deben quedar registradas en las actas del equipo.

### 4.2. Gestión del Repositorio GitHub

- **Rama principal:** `main` (solo código estable y probado).
- **Rama de desarrollo:** `develop` (integración de features).
- **Ramas de features:** `feature/nombre-de-la-funcionalidad` (una por historia de usuario).
- **Flujo de trabajo:** Git Flow.
- **Convención de commits:** Commits semánticos según Conventional Commits:
  - `feat:` para nuevas funcionalidades.
  - `fix:` para corrección de errores.
  - `docs:` para cambios en documentación.
  - `test:` para adición de pruebas.
  - `refactor:` para refactorización de código.
- **Pull Requests:** Todo código debe pasar por un PR con al menos 1 aprobación antes de fusionarse a `develop`.
- **Code Reviews:** Obligatorios para todos los PRs; tiempo máximo de revisión: 24 horas.

### 4.3. Estándares de Código

- **Linter:** ESLint con configuración Airbnb.
- **Formato:** Prettier.
- **Nombres de variables:** camelCase para variables/funciones; PascalCase para componentes y clases.
- **Comentarios:** Funciones complejas deben incluir JSDoc.
- **Idioma del código:** inglés (variables, funciones, comentarios técnicos).
- **Idioma de la documentación:** español.

### 4.4. Gestión de Tareas

- **Herramienta:** GitHub Projects (tablero Kanban con columnas: Backlog, To Do, In Progress, In Review, Done).
- **Estimación:** Planning Poker (unidades: Story Points en escala Fibonacci).
- **Velocidad mínima esperada:** 20 Story Points por Sprint.

### 4.5. Resolución de Conflictos

- Los conflictos técnicos se resuelven por consenso del equipo.
- Si no hay consenso en 15 minutos, el Dev Lead tiene voto de calidad en temas técnicos.
- Los conflictos de alcance los resuelve el Product Owner.
- Los conflictos interpersonales se escalan al Scrum Master; si persisten, al docente.

### 4.6. Responsabilidad y Compromisos

- Cada integrante se compromete a:
  - Cumplir con las tareas asignadas en el Sprint dentro de los plazos acordados.
  - Informar al equipo con anticipación si no puede cumplir un compromiso.
  - Participar activamente en todas las ceremonias Scrum.
  - Contribuir a la documentación de su área de responsabilidad.
  - Respetar las normas de código y repositorio establecidas.

---

## 5. Horario de Trabajo del Equipo

| Día | Horario | Actividad |
|---|---|---|
| Lunes | 7:00 pm – 8:00 pm | Daily Scrum síncrono |
| Miércoles | 7:00 pm – 9:00 pm | Sesión de desarrollo colaborativo |
| Viernes | 7:00 pm – 8:30 pm | Sprint Review / Retrospectiva (cuando aplique) |
| Fines de semana | Flexible (coordinado) | Trabajo individual o en parejas |

---

## 6. Firmas de compromiso
Al firmar este documento, cada integrante acepta y se compromete a cumplir con los roles, responsabilidades y normas establecidas en este documento.
| Integrante | Rol | Firma | Fecha |
|---|---|---|---|
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend Lead | | 31-03-2026 |
| Chavez Apaza Marcos Alberto | Frontend Lead / UI-UX | |31-03-2026 |
| Baldeon Martinez David | Algoritmo CSP / QA Lead | | 31-03-2026|

---

*Documento elaborado en el marco del Sprint 0 – Inicio del Proyecto.*  
*Este acuerdo es de carácter interno del equipo y podrá ser actualizado por consenso.*
