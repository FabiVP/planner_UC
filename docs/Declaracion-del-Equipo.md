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
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend Lead | Facilitar ceremonias Scrum, gestionar el tablero, desarrollar modelos y controladores Node.js/Express, configurar MongoDB |
| Chavez Apaza Marcos Alberto | Frontend Lead / UI-UX | Desarrollar componentes React, implementar el grid de horarios, asegurar usabilidad y diseño responsivo |
| Baldeon Martinez David | Algoritmo CSP / QA Lead | Implementar el algoritmo de generación de horarios, desarrollar pruebas unitarias e integración, documentar decisiones técnicas |

> **Nota:** Los roles de Product Owner son ejercidos por el docente del curso. Los tres integrantes participan en todas las capas del stack (full-stack) aunque cada uno tenga un área de liderazgo.

---

## 2. Responsabilidades generales del equipo

Todos los integrantes del equipo asumen las siguientes responsabilidades compartidas:

- Participar activamente en todas las ceremonias Scrum (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective).
- Realizar commits con mensajes descriptivos , siguiendo el formato convencional: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`.
- Revisar y aprobar Pull Requests de sus compañeros antes de integrar a la rama principal (`main`).
- Documentar su trabajo en la carpeta `docs/` al finalizar cada sprint.
- Comunicar bloqueos o impedimentos al Scrum Master con al menos 24 horas de anticipación.
- Mantener el tablero de tareas actualizado.

---

## 3. Normas de trabajo del equipo

### 3.1 Comunicación
- Canal principal: WhatsApp / Correo Electrónico / Llamadas .
- Reunión de sincronización: mínimo 2 veces por semana.
- Daily Scrum asíncrono: cada integrante publica en el canal un mensaje semanal con: (1) qué hizo ayer, (2) qué hará hoy, (3) si tiene algún bloqueo.

### 3.2 Control de versiones (Trunk-Based Development)
- La rama principal es `main`. Debe mantenerse siempre en estado funcional.
- Cada funcionalidad se desarrolla en una rama de corta duración con el formato: `feat/nombre-funcionalidad`.
- Ningún integrante puede hacer merge a `main` sin al menos 1 aprobación de Pull Request.
- Los commits deben ser pequeños, frecuentes y descriptivos. Se prohíben commits con mensajes como "fix", "cambios", "update" sin más detalle.
- Se aplica versionado semántico: cada versión relevante se etiqueta con un tag (`v0.1.0`, `v0.2.0`, etc.).

### 3.3 Calidad del código
- Todo código nuevo debe incluir comentarios en los bloques de lógica compleja.
- Las funciones deben tener un nombre descriptivo que refleje su propósito.
- Se prohíbe subir archivos de entorno (`.env`) al repositorio; siempre deben estar en `.gitignore`.
- Antes de hacer merge, el integrante debe verificar que su código no rompe funcionalidades existentes.

### 3.4 Gestión de tareas
- Las tareas del sprint se registran como Issues en GitHub con etiquetas: `feature`, `bug`, `docs`, `test`.
- Cada Issue debe tener: título claro, descripción, criterios de aceptación y responsable asignado.
- El Definition of Done (DoD) para una tarea es: código subido, prueba básica existente, PR aprobado y documentación actualizada si aplica.

### 3.5 Resolución de conflictos
- Los desacuerdos técnicos se resuelven por votación simple (mayoría de 2 de 3).
- Si persiste el conflicto, se escala al docente del curso como árbitro.
- Los conflictos de código (merge conflicts) los resuelve quien hizo el último commit, con revisión del afectado.

---

## 4. Compromisos del equipo

Cada integrante, al firmar este documento, se compromete a:

1. Dedicar el tiempo acordado al proyecto (mínimo 8 horas semanales).
2. Cumplir con las tareas asignadas en el sprint dentro del plazo establecido.
3. Comunicar proactivamente cualquier impedimento o cambio en su disponibilidad.
4. Respetar las normas de trabajo definidas en este documento.
5. Contribuir a un ambiente de trabajo colaborativo, respetuoso y orientado a resultados.

---

## 5. Firmas de compromiso

| Integrante | Rol | Firma | Fecha |
|---|---|---|---|
| Villaverde Pacheco Fabiola Karina | Scrum Master / Backend Lead | | 31-03-2026 |
| Chavez Apaza Marcos Alberto | Frontend Lead / UI-UX | |31-03-2026 |
| Baldeon Martinez David | Algoritmo CSP / QA Lead | | 31-03-2026|

---

*Documento elaborado en el marco del Sprint 0 – Inicio del Proyecto.*  
*Este acuerdo es de carácter interno del equipo y podrá ser actualizado por consenso.*
