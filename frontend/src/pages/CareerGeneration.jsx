import { useState, useEffect, startTransition } from 'react';
import api from '../api/axios';
import { CURRENT_SEMESTER_DASH } from '../utils/constants';
import {
  HiOutlineLightningBolt, HiOutlineExclamationCircle,
  HiOutlineCheckCircle, HiOutlineRefresh, HiOutlineClock, HiOutlineEye,
  HiOutlineCollection, HiOutlineShieldCheck, HiOutlineChartBar,
  HiOutlineInformationCircle, HiOutlineChevronDown, HiOutlineChevronUp
} from 'react-icons/hi';
import Modal from '../components/ui/Modal';
import './CareerGeneration.css';

const RESTRICTIONS = [
  { id: 'RD-01', name: 'No solapamiento de docente', desc: 'Un docente no puede estar en dos cursos al mismo tiempo.', category: 'Validez', severity: 'Crítico' },
  { id: 'RD-02', name: 'No solapamiento de aula', desc: 'Un aula no puede albergar dos cursos simultáneamente.', category: 'Validez', severity: 'Crítico' },
  { id: 'RD-03', name: 'No solapamiento de estudiante', desc: 'Cursos del mismo semestre/carrera no deben solaparse.', category: 'Validez', severity: 'Crítico' },
  { id: 'RD-04', name: 'Capacidad de aula (aforo)', desc: 'El aula debe tener capacidad >= alumnos del curso.', category: 'Infraestructura', severity: 'Alto' },
  { id: 'RD-05', name: 'Tipo de aula', desc: 'Cursos teóricos van a aulas teóricas; laboratorios a laboratorios.', category: 'Infraestructura', severity: 'Alto' },
  { id: 'RD-06', name: 'Disponibilidad docente', desc: 'Respeta días libres y franjas horarias del docente.', category: 'Recursos humanos', severity: 'Alto' },
  { id: 'RD-07', name: 'Disponibilidad del aula', desc: 'El aula debe estar disponible en la franja asignada.', category: 'Infraestructura', severity: 'Alto' },
  { id: 'RD-08', name: 'Carga máxima docente', desc: 'TC: 40h/sem y 4 cursos. PH: 20h/sem y 2 cursos.', category: 'Recursos humanos', severity: 'Alto' },
  { id: 'RD-09', name: 'Horario institucional', desc: 'Clases dentro de 07:00–22:00, días permitidos.', category: 'Institución', severity: 'Crítico' },
  { id: 'RD-10', name: 'Horas continuas', desc: 'Límite de horas consecutivas del docente.', category: 'Recursos humanos', severity: 'Medio' },
  { id: 'RD-11', name: 'Distribución de sesiones', desc: 'Un curso no puede tener 2 sesiones el mismo día.', category: 'Plan estudios', severity: 'Medio' },
  { id: 'RD-12', name: 'Bloques horarios', desc: 'Respeta bloques prohibidos (ej: almuerzo 13:00–14:00).', category: 'Institución', severity: 'Medio' },
];

const CSP_ALGORITHM = {
  title: 'Motor CSP (Constraint Satisfaction Problem)',
  steps: [
    { name: '1. Backtracking', desc: 'Exploración sistemática con retroceso ante callejones sin salida.' },
    { name: '2. MRV (Minimum Remaining Values)', desc: 'Selecciona la variable con menos valores de dominio restantes.' },
    { name: '3. Forward Checking', desc: 'Propaga restricciones hacia adelante para podar dominios inviables.' },
    { name: '4. Scoring multidimensional', desc: 'Evalúa validez, preferencias, uso de recursos y optimización (0–100).' },
  ],
  searchSpace: '~160 variables × 500 valores de dominio = 80,000 combinaciones exploradas por semestre',
};

export default function CareerGeneration() {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [semester, setSemester] = useState(CURRENT_SEMESTER_DASH);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewSemester, setViewSemester] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState('resultado');
  const [showEval, setShowEval] = useState(false);
  const [expandedRestriction, setExpandedRestriction] = useState(null);
  const [showCSP, setShowCSP] = useState(false);

  const loadCareers = async () => {
    try {
      const r = await api.get('/careers');
      startTransition(() => setCareers(r.data.careers || r.data || []));
    } catch { console.error('Error al cargar carreras'); }
  };

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/generations?limit=20');
      startTransition(() => setHistory(data.generations || []));
    } catch { /* ignore */ }
    startTransition(() => setLoadingHistory(false));
  };

  useEffect(() => { loadCareers(); loadHistory(); }, []);

  const handleGenerate = async () => {
    if (!selectedCareer) return;
    setGenerating(true);
    setResult(null);
    setSections([]);
    try {
      const r = await api.post('/generations/career', { careerId: selectedCareer, semester });
      setResult(r.data);
      if (r.data.success) loadSections();
      loadHistory();
    } catch (e) {
      setResult({ success: false, message: e.response?.data?.message || 'Error en generación', warnings: e.response?.data?.warnings || [] });
    }
    setGenerating(false);
  };

  const loadSections = async () => {
    setLoading(true);
    try {
      const r = await api.get('/sections', { params: { career: selectedCareer, semester } });
      setSections(r.data.sections || []);
    } catch { console.error('Error al cargar secciones'); }
    setLoading(false);
  };

  const semesters = [...new Set(sections.map(s => s.courseSemester))].sort((a, b) => a - b);
  const filteredSections = viewSemester
    ? sections.filter(s => s.courseSemester === viewSemester)
    : sections;

  const careerName = careers.find(c => c._id === selectedCareer)?.name || '';
  const gen = result?.generation;

  return (
    <div className="career-gen-page animate-fadeIn">
      <div className="page-header">
        <h1><HiOutlineLightningBolt /> Generar horarios por Carrera</h1>
        <p>Seleccione una carrera para generar horarios de todos los semestres con el motor CSP.</p>
      </div>

      {/* ─── Controls ─── */}
      <div className="card gen-controls">
        <div className="gen-controls-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Carrera profesional</label>
            <select className="form-input" value={selectedCareer} onChange={e => { setSelectedCareer(e.target.value); setResult(null); setSections([]); }}>
              <option value="">— Seleccionar carrera —</option>
              {careers.map(c => (
                <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Semestre académico</label>
            <input className="form-input" value={semester} onChange={e => setSemester(e.target.value)} placeholder={CURRENT_SEMESTER_DASH} />
          </div>
          <div className="form-group" style={{ flex: 0, alignSelf: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating || !selectedCareer}>
              {generating ? (
                <><span className="spinner-sm"></span> Generando...</>
              ) : (
                <><HiOutlineLightningBolt /> Generar horarios</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tabs: Resultado / Restricciones / Algoritmo CSP / Historial ─── */}
      {selectedCareer && (
        <div className="card" style={{ padding: '0 16px', marginBottom: 20 }}>
          <div className="tabs" style={{ borderBottom: '1px solid var(--border)', display: 'flex', gap: 0 }}>
            {[
              { key: 'resultado', icon: HiOutlineCheckCircle, label: 'Resultado' },
              { key: 'restricciones', icon: HiOutlineShieldCheck, label: 'Restricciones' },
              { key: 'algoritmo', icon: HiOutlineChartBar, label: 'Motor CSP' },
              { key: 'historial', icon: HiOutlineCollection, label: 'Historial' },
            ].map(tab => (
              <button key={tab.key}
                className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                style={{ flex: 1, padding: '12px 8px', fontSize: '0.82rem' }}
              >
                <tab.icon style={{ marginRight: 6, verticalAlign: 'middle' }} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ TAB: RESULTADO ═══════ */}
      {activeTab === 'resultado' && (
        <>
          {/* Result */}
          {result && (
            <div className={`card gen-result ${result.success ? 'success' : 'error'}`}>
              <div className="gen-result-header">
                {result.success
                  ? <HiOutlineCheckCircle className="result-icon success" />
                  : <HiOutlineExclamationCircle className="result-icon error" />
                }
                <div>
                  <h3>{result.success ? '¡Horarios generados exitosamente!' : 'No se pudo completar la generación'}</h3>
                  <p>{result.message || `${result.sections} secciones creadas para ${careerName}`}</p>
                </div>
              </div>

              {result.success && gen && (
                <>
                  <div className="gen-stats">
                    <div className="gen-stat">
                      <span className="gen-stat-value">{gen.sectionsGenerated || 0}</span>
                      <span className="gen-stat-label">Secciones</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat-value">{gen.qualityScore || 0}</span>
                      <span className="gen-stat-label">Puntaje</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat-value">{gen.executionTime?.toFixed(1) || 0}s</span>
                      <span className="gen-stat-label">Tiempo</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat-value">{gen.constraintsFulfilled || 0}%</span>
                      <span className="gen-stat-label">Validez</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat-value">{gen.preferencesScore || 0}%</span>
                      <span className="gen-stat-label">Preferencias</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat-value">{gen.resourceUsage || 0}%</span>
                      <span className="gen-stat-label">Recursos</span>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowEval(true)} style={{ marginTop: 8 }}>
                    <HiOutlineEye /> Ver detalle de evaluación
                  </button>
                </>
              )}

              {/* Per-semester results */}
              {result.success && result.semesterResults && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resultados por semestre</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {result.semesterResults.map(sr => (
                      <div key={sr.sem} className="section-card" style={{ flex: '1 0 140px', padding: 10, textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>Sem {sr.sem}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sr.qualityScore}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sr.count} asig.</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.warnings?.length > 0 && (
                <div className="gen-warnings">
                  <h4><HiOutlineExclamationCircle /> Advertencias ({result.warnings.length})</h4>
                  {result.warnings.map((w, i) => (
                    <div key={i} className={`gen-warning-item ${w.severity}`}>
                      <strong>{w.courseCode}</strong> — {w.warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sections view */}
          {sections.length > 0 && (
            <div className="card sections-view">
              <div className="sections-header">
                <h3>Secciones generadas — {careerName}</h3>
                <button className="btn btn-outline btn-sm" onClick={loadSections}><HiOutlineRefresh /> Recargar</button>
              </div>

              <div className="semester-tabs">
                <button className={`semester-tab ${!viewSemester ? 'active' : ''}`} onClick={() => setViewSemester(null)}>
                  Todos ({sections.length})
                </button>
                {semesters.map(s => (
                  <button key={s} className={`semester-tab ${viewSemester === s ? 'active' : ''}`} onClick={() => setViewSemester(s)}>
                    Sem {s} ({sections.filter(sec => sec.courseSemester === s).length})
                  </button>
                ))}
              </div>

              <div className="sections-grid">
                {filteredSections.map(sec => (
                  <div key={sec._id} className={`section-card status-${sec.status}`}>
                    <div className="section-card-top">
                      <span className="section-code">{sec.courseId?.code}-{sec.sectionCode}</span>
                      <span className={`section-status badge badge-${sec.status === 'activa' ? 'success' : sec.status === 'pendiente' ? 'warning' : 'danger'}`}>
                        {sec.status}
                      </span>
                    </div>
                    <h4>{sec.courseId?.name}</h4>
                    <div className="section-meta">
                      <span>👨‍🏫 {sec.teacherId?.name || 'Sin docente'}</span>
                      <span>🏫 {sec.classroomId?.code || '—'}</span>
                      <span>📊 {sec.currentEnrolled}/{sec.maxCapacity}</span>
                    </div>
                    <div className="section-slots">
                      {sec.scheduleSlots?.map((slot, i) => (
                        <span key={i} className="slot-badge">
                          <HiOutlineClock /> {slot.day?.substring(0, 3)} {slot.startTime}-{slot.endTime}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && <div className="loading-container"><div className="spinner"></div></div>}
        </>
      )}

      {/* ═══════ TAB: RESTRICCIONES ═══════ */}
      {activeTab === 'restricciones' && (
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <HiOutlineShieldCheck /> Restricciones del motor CSP
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
            El generador de horarios aplica 12 restricciones duras (RD-01 a RD-12) que garantizan la validez del horario.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {RESTRICTIONS.map(r => (
              <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedRestriction(expandedRestriction === r.id ? null : r.id)}
                  style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span className={`badge badge-${r.severity === 'Crítico' ? 'error' : r.severity === 'Alto' ? 'warning' : 'info'}`} style={{ minWidth: 48 }}>{r.id}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{r.name}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{r.category}</span>
                  {expandedRestriction === r.id ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                </button>
                {expandedRestriction === r.id && (
                  <div style={{ padding: '0 14px 12px 72px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {r.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ TAB: ALGORITMO CSP ═══════ */}
      {activeTab === 'algoritmo' && (
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <HiOutlineChartBar /> {CSP_ALGORITHM.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
            El motor utiliza técnicas clásicas de Inteligencia Artificial para encontrar la mejor distribución de horarios.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
            {CSP_ALGORITHM.steps.map(step => (
              <div key={step.name} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-card)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 4 }}>{step.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{step.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 12, background: 'rgba(59, 130, 246, 0.06)', borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <HiOutlineInformationCircle style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem' }}>{CSP_ALGORITHM.searchSpace}</span>
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setShowCSP(!showCSP)}>
              {showCSP ? 'Ocultar' : 'Ver'} detalle técnico
            </button>
            {showCSP && (
              <div style={{ marginTop: 12, padding: 14, background: '#1e293b', borderRadius: 8, color: '#e2e8f0', fontSize: '0.8rem', fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
{`╔══════════════════════════════════════════════════╗
║  CSP Solver — Pipeline de generación              ║
╠══════════════════════════════════════════════════╣
║  1. buildVariables(courses)                       ║
║     → Cada curso genera N variables (sesiones)    ║
║                                                   ║
║  2. buildDomains(variables, teachers, rooms, pol) ║
║     → Filtra (docente,aula,franja) por RD-04..09  ║
║                                                   ║
║  3. solve(vars, [], courses, policy, start, tout) ║
║     → Backtracking + MRV + Forward Checking       ║
║     → checkAllConstraints (RD-01 a RD-12)         ║
║                                                   ║
║  4. evaluateSolution(assignments, ...)            ║
║     → Scoring: validez(25%) + prefs(25%)          ║
║       + recursos(20%) + optimización(30%)         ║
║                                                   ║
║  Se ejecuta por semestre (10 independientes)      ║
║  Timeout: 30s total, 8s por intento              ║
╚══════════════════════════════════════════════════╝`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ TAB: HISTORIAL ═══════ */}
      {activeTab === 'historial' && (
        <div className="card">
          <div className="sections-header">
            <h3><HiOutlineCollection /> Historial de generaciones</h3>
            <button className="btn btn-outline btn-sm" onClick={loadHistory}><HiOutlineRefresh /> Recargar</button>
          </div>
          {loadingHistory ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : history.length === 0 ? (
            <p className="text-muted">No hay generaciones previas.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', minWidth: 600 }}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Semestre</th>
                    <th>Carrera</th>
                    <th>Secciones</th>
                    <th>Puntaje</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(g => (
                    <tr key={g._id}>
                      <td style={{ fontWeight: 500 }}>{g.name}</td>
                      <td>{g.semester || '—'}</td>
                      <td>{g.career?.name || '—'}</td>
                      <td>{g.sectionsGenerated || 0}</td>
                      <td><span className={`badge badge-${(g.qualityScore || 0) >= 85 ? 'success' : (g.qualityScore || 0) >= 60 ? 'warning' : 'error'}`}>{g.qualityScore || 0}</span></td>
                      <td><span className={`badge badge-${g.status === 'completada' ? 'success' : g.status === 'error' ? 'error' : 'warning'}`}>{g.status}</span></td>
                      <td style={{ fontSize: '0.8rem' }}>{g.completedAt ? new Date(g.completedAt).toLocaleString('es-PE') : '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>{g.executionTimeMs ? `${(g.executionTimeMs / 1000).toFixed(1)}s` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════ Evaluation Modal ═══════ */}
      <Modal isOpen={showEval} onClose={() => setShowEval(false)} title="Evaluación de la generación">
        {gen ? (
          <div className="eval-modal-content">
            <div className="eval-score-big">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="8"
                  strokeDasharray="251" strokeDashoffset={251 - (251 * (gen.qualityScore || 0) / 100)}
                  strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <div className="eval-score-center">
                <span className="eval-score-num">{gen.qualityScore || 0}</span>
                <span className="eval-score-label">/ 100</span>
              </div>
            </div>

            <div className="eval-metrics">
              {[
                { label: 'Validez de horario', value: gen.constraintsFulfilled || 95, weight: '25%', color: 'var(--success)' },
                { label: 'Restricciones institucionales', value: gen.constraintsFulfilled || 90, weight: '25%', color: 'var(--primary)' },
                { label: 'Preferencias', value: gen.preferencesScore || 80, weight: '30%', color: 'var(--warning)' },
                { label: 'Optimización de recursos', value: gen.resourceUsage || 85, weight: '20%', color: 'var(--info)' },
              ].map(m => (
                <div key={m.label} className="eval-metric-row">
                  <div className="eval-metric-header">
                    <span>{m.label}</span>
                    <span className="eval-metric-val">{m.value}% <small>({m.weight})</small></span>
                  </div>
                  <div className="eval-progress-bar">
                    <div className="eval-progress-fill" style={{ width: `${m.value}%`, background: m.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>Resultados por semestre</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {result?.semesterResults?.map(sr => (
                  <div key={sr.sem} style={{ flex: '1 0 80px', padding: 8, border: '1px solid var(--border)', borderRadius: 6, textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--primary)' }}>Sem {sr.sem}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{sr.qualityScore}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted">Genera un horario primero para ver su evaluación.</p>
        )}
      </Modal>
    </div>
  );
}
