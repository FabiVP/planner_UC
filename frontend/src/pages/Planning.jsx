import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineBookOpen,
  HiOutlineChevronLeft, HiOutlineExclamationCircle, HiOutlineCheckCircle,
  HiOutlineClipboardList, HiOutlineLightningBolt, HiOutlineTrendingUp,
  HiOutlineOfficeBuilding, HiOutlineAdjustments
} from 'react-icons/hi';
import './Planning.css';

const statusLabels = { cubierto: 'Cubierto', exacto: 'Justo', deficit: 'Déficit' };
const statusIcons = { cubierto: <HiOutlineCheckCircle />, exacto: <HiOutlineExclamationCircle />, deficit: <HiOutlineExclamationCircle /> };

export default function Planning() {
  const [mode, setMode] = useState('demand'); // 'demand' | 'projection'
  const [careers, setCareers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [demand, setDemand] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDemand, setLoadingDemand] = useState(false);

  // Projection state
  const [projection, setProjection] = useState(null);
  const [loadingProjection, setLoadingProjection] = useState(false);
  const [passRate, setPassRate] = useState(75);
  const [growthRate, setGrowthRate] = useState(5);

  useEffect(() => { loadSummary(); }, []);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get('/careers/summary/all');
      setSummary(res.data);
      setCareers(res.data.summary || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const selectCareer = async (career, forceMode) => {
    setSelectedCareer(career);
    setSemesterFilter('all');
    setExpandedCourse(null);
    const activeMode = forceMode || mode;
    if (activeMode === 'demand') {
      setLoadingDemand(true);
      try { const res = await api.get(`/careers/${career._id}/demand`); setDemand(res.data); }
      catch (err) { console.error(err); }
      setLoadingDemand(false);
    } else {
      loadProjection(career._id);
    }
  };

  const loadProjection = async (careerId) => {
    setLoadingProjection(true);
    try {
      const res = await api.get(`/projections/${careerId}?passRate=${passRate}&growthRate=${growthRate}`);
      setProjection(res.data);
    } catch (err) { console.error(err); }
    setLoadingProjection(false);
  };

  const goBack = () => {
    setSelectedCareer(null);
    setDemand(null);
    setProjection(null);
    setSemesterFilter('all');
    setExpandedCourse(null);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    if (selectedCareer) {
      if (newMode === 'projection') loadProjection(selectedCareer._id);
      else selectCareer(selectedCareer, newMode);
    }
  };

  // Stats
  const totalCareers = careers.length;
  const totalDeficitCareers = careers.filter(c => c.status === 'deficit').length;
  const totalTeachersNeeded = careers.reduce((s, c) => s + c.totalTeachersNeeded, 0);
  const totalDeficitSum = careers.reduce((s, c) => s + c.totalDeficit, 0);

  const filteredDemand = demand?.demand?.filter(d =>
    semesterFilter === 'all' || d.semester === Number(semesterFilter)
  ) || [];
  const semesters = [...new Set((demand?.demand || []).map(d => d.semester))].sort((a, b) => a - b);

  const filteredProjection = projection?.projection?.filter(p =>
    semesterFilter === 'all' || p.semester === Number(semesterFilter)
  ) || [];
  const projSemesters = [...new Set((projection?.projection || []).map(p => p.semester))].sort((a, b) => a - b);

  if (loading) {
    return <div className="planning-page animate-fadeIn"><div className="planning-loading"><div className="spinner"></div><span>Cargando carreras…</span></div></div>;
  }

  return (
    <div className="planning-page animate-fadeIn">
      {/* HEADER + MODE TOGGLE */}
      <div className="planning-header">
        <div>
          <h1><HiOutlineClipboardList /> Planificación Académica</h1>
          <p>{selectedCareer
            ? (mode === 'demand' ? `Análisis de demanda docente — ${selectedCareer.name}` : `Proyección académica — ${selectedCareer.name}`)
            : 'Selecciona una carrera para analizar demanda y proyección'}</p>
        </div>
        <div className="mode-toggle">
          <button className={`mode-btn ${mode === 'demand' ? 'active' : ''}`} onClick={() => switchMode('demand')}>
            <HiOutlineUserGroup /> Demanda
          </button>
          <button className={`mode-btn ${mode === 'projection' ? 'active' : ''}`} onClick={() => switchMode('projection')}>
            <HiOutlineTrendingUp /> Proyección
          </button>
        </div>
      </div>

      {/* GLOBAL SUMMARY */}
      {!selectedCareer && (
        <div className="planning-summary">
          <div className="summary-card">
            <div className="summary-icon" style={{ background: 'var(--primary)' }}><HiOutlineAcademicCap /></div>
            <div className="summary-info">
              <span className="summary-val">{totalCareers}</span>
              <span className="summary-label">Carreras</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon" style={{ background: 'var(--success)' }}><HiOutlineUserGroup /></div>
            <div className="summary-info">
              <span className="summary-val">{summary?.totalUniqueTeachers || 0}</span>
              <span className="summary-label">Docentes activos</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon" style={{ background: 'var(--warning)' }}><HiOutlineBookOpen /></div>
            <div className="summary-info">
              <span className="summary-val">{totalTeachersNeeded}</span>
              <span className="summary-label">Docentes necesarios</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon" style={{ background: totalDeficitSum > 0 ? 'var(--error)' : 'var(--success)' }}>
              <HiOutlineLightningBolt />
            </div>
            <div className="summary-info">
              <span className="summary-val">{totalDeficitSum}</span>
              <span className="summary-label">Déficit total</span>
            </div>
          </div>
        </div>
      )}

      {/* CAREER CARDS */}
      {!selectedCareer && (
        <div className="career-grid">
          {careers.map(career => (
            <div key={career._id} className="career-card" onClick={() => selectCareer(career)}>
              <div className="career-card-header">
                <span className="career-code">{career.code}</span>
                <span className={`career-status-dot ${career.status}`}
                  title={career.status === 'deficit' ? `${career.totalDeficit} docentes faltantes` : 'Cobertura completa'} />
              </div>
              <h3>{career.name}</h3>
              <span className="faculty">{career.faculty}</span>
              <div className="career-stats-row">
                <div className="career-stat">
                  <span className="career-stat-value">{career.totalCourses}</span>
                  <span className="career-stat-label">Cursos</span>
                </div>
                <div className="career-stat">
                  <span className="career-stat-value">{career.totalTeachersNeeded}</span>
                  <span className="career-stat-label">Docentes req.</span>
                </div>
                <div className="career-stat">
                  <span className="career-stat-value" style={{ color: career.totalDeficit > 0 ? 'var(--error)' : 'var(--success)' }}>
                    {career.totalDeficit > 0 ? `-${career.totalDeficit}` : '✓'}
                  </span>
                  <span className="career-stat-label">Déficit</span>
                </div>
                <div className="career-stat">
                  <span className="career-stat-value">{career.coursesWithDeficit}</span>
                  <span className="career-stat-label">Sin cobertura</span>
                </div>
              </div>
            </div>
          ))}
          {careers.length === 0 && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
              <p className="text-muted">No hay carreras registradas.</p>
            </div>
          )}
        </div>
      )}

      {/* ═════════════ DEMAND VIEW ═════════════ */}
      {selectedCareer && mode === 'demand' && (
        <div className="demand-panel">
          {demand && (
            <div className="planning-summary" style={{ marginBottom: '1rem' }}>
              <div className="summary-card"><div className="summary-icon" style={{ background: 'var(--primary)' }}><HiOutlineBookOpen /></div><div className="summary-info"><span className="summary-val">{demand.totalCourses}</span><span className="summary-label">Total cursos</span></div></div>
              <div className="summary-card"><div className="summary-icon" style={{ background: 'var(--warning)' }}><HiOutlineUserGroup /></div><div className="summary-info"><span className="summary-val">{demand.totalTeachersNeeded}</span><span className="summary-label">Docentes necesarios</span></div></div>
              <div className="summary-card"><div className="summary-icon" style={{ background: 'var(--success)' }}><HiOutlineCheckCircle /></div><div className="summary-info"><span className="summary-val">{demand.coursesCovered}</span><span className="summary-label">Cubiertos</span></div></div>
              <div className="summary-card"><div className="summary-icon" style={{ background: demand.totalDeficit > 0 ? 'var(--error)' : 'var(--success)' }}><HiOutlineExclamationCircle /></div><div className="summary-info"><span className="summary-val">{demand.coursesWithDeficit}</span><span className="summary-label">Con déficit</span></div></div>
            </div>
          )}
          <div className="demand-header">
            <h2><button className="back-btn" onClick={goBack}><HiOutlineChevronLeft /></button>Cursos de {selectedCareer.name}</h2>
            {semesters.length > 1 && (
              <div className="semester-filter">
                <button className={`semester-btn ${semesterFilter === 'all' ? 'active' : ''}`} onClick={() => setSemesterFilter('all')}>Todos</button>
                {semesters.map(s => (<button key={s} className={`semester-btn ${semesterFilter === s ? 'active' : ''}`} onClick={() => setSemesterFilter(s)}>Sem {s}</button>))}
              </div>
            )}
          </div>
          {loadingDemand ? (
            <div className="planning-loading"><div className="spinner"></div><span>Analizando demanda…</span></div>
          ) : (
            <div className="demand-grid">
              {filteredDemand.map(d => (
                <div key={d.courseId} className={`demand-card ${d.status}`} onClick={() => setExpandedCourse(expandedCourse === d.courseId ? null : d.courseId)}>
                  <div className="demand-card-top">
                    <div>
                      <h4>{d.courseName}</h4>
                      <div className="demand-card-meta"><span>{d.courseCode}</span><span>•</span><span>Sem {d.semester}</span><span>•</span><span>{d.credits} créd.</span><span>•</span><span className={`badge badge-${d.type === 'laboratorio' ? 'info' : 'success'}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>{d.type}</span></div>
                    </div>
                    <span className={`demand-badge ${d.status}`}>{statusIcons[d.status]} {statusLabels[d.status]}</span>
                  </div>
                  <div className="demand-stats">
                    <div className="demand-stat"><span className="demand-stat-val">{d.sessionsPerWeek}×{d.hoursPerSession}h</span><span className="demand-stat-lbl">Sesiones</span></div>
                    <div className="demand-stat"><span className="demand-stat-val">{d.teachersNeeded}</span><span className="demand-stat-lbl">Docentes req.</span></div>
                    <div className="demand-stat"><span className="demand-stat-val" style={{ color: d.deficit > 0 ? 'var(--error)' : 'var(--success)' }}>{d.qualifiedTeachersCount}</span><span className="demand-stat-lbl">Disponibles</span></div>
                  </div>
                  {expandedCourse === d.courseId && (
                    <div className="demand-teachers">
                      <h5>{d.qualifiedTeachers.length > 0 ? `Docentes calificados (${d.qualifiedTeachers.length})` : 'Sin docentes asignados'}</h5>
                      {d.qualifiedTeachers.length > 0 ? d.qualifiedTeachers.map(t => (<span key={t._id} className="teacher-chip"><HiOutlineUserGroup style={{ fontSize: '0.8rem' }} />{t.name}<span style={{ opacity: 0.6 }}>· {t.preferredShift}</span></span>)) : (<p className="no-teachers">⚠ Se necesita{d.teachersNeeded > 1 ? `n ${d.teachersNeeded} docentes` : ' 1 docente'} para este curso.</p>)}
                    </div>
                  )}
                </div>
              ))}
              {filteredDemand.length === 0 && (<div className="card" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}><p className="text-muted">No hay cursos para este semestre.</p></div>)}
            </div>
          )}
        </div>
      )}

      {/* ═════════════ PROJECTION VIEW ═════════════ */}
      {selectedCareer && mode === 'projection' && (
        <div className="projection-panel">
          <div className="demand-header">
            <h2><button className="back-btn" onClick={goBack}><HiOutlineChevronLeft /></button>Proyección — {selectedCareer.name}</h2>
            <div className="projection-controls">
              <div className="control-group">
                <label>Tasa aprobación</label>
                <div className="control-input">
                  <input type="range" min="40" max="100" step="5" value={passRate} onChange={e => setPassRate(+e.target.value)} />
                  <strong>{passRate}%</strong>
                </div>
              </div>
              <div className="control-group">
                <label>Crecimiento</label>
                <div className="control-input">
                  <input type="range" min="0" max="20" step="1" value={growthRate} onChange={e => setGrowthRate(+e.target.value)} />
                  <strong>{growthRate}%</strong>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => loadProjection(selectedCareer._id)}>
                <HiOutlineAdjustments /> Recalcular
              </button>
            </div>
          </div>

          {loadingProjection ? (
            <div className="planning-loading"><div className="spinner"></div><span>Calculando proyección…</span></div>
          ) : projection ? (
            <>
              {/* Projection Summary */}
              <div className="planning-summary" style={{ marginBottom: '1rem' }}>
                <div className="summary-card">
                  <div className="summary-icon" style={{ background: 'var(--primary)' }}><HiOutlineUserGroup /></div>
                  <div className="summary-info">
                    <span className="summary-val">{projection.summary.totalProjectedStudents}</span>
                    <span className="summary-label">Alumnos proyectados</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon" style={{ background: 'var(--info)' }}><HiOutlineBookOpen /></div>
                  <div className="summary-info">
                    <span className="summary-val">{projection.summary.totalSectionsNeeded}</span>
                    <span className="summary-label">Secciones necesarias</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon" style={{ background: 'var(--warning)' }}><HiOutlineUserGroup /></div>
                  <div className="summary-info">
                    <span className="summary-val">{projection.summary.totalTeachersRequired}</span>
                    <span className="summary-label">Docentes requeridos</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon" style={{ background: projection.summary.teacherDeficit > 0 ? 'var(--error)' : 'var(--success)' }}>
                    <HiOutlineOfficeBuilding />
                  </div>
                  <div className="summary-info">
                    <span className="summary-val">{projection.summary.teacherDeficit}</span>
                    <span className="summary-label">Déficit docente</span>
                  </div>
                </div>
              </div>

              {/* Infrastructure panel */}
              <div className="infra-panel card">
                <h4><HiOutlineOfficeBuilding /> Infraestructura Disponible</h4>
                <div className="infra-grid">
                  <div className="infra-item">
                    <span className="infra-val">{projection.infrastructure.classrooms.teorico}</span>
                    <span className="infra-label">Aulas teóricas</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-val">{projection.infrastructure.classrooms.laboratorio}</span>
                    <span className="infra-label">Laboratorios</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-val">{projection.infrastructure.classrooms.aula_virtual}</span>
                    <span className="infra-label">Aulas virtuales</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-val">{projection.infrastructure.teachers.total}</span>
                    <span className="infra-label">Docentes ({projection.infrastructure.teachers.fullTime} TC / {projection.infrastructure.teachers.partTime} PH)</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-val">{projection.infrastructure.teachers.weeklyHoursCapacity}h</span>
                    <span className="infra-label">Capacidad horas/sem</span>
                  </div>
                  <div className="infra-item">
                    <span className="infra-val">{projection.summary.totalHoursNeeded}h</span>
                    <span className="infra-label">Horas requeridas</span>
                  </div>
                </div>
              </div>

              {/* Semester filter */}
              {projSemesters.length > 1 && (
                <div className="semester-filter" style={{ marginTop: 16, marginBottom: 12 }}>
                  <button className={`semester-btn ${semesterFilter === 'all' ? 'active' : ''}`} onClick={() => setSemesterFilter('all')}>Todos</button>
                  {projSemesters.map(s => (<button key={s} className={`semester-btn ${semesterFilter === s ? 'active' : ''}`} onClick={() => setSemesterFilter(s)}>Sem {s}</button>))}
                </div>
              )}

              {/* Projection cards per semester */}
              <div className="projection-grid">
                {filteredProjection.map(sem => (
                  <div key={sem.semester} className="card projection-card">
                    <div className="projection-card-header">
                        <h3>Semestre {sem.semester}</h3>
                        <div className="projection-badges">
                          <span className={`proj-badge ${sem.projectionBasis === 'historical' ? 'basis-historical' : 'basis-rate'}`}
                            title={sem.projectionBasis === 'historical'
                              ? `Basado en ${sem.eligibleStudentCount} alumnos que aprobaron los prerrequisitos`
                              : sem.semester === 1
                                ? 'Estimado por tasa de crecimiento'
                                : 'Estimado por tasa de aprobación (sin datos históricos de prerrequisitos)'}>
                            {sem.projectionBasis === 'historical' ? `📊 ${sem.eligibleStudentCount} aptos` : '📈 estimado'}
                          </span>
                          <span className="proj-badge students">{sem.projectedStudents} alumnos</span>
                          <span className="proj-badge sections">{sem.totalSections} secciones</span>
                          {sem.classroomDeficit > 0 && <span className="proj-badge deficit">⚠ {sem.classroomDeficit} aulas faltantes</span>}
                        </div>
                      </div>
                    <div className="projection-stats">
                      <div className="proj-stat"><span className="proj-stat-val">{sem.currentStudents}</span><span className="proj-stat-lbl">Actuales</span></div>
                      <div className="proj-stat highlight"><span className="proj-stat-val">{sem.projectedStudents}</span><span className="proj-stat-lbl">Proyectados</span></div>
                      <div className="proj-stat"><span className="proj-stat-val">{sem.totalCourses}</span><span className="proj-stat-lbl">Cursos</span></div>
                      <div className="proj-stat"><span className="proj-stat-val">{sem.totalHours}h</span><span className="proj-stat-lbl">Horas/sem</span></div>
                      <div className="proj-stat"><span className="proj-stat-val">{sem.totalTeachersNeeded}</span><span className="proj-stat-lbl">Docentes req.</span></div>
                    </div>
                    {/* Courses in this semester */}
                    <div className="projection-courses">
                      {sem.courses.map(c => (
                        <div key={c.courseId} className="proj-course-row">
                          <div className="proj-course-info">
                            <span className="proj-course-code">{c.code}</span>
                            <span className="proj-course-name">{c.name}</span>
                          </div>
                          <div className="proj-course-stats">
                            <span>{c.sectionsNeeded} secc.</span>
                            <span className={c.classroomSufficient ? 'text-success' : 'text-danger'} title={`${c.classroomsAdequate} aulas con capacidad >= ${c.studentsPerSection} alumnos`}>
                              {c.classroomsAdequate} {c.requiredClassroomType === 'laboratorio' ? 'labs' : 'aulas'} aptas
                            </span>
                            <span>{c.totalHours}h</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
