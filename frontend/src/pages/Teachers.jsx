import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import './Teachers.css';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', maxCourses: 3 });

  useEffect(() => { loadTeachers(); }, []);
  const loadTeachers = async () => { try { const r = await api.get('/teachers'); setTeachers(r.data.teachers || []); } catch(e){} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/teachers/${editing._id}`, form); }
      else { await api.post('/teachers', form); }
      setModal(false); setEditing(null); loadTeachers();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (t) => { setEditing(t); setForm({ name: t.name, email: t.email, maxCourses: t.maxCourses }); setModal(true); };
  const handleDelete = async (id) => { if(!confirm('¿Eliminar?')) return; await api.delete(`/teachers/${id}`); loadTeachers(); };

  return (
    <>
      <Header title="Docentes" subtitle="Gestión de profesores" />
      <div className="page-content">
        <div className="page-actions">
          <span className="results-count">{teachers.length} docentes registrados</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', email: '', maxCourses: 3 }); setModal(true); }}><HiOutlinePlus /> Nuevo Docente</button>
        </div>
        <div className="card"><div className="table-wrapper"><table><thead><tr><th>Nombre</th><th>Email</th><th>Máx. Cursos</th><th>Especialidades</th><th>Acciones</th></tr></thead><tbody>
          {teachers.map(t => (
            <tr key={t._id}>
              <td className="td-name">{t.name}</td><td>{t.email}</td><td>{t.maxCourses}</td>
              <td>{t.specializations?.map(s => s.name || s.code).join(', ') || '-'}</td>
              <td><div className="action-btns"><button className="btn btn-outline btn-sm" onClick={() => handleEdit(t)}><HiOutlinePencil /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}><HiOutlineTrash /></button></div></td>
            </tr>
          ))}
          {teachers.length === 0 && <tr><td colSpan="5" className="empty-state">No hay docentes</td></tr>}
        </tbody></table></div></div>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Docente' : 'Nuevo Docente'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group"><label>Nombre</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group"><label>Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>Máx. Cursos por semestre</label><input type="number" className="form-input" value={form.maxCourses} onChange={e => setForm({...form, maxCourses: +e.target.value})} min="1" max="6" /></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',marginTop:8}}>{editing ? 'Actualizar' : 'Crear'}</button>
        </form>
      </Modal>
    </>
  );
}
