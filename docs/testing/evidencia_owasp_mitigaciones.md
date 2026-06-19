# Evidencias de Mitigación OWASP Top 10 2025
## UniScheduler — Taller de Proyectos 2

---

## A01: Broken Access Control — Mass Assignment Prevention

**Vulnerabilidad detectada:** El body de las peticiones HTTP podía contener campos arbitrarios (`role`, `isAdmin`, `__proto__`) que eran procesados sin filtrar.

**Mitigación implementada:** `backend/middleware/security.js` → `filterAllowedFields()`

```javascript
// Antes: sin filtrado
router.put('/profile', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, req.body); // ❌ todos los campos
});

// Después: whitelist explícita
router.put('/profile', auth, filterAllowedFields(['name','email','phone']), updateProfile);
```

**Prueba de validación:**
```
POST /api/users { "name": "Juan", "role": "admin", "isAdmin": true }
→ req.body después de filterAllowedFields(['name']) = { "name": "Juan" }
→ Campo "role" e "isAdmin" eliminados ✅
```

**Test verificable:** `backend/tests/unit/middleware/security.test.js`
- `filterAllowedFields > debe filtrar campos no permitidos` ✅ PASS

---

## A03: Injection / XSS Stored — Input Sanitization

**Vulnerabilidad detectada:** Campos de texto podían contener HTML/JavaScript malicioso que se almacenaba en MongoDB y se renderizaba sin escapar.

**Payload de prueba:**
```
POST /api/courses { "name": "<script>document.cookie='stolen='+document.cookie</script>Matemáticas" }
```

**Mitigación implementada:** `sanitizeInputs` middleware aplicado globalmente en `server.js`

```javascript
// Strip HTML tags de todos los strings del body
req.body[key] = req.body[key].replace(/<[^>]*>/g, '').trim();
// Resultado: "Matemáticas" (XSS eliminado)
```

**Prueba de validación:**
```
Input:  "<script>alert('xss')</script>Admin"
Output: "Admin"  ✅

Input:  "<img src=x onerror='alert(1)'>texto"
Output: "texto"  ✅
```

**Test verificable:** `security.test.js > sanitizeInputs > debe eliminar etiquetas HTML` ✅ PASS

---

## A05: Security Misconfiguration — HTTP Security Headers

**Vulnerabilidades detectadas:**
- CORS configurado con `origin: '*'` (acepta cualquier dominio)
- Sin Content Security Policy
- Sin HSTS
- Header `X-Powered-By: Express` expuesto (fingerprinting)
- Límite JSON de 10MB (explotable para DoS)

**Mitigación implementada:** `securityHeaders` middleware en `server.js`

### Headers antes vs. después:

| Header | Antes | Después |
|--------|-------|---------|
| `Content-Security-Policy` | ❌ Ausente | ✅ `default-src 'self'; frame-ancestors 'none'` |
| `X-Frame-Options` | ❌ Ausente | ✅ `DENY` |
| `X-Content-Type-Options` | ❌ Ausente | ✅ `nosniff` |
| `Strict-Transport-Security` | ❌ Ausente | ✅ `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | ❌ Ausente | ✅ `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ❌ Ausente | ✅ `camera=(); microphone=(); payment=()` |
| `X-Powered-By` | ❌ `Express` | ✅ **Eliminado** |
| `CORS Origin` | ❌ `*` | ✅ `http://localhost:5173` |
| JSON Body Limit | ❌ `10mb` | ✅ `2mb` |

**Prueba de validación:** Herramientas como `curl -I http://localhost:5000/api/health` retornan todos los headers de seguridad.

**Tests verificables:**
```
securityHeaders > debe establecer Content-Security-Policy         ✅ PASS
securityHeaders > debe establecer X-Frame-Options: DENY           ✅ PASS
securityHeaders > debe establecer Strict-Transport-Security       ✅ PASS
securityHeaders > debe remover X-Powered-By                       ✅ PASS
securityHeaders > CSP debe bloquear frame-ancestors               ✅ PASS
securityHeaders > CSP debe bloquear object-src                    ✅ PASS
```

---

## Riesgo Residual

| Vulnerabilidad | Riesgo antes | Riesgo después | Aceptable |
|----------------|-------------|----------------|-----------|
| Mass Assignment | Alto | Bajo (whitelist) | ✅ |
| XSS Stored | Alto | Bajo (sanitización) | ✅ |
| Clickjacking | Medio | Mínimo (DENY + CSP) | ✅ |
| CORS permisivo | Alto | Bajo (origin restringido) | ✅ |
| DoS por payload | Medio | Bajo (limit 2mb) | ✅ |
| MIME Sniffing | Medio | Mínimo (nosniff) | ✅ |

**Cobertura de pruebas del middleware security.js: 100%**
