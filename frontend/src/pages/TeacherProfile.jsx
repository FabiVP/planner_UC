import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineAcademicCap, HiOutlineClock, HiOutlineBriefcase,
  HiOutlinePlus, HiOutlineTrash, HiOutlineInformationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import './TeacherProfile.css';

const DAYS = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' }
];

const SHIFTS = [
  { value: 'manana', label: 'Mañana', desc: '07:00 – 13:00', icon: '🌅' },
  { value: 'tarde', label: 'Tarde', desc: '13:00 – 19:00', icon: '☀️' },
  { value: 'noche', label: 'Noche', desc: '19:00 – 22:00', icon: '🌙' },
  { value: 'indiferente', label: 'Indiferente', desc: 'Sin preferencia', icon: '🔄' }
];

export default function TeacherProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('availability');

  // Editable fields
  const [freeDays, setFreeDays] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [preferredShift, setPreferredShift] = useState('indiferente');
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    loadProfile();
    loadCourses();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/teachers/my-profile');
      const { teacher, summary: s } = res.data;
      setProfile(teacher);
      setSummary(s);
      setFreeDays(teacher.freeDays || []);
      setAvailability(teacher.availability || []);
      setPreferredShift(teacher.preferredShift || 'indiferente');
      setSpecializations((teacher.specializations || []).map(sp => sp._id || sp));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses || []);
    } catch (e) {}
  };

  const toggleFreeDay = (day) => {
    setFreeDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSpecialization = (courseId) => {
    setSpecializations(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const addAvailability = () => {
    setAvailability(prev => [...prev, { day: 'lunes', startTime: '07:00', endTime: '13:00' }]);
  };

  const updateAvailability = (index, field, value) => {
    setAvailability(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeAvailability = (index) => {
    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/teachers/my-profile', {
        freeDays,
        availability,
        preferredShift,
        specializations
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await loadProfile();
    } catch (e) {
      alert(e.response?.data?.message || 'Error al guardar');
    }
    setSaving(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (!profile) {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center' }}>
        <HiOutlineBriefcase style={{ fontSize: 48, color: 'var(--text-secondary)' }} />
        <h3 style={{ marginTop: 16 }}>Perfil de docente no encontrado</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          El coordinador debe crear tu perfil docente y vincularlo a tu cuenta de usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="teacher-profile-page animate-fadeIn">
      <div className="page-header">
        <h1>Mi Perfil Docente</h1>
        <p>Gestiona tu disponibilidad, preferencias y especialidades. Esta información es utilizada por el sistema para generar los horarios institucionales.</p>
      </div>

      {/* Hero: Identity + Summary */}
      <div className="tp-hero">
        <div className="card tp-identity">
          <div className="tp-avatar-large">{profile.name?.charAt(0) || 'D'}</div>
          <div className="tp-identity-info">
            <h2>{profile.name}</h2>
            <span className="tp-email">{profile.email || user?.email || '—'}</span>
            <span className={`tp-contract-badge-lg ${profile.contractType === 'tiempo_completo' ? 'tc' : 'ph'}`}>
              <HiOutlineBriefcase />
              {summary?.contractLabel || (profile.contractType === 'tiempo_completo' ? 'Tiempo Completo' : 'Por Horas')}
            </span>
          </div>
        </div>

        <div className="tp-summary-cards">
          <div className="card tp-summary-card">
            <span className="tp-sc-value">{summary?.maxCourses || profile.maxCourses}</span>
            <span className="tp-sc-label">Máx. cursos</span>
          </div>
          <div className="card tp-summary-card">
            <span className="tp-sc-value">{summary?.maxWeeklyHours || profile.maxWeeklyHours}h</span>
            <span className="tp-sc-label">Hrs/semana</span>
          </div>
          <div className="card tp-summary-card">
            <span className="tp-sc-value">{summary?.totalSpecializations || 0}</span>
            <span className="tp-sc-label">Especialidades</span>
          </div>
          <div className="card tp-summary-card">
            <span className="tp-sc-value">{summary?.shiftLabel || 'Indiferente'}</span>
            <span className="tp-sc-label">Turno</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="tp-notice">
        <HiOutlineInformationCircle />
        <div>
          <strong>Información visible para el administrador.</strong> El coordinador académico utilizará tus datos de disponibilidad, turno preferido y especialidades para la generación de los horarios del semestre. El tipo de contrato y límites de carga son definidos por el coordinador.
        </div>
      </div>

      {/* Tabs */}
      <div className="tp-tabs">
        <button className={`tp-tab ${activeTab === 'availability' ? 'active' : ''}`} onClick={() => setActiveTab('availability')}>
          <HiOutlineClock /> Disponibilidad
        </button>
        <button className={`tp-tab ${activeTab === 'specializations' ? 'active' : ''}`} onClick={() => setActiveTab('specializations')}>
          <HiOutlineAcademicCap /> Especialidades
        </button>
      </div>

      {/* ═══ TAB: Disponibilidad ═══ */}
      {activeTab === 'availability' && (
        <div className="card">
          {/* Preferred Shift */}
          <h3 className="card-title">Turno preferido</h3>
          <p className="card-subtitle">Selecciona el turno en el que prefieres dictar clases.</p>
          <div className="tp-shift-options">
            {SHIFTS.map(s => (
              <label key={s.value} className={`tp-shift-option ${preferredShift === s.value ? 'active' : ''}`}>
                <input
                  type="radio" name="shift" value={s.value}
                  checked={preferredShift === s.value}
                  onChange={() => setPreferredShift(s.value)}
                />
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <strong>{s.label}</strong>
                <small>{s.desc}</small>
              </label>
            ))}
          </div>

          {/* Free Days */}
          <h3 className="card-title" style={{ marginTop: 28 }}>Días libres</h3>
          <p className="card-subtitle">Selecciona los días en los que NO estás disponible para dictar clases.</p>
          <div className="tp-free-days">
            {DAYS.map(d => (
              <button
                key={d.value}
                type="button"
                className={`tp-free-day ${freeDays.includes(d.value) ? 'selected' : ''}`}
                onClick={() => toggleFreeDay(d.value)}
              >
                {freeDays.includes(d.value) ? '✕ ' : ''}{d.label}
              </button>
            ))}
          </div>

          {/* Detailed Availability Slots */}
          <h3 className="card-title" style={{ marginTop: 28 }}>Franjas de disponibilidad</h3>
          <p className="card-subtitle">Define las franjas horarias específicas en las que puedes dictar clases.</p>
          <div className="tp-avail-slots">
            {availability.map((slot, idx) => (
              <div key={idx} className="tp-avail-slot">
                <select
                  value={slot.day}
                  onChange={e => updateAvailability(idx, 'day', e.target.value)}
                >
                  {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <input
                  type="time" value={slot.startTime}
                  onChange={e => updateAvailability(idx, 'startTime', e.target.value)}
                />
                <span className="tp-avail-separator">a</span>
                <input
                  type="time" value={slot.endTime}
                  onChange={e => updateAvailability(idx, 'endTime', e.target.value)}
                />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeAvailability(idx)}>
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={addAvailability} style={{ alignSelf: 'flex-start' }}>
              <HiOutlinePlus /> Agregar franja
            </button>
          </div>

          <div className="tp-footer">
            <button className="btn btn-ghost" onClick={loadProfile}>Restablecer</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar disponibilidad'}
            </button>
          </div>
        </div>
      )}

      {/* ═══ TAB: Especialidades ═══ */}
      {activeTab === 'specializations' && (
        <div className="card">
          <h3 className="card-title">Cursos que puedo dictar</h3>
          <p className="card-subtitle">
            Selecciona los cursos en los que tienes especialidad o competencia para dictar. Esta información es esencial para que el coordinador pueda asignarte cursos de manera correcta.
          </p>

          <div className="tp-spec-grid">
            {courses.map(c => (
              <label key={c._id} className={`tp-spec-item ${specializations.includes(c._id) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={specializations.includes(c._id)}
                  onChange={() => toggleSpecialization(c._id)}
                />
                {specializations.includes(c._id) && <HiOutlineCheckCircle style={{ color: 'var(--primary)', fontSize: 18, flexShrink: 0 }} />}
                <span className="tp-spec-code">{c.code}</span>
                <span className="tp-spec-name">{c.name}</span>
                <span className="tp-spec-meta">Sem {c.semester} · {c.credits}cr</span>
              </label>
            ))}
            {courses.length === 0 && <p className="text-muted">No hay cursos registrados en el sistema.</p>}
          </div>

          <div style={{ margin: '16px 0', padding: '10px 14px', background: 'var(--surface)', borderRadius: 8, fontSize: '0.88rem' }}>
            <strong>{specializations.length}</strong> curso(s) seleccionado(s)
          </div>

          <div className="tp-footer">
            <button className="btn btn-ghost" onClick={loadProfile}>Restablecer</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar especialidades'}
            </button>
          </div>
        </div>
      )}

      {saved && <div className="tp-toast">✓ Perfil actualizado correctamente</div>}
    </div>
  );
}
