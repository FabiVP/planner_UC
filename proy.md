# SISTEMA INTELIGENTE DE PLANIFICACIÓN Y OPTIMIZACIÓN DE HORARIOS UNIVERSITARIOS

## DESCRIPCIÓN GENERAL

Desarrollar un sistema inteligente de planificación, simulación, generación y optimización de horarios universitarios conectado al sistema académico institucional mediante API, base de datos o sincronización automática.

El sistema debe trabajar con información real y actualizada de la universidad y dividirse en tres módulos principales:

* Modo Estudiante
* Modo Docente
* Modo Administrador (Coordinador)

El sistema debe diferenciar claramente entre:

* simulación académica (estudiante)
* planificación institucional (coordinador)
* visualización docente
* matrícula de secciones (estudiante elige secciones generadas)

El sistema NO realiza matrículas oficiales ni modifica directamente la información institucional sin autorización administrativa.

---

# MODO ESTUDIANTE

## Objetivo

Ayudar al estudiante a planificar, organizar y simular sus posibles horarios antes del proceso oficial de matrícula utilizando información real sincronizada desde el sistema universitario.

## Datos institucionales sincronizados

El sistema debe obtener automáticamente:

* carreras ✅
* planes curriculares
* mallas curriculares
* cursos ✅
* prerequisitos ✅
* correquisitos ✅
* historial académico ✅
* cursos aprobados ✅
* cursos desaprobados ✅
* cursos pendientes ✅
* cursos habilitados ✅
* secciones ✅
* docentes ✅
* aulas ✅
* campus/sedes ✅ (modelo Campus con edificios y horarios operativos)
* límites de créditos ✅
* restricciones institucionales ✅
* horarios oficiales ✅

## Flujo funcional

### 1. Inicio de sesión ✅

* autenticación mediante JWT con roles (estudiante, docente, coordinador)

### 2. Obtención automática de información académica ✅

* carrera (vinculada al modelo Student)
* ciclo actual (currentSemester)
* créditos acumulados (totalCreditsApproved)
* historial académico (approvedCourses con nota)
* cursos aprobados (grade >= 11)
* cursos desaprobados (grade < 11)
* cursos pendientes (no cursados, prerequisitos cumplidos)
* cursos habilitados para matrícula (filtrados por carrera + prerequisitos + horario institucional)

### 3. Dashboard académico ✅

Mostrar:

* cursos recomendados (categorizados: desaprobados, semestre actual, pendientes anteriores, bloqueados)
* créditos permitidos (máximo 22)
* estado académico (progreso porcentual)
* alertas de prerequisitos ✅
* posibles conflictos de horario ✅

### 4. Selección tentativa de cursos ✅

El estudiante podrá seleccionar cursos para simulación.

IMPORTANTE:

* NO realiza matrícula oficial
* NO reserva vacantes
* SOLO simula horarios
* Valida prerequisitos y créditos en tiempo real

### 5. Preferencias personalizadas ✅

Permitir configurar:

* disponibilidad por turno (mañana/tarde/noche × lun-sáb)
* disponibilidad detallada por franja horaria
* evitar clases antes de las 8am
* evitar huecos entre clases
* preferir menos días con clases
* agrupar clases consecutivas de la misma materia
* prioridad de objetivos (arrastrables)
* preferencia de turno (mañana/tarde/noche/indiferente)
* indicar si trabaja mientras estudia

### 6. Motor inteligente de generación de horarios ✅

Debe:

* filtrar cursos por carrera del estudiante
* filtrar solo cursos con docente asignado y horario institucional vigente
* generar horario óptimo + hasta 2 alternativas
* evitar cruces de horario dentro de la selección
* validar prerequisitos
* respetar restricciones institucionales
* considerar preferencia de turno
* priorizar cursos desaprobados (repitencia)

### Validaciones académicas ✅

* máximo 22 créditos (18 si > 2 desaprobados) ✅
* mínimo 12 créditos ✅
* validar prerequisitos aprobados (nota >= 11) ✅
* validar correquisitos simultáneos ✅
* análisis de dificultad de carga académica ✅
* créditos máximos ajustados por GPA ✅

IMPORTANTE:

El sistema NO controla cruces entre cursos de distintos ciclos porque eso depende de la decisión del estudiante.

La validación obligatoria es:

* NO debe haber cruces dentro de los cursos seleccionados

### 7. Matrícula por secciones ✅

El estudiante puede:

* ver secciones disponibles por curso (con horario, docente, aula, cupos)
* armar su horario seleccionando secciones
* ver conflictos de horario entre secciones en tiempo real
* confirmar matrícula con snapshot del horario

### 8. Visualización ✅

Interfaz tipo calendario semanal:

* lunes a sábado
* bloques horarios
* colores por curso
* teoría y laboratorio diferenciados
* conflictos visuales
* detalle al hacer clic en celda

### 9. Exportación ✅

Exportar en:

* PDF (jsPDF + jspdf-autotable)
* CSV/Excel (horarios, docentes, aulas, estudiantes) ✅

---

# MODO DOCENTE

## Objetivo

Ayudar a los docentes a visualizar, organizar y optimizar su carga académica respetando restricciones institucionales.

## Información sincronizada ✅

* docentes (nombre, email, tipo contrato)
* cursos asignados (especialidades)
* secciones
* horarios
* aulas
* disponibilidad (horaria + días libres)
* carga académica (horas semanales, cursos máximos)

## Flujo funcional

### 1. Inicio de sesión institucional ✅

### 2. Obtención automática de información ✅

* cursos asignados (specializations + assignedTeachers)
* carga horaria máxima (según contrato TC/PH)
* disponibilidad configurada
* turno preferido

### 3. Perfil docente ✅

Mostrar:

* información personal
* tipo de contrato (tiempo completo / por horas)
* horas semanales máximas
* cursos máximos
* turno preferido
* especialidades (cursos que puede dictar)

### 4. Registro de preferencias ✅

Permitir:

* disponibilidad por turno × día (matriz mañana/tarde/noche × lun-sáb)
* disponibilidad detallada por franja horaria
* preferencia de turno
* evitar exceso de clases consecutivas (maxContinuousHours en política)

## Restricciones implementadas ✅

### Docentes por horas (tiempo parcial)

* SE respetan estrictamente las preferencias horarias
* máximo 20 horas semanales
* máximo 2 cursos

### Docentes tiempo completo

* preferencias son referenciales
* la universidad puede priorizar necesidades institucionales
* máximo 40 horas semanales
* máximo 4 cursos

## Carga horaria docente ✅

Controlada por el modelo Teacher:

* contractType: 'tiempo_completo' | 'por_horas'
* maxWeeklyHours: auto-calculado según contrato
* maxCourses: auto-calculado según contrato

### 5. Visualización docente ✅

Mostrar:

* horario semanal (MySchedules)
* cursos por día
* teoría/laboratorio
* aulas
* horas diarias

### 6. Alertas ✅

* notificaciones del sistema (generaciones, conflictos, actualizaciones)

### 7. Restricciones ✅

El docente:

* NO modifica programación oficial
* SOLO registra preferencias de disponibilidad
* depende de aprobación administrativa

### 8. Exportaciones ✅

* PDF (reportes)
* CSV/Excel (exportación universal) ✅

---

# MODO ADMINISTRADOR (COORDINADOR)

## Objetivo

Generar automáticamente los horarios oficiales optimizados de toda la universidad.

## Información institucional ✅

El sistema maneja:

* carreras ✅
* cursos ✅
* ciclos (semestres) ✅
* secciones ✅ (generación automática por carrera)
* docentes ✅
* tipos de contrato (TC/PH) ✅
* aulas ✅
* laboratorios ✅
* aforo de aulas ✅
* proyección de estudiantes ✅ (básica)
* disponibilidad docente ✅
* políticas institucionales ✅

## Restricciones de aulas ✅

Validar:

* aforo (capacidad >= alumnos del curso)
* compatibilidad laboratorio/aula (tipo match)
* disponibilidad horaria por franja
* aulas virtuales permitidas (configurable en política)

## Proyección para apertura de cursos ✅

El sistema usa:

* cursos por carrera y semestre
* cantidad de docentes disponibles por curso
* déficit o cobertura docente

para:

* recomendar apertura de secciones
* calcular carga lectiva
* asignar docentes

## Tipos de docentes ✅

* tiempo completo
* por horas

## Restricciones laborales docentes ✅

Considerar:

* máximo de horas (según contrato)
* disponibilidad (horaria + días libres)
* bloques restringidos (policy.blockedTimeSlots)
* prioridad institucional
* horas continuas máximas

## Flujo administrativo

### 1. Inicio de sesión avanzado ✅

### 2. Dashboard institucional ✅

Mostrar:

* carreras activas
* total de cursos, docentes, aulas, estudiantes
* generaciones recientes
* conflictos detectados
* métricas de calidad

### 3. Configuración académica ✅ (InstitutionalPolicy)

* semestre activo
* horario permitido (startTime, endTime)
* días hábiles
* bloques bloqueados (almuerzo)
* turnos (mañana/tarde/noche)
* políticas de distribución de cursos

### 4. Configuración de restricciones ✅

* límites docentes (horas, cursos por tipo de contrato)
* capacidad de aulas
* horarios bloqueados
* tipo de aula estricto (lab solo para lab)
* distribución de sesiones (días no consecutivos)
* máximo sesiones por curso por día
* pesos de prioridad del motor CSP (configurable)

### 5. Motor inteligente institucional ✅

Debe:

* generar horarios institucionales (CSP con Backtracking + MRV + Forward Checking)
* asignar docentes (por especialidad)
* asignar aulas (por tipo y capacidad)
* generar múltiples soluciones (hasta 4 alternativas)
* evaluar con scoring multi-dimensional
* optimizar recursos
* minimizar conflictos
* equilibrar carga docente
* respetar contratos y disponibilidad
* considerar aforo
* timeout de 30 segundos

## RESTRICCIONES CSP IMPLEMENTADAS

| ID | Restricción | Tipo |
|---|---|---|
| RD-01 | No solapamiento de docente en misma franja | Dura |
| RD-02 | No solapamiento de aula en misma franja | Dura |
| RD-03 | No solapamiento de estudiante (mismo semestre/carrera) | Dura |
| RD-04 | Capacidad aula >= alumnos del curso (aforo) | Dura |
| RD-05 | Tipo de aula = tipo de curso | Dura |
| RD-06 | Disponibilidad del docente (horaria + días libres) | Dura |
| RD-07 | Disponibilidad del aula (por franjas) | Dura |
| RD-08 | Carga máxima docente (cursos + horas según TC/PH) | Dura |
| RD-09 | Horario dentro de ventana institucional | Dura |
| RD-10 | Máximo de horas continuas por docente | Dura |
| RD-11 | Distribución de sesiones en días diferentes | Blanda |
| RD-12 | Bloques horarios bloqueados (almuerzo) | Dura |
| RD-13 | Correquisitos simultáneos | Dura |
| RD-14 | Desempeño docente (prioridad de asignación) | Blanda |
| RS-01 | Preferencias de turno (docente/estudiante) | Blanda |

## PRIORIDAD PRINCIPAL

La optimización docente tiene mayor prioridad institucional.

Jerarquía: Institucional > Disponibilidad docente > Preferencia docente > Preferencia estudiante

### 6. Generación automática ✅

Permitir generar por:

* universidad completa ✅
* carrera ✅

### 7. Detección automática de conflictos ✅

Detectar:

* cruces docentes
* conflictos de aulas
* incompatibilidades de tipo
* exceso de horas
* problemas de aforo
* cursos sin docente asignado

### 8. Propuestas optimizadas ✅

Generar hasta 4 alternativas con:

* scoring multi-dimensional (validez, institucional, preferencias, optimización)
* breakdown visual de puntajes
* comparación de soluciones
* detección de condiciones no satisfechas

### 9. Visualización institucional ✅

Mostrar:

* horarios generados en grilla semanal
* detalle por asignación (curso, docente, aula, horario)
* métricas de calidad (gráfico circular)
* alertas y conflictos

### 10. Dashboard analítico ✅

Mostrar:

* estadísticas generales (cursos, docentes, aulas, generaciones)
* calidad de solución (restricciones cumplidas, preferencias, uso de recursos)
* historial de generaciones

### 11. Generación por carrera ✅

* vista de carreras con cursos por semestre
* análisis de demanda docente
* detección de déficit de cobertura
* generación automática de secciones

### 12. Funciones implementadas

* predicción de demanda docente ✅ (básica)
* recomendación de apertura de secciones ✅
* redistribución automática de carga ✅ (motor CSP)

### 13. Historial de generaciones ✅

* guardar cada generación con métricas completas
* ver historial paginado
* detalle de cada generación (alternativas, conflictos, scoring)

### 14. Exportaciones ✅

* PDF (jsPDF + jspdf-autotable)
* CSV/Excel (universal por tipo: schedule, teachers, classrooms, students) ✅
* reportes institucionales

### 15. Simulaciones ✅

* guardar horarios como simulaciones
* comparación lado a lado con métricas
* etiquetar y marcar favoritas
* disponible para estudiantes y docentes

### 16. Gestión de campus ✅

* CRUD de sedes universitarias
* edificios y pabellones por campus
* horarios operativos por sede
* vinculación de aulas a campus

### 17. Versionado de generaciones ✅

* restaurar generaciones previas
* eliminar generaciones obsoletas
* historial completo con métricas

---

# ARQUITECTURA MERN

## Frontend ✅

* React 19 + Vite 8 (SPA)
* react-router-dom v7
* Axios para API calls
* jsPDF para exportación
* react-icons para iconografía
* Diseño premium con glassmorphism, gradientes y micro-animaciones
* Sidebar dinámico por rol

## Backend ✅

* Node.js + Express 4
* MongoDB + Mongoose 8 (ODM)
* JWT + bcryptjs para autenticación
* mongodb-memory-server para desarrollo local
* Seed automático de datos de prueba
* Helmet + CORS + Morgan (seguridad y logging)

## Motor de horarios ✅

* Backtracking con ordenamiento dinámico de variables
* MRV (Minimum Remaining Values)
* Forward Checking (propagación de restricciones)
* Timeout de 30 segundos
* Generación de múltiples soluciones
* Scoring ponderado multi-dimensional
* Pesos configurables desde InstitutionalPolicy

## Modelos de datos

| Modelo | Descripción |
|---|---|
| User | Autenticación: email, password (bcrypt), role, career, semester |
| Career | Carrera académica: code, name, faculty, totalSemesters |
| Course | Curso: code, name, credits, type, semester, prerequisites, career, assignedTeachers |
| Teacher | Docente: name, contractType, specializations, availability, freeDays, maxWeeklyHours |
| Student | Estudiante: name, career, currentSemester, approvedCourses, preferredShift |
| Classroom | Aula: code, capacity, type, building, availabilitySchedule, equipment, campus |
| Enrollment | Matrícula: studentId, selectedCourses, selectedSections, scheduleSnapshot |
| Schedule | Horario generado: generationId, assignments |
| Generation | Registro de generación: scoring, alternativas, conflictos, career |
| Section | Sección de curso: courseId, teacherId, classroomId, scheduleSlots, enrollment |
| Preference | Preferencias de usuario: availability por turno/día, prioridades |
| Notification | Alertas del sistema: título, mensaje, tipo, categoría |
| InstitutionalPolicy | Reglas institucionales: horarios, límites docentes, pesos CSP |
| Simulation | Simulación: userId, name, label, assignments, stats, starred |
| Campus | Sede: code, name, address, city, operatingHours, buildings, travelTimes |

---

# OBJETIVO GENERAL DEL SISTEMA

Construir un sistema inteligente universitario capaz de:

* generar automáticamente horarios oficiales ✅
* optimizar recursos académicos ✅
* reducir conflictos ✅
* equilibrar carga docente y estudiantil ✅
* mejorar experiencia universitaria ✅
* permitir simulación estudiantil ✅
* permitir visualización docente ✅
* facilitar decisiones administrativas ✅
* usar datos reales institucionales ✅
* escalar a nivel universitario completo ✅ (multi-campus implementado)

---

# FUNCIONALIDADES FUERA DE ALCANCE (PMV v1.0.0)

Las siguientes funcionalidades de la visión completa NO están implementadas en el PMV actual:

* Aprendizaje automático basado en ciclos anteriores
* Calendarios institucionales exportables (iCal/Google)
* Generación por facultad independiente
* Ajustes manuales drag-and-drop en grilla
* Integración con sistema de notas en tiempo real
