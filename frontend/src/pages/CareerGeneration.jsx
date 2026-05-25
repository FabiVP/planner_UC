import { useState, useEffect } from 'react';
import api from '../api/axios';
import { CURRENT_SEMESTER_DASH } from '../utils/constants';
import {
  HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineExclamationCircle,
  HiOutlineCheckCircle, HiOutlineRefresh, HiOutlineClock
} from 'react-icons/hi';
import './CareerGeneration.css';

const SECTION_LETTERS = 'ABCDEFGHIJ'.split('');

export default function CareerGeneration() {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [semester, setSemester] = useState(CURRENT_SEMESTER_DASH);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewSemester, setViewSemester] = useState(null);

  useEffect(() => { loadCareers(); }, []);

  const loadCareers = async () => {
    try {
      const r = await api.get('/careers');
      setCareers(r.data.careers || r.data || []);
    } catch (e) { console.error(e); }
  };

  const handleGenerate = async () => {
    if (!selectedCareer) return;
    setGenerating(true);
    setResult(null);
    setSections([]);
    try {
      const r = await api.post('/generations/career', { careerId: selectedCareer, semester });
      setResult(r.data);
      if (r.data.success) loadSections();
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
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const semesters = [...new Set(sections.map(s => s.courseSemester))].sort((a, b) => a - b);
  const filteredSections = viewSemester
    ? sections.filter(s => s.courseSemester === viewSemester)
    : sections;

  const careerName = careers.find(c => c._id === selectedCareer)?.name || '';

  return (
    <div className="career-gen-page animate-fadeIn">
      <div className="page-header">
        <h1><HiOutlineAcademicCap /> Generación por Carrera</h1>
        <p>Seleccione una carrera para generar horarios de todos los semestres con secciones múltiples.</p>
      </div>

      {/* Controls */}
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

      {/* Result */}
      {result && (
        <div className={`card gen-result ${result.success ? 'success' : 'error'}`}>
          <div className="gen-result-header">
            {result.success ? <HiOutlineCheckCircle className="result-icon success" /> : <HiOutlineExclamationCircle className="result-icon error" />}
            <div>
              <h3>{result.success ? '¡Horarios generados exitosamente!' : 'No se pudo completar la generación'}</h3>
              <p>{result.message || `${result.sections} secciones creadas para ${careerName}`}</p>
            </div>
          </div>
          {result.success && (
            <div className="gen-stats">
              <div className="gen-stat">
                <span className="gen-stat-value">{result.generation?.sectionsGenerated || 0}</span>
                <span className="gen-stat-label">Secciones</span>
              </div>
              <div className="gen-stat">
                <span className="gen-stat-value">{result.generation?.qualityScore || 0}</span>
                <span className="gen-stat-label">Puntaje</span>
              </div>
              <div className="gen-stat">
                <span className="gen-stat-value">{result.generation?.executionTime?.toFixed(1) || 0}s</span>
                <span className="gen-stat-label">Tiempo</span>
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
    </div>
  );
}
