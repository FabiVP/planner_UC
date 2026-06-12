import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { AuthProvider } from '../../context/AuthContext';

const mockApi = {
  get: vi.fn(),
};

vi.mock('../../api/axios', () => ({
  default: {
    get: (...args) => mockApi.get(...args),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const renderDashboard = (initialUser = null) => {
  if (initialUser) {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(initialUser));
  }
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Debe renderizar mensaje de bienvenida para coordinador', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: { courses: { total: 10, active: 8 }, teachers: { total: 5 }, classrooms: { total: 8, available: 6 }, generations: { total: 3 } } } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '1', name: 'Admin', email: 'admin@uni.edu', role: 'coordinador' });

    await waitFor(() => {
      expect(screen.getByText(/admin/i)).toBeInTheDocument();
    });
  });

  it('Debe mostrar estado de carga si hay error al cargar stats', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.reject({ response: { data: { message: 'Error de conexión' } } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '1', name: 'Admin', email: 'admin@uni.edu', role: 'coordinador' });

    await waitFor(() => {
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });
  });

  it('Debe mostrar stat cards para coordinador', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: { courses: { total: 10, active: 8 }, teachers: { total: 5 }, classrooms: { total: 8, available: 6 }, generations: { total: 3 } } } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '1', name: 'Admin', email: 'admin@uni.edu', role: 'coordinador' });

    await waitFor(() => {
      expect(screen.getByText('Asignaturas')).toBeInTheDocument();
      expect(screen.getByText('Docentes')).toBeInTheDocument();
      expect(screen.getByText('Aulas')).toBeInTheDocument();
      expect(screen.getByText('Generaciones')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('Debe mostrar mensaje sin horarios si no hay generaciones', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: { courses: { total: 0 }, teachers: { total: 0 }, classrooms: { total: 0 }, generations: { total: 0 } } } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '1', name: 'Admin', email: 'admin@uni.edu', role: 'coordinador' });

    await waitFor(() => {
      expect(screen.getByText('No hay horarios generados aún.')).toBeInTheDocument();
    });
  });

  it('Debe mostrar botón de "Generar horario" solo para coordinador', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: { courses: { total: 0 }, teachers: { total: 0 }, classrooms: { total: 0 }, generations: { total: 0 } } } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '1', name: 'Admin', email: 'admin@uni.edu', role: 'coordinador' });

    await waitFor(() => {
      expect(screen.getByText('Generar horario')).toBeInTheDocument();
    });
  });

  it('Debe mostrar botón "Matrícula" para estudiante', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: { courses: { total: 0 }, teachers: { total: 0 }, classrooms: { total: 0 }, generations: { total: 0 } } } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      if (url === '/student-schedule/eligible-courses') return Promise.resolve({ data: { academicProgress: { progressPercent: 50, coursesApproved: 10, coursesFailed: 1, totalCreditsApproved: 40 }, student: { career: { name: 'Ing. Sistemas' }, currentSemester: 5, gpa: 3.5 }, summary: { totalAvailable: 8, currentSemester: 5, failedToRetake: 1, previousPending: 2 } } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '2', name: 'Estudiante', email: 'est@uni.edu', role: 'estudiante' });

    await waitFor(() => {
      expect(screen.getByText('Matrícula')).toBeInTheDocument();
    });
  });

  it('Debe mostrar sección de estudiante con avance académico', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: {} } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      if (url === '/student-schedule/eligible-courses') return Promise.resolve({ data: { academicProgress: { progressPercent: 75, coursesApproved: 15, coursesFailed: 0, totalCreditsApproved: 60 }, student: { career: { name: 'Ing. Sistemas' }, currentSemester: 5, gpa: 3.8 }, summary: { totalAvailable: 8, currentSemester: 5, failedToRetake: 0, previousPending: 0 } } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '2', name: 'Estudiante', email: 'est@uni.edu', role: 'estudiante' });

    await waitFor(() => {
      expect(screen.getByText('Avance académico')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Cursos aprobados')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('Debe mostrar sección de docente con datos de perfil', async () => {
    mockApi.get.mockImplementation((url) => {
      if (url === '/dashboard/stats') return Promise.resolve({ data: { stats: {} } });
      if (url === '/notifications') return Promise.resolve({ data: { notifications: [] } });
      if (url === '/generations') return Promise.resolve({ data: { generations: [] } });
      if (url === '/teachers/my-profile') return Promise.resolve({ data: { summary: { contractLabel: 'Tiempo Completo', maxWeeklyHours: 40, totalSpecializations: 3, availableDays: 5, freeDaysCount: 2 } } });
      if (url === '/schedule/my-teaching') return Promise.resolve({ data: { stats: { totalCourses: 4, totalHours: 32, loadPercent: 80 } } });
      return Promise.reject(new Error('not found'));
    });

    renderDashboard({ _id: '3', name: 'Docente', email: 'doc@uni.edu', role: 'docente' });

    await waitFor(() => {
      expect(screen.getByText('Mi perfil docente')).toBeInTheDocument();
      expect(screen.getByText('Contrato')).toBeInTheDocument();
      expect(screen.getByText('Cursos asignados')).toBeInTheDocument();
    });
  });
});
