import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import Header from '../../components/layout/Header';
import { AuthProvider } from '../../context/AuthContext';

const renderHeader = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Header - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify({ id: '123', name: 'Test User', role: 'coordinador' }));
  });

  it('debe renderizar el campo de búsqueda', () => {
    renderHeader();
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('debe mostrar el botón de notificaciones', () => {
    renderHeader();
    expect(screen.getByTitle('Notificaciones')).toBeInTheDocument();
  });

  it('debe mostrar el botón de cerrar sesión', () => {
    renderHeader();
    expect(screen.getByTitle('Cerrar sesión')).toBeInTheDocument();
  });

  it('debe mostrar badge de notificaciones no leídas', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('debe navegar a /notifications al hacer clic en notificaciones', () => {
    renderHeader();
    fireEvent.click(screen.getByTitle('Notificaciones'));
  });

  it('debe navegar a /login al hacer clic en cerrar sesión', () => {
    renderHeader();
    fireEvent.click(screen.getByTitle('Cerrar sesión'));
  });
});
