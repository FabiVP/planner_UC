import './Modal.css';
import { HiOutlineX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, width }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fadeIn" style={{ maxWidth: width || '560px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}><HiOutlineX /></button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
