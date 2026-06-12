# Estrategia de Testing - UniScheduler

## Resumen

| Área | Framework | Tests | Estado |
|------|-----------|-------|--------|
| **Backend Unit** | Jest + Supertest | 165 | ✅ Passing |
| **Backend Integration** | Jest + Supertest + mongodb-memory-server | 15 | ✅ Passing |
| **Backend Total** | | **180** | ✅ **100%** |
| **Frontend Unit + Integration** | Vitest + React Testing Library + MSW | 80 | ✅ Passing |
| **Frontend Total** | | **80** | ✅ **100%** |
| **Total General** | | **260** | ✅ **100%** |
| **Aceptación (Cypress)** | Cypress | 16 | ⚡ Configurado |
| **E2E (Playwright)** | Playwright | 9 | ⚡ Configurado |

---

## Backend (Jest)

### Configuración
- `backend/jest.config.js` — Config Jest con node environment
- `backend/tests/setup.js` — Variables de entorno para entorno test
- `backend/tests/helpers/mockData.js` — Objetos mock reutilizables

### Tests Unitarios (112 tests)

**Middleware (18 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `tests/unit/middleware/auth.test.js` | 5 | 94.73% stmts |
| `tests/unit/middleware/roleGuard.test.js` | 4 | 100% stmts |
| `tests/unit/middleware/errorHandler.test.js` | 6 | 100% stmts |
| `tests/unit/middleware/cache.test.js` | 3 | 100% stmts |

**Controllers (68 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `tests/unit/controllers/auth.controller.test.js` | 10 | 91.66% stmts |
| `tests/unit/controllers/course.controller.test.js` | 11 | 84.9% stmts |
| `tests/unit/controllers/dashboard.controller.test.js` | 3 | 100% stmts |
| `tests/unit/controllers/campus.controller.test.js` | 12 | 100% stmts |
| `tests/unit/controllers/classroom.controller.test.js` | 12 | 100% stmts |
| `tests/unit/controllers/student.controller.test.js` | 12 | 100% stmts |
| `tests/unit/controllers/teacher.controller.test.js` | 18 | 100% stmts |

**Engine CSP (53 tests)**

**Engine CSP (53 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `tests/unit/engine/constraints.test.js` | 53 | RD-01 a RD-14 |

**Config (6 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `tests/unit/config/jwt.test.js` | 3 | 100% stmts |
| `tests/unit/config/db.test.js` | 1 | 37.5% stmts |
| `tests/csp.test.js` | 19 | — |

### Tests de Integración (15 tests)
| Archivo | Tests | Endpoints cubiertos |
|---------|-------|---------------------|
| `tests/integration/api.test.js` | 15 | GET /api/health, POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile, CRUD /api/courses, GET /api/teachers, GET /api/students, GET /api/classrooms |

---

## Frontend (Vitest + MSW)

### Configuración
- `frontend/vitest.config.js` — Vitest + jsdom + @vitejs/plugin-react + v8 coverage
- `frontend/src/tests/setupTests.js` — jest-dom matchers, cleanup automático, MSW server lifecycle
- `frontend/src/tests/mocks/handlers.js` — MSW handlers para API (auth, dashboard, notifications)
- `frontend/src/tests/mocks/server.js` — Servidor MSW (setupServer)

### Tests (80 tests)

**Utilities (36 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `src/tests/utils/helpers.test.js` | 24 | 100% stmts |
| `src/tests/utils/constants.test.js` | 12 | 100% stmts |

**Components (34 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `src/tests/components/DataTable.test.jsx` | 6 | 100% stmts |
| `src/tests/components/Modal.test.jsx` | 5 | 100% stmts |
| `src/tests/components/AlertPanel.test.jsx` | 3 | 100% stmts |
| `src/tests/components/ErrorBoundary.test.jsx` | 2 | 100% stmts |
| `src/tests/components/MainLayout.test.jsx` | 1 | 100% stmts |
| `src/tests/components/ScheduleGrid.test.jsx` | 2 | 100% stmts |
| `src/tests/components/Header.test.jsx` | 6 | 100% stmts |
| `src/tests/components/Sidebar.test.jsx` | 9 | 100% stmts |

**Pages (7 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `src/tests/pages/LoginPage.test.jsx` | 7 | 98.23% stmts |

**Context (3 tests)**
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `src/tests/context/AuthContext.test.jsx` | 3 | 78.12% stmts |

---

## Reportes de Cobertura

Los reportes HTML completos están disponibles en:
- Backend: `docs/testing/coverage-backend/index.html`
- Frontend: `docs/testing/coverage-frontend/index.html`

### Backend - Cobertura por capa

| Capa | % Statements | % Branch | % Functions | % Lines |
|------|-------------|----------|-------------|---------|
| Middleware | 97.59% | 80% | 100% | 97.5% |
| Models | 72.93% | 2.77% | 18.75% | 80.83% |
| Controllers (testeados) | 92.19% | 68.94% | 100% | 94.19% |
| Config | 44.44% | 62.5% | 60% | 44.44% |

### Frontend - Cobertura por capa

| Capa | % Statements | % Branch | % Functions | % Lines |
|------|-------------|----------|-------------|---------|
| Utils | 100% | 82.14% | 100% | 100% |
| Components UI | 100% | 92% | ~88% | 100% |
| Layout (Header, Sidebar) | 100% | 100% | 100% | 100% |
| Context | 78.12% | 85.71% | 66.66% | 78.12% |
| Pages (Login) | 98.23% | 85.71% | 100% | 98.23% |
| Pages (resto) | 0% | 0% | 0% | 0% |

---

## Análisis de Cumplimiento

Ver `docs/testing/COVERAGE_ANALYSIS.md` para matriz detallada contra la rúbrica.

---

## Cómo ejecutar los tests

```bash
# Backend
cd backend
npm test                        # Run all backend tests (127 tests)

# Frontend
cd frontend
npm test                        # Run all frontend tests (80 tests)
npm run cypress:open            # Cypress interactive mode
npm run cypress:run             # Cypress headless

# Raíz del proyecto
npm run test:all                # Run backend + frontend tests sequentially
npm run test:acceptance         # Run Cypress acceptance tests

# E2E (Playwright) - requiere backend + frontend running
npx playwright test             # Run all Playwright tests (9 tests)
npx playwright test --headed    # Run with browser visible
```

---

## E2E (Playwright)

Configuración disponible en `playwright.config.js`:
- `e2e/auth.spec.js` — 5 tests (Golden Path login, Unhappy Path: credenciales inválidas, email vacío, redirección sin auth, quick login)
- `e2e/navigation.spec.js` — 4 tests (404, login accesible, redirección dashboard, redirección campus)

Requisitos: backend y frontend corriendo.

```bash
npx playwright test
```

## Aceptación (Cypress)

Configuración disponible en `frontend/cypress.config.js`:
- `cypress/e2e/login.cy.js` — 6 tests (formulario, acceso rápido, error, spinner, botón disabled, llenado automático)
- `cypress/e2e/navigation.cy.js` — 2 tests (redirección sin auth, 404)
- `cypress/e2e/validation.cy.js` — 3 tests (email inválido, formulario vacío, password requerido)
- `cypress/e2e/crud.cy.js` — 5 tests (campus, courses, classrooms, students, teachers)

Requisitos: backend y frontend corriendo.

```bash
cd frontend
npm run cypress:run
```

---

## Resolución de Problemas

### MSW no intercepta peticiones
Verificar que en `setupTests.js` el server esté configurado con `server.listen()`. Si las peticiones no son interceptadas, agregar el handler faltante en `mocks/handlers.js`.

### "React is not defined"
Si los tests de componentes fallan con `React is not defined`, el archivo `setupTests.js` debe importar React y asignarlo a globalThis.

### mongodb-memory-server
Los tests de integración usan `mongodb-memory-server` automáticamente. Si falla, verificar que no haya otro proceso ocupando el puerto.

### Pruebas existentes (CSP)
Los tests en `tests/csp.test.js` son preexistentes y verifican el solver de restricciones del planificador.
