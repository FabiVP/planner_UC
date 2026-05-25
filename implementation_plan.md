# UniScheduler — Sistema de Generación Óptima de Horarios Académicos

Sistema completo MERN (MongoDB, Express, React, Node.js) para la generación automática de horarios académicos válidos y óptimos usando algoritmos CSP (Constraint Satisfaction Problem).

## Resumen del Alcance

Basado en la documentación del proyecto (docs/inicio/), se implementará el PMV v1.0.0 con:
- **RF-01**: CRUD de entidades (estudiantes, docentes, cursos, aulas, **carreras**)
- **RF-02**: Validación de prerrequisitos
- **RF-03**: Validación de créditos (20-22)
- **RF-04**: Generación CSP de horarios sin conflictos
- **RF-05**: Visualización en grilla semanal interactiva
- **RF-06**: Autenticación por roles (Coordinador, Estudiante, Docente)
- **RF-07**: Planificación progresiva por carrera con análisis de demanda docente
- **RF-08**: Gestión de carreras académicas (CRUD + asignación de cursos)

## Diseño Visual

Se seguirá la imagen de referencia proporcionada:
- **Sidebar** oscuro con navegación completa (Dashboard, **Planificación**, Generar Horario, Mis Horarios, Preferencias, Restricciones, Reportes, Notificaciones, Ayuda | Admin: **Carreras**, Asignaturas, Docentes, Estudiantes, Aulas, Generaciones)
- **Cards de estadísticas** con iconos coloridos (Asignaturas, Docentes, Aulas, Generaciones)
- **Panel de generación** con estado y ejecución
- **Gráfico circular** de calidad de solución (restricciones cumplidas, preferencias, uso de recursos)
- **Grilla de horario** semanal con colores por materia
- **Panel de alertas** lateral
- **Planificación académica** con vista de carreras → cursos → demanda docente
- Diseño premium con glassmorphism, gradientes y micro-animaciones

---

## Proposed Changes

### Backend (`backend/`)

#### Estructura de archivos

```
backend/
├── package.json
├── .env.example
├── server.js                    # Entry point
├── config/
│   ├── db.js                    # MongoDB connection
│   └── jwt.js                   # JWT config
├── middleware/
│   ├── auth.js                  # JWT validation
│   ├── roleGuard.js             # Role-based access
│   └── errorHandler.js          # Global error handler
├── models/
│   ├── User.js                  # User (auth: email, password, role)
│   ├── Career.js                # Carrera (código, nombre, facultad, semestres, créditos)
│   ├── Course.js                # Curso (código, nombre, créditos, tipo, prerrequisitos, career ref)
│   ├── Teacher.js               # Docente (nombre, disponibilidad, cursos que puede dictar)
│   ├── Student.js               # Estudiante (nombre, cursos aprobados, matrícula)
│   ├── Classroom.js             # Aula (código, capacidad, tipo)
│   ├── Enrollment.js            # Matrícula (estudiante, cursos seleccionados, semestre)
│   ├── Schedule.js              # Horario generado
│   └── Generation.js            # Registro de generaciones (historial)
├── routes/
│   ├── auth.routes.js
│   ├── career.routes.js         # CRUD carreras + demand analysis
│   ├── course.routes.js
│   ├── teacher.routes.js
│   ├── student.routes.js
│   ├── classroom.routes.js
│   ├── enrollment.routes.js
│   ├── schedule.routes.js
│   └── generation.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── career.controller.js     # CRUD + getDemand + getSummaryAll
│   ├── course.controller.js
│   ├── teacher.controller.js
│   ├── student.controller.js
│   ├── classroom.controller.js
│   ├── enrollment.controller.js
│   ├── schedule.controller.js
│   └── generation.controller.js
├── engine/
│   ├── csp.js                   # Motor CSP principal
│   ├── constraints.js           # Restricciones RD-01 a RD-06
│   ├── heuristics.js            # MRV, Forward Checking
│   └── validator.js             # Validación de solución
└── seed/
    ├── seed.js                  # Datos de prueba (con 4 carreras)
    └── seedInline.js            # Versión importable del seed
```

#### Modelos MongoDB (Mongoose)

**User**: `{ email, password (bcrypt), role: ['coordinador', 'docente', 'estudiante'], name, career, department }`

**Career**: `{ code, name, faculty, totalSemesters, totalCredits, director, description, active }`

**Course**: `{ code, name, credits, type: ['teorico', 'laboratorio'], semester, prerequisites: [Course._id], sessionsPerWeek, hoursPerSession, career: Career._id }`

**Teacher**: `{ userId, specializations: [Course._id], maxCourses: 3, availability: [{day, startTime, endTime}], preferredShift }`

**Student**: `{ userId, currentSemester, approvedCourses: [{courseId, grade}], totalCreditsApproved }`

**Classroom**: `{ code, name, capacity, type: ['teorico', 'laboratorio'], building, available: Boolean }`

**Enrollment**: `{ studentId, semester, selectedCourses: [Course._id], totalCredits, status, validatedAt }`

**Schedule**: `{ generationId, semester, assignments: [{courseId, teacherId, classroomId, day, startTime, endTime}] }`

**Generation**: `{ name, semester, status: ['pendiente','ejecutando','completado','fallido'], scheduledDate, executedAt, qualityScore, constraintsFulfilled, preferences, resourceUsage, conflicts: [] }`

#### Motor CSP (`engine/`)

El motor implementa:
1. **Backtracking** con ordenamiento dinámico de variables
2. **MRV** (Minimum Remaining Values) — seleccionar curso más restringido primero
3. **Forward Checking** — propagar restricciones y podar dominios
4. **Timeout** a 30 segundos — retornar mejor solución parcial

Restricciones implementadas:
- **RD-01**: No solapamiento de docente en misma franja
- **RD-02**: No solapamiento de aula en misma franja
- **RD-03**: No solapamiento de estudiante en su horario
- **RD-04**: Créditos entre 20-22 por estudiante
- **RD-05**: Prerrequisitos aprobados
- **RD-06**: Tipo de aula = tipo de curso

#### API Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Login (retorna JWT) | No |
| GET/POST/PUT/DELETE | `/api/careers` | CRUD carreras | Coordinador |
| GET | `/api/careers/summary/all` | Resumen demanda de todas las carreras | Coordinador |
| GET | `/api/careers/:id/demand` | Análisis de demanda docente por carrera | Coordinador |
| GET/POST/PUT/DELETE | `/api/courses` | CRUD cursos (con filtro por career) | Coordinador |
| GET/POST/PUT/DELETE | `/api/teachers` | CRUD docentes | Coordinador |
| GET/POST/PUT/DELETE | `/api/students` | CRUD estudiantes | Coordinador |
| GET/POST/PUT/DELETE | `/api/classrooms` | CRUD aulas | Coordinador |
| POST | `/api/enrollments` | Crear matrícula (valida créditos y prereqs) | Coordinador |
| POST | `/api/schedule/generate` | Ejecutar generación CSP | Coordinador |
| GET | `/api/schedule/:id` | Ver horario generado | Todos |
| GET | `/api/generations` | Historial de generaciones | Coordinador |
| GET | `/api/dashboard/stats` | Stats para dashboard | Coordinador |

---

### Frontend (`frontend/`)

Se usará **Vite + React** como bundler/framework SPA.

#### Estructura de archivos

```
frontend/
├── package.json
├── vite.config.js
├── index.html
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx                   # Router principal + ProtectedRoute
│   ├── App.css
│   ├── index.css                 # Design system global
│   ├── api/
│   │   └── axios.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx       # Navegación con Planificación y Carreras
│   │   │   ├── Sidebar.css
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── MainLayout.jsx
│   │   │   └── MainLayout.css
│   │   ├── ui/
│   │   │   ├── StatCard.jsx
│   │   │   ├── Modal.jsx / Modal.css
│   │   │   └── ...
│   │   └── schedule/
│   │       ├── ScheduleGrid.jsx
│   │       └── ScheduleCell.jsx
│   ├── pages/
│   │   ├── Login.jsx / Login.css
│   │   ├── Dashboard.jsx / Dashboard.css
│   │   ├── Planning.jsx / Planning.css        # ★ Planificación: Carreras → Cursos → Demanda
│   │   ├── Careers.jsx / Careers.css           # ★ CRUD de carreras
│   │   ├── Courses.jsx / Courses.css           # CRUD cursos + filtro por carrera
│   │   ├── Teachers.jsx / Teachers.css
│   │   ├── Students.jsx / Students.css
│   │   ├── Classrooms.jsx / Classrooms.css
│   │   ├── Generation.jsx / Generation.css
│   │   ├── Schedules.jsx / Schedules.css
│   │   └── ...
│   └── utils/
│       ├── constants.js
│       └── helpers.js
```

#### Flujo de Planificación Progresiva (★ nuevo)

El coordinador sigue un flujo paso a paso:

1. **Crear Carreras** (Admin → Carreras): Define las carreras académicas (ISI, IC, ADM, DER)
2. **Asignar Cursos** (Admin → Asignaturas): Cada curso se vincula a una carrera
3. **Analizar Demanda** (Planificación): Selecciona una carrera y ve:
   - Cuántos cursos tiene por semestre
   - Cuántos docentes necesita cada curso
   - Cuántos docentes calificados existen actualmente
   - Si hay déficit o cobertura completa
   - Click en un curso muestra docentes asignados con su turno preferido
4. **Registrar Docentes** (Admin → Docentes): Agrega docentes con sus especializaciones
5. **Generar Horario** (Generar Horario): Ejecuta el motor CSP con toda la data configurada

---

## Datos de Prueba (Seed)

Se generará un seed script con:
- **4 carreras** (Ing. Sistemas, Ing. Civil, Administración, Derecho)
- **18 cursos** (10 de Sistemas + 2 de Civil + 3 de Administración + 3 de Derecho)
- **5 docentes** con disponibilidad variable
- **8 aulas** (6 teóricas + 2 laboratorios)
- **15 estudiantes** con historial académico
- **1 usuario coordinador** (admin@uni.edu / admin123)
- **2 usuarios docente** + **2 usuarios estudiante**

---

## Verification Plan

### Automated Tests
1. `npm run dev` en backend → verificar que el servidor inicia en puerto 5000
2. `npm run dev` en frontend → verificar que la app Vite inicia en puerto 5173
3. Navegar al dashboard en el browser y verificar visualmente
4. Ejecutar seed y probar generación de horario via API

### Manual Verification
- Verificar login con JWT
- CRUD de carreras desde la UI
- CRUD de cursos con selector de carrera
- Planificación: seleccionar carrera → ver demanda docente por materia
- Ejecutar generación CSP y ver resultado en grilla
- Verificar validaciones de prerrequisitos y créditos
- Verificar responsividad y estética premium

### Flujo de prueba de Planificación
1. Login como coordinador (admin@uni.edu / admin123)
2. Ir a Planificación → Ver resumen de 4 carreras con indicadores de déficit
3. Click en "Ingeniería de Sistemas" → Ver 10 cursos con demanda docente
4. Filtrar por semestre (3, 4, 5, etc.)
5. Click en un curso → Ver docentes calificados o mensaje de déficit
6. Ir a Asignaturas → Filtrar por carrera → Verificar asignación correcta
7. Ir a Carreras → Crear nueva carrera → Verificar que aparece en Planificación
