# Plan de Implementación Técnica - UniScheduler

**Feature:** Generación Óptima de Horarios Académicos (CSP)  
**Versión:** 1.0.0  
**Fecha:** Abril 2026  

---

## 1. Visión General del Plan

Este documento describe **cómo** se construirá el sistema UniScheduler, especificando las decisiones técnicas, la arquitectura, las tecnologías y la secuencia de implementación. Sirve como puente entre la especificación (`spec.md`) y las tareas concretas de desarrollo.

**Objetivo:** Implementar un motor CSP (Constraint Satisfaction Problem) para horarios institucionales + un algoritmo de matching bipartito (Kuhn) para horarios personalizados de estudiantes. Ambos generan horarios válidos en <30 segundos, cumpliendo las restricciones RD-01 a RD-14.

---

## 2. Architecture Overview

### 2.1. Diagrama de Componentes (Alto Nivel)

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Login/Auth │  │ Matrícula   │  │  Horarios   │              │
│  │  Component  │  │  Component  │  │  Component  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                         │           │                           │
│                    API Client (Axios)                           │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTPS/JSON
┌─────────────────────────┼───────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     MIDDLEWARE                             │ │
│  │  JWT Auth │ CORS │ Helmet │ Morgan │ Rate Limiting        │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      API ROUTES                            │ │
│  │  /api/auth | /api/users | /api/cursos | /api/matricula    │ │
│  │  /api/horarios (CSP Generator)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               MOTORES DE GENERACIÓN (Núcleo)               │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Backtracking + MRV + Forward Checking               │ │ │
│  │  │  • Restricciones RD-01 a RD-14                       │ │ │
│  │  │  • Timeout 30s                                       │ │ │
│  │  │  • Solución parcial si no hay completa               │ │ │
│  │  │  • Scoring 4 dimensiones con pesos dinámicos         │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  MATCHING ESTUDIANTIL (Kuhn)                        │ │ │
│  │  │  • Máximo matching bipartito (DFS augmenting paths) │ │ │
│  │  │  • Slots disponibles primero, fallback después      │ │ │
│  │  │  • shuffleAdj=true para alternativas distintas      │ │ │
│  │  │  • Disponibilidad → sugerencia, no restricción dura │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                 MODELOS (Mongoose ODM)                     │ │
│  │  Usuario │ Curso │ Estudiante │ Docente │ Aula │ Horario   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────────────┘
                          │ MongoDB Wire Protocol
┌─────────────────────────┼───────────────────────────────────────┐
│                    BASE DE DATOS (MongoDB Atlas)                 │
│  Colecciones: usuarios, cursos, estudiantes, docentes, aulas,   │
│               matriculas, horarios                               │
│  Índices: { "email": 1 }, { "curso_id": 1, "estudiante_id": 1 }  │
└─────────────────────────────────────────────────────────────────┘

### 2.2. Flujo de Datos — Generación de Horario Institucional

1. **Coordinador** inicia generación desde el frontend (`/career-generation`).
2. **Backend** recibe `POST /api/generations/generate`, valida JWT y permisos.
3. **Validador de matrícula** verifica los cursos activos.
4. Se ejecuta `runCSPMultiple` en `engine/csp.js`:
   - Construye variables: una por sesión de cada curso (sessionsPerWeek).
   - Construye dominios: combina (docente, aula, franja) validando RD-05, RD-04, RD-06, RD-09.
   - Aplica MRV para ordenar variables.
   - Backtracking con Forward Checking.
   - Verifica restricciones RD-01 a RD-14 en cada asignación.
   - Timeout 30s por intento, 30s total.
   - Shuffle aleatorio con semilla por minuto para fairness (RS-04).
5. **Scoring** evalúa cada solución en 4 dimensiones (validez, institucional, preferencias, optimización) con pesos dinámicos desde `InstitutionalPolicy.priorityWeights`.
6. Se generan hasta N soluciones ordenadas por score (best-first).
7. **Backend** guarda el horario en MongoDB y retorna JSON con asignaciones, score, conflictos y alternativas.
8. **Frontend** renderiza la grilla semanal (Lun-Vie, 07:00-22:00).

### 2.3. Flujo de Datos — Horario Personalizado del Estudiante

1. **Estudiante** selecciona cursos desde `/enrollment`.
2. **Frontend** valida prerrequisitos y créditos vía `POST /api/student-schedule/validate`.
3. Una vez validado, genera horario vía `POST /api/student-schedule/generate`.
4. **Backend** ejecuta `buildSchedule` en `student-schedule.controller.js`:
   - Filtra el horario institucional (`Generation.status=completada`) para los cursos seleccionados.
   - Construye un grafo bipartito: cursos → slots disponibles.
   - Aplica **Kuhn** (DFS augmenting paths) para matching máximo.
   - Slots no disponibles van al final del adjacency list (fallback).
   - Si `shuffleAdj=true`, mezcla aleatoriamente el orden (para alternativas).
   - Las observaciones se generan para cursos asignados a slots no disponibles.
5. Se generan 1 horario primario + hasta 2 alternativas (cambiando turno preferido y shuffle).
6. Resultado se persiste en `localStorage` y se muestra en `/my-schedules`.
7. **Frontend** renderiza la grilla semanal completa (Lun-Vie, 07:00-22:00).

---

## 3. Technology Stack (Decisiones Justificadas)

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|----------------|
| **Frontend** | React.js | 18.x | SPA rápida, ecosistema maduro, reutilización con componentes funcionales |
| **Backend** | Node.js + Express | 20.x | Mismo lenguaje que frontend (JavaScript), gran cantidad de librerías CSP |
| **Base de Datos** | MongoDB + Mongoose | 6.x / 7.x | Flexibilidad de esquema (currículo flexible), fácil integración con Node.js |
| **Autenticación** | JWT + bcrypt | 8.x / 5.x | Estándar, sin estado, seguro para APIs REST |
| **Testing** | Jest + Supertest | 29.x | Framework de pruebas todo-en-uno, buen soporte para async/await |
| **Control de Versiones** | Git + GitHub | - | Plataforma estándar, GitHub Actions para CI/CD |

### Alternativas consideradas y descartadas

| Alternativa | Motivación | Razón de descarte |
|-------------|------------|-------------------|
| **Django + DRF** | Framework robusto, admin incluido | Mayor curva de aprendizaje, menos experiencia en equipo |
| **PostgreSQL** | Base de datos relacional | Los esquemas de cursos y matrículas varían cada semestre (currículo flexible), MongoDB es más adecuado |
| **OAuth2 (Google)** | Autenticación externa | Requiere integración con cuentas universitarias no disponible en el alcance del PMV |

---

## 4. Implementation Sequence (Fases de Desarrollo)

### Fase 0: Setup y Documentación (Sprint 0)
- [ ] Inicializar repositorio con Git Flow
- [ ] Configurar GitHub Projects y Jira
- [ ] Crear README.md y documentación base
- [ ] Definir `constitution.md` y `spec.md`

### Fase 1: Backend Core (Sprint 1)
- [ ] Configurar Express.js con estructura MVC
- [ ] Conectar MongoDB (Mongoose)
- [ ] Implementar modelos: Usuario, Curso, Docente, Aula, Estudiante
- [ ] Implementar autenticación JWT (registro, login, middleware)
- [ ] CRUD completo de entidades (API REST)

### Fase 2: Validación de Matrícula (Sprint 2)
- [ ] Implementar validador de prerrequisitos y créditos
- [ ] Endpoint POST `/api/student-schedule/validate`
- [ ] Frontend: selector de cursos con validación en tiempo real, análisis de dificultad y sobrecarga

### Fase 3: Motor CSP (Sprint 3) ⭐ Núcleo del sistema
- [ ] Implementar Backtracking base
- [ ] Implementar heurística MRV (Minimum Remaining Values)
- [ ] Implementar Forward Checking
- [ ] Codificar restricciones RD-01 a RD-11 (inicial)
- [ ] Manejo de timeout 30s por intento, 30s total
- [ ] Scoring 4 dimensiones (validez, institucional, preferencias, optimización)
- [ ] Generación de múltiples soluciones (primaria + alternativas)
- [ ] Seed aleatorio por minuto para equidad (RS-04)
- [ ] Pruebas unitarias del CSP (≥70% cobertura)

### Fase 4: Frontend y Horario Estudiantil (Sprint 4)
- [ ] Grilla semanal interactiva (React, Lun-Vie 07:00-22:00, 15 franjas)
- [ ] Endpoint `/api/student-schedule/generate` con matching bipartito (Kuhn)
- [ ] Horario personalizado del estudiante con alternativas y observaciones
- [ ] Persistencia vía localStorage + `/api/student-schedule/my-schedule`
- [ ] Pruebas de integración

### Fase 5: Cierre y Documentación (Sprint 5)
- [ ] Extensión a RD-12 (bloques bloqueados), RD-13 (turno PH), RD-14 (límite créditos)
- [ ] Pruebas de sistema (end-to-end)
- [ ] Documentación técnica final
- [ ] Video demostrativo (5 min)
- [ ] Preparación de entrega final

---

## 5. Constitution Verification (Alineación con Principios)

Cada sección del plan se ha verificado contra el `constitution.md`:

| Principio de `constitution.md` | Cómo se cumple en este plan | Responsable |
|--------------------------------|-----------------------------|-------------|
| **Validez sobre optimalidad** | El CSP retorna solución parcial si no encuentra solución completa en 30s. Prioriza validez. | Backend Dev |
| **Rendimiento primero (<30s)** | Se implementa MRV y Forward Checking específicamente para reducir tiempo de búsqueda. | CSP Dev |
| **Trazabilidad total** | Cada restricción (RD-01 a RD-14) tiene prueba unitaria asociada. Todos los commits referencian Jira. | QA Engineer |
| **Modularidad del CSP** | Los motores se encapsulan en `backend/engine/` (CSP) y `backend/controllers/student-schedule.controller.js` (Kuhn) con interfaces claras. | Dev Lead |
| **Seguridad por diseño** | Todos los endpoints excepto `/api/login` requieren JWT. Passwords con bcrypt. | Backend Dev |
| **Calidad medible** | Jest configurado con cobertura ≥70%. Code reviews obligatorios en cada PR. | Todo el equipo |

---

## 6. Implementation Constraints (Restricciones Técnicas)

| ID | Restricción | Fuente |
|----|-------------|--------|
| IC-01 | El CSP debe ejecutarse en Node.js (no Python/Rust) | Decisión del equipo, alineada con stack MERN |
| IC-02 | La base de datos es MongoDB (no relacional) | Por la flexibilidad del esquema de matrícula |
| IC-03 | Todos los servicios deben ser **gratuitos** (tier gratuito o limitado) | No hay presupuesto real |
| IC-04 | El frontend debe ser SPA (React) | Por requisito de la consigna (aplicación web moderna) |
| IC-05 | El código debe tener cobertura de pruebas ≥70% | Estándar ISO 25010 y consigna |

---

## 7. Assumptions & Open Questions

### Suposiciones (Assumptions)

| ID | Suposición | Impacto si es falsa |
|----|------------|---------------------|
| AS-01 | Los datos de entrada (cursos, estudiantes, docentes) están **completos y válidos** (no hay cursos sin docente ni aulas sin tipo) | El CSP podría fallar o no encontrar solución |
| AS-02 | Los servicios cloud (MongoDB Atlas, Render) están disponibles 24/7 | El sistema no funcionaría; se necesita plan de contingencia local |
| AS-03 | Los 3 integrantes del equipo pueden dedicar al menos 10 horas/semana cada uno | Se retrasaría el cronograma; se activaría plan de mitigación (R-002) |

### Preguntas Abiertas (Open Questions)

| ID | Pregunta | Resolución esperada | Fecha límite |
|----|----------|---------------------|--------------|
| OQ-01 | ¿El motor CSP manejará también restricciones de horarios preferidos por docentes (RS-01)? | **Resuelto:** Sí, implementado en `scoring.js` con preferencias de turno. Adicionalmente, RD-13 fuerza turno para docentes PH. | Sprint 3 |
| OQ-02 | ¿El sistema CSP manejará solo restricciones duras o también blandas? | **Resuelto:** Ambas. Las duras (RD-01 a RD-14) son obligatorias; las blandas (RS-01 a RS-04) se optimizan en scoring. | Sprint 3 |
| OQ-03 | ¿Se implementará generación de horarios personalizados para estudiantes? | **Resuelto:** Sí, con algoritmo de matching bipartito (Kuhn) en `POST /api/student-schedule/generate`. | Sprint 4 |
| OQ-04 | ¿La disponibilidad del estudiante es restricción dura o blanda? | **Resuelto:** Es sugerencia (blanda). Los slots no disponibles van al final de la lista de adyacencia como fallback. | Sprint 4 |

---

## 8. Risk Mitigation (Técnica)

| Riesgo Técnico | Plan de Contingencia | Responsable |
|----------------|----------------------|-------------|
| **El CSP excede los 30 segundos** | Implementar timeout que retorne la mejor solución parcial hasta ese momento. Optimizar después. | CSP Dev |
| **El matching Kuhn no encuentra asignación para todos los cursos** | Marcar cursos no asignados como `uncoveredCourses` y mostrarlos al estudiante como advertencia, no como error. | Backend Dev |
| **MongoDB Atlas (tier gratuito) no soporta la carga** | Migrar a MongoDB local o a Supabase (PostgreSQL) con adaptador. | Backend Dev |
| **React no puede renderizar la grilla rápidamente con 30+ cursos** | Implementar virtualización de tabla (react-window) y memoización. | Frontend Dev |
| **El equipo no logra 70% de cobertura de pruebas** | Dedicar horas extras específicas para pruebas en Sprint 4; reducir alcance si es necesario. | QA Engineer |

---

## 9. Success Metrics (Implementación)

| Métrica | Objetivo | Cómo se mide | Cuándo se evalúa |
|---------|----------|--------------|------------------|
| Tiempo de generación CSP | < 30 segundos (ideal < 2 segundos) | `console.time()` en endpoint | Sprint 3 Review |
| Cobertura de pruebas | ≥ 70% líneas/funciones | `npm test -- --coverage` | Final de cada Sprint |
| Tiempo de respuesta API (p95) | < 500 ms (sin CSP), < 30s (con CSP) | Logs de Morgan, New Relic | Sprint 4 |
| Commits con trazabilidad Jira | 100% de commits después de Sprint 3 | Revisión manual de mensajes de commit | Cada Sprint Review |

---

## 10. Complexity Tracking (Desviaciones del Constitution)

| Complejidad | Decisión | Justificación | Aprobación |
|-------------|----------|---------------|------------|
| (Ninguna hasta el momento) | - | - | - |

> Este espacio se actualiza si algún principio del `constitution.md` no puede cumplirse. Cada desviación requiere aprobación del equipo.

---

**Elaborado por:** Equipo UniScheduler  
**Fecha:** Abril 2026  
**Próxima revisión:** Final del Sprint 3 (15 de junio de 2026)