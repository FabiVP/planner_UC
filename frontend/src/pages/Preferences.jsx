import { useState, useEffect } from 'react';
import api from '../api/axios';
import './Preferences.css';

const DAYS_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_KEYS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
const SHIFTS = [
  { key: 'manana', label: 'Mañana', sub: '07:00 - 13:00' },
  { key: 'tarde', label: 'Tarde', sub: '14:00 - 19:00' },
  { key: 'noche', label: 'Noche', sub: '19:00 - 22:00' },
];

export default function Preferences() {
  const [tab, setTab] = useState('disponibilidad');
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadPreferences(); }, []);

  const loadPreferences = async () => {
    try {
      const res = await api.get('/preferences');
      setPrefs(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleAvailability = (shift, day) => {
    setPrefs(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [shift]: { ...prev.availability[shift], [day]: !prev.availability?.[shift]?.[day] }
      }
    }));
  };

  const toggleAdditional = (key) => {
    setPrefs(prev => ({
      ...prev,
      additionalPreferences: { ...prev.additionalPreferences, [key]: !prev.additionalPreferences?.[key] }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/preferences', prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="preferences-page animate-fadeIn">
      <div className="page-header">
        <h1>Preferencias</h1>
        <p>Configura tus preferencias para generar el mejor horario posible.</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'disponibilidad' ? 'active' : ''}`} onClick={() => setTab('disponibilidad')}>Disponibilidad</button>
        <button className={`tab ${tab === 'adicionales' ? 'active' : ''}`} onClick={() => setTab('adicionales')}>Preferencias adicionales</button>
      </div>

      {tab === 'disponibilidad' && prefs && (
        <div className="card">
          <h3 className="card-title">Disponibilidad horaria</h3>
          <p className="card-subtitle">Selecciona los bloques de tiempo en los que prefieres tener clases.</p>

          <div className="pref-avail-grid">
            <div className="pref-avail-header">
              <span></span>
              {DAYS_LABELS.map(d => <span key={d}>{d}</span>)}
            </div>
            {SHIFTS.map(shift => (
              <div key={shift.key} className="pref-avail-row">
                <div className="pref-shift-label">
                  <strong>{shift.label}</strong>
                  <small>{shift.sub}</small>
                </div>
                {DAYS_KEYS.map(day => (
                  <label key={day} className="pref-check-cell">
                    <input
                      type="checkbox"
                      checked={prefs.availability?.[shift.key]?.[day] !== false}
                      onChange={() => toggleAvailability(shift.key, day)}
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>

          <h4 style={{ marginTop: 24 }}>Preferencias adicionales</h4>
          <div className="pref-additional-grid">
            {[
              { key: 'avoidBefore8am', label: 'Evitar clases antes de las 8:00 a.m.', icon: '🌅' },
              { key: 'avoidGaps', label: 'Evitar huecos entre clases', icon: '⏱️' },
              { key: 'preferFewerDays', label: 'Preferir días con menos carga académica', icon: '📅' },
              { key: 'groupSameSubjectConsecutive', label: 'Agrupar clases de la misma materia en días consecutivos', icon: '📚' },
            ].map(p => (
              <label key={p.key} className="pref-toggle-item">
                <span className="pref-toggle-icon">{p.icon}</span>
                <span>{p.label}</span>
                <input
                  type="checkbox"
                  checked={prefs.additionalPreferences?.[p.key] || false}
                  onChange={() => toggleAdditional(p.key)}
                />
              </label>
            ))}
          </div>

          <div className="pref-actions">
            <button className="btn btn-ghost" onClick={loadPreferences}>Restablecer</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar preferencias'}
            </button>
          </div>
        </div>
      )}

      {tab === 'adicionales' && prefs && (
        <div className="card">
          <h3 className="card-title">Preferencia de horario</h3>
          <div className="pref-shift-options">
            {[
              { value: 'manana', label: 'Mañana', desc: '07:00 - 13:00' },
              { value: 'tarde', label: 'Tarde', desc: '14:00 - 19:00' },
              { value: 'noche', label: 'Noche', desc: '19:00 - 22:00' },
              { value: 'indiferente', label: 'Indiferente', desc: 'Sin preferencia' },
            ].map(s => (
              <label key={s.value} className={`pref-shift-option ${prefs.preferredShift === s.value ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="shift"
                  value={s.value}
                  checked={prefs.preferredShift === s.value}
                  onChange={() => setPrefs(prev => ({ ...prev, preferredShift: s.value }))}
                />
                <div>
                  <strong>{s.label}</strong>
                  <small>{s.desc}</small>
                </div>
              </label>
            ))}
          </div>

          <div className="pref-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar preferencias'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
