# UniScheduler — Sistema de Generación Óptima de Horarios Académicos

Sistema completo MERN (MongoDB, Express, React, Node.js) para la generación automática de horarios académicos válidos y óptimos usando algoritmos CSP (Constraint Satisfaction Problem).

## Resumen del Alcance

Basado en la documentación del proyecto (docs/inicio/), se implementará el PMV v1.0.0 con:
- **RF-01**: CRUD de entidades (estudiantes, docentes, cursos, aulas)
- **RF-02**: Validación de prerrequisitos
- **RF-03**: Validación de créditos (20-22)
- **RF-04**: Generación CSP de horarios sin conflictos
- **RF-05**: Visualización en grilla semanal interactiva
- **RF-06**: Autenticación por roles (Coordinador, Estudiante, Docente)

## Diseño Visual

Se seguirá la imagen de referencia proporcionada:
- **Sidebar** oscuro con navegación completa (Dashboard, Planificación, Asignaturas, Recursos [con submenú: Docentes, Aulas, Estudiantes], Restricciones, Generación, Horarios [con submenú], Reportes, Configuración)
- **Cards de estadísticas** con iconos coloridos (Asignaturas, Docentes, Aulas, Generaciones)
- **Panel de generación** con estado y ejecución
- **Gráfico circular** de calidad de solución (restricciones cumplidas, preferencias, uso de recursos)
- **Grilla de horario** semanal con colores por materia
- **Panel de alertas** lateral
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
│   ├── Course.js                # Curso (código, nombre, créditos, tipo, prerrequisitos)
│   ├── Teacher.js               # Docente (nombre, disponibilidad, cursos que puede dictar)
│   ├── Student.js               # Estudiante (nombre, cursos aprobados, matrícula)
│   ├── Classroom.js             # Aula (código, capacidad, tipo)
│   ├── Enrollment.js            # Matrícula (estudiante, cursos seleccionados, semestre)
│   ├── Schedule.js              # Horario generado
│   └── Generation.js            # Registro de generaciones (historial)
├── routes/
│   ├── auth.routes.js
│   ├── course.routes.js
│   ├── teacher.routes.js
│   ├── student.routes.js
│   ├── classroom.routes.js
│   ├── enrollment.routes.js
│   ├── schedule.routes.js
│   └── generation.routes.js
├── controllers/
│   ├── auth.controller.js
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
    └── seed.js                  # Datos de prueba
```

#### [NEW] package.json
- Dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, helmet, morgan, dotenv, express-validator
- Dev: nodemon

#### [NEW] Modelos MongoDB (Mongoose)

**User**: `{ email, password (bcrypt), role: ['coordinador', 'docente', 'estudiante'], name }`

**Course**: `{ code, name, credits, type: ['teorico', 'laboratorio'], semester, prerequisites: [Course._id], sessionsPerWeek, hoursPerSession }`

**Teacher**: `{ userId, specializations: [Course._id], maxCourses: 3, availability: [{day, startTime, endTime}] }`

**Student**: `{ userId, currentSemester, approvedCourses: [{courseId, grade}], totalCreditsApproved }`

**Classroom**: `{ code, name, capacity, type: ['teorico', 'laboratorio'], building, available: Boolean }`

**Enrollment**: `{ studentId, semester, selectedCourses: [Course._id], totalCredits, status, validatedAt }`

**Schedule**: `{ generationId, semester, assignments: [{courseId, teacherId, classroomId, day, startTime, endTime}] }`

**Generation**: `{ name, semester, status: ['pendiente','ejecutando','completado','fallido'], scheduledDate, executedAt, qualityScore, constraintsFulfilled, preferences, resourceUsage, conflicts: [] }`

#### [NEW] Motor CSP (`engine/`)

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

#### [NEW] API Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Login (retorna JWT) | No |
| GET/POST/PUT/DELETE | `/api/courses` | CRUD cursos | Coordinador |
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
├── .env                          # Variables de entorno (VITE_API_URL)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore
├── eslint.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx                   # Router principal + ProtectedRoute
│   ├── App.css                   # Layout y estilos compartidos de páginas
│   ├── index.css                 # Design system global (paleta, tipografía, componentes base)
│   ├── api/
│   │   └── axios.js              # Axios instance con interceptors JWT
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state + login/register/logout + protected routes
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx       # Navigation sidebar con submenús (Dashboard, Planificación, Asignaturas, Recursos, Restricciones, Generación, Horarios, Reportes, Configuración)
│   │   │   ├── Sidebar.css
│   │   │   ├── Header.jsx        # Top bar con user info, notificaciones y logout
│   │   │   ├── Header.css
│   │   │   ├── MainLayout.jsx    # Layout wrapper (Sidebar + Outlet)
│   │   │   └── MainLayout.css
│   │   ├── ui/
│   │   │   ├── StatCard.jsx      # Cards de estadísticas con título de categoría
│   │   │   ├── StatCard.css
│   │   │   ├── QualityChart.jsx  # Gráfico circular SVG animado de calidad
│   │   │   ├── QualityChart.css
│   │   │   ├── AlertPanel.jsx    # Panel de alertas con header "Ver todas"
│   │   │   ├── AlertPanel.css
│   │   │   ├── DataTable.jsx     # Tabla genérica reutilizable con soporte click
│   │   │   ├── DataTable.css
│   │   │   ├── Modal.jsx         # Modal genérico overlay
│   │   │   └── Modal.css
│   │   └── schedule/
│   │       ├── ScheduleGrid.jsx  # Grilla semanal de horario con colores por materia
│   │       ├── ScheduleGrid.css
│   │       ├── ScheduleCell.jsx  # Celda individual con accesibilidad (keyboard nav)
│   │       └── ScheduleCell.css
│   ├── pages/
│   │   ├── Login.jsx             # Página de login con glassmorphism
│   │   ├── Login.css
│   │   ├── Dashboard.jsx         # Página principal (stats, generación, calidad, horario, alertas)
│   │   ├── Dashboard.css
│   │   ├── Courses.jsx           # CRUD de asignaturas con modal
│   │   ├── Courses.css
│   │   ├── Teachers.jsx          # CRUD de docentes con modal
│   │   ├── Teachers.css
│   │   ├── Students.jsx          # CRUD de estudiantes con modal
│   │   ├── Students.css
│   │   ├── Classrooms.jsx        # CRUD de aulas con modal
│   │   ├── Classrooms.css
│   │   ├── Generation.jsx        # Configurar y ejecutar generación CSP (con animación de progreso)
│   │   ├── Generation.css
│   │   ├── Schedules.jsx         # Ver horarios generados con selector de generación
│   │   └── Schedules.css
│   └── utils/
│       ├── constants.js          # Días, slots, roles, colores, restricciones CSP
│       └── helpers.js            # formatDate, capitalize, getStatusBadge, etc.
```

#### Diseño Visual Premium (siguiendo imagen de referencia)

1. **Paleta de colores**:
   - Sidebar: `#0f1535` (dark navy)
   - Background: `#f0f2f5` (light gray)
   - Primary accent: `#4318FF` (electric purple)
   - Success: `#05CD99`
   - Warning: `#FFB547`
   - Error: `#EE5D50`
   - Cards: `#FFFFFF` con `box-shadow` sutil

2. **Tipografía**: Inter (Google Fonts)

3. **Componentes visuales**:
   - Glassmorphism en cards
   - Gradientes sutiles en sidebar y botones
   - Micro-animaciones (hover, transiciones de página)
   - Iconos con `react-icons`
   - Gráfico circular SVG animado para calidad

4. **Responsivo**: Flexbox/Grid, breakpoints para tablet y móvil

---

## Datos de Prueba (Seed)

Se generará un seed script con:
- **10 cursos** (Estructuras de Datos, Matemáticas Discretas, Sistemas Operativos, etc.)
- **5 docentes** con disponibilidad variable
- **8 aulas** (6 teóricas + 2 laboratorios)
- **15 estudiantes** con historial académico
- **1 usuario coordinador** (admin@uni.edu / admin123)

---

## Verification Plan

### Automated Tests
1. `npm run dev` en backend → verificar que el servidor inicia en puerto 5000
2. `npm run dev` en frontend → verificar que la app Vite inicia en puerto 5173
3. Navegar al dashboard en el browser y verificar visualmente que coincide con la imagen de referencia
4. Ejecutar seed y probar generación de horario via API

### Manual Verification
- Verificar login con JWT
- CRUD de entidades desde la UI
- Ejecutar generación CSP y ver resultado en grilla
- Verificar validaciones de prerrequisitos y créditos
- Verificar responsividad y estética premium
