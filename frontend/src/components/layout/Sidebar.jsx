import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineAdjustments,
  HiOutlineLockClosed,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineCube,
  HiOutlineLightningBolt,
  HiOutlineCog,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import './Sidebar.css';

// Base navigation for ALL roles
const baseNav = [
  { path: '/', icon: HiOutlineHome, label: 'Inicio' },
];

// Student-specific nav
const studentNav = [
  { path: '/enrollment', icon: HiOutlineBookOpen, label: 'Matrícula' },
  { path: '/section-enrollment', icon: HiOutlineCalendar, label: 'Armar horario' },
  { path: '/my-schedules', icon: HiOutlineClipboardList, label: 'Mi horario' },
  { path: '/preferences', icon: HiOutlineAdjustments, label: 'Preferencias' },
  { path: '/notifications', icon: HiOutlineBell, label: 'Notificaciones' },
  { path: '/help', icon: HiOutlineQuestionMarkCircle, label: 'Ayuda' },
];

// Teacher-specific nav (read-only schedule view + preferences for availability)
const docenteNav = [
  { path: '/teacher-profile', icon: HiOutlineUserGroup, label: 'Mi perfil docente' },
  { path: '/my-schedules', icon: HiOutlineClipboardList, label: 'Mi horario' },
  { path: '/preferences', icon: HiOutlineAdjustments, label: 'Preferencias' },
  { path: '/restrictions', icon: HiOutlineLockClosed, label: 'Restricciones' },
  { path: '/notifications', icon: HiOutlineBell, label: 'Notificaciones' },
  { path: '/help', icon: HiOutlineQuestionMarkCircle, label: 'Ayuda' },
];

// Coordinator gets everything
const coordinadorNav = [
  { path: '/planning', icon: HiOutlineCollection, label: 'Planificación' },
  { path: '/generate', icon: HiOutlineCalendar, label: 'Generar horario' },
  { path: '/my-schedules', icon: HiOutlineClipboardList, label: 'Mis horarios' },
  { path: '/preferences', icon: HiOutlineAdjustments, label: 'Preferencias' },
  { path: '/restrictions', icon: HiOutlineLockClosed, label: 'Restricciones' },
  { path: '/reports', icon: HiOutlineChartBar, label: 'Reportes' },
  { path: '/notifications', icon: HiOutlineBell, label: 'Notificaciones' },
  { path: '/help', icon: HiOutlineQuestionMarkCircle, label: 'Ayuda' },
];

const coordinadorExtra = [
  { type: 'divider', label: 'Administración' },
  { path: '/careers', icon: HiOutlineAcademicCap, label: 'Carreras' },
  { path: '/courses', icon: HiOutlineBookOpen, label: 'Asignaturas' },
  { path: '/teachers', icon: HiOutlineUserGroup, label: 'Docentes' },
  { path: '/students', icon: HiOutlineCube, label: 'Estudiantes' },
  { path: '/classrooms', icon: HiOutlineOfficeBuilding, label: 'Aulas' },
  { path: '/generation', icon: HiOutlineLightningBolt, label: 'Generaciones' },
  { path: '/career-generation', icon: HiOutlineCalendar, label: 'Generar x Carrera' },
  { path: '/policies', icon: HiOutlineShieldCheck, label: 'Políticas' },
  { path: '/student-preferences', icon: HiOutlineAcademicCap, label: 'Pref. Estudiantes' },
];

export default function Sidebar() {
  const { user, role } = useAuth();
  const location = useLocation();

  let navItems = [...baseNav];
  if (role === 'estudiante') {
    navItems.push(...studentNav);
  } else if (role === 'docente') {
    navItems.push(...docenteNav);
  } else {
    navItems.push(...coordinadorNav);
    navItems.push(...coordinadorExtra);
  }

  const roleLabels = {
    estudiante: 'Estudiante',
    docente: 'Docente',
    coordinador: 'Coordinador'
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <HiOutlineCalendar />
        </div>
        <span className="brand-name">UniScheduler</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.type === 'divider') {
            return (
              <div key={idx} className="sidebar-section-label">
                {item.label}
              </div>
            );
          }
          return (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <span className="sidebar-icon"><item.icon /></span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="sidebar-user-card">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'Usuario'}</span>
            <span className="sidebar-user-role">{roleLabels[role] || role}</span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
