/**
 * Application-wide constants for UniScheduler frontend.
 */

// Days of the week (matching backend DAYS)
export const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
export const DAYS_DISPLAY = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Time slots
export const TIME_SLOTS = [
  { start: '08:00', end: '09:00', label: '08:00 - 09:00' },
  { start: '09:00', end: '10:00', label: '09:00 - 10:00' },
  { start: '10:00', end: '11:00', label: '10:00 - 11:00' },
  { start: '11:00', end: '12:00', label: '11:00 - 12:00' },
  { start: '12:00', end: '13:00', label: '12:00 - 13:00' },
  { start: '13:00', end: '14:00', label: '13:00 - 14:00' },
];

// User roles
export const ROLES = {
  COORDINADOR: 'coordinador',
  DOCENTE: 'docente',
  ESTUDIANTE: 'estudiante',
};

// Course types
export const COURSE_TYPES = {
  TEORICO: 'teorico',
  LABORATORIO: 'laboratorio',
};

// Generation statuses
export const GENERATION_STATUS = {
  PENDIENTE: 'pendiente',
  EJECUTANDO: 'ejecutando',
  COMPLETADA: 'completada',
  FALLIDA: 'fallida',
};

// Schedule color palette for courses
export const SCHEDULE_COLORS = [
  'var(--sched-blue)',
  'var(--sched-green)',
  'var(--sched-purple)',
  'var(--sched-orange)',
  'var(--sched-red)',
  'var(--sched-teal)',
  'var(--sched-pink)',
  'var(--sched-indigo)',
];

// Semester options
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const currentSemesterLabel = month >= 8 ? 'II' : 'I';
export const CURRENT_SEMESTER = `${year}-${currentSemesterLabel}`;
export const CURRENT_SEMESTER_DASH = `${year}-${currentSemesterLabel === 'I' ? '1' : '2'}`;
const prevYear = year - 1;
export const SEMESTERS = [
  `${prevYear}-I`, `${prevYear}-II`,
  `${year}-I`, `${year}-II`,
  `${year + 1}-I`,
];

// Credit limits
export const CREDITS = {
  MIN: 20,
  MAX: 22,
};

// CSP constraint labels (for display in UI)
export const CONSTRAINTS = [
  { id: 'RD-01', label: 'No solapamiento de docente', active: true },
  { id: 'RD-02', label: 'No solapamiento de aula', active: true },
  { id: 'RD-03', label: 'No solapamiento de estudiante', active: true },
  { id: 'RD-04', label: 'Límite de créditos (20-22)', active: true },
  { id: 'RD-05', label: 'Prerrequisitos aprobados', active: true },
  { id: 'RD-06', label: 'Tipo de infraestructura', active: true },
];

// API base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
