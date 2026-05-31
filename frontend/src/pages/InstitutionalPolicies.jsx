import { useState, useEffect, startTransition } from 'react';
import api from '../api/axios';
import {
  HiOutlineCog, HiOutlineClock, HiOutlineUserGroup,
  HiOutlineOfficeBuilding, HiOutlineScale, HiOutlineSave,
  HiOutlineRefresh, HiOutlineInformationCircle
} from 'react-icons/hi';
import './InstitutionalPolicies.css';

const DAY_OPTIONS = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' }
];

export default function InstitutionalPolicies() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadPolicy = async () => {
    startTransition(() => setLoading(true));
    try {
      const r = await api.get('/policies/active');
      startTransition(() => setPolicy(r.data));
    } catch {
      // Create default if none exists
      try {
        const r = await api.post('/policies', {});
        startTransition(() => setPolicy(r.data.policy));
      } catch { /* ignore */ }
    }
    startTransition(() => setLoading(false));
  };

  useEffect(() => { loadPolicy(); }, []);

  const handleSave = async () => {
    if (!policy) return;
    setSaving(true);
    try {
      await api.put(`/policies/${policy._id}`, policy);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar');
    }
    setSaving(false);
  };

  const updateField = (path, value) => {
    setPolicy(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const toggleActiveDay = (day) => {
    const days = policy.allowedSchedule?.activeDays || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    updateField('allowedSchedule.activeDays', newDays);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!policy) return <div className="animate-fadeIn"><p>No se pudo cargar la política institucional.</p></div>;

  return (
    <div className="policies-page animate-fadeIn">
      <div className="page-actions">
        <div className="results-info">
          <span className="results-count">Política Institucional — {policy.semester}</span>
          {policy.active && <span className="badge badge-success">Activa</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={loadPolicy}><HiOutlineRefresh /> Recargar</button>
          <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`} onClick={handleSave} disabled={saving}>
            <HiOutlineSave /> {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div className="policy-grid">
        {/* Horarios permitidos */}
        <div className="card policy-card">
          <div className="policy-card-header">
            <HiOutlineClock className="policy-icon schedule" />
            <div>
              <h3>Horarios Permitidos</h3>
              <p>Ventana horaria y días activos de la institución</p>
            </div>
          </div>
          <div className="policy-card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Hora inicio</label>
                <input type="time" className="form-input"
                  value={policy.allowedSchedule?.startTime || '07:00'}
                  onChange={e => updateField('allowedSchedule.startTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Hora fin</label>
                <input type="time" className="form-input"
                  value={policy.allowedSchedule?.endTime || '22:00'}
                  onChange={e => updateField('allowedSchedule.endTime', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Días activos</label>
              <div className="day-selector">
                {DAY_OPTIONS.map(d => (
                  <button key={d.value} type="button"
                    className={`day-option ${(policy.allowedSchedule?.activeDays || []).includes(d.value) ? 'active' : ''}`}
                    onClick={() => toggleActiveDay(d.value)}
                  >
                    {d.label.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <h4 className="subsection-title">Definición de turnos</h4>
            {['manana', 'tarde', 'noche'].map(shift => (
              <div key={shift} className="shift-row">
                <span className="shift-label">{shift === 'manana' ? 'Mañana' : shift === 'tarde' ? 'Tarde' : 'Noche'}</span>
                <input type="time" className="form-input" value={policy.shifts?.[shift]?.start || ''}
                  onChange={e => updateField(`shifts.${shift}.start`, e.target.value)} />
                <span className="avail-separator">a</span>
                <input type="time" className="form-input" value={policy.shifts?.[shift]?.end || ''}
                  onChange={e => updateField(`shifts.${shift}.end`, e.target.value)} />
              </div>
            ))}

            <h4 className="subsection-title" style={{ marginTop: 16 }}>Bloques horarios bloqueados</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Franjas horarias donde no se permiten clases (ej: almuerzo).
            </p>
            {(policy.allowedSchedule?.blockedTimeSlots || []).map((slot, idx) => (
              <div key={idx} className="shift-row" style={{ marginBottom: 6 }}>
                <input type="time" className="form-input" value={slot.start || ''}
                  onChange={e => {
                    const slots = [...(policy.allowedSchedule?.blockedTimeSlots || [])];
                    slots[idx] = { ...slots[idx], start: e.target.value };
                    updateField('allowedSchedule.blockedTimeSlots', slots);
                  }} />
                <span className="avail-separator">a</span>
                <input type="time" className="form-input" value={slot.end || ''}
                  onChange={e => {
                    const slots = [...(policy.allowedSchedule?.blockedTimeSlots || [])];
                    slots[idx] = { ...slots[idx], end: e.target.value };
                    updateField('allowedSchedule.blockedTimeSlots', slots);
                  }} />
                <input type="text" className="form-input" placeholder="Razón" value={slot.reason || ''}
                  style={{ flex: 1, minWidth: 100 }}
                  onChange={e => {
                    const slots = [...(policy.allowedSchedule?.blockedTimeSlots || [])];
                    slots[idx] = { ...slots[idx], reason: e.target.value };
                    updateField('allowedSchedule.blockedTimeSlots', slots);
                  }} />
                <button className="btn btn-ghost btn-sm" style={{ color: '#dc2626' }}
                  onClick={() => {
                    const slots = (policy.allowedSchedule?.blockedTimeSlots || []).filter((_, i) => i !== idx);
                    updateField('allowedSchedule.blockedTimeSlots', slots);
                  }}>✕</button>
              </div>
            ))}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 6 }}
              onClick={() => {
                const slots = [...(policy.allowedSchedule?.blockedTimeSlots || []), { start: '13:00', end: '14:00', reason: 'Almuerzo' }];
                updateField('allowedSchedule.blockedTimeSlots', slots);
              }}>
              + Agregar bloque bloqueado
            </button>
          </div>
        </div>

        {/* Docentes Tiempo Completo */}
        <div className="card policy-card">
          <div className="policy-card-header">
            <HiOutlineUserGroup className="policy-icon teacher" />
            <div>
              <h3>Docentes Tiempo Completo (TC)</h3>
              <p>Límites de carga y reglas para docentes de TC</p>
            </div>
          </div>
          <div className="policy-card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Máx. horas/semana</label>
                <input type="number" className="form-input"
                  value={policy.teacherLimits?.maxWeeklyHoursFullTime || 40}
                  onChange={e => updateField('teacherLimits.maxWeeklyHoursFullTime', +e.target.value)} min="1" max="48" />
              </div>
              <div className="form-group">
                <label>Máx. cursos</label>
                <input type="number" className="form-input"
                  value={policy.teacherLimits?.maxCoursesFullTime || 4}
                  onChange={e => updateField('teacherLimits.maxCoursesFullTime', +e.target.value)} min="1" max="10" />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label>Descanso mín. entre clases (min)</label>
                <input type="number" className="form-input"
                  value={policy.teacherLimits?.minBreakBetweenClasses || 0}
                  onChange={e => updateField('teacherLimits.minBreakBetweenClasses', +e.target.value)} min="0" max="60" />
              </div>
              <div className="form-group">
                <label>Máx. horas continuas</label>
                <input type="number" className="form-input"
                  value={policy.teacherLimits?.maxContinuousHours || 4}
                  onChange={e => updateField('teacherLimits.maxContinuousHours', +e.target.value)} min="1" max="8" />
              </div>
            </div>
            <p className="form-hint" style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Las preferencias de los docentes TC se toman en cuenta, pero si existe conflicto con las reglas institucionales, prevalecen las de la universidad.
            </p>
          </div>
        </div>

        {/* Docentes Tiempo Parcial — preferencias SIEMPRE respetadas */}
        <div className="card policy-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="policy-card-header">
            <HiOutlineUserGroup className="policy-icon teacher" style={{ background: '#8b5cf6' }} />
            <div>
              <h3>Docentes Tiempo Parcial (PH)</h3>
              <p>Límites de carga, reglas y preferencias — se respetan SIEMPRE</p>
            </div>
          </div>
          <div className="policy-card-body">
            <div className="info-banner" style={{ marginBottom: 16, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <HiOutlineInformationCircle style={{ color: '#8b5cf6' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Las preferencias de los docentes PH tienen prioridad absoluta.</strong> A diferencia de los TC, las preferencias de disponibilidad, turno y tipo de curso de los docentes por horas se respetan obligatoriamente en la generación de horarios.
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Máx. horas/semana</label>
                <input type="number" className="form-input"
                  value={policy.teacherLimits?.maxWeeklyHoursPartTime || 20}
                  onChange={e => updateField('teacherLimits.maxWeeklyHoursPartTime', +e.target.value)} min="1" max="30" />
              </div>
              <div className="form-group">
                <label>Máx. cursos</label>
                <input type="number" className="form-input"
                  value={policy.teacherLimits?.maxCoursesPartTime || 2}
                  onChange={e => updateField('teacherLimits.maxCoursesPartTime', +e.target.value)} min="1" max="6" />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <h4 className="subsection-title">Reglas de asignación</h4>
              <div className="form-group">
                <label>Turnos permitidos para PH</label>
                <div className="day-selector">
                  {['manana', 'tarde', 'noche'].map(shift => (
                    <button key={shift} type="button"
                      className={`day-option ${(policy.partTimePreferences?.allowedShifts || []).includes(shift) ? 'active' : ''}`}
                      onClick={() => {
                        const current = policy.partTimePreferences?.allowedShifts || [];
                        const updated = current.includes(shift)
                          ? current.filter(s => s !== shift)
                          : [...current, shift];
                        updateField('partTimePreferences.allowedShifts', updated);
                      }}
                    >
                      {shift === 'manana' ? 'Mañana' : shift === 'tarde' ? 'Tarde' : 'Noche'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Tipos de curso permitidos para PH</label>
                <div className="day-selector">
                  {['teorico', 'laboratorio'].map(type => (
                    <button key={type} type="button"
                      className={`day-option ${(policy.partTimePreferences?.allowedCourseTypes || []).includes(type) ? 'active' : ''}`}
                      onClick={() => {
                        const current = policy.partTimePreferences?.allowedCourseTypes || [];
                        const updated = current.includes(type)
                          ? current.filter(t => t !== type)
                          : [...current, type];
                        updateField('partTimePreferences.allowedCourseTypes', updated);
                      }}
                    >
                      {type === 'teorico' ? 'Teórico' : 'Laboratorio'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Máx. días por semana para PH</label>
                <input type="number" className="form-input"
                  value={policy.partTimePreferences?.maxDaysPerWeek || 5}
                  onChange={e => updateField('partTimePreferences.maxDaysPerWeek', +e.target.value)}
                  min="1" max="7" />
              </div>
              <div className="toggle-row" style={{ marginTop: 12 }}>
                <label className="toggle-label">
                  <input type="checkbox"
                    checked={policy.partTimePreferences?.allowMultiShift !== false}
                    onChange={e => updateField('partTimePreferences.allowMultiShift', e.target.checked)} />
                  <span className="toggle-text">Permitir múltiples turnos para PH</span>
                </label>
              </div>
              <div className="toggle-row">
                <label className="toggle-label">
                  <input type="checkbox"
                    checked={policy.partTimePreferences?.prioritizeAfterFullTime !== false}
                    onChange={e => updateField('partTimePreferences.prioritizeAfterFullTime', e.target.checked)} />
                  <span className="toggle-text">Priorizar horarios PH después de TC</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Reglas de aulas */}
        <div className="card policy-card">
          <div className="policy-card-header">
            <HiOutlineOfficeBuilding className="policy-icon classroom" />
            <div>
              <h3>Reglas de Aulas</h3>
              <p>Restricciones de capacidad y tipo de infraestructura</p>
            </div>
          </div>
          <div className="policy-card-body">
            <div className="form-group">
              <label>Máx. uso de aforo (%)</label>
              <input type="range" className="form-range"
                value={policy.classroomRules?.maxCapacityUsagePercent || 100}
                onChange={e => updateField('classroomRules.maxCapacityUsagePercent', +e.target.value)}
                min="50" max="100" step="5" />
              <div className="range-labels">
                <span>50%</span>
                <strong>{policy.classroomRules?.maxCapacityUsagePercent || 100}%</strong>
                <span>100%</span>
              </div>
            </div>

            <div className="toggle-row">
              <label className="toggle-label">
                <input type="checkbox"
                  checked={policy.classroomRules?.strictTypeMatch !== false}
                  onChange={e => updateField('classroomRules.strictTypeMatch', e.target.checked)} />
                <span className="toggle-text">Coincidencia estricta tipo aula ↔ tipo curso</span>
              </label>
            </div>

            <div className="toggle-row">
              <label className="toggle-label">
                <input type="checkbox"
                  checked={policy.classroomRules?.allowVirtualClassrooms !== false}
                  onChange={e => updateField('classroomRules.allowVirtualClassrooms', e.target.checked)} />
                <span className="toggle-text">Permitir aulas virtuales para cursos teóricos</span>
              </label>
            </div>
          </div>
        </div>

        {/* Reglas de matrícula */}
        <div className="card policy-card">
          <div className="policy-card-header">
            <HiOutlineUserGroup className="policy-icon teacher" style={{ background: '#059669' }} />
            <div>
              <h3>Reglas de Matrícula</h3>
              <p>Límites de créditos por semestre y apertura de secciones</p>
            </div>
          </div>
          <div className="policy-card-body">
            <h4 className="subsection-title">Créditos por semestre</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Mín. créditos</label>
                <input type="number" className="form-input"
                  value={policy.enrollmentRules?.minCreditsPerSemester ?? 12}
                  onChange={e => updateField('enrollmentRules.minCreditsPerSemester', +e.target.value)} min="0" max="50" />
              </div>
              <div className="form-group">
                <label>Máx. créditos</label>
                <input type="number" className="form-input"
                  value={policy.enrollmentRules?.maxCreditsPerSemester ?? 25}
                  onChange={e => updateField('enrollmentRules.maxCreditsPerSemester', +e.target.value)} min="1" max="50" />
              </div>
            </div>
            <p className="form-hint" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              La suma de créditos de todos los cursos de un mismo semestre debe estar dentro de este rango (RD-14).
            </p>

            <h4 className="subsection-title" style={{ marginTop: 16 }}>Apertura de secciones</h4>
            <div className="form-group">
              <label>Mín. estudiantes por sección</label>
              <input type="number" className="form-input"
                value={policy.enrollmentRules?.minStudentsPerSection ?? 15}
                onChange={e => updateField('enrollmentRules.minStudentsPerSection', +e.target.value)} min="1" max="50" />
            </div>
            <p className="form-hint" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Si la demanda de un curso es menor a este número, la sección se crea como <strong>pendiente</strong> y no se genera horario.
            </p>

            <h4 className="subsection-title" style={{ marginTop: 16 }}>Modos de docente TC</h4>
            <div className="info-banner" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginTop: 8 }}>
              <HiOutlineInformationCircle style={{ color: '#059669' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Los docentes TC sin carga administrativa tienen <strong>36h</strong> de enseñanza semanales.
                Los TC con carga administrativa tienen <strong>24h</strong>. Esto se configura desde el perfil de cada docente y afecta la restricción RD-08.
              </div>
            </div>
          </div>
        </div>

        {/* Distribución de cursos */}
        <div className="card policy-card">
          <div className="policy-card-header">
            <HiOutlineCog className="policy-icon distribution" />
            <div>
              <h3>Distribución de Cursos</h3>
              <p>Reglas de distribución de sesiones y horarios</p>
            </div>
          </div>
          <div className="policy-card-body">
            <div className="toggle-row">
              <label className="toggle-label">
                <input type="checkbox"
                  checked={policy.courseDistribution?.preferNonConsecutiveDays !== false}
                  onChange={e => updateField('courseDistribution.preferNonConsecutiveDays', e.target.checked)} />
                <span className="toggle-text">Preferir días no consecutivos para sesiones</span>
              </label>
            </div>

            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Máx. sesiones del mismo curso por día</label>
              <input type="number" className="form-input"
                value={policy.courseDistribution?.maxSessionsPerCoursePerDay || 1}
                onChange={e => updateField('courseDistribution.maxSessionsPerCoursePerDay', +e.target.value)} min="1" max="3" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Evitar clases antes de</label>
                <input type="time" className="form-input"
                  value={policy.courseDistribution?.avoidBefore || ''}
                  onChange={e => updateField('courseDistribution.avoidBefore', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Evitar clases después de</label>
                <input type="time" className="form-input"
                  value={policy.courseDistribution?.avoidAfter || ''}
                  onChange={e => updateField('courseDistribution.avoidAfter', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Prioridades del scoring */}
        <div className="card policy-card full-width">
          <div className="policy-card-header">
            <HiOutlineScale className="policy-icon weights" />
            <div>
              <h3>Pesos del Motor de Evaluación</h3>
              <p>Jerarquía: Institucional &gt; Disponibilidad &gt; Preferencia docente &gt; Estudiante</p>
            </div>
          </div>
          <div className="policy-card-body">
            <div className="weights-grid">
              {[
                { key: 'institutional', label: 'Institucional', color: '#ef4444' },
                { key: 'validity', label: 'Validez', color: '#3b82f6' },
                { key: 'preferences', label: 'Preferencias', color: '#10b981' },
                { key: 'optimization', label: 'Optimización', color: '#f59e0b' }
              ].map(w => (
                <div key={w.key} className="weight-item">
                  <div className="weight-header">
                    <span className="weight-dot" style={{ background: w.color }}></span>
                    <span className="weight-label">{w.label}</span>
                    <strong className="weight-value">{Math.round((policy.priorityWeights?.[w.key] || 0.25) * 100)}%</strong>
                  </div>
                  <input type="range" className="form-range"
                    value={Math.round((policy.priorityWeights?.[w.key] || 0.25) * 100)}
                    onChange={e => updateField(`priorityWeights.${w.key}`, +(e.target.value / 100).toFixed(2))}
                    min="5" max="50" step="5"
                    style={{ accentColor: w.color }} />
                </div>
              ))}
            </div>
            <p className="form-hint" style={{ marginTop: 8, textAlign: 'center' }}>
              Suma actual: <strong>
                {Math.round(((policy.priorityWeights?.institutional || 0.25) +
                  (policy.priorityWeights?.validity || 0.25) +
                  (policy.priorityWeights?.preferences || 0.25) +
                  (policy.priorityWeights?.optimization || 0.25)) * 100)}%
              </strong> (ideal: 100%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
