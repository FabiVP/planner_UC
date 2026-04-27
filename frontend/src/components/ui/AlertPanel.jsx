import { HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi';
import './AlertPanel.css';

const iconMap = {
  success: HiOutlineCheckCircle,
  warning: HiOutlineExclamationCircle,
  error: HiOutlineExclamationCircle,
  info: HiOutlineInformationCircle,
};

export default function AlertPanel({ alerts = [] }) {
  const defaultAlerts = alerts.length > 0 ? alerts : [
    { type: 'error', message: '3 docentes tienen conflictos de disponibilidad' },
    { type: 'warning', message: '2 aulas no disponibles en el rango de horarios' },
    { type: 'info', message: '5 asignaturas sin preferencias de horario' },
    { type: 'success', message: 'Generación completada exitosamente' },
  ];

  return (
    <div className="alert-panel">
      <div className="alert-panel-header">
        <h3>Alertas</h3>
        <a href="#" className="alert-view-all">Ver todas →</a>
      </div>
      <div className="alert-list">
        {defaultAlerts.map((alert, i) => {
          const Icon = iconMap[alert.type] || HiOutlineInformationCircle;
          return (
            <div key={i} className={`alert-item alert-${alert.type}`}>
              <span className="alert-icon"><Icon /></span>
              <p className="alert-message">{alert.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
