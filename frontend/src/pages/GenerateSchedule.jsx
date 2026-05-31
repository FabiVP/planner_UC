import { useState, useEffect, startTransition } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Modal from '../components/ui/Modal';
import { CURRENT_SEMESTER_DASH } from '../utils/constants';
import { HiOutlineAdjustments, HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineChartPie, HiOutlineAcademicCap, HiOutlineEye } from 'react-icons/hi';
import './GenerateSchedule.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const TIME_SLOTS = [
  '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
  '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
  '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
];

const CELL_COLORS = [
  { bg: 'var(--sched-green)', border: 'var(--sched-green-border)', text: 'var(--sched-green-text)' },
  { bg: 'var(--sched-blue)', border: 'var(--sched-blue-border)', text: 'var(--sched-blue-text)' },
  { bg: 'var(--sched-yellow)', border: 'var(--sched-yellow-border)', text: 'var(--sched-yellow-text)' },
  { bg: 'var(--sched-orange)', border: 'var(--sched-orange-border)', text: 'var(--sched-orange-text)' },
  { bg: 'var(--sched-purple)', border: 'var(--sched-purple-border)', text: 'var(--sched-purple-text)' },
  { bg: 'var(--sched-red)', border: 'var(--sched-red-border)', text: 'var(--sched-red-text)' },
  { bg: 'var(--sched-teal)', border: 'var(--sched-teal-border)', text: 'var(--sched-teal-text)' },
  { bg: 'var(--sched-pink)', border: 'var(--sched-pink-border)', text: 'var(--sched-pink-text)' },
];

export default function GenerateSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrefs, setShowPrefs] = useState(true);
  const [prefsTab, setPrefsTab] = useState('preferencias');
  const [restrictions, setRestrictions] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [unsatisfied, setUnsatisfied] = useState([]);
  const [, setAlternatives] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [showEval, setShowEval] = useState(false);

  const buildColorMap = (assignments) => {
    const courses = [...new Set(assignments.map(a => a.courseId?.name || a.courseId))];
    const map = {};
    courses.forEach((c, i) => { map[c] = CELL_COLORS[i % CELL_COLORS.length]; });
    setColorMap(map);
  };

  const loadLatestSchedule = async () => {
    try {
      const res = await api.get('/generations');
      const gens = res.data.generations || [];
      const completed = gens.find(g => g.status === 'completada');
      if (completed) {
        startTransition(() => {
          setGeneration(completed);
          setUnsatisfied(completed.unsatisfiedConditions || []);
          setAlternatives(completed.alternatives || []);
        });
        if (completed.scheduleId) {
          const sRes = await api.get(`/schedule/${completed.scheduleId._id || completed.scheduleId}`);
          startTransition(() => {
            setSchedule(sRes.data);
            buildColorMap(sRes.data.assignments || []);
          });
        }
      }
    } catch (e) { console.error(e); }
  };

  const loadRestrictions = async () => {
    try {
      const res = await api.get('/restrictions');
      startTransition(() => setRestrictions(res.data.restrictions || []));
    } catch { /* ignore */ }
  };

  const loadPreferences = async () => {
    try {
      const res = await api.get('/preferences');
      startTransition(() => setPreferences(res.data));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadLatestSchedule();
      loadRestrictions();
    loadPreferences();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/generations/generate', {
        name: `Horario ${user?.name || ''}`,
        semester: CURRENT_SEMESTER_DASH
      });
      setGeneration(res.data.generation);
      setSchedule(res.data.schedule);
      setUnsatisfied(res.data.unsatisfiedConditions || []);
      setAlternatives(res.data.alternatives || []);
      buildColorMap(res.data.schedule?.assignments || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getAssignment = (day, timeSlot) => {
    if (!schedule?.assignments) return null;
    const dayMap = { 'Lunes': 'lunes', 'Martes': 'martes', 'Miércoles': 'miercoles', 'Jueves': 'jueves', 'Viernes': 'viernes' };
    const start = timeSlot.split(' - ')[0];
    return schedule.assignments.find(a => a.day === dayMap[day] && a.startTime === start);
  };

  const totalCredits = schedule?.assignments
    ? [...new Set(schedule.assignments.map(a => a.courseId?._id))].reduce((sum, id) => {
        const a = schedule.assignments.find(x => x.courseId?._id === id);
        return sum + (a?.courseId?.credits || 0);
      }, 0)
    : 0;

  return (
    <div className="generate-page">
      <div className="generate-header">
        <div>
          <h1>Mi horario generado {generation?.status === 'completada' && <span className="badge badge-success">Óptimo</span>}</h1>
          <p>Período {generation?.semester || CURRENT_SEMESTER_DASH} &nbsp;·&nbsp; Generado: {generation?.completedAt ? new Date(generation.completedAt).toLocaleString('es-PE') : '—'}</p>
        </div>
        <div className="generate-actions">
          <button className="btn btn-outline" onClick={() => setShowPrefs(!showPrefs)}>
            <HiOutlineAdjustments /> {showPrefs ? 'Ocultar' : 'Editar'} preferencias
          </button>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            <HiOutlineRefresh className={loading ? 'spin-icon' : ''} />
            {loading ? 'Generando...' : 'Regenerar horario'}
          </button>
        </div>
      </div>

      <div className={`generate-content ${showPrefs ? 'with-panel' : ''}`}>
        {/* Schedule Grid */}
        <div className="schedule-section">
          <div className="schedule-grid-container card">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="time-col">Hora</th>
                  {DAYS.map(d => <th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map(slot => (
                  <tr key={slot}>
                    <td className="time-cell">{slot}</td>
                    {DAYS.map(day => {
                      const a = getAssignment(day, slot);
                      if (!a) return <td key={day} className="empty-cell"></td>;
                      const courseName = a.courseId?.name || 'Curso';
                      const color = colorMap[courseName] || CELL_COLORS[0];
                      return (
                        <td key={day} className="schedule-cell-td">
                          <div
                            className="schedule-cell"
                            style={{ background: color.bg, borderLeft: `3px solid ${color.border}`, color: color.text }}
                          >
                            <span className="cell-course">{courseName}</span>
                            <span className="cell-detail">{a.classroomId?.code || ''}</span>
                            <span className="cell-detail">{a.startTime} - {a.endTime}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Bar */}
          <div className="schedule-status-bar">
            <div className="status-item">
              <HiOutlineCheckCircle className="status-icon success" />
              <div><span className="status-label">Estado</span><span className="status-value">{generation?.status === 'completada' ? 'Horario válido' : 'Sin generar'}</span></div>
            </div>
            <div className="status-item">
              <HiOutlineChartPie className="status-icon primary" />
              <div><span className="status-label">Puntaje de optimización</span><span className="status-value">{generation?.qualityScore || 0} / 100</span></div>
            </div>
            <div className="status-item">
              <HiOutlineAcademicCap className="status-icon info" />
              <div><span className="status-label">Créditos totales</span><span className="status-value">{totalCredits}</span></div>
            </div>
            <button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setShowEval(true)}>
              <HiOutlineEye /> Ver detalle de evaluación →
            </button>
          </div>

          {/* Unsatisfied Conditions */}
          {unsatisfied.length > 0 && (
            <div className="unsatisfied-panel card">
              <div className="unsatisfied-header">
                <span className="unsatisfied-icon">⚠️</span>
                <div>
                  <h3>No fue posible cumplir todas las condiciones</h3>
                  <p>Se generó el mejor horario posible priorizando la validez del horario.</p>
                </div>
              </div>
              <div className="unsatisfied-list">
                {unsatisfied.map((c, i) => (
                  <div key={i} className="unsatisfied-item">
                    <span className="unsatisfied-dot" data-impact={c.impact}></span>
                    <div>
                      <strong>{c.condition}</strong>
                      <p>{c.details}</p>
                    </div>
                    <span className={`badge badge-${c.impact === 'Alto' ? 'error' : c.impact === 'Medio' ? 'warning' : 'info'}`}>
                      Impacto: {c.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preferences Panel */}
        {showPrefs && (
          <div className="prefs-panel card animate-fadeIn">
            <h3>Preferencias y restricciones</h3>
            <p className="card-subtitle">Configura tus preferencias para generar el mejor horario posible.</p>

            <div className="tabs" style={{ marginTop: 16 }}>
              <button className={`tab ${prefsTab === 'preferencias' ? 'active' : ''}`} onClick={() => setPrefsTab('preferencias')}>Preferencias</button>
              <button className={`tab ${prefsTab === 'institucionales' ? 'active' : ''}`} onClick={() => setPrefsTab('institucionales')}>Restricciones institucionales</button>
            </div>

            {prefsTab === 'preferencias' && preferences && (
              <div className="prefs-content">
                <h4>Disponibilidad horaria</h4>
                <p className="hint">Selecciona los bloques en los que prefieres tener clases.</p>
                <div className="availability-grid">
                  <div className="avail-header"><span></span>{['Lun','Mar','Mié','Jue','Vie'].map(d => <span key={d}>{d}</span>)}</div>
                  {[{label: 'Mañana', sub: '07:00 - 12:00', key: 'manana'}, {label: 'Tarde', sub: '12:00 - 18:00', key: 'tarde'}, {label: 'Noche', sub: '18:00 - 22:00', key: 'noche'}].map(shift => (
                    <div key={shift.key} className="avail-row">
                      <div className="avail-shift"><strong>{shift.label}</strong><small>{shift.sub}</small></div>
                      {['lun','mar','mie','jue','vie'].map(day => (
                        <label key={day} className="avail-check">
                          <input type="checkbox" checked={preferences.availability?.[shift.key]?.[day] !== false} disabled />
                        </label>
                      ))}
                    </div>
                  ))}
                </div>

                <h4 style={{ marginTop: 20 }}>Preferencias adicionales</h4>
                <div className="checkbox-grid">
                  {[
                    { key: 'avoidBefore8am', label: 'Evitar clases antes de las 8:00 a.m.' },
                    { key: 'avoidGaps', label: 'Evitar huecos entre clases' },
                    { key: 'preferFewerDays', label: 'Preferir días con menos carga académica' },
                    { key: 'groupSameSubjectConsecutive', label: 'Agrupar clases de la misma materia en días consecutivos' },
                  ].map(p => (
                    <div key={p.key} className="checkbox-item">
                      <input type="checkbox" id={p.key} checked={preferences.additionalPreferences?.[p.key] || false} disabled />
                      <label htmlFor={p.key}>{p.label}</label>
                    </div>
                  ))}
                </div>

                <h4 style={{ marginTop: 20 }}>Prioridad de objetivos</h4>
                <p className="hint">Arrastra para ordenar por prioridad (1 = más importante)</p>
                <div className="priority-list">
                  {(preferences.priorityOrder || ['conflicts', 'institutional', 'gaps', 'personal']).map((p, i) => (
                    <div key={p} className="priority-item">
                      <span className="priority-num">{i + 1}</span>
                      <span>{
                        { conflicts: 'Evitar conflictos de horario', institutional: 'Cumplir restricciones institucionales', gaps: 'Minimizar huecos', personal: 'Preferencias personales' }[p]
                      }</span>
                    </div>
                  ))}
                </div>

                <div className="prefs-note">
                  <span>ℹ️</span> En caso de no poder cumplir todos los objetivos, se prioriza la validez del horario.
                </div>
              </div>
            )}

            {prefsTab === 'institucionales' && (
              <div className="prefs-content">
                <div className="restrictions-list">
                  {restrictions.filter(r => r.type === 'dura').map(r => (
                    <div key={r.id} className="restriction-row">
                      <div>
                        <strong>{r.rule}</strong>
                        <p>{r.description}</p>
                      </div>
                      <span className="badge badge-active">Activa</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de evaluación */}
      <Modal isOpen={showEval} onClose={() => setShowEval(false)} title="Detalle de Evaluación del Horario">
        {generation ? (
          <div className="eval-modal-content">
            <div className="eval-score-big">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="8"
                  strokeDasharray="251" strokeDashoffset={251 - (251 * (generation.qualityScore || 0) / 100)}
                  strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <div className="eval-score-center">
                <span className="eval-score-num">{generation.qualityScore || 0}</span>
                <span className="eval-score-label">/ 100</span>
              </div>
            </div>

            <div className="eval-metrics">
              {[
                { label: 'Validez de horario', value: generation.constraintsFulfilled || 95, weight: '25%', color: 'var(--success)' },
                { label: 'Restricciones institucionales', value: generation.constraintsFulfilled || 90, weight: '25%', color: 'var(--primary)' },
                { label: 'Preferencias personales', value: generation.preferencesScore || 80, weight: '30%', color: 'var(--warning)' },
                { label: 'Optimización de recursos', value: generation.resourceUsage || 85, weight: '20%', color: 'var(--info)' },
              ].map(m => (
                <div key={m.label} className="eval-metric-row">
                  <div className="eval-metric-header">
                    <span>{m.label}</span>
                    <span className="eval-metric-val">{m.value}% <small>({m.weight})</small></span>
                  </div>
                  <div className="eval-progress-bar">
                    <div className="eval-progress-fill" style={{ width: `${m.value}%`, background: m.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            {unsatisfied.length > 0 && (
              <div className="eval-unsatisfied">
                <h4>Condiciones no satisfechas ({unsatisfied.length})</h4>
                {unsatisfied.map((c, i) => (
                  <div key={i} className="eval-condition-row">
                    <span className={`badge badge-${c.impact === 'Alto' ? 'error' : c.impact === 'Medio' ? 'warning' : 'info'}`}>{c.impact}</span>
                    <div><strong>{c.condition}</strong><p>{c.details}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted">Genera un horario primero para ver su evaluación.</p>
        )}
      </Modal>
    </div>
  );
}
