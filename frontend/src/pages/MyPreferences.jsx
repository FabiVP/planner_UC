import { useState, useEffect, startTransition } from 'react';
import api from '../api/axios';
import {
  HiOutlineSun, HiOutlineBriefcase, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineExclamationCircle,
  HiOutlineInformationCircle, HiOutlineAdjustments
} from 'react-icons/hi';

const SHIFTS = [
  { value: 'manana', label: 'Mañana', desc: '07:00 – 13:00' },
  { value: 'tarde', label: 'Tarde', desc: '13:00 – 19:00' },
  { value: 'noche', label: 'Noche', desc: '19:00 – 22:00' },
  { value: 'indiferente', label: 'Indiferente', desc: 'Sin preferencia' }
];

const DAY_LABELS = {
  lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom'
};

const SHIFT_LABELS = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };

export default function MyPreferences() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [preferredShift, setPreferredShift] = useState('indiferente');
  const [worksWhileStudying, setWorksWhileStudying] = useState(false);
  const [availability, setAvailability] = useState({
    manana: { lun: true, mar: true, mie: true, jue: true, vie: true },
    tarde: { lun: true, mar: true, mie: true, jue: true, vie: true },
    noche: { lun: false, mar: false, mie: false, jue: false, vie: false }
  });
  const [additionalPrefs, setAdditionalPrefs] = useState({
    avoidBefore8am: true,
    avoidGaps: true,
    preferFewerDays: true,
    groupSameSubjectConsecutive: false
  });
  const [priorityOrder, setPriorityOrder] = useState(['conflicts', 'institutional', 'gaps', 'personal']);

  const loadPrefs = async () => {
    try {
      const res = await api.get('/preferences');
      const p = res.data;
      startTransition(() => {
        if (p.preferredShift) setPreferredShift(p.preferredShift);
        if (p.worksWhileStudying !== undefined) setWorksWhileStudying(p.worksWhileStudying);
        if (p.availability) setAvailability(prev => ({ ...prev, ...p.availability }));
        if (p.additionalPreferences) setAdditionalPrefs(p.additionalPreferences);
        if (p.priorityOrder) setPriorityOrder(p.priorityOrder);
      });
    } catch { setError('No se pudieron cargar tus preferencias.'); }
    startTransition(() => setLoading(false));
  };

  useEffect(() => { loadPrefs(); }, []);

  const toggleAvail = (shift, day) => {
    setAvailability(prev => ({
      ...prev,
      [shift]: { ...prev[shift], [day]: !prev[shift][day] }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/preferences', {
        preferredShift,
        worksWhileStudying,
        availability,
        additionalPreferences: additionalPrefs,
        priorityOrder
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert(e.response?.data?.message || 'Error al guardar preferencias');
    }
    setSaving(false);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="card" style={{ padding: 20 }}><p className="text-muted">{error}</p></div>;

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <h1><HiOutlineAdjustments /> Mis Preferencias</h1>
        <p>Configura tus preferencias horarias para obtener sugerencias de horario personalizadas al planificar tu matrícula.</p>
      </div>

      <div className="info-banner" style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <HiOutlineInformationCircle style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Estas preferencias se usan al generar tu horario personalizado. No afectan el horario institucional global.
        </div>
      </div>

      {/* Turno preferido */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12, fontSize: '1rem' }}><HiOutlineSun /> Turno preferido</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Selecciona en qué turno prefieres llevar tus clases.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 8 }}>
          {SHIFTS.map(s => (
            <button key={s.value} className={`btn ${preferredShift === s.value ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '12px 8px', textAlign: 'center' }}
              onClick={() => setPreferredShift(s.value)}>
              <div style={{ fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Trabaja mientras estudia */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8, fontSize: '1rem' }}><HiOutlineBriefcase /> Trabajo y estudio</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={worksWhileStudying}
            onChange={e => setWorksWhileStudying(e.target.checked)}
            style={{ width: 18, height: 18 }} />
          <div>
            <strong>Trabajo mientras estudio</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Si trabajas, el sistema priorizará horarios que no afecten tu disponibilidad.
            </p>
          </div>
        </label>
      </div>

      {/* Disponibilidad semanal */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12, fontSize: '1rem' }}><HiOutlineClock /> Disponibilidad semanal</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Marca las franjas horarias en las que estás disponible para llevar clases.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>Turno</th>
                {Object.entries(DAY_LABELS).map(([key, label]) => (
                  <th key={key} style={{ padding: '8px 4px', borderBottom: '2px solid var(--border)', textAlign: 'center', fontSize: 12 }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['manana', 'tarde', 'noche'].map(shift => (
                <tr key={shift}>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{SHIFT_LABELS[shift]}</td>
                  {Object.keys(DAY_LABELS).map(day => (
                    <td key={day} style={{ padding: '6px 4px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                      <button onClick={() => toggleAvail(shift, day)}
                        style={{
                          width: 32, height: 32, border: '2px solid',
                          borderColor: availability[shift]?.[day] ? 'var(--success)' : 'var(--border)',
                          borderRadius: 6, cursor: 'pointer',
                          background: availability[shift]?.[day] ? 'rgba(16,185,129,0.1)' : 'transparent',
                          fontSize: 16
                        }}>
                        {availability[shift]?.[day] ? '✓' : ''}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preferencias adicionales */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Preferencias adicionales</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'avoidBefore8am', label: 'Evitar clases antes de las 8:00 AM' },
            { key: 'avoidGaps', label: 'Evitar huecos entre clases' },
            { key: 'preferFewerDays', label: 'Preferir menos días con más clases' },
            { key: 'groupSameSubjectConsecutive', label: 'Agrupar sesiones de un mismo curso seguidas' },
          ].map(opt => (
            <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={additionalPrefs[opt.key]}
                onChange={e => setAdditionalPrefs(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: '0.9rem' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prioridades */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>Orden de prioridad</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Arrastra para reordenar (1 = más importante)
        </p>
        {priorityOrder.map((p, i) => (
          <div key={p} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
            marginBottom: 6, background: 'var(--bg-main)', borderRadius: 8,
            fontSize: '0.9rem'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', minWidth: 24 }}>{i + 1}</span>
            <span>{({
              conflicts: 'Evitar cruces de horario',
              institutional: 'Respetar horario institucional',
              gaps: 'Minimizar huecos',
              personal: 'Respetar preferencias personales'
            })[p]}</span>
          </div>
        ))}
      </div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        {saved && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <HiOutlineCheckCircle /> Guardado
        </span>}
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar preferencias'}
        </button>
      </div>
    </div>
  );
}
