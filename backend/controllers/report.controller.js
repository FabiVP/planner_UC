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
