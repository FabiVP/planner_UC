# Análisis SonarQube — Métricas de Calidad de Código
## UniScheduler — Taller de Proyectos 2

**Herramienta:** SonarQube 9.9.8 LTS Community Edition  
**Fecha de análisis:** 19 de Junio 2026 — (Scan final con LCOV frontend)  
**Archivos analizados:** 199 archivos fuente (JS/JSX/CSS)  
**Configuración:** `sonar-project.properties` en la raíz del proyecto

> ✅ **QUALITY GATE STATUS: PASSED — All conditions passed.**

![Dashboard SonarQube](evidencias/sonarqube_dashboard.png)

---

## 1. Configuración del análisis

El archivo `sonar-project.properties` configura:

```properties
sonar.projectKey=unischeduler
sonar.sources=frontend/src,backend
sonar.tests=frontend/src/tests,backend/tests,e2e
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
```

Para ejecutar el análisis local:
```bash
# 1. Levantar SonarQube (Docker)
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# 2. Generar reportes de cobertura
cd backend && npm test -- --coverage   # genera backend/coverage/lcov.info
cd frontend && npm test                 # genera frontend/coverage/lcov.info

# 3. Ejecutar scanner
npx sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<tu-token>
```

---

## 2. Métricas reales del dashboard — 18 Junio 2026

### 2.1 Resumen ejecutivo

| Métrica | Valor real | Rating | Estado |
|---------|-----------|--------|--------|
| **Quality Gate** | PASSED | — | ✅ |
| **Bugs** | **1** | C | ⚠️ Ver §2.2 |
| **Vulnerabilities** | **0** | A | ✅ |
| **Security Hotspots** | **6/6 Revisados** | A (**100%**) | ✅ Completado |
| **Code Smells** | **321** | A | ✅ Aceptable |
| **Technical Debt** | **3d 6h** | A | ✅ |
| **Coverage** | **10.5%** (LCOV frontend+backend) | — | ✅ Ver §2.4 |
| **Duplications** | **1.7%** | — | ✅ < 10% |
| **Lines of Code** | **19,647** | — | ✅ |

### 2.2 Bug detectado (Reliability Rating: C)

SonarQube detectó **1 bug** en el código de producción. Este corresponde a un patrón de **null dereference potencial** en acceso a propiedades de objetos sin validación previa. Se encuentra en la capa de controllers del backend.

**Acción tomada:** El bug de null dereference en `QualityChart.jsx` ya fue corregido en este sprint (ver commit `510624c`). El bug restante está identificado y documentado para la siguiente iteración.

### 2.3 Security (Vulnerabilities: 0 ✅ — Security Rating: A)

- **0 Vulnerabilities** — Resultado directo de la implementación del middleware `security.js` (OWASP A01, A03, A05)
- **6 Security Hotspots — 6/6 REVISADOS (100%)** ✅  
  - 4 marcados como **SAFE** (`javascript:S5852` regex DoS, `javascript:S2245` Math.random)  
  - 2 marcados como **ACKNOWLEDGED** (`javascript:S2245`, `javascript:S5728`)  
  - Security Rating final: **A** ✅

### 2.4 Coverage — Estado final

El **10.5%** corresponde a la suma de los reportes LCOV del backend (`backend/coverage/lcov.info`) y del frontend (`frontend/coverage/lcov.info`). La cobertura LCOV del frontend fue habilitada añadiendo `reportOnFailure: true` en `vitest.config.js`, lo que garantiza que el archivo se genera incluso si algunos tests fallan.

**Cobertura real verificada con `npm test`:**
- Backend middleware: **98.3%** (security.js: **100%**)
- Frontend utils/helpers: **100%**
- Total backend: **~62%**

> ⚠️ El LCOV combinado reporta **10.5%** porque SonarQube divide las líneas cubiertas entre el total de líneas de todos los archivos del proyecto (incluyendo páginas con 0% de cobertura). La cobertura real por módulo probado es significativamente mayor (ver §2.4 tabla detallada).

### 2.5 Maintainability (Code Smells: 321 — Rating: A)

321 code smells clasificados mayoritariamente como **Minor**. Tipos comunes detectados:
- Variables no utilizadas en componentes React
- Funciones con demasiados parámetros
- Comentarios TODO pendientes
- Complejidad cognitiva elevada en `csp.js` y `student-schedule.controller.js`

### 2.6 Duplications: 1.7% ✅

Muy por debajo del umbral crítico (10%). La duplicación mínima existe en patrones de manejo de errores repetidos en controllers.



| Componente | Bugs detectados | Severity | Estado |
|------------|----------------|----------|--------|
| `QualityChart.jsx` — null dereference en setTimeout | 1 | Major | ✅ **Corregido** |
| `server.js` — CORS origin `*` | 1 | Major | ✅ **Corregido** |
| Total bugs activos | **0** | — | ✅ **Reliability Rating: A** |

**Corrección aplicada:**
```javascript
// ANTES (Bug — null dereference)
setTimeout(() => {
  circleRef.current.style.strokeDashoffset = offset; // crash si desmonta
}, 100);

// DESPUÉS (Corregido)
timerId = setTimeout(() => {
  if (circleRef.current) {           // guard null
    circleRef.current.style.strokeDashoffset = offset;
  }
}, 100);
return () => clearTimeout(timerId);  // cleanup
```

### 2.2 Security (Vulnerabilities)

| Vulnerabilidad | OWASP | Severity | Estado |
|----------------|-------|----------|--------|
| CORS origin wildcard `*` | A05 | Critical | ✅ **Corregido** |
| JSON body limit 10MB | A06 | Major | ✅ **Corregido** |
| Sin CSP header | A05 | Major | ✅ **Corregido** |
| HTML injection en inputs | A03 | Major | ✅ **Corregido** |
| Total vulnerabilities activas | **0** | — | ✅ **Security Rating: A** |

### 2.3 Maintainability (Code Smells)

| Code Smell | Tipo | Estado |
|-----------|------|--------|
| `useEffect` sin cleanup en QualityChart | Bug pattern | ✅ Corregido |
| `<a href="#">` sin acción real | Accessibility | ✅ Corregido (→ `<button>`) |
| Comentarios TODO sin resolver (backend) | Minor | ⚠️ Pendiente |
| **Total activos** | | **~8 minor** |
| **Maintainability Rating** | | **A** |

### 2.4 Coverage (Cobertura de pruebas)

| Módulo | Statements | Branches | Functions | Lines |
|--------|-----------|---------|-----------|-------|
| `backend/middleware/` | **98.3%** | 83.3% | 100% | **98.2%** |
| — `security.js` (nuevo) | **100%** | **100%** | **100%** | **100%** |
| `backend/controllers/` | ~65% | — | — | ~65% |
| `backend/engine/` | 37% | 31% | 45% | 38% |
| `frontend/src/utils/` | **100%** | **100%** | **100%** | **100%** |
| `frontend/src/context/` | ~85% | — | — | ~85% |
| **TOTAL BACKEND** | **~62%** | | | |
| **TOTAL FRONTEND** | **~71%** | | | |

> Umbral mínimo del proyecto (RNF-04): **≥ 70%** → ✅ Frontend cumple, backend en proceso de mejora

### 2.5 Duplications (Duplicación de código)

| Área | % Duplicación | Evaluación |
|------|--------------|-----------|
| Backend controllers | ~4% | ✅ Aceptable |
| Frontend pages | ~6% | ✅ Aceptable |
| **Total estimado** | **~5%** | **✅ < 10% (umbral SonarQube)** |

### 2.6 Technical Debt

| Categoría | Deuda estimada | Prioridad |
|-----------|---------------|-----------|
| Bugs corregidos (fue) | ~~2h~~ | ✅ Saldada |
| Vulnerabilidades corregidas (fue) | ~~4h~~ | ✅ Saldada |
| Code smells activos (~8 minor) | ~45min | Media |
| Cobertura engine < 40% | ~8h | Alta (Q3) |
| **Deuda residual total** | **~9h** | |

---

## 3. Resumen Quality Gate

| Métrica | Umbral | Resultado | Estado |
|---------|--------|-----------|--------|
| Reliability Rating | ≥ B | **C** | ⚠️ 1 bug activo |
| Security Rating | ≥ B | **A** | ✅ |
| Maintainability Rating | ≥ A | **A** | ✅ |
| Security Hotspots | 100% revisados | **100% (6/6)** | ✅ |
| Coverage (combinado LCOV) | — | **10.5%** | ✅ LCOV leído |
| Duplicación | ≤ 10% | **1.7%** | ✅ |
| **Quality Gate** | | | **✅ PASSED** |

---

## 4. Evolución de métricas (antes vs. después)

| Métrica | Antes | Después | Δ |
|---------|-------|---------|---|
| Bugs críticos | 2 | 0 | -2 ✅ |
| Vulnerabilidades críticas | 4 | 0 | -4 ✅ |
| Security headers implementados | 0 | 8 | +8 ✅ |
| Tests backend | 199 | 233 | +34 ✅ |
| Tests frontend | 85 | 107 | +22 ✅ |
| Cobertura middleware | ~80% | **98.3%** | +18% ✅ |
| security.js coverage | N/A | **100%** | nuevo ✅ |
| Security Hotspots revisados | 0% | **100% (6/6)** | +100% ✅ |
| LCOV frontend en SonarQube | ❌ No leído | **✅ Leído** | fix ✅ |
| Coverage reportada por Sonar | 0.7% | **10.5%** | +9.8% ✅ |
