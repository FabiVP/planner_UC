import { useState, useEffect } from 'react';
import api from '../api/axios';
import { HiOutlineBell, HiOutlineCalendar, HiOutlineExclamation, HiOutlineInformationCircle, HiOutlineCheck } from 'react-icons/hi';
import './Notifications.css';

export default function Notifications() {
  const [tab, setTab] = useState('todas');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    try {
      const params = tab !== 'todas' ? `?category=${tab === 'avisos' ? 'aviso' : 'alerta'}` : '';
      const res = await api.get(`/notifications${params}`);
      setNotifications(res.data.notifications || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
  };

  const getIcon = (type) => {
    switch(type) {
      case 'horario': return <HiOutlineCalendar className="notif-icon notif-icon-info" />;
      case 'conflicto': return <HiOutlineExclamation className="notif-icon notif-icon-warning" />;
      case 'cupo': return <HiOutlineInformationCircle className="notif-icon notif-icon-success" />;
      default: return <HiOutlineBell className="notif-icon notif-icon-default" />;
    }
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    return `Hace ${Math.floor(diff / 86400)} días`;
  };

  return (
    <div className="notifications-page animate-fadeIn">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Notificaciones</h1>
          <p>Mantente informado sobre tu horario y cambios.</p>
        </div>
        <button className="btn btn-ghost" onClick={markAllRead}>
          <HiOutlineCheck /> Marcar todas como leídas
        </button>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'todas' ? 'active' : ''}`} onClick={() => setTab('todas')}>Todas</button>
        <button className={`tab ${tab === 'avisos' ? 'active' : ''}`} onClick={() => setTab('avisos')}>Avisos</button>
        <button className={`tab ${tab === 'alertas' ? 'active' : ''}`} onClick={() => setTab('alertas')}>Alertas</button>
      </div>

      {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="empty-state"><HiOutlineBell /><h3>Sin notificaciones</h3><p>No tienes notificaciones por el momento.</p></div>
          ) : notifications.map(n => (
            <div key={n._id} className={`notif-item card ${!n.read ? 'unread' : ''}`} onClick={() => markAsRead(n._id)}>
              {getIcon(n.type)}
              <div className="notif-content">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
              </div>
              <span className="notif-time">{timeAgo(n.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
