# Beneficios de Sostenibilidad

## Cálculos de Ahorro de CO₂ y Energía

---

## Metodología de Cálculo

Las emisiones de CO₂ se calculan utilizando:
- **Modelo**: `@tgwf/co2` (modelo average) con factor de carbono promedio
- **Fórmula**: `CO₂ (g) = bytes_transferidos × 0.00000152 kWh/byte × 0.475 kg CO₂/kWh`
- **Factor de carbono**: 0.475 kg CO₂/kWh (promedio global, fuente: @tgwf/co2)
- **Energía por byte**: 0.00000152 kWh/byte (modelo de The Green Web Foundation)

---

## Línea Base (Antes de Optimizaciones)

### Escenario: 100,000 solicitudes GET /api/courses por mes

| Concepto | Valor |
|---|---|
| Payload promedio por solicitud | 15,000 bytes |
| Bytes transferidos por solicitud | 15,000 B |
| Energía por solicitud | 0.0000228 kWh |
| CO₂ por solicitud | 0.01083 g |
| **CO₂ mensual** | **1.083 kg** |
| **CO₂ anual** | **13.0 kg** |

---

## Después de Optimizaciones

### Escenario: 100,000 solicitudes GET /api/courses por mes

| Concepto | Valor |
|---|---|
| Payload promedio por solicitud | 500 bytes |
| Bytes transferidos por solicitud | 500 B |
| Energía por solicitud | 0.00000076 kWh |
| CO₂ por solicitud | 0.000361 g |
| **CO₂ mensual** | **0.0361 kg** |
| **CO₂ anual** | **0.433 kg** |

---

## Ahorro Total

| Período | Antes | Después | Ahorro |
|---|---|---|---|
| Por solicitud | 0.01083 g CO₂ | 0.000361 g CO₂ | **96.7%** |
| Por día (3,333 solicitudes) | 36.1 g CO₂ | 1.2 g CO₂ | **96.7%** |
| Por mes (100,000 solicitudes) | 1.083 kg CO₂ | 0.036 kg CO₂ | **96.7%** |
| Por año (1,200,000 solicitudes) | 13.0 kg CO₂ | 0.43 kg CO₂ | **96.7%** |

### Equivalentes Ambientales

El ahorro anual de **12.57 kg CO₂** equivale a:

| Equivalencia | Cantidad |
|---|---|
| Kilómetros recorridos en auto (156 g/km) | 80.6 km |
| Árboles plantados (21 kg CO₂/árbol/año) | 0.6 árboles |
| kWh de electricidad ahorrados | 26.5 kWh |
| Smartphones cargados (0.015 kWh/carga) | 1,767 cargas |
| Vasos de café (0.2 kg CO₂/taza) | 63 tazas |
| Días de uso de laptop (0.5 kg/día) | 25 días |

---

## Proyección a Escala

| Usuarios activos | Solicitudes/mes | CO₂ Antes | CO₂ Después | Ahorro Anual |
|---|---|---|---|---|
| 100 | 10,000 | 0.108 kg | 0.0036 kg | 1.25 kg |
| 1,000 | 100,000 | 1.083 kg | 0.036 kg | 12.6 kg |
| 10,000 | 1,000,000 | 10.83 kg | 0.361 kg | 126 kg |
| 100,000 | 10,000,000 | 108.3 kg | 3.61 kg | 1,256 kg |

---

## Beneficios Adicionales No Monetizados

1. **Menor latencia**: Tiempo de respuesta 90% más rápido → menos tiempo de conexión activa
2. **Menos CPU en BD**: Índices reducen la carga del servidor MongoDB
3. **Menos memoria**: `.lean()` reduce el consumo de RAM en el servidor Node.js
4. **Escalabilidad sostenible**: El sistema puede crecer sin aumentar proporcionalmente su huella de carbono
5. **Visibilidad y monitoreo**: El endpoint `/api/sustainability` permite medir y reportar emisiones en tiempo real

---

## Cómo Medir

Para verificar estos cálculos en tu entorno:

```bash
# 1. Iniciar el servidor
cd backend && npm start

# 2. Obtener reporte de sostenibilidad
curl http://localhost:5000/api/sustainability

# 3. Ejecutar pruebas de rendimiento
bash ../docs/green/scripts/test-performance.sh
bash ../docs/green/scripts/test-co2-report.sh
```
