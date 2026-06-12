# Mapeo Rúbrica → Implementación (Ubicación exacta)

Cada punto de `rubrica_test.md` mapeado a su ubicación exacta en el proyecto.

---

## 1. Pruebas Unitarias — Servicios, Controladores, Utilitarios

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Pruebas completas y organizadas | Backend controllers (9/21) | `backend/tests/unit/controllers/` |
| | Backend middleware (4/4) | `backend/tests/unit/middleware/` |
| | Backend config (2) | `backend/tests/unit/config/db.test.js`, `backend/tests/unit/utils/config.jwt.test.js` |
| | Backend engine (2) | `backend/tests/csp.test.js`, `backend/tests/unit/engine/constraints.test.js` |
| | Frontend utils (2) | `frontend/src/tests/utils/helpers.test.js`, `frontend/src/tests/utils/constants.test.js` |
| Lógica crítica cubierta | auth.controller.test.js:22-146 | `backend/tests/unit/controllers/auth.controller.test.js` |
| | generation.controller.test.js:78-168 | `backend/tests/unit/controllers/generation.controller.test.js` |
| | constraints.test.js:1-327 | `backend/tests/unit/engine/constraints.test.js` |
| | csp.test.js:1-249 | `backend/tests/csp.test.js` |
| Excepciones | errorHandler.test.js:1-71 | `backend/tests/unit/middleware/errorHandler.test.js` |
| | enrollment.controller.test.js (next errors) | `backend/tests/unit/controllers/enrollment.controller.test.js` |
| | generation.controller.test.js (next errors) | `backend/tests/unit/controllers/generation.controller.test.js` |
| Casos límite | enrollment: cursos vacíos, student null | `backend/tests/unit/controllers/enrollment.controller.test.js:93-110` |
| | generation: sin cursos, sin docentes, sin aulas | `backend/tests/unit/controllers/generation.controller.test.js:131-155` |
| | helpers.test.js: null, undefined, empty strings | `frontend/src/tests/utils/helpers.test.js` |
| | constraints: null inputs (RD03, RD04, RD12, RD14) | `backend/tests/unit/engine/constraints.test.js` |
| Mocks, Stubs, Spies | auth.controller.test.js (jest.mock models) | `backend/tests/unit/controllers/auth.controller.test.js:8-10` |
| | enrollment.controller.test.js (jest.mock 4 models) | `backend/tests/unit/controllers/enrollment.controller.test.js:1-16` |
| | generation.controller.test.js (jest.mock 7 models + CSP) | `backend/tests/unit/controllers/generation.controller.test.js:1-27` |
| | AuthContext.test.jsx (vi.mock axios) | `frontend/src/tests/context/AuthContext.test.jsx:23-30` |
| | DashboardPage.test.jsx (vi.mock axios) | `frontend/src/tests/pages/DashboardPage.test.jsx:14-20` |
| | config.jwt.test.js (spy process.exit) | `backend/tests/unit/utils/config.jwt.test.js` |

## 2. Uso correcto de herramientas obligatorias

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Jest configurado (backend) | jest.config.js:1-27 | `backend/jest.config.js` |
| Vitest configurado (frontend) | vitest.config.js:1-31 | `frontend/vitest.config.js` |
| React Testing Library | setupTests.js:1-13 | `frontend/src/tests/setupTests.js` |
| | Tests de componentes | `frontend/src/tests/components/*.test.jsx` |
| Supertest configurado | api.test.js:1-10 | `backend/tests/integration/api.test.js` |
| MSW configurado | server.js + handlers.js | `frontend/src/tests/mocks/server.js`, `frontend/src/tests/mocks/handlers.js` |
| Vitest coverage config | coverage provider v8, HTML+lcov | `frontend/vitest.config.js:11-29` |
| Jest coverage config | HTML+lcov+text+clover+json | `backend/jest.config.js:22-23` |
| E2E Playwright | playwright.config.js:1-22 | `playwright.config.js` |
| E2E Cypress | cypress.config.js:1-15 | `frontend/cypress.config.js` |

## 3. Evidencias de pruebas unitarias

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Código fuente completo | backend/tests/ (23 archivos) | `backend/tests/**/*.test.js` |
| | frontend/src/tests/ (15 archivos) | `frontend/src/tests/**/*.{test,spec}.{js,jsx}` |
| Reportes de cobertura (HTML) | backend/coverage/index.html | `backend/coverage/` |
| | frontend/coverage/index.html | `frontend/coverage/` |
| Reportes LCOV | backend/coverage/lcov.info | `backend/coverage/lcov.info` |
| | frontend/coverage/lcov.info | `frontend/coverage/lcov.info` |
| Documentación de cobertura | COVERAGE_ANALYSIS.md:1-109 | `docs/testing/COVERAGE_ANALYSIS.md` |

## 4. Pruebas de Componentes React

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Renderizado | AlertPanel.test.jsx:12-24 (todos los tipos) | `frontend/src/tests/components/AlertPanel.test.jsx` |
| | DataTable.test.jsx:12-26 (headers + datos) | `frontend/src/tests/components/DataTable.test.jsx` |
| | StatCard.test.jsx:7-15 (título, valor, label) | `frontend/src/tests/components/StatCard.test.jsx` |
| | QualityChart.test.jsx:7-14 (score + métricas) | `frontend/src/tests/components/QualityChart.test.jsx` |
| | ScheduleCell.test.jsx:7-23 (vacía + contenido) | `frontend/src/tests/components/ScheduleCell.test.jsx` |
| Eventos | Header.test.jsx (click notificaciones, logout) | `frontend/src/tests/components/Header.test.jsx` |
| | Modal.test.jsx (overlay click, close button) | `frontend/src/tests/components/Modal.test.jsx` |
| | ScheduleCell.test.jsx:37-57 (click + Enter key) | `frontend/src/tests/components/ScheduleCell.test.jsx` |
| Estados | AuthContext.test.jsx (login/logout) | `frontend/src/tests/context/AuthContext.test.jsx` |
| | Sidebar.test.jsx (3 roles) | `frontend/src/tests/components/Sidebar.test.jsx` |
| Renderizado condicional | ErrorBoundary.test.jsx (error fallback) | `frontend/src/tests/components/ErrorBoundary.test.jsx` |
| | ScheduleCell.test.jsx:7-15 (assignment null) | `frontend/src/tests/components/ScheduleCell.test.jsx` |
| Formularios | LoginPage.test.jsx (campos, validación) | `frontend/src/tests/pages/LoginPage.test.jsx` |
| Dependencias externas (MSW) | handlers.js (5 handlers REST) | `frontend/src/tests/mocks/handlers.js` |
| | server.js (MSW lifecycle) | `frontend/src/tests/mocks/server.js` |

## 5. Cobertura de escenarios obligatorios en Componentes

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Estado de carga (loading) | LoginPage.test.jsx:69-76 (spinner visible) | `frontend/src/tests/pages/LoginPage.test.jsx` |
| Estado vacío (sin datos) | DataTable.test.jsx:28-36 (empty message) | `frontend/src/tests/components/DataTable.test.jsx` |
| | AlertPanel.test.jsx:7-10 (alerts []) | `frontend/src/tests/components/AlertPanel.test.jsx` |
| | ScheduleCell.test.jsx:7-14 (null assignment) | `frontend/src/tests/components/ScheduleCell.test.jsx` |
| | DashboardPage.test.jsx:92-100 (sin horarios) | `frontend/src/tests/pages/DashboardPage.test.jsx` |
| Estado de error | LoginPage.test.jsx:77-84 (error mensaje) | `frontend/src/tests/pages/LoginPage.test.jsx` |
| | ErrorBoundary.test.jsx:16-26 (fallback UI) | `frontend/src/tests/components/ErrorBoundary.test.jsx` |
| | DashboardPage.test.jsx:53-62 (loadError) | `frontend/src/tests/pages/DashboardPage.test.jsx` |
| Formularios (validaciones) | LoginPage.test.jsx:24-28 (campos requeridos) | `frontend/src/tests/pages/LoginPage.test.jsx` |
| | LoginPage.test.jsx:62-68 (error se limpia) | `frontend/src/tests/pages/LoginPage.test.jsx` |
| Operaciones asincrónicas | LoginPage.test.jsx:56-61 (submit loading) | `frontend/src/tests/pages/LoginPage.test.jsx` |
| | DashboardPage.test.jsx:31-50 (fetch stats) | `frontend/src/tests/pages/DashboardPage.test.jsx` |
| | AuthContext.test.jsx (login asíncrono) | `frontend/src/tests/context/AuthContext.test.jsx` |

## 6. Uso de RTL y MSW

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| RTL configurado | setupTests.js (jest-dom matchers) | `frontend/src/tests/setupTests.js` |
| | vitest.config.js (jsdom environment) | `frontend/vitest.config.js` |
| MSW integrado | setupTests.js:8-13 (server lifecycle) | `frontend/src/tests/setupTests.js` |
| MSW handlers | handlers.js:1-65 | `frontend/src/tests/mocks/handlers.js` |
| | server.js:1-4 | `frontend/src/tests/mocks/server.js` |
| MSW + RTL combinados | Header.test.jsx (MSW notifications + RTL render) | `frontend/src/tests/components/Header.test.jsx` |
| | LoginPage.test.jsx (MSW auth + RTL form) | `frontend/src/tests/pages/LoginPage.test.jsx` |

## 7. Pruebas de Integración — APIs, CRUD, Auth

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Endpoints REST (10+) | api.test.js:23-203 | `backend/tests/integration/api.test.js` |
| CRUD completo (courses) | api.test.js:94-170 | `backend/tests/integration/api.test.js` |
| Autenticación (login) | api.test.js:48-82 | `backend/tests/integration/api.test.js` |
| Autorización (sin token) | api.test.js:83-87, 171-203 | `backend/tests/integration/api.test.js` |
| HTTP codes (200, 201, 400, 401, 404) | api.test.js (disperso) | `backend/tests/integration/api.test.js` |
| JSON responses | api.test.js:25-29 (health check) | `backend/tests/integration/api.test.js` |
| Persistencia (MongoMemoryServer) | api.test.js:1-18 | `backend/tests/integration/api.test.js` |
| Manejo de errores | api.test.js:48-52 (duplicate register) | `backend/tests/integration/api.test.js` |
| | campus.controller.test.js (DB error) | `backend/tests/unit/controllers/campus.controller.test.js` |

## 8. Cobertura de escenarios de Integración

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Peticiones válidas | api.test.js:23-47 (health + sustain) | `backend/tests/integration/api.test.js` |
| | api.test.js:94-155 (CRUD courses) | `backend/tests/integration/api.test.js` |
| Peticiones inválidas | api.test.js:48-52 (duplicate register) | `backend/tests/integration/api.test.js` |
| Acceso no autorizado | api.test.js:83-87 (profile sin token) | `backend/tests/integration/api.test.js` |
| | api.test.js:171-203 (teachers, students sin auth) | `backend/tests/integration/api.test.js` |
| Datos inconsistentes | enrollment.controller.test.js:93-110 (validation) | `backend/tests/unit/controllers/enrollment.controller.test.js` |
| Error interno servidor | errorHandler.test.js:1-71 | `backend/tests/unit/middleware/errorHandler.test.js` |

## 9. Uso correcto de Supertest, RTL y MSW

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Supertest (backend API) | api.test.js:1 (require supertest) | `backend/tests/integration/api.test.js` |
| | api.test.js:25 (request(app).get) | `backend/tests/integration/api.test.js` |
| RTL (frontend) | Todos los test frontend importan RTL | `frontend/src/tests/**/*.test.*` |
| MSW (frontend API mock) | setupTests.js:8-13 | `frontend/src/tests/setupTests.js` |
| | handlers.js endpoints mockeados | `frontend/src/tests/mocks/handlers.js` |

## 10. Pruebas de Aceptación con Cypress

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Login funcionamiento | login.cy.js:1-45 (6 tests) | `frontend/cypress/e2e/login.cy.js` |
| Registro/Acceso rápido | registration.cy.js:1-40 (5 tests) | `frontend/cypress/e2e/registration.cy.js` |
| Gestión datos CRUD | crud.cy.js:1-47 (5 tests) | `frontend/cypress/e2e/crud.cy.js` |
| Navegación | navigation.cy.js:1-11 (2 tests) | `frontend/cypress/e2e/navigation.cy.js` |
| Validaciones formulario | validation.cy.js:1-31 (3 tests) | `frontend/cypress/e2e/validation.cy.js` |
| Manejo de errores | login.cy.js:19-24 (invalid credentials) | `frontend/cypress/e2e/login.cy.js` |
| Reglas de negocio | crud.cy.js (redirect al loguearse) | `frontend/cypress/e2e/crud.cy.js` |

## 11. Cobertura de escenarios de Aceptación

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Registro/login | registration.cy.js (5 tests completos) | `frontend/cypress/e2e/registration.cy.js` |
| | login.cy.js (6 tests login) | `frontend/cypress/e2e/login.cy.js` |
| Gestión de datos | crud.cy.js (campus, courses, classrooms, students, teachers) | `frontend/cypress/e2e/crud.cy.js` |
| Navegación funcional | navigation.cy.js (redirect + 404) | `frontend/cypress/e2e/navigation.cy.js` |
| Manejo de errores | login.cy.js:19-24, validation.cy.js:6-30 | `frontend/cypress/e2e/` |
| Validaciones funcionales | validation.cy.js (email, vacío, password) | `frontend/cypress/e2e/validation.cy.js` |

## 12. Evidencias de pruebas de Aceptación

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Videos Cypress | (generados automáticamente) | `frontend/cypress/videos/` (configurado con `video: true`) |
| Screenshots | (en fallos automáticos) | `frontend/cypress/screenshots/` |
| Resultados exportados | (JUnit XML) | `docs/testing/cypress-results-*.xml` |
| Configuración reporter | cypress.config.js:10-13 | `frontend/cypress.config.js` |

## 13. Pruebas E2E — Playwright

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Golden Path (login exitoso) | auth.spec.js:4-10 | `e2e/auth.spec.js` |
| | persistence.spec.js:6-15 | `e2e/persistence.spec.js` |
| Happy Path (escenarios exitosos) | auth.spec.js:34-39 (quick access) | `e2e/auth.spec.js` |
| | persistence.spec.js:18-39 (navegación persistente) | `e2e/persistence.spec.js` |
| Unhappy Path (errores) | auth.spec.js:12-27 (invalid creds, empty) | `e2e/auth.spec.js` |
| | security.spec.js:1-68 (7 tests seguridad) | `e2e/security.spec.js` |
| | navigation.spec.js:4-7 (ruta 404) | `e2e/navigation.spec.js` |

## 14. Cobertura de escenarios E2E

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Navegación completa | persistence.spec.js:18-39 (dashboard → courses → dashboard) | `e2e/persistence.spec.js` |
| | persistence.spec.js:42-75 (campus, teachers) | `e2e/persistence.spec.js` |
| Persistencia información | persistence.spec.js:18-39 (sesión persiste) | `e2e/persistence.spec.js` |
| Seguridad | security.spec.js:1-68 (7 tests de acceso no autorizado) | `e2e/security.spec.js` |
| | auth.spec.js:29-32 (redirect a login) | `e2e/auth.spec.js` |
| Manejo de errores | security.spec.js:53-68 (invalid creds, empty fields) | `e2e/security.spec.js` |
| Recuperación ante fallos | security.spec.js:40-52 (invalid token → redirect login) | `e2e/security.spec.js` |

## 15. Evidencias E2E

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Videos (retain-on-failure) | playwright.config.js:14 | `playwright.config.js` |
| Screenshots (on failure) | playwright.config.js:13 | `playwright.config.js` |
| Reportes HTML | playwright.config.js:9 | `docs/testing/e2e-report/` |
| Traces (first retry) | playwright.config.js:12 | `playwright.config.js` |

## 16. Análisis de cobertura y calidad

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Reporte HTML backend | backend/coverage/index.html | `backend/coverage/` |
| Reporte HTML frontend | frontend/coverage/index.html | `frontend/coverage/` |
| Reporte LCOV backend | backend/coverage/lcov.info | `backend/coverage/lcov.info` |
| Reporte LCOV frontend | frontend/coverage/lcov.info | `frontend/coverage/lcov.info` |
| Análisis de cobertura | docs/testing/COVERAGE_ANALYSIS.md (93 líneas) | `docs/testing/COVERAGE_ANALYSIS.md` |
| Módulos cubiertos/no cubiertos | COVERAGE_ANALYSIS.md:64-76 | `docs/testing/COVERAGE_ANALYSIS.md` |
| Componentes críticos sin tests | COVERAGE_ANALYSIS.md:78-86 (riesgos) | `docs/testing/COVERAGE_ANALYSIS.md` |
| Exclusiones justificadas | COVERAGE_ANALYSIS.md:75 | `docs/testing/COVERAGE_ANALYSIS.md` |
| Riesgos detectados | COVERAGE_ANALYSIS.md:78-86 | `docs/testing/COVERAGE_ANALYSIS.md` |

## 17. Métricas mínimas de cobertura

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Cobertura global ≥ 70% (backend) | COVERAGE_ANALYSIS.md:68 (~45% actual) | `docs/testing/COVERAGE_ANALYSIS.md` |
| Cobertura global ≥ 70% (frontend) | COVERAGE_ANALYSIS.md:70 (~9.29% actual) | `docs/testing/COVERAGE_ANALYSIS.md` |
| Lógica crítica ≥ 85% (backend) | COVERAGE_ANALYSIS.md:69 (~94% ✅) | `docs/testing/COVERAGE_ANALYSIS.md` |
| Backend jest coverage config | jest.config.js:5-10 (collectCoverageFrom) | `backend/jest.config.js` |
| Frontend vitest coverage config | vitest.config.js:11-21 (coverage config) | `frontend/vitest.config.js` |

## 18. Organización del repositorio GitHub

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| Estructura organizada | Proyecto MERN estándar (backend, frontend, e2e, docs) | (raíz) |
| Separación código/pruebas | tests/ separado de src/ en backend y frontend | `backend/tests/`, `frontend/src/tests/` |
| README técnico | README.md | `README.md` |
| Instrucciones de ejecución | README.md, package.json scripts | `package.json`, `README.md` |
| Ramas de desarrollo | .git (branches) | (git) |
| Commits descriptivos | .git (commits) | (git) |

## 19. Calidad técnica global

| Sub-punto | Ubicación | Archivo |
|---|---|---|
| ~218 tests en total | backend: ~140 tests, frontend: ~80+ tests | `backend/tests/`, `frontend/src/tests/` |
| Pruebas E2E | 17 tests (Playwright) | `e2e/` |
| Pruebas aceptación | 20 tests (Cypress) | `frontend/cypress/e2e/` |
| Buenas prácticas: mocks | jest.mock en controllers | `backend/tests/unit/controllers/` |
| Buenas prácticas: MSW | handlers.js con errores | `frontend/src/tests/mocks/` |
| Buenas prácticas: spies | config.jwt.test.js (process.exit) | `backend/tests/unit/utils/config.jwt.test.js` |
| Buenas prácticas: setup global | setup.js (env vars), setupTests.js (MSW) | `backend/tests/setup.js`, `frontend/src/tests/setupTests.js` |
| Matriz cumplimiento | Este archivo | `mapping_rubrica_implementacion.md` |
