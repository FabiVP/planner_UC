import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { AuthProvider } from '../../context/AuthContext';

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('LoginPage - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el formulario con campos email y password', () => {
    renderLogin();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debe mostrar el título y subtítulo', () => {
    renderLogin();
    expect(screen.getByText('UniScheduler')).toBeInTheDocument();
    expect(screen.getByText('Sistema Inteligente de Generación de Horarios')).toBeInTheDocument();
  });

  it('debe mostrar botones de acceso rápido para los 3 roles', () => {
    renderLogin();
    expect(screen.getByText('Coordinador')).toBeInTheDocument();
    expect(screen.getByText('Docente')).toBeInTheDocument();
    expect(screen.getByText('Estudiante')).toBeInTheDocument();
  });

  it('debe llenar campos al hacer clic en acceso rápido', async () => {
    renderLogin();
    await userEvent.click(screen.getByText('Coordinador'));
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('admin@uni.edu');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('admin123');
  });

  it('debe mostrar spinner y deshabilitar botón durante el envío', async () => {
    renderLogin();
    const btn = screen.getByRole('button', { name: /iniciar sesión/i });
    const email = screen.getByLabelText('Correo electrónico');
    const pass = screen.getByLabelText('Contraseña');
    fireEvent.change(email, { target: { value: 'admin@uni.edu' } });
    fireEvent.change(pass, { target: { value: 'admin123' } });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de error con credenciales inválidas', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas.')).toBeInTheDocument();
    });
  });

  it('debe limpiar error al re-enviar formulario', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas.')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(screen.queryByText('Credenciales inválidas.')).not.toBeInTheDocument();
  });
});
