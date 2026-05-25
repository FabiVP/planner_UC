import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import './Careers.css';

const emptyForm = { code: '', name: '', faculty: 'Ingeniería', totalSemesters: 10, totalCredits: 200, director: '', description: '' };

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => { loadCareers(); }, []);

  const loadCareers = async () => {
    try {
      const res = await api.get('/careers');
      setCareers(res.data.careers || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/careers/${editing._id}`, form);
      } else {
        await api.post('/careers', form);
      }
      setModal(false);
      setEditing(null);
      setForm({ ...emptyForm });
      loadCareers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (career) => {
    setEditing(career);
    setForm({
      code: career.code,
      name: career.name,
      faculty: career.faculty || '',
      totalSemesters: career.totalSemesters || 10,
      totalCredits: career.totalCredits || 200,
      director: career.director || '',
      description: career.description || ''
    });
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta carrera? Los cursos asociados quedarán sin carrera.')) return;
    try {
      await api.delete(`/careers/${id}`);
      loadCareers();
    } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <div className="animate-fadeIn careers-page">
      <div className="page-actions">
        <span className="results-count">{careers.length} carreras registradas</span>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ ...emptyForm }); setModal(true); }}>
          <HiOutlinePlus /> Nueva Carrera
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Facultad</th>
                <th>Semestres</th>
                <th>Créditos</th>
                <th>Director</th>
                <th>Cursos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {careers.map(c => (
                <tr key={c._id}>
                  <td><span className="code-badge">{c.code}</span></td>
                  <td className="td-name">{c.name}</td>
                  <td className="career-table-faculty">{c.faculty || '-'}</td>
                  <td>{c.totalSemesters}</td>
                  <td>{c.totalCredits}</td>
                  <td className="career-director">{c.director || '-'}</td>
                  <td><span className="badge badge-info">{c.courseCount ?? 0}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {careers.length === 0 && (
                <tr><td colSpan="8" className="empty-state">No hay carreras registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Carrera' : 'Nueva Carrera'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="career-form-grid">
            <div className="form-group">
              <label>Código</label>
              <input className="form-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required placeholder="ISI" />
            </div>
            <div className="form-group">
              <label>Facultad</label>
              <input className="form-input" value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })} placeholder="Ingeniería" />
            </div>
            <div className="form-group full-width">
              <label>Nombre</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ingeniería de Sistemas" />
            </div>
            <div className="form-group">
              <label>Total Semestres</label>
              <input type="number" className="form-input" value={form.totalSemesters} onChange={e => setForm({ ...form, totalSemesters: +e.target.value })} min="6" max="14" />
            </div>
            <div className="form-group">
              <label>Total Créditos</label>
              <input type="number" className="form-input" value={form.totalCredits} onChange={e => setForm({ ...form, totalCredits: +e.target.value })} min="100" max="350" />
            </div>
            <div className="form-group full-width">
              <label>Director</label>
              <input className="form-input" value={form.director} onChange={e => setForm({ ...form, director: e.target.value })} placeholder="Dr. Nombre Apellido" />
            </div>
            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea className="form-input" rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Breve descripción de la carrera" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            {editing ? 'Actualizar' : 'Crear Carrera'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
