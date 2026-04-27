import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/ui/StatCard';
import QualityChart from '../components/ui/QualityChart';
import AlertPanel from '../components/ui/AlertPanel';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineLightningBolt, HiOutlinePlay, HiOutlineCheckCircle } from 'react-icons/hi';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentGens, setRecentGens] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [latestSchedule, setLatestSchedule] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [dashRes, schedRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/schedule').catch(() => ({ data: { schedules: [] } }))
      ]);
      
      setStats(dashRes.data.stats);
      setRecentGens(dashRes.data.recentGenerations || []);
      setAlerts(dashRes.data.alerts || []);

      if (schedRes.data.schedules?.length > 0) {
        setLatestSchedule(schedRes.data.schedules[0]);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const s = stats || {
    courses: { active: 0, newThisWeek: 0 },
    teachers: { total: 0, withRestrictions: 0 },
    classrooms: { available: 0, maintenance: 0 },
    generations: { thisMonth: 0, successfulThisWeek: 0 }
  };

  const lastGen = recentGens[0];

  return (
    <>
      <Header title="Dashboard" subtitle="Resumen general del sistema" />
      
      <div className="dashboard-content">
        {/* Stat Cards Row */}
        <div className="stats-row">
          <StatCard
            icon={HiOutlineBookOpen}
            iconBg="var(--stat-purple)"
            title="Asignaturas"
            value={s.courses?.active || 0}
            label="Activas"
            subtitle={`${s.courses?.newThisWeek || 0} nuevas esta semana`}
          />
          <StatCard
            icon={HiOutlineUserGroup}
            iconBg="var(--stat-green)"
            title="Docentes"
            value={s.teachers?.total || 0}
            label="Disponibles"
            subtitle={`${s.teachers?.withRestrictions || 0} con restricciones`}
          />
          <StatCard
            icon={HiOutlineOfficeBuilding}
            iconBg="var(--stat-orange)"
            title="Aulas"
            value={s.classrooms?.available || 0}
            label="Disponibles"
            subtitle={`${s.classrooms?.maintenance || 0} en mantenimiento`}
          />
          <StatCard
            icon={HiOutlineLightningBolt}
            iconBg="var(--stat-blue)"
            title="Generaciones"
            value={s.generations?.thisMonth || 0}
            label="Este mes"
            subtitle={`${s.generations?.successfulThisWeek || 0} exitosas esta semana`}
          />
        </div>

        {/* Middle Section: Generation + Quality + Recent */}
        <div className="dashboard-middle">
          {/* Next Generation Panel */}
          <div className="card gen-panel">
            <h3 className="panel-title">
              <HiOutlinePlay className="panel-icon" /> Próxima generación
            </h3>
            <div className="gen-info">
              <div className="gen-detail">
                <span className="gen-label">Nombre</span>
                <span className="gen-value">{lastGen?.name || 'Horario Semestre 2025-II'}</span>
              </div>
              <div className="gen-detail">
                <span className="gen-label">Fecha programada</span>
                <span className="gen-value">
                  {lastGen?.scheduledDate 
                    ? new Date(lastGen.scheduledDate).toLocaleString() 
                    : new Date().toLocaleString()}
                </span>
              </div>
              <div className="gen-detail">
                <span className="gen-label">Estado</span>
                <span className={`badge badge-${lastGen?.status === 'completada' ? 'success' : 'info'}`}>
                  {lastGen?.status || 'Programada'}
                </span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg gen-btn" onClick={() => window.location.href = '/generation'}>
              <HiOutlinePlay /> Ejecutar generación
            </button>
          </div>

          {/* Quality Chart */}
          <QualityChart
            score={lastGen?.qualityScore || 92}
            metrics={{
              constraintsFulfilled: lastGen?.constraintsFulfilled || 98,
              preferencesScore: lastGen?.preferencesScore || 90,
              resourceUsage: lastGen?.resourceUsage || 85,
              loadDistribution: lastGen?.loadDistribution || 95,
            }}
          />

          {/* Recent Generations */}
          <div className="card recent-panel">
            <h3 className="panel-title">Generaciones recientes</h3>
            <div className="recent-list">
              {(recentGens.length > 0 ? recentGens.slice(0, 3) : [
                { name: 'Horario Semestre 2025-I', createdAt: new Date(), status: 'completada' },
                { name: 'Horario Verano 2025', createdAt: new Date(), status: 'completada' },
                { name: 'Prueba Escenario 3', createdAt: new Date(), status: 'fallida' },
              ]).map((gen, i) => (
                <div key={i} className="recent-item">
                  <div className="recent-item-icon">
                    <HiOutlineCheckCircle />
                  </div>
                  <div className="recent-item-info">
                    <span className="recent-item-name">{gen.name}</span>
                    <span className="recent-item-date">
                      {new Date(gen.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={`badge badge-${gen.status === 'completada' ? 'success' : gen.status === 'fallida' ? 'warning' : 'info'}`}>
                    {gen.status === 'completada' ? 'Óptimo' : gen.status === 'fallida' ? 'Con advertencias' : gen.status}
                  </span>
                </div>
              ))}
            </div>
            <a href="/schedules" className="view-all-link">Ver todas →</a>
          </div>
        </div>

        {/* Schedule Preview + Alerts */}
        <div className="dashboard-bottom">
          <div className="card schedule-preview-panel">
            <div className="schedule-preview-header">
              <h3>Vista previa de horario generado</h3>
              <div className="schedule-filters">
                <div className="filter-group">
                  <span className="filter-label">Carrera</span>
                  <select className="form-select">
                    <option>Ingeniería de Sistemas</option>
                  </select>
                </div>
                <div className="filter-group">
                  <span className="filter-label">Semestre</span>
                  <select className="form-select" style={{width: '80px'}}>
                    <option>5</option>
                    <option>3</option>
                    <option>7</option>
                  </select>
                </div>
                <div className="view-toggle">
                  <button className="toggle-btn active">Table</button>
                  <button className="toggle-btn">Calendario</button>
                </div>
              </div>
            </div>
            <ScheduleGrid
              assignments={latestSchedule?.assignments || []}
              onCellClick={cell => setSelectedCell(cell)}
            />
          </div>

          <AlertPanel alerts={alerts} />
        </div>
      </div>

      {/* Cell detail modal */}
      <Modal isOpen={!!selectedCell} onClose={() => setSelectedCell(null)} title="Detalle de Asignación">
        {selectedCell && (
          <div className="cell-detail-modal">
            <div className="detail-row">
              <span className="detail-label">Curso:</span>
              <span className="detail-value">{selectedCell.courseName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Docente:</span>
              <span className="detail-value">{selectedCell.teacherName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Aula:</span>
              <span className="detail-value">{selectedCell.classroomName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Horario:</span>
              <span className="detail-value">{selectedCell.day} {selectedCell.startTime} - {selectedCell.endTime}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
