import { useState, useEffect } from 'react';
import api from '../api/axios';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineShieldCheck, HiOutlineInformationCircle } from 'react-icons/hi';
import './Restrictions.css';

const RESTRICTION_DETAILS = {
  'Créditos limitados': {
    detail: 'El sistema verifica que cada estudiante no supere el máximo de créditos permitidos por semestre (generalmente 22 créditos). Si un estudiante intenta inscribir más materias, el generador CSP descartará automáticamente las asignaturas de menor prioridad.',
    impact: 'Alto',
    category: 'Carga académica'
  },
  'Choque de horarios': {
    detail: 'Ningún docente, estudiante o aula puede tener dos asignaciones al mismo tiempo. El motor CSP evalúa cada combinación posible y elimina automáticamente las que generen conflicto temporal.',
    impact: 'Crítico',
    category: 'Validez'
  },
  'Requisitos de materia': {
    detail: 'Las materias con prerrequisitos solo pueden ser asignadas a estudiantes que hayan aprobado las materias previas correspondientes, según el plan de estudios vigente.',
    impact: 'Alto',
    category: 'Plan de estudios'
  },
  'Obligatoriedad': {
    detail: 'Las materias marcadas como obligatorias en el plan de estudios se incluyen con prioridad máxima antes de agregar electivas u opcionales al horario.',
    impact: 'Alto',
    category: 'Plan de estudios'
  },
  'Capacidad de aula': {
    detail: 'El sistema asigna aulas cuya capacidad sea igual o superior al número de estudiantes inscritos. No se permite superar el aforo máximo por seguridad.',
    impact: 'Medio',
    category: 'Infraestructura'
  },
  'Tipo de aula': {
    detail: 'Las materias de laboratorio se asignan únicamente a aulas de tipo laboratorio, y las teóricas a aulas regulares. Esto garantiza la disponibilidad de equipamiento adecuado.',
    impact: 'Medio',
    category: 'Infraestructura'
  },
  'Disponibilidad docente': {
    detail: 'El horario generado respeta la disponibilidad declarada por cada docente. Si un docente solo trabaja por las tardes, no se le asignarán clases en la mañana.',
    impact: 'Alto',
    category: 'Recursos humanos'
  },
  'Carga máxima docente': {
    detail: 'Cada docente tiene un límite de carga según su tipo de contrato. Tiempo Completo: máximo 40 horas/semana y 4 cursos. Por Horas: máximo 20 horas/semana y 2 cursos. Estas restricciones son institucionales y no pueden ser modificadas por el docente.',
    impact: 'Alto',
    category: 'Recursos humanos'
  },
  'Horario institucional': {
    detail: 'Todas las clases deben programarse dentro del rango horario institucional: de 7:00 a.m. a 10:00 p.m., de lunes a domingo. Ninguna asignación puede quedar fuera de esta ventana.',
    impact: 'Crítico',
    category: 'Horario'
  },
  'Horas continuas docente': {
    detail: 'Un docente no puede dictar más de 4 horas consecutivas de clase en un mismo día. El sistema distribuye automáticamente las asignaciones para evitar sobrecarga continua.',
    impact: 'Medio',
    category: 'Recursos humanos'
  },
  'Distribución de sesiones': {
    detail: 'Las sesiones del mismo curso deben programarse en días diferentes de la semana para favorecer el proceso de aprendizaje y evitar saturación.',
    impact: 'Medio',
    category: 'Calidad académica'
  },
  'Horario de almuerzo bloqueado': {
    detail: 'No se pueden programar clases entre la 1:00 p.m. y las 2:00 p.m. Este bloque horario está reservado institucionalmente como horario de almuerzo para toda la comunidad universitaria.',
    impact: 'Crítico',
    category: 'Horario'
  },
  'Vinculación tripartita': {
    detail: 'Solo se generan horarios para cursos que estén completamente vinculados en la cadena: administrador académico (creó y habilitó el curso) → docente asignado (tiene el curso en sus especialidades) → estudiantes (pueden matricularse). Los cursos sin docente asignado se excluyen automáticamente de la generación.',
    impact: 'Alto',
    category: 'Planificación'
  }
};

export default function Restrictions() {
  const [tab, setTab] = useState('institucionales');
  const [restrictions, setRestrictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/restrictions').then(res => {
      setRestrictions(res.data.restrictions || []);
      setLoading(false);
    }).catch(e => {
      setError(e.response?.data?.message || 'Error al cargar restricciones');
      setLoading(false);
    });
  }, []);

  const getKey = (r) => r._id || r.id;

  const filtered = restrictions.filter(r =>
    tab === 'institucionales' ? r.type === 'dura' : r.type === 'blanda'
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="restrictions-page animate-fadeIn">
      <div className="page-header">
        <h1>Restricciones</h1>
        <p>Estas son las reglas institucionales que rigen la generación del horario.</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'institucionales' ? 'active' : ''}`} onClick={() => setTab('institucionales')}>
          <HiOutlineShieldCheck /> Institucionales ({restrictions.filter(r => r.type === 'dura').length})
        </button>
        <button className={`tab ${tab === 'personales' ? 'active' : ''}`} onClick={() => setTab('personales')}>
          Personales ({restrictions.filter(r => r.type === 'blanda').length})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
        <div className="restrictions-list">
          {filtered.length === 0 ? (
            <div className="card empty-state">
              <h3>No hay restricciones {tab === 'personales' ? 'personales' : 'institucionales'}</h3>
              <p>Las restricciones se configuran desde el panel del coordinador.</p>
            </div>
          ) : filtered.map(r => {
            const details = RESTRICTION_DETAILS[r.rule] || {};
            const isExpanded = expandedId === getKey(r);
            return (
              <div key={getKey(r)} className={`restriction-card card ${isExpanded ? 'expanded' : ''}`}>
                <div className="restriction-header" onClick={() => toggleExpand(getKey(r))}>
                  <div className="restriction-info">
                    <div className="restriction-title-row">
                      <strong>{r.rule}</strong>
                      <span className={`badge ${r.active ? 'badge-active' : 'badge-inactive'}`}>
                        {r.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <p className="restriction-desc">{r.description}</p>
                  </div>
                  <button className="btn btn-ghost btn-sm expand-btn">
                    {isExpanded ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="restriction-detail animate-fadeIn">
                    <div className="detail-section">
                      <HiOutlineInformationCircle className="detail-icon" />
                      <div>
                        <h4>Detalle de la regla</h4>
                        <p>{details.detail || 'Esta restricción asegura la coherencia y validez del horario generado por el motor CSP.'}</p>
                      </div>
                    </div>
                    <div className="detail-tags">
                      {details.category && (
                        <span className="badge badge-info">{details.category}</span>
                      )}
                      {details.impact && (
                        <span className={`badge badge-${details.impact === 'Crítico' ? 'error' : details.impact === 'Alto' ? 'warning' : 'info'}`}>
                          Impacto: {details.impact}
                        </span>
                      )}
                      <span className="badge badge-success">
                        Tipo: {r.type === 'dura' ? 'Restricción dura (obligatoria)' : 'Restricción blanda (preferencia)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
