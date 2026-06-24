# Informe Final de Lecciones Aprendidas

**Proyecto:** UniScheduler — Sistema de Generación Óptima de Horarios Académicos
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática
**Universidad:** Universidad Continental
**Fecha:** Julio 2026
**Versión:** 1.0.0

---

## 1. Metodología de Recopilación

Las lecciones aprendidas se recopilaron mediante retrospectivas estructuradas al final de cada Sprint, utilizando el formato **Start-Stop-Continue** y análisis de causa raíz (técnica de los 5 porqués) para los incidentes significativos.

---

## 2. Resumen por Sprint

### 2.1. Sprint 0 — Inicio y Documentación Base (Semanas 1-2)

| Aspecto | Detalle |
|---|---|
| **Período** | Abril 2026 |
| **Objetivo** | Establecer la base del proyecto: documentación, repositorio, stack tecnológico |
| **Velocidad** | 20/20 SP completados (100%) |

#### Qué salió bien

| Lección | Causa | Impacto |
|---|---|---|
| La definición temprana de estándares de código (ESLint, Prettier, Git Flow) evitó inconsistencias técnicas en Sprints posteriores | Experiencia previa del equipo en proyectos colaborativos | Alto: redujo drásticamente conflictos de merge y retrabajo en code reviews |
| La documentación base (Project Charter, Requerimientos, Supuestos) quedó alineada y con trazabilidad cruzada | Dedicación de tiempo suficiente a la fase de análisis | Alto: sirvió como fuente única de verdad durante todo el proyecto |

#### Qué podría mejorarse

| Lección | Causa Raíz | Acción Correctiva |
|---|---|---|
| El repositorio no tenía CI/CD configurado desde el inicio | Se priorizó la documentación sobre la automatización | Configurar GitHub Actions para pruebas automáticas desde el Sprint 0 en proyectos futuros |
| No se estimaron las historias con Planning Poker formal | El equipo confió en estimaciones直觉 (intuitivas) | Usar Planning Poker con escala Fibonacci desde el Sprint 0 |

---

### 2.2. Sprint 1 — Gestión de Entidades (Semanas 3-4)

| Aspecto | Detalle |
|---|---|
| **Período** | Abril - Mayo 2026 |
| **Objetivo** | CRUD de estudiantes, docentes, cursos, aulas + autenticación JWT |
| **Velocidad** | 28/28 SP completados (100%) |

#### Qué salió bien

| Lección | Causa | Impacto |
|---|---|---|
| Definir contratos de API (Swagger/OpenAPI) desde el Sprint 1 evitó retrabajos de integración entre frontend y backend | Decisión consciente del Dev Lead basada en experiencia | Alto: la integración en Sprint 3 fue fluida y sin reprocesos |
| Implementar autenticación JWT y roles desde el primer Sprint permitió asegurar todos los endpoints posteriores | Enfoque "security by design" desde el inicio | Alto: 0 vulnerabilidades de control de acceso en escaneo OWASP |

#### Qué podría mejorarse

| Lección | Causa Raíz | Acción Correctiva |
|---|---|---|
| El tablero Jira no se actualizó diariamente, solo al final del Sprint | Falta de disciplina en la actualización de métricas ágiles | Establecer actualización obligatoria del tablero antes del Daily Scrum en Sprints siguientes |
| Las tareas de frontend y backend se desarrollaron en serie en lugar de en paralelo | Dependencia entre definición de API y consumo frontend | Planificar tareas paralelas desde la planificación del Sprint |

---

### 2.3. Sprint 2 — Validación de Matrícula (Semanas 5-6)

| Aspecto | Detalle |
|---|---|
| **Período** | Mayo 2026 |
| **Objetivo** | Validación de prerrequisitos, créditos, corequisitos |
| **Velocidad** | 28/28 SP completados (100%) |

#### Qué salió bien

| Lección | Causa | Impacto |
|---|---|---|
| Las pruebas unitarias desde el inicio del módulo permitieron detectar errores de validación antes de la integración | Estrategia de "test-first" para lógica de negocio crítica | Alto: tiempo de depuración reducido en un 60% |
| La separación clara entre lógica de validación (services) y controladores (controllers) facilitó el testing | Arquitectura limpia con separación de responsabilidades | Medio: tests más simples y mantenibles |

#### Qué podría mejorarse

| Lección | Causa Raíz | Acción Correctiva |
|---|---|---|
| El alcance del Sprint aumentó durante la ejecución (corrupción de alcance) | Los requisitos de validación no estaban completamente claros al inicio | Congelar el alcance durante el Sprint; cualquier cambio debe ir al backlog para el Sprint siguiente |
| No se documentaron los casos borde de validación de prerrequisitos (cursos anidados, ciclos) | Complejidad no anticipada del dominio | Identificar y documentar casos borde durante la planificación del Sprint con el Product Owner |

---

### 2.4. Sprint 3 — Motor CSP (Semanas 7-9)

| Aspecto | Detalle |
|---|---|
| **Período** | Mayo - Junio 2026 |
| **Objetivo** | Implementar motor de generación de horarios (backtracking + MRV + forward checking) |
| **Velocidad** | ~30/50 SP completados (progreso parcial en restricciones complejas) |

#### Qué salió bien

| Lección | Causa | Impacto |
|---|---|---|
| La investigación de librerías CSP y algoritmos de backtracking en el Sprint 2 permitió comenzar el Sprint 3 con un POC funcional | Aprovechamiento de la oportunidad OP-001 (librerías CSP open source) | Alto: redujo semanas de desarrollo |
| La implementación de heurísticas MRV y forward checking mejoró drásticamente el rendimiento (de >30s a 0.597s) | Aplicación de técnicas de poda de espacio de búsqueda | Crítico: permitió cumplir el requisito RNF-01 de rendimiento |

#### Qué podría mejorarse

| Lección | Causa Raíz | Acción Correctiva |
|---|---|---|
| La restricción RD-03 (estudiante sin solapamiento) causó un estancamiento de 7-10 días en el desarrollo | Complejidad O(n²) de la validación de estudiantes | Dividir la implementación de restricciones complejas en subtareas más pequeñas (máximo 3-5 SP cada una) |
| El Burndown Chart mostró una meseta prolongada sin entregas parciales | El equipo no descompuso la historia del CSP en tareas independientes | Descomponer historias >8 SP en subtareas de 2-3 SP para mantener un flujo constante de entregas |

#### Análisis de Causa Raíz: Estancamiento en Restricción RD-03

| ¿Por qué? | Respuesta |
|---|---|
| **Problema inicial** | El CSP no avanzaba, el Burndown se estancó |
| **¿Por qué?** | La implementación de RD-03 (estudiante sin solapamiento) era demasiado lenta |
| **¿Por qué?** | Validar cada asignación contra 100 estudiantes requería O(n²) operaciones |
| **¿Por qué?** | No se implementó una estructura de índice en memoria para acelerar la validación |
| **¿Por qué?** | No se anticipó la complejidad computacional de esta restricción durante el diseño |
| **Acción correctiva** | Implementar índices en memoria (Map/diccionarios) para acelerar la validación de estudiantes |

---

### 2.5. Sprint 4 — Visualización y Pruebas (Semanas 10-11)

| Aspecto | Detalle |
|---|---|
| **Período** | Junio 2026 |
| **Objetivo** | Visualización en grilla semanal, horario personalizado estudiante, pruebas integrales |
| **Velocidad** | SP completados según plan |

#### Qué salió bien

| Lección | Causa | Impacto |
|---|---|---|
| El uso de una librería de grid React existente aceleró significativamente el desarrollo de la visualización | Decisión de no construir desde cero la grilla horaria | Alto: ahorró aproximadamente 1 semana de desarrollo |
| El matching bipartito de Kuhn para horarios personalizados se implementó sin problemas gracias a la modularidad del CSP | Arquitectura modular del motor CSP | Medio: el algoritmo Kuhn se integró limpiamente con el CSP existente |

#### Qué podría mejorarse

| Lección | Causa Raíz | Acción Correctiva |
|---|---|---|
| Las pruebas E2E con Playwright y Cypress requirieron configuración adicional y no se automatizaron completamente en CI | Falta de planificación temprana de la infraestructura de pruebas E2E | Incluir la configuración de E2E en CI desde el Sprint 1 en proyectos futuros |
| La cobertura de pruebas frontend quedó baja (9.29%) | El equipo priorizó las funcionalidades sobre las pruebas de UI | Establecer un mínimo de cobertura frontend (≥ 50%) como Definition of Done desde el Sprint 1 |

---

### 2.6. Sprint 5 — Cierre y Documentación Final (Semana 12)

| Aspecto | Detalle |
|---|---|
| **Período** | Julio 2026 |
| **Objetivo** | Documentación final, video demostrativo, acta de cierre |
| **Velocidad** | 100% completado |

#### Qué salió bien

| Lección | Causa | Impacto |
|---|---|---|
| La documentación mantenida y actualizada durante todo el proyecto facilitó enormemente el cierre | Disciplina de documentación continua (no al final) | Alto: el Sprint 5 se enfocó en pulir, no en crear desde cero |
| El video demostrativo grabado con captura de pantalla y narración clara muestra el flujo completo del sistema | Planificación del contenido del video con antelación | Alto: video de alta calidad profesional |

#### Qué podría mejorarse

| Lección | Causa Raíz | Acción Correctiva |
|---|---|---|
| Algunos documentos de cierre (registro de incidentes, impedimentos, defectos) debieron mantenerse durante el proyecto, no al final | Falta de hábito de registrar incidentes en el momento | Crear plantillas de registros en el repositorio desde el Sprint 0 y actualizarlos durante el desarrollo |

---

## 3. Síntesis de Lecciones Aprendidas

### 3.1. Buenas Prácticas (para adoptar en futuros proyectos)

| # | Práctica | Beneficio | Recomendado para |
|---|---|---|---|
| BP-01 | Definir contratos de API (Swagger/OpenAPI) antes del desarrollo | Elimina retrabajos de integración | Proyectos con frontend y backend separados |
| BP-02 | Implementar seguridad (JWT, roles) desde el primer Sprint | Asegura todos los endpoints futuros sin retrabajo | Todo proyecto con autenticación |
| BP-03 | Escribir pruebas unitarias junto con el código (test-first) | Detecta errores temprano, reduce tiempo de depuración | Lógica de negocio crítica |
| BP-04 | Mantener documentación actualizada durante todo el proyecto | Facilita el cierre y la transferencia de conocimiento | Proyectos académicos y profesionales |
| BP-05 | Usar code reviews obligatorios en cada PR | Mantiene calidad, difunde conocimiento, reduce deuda técnica | Equipos de 2+ desarrolladores |
| BP-06 | Configurar CI/CD desde el Sprint 0 | Automatiza pruebas, detecta regresiones | Todo proyecto con repositorio Git |

### 3.2. Errores y Áreas de Mejora (para evitar en futuros proyectos)

| # | Error | Consecuencia | Cómo evitarlo |
|---|---|---|---|
| EM-01 | No actualizar métricas ágiles diariamente | Burndown/Burnup charts no reflejan la realidad | Regla: actualizar tablero antes del Daily Scrum |
| EM-02 | Permitir que el alcance del Sprint cambie durante la ejecución | Corrupción de métricas, incumplimiento de compromisos | Congelar alcance al iniciar el Sprint |
| EM-03 | No descomponer historias grandes (>8 SP) | Estancamiento en Burndown, falta de entregas parciales | Subdividir en subtareas de 2-3 SP |
| EM-04 | No registrar incidentes/impedimentos en el momento | Pérdida de información valiosa para el cierre | Crear plantillas y actualizar semanalmente |
| EM-05 | No establecer mínimo de cobertura frontend | Baja cobertura de pruebas de UI | Incluir en Definition of Done desde el Sprint 1 |

### 3.3. Oportunidades de Mejora Identificadas

| # | Oportunidad | Impacto Potencial | Esfuerzo Requerido |
|---|---|---|---|
| OM-01 | Implementar CI/CD completo con pruebas E2E automatizadas | Detección temprana de regresiones visuales | Alto |
| OM-02 | Mejorar cobertura frontend a ≥ 50% | Mayor confianza en la calidad de UI | Medio |
| OM-03 | Implementar pruebas de mutación (Stryker) para el motor CSP | Validación de calidad de tests existentes | Bajo |
| OM-04 | Automatizar escaneo OWASP ZAP en CI | Seguridad continua sin intervención manual | Medio |
| OM-05 | Implementar monitoreo de rendimiento (Lighthouse CI) | Detección de regresiones de rendimiento | Bajo |
| OM-06 | Documentar Architecture Decision Records (ADR) | Trazabilidad de decisiones técnicas | Bajo |

---

## 4. Aprendizaje Organizacional

### 4.1. Conocimiento Adquirido por el Equipo

| Área | Conocimiento Adquirido | Nivel |
|---|---|---|
| Algoritmos CSP | Backtracking, MRV, Forward Checking, Scoring 4D, Timeout handling | Avanzado |
| Matching Bipartito | Algoritmo de Kuhn (Maximum Matching) en grafos | Intermedio |
| Stack MERN | MongoDB, Express, React, Node.js — desarrollo full-stack integrado | Avanzado |
| Seguridad Web | OWASP Top 10, JWT, bcrypt, sanitización, headers de seguridad | Avanzado |
| Pruebas Automatizadas | Jest, Vitest, Supertest, Cypress, Playwright, MSW | Avanzado |
| Calidad de Software | SonarQube, WCAG, SUS, Green Software, ISO/IEC 25010 | Avanzado |
| Gestión de Proyectos | Scrum, PMBOK, Jira, Git Flow, Conventional Commits | Avanzado |

### 4.2. Recomendaciones Transferibles

1. **Para proyectos con componentes algorítmicos complejos:** Dedicar al menos un Sprint de investigación (Spike) antes de la implementación para reducir riesgos.
2. **Para equipos pequeños (3 personas):** Usar roles compartidos pero con áreas de liderazgo claras para evitar conflictos de responsabilidad.
3. **Para proyectos académicos con entregables por Sprint:** Mantener un buffer del 15-20% en la planificación para absorber imprevistos.
4. **Para documentación técnica:** Usar tablas de trazabilidad entre documentos para mantener la coherencia.

---

## 5. Reflexión del Equipo

> *"El proyecto UniScheduler nos desafió a resolver un problema real de ingeniería de software con alta complejidad algorítmica. La implementación del motor CSP fue el punto crítico, pero la planificación anticipada y las pruebas continuas nos permitieron superarlo con éxito. La documentación constante durante todo el proyecto facilitó enormemente la fase de cierre. La principal lección aprendida como equipo es que invertir tiempo al inicio en definiciones claras (contratos API, estándares, arquitectura) se multiplica en ahorro de tiempo durante el desarrollo."*

> *"El enfoque Green Software nos hizo conscientes de que la eficiencia computacional no solo mejora la experiencia del usuario, sino que también reduce el impacto ambiental. Las optimizaciones implementadas (índices MongoDB, paginación, caché, compresión) demostraron que pequeñas decisiones técnicas tienen un gran impacto acumulativo en la sostenibilidad."*

---

## 6. Datos de la Sesión de Lecciones Aprendidas

| Sesión | Fecha | Participantes | Duración |
|---|---|---|---|
| Retrospectiva Sprint 0 | 12 Abril 2026 | Todo el equipo | 45 min |
| Retrospectiva Sprint 1 | 4 Mayo 2026 | Todo el equipo | 45 min |
| Retrospectiva Sprint 2 | 18 Mayo 2026 | Todo el equipo | 45 min |
| Retrospectiva Sprint 3 | 8 Junio 2026 | Todo el equipo | 60 min |
| Retrospectiva Sprint 4 | 22 Junio 2026 | Todo el equipo | 45 min |
| Sesión final de lecciones aprendidas | 29 Junio 2026 | Todo el equipo | 90 min |

---

*Documento elaborado por el equipo UniScheduler — Sprint 5 | Universidad Continental | Julio 2026*
