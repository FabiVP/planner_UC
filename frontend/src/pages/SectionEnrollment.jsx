import { useState, useEffect } from 'react';
import api from '../api/axios';
import { CURRENT_SEMESTER_DASH } from '../utils/constants';
import {
  HiOutlineCalendar, HiOutlineLightningBolt, HiOutlineCheckCircle,
  HiOutlineExclamationCircle, HiOutlineClock, HiOutlineAcademicCap
} from 'react-icons/hi';
import './SectionEnrollment.css';

const DAY_LABELS = { lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom' };
const DAYS_ORDER = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export default function SectionEnrollment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [suggested, setSuggested] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);

  useEffect(() => { loadSections(); }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const r = await api.get('/sections/student-available');
      setData(r.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleSection = (sectionId) => {
    setSelected(prev => prev.includes(sectionId) ? prev.filter(s => s !== sectionId) : [...prev, sectionId]);
    setEnrollResult(null);
  };

  const handleSuggest = async () => {
    if (!data) return;
    const courseIds = [...new Set(data.eligible.map(s => s.courseId))];
    try {
      const r = await api.post('/sections/suggest', { courseIds });
      setSuggested(r.data);
      setSelected(r.data.suggested.map(s => s.sectionId));
    } catch (e) { console.error(e); }
  };

  const handleEnroll = async () => {
    if (!selected.length) return;
    setEnrolling(true);
    setEnrollResult(null);
    try {
      const r = await api.post('/sections/enroll', { sectionIds: selected, semester: CURRENT_SEMESTER_DASH });
      setEnrollResult({ success: true, data: r.data });
    } catch (e) {
      setEnrollResult({ success: false, data: e.response?.data || { message: 'Error' } });
    }
    setEnrolling(false);
  };

  // Check if a section has time conflict with currently selected
  const hasConflict = (section) => {
    const selectedSections = data?.eligible?.filter(s => selected.includes(s.sectionId)) || [];
    for (const sel of selectedSections) {
      if (sel.sectionId === section.sectionId) continue;
      for (const slot of section.scheduleSlots || []) {
        for (const selSlot of sel.scheduleSlots || []) {
          if (slot.day === selSlot.day && slot.startTime < selSlot.endTime && slot.endTime > selSlot.startTime) {
            return sel.courseCode;
          }
        }
      }
    }
    return null;
  };

  // Group eligible sections by course
  const groupedByCourse = {};
  if (data?.eligible) {
    for (const s of data.eligible) {
      if (!groupedByCourse[s.courseId]) groupedByCourse[s.courseId] = { course: s, sections: [] };
      groupedByCourse[s.courseId].sections.push(s);
    }
  }

  const totalCredits = data?.eligible?.filter(s => selected.includes(s.sectionId))
    .reduce((sum, s) => {
      const already = data.eligible.find(o => o.courseId === s.courseId && selected.includes(o.sectionId) && o.sectionId !== s.sectionId);
      return already ? sum : sum + s.credits;
    }, 0) || 0;

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="section-enroll-page animate-fadeIn">
      <div className="page-header">
        <h1><HiOutlineCalendar /> Armar mi Horario</h1>
        <p>Selecciona las secciones disponibles para construir tu horario del semestre.</p>
      </div>

      {data?.student && (
        <div className="student-info-bar">
          <span><HiOutlineAcademicCap /> {data.student.name}</span>
          <span>Semestre {data.student.semester}</span>
          <span>{data.student.career?.name || '—'}</span>
          <span className="credits-badge">{totalCredits} créditos seleccionados</span>
        </div>
      )}

      <div className="enroll-layout">
        {/* Left: Section picker */}
        <div className="enroll-picker">
          <div className="picker-header">
            <h3>Secciones disponibles ({data?.eligible?.length || 0})</h3>
            <button className="btn btn-outline btn-sm" onClick={handleSuggest}>
              <HiOutlineLightningBolt /> Sugerir mejor horario
            </button>
          </div>

          {suggested && (
            <div className="suggestion-banner">
              <HiOutlineCheckCircle />
              <span>Sugerencia aplicada: {suggested.totalCourses} cursos, {suggested.totalCredits} créditos</span>
            </div>
          )}

          {Object.values(groupedByCourse).map(group => (
            <div key={group.course.courseId} className="course-group">
              <div className="course-group-header">
                <span className="course-group-code">{group.course.courseCode}</span>
                <span className="course-group-name">{group.course.courseName}</span>
                <span className="course-group-credits">{group.course.credits} cr.</span>
                {group.course.isFailed && <span className="badge badge-danger">Desaprobado</span>}
              </div>
              <div className="sections-list">
                {group.sections.map(sec => {
                  const isSelected = selected.includes(sec.sectionId);
                  const conflictWith = !isSelected ? hasConflict(sec) : null;
                  return (
                    <div key={sec.sectionId}
                      className={`section-option ${isSelected ? 'selected' : ''} ${!sec.canEnroll ? 'disabled' : ''} ${conflictWith ? 'conflict' : ''}`}
                      onClick={() => sec.canEnroll && !conflictWith && toggleSection(sec.sectionId)}
                    >
                      <div className="section-option-top">
                        <span className="section-letter">Sección {sec.sectionCode}</span>
                        <span className="section-teacher">👨‍🏫 {sec.teacher}</span>
                        <span className="section-capacity">{sec.enrolled}/{sec.capacity}</span>
                      </div>
                      <div className="section-option-slots">
                        {sec.scheduleSlots?.map((slot, i) => (
                          <span key={i} className="slot-pill">
                            {DAY_LABELS[slot.day] || slot.day} {slot.startTime}-{slot.endTime}
                          </span>
                        ))}
                      </div>
                      {!sec.hasSpace && <span className="section-full">Sin cupo</span>}
                      {conflictWith && <span className="section-conflict">Cruza con {conflictWith}</span>}
                      {!sec.prereqsMet && <span className="section-blocked">Prerrequisito pendiente</span>}
                      {isSelected && <HiOutlineCheckCircle className="check-icon" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {data?.blocked?.length > 0 && (
            <div className="blocked-section">
              <h4>Cursos bloqueados ({data.blocked.length})</h4>
              {data.blocked.map(b => (
                <div key={b.sectionId} className="blocked-item">
                  <span>{b.courseCode} — {b.courseName}</span>
                  <small>{b.reason}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Preview + Confirm */}
        <div className="enroll-preview">
          <div className="preview-card">
            <h3>Mi Horario</h3>
            <div className="mini-schedule">
              {DAYS_ORDER.map(day => {
                const daySlots = data?.eligible
                  ?.filter(s => selected.includes(s.sectionId))
                  .flatMap(s => (s.scheduleSlots || []).filter(sl => sl.day === day).map(sl => ({ ...sl, code: s.courseCode, sec: s.sectionCode })))
                  .sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];
                if (!daySlots.length) return null;
                return (
                  <div key={day} className="mini-day">
                    <span className="mini-day-label">{DAY_LABELS[day]}</span>
                    <div className="mini-day-slots">
                      {daySlots.map((sl, i) => (
                        <span key={i} className="mini-slot">{sl.code}-{sl.sec} {sl.startTime}-{sl.endTime}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="preview-summary">
              <span>{selected.length} secciones</span>
              <span>{totalCredits} créditos</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}
              onClick={handleEnroll} disabled={enrolling || !selected.length}>
              {enrolling ? 'Matriculando...' : 'Confirmar matrícula'}
            </button>

            {enrollResult && (
              <div className={`enroll-feedback ${enrollResult.success ? 'success' : 'error'}`}>
                {enrollResult.success ? (
                  <><HiOutlineCheckCircle /> Matrícula confirmada — {enrollResult.data.enrollment?.totalCredits} créditos</>
                ) : (
                  <>
                    <HiOutlineExclamationCircle /> {enrollResult.data.message}
                    {enrollResult.data.conflicts?.map((c, i) => <div key={i} className="conflict-detail">{c}</div>)}
                    {enrollResult.data.errors?.map((e, i) => <div key={i} className="error-detail">{e}</div>)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
