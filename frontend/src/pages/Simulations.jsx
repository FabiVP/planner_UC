import { useState, useEffect, startTransition } from 'react';
import { HiOutlineStar, HiStar, HiOutlineTrash, HiOutlineEye, HiOutlineDuplicate, HiOutlinePlus } from 'react-icons/hi';
import api from '../api/axios';
import './Simulations.css';

const LABEL_MAP = {
  ideal: { text: 'Ideal', color: '#10b981' },
  alternativo: { text: 'Alternativo', color: '#3b82f6' },
  secundario: { text: 'Secundario', color: '#f59e0b' },
  sin_vacantes: { text: 'Si no alcanzo', color: '#ef4444' },
  personalizado: { text: 'Personalizado', color: '#8b5cf6' },
  asignado: { text: 'Asignado', color: '#6366f1' }
};

export default function Simulations() {
  const [simulations, setSimulations] = useState([]);
  const [selectedSim, setSelectedSim] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSimulations = async () => {
    try {
      const { data } = await api.get('/simulations');
      startTransition(() => setSimulations(data.simulations || []));
    } catch (err) { console.error(err); }
    finally { startTransition(() => setLoading(false)); }
  };

  useEffect(() => { fetchSimulations(); }, []);

  const viewSimulation = async (id) => {
    try {
      const { data } = await api.get(`/simulations/${id}`);
      setSelectedSim(data);
    } catch (err) { console.error(err); }
  };

  const toggleStar = async (id) => {
    try {
      await api.put(`/simulations/${id}/star`);
      fetchSimulations();
    } catch (err) { console.error(err); }
  };

  const deleteSim = async (id) => {
    if (!confirm('¿Eliminar esta simulación?')) return;
    try {
      await api.delete(`/simulations/${id}`);
      setSimulations(prev => prev.filter(s => s._id !== id));
      if (selectedSim?._id === id) setSelectedSim(null);
    } catch (err) { console.error(err); }
  };

  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const runComparison = async () => {
    if (compareIds.length < 2) return;
    try {
      const { data } = await api.post('/simulations/compare', { simulationIds: compareIds });
      setComparison(data);
    } catch (err) { console.error(err); }
  };

  const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  if (loading) return <div className="sim-loading"><div className="spinner"></div></div>;

  return (
    <div className="simulations-page">
      <div className="sim-header">
        <div>
          <h1>📋 Mis Simulaciones</h1>
          <p className="sim-subtitle">Horarios guardados para comparar antes de la matrícula</p>
        </div>
        <div className="sim-header-actions">
          <button
            className={`btn-compare ${compareMode ? 'active' : ''}`}
            onClick={() => { setCompareMode(!compareMode); setCompareIds([]); setComparison(null); }}
          >
            <HiOutlineDuplicate /> {compareMode ? 'Cancelar' : 'Comparar'}
          </button>
        </div>
      </div>

      {compareMode && (
        <div className="compare-bar">
          <span>Selecciona 2-3 simulaciones para comparar ({compareIds.length} seleccionadas)</span>
          <button className="btn-run-compare" onClick={runComparison} disabled={compareIds.length < 2}>
            Comparar seleccionadas
          </button>
        </div>
      )}

      {comparison && (
        <div className="comparison-panel">
          <h2>📊 Comparación de Horarios</h2>
          <div className="comparison-grid">
            {comparison.comparison.map((sim, idx) => (
              <div key={idx} className="comparison-card">
                <h3>{sim.name}</h3>
                <span className="comparison-label" style={{ background: LABEL_MAP[sim.label]?.color || '#8b5cf6' }}>
                  {LABEL_MAP[sim.label]?.text || sim.label}
                </span>
                <div className="comparison-stats">
                  <div className="cstat"><span>Cursos</span><strong>{sim.stats.totalCourses || 0}</strong></div>
                  <div className="cstat"><span>Créditos</span><strong>{sim.stats.totalCredits || 0}</strong></div>
                  <div className="cstat"><span>Días</span><strong>{sim.stats.daysWithClasses || 0}</strong></div>
                  <div className="cstat"><span>Huecos</span><strong>{sim.stats.totalGaps || 0}</strong></div>
                  <div className="cstat"><span>Score</span><strong>{sim.stats.score || 0}</strong></div>
                </div>
                <div className="comparison-schedule-mini">
                  {DAYS.map(day => (
                    <div key={day} className="mini-day">
                      <span className="mini-day-name">{day.substring(0, 3)}</span>
                      <div className="mini-day-slots">
                        {(sim.scheduleByDay?.[day] || []).map((s, i) => (
                          <div key={i} className="mini-slot" title={`${s.course} ${s.startTime}-${s.endTime}`}>
                            {s.startTime?.substring(0, 2)}
                          </div>
                        ))}
                        {(!sim.scheduleByDay?.[day]?.length) && <span className="mini-empty">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="comparison-metrics">
            <h3>Métricas comparativas</h3>
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Métrica</th>
                  {comparison.comparison.map((s, i) => <th key={i}>{s.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparison.metrics).map(([key, values]) => (
                  <tr key={key}>
                    <td>{key === 'credits' ? 'Créditos' : key === 'gaps' ? 'Huecos' : key === 'days' ? 'Días' : key === 'sessions' ? 'Sesiones' : key === 'score' ? 'Puntaje' : 'Hrs/día promedio'}</td>
                    {values.map((v, i) => {
                      const isBest = values.every(other => key === 'gaps' || key === 'days' ? v.value <= other.value : v.value >= other.value);
                      return <td key={i} className={isBest ? 'metric-best' : ''}>{v.value}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="sim-content">
        <div className="sim-list">
          {simulations.length === 0 ? (
            <div className="sim-empty">
              <HiOutlinePlus className="sim-empty-icon" />
              <p>No tienes simulaciones guardadas.</p>
              <p className="sim-empty-hint">Genera un horario y guárdalo como simulación para verlo aquí.</p>
            </div>
          ) : (
            simulations.map(sim => (
              <div
                key={sim._id}
                className={`sim-card ${selectedSim?._id === sim._id ? 'selected' : ''} ${compareMode && compareIds.includes(sim._id) ? 'compare-selected' : ''}`}
                onClick={() => compareMode ? toggleCompare(sim._id) : viewSimulation(sim._id)}
              >
                <div className="sim-card-header">
                  <span className="sim-label" style={{ background: LABEL_MAP[sim.label]?.color || '#8b5cf6' }}>
                    {LABEL_MAP[sim.label]?.text || sim.label}
                  </span>
                  <button className="btn-star" onClick={(e) => { e.stopPropagation(); toggleStar(sim._id); }}>
                    {sim.starred ? <HiStar className="star-filled" /> : <HiOutlineStar />}
                  </button>
                </div>
                <h3 className="sim-card-name">{sim.name}</h3>
                {sim.description && <p className="sim-card-desc">{sim.description}</p>}
                <div className="sim-card-meta">
                  <span>{sim.semester}</span>
                  <span>{new Date(sim.createdAt).toLocaleDateString('es-PE')}</span>
                </div>
                <div className="sim-card-actions">
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); viewSimulation(sim._id); }}><HiOutlineEye /></button>
                  <button className="btn-icon btn-danger" onClick={(e) => { e.stopPropagation(); deleteSim(sim._id); }}><HiOutlineTrash /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedSim && !compareMode && (
          <div className="sim-detail">
            <h2>{selectedSim.name}</h2>
            <div className="sim-detail-stats">
              <div className="sd-stat"><span>Cursos</span><strong>{selectedSim.stats?.totalCourses || 0}</strong></div>
              <div className="sd-stat"><span>Créditos</span><strong>{selectedSim.stats?.totalCredits || 0}</strong></div>
              <div className="sd-stat"><span>Sesiones</span><strong>{selectedSim.stats?.totalSessions || 0}</strong></div>
              <div className="sd-stat"><span>Huecos</span><strong>{selectedSim.stats?.totalGaps || 0}</strong></div>
              <div className="sd-stat"><span>Días</span><strong>{selectedSim.stats?.daysWithClasses || 0}</strong></div>
              <div className="sd-stat"><span>Score</span><strong>{selectedSim.stats?.score || 0}</strong></div>
            </div>
            <div className="sim-detail-grid">
              {DAYS.map(day => {
                const slots = (selectedSim.assignments || []).filter(a => a.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                return (
                  <div key={day} className="sd-day-col">
                    <div className="sd-day-header">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                    {slots.length === 0 ? <div className="sd-empty">Libre</div> : slots.map((s, i) => (
                      <div key={i} className="sd-slot">
                        <div className="sd-slot-time">{s.startTime} - {s.endTime}</div>
                        <div className="sd-slot-course">{s.courseId?.name || s.courseName || 'Curso'}</div>
                        <div className="sd-slot-info">{s.teacherName || ''} • {s.classroomCode || ''}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
