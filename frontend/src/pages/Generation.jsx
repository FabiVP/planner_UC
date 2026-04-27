import { useState } from 'react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import { HiOutlineLightningBolt, HiOutlinePlay, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import './Generation.css';

export default function Generation() {
  const [name, setName] = useState('Horario Semestre 2025-II');
  const [semester, setSemester] = useState('2025-II');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await api.post('/generations/generate', { name, semester });
      setResult({
        success: true,
        message: res.data.message,
        executionTime: res.data.executionTimeMs,
        generation: res.data.generation,
        schedule: res.data.schedule,
      });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Error en la generación',
        conflicts: err.response?.data?.conflicts || [],
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Header title="Generación de Horarios" subtitle="Motor CSP — Satisfacción de Restricciones" />
      <div className="page-content">
        <div className="generation-layout">
          <div className="card gen-config-card">
            <h3><HiOutlineLightningBolt /> Configuración de Generación</h3>
            <div className="gen-form">
              <div className="form-group">
                <label>Nombre de la generación</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Semestre</label>
                <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
                  <option>2025-I</option>
                  <option>2025-II</option>
                  <option>2026-I</option>
                </select>
              </div>

              <div className="gen-restrictions-info">
                <h4>Restricciones activas</h4>
                <ul>
                  <li>✅ RD-01: No solapamiento de docente</li>
                  <li>✅ RD-02: No solapamiento de aula</li>
                  <li>✅ RD-03: No solapamiento de estudiante</li>
                  <li>✅ RD-04: Límite de créditos (20-22)</li>
                  <li>✅ RD-05: Prerrequisitos aprobados</li>
                  <li>✅ RD-06: Tipo de infraestructura</li>
                </ul>
              </div>

              <div className="gen-algo-info">
                <h4>Algoritmo</h4>
                <p>Backtracking + MRV + Forward Checking</p>
                <p className="algo-detail">Timeout: 30 segundos</p>
              </div>

              <button 
                className="btn btn-primary btn-lg gen-execute-btn" 
                onClick={handleGenerate}
                disabled={running}
              >
                {running ? (
                  <><span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> Generando...</>
                ) : (
                  <><HiOutlinePlay /> Ejecutar Generación CSP</>
                )}
              </button>
            </div>
          </div>

          <div className="gen-result-area">
            {running && (
              <div className="card gen-running-card">
                <div className="gen-running-animation">
                  <div className="spinner" style={{width:60,height:60,borderWidth:4}}></div>
                  <h3>Motor CSP en ejecución...</h3>
                  <p>Aplicando Backtracking con heurísticas MRV y Forward Checking</p>
                  <div className="gen-progress-steps">
                    <div className="progress-step active">Construyendo variables</div>
                    <div className="progress-step active">Generando dominios</div>
                    <div className="progress-step active">Aplicando restricciones</div>
                    <div className="progress-step">Buscando solución óptima</div>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className={`card gen-result-card ${result.success ? 'success' : 'error'}`}>
                <div className="gen-result-header">
                  {result.success ? <HiOutlineCheckCircle className="result-icon success" /> : <HiOutlineExclamationCircle className="result-icon error" />}
                  <h3>{result.message}</h3>
                </div>
                {result.executionTime && (
                  <p className="result-time">Tiempo de ejecución: <strong>{result.executionTime}ms</strong></p>
                )}
                {result.generation && (
                  <div className="result-metrics">
                    <div className="result-metric"><span>Calidad</span><strong>{result.generation.qualityScore}%</strong></div>
                    <div className="result-metric"><span>Restricciones</span><strong>{result.generation.constraintsFulfilled}%</strong></div>
                    <div className="result-metric"><span>Recursos</span><strong>{result.generation.resourceUsage}%</strong></div>
                    <div className="result-metric"><span>Carga</span><strong>{result.generation.loadDistribution}%</strong></div>
                  </div>
                )}
                {result.schedule && (
                  <p className="result-assignments">Total de asignaciones: <strong>{result.schedule.totalAssignments}</strong></p>
                )}
                {result.success && (
                  <button className="btn btn-success" style={{marginTop:16}} onClick={() => window.location.href = '/schedules'}>
                    Ver Horario Generado
                  </button>
                )}
                {result.conflicts?.length > 0 && (
                  <div className="result-conflicts">
                    <h4>Conflictos detectados:</h4>
                    {result.conflicts.map((c, i) => (
                      <div key={i} className="conflict-item">
                        <span className={`badge badge-${c.severity === 'alta' ? 'error' : 'warning'}`}>{c.severity}</span>
                        <p>{c.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!running && !result && (
              <div className="card gen-empty-card">
                <HiOutlineLightningBolt className="gen-empty-icon" />
                <h3>Listo para generar</h3>
                <p>Configure los parámetros y ejecute la generación CSP para crear un horario óptimo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
