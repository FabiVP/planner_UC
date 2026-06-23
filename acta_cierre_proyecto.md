# ACTA DE CIERRE DE PROYECTO

**Nombre del Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Gerente del Proyecto:** Villaverde Pacheco Fabiola Karina (Scrum Master)
**Fecha:** Julio 2026

---

## Cierre por parte del Dueño del Proyecto

| Pregunta | Sí/No | Justificación |
|---|---|---|
| ¿Se han cumplido los objetivos del proyecto? | Sí | Los 6 objetivos específicos (OE-01 a OE-06) fueron alcanzados. El sistema genera horarios válidos sin conflictos en 0.597s, muy por debajo del límite de 30s. La cobertura de pruebas crítica es del 94% y el Quality Gate de SonarQube está en PASSED. |
| ¿Se han culminado todos los entregables del proyecto? | Sí | Los 15 entregables planificados (E-01 a E-15) fueron completados, incluyendo el módulo CRUD de entidades, validación de matrícula, motor CSP, visualización de horarios, suite de pruebas, documentación técnica y video demostrativo. |
| ¿Está el dueño del producto satisfecho del resultado global del proyecto? | Sí | El producto cumple con todos los criterios de éxito definidos en el Project Charter: genera horarios sin conflictos, valida prerrequisitos y créditos (12-25), ofrece visualización interactiva con navegación por teclado y cumple estándares de calidad ISO/IEC 25010, OWASP Top 10 y WCAG 2.1 AA. |

### Comentarios

El proyecto UniScheduler se desarrolló exitosamente en 12 semanas (5 Sprints) utilizando metodología Scrum y stack MERN. Se implementaron 7 requerimientos funcionales y 7 no funcionales, incluyendo un motor CSP con backtracking, heurística MRV y forward checking para generación de horarios, y un sistema de matching greedy para horarios personalizados de estudiantes. La calidad fue validada mediante ~240 pruebas automatizadas, análisis SonarQube (Quality Gate PASSED), escaneo OWASP (0 vulnerabilidades), evaluación WCAG (95.6% accesibilidad) y evaluación SUS (75.5 puntos — Grado B). Adicionalmente, se implementaron prácticas Green Software que redujeron la huella de CO2 en un 96.7%.

---

## Cierre por parte del Gerente de Proyecto

### Lecciones Aprendidas

**Buenas prácticas identificadas:**
- Definir contratos de API desde el Sprint 1 evitó retrabajos de integración
- Implementar seguridad (JWT + roles) desde el inicio aseguró todos los endpoints posteriores
- Las pruebas continuas desde el Sprint 1 permitieron detectar errores tempranamente
- Mantener documentación actualizada durante todo el proyecto facilitó la fase de cierre

**Áreas de mejora:**
- Actualizar el tablero de trabajo diariamente (no solo al final del Sprint)
- Descomponer historias de usuario grandes (>8 SP) en subtareas más pequeñas
- Mejorar la cobertura de pruebas frontend (actualmente 9.29%)
- Automatizar pruebas E2E en CI desde el inicio del proyecto

**Reflexión del equipo:**
El proyecto nos desafió a resolver un problema real de ingeniería de software con alta complejidad algorítmica. La implementación del motor CSP fue el punto crítico, pero la planificación anticipada y las pruebas continuas permitieron superarlo exitosamente. La principal lección es que invertir tiempo al inicio en definiciones claras se multiplica en ahorro durante el desarrollo.

---

## Firmas

| Cargo | Nombre | Firma |
|---|---|---|
| Dueño del Producto | Chavez Apaza Marcos Alberto | _____________ |
| Gerente de Proyecto | Villaverde Pacheco Fabiola Karina | _____________ |
| Patrocinador | Universidad Continental — Facultad de Ingeniería | _____________ |

---

*Documento generado en Sprint 5 — Universidad Continental | Julio 2026*
