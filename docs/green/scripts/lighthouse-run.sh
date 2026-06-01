#!/bin/bash
# Script para ejecutar Lighthouse y medir performance del frontend
# Uso: bash docs/green/scripts/lighthouse-run.sh [url]

FRONTEND_URL="${1:-http://localhost:3000}"
REPORT_DIR="docs/green/capturas"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "========================================"
echo "  Lighthouse - Green Performance Audit"
echo "  UniScheduler"
echo "========================================"
echo ""

# Verificar que Lighthouse esta instalado
if ! command -v npx lighthouse &> /dev/null; then
  echo "Lighthouse no encontrado. Instalando..."
  npm install -g lighthouse
fi

# Crear directorio de reportes
mkdir -p "$REPORT_DIR"

echo "URL:      ${FRONTEND_URL}"
echo "Reporte:  ${REPORT_DIR}/lighthouse-${TIMESTAMP}.html"
echo ""

# Ejecutar Lighthouse
npx lighthouse "${FRONTEND_URL}" \
  --output=html \
  --output=json \
  --output-path="${REPORT_DIR}/lighthouse-${TIMESTAMP}" \
  --chrome-flags="--headless --no-sandbox" \
  --preset=desktop \
  --quiet

echo ""
echo "Reportes generados:"
echo "  HTML: ${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.html"
echo "  JSON: ${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json"
echo ""

# Extraer score de performance del JSON
if [ -f "${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json" ]; then
  echo "=== Resultados ==="
  PERFORMANCE=$(grep -o '"performance":[0-9.]*' "${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json" | head -1 | cut -d: -f2)
  ACCESSIBILITY=$(grep -o '"accessibility":[0-9.]*' "${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json" | head -1 | cut -d: -f2)
  BEST_PRACTICES=$(grep -o '"best-practices":[0-9.]*' "${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json" | head -1 | cut -d: -f2)
  SEO=$(grep -o '"seo":[0-9.]*' "${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json" | head -1 | cut -d: -f2)
  
  if [ -n "$PERFORMANCE" ]; then
    echo "  Performance:     $(echo "$PERFORMANCE * 100" | bc)%"
    echo "  Accessibility:   $(echo "$ACCESSIBILITY * 100" | bc)%"
    echo "  Best Practices:  $(echo "$BEST_PRACTICES * 100" | bc)%"
    echo "  SEO:            $(echo "$SEO * 100" | bc)%"
  fi
  echo ""
fi

echo "========================================"
echo "  Auditoria completada."
echo "  Abre el HTML en tu navegador para ver"
echo "  el reporte completo con sugerencias"
echo "  de optimizacion."
echo "========================================"
