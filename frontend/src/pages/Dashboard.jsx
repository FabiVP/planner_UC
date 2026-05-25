import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  HiOutlineCalendar, HiOutlineAcademicCap, HiOutlineUserGroup,
  HiOutlineOfficeBuilding, HiOutlineLightningBolt, HiOutlineArrowRight,
  HiOutlineBriefcase, HiOutlineClock, HiOutlineBookOpen,
  HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineShieldCheck
} from 'react-icons/hi';
import './Dashboard.css';

export default function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [latestGen, setLatestGen] = useState(null);

  // Teacher-specific
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [teacherSchedule, setTeacherSchedule] = useState(null);

  // Student-specific
  const [studentProgress, setStudentProgress] = useState(null);

  // Admin-specific
  const [adminOverview, setAdminOverview] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data?.stats || r.data)).catch(() => {});
    api.get('/notifications').then(r => setNotifications((r.data.notifications || []).slice(0, 4))).catch(() => {});
    api.get('/generations').then(r => {
      const g = (r.data.generations || []).find(g => g.status === 'completada');
      if (g) setLatestGen(g);
    }).catch(() => {});

    // Role-specific data
    if (role === 'docente') {
      api.get('/teachers/my-profile').then(r => setTeacherProfile(r.data)).catch(() => {});
      api.get('/schedule/my-teaching').then(r => setTeacherSchedule(r.data)).catch(() => {});
    }
    if (role === 'estudiante') {
      api.get('/student-schedule/eligible-courses').then(r => setStudentProgress(r.data)).catch(() => {});
    }
    if (role === 'coordinador') {
      api.get('/teachers/admin/overview').then(r => setAdminOverview(r.data)).catch(() => {});
    }
  }, [role]);

  const roleLabels = { estudiante: 'Estudiante', docente: 'Docente', coordinador: 'Coordinador' };

  const getCourseCount = () => stats?.courses?.active || stats?.courses?.total || stats?.totalCourses || 0;
  const getTeacherCount = () => stats?.teachers?.total || stats?.totalTeachers || 0;
  const getClassroomCount = () => stats?.classrooms?.available || stats?.classrooms?.total || stats?.totalClassrooms || 0;
  const getGenCount = () => stats?.generations?.total || stats?.totalGenerations || 0;
  const getTCCount = () => stats?.teachers?.fullTime || 0;
  const getPHCount = () => stats?.teachers?.partTime || 0;

  const statCards = [
    { label: 'Asignaturas', value: getCourseCount(), icon: HiOutlineAcademicCap, color: 'var(--primary)' },
    { label: 'Docentes', value: getTeacherCount(), icon: HiOutlineUserGroup, color: 'var(--success)' },
    { label: 'Aulas', value: getClassroomCount(), icon: HiOutlineOfficeBuilding, color: 'var(--warning)' },
    { label: 'Generaciones', value: getGenCount(), icon: HiOutlineLightningBolt, color: 'var(--info)' },
  ];

  return (
    <div className="dashboard-page animate-fadeIn">
      <div className="dash-welcome">
        <div>
          <h1>¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}!</h1>
          <p>Bienvenido a UniScheduler · {roleLabels[role] || role}</p>
        </div>
        {role === 'coordinador' && (
          <button className="btn btn-primary" onClick={() => navigate('/generate')}>
            <HiOutlineCalendar /> Generar horario
          </button>
        )}
        {role === 'estudiante' && (
          <button className="btn btn-primary" onClick={() => navigate('/enrollment')}>
            <HiOutlineAcademicCap /> Matrícula
          </button>
        )}
        {role === 'docente' && (
          <button className="btn btn-primary" onClick={() => navigate('/teacher-profile')}>
            <HiOutlineBriefcase /> Mi perfil docente
          </button>
        )}
      </div>

      {/* ═══ TEACHER-SPECIFIC DASHBOARD ═══ */}
      {role === 'docente' && teacherProfile && (
        <div className="dash-teacher-section">
          <div className="dash-stats" style={{ marginBottom: 16 }}>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: teacherProfile.summary?.contractLabel === 'Tiempo Completo' ? 'var(--success)' : 'var(--warning)' }}>
                <HiOutlineBriefcase />
              </div>
              <div>
                <span className="dash-stat-value">{teacherProfile.summary?.contractLabel || '—'}</span>
                <span className="dash-stat-label">Contrato</span>
              </div>
            </div>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: 'var(--primary)' }}>
                <HiOutlineClock />
              </div>
              <div>
                <span className="dash-stat-value">{teacherProfile.summary?.maxWeeklyHours || 0}h</span>
                <span className="dash-stat-label">Máx. hrs/semana</span>
              </div>
            </div>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: 'var(--info)' }}>
                <HiOutlineAcademicCap />
              </div>
              <div>
                <span className="dash-stat-value">{teacherProfile.summary?.totalSpecializations || 0}</span>
                <span className="dash-stat-label">Especialidades</span>
              </div>
            </div>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: '#7c3aed' }}>
                <HiOutlineCalendar />
              </div>
              <div>
                <span className="dash-stat-value">{teacherSchedule?.stats?.totalCourses || 0}</span>
                <span className="dash-stat-label">Cursos asignados</span>
              </div>
            </div>
          </div>

          {/* Teaching load */}
          {teacherSchedule?.stats && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <h3 className="card-title">Mi carga docente actual</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my-schedules')}>Ver horario <HiOutlineArrowRight /></button>
              </div>
              <div className="workload-grid">
                <div className="workload-item tc">
                  <div className="workload-bar-track">
                    <div className="workload-bar-fill tc"
                      style={{ width: `${teacherSchedule.stats.loadPercent || 0}%` }}></div>
                  </div>
                  <div className="workload-info">
                    <span className="workload-count">{teacherSchedule.stats.totalHours || 0}h</span>
                    <span className="workload-label">de {teacherProfile.summary?.maxWeeklyHours || 40}h semanales</span>
                    <span className="workload-hours">{teacherSchedule.stats.loadPercent || 0}% de carga</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending config notices */}
          {teacherProfile.summary && (
            <>
              {teacherProfile.summary.totalSpecializations === 0 && (
                <div className="card" style={{ padding: '14px 20px', marginBottom: 12, borderLeft: '4px solid var(--warning)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HiOutlineExclamationCircle style={{ color: 'var(--warning)', fontSize: 20 }} />
                    <div>
                      <strong>Sin especialidades configuradas</strong>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                        Configura tus cursos de especialidad para que el sistema pueda asignarte correctamente.
                      </p>
                    </div>
                    <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/teacher-profile')}>
                      Configurar →
                    </button>
                  </div>
                </div>
              )}
              {teacherProfile.summary.availableDays === 0 && teacherProfile.summary.freeDaysCount === 0 && (
                <div className="card" style={{ padding: '14px 20px', marginBottom: 12, borderLeft: '4px solid var(--warning)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HiOutlineExclamationCircle style={{ color: 'var(--warning)', fontSize: 20 }} />
                    <div>
                      <strong>Sin disponibilidad configurada</strong>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                        Define tu disponibilidad horaria para que el coordinador pueda generar tu horario.
                      </p>
                    </div>
                    <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/teacher-profile')}>
                      Configurar →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ STUDENT-SPECIFIC DASHBOARD ═══ */}
      {role === 'estudiante' && studentProgress && (
        <div className="dash-student-section">
          <div className="dash-stats" style={{ marginBottom: 16 }}>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: 'var(--primary)' }}>
                <HiOutlineCheckCircle />
              </div>
              <div>
                <span className="dash-stat-value">{studentProgress.academicProgress?.progressPercent || 0}%</span>
                <span className="dash-stat-label">Avance académico</span>
              </div>
            </div>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: 'var(--success)' }}>
                <HiOutlineBookOpen />
              </div>
              <div>
                <span className="dash-stat-value">{studentProgress.academicProgress?.coursesApproved || 0}</span>
                <span className="dash-stat-label">Cursos aprobados</span>
              </div>
            </div>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: studentProgress.academicProgress?.coursesFailed > 0 ? '#dc2626' : 'var(--info)' }}>
                <HiOutlineExclamationCircle />
              </div>
              <div>
                <span className="dash-stat-value" style={{ color: studentProgress.academicProgress?.coursesFailed > 0 ? '#dc2626' : undefined }}>
                  {studentProgress.academicProgress?.coursesFailed || 0}
                </span>
                <span className="dash-stat-label">Desaprobados</span>
              </div>
            </div>
            <div className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: '#7c3aed' }}>
                <HiOutlineAcademicCap />
              </div>
              <div>
                <span className="dash-stat-value">{studentProgress.academicProgress?.totalCreditsApproved || 0}</span>
                <span className="dash-stat-label">Créditos aprobados</span>
              </div>
            </div>
          </div>

          {/* Enrollment summary */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <h3 className="card-title">Resumen de matrícula</h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/enrollment')}>
                <HiOutlineBookOpen /> Ir a matrícula <HiOutlineArrowRight />
              </button>
            </div>
            <div className="dash-enrollment-summary">
              {studentProgress.summary?.failedToRetake > 0 && (
                <div className="dash-enroll-item alert">
                  <HiOutlineExclamationCircle />
                  <span><strong>{studentProgress.summary.failedToRetake}</strong> curso(s) desaprobado(s) por repetir</span>
                </div>
              )}
              <div className="dash-enroll-item">
                <HiOutlineBookOpen />
                <span><strong>{studentProgress.summary?.currentSemester || 0}</strong> curso(s) del semestre actual disponibles</span>
              </div>
              {studentProgress.summary?.previousPending > 0 && (
                <div className="dash-enroll-item warning">
                  <HiOutlineClock />
                  <span><strong>{studentProgress.summary.previousPending}</strong> curso(s) pendientes de semestres anteriores</span>
                </div>
              )}
              <div className="dash-enroll-item info">
                <HiOutlineShieldCheck />
                <span><strong>{studentProgress.summary?.totalAvailable || 0}</strong> cursos disponibles para matricular</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ COORDINATOR STATS ═══ */}
      {role === 'coordinador' && (
        <div className="dash-stats">
          {statCards.map(s => (
            <div key={s.label} className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ background: s.color }}>
                <s.icon />
              </div>
              <div>
                <span className="dash-stat-value">{s.value}</span>
                <span className="dash-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin teacher overview */}
      {role === 'coordinador' && adminOverview && (
        <div className="dash-workload card">
          <div className="card-header">
            <h3 className="card-title">Resumen Docente — Preparación para horarios</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/teachers')}>Ver docentes <HiOutlineArrowRight /></button>
          </div>
          <div className="workload-grid">
            <div className="workload-item tc">
              <div className="workload-bar-track">
                <div className="workload-bar-fill tc"
                  style={{ width: `${adminOverview.metrics?.total > 0 ? (adminOverview.metrics.fullTime / adminOverview.metrics.total) * 100 : 0}%` }}></div>
              </div>
              <div className="workload-info">
                <span className="workload-count">{adminOverview.metrics?.fullTime || 0}</span>
                <span className="workload-label">Tiempo Completo</span>
                <span className="workload-hours">≤ 40h/sem</span>
              </div>
            </div>
            <div className="workload-item ph">
              <div className="workload-bar-track">
                <div className="workload-bar-fill ph"
                  style={{ width: `${adminOverview.metrics?.total > 0 ? (adminOverview.metrics.partTime / adminOverview.metrics.total) * 100 : 0}%` }}></div>
              </div>
              <div className="workload-info">
                <span className="workload-count">{adminOverview.metrics?.partTime || 0}</span>
                <span className="workload-label">Por Horas</span>
                <span className="workload-hours">≤ 20h/sem</span>
              </div>
            </div>
            <div className="workload-summary">
              <span className="workload-total">
                {adminOverview.metrics?.total || 0} docentes · Cobertura: {adminOverview.metrics?.coveragePercent || 0}% de cursos
              </span>
              <span className="workload-capacity">
                Capacidad: ~{adminOverview.metrics?.totalCapacityHours || 0}h semanales
              </span>
            </div>
          </div>
          {/* Warnings */}
          {adminOverview.warnings?.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {adminOverview.warnings.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--warning)', padding: '6px 12px', background: 'rgba(245,158,11,0.06)', borderRadius: 8 }}>
                  <HiOutlineExclamationCircle /> {w}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Horario generado</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my-schedules')}>Ver todos <HiOutlineArrowRight /></button>
          </div>
          {latestGen ? (
            <div className="dash-gen-info">
              <div className="dash-gen-score">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--primary)" strokeWidth="6"
                    strokeDasharray="201" strokeDashoffset={201 - (201 * (latestGen.qualityScore || 0) / 100)}
                    strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                </svg>
                <span className="dash-gen-score-val">{latestGen.qualityScore}</span>
              </div>
              <div className="dash-gen-details">
                <p><strong>{latestGen.name}</strong></p>
                <p className="text-sm text-muted">{new Date(latestGen.createdAt).toLocaleDateString('es-PE')}</p>
                <span className="badge badge-success">Válido</span>
              </div>
            </div>
          ) : (
            <p className="text-muted">No hay horarios generados aún.</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Notificaciones recientes</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')}>Ver todas <HiOutlineArrowRight /></button>
          </div>
          <div className="dash-notif-list">
            {notifications.length === 0 ? <p className="text-muted">Sin notificaciones.</p> :
              notifications.map(n => (
                <div key={n._id} className={`dash-notif-item ${!n.read ? 'unread' : ''}`}>
                  <div className={`dash-notif-dot ${n.type === 'conflicto' ? 'warning' : n.type === 'horario' ? 'info' : 'success'}`}></div>
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
