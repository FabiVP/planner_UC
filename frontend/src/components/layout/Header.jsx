import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineBell, HiOutlineLogout, HiOutlineSearch } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get('/notifications?read=false')
      .then(res => setUnreadCount(res.data.unreadCount || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-search">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Buscar..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <button
          className="header-icon-btn"
          onClick={() => navigate('/notifications')}
          title="Notificaciones"
        >
          <HiOutlineBell />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        <div className="header-divider" />

        <button className="header-icon-btn" onClick={handleLogout} title="Cerrar sesión">
          <HiOutlineLogout />
        </button>
      </div>
    </header>
  );
}
