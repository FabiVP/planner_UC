import { useState, useEffect, startTransition } from 'react';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import './Students.css';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [careers, setCareers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', studentCode: '', currentSemester: 1, career: '' });
  const [loadError, setLoadError] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const load = async () => { try { const r = await api.get('/students?limit=500'); startTransition(() => { setStudents(r.data.students || []); setLoadError(null); }); } catch { startTransition(() => setLoadError('Error al cargar estudiantes')); } };
  const loadCareers = async () => { try { const r = await api.get('/careers'); startTransition(() => setCareers(r.data.careers || [])); } catch { /* ignore */ } };

  useEffect(() => { load(); loadCareers(); }, []);

  const getCareerName = (s) => {
    if (!s.career) return '—';
    if (typeof s.career === 'object') return s.career.name || s.career.code || '—';
    const found = careers.find(c => c._id === s.career);
    return found ? found.name : '—';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.career) delete payload.career;
      if (editing) { await api.put(`/students/${editing._id}`, payload); }
      else { await api.post('/students', payload); }
      setModal(false); setEditing(null); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name,
      email: s.email,
      studentCode: s.studentCode,
      currentSemester: s.currentSemester,
      career: s.career?._id || s.career || ''
    });
    setModal(true);
  };
  const handleDelete = async (id) => { if(!confirm('¿Eliminar?')) return; await api.delete(`/students/${id}`); load(); };

  return (
    <div className="animate-fadeIn">
        {loadError && <div className="alert alert-error">{loadError}</div>}
        <div className="page-actions">
          <span className="results-count">{students.length} estudiantes registrados</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', email: '', studentCode: '', currentSemester: 1, career: '' }); setModal(true); }}><HiOutlinePlus /> Nuevo Estudiante</button>
        </div>
        <div className="card"><div className="table-wrapper"><table><thead><tr><th>Código</th><th>Nombre</th><th>Email</th><th>Semestre</th><th>Carrera</th><th>Acciones</th></tr></thead><tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td><span className="code-badge">{s.studentCode}</span></td>
              <td className="td-name">{s.name}</td><td>{s.email}</td><td>{s.currentSemester}</td><td>{getCareerName(s)}</td>
              <td><div className="action-btns"><button className="btn btn-outline btn-sm" title="Ver detalle" onClick={() => setDetailItem(s)}><HiOutlineEye /></button><button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}><HiOutlinePencil /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}><HiOutlineTrash /></button></div></td>
            </tr>
          ))}
          {students.length === 0 && <tr><td colSpan="6" className="empty-state">No hay estudiantes</td></tr>}
        </tbody></table></div></div>
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
          <div className="form-group">
            <label>Carrera</label>
            <select className="form-select" value={form.career} onChange={e => setForm({...form, career: e.target.value})}>
              <option value="">— Seleccionar carrera —</option>
              {careers.map(c => <option key={c._id} value={c._id}>{c.code} — {c.name}</option>)}
            </select>
            {careers.length === 0 && <span className="form-hint">No hay carreras registradas. Crea una desde Carreras.</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',marginTop:8}}>{editing ? 'Actualizar' : 'Crear'}</button>
        </form>
      </Modal>

      <Modal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title={`Estudiante: ${detailItem?.name || ''}`}>
        {detailItem && (
          <div className="detail-modal-body">
            <div className="detail-row"><span className="detail-label">Código</span><span className="detail-value"><span className="code-badge">{detailItem.studentCode}</span></span></div>
            <div className="detail-row"><span className="detail-label">Nombre</span><span className="detail-value">{detailItem.name}</span></div>
            <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{detailItem.email || '-'}</span></div>
            <div className="detail-row"><span className="detail-label">Semestre actual</span><span className="detail-value">{detailItem.currentSemester}</span></div>
            <div className="detail-row"><span className="detail-label">Carrera</span><span className="detail-value">{getCareerName(detailItem)}</span></div>
            <div className="detail-row"><span className="detail-label">Cursos aprobados</span><span className="detail-value">{(detailItem.approvedCourses || []).length} cursos ({(detailItem.approvedCourses || []).filter(ac => ac.grade != null).length} con nota)</span></div>
            <div className="detail-row"><span className="detail-label">Promedio</span><span className="detail-value">{detailItem.gpa || '—'}</span></div>
            <div className="detail-row"><span className="detail-label">Preferencia turno</span><span className="detail-value">{detailItem.preferredShift || 'indiferente'}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
