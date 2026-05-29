# 📊 Análisis del Proyecto UniScheduler — proy.md vs Implementación Real

**Fecha:** 28 de mayo de 2026  
**Objetivo:** Confrontar la especificación `proy.md` con el código implementado, identificar lo que ya no se usa y lo que falta.

---

## 1. Resumen Ejecutivo

El proyecto UniScheduler tiene **una implementación funcional sólida como PMV**, pero el archivo `proy.md` describe un sistema **mucho más ambicioso** (sistema completo de planificación universitaria a escala institucional). La implementación actual cubre ~40% de lo descrito en `proy.md`, concentrándose correctamente en el motor CSP y la gestión administrativa (Modo Coordinador).

---

## 2. Mapeo: proy.md vs Implementación

### 2.1 MODO ESTUDIANTE

| Funcionalidad (proy.md) | Estado | Implementación |
|---|---|---|
| Autenticación institucional | ✅ Implementado | `auth.controller.js` + JWT |
| Obtención de info académica | ✅ Implementado | `student-schedule.controller.js → getEligibleCourses` |
| Dashboard académico | ✅ Parcial | `Dashboard.jsx` (genérico por rol) |
| Selección tentativa de cursos | ✅ Implementado | `Enrollment.jsx` + `SectionEnrollment.jsx` |
| Preferencias personalizadas | ✅ Implementado | `Preferences.jsx` + modelo `Preference.js` |
| Motor de generación de horarios | ✅ Implementado | `student-schedule.controller.js → generateStudentSchedule` |
| Validación de prerequisitos | ✅ Implementado | `validateSelection` en student-schedule |
| Validación de créditos (12-25) | ⚠️ Parcial | Solo valida max 22, no min 12 |
| Tipos de horarios (compacto, equilibrado, etc.) | ⚠️ Parcial | Genera alternativas por turno, no por tipo |
| Visualización calendario semanal | ✅ Implementado | `ScheduleGrid.jsx` + `ScheduleCell.jsx` |
| Comparación de horarios | ⚠️ Parcial | Alternativas con score, sin comparación visual lado a lado |
| Guardado de simulaciones | ❌ No implementado | No hay persistencia de simulaciones del estudiante |
| Exportación PDF/imagen | ✅ Implementado | `jspdf` + `jspdf-autotable` en frontend |
| Recomendación automática de cursos | ⚠️ Parcial | Categoriza cursos elegibles, sin IA predictiva |
| Análisis de sobrecarga | ❌ No implementado | — |
| Predicción de dificultad | ❌ No implementado | — |
| Predicción de demanda | ❌ No implementado | — |
| Detección de saturación | ❌ No implementado | — |
| Considerar traslado entre sedes | ❌ No implementado | Solo un campus |
| Correquisitos | ❌ No implementado | Solo prerequisitos |

### 2.2 MODO DOCENTE

| Funcionalidad (proy.md) | Estado | Implementación |
|---|---|---|
| Inicio de sesión institucional | ✅ Implementado | Auth con rol `docente` |
| Obtención automática de info | ✅ Implementado | `TeacherProfile.jsx` |
| Dashboard docente | ✅ Parcial | Dashboard genérico, no específico docente |
| Registro de preferencias | ✅ Implementado | `Preferences.jsx` + `Preference.js` |
| Disponibilidad por días/turnos | ✅ Implementado | `Teacher.availability` + `freeDays` |
| Carga horaria por contrato (TC/PH) | ✅ Implementado | `Teacher.contractType` + `maxWeeklyHours` |
| Desempeño docente (alto/regular/bajo) | ❌ No implementado | — |
| Visualización horario semanal | ✅ Implementado | `MySchedules.jsx` |
| Alertas automáticas | ⚠️ Parcial | `Notifications.jsx` para generaciones, no alertas en tiempo real |
| Comparación de distribuciones | ❌ No implementado | — |
| Simulaciones docentes | ❌ No implementado | — |
| Balance automático de carga | ⚠️ Motor CSP | El CSP balancea carga, no hay UI dedicada |
| Exportaciones PDF/imagen | ✅ Implementado | Reportes en `Reports.jsx` |
| Criterio de asignación por desempeño | ❌ No implementado | — |

### 2.3 MODO ADMINISTRADOR

| Funcionalidad (proy.md) | Estado | Implementación |
|---|---|---|
| Dashboard institucional | ✅ Implementado | `Dashboard.jsx` (estadísticas) |
| CRUD carreras | ✅ Implementado | `Careers.jsx` + `career.controller.js` |
| CRUD cursos | ✅ Implementado | `Courses.jsx` + `course.controller.js` |
| CRUD docentes | ✅ Implementado | `Teachers.jsx` + `teacher.controller.js` |
| CRUD estudiantes | ✅ Implementado | `Students.jsx` + `student.controller.js` |
| CRUD aulas | ✅ Implementado | `Classrooms.jsx` + `classroom.controller.js` |
| Gestión de secciones | ✅ Implementado | `Section.js` + `section.routes.js` |
| Políticas institucionales | ✅ Implementado | `InstitutionalPolicies.jsx` + `InstitutionalPolicy.js` |
| Configuración académica (semestre, bloques, turnos) | ✅ Implementado | Modelo InstitutionalPolicy |
| Configuración de restricciones | ✅ Implementado | `Restrictions.jsx` + motor CSP |
| Motor CSP institucional | ✅ Implementado | `engine/csp.js` (RD-01 a RD-11) |
| Generación automática por universidad | ✅ Implementado | `generation.controller.js` |
| Generación por carrera | ✅ Implementado | `career-generation.controller.js` + `CareerGeneration.jsx` |
| Generación por facultad/ciclo/sede | ❌ No implementado | Solo por carrera o total |
| Detección de conflictos | ✅ Implementado | Motor CSP + validador |
| Propuestas optimizadas (múltiples) | ✅ Implementado | `runCSPMultiple` genera hasta 4 alternativas |
| Ajustes manuales (mover cursos, cambiar aulas) | ❌ No implementado | — |
| Visualización por carrera/docente/aula | ⚠️ Parcial | `MySchedules.jsx`, no vistas por aula |
| Dashboard analítico | ⚠️ Parcial | `Reports.jsx` con métricas básicas |
| Predicción de demanda | ⚠️ Parcial | `projection.controller.js` básico |
| Versionado de horarios | ⚠️ Parcial | `Generation.js` guarda historial, sin restaurar |
| Exportación Excel | ❌ No implementado | Solo PDF |
| Reportes por aula/docente/carrera | ⚠️ Parcial | `Reports.jsx` genérico |
| Proyección apertura de secciones | ✅ Implementado | `career-generation.controller.js` |
| Aforo de aulas | ✅ Implementado | `Classroom.capacity` + RD-04 |
| Restricciones laborales docentes | ✅ Implementado | TC/PH en Teacher + Policy |
| Pref. estudiantes (admin override) | ✅ Implementado | `StudentPreferences.jsx` |

---

## 3. Restricciones CSP: proy.md vs Implementado

| Restricción | proy.md | Implementado | Notas |
|---|---|---|---|
| RD-01: Docente único por franja | ✅ | ✅ | `constraints.js` |
| RD-02: Aula única por franja | ✅ | ✅ | `constraints.js` |
| RD-03: Estudiante sin solapamiento | ✅ | ✅ | Por semestre/carrera |
| RD-04: Capacidad aula ≥ alumnos | ✅ | ✅ | `checkRD04` |
| RD-05: Tipo aula = tipo curso | ✅ | ✅ | `checkRD05` |
| Prerequisitos | ✅ | ✅ | Validación previa al CSP |
| Créditos (20-22) | ✅ | ✅ | Validación en enrollment |
| RD-06: Disponibilidad docente | Implícito | ✅ | Horaria + días libres |
| RD-07: Disponibilidad aula | No mencionado | ✅ | `availabilitySchedule` |
| RD-08: Carga máxima docente | ✅ | ✅ | TC/PH |
| RD-09: Ventana institucional | ✅ | ✅ | Policy.allowedSchedule |
| RD-10: Horas continuas docente | ✅ | ✅ | `maxContinuousHours` |
| RD-11: Distribución sesiones | ✅ | ✅ | Días no consecutivos |
| RD-12: Bloques bloqueados (almuerzo) | No mencionado | ✅ | `blockedTimeSlots` |
| Correquisitos | ✅ | ❌ | No implementado |
| Traslado entre sedes | ✅ | ❌ | Solo un campus |

> [!TIP]
> La implementación tiene **MÁS restricciones** que las listadas en proy.md (RD-06 a RD-12). El motor CSP es más robusto que lo especificado.

---

## 4. Archivos/Elementos a ELIMINAR (ya no se usan)

### 4.1 Archivos de la raíz

| Archivo | Razón para eliminar |
|---|---|
| `evidencia_horario_completo.json` | Archivo de evidencia de prueba antigua, datos estáticos de ejemplo. Ya existe `docs/antigravity/horario_generado.json`. |
| `implementation_plan.md` | Plan de implementación del PMV original. Ya fue ejecutado, las instrucciones están obsoletas (no incluye secciones, políticas, student-schedule, etc.). |
| `analisis_validacion_problema.md` | Documento para entrega académica pasada (Inspección 02, Mayo 2026). Ya entregado. |
| `inspeccion02.md` | Artefacto de entrega académica específica (01/05/2026). Ya entregado. |
| `package-lock.json` (raíz) | Archivo huérfano de 95 bytes en la raíz. No hay `package.json` en la raíz. |

### 4.2 En el proy.md — Conceptos que NO aplican al PMV actual

Los siguientes conceptos de `proy.md` **no se implementarán en esta versión** y deben marcarse como fuera de alcance:

| Concepto | Razón |
|---|---|
| Correquisitos | No modelado en Course.js |
| Múltiples campus/sedes + traslado | Solo un campus, sin modelo de sede |
| Matrícula oficial | El sistema es de simulación/planificación, no matrícula |
| Predicción de dificultad | No hay datos de dificultad |
| Aprendizaje automático | No hay ML implementado |
| Análisis histórico de ciclos anteriores | No hay data histórica |
| Desempeño docente (alto/regular/bajo) | No hay modelo de evaluación docente |
| Exportación a Excel | Solo PDF implementado |
| Calendarios institucionales | No implementado |
| Simulaciones docentes guardadas | No implementado |
| Versionado con restauración | Solo historial de generaciones |

---

## 5. Arquitectura Actual Real (vs proy.md)

### Lo que proy.md dice: "MERN"
### Lo que realmente es — Stack completo con versiones exactas:

```
FRONTEND (React SPA — Vite)
├── react 19.2.5 + react-dom 19.2.5
├── react-router-dom 7.14.2
├── axios 1.15.2 (cliente HTTP)
├── vite 8.0.10 + @vitejs/plugin-react 6.0.1
├── react-icons 5.6.0
├── jspdf 4.2.1 + jspdf-autotable 5.0.7 (exportación PDF)
└── eslint 10.2.1 (flat config)

BACKEND (Node.js + Express — API REST)
├── express 4.21.0
├── mongoose 8.7.0 (ODM — NO Prisma)
├── jsonwebtoken 9.0.2 + bcryptjs 2.4.3 (auth)
├── helmet 7.1.0 + cors 2.8.5 + morgan 1.10.0 (seguridad/logging)
├── express-rate-limit 8.5.2 + express-validator 7.2.0
├── dotenv 16.4.5
├── mongodb-memory-server 11.1.0 (dev DB automática)
├── jest 29.7.0 (testing, 84.26% coverage)
├── nodemon 3.1.7 (dev)
└── 21 archivos de rutas | 13 modelos Mongoose | 19 controllers

MOTOR CSP (Núcleo del Sistema)
├── Backtracking con ordenamiento dinámico de variables
├── MRV (Minimum Remaining Values)
├── Forward Checking (propagación de restricciones)
├── Timeout configurable (default 30s)
├── 12 restricciones (RD-01 a RD-12)
└── Scoring multi-dimensional con pesos desde InstitutionalPolicy

ARQUITECTURA
├── Frontend → Backend: Axios → REST API (JSON)
├── Backend → DB: Mongoose → MongoDB (Atlas / in-memory)
├── Auth: JWT (8h expiración) con middleware por rol
├── Patrón: MVC (backend) + Componentes funcionales + Hooks (frontend)
└── Despliegue: Frontend (build estático) + Backend (Node.js server)
```

> [!IMPORTANT]
> El **README.md** mencionaba **Prisma** como ORM en la tabla de tecnologías, pero el proyecto usa **Mongoose** directamente. ~~El README debe actualizarse.~~ ✅ README actualizado.

---

## 6. Modelos de Datos: proy.md vs Real

| Entidad (proy.md) | Modelo Real | Diferencias clave |
|---|---|---|
| Usuario | `User.js` | ✅ Coincide (3 roles) |
| Carrera | `Career.js` | ✅ Implementado (no en proy.md original, añadido después) |
| Curso | `Course.js` | ✅ + `assignedTeachers`, `minStudentsPerSection`, `career` ref |
| Docente | `Teacher.js` | ✅ + `contractType`, `freeDays`, `maxWeeklyHours` |
| Estudiante | `Student.js` | ✅ + `career` ref, `worksWhileStudying`, `preferredShift` |
| Aula | `Classroom.js` | ✅ + `availabilitySchedule`, `equipment`, `floor` |
| Matrícula | `Enrollment.js` | ✅ + `selectedSections`, `scheduleSnapshot` |
| Horario | `Schedule.js` | ✅ Coincide |
| Generación | `Generation.js` | ✅ + `alternatives`, `unsatisfiedConditions`, `scoringBreakdown`, `career` |
| **Sección** | `Section.js` | 🆕 No en proy.md, implementado para multi-sección |
| **Preferencia** | `Preference.js` | 🆕 No en proy.md, modelo detallado de disponibilidad |
| **Notificación** | `Notification.js` | 🆕 No en proy.md, sistema de alertas |
| **Política Inst.** | `InstitutionalPolicy.js` | 🆕 No en proy.md, motor de reglas institucionales |

---

## 7. Recomendaciones de Acción

### ✅ Eliminar archivos obsoletos
- [x] `evidencia_horario_completo.json`
- [x] `implementation_plan.md`
- [x] `analisis_validacion_problema.md`
- [x] `inspeccion02.md`
- [x] `package-lock.json` (raíz)

### ✅ Actualizar README.md
- [x] `ORM: Prisma 5+` → `ORM: Mongoose 8+`
- [x] Instrucciones de instalación corregidas (sin Prisma)
- [x] Tabla de restricciones CSP: RD-01 a RD-12 + RS-01
- [x] Diagrama de arquitectura actualizado (rutas, modelos, restricciones)

### 📝 Actualizar proy.md
El archivo `proy.md` debe actualizarse para reflejar:
1. El alcance real del PMV (no todo lo listado se implementará)
2. Los modelos adicionales (Section, Preference, Notification, InstitutionalPolicy)
3. La arquitectura real (Mongoose, no Prisma)
4. Las restricciones CSP reales (RD-01 a RD-12, no solo 6)
5. Las funcionalidades que quedaron fuera de alcance (correquisitos, multi-campus, ML, etc.)

### 🧹 En el código
No hay código muerto significativo. Todos los archivos en `backend/` y `frontend/` están activamente referenciados.

---

## 8. Estado Global del Proyecto

| Métrica | Valor |
|---|---|
| Modelos (backend) | 13 (User, Career, Course, Teacher, Student, Classroom, Enrollment, Schedule, Generation, Section, Preference, Notification, InstitutionalPolicy) |
| Controllers (backend) | 19 |
| Archivos de rutas API | 21 (+ health check) |
| Middleware personalizado | JWT auth, role-based access, errorHandler, rateLimit, validators |
| Motor CSP (restricciones) | 12 (RD-01 a RD-12) |
| Páginas/Vistas (frontend) | 26 |
| Componentes reutilizables | 11 (ScheduleGrid, ScheduleCell, Header, Sidebar, MainLayout, AlertPanel, DataTable, Modal, QualityChart, StatCard, ErrorBoundary) |
| Context providers | 1 (AuthContext) |
| Roles soportados | 3 (coordinador, docente, estudiante) |
| Cobertura de tests | 84.26% (Jest, solo backend) |
| Tests unitarios | 12/12 pasando |
| Tiempo de generación CSP | 0.597s (requisito: <30s) |
| Calidad del horario (scoring) | 89% |
| % de proy.md implementado | ~40% (funcionalidades core) |
| Funcionalidades adicionales (no en proy.md) | Secciones, políticas institucionales, scoring multi-solución con pesos, notificaciones, availabilitySchedule en aulas, CareerGeneration |
| Dependencias frontend | 11 (producción) + 7 (desarrollo) |
| Dependencias backend | 11 (producción) + 2 (desarrollo) |
