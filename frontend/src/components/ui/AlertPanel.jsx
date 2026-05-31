import { HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi';
import './AlertPanel.css';

const iconMap = {
  success: HiOutlineCheckCircle,
  warning: HiOutlineExclamationCircle,
  error: HiOutlineExclamationCircle,
  info: HiOutlineInformationCircle,
};

export default function AlertPanel({ alerts = [] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="alert-panel">
      <div className="alert-panel-header">
        <h3>Alertas</h3>
        <span className="alert-view-all">{alerts.length} alerta(s)</span>
      </div>
      <div className="alert-list">
        {alerts.map((alert, i) => {
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
