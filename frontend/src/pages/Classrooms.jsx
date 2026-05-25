import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineClock } from 'react-icons/hi';
import './Classrooms.css';

const DAYS = [
  { value: 'lunes', label: 'Lun' },
  { value: 'martes', label: 'Mar' },
  { value: 'miercoles', label: 'Mié' },
  { value: 'jueves', label: 'Jue' },
  { value: 'viernes', label: 'Vie' },
  { value: 'sabado', label: 'Sáb' },
  { value: 'domingo', label: 'Dom' }
];

const CLASSROOM_TYPES = [
  { value: 'teorico', label: 'Teórico', color: 'success' },
  { value: 'laboratorio', label: 'Laboratorio', color: 'info' },
  { value: 'aula_virtual', label: 'Aula Virtual', color: 'warning' }
];

const defaultForm = {
  code: '', name: '', capacity: 30, type: 'teorico',
  building: 'Principal', floor: 1, availabilitySchedule: []
};

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [showAvailability, setShowAvailability] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { const r = await api.get('/classrooms'); setClassrooms(r.data.classrooms || []); } catch(e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/classrooms/${editing._id}`, form); }
      else { await api.post('/classrooms', form); }
      setModal(false); setEditing(null); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code, name: c.name, capacity: c.capacity, type: c.type,
      building: c.building, floor: c.floor,
      availabilitySchedule: c.availabilitySchedule || []
    });
    setShowAvailability((c.availabilitySchedule || []).length > 0);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este aula?')) return;
    await api.delete(`/classrooms/${id}`);
    load();
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...defaultForm });
    setShowAvailability(false);
    setModal(true);
  };

  const addAvailSlot = () => {
    setForm(f => ({
      ...f,
      availabilitySchedule: [...f.availabilitySchedule, { day: 'lunes', startTime: '07:00', endTime: '22:00' }]
    }));
  };

  const updateAvailSlot = (idx, field, value) => {
    setForm(f => {
      const sched = [...f.availabilitySchedule];
      sched[idx] = { ...sched[idx], [field]: value };
      return { ...f, availabilitySchedule: sched };
    });
  };

  const removeAvailSlot = (idx) => {
    setForm(f => ({
      ...f,
      availabilitySchedule: f.availabilitySchedule.filter((_, i) => i !== idx)
    }));
  };

  const getTypeBadge = (type) => {
    const ct = CLASSROOM_TYPES.find(t => t.value === type);
    return ct || CLASSROOM_TYPES[0];
  };

  const typeStats = CLASSROOM_TYPES.map(t => ({
    ...t,
    count: classrooms.filter(c => c.type === t.value).length
  }));

  return (
    <div className="animate-fadeIn">
      <div className="page-actions">
        <div className="results-info">
          <span className="results-count">{classrooms.length} aulas registradas</span>
          <div className="teacher-type-badges">
            {typeStats.map(t => (
              t.count > 0 && <span key={t.value} className={`mini-badge ${t.value}`}>{t.count} {t.label}</span>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus /> Nueva Aula</button>
      </div>

      <div className="card"><div className="table-wrapper"><table><thead><tr>
        <th>Código</th><th>Nombre</th><th>Capacidad</th><th>Tipo</th><th>Edificio</th><th>Piso</th><th>Disponibilidad</th><th>Acciones</th>
      </tr></thead><tbody>
        {classrooms.map(c => {
          const tb = getTypeBadge(c.type);
          return (
            <tr key={c._id}>
              <td><span className="code-badge">{c.code}</span></td>
              <td className="td-name">{c.name}</td>
              <td>
                <div className="capacity-bar-wrapper">
                  <span>{c.capacity}</span>
                  <div className="capacity-bar">
                    <div className="capacity-bar-fill" style={{ width: `${Math.min(100, (c.capacity / 200) * 100)}%` }}></div>
                  </div>
                </div>
              </td>
              <td><span className={`badge badge-${tb.color}`}>{tb.label}</span></td>
              <td><span className="building-badge">{c.building}</span></td>
              <td>{c.floor}</td>
              <td>
                {c.availabilitySchedule?.length > 0 ? (
                  <span className="availability-chip">
                    <HiOutlineClock style={{ marginRight: 4 }} />
                    {c.availabilitySchedule.length} franjas
                  </span>
                ) : (
                  <span className="text-muted" style={{ fontSize: 12 }}>Siempre</span>
                )}
              </td>
              <td>
                <div className="action-btns">
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button>
                </div>
              </td>
            </tr>
          );
        })}
        {classrooms.length === 0 && <tr><td colSpan="8" className="empty-state">No hay aulas registradas</td></tr>}
      </tbody></table></div></div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Aula' : 'Nueva Aula'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Código</label>
              <input className="form-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacidad (aforo)</label>
              <input type="number" className="form-input" value={form.capacity}
                onChange={e => setForm({ ...form, capacity: +e.target.value })} min="5" max="500" required />
            </div>
            <div className="form-group">
              <label>Tipo de aula</label>
              <div className="classroom-type-selector">
                {CLASSROOM_TYPES.map(t => (
                  <button key={t.value} type="button"
                    className={`type-option ${form.type === t.value ? 'active' : ''} ${t.value}`}
                    onClick={() => setForm({ ...form, type: t.value })}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Edificio</label>
              <input className="form-input" value={form.building} onChange={e => setForm({ ...form, building: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Piso</label>
              <input type="number" className="form-input" value={form.floor} onChange={e => setForm({ ...form, floor: +e.target.value })} min="1" max="10" />
            </div>
          </div>

          {/* Availability schedule toggle */}
          <div className="form-group">
            <div className="avail-toggle">
              <label className="toggle-label">
                <input type="checkbox" checked={showAvailability}
                  onChange={e => {
                    setShowAvailability(e.target.checked);
                    if (!e.target.checked) setForm(f => ({ ...f, availabilitySchedule: [] }));
                  }} />
                <span className="toggle-text">Horario de disponibilidad específico</span>
              </label>
              <span className="form-hint">Si no se define, el aula está disponible todo el día</span>
            </div>
          </div>

          {showAvailability && (
            <div className="form-group avail-section">
              <label><HiOutlineClock style={{ verticalAlign: -2, marginRight: 4 }} />Franjas de disponibilidad</label>
              {form.availabilitySchedule.map((slot, idx) => (
                <div key={idx} className="availability-row">
                  <select className="form-select" value={slot.day} onChange={e => updateAvailSlot(idx, 'day', e.target.value)}>
                    {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  <input type="time" className="form-input" value={slot.startTime} onChange={e => updateAvailSlot(idx, 'startTime', e.target.value)} />
                  <span className="avail-separator">a</span>
                  <input type="time" className="form-input" value={slot.endTime} onChange={e => updateAvailSlot(idx, 'endTime', e.target.value)} />
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeAvailSlot(idx)}>
                    <HiOutlineTrash />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addAvailSlot} style={{ marginTop: 8 }}>
                <HiOutlinePlus /> Agregar franja
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            {editing ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
