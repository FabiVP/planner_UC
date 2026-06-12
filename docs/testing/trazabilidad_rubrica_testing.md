# Matriz de Trazabilidad: Rúbrica → Puntos de Creación en testing_asegu.md

Cada punto de la rúbrica (`rubrica_test.md`) se mapea a las fases y requisitos específicos de creación en `testing_asegu.md`.

---

## 1. Pruebas Unitarias — Servicios, Controladores, Utilitarios

| Rúbrica | Punto(s) de creación en testing_asegu.md |
|---|---|
| Implementa pruebas unitarias completas y organizadas | Fase 2 (Líneas 56–142): Servicios, Controladores, Utilitarios, Lógica crítica |
| Cubre lógica crítica | Fase 2 §4 — "Lógica crítica": reglas de negocio, restricciones, condiciones especiales (L104–106) |
| Cubre excepciones | Fase 2 §6 — "Excepciones": throw Error, errores personalizados, promesas rechazadas (L117–123) |
| Casos límite | Fase 2 §7 — "Casos límite": null, undefined, strings vacíos, arrays vacíos, datos extremos (L125–132) |
| Mocks, stubs, spies | Fase 2 §5 — "Mocking": mocks, stubs, spies (L107–115) |
| Evidencia ejecución exitosa + casos adicionales | Fase 2 §Evidencias: código, logs, reportes, exitosas, fallidas, capturas (L134–142) |

## 2. Uso correcto de herramientas obligatorias (Unit Testing)

| Rúbrica | Punto(s) de creación |
|---|---|
| Configura e integra correctamente Jest, RTL, Vitest | Fase 2 §Herramientas (L67–76): Jest + RTL (frontend), Jest o Vitest (backend) |
| Automatiza ejecución | Fase 9 §4 — Archivos de configuración: jest.config, vitest.config, setupTests (L464–472) |
| Mantiene estructura profesional del entorno | Fase 8 — Organización del repositorio (L431–443) |

## 3. Evidencias de pruebas unitarias

| Rúbrica | Punto(s) de creación |
|---|---|
| Código fuente, logs, reportes, capturas | Fase 2 §Evidencias (L134–142): código, logs, reportes, pruebas exitosas/fallidas, capturas |
| Reportes claros y verificables | Fase 9 §6 — Evidencias: qué ejecutar, qué capturar, dónde guardar reportes (L486–489) |

## 4. Pruebas de Componentes React

| Rúbrica | Punto(s) de creación |
|---|---|
| Renderizado, eventos, estados, formularios | Fase 3 — Renderizado (L152–160), Eventos (L162–169), Estados (L171–176), Formularios (L185–191) |
| Dependencias externas simuladas | Fase 3 §Dependencias externas — MSW: APIs REST, respuestas exitosas/fallidas (L193–198) |
| Múltiples escenarios funcionales | Fase 3 §Escenarios obligatorios (L199–224) |

## 5. Cobertura de escenarios obligatorios en Componentes

| Rúbrica | Punto(s) de creación |
|---|---|
| Estados: carga, error, vacío | Fase 3 §§Estado de carga (L203–204), Estado vacío (L207–208), Estado de error (L211–212) |
| Validaciones | Fase 3 §Formularios — Validaciones completas (L215–216) |
| Operaciones asincrónicas | Fase 3 §Operaciones asincrónicas — fetch, axios, queries (L219–223) |
| Pruebas adicionales de robustez | Fase 3 (implícito en escenarios múltiples) |

## 6. Uso de RTL y MSW

| Rúbrica | Punto(s) de creación |
|---|---|
| RTL + MSW correctamente integrados | Fase 3 §Herramientas (L148–150): React Testing Library, MSW |
| Simula APIs complejas | Fase 3 §Dependencias externas + Fase 4 §MSW (L193–198, L249–251) |
| Buenas prácticas | Fase 9 §4 — MSW setup (L472) |

## 7. Pruebas de Integración — APIs, CRUD, Auth

| Rúbrica | Punto(s) de creación |
|---|---|
| CRUD | Fase 4 §CRUD (L257–261): Create, Read, Update, Delete |
| Autenticación y Autorización | Fase 4 §§Autenticación (L263–265), Autorización (L267–268) |
| Respuestas HTTP/JSON | Fase 4 §§HTTP (L270–278): 200, 201, 400, 401, 403, 404, 500; JSON (L280–285): estructura, tipos, contenido |
| Persistencia | Fase 4 §Persistencia (L287–293): inserción, actualización, eliminación, consulta |
| Manejo robusto de errores | Fase 4 §Manejo de errores (L295–300): servidor, validación, autenticación |

## 8. Cobertura de escenarios de Integración

| Rúbrica | Punto(s) de creación |
|---|---|
| Peticiones válidas e inválidas | Fase 4 §Escenarios (L302–306): válidas, inválidas, no autorizado, inconsistencias, error interno |
| Acceso no autorizado | Fase 4 §Escenarios — "Acceso no autorizado" (L304) |
| Inconsistencias y errores del servidor | Fase 4 §Escenarios — "Datos inconsistentes", "Error interno del servidor" (L305–306) |

## 9. Uso correcto de Supertest, RTL y MSW en Integración

| Rúbrica | Punto(s) de creación |
|---|---|
| Supertest (backend) | Fase 4 §Herramientas Backend — Supertest (L244–246) |
| RTL + MSW (frontend) | Fase 4 §Herramientas Frontend — RTL, MSW (L248–251) |
| Configuración profesional y automatizada | Fase 9 §4 (L464–472) |

## 10. Pruebas de Aceptación con Cypress

| Rúbrica | Punto(s) de creación |
|---|---|
| Automatización escenarios funcionales críticos | Fase 5 — registro, login, gestión datos, navegación, formularios, validaciones (L325–332) |
| Simula comportamiento real del usuario | Fase 5 (L315–332): perspectiva del usuario |
| Valida reglas complejas del negocio | Fase 5 §"Reglas críticas del negocio" (L331) |

## 11. Cobertura de escenarios de Aceptación

| Rúbrica | Punto(s) de creación |
|---|---|
| Login, navegación, gestión datos, errores | Fase 5 §Escenarios (L333–339): Registro, Login, Gestión datos, Navegación, Errores, Validaciones |
| Validaciones complementarias | Fase 5 (implícito en cobertura completa) |

## 12. Evidencias de pruebas de Aceptación

| Rúbrica | Punto(s) de creación |
|---|---|
| Videos automáticos, capturas, logs | Fase 5 §Evidencias (L341–347): videos Cypress, screenshots, logs, resultados exportados |
| Correctamente organizadas | Fase 8 (L431–443) + Fase 9 §6 (L486–489) |

## 13. Pruebas E2E — Golden Path, Happy Path, Unhappy Path

| Rúbrica | Punto(s) de creación |
|---|---|
| Golden Path (flujo principal sin errores) | Fase 6 §Golden Path (L354–356) |
| Happy Path (escenarios exitosos) | Fase 6 §Happy Path (L358–360) |
| Unhappy Path (errores controlados) | Fase 6 §Unhappy Path (L362–364) |
| Recuperación controlada ante errores | Fase 6 §Escenarios — Recuperación ante fallos (L371) |

## 14. Cobertura de escenarios E2E

| Rúbrica | Punto(s) de creación |
|---|---|
| Navegación completa, persistencia, seguridad | Fase 6 §Escenarios (L366–372): navegación, persistencia, seguridad, errores, recuperación, multiusuario |
| Errores y recuperación | Fase 6 §Escenarios — Manejo de errores + Recuperación ante fallos (L370–371) |
| Interacción multiusuario | Fase 6 §Escenarios — Multiusuario si aplica (L372) |

## 15. Evidencias E2E

| Rúbrica | Punto(s) de creación |
|---|---|
| Videos, capturas, logs, reportes | Fase 6 §Evidencias (L374–382): videos, screenshots, logs, reportes, exitosos y fallidos |
| Reportes profesionales y trazables | Fase 9 §7 — Reporte final (L491–498) |

## 16. Análisis de cobertura y calidad

| Rúbrica | Punto(s) de creación |
|---|---|
| Reportes detallados y análisis técnico | Fase 7 §§Reporte de cobertura (L389–394): HTML, LCOV; Análisis (L396–400) |
| Identifica riesgos y defectos | Fase 7 §§Componentes críticos (L402–406), Exclusiones (L408–412), Defectos (L414–420) |
| Exclusiones justificadas | Fase 7 §Exclusiones — archivos excluidos + razones (L408–412) |

## 17. Métricas mínimas de cobertura

| Rúbrica | Punto(s) de creación |
|---|---|
| Cobertura global ≥ 70% | Fase 7 §Métricas mínimas (L422–425) |
| Cobertura lógica crítica ≥ 85% | Fase 7 §Métricas mínimas (L427–429) |
| Supera métricas y cobertura consistente | Fase 7 (objetivo: superar métricas mínimas) |

## 18. Organización del repositorio GitHub

| Rúbrica | Punto(s) de creación |
|---|---|
| Estructura, ramas, commits descriptivos | Fase 8 (L431–443): estructura, separación código/pruebas, ramas, commits descriptivos |
| README técnico con instrucciones | Fase 8 §README técnico + instrucciones de ejecución (L442–443) |

## 19. Calidad técnica global

| Rúbrica | Punto(s) de creación |
|---|---|
| Solución robusta, mantenible, profesional | Fase 9 §Criterio de calidad máxima (L499–518): pruebas completas, buenas prácticas, justificación técnica |
| Matriz de cumplimiento final | Fase 9 §Auditoría final (L520–524): matriz requisito → cumple → evidencia |
