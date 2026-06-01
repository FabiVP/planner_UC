#!/bin/bash
# Script para obtener reporte de CO2 desde el endpoint de sostenibilidad
# Uso: bash docs/green/scripts/test-co2-report.sh

BASE_URL="${1:-http://localhost:5000}"
TOKEN=""

echo "========================================"
echo "  Reporte de Sostenibilidad - CO2.js"
echo "  UniScheduler"
echo "========================================"
echo ""

# Verificar que el servidor esta corriendo
if ! curl -s "${BASE_URL}/api/health" > /dev/null 2>&1; then
  echo "ERROR: No se puede conectar a ${BASE_URL}"
  echo "Asegurate de que el servidor este corriendo:"
  echo "  cd backend && npm start"
  exit 1
fi

echo "Servidor conectado: ${BASE_URL}"
echo ""

# 1. Obtener metricas actuales
echo "[1] Obteniendo metricas de sostenibilidad..."
if [ -n "$TOKEN" ]; then
  METRICS=$(curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/sustainability")
else
  METRICS=$(curl -s "${BASE_URL}/api/sustainability")
fi
echo "$METRICS" | python3 -m json.tool 2>/dev/null || echo "$METRICS"
echo ""

# 2. Generar solicitudes de prueba para acumular metricas
echo "[2] Generando trafico de prueba..."
echo "    Realizando 20 solicitudes GET a /api/courses..."
for i in $(seq 1 20); do
  if [ -n "$TOKEN" ]; then
    curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/courses?page=1&limit=20" > /dev/null 2>&1
  else
    curl -s "${BASE_URL}/api/courses?page=1&limit=20" > /dev/null 2>&1
  fi
  if [ $((i % 5)) -eq 0 ]; then
    echo "    ... $i solicitudes completadas"
  fi
done
echo "    Trafico de prueba completado."
echo ""

# 3. Obtener metricas actualizadas
echo "[3] Metricas actualizadas:"
if [ -n "$TOKEN" ]; then
  METRICS=$(curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/sustainability")
else
  METRICS=$(curl -s "${BASE_URL}/api/sustainability")
fi

# Extraer valores con grep
UPTIME=$(echo "$METRICS" | grep -o '"uptime":[0-9]*' | cut -d: -f2)
TOTAL_REQ=$(echo "$METRICS" | grep -o '"totalRequests":[0-9]*' | cut -d: -f2)
TOTAL_BYTES=$(echo "$METRICS" | grep -o '"totalBytes":[0-9]*' | cut -d: -f2)
TOTAL_CO2=$(echo "$METRICS" | grep -o '"totalCO2g":[0-9.]*' | cut -d: -f2)
AVG_CO2=$(echo "$METRICS" | grep -o '"averageCO2PerRequest":[0-9.]*' | cut -d: -f2)

echo "   Tiempo activo:           ${UPTIME}s"
echo "   Solicitudes totales:     ${TOTAL_REQ}"
echo "   Bytes transferidos:      ${TOTAL_BYTES} bytes ($((TOTAL_BYTES / 1024)) KB)"
echo "   CO2 total emitido:       ${TOTAL_CO2} g"
echo "   CO2 promedio/solicitud:  ${AVG_CO2} µg"
echo ""

# 4. Calcular equivalentes
if [ -n "$TOTAL_CO2" ] && [ "$(echo "$TOTAL_CO2" | tr -d '.')" != "" ]; then
  echo "[4] Equivalentes ambientales:"
  KM=$(echo "scale=2; $TOTAL_CO2 / 150" | bc 2>/dev/null || echo "N/A")
  CAFE=$(echo "scale=2; $TOTAL_CO2 / 200" | bc 2>/dev/null || echo "N/A")
  echo "   CO2 total: ${TOTAL_CO2}g"
  echo "   Equivale a ${KM} km recorridos en auto (150g/km)"
  echo "   Equivale a ${CAFE} tazas de cafe (200g/taza)"
fi
echo ""
echo "========================================"
echo "  Para metricas en tiempo real:"
echo "  curl ${BASE_URL}/api/sustainability"
echo "========================================"
