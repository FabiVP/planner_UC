# Explicación de las 5 Técnicas Green Engineering en UniScheduler

## 1. Índices MongoDB

**¿Qué hace?**
Crea índices en los campos más consultados de las colecciones MongoDB (`Course`, `Student`, `Teacher`, `Classroom`). Por ejemplo, índices en `semester`, `email`, `name`, y compuestos como `{ career: 1, semester: 1 }`.

**¿Qué quiere demostrar?**
Que las consultas a la base de datos usan **IXSCAN** (index scan) en lugar de **COLLSCAN** (collection scan). Esto reduce drásticamente los documentos examinados por consulta, disminuyendo uso de CPU, disco y energía. Se demuestra con `explain("executionStats")` en MongoDB viendo el cambio de `COLLSCAN` a `IXSCAN`, y con una comparativa de rendimiento (~92% más rápido con índices).

---

## 2. Paginación de Datos

**¿Qué hace?**
Implementa paginación en el endpoint `GET /api/courses` usando parámetros `page` y `limit` con valores por defecto seguros (`page=1`, `limit=20`, máximo 100). Usa `skip()` y `limit()` de Mongoose combinados con `Promise.all` para ejecutar consulta y conteo en paralelo.

**¿Qué quiere demostrar?**
Que no se transfieren datos innecesarios. Sin paginación, una respuesta puede tener 150 cursos (~300KB); con paginación devuelve solo 20 (~1.8KB). Esto representa un ahorro de **~98% en payload**, lo que significa menos ancho de banda, menor latencia, y menos energía en toda la cadena servidor-red-cliente.

---

## 3. Cache de Respuestas

**¿Qué hace?**
Usa `node-cache` (caché en memoria RAM) para almacenar respuestas de endpoints GET con un TTL de 60 segundos. Cuando llega una solicitud, si la respuesta ya está en caché, se devuelve directamente desde RAM (~1-2ms). Si se hace POST/PUT/DELETE, el caché se invalida automáticamente para ese prefijo.

**¿Qué quiere demostrar?**
Que las solicitudes repetitivas no necesitan consultar MongoDB cada vez. Un **cache hit** responde en 1-2ms, mientras que un **cache miss** toma ~45ms (97% más rápido). En un escenario con 100 usuarios consultando los mismos datos, el caché evita 99 de cada 100 consultas a la base de datos, ahorrando CPU, disco E/S y energía del servidor.

---

## 4. Compresión HTTP + lean()

**¿Qué hace?**
Dos técnicas combinadas:
- **Compresión HTTP**: Middleware `compression` de Express con nivel 6 y threshold de 1KB. Aplica gzip a todas las respuestas mayores a 1KB.
- **`.lean()`**: Método de Mongoose que devuelve objetos JavaScript planos en lugar de documentos Mongoose completos (sin getters, setters, ni historial de cambios).

**¿Qué quiere demostrar?**
- **Compresión**: Reduce el payload ~70% (ej: 1,843 bytes → 542 bytes). Menos bytes transferidos = menos ancho de banda y energía de red.
- **`.lean()`**: Reduce el tiempo de serialización ~42% porque evita crear objetos Mongoose complejos cuando solo se necesita JSON. Para APIs REST de solo lectura, es siempre la opción correcta.

---

## 5. Monitor de CO₂

**¿Qué hace?**
Middleware que intercepta cada solicitud HTTP, mide los bytes transferidos, y calcula las emisiones estimadas de CO₂ usando el modelo **SWD (Sustainable Web Design)** de la librería `@tgwf/co2`. Fórmula: `bytes × 0.00000000152 kWh/byte × factor_carbono = g CO₂`. Expone las métricas acumuladas en `GET /api/sustainability`.

**¿Qué quiere demostrar?**
Que se puede **medir en tiempo real** el impacto ambiental de cada solicitud y del servidor completo. El reporte muestra: uptime, total de solicitudes, bytes transferidos, CO₂ total en gramos, CO₂ promedio por solicitud en µg, y desglose por endpoint. Además, en modo desarrollo, cada solicitud imprime un log con su huella de carbono, permitiendo ver visualmente cómo las técnicas anteriores (caché, compresión, paginación) reducen las emisiones.
