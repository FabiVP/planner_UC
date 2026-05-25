import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  HiOutlineUserGroup, HiOutlineChartBar, HiOutlineClock,
  HiOutlineExclamationCircle, HiOutlineInformationCircle,
  HiOutlineCheckCircle, HiOutlineBriefcase, HiOutlineSun,
  HiOutlineMoon, HiOutlineEye
} from 'react-icons/hi';
import './StudentPreferences.css';

const DAY_LABELS = {
  lun: 'Lunes', mar: 'Martes', mie: 'Miércoles',
  jue: 'Jueves', vie: 'Viernes', sab: 'Sábado', dom: 'Domingo'
};

const SHIFT_LABELS = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };
const SHIFT_EMOJIS = { manana: '☀️', tarde: '🌤️', noche: '🌙' };
const SHIFT_TIMES = { manana: '7:00 - 13:00', tarde: '14:00 - 19:00', noche: '19:00 - 22:00' };

export default function StudentPreferences() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('heatmap');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/preferences/availability/students')
      .then(r => { setData(r.data); setLoading(false); })
      .catch(err => { setError('No se pudieron cargar las preferencias.'); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="card" style={{ padding: 20 }}><p className="text-muted">{error}</p></div>;
  if (!data) return null;

  const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  const shifts = ['manana', 'tarde', 'noche'];
  const maxCount = Math.max(1, ...Object.values(data.heatmap || {}).flatMap(s => Object.values(s)));

  const getHeatLevel = (count) => {
    if (count === 0) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.2) return 1;
    if (ratio <= 0.4) return 2;
    if (ratio <= 0.6) return 3;
    if (ratio <= 0.8) return 4;
    return 5;
  };

  const totalShiftVotes = data.shiftDistribution
    ? Object.values(data.shiftDistribution).reduce((a, b) => a + b, 0)
    : 1;

  return (
    <div className="student-prefs-page animate-fadeIn">
      <div className="page-header">
        <h1>Preferencias de Estudiantes</h1>
        <p>Visualización de las preferencias horarias registradas por los estudiantes. Estas preferencias <strong>no afectan</strong> la generación del horario institucional, pero sirven como apoyo para sugerir horarios al momento de la matrícula.</p>
      </div>

      <div className="info-banner">
        <HiOutlineInformationCircle />
        <div>
          Las preferencias de los estudiantes son informativas. El horario global institucional se genera según las políticas y restricciones del administrador académico. Las preferencias solo se consideran al momento de sugerir horarios personalizados durante la matrícula estudiantil.
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'var(--primary)' }}>
            <HiOutlineUserGroup />
          </div>
          <div>
            <span className="stat-value">{data.totalStudents}</span>
            <span className="stat-label">Estudiantes activos</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'var(--success)' }}>
            <HiOutlineCheckCircle />
          </div>
          <div>
            <span className="stat-value">{data.respondedPreferences}</span>
            <span className="stat-label">Con preferencias</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'var(--warning)' }}>
            <HiOutlineClock />
          </div>
          <div>
            <span className="stat-value">{data.pendingPreferences || 0}</span>
            <span className="stat-label">Sin configurar</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: data.conflictsDetected > 0 ? '#dc2626' : 'var(--info)' }}>
            <HiOutlineBriefcase />
          </div>
          <div>
            <span className="stat-value">{data.conflictsDetected}</span>
            <span className="stat-label">Trabajan y estudian</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pref-tabs">
        <button className={`pref-tab ${tab === 'heatmap' ? 'active' : ''}`} onClick={() => setTab('heatmap')}>
          <HiOutlineChartBar /> Mapa de calor
        </button>
        <button className={`pref-tab ${tab === 'distribution' ? 'active' : ''}`} onClick={() => setTab('distribution')}>
          <HiOutlineSun /> Distribución de turnos
        </button>
        <button className={`pref-tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
          <HiOutlineEye /> Detalle por estudiante
        </button>
      </div>

      {/* ═══ HEATMAP TAB ═══ */}
      {tab === 'heatmap' && (
        <div className="section-grid">
          <div className="card" style={{ padding: 20 }}>
            <div className="card-header" style={{ marginBottom: 16 }}>
              <h3 className="card-title">Disponibilidad por turno y día</h3>
            </div>
            <div className="heatmap-container">
              <table className="heatmap-table">
                <thead>
                  <tr>
                    <th>Turno</th>
                    {days.map(d => <th key={d}>{DAY_LABELS[d]?.slice(0, 3)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map(shift => (
                    <tr key={shift}>
                      <td>{SHIFT_EMOJIS[shift]} {SHIFT_LABELS[shift]}</td>
                      {days.map(day => {
                        const count = data.heatmap?.[shift]?.[day] || 0;
                        const level = getHeatLevel(count);
                        return (
                          <td key={day} className={`heatmap-cell-${level}`} title={`${count} estudiante(s) disponible(s)`}>
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Menos</span>
              {[0, 1, 2, 3, 4, 5].map(l => (
                <span key={l} className={`heatmap-cell-${l}`} style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 4, textAlign: 'center', lineHeight: '18px', fontSize: '0.65rem' }}>
                  {l > 0 ? '' : '0'}
                </span>
              ))}
              <span>Más</span>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="card-header" style={{ marginBottom: 16 }}>
              <h3 className="card-title">Horarios más populares</h3>
            </div>
            <div className="recommended-list">
              {(data.recommended || []).map((r, i) => (
                <div className="recommended-item" key={i}>
                  <div className={`recommended-rank rank-${r.rank}`}>{r.rank}</div>
                  <div className="recommended-info">
                    <span className="recommended-time">
                      {SHIFT_EMOJIS[r.shift]} {DAY_LABELS[r.day]} · {SHIFT_LABELS[r.shift]}
                    </span>
                    <span className="recommended-pct">{r.time} — {r.percentage}% de estudiantes</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(16,185,129,0.06)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Disponibilidad promedio:</strong> {data.averageAvailability}%
              <br />
              <strong>Mejor franja:</strong> {data.bestTimeSlot}
            </div>
          </div>
        </div>
      )}

      {/* ═══ DISTRIBUTION TAB ═══ */}
      {tab === 'distribution' && data.shiftDistribution && (
        <div className="card" style={{ padding: 20 }}>
          <div className="card-header" style={{ marginBottom: 16 }}>
            <h3 className="card-title">Preferencia de turno de los estudiantes</h3>
          </div>
          <div className="shift-distribution">
            {['manana', 'tarde', 'noche', 'indiferente'].map(shift => {
              const count = data.shiftDistribution[shift] || 0;
              const pct = totalShiftVotes > 0 ? Math.round((count / totalShiftVotes) * 100) : 0;
              return (
                <div className="shift-bar-card" key={shift}>
                  <div className="shift-bar-label">
                    <span>
                      <span className="shift-emoji">{SHIFT_EMOJIS[shift] || '🔄'}</span>{' '}
                      {SHIFT_LABELS[shift] || 'Indiferente'}
                    </span>
                    <strong>{pct}%</strong>
                  </div>
                  <div className="shift-bar-track">
                    <div className={`shift-bar-fill ${shift}`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="shift-bar-count">{count} estudiante(s)</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(245,158,11,0.06)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <HiOutlineExclamationCircle style={{ color: 'var(--warning)', fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>{data.conflictsDetected}</strong> estudiante(s) indicaron que trabajan mientras estudian.
              Estos estudiantes pueden tener disponibilidad horaria reducida, lo cual debe considerarse al momento de la matrícula.
            </div>
          </div>
        </div>
      )}

      {/* ═══ STUDENTS TAB ═══ */}
      {tab === 'students' && (
        <div className="card" style={{ padding: 20 }}>
          <div className="card-header" style={{ marginBottom: 16 }}>
            <h3 className="card-title">Preferencias individuales</h3>
            <span className="badge badge-info">{(data.studentPreferences || []).length} registros</span>
          </div>

          {(!data.studentPreferences || data.studentPreferences.length === 0) ? (
            <div className="empty-state">
              <p className="text-muted">Ningún estudiante ha registrado preferencias aún.</p>
            </div>
          ) : (
            <div className="student-table-container">
              <table className="student-pref-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Email</th>
                    <th>Turno preferido</th>
                    <th>Trabaja</th>
                    <th>Días disp.</th>
                    <th>Actualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.studentPreferences.map((sp, i) => (
                    <tr key={sp.userId || i}>
                      <td><strong>{sp.name}</strong></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{sp.email || '—'}</td>
                      <td>
                        <span className={`shift-chip ${sp.preferredShift}`}>
                          {SHIFT_EMOJIS[sp.preferredShift] || '🔄'}{' '}
                          {SHIFT_LABELS[sp.preferredShift] || 'Indiferente'}
                        </span>
                      </td>
                      <td>
                        <span className={`works-badge ${sp.worksWhileStudying ? 'yes' : 'no'}`}>
                          {sp.worksWhileStudying ? '⚠ Sí' : '✓ No'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <strong>{sp.availableDays}</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>/7</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {sp.updatedAt ? new Date(sp.updatedAt).toLocaleDateString('es-PE') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
