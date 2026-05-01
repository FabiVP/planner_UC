# Plan de Implementación Técnica - UniScheduler

**Feature:** Generación Óptima de Horarios Académicos (CSP)  
**Versión:** 1.0.0  
**Fecha:** Abril 2026  

---

## 1. Visión General del Plan

Este documento describe **cómo** se construirá el sistema UniScheduler, especificando las decisiones técnicas, la arquitectura, las tecnologías y la secuencia de implementación. Sirve como puente entre la especificación (`spec.md`) y las tareas concretas de desarrollo.

**Objetivo:** Implementar un motor CSP (Constraint Satisfaction Problem) que genere horarios válidos en <30 segundos, cumpliendo las restricciones RD-01 a RD-06.

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
│  │                    MOTOR CSP (Núcleo)                      │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Backtracking + MRV + Forward Checking               │ │ │
│  │  │  • Restricciones RD-01 a RD-06                       │ │ │
│  │  │  • Timeout 30s                                       │ │ │
│  │  │  • Solución parcial si no hay completa               │ │ │
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

### 2.2. Flujo de Datos Principal (Generación de Horario)

1. **Frontend** envía POST `/api/horarios/generate` con los IDs de estudiantes y cursos.
2. **Backend** recibe la solicitud, valida JWT y permisos.
3. El **validador de matrícula** verifica:
   - Prerrequisitos (RD-05)
   - Rango de créditos 20-22 (RD-04)
4. Si la validación falla, retorna error 400 con la causa.
5. Si la validación pasa, se ejecuta el **Motor CSP**:
   - Inicializa variables (cursos) y dominios (franjas horarias)
   - Aplica MRV para ordenar variables
   - Backtracking con Forward Checking
   - Verifica restricciones RD-01, RD-02, RD-03, RD-06 en cada asignación
   - Timeout después de 30 segundos
6. El CSP retorna un horario (JSON) o solución parcial.
7. **Backend** guarda el horario en MongoDB y lo retorna al frontend.
8. **Frontend** renderiza la grilla semanal interactiva.

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
- [ ] Implementar validador de prerrequisitos (RD-05)
- [ ] Implementar validador de créditos (RD-04)
- [ ] Endpoint POST `/api/matricula/validate`
- [ ] Frontend: selector de cursos con validación en tiempo real

### Fase 3: Motor CSP (Sprint 3) ⭐ Núcleo del sistema
- [ ] Implementar Backtracking base
- [ ] Implementar heurística MRV (Minimum Remaining Values)
- [ ] Implementar Forward Checking
- [ ] Codificar restricciones RD-01, RD-02, RD-06
- [ ] Codificar restricción RD-03 (la más compleja, O(n²))
- [ ] Manejo de timeout 30s
- [ ] Retorno de solución parcial si timeout
- [ ] Pruebas unitarias del CSP (≥70% cobertura)

### Fase 4: Frontend y Visualización (Sprint 4)
- [ ] Grilla semanal interactiva (React)
- [ ] Consumo del endpoint `/api/horarios/generate`
- [ ] Renderizado de horarios
- [ ] Pruebas de integración

### Fase 5: Cierre y Documentación (Sprint 5)
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
| **Trazabilidad total** | Cada restricción (RD-01 a RD-06) tiene prueba unitaria asociada. Todos los commits referencian Jira. | QA Engineer |
| **Modularidad del CSP** | El motor CSP se encapsula en `backend/engine/` con interfaz clara. Se puede reemplazar por biblioteca externa sin afectar el resto. | Dev Lead |
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
| OQ-01 | ¿El motor CSP manejará también restricciones de horarios preferidos por docentes (RS-01)? | Sí, pero en versión post-PMV (v1.1.0). No incluido en el alcance actual. | Sprint 3 Review |
| OQ-02 | ¿Se implementará caché de horarios generados para evitar recomputar? | Sí, si el tiempo de generación supera los 5 segundos en producción. Se decidirá después de pruebas de carga. | Sprint 4 |
| OQ-03 | ¿El frontend debe ser accesible (WCAG 2.1 AA) desde el PMV? | Sí, porque la consigna lo exige explícitamente (RNF-03). Se implementará desde Sprint 4. | Sprint 4 Planning |

---

## 8. Risk Mitigation (Técnica)

| Riesgo Técnico | Plan de Contingencia | Responsable |
|----------------|----------------------|-------------|
| **El CSP excede los 30 segundos** | Implementar timeout que retorne la mejor solución parcial hasta ese momento. Optimizar después. | CSP Dev |
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