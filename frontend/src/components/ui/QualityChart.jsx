import { useEffect, useRef } from 'react';
import './QualityChart.css';

export default function QualityChart({ score = 92, metrics = {} }) {
  const circleRef = useRef(null);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    let timerId;
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = circumference;
      // Guard against null ref after component unmount
      timerId = setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = offset;
        }
      }, 100);
    }
    // Cleanup: cancel timeout on unmount or re-render
    return () => clearTimeout(timerId);
  }, [score, circumference, offset]);

  const defaultMetrics = {
    constraintsFulfilled: metrics.constraintsFulfilled ?? 98,
    preferencesScore: metrics.preferencesScore ?? 90,
    resourceUsage: metrics.resourceUsage ?? 85,
    loadDistribution: metrics.loadDistribution ?? 95,
  };

  return (
    <div className="quality-chart">
      <h3 className="quality-title">Calidad de la solución (Última generación)</h3>
      <div className="quality-content">
        <div className="quality-circle-wrapper">
          <svg className="quality-svg" viewBox="0 0 200 200">
            <circle className="quality-bg-circle" cx="100" cy="100" r={radius} />
            <circle
              ref={circleRef}
              className="quality-progress-circle"
              cx="100"
              cy="100"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="quality-score">
            <span className="quality-score-value">{score}</span>
            <span className="quality-score-unit">%</span>
          </div>
          <p className="quality-score-label">Óptimo</p>
        </div>

        <div className="quality-metrics">
          <div className="quality-metric">
            <span className="metric-icon success">✓</span>
            <span className="metric-label">Restricciones cumplidas</span>
            <span className="metric-value">{defaultMetrics.constraintsFulfilled}%</span>
          </div>
          <div className="quality-metric">
            <span className="metric-icon success">✓</span>
            <span className="metric-label">Preferencias satisfechas</span>
            <span className="metric-value">{defaultMetrics.preferencesScore}%</span>
          </div>
          <div className="quality-metric">
            <span className="metric-icon success">✓</span>
            <span className="metric-label">Uso de recursos</span>
            <span className="metric-value">{defaultMetrics.resourceUsage}%</span>
          </div>
          <div className="quality-metric">
            <span className="metric-icon success">✓</span>
            <span className="metric-label">Distribución de carga</span>
            <span className="metric-value">{defaultMetrics.loadDistribution}%</span>
          </div>
        </div>
      </div>
      <button type="button" className="quality-detail-link btn-link" aria-label="Ver detalle del análisis de calidad">Ver detalle del análisis →</button>
    </div>
  );
}
