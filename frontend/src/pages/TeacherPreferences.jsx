import { useState, useEffect, startTransition } from 'react';
import api from '../api/axios';
import {
  HiOutlineUserGroup, HiOutlineChartBar, HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle, HiOutlineBriefcase, HiOutlineSun,
  HiOutlineEye, HiOutlineAcademicCap,
  HiOutlineChevronDown, HiOutlineChevronRight
} from 'react-icons/hi';
import './TeacherPreferences.css';

const DAY_LABELS = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
};
const DAY_SHORT = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom'
};
const SHIFT_LABELS = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };
const SHIFT_EMOJIS = { manana: '☀️', tarde: '🌤️', noche: '🌙' };


export default function TeacherPreferences() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('heatmap');
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  const loadData = async () => {
    startTransition(() => setLoading(true));
    try {
      const res = await api.get('/preferences/teachers/by-career');
      startTransition(() => setData(res.data));
    } catch (e) { console.error(e); }
    startTransition(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!data) return null;

  const heatmapDays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const heatmapShifts = ['manana', 'tarde', 'noche'];
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

  const allTeachers = data.careers?.flatMap(c => c.teachers) || [];

  return (
    <div className="teacher-prefs-page animate-fadeIn">
      <div className="page-header">
        <h1>Preferencias de Docentes</h1>
        <p>Preferencias registradas por los docentes desde su perfil: disponibilidad horaria, turno preferido, días libres y especialidades.</p>
      </div>

      <div className="info-banner">
        <HiOutlineInformationCircle />
        <div>
          Los docentes configuran sus preferencias desde <strong>Mi Perfil Docente</strong>.
          Las preferencias de docentes <strong>PH se respetan obligatoriamente</strong> en la generación de horarios.
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'var(--primary)' }}>
            <HiOutlineUserGroup />
          </div>
          <div>
            <span className="stat-value">{data.totalTeachers}</span>
            <span className="stat-label">Docentes activos</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'var(--success)' }}>
            <HiOutlineCheckCircle />
          </div>
          <div>
            <span className="stat-value">{data.withPreferences}</span>
            <span className="stat-label">Con preferencias</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: data.withoutPreferences > 0 ? 'var(--warning)' : 'var(--success)' }}>
            <HiOutlineClock />
          </div>
          <div>
            <span className="stat-value">{data.withoutPreferences}</span>
            <span className="stat-label">Sin configurar</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'var(--info)' }}>
            <HiOutlineAcademicCap />
          </div>
          <div>
            <span className="stat-value">{data.totalCareers ?? 0}</span>
            <span className="stat-label">Carreras</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pref-tabs">
        <button className={`pref-tab ${tab === 'heatmap' ? 'active' : ''}`} onClick={() => setTab('heatmap')}>
          <HiOutlineChartBar /> Mapa de calor
        </button>
        <button className={`pref-tab ${tab === 'distribution' ? 'active' : ''}`} onClick={() => setTab('distribution')}>
          <HiOutlineSun /> Distribución
        </button>
        <button className={`pref-tab ${tab === 'teachers' ? 'active' : ''}`} onClick={() => setTab('teachers')}>
          <HiOutlineEye /> Detalle por docente
        </button>
      </div>

      {/* ═══ HEATMAP TAB ═══ */}
      {tab === 'heatmap' && (
        <div className="section-grid">
          <div className="card" style={{ padding: 20 }}>
            <div className="card-header" style={{ marginBottom: 16 }}>
              <h3 className="card-title">Disponibilidad de docentes por turno y día</h3>
            </div>
            <div className="heatmap-container">
              <table className="heatmap-table">
                <thead>
                  <tr>
                    <th>Turno</th>
                    {heatmapDays.map(d => <th key={d}>{DAY_SHORT[d]}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {heatmapShifts.map(shift => (
                    <tr key={shift}>
                      <td>{SHIFT_EMOJIS[shift]} {SHIFT_LABELS[shift]}</td>
                      {heatmapDays.map(day => {
                        const count = data.heatmap?.[shift]?.[day] || 0;
                        const level = getHeatLevel(count);
                        return (
                          <td key={day} className={`heatmap-cell-${level}`} title={`${count} docente(s) disponible(s)`}>
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
            <div style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Disponibilidad promedio:</strong> {data.averageAvailability} franja(s) por docente
            </div>
          </div>
        </div>
      )}

      {/* ═══ DISTRIBUTION TAB ═══ */}
      {tab === 'distribution' && (
        <div className="section-grid">
          {/* Shift distribution */}
          <div className="card" style={{ padding: 20 }}>
            <div className="card-header" style={{ marginBottom: 16 }}>
              <h3 className="card-title">Preferencia de turno</h3>
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
                    <div className="shift-bar-count">{count} docente(s)</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contract distribution */}
          <div className="card" style={{ padding: 20 }}>
            <div className="card-header" style={{ marginBottom: 16 }}>
              <h3 className="card-title">Distribución por tipo de contrato</h3>
            </div>
            <div className="shift-distribution">
              {[
                { key: 'tc', label: 'TC (sin carga admin)', emoji: '📚', color: '#10b981' },
                { key: 'tcAdmin', label: 'TC + Carga admin', emoji: '📋', color: '#f59e0b' },
                { key: 'ph', label: 'Por Horas (PH)', emoji: '⏰', color: '#8b5cf6' }
              ].map(ct => {
                const count = data.contractDistribution[ct.key] || 0;
                const pct = data.totalTeachers > 0 ? Math.round((count / data.totalTeachers) * 100) : 0;
                return (
                  <div className="shift-bar-card" key={ct.key}>
                    <div className="shift-bar-label">
                      <span><span className="shift-emoji">{ct.emoji}</span> {ct.label}</span>
                      <strong>{pct}%</strong>
                    </div>
                    <div className="shift-bar-track">
                      <div className="shift-bar-fill" style={{ width: `${pct}%`, background: ct.color }}></div>
                    </div>
                    <div className="shift-bar-count">{count} docente(s)</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.06)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Total docentes:</strong> {data.totalTeachers} |
              <strong> PH:</strong> {data.contractDistribution.ph} |
              <strong> TC:</strong> {data.contractDistribution.tc + data.contractDistribution.tcAdmin}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TEACHERS TAB ═══ */}
      {tab === 'teachers' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '16px 20px', margin: 0, borderBottom: '1px solid var(--border)' }}>
            <h3 className="card-title">Preferencias individuales por docente</h3>
            <span className="badge badge-info">{allTeachers.length} registros</span>
          </div>

          {allTeachers.length === 0 ? (
            <div className="empty-state" style={{ padding: 48, textAlign: 'center' }}>
              <p className="text-muted">No hay docentes registrados.</p>
            </div>
          ) : (
            <div>
              {data.careers?.map((career) => (
                <div key={career.department}>
                  <div className="tp-career-subheader">
                    <HiOutlineAcademicCap style={{ fontSize: 16, color: 'var(--primary)' }} />
                    <span>{career.department}</span>
                    <span className="badge badge-info">{career.teachers.length}</span>
                  </div>
                  {career.teachers.map((t) => (
                    <div key={t._id} className={`tp-teacher-row ${!t.hasConfiguredPreferences ? 'pending' : ''}`}>
                      <div className="tp-teacher-main" onClick={() => setExpandedTeacher(expandedTeacher === t._id ? null : t._id)}>
                        <div className="tp-teacher-info">
                          <div className="tp-teacher-name">
                            {t.hasConfiguredPreferences
                              ? <HiOutlineCheckCircle className="tp-icon-ok" />
                              : <HiOutlineClock className="tp-icon-pending" />}
                            <strong>{t.name}</strong>
                            <span className={`tp-badge-contract ${t.contractType}`}>
                              {t.contractType === 'tiempo_completo'
                                ? (t.administrativeLoad ? 'TC + Admin' : 'TC')
                                : 'PH'}
                            </span>
                          </div>
                          <div className="tp-teacher-meta">
                            <span>{SHIFT_EMOJIS[t.preferredShift] || '🔄'} {SHIFT_LABELS[t.preferredShift] || 'Indiferente'}</span>
                            <span className="tp-sep">·</span>
                            <span><HiOutlineBriefcase /> {t.teachingHours || (t.contractType === 'por_horas' ? 20 : 36)}h</span>
                            <span className="tp-sep">·</span>
                            <span className={t.hasConfiguredPreferences ? 'tp-text-ok' : 'tp-text-pending'}>
                              {t.hasConfiguredPreferences ? 'Configurado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>
                        {expandedTeacher === t._id ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
                      </div>

                      {expandedTeacher === t._id && (
                        <div className="tp-teacher-detail">
                          <div className="tp-detail-grid">
                            <div className="tp-detail-item">
                              <span className="tp-detail-label">Turno preferido</span>
                              <span className="tp-detail-value">
                                {SHIFT_EMOJIS[t.preferredShift] || '🔄'} {SHIFT_LABELS[t.preferredShift] || 'Indiferente'}
                              </span>
                            </div>
                            <div className="tp-detail-item">
                              <span className="tp-detail-label">Horas enseñanza</span>
                              <span className="tp-detail-value">{t.teachingHours || (t.contractType === 'por_horas' ? 20 : 36)}h semanales</span>
                            </div>
                            <div className="tp-detail-item tp-detail-full">
                              <span className="tp-detail-label">Franjas de disponibilidad</span>
                              {t.availabilitySlots?.length > 0 ? (
                                <div className="tp-avail-slot-list">
                                  {t.availabilitySlots.map((slot, i) => (
                                    <div key={i} className="tp-avail-slot-item">
                                      <span className="tp-day-badge">{DAY_LABELS[slot.day] || slot.day}</span>
                                      <span className="tp-time-badge">{slot.startTime} — {slot.endTime}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="tp-detail-na">No configurado</span>
                              )}
                            </div>
                            <div className="tp-detail-item">
                              <span className="tp-detail-label">Días libres</span>
                              {t.freeDays?.length > 0 ? (
                                <div className="tp-chip-list">
                                  {t.freeDays.map(d => (
                                    <span key={d} className="tp-chip-free">{DAY_SHORT[d] || d}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="tp-detail-na">Ninguno</span>
                              )}
                            </div>
                            <div className="tp-detail-item">
                              <span className="tp-detail-label">Especialidades</span>
                              {t.specializations?.length > 0 ? (
                                <div className="tp-chip-list">
                                  {t.specializations.map((s, i) => (
                                    <span key={i} className="tp-chip-spec">{s.code} — {s.name}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="tp-detail-na">Sin especialidades</span>
                              )}
                            </div>
                            <div className="tp-detail-item">
                              <span className="tp-detail-label">Última actualización</span>
                              <span className="tp-detail-value">
                                {t.lastUpdated ? new Date(t.lastUpdated).toLocaleDateString('es-PE', {
                                  year: 'numeric', month: 'long', day: 'numeric'
                                }) : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}