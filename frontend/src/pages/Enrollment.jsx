import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  useEffect(() => { loadEligible(); }, []);

  const loadEligible = async () => {
    setLoading(true);
    try {
      const res = await api.get('/student-schedule/eligible-courses');
      setData(res.data);
      // Auto-select: failed courses + current semester courses
      const autoSelect = new Set();
      (res.data.categories.failedToRetake || []).forEach(c => autoSelect.add(c._id));
      (res.data.categories.currentSemester || []).forEach(c => autoSelect.add(c._id));
      setSelectedIds(autoSelect);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleCourse = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setValidation(null);
    setGeneratedSchedule(null);
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
    } catch (e) { console.error(e); }
    setLoadingAvail(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/student-schedule/generate', { courseIds: [...selectedIds] });
      setGeneratedSchedule(res.data);
    } catch (e) { alert(e.response?.data?.message || 'Error al generar'); }
    setGenerating(false);
  };

  const selectedCredits = () => {
    if (!data) return 0;
    const all = [...(data.categories.failedToRetake || []), ...(data.categories.currentSemester || []), ...(data.categories.previousPending || [])];
    return all.filter(c => selectedIds.has(c._id)).reduce((s, c) => s + c.credits, 0);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!data) return <div className="card" style={{ padding: 32, textAlign: 'center' }}><p>No se pudo cargar la información académica.</p></div>;

  const { student, academicProgress, categories, summary } = data;

  return (
    <div className="enrollment-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1><HiOutlineAcademicCap /> Matrícula Académica</h1>
          <p>Selecciona los cursos que llevarás este semestre. El sistema validará tu avance y generará tu horario.</p>
        </div>
      </div>

      {/* Academic Progress */}
      <div className="enrollment-progress card">
        <div className="ep-info">
          <h3>{student.name}</h3>
          <span className="ep-meta">{student.career?.name || student.career} · Semestre {student.currentSemester} · {student.code}</span>
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
          {selectedCredits() > 22 && <span className="sb-warning"><HiOutlineExclamationCircle /> Excede 22 créditos</span>}
        </div>
        <div className="sb-actions">
          <button className="btn btn-outline btn-sm" onClick={handlePreviewAvailability} disabled={loadingAvail || selectedIds.size === 0}>
            <HiOutlineEye /> {loadingAvail ? 'Cargando...' : 'Ver horarios'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleValidate} disabled={validating || selectedIds.size === 0}>
            <HiOutlineCheckCircle /> {validating ? 'Validando...' : 'Validar'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleGenerate}
            disabled={generating || selectedIds.size === 0 || (validation && !validation.valid)}>
            <HiOutlineLightningBolt /> {generating ? 'Generando...' : 'Generar horario'}
          </button>
        </div>
      </div>

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

      {/* Generated schedule summary */}
      {generatedSchedule && (
        <div className="generated-result card">
          <h3><HiOutlineCheckCircle style={{ color: 'var(--success)' }} /> Horario generado</h3>
          <p>{generatedSchedule.message}</p>
          <div className="gr-stats">
            <span><strong>{generatedSchedule.stats.totalCourses}</strong> cursos</span>
            <span><strong>{generatedSchedule.stats.totalCredits}</strong> créditos</span>
            <span><strong>{generatedSchedule.stats.totalSessions}</strong> sesiones</span>
            <span><strong>{generatedSchedule.stats.shiftMatchPercent}%</strong> turno preferido</span>
          </div>

          {/* Schedule Alternatives */}
          {generatedSchedule.alternatives?.length > 0 && (
            <div className="alternatives-section">
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
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="gr-hint">Ve a "Mi horario" para ver tu horario completo en formato tabla.</p>
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
