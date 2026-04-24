# PROJECT CHARTER

---
# Project Charter
**Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible  
**Acrónimo:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos  
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática  
**Institución:** Universidad Continental  
**Versión:** 1.0.0  
**Fecha de emisión:** Abril 2026

---

## 1. Identificación del Proyecto

| Campo | Descripción |
|---|---|
| **Nombre del Proyecto** | Sistema de Generación Óptima de Horarios Académicos (SGOHA) |
| **Patrocinador** | Universidad Continental – Facultad de Ingeniería |
| **Docente responsable** | Docente de Taller de Proyectos 2 |
| **Fecha de inicio** | Abril 2026 |
| **Fecha de cierre estimada** | Julio 2026 |
| **Duración total** | 12 semanas |
| **Metodología** | Scrum (enfoque ágil) |
| **Stack tecnológico** | MERN (MongoDB, Express.js, React.js, Node.js) |

---

## 2. Propósito y Justificación del Proyecto

Las universidades con currículo flexible enfrentan una problemática recurrente y significativa: la planificación manual de horarios académicos es un proceso laborioso, propenso a errores y conflictos (solapamientos de docentes, aulas o estudiantes), que consume días de trabajo de los coordinadores académicos al inicio de cada semestre.

Este proyecto justifica su necesidad porque:

1. No existe una solución automatizada y accesible para este problema en el contexto de la universidad.
2. La planificación manual no garantiza la optimización de recursos ni el cumplimiento sistemático de todas las restricciones.
3. La complejidad del currículo flexible (variabilidad de matrícula, prerrequisitos, créditos variables) excede las capacidades de herramientas genéricas como Excel.

El desarrollo de un sistema basado en algoritmos CSP permitirá automatizar este proceso, reducir errores y mejorar la experiencia de todos los actores involucrados.

---

## 3. Objetivos del Proyecto

### Objetivo General
Diseñar e implementar una aplicación web (PMV v1.0.0) que genere horarios académicos óptimos, libres de conflictos, respetando las restricciones académicas, operativas y contextuales de una universidad con currículo flexible.

### Objetivos Específicos

| N° | Objetivo | Indicador de logro |
|---|---|---|
| OE-01 | Analizar el problema identificando variables, restricciones y actores | Documento de análisis del problema aprobado |
| OE-02 | Modelar el problema como CSP y/o sistema de optimización combinatoria | Modelo formal documentado con variables, dominios y restricciones |
| OE-03 | Diseñar la arquitectura del sistema (SPA + API REST) | Diagrama de arquitectura validado por el equipo |
| OE-04 | Implementar el sistema funcional con las 4 funcionalidades core | PMV con todas las funcionalidades operativas |
| OE-05 | Validar la calidad del software según ISO/IEC 25010 | Pruebas unitarias e integración con cobertura ≥ 70% |
| OE-06 | Documentar el proyecto siguiendo lineamientos PMBOK y técnicos | Repositorio GitHub con documentación completa |

---

## 4. Alcance del Proyecto

### 4.1. Dentro del alcance (IN SCOPE)

- Módulo de registro y gestión de entidades: estudiantes, docentes, cursos, aulas.
- Módulo de validación de matrícula (créditos 20–22, verificación de prerrequisitos).
- Motor de generación automática de horarios mediante algoritmo CSP.
- Módulo de visualización de horarios generados (grilla semanal interactiva).
- Autenticación y autorización básica por roles (coordinador, estudiante, docente).
- Documentación técnica y de gestión en el repositorio GitHub.
- Pruebas unitarias e integración del backend y frontend.
- Video demostrativo del sistema (máximo 5 minutos).

### 4.2. Fuera del alcance (OUT OF SCOPE)

- Integración con sistemas existentes de la universidad (SIS, ERP).
- Módulo de reportes estadísticos avanzados.
- Notificaciones automáticas por correo o SMS.
- Aplicación móvil nativa (iOS/Android).
- Implementación en producción en infraestructura real de la universidad.
- Módulo de pagos o finanzas académicas.

---

## 5. Entregables del Proyecto

| N° | Entregable | Sprint | Responsable |
|---|---|---|---|
| E-01 | Documento de selección del enfoque | Sprint 0 | Todo el equipo |
| E-02 | Declaración de la visión del proyecto | Sprint 0 | Product Owner |
| E-03 | Project Charter | Sprint 0 | Scrum Master |
| E-04 | Registro de supuestos y restricciones | Sprint 0 | Todo el equipo |
| E-05 | Declaración del equipo del proyecto | Sprint 0 | Scrum Master |
| E-06 | Repositorio GitHub operativo | Sprint 0 | Dev Lead |
| E-07 | Documento inicial del problema | Sprint 0 | Analistas |
| E-08 | Lista de requerimientos funcionales y no funcionales | Sprint 0 | Todo el equipo |
| E-09 | Módulo de registro de entidades (backend + frontend) | Sprint 1 | Developers |
| E-10 | Módulo de validación de matrícula | Sprint 2 | Developers |
| E-11 | Motor de generación de horarios (CSP) | Sprint 3 | Developers |
| E-12 | Módulo de visualización de horarios | Sprint 4 | Developers |
| E-13 | Suite de pruebas (cobertura ≥ 70%) | Sprint 4–5 | QA |
| E-14 | Documentación técnica final | Sprint 5 | Todo el equipo |
| E-15 | Video demostrativo (≤ 5 min) | Sprint 5 | Todo el equipo |

---

## 6. Cronograma Preliminar

```
Semana  1–2  : Sprint 0 – Inicio del proyecto y documentación base
Semana  3–4  : Sprint 1 – Registro de entidades (estudiantes, docentes, cursos, aulas)
Semana  5–6  : Sprint 2 – Validación de matrícula y prerrequisitos
Semana  7–9  : Sprint 3 – Motor de generación de horarios (CSP)
Semana 10–11 : Sprint 4 – Visualización de horarios y pruebas
Semana 12    : Sprint 5 – Cierre, documentación final y video demostrativo
```

---

## 7. Stakeholders (Partes Interesadas)

| Stakeholder | Rol en el proyecto | Interés principal |
|---|---|---|
| Coordinadores académicos | Usuario principal del sistema | Generar horarios válidos y sin conflictos |
| Estudiantes | Usuario final | Visualizar su horario personalizado |
| Docentes | Usuario final | Verificar su disponibilidad y asignaciones |
| Administradores del sistema | Operación | Gestión de usuarios y recursos |
| Docente del curso | Evaluador | Calidad técnica y metodológica del proyecto |
| Equipo de desarrollo | Ejecutor | Entregar el PMV funcional |

---

## 8. Presupuesto y Recursos

| Recurso | Descripción | Costo estimado |
|---|---|---|
| Herramientas de desarrollo | VS Code, Postman, Git, GitHub | Gratuitas |
| Hosting de desarrollo | Localhost / servicios gratuitos (Render, Vercel, MongoDB Atlas Free Tier) | $0 |
| Base de datos | MongoDB Atlas (tier gratuito) | $0 |
| Gestión del proyecto | GitHub Projects / Trello | Gratuitas |
| **Total estimado** | | **$0 (recursos gratuitos)** |

> *Restricción económica: El equipo operará exclusivamente con herramientas y servicios de tier gratuito durante el periodo académico.*

---

## 9. Riesgos Iniciales Identificados

| N° | Riesgo | Probabilidad | Impacto | Estrategia de mitigación |
|---|---|---|---|---|
| R-01 | Complejidad del algoritmo CSP mayor a la esperada | Alta | Alto | Iniciar con una versión simplificada del CSP; usar librerías existentes si es necesario |
| R-02 | Abandono o baja participación de algún integrante | Media | Alto | Documentar todas las decisiones; distribuir responsabilidades con redundancia |
| R-03 | Requerimientos cambiantes durante el desarrollo | Alta | Medio | Scrum como metodología absorbe cambios entre Sprints |
| R-04 | Problemas de integración entre frontend y backend | Media | Medio | Definir contratos de API (Swagger/OpenAPI) desde Sprint 1 |
| R-05 | Deuda técnica acumulada | Media | Medio | Code reviews en cada PR; estándares de código definidos desde Sprint 0 |
| R-06 | Tiempo insuficiente para pruebas | Alta | Medio | Incluir pruebas desde Sprint 1; automatizar desde el inicio |

---

## 10. Criterios de Aceptación del Proyecto

El proyecto se considerará exitoso si:

1. El sistema genera horarios válidos sin conflictos para un escenario de prueba definido.
2. Todas las restricciones del CSP (prerrequisitos, créditos, disponibilidad, infraestructura, no solapamiento) son verificadas correctamente.
3. El repositorio GitHub cumple con los lineamientos de la consigna (ramas, commits semánticos, documentación PMBOK).
4. La cobertura de pruebas es ≥ 70%.
5. El video demostrativo muestra el flujo completo del sistema en ≤ 5 minutos.
6. La documentación técnica incluye todos los entregables requeridos.

---

*Documento elaborado por el equipo del PFA — Sprint 0 | Universidad Continental | Abril 2026*
