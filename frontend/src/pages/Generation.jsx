import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CURRENT_SEMESTER, SEMESTERS } from '../utils/constants';
import {
  HiOutlineLightningBolt, HiOutlinePlay, HiOutlineCheckCircle,
  HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineTrash,
  HiOutlineClock, HiOutlineCalendar
} from 'react-icons/hi';
import './Generation.css';

export default function Generation() {
  const [name, setName] = useState(`Horario Semestre ${CURRENT_SEMESTER}`);
  const [semester, setSemester] = useState(CURRENT_SEMESTER);
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/generations?limit=50');
      setHistory(data.generations || []);
    } catch (e) {}
    setLoadingHistory(false);
  };

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
      loadHistory();
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

  const handleRestore = async (id) => {
    if (!confirm('¿Restaurar esta generación como activa?')) return;
    try {
      await api.post(`/generations/${id}/restore`);
      alert('Generación restaurada exitosamente.');
      loadHistory();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al restaurar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta generación permanentemente?')) return;
    try {
      await api.delete(`/generations/${id}`);
      setHistory(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      completada: { class: 'badge-success', label: '✓ Completada' },
      fallida: { class: 'badge-error', label: '✗ Fallida' },
      en_progreso: { class: 'badge-warning', label: '⟳ En progreso' },
      pendiente: { class: 'badge-info', label: '… Pendiente' }
    };
    return map[status] || { class: 'badge-info', label: status };
  };

  return (
    <div className="animate-fadeIn">
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
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="gen-restrictions-info">
              <h4>Restricciones activas</h4>
              <ul>
                <li>✅ RD-01: No solapamiento de docente</li>
                <li>✅ RD-02: No solapamiento de aula</li>
                <li>✅ RD-03: No solapamiento de estudiante</li>
                <li>✅ RD-04: Límite de créditos (12-22)</li>
                <li>✅ RD-05: Prerrequisitos aprobados</li>
                <li>✅ RD-06: Tipo de infraestructura</li>
                <li>✅ RD-07: Correquisitos simultáneos</li>
                <li>✅ RD-08: Desempeño docente</li>
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
                <button className="btn btn-success" style={{marginTop:16}} onClick={() => navigate('/schedules')}>
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

          {/* ═══ GENERATION HISTORY ═══ */}
          <div className="card gen-history-card">
            <div className="card-header">
              <h3 className="card-title"><HiOutlineClock /> Historial de Generaciones</h3>
              <span className="results-count">{history.length} generaciones</span>
            </div>

            {loadingHistory ? (
              <div className="planning-loading"><div className="spinner"></div></div>
            ) : history.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '1rem' }}>No hay generaciones previas.</p>
            ) : (
              <div className="gen-history-list">
                {history.map(gen => {
                  const badge = getStatusBadge(gen.status);
                  return (
                    <div key={gen._id} className={`gen-history-item ${gen.status}`}>
                      <div className="gen-hist-left">
                        <div className="gen-hist-name">
                          <strong>{gen.name || 'Generación'}</strong>
                          <span className={`badge ${badge.class}`} style={{ fontSize: '0.7rem' }}>{badge.label}</span>
                        </div>
                        <div className="gen-hist-meta">
                          <span><HiOutlineCalendar /> {gen.semester}</span>
                          <span><HiOutlineClock /> {new Date(gen.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          {gen.executionTimeMs && <span>⏱ {gen.executionTimeMs}ms</span>}
                          {gen.qualityScore != null && <span>⭐ {gen.qualityScore}%</span>}
                        </div>
                        {gen.scoringBreakdown && (
                          <div className="gen-hist-scores">
                            <span title="Restricciones">R: {gen.constraintsFulfilled || 0}%</span>
                            <span title="Recursos">U: {gen.resourceUsage || 0}%</span>
                            <span title="Carga">C: {gen.loadDistribution || 0}%</span>
                            <span title="Preferencias">P: {gen.preferencesScore || 0}%</span>
                          </div>
                        )}
                      </div>
                      <div className="gen-hist-actions">
                        {gen.status === 'completada' && (
                          <button className="btn btn-outline btn-sm" title="Restaurar esta versión" onClick={() => handleRestore(gen._id)}>
                            <HiOutlineRefresh /> Restaurar
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" title="Eliminar" onClick={() => handleDelete(gen._id)}>
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
