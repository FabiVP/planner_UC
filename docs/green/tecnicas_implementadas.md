# Técnicas Implementadas

## Código y Fundamentación Detallada

---

## Técnica 1: Índices MongoDB

### Archivos Modificados
- `backend/models/Course.js`
- `backend/models/Student.js`
- `backend/models/Teacher.js`
- `backend/models/Classroom.js`

### Código Implementado

```javascript
// Course.js
courseSchema.index({ code: 1 });           // Búsqueda exacta por código
courseSchema.index({ semester: 1 });        // Filtro por semestre
courseSchema.index({ career: 1, semester: 1 }); // Consultas combinadas
courseSchema.index({ name: 1 });            // Búsqueda por nombre
courseSchema.index({ type: 1 });            // Filtro por tipo

// Student.js
studentSchema.index({ email: 1 });          // Búsqueda por email
studentSchema.index({ studentCode: 1 });    // Búsqueda por código
studentSchema.index({ career: 1, currentSemester: 1 }); // Reportes
studentSchema.index({ active: 1 });         // Filtro de activos

// Teacher.js
teacherSchema.index({ email: 1 });          // Búsqueda por email
teacherSchema.index({ name: 1 });           // Búsqueda por nombre
teacherSchema.index({ department: 1, active: 1 }); // Por departamento
teacherSchema.index({ contractType: 1 });   // Filtro por tipo

// Classroom.js
classroomSchema.index({ code: 1 });         // Búsqueda por código
classroomSchema.index({ type: 1, available: 1 }); // Aulas disponibles
classroomSchema.index({ campus: 1, building: 1 }); // Por ubicación
classroomSchema.index({ capacity: 1 });     // Por capacidad
```

### Fundamentación

Los índices en MongoDB permiten consultas eficientes al evitar `COLLSCAN` (escaneo completo de colección). En lugar de examinar cada documento, MongoDB navega directamente al documento mediante el índice, reduciendo:

- **Operaciones de E/S en disco**: El índice se mantiene en memoria (trabaja en RAM)
- **Uso de CPU**: Menos documentos a examinar por consulta
- **Tiempo de respuesta**: Las consultas indexadas son órdenes de magnitud más rápidas

**Impacto Green**: Un `COLLSCAN` en una colección de 10,000 documentos consume ~1000x más energía que un `IXSCAN` con índice.

---

## Técnica 2: Paginación de Datos

### Archivo Modificado
- `backend/controllers/course.controller.js`

### Código Implementado

```javascript
exports.getAll = async (req, res, next) => {
  try {
    const { semester, type, active, career } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const filter = {};
    if (semester) filter.semester = semester;
    if (type) filter.type = type;
    if (active !== undefined) filter.active = active === 'true';
    if (career) filter.career = career;

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('prerequisites', 'code name')
        .populate('career', 'code name faculty')
        .sort({ semester: 1, code: 1 })
        .skip(skip).limit(limit)
        .lean(),
      Course.countDocuments(filter)
    ]);
    const pages = Math.ceil(total / limit);
    res.json({
      count: courses.length,
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
      courses
    });
  } catch (error) {
    next(error);
  }
};
```

### Fundamentación

La paginación limita la cantidad de datos transferidos en cada solicitud. Beneficios:

- **Reducción de payload**: De ~50 KB (todos los cursos) a ~500 B (20 cursos)
- **Menos serialización**: Mongoose serializa menos documentos
- **Menos ancho de banda**: Impacta directamente en el consumo energético de red
- **Experiencia de usuario**: Tiempos de respuesta predecibles

**Configuración**: `limit` default 20, máximo 100. Esto evita que clientes maliciosos o mal configurados soliciten cantidades excesivas de datos.

---

## Técnica 3: Cache de Recursos

### Archivo Creado
- `backend/middleware/cache.js`

### Código Implementado

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const cacheMiddleware = (prefix) => {
  return (req, res, next) => {
    const key = `${prefix}:${req.originalUrl}`;
    const cached = cache.get(key);
    if (cached) {
      return res.json(cached);
    }
    res.originalJson = res.json.bind(res);
    res.json = (body) => {
      cache.set(key, body);
      res.originalJson(body);
    };
    next();
  };
};

const invalidateCacheByPrefix = (prefix) => {
  const keys = cache.keys().filter(k => k.startsWith(`${prefix}:`));
  keys.forEach(k => cache.del(k));
};

module.exports = { cacheMiddleware, invalidateCacheByPrefix, cache };
```

### Archivo Modificado
- `backend/routes/course.routes.js`

```javascript
router.get('/', auth, cacheMiddleware('cursos'), ctrl.getAll);
router.post('/', auth, roleGuard('coordinador'), validateCourse, (req, res, next) => {
  invalidateCacheByPrefix('cursos');
  next();
}, ctrl.create);
// Similar para PUT y DELETE
```

### Fundamentación

El cache reduce la carga en MongoDB al almacenar respuestas en memoria (RAM) por 60 segundos:

- **TTL de 60s**: Balance entre frescura de datos y eficiencia
- **Invalidación por prefijo**: Al crear/actualizar/eliminar, se invalida solo el cache relevante
- **Respuestas desde RAM**: Latencia de ~1ms vs ~50ms de consulta a BD
- **Reducción de carga en BD**: Hasta 90% menos consultas GET repetitivas

**Impacto Green**: Cada consulta evitada a MongoDB ahorra ciclos de CPU y operaciones de disco en el servidor de base de datos.

---

## Técnica 4: Compresión HTTP + lean()

### Archivo Modificado
- `backend/server.js`

```javascript
const compression = require('compression');

// Middleware
app.use(compression({ level: 6, threshold: 1024 }));
```

### Archivo Modificado
- `backend/controllers/course.controller.js` — Uso de `.lean()` en consultas

```javascript
const courses = await Course.find(filter)
  .populate('prerequisites', 'code name')
  .populate('career', 'code name faculty')
  .sort({ semester: 1, code: 1 })
  .skip(skip).limit(limit)
  .lean();  // Objetos JS planos, sin métodos de Mongoose
```

### Fundamentación

**Compression (gzip)**:
- Nivel 6: Balance óptimo entre compresión y velocidad de CPU
- Threshold 1024 bytes: Solo comprime respuestas mayores a 1 KB
- Reduce payload hasta 70-80% en respuestas JSON

**lean()**:
- Mongoose devuelve objetos Mongoose con métodos internos, historial de cambios, etc.
- `.lean()` devuelve objetos JavaScript planos — ~30% más rápidos de serializar
- Reduce uso de memoria y CPU en el servidor

**Impacto Green**: Menos bytes en la red = menos energía en routers, switches y dispositivos de usuario.
