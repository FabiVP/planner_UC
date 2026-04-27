import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import './Students.css';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', studentCode: '', currentSemester: 1, career: 'Ingeniería de Sistemas' });

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await api.get('/students'); setStudents(r.data.students || []); } catch(e){} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/students/${editing._id}`, form); }
      else { await api.post('/students', form); }
      setModal(false); setEditing(null); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (s) => { setEditing(s); setForm({ name: s.name, email: s.email, studentCode: s.studentCode, currentSemester: s.currentSemester, career: s.career }); setModal(true); };
  const handleDelete = async (id) => { if(!confirm('¿Eliminar?')) return; await api.delete(`/students/${id}`); load(); };

  return (
    <>
      <Header title="Estudiantes" subtitle="Gestión de alumnos matriculados" />
      <div className="page-content">
        <div className="page-actions">
          <span className="results-count">{students.length} estudiantes registrados</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', email: '', studentCode: '', currentSemester: 1, career: 'Ingeniería de Sistemas' }); setModal(true); }}><HiOutlinePlus /> Nuevo Estudiante</button>
        </div>
        <div className="card"><div className="table-wrapper"><table><thead><tr><th>Código</th><th>Nombre</th><th>Email</th><th>Semestre</th><th>Carrera</th><th>Acciones</th></tr></thead><tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td><span className="code-badge">{s.studentCode}</span></td>
              <td className="td-name">{s.name}</td><td>{s.email}</td><td>{s.currentSemester}</td><td>{s.career}</td>
              <td><div className="action-btns"><button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}><HiOutlinePencil /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}><HiOutlineTrash /></button></div></td>
            </tr>
          ))}
          {students.length === 0 && <tr><td colSpan="6" className="empty-state">No hay estudiantes</td></tr>}
        </tbody></table></div></div>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Estudiante' : 'Nuevo Estudiante'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group"><label>Código</label><input className="form-input" value={form.studentCode} onChange={e => setForm({...form, studentCode: e.target.value})} required /></div>
            <div className="form-group"><label>Nombre</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label>Semestre</label><input type="number" className="form-input" value={form.currentSemester} onChange={e => setForm({...form, currentSemester: +e.target.value})} min="1" max="10" /></div>
          </div>
          <div className="form-group"><label>Carrera</label><input className="form-input" value={form.career} onChange={e => setForm({...form, career: e.target.value})} /></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',marginTop:8}}>{editing ? 'Actualizar' : 'Crear'}</button>
        </form>
      </Modal>
    </>
  );
}
