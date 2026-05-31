# Spec.md - Especificación Formal del Sistema

**Feature:** Generación Óptima de Horarios Académicos  
**Versión:** 2.0.0  
**Fecha:** Mayo 2026  

---

## Entradas del Sistema

### 1. Entidades Base

| Entidad | Atributos | Formato |
|---------|-----------|---------|
| **Curso** | código, nombre, créditos (1-5), prerrequisitos (lista IDs), corequisitos (lista IDs), tipo (teórico/laboratorio), docente (ID), carrera (ID), semestre, dificultad (1-5), sessionsPerWeek, hoursPerSession, mandatory | texto, número, array de strings, string |
| **Estudiante** | nombre, email, código, carrera (ID), semestre_actual, cursos_aprobados (lista IDs + notas), preferredShift | texto, array de strings, string |
| **Docente** | nombre, email, disponibilidad (días/horas), días_libres, contractType (TC/PH), preferredShift, specializations (lista IDs de cursos), maxCourses, maxWeeklyHours | texto, objeto horario |
| **Aula** | código, nombre, capacidad (número), tipo (teórica/laboratorio/aula_virtual), availabilitySchedule, available | texto, número, string |

### 2. Configuración Horaria

| Parámetro | Valores |
|-----------|---------|
| Días laborables | lunes, martes, miércoles, jueves, viernes |
| Franjas totales | 5 días × 15 franjas = 75 franjas por semana |
| Franjas | `07:00-08:00`, `08:00-09:00`, ..., `21:00-22:00` (15 franjas de 1h) |
| Turnos | mañana (07:00-13:00), tarde (14:00-19:00), noche (19:00-22:00) |
| Bloque bloqueado | 13:00-14:00 (almuerzo, configurable vía `blockedTimeSlots`) |

### 3. Política Institucional (InstitutionalPolicy)

| Parámetro | Descripción |
|-----------|-------------|
| `allowedSchedule.startTime` | Hora de inicio de ventana institucional |
| `allowedSchedule.endTime` | Hora de fin de ventana institucional |
| `allowedSchedule.activeDays` | Días activos (ej: solo lunes-viernes) |
| `allowedSchedule.blockedTimeSlots` | Bloques prohibidos (ej: almuerzo 13:00-14:00) |
| `enrollmentRules.minCreditsPerSemester` | Mínimo créditos (default: 12) |
| `enrollmentRules.maxCreditsPerSemester` | Máximo créditos (default: 25) |
| `teacherLimits.maxCoursesFullTime` | Máx. cursos para TC |
| `teacherLimits.maxCoursesPartTime` | Máx. cursos para PH |
| `teacherLimits.maxContinuousHours` | Máx. horas continuas (default: 4) |
| `priorityWeights` | Pesos dinámicos para scoring (validez, institucional, preferencias, optimización) |

---

## Salidas del Sistema

### 1. Horario Semanal Institucional (Formato JSON)

```json
{
  "assignments": [
    {
      "courseId": { "_id": "...", "code": "CUR-101", "name": "Matemáticas" },
      "teacherId": { "_id": "...", "name": "Juan Pérez" },
      "classroomId": { "_id": "...", "code": "A-101" },
      "day": "lunes",
      "startTime": "08:00",
      "endTime": "09:00",
      "hoursPerSession": 1
    }
  ],
  "qualityScore": 92,
  "conflicts": [],
  "alternatives": [
    { "assignments": [...], "qualityScore": 85, "label": "Alternativa 1" }
  ]
}
```

### 2. Horario Personalizado del Estudiante

```json
{
  "student": { "name": "Jorge Lopez", "currentSemester": 3, "preferredShift": "tarde" },
  "schedule": { "assignments": [...] },
  "stats": {
    "totalCourses": 5,
    "totalCredits": 18,
    "shiftMatchPercent": 80,
    "uncoveredCourses": 0,
    "totalGaps": 2
  },
  "observations": [
    { "courseCode": "MAT-101", "message": "Asignado a martes 19:00 — fuera de su disponibilidad" }
  ],
  "alternatives": [
    { "label": "Horario turno Mañana", "assignments": [...], "score": 85 }
  ]
}