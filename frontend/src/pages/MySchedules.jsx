import { useState, useEffect, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  HiOutlineCalendar, HiOutlineExclamationCircle,
  HiOutlineLightningBolt, HiOutlineSaveAs
} from 'react-icons/hi';
import './MySchedules.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_KEYS = { 'Lunes': 'lunes', 'Martes': 'martes', 'Miércoles': 'miercoles', 'Jueves': 'jueves', 'Viernes': 'viernes', 'Sábado': 'sabado', 'Domingo': 'domingo' };
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

export default function MySchedules() {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Coordinator state
  const [tab, setTab] = useState('generados');
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Teacher state
  const [teacherData, setTeacherData] = useState(null);

  // Student state
  const [studentData, setStudentData] = useState(null);
  const [generatingStudent, setGeneratingStudent] = useState(false);
  const [savingSimulation, setSavingSimulation] = useState(false);

  // Coordinator sections state
  const [sectionData, setSectionData] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [viewSemester, setViewSemester] = useState(null);
  const [selectedGen, setSelectedGen] = useState(null);

  // ───── COORDINATOR ─────
  const loadGenerations = async () => {
    try {
      const res = await api.get('/generations');
      startTransition(() => setGenerations(res.data.generations || []));
    } catch { /* ignore */ }
    startTransition(() => setLoading(false));
  };

  // ───── TEACHER ─────
  const loadTeacherSchedule = async () => {
    try {
      const res = await api.get('/schedule/my-teaching');
      startTransition(() => setTeacherData(res.data));
    } catch (e) { console.error(e); }
    startTransition(() => setLoading(false));
  };

  // ───── STUDENT ─────
  const loadStudentSchedule = async () => {
    try {
      const savedCourseIds = localStorage.getItem('lastStudentScheduleCourseIds');
      const savedData = localStorage.getItem('lastStudentSchedule');
      if (savedData) {
        setStudentData(JSON.parse(savedData));
        setLoading(false);
        return;
      }
      const params = savedCourseIds ? `?courseIds=${encodeURIComponent(savedCourseIds)}` : '';
      const res = await api.get(`/student-schedule/my-schedule${params}`);
      setStudentData(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (role === 'docente') loadTeacherSchedule();
    else if (role === 'estudiante') loadStudentSchedule();
    else loadGenerations();
  }, [role]);

  const generateStudentSchedule = async () => {
    setGeneratingStudent(true);
    try {
      const savedCourseIds = localStorage.getItem('lastStudentScheduleCourseIds');
      const courseIds = savedCourseIds ? JSON.parse(savedCourseIds) : undefined;
      const res = await api.post('/student-schedule/generate', courseIds ? { courseIds } : {});
      setStudentData(res.data);
      localStorage.setItem('lastStudentSchedule', JSON.stringify(res.data));
    } catch (e) {
      alert(e.response?.data?.message || 'Error al generar horario');
    }
    setGeneratingStudent(false);
  };

  // ───── SAVE AS SIMULATION ─────
  const getSemester = () => {
    if (teacherData?.semester) return teacherData.semester;
    if (studentData?.student?.currentSemester) return `2026-${studentData.student.currentSemester % 2 === 0 ? 2 : 1}`;
    return '2026-1';
  };

  const saveAsSimulation = async (assignments, stats, label = 'personalizado', navigateToSims = false) => {
    const simName = prompt('Nombre para esta simulación:', `Horario ${new Date().toLocaleDateString('es-PE')}`);
    if (!simName) return;
    setSavingSimulation(true);
    try {
      const simAssignments = assignments.map(a => ({
        courseId: a.courseId?._id || a.courseId,
        courseName: a.courseId?.name || 'Curso',
        courseCode: a.courseId?.code || '',
        teacherId: a.teacherId?._id || a.teacherId,
        teacherName: a.teacherId?.name || '',
        classroomId: a.classroomId?._id || a.classroomId,
        classroomCode: a.classroomId?.code || '',
        day: a.day,
        startTime: a.startTime,
        endTime: a.endTime
      }));
      await api.post('/simulations', {
        name: simName,
        label,
        semester: getSemester(),
        assignments: simAssignments,
        stats: stats || {}
      });
      if (navigateToSims) {
        navigate('/simulations');
      } else {
        alert('✓ Simulación guardada exitosamente.');
      }
    } catch (err) {
      alert(err.response?.data?.errors?.join('\n') || err.response?.data?.message || 'Error al guardar simulación');
    }
    setSavingSimulation(false);
  };

  // ───── HELPERS ─────
  const buildColorMap = (assignments) => {
    const courses = [...new Set(assignments.map(a => a.courseId?.name || a.courseId))];
    const map = {};
    courses.forEach((c, i) => { map[c] = CELL_COLORS[i % CELL_COLORS.length]; });
    return map;
  };

  const getAssignment = (assignments, day, slot) => {
    const start = slot.split(' - ')[0];
    return assignments.find(a => a.day === DAY_KEYS[day] && a.startTime === start);
  };

  const renderScheduleTable = (assignments) => {
    const colorMap = buildColorMap(assignments);
    const slotsToShow = TIME_SLOTS;

    return (
      <div className="schedule-grid-container" style={{ overflowX: 'auto' }}>
        <table className="schedule-table compact">
          <thead><tr><th className="time-col">Hora</th>{DAYS.slice(0, 5).map(d => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {slotsToShow.map(slot => (
              <tr key={slot}>
                <td className="time-cell">{slot}</td>
                {DAYS.slice(0, 5).map(day => {
                  const a = getAssignment(assignments, day, slot);
                  if (!a) return <td key={day} className="empty-cell"></td>;
                  const name = a.courseId?.name || 'Curso';
                  const c = colorMap[name] || CELL_COLORS[0];
                  return (
                    <td key={day}>
                      <div className="schedule-cell" style={{ background: c.bg, borderLeft: `3px solid ${c.border}`, color: c.text, padding: '4px 6px', borderRadius: 4, fontSize: 11 }}>
                        <strong>{name}</strong><br />
                        <span style={{ fontSize: 10 }}>{a.classroomId?.code || ''} · {a.teacherId?.name?.split(' ')[0] || ''}</span>
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
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  // ═══════════════════════════════════
  // TEACHER VIEW — Read-only assigned schedule
  // ═══════════════════════════════════
  if (role === 'docente') {
    return (
      <div className="myschedules-page animate-fadeIn">
        <div className="page-header">
          <h1>Mi Horario Asignado</h1>
          <p>Este es el horario que el sistema te ha asignado automáticamente según tus preferencias y disponibilidad.</p>
        </div>

        {teacherData?.assignments?.length > 0 ? (
          <>
            <div className="teacher-schedule-stats">
              <div className="ts-stat card">
                <span className="ts-val">{teacherData.stats?.totalCourses || 0}</span>
                <span className="ts-label">Cursos asignados</span>
              </div>
              <div className="ts-stat card">
                <span className="ts-val">{teacherData.stats?.totalSessions || 0}</span>
                <span className="ts-label">Sesiones/semana</span>
              </div>
              <div className="ts-stat card">
                <span className="ts-val">{teacherData.stats?.totalHours || 0}h</span>
                <span className="ts-label">Horas/semana</span>
              </div>
              <div className="ts-stat card">
                <span className="ts-val">{teacherData.stats?.daysUsed || 0}</span>
                <span className="ts-label">Días con clase</span>
              </div>
              <div className="ts-stat card">
                <div className="ts-load-bar">
                  <div className="ts-load-fill" style={{ width: `${teacherData.stats?.loadPercent || 0}%` }}></div>
                </div>
                <span className="ts-label">{teacherData.stats?.loadPercent || 0}% carga</span>
              </div>
            </div>
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header">
                <h3 className="card-title">Horario — {teacherData.semester}</h3>
                <span className="badge badge-success">Asignado</span>
              </div>
              {renderScheduleTable(teacherData.assignments)}
            </div>
          </>
        ) : (
          <div className="empty-state card">
            <HiOutlineCalendar style={{ fontSize: 48, color: 'var(--text-secondary)' }} />
            <h3>Sin horario asignado</h3>
            <p>{teacherData?.message || 'El coordinador aún no ha generado el horario institucional.'}</p>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════
  // STUDENT VIEW — Personalized schedule from institutional
  // ═══════════════════════════════════
  if (role === 'estudiante') {
    return (
      <div className="myschedules-page animate-fadeIn">
        <div className="page-header">
          <h1>Mi Horario</h1>
          <p>Horario personalizado según tus preferencias y el horario institucional.</p>
        </div>

        {!studentData?.schedule?.assignments?.length ? (
          <div className="empty-state card">
            <HiOutlineCalendar style={{ fontSize: 48, color: 'var(--text-secondary)' }} />
            <h3>Sin horario generado</h3>
            <p>Presiona el botón para generar tu horario personalizado basado en tus preferencias.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={generateStudentSchedule} disabled={generatingStudent}>
              <HiOutlineLightningBolt /> {generatingStudent ? 'Generando...' : 'Generar mi horario'}
            </button>
          </div>
        ) : (
          <>
            <div className="student-schedule-info">
              <div className="student-stats">
                <div className="ts-stat card">
                  <span className="ts-val">{studentData.stats?.totalCourses || 0}</span>
                  <span className="ts-label">Cursos</span>
                </div>
                <div className="ts-stat card">
                  <span className="ts-val">{studentData.stats?.totalCredits || 0}</span>
                  <span className="ts-label">Créditos</span>
                </div>
                <div className="ts-stat card">
                  <span className="ts-val">{studentData.stats?.totalSessions || 0}</span>
                  <span className="ts-label">Sesiones</span>
                </div>
                <div className="ts-stat card">
                  <span className="ts-val">{studentData.stats?.shiftMatchPercent || 0}%</span>
                  <span className="ts-label">Turno preferido</span>
                </div>
                <div className="ts-stat card">
                  <span className="ts-val">{studentData.stats?.uncoveredCourses || 0}</span>
                  <span className="ts-label">Sin cobertura</span>
                </div>
              </div>

              {studentData.observations?.length > 0 && (
                <div className="uncovered-notice card" style={{ borderLeft: '4px solid #FDD835', background: '#FFF8E1' }}>
                  <HiOutlineExclamationCircle style={{ color: '#F57F17', fontSize: 20 }} />
                  <div>
                    <strong>Observaciones ({studentData.observations.length}):</strong>
                    {studentData.observations.map((o, i) => (
                      <div key={i} style={{ fontSize: 12, marginTop: 2 }}>⚠ {o.courseCode} — {o.message}</div>
                    ))}
                  </div>
                </div>
              )}

              {studentData.uncoveredCourses?.length > 0 && (
                <div className="uncovered-notice card">
                  <HiOutlineExclamationCircle style={{ color: 'var(--warning)', fontSize: 20 }} />
                  <div>
                    <strong>{studentData.uncoveredCourses.length} curso(s) sin horario disponible:</strong>
                    <span>{studentData.uncoveredCourses.map(c => c.name).join(', ')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header">
                <h3 className="card-title">Mi Horario Sugerido — Sem {studentData.student?.currentSemester}</h3>
                <button className="btn btn-outline btn-sm" onClick={generateStudentSchedule} disabled={generatingStudent}>
                  {generatingStudent ? 'Regenerando...' : 'Regenerar'}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => saveAsSimulation(studentData.schedule.assignments, studentData.stats, 'ideal')} disabled={savingSimulation}>
                  <HiOutlineSaveAs /> {savingSimulation ? 'Guardando...' : 'Guardar simulación'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => saveAsSimulation(studentData.schedule.assignments, studentData.stats, 'ideal', true)} disabled={savingSimulation}>
                  Simular este horario
                </button>
              </div>
              {renderScheduleTable(studentData.schedule.assignments)}
            </div>

            {/* ── Schedule Alternatives ── */}
            {studentData.alternatives?.length > 0 && (
              <div className="card" style={{ marginTop: 16 }}>
                <h3 className="card-title">Alternativas de horario</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  El sistema generó opciones adicionales basadas en diferentes turnos y distribuciones.
                </p>
                {studentData.alternatives.map((alt, i) => (
                  <div key={i} style={{ marginBottom: 16, padding: 16, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <strong style={{ fontSize: 14 }}>{alt.label}</strong>
                        <span style={{ marginLeft: 10, fontSize: 12, padding: '2px 8px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontWeight: 600 }}>
                          Score: {alt.score}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                        <span><strong>{alt.stats.totalCourses}</strong> cursos</span>
                        <span><strong>{alt.stats.totalCredits}</strong> créd</span>
                        <span><strong>{alt.stats.shiftMatchPercent}%</strong> turno</span>
                      </div>
                    </div>
                    {renderScheduleTable(alt.assignments)}
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => saveAsSimulation(alt.assignments, alt.stats, alt.label)} disabled={savingSimulation}>
                        <HiOutlineSaveAs /> {savingSimulation ? 'Guardando...' : 'Guardar simulación'}
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => saveAsSimulation(alt.assignments, alt.stats, alt.label, true)} disabled={savingSimulation}>
                        Simular
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════
  // COORDINATOR VIEW — Sections grouped by semester
  // ═══════════════════════════════════
  const completed = generations.filter(g => g.status === 'completada');
  const failed = generations.filter(g => g.status === 'fallida');

  const loadSectionsForGen = async (gen) => {
    setSelectedGen(gen);
    setLoadingSections(true);
    setViewSemester(null);
    try {
      const careerId = gen.career?._id || gen.career;
      const sem = gen.semester || '2026-1';
      const res = await api.get('/sections', { params: { career: careerId, semester: sem } });
      setSectionData(res.data.sections || []);
    } catch (e) { console.error(e); setSectionData([]); }
    setLoadingSections(false);
  };

  const semesters = [...new Set(sectionData.map(s => s.courseSemester))].sort((a, b) => a - b);
  const filteredSections = viewSemester
    ? sectionData.filter(s => s.courseSemester === viewSemester)
    : sectionData;

  const sectionsToAssignments = (sections) => {
    const result = [];
    sections.forEach(sec => {
      (sec.scheduleSlots || []).forEach(slot => {
        result.push({
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          courseId: {
            _id: sec.courseId?._id,
            name: sec.courseId?.name || 'Curso',
            code: sec.courseId?.code || ''
          },
          classroomId: {
            _id: sec.classroomId?._id,
            code: sec.classroomId?.code || ''
          },
          teacherId: {
            _id: sec.teacherId?._id,
            name: sec.teacherId?.name || ''
          },
          sectionCode: sec.sectionCode
        });
      });
    });
    return result;
  };

  const renderSemesterTable = (sections) => {
    const assignments = sectionsToAssignments(sections);
    if (assignments.length === 0) return <p className="text-muted" style={{ textAlign: 'center', padding: 20 }}>Sin horarios para este semestre.</p>;
    const colorMap = buildColorMap(assignments);
    const usedSlots = TIME_SLOTS.filter(slot =>
      DAYS.some(day => getAssignment(assignments, day, slot))
    );
    const slotsToShow = usedSlots.length > 0 ? usedSlots : TIME_SLOTS.slice(0, 11);
    return (
      <div className="schedule-grid-container" style={{ overflowX: 'auto', marginTop: 4 }}>
        <table className="schedule-table compact">
          <thead><tr><th className="time-col">Hora</th>{DAYS.slice(0, 5).map(d => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {slotsToShow.map(slot => (
              <tr key={slot}>
                <td className="time-cell">{slot}</td>
                {DAYS.slice(0, 5).map(day => {
                  const a = getAssignment(assignments, day, slot);
                  if (!a) return <td key={day} className="empty-cell"></td>;
                  const name = a.courseId?.name || 'Curso';
                  const c = colorMap[name] || CELL_COLORS[0];
                  return (
                    <td key={day}>
                      <div className="schedule-cell" style={{ background: c.bg, borderLeft: `3px solid ${c.border}`, color: c.text, padding: '4px 6px', borderRadius: 4, fontSize: 11 }}>
                        <strong>{a.courseId?.code}-{a.sectionCode}</strong><br />
                        <span style={{ fontSize: 10 }}>{a.classroomId?.code || ''} · {a.teacherId?.name?.split(' ')[0] || ''}</span>
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
  };

  return (
    <div className="myschedules-page animate-fadeIn">
      <div className="page-header">
        <h1>Mis horarios</h1>
        <p>Consulta los horarios generados por carrera y semestre.</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'generados' ? 'active' : ''}`} onClick={() => setTab('generados')}>Generados ({completed.length})</button>
        <button className={`tab ${tab === 'fallidos' ? 'active' : ''}`} onClick={() => setTab('fallidos')}>Fallidos ({failed.length})</button>
      </div>

      {tab === 'generados' ? (
        <div className="schedules-list">
          {completed.length === 0 ? (
            <div className="empty-state"><HiOutlineCalendar /><h3>Sin horarios generados</h3><p>Genera horarios desde la página "Generar Horarios".</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/career-generation')}>Generar horarios</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                {completed.map(gen => (
                  <div key={gen._id}
                    className={`card ${selectedGen?._id === gen._id ? 'card-selected' : ''}`}
                    style={{ flex: '1 0 280px', padding: 16, cursor: 'pointer', border: selectedGen?._id === gen._id ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                    onClick={() => loadSectionsForGen(gen)}
                  >
                    <div className="schedule-card-header" style={{ marginBottom: 8 }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem' }}>{gen.name || gen.career?.name || 'Horario'}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                          {new Date(gen.createdAt).toLocaleString('es-PE')}
                        </p>
                      </div>
                      <span className={`badge badge-${gen.status === 'completada' ? 'success' : 'error'}`}>
                        {gen.qualityScore || 0}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>{gen.sectionsGenerated || 0} secciones</span>
                      <span>{gen.semester}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedGen && (
                <div className="card" style={{ padding: 16 }}>
                  <div className="sections-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>
                      {selectedGen.career?.name || 'Carrera'} — {selectedGen.name}
                    </h3>
                    <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                      Score: {selectedGen.qualityScore}/100
                    </span>
                  </div>

                  {loadingSections ? (
                    <div className="loading-container"><div className="spinner"></div></div>
                  ) : sectionData.length === 0 ? (
                    <p className="text-muted" style={{ textAlign: 'center', padding: 20 }}>No hay secciones disponibles.</p>
                  ) : (
                    <>
                      {/* Semester tabs */}
                      <div className="semester-tabs" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                        <button
                          className={`semester-tab ${!viewSemester ? 'active' : ''}`}
                          onClick={() => setViewSemester(null)}
                          style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border)', background: !viewSemester ? 'var(--primary)' : 'transparent', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, color: !viewSemester ? '#fff' : 'var(--text-secondary)' }}
                        >
                          Todos ({sectionData.length})
                        </button>
                        {semesters.map(s => (
                          <button key={s}
                            className={`semester-tab ${viewSemester === s ? 'active' : ''}`}
                            onClick={() => setViewSemester(s)}
                            style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border)', background: viewSemester === s ? 'var(--primary)' : 'transparent', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, color: viewSemester === s ? '#fff' : 'var(--text-secondary)' }}
                          >
                            Sem {s} ({sectionData.filter(sec => sec.courseSemester === s).length})
                          </button>
                        ))}
                      </div>

                      {/* Semester summary + Schedule table */}
                      <div className="semester-summary" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                        {filteredSections.map(sec => (
                          <div key={sec._id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 14, background: 'var(--bg-hover)', fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: (CELL_COLORS[[...new Set(sectionData.map(s => s.courseId?.name))].indexOf(sec.courseId?.name) % CELL_COLORS.length] || CELL_COLORS[0]).border }}></span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{sec.courseId?.code}-{sec.sectionCode}</span>
                            <span>{sec.teacherId?.name?.split(' ')[0]}</span>
                            <span>{sec.classroomId?.code}</span>
                          </div>
                        ))}
                      </div>
                      {renderSemesterTable(filteredSections)}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="schedules-list">
          {failed.length === 0 ? (
            <div className="empty-state"><h3>No hay generaciones fallidas</h3><p>Todas tus generaciones han sido exitosas.</p></div>
          ) : failed.map(gen => (
            <div key={gen._id} className="schedule-card card">
              <div className="schedule-card-header"><div><h3>{gen.name}</h3><p>Intento: {new Date(gen.createdAt).toLocaleString('es-PE')}</p></div></div>
              <span className="badge badge-error">Fallida</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
