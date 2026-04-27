import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineBell, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import './Header.css';

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn">
          <HiOutlineMenu />
        </button>
        <div className="header-title-area">
          <h1 className="header-title">{title || 'Dashboard'}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" title="Notificaciones">
          <HiOutlineBell />
          <span className="notification-badge">3</span>
        </button>
        <button className="header-icon-btn" title="Ayuda">
          <HiOutlineQuestionMarkCircle />
        </button>
        
        <div className="header-user">
          <div className="header-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.name || 'Administrador'}</span>
            <button className="header-logout" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    </header>
  );
}
