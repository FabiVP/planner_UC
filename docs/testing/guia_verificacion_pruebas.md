# Guía de Verificación de Pruebas — Alineada con testing_b.md y rubrica_test.md

> Cada sección indica: `testing_b.md §` → requisito del documento de especificación, `Rúbrica §` → punto de la rúbrica de evaluación.

---

## Requisitos previos

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../ && npm install
```

---

## 1. Pruebas Unitarias — Servicios, Controladores, Utilitarios

**testing_b.md §1.1** — Actividades: 1º Implementar pruebas sobre servicios/controladores/utilitarios, 2º Validar reglas de negocio, 3º Mocks/stubs/spies, 4º Excepciones, 5º Casos límite.

**Rúbrica §1** — Implementa pruebas unitarias completas; cubre lógica crítica, excepciones, casos límite; usa mocks, stubs, spies.

### 1.1 Enrollment Controller (15 tests) — NUEVO

```bash
cd backend && npx jest tests/unit/controllers/enrollment.controller.test.js --verbose
```

| testing_b.md | Rúbrica | Qué verificar |
|---|---|---|
| 1.1 §1 Servicios/controladores | §1 Organizadas y completas | CRUD completo: getAll, create, validate, delete |
| 1.1 §2 Reglas de negocio | §1 Lógica crítica | Validación RD-14 créditos (mín/máx) y RD-05 prerrequisitos |
| 1.1 §3 Mocks | §1 Mocks correctos | jest.mock de Enrollment, Student, Course, InstitutionalPolicy |
| 1.1 §4 Excepciones | §1 Manejo excepciones | Errores DB capturados con next(), estudiante no encontrado |
| 1.1 §5 Casos límite | §1 Casos límite | selectedCourses vacío, studentId null, créditos insuficientes |
| 1.1b Herramientas | §2 Jest | jest.config.js, tests/setup.js con variables de entorno |

### 1.2 Generation Controller (14 tests) — NUEVO

```bash
cd backend && npx jest tests/unit/controllers/generation.controller.test.js --verbose
```

| testing_b.md | Rúbrica | Qué verificar |
|---|---|---|
| 1.1 §1 Servicios/controladores | §1 completas | generate, getAll, getById, restore, remove |
| 1.1 §2 Reglas de negocio | §1 Lógica crítica | Validación cursos activos, docentes, aulas disponibles |
| 1.1 §3 Mocks | §1 Mocks correctos | jest.mock 7 modelos + motor CSP completo con runCSPMultiple |
| 1.1 §4 Excepciones | §1 Manejo excepciones | Fallo motor CSP, DB error, 404 not found |
| 1.1 §5 Casos límite | §1 Casos límite | Sin cursos activos, sin docentes, sin aulas, generación no completada |

### 1.3 Tests backend existentes

```bash
cd backend && npm test -- --verbose
```

| testing_b.md | Rúbrica | Cobertura existente |
|---|---|---|
| 1.1 §1 Controladores | §1 | auth, campus, classroom, course, dashboard, student, teacher (7 controllers) |
| 1.1 §1 Utilitarios | §1 | db.test.js, config.jwt.test.js (config) |
| 1.1 §1 Middleware | §1 | auth, cache, errorHandler, roleGuard (4 middleware) |
| 1.1 §2 Reglas negocio | §1 | constraints.test.js RD-01 a RD-14 (28 tests), csp.test.js (12 tests) |
| 1.1 §3 Mocks/stubs | §1 | mockData.js (factories), auth.controller mocks por modelo |
| 1.1c Evidencias | §3 | Reportes HTML en backend/coverage/, LCOV en coverage/lcov.info |

---

## 2. Pruebas de Componentes React

**testing_b.md §1.2** — Actividades: 1º Renderizado, 2º Eventos, 3º Estados, 4º Renderizado condicional, 5º Formularios, 6º Dependencias externas. Escenarios: carga asincrónica, formularios, error, vacío, carga.

**Rúbrica §4** — Valida renderizado, eventos, estados, formularios, dependencias externas. **Rúbrica §5** — Cobertura escenarios obligatorios: carga, error, vacío, formularios, operaciones asincrónicas.

### 2.1 StatCard (6 tests) — NUEVO

```bash
cd frontend && npx vitest run src/tests/components/StatCard.test.jsx
```

| testing_b.md §1.2 | Rúbrica | Qué verificar |
|---|---|---|
| 1º Renderizado | §4 Renderizado | Título, valor, label se renderizan |
| | §4 Renderizado | Sin título no causa error |
| 3º Estados | §4 Estados | Subtítulo opcional se muestra |
| 2º Eventos visuales | §4 | Color personalizado en label |
| 6º Dependencias | §4 | Icono se renderiza con background |
| 1.1 §5 Casos límite | §1 | value null/undefined no lanza error |

### 2.2 QualityChart (6 tests) — NUEVO

```bash
cd frontend && npx vitest run src/tests/components/QualityChart.test.jsx
```

| testing_b.md §1.2 | Rúbrica | Qué verificar |
|---|---|---|
| 1º Renderizado | §4 Renderizado | Título "Calidad de la solución" |
| 3º Estados | §4 Estados | Score 92% por defecto, personalizado, 0 y 100 |
| | §4 | Métricas: constraints, preferencias, recursos, distribución |
| | §4 | Métricas personalizadas sobrescriben defaults |

### 2.3 ScheduleCell (7 tests) — NUEVO

```bash
cd frontend && npx vitest run src/tests/components/ScheduleCell.test.jsx
```

| testing_b.md §1.2 | Rúbrica | Qué verificar |
|---|---|---|
| 1º Renderizado | §4 Renderizado | Celda vacía (null assignment) y con contenido |
| 2º Eventos | §4 Eventos | Click y Enter key disparan onClick |
| | §4 | onClick undefined no lanza error |
| 4º Condicional | §4 Renderizado condicional | empty-cell vs has-content, nombre por defecto "Curso" |
| 6º Dependencias | §4 | Color personalizado aplicado al course name |

### 2.4 DashboardPage (8 tests) — NUEVO

```bash
cd frontend && npx vitest run src/tests/pages/DashboardPage.test.jsx
```

| testing_b.md §1.2 | Rúbrica | Qué verificar |
|---|---|---|
| 1º Renderizado | §4 Renderizado | Mensaje bienvenida, stat cards |
| 3º Estados | §4 Estados | Error de conexión se muestra |
| 5º Formularios/Botones | §4 | Botón "Generar horario" solo coordinador, "Matrícula" estudiante |
| Escenario: carga asincrónica | §5 Operaciones asincrónicas | fetch de stats, notifications, generations |
| Escenario: estado vacío | §5 Estado vacío | "No hay horarios generados aún" |
| Escenario: estado error | §5 Estado de error | Error de conexión |
| | §5 | Vista coordinador (4 stat cards), docente (perfil), estudiante (avance) |

### 2.5 Componentes existentes

```bash
cd frontend && npx vitest run src/tests/components/
```

| testing_b.md §1.2 | Rúbrica | Componentes |
|---|---|---|
| 1º Renderizado | §4 | DataTable, Modal, AlertPanel, ErrorBoundary |
| 2º Eventos | §4 Eventos | Modal (overlay, close), Header (click notificaciones, logout) |
| 3º Estados | §4 Estados | AuthContext (login/logout), Sidebar (3 roles) |
| 4º Condicional | §4 Renderizado condicional | ErrorBoundary (error fallback) |
| 5º Formularios | §4 Formularios | LoginPage (campos, validación) |
| 6º Dependencias externas | §4 MSW | handlers.js con 5 endpoints REST |
| Escenario: carga | §5 Estado carga | LoginPage spinner + botón disabled |
| Escenario: vacío | §5 Estado vacío | DataTable empty, AlertPanel vacío |
| Escenario: error | §5 Estado error | LoginPage error msg + cleanup |
| **Herramientas §1.2b** | **§6 RTL + MSW** | setupTests.js (MSW lifecycle), vitest.config.js (jsdom) |

---

## 3. Pruebas de Integración

**testing_b.md §1.3** — Actividades: 1º Endpoints REST, 2º CRUD, 3º Auth, 4º HTTP codes, 5º JSON, 6º Persistencia, 7º Errores. Escenarios: válidas, inválidas, no autorizado, inconsistentes, errores servidor.

**Rúbrica §7** — Implementa pruebas de integración; valida CRUD, seguridad, persistencia, errores. **Rúbrica §8** — Cobertura: válidas, inválidas, no autorizado, inconsistencias, errores. **Rúbrica §9** — Supertest, RTL, MSW.

### 3.1 API Integration (15 tests)

```bash
cd backend && npx jest tests/integration/api.test.js --verbose
```

| testing_b.md §1.3 | Rúbrica | Qué verificar |
|---|---|---|
| 1º Endpoints REST | §7 APIs | health, sustainability, auth, courses, teachers, students, classrooms |
| 2º CRUD | §7 CRUD | Create → Read → Update → Delete course + verificar 404 |
| 3º Auth | §7 Autenticación | Register, login, profile |
| 3º Autorización | §7 Autorización | Profile sin token (401), teachers/students sin auth (403) |
| 4º HTTP codes | §7 HTTP | 200, 201, 400 (duplicate), 401 (no auth), 404 (not found) |
| 5º JSON | §7 JSON | Estructura response, propiedades esperadas |
| 6º Persistencia | §7 Persistencia | MongoMemoryServer, CRUD sobre DB real en memoria |
| 7º Errores | §7 Manejo errores | Register duplicado, course no encontrado |
| Escenario: válidas | §8 Peticiones válidas | Health check, login correcto, CRUD course |
| Escenario: inválidas | §8 Peticiones inválidas | Register duplicado |
| Escenario: no autorizado | §8 Acceso no autorizado | Profile sin token, teachers/students sin auth |
| Herramientas §1.3b | §9 Supertest | request(app).get/post/put/delete |
| Herramientas §1.3b | §9 | mongodb-memory-server para BD aislada |

---

## 4. Pruebas de Aceptación (Cypress)

**testing_b.md §1.4** — Actividades: 1º Escenarios funcionales, 2º Reglas negocio, 3º Flujos principales, 4º Interacción usuario, 5º Formularios/navegación. Escenarios: registro/login, gestión datos, navegación, errores, validaciones.

**Rúbrica §10** — Automatiza escenarios funcionales críticos; simula comportamiento real. **Rúbrica §11** — Cobertura: login, navegación, gestión datos, errores, validaciones. **Rúbrica §12** — Evidencias: videos, capturas, logs, resultados.

### 4.1 Registration (5 tests) — NUEVO

```bash
cd frontend && npx cypress run --spec "cypress/e2e/registration.cy.js"

cd frontend && npm run cypress:registration
```
 evidencia: video y captura en : C:\planner_UC\frontend\cypress\videos\registration.cy.js.mp4

| testing_b.md §1.4 | Rúbrica | Qué verificar |
|---|---|---|
| 1º Escenarios funcionales | §10 Automatización | Opciones acceso rápido 3 roles visibles |
| 4º Interacción usuario | §10 Simulación real | Click Coordinador → campos se llenan → redirect |
| 4º Interacción usuario | §10 | Click Docente → campos se llenan |
| 4º Interacción usuario | §10 | Click Estudiante → campos se llenan |
| 5º Formularios | §10 Validaciones | Campos email/password con atributo required |

### 4.2 Tests de Aceptación existentes

```bash
cd frontend && npx cypress run
```
Videos:
-  Video output: C:\planner_UC\frontend\cypress\videos\validation.cy.js.mp4
-  Video output: C:\planner_UC\frontend\cypress\videos\registration.cy.js.mp4
- Video output: C:\planner_UC\frontend\cypress\videos\navigation.cy.js.mp4
- Video output: C:\planner_UC\frontend\cypress\videos\login.cy.js.mp4
- Video output: C:\planner_UC\frontend\cypress\videos\crud.cy.js.mp4

| testing_b.md §1.4 | Rúbrica | Archivo | Tests |
|---|---|---|---|
| Escenario: registro/login | §11 Registro/login | login.cy.js | 6 (formulario, acceso rápido, error, spinner, disabled, quick fill) |
| Escenario: registro/login | §11 | registration.cy.js | 5 (3 roles, campos) |
| Escenario: gestión datos | §11 Gestión datos | crud.cy.js | 5 (campus, courses, classrooms, students, teachers) |
| Escenario: navegación | §11 Navegación | navigation.cy.js | 2 (redirect, 404) |
| Escenario: errores | §11 Manejo errores | login.cy.js | Invalid credentials |
| Escenario: validaciones | §11 Validaciones | validation.cy.js | 3 (email formato, vacío, password) |
| Evidencias §1.4d | §12 Videos | (auto) | video: true, screenshots on failure |
| Evidencias §1.4d | §12 Resultados | cypress.config.js | Reporter JUnit → docs/testing/ |

---

## 5. Pruebas End-to-End (Playwright)

**testing_b.md §1.5** — Actividades: Golden Path, Happy Path, Unhappy Path. Escenarios: navegación completa, persistencia, seguridad, errores, recuperación, multiusuario.

**Rúbrica §13** — Golden Path, Happy Path, Unhappy Path. **Rúbrica §14** — Navegación, persistencia, seguridad, errores, recuperación. **Rúbrica §15** — Evidencias: videos, capturas, logs, reportes.

### 5.1 Persistence (4 tests) — NUEVO (se sobreescribe)

```bash
npx playwright test e2e/persistence.spec.js
```
videos: http://localhost:9323

| testing_b.md §1.5 | Rúbrica | Qué verificar |
|---|---|---|
| Golden Path | §13 Golden Path | Login exitoso → dashboard con "Hola" |
| Happy Path | §13 Happy Path | Sesión persiste: dashboard → courses → dashboard |
| Happy Path | §14 Persistencia | Navegación a /campus mantiene sesión |
| Happy Path | §14 Navegación | Navegación a /teachers mantiene sesión |

### 5.2 Security (7 tests) — NUEVO
http://localhost:9323

```bash
npx playwright test e2e/security.spec.js
```

| testing_b.md §1.5 | Rúbrica | Qué verificar |
|---|---|---|
| Unhappy Path | §13 Unhappy Path | Sin auth → redirect /login (varias rutas) |
| Seguridad | §14 Seguridad | Token inválido → redirect /login |
| Manejo errores | §14 Errores | Credenciales inválidas → .login-error visible |
| Manejo errores | §14 Errores | Campos vacíos → validation message no vacío |
| Recuperación | §14 Recuperación | Token inválido → login redirect (recuperación) |

### 5.3 Tests E2E existentes

```bash
npx playwright test
```

| testing_b.md §1.5 | Rúbrica | Archivo |
|---|---|---|
| Golden Path | §13 | auth.spec.js login redirects to dashboard |
| Happy Path | §13 | auth.spec.js quick login fills fields |
| Unhappy Path | §13 | auth.spec.js invalid creds, empty fields |
| Seguridad | §14 | navigation.spec.js redirect sin auth (/, /dashboard, /campus) |
| Errores | §14 | navigation.spec.js ruta 404 no lanza error |
| Evidencias §1.5d | §15 | playwright.config.js: video retain-on-failure, screenshots, traces, HTML report |

---

## 6. Cobertura y Calidad

**testing_b.md §1.6** — Actividades: 1º Reportes cobertura, 2º Análisis módulos, 3º Componentes críticos, 4º Exclusiones, 5º Riesgos, 6º Defectos. Métricas: global ≥ 70%, lógica crítica ≥ 85%. Evidencias: HTML/LCOV, capturas, análisis técnico, justificación exclusiones.

**Rúbrica §16** — Reportes detallados, análisis riesgos, defectos, exclusiones justificadas. **Rúbrica §17** — Cobertura global ≥ 70%, lógica crítica ≥ 85%.

### 6.1 Reportes de Cobertura

```bash
# Backend
cd backend && npm test
# Abrir backend/coverage/lcov-report/index.html

# Frontend
cd frontend && npm test
# Abrir frontend/coverage/index.html
```

| testing_b.md §1.6 | Rúbrica | Estado actual |
|---|---|---|
| 1º Reportes HTML | §16 HTML/LCOV | ✅ backend/coverage/, frontend/coverage/ |
| 1º Reportes LCOV | §16 | ✅ backend/coverage/lcov.info, frontend/coverage/lcov.info |
| 2º Módulos cubiertos | §16 Análisis | ✅ COVERAGE_ANALYSIS.md |
| 3º Componentes críticos | §16 Identificación | ✅ Riesgos documentados |
| 4º Exclusiones | §16 Justificadas | ✅ seed/, node_modules/ excluidos |
| 5º Riesgos | §16 Análisis | ✅ 7 riesgos con impacto y mitigación |
| Métrica global ≥ 70% | §17 Cobertura global | ⚠️ Backend ~45%, Frontend ~9.29% (parcial) |
| Lógica crítica ≥ 85% | §17 Lógica crítica | ✅ Backend ~94% |

### 6.2 Análisis documentado

```bash
# Abrir documento de análisis
code docs/testing/COVERAGE_ANALYSIS.md
```

| testing_b.md §1.6c | Rúbrica | Archivo |
|---|---|---|
| 3º Análisis técnico | §16 | docs/testing/COVERAGE_ANALYSIS.md |
| 4º Justificación exclusiones | §16 | COVERAGE_ANALYSIS.md:75 (modelos, engine no medido) |
| 5º Defectos encontrados | §16 | COVERAGE_ANALYSIS.md:78-86 (riesgos como defectos potenciales) |

---

## 7. Organización del Repositorio

**testing_b.md §3** — Estructura organizada, ramas, commits descriptivos, separación código/pruebas, README técnico, instrucciones ejecución.

**Rúbrica §18** — Repositorio profesional, ramas, commits claros, documentación, instrucciones.

| testing_b.md §3 | Rúbrica | Ubicación |
|---|---|---|
| a. Estructura organizada | §18 | backend/, frontend/, e2e/, docs/ |
| b. Ramas desarrollo | §18 | .git (branches) |
| c. Commits descriptivos | §18 | .git (commits) |
| d. Separación código/pruebas | §18 | backend/tests/ separado de controllers/, frontend/src/tests/ separado de src/ |
| e. README técnico | §18 | README.md |
| f. Instrucciones ejecución | §18 | README.md, package.json scripts |

---

## 8. Resumen rápido por documento

### Por testing_b.md

| Sección | Comando | Total tests |
|---|---|---|
| §1.1 Unit testing | `cd backend && npm test` | ~140 (incluye 29 nuevos) |
| §1.2 Component testing | `cd frontend && npx vitest run src/tests/components/` | ~48 (incluye 19 nuevos) |
| §1.3 Integration | `cd backend && npx jest tests/integration/api.test.js` | 15 |
| §1.4 Acceptance | `cd frontend && npx cypress run` | 20 (incluye 5 nuevos) |
| §1.5 E2E | `npx playwright test` | 17 (incluye 11 nuevos) |
| §1.6 Coverage | `cd backend && npm test` + `cd frontend && npm test` | Reportes HTML/LCOV |

### Por rubrica_test.md

| Rúbrica | Comando |
|---|---|
| §1 Unit tests (completas) | `cd backend && npm test -- --verbose` |
| §2 Herramientas (Jest, RTL) | Verificar jest.config.js, vitest.config.js, setupTests.js |
| §3 Evidencias unitarias | Abrir backend/coverage/index.html |
| §4 Componentes React | `cd frontend && npx vitest run src/tests/components/` |
| §5 Escenarios obligatorios | `cd frontend && npx vitest run src/tests/pages/ src/tests/components/` |
| §6 RTL + MSW | Verificar setupTests.js (MSW lifecycle), handlers.js |
| §7 Integración APIs | `cd backend && npx jest tests/integration/api.test.js --verbose` |
| §8 Escenarios integración | Mismo comando §7 |
| §9 Supertest + RTL + MSW | Verificar api.test.js, setupTests.js |
| §10 Aceptación Cypress | `cd frontend && npx cypress run` |
| §11 Escenarios aceptación | `cd frontend && npx cypress run` (20 tests) |
| §12 Evidencias aceptación | Revisar cypress/videos/ y cypress/screenshots/ |
| §13 E2E Golden/Happy/Unhappy | `npx playwright test` |
| §14 Escenarios E2E | `npx playwright test e2e/security.spec.js e2e/persistence.spec.js` |
| §15 Evidencias E2E | Revisar docs/testing/e2e-report/ |
| §16 Análisis cobertura | Abrir docs/testing/COVERAGE_ANALYSIS.md |
| §17 Métricas cobertura | Ver reportes HTML en backend/coverage/ y frontend/coverage/ |
| §18 Organización repo | Verificar estructura, README.md, ramas git |
| §19 Calidad técnica | Verificar total tests (~240+), mocks, MSW, spies |
