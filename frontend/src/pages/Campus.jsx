import { useState, useEffect, startTransition } from 'react';
import { HiOutlineOfficeBuilding, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineClock, HiOutlineEye } from 'react-icons/hi';
import api from '../api/axios';
import Modal from '../components/ui/Modal';
import './Campus.css';

const EMPTY_ROOM = { code: '', name: '', type: 'teorico', capacity: 30 };
const EMPTY_FLOOR = { floorNumber: 1, rooms: [] };
const EMPTY_BUILDING = { code: '', name: '', floors: [] };

const emptyCampus = { code: '', name: '', address: '', city: 'Huancayo', operatingHours: { startTime: '07:00', endTime: '22:00' }, buildings: [] };

export default function Campus() {
  const [campuses, setCampuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyCampus });
  const [loading, setLoading] = useState(true);
  const [newBuilding, setNewBuilding] = useState({ ...EMPTY_BUILDING });
  const [newFloor, setNewFloor] = useState({ ...EMPTY_FLOOR });
  const [newRoom, setNewRoom] = useState({ ...EMPTY_ROOM });
  const [expandedCampus, setExpandedCampus] = useState(null);
  const [campusClassrooms, setCampusClassrooms] = useState({});

  const fetchCampuses = async () => {
    try {
      const { data } = await api.get('/campuses');
      startTransition(() => setCampuses(data.campuses || []));
    } catch { console.error('Error al cargar campus'); }
    finally { startTransition(() => setLoading(false)); }
  };

  useEffect(() => { fetchCampuses(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyCampus, buildings: [] }); setShowModal(true); };
  const openEdit = async (c) => {
    setEditing(c._id);
    const buildings = c.buildings || [];
    // Cargar aulas reales desde Classroom y poblar los pisos del formulario
    try {
      const { data } = await api.get(`/classrooms?limit=200`);
      const campusRooms = (data.classrooms || []).filter(cr => {
        const cId = cr.campus?._id || cr.campus;
        return cId === c._id;
      });
      const grouped = {};
      for (const cr of campusRooms) {
        const b = cr.building || 'Principal';
        if (!grouped[b]) grouped[b] = {};
        const f = cr.floor || 1;
        if (!grouped[b][f]) grouped[b][f] = [];
        grouped[b][f].push(cr);
      }
      const updatedBuildings = buildings.map(b => {
        const floorMap = grouped[b.code] || {};
        const existingFloorNums = new Set((b.floors || []).map(f => f.floorNumber));
        // Mantener pisos existentes + agregar pisos del Classroom que falten
        const merged = (b.floors || []).map(f => ({
          ...f,
          rooms: floorMap[f.floorNumber]
            ? floorMap[f.floorNumber].map(r => ({
                code: r.code,
                name: r.name,
                type: r.type === 'laboratorio' ? 'laboratorio_computo' : r.type,
                capacity: r.capacity
              }))
            : f.rooms || []
        }));
        Object.entries(floorMap).forEach(([fNum, rooms]) => {
          if (!existingFloorNums.has(Number(fNum))) {
            merged.push({
              floorNumber: Number(fNum),
              rooms: rooms.map(r => ({
                code: r.code,
                name: r.name,
                type: r.type === 'laboratorio' ? 'laboratorio_computo' : r.type,
                capacity: r.capacity
              }))
            });
          }
        });
        return { ...b, floors: merged };
      });
      setForm({ ...c, buildings: updatedBuildings });
    } catch {
      setForm({ ...c, buildings });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/campuses/${editing}`, form);
      } else {
        await api.post('/campuses', form);
      }
      setShowModal(false);
      fetchCampuses();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar este campus?')) return;
    try {
      await api.delete(`/campuses/${id}`);
      fetchCampuses();
    } catch (err) { console.error(err); }
  };

  // ─── Buildings ───
  const addBuilding = () => {
    if (!newBuilding.code || !newBuilding.name) return;
    setForm(prev => ({ ...prev, buildings: [...prev.buildings, { ...newBuilding, floors: [] }] }));
    setNewBuilding({ ...EMPTY_BUILDING });
  };

  const removeBuilding = (idx) => {
    setForm(prev => ({ ...prev, buildings: prev.buildings.filter((_, i) => i !== idx) }));
  };

  // ─── Floors ───
  const addFloor = (buildingIdx) => {
    if (!newFloor.floorNumber) return;
    const updated = [...form.buildings];
    if (!updated[buildingIdx].floors) updated[buildingIdx].floors = [];
    if (updated[buildingIdx].floors.some(f => f.floorNumber === newFloor.floorNumber)) {
      alert(`El piso ${newFloor.floorNumber} ya existe en este edificio.`);
      return;
    }
    updated[buildingIdx] = { ...updated[buildingIdx], floors: [...updated[buildingIdx].floors, { ...newFloor, rooms: [] }] };
    setForm(prev => ({ ...prev, buildings: updated }));
    setNewFloor({ ...EMPTY_FLOOR });
  };

  const removeFloor = (buildingIdx, floorIdx) => {
    const updated = [...form.buildings];
    updated[buildingIdx] = { ...updated[buildingIdx], floors: updated[buildingIdx].floors.filter((_, i) => i !== floorIdx) };
    setForm(prev => ({ ...prev, buildings: updated }));
  };

  // ─── Rooms ───
  const addRoom = (buildingIdx, floorIdx) => {
    if (!newRoom.code || !newRoom.capacity) return;
    const updated = [...form.buildings];
    if (!updated[buildingIdx].floors[floorIdx].rooms) updated[buildingIdx].floors[floorIdx].rooms = [];
    updated[buildingIdx].floors[floorIdx] = {
      ...updated[buildingIdx].floors[floorIdx],
      rooms: [...updated[buildingIdx].floors[floorIdx].rooms, { ...newRoom }]
    };
    setForm(prev => ({ ...prev, buildings: updated }));
    setNewRoom({ ...EMPTY_ROOM });
  };

  const removeRoom = (buildingIdx, floorIdx, roomIdx) => {
    const updated = [...form.buildings];
    updated[buildingIdx].floors[floorIdx] = {
      ...updated[buildingIdx].floors[floorIdx],
      rooms: updated[buildingIdx].floors[floorIdx].rooms.filter((_, i) => i !== roomIdx)
    };
    setForm(prev => ({ ...prev, buildings: updated }));
  };

  // ─── Count helpers ───
  const totalRooms = (building) =>
    (building.floors || []).reduce((s, f) => s + (f.rooms?.length || 0), 0);

  // ─── Fetch classrooms linked to a campus (from Aulas page) ───
  const fetchCampusClassrooms = async (campusId) => {
    try {
      const { data } = await api.get(`/classrooms?limit=200`);
      const filtered = (data.classrooms || []).filter(c => {
        const cId = c.campus?._id || c.campus;
        return cId === campusId;
      });
      setCampusClassrooms(prev => ({ ...prev, [campusId]: filtered }));
    } catch (e) { console.error(e); }
  };

  // ─── Group classrooms by building → floor ───
  const groupClassrooms = (classrooms) => {
    const map = {};
    for (const c of classrooms) {
      const b = c.building || 'Principal';
      if (!map[b]) map[b] = {};
      const f = c.floor || 1;
      if (!map[b][f]) map[b][f] = [];
      map[b][f].push(c);
    }
    return map;
  };

  const toggleExpand = (campusId) => {
    setExpandedCampus(expandedCampus === campusId ? null : campusId);
    if (expandedCampus !== campusId) fetchCampusClassrooms(campusId);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="campus-page">
      <div className="campus-header">
        <div>
          <h1><HiOutlineOfficeBuilding /> Campus / Sedes</h1>
          <p>Gestión de sedes universitarias, edificios, pisos y aulas</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><HiOutlinePlus /> Nuevo Campus</button>
      </div>

      {/* Campus cards */}
      <div className="campus-grid">
        {campuses.map(campus => (
          <div key={campus._id} className={`campus-card ${expandedCampus === campus._id ? 'expanded' : ''}`}>
            <div className="campus-card-header">
              <HiOutlineOfficeBuilding className="campus-icon" />
              <div>
                <h3>{campus.name}</h3>
                <span className="campus-code">{campus.code}</span>
              </div>
            </div>
            <div className="campus-card-body">
              <p className="campus-address">{campus.address || campus.city || 'Sin dirección'}</p>
              <div className="campus-hours">
                <HiOutlineClock />
                <span>{campus.operatingHours?.startTime || '07:00'} - {campus.operatingHours?.endTime || '22:00'}</span>
              </div>
              {campus.buildings?.length > 0 && (
                <div className="campus-buildings">
                  <strong>{campus.buildings.length} edificio(s) · {campus.buildings.reduce((s, b) => s + totalRooms(b), 0)} aula(s)</strong>
                </div>
              )}
            </div>
            <div className="campus-card-actions">
              <button className="btn-icon" title="Ver detalle" onClick={() => toggleExpand(campus._id)}>
                <HiOutlineEye />
              </button>
              <button className="btn-icon" title="Editar" onClick={() => openEdit(campus)}><HiOutlinePencil /></button>
              <button className="btn-icon btn-danger" title="Desactivar" onClick={() => handleDelete(campus._id)}><HiOutlineTrash /></button>
            </div>

            {/* ─── Expanded detail: aulas desde el modelo Classroom (única fuente de verdad) ─── */}
            {expandedCampus === campus._id && (
              <div className="campus-detail">
                {(() => {
                  const linked = campusClassrooms[campus._id] || [];
                  const grouped = groupClassrooms(linked);
                  const buildingNames = {};
                  if (campus.buildings) campus.buildings.forEach(b => { buildingNames[b.code] = b.name; });

                  if (linked.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <p className="cd-empty" style={{ margin: '0 0 0.5rem' }}>Este campus no tiene aulas registradas.</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Crea aulas desde la pestaña <strong>Aulas</strong> seleccionando esta sede, o usa el botón Editar para agregar edificios con salones.
                        </p>
                      </div>
                    );
                  }

                  const roomTypeClass = { teorico: 'teorico', laboratorio: 'laboratorio_computo', laboratorio_practica: 'laboratorio_practica', aula_virtual: 'aula_virtual' };
                  const roomTypeLabel = { teorico: 'Teoría', laboratorio: 'Laboratorio Cómputo', laboratorio_practica: 'Laboratorio Práctica', aula_virtual: 'Virtual' };

                  return Object.entries(grouped).sort().map(([bCode, floors]) => (
                    <div key={bCode} className="cd-building">
                      <div className="cd-building-header">
                        <strong>{bCode}</strong> — {buildingNames[bCode] || bCode}
                        <span className="cd-badge">
                          {Object.values(floors).reduce((s, r) => s + r.length, 0)} aula(s)
                        </span>
                      </div>
                      {Object.entries(floors).sort(([a], [b]) => a - b).map(([floorNum, rooms]) => (
                        <div key={floorNum} className="cd-floor">
                          <div className="cd-floor-header">Piso {floorNum} · {rooms.length} salón(es)</div>
                          <div className="cd-rooms">
                            {rooms.map((r, ri) => (
                              <div key={ri} className="cd-room">
                                <span className="cd-room-code">{r.code}</span>
                                <span className="cd-room-name">{r.name}</span>
                                <span className={`cd-room-type type-${roomTypeClass[r.type] || r.type}`}>
                                  {roomTypeLabel[r.type] || r.type}
                                </span>
                                <span className="cd-room-cap">{r.capacity} pers.</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        ))}
        {campuses.length === 0 && (
          <div className="campus-empty">
            <HiOutlineOfficeBuilding className="empty-icon" />
            <p>No hay campus registrados.</p>
          </div>
        )}
      </div>

      {/* Modal form */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Campus' : 'Nuevo Campus'}>
        <form onSubmit={handleSubmit} className="campus-form">
          <div className="form-row">
            <label>Código *<input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required /></label>
            <label>Nombre *<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          </div>
          <div className="form-row">
            <label>Dirección<input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /></label>
            <label>Ciudad<input value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} /></label>
          </div>
          <div className="form-row">
            <label>Hora apertura<input type="time" value={form.operatingHours?.startTime || '07:00'} onChange={e => setForm({ ...form, operatingHours: { ...form.operatingHours, startTime: e.target.value } })} /></label>
            <label>Hora cierre<input type="time" value={form.operatingHours?.endTime || '22:00'} onChange={e => setForm({ ...form, operatingHours: { ...form.operatingHours, endTime: e.target.value } })} /></label>
          </div>

          {/* ─── Buildings section ─── */}
          <div className="form-section">
            <h4>Edificios / Pabellones</h4>
            <p className="form-hint" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Agrega uno o más edificios. Dentro de cada edificio puedes agregar pisos y en cada piso, los salones con su tipo y aforo.
            </p>

            {/* Add building form — siempre visible */}
            <div className="add-building-bar">
              <input placeholder="Código (ej: A, B, LAB)" value={newBuilding.code} onChange={e => setNewBuilding({ ...newBuilding, code: e.target.value })} />
              <input placeholder="Nombre del pabellón" value={newBuilding.name} onChange={e => setNewBuilding({ ...newBuilding, name: e.target.value })} />
              <button type="button" className="btn-add-building" onClick={addBuilding}>+ Agregar edificio</button>
            </div>

            {/* Lista de edificios agregados */}
            {form.buildings?.map((b, bi) => (
              <div key={bi} className="building-card">
                <div className="building-card-header">
                  <strong>{b.code}</strong> — {b.name}
                  <span className="building-room-count">{totalRooms(b)} aulas · {b.floors?.length || 0} pisos</span>
                  <button type="button" className="btn-remove-sm" onClick={() => removeBuilding(bi)} title="Eliminar edificio">×</button>
                </div>

                <div className="building-detail">
                  {/* Pisos del edificio */}
                  {b.floors?.map((f, fi) => (
                    <div key={fi} className="floor-card">
                      <div className="floor-card-header">
                        <strong>Piso {f.floorNumber}</strong>
                        <span className="building-room-count">{f.rooms?.length || 0} salones</span>
                        <button type="button" className="btn-remove-sm" onClick={() => removeFloor(bi, fi)} title="Eliminar piso">×</button>
                      </div>

                      <div className="floor-detail">
                        {/* Salones del piso */}
                        {f.rooms?.map((r, ri) => (
                          <div key={ri} className="room-row">
                            <span className="room-code">{r.code}</span>
                            <span className="room-name">{r.name || r.code}</span>
                            <span className={`room-type-badge type-${r.type}`}>
                              {r.type === 'teorico' ? 'Teoría' : r.type === 'laboratorio_computo' ? 'Lab. Cómputo' : 'Lab. Práctica'}
                            </span>
                            <span className="room-capacity">{r.capacity} pers.</span>
                            <button type="button" className="btn-remove-sm" onClick={() => removeRoom(bi, fi, ri)} title="Eliminar salón">×</button>
                          </div>
                        ))}

                        {/* Formulario para agregar salón a este piso */}
                        <div className="room-add-row">
                          <input placeholder="Código (ej: A-101)" value={newRoom.code} onChange={e => setNewRoom({ ...newRoom, code: e.target.value })} />
                          <input placeholder="Nombre" value={newRoom.name} onChange={e => setNewRoom({ ...newRoom, name: e.target.value })} />
                          <select value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
                            <option value="teorico">Teoría</option>
                            <option value="laboratorio_computo">Lab. Cómputo</option>
                            <option value="laboratorio_practica">Lab. Práctica</option>
                          </select>
                          <input type="number" placeholder="Aforo" value={newRoom.capacity} onChange={e => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 30 })} min="5" max="500" />
                          <button type="button" className="btn-add-sm" onClick={() => addRoom(bi, fi)} title="Agregar salón">+</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Formulario para agregar piso a este edificio */}
                  <div className="floor-add-row">
                    <input type="number" placeholder="N° de piso (ej: 1, 2, 3)" value={newFloor.floorNumber} onChange={e => setNewFloor({ ...newFloor, floorNumber: parseInt(e.target.value) || 1 })} min="1" max="50" />
                    <button type="button" className="btn-add-floor" onClick={() => addFloor(bi)}>+ Agregar piso</button>
                  </div>
                </div>
              </div>
            ))}

            {form.buildings?.length === 0 && (
              <div className="card" style={{ padding: '1rem', textAlign: 'center', marginTop: '0.5rem' }}>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                  Usa el formulario de arriba para agregar edificios al campus.
                </p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">{editing ? 'Guardar cambios' : 'Crear Campus'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
