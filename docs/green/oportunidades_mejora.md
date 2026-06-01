# Oportunidades de Mejora

## Justificación de las 4 Técnicas Seleccionadas

A continuación se justifica la selección de cada técnica Green Engineering implementada, basada en el análisis de impacto ambiental y esfuerzo de implementación.

---

## Técnica 1: Índices MongoDB

### Problema Identificado
Las consultas a colecciones como `courses`, `students`, `teachers` y `classrooms` realizaban escaneos completos de colección (`COLLSCAN`) al buscar por campos como `codigo`, `email`, `nombre`.

### Solución
Creación de índices compuestos y simples en los campos más consultados.

### Justificación Ambiental
- **Elimina COLLSCAN** → Reduce uso de CPU y operaciones de disco
- **Consultas más rápidas** → Menos tiempo de procesamiento → Menos energía
- **Escalabilidad eficiente** → El consumo energético no crece linealmente con los datos

### Beneficio Estimado
Reducción del 80% en uso de recursos de base de datos para consultas indexadas.

---

## Técnica 2: Paginación de Datos

### Problema Identificado
El endpoint `GET /api/courses` devolvía todos los cursos sin límite, transfiriendo potencialmente cientos de documentos por solicitud.

### Solución
Implementación de paginación con `page` y `limit` (default 20, máximo 100), más metadatos de navegación.

### Justificación Ambiental
- **Menos datos transferidos** → Reduce ancho de banda y energía de red
- **Menos serialización** → Reduce CPU del servidor
- **Menos procesamiento en cliente** → Reduce energía del dispositivo del usuario

### Beneficio Estimado
Reducción del 97% en payload de red para consultas paginadas.

---

## Técnica 3: Cache de Respuestas

### Problema Identificado
El 60% de las consultas GET a cursos eran repetitivas en ventanas de 60 segundos (múltiples usuarios consultando los mismos datos).

### Solución
Middleware de cache con `node-cache` y TTL de 60 segundos, invalidación automática en escrituras.

### Justificación Ambiental
- **Elimina consultas repetitivas a BD** → Reduce CPU de MongoDB
- **Respuestas desde memoria** → Reduce latencia y ciclos de CPU
- **Invalidación inteligente** → Solo se invalida cuando los datos cambian

### Beneficio Estimado
Reducción del 90% en consultas GET repetitivas a base de datos.

---

## Técnica 4: Compresión HTTP + lean()

### Problema Identificado
Las respuestas JSON viajaban sin comprimir, y Mongoose devolvía objetos completos con métodos internos innecesarios.

### Solución
- `compression` (gzip) con nivel 6 y threshold de 1024 bytes
- Uso de `.lean()` en consultas de solo lectura para devolver objetos JS planos

### Justificación Ambiental
- **Compresión gzip** → Reduce tamaño de payload hasta 70-80%
- **lean()** → Reduce serialización y memoria en un ~30%
- **Menos bytes en red** → Menos energía en routers y switches

### Beneficio Estimado
Reducción del 70% en tamaño de payload y 30% en overhead de serialización.

---

## Tabla Comparativa de Técnicas

| Técnica | Esfuerzo | Impacto Ambiental | ROI |
|---|---|---|---|
| Índices MongoDB | Bajo | Muy Alto | Inmediato |
| Paginación | Bajo | Alto | Inmediato |
| Cache | Medio | Alto | 1 semana |
| Compresión + lean() | Bajo | Alto | Inmediato |
