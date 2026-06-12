import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { AuthProvider } from '../../context/AuthContext';

const renderSidebar = (role) => {
  const user = { id: '1', name: 'Test User', email: 'test@test.com', role };
  localStorage.setItem('token', 'mock-token');
  localStorage.setItem('user', JSON.stringify(user));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Sidebar - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe mostrar el logo y nombre de la app', () => {
    renderSidebar('coordinador');
    expect(screen.getByText('UniScheduler')).toBeInTheDocument();
  });

  it('debe mostrar enlace de Inicio para todos los roles', () => {
    renderSidebar('coordinador');
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('debe mostrar enlaces de coordinador para rol coordinador', () => {
    renderSidebar('coordinador');
    expect(screen.getByText('Planificación')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
    expect(screen.getByText('Carreras')).toBeInTheDocument();
    expect(screen.getByText('Asignaturas')).toBeInTheDocument();
    expect(screen.getByText('Docentes')).toBeInTheDocument();
    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Aulas')).toBeInTheDocument();
    expect(screen.getByText('Campus / Sedes')).toBeInTheDocument();
  });

  it('debe mostrar enlaces de docente para rol docente', () => {
    renderSidebar('docente');
    expect(screen.getByText('Mi perfil docente')).toBeInTheDocument();
    expect(screen.getByText('Mi horario')).toBeInTheDocument();
    expect(screen.getByText('Restricciones')).toBeInTheDocument();
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.queryByText('Carreras')).not.toBeInTheDocument();
    expect(screen.queryByText('Asignaturas')).not.toBeInTheDocument();
  });

  it('debe mostrar enlaces de estudiante para rol estudiante', () => {
    renderSidebar('estudiante');
    expect(screen.getByText('Planificar horario')).toBeInTheDocument();
    expect(screen.getByText('Mi horario')).toBeInTheDocument();
    expect(screen.getByText('Simulaciones')).toBeInTheDocument();
    expect(screen.getByText('Preferencias')).toBeInTheDocument();
    expect(screen.queryByText('Docentes')).not.toBeInTheDocument();
    expect(screen.queryByText('Aulas')).not.toBeInTheDocument();
  });

  it('debe mostrar la información del usuario en el footer', () => {
    renderSidebar('coordinador');
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Coordinador')).toBeInTheDocument();
  });

  it('debe mostrar el rol correcto en el footer', () => {
    renderSidebar('estudiante');
    expect(screen.getByText('Estudiante')).toBeInTheDocument();
  });

  it('debe mostrar divisores de sección para coordinador', () => {
    renderSidebar('coordinador');
    expect(screen.getByText('Administración')).toBeInTheDocument();
    expect(screen.getByText('Preferencias')).toBeInTheDocument();
  });

  it('debe mostrar enlaces de navegación adicionales para coordinador', () => {
    renderSidebar('coordinador');
    expect(screen.getByText('Generar Horarios')).toBeInTheDocument();
    expect(screen.getByText('Políticas Institucionales')).toBeInTheDocument();
    expect(screen.getByText('Pref. Docentes')).toBeInTheDocument();
    expect(screen.getByText('Pref. Estudiantes')).toBeInTheDocument();
  });
});
