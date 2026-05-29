/**
 * Crea 40 estudiantes para Ingeniería de Sistemas distribuidos por semestre.
 * Ejecutar: node seed/seedStudents.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');
const Career = require('../models/Career');

const STUDENTS_PER_SEMESTER = {
  1: 15, 2: 15, 3: 15, 4: 15, 5: 15,
  6: 15, 7: 15, 8: 15, 9: 15, 10: 15
};

const FIRST_NAMES = [
  'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Jorge', 'Rosa',
  'Miguel', 'Elena', 'Pedro', 'Sofía', 'Juan', 'Laura', 'Diego', 'Valentina',
  'Andrés', 'Camila', 'Fernando', 'Luciana', 'Ricardo', 'Gabriela', 'Sergio', 'Daniela',
  'Alberto', 'Paula', 'Pablo', 'Isabella', 'Hugo', 'Natalia', 'Raúl', 'Ximena',
  'Renato', 'Adriana', 'Marco', 'Brenda', 'Martín', 'Alicia', 'César', 'Diana',
  'Oscar', 'Lucía', 'Víctor', 'Angélica', 'Edwin', 'Silvia', 'Iván', 'Mónica',
  'Ángel', 'Patricia', 'David', 'Ruth', 'Jesús', 'Liliana', 'Christian', 'Verónica',
  'Manuel', 'Rocío', 'Eduardo', 'Teresa', 'Alex', 'Marina', 'Wilfredo', 'Gladys',
  'Julio', 'Elsa', 'Francisco', 'Betty', 'Antonio', 'Sandra', 'Enrique', 'Julia',
  'Mario', 'Olga', 'Jaime', 'Eva', 'Felipe', 'Rita', 'Samuel', 'Iris',
  'Emilio', 'Noemí', 'Fabián', 'Esther', 'Leonardo', 'Yolanda', 'Gustavo', 'Sara',
  'Alonso', 'Pilar', 'Roberto', 'Lourdes', 'Aldo', 'Maribel', 'Benjamín', 'Eliana',
  'Tomás', 'Cecilia', 'Omar', 'Luz', 'Saúl', 'Margarita', 'Arturo', 'Nora',
  'Rubén', 'Milagros', 'Humberto', 'Doris', 'Edgar', 'Gloria', 'Lorenzo', 'Raquel',
  'Vicente', 'Elvira', 'Dante', 'Claudia', 'Fidel', 'Graciela', 'Héctor', 'Victoria',
  'Ramiro', 'Flor', 'Ismael', 'Fabiola', 'Domingo', 'Elizabeth', 'Moisés', 'Sonia',
  'Teodoro', 'Roxana', 'Axel', 'Cynthia', 'Erick', 'Jessica', 'Kevin', 'Mirtha',
  'Brandon', 'Alejandra', 'Jairo', 'Betsy', 'Néstor', 'Wendy', 'Anderson', 'Kiara',
  'Pierina', 'Yerson', 'Yajaira', 'Bill', 'Zulema', 'Mateo', 'Thalía', 'Giancarlo'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'Hernández', 'González',
  'Pérez', 'Torres', 'Ramírez', 'Flores', 'Vásquez', 'Cruz', 'Reyes',
  'Morales', 'Ortega', 'Castillo', 'Ramos', 'Medina', 'Díaz', 'Castro',
  'Álvarez', 'Romero', 'Moreno', 'Jiménez', 'Navarro', 'Gutiérrez',
  'Mendoza', 'Delgado', 'Vega', 'Campos', 'Peña', 'Aguilar', 'Soto',
  'Carrillo', 'Espinoza', 'Guerrero', 'Chávez', 'Huamán', 'Quispe', 'Mamani',
  'Condori', 'Pachas', 'Salazar', 'Huerta', 'Valencia', 'Cárdenas', 'Ortiz',
  'Marín', 'Ríos', 'Vargas'
];

async function seedStudents() {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unischeduler';
    await mongoose.connect(dbUri);
    console.log('📦 Conectado a MongoDB:', dbUri);

    const career = await Career.findOne({ code: 'ISI' });
    if (!career) {
      console.error('❌ No se encontró la carrera ISI. Ejecuta primero: npm run seed');
      process.exit(1);
    }
    console.log(`✅ Carrera encontrada: ${career.name} (${career._id})`);

    // Delete existing students for this career
    const deleted = await Student.deleteMany({ career: career._id });
    console.log(`🗑️  Estudiantes eliminados para ISI: ${deleted.deletedCount}`);

    const students = [];
    let idx = 0;

    for (const [sem, count] of Object.entries(STUDENTS_PER_SEMESTER)) {
      for (let i = 0; i < count; i++) {
        const firstName = FIRST_NAMES[idx];
        const lastName = LAST_NAMES[idx % LAST_NAMES.length];
        const name = `${firstName} ${lastName}`;
        const studentCode = `ISI${String(sem).padStart(2, '0')}${String(i + 1).padStart(2, '0')}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx + 1}@unischeduler.edu.pe`;

        students.push({
          name,
          email,
          studentCode,
          currentSemester: Number(sem),
          career: career._id,
          active: true,
          totalCreditsApproved: 0,
          approvedCourses: [],
          preferredShift: ['manana', 'tarde', 'noche', 'indiferente'][idx % 4]
        });

        idx++;
      }
    }

    const created = await Student.insertMany(students);
    console.log(`✅ ${created.length} estudiantes creados`);

    // Show summary
    const bySem = {};
    for (const s of created) {
      bySem[s.currentSemester] = (bySem[s.currentSemester] || 0) + 1;
    }
    for (const [sem, count] of Object.entries(bySem).sort((a, b) => a[0] - b[0])) {
      console.log(`   Semestre ${sem}: ${count} estudiantes`);
    }

    await mongoose.disconnect();
    console.log('👋 Desconectado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedStudents();
