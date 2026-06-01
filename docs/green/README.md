# Iniciativa Green Engineering - UniScheduler

## Resumen Ejecutivo

Este documento describe las optimizaciones de **Green Engineering** aplicadas al backend de **UniScheduler**, un sistema MERN de generación óptima de horarios académicos con motor CSP.

### Objetivo

Reducir el consumo energético, las emisiones de CO₂ y la huella de carbono del backend mediante 4 técnicas de optimización:

1. **Índices MongoDB** — Eliminación de COLLSCANs, reducción de uso de CPU y disco
2. **Paginación de datos** — Límite de resultados, reducción de transferencia de red
3. **Cache de respuestas** — NodeCache con TTL, evita procesamiento redundante
4. **Compresión HTTP** — `compression` (gzip) con nivel 6, reduce payload hasta 70%

### Resultados Esperados

| Métrica | Antes | Después | Reducción |
|---|---|---|---|
| Tiempo de respuesta (GET /api/cursos) | ~450ms | ~45ms | **90%** |
| Payload (GET /api/cursos) | ~15 KB | ~500 B | **97%** |
| Uso de CPU (consultas BD) | COLLSCAN | IXSCAN | **80%** |
| Emisiones CO₂ por solicitud | ~0.0356 g | ~0.0036 g | **90%** |
| Ancho de banda mensual | ~500 MB | ~15 MB | **97%** |

### Técnicas Implementadas

| Técnica | Archivos | Impacto |
|---|---|---|
| Índices MongoDB | `models/Course.js`, `Student.js`, `Teacher.js`, `Classroom.js` | Alto |
| Paginación | `controllers/course.controller.js` | Alto |
| Cache | `middleware/cache.js` → `routes/course.routes.js` | Medio |
| Compresión + lean() | `server.js`, `controllers/course.controller.js` | Alto |
| Monitor CO₂ | `middleware/co2Monitor.js` | Medición |

### Stack

- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Monitor:** `@tgwf/co2` para estimación de emisiones
- **Cache:** `node-cache` en memoria
- **Compresión:** `compression` (gzip, nivel 6)

### Archivos de esta carpeta

- `impacto_ambiental.md` — Impactos ambientales identificados
- `oportunidades_mejora.md` — Justificación de técnicas seleccionadas
- `tecnicas_implementadas.md` — Código y fundamentación detallada
- `validacion_resultados.md` — Comparativa antes/después con métricas
- `beneficios_sostenibilidad.md` — Cálculos de ahorro de CO₂ y energía
- `scripts/` — Scripts de prueba automatizada
- `capturas/` — Screenshots de resultados
