#!/bin/bash
# Script de prueba de rendimiento para validar optimizaciones Green Engineering
# Uso: bash docs/green/scripts/test-performance.sh

BASE_URL="${1:-http://localhost:5000}"
TOKEN=""  # Colocar token JWT aquí si es necesario

echo "========================================"
echo "  Test de Rendimiento - Green Engineering"
echo "  UniScheduler"
echo "========================================"
echo ""

# --- 1. Prueba sin paginacion (antes) ---
echo "[1/5] Simulando consulta sin paginacion optimizada..."
START=$(date +%s%N)
for i in {1..50}; do
  if [ -n "$TOKEN" ]; then
    curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/courses?limit=1000" > /dev/null
  else
    curl -s "${BASE_URL}/api/courses?limit=1000" > /dev/null
  fi
done
END=$(date +%s%N)
DURATION_BEFORE=$(( (END - START) / 1000000 ))
echo "   Tiempo total (50 req, sin paginacion): ${DURATION_BEFORE}ms"
echo "   Promedio: $((DURATION_BEFORE / 50))ms/req"
echo ""

# --- 2. Prueba con paginacion optimizada ---
echo "[2/5] Simulando consulta con paginacion optimizada..."
START=$(date +%s%N)
for i in {1..50}; do
  if [ -n "$TOKEN" ]; then
    curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/courses?page=1&limit=20" > /dev/null
  else
    curl -s "${BASE_URL}/api/courses?page=1&limit=20" > /dev/null
  fi
done
END=$(date +%s%N)
DURATION_AFTER=$(( (END - START) / 1000000 ))
echo "   Tiempo total (50 req, con paginacion): ${DURATION_AFTER}ms"
echo "   Promedio: $((DURATION_AFTER / 50))ms/req"
echo ""

# --- 3. Prueba de cache ---
echo "[3/5] Probando efectividad del cache..."
# Primera solicitud (cache miss)
START=$(date +%s%N)
if [ -n "$TOKEN" ]; then
  RESULT1=$(curl -s -o /dev/null -w "%{http_code} %{size_download}" -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/courses?page=1&limit=20")
else
  RESULT1=$(curl -s -o /dev/null -w "%{http_code} %{size_download}" "${BASE_URL}/api/courses?page=1&limit=20")
fi
END=$(date +%s%N)
CACHE_MISS_TIME=$(( (END - START) / 1000000 ))

# Segunda solicitud (cache hit)
START=$(date +%s%N)
if [ -n "$TOKEN" ]; then
  RESULT2=$(curl -s -o /dev/null -w "%{http_code} %{size_download}" -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/courses?page=1&limit=20")
else
  RESULT2=$(curl -s -o /dev/null -w "%{http_code} %{size_download}" "${BASE_URL}/api/courses?page=1&limit=20")
fi
END=$(date +%s%N)
CACHE_HIT_TIME=$(( (END - START) / 1000000 ))
echo "   Cache miss (1ra solicitud):  ${CACHE_MISS_TIME}ms"
echo "   Cache hit (2da solicitud):   ${CACHE_HIT_TIME}ms"
echo ""

# --- 4. Medir payload (con y sin compresion) ---
echo "[4/5] Midiendo tamanio de payload..."
if [ -n "$TOKEN" ]; then
  SIZE_WITH_COMPRESSION=$(curl -s -o /dev/null -w "%{size_download}" -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/courses?page=1&limit=20")
  SIZE_WITHOUT_COMPRESSION=$(curl -s -o /dev/null -w "%{size_download}" -H "Authorization: Bearer $TOKEN" -H "Accept-Encoding: identity" "${BASE_URL}/api/courses?page=1&limit=20")
else
  SIZE_WITH_COMPRESSION=$(curl -s -o /dev/null -w "%{size_download}" "${BASE_URL}/api/courses?page=1&limit=20")
  SIZE_WITHOUT_COMPRESSION=$(curl -s -o /dev/null -w "%{size_download}" -H "Accept-Encoding: identity" "${BASE_URL}/api/courses?page=1&limit=20")
fi
echo "   Payload comprimido (gzip):   ${SIZE_WITH_COMPRESSION} bytes"
echo "   Payload sin comprimir:       ${SIZE_WITHOUT_COMPRESSION} bytes"
if [ "$SIZE_WITHOUT_COMPRESSION" -gt 0 ]; then
  REDUCTION=$(( (SIZE_WITHOUT_COMPRESSION - SIZE_WITH_COMPRESSION) * 100 / SIZE_WITHOUT_COMPRESSION ))
  echo "   Reduccion por compresion:   ${REDUCTION}%"
fi
echo ""

# --- 5. Resumen ---
echo "[5/5] Resumen de resultados"
echo "========================================"
echo "  Sin paginacion (1000 docs):   ${DURATION_BEFORE}ms total"
echo "  Con paginacion (20 docs):     ${DURATION_AFTER}ms total"
echo "  Cache hit speedup:            ${CACHE_MISS_TIME}ms -> ${CACHE_HIT_TIME}ms"
echo "  Compresion:                   ${SIZE_WITHOUT_COMPRESSION} -> ${SIZE_WITH_COMPRESSION} bytes"
echo "========================================"
echo ""
echo "Para reporte CO2: bash docs/green/scripts/test-co2-report.sh"
