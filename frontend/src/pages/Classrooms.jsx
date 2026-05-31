import { useState, useEffect, startTransition } from 'react';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineClock, HiOutlineOfficeBuilding, HiOutlineEye } from 'react-icons/hi';
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
  campus: '', building: 'Principal', floor: 1, availabilitySchedule: []
};

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [campusFilter, setCampusFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [showAvailability, setShowAvailability] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const load = async () => {
    try { const r = await api.get('/classrooms'); startTransition(() => { setClassrooms(r.data.classrooms || []); setLoadError(null); }); } catch { startTransition(() => setLoadError('Error al cargar aulas')); }
  };
  const loadCampuses = async () => {
    try { const r = await api.get('/campuses'); startTransition(() => setCampuses(r.data.campuses || [])); } catch { /* ignore */ }
  };

  useEffect(() => { load(); loadCampuses(); }, []);

  const filteredClassrooms = campusFilter
    ? classrooms.filter(c => (c.campus?._id || c.campus) === campusFilter)
    : classrooms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.campus) delete payload.campus;
      if (editing) { await api.put(`/classrooms/${editing._id}`, payload); }
      else { await api.post('/classrooms', payload); }
      setModal(false); setEditing(null); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code, name: c.name, capacity: c.capacity, type: c.type,
      campus: c.campus?._id || c.campus || '',
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
      {loadError && <div className="alert alert-error">{loadError}</div>}

      {/* Campus filter */}
      <div className="page-actions" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="results-info">
          <span className="results-count">{filteredClassrooms.length} aulas{ campuses.length > 0 && <> de {campuses.find(c => (c._id) === campusFilter)?.name || 'todas las sedes'}</>}</span>
          <div className="teacher-type-badges">
            {typeStats.filter(t => t.count > 0).map(t => (
              <span key={t.value} className={`mini-badge ${t.value}`}>{t.count} {t.label}</span>
            ))}
          </div>
        </div>
        <div className="filter-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select className="form-input" style={{ padding: '0.4rem', fontSize: '0.85rem' }}
            value={campusFilter} onChange={e => setCampusFilter(e.target.value)}>
            <option value="">Todas las sedes</option>
            {campuses.map(c => (
              <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus /> Nueva Aula</button>
        </div>
      </div>

      <div className="card"><div className="table-wrapper"><table><thead><tr>
        <th>Código</th><th>Nombre</th><th>Sede</th><th>Capacidad</th><th>Tipo</th><th>Edificio</th><th>Piso</th><th>Disponibilidad</th><th>Acciones</th>
      </tr></thead><tbody>
        {filteredClassrooms.map(c => {
          const tb = getTypeBadge(c.type);
          const campusName = c.campus?.name || (campuses.find(cp => cp._id === c.campus)?.name) || '—';
          return (
            <tr key={c._id}>
              <td><span className="code-badge">{c.code}</span></td>
              <td className="td-name">{c.name}</td>
              <td><span className="campus-badge"><HiOutlineOfficeBuilding style={{ marginRight: 4 }} />{campusName}</span></td>
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
                  <button className="btn btn-outline btn-sm" title="Ver detalle" onClick={() => setDetailItem(c)}><HiOutlineEye /></button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}><HiOutlinePencil /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button>
                </div>
              </td>
            </tr>
          );
        })}
        {filteredClassrooms.length === 0 && <tr><td colSpan="9" className="empty-state">No hay aulas registradas{ campusFilter ? ' para esta sede' : '' }</td></tr>}
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

          <div className="form-group">
            <label>Sede / Campus</label>
            <select className="form-input" value={form.campus} onChange={e => setForm({ ...form, campus: e.target.value })}>
              <option value="">— Sin sede —</option>
              {campuses.map(c => (
                <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Edificio / Pabellón</label>
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

      <Modal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title={`Aula: ${detailItem?.code || ''}`}>
        {detailItem && (
          <div className="detail-modal-body">
            <div className="detail-row"><span className="detail-label">Código</span><span className="detail-value"><span className="code-badge">{detailItem.code}</span></span></div>
            <div className="detail-row"><span className="detail-label">Nombre</span><span className="detail-value">{detailItem.name}</span></div>
            <div className="detail-row"><span className="detail-label">Capacidad</span><span className="detail-value">{detailItem.capacity} personas</span></div>
            <div className="detail-row"><span className="detail-label">Tipo</span><span className="detail-value"><span className={`badge badge-${getTypeBadge(detailItem.type).color}`}>{getTypeBadge(detailItem.type).label}</span></span></div>
            <div className="detail-row"><span className="detail-label">Sede</span><span className="detail-value">{detailItem.campus?.name || (campuses.find(cp => cp._id === detailItem.campus)?.name) || '—'}</span></div>
            <div className="detail-row"><span className="detail-label">Edificio</span><span className="detail-value">{detailItem.building}</span></div>
            <div className="detail-row"><span className="detail-label">Piso</span><span className="detail-value">{detailItem.floor}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
