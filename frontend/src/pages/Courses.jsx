import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import './Courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', credits: 4, type: 'teorico', semester: 1, sessionsPerWeek: 2, hoursPerSession: 1 });

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/courses/${editing._id}`, form);
      } else {
        await api.post('/courses', form);
      }
      setModal(false);
      setEditing(null);
      setForm({ code: '', name: '', credits: 4, type: 'teorico', semester: 1, sessionsPerWeek: 2, hoursPerSession: 1 });
      loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (course) => {
    setEditing(course);
    setForm({ code: course.code, name: course.name, credits: course.credits, type: course.type, semester: course.semester, sessionsPerWeek: course.sessionsPerWeek, hoursPerSession: course.hoursPerSession });
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try {
      await api.delete(`/courses/${id}`);
      loadCourses();
    } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <>
      <Header title="Asignaturas" subtitle="Gestión de cursos académicos" />
      <div className="page-content">
        <div className="page-actions">
          <span className="results-count">{courses.length} asignaturas registradas</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ code: '', name: '', credits: 4, type: 'teorico', semester: 1, sessionsPerWeek: 2, hoursPerSession: 1 }); setModal(true); }}>
            <HiOutlinePlus /> Nuevo Curso
          </button>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Créditos</th>
                  <th>Tipo</th>
                  <th>Semestre</th>
                  <th>Sesiones/sem</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id}>
                    <td><span className="code-badge">{c.code}</span></td>
                    <td className="td-name">{c.name}</td>
                    <td>{c.credits}</td>
                    <td><span className={`badge badge-${c.type === 'laboratorio' ? 'info' : 'success'}`}>{c.type}</span></td>
                    <td>{c.semester}</td>
                    <td>{c.sessionsPerWeek}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr><td colSpan="7" className="empty-state">No hay cursos registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Curso' : 'Nuevo Curso'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group"><label>Código</label><input className="form-input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
            <div className="form-group"><label>Nombre</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Créditos</label><input type="number" className="form-input" value={form.credits} onChange={e => setForm({...form, credits: +e.target.value})} min="1" max="6" required /></div>
            <div className="form-group"><label>Tipo</label><select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="teorico">Teórico</option><option value="laboratorio">Laboratorio</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Semestre</label><input type="number" className="form-input" value={form.semester} onChange={e => setForm({...form, semester: +e.target.value})} min="1" max="10" required /></div>
            <div className="form-group"><label>Sesiones/semana</label><input type="number" className="form-input" value={form.sessionsPerWeek} onChange={e => setForm({...form, sessionsPerWeek: +e.target.value})} min="1" max="5" required /></div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',marginTop:8}}>{editing ? 'Actualizar' : 'Crear Curso'}</button>
        </form>
      </Modal>
    </>
  );
}
