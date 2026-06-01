# Impactos Ambientales Identificados

A continuación se listan los impactos ambientales identificados en el backend de UniScheduler antes de la implementación de las optimizaciones Green Engineering.

## 1. COLLSCAN en consultas MongoDB

**Problema:** Las consultas sin índices realizaban `COLLSCAN` (colección completa escaneada), consumiendo CPU y disco innecesariamente.

**Impacto:**
- Mayor uso de CPU del servidor de base de datos
- Mayor consumo energético por operación
- Tiempos de respuesta elevados que obligan a mantener servidores encendidos más tiempo
- Ejemplo: `Course.find({codigo: "CS101"})` escaneaba toda la colección

## 2. Transferencia excesiva de datos

**Problema:** Las respuestas de listados (`GET /api/courses`) devolvían todos los documentos sin paginación, transfiriendo cientos de registros incluso cuando solo se necesitaban unos pocos.

**Impacto:**
- Ancho de banda desperdiciado en datos no utilizados
- Mayor consumo energético en routers, switches y red
- Mayor latencia para el usuario final
- Por cada solicitud se transferían ~15 KB innecesarios

## 3. Procesamiento redundante (sin cache)

**Problema:** Cada solicitud repetitiva (`GET /api/courses`) ejecutaba la misma consulta MongoDB, serialización y transformación de datos, sin importar si los datos habían cambiado.

**Impacto:**
- CPU y memoria desperdiciados en cálculos repetitivos
- La base de datos recibía más queries de las necesarias
- Mayor consumo energético del servidor de aplicación
- Estimación: ~60% de las consultas GET son repetitivas

## 4. Payload sin comprimir

**Problema:** Las respuestas HTTP viajaban sin compresión, utilizando más ancho de banda del necesario.

**Impacto:**
- Archivos JSON de hasta 50 KB transferidos sin comprimir
- Mayor tiempo de transmisión = más tiempo de conexión activa
- Consumo energético en infraestructura de red
- El tamaño se podía reducir hasta un 70-80% con gzip

## 5. Sin medición de impacto ambiental

**Problema:** No existía un sistema para medir, monitorear o reportar las emisiones de CO₂ generadas por las operaciones del backend.

**Impacto:**
- Imposibilidad de establecer líneas base de emisiones
- Sin visibilidad del impacto ambiental del software
- Sin capacidad de mejora continua basada en datos
- El software opera como una "caja negra" en términos de sostenibilidad

## Resumen de Impactos

| # | Impacto | Severidad | Ámbito |
|---|---|---|---|
| 1 | COLLSCAN en MongoDB | Alta | Servidor BD |
| 2 | Transferencia excesiva (sin paginación) | Alta | Red |
| 3 | Procesamiento redundante (sin cache) | Media | Servidor App |
| 4 | Payload sin comprimir | Media | Red |
| 5 | Sin medición de CO₂ | Alta | Organizacional |
