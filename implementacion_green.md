## Contexto del Proyecto

Tengo un proyecto MERN llamado **UniScheduler** (https://github.com/FabiVP/planner_UC) que es un sistema de generación óptima de horarios académicos con un motor CSP (Constraint Satisfaction Problem).

**Stack:** MongoDB, Express.js, React.js, Node.js
**Estructura:** backend/ con modelos, rutas, middleware; frontend/ con componentes React

## Lo que ya tengo implementado en el backend

Ya implementé las siguientes optimizaciones Green Engineering en el código:

### Técnica 1: Optimización de consultas MongoDB
Archivos modificados: backend/models/Curso.js, Estudiante.js, Docente.js, Aula.js
Agregué índices con schema.index() en campos como codigo, email, nombre, docente, tipo

### Técnica 2: Paginación de datos
Archivo modificado: backend/routes/cursos.js
Endpoint GET /api/cursos ahora acepta page y limit (default 20, max 100)
Devuelve metadata de paginación: { page, limit, total, pages, hasNext, hasPrev }

### Técnica 3: Cache de recursos
Archivo creado: backend/middleware/cache.js
Middleware con NodeCache, TTL de 60 segundos
Aplicado a GET /api/cursos con cacheMiddleware('cursos')
Función invalidateCacheByPrefix() para POST/PUT/DELETE

### Técnica 4: Optimización de APIs Express
Archivo modificado: backend/app.js
Agregué compression con level 6, threshold 1024
Usé .lean() en consultas de routes/cursos.js

### Herramienta de medición: CO2.js
Archivo creado: backend/middleware/co2Monitor.js
Middleware que calcula CO2 por solicitud usando @tgwf/co2
Endpoint GET /api/sustainability para reporte de métricas

## Lo que necesito generar

Necesito crear la **documentación completa** dentro de la carpeta docs/green/ con la siguiente estructura:
docs/green/
├── README.md # Resumen ejecutivo de la iniciativa Green
├── impacto_ambiental.md # Lista de 5+ impactos ambientales identificados
├── oportunidades_mejora.md # Justificación de las 4 técnicas seleccionadas
├── tecnicas_implementadas.md # Código y fundamentación de cada técnica
├── validacion_resultados.md # Comparativa antes/después con métricas
├── beneficios_sostenibilidad.md # Cálculos de ahorro de CO2 y energía
├── scripts/
│ ├── test-performance.sh # Script para medir tiempos antes/después
│ ├── test-co2-report.sh # Script para obtener reporte CO2.js
│ └── lighthouse-run.sh # Script para ejecutar Lighthouse
└── capturas/ # Carpeta para screenshots (vacía, para llenar después)
javascript

// backend/models/Curso.js - Índice para optimización
cursoSchema.index({ codigo: 1 });  // Búsqueda por código - evita COLLSCAN