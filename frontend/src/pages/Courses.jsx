import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import './Courses.css';

const emptyForm = { code: '', name: '', credits: 4, type: 'teorico', semester: 1, sessionsPerWeek: 2, hoursPerSession: 1, career: '' };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [filterCareer, setFilterCareer] = useState('all');

  useEffect(() => { loadCourses(); loadCareers(); }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadCareers = async () => {
    try {
      const res = await api.get('/careers');
      setCareers(res.data.careers || []);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.career) delete payload.career;
      if (editing) {
        await api.put(`/courses/${editing._id}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      setModal(false);
      setEditing(null);
      setForm({ ...emptyForm });
      loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (course) => {
    setEditing(course);
    setForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      type: course.type,
      semester: course.semester,
      sessionsPerWeek: course.sessionsPerWeek,
      hoursPerSession: course.hoursPerSession,
      career: course.career?._id || course.career || ''
    });
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try {
      await api.delete(`/courses/${id}`);
      loadCourses();
    } catch (err) { alert('Error al eliminar'); }
  };

  const getCareerName = (course) => {
    if (!course.career) return '-';
    if (typeof course.career === 'object') return course.career.name || course.career.code || '-';
    const found = careers.find(c => c._id === course.career);
    return found ? found.name : '-';
  };

  const filteredCourses = filterCareer === 'all'
    ? courses
    : courses.filter(c => {
        const cId = c.career?._id || c.career;
        return cId === filterCareer;
      });

  return (
    <div className="animate-fadeIn">
        <div className="page-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="results-count">{filteredCourses.length} asignaturas</span>
            {careers.length > 0 && (
              <select className="form-select" value={filterCareer} onChange={e => setFilterCareer(e.target.value)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', width: 'auto', minWidth: '180px' }}>
                <option value="all">Todas las carreras</option>
                {careers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ ...emptyForm }); setModal(true); }}>
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
                  <th>Carrera</th>
                  <th>Créditos</th>
                  <th>Tipo</th>
                  <th>Semestre</th>
                  <th>Sesiones/sem</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(c => (
                  <tr key={c._id}>
                    <td><span className="code-badge">{c.code}</span></td>
                    <td className="td-name">{c.name}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{getCareerName(c)}</td>
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
                {filteredCourses.length === 0 && (
                  <tr><td colSpan="8" className="empty-state">No hay cursos registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Curso' : 'Nuevo Curso'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group"><label>Código</label><input className="form-input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
            <div className="form-group"><label>Nombre</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          </div>
          <div className="form-group">
            <label>Carrera</label>
            <select className="form-select" value={form.career} onChange={e => setForm({...form, career: e.target.value})}>
              <option value="">— Sin carrera —</option>
              {careers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
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
    </div>
  );
}
