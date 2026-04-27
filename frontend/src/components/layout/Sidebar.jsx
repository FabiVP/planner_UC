import { NavLink, useLocation } from 'react-router-dom';
import { 
  HiOutlineViewGrid, 
  HiOutlineCalendar, 
  HiOutlineBookOpen, 
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineLockClosed,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineAdjustments
} from 'react-icons/hi';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { path: '/generation', icon: HiOutlineClipboardList, label: 'Planificación' },
  { path: '/courses', icon: HiOutlineBookOpen, label: 'Asignaturas' },
  { 
    label: 'Recursos', icon: HiOutlineCube, submenu: [
      { path: '/teachers', label: 'Docentes' },
      { path: '/classrooms', label: 'Aulas' },
      { path: '/students', label: 'Estudiantes' },
    ]
  },
  { path: '/schedules', icon: HiOutlineLockClosed, label: 'Restricciones' },
  { path: '/generation', icon: HiOutlineLightningBolt, label: 'Generación' },
  { 
    label: 'Horarios', icon: HiOutlineClock, submenu: [
      { path: '/schedules', label: 'Ver horarios' },
    ]
  },
  { path: '/schedules', icon: HiOutlineChartBar, label: 'Reportes' },
  { path: '/schedules', icon: HiOutlineCog, label: 'Configuración' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <HiOutlineCalendar />
        </div>
        <div className="sidebar-brand-text">
          <span className="brand-name">SISTEMA</span>
          <span className="brand-sub">Generación Óptima<br/>de Horarios</span>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.submenu) {
            return (
              <div key={idx} className="sidebar-group">
                <div className="sidebar-group-label">
                  <span className="sidebar-icon"><item.icon /></span>
                  <span className="sidebar-label">{item.label}</span>
                </div>
                {item.submenu.map(sub => (
                  <NavLink
                    key={sub.path + sub.label}
                    to={sub.path}
                    className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`}
                  >
                    <span className="sidebar-label">{sub.label}</span>
                  </NavLink>
                ))}
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
        <div className="sidebar-footer-card">
          <div className="footer-illustration">
            <HiOutlineClock />
          </div>
          <p className="footer-text">Optimiza tiempos, recursos y espacios con inteligencia.</p>
        </div>
      </div>
    </aside>
  );
}

