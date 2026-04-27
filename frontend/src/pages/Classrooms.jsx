import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import './Classrooms.css';

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', capacity: 30, type: 'teorico', building: 'Principal', floor: 1 });

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await api.get('/classrooms'); setClassrooms(r.data.classrooms || []); } catch(e){} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/classrooms/${editing._id}`, form); }
      else { await api.post('/classrooms', form); }
      setModal(false); setEditing(null); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (c) => { setEditing(c); setForm({ code: c.code, name: c.name, capacity: c.capacity, type: c.type, building: c.building, floor: c.floor }); setModal(true); };
  const handleDelete = async (id) => { if(!confirm('¿Eliminar?')) return; await api.delete(`/classrooms/${id}`); load(); };

  return (
    <>
      <Header title="Aulas" subtitle="Gestión de espacios académicos" />
      <div className="page-content">
        <div className="page-actions">
          <span className="results-count">{classrooms.length} aulas registradas</span>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ code: '', name: '', capacity: 30, type: 'teorico', building: 'Principal', floor: 1 }); setModal(true); }}><HiOutlinePlus /> Nueva Aula</button>
        </div>
        <div className="card"><div className="table-wrapper"><table><thead><tr><th>Código</th><th>Nombre</th><th>Capacidad</th><th>Tipo</th><th>Edificio</th><th>Piso</th><th>Acciones</th></tr></thead><tbody>
          {classrooms.map(c => (
            <tr key={c._id}>
              <td><span className="code-badge">{c.code}</span></td>
              <td className="td-name">{c.name}</td><td>{c.capacity}</td>
              <td><span className={`badge badge-${c.type === 'laboratorio' ? 'info' : 'success'}`}>{c.type}</span></td>
              <td>{c.building}</td><td>{c.floor}</td>
              <td><div className="action-btns"><button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil /></button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button></div></td>
            </tr>
          ))}
          {classrooms.length === 0 && <tr><td colSpan="7" className="empty-state">No hay aulas</td></tr>}
        </tbody></table></div></div>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Aula' : 'Nueva Aula'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group"><label>Código</label><input className="form-input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
            <div className="form-group"><label>Nombre</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Capacidad</label><input type="number" className="form-input" value={form.capacity} onChange={e => setForm({...form, capacity: +e.target.value})} min="5" max="200" required /></div>
            <div className="form-group"><label>Tipo</label><select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="teorico">Teórico</option><option value="laboratorio">Laboratorio</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Edificio</label><input className="form-input" value={form.building} onChange={e => setForm({...form, building: e.target.value})} /></div>
            <div className="form-group"><label>Piso</label><input type="number" className="form-input" value={form.floor} onChange={e => setForm({...form, floor: +e.target.value})} min="1" max="10" /></div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',marginTop:8}}>{editing ? 'Actualizar' : 'Crear'}</button>
        </form>
      </Modal>
    </>
  );
}
