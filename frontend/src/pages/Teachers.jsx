import { useState, useEffect, startTransition } from 'react';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineClock, HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineEye, HiOutlineUserGroup } from 'react-icons/hi';
import './Teachers.css';

const DAYS = [
  { value: 'lunes', label: 'Lun' },
  { value: 'martes', label: 'Mar' },
  { value: 'miercoles', label: 'Mié' },
  { value: 'jueves', label: 'Jue' },
  { value: 'viernes', label: 'Vie' },
  { value: 'sabado', label: 'Sáb' },
  { value: 'domingo', label: 'Dom' }
];

const SHIFTS = [
  { value: 'manana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noche', label: 'Noche' },
  { value: 'indiferente', label: 'Indiferente' }
];

const CONTRACT_TYPES = [
  { value: 'tiempo_completo', label: 'Tiempo Completo', abbr: 'TC' },
  { value: 'por_horas', label: 'Por Horas', abbr: 'PH' }
];

const PERFORMANCE_LEVELS = [
  { value: 'alto', label: 'Alto', color: '#10b981' },
  { value: 'regular', label: 'Regular', color: '#f59e0b' },
  { value: 'bajo', label: 'Bajo', color: '#ef4444' }
];

const defaultForm = {
  name: '',
  email: '',
  contractType: 'tiempo_completo',
  performanceLevel: 'regular',
  performanceScore: 80,
  maxCourses: 4,
  maxWeeklyHours: 40,
  preferredShift: 'indiferente',
  freeDays: [],
  availability: [],
  specializations: []
};

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [activeTab, setActiveTab] = useState('basic');

  const loadTeachers = async () => {
    try {
      const r = await api.get('/teachers');
      startTransition(() => setTeachers(r.data.teachers || []));
    } catch { /* ignore */ }
  };

  const loadCourses = async () => {
    try {
      const r = await api.get('/courses');
      startTransition(() => setCourses(r.data.courses || []));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadTeachers();
    loadCourses();
  }, []);

  const handleContractChange = (contractType) => {
    if (contractType === 'por_horas') {
      setForm(f => ({ ...f, contractType, maxCourses: Math.min(f.maxCourses, 2), maxWeeklyHours: 20 }));
    } else {
      setForm(f => ({ ...f, contractType, maxCourses: f.maxCourses < 2 ? 4 : f.maxCourses, maxWeeklyHours: 40 }));
    }
  };

  const toggleFreeDay = (day) => {
    setForm(f => ({
      ...f,
      freeDays: f.freeDays.includes(day) ? f.freeDays.filter(d => d !== day) : [...f.freeDays, day]
    }));
  };

  const toggleSpecialization = (courseId) => {
    setForm(f => ({
      ...f,
      specializations: f.specializations.includes(courseId)
        ? f.specializations.filter(id => id !== courseId)
        : [...f.specializations, courseId]
    }));
  };

  const addAvailability = () => {
    setForm(f => ({
      ...f,
      availability: [...f.availability, { day: 'lunes', startTime: '07:00', endTime: '13:00' }]
    }));
  };

  const updateAvailability = (index, field, value) => {
    setForm(f => {
      const avail = [...f.availability];
      avail[index] = { ...avail[index], [field]: value };
      return { ...f, availability: avail };
    });
  };

  const removeAvailability = (index) => {
    setForm(f => ({ ...f, availability: f.availability.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/teachers/${editing._id}`, form); }
      else { await api.post('/teachers', form); }
      setModal(false);
      setEditing(null);
      loadTeachers();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name || '',
      email: t.email || '',
      contractType: t.contractType || 'tiempo_completo',
      performanceLevel: t.performanceLevel || 'regular',
      performanceScore: t.performanceScore || 80,
      maxCourses: t.maxCourses || 3,
      maxWeeklyHours: t.maxWeeklyHours || 40,
      preferredShift: t.preferredShift || 'indiferente',
      freeDays: t.freeDays || [],
      availability: t.availability || [],
      specializations: (t.specializations || []).map(s => s._id || s)
    });
    setActiveTab('basic');
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este docente?')) return;
    await api.delete(`/teachers/${id}`);
    loadTeachers();
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...defaultForm });
    setActiveTab('basic');
    setModal(true);
  };

  const getContractBadge = (type) => {
    const ct = CONTRACT_TYPES.find(c => c.value === type);
    return ct ? ct.abbr : 'TC';
  };

  const getShiftLabel = (shift) => {
    const s = SHIFTS.find(sh => sh.value === shift);
    return s ? s.label : '-';
  };

  const tcCount = teachers.filter(t => t.contractType === 'tiempo_completo').length;
  const phCount = teachers.filter(t => t.contractType === 'por_horas').length;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1><HiOutlineUserGroup /> Docentes</h1>
      </div>
      <div className="page-actions">
        <div className="results-info">
          <span className="results-count">{teachers.length} docentes registrados</span>
          <div className="teacher-type-badges">
            <span className="mini-badge tc">{tcCount} TC</span>
            <span className="mini-badge ph">{phCount} PH</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openNew}><HiOutlinePlus /> Nuevo Docente</button>
      </div>
      <div className="card"><div className="table-wrapper"><table><thead><tr>
      <th>Nombre</th><th>Email</th><th>Contrato</th><th>Desempeño</th><th>Hrs/Sem</th><th>Turno</th><th>Especialidades</th><th>Días libres</th><th>Acciones</th>
      </tr></thead><tbody>
        {teachers.map(t => (
          <tr key={t._id}>
            <td className="td-name">{t.name}</td>
            <td>{t.email || '-'}</td>
            <td>
              <span className={`badge ${t.contractType === 'tiempo_completo' ? 'badge-success' : 'badge-warning'}`}>
                {getContractBadge(t.contractType)}
              </span>
            </td>
            <td>
              <span className="perf-badge" style={{ color: PERFORMANCE_LEVELS.find(p => p.value === t.performanceLevel)?.color || '#f59e0b' }}>
                ● {PERFORMANCE_LEVELS.find(p => p.value === t.performanceLevel)?.label || 'Regular'}
                <small style={{ marginLeft: 4, opacity: 0.7 }}>{t.performanceScore || 80}</small>
              </span>
            </td>
            <td>{t.maxWeeklyHours || '-'}h</td>
            <td><span className="shift-chip">{getShiftLabel(t.preferredShift)}</span></td>
            <td>
              {t.specializations?.length > 0 ? (
                <div className="spec-chips">
                  {t.specializations.slice(0, 3).map(s => (
                    <span key={s._id || s} className="spec-chip">{s.code || s.name || '?'}</span>
                  ))}
                  {t.specializations.length > 3 && <span className="spec-chip more">+{t.specializations.length - 3}</span>}
                </div>
              ) : <span className="text-muted">—</span>}
            </td>
            <td>
              {t.freeDays?.length > 0 ? (
                <div className="teacher-availability">
                  {t.freeDays.map(d => (
                    <span key={d} className="availability-chip free">{DAYS.find(dd => dd.value === d)?.label || d}</span>
                  ))}
                </div>
              ) : <span className="text-muted">—</span>}
            </td>
            <td>
              <div className="action-btns">
                <button className="btn btn-outline btn-sm" title="Ver perfil" onClick={() => setDetailModal(t)}><HiOutlineEye /></button>
                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(t)}><HiOutlinePencil /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}><HiOutlineTrash /></button>
              </div>
            </td>
          </tr>
        ))}
        {teachers.length === 0 && <tr><td colSpan="9" className="empty-state">No hay docentes registrados</td></tr>}
      </tbody></table></div></div>

      {/* ═══ TEACHER DETAIL MODAL (read-only for admin) ═══ */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={`Perfil: ${detailModal?.name || ''}`} width="600px">
        {detailModal && (
          <div className="teacher-detail">
            <div className="td-section">
              <h4>Información General</h4>
              <div className="td-grid">
                <div className="td-item"><span className="td-label">Nombre</span><span className="td-value">{detailModal.name}</span></div>
                <div className="td-item"><span className="td-label">Email</span><span className="td-value">{detailModal.email || '—'}</span></div>
                <div className="td-item"><span className="td-label">Contrato</span><span className={`badge ${detailModal.contractType === 'tiempo_completo' ? 'badge-success' : 'badge-warning'}`}>{getContractBadge(detailModal.contractType)} — {CONTRACT_TYPES.find(c => c.value === detailModal.contractType)?.label}</span></div>
                <div className="td-item"><span className="td-label">Departamento</span><span className="td-value">{detailModal.department || 'Ingeniería de Sistemas'}</span></div>
              </div>
            </div>
            <div className="td-section">
              <h4>Carga y Preferencias</h4>
              <div className="td-grid">
                <div className="td-item"><span className="td-label">Máx. cursos</span><span className="td-value">{detailModal.maxCourses}</span></div>
                <div className="td-item"><span className="td-label">Máx. horas/sem</span><span className="td-value">{detailModal.maxWeeklyHours}h</span></div>
                <div className="td-item"><span className="td-label">Turno preferido</span><span className="td-value">{getShiftLabel(detailModal.preferredShift)}</span></div>
                <div className="td-item"><span className="td-label">Días libres</span><span className="td-value">{detailModal.freeDays?.length > 0 ? detailModal.freeDays.map(d => DAYS.find(dd => dd.value === d)?.label).join(', ') : 'Ninguno'}</span></div>
              </div>
            </div>
            <div className="td-section">
              <h4>Cursos que puede dictar ({detailModal.specializations?.length || 0})</h4>
              {detailModal.specializations?.length > 0 ? (
                <div className="td-spec-list">
                  {detailModal.specializations.map(s => (
                    <div key={s._id || s} className="td-spec-item">
                      <span className="td-spec-code">{s.code || '—'}</span>
                      <span className="td-spec-name">{s.name || '—'}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted">No se han asignado especializaciones</p>}
            </div>
            {detailModal.availability?.length > 0 && (
              <div className="td-section">
                <h4>Disponibilidad Horaria</h4>
                <div className="td-avail-list">
                  {detailModal.availability.map((a, i) => (
                    <span key={i} className="td-avail-chip">{DAYS.find(d => d.value === a.day)?.label} {a.startTime}–{a.endTime}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ═══ CREATE / EDIT MODAL ═══ */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Editar Docente' : 'Nuevo Docente'}>
        <div className="modal-tabs">
          <button className={`modal-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
            <HiOutlineBriefcase /> Datos
          </button>
          <button className={`modal-tab ${activeTab === 'specializations' ? 'active' : ''}`} onClick={() => setActiveTab('specializations')}>
            <HiOutlineAcademicCap /> Especialidades
          </button>
          <button className={`modal-tab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <HiOutlineClock /> Disponibilidad
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {activeTab === 'basic' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de contrato</label>
                  <div className="contract-selector">
                    {CONTRACT_TYPES.map(ct => (
                      <button key={ct.value} type="button" className={`contract-option ${form.contractType === ct.value ? 'active' : ''}`}
                        onClick={() => handleContractChange(ct.value)}>
                        <strong>{ct.abbr}</strong><span>{ct.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Máx. cursos/semestre</label>
                  <input type="number" className="form-input" value={form.maxCourses}
                    onChange={e => setForm({ ...form, maxCourses: +e.target.value })}
                    min="1" max={form.contractType === 'por_horas' ? 3 : 8} />
                </div>
                <div className="form-group">
                  <label>Máx. horas semanales</label>
                  <input type="number" className="form-input" value={form.maxWeeklyHours}
                    onChange={e => setForm({ ...form, maxWeeklyHours: +e.target.value })}
                    min="1" max={form.contractType === 'por_horas' ? 20 : 48} />
                  <span className="form-hint">
                    {form.contractType === 'por_horas' ? 'Máx. 20h (PH)' : 'Máx. 48h (TC)'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Turno preferido</label>
                <div className="shift-selector">
                  {SHIFTS.map(s => (
                    <button key={s.value} type="button" className={`shift-option ${form.preferredShift === s.value ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, preferredShift: s.value })}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Desempeño docente</label>
                  <div className="shift-selector">
                    {PERFORMANCE_LEVELS.map(p => (
                      <button key={p.value} type="button"
                        className={`shift-option ${form.performanceLevel === p.value ? 'active' : ''}`}
                        style={form.performanceLevel === p.value ? { background: p.color, borderColor: p.color } : {}}
                        onClick={() => setForm({ ...form, performanceLevel: p.value })}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Puntaje de desempeño (0-100)</label>
                  <input type="number" className="form-input" value={form.performanceScore}
                    onChange={e => setForm({ ...form, performanceScore: +e.target.value })}
                    min="0" max="100" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'specializations' && (
            <div className="form-group">
              <label>Cursos que puede dictar</label>
              <p className="form-hint" style={{ marginBottom: 8 }}>Seleccione los cursos en los que este docente tiene especialidad. Esta información es esencial para la generación automática de horarios.</p>
              <div className="spec-selector">
                {courses.map(c => (
                  <label key={c._id} className={`spec-option ${form.specializations.includes(c._id) ? 'selected' : ''}`}>
                    <input type="checkbox" checked={form.specializations.includes(c._id)}
                      onChange={() => toggleSpecialization(c._id)} />
                    <div className="spec-option-info">
                      <strong>{c.code}</strong>
                      <span>{c.name}</span>
                      <small>Sem {c.semester} · {c.credits} créd · {c.type}</small>
                    </div>
                  </label>
                ))}
                {courses.length === 0 && <p className="text-muted">No hay cursos registrados.</p>}
              </div>
              <div className="spec-count-bar">
                <span>{form.specializations.length} curso(s) seleccionado(s)</span>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <>
              <div className="form-group">
                <label>Días libres</label>
                <p className="form-hint" style={{ marginBottom: 8 }}>Seleccione los días en que el docente NO está disponible</p>
                <div className="day-selector">
                  {DAYS.map(d => (
                    <button key={d.value} type="button" className={`day-option ${form.freeDays.includes(d.value) ? 'active' : ''}`}
                      onClick={() => toggleFreeDay(d.value)}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Disponibilidad horaria</label>
                <p className="form-hint" style={{ marginBottom: 8 }}>Franjas en las que el docente PUEDE dictar clase</p>
                {form.availability.map((avail, idx) => (
                  <div key={idx} className="availability-row">
                    <select className="form-select" value={avail.day} onChange={e => updateAvailability(idx, 'day', e.target.value)}>
                      {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <input type="time" className="form-input" value={avail.startTime} onChange={e => updateAvailability(idx, 'startTime', e.target.value)} />
                    <span className="avail-separator">a</span>
                    <input type="time" className="form-input" value={avail.endTime} onChange={e => updateAvailability(idx, 'endTime', e.target.value)} />
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeAvailability(idx)}><HiOutlineTrash /></button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={addAvailability} style={{ marginTop: 8 }}>
                  <HiOutlinePlus /> Agregar franja
                </button>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            {editing ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
