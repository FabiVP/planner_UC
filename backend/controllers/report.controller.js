const Generation = require('../models/Generation');
const Schedule = require('../models/Schedule');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const Enrollment = require('../models/Enrollment');

// GET /api/reports/summary — Resumen general
exports.getSummary = async (req, res, next) => {
  try {
    const { semester } = req.query;
    const filter = semester ? { semester } : {};

    // Latest completed generation
    const latestGeneration = await Generation.findOne({ 
      status: 'completada',
      ...filter 
    }).sort({ createdAt: -1 });

    // Basic stats
    const totalCourses = await Course.countDocuments({ active: true });
    const totalTeachers = await Teacher.countDocuments({ active: true });
    const totalStudents = await Student.countDocuments({ active: true });
    const totalClassrooms = await Classroom.countDocuments({ available: true });
    const totalCredits = await Course.aggregate([
      { $match: { active: true } },
      { $group: { _id: null, total: { $sum: '$credits' } } }
    ]);

    // Schedule data for distribution and load
    let distribution = { teorico: 0, laboratorio: 0 };
    let loadPerDay = { lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0, sabado: 0 };
    let semesters = 0;
    let totalHours = 0;

    if (latestGeneration?.scheduleId) {
      const schedule = await Schedule.findById(latestGeneration.scheduleId)
        .populate('assignments.courseId', 'type credits');

      if (schedule) {
        for (const assignment of schedule.assignments) {
          // Type distribution
          const courseType = assignment.courseId?.type || 'teorico';
          distribution[courseType] = (distribution[courseType] || 0) + 1;

          // Load per day
          if (loadPerDay[assignment.day] !== undefined) {
            loadPerDay[assignment.day]++;
          }

          totalHours++;
        }
      }
    }

    // Calculate percentages for distribution
    const totalDist = distribution.teorico + distribution.laboratorio;
    const distributionPct = {
      teorico: totalDist > 0 ? Math.round((distribution.teorico / totalDist) * 100) : 50,
      laboratorio: totalDist > 0 ? Math.round((distribution.laboratorio / totalDist) * 100) : 50
    };

    // Semesters with data
    const uniqueSemesters = await Course.distinct('semester', { active: true });

    res.json({
      qualityScore: latestGeneration?.qualityScore || 0,
      totalCredits: totalCredits[0]?.total || 0,
      totalCourses,
      totalTeachers,
      totalStudents,
      totalClassrooms,
      totalHours,
      semesters: uniqueSemesters.length,
      distribution: distributionPct,
      distributionRaw: distribution,
      loadPerDay,
      latestGeneration: latestGeneration ? {
        _id: latestGeneration._id,
        name: latestGeneration.name,
        semester: latestGeneration.semester,
        qualityScore: latestGeneration.qualityScore,
        constraintsFulfilled: latestGeneration.constraintsFulfilled,
        preferencesScore: latestGeneration.preferencesScore,
        executionTimeMs: latestGeneration.executionTimeMs,
        createdAt: latestGeneration.createdAt,
        scoringBreakdown: latestGeneration.scoringBreakdown
      } : null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/export/excel
 * Exporta horario y datos académicos en formato CSV (compatible con Excel).
 * Query: ?type=schedule|teachers|classrooms|students|full
 */
exports.exportExcel = async (req, res, next) => {
  try {
    const { type = 'schedule' } = req.query;
    let csvContent = '';
    let filename = '';

    if (type === 'schedule' || type === 'full') {
      // Export latest schedule
      const latestGen = await Generation.findOne({ status: 'completada' }).sort({ createdAt: -1 });
      if (!latestGen?.scheduleId) {
        return res.status(400).json({ message: 'No hay horario generado para exportar.' });
      }

      const schedule = await Schedule.findById(latestGen.scheduleId)
        .populate('assignments.courseId', 'code name credits type semester')
        .populate('assignments.teacherId', 'name email')
        .populate('assignments.classroomId', 'code name type capacity');

      csvContent = 'Día,Hora Inicio,Hora Fin,Código Curso,Nombre Curso,Créditos,Tipo,Semestre,Docente,Aula,Capacidad Aula\n';
      const dayOrder = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

      const sorted = [...schedule.assignments].sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
      });

      for (const a of sorted) {
        const c = a.courseId;
        const t = a.teacherId;
        const cl = a.classroomId;
        csvContent += `${a.day},${a.startTime},${a.endTime},${c?.code || ''},${esc(c?.name)},${c?.credits || ''},${c?.type || ''},${c?.semester || ''},${esc(t?.name)},${cl?.code || ''},${cl?.capacity || ''}\n`;
      }
      filename = `horario_${latestGen.semester || 'export'}.csv`;
    }

    if (type === 'teachers' || type === 'full') {
      const teachers = await Teacher.find({ active: true }).populate('specializations', 'code name');
      const header = 'Nombre,Email,Contrato,Desempeño,Puntaje,Horas Semanales Max,Cursos Max,Turno Preferido,Especialidades\n';
      let rows = '';
      for (const t of teachers) {
        const specs = (t.specializations || []).map(s => s.code).join('; ');
        rows += `${esc(t.name)},${t.email || ''},${t.contractType},${t.performanceLevel || 'regular'},${t.performanceScore || 80},${t.maxWeeklyHours},${t.maxCourses},${t.preferredShift},${esc(specs)}\n`;
      }
      if (type === 'full') { csvContent += '\n--- DOCENTES ---\n' + header + rows; }
      else { csvContent = header + rows; filename = 'docentes_export.csv'; }
    }

    if (type === 'classrooms' || type === 'full') {
      const classrooms = await Classroom.find({ available: true });
      const header = 'Código,Nombre,Capacidad,Tipo,Edificio,Piso,Disponible\n';
      let rows = '';
      for (const cl of classrooms) {
        rows += `${cl.code},${esc(cl.name)},${cl.capacity},${cl.type},${cl.building || ''},${cl.floor || 1},${cl.available ? 'Sí' : 'No'}\n`;
      }
      if (type === 'full') { csvContent += '\n--- AULAS ---\n' + header + rows; }
      else { csvContent = header + rows; filename = 'aulas_export.csv'; }
    }

    if (type === 'students' || type === 'full') {
      const students = await Student.find({ active: true }).populate('career', 'code name');
      const header = 'Código,Nombre,Carrera,Semestre,Créditos Aprobados,Promedio,Cursos Aprobados,Cursos Desaprobados\n';
      let rows = '';
      for (const s of students) {
        const approved = (s.approvedCourses || []).filter(ac => ac.grade >= 11).length;
        const failed = (s.approvedCourses || []).filter(ac => ac.grade != null && ac.grade < 11).length;
        rows += `${s.studentCode},${esc(s.name)},${s.career?.code || ''},${s.currentSemester},${s.totalCreditsApproved},${s.gpa || 0},${approved},${failed}\n`;
      }
      if (type === 'full') { csvContent += '\n--- ESTUDIANTES ---\n' + header + rows; }
      else { csvContent = header + rows; filename = 'estudiantes_export.csv'; }
    }

    if (!filename) filename = 'reporte_completo.csv';

    // Add BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(bom + csvContent);
  } catch (error) {
    next(error);
  }
};

// Helper to escape CSV values
function esc(val) {
  if (!val) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
