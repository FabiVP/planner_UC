# Categorías de Riesgos del Proyecto

**Proyecto:** UniScheduler   
**Gerente del Proyecto:** Scrum Master - Villaverde Pacheco Fabis Fabis   
**Fecha:** Abril 2026  
**Versión:** 1.0.0

---

Esta estructura define la jerarquía de riesgos (RBS - Risk Breakdown Structure) utilizada para organizar e identificar las posibles fuentes de incertidumbre en el proyecto.

| ID | Categoría | Sub-Categoría | Descripción |
|----|-----------|---------------|-------------|
| **1** | **Técnicos** | | **Riesgos relacionados con la tecnología, arquitectura y desarrollo del sistema** |
| 1.1 | Técnicos | Requerimientos | Cambios o ambigüedades en los requerimientos funcionales y no funcionales del sistema |
| 1.2 | Técnicos | Infraestructura | Disponibilidad, fallas o limitaciones de los servicios cloud (MongoDB Atlas, Render, Vercel) |
| 1.3 | Técnicos | Seguridad | Vulnerabilidades en la API REST (JWT, validación de inputs, OWASP Top 10) |
| 1.4 | Técnicos | Complejidad | Dificultad en la implementación del algoritmo CSP (backtracking, MRV, forward checking) |
| 1.5 | Técnicos | Desempeño y Confiabilidad | Tiempo de respuesta del motor CSP (>30s) o fallos en la generación de horarios |
| 1.6 | Técnicos | Calidad | Baja cobertura de pruebas (<70%) o deuda técnica acumulada por entregas rápidas |
| 1.7 | Técnicos | Comunicaciones | Problemas en la integración frontend-backend o en la definición de contratos API |
| **2** | **Externos** | | **Riesgos fuera del control directo del equipo de proyecto** |
| 2.1 | Externos | Proveedores y Contratistas | Dependencia de servicios gratuitos (GitHub, MongoDB Atlas) que podrían cambiar sus políticas |
| 2.2 | Externos | Políticos | Cambios en normativas universitarias que afecten la planificación académica |
| 2.3 | Externos | Regulaciones | Cumplimiento de estándares (ISO 25010, OWASP, WCAG) exigidos por la consigna |
| 2.4 | Externos | Mercado | Disponibilidad de herramientas o librerías alternativas para el motor CSP |
| 2.5 | Externos | Cliente | Cambios en expectativas o retroalimentación del docente evaluador durante los Sprints |
| 2.6 | Externos | Clima / Desastres naturales | Interrupciones de conectividad o energía que afecten el trabajo remoto del equipo |
| 2.7 | Externos | Competencia | No aplica directamente (entorno académico, no comercial) |
| **3** | **Organizacional** | | **Riesgos internos de la universidad o del equipo** |
| 3.1 | Organizacional | Dependencias en otros proyectos | El proyecto es independiente; no depende de otros proyectos universitarios |
| 3.2 | Organizacional | Recursos y Priorización | Disponibilidad horaria de los integrantes del equipo (carga académica, trabajo, etc.) |
| 3.3 | Organizacional | Financiación | Restricción de usar solo herramientas gratuitas; no hay presupuesto asignado |
| 3.4 | Organizacional | Cultura Organizacional | Resistencia de los coordinadores académicos a adoptar un sistema automatizado |
| 3.5 | Organizacional | Estrategia Empresarial | El proyecto se alinea con la visión de innovación de la Universidad Continental |
| 3.6 | Organizacional | Capacitación | Curva de aprendizaje del equipo en MongoDB, CSP o tecnologías del stack MERN |
| **4** | **Gestión de Proyectos** | | **Riesgos relacionados con la planificación, seguimiento y control del proyecto** |
| 4.1 | Gestión de Proyectos | Estimación | Subestimación de horas necesarias para implementar el motor CSP (Sprint 3) |
| 4.2 | Gestión de Proyectos | Planeación | Desviación del cronograma por retrasos en entregables de Sprints anteriores |
| 4.3 | Gestión de Proyectos | Control | Pérdida de trazabilidad de requerimientos o decisiones del equipo |
| 4.4 | Gestión de Proyectos | Comunicación | Falta de respuesta oportuna entre miembros del equipo (canales WhatsApp/Discord) |

---

**Elaborado por:** Chavez Apaza Marcos - Sprint 0   
**Fecha:** Abril 2026  
**Estado:** Aprobado (consistente con `C_project_charter.md` y `Matriz_Prioridades_Proyecto.md`)
