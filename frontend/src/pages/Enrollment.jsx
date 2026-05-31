import { useState, useEffect, startTransition, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  HiOutlineBookOpen, HiOutlineCheckCircle, HiOutlineExclamationCircle,
  HiOutlineXCircle, HiOutlineLightningBolt, HiOutlineLockClosed,
  HiOutlineRefresh, HiOutlineAcademicCap, HiOutlineEye, HiOutlineClock
} from 'react-icons/hi';
import './Enrollment.css';

const PRIORITY_CONFIG = {
  alta: { label: 'Repetir', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  media: { label: 'Pendiente', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  normal: { label: 'Semestre actual', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  bloqueado: { label: 'Bloqueado', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
};

const DAY_LABELS = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom'
};

export default function Enrollment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [generateError, setGenerateError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const loadEligible = async () => {
    startTransition(() => { setLoading(true); setError(null); });
    try {
      const res = await api.get('/student-schedule/eligible-courses');
      const autoSelect = new Set();
      (res.data.categories.failedToRetake || []).forEach(c => autoSelect.add(c._id));
      (res.data.categories.currentSemester || []).forEach(c => autoSelect.add(c._id));
      startTransition(() => {
        setData(res.data);
        setSelectedIds(autoSelect);
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo cargar la información académica.';
      startTransition(() => setError(msg));
    }
    startTransition(() => setLoading(false));
  };

  useEffect(() => { loadEligible(); }, []);

  const toggleCourse = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setValidation(null);
    setGeneratedSchedule(null);
    setGenerateError(null);
    setAvailability(null);
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const res = await api.post('/student-schedule/validate', { courseIds: [...selectedIds] });
      setValidation(res.data);
    } catch (e) { alert(e.response?.data?.message || 'Error al validar'); }
    setValidating(false);
  };

  const handlePreviewAvailability = async () => {
    setLoadingAvail(true);
    try {
      const res = await api.post('/student-schedule/course-availability', { courseIds: [...selectedIds] });
      setAvailability(res.data);
    } catch { console.error('Error al cargar disponibilidad'); }
    setLoadingAvail(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const courseIds = [...selectedIds];
      const res = await api.post('/student-schedule/generate', { courseIds });
      setGeneratedSchedule(res.data);
      localStorage.setItem('lastStudentScheduleCourseIds', JSON.stringify(courseIds));
      localStorage.setItem('lastStudentSchedule', JSON.stringify(res.data));
    } catch (e) {
      const msg = e.response?.data?.message || 'Error al generar horario.';
      startTransition(() => setGenerateError(msg));
    }
    setGenerating(false);
  };

  const selectedCredits = () => {
    if (!data?.categories) return 0;
    const all = [...(data.categories.failedToRetake || []), ...(data.categories.currentSemester || []), ...(data.categories.previousPending || [])];
    return all.filter(c => selectedIds.has(c._id)).reduce((s, c) => s + (c.credits || 0), 0);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="card" style={{ padding: 32, textAlign: 'center' }}><p style={{ color: 'var(--danger)' }}>{error}</p></div>;
  if (!data) return <div className="card" style={{ padding: 32, textAlign: 'center' }}><p>No se pudo cargar la información académica.</p></div>;

  const { student, academicProgress, categories } = data;

  return (
    <div className="enrollment-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1><HiOutlineAcademicCap /> Planificación Académica</h1>
          <p>Selecciona los cursos que llevarás este semestre. El sistema validará tu avance y generará tu horario.</p>
        </div>
      </div>

      {/* Academic Progress */}
      <div className="enrollment-progress card">
        <div className="ep-info">
          <h3>{student.name}</h3>
          <span className="ep-meta">{student.career?.name || student.career} · Semestre {student.currentSemester} · {student.studentCode || student.code}</span>
        </div>
        <div className="ep-stats">
          <div className="ep-stat">
            <div className="ep-progress-ring">
              <svg viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="var(--border)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="var(--primary)" strokeWidth="3"
                  strokeDasharray={`${academicProgress.progressPercent}, 100`} strokeLinecap="round" />
              </svg>
              <span className="ep-percent">{academicProgress.progressPercent}%</span>
            </div>
            <span className="ep-stat-label">Avance</span>
          </div>
          <div className="ep-stat">
            <span className="ep-stat-val">{academicProgress.coursesApproved}</span>
            <span className="ep-stat-label">Aprobados</span>
          </div>
          <div className="ep-stat">
            <span className="ep-stat-val" style={{ color: academicProgress.coursesFailed > 0 ? '#dc2626' : undefined }}>
              {academicProgress.coursesFailed}
            </span>
            <span className="ep-stat-label">Desaprobados</span>
          </div>
          <div className="ep-stat">
            <span className="ep-stat-val">{academicProgress.totalCreditsApproved}</span>
            <span className="ep-stat-label">Créditos</span>
          </div>
        </div>
      </div>

      {/* Selection Summary Bar */}
      <div className="selection-bar card">
        <div className="sb-info">
          <strong>{selectedIds.size}</strong> curso(s) seleccionado(s)
          <span className="sb-credits">{selectedCredits()} créditos</span>
          {selectedCredits() > (data?.summary?.maxCredits || 22) && <span className="sb-warning"><HiOutlineExclamationCircle /> Excede {data?.summary?.maxCredits || 22} créditos</span>}
        </div>
        <div className="sb-actions">
          <button className="btn btn-outline btn-sm" onClick={handlePreviewAvailability} disabled={loadingAvail || selectedIds.size === 0}>
            <HiOutlineEye /> {loadingAvail ? 'Cargando...' : 'Ver horarios'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleValidate} disabled={validating || selectedIds.size === 0}>
            <HiOutlineCheckCircle /> {validating ? 'Validando...' : 'Validar'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleGenerate}
            disabled={generating || selectedIds.size === 0}>
            <HiOutlineLightningBolt /> {generating ? 'Generando...' : 'Generar horario'}
          </button>
        </div>
      </div>

      {/* Generate Error */}
      {generateError && (
        <div className="card" style={{ padding: 16, marginBottom: 16, borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--danger)', margin: 0 }}><HiOutlineExclamationCircle /> {generateError}</p>
        </div>
      )}

      {/* Availability Preview */}
      {availability && availability.available && (
        <div className="avail-preview card">
          <h4><HiOutlineClock /> Horarios disponibles en el horario institucional</h4>
          <div className="avail-preview-courses">
            {availability.courses?.map(course => (
              <div key={course.courseId} className="avail-course-block">
                <strong>{course.code} — {course.name}</strong>
                <div className="avail-slots">
                  {course.slots.map((s, i) => (
                    <span key={i} className="avail-slot-chip">
                      {DAY_LABELS[s.day] || s.day} {s.startTime}–{s.endTime} · {s.teacher} · {s.classroom}
                    </span>
                  ))}
                  {course.slots.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sin horario asignado</span>}
                </div>
              </div>
            ))}
            {availability.courses?.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Los cursos seleccionados no tienen horario asignado en el calendario institucional.</p>}
          </div>
          {availability.hasConflicts && (
            <div className="avail-conflict-list">
              <strong style={{ fontSize: 12 }}>⚠️ Cruces de horario detectados:</strong>
              {availability.conflicts.map((c, i) => (
                <div key={i} className="avail-conflict-item">
                  <HiOutlineExclamationCircle /> {c.course1} ↔ {c.course2} — {DAY_LABELS[c.day] || c.day} {c.time}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Validation Results */}
      {validation && (
        <div className={`validation-panel card ${validation.valid ? 'valid' : 'invalid'}`}>
          <h4>{validation.valid ? <><HiOutlineCheckCircle /> Selección válida</> : <><HiOutlineXCircle /> Errores en la selección</>}</h4>
          {validation.errors?.length > 0 && (
            <div className="val-list errors">
              {validation.errors.map((e, i) => <div key={i} className="val-item error"><HiOutlineXCircle /> {e}</div>)}
            </div>
          )}
          {validation.warnings?.length > 0 && (
            <div className="val-list warnings">
              {validation.warnings.map((w, i) => <div key={i} className="val-item warning"><HiOutlineExclamationCircle /> {w}</div>)}
            </div>
          )}
          {validation.conflicts?.length > 0 && (
            <div className="val-list conflicts">
              <strong>Cruces de horario:</strong>
              {validation.conflicts.map((c, i) => (
                <div key={i} className="val-item warning">
                  {c.course1} ⟷ {c.course2} — {c.day} {c.time}
                </div>
              ))}
            </div>
          )}
          {validation.valid && validation.warnings?.length === 0 && (
            <p className="val-ok">✓ Todos los prerrequisitos cumplidos. {validation.totalCredits} créditos totales.</p>
          )}

          {/* ── Difficulty Analysis ── */}
          {validation.difficultyAnalysis && (
            <div className="diff-analysis-panel" style={{ marginTop: 12 }}>
              <h4 style={{ marginBottom: 8, fontSize: '0.9rem' }}>📊 Análisis de carga académica</h4>
              <div className="diff-analysis-grid">
                <div className="da-stat">
                  <span className="da-label">Dificultad promedio</span>
                  <strong className="da-value">
                    {'★'.repeat(Math.round(validation.difficultyAnalysis.average))}{'☆'.repeat(5 - Math.round(validation.difficultyAnalysis.average))}
                    <small style={{ marginLeft: 4 }}>{validation.difficultyAnalysis.average}/5</small>
                  </strong>
                </div>
                <div className="da-stat">
                  <span className="da-label">Nivel de carga</span>
                  <strong className="da-value" style={{
                    color: validation.difficultyAnalysis.overloadLevel === 'alta' ? '#dc2626'
                      : validation.difficultyAnalysis.overloadLevel === 'media' ? '#f59e0b' : '#10b981'
                  }}>
                    {validation.difficultyAnalysis.overloadLevel === 'alta' ? '🔴 Alta'
                      : validation.difficultyAnalysis.overloadLevel === 'media' ? '🟡 Media' : '🟢 Normal'}
                  </strong>
                </div>
                <div className="da-stat">
                  <span className="da-label">Balance</span>
                  <strong className="da-value">{validation.difficultyAnalysis.balance}</strong>
                </div>
                {validation.gpa > 0 && (
                  <div className="da-stat">
                    <span className="da-label">Tu GPA</span>
                    <strong className="da-value">{validation.gpa}</strong>
                  </div>
                )}
              </div>
              {validation.difficultyAnalysis.hardCourses?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: '0.8rem' }}>
                  <span style={{ color: '#dc2626' }}>Cursos difíciles: </span>
                  {validation.difficultyAnalysis.hardCourses.map(c => c.code).join(', ')}
                </div>
              )}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6, fontStyle: 'italic' }}>
                {validation.difficultyAnalysis.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Course Categories */}
      <div className="enrollment-grid">
        {/* Failed courses to retake */}
        {categories.failedToRetake.length > 0 && (
          <div className="enroll-section">
            <div className="es-header alta">
              <HiOutlineExclamationCircle />
              <h3>Cursos desaprobados — Debe repetir ({categories.failedToRetake.length})</h3>
            </div>
            <div className="course-list">
              {categories.failedToRetake.map(c => renderCourseCard(c, 'alta'))}
            </div>
          </div>
        )}

        {/* Previous pending */}
        {categories.previousPending.length > 0 && (
          <div className="enroll-section">
            <div className="es-header media">
              <HiOutlineRefresh />
              <h3>Cursos pendientes de semestres anteriores ({categories.previousPending.length})</h3>
            </div>
            <div className="course-list">
              {categories.previousPending.map(c => renderCourseCard(c, 'media'))}
            </div>
          </div>
        )}

        {/* Current semester */}
        {categories.currentSemester.length > 0 && (
          <div className="enroll-section">
            <div className="es-header normal">
              <HiOutlineBookOpen />
              <h3>Cursos del semestre {student.currentSemester} ({categories.currentSemester.length})</h3>
            </div>
            <div className="course-list">
              {categories.currentSemester.map(c => renderCourseCard(c, 'normal'))}
            </div>
          </div>
        )}

        {/* Blocked by prerequisites */}
        {categories.blockedByPrereq.length > 0 && (
          <div className="enroll-section">
            <div className="es-header bloqueado">
              <HiOutlineLockClosed />
              <h3>Bloqueados por prerrequisitos ({categories.blockedByPrereq.length})</h3>
            </div>
            <div className="course-list">
              {categories.blockedByPrereq.map(c => renderCourseCard(c, 'bloqueado'))}
            </div>
          </div>
        )}
      </div>

      {/* Generated schedule with grid */}
      {generatedSchedule?.schedule?.assignments && (
        <div className="generated-result card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}><HiOutlineCheckCircle style={{ color: 'var(--success)' }} /> Horario generado</h3>
            <button className="btn btn-primary btn-sm" onClick={() => {
              const data = { ...generatedSchedule, alternatives: [] };
              localStorage.setItem('lastStudentSchedule', JSON.stringify(data));
              navigate('/my-schedules');
            }}>
              Usar esta alternativa → Mi Horario
            </button>
          </div>
          <p>{generatedSchedule.message}</p>
          <div className="gr-stats">
            <span><strong>{generatedSchedule.stats.totalCourses}</strong> cursos</span>
            <span><strong>{generatedSchedule.stats.totalCredits}</strong> créditos</span>
            <span><strong>{generatedSchedule.stats.totalSessions}</strong> sesiones</span>
            <span><strong>{generatedSchedule.stats.shiftMatchPercent}%</strong> turno preferido</span>
            <span><strong>{generatedSchedule.stats.totalGaps || 0}</strong> huecos</span>
          </div>

          <ScheduleTable assignments={generatedSchedule.schedule.assignments} />

          {/* Observations */}
          {generatedSchedule.observations?.length > 0 && (
            <div className="uncovered-section" style={{ marginTop: 16, padding: 12, background: '#FFF8E1', borderRadius: 8, border: '1px solid #FDD835' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#F57F17', margin: '0 0 8px' }}>Observaciones</h4>
              {generatedSchedule.observations.map((o, i) => (
                <div key={i} style={{ fontSize: 12, color: '#795548', marginBottom: 4 }}>
                  ⚠ <strong>{o.courseCode}</strong> — {o.courseName}: {o.message}
                </div>
              ))}
            </div>
          )}

          {/* Uncovered courses */}
          {generatedSchedule.uncoveredCourses?.length > 0 && (
            <div className="uncovered-section" style={{ marginTop: 16, padding: 12, background: 'var(--warning-bg)', borderRadius: 8 }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--warning)' }}>Cursos sin horario disponible</h4>
              {generatedSchedule.uncoveredCourses.map((c, i) => (
                <span key={i} className="badge badge-warning" style={{ marginRight: 6 }}>{c.code} — {c.name}</span>
              ))}
            </div>
          )}

          {/* Schedule Alternatives */}
          {generatedSchedule.alternatives?.length > 0 && (
            <div className="alternatives-section" style={{ marginTop: 16 }}>
              <h4><HiOutlineLightningBolt /> Alternativas de horario</h4>
              <div className="alternatives-grid">
                  {generatedSchedule.alternatives.map((alt, i) => (
                    <div key={i} className="alt-card">
                      <div className="alt-card-header">
                        <h5>{alt.label}</h5>
                        <span className="alt-card-score">Score: {alt.score}</span>
                      </div>
                      <div className="alt-card-stats">
                        <span><strong>{alt.stats.totalCourses}</strong> cursos</span>
                        <span><strong>{alt.stats.totalCredits}</strong> créd</span>
                        <span><strong>{alt.stats.shiftMatchPercent}%</strong> turno</span>
                        <span><strong>{alt.stats.totalGaps || 0}</strong> huecos</span>
                      </div>
                      <ScheduleTable assignments={alt.assignments} />
                      {alt.observations?.length > 0 && (
                        <div style={{ marginTop: 8, padding: 8, background: '#FFF8E1', borderRadius: 6, border: '1px solid #FDD835', fontSize: 11, color: '#795548' }}>
                          {alt.observations.map((o, j) => (
                            <div key={j}>⚠ <strong>{o.courseCode}</strong> — {o.message}</div>
                          ))}
                        </div>
                      )}
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => {
                        const updated = {
                          ...generatedSchedule,
                          schedule: { ...generatedSchedule.schedule, assignments: alt.assignments },
                          stats: alt.stats,
                          observations: alt.observations || [],
                          uncoveredCourses: alt.uncoveredCourses || [],
                          message: `Alternativa: ${alt.label}`,
                          alternatives: []
                        };
                        setGeneratedSchedule(updated);
                        localStorage.setItem('lastStudentSchedule', JSON.stringify(updated));
                        navigate('/my-schedules');
                      }}>
                        Usar esta alternativa → Mi Horario
                      </button>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function renderCourseCard(course, priority) {
    const config = PRIORITY_CONFIG[priority];
    const isSelected = selectedIds.has(course._id);
    const isBlocked = priority === 'bloqueado';
    return (
      <label key={course._id} className={`course-card ${priority} ${isSelected ? 'selected' : ''} ${isBlocked ? 'disabled' : ''}`}>
        <input type="checkbox" checked={isSelected} disabled={isBlocked}
          onChange={() => toggleCourse(course._id)} />
        <div className="cc-content">
          <div className="cc-header">
            <span className="cc-code">{course.code}</span>
            <span className="cc-badge" style={{ background: config.bg, color: config.color }}>{config.label}</span>
          </div>
          <span className="cc-name">{course.name}</span>
          <div className="cc-meta">
            <span>Sem {course.semester}</span>
            <span>{course.credits} créd</span>
            <span>{course.type}</span>
            {course.mandatory && <span className="cc-mandatory">Obligatorio</span>}
          </div>
          {course.prerequisites?.length > 0 && (
            <div className="cc-prereqs">
              <span className="cc-prereq-label">Prerreq:</span>
              {course.prerequisites.map(p => (
                <span key={p.code} className={`cc-prereq ${course.unmetPrereqs?.some(u => u.code === p.code) ? 'unmet' : 'met'}`}>
                  {p.code}
                </span>
              ))}
            </div>
          )}
          {course.reason && <span className="cc-reason">{course.reason}</span>}
        </div>
      </label>
    );
  }
}

function ScheduleTable({ assignments }) {
  const DAY_CONFIG = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];
  const TIME_SLOTS = [
    '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
    '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
    '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00',
    '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'
  ];
  const CELL_COLORS = [
    { bg: '#E8F5E9', border: '#43A047', text: '#2E7D32' },
    { bg: '#E3F2FD', border: '#1E88E5', text: '#1565C0' },
    { bg: '#FFF8E1', border: '#FDD835', text: '#F57F17' },
    { bg: '#F3E5F5', border: '#AB47BC', text: '#7B1FA2' },
    { bg: '#FFEBEE', border: '#EF5350', text: '#C62828' },
    { bg: '#E0F2F1', border: '#26A69A', text: '#00695C' },
    { bg: '#FCE4EC', border: '#EC407A', text: '#AD1457' },
    { bg: '#FFF3E0', border: '#FF7043', text: '#D84315' },
  ];

  const colorMap = useMemo(() => {
    const courses = [...new Set(assignments.map(a => a.courseId?.name || a.courseId?.code || a.courseId))];
    const map = {};
    courses.forEach((c, i) => { map[c] = CELL_COLORS[i % CELL_COLORS.length]; });
    return map;
  }, [assignments]);

  const getAssignment = (day, slot) => {
    const start = slot.split(' - ')[0];
    return assignments.find(a => a.day === day && a.startTime === start);
  };

  const slotsToShow = TIME_SLOTS;

  const dayLabel = { lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom' };

  return (
    <div className="schedule-grid-container" style={{ overflowX: 'auto', marginTop: 16 }}>
      <div style={{ marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {assignments.map((a, i) => {
          const c = CELL_COLORS[i % CELL_COLORS.length];
          return (
            <span key={i} style={{
              padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
              background: c.bg, color: c.text, border: `1px solid ${c.border}`
            }}>
              {a.courseId?.code || '?'} — {dayLabel[a.day] || a.day} {a.startTime}
            </span>
          );
        })}
      </div>
      <table className="schedule-table compact" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th className="time-col" style={{ padding: 8, border: '1px solid var(--border)', background: 'var(--bg-main)' }}>Hora</th>
            {DAY_CONFIG.map(d => <th key={d.key} style={{ padding: 8, border: '1px solid var(--border)', background: 'var(--bg-main)', textAlign: 'center' }}>{d.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {slotsToShow.map(slot => (
            <tr key={slot}>
              <td className="time-cell" style={{ padding: '4px 8px', border: '1px solid var(--border)', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{slot}</td>
              {DAY_CONFIG.map(d => {
                const a = getAssignment(d.key, slot);
                if (!a) return <td key={d.key} style={{ border: '1px solid var(--border)' }}></td>;
                const name = a.courseId?.name || a.courseId?.code || 'Curso';
                const code = a.courseId?.code || '';
                const c = colorMap[name] || CELL_COLORS[0];
                return (
                  <td key={d.key} style={{ border: '1px solid var(--border)' }}>
                    <div style={{
                      background: c.bg, borderLeft: `3px solid ${c.border}`, color: c.text,
                      padding: '4px 6px', borderRadius: 4, fontSize: 11, minHeight: 40
                    }}>
                      <strong>{name}</strong><br />
                      <span style={{ fontSize: 10 }}>{code}{a.classroomId?.code ? ` · ${a.classroomId.code}` : ''}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
