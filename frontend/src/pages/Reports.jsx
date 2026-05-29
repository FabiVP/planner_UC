import { useState, useEffect } from 'react';
import api from '../api/axios';
import { HiOutlineChartPie, HiOutlineDocumentReport, HiOutlineDownload, HiOutlineCheckCircle } from 'react-icons/hi';
import './Reports.css';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    api.get('/reports/summary').then(res => { setSummary(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 18;
      let y = 20;

      // ── Color palette ──
      const primary = [79, 70, 229];       // Indigo
      const primaryLight = [238, 242, 255]; // Light indigo bg
      const textDark = [30, 30, 46];
      const textMuted = [120, 120, 140];
      const success = [16, 185, 129];
      const white = [255, 255, 255];
      const borderColor = [226, 232, 240];

      // ── Header bar ──
      doc.setFillColor(...primary);
      doc.roundedRect(0, 0, pageWidth, 42, 0, 0, 'F');

      doc.setTextColor(...white);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('UniScheduler', margin, 18);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema Inteligente de Generación de Horarios', margin, 26);
      doc.setFontSize(9);
      doc.text('Universidad Continental · Taller de Proyectos 2', margin, 33);

      // Date on header right side
      doc.setFontSize(9);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth - margin, 18, { align: 'right' });
      doc.text(`Hora: ${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - margin, 25, { align: 'right' });

      y = 52;

      // ── Title ──
      doc.setTextColor(...textDark);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte Académico', margin, y);
      y += 4;
      doc.setDrawColor(...primary);
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + 44, y);
      y += 12;

      // ── Quality Score Box ──
      const score = summary?.qualityScore || 0;
      const scoreBoxW = pageWidth - margin * 2;
      doc.setFillColor(...primaryLight);
      doc.roundedRect(margin, y, scoreBoxW, 28, 4, 4, 'F');

      // Score circle
      const circleX = margin + 18;
      const circleY = y + 14;
      doc.setFillColor(...primary);
      doc.circle(circleX, circleY, 10, 'F');
      doc.setTextColor(...white);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${score}`, circleX, circleY + 1.5, { align: 'center' });
      doc.setFontSize(5);
      doc.text('/ 100', circleX, circleY + 6, { align: 'center' });

      // Score label
      doc.setTextColor(...textDark);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Puntaje de Optimización', margin + 34, y + 11);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      const qualityLabel = score >= 90 ? 'Excelente' : score >= 80 ? 'Muy bueno' : score >= 60 ? 'Aceptable' : 'Mejorable';
      doc.text(`Calificación: ${qualityLabel}`, margin + 34, y + 18);

      y += 36;

      // ── Summary Stats (in boxes) ──
      doc.setTextColor(...textDark);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen General', margin, y);
      y += 8;

      const statsData = [
        { label: 'Secciones', value: `${summary?.totalCourses || 0}` },
        { label: 'Créditos', value: `${summary?.totalCredits || 0}` },
        { label: 'Horas/semana', value: `${summary?.totalHours || 0}` },
        { label: 'Teórico', value: `${summary?.distribution?.teorico || 0}%` },
        { label: 'Laboratorio', value: `${summary?.distribution?.laboratorio || 0}%` },
      ];

      const boxW = (pageWidth - margin * 2 - 8 * (statsData.length - 1)) / statsData.length;
      statsData.forEach((stat, i) => {
        const bx = margin + i * (boxW + 8);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(bx, y, boxW, 22, 3, 3, 'F');
        doc.setDrawColor(...borderColor);
        doc.roundedRect(bx, y, boxW, 22, 3, 3, 'S');

        doc.setTextColor(...textDark);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(stat.value, bx + boxW / 2, y + 10, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textMuted);
        doc.text(stat.label, bx + boxW / 2, y + 17, { align: 'center' });
      });

      y += 32;

      // ── Load per Day bar chart ──
      doc.setTextColor(...textDark);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Carga Académica por Día', margin, y);
      y += 8;

      const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      const dayLabels = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };
      const maxLoad = Math.max(...days.map(d => summary?.loadPerDay?.[d] || 0), 1);
      const barMaxH = 26;
      const barW = 18;
      const barGap = (pageWidth - margin * 2 - barW * days.length) / (days.length + 1);

      // Background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, pageWidth - margin * 2, barMaxH + 22, 4, 4, 'F');

      days.forEach((day, i) => {
        const val = summary?.loadPerDay?.[day] || 0;
        const barH = maxLoad > 0 ? (val / maxLoad) * barMaxH : 0;
        const bx = margin + barGap + i * (barW + barGap);
        const by = y + 6 + (barMaxH - barH);

        // Bar
        doc.setFillColor(...primary);
        if (barH > 2) {
          doc.roundedRect(bx, by, barW, barH, 2, 2, 'F');
        } else {
          doc.setFillColor(200, 200, 220);
          doc.roundedRect(bx, by, barW, Math.max(barH, 2), 1, 1, 'F');
        }

        // Value above bar
        doc.setTextColor(...textDark);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`${val}h`, bx + barW / 2, by - 2, { align: 'center' });

        // Day label
        doc.setTextColor(...textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(dayLabels[day], bx + barW / 2, y + barMaxH + 16, { align: 'center' });
      });

      y += barMaxH + 30;

      // ── Schedule Assignments Table ──
      let assignments = [];
      try {
        const genRes = await api.get('/generations');
        const gen = (genRes.data.generations || []).find(g => g.status === 'completada');
        if (gen?.scheduleId) {
          const schedId = gen.scheduleId._id || gen.scheduleId;
          const schedRes = await api.get(`/schedule/${schedId}`);
          assignments = schedRes.data.assignments || [];
        }
      } catch (e) { /* schedule detail is optional */ }

      if (assignments.length > 0) {
        doc.setTextColor(...textDark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalle de Asignaciones', margin, y);
        y += 4;

        const dayOrder = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 7 };
        const sortedAssignments = [...assignments].sort((a, b) => {
          const dayDiff = (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0);
          if (dayDiff !== 0) return dayDiff;
          return (a.startTime || '').localeCompare(b.startTime || '');
        });

        const tableBody = sortedAssignments.map(a => [
          dayLabels[a.day] || a.day,
          `${a.startTime || ''} - ${a.endTime || ''}`,
          a.courseId?.name || '',
          a.courseId?.code || '',
          a.classroomId?.code || a.classroomId?.name || '',
          a.teacherId?.name || '',
        ]);

        doc.autoTable({
          startY: y,
          head: [['Día', 'Horario', 'Curso', 'Código', 'Aula', 'Docente']],
          body: tableBody,
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [...borderColor],
            lineWidth: 0.3,
            textColor: [...textDark],
          },
          headStyles: {
            fillColor: [...primary],
            textColor: [...white],
            fontStyle: 'bold',
            fontSize: 8,
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          columnStyles: {
            0: { cellWidth: 22, fontStyle: 'bold' },
            1: { cellWidth: 26 },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 'auto' },
          },
          didDrawPage: (data) => {
            // Footer on each page
            const pageH = doc.internal.pageSize.getHeight();
            doc.setFontSize(7);
            doc.setTextColor(...textMuted);
            doc.text('UniScheduler · Universidad Continental · Reporte generado automáticamente', pageWidth / 2, pageH - 8, { align: 'center' });
            doc.text(`Página ${doc.internal.getNumberOfPages()}`, pageWidth - margin, pageH - 8, { align: 'right' });
          }
        });
      }

      // ── Footer (on last or only page) ──
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFontSize(7);
      doc.setTextColor(...textMuted);
      doc.text('UniScheduler · Universidad Continental · Reporte generado automáticamente', pageWidth / 2, pageH - 8, { align: 'center' });
      doc.text(`Página ${doc.internal.getNumberOfPages()}`, pageWidth - margin, pageH - 8, { align: 'right' });

      // ── Save ──
      doc.save(`reporte_horario_${new Date().toISOString().split('T')[0]}.pdf`);

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Error al exportar el reporte');
    }
    setExporting(false);
  };

  const handleExportExcel = async (type = 'schedule') => {
    try {
      const response = await api.get(`/reports/export/excel?type=${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const ext = type === 'full' ? 'reporte_completo' : type;
      link.setAttribute('download', `${ext}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error al exportar Excel');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const dayLabels = { lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom' };
  const maxLoad = summary ? Math.max(...days.map(d => summary.loadPerDay?.[d] || 0), 1) : 1;

  return (
    <div className="reports-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Resumen general de tu carga académica y distribución de horarios.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${exported ? 'btn-success' : 'btn-primary'}`}
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <><span className="spinner" style={{width:16,height:16,borderWidth:2}}></span> Exportando...</>
            ) : exported ? (
              <><HiOutlineCheckCircle /> Descargado ✓</>
            ) : (
              <><HiOutlineDownload /> Exportar PDF</>
            )}
          </button>
          <div className="excel-export-group">
            <button className="btn btn-outline" onClick={() => handleExportExcel('schedule')} title="Exportar horario">
              📊 Excel: Horario
            </button>
            <button className="btn btn-outline" onClick={() => handleExportExcel('teachers')} title="Exportar docentes">
              📊 Excel: Docentes
            </button>
            <button className="btn btn-outline" onClick={() => handleExportExcel('full')} title="Exportar todo">
              📊 Excel: Completo
            </button>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        {/* Score Card */}
        <div className="card report-score-card">
          <h3 className="card-title">Resumen general</h3>
          <div className="score-display">
            <div className="score-circle-lg">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--primary)" strokeWidth="8"
                  strokeDasharray="314" strokeDashoffset={314 - (314 * (summary?.qualityScore || 0) / 100)}
                  strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <span className="score-number">{summary?.qualityScore || 0}</span>
              <span className="score-max">/ 100</span>
            </div>
            <div className="score-stats">
              <div className="score-stat-row"><span>Secciones</span><strong>{summary?.totalCourses || 0}</strong></div>
              <div className="score-stat-row"><span>Créditos</span><strong>{summary?.totalCredits || 0}</strong></div>
              <div className="score-stat-row"><span>Materias</span><strong>{summary?.totalCourses || 0}</strong></div>
              <div className="score-stat-row"><span>Horas semanales</span><strong>{summary?.totalHours || 0}</strong></div>
            </div>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="card">
          <h3 className="card-title">Distribución por tipo de materia</h3>
          <div className="donut-container">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="var(--sched-blue)" strokeWidth="24"
                strokeDasharray={`${(summary?.distribution?.teorico || 50) / 100 * 377} 377`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              <circle cx="80" cy="80" r="60" fill="none" stroke="var(--sched-orange)" strokeWidth="24"
                strokeDasharray={`${(summary?.distribution?.laboratorio || 50) / 100 * 377} 377`}
                strokeDashoffset={`-${(summary?.distribution?.teorico || 50) / 100 * 377}`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
            </svg>
            <div className="donut-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--sched-blue)' }}></span>Teórico <strong>{summary?.distribution?.teorico || 0}%</strong></div>
              <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--sched-orange)' }}></span>Laboratorio <strong>{summary?.distribution?.laboratorio || 0}%</strong></div>
            </div>
          </div>
        </div>

        {/* Load per Day */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="card-title">Carga académica por día (horas)</h3>
          <div className="bar-chart">
            {days.map(day => {
              const val = summary?.loadPerDay?.[day] || 0;
              return (
                <div key={day} className="bar-col">
                  <div className="bar-value">{val}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ height: `${(val / maxLoad) * 100}%` }}></div></div>
                  <div className="bar-label">{dayLabels[day]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
