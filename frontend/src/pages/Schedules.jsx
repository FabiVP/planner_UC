import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import './Schedules.css';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const r = await api.get('/schedule');
      setSchedules(r.data.schedules || []);
      if (r.data.schedules?.length > 0) setSelected(r.data.schedules[0]);
    } catch(e) {}
  };

  return (
    <>
      <Header title="Horarios Generados" subtitle="Visualización de horarios académicos" />
      <div className="page-content">
        {schedules.length > 0 && (
          <div className="schedule-selector">
            <label>Seleccionar generación:</label>
            <select className="form-select" onChange={e => setSelected(schedules.find(s => s._id === e.target.value))} value={selected?._id}>
              {schedules.map(s => (
                <option key={s._id} value={s._id}>
                  {s.generationId?.name || s.semester} — {s.totalAssignments} asignaciones
                </option>
              ))}
            </select>
          </div>
        )}

        {selected ? (
          <div className="card">
            <div className="schedule-info-bar">
              <span>Semestre: <strong>{selected.semester}</strong></span>
              <span>Asignaciones: <strong>{selected.totalAssignments}</strong></span>
              {selected.generationId?.qualityScore && (
                <span>Calidad: <strong className="quality-badge">{selected.generationId.qualityScore}%</strong></span>
              )}
            </div>
            <ScheduleGrid
              assignments={selected.assignments || []}
              onCellClick={cell => setSelectedCell(cell)}
            />
          </div>
        ) : (
          <div className="card empty-state">
            <h3>No hay horarios generados</h3>
            <p>Ve a la sección de Generación para crear un nuevo horario.</p>
            <button className="btn btn-primary" style={{marginTop:16}} onClick={() => window.location.href = '/generation'}>
              Ir a Generación
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedCell} onClose={() => setSelectedCell(null)} title="Detalle de Asignación">
        {selectedCell && (
          <div className="cell-detail-modal">
            <div className="detail-row"><span className="detail-label">Curso:</span><span className="detail-value">{selectedCell.courseName || selectedCell.courseId?.name}</span></div>
            <div className="detail-row"><span className="detail-label">Docente:</span><span className="detail-value">{selectedCell.teacherName || selectedCell.teacherId?.name}</span></div>
            <div className="detail-row"><span className="detail-label">Aula:</span><span className="detail-value">{selectedCell.classroomName || selectedCell.classroomId?.name}</span></div>
            <div className="detail-row"><span className="detail-label">Día:</span><span className="detail-value">{selectedCell.day}</span></div>
            <div className="detail-row"><span className="detail-label">Hora:</span><span className="detail-value">{selectedCell.startTime} - {selectedCell.endTime}</span></div>
          </div>
        )}
      </Modal>
    </>
  );
}
