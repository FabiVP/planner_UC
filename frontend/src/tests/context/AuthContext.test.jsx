import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';

const TestComponent = () => {
  const { user, isAuthenticated, role, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Autenticado' : 'No autenticado'}</span>
      <span data-testid="user-role">{role || 'sin-rol'}</span>
      {user && <span data-testid="user-name">{user.name}</span>}
      <button onClick={() => login('test@test.com', 'pass')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const mockApi = {
  post: vi.fn(),
};

vi.mock('../../api/axios', () => ({
  default: {
    post: (...args) => mockApi.post(...args),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Debe iniciar con estado no autenticado', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe('No autenticado');
  });

  it('Debe autenticar usuario al hacer login', async () => {
    mockApi.post.mockResolvedValue({
      data: {
        token: 'token-123',
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'coordinador' },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Autenticado');
    });
    expect(screen.getByTestId('user-name').textContent).toBe('Test User');
    expect(screen.getByTestId('user-role').textContent).toBe('coordinador');
  });

  it('Debe cerrar sesión al llamar logout', async () => {
    mockApi.post.mockResolvedValue({
      data: {
        token: 'token-123',
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'coordinador' },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Autenticado');
    });

    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('auth-status').textContent).toBe('No autenticado');
    expect(screen.getByTestId('user-role').textContent).toBe('sin-rol');
  });
});
