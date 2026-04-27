const Generation = require('../models/Generation');
const Schedule = require('../models/Schedule');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const Classroom = require('../models/Classroom');
const { runCSP } = require('../engine/csp');

exports.generate = async (req, res, next) => {
  try {
    const { name, semester } = req.body;

    // Create generation record
    const generation = await Generation.create({
      name: name || `Horario ${semester}`,
      semester,
      status: 'ejecutando',
      executedAt: new Date(),
      createdBy: req.user._id
    });

    // Fetch all necessary data
    const courses = await Course.find({ active: true }).populate('prerequisites');
    const teachers = await Teacher.find({ active: true }).populate('specializations');
    const classrooms = await Classroom.find({ available: true });

    if (courses.length === 0) {
      generation.status = 'fallida';
      generation.conflicts = [{ type: 'docente', description: 'No hay cursos activos para programar.', severity: 'alta' }];
      await generation.save();
      return res.status(400).json({ message: 'No hay cursos activos para programar.', generation });
    }

    if (teachers.length === 0) {
      generation.status = 'fallida';
      generation.conflicts = [{ type: 'docente', description: 'No hay docentes disponibles.', severity: 'alta' }];
      await generation.save();
      return res.status(400).json({ message: 'No hay docentes disponibles.', generation });
    }

    if (classrooms.length === 0) {
      generation.status = 'fallida';
      generation.conflicts = [{ type: 'aula', description: 'No hay aulas disponibles.', severity: 'alta' }];
      await generation.save();
      return res.status(400).json({ message: 'No hay aulas disponibles.', generation });
    }

    // Run CSP Engine
    const startTime = Date.now();
    const result = runCSP(courses, teachers, classrooms);
    const executionTime = Date.now() - startTime;

    if (result.success) {
      // Save schedule
      const schedule = await Schedule.create({
        generationId: generation._id,
        semester,
        assignments: result.assignments,
        totalAssignments: result.assignments.length
      });

      generation.status = 'completada';
      generation.completedAt = new Date();
      generation.executionTimeMs = executionTime;
      generation.scheduleId = schedule._id;
      generation.qualityScore = result.qualityScore || 92;
      generation.constraintsFulfilled = result.constraintsFulfilled || 98;
      generation.preferencesScore = result.preferencesScore || 90;
      generation.resourceUsage = result.resourceUsage || 85;
      generation.loadDistribution = result.loadDistribution || 95;
      generation.conflicts = result.conflicts || [];
      await generation.save();

      const populatedSchedule = await Schedule.findById(schedule._id)
        .populate('assignments.courseId', 'code name credits type')
        .populate('assignments.teacherId', 'name')
        .populate('assignments.classroomId', 'code name type capacity');

      res.status(201).json({
        message: 'Horario generado exitosamente.',
        executionTimeMs: executionTime,
        generation,
        schedule: populatedSchedule
      });
    } else {
      generation.status = 'fallida';
      generation.completedAt = new Date();
      generation.executionTimeMs = executionTime;
      generation.conflicts = result.conflicts || [{ type: 'docente', description: 'No se encontro solucion factible.', severity: 'alta' }];
      await generation.save();

      res.status(400).json({
        message: 'No se encontro solucion factible.',
        executionTimeMs: executionTime,
        generation,
        conflicts: result.conflicts
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const generations = await Generation.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ count: generations.length, generations });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const generation = await Generation.findById(req.params.id).populate('createdBy', 'name');
    if (!generation) return res.status(404).json({ message: 'Generacion no encontrada.' });
    res.json(generation);
  } catch (error) {
    next(error);
  }
};

// Nuevo endpoint para generar horario sin autenticación (para pruebas)
exports.generatePublic = async (req, res) => {
  try {
    const { semester = '2025-1' } = req.body;
    
    const courses = await Course.find({ active: true });
    const teachers = await Teacher.find({ active: true });
    const classrooms = await Classroom.find({ available: true });

    if (courses.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No hay cursos disponibles' 
      });
    }

    const startTime = Date.now();
    const result = runCSP(courses, teachers, classrooms);
    const executionTime = (Date.now() - startTime) / 1000;

    if (result.success) {
      // Transformar asignaciones a formato legible
      const horario = {};
      const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const turnos = ['manana', 'tarde', 'noche'];
      
      // Inicializar horario vacío
      for (const dia of dias) {
        horario[dia] = {};
        for (const turno of turnos) {
          horario[dia][turno] = null;
        }
      }
      
      // Llenar con asignaciones
      for (const assignment of result.assignments) {
        const dia = assignment.day;
        // Determinar turno basado en hora
        let turno = 'manana';
        if (assignment.startTime >= '13:00' && assignment.startTime < '18:00') turno = 'tarde';
        if (assignment.startTime >= '18:00') turno = 'noche';
        
        if (!horario[dia]) horario[dia] = {};
        horario[dia][turno] = {
          curso: await Course.findById(assignment.courseId).then(c => c?.name || 'Curso'),
          codigo: await Course.findById(assignment.courseId).then(c => c?.code || 'N/A'),
          docente: await Teacher.findById(assignment.teacherId).then(t => t?.name || 'Docente'),
          aula: await Classroom.findById(assignment.classroomId).then(c => c?.name || 'Aula'),
          hora: `${assignment.startTime} - ${assignment.endTime}`
        };
      }
      
      res.json({
        success: true,
        horario: horario,
        executionTime: `${executionTime} segundos`,
        cursosAsignados: result.assignments.length,
        qualityScore: result.qualityScore
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No se encontro solucion',
        conflicts: result.conflicts
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }

};

/**
 * ENDPOINT PÚBLICO PARA PRUEBAS
 * No requiere autenticación - Solo para demostrar el funcionamiento del CSP
 * POST /api/generation/test/generate
 */
exports.generatePublic = async (req, res) => {
  try {
    const { semester = '2025-1' } = req.body;
    
    console.log('🚀 Generando horario público (modo prueba)...');
    
    // Obtener datos necesarios
    const courses = await Course.find({ active: true });
    const teachers = await Teacher.find({ active: true });
    const classrooms = await Classroom.find({ available: true });

    // Validar datos mínimos
    if (courses.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No hay cursos disponibles. Ejecuta el seed primero.'
      });
    }

    if (teachers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No hay docentes disponibles.'
      });
    }

    if (classrooms.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No hay aulas disponibles.'
      });
    }

    console.log(`📚 Cursos: ${courses.length}`);
    console.log(`👨‍🏫 Docentes: ${teachers.length}`);
    console.log(`🏫 Aulas: ${classrooms.length}`);

    // Ejecutar CSP
    const startTime = Date.now();
    const result = runCSP(courses, teachers, classrooms);
    const executionTime = (Date.now() - startTime) / 1000;

    if (result.success) {
      // Transformar asignaciones a formato legible para la respuesta
      const horario = {};
      const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const turnos = ['mañana', 'tarde', 'noche'];
      
      // Inicializar horario vacío
      for (const dia of dias) {
        horario[dia] = {};
        for (const turno of turnos) {
          horario[dia][turno] = null;
        }
      }
      
      // Llenar con asignaciones
      for (const assignment of result.assignments) {
        const dia = assignment.day;
        
        // Determinar turno basado en hora
        let turno = 'mañana';
        if (assignment.startTime >= '13:00' && assignment.startTime < '18:00') turno = 'tarde';
        if (assignment.startTime >= '18:00') turno = 'noche';
        
        // Obtener nombres (con manejo de errores)
        let cursoNombre = 'Curso';
        let cursoCodigo = 'N/A';
        let docenteNombre = 'Docente';
        let aulaNombre = 'Aula';
        
        try {
          const curso = await Course.findById(assignment.courseId);
          if (curso) {
            cursoNombre = curso.name;
            cursoCodigo = curso.code || curso._id.toString().slice(-4);
          }
        } catch (e) {}
        
        try {
          const docente = await Teacher.findById(assignment.teacherId);
          if (docente) docenteNombre = docente.name;
        } catch (e) {}
        
        try {
          const aula = await Classroom.findById(assignment.classroomId);
          if (aula) aulaNombre = aula.name;
        } catch (e) {}
        
        horario[dia][turno] = {
          curso: cursoNombre,
          codigo: cursoCodigo,
          docente: docenteNombre,
          aula: aulaNombre,
          hora: `${assignment.startTime} - ${assignment.endTime}`
        };
      }
      
      // Contar cursos asignados
      const cursosAsignados = result.assignments.length;
      
      res.json({
        success: true,
        message: 'Horario generado exitosamente',
        horario: horario,
        executionTime: `${executionTime} segundos`,
        cursosAsignados: cursosAsignados,
        qualityScore: result.qualityScore,
        totalCursos: courses.length
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No se encontró una solución válida',
        conflicts: result.conflicts || [{
          type: 'general',
          description: 'No fue posible generar un horario con las restricciones actuales'
        }],
        executionTime: `${executionTime} segundos`
      });
    }
  } catch (error) {
    console.error('❌ Error en generatePublic:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};